# -*- coding: utf-8 -*-
"""Produit resultats.txt : python3 -I modeles/grand-age/code/rapport.py > modeles/grand-age/resultats.txt"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import grand_age as g  # noqa: E402

ABATTEMENTS = (0, 100_000, 300_000)


def f(x, n=1):
    return ("%." + str(n) + "f") % x


def main():
    print("MODELE DU GRAND AGE - euros 2026, Md EUR par an en croisiere sauf mention")
    print("bas = hypotheses favorables aux finances publiques ; haut = defavorables\n")
    print("== 1. Prix public unique par resident et par mois (euros 2026)")
    for s in ("bas", "central", "haut"):
        px = g.prix_public(g.parametres(s))
        print("%-8s total %s | hebergement %s | dependance %s | soin %s" % (
            s, f(px["total"], 0), f(px["hebergement"], 0), f(px["dependance"], 0), f(px["soin"], 0)))
    print("\n== 2. Cout public actuel (residents en hebergement permanent 2023, euros 2026)")
    for s in ("bas", "central", "haut"):
        c = g.cout_public_actuel(g.parametres(s))
        print("%-8s soin %s | APA %s | ASH nette %s | AL+RI %s | total %s" % (
            s, f(c["soin"]), f(c["apa"]), f(c["ash"]), f(c["al_ri"]), f(c["total"])))
    print("\n== 2 bis. Cout public actuel recale sur la couverture publique de 74 % (DREES), hors gite et couvert")
    for s in ("bas", "central", "haut"):
        pp = g.parametres(s)
        print("%-8s %s Md (reconstitution ci-dessus : %s) ; recuperations ASH actuelles supposees %s Md" % (
            s, f(g.cout_public_actuel_cale(pp)), f(g.cout_public_actuel(pp)["total"]),
            f(g.recuperations_actuelles_ash(pp), 2)))
    print("\n== 3. Proposition, regime de croisiere pour les residents de 2023")
    print("recuperation de l'avance hebergement seule (regle centrale)")
    for A in ABATTEMENTS:
        print("-- abattement de reprise %s EUR" % format(A, ","))
        for s in ("bas", "central", "haut"):
            r = g.simuler(g.parametres(s), A)
            c = g.cout_public_actuel(g.parametres(s))["total"]
            print("%-8s participation %s (%s EUR/mois en moyenne) | depense publique brute %s | reprises %s | nette %s | "
                  "perte de droits de transmission %s | nette apres droits %s | actuel %s | ecart (nette apres droits - actuel) %+.1f" % (
                      s, f(r["recette_participation_Md"]), f(r["participation_moyenne_mois"], 0),
                      f(r["depense_publique_brute_Md"]), f(r["reprises_annuelles_Md"]),
                      f(r["depense_publique_nette_Md"]), f(r["perte_droits_transmission_Md"], 2),
                      f(r["depense_publique_nette_apres_droits_Md"]), f(c),
                      r["depense_publique_nette_apres_droits_Md"] - c))
    print("\nIndicateurs de structure (central) :")
    for A in ABATTEMENTS:
        rr = g.simuler(g.parametres("central"), A)
        print("abattement %s : %.0f %% des residents ont une avance a reprendre ; %.0f %% des successions de residents sont touchees ; "
              "reprise moyenne quand touchee %s EUR ; avance annuelle %s Md" % (
                  format(A, ","), 100 * rr["part_residents_avec_avance"], 100 * rr["part_successions_touchees"],
                  format(int(rr["reprise_moyenne_si_touchee"]), ","), f(rr["avance_hebergement_annuelle_Md"])))
    print("\n== 3 bis. Variante : reprise sur toute la difference (soin et dependance compris), central")
    for A in ABATTEMENTS:
        r = g.simuler(g.parametres("central", recuperation_sur_difference_totale=True), A)
        print("abattement %s : reprises %s | nette %s | perte de droits %s" % (
            format(A, ","), f(r["reprises_annuelles_Md"]), f(r["depense_publique_nette_Md"]),
            f(r["perte_droits_transmission_Md"], 2)))
    print("\n== 4. Projection (central, abattement 100 000 EUR), nombre de residents et depense nette apres droits")
    for an in (2023, 2028, 2035, 2040, 2050):
        r = g.projection(g.parametres("central"), an, 100_000)
        print("%d : %s residents | depense totale %s | brute %s | nette apres droits %s" % (
            an, format(int(r["residents"]), ","), f(r["depense_totale_Md"]), f(r["depense_publique_brute_Md"]),
            f(r["depense_publique_nette_apres_droits_Md"])))
    print("\n== 4 bis. Projection 2040 selon scenario (abattement 100 000)")
    for s in ("bas", "central", "haut"):
        r = g.projection(g.parametres(s), 2040, 100_000)
        print("%-8s %s residents | depense totale %s | nette apres droits %s" % (
            s, format(int(r["residents"]), ","), f(r["depense_totale_Md"]), f(r["depense_publique_nette_apres_droits_Md"])))
    print("\n== 5. Cas types (central, abattement de reprise 100 000 EUR, sejour de %.0f mois)" % (
        g.parametres()["duree_sejour_deces"] * 12))
    p = g.parametres("central")
    print("pension | patrimoine | Y | actuel: manque/mois, prelevement patrimoine | proposition: participation, poche, reprise | ecart transmis | ecart poche/mois")
    for pen in (1000, 2000, 3000):
        for pat in (0, 100_000, 300_000, 600_000):
            c = g.cas_type(pen, pat, p, 100_000)
            print("%5d | %7s | %5s | %5s, %7s | %5s, %4s, %7s | %+8s | %+5s" % (
                pen, format(pat, ","), f(c["revenu_Y"], 0), f(c["actuel_manque_par_mois"], 0),
                format(int(c["actuel_prelevement_patrimoine"]), ","), f(c["prop_participation_par_mois"], 0),
                f(c["prop_argent_de_poche"], 0), format(int(c["prop_reprise_patrimoine"]), ","),
                format(int(c["ecart_transmis"]), ","), f(c["ecart_argent_de_poche_par_mois"], 0)))
    print("\n== 5 bis. Couple qui entre ensemble (pensions 1 000 + 3 000, patrimoine 200 000, abattement 100 000)")
    r = g.couple_entre_ensemble(1000, 3000, 200_000, p, 100_000)
    print({k: (tuple(round(x) for x in v) if isinstance(v, tuple) else round(v)) for k, v in r.items()})
    print("Conjoint a domicile : pension du resident 2 000, conjoint sans revenu -> participation",
          f(g.conjoint_a_domicile(2000, 0, p), 0), "(contre", f(g.participation(2000, p), 0), "sans conjoint)")
    print("\n== 6. Aide a domicile : APA a domicile 4,293 Md (2023) -> euros 2026, hausse de volume prioritaire")
    for h in (0.10, 0.20, 0.40):
        d = g.domicile(p, h)
        print("hausse de volume %d %% : %s -> %s (surcout %s)" % (h * 100, f(d["actuel_Md"]), f(d["propose_Md"]), f(d["surcout_Md"])))
    cp = g.cout_public_domicile_vs_etablissement()
    print("Depense publique annuelle d'une personne en GIR 1 hors gite-couvert (2020) : domicile %s EUR, etablissement %s EUR" % (
        format(round(cp["domicile"]), ","), format(round(cp["etablissement"]), ",")))
    print("\n== 7. Sensibilite (central, abattement 100 000) : un parametre a la fois, depense nette apres droits (Md)")
    ref = g.simuler(p, 100_000)["depense_publique_nette_apres_droits_Md"]
    print("reference", f(ref))
    for nom, val in (("cout_place_facteur", 0.9), ("cout_place_facteur", 1.1), ("ressources_uplift_2016_2026", 1.15),
                     ("ressources_uplift_2016_2026", 1.30), ("duree_sejour_deces", 2.4), ("duree_sejour_deces", 3.3),
                     ("part_proprietaires", 0.4), ("part_proprietaires", 0.65), ("correlation_revenu_patrimoine", 0.3),
                     ("correlation_revenu_patrimoine", 0.7), ("argent_de_poche_min", 200.0), ("taux_participation", 1.0),
                     ("taux_participation", 0.8)):
        r = g.simuler(g.parametres("central", **{nom: val}), 100_000)["depense_publique_nette_apres_droits_Md"]
        print("%-32s %-8s -> %s (%+.1f)" % (nom, val, f(r), r - ref))


if __name__ == "__main__":
    main()
