#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère registre-anomalies/LISTE-PUBLIABLE.md : la liste lisible des impasses du droit (T55, demande de l’auteur du 06/11/2026).

Usage (depuis la racine du dépôt) :  python3 -I outils/droit/liste_publiable.py
Lit les fiches ANxxx.md (via registre.py), ne modifie aucune fiche. Bibliothèque standard seulement.
Règles : seules les fiches « anomalie » au statut « vérifiée sur le texte » (ou « relue par un juriste ») entrent dans la liste
principale ; les fiches « détectée » vont dans une annexe « non vérifiées » ; les choix politiques et les écartées sont comptés, pas listés.
"""
from __future__ import annotations

import re
import sys
from collections import Counter, OrderedDict
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import registre as R  # noqa: E402

SORTIE = RACINE / "registre-anomalies" / "LISTE-PUBLIABLE.md"
FORTS = ("vérifiée sur le texte", "relue par un juriste")

# Type (vocabulaire du lecteur) : ce que c'est, pourquoi c'est une impasse (langage simple), traitement type dans le système proposé.
TYPES = OrderedDict([
    ("renvoi mort", ("Renvoi vers un article abrogé ou disparu",
        "Un article de loi dit « voyez l'article X ». Mais l'article X a été supprimé ou a changé de numéro. Le lecteur cherche la règle et ne la trouve plus : il doit deviner, ou demander à un spécialiste.",
        "recodification : on regroupe les règles dans un texte unique et les renvois sont recalculés par programme à chaque modification")),
    ("renvoi circulaire", ("Boucle de renvois",
        "Deux articles se définissent l'un par l'autre : A dit « voir B » et B dit « voir A ». Aucun des deux ne donne la règle.",
        "recodification : une seule définition, à un seul endroit")),
    ("contradiction", ("Contradiction entre textes",
        "Deux textes (ou deux endroits du même texte) disent des choses différentes sur le même sujet, sans dire lequel l'emporte. Chacun peut avoir raison selon qui lit.",
        "une règle unique par sujet ; en cas de conflit, la règle la plus récente et la plus simple remplace l'autre")),
    ("seuil absurde", ("Effet de seuil absurde",
        "Un euro de plus (ou un jour de plus) fait basculer d'une règle à une autre, avec un saut brutal : 0 d'impôt d'un côté, des centaines d'euros de l'autre. La règle ne dit pas pourquoi le saut est si grand.",
        "lissage : le montant monte progressivement au lieu de sauter")),
    ("taux marginal > 100 %", ("Taux marginal supérieur à 100 %",
        "Quand on gagne un peu plus, on perd plus que le gain en aides : on travaille plus et on a moins. Chaque aide se calcule avec ses propres règles, et personne n'a regardé leur effet cumulé.",
        "base de ressources commune et dégressivité unique pour les aides (barème à deux fonctions), avec un plafond de taux marginal effectif")),
    ("décret d'application non repéré", ("Règle inapplicable faute de décret",
        "La loi dit « un décret précisera comment l'appliquer ». Dans le texte codifié, on ne retrouve aucun décret : sans lui, la règle ne dit pas comment s'appliquer (un décret hors code peut exister).",
        "règle supprimée si elle ne sert plus, sinon complétée par le texte d'application, publié avec la règle")),
    ("échéance sans règle transitoire", ("Échéance sans règle de passage",
        "Une règle s'arrête (ou une nouvelle commence) à une date, mais aucun texte ne dit ce qui se passe pour les situations en cours à cette date.",
        "toute date de bascule s'accompagne de sa règle de passage, écrite dans le même texte")),
    ("incohérence de dates", ("Incohérence de dates ou de calendrier",
        "Les dates ne s'enchaînent pas : une règle s'applique avant d'être publiée, ou un délai fixé n'est pas tenu. Le lecteur ne sait plus quelle règle valait à quelle date.",
        "un seul calendrier par réforme, publié d'un bloc")),
    ("montant figé", ("Montant figé depuis des années",
        "Un montant écrit en euros dans la loi n'a pas bougé depuis des années pendant que les prix montaient. La règle perd sa raison d'être sans que personne ne l'ait décidé.",
        "indexation automatique sur une référence publique (prix ou salaires)")),
    ("montant en francs", ("Montant resté en francs",
        "Le texte parle encore de francs, vingt ans après l'euro. La conversion est exacte, mais le texte n'a jamais été mis à jour.",
        "toilettage : montants convertis ou règle supprimée")),
    ("règle dupliquée", ("Règle écrite plusieurs fois",
        "La même règle est recopiée à plusieurs endroits avec de petites différences. On ne sait pas si les différences sont voulues, et si l'on en change une, les autres ne suivent pas.",
        "une règle, un endroit, des renvois automatiques")),
    ("définition absente", ("Notion jamais définie",
        "Le texte utilise un mot (« activité », « ressources », « résidence »…) qui conditionne un droit ou une obligation, mais ne dit nulle part ce qu'il recouvre. Le sens dépend de ce que décide ensuite l'administration ou le juge.",
        "définition écrite une fois, dans un glossaire légal commun")),
    ("rédaction défectueuse", ("Rédaction défectueuse",
        "Le texte contient une erreur de rédaction (mot manquant, renvoi à la mauvaise subdivision, phrase qui se contredit). Son sens se devine, mais il n'est pas sûr.",
        "correction de forme lors du toilettage du code")),
    ("effet pervers (incitation)", ("Effet pervers (la règle pousse à l'inverse de son but)",
        "La règle crée un intérêt à faire le contraire de ce qu'elle veut : par exemple retarder une démarche pour payer moins.",
        "simplification de la règle pour que l'intérêt individuel rejoigne le but affiché")),
    ("complexité excessive", ("Complexité excessive",
        "La règle est écrite de façon si enchevêtrée qu'il faut un spécialiste pour la lire, alors qu'elle concerne beaucoup de monde.",
        "réécriture simple ; si la règle ne sert pas un objectif clair, suppression")),
    ("déconnexion du gain réel", ("Règle déconnectée du gain réel",
        "La règle taxe ou protège un montant qui n'a plus de rapport avec ce que la personne gagne vraiment.",
        "règle recalée sur le gain réel")),
])
ORDRE_TYPES = list(TYPES.keys())
# Types du lecteur absents de la typologie des fiches : cherchés par numéro de fiche (retards de transposition européenne)
SURCLASSEMENT = {"AN500": ("Retard de transposition européenne", "Une directive européenne fixe une date limite pour être reprise dans le droit français. La France a notifié ses mesures plus de vingt mois après la date, et plusieurs mesures citées sont antérieures à la directive : le calendrier est soit impossible, soit mal documenté.",
                           "transposition suivie par un calendrier public et un contrôle de coordination à chaque directive"),
                 "AN501": ("Retard de transposition européenne", "Même mécanisme que pour NIS2 : la date limite européenne est dépassée de plus de vingt mois, et la quasi-totalité des mesures nationales datent d'avant la directive.",
                           "transposition suivie par un calendrier public et un contrôle de coordination à chaque directive")}
TYPES_AJOUT = ["Retard de transposition européenne"]

# Domaine d'après l'intitulé du texte cité
DOMAINES = [
    ("Fiscalité", ("cgi", "code général des impôts", "cibs", "impositions sur les biens", "lpf", "livre des procédures fiscales", "loi n° 2025-127", "douanes")),
    ("Protection sociale (Sécu, aides, retraites)", ("sécurité sociale", "css", "action sociale", "casf", "pensions civiles")),
    ("Travail et emploi", ("code du travail",)),
    ("Logement et construction", ("cch", "construction et de l'habitation", "loi n° 89-462", "elan")),
    ("Fonction publique", ("fonction publique",)),
    ("Collectivités territoriales", ("cgct", "collectivités territoriales")),
    ("Environnement et énergie", ("environnement", "énergie")),
    ("Éducation et sport", ("éducation", "sport")),
    ("Droit civil, commerce, finance", ("code civil", "commerce", "assurances", "monétaire", "consommation")),
    ("Santé, immigration, sécurité, transports et autres", ()),
]

TRAITEMENT_DOMAINE = {
    "Fiscalité": "Orientation du système proposé : un barème à deux fonctions (revenus, patrimoine) et la suppression de la plupart des niches ; la règle est soit supprimée avec sa niche, soit réécrite dans le barème (voir `sources/bareme-deux-fonctions-v7.md`).",
    "Protection sociale (Sécu, aides, retraites)": "Orientation du système proposé : un socle universel, une base de ressources commune à toutes les aides et la Sécu regroupée (arbitrage 49 du 06/11/2026) ; la règle est simplifiée ou fondue dans ce socle.",
    "Travail et emploi": "Orientation du système proposé : une loi du travail courte à la place du code et des conventions de branche ; la règle est reprise, simplifiée ou supprimée dans cette loi.",
    "Logement et construction": "Pas d'arbitrage détaillé à ce jour sur ce domaine : correction de coordination proposée (colonne « Correction ») ; à placer dans la refonte du logement.",
    "Fonction publique": "Orientation du système proposé : statut unique public-privé (position du 06/11/2026) ; la règle est reprise dans le statut commun ou supprimée.",
}

MOTS = lambda s: re.sub(r"\s+", " ", s).strip()


def domaine(f):
    a = (f["meta"]["article"][0] + " " + f["meta"]["titre"][0]).lower()
    art = f["meta"]["article"][0].lower()
    for nom, cles in DOMAINES:
        if any(c in art for c in cles):
            return nom
    for nom, cles in DOMAINES:
        if any(c in a for c in cles):
            return nom
    return DOMAINES[-1][0]


def couper(t, n):
    t = MOTS(t)
    if len(t) <= n:
        return t
    cut = t[:n]
    k = max(cut.rfind(". "), cut.rfind("; "))
    if k > n * 0.5:
        return cut[:k + 1] + " […]"
    return cut.rsplit(" ", 1)[0] + " […]"


def premier_bloc(t):
    return t.split("\n\n")[0] if t else ""


def verdict(f):
    for k, t in f["sections"].items():
        if k.startswith("Contre-v"):
            m = re.search(r"Verdict : \*{0,2}([^*\n]*?)\*{0,2}[.\n]", t + "\n")
            if m:
                return m.group(1).strip().rstrip(".")
            return "contre-vérifiée"
    return None


def confiance(f):
    v = verdict(f)
    if v:
        return "contre-vérifiée le 04/11/2026 : « %s »" % couper(v, 70)
    return "citations relues par script sur le texte local ; pas de contre-vérification adversariale"


def type_de(f):
    i = f["meta"]["id"][0]
    if i in SURCLASSEMENT:
        return SURCLASSEMENT[i][0]
    return TYPES.get(f["meta"]["categorie"][0], (f["meta"]["categorie"][0], "", ""))[0]


def pourquoi(f):
    i = f["meta"]["id"][0]
    if i in EN_CLAIR:
        return EN_CLAIR[i]
    if i in SURCLASSEMENT:
        return SURCLASSEMENT[i][1]
    return TYPES[f["meta"]["categorie"][0]][1]


def sort_systeme(f, dom):
    i = f["meta"]["id"][0]
    cat = f["meta"]["categorie"][0]
    return SURCLASSEMENT[i][2] if i in SURCLASSEMENT else TYPES[cat][2]


# Textes « en clair » rédigés à la main pour les anomalies les plus parlantes (faits tirés des fiches ; rien d'ajouté)
EN_CLAIR = {
    "AN019": "L'impôt sur les grosses plus-values immobilières monte par paliers, et le premier palier est mal réglé : à 50 000 € de plus-value on ne paie rien de cette surtaxe, à 50 001 € on en paie 500. C'est comme un péage à 0 € qui passe à 500 € pour un mètre de plus. Les autres paliers sont lissés ; seul le premier saute.",
    "AN020": "Au bout de cinq ans, le vendeur d'un bien peut ajouter 15 % au prix d'achat pour « travaux », sans rien prouver, mais pas un jour avant. Vendre le lendemain du cinquième anniversaire plutôt que la veille fait baisser l'impôt de l'exemple de 29 605 € à 11 765 €. La loi récompense la patience du calendrier, pas la réalité des travaux.",
    "AN028": "Plusieurs aides (RSA, prime d'activité, aide au logement) se retirent chacune selon sa règle quand le salaire monte. Pour certaines familles, leur effet cumulé dépasse le gain de salaire : 50 € de salaire brut en plus, et 6 € de revenu en moins. Aucun texte ne regarde l'ensemble.",
    "AN031": "Même mécanisme pour une personne seule locataire qui travaille à temps partiel : trois aides se retirent en même temps, et pour 100 € gagnés en plus elle en perd jusqu'à 110. Travailler plus ne paie pas.",
    "AN029": "L'allocation de rentrée scolaire différentielle s'éteint euro pour euro, et se cumule avec d'autres pertes : sur une plage d'environ 900 € de revenu, chaque euro gagné coûte jusqu'à 1,34 € de prestations.",
    "AN112": "Le complément familial a un montant plus élevé pour les familles modestes. Le texte lisse la sortie du premier plafond, mais pas celle du montant majoré : pour une famille de trois enfants, 50 € de salaire brut en plus font passer le montant de 297 € à 198 € environ, soit 99 € de moins par mois.",
    "AN113": "La majoration pour la vie autonome (104,77 €, inchangée depuis 2008) disparaît dès le premier euro de salaire. Un petit travail à temps très partiel fait donc perdre l'aide d'un coup, au lieu de la réduire progressivement.",
    "AN111": "Le minimum vieillesse complète une petite pension jusqu'à un plancher, mais l'aide au logement compte la pension sans compter l'allocation qui la complète. Résultat : un retraité qui obtient 50 € de pension en plus perd 5 à 19 € de revenu par mois sur une plage de revenu.",
    "AN1101": "Une succession de petit montant est dispensée de déclaration sous 3 000 € d'actif, mais l'abattement (la part non taxée) pour un non-parent n'est que de 1 594 €. Un légataire non parent paie donc 0 € pour 2 999 € d'actif, et plusieurs centaines d'euros pour 3 000 €.",
    "AN121": "Le texte de loi promet un âge de départ « abaissé d'au moins un an » pour les carrières longues. Le décret fixe 63 ans pour ceux qui ont commencé avant 21 ans. Mais l'âge légal monte génération après génération : pour les personnes nées en 1966, 63 ans ne fait gagner que 3 mois, pas un an.",
    "AN409": "Pour un foyer de plusieurs personnes, un décret plafonne la sanction du RSA à 50 %. Mais la fin de droit exige une « suppression totale » pendant quatre mois. Les deux textes ne peuvent pas s'appliquer ensemble : l'échelle de sanctions ne peut pas aller jusqu'au bout.",
    "AN103": "Une délibération locale sur les droits de mutation s'applique à une date qui dépend du jour où elle est notifiée : notifiée le 15 avril 2026 elle s'applique le 1er juin, notifiée le 16 avril le 1er janvier 2027, soit 214 jours plus tard, sans raison de fond. Aucune règle ne couvre une période entre décembre 2027 et mars 2028.",
    "AN100": "Le Code général des impôts plafonne un taux à 4,50 %, mais un autre texte, non codifié, autorise 5 %, sans qu'aucun renvoi ne le signale dans l'article. Qui lit le code seul croit à 4,50 %.",
    "AN001": "La loi sur les loyers permet de récupérer sur le locataire l'entretien de l'ascenseur « selon l'article L. 125-2-2 du code de la construction ». Cet article a été abrogé le 1er juillet 2021, le jour même où la loi était réécrite sans corriger le renvoi. Le texte de remplacement existe (L134-3, mot pour mot) mais le renvoi ne le dit pas.",
    "AN500": "L'Europe a fixé au 17 octobre 2024 la date limite pour reprendre la directive de cybersécurité NIS2. La France a notifié ses mesures le 19 juillet 2026, soit 640 jours plus tard, et 10 des 12 mesures datables sont antérieures à la directive elle-même : on ne peut pas dire qu'elles la transposent.",
    "AN810": "Au 1er janvier 2027, 41 articles de TVA du Code général des impôts seront abrogés. Mais 71 articles des annexes du même code continuent à les citer, sans version prévue pour les remplacer : ils renverront à rien.",
    "AN039": "Le Code du sport renvoie à l'article L. 432-8 du Code du travail, numérotation d'avant 2008. Cet article a changé de numéro à la recodification : le lecteur doit deviner où est la règle.",
    "AN042": "Le Code rural fixe un salaire annuel minimal à « 2760 francs (420,76 euros) » : un texte qui parle de francs plus de vingt ans après l'euro.",
}


def lire():
    fiches = R.charger_fiches()
    return fiches


def entree(f, dom):
    m, s = f["meta"], f["sections"]
    i = m["id"][0]
    constat = couper(premier_bloc(s.get("Constat vérifiable", "")), 380)
    cas = couper(premier_bloc(s.get("Cas concret", "")), 240)
    corr = couper(premier_bloc(s.get("Correction proposée", "")), 220)
    lien = m["lien"][0]
    L = []
    L.append('#### %s — %s {#%s}' % (i, m["titre"][0], i))
    L.append("*%s · gravité %s · domaine : %s · statut : %s ; %s*\n" % (type_de(f), m["gravite"][0], dom, m["statut"][0], confiance(f)))
    L.append("- **En clair.** %s" % pourquoi(f))
    L.append("- **Ce que disent les textes** (%s ; %s). %s" % (m["article"][0], m["version"][0], constat))
    L.append("- **Exemple concret.** %s" % cas)
    L.append("- **Ce que le système en fait.** Correction proposée : %s Traitement type : %s." % (corr, sort_systeme(f, dom)))
    L.append("- **Source.** [Légifrance](%s) ; texte relu dans codes.droit.org / base LEGI (DILA), état du 03/11/2026 ; fiche : [%s](%s.md)." % (lien, i, i))
    return "\n".join(L) + "\n"


def generer():
    toutes = lire()
    cl = Counter(R.classement(f) for f in toutes)
    st = Counter(f["meta"]["statut"][0] for f in toutes)
    anomalies = [f for f in toutes if R.classement(f) == "anomalie"]
    fortes = [f for f in anomalies if f["meta"]["statut"][0] in FORTS]
    detectees = [f for f in anomalies if f["meta"]["statut"][0] not in FORTS]
    for f in fortes + detectees:
        f["_dom"] = domaine(f)
        f["_type"] = type_de(f)
    ordre_types = ORDRE_TYPES and [TYPES[c][0] for c in ORDRE_TYPES] + TYPES_AJOUT
    tcount = Counter(f["_type"] for f in fortes)
    dcount = Counter(f["_dom"] for f in fortes)
    grav = Counter(f["meta"]["gravite"][0] for f in fortes)
    contre = [f for f in fortes if verdict(f)]
    vtient = [f for f in contre if verdict(f).startswith("tient")]
    vnuance = [f for f in contre if verdict(f).startswith("à nuancer")]
    nb_dom = [d for d, _ in DOMAINES]

    L = []
    L.append("# Les impasses du droit : liste des anomalies vérifiées sur le texte\n")
    L.append("*Brouillon pour une section dépliable du manifeste (demande de l’auteur du 06/11/2026). Généré par `python3 -I outils/droit/liste_publiable.py` à partir des fiches de `registre-anomalies/` : ne pas modifier à la main. Généré le %s.*\n" % date.today().strftime("%d/%m/%Y"))
    L.append("> **À lire d'abord.** Aucun juriste n'a relu cette liste. « Vérifiée sur le texte » veut dire : la citation figure mot pour mot dans le texte officiel en vigueur (copie locale du 03/11/2026), relue par un programme puis par une IA (Claude). Cela ne dit rien des décrets non codifiés, de la jurisprudence ni de la doctrine administrative, qui peuvent expliquer ou corriger un texte. Une anomalie n'est pas un choix politique : c'est une incohérence que l'on peut constater sans prendre parti. **Relecture juridique obligatoire avant toute publication.**\n")
    L.append("## 1. Les chiffres\n")
    L.append("| | Fiches |\n|---|---|")
    L.append("| Fiches du registre | %d |" % len(toutes))
    L.append("| dont **anomalies** (liste principale) | **%d** |" % cl["anomalie"])
    L.append("| dont choix politiques (règle voulue : matière à débat, hors liste) | %d |" % cl["choix politique"])
    L.append("| dont fiches écartées (faux positifs reconnus) | %d |" % cl["écartée"])
    L.append("| Anomalies **vérifiées sur le texte** (liste principale) | **%d** |" % len(fortes))
    L.append("| Anomalies seulement **détectées** (annexe « non vérifiées ») | %d |" % len(detectees))
    L.append("| Anomalies relues par un juriste | %d |" % st.get("relue par un juriste", 0))
    L.append("")
    L.append("Gravité des %d anomalies publiables : %d hautes, %d moyennes, %d faibles. Toutes sont des défauts qu'on peut corriger sans changer l'objectif de la règle.\n" % (len(fortes), grav["haute"], grav["moyenne"], grav["faible"]))
    L.append("### Par type\n")
    L.append("| Type | Anomalies vérifiées |\n|---|---|")
    for t in ordre_types:
        L.append("| %s | %d |" % (t, tcount.get(t, 0)))
    L.append("| **Total** | **%d** |\n" % len(fortes))
    L.append("Types cherchés et **non retenus** : boucle de renvois (0 : les deux fiches ont été écartées, chaque article donnait en réalité son critère), double imposition et délai impossible (aucune fiche : aucun détecteur n'a été écrit pour eux ; leur absence ne prouve pas qu'il n'y en a pas).\n")
    L.append("### Par domaine\n")
    L.append("| Domaine | Anomalies vérifiées |\n|---|---|")
    for d in nb_dom:
        L.append("| %s | %d |" % (d, dcount.get(d, 0)))
    L.append("")
    L.append("**Ce que le système proposé fait de chaque domaine** (orientation, pas arbitrage article par article) :\n")
    for d, t in TRAITEMENT_DOMAINE.items():
        L.append("- *%s* : %s" % (d, t.split(": ", 1)[1]))
    L.append("")
    L.append("## 2. La méthode\n")
    L.append("1. **Analyse statique** : un programme (`outils/droit/analyse_corpus.py`, `revue_code.py`) lit les 78 codes en vigueur (165 657 articles, 21,6 millions de mots ; `modeles/carte-du-droit/chiffres.md`) comme du code informatique : renvois vers un article absent, décrets annoncés introuvables, montants figés, dates contradictoires, cycles.")
    L.append("2. **Exécution des règles** : pour les plus-values immobilières et les taux marginaux, on fait tourner la loi sur des cas types (code `outils/droit/loi_executable/`, OpenFisca-France). Ces fiches donnent des ordres de grandeur, pas des prédictions.")
    L.append("3. **Relecture** : chaque alerte est relue sur le texte ; la citation est conservée mot pour mot et recontrôlée par `python3 -I outils/droit/registre.py --verifier`.")
    L.append("4. **Contradicteur** : chaque fiche porte l'objection la plus forte (« un décret hors code existe peut-être », « la règle voisine explique l'écart »). Sur les %d anomalies de cette liste, %d ont subi une contre-vérification adversariale le 04/11/2026 : %d « tiennent » (avec ou sans nuance), %d sont « à nuancer »." % (len(fortes), len(contre), len(vtient), len(vnuance)))
    L.append("5. **Tri** : les faux positifs sont sortis de la liste (écartées : %d) et les règles voulues par le législateur sont classées « choix politique » (%d), sur décision de l’auteur du 03/11/2026. Détail : `sources/registre-tri-fiches-rejetees.md`.\n" % (cl["écartée"], cl["choix politique"]))
    L.append("### Taux de faux positifs (mesuré)\n")
    L.append("- **Échantillon du 03/11/2026** : sur 30 fiches tirées au sort (graine 20261103) parmi les 149 fiches d'alors, le juge machine en a confirmé 14 ; après tri, **13 sur 30 (43 %)** étaient des faux positifs ou des choix de politique (intervalle de confiance à 95 % : 27 % à 61 %). Les premières fiches, écrites à la main, étaient les plus fragiles (9 sur 15) ; les fiches issues de détecteurs plus tardifs (RSA, prime d'activité, AAH) étaient confirmées dans l'échantillon, mais avec 1 à 3 fiches par famille.")
    L.append("- **Depuis** : les 34 fiches non confirmées ont été reclassées (choix politique ou écartée) : la liste ci-dessous est donc *déjà purgée* de ce qui a été repéré. Mais **le taux n'a pas été remesuré sur les fiches non échantillonnées** (plus de 300 fiches ajoutées après le 03/11) : on ne peut pas affirmer que la liste actuelle est sans faux positif. Contre-vérification du 04/11 sur 25 fiches de la sélection pour le manifeste : 8 tiennent, 8 tiennent avec nuance, 3 reclassées en choix politique, 6 à nuancer plus fortement (`registre-anomalies/selection-manifeste.md`).")
    L.append("- Causes de faux positifs récurrentes : renvoi à une version datée voulue pris pour un renvoi mort ; régime spécial pris pour une règle dupliquée ; règle voisine ou doctrine administrative non lue ; choix politique pris pour une incohérence ; artefact de métadonnée LEGI.\n")
    L.append("## 3. Les limites\n")
    L.append("- **Pas de juriste.** Statut « relue par un juriste » : 0 fiche. Le tri et la contre-vérification ont été faits par Claude, de la même famille de modèles que le « juge machine » (⚠️ V5108) : les deux ne sont pas indépendants.")
    L.append("- **Le texte codifié seulement.** Lois et décrets non codifiés, circulaires, BOFiP, conventions collectives, règlements européens et jurisprudence ne sont pas lus (sauf exceptions notées dans les fiches). Une impasse apparente peut être levée par un texte hors corpus.")
    L.append("- **Aucune fiche ne dit que la règle est mauvaise** : seulement qu'elle est incohérente, inapplicable ou ambiguë. Les corrections sont des propositions.")
    L.append("- **Les exemples chiffrés** sont des cas types (paramètres hors code pour les aides) : des ordres de grandeur.")
    L.append("- **Le « traitement dans le système proposé »** est une *orientation par domaine* tirée des positions de l’auteur, pas un arbitrage article par article : aucune de ces règles n'a été examinée une à une pour décider de son sort.")
    L.append("- Les liens Légifrance renvoient 403 hors navigateur : le texte a été relu dans la copie locale (codes.droit.org, base LEGI, état du 03/11/2026) ; la date de version figure dans chaque entrée.")
    L.append("- Le volume de la liste (%d) ne mesure pas la qualité du droit : il mesure ce que les détecteurs ont su repérer. Un code avec peu de fiches n'est pas forcément plus propre ; il a peut-être été moins lu.\n" % len(fortes))

    L.append("## 4. Les anomalies par type\n")
    L.append("Ordre : type, puis gravité décroissante. Index par domaine à la fin.\n")
    ordg = {"haute": 0, "moyenne": 1, "faible": 2}
    for t in ordre_types:
        fs = sorted((f for f in fortes if f["_type"] == t), key=lambda f: (ordg[f["meta"]["gravite"][0]], len(f["meta"]["id"][0]), f["meta"]["id"][0]))
        if not fs:
            continue
        expl = next((TYPES[c][1] for c in ORDRE_TYPES if TYPES[c][0] == t), SURCLASSEMENT["AN500"][1])
        L.append("<details>\n<summary><strong>%s (%d)</strong></summary>\n" % (t, len(fs)))
        L.append("*%s*\n" % expl)
        for f in fs:
            L.append(entree(f, f["_dom"]))
        L.append("</details>\n")

    L.append("## 5. Index par domaine\n")
    for d in nb_dom:
        fs = sorted((f for f in fortes if f["_dom"] == d), key=lambda f: (len(f["meta"]["id"][0]), f["meta"]["id"][0]))
        if not fs:
            continue
        L.append("<details>\n<summary><strong>%s (%d)</strong></summary>\n" % (d, len(fs)))
        for f in fs:
            L.append("- [%s](#%s) — %s *(%s, %s)*" % (f["meta"]["id"][0], f["meta"]["id"][0], f["meta"]["titre"][0], f["_type"], f["meta"]["gravite"][0]))
        L.append("\n</details>\n")

    L.append("## 6. Annexe : fiches détectées, non vérifiées\n")
    if detectees:
        L.append("**Non vérifiées : à ne pas citer comme des faits.**\n")
        for f in sorted(detectees, key=lambda f: (len(f["meta"]["id"][0]), f["meta"]["id"][0])):
            L.append("- [%s](%s.md) — %s *(%s)*" % (f["meta"]["id"][0], f["meta"]["id"][0], f["meta"]["titre"][0], f["_type"]))
        L.append("")
    else:
        L.append("**Aucune fiche n'est au statut « détectée » à ce jour** : les fiches encore détectées au 03/11/2026 ont été triées ce jour-là, puis AN810 et AN812 ont été vérifiées ensuite : les %d anomalies sont toutes « vérifiées sur le texte ». Les pistes de l'outil jamais devenues des fiches sont dans [ecartes.md](ecartes.md) ; elles ne sont pas des anomalies établies.\n" % len(fortes))
    L.append("## 7. Hors liste : choix politiques et fiches écartées\n")
    L.append("- **%d choix politiques** : règles voulues (non-indexation, abattement pour durée, régime spécial…). Elles ne sont pas des anomalies mais restent matière à débat : voir l'index du [README](README.md).\n- **%d fiches écartées** (faux positifs) : [fiches-ecartees.md](fiches-ecartees.md).\n" % (cl["choix politique"], cl["écartée"]))
    L.append("---\n*Sources : texte du droit en vigueur de [codes.droit.org](https://codes.droit.org/) (XML issu de la base LEGI, DILA, état du 03/11/2026, cote A) et [Légifrance](https://www.legifrance.gouv.fr/) pour les lois non codifiées ; OpenFisca-France pour les cas types de taux marginal. Fiabilité des sources : A (texte officiel) ; les calculs de cas types sont des estimations de l'auteur.*")
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    SORTIE.write_text(generer(), encoding="utf-8")
    print("écrit", SORTIE)
