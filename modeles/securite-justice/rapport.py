# -*- coding: utf-8 -*-
"""Tables de résultats. python3 rapport.py"""
import modele as m

c, d, e, k, L = (m.charger_chaine(), m.charger_detention(), m.charger_etrangers(),
                 m.charger_couts(), m.charger_litterature())
inf = m.charger_infractions(2025)
S = m.SCENARIOS


def f(x, n=0):
    return ('{:,.%df}' % n).format(x).replace(',', ' ').replace('.', ',') if x is not None else 'n.d.'


def hyp(sc):
    """Hypothèses d'échelle par scénario (H-numérotées dans methode.md)."""
    i = S.index(sc)
    return {
        'cout_jour': (105.0, 117.0, 130.0)[i],            # H9
        'part_variable': (0.3, 0.5, 0.8)[i],              # H10
        'cout_place': (350000.0, 270000.0, 200000.0)[i],  # H11
        'bracelet': (40.0, 25.0, 15.0)[i],                # H13
        'part_conv': (0.2, 0.4, 0.6)[i],                  # H14
        'min_gagnees': (10.0, 20.0, 40.0)[i],             # H20
        'part_papier': (0.05, 0.10, 0.20)[i],             # H21
        'part_elig': (0.05, 0.15, 0.30)[i],               # H17
        'restant': (3.0, 6.0, 9.0)[i],                    # H18
        'hausse_police': 0.10,                            # H15
        'cout_poste': (9000.0, 6000.0, 4000.0)[i],        # H12 bis
    }


def main():
    print('## Chaîne pénale 2025')
    for kk, v in m.entonnoir(c).items():
        print('- %s : %s' % (kk, f(v * 100, 1) + ' %'))
    print()
    det, pl = d['detenus'], d['places']
    print('Densité 1/1/2026 : %s %% ; sept. 2026 : %s %%' % (f(m.densite(det, pl) * 100, 1),
                                                          f(m.densite(d['detenus_sept_2026'], d['places_sept_2026']) * 100, 1)))
    print('Durée implicite (Little : détenus / sortants) : %s mois, entre %s (prévenus) et %s (condamnés)' % (
        f(m.duree_implicite_mois(det, d['sortants_2025']), 1), f(d['duree_moyenne_ecrou_prevenus_mois'], 1), f(d['duree_moyenne_ecrou_condamnes_detenus_mois'], 1)))
    print('Coût annuel de la détention : %s à %s M€' % (
        f(m.cout_detention_annuel_meur(det, k['cout_journee_detention_cdc'])), f(m.cout_detention_annuel_meur(det, k['cout_journee_detention_dap']))))
    print()
    base_v = inf['Violences physiques hors cadre familial'] + inf['Violences physiques intrafamiliales'] + inf['Violences sexuelles']
    base_b = inf['Cambriolages de logement'] + inf['Vols sans violence contre des personnes'] + inf['Vols de véhicule'] + inf['Vols dans les véhicules']
    base_all = base_v + base_b
    print('Bases SSMSI 2025 : violences %s ; biens %s' % (f(base_v), f(base_b)))
    for sc in S:
        h = hyp(sc)
        print('\n### Scénario', sc)
        for cible in (1.0, 1.2):
            r = m.option_places(det, pl, cible, h['cout_place'], cout_jour=h['cout_jour'], part_variable=h['part_variable'])
            print('- places (cible %s %%) : %s places, investissement %s M€, total annuel %s M€' % (
                f(cible * 100), f(r['places']), f(r['investissement_total_meur']), f(r['total_annuel_meur'])))
        r = m.option_peines_courtes(d, h['part_conv'], h['cout_jour'], h['bracelet'], h['part_variable'], L['delta_reconviction_bracelet_vs_prison'][sc])
        print('- peines courtes : %s places libérées, gain net %s M€/an, reconvictions évitées %s/an' % (
            f(r['places_liberees']), f(r['gain_net_meur'], 1), f(r['reconvictions_evitees_par_an'])))
        r = m.option_travail(d['sortants_2025'], d['condamnes_detenus'], L['part_detenus_travaillant_actuelle'][sc],
                             L['part_detenus_travail_cible'][sc], L['reconviction_5ans_sortants_prison'][sc],
                             L['reduction_relative_recidive_travail'][sc], h['cout_poste'])
        print('- travail : %s postes, %s M€, reconvictions évitées %s/an, coût par reconviction évitée %s €' % (
            f(r['postes_ajoutes']), f(r['cout_meur'], 1), f(r['reconvictions_evitees_par_an']), f(r['cout_par_reconviction_evitee_eur'])))
        r = m.option_police(k['effectif_police_gendarmerie_etp'], h['hausse_police'], k['cout_agent_charge'],
                            L['elasticite_crime_police_violent'][sc], L['elasticite_crime_police_biens'][sc], base_v, base_b)
        print('- police +10 %% : %s agents, %s M€/an, faits évités %s, coût par fait %s €' % (
            f(r['agents']), f(r['cout_meur']), f(r['faits_evites_total']), f(r['cout_par_fait_evite_eur'])))
        r = m.option_prison_marginale(det, 0.10, h['cout_jour'], L['elasticite_crime_population_carcerale'][sc], base_all)
        print('- prison +10 %% : %s détenus, %s M€/an, faits évités %s, coût par fait %s €' % (
            f(r['detenus_en_plus']), f(r['cout_meur']), f(r['faits_evites']), f(r['cout_par_fait_evite_eur'])))
        etr = e['etrangers_condamnes_detenus']
        r = m.option_eloignement(etr, h['part_elig'], h['restant'], h['cout_jour'], h['part_variable'], e['cout_eloignement_force'])
        print('- éloignement anticipé : %s personnes, économie %s M€, coût %s M€, gain net %s M€' % (
            f(r['eloignes']), f(r['economie_meur'], 1), f(r['cout_eloignement_meur'], 1), f(r['gain_net_meur'], 1)))
        procs = c['affaires_un_mis_en_cause'] + c['affaires_plusieurs_mis_en_cause']
        r = m.option_numerique(procs, h['min_gagnees'], 50000.0, delai_delit_mois=c['delai_moyen_delit_mois'],
                               part_delai_papier=h['part_papier'], investissement_meur=k['plan_transformation_numerique_justice'])
        print('- numérique : %s ETP, valeur %s M€/an, annuité de 530 M€ %s M€, net %s M€, %s jours gagnés (délits)' % (
            f(r['etp_liberes']), f(r['valeur_meur'], 1), f(r['annuite_investissement_meur'], 1), f(r['gain_net_meur'], 1), f(r['jours_gagnes_delit'])))
    print('\nPerpétuité : %s M€/an (486 détenus)' % f(m.cout_perpetuite_meur(d['quantum_perpetuite_detenus'], k['cout_journee_detention_dap']), 1))


if __name__ == '__main__':
    main()
