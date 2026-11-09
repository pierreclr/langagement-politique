# -*- coding: utf-8 -*-
"""Projection démographique par cohortes (âge x sexe), France paramétrable par pays.
Fonctions pures, Python standard seulement. Voir METHODE.md (hypothèses H1... et sources [^id]).
Convention : populations au 1er janvier, âges 0..100 (100 = « 100 ans ou plus »), sexes "M" et "F".
Un pas annuel de t à t+1 :
    P[t+1][x+1] = (P[t][x] + M_x/2) * (1 - q_x) + M_x/2           (x = 0..98 ; migrants arrivant en milieu d'année)
    P[t+1][100] = (P[t][99] + M_99/2)(1 - q_99) + M_99/2 + (P[t][100] + M_100/2)(1 - q_100) + M_100/2
    P[t+1][0]   = naissances_s * (1 - COEF_MORT_NOUVEAU_NE * q_0)
    naissances  = somme_x ASFR_x(t) * F[t][x]  (x = 15..50)
"""
import csv
import math
import os

AGES = 101
AGE_F_MIN, AGE_F_MAX = 15, 50          # fécondité : 15..50 (50 = « 50 ans ou plus »)
COEF_MORT_NOUVEAU_NE = 0.5             # H6 : part de la mortalité infantile subie avant le 1er janvier suivant
ICI = os.path.dirname(os.path.abspath(__file__))
DONNEES = os.path.join(ICI, "donnees")


# ---------------------------------------------------------------- chargement des données
def charger_pays(geo="FR", dossier=DONNEES):
    """Charge les CSV Eurostat (EUROPOP2023) d'un pays produits par donnees/preparer_donnees.py."""
    pop = {}
    for r in csv.DictReader(open(os.path.join(dossier, f"europop_{geo}_population.csv"), encoding="utf-8")):
        pop.setdefault(r["projection"], {}).setdefault(int(r["annee"]), {"M": [0.0] * AGES, "F": [0.0] * AGES})[r["sexe"]][int(r["age"])] = float(r["population_au_1er_janvier"])
    q = {"M": {}, "F": {}}
    for r in csv.DictReader(open(os.path.join(dossier, f"europop_{geo}_mortalite.csv"), encoding="utf-8")):
        q[r["sexe"]].setdefault(int(r["annee"]), [0.0] * AGES)[int(r["age"])] = float(r["taux_de_deces"])
    asfr = {}
    for r in csv.DictReader(open(os.path.join(dossier, f"europop_{geo}_fecondite.csv"), encoding="utf-8")):
        asfr.setdefault(int(r["annee"]), [0.0] * (AGE_F_MAX + 1))[int(r["age"])] = float(r["taux_de_fecondite"])
    bilan = {}
    for r in csv.DictReader(open(os.path.join(dossier, f"europop_{geo}_bilan.csv"), encoding="utf-8")):
        bilan[(r["projection"], r["indicateur"], int(r["annee"]))] = float(r["valeur"])
    return {"geo": geo, "pop": pop, "q": q, "asfr": asfr, "bilan": bilan}


# ---------------------------------------------------------------- briques pures
def esperance_de_vie(q):
    """Espérance de vie à la naissance (années) d'une table de taux de décès par âge (période, a_x = 0,5 sauf a_0 = 0,1 ;
    dernier âge ouvert : espérance restante 1/q)."""
    l, e = 1.0, 0.0
    for x in range(AGES - 1):
        d = l * q[x]
        a = 0.1 if x == 0 else 0.5
        e += (l - d) + a * d
        l -= d
    return e + l / max(q[AGES - 1], 1e-9)


def taux_fecondite_total(asfr):
    return sum(asfr[AGE_F_MIN:AGE_F_MAX + 1])


def taux_de_cohorte(q):
    """Les taux Eurostat sont indexés par l'âge atteint en fin d'année (constaté : la survie d'une cohorte de x à x+1 ans vaut 1 - q[x+1],
    écart < 0,3 point à 70-90 ans). Pour une personne d'âge x au 1er janvier : q_cohorte[x] = q[x+1] (x < 100), q[100] pour 100+. H3."""
    return [q[min(x + 1, AGES - 1)] for x in range(AGES)]


def taux_de_cohorte_inverse(q):
    """Les taux Eurostat tels quels (la fonction naissances() attend l'indexation Eurostat) : identité, nommée pour la lisibilité."""
    return q


def forme_fecondite(asfr):
    """Profil par âge normalisé (somme = 1) et âge moyen à la maternité."""
    t = taux_fecondite_total(asfr)
    f = [0.0] * (AGE_F_MAX + 1)
    for x in range(AGE_F_MIN, AGE_F_MAX + 1):
        f[x] = asfr[x] / t
    age_moyen = sum((x + 0.5) * f[x] for x in range(AGE_F_MIN, AGE_F_MAX + 1))
    return f, age_moyen


def decaler_forme(forme, decalage):
    """Décale le profil de fécondité vers des âges plus élevés de `decalage` années (interpolation linéaire), somme conservée."""
    out = [0.0] * (AGE_F_MAX + 1)
    for x in range(AGE_F_MIN, AGE_F_MAX + 1):
        src = x - decalage
        lo = math.floor(src)
        w = src - lo
        for a, p in ((lo, 1 - w), (lo + 1, w)):
            if AGE_F_MIN <= a <= AGE_F_MAX:
                out[x] += p * forme[a]
    s = sum(out)
    return [v / s for v in out]


def chemin_lineaire(valeur_debut, valeur_cible, annee_debut, annee_cible):
    """Fonction t -> valeur : linéaire de valeur_debut (annee_debut) à valeur_cible (annee_cible), constante ensuite."""
    def f(t):
        if t >= annee_cible:
            return valeur_cible
        if t <= annee_debut:
            return valeur_debut
        return valeur_debut + (valeur_cible - valeur_debut) * (t - annee_debut) / (annee_cible - annee_debut)
    return f


def calibrer_niveau_mortalite(pop, q_base, deces_cible):
    """Coefficient kappa (commun aux deux sexes) tel que les décès d'une année à population `pop` valent `deces_cible`
    (décès linéaires en kappa ; mortalité des nouveau-nés non incluse, négligeable : < 0,5 % des décès)."""
    d = sum(pop[s][x] * taux_de_cohorte(q_base[s])[x] for s in ("M", "F") for x in range(AGES))
    return deces_cible / d


def calibrer_tendance_mortalite(q_base, kappa, gain, n_annees):
    """Taux annuel lam tel que q(t) = kappa * q_base * exp(-lam * (t - début)) fait gagner `gain` années d'espérance de vie
    à la naissance en n_annees (bissection ; e0 croît avec lam). H4 : amélioration proportionnelle, identique à tous les âges."""
    e_debut = esperance_de_vie([min(1.0, kappa * v) for v in q_base])
    lo, hi = -0.02, 0.15
    for _ in range(80):
        mid = (lo + hi) / 2
        e = esperance_de_vie([min(1.0, kappa * v * math.exp(-mid * n_annees)) for v in q_base])
        if e - e_debut < gain:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def profil_migratoire(pop_bsl, q_bsl, annee_debut=2025, annee_fin=2040):
    """Profil par âge et sexe (somme = 1) du solde migratoire, déduit des résidus de la projection de référence Eurostat :
    M_x = (P[t+1][x+1] - P[t][x](1 - q_x)) / (1 - q_x/2), moyenné sur les années ; l'âge 0 reste à 0 (non identifiable). H8."""
    acc = {"M": [0.0] * AGES, "F": [0.0] * AGES}
    for t in range(annee_debut, annee_fin):
        for s in ("M", "F"):
            p0, p1, q = pop_bsl[t][s], pop_bsl[t + 1][s], taux_de_cohorte(q_bsl[s][t])
            for x in range(0, AGES - 2):
                acc[s][x] += (p1[x + 1] - p0[x] * (1 - q[x])) / (1 - q[x] / 2)
    acc["M"][0] = acc["F"][0] = 0.0
    n = annee_fin - annee_debut
    tot = sum(sum(v) for v in acc.values())
    return {s: [v / tot for v in acc[s]] for s in acc}


# H8 bis : profil par âge stylisé du solde migratoire (hypothèse de Claude, ⚠️ à vérifier à la source : immigrés par âge à l'arrivée, Insee).
# (âge min, âge max, part du solde) ; répartition uniforme dans chaque tranche, 50 % d'hommes.
TRANCHES_MIGRATION = [(0, 17, 0.15), (18, 24, 0.25), (25, 34, 0.35), (35, 49, 0.20), (50, 64, 0.05)]


def profil_stylise(tranches=TRANCHES_MIGRATION):
    prof = {"M": [0.0] * AGES, "F": [0.0] * AGES}
    for a, b, part in tranches:
        for x in range(a, b + 1):
            for s in ("M", "F"):
                prof[s][x] = part / (b - a + 1) / 2
    return prof


def pas_annuel(pop, q, naissances_totales, migrants, part_garcons, coef=COEF_MORT_NOUVEAU_NE):
    """Un an de projection. pop = {"M": [...], "F": [...]}, q = {"M": [...], "F": [...]} taux de décès de l'année,
    migrants = {"M": [...], "F": [...]} (effectifs, peut être négatif). q est indexé comme les taux Eurostat (voir taux_de_cohorte).
    Renvoie (nouvelle pop, décès)."""
    nouvelle = {"M": [0.0] * AGES, "F": [0.0] * AGES}
    deces = 0.0
    for s in ("M", "F"):
        p, qq, m = pop[s], taux_de_cohorte(q[s]), migrants[s]
        n = nouvelle[s]
        for x in range(AGES):
            expo = p[x] + m[x] / 2
            surv = expo * (1 - qq[x])
            deces += expo * qq[x]
            dest = min(x + 1, AGES - 1)
            n[dest] += surv + m[x] / 2
        naiss = naissances_totales * (part_garcons if s == "M" else 1 - part_garcons)
        n[0] = naiss * (1 - coef * q[s][0])
        deces += naiss * coef * q[s][0]
    return nouvelle, deces


def naissances(pop_f, asfr_t, q_f=None):
    """Naissances de l'année : somme des taux de fécondité par âge x population féminine exposée. L'exposition est la moyenne
    des effectifs de l'âge x au 1er janvier t et au 1er janvier t+1 (approchés par les survivantes de l'âge x-1) ; H5."""
    tot = 0.0
    for x in range(AGE_F_MIN, AGE_F_MAX + 1):
        fin = pop_f[x - 1] * (1 - q_f[x]) if q_f is not None else pop_f[x]
        if x == AGE_F_MAX:
            fin += pop_f[x] * (1 - q_f[x]) if q_f is not None else 0.0
        tot += asfr_t[x] * 0.5 * (pop_f[x] + fin)
    return tot


def projeter(pop0, annee0, annee_fin, q_fn, asfr_fn, migration_fn, profil, part_garcons):
    """Projection complète. q_fn(sexe, t) -> taux par âge ; asfr_fn(t) -> taux de fécondité par âge (0..50) ;
    migration_fn(t) -> solde migratoire total de l'année t ; profil = profil_migratoire. Renvoie {annee: {...}}."""
    etat = {annee0: {"pop": pop0}}
    pop = pop0
    for t in range(annee0, annee_fin):
        a = asfr_fn(t)
        q = {s: q_fn(s, t) for s in ("M", "F")}
        b = naissances(pop["F"], a, q["F"])
        mig_tot = migration_fn(t)
        migrants = {s: [mig_tot * v for v in profil[s]] for s in ("M", "F")}
        pop, d = pas_annuel(pop, q, b, migrants, part_garcons)
        etat[t]["naissances"] = b
        etat[t]["deces"] = d
        etat[t]["solde_migratoire"] = mig_tot
        etat[t]["icf"] = taux_fecondite_total(a)
        etat[t]["e0"] = {s: esperance_de_vie(q[s]) for s in ("M", "F")}
        etat[t + 1] = {"pop": pop}
    return etat


# ---------------------------------------------------------------- indicateurs
def somme_ages(pop, a_min, a_max=AGES - 1):
    return sum(sum(pop[s][a_min:a_max + 1]) for s in ("M", "F"))


def part_retraites(age, age_depart, sigma=2.5, plafond=0.95):
    """Part approximative des personnes d'un âge donné qui perçoivent une pension de droit direct : loi normale de l'âge
    de départ (moyenne age_depart, écart-type sigma), plafonnée (personnes sans pension de droit direct, polypensionnés
    à l'étranger, etc.). H11."""
    return plafond * 0.5 * (1 + math.erf((age + 0.5 - age_depart) / (sigma * math.sqrt(2))))


def nb_retraites(pop, age_depart, sigma=2.5, plafond=0.95):
    return sum(pop[s][x] * part_retraites(x, age_depart, sigma, plafond) for s in ("M", "F") for x in range(AGES))


def indicateurs(pop, age_depart=None):
    tot = somme_ages(pop, 0)
    a20_64, p65, p75, p80 = somme_ages(pop, 20, 64), somme_ages(pop, 65), somme_ages(pop, 75), somme_ages(pop, 80)
    out = {
        "population": tot, "moins_20": somme_ages(pop, 0, 19), "20_64": a20_64, "65_plus": p65, "75_plus": p75, "80_plus": p80,
        "part_65_plus": p65 / tot, "part_75_plus": p75 / tot, "part_80_plus": p80 / tot,
        "ratio_20_64_sur_65_plus": a20_64 / p65, "ratio_65_plus_pour_100": 100 * p65 / a20_64,
    }
    if age_depart is not None:
        r = nb_retraites(pop, age_depart)
        out["retraites"] = r
        out["ratio_20_64_sur_retraites"] = a20_64 / r
    return out


# ---------------------------------------------------------------- jeux d'hypothèses
# Chaque jeu : ICF, solde migratoire annuel, espérance de vie en 2070 (femmes, hommes). Sources : METHODE.md.
INSEE_2026 = {
    "nom": "Insee, projections 2026",
    "icf_debut": 1.56, "e0_debut": {"F": 85.9, "M": 80.3}, "migration_debut": 176000, "age_maternite_debut": 31.2,
    "age_maternite_cible": (33.0, 2050), "total_debut": 68.852e6, "naissances_debut": 645000, "deces_debut": 651000,
    "bas": {"icf": (1.20, 2030), "migration": 70000, "e0_2070": {"F": 86.5, "M": 83.7}},
    "central": {"icf": (1.45, 2028), "migration": 150000, "e0_2070": {"F": 89.5, "M": 86.7}},
    "haut": {"icf": (1.70, 2030), "migration": 230000, "e0_2070": {"F": 92.5, "M": 89.7}},
}
INSEE_2021 = {
    # e0_debut : valeurs 2021 déduites des gains publiés (2070 moins 4,9 ans et 8,4 ans) pour garder les mêmes gains qu'en 2021.
    "nom": "Insee, projections 2021-2070 (hypothèses figées à leur valeur 2021)",
    "icf_debut": 1.80, "e0_debut": {"F": 85.1, "M": 79.1}, "migration_debut": 70000, "age_maternite_debut": 31.2,
    "age_maternite_cible": (31.2, 2050), "total_debut": 68.852e6, "naissances_debut": 645000, "deces_debut": 651000,
    "bas": {"icf": (1.60, 2025), "migration": 20000, "e0_2070": {"F": 86.5, "M": 84.0}},
    "central": {"icf": (1.80, 2025), "migration": 70000, "e0_2070": {"F": 90.0, "M": 87.5}},
    "haut": {"icf": (2.00, 2025), "migration": 120000, "e0_2070": {"F": 93.5, "M": 91.0}},
}
ANNEE0, ANNEE_FIN = 2025, 2070


def construire_parametres(pays, jeu, bas_haut, profil_migration="residus"):
    """bas_haut = {"fecondite": "bas"|"central"|"haut", "migration": ..., "esperance_vie": ...}.
    Renvoie (q_fn, asfr_fn, migration_fn, pop0, profil, part_garcons) prêts pour projeter()."""
    pop_bsl = pays["pop"]["BSL"]
    q0 = pays["q"]
    # fécondité : forme 2025 d'Eurostat, ICF suivant un chemin linéaire, âge moyen décalé
    forme, age_moy = forme_fecondite(pays["asfr"][ANNEE0])
    cible_icf, an_icf = jeu[bas_haut["fecondite"]]["icf"]
    icf = chemin_lineaire(jeu["icf_debut"], cible_icf, ANNEE0, an_icf)
    dec_cible, an_dec = jeu["age_maternite_cible"]
    dec = chemin_lineaire(0.0, dec_cible - jeu["age_maternite_debut"], ANNEE0, an_dec)
    cache_forme = {}
    pop0_f = pop_bsl[ANNEE0]["F"]
    # H5 : calage de niveau sur les naissances 2025 estimées (l'exposition féminine d'Eurostat et celle de l'Insee diffèrent un peu)
    calage = 1.0
    if jeu.get("naissances_debut"):
        calage = jeu["naissances_debut"] / naissances(pop0_f, [jeu["icf_debut"] * v for v in forme], taux_de_cohorte_inverse(pays["q"]["F"][ANNEE0]))

    def asfr_fn(t):
        d = round(dec(t), 2)
        if d not in cache_forme:
            cache_forme[d] = decaler_forme(forme, d) if d else forme
        return [calage * icf(t) * v for v in cache_forme[d]]

    # migration : 2025 = estimation de départ, puis valeur du scénario
    mig_cible = jeu[bas_haut["migration"]]["migration"]

    def migration_fn(t):
        return jeu["migration_debut"] if t == ANNEE0 else mig_cible

    # mortalité : niveau calé sur les décès 2025 estimés, tendance calée sur le gain d'espérance de vie 2025-2070 du jeu
    pop0 = {s: list(pop_bsl[ANNEE0][s]) for s in ("M", "F")}
    if jeu.get("total_debut"):
        k = jeu["total_debut"] / sum(sum(v) for v in pop0.values())
        pop0 = {s: [v * k for v in pop0[s]] for s in pop0}
    kappa = calibrer_niveau_mortalite(pop0, {s: q0[s][ANNEE0] for s in ("M", "F")}, jeu["deces_debut"]) if jeu.get("deces_debut") else 1.0
    lam = {s: calibrer_tendance_mortalite(q0[s][ANNEE0], kappa, jeu[bas_haut["esperance_vie"]]["e0_2070"][s] - jeu["e0_debut"][s], ANNEE_FIN - ANNEE0) for s in ("M", "F")}

    def q_fn(s, t):
        f = kappa * math.exp(-lam[s] * (t - ANNEE0))
        return [min(1.0, f * v) for v in q0[s][ANNEE0]]

    profil = profil_stylise() if profil_migration == "stylise" else profil_migratoire(pop_bsl, q0)
    part_garcons = pop_bsl[ANNEE0]["M"][0] / (pop_bsl[ANNEE0]["M"][0] + pop_bsl[ANNEE0]["F"][0])
    return q_fn, asfr_fn, migration_fn, pop0, profil, part_garcons


def projeter_scenario(pays, jeu, bas_haut, annee_fin=ANNEE_FIN, profil_migration="residus"):
    q_fn, asfr_fn, mig_fn, pop0, profil, pg = construire_parametres(pays, jeu, bas_haut, profil_migration)
    return projeter(pop0, ANNEE0, annee_fin, q_fn, asfr_fn, mig_fn, profil, pg)


def projeter_europop(pays, projection="BSL", annee_fin=ANNEE_FIN):
    """Rejoue la projection EUROPOP2023 d'Eurostat avec NOTRE moteur de cohortes, en lui donnant les taux de décès, de fécondité
    et le solde migratoire d'Eurostat (contrôle du moteur, H10). Mortalité et fécondité : celles de la projection de référence."""
    pop = pays["pop"][projection]
    q = pays["q"]
    profil = profil_migratoire(pays["pop"]["BSL"], q)
    b = pays["bilan"]
    pg = pop[ANNEE0]["M"][0] / (pop[ANNEE0]["M"][0] + pop[ANNEE0]["F"][0])
    return projeter(pop[ANNEE0], ANNEE0, annee_fin, lambda s, t: q[s][t], lambda t: pays["asfr"][t],
                    lambda t: b[(projection, "NMIGRAT", t)], profil, pg)


SCENARIOS_COMBINES = {
    # nom : (fécondité, migration, espérance de vie)
    "central": ("central", "central", "central"),
    "population_basse": ("bas", "bas", "bas"),
    "population_haute": ("haut", "haut", "haut"),
    "population_agee": ("bas", "bas", "haut"),
    "population_jeune": ("haut", "haut", "bas"),
    "fecondite_basse": ("bas", "central", "central"),
    "fecondite_haute": ("haut", "central", "central"),
    "migration_basse": ("central", "bas", "central"),
    "migration_haute": ("central", "haut", "central"),
    "esperance_vie_basse": ("central", "central", "bas"),
    "esperance_vie_haute": ("central", "central", "haut"),
}


def jeu_combine(nom):
    f, m, e = SCENARIOS_COMBINES[nom]
    return {"fecondite": f, "migration": m, "esperance_vie": e}


# Âge moyen de départ à la retraite (H11) : 62,5 ans en 2025, +1,5 an d'ici 2032 avec la réforme de 2023 (hypothèse), ou constant.
def age_depart_reforme(t, debut=62.5, hausse=1.5, an_cible=2032):
    return chemin_lineaire(debut, debut + hausse, ANNEE0, an_cible)(t)


def age_depart_constant(t, debut=62.5):
    return debut
