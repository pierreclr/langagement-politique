# -*- coding: utf-8 -*-
"""Modèle Agriculture : sortie des aides PAC, robotique, pollueur-payeur, revenu agricole.

Fonctions pures (aucune entrée-sortie hors `charger_*`). Des ordres de grandeur, jamais des
prédictions. Hypothèses numérotées : voir methode.md (H1 à H24). Lancer les tests :
    python3 -m unittest test_modele -v     (depuis modeles/agriculture/)
"""
import csv
import math
import os
from statistics import NormalDist

ICI = os.path.dirname(os.path.abspath(__file__))

# --- Constantes sourcées ou hypothèses (voir methode.md) -------------------------------------
N_EXPLOITATIONS = 282182          # exploitations représentées par le RICA 2024 (Agreste)
CA_MOYEN_KEUR = 210.0             # H3 : 33,7 k€ de subventions = 16 % du CA (Chatellier) -> 210 k€
CV_INTRA = 0.90                   # H5 : dispersion intra-filière, lue sur les déciles RICA (Chatellier : D1 -4,6 k€, D9 80,3 k€, moyenne 34,1 k€ -> écart type ≈ 33 k€)
CIBLE_NEGATIF_SANS_AIDES = 0.42   # fait : 42 % des exploitations RICA 2020-2022 (Chatellier 2025)
SEUIL_PLANCHER_KEUR = 17.1        # H8 hypothèse : ordre de grandeur d'un SMIC net annuel ⚠️ V6105
HORIZON = 10
# Ventes et recettes pesticides
Q_PHYTO_T = 65300.0               # t de substances actives, 2023 (SDES / Réussir)
RPD_MEUR = 188.0                  # redevance pour pollutions diffuses, 2023 (Reporterre)
DEPENSE_PHYTO_MEUR = 2000.0       # H12 ⚠️ V6100
# Azote
N_KT = 1850.0                     # kt d'azote livrées 2024-2025 (UNIFA via Pleinchamp)
PRIX_N_EUR_KG = 0.9               # H17 ⚠️ V6102
# N2O direct : 1 % de l'azote appliqué -> N2O-N ; 44/28 ; PRG100 = 273 (GIEC AR6)  H19 ⚠️ V6107
KGCO2E_PAR_KG_N = 0.01 * 44.0 / 28.0 * 273.0


# --- Chargement des données brutes ---------------------------------------------------------
def _lire_csv(chemin):
    with open(chemin, newline='', encoding='utf-8') as f:
        lignes = [l for l in f if not l.startswith('#')]
    return list(csv.DictReader(lignes))


def charger_filieres(chemin=None):
    chemin = chemin or os.path.join(ICI, 'donnees', 'filieres.csv')
    res = []
    for r in _lire_csv(chemin):
        res.append({
            'nom': r['filiere'],
            'part': float(r['part_exploitations']),
            'rcai': float(r['rcai_moyen_keur']),
            'dependance': float(r['dependance_subventions_sur_rcai']),
            'part_louee': float(r['part_sau_louee']),
            'phyto': float(r['intensite_phyto']),
            'azote': float(r['intensite_azote']),
            'exit': float(r['pac_exit_part']),
        })
    return res


def charger_pac(chemin=None):
    chemin = chemin or os.path.join(ICI, 'donnees', 'pac_aides_2024.csv')
    return {r['poste']: float(r['montant_meur']) for r in _lire_csv(chemin)}


# --- Scénarios : bas / central / haut = FAIBLE / MOYENNE / FORTE capacité d'adaptation -------
# (et non « coût bas/haut »). La politique (part_pse, plancher, calendrier) est la même partout : seuls les
# comportements varient. Chaque paramètre renvoie à une hypothèse de methode.md.
SCENARIOS = {
    'bas': {            # adaptation faible : le pire pour l'agriculteur
        'part_pse': 0.50, 'capitalisation': 0.10, 'adaptation': 0.05, 'cout_admin_pse': 0.15,
        'elast_phyto': -0.10, 'elast_azote': -0.10, 'multiple_taxe_phyto': 3.0, 'taxe_azote_eur_kg': 0.30,
        'part_restituee': 0.50, 'perte_rend_phyto': 0.05, 'perte_rend_azote': 0.05,
        'baisse_prix_robot_an': 0.03, 'valeur_travail': 1.0, 'plafond_adoption': 0.5,
        'comp_initiale': 1.0,
    },
    'central': {
        'part_pse': 0.50, 'capitalisation': 0.25, 'adaptation': 0.15, 'cout_admin_pse': 0.10,
        'elast_phyto': -0.28, 'elast_azote': -0.20, 'multiple_taxe_phyto': 3.0, 'taxe_azote_eur_kg': 0.30,
        'part_restituee': 0.50, 'perte_rend_phyto': 0.02, 'perte_rend_azote': 0.02,
        'baisse_prix_robot_an': 0.06, 'valeur_travail': 1.5, 'plafond_adoption': 1.0,
        'comp_initiale': 1.0,
    },
    'haut': {           # adaptation forte
        'part_pse': 0.50, 'capitalisation': 0.40, 'adaptation': 0.30, 'cout_admin_pse': 0.05,
        'elast_phyto': -0.50, 'elast_azote': -0.40, 'multiple_taxe_phyto': 3.0, 'taxe_azote_eur_kg': 0.30,
        'part_restituee': 0.50, 'perte_rend_phyto': 0.0, 'perte_rend_azote': 0.0,
        'baisse_prix_robot_an': 0.10, 'valeur_travail': 2.5, 'plafond_adoption': 1.5,
        'comp_initiale': 1.0,
    },
}

# Plafonds d'adoption à 10 ans par cas d'usage (part des exploitations de la filière) : H14
ADOPTION_PLAFOND = {'grandes_cultures': 0.10, 'maraichage_horticulture': 0.20, 'bovins_lait': 0.30}

# Cas d'usage des robots (euros courants) : H13-H16 ⚠️ V6095
ROBOTS = {
    'grandes_cultures': {'prix': 85000.0, 'ha': 50.0, 'alt_eur_ha': 65.0, 'duree': 10, 'entretien': 0.05},
    'maraichage_horticulture': {'prix': 23000.0, 'ha': 8.0, 'alt_eur_ha': 600.0, 'duree': 10, 'entretien': 0.05},
    'bovins_lait': {'prix': 150000.0, 'heures': 550.0, 'salaire': 15.0, 'duree': 12, 'entretien': 0.04},
}
TAUX_ACTUALISATION = 0.05


# --- Mathématiques de base ------------------------------------------------------------------
def phase(t, n=HORIZON):
    """Part de la sortie réalisée à l'année t (linéaire, 0 à 1)."""
    return max(0.0, min(1.0, t / float(n)))


def quantiles_z(k=50):
    """Quantiles centraux d'une loi normale réduite (milieux de k tranches égales)."""
    nd = NormalDist()
    return [nd.inv_cdf((i + 0.5) / k) for i in range(k)]


def subvention(f):
    """Subventions moyennes par exploitation (k€) = revenu x dépendance."""
    return f['rcai'] * f['dependance']


def revenus_avant(f, cv, k=50):
    """Revenus (k€) de k exploitations types de la filière, loi normale de moyenne rcai."""
    return [f['rcai'] * (1.0 + cv * z) for z in quantiles_z(k)]


def part_negative(f, cv, sans_aides, k=50):
    r = revenus_avant(f, cv, k)
    if sans_aides:
        s = subvention(f)
        r = [x - s for x in r]
    return sum(1 for x in r if x < 0) / float(k)


def part_negative_nationale(filieres, cv, sans_aides, k=50):
    return sum(f['part'] * part_negative(f, cv, sans_aides, k) for f in filieres)


def calibrer_cv(filieres, cible=CIBLE_NEGATIF_SANS_AIDES, k=500):
    """Coefficient de variation intra-filière tel que `cible` des exploitations soient
    à revenu négatif sans aides (dichotomie)."""
    bas, haut = 0.05, 3.0
    for _ in range(60):
        mid = (bas + haut) / 2
        if part_negative_nationale(filieres, mid, True, k) < cible:
            bas = mid
        else:
            haut = mid
    return (bas + haut) / 2


def annuite(prix, taux, duree):
    """Facteur de recouvrement du capital x prix : coût annuel d'un achat financé."""
    if taux == 0:
        return prix / float(duree)
    return prix * taux / (1.0 - (1.0 + taux) ** (-duree))


def prix_robot_a(prix0, baisse_an, t):
    return prix0 * (1.0 - baisse_an) ** t


# --- Robots ----------------------------------------------------------------------------------
def gain_robot(cas, sc, t, surcout_herbicide_eur_ha=0.0):
    """Gain annuel (€) d'une exploitation qui adopte, à l'année t. Peut être négatif."""
    p = ROBOTS[cas]
    prix = prix_robot_a(p['prix'], sc['baisse_prix_robot_an'], t)
    cout = annuite(prix, TAUX_ACTUALISATION, p['duree']) + p['entretien'] * prix
    if cas == 'bovins_lait':
        benefice = p['heures'] * p['salaire'] * sc['valeur_travail']
    else:
        benefice = p['ha'] * (p['alt_eur_ha'] + (surcout_herbicide_eur_ha if cas == 'grandes_cultures' else 0.0))
    return benefice - cout


def prix_robot_equilibre(cas, sc, surcout_herbicide_eur_ha=0.0):
    """Prix d'achat (€) au-dessous duquel le robot est rentable (gain >= 0)."""
    p = ROBOTS[cas]
    if cas == 'bovins_lait':
        benefice = p['heures'] * p['salaire'] * sc['valeur_travail']
    else:
        benefice = p['ha'] * (p['alt_eur_ha'] + (surcout_herbicide_eur_ha if cas == 'grandes_cultures' else 0.0))
    facteur = annuite(1.0, TAUX_ACTUALISATION, p['duree']) + p['entretien']
    return benefice / facteur


def annee_equilibre(cas, sc, surcout_herbicide_eur_ha=0.0):
    """Année où le robot devient rentable (None au-delà de 60 ans, 0 s'il l'est déjà)."""
    pe = prix_robot_equilibre(cas, sc, surcout_herbicide_eur_ha)
    p0 = ROBOTS[cas]['prix']
    if pe >= p0:
        return 0.0
    d = sc['baisse_prix_robot_an']
    if d <= 0:
        return None
    t = math.log(pe / p0) / math.log(1.0 - d)
    return t if t <= 60 else None


def adoption(cas, sc, t, n=HORIZON):
    """Part des exploitations de la filière qui ont adopté à l'année t (logistique, plafond H14)."""
    plafond = min(1.0, ADOPTION_PLAFOND[cas] * sc['plafond_adoption'])
    x = (t - n / 2.0) / (n / 6.0)
    # normalisée pour valoir 0 à t=0 et le plafond à t=n
    f = lambda u: 1.0 / (1.0 + math.exp(-u))
    lo, hi = f((0 - n / 2.0) / (n / 6.0)), f((n - n / 2.0) / (n / 6.0))
    return plafond * (f(x) - lo) / (hi - lo)


def gain_robot_moyen(filiere, sc, t, surcout_herbicide_eur_ha=0.0):
    """Gain moyen par exploitation de la filière (k€) : adoption x gain positif seulement
    (un adoptant rationnel n'achète que si le gain est >= 0)."""
    if filiere not in ROBOTS:
        return 0.0
    g = max(0.0, gain_robot(filiere, sc, t, surcout_herbicide_eur_ha))
    return adoption(filiere, sc, t) * g / 1000.0


PART_HERBICIDES = 0.35   # H16 ⚠️ V6108 : part des herbicides dans la dépense en produits phytosanitaires


def baisse_phyto_robots(filieres, sc, t, n=HORIZON):
    """Baisse relative (0 à 1) de la dépense nationale en pesticides due aux robots de désherbage :
    somme sur les filières équipées de intensité x adoption x part des herbicides, seulement si le
    robot est rentable à l'année t (borne haute : un robot remplace tout l'herbicide de sa surface)."""
    tot = 0.0
    for f in filieres:
        cas = f['nom']
        if cas in ('grandes_cultures', 'maraichage_horticulture') and gain_robot(cas, sc, t) >= 0.0:
            tot += f['phyto'] * adoption(cas, sc, t, n) * PART_HERBICIDES
    return tot


# --- Pollueur-payeur : pesticides ----------------------------------------------------------
def taux_effectif_eur_kg():
    return RPD_MEUR * 1e6 / (Q_PHYTO_T * 1000.0)


def prix_phyto_eur_kg():
    return DEPENSE_PHYTO_MEUR * 1e6 / (Q_PHYTO_T * 1000.0)


def pesticides(sc, t, n=HORIZON):
    """Effet de la hausse de la redevance à l'année t. Élasticité constante sur le prix payé."""
    m = 1.0 + (sc['multiple_taxe_phyto'] - 1.0) * phase(t, n)
    tx0, p0 = taux_effectif_eur_kg(), prix_phyto_eur_kg()
    p1 = p0 + (m - 1.0) * tx0
    q1_rel = (p1 / p0) ** sc['elast_phyto']
    q1_t = Q_PHYTO_T * q1_rel
    recette_meur = m * tx0 * q1_t * 1000.0 / 1e6
    return {
        'multiple': m, 'q_rel': q1_rel, 'baisse_pct': 100.0 * (1.0 - q1_rel),
        'recette_totale_meur': recette_meur, 'recette_additionnelle_meur': recette_meur - RPD_MEUR,
        'delta_depense_agri_meur': q1_t * 1000.0 * p1 / 1e6 - DEPENSE_PHYTO_MEUR,
    }


# --- Pollueur-payeur : azote ----------------------------------------------------------------
def multiple_pour_baisse(baisse, elasticite):
    """Multiple du taux effectif actuel de la redevance nécessaire pour obtenir une baisse relative
    `baisse` (0 à 1) des ventes, à élasticité constante."""
    hausse_prix = (1.0 - baisse) ** (1.0 / elasticite) - 1.0
    return 1.0 + hausse_prix * prix_phyto_eur_kg() / taux_effectif_eur_kg()


def azote(sc, t, n=HORIZON):
    taxe = sc['taxe_azote_eur_kg'] * phase(t, n)
    q_rel = ((PRIX_N_EUR_KG + taxe) / PRIX_N_EUR_KG) ** sc['elast_azote']
    q_kt = N_KT * q_rel
    recette = taxe * q_kt * 1e6 / 1e6          # kt x €/kg = M€
    return {
        'taxe_eur_kg': taxe, 'q_rel': q_rel, 'baisse_pct': 100.0 * (1.0 - q_rel),
        'recette_meur': recette,
        'delta_depense_agri_meur': (PRIX_N_EUR_KG + taxe) * q_kt - PRIX_N_EUR_KG * N_KT,
        'co2e_evite_mt': (N_KT - q_kt) * KGCO2E_PAR_KG_N / 1000.0,
    }


# --- Revenu agricole, par filière et par année --------------------------------------------
def perte_brute_keur(f, t, n=HORIZON):
    """Aides perdues par exploitation (k€) à l'année t : subvention x part sortante x phase."""
    return subvention(f) * f['exit'] * phase(t, n)


def montant_sortie_meur(filieres, t, n=HORIZON, nb=N_EXPLOITATIONS):
    return sum(nb * f['part'] * perte_brute_keur(f, t, n) / 1000.0 for f in filieres)


def effets_par_exploitation(f, sc, t, filieres=None, n=HORIZON, nb=N_EXPLOITATIONS, avec_taxes=True,
                            avec_pac=True, avec_robots=True):
    """Variation moyenne du revenu d'une exploitation de la filière (k€), SANS fonds de transition."""
    pb = perte_brute_keur(f, t, n) if avec_pac else 0.0
    perte_nette = pb * (1.0 - sc['capitalisation'] * f['part_louee']) * (1.0 - sc['adaptation'])
    pse = sc['part_pse'] * pb
    eff = -perte_nette + pse
    if avec_taxes:
        ph, az = pesticides(sc, t, n), azote(sc, t, n)
        expo_p = f['phyto'] / f['part']
        expo_a = f['azote'] / f['part']
        depense = (ph['delta_depense_agri_meur'] * expo_p + az['delta_depense_agri_meur'] * expo_a) * 1000.0 / nb
        refund = sc['part_restituee'] * (ph['recette_additionnelle_meur'] + az['recette_meur']) * 1000.0 / nb
        cut_p, cut_a = ph['baisse_pct'] / 100.0, az['baisse_pct'] / 100.0
        rend = CA_MOYEN_KEUR * (sc['perte_rend_phyto'] * cut_p * expo_p + sc['perte_rend_azote'] * cut_a * expo_a)
        eff += -depense + refund - rend
    if avec_robots:
        surc = (pesticides(sc, t, n)['recette_totale_meur'] * 1e6 / (Q_PHYTO_T * 1000.0)
                - taux_effectif_eur_kg()) if avec_taxes else 0.0
        # surcoût de l'herbicide par ha : taxe additionnelle par kg x ~1,5 kg d'herbicide par ha (H15)
        surc_ha = (pesticides(sc, t, n)['multiple'] - 1.0) * taux_effectif_eur_kg() * 1.5 if avec_taxes else 0.0
        eff += gain_robot_moyen(f['nom'], sc, t, surc_ha)
    return eff


def fonds_et_situation(filieres, sc, t, cv, n=HORIZON, nb=N_EXPLOITATIONS, k=50, seuil=SEUIL_PLANCHER_KEUR, **kw):
    """Coût du fonds de transition (M€) et situation des exploitations à l'année t.

    Fonds = max(compensation dégressive des pertes, remontée au plancher min(revenu avant, seuil))."""
    c = sc['comp_initiale'] * max(0.0, 1.0 - (t - 1) / float(n))
    cout = 0.0
    res = {}
    tot_neg_avant = tot_neg_sans = tot_neg_avec = tot_danger = tot_perd25 = 0.0
    for f in filieres:
        eff = effets_par_exploitation(f, sc, t, filieres, n, nb, **kw)
        c_f = 0.0
        neg_avant = neg_sans = neg_avec = danger = perd25 = 0
        for av in revenus_avant(f, cv, k):
            ap = av + eff
            perte = max(0.0, av - ap)
            ap1 = ap + c * perte
            plancher = min(av, seuil)
            ap2 = max(ap1, plancher) if t >= 1 else ap
            c_f += ap2 - ap
            neg_avant += av < 0
            neg_sans += ap < 0
            neg_avec += ap2 < 0
            danger += ap < plancher - 1e-12
            perd25 += perte > 0.25 * f['rcai']
        effectif = nb * f['part']
        cout += c_f / k * effectif / 1000.0
        res[f['nom']] = {
            'exploitations': effectif, 'variation_moyenne_keur': eff,
            'part_negatif_avant': neg_avant / float(k), 'part_negatif_sans_fonds': neg_sans / float(k),
            'part_negatif_avec_fonds': neg_avec / float(k),
            'exploitations_sous_plancher_sans_fonds': danger / float(k) * effectif,
            'exploitations_perte_sup_25pct': perd25 / float(k) * effectif,
            'revenu_moyen_apres_keur': f['rcai'] + eff + c_f / k,
        }
        tot_neg_avant += res[f['nom']]['part_negatif_avant'] * f['part']
        tot_neg_sans += res[f['nom']]['part_negatif_sans_fonds'] * f['part']
        tot_neg_avec += res[f['nom']]['part_negatif_avec_fonds'] * f['part']
        tot_danger += res[f['nom']]['exploitations_sous_plancher_sans_fonds']
        tot_perd25 += res[f['nom']]['exploitations_perte_sup_25pct']
    return {
        'fonds_meur': cout, 'par_filiere': res,
        'part_negatif_avant': tot_neg_avant, 'part_negatif_sans_fonds': tot_neg_sans,
        'part_negatif_avec_fonds': tot_neg_avec,
        'exploitations_sous_plancher_sans_fonds': tot_danger, 'exploitations_perte_sup_25pct': tot_perd25,
    }


def budget(filieres, sc, t, cv, cadre='union', n=HORIZON, nb=N_EXPLOITATIONS):
    """Budget de l'année t (M€, positif = gain pour les finances publiques).

    cadre 'union' : les aides sortantes sont économisées sur le budget consolidé UE + France.
    cadre 'france_seule' : aucune économie (les fonds européens ne reviennent pas à la France) et
    les paiements pour services environnementaux sont payés sur fonds nationaux."""
    sortie = montant_sortie_meur(filieres, t, n, nb)
    pse = sc['part_pse'] * sortie
    admin = sc['cout_admin_pse'] * pse
    fonds = fonds_et_situation(filieres, sc, t, CV_INTRA, n, nb)['fonds_meur']
    ph, az = pesticides(sc, t, n), azote(sc, t, n)
    taxes = ph['recette_additionnelle_meur'] + az['recette_meur']
    rest = sc['part_restituee'] * taxes
    economie = sortie if cadre == 'union' else 0.0
    net = economie + taxes - rest - pse - admin - fonds
    return {'sortie_meur': sortie, 'pse_meur': pse, 'admin_meur': admin, 'fonds_meur': fonds,
            'taxes_meur': taxes, 'restitution_meur': rest, 'net_meur': net,
            'poste_economie_meur': economie}


def trajectoire(filieres, nom_scenario, cadre='union', n=HORIZON):
    sc = SCENARIOS[nom_scenario]
    cv = CV_INTRA
    sortie = []
    for t in range(1, n + 1):
        b = budget(filieres, sc, t, cv, cadre, n)
        s = fonds_et_situation(filieres, sc, t, cv, n)
        sortie.append({'annee': t, 'budget': b, 'situation': s,
                       'pesticides': pesticides(sc, t, n), 'azote': azote(sc, t, n)})
    return sortie
