#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Calcule les résultats de modeles/capital-de-depart-options/ et écrit resultats.md et donnees/resultats.json.
Usage (racine de l'atelier) : node modeles/capital-de-depart-options/code/exporter_heritages.js
                              python3 -I modeles/capital-de-depart-options/code/calculer.py   (≈ 1 min)
Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses : methode.md."""
import json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import options as O      # noqa: E402  (ajoute aussi modeles/fonciere-usufruit/code au chemin)
sys.path.remove(ICI)     # le calculer.py de la foncière est chargé par son chemin, sans conflit de nom
import importlib.util    # noqa: E402
_spec = importlib.util.spec_from_file_location('calc_fonciere', os.path.join(O.FONC, 'calculer.py'))
CF = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(CF)

NOMS_OPT = {'sans': 'Sans capital ni foncière', 'A': 'A. 40 000 € seulement par la foncière',
            'B': 'B. foncière 40 000 € ou 20 000 € en argent', "B'": "B'. idem, 20 000 € en cinq versements",
            "B'pv": "B'. idem, 20 000 € en parts à vie", 'C': 'C. foncière 40 000 € ou 20 000 € formation/entreprise',
            'D': 'D. chapitre 3 : 40 000 € en cinq versements'}
SECT = ('paris', 'metropoles', 'villes_moyennes', 'rural')
NS = {'paris': 'Paris', 'metropoles': 'Métropoles', 'villes_moyennes': 'Villes moyennes', 'rural': 'Rural'}
e, pc, tab = CF.e, CF.pc, CF.tab


def pp(x, d=1):
    return e(100 * x, d) + ' %'


def evaluer(nom, sc, T, S, her, sc_fin='central', **reg):
    """Choix + simulation de la foncière (règle du § 28) pour une option et un scénario de recours."""
    h = O.SCENARIOS[sc]
    r = O.agreger(O.reglage(nom, **reg), h, her, S, T['ensemble'])
    b = None
    if r['part_F'] > 0:
        b = O.bilan_fonciere(O.F.simuler(O.params_fonciere(r, h, sc_fin), T['ensemble']))
    return r, b


def ligne_option(nom, r, b, r_bas, r_haut):
    pmax = max(r['prix'][k] for k in SECT if k != 'paris')
    return [NOMS_OPT[nom], e(r['cout_md'], 1) + f" ({e(r_bas['cout_md'], 1)}–{e(r_haut['cout_md'], 1)})",
            pp(r['part_F'], 0) + f" ({pp(r_bas['part_F'], 0)}–{pp(r_haut['part_F'], 0)})",
            pp(r['proprio'], 0), pp(r['proprio_D15'], 0), pp(max(0.0, 1 - r['parts']['rien']), 0), e(r['libre_md'], 1),
            e(b['besoin10'], 0) if b else '—', e(b['dette10'], 0) if b else '—', e(b['dette30'], 0) if b else '—',
            (pp(b['ratio_min'], 0)) if b else '—', pp(pmax)]


def main():
    T = CF.charger_table()
    q = T['ensemble']
    S = CF.charger_secteurs()
    her = O.charger_heritages()
    js = {}
    md = ['---', 'titre: Capital de départ et foncière — options comparées : résultats',
          'statut: brouillon ; généré par code/calculer.py ; écrit par Claude (IA d\'Anthropic) pour l\'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions',
          '---', '', '# Capital de départ et foncière : options comparées', '',
          'Hypothèses H-CO1 à H-CO31 dans `methode.md`. Règle de la foncière : § 28 de la note de conception de la foncière (atelier, non publiée) (mensualité d\'un prêt bancaire '
          'à 3,32 % sur 25 ans sur le prix diminué de l\'apport ; renonciation à la nue-propriété ; contribution payée comme tout propriétaire). Montants '
          'avant décote : capital = montant × e^(−héritage / 80 000 €). Génération de 830 000 jeunes ; euros de 2026 ; régime = une génération par an. '
          'Scénarios de **recours** : bas (faible), central, haut (fort, défavorable aux prix et à la dette).', '']

    # ---------------- 1. Comparatif ----------------
    md.append('## 1. Comparatif des options (régime)\n')
    noms = ['sans', 'A', 'B', "B'", "B'pv", 'C', 'D']
    R = {}
    lignes = []
    for nom in noms:
        R[nom] = {sc: evaluer(nom, sc, T, S, her) for sc in ('bas', 'central', 'haut')}
        r, b = R[nom]['central']
        lignes.append(ligne_option(nom, r, b, R[nom]['bas'][0], R[nom]['haut'][0]))
    md.append(tab(['Option', 'Coût capital, Md€/an (bas–haut)', 'Part d\'une génération par la foncière', 'Propriétaires ou usufruitiers à 35 ans',
                   'idem, héritage D1-D5', 'Reçoivent quelque chose', 'Argent libre, Md€/an', 'Besoin de financement an 10, Md€', 'Dette foncière an 10, Md€',
                   'Dette an 30, Md€', 'Test des 50 % : ratio min (an 5 à 60)', 'Effet prix max hors Paris (central)'], lignes))
    md.append('\nPrix : effet de niveau borné (demande additionnelle / ventes / élasticité du secteur), par secteur (central, et bas–haut) :\n')
    lignes = []
    for nom in noms[1:]:
        lignes.append([NOMS_OPT[nom]] + [f"{pp(R[nom]['central'][0]['prix'][k])} ({pp(R[nom]['bas'][0]['prix'][k])}–{pp(R[nom]['haut'][0]['prix'][k])})" for k in SECT])
    md.append(tab(['Option'] + [NS[k] for k in SECT], lignes))
    # sensibilité financière : la foncière paie 4,7 %
    lignes = []
    for nom in ('A', "B'pv", 'C', 'D'):
        r, _ = R[nom]['central']
        b = O.bilan_fonciere(O.F.simuler(O.params_fonciere(r, O.SCENARIOS['central'], 'haut'), q))
        bh = O.bilan_fonciere(O.F.simuler(O.params_fonciere(R[nom]['haut'][0], O.SCENARIOS['haut'], 'haut'), q))
        lignes.append([NOMS_OPT[nom], pp(b['ratio_min'], 0), str(b['sous_50'] or 'jamais'), e(b['dette30'], 0), pp(bh['ratio_min'], 0), e(bh['dette30'], 0)])
    md.append('\nSensibilité : la foncière emprunte à 4,7 % (scénario financier « haut » de la foncière) :\n')
    md.append(tab(['Option', 'Ratio min (recours central)', 'Sous 50 % dès', 'Dette an 30, Md€', 'Ratio min (recours haut)', 'Dette an 30 (recours haut)'], lignes))
    js['comparatif'] = {nom: {sc: dict(cout=R[nom][sc][0]['cout_md'], part_F=R[nom][sc][0]['part_F'], proprio=R[nom][sc][0]['proprio'],
                                       prix=R[nom][sc][0]['prix'], fonciere=R[nom][sc][1]) for sc in R[nom]} for nom in noms}

    # ---------------- 1 bis. Bilan public dans le temps ----------------
    md.append('\n### Bilan public dans le temps : aides au logement évitées, gestion, patrimoine de la foncière (central, Md€ de 2026)\n')
    md.append('Aide évitée : part logement du socle de revenu (250 € par mois, retirée avec le filet, chapitre 4 ; H-CO31) que ne touchent plus, une fois '
              'leur droit remboursé, les usufruitiers qui seraient restés locataires ; pendant le remboursement, ils la touchent comme un locataire (décision de l\'auteur, 09/11). '
              'Repère : 15,9 à 16,0 Md€ d\'aides personnelles au logement en 2024, tous parcs. Coût net = capital versé + gestion de la foncière (payée par l\'État) '
              '− aides évitées − hausse annuelle du patrimoine net de la foncière (logements qui reviennent, remboursements).\n')
    lignes = []
    for nom in ('A', 'B', "B'pv", 'C', 'D'):
        r, b = R[nom]['central']
        net30 = r['cout_md'] + b['gestion30'] - b['aide30']
        net60 = r['cout_md'] + b['gestion60'] - b['aide60'] - b['dnet60']
        lignes.append([NOMS_OPT[nom], e(r['cout_md'], 1), e(r['aide_contrat'], 0), e(b['aide30'], 2), e(b['aide45'], 2), e(b['aide60'], 2),
                       e(b['gestion60'], 1), e(b['net30'], 0), e(b['net60'], 0), e(b['dnet60'], 1), e(net30, 1), e(net60, 1)])
    md.append(tab(['Option', 'Capital versé', 'Aide évitée par contrat (€/mois)', 'Aides évitées an 30', 'an 45', 'an 60', 'Gestion an 60',
                   'Patrimoine net foncière an 30', 'an 60', 'Hausse du patrimoine an 60', 'Coût net an 30 (sans patrimoine)', 'Coût net an 60'], lignes))
    md.append('')
    md.append('Comparaison avec les avantages fiscaux de l\'investissement locatif : seul le Censi-Bouvard est chiffré (35 à 39 M€ par an, PLF 2026) ; le coût du '
              'régime réel de la location meublée non professionnelle (amortissement) **n\'est pas isolé** dans les documents budgétaires '
              '(`sources/recherche-fiscalite-immobiliere.md` § 1.4, ⚠️ V3939) : aucune comparaison chiffrée n\'est possible.\n')

    # ---------------- 2. Qui gagne ----------------
    md.append('\n## 2. Qui gagne : capital reçu (€ par jeune) et part propriétaire, par décile (central)\n')
    for cle, titre in (('dec_h', 'héritage reçu ou attendu'), ('dec_y', 'revenu à 25-34 ans')):
        lignes = []
        for nom in ('A', 'B', "B'pv", 'C', 'D'):
            r = R[nom]['central'][0]
            lignes.append([NOMS_OPT[nom]] + [f"{e(d['verse'] / 1000, 0)} k / {pp(d['proprio'], 0)}" for d in r[cle]])
        md.append(f'Par décile de {titre} (capital reçu / part propriétaire ou usufruitière à 35 ans) :\n')
        md.append(tab(['Option'] + [f'D{k}' for k in range(1, 11)], lignes))
        md.append('')
    lignes = []
    for nom in ('sans', 'A', 'B', "B'pv", 'C', 'D'):
        r = R[nom]['central'][0]
        lignes.append([NOMS_OPT[nom]] + [f"{e(r['secteurs'][k]['verse'] / 1000, 1)} k / {pp(r['secteurs'][k]['F'], 0)} / {pp(r['secteurs'][k]['proprio'], 0)}" for k in SECT])
    md.append('Par secteur (capital reçu par jeune / part par la foncière / part propriétaire ou usufruitière) :\n')
    md.append(tab(['Option'] + [NS[k] for k in SECT], lignes))

    # ---------------- 3. Réglage global ----------------
    md.append('\n## 3. Recherche du meilleur réglage (recours central, foncière centrale)\n')
    grille = []
    for G in (30000.0, 40000.0, 50000.0):
        for alt in ('A', "B'pv", 'C'):
            for duree in (25, 30):
                for dt in (0.0, 0.005, 0.01):
                    for quota in (None, 0.15, 0.20, 0.25):
                        r, b = evaluer(alt, 'central', T, S, her, G=G, duree=duree, taux=O.TAUX_BANQUE + dt, quota=quota)
                        pmax = max(r['prix'][k] for k in SECT)
                        grille.append(dict(G=G, alt=alt, duree=duree, dt=dt, quota=quota, cout=r['cout_md'], part_F=r['part_F'],
                                           proprio=r['proprio'], d15=r['proprio_D15'], recoit=1 - r['parts']['rien'], pmax=pmax,
                                           ratio=b['ratio_min'] if b else None, dette30=b['dette30'] if b else 0.0,
                                           y1=r['dec_y'][0]['proprio'], paris=r['secteurs']['paris']['proprio']))
    ok = [g for g in grille if g['ratio'] and g['ratio'] >= 0.5 and g['pmax'] <= 0.05 and g['cout'] <= 14.7]
    ok.sort(key=lambda g: (-round(g['d15'], 3), g['cout']))
    js['grille'] = grille

    def lg(g):
        return [e(g['G'] / 1000, 0) + ' k', NOMS_OPT[g['alt']].split('.')[0] + (' (parts à vie)' if g['alt'] == "B'pv" else ''), str(g['duree']) + ' ans', '+' + e(100 * g['dt'], 1) + ' pt',
                pp(g['quota'], 0) if g['quota'] else '—', e(g['cout'], 1), pp(g['part_F'], 0), pp(g['proprio'], 0), pp(g['d15'], 0),
                pp(g['y1'], 0), pp(g['recoit'], 0), pp(g['pmax']), pp(g['ratio'], 0), e(g['dette30'], 0)]
    ent = ['Montant', 'Option', 'Durée', 'Taux', 'Quota (part d\'une génération)', 'Coût Md€', 'Par la foncière', 'Propriétaires', 'Héritage D1-D5',
           'Revenu D1', 'Reçoivent', 'Prix max', 'Ratio min', 'Dette an 30']
    md.append(f'{len(grille)} réglages (montant 30/40/50 k€ ; A, B\' parts à vie, C ; durée 25/30 ans ; taux bancaire, +0,5 ou +1 pt ; quota aucun, 15, 20 ou 25 % '
              'd\'une génération). Contraintes : test des 50 % tenu (ratio ≥ 50 % de l\'an 5 à 60), effet prix ≤ 5 % dans chaque secteur (central), coût ≤ 14,7 Md€ '
              f'(celui de D). Critère : part propriétaire de la moitié qui hérite le moins (D1-D5), puis coût. **{len(ok)} réglages passent** ; les dix premiers :\n')
    md.append(tab(ent, [lg(g) for g in ok[:10]]))
    sans_contrainte = sorted(grille, key=lambda g: -g['d15'])[:5]
    md.append('\nSans la contrainte de prix, les cinq réglages qui maximisent l\'accession (D1-D5) :\n')
    md.append(tab(ent, [lg(g) for g in sans_contrainte]))
    # frontière accession / prix : meilleur réglage de chaque option pour un plafond d'effet prix donné
    md.append('\nFrontière : part propriétaire (héritage D1-D5) du meilleur réglage de chaque option selon le plafond d\'effet prix accepté '
              '(test des 50 % et coût ≤ 14,7 Md€ tenus) :\n')
    lignes = []
    for alt in ('A', "B'pv", 'C'):
        cel = []
        for plaf in (0.04, 0.05, 0.06, 0.08, 1.0):
            c = [g for g in grille if g['alt'] == alt and g['ratio'] and g['ratio'] >= 0.5 and g['pmax'] <= plaf and g['cout'] <= 14.7]
            c.sort(key=lambda g: (-g['d15'], g['cout']))
            cel.append(f"{pp(c[0]['d15'], 0)} ({e(c[0]['G'] / 1000, 0)} k, {c[0]['duree']} ans, +{e(100 * c[0]['dt'], 1)} pt, quota {pp(c[0]['quota'], 0) if c[0]['quota'] else 'aucun'})" if c else '—')
        lignes.append([NOMS_OPT[alt].split('.')[0] + (' (parts à vie)' if alt == "B'pv" else '')] + cel)
    md.append(tab(['Option', 'Prix ≤ 4 %', '≤ 5 %', '≤ 6 %', '≤ 8 %', 'sans plafond'], lignes))
    best = ok[0] if ok else sans_contrainte[0]
    js['meilleur_grille'] = best
    # Réglage recommandé (choix argumenté de Claude, methode.md § 5) : foncière par défaut, mensualité bancaire (§ 28) sur 30 ans,
    # droit non utilisé à 35 ans converti pour moitié en parts à vie, entrées plafonnées à 20 % d'une génération en régime.
    best = dict(G=40000.0, alt="B'pv", duree=30, dt=0.0, quota=0.20)
    rr, bb = evaluer(best['alt'], 'central', T, S, her, G=best['G'], duree=30, quota=0.20)
    md.append('\n**Réglage recommandé** (methode.md § 5) : 40 000 € × e^(−H/80 000 €) par la foncière ; mensualité bancaire (3,32 %) sur 30 ans ; '
              'droit non utilisé à 35 ans converti pour moitié en parts à vie ; entrées plafonnées à 20 % d\'une génération. Par scénario de recours :\n')
    lignes = []
    for sc in ('bas', 'central', 'haut'):
        r, b = evaluer(best['alt'], sc, T, S, her, G=best['G'], duree=30, quota=0.20)
        lignes.append([sc, e(r['cout_md'], 1), pp(r['part_F'], 0), pp(r['proprio'], 0), pp(r['proprio_D15'], 0), pp(r['dec_y'][0]['proprio'], 0),
                       e(b['besoin10'], 0), e(b['dette10'], 0), e(b['dette30'], 0), pp(b['ratio_min'], 0)] + [pp(r['prix'][k]) for k in SECT])
    md.append(tab(['Recours', 'Coût Md€/an', 'Par la foncière', 'Propriétaires', 'Héritage D1-D5', 'Revenu D1', 'Besoin an 10', 'Dette an 10', 'Dette an 30',
                   'Ratio min'] + ['Prix ' + NS[k] for k in SECT], lignes))
    bh = O.bilan_fonciere(O.F.simuler(O.params_fonciere(rr, O.SCENARIOS['central'], 'haut'), q))
    md.append(f"\nSi la foncière emprunte à 4,7 % : ratio min {pp(bh['ratio_min'], 0)}, sous 50 % dès {bh['sous_50'] or 'jamais'} ; dette an 30 {e(bh['dette30'], 0)} Md€.")
    md.append(f"Bilan public du réglage recommandé (central) : aides au logement évitées {e(bb['aide30'], 2)} Md€ à l'an 30, {e(bb['aide60'], 2)} à l'an 60 ; "
              f"gestion {e(bb['gestion60'], 1)} Md€ à l'an 60 ; patrimoine net de la foncière {e(bb['net30'], 0)} Md€ à l'an 30, {e(bb['net60'], 0)} à l'an 60 "
              f"(+{e(bb['dnet60'], 1)} Md€ cette année-là) ; coût net à l'an 60 : {e(rr['cout_md'] + bb['gestion60'] - bb['aide60'] - bb['dnet60'], 1)} Md€.")
    js['recommande'] = dict(reglage=best, central=dict(cout=rr['cout_md'], part_F=rr['part_F'], proprio=rr['proprio'], prix=rr['prix'], fonciere=bb))

    # ---------------- 4. Transition ----------------
    md.append('\n## 4. Le démarrage : montée en charge, générations du lancement, injustice\n')
    reg = dict(G=best['G'], duree=best['duree'], taux=O.TAUX_BANQUE + best['dt'], quota=best['quota'])
    h = O.SCENARIOS['central']
    rb = O.agreger(O.reglage(best['alt'], **reg), h, her, S, q)
    nF = rb['part_F'] * h['cohorte']
    nF_age = {a: nF * w for a, w in rb['ages_F']}
    q_nb = 1 - rb['parts']['F_banque'] / rb['parts']['F'] if rb['parts']['F'] else 1.0
    capital_moyen_gen = R['D']['central'][0]['cout_md'] * 1e9 / h['cohorte'] * best['G'] / 40000.0   # E[G e^(−H/K)] sur une génération
    md.append(f"Réglage étudié : le réglage recommandé du § 3. En régime, "
              f"{e(nF / 1000, 0)} k jeunes entrent chaque année ({pp(rb['part_F'], 0)} d'une génération), dont {pp(q_nb, 0)} sans accès au crédit bancaire ; "
              f"apport moyen {e(rb['apport_moyen'], 0)} €. Capacité : bâtisseurs (3 000 par an) pendant 2 ans, puis montée linéaire jusqu'au régime "
              "(éventuellement avec une surcapacité de rattrapage). « Taux de droit réalisé » d'une génération = entrées à la foncière de cette génération / "
              "entrées d'une génération en régime (100 % = traitement égal à celui des générations suivantes).\n")
    designs = [
        ('Droit perdu à 36 ans, rampe 5 ans', dict(regle='expire'), 5, 0.0, None),
        ('Droit perdu à 36 ans, rampe 8 ans, +10 % de capacité', dict(regle='expire'), 8, 0.1, None),
        ('Droit perdu à 36 ans, rampe 10 ans', dict(regle='expire'), 10, 0.0, None),
        ('Droit perdu à 36 ans, rampe 8 ans, +10 %, premiers servis par date de demande', dict(regle='expire', ordre='fifo'), 8, 0.1, None),
        ('Droit perdu à 36 ans, rampe 8 ans, +30 %, par date de demande, non-servis en parts à vie', dict(regle='expire', ordre='fifo'), 8, 0.3, None),
        ('Entrantes seulement, rampe 8 ans, +10 % ; 26-35 ans au lancement : 50 % en parts à vie', dict(regle='entrantes'), 8, 0.1, 'comp'),
        ('Droit reporté jusqu\'à 45 ans, rampe 10 ans, +20 % de capacité', dict(regle='report'), 10, 0.2, None),
        ('Droit reporté jusqu\'à 45 ans, rampe 8 ans, +50 % de capacité', dict(regle='report'), 8, 0.5, None),
        ('Droit reporté jusqu\'à 40 ans, rampe 8 ans, +30 % de capacité', dict(regle='report', age_report=40), 8, 0.3, None),
        ('Générations entrantes seulement (25 ans ou moins au lancement), rampe 10 ans', dict(regle='entrantes'), 10, 0.0, None),
        ('Entrantes + 26-35 ans au lancement : 50 % du capital en parts à vie', dict(regle='entrantes'), 10, 0.0, 'comp'),
        ('Report jusqu\'à 40 ans + rattrapage des 36-40 ans, rampe 8 ans, +30 %', dict(regle='report', age_report=40, rattrapage=dict(age_max=40, fenetre=5)), 8, 0.3, None),
    ]
    GR = (('nés après', -30, -1), ('0-14 ans', 0, 14), ('15-24', 15, 24), ('25-29', 25, 29), ('30-35', 30, 35), ('36-40', 36, 40))
    lignes, js['transition'] = [], {}
    elast_prix = max(rb['prix'][k] for k in SECT)
    for nomd, kw, ans, surcap, comp in designs:
        cap = O.capacite_rampe(nF, ans, surcap, horizon=80)
        gens, chemin = O.transition(nF_age, q_nb, cap, **kw)
        cel = []
        for _, lo, hi in GR:
            sv = sum(gens[a]['servis'] for a in range(lo, hi + 1))
            at = sum(gens[a]['attente'] * gens[a]['servis'] for a in range(lo, hi + 1)) / sv if sv > 0 else 0.0
            cel.append(f"{pp(sv / nF / (hi - lo + 1), 0)} · {e(at, 1)} a")
        perdus = sum(g['perdus'] for g in gens.values())
        cout_comp = 0.0
        if comp == 'comp':
            # générations de 26 à 35 ans au lancement : 50 % du capital en parts à vie pour ceux qui n'entrent pas à la foncière
            cout_comp = sum(0.5 * (h['cohorte'] * capital_moyen_gen - gens[a0]['servis'] * rb['apport_moyen']) for a0 in range(26, 36)) / 1e9
        cout_ratt = sum(gens[a0]['servis'] for a0 in range(36, 41)) * rb['apport_moyen'] / 1e9
        filet = perdus * rb['apport_moyen'] * 0.5 / 1e9      # droits non servis convertis pour moitié en parts à vie
        pic = max(chemin) / nF
        fl = O.file_attente(nF_age, q_nb, cap, **kw)
        fin_file = next((t + 1 for t in range(ans, len(fl)) if fl[t] < 0.01 * nF), None)
        p = O.params_fonciere(rb, h)
        sim = O.simuler_chemin(p, q, [x * O.PAR_CONTRAT for x in chemin])
        bf = O.bilan_fonciere(sim)
        lignes.append([nomd] + cel + [e(perdus / 1000, 0) + ' k', e(filet, 1), e(cout_comp + cout_ratt, 1), e(pic, 2), str(fin_file or '> 80'),
                       pp(elast_prix * pic), e(bf['dette10'], 0), e(bf['dette30'], 0), pp(bf['ratio_min'], 0)])
        js['transition'][nomd] = dict(groupes=cel, chemin=chemin, perdus=perdus, cout_comp=cout_comp, cout_ratt=cout_ratt, fonciere=bf, fin_file=fin_file)
    md.append('Chaque cellule de génération : droit réalisé (entrées de la génération / entrées d\'une génération en régime) · attente moyenne en années. '
              'Générations repérées par leur âge au lancement.\n')
    md.append(tab(['Mise en place'] + [g[0] for g in GR] + ['Droits non servis', 'Parts à vie des non-servis, Md€',
                   'Coût ponctuel (compensation, rattrapage), Md€', 'Pic d\'entrées / régime', 'File résorbée (année)', 'Pic de l\'effet prix (secteur le plus touché)',
                   'Dette an 10', 'Dette an 30', 'Ratio min'], lignes))
    # trajectoire du réglage recommandé (dernier design jugé, voir methode.md)
    nomd = 'Entrantes seulement, rampe 8 ans, +10 % ; 26-35 ans au lancement : 50 % en parts à vie'
    ch = js['transition'][nomd]['chemin']
    md.append(f'\nTrajectoire « {nomd} » : entrées par an (milliers) : ' + ' ; '.join(f'an {t + 1} : {e(ch[t] / 1000, 0)}' for t in (0, 1, 2, 4, 6, 7, 9, 14, 19, 24)) + '.\n')
    # injustice entre secteurs : capital reçu par jeune et part propriétaire, réglage recommandé
    lignes = []
    for k in SECT:
        s = rb['secteurs'][k]
        kq = rb['k_quota']   # rationnement du quota, appliqué à proportion dans chaque secteur (quotas sectoriels proportionnels à la demande)
        verse = s['verse'] - s['verse_F'] * (1 - kq) * (1 - rb['o']['ratio'])
        lignes.append([NS[k], e(verse, 0), pp(s['F'] * kq, 0), pp(s['proprio'] - s['F'] * (1 - kq), 0), pp(R['sans']['central'][0]['secteurs'][k]['proprio'], 0)])
    md.append('Injustice entre secteurs, réglage recommandé, régime :\n')
    md.append(tab(['Secteur', 'Capital reçu par jeune (€)', 'Par la foncière', 'Propriétaires ou usufruitiers', 'Sans le dispositif'], lignes))
    with open(os.path.join(RACINE, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(md) + '\n')
    with open(os.path.join(RACINE, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(js, f, ensure_ascii=False, indent=1, default=str)
    print('resultats.md et donnees/resultats.json écrits ; meilleur réglage :', best)


if __name__ == '__main__':
    main()
