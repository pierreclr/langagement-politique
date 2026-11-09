# -*- coding: utf-8 -*-
"""Modèle « loyers-energie » : plafond de loyer = base (par taille) + variable (par m²) − coût théorique de l'énergie.

Fonctions pures, sans entrée-sortie. Voir README.md pour l'énoncé, les hypothèses (H1...H14) et les sources.
Unités : surfaces en m², énergies en kWh/an, prix en €/kWh TTC, loyers et déductions en €/mois.
"""
import math

# ---------------------------------------------------------------- hypothèses et paramètres
CLASSES = list('ABCDEFG')
TAILLES = ['studio', 'T2', 'T3', 'T4', 'T5+']
BORNES_TAILLE = [(8, 27, 'studio'), (27, 45, 'T2'), (45, 70, 'T3'), (70, 110, 'T4'), (110, 250, 'T5+')]
# H5 : prix TTC du kWh (électricité : TRVE option Base, CRE, au 01/08/2026 ; les autres : hypothèses ⚠️)
PRIX_KWH = {'electricite': 0.2001, 'gaz': 0.13, 'fioul': 0.12, 'gpl': 0.16, 'bois': 0.09, 'reseau': 0.11, 'autre': 0.13}
P_REF_BESOIN = 0.15      # H6 : prix de référence du besoin de chauffage (€/kWh), ≈ moyenne pondérée du mix
ALPHA = 0.3              # H7 : poids du coût réel de chauffage (1 − ALPHA : coût du besoin du bâti)
COEF_EP = {'electricite': 1.9, 'gaz': 1.0, 'fioul': 1.0, 'gpl': 1.0, 'bois': 1.0, 'reseau': 1.0, 'autre': 1.0}  # EP/EF, depuis le 01/01/2026
SEUILS_EP = [(70, 'A'), (110, 'B'), (180, 'C'), (250, 'D'), (330, 'E'), (420, 'F')]  # kWh EP/m²/an ; au-delà : G
PRIMES_MARCHE = {'A': 0.04, 'B': 0.03, 'C': 0.01, 'D': 0.0, 'E': -0.02, 'F': -0.04, 'G': -0.06}  # H9 (⚠️ sans source)
# H10 : dispersion des loyers (écart-type du logarithme) à taille donnée, tirée des observatoires locaux des loyers (Grenoble 2024, Lyon 2024 :
# 1P 0,20-0,21 ; 2P 0,17-0,18 ; 3P 0,19-0,21 ; 4P+ 0,29-0,32, calculé par ln(D9/D1)/2,563) ; Paris : même valeur par défaut
SIGMA_TAILLE = {'studio': 0.20, 'T2': 0.18, 'T3': 0.20, 'T4': 0.30, 'T5+': 0.30}
SIGMA_PARIS = {'studio': 0.21, 'T2': 0.25, 'T3': 0.26, 'T4': 0.36, 'T5+': 0.36}  # Paris 2025 : ln(Q3/Q1)/1,349 (OLAP, déciles non publiés)


def sigma(zone, t):
    return (SIGMA_PARIS if zone == 'paris' else SIGMA_TAILLE)[t]


SCENARIOS = {  # k : plafond à k × loyer médian local ; prix : multiplicateur des prix ; primes : multiplicateur H9 ; sig : multiplicateur de H10
    'bas': dict(k=1.30, prix=0.85, primes=2.0, sig=0.8),
    'central': dict(k=1.20, prix=1.0, primes=1.0, sig=1.0),
    'haut': dict(k=1.10, prix=1.25, primes=0.0, sig=1.2),
}
REF_CARTE = {'app12': 37.0, 'app3': 72.0, 'mai': 92.0}  # surfaces des biens de référence de la carte des loyers 2025 (DHUP)


def categorie_energie(libelle):
    """Classe un libellé d'énergie de la base DPE dans une catégorie de prix."""
    s = (libelle or '').lower()
    if 'lectricit' in s: return 'electricite'
    if 'gaz naturel' in s: return 'gaz'
    if 'fioul' in s: return 'fioul'
    if 'gpl' in s or 'propane' in s or 'butane' in s: return 'gpl'
    if 'bois' in s: return 'bois'
    if 'chauffage urbain' in s or 'réseau' in s: return 'reseau'
    return 'autre'


ETA = {'electricite': 1.0, 'gaz': 0.85, 'fioul': 0.80, 'gpl': 0.85, 'bois': 0.70, 'reseau': 0.90, 'autre': 0.85}  # H8 : rendement moyen (repli)


def besoin_utile(besoin_dpe, surface, conso_ch, energie):
    """Besoin utile de chauffage du logement (kWh/an) et indicateur 'imputé'.
    Le champ besoin_chauffage de la base DPE est le besoin du bâtiment entier pour une partie des appartements en copropriété
    (même valeur pour tous les lots, plusieurs dizaines de milliers de kWh) : il est jugé plausible si 15 <= besoin/m² <= 450 kWh
    et 0,25 <= conso/besoin <= 2 ; sinon (H8) on le remplace par conso de chauffage × rendement moyen de l'énergie."""
    if besoin_dpe and 15 <= besoin_dpe / surface <= 450 and 0.25 <= conso_ch / besoin_dpe <= 2.0:
        return besoin_dpe, False
    return conso_ch * ETA[categorie_energie(energie)], True


def taille(surface):
    for lo, hi, nom in BORNES_TAILLE:
        if lo <= surface < hi: return nom
    return None


def classe_ep(ep_m2):
    """Classe selon la seule énergie primaire (le critère GES, non modélisé, peut dégrader la classe)."""
    for seuil, c in SEUILS_EP:
        if ep_m2 <= seuil: return c
    return 'G'


# ---------------------------------------------------------------- énergie
def cout_usages(consos, mult_prix=1.0):
    """consos : liste de (énergie, kWh EF/an). Retourne le coût annuel en €."""
    return sum(kwh * PRIX_KWH[categorie_energie(e)] for e, kwh in consos) * mult_prix


def deduction_mensuelle(cout_total, conso_chauffage, energie_chauffage, besoin_chauffage_froid,
                        alpha=ALPHA, mult_prix=1.0, p_ref=P_REF_BESOIN):
    """Déduction D (€/mois) = [autres usages + alpha × coût réel du chauffage + (1 − alpha) × coût du besoin] / 12.

    cout_total : coût annuel réel de tous les usages (€) au prix courant (déjà multiplié par mult_prix).
    conso_chauffage : kWh EF de chauffage ; besoin_chauffage_froid : besoin utile chauffage + refroidissement (kWh/an) du bâti.
    alpha = 1 : coût réel seul ; alpha = 0 : besoin du bâti seul pour le chauffage.
    """
    cout_ch = conso_chauffage * PRIX_KWH[categorie_energie(energie_chauffage)] * mult_prix
    autres = max(0.0, cout_total - cout_ch)
    cout_besoin = besoin_chauffage_froid * p_ref * mult_prix
    return (autres + alpha * cout_ch + (1 - alpha) * cout_besoin) / 12.0


# ---------------------------------------------------------------- loyer de marché (carte des loyers)
def droite_marche(r12, r3):
    """Droite de loyer de marché M(S) = a + v S passant par les deux biens de référence de la carte (37 m² : r12 €/m², 72 m² : r3 €/m²).
    Retourne (a, v) avec v ≥ 0 et a ≥ 0 (si la droite sort du domaine, on se ramène à une droite proportionnelle)."""
    s1, s2 = REF_CARTE['app12'], REF_CARTE['app3']
    m1, m2 = r12 * s1, r3 * s2
    v = (m2 - m1) / (s2 - s1)
    a = m1 - v * s1
    if v < 0 or a < 0:
        v, a = (m1 + m2) / (s1 + s2), 0.0
    return a, v


def droite_maison(r_mai, part_base):
    """Maison : un seul point de référence (92 m²) ; part_base = a / M(72 m²) empruntée aux appartements de la zone."""
    m = r_mai * REF_CARTE['mai']
    a = part_base * m
    return a, (m - a) / REF_CARTE['mai']


def marche_median(droite, surface, classe, primes_mult=1.0):
    """Loyer médian de marché d'un logement de classe donnée (€/mois) : droite × (1 + prime de classe)."""
    a, v = droite
    return (a + v * surface) * (1 + primes_mult * PRIMES_MARCHE[classe])


# ---------------------------------------------------------------- calibrage et plafond
def calibrer_zone(logements, droite, k, repli=None, nmin=20):
    """logements : liste de dicts {surface, d} (d = déduction en €/mois). droite : (a, v) de marché.
    Retourne (bases par taille, v_plafond). Pour chaque taille t : Base_t = k × M(S̄_t) − v_plafond × S̄_t + D̄_t,
    avec M la droite de marché (sans prime de classe), S̄_t et D̄_t les moyennes de la taille t ; v_plafond = k × v_marché.
    Si une taille compte moins de nmin logements, S̄_t et D̄_t viennent de la liste `repli` (par exemple toute la ville)."""
    a, v = droite
    vp = k * v
    def grouper(L):
        g = {}
        for lg in L:
            t = taille(lg['surface'])
            if t: g.setdefault(t, []).append(lg)
        return g
    par_t, par_r = grouper(logements), grouper(repli or [])
    bases = {}
    for t in TAILLES:
        L = par_t.get(t, [])
        if len(L) < nmin: L = par_r.get(t, L)
        if not L: continue
        s = sum(x['surface'] for x in L) / len(L)
        d = sum(x['d'] for x in L) / len(L)
        bases[t] = k * (a + v * s) - vp * s + d
    return bases, vp


def plafond(base_t, v_plafond, surface_ref, deduction):
    """Plafond mensuel = Base_t + v × surface de référence − déduction énergie."""
    return base_t + v_plafond * surface_ref - deduction


# ---------------------------------------------------------------- loyers actuels (distribution lognormale autour du marché)
def phi(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def part_depassant(mediane, plaf, sigma):
    """P(loyer > plafond) si le loyer est lognormal de médiane `mediane` et d'écart-type log `sigma`."""
    if plaf <= 0: return 1.0
    return 1 - phi(math.log(plaf / mediane) / sigma)


def baisse_esperee(mediane, plaf, sigma):
    """E[max(0, loyer − plafond)] pour un loyer lognormal (formule de l'option d'achat)."""
    if plaf <= 0: return mediane * math.exp(sigma ** 2 / 2)
    d1 = (math.log(mediane / plaf) + sigma ** 2 / 2) / sigma
    d2 = d1 - sigma
    return mediane * math.exp(sigma ** 2 / 2) * phi(d1) - plaf * phi(d2)


def loyer_apres(mediane, plaf, sigma):
    """E[min(loyer, plafond)] : loyer moyen après application du plafond."""
    return mediane * math.exp(sigma ** 2 / 2) - baisse_esperee(mediane, plaf, sigma)


# ---------------------------------------------------------------- travaux : pompe à chaleur, isolation (cas types)
def appliquer_travaux(lg, pac=False, isolation=False, scop=3.0, gain_besoin=0.45, perte_surface=0.04):
    """lg : dict {surface, besoin_ch (kWh/an, chauffage seul), besoin_froid, conso_ch_ef, energie_ch, conso_autres: [(énergie, kWh)]}.
    Retourne un nouveau logement. Isolation par l'intérieur : besoin × (1 − gain_besoin), surface × (1 − perte_surface).
    Pompe à chaleur : le chauffage devient électrique, conso = besoin / SCOP (H12)."""
    n = dict(lg)
    if isolation:
        n['besoin_ch'] = lg['besoin_ch'] * (1 - gain_besoin)
        n['surface'] = lg['surface'] * (1 - perte_surface)
        n['conso_ch_ef'] = lg['conso_ch_ef'] * (1 - gain_besoin)
    if pac:
        n['energie_ch'] = 'Électricité'
        n['conso_ch_ef'] = n['besoin_ch'] / scop
    return n


def indicateurs_cas(lg, alpha=ALPHA, mult_prix=1.0):
    """Coût réel mensuel de l'énergie, déduction D, énergie primaire par m² et classe estimée d'un logement type."""
    cons = [(lg['energie_ch'], lg['conso_ch_ef'])] + list(lg['conso_autres'])
    cout = cout_usages(cons, mult_prix)
    d = deduction_mensuelle(cout, lg['conso_ch_ef'], lg['energie_ch'], lg['besoin_ch'] + lg['besoin_froid'], alpha, mult_prix)
    ep = sum(kwh * COEF_EP[categorie_energie(e)] for e, kwh in cons) / lg['surface']
    return dict(cout_mensuel=cout / 12, deduction=d, ep_m2=ep, classe=classe_ep(ep), surface=lg['surface'])
