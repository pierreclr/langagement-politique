#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Base LEGI complète (T55, correction du 02/11/2026).

Pourquoi : les copies de codes.droit.org sont parfois tronquées (CCH : une seule
article L111-x ; code du domaine public fluvial : un article).  Les renvois « morts »
calculés contre elles étaient en partie des faux positifs.  Cet outil lit la base LEGI
brute de la DILA (export global + incréments quotidiens, versions abrogées comprises),
la range dans SQLite (`extrait/legi.sqlite`), compare code par code avec codes.droit.org
et produit l'index des articles (vigueur, abrogé, renuméroté, avec dates).

Fonctions pures (testées) : parse_article, cid_de, etat_resume, comparer_codes,
codes_tronques, classer_cible.  E/S : extraire, charger_codes_droit_org, main.

Usage :
  python3 -I outils/droit/legi_complet.py extraire        # lit les tar.gz en flux -> legi.sqlite
  python3 -I outils/droit/legi_complet.py comparer        # codes tronqués + index_articles.tsv.gz
Python 3.9, bibliothèque standard seule.
"""
from __future__ import annotations

import gzip
import json
import re
import sqlite3
import sys
import tarfile
import urllib.parse
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

RACINE = Path.home() / "Documents/langagement-donnees/sources/legi"
DILA = RACINE / "dila"
EXTRAIT = RACINE / "extrait"
CODES_DROIT_ORG = RACINE / "codes-droit-org"
SEUIL_TRONQUE = 0.9  # un code est « tronqué » s'il a moins de 90 % des articles en vigueur de LEGI
AUJOURDHUI = "2026-11-02"
SANS_FIN = "2999-01-01"

TYPES_LIENS_UTILES = {"ABROGATION", "ABROGATION_ILLIMITE", "MODIFICATION", "TRANSFERT", "TRANSFERE",
                      "CODIFICATION", "CODIFIE", "CONCORDANCE", "RENUMEROTATION", "DEPLACE", "DEPLACEMENT",
                      "ANNULATION", "DISJONCTION", "SPEC_APPLI", "PEREMPTION", "CREATION"}


# ------------------------------------------------------------------ fonctions pures
def parse_article(contenu: bytes):
    """XML d'un fichier LEGIARTI -> dict, ou None si l'article n'appartient pas à un code.

    Champs : id, num, etat, debut, fin, code_cid, code_nom, versions [[id, etat, debut, fin]],
    liens [{typelien, sens, id, cidtexte, num, texte}] (hors CITATION/TXT_SOURCE).
    """
    try:
        racine = ET.fromstring(contenu)
    except ET.ParseError:
        return None
    ctx = racine.find("CONTEXTE/TEXTE")
    if ctx is None or ctx.get("cid", "").startswith("LEGITEXT") is False:
        return None
    meta = racine.find("META/META_SPEC/META_ARTICLE")
    if meta is None:
        return None
    code_cid = ctx.get("cid")
    nom = ""
    for t in ctx.findall("TITRE_TXT"):
        if t.get("id_txt") == code_cid:
            nom = (t.get("c_titre_court") or (t.text or "")).strip()
    versions = [[v.get("id"), v.get("etat"), v.get("debut"), v.get("fin")]
                for v in racine.findall("VERSIONS/VERSION/LIEN_ART")]
    liens = []
    for l in racine.findall("LIENS/LIEN"):
        typ = l.get("typelien", "")
        if typ in ("CITATION", "TXT_SOURCE"):
            continue
        liens.append({"typelien": typ, "sens": l.get("sens", ""), "id": l.get("id", ""),
                      "cidtexte": l.get("cidtexte", ""), "num": l.get("num", ""),
                      "texte": re.sub(r"\s+", " ", (l.text or ""))[:200]})
    return {
        "id": (racine.findtext("META/META_COMMUN/ID") or "").strip(),
        "num": (meta.findtext("NUM") or "").strip(),
        "etat": (meta.findtext("ETAT") or "").strip(),
        "debut": (meta.findtext("DATE_DEBUT") or "").strip(),
        "fin": (meta.findtext("DATE_FIN") or "").strip(),
        "code_cid": code_cid, "code_nom": nom, "versions": versions, "liens": liens,
    }


def cid_de(versions: list, id_: str) -> str:
    """Identifiant stable de l'article (cid) : id de la plus ancienne version.

    Ce n'est PAS le cid de codes.droit.org (identifiant « chronique » parfois sans fichier LEGI) :
    c'est une clé interne ; on relie les deux par les identifiants de version (`ids`).
    """
    if not versions:
        return id_
    return sorted(versions, key=lambda v: ((v[2] or ""), v[0] or ""))[0][0]


def norm_num(num: str) -> str:
    """'L. 123-4 bis' -> 'l123-4bis' (sans accents, sans points ni espaces)."""
    import unicodedata
    s = "".join(c for c in unicodedata.normalize("NFD", num or "") if unicodedata.category(c) != "Mn")
    return re.sub(r"[\s. ]", "", s).lower()


LIENS_SUCCESSEUR = {"TRANSFERT", "TRANSFERE", "DEPLACE", "DEPLACEMENT", "CODIFIE", "CODIFICATION", "CONCORDANCE", "CONCORDE",
                    "RENUMEROTATION"}
ETATS_VIVANTS = {"VIGUEUR", "ABROGE_DIFF", "MODIFIE_DIFF", "PERIME_DIFF", ""}


def etat_resume(etat: str, debut: str, fin: str, aujourdhui: str = AUJOURDHUI) -> str:
    """vigueur | futur | abroge | modifie (version remplacée) | transfere | autre.

    Le critère est la date : ABROGE_DIFF = encore en vigueur, abrogation programmée (un fichier de
    codes.droit.org le confirme : le Code de procédure pénale en compte 2 538)."""
    if debut and debut > aujourdhui:
        return "futur"
    if (not fin or fin > aujourdhui) and etat in ETATS_VIVANTS:
        return "vigueur"
    if etat in ("ABROGE", "ABROGE_DIFF", "PERIME", "ANNULE", "VIGUEUR"):
        return "abroge"
    if etat in ("MODIFIE", "MODIFIE_MORT_NE", "DISJOINT"):
        return "modifie"
    if etat in ("TRANSFERE", "DEPLACE"):
        return "transfere"
    return "autre"


def agreger_par_cid(lignes: list) -> dict:
    """lignes (une par version) -> {cle: fiche d'article}.

    La clé est l'identifiant de la plus ancienne version de la chaîne VERSIONS (ce n'est pas le « cid »
    de codes.droit.org, qui peut désigner un identifiant historique sans fichier LEGI : on passe par
    les identifiants de version, `ids`).  Fiche : code_cid, code_nom, num (dernier numéro), statut
    (vigueur | futur | abroge | transfere), id_vigueur, date_debut, date_abrogation (date de fin de
    la dernière version, ou abrogation programmée), numeros, successeurs (identifiants de version
    d'articles de code liés par un lien LEGI de transfert, codification, concordance ou déplacement).
    """
    par = defaultdict(list)
    for l in lignes:
        par[cid_de(l["versions"], l["id"])].append(l)
    out = {}
    for cid, vs in par.items():
        vs.sort(key=lambda l: (l["debut"], l["id"]))
        etats = [etat_resume(v["etat"], v["debut"], v["fin"]) for v in vs]
        vig = [v for v, e in zip(vs, etats) if e == "vigueur"]
        futur = [v for v, e in zip(vs, etats) if e == "futur"]
        dern = vs[-1]
        numeros = []
        for v in vs:
            if v["num"] and v["num"] not in numeros:
                numeros.append(v["num"])
        succ = []
        for v in vs:
            for l in v["liens"]:
                if (l["typelien"] in LIENS_SUCCESSEUR and l["sens"] == "cible" and l["id"].startswith("LEGIARTI")
                        and l["cidtexte"].startswith("LEGITEXT") and l["id"] not in succ):
                    succ.append(l["id"])
        transfere = any(v["etat"] in ("TRANSFERE", "DEPLACE") for v in vs)
        if vig:
            statut, ref, fin_prog = "vigueur", vig[-1], ""
        elif futur:
            statut, ref = "futur", futur[-1]
        else:
            statut, ref = ("transfere" if transfere else "abroge"), dern
        fin = ref["fin"] if ref["fin"] and ref["fin"] < SANS_FIN else ""
        out[cid] = {
            "cid": cid, "code_cid": dern["code_cid"], "code_nom": dern["code_nom"], "num": ref["num"],
            "statut": statut, "id_vigueur": vig[-1]["id"] if vig else "",
            "date_debut": vs[0]["debut"],
            "date_abrogation": fin if statut in ("abroge", "transfere") else "",
            "abrogation_programmee": fin if statut == "vigueur" else "",
            "numeros": numeros, "etats": sorted({v["etat"] for v in vs}), "n_versions": len(vs),
            "ids": [v["id"] for v in vs], "successeurs": succ,
        }
    return out


def marquer_renumerotes(index: dict) -> dict:
    """Qualifie les articles non en vigueur.

    - `renumerote` : un lien LEGI (transfert, codification, concordance, déplacement) mène à un article
      de code en vigueur (`remplacant_cid` = clé de celui-ci) ;
    - `numero_repris` : pas de lien, mais le même numéro, dans le même code, est porté par un autre
      article en vigueur (hypothèse de renumérotation à l'identique, NON confirmée) ;
    - sinon `abroge` / `transfere` (transféré sans successeur vivant identifié) restent tels quels.
    """
    ids = {i: c for c, f in index.items() for i in f["ids"]}
    vivants = {}
    for c, f in index.items():
        if f["statut"] == "vigueur":
            vivants.setdefault((f["code_cid"], norm_num(f["num"])), c)
    for c, f in index.items():
        f["remplacant_cid"] = ""
        f["qualif"] = f["statut"]
        if f["statut"] in ("vigueur", "futur"):
            continue
        for sid in f["successeurs"]:
            r = ids.get(sid)
            if r and r != c and index[r]["statut"] == "vigueur":
                f["remplacant_cid"] = r
                # même numéro dans le même code : l'article « existe » toujours sous ce numéro (contrôle
                # de l'échantillon du 02/11 : les renvois sont alors vivants) -> numero_repris
                meme = (index[r]["code_cid"] == f["code_cid"]
                        and norm_num(index[r]["num"]) in {norm_num(n) for n in f["numeros"]})
                f["statut"] = "numero_repris" if meme else "renumerote"
                break
        if f["statut"] in ("renumerote", "numero_repris"):
            continue
        for n in reversed(f["numeros"]):
            r = vivants.get((f["code_cid"], norm_num(n)))
            if r and r != c:
                f["remplacant_cid"], f["statut"] = r, "numero_repris"
                break
    return index


def classer_cible(cid: str, id_version: str, code_cible: str, index: dict, ids: dict) -> dict:
    """Classe la cible d'un renvoi d'après l'index LEGI.

    Retour : {etat: vigueur | futur | abroge | renumerote | numero_repris | transfere | inexistant, date_abrogation, remplacant}.
    `ids` : {id de version -> cid}.  « inexistant » = cid inconnu de LEGI (même après les versions abrogées).
    """
    c = cid if cid in index else ids.get(id_version) or ids.get(cid)
    f = index.get(c) if c else None
    if f is None:
        return {"etat": "inexistant", "date_abrogation": "", "remplacant": ""}
    return {"etat": f["statut"], "date_abrogation": f["date_abrogation"], "remplacant": f.get("remplacant_cid", "")}


def comparer_codes(vigueur_legi: dict, vigueur_cdo: dict, seuil: float = SEUIL_TRONQUE) -> list:
    """Compare nombre d'articles en vigueur par code (cid de code -> compte).

    Retourne une liste de dicts triée par écart décroissant, avec `tronque` si cdo < seuil * legi
    ou si le code est absent de codes.droit.org alors que LEGI en a.
    """
    lignes = []
    for code in sorted(set(vigueur_legi) | set(vigueur_cdo)):
        a, b = vigueur_legi.get(code, 0), vigueur_cdo.get(code, 0)
        lignes.append({"code_cid": code, "legi": a, "cdo": b, "ecart": a - b,
                       "ratio": round(b / a, 4) if a else None,
                       "tronque": bool(a and b < seuil * a)})
    return sorted(lignes, key=lambda l: -l["ecart"])


def codes_tronques(comparaison: list) -> set:
    return {l["code_cid"] for l in comparaison if l["tronque"] and l["cdo"] > 0}


# ------------------------------------------------------------------ E/S
SCHEMA = """CREATE TABLE IF NOT EXISTS art(id TEXT PRIMARY KEY, num TEXT, etat TEXT, debut TEXT, fin TEXT,
code_cid TEXT, code_nom TEXT, versions TEXT, liens TEXT, source TEXT);
CREATE TABLE IF NOT EXISTS traite(archive TEXT PRIMARY KEY, articles INT, suppressions INT);"""


def extraire(archives: list = None, base: Path = None, log=sys.stderr):
    """Lit en flux les archives (global puis incréments dans l'ordre) -> SQLite. Reprenable."""
    EXTRAIT.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str((base or EXTRAIT) / "legi.sqlite"))
    db.executescript(SCHEMA)
    faits = {r[0] for r in db.execute("SELECT archive FROM traite")}
    if archives is None:
        liste = sorted(DILA.glob("LEGI_*.tar.gz"))
        archives = sorted(DILA.glob("Freemium_legi_global_*.tar.gz")) + liste
    for arc in archives:
        if arc.name in faits:
            continue
        n = s = 0
        with tarfile.open(arc, "r|gz") as t:
            for m in t:
                t.members = []  # sans cela tarfile garde tous les membres en mémoire (plusieurs Go)
                if not m.isfile():
                    continue
                nom = m.name
                base_nom = nom.rsplit("/", 1)[-1]
                if base_nom == "liste_suppression_legi.dat":
                    for ligne in t.extractfile(m).read().decode().splitlines():
                        ident = ligne.strip().rsplit("/", 1)[-1]
                        if ident.startswith("LEGIARTI"):
                            db.execute("DELETE FROM art WHERE id=?", (ident,))
                            s += 1
                elif base_nom.startswith("LEGIARTI") and "/article/" in nom and base_nom.endswith(".xml"):
                    a = parse_article(t.extractfile(m).read())
                    if a and a["id"]:
                        db.execute("INSERT OR REPLACE INTO art VALUES(?,?,?,?,?,?,?,?,?,?)",
                                   (a["id"], a["num"], a["etat"], a["debut"], a["fin"], a["code_cid"],
                                    a["code_nom"], json.dumps(a["versions"]), json.dumps(a["liens"], ensure_ascii=False),
                                    arc.name))
                        n += 1
                        if n % 50000 == 0:
                            db.commit()
                            print(f"  {arc.name}: {n} articles...", file=log, flush=True)
        db.execute("INSERT OR REPLACE INTO traite VALUES(?,?,?)", (arc.name, n, s))
        db.commit()
        print(f"{arc.name}: {n} articles de codes, {s} suppressions", file=log, flush=True)
    return db


def charger_index(db) -> tuple:
    lignes = []
    for r in db.execute("SELECT id,num,etat,debut,fin,code_cid,code_nom,versions,liens FROM art"):
        lignes.append({"id": r[0], "num": r[1], "etat": r[2], "debut": r[3], "fin": r[4], "code_cid": r[5],
                       "code_nom": r[6], "versions": json.loads(r[7]), "liens": json.loads(r[8])})
    index = marquer_renumerotes(agreger_par_cid(lignes))
    ids = {i: c for c, f in index.items() for i in f["ids"]}
    return index, ids


def charger_codes_droit_org(dossier: Path = None) -> dict:
    """{code_cid: {nom, articles_vigueur, cids}} d'après les XML de codes.droit.org (flux)."""
    out = {}
    for f in sorted((dossier or CODES_DROIT_ORG).glob("*.xml")):
        code, n, cids, vids = None, 0, set(), set()
        for ev, el in ET.iterparse(str(f), events=("start", "end")):
            if ev == "start" and el.tag == "code":
                code = (el.get("id"), el.get("nom"))
            elif ev == "end" and el.tag == "article":
                if el.get("etat") == "VIGUEUR":
                    n += 1
                    cids.add(el.get("cid"))
                    vids.add(el.get("id"))
                el.clear()
        if code:
            out[code[0]] = {"nom": code[1], "articles_vigueur": n, "cids": cids, "ids": vids}
    return out


def main(argv: list) -> int:
    cmd = argv[0] if argv else "comparer"
    if cmd == "extraire":
        extraire()
        return 0
    db = sqlite3.connect(str(EXTRAIT / "legi.sqlite"))
    index, ids = charger_index(db)
    cdo = charger_codes_droit_org()
    vig_legi, noms = defaultdict(int), {}
    for f in index.values():
        noms[f["code_cid"]] = f["code_nom"]
        if f["statut"] == "vigueur":
            vig_legi[f["code_cid"]] += 1
    cdo_vig = {c: v["articles_vigueur"] for c, v in cdo.items()}
    # concordance des cid (contrôle de la définition du cid)
    ok = vig_ok = tot = 0
    for c, v in cdo.items():
        for i in v["ids"]:
            tot += 1
            ok += i in ids
            vig_ok += (i in ids and index[ids[i]]["statut"] == "vigueur")
    print(f"articles en vigueur de codes.droit.org retrouvés dans LEGI : {ok}/{tot} (en vigueur aussi dans LEGI : {vig_ok})")
    comp = comparer_codes({c: n for c, n in vig_legi.items() if c in cdo or n > 0}, cdo_vig)
    EXTRAIT.mkdir(parents=True, exist_ok=True)
    with open(EXTRAIT / "comparaison_codes.tsv", "w", encoding="utf-8") as f:
        f.write("code_cid\tnom\tlegi_vigueur\tcodes_droit_org\tecart\tratio\ttronque\n")
        for l in comp:
            if l["cdo"] or l["legi"] > 50:
                nom = noms.get(l["code_cid"]) or cdo.get(l["code_cid"], {}).get("nom", "")
                f.write(f"{l['code_cid']}\t{nom}\t{l['legi']}\t{l['cdo']}\t{l['ecart']}\t{l['ratio']}\t{int(l['tronque'])}\n")
    with gzip.open(EXTRAIT / "index_articles.tsv.gz", "wt", encoding="utf-8") as f:
        f.write("cid\tcode_cid\tcode\tnum\tstatut\tdate_debut\tdate_abrogation\tremplacant_cid\tid_vigueur\tn_versions\tnumeros\n")
        for c, x in sorted(index.items()):
            f.write("\t".join([c, x["code_cid"], x["code_nom"], x["num"], x["statut"], x["date_debut"],
                               x["date_abrogation"], x["remplacant_cid"], x["id_vigueur"], str(x["n_versions"]),
                               "|".join(x["numeros"])]) + "\n")
    for l in comp:
        if l["tronque"] and l["cdo"]:
            print("TRONQUE", noms.get(l["code_cid"]) or cdo[l["code_cid"]]["nom"], l["legi"], l["cdo"])
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
