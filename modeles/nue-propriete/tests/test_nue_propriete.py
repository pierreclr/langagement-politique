# -*- coding: utf-8 -*-
"""Tests du modèle « nue-propriété » (T82). Lancer : python3 -m pytest modeles/nue-propriete/tests -q -p no:cacheprovider"""
import json
import os
import sys
from dataclasses import replace

ICI = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(ICI, "..", "code"))
import nue_propriete as N  # noqa: E402

with open(os.path.join(ICI, "..", "donnees", "v75_tranches.json"), encoding="utf-8") as f:
    V75 = json.load(f)
P = N.Parametres(lignees_par_tranche=300)
TR = N.tranches_depuis_v75(V75)
LIG = N.tirer_lignees(TR, P)


def sim(**kw):
    return N.simuler(TR, replace(P, **kw), LIG)


def test_fonction_du_patrimoine_recoupe_le_chapitre_3():
    # chapitre 3 : 600 € à 100 000 €, 21 429 € à 1 M€, 2 988 048 € à 100 M€
    assert round(N.p_courbe(1e5)) == 600
    assert round(N.p_courbe(1e6)) == 21429
    assert round(N.p_courbe(1e8)) == 2988048


def test_bareme_669():
    assert N.usufruit(20) == 0.9 and N.usufruit(21) == 0.8 and N.usufruit(55) == 0.5
    assert N.usufruit(75) == 0.3 and N.usufruit(85) == 0.2 and N.usufruit(95) == 0.1


def test_mortalite_calee():
    a = N.calibrer_gompertz(21.6)
    assert abs(N.esperance_a(65, a) - 21.6) < 0.05
    q70, q85 = N.q_menage(70, a, 0.6), N.q_menage(85, a, 0.6)
    assert 0 < q70 < q85 < 1
    assert N.q_menage(80, a, 0.6) < N.q_menage(80, a, 0.0)   # le dernier survivant d'un couple vit plus longtemps


def test_calage_sur_la_v75():
    du = sum(t.n * t.echelle * N.p_courbe(t.w) * P.ratio_comportement for t in TR) / 1e9
    assert abs(du - 45.05) < 0.1            # 45,24 Md€ de la v7.5 moins 0,2 Md€ sous 500 000 €
    assert abs(sum(t.n for t in TR) / 1e6 - 8.57) < 0.01
    assert all(0 <= t.part_differe < 1 and 0 < t.part_productive <= 0.95 for t in TR)


def test_participation_nulle_ne_change_rien():
    r = sim(participation=0.0)
    assert max(abs(x) for x in r["tresorerie"]) < 1e-9
    assert sum(r["recupere"]) == 0 and r["participants0"] == 0


def test_lambda_atteint_la_cible():
    tot = sum(l["poids"] for l in LIG)
    for cible in (0.05, 0.2, 0.5):
        lam = N.calibrer_lambda(LIG, cible)
        assert abs(sum(l["poids"] * min(1.0, lam * l["f"]) for l in LIG) / tot - cible) < 1e-9   # espérance exacte
        r = sim(participation=cible)
        assert abs(r["participants0"] / r["assujettis"] - cible) < 0.05   # tirage réalisé (300 lignées par tranche)


def test_premiere_annee_seul_le_comptant_manque():
    # la première année, l'État perd le comptant des participants ; leur différé ne serait recouvré que plus tard (HC1)
    r = sim(participation=0.2)
    comptant = sum(l["poids"] * TR[l["k"]].echelle * N.p_courbe(TR[l["k"]].w) * P.ratio_comportement * (1 - TR[l["k"]].part_differe)
                   for l in LIG if l["u"][0] < min(1.0, r["lambda"] * l["f"])) / 1e9
    assert abs(-r["perte_fonction"][0] - comptant) < 1e-6


def test_le_coefficient_change_les_actifs_pas_la_tresorerie_de_depart():
    a, b = sim(participation=0.2, coefficient=0.5), sim(participation=0.2, coefficient=0.1)
    assert abs(a["tresorerie"][0] - b["tresorerie"][0]) < 1e-9
    assert sum(b["cede_plein"]) < sum(a["cede_plein"])
    assert sum(b["recupere"]) < sum(a["recupere"])


def test_convergence_un_participant_cede_de_moins_en_moins():
    # une lignée seule, 2-5 M€, 60 ans, qui ne meurt pas : la part démembrée monte, le dû baisse
    t = [x for x in TR if x.nom == "2-5 M€"][0]
    X, D, dus = t.w, 0.0, []
    for _ in range(30):
        du = t.echelle * N.p_courbe(X + 0.3 * D) * P.ratio_comportement
        dus.append(du)
        v = du / (1 - N.usufruit(60))
        X, D = X - v, D + v
    assert all(dus[i + 1] < dus[i] for i in range(29))
    assert 0 < X < t.w


def test_perte_croit_avec_la_participation_et_selection_par_age():
    r5, r50 = sim(participation=0.05), sim(participation=0.5)
    assert r50["tresorerie"][10] < r5["tresorerie"][10] < 0
    assert r5["part_du0"] > 0.05                      # les gros patrimoines illiquides choisissent plus souvent
    assert r5["age_moyen_participants0"] > r50["age_moyen_participants0"] > 58
    assert r5["part_sans_heritier_participants0"] > P.sans_heritier


def test_transmissions():
    assert N.droits_transmission(0, P) == 0
    assert N.droits_transmission(2e6, P) < N.droits_transmission(4e6, P)
    r = sim(participation=0.2)
    r0 = sim(participation=0.2, transmissions=False)
    assert sum(r["perte_transmissions"]) < 0 and sum(r0["perte_transmissions"]) == 0


def test_deterministe():
    a, b = sim(participation=0.2), sim(participation=0.2)
    assert a["tresorerie"] == b["tresorerie"]
