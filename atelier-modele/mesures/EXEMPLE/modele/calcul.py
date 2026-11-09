# -*- coding: utf-8 -*-
"""Squelette de calcul d'une mesure. Python standard, sans installation.

Lancer : python3 -I calcul.py
Règles : fonctions pures (mêmes entrées, mêmes sorties), pas de lecture de fichier ni d'aléa cachés,
chaque hypothèse numérotée comme dans methode.md, trois scénarios : bas, central, haut.

Les valeurs ci-dessous sont des PLACEHOLDERS pour que le squelette s'exécute. Ce ne sont ni des faits
ni des estimations : remplacez-les par vos hypothèses sourcées (voir methode.md).
"""

# H1 : nombre de personnes concernées (placeholder)
# H2 : coût moyen par personne, en euros par an (placeholder)
# H3 : part qui renonce, entre 0 et 1 (placeholder)
SCENARIOS = {
    "bas": {"personnes": 1000, "cout_par_personne": 1000.0, "part_renoncement": 0.50},
    "central": {"personnes": 2000, "cout_par_personne": 1500.0, "part_renoncement": 0.30},
    "haut": {"personnes": 3000, "cout_par_personne": 2000.0, "part_renoncement": 0.10},
}


def beneficiaires(personnes, part_renoncement):
    """Nombre de personnes qui utilisent réellement la mesure."""
    return personnes * (1.0 - part_renoncement)


def cout_annuel(personnes, cout_par_personne, part_renoncement):
    """Coût annuel en euros."""
    return beneficiaires(personnes, part_renoncement) * cout_par_personne


def calculer(scenarios=SCENARIOS):
    """Résultat de chaque scénario : dictionnaire nom -> coût annuel en euros."""
    return {nom: cout_annuel(**hyp) for nom, hyp in scenarios.items()}


if __name__ == "__main__":
    for nom, valeur in calculer().items():
        print("%-8s %12.0f euros par an" % (nom, valeur))
