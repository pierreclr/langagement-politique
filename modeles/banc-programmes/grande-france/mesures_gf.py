# -*- coding: utf-8 -*-
"""
Grande France (grandefrance.com/programme, modèle généré le 11/11/2026) passé au banc d'essai v2, avec la MÊME règle que les autres programmes (../faisabilite.py).
Programme d'un contributeur extérieur, qui ne se présente pas à l'élection : publié dans le dépôt seulement, pas sur le site.
Données : le fichier `programme.json` publié par Grande France n'est pas recopié dans ce dépôt (licence non précisée) ; le télécharger (voir README.md) sous le nom `source-grande-france.json`.
Version utilisée pour les résultats publiés : sha256 df027fe17cf8845e8cfb927bb0b2f12364b85d1ff34395892900c611a66385d1.

Lecture des données (source-grande-france.json) :
 - chaque mesure a un effet par année (2025-2032, euros courants, croissance nominale de 2,7 % par an dans leur modèle) : l'effet de régime retenu ici est l'effet 2032 ramené en euros 2025
   (division par 1,027^7, convention du banc : un montant suit le PIB nominal) ; la montée en charge 2028-2032 est le profil de leur série, rapporté à 2032 ; après 2032, l'effet reste constant
   (les mesures à plein effet après 2032, comme la retraite à 68 ans ou l'assurance dépendance, ne continuent donc pas de monter : choix prudent pour leurs économies, à dire) ;
 - l'effet 2027 (≈ 1 Md€) est ignoré : le banc fait commencer tous les programmes en 2028 ;
 - les cinq effets de croissance (famille « croissance », 79 Md€ en 2032) valent ZÉRO, comme les retours dynamiques du RN (G04) : aucun programme n'en reçoit dans le banc v2 ; symétriquement, l'effet récessif des
   baisses de dépenses n'est compté pour personne ;
 - montant retenu par leur modèle : pour 64 mesures sur 68, la valeur centrale de leur fourchette (vérifié : écart < 4 %) ; mais pour les mesures qui sont des décisions, leur valeur centrale EST l'application
   jusqu'au bout (central = haut : postes, collectivités, chômage…) ; seule exception favorable nette : « départs accompagnés » au haut (coût 5,3 au lieu de 7,5 Md€).
Règle commune : une économie ou une recette (effet > 0) est classée (M, J, E) ci-dessous et décotée selon la grille ; un coût (effet < 0 : impôts rendus, dépenses nouvelles) garde son montant au centre, fourchette 0,9 à 1,3 fois.
"""
import json
import os

ICI = os.path.dirname(os.path.abspath(__file__))
DONNEES = os.path.join(ICI, 'source-grande-france.json')
URL_DONNEES = 'https://www.grandefrance.com/programme.json'
SITE = 'https://www.grandefrance.com/programme'
G = 1.027
ANNEES = [2028, 2029, 2030, 2031, 2032]

PROGRAMME = {'nom': 'Grande France', 'cle': 'gf', 'debut': 2028, 'regime': 2032, 'macro': 'reference',
             'calendrier': "Profil de leur modèle (2028-2032), effet de 2032 tenu constant ensuite.", 'sources_chiffrage': SITE + ' (programme.json, methode.md, 11/11/2026)'}

# (M, J, E, motif), par titre de mesure. Mêmes types que dans faisabilite.CLASSEMENT quand ils existent (cité entre crochets).
CLASSEMENT_GF = {
 "Deux millions de postes publics en moins d’ici 2032": (1, 0, 0, "coût par poste mesuré ; fin du statut et départs de titulaires : loi à changer ; aucun précédent de −37 % des effectifs concernés en cinq ans (le non-remplacement 2007-2012 [LR01] portait sur 150 000 postes)"),
 "Le point d’indice gelé jusqu’en 2032": (1, 1, 1, "gel du point : précédent 2010-2016 [M-M2]"),
 "Une seule chaîne publique, pour le patrimoine français": (1, 1, 0, "budgets connus ; la holding de l'audiovisuel public n'a jamais abouti"),
 "Les subventions aux associations réduites d’un tiers": (0, 1, 0, "coupe uniforme non détaillée (pas le problème d'égalité de LR10, qui était ciblée)"),
 "Des achats publics mutualisés": (0, 1, 0, "économies de fonctionnement [M-ECO, PS07]"),
 "Un tiers des agences de l’État supprimées": (0, 1, 0, "agences et opérateurs [RN A01, LR03]"),
 "Un Parlement resserré, deux fois moins d’élus locaux": (1, 0, 0, "réformes institutionnelles : loi organique ou révision ; jamais abouti"),
 "Le train de vie des ministères gelé": (0, 1, 0, "économies de fonctionnement [M-ECO]"),
 "La fraude sociale et médicale traquée": (0, 1, 0, "fraude [LR17, LFI R12]"),
 "Les syndicats financés par leurs adhérents": (1, 0, 0, "liberté syndicale et financement du paritarisme : à reconstruire ; sans précédent"),
 "Trois jours de carence dans la fonction publique": (1, 1, 0, "jour de carence [LR15]"),
 "Des collectivités qui dépensent moins": (0, 0, 0, "dépenses des collectivités : libre administration [RN K01, LR18]"),
 "Des provinces, des communes regroupées": (1, 0, 0, "régions et départements inscrits à l'article 72 : révision ; la fusion des régions de 2015 n'a pas produit les économies annoncées"),
 "L’investissement local ramené à l’essentiel": (0, 0, 0, "dépenses des collectivités : libre administration [RN K01]"),
 "Le fonctionnement des collectivités en baisse de 5 % par an": (0, 0, 0, "dépenses des collectivités : libre administration [RN K02]"),
 "Les pensions baissent, sauf les petites": (1, 0, 1, "barème précis, assiette DREES ; protection des biens (CEDH) et égalité : levable par la loi ; précédent grec (2010-2016), exécuté"),
 "La retraite à 68 ans en 2032, mêmes règles pour tous": (1, 1, 1, "âge minimal [LR12] ; rythme très rapide, mais précédent italien (2011, +6 ans pour une partie des assurés en sept ans)"),
 "La réversion pour ceux qui en ont besoin": (1, 1, 0, "mécanisme précis, sans précédent de mise sous condition de ressources"),
 "Les carrières longues pour ceux qui ont commencé avant 18 ans": (1, 1, 1, "paramètre des réformes de 2010 et 2023"),
 "La retraite par capitalisation": (0, 0, 0, "capitalisation : transition et droits acquis [LR13]"),
 "Fin des départs anticipés hors missions dangereuses": (1, 1, 1, "fermeture des régimes spéciaux en 2023"),
 "Le chômage assuré par des assureurs, pas par l'État": (1, 0, 0, "mécanisme décrit ; assurance obligatoire : risque de reclassement en dépense publique (SEC 2010) et préambule de 1946 ; aucun pays comparable n'a confié l'assurance chômage obligatoire à des assureurs privés"),
 "Accidents du travail : l'employeur s'assure": (1, 0, 1, "précédent belge (assureurs privés agréés) ; reclassement SEC possible"),
 "Aides au logement et prime d'activité gelées jusqu'en 2032": (1, 1, 1, "sous-indexation des APL : précédent 2018-2019"),
 "Moins de dispositifs pour l'emploi, plus de travail": (0, 1, 0, "non détaillé [LR14]"),
 "Un revenu social unique": (0, 1, 0, "revenu universel d'activité abandonné en 2020 : pas de précédent"),
 "Les aides sociales après cinq ans de résidence": (1, -1, 0, "prestations réservées : décision 2024-6 RIP [RN I01]"),
 "Une assurance dépendance pour chacun": (0, 1, 0, "non détaillé"),
 "Un guichet social unique": (0, 1, 0, "systèmes d'information [RN H05]"),
 "Une santé publique, des hôpitaux en concurrence": (0, 1, 0, "coûts hospitaliers [RN H01]"),
 "Les tarifs des soins gelés pendant le mandat": (1, 1, 1, "gels tarifaires déjà pratiqués dans l'ONDAM"),
 "Une aide médicale d’urgence à la place de l’AME": (1, 0, 1, "AME [RN I03]"),
 "Une participation aux urgences sans urgence": (1, 1, 1, "forfait patient urgences (2022)"),
 "Fin du compte formation et des aides à l’apprentissage": (1, 1, 1, "aides à l'apprentissage réduites en 2025, assiette connue"),
 "Des postes d’enseignants au rythme des élèves": (1, 1, 0, "démographie scolaire mesurée ; suppressions de postes annoncées rarement tenues"),
 "De vrais droits d’inscription à l’université": (1, 0, 0, "Conseil constitutionnel 2019 : droits « modiques » dans l'enseignement supérieur public"),
 "Fin des guichets à subventions": (0, 1, 0, "non détaillé"),
 "Fin des subventions aux éoliennes et au solaire": (1, 0, 0, "contrats de soutien en cours (obligations d'achat, compléments de rémunération)"),
 "Moins de guichets pour le logement et la culture": (0, 1, 0, "non détaillé"),
 "Libérer la construction": (0, 1, 0, "effet budgétaire non détaillé"),
 "Des trains ouverts à la concurrence": (1, 1, 0, "ouverture déjà prévue par le droit de l'UE ; économie pour l'État non démontrée"),
 "Pas un euro de plus pour Bruxelles": (1, 1, 0, "veto possible (unanimité du cadre financier) ; mais économie mesurée contre une hausse future, pas contre le droit actuel"),
 "Fin de l’aide publique au développement": (1, 0, 0, "aide au développement [RN A02]"),
 "Un rabais sur notre contribution européenne": (1, -1, 0, "ressources propres arrêtées à l'unanimité [RN U01]"),
 "La TVA unique à 25 %": (1, 1, 1, "taux de TVA : paramètre connu [M-TVA] ; la directive n'impose pas de taux maximal"),
 "Un seul taux de TVA": (1, 1, 1, "suppression des taux réduits : paramètre connu [M-TVA]"),
 "Plus aucune aide aux entreprises": (0, 1, 1, "niches et aides [LFI R02, PS04]"),
 "Une taxe foncière sur la valeur réelle des biens": (1, 1, 0, "assiette mesurable ; révision des valeurs locatives repoussée depuis 1970"),
 "Le capital, le chômage et les indépendants à l’impôt unique": (1, 1, 1, "barème sur une assiette connue [LFI R01b, R13]"),
 "Des droits de succession simples": (1, 1, 1, "successions [M-TRANS]"),
 "L’assurance-vie dans la succession": (1, 1, 1, "successions [M-TRANS]"),
 "La fraude à la TVA réduite d’un tiers": (0, 1, 0, "fraude [LR17]"),
 "La dette indexée sur les prix": (0, 1, 0, "effet nul en 2032 dans leur modèle"),
}


def _med(b, c, h):
    return {'forme': 'med', 'bas': b, 'central': c, 'haut': h}


def _tri(b, c, h):
    return {'forme': 'tri', 'bas': b, 'central': c, 'haut': h}


def charger(sans_filtre=False, avec_croissance=False):
    """Retourne (PROGRAMME, MESURES, CLASSEMENT {id: (M, J, E, motif)}, non_comptees). sans_filtre : valeurs du programme, sans fourchette (contrôle)."""
    if not os.path.exists(DONNEES):
        raise SystemExit('Fichier absent : télécharger %s vers %s (voir README.md).' % (URL_DONNEES, DONNEES))
    j = json.load(open(DONNEES, encoding='utf-8'))
    mesures, cl, non = [], {}, []
    for i, m in enumerate(j['mesures'], 1):
        e = m['effet_par_annee']
        serie = [e[str(a)] / G ** (a - 2025) for a in ANNEES]
        v = serie[-1]
        id_ = 'GF%02d' % i
        if m['famille'] == 'croissance' and not avec_croissance:
            non.append((id_, m['titre'], e['2032']))
            continue
        if abs(v) < 0.05:
            non.append((id_, m['titre'], e['2032']))
            continue
        montee = [max(0.0, s / v) for s in serie]
        base = dict(id=id_, theme=m['famille'], chapitre=m['famille'], libelle=m['titre'], citation=m.get('texte', '')[:300], lien=SITE, levier='cout_unitaire', montee=montee,
                    facteur='cout', interpretation="effet 2032 de leur modèle ramené en euros 2025", hypotheses=[])
        if sans_filtre:
            a = abs(v)
            base.update(sens='recette' if v > 0 else 'depense', valeur=_med(0.999 * a, a, a) if v > 0 else _tri(0.999 * a, a, 1.001 * a), annonce=a, **{'lambda': 0.0})
        elif v > 0:
            base.update(sens='recette', valeur=_med(v, v, v), annonce=v, **{'lambda': 0.5})
            if m['famille'] == 'croissance':
                cl[id_] = (1, 1, 1, "effet de croissance (variante seulement)")
            else:
                cl[id_] = CLASSEMENT_GF[m['titre']]
        else:
            a = -v
            base.update(sens='depense', valeur=_tri(a, a, a), annonce=a, **{'lambda': 0.3})
        mesures.append(base)
    return PROGRAMME, mesures, cl, non
