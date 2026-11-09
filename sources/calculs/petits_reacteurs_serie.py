# -*- coding: utf-8 -*-
"""Nombre d'unités pour qu'un petit réacteur rattrape le coût par kW d'un grand réacteur.

Hypothèses (Claude, 05/11/2026), pas des prédictions :
- loi d'échelle des coûts : coût par kW proportionnel à (puissance)^(-0,4)  (exposant 0,6 sur le coût total) ;
- courbe d'apprentissage : coût de l'unité n = coût de l'unité 1 * n^(log2(1 - taux)) ;
- taux d'apprentissage par doublement du cumul : 5 % (prudent), 10 %, 15 % (haut INL), 20 %.
Les taux observés dans la littérature vont de 2 à 15 % selon les cas (voir sources/petits-reacteurs-france.md).
"""
import math


def prime_de_petite_taille(puissance_petit_mw, puissance_grand_mw, exposant_cout=0.6):
    """Surcoût par kW du petit réacteur (tête de série) par rapport au grand."""
    return (puissance_grand_mw / puissance_petit_mw) ** (1 - exposant_cout)


def facteur_apprentissage(n, taux):
    """Coût de la n-ième unité rapporté à la première."""
    return n ** math.log2(1 - taux)


def unites_pour_parite(prime, taux):
    """Plus petit n tel que prime * facteur(n) <= 1 (marginal) ; None si taux nul."""
    if taux <= 0:
        return None
    return math.ceil(prime ** (1 / -math.log2(1 - taux)))


def cout_moyen_cumule(n, taux):
    """Coût moyen des n premières unités (première = 1)."""
    return sum(facteur_apprentissage(k, taux) for k in range(1, n + 1)) / n


if __name__ == "__main__":
    # exemples : 150 MWe contre 1 650 MWe (EPR2) ; 60 MWe contre 1 650 MWe
    for petit in (400, 150, 60):
        prime = prime_de_petite_taille(petit, 1650)
        print(f"\nPetit {petit} MWe contre EPR2 1650 MWe : prime tête de série x{prime:.2f}")
        for taux in (0.05, 0.10, 0.15, 0.20):
            n = unites_pour_parite(prime, taux)
            print(f"  taux {taux:.0%} : parité (unité marginale) à n = {n}")
    print("\nFacteur de coût de la n-ième unité, taux 15 % :",
          {n: round(facteur_apprentissage(n, 0.15), 2) for n in (2, 8, 16, 32, 64)})

    # tests
    assert abs(facteur_apprentissage(2, 0.15) - 0.85) < 1e-12
    assert abs(facteur_apprentissage(8, 0.15) - 0.85 ** 3) < 1e-12
    assert abs(prime_de_petite_taille(165, 1650) - 10 ** 0.4) < 1e-12
    assert unites_pour_parite(2.0, 0.15) == 20  # prime x2, 15 % : 20 unités
    assert unites_pour_parite(2.0, 0.20) < unites_pour_parite(2.0, 0.10)
    assert facteur_apprentissage(unites_pour_parite(2.0, 0.15), 0.15) * 2.0 <= 1
    print("tests ok")
