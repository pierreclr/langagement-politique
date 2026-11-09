#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Flux législatif par mandat présidentiel (T67/T70, 09/11/2026).

Ce qui a été ajouté au droit codifié et ce qui en a été retiré, mandat par mandat, d'après
l'historique des versions d'articles de la base LEGI (DILA) :

- une **chaîne** = un article (toutes ses versions successives, clé = plus ancienne version) ;
- **création** = date de début de la première version valide de la chaîne ;
- **modification** = date de début de chaque version valide suivante (nouvelle rédaction) ;
- **abrogation** = date de fin de la dernière version valide quand son état est ABROGE, ABROGE_DIFF,
  PERIME, ANNULE ou DISJOINT ; **transfert** = même chose avec TRANSFERE ou DEPLACE ;
- **stock** à une date = versions valides dont début <= date < fin, avec leur nombre de mots.

Une version est valide si elle n'est pas « mort-née » (MODIFIE_MORT_NE), si son début est connu,
antérieur à 2999 et strictement antérieur à sa fin.

**Recodification** : une création (ou une abrogation) est dite « de recodification » quand l'article
porte un lien LEGI de concordance, transfert, déplacement ou renumérotation vers un autre article de
code qui était en vigueur la veille de la création (ou qui l'est le jour de l'abrogation).  C'est le
cas typique du Code du travail de 2008 : 10 000 articles « créés » et autant d'« abrogés », à droit
constant.  Une création est dite « de codification » quand sa première version est née du texte
codificateur (lien CODIFICATION, et texte créateur identique ou absent : voir est_codification) : le droit
existait déjà hors des codes (texte non codifié) et y est versé.
Les chiffres sont donnés bruts et hors (re)codification.

Fonctions pures (testées dans tests/test_flux.py) : partie, version_valide, en_vigueur, cle_chaine,
chaines, est_codification, evenements, mandat_de, agreger_evenements, stock, liens_concordance.
E/S : charger, main.  Python 3.9, bibliothèque standard seule.
"""
from __future__ import annotations

import csv
import json
import re
import sqlite3
import sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

DONNEES = Path.home() / "Documents/langagement-donnees/sources"
LEGI = DONNEES / "legi/extrait/legi.sqlite"
MOTS = DONNEES / "flux-legislatif/legi_mots.sqlite"
JORF = DONNEES / "flux-legislatif/jorf_textes.sqlite"
ICI = Path(__file__).resolve().parent.parent
RESULTATS = ICI / "resultats"

SANS_FIN = "2999-01-01"
DATE_DONNEES = "2026-11-02"  # dernier incrément LEGI traité (LEGI_20261102-213929)

# Début de chaque mandat : date de prise de fonctions (proclamation du Conseil constitutionnel,
# passation de pouvoirs).  Le dernier court jusqu'à la date des données.
MANDATS = [
    ("Chirac 2", "2002-05-17"),
    ("Sarkozy", "2007-05-16"),
    ("Hollande", "2012-05-15"),
    ("Macron 1", "2017-05-14"),
    ("Macron 2", "2022-05-14"),
]
FIN_DERNIER = DATE_DONNEES

ETATS_ABROGATION = {"ABROGE", "ABROGE_DIFF", "PERIME", "ANNULE", "DISJOINT"}
ETATS_TRANSFERT = {"TRANSFERE", "DEPLACE"}
LIENS_CONCORDANCE = {"CONCORDE", "CONCORDANCE", "TRANSFERT", "TRANSFERE", "DEPLACE", "DEPLACEMENT",
                     "RENUMEROTATION", "CODIFIE"}

_PARTIE = re.compile(r"^\s*(LO|L|R|D|A)\s*\*?\s*\.?\s*\*?\s*\d")


# ------------------------------------------------------------------ fonctions pures
def partie(num: str) -> str:
    """Numéro d'article -> 'L' (loi, y compris LO), 'R' (décret en Conseil d'État), 'D' (décret simple),
    'A' (arrêté) ou 'autre' (sans préfixe : CGI, codes anciens, annexes)."""
    m = _PARTIE.match(num or "")
    if not m:
        return "autre"
    return "L" if m.group(1) == "LO" else m.group(1)


def version_valide(v: dict) -> bool:
    d, f = v.get("debut") or "", v.get("fin") or SANS_FIN
    return bool(d) and v.get("etat") != "MODIFIE_MORT_NE" and d < SANS_FIN and d < f


def en_vigueur(v: dict, jour: str) -> bool:
    """Version en vigueur le jour donné (début inclus, fin exclue)."""
    return version_valide(v) and v["debut"] <= jour < (v.get("fin") or SANS_FIN)


def cle_chaine(v: dict) -> str:
    """Clé de l'article : id de la plus ancienne version de sa liste VERSIONS (même règle que
    outils/droit/legi_complet.py:cid_de)."""
    vs = v.get("versions") or []
    if not vs:
        return v["id"]
    return sorted(vs, key=lambda x: ((x[2] or ""), x[0] or ""))[0][0]


def chaines(versions: list) -> dict:
    """Liste de versions -> {clé: [versions valides triées par début]} (chaînes vides retirées)."""
    out = defaultdict(list)
    for v in versions:
        if version_valide(v):
            out[cle_chaine(v)].append(v)
    for k in out:
        out[k].sort(key=lambda v: (v["debut"], v["id"]))
    return dict(out)


def liens_concordance(v: dict) -> list:
    """Identifiants des articles de code liés par concordance, transfert, déplacement, renumérotation."""
    return [l["id"] for l in (v.get("liens") or [])
            if l.get("typelien") in LIENS_CONCORDANCE and (l.get("id") or "").startswith("LEGIARTI")
            and (l.get("cidtexte") or "").startswith("LEGITEXT")]


_NUM_TEXTE = re.compile(r"\b(\d{2,4}-\d{1,5})\b")


def _cles_texte(l: dict) -> set:
    """Identifiants d'un texte lié : cid JORF et numéro « AAAA-NNN » lu dans le libellé."""
    out = set(_NUM_TEXTE.findall(l.get("texte") or ""))
    if (l.get("cidtexte") or "").startswith("JORFTEXT"):
        out.add(l["cidtexte"])
    return out


def est_codification(liens: list) -> bool:
    """Première version née d'un texte de codification (droit existant versé dans le code).

    Vrai si un lien CODIFICATION existe et, soit aucun lien CREATION/CREE n'existe, soit le texte créateur
    est le texte codificateur (codifications récentes : ordonnance n° 2021-1574 pour le CGFP).  Faux si le
    texte créateur est une autre loi : l'ancienne saisie LEGI attache l'ordonnance d'origine du code
    (lien CODIFICATION) à des articles créés bien plus tard par une loi (CASF : ordonnance n° 2000-1249).
    """
    cod = [l for l in liens if l.get("typelien") == "CODIFICATION"]
    if not cod:
        return False
    cre = [l for l in liens if l.get("typelien") in ("CREATION", "CREE")]
    if not cre:
        return True
    k_cod = set().union(*(_cles_texte(l) for l in cod))
    k_cre = set().union(*(_cles_texte(l) for l in cre))
    return bool(k_cod & k_cre)


def _veille(jour: str) -> str:
    return (date.fromisoformat(jour) - timedelta(days=1)).isoformat()


def evenements(chaine: list, version_vers_chaine: dict = None, chaines_par_cle: dict = None,
               jusqua: str = DATE_DONNEES) -> list:
    """Chaîne de versions valides -> liste d'événements datés.

    Événement : {type: creation|modification|abrogation|transfert, date, partie, code_cid, mots
    (variation du nombre de mots : + à la création, nouvelle - ancienne à la modification, - à
    l'abrogation), recodif (bool)}.  Les événements postérieurs à `jusqua` sont ignorés (abrogations
    programmées, réécritures à venir).
    """
    if not chaine:
        return []
    ev = []
    premier, dernier = chaine[0], chaine[-1]
    lies = set()
    for v in chaine:
        lies.update(liens_concordance(v))
    cle_moi = cle_chaine(premier)

    def lie_en_vigueur(jour):
        if not version_vers_chaine or not chaines_par_cle:
            return False
        for i in lies:
            k = version_vers_chaine.get(i)
            if not k or k == cle_moi:
                continue
            if any(en_vigueur(x, jour) for x in chaines_par_cle.get(k, [])):
                return True
        return False

    if premier["debut"] <= jusqua:
        rec = lie_en_vigueur(_veille(premier["debut"]))
        cod = est_codification(premier.get("liens") or [])
        ev.append({"type": "creation", "date": premier["debut"], "partie": partie(premier["num"]),
                   "code_cid": premier["code_cid"], "mots": premier.get("mots", 0),
                   "recodif": rec or cod, "codif": cod and not rec})
    for avant, v in zip(chaine, chaine[1:]):
        if v["debut"] <= jusqua:
            ev.append({"type": "modification", "date": v["debut"], "partie": partie(v["num"]),
                       "code_cid": v["code_cid"], "mots": v.get("mots", 0) - avant.get("mots", 0),
                       "recodif": False})
    fin = dernier.get("fin") or SANS_FIN
    if fin < SANS_FIN and fin <= jusqua:
        typ = ("abrogation" if dernier["etat"] in ETATS_ABROGATION
               else "transfert" if dernier["etat"] in ETATS_TRANSFERT else "fin_autre")
        ev.append({"type": typ, "date": fin, "partie": partie(dernier["num"]), "code_cid": dernier["code_cid"],
                   "mots": -dernier.get("mots", 0),
                   "recodif": typ == "transfert" or lie_en_vigueur(fin)})
    return ev


def mandat_de(jour: str, mandats: list = None, fin: str = FIN_DERNIER) -> str:
    """Date -> nom du mandat qui la contient (début inclus), ou '' hors période."""
    mandats = mandats or MANDATS
    if jour < mandats[0][1] or jour > fin:
        return ""
    nom = ""
    for n, d in mandats:
        if jour >= d:
            nom = n
    return nom


def agreger_evenements(evts: list, cle) -> dict:
    """Agrège des événements par cle(ev) -> {cle: compteurs}.

    Compteurs : creations, creations_recodif, modifications, abrogations, abrogations_recodif,
    transferts, fins_autres, mots_crees, mots_modifies (solde), mots_abroges (positif).
    """
    out = defaultdict(lambda: defaultdict(int))
    for e in evts:
        k = cle(e)
        if k is None:
            continue
        c = out[k]
        t = e["type"]
        if t == "creation":
            c["creations"] += 1
            c["creations_recodif"] += e["recodif"]
            c["creations_codification"] += e.get("codif", False)
            c["mots_crees"] += e["mots"]
            if e["recodif"]:
                c["mots_crees_recodif"] += e["mots"]
        elif t == "modification":
            c["modifications"] += 1
            c["mots_modifies"] += e["mots"]
        elif t == "abrogation":
            c["abrogations"] += 1
            c["abrogations_recodif"] += e["recodif"]
            c["mots_abroges"] += -e["mots"]
        elif t == "transfert":
            c["transferts"] += 1
            c["mots_abroges"] += -e["mots"]
        else:
            c["fins_autres"] += 1
            c["mots_abroges"] += -e["mots"]
    return {k: dict(v) for k, v in out.items()}


def stock(chaines_par_cle: dict, jour: str, cle=lambda v: "total") -> dict:
    """Stock en vigueur le jour donné : {cle(version): {'articles': n, 'mots': m}}."""
    out = defaultdict(lambda: {"articles": 0, "mots": 0})
    for vs in chaines_par_cle.values():
        for v in vs:
            if en_vigueur(v, jour):
                k = cle(v)
                out[k]["articles"] += 1
                out[k]["mots"] += v.get("mots", 0)
                break
    return dict(out)


# ------------------------------------------------------------------ JORF (pures)
_ART53 = re.compile(r"autorisant (l'|la |le |l’)?(approbation|ratification|adhésion|adhesion)", re.I)
_INDIVIDUEL = re.compile(r"\b(portant nomination|portant promotion|relatif à la nomination|portant cessation|"
                         r"portant admission|naturalisation|portant radiation|portant élévation|"
                         r"portant réintégration|portant mise à la retraite|accordant|conférant|"
                         r"portant délégation de signature|portant changement de nom|chargeant|portant affectation|"
                         r"portant intégration|portant titularisation|portant détachement)\b", re.I)


def categorie_jorf(nature: str, titre: str) -> str:
    """Texte JORF -> loi | loi_art53 | ordonnance | decret_reglementaire | decret_individuel | autre.

    Le SGG compte les lois hors article 53 (autorisation de ratifier un traité) et les décrets
    réglementaires ; la distinction réglementaire/individuel est ici faite sur le titre (heuristique).
    """
    n = (nature or "").upper()
    if n in ("LOI", "LOI_ORGANIQUE", "LOI_CONSTIT"):
        return "loi_art53" if _ART53.search(titre or "") else "loi"
    if n == "ORDONNANCE":
        return "ordonnance"
    if n == "DECRET":
        return "decret_individuel" if _INDIVIDUEL.search(titre or "") else "decret_reglementaire"
    return "autre"


# ------------------------------------------------------------------ E/S
def charger(codes_seulement: bool = True) -> list:
    """Versions d'articles LEGI (legi.sqlite) + nombre de mots (legi_mots.sqlite)."""
    db = sqlite3.connect(str(LEGI))
    db.execute(f"ATTACH DATABASE '{MOTS}' AS m")
    sql = ("SELECT a.id,a.num,a.etat,a.debut,a.fin,a.code_cid,a.code_nom,a.versions,a.liens,"
           "COALESCE(v.mots,0),COALESCE(v.cat,'?') FROM art a LEFT JOIN m.v v ON v.id=a.id")
    out = []
    for r in db.execute(sql):
        if codes_seulement and r[10] != "code":
            continue
        out.append({"id": r[0], "num": r[1], "etat": r[2], "debut": r[3], "fin": r[4] or SANS_FIN,
                    "code_cid": r[5], "code_nom": r[6], "versions": json.loads(r[7]),
                    "liens": json.loads(r[8]), "mots": r[9], "cat": r[10]})
    return out


def _ecrire(chemin: Path, lignes: list, champs: list):
    chemin.parent.mkdir(parents=True, exist_ok=True)
    with open(chemin, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=champs, extrasaction="ignore")
        w.writeheader()
        for l in lignes:
            w.writerow({k: l.get(k, 0) for k in champs})


COMPTEURS = ["creations", "creations_recodif", "creations_codification", "modifications", "abrogations", "abrogations_recodif",
             "transferts", "fins_autres", "mots_crees", "mots_crees_recodif", "mots_modifies", "mots_abroges"]


def main(argv) -> int:
    versions = charger()
    print(f"versions d'articles de codes : {len(versions)}", file=sys.stderr)
    noms = {}
    for v in sorted(versions, key=lambda v: v["debut"] or ""):
        noms[v["code_cid"]] = v["code_nom"]
    ch = chaines(versions)
    v2c = {v["id"]: k for k, vs in ch.items() for v in vs}
    evts = []
    for vs in ch.values():
        evts.extend(evenements(vs, v2c, ch))
    print(f"articles (chaînes) : {len(ch)} ; événements : {len(evts)}", file=sys.stderr)
    bornes = [d for _, d in MANDATS] + [FIN_DERNIER]

    # 1. par mandat et par partie
    par = agreger_evenements(evts, lambda e: (mandat_de(e["date"]), e["partie"]) if mandat_de(e["date"]) else None)
    tot = agreger_evenements(evts, lambda e: mandat_de(e["date"]) or None)
    lignes = []
    for (nom, debut), fin in zip(MANDATS, bornes[1:]):
        s0 = stock(ch, debut, lambda v: partie(v["num"]))
        s1 = stock(ch, fin, lambda v: partie(v["num"]))
        for p in ["L", "R", "D", "A", "autre", "total"]:
            c = tot.get(nom, {}) if p == "total" else par.get((nom, p), {})
            a0 = sum(x["articles"] for x in s0.values()) if p == "total" else s0.get(p, {}).get("articles", 0)
            a1 = sum(x["articles"] for x in s1.values()) if p == "total" else s1.get(p, {}).get("articles", 0)
            m0 = sum(x["mots"] for x in s0.values()) if p == "total" else s0.get(p, {}).get("mots", 0)
            m1 = sum(x["mots"] for x in s1.values()) if p == "total" else s1.get(p, {}).get("mots", 0)
            l = {"mandat": nom, "debut": debut, "fin": fin, "partie": p, **{k: c.get(k, 0) for k in COMPTEURS},
                 "articles_debut": a0, "articles_fin": a1, "mots_debut": m0, "mots_fin": m1}
            l["solde_net"] = l["creations"] - l["abrogations"] - l["transferts"] - l["fins_autres"]
            l["creations_hors_recodif"] = l["creations"] - l["creations_recodif"]
            l["solde_hors_recodif"] = l["creations_hors_recodif"] - (l["abrogations"] - l["abrogations_recodif"] + l["fins_autres"])
            # retraits hors recodification : abrogations sans successeur + fins sans état clair
            # (les transferts sont, par nature, des déplacements à droit constant)
            l["abrogations_hors_recodif"] = l["abrogations"] - l["abrogations_recodif"] + l["fins_autres"]
            lignes.append(l)
    champs = ["mandat", "debut", "fin", "partie", "articles_debut", "articles_fin", "solde_net"] + COMPTEURS + [
        "creations_hors_recodif", "abrogations_hors_recodif", "solde_hors_recodif", "mots_debut", "mots_fin"]
    _ecrire(RESULTATS / "par_mandat.csv", lignes, champs)

    # 2. par mandat et par code
    pc = agreger_evenements(evts, lambda e: (mandat_de(e["date"]), e["code_cid"]) if mandat_de(e["date"]) else None)
    lignes = []
    for (nom, debut), fin in zip(MANDATS, bornes[1:]):
        s0 = stock(ch, debut, lambda v: v["code_cid"])
        s1 = stock(ch, fin, lambda v: v["code_cid"])
        for code in sorted(set(s0) | set(s1) | {k[1] for k in pc if k[0] == nom}):
            c = pc.get((nom, code), {})
            l = {"mandat": nom, "code_cid": code, "code": noms.get(code, ""), **{k: c.get(k, 0) for k in COMPTEURS},
                 "articles_debut": s0.get(code, {}).get("articles", 0), "articles_fin": s1.get(code, {}).get("articles", 0),
                 "mots_debut": s0.get(code, {}).get("mots", 0), "mots_fin": s1.get(code, {}).get("mots", 0)}
            l["solde_articles"] = l["articles_fin"] - l["articles_debut"]
            l["solde_mots"] = l["mots_fin"] - l["mots_debut"]
            lignes.append(l)
    _ecrire(RESULTATS / "par_mandat_et_code.csv", lignes,
            ["mandat", "code_cid", "code", "articles_debut", "articles_fin", "solde_articles", "mots_debut", "mots_fin",
             "solde_mots"] + COMPTEURS)

    # 3. stock au 1er janvier (comparaison SGG) et au 2 novembre 2026, par partie
    lignes = []
    for an in list(range(2002, 2027)) + ["2026-11-02"]:
        jour = f"{an}-01-01" if isinstance(an, int) else an
        s = stock(ch, jour, lambda v: partie(v["num"]))
        l = {"date": jour}
        for p in ["L", "R", "D", "A", "autre"]:
            l[f"articles_{p}"] = s.get(p, {}).get("articles", 0)
            l[f"mots_{p}"] = s.get(p, {}).get("mots", 0)
        l["articles_total"] = sum(x["articles"] for x in s.values())
        l["mots_total"] = sum(x["mots"] for x in s.values())
        lignes.append(l)
    _ecrire(RESULTATS / "stock_annuel.csv", lignes, list(lignes[0].keys()))

    # 4. quatre codes suivis par le SGG, au 1er janvier
    suivis = {"LEGITEXT000006074096": "CCH", "LEGITEXT000006074220": "environnement",
              "LEGITEXT000006074075": "urbanisme", "LEGITEXT000006070633": "CGCT"}
    lignes = []
    for an in range(2005, 2027):
        s = stock(ch, f"{an}-01-01", lambda v: v["code_cid"])
        l = {"date": f"{an}-01-01"}
        for cid, n in suivis.items():
            l[f"articles_{n}"] = s.get(cid, {}).get("articles", 0)
            l[f"mots_{n}"] = s.get(cid, {}).get("mots", 0)
        lignes.append(l)
    _ecrire(RESULTATS / "stock_codes_suivis_sgg.csv", lignes, list(lignes[0].keys()))

    # 5. événements par année (pour graphiques)
    pa = agreger_evenements(evts, lambda e: e["date"][:4] if "1990" <= e["date"][:4] <= "2026" else None)
    _ecrire(RESULTATS / "evenements_par_annee.csv", [{"annee": a, **pa[a]} for a in sorted(pa)], ["annee"] + COMPTEURS)

    # 6. JORF
    if JORF.exists():
        db = sqlite3.connect(str(JORF))
        cpt = defaultdict(lambda: defaultdict(int))
        cpa = defaultdict(lambda: defaultdict(int))
        for nature, dp, titre in db.execute("SELECT nature,date_publi,titre FROM t"):
            if not dp:
                continue
            c = categorie_jorf(nature, titre)
            m = mandat_de(dp)
            if m:
                cpt[m][c] += 1
            if "2002" <= dp[:4] <= "2026":
                cpa[dp[:4]][c] += 1
        cats = ["loi", "loi_art53", "ordonnance", "decret_reglementaire", "decret_individuel"]
        _ecrire(RESULTATS / "jorf_par_mandat.csv", [{"mandat": n, **cpt[n]} for n, _ in MANDATS], ["mandat"] + cats)
        _ecrire(RESULTATS / "jorf_par_annee.csv", [{"annee": a, **cpa[a]} for a in sorted(cpa)], ["annee"] + cats)
    print("résultats écrits dans", RESULTATS, file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
