# -*- coding: utf-8 -*-
"""Chargement et requêtes du modèle « État as code » (fonctions pures, bibliothèque standard).

Le modèle est l'ensemble des CSV de `donnees/` décrits par `datapackage.json`. Chaque fonction prend le
modèle (dict nom -> liste de lignes) et renvoie une valeur, sans effet de bord.
"""
import csv
import json
import os
import re
from collections import defaultdict

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)

# Rôles qui donnent un pouvoir d'agir sur la compétence (chevauchement « juridique »)
ROLES_JURIDIQUES = {"responsable", "responsable_partiel", "partage", "chef_de_file", "optionnel"}
# Rôles larges : on ajoute ceux qui exécutent ou cofinancent
ROLES_LARGES = ROLES_JURIDIQUES | {"operateur", "finance"}
SOUS_SECTEURS = {"S-APUL", "S-ASSO", "S-ODAC", "S-MENAGES", "S-ENTREPRISES"}
SORTS_DISPARUS = {"supprimer", "fusionner"}
SORTS_PRESENTS = {"garder", "transformer", "creer"}


def lire_csv(chemin):
    with open(chemin, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f, delimiter=";"))


def charger(racine=RACINE):
    with open(os.path.join(racine, "datapackage.json"), encoding="utf-8") as f:
        dp = json.load(f)
    m = {"_datapackage": dp}
    for r in dp["resources"]:
        m[r["name"].replace("-", "_")] = lire_csv(os.path.join(racine, r["path"]))
    return m


def nombre(x):
    try:
        return float(str(x).replace(",", "."))
    except (TypeError, ValueError):
        return None


def liste(x):
    return [v.strip() for v in (x or "").split(",") if v.strip()]


# ---------------------------------------------------------------------------------------------
# Compétences et niveaux
# ---------------------------------------------------------------------------------------------
def niveaux_par_competence(m, etat, roles):
    d = defaultdict(set)
    for a in m["attributions"]:
        if a["etat"] == etat and a["role"] in roles:
            d[a["competence"]].add(a["niveau"])
    return d


def chevauchements(m, etat="actuel", roles=ROLES_JURIDIQUES):
    """Compétences sur lesquelles au moins deux niveaux ont un rôle du type demandé."""
    d = niveaux_par_competence(m, etat, roles)
    return {c: sorted(n) for c, n in d.items() if len(n) >= 2}


def responsables(m, etat):
    d = defaultdict(list)
    for a in m["attributions"]:
        if a["etat"] == etat and a["role"] == "responsable":
            d[a["competence"]].append(a["niveau"])
    return d


def competences_propose(m):
    """Compétences qui doivent exister dans l'état proposé (existe_propose = oui)."""
    return [c for c in m["competences"] if c["existe_propose"] == "oui"]


def a_arbitrer(m):
    return sorted(c["id"] for c in m["competences"] if c["existe_propose"] == "à_arbitrer")


def anomalies_responsables_propose(m):
    """Compétences de l'état proposé sans responsable ou avec plusieurs responsables."""
    resp = responsables(m, "propose")
    orphelines = [c["id"] for c in competences_propose(m) if len(resp.get(c["id"], [])) == 0]
    multiples = {c["id"]: resp[c["id"]] for c in competences_propose(m) if len(resp.get(c["id"], [])) > 1}
    return orphelines, multiples


def devenir(m, cid):
    """Compétence de l'état proposé qui reprend la compétence `cid` (elle-même ou sa cible)."""
    c = {x["id"]: x for x in m["competences"]}[cid]
    if c["existe_propose"] == "oui":
        return cid
    if c["existe_propose"] == "non" and c["devient"]:
        return devenir(m, c["devient"])
    return None  # à arbitrer ou sans cible


def competence_resolue(m, cid):
    cible = devenir(m, cid)
    return cible is not None and len(responsables(m, "propose").get(cible, [])) == 1


def orphelines_apres_suppression(m):
    """(organisme, compétence) : compétences d'organismes supprimés ou fusionnés sans repreneur unique."""
    out = []
    for o in m["organismes"]:
        if o["sort_propose"] in SORTS_DISPARUS:
            for c in liste(o["competences_actuel"]):
                if not competence_resolue(m, c):
                    out.append((o["id"], c))
    return out


def niveau_propose_de(m, cid):
    cible = devenir(m, cid)
    r = responsables(m, "propose").get(cible, []) if cible else []
    return r[0] if len(r) == 1 else ("à arbitrer" if cible is None else "?")


# ---------------------------------------------------------------------------------------------
# Organismes
# ---------------------------------------------------------------------------------------------
def organismes_presents_sans_competence(m):
    return [o["id"] for o in m["organismes"]
            if o["sort_propose"] in SORTS_PRESENTS and o["niveau_propose"] not in ("", "TIERS") and not liste(o["competences_propose"])]


def incoherences_organismes(m):
    """Un organisme de l'état proposé doit tenir un rôle, à son niveau, sur chaque compétence qu'il revendique."""
    roles = defaultdict(set)
    for a in m["attributions"]:
        if a["etat"] == "propose":
            roles[(a["competence"], a["niveau"])].add(a["role"])
    out = []
    for o in m["organismes"]:
        if o["sort_propose"] in SORTS_PRESENTS and o["niveau_propose"] not in ("", "TIERS"):
            for c in liste(o["competences_propose"]):
                if not roles.get((c, o["niveau_propose"])):
                    out.append((o["id"], c, o["niveau_propose"]))
    return out


def instances_gardees_sans_competence(m):
    return [x for x in m["organismes_instances"] if x["sort_propose"] == "garder" and not x["competences"]]


# ---------------------------------------------------------------------------------------------
# Démarches
# ---------------------------------------------------------------------------------------------
def interlocuteurs(m, etat):
    """démarche -> {'obligatoires': n, 'publics_obligatoires': n, 'avec_facultatifs': n, 'organismes': [...]}"""
    niv = {o["id"]: (o["niveau_actuel"] if etat == "actuel" else o["niveau_propose"]) or o["niveau_actuel"] for o in m["organismes"]}
    d = {}
    for dm in m["demarches"]:
        et = [e for e in m["demarche_etapes"] if e["etat"] == etat and e["demarche"] == dm["id"]]
        obl = sorted({e["organisme"] for e in et if e["contact_usager"] == "oui"})
        fac = sorted({e["organisme"] for e in et if e["contact_usager"] in ("oui", "facultatif")})
        d[dm["id"]] = {"obligatoires": len(obl), "publics_obligatoires": len([o for o in obl if niv.get(o) != "TIERS"]),
                       "avec_facultatifs": len(fac), "organismes": obl}
    return d


def demarches_sans_guichet_proximite(m):
    prox = {o["id"] for o in m["organismes"] if o["niveau_propose"] == "P-PROX" and o["sort_propose"] in SORTS_PRESENTS}
    out = []
    for dm in m["demarches"]:
        ok = any(e["etat"] == "propose" and e["demarche"] == dm["id"] and e["role"] == "guichet" and e["organisme"] in prox
                 for e in m["demarche_etapes"])
        if not ok:
            out.append(dm["id"])
    return out


def france_services_actuel(m):
    """démarche -> 'oui' (tous les interlocuteurs publics obligatoires sont partenaires), 'partiel' ou 'non'."""
    part = {o["id"] for o in m["organismes"] if o.get("partenaire_france_services") == "oui"}
    niv = {o["id"]: o["niveau_actuel"] for o in m["organismes"]}
    out = {}
    for dm, v in interlocuteurs(m, "actuel").items():
        pub = [o for o in v["organismes"] if niv.get(o) != "TIERS"]
        k = sum(o in part for o in pub)
        out[dm] = "oui" if pub and k == len(pub) else ("partiel" if k else "non")
    return out


# ---------------------------------------------------------------------------------------------
# Flux
# ---------------------------------------------------------------------------------------------
def ids_connus(m):
    return {n["id"] for n in m["niveaux"]} | {o["id"] for o in m["organismes"]} | SOUS_SECTEURS


def flux_non_rattaches(m):
    connus = ids_connus(m)
    return [f for f in m["flux"] if f["payeur"] not in connus or f["receveur"] not in connus]


def flux_rattaches_au_niveau(m):
    """Flux dont payeur et receveur sont identifiés à un niveau ou un organisme (pas seulement à un sous-secteur)."""
    connus = ids_connus(m) - SOUS_SECTEURS
    return [f for f in m["flux"] if f["payeur"] in connus and f["receveur"] in connus]


def montant(lignes):
    return sum(nombre(x["montant_md_eur"]) or 0.0 for x in lignes)


def flux_propose(m):
    """Projette chaque flux actuel sur les niveaux proposés. Renvoie des lignes avec une catégorie :
    'interne' (payeur et receveur fusionnés dans le même niveau : le flux disparaît),
    'a_ventiler' (un des deux côtés appartient à un niveau éclaté entre plusieurs repreneurs),
    'inconnu' (le grand livre ne dit pas qui reçoit), 'reste'."""
    corr = {c["niveau_actuel"]: c["niveau_propose"] for c in m["correspondance_niveaux"]}
    org = {o["id"]: o for o in m["organismes"]}

    def proj(x):
        if x in SOUS_SECTEURS:
            return x
        if x in org:
            return org[x]["niveau_propose"] or ("" if org[x]["sort_propose"] in SORTS_DISPARUS else corr.get(org[x]["niveau_actuel"], ""))
        return corr.get(x, "")

    out = []
    for f in m["flux"]:
        p, r = proj(f["payeur"]), proj(f["receveur"])
        if not f["receveur"] or not f["payeur"]:
            cat = "inconnu"
        elif not p or not r:
            cat = "a_ventiler"
        elif p == r and p not in SOUS_SECTEURS:
            cat = "interne"
        else:
            cat = "reste"
        out.append(dict(f, payeur_propose=p, receveur_propose=r, categorie=cat))
    return out


# ---------------------------------------------------------------------------------------------
# Budgets
# ---------------------------------------------------------------------------------------------
def budgets_par_competence(m):
    """compétence -> {niveau: Md€} (ventilation fonctionnelle 2024, niveaux identifiés seulement)."""
    d = defaultdict(lambda: defaultdict(float))
    for b in m["budgets_competences"]:
        if b["niveau"] and b["competence"] not in ("SUPPORT", "NON_VENTILE", "NON_RATTACHE"):
            d[b["competence"]][b["niveau"]] += nombre(b["montant_md_eur"]) or 0.0
    return d


def chevauchements_financiers(m, seuil_md=0.05):
    """Compétences financées par au moins deux niveaux, chacun au-dessus du seuil (Md€ 2024)."""
    out = {}
    for c, d in budgets_par_competence(m).items():
        n = {k: v for k, v in d.items() if v >= seuil_md}
        if len(n) >= 2:
            out[c] = n
    return out


def redistribution(m, niveau):
    """Budgets 2024 d'un niveau actuel, ventilés par compétence et par niveau repreneur dans l'état proposé."""
    d = defaultdict(float)
    det = []
    for b in m["budgets_competences"]:
        if b["niveau"] != niveau:
            continue
        v = nombre(b["montant_md_eur"]) or 0.0
        c = b["competence"]
        cible = c if c in ("SUPPORT", "NON_VENTILE", "NON_RATTACHE") else niveau_propose_de(m, c)
        d[cible] += v
        det.append((c, b["entite_source"], v, cible))
    return dict(d), det


# ---------------------------------------------------------------------------------------------
# Intégrité du data package
# ---------------------------------------------------------------------------------------------
def erreurs_integrite(m, racine=RACINE):
    err = []
    noms = {r["name"]: r for r in m["_datapackage"]["resources"]}
    for nom, r in noms.items():
        t = m[nom.replace("-", "_")]
        with open(os.path.join(racine, r["path"]), encoding="utf-8-sig") as f:
            entete = next(csv.reader(f, delimiter=";"))
        attendus = [c["name"] for c in r["schema"]["fields"]]
        if entete != attendus:
            err.append(f"{nom} : colonnes {entete} ≠ schéma {attendus}")
        pk = r["schema"].get("primaryKey")
        if pk:
            vals = [x[pk] for x in t]
            if len(vals) != len(set(vals)):
                err.append(f"{nom} : clé primaire {pk} non unique")
        for fk in r["schema"].get("foreignKeys", []):
            ref = m[fk["reference"]["resource"].replace("-", "_")]
            cibles = {x[fk["reference"]["fields"]] for x in ref}
            for x in t:
                if x[fk["fields"]] not in cibles:
                    err.append(f"{nom} : {fk['fields']}={x[fk['fields']]!r} absent de {fk['reference']['resource']}")
        for x in t:
            for c in r["schema"]["fields"]:
                if c["type"] == "number" and x[c["name"]] not in ("", None) and nombre(x[c["name"]]) is None:
                    err.append(f"{nom} : {c['name']}={x[c['name']]!r} n'est pas un nombre")
    regles = {x["id_regle"] for x in m["regles"]}
    for t in ("competences", "attributions"):
        for x in m[t]:
            for rid in liste(x["regles"]):
                if rid not in regles:
                    err.append(f"{t} : règle {rid} absente de regles.csv")
    comps = {c["id"] for c in m["competences"]}
    for o in m["organismes"]:
        for c in liste(o["competences_actuel"]) + liste(o["competences_propose"]):
            if c not in comps:
                err.append(f"organismes : compétence {c} inconnue ({o['id']})")
    for dm in m["demarches"]:
        for c in liste(dm["competences"]):
            if c not in comps:
                err.append(f"demarches : compétence {c} inconnue ({dm['id']})")
    for c in m["competences"]:
        if c["devient"] and c["devient"] not in comps:
            err.append(f"competences : cible {c['devient']} inconnue ({c['id']})")
    for b in m["budgets_competences"]:
        if b["competence"] not in comps | {"SUPPORT", "NON_VENTILE", "NON_RATTACHE"}:
            err.append(f"budgets : compétence {b['competence']} inconnue")
    return err
