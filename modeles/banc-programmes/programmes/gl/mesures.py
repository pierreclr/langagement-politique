# -*- coding: utf-8 -*-
"""
Raphaël Glucksmann (Place publique, investi par le PS) pour 2027 : livret « Révolution écologique : les premiers 100 jours pour sortir des énergies fossiles » (24 p., présenté le 09/11/2026),
décrit comme fichier de mesures du banc d'essai. COLONNE DISTINCTE de celle du PS (programmes/ps : contre-budget 2027 du groupe socialiste, 16/09/2026).

CHIFFRAGE PARTIEL, À DIRE EN PREMIER : le livret ne couvre que la partie climat et énergie du projet ; une seconde partie (biodiversité, eau, agriculture, pêche, alimentation, pollutions, santé) est annoncée « dans quelques semaines »
(p. 6) et un « acte 2 » sur le quinquennat (p. 13, 22). Le livret ne donne que DEUX montants globaux : 200 Md€ d'argent public sur le quinquennat (p. 8) et 50 Md€ de contribution exceptionnelle sur les plus hauts patrimoines, une seule
année (p. 9). Le programme complet (« Acte Un », 88 p.) n'est pas chiffré. Cette colonne ne dit donc PAS ce que coûterait ou rapporterait le programme de Raphaël Glucksmann : elle dit ce que deviennent la dette et le déficit si seuls ces
deux montants sont appliqués, tout le reste du programme restant à 0. Un programme complet chiffré (retraites, impôts, santé…) pourrait aggraver ou améliorer le résultat.

Choix de lecture (⚠️ à relire) :
 - GL01 : les 200 Md€ sont lus comme de la dépense publique NOUVELLE, répartie sur les cinq budgets 2028-2032 (40 Md€ par an), puis arrêtée (le livret ne chiffre rien au-delà du quinquennat). Le texte n'écrit pas « en plus du droit actuel » ;
   une partie des 200 Md€ peut être de la dépense déjà prévue (hypothèse haute du coût). Le chèque énergie (5 Md€, p. 12) et la sécurité civile (1 Md€, p. 18) sont présentés comme emplois de ces 200 Md€ : ils ne sont pas ajoutés.
 - GL02 : la contribution exceptionnelle (50 Md€, une seule année, produit affecté à un fonds climat) est lue en 2028 et ne dure qu'un an ; le texte ne donne ni seuil, ni taux, ni assiette (« une infime minorité de foyers »).
Les mesures non chiffrées (taxe européenne sur les superprofits pétroliers, taxe sur les billets d'avion, livret de souveraineté écologique et sociale, grand emprunt européen, leasing social, pompes à chaleur à 1 €/jour, covoiturage,
Pass mobilité jeunes, moratoire sur les taxes de l'électricité, rénovation des écoles) valent zéro dans le banc, faute de montant : elles sont listées dans NON_CHIFFREES.
Format d'une mesure : voir moteur.py et README ; champs repris du PS : `theme`, `annonce`, `contrainte`. Loi `med` (moteur.quantile) : support bas-haut, MÉDIANE = notre estimation réalisable, haut = l'annonce (plafond).
Cotes (la charte de travail (CONTRIBUTING.md), règle 11) : D communication partisane (livret de campagne).
"""
LIVRET = 'https://glucks2027.fr/wp-content/uploads/2026/11/livret_progr_revolution_ecologique_2027.pdf'
SRC_GL = ("Place publique / campagne de Raphaël Glucksmann, « Révolution écologique : les premiers 100 jours pour sortir des énergies fossiles », livret de 24 p., présenté le 09/11/2026 (%s), "
          "lu en entier le 11/11/2026 (pp. 6, 8, 9, 12, 18)" % LIVRET)
COI_GL = "auteur = le programme chiffré (campagne électorale) ; aucun financement déclaré dans le livret ; montants non vérifiés"

PROGRAMME = {
    'nom': 'Glucksmann, Place publique (livret climat, chiffrage partiel)', 'cle': 'gl', 'debut': 2028, 'regime': 2032,
    'calendrier': ("Même calendrier que les autres programmes : premier exercice après l'élection de 2027 = 2028 ; quinquennat = 2028-2032 (cinq budgets). Les 200 Md€ d'argent public sont répartis à parts égales sur ces cinq années "
                   "puis arrêtés ; la contribution exceptionnelle tombe en 2028 et ne se répète pas (le livret dit « une seule année »). Aucun montant n'est donné pour 2033 et après : l'effet sur le solde de 2038 est donc nul "
                   "par construction, seule la dette garde la trace (200 − 50 Md€ de dette en plus, plus les intérêts)."),
    'sources_chiffrage': SRC_GL, 'macro': 'reference',
}

PLEIN = [1.0, 1.0, 1.0, 1.0, 1.0]
UNE_ANNEE = [1.0, 0.0, 0.0, 0.0, 0.0]


def tri(b, c, h, **kw):
    d = {'forme': 'tri', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


def med(b, c, h, **kw):
    d = {'forme': 'med', 'bas': b, 'central': c, 'haut': h}
    d.update(kw)
    return d


H_PARTIEL = ('H-GL-PARTIEL', "Le livret chiffre la partie climat seulement (deux montants : 200 Md€ sur le quinquennat, 50 Md€ une seule année) ; tout le reste du programme est lu comme nul. Le résultat de cette colonne est un chiffrage partiel, "
             "non le chiffrage du programme.", "livret, p. 6 (seconde partie annoncée) et p. 13, 22 (acte 2)", 'D', COI_GL)

MESURES = [
 dict(id='GL01', theme='Dépenses nouvelles', chapitre='Climat et énergie', libelle="Investissement public climat : 200 Md€ d'argent public sur le quinquennat (40 Md€ par an, 2028-2032)",
      citation="« Nous investirons, sur la durée du quinquennat, 200 milliards d'euros d'argent public. » [livret, p. 8] ; emplois cités p. 12-18 : chèque énergie (500 € pour 6 millions de familles, 200 € pour 10 millions, soit 5 Md€ : calcul de Claude), sécurité civile 1 Md€ (p. 18)",
      lien=LIVRET, sens='depense', levier='cout_unitaire', valeur=tri(0.95 * 40.0, 40.0, 1.15 * 40.0), annonce=40.0, montee=PLEIN, fin=2032, facteur='cout', **{'lambda': 0.3},
      interpretation="200 Md€ divisés en cinq budgets annuels égaux (rien n'est dit sur le profil) ; lus comme dépense nouvelle (hypothèse haute : le texte ne précise pas si une partie est déjà au budget actuel) ; arrêtés après 2032 (rien n'est chiffré au-delà). "
                     "Le livret dit que l'argent public « mobilisera les investissements » privés : cet effet d'entraînement, non chiffré, n'est pas compté. Fourchette : celle de la règle commune aux dépenses nouvelles (0,9 à 1,3 fois).",
      hypotheses=[('H-GL-GL01', "Montant annoncé : 200 Md€ sur le quinquennat, soit 40 Md€ par an (calcul de Claude, répartition égale) ; fourchette 0,95 à 1,15 fois (convention, sans source), élargie à 0,9-1,3 par la règle commune du banc v2.", SRC_GL, 'D', COI_GL),
                  ('H-GL-NOUVEAU', "Les 200 Md€ sont lus comme additionnels au droit actuel (⚠️ le livret ne le dit pas) : si une partie est déjà au budget, le coût est surestimé. Le chèque énergie (5 Md€) et la sécurité civile (1 Md€) sont inclus dans les 200 Md€ (p. 12), non ajoutés.", "livret, p. 8 et 12 ; lecture de Claude", 'D', 'sans objet'),
                  H_PARTIEL]),
 dict(id='GL02', theme='Recettes nouvelles', chapitre='Fiscalité du patrimoine', libelle="Contribution exceptionnelle pour l'investissement climatique sur les plus hauts patrimoines : 50 Md€, une seule année (fonds dédié)",
      citation="« Cette contribution concernera une infime minorité de foyers, tout en haut de l'échelle des patrimoines, et rapportera 50 milliards d'euros. […] une recette exceptionnelle, une seule année » [livret, p. 9]",
      lien=LIVRET, sens='recette', levier='cout_unitaire', valeur=med(0.0, 5.0, 50.0), annonce=50.0, montee=UNE_ANNEE, fin=2028, facteur='cout', **{'lambda': 0.5},
      interpretation="Ni seuil, ni taux, ni assiette dans le livret : le montant est une annonce, pas un mécanisme. Ordre de grandeur (⚠️ calcul de coin de table) : l'assiette des foyers de plus de 100 M€ de patrimoine (de l'ordre de 1 800 foyers pour 735 M€ en moyenne dans notre module de patrimoine, soit environ 1 300 Md€) "
                     "supposerait un prélèvement d'environ 3,8 % de cette assiette en une fois, avant érosion et exil. Une contribution unique sur le patrimoine n'a pas de précédent récent en France ; le Conseil constitutionnel a censuré en 2012 la taxe à 75 % sur les revenus au nom de l'égalité devant les charges publiques (⚠️ décision relue ailleurs, non relue ici). "
                     "Score de faisabilité (règle commune, voir faisabilite.py) : M 0, J 0, E 0 : médiane à 10 % de l'annonce, soit 5 Md€.",
      contrainte="Conseil constitutionnel : égalité devant les charges publiques, caractère confiscatoire, rétroactivité ; mobilité des contribuables.",
      hypotheses=[('H-GL-GL02', "Montant annoncé : 50 Md€, une seule année. Fourchette retenue par la règle commune du banc v2 (score 0) : plancher 0, médiane 5, plafond 25 Md€ ; en v1 : plancher 0, médiane 5, plafond 50 Md€.", SRC_GL, 'D', COI_GL), H_PARTIEL]),
]

NON_CHIFFREES = ["taxe européenne sur les superprofits pétroliers et gaziers (proposition ; aucun montant ; unanimité européenne probable)",
                 "fin des exonérations sur le carburant des vols intérieurs et hausse de la taxe sur les billets d'avion (aucun montant)",
                 "doublement du plafond du livret A, livret fusionné avec le LDDS en « Livret de souveraineté écologique et sociale » à 2,5 % (aucun montant ; effet sur le déficit non établi)",
                 "grand emprunt européen pour la transition (aucun montant ; hors budget national)",
                 "leasing social (1 million de véhicules électriques sur 5 ans à 100 €/mois), pompes à chaleur (1 million à 1 €/jour), 5 000 lignes de covoiturage, Pass mobilité durable jeunes à 1 €/jour (aucun montant ; probablement inclus dans les 200 Md€)",
                 "moratoire sur les hausses de taxes sur l'électricité, prix qui ne progresse pas plus vite que l'inflation (aucun montant)",
                 "rénovation de 4 000 écoles primaires par an et plus de 2 800 collèges et lycées (aucun montant)",
                 "chèque énergie de 500 € (6 millions de familles) et 200 € (10 millions) : 5 Md€ par calcul de Claude, inclus dans les 200 Md€ (non ajouté)",
                 "sécurité civile : 1 Md€ d'investissement dès juin 2027 (inclus dans les 200 Md€, non ajouté)",
                 "toute la seconde partie du projet écologique (biodiversité, eau, agriculture, pêche, alimentation, pollutions, santé) et le programme « Acte Un » de 88 p. (pas de chiffrage)",
                 "objectifs sans montant : stabilisation de la dette à l'horizon 2032 (p. 8), neutralité carbone 2050, doublement des capacités renouvelables d'ici 2035"]
