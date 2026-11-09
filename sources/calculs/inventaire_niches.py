#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controle de sources/inventaire-niches-fiscales.csv (dépenses fiscales, PLF 2026, Voies et moyens tome II).

Vérifie : 465 fiches ; totaux 2024 / 2025 / 2026 égaux à ceux du tome II (p. 16) ;
totaux par impôt ; sommes par statut (a) à (e) ; puis calcule les options de la section « dons »
de sources/niches-orientation-riches.md (fonctions pures, hypothèses en tête).
Usage : python3 sources/calculs/inventaire_niches.py
Règle de totalisation (retrouvée, exacte à 1 M€) : « nc » = valeur de l'année précédente reprise ; « ε » et « - » = 0.
"""
import csv, os, sys
from math import erf, sqrt, log

CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'inventaire-niches-fiscales.csv')

OFFICIEL_TOTAL = (89406, 91834, 88269)           # tome II p. 16, M€
OFFICIEL_IMPOT = {                               # tome II p. 16, M€ (2024, 2025, 2026)
    'IR': (42079, 43980, 41298),
    'IR et IS': (14111, 14558, 14418),
    'IS': (3913, 4445, 3711),
    'IFI': (205, 218, 221),
    'Retenues à la source': (5, 0, 0),
    'Enregistrement, timbre et urbanisme': (5478, 4478, 4478),
    'TVA': (10920, 11005, 12366),
    'Accise énergie (produits)': (6307, 6669, 5824),
    'Accise électricité': (763, 1275, 1069),
    'Accise gaz naturels': (802, 962, 641),
    'Accise charbons': (16, 11, 8),
    'Autres droits': (3367, 2713, 2719),
    'CVAE': (10, 10, 7),
    'Taxe foncière bâti': (648, 677, 677),
    'Taxe foncière non bâti': (408, 407, 457),
    "Taxe d'habitation": (33, 51, 0),
    'CFE': (341, 375, 375),
}
STATUTS = 'abcde'
LIBELLE = {'a': 'disparaît avec l\'impôt supprimé, compté',
           'b': 'disparaît implicitement, sans décision ni chiffrage',
           'c': 'explicitement supprimé (ou modifié) et compté',
           'd': 'maintenu',
           'e': 'sur un impôt maintenu, non décidé'}

def charger():
    with open(CSV, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        for k in ('cout_2024_meur', 'cout_2025_meur', 'cout_2026_meur'):
            r[k] = int(r[k])
    return rows

def regroupe(imp):
    return 'Enregistrement, timbre et urbanisme' if imp in ('Enregistrement et timbre', "Taxes d'urbanisme") else imp

def controles(rows):
    assert len(rows) == 465, len(rows)
    assert len({r['numero'] for r in rows}) == 465
    for i, a in enumerate(('cout_2024_meur', 'cout_2025_meur', 'cout_2026_meur')):
        assert sum(r[a] for r in rows) == OFFICIEL_TOTAL[i], (a, sum(r[a] for r in rows))
    par = {}
    for r in rows:
        v = par.setdefault(regroupe(r['impot']), [0, 0, 0])
        for i, a in enumerate(('cout_2024_meur', 'cout_2025_meur', 'cout_2026_meur')):
            v[i] += r[a]
    for k, v in OFFICIEL_IMPOT.items():
        assert tuple(par[k]) == v, (k, par[k], v)
    assert set(par) == set(OFFICIEL_IMPOT), set(par) ^ set(OFFICIEL_IMPOT)
    assert all(r['statut_modele'] in STATUTS for r in rows)
    return par

def par_statut(rows):
    s = {k: [0, 0, 0, 0] for k in STATUTS}
    for r in rows:
        a = s[r['statut_modele']]
        a[0] += 1
        for i, c in enumerate(('cout_2024_meur', 'cout_2025_meur', 'cout_2026_meur')):
            a[i + 1] += r[c]
    assert sum(v[0] for v in s.values()) == 465
    for i in range(3):
        assert sum(v[i + 1] for v in s.values()) == OFFICIEL_TOTAL[i]
    return s

# ---------- Options dons (sources/niches-orientation-riches.md, section 5) ----------
# Entrées sourcées : DGFiP Statistiques n° 06 (janv. 2024) : dons déclarés à l'IR par les particuliers 3,3 Md€ en 2021,
# réductions correspondantes 1,7 Md€, don moyen 585 €. Hypothèses de Claude (⚠️) : gifts log-normaux d'écart-type
# sigma sur le log (non observé), élasticité-prix constante e (littérature : petite, croissante avec le don).
D, R, MOY = 3.3, 1.7, 0.585            # Md€, Md€, k€
PRIX0 = 1 - R / D                       # prix net d'un euro donné aujourd'hui (taux effectif de réduction 51,5 %)

def phi(x):
    return 0.5 * (1 + erf(x / sqrt(2)))

def moments(sigma, plafond=1.0):
    """E[min(g, plafond)] et E[(g - plafond)+] pour g log-normal de moyenne MOY (k€)."""
    mu = log(MOY) - sigma ** 2 / 2
    d1 = (log(plafond) - mu - sigma ** 2) / sigma
    d2 = (log(plafond) - mu) / sigma
    eb = MOY * phi(d1) + plafond * (1 - phi(d2))
    return eb, MOY - eb

def option_i(e):
    """Supprimer sans relais : dons restants et perte pour les associations (Md€/an, base 2021). Coût budgétaire : 0 (déjà dans P03)."""
    f = (1 / PRIX0) ** e
    return D * f, D * (1 - f)

def option_ii(e, sigma=1.0, taux=0.75, plafond=1.0):
    """Crédit remboursable, taux sur les dons jusqu'au plafond (k€), identique pour tous : (dons versés, coût Md€)."""
    n = D / MOY
    eb, ea = moments(sigma, plafond)
    din = n * eb * ((1 - taux) / PRIX0) ** e
    dout = n * ea * (1 / PRIX0) ** e
    return din + dout, taux * din

def option_iii(e, sigma=1.0, m=0.5, plafond=1.0):
    """Abondement public m sur les dons jusqu'au plafond, sans réduction : (dons reçus par les associations, coût Md€)."""
    n = D / MOY
    eb, ea = moments(sigma, plafond)
    din = n * eb * ((1 / (1 + m)) / PRIX0) ** e
    dout = n * ea * (1 / PRIX0) ** e
    return (1 + m) * din + dout, m * din

def main():
    rows = charger()
    par = controles(rows)
    print('465 fiches ; totaux 2024/2025/2026 = %s M€ : contrôle égal au tome II' % (OFFICIEL_TOTAL,))
    s = par_statut(rows)
    for k in STATUTS:
        print('(%s) %-58s %3d fiches  2024 %6d  2025 %6d  2026 %6d M€' % (k, LIBELLE[k], *s[k]))
    # options dons
    assert abs(PRIX0 - 0.4848) < 1e-3
    for e in (-0.2, -0.5, -1.0):
        r_i = option_i(e)
        r_ii = option_ii(e)
        r_iii = option_iii(e)
        print('e=%.1f | (i) dons %.2f perte %.2f | (ii) dons %.2f coût %.2f | (iii) reçu %.2f coût %.2f' % (e, *r_i, *r_ii, *r_iii))
    assert option_i(-1.0)[0] < option_i(-0.2)[0]
    assert 1.8 < option_ii(-0.2)[1] < 2.5 and 3.0 < option_ii(-1.0)[1] < 4.2
    print('OK')

if __name__ == '__main__':
    main()
