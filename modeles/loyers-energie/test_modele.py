# -*- coding: utf-8 -*-
# Tests : python3 -I test_modele.py
import math, os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import modele as M


def cas_g_gaz():
    # 50 m², G, gaz : besoin 15 000 kWh/an, conso de chauffage 17 600 kWh EF (rendement 0,85), autres usages 2 000 kWh de gaz et 1 500 kWh d'électricité
    return dict(surface=50.0, besoin_ch=15000.0, besoin_froid=0.0, conso_ch_ef=17600.0, energie_ch='Gaz naturel',
                conso_autres=[('Gaz naturel', 2000.0), ('Électricité', 1500.0)])


class Tests(unittest.TestCase):
    def test_taille(self):
        self.assertEqual(M.taille(20), 'studio'); self.assertEqual(M.taille(27), 'T2'); self.assertEqual(M.taille(60), 'T3')
        self.assertEqual(M.taille(109.9), 'T4'); self.assertEqual(M.taille(150), 'T5+'); self.assertIsNone(M.taille(5))

    def test_energie_et_classe(self):
        self.assertEqual(M.categorie_energie('Électricité'), 'electricite')
        self.assertEqual(M.categorie_energie('Réseau de Chauffage urbain'), 'reseau')
        self.assertEqual(M.categorie_energie('Bois – Bûches'), 'bois')
        self.assertEqual(M.categorie_energie('Fioul domestique'), 'fioul')
        self.assertEqual([M.classe_ep(x) for x in (70, 71, 110, 180, 250, 330, 420, 421)], list('ABBCDEFG'))

    def test_droite_marche_passe_par_les_references(self):
        a, v = M.droite_marche(20.0, 16.0)
        self.assertAlmostEqual(a + v * 37, 20 * 37); self.assertAlmostEqual(a + v * 72, 16 * 72)
        a, v = M.droite_marche(10.0, 20.0)   # pente aberrante négative ou base négative : repli proportionnel
        a2, v2 = M.droite_marche(30.0, 10.0)
        self.assertGreaterEqual(v, 0); self.assertGreaterEqual(a2, 0); self.assertGreaterEqual(v2, 0)

    def test_deduction(self):
        cout = M.cout_usages([('Gaz naturel', 17600), ('Gaz naturel', 2000), ('Électricité', 1500)])
        d1 = M.deduction_mensuelle(cout, 17600, 'Gaz naturel', 15000, alpha=1.0)
        self.assertAlmostEqual(d1, cout / 12)
        d0 = M.deduction_mensuelle(cout, 17600, 'Gaz naturel', 15000, alpha=0.0)
        autres = cout - 17600 * 0.13
        self.assertAlmostEqual(d0, (autres + 15000 * M.P_REF_BESOIN) / 12)
        self.assertAlmostEqual(M.deduction_mensuelle(cout, 17600, 'Gaz naturel', 15000, alpha=0.3),
                               0.3 * d1 + 0.7 * d0)

    def test_calibrage_donne_k_fois_le_median_pour_le_logement_moyen(self):
        droite = (150.0, 10.0)
        L = [dict(surface=s, d=d) for s, d in [(30, 50), (34, 70), (38, 90)]]  # toutes en T2
        for k in (1.1, 1.2, 1.5):
            bases, vp = M.calibrer_zone(L, droite, k, nmin=1)
            s_moy = sum(x['surface'] for x in L) / 3; d_moy = sum(x['d'] for x in L) / 3
            self.assertAlmostEqual(M.plafond(bases['T2'], vp, s_moy, d_moy), k * (150 + 10 * s_moy))
            self.assertAlmostEqual(vp, k * 10)

    def test_repli_pour_petits_echantillons(self):
        droite = (100.0, 10.0)
        petit = [dict(surface=50, d=100)]
        grand = [dict(surface=50 + i % 3, d=80 + i % 5) for i in range(30)]
        b1, _ = M.calibrer_zone(petit, droite, 1.2, repli=grand, nmin=20)
        b2, _ = M.calibrer_zone(grand, droite, 1.2, nmin=20)
        self.assertAlmostEqual(b1['T3'], b2['T3'])

    def test_lognormal(self):
        med, s = 1000.0, 0.2
        self.assertAlmostEqual(M.part_depassant(med, med, s), 0.5)
        self.assertAlmostEqual(M.part_depassant(med, med * math.exp(1.2816 * s), s), 0.10, places=3)  # D9
        self.assertLess(M.part_depassant(med, 1500, s), M.part_depassant(med, 1200, s))
        # monte-carlo déterministe : quadrature sur les quantiles
        n = 20000
        tot = 0.0
        for i in range(n):
            z = M_phi_inv((i + 0.5) / n)
            tot += max(0.0, med * math.exp(s * z) - 1200)
        self.assertAlmostEqual(M.baisse_esperee(med, 1200, s), tot / n, delta=0.5)
        self.assertAlmostEqual(M.loyer_apres(med, 1200, s) + M.baisse_esperee(med, 1200, s), med * math.exp(s * s / 2))
        self.assertGreaterEqual(M.baisse_esperee(med, 0, s), med)

    def test_travaux(self):
        n = M.appliquer_travaux(cas_g_gaz(), isolation=True)
        self.assertAlmostEqual(n['besoin_ch'], 15000 * 0.55); self.assertAlmostEqual(n['surface'], 48.0)
        n = M.appliquer_travaux(cas_g_gaz(), pac=True)
        self.assertEqual(n['energie_ch'], 'Électricité'); self.assertAlmostEqual(n['conso_ch_ef'], 15000 / 3.0)
        self.assertAlmostEqual(n['besoin_ch'], 15000)   # la pompe à chaleur ne change pas le bâti
        n = M.appliquer_travaux(cas_g_gaz(), pac=True, isolation=True)
        self.assertAlmostEqual(n['conso_ch_ef'], 15000 * 0.55 / 3.0)

    def test_paradoxe_pompe_a_chaleur_contre_isolation(self):
        lg = cas_g_gaz()
        base = M.indicateurs_cas(lg, 1.0)
        pac = M.indicateurs_cas(M.appliquer_travaux(lg, pac=True), 1.0)
        iso = M.indicateurs_cas(M.appliquer_travaux(lg, isolation=True), 1.0)
        # la classe DPE remonte plus avec la pompe à chaleur seule qu'avec l'isolation seule
        self.assertEqual(base['classe'], 'G')
        self.assertLess(pac['ep_m2'], iso['ep_m2'])
        # formule en coût réel seul (alpha = 1) : la pompe à chaleur rapporte plus de plafond que l'isolation
        g_pac_1 = base['deduction'] - pac['deduction']; g_iso_1 = base['deduction'] - iso['deduction']
        self.assertGreater(g_pac_1, g_iso_1)
        # formule proposée (alpha = 0,3) : l'isolation seule rapporte plus que la pompe à chaleur seule
        b3 = M.indicateurs_cas(lg, M.ALPHA)
        g_pac = b3['deduction'] - M.indicateurs_cas(M.appliquer_travaux(lg, pac=True), M.ALPHA)['deduction']
        g_iso = b3['deduction'] - M.indicateurs_cas(M.appliquer_travaux(lg, isolation=True), M.ALPHA)['deduction']
        g_both = b3['deduction'] - M.indicateurs_cas(M.appliquer_travaux(lg, pac=True, isolation=True), M.ALPHA)['deduction']
        self.assertGreater(g_iso, g_pac); self.assertGreater(g_both, g_iso); self.assertGreater(g_pac, 0)
        # surface perdue : le plafond avec surface de référence figée est supérieur
        self.assertGreater(M.plafond(400, 10, 50, 100), M.plafond(400, 10, 48, 100))

    def test_besoin_utile(self):
        b, imp = M.besoin_utile(10000, 50, 11000, 'Gaz naturel'); self.assertFalse(imp); self.assertEqual(b, 10000)
        b, imp = M.besoin_utile(47000, 50, 5600, 'Gaz naturel'); self.assertTrue(imp); self.assertAlmostEqual(b, 5600 * 0.85)
        b, imp = M.besoin_utile(0, 50, 5600, 'Électricité'); self.assertTrue(imp); self.assertAlmostEqual(b, 5600)


def M_phi_inv(p):
    lo, hi = -8.0, 8.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if M.phi(mid) < p: lo = mid
        else: hi = mid
    return (lo + hi) / 2


if __name__ == '__main__':
    unittest.main(verbosity=1)
