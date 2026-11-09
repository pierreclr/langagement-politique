#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lance les tests ou le rapport d'une couche du système (JavaScript, moteur « jsc » de WebKit).

Les couches se chargent les unes après les autres dans un même contexte JavaScript : l'ordre ci-dessous est celui qui
était noté en tête de chaque test. Aucune dépendance Python ; il faut seulement le moteur `jsc`.

Usage (depuis n'importe où) :
    python3 -I modeles/systeme-ideal/lancer.py test      # les contrôles de la couche decisions_0811 (retour 0 si tout passe)
    python3 -I modeles/systeme-ideal/lancer.py rapport   # tableaux de resultats_decisions_0811.txt (sortie standard)
    python3 -I modeles/systeme-ideal/lancer.py export    # dernière ligne EXPORT, recopiée dans sources/calculs/bilan_global.py
    python3 -I modeles/systeme-ideal/lancer.py liste     # affiche la commande jsc complète

Moteur : variable d'environnement JSC, sinon `jsc` dans le PATH, sinon le chemin macOS
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc.
"""
import os
import shutil
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
MACOS = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"

# Base de travail du 06/11/2026 (test_base_0611.js), puis couches successives jusqu'à decisions_0811.js
BASE = """modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js
deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js
../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js
../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js
../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js decisions_0511.js
decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js
../retraites/age_libre.js decisions_0511e.js decisions_0511f.js ../fiscalite-orientation/modele.js decisions_0511g.js
decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js
variante_dette_stable.js bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js
decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js base_0611.js""".split()
COUCHES = ["cas_types_nets_0611.js", "variante_nationalite_0611.js", "transmissions_0611.js", "retraites_aisees_0611.js",
           "consolidation_0611.js", "decisions_0711.js", "decisions_0811.js"]
FINAL = {"test": "test_decisions_0811.js", "rapport": "rapport_decisions_0811.js", "export": "rapport_decisions_0811.js"}


def moteur():
    return os.environ.get("JSC") or shutil.which("jsc") or (MACOS if os.path.exists(MACOS) else None)


def main(argv):
    mode = argv[1] if len(argv) > 1 else "test"
    if mode == "liste":
        print(" ".join(["jsc"] + BASE + COUCHES + [FINAL["test"]]))
        return 0
    if mode not in FINAL:
        print(__doc__)
        return 1
    jsc = moteur()
    if not jsc:
        print("Moteur jsc introuvable : installez-le (macOS : déjà présent ; Linux : paquet WebKit « jsc ») ou définissez JSC.")
        return 1
    fichiers = BASE + COUCHES + [FINAL[mode]]
    manquants = [f for f in fichiers if not os.path.exists(os.path.join(ICI, f))]
    if manquants:
        print("fichiers absents : " + ", ".join(manquants))
        return 1
    r = subprocess.run([jsc] + fichiers, cwd=ICI, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    sortie = r.stdout
    if mode == "export":
        sortie = [l for l in sortie.splitlines() if l.startswith("EXPORT")][-1:]
        sortie = "\n".join(sortie) + "\n"
    if mode == "test":
        lignes = sortie.splitlines()
        print("\n".join(lignes[-3:]))
        print("%d contrôles réussis" % sum(1 for l in lignes if l.startswith("ok ")))
    else:
        sys.stdout.write(sortie)
    return r.returncode


if __name__ == "__main__":
    sys.exit(main(sys.argv))
