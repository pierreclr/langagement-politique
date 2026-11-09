# -*- coding: utf-8 -*-
"""
Parti socialiste et Place publique pour 2027 (candidat : Raphaël Glucksmann, vainqueur de la primaire du 11/10/2026), décrit comme fichier de mesures du banc d'essai.
Document chiffré disponible : le **contre-budget 2027 du groupe Socialistes et apparentés à l'Assemblée nationale**, présenté le 16/09/2026 (conférence de presse ; Boris Vallaud, président du groupe, soutient Raphaël Glucksmann).
Ce n'est PAS le programme présidentiel du candidat : Raphaël Glucksmann n'a publié, au 09/11/2026, aucun programme chiffré d'ensemble (premières lignes d'un document d'environ 90 pages, sans montants ;
voir sources/chiffrage-programme-ps-2027.md § 1). Le contre-budget est le seul document chiffré de ce camp ; il est lu ici comme sa base budgétaire, ce qui est une hypothèse (H-PS-PERIMETRE).
Le document original du groupe n'a pas été trouvé en ligne (ni PDF, ni page du groupe) : les montants sont ceux que rapporte la presse le 16 et le 17/09/2026 (LCP, Selectra, Investir Mag, Moneyvox),
qui ne concordent pas toujours entre eux (écarts nommés ligne par ligne). ⚠️ À VÉRIFIER dans le document du groupe (V-PS-01).
Format d'une mesure : voir moteur.py et README. Champs repris du RN : `theme`, `annonce` (montant annoncé, Md€ par an ; positif = amélioration du solde pour une recette ou une économie, coût pour une dépense),
`contrainte` (obstacle juridique ou pratique nommé). Loi `med` (moteur.quantile) : support bas-haut, MÉDIANE = notre estimation réalisable, haut = l'annonce (plafond), même convention que pour le RN.
Cotes (la charte de travail (CONTRIBUTING.md), règle 11) : A statistique publique, texte officiel, revue à comité de lecture ; B institution reconnue, organisme international ; C presse, think tank, rapport d'acteur ; D communication partisane.
"""
import importlib.util
import os

LCP = 'https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils'
SELECTRA = 'https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic'
INVESTIR = 'https://www.investirmag.fr/contre-budget-socialiste-smic-a-1-700-eur-csg-progressive-taxe-zucman/'
MONEYVOX = 'https://www.moneyvox.fr/impot/actualites/110407/budget-2027-les-socialistes-presentent-leur-contre-projet-et-entretiennent-le-flou-sur-la-censure'

SRC_PS = ("Groupe Socialistes et apparentés (Assemblée nationale), contre-budget 2027 présenté le 16/09/2026, montants rapportés par LCP (16/09/2026, mis à jour le 12/10/2026, %s), Selectra (17/09/2026, %s), "
          "Investir Mag (16/09/2026, %s) et Moneyvox (16/09/2026, %s), consultés le 09/11/2026 ; document du groupe non trouvé (⚠️ V-PS-01)" % (LCP, SELECTRA, INVESTIR, MONEYVOX))
COI_PS = "auteur = le programme chiffré (groupe parlementaire d'opposition) ; montants relayés par la presse sans validation indépendante"

PROGRAMME = {
    'nom': 'PS et Place publique (contre-budget 2027)', 'cle': 'ps', 'debut': 2028, 'regime': 2032,
    'calendrier': ("Même calendrier que LFI et le RN : premier exercice après l'élection de 2027 = 2028 ; régime en 2032. Le contre-budget est un budget annuel pour 2027 : ses mesures sont lues comme "
                   "permanentes, en euros constants, à plein effet dès 2028 (H-PS-PERMANENCE) ; le Smic monte en un an."),
    'sources_chiffrage': SRC_PS, 'macro': 'reference',
}

PLEIN = [1.0, 1.0, 1.0, 1.0, 1.0]


def tri(b, c, h, **kw):
    d = {'forme': 'tri', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def med(b, c, h, **kw):
    d = {'forme': 'med', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def eco(id_, theme, chap, lib, cit, annonce, bas, c, haut, interp, contrainte, hyps=(), lien=SELECTRA, lam=0.5, facteur='cout'):
    """Recette ou économie annoncée : montant du PS = plafond (haut) ; médiane = ce qui est réalisable selon nos hypothèses (contrainte nommée)."""
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='recette', levier='cout_unitaire', valeur=med(bas, c, haut), annonce=annonce, montee=PLEIN,
                facteur=facteur, **{'lambda': lam}, interpretation=interp, contrainte=contrainte,
                hypotheses=[('H-PS-%s' % id_, "Montant annoncé : %s Md€. Fourchette retenue : plancher %s, médiane %s, plafond %s Md€ (convention : la médiane est notre estimation réalisable)." % (annonce, bas, c, haut), SRC_PS, 'D', COI_PS)] + list(hyps))


def cout_ps(id_, theme, chap, lib, cit, m, interp='', bas=0.95, haut=1.15, hyps=(), lam=0.3, lien=SELECTRA):
    """Dépense nouvelle chiffrée par le PS seul : coût certain une fois votée ; valeur centrale = montant du PS, fourchette 0,95 à 1,15 fois (même convention que pour le RN, sans source)."""
    return dict(id=id_, theme=theme, chapitre=chap, libelle=lib, citation=cit, lien=lien, sens='depense', levier='cout_unitaire', valeur=tri(bas * m, m, haut * m), annonce=m, montee=PLEIN,
                facteur='cout', **{'lambda': lam}, interpretation=interp,
                hypotheses=[('H-PS-%s' % id_, "Montant du PS : %s Md€ ; fourchette %s à %s fois (convention, sans source)." % (m, bas, haut), SRC_PS, 'D', COI_PS)] + list(hyps))


def _smic_lfi():
    """Paramètres du Smic de LFI (programmes/lfi/mesures.py, S01) : mêmes salaires, même grille OpenFisca, mêmes élasticités ; seule la hausse diffère (même méthode pour les deux programmes)."""
    chemin = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lfi', 'mesures.py')
    spec = importlib.util.spec_from_file_location('prog_lfi_pour_ps', chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    s01 = [m for m in mod.MESURES if m['id'] == 'S01'][0]
    return dict(s01['parametres'])


P_SMIC = _smic_lfi()
P_SMIC['hausse'] = med(0.058, 0.081, 0.178)

H_PERIMETRE = ('H-PS-PERIMETRE', "Le contre-budget 2027 du groupe socialiste est lu comme la base budgétaire du candidat Raphaël Glucksmann (Place publique, investi par le PS après la primaire du 11/10/2026). Hypothèse : le candidat peut s'en écarter (il n'a publié aucun chiffrage propre au 09/11/2026).", "LCP, 11/10/2026 (victoire à la primaire) ; Public Sénat, 2026 (Boris Vallaud soutien de R. Glucksmann) ; sources/discours-candidats-2027.csv", 'C', 'aucun connu')
H_PERMANENCE = ('H-PS-PERMANENCE', "Mesures d'un budget annuel lues comme permanentes et constantes en part du PIB de 2028 à 2058 (euros constants), à plein effet dès 2028. Le PS annonce une trajectoire de réduction des déficits « sur plusieurs années » sans la chiffrer.", "estimation de Claude ; LCP, 16/09/2026", 'D', 'sans objet')

MESURES = [
 # ------------------------------------------------------------------ Recettes nouvelles (39,5 Md€ annoncés ; 39 Md€ détaillés par LCP, 35 par Selectra)
 dict(id='PS01', theme='Recettes nouvelles', chapitre='Fiscalité du patrimoine', libelle="Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF", citation="« Taxe Zucman […] : 15 milliards » (Selectra, LCP) ; « 10 milliards » (Investir Mag)", lien=LCP,
      sens='recette', levier='zucman', parametres={}, annonce=15.0, montee=PLEIN, facteur='comportement', **{'lambda': 0.9},
      interpretation="Branché sur notre module de patrimoine (modeles/systeme-ideal/grandes_fortunes_0511.js, fonction zucmanSurDroitActuel, exportée par js/pont_systeme.js dans le cache `zucman_droit_actuel`) : impôt minimal de 2 % au-dessus de 100 M€ appliqué au droit actuel (pas d'ISF), net de l'impôt déjà payé, avec érosion de l'assiette et exil ; scénarios favorable / central / défavorable lus comme centiles 10 / 50 / 90 sur le facteur commun « comportement ». Ce n'est pas la ligne R04 de LFI (complément au-dessus d'un ISF rétabli). Montant annoncé : 15 Md€ (LCP, Selectra) ou 10 (Investir Mag) ; Gabriel Zucman 15 à 25 ; Institut de l'entreprise 5,5 (cote C, patronal, cité au banc pour LFI).",
      contrainte="Conseil constitutionnel : risque de caractère confiscatoire si l'impôt total dépasse les revenus du patrimoine (jurisprudence sur l'ISF, non relue ici ⚠️) ; mobilité des contribuables.",
      hypotheses=[('HG03-HG08', "1 800 foyers de plus de 100 M€, patrimoine moyen 735 M€ ; érosion et exil du module : recette nette 12,3 / 5,8 / 0,8 Md€ (favorable / central / défavorable).", "modeles/systeme-ideal/grandes_fortunes_0511.js ; donnees/cache/systeme.json (zucman_droit_actuel)", 'B', 'modèle du dépôt, écrit par une IA ; conflit d\'intérêts déclaré'),
                  ('H-PS-PS01', "Montant annoncé : 15 Md€ (10 selon Investir Mag).", SRC_PS, 'D', COI_PS), H_PERIMETRE]),
 eco('PS02', 'Recettes nouvelles', 'Successions', "CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés)", "« CSG sur les gros héritages […] : 10 milliards » (Selectra, LCP)",
     10.0, 2.0, 5.0, 10.0,
     "Barème et seuil non publiés ; la presse indique que seuls les 10 % des héritiers les plus aisés seraient concernés. Base : droits de mutation à titre gratuit actuels de 20,8 Md€ (2024) ; 10 Md€ de plus = +48 %. Médiane 5 Md€ : notre module de transmissions (transmissions_0611.js) perd environ la moitié de la recette statique du scénario favorable au central sous l'effet de la planification (assurance-vie, démembrement, donations anticipées) et de l'exil des patrimoines mobiles (plat35 : 32,1 au favorable, 15,7 au central, cache systeme.json) : même proportion appliquée ici (⚠️ transposition, le module ne simule pas une CSG sur le cumul reçu).",
     "Planification et contournement ; une CSG sur un capital reçu est une nouveauté juridique (qualification d'imposition de toute nature, égalité devant les charges publiques) ⚠️.",
     hyps=[('H-DMTG', "Droits de mutation à titre gratuit : 15 907 M€ (successions) + 4 912 M€ (donations) = 20,8 Md€ en 2024.", "sources/donnees/impots_inventaire.csv (lignes 19 et 20, DGFiP via Insee)", 'A', 'aucun')], facteur='comportement', lam=0.6),
 eco('PS03', 'Recettes nouvelles', 'Numérique', "Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques)", "« taxe sur les géants du numérique : 10 milliards » (Selectra, LCP)",
     10.0, 0.5, 2.0, 10.0,
     "Taux et assiette non publiés. La taxe sur les services numériques (3 % de certains chiffres d'affaires) rapporte de l'ordre de 0,7 à 0,8 Md€ par an (⚠️ ordre de grandeur non relu en primaire) : 10 Md€ supposeraient de multiplier son produit par plus de dix (taux de l'ordre de 30 % ou assiette très élargie). Médiane 2 Md€ (taux relevé à 10-15 %, report partiel sur les clients français) ; LFI annonce 3,9 Md€ pour une mesure voisine (R08 du banc).",
     "Représailles commerciales des États-Unis (enquête de la section 301 en 2019-2020 sur la taxe française) ; report sur les annonceurs et vendeurs français ; droit de l'UE (liberté d'établissement) ⚠️.",
     facteur='comportement', lam=0.5),
 eco('PS04', 'Recettes nouvelles', 'Cotisations', "Révision des exonérations de cotisations sociales (« niches » sociales)", "« niches sur les cotisations retravaillées : 4 milliards supplémentaires » (LCP)",
     4.0, 1.5, 3.0, 4.0, "Lecture : recentrage des allègements généraux au-dessus de 1,6 ou 2 Smic. Interaction avec le Smic (PS09) : non modélisée (les deux lignes touchent les allègements).", "Effet sur l'emploi des salaires intermédiaires (non modélisé) ; interaction avec PS09.", lien=LCP, lam=0.3),
 # ------------------------------------------------------------------ Économies (17,5 Md€ annoncés ; 15,1 détaillés par Selectra)
 eco('PS05', 'Économies', 'Dépenses fiscales', "Réforme des niches fiscales", "« niches fiscales : 4 milliards » (Selectra)", 4.0, 1.0, 2.5, 4.0,
     "Niches non nommées dans la presse lue. Médiane 2,5 : les suppressions de niches votées en loi de finances rapportent souvent moins que prévu (comportements, reports).", "Niches non désignées ; risque de rendement inférieur.", lam=0.4),
 eco('PS06', 'Économies', 'Santé', "Économies sur les marges dans les dépenses de santé", "« marges des dépenses de santé : 4 milliards » (Selectra)", 4.0, 0.5, 1.5, 4.0,
     "Lecture : baisse des marges des fournisseurs (médicaments, dispositifs médicaux, laboratoires). Même médiane relative que la ligne H01 du RN (coûts hospitaliers : 2,0 sur 8,3).", "Négociations conventionnelles ; pénuries possibles sur les produits à faible marge.", lam=0.5),
 eco('PS07', 'Économies', 'État', "Économies de fonctionnement de l'État", "« fonctionnement de l'État : 3,6 milliards » (Selectra)", 3.6, 1.0, 2.5, 3.6,
     "Effort de fonctionnement d'un an ; lu comme permanent.", "Aucune contrainte juridique ; exécution.", lam=0.4),
 eco('PS08a', 'Économies', 'Fraude', "Lutte contre la fraude fiscale", "« fraude fiscale : 2,4 milliards » (Selectra) ; « 5,5 milliards » fraude comprise (Investir Mag)", 2.4, 0.3, 1.0, 2.4,
     "Même médiane relative que la ligne H02 du RN (fraude) : les recettes de la lutte contre la fraude sont incertaines et lentes.", "Recouvrement effectif bien inférieur aux montants notifiés (Cour des comptes, non relue ici ⚠️).", lam=0.5),
 eco('PS08b', 'Économies', 'Fraude', "Lutte contre le travail dissimulé", "« travail dissimulé : 1,1 milliard » (Selectra)", 1.1, 0.1, 0.4, 1.1, "Idem PS08a.", "Idem PS08a.", lam=0.5),
 eco('PS08c', 'Économies', 'Non détaillé', "Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés)", "« environ 17,5 milliards d'économies et de lutte contre la fraude » (Selectra)", 2.4, 0.0, 0.5, 2.4,
     "Écart entre le total annoncé et la somme des lignes rapportées ; Investir Mag donne 12,1 Md€ (niches et fraude) : la presse ne concorde pas.", "Non détaillé.", lam=0.4),
 # ------------------------------------------------------------------ Baisses d'impôts et dépenses nouvelles
 dict(id='PS09', theme='Pouvoir d\'achat', chapitre='Salaires', libelle="Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé)", citation="« porter le Smic à 1 700 € nets par mois » (Selectra, Investir Mag ; aucun coût publié)", lien=SELECTRA,
      sens='depense', levier='smic', parametres=P_SMIC, annonce=0.0, montee=[0.8, 1.0, 1.0, 1.0, 1.0],
      interpretation="Branché sur le même levier que la ligne S01 de LFI (leviers2.py : salaires lognormaux, allègements, grille OpenFisca-France), avec les mêmes paramètres sauf la hausse. Lecture : le Smic net atteint 1 700 € grâce à la CSG progressive (PS10 : environ +130 € net au Smic) et à une hausse du Smic brut : (1 700 − 1 443 − 130) / (1 443 + 130) = +8,1 % (médiane) ; bas +5,8 % (Smic de 1 477 € net en 2027 selon Investir Mag) ; haut +17,8 % (si les 1 700 € s'entendent hors effet de la CSG, comme pour LFI). Le PS ne publie ni calendrier ni coût ; « conférence sociale sur les salaires » : lu comme une hausse par décret. Interaction avec PS10 (le gain de CSG n'est pas recompté ici) : approximation.",
      contrainte="Coût du travail au Smic (emploi) ; indexation des allègements.",
      hypotheses=[('H-SMIC-PS', "Hausse du Smic brut : médiane +8,1 %, de +5,8 % à +17,8 % ; autres paramètres : ceux de S01 (LFI), hypothèses H-SMIC-1 à H-SMIC-6.", "programmes/lfi/mesures.py (S01) ; estimation de Claude pour la hausse", 'D', 'sans objet'), H_PERIMETRE]),
 dict(id='PS10', theme='Pouvoir d\'achat', chapitre='CSG', libelle="CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net)", citation="« une baisse […] de 10 milliards » ; « 21 millions de travailleurs » (Selectra) ; 130 € par mois au Smic (LCP)", lien=SELECTRA,
      sens='depense', levier='cout_unitaire', valeur=tri(9.0, 12.0, 17.0), annonce=10.0, montee=PLEIN, facteur='cout', **{'lambda': 0.3},
      interpretation="Coût annoncé : 10 Md€ pour 21 millions de bénéficiaires, soit 40 € par mois en moyenne. Recoupement de Claude (⚠️ calcul de coin de table, pas OpenFisca) : gain de 130 € par mois au Smic, décroissant jusqu'à 0 à 2 700 € net ; au salaire médian à temps plein (environ 2 100 € net) le gain est d'environ 60 € ; une moyenne de 50 à 65 € sur 21 millions donne 13 à 16 Md€, moins le surcroît d'impôt sur le revenu (la CSG est en partie déductible) : 12 Md€ central, de 9 à 17. À refaire avec OpenFisca-France (T-PS-1).",
      hypotheses=[('H-PS-PS10', "Coût du PS : 10 Md€ ; 21 M de bénéficiaires ; 130 € par mois au Smic pour une personne seule.", SRC_PS, 'D', COI_PS),
                  ('H-CSG-PS', "Central 12 Md€ (9 à 17) : estimation de Claude par interpolation linéaire du gain entre 1 443 et 2 700 € net, salaire médian net à temps plein d'environ 2 100 € (Insee, ordre de grandeur, ⚠️ non relu).", 'estimation de Claude', 'D', 'sans objet')]),
 cout_ps('PS11', 'Dépenses nouvelles', 'Climat', "Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités)", "« 10 milliards pour le climat, dont 5 milliards pour un fonds de sécurité climatique » (Selectra)", 10.0, lien=SELECTRA),
 cout_ps('PS12', 'Dépenses nouvelles', 'Santé', "Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€)", "« accès aux soins : 5 milliards » (Selectra) ; LCP : 3 Md€ pour l'hôpital et les Ehpad", 5.0),
 cout_ps('PS13', 'Dépenses nouvelles', 'Justice', "Loi intégrale contre les violences sexistes et sexuelles", "« loi intégrale […] : 3 milliards » (Selectra, Investir Mag, Moneyvox)", 3.0),
 cout_ps('PS14', 'Dépenses nouvelles', 'Agriculture', "Soutien aux agriculteurs", "« agriculteurs : 2 milliards » (Selectra)", 2.0),
 cout_ps('PS15', 'Dépenses nouvelles', 'École', "École", "« école : 2 milliards » (Selectra, Investir Mag)", 2.0),
]

NON_CHIFFREES = ["conférence sociale sur les salaires et réouverture des négociations de branche (aucun montant)", "1 Md€ pour la sécurité civile (Investir Mag ; peut-être inclus dans le climat)",
                 "écart entre 39,5 Md€ de recettes annoncées et 39 Md€ détaillés (0,5 Md€ non retrouvé)", "fonds européen de défense de 500 Md€ financé par emprunt commun (programme de R. Glucksmann ; hors budget national)",
                 "plan d'investissement de 100 Md€ sur dix ans prêté au candidat par des sites tiers (non confirmé en source primaire)", "réduction du déficit annoncée : 24 Md€ en 2027, soit 0,8 point de PIB (le banc la recalcule)"]
