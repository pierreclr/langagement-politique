#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Registre public des anomalies du droit (T55) : contrôle des fiches, index, vérification des citations.

Une fiche = un fichier `registre-anomalies/ANxxx.md` : en-tête (front matter) puis sections fixes.
Ce script ne lit que la bibliothèque standard (Python 3.9).

Usage (depuis la racine du dépôt) :
    python3 -I outils/droit/registre.py                    # contrôle les fiches ET régénère README.md
    python3 -I outils/droit/registre.py --controle         # contrôle seulement (code retour 1 si une fiche est incomplète)
    python3 -I outils/droit/registre.py --verifier         # relit les citations de toutes les fiches dans le texte local
    python3 -I outils/droit/registre.py --verifier AN001 AN019

Classement d'une fiche (champs optionnels de l'en-tête, décision de l’auteur du 03/11/2026) :
    classement: anomalie            (défaut) incohérence ou défaut constatable : compte dans les anomalies actives
    classement: choix politique     la règle est voulue par le législateur : visible dans l'index, matière à débat, hors décompte
    classement: écartée             faux positif (erreur de l'outil ou de lecture) : sortie de l'index, listée dans fiches-ecartees.md
    motif-classement: <une ligne>   obligatoire pour « choix politique » et « écartée »

Lignes `verif:` d'une fiche (séparateur « | ») :
    <code>|<numéro d'article>|<citation>      la citation figure mot pour mot dans l'article du code (XML codes.droit.org)
    loi89|<article>|<citation>                idem dans la loi n° 89-462 (JSON lu sur Légifrance)
    elan|140|<citation>                       idem dans l'article 140 de la loi ELAN
    absent|<code>|<numéro>                    aucun article de ce numéro dans le code (refusé si le code semble tronqué)
    absent-texte|<code ou loi89>|<expression> l'expression n'apparaît dans aucun article du code (ou de la loi)
    meta|<code>|<numéro>|<citation>           la citation figure dans l'intitulé de la version (modTitle) de l'article
Les données locales : $DONNEES/sources (variable LANGAGEMENT_DONNEES pour changer la racine).
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter, OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
REGISTRE = RACINE / "registre-anomalies"
DONNEES = Path(os.environ.get("LANGAGEMENT_DONNEES", str(Path.home() / "Documents/langagement-donnees")))
XML_CODES = DONNEES / "sources/legi/codes-droit-org"
JSON_DROIT = DONNEES / "sources/droit"
SEUIL_CODE_COMPLET = 100  # en dessous, un code est jugé tronqué : une « absence » n'y prouve rien

CHAMPS = ["id", "titre", "categorie", "gravite", "statut", "article", "version", "lien"]
SECTIONS = ["Texte et article", "Constat vérifiable", "Cas concret", "Test reproductible", "Gravité",
            "Correction proposée", "Objection ou interprétation contraire"]
GRAVITES = ["haute", "moyenne", "faible"]
STATUTS = ["détectée", "vérifiée sur le texte", "relue par un juriste"]
CLASSEMENTS = ["anomalie", "choix politique", "écartée"]
CATEGORIES = [
    "renvoi mort", "renvoi circulaire", "décret d'application non repéré", "montant figé", "montant en francs",
    "seuil absurde", "taux marginal > 100 %", "contradiction", "définition absente", "règle dupliquée",
    "déconnexion du gain réel", "échéance sans règle transitoire", "incohérence de dates",
    "rédaction défectueuse", "complexité excessive", "effet pervers (incitation)",
]


# ------------------------------------------------------------------ lecture d'une fiche
def lire_fiche(chemin: Path) -> dict:
    """Retourne {'meta': OrderedDict (listes), 'sections': OrderedDict, 'chemin': Path}."""
    texte = chemin.read_text(encoding="utf-8")
    meta, sections = OrderedDict(), OrderedDict()
    lignes = texte.split("\n")
    i = 0
    if lignes and lignes[0].strip() == "---":
        i = 1
        while i < len(lignes) and lignes[i].strip() != "---":
            if ": " in lignes[i]:
                cle, val = lignes[i].split(": ", 1)
                meta.setdefault(cle.strip(), []).append(val.strip())
            i += 1
        i += 1
    courant = None
    for ligne in lignes[i:]:
        if ligne.startswith("## "):
            courant = ligne[3:].strip()
            sections[courant] = []
        elif courant is not None:
            sections[courant].append(ligne)
    sections = OrderedDict((k, "\n".join(v).strip()) for k, v in sections.items())
    return {"meta": meta, "sections": sections, "chemin": chemin}


def classement(f: dict) -> str:
    """Classement de la fiche : « anomalie » si le champ est absent."""
    return f["meta"].get("classement", ["anomalie"])[0] or "anomalie"


def verifier_fiche(f: dict) -> list:
    """Liste de problèmes (vide si la fiche est complète et cohérente)."""
    pb = []
    m, nom = f["meta"], f["chemin"].stem
    for c in CHAMPS:
        if c not in m or not m[c][0]:
            pb.append("champ manquant ou vide : " + c)
    for c in SECTIONS:
        if not f["sections"].get(c):
            pb.append("section manquante ou vide : " + c)
    if m.get("id") and m["id"][0] != nom:
        pb.append("id (%s) différent du nom de fichier (%s)" % (m["id"][0], nom))
    if not re.fullmatch(r"AN\d{3,4}", nom):
        pb.append("nom de fichier hors format ANxxx")
    if m.get("gravite") and m["gravite"][0] not in GRAVITES:
        pb.append("gravité inconnue : %s (attendu : %s)" % (m["gravite"][0], ", ".join(GRAVITES)))
    if m.get("statut") and m["statut"][0] not in STATUTS:
        pb.append("statut inconnu : %s (attendu : %s)" % (m["statut"][0], ", ".join(STATUTS)))
    if m.get("categorie") and m["categorie"][0] not in CATEGORIES:
        pb.append("catégorie inconnue : %s" % m["categorie"][0])
    if classement(f) not in CLASSEMENTS:
        pb.append("classement inconnu : %s (attendu : %s)" % (classement(f), ", ".join(CLASSEMENTS)))
    elif classement(f) != "anomalie" and not (m.get("motif-classement") and m["motif-classement"][0]):
        pb.append("classement « %s » sans motif-classement" % classement(f))
    if m.get("lien") and not m["lien"][0].startswith("http"):
        pb.append("lien non cliquable : " + m["lien"][0])
    if m.get("statut") and m["statut"][0] != "détectée" and not m.get("verif") and not f["sections"].get("Test reproductible", "").strip():
        pb.append("statut sans test reproductible")
    return pb


def charger_fiches() -> list:
    return [lire_fiche(p) for p in sorted(REGISTRE.glob("AN[0-9][0-9][0-9]*.md"))]


# ------------------------------------------------------------------ index
def ordre_gravite(g: str) -> int:
    return GRAVITES.index(g) if g in GRAVITES else len(GRAVITES)


def construire_ecartees(fiches: list) -> str:
    """Journal des fiches écartées (faux positifs), une ligne chacune avec le motif."""
    ec = sorted((f for f in fiches if classement(f) == "écartée"), key=lambda f: (len(f["meta"]["id"][0]), f["meta"]["id"][0]))
    L = ["# Journal des fiches écartées du registre (T55)\n",
         "*Généré par `python3 -I outils/droit/registre.py` : ne pas modifier à la main. Décision de l’auteur du 03/11/2026.*\n",
         "Ces fiches sont des **faux positifs** (erreur de l'outil ou de lecture) : retirées de l'index et des décomptes d'anomalies, "
         "mais conservées (fichier de la fiche intact, champ `classement: écartée`) pour garder la trace de l'erreur et mesurer la précision des détecteurs. "
         "Les détections de l'outil jamais devenues des fiches sont dans [ecartes.md](ecartes.md).\n",
         "**%d fiches écartées.**\n" % len(ec),
         "| Fiche | Titre | Motif de l'écart |\n|---|---|---|"]
    for f in ec:
        m = f["meta"]
        L.append("| [%s](%s.md) | %s | %s |" % (m["id"][0], m["id"][0], m["titre"][0].replace("|", "/"), m["motif-classement"][0].replace("|", "/")))
    L.append("")
    return "\n".join(L)


def construire_index(fiches: list) -> str:
    toutes = fiches
    ecartees = [f for f in toutes if classement(f) == "écartée"]
    politiques = [f for f in toutes if classement(f) == "choix politique"]
    fiches = [f for f in toutes if classement(f) == "anomalie"]
    n = len(fiches)
    par_g = Counter(f["meta"]["gravite"][0] for f in fiches)
    par_s = Counter(f["meta"]["statut"][0] for f in fiches)
    par_c = Counter(f["meta"]["categorie"][0] for f in fiches)
    croise = Counter((f["meta"]["categorie"][0], f["meta"]["statut"][0]) for f in fiches)
    L = []
    L.append("# Registre des anomalies du droit (T55)\n")
    L.append("*Dépôt privé : rien n'est publié. Index généré par `python3 -I outils/droit/registre.py` : ne pas modifier à la main.*\n")
    L.append("Une anomalie n'est pas un choix politique : c'est une incohérence, une impasse ou un défaut de coordination "
             "que l'on peut constater sur le texte (renvoi vers un article qui n'existe plus, décret annoncé jamais repéré, "
             "montant resté en francs, seuil qui fait payer 500 € pour un euro, taux marginal supérieur à 100 %, règle écrite six fois). "
             "Chaque fiche sépare le **constat** (vérifiable, cité mot pour mot) de l'**interprétation** (objection possible).\n")
    L.append("## Classement\n")
    L.append("- **anomalie** : incohérence, impasse ou défaut de coordination constatable sur le texte. Seules ces fiches entrent dans les statistiques et l'index principal.")
    L.append("- **choix politique** : la règle est voulue par le législateur (non-indexation, abattement pour durée, régime spécial…). Matière à débat, pas un bug : fiches visibles, listées à part, hors décompte des anomalies.")
    L.append("- **écartée** : faux positif (erreur de l'outil ou de lecture). Retirée de l'index, conservée dans [fiches-ecartees.md](fiches-ecartees.md) avec son motif.\n")
    L.append("| Classement | Fiches |\n|---|---|")
    L.append("| anomalie (actives) | %d |" % len(fiches))
    L.append("| choix politique | %d |" % len(politiques))
    L.append("| écartée | %d |" % len(ecartees))
    L.append("| total des fiches | %d |\n" % len(toutes))
    L.append("## Statuts\n")
    L.append("- **détectée** : repérée par un outil ou une recherche, pas (ou pas entièrement) relue sur le texte en vigueur.")
    L.append("- **vérifiée sur le texte** : le constat cité a été relu sur le texte en vigueur de la copie locale (codes.droit.org ou Légifrance) ; "
             "cela ne dit rien d'un texte hors du corpus (décret non codifié, jurisprudence, doctrine).")
    L.append("- **relue par un juriste** : relecture externe faite. **Aucune fiche n'a ce statut à ce jour : relecture juridique obligatoire avant publication.**\n")
    L.append("Gravité : **haute** (le texte ne permet pas d'appliquer la règle, crée un saut ou un taux supérieur à 100 %), "
             "**moyenne** (divergence ou lacune qui gêne l'application), **faible** (cosmétique, complexité, montant symbolique). "
             "Le classement est celui de l'auteur de la fiche, à discuter ; les sources utilisaient une échelle voisine (bloquant, incohérent, complexité inutile, cosmétique).\n")
    L.append("## Statistiques\n")
    L.append("**%d anomalies actives** (hors %d choix politiques et %d fiches écartées).\n" % (n, len(politiques), len(ecartees)))
    L.append("| Statut | Fiches |\n|---|---|")
    for s in STATUTS:
        L.append("| %s | %d |" % (s, par_s.get(s, 0)))
    L.append("")
    L.append("| Gravité | Fiches |\n|---|---|")
    for g in GRAVITES:
        L.append("| %s | %d |" % (g, par_g.get(g, 0)))
    L.append("")
    L.append("| Catégorie | Fiches | dont vérifiées sur le texte | dont détectées |\n|---|---|---|---|")
    for c in sorted(par_c, key=lambda x: (-par_c[x], x)):
        L.append("| %s | %d | %d | %d |" % (c, par_c[c], croise.get((c, "vérifiée sur le texte"), 0), croise.get((c, "détectée"), 0)))
    L.append("")
    L.append("## Index (trié par gravité, puis par numéro)\n")
    L.append("| N° | Gravité | Catégorie | Anomalie | Article | Statut |\n|---|---|---|---|---|---|")
    for f in sorted(fiches, key=lambda f: (ordre_gravite(f["meta"]["gravite"][0]), len(f["meta"]["id"][0]), f["meta"]["id"][0])):
        m = f["meta"]
        L.append("| [%s](%s.md) | %s | %s | %s | %s | %s |" % (
            m["id"][0], m["id"][0], m["gravite"][0], m["categorie"][0],
            m["titre"][0].replace("|", "/"), m["article"][0].replace("|", "/"), m["statut"][0]))
    L.append("")
    if politiques:
        L.append("## Choix politiques (matière à débat, hors décompte des anomalies)\n")
        L.append("| N° | Catégorie d'origine | Fiche | Article | Motif du classement |\n|---|---|---|---|---|")
        for f in sorted(politiques, key=lambda f: (len(f["meta"]["id"][0]), f["meta"]["id"][0])):
            m = f["meta"]
            L.append("| [%s](%s.md) | %s | %s | %s | %s |" % (
                m["id"][0], m["id"][0], m["categorie"][0], m["titre"][0].replace("|", "/"),
                m["article"][0].replace("|", "/"), m["motif-classement"][0].replace("|", "/")))
        L.append("")
    L.append("## Signalements écartés\n")
    L.append("Fiches écartées comme faux positifs : voir [fiches-ecartees.md](fiches-ecartees.md). "
             "Détections de l'outil jugées fausses ou non concluantes à la relecture : voir [ecartes.md](ecartes.md). Mesures de complexité (statistiques, pas anomalies) : voir [mesures.md](mesures.md).\n")
    L.append("## Reproduire\n")
    L.append("```\npython3 -I outils/droit/registre.py            # contrôle + régénération de cet index\n"
             "python3 -I outils/droit/registre.py --verifier   # relit chaque citation dans le texte local\n```\n")
    L.append("Sources locales : XML de [codes.droit.org](https://codes.droit.org/) (dérivé de la base LEGI de la DILA, licence ouverte), "
             "consulté le 02/11/2026 ; lois non codifiées lues sur [Légifrance](https://www.legifrance.gouv.fr/). "
             "Livrables d'origine : `sources/revue-droit-pilote-plus-values-baux.md`, `sources/loi-executable-plus-values.md`, "
             "`sources/rules-as-code-analyse-statique.md`, `sources/rules-as-code-taux-marginaux.md`, `sources/recherche-retraites-etranger.md`.\n")
    return "\n".join(L)


# ------------------------------------------------------------------ vérification des citations
def norm(s: str) -> str:
    s = s.replace("’", "'").replace(" ", " ").replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip().casefold()


_cache_xml: dict = {}
_cache_json: dict = {}


def charger_xml(code: str):
    """code -> {num: [(texte normalisé, modTitle normalisé)]} ou None si le fichier est absent."""
    if code in _cache_xml:
        return _cache_xml[code]
    chemin = XML_CODES / (urllib.parse.quote(code) + ".xml")
    if not chemin.exists():
        _cache_xml[code] = None
        return None
    d: dict = {}
    for _, el in ET.iterparse(str(chemin)):
        if el.tag == "article":
            d.setdefault(el.get("num") or "", []).append((norm("".join(el.itertext())), norm(el.get("modTitle") or "")))
            el.clear()
    _cache_xml[code] = d
    return d


def charger_json(source: str):
    """loi89 / elan -> {numéro d'article: texte normalisé} ou None."""
    if source in _cache_json:
        return _cache_json[source]
    nom = {"loi89": "loi-89-462-articles.json", "elan": "elan-art140.json"}.get(source)
    chemin = JSON_DROIT / nom if nom else None
    if not chemin or not chemin.exists():
        _cache_json[source] = None
        return None
    data = json.load(open(chemin, encoding="utf-8"))
    d = {}
    for t in data["articles"]:
        m = re.match(r"Article (\S+)", t)
        if m:
            d[m.group(1)] = norm(t)
    _cache_json[source] = d
    return d


def controler_verif(ligne: str):
    """Retourne (état, message) ; état parmi 'ok', 'echec', 'ignore'."""
    p = ligne.split("|")
    genre = p[0].strip()
    if genre == "absent" and len(p) == 3:
        code, num = p[1].strip(), p[2].strip()
        d = charger_xml(code)
        if d is None:
            return "ignore", "source locale absente : " + code
        if len(d) < SEUIL_CODE_COMPLET:
            return "ignore", "code probablement tronqué (%d articles) : absence non concluante : %s" % (len(d), code)
        return ("ok", "absent de %s : %s" % (code, num)) if num not in d else ("echec", "%s existe dans %s" % (num, code))
    if genre == "absent-texte" and len(p) == 3:
        source, phrase = p[1].strip(), norm(p[2])
        if source in ("loi89", "elan"):
            d = charger_json(source)
            if d is None:
                return "ignore", "source locale absente : " + source
            n = sum(t.count(phrase) for t in d.values())
        else:
            d = charger_xml(source)
            if d is None:
                return "ignore", "source locale absente : " + source
            n = sum(t.count(phrase) for v in d.values() for t, _ in v)
        return ("ok", "« %s » : 0 occurrence dans %s" % (p[2].strip(), source)) if n == 0 else ("echec", "« %s » : %d occurrence(s) dans %s" % (p[2].strip(), n, source))
    if genre == "meta" and len(p) == 4:
        code, num, cit = p[1].strip(), p[2].strip(), norm(p[3])
        d = charger_xml(code)
        if d is None:
            return "ignore", "source locale absente : " + code
        ok = any(cit in mt for _, mt in d.get(num, []))
        return ("ok", "intitulé de %s %s contient la citation" % (code, num)) if ok else ("echec", "intitulé de %s %s sans la citation" % (code, num))
    if len(p) == 3:
        source, num, cit = p[0].strip(), p[1].strip(), norm(p[2])
        if source in ("loi89", "elan"):
            d = charger_json(source)
            if d is None:
                return "ignore", "source locale absente : " + source
            ok = cit in d.get(num, "")
        else:
            d = charger_xml(source)
            if d is None:
                return "ignore", "source locale absente : " + source
            ok = any(cit in t for t, _ in d.get(num, []))
        return ("ok", "%s %s : citation retrouvée" % (source, num)) if ok else ("echec", "%s %s : citation introuvable" % (source, num))
    return "echec", "ligne verif mal formée : " + ligne


def commande_verifier(fiches: list, ids: list) -> int:
    echecs = ignores = total = 0
    for f in fiches:
        i = f["meta"].get("id", ["?"])[0]
        if ids and i not in ids:
            continue
        for v in f["meta"].get("verif", []):
            etat, msg = controler_verif(v)
            total += 1
            echecs += etat == "echec"
            ignores += etat == "ignore"
            if etat != "ok":
                print("%s : %s : %s" % (i, "ÉCHEC" if etat == "echec" else "non vérifiable", msg))
    print("%d contrôles de citation, %d échec(s), %d non vérifiable(s)." % (total, echecs, ignores))
    return 1 if echecs else 0


# ------------------------------------------------------------------ principal
def main(argv: list) -> int:
    fiches = charger_fiches()
    if "--verifier" in argv:
        return commande_verifier(fiches, [a for a in argv if a.startswith("AN")])
    ko = 0
    for f in fiches:
        for pb in verifier_fiche(f):
            print("%s : %s" % (f["chemin"].name, pb))
            ko += 1
    ids = [f["meta"].get("id", [""])[0] for f in fiches]
    for i, c in Counter(ids).items():
        if c > 1:
            print("id en double : " + i)
            ko += 1
    if ko:
        print("%d problème(s) : index non régénéré." % ko)
        return 1
    if "--controle" in argv:
        print("%d fiches complètes." % len(fiches))
        return 0
    (REGISTRE / "README.md").write_text(construire_index(fiches), encoding="utf-8")
    (REGISTRE / "fiches-ecartees.md").write_text(construire_ecartees(fiches), encoding="utf-8")
    nb = Counter(classement(f) for f in fiches)
    print("%d fiches complètes (%d anomalies, %d choix politiques, %d écartées) ; README.md et fiches-ecartees.md régénérés." % (
        len(fiches), nb["anomalie"], nb["choix politique"], nb["écartée"]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
