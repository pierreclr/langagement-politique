# -*- coding: utf-8 -*-
"""Tests de cohérence : python3 test_modele.py (aucune dépendance), ou pytest s'il est installé."""
import math
import os
import shutil
import tempfile

import modele as m

PAYS = m.charger_pays("FR")


def dans(x, lo, hi, nom=""):
    assert lo <= x <= hi, (nom, x, lo, hi)


def zero():
    return {"M": [0.0] * m.AGES, "F": [0.0] * m.AGES}


def pop_jouet():
    p = zero()
    for x in range(m.AGES):
        p["M"][x] = 1000.0 + x
        p["F"][x] = 1100.0 + x
    return p


def test_sans_mortalite_ni_naissance_ni_migration_la_population_vieillit_sans_perte():
    p = pop_jouet()
    q = {"M": [0.0] * m.AGES, "F": [0.0] * m.AGES}
    n, d = m.pas_annuel(p, q, 0.0, zero(), 0.5)
    assert d == 0
    tot0 = sum(p["M"]) + sum(p["F"])
    tot1 = sum(n["M"]) + sum(n["F"])
    assert abs(tot0 - tot1) < 1e-6
    assert abs(n["M"][11] - p["M"][10]) < 1e-9 and n["M"][0] == 0
    assert abs(n["F"][100] - (p["F"][99] + p["F"][100])) < 1e-9   # l'âge 100 est ouvert


def test_migration_ajoute_exactement_le_solde():
    p = pop_jouet()
    q = {"M": [0.0] * m.AGES, "F": [0.0] * m.AGES}
    mig = zero()
    mig["M"][30], mig["F"][25] = 60000.0, 40000.0
    n, _ = m.pas_annuel(p, q, 0.0, mig, 0.5)
    dif = sum(n["M"]) + sum(n["F"]) - sum(p["M"]) - sum(p["F"])
    assert abs(dif - 100000.0) < 1e-6


def test_deces_et_naissances_bilan():
    p = pop_jouet()
    q = {"M": [0.01] * m.AGES, "F": [0.01] * m.AGES}
    n, d = m.pas_annuel(p, q, 5000.0, zero(), 0.5)
    tot0 = sum(p["M"]) + sum(p["F"])
    tot1 = sum(n["M"]) + sum(n["F"])
    assert abs(tot1 - (tot0 + 5000.0 - d)) < 1e-6, (tot1, tot0, d)


def test_esperance_de_vie_croit_quand_la_mortalite_baisse():
    q = PAYS["q"]["F"][2025]
    e1 = m.esperance_de_vie(q)
    e2 = m.esperance_de_vie([0.9 * v for v in q])
    assert e2 > e1
    dans(e1, 84, 88, "e0 femmes Eurostat 2025 (Insee : 85,9)")
    dans(m.esperance_de_vie(PAYS["q"]["M"][2025]), 78, 82, "e0 hommes Eurostat 2025 (Insee : 80,3)")


def test_calibrage_de_la_tendance_donne_le_gain_demande():
    q = PAYS["q"]["F"][2025]
    lam = m.calibrer_tendance_mortalite(q, 1.0, 3.6, 45)
    e0 = m.esperance_de_vie(q)
    e45 = m.esperance_de_vie([min(1, v * math.exp(-lam * 45)) for v in q])
    dans(e45 - e0, 3.59, 3.61, "gain d'espérance de vie")


def test_calibrage_du_niveau_donne_les_deces_demandes():
    pop = PAYS["pop"]["BSL"][2025]
    k = m.calibrer_niveau_mortalite(pop, {s: PAYS["q"][s][2025] for s in "MF"}, 651000)
    d = sum(pop[s][x] * k * m.taux_de_cohorte(PAYS["q"][s][2025])[x] for s in "MF" for x in range(m.AGES))
    dans(d, 650999, 651001, "décès")


def test_forme_de_fecondite():
    f, age_moy = m.forme_fecondite(PAYS["asfr"][2025])
    assert abs(sum(f) - 1) < 1e-12
    dans(age_moy, 29.5, 32.5, "âge moyen à la maternité (Insee : 31,2)")
    g = m.decaler_forme(f, 1.8)
    assert abs(sum(g) - 1) < 1e-12
    age_g = sum((x + 0.5) * g[x] for x in range(m.AGE_F_MAX + 1))
    dans(age_g - age_moy, 1.6, 2.0, "décalage de l'âge moyen")


def test_chemin_lineaire():
    f = m.chemin_lineaire(1.56, 1.45, 2025, 2028)
    assert f(2024) == 1.56 and f(2028) == 1.45 and f(2040) == 1.45
    dans(f(2026), 1.52, 1.53)


def test_profils_migratoires_somment_a_un():
    pr = m.profil_migratoire(PAYS["pop"]["BSL"], PAYS["q"])
    assert abs(sum(pr["M"]) + sum(pr["F"]) - 1) < 1e-9
    ps = m.profil_stylise()
    assert abs(sum(ps["M"]) + sum(ps["F"]) - 1) < 1e-9
    assert sum(ps["M"][18:35]) + sum(ps["F"][18:35]) > 0.5     # stylisé : surtout 18-34 ans
    # Limite connue (METHODE.md H8) : le profil déduit des résidus d'Eurostat n'est pas un vrai profil d'âge des migrants
    # (négatif à 18-24 ans, positif aux grands âges) ; le choix du profil déplace la population 2070 de plusieurs %.
    a = m.indicateurs(m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("central"))[2070]["pop"])["population"]
    b = m.indicateurs(m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("central"), profil_migration="stylise")[2070]["pop"])["population"]
    dans(b / a - 1, 0.01, 0.08, "sensibilité de la population 2070 au profil d'âge des migrants")


def test_rejouer_europop_retrouve_eurostat():
    eu = m.projeter_europop(PAYS)
    b = PAYS["bilan"]
    for y, tol in ((2030, 0.005), (2050, 0.02), (2070, 0.025)):
        i = m.indicateurs(eu[y]["pop"])
        assert abs(i["population"] / b[("BSL", "JAN", y)] - 1) < tol, (y, i["population"])
    i = m.indicateurs(eu[2070]["pop"])
    dans(100 * i["part_65_plus"], b[("BSL", "PC_Y65_MAX", 2070)] - 1, b[("BSL", "PC_Y65_MAX", 2070)] + 1, "part 65+")
    dans(i["ratio_65_plus_pour_100"], b[("BSL", "OLDDEP3", 2070)] - 2, b[("BSL", "OLDDEP3", 2070)] + 2, "dépendance")
    # migration haute d'Eurostat : plus de population, dans le bon ordre de grandeur
    h = m.indicateurs(m.projeter_europop(PAYS, "HMIGR")[2070]["pop"])["population"]
    assert h > m.indicateurs(eu[2070]["pop"])["population"]
    assert abs(h / b[("HMIGR", "JAN", 2070)] - 1) < 0.05


def test_insee_2026_central_proche_du_publie():
    e = m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("central"))
    i26, i50, i70 = (m.indicateurs(e[y]["pop"]) for y in (2026, 2050, 2070))
    dans(i26["population"] / 1e6, 68.9, 69.3, "population 2026 (Insee : 69,08)")
    dans(i50["population"] / 1e6, 69.08 * 0.985, 69.08 * 1.015, "population 2050")
    dans(i70["population"] / 1e6, 65.887 * 0.98, 65.887 * 1.02, "population 2070 (Insee : 65,887)")
    dans(i70["65_plus"] / 1e6, 21.1 * 0.97, 21.1 * 1.03, "65+ 2070 (Insee : 21,1)")
    dans(i70["80_plus"] / 1e6, 8.902 * 0.95, 8.902 * 1.05, "80+ 2070 (Insee : 8,902)")
    dans(i70["ratio_65_plus_pour_100"], 61.92 - 3, 61.92 + 3, "dépendance 2070 (Insee : 61,92)")


def test_ordre_des_scenarios():
    def pop70(nom):
        e = m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine(nom))
        return m.indicateurs(e[2070]["pop"])
    c, b, h, ag, je = (pop70(n) for n in ("central", "population_basse", "population_haute", "population_agee", "population_jeune"))
    assert b["population"] < c["population"] < h["population"]
    assert ag["ratio_65_plus_pour_100"] > c["ratio_65_plus_pour_100"] > je["ratio_65_plus_pour_100"]
    assert pop70("fecondite_basse")["population"] < c["population"] < pop70("fecondite_haute")["population"]
    assert pop70("migration_basse")["population"] < c["population"] < pop70("migration_haute")["population"]
    assert pop70("esperance_vie_basse")["population"] < c["population"] < pop70("esperance_vie_haute")["population"]


def test_aucune_population_negative():
    for jeu in (m.INSEE_2026, m.INSEE_2021):
        for nom in ("population_basse", "population_haute", "population_agee"):
            e = m.projeter_scenario(PAYS, jeu, m.jeu_combine(nom))
            for y in e:
                assert min(min(e[y]["pop"]["M"]), min(e[y]["pop"]["F"])) >= 0, (nom, y)


def test_retraites_ordre_de_grandeur_et_reforme():
    e = m.projeter_scenario(PAYS, m.INSEE_2026, m.jeu_combine("central"))
    r25 = m.indicateurs(e[2025]["pop"], m.age_depart_reforme(2025))["retraites"] / 1e6
    dans(r25, 15.5, 17.5, "retraités 2025 (DREES : 16,3 M résidant en France fin 2023, 17,2 M au total ; ⚠️)")
    assert m.nb_retraites(e[2070]["pop"], m.age_depart_reforme(2070)) < m.nb_retraites(e[2070]["pop"], m.age_depart_constant(2070))
    assert m.part_retraites(30, 63) < 1e-6 and m.part_retraites(90, 63) > 0.9


def test_pays_parametrable():
    # Un « autre pays » : copie des fichiers FR sous un autre code, la chaîne complète tourne sans code propre à la France.
    tmp = tempfile.mkdtemp()
    try:
        for n in ("population", "mortalite", "fecondite", "bilan"):
            shutil.copy(os.path.join(m.DONNEES, f"europop_FR_{n}.csv"), os.path.join(tmp, f"europop_XX_{n}.csv"))
        px = m.charger_pays("XX", tmp)
        jeu = dict(m.INSEE_2026)
        jeu.pop("total_debut"), jeu.pop("naissances_debut"), jeu.pop("deces_debut")   # pas de calage national : valeurs Eurostat
        e = m.projeter_scenario(px, jeu, m.jeu_combine("central"))
        dans(m.indicateurs(e[2070]["pop"])["population"] / 1e6, 55, 75)
    finally:
        shutil.rmtree(tmp)


if __name__ == "__main__":
    ok = 0
    for nom, f in sorted(globals().items()):
        if nom.startswith("test_") and callable(f):
            f()
            ok += 1
            print("ok", nom)
    print(ok, "tests passés")
