# -*- coding: utf-8 -*-
"""
Notre système (« Langagement politique », système S3 du 08/11/2026) passé dans le banc avec LA MÊME MÉTHODE que LFI et le Rassemblement national : une liste de lignes (ici des « modules »), chacune avec
ses bornes favorable / défavorable, des facteurs communs de corrélation (comportement, coût) et un Monte-Carlo ; médiane et intervalle à 80 %.

Source des lignes : donnees/cache/incertitudes.json, écrit par js/pont_incertitudes.js (jsc) : pour chaque module, le modèle qui le calcule (modeles/systeme-ideal/) est rejoué au scénario favorable puis
défavorable, tout le reste au central ; on garde l'écart au central, année par année (2029-2058), en Md€ de 2025. Le niveau des leviers votés (F = 33,27 Md€ après correction du double compte du différé, calé au central pour une dette stable à partir de
2038) reste fixé : c'est la loi qu'on voterait ; ce que chaque module rapporte réellement est tiré.
Format d'un module : id, libelle, source, cote, facteur, lambda, sens (`po` : recettes, `dep` : dépenses), profil (const dès 2029, ramp sur 2029-2038, serie année par année), central (Md€ en 2038),
d_fav et d_def (écarts au central par année). Levier : `module_systeme`.

Conventions marquées ⚠️ :
 - ⚠️ « favorable » et « défavorable » sont lus comme les centiles 10 et 90 d'une loi (même lecture que pour tous les programmes) ; le modèle ne dit pas ce que sont ses bornes ;
 - ⚠️ à l'intérieur d'un module, les lignes bougent ensemble (comonotones) ; entre modules, seuls les facteurs communs relient (comportement : lambda 0,3 à 0,8 ; coût : 0,3 à 0,5) ;
 - ⚠️ les lambda sont des conventions de Claude (comportement des assiettes : 0,8 pour la fonction du patrimoine, la fonction des revenus, le crédit d'IS et la fiscalité d'orientation ; 0,7 transmissions ; 0,5 TVA,
   courbe des pensions, capitaux mobiliers ; coût : 0,5 pour les dépenses chiffrées au premier jet, 0,3 pour les petites lignes) ; la sensibilité aux corrélations (rho = 0 et 1,3) est publiée comme pour les autres.
Ce que le tirage NE couvre PAS (socle hérité, fixé au central) : voir `FIXE` et resultats.md § 6 ter.
"""
import json
import os

ICI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(ICI, '..', '..', 'donnees', 'cache', 'incertitudes.json')

PROGRAMME = {
    'nom': 'Notre système (Langagement politique)', 'cle': 'langagement', 'debut': 2029, 'regime': 2038, 'macro': 'reference', 'trajectoire_modele': True,
    'calendrier': "Année 1 du modèle = 2029 (2026 à 2028 au droit actuel) ; leviers montés linéairement jusqu'en 2038 (rampe du modèle, R.S.rampe) ; lignes de la couche à la bascule (2029).",
    'sources_chiffrage': "Nos modèles (modeles/systeme-ideal/, décisions de l'auteur du 08/11/2026) ; PO 51,6 % du PIB (modèle, après correction du double compte du report d'encaissement, 08/11/2026 nuit, couche CORRECTION0811).",
}

COI = "l'auteur du manifeste est partie prenante (candidat potentiel) ; modèle écrit par Claude et relu par l'auteur"


def _charger():
    with open(CACHE, encoding='utf-8') as f:
        return json.load(f)


_D = _charger()
ANNEES = _D['annees']
FIXE = _D['fixe']
COMPOSITION = _D['composition']
ENSEMBLE_2038 = _D['ensemble2038']


def _mesure(m):
    return dict(id=m['id'], chapitre='Système (modèle)', libelle=m['libelle'], citation='', lien=m['source'], sens=m['sens'], levier='module_systeme', profil=m['profil'], central=m['central'],
                d_fav=m['d_fav'], d_def=m['d_def'], facteur=m['facteur'], **{'lambda': m['lambda']},
                interpretation="Bornes du modèle : %s ; écart au central par année dans donnees/cache/incertitudes.json." % m['source'],
                hypotheses=[('H-' + m['id'], "Bornes favorable / défavorable du modèle lues comme centiles 10 et 90 (⚠️ convention) ; lambda %.1f sur le facteur « %s » (⚠️ convention)." % (m['lambda'], m['facteur']), m['source'], m['cote'], COI)])


MESURES = [_mesure(m) for m in _D['modules']]
