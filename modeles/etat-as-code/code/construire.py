# -*- coding: utf-8 -*-
"""Construit les tables dérivées du modèle « État as code » à partir des données existantes du dépôt.

Usage (depuis la racine du dépôt) :
    python3 -I modeles/etat-as-code/code/construire.py [<liste-fs.csv> <index_service_public.csv>]

Entrées (lecture seule) : modeles/grand-livre/{instances,agents-publics,apul,asso,odac,etat}.csv,
donnees/organismes.csv et donnees/demarches.csv (tables curées du modèle) ;
facultatif : la liste ANCT des structures France services et l'index des fiches service-public
(produit par index_service_public.py), qui ne sont pas versionnés (données lourdes, contacts).
Sorties (donnees/) : organismes_instances.csv, agents.csv, budgets_competences.csv, flux.csv,
guichets_france_services.csv, fiches_service_public.csv, puis datapackage.json (Frictionless).
Fonctions pures ; bibliothèque standard seulement.
"""
import csv
import json
import os
import re
import sys
from collections import defaultdict

ICI = os.path.dirname(os.path.abspath(__file__))
MODELE = os.path.dirname(ICI)
DONNEES = os.path.join(MODELE, "donnees")
DEPOT = os.path.dirname(os.path.dirname(MODELE))
GL = os.path.join(DEPOT, "modeles", "grand-livre")


def lire(chemin, sep=";"):
    with open(chemin, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f, delimiter=sep))


def ecrire(chemin, lignes, champs):
    with open(chemin, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=champs, delimiter=";", extrasaction="ignore")
        w.writeheader()
        w.writerows(lignes)


def nombre(x):
    """'1,23' ou '1.23' -> 1.23 ; vide ou texte -> None."""
    if x is None:
        return None
    x = str(x).strip().replace(" ", "").replace(" ", "").replace(",", ".")
    try:
        return float(x)
    except ValueError:
        return None


def fmt(x, n=6):
    return "" if x is None else f"{x:.{n}f}".rstrip("0").rstrip(".")


# --------------------------------------------------------------------------------------------
# 1. Organismes recensés (instances.csv) -> organismes_instances.csv
# --------------------------------------------------------------------------------------------
FAMILLES = {
    "opérateur de l'État": "national", "établissement public national (hors recensement des opérateurs)": "national",
    "établissement public non opérateur": "national", "service à compétence nationale ou service interministériel": "national",
    "autorité administrative ou publique indépendante": "national", "entreprise publique": "national",
    "autorité constitutionnelle, pouvoir public ou juridiction suprême": "national", "agence régionale": "national",
    "établissement public (institution)": "national",
    "EPIC local (établissement public local à caractère industriel ou commercial)": "local",
    "régie locale à caractère industriel ou commercial": "local", "caisse de crédit municipal": "local",
    "collectivité ou organisme local (APUL)": "local",
    "GIP (groupement d'intérêt public)": "groupement", "organisme de sécurité sociale": "sécurité sociale",
    "commission ou instance consultative": "consultatif", "chambre consulaire": "consulaire",
    "association ou fondation financée par l'argent public": "association",
}


def sort_normalise(pre):
    p = (pre or "").lower()
    if p.startswith("garder"):
        return "garder"
    if p.startswith("supprimer"):
        return "supprimer"
    if p.startswith("fusionner") or p.startswith("absorber"):
        return "fusionner"
    return "a_examiner"


def organismes_instances(instances, organismes):
    comp_par_ref = {}
    for o in organismes:
        for ref in filter(None, (o.get("ref_instances") or "").split(",")):
            comp_par_ref[ref.strip()] = (o["id"], o["competences_actuel"])
    out = []
    for x in instances:
        org, comp = comp_par_ref.get(x["id"], ("", ""))
        out.append({
            "id": x["id"], "nom": x["nom"], "type": x["type"], "famille": FAMILLES.get(x["type"], "autre"),
            "budget_md_eur": fmt(nombre(x["budget_md_eur"])), "budget_annee": x["budget_annee"],
            "effectifs_etp": fmt(nombre(x["effectifs_etp"]), 1), "effectifs_annee": x["effectifs_annee"],
            "preclassement": x["preclassement"], "cible": x["cible"], "ministere_propose": x["ministere_propose"],
            "sort_propose": sort_normalise(x["preclassement"]), "organisme_modele": org, "competences": comp,
            "source": "modeles/grand-livre/instances.csv", "cote": x["cote"],
        })
    return out


# --------------------------------------------------------------------------------------------
# 2. Agents (ETP) -> agents.csv
# --------------------------------------------------------------------------------------------
FPT_2023 = [  # DGAFP, Rapport annuel 2025, données 2023, personnes (agents-publics.md § 2.1)
    ("AG-FPT-COM", "Communes", "N-COM", 1029000), ("AG-FPT-CCAS", "Établissements communaux (CCAS, caisses des écoles)", "N-COM", 105000),
    ("AG-FPT-EPCI", "EPCI à fiscalité propre", "N-EPCI", 302000), ("AG-FPT-SYN", "Autres structures intercommunales", "N-SYN", 90000),
    ("AG-FPT-DEP", "Départements", "N-DEP", 286000), ("AG-FPT-DEPETAB", "Autres établissements départementaux (dont SDIS)", "N-DEP", 72000),
    ("AG-FPT-REG", "Régions", "N-REG", 99000), ("AG-FPT-AUTRES", "Autres (territoriale)", "", 11000),
]
NIVEAU_GA = {"SECU-URSSAF": "N-SECU", "SECU-CNAM": "N-SECU", "SECU-CAF": "N-SECU", "SECU-CNAV": "N-SECU", "SECU-MSA": "N-SECU", "OP-FT": "N-OPE"}


def agents(agents_publics):
    out = []
    for x in agents_publics:
        if x["niveau"] == "programme":
            niv = "N-ETAT"
        elif x["niveau"] == "grande administration":
            niv = NIVEAU_GA.get(x["id"], "")
        else:
            continue
        out.append({"id": "AG-" + x["id"], "nom": x["nom"], "niveau": niv, "effectif": fmt(nombre(x["etpt"]), 1),
                    "unite": "ETPT" if x["niveau"] == "programme" else "ETP", "annee": x["annee_eff"],
                    "statut": x["nature_eff"], "source": "modeles/grand-livre/agents-publics.csv"})
    for i, nom, niv, n in FPT_2023:
        out.append({"id": i, "nom": nom, "niveau": niv, "effectif": str(n), "unite": "personnes", "annee": "2023",
                    "statut": "fait (A)", "source": "DGAFP, Rapport annuel 2025 (données 2023), repris dans modeles/grand-livre/agents-publics.md § 2.1"})
    return out


# --------------------------------------------------------------------------------------------
# 3. Budgets par compétence et par niveau (ventilation fonctionnelle OFGL 2024) -> budgets_competences.csv
# --------------------------------------------------------------------------------------------
ENTITES = {
    "Communes de 3 500 hab. ou plus (y c. Paris)": "N-COM", "Groupements à fiscalité propre (champ DGCL)": "N-EPCI",
    "Départements": "N-DEP", "Régions et collectivités territoriales uniques": "N-REG", "Syndicats (budgets principaux)": "N-SYN",
    "Budgets annexes des communes et EPCI": "", "Communes de moins de 3 500 habitants": "N-COM", "GFP sans commune de 3 500 habitants": "N-EPCI",
}


def competence_de(niveau, libelle, regles):
    # une règle propre au niveau l'emporte sur la règle générale (niveau « * »)
    propres = [r for r in regles if r["niveau"] == niveau and re.search(r["motif"], libelle)]
    if propres:
        return propres[0]["competence"]
    gen = [r for r in regles if r["niveau"] == "*" and re.search(r["motif"], libelle)]
    return gen[0]["competence"] if gen else ""


def budgets(apul, regles):
    agg = defaultdict(lambda: [0.0, 0])
    for x in apul:
        if x.get("couche") != "A" or x["entite"] not in ENTITES:
            continue
        niv = ENTITES[x["entite"]]
        lib = re.sub(r"\s*\((fonctionnement|investissement)[^)]*\)\s*$", "", x["libelle"])
        comp = "NON_VENTILE" if lib.startswith("Opérations non ventilées") else competence_de(niv, lib, regles)
        k = (niv, x["entite"], comp or "NON_RATTACHE")
        agg[k][0] += nombre(x["montant_md_eur"]) or 0.0
        agg[k][1] += 1
    out = []
    for (niv, ent, comp), (m, n) in sorted(agg.items()):
        out.append({"niveau": niv, "entite_source": ent, "competence": comp, "montant_md_eur": fmt(m), "annee": "2024",
                    "nb_lignes": n, "source": "modeles/grand-livre/apul.csv, couche A (DGCL/OFGL, rapport 2026, annexe 2F, ventilation fonctionnelle 2024)",
                    "statut": "calcul (somme de lignes ; rattachement à la compétence par donnees/fonction_competence.csv)"})
    return out


# --------------------------------------------------------------------------------------------
# 4. Flux financiers entre administrations -> flux.csv
# --------------------------------------------------------------------------------------------
SUFFIXE = {"COM": "N-COM", "DEP": "N-DEP", "REG": "N-REG", "SYN": "N-SYN"}
PAYEUR_TRF = {"DGF": "N-ETAT", "CONCOURS_ETAT": "N-ETAT", "FCTVA": "N-ETAT", "TVA": "N-ETAT", "TSCA": "N-ETAT", "TICPE": "N-ETAT", "CNSA": "N-SECU"}
RECEVEUR_ETAT = [  # libellé des lignes de l'État -> receveur (règle sur le libellé)
    (r"Prélèvements sur recettes au profit des collectivités", "S-APUL"),
    (r"subventions pour charges", "N-OPE"),
    (r"transferts aux ménages", "S-MENAGES"),
    (r"transferts aux collectivités territoriales", "S-APUL"),
    (r"dégrèvements pris en charge", "S-APUL"),
    (r"transferts aux entreprises", "S-ENTREPRISES"),
    (r"France Télévisions|Radio France|France Médias Monde|ARTE|Institut national de l'audiovisuel|TV5", "S-ENTREPRISES"),
]


def niveau_entite(entite):
    e = entite.lower()
    if e.startswith("communes") or e.startswith("bloc communal"):
        return "N-COM"
    if e.startswith("groupements"):
        return "N-EPCI"
    if e.startswith("départements"):
        return "N-DEP"
    if e.startswith("régions"):
        return "N-REG"
    if e.startswith("syndicats"):
        return "N-SYN"
    if e.startswith("budgets annexes"):
        return "S-APUL"
    return ""


def flux(fichiers):
    out = []
    for nom, lignes in fichiers:
        for x in lignes:
            f = x.get("flux_inter_apu", "")
            if not f.startswith("oui"):
                continue
            ident = x["id"]
            if ident.startswith("GL-APUL-CONSO"):
                continue  # écriture de consolidation, pas un flux
            cible = f[4:]
            payeur, receveur, regle = "", "", ""
            if nom == "odac":
                payeur, receveur, regle = "N-ETAT", "N-OPE", "contrepartie ETAT-P… : subvention d'un programme de l'État à un opérateur"
            elif nom == "apul" and ident.startswith("GL-APUL-TRF-"):
                cle, suf = ident[len("GL-APUL-TRF-"):].rsplit("-", 1)
                payeur, receveur = PAYEUR_TRF.get(cle, ""), SUFFIXE.get(suf, "")
                regle = "recette d'une collectivité : payeur déduit de la nature (DGF, concours, FCTVA, fraction d'impôt national, CNSA)"
            elif nom == "apul" and "SDIS" in cible:
                payeur, receveur, regle = niveau_entite(x["entite"]), "ORG-SDIS", "contribution au SDIS"
            elif nom == "apul" and "EPLE" in cible:
                payeur, receveur, regle = niveau_entite(x["entite"]), "ORG-EPLE", "dotation aux collèges et lycées (EPLE)"
            elif nom == "apul":
                payeur, receveur, regle = ("S-APUL" if x["entite"] in ("APUL", "Collectivités entre elles") else niveau_entite(x["entite"])), "", "receveur non identifié dans le grand livre"
            elif nom == "asso":
                payeur = "N-SECU"
                if "DEPARTEMENTS" in cible:
                    receveur = "N-DEP"
                elif "ARS" in cible:
                    receveur = "N-OPE"
                elif "ETAT" in cible:
                    receveur = "N-ETAT"
                elif "GL-APUL" in cible:
                    receveur = "S-APUL"
                regle = "contrepartie indiquée dans asso.csv"
            elif nom == "etat":
                payeur = "N-ETAT"
                for motif, rec in RECEVEUR_ETAT:
                    if re.search(motif, x["libelle"]):
                        receveur = rec
                        break
                regle = "receveur déduit du libellé de la ligne de l'État"
            out.append({"id": f"FX-{nom}-{len(out) + 1:04d}", "ligne_source": ident, "fichier_source": f"modeles/grand-livre/{nom}.csv",
                        "payeur": payeur, "receveur": receveur, "montant_md_eur": fmt(nombre(x["montant_md_eur"])),
                        "annee": x.get("annee", ""), "libelle": x["libelle"][:160], "contrepartie_grand_livre": cible[:80],
                        "regle": regle, "statut": "calcul" if receveur else "⚠️ receveur inconnu"})
    return out


# --------------------------------------------------------------------------------------------
# 5. France services par département -> guichets_france_services.csv
# --------------------------------------------------------------------------------------------
def guichets(fs):
    agg = defaultdict(lambda: {"structures": 0, "principales": 0, "antennes": 0, "mobiles": 0, "communes": set()})
    for x in fs:
        d = agg[x["insee_dep"]]
        d["structures"] += 1
        d["principales"] += x["type_fs"] == "Principal"
        d["antennes"] += x["type_fs"] == "Antenne"
        d["mobiles"] += x["format_fs"] in ("Bus_équivalent", "Itinérante")
        d["communes"].add(x["insee_com"])
    return [{"insee_dep": k, "structures": v["structures"], "principales": v["principales"], "antennes": v["antennes"],
             "bus_ou_itinerantes": v["mobiles"], "communes_d_implantation": len(v["communes"]),
             "source": "ANCT, liste des structures labellisées France services, fichier du 05/11/2026 (data.gouv.fr, Licence ouverte 2.0)"}
            for k, v in sorted(agg.items())]


# --------------------------------------------------------------------------------------------
# 6. Data package Frictionless
# --------------------------------------------------------------------------------------------
CLES = {  # ressource -> (clé primaire, [(champ, ressource, champ)])
    "niveaux": ("id", []),
    "competences": ("id", []),
    "attributions": (None, [("competence", "competences", "id"), ("niveau", "niveaux", "id")]),
    "organismes": ("id", []),
    "demarches": ("id", []),
    "demarche_etapes": (None, [("demarche", "demarches", "id"), ("organisme", "organismes", "id")]),
    "regles": ("id_regle", []),
    "fonction_competence": (None, []),
    "correspondance_niveaux": ("niveau_actuel", []),
    "batiments": ("id", []),
    "organismes_instances": ("id", []),
    "agents": ("id", []),
    "budgets_competences": (None, []),
    "flux": ("id", []),
    "guichets_france_services": ("insee_dep", []),
    "fiches_service_public": ("id", []),
}
NUMERIQUES = {"nombre", "depenses_md_eur", "montant_md_eur", "budget_md_eur", "effectifs_etp", "effectif", "etp", "nb_lignes",
              "structures", "principales", "antennes", "bus_ou_itinerantes", "communes_d_implantation", "ordre",
              "pieces_actuel_min", "pieces_actuel_max", "pieces_propose", "nb_caracteres", "surface_m2", "cout_entretien_md_eur"}


def schema_table(nom, champs):
    pk, fks = CLES.get(nom, (None, []))
    s = {"fields": [{"name": c, "type": "number" if c in NUMERIQUES else "string"} for c in champs]}
    if pk:
        s["primaryKey"] = pk
    if fks:
        s["foreignKeys"] = [{"fields": c, "reference": {"resource": r, "fields": f}} for c, r, f in fks]
    return s


def datapackage(dossier):
    ressources = []
    for nom in CLES:
        chemin = os.path.join(dossier, nom + ".csv")
        if not os.path.exists(chemin):
            continue
        with open(chemin, encoding="utf-8") as f:
            champs = next(csv.reader(f, delimiter=";"))
        ressources.append({"name": nom.replace("_", "-"), "path": f"donnees/{nom}.csv", "format": "csv", "mediatype": "text/csv",
                           "encoding": "utf-8", "dialect": {"delimiter": ";", "decimalChar": ","}, "schema": schema_table(nom, champs)})
    # les références de clés étrangères utilisent le nom de ressource (tirets)
    for r in ressources:
        for fk in r["schema"].get("foreignKeys", []):
            fk["reference"]["resource"] = fk["reference"]["resource"].replace("_", "-")
    return {
        "name": "etat-as-code", "title": "L'État as code : état actuel et état proposé (v0)", "version": "0.1.0",
        "created": "2026-11-06", "licenses": [{"name": "etalab-2.0", "title": "Licence ouverte 2.0 (données publiques reprises)"}],
        "description": "Modèle de données de l'État français : niveaux, compétences, organismes, démarches, flux, règles de droit, agents, bâtiments ; deux états (actuel, propose). Voir SCHEMA.md.",
        "resources": ressources,
    }


def main(argv):
    organismes = lire(os.path.join(DONNEES, "organismes.csv"))
    ecrire(os.path.join(DONNEES, "organismes_instances.csv"), organismes_instances(lire(os.path.join(GL, "instances.csv")), organismes),
           ["id", "nom", "type", "famille", "budget_md_eur", "budget_annee", "effectifs_etp", "effectifs_annee", "preclassement", "cible",
            "ministere_propose", "sort_propose", "organisme_modele", "competences", "source", "cote"])
    ecrire(os.path.join(DONNEES, "agents.csv"), agents(lire(os.path.join(GL, "agents-publics.csv"))),
           ["id", "nom", "niveau", "effectif", "unite", "annee", "statut", "source"])
    regles = lire(os.path.join(DONNEES, "fonction_competence.csv"))
    ecrire(os.path.join(DONNEES, "budgets_competences.csv"), budgets(lire(os.path.join(GL, "apul.csv")), regles),
           ["niveau", "entite_source", "competence", "montant_md_eur", "annee", "nb_lignes", "source", "statut"])
    fichiers = [(n, lire(os.path.join(GL, n + ".csv"))) for n in ("etat", "odac", "apul", "asso")]
    ecrire(os.path.join(DONNEES, "flux.csv"), flux(fichiers),
           ["id", "ligne_source", "fichier_source", "payeur", "receveur", "montant_md_eur", "annee", "libelle", "contrepartie_grand_livre", "regle", "statut"])
    if len(argv) >= 3:
        ecrire(os.path.join(DONNEES, "guichets_france_services.csv"), guichets(lire(argv[1])),
               ["insee_dep", "structures", "principales", "antennes", "bus_ou_itinerantes", "communes_d_implantation", "source"])
        utiles = set()
        for dm in lire(os.path.join(DONNEES, "demarches.csv")):
            utiles.update(filter(None, dm["fiches_service_public"].split(",")))
        idx = [x for x in lire(argv[2]) if x["id"] in utiles and x["audience"] == ("professionnels" if x["id"] in ("F36746", "F23107") else "particuliers")]
        ecrire(os.path.join(DONNEES, "fiches_service_public.csv"), idx,
               ["id", "audience", "titre", "date_modif", "url", "ou_s_adresser", "qui_peut_aider", "france_services", "services_en_ligne", "cerfa", "references"])
    with open(os.path.join(MODELE, "datapackage.json"), "w", encoding="utf-8") as f:
        json.dump(datapackage(DONNEES), f, ensure_ascii=False, indent=1)
    print("tables dérivées et datapackage.json écrits dans", MODELE)


if __name__ == "__main__":
    main(sys.argv)
