# -*- coding: utf-8 -*-
"""Tests du modèle d'érosion du capital. Lancer : python3 -m pytest modeles/erosion-capital/tests -q"""
import math
import os
import sys
from dataclasses import replace

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "code"))
import erosion as E  # noqa: E402

P = E.SCENARIOS["central"]
SANS = E.REGIMES["sans_impot"]


def proche(a, b, tol=1e-9):
    return abs(a - b) <= tol * max(1.0, abs(b))


def test_bareme_777_recoupe_cumul_patrimoine_js():
    # Même cas que modeles/systeme-ideal/test_cumul_patrimoine.js : 2 M€ reçus (après abattement)
    attendu = (8072 * 0.05 + (12109 - 8072) * 0.10 + (15932 - 12109) * 0.15 + 0.20 * (552324 - 15932)
               + 0.30 * (902838 - 552324) + 0.40 * (1805677 - 902838) + 0.45 * (2000000 - 1805677))
    assert proche(E.bareme_progressif(2_000_000), attendu)


def test_abattement_et_marginal_45():
    assert E.droits_droit_commun(100_000) == 0
    assert proche(E.droits_droit_commun(10e6) - E.droits_droit_commun(9e6), 0.45 * 1e6)


def test_dutreil_taux_marginal_5_6_pct_rapport_an_3056():
    # Dutreil (75 %) + réduction de 50 % : marginal 45 % x 25 % x 50 % = 5,625 % (rapport AN n° 3056 : 5,6 %)
    d1 = E.droits_dutreil(1e9, 1.0, reduction_790=True)
    d2 = E.droits_dutreil(1e9 + 1e6, 1.0, reduction_790=True)
    assert proche((d2 - d1) / 1e6, 0.05625, 1e-6)
    assert proche((E.droits_dutreil(1e9 + 1e6, 1.0) - E.droits_dutreil(1e9, 1.0)) / 1e6, 0.1125, 1e-6)


def test_dutreil_sans_titres_eligibles_egale_droit_commun():
    assert proche(E.droits_dutreil(5e6, 0.0), E.droits_droit_commun(5e6))


def test_fonction_transmissions_recoupe_systeme_0811():
    # Valeurs vérifiées dans modeles/systeme-ideal/fonctions_csv_0811.py
    assert round(E.droits_systeme(500000)) == 45069
    assert round(E.droits_systeme(1e6)) == 246028
    assert round(E.droits_systeme(1e7)) == 4620752
    assert E.droits_systeme(300000) == 0


def test_fonction_transmissions_identique_au_fichier_du_systeme_si_present():
    chemin = os.path.join(ICI, "..", "..", "systeme-ideal")
    if not os.path.exists(os.path.join(chemin, "fonctions_csv_0811.py")):
        return
    sys.path.insert(0, chemin)
    import fonctions_csv_0811 as F
    for c in (3e5, 4e5, 1e6, 2.4e10):
        assert proche(E.droits_systeme(c), F.contribution_transmissions(c), 1e-9)
        assert proche(E.taux_moyen_patrimoine_systeme(c) * c, F.contribution_patrimoine(c), 1e-9)


def test_partage_seul_divise_par_le_nombre_de_descendants():
    neutre = replace(P, r=0.0, c=0.0, p_declin=0.0, enfants_g1=5, enfants_suite=2)
    res = E.simuler(1e9, 4, SANS, neutre)
    assert [round(x["descendants"]) for x in res] == [5, 10, 20, 40]
    for x in res:
        assert proche(x["part_famille"], 1.0)
        assert proche(x["part_descendant"], 1 / x["descendants"])


def test_croissance_sans_impot_ni_declin():
    q = replace(P, c=0.0, p_declin=0.0, enfants_g1=1, enfants_suite=1)
    res = E.simuler(1.0, 3, SANS, q)
    assert proche(res[2]["part_descendant"], (1 + q.r) ** 60, 1e-9)


def test_esperance_du_declin_exacte():
    q = replace(P, r=0.0, c=0.0, enfants_g1=1, enfants_suite=1)
    res = E.simuler(1.0, 3, SANS, q)
    attendu = (1 - q.p_declin * q.perte_declin * q.part_entreprise) ** 2
    assert proche(res[2]["part_descendant"], attendu)


def test_ordre_des_regimes_au_central():
    q = replace(P, enfants_g1=5)
    g4 = {k: E.simuler(121.2e9, 4, reg, q)[-1]["part_descendant"] for k, reg in E.REGIMES.items()}
    assert g4["sans_impot"] > g4["actuel_dutreil_790"] > g4["actuel_dutreil"] > g4["actuel_commun"]
    assert g4["actuel_commun"] > g4["systeme_transmissions"] > g4["systeme_complet"]


def test_retrait_brut_et_prelevement_systeme():
    q = replace(P, r=0.0, c=0.01, duree_generation=1)
    reg = E.REGIMES["systeme_complet"]
    w = 1e9
    attendu = w - w * 0.01 / (1 - 0.6515) - 0.03 * w * w / (w + 4e5)
    assert proche(E.vie_une_generation(w, reg, q), attendu)


def test_usa_impot_sur_la_succession_avant_partage():
    reg = E.REGIMES["usa_simplifie"]
    assert proche(E.part_nette_enfant(113e6, 2, reg, P), (113e6 - 0.4 * 100e6) / 2)


def test_fonctions_pures_parametres_inchanges():
    avant = repr(P)
    E.simuler(1e9, 5, E.REGIMES["actuel_dutreil"], P)
    assert repr(P) == avant
    assert E.simuler(1e9, 5, E.REGIMES["actuel_dutreil"], P) == E.simuler(1e9, 5, E.REGIMES["actuel_dutreil"], P)


def test_probabilites_somment_a_un():
    total = sum(math.prod(P.p_declin if d else 1 - P.p_declin for d in ch)
                for ch in __import__("itertools").product((False, True), repeat=5))
    assert proche(total, 1.0)
