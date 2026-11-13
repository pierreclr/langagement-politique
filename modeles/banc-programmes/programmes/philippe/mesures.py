# -*- coding: utf-8 -*-
"""
Horizons (candidat : Édouard Philippe) pour 2027, décrit comme fichier de mesures du banc d'essai. LECTURE DE NOTRE SIMULATEUR, PAS UN CHIFFRAGE DU CANDIDAT.

Le programme d'Édouard Philippe n'est pas chiffré par son auteur (12/11/2026). Ce chiffrage est une lecture de notre simulateur : les montants manquants sont fixés par nous,
hypothèse par hypothèse, et seront remplacés dès qu'un chiffrage officiel ou indépendant paraîtra. (Décision de l'auteur du manifeste du 13/11/2026 : « option 1 », même
traitement que la ligne D02 du RN, annonce nulle et estimation propre.)

Document lu : le programme publié sur le site de campagne, 15 pages thématiques, « dernière mise à jour le 12 novembre 2026 » (https://www.edouardphilippe.fr/programme et
sous-pages), consulté le 13/11/2026 par résumé automatique de page (cote D : communication du candidat). Aucun PDF, aucun coût par mesure, aucun total, aucune trajectoire annuelle.
Seuls montants publiés : 50 Md€ d'impôts de production en moins contre 50 Md€ d'aides aux entreprises en moins ; déficit « de plus de 5 % à 2 % » du PIB en fin de mandat ;
« plus de 250 000 postes » de fonctionnaires non remplacés ; 350 € par mois d'allocation ; 3 000 € de réduction d'impôt ; +20 % du salaire des professeurs ; 500 € versés sur un plan
d'épargne retraite au premier emploi ; fonds d'adaptation de 2 Md€ par an. Dossier : sources/chiffrage-programme-philippe-2027.md.

Règles du banc appliquées sans exception (faisabilite.py, relancer_v2.py) :
- économies et recettes : règle M/J/E et grille commune, appliquées au montant annoncé quand il existe (aides aux entreprises), sinon à NOTRE lecture du montant (champ `lecture`) ;
- baisses d'impôts et dépenses nouvelles : comptées en entier, fourchette commune (au moins 0,9 à 1,3 fois le montant ; plus large si notre hypothèse l'est) ;
- aucun effet de croissance : le « quart » de l'effort que le programme attend « de la croissance et de l'emploi » n'est pas crédité (même règle que pour tous) ;
- mesures sans contenu chiffrable : hors du calcul, listées dans NON_CHIFFREES.

Chaque paramètre fixé par nous est une hypothèse numérotée H-PH1 à H-PH12 (dictionnaire HYP : bas, central, haut, motif, source, cote, conflit d'intérêts) ; valeurs centrales prudentes
et bornes symétriques. `construire(variante)` rend les mesures avec toutes les hypothèses au central (« central »), à leur borne basse (« bas »), à leur borne haute (« haut »),
ou à la borne la moins favorable au solde (« defavorable » : économies basses, coûts hauts) et la plus favorable (« favorable »). Dans les variantes, chaque hypothèse est fixée à
sa borne et seule la fourchette commune du banc reste tirée.

Champs : ceux des autres programmes (moteur.py, README) ; `annonce` = montant publié par le candidat (None s'il n'y en a pas) ; `lecture` = notre lecture du montant plein (Md€ par an
en régime), sur laquelle s'applique la règle commune (part réalisable pour une économie, fourchette commune pour un coût) ; `hyp` = identifiant de l'hypothèse H-PH.
Unités : Md€ par an, euros de 2025 ; effet sur le solde : + améliore. Des ordres de grandeur sous hypothèses, jamais des prédictions.
Cotes (la charte de travail (CONTRIBUTING.md), règle 11) : A statistique publique, texte officiel, revue à comité de lecture ; B institution reconnue, organisme international ; C presse, think tank, rapport d'acteur ; D communication partisane.
"""
SITE = 'https://www.edouardphilippe.fr/programme'
P_COMPTES = SITE + '/comptes-publics'
P_ENTREPRISES = SITE + '/entreprises'
P_TRAVAIL = SITE + '/travail'
P_RETRAITES = SITE + '/retraites'
P_FAMILLE = SITE + '/famille'
P_ECOLE = SITE + '/ecole'
P_DEFENSE = SITE + '/defense'
P_CLIMAT = SITE + '/adaptation-climatique'
PS_URL = 'https://www.publicsenat.fr/actualites/economie/entreprises-un-deal-a-250-milliards-deuros-sur-un-quinquennat-que-represente-la-proposition-dedouard-philippe'

AVERTISSEMENT = ("Le programme d'Édouard Philippe n'est pas chiffré par son auteur (12/11/2026). Ce chiffrage est une lecture de notre simulateur : les montants manquants sont fixés par nous, "
                 "hypothèse par hypothèse, et seront remplacés dès qu'un chiffrage officiel ou indépendant paraîtra.")
SRC_PH = ("Édouard Philippe (Horizons), programme présidentiel publié sur le site de campagne, 15 pages thématiques, « dernière mise à jour le 12 novembre 2026 » (%s), "
          "consulté le 13/11/2026 ; aucun chiffrage du candidat (ni coût par mesure, ni total, ni trajectoire)" % SITE)
COI_PH = 'auteur = le programme (candidat) ; montants absents, sauf ceux cités'
COI_CLAUDE = 'estimation de Claude (IA) ; banc tenu par une partie prenante de la comparaison, conflit d\'intérêts déclaré'

PROGRAMME = {
    'nom': 'Horizons (Édouard Philippe, 2027) : lecture de notre simulateur', 'cle': 'philippe', 'debut': 2028, 'regime': 2032,
    'calendrier': ("Même calendrier que les autres programmes : premier exercice après l'élection de 2027 = 2028 ; régime en 2032 (fin du quinquennat, horizon de la cible de 2 % du PIB). "
                   "Le pacte fiscal s'applique « en un coup, dès le premier projet de loi de finances » (Public Sénat, 06/11/2025) ; les non-remplacements et les salaires des professeurs montent "
                   "linéairement sur le quinquennat ; la réforme des retraites suit H-PH12 ; les autres lignes suivent la montée commune (40 %, 70 %, 90 %, 100 %, 100 %)."),
    'sources_chiffrage': SRC_PH, 'macro': 'reference', 'avertissement': AVERTISSEMENT,
}

MONTEE = [0.4, 0.7, 0.9, 1.0, 1.0]
LINEAIRE = [0.2, 0.4, 0.6, 0.8, 1.0]
IMMEDIAT = [1.0, 1.0, 1.0, 1.0, 1.0]
RETRAITES_MONTEE = [0.15, 0.30, 0.45, 0.60, 0.75]     # H-PH12 : 75 % de l'effet en 2032, plein effet ensuite (simplification du banc : le régime est atteint l'année suivante)

COUT_AGE_2032 = 22.906   # Md€ par an d'écart d'un an d'âge effectif moyen en 2032 : modeles/retraites/age_libre.js via js/pont_retraites.js (grille, delta = 1 an : 16,19 de pensions + 6,43 de recettes) x cohorte 2032 (1,0128) ; test_v2 le relit dans le cache

# Hypothèses fixées par nous : (bas, central, haut, motif, source, cote, conflit d'intérêts). Bornes symétriques autour du central.
HYP = {
    'H-PH1': (0.4, 0.7, 1.0,
              "Hausse de l'âge effectif moyen de départ, en régime, par rapport au droit actuel (âge effectif de 63,8 ans en 2032 dans le modèle) : âge légal porté de 64 à 65 ans et durée de 43 à 45 annuités, "
              "avec un tiers des assurés partant avant 65 ans (carrières longues, handicap à 55 ans, incapacité à 60 ans, invalidité à 62 ans). Un an d'âge légal ne se transmet pas en entier à l'âge effectif "
              "(ordre de grandeur des réformes de 2010 et 2023 : 0,5 à 0,75 an par an d'âge légal, ⚠️ non relu dans les bilans du COR) ; les deux annuités de plus ajoutent un peu pour les carrières commencées tard. "
              "Effet sur le solde = écart d'âge × coût d'un an d'âge effectif du modèle des retraites (%s Md€ en 2032, lu comme symétrique : un report économise ce qu'une avance coûte ⚠️). "
              "Les dépenses reportées sur le chômage, l'invalidité et les minima sociaux des seniors ne sont pas retirées (même modèle, même convention que pour le RN et LFI)." % str(COUT_AGE_2032).replace('.', ','),
              "modeles/retraites/age_libre.js (COR, rapport annuel 2026 ; Insee), par js/pont_retraites.js ; page Retraites du programme (%s)" % P_RETRAITES, 'B', COI_CLAUDE),
    'H-PH2': (40000.0, 48000.0, 56000.0,
              "Coût d'un poste supprimé par non-remplacement : coût chargé d'un recrutement (début de carrière), comme LR01 et M-M1 (écart n° 7 de memes-modeles.md), pas le salaire moyen du partant (63 000 €) ; "
              "250 000 postes en régime (« plus de 250 000 postes sur le quinquennat », un départ en retraite sur trois non remplacé, « personne ne sera licencié »).",
              "LR01 du banc (45 000 à 50 000 € par poste, ⚠️ ordre de grandeur) ; modeles/systeme-ideal/variante_dette_stable.js (HYP.masse : 370 Md€ pour 5 876 700 agents) ; page Comptes publics (%s)" % P_COMPTES, 'B', COI_CLAUDE),
    'H-PH3': (2.0, 3.5, 5.0,
              "Économie de l'indemnisation du chômage limitée à 12 mois pour les moins de 50 ans (18 mois aujourd'hui selon le programme) : la baisse de 24 à 18 mois de la durée maximale (coefficient 0,75, "
              "février 2023) était estimée à environ 4,4 Md€ par an en plein effet pour tous les âges (document de concertation de novembre 2022) ; la mesure retire 6 mois de plus aux seuls moins de 50 ans, "
              "qui épuisent moins souvent leurs droits que leurs aînés. Pas de retour à l'emploi plus rapide compté en plus (le banc ne compte aucun effet de croissance).",
              "Unédic, « Effets de l'adaptation des règles d'assurance chômage à la conjoncture », juillet 2023 (https://www.unedic.org/publications/effets-de-ladaptation-des-regles-dassurance-chomage-la-conjoncture), "
              "lu par moteur de recherche le 13/11/2026, chiffre de 4,4 Md€ relevé dans un document de concertation (MEDEF, 24/11/2022) ⚠️ non relu dans l'étude", 'C', "Unédic : gestionnaire paritaire du régime (B) ; MEDEF : partie à la négociation (orientation)"),
    'H-PH4': (0.3, 0.5, 0.7,
              "Trois jours de carence pour tous : dans le public, passer d'un à trois jours rapporte environ 289 M€ (toutes fonctions publiques) selon l'IGF et l'IGAS ; dans le privé, l'Assurance maladie ne verse déjà rien "
              "les trois premiers jours : interdire aux employeurs de les payer réduit un peu les arrêts courts et leurs prolongations (≈ 0,2 Md€ pour l'Assurance maladie, ⚠️ hypothèse sans source).",
              "IGF-IGAS, rapport sur les absences pour raison de santé dans la fonction publique (2024), chiffres repris par des amendements au PLF 2025 et par Acteurs publics, lus par moteur de recherche le 13/11/2026", 'B', 'inspections de l\'État'),
    'H-PH5': (1.5, 3.0, 4.5,
              "Heures supplémentaires : au-delà de 35 h, ni impôt ni cotisation salariale (CSG et CRDS comprises, à notre lecture) ; au-delà de 37 h, plus de cotisation patronale (les deux seuils de la page ne sont pas expliqués). "
              "Base : 14,9 Md€ d'heures supplémentaires rémunérées en 2022 ; l'exonération salariale actuelle coûte déjà 2,2 Md€ à la Sécurité sociale (non recomptée). Ajouts : CSG et CRDS (≈ 1,4 Md€), "
              "cotisations patronales sur la part au-delà de 37 h (≈ 1,5 Md€ pour la moitié des heures à 20 % effectifs), impôt au-delà du plafond actuel de 7 500 € (faible), moins les heures déclarées en plus ; "
              "pas d'effet sur l'emploi compté.",
              "Cour des comptes, rapport sur l'application des lois de financement de la sécurité sociale, mai 2024, chiffres rapportés par Force ouvrière et economie.gouv.fr, lus par moteur de recherche le 13/11/2026 ⚠️ non relu en primaire", 'C', "syndicat (orientation) relayant la Cour (A)"),
    'H-PH6': (1.5, 2.5, 3.5,
              "Pas d'impôt sur le revenu pour les ménages des déciles 4 à 6 et du début du 7e pendant les trois premières années de l'enfant ; 3 000 € de réduction par an au-dessus. "
              "Environ 1,9 million de ménages ont un enfant de moins de trois ans (≈ 650 000 naissances par an x 3, ⚠️ ordre de grandeur) : ≈ 0,7 million aux déciles visés x 1 500 € d'impôt moyen ≈ 1,0 Md€ ; "
              "≈ 0,6 million au-dessus x 2 600 € (réduction plafonnée par l'impôt dû) ≈ 1,5 Md€.",
              "estimation de Claude à partir des naissances (Insee) et d'un impôt moyen par décile non relu ⚠️ ; page Famille (%s)" % P_FAMILLE, 'D', COI_CLAUDE),
    'H-PH7': (3.0, 6.0, 9.0,
              "Coût net de l'allocation familiale unique (jusqu'à 350 € par mois dès le premier enfant, dégressive selon le revenu ; elle fusionne des aides « souvent accordées à partir du deuxième ou du troisième enfant » : "
              "allocations familiales, 13,8 Md€, et complément familial, à notre lecture). Le coût nouveau vient surtout des familles d'un enfant, qui ne touchent rien aujourd'hui : ≈ 3,5 millions de familles "
              "(⚠️ ordre de grandeur) x 175 € par mois en moyenne après dégressivité (350 € pour les trois premiers déciles, moitié moins ensuite jusqu'au 7e) x 12 ≈ 7 Md€, moins ce que la fusion reprend aux familles nombreuses aisées. "
              "Plafonds et barème non publiés.",
              "modeles/systeme-ideal/methode.md H86 et V11773 (Drees 2024 : allocations familiales 13,8 Md€ ; prestations familiales 22,7 Md€) ; page Famille (%s)" % P_FAMILLE, 'B', COI_CLAUDE),
    'H-PH8': (7.0, 9.0, 11.0,
              "Hausse de 20 % en moyenne du salaire des professeurs sur le quinquennat : la masse salariale de la mission « Enseignement scolaire » hors pensions est d'environ 59 Md€ (PLF 2026 : 64,5 Md€ hors CAS Pensions, "
              "dont 5,2 Md€ hors titre 2) ; les enseignants en représentent environ les trois quarts (≈ 45 Md€, ⚠️ part non relue), soit 9 Md€ pour 20 %. Bas : hausse en partie déjà acquise par les revalorisations en cours, "
              "ou limitée au traitement ; haut : primes et enseignement privé sous contrat compris, cotisations de pension comprises (dépense future).",
              "Sénat, rapport spécial « Enseignement scolaire », PLF 2026 (https://www.senat.fr/fileadmin/cru-1762483659/Commissions/Finances/2025-2026/PLF_2026/NP/Enseignement_scolaire_NP_PLF_2026.pdf), "
              "lu par moteur de recherche le 13/11/2026 ; page École (%s)" % P_ECOLE, 'B', 'rapport parlementaire'),
    'H-PH9': (0.75, 1.5, 2.25,
              "Défense, partie chiffrable seulement : service militaire volontaire porté à 50 000 places par an et réserve de 45 000 à 250 000. Le droit actuel prévoit déjà un service national (2,3 Md€ sur 2026-2030, "
              "10 000 jeunes par an en 2030, 50 000 visés en 2035) : seul l'écart est compté, ≈ 35 000 places de plus en 2032 x 24 000 € (France Stratégie, service de six mois) ≈ 0,8 Md€ ; réservistes ≈ 0,7 Md€ "
              "(≈ 170 000 de plus x ≈ 4 000 € par an, ⚠️ hypothèse sans source). La loi de programmation « de massification » n'a pas de montant : hors calcul.",
              "Euronews, 31/08/2026 et Banque des territoires (coût du service national), France Stratégie (24 000 € par jeune), lus par moteur de recherche le 13/11/2026 ; page Défense (%s)" % P_DEFENSE, 'C', 'presse ; France Stratégie (B)'),
    'H-PH10': (0.35, 0.65, 0.95,
               "Fonds unique d'adaptation de 2 Md€ par an réunissant le fonds Barnier et le Fonds vert : seul l'écart avec les dotations actuelles est une dépense nouvelle. Fonds vert ≈ 1,09 Md€ de crédits de paiement "
               "(PLF 2026), fonds Barnier ≈ 0,25 Md€ : écart ≈ 0,65 Md€ par an.",
               "Assemblée nationale, amendements au PLF 2026 et rapports budgétaires (Fonds vert, fonds de prévention des risques naturels majeurs), lus par moteur de recherche le 13/11/2026 ⚠️ montants de la loi votée non relus ; "
               "page Adaptation climatique (%s)" % P_CLIMAT, 'B', 'textes parlementaires'),
    'H-PH11': (0.3, 0.4, 0.5,
               "Premier versement de 500 € par l'État sur un plan d'épargne retraite à chaque premier emploi : ≈ 800 000 premiers emplois par an (taille d'une génération, ⚠️ ordre de grandeur) x 500 €.",
               "estimation de Claude ; page Retraites (%s)" % P_RETRAITES, 'D', COI_CLAUDE),
    'H-PH12': (None, None, None,
               "Calendrier de la réforme des retraites (65 ans et 45 annuités « en moins de dix ans », sans rythme publié) : 15 %, 30 %, 45 %, 60 %, 75 % de l'effet de 2028 à 2032, plein effet ensuite "
               "(simplification : le banc passe au régime en 2033, alors que la réforme s'achèverait vers 2035-2037 : l'effet de 2033 à 2036 est surestimé d'au plus un quart ⚠️).",
               "estimation de Claude", 'D', COI_CLAUDE),
}

H_CROISSANCE = ('H-PH-CROISSANCE', "Le programme attend un quart de l'effort de redressement « de la croissance et de l'emploi » ; le banc ne crédite aucun effet de croissance, pour aucun programme (même règle que pour tous).",
                "page Comptes publics (%s)" % P_COMPTES, 'D', COI_PH)
H_PRUDENCE = ('H-PH-METHODE', AVERTISSEMENT, "décision de l'auteur du manifeste, 13/11/2026", 'D', COI_CLAUDE)


def _h(cle):
    b, c, h, motif, src, cote, coi = HYP[cle]
    if b is None:
        return (cle, motif, src, cote, coi)
    return (cle, "%s Valeur retenue : %s ; fourchette %s à %s (bornes symétriques ; bornes de la sensibilité)." % (motif, _n(c), _n(b), _n(h)), src, cote, coi)


def _n(x):
    s = ('%.2f' % x).rstrip('0').rstrip('.') if abs(x) < 1000 else '{:,.0f}'.format(x).replace(',', ' ')
    return s.replace('.', ',')


def _val(cle, variante, signe):
    """Valeur de l'hypothèse pour une variante. signe = +1 pour une économie (plus haut = plus favorable au solde), -1 pour un coût."""
    b, c, h = HYP[cle][:3]
    if variante == 'central':
        return c
    if variante == 'bas':
        return b
    if variante == 'haut':
        return h
    if variante == 'favorable':
        return h if signe > 0 else b
    if variante == 'defavorable':
        return b if signe > 0 else h
    raise ValueError(variante)


def _bornes(cle, f=lambda x: x):
    b, c, h = HYP[cle][:3]
    return f(b), f(c), f(h)


def eco_lecture(id_, theme, chap, lib, cit, lien, cle, f, variante, interp, contrainte, montee, hyps=()):
    """Économie sans montant publié : notre lecture du montant plein (`lecture`) = f(hypothèse) ; la règle commune (score M/J/E, grille) s'applique à ce montant."""
    v = f(_val(cle, variante, +1))
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='recette', levier='cout_unitaire', valeur={'forme': 'fixe', 'central': v},
                annonce=None, lecture=v, hyp=cle, lecture_bornes=_bornes(cle, f), montee=montee, facteur='cout', **{'lambda': 0.5}, interpretation=interp, contrainte=contrainte,
                hypotheses=[_h(cle), H_PRUDENCE] + list(hyps))


def cout_lecture(id_, theme, chap, lib, cit, lien, cle, f, variante, interp, montee=None, hyps=()):
    """Baisse d'impôt ou dépense nouvelle sans montant publié : notre lecture (valeur la plus probable) ; au central, loi triangulaire sur les bornes de l'hypothèse, élargie par la fourchette commune
    (au moins 0,9 à 1,3 fois) ; dans une variante, l'hypothèse est fixée et seule la fourchette commune reste."""
    v = f(_val(cle, variante, -1))
    b, c, h = _bornes(cle, f)
    loi = {'forme': 'tri', 'bas': b, 'central': c, 'haut': h} if variante == 'central' else {'forme': 'tri', 'bas': v, 'central': v, 'haut': v}
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='depense', levier='cout_unitaire', valeur=loi, annonce=None, lecture=v, hyp=cle,
                lecture_bornes=(b, c, h), montee=montee or MONTEE, facteur='cout', **{'lambda': 0.3}, interpretation=interp, hypotheses=[_h(cle), H_PRUDENCE] + list(hyps))


def construire(variante='central'):
    """Mesures du programme pour une variante des hypothèses H-PH (central, bas, haut, favorable, defavorable)."""
    M = [
        # ------------------------------------------------------------------ économies (règle M/J/E)
        eco_lecture('PH01', 'Social', 'Retraites', "Retraites : âge légal porté à 65 ans et durée à 45 annuités « en moins de dix ans », un tiers des assurés partant avant 65 ans",
                    "« porter progressivement l'âge de départ à 65 ans » ; 45 annuités ; « Un Français sur trois pourrait partir avant 65 ans » ; ni hausse des cotisations ni baisse générale des pensions (page Retraites)",
                    P_RETRAITES, 'H-PH1', lambda a: a * COUT_AGE_2032, variante,
                    "Branché sur le modèle des retraites du dépôt par sa grille (coût d'un an d'âge effectif en 2032), lue dans l'autre sens : le report de l'âge économise ce qu'une avance coûte (même grille que la "
                    "retraite à 62 ans du RN et à 60 ans de LFI, utilisée ici à rebours ⚠️). Écart d'âge effectif : H-PH1. Rythme : H-PH12. La capitalisation collective et le versement de 500 € sont traités à part "
                    "(PHD5 et hors calcul).",
                    "Concertation avec les partenaires sociaux annoncée ; la réforme de 2023 est suspendue (loi n° 2025-1403) : le programme commence par la reprendre.", RETRAITES_MONTEE,
                    hyps=[_h('H-PH12')]),
        eco_lecture('PH02', 'État', 'Fonction publique', "Non-remplacement d'un fonctionnaire sur trois partant à la retraite : plus de 250 000 postes sur le quinquennat, sans licenciement",
                    "« ne pas remplacer 1 fonctionnaire sur 3 partant à la retraite, soit plus de 250 000 postes sur le quinquennat » ; « Personne ne sera licencié » (page Comptes publics)",
                    P_COMPTES, 'H-PH2', lambda c: 250000 * c / 1e9, variante,
                    "250 000 postes x coût d'un recrutement (H-PH2) = 12 Md€ par an en régime, avant la part réalisable de la règle commune (même type que LR01 et notre M-M1). "
                    "Le programme ne dit pas quelles fonctions publiques sont visées ; hôpitaux et écoles limitent le rythme.",
                    "Hôpitaux et écoles (besoins de personnel) ; collectivités hors de l'autorité de l'État (article 72 de la Constitution) ; retour catégoriel aux agents restants.", LINEAIRE),
        eco_lecture('PH03', 'Social', 'Chômage', "Assurance chômage : indemnisation limitée à 12 mois pour les moins de 50 ans",
                    "« limiter l'indemnisation à 12 mois pour les moins de 50 ans » (page Comptes publics) ; « contre 18 mois aujourd'hui » (page Travail)",
                    P_TRAVAIL, 'H-PH3', lambda x: x, variante,
                    "Économie pour l'Unédic (administration publique au sens du banc). Les plus de 50 ans ne sont pas concernés. Une partie de l'économie se reporte sur le RSA et la prime d'activité "
                    "(non retirée, ⚠️) ; la limitation de durée du RSA annoncée en même temps n'a aucun paramètre (hors calcul).",
                    "Gestion paritaire de l'assurance chômage (l'État a déjà fixé les règles par décret en 2019 et 2023) ; effet sur la pauvreté.", MONTEE),
        eco_lecture('PH04', 'Social', 'Arrêts maladie', "Trois jours de carence non payés pour tous les actifs, dans le privé comme dans le public",
                    "« Trois jours de carence pour tous, dans le privé comme dans le public » (pages Travail et Comptes publics)",
                    P_TRAVAIL, 'H-PH4', lambda x: x, variante,
                    "Même type de mesure que LR06 et LR15 (Les Républicains annoncent 3 et 4 Md€ pour des mesures voisines ; la seule estimation administrative lue, 289 M€ pour le public, est bien plus basse).",
                    "Accords collectifs du privé qui couvrent aujourd'hui les jours de carence ; dialogue social.", MONTEE),
        dict(id='PH05', theme='Entreprises', chapitre='Pacte fiscal', libelle="Pacte fiscal : 50 Md€ d'« aides publiques improductives » aux entreprises en moins (contrepartie de PHT1)",
             citation="« 50 milliards d'euros d'impôts de production en moins, en échange de 50 milliards d'euros d'aides publiques en moins » ; « sans creuser le déficit » (page Entreprises)",
             lien=P_ENTREPRISES, sens='recette', levier='cout_unitaire', valeur={'forme': 'fixe', 'central': 50.0}, annonce=50.0, montee=IMMEDIAT, facteur='cout', **{'lambda': 0.5},
             interpretation="Seul montant d'économie publié. La liste des aides supprimées n'est pas publiée ; l'entourage du candidat parle d'aides « saupoudrées » et de réformes du soutien à l'innovation, "
                            "à la formation et à l'apprentissage, et précise que ce n'est « pas tout à fait du un pour un » (Public Sénat, 06/11/2025). Les aides aux entreprises comprennent des niches fiscales, "
                            "des exonérations de cotisations et des subventions : même type que les niches de LFI (R02) et les exonérations du PS (PS04). La règle commune s'applique aux 50 Md€.",
             contrainte="Aides désignées par aucune liste ; une partie est faite d'allègements de cotisations sur les bas salaires (effet sur l'emploi) et de crédits d'impôt contractuels.",
             hypotheses=[('H-PH-ANNONCE', "Montant du candidat : 50 Md€ par an, en une fois dès le premier budget.", "%s ; Public Sénat, 06/11/2025 (%s)" % (SRC_PH, PS_URL), 'D', COI_PH), H_CROISSANCE]),
        # ------------------------------------------------------------------ baisses d'impôts (comptées en entier, fourchette commune)
        dict(id='PHT1', theme="Baisses d'impôts", chapitre='Pacte fiscal', libelle="Pacte fiscal : 50 Md€ d'impôts de production en moins",
             citation="« 50 milliards d'euros d'impôts de production en moins » ; impôts « dans le viseur » : CVAE, C3S et CFE (entourage du candidat, Public Sénat, 06/11/2025)",
             lien=P_ENTREPRISES, sens='depense', levier='cout_unitaire', valeur={'forme': 'tri', 'bas': 0.95 * 50.0, 'central': 50.0, 'haut': 1.15 * 50.0}, annonce=50.0, montee=IMMEDIAT,
             facteur='cout', **{'lambda': 0.3},
             interpretation="Coût certain une fois voté : montant du candidat, compté en entier avec la fourchette commune. Pour mémoire, la CFE, la CVAE et la C3S ne pèsent ensemble que 17,1 Md€ (annexe du RN, ligne T03) : "
                            "50 Md€ supposent un périmètre plus large (taxe foncière des entreprises, versement mobilité, taxe sur les salaires ⚠️). Compensation des collectivités comprise dans le coût.",
             hypotheses=[('H-PH-ANNONCE', "Montant du candidat : 50 Md€ par an ; fourchette 0,95 à 1,15 fois (convention, sans source), élargie par la règle commune.", SRC_PH, 'D', COI_PH)]),
        cout_lecture('PHT2', "Baisses d'impôts", 'Travail', "Heures au-delà de 35 h sans impôt ni cotisation salariale, au-delà de 37 h sans cotisation patronale ; 35 heures plus obligatoires",
                     "« au-delà de 35 h le salarié ne paiera ni impôt ni cotisation » ; « Au-delà de la 37e heure, l'entreprise ne paiera plus de cotisation patronale » ; ≈ 1 000 € par an pour deux heures de plus au Smic (pages Entreprises et Travail)",
                     P_TRAVAIL, 'H-PH5', lambda x: x, variante,
                     "Le programme ne chiffre pas la mesure. Lecture : H-PH5. Les deux seuils (35 h et 37 h) sont pris tels quels ; la fin des 35 heures par accord d'entreprise n'a pas d'effet budgétaire direct.", MONTEE),
        cout_lecture('PHT3', "Baisses d'impôts", 'Famille', "Pas d'impôt sur le revenu pour les classes moyennes pendant les trois premières années de l'enfant ; 3 000 € de réduction par an au-dessus",
                     "« zéro impôt pour les classes moyennes les trois premières années de l'enfant » ; déciles 4 à 6 et début du 7e ; « une réduction d'impôt de 3 000 € par an » pour les familles plus aisées qui travaillent (page Famille)",
                     P_FAMILLE, 'H-PH6', lambda x: x, variante, "Plafonds de revenu en euros non publiés. Lecture : H-PH6.", MONTEE),
        # ------------------------------------------------------------------ dépenses nouvelles (comptées en entier, fourchette commune)
        cout_lecture('PHD1', 'Famille', 'Famille', "Allocation familiale unique jusqu'à 350 € par mois dès le premier enfant, dégressive selon le revenu, qui fusionne des aides existantes",
                     "« Verser une allocation familiale de 350 € par mois dès le premier enfant » ; dégressive selon le revenu ; elle fusionnerait des aides « souvent accordées à partir du deuxième ou du troisième enfant » (page Famille)",
                     P_FAMILLE, 'H-PH7', lambda x: x, variante, "Coût net après fusion, lecture H-PH7 ; aucune prestation remplacée n'est nommée par le programme.", MONTEE),
        cout_lecture('PHD2', 'École', 'École', "Salaire des professeurs relevé de 20 % en moyenne sur le quinquennat",
                     "« De 20 % en moyenne sur le quinquennat », au moins « au niveau de la moyenne européenne, en particulier en milieu de carrière » (page École)",
                     P_ECOLE, 'H-PH8', lambda x: x, variante, "Coût en régime (2032) ; montée linéaire sur cinq ans. Aucune contrepartie n'est mentionnée. Lecture : H-PH8.", LINEAIRE),
        cout_lecture('PHD3', 'Défense', 'Défense', "Service militaire volontaire porté à 50 000 places par an et réserve portée à 250 000 (partie chiffrable de la défense)",
                     "service militaire volontaire « de 3 000 à 50 000 places par an » ; réservistes « de 45 000 à 250 000 » ; loi de programmation militaire « de massification » sans montant (page Défense)",
                     P_DEFENSE, 'H-PH9', lambda x: x, variante, "Seul l'écart au service national déjà prévu est compté. Lecture : H-PH9.", MONTEE),
        cout_lecture('PHD4', 'Climat', 'Adaptation climatique', "Fonds unique d'adaptation au changement climatique de 2 Md€ par an (fonds Barnier et Fonds vert réunis)",
                     "« un fonds unique d'adaptation au changement climatique, réunissant le fonds Barnier et le Fonds vert, doté de 2 milliards d'euros par an » (page Adaptation climatique)",
                     P_CLIMAT, 'H-PH10', lambda x: x, variante,
                     "Montant brut publié (2 Md€) ; seul l'écart avec les deux fonds actuels est compté comme dépense nouvelle (H-PH10). Le champ « annonce » reste vide : les 2 Md€ ne sont pas un coût net.", MONTEE),
        cout_lecture('PHD5', 'Social', 'Retraites', "Premier versement de 500 € par l'État sur un plan d'épargne retraite à chaque premier emploi",
                     "« Ouvrir un plan d'épargne retraite à chaque Français, avec un premier versement de 500 € par l'État dès le premier emploi » (page Retraites)",
                     P_RETRAITES, 'H-PH11', lambda x: x, variante, "Lecture : H-PH11.", MONTEE),
    ]
    return M


MESURES = construire('central')
VARIANTES = ('bas', 'haut', 'defavorable', 'favorable')

NON_CHIFFREES = [
    "le quart de l'effort de redressement attendu « de la croissance et de l'emploi » : non crédité, aucun effet de croissance n'est compté pour aucun programme",
    "règle d'or constitutionnelle par référendum (interdiction de creuser le déficit au-delà de 3 %) et cible de 2 % du PIB en fin de mandat : des règles et des résultats, pas des mesures",
    "« aucun nouvel impôt pendant cinq ans » : engagement sans effet propre dans le banc (le droit actuel n'en prévoit pas)",
    "RSA à durée limitée : aucune durée publiée ; préambule de 1946 (moyens convenables d'existence) à examiner",
    "fusion ou suppression de « dizaines » d'opérateurs, d'agences et de comités, regroupement ou privatisation : aucune liste ni montant",
    "santé : « mieux dépenser » par la prévention et l'IA, sans baisse de la dépense : aucun montant",
    "suppression de normes, fin de la surtransposition, moratoire sur les normes : aucun montant",
    "capitalisation collective généralisée à tous les salariés : taux et financement non publiés ; si elle détourne des cotisations du régime par répartition, elle coûte pendant une génération (comme LR13) ⚠️",
    "prêt à taux zéro à chaque naissance : montant non publié",
    "temps partiel à 80 % payé 100 % pendant deux mois après le congé parental : payeur et population non publiés",
    "doublement des plafonds de donation pendant trois ans et maintien du pacte Dutreil : sens de l'effet incertain (anticipation des transmissions)",
    "« livret capital France », fonds de capitalisation, Union des marchés de capitaux : pas d'effet direct sur le solde",
    "baisse du prix de l'électricité pour les industriels, soutien au véhicule électrique d'occasion, relance du nucléaire : aucun montant",
    "loi de programmation militaire « de massification », 700 000 obus par an, drones, navires : aucun budget publié (seuls le service volontaire et la réserve sont chiffrés, PHD3)",
    "réduction de la taille des classes en maternelle et en primaire, 100 000 ingénieurs par an, soutien scolaire universel, écoles normales : aucun effectif cible ni coût",
    "immigration divisée par deux, moratoire sur le regroupement familial, aides aux étrangers alignées sur la moyenne européenne, dénonciation de l'accord de 1968 : aucun montant",
    "sécurité, justice, peines planchers, construction de prisons, protection de l'enfance, outre-mer : aucun montant",
    "climatisation des lieux accueillant des personnes fragiles, opérateur unique de l'adaptation, réutilisation des eaux usées : aucun montant au-delà du fonds de 2 Md€",
]
