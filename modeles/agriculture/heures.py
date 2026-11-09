# -*- coding: utf-8 -*-
"""Module « heures par hectare et robots » du modèle Agriculture (ajout du 03/11/2026).

Question : la monoculture existe-t-elle parce que l'heure de travail humain coûte trop cher ? Si un robot
neutralise ce coût, à quel coût horaire les systèmes complexes battent-ils la monoculture, et quand ?

Fonctions pures (aucune entrée-sortie). Hypothèses H25 à H36 : voir methode.md section « Heures par hectare ».
    python3 -m unittest test_heures -v     (depuis modeles/agriculture/)

Notation : M = marge par hectare AVANT rémunération du travail (€/ha) ; h = heures par hectare et par an ;
w = coût horaire du travail humain ; c = coût horaire du travail robotisé (€ par heure équivalente humaine) ;
r = part des heures que le robot sait faire (0 à 1) ; H = heures annuelles d'un actif.
"""
import math

H_ACTIF = 1607.0        # heures d'un équivalent temps plein (INSEE, recensement agricole 2020)
ANNEE_BASE = 2026
SAU_FRANCE_HA = 27.0e6  # H33 ⚠️ ordre de grandeur de la SAU métropolitaine (valeur exacte non relue)
TAUX = 0.05             # taux d'actualisation, comme modele.py

# --- Systèmes, par hectare-équivalent et par an. bas / central / haut = défavorable / médian / favorable à la thèse.
# Bec-Hellouin : sourcé (rapport final 2015) ; chaque cas = (marge avant travail €, heures) POUR 1 000 m² ; ×10 pour 1 ha.
BEC = {
    'bas': {'marge': 5.37 * 2006.0, 'heures': 2006.0, 'ca': 32788.0},      # 2013, amortissements hauts (H)
    'central': {'marge': 25881.0, 'heures': 3026.0, 'ca': 57284.0},  # 2014, hypothèse H
    'haut': {'marge': 28651.0, 'heures': 3026.0, 'ca': 57284.0},     # 2014, hypothèse B
}
# Monoculture céréalière (H25 ⚠️) : marge avant travail €/ha et heures/ha. 167 = marge nette avec aides (Arvalis, blé,
# 2023-2024) ; 560 = RCAI 56,3 k€ / 100 ha supposés ; 300 = milieu choisi. Heures : 3,5 (Arvalis, champ) / 6 / 17,7 (borne haute).
MONO = {
    'bas': {'marge': 167.0, 'heures': 3.5},
    'central': {'marge': 300.0, 'heures': 6.0},
    'haut': {'marge': 560.0, 'heures': 17.7},
}


def ha_equiv(cas_1000m2):
    """Convertit un cas du Bec-Hellouin (1 000 m²) en valeurs par hectare (extrapolation illustrative)."""
    return {'marge': cas_1000m2['marge'] * 10.0, 'heures': cas_1000m2['heures'] * 10.0, 'ca': cas_1000m2['ca'] * 10.0}


def marge_par_heure(sys_):
    """€ de marge avant travail par heure de travail : le chiffre qui décide."""
    return sys_['marge'] / sys_['heures']


def annuite(prix, taux, duree):
    if taux == 0:
        return prix / float(duree)
    return prix * taux / (1.0 - (1.0 + taux) ** (-duree))


# --- (2) Coût horaire d'un robot ------------------------------------------------------------
# H27 : FarmDroid FD20, 75 000-97 000 € (constructeur via FAO) ; 8 ans ; entretien 5 % du prix par an.
ROBOT_PRIX_EUR = 86000.0
ROBOT_DUREE = 8
ROBOT_ENTRETIEN = 0.05
# H28 : heures d'utilisation par an U ; H29 : heures humaines remplacées par heure de robot k (Arvalis : 3,7 h/ha robot
# contre 3,5 h/ha tracteur, soit k < 1 dans cet essai) ; H30 : disponibilité en milieu non structuré phi.
PARAM_ROBOT = {
    'bas': {'U': 500.0, 'k': 1.0, 'phi': 0.5, 'baisse_an': 0.03, 'r': 0.2},
    'central': {'U': 800.0, 'k': 1.0, 'phi': 0.7, 'baisse_an': 0.06, 'r': 0.4},
    'haut': {'U': 1200.0, 'k': 1.0, 'phi': 0.9, 'baisse_an': 0.10, 'r': 0.7},
}
W_HUMAIN = {'bas': 14.0, 'central': 16.0, 'haut': 22.0}   # H26 ⚠️ coût horaire chargé d'un salarié agricole


def cout_robot_heure(prix=ROBOT_PRIX_EUR, duree=ROBOT_DUREE, entretien=ROBOT_ENTRETIEN, U=800.0, k=1.0, phi=0.7, taux=TAUX):
    """€ par heure équivalente humaine aujourd'hui : (annuité + entretien) / (heures d'usage × k × disponibilité)."""
    cout_an = annuite(prix, taux, duree) + entretien * prix
    return cout_an / (U * k * phi)


def cout_robot_a(c0, baisse_an, t):
    """Coût horaire après t années de baisse annuelle constante (courbe d'apprentissage simplifiée)."""
    return c0 * (1.0 - baisse_an) ** t


# --- (3) Seuils --------------------------------------------------------------------------------
def profit_ha(sys_, r, c, w):
    """Profit par hectare : marge avant travail moins le travail humain (part 1-r à w) et robotisé (part r à c)."""
    return sys_['marge'] - sys_['heures'] * ((1.0 - r) * w + r * c)


def seuil_par_ha(sys_c, sys_m, r, w, r_m=0.0, c_m=None):
    """Coût horaire robot c* (€/h équivalent humain) au-dessous duquel le système complexe dégage plus de profit
    par hectare que la monoculture (monoculture au coût humain w sauf indication). None si impossible, même à c = 0."""
    profit_m = profit_ha(sys_m, r_m, 0.0 if c_m is None else c_m, w)
    if r <= 0:
        return None
    c_star = ((sys_c['marge'] - profit_m) / sys_c['heures'] - (1.0 - r) * w) / r
    return c_star if c_star > 0 else None


def surface_par_actif(sys_, r, H=H_ACTIF):
    """Hectares qu'un actif conduit s'il fournit lui-même les heures non robotisables."""
    if r >= 1.0:
        return float('inf')
    return H / ((1.0 - r) * sys_['heures'])


def revenu_actif(sys_, r, c, H=H_ACTIF):
    """Revenu par actif exploitant (€) : surface conduite × (marge − coût des heures robotisées). Les heures
    humaines sont les siennes (non payées) : on compare des exploitants, pas des salariés."""
    return surface_par_actif(sys_, r, H) * (sys_['marge'] - sys_['heures'] * r * c)


def seuil_par_actif(sys_c, sys_m, r, H=H_ACTIF):
    """c* au-dessous duquel le revenu par actif du système complexe dépasse celui de la monoculture
    (exploitant seul, sans robot). None si impossible même à c = 0."""
    if r <= 0 or r >= 1.0:
        return None
    revenu_m = revenu_actif(sys_m, 0.0, 0.0, H)
    c_star = (sys_c['marge'] - revenu_m * (1.0 - r) * sys_c['heures'] / H) / (sys_c['heures'] * r)
    return c_star if c_star > 0 else None


def part_robotisee_minimale(sys_c, sys_m, w, critere='ha'):
    """r minimal pour battre la monoculture avec un robot GRATUIT (c = 0). critere 'ha' ou 'actif'."""
    if critere == 'ha':
        profit_m = profit_ha(sys_m, 0.0, 0.0, w)
        r = 1.0 - ((sys_c['marge'] - profit_m) / sys_c['heures']) / w
    else:
        # c = 0 : H*M / ((1-r)*h) >= revenu_m  <=>  1-r <= H*(M/h)/revenu_m
        revenu_m = revenu_actif(sys_m, 0.0, 0.0)
        r = 1.0 - H_ACTIF * marge_par_heure(sys_c) / revenu_m
    return max(0.0, min(1.0, r))


def annee_seuil(c0, c_star, baisse_an, horizon=60):
    """Années de baisse nécessaires pour passer de c0 à c* ; 0 si déjà atteint ; None si impossible ou au-delà de l'horizon."""
    if c_star is None or baisse_an <= 0:
        return None
    if c0 <= c_star:
        return 0.0
    t = math.log(c_star / c0) / math.log(1.0 - baisse_an)
    return t if t <= horizon else None


def date_seuil(c0, c_star, baisse_an, annee_base=ANNEE_BASE):
    t = annee_seuil(c0, c_star, baisse_an)
    return None if t is None else annee_base + math.ceil(t)


def marge_requise(h_ha, c, profit_m_ha):
    """Marge par hectare (avant travail) qu'il faut à un système demandant h_ha heures/ha, tout au coût horaire c,
    pour égaler un profit de monoculture profit_m_ha. Table générique pour les systèmes sans données de marge."""
    return profit_m_ha + h_ha * c


# --- (4) Contraintes ------------------------------------------------------------------------------
def surface_saturation_ha(valeur_marche_eur, ca_ha_eur):
    """Hectares qui suffisent à produire la valeur de tout le marché au chiffre d'affaires par hectare donné."""
    return valeur_marche_eur / ca_ha_eur


def part_sau(surface_ha, sau=SAU_FRANCE_HA):
    return surface_ha / sau


def prix_relatif(multiple_offre, elasticite=-0.58):
    """Prix après multiplication de l'offre, demande à élasticité constante : p/p0 = Q^(1/elasticité).
    H34 ⚠️ −0,58 : élasticité-prix des légumes, de mémoire (Andreyeva, Long et Brownell 2010), non relue."""
    return multiple_offre ** (1.0 / elasticite)


def multiple_offre_max(baisse_prix_tolere, elasticite=-0.58):
    """Multiple d'offre qui fait baisser le prix de la part donnée (0,2 = −20 %)."""
    return (1.0 - baisse_prix_tolere) ** elasticite
