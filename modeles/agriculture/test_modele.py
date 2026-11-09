# -*- coding: utf-8 -*-
"""Tests du modèle Agriculture. Lancer depuis modeles/agriculture/ :
    python3 -m unittest test_modele -v
"""
import copy
import unittest

import modele as m

F = m.charger_filieres()
PAC = m.charger_pac()


class TestDonnees(unittest.TestCase):
    def test_parts_somment_a_un(self):
        for cle in ('part', 'phyto', 'azote'):
            self.assertAlmostEqual(sum(f[cle] for f in F), 1.0, places=9, msg=cle)

    def test_pac_postes_somment_au_total(self):
        postes = [k for k in PAC if k not in ('total', 'assurance_recolte')]
        # le total 8 479 inclut l'assurance récolte ; tous les postes publiés somment au total
        self.assertEqual(sum(PAC[k] for k in PAC if k != 'total'), PAC['total'])

    def test_calibrage_negatifs_sans_aides(self):
        # fait Chatellier 2025 : 42 % ; tolérance 5 points (calibrage stylisé, H5-H6)
        p = m.part_negative_nationale(F, m.CV_INTRA, True, 200)
        self.assertLess(abs(p - m.CIBLE_NEGATIF_SANS_AIDES), 0.05)

    def test_calibrage_masse_des_aides(self):
        # la sortie à 100 % doit représenter la base + les couplées (4 066 M€), à 15 % près
        cible = PAC['aide_de_base'] + PAC['couplees_animales'] + PAC['couplees_vegetales']
        self.assertLess(abs(m.montant_sortie_meur(F, m.HORIZON) / cible - 1.0), 0.15)

    def test_rcai_moyen_dans_la_fourchette_rica(self):
        moy = sum(f['part'] * f['rcai'] for f in F)
        self.assertTrue(35.0 < moy < 45.0)   # RICA 2024 : 40,4 k€

    def test_dependance_elevage_allaitant(self):
        d = {f['nom']: f['dependance'] for f in F}
        self.assertEqual(d['bovins_viande'], 1.97)
        self.assertTrue(d['bovins_viande'] > d['viticulture'])


class TestMaths(unittest.TestCase):
    def test_phase_bornes(self):
        self.assertEqual(m.phase(0), 0.0)
        self.assertEqual(m.phase(10), 1.0)
        self.assertEqual(m.phase(25), 1.0)
        self.assertAlmostEqual(m.phase(5), 0.5)

    def test_quantiles_symetriques(self):
        z = m.quantiles_z(20)
        self.assertAlmostEqual(z[0], -z[-1], places=9)
        self.assertAlmostEqual(sum(z), 0.0, places=9)

    def test_annuite_taux_nul(self):
        self.assertAlmostEqual(m.annuite(1000, 0, 10), 100.0)

    def test_annuite_taux_positif(self):
        self.assertGreater(m.annuite(1000, 0.05, 10), 100.0)
        self.assertAlmostEqual(m.annuite(1000, 0.05, 10), 129.5046, places=3)


class TestPAC(unittest.TestCase):
    def test_sortie_nulle_a_t0_et_croissante(self):
        self.assertEqual(m.montant_sortie_meur(F, 0), 0.0)
        v = [m.montant_sortie_meur(F, t) for t in range(0, 11)]
        self.assertTrue(all(b >= a for a, b in zip(v, v[1:])))

    def test_sortie_lineaire(self):
        self.assertAlmostEqual(m.montant_sortie_meur(F, 5) * 2, m.montant_sortie_meur(F, 10), places=6)

    def test_sans_reforme_aucun_changement(self):
        for nom, sc in m.SCENARIOS.items():
            for f in F:
                self.assertAlmostEqual(m.effets_par_exploitation(f, sc, 0), 0.0, places=9, msg=nom + f['nom'])

    def test_elevage_allaitant_perd_plus_que_viticulture_sans_pse(self):
        sc = m.SCENARIOS['central']
        fv = [f for f in F if f['nom'] == 'bovins_viande'][0]
        fvit = [f for f in F if f['nom'] == 'viticulture'][0]
        a = m.effets_par_exploitation(fv, sc, 10, avec_taxes=False, avec_robots=False)
        b = m.effets_par_exploitation(fvit, sc, 10, avec_taxes=False, avec_robots=False)
        self.assertLess(a, b)

    def test_plus_d_adaptation_moins_de_perte(self):
        f = F[0]
        v = {n: m.effets_par_exploitation(f, sc, 10, avec_taxes=False, avec_robots=False)
             for n, sc in m.SCENARIOS.items()}
        self.assertLess(v['bas'], v['central'])
        self.assertLess(v['central'], v['haut'])

    def test_pse_zero_aggrave_la_perte(self):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        base = m.effets_par_exploitation(F[0], sc, 10, avec_taxes=False, avec_robots=False)
        sc['part_pse'] = 0.0
        self.assertLess(m.effets_par_exploitation(F[0], sc, 10, avec_taxes=False, avec_robots=False), base)

    def test_fonds_ne_degrade_personne(self):
        for nom, sc in m.SCENARIOS.items():
            for t in (1, 5, 10):
                s = m.fonds_et_situation(F, sc, t, m.CV_INTRA)
                self.assertLessEqual(s['part_negatif_avec_fonds'], s['part_negatif_sans_fonds'] + 1e-12)
                # « ne perdre personne » : pas plus de négatifs qu'avant la réforme
                self.assertLessEqual(s['part_negatif_avec_fonds'], s['part_negatif_avant'] + 1e-12, msg=nom)
                self.assertGreaterEqual(s['fonds_meur'], 0.0)

    def test_fonds_nul_si_aucune_perte(self):
        sc = copy.deepcopy(m.SCENARIOS['haut'])
        sc.update(part_pse=1.0, capitalisation=0.0, adaptation=1.0)
        # perte nette nulle, taxes nulles
        sc.update(multiple_taxe_phyto=1.0, taxe_azote_eur_kg=0.0, perte_rend_phyto=0.0, perte_rend_azote=0.0)
        s = m.fonds_et_situation(F, sc, 10, m.CV_INTRA, avec_robots=False)
        self.assertAlmostEqual(s['fonds_meur'], 0.0, places=6)

    def test_budget_cadre_union_meilleur_que_france_seule(self):
        sc = m.SCENARIOS['central']
        u = m.budget(F, sc, 10, m.CV_INTRA, 'union')['net_meur']
        f = m.budget(F, sc, 10, m.CV_INTRA, 'france_seule')['net_meur']
        self.assertAlmostEqual(u - f, m.montant_sortie_meur(F, 10), places=6)

    def test_budget_identite(self):
        b = m.budget(F, m.SCENARIOS['central'], 7, m.CV_INTRA, 'union')
        net = b['poste_economie_meur'] + b['taxes_meur'] - b['restitution_meur'] - b['pse_meur'] - b['admin_meur'] - b['fonds_meur']
        self.assertAlmostEqual(net, b['net_meur'], places=9)

    def test_trajectoire_longueur(self):
        self.assertEqual(len(m.trajectoire(F, 'central')), m.HORIZON)


class TestRobots(unittest.TestCase):
    def test_prix_baisse(self):
        self.assertAlmostEqual(m.prix_robot_a(100.0, 0.1, 2), 81.0)

    def test_gain_croit_quand_prix_baisse(self):
        sc = m.SCENARIOS['central']
        self.assertGreater(m.gain_robot('grandes_cultures', sc, 10), m.gain_robot('grandes_cultures', sc, 0))

    def test_desherbage_grandes_cultures_non_rentable_aujourd_hui(self):
        # le robot coûte bien plus que l'herbicide : test de la thèse de l'auteur
        for sc in m.SCENARIOS.values():
            self.assertLess(m.gain_robot('grandes_cultures', sc, 0), 0.0)

    def test_equilibre_coherent_avec_gain_nul(self):
        sc = m.SCENARIOS['central']
        cas = 'grandes_cultures'
        pe = m.prix_robot_equilibre(cas, sc)
        old = m.ROBOTS[cas]['prix']
        try:
            m.ROBOTS[cas]['prix'] = pe
            self.assertAlmostEqual(m.gain_robot(cas, sc, 0), 0.0, places=6)
        finally:
            m.ROBOTS[cas]['prix'] = old

    def test_annee_equilibre_ordre_des_scenarios(self):
        a = [m.annee_equilibre('grandes_cultures', m.SCENARIOS[n]) for n in ('bas', 'central', 'haut')]
        self.assertTrue(a[0] > a[1] > a[2] > 0)

    def test_taxe_herbicide_rapproche_l_equilibre(self):
        sc = m.SCENARIOS['central']
        self.assertLess(m.annee_equilibre('grandes_cultures', sc, 30.0), m.annee_equilibre('grandes_cultures', sc, 0.0))

    def test_adoption_bornes(self):
        sc = m.SCENARIOS['central']
        self.assertAlmostEqual(m.adoption('maraichage_horticulture', sc, 0), 0.0, places=9)
        self.assertAlmostEqual(m.adoption('maraichage_horticulture', sc, 10), m.ADOPTION_PLAFOND['maraichage_horticulture'], places=9)

    def test_baisse_phyto_robots_nulle_si_non_rentable(self):
        # grandes cultures non rentables : seul le maraîchage compte, effet minuscule
        v = m.baisse_phyto_robots(F, m.SCENARIOS['central'], 10)
        self.assertTrue(0.0 <= v < 0.01)

    def test_baisse_phyto_robots_croit_avec_l_adaptation(self):
        a = m.baisse_phyto_robots(F, m.SCENARIOS['bas'], 10)
        b = m.baisse_phyto_robots(F, m.SCENARIOS['haut'], 10)
        self.assertLessEqual(a, b)

    def test_filiere_sans_robot(self):
        self.assertEqual(m.gain_robot_moyen('viticulture', m.SCENARIOS['haut'], 10), 0.0)


class TestPollueurPayeur(unittest.TestCase):
    def test_taux_effectif(self):
        self.assertAlmostEqual(m.taux_effectif_eur_kg(), 188e6 / 65.3e6, places=6)

    def test_pesticides_sans_hausse(self):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        r = m.pesticides(sc, 0)
        self.assertAlmostEqual(r['baisse_pct'], 0.0, places=9)
        self.assertAlmostEqual(r['recette_additionnelle_meur'], 0.0, places=6)
        self.assertAlmostEqual(r['delta_depense_agri_meur'], 0.0, places=6)

    def test_pesticides_elasticite_et_recette(self):
        a = m.pesticides(m.SCENARIOS['bas'], 10)
        b = m.pesticides(m.SCENARIOS['haut'], 10)
        self.assertLess(a['baisse_pct'], b['baisse_pct'])          # plus d'élasticité, plus de baisse
        self.assertGreater(a['recette_additionnelle_meur'], b['recette_additionnelle_meur'])  # assiette qui fond

    def test_multiple_pour_baisse(self):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        mult = m.multiple_pour_baisse(0.40, sc['elast_phyto'])
        sc['multiple_taxe_phyto'] = mult
        self.assertAlmostEqual(m.pesticides(sc, 10)['baisse_pct'], 40.0, places=6)
        self.assertEqual(m.multiple_pour_baisse(0.0, -0.28), 1.0)

    def test_azote_sans_taxe(self):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        sc['taxe_azote_eur_kg'] = 0.0
        r = m.azote(sc, 10)
        self.assertAlmostEqual(r['baisse_pct'], 0.0, places=9)
        self.assertAlmostEqual(r['recette_meur'], 0.0, places=9)

    def test_azote_co2e(self):
        self.assertAlmostEqual(m.KGCO2E_PAR_KG_N, 4.29, places=9)
        self.assertGreater(m.azote(m.SCENARIOS['haut'], 10)['co2e_evite_mt'], m.azote(m.SCENARIOS['bas'], 10)['co2e_evite_mt'])

    def test_recette_azote_unites(self):
        # 1 850 kt x 0,30 €/kg ≈ 555 M€ si la quantité ne bouge pas (élasticité nulle)
        sc = copy.deepcopy(m.SCENARIOS['central'])
        sc['elast_azote'] = 0.0
        self.assertAlmostEqual(m.azote(sc, 10)['recette_meur'], 1850.0 * 0.30, places=6)


if __name__ == '__main__':
    unittest.main()
