# -*- coding: utf-8 -*-
"""Projection demographique par composantes de cohortes (France), 2026-2070.

Bibliotheque standard seulement ; fonctions pures hors `charger_base` (seule fonction qui lit des fichiers).
Execution : python3 -I projection.py   (affiche le scenario central)

Methode (voir RAPPORT.md) : pour chaque annee t, de la population au 1er janvier par sexe et age revolu :
  P(a+1, t+1) = P(a, t) * (1 - q(a, sexe, t)) + m(a+1, sexe, t)      pour a = 0..104 (105 = « 105 ans ou plus »)
  P(0, t+1)   = naissances(t) * (1 - q0/2)
  naissances(t) = somme sur x=15..49 de f(x, t) * exposition ; exposition = (P_F(x-1, t) + P_F(x, t+1)) / 2
  - fecondite : profil par age de 2025 (Insee), mis a l'echelle de l'indicateur conjoncturel voulu et decale pour suivre l'age moyen voulu ;
  - mortalite : table Insee 2023-2025 multipliee par un facteur commun a tous les ages, recalcule chaque annee pour que l'esperance de vie
    a la naissance suive la trajectoire choisie (gain annuel, par sexe) ;
  - migration : solde annuel total repartit selon un profil par age et sexe (residu de cohortes 2018-2019, 2022-2025, ages 1-64).
Ce sont des hypotheses et des ordres de grandeur, jamais des previsions.
"""
import csv
import os

AGE_MAX = 105  # groupe ouvert « 105 ans ou plus »
HOMME, FEMME = 0, 1


# ---------------------------------------------------------------- lecture (seule partie qui touche aux fichiers)
def _lire(chemin):
    with open(chemin, encoding="utf-8") as f:
        return list(csv.reader(l for l in f if not l.startswith("#")))


def charger_base(dossier_donnees):
    """Lit les CSV de donnees/ et renvoie le dictionnaire `base` utilise par projeter()."""
    d = dossier_donnees
    pyr = {HOMME: [0.0] * (AGE_MAX + 1), FEMME: [0.0] * (AGE_MAX + 1)}
    for r in _lire(os.path.join(d, "pyramide_2026_france.csv"))[1:]:
        a = int(r[0])
        pyr[HOMME][a], pyr[FEMME][a] = float(r[1]), float(r[2])
    q = {}
    e0 = {}
    for r in _lire(os.path.join(d, "mortalite_tables_triennales_1999_2025.csv"))[1:]:
        if int(r[0]) != 2025:
            continue
        a = int(r[1])
        q.setdefault(HOMME, [None] * (AGE_MAX + 1))[a] = float(r[3]) / 1e5
        q.setdefault(FEMME, [None] * (AGE_MAX + 1))[a] = float(r[2]) / 1e5
        if a == 0:
            e0[HOMME], e0[FEMME] = float(r[5]), float(r[4])
    for s in (HOMME, FEMME):  # la table s'arrete a 104 ans : 105+ garde le quotient de 104
        q[s][AGE_MAX] = q[s][AGE_MAX - 1]
    fec = {}
    for r in _lire(os.path.join(d, "fecondite_par_age_1994_2025.csv"))[1:]:
        if int(r[0]) == 2025:
            fec[int(r[1])] = float(r[2]) / 1e4
    age_moyen_2025 = None
    for r in _lire(os.path.join(d, "icf_1901_2025.csv"))[1:]:
        if int(r[0]) == 2025:
            age_moyen_2025 = float(r[4])
    mig = {HOMME: [0.0] * (AGE_MAX + 1), FEMME: [0.0] * (AGE_MAX + 1)}
    for r in _lire(os.path.join(d, "migration_profil_residuel.csv"))[1:]:
        mig[HOMME][int(r[0])], mig[FEMME][int(r[0])] = float(r[1]), float(r[2])
    return {
        "pyramide": pyr, "q": q, "e0_base": e0, "annee_e0_base": 2024,
        "fecondite_2025": fec, "icf_2025": sum(fec.values()), "age_moyen_2025": age_moyen_2025,
        "profil_migration": mig, "part_garcons": pyr[HOMME][0] / (pyr[HOMME][0] + pyr[FEMME][0]),
        "annee_depart": 2026,
    }


# ---------------------------------------------------------------- parametres
def parametres(base, **modif):
    """Scenario central Insee 2026 (hypotheses de l'Insee Premiere 2108), modifiable par mot-cle.

    icf_cible / annee_icf        : indicateur conjoncturel de fecondite atteint (lineairement depuis 2025) a cette annee
    age_moyen_cible / annee_age  : age moyen conjoncturel a l'accouchement (Insee : 33,0 en 2050, stable ensuite)
    gain_e0_hommes / _femmes     : gain annuel d'esperance de vie a la naissance (annees par an)
    solde_migratoire             : solde annuel (personnes par an), a partir de 2026
    age_depart                   : age de depart a la retraite pour les indicateurs de dependance et de pensions
    """
    cible_f, cible_h = 89.5, 86.7
    n = 2070 - base["annee_e0_base"]
    p = {
        "icf_cible": 1.45, "annee_icf": 2028,
        "age_moyen_cible": 33.0, "annee_age": 2050,
        "gain_e0_femmes": (cible_f - base["e0_base"][FEMME]) / n,
        "gain_e0_hommes": (cible_h - base["e0_base"][HOMME]) / n,
        "solde_migratoire": 150000.0,
        "age_depart": 64,
        "horizon": 2070,
    }
    inconnu = set(modif) - set(p)
    if inconnu:
        raise KeyError("parametre inconnu : %s" % sorted(inconnu))
    p.update(modif)
    return p


def scenario_insee(base, nom):
    """Hypotheses des scenarios Insee 2026 (central, fecondite_basse/haute, migration_basse/haute, ev_basse/haute,
    population_basse/haute = toutes composantes defavorables/favorables, population_agee/jeune)."""
    n = 2070 - base["annee_e0_base"]
    def gains(f70, h70):
        return {"gain_e0_femmes": (f70 - base["e0_base"][FEMME]) / n, "gain_e0_hommes": (h70 - base["e0_base"][HOMME]) / n}
    fb = {"icf_cible": 1.20, "annee_icf": 2030}
    fh = {"icf_cible": 1.70, "annee_icf": 2030}
    mb, mh = {"solde_migratoire": 70000.0}, {"solde_migratoire": 230000.0}
    eb, eh = gains(86.5, 83.7), gains(92.5, 89.7)
    def fusion(*ds):
        o = {}
        for x in ds:
            o.update(x)
        return o
    table = {
        "central": {}, "fecondite_basse": fb, "fecondite_haute": fh, "migration_basse": mb, "migration_haute": mh,
        "ev_basse": eb, "ev_haute": eh,
        "population_basse": fusion(fb, mb, eb), "population_haute": fusion(fh, mh, eh),
        "population_agee": fusion(fb, mb, eh), "population_jeune": fusion(fh, mh, eb),
        "ev_constante": {"gain_e0_femmes": 0.0, "gain_e0_hommes": 0.0},
    }
    return parametres(base, **table[nom])


# ---------------------------------------------------------------- mortalite
def esperance_vie(q):
    """Esperance de vie a la naissance d'une table de quotients q[0..AGE_MAX] (deces uniformes dans l'annee,
    sauf age 0 : exposition 0,9 an en moyenne ; le dernier age est clos par q constant)."""
    l, somme = 1.0, 0.0
    for a in range(AGE_MAX):
        d = l * q[a]
        somme += (l - 0.9 * d) if a == 0 else (l - 0.5 * d)
        l -= d
    somme += l / max(q[AGE_MAX], 1e-9) if q[AGE_MAX] > 0 else 0.0
    return somme


def table_pour_esperance(q_base, cible):
    """Multiplie tous les quotients par un facteur c (dichotomie) pour obtenir l'esperance de vie `cible`."""
    lo, hi = 0.02, 3.0
    for _ in range(60):
        c = (lo + hi) / 2
        e = esperance_vie([min(0.999, c * x) for x in q_base])
        if e > cible:
            lo = c
        else:
            hi = c
    c = (lo + hi) / 2
    return [min(0.999, c * x) for x in q_base]


# ---------------------------------------------------------------- fecondite
def profil_fecondite(base, annee, p):
    """Taux de fecondite par age atteint (15..49), enfants par femme et par age, pour l'annee."""
    base_f = base["fecondite_2025"]
    icf0 = base["icf_2025"]
    # ICF : lineaire de 2025 a (annee_icf), puis constant
    if annee >= p["annee_icf"]:
        icf = p["icf_cible"]
    else:
        icf = icf0 + (p["icf_cible"] - icf0) * (annee - 2025) / (p["annee_icf"] - 2025)
    # decalage d'age : lineaire de 2025 a annee_age, puis constant
    if annee >= p["annee_age"]:
        delta = p["age_moyen_cible"] - base["age_moyen_2025"]
    else:
        delta = (p["age_moyen_cible"] - base["age_moyen_2025"]) * (annee - 2025) / (p["annee_age"] - 2025)
    forme = {}
    for x in range(15, 50):
        y = x - delta  # taux a l'age x = taux de base a l'age x - delta (interpolation lineaire)
        i = int(y // 1)
        w = y - i
        forme[x] = (1 - w) * base_f.get(i, 0.0) + w * base_f.get(i + 1, 0.0)
    s = sum(forme.values())
    return {x: icf * v / s for x, v in forme.items()}


# ---------------------------------------------------------------- un pas de projection
def pas(base, p, annee, pop):
    """Passe de la pyramide au 1er janvier `annee` a celle de `annee`+1. pop = {sexe: liste[0..AGE_MAX]}.
    Renvoie (nouvelle_pop, naissances, deces, migrants)."""
    t = annee + 0.5
    qs = {}
    for s, g in ((HOMME, p["gain_e0_hommes"]), (FEMME, p["gain_e0_femmes"])):
        cible = base["e0_base"][s] + g * (t - base["annee_e0_base"])
        qs[s] = table_pour_esperance(base["q"][s], cible)
    mig_tot = sum(sum(v[1:65]) for v in base["profil_migration"].values())
    nouvelle = {HOMME: [0.0] * (AGE_MAX + 1), FEMME: [0.0] * (AGE_MAX + 1)}
    migrants = 0.0
    for s in (HOMME, FEMME):
        for a in range(AGE_MAX):
            nouvelle[s][a + 1] += pop[s][a] * (1 - qs[s][a])
        nouvelle[s][AGE_MAX] += pop[s][AGE_MAX] * (1 - qs[s][AGE_MAX])
        for a in range(1, 65):
            m = p["solde_migratoire"] * base["profil_migration"][s][a] / mig_tot
            nouvelle[s][a] += m
            migrants += m
    f = profil_fecondite(base, annee, p)  # taux de l'annee `annee`
    naissances = 0.0
    for x in range(15, 50):
        expo = (pop[FEMME][x - 1] + nouvelle[FEMME][x]) / 2
        naissances += f[x] * expo
    nouvelle[HOMME][0] = naissances * base["part_garcons"] * (1 - qs[HOMME][0] / 2)
    nouvelle[FEMME][0] = naissances * (1 - base["part_garcons"]) * (1 - qs[FEMME][0] / 2)
    avant = sum(sum(v) for v in pop.values())
    apres = sum(sum(v) for v in nouvelle.values())
    deces = avant + naissances + migrants - apres
    return nouvelle, naissances, deces, migrants


# ---------------------------------------------------------------- indicateurs
def somme_ages(pop, a, b):
    """Population des deux sexes de a a b ans revolus inclus (b = None : sans limite)."""
    b = AGE_MAX if b is None else min(b, AGE_MAX)
    return sum(pop[s][i] for s in pop for i in range(a, b + 1))


def indicateurs(pop, age_depart, ref=None):
    """Indicateurs d'une pyramide. `ref` = (retraites/actifs de reference 2026 a 62 ans) pour l'indice pensions."""
    tot = somme_ages(pop, 0, None)
    o = {
        "total": tot, "0_19": somme_ages(pop, 0, 19), "20_64": somme_ages(pop, 20, 64),
        "60_plus": somme_ages(pop, 60, None), "65_plus": somme_ages(pop, 65, None),
        "75_plus": somme_ages(pop, 75, None), "80_plus": somme_ages(pop, 80, None),
    }
    o["dependance_65_sur_20_64"] = o["65_plus"] / o["20_64"]
    ret = somme_ages(pop, age_depart, None)
    act = somme_ages(pop, 20, age_depart - 1)
    o["retraites_par_actif"] = ret / act  # personnes de >= age_depart pour une de 20..age_depart-1
    o["actifs_par_retraite"] = act / ret
    o["age_depart"] = age_depart
    if ref is not None:
        o["depenses_retraite_pct_pib_pension_constante"] = ref["part_pib_2025"] * o["retraites_par_actif"] / ref["ratio_2026_age62"]
    return o


def reference_pensions(base, part_pib_2025=14.1):
    """Calage de l'indice « pension moyenne constante -> part du PIB » : en 2026, les personnes de 62 ans ou plus
    pour une personne de 20 a 61 ans correspondent a la part du PIB consacree aux retraites en 2025 (COR 2026 : 14,1 %)."""
    pop = base["pyramide"]
    ret = somme_ages(pop, 62, None)
    act = somme_ages(pop, 20, 61)
    return {"part_pib_2025": part_pib_2025, "ratio_2026_age62": ret / act}


# ---------------------------------------------------------------- projection complete
def projeter(base, p, part_pib_2025=14.1):
    """Renvoie une liste (une entree par annee 2026..horizon) de dictionnaires :
    annee, indicateurs, pyramide (au 1er janvier), naissances / deces / migrants (flux de l'annee, None pour la derniere)."""
    ref = reference_pensions(base, part_pib_2025)
    pop = {s: list(base["pyramide"][s]) for s in (HOMME, FEMME)}
    sortie = []
    annee = base["annee_depart"]
    ind = indicateurs(pop, p["age_depart"], ref)
    sortie.append({"annee": annee, "pyramide": {s: list(pop[s]) for s in pop}, "naissances": None, "deces": None, "migrants": None, **ind})
    while annee < p["horizon"]:
        pop, nais, dec, mig = pas(base, p, annee, pop)
        # flux de l'annee `annee` (du 1er janvier `annee` au 1er janvier `annee`+1), rattaches a l'entree de `annee`
        sortie[-1]["naissances"], sortie[-1]["deces"], sortie[-1]["migrants"] = nais, dec, mig
        annee += 1
        ind = indicateurs(pop, p["age_depart"], ref)
        sortie.append({"annee": annee, "pyramide": {s: list(pop[s]) for s in pop}, "naissances": None, "deces": None, "migrants": None, **ind})
    return sortie


def par_annee(serie):
    return {x["annee"]: x for x in serie}


if __name__ == "__main__":
    ici = os.path.dirname(os.path.abspath(__file__))
    b = charger_base(os.path.join(ici, "..", "donnees"))
    r = par_annee(projeter(b, parametres(b)))
    for an in (2026, 2040, 2070):
        x = r[an]
        print(an, "total %.2f M" % (x["total"] / 1e6), "65+ %.2f M" % (x["65_plus"] / 1e6), "dependance %.1f %%" % (100 * x["dependance_65_sur_20_64"]))
