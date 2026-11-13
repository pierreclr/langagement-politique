#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Règle unique de faisabilité du banc d'essai, version 2 (décision de l'auteur du 11/11/2026) : la MÊME règle s'applique à toutes les économies et à toutes les recettes nouvelles de TOUS les programmes
(La France insoumise, Rassemblement national, Les Républicains, PS, Glucksmann, Horizons, notre système), et la MÊME fourchette à toutes les dépenses nouvelles chiffrées par leur auteur seul.
Des ordres de grandeur sous hypothèses, jamais des prédictions. Fonctions pures : aucune lecture de fichier, aucune écriture.

RÈGLE (écrite une fois)
Chaque économie ou recette nouvelle reçoit trois réponses (M, J, E) :
  M  mécanisme décrit et assiette mesurée : 1 si le dispositif est assez précis pour être chiffré et que l'assiette vient d'une source primaire (DGFiP, Insee, DREES, Cour des comptes) ; 0 sinon.
  J  obstacle juridique : 1 si aucun obstacle majeur (UE, Constitution, CEDH, libre administration des collectivités, indépendance d'une autre autorité) ; 0 si un obstacle existe mais peut être levé
     par la loi ou une révision ; -1 si l'obstacle est bloquant (unanimité des États membres, traité, violation manifeste d'une décision déjà rendue).
  E  précédent d'exécution : 1 si une mesure du même type a été exécutée en France ou chez un pays comparable ET a rapporté au moins la moitié de l'attendu ; 0 sinon (y compris « jamais essayé »).
Score s = M + J + E, borné entre 0 et 3. La part réalisable du montant (annonce du programme, ou valeur de nos modèles pour notre système) suit une loi à deux pans uniformes
(médiane au milieu, plafond = le montant) :
  s = 3 : bas 0,80, médiane 1,00, haut 1,00        s = 2 : bas 0,40, médiane 0,70, haut 1,00
  s = 1 : bas 0,10, médiane 0,35, haut 0,80        s = 0 : bas 0,00, médiane 0,10, haut 0,50
Le tirage de la part est relié aux autres par le facteur commun « cout » (poids 0,5, même convention que les économies du RN dans la version 1) et par un aléa propre à chaque ligne.
Les montants de la grille sont une convention de Claude (⚠️), pas une source : ils se situent entre la décote de LFI (33 à 100 %, médiane 67 %, soit le score 2) et les jugements de la version 1 sur les économies du RN,
de LR et du PS (médianes regroupées par score : table de contrôle de resultats-v2.md, plus sévères en haut de grille) ; la grille alignée sur ces médianes est publiée en sensibilité (GRILLE_V1). Les réponses (M, J, E) de chaque ligne sont des jugements à relire ligne par ligne :
elles sont toutes listées ci-dessous, avec leur motif.

DÉPENSES NOUVELLES (baisses d'impôt et dépenses chiffrées par le programme seul) : valeur centrale = montant du programme ; la fourchette est AU MOINS 0,9 à 1,3 fois ce montant (plancher commun : les
coûts publics dérivent plus souvent à la hausse qu'à la baisse) ; une ligne dont la source donne une fourchette plus large garde la sienne. Pour notre système, même plancher appliqué à chaque module de
coût (écart favorable au plus 10 % du coût, défavorable au moins 30 % du coût), sauf M-V6 (retraites), qui est un modèle de coût comme les leviers de retraite des autres programmes.
Ce qui n'est PAS filtré, faute de règle commune possible : les leviers qui sont eux-mêmes des modèles de coût (retraites, Smic, pension minimale, carburants, nationalisations) : leur incertitude vient de leurs paramètres.
"""

GRILLE = {3: (0.80, 1.00, 1.00), 2: (0.40, 0.70, 1.00), 1: (0.10, 0.35, 0.80), 0: (0.00, 0.10, 0.50)}
# sensibilité : médianes de la version 1 (RN + LR + PS) regroupées par score (3 : 60 %, 2 : 36 %, 1 : 25 %, 0 : 18 %), bas = la moitié, haut = le double (plafonné à 1)
GRILLE_V1 = {3: (0.30, 0.60, 1.00), 2: (0.18, 0.36, 0.72), 1: (0.125, 0.25, 0.50), 0: (0.09, 0.18, 0.36)}
LAMBDA_PART = 0.5            # poids du facteur « cout » dans le tirage de la part
FACTEUR_PART = 'cout'
COUT_BAS, COUT_HAUT = 0.9, 1.3
ECHELLE_M1 = (15.0 - 3.5) / 15.0   # écart n° 7 de memes-modeles.md : au coût d'un recrutement (comme LR01), M-M1 rapporte environ 3,5 Md€ de moins sur 15,0 (proportion simple)
SCORE_NON_EVALUE = 2         # ligne de notre système qu'on ne sait pas décomposer (socle hérité) : classe du milieu


def score(m_, j_, e_):
    return max(0, min(3, m_ + j_ + e_))


def loi_part(s):
    """Loi `med` (moteur.quantile) de la part réalisable pour le score s."""
    b, c, h = GRILLE[s]
    return {'forme': 'med', 'bas': b, 'central': c, 'haut': h}


# (M, J, E, motif) par ligne. Les mêmes types de mesure reçoivent les mêmes réponses dans tous les programmes.
CLASSEMENT = {
    'lfi': {
        'R01a': (1, 1, 1, "ISF rétabli : barème et assiette connus, a existé jusqu'en 2017"),
        'R01b': (1, 1, 1, "fin du prélèvement forfaitaire : retour au barème, a existé avant 2018"),
        'R02': (0, 1, 1, "niches : liste non donnée ; rabots de niches faits plusieurs fois, rendement partiel"),
        'R03': (1, 1, 1, "CVAE : impôt qui a existé et dont l'assiette est connue"),
        'R04': (1, 0, 0, "impôt plancher sur les très grandes fortunes : risque constitutionnel (égalité, confiscation), jamais appliqué"),
        'R05': (1, 0, 1, "successions : taux et abattement connus, mais plafond d'héritage (droit de propriété) sans précédent"),
        'R06': (0, 1, 1, "réforme de l'IS non détaillée"),
        'R07': (0, 0, 1, "taxe universelle sur les multinationales : conventions fiscales et UE, mécanisme non détaillé ; l'impôt minimum mondial existe"),
        'R08': (1, 1, 0, "taxe sur les services numériques : existe, mais aucun précédent d'un rendement multiplié"),
        'R09': (0, 1, 1, "superprofits : définition non donnée ; contribution européenne de 2022 de rendement inférieur"),
        'R10': (1, 1, 0, "taxe sur les transactions financières : existe, hausse de taux et réaction des volumes"),
        'R11': (1, 1, 0, "rachats d'actions et crypto-actifs : assiette connue, les rachats s'adaptent"),
        'R12': (1, 1, 0, "fraude : reconstruction d'effectifs de contrôle, rendement des contrôles stable depuis des années"),
        'R13': (1, 1, 1, "barème de l'impôt sur le revenu : paramètre, assiette mesurée, réaction modélisée"),
    },
    'rn': {
        'F01': (1, 1, 0, "rachats d'actions : même type que LFI R11"),
        'F02': (0, 1, 1, "impôt sur la fortune financière : barème non publié ; l'ISF a existé"),
        'F03': (0, 0, 0, "impôt assis sur le chiffre d'affaires : sans texte, conventions fiscales et UE, précédent censuré (2017)"),
        'F04': (0, 0, 0, "surtaxes diverses : contribution sur les dividendes censurée en 2017"),
        'F05': (0, 1, 0, "amendes de la concurrence : pas d'obstacle, rendement aléatoire"),
        'F06': (1, -1, 0, "TVA à la source : dérogation à la directive TVA, unanimité du Conseil"),
        'F07': (0, 0, 0, "autres recettes (services numériques, redevances) : droit de l'UE"),
        'F08': (1, 0, 0, "taxe à l'embauche d'étrangers : égalité, droit de l'UE"),
        'F09': (1, -1, 0, "taxe sur les transferts d'argent vers l'étranger : libre circulation des capitaux (art. 63 TFUE)"),
        'I01': (1, -1, 0, "prestations réservées aux étrangers : décision 2024-6 RIP du Conseil constitutionnel"),
        'I02': (1, -1, 0, "prestations familiales réservées : même décision"),
        'I03': (1, 0, 1, "aide médicale d'État : protection de la santé (préambule de 1946), précédents européens"),
        'I04': (1, 0, 0, "asile, visas, frais de scolarité : directives européennes, CEDH"),
        'U01': (1, -1, 0, "baisse unilatérale de la contribution à l'UE : ressources propres arrêtées à l'unanimité (art. 311 TFUE)"),
        'U02': (1, -1, 0, "restitution des droits de douane : même article"),
        'A01': (0, 1, 0, "agences et opérateurs : pas d'obstacle juridique, les suppressions annoncées se sont peu réalisées"),
        'A02': (1, 0, 0, "aide au développement et action extérieure : autonomie des assemblées pour une partie"),
        'A03': (1, 0, 0, "logement social et aides : libre administration pour la taxe foncière"),
        'A04': (1, 0, 0, "écrêtement des transferts aux collectivités : libre administration (art. 72)"),
        'K01': (0, 0, 0, "dépenses des collectivités : l'État ne décide pas de leurs effectifs"),
        'K02': (0, 0, 0, "dépenses des collectivités : même obstacle"),
        'H01': (0, 1, 0, "coûts hospitaliers : mesure non détaillée, ONDAM voté chaque année"),
        'H02': (0, 1, 0, "lutte contre les dépenses indues : rendement des contrôles non prouvé à l'ampleur annoncée"),
        'H03': (0, 0, 0, "affections de longue durée : préambule de 1946 (santé)"),
        'H04': (0, 0, 0, "réparation du système de retraite : droits acquis, mesure non détaillée"),
        'H05': (0, 1, 0, "systèmes d'information et gouvernance : pas d'obstacle, économies rarement réalisées"),
        'H06': (0, 0, 0, "autres économies de protection sociale : liberté contractuelle, mesures non détaillées"),
        'G01': (0, 0, 0, "prix national de l'électricité : contrats en cours, mécanisme non détaillé"),
        'G02': (0, 0, 0, "dividendes d'EDF : indépendance du régulateur, mécanisme non détaillé"),
        'G05': (0, 1, 0, "MaPrimeRénov' : réforme non détaillée"),
        'R30': (1, 1, 1, "mesures du PLF/PLFSS 2027 déjà chiffrées par le gouvernement"),
    },
    'lr': {
        'LR01': (1, 1, 0, "non-remplacement de départs : comme M-M1 ; 2007-2012 partiellement réalisé"),
        'LR02': (0, 1, 0, "contrats non renouvelés : non détaillé"),
        'LR03': (0, 1, 0, "agences et opérateurs : même type que RN A01"),
        'LR04': (0, 1, 0, "budgets base zéro : non détaillé"),
        'LR05': (0, 0, 0, "doublons État et collectivités : libre administration"),
        'LR06': (0, 1, 0, "absentéisme : non détaillé"),
        'LR07': (0, 1, 0, "délégation au privé de fonctions support : non détaillé"),
        'LR08': (0, 1, 0, "formation professionnelle aux régions : non détaillé"),
        'LR09': (0, 1, 0, "postes agrégés (énergie, aides) : non détaillé"),
        'LR10': (0, 0, 0, "subventions aux associations ciblées : égalité, liberté d'association"),
        'LR11': (0, 1, 0, "économies de l'État non détaillées"),
        'LR12': (1, 1, 1, "âge minimal et décote : réformes de 2010 et 2023 chiffrées"),
        'LR13': (0, 0, 0, "autres leviers retraite (capitalisation) : transition et droits acquis"),
        'LR14': (0, 1, 0, "assurance chômage et prestations : non détaillé"),
        'LR15': (1, 1, 0, "jour de carence : précédent 2012-2014 aux effets contestés"),
        'LR16': (1, 0, 0, "immigration : une partie conditionnée à une révision constitutionnelle"),
        'LR17': (0, 1, 0, "fraude : rendement des contrôles non prouvé à l'ampleur annoncée (même réponse que LFI R12)"),
        'LR18': (0, 0, 0, "effort des collectivités : libre administration"),
    },
    'ps': {
        'PS01': (1, 0, 0, "impôt plancher de 2 % : même type que LFI R04"),
        'PS02': (1, 0, 0, "CSG sur les gros héritages : base constitutionnelle incertaine, sans précédent"),
        'PS03': (1, 1, 0, "taxe sur les services numériques : même type que LFI R08"),
        'PS04': (0, 1, 1, "exonérations de cotisations : même type que LFI R02"),
        'PS05': (0, 1, 1, "niches fiscales : même type que LFI R02"),
        'PS06': (0, 1, 0, "marges dans la santé : non détaillé"),
        'PS07': (0, 1, 0, "fonctionnement de l'État : même type que LR03"),
        'PS08a': (0, 1, 0, "fraude fiscale : même type que LR17"),
        'PS08b': (0, 1, 0, "travail dissimulé : même type que LR17"),
        'PS08c': (0, 1, 0, "économies non détaillées : même type que LR11"),
    },
    # Glucksmann (livret climat du 09/11/2026, chiffrage partiel : deux montants) : la seule recette est la contribution exceptionnelle sur les plus hauts patrimoines
    'gl': {
        'GL02': (0, 0, 0, "contribution exceptionnelle de 50 Md€ sur les plus hauts patrimoines, une seule année : ni seuil, ni taux, ni assiette dans le livret (M 0) ; égalité devant les charges publiques et caractère confiscatoire, levable par la conception (J 0) ; aucun précédent récent en France (E 0)"),
    },
    # Horizons (Édouard Philippe, programme du 12/11/2026, non chiffré par le candidat) : lecture de notre simulateur (13/11/2026) ; mêmes types, mêmes réponses que les lignes voisines des autres programmes
    'philippe': {
        'PH01': (1, 1, 1, "âge légal à 65 ans et 45 annuités : même type que LR12 (réformes de 2010 et 2023 exécutées et chiffrées) ; montant = notre lecture (H-PH1)"),
        'PH02': (1, 1, 0, "non-remplacement d'un départ sur trois : même type que LR01 et M-M1 (2007-2012 partiellement réalisé)"),
        'PH03': (1, 1, 0, "chômage limité à 12 mois pour les moins de 50 ans : paramètre précis, aucun obstacle majeur (l'État a fixé les règles par décret en 2019 et 2023) ; réforme de 2023 exécutée mais rendement constaté non relu : E 0 par prudence"),
        'PH04': (1, 1, 0, "trois jours de carence : même type que LR15 (précédent 2012-2014 aux effets contestés)"),
        'PH05': (0, 1, 1, "aides aux entreprises « improductives », sans liste : même type que les niches de LFI (R02) et les exonérations du PS (PS04)"),
    },
    # notre système : un module = une ligne ; F (leviers votés), TR03 et M-M2 sont des lignes du modèle à valeur unique ; SOCLE = ce que les modules n'expliquent pas
    'langagement': {
        'M-PAT': (1, 1, 1, "fonction du patrimoine à 1,25 % de taux marginal maximal (décision du 11/11/2026), plafonnée à 75 % du revenu : M 1 (assiette et mécanisme précis, mais impôt annuel nouveau, ≈ 21 Md€ de recette nette) ; J 1 (taux inférieur au 1,5 % validé par le Conseil constitutionnel en 2012 avec plafonnement, sources/impot-patrimoine-constitutionnel.md ; ⚠️ pas de décision sur ce régime exact) ; E 1 (précédent suisse, ≈ 1,2 % du PIB de recettes ; ⚠️ fragile : avec l'ISF français seul comme précédent, ≈ 5 Md€, E serait 0). Avant le 11/11 : 3 % sans plafonnement, classé (1, 0, 0)"),
        'M-TRANS': (1, 1, 1, "successions : abattement et taux, même type que LFI R05 sans le plafond d'héritage"),
        'M-PENS': (1, 1, 1, "courbe des pensions : prélèvement sur les pensions, type CSG"),
        'M-REV': (1, 1, 1, "fonction des revenus : même type que LFI R13"),
        'M-CRED': (1, 1, 0, "crédit d'IS : mécanisme nouveau"),
        'M-FO': (1, 1, 0, "fiscalité d'orientation : la taxe carbone de 2014-2018 a été retirée sous la pression de la rue"),
        'M-TVA': (1, 1, 1, "TVA : taux et assiette connus, réaction modélisée"),
        'M-CONV': (1, 1, 0, "conversion de niches sociales en salaire : mécanisme précis mais sans précédent"),
        'M-M1': (1, 1, 0, "non-remplacement de départs : même type que LR01"),
        'M-M3': (0, 1, 0, "temps de travail dans la fonction publique : même type que LR06"),
        'M-DET': (0, 1, 0, "économie en détention : non détaillé"),
        'M-ECO': (0, 1, 0, "économies de fonctionnement : même type que LR03 et PS07"),
        'M-URSSAF': (0, 1, 0, "gestion de l'Urssaf : même type"),
        'M-FIOUL': (1, 1, 1, "taxe sur le fioul : taux et assiette connus"),
        'M-RESID': (1, 1, 0, "résidu du bonus d'activité : mécanisme précis, sans précédent"),
        'M-OM': (0, 1, 0, "sur-rémunérations outre-mer : non détaillé"),
        'M-PL': (1, 1, 0, "plancher en deux parts : mécanisme précis, sans précédent"),
        'F': (1, 1, 1, "leviers votés calés (hausses de taux de nos fonctions) : paramètre de barème comme LFI R13"),
        'TR03': (1, 1, 0, "impôt de suite sur la fonction du patrimoine : mécanisme précis, sans précédent"),
        'M-M2': (1, 1, 1, "gel relatif du point d'indice : précédent 2010-2016"),
        'M-GM': (0, 1, 0, "grand ménage (non-remplacement, gestion, regroupements d'organismes) : économie nette modélisée mais non détaillée ligne à ligne dans le banc ; même type que M-ECO et M-M3"),
        'SOCLE': (None, None, None, "socle hérité non décomposé : classe du milieu par défaut (score 2)"),
    },
}

# sensibilité « LFI, contre-budget 2027 » (11/11/2026) : les recettes du document sont les mêmes lignes que la colonne principale de LFI (hors R13) : mêmes réponses (M, J, E)
CLASSEMENT['lfi_cb'] = {k: v for k, v in CLASSEMENT['lfi'].items() if k != 'R13'}

# lignes de recette du banc qu'on ne filtre pas, avec la raison (valeur nulle)
EXEMPTEES = {
    'rn': {'G03': "écritures sans effet sur le déficit (valeur nulle dans le banc)", 'G04': "retours dynamiques comptés par le programme : valeur nulle dans le banc"},
}


def _med(b, c, h):
    return {'forme': 'med', 'bas': b, 'central': c, 'haut': h}


def appliquer_programme(cle, mesures):
    """Copie des mesures d'un programme (hors notre système) avec la règle unique : retourne (mesures, journal). Le journal donne, par ligne filtrée, (id, score, nominal, ancienne loi, nouvelle loi) ;
    pour les coûts élargis : (id, 'cout', ancienne loi, nouvelle loi). Lève une erreur si une recette n'est ni classée ni exemptée."""
    out, jr = [], []
    cl = CLASSEMENT.get(cle, {})
    ex = EXEMPTEES.get(cle, {})
    for m in mesures:
        m = dict(m)
        if m['sens'] == 'recette' and m['levier'] == 'nationalisation':
            out.append(m)
            continue
        if m['sens'] == 'recette':
            if m['id'] in ex:
                out.append(m)
                continue
            if m['id'] not in cl:
                raise ValueError('recette ou économie non classée : %s %s' % (cle, m['id']))
            mm, jj, ee, _ = cl[m['id']]
            s = score(mm, jj, ee)
            loi = loi_part(s)
            if m['levier'] == 'cout_unitaire':
                v = m['valeur']
                a = max(v.get('haut') or 0.0, m.get('annonce') or 0.0, m.get('lecture') or 0.0)      # `lecture` : montant lu par nous quand le programme n'en publie pas (Philippe)
                bas = loi['bas'] * a
                if (v.get('bas') or 0.0) < 0:
                    bas = min(bas, v['bas'])                 # coût de transition négatif conservé (LR13)
                m['valeur'] = _med(bas, loi['central'] * a, loi['haut'] * a)
                m['lambda'] = LAMBDA_PART
                jr.append((m['id'], s, a, (v.get('forme'), v.get('bas'), v.get('central'), v.get('haut')), (bas, loi['central'] * a, loi['haut'] * a)))
            else:
                m['part_realisable'] = loi
                jr.append((m['id'], s, None, None, loi))
            m['facteur'] = FACTEUR_PART
            m['score_faisabilite'] = s
        elif m['sens'] == 'depense' and m['levier'] == 'cout_unitaire' and m['valeur'].get('forme') == 'tri':
            v = m['valeur']
            ref = m.get('annonce') if m.get('annonce') is not None else (m['lecture'] if m.get('lecture') is not None else m.get('an1'))
            if ref is not None and ref > 0 and abs(v['central'] - ref) < 1e-9:
                nb, nh = min(v['bas'], COUT_BAS * ref), max(v['haut'], COUT_HAUT * ref)
                m['valeur'] = {'forme': 'tri', 'bas': nb, 'central': v['central'], 'haut': nh}
                jr.append((m['id'], 'cout', (v['bas'], v['central'], v['haut']), (nb, v['central'], nh)))
        out.append(m)
    return out, jr


def _central_serie(m, cs, ramp, n):
    if m['profil'] == 'const':
        return [m['central']] * n
    if m['profil'] == 'ramp':
        return [m['central'] * ramp[i] for i in range(n)]
    return list(cs[m['id']])


def modules_v2(mesures, c_serie, fixe_serie, ramp, eff_central, F, annees, score_non_evalue=SCORE_NON_EVALUE, sans_socle=False, scores_forces=None, bornes_cout=True, echelles=None):
    """Notre système sous la règle unique. mesures : modules de programmes/langagement ; c_serie : {id: série centrale} des modules à profil « serie » ; fixe_serie : {'M-M2': série} ;
    ramp : rampe 2029-2058 ; eff_central : effet central du modèle par année (liste alignée sur `annees`) ; F : niveau des leviers votés.
    Retourne (liste de modules v2, journal). Un module v2 a : c (série centrale), kind ('filtre' | 'cout' | 'neutre'), part (loi), d_fav / d_def (élargis pour les coûts), sens, et le champ
    'parametres' {'part': loi} pour que le tirage lui donne un aléa propre.
    scores_forces : {id: score} pour les tests de sensibilité (ex. M-PAT classé 2) ; echelles : {id: facteur} (par défaut M-M1 au coût d'un recrutement)."""
    n = len(annees)
    cl = CLASSEMENT['langagement']
    ech = {'M-M1': ECHELLE_M1} if echelles is None else echelles
    mods, jr = [], []
    somme = [0.0] * n
    for m in mesures:
        m = dict(m)
        k_ = ech.get(m['id'], 1.0)
        c0 = _central_serie(m, c_serie, ramp, n)
        c = [k_ * x for x in c0]
        m['c'] = c
        m['ajust'] = [(k_ - 1.0) * x for x in c0]      # écart du central par rapport à la trajectoire du modèle (qui contient c0) : s'ajoute au delta
        if k_ != 1.0:
            m['d_fav'] = [k_ * x for x in m['d_fav']]; m['d_def'] = [k_ * x for x in m['d_def']]; m['central'] = k_ * m['central']
        for i in range(n):
            somme[i] += c0[i]
        mods.append(m)
    libs = {'F': "Leviers votés (hausses de taux calées pour une dette stable)", 'TR03': "Impôt de suite sur la fonction du patrimoine (2,28 Md€)", 'M-M2': "Point d'indice : prix − 0,5 point pendant 4 ans"}
    extras = [('F', [F * ramp[i] for i in range(n)], 'po'), ('TR03', [2.28 * ramp[i] for i in range(n)], 'po'), ('M-M2', list(fixe_serie['M-M2']), 'dep')]
    for ident, c, sens in extras:
        for i in range(n):
            somme[i] += c[i]
        mods.append(dict(id=ident, libelle=libs[ident], sens=sens, profil='fixe', central=c[9], c=c, d_fav=[0.0] * n, d_def=[0.0] * n, facteur='cout', **{'lambda': 0.0}))
    reste = [eff_central[i] - somme[i] for i in range(n)]
    mods.append(dict(id='SOCLE', libelle="Socle hérité non décomposé (le modèle n'en publie ni les lignes ni les bornes)", sens='socle', profil='fixe', central=reste[9], c=reste,
                     d_fav=[0.0] * n, d_def=[0.0] * n, facteur='cout', **{'lambda': 0.0}))
    out = []
    for m in mods:
        m = dict(m)
        c9 = m['c'][9]
        if m['id'] == 'SOCLE':
            if sans_socle:
                m['kind'] = 'neutre'
                out.append(m)
                continue
            s = score_non_evalue
        elif m['id'] in cl:
            mm, jj, ee, _ = cl[m['id']]
            s = score(mm, jj, ee)
        else:
            s = None
        if scores_forces and m['id'] in scores_forces:
            s = scores_forces[m['id']]
        if c9 > 1e-9 and s is not None:
            m['kind'] = 'filtre'
            m['score_faisabilite'] = s
            m['part'] = loi_part(s)
            m['parametres'] = {'part': dict(m['part'], facteur=FACTEUR_PART, **{'lambda': LAMBDA_PART})}
            jr.append((m['id'], s, c9))
        elif c9 < -1e-9 and bornes_cout and m['id'] != 'M-V6':
            m['kind'] = 'cout'
            fav, dfn = [], []
            for i in range(n):
                ci = m['c'][i]
                if ci < 0:
                    fav.append(max(m['d_fav'][i], (1 - COUT_BAS) * abs(ci)))
                    dfn.append(min(m['d_def'][i], -(COUT_HAUT - 1) * abs(ci)))
                else:
                    fav.append(m['d_fav'][i]); dfn.append(m['d_def'][i])
            m['d_fav'], m['d_def'] = fav, dfn
            jr.append((m['id'], 'cout', c9))
        else:
            m['kind'] = 'neutre'
        out.append(m)
    return out, jr
