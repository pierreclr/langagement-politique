#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Analyse statique de tous les codes en vigueur (T55, passage à l'échelle).

Source : XML de codes.droit.org (droit positif : seuls les articles en vigueur y
figurent ; les renvois y sont déjà résolus par la DILA : l'attribut `idArticle` de
l'URL est l'identifiant stable (cid) de l'article cité, `destinationid` la version
visée).  Un renvoi est « mort » quand le cid cité n'existe plus parmi les articles
en vigueur d'un code chargé : article abrogé, renuméroté ou supprimé (la distinction
exigerait la base LEGI complète, voir sources/rules-as-code-analyse-statique.md).

CORRECTION DU 02/11/2026 : les copies de codes.droit.org sont parfois tronquées (CCH, code du domaine
public fluvial). Les renvois sont donc vérifiés contre l'index LEGI complet (`legi_complet.py`, versions
abrogées comprises) : un renvoi absent de codes.droit.org n'est « mort » que si LEGI ne le donne pas en
vigueur ; il est alors classé abrogé (avec date), renuméroté ou inexistant. Une garde « code tronqué »
signale les codes dont la copie locale a moins de 90 % des articles en vigueur de LEGI.

Fonctions pures (aucun accès disque) : lire_code (flux), analyser_article, resoudre,
renvois_morts, composantes, cycles_de_report, chaines, etc.  Seuls `iter_articles`,
`ecrire_csv` et `main` touchent le disque.  Python 3.9, bibliothèque standard seule.

Usage : python3 outils/droit/analyse_corpus.py [--entree DOSSIER] [--sortie DOSSIER]
        [--codes "Code civil,..."] [--echantillon 30 --graine 1]
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import random
import re
import sys
import unicodedata
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

ENTREE = Path.home() / "Documents/langagement-donnees/sources/legi/codes-droit-org"
SORTIE = Path.home() / "Documents/langagement-donnees/resultats/droit"

MOIS = {m: i + 1 for i, m in enumerate(
    ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
     "septembre", "octobre", "novembre", "décembre"])}

# Codes dont le fichier codes.droit.org est incomplet (vérifié : le Code des douanes n'y contient
# aucun article numérique 1 à 500) : on ne l'utilise pas comme cible de renvois morts.
CODES_INCOMPLETS = {"LEGITEXT000006071570"}

# ------------------------------------------------------------------ motifs
RE_DEROG = re.compile(
    r"(par d[ée]rogation|sous r[ée]serve|sans pr[ée]judice|[àa] l['’]exception|"
    r"par exception|nonobstant|[àa] moins que|[àa] d[ée]faut|sauf)", re.I)
RE_DIFFERE = re.compile(
    r"(dans les (conditions|limites|formes)|selon les (modalit[ée]s|conditions|r[èe]gles)|"
    r"conform[ée]ment|dans les cas|aux conditions|selon les dispositions)"
    r"[^.;]{0,60}(pr[ée]vu|d[ée]fini|fix[ée]|[ée]nonc[ée]|d[ée]termin[ée]|pr[ée]cis[ée])", re.I)
RE_DECRET = re.compile(
    r"d[ée]cret(?:s)?(?: en conseil d['’][ée]tat| simple| pris en conseil d['’][ée]tat)?"
    r"[^.;]{0,120}?(d[ée]termine|d[ée]terminent|fixe|fixent|pr[ée]cise|pr[ée]cisent|"
    r"d[ée]finit|d[ée]finissent|en fixe|en d[ée]termine|en pr[ée]cise|"
    r"sont fix[ée]e?s|est fix[ée]e?|sont d[ée]termin[ée]e?s|est d[ée]termin[ée]e?|"
    r"sont pr[ée]cis[ée]e?s|est pr[ée]cis[ée]e?|sont d[ée]fini[es]?|"
    r"modalit[ée]s d['’]application|conditions d['’]application)", re.I)
RE_DECRET2 = re.compile(
    r"(modalit[ée]s|conditions)[^.;]{0,100}(fix[ée]e?s|d[ée]termin[ée]e?s|pr[ée]cis[ée]e?s|d[ée]fini[es]?)"
    r"[^.;]{0,20}par\s+(un\s+)?d[ée]cret", re.I)
RE_MONTANT = re.compile(
    r"(?P<n>\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*"
    r"(?P<m>euros?\b|€|francs?\b(?:\s+(?:CFP|pacifique))?|F\b)", re.I)
RE_PENAL = re.compile(r"(amende|emprisonnement|peine|sanction|contravention|astreinte)", re.I)
RE_ENVIGUEUR = re.compile(r"en vigueur le (\d{1,2})(?:er)? ([a-zéûô]+) (\d{4})", re.I)
RE_NUM_TITRE = re.compile(r"- art\. (.+?) \((?:[A-Z]+)\)\s*$")
RE_NUM_TEXTE = re.compile(r"((?:[LRDA]\.?\s*)?\d+(?:-\d+)*(?:\s+(?:(?-i:[A-Z]{1,3})|bis|ter|quater|quinquies|sexies|"
                          r"septies|octies|nonies|decies|undecies|duodecies|terdecies|quaterdecies|"
                          r"quindecies|sexdecies|septdecies|octodecies|novodecies|vicies)\b)*)", re.I)


def sans_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def norm_num(num: str) -> str:
    """'L. 123-4 bis' -> 'l123-4bis'."""
    return re.sub(r"[\s. ]", "", sans_accents(num or "")).lower()


def date_fr(s: str):
    m = RE_ENVIGUEUR.search(s or "")
    if not m:
        return None
    mois = MOIS.get(m.group(2).lower())
    if not mois:
        return None
    try:
        return dt.date(int(m.group(3)), mois, int(m.group(1)))
    except ValueError:
        return None


def parse_date(s: str):
    try:
        return dt.date.fromisoformat(s[:10])
    except (TypeError, ValueError):
        return None


# ------------------------------------------------------------------ lecture
def aplatir(elem):
    """Texte d'un élément XML et positions des ancres <a> : (texte, [(debut, fin, attrs)])."""
    parts, liens, pos = [], [], [0]

    def add(t):
        if t:
            parts.append(t)
            pos[0] += len(t)

    def rec(e):
        add(e.text)
        for ch in e:
            if ch.tag == "a":
                d = pos[0]
                add(ch.text)
                for sub in ch:  # ancres sans enfants en pratique
                    add(sub.text)
                    add(sub.tail)
                liens.append((d, pos[0], dict(ch.attrib)))
            else:
                if ch.tag in ("br", "p", "div", "tr", "td", "th"):
                    add(" ")
                rec(ch)
            add(ch.tail)

    rec(elem)
    return "".join(parts), liens


def phrase_autour(texte: str, i: int, j: int, largeur: int = 160) -> str:
    return re.sub(r"\s+", " ", texte[max(0, i - largeur):j + largeur // 2]).strip()


def analyser_article(attrs: dict, texte: str, liens: list, chemin: list, code: dict) -> dict:
    """Extrait d'un article tout ce qui sert aux détecteurs. Pure."""
    num = attrs.get("num", "")
    id_, cid = attrs.get("id", ""), attrs.get("cid", "")
    out = {
        "code": code["nom"], "code_id": code["id"], "num": num, "id": id_, "cid": cid,
        "etat": attrs.get("etat", ""), "date": attrs.get("date", ""),
        "modTitle": attrs.get("modTitle", ""), "mots": len(texte.split()),
        "chemin": " > ".join(chemin[-3:]),
    }
    # renvois
    rv = []
    for d, f, a in liens:
        typ = a.get("type", "")
        if typ not in ("article-internal", "article-external", "section-internal", "section-external"):
            continue
        q = urllib.parse.urlparse(a.get("href", "")).query
        qs = urllib.parse.parse_qs(q)
        cible_cid = (qs.get("idArticle") or [""])[0] if typ.startswith("article") else a.get("targetid", "")
        code_cible = (qs.get("cidTexte") or [""])[0]
        if typ.startswith("section"):
            code_cible = code_cible or ""
        titre = a.get("title", "")
        m = RE_NUM_TITRE.search(titre)
        ancre = texte[d:f]
        num_cible = m.group(1) if m else ""
        if not num_cible:
            m2 = RE_NUM_TEXTE.search(ancre)
            if m2:
                num_cible = m2.group(1)
        avant = texte[max(0, d - 110):d]
        rv.append({
            "type": typ, "cible_cid": cible_cid, "cible_dest": a.get("destinationid", ""),
            "code_cible": code_cible, "num_cible": num_cible.strip(), "ancre": ancre.strip(),
            "derog": bool(RE_DEROG.search(avant)), "differe": bool(RE_DIFFERE.search(texte[max(0, d - 90):f + 5])),
            "contexte": phrase_autour(texte, d, f),
        })
    out["renvois"] = rv
    # décret d'application attendu
    phr = re.split(r"(?<=[.;])\s+", texte)
    dec = [p for p in phr if (RE_DECRET.search(p) or RE_DECRET2.search(p))]
    out["decret"] = re.sub(r"\s+", " ", dec[0])[:300] if dec else ""
    out["arrete"] = bool(re.search(r"arr[êe]t[ée]\s+(du|des|conjoint|interminist|minist|pris|fixe|d[ée]termine)", texte, re.I))
    # montants
    mt = []
    for m in RE_MONTANT.finditer(texte):
        brut = m.group("n")
        try:
            val = float(re.sub(r"[\s  ]", "", brut).replace(",", "."))
        except ValueError:
            continue
        dev = m.group("m").lower()
        monnaie = "EUR" if dev.startswith(("euro", "€")) else ("CFP" if "cfp" in dev or "pacifique" in dev else "FRF")
        ctx = phrase_autour(texte, m.start(), m.end(), 100)
        if monnaie == "FRF" and dev == "f":
            continue  # « 5 F » : trop ambigu (références, lettres)
        mt.append({"valeur": val, "monnaie": monnaie, "pénal": bool(RE_PENAL.search(ctx)), "contexte": ctx})
    out["montants"] = mt
    # exceptions
    out["n_derog"] = len(RE_DEROG.findall(texte))
    out["n_differe"] = len(RE_DIFFERE.findall(texte))
    return out


def iter_articles(chemin: Path):
    """Flux d'articles analysés + métadonnées du code (en dernier : (None, code))."""
    code, pile = None, []
    sections = {}
    for ev, el in ET.iterparse(str(chemin), events=("start", "end")):
        if ev == "start":
            if el.tag == "code":
                code = {"nom": el.get("nom"), "id": el.get("id"), "lastup": el.get("lastup")}
            elif el.tag == "t":
                pile.append(el.get("title", "").strip())
                sections[el.get("id")] = el.get("etat")
        else:
            if el.tag == "t":
                pile.pop()
                el.clear()
            elif el.tag == "article":
                texte, liens = aplatir(el)
                yield analyser_article(el.attrib, texte, liens, pile, code)
                el.clear()
    yield None, {"code": code, "sections": sections}


# ------------------------------------------------------------------ résolution / détecteurs
def construire_index(articles: list) -> dict:
    """Index global : cids vivants, versions vivantes, (code, num normalisé) -> cids."""
    cids, ids, par_num, code_ids = {}, {}, defaultdict(set), {}
    for a in articles:
        if a["etat"] != "VIGUEUR":
            continue
        cids[a["cid"]] = a
        ids[a["id"]] = a["cid"]
        par_num[(a["code_id"], norm_num(a["num"]))].add(a["cid"])
        code_ids[a["code_id"]] = a["code"]
    return {"cids": cids, "ids": ids, "par_num": par_num, "codes": code_ids}


def etat_renvoi(r: dict, index: dict) -> str:
    """vivant | mort | hors_corpus | section (non testé) pour un renvoi d'article."""
    if not r["type"].startswith("article"):
        return "section"
    if r["code_cible"] not in index["codes"] or r["code_cible"] in CODES_INCOMPLETS:
        return "hors_corpus"
    if r["cible_cid"] in index["cids"] or r["cible_dest"] in index["ids"]:
        return "vivant"
    return "mort"


def classer_renvoi_legi(r: dict, legi_index: dict, legi_ids: dict, par_num: dict = None) -> dict:
    """Classe un renvoi absent de codes.droit.org d'après l'index LEGI complet (fonction pure).

    etat : vigueur (faux mort : copie locale incomplète) | futur | abroge | renumerote | transfere | inexistant.
    """
    c = legi_index_cid(r, legi_index, legi_ids)
    via_numero = False
    if c is None and par_num is not None and r.get("num_cible"):
        # identifiant cité inconnu de LEGI : repli sur (code cible, numéro) ; on préfère l'article en vigueur
        cands = par_num.get((r["code_cible"], norm_num(r["num_cible"])), [])
        vivants = [k for k in cands if legi_index[k]["statut"] == "vigueur"]
        if vivants:
            return {"etat": "numero_repris", "date_abrogation": "", "remplacant": vivants[0], "via_numero": True}
        if cands:
            c = max(cands, key=lambda k: legi_index[k]["date_abrogation"] or "")
            via_numero = True
    if c is None:
        return {"etat": "inexistant", "date_abrogation": "", "remplacant": ""}
    f = legi_index[c]
    return {"etat": f["statut"], "date_abrogation": f["date_abrogation"], "remplacant": f.get("remplacant_cid", ""),
            "num_legi": f["num"], "code_legi": f["code_nom"], "via_numero": via_numero}


def legi_index_cid(r: dict, legi_index: dict, legi_ids: dict):
    for k in (r["cible_cid"], legi_ids.get(r["cible_dest"]), legi_ids.get(r["cible_cid"])):
        if k and k in legi_index:
            return k
    return None


def renvois_morts(articles: list, index: dict, legi_index: dict = None, legi_ids: dict = None,
                  tronques: set = None, stats: dict = None, par_num: dict = None) -> list:
    """Renvois morts. Sans LEGI : méthode d'origine (codes.droit.org seul). Avec LEGI : voir en-tête.

    `stats` (dict) reçoit : faux_morts_vivants_dans_legi (vigueur dans LEGI), par_etat, vers_code_tronque.
    """
    out = []
    tronques = tronques or set()
    for a in articles:
        for r in a["renvois"]:
            if legi_index is None:
                if etat_renvoi(r, index) != "mort":
                    continue
            else:
                if not r["type"].startswith("article"):
                    continue
                if r["cible_cid"] in index["cids"] or r["cible_dest"] in index["ids"]:
                    continue  # vivant dans codes.droit.org : vivant
            cl = None
            if legi_index is not None:
                cl = classer_renvoi_legi(r, legi_index, legi_ids, par_num)
                if stats is not None:
                    stats.setdefault("par_etat", Counter())[cl["etat"]] += 1
                    if r["code_cible"] in tronques:
                        stats["vers_code_tronque"] = stats.get("vers_code_tronque", 0) + 1
                if cl["etat"] in ("vigueur", "futur"):
                    if stats is not None:
                        stats["faux_morts_vivants_dans_legi"] = stats.get("faux_morts_vivants_dans_legi", 0) + 1
                    continue
            nn = norm_num(r["num_cible"])
            reutilise = bool(nn and index["par_num"].get((r["code_cible"], nn)))
            ligne = {
                "code": a["code"], "article": a["num"], "version_date": a["date"],
                "cible_code": index["codes"].get(r["code_cible"], ""), "cible_num": r["num_cible"],
                "cible_cid": r["cible_cid"], "numero_reutilise": reutilise,
                "confiance": "a_verifier_renumerotation_possible" if reutilise else "haute",
                "externe": r["type"] == "article-external", "contexte": r["contexte"],
            }
            if cl is not None:
                ligne.update({"etat_legi": cl["etat"], "date_abrogation": cl["date_abrogation"],
                              "remplacant_cid": cl["remplacant"], "via_numero": cl.get("via_numero", False),
                              "code_cible_tronque": r["code_cible"] in tronques})
                if cl["etat"] == "renumerote":
                    ligne["confiance"] = "renumerote_a_l_identique"
                elif cl["etat"] in ("abroge", "transfere"):
                    ligne["confiance"] = "haute"
                elif cl["etat"] == "inexistant":
                    ligne["confiance"] = "inexistant_dans_legi"
            out.append(ligne)
    return out


def graphe(articles: list, index: dict) -> tuple:
    """Graphe orienté sur les cids vivants ; arêtes : (src, dst, derog, differe)."""
    g, derog, differe = defaultdict(set), defaultdict(set), defaultdict(set)
    for a in articles:
        if a["etat"] != "VIGUEUR":
            continue
        for r in a["renvois"]:
            if etat_renvoi(r, index) != "vivant":
                continue
            dst = r["cible_cid"] if r["cible_cid"] in index["cids"] else index["ids"].get(r["cible_dest"])
            if not dst:
                continue
            if dst == a["cid"]:
                continue
            g[a["cid"]].add(dst)
            if r["derog"]:
                derog[a["cid"]].add(dst)
            if r["differe"]:
                differe[a["cid"]].add(dst)
    return g, derog, differe


def composantes(g: dict) -> list:
    """Composantes fortement connexes (Tarjan itératif). Renvoie les listes de taille >= 2."""
    index, low, on, pile, res, cnt = {}, {}, set(), [], [], [0]
    noeuds = set(g) | {w for vs in g.values() for w in vs}
    for s in noeuds:
        if s in index:
            continue
        pile_appel = [(s, iter(g.get(s, ())))]
        index[s] = low[s] = cnt[0]
        cnt[0] += 1
        pile.append(s)
        on.add(s)
        while pile_appel:
            v, it = pile_appel[-1]
            avance = False
            for w in it:
                if w not in index:
                    index[w] = low[w] = cnt[0]
                    cnt[0] += 1
                    pile.append(w)
                    on.add(w)
                    pile_appel.append((w, iter(g.get(w, ()))))
                    avance = True
                    break
                elif w in on:
                    low[v] = min(low[v], index[w])
            if avance:
                continue
            pile_appel.pop()
            if pile_appel:
                u = pile_appel[-1][0]
                low[u] = min(low[u], low[v])
            if low[v] == index[v]:
                comp = []
                while True:
                    w = pile.pop()
                    on.discard(w)
                    comp.append(w)
                    if w == v:
                        break
                if len(comp) >= 2:
                    res.append(comp)
    return res


def cycles_de_report(g: dict, differe: dict) -> list:
    """Paires A <-> B où chacun renvoie à l'autre pour définir ses conditions (« dans les
    conditions prévues à l'article … ») : aucune des deux ne contient la règle."""
    out = []
    for a, vs in differe.items():
        for b in vs:
            if a < b and a in differe.get(b, ()):
                out.append((a, b))
    return out


def plus_longue_chaine(derog: dict, max_depth: int = 50) -> list:
    """Plus longue chaîne d'exceptions (dérogation à ... sous réserve de ...) sans répéter un
    nœud, calculée sur le graphe condensé (les composantes sont aplaties en un seul nœud).
    Renvoie la liste des chaînes maximales (une par racine) triées par longueur."""
    comps = composantes(derog)
    rep = {}
    for c in comps:
        for n in c:
            rep[n] = c[0]
    taille = {c[0]: len(c) for c in comps}
    dag = defaultdict(set)
    for a, vs in derog.items():
        for b in vs:
            ra, rb = rep.get(a, a), rep.get(b, b)
            if ra != rb:
                dag[ra].add(rb)
    memo = {}

    def profondeur(n):
        # DFS itératif avec mémoïsation
        pile = [n]
        while pile:
            v = pile[-1]
            if v in memo:
                pile.pop()
                continue
            non_faits = [w for w in dag.get(v, ()) if w not in memo]
            if non_faits:
                pile.extend(non_faits)
                continue
            best = (0, None)
            for w in dag.get(v, ()):
                if memo[w][0] + 1 > best[0]:
                    best = (memo[w][0] + 1, w)
            memo[v] = best
            pile.pop()
        return memo[n][0]

    chaines = []
    entrants = {w for vs in dag.values() for w in vs}
    for n in list(dag):
        if n in entrants:
            continue
        profondeur(n)
        ch, v = [n], n
        while memo[v][1] is not None:
            v = memo[v][1]
            ch.append(v)
        chaines.append([(x, taille.get(x, 1)) for x in ch])
    chaines.sort(key=len, reverse=True)
    return chaines


def cle_chapitre(num: str):
    m = re.match(r"^([LRD])\.?\s*(\d+)", num or "")
    return (m.group(1), m.group(2)) if m else None


def cle_titres(chemin: str) -> str:
    """Deux derniers titres (sans le numéro « Chapitre II : ») pour retrouver le chapitre
    jumeau dans la partie réglementaire."""
    t = [re.sub(r"^[^:]{0,40}:\s*", "", x).strip().lower() for x in chemin.split(" > ")[-2:]]
    return " > ".join(t)


def decrets_sans_application(articles: list) -> list:
    """Articles de loi (L) qui annoncent un décret d'application alors qu'aucun article R/D
    de même chapitre n'existe dans le même code. N'a de sens que pour les codes à numérotation
    L/R/D (les arrêtés ne sont pas codifiés : non détectables)."""
    chapitres = defaultdict(set)
    titres_rd = set()
    cites_par_rd = set()  # cids d'articles de loi cités par un article R/D (n'importe quel code)
    for a in articles:
        if cle_chapitre(a["num"]) and cle_chapitre(a["num"])[0] in "RD":
            cites_par_rd.update(r["cible_cid"] for r in a["renvois"])
    codes_lrd = defaultdict(Counter)
    for a in articles:
        k = cle_chapitre(a["num"])
        if k and a["etat"] == "VIGUEUR":
            chapitres[(a["code_id"], k[1])].add(k[0])
            codes_lrd[a["code_id"]][k[0]] += 1
            if k[0] in "RD":
                titres_rd.add((a["code_id"], cle_titres(a["chemin"])))
    out = []
    for a in articles:
        k = cle_chapitre(a["num"])
        if not k or k[0] != "L" or not a["decret"] or a["etat"] != "VIGUEUR":
            continue
        c = codes_lrd[a["code_id"]]
        if not (c["L"] and (c["R"] or c["D"])):
            continue
        if chapitres[(a["code_id"], k[1])] & {"R", "D"} or a["cid"] in cites_par_rd:
            continue
        # numérotation non parallèle (ex. Code des postes) : on cherche aussi un R/D sous des titres identiques
        if (a["code_id"], cle_titres(a["chemin"])) in titres_rd:
            continue
        out.append({"code": a["code"], "article": a["num"], "version_date": a["date"],
                    "chemin": a["chemin"], "phrase": a["decret"]})
    return out


def montants_figes(articles: list, aujourdhui: dt.date, age_min: float = 15.0) -> list:
    out = []
    for a in articles:
        d = parse_date(a["date"])
        if not d or a["etat"] != "VIGUEUR":
            continue
        age = (aujourdhui - d).days / 365.25
        for m in a["montants"]:
            if m["monnaie"] == "FRF":
                type_ = "franc_en_vigueur"
            elif m["monnaie"] == "EUR" and age >= age_min and d >= dt.date(2002, 1, 1) - dt.timedelta(days=0) and m["valeur"] >= 2:
                type_ = "euro_fige"
            else:
                continue
            out.append({"code": a["code"], "article": a["num"], "version_date": a["date"],
                        "age_ans": round(age, 1), "type": type_, "valeur": m["valeur"],
                        "monnaie": m["monnaie"], "penal": m["pénal"], "contexte": m["contexte"]})
    return out


def date_jorf(s: str):
    m = re.search(r"JORF (\d{1,2})(?:er)? ([a-zéûô]+) (\d{4})", s or "", re.I)
    if not m or m.group(2).lower() not in MOIS:
        return None
    try:
        return dt.date(int(m.group(3)), MOIS[m.group(2).lower()], int(m.group(1)))
    except ValueError:
        return None


def dates_incoherentes(articles: list, aujourdhui: dt.date, lastup: dict = None) -> list:
    """Quatre motifs : date absente / du futur / antérieure à 1790 ; entrée en vigueur déclarée
    antérieure à la publication au JO (rétroactivité déclarée) ; entrée en vigueur déclarée à plus de
    5 ans de la publication ; version dont la date de début diffère de plus de 30 jours de
    l'entrée en vigueur annoncée dans son propre intitulé (métadonnée contradictoire)."""
    out = []
    for a in articles:
        d = parse_date(a["date"])
        ev = date_fr(a["modTitle"])
        jo = date_jorf(a["modTitle"])
        motif = None
        if not d:
            motif = "date_absente"
        elif d > aujourdhui:
            motif = "version_datee_du_futur"
        elif d.year < 1790:
            motif = "date_avant_1790"
        elif ev and jo and (ev - jo).days < -1:
            motif = "entree_en_vigueur_avant_publication_JO"
        elif ev and jo and (ev - jo).days > 365 * 5:
            motif = "entree_en_vigueur_a_plus_de_5_ans_de_la_publication"
        elif ev and abs((ev - d).days) > 30 and d > ev:
            motif = "version_posterieure_a_son_entree_en_vigueur_annoncee"
        if motif:
            out.append({"code": a["code"], "article": a["num"], "version_date": a["date"],
                        "entree_en_vigueur": ev.isoformat() if ev else "",
                        "publication_jo": jo.isoformat() if jo else "", "motif": motif,
                        "modTitle": a["modTitle"][:160]})
    return out


# ------------------------------------------------------------------ LEGI complet
def charger_legi(index: dict):
    """Index LEGI complet + codes tronqués (garde). Échoue clairement si legi.sqlite est absent."""
    import sqlite3
    sys.path.insert(0, str(Path(__file__).resolve().parent))  # python -I n'ajoute pas ce dossier
    import legi_complet as LC
    base = LC.EXTRAIT / "legi.sqlite"
    if not base.exists():
        raise SystemExit("legi.sqlite absent : lancer `python3 -I outils/droit/legi_complet.py extraire`")
    legi_index, legi_ids = LC.charger_index(sqlite3.connect(str(base)))
    vig_legi = defaultdict(int)
    for f in legi_index.values():
        if f["statut"] == "vigueur":
            vig_legi[f["code_cid"]] += 1
    vig_cdo = defaultdict(int)
    for a in index["cids"].values():
        vig_cdo[a["code_id"]] += 1
    comp = LC.comparer_codes({c: n for c, n in vig_legi.items() if c in vig_cdo}, dict(vig_cdo))
    return legi_index, legi_ids, LC.codes_tronques(comp)


def index_par_numero(legi_index: dict) -> dict:
    """(cid du code, numéro normalisé) -> [clés d'articles LEGI] (tous les états)."""
    out = defaultdict(list)
    for k, f in legi_index.items():
        for n in f["numeros"] or [f["num"]]:
            out[(f["code_cid"], norm_num(n))].append(k)
    return out


# ------------------------------------------------------------------ sortie
def ecrire_csv(chemin: Path, lignes: list, champs: list = None):
    chemin.parent.mkdir(parents=True, exist_ok=True)
    if lignes and not champs:
        champs = list(lignes[0].keys())
    with open(chemin, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=champs or ["vide"], extrasaction="ignore")
        w.writeheader()
        for l in lignes:
            w.writerow(l)


def analyser(fichiers: list, aujourdhui: dt.date):
    articles, metas = [], []
    for f in fichiers:
        for a in iter_articles(f):
            if isinstance(a, tuple):
                metas.append(a[1])
            else:
                articles.append(a)
        print(f"  lu : {f.name} ({len(articles)} articles cumulés)", file=sys.stderr)
    return articles, metas


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--entree", type=Path, default=ENTREE)
    ap.add_argument("--sortie", type=Path, default=SORTIE)
    ap.add_argument("--codes", default="", help="liste de noms de fichiers (sous-chaînes) séparés par des virgules")
    ap.add_argument("--aujourdhui", default="2026-11-02")
    ap.add_argument("--sans-legi", action="store_true", help="méthode d'origine (codes.droit.org seul, non fiable)")
    ap.add_argument("--echantillon", type=int, default=0)
    ap.add_argument("--graine", type=int, default=1)
    args = ap.parse_args(argv)
    aujourdhui = dt.date.fromisoformat(args.aujourdhui)
    fichiers = sorted(args.entree.glob("*.xml"))
    if args.codes:
        mots = [urllib.parse.quote(c.strip()) for c in args.codes.split(",")]
        fichiers = [f for f in fichiers if any(m in f.name for m in mots)]
    articles, metas = analyser(fichiers, aujourdhui)
    index = construire_index(articles)
    legi_index = legi_ids = None
    tronques, stats = set(), {}
    if not args.sans_legi:
        legi_index, legi_ids, tronques = charger_legi(index)
    par_num = index_par_numero(legi_index) if legi_index is not None else None
    morts = renvois_morts(articles, index, legi_index, legi_ids, tronques, stats, par_num)
    g, derog, differe = graphe(articles, index)
    sccs = composantes(g)
    report = cycles_de_report(g, differe)
    chs = plus_longue_chaine(derog)
    decr = decrets_sans_application(articles)
    figes = montants_figes(articles, aujourdhui)
    dates = dates_incoherentes(articles, aujourdhui, {})
    cid2 = index["cids"]
    label = lambda c: f"{cid2[c]['code']} {cid2[c]['num']}" if c in cid2 else c

    # statistiques par code
    par = defaultdict(lambda: Counter())
    for a in articles:
        if a["etat"] != "VIGUEUR":
            continue
        p = par[a["code"]]
        p["articles"] += 1
        p["mots"] += a["mots"]
        p["renvois_articles"] += sum(1 for r in a["renvois"] if r["type"].startswith("article"))
        p["articles_avec_decret"] += 1 if a["decret"] else 0
    for lst, cle in ((morts, "renvois_morts"), (decr, "decrets_sans_application"),
                     (figes, "montants_figes"), (dates, "dates_incoherentes")):
        for l in lst:
            par[l["code"]][cle] += 1
    entrants = Counter()
    for a, vs in g.items():
        for b in vs:
            entrants[b] += 1
    for a, vs in g.items():
        par[cid2[a]["code"]]["aretes_resolues"] += len(vs)
    for c in sccs:
        par[cid2[c[0]]["code"]]["articles_dans_cycles"] += len(c)
    lignes = [dict(code=k, **{c: v.get(c, 0) for c in (
        "articles", "mots", "renvois_articles", "aretes_resolues", "renvois_morts", "articles_dans_cycles",
        "articles_avec_decret", "decrets_sans_application", "montants_figes", "dates_incoherentes")})
        for k, v in sorted(par.items())]
    tot = {c: sum(l[c] for l in lignes) for c in lignes[0] if c != "code"} if lignes else {}
    ecrire_csv(args.sortie / "stats_par_code.csv", lignes + [dict(code="TOTAL", **tot)])
    ecrire_csv(args.sortie / "renvois_morts.csv", morts)
    ecrire_csv(args.sortie / "decrets_sans_application.csv", decr)
    ecrire_csv(args.sortie / "montants_figes.csv", figes)
    ecrire_csv(args.sortie / "dates_incoherentes.csv", dates)
    ecrire_csv(args.sortie / "cycles_composantes.csv", [
        {"taille": len(c), "codes": ";".join(sorted({cid2[x]["code"] for x in c})),
         "exemple": " | ".join(label(x) for x in sorted(c)[:8])} for c in sorted(sccs, key=len, reverse=True)])
    ecrire_csv(args.sortie / "cycles_de_report.csv", [
        {"a": label(a), "b": label(b), "contexte_a": "", "chemin_a": cid2[a]["chemin"]} for a, b in report])
    ecrire_csv(args.sortie / "chaines_exceptions.csv", [
        {"longueur": len(c), "chaine": " -> ".join(label(x) + (f" [noeud circulaire de {n} articles]" if n > 1 else "") for x, n in c)}
        for c in chs[:500]])
    ecrire_csv(args.sortie / "articles_plus_longs.csv", [
        {"code": a["code"], "article": a["num"], "mots": a["mots"], "date": a["date"]}
        for a in sorted((x for x in articles if x["etat"] == "VIGUEUR"), key=lambda x: -x["mots"])[:500]])
    ecrire_csv(args.sortie / "articles_plus_renvoyes.csv", [
        {"code": cid2[c]["code"], "article": cid2[c]["num"], "renvois_entrants": n}
        for c, n in entrants.most_common(500) if c in cid2])
    ecrire_csv(args.sortie / "articles_plus_derogatoires.csv", [
        {"code": a["code"], "article": a["num"], "marqueurs_derogation": a["n_derog"], "mots": a["mots"]}
        for a in sorted((x for x in articles if x["etat"] == "VIGUEUR"), key=lambda x: -x["n_derog"])[:500]])
    if stats:
        print("RENVOIS (LEGI)", dict(stats.get("par_etat", {})), "faux morts (vivants dans LEGI)",
              stats.get("faux_morts_vivants_dans_legi", 0), "vers codes tronqués", stats.get("vers_code_tronque", 0),
              "codes tronqués", len(tronques), file=sys.stderr)
        ecrire_csv(args.sortie / "synthese_renvois_morts.csv",
                   [{"etat": k, "n": v} for k, v in sorted(stats.get("par_etat", {}).items())]
                   + [{"etat": "faux_morts_vivants_dans_legi", "n": stats.get("faux_morts_vivants_dans_legi", 0)}])
    print("TOTAL", tot, "cycles", len(sccs), "report", len(report), "chaine max",
          len(chs[0]) if chs else 0, file=sys.stderr)
    if args.echantillon:
        rnd = random.Random(args.graine)
        ech = []
        for nom, lst in (("renvois_morts", morts), ("decrets_sans_application", decr),
                         ("montants_figes", figes), ("dates_incoherentes", dates)):
            for l in rnd.sample(lst, min(args.echantillon, len(lst))):
                ech.append(dict(type_detection=nom, **{k: str(v)[:300] for k, v in l.items()}))
        ecrire_csv(args.sortie / "echantillon_verification.csv", ech,
                   ["type_detection"] + sorted({k for e in ech for k in e if k != "type_detection"}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
