# -*- coding: utf-8 -*-
"""Tests du modèle Sécurité-Justice. Lancer depuis modeles/securite-justice/ :
    python3 -m unittest test_modele -v
"""
import csv
import os
import unittest

import modele as m

C, D, E, K, L = (m.charger_chaine(), m.charger_detention(), m.charger_etrangers(),
                 m.charger_couts(), m.charger_litterature())
INF = m.charger_infractions(2025)


class TestDonnees(unittest.TestCase):
    def test_affaires_traitees_somment(self):
        s = C['affaires_sans_mis_en_cause'] + C['affaires_un_mis_en_cause'] + C['affaires_plusieurs_mis_en_cause']
        self.assertEqual(s, C['affaires_traitees'])

    def test_poursuivables_plus_non_poursuivables(self):
        self.assertEqual(C['poursuivables'] + C['non_poursuivables'], C['mis_en_cause'])

    def test_taux_reponse_penale_recalcule(self):
        self.assertAlmostEqual(m.entonnoir(C)['taux_reponse_penale_recalcule'], C['taux_reponse_penale'], places=3)

    def test_condamnations_crimes_plus_delits_proches_du_total(self):
        reste = C['condamnations_total'] - C['condamnations_crimes'] - C['condamnations_delits']
        # reste = contraventions de 5e classe (29 258 dans le tableau p.18)
        self.assertTrue(0 < reste < 31000)

    def test_detenus_somment(self):
        self.assertEqual(D['condamnes_detenus'] + D['prevenus_detenus'], D['detenus'] + 0)

    def test_quantums_somment_aux_condamnes_detenus(self):
        q = [k for k in D if k.startswith('quantum_') and k.endswith('_detenus')]
        # 970 « non renseigné » absents de la table : somme + 970 = condamnés détenus
        self.assertEqual(sum(D[k] for k in q) + 970, D['condamnes_detenus'])

    def test_densite_officielle(self):
        self.assertAlmostEqual(m.densite(D['detenus'], D['places']), D['densite_officielle'], places=2)

    def test_etrangers_detenus_part_dans_la_fourchette_officielle(self):
        part = (E['etrangers_prevenus_detenus'] + E['etrangers_condamnes_detenus']) / D['detenus']
        self.assertTrue(0.22 < part < 0.27)  # 24,2 % au 1/4/2026 ; 25 % ici (détenus seulement)


class TestMaths(unittest.TestCase):
    def test_little_duree_entre_les_deux_durees(self):
        dur = m.duree_implicite_mois(D['detenus'], D['sortants_2025'])
        self.assertTrue(D['duree_moyenne_ecrou_prevenus_mois'] < dur < D['duree_moyenne_ecrou_condamnes_detenus_mois'])

    def test_little_aller_retour(self):
        self.assertAlmostEqual(m.occupation_little(1000, 6), 500.0)
        self.assertAlmostEqual(m.duree_implicite_mois(500, 1000), 6.0)

    def test_places_manquantes(self):
        self.assertEqual(m.places_manquantes(100, 80, 1.0), 20)
        self.assertEqual(m.places_manquantes(100, 120, 1.0), 0.0)
        self.assertAlmostEqual(m.places_manquantes(120, 80, 1.2), 20)

    def test_annuite(self):
        self.assertAlmostEqual(m.annuite(1000, 0, 10), 100.0)
        self.assertAlmostEqual(m.annuite(1000, 0.05, 10), 129.5046, places=3)

    def test_cout_detention(self):
        self.assertAlmostEqual(m.cout_detention_annuel_meur(1000, 100), 36.5)


class TestOptions(unittest.TestCase):
    def test_places_monotone_en_cout(self):
        a = m.option_places(D['detenus'], D['places'], 1.0, 200000)
        b = m.option_places(D['detenus'], D['places'], 1.0, 350000)
        self.assertLess(a['total_annuel_meur'], b['total_annuel_meur'])

    def test_places_cible_plus_lache_coute_moins(self):
        a = m.option_places(D['detenus'], D['places'], 1.0, 270000)
        b = m.option_places(D['detenus'], D['places'], 1.2, 270000)
        self.assertLess(b['total_annuel_meur'], a['total_annuel_meur'])

    def test_peines_courtes_sans_conversion(self):
        r = m.option_peines_courtes(D, 0.0, 117, 25, 0.5, 0.04)
        self.assertEqual(r['places_liberees'], 0)
        self.assertEqual(r['gain_net_meur'], 0)

    def test_peines_courtes_gain_seulement_si_marginal_depasse_bracelet(self):
        # 117 x 0,5 = 58,5 € > 25 € : gain ; 117 x 0,1 = 11,7 € < 25 € : perte
        self.assertGreater(m.option_peines_courtes(D, 0.4, 117, 25, 0.5, 0.0)['gain_net_meur'], 0)
        self.assertLess(m.option_peines_courtes(D, 0.4, 117, 25, 0.1, 0.0)['gain_net_meur'], 0)

    def test_travail_sans_effet_sans_reduction(self):
        r = m.option_travail(99110, 62610, 0.28, 0.6, 0.6, 0.0, 6000)
        self.assertEqual(r['reconvictions_evitees_par_an'], 0)
        self.assertIsNone(r['cout_par_reconviction_evitee_eur'])

    def test_travail_cible_sous_actuel_ne_coute_rien(self):
        self.assertEqual(m.option_travail(99110, 62610, 0.5, 0.4, 0.6, 0.05, 6000)['cout_meur'], 0)

    def test_police_signe_des_elasticites(self):
        r = m.option_police(250000, 0.1, 65000, -0.34, -0.17, 1000, 1000)
        self.assertAlmostEqual(r['faits_evites_violents'], 34.0)
        self.assertAlmostEqual(r['faits_evites_biens'], 17.0)
        self.assertAlmostEqual(r['cout_meur'], 1625.0)

    def test_police_elasticite_nulle(self):
        self.assertIsNone(m.option_police(250000, 0.1, 65000, 0, 0, 1000, 1000)['cout_par_fait_evite_eur'])

    def test_prison_marginale_elasticite_nulle(self):
        self.assertEqual(m.option_prison_marginale(84741, 0.1, 117, 0.0, 1e6)['faits_evites'], 0)

    def test_eloignement_lineaire_en_part(self):
        a = m.option_eloignement(10000, 0.1, 6, 117, 0.5, 4414)
        b = m.option_eloignement(10000, 0.2, 6, 117, 0.5, 4414)
        self.assertAlmostEqual(b['eloignes'], 2 * a['eloignes'])
        self.assertAlmostEqual(b['gain_net_meur'], 2 * a['gain_net_meur'])

    def test_eloignement_rentable_si_restant_long(self):
        self.assertLess(m.option_eloignement(10000, 0.1, 1, 117, 0.5, 4414)['gain_net_meur'], 0)
        self.assertGreater(m.option_eloignement(10000, 0.1, 12, 117, 0.5, 4414)['gain_net_meur'], 0)

    def test_numerique_etp(self):
        r = m.option_numerique(1607 * 60, 1.0, 50000, heures_etp=1607)
        self.assertAlmostEqual(r['etp_liberes'], 1.0)
        self.assertAlmostEqual(r['valeur_meur'], 0.05)

    def test_numerique_investissement_reduit_le_net(self):
        a = m.option_numerique(1e6, 20, 50000)
        b = m.option_numerique(1e6, 20, 50000, investissement_meur=100)
        self.assertLess(b['gain_net_meur'], a['gain_net_meur'])

    def test_perpetuite_ordre_de_grandeur(self):
        self.assertTrue(10 < m.cout_perpetuite_meur(D['quantum_perpetuite_detenus'], 130) < 40)


class TestOrdresDeGrandeur(unittest.TestCase):
    def test_police_toujours_plus_cher_que_la_litterature_des_scenarios_croissants(self):
        # le coût par fait évité baisse quand l'élasticité augmente (bas > central > haut)
        bv, bb = 604552, 1191911
        c = [m.option_police(250000, 0.1, 65000, L['elasticite_crime_police_violent'][s],
                             L['elasticite_crime_police_biens'][s], bv, bb)['cout_par_fait_evite_eur'] for s in m.SCENARIOS]
        self.assertTrue(c[0] > c[1] > c[2])

    def test_bases_ssmsi_plausibles(self):
        self.assertTrue(500000 < INF['Violences physiques hors cadre familial'] + INF['Violences physiques intrafamiliales'] + INF['Violences sexuelles'] < 700000)
        self.assertGreater(INF['Homicides'], 500)

    def test_budget_justice_hausse_2025(self):
        self.assertGreater(K['budget_justice_cp'], K['budget_justice_cp_2024'])


class TestGardeFous(unittest.TestCase):
    def test_aucune_colonne_de_profilage_dans_les_donnees(self):
        d = os.path.join(m.ICI, 'donnees')
        for nom in os.listdir(d):
            if nom.endswith('.csv'):
                with open(os.path.join(d, nom), encoding='utf-8') as f:
                    m.verifier_sans_profilage(next(csv.reader(f)))
                with open(os.path.join(d, nom), encoding='utf-8') as f:
                    for row in csv.DictReader(f):
                        m.verifier_sans_profilage([row['cle']] if 'cle' in row else [row['indicateur']])

    def test_garde_fou_refuse_origine(self):
        with self.assertRaises(ValueError):
            m.verifier_sans_profilage(['part_detenus_origine_maghreb'])

    def test_etrangers_en_agregat_seulement(self):
        # le fichier ne contient aucune clé par pays
        for k in E:
            self.assertNotIn('algerie', k.lower())
            self.assertNotIn('maroc', k.lower())


if __name__ == '__main__':
    unittest.main()
