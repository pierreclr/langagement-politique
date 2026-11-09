# -*- coding: utf-8 -*-
"""Module « emploi et cotisants » (T34) : branché sur les populations par âge et sexe de modele.py.
Fonctions pures, Python standard. Les hypothèses sont numérotées H13 et suivantes dans METHODE.md.
Aucune prédiction : « que donnent la population, l'activité, le chômage et l'âge de départ SI ... »."""
import csv
import os

import modele as m

DONNEES = m.DONNEES
AGES = m.AGES
SEXES = ("M", "F")
BANDES = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]   # début de tranche quinquennale ; 70 = « 70 ans et plus »
AGE_FIN_ACTIVITE = 75
A0, AN = 2025, 2070
TAUX_REF = 0.07            # taux de chômage global du scénario COR 7 % (diviseur des coefficients d'âge, H15)
AN_CIBLE_CHOMAGE = 2040    # le COR atteint ses cibles de chômage en 2040


# ---------------------------------------------------------------- chargement
def _csv(nom, dossier):
    return csv.DictReader(open(os.path.join(dossier, nom), encoding="utf-8"))


def charger_emploi(dossier=DONNEES):
    """Charge les CSV produits par donnees/preparer_emploi.py. Taux en fraction (0-1)."""
    hyp = {}   # (u_pct, grandeur, sexe, age_debut) -> {annee: taux}
    for r in _csv("cor_hypotheses_emploi.csv", dossier):
        hyp.setdefault((int(r["chomage_long_terme_pct"]), r["grandeur"], r["sexe"], int(r["age_debut_tranche"])), {})[int(r["annee"])] = float(r["taux_pct"]) / 100
    act = {}   # (sexe, age_debut) -> {annee: taux}   (figure 1.8 du COR : 2025, 2050, 2070)
    for r in _csv("cor_activite_age.csv", dossier):
        act[(r["sexe"], int(r["age_debut_tranche"]))] = {int(a): float(r[a]) / 100 for a in ("1975", "2025", "2050", "2070")}
    cot = {}   # (grandeur, serie) -> {annee: valeur}
    for r in _csv("cor_cotisants_retraites.csv", dossier):
        cot.setdefault((r["grandeur"], r["serie"]), {})[int(r["annee"])] = float(r["valeur"])
    ret = {}   # (sexe M/F, age) -> {annee: taux} (retraités de droit direct résidant en France, 50-70 ans)
    for r in _csv("cor_taux_retraites.csv", dossier):
        if r["sexe"] in ("Femmes", "Hommes"):
            ret.setdefault(("F" if r["sexe"] == "Femmes" else "M", int(r["age"])), {})[int(r["annee"])] = float(r["taux"])
    macro = {}
    for r in _csv("cor_macro.csv", dossier):
        macro.setdefault((r["grandeur"], r["serie"]), {})[int(r["annee"])] = float(r["valeur"])
    age_dep = {r["annee"]: float(r["age"]) for r in _csv("cor_age_depart.csv", dossier) if r["serie"] in ("Obs", "Tous scénarios")}
    age_dep = {int(a): v for a, v in age_dep.items()}
    eu = {}
    for r in _csv("eurostat_emploi_FR.csv", dossier):
        eu[(r["indicateur"], r["sexe"], r["age"], int(r["annee"]))] = float(r["valeur"])
    return {"hyp": hyp, "act": act, "cot": cot, "ret": ret, "macro": macro, "age_depart_cor": age_dep, "eu": eu}


# ---------------------------------------------------------------- courbes par âge
def lisser_tranches(valeurs, iterations=40):
    """Passe de taux par tranche quinquennale ({age_debut: taux}, tranche 70 = 70+) à 101 taux par âge simple.
    Interpolation linéaire entre les centres de tranche, puis ajustement itératif pour que la moyenne de chaque tranche
    (non pondérée) retrouve la valeur donnée. Âges < 15 : 0 ; âges >= 70 : taux de la tranche 70+ (H13)."""
    noeuds = {a: valeurs[a] for a in BANDES if a in valeurs}
    xs = sorted(noeuds)

    def courbe(nd):
        out = [0.0] * AGES
        for age in range(15, AGES):
            c = age + 0.5
            if age >= 70:
                out[age] = nd[70]
            elif c <= xs[0] + 2.5:
                out[age] = nd[xs[0]]
            else:
                for lo, hi in zip(xs, xs[1:]):
                    cl, ch = lo + 2.5, hi + 2.5
                    if hi == 70:
                        ch = 72.5
                    if cl <= c <= ch:
                        out[age] = nd[lo] + (nd[hi] - nd[lo]) * (c - cl) / (ch - cl)
                        break
        return out

    nd = dict(noeuds)
    for _ in range(iterations):
        c = courbe(nd)
        for a in xs:
            if a == 70:
                continue
            moy = sum(c[a:a + 5]) / 5
            nd[a] = min(1.0, max(0.0, nd[a] + (noeuds[a] - moy)))
    return [min(1.0, max(0.0, x)) for x in courbe(nd)]


def moyenne_tranche(courbe, age_debut):
    return sum(courbe[age_debut:age_debut + 5]) / 5


def decaler(courbe, delta, a_partir=50):
    """Décale la courbe de delta années vers les âges élevés au-delà de a_partir (delta > 0 : on travaille ou on part plus tard) :
    taux'(x) = taux(x - delta). Interpolation linéaire entre âges simples, bornée aux extrémités. Âges < a_partir : inchangés."""
    if abs(delta) < 1e-12:
        return list(courbe)
    out = list(courbe)
    for x in range(a_partir, AGES):
        y = x - delta
        if y <= 0:
            out[x] = courbe[0]
        elif y >= AGES - 1:
            out[x] = courbe[-1]
        else:
            lo = int(y)
            f = y - lo
            out[x] = courbe[lo] * (1 - f) + courbe[lo + 1] * f
    return out


def courbe_retraites(taux_par_age):
    """taux_par_age : {age: taux} pour 50-70 ans -> 101 taux : 0 avant 50 ans, taux de 70 ans ensuite."""
    out = [0.0] * AGES
    for a in range(AGES):
        out[a] = 0.0 if a < min(taux_par_age) else taux_par_age[min(a, 70)]
    return out


# ---------------------------------------------------------------- hypothèses d'emploi par tranche
def _sx(sexe):
    """Le COR note H (hommes) là où modele.py note M."""
    return "H" if sexe == "M" else sexe


def activite_cor(d, sexe, annee, u_ref=7):
    """Taux d'activité par tranche, déduit des hypothèses COR : emploi / (1 - chômage), jeu « chômage de long terme u_ref »."""
    out = {}
    for b in BANDES:
        e = d["hyp"][(u_ref, "emploi", _sx(sexe), b)][annee]
        c = d["hyp"][(u_ref, "chomage", _sx(sexe), b)][annee]
        out[b] = e / (1 - c)
    return out


def coef_chomage(d, sexe, u_ref=7, an=AN_CIBLE_CHOMAGE):
    """Coefficient d'âge du chômage : taux de la tranche dans le scénario COR u_ref en 2040 / taux global (u_ref). H15."""
    return {b: d["hyp"][(u_ref, "chomage", _sx(sexe), b)][an] / (u_ref / 100) for b in BANDES}


def chemin_chomage(d, u_lt, an_cible=AN_CIBLE_CHOMAGE):
    """Taux de chômage global par année : série COR du scénario 7 % (observée 2025 puis trajectoire), puis écart (u_lt - 7 %)
    appliqué en rampe linéaire de 2026 à 2040. Pour u_lt = 7 %, c'est exactement la série COR. H15."""
    ref = d["macro"][("taux_chomage", "Scénario de référence 7%")]

    def u(t):
        w = min(1.0, max(0.0, (t - 2026) / (an_cible - 2026)))
        return ref[min(max(t, A0), AN)] + (u_lt - 0.07) * w
    return u


# ---------------------------------------------------------------- âge de départ
def chemin_age_depart(d, nom="cor", valeur=0.0, an_debut=2027, an_fin=2040):
    """Retourne delta(t) : écart, en années, entre l'âge effectif de départ du scénario et celui du COR (figure 2.5 du COR, 63,1 ans
    en 2025 puis 64,5 ans en 2040 à législation constante). 'cor' : 0 ; 'gel_2025' : l'âge reste à son niveau 2025 ;
    'rampe' : écart linéaire de 0 (an_debut) à `valeur` années (an_fin), ensuite constant."""
    cor = d["age_depart_cor"]
    if nom == "cor":
        return lambda t: 0.0
    if nom == "gel_2025":
        return lambda t: cor[A0] - cor[min(max(t, A0), AN)]
    if nom == "rampe":
        return lambda t: valeur * min(1.0, max(0.0, (t - an_debut) / (an_fin - an_debut)))
    raise ValueError(nom)


# ---------------------------------------------------------------- robotisation
def reduction_besoin_emploi(r_final, an_debut=2030, an_fin=2060, forme="logistique"):
    """Part (0-1) des emplois du scénario de base qui ne sont plus nécessaires en t. Hypothèse, pas une prédiction.
    Rampe : 0 avant an_debut, r_final à partir de an_fin ; forme 'logistique' (diffusion en S) ou 'lineaire'. H18."""
    def r(t):
        x = min(1.0, max(0.0, (t - an_debut) / (an_fin - an_debut)))
        if forme == "lineaire":
            return r_final * x
        s = 1 / (1 + 2.718281828 ** (-10 * (x - 0.5)))
        s0, s1 = 1 / (1 + 2.718281828 ** 5), 1 / (1 + 2.718281828 ** -5)
        return r_final * (s - s0) / (s1 - s0)
    return r


def appliquer_robotisation(actifs, emploi, r, compensation=0.0, part_chomage=0.5):
    """Applique une baisse du besoin d'emploi. perte nette = r × (1 - compensation) × emploi. La perte se répartit entre chômage
    (part_chomage, la personne reste active) et inactivité (le reste : découragement, retraite anticipée, formation). Renvoie
    (actifs', emploi', chomeurs'). H18."""
    perte = emploi * r * (1 - compensation)
    emploi2 = emploi - perte
    actifs2 = actifs - perte * (1 - part_chomage)
    return actifs2, emploi2, actifs2 - emploi2


# ---------------------------------------------------------------- calcul pour une année
def taux_par_age(d, sexe, t, mode, u_global, delta, u_ref=7):
    """Taux d'activité, d'emploi et de retraités par âge simple pour (sexe, année).
    mode 'cor' : activité COR de l'année t (emploi / (1 - chômage), jeu 7 %) ; mode 'gel_2025' : taux 2025 constants (effet démographique seul).
    Le chômage de la tranche = coefficient d'âge × taux global u_global. L'âge de départ décale (delta années) l'activité >= 50 ans et les taux de retraités."""
    an_t = A0 if mode == "gel_2025" else min(max(t, A0), AN)
    act_b = activite_cor(d, sexe, an_t, u_ref)
    act = decaler(lisser_tranches(act_b), delta)
    k = coef_chomage(d, sexe, u_ref)
    chom_b = {b: min(0.95, k[b] * u_global) for b in BANDES}
    chom = decaler(lisser_tranches(chom_b), delta)
    emploi = [act[x] * (1 - chom[x]) for x in range(AGES)]
    ret_t = {a: d["ret"][(sexe, a)][an_t] for a in range(50, 71)}
    ret = decaler(courbe_retraites(ret_t), delta, a_partir=50)
    return act, chom, emploi, ret


def calculer(d, pop, t, mode="cor", u_lt=0.07, delta=0.0, u_global=None, u_ref=7):
    """Indicateurs de t à partir de pop = {'M': [101], 'F': [101]}. Effectifs en personnes. delta : décalage d'âge de départ (années)."""
    if u_global is None:
        u_global = chemin_chomage(d, u_lt)(t) if mode != "gel_2025" else chemin_chomage(d, u_lt)(A0)
    actifs = emploi = retraites = 0.0
    pop_15_64 = actifs_15_64 = emploi_15_64 = 0.0
    for s in SEXES:
        act, chom, emp, ret = taux_par_age(d, s, t, mode, u_global, delta, u_ref)
        for x in range(AGES):
            p = pop[s][x]
            actifs += p * act[x]
            emploi += p * emp[x]
            retraites += p * ret[x]
            if 15 <= x <= 64:
                pop_15_64 += p
                actifs_15_64 += p * act[x]
                emploi_15_64 += p * emp[x]
    return {"actifs": actifs, "emploi": emploi, "chomeurs": actifs - emploi, "retraites_residents": retraites,
            "taux_activite_15_64": actifs_15_64 / pop_15_64, "taux_emploi_15_64": emploi_15_64 / pop_15_64,
            "taux_chomage": (actifs - emploi) / actifs, "pop_15_64": pop_15_64}


def calibrage(d, pop_2025):
    """Constantes de calage 2025, sur le scénario de référence COR (H16) :
    kappa = cotisants COR / emploi du modèle ; lam = retraités (tous) / retraités résidant en France (COR)."""
    base = calculer(d, pop_2025, A0)
    cot = d["cot"][("cotisants_millions", "Sc. Ref")][A0] * 1e6
    lam = d["cot"][("retraites_tous_millions", "Sc. Ref")][A0] / d["cot"][("retraites_residents_millions", "Sc. Ref")][A0]
    return {"kappa": cot / base["emploi"], "lam": lam, "emploi_2025": base["emploi"]}


def projeter_emploi(d, etat, calage, mode="cor", u_lt=0.07, age_depart=("cor", 0.0), robot=None, annees=range(A0, AN + 1)):
    """etat = sortie de modele.projeter_scenario ({annee: {'pop': ...}}). age_depart = (nom, valeur) pour chemin_age_depart.
    robot = None ou dict(r_final, compensation, part_chomage, an_debut, an_fin, forme, hausse_salaire_2070).
    Renvoie {annee: indicateurs}, y compris cotisants (kappa × emploi) et rapport cotisants/retraités."""
    dfn = chemin_age_depart(d, *age_depart)
    rf = None
    if robot:
        rf = reduction_besoin_emploi(robot["r_final"], robot.get("an_debut", 2030), robot.get("an_fin", 2060), robot.get("forme", "logistique"))
    out = {}
    for t in annees:
        i = calculer(d, etat[t]["pop"], t, mode=mode, u_lt=u_lt, delta=dfn(t))
        actifs, emploi = i["actifs"], i["emploi"]
        if rf:
            actifs, emploi, _ = appliquer_robotisation(actifs, emploi, rf(t), robot.get("compensation", 0.0), robot.get("part_chomage", 0.5))
            # taux 15-64 : la perte est supposée répartie proportionnellement sur tous les âges (approximation)
            i["taux_emploi_15_64"] *= emploi / i["emploi"]
            i["taux_activite_15_64"] *= actifs / i["actifs"]
        masse = emploi
        if robot and robot.get("hausse_salaire_2070"):
            masse = emploi * (1 + robot["hausse_salaire_2070"] * rf(t) / max(robot["r_final"], 1e-12))
        i.update({"actifs": actifs, "emploi": emploi, "chomeurs": actifs - emploi, "taux_chomage": (actifs - emploi) / actifs})
        cot = calage["kappa"] * emploi
        ret = i["retraites_residents"] * calage["lam"]
        i.update({"cotisants": cot, "retraites_tous": ret, "rapport_cotisants_retraites": cot / ret,
                  "masse_salariale_indice": calage["kappa"] * masse, "rapport_masse_retraites": calage["kappa"] * masse / ret,
                  "delta_age_depart": dfn(t), "population": m.somme_ages(etat[t]["pop"], 0)})
        out[t] = i
    return out


# ---------------------------------------------------------------- pyramide Insee (contrôle des écarts)
def pyramide_insee(annee, dossier=DONNEES):
    """Pyramide Insee 2026 (annee 2026 ou 2070), âges 0-100+ (>= 100 regroupés), scénario central."""
    pop = {"M": [0.0] * AGES, "F": [0.0] * AGES}
    for r in _csv("insee2026_pyramide.csv", dossier):
        a = min(int(r["age"]), AGES - 1)
        pop["M"][a] += float(r[f"hommes_{annee}"])
        pop["F"][a] += float(r[f"femmes_{annee}"])
    return pop
