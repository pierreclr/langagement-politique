#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Écriture de resultats.md à partir des résultats de relancer.py (texte en français, nombres à virgule décimale)."""
import datetime


def f(x, n=1):
    if x is None:
        return 'n.d.'
    return ('%.*f' % (n, x)).replace('.', ',').replace('-', '−')


def pct(x, n=1):
    return f(100 * x, n) if x is not None else 'n.d.'


def iv(d, n=1, mult=1.0):
    """médiane [p10 ; p90]"""
    if d is None or d.get('p50') is None:
        return 'n.d.'
    if abs(d['p10'] - d['p90']) < 1e-12:
        return f(mult * d['p50'], n)
    return '%s [%s ; %s]' % (f(mult * d['p50'], n), f(mult * d['p10'], n), f(mult * d['p90'], n))


BRANCHE = {
    'retraites_age': 'modeles/retraites/age_libre.js (jsc) : cohortes, mortalité, pension, recettes perdues ; cohorte recalée par modeles/demographie/ (Python)',
    'ir_openfisca': 'OpenFisca-France 176.1.10 (venv) : impôt sur le revenu, population de foyers types',
    'isf': 'modeles/systeme-ideal/grandes_fortunes_0511.js : patrimoine, érosion, exil',
    'plancher': 'modeles/systeme-ideal/grandes_fortunes_0511.js : patrimoine, érosion, exil',
    'succession': 'modeles/systeme-ideal/transmissions_0611.js : loi du cumul reçu, comportements',
    'produit': 'coût unitaire sourcé x quantité sourcée (DEPP, DREES, Insee, modèle)',
    'smic': 'leviers2.py : lognormale des salaires + grille OpenFisca-France (cotisations, allègement, impôt, prime d\'activité) par foyer type',
    'pension_min': 'leviers2.py : distribution DREES (EIR 2020, carrières complètes) via modeles/retraites/donnees/',
    'carburant': 'leviers2.py : volume SDES/UFIP x écart au plafond, marges absorbables',
    'nationalisation': 'leviers2.py : prix (capitalisation x prime), dette (opération financière), dividendes',
    'iff': 'modeles/systeme-ideal/grandes_fortunes_0511.js (barème sobre, érosion, exil) appliqué à la part financière, moins l\'IFI supprimé',
    'ir_jeunes': 'OpenFisca-France 176.1.10 (IR d\'un salarié seul par salaire, rn_openfisca.py) x effectif de moins de 30 ans',
    'cout_unitaire': 'montant du programme ou ordre de grandeur (voir l\'ancrage)',
}


def ecrire(R, meta, ctx):
    L, lfi, nous, fe, rn = [], R['lfi'], R['langagement'], R['fil_de_l_eau'], R['rn']
    A = L.append
    A('---')
    A('titre: Résultats du banc d\'essai commun des programmes (LFI, Rassemblement national, notre système, fil de l\'eau)')
    A('date: 2026-11-08')
    A('statut: généré par relancer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions')
    A('---')
    A('')
    A('# Résultats du banc d\'essai')
    A('')
    A('Généré le %s par `python3 -I modeles/banc-programmes/relancer.py` : %d tirages de Monte-Carlo, graine %d. Écrit par Claude (IA d\'Anthropic) pour l\'auteur ; conflit d\'intérêts à déclarer : l\'auteur du manifeste est partie prenante (candidat potentiel) et le même moteur chiffre notre système et deux programmes concurrents (La France insoumise, Rassemblement national). Convention : **fait sourcé** / **estimation** / **opinion** ; ⚠️ = non vérifié (voir `verifications.md`).' % (datetime.date.today().strftime('%d/%m/%Y'), R['tirages'], R['graine']))
    A('')
    A('Unités : Md€ par an, euros de 2025 (constants), effet sur le solde positif = améliore ; parts du PIB. **Médiane [intervalle à 80 % : centiles 10 et 90]**. Le régime est atteint en 2032 pour LFI, le Rassemblement national et le fil de l\'eau (mandat 2027-2032), en 2038 pour notre système (rampe du modèle) ; les déficits et dettes sont comparés aux mêmes années. Dette de départ : 3 460,5 Md€ fin 2025 (115,7 % du PIB), macro de référence (croissance nominale 3 %, taux de marché 3,45 %), la même pour tous.')
    A('')
    A('## 1. Tableau comparatif (résultat statique, c\'est-à-dire sans effet de relance)')
    A('')
    pib0 = ctx['eco']['pib0']
    DEF0 = ctx['eco']['deficit2024']
    def deficit_restant(p):
        """Déficit restant en régime, statique (Md€ de 2025) = déficit de 2024 (169,1) moins la réduction ; mêmes centiles inversés."""
        return {'p10': DEF0 - p['p90'], 'p50': DEF0 - p['p50'], 'p90': DEF0 - p['p10']}
    def pct_pib(d):
        return {k: 100.0 * v / pib0 for k, v in d.items()}
    A('| | LFI (2027) | Rassemblement national (2027) | Notre système | Fil de l\'eau |')
    A('|---|---|---|---|---|')
    NS = nous
    s41 = deficit_restant(NS['solde_2041'])
    A('| **Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€)** | %s | %s | %s (2038) ; %s (2041 et après) | 0 |' % (iv(lfi['solde_regime'], 0), iv(rn['solde_regime'], 0), iv(NS['solde_regime'], 0), iv(NS['solde_2041'], 0)))
    A('| dont recettes nouvelles et économies (Md€) | %s | %s | non détaillé ici (voir bilan global) | 0 |' % (iv(lfi['recettes_regime'], 0), iv(rn['recettes_regime'], 0)))
    A('| dont baisses d\'impôts et dépenses nouvelles (Md€) | %s | %s | non détaillé ici | 0 |' % (iv(lfi['depenses_regime'], 0), iv(rn['depenses_regime'], 0)))
    dl, dr_ = deficit_restant(lfi['solde_regime']), deficit_restant(rn['solde_regime'])
    d38 = deficit_restant(NS['solde_regime'])
    A('| **Déficit restant en régime, statique (Md€ de 2025 ; déficit de 2024 de 169,1 Md€ moins la ligne précédente, avant coût des intérêts nouveaux)** | %s | %s | %s (2038) ; %s (2041 et après) | 169 |' % (iv(dl, 0), iv(dr_, 0), iv(d38, 0), iv(s41, 0)))
    A('| **Déficit restant en régime, statique (%% du PIB de 2025 : %s Md€)** | %s | %s | %s (2038) ; %s (2041 et après) | %s |' % (f(pib0, 0), iv(pct_pib(dl), 1), iv(pct_pib(dr_), 1), iv(pct_pib(d38), 1), iv(pct_pib(s41), 1), f(100 * DEF0 / pib0, 1)))
    if lfi.get('capital') and lfi['capital']['p50']:
        A('| Capital engagé en nationalisations, 2028-2030 (Md€, opération financière : dette, pas déficit, sauf transferts) | %s | 0 | 0 | 0 |' % iv(lfi['capital'], 0))
    A('| Prélèvements obligatoires, en régime (%% du PIB ; 42,7 %% en 2024) | %s | %s | %s | 42,7 |' % (iv({k: 100 * v for k, v in lfi['po_pct'].items()}, 1), iv({k: 100 * v for k, v in rn['po_pct'].items()}, 1), iv({k: 100 * v for k, v in NS['po_pct'].items()}, 1)))
    A('| Dépense publique, 2038 (%% du PIB, intérêts compris ; 57,0 %% en 2024) | %s | %s | %s | %s |' % (iv({k: 100 * v for k, v in lfi['dep_pct'].items()}, 1), iv({k: 100 * v for k, v in rn['dep_pct'].items()}, 1), iv({k: 100 * v for k, v in NS['dep_pct'].items()}, 1), pct(fe['dep_pct']['p50'])))
    A('| Déficit public, 2038 (%% du PIB, intérêts compris ; 5,1 %% en 2025) | %s | %s | %s | %s |' % (iv({k: 100 * v for k, v in lfi['deficit2038_pct'].items()}, 1), iv({k: 100 * v for k, v in rn['deficit2038_pct'].items()}, 1), iv({k: 100 * v for k, v in NS['deficit2038_pct'].items()}, 1), pct(fe['deficit2038_pct']['p50'])))
    A('| **Dette publique 2038 (%% du PIB)** | %s | %s | %s | %s |' % (iv({k: 100 * v for k, v in lfi['dette2038'].items()}, 0), iv({k: 100 * v for k, v in rn['dette2038'].items()}, 0), iv({k: 100 * v for k, v in NS['dette2038'].items()}, 0), pct(fe['dette2038']['p50'])))
    A('| **Dette publique 2058 (%% du PIB)** | %s | %s | %s | %s |' % (iv({k: 100 * v for k, v in lfi['dette2058'].items()}, 0), iv({k: 100 * v for k, v in rn['dette2058'].items()}, 0), iv({k: 100 * v for k, v in NS['dette2058'].items()}, 0), pct(fe['dette2058']['p50'])))
    A('| Dette 2038, macro prudente (croissance 2,5 %%, taux 3,95 %%) | %s | %s | %s | %s |' % (pct(lfi['dette2038_prudente'], 0), pct(rn['dette2038_prudente'], 0), iv({k: 100 * v for k, v in NS['dette2038_prudente_p'].items()}, 0), pct(fe['dette2038_prudente'], 0)))
    A('| Dette 2058, macro prudente | %s | %s | %s | %s |' % (pct(lfi['dette2058_prudente'], 0), pct(rn['dette2058_prudente'], 0), iv({k: 100 * v for k, v in NS['dette2058_prudente_p'].items()}, 0), pct(fe['dette2058_prudente'], 0)))
    A('')
    A('Lecture. (1) Pour LFI et le Rassemblement national, l\'intervalle porte sur les mesures chiffrées ligne à ligne (tirages corrélés, § 6) ; pour LFI, les quatre mesures longtemps laissées hors totaux y sont avec leurs propres fourchettes (§ 5 bis) ; l\'intervalle ne couvre pas ce que les programmes feront réellement des lignes restées non chiffrées (§ 5). Pour le Rassemblement national, la borne haute de chaque économie annoncée est l\'annonce du parti elle-même, et la médiane est notre estimation réalisable compte tenu des contraintes juridiques et pratiques nommées ligne par ligne (§ 5 ter) ; le Rassemblement national ne publie pas de calendrier complet de ses mesures de retraite (présentation annoncée le 17/11/2026). (2) **Pour notre système, la méthode est la même** (§ 6 ter) : chaque module du modèle (garantie de transition, fonction du patrimoine v7.5 et ses comportements, transmissions, fonction des revenus et crédit d\'IS, courbe des pensions, TVA, économies, grand âge, chiffrage du 08/11, Sécurité sociale à 100 %%, conversions en salaire, plancher en deux parts, outre-mer, etc.) est rejoué à ses bornes favorable et défavorable, avec les mêmes facteurs communs (comportement, coût) et les mêmes 10 000 tirages ; le niveau des leviers votés est fixe (33,3 Md€, calé au central, après correction du double compte du report d\'encaissement). La valeur centrale du modèle (déterministe : %s Md€ en 2038, %s en 2041, dette %s %% en 2038 et %s %% en 2058) est dans le test du § 4 ; la médiane du tirage s\'en écarte peu parce que les bornes ne sont pas symétriques. **L\'intervalle de notre système est sous-estimé** : le socle hérité de l\'architecture v5, les corrections du grand livre et l\'impôt de suite sont fixés à leur valeur centrale (§ 6 ter, § 9). (3) Le « fil de l\'eau » est le droit actuel : solde primaire de 2024 maintenu en part du PIB, sans consolidation ; ce n\'est pas la trajectoire officielle. (4) Les prélèvements et la dépense des programmes ne contiennent pas le retour macroéconomique (§ 2). (5) « Déficit restant en régime » est une écriture statique : le déficit de 2024 (169,1 Md€ de 2025) moins l\'effet des mesures ; il ne contient pas la hausse des intérêts due à une dette plus élevée, que la ligne « Déficit public, 2038 » intègre.' % (f(nous['central']['solde_2038'], 1), f(nous['central']['solde_2041'], 1), pct(nous['central']['dette2038'], 1), pct(nous['central']['dette2058'], 1)))
    A('')
    A('**Note : pourquoi +113 Md€ en 2038 ici et 113,2 Md€ dans `sources/decomposition-prelevements-0811.md`, et pourquoi le saut de 2041 a disparu (notre système).** (a) **Avant le 08/11/2026 (nuit)**, la trajectoire de nos modèles avait un saut du solde primaire de +25,0 Md€ de 2025 entre 2040 et 2041 (+0,8 point de PIB ; V32012) : l\'hypothèse H537 (`dureeFlux = 12`, `Z.HYP.dureeCreance = 12`) faisait durer douze ans, de 2029 à 2040, deux reports d\'encaissement hérités de la v5 (13,5 Md€ dans `Stress.pbStruct`, 11,5 Md€ dans `Decisions0511b.ajustement`), alors que la fonction du patrimoine v7.4 / v7.5 a sa propre trésorerie du différé (flux de 12,4 Md€ par an, encours de 149 Md€) : le même report était compté deux fois (V32018). (b) **Correction, décision de l\'auteur du 08/11/2026, couche `CORRECTION0811`** : les deux reports hérités sont retirés, la seule trésorerie de la v7.4 est gardée, écrite comme un stock qui se rembourse de 1/12 par an (hypothèse de modélisation HC1 ; avec une durée fixe de 12 ans, un saut résiduel de 11,8 Md€ subsisterait en 2041) ; les leviers votés de S3 passent de 52,8 à 33,3 Md€ pour la même règle de dette (dette stable à partir de 2038) ; le plafond des transmissions est ramené de 60 à 50 %% au-delà de 10 M€. Le banc lit l\'effet de notre système en **2038**, l\'année où la rampe atteint son plein régime : %s Md€ en 2038 (le pic de dette du modèle est en %s), %s Md€ en 2041 : **plus de saut**. (c) **Unités** : 113,2 Md€ (décomposition des prélèvements) est écrit en euros de 2024 sans croissance, sur le PIB de 2024 ; il équivaut à %s Md€ de 2025, contre %s Md€ ici en 2041 (écart de %s Md€ : écriture statique de régime d\'un côté, trajectoire avec le coût de trésorerie du différé de l\'autre). (d) **Périmètre** : les deux sont la réduction du déficit primaire par rapport au droit actuel ; ni l\'un ni l\'autre ne contient les intérêts supplémentaires ni le retour macroéconomique. **Conséquence pour la lecture** : il reste en déficit : environ %s Md€ (%s %% du PIB) en régime structurel (2041 et après), %s Md€ (%s %%) en 2038. La ligne « 2041 et après » du tableau est gardée pour comparer des régimes.' % (f(nous['central']['solde_2038'], 1), nous.get('pic_an', '2037'), f(nous['central']['solde_2041'], 1), f(113.2 * pib0 / 2935.0, 1), f(nous['central']['solde_2041'], 1), f(abs(113.2 * pib0 / 2935.0 - nous['central']['solde_2041']), 1), f(DEF0 - nous['central']['solde_2041'], 0), f(100 * (DEF0 - nous['central']['solde_2041']) / pib0, 1), f(DEF0 - nous['central']['solde_2038'], 0), f(100 * (DEF0 - nous['central']['solde_2038']) / pib0, 1)))
    A('')
    A('## 2. Relance macroéconomique, présentée à part')
    A('')
    A('Principe : le résultat statique (§ 1) suppose un PIB inchangé. L\'effet de relance ajoute : variation du PIB = m x dépenses nouvelles / PIB − r x m x recettes nouvelles / PIB + effet d\'offre ; retour sur le solde = 45 % de la variation du PIB (part des recettes publiques dans le PIB, ⚠️ hypothèse V31008). Lois (tirage indépendant du reste) : multiplicateur des dépenses m de 0,3 à 1,5 (mode 0,8) ; rapport r du multiplicateur des recettes à celui des dépenses de 0,3 à 1,0 (mode 0,5) ; effet d\'offre sur le niveau du PIB de −1,0 % à 0 (mode −0,3 %, ⚠️ sans source).')
    A('')
    A('| | LFI statique | LFI avec relance | RN statique | RN avec relance | Notre système statique | Notre système avec relance |')
    A('|---|---|---|---|---|---|---|')
    ns = nous
    A('| Effet sur le solde en régime (Md€) | %s | %s | %s | %s | %s | %s |' % (iv(lfi['solde_regime'], 0), iv(lfi['solde_rel'], 0), iv(rn['solde_regime'], 0), iv(rn['solde_rel'], 0), iv(ns['solde_regime'], 0), iv(ns['solde_rel'], 0)))
    for lib, kk, kr in (('Déficit 2038 (%% du PIB)', 'deficit2038_pct', 'deficit2038_rel'), ('Dette 2038 (%% du PIB)', 'dette2038', 'dette2038_rel'), ('Dette 2058 (%% du PIB)', 'dette2058', 'dette2058_rel')):
        n = 1 if 'Déficit' in lib else 0
        A(('| ' + lib + ' | %s | %s | %s | %s | %s | %s |') % tuple(iv({k: 100 * v for k, v in R_[kx].items()}, n) for R_ in (lfi, rn, ns) for kx in (kk, kr)))
    A('')
    A('Pour notre système, les recettes nouvelles (R) montent comme la rampe du modèle jusqu\'en 2038 (part (an − 2028) / 10) et les dépenses nouvelles sont déduites (D = R − effet sur le solde) : ⚠️ convention, le modèle ne publie pas la série brute des deux ; les prélèvements obligatoires passent de 42,7 % à 52,2 % du PIB (recettes nouvelles de l\'ordre de 280 Md€ en régime, dont une grande part est reversée en prestations, socle et crédit d\'IS). Le même effet d\'offre (−1,0 % à 0 du niveau du PIB) est appliqué à tous.')
    A('')
    A('Pour le Rassemblement national, la relance suppose des multiplicateurs communs aux deux programmes ; l\'annexe du RN retient de son côté 2,8 points de croissance supplémentaire sur cinq ans pour 0,5 point d\'effet récessif des économies, soit une asymétrie que la littérature ne valide pas selon l\'Institut de l\'Entreprise (note du 06/10/2026, cote C) ; le banc applique les mêmes lois à tous.')
    A('')
    A('Sources des multiplicateurs : Valerie Ramey, « Ten Years after the Financial Crisis: What Have We Learned from the Renaissance in Fiscal Research? », *Journal of Economic Perspectives* 33(2), 2019, p. 89-114 (https://www.aeaweb.org/doi/10.1257/jep.33.2.89, consulté le 08/11/2026, résumé seulement) : la plupart des estimations moyennes se situent entre 0,6 et 1 pour les dépenses, avec des circonstances où les multiplicateurs sortent de cette plage (cote A, revue à comité de lecture, aucun conflit connu) ; Blanchard et Leigh (2013) : multiplicateurs sous-estimés en 2010-2011, de l\'ordre de 1,5 (cité de mémoire, ⚠️ non relu, V31011) ; OFCE 2025 : un peu moins de 0,5 pour une consolidation (⚠️ non relu, V31008). La borne basse 0,3 et la borne haute 1,5 sont donc nos hypothèses encadrant ces lectures. Ramey situe les multiplicateurs de recettes entre −2 et −3 pour des changements d\'impôts généraux : nous retenons un rapport r bien plus faible parce que les recettes de LFI sont concentrées sur les hauts patrimoines et les entreprises (⚠️ hypothèse, sensible).')
    A('')
    A('## 3. Empilement des extrêmes (pour mémoire, non recommandé)')
    A('')
    ex = lfi['extremes']
    A('Chaque mesure à son pire (ou son meilleur) résultat en même temps, au centile 10 (ou 90) de ses paramètres : solde de régime **%s** à **%s** Md€ ; dette 2038 de **%s %%** à **%s %%**, dette 2058 de **%s %%** à **%s %%**. L\'intervalle à 80 %% du § 1 est plus étroit parce que les erreurs ne sont pas toutes du même côté en même temps ; les facteurs communs (comportement des assiettes, dérive des coûts) gardent une partie de l\'ampleur (§ 7).' % (f(ex['solde_defavorable'], 0), f(ex['solde_favorable'], 0), pct(ex['dette2038_favorable'], 0), pct(ex['dette2038_defavorable'], 0), pct(ex['dette2058_favorable'], 0), pct(ex['dette2058_defavorable'], 0)))
    A('')
    exs = nous['extremes']
    A('')
    A('Notre système, même exercice : chaque module à son centile 10 (ou 90) en même temps, leviers votés inchangés : solde de 2038 de **%s** à **%s** Md€ ; dette 2038 de **%s %%** à **%s %%**, dette 2058 de **%s %%** à **%s %%** (négative : la dette serait remboursée). Les scénarios d\'ensemble « bas » et « haut » du modèle, qui mêlent des postes de l\'ancienne architecture remplacés par des couches, donnent un solde primaire de 2038 de %s à %s Md€ (central %s) : ils ne sont pas utilisés ici, mais ils disent que le socle hérité, non propagé, pèse potentiellement plus que tous les modules propagés (§ 9).' % (f(exs['solde_defavorable'], 0), f(exs['solde_favorable'], 0), pct(exs['dette2038_favorable'], 0), pct(exs['dette2038_defavorable'], 0), pct(exs['dette2058_favorable'], 0), pct(exs['dette2058_defavorable'], 0), f(nous['ensemble2038']['ensemble2038']['haut'], 0), f(nous['ensemble2038']['ensemble2038']['bas'], 0), f(nous['ensemble2038']['ensemble2038']['central'], 0)))
    A('')
    A('## 4. Test de validité du moteur sur notre propre système')
    A('')
    v = R['validite']
    A('Le moteur refait la chaîne dette à partir de la trajectoire de solde primaire exportée par nos modèles (S3, `correction_0811.js`) : même dette de départ, même macro, même récursion que `modeles/systeme-ideal/`, écrite à part en Python.')
    A('')
    A('| Cas | Dette 2038 : moteur | modèle | Dette 2058 : moteur | modèle |')
    A('|---|---|---|---|---|')
    for k, lib in (('reference', 'Notre système, macro de référence'), ('prudente', 'Notre système, macro prudente'), ('actuel_reference', 'Droit actuel, macro de référence'), ('actuel_prudente', 'Droit actuel, macro prudente')):
        A('| %s | %s %% | %s %% | %s %% | %s %% |' % (lib, pct(v[k]['moteur_2038'], 2), pct(v[k]['modele_2038'], 2), pct(v[k]['moteur_2058'], 2), pct(v[k]['modele_2058'], 2)))
    A('')
    A('**Résultat : le moteur retrouve 130,4 % en 2038 et 124,6 % en 2058 (écart inférieur à 0,001 point).** Portée exacte de ce test : il valide la chaîne dette (solde primaire → intérêts → dette, macro, dette de départ) et le branchement sur l\'export de nos modèles ; il ne valide pas les leviers eux-mêmes, que le moteur lit dans le modèle pour notre système au lieu de les recalculer (le modèle de notre système est le même code que celui qui chiffre la fonction du patrimoine, les transmissions et les retraites utilisés pour LFI). Les bornes de chaque module viennent du même code (`js/pont_incertitudes.js`), pas d\'un recalcul indépendant.')
    A('')
    c = nous['central']
    A('**Même test, avec le tirage de notre système.** Tous les modules à leur valeur centrale (écarts nuls) redonnent exactement le modèle : solde de 2038 %s Md€, dette 2038 **%s %%**, dette 2058 **%s %%**. La médiane des 10 000 tirages donne %s Md€, **%s %%** et **%s %%** : écart de %s point en 2038 et de %s point en 2058 ; il est attendu, parce que les bornes de nos modules ne sont pas symétriques autour du central (la médiane d\'une somme de lois asymétriques n\'est pas la somme des médianes). Le test passe si la médiane reste à moins de 1 point de dette 2038 de la valeur centrale (`tests/test_banc.py`).' % (f(c['solde_2038'], 1), pct(c['dette2038'], 2), pct(c['dette2058'], 2), f(nous['solde_regime']['p50'], 1), pct(nous['dette2038']['p50'], 2), pct(nous['dette2058']['p50'], 2), f(100 * (nous['dette2038']['p50'] - c['dette2038']), 2), f(100 * (nous['dette2058']['p50'] - c['dette2058']), 2)))
    A('')
    A('## 5. Ce qui est branché sur nos modèles, et ce qui est encore grossier')
    A('')
    src = R['sources_ponts']
    A('Ponts utilisés pour cette exécution : modèles JavaScript = %s ; retraites = %s ; OpenFisca = %s ; démographie = %s ; Smic (OpenFisca) = %s ; pension minimale (CSV DREES) = %s (le cache versionné `donnees/cache/` est relu si le moteur n\'est pas disponible).' % (src['systeme'], src['retraites'], src['openfisca'], src['demographie'], src.get('smic'), src.get('pension_min')))
    A('')
    A('| Levier | Branché sur | Mesures de LFI |')
    A('|---|---|---|')
    prog, mesures, mod = meta['lfi']
    par_lev = {}
    for m in mesures:
        par_lev.setdefault(m['levier'], []).append(m['id'])
    for lev, ids in par_lev.items():
        A('| %s | %s | %s |' % (lev, BRANCHE.get(lev, ''), ', '.join(ids)))
    A('')
    A('Programme du Rassemblement national : retraites (D01) : `retraites_age` ; exonération d\'IR des moins de 30 ans (T08) : `ir_jeunes` (OpenFisca) ; impôt sur la fortune financière (F02) : `iff` (module patrimoine) ; toutes les autres lignes : montant du programme ou économie annoncée bornée par une contrainte juridique ou pratique (`cout_unitaire`, loi `med`). Aucun modèle du dépôt ne chiffre encore la TVA (taux réduits), la fraude ou l\'immigration : ces lignes sont des ordres de grandeur sourcés ou marqués comme tels.')
    grossier = [m['id'] for m in mesures if any(h[0].startswith('H-GROSSIER') for h in m.get('hypotheses', []))]
    A('')
    A('Lignes encore grossières (ordre de grandeur sans source primaire lue ; leur effet sur la conclusion est testé au § 7) : %s. Les plus lourdes en médiane : %s. Lignes non chiffrées, hors totaux : %s.' % (', '.join(grossier), ', '.join('%s (%s Md€)' % (k, f(-lfi['par_mesure'][k]['p50'], 1)) for k in sorted(grossier, key=lambda k: lfi['par_mesure'][k]['p50'])[:5]), '; '.join(mod.NON_CHIFFREES)))
    A('')
    A('Sourcées dans cette version (nombre de bénéficiaires, coûts unitaires, cote A à C) : D09 (DEPP), D17a (crèches), D19 (DREES, AAH), D20 (nombre d\'emplois : Insee, inscrits à France Travail ; coût net par emploi : encore grossier), D21 (masse salariale), D08 (Ségur). Encore sans source primaire : D06, D11, D15, D16, D17b, D18, D22, D23, D24, D25 (coût mensuel), R01b.')
    A('')
    dn = lfi.get('detail_nouvelles')
    if dn:
        A('## 5 bis. Quatre mesures ajoutées le 08/11/2026 (Smic, pension minimale, carburants, nationalisations)')
        A('')
        A('Ces mesures étaient hors des totaux ; elles y sont désormais (§ 1 et § 6). Tirages propres à cette décomposition (2 000, graine + 1) ; médiane [centiles 10 ; 90] ; Md€ par an en régime sauf mention ; effet sur le solde = recettes moins dépenses. Citations, liens, interprétation écrite et hypothèses cotées : `programmes/lfi/mesures.py` (S01, P01, C01, N01 à N06) ; code : `leviers2.py` (fonctions pures, testées).')
        A('')
        s1 = dn['S01']
        A('### Smic à 1 700 € net (S01)')
        A('')
        A('| Composante (régime) | Médiane [p10 ; p90] |')
        A('|---|---|')
        A('| Masse salariale brute en plus, secteur privé (Md€) | %s |' % iv(s1['masse_brute'], 1))
        A('| Coût net pour les employeurs privés, après allègements (Md€, **non compté** dans le solde) | %s |' % iv(s1['cout_prive'], 1))
        A('| Hausse des allègements généraux (Md€, formule en Smic ; base : %s Md€ en 2025 dans le modèle) | %s |' % (f(s1['allegement_base']['p50'], 0), iv(s1['d_allegements'], 1)))
        A('| Recettes publiques nettes avant l\'emploi (cotisations, CSG, impôt, moins prime d\'activité, moins allègements) (Md€) | %s |' % iv(s1['d_recettes_brut'], 1))
        A('| Emplois perdus (milliers d\'ETP) | %s |' % iv(s1['emplois_perdus_k'], 0))
        A('| Dépenses : agents publics ; secteurs financés ; contrats aidés (Md€) | %s ; %s ; %s |' % (iv(s1['agents'], 1), iv(s1['finance'], 1), iv(s1['pec'], 2)))
        A('| Coût de l\'emploi perdu : recettes, allocations (Md€) | %s ; %s |' % (iv(s1['perte_emploi_rec'], 2), iv(s1['perte_emploi_alloc'], 1)))
        A('| **Effet sur le solde** | **%s** |' % iv(s1['solde'], 1))
        A('| Variante : les allègements suivent le Smic (droit actuel) | %s (emplois perdus : %s milliers) |' % (iv(s1['solde_indexe'], 1), iv(s1['emplois_indexe_k'], 0)))
        A('| Variante : le barème des allègements est gelé en euros | %s (emplois perdus : %s milliers) |' % (iv(s1['solde_gele'], 1), iv(s1['emplois_gele_k'], 0)))
        A('')
        A('Lecture. (1) **Estimation, pas un fait** : l\'effet public dépend surtout d\'un choix que le programme ne fait pas, l\'indexation des allègements : tant que la formule reste exprimée en Smic, une hausse de 17,8 % du Smic augmente les allègements de tous les salariés jusqu\'à 1,6 Smic, y compris de ceux dont le salaire ne bouge pas (aubaine pour les employeurs, coût pour l\'État et la Sécurité sociale) ; si elle est gelée, les recettes montent mais le coût du travail au Smic monte de 17,8 % et l\'emploi perdu est plusieurs fois plus grand. Le programme supprime en outre les exonérations au-dessus de 2 Smic (ligne non chiffrée). (2) Recoupements de l\'emploi (sources de la ligne S01, H-SMIC-4) : OFCE 2024 environ 2 300 emplois par point de Smic (soit environ 41 000 pour +17,8 %) ; Institut Montaigne 230 000 à 380 000 pour +14,4 % ; IFRAP 240 000 pour 1 600 € net. Notre fourchette couvre la première et approche les deux autres seulement si les allègements sont gelés. (3) Limites : foyers types (pas de micro-données), aides au logement non modélisées (leur baisse améliorerait le solde public), TVA induite non comptée (pour ne pas doubler le multiplicateur du § 2 : de l\'ordre de 1 à 2 Md€ au plus), élasticité d\'emploi tirée de la littérature sur des hausses beaucoup plus petites (extrapolation hors échantillon, ⚠️), salaires de 1 à 1,3 Smic par diffusion (⚠️ non relu).')
        A('')
        s2 = dn['P01']
        A('### Pension minimale au niveau du Smic (P01)')
        A('')
        A('| Composante | Médiane [p10 ; p90] |')
        A('|---|---|')
        A('| Retraités à carrière complète sous le seuil (millions) | %s |' % iv(s2['beneficiaires_m'], 1))
        A('| Part des carrières complètes sous le seuil | %s %% |' % iv({k: 100 * v for k, v in s2['part_sous_seuil'].items()}, 0))
        A('| Coût du complément de pension (Md€) | %s |' % iv(s2['cout_pension'], 1))
        A('| Interaction avec le minimum vieillesse porté à 1 337 € (net, Md€) | %s |' % iv(s2['aspa_net'], 1))
        A('| **Coût total** | **%s** |' % iv(s2['total'], 1))
        A('')
        A('Lecture. Fait sourcé : distribution des pensions nettes des carrières complètes (DREES, EIR 2020, ramenée à 2025 par l\'homothétie du modèle des retraites). Estimation : le texte ne fixe ni montant ni date ; trois lectures du « niveau du Smic » encadrent le coût (voir la ligne P01 de `mesures.py`) ; la montée est en trois ans à partir de 2028. Limites : homothétie sans effet de noria (les nouveaux retraités ont de meilleures pensions : le coût est légèrement surestimé), part de carrières complètes issue de la DREES par génération, interaction avec l\'ASPA estimée sans source primaire (⚠️). Ne comprend pas le coût de la retraite à 60 ans (D05).')
        A('')
        s3 = dn['C01']
        A('### Blocage du prix des carburants à 1,70 € (C01)')
        A('')
        A('| Composante | Médiane [p10 ; p90] |')
        A('|---|---|')
        A('| Écart du prix de marché au plafond (€ par litre) | %s |' % iv(s3['ecart'], 2))
        A('| Volume plafonné (milliards de litres) | %s |' % iv(s3['volume'], 1))
        A('| Coût du blocage, total (Md€) | %s |' % iv(s3['total'], 1))
        A('| dont supporté par les marges des raffineurs et distributeurs (Md€, privé) | %s |' % iv(s3['prive'], 1))
        A('| **dont à la charge du budget (compensation)** | **%s** |' % iv(s3['public'], 1))
        A('')
        A('Lecture. Le coût est l\'écart entre le prix de marché et le plafond, fois le volume : il vaut zéro si le pétrole redescend au niveau d\'avant la guerre au Moyen-Orient (1,70 €) et monte à 25-30 Md€ si les prix d\'octobre 2026 (2,14 € pour l\'essence, 2,36 € pour le gazole) durent. Précédent : la remise de 2022 a coûté 7,5 à 8 Md€. Le prix de marché de 2028 à 2032 est un scénario sans source ; l\'hypothèse que l\'État comble ce que les marges n\'absorbent pas est la nôtre (sans cela, l\'offre disparaît) ; le programme parle d\'un plafond et d\'un encadrement des marges, pas de subvention.')
        A('')
        A('### Nationalisations (N01 à N06)')
        A('')
        A('| Opération | Prix payé (Md€) | Flux annuel en régime (Md€ ; + = dividendes) | Transfert en capital (Md€, déficit) |')
        A('|---|---|---|---|')
        noms = {'N01': 'SNCF', 'N02': 'Autoroutes', 'N03': 'Aéroports stratégiques', 'N04': 'Engie', 'N05': 'ArcelorMittal France', 'N06': 'EHPAD lucratifs'}
        for k in ('N01', 'N02', 'N03', 'N04', 'N05', 'N06'):
            d = dn[k]
            A('| %s | %s | %s | %s |' % (noms[k], iv(d['prix'], 1), iv(d['flux'], 2), iv(d['transfert'], 1)))
        A('| **Total (capital engagé)** | **%s** | | |' % iv(lfi['capital'], 0))
        A('')
        A('Lecture. Traitement en comptabilité nationale : l\'achat de titres ou d\'actifs est une **opération financière** : il augmente la dette brute (par l\'emprunt) mais pas le déficit ; le rendement (dividendes) améliore le solde, et l\'emprunt coûte 3,45 % au taux de marché de référence. Sont une dépense (déficit) : les pertes reprises (ArcelorMittal) et la part des EHPAD cédée gratuitement aux associations. Les entreprises acquises restent hors administrations publiques tant qu\'elles sont des producteurs marchands ; un reclassement ajouterait leur dette à la dette publique (⚠️ non modélisé). Droit : indemnité « juste et préalable » (article 17 de la Déclaration de 1789 ; premier protocole additionnel à la CEDH), donc prix de marché, pas moins ; SNCF déjà publique à 100 % ; le quatrième paquet ferroviaire limite la renationalisation du réseau concurrentiel (droit de l\'UE). Les valeurs (Engie, ADP) sont des capitalisations de 2026 lues par moteur de recherche, la participation actuelle de l\'État à confirmer (⚠️).')
        A('')
        A('Effet sur les totaux : les nationalisations ajoutent le capital engagé à la dette de 2028 à 2030 (en Md€ de 2025, indexé sur le PIB nominal) ; les mesures S01, P01 et C01 sont dans le solde de régime du § 1.')
        A('')
    A('## 5 ter. Rassemblement national : ce qui est annoncé et ce qui est réalisable (régime, Md€ par an ; + améliore le solde)')
    A('')
    progr, mesr, modr = meta['rn']
    themes = []
    for m in mesr:
        if m['theme'] not in themes:
            themes.append(m['theme'])
    A('| Thème | Annoncé par le RN (régime ; recettes et économies − baisses d\'impôts et dépenses) | Notre estimation : médiane [centiles 10 ; 90] | Contraintes juridiques et pratiques principales |')
    A('|---|---|---|---|')
    # somme des médianes par thème (somme de médianes, pas médiane de la somme)
    tot_ann = tot_med = 0.0
    for t in themes:
        ms = [m for m in mesr if m['theme'] == t]
        ann = sum((m['annonce'] if m['sens'] == 'recette' else -m['annonce']) for m in ms)
        med_ = sum(rn['par_mesure'][m['id']]['p50'] for m in ms)
        lo = sum(rn['par_mesure'][m['id']]['p10'] for m in ms)
        hi = sum(rn['par_mesure'][m['id']]['p90'] for m in ms)
        cons = '; '.join(sorted({m['contrainte'].split(' ; ')[0].split(' (')[0][:70] for m in ms if m.get('contrainte')}))[:230]
        tot_ann += ann
        tot_med += med_
        A('| %s | %s | %s [%s ; %s] | %s |' % (t, f(ann, 1), f(med_, 1), f(lo, 1), f(hi, 1), cons or 'coût certain une fois votée (baisse d\'impôt ou dépense)'))
    A('| **Somme** | **%s** | **%s** (somme de médianes ; médiane de la somme au § 1 : %s) | |' % (f(tot_ann, 0), f(tot_med, 0), f(rn['solde_regime']['p50'], 0)))
    A('')
    A('Lecture. (1) **Fait** : le Rassemblement national annonce 140 Md€ d\'économies nettes en 2032 par rapport à 2026 (Public Sénat, 06/10/2026) ; son annexe affiche une amélioration nette du solde de 71,6 Md€ en 2027 et 141,7 Md€ en 2031 (Institut de l\'Entreprise, d\'après les diapositives 11, 19 et 26 du dossier de presse, non lues par nous) ; la somme des annonces lignes par lignes reprises ici (2027 pour les baisses d\'impôts et dépenses, 2031 pour les économies quand elle est connue) est de %s Md€, du même ordre. (2) **Estimation** : notre médiane est la somme de ce que chaque ligne peut raisonnablement produire dans le droit actuel (Constitution, droit de l\'UE, CEDH, traités) et dans la pratique ; la borne haute de chaque ligne est l\'annonce du RN elle-même. Elle dépend de jugements écrits ligne par ligne (`programmes/rn/mesures.py`, champs `interpretation` et `contrainte`) et peut être contestée ; l\'ordre de grandeur est recoupé : l\'Institut de l\'Entreprise (cote C, financé par des entreprises) trouve 7,5 Md€ d\'amélioration nette en 2031 (de −25 à +50) en retenant à 50 %% les lignes « sans mode opératoire » et à 0 les lignes juridiquement fragiles. La médiane de la somme (§ 1) est supérieure à la somme des médianes parce que les lois des économies sont asymétriques (médiane = notre estimation, borne haute = annonce du RN) : la moyenne d\'une loi de ce type est au-dessus de sa médiane. (3) Ce que le banc ne contient pas : la suppression des 120 taxes et la baisse du nombre d\'agents (aucun montant) ; les règles du référendum sur l\'immigration et la règle d\'or (cadre) ; la réforme des retraites au-delà de son âge de départ (texte annoncé le 17/11/2026).' % f(tot_ann, 0))
    A('')
    A('Sources principales : dossier « Contre-budget 2027 » du groupe RN (octobre 2026, cote D, auteur = le programme) ; Institut de l\'Entreprise, 06/10/2026 (cote C) ; Public Sénat, 06/10/2026 ; Acteurs publics ; Localtis (Banque des Territoires), 15/10/2026 ; décisions du Conseil constitutionnel et de la CJUE (via billet d\'avocat, à relire en primaire). Liens, cotes et conflits d\'intérêts ligne par ligne : `programmes/rn/mesures.py`.')
    A('')
    A('## 6 bis. Détail par mesure du Rassemblement national (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90])')
    A('')
    A('| N° | Mesure | Annoncé (régime) | Effet | Levier | Contrainte |')
    A('|---|---|---|---|---|---|')
    for m in mesr:
        e = rn['par_mesure'][m['id']]
        sg = m['annonce'] if m['sens'] == 'recette' else -m['annonce']
        A('| %s | %s | %s | %s | %s | %s |' % (m['id'], m['libelle'], f(sg, 1), iv(e, 1), m['levier'], (m.get('contrainte') or '')[:120]))
    A('')
    A('## 6. Détail par mesure de LFI (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90])')
    A('')
    A('| N° | Mesure | Effet | Levier | Interprétation (extrait) |')
    A('|---|---|---|---|---|')
    for m in mesures:
        e = lfi['par_mesure'][m['id']]
        A('| %s | %s | %s | %s | %s |' % (m['id'], m['libelle'], iv(e, 1), m['levier'], m.get('interpretation', '').split('. ')[0][:170]))
    A('')
    A('Les citations courtes, les liens, l\'interprétation complète et les hypothèses cotées de chaque mesure sont dans `programmes/lfi/mesures.py`.')
    A('')
    A('## 6 ter. Notre système module par module (effet sur le solde en 2038, Md€ : médiane [centiles 10 ; 90])')
    A('')
    prog_n, mes_n, mod_n = meta['langagement']
    A('Méthode : pour chaque module, la fonction du modèle qui le calcule est rejouée au scénario favorable puis défavorable, tout le reste au central (`js/pont_incertitudes.js`, jsc) ; on garde l\'écart au central année par année, qui s\'ajoute au solde primaire exporté par `correction_0811.js` (au-dessus de `decisions_0811.js`) (la trajectoire est linéaire dans ces écarts : `lev(s, y)` s\'ajoute au net). Le niveau des leviers votés (F = 33,27 Md€, après correction du double compte du report d\'encaissement) reste fixe : c\'est ce que la loi voterait ; ce que chaque module rapporte réellement varie. Les modules sont tirés comme les lignes de LFI : facteurs communs « comportement » et « coût », aléa propre ; entre bornes et rang, lecture en centiles 10 et 90 (⚠️ convention, comme pour tous). **Part de la variance** : covariance du module avec le solde de 2038, divisée par la variance du solde (la somme des parts vaut 1) ; **R² dette 2058** : carré de la corrélation entre la valeur du module en 2038 et la dette 2058 (non additif : les modules sont reliés par les facteurs communs).')
    A('')
    A('| Module | Central | Médiane [p10 ; p90] | Facteur (λ) | Part de la variance du solde 2038 | R² dette 2058 | Cote |')
    A('|---|---|---|---|---|---|---|')
    cv, c58 = nous['contribution_variance'], nous['contribution_variance_dette2058']
    for m in sorted(mes_n, key=lambda x: -abs(cv[x['id']])):
        e = nous['par_mesure'][m['id']]
        A('| **%s** : %s | %s | %s | %s (%s) | %s %% | %s | %s |' % (m['id'], m['libelle'][:150], f(m['central'], 1), iv(e, 1), m['facteur'], f(m['lambda'], 1), f(100 * cv[m['id']], 0), f(c58[m['id']], 2), m['hypotheses'][0][3]))
    A('')
    A('**Ce que le tirage ne couvre pas (valeur centrale, non propagée)** : (a) le **socle hérité de l\'architecture v5** (`Stress.pbStruct`, croisière de la v5, création de valeur, report des paiements, `Decisions0511b.ajustement`, retraites et fiscalité d\'orientation au central pour les postes sans scénario) : le modèle n\'en publie pas de bornes cohérentes avec les couches qui l\'ont remplacé (la v7.4 retire la taxe de 1 %% du centre mais le scénario « bas » ou « haut » de la v5 la contient encore) ; (b) les **corrections du grand livre** (C01-C03, C10 : −19,0 Md€, faits Insee) ; (c) l\'**impôt de suite** TR03 (2,28 Md€, une seule valeur) ; (d) la clause automatique de la règle de dette (non déclenchée au central) ; (e) le remboursement étalé du report d\'encaissement (hypothèse HC1 de la couche CORRECTION0811 : stock remboursé de 1/12 par an, V32018). Autre convention : les bornes de l\'incertitude de la fonction du patrimoine v7.5 sont celles de la chaîne de comportement de la v7.4 (rapport recette nette / dû statique au scénario), appliquées à la seule part « fonction » (la part résidence principale est calée sans érosion) ; la ligne BT01 du modèle avait des bornes identiques, ce qui est lui-même une limite (V16902). Les scénarios d\'ensemble « bas » et « haut » du modèle (§ 3) valent +%s et %s Md€ sur le solde primaire de 2038 : plus large que le tirage ; non retenus parce qu\'ils additionnent des postes remplacés.' % (f(nous['ensemble2038']['ensemble2038']['bas'] - nous['ensemble2038']['ensemble2038']['central'], 0), f(nous['ensemble2038']['ensemble2038']['haut'] - nous['ensemble2038']['ensemble2038']['central'], 0)))
    A('')
    A('Les sources, les bornes, les lambda et les cotes de chaque module sont dans `programmes/langagement/mesures.py` et `donnees/cache/incertitudes.json` ; les lignes que le modèle laisse à valeur unique : %s.' % ('; '.join('%s (%s)' % (x['id'], x['libelle'][:70]) for x in nous['ensemble2038']['fixe']) or 'aucune'))
    A('')
    A('## 7. Corrélations et sensibilité')
    A('')
    A('Deux facteurs latents gaussiens relient les lignes : « comportement » (érosion de l\'assiette, exil, élasticité du revenu imposable ; il commande tous les modèles de patrimoine, de transmissions et d\'impôt sur le revenu, et les recettes de LFI recoupées par décote) et « coût » (dérive des coûts des dépenses). Chaque ligne a un poids λ entre 0,3 et 0,6 (⚠️ hypothèse, sans source : la corrélation entre deux lignes de même famille est de l\'ordre de λ² ≈ 0,1 à 0,4). Sensibilité : tous les poids multipliés par 0 (indépendance) puis par 1,3.')
    A('')
    A('| Hypothèse de corrélation | Solde de régime (Md€) | Dette 2038 (%) |')
    A('|---|---|---|')
    A('| Poids de référence | %s | %s |' % (iv(lfi['solde_regime'], 0), iv({k: 100 * v for k, v in lfi['dette2038'].items()}, 0)))
    for k, lib in (('rho_0.0', 'Lignes indépendantes (x 0)'), ('rho_1.3', 'Corrélations renforcées (x 1,3)')):
        s = lfi['sensibilite_rho'][k]
        A('| %s | %s | %s |' % (lib, iv(s['solde'], 0), iv({a: 100 * b for a, b in s['dette2038'].items()}, 0)))
    A('')
    top3 = sorted(lfi['par_mesure'], key=lambda k: lfi['par_mesure'][k]['p50'])[:3]
    A('Part des tirages où le solde de régime de LFI est négatif (pire que le fil de l\'eau) : %s %%. Les trois lignes qui pèsent le plus en médiane : %s. La conclusion de signe ne dépend donc pas des lignes les plus grossières mais des plus grosses.' % (pct(lfi['part_solde_negatif'], 1), ', '.join('%s (%s Md€)' % (k, f(lfi['par_mesure'][k]['p50'], 0)) for k in top3)))
    sg = sum(lfi['par_mesure'][m['id']]['p50'] for m in mesures if not any(h[0].startswith('H-GROSSIER') for h in m.get('hypotheses', [])))
    sgr = sum(lfi['par_mesure'][k]['p50'] for k in grossier)
    A('')
    A('Poids des lignes grossières : somme des médianes des lignes non grossières = %s Md€ ; somme des médianes des lignes grossières = %s Md€ (somme de médianes, qui n\'est pas la médiane de la somme). Même sans les lignes grossières, le solde reste très négatif.' % (f(sg, 0), f(sgr, 0)))
    A('')
    sr = rn['sensibilite_rho']
    A('Rassemblement national : solde de régime %s (poids de référence), %s (lignes indépendantes), %s (corrélations renforcées) ; dette 2038 %s, %s, %s %%. Part des tirages où le solde de régime est négatif (pire que le fil de l\'eau) : %s %%. Intervalle favorable : le centile 90 du solde (%s Md€) est proche de zéro : même si les économies annoncées se réalisaient en haut de notre fourchette, le programme resterait proche du fil de l\'eau ; même l\'empilement des extrêmes favorables, pour mémoire (toutes les lignes à leur meilleur résultat en même temps), donne %s Md€, moins que les 141,7 Md€ affichés par le RN pour 2031 : l\'affichage suppose des économies réalisées à leur montant plein et sans coût de la réforme des retraites au-delà de 9,5 Md€.' % (iv(rn['solde_regime'], 0), iv(sr['rho_0.0']['solde'], 0), iv(sr['rho_1.3']['solde'], 0), iv({a: 100 * b for a, b in rn['dette2038'].items()}, 0), iv({a: 100 * b for a, b in sr['rho_0.0']['dette2038'].items()}, 0), iv({a: 100 * b for a, b in sr['rho_1.3']['dette2038'].items()}, 0), pct(rn['part_solde_negatif'], 1), f(rn['solde_regime']['p90'], 0), f(rn['extremes']['solde_favorable'], 0)))
    top3r = sorted(rn['par_mesure'], key=lambda k: rn['par_mesure'][k]['p50'])[:3]
    A('')
    A('Lignes qui pèsent le plus en médiane (coûts) : %s. Test de robustesse sur les économies : si la médiane de chaque économie était l\'annonce du RN elle-même, le solde de régime serait, en somme des annonces, de l\'ordre de +144 Md€ (§ 5 ter) ; en retenant l\'hypothèse de l\'Institut de l\'Entreprise (lignes sans mode opératoire à 50 %%, lignes juridiquement fragiles à 0), il serait de +7,5 Md€ en 2031 (cote C). Notre médiane (%s Md€) est plus basse que cette dernière parce que nous retenons une part plus faible des lignes « sans mode opératoire » et un coût de la réforme des retraites 2,5 fois celui du RN.' % (', '.join('%s (%s Md€)' % (k, f(rn['par_mesure'][k]['p50'], 0)) for k in top3r), f(rn['solde_regime']['p50'], 0)))
    A('')
    A('')
    sn = nous['sensibilite_rho']
    st = nous['stats']
    A('**Notre système.** Sensibilité aux corrélations : solde 2038 %s (poids de référence), %s (modules indépendants), %s (corrélations renforcées) ; dette 2038 %s, %s, %s %% ; dette 2058 en poids de référence %s %%.' % (iv(nous['solde_regime'], 0), iv(sn['rho_0.0']['solde'], 0), iv(sn['rho_1.3']['solde'], 0), iv({a: 100 * b for a, b in nous['dette2038'].items()}, 0), iv({a: 100 * b for a, b in sn['rho_0.0']['dette2038'].items()}, 0), iv({a: 100 * b for a, b in sn['rho_1.3']['dette2038'].items()}, 0), iv({a: 100 * b for a, b in nous['dette2058'].items()}, 0)))
    A('')
    A('**Ce que le tirage révèle pour notre système (macro de référence, 10 000 tirages, leviers votés fixés ; ⚠️ intervalle sous-estimé, § 6 ter).** (1) **Le déficit baisse presque sûrement** : le solde primaire s\'améliore dans %s %% des tirages (le solde de régime est négatif dans %s %% d\'entre eux) ; mais **« réduire » ne veut pas dire « équilibrer »** : le déficit public de 2038 (intérêts compris) est sous 3 %% du PIB dans %s %% des tirages seulement (médiane %s %%). (2) **La dette est stabilisée à partir de 2038 dans %s %% des tirages seulement** (aucune année de 2039 à 2058 au-dessus du niveau de 2038) ; avec une tolérance de 1 point de PIB, %s %% ; en macro prudente, %s %%. Par construction, le modèle central est calé exactement sur la limite : toute dérive défavorable des modules fait remonter la dette, toute dérive favorable la fait baisser ; la règle « dette stable » n\'est donc tenue que par la **clause automatique** (leviers qui montent si la dette dépasse la trajectoire de 2 points), pas par le niveau voté (la clause n\'est pas simulée ici). (3) La dette de 2058 est inférieure à celle de 2038 dans %s %% des tirages et inférieure à son niveau de fin 2025 (%s %%) dans %s %% ; elle repasse sous 100 %% du PIB dans %s %% des tirages ; le pic de dette (médiane %s %%) tombe en %s (centiles 10 à 90 : %s à %s). (4) La dette 2038 reste sous 150 %% dans %s %% des tirages ; elle est sous son niveau de fin 2028 (%s %%) dans %s %% seulement : la bosse de 2029-2038 est quasi certaine. (5) **Lignes qui pèsent le plus dans notre incertitude** (part de la variance du solde 2038) : %s. Les cinq premières, toutes des comportements d\'assiette ou de retraites, portent à elles seules %s %% de la variance ; les petites lignes (TVA, outre-mer, plancher, capitaux mobiliers) n\'y pèsent presque rien : la conclusion dépend des gros modules (patrimoine, transmissions, fonction des revenus, retraites V6), pas des lignes récemment chiffrées.' % (
        pct(1 - st['part_solde_negatif'], 1), pct(st['part_solde_negatif'], 1), pct(st['part_deficit2038_sous_3'], 0), pct(nous['deficit2038_pct']['p50'], 1), pct(st['part_dette_stable_des_2038'], 0), pct(st['part_dette_stable_1pt'], 0), pct(st['part_dette_stable_prudente'], 0),
        pct(st['part_dette2058_sous_2038'], 0), pct(st['ratio_fin_2025'], 1), pct(st['part_dette2058_sous_fin2025'], 0), pct(st['part_dette2058_sous_100'], 0), pct(nous['stats']['pic_dette']['p50'], 0), f(nous['stats']['pic_annee']['p50'], 0), f(nous['stats']['pic_annee']['p10'], 0), f(nous['stats']['pic_annee']['p90'], 0),
        pct(st['part_dette2038_sous_150'], 0), pct(st['ratio_fin_2028'], 1), pct(st['part_dette2038_sous_fin2028'], 0),
        ', '.join('%s (%s %%)' % (k, f(100 * v, 0)) for k, v in sorted(nous['contribution_variance'].items(), key=lambda x: -abs(x[1]))[:6]),
        f(100 * sum(v for k, v in sorted(nous['contribution_variance'].items(), key=lambda x: -abs(x[1]))[:5]), 0)))
    A('')
    A('## 8. Dette de départ (vérifiée) et hypothèses communes')
    A('')
    A('- **Fait (cote A).** Dette au sens de Maastricht fin 2024 : **3 305,3 Md€**, 113,0 % du PIB à la publication (Insee, Informations rapides, dette trimestrielle 4T2024, 27/03/2025 : https://www.insee.fr/fr/statistiques/8540321, consulté le 08/11/2026) ; le ratio a été révisé à 112,6 % après révision du PIB (Insee, mai 2026, lu par résumé de moteur de recherche). Ferme V31000 (montant confirmé ; ratio révisé à relire dans le tableau Insee).')
    A('- **Fait (cote A).** Dette fin 2025 : **3 460,5 Md€** (3 460,1 selon Vie-publique, écart de 0,4 Md€ non tranché), 115,7 % du PIB (Insee, mai 2026) ; déficit 2025 : 152,5 Md€, 5,1 % du PIB. C\'est la dette de départ de tous les programmes (la même que celle de nos modèles, `modeles/risques/stress.js` R1). Vérification de cohérence : 3 305,3 + 152,5 = 3 457,8, soit 2,7 Md€ d\'écart avec 3 460,5 (flux de créances et autres ajustements).')
    A('- **Hypothèses communes (estimation).** Croissance nominale 3 %, taux de marché 3,45 % (OAT 10 ans début 2026), durée de renouvellement 8 ans, solde primaire du droit actuel de −103,4 Md€ de 2025 ; macro prudente : 2,5 % et 3,95 %. Même récursion que `modeles/systeme-ideal/variante_dette_stable.js`.')
    A('- **Calendrier.** Premier exercice après l\'élection de 2027 : 2028 ; ce choix remplace celui du premier chiffrage de LFI (2027), qui était incompatible avec un budget voté avant l\'élection ; l\'écart avec le premier chiffrage vient aussi des nouveaux branchements (§ 5).')
    A('')
    A('## 9. Limites assumées')
    A('')
    A('- **Impôt sur le revenu** : population stylisée de foyers types (pas de micro-données représentatives dans le dépôt), calage sur le total de l\'IR 2024 ; la part de l\'IR payée par les 10 %% les plus aisés dans cette population est de %s %% (de l\'ordre de 70 %% dans les statistiques de la DGFiP, ⚠️ à relire) : le haut de la distribution est sous-représenté, ce qui sous-estime la recette de tranches hautes. L\'incertitude de calage est portée par une loi (0,85 à 1,15).' % pct(R['openfisca_part_haut'], 0) if 'openfisca_part_haut' in R else '- **Impôt sur le revenu** : population stylisée de foyers types, voir `ir_openfisca.py`.')
    A('- **Patrimoine et transmissions** : les scénarios favorable / central / défavorable de nos modèles sont lus comme les centiles 10 / 50 / 90 : convention, sans source.')
    A('- **Notre système** : l\'intervalle propage les bornes de 30 modules (§ 6 ter) mais **pas** le socle hérité de l\'architecture v5, les corrections du grand livre ni l\'impôt de suite, fixés au central : il est donc **sous-estimé** (les scénarios d\'ensemble du modèle sont bien plus larges, § 3) ; les bornes sont celles du modèle, lues comme centiles 10 et 90 (convention), et les modules sont comonotones en interne ; les lambda (0,3 à 0,8) sont des conventions ; le test du § 4 valide la chaîne dette et le branchement, pas les leviers ; le report d\'encaissement n\'est plus compté deux fois depuis la correction du 08/11 (nuit) ; son remboursement étalé (1/12 par an) est une hypothèse de modélisation (V32012, V32018).')
    A('- **Programme de LFI** : certaines mesures n\'ont ni barème ni calendrier publiés ; l\'interprétation retenue est écrite ligne par ligne et peut être contestée.')
    A('- Aucune de ces lignes n\'est un jugement de valeur sur les objectifs du programme.')
    A('')
    return '\n'.join(L) + '\n'


def ecrire_variante(R):
    """Section 10 de resultats.md : variante « modèles moins sévères » (exil, évasion, planification des grandes fortunes), appliquée à tous les programmes."""
    ms = R.get('moins_severe')
    if not ms:
        return ''
    L = []
    A = L.append
    cles = (('lfi', 'LFI'), ('rn', 'Rassemblement national'), ('langagement', 'Notre système'), ('fil_de_l_eau', 'Fil de l\'eau'))
    A('')
    A('## 10. Variante « modèles moins sévères » (exil, évasion et planification des grandes fortunes), appliquée à tous les programmes')
    A('')
    A('Pourquoi : nos modèles d\'érosion et d\'exil des grands patrimoines sont peut-être trop pessimistes, pour nous comme pour les autres. Cette variante remplace, **pour tous les programmes, nous compris**, les hypothèses de comportement des grandes fortunes par un jeu plus bas tiré de la littérature (tableau ci-dessous ; dossier `sources/banc-variante-moins-severe.md`), avec les mêmes tirages (même graine) et la même méthode. Le modèle de notre système (`modeles/systeme-ideal/`) n\'est pas modifié : les valeurs sont remplacées en mémoire par `js/prelude_moins_severe.js` ; les leviers votés de notre système (F) restent fixés à leur niveau de la section 1, de sorte que la variante dit ce que les mêmes votes rapporteraient avec des comportements moins défavorables, pas une recalibration.')
    A('')
    A('| Hypothèse (favorable / central / défavorable) | Valeur du banc | Variante moins sévère | Ancrage |')
    A('|---|---|---|---|')
    A('| Érosion de l\'assiette à 1 point d\'impôt sur la fortune (`grandes_fortunes_0511`, HG08) | 20 / 35 / 55 % | 15 / 30 / 45 % | Jakobsen, Jakobsen, Kleven, Zucman 2020 (environ −30 % après 8 ans pour les très riches) ; Brülhart et al. 2022 (environ −30 % par point, 24 % seulement par déménagement) ; aucune étude lue au-delà de 30 à 45 % |')
    A('| Érosion du capital mobile du top 1 % (`taxe_patrimoine`, fonction du patrimoine v7.5) | 20 / 40 / 74 % | 15 / 30 / 45 % | idem ; le 74 % repose sur une note non vérifiée (V7306) |')
    A('| Érosion du reste du patrimoine mobile | 5 / 15 / 30 % | 4 / 10 / 20 % | Jakobsen et al. 2020 : environ −10 % pour les aisés |')
    A('| Érosion des autres actifs financiers | 3 / 8 / 15 % | 2 / 5 / 10 % | convention (même proportion) |')
    A('| Transmissions : déclaration et planification d (HT5) | 17 / 30 / 45 % | 12 / 20 / 32 % | CAE n° 69 (2021) : 20 à 25 points résiduels après réintégration de l\'assurance-vie ; échange automatique d\'informations (OCDE, −22 % de dépôts) |')
    A('| Transmissions : départs des patrimoines mobiles e (HT6) | 5 / 12 / 27 % | 2 / 5 / 12 % | Jakobsen, Kleven, Kolsrud, Landais, Muñoz (NBER 32153, AER 2026) : −2 % de riches par point d\'impôt, soit environ 5 % pour un impôt successoral de 50 % sur vingt ans ; DGFiP via France Stratégie 2023 : 0,2 à 0,7 % de la base ISF par an |')
    A('')
    A('Note de méthode sur l\'ISF : la recette de `varianteB` est nette de la taxe de 1 % de la v5.4, calculée avec d\'autres érosions ; baisser l\'érosion y fait paraître l\'ISF **moins** rentable (la base de 1 % remplacée devient plus grosse). C\'est un artefact de comptabilité du modèle, non un effet économique. Le banc corrige donc la recette de l\'ISF de la seule variation de la recette absolue des tranches du sommet (`js/pont_isf_abs.js`). Ce qui n\'est pas touché : l\'élasticité du revenu imposable des hauts revenus (Saez, Slemrod, Giertz), la fuite sur les pensions de notre système, les décotes conventionnelles de LFI (« 35 % du chiffre de LFI », sans lien avec l\'exil), le socle hérité de la v5.')
    A('')
    A('### 10.1 Résultats (statique, médiane [intervalle à 80 %])')
    A('')
    A('| | ' + ' | '.join('%s : valeur du banc | %s : moins sévère' % (n, n) for _, n in cles[:3]) + ' |')
    A('|' + '---|' * 7)

    def ligne(lib, cle, n=0, mult=1.0, rel=False):
        cs = []
        for c, _ in cles[:3]:
            cs.append(iv(R[c].get(cle), n, mult))
            cs.append(iv(ms[c].get(cle), n, mult))
        A('| %s | %s |' % (lib, ' | '.join(cs)))
    ligne('Réduction (+) ou aggravation (−) du déficit en régime (Md€ ; notre système : 2038)', 'solde_regime', 0)
    ligne('Prélèvements obligatoires, en régime (% du PIB)', 'po_pct', 1, 100.0)
    ligne('Dépense publique 2038 (% du PIB, intérêts compris)', 'dep_pct', 1, 100.0)
    ligne('Déficit public 2038 (% du PIB)', 'deficit2038_pct', 1, 100.0)
    ligne('Dette publique 2038 (% du PIB)', 'dette2038', 0, 100.0)
    ligne('Dette publique 2058 (% du PIB)', 'dette2058', 0, 100.0)
    ligne('Dette 2058, avec relance (% du PIB)', 'dette2058_rel', 0, 100.0)
    A('')
    # écarts par mesure patrimoniale
    A('### 10.2 Ce qui change, mesure par mesure (effet sur le solde en régime, Md€ : médiane)')
    A('')
    A('| Programme | Mesure | Valeur du banc | Moins sévère | Écart |')
    A('|---|---|---|---|---|')
    ids = {'lfi': ['R01a', 'R04', 'R05'], 'rn': ['F02'], 'langagement': ['M-PAT', 'M-TRANS']}
    for c, nom in cles[:3]:
        for i in ids[c]:
            a, b = R[c]['par_mesure'].get(i), ms[c]['par_mesure'].get(i)
            if a and b:
                A('| %s | %s | %s | %s | %s |' % (nom, i, f(a['p50']), f(b['p50']), f(b['p50'] - a['p50'])))
    A('')
    g = {c: ms[c]['solde_regime']['p50'] - R[c]['solde_regime']['p50'] for c, _ in cles[:3]}
    d = {c: 100 * (ms[c]['dette2058']['p50'] - R[c]['dette2058']['p50']) for c, _ in cles[:3]}
    A('Lecture : en médiane, la variante améliore le solde en régime de %s Md€ pour LFI, de %s pour le Rassemblement national et de %s pour notre système, et déplace la dette 2058 de %s, %s et %s points de PIB. Elle ne change ni le classement des programmes ni la lecture de leur trajectoire de dette ; les hypothèses d\'exil et d\'évasion ne sont donc pas ce qui sépare les programmes. Le chapitre 15 affiche le jeu « valeur du banc », plus prudent, et cite la variante à côté.' % (f(g['lfi'], 0), f(g['rn'], 0), f(g['langagement'], 0), f(d['lfi'], 0), f(d['rn'], 0), f(d['langagement'], 0)))
    A('')
    return '\n'.join(L)


def ecrire_ajouts(R, meta, ctx, cles_ajout):
    """Section 11 de resultats.md : programmes ajoutés le 09/11/2026 (Les Républicains, PS et Place publique). Mêmes modules, mêmes facteurs, mêmes 10 000 tirages, même chaîne dette ;
    les sections 1 à 10 (LFI, RN, notre système, fil de l'eau) ne sont pas modifiées par cet ajout (chaque programme a son propre générateur, même graine)."""
    cles_ajout = [c for c in cles_ajout if c in R]
    if not cles_ajout:
        return ''
    L = []
    A = L.append
    pib0 = ctx['eco']['pib0']
    DEF0 = ctx['eco']['deficit2024']
    noms = {'lfi': 'LFI', 'rn': 'RN', 'langagement': 'Notre système', 'fil_de_l_eau': 'Fil de l\'eau', 'lr': 'LR (Retailleau)', 'ps': 'PS et Place publique'}
    dossiers = {'lr': 'sources/chiffrage-programme-lr-2027.md', 'ps': 'sources/chiffrage-programme-ps-2027.md'}
    cols = list(cles_ajout) + ['rn', 'lfi', 'langagement', 'fil_de_l_eau']
    def c100(d, n=0):
        return iv({k: 100 * v for k, v in d.items()}, n) if d else 'n.d.'
    def restant(p):
        return {'p10': DEF0 - p['p90'], 'p50': DEF0 - p['p50'], 'p90': DEF0 - p['p10']}
    A('')
    A('## 11. Programmes ajoutés le 09/11/2026 : Les Républicains (plan Retailleau) et PS et Place publique (contre-budget 2027)')
    A('')
    A('Demande de l\'auteur du 09/11/2026 : chiffrer plus de programmes. Recensement et choix : %s ; dossiers : %s. **Même méthode, sans rien changer aux autres colonnes** : mêmes leviers, mêmes facteurs communs (comportement, coût, isf), mêmes 10 000 tirages, même graine, même chaîne dette ; chaque programme a son propre générateur, si bien que les sections 1 à 10 sont identiques à celles d\'avant l\'ajout (contrôle : `tests/test_banc.py`). Les deux documents sont relayés par la presse, le document original n\'a pas été trouvé (⚠️ V-LR-01, V-PS-01). Le contre-budget du PS est un budget annuel de 2027, pas le programme présidentiel de Raphaël Glucksmann, qui n\'a publié aucun chiffrage (H-PS-PERIMETRE). Mêmes conventions que pour le RN : pour chaque économie ou recette annoncée, la borne haute est l\'annonce et la médiane est notre estimation réalisable, la contrainte étant nommée ligne par ligne ; les baisses d\'impôts et dépenses nouvelles sont comptées à leur montant (0,95 à 1,15 fois). Ordres de grandeur sous hypothèses, jamais des prédictions.' % ('`sources/chiffrage-programme-lr-2027.md` § 0 et `sources/chiffrage-programme-ps-2027.md` § 0', ', '.join('`%s`' % dossiers[c] for c in cles_ajout if c in dossiers)))
    A('')
    A('### 11.1 Tableau comparatif (statique, médiane [intervalle à 80 %])')
    A('')
    A('| | ' + ' | '.join(noms[c] for c in cols) + ' |')
    A('|---' * (len(cols) + 1) + '|')
    def ligne(lib, fn):
        A('| ' + lib + ' | ' + ' | '.join(fn(c) for c in cols) + ' |')
    ligne('**Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€ ; 2038 pour notre système)**', lambda c: iv(R[c]['solde_regime'], 0))
    ligne('dont recettes nouvelles et économies (Md€)', lambda c: iv(R[c]['recettes_regime'], 0) if c != 'langagement' else 'non détaillé')
    ligne('dont baisses d\'impôts et dépenses nouvelles (Md€)', lambda c: iv(R[c]['depenses_regime'], 0) if c != 'langagement' else 'non détaillé')
    ligne('Annonce du programme : effet net sur le solde en régime (Md€)', lambda c: f(sum((m.get('annonce') or 0.0) * (1 if m['sens'] == 'recette' else -1) for m in meta[c][1]), 0) if c in ('lr', 'ps') else '—')
    ligne('**Déficit restant en régime, statique (% du PIB de 2025 ; 5,7 % au droit actuel)**', lambda c: iv({k: 100 * v / pib0 for k, v in restant(R[c]['solde_regime']).items()}, 1))
    ligne('Prélèvements obligatoires en régime (% du PIB ; 42,7 % en 2024)', lambda c: c100(R[c]['po_pct'], 1))
    ligne('Déficit public 2038 (% du PIB, intérêts compris)', lambda c: c100(R[c]['deficit2038_pct'], 1))
    ligne('**Dette publique 2032 (% du PIB)**', lambda c: c100(R[c].get('dette2032'), 0))
    ligne('**Dette publique 2038 (% du PIB)**', lambda c: c100(R[c]['dette2038'], 0))
    ligne('Dette publique 2058 (% du PIB)', lambda c: c100(R[c]['dette2058'], 0))
    ligne('Dette 2038, macro prudente', lambda c: pct(R[c]['dette2038_prudente'], 0))
    ligne('Avec relance (§ 2) : effet sur le solde (Md€)', lambda c: iv(R[c]['solde_rel'], 0) if c != 'fil_de_l_eau' else '—')
    ligne('Avec relance (§ 2) : dette 2038 (% du PIB)', lambda c: c100(R[c]['dette2038_rel'], 0) if c != 'fil_de_l_eau' else '—')
    ligne('Corrélations nulles (ρ = 0) : effet sur le solde (Md€)', lambda c: iv(R[c]['sensibilite_rho']['rho_0.0']['solde'], 0))
    ligne('Corrélations fortes (ρ = 1,3) : effet sur le solde (Md€)', lambda c: iv(R[c]['sensibilite_rho']['rho_1.3']['solde'], 0))
    ligne('Empilement des extrêmes, pour mémoire : solde (Md€)', lambda c: '%s à %s' % (f(R[c]['extremes']['solde_defavorable'], 0), f(R[c]['extremes']['solde_favorable'], 0)))
    A('')
    A('Lecture. (1) Les colonnes RN, LFI, notre système et fil de l\'eau reprennent les valeurs des sections 1 et 2 (mêmes tirages) ; la ligne « dette 2032 » est ajoutée pour tous. (2) « Annonce » (pour les deux programmes ajoutés ; pour le RN, voir le § 5 ter) = somme des montants annoncés ligne par ligne, lus en niveau annuel de régime (pour Les Républicains, lecture H-LR-LECTURE : les « 197 milliards cumulés jusqu\'en 2032 » sont lus comme le niveau des économies en 2032 ; lus comme une somme de cinq ans, l\'annonce nette serait de l\'ordre de 146 / 3 ≈ 49 Md€ par an). (3) Le droit actuel du banc ne contient pas la consolidation du budget 2027 du gouvernement : le contre-budget du PS est comparé au droit actuel, pas au projet de loi de finances.')
    A('')
    for c in cles_ajout:
        prog, mesures, mod = meta[c]
        P = R[c]
        A('### 11.%d %s : détail par mesure (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90] ; + améliore)' % (2 + cles_ajout.index(c), prog['nom']))
        A('')
        A('Source : %s. Calendrier : %s' % (prog['sources_chiffrage'], prog['calendrier']))
        A('')
        A('| Id | Mesure | Annonce | Effet sur le solde | Levier | Contrainte nommée |')
        A('|---|---|---|---|---|---|')
        for m in mesures:
            an = m.get('annonce')
            ann = 'n.d.' if not an else ('+' if m['sens'] == 'recette' else '−') + f(an, 1)
            A('| %s | %s | %s | %s | %s | %s |' % (m['id'], m['libelle'], ann, iv(P['par_mesure'][m['id']], 1), m['levier'], (m.get('contrainte') or '').replace('|', '/')))
        A('')
        themes = []
        for m in mesures:
            if m.get('theme') not in themes:
                themes.append(m.get('theme'))
        A('Par thème (annoncé ; médiane du banc, somme des médianes des lignes, pour lecture seulement : la médiane d\'une somme n\'est pas la somme des médianes) :')
        A('')
        A('| Thème | Annoncé (Md€) | Médiane du banc (Md€) |')
        A('|---|---|---|')
        for th in themes:
            ms_ = [m for m in mesures if m.get('theme') == th]
            a = sum((m.get('annonce') or 0.0) * (1 if m['sens'] == 'recette' else -1) for m in ms_)
            b = sum(P['par_mesure'][m['id']]['p50'] for m in ms_)
            A('| %s | %s | %s |' % (th, f(a, 1), f(b, 1)))
        A('')
        nc = getattr(mod, 'NON_CHIFFREES', [])
        if nc:
            A('Hors totaux (non chiffré ou sans montant) : ' + ' ; '.join(nc) + '.')
            A('')
        A('Part des tirages où le programme aggrave le déficit par rapport au droit actuel : %s %%.' % f(100 * P['part_solde_negatif'], 0))
        A('')
    return '\n'.join(L)
