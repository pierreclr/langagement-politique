#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Double majorité (citoyens et pays) pour une consultation non officielle. Cahier T57-4, § 4.

Fonctions pures. Usage : python3 double_majorite.py  (exécute l'exemple factice et les contrôles).

Entrées par pays : population adulte de référence (poids), votes « oui » et « non » vérifiés.
Trois lectures, toujours publiées ensemble :
  brut      : oui / (oui + non) sur tous les votes (dominé par les pays très participants) ;
  projete   : somme des poids pays x part de oui du pays, sur les pays représentés (corrige
              l'écart de participation entre pays, pas l'auto-sélection à l'intérieur d'un pays) ;
  pays      : nombre de pays représentés où le oui l'emporte.
Un pays est « représenté » s'il atteint un minimum de votes vérifiés (seuil_votes).
"""

from fractions import Fraction


def pays_representes(pays, seuil_votes):
    return {k: v for k, v in pays.items() if v["oui"] + v["non"] >= seuil_votes}


def part_oui(v):
    exprimes = v["oui"] + v["non"]
    return Fraction(v["oui"], exprimes) if exprimes else None


def brut(pays):
    oui = sum(v["oui"] for v in pays.values())
    tot = sum(v["oui"] + v["non"] for v in pays.values())
    return Fraction(oui, tot) if tot else None


def projete(pays_repr):
    poids = sum(v["poids"] for v in pays_repr.values())
    if not poids:
        return None
    return sum(Fraction(v["poids"]) * part_oui(v) for v in pays_repr.values()) / poids


def couverture(pays, pays_repr):
    """Part de la population de référence vivant dans un pays représenté."""
    return Fraction(sum(v["poids"] for v in pays_repr.values()), sum(v["poids"] for v in pays.values()))


def resultat(pays, seuil_votes, seuil_citoyens=Fraction(1, 2), seuil_pays=Fraction(1, 2)):
    """Résumé d'une question oui/non. Le seuil est un paramètre, jamais une valeur cachée."""
    rep = pays_representes(pays, seuil_votes)
    n_oui = sum(1 for v in rep.values() if part_oui(v) > Fraction(1, 2))
    p = projete(rep)
    part_pays = Fraction(n_oui, len(rep)) if rep else None
    return {
        "brut": brut(pays), "projete": p,
        "pays_representes": len(rep), "pays_total": len(pays),
        "pays_oui": n_oui, "part_pays_oui": part_pays,
        "couverture": couverture(pays, rep) if rep else Fraction(0),
        "double_majorite": bool(rep) and p > seuil_citoyens and part_pays > seuil_pays,
    }


def majorite_qualifiee_conseil(populations, favorables):
    """Règle du Conseil (art. 16 § 4 TUE) : >= 55 % des États, >= 15, >= 65 % de la population."""
    n, pop = len(populations), sum(populations.values())
    pour = [e for e in populations if e in favorables]
    return (len(pour) >= 15 and Fraction(len(pour), n) >= Fraction(55, 100)
            and Fraction(sum(populations[e] for e in pour), pop) >= Fraction(65, 100))


if __name__ == "__main__":
    # Exemple FACTICE : pays A, B, C, D, E ; aucune donnée réelle, aucune question réelle.
    ex = {
        "A": {"poids": 60_000_000, "oui": 50_000, "non": 20_000},   # grand pays, très participant, oui 71 %
        "B": {"poids": 40_000_000, "oui": 1_000, "non": 3_000},     # participation faible, non 75 %
        "C": {"poids": 5_000_000, "oui": 600, "non": 400},          # petit pays, oui 60 %
        "D": {"poids": 3_000_000, "oui": 30, "non": 10},            # sous le seuil : non représenté
        "E": {"poids": 2_000_000, "oui": 200, "non": 800},          # non 80 %
    }
    r = resultat(ex, seuil_votes=500)
    print({k: (float(v) if isinstance(v, Fraction) else v) for k, v in r.items()})
    assert round(float(r["brut"]), 3) == 0.682  # 51 830 / 76 040 : le pays A fournit 96 % des votes oui
    assert r["pays_representes"] == 4 and r["pays_oui"] == 2
    assert round(float(r["projete"]), 3) == 0.526  # pondéré par la population des pays représentés
    assert r["part_pays_oui"] == Fraction(1, 2)
    assert r["double_majorite"] is False  # citoyens : oui ; pays : 2 sur 4, pas plus de la moitié
    # Chiffres réels, Eurostat demo_pjan, 01/01/2025 : DE 83 577 140 ; FR 68 882 600 ; UE-27 450 646 971.
    de_fr = Fraction(83_577_140 + 68_882_600, 450_646_971)
    print("Allemagne + France =", round(float(de_fr) * 100, 2), "% de la population de l'UE-27 (blocage : 35 %)")
    assert de_fr < Fraction(35, 100)
    print("OK")
