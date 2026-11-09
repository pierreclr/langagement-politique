# -*- coding: utf-8 -*-
"""Calcule les résultats du modèle et les écrit dans resultats/ (CSV) ; affiche un résumé.

Usage : python3 -I modeles/etat-as-code/code/rapport.py
"""
import csv
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # python3 -I n'ajoute pas le dossier du script
import modele as M  # noqa: E402

SORTIE = os.path.join(M.RACINE, "resultats")


def ecrire(nom, lignes, champs):
    with open(os.path.join(SORTIE, nom), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=champs, delimiter=";")
        w.writeheader()
        w.writerows(lignes)


def main():
    os.makedirs(SORTIE, exist_ok=True)
    m = M.charger()
    comp = {c["id"]: c for c in m["competences"]}
    fin = M.budgets_par_competence(m)
    jur = M.chevauchements(m, "actuel")
    lar = M.chevauchements(m, "actuel", M.ROLES_LARGES)
    strict = M.chevauchements(m, "actuel", {"responsable", "responsable_partiel", "partage"})
    resp_p = M.responsables(m, "propose")
    lignes = []
    for c in m["competences"]:
        cid = c["id"]
        lignes.append({
            "competence": cid, "libelle": c["libelle"],
            "niveaux_juridiques_actuel": " ".join(sorted(M.niveaux_par_competence(m, "actuel", M.ROLES_JURIDIQUES).get(cid, []))),
            "nb_niveaux_juridiques": len(M.niveaux_par_competence(m, "actuel", M.ROLES_JURIDIQUES).get(cid, [])),
            "niveaux_larges_actuel": " ".join(sorted(M.niveaux_par_competence(m, "actuel", M.ROLES_LARGES).get(cid, []))),
            "chevauchement_strict": "oui" if cid in strict else "non",
            "niveaux_qui_financent_2024": " ".join(f"{k}:{v:.2f}" for k, v in sorted(fin.get(cid, {}).items())),
            "depense_locale_2024_md_eur": f"{sum(fin.get(cid, {}).values()):.3f}",
            "existe_propose": c["existe_propose"], "devient": c["devient"],
            "responsable_propose": M.niveau_propose_de(m, cid),
        })
    ecrire("competences_avant_apres.csv", lignes, list(lignes[0].keys()))

    ia, ip = M.interlocuteurs(m, "actuel"), M.interlocuteurs(m, "propose")
    fs = M.france_services_actuel(m)
    dl = []
    for d in m["demarches"]:
        k = d["id"]
        dl.append({"demarche": k, "libelle": d["libelle"], "interlocuteurs_actuel": ia[k]["obligatoires"],
                   "dont_publics_actuel": ia[k]["publics_obligatoires"], "avec_facultatifs_actuel": ia[k]["avec_facultatifs"],
                   "organismes_actuel": " ".join(ia[k]["organismes"]), "interlocuteurs_propose": ip[k]["obligatoires"],
                   "dont_publics_propose": ip[k]["publics_obligatoires"], "organismes_propose": " ".join(ip[k]["organismes"]),
                   "pieces_actuel": (d["pieces_actuel_min"] + ("-" + d["pieces_actuel_max"] if d["pieces_actuel_max"] and d["pieces_actuel_max"] != d["pieces_actuel_min"] else "")) or "n.c.",
                   "pieces_propose": d["pieces_propose"] or "n.c.", "france_services_actuel": fs[k]})
    ecrire("demarches_avant_apres.csv", dl, list(dl[0].keys()))

    red = []
    for n in ("N-COM", "N-EPCI", "N-SYN", "N-DEP", "N-REG"):
        _, det = M.redistribution(m, n)
        agg = defaultdict(float)
        for c, ent, v, cible in det:
            agg[(c, cible)] += v
        for (c, cible), v in sorted(agg.items(), key=lambda x: -x[1]):
            red.append({"niveau_actuel": n, "competence": c, "libelle": comp.get(c, {}).get("libelle", c), "montant_2024_md_eur": f"{v:.3f}", "repreneur_propose": cible})
    ecrire("redistribution_budgets.csv", red, list(red[0].keys()))

    fp = M.flux_propose(m)
    ecrire("flux_propose.csv", fp, list(fp[0].keys()))
    manque = M.instances_gardees_sans_competence(m)
    ecrire("organismes_gardes_sans_competence.csv", manque, list(m["organismes_instances"][0].keys()))

    # Résumé
    print(f"Compétences : {len(m['competences'])} ; attributions : {len(m['attributions'])} ; règles : {len(m['regles'])}")
    print(f"Chevauchements actuels : juridiques {len(jur)}, stricts {len(strict)}, larges {len(lar)} (sur {len({a['competence'] for a in m['attributions'] if a['etat'] == 'actuel'})})")
    hist = defaultdict(int)
    for c in M.niveaux_par_competence(m, "actuel", M.ROLES_JURIDIQUES).values():
        hist[len(c)] += 1
    print("  répartition par nombre de niveaux :", dict(sorted(hist.items())))
    cf = M.chevauchements_financiers(m)
    print(f"Financements croisés (≥ 2 niveaux à 50 M€ ou plus) : {len(cf)} compétences")
    print("Proposé : orphelines/multiples", M.anomalies_responsables_propose(m), "; à arbitrer", M.a_arbitrer(m))
    print(f"Interlocuteurs obligatoires : {sum(v['obligatoires'] for v in ia.values())} -> {sum(v['obligatoires'] for v in ip.values())} ; publics {sum(v['publics_obligatoires'] for v in ia.values())} -> {sum(v['publics_obligatoires'] for v in ip.values())}")
    print("France services :", dict(sorted(defaultdict(int, {v: list(fs.values()).count(v) for v in set(fs.values())}).items())))
    nr = M.flux_non_rattaches(m)
    print(f"Flux : {len(m['flux'])} lignes, {M.montant(m['flux']):.1f} Md€ ; sans receveur {len(nr)} ({M.montant(nr):.1f} Md€) ; identifiés au niveau {M.montant(M.flux_rattaches_au_niveau(m)):.1f} Md€")
    cat = defaultdict(float)
    for f in fp:
        cat[f["categorie"]] += M.nombre(f["montant_md_eur"]) or 0
    print("Flux projetés :", {k: round(v, 1) for k, v in cat.items()})
    sup = defaultdict(float)
    for b in m["budgets_competences"]:
        if b["competence"] == "SUPPORT":
            sup[b["niveau"]] += M.nombre(b["montant_md_eur"])
    print("Fonctions support 2024 (Md€) :", {k: round(v, 2) for k, v in sup.items()})
    for n in ("N-DEP", "N-COM", "N-EPCI", "N-SYN", "N-REG"):
        d, _ = M.redistribution(m, n)
        print(f"Redistribution {n} :", {k: round(v, 2) for k, v in sorted(d.items(), key=lambda x: -x[1])})
    print(f"Recensement : {len(manque)} organismes gardés sans compétence rattachée (sur {len(m['organismes_instances'])})")


if __name__ == "__main__":
    main()
