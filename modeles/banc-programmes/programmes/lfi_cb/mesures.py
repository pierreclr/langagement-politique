# -*- coding: utf-8 -*-
"""
SENSIBILITÉ « LFI, contre-budget 2027 » (ajoutée le 11/11/2026) : la colonne principale de LFI chiffre « L'Avenir en commun » en entier (programmes/lfi) ; celle-ci chiffre seulement ce que le document budgétaire annuel de LFI
chiffre, pour montrer l'écart entre un budget d'une année et un programme complet. Elle ne remplace pas la colonne principale.
Document : « Comment nous allons remettre de l'ordre dans les comptes publics » (contre-budget 2027, octobre 2026, 24 p., Mélenchon et Coquerel), lu en entier le 11/11/2026 :
recettes supplémentaires 106,4 Md€ (p. 6, 13-14), dépenses d'urgence 81,7 Md€ (p. 12 : relance par les revenus 37,5 + services publics 22,2 + planification écologique 10 + Sécurité sociale 12), réduction du déficit annoncée 24,7 Md€ (p. 6, 14).
Le document dit lui-même (p. 7) : « il ne constitue pas un chiffrage complet du programme L'Avenir en Commun ».
CONSTRUCTION
 - Recettes : les 13 lignes de recettes de la colonne principale (R01a à R12) qui sont exactement les recettes du document (106,4 Md€ ; R11 regroupe rachats d'actions 2,5 et crypto-actifs 1,0) ; mêmes modèles, mêmes réponses M/J/E (faisabilite.CLASSEMENT['lfi_cb'] = celles de 'lfi').
   Seule la ligne R13 (impôt sur le revenu à 14 tranches), absente du document, est retirée.
 - Dépenses : les 14 lignes chiffrées du document, à leur montant annoncé (valeur centrale), régime plein dès 2028 (un budget annuel lu comme permanent, euros constants) ; fourchette de la règle commune des dépenses nouvelles (0,9 à 1,3 fois).
   Ce sont des coûts de la première année du budget : la colonne principale, qui modélise les mêmes mesures sur la durée (retraites à 60 ans, 100 % Sécu, nationalisations, Smic…), coûte plus. C'est l'écart que cette sensibilité montre.
 - Hors colonne : SMIC à 1 700 € net, blocage du prix du carburant à 1,70 €/l, rénovation de 700 000 logements, interruption de l'exonération de cotisations au-dessus de 2 Smic (non chiffrés dans le document) ; pôle public bancaire (100 Md€ d'investissements, hors budget de l'État) ; plafond du livret A à 30 000 €.
Cotes : D (document de parti), montants non vérifiés par Claude.
"""
import importlib.util
import os

DOC_URL = 'https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf'
SRC_CB = ("La France insoumise, « Comment nous allons remettre de l'ordre dans les comptes publics » (contre-budget 2027), octobre 2026, 24 p. (%s), lu en entier le 11/11/2026" % DOC_URL)
COI_CB = "auteur = le programme chiffré (parti candidat) ; le document dit ne pas chiffrer l'ensemble du programme ; montants non vérifiés"
IDS_RECETTES = ('R01a', 'R01b', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12')


def _lfi():
    chemin = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lfi', 'mesures.py')
    spec = importlib.util.spec_from_file_location('prog_lfi_pour_cb', chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_LFI = _lfi()

PROGRAMME = dict(_LFI.PROGRAMME, nom='LFI, contre-budget 2027 (sensibilité)', cle='lfi_cb',
                 calendrier=("Même calendrier que la colonne principale de LFI (premier exercice 2028, régime 2032). Les dépenses sont celles du budget annuel 2027 du document, lues comme permanentes dès 2028 ; "
                             "les recettes montent comme dans la colonne principale (mêmes lignes)."),
                 sources_chiffrage=SRC_CB)

PLEIN = [1.0, 1.0, 1.0, 1.0, 1.0]


def tri(b, c, h, **kw):
    d = {'forme': 'tri', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def cout_cb(id_, theme, lib, page, montant, cit):
    return dict(id=id_, theme=theme, chapitre=theme, libelle=lib, citation="%s [contre-budget, p. %s]" % (cit, page), lien=DOC_URL, sens='depense', levier='cout_unitaire',
                valeur=tri(0.95 * montant, montant, 1.15 * montant), annonce=montant, montee=PLEIN, facteur='cout', **{'lambda': 0.3},
                interpretation="Montant du document, lu comme coût annuel permanent à partir de 2028 (sans montée ni dérive) ; fourchette de la règle commune (0,9 à 1,3 fois).",
                hypotheses=[('H-LFICB-%s' % id_, "Montant du document : %s Md€ (page %s) ; fourchette 0,95 à 1,15 fois, élargie à 0,9-1,3 par la règle commune du banc v2." % (montant, page), SRC_CB, 'D', COI_CB)])


_DEPENSES = [
    ('B01', 'Relance par les revenus', "Hausse du point d'indice des fonctionnaires de 10 %", 8, 17.0, "« hausse du point d'indice de 10 % : 17 Md€ »"),
    ('B02', 'Relance par les revenus', "Indexation des pensions, allocations familiales et APL, rehaussées de 10 %", 8, 8.0, "« 8 Md€ »"),
    ('B03', 'Relance par les revenus', "Logement d'urgence et réquisition de logements vacants", 8, 3.0, "« 3 Md€ »"),
    ('B04', 'Relance par les revenus', "Garantie d'autonomie pour les jeunes (seuil de pauvreté, 1 337 € par mois)", 8, 9.5, "« 9,5 Md€ »"),
    ('B05', 'Services publics', "10 000 postes dans le primaire et le secondaire", 9, 0.5, "« 0,5 Md€ »"),
    ('B06', 'Services publics', "Gratuité de la cantine scolaire", 9, 3.6, "« 3,6 Md€ »"),
    ('B07', 'Services publics', "250 000 places à l'université", 10, 3.5, "« 3,5 Md€ »"),
    ('B08', 'Services publics', "Hôpital : +3 Md€ et au moins 10 000 postes de soignants", 10, 3.0, "« 3 Md€ »"),
    ('B09', 'Services publics', "Violences sexistes et sexuelles : budget des associations à 3 Md€ (2,6 Md€ de plus)", 10, 2.6, "« 2,6 Md€ »"),
    ('B10', 'Services publics', "Violences faites aux enfants", 10, 2.0, "« 2 Md€ »"),
    ('B11', 'Services publics', "Indexation sur l'inflation des budgets publics coupés depuis 2026", 10, 7.0, "« 7 Md€ »"),
    ('B12', 'Planification écologique', "Investissements climat et énergie", 11, 10.0, "« 10 Md€ »"),
    ('B13', 'Sécurité sociale', "Abrogation de la réforme Borne (retraite à 64 ans)", 11, 9.0, "« 9 Md€ »"),
    ('B14', 'Sécurité sociale', "Abrogation des réformes de l'assurance chômage", 12, 3.0, "« 3 Md€ »"),
]

MESURES = [dict(m) for m in _LFI.MESURES if m['id'] in IDS_RECETTES] + [cout_cb(*d) for d in _DEPENSES]

NON_CHIFFREES = ["SMIC à 1 700 € net (non chiffré dans le document, p. 9)", "blocage du prix à la pompe à 1,70 €/l par décret (non chiffré, p. 9)", "rénovation de 700 000 logements par an (non chiffré dans le texte, p. 10)",
                 "interruption de l'exonération de cotisations au-dessus de 2 SMIC (non chiffré, p. 14)", "pôle public bancaire : 100 Md€ d'investissements (hors budget de l'État, p. 6)",
                 "plafond du livret A à 30 000 € (30 à 40 Md€ de collecte supplémentaire, non budgétaire, p. 16)", "impôt sur le revenu à 14 tranches (colonne principale seulement)"]
