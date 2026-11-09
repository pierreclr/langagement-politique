#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chiffrage honnête et reproductible du programme de La France insoumise pour 2027 (« L'Avenir en commun » + document budgétaire d'octobre 2026).
Dossier : sources/chiffrage-programme-lfi-2027.md. Usage : python3 -I sources/calculs/chiffrage_programme_lfi_2027.py   -> tests + tableaux
Convention : Md€ par an, euros 2024-2026 sans croissance (les montants sont supposés suivre le PIB), ratios en % du PIB 2024.
Signe : coûts positifs ; solde = recettes nouvelles - dépenses nouvelles (+ améliore). « bas » = solde le plus bas (coûts hauts, recettes basses),
« haut » = solde le plus haut. Ordres de grandeur sous hypothèses, jamais des prédictions.
Règle de recoupement (convention, pas une vérité) pour une recette : haut = chiffre de LFI ; bas = chiffre indépendant le plus proche s'il existe,
sinon 35 % du chiffre de LFI (HYP_DECOTE_SANS_RECOUPEMENT) ; central = milieu de bas et haut.
"""
import math

# ---------------- Constantes d'entrée (sources dans le dossier .md) ----------------
PIB_2024 = 2935.0            # Md€, Insee (même base que sources/calculs/bilan_global.py)
DEFICIT_2024 = 169.1         # Md€, Insee comptes des APU 2024, t. 3.201 (via bilan_global.py)
INTERETS_2024 = 58.9         # Md€, charge de la dette 2024 (COFOG, via bilan_global.py)
DETTE_2024 = 3305.0          # Md€, dette publique fin 2024 ⚠️ À VÉRIFIER (Insee, ordre de grandeur lu de mémoire : 3 305 Md€, 113 % du PIB)
PO_2024 = 1253.2             # Md€, prélèvements obligatoires 2024 (via bilan_global.py), 42,7 % du PIB
DEPENSE_2024 = 1672.6        # Md€, dépense publique APU 2024 (via bilan_global.py), 57,0 % du PIB
MACRO_REFERENCE = dict(g=0.03, r=0.0345)   # modèle du dépôt : modeles/systeme-ideal/variante_dette_stable.js (HDS1)
MACRO_PRUDENTE = dict(g=0.025, r=0.0395)
DUREE_RENOUVELLEMENT = 8     # ans : le taux moyen de la dette rejoint le taux de marché au rythme du renouvellement (HDS4 du modèle)
ANNEE_DEBUT, AN_REGIME = 2027, 2032   # 1re loi de finances ; fin de mandat : régime des mesures
TAUX_RETOUR_RECETTES = 0.45  # part du PIB supplémentaire qui revient en recettes publiques (≈ PO + hors PO / PIB) ⚠️ hypothèse
MULT_DEP = {'bas': 0.3, 'central': 0.5, 'haut': 1.0}   # multiplicateur moyen des dépenses nouvelles en régime (hypothèses ; OFCE 2025 : un peu moins de 0,5 à un an en consolidation ; effet permanent plus faible qu'à un an)
RATIO_MULT_RECETTES = 0.5    # multiplicateur des hausses de recettes = 0,5 x celui des dépenses ⚠️ hypothèse (impôts sur hauts patrimoines)
EFFET_OFFRE = {'bas': -0.010, 'central': -0.003, 'haut': 0.0}   # niveau de PIB en régime, en % : effet d'offre (marges, exil, emploi) ⚠️ hypothèse non sourcée
HYP_DECOTE_SANS_RECOUPEMENT = 0.35
ECHELLE_PIB_2022_2024 = 2935.0 / 2640.0   # PIB 2022 ≈ 2 640 Md€ ⚠️ À VÉRIFIER (Insee) : remet à l'échelle de 2024 les chiffrages de 2022 de l'Institut Montaigne
# Pauvreté (Insee Première n° 2063, juillet 2025, données 2023, métropole)
PAUVRES = 9.8e6; INTENSITE = 0.192; SEUIL_INSEE = 1288.0; SEUIL_LFI = 1337.0
PART_ECART_COMBLE_AUTRES_MESURES = 0.30   # ⚠️ hypothèse : part de l'écart déjà comblée par SMIC, minima, pensions, AAH

def ecart_pauvrete(seuil=SEUIL_LFI):
    """Md€/an pour amener chaque personne pauvre au seuil : pauvres x intensité x seuil x 12 (par personne, ignore les unités de consommation)."""
    return PAUVRES * INTENSITE * seuil * 12 / 1e9

GA_PLEIN = ecart_pauvrete()

# ---------------- Dépenses : (id, chapitre, libellé, an1 LFI, favorable, central, défavorable, ancrage, source courte) ----------------
# ancrage : 'LFI' (chiffre du document budgétaire de LFI), 'indep' (chiffrage extérieur lu), 'calcul' (calcul du dépôt), 'grossier' (ordre de grandeur sans source primaire lue)
DEP = [
 ('D01', 'P2 ch2', 'Point d\'indice +10 % (compensation des collectivités)', 17.0, 17.0, 18.5, 20.0, 'LFI', 'LFI : 17 ; dépôt : 2,0 Md€ par point (HDS17)'),
 ('D02', 'P3 ch1/P2 ch2', 'Indexation pensions, allocations familiales, APL ; APL +10 %', 8.0, 8.0, 8.0, 8.0, 'LFI', 'LFI : 8'),
 ('D03', 'P3', 'Logements d\'urgence, réquisition', 3.0, 3.0, 3.0, 3.0, 'LFI', 'LFI : 3'),
 ('D04', 'P3 ch1/ch2', 'Garantie d\'autonomie (jeunes, puis chaque personne au seuil de pauvreté 1 337 €)', 9.5, 9.5, None, GA_PLEIN, 'calcul', 'LFI : jeunes 9,5 ; écart de pauvreté Insee x 1 337 €'),
 ('D05', 'P3 ch1', 'Retraite à 60 ans / 40 annuités (abroge la réforme de 2023 ; 9 la 1re année)', 9.0, 71.5 * ECHELLE_PIB_2022_2024, None, 85.8 * ECHELLE_PIB_2022_2024, 'indep', 'Institut Montaigne 2022 : 85,8 ; contre-chiffrage de LFI : 71,5 (euros 2022, remis à l\'échelle du PIB)'),
 ('D06', 'P3 ch1', 'Assurance chômage : abrogation des réformes (puis droits élargis)', 3.0, 3.0, 4.0, 6.0, 'grossier', 'LFI : 3 la 1re année ; bornes hautes sans source'),
 ('D07', 'P3 ch1', '« 100 % Sécu » : soins à 100 %, fin des franchises, arrêts maladie à 100 % sans carence', 0.0, 21.2, 30.0, 40.0, 'calcul', 'dépôt : 21,2 (décomposition des prélèvements) ; indemnités journalières 12,1 aujourd\'hui ; non chiffré par LFI'),
 ('D08', 'P4 ch4', 'Hôpital et soin : recrutements, revalorisations (Ségur-like)', 3.0, 3.0, 8.0, 13.0, 'LFI', 'LFI : 3 la 1re année ; haut = ordre du Ségur de la santé ⚠️ À VÉRIFIER'),
 ('D09', 'P4 ch2', 'Éducation : postes (10 000 en 1re année ; 23 -> 19 élèves par classe)', 0.5, 2.5, 6.0, 9.0, 'LFI', 'LFI : 10 000 postes = 0,5 (50 k€ par poste) ; 50 000 / 120 000 / 180 000 postes ⚠️ nombre d\'enseignants À VÉRIFIER'),
 ('D10', 'P4 ch2', 'Cantine scolaire gratuite', 3.6, 3.6, 3.6, 3.6, 'LFI', 'LFI : 3,6'),
 ('D11', 'P4 ch2', 'Université : gratuité, 250 000 places, Crous, immobilier', 3.5, 3.5, 5.0, 8.0, 'LFI', 'LFI : 3,5 la 1re année ; bornes hautes sans source'),
 ('D12', 'P3 ch3', 'Violences sexistes et sexuelles (2,6) et violences faites aux enfants (2)', 4.6, 4.6, 4.6, 4.6, 'LFI', 'LFI : 2,6 + 2'),
 ('D13', 'P3', 'Rattrapage des budgets 2026, indexés sur l\'inflation (travail, culture, sport, diplomatie, aide au développement)', 7.0, 7.0, 7.0, 7.0, 'LFI', 'LFI : 7'),
 ('D14', 'P1', 'Planification écologique (État) : rénovation 700 000 logements/an, bâtiments publics, sécurité civile', 10.0, 10.0, 25.0, 37.0, 'indep', 'LFI : 10 ; haut = 37 (Pisani-Ferry et Mahfouz, public, cité par LFI) ; central = milieu des bornes ⚠️'),
 ('D15', 'P2 ch1/ch3', 'Pôle public bancaire : 100 Md€/an investis ; part supportée par l\'État (subvention implicite, risque de reclassement)', 0.0, 0.0, 5.0, 20.0, 'grossier', 'LFI : aucun effet au déficit ; 0 / 5 % / 20 % de 100 Md€ ⚠️ hypothèse'),
 ('D16', 'P3 ch2/P5 ch3', 'Logement public : 200 000 par an (contre environ la moitié aujourd\'hui) + 30 000 logements jeunes', 0.0, 2.0, 4.0, 8.0, 'grossier', 'sans source lue (aide par logement x 100 000 logements en plus)'),
 ('D17', 'P3 ch3', 'Petite enfance : 500 000 places, gratuité des crèches publiques', 0.0, 5.0, 9.0, 14.0, 'indep', 'Banque des Territoires/Cour des comptes 2024 : 6,6 Md€ publics pour 470 000 places crèche (≈ 14 k€/place) ; 19 450 € de coût moyen par place ⚠️ À VÉRIFIER'),
 ('D18', 'P3 ch2', 'Dépendance : 10 000 places publiques par an pendant 5 ans, domicile en Sécu, statut d\'aidant', 0.0, 1.0, 2.5, 5.0, 'grossier', 'sans source lue'),
 ('D19', 'P3 ch2', 'AAH portée au niveau du SMIC', 0.0, 5.0, 8.0, 10.5, 'grossier', '≈ 1,3 million de bénéficiaires x écart à un SMIC de 1 443 à 1 700 € net ⚠️ À VÉRIFIER'),
 ('D20', 'P3 ch1', 'Garantie d\'emploi (chômeurs de longue durée, au moins au SMIC revalorisé), net des allocations évitées', 0.0, 3.0, 8.0, 15.0, 'grossier', '≈ 0,5 à 0,7 million de chômeurs de longue durée x (coût employeur - allocations) ⚠️ À VÉRIFIER'),
 ('D21', 'P3 ch1', 'Sixième semaine de congés payés (part employeur public)', 0.0, 0.0, 4.0, 8.0, 'grossier', '≈ 2 % de la masse salariale publique (370 Md€) si remplacement'),
 ('D22', 'P4 ch2/ch3', 'Gratuité de l\'école hors cantine, repas Crous à 1 €, culture à 1 % du PIB, sport', 0.0, 2.0, 6.0, 16.0, 'grossier', 'sans source lue ; culture à 1 % du PIB : écart au niveau actuel ⚠️ À VÉRIFIER'),
 ('D23', 'P5 ch3', 'Collectivités : DGF indexée, taxe d\'habitation progressive, moratoires de fermeture, services itinérants, outre-mer', 0.0, 1.0, 3.0, 8.0, 'grossier', 'sans source lue'),
 ('D24', 'P4 ch4', 'Centres de santé publics, pôle public du médicament, psychologues remboursés', 0.0, 2.0, 5.0, 10.0, 'grossier', 'sans source lue'),
 ('D25', 'P4 ch2', 'Service citoyen de 9 mois rémunéré au SMIC (si obligatoire pour toute une classe d\'âge)', 0.0, 0.0, 0.0, 17.0, 'grossier', '≈ 750 000 jeunes x 9 mois x ≈ 2 500 € ⚠️ caractère obligatoire non précisé'),
]
# Dépenses non chiffrées ici (voir dossier) : SMIC à 1 700 € net (coût surtout privé), blocage du carburant à 1,70 €, pension minimale au SMIC, nationalisations (opérations en capital).

# ---------------- Recettes : (id, libellé, LFI an 1, chiffre indépendant ou None, source indépendante) ----------------
REC = [
 ('R01', 'ISF climatique renforcé + suppression de la flat tax', 19.0, 5.0, 'Institut Montaigne 2022 : ≈ 5 pour les deux (programme 2022)'),
 ('R02', 'Rabot des niches fiscales et sociales (dont CIR, pacte Dutreil)', 22.0, None, 'aucun recoupement lu'),
 ('R03', 'CVAE rétablie sur les grandes entreprises', 3.0, None, 'aucun recoupement lu'),
 ('R04', 'Taxe Zucman (patrimoine > 100 M€) : 2 % minimum', 15.0, 5.5, 'Institut de l\'entreprise 2026 : ≈ 5,5 après déduction de l\'IS (cote C, patronal) ; Zucman : 15 à 25'),
 ('R05', 'Droits de succession (plafond d\'héritage 12 M€, exonération < 150 000 €)', 20.0, 9.0, 'Institut Montaigne 2022 : 9'),
 ('R06', 'Réforme de l\'impôt sur les sociétés', 3.0, None, 'aucun recoupement lu'),
 ('R07', 'Taxe universelle sur les multinationales', 5.0, None, 'Institut Montaigne 2022 : 18 (conception différente ⚠️), non retenu comme borne basse'),
 ('R08', 'Taxe Gafam renforcée', 3.9, None, 'aucun recoupement lu'),
 ('R09', 'Taxe sur les superprofits', 5.0, None, 'aucun recoupement lu'),
 ('R10', 'Taxe sur les transactions financières renforcée', 5.0, None, 'Institut Montaigne 2022 : 9 (programme 2022), non retenu comme borne basse'),
 ('R11', 'Rachats d\'actions (2,5) et crypto-actifs (1)', 3.5, None, 'aucun recoupement lu'),
 ('R12', 'Lutte contre la fraude fiscale (reconstruction des effectifs)', 2.0, None, 'Institut Montaigne 2022 écartait 26 annoncés ; LFI 2027 : 2 en 1re année'),
]
# Recette de régime hors budget 2027 : impôt sur le revenu à 14 tranches + fin du quotient conjugal
REC_REGIME_SEUL = [('R13', 'Impôt sur le revenu à 14 tranches, fin du quotient conjugal (crédit d\'impôt par enfant en regard, non chiffré)', 12.0, 4.0, 'Institut Montaigne 2022 : ≈ 12 ; bas = 1/3 ⚠️')]

def bornes_rec(r):
    """(bas, central, haut) d'une recette selon la règle de recoupement."""
    _, _, lfi, indep, _ = r
    bas = indep if indep is not None else HYP_DECOTE_SANS_RECOUPEMENT * lfi
    bas = min(bas, lfi)
    return bas, (bas + lfi) / 2.0, lfi

def dep_bornes(d):
    """(favorable, central, défavorable) d'une dépense ; central manquant = milieu."""
    _, _, _, _, fav, cen, dfv, _, _ = d
    if cen is None:
        cen = (fav + dfv) / 2.0
    return fav, cen, dfv

def totaux():
    """Totaux en régime : recettes (bas, central, haut), dépenses (favorable, central, défavorable)."""
    recs = [bornes_rec(r) for r in REC] + [bornes_rec(r) for r in REC_REGIME_SEUL]
    rec = tuple(sum(x[i] for x in recs) for i in range(3))
    dps = [dep_bornes(d) for d in DEP]
    dep = tuple(sum(x[i] for x in dps) for i in range(3))
    return rec, dep

def an1():
    """Budget 2027 : LFI (106,4 ; 81,7) et notre recoupement des recettes de l'année 1."""
    rec_lfi = sum(r[2] for r in REC)
    dep_lfi = sum(d[3] for d in DEP)
    rec_ours = tuple(sum(bornes_rec(r)[i] for r in REC) for i in range(3))
    return rec_lfi, dep_lfi, rec_ours

def sensibilite_macro(rec, dep, m_dep, effet_offre):
    """Retour sur le solde (Md€) d'un multiplicateur m sur dépenses/recettes nouvelles et d'un effet d'offre sur le niveau du PIB."""
    dpib = m_dep * dep / PIB_2024 - RATIO_MULT_RECETTES * m_dep * rec / PIB_2024 + effet_offre   # en part de PIB
    return TAUX_RETOUR_RECETTES * dpib * PIB_2024, dpib

def solde_regime(retraites_regime=None):
    """retraites_regime : remplace la ligne D05 (ex. 9 pour l'abrogation seule, sans retraite à 60 ans) ; None = programme complet."""
    return _solde_regime(retraites_regime)

def _solde_regime(retraites_regime):
    rec, dep = totaux()
    out = {}
    d05 = dep_bornes([d for d in DEP if d[0] == 'D05'][0])
    ajust = {} if retraites_regime is None else {'bas': retraites_regime - d05[2], 'central': retraites_regime - d05[1], 'haut': retraites_regime - d05[0]}
    for sc, (r, d) in {'bas': (rec[0], dep[2]), 'central': (rec[1], dep[1]), 'haut': (rec[2], dep[0])}.items():
        d = d + ajust.get(sc, 0.0)
        brut = r - d
        retour, dpib = sensibilite_macro(r, d, MULT_DEP[sc], EFFET_OFFRE[sc])
        out[sc] = dict(rec=r, dep=d, brut=brut, retour=retour, dpib=dpib, net=brut + retour)
    return out

def dette_trajectoire(delta_solde_primaire, annee_fin=2058, macro=MACRO_REFERENCE, primaire_base=None, debut=ANNEE_DEBUT):
    """
    Dette / PIB par année depuis fin 2024. delta_solde_primaire(an) : amélioration (+) du solde primaire en % du PIB par rapport au fil de l'eau.
    Fil de l'eau : solde primaire de 2024 maintenu (déficit 5,76 % moins intérêts 2,0 % = -3,76 % du PIB), sans consolidation (hypothèse prudente, pas la trajectoire officielle).
    Intérêts : taux moyen 2024 (intérêts / dette) rejoignant le taux de marché de la macro au rythme du renouvellement (1/8 par an).
    """
    g, r_m = macro['g'], macro['r']
    if primaire_base is None:
        primaire_base = -(DEFICIT_2024 - INTERETS_2024) / PIB_2024
    d = DETTE_2024 / PIB_2024
    r = INTERETS_2024 / DETTE_2024
    traj = {2024: d}
    for an in range(2025, annee_fin + 1):
        r = r + (r_m - r) / DUREE_RENOUVELLEMENT
        pb = primaire_base + (delta_solde_primaire(an) if an >= debut else 0.0)
        d = d * (1 + r) / (1 + g) - pb / (1 + g)
        traj[an] = d
    return traj

def rampe_lfi(solde_an1, solde_regime_md):
    """Amélioration du solde (Md€) : 2027 = solde de la 1re loi de finances, régime en 2032, linéaire entre les deux, constant ensuite."""
    def f(an):
        if an < ANNEE_DEBUT: return 0.0
        if an >= AN_REGIME: return solde_regime_md / PIB_2024
        t = (an - ANNEE_DEBUT) / (AN_REGIME - ANNEE_DEBUT)
        return (solde_an1 + t * (solde_regime_md - solde_an1)) / PIB_2024
    return f

def rampe_systeme(delta_regime_md=DEFICIT_2024 - 36.4, debut=2028, fin=2038):
    """Notre système, mêmes conventions : bascule neutre en 2028, leviers montés linéairement jusqu'en 2038 (S3), déficit en régime 36,4 Md€ (à intérêts de 2024)."""
    def f(an):
        if an < debut: return 0.0
        t = min(1.0, (an - debut + 1) / (fin - debut + 1))
        return t * delta_regime_md / PIB_2024
    return f

def po_et_depense(rec, dep):
    po = (PO_2024 + rec) / PIB_2024
    de = (DEPENSE_2024 + dep) / PIB_2024
    return po, de

def sensibilites_regime():
    """Grille du solde net en régime : multiplicateur x effet d'offre, au central de l'assiette (Md€)."""
    rec, dep = totaux()
    g = {}
    for m in (0.0, 0.3, 0.5, 1.0, 1.5):
        for off in (-0.010, -0.003, 0.0):
            r, d = rec[1], dep[1]
            retour, _ = sensibilite_macro(r, d, m, off)
            g[(m, off)] = r - d + retour
    return g

def tests():
    rec_lfi, dep_lfi, _ = an1()
    assert abs(rec_lfi - 106.4) < 0.05, 'recettes de l\'année 1 : 106,4 (LFI)'
    assert abs(dep_lfi - 81.7) < 0.05, 'dépenses de l\'année 1 : 81,7 (LFI)'
    assert abs((rec_lfi - dep_lfi) - 24.7) < 0.05, 'réduction du déficit annoncée : 24,7'
    assert abs(sum(d[3] for d in DEP if d[0] in ('D01', 'D02', 'D03', 'D04')) - 37.5) < 0.05, 'bloc « revenus des classes populaires » : 37,5'
    assert abs(sum(d[3] for d in DEP if d[0] in ('D09', 'D10', 'D11', 'D08', 'D12', 'D13')) - 22.2) < 0.05, 'bloc « services publics » : 22,2'
    assert abs(sum(d[3] for d in DEP if d[0] in ('D05', 'D06')) - 12.0) < 0.05, 'bloc « Sécurité sociale » : 12'
    assert abs(ecart_pauvrete(1288.0) - 29.1) < 0.2, 'écart de pauvreté Insee ≈ 29 Md€'
    rec, dep = totaux()
    assert rec[0] <= rec[1] <= rec[2] and dep[0] <= dep[1] <= dep[2]
    t0 = dette_trajectoire(lambda an: 0.0, 2058)
    assert t0[2058] > t0[2038] > t0[2030] > t0[2024], 'fil de l\'eau : dette croissante'
    # un solde primaire amélioré de ce qu'il faut pour stabiliser la dette la stabilise
    print('Tests : tous passés')

def main():
    tests()
    rec, dep = totaux()
    print('Recettes de régime (bas, central, haut) : %.1f %.1f %.1f' % rec)
    print('Dépenses de régime (favorable, central, défavorable) : %.1f %.1f %.1f' % dep)
    cl = {}
    for sc in ('bas', 'central', 'haut'):
        s = solde_regime()[sc]
        print(sc, {k: round(v, 3) for k, v in s.items()})
    rec_lfi, dep_lfi, rec_ours = an1()
    print('An 1 : LFI %.1f / %.1f ; recettes recoupées (bas, central, haut) : %.1f %.1f %.1f' % ((rec_lfi, dep_lfi) + rec_ours))
    an1_solde = {'bas': rec_ours[0] - dep_lfi, 'central': rec_ours[1] - dep_lfi, 'haut': rec_ours[2] - dep_lfi}
    print('Solde an 1 (hors SMIC et lignes non chiffrées) : ', {k: round(v, 1) for k, v in an1_solde.items()})
    sr = solde_regime()
    for sc in ('bas', 'central', 'haut'):
        for mname, mac in (('réf', MACRO_REFERENCE), ('prud', MACRO_PRUDENTE)):
            t = dette_trajectoire(rampe_lfi(an1_solde[sc], sr[sc]['net']), 2058, mac)
            print('LFI', sc, mname, 'dette 2038 %.1f %% ; 2058 %.1f %%' % (100 * t[2038], 100 * t[2058]))
    for mname, mac in (('réf', MACRO_REFERENCE), ('prud', MACRO_PRUDENTE)):
        t = dette_trajectoire(lambda an: 0.0, 2058, mac)
        print('Fil de l\'eau', mname, '2038 %.1f ; 2058 %.1f' % (100 * t[2038], 100 * t[2058]))
        t = dette_trajectoire(rampe_systeme(), 2058, mac)
        print('Système', mname, '2038 %.1f ; 2058 %.1f' % (100 * t[2038], 100 * t[2058]))
    for sc in ('bas', 'central', 'haut'):
        po, de = po_et_depense(sr[sc]['rec'], sr[sc]['dep'])
        print('PO %.1f %%  dépense %.1f %% (%s)' % (100 * po, 100 * de, sc))
    po, de = po_et_depense(rec_lfi, dep_lfi)
    print('An 1 LFI : PO %.1f %%, dépense %.1f %%' % (100 * po, 100 * de))
    for k, v in sensibilites_regime().items():
        print('m=%.1f offre=%.1f%% : solde %.1f' % (k[0], 100 * k[1], v))
    # abrogation seule (sans 60 ans) : variante
    va = solde_regime(retraites_regime=9.0)
    print('Variante abrogation seule (D05 = 9) :', {k: (round(v['brut'], 1), round(v['net'], 1)) for k, v in va.items()})
    print('Solde net de régime (bas, central, haut) :', {k: round(v['net'], 1) for k, v in sr.items()})
    for k, v in sr.items():
        print(k, 'PIB +%.1f %% ; retour %.1f' % (100 * v['dpib'], v['retour']))

if __name__ == '__main__':
    main()
