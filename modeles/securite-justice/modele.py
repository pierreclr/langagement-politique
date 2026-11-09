# -*- coding: utf-8 -*-
"""Modèle Sécurité-Justice : ordres de grandeur, jamais des prédictions.

Fonctions pures ; les données viennent de donnees/*.csv. Aucune variable d'origine,
de religion ou de quartier : la seule donnée d'identité utilisée est la nationalité
enregistrée, en effectif agrégé officiel (voir methode.md, § garde-fous).
Scénarios : 'bas' = hypothèses prudentes sur les gains, 'haut' = optimistes.
"""
import csv
import os

ICI = os.path.dirname(os.path.abspath(__file__))
SCENARIOS = ('bas', 'central', 'haut')
JOURS = 365


def _lire(nom):
    with open(os.path.join(ICI, 'donnees', nom), encoding='utf-8') as f:
        return list(csv.DictReader(f))


def _dict(nom):
    return {r['cle']: float(r['valeur']) for r in _lire(nom)}


def charger_chaine():
    return _dict('chaine_penale_2025.csv')


def charger_detention():
    return _dict('detention_2026.csv')


def charger_etrangers():
    return _dict('etrangers_agregat.csv')


def charger_couts():
    return _dict('couts_budgets.csv')


def charger_litterature():
    return {r['cle']: {s: float(r[s]) for s in SCENARIOS}
            for r in _lire('litterature.csv') if r['unite'] != 'note'}


def charger_infractions(annee=2025):
    return {r['indicateur']: int(r['nombre'])
            for r in _lire('infractions_ssmsi.csv') if int(r['annee']) == annee}


# ---------------------------------------------------------------- 1. chaîne pénale

def entonnoir(c):
    """Étapes de la chaîne pénale 2025 et ratios successifs (personnes)."""
    mec, pour, rep = c['mis_en_cause'], c['poursuivables'], c['reponse_penale_ou_alternative']
    return {
        'part_affaires_sans_auteur': c['affaires_sans_mis_en_cause'] / c['affaires_traitees'],
        'part_poursuivables': pour / mec,
        'taux_reponse_penale_recalcule': rep / pour,
        'part_condamnes_sur_mis_en_cause': c['condamnes_total'] / mec,
        'part_condamnes_sur_poursuivables': c['condamnes_total'] / pour,
        'part_prison_ferme_sur_condamnations': c['peines_emprisonnement_ferme_total_ou_partie'] / c['condamnations_total'],
    }


def duree_implicite_mois(stock, flux_annuel):
    """Durée moyenne de séjour impliquée par la loi de Little (mois)."""
    return stock / flux_annuel * 12.0


def occupation_little(flux_annuel, duree_mois):
    """Loi de Little : stock moyen = flux annuel x durée moyenne (en années)."""
    return flux_annuel * duree_mois / 12.0


def densite(detenus, places):
    return detenus / places


def places_manquantes(detenus, places, cible=1.0):
    """Places à créer pour ramener la densité à `cible` (1,0 = 100 %)."""
    return max(0.0, detenus / cible - places)


def cout_detention_annuel_meur(detenus, cout_jour):
    return detenus * cout_jour * JOURS / 1e6


def annuite(capital, taux, n):
    if taux == 0:
        return capital / n
    return capital * taux / (1 - (1 + taux) ** -n)


# ---------------------------------------------------------------- 2. options

def option_places(detenus, places, cible, cout_place, taux=0.03, duree=40, cout_jour=105.0, part_variable=0.5):
    """Construire : annuité de l'investissement + fonctionnement variable des places neuves (M€/an)."""
    n = places_manquantes(detenus, places, cible)
    invest = annuite(n * cout_place, taux, duree) / 1e6
    fonct = n * cout_jour * part_variable * JOURS / 1e6
    return {'places': n, 'investissement_total_meur': n * cout_place / 1e6,
            'annuite_meur': invest, 'fonctionnement_meur': fonct, 'total_annuel_meur': invest + fonct}


def option_peines_courtes(d, part_convertie, cout_jour_detention, cout_jour_bracelet,
                          part_variable, delta_reconviction, quantums=('quantum_6m_ou_moins_detenus', 'quantum_6m_a_1an_detenus')):
    """Convertir des courtes peines (<= 1 an) en bracelet/TIG.
    Places libérées = personnes converties (stock). Gain net = économie variable - coût du suivi.
    Effet : reconvictions évitées par an (flux = stock / durée moyenne d'écrou en années)."""
    stock = sum(d[q] for q in quantums)
    converties = stock * part_convertie
    eco = converties * cout_jour_detention * part_variable * JOURS / 1e6
    cout = converties * cout_jour_bracelet * JOURS / 1e6
    flux = converties / (d['duree_moyenne_ecrou_condamnes_detenus_mois'] / 12.0)
    return {'stock_eligible': stock, 'places_liberees': converties,
            'economie_variable_meur': eco, 'cout_suivi_meur': cout, 'gain_net_meur': eco - cout,
            'reconvictions_evitees_par_an': flux * delta_reconviction}


def option_travail(sortants, detenus_condamnes, part_actuelle, part_cible, reconviction_base,
                   reduction_relative, cout_poste_an):
    """Travail en prison : postes ajoutés, coût d'encadrement, reconvictions évitées (effet relatif)."""
    postes = max(0.0, part_cible - part_actuelle) * detenus_condamnes
    cout = postes * cout_poste_an / 1e6
    # l'effet ne porte que sur les sortants qui ont travaillé en plus
    sortants_concernes = sortants * max(0.0, part_cible - part_actuelle)
    evitees = sortants_concernes * reconviction_base * reduction_relative
    return {'postes_ajoutes': postes, 'cout_meur': cout, 'sortants_concernes': sortants_concernes,
            'reconvictions_evitees_par_an': evitees,
            'cout_par_reconviction_evitee_eur': (cout * 1e6 / evitees) if evitees > 0 else None}


def option_police(effectif, hausse_part, cout_agent, elast_violent, elast_biens, base_violent, base_biens):
    """Chalfin & McCrary : élasticité du crime à l'effectif de police. Faits évités par an."""
    agents = effectif * hausse_part
    cout = agents * cout_agent / 1e6
    ev_v = -elast_violent * hausse_part * base_violent
    ev_b = -elast_biens * hausse_part * base_biens
    tot = ev_v + ev_b
    return {'agents': agents, 'cout_meur': cout, 'faits_evites_violents': ev_v,
            'faits_evites_biens': ev_b, 'faits_evites_total': tot,
            'cout_par_fait_evite_eur': cout * 1e6 / tot if tot > 0 else None}


def option_prison_marginale(detenus, hausse_part, cout_jour, elast, base_faits):
    """Place de prison supplémentaire : élasticité du crime à la population carcérale (à la marge)."""
    cout = cout_detention_annuel_meur(detenus * hausse_part, cout_jour)
    evites = -elast * hausse_part * base_faits
    return {'detenus_en_plus': detenus * hausse_part, 'cout_meur': cout, 'faits_evites': evites,
            'cout_par_fait_evite_eur': cout * 1e6 / evites if evites > 0 else None}


def option_eloignement(detenus_etrangers, part_eloignable, restant_mois, cout_jour, part_variable, cout_eloignement):
    """Éloignement anticipé d'étrangers condamnés, en effectifs agrégés de nationalité enregistrée.
    Aucune ventilation par pays : `detenus_etrangers` est un total officiel."""
    n = detenus_etrangers * part_eloignable
    eco = n * restant_mois / 12.0 * cout_jour * part_variable * JOURS / 1e6
    cout = n * cout_eloignement / 1e6
    return {'eloignes': n, 'places_liberees': n * restant_mois / 12.0,
            'economie_meur': eco, 'cout_eloignement_meur': cout, 'gain_net_meur': eco - cout}


def cout_perpetuite_meur(effectif, cout_jour):
    """Coût annuel de détention des condamnés à perpétuité (ordre de grandeur, pas un argument :
    l'intérêt financier de l'État est ce que le droit (CEDH) interdit de faire peser sur le consentement)."""
    return cout_detention_annuel_meur(effectif, cout_jour)


# ---------------------------------------------------------------- 3. numérique

def option_numerique(procedures, minutes_gagnees, cout_etp, heures_etp=1607.0,
                     delai_delit_mois=13.3, part_delai_papier=0.1, investissement_meur=0.0, duree=10, taux=0.03):
    """Gain de temps par procédure -> ETP libérés, valeur annuelle, jours gagnés sur le délai moyen."""
    heures = procedures * minutes_gagnees / 60.0
    etp = heures / heures_etp
    valeur = etp * cout_etp / 1e6
    ann = annuite(investissement_meur, taux, duree) if investissement_meur else 0.0
    return {'etp_liberes': etp, 'valeur_meur': valeur, 'annuite_investissement_meur': ann,
            'gain_net_meur': valeur - ann, 'jours_gagnes_delit': delai_delit_mois * 30.4 * part_delai_papier}


# ---------------------------------------------------------------- garde-fous

CHAMPS_INTERDITS = ('origine', 'religion', 'ethnie', 'quartier', 'prenom', 'patronyme')


def verifier_sans_profilage(noms_colonnes):
    """Lève une erreur si une donnée du modèle porte sur l'origine, la religion ou le quartier."""
    for n in noms_colonnes:
        for mot in CHAMPS_INTERDITS:
            if mot in n.lower():
                raise ValueError('donnée interdite : %s' % n)
    return True
