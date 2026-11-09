#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Flux législatif (T67/T70, 09/11/2026) : extraction complémentaire des archives DILA.

`outils/droit/legi_complet.py` a déjà rangé dans `legi/extrait/legi.sqlite` les 556 217 versions
d'articles (dates, états, liens) mais pas leur texte.  Ce script relit les mêmes archives en flux et
ajoute, dans une base séparée (`langagement-donnees/sources/flux-legislatif/legi_mots.sqlite` et `jorf_textes.sqlite`) :

- table `v`  : une ligne par version d'article LEGI : id, nombre de mots, catégorie (code | tnc,
  d'après le chemin dans l'archive : `code_en_vigueur`/`code_non_vigueur` = code) ;
- table `t`  : une ligne par texte du Journal officiel (JORF) : id, nature, date de publication, NOR,
  titre (pour compter les lois et décrets publiés).

Fonctions pures (testées) : mots_du_xml, categorie_du_chemin, meta_jorf.
Usage : python3 -I extraire.py legi | jorf      (reprenable : archives déjà traitées sautées)
Python 3.9, bibliothèque standard seule.
"""
from __future__ import annotations

import html
import re
import sqlite3
import sys
import tarfile
from pathlib import Path

DONNEES = Path.home() / "Documents/langagement-donnees/sources"
DILA = DONNEES / "legi/dila"
JORF_GLOBAL = DONNEES / "jorf_global"
JORF_INCR = DONNEES / "jorf_increments"
BASES = {"legi": DONNEES / "flux-legislatif/legi_mots.sqlite", "jorf": DONNEES / "flux-legislatif/jorf_textes.sqlite"}

_BLOC = re.compile(rb"<BLOC_TEXTUEL>\s*<CONTENU>(.*?)</CONTENU>", re.S)
_ID = re.compile(rb"<ID>([^<]+)</ID>")
_BALISE = re.compile(r"<[^>]+>")


def mots_du_xml(contenu: bytes) -> tuple:
    """XML d'une version d'article LEGI -> (id, nombre de mots du texte de l'article).

    Mots = texte de BLOC_TEXTUEL/CONTENU, balises remplacées par une espace, entités décodées,
    découpé sur les blancs (même convention que outils/droit/analyse_corpus.py : len(texte.split())).
    """
    m = _ID.search(contenu)
    ident = m.group(1).decode().strip() if m else ""
    b = _BLOC.search(contenu)
    if not b:
        return ident, 0
    texte = html.unescape(_BALISE.sub(" ", b.group(1).decode("utf-8", "replace")))
    return ident, len(texte.split())


def categorie_du_chemin(chemin: str) -> str:
    """'.../code_en_vigueur/...' ou '.../code_non_vigueur/...' -> 'code' ; sinon 'tnc' (texte non codifié)."""
    return "code" if ("/code_en_vigueur/" in chemin or "/code_non_vigueur/" in chemin) else "tnc"


def _champ(contenu: str, balise: str) -> str:
    m = re.search(rf"<{balise}>([^<]*)</{balise}>", contenu)
    return html.unescape(m.group(1)).strip() if m else ""


def meta_jorf(contenu: bytes) -> dict:
    """XML texte/version JORF -> {id, nature, date_publi, date_texte, nor, num, titre}."""
    s = contenu[:20000].decode("utf-8", "replace")
    return {"id": _champ(s, "ID"), "nature": _champ(s, "NATURE"), "date_publi": _champ(s, "DATE_PUBLI"),
            "date_texte": _champ(s, "DATE_TEXTE"), "nor": _champ(s, "NOR"), "num": _champ(s, "NUM"),
            "titre": _champ(s, "TITREFULL")[:300] or _champ(s, "TITRE")[:300]}


# ------------------------------------------------------------------ E/S
SCHEMA = """CREATE TABLE IF NOT EXISTS v(id TEXT PRIMARY KEY, mots INT, cat TEXT, source TEXT);
CREATE TABLE IF NOT EXISTS t(id TEXT PRIMARY KEY, nature TEXT, date_publi TEXT, date_texte TEXT, nor TEXT,
 num TEXT, titre TEXT, source TEXT);
CREATE TABLE IF NOT EXISTS traite(archive TEXT PRIMARY KEY, n INT, suppr INT);"""


def _db(quoi):
    BASES[quoi].parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(BASES[quoi]))
    db.executescript(SCHEMA)
    return db


def _traiter(db, archives, nature: str, log=sys.stderr):
    faits = {r[0] for r in db.execute("SELECT archive FROM traite")}
    for arc in archives:
        if arc.name in faits:
            continue
        n = s = 0
        with tarfile.open(arc, "r|gz") as tf:
            for m in tf:
                tf.members = []
                if not m.isfile():
                    continue
                nom = m.name
                base = nom.rsplit("/", 1)[-1]
                if base.startswith("liste_suppression"):
                    for ligne in tf.extractfile(m).read().decode().splitlines():
                        ident = ligne.strip().rsplit("/", 1)[-1]
                        if nature == "legi" and ident.startswith("LEGIARTI"):
                            db.execute("DELETE FROM v WHERE id=?", (ident,)); s += 1
                        elif nature == "jorf" and ident.startswith("JORFTEXT"):
                            db.execute("DELETE FROM t WHERE id=?", (ident,)); s += 1
                elif nature == "legi" and base.startswith("LEGIARTI") and "/article/" in nom and base.endswith(".xml"):
                    ident, mots = mots_du_xml(tf.extractfile(m).read())
                    if ident:
                        db.execute("INSERT OR REPLACE INTO v VALUES(?,?,?,?)",
                                   (ident, mots, categorie_du_chemin(nom), arc.name))
                        n += 1
                elif nature == "jorf" and base.startswith("JORFTEXT") and "/texte/version/" in nom:
                    d = meta_jorf(tf.extractfile(m).read())
                    if d["id"]:
                        db.execute("INSERT OR REPLACE INTO t VALUES(?,?,?,?,?,?,?,?)",
                                   (d["id"], d["nature"], d["date_publi"], d["date_texte"], d["nor"], d["num"],
                                    d["titre"], arc.name))
                        n += 1
                if n and n % 100000 == 0:
                    db.commit()
                    print(f"  {arc.name}: {n}...", file=log, flush=True)
        db.execute("INSERT OR REPLACE INTO traite VALUES(?,?,?)", (arc.name, n, s))
        db.commit()
        print(f"{arc.name}: {n} fiches, {s} suppressions", file=log, flush=True)


def main(argv):
    quoi = argv[0] if argv else "legi"
    db = _db(quoi)
    if quoi == "legi":
        arcs = sorted(DILA.glob("Freemium_legi_global_*.tar.gz")) + sorted(DILA.glob("LEGI_*.tar.gz"))
    else:
        arcs = sorted(JORF_GLOBAL.glob("Freemium_jorf_global_*.tar.gz")) + sorted(JORF_INCR.glob("JORF_*.tar.gz"))
    _traiter(db, arcs, quoi)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
