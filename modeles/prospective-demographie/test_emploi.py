# -*- coding: utf-8 -*-
"""Tests du module emploi : python3 test_emploi.py (aucune dépendance), ou pytest."""
import emploi as e
import modele as m

PAYS = m.charger_pays("FR")
D = e.charger_emploi()
ETAT = m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("central"))
CAL = e.calibrage(D, ETAT[2025]["pop"])
COT = D["cot"]


def dans(x, lo, hi, nom=""):
    assert lo <= x <= hi, (nom, x, lo, hi)


def cor(grandeur, t):
    return COT[(grandeur, "Sc. Ref")][t]


def test_lissage_conserve_les_moyennes_de_tranche():
    for s in ("M", "F"):
        b = e.activite_cor(D, s, 2025)
        c = e.lisser_tranches(b)
        assert len(c) == m.AGES and c[10] == 0.0
        for a in e.BANDES[:-1]:
            dans(e.moyenne_tranche(c, a), b[a] - 0.003, b[a] + 0.003, f"tranche {a}")
        assert all(0 <= v <= 1 for v in c)


def test_decalage_d_age():
    c = e.lisser_tranches(e.activite_cor(D, "F", 2025))
    assert e.decaler(c, 0.0) == c
    d1 = e.decaler(c, 2.0)
    assert d1[:50] == c[:50]                                     # rien avant 50 ans
    assert d1[62] > c[62]
    assert abs(d1[62] - c[60]) < 1e-9                            # taux'(x) = taux(x - delta) à delta entier
    assert sum(e.decaler(c, -2.0)[50:75]) < sum(c[50:75])


def test_sans_decalage_les_hypotheses_cor_sont_retrouvees():
    # Emploi par tranche COR (7 %, 2040) reconstitué à partir de l'activité dérivée et du chômage de la tranche
    for s in ("M", "F"):
        sx = e._sx(s)
        k = e.coef_chomage(D, s)
        act = e.activite_cor(D, s, 2040)
        for b in (25, 40, 55):
            emp = act[b] * (1 - k[b] * 0.07)
            dans(emp, D["hyp"][(7, "emploi", sx, b)][2040] - 1e-9, D["hyp"][(7, "emploi", sx, b)][2040] + 1e-9)


def test_chemin_chomage_serie_cor_et_rampe():
    u7 = e.chemin_chomage(D, 0.07)
    for t in (2025, 2030, 2040, 2070):
        dans(u7(t), D["macro"][("taux_chomage", "Scénario de référence 7%")][t] - 1e-12, D["macro"][("taux_chomage", "Scénario de référence 7%")][t] + 1e-12)
    u5, u10 = e.chemin_chomage(D, 0.05), e.chemin_chomage(D, 0.10)
    dans(u5(2070), 0.0499, 0.0501)
    dans(u10(2040), 0.0999, 0.1001)
    assert u5(2025) == u7(2025) == u10(2025)
    assert u5(2033) > 0.05 and u5(2033) < u7(2033) < u10(2033)


def test_calage_2025_sur_les_cotisants_cor():
    dans(CAL["kappa"], 1.0, 1.15, "cotisants / emploi du modèle (cotisants COR 2025 : 30,6 M, emploi du modèle : 28,9 M)")
    dans(CAL["lam"], 1.04, 1.07, "retraités tous / résidents (COR : 17,31 / 16,45)")
    r = e.projeter_emploi(D, ETAT, CAL, annees=[2025])
    dans(r[2025]["cotisants"] / 1e6, cor("cotisants_millions", 2025) - 1e-6, cor("cotisants_millions", 2025) + 1e-6)


def test_ordre_de_grandeur_emploi_2025_contre_eurostat():
    r = e.projeter_emploi(D, ETAT, CAL, annees=[2025])
    eu = sum(D["eu"][("emploi_milliers", s, "Y15-74", 2025)] for s in ("M", "F")) * 1e3
    dans(r[2025]["emploi"] / eu, 0.95, 1.01, "emploi du modèle (tous âges) / Eurostat 15-74, 2025")


def test_projection_proche_du_cor_dans_le_scenario_de_reference():
    r = e.projeter_emploi(D, ETAT, CAL)
    for t in (2030, 2050, 2070):
        dans(r[t]["cotisants"] / 1e6 / cor("cotisants_millions", t), 0.97, 1.03, f"cotisants {t}")
        dans(r[t]["retraites_tous"] / 1e6 / cor("retraites_tous_millions", t), 0.97, 1.04, f"retraités {t}")
        dans(r[t]["rapport_cotisants_retraites"] / cor("rapport_cotisants_retraites", t), 0.95, 1.03, f"rapport {t}")
    assert r[2070]["rapport_cotisants_retraites"] < r[2025]["rapport_cotisants_retraites"]


def test_avec_la_pyramide_insee_l_ecart_au_cor_se_resorbe():
    p = e.pyramide_insee(2070)
    i = e.calculer(D, p, 2070)
    rap = CAL["kappa"] * i["emploi"] / (i["retraites_residents"] * CAL["lam"])
    dans(rap / cor("rapport_cotisants_retraites", 2070), 0.98, 1.02, "rapport 2070 avec la pyramide Insee")


def test_effet_demographique_seul_est_plus_bas_que_la_trajectoire_cor():
    gel = e.projeter_emploi(D, ETAT, CAL, mode="gel_2025")
    base = e.projeter_emploi(D, ETAT, CAL)
    assert gel[2070]["rapport_cotisants_retraites"] < base[2070]["rapport_cotisants_retraites"]
    assert gel[2070]["cotisants"] < base[2070]["cotisants"]


def test_chomage_structurel_monotone():
    u = {x: e.projeter_emploi(D, ETAT, CAL, u_lt=x, annees=[2070])[2070] for x in (0.05, 0.07, 0.10)}
    assert u[0.05]["cotisants"] > u[0.07]["cotisants"] > u[0.10]["cotisants"]
    assert u[0.05]["rapport_cotisants_retraites"] > u[0.07]["rapport_cotisants_retraites"] > u[0.10]["rapport_cotisants_retraites"]
    # sens et ordre de grandeur du COR (variantes 5 % et 10 %)
    for x, serie in ((0.05, "[0,7_C5]"), (0.10, "[0,7_C10]")):
        dans(u[x]["rapport_cotisants_retraites"] / COT[("rapport_cotisants_retraites", serie)][2070], 0.93, 1.03, serie)


def test_age_de_depart_leve_le_rapport():
    b = e.projeter_emploi(D, ETAT, CAL, annees=[2050])[2050]
    p1 = e.projeter_emploi(D, ETAT, CAL, age_depart=("rampe", 1.0), annees=[2050])[2050]
    g = e.projeter_emploi(D, ETAT, CAL, age_depart=("gel_2025", 0), annees=[2050])[2050]
    assert g["rapport_cotisants_retraites"] < b["rapport_cotisants_retraites"] < p1["rapport_cotisants_retraites"]
    assert p1["cotisants"] > b["cotisants"] and p1["retraites_tous"] < b["retraites_tous"]
    dans(g["delta_age_depart"], -1.6, -1.3, "gel : 63,13 - 64,54")


def test_robotisation():
    r0 = e.projeter_emploi(D, ETAT, CAL)
    assert e.reduction_besoin_emploi(0.3)(2029) == 0.0
    dans(e.reduction_besoin_emploi(0.3)(2060), 0.2999, 0.3001)
    dans(e.reduction_besoin_emploi(0.3, forme="lineaire")(2045), 0.149, 0.151)
    a, em, ch = e.appliquer_robotisation(100.0, 90.0, 0.10, compensation=0.0, part_chomage=0.5)
    dans(em, 80.999, 81.001)
    dans(ch, 14.49, 14.51)   # 10 chômeurs au départ + 4,5 des 9 emplois perdus ; les 4,5 autres sortent de l'activité (actifs 95,5)
    # r = 0 : aucune différence
    r00 = e.projeter_emploi(D, ETAT, CAL, robot=dict(r_final=0.0), annees=[2070])[2070]
    dans(r00["cotisants"] / r0[2070]["cotisants"], 0.999999, 1.000001)
    rb = e.projeter_emploi(D, ETAT, CAL, robot=dict(r_final=0.15, compensation=0.0), annees=[2070])[2070]
    rc = e.projeter_emploi(D, ETAT, CAL, robot=dict(r_final=0.15, compensation=0.5), annees=[2070])[2070]
    assert rb["cotisants"] < rc["cotisants"] < r0[2070]["cotisants"]
    assert rb["taux_chomage"] > rc["taux_chomage"] > r0[2070]["taux_chomage"]
    dans(rb["emploi"] / r0[2070]["emploi"], 0.849, 0.851)
    # compensation par les salaires : la masse salariale par cotisant remonte, pas le nombre de cotisants
    rs = e.projeter_emploi(D, ETAT, CAL, robot=dict(r_final=0.15, compensation=0.0, hausse_salaire_2070=0.15), annees=[2070])[2070]
    assert rs["cotisants"] == rb["cotisants"] and rs["rapport_masse_retraites"] > rb["rapport_masse_retraites"]


def test_scenarios_de_population_ordonnes():
    jeune = e.projeter_emploi(D, m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("population_jeune")), CAL, annees=[2070])[2070]
    agee = e.projeter_emploi(D, m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("population_agee")), CAL, annees=[2070])[2070]
    assert jeune["rapport_cotisants_retraites"] > agee["rapport_cotisants_retraites"]


if __name__ == "__main__":
    ok = 0
    for nom, f in sorted(globals().items()):
        if nom.startswith("test_") and callable(f):
            f()
            ok += 1
            print("ok", nom)
    print(ok, "tests passés")
