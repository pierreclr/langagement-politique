# -*- coding: utf-8 -*-
"""Modèle du grand âge : prix public unique, participation à 90 %, avance reprise sur succession.

Fonctions pures (aucun état global, aucune lecture de fichier) : les paramètres arrivent par un
dictionnaire ; les données brutes et leur source sont dans ../donnees/. Euros par mois sauf mention.
Des hypothèses et des ordres de grandeur, jamais des prédictions.

Vocabulaire : « bas » = hypothèses favorables aux finances publiques, « haut » = défavorables.
"""
from math import erf, exp, log, sqrt
from statistics import NormalDist

_N = NormalDist()

# --------------------------------------------------------------------------------------------
# Paramètres (hypothèses numérotées H1 à H20, décrites ci-dessous)
# --------------------------------------------------------------------------------------------
BASE = {
    # données sourcées (euros 2023, mois) -------------------------------------------------
    "residents_2023": 579_200,          # H1 hébergement permanent Ehpad+USLD+EHPA, DREES EHPA 2023
    "deces_par_an_2023": 182_000,       # H2 = 256 900 sorties x 71 % de décès (calcul)
    "cout_place_mois_2023": 54_684 / 12,  # H3 coût de revient par place, CNSA (public + non lucratif)
    "hebergement_jour_2023": 71.00,     # H4 tarif hébergement moyen, DREES
    "dependance_mois_2023": 560.0,      # H5 coût dépendance (tarif 2019 : 510 x 1,097), calcul
    "apa_ets_mois_2023": 2_693e6 / 549_000 / 12,   # H6 APA établissement par bénéficiaire
    "apa_ets_total_2023": 2_693e6,
    "ash_net_2023": 1_204e6,            # H7 ASH nette des récupérations
    "al_ri_mois_2023": 90.0,            # H8 aides au logement + réduction d'impôt (Autonomix 2019)
    "ticket_dependance_mois_2023": 170.0,  # reste à charge dépendance (Autonomix 2019)
    # système fiscal arrêté (07/11/2026) --------------------------------------------------
    "plancher": 877.0,                  # filet : personne seule
    "pension_seuil": 2_000.0,           # courbe des pensions
    "pension_taux": 0.2911,
    "pension_echelle": 1_500.0,
    "abattement_transmission": 300_000.0,  # sur la vie, par héritier
    "transmission_K": 100_000.0,        # forme de la fonction des transmissions
    "transmission_taux_max": 0.50,
    "cumul_recu_median": 70_000.0,      # H9 déjà reçu par un héritier moyen (CAE, repris du modèle transmissions)
    "heritiers_par_succession": 2,      # H10
    # règle proposée -----------------------------------------------------------------------
    "taux_participation": 0.90,
    "argent_de_poche_min": 120.0,       # H11 plancher du « reste à vivre » (115 € en 2024, DREES, relevé)
    # hypothèses de scénario (valeurs par scénario ci-dessous) -----------------------------
    "uplift_2023_2026": 1.08,
    "cout_place_facteur": 1.00,
    "ressources_uplift_2016_2026": 1.22,
    "tendance_institutionnalisation": -0.005,   # par an, sur le taux de résidents par 80 ans et plus
    "duree_sejour_deces": 2.83,
    "part_proprietaires": 0.55,
    "patrimoine_proprietaire_median": 200_000.0,
    "patrimoine_proprietaire_sigma": 0.80,
    "patrimoine_autres_median": 12_000.0,
    "patrimoine_autres_sigma": 1.20,
    "correlation_revenu_patrimoine": 0.5,
    "part_conjoint_domicile": 0.08,
    "transfert_conjoint": 300.0,
    "recuperation_sur_difference_totale": False,  # False : seule l'avance « hébergement » est reprise
    "ash_part_recuperee": 0.25,         # H12 : part des dépenses brutes d'ASH récupérée (non publiée ⚠️)
}

SCENARIOS = {
    "bas": {
        "uplift_2023_2026": 1.04, "cout_place_facteur": 0.90, "ressources_uplift_2016_2026": 1.30,
        "tendance_institutionnalisation": -0.010, "duree_sejour_deces": 2.40,
        "part_proprietaires": 0.65, "patrimoine_proprietaire_median": 250_000.0,
        "correlation_revenu_patrimoine": 0.3, "part_conjoint_domicile": 0.05, "transfert_conjoint": 200.0,
        "ash_part_recuperee": 0.35,
    },
    "central": {},
    "haut": {
        "uplift_2023_2026": 1.12, "cout_place_facteur": 1.10, "ressources_uplift_2016_2026": 1.15,
        "tendance_institutionnalisation": 0.0, "duree_sejour_deces": 3.30,
        "part_proprietaires": 0.40, "patrimoine_proprietaire_median": 150_000.0,
        "correlation_revenu_patrimoine": 0.7, "part_conjoint_domicile": 0.12, "transfert_conjoint": 400.0,
        "ash_part_recuperee": 0.15,
    },
}

POP_80_PLUS_M = {2023: 4.115, 2026: 4.323, 2028: 4.765, 2030: 5.216, 2035: 6.088,
                 2040: 6.708, 2050: 7.648}


def parametres(scenario="central", **surcharges):
    """Renvoie une copie des paramètres du scénario, avec d'éventuelles surcharges."""
    p = dict(BASE)
    p.update(SCENARIOS[scenario])
    p.update(surcharges)
    return p


# --------------------------------------------------------------------------------------------
# Règles du système fiscal arrêté
# --------------------------------------------------------------------------------------------
def courbe_pension(pension, p=BASE):
    """Prélèvement de la courbe des pensions (décision 59) ; nul jusqu'à 2 000 € nets."""
    x = pension - p["pension_seuil"]
    if x <= 0:
        return 0.0
    e = p["pension_echelle"]
    return p["pension_taux"] * (x - e * (1 - exp(-x / e)))


def revenu_resident(pension_nette_avant_courbe, revenus_capital=0.0, p=BASE):
    """Revenu Y du résident avant la règle des 90 % : pension après courbe, plus revenus du capital,
    relevé au plancher (filet) s'il est en dessous."""
    y = pension_nette_avant_courbe - courbe_pension(pension_nette_avant_courbe, p) + revenus_capital
    return max(y, p["plancher"])


def impot_transmission(x, p=BASE):
    """Droits sur x = cumul reçu au-delà de l'abattement : 50 % × (x − K ln(1 + x/K))."""
    if x <= 0:
        return 0.0
    k = p["transmission_K"]
    return p["transmission_taux_max"] * (x - k * log(1 + x / k))


# --------------------------------------------------------------------------------------------
# Prix public et participation
# --------------------------------------------------------------------------------------------
def prix_public(p):
    """Décomposition du prix public unique par résident et par mois (euros 2026)."""
    u = p["uplift_2023_2026"]
    total = p["cout_place_mois_2023"] * p["cout_place_facteur"] * u
    heb = p["hebergement_jour_2023"] * 365 / 12 * p["cout_place_facteur"] * u
    dep = p["dependance_mois_2023"] * p["cout_place_facteur"] * u
    soin = total - heb - dep
    return {"total": total, "hebergement": heb, "dependance": dep, "soin": soin}


def participation(y, p, conjoint_domicile=False):
    """Part du revenu versée au prix public : 90 % de Y, la personne gardant au moins 10 % et un minimum,
    sans jamais dépasser l'hébergement (le soin et la dépendance restent à la Sécurité sociale).
    Si un conjoint reste à domicile, la participation baisse d'un transfert (reste à vivre du conjoint)."""
    prix = prix_public(p)
    garde = max((1 - p["taux_participation"]) * y, p["argent_de_poche_min"])
    part = max(0.0, min(prix["hebergement"], y - garde))
    if conjoint_domicile:
        part = max(0.0, part - p["transfert_conjoint"])
    return part


def participation_couple(y1, y2, p):
    """Couple qui entre ensemble : chacun verse selon ses propres revenus (pas de mise en commun)."""
    return participation(y1, p), participation(y2, p)


# --------------------------------------------------------------------------------------------
# Distribution des revenus des résidents (calée sur DREES ER 1264)
# --------------------------------------------------------------------------------------------
def quantile_revenus_2016(u, q90, q99):
    """Quantile (u dans [0,1]) du niveau de vie des résidents en 2016, interpolation linéaire en log
    entre points connus : p0 = 700, p25 = 1 100, p50 = 1 400, p75 = 1 920 (DREES), puis q90, q99,
    p100 = 3 x q99."""
    pts = [(0.0, 700.0), (0.25, 1100.0), (0.50, 1400.0), (0.75, 1920.0), (0.90, q90), (0.99, q99),
           (1.0, 3.0 * q99)]
    for (u0, v0), (u1, v1) in zip(pts, pts[1:]):
        if u <= u1:
            t = (u - u0) / (u1 - u0)
            return exp(log(v0) + t * (log(v1) - log(v0)))
    return pts[-1][1]


def moyenne_revenus_2016(q90, q99, n=4000):
    return sum(quantile_revenus_2016((i + 0.5) / n, q90, q99) for i in range(n)) / n


def calibrer_queue(moyenne_cible=1700.0, q90=2700.0, bas=2000.0, haut=60000.0):
    """Trouve q99 tel que la moyenne du niveau de vie vaille 1 700 € (DREES). Dichotomie."""
    for _ in range(60):
        m = (bas + haut) / 2
        if moyenne_revenus_2016(q90, m) < moyenne_cible:
            bas = m
        else:
            haut = m
    return (bas + haut) / 2


def lognormale_mixte_quantile(u, w1, med1, sig1, med2, sig2):
    """Quantile d'un mélange de deux lognormales (poids w1 pour la première) par dichotomie."""
    def cdf(x):
        f = lambda med, sig: 0.5 * (1 + erf((log(x / med)) / (sig * sqrt(2))))
        return w1 * f(med1, sig1) + (1 - w1) * f(med2, sig2)
    lo, hi = 1.0, 1e9
    for _ in range(80):
        mid = sqrt(lo * hi)
        if cdf(mid) < u:
            lo = mid
        else:
            hi = mid
    return sqrt(lo * hi)


def population_residents(p, n_rev=100, n_eps=40):
    """Grille de résidents types : liste de (poids, revenu Y 2026, patrimoine à la succession E).
    Le patrimoine suit un mélange (propriétaires / autres), corrélé au revenu (copule gaussienne)."""
    q99 = calibrer_queue()
    corr = p["correlation_revenu_patrimoine"]
    nodes = [(_N.inv_cdf((j + 0.5) / n_eps)) for j in range(n_eps)]
    grille = []
    for i in range(n_rev):
        u = (i + 0.5) / n_rev
        y = quantile_revenus_2016(u, 2700.0, q99) * p["ressources_uplift_2016_2026"]
        y = max(y, p["plancher"])
        z = _N.inv_cdf(u)
        for eps in nodes:
            ue = _N.cdf(corr * z + sqrt(1 - corr ** 2) * eps)
            ue = min(max(ue, 1e-6), 1 - 1e-6)
            e = lognormale_mixte_quantile(
                ue, 1 - p["part_proprietaires"], p["patrimoine_autres_median"], p["patrimoine_autres_sigma"],
                p["patrimoine_proprietaire_median"], p["patrimoine_proprietaire_sigma"])
            grille.append((1.0 / (n_rev * n_eps), y, e))
    return grille


# --------------------------------------------------------------------------------------------
# Calculs agrégés
# --------------------------------------------------------------------------------------------
def residents_en(annee, p):
    """Résidents en hébergement permanent : 2023 x (80 ans et plus / 2023) x tendance du taux."""
    pop = POP_80_PLUS_M
    if annee in pop:
        croiss = pop[annee] / pop[2023]
    else:
        raise ValueError("année absente de la projection : %s" % annee)
    return p["residents_2023"] * croiss * (1 + p["tendance_institutionnalisation"]) ** max(0, annee - 2023)


def cout_public_actuel(p):
    """Dépense publique annuelle actuelle pour les résidents (Md€, euros 2026) : soin (reste à charge
    de l'assurance maladie, calculé par différence), APA établissement, ASH nette, aides au logement et
    réduction d'impôt."""
    u = p["uplift_2023_2026"]
    n = p["residents_2023"]
    prix = prix_public(p)
    soin = prix["soin"] * 12 * n
    apa = p["apa_ets_total_2023"] * u
    ash = p["ash_net_2023"] * u
    al_ri = p["al_ri_mois_2023"] * u * 12 * n
    return {"soin": soin / 1e9, "apa": apa / 1e9, "ash": ash / 1e9, "al_ri": al_ri / 1e9,
            "total": (soin + apa + ash + al_ri) / 1e9}


def reprise_succession(avance_totale, patrimoine, abattement_reprise, p):
    """Montant repris sur la succession : l'avance, dans la limite de l'actif au-delà de l'abattement."""
    return min(avance_totale, max(0.0, patrimoine - abattement_reprise))


def perte_droits_transmission(patrimoine, reprise, p):
    """Droits de transmission perdus parce que la reprise réduit la base (ce que la collectivité a repris
    n'est pas transmis, donc n'est pas taxé). Hypothèse : héritiers à parts égales, cumul déjà reçu
    égal à la médiane."""
    n = p["heritiers_par_succession"]
    a = p["abattement_transmission"]
    c0 = p["cumul_recu_median"]
    avant = impot_transmission(c0 + patrimoine / n - a, p)
    apres = impot_transmission(c0 + (patrimoine - reprise) / n - a, p)
    return n * (avant - apres)


def simuler(p, abattement_reprise, n_rev=100, n_eps=40):
    """Régime de croisière (euros 2026), flux annuels en Md€ pour les résidents de 2023."""
    prix = prix_public(p)
    n = p["residents_2023"]
    grille = population_residents(p, n_rev, n_eps)
    part_moy = reprise_moy = perte_droits_moy = avance_moy = part_nulle = 0.0
    part_avec_avance = part_succ_touchees = 0.0
    sur_difference = p["recuperation_sur_difference_totale"]
    dernier = {}
    for poids0, y_brut, e in grille:
        y = revenu_resident(y_brut, 0.0, p)  # y_brut est déjà un niveau de vie net ; courbe si > 2 000
        for part_cas, conjoint in ((1 - p["part_conjoint_domicile"], False), (p["part_conjoint_domicile"], True)):
            poids = poids0 * part_cas
            part = participation(y, p, conjoint_domicile=conjoint)
            cible = prix["total"] if sur_difference else prix["hebergement"]
            avance_mois = max(0.0, cible - part)
            avance_tot = avance_mois * 12 * p["duree_sejour_deces"]
            rep = reprise_succession(avance_tot, e, abattement_reprise, p)
            part_moy += poids * part
            avance_moy += poids * avance_mois
            reprise_moy += poids * rep
            perte_droits_moy += poids * perte_droits_transmission(e, rep, p)
            part_nulle += poids * (1.0 if part < 1.0 else 0.0)
            part_avec_avance += poids * (1.0 if avance_mois > 1.0 else 0.0)
            part_succ_touchees += poids * (1.0 if rep > 1.0 else 0.0)
    deces = p["deces_par_an_2023"]
    participation_annuelle = part_moy * 12 * n
    depense_totale = prix["total"] * 12 * n
    depense_publique_brute = depense_totale - participation_annuelle
    reprises = reprise_moy * deces
    return {
        "prix_total_mois": prix["total"], "prix_hebergement_mois": prix["hebergement"],
        "participation_moyenne_mois": part_moy,
        "recette_participation_Md": participation_annuelle / 1e9,
        "depense_totale_Md": depense_totale / 1e9,
        "depense_publique_brute_Md": depense_publique_brute / 1e9,
        "avance_hebergement_annuelle_Md": avance_moy * 12 * n / 1e9,
        "reprise_moyenne_par_deces": reprise_moy,
        "reprises_annuelles_Md": reprises / 1e9,
        "depense_publique_nette_Md": (depense_publique_brute - reprises) / 1e9,
        "perte_droits_transmission_Md": perte_droits_moy * deces / 1e9,
        "depense_publique_nette_apres_droits_Md": (depense_publique_brute - reprises
                                                    + perte_droits_moy * deces) / 1e9,
        "part_residents_sans_participation": part_nulle,
        "part_residents_avec_avance": part_avec_avance,
        "part_successions_touchees": part_succ_touchees,
        "reprise_moyenne_si_touchee": (reprise_moy / part_succ_touchees) if part_succ_touchees else 0.0,
    }


def projection(p, annee, abattement_reprise):
    """Résultat de croisière remis à l'échelle du nombre de résidents de l'année."""
    base = simuler(p, abattement_reprise)
    k = residents_en(annee, p) / p["residents_2023"]
    cles = [c for c in base if c.endswith("_Md")]
    out = dict(base)
    for c in cles:
        out[c] = base[c] * k
    out["residents"] = residents_en(annee, p)
    return out


# --------------------------------------------------------------------------------------------
# Cas types
# --------------------------------------------------------------------------------------------
def cas_type(pension, patrimoine, p, abattement_reprise, mois=None):
    """Un résident seul, pension nette `pension`, patrimoine `patrimoine` (maison comprise), séjour de
    `mois` mois (durée moyenne des personnes décédées en établissement par défaut).
    Compare aujourd'hui (aide sociale à l'hébergement si le revenu ne suffit pas, avance reprise sur la
    succession dès le premier euro) et la proposition."""
    mois = mois if mois is not None else p["duree_sejour_deces"] * 12
    prix = prix_public(p)
    u = p["uplift_2023_2026"]
    besoin_actuel = prix["hebergement"] + p["ticket_dependance_mois_2023"] * u - p["al_ri_mois_2023"] * u
    y = revenu_resident(pension, 0.0, p)
    # aujourd'hui (règle de l'aide sociale, CASF L132-3) : si le résident ne peut pas payer, l'aide sociale
    # complète, le résident verse 90 % de ses ressources et garde 10 % (avec un minimum) ; l'avance est
    # reprise sur la succession dès le premier euro ; s'il peut payer, il paie tout.
    poche_ash = max((1 - p["taux_participation"]) * y, p["argent_de_poche_min"])
    contribution = max(0.0, y - poche_ash)
    if besoin_actuel > y:
        manque_actuel = besoin_actuel - contribution   # avancé par l'aide sociale
        poche_actuelle = poche_ash
    else:
        manque_actuel = 0.0
        poche_actuelle = y - besoin_actuel
    reprise_actuelle = min(manque_actuel * mois, patrimoine)
    # proposition
    part = participation(y, p)
    avance = max(0.0, prix["hebergement"] - part)
    reprise_prop = reprise_succession(avance * mois, patrimoine, abattement_reprise, p)
    poche_prop = y - part
    return {
        "pension": pension, "patrimoine": patrimoine, "revenu_Y": y,
        "actuel_paye_par_mois": besoin_actuel - manque_actuel,
        "actuel_manque_par_mois": manque_actuel, "actuel_argent_de_poche": poche_actuelle,
        "actuel_prelevement_patrimoine": reprise_actuelle,
        "prop_participation_par_mois": part, "prop_argent_de_poche": poche_prop,
        "prop_avance_par_mois": avance, "prop_reprise_patrimoine": reprise_prop,
        "transmis_actuel": patrimoine - reprise_actuelle, "transmis_proposition": patrimoine - reprise_prop,
        "ecart_transmis": (patrimoine - reprise_prop) - (patrimoine - reprise_actuelle),
        "ecart_argent_de_poche_par_mois": poche_prop - poche_actuelle,
    }


def couple_entre_ensemble(pension1, pension2, patrimoine, p, abattement_reprise, mois=None):
    """Deux résidents ; chacun verse selon ses revenus ; la reprise se fait sur le patrimoine commun au
    second décès (on cumule les avances des deux)."""
    mois = mois if mois is not None else p["duree_sejour_deces"] * 12
    prix = prix_public(p)
    y1, y2 = revenu_resident(pension1, 0.0, p), revenu_resident(pension2, 0.0, p)
    p1, p2 = participation_couple(y1, y2, p)
    avance = max(0.0, prix["hebergement"] - p1) + max(0.0, prix["hebergement"] - p2)
    reprise = reprise_succession(avance * mois, patrimoine, abattement_reprise, p)
    return {"participations": (p1, p2), "poche": (y1 - p1, y2 - p2), "avance_par_mois": avance,
            "reprise": reprise, "transmis": patrimoine - reprise}


def conjoint_a_domicile(pension_resident, revenu_conjoint, p):
    """Un résident, un conjoint à domicile : la participation est réduite pour que le conjoint garde au
    moins le plancher, financé par la baisse de participation du résident (règle de l'aide sociale actuelle,
    qui laisse 961 € au conjoint en 2024)."""
    y = revenu_resident(pension_resident, 0.0, p)
    part0 = participation(y, p)
    manque = max(0.0, p["plancher"] - revenu_conjoint)
    return max(0.0, part0 - manque)


# --------------------------------------------------------------------------------------------
# Aide à domicile (même architecture, financée en priorité)
# --------------------------------------------------------------------------------------------
def domicile(p, hausse_volume):
    """Dépense publique d'APA à domicile après une hausse de volume `hausse_volume` (0,2 = + 20 %),
    la participation moyenne des bénéficiaires restant à son niveau actuel (47 €/mois, 2019 ⚠️).
    Renvoie Md€ par an (euros 2026)."""
    base = 4_293e6 * p["uplift_2023_2026"]
    return {"actuel_Md": base / 1e9, "propose_Md": base * (1 + hausse_volume) / 1e9,
            "surcout_Md": base * hausse_volume / 1e9}


def cout_public_domicile_vs_etablissement(cout_dom=33_300.0, part_dom=0.03, cout_ets=43_300.0, part_ets=0.32):
    """Dépense publique annuelle par personne en GIR 1 (hors gîte et couvert), PLACSS 2025."""
    return {"domicile": cout_dom * (1 - part_dom), "etablissement": cout_ets * (1 - part_ets)}


def recuperations_actuelles_ash(p):
    """Récupérations actuelles de l'ASH (obligés alimentaires et successions), Md€ euros 2026, déduites de
    la dépense nette si une part `ash_part_recuperee` de la dépense brute est récupérée. Cette part n'est
    pas publiée par la DREES : hypothèse (⚠️)."""
    nette = p["ash_net_2023"] * p["uplift_2023_2026"]
    part = p["ash_part_recuperee"]
    return nette * part / (1 - part) / 1e9


def cout_public_actuel_cale(p, couverture=0.74, gite_couvert_2020=813.0, indexation_gite=1.15):
    """Dépense publique actuelle recalée sur la couverture publique de 74 % publiée (DREES, PLACSS 2025),
    calculée hors dépenses de gîte et de couvert : 74 % x (dépense totale − gîte et couvert)."""
    n = p["residents_2023"]
    total = prix_public(p)["total"] * 12 * n
    gite = gite_couvert_2020 * indexation_gite * 12 * n
    return couverture * (total - gite) / 1e9
