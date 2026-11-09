# -*- coding: utf-8 -*-
"""
Les Républicains pour 2027 (candidat : Bruno Retailleau, désigné par les adhérents en avril 2026), décrit comme fichier de mesures du banc d'essai.
Document chiffré : le « plan d'économies » de 197 Md€ présenté par le candidat le 12/10/2026 (conférence de presse, tableau remis à la presse ; entretien aux Échos). Le dossier lui-même n'a pas été
trouvé en ligne (ni sur le site des Républicains, ni en PDF) : les montants sont ceux que rapportent Public Sénat, LCP, Europe 1, Acteurs publics, l'AFP (via La Gazette France) et Upside, le 12 et le 15/10/2026 ;
ils concordent sur les totaux (État 96, social 91, collectivités 10 ; 146 pour la dette, 51 rendus aux ménages et aux entreprises) et sur une partie du détail. ⚠️ À VÉRIFIER dans le dossier de presse (V-LR-01).
Lecture des montants (H-LR-LECTURE) : « 197 milliards d'économies cumulées jusqu'en 2032 » est lu comme le niveau annuel des économies atteint en 2032 (par rapport à la dépense tendancielle), et non comme la
somme des économies de cinq années : c'est la seule lecture compatible avec le passage annoncé d'un déficit de 5,4 % à 2,2 % du PIB (environ 3,2 points, soit plus de 100 Md€ par an). Voir le dossier, § 2.
Format d'une mesure : voir moteur.py et README ; mêmes champs et même convention que le RN (`theme`, `annonce`, `contrainte` ; loi `med` : médiane = notre estimation réalisable, haut = l'annonce).
Cotes (la charte de travail (CONTRIBUTING.md), règle 11) : A statistique publique, texte officiel, revue à comité de lecture ; B institution reconnue, organisme international ; C presse, think tank, rapport d'acteur ; D communication partisane.
"""
PS_URL = 'https://www.publicsenat.fr/actualites/economie/presidentielle-2027-bruno-retailleau-sengage-sur-un-plan-deconomies-de-pres-de-200-milliards-deuros-sil-est-elu'
LCP_URL = 'https://lcp.fr/actualites/face-a-une-france-quasiment-en-faillite-bruno-retailleau-presente-un-plan-d-economies-de'
E1_URL = 'https://www.europe1.fr/politique/presidentielle-2027-bruno-retailleau-promet-des-economies-de-pres-de-200-milliards-deuros-jusquen-2032-1141661'
AP_URL = 'https://acteurspublics.fr/articles/bruno-retailleau-veut-faire-travailler-davantage-les-fonctionnaires/'
AFP_URL = 'https://www.lagazettefrance.fr/article/presidentielle-retailleau-sort-le-bulldozer-pour-reduire-la-depense-publique'
UP_URL = 'https://www.upside24.com/articles/plan-retailleau-197-milliards-d-euros-d-economies-en-5-ans-pour-ramener-le-defic-902915'
RET_URL = 'https://www.24matins.fr/retraites-le-projet-de-bruno-retailleau-durcit-lage-de-depart-1421188'
IFRAP_URL = 'https://www.ifrap.org/retraite/retraites-la-decote-fait-trois-fois-moins-deconomies-que-le-report-de-lage'

SRC_LR = ("Bruno Retailleau (Les Républicains), plan d'économies présenté le 12/10/2026, montants rapportés par Public Sénat (12/10/2026, %s), LCP (12/10/2026, %s), Europe 1 (12/10/2026, %s), "
          "Acteurs publics (12/10/2026, tableau remis à la presse, %s), AFP via La Gazette France (12/10/2026, %s), consultés le 09/11/2026 ; dossier du candidat non trouvé (⚠️ V-LR-01)" % (PS_URL, LCP_URL, E1_URL, AP_URL, AFP_URL))
COI_LR = "auteur = le programme chiffré (candidat) ; montants relayés par la presse sans validation indépendante"

PROGRAMME = {
    'nom': 'Les Républicains (plan Retailleau, 2027)', 'cle': 'lr', 'debut': 2028, 'regime': 2032,
    'calendrier': ("Même calendrier que LFI et le RN : premier exercice après l'élection de 2027 = 2028 ; régime en 2032 (« jusqu'en 2032 »). Les non-remplacements montent linéairement sur cinq ans ; "
                   "les autres économies et les baisses d'impôts suivent la montée du RN (40 %, 70 %, 90 %, 100 %), faute de calendrier publié (le candidat annonce un excédent primaire en 2030 et un déficit sous 3 % en 2031)."),
    'sources_chiffrage': SRC_LR, 'macro': 'reference',
}

MONTEE = [0.4, 0.7, 0.9, 1.0, 1.0]
LINEAIRE = [0.2, 0.4, 0.6, 0.8, 1.0]


def tri(b, c, h, **kw):
    d = {'forme': 'tri', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def med(b, c, h, **kw):
    d = {'forme': 'med', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def eco(id_, theme, chap, lib, cit, annonce, bas, c, haut, interp, contrainte, hyps=(), lien=PS_URL, lam=0.5, montee=None):
    """Économie annoncée : montant du candidat = plafond (haut) ; médiane = ce qui est réalisable selon nos hypothèses (contrainte nommée). Effet sur le solde : + améliore."""
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='recette', levier='cout_unitaire', valeur=med(bas, c, haut), annonce=annonce, montee=montee or MONTEE,
                facteur='cout', **{'lambda': lam}, interpretation=interp, contrainte=contrainte,
                hypotheses=[('H-LR-%s' % id_, "Montant annoncé : %s Md€ par an en 2032 (lecture H-LR-LECTURE). Fourchette retenue : plancher %s, médiane %s, plafond %s Md€ (convention : la médiane est notre estimation réalisable)." % (annonce, bas, c, haut), SRC_LR, 'D', COI_LR), H_TENDANCIEL] + list(hyps))


def cout_lr(id_, theme, chap, lib, cit, m, interp='', bas=0.95, haut=1.15, hyps=(), lam=0.3, lien=PS_URL):
    """Baisse d'impôt chiffrée par le candidat : coût certain une fois votée ; valeur centrale = son montant, fourchette 0,95 à 1,15 fois (même convention que pour le RN, sans source)."""
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='depense', levier='cout_unitaire', valeur=tri(bas * m, m, haut * m), annonce=m, montee=MONTEE,
                facteur='cout', **{'lambda': lam}, interpretation=interp,
                hypotheses=[('H-LR-%s' % id_, "Montant du candidat : %s Md€ par an ; fourchette %s à %s fois (convention, sans source)." % (m, bas, haut), SRC_LR, 'D', COI_LR)] + list(hyps))


H_TENDANCIEL = ('H-LR-TENDANCIEL', "Les économies sont annoncées par rapport à une dépense « tendancielle » non publiée ; le banc les compte par rapport au droit actuel (solde primaire de 2024 maintenu en part du PIB). Si la dépense tendancielle du candidat croît plus vite que le PIB, une partie de l'annonce ne fait que compenser cette croissance et notre lecture est favorable au programme (même biais que pour le RN). ⚠️", "estimation de Claude", 'D', 'sans objet')

MESURES = [
 # ------------------------------------------------------------------ État (96 Md€ annoncés)
 eco('LR01', 'État', 'Fonction publique', "Non-remplacement de 400 000 agents partant à la retraite d'ici 2032 (16 heures de travail de plus par an, appui de l'IA)",
     "« 400 000 départs à la retraite non remplacés (IA, 1 623 heures) : 25 milliards » (tableau remis à la presse, Acteurs publics)", 25.0, 6.0, 12.0, 25.0,
     "400 000 non-remplacements en cinq ans, soit 80 000 par an : davantage que les départs à la retraite de la seule fonction publique d'État ; la mesure touche donc aussi les collectivités et les hôpitaux (recouvrement possible avec LR16). Une suppression de poste par non-remplacement économise le coût d'un recrutement (début de carrière), pas le salaire du partant : environ 45 000 à 50 000 € chargés par poste (⚠️ ordre de grandeur), soit 18 à 20 Md€ si les 400 000 postes disparaissent ; le dossier Philippe du banc retenait 63 000 € (salaire moyen, borne haute). Médiane 12 Md€ : rythme atteint aux deux tiers (la RGPP de 2007-2012, un départ sur deux non remplacé dans la seule fonction publique d'État, a supprimé de l'ordre de 150 000 postes en cinq ans, dont la moitié des économies a été rendue aux agents en mesures catégorielles : ⚠️ ordre de grandeur cité de mémoire, à vérifier).",
     "Hôpitaux et écoles (besoins de personnel) ; collectivités hors de l'autorité de l'État (libre administration, article 72 de la Constitution) ; retour catégoriel aux agents restants.",
     hyps=[('H-LR-MASSE', "Masse salariale publique : 370 Md€ pour 5 876 700 agents, environ 63 000 € par agent (salaire moyen chargé).", "modeles/systeme-ideal/variante_dette_stable.js (HYP.masse) ; sources/chiffrage-programme-philippe-2027.md § 3", 'B', 'modèle du dépôt')],
     lien=AP_URL, montee=LINEAIRE),
 eco('LR02', 'État', 'Opérateurs', "Contrats non renouvelés et départs volontaires hors retraite (opérateurs)", "« contrats non renouvelés et départs volontaires […] : 5 milliards » (Acteurs publics)", 5.0, 0.5, 1.5, 5.0,
     "Départs volontaires : coûteux la première année (indemnités), économie ensuite.", "Indemnités de départ ; continuité des missions.", lien=AP_URL),
 eco('LR03', 'État', 'Opérateurs', "Suppression de la quasi-totalité des agences et opérateurs de l'État", "« la suppression sera la règle, et la prolongation d'activité l'exception » ; « agences et opérateurs : 7,5 milliards » (Acteurs publics)", 7.5, 0.5, 2.0, 7.5,
     "Supprimer une agence ne supprime pas ses missions : l'essentiel de la dépense (prestations, subventions, personnel) est réinternalisé. Même médiane relative que la ligne A01 du RN (1,5 sur 10,1).", "Missions reprises par les ministères ; statuts des personnels ; lois créant les agences.", lien=AP_URL),
 eco('LR04', 'État', 'Méthode budgétaire', "Budgets « base zéro » des interventions de l'État", "« budget base zéro des interventions de l'État : 11,5 milliards » (Acteurs publics, Public Sénat)", 11.5, 0.5, 2.5, 11.5,
     "Méthode, pas mesure : aucune intervention désignée. Médiane faible faute de liste.", "Aucune dépense désignée.", lien=AP_URL),
 eco('LR05', 'État', 'Organisation', "Doublons entre l'État et les collectivités (dépenses de l'État)", "« doublons État-collectivités : 4 milliards » (Acteurs publics)", 4.0, 0.0, 1.0, 4.0,
     "Doublons non désignés.", "Compétences fixées par la loi ; transferts de charges compensés (article 72-2 de la Constitution).", lien=AP_URL),
 eco('LR06', 'État', 'Fonction publique', "Absentéisme dans la fonction publique : trois jours de carence, autorisations d'absence", "« absentéisme (trois jours de carence […]) : 3 milliards d'ici 2032 » (Acteurs publics)", 3.0, 0.4, 1.0, 3.0,
     "Trois jours de carence au lieu d'un dans les trois fonctions publiques ; l'économie dépend de la baisse des arrêts courts. ⚠️ Recoupement non trouvé en source primaire (estimation gouvernementale de 2024-2025 pour une mesure voisine, de l'ordre de 1 Md€, non relue).", "Dialogue social ; pas d'obstacle juridique majeur.", lien=AP_URL),
 eco('LR07', 'État', 'Fonctionnement', "Délégation au privé de fonctions support (immobilier, achats, systèmes d'information)", "« délégation au secteur privé : 5 milliards » (Public Sénat, Acteurs publics)", 5.0, 0.0, 1.0, 5.0,
     "Externaliser déplace la dépense (contrats) plus qu'elle ne la supprime ; l'économie vient des gains de productivité des prestataires, rarement mesurés.", "Coûts de contrat et de pilotage ; dépendance (systèmes d'information).", lien=PS_URL),
 eco('LR08', 'État', 'Formation', "Transfert de la formation professionnelle aux régions", "« formation professionnelle transférée aux régions : 6 milliards » (Public Sénat)", 6.0, 0.0, 1.0, 6.0,
     "Un transfert entre l'État et les régions ne change pas le déficit des administrations publiques (périmètre du banc) sauf si la dépense baisse ; transfert compensé par la Constitution (article 72-2).", "Compensation financière des transferts de compétences (article 72-2).", lien=PS_URL),
 eco('LR09', 'État', 'Interventions', "Postes agrégés : soutien au photovoltaïque et à l'éolien, aide au développement, culture et audiovisuel public, contrats aidés, fin du SNU, MaPrimeRénov'", "« 23 milliards » pour ces postes (Public Sénat)", 23.0, 4.0, 9.0, 23.0,
     "Le soutien aux énergies renouvelables passe surtout par des contrats d'achat en cours (engagements de l'État sur 15 à 20 ans) : seules les nouvelles enveloppes sont pilotables à cinq ans ; l'aide publique au développement et l'audiovisuel public se réduisent par la loi de finances ; la fin du SNU et la réduction de MaPrimeRénov' sont immédiates. Médiane 9 Md€ (≈ 40 %).", "Contrats d'achat d'électricité en cours ; engagements internationaux d'aide ; dépendances de la rénovation énergétique aux aides.", lien=PS_URL),
 eco('LR10', 'État', 'Associations', "Fin des subventions aux associations « qui contestent ou entravent la loi »", "« 3 milliards » (Public Sénat)", 3.0, 0.0, 0.3, 3.0,
     "Critère non défini ; la liberté d'association et l'égalité devant la loi limitent un critère fondé sur l'opinion.", "Liberté d'association (principe fondamental reconnu par les lois de la République, décision du Conseil constitutionnel de 1971) ; égalité.", lien=PS_URL),
 eco('LR11', 'État', 'Non détaillé', "Économies de l'État non détaillées (96 Md€ annoncés, 93 retrouvés ligne à ligne)", "« État : 96 milliards » (LCP, AFP)", 3.0, 0.0, 0.5, 3.0,
     "Écart entre le total de l'État et la somme des lignes rapportées par la presse.", "Non détaillé.", lien=LCP_URL),
 # ------------------------------------------------------------------ Sphère sociale (91 Md€ annoncés)
 eco('LR12', 'Social', 'Retraites', "Retraites : âge minimal de 63 ans avec décote de 7 % par an, taux plein automatique à 65 ans (lié à l'espérance de vie)",
     "« 12 milliards » pour la décote entre 63 et 65 ans (Public Sénat) ; « une décote de 7 % par an » (24matins, 25/09/2026)", 12.0, 1.0, 5.0, 12.0,
     "Par rapport au droit actuel (réforme de 2023 suspendue ; décote de 1,25 % par trimestre manquant, taux plein automatique à 67 ans), la mesure joue dans les deux sens : la décote de 7 % par an entre 63 et 65 ans touche aussi ceux qui ont toute leur durée (économie, et départs reportés), mais le taux plein « même sans avoir validé tous ses trimestres » dès 65 ans au lieu de 67 coûte. Solde net non publié ; l'iFRAP estime qu'une décote rapporte environ trois fois moins qu'un report d'âge équivalent. Médiane 5 Md€ ; le modèle des retraites du dépôt ne traite que les départs avancés (levier retraites_age) : à brancher (T-LR-1).",
     "Concertation avec les partenaires sociaux ; métiers pénibles (aménagements annoncés, non chiffrés).",
     hyps=[('H-IFRAP-DECOTE', "« La décote fait trois fois moins d'économies que le report de l'âge » (titre).", "iFRAP, %s, date non relevée, consulté par moteur de recherche le 09/11/2026" % IFRAP_URL, 'C', "think tank libéral favorable à la baisse des dépenses ; orientation à dire")],
     lien=RET_URL),
 eco('LR13', 'Social', 'Retraites', "Retraites, autres leviers : capitalisation partielle pour les jeunes, placement des réserves, convergence de l'Agirc-Arrco, fin des régimes spéciaux", "retraites : « environ 42 milliards » au total, dont 12 pour la décote (Public Sénat) ; « 40 milliards d'économies cumulées sur cinq ans » (24matins)", 30.0, -4.0, 1.0, 30.0,
     "Ces leviers améliorent peu ou pas le déficit public au sens du banc : (a) une part de capitalisation (25 à 30 % de la pension des nouveaux entrants) détourne des cotisations du régime par répartition, qui doit continuer de payer les pensions en cours : c'est un coût pendant une génération (d'où un plancher négatif) ; (b) placer les réserves est une opération financière ; (c) la convergence de l'Agirc-Arrco est un transfert à l'intérieur des administrations publiques ; (d) la fin des régimes spéciaux ne joue que sur les nouveaux entrants. Médiane 1 Md€. Lecture « cumulée » possible des 40 à 42 Md€ (somme de cinq ans) : voir H-LR-LECTURE.",
     "Transition de la capitalisation (double paiement) ; comptabilité nationale (opérations financières et transferts internes sans effet sur le déficit).", lien=PS_URL, lam=0.4),
 eco('LR14', 'Social', 'Chômage et prestations', "Assurance chômage et prestations sociales", "« assurance chômage et prestations sociales : 30 milliards » (Public Sénat)", 30.0, 3.0, 8.0, 30.0,
     "Mesures non détaillées dans la presse lue. Ordre de grandeur : les dépenses d'indemnisation du chômage sont de l'ordre de 40 Md€ par an (⚠️ non relu) ; 30 Md€ supposent de réduire de moitié l'indemnisation et de toucher aux minima et aux aides au logement. Médiane 8 Md€ (durée et dégressivité de l'indemnisation, conditions des prestations).", "Gestion paritaire de l'assurance chômage ; conventions ; effets sur la pauvreté.", lien=PS_URL),
 eco('LR15', 'Social', 'Santé', "Arrêts maladie : jour de carence « d'ordre public » dans le privé", "« jour de carence d'ordre public » ; arrêts maladie : 4 milliards (Public Sénat)", 4.0, 0.3, 1.0, 4.0,
     "Interdire aux employeurs de couvrir le délai de carence : l'économie pour l'Assurance maladie vient de la baisse des arrêts courts, l'essentiel du gain va aux employeurs et aux complémentaires.", "Accords collectifs existants ; concertation.", lien=PS_URL),
 eco('LR16', 'Social', 'Immigration', "Immigration (dont 4,5 Md€ conditionnés à une révision de la Constitution)", "« immigration : 10 milliards » dont 4,5 subordonnés à une révision constitutionnelle (Public Sénat, LCP)", 10.0, 0.5, 2.0, 10.0,
     "Mesures non détaillées. Même médiane relative que les lignes I01 à I04 du RN (5,1 sur 22,8) : les conditions de résidence ou de travail pour les prestations se heurtent au Conseil constitutionnel (décision n° 2024-6 RIP) et au droit de l'UE (directive 2003/109/CE).", "Révision de la Constitution (4,5 Md€) ; droit de l'UE ; jurisprudence constitutionnelle (voir H-CONST-PRESTATIONS du RN).", lien=PS_URL),
 eco('LR17', 'Social', 'Fraude', "Fraude fiscale et sociale", "« fraude : 5 milliards » (Public Sénat)", 5.0, 0.3, 1.0, 5.0,
     "Même médiane relative que la ligne H02 du RN : recettes incertaines et lentes.", "Recouvrement effectif bien inférieur aux montants notifiés ⚠️.", lien=PS_URL),
 # ------------------------------------------------------------------ Collectivités (10 Md€)
 eco('LR18', 'Collectivités', 'Collectivités', "Effort des 2 232 collectivités de plus de 10 M€ de budget (fonctionnement hors personnel et prestations sociales)", "« collectivités : 10 milliards » (LCP, AFP, Public Sénat)", 10.0, 1.0, 3.0, 10.0,
     "Le levier de l'État est la dotation ou un dispositif de contrats ; les collectivités ajustent souvent par l'investissement ou la fiscalité locale. Même médiane relative que K01-K02 du RN (2,9 sur 10,4). Recouvrement possible avec LR01 (agents territoriaux).", "Libre administration (article 72) ; autonomie financière (article 72-2).", lien=LCP_URL),
 # ------------------------------------------------------------------ Baisses d'impôts (51 Md€ rendus)
 cout_lr('LRT1', "Baisses d'impôts", 'Entreprises', "Suppression des impôts de production (entreprises)", "« 30 milliards pour les entreprises, notamment par la suppression des impôts de production » (LCP)", 30.0,
         interp="Montant du candidat. Pour mémoire, la suppression de la CFE, de la CVAE et de la C3S coûte 17,1 Md€ dans l'annexe du RN : 30 Md€ supposent un périmètre plus large (taxe foncière des entreprises, taxe sur les salaires, versement mobilité ⚠️). Compensation des collectivités comprise dans le coût (lecture)."),
 cout_lr('LRT2', "Baisses d'impôts", 'Ménages', "Allègements pour les ménages : exonération de cotisations sur les heures supplémentaires, baisse de la facture d'électricité", "« 21 milliards » pour les ménages, « baisse des cotisations fiscales ou de la facture d'électricité » (LCP) ; heures supplémentaires (Public Sénat)", 21.0,
         interp="Montant du candidat ; mesures précises non publiées."),
]

NON_CHIFFREES = ["santé (280 Md€ de dépenses) : aucun montant d'économie (Public Sénat)", "hausse du temps de travail des agents publics de 1 607 à 1 623 heures (comptée dans LR01)",
                 "suppression de 600 000 postes sur dix ans (au-delà de 2032)", "abrogation de normes (« passer au bulldozer ») : aucun montant",
                 "écart entre 56 et 51 Md€ d'allègements selon les articles (Public Sénat) : 51 retenu, comme LCP et l'AFP",
                 "trajectoire annuelle du déficit non publiée (excédent primaire en 2030, déficit sous 3 % en 2031, 2,2 % en 2032)"]
