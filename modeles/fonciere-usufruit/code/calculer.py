#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Calcule les résultats de modeles/fonciere-usufruit/ et écrit resultats.md et donnees/resultats.json.
Usage : python3 -I modeles/fonciere-usufruit/code/calculer.py   (≈ 1 min). Lit donnees/ (table de mortalité, secteurs.csv) et écrit
resultats.md et donnees/resultats.json ; code/preparer_secteurs.py prépare secteurs.csv à partir des données brutes."""
import csv, json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import usufruit as U   # noqa: E402
import fonciere as F   # noqa: E402

SMIC_NET = 1477.93        # € par mois, 35 h, au 01/06/2026 (H-FU9)
TAUX_BANQUE = 0.032       # taux moyen d'un crédit immobilier (H-FU10)
TAUX_CONTRAT = 0.035      # taux de refinancement de la foncière, central (H-FU11)


def charger_table():
    with open(os.path.join(RACINE, 'donnees', 'table_mortalite_insee.csv'), encoding='utf-8') as f:
        lignes = [l for l in f if not l.startswith('"#') and not l.startswith('#')]
    return U.lire_table(list(csv.DictReader(lignes)))


def e(x, d=0):
    """Format français : espace fine pour les milliers, virgule décimale."""
    s = f'{x:,.{d}f}'.replace(',', ' ').replace('.', ',')
    return s


def pc(x, d=0):
    return e(100 * x, d) + ' %'


def tab(entetes, lignes):
    out = ['| ' + ' | '.join(entetes) + ' |', '|' + '---|' * len(entetes)]
    out += ['| ' + ' | '.join(str(c) for c in l) + ' |' for l in lignes]
    return '\n'.join(out)


def sections_v1(T):
    """Résultats de la v1 (09/11/2026, après-midi), régénérés à l'identique avec les réglages par défaut (marge nulle)."""
    q = T['ensemble']
    p0 = F.params('central')
    r_tarif = F.taux_tarif(p0)
    md, js = [], {}
    md.append('## v1 (09/11/2026, après-midi) : résultats d\'origine, sans marge\n')
    md.append('Conservés pour comparaison ; ils sont recalculés par le même code, avec les réglages de la v1 (redevance au coût de '
              'l\'argent, sans marge). Hypothèses H-FU1 à H-FU30. '
              f'Taux de tarification central de l\'usufruit : **{pc(r_tarif, 2)}** = taux d\'équilibre (1 + 3,5 %) / (1 + 2,5 %) − 1 '
              '+ 0,5 point de prudence (H-FU6, H-FU7).\n')

    # ---- 1. Valeur de l'usufruit ----
    md.append('### v1 · 1. Valeur de l\'usufruit selon l\'âge et le taux (part de la pleine propriété)\n')
    md.append('Contrat signé en 2027 ; mortalité Insee 2023-2025 (ensemble des deux sexes) avec une baisse des quotients de 1 % par an '
              '(H-FU4) ; espérance « du moment » = table sans amélioration.\n')
    taux_l = [0.01, r_tarif, 0.02, 0.03, 0.04]
    lignes, js['usufruit'] = [], {}
    for age in (25, 30, 35, 40, 45, 55, 65, 75, 85):
        s = U.survies(q, age, 2027, 0.01)
        s0 = U.survies(q, age, 2024, 0.0)
        vals = [U.valeur_usufruit(s, r) for r in taux_l]
        js['usufruit'][age] = vals
        lignes.append([age, e(U.esperance(s0), 1), e(U.esperance(s), 1)] + [pc(v) for v in vals] +
                      [pc(U.bareme_fiscal(age)), pc(U.valeur_usufruit_deterministe(U.esperance(s0), 0.03))])
    md.append(tab(['Âge', 'Espérance du moment (ans)', 'Espérance avec amélioration', 'à 1 %', f'à {pc(r_tarif, 2)} (tarif)', 'à 2 %',
                   'à 3 %', 'à 4 %', 'Barème CGI 669', 'Esquisse (3 %, déterministe)'], lignes))
    md.append('\n**Lecture.** Le barème fiscal est proche d\'un calcul à 3 % pour les jeunes, mais il surévalue l\'usufruit des personnes âgées '
              '(75 ans : 30 % au barème contre 25 % à 2 %). Au taux d\'équilibre de la foncière (≈ 1,5 %), l\'usufruit d\'une personne de 25 ans '
              'ne vaut qu\'environ 60 % du bien : le prix d\'entrée dépend d\'abord du taux choisi, bien plus que de la table de mortalité.\n')

    # ---- 2. Cas types ----
    md.append('### v1 · 2. Cas types : redevance mensuelle, durée, coût total\n')
    md.append(f'Taux du contrat {pc(TAUX_CONTRAT, 1)} fixe (refinancement de la foncière répercuté sans marge), durée 25 ans ; '
              f'usufruit tarifé à {pc(r_tarif, 2)}. Comparaison : achat en pleine propriété à {pc(TAUX_BANQUE, 1)} sur 25 ans (si une banque prête). '
              f'Smic net : {e(SMIC_NET, 2)} €/mois (H-FU9). Le coût total exclut charges, entretien et taxe foncière, payés dans les deux cas.\n')
    cas = [
        ('25 ans, seul, au Smic, T2 à 150 000 €', 150000, U.survies(q, 25, 2027, 0.01), SMIC_NET, (0, 40000), 25, 100),
        ('Couple au Smic, deux enfants (32 et 32 ans, droit réversible), T4 à 250 000 €', 250000,
         U.survies_couple(T['femmes'], 32, T['hommes'], 32, 2027, 0.01), 2 * SMIC_NET, (0, 80000), 25, 250),
        ('40 ans, seul, logement à 230 000 €', 230000, U.survies(q, 40, 2027, 0.01), None, (0,), 25, 0),
        ('55 ans, seul, logement à 230 000 €', 230000, U.survies(q, 55, 2027, 0.01), None, (0,), 20, 0),
    ]
    lignes, js['cas'] = [], []
    for nom, prix, s, revenu, apports, duree, aide in cas:
        for ap in apports:
            c = U.contrat(prix, s, r_tarif, TAUX_CONTRAT, duree, ap)
            c3 = U.contrat(prix, s, 0.03, TAUX_CONTRAT, duree, ap)
            m_achat = U.mensualite(prix - ap, TAUX_BANQUE, 25)
            effort = pc(c['mensualite'] / revenu) if revenu else '—'
            aide_ev = U.aide_eteinte(aide, s, duree)
            ligne = [nom + (f', apport {e(ap)} €' if ap else ', sans apport'), pc(c['part_usufruit']), e(c['finance']),
                     e(c['mensualite']), f"{c['duree']} ans", e(c['total_paye']), effort, e(c3['mensualite']),
                     e(m_achat), e(m_achat * 300 + ap), e(U.esperance(s), 1), e(aide_ev) if aide else '—']
            lignes.append(ligne)
            js['cas'].append({'cas': nom, 'apport': ap, **c, 'mensualite_tarif_3pc': c3['mensualite'], 'mensualite_achat': m_achat,
                              'aide_eteinte': aide_ev})
    md.append(tab(['Cas', 'Part usufruit', 'Financé (€)', 'Redevance (€/mois)', 'Durée', 'Coût total (€)', 'Taux d\'effort',
                   'Redevance si tarif 3 %', 'Achat classique (€/mois)', 'Coût total achat (€)', 'Durée d\'occupation espérée (ans)',
                   'Aide au logement évitée ensuite (€, espérance)'], lignes))
    md.append('\n**Lecture.** (1) Au tarif d\'équilibre, la redevance d\'un jeune au Smic sans apport est inférieure d\'environ 38 % à un achat classique '
              '(que la banque lui refuserait : près de la moitié de son revenu). Elle atteint 30 % de son revenu, la limite de la règle. (2) Avec le capital de '
              'départ en apport, le taux d\'effort tombe à 17 %. (3) Le couple au Smic avec deux enfants paie 26 % de ses deux salaires sans apport pour un T4 '
              'à 250 000 €, 12 % avec ses deux apports. (4) À 55 ans, la redevance est moins de la moitié d\'un achat. (5) Si la foncière tarife à 3 % '
              '(marge implicite, voir § 5), les redevances montent d\'environ 40 % sans apport, de 70 à 85 % avec apport. La dernière colonne : aide au logement que l\'État cesse de verser après la '
              'redevance (H-FU14 ; montants d\'aide supposés de 100 € et 250 € par mois ⚠️).\n')
    # capacité
    cap = U.capital_empruntable(0.33 * SMIC_NET, TAUX_CONTRAT, 25)
    s25 = U.survies(q, 25, 2027, 0.01)
    part25 = U.valeur_usufruit(s25, r_tarif)
    md.append(f'**Ce qu\'un jeune au Smic peut payer** (règle d\'un tiers du revenu, § 14) : {e(0.33 * SMIC_NET)} €/mois, soit {e(cap)} € d\'usufruit '
              f'sur 25 ans ; avec 40 000 € d\'apport, {e(cap + 40000)} €. Un usufruit à {pc(part25)} correspond à un logement de '
              f'**{e(cap / part25)} €** sans apport et **{e((cap + 40000) / part25)} €** avec apport.\n')

    # ---- 3. Taux répercuté ----
    md.append('### v1 · 3. Taux répercuté : fixe, variable plafonné, allongement de durée\n')
    c25 = U.contrat(150000, s25, r_tarif, TAUX_CONTRAT, 25, 0)
    md.append(f'Cas du jeune de 25 ans sans apport ({e(c25["finance"])} € financés). Choc : le taux de refinancement passe de 3,5 % à 5,5 % '
              'à partir de la 6e année et y reste (H-FU12).\n')
    chemin = [0.035] * 5 + [0.055] * 40
    lignes, js['taux'] = [], {}
    for nom, mode, plaf in (('Fixe (la foncière porte le risque)', 'fixe', None), ('Variable sans plafond', 'variable', None),
                            ('Variable plafonné à +1 point', 'variable', 0.01), ('Allongement de durée (plafond 35 ans)', 'allongement', None)):
        r = U.echeancier(c25['finance'], chemin, 25, mode, plaf, 35)
        js['taux'][nom] = r
        lignes.append([nom, e(r['mensualites'][0]), e(r['mensualite_max']), e(r['duree'], 1) + ' ans', e(r['total'])])
    md.append(tab(['Option', 'Redevance initiale (€/mois)', 'Redevance maximale', 'Durée', 'Total payé (€)'], lignes))
    md.append('\n**Lecture.** Sans plafond, un choc de 2 points ajoute environ 20 % à la redevance d\'un ménage au Smic. '
              'L\'allongement garde la mensualité, mais coûte davantage au total. Avec un plafond, la différence est portée par la foncière, '
              'donc par l\'État ; c\'est un coût d\'option à provisionner (non tarifé ici ⚠️).\n')

    # ---- 4. Foncière : montée en charge ----
    md.append('### v1 · 4. La foncière sur 60 ans selon la montée en charge (scénario central)\n')
    md.append('Primo-accessions : 320 000 par an (H-FU15) ; montée linéaire sur 10 ans ; prix moyen 220 000 € en 2026, +2,5 % par an ; '
              'refinancement à 3,5 % variable, contrats à taux fixe ; 5 000 viagers rachetés et 0,5 Md€ de dations par an. '
              'Dette publique : « hors APU » = seuls les flux de l\'État (gestion, dation, dotation, moins l\'aide au logement évitée) ; '
              '« dans APU » = plus la dette de la foncière.\n')
    js['montee'] = {}
    for part in (0.10, 0.30, 0.60):
        res = F.simuler(F.params('central', part_cible=part), q)
        js['montee'][part] = res
        lignes = []
        for an, r in F.resume(res).items():
            lignes.append([f'{an} ({r["annee"]})', e(r['entrants'] / 1000) + ' k', e(r['achats'] / 1000) + ' k', e(r['acquisitions_md'], 1),
                           e(r['besoin_md'], 1), e(r['redevances_md'], 1), e(r['dette_md']), pc(r['dette_pib'], 1), e(r['net_md']),
                           pc(r['ratio_marchand']), pc(r['dette_publique_hors_apu_pib'], 1), pc(r['dette_publique_dans_apu_pib'], 1),
                           e(r['parc'] / 1e6, 2) + ' M'])
        md.append(f'#### Part cible : {pc(part)} des primo-accédants\n')
        md.append(tab(['Année', 'Entrants', 'Achats', 'Acquisitions (Md€)', 'Besoin de financement net (Md€)', 'Redevances (Md€)',
                       'Dette foncière (Md€)', 'Dette / PIB', 'Patrimoine net (Md€)', 'Recettes / coûts', 'Effet dette publique hors APU',
                       'Effet dette publique dans APU', 'Parc'], lignes))
        md.append('')
    md.append('**Lecture.** (1) Le besoin de financement net est d\'environ 8 à 11, 24 à 35 et 46 à 72 Md€ de 2026 par an (10 %, 30 %, 60 %), à comparer aux 41,6 Md€ de prêts '
              'nouveaux du fonds d\'épargne en 2025 et aux ≈ 160 Md€ d\'épargne centralisée non prêtée (406,5 − 244,9 ; ⚠️ la liquidité requise '
              'n\'est pas déduite). (2) La dette de la foncière ne cesse pas de croître sur 60 ans : la nue-propriété est portée à crédit pendant '
              'des décennies, et les intérêts s\'accumulent plus vite que les logements ne reviennent. (3) Le patrimoine net reste proche de zéro : '
              'c\'est le but d\'une tarification à l\'équilibre, sans marge. (4) Les recettes courantes (intérêts des redevances) couvrent 15 à 40 % '
              'des coûts (intérêts payés, gestion, impayés), et la part baisse avec le temps : **sous le seuil de 50 %**, la foncière serait classée dans les '
              'administrations publiques, sauf si la comptabilité nationale traitait l\'usufruit vendu comme un loyer payé d\'avance (lecture possible, '
              'non tranchée ⚠️ ; voir methode.md § 5).\n')

    # ---- 5. Scénarios et risques ----
    md.append('### v1 · 5. Scénarios et risques (part cible 30 %)\n')
    variantes = [
        ('Bas (favorable)', F.params('bas')),
        ('Central', F.params('central')),
        ('Haut (défavorable)', F.params('haut')),
        ('Longévité : quotients −2 %/an au lieu de −1 %', F.params('central', amel_reel=0.02)),
        ('Taux : +2 points dès l\'an 6, contrats fixes', F.params('central', choc_taux=0.02)),
        ('Taux : +2 points dès l\'an 6, contrats variables', F.params('central', choc_taux=0.02, contrats='variable')),
        ('Prix : +1,5 %/an au lieu de 2,5 %', F.params('central', g=0.015)),
        ('Tarification à 3 % (marge implicite)', F.params('central', prudence=0.03 - F.taux_equilibre(0.035, 0.025))),
        ('Nue-propriété en fonds propres de l\'État', F.params('central', fonds_propres_np=True)),
        ('Sans viager ni dation', F.params('central', viagers_par_an=0.0, dation_md=0.0)),
    ]
    lignes, js['scenarios'] = [], {}
    for nom, p in variantes:
        res = F.simuler(p, q)
        js['scenarios'][nom] = F.resume(res)
        r30, r60 = res[29], res[59]
        ratio3 = F.max_ratio_sur_3_ans(res)
        lignes.append([nom, e(r30['besoin_md'], 1), e(r30['dette_md']), e(r60['dette_md']), pc(r60['dette_pib'], 1), e(r30['net_md']),
                       e(r60['net_md']), pc(min(ratio3[2:])), pc(max(ratio3[2:])), pc(r60['dette_publique_hors_apu_pib'], 1),
                       pc(r60['dette_publique_dans_apu_pib'], 1)])
    md.append(tab(['Variante', 'Besoin an 30 (Md€)', 'Dette an 30 (Md€)', 'Dette an 60 (Md€)', 'Dette / PIB an 60', 'Patrimoine net an 30',
                   'Patrimoine net an 60', 'Recettes / coûts, min (3 ans)', 'max', 'Dette publique an 60, hors APU',
                   'dans APU'], lignes))
    md.append('\n**Lecture.** (1) Le risque de **taux** domine : 2 points de plus dès la 6e année creusent un trou d\'environ 800 Md€ de 2026 '
              'à 60 ans, que les contrats soient fixes ou variables, parce que la nue-propriété (40 à 60 % de la valeur) est portée à crédit pendant '
              'des décennies, sans redevance en face. Les contrats variables ne reportent sur les ménages que la part usufruit. (2) Le risque de **prix** '
              'est de même nature : si les logements prennent 1 point de moins par an que prévu, le bien rendu au décès ne rembourse plus son portage '
              '(−170 Md€ à 60 ans). (3) Le risque '
              'de **longévité collective** pèse moins (les logements reviennent plus tard, la foncière porte plus longtemps). (4) Une tarification '
              'à 3 % dégage une marge, mais renchérit les redevances (§ 2). (5) En fonds propres, le ratio dépasse 50 %, mais la dette publique '
              'porte alors la nue-propriété : on ne fait que déplacer la dette. (6) Une tarification à 3 % ne passe le seuil de 50 % '
              'que pendant une vingtaine d\'années : le portage de la nue-propriété finit toujours par l\'emporter.\n')

    # ---- 6. Effet sur les prix ----
    md.append('### v1 · 6. Effet possible sur les prix : une borne, pas un modèle\n')
    md.append('Effet de niveau ≈ (demande additionnelle / transactions annuelles) / (élasticité de l\'offre + élasticité de la demande au prix) ; '
              'demande additionnelle = part des entrants qui n\'auraient pas acheté sans la foncière (H-FU28).\n')
    lignes = []
    for part in (0.10, 0.30, 0.60):
        vals = []
        for sc in ('bas', 'central', 'haut'):
            p = F.params(sc, part_cible=part)
            vals.append(pc(F.simuler(dict(p, horizon=11), q)[10]['effet_prix'], 1))
        lignes.append([pc(part)] + vals)
    md.append(tab(['Part cible', 'Bas (30 % additionnels, élasticité 4)', 'Central (50 %, 2)', 'Haut (70 %, 1)'], lignes))
    md.append('\n**Lecture.** Une hausse ponctuelle du niveau des prix de l\'ordre de 1 à 4 % au central, jusqu\'à 12 % à 60 % de part '
              'cible dans le cas haut ; davantage dans les villes où l\'offre ne suit pas. Le capital de départ en apport et le taux public '
              'ajoutent un effet de solvabilisation non chiffré ici. Ces chiffres sont une **borne d\'ordre de grandeur**, pas une prévision.\n')

    return md, js


# =================================================================================================================
# v2 (09/11/2026, soir). Scénario principal (décisions de l'auteur du 09/11/2026) : le capital de départ devient un
# droit d'apport à la foncière, utilisable de 25 à 35 ans ; usufruit forfaitaire = 70 % de la transaction (bien + travaux),
# quel que soit l'âge ; financé au taux des banques sur 25 ans. Comparaisons : mensualité bancaire ; marge de 0 à 2 points.
# Hypothèses H-FU31 à H-FU52 (methode.md, § 6).
# =================================================================================================================

I_REF = 0.035             # coût de l'argent de la foncière, central (H-FU11)
TAUX_BANQUE_V2 = 0.0332   # taux moyen des crédits nouveaux à l'habitat, septembre 2026, Banque de France (H-FU46)
FORFAIT = 0.70            # H-FU48
MARGES = (0.0, 0.005, 0.01, 0.015, 0.02)   # H-FU31
APPORT = 40000.0          # capital de départ maximal (H-FU20)
ENTRETIEN = 0.0075        # charges et entretien d'un propriétaire, part de la valeur par an (H-FU39)
TRAVAUX_M2 = 500.0        # rénovation d'une passoire, € par m² (H-FU49)
CIBLE = 400.0             # mensualité jugée raisonnable par l'auteur (H-FU35)
GENERATION = 830000.0     # jeunes par génération (central de modeles/capital-de-depart, H-FU50)
PARTS_GEN = (0.30, 0.50, 0.70)
AGES_PRINC = ((25, 0.40), (30, 0.40), (35, 0.20))   # H-FU51
APPORT_MOYEN = {'bas': 40000.0, 'central': 26000.0, 'haut': 15000.0}   # H-FU50
NOMS = {'paris': 'Paris', 'metropoles': 'Grandes métropoles', 'villes_moyennes': 'Villes moyennes', 'rural': 'Petites villes et rural'}
ELASTICITES = {'paris': 1.0, 'metropoles': 1.5, 'villes_moyennes': 2.5, 'rural': 4.0}   # central (H-FU40)
DEMANDE = {'bas': (0.03, 0.01), 'central': (0.08, 0.03), 'haut': (0.15, 0.05)}       # (refusés, adhérents), H-FU47


def p_principal(sc='central', part_gen=0.50, **kw):
    """Paramètres du scénario principal : une part `part_gen` de chaque génération entre à 25, 30 ou 35 ans et apporte
    son capital de départ ; usufruit forfaitaire, taux bancaire."""
    d = dict(redevance='forfait', forfait=FORFAIT, taux_banque=TAUX_BANQUE_V2, primo_par_an=GENERATION, part_cible=part_gen,
             ages=AGES_PRINC, ages_apport=(25, 30, 35), part_apport=1.0, apport=APPORT_MOYEN[sc])
    d.update(kw)
    return F.params(sc, **d)


def charger_secteurs():
    with open(os.path.join(RACINE, 'donnees', 'secteurs.csv'), encoding='utf-8') as f:
        lignes = [l for l in f if not l.startswith('#')]
    return {r['secteur']: {k: (v if k == 'secteur' else float(v)) for k, v in r.items()} for r in csv.DictReader(lignes)}


def cas_principaux(T, s):
    """Cas types du scénario principal (H-FU36) : (clé, libellé, prix, surface, survie, revenu, apport, loyer mensuel)."""
    q = T['ensemble']
    loyer_t4 = (s['loyer_m2_app3'] + s['loyer_m2_mai']) / 2 * s['surf_T4']
    return [
        ('jeune', 'Jeune de 25 ans au Smic, T2, capital de départ 40 000 €', s['prix_T2'], s['surf_T2'], U.survies(q, 25, 2027, 0.01),
         SMIC_NET, APPORT, s['loyer_m2_app12'] * s['surf_T2']),
        ('couple', 'Couple de 30 ans au Smic, deux enfants, T4, deux capitaux (80 000 €)', s['prix_T4'], s['surf_T4'],
         U.survies_couple(T['femmes'], 30, T['hommes'], 30, 2027, 0.01), 2 * SMIC_NET, 2 * APPORT, loyer_t4),
        ('a35', '35 ans, seul, T3, capital réduit (20 000 €)', s['prix_T3'], s['surf_T3'], U.survies(q, 35, 2027, 0.01), None, 20000.0,
         s['loyer_m2_app3'] * s['surf_T3']),
    ]


def evaluer_principal(prix, surface, surv, revenu, apport, loyer, r_tarif, travaux=False):
    """Un cas type du scénario principal. Avec travaux : passoire achetée 10 % sous le prix et rénovée (H-FU22, H-FU49)."""
    tx = prix * 0.9 + TRAVAUX_M2 * surface if travaux else prix
    usu = FORFAIT * tx
    fin = max(0.0, usu - apport)
    m = U.mensualite(fin, TAUX_BANQUE_V2, 25)
    act = U.valeur_usufruit(surv, r_tarif)
    contrib = U.contribution_rp(tx) / 12
    return {'transaction': tx, 'usufruit': usu, 'finance': fin, 'mensualite': m, 'part_actuarielle': act,
            'marge_eur': (FORFAIT - act) * tx, 'marge_pts': FORFAIT - act, 'contribution': contrib,
            'effort': (m + contrib) / revenu if revenu else None, 'loyer': loyer,
            'cout_loyer': (m + contrib + ENTRETIEN * tx / 12) / loyer,
            'achat_bancaire': U.mensualite(max(0.0, tx - apport), TAUX_BANQUE_V2, 25)}


def cas_comparaison(T, s):
    """Cas types de la comparaison (marges, mensualité bancaire) : ceux de la première version de la v2, âges 25 à 55."""
    q = T['ensemble']
    loyer_t4 = (s['loyer_m2_app3'] + s['loyer_m2_mai']) / 2 * s['surf_T4']
    return [
        ('jeune', 'Jeune de 25 ans au Smic, T2, apport 40 000 €', s['prix_T2'], U.survies(q, 25, 2027, 0.01), SMIC_NET, APPORT, 25,
         s['loyer_m2_app12'] * s['surf_T2']),
        ('couple', 'Couple au Smic, deux enfants (32 ans), T4, sans apport', s['prix_T4'],
         U.survies_couple(T['femmes'], 32, T['hommes'], 32, 2027, 0.01), 2 * SMIC_NET, 0.0, 25, loyer_t4),
        ('a40', '40 ans, seul, T3, sans apport', s['prix_T3'], U.survies(q, 40, 2027, 0.01), None, 0.0, 25, s['loyer_m2_app3'] * s['surf_T3']),
        ('a55', '55 ans, seul, T3, sans apport (20 ans)', s['prix_T3'], U.survies(q, 55, 2027, 0.01), None, 0.0, 20,
         s['loyer_m2_app3'] * s['surf_T3']),
    ]


def evaluer_cas(prix, surv, revenu, apport, duree, loyer, r_tarif):
    """Mensualités d'un cas type : usufruit actuariel à marge 0 à 2 points, et mensualité bancaire (marge implicite)."""
    part = U.valeur_usufruit(surv, r_tarif)
    fin = max(0.0, part * prix - apport)
    contrib = U.contribution_rp(prix) / 12
    entretien = ENTRETIEN * prix / 12
    m_marges = {m: U.mensualite(fin, I_REF + m, duree) for m in MARGES}
    m_banque = U.mensualite(max(0.0, prix - apport), TAUX_BANQUE_V2, duree)
    t_impl = U.taux_pour_mensualite(fin, m_banque, duree, haut=3.0) if fin > 0 else None
    return {'part': part, 'finance': fin, 'contribution': contrib, 'm_marges': m_marges, 'm_banque': m_banque,
            'marge_implicite': (t_impl - I_REF) if t_impl is not None else None, 'loyer': loyer, 'revenu': revenu,
            'effort_banque': (m_banque + contrib) / revenu if revenu else None,
            'cout_loyer_banque': (m_banque + contrib + entretien) / loyer,
            'cout_loyer_marges': {m: (v + contrib + entretien) / loyer for m, v in m_marges.items()}}


def sous_50(res):
    rr = F.max_ratio_sur_3_ans(res)
    return next((res[k]['annee'] for k in range(4, len(rr)) if rr[k] < 0.5), None)   # à partir de la 5e année (H-FU34)


def sections_v2(T):
    q = T['ensemble']
    sp = U.survies_couple(T['femmes'], 55, T['hommes'], 55, 2027, 0.01)   # parents de 55 ans, second décès (H-FU41)
    S = charger_secteurs()
    r_tarif = F.taux_tarif(F.params('central'))
    md, js = [], {'secteurs': S}
    pt = (lambda x: e(100 * x, 1) + ' pt')

    md.append('## v2 (09/11/2026, soir) : capital de départ en apport, usufruit forfaitaire, marge de la foncière\n')
    md.append('**Scénario principal** (décisions de l\'auteur du 09/11/2026) : le capital de départ (jusqu\'à 40 000 €, dégressif avec '
              'l\'héritage) n\'est plus versé en argent ; c\'est **un droit d\'apport à la foncière, utilisable de 25 à 35 ans** ; l\'usufruit est '
              f'vendu **{pc(FORFAIT)} de la valeur totale de la transaction, travaux de rénovation compris, quel que soit l\'âge** ; le reste est '
              f'financé sur 25 ans **au taux des banques** ({pc(TAUX_BANQUE_V2, 2)}, Banque de France, septembre 2026) ; l\'occupant paie la '
              'contribution sur la résidence principale (0,25 % de la valeur) dès l\'accession, **au budget public**, comme tout propriétaire ; '
              'pas de redevance à vie. La marge de la foncière est l\'écart entre 70 % et la valeur actuarielle de l\'usufruit. '
              '**Comparaisons** : mensualité égale à celle d\'un prêt bancaire ; usufruit actuariel et marge de 0 à 2 points au-dessus du '
              f'coût de l\'argent ({pc(I_REF, 1)}). Hypothèses H-FU31 à H-FU52 (`methode.md`, § 6). Euros de 2026.\n')

    # ---- A. Prix et loyers ----
    md.append('### A. Prix et loyers par secteur (données publiques)\n')
    md.append('Prix : médianes des ventes d\'un seul logement en 2024 (DVF, DGFiP/Etalab, cote A). Loyers : Carte des loyers 2025 (DHUP, cote A ; '
              'loyers d\'annonce charges comprises, prédits par commune), médiane des communes pondérée par les ventes. Secteurs : aires '
              'd\'attraction des villes 2020 (Insee, cote A ; H-FU38). Script : `code/preparer_secteurs.py`.\n')
    lignes = []
    for k, s in S.items():
        lignes.append([NOMS[k], e(s['ventes']), pc(s['part_ventes']), e(s['prix_m2_app']), e(s['prix_m2_mai']), e(s['prix_T2']), e(s['prix_T3']),
                       e(s['prix_T4']), e(s['prix_moyen_tous']), e(s['loyer_m2_app12'], 1), e(s['loyer_m2_app3'], 1), e(s['loyer_m2_mai'], 1)])
    md.append(tab(['Secteur', 'Ventes 2024', 'Part', 'Prix/m² appart.', 'Prix/m² maison', 'T2 (médiane)', 'T3', 'T4', 'Prix moyen',
                   'Loyer/m² T1-T2', 'Loyer/m² T3+', 'Loyer/m² maison'], lignes))
    moy = sum(s['prix_moyen_tous'] * s['part_ventes'] for s in S.values())
    md.append(f'\n**Lecture.** Prix moyen d\'un logement vendu en 2024 : {e(moy)} € (H-FU18 retenait 220 000 €). Un T2 médian vaut '
              f'{e(S["villes_moyennes"]["prix_T2"])} € en ville moyenne et {e(S["paris"]["prix_T2"])} € à Paris. Les appartements du rural '
              'sont plus chers au m² que ceux des villes moyennes (stations, littoral) ; les maisons y sont bon marché.\n')

    # ---- B. Cas types, scénario principal ----
    md.append('### B. Scénario principal : mensualités des cas types, par secteur\n')
    md.append(f'Usufruit = {pc(FORFAIT)} de la transaction ; financé = usufruit − capital de départ ; {pc(TAUX_BANQUE_V2, 2)} sur 25 ans. '
              f'« Avec travaux » : le même logement acheté comme passoire 10 % sous le prix et rénové pour {e(TRAVAUX_M2)} € par m² (H-FU49). '
              f'Marge de la foncière = ({pc(FORFAIT)} − usufruit actuariel au taux de tarification {pc(r_tarif, 2)}) × transaction. Effort = '
              '(mensualité + contribution) / revenu net. Coût d\'occupation = mensualité + contribution + charges et entretien (0,75 % de la '
              'valeur par an, H-FU39), comparé au loyer de marché du même logement. Achat bancaire : pleine propriété, même apport, même taux.\n')
    lignes, js['principal_cas'] = [], {}
    for k, s in S.items():
        for cle, nom, prix, surf, surv, rev, ap, loyer in cas_principaux(T, s):
            c = evaluer_principal(prix, surf, surv, rev, ap, loyer, r_tarif)
            ct = evaluer_principal(prix, surf, surv, rev, ap, loyer, r_tarif, travaux=True)
            js['principal_cas'][f'{k}/{cle}'] = {'sans_travaux': c, 'avec_travaux': ct}
            lignes.append([NOMS[k], nom, e(prix), e(c['mensualite']), e(ct['transaction']), e(ct['mensualite']), e(c['contribution']),
                           pc(c['effort']) if rev else '—', e(c['achat_bancaire']), e(c['loyer']), e(c['cout_loyer'], 2),
                           f"{e(c['marge_eur'])} € ({pt(c['marge_pts'])})"])
    md.append(tab(['Secteur', 'Cas', 'Prix (€)', 'Mensualité (€/mois)', 'Avec travaux : transaction (€)', 'Avec travaux : mensualité',
                   'Contribution (€/mois)', 'Effort', 'Achat bancaire (€/mois)', 'Loyer de marché', 'Coût d\'occupation / loyer',
                   'Marge de la foncière'], lignes))
    jp = js['principal_cas']
    vm = jp['villes_moyennes/jeune']['sans_travaux']
    md.append(f'\n**Lecture.** (1) En ville moyenne, le jeune au Smic paie {e(vm["mensualite"])} € par mois pour un T2 médian '
              f'({e(jp["villes_moyennes/jeune"]["avec_travaux"]["mensualite"])} € s\'il le rénove), contre {e(vm["achat_bancaire"])} € pour un achat '
              f'bancaire ; son effort est de {pc(vm["effort"])} et son coût d\'occupation vaut {e(vm["cout_loyer"], 2)} fois le loyer du marché : '
              f'le dispositif est **nettement moins cher que louer** hors de Paris ; à Paris, {e(jp["paris/jeune"]["sans_travaux"]["mensualite"])} € '
              f'par mois ({pc(jp["paris/jeune"]["sans_travaux"]["effort"])} du Smic). (2) La marge de la foncière est de '
              f'{pt(jp["villes_moyennes/jeune"]["sans_travaux"]["marge_pts"])} de la valeur à 25 ans et de '
              f'{pt(jp["villes_moyennes/a35"]["sans_travaux"]["marge_pts"])} à 35 ans. (3) Les 400 € visés par l\'auteur correspondent, en ville moyenne, '
              'à un T3 ou à un T2 rénové, pas à un T2 médian.\n')

    # ---- C. Effet de l'âge ----
    md.append('### C. L\'effet de l\'âge : pourquoi l\'accès s\'arrête à 35 ans\n')
    lignes, js['age'] = [], {}
    for age in (20, 25, 30, 35, 40, 45, 55, 65):
        s_ = U.survies(q, age, 2027, 0.01)
        a1, a2 = U.valeur_usufruit(s_, r_tarif), U.valeur_usufruit(s_, 0.02)
        js['age'][age] = (a1, a2)
        lignes.append([age, pc(a1), pc(a2), pc(FORFAIT), pc(FORFAIT / a1 - 1), 'oui' if 25 <= age <= 35 else 'non'])
    md.append(tab(['Âge à l\'entrée', f'Usufruit actuariel ({pc(r_tarif, 2)})', 'à 2 %', 'Forfait', 'Surcoût du forfait', 'Dans la borne 25-35 ans'], lignes))
    md.append(f'\n**Lecture.** Le forfait de 70 % est proche de la valeur d\'un usufruit à 25 ans calculée à 2 %, mais il fait payer à un '
              f'accédant de 35 ans {pc(FORFAIT / js["age"][35][0] - 1)} de plus que la valeur actuarielle (au taux de tarification), à 45 ans '
              f'{pc(FORFAIT / js["age"][45][0] - 1)}, à 55 ans {pc(FORFAIT / js["age"][55][0] - 1)} : au-delà de 35 ans, le forfait devient une injustice '
              'visible. **Borne retenue : de 25 à 35 ans**, parce que le droit est adossé au capital de départ (versé à partir de 25 ans), que la '
              'surfacturation reste sous environ 30 % jusqu\'à 35 ans, et que l\'âge moyen du premier achat est de 39 ans (enquête Logement 2013) : '
              'on vise ceux qui achèteraient sinon tard ou jamais. Entrer à 20 ans (§ 15 de l\'esquisse) supposerait de débloquer le capital avant 25 ans.\n')

    # ---- D. La foncière, scénario principal ----
    md.append('### D. La foncière en scénario principal : autofinancement, test des 50 %, dette\n')
    md.append(f'Une part de chaque génération ({e(GENERATION)} jeunes, H-FU50) entre à 25, 30 ou 35 ans (40 / 40 / 20 %) et apporte son capital '
              f'de départ (moyenne {e(APPORT_MOYEN["central"])} € au central, H-FU50) ; montée sur 10 ans ; prix moyen 220 000 € de 2026 ; 20 % de '
              'passoires rénovées ; le reste comme la v1 (H-FU19 à H-FU30). Ratio = intérêts reçus / (intérêts payés + gestion + impayés), '
              'moyenne sur 3 ans, apprécié à partir de la 5e année (démarrage exclu, H-FU34).\n')
    js['principal'] = {}
    for part in PARTS_GEN:
        res = F.simuler(p_principal('central', part), q)
        js['principal'][part] = res      # séries complètes en mémoire ; résumées dans le JSON (voir main)
        lignes = []
        for an, r in F.resume(res).items():
            lignes.append([f'{an} ({r["annee"]})', e(r['entrants'] / 1000) + ' k', e(r['acquisitions_md'], 1), e(r['besoin_md'], 1),
                           e(r['redevances_md'], 1), e(r['dette_md']), pc(r['dette_pib'], 1), e(r['net_md']), pc(r['ratio_marchand']),
                           pc(r['dette_publique_hors_apu_pib'], 1)])
        md.append(f'#### {pc(part)} d\'une génération utilise son capital de départ comme apport\n')
        md.append(tab(['Année', 'Entrants', 'Acquisitions (Md€)', 'Besoin de financement (Md€)', 'Mensualités reçues (Md€)', 'Dette foncière (Md€)',
                       'Dette / PIB', 'Patrimoine net (Md€)', 'Recettes / coûts', 'Effet sur la dette publique si hors APU'], lignes))
        md.append('')
    md.append('#### Scénarios, risques et leviers (50 % d\'une génération)\n')
    variantes = [
        ('Central', p_principal('central')),
        ('Bas (favorable)', p_principal('bas')),
        ('Haut (défavorable : la foncière paie 4,7 %)', p_principal('haut')),
        ('Taux du contrat = taux bancaire + 1 point', p_principal(marge=0.01)),
        ('Taux du contrat = taux bancaire + 2 points', p_principal(marge=0.02)),
        ('Forfait 80 % au lieu de 70 %', p_principal(forfait=0.80)),
        ('Livret foncier : 300 Md€ à 2 %', p_principal(livret_max_md=300.0)),
        ('Prêt familial : 25 % des entrants', p_principal(part_pret_familial=0.25)),
        ('Écart de 0,5 point (emprunt hors APU)', p_principal(spread=0.005)),
        ('Taux : +2 points dès l\'an 6, contrats fixes', p_principal(choc_taux=0.02)),
        ('Prix : +1,5 %/an au lieu de 2,5 %', p_principal(g=0.015)),
        ('Ouverture par cercles', p_principal(montee='cercles')),
    ]
    lignes, js['principal_scenarios'] = [], {}
    for nom, p in variantes:
        res = F.simuler(p, q, sp)
        sous = sous_50(res)
        js['principal_scenarios'][nom] = F.resume(res)
        lignes.append([nom, pc(F.ratio_min(res)), pc(F.max_ratio_sur_3_ans(res)[9]), str(sous) if sous else 'jamais', e(res[9]['besoin_md'], 1),
                       e(res[29]['besoin_md'], 1), e(res[29]['dette_md']), e(res[59]['dette_md']), pc(res[59]['dette_pib'], 1), e(res[59]['net_md'])])
    md.append(tab(['Variante', 'Recettes / coûts, min (dès l\'an 5)', 'à l\'an 10', 'Sous 50 % dès', 'Besoin an 10 (Md€)', 'Besoin an 30', 'Dette an 30 (Md€)',
                   'Dette an 60', 'Dette / PIB an 60', 'Patrimoine net an 60'], lignes))
    p50 = p_principal()
    seuils = {'marge sur le taux, 60 ans': F.marge_seuil(p50, q), 'marge sur le taux, 30 ans': F.marge_seuil(p50, q, a=30),
              'marge avec livret 300 Md€, 60 ans': F.marge_seuil(p_principal(livret_max_md=300.0), q),
              'forfait au taux bancaire, 30 ans': F.seuil_parametre(p50, q, 'forfait', FORFAIT, 1.0, a=30)}
    js['principal_seuils'] = seuils
    f_ = (lambda m: 'aucun jusqu\'à 100 %' if m is None else pc(m))
    md.append(f'\n**Seuils (central, 50 % d\'une génération).** Pour rester au-dessus de 50 % pendant 60 ans, le taux du contrat doit dépasser '
              f'le taux bancaire d\'environ **{pt(seuils["marge sur le taux, 60 ans"])}** (taux de {pc(TAUX_BANQUE_V2 + seuils["marge sur le taux, 60 ans"], 1)}) ; '
              f'{pt(seuils["marge sur le taux, 30 ans"])} pour les 30 premières années ; {pt(seuils["marge avec livret 300 Md€, 60 ans"])} avec un livret '
              f'foncier de 300 Md€. Sans toucher au taux, il faudrait un forfait d\'usufruit de {f_(seuils["forfait au taux bancaire, 30 ans"])} '
              'pour tenir les 30 premières années (au lieu de 70 %).\n')
    c50 = js['principal'][0.50]
    md.append(f'**Lecture.** (1) **Au taux des banques, la foncière ne passe pas le test des 50 %** (central : {pc(F.ratio_min(c50))} au plus bas, '
              f'{pc(F.max_ratio_sur_3_ans(c50)[9])} à l\'an 10) : elle prête l\'usufruit à {pc(TAUX_BANQUE_V2, 2)} quand l\'argent lui coûte '
              f'{pc(I_REF, 1)}, et elle porte à crédit les 30 % de nue-propriété jusqu\'au décès ; le forfait de 70 % ne crée qu\'une marge en capital, '
              'qui ne revient qu\'au décès et ne compte pas comme recette courante : la foncière est **rentable en patrimoine, pas en '
              'trésorerie**. Elle resterait donc dans les administrations publiques, sauf lecture comptable favorable où la vente de l\'usufruit '
              'au forfait compterait comme une vente de l\'année (⚠️ à faire trancher par l\'Insee ou Eurostat ; H-FU29). '
              '(2) Le besoin de financement est massif : environ '
              f'{e(js["principal"][0.30][9]["besoin_md"])}, {e(c50[9]["besoin_md"])} et {e(js["principal"][0.70][9]["besoin_md"])} Md€ par an à l\'an 10 '
              '(30, 50, 70 % d\'une génération), soit 1 à 3 fois les prêts nouveaux du fonds d\'épargne (41,6 Md€ en 2025) ; la dette atteint '
              f'{pc(c50[59]["dette_pib"])} du PIB à 60 ans à 50 %. C\'est la taille d\'un grand prêteur immobilier : l\'encours des crédits à '
              'l\'habitat des ménages est de l\'ordre de 1 300 Md€ (⚠️ à vérifier, Banque de France). (3) Le patrimoine net reste positif au central '
              '(les logements reviennent), mais il devient négatif au haut. (4) Le levier qui compte est **le coût de l\'argent** : un livret foncier '
              'large ou un taux du contrat supérieur de 1 à 2 points au taux bancaire.\n')

    # ---- E. Effet sur les prix ----
    md.append('### E. Effet borné sur les prix (capital de départ en apport)\n')
    md.append('Effet de niveau ≈ (entrants additionnels / ventes) / élasticité (offre + demande) du secteur (H-FU40) ; entrants répartis comme les '
              'ventes (1,1 million par an) ; additionnels : 30 / 50 / 70 % des entrants (avancer l\'achat de 39 à 25-35 ans ou acheter au lieu de '
              'louer, H-FU28).\n')
    lignes, js['prix_principal'] = [], {}
    for part in PARTS_GEN:
        n = GENERATION * part
        vals = []
        for k in S:
            c = n * 0.5 / 1100000 / ELASTICITES[k]
            b = n * 0.3 / 1100000 / (2 * ELASTICITES[k])
            h = n * 0.7 / 1100000 / (0.5 * ELASTICITES[k])
            vals.append(f'{pc(c, 1)} ({pc(b, 1)} à {pc(h, 1)})')
            js['prix_principal'][f'{part}/{k}'] = (b, c, h)
        lignes.append([pc(part), e(n / 1000) + ' k', pc(n / 1100000)] + vals)
    md.append(tab(['Part d\'une génération', 'Entrants par an', 'Part des ventes'] + [NOMS[k] for k in S], lignes))
    md.append('\n**Lecture.** À 50 % d\'une génération, la foncière achèterait chaque année l\'équivalent de plus d\'un tiers des ventes de '
              'logements : la demande additionnelle ferait monter le niveau des prix de l\'ordre de 4 à 20 % selon les secteurs (central), '
              'davantage là où l\'offre ne suit pas. Les achats viendraient en partie du parc rendu au décès, mais seulement après plusieurs '
              'décennies. **C\'est le principal risque du scénario** : sans construction ni montée en charge lente, le capital de départ en apport '
              'renchérit les logements qu\'il veut rendre accessibles.\n')

    # ---- F. Droit non utilisé à 35 ans ----
    md.append('### F. Question ouverte : le droit non utilisé à 35 ans\n')
    lignes = []
    for part in PARTS_GEN:
        lignes.append([pc(part), e(GENERATION * (1 - part) / 1000) + ' k', e(GENERATION * part * APPORT_MOYEN['central'] / 1e9, 1)])
    md.append(tab(['Part qui l\'utilise', 'Jeunes qui ne l\'utilisent pas, par génération', 'Apports versés à la foncière (Md€/an, croisière)'], lignes))
    md.append('\nPour comparaison, le capital de départ versé en argent coûterait environ 11,5 Md€ par an (garantie dégressive, '
              '`modeles/capital-de-depart/`). Options pour le droit non utilisé (à trancher par l\'auteur) : (a) **il s\'éteint** : simple et moins cher, '
              'mais injuste pour qui n\'a pas pu acheter (mobilité, santé, revenu) ; (b) **report** au-delà de 35 ans sur motif (naissance, mutation, '
              'handicap), avec un forfait d\'usufruit plus bas ; (c) **conversion partielle** en compte de formation ou en création d\'entreprise '
              '(retour aux usages d\'origine, sous condition) ; (d) **versement sur une épargne retraite** bloquée ; (e) **transfert** au conjoint ou '
              'à un frère ou une sœur qui accède. Recommandation de Claude : (b) + (c), pour ne pas faire du logement le seul usage du capital.\n')

    # ---- G. Comparaison 1 : mensualité bancaire ----
    md.append('### G. Comparaison 1 : la mensualité d\'un prêt bancaire (règle intermédiaire, remplacée)\n')
    md.append(f'Mensualité = prêt de (prix − apport) à {pc(TAUX_BANQUE_V2, 2)} sur 25 ans ; usufruit actuariel ; primo-accédants de tous âges (v1).\n')
    lignes, js['cas'] = [], {}
    for k, s in S.items():
        for cle, nom, prix, surv, rev, ap, duree, loyer in cas_comparaison(T, s):
            c = evaluer_cas(prix, surv, rev, ap, duree, loyer, r_tarif)
            js['cas'][f'{k}/{cle}'] = c
            lignes.append([NOMS[k], nom, e(prix), e(c['m_banque']), pt(c['marge_implicite']) if c['marge_implicite'] is not None else '—',
                           pc(c['effort_banque']) if rev else '—', e(c['loyer']), e(c['cout_loyer_banque'], 2)])
    md.append(tab(['Secteur', 'Cas', 'Prix (€)', 'Mensualité (€/mois)', 'Marge implicite', 'Effort', 'Loyer de marché', 'Coût / loyer'], lignes))
    md.append('')
    lignes, js['banque'] = [], {}
    for part in (0.10, 0.30, 0.60):
        res = F.simuler(F.params('central', redevance='banque', part_cible=part), q)
        js['banque'][part] = F.resume(res)
        lignes.append([pc(part), pc(F.ratio_min(res)), str(sous_50(res) or 'jamais'), e(res[9]['besoin_md'], 1), e(res[29]['besoin_md'], 1),
                       e(max(r['dette_md'] for r in res)), e(res[59]['dette_md']), e(res[59]['net_md'])])
    for nom, p in (('30 %, haut (4,7 %)', F.params('haut', redevance='banque')),):
        res = F.simuler(p, q)
        lignes.append([nom, pc(F.ratio_min(res)), str(sous_50(res) or 'jamais'), e(res[9]['besoin_md'], 1), e(res[29]['besoin_md'], 1),
                       e(max(r['dette_md'] for r in res)), e(res[59]['dette_md']), e(res[59]['net_md'])])
    md.append(tab(['Part des primo-accédants', 'Recettes / coûts, min (dès l\'an 5)', 'Sous 50 % dès', 'Besoin an 10 (Md€)', 'Besoin an 30', 'Dette maximale',
                   'Dette an 60', 'Patrimoine net an 60'], lignes))
    lignes = []
    for sc, (ref, adh) in DEMANDE.items():
        lignes.append([sc, pc(ref), pc(adh), pc(ref + adh), e(320000 * (ref + adh) / 1000) + ' k'])
    md.append('\nDemande attendue avec une mensualité bancaire (H-FU47, ⚠️ aucune statistique publique des refus de crédit) :\n')
    md.append(tab(['Hypothèse', 'Refusés par les banques', 'Adhérents', 'Part des primo-accédants', 'Entrants par an'], lignes))
    md.append('\n**Lecture.** La mensualité bancaire fait passer le test des 50 % pendant 60 ans au central (marge implicite de 5 à 14 points, '
              'parce que l\'occupant rembourse presque le prix entier pour un usufruit) et la foncière s\'autofinance ; mais, pour la même mensualité '
              'qu\'un achat et un droit moindre, seuls les refusés des banques et les adhérents viendraient (de l\'ordre de 10 % des primo-accédants), '
              'et le dispositif coûte plus cher que louer presque partout. Au haut (argent à 4,7 %), le test échoue après une trentaine d\'années.\n')

    # ---- H. Comparaison 2 : marge de 0 à 2 points ----
    md.append('### H. Comparaison 2 : usufruit actuariel et marge de 0 à 2 points au-dessus du coût de l\'argent\n')
    lignes = []
    for k in S:
        for cle, nom, *_ in cas_comparaison(T, S[k]):
            c = js['cas'][f'{k}/{cle}']
            lignes.append([NOMS[k], nom] + [e(c['m_marges'][m]) for m in MARGES] + [e(c['contribution']),
                          pc((c['m_marges'][0.01] + c['contribution']) / c['revenu']) if c['revenu'] else '—',
                          e(c['cout_loyer_marges'][0.0], 2), e(c['cout_loyer_marges'][0.02], 2)])
    md.append(tab(['Secteur', 'Cas', 'Marge 0 (€/mois)', '0,5 pt', '1 pt', '1,5 pt', '2 pts', 'Contribution', 'Effort à 1 pt',
                   'Coût/loyer à 0', 'Coût/loyer à 2 pts'], lignes))
    md.append('')
    lignes, js['marges'] = [], {}
    for m in MARGES:
        res = F.simuler(F.params('central', marge=m), q)
        js['marges'][m] = F.resume(res)
        rr = F.max_ratio_sur_3_ans(res)
        lignes.append([pt(m)] + [pc(rr[a - 1]) for a in (5, 10, 20, 30, 45, 60)] +
                      [str(sous_50(res) or 'jamais')] + [e(res[a - 1]['besoin_md'], 1) for a in (10, 30)] + [e(res[a - 1]['dette_md']) for a in (30, 60)])
    md.append(tab(['Marge (30 % des primo-accédants)', 'Ratio an 5', 'an 10', 'an 20', 'an 30', 'an 45', 'an 60', 'Sous 50 % dès',
                   'Besoin an 10 (Md€)', 'an 30', 'Dette an 30 (Md€)', 'an 60'], lignes))
    md.append('')
    configs = [
        ('Base (contribution au budget public)', {}, 'ratio_marchand'),
        ('Écart de 0,5 point (emprunt hors APU)', {'spread': 0.005}, 'ratio_marchand'),
        ('Livret foncier (100 Md€ à 2 %)', {'livret_max_md': 100.0}, 'ratio_marchand'),
        ('Prêt familial (25 % des jeunes de 25 ans)', {'part_pret_familial': 0.25}, 'ratio_marchand'),
        ('Haut (défavorable)', {'_sc': 'haut'}, 'ratio_marchand'),
        ('Sensibilité secondaire : contribution affectée à la foncière, comptée comme vente ⚠️', {'contribution_affectee': True}, 'ratio_large'),
    ]
    lignes, js['marge_seuil'] = [], {}
    for nom, c, cle in configs:
        c = dict(c)
        sc = c.pop('_sc', 'central')
        p = F.params(sc, **c)
        m60, m30 = F.marge_seuil(p, q, cle=cle, surv_parents=sp), F.marge_seuil(p, q, cle=cle, a=30, surv_parents=sp)
        js['marge_seuil'][nom] = (m60, m30)
        g_ = (lambda m: '> 10 pts' if m is None else pt(m))
        lignes.append([nom, g_(m60), g_(m30)])
    md.append(tab(['Configuration (marge sur l\'usufruit actuariel)', 'Marge minimale, 60 ans', '30 premières années'], lignes))
    ms = js['marge_seuil']['Base (contribution au budget public)']
    md.append(f'\n**Lecture.** Une marge de 0 à 2 points ne suffit pas : à 2 points, le ratio passe 50 % une vingtaine d\'années, puis retombe. '
              f'Il faut environ {pt(ms[0])} (redevance à {pc(I_REF + ms[0], 1)}). Affecter la contribution à la foncière n\'aide que si la '
              'comptabilité nationale la compte comme une vente, ce qui est douteux (un impôt n\'est pas une vente), et le budget public la perd.\n')

    # ---- I. Taux par secteur ----
    md.append('### I. Un taux par secteur pour garder le même effort ? (cible de 400 € par mois)\n')
    md.append(f'Jeune de 25 ans au Smic, T2 médian, 40 000 € d\'apport, usufruit actuariel (comparaison 2). « Borné » : entre {pc(I_REF, 1)} et '
              f'{pc(I_REF + 0.02, 1)} ; « durée » : années pour rembourser à {e(CIBLE)} € par mois à {pc(I_REF + 0.01, 1)}. Dernière colonne : '
              'scénario principal (forfait 70 %, taux bancaire).\n')
    lignes, js['participatif'] = [], {}
    for k, s in S.items():
        cle, nom, prix, surv, rev, ap, duree, loyer = cas_comparaison(T, s)[0]
        c = js['cas'][f'{k}/{cle}']
        t = U.taux_pour_mensualite(c['finance'], CIBLE, 25, haut=3.0)
        tb = min(max(t if t is not None else 9.9, I_REF), I_REF + 0.02)
        mb = U.mensualite(c['finance'], tb, 25)
        d = U.duree_pour_mensualite(c['finance'], I_REF + 0.01, CIBLE)
        js['participatif'][k] = {'taux': t, 'taux_borne': tb, 'mensualite_bornee': mb, 'duree': d}
        lignes.append([NOMS[k], e(prix), e(c['finance']), pc(t, 1) if t is not None else 'impossible', pc(tb, 1), e(mb),
                       pc((mb + c['contribution']) / rev), (e(d, 1) + ' ans') if d else 'impossible',
                       e(js['principal_cas'][f'{k}/jeune']['sans_travaux']['mensualite'])])
    md.append(tab(['Secteur', 'Prix T2', 'Usufruit financé', 'Taux pour 400 €', 'Taux borné', 'Mensualité', 'Effort', 'Durée à 400 €',
                   'Scénario principal'], lignes))
    md.append('\n**Lecture.** Un taux par secteur ne peut pas égaliser l\'effort : là où le T2 est bon marché, il faudrait un taux de 7 à 15 % '
              'pour atteindre 400 € ; à Paris, même un taux nul n\'y suffit pas. L\'écart vient du prix, pas du taux. Mieux vaut **fixer la mensualité '
              'et laisser la durée s\'ajuster**, ou une règle simple proportionnelle au prix (le forfait).\n')

    # ---- J. Autres canaux ----
    md.append('### J. Les autres canaux, appliqués au scénario principal (50 % d\'une génération)\n')
    np_ = 0.30 * S['villes_moyennes']['prix_T2']
    pf = U.pret_familial(np_, sp, 0.02, I_REF)
    js['pret_familial_cas'] = pf
    md.append(f'**Prêt familial (section 19).** T2 médian de ville moyenne : les parents (55 ans) prêtent la nue-propriété (30 %), {e(np_)} €, indexée '
              f'sur l\'inflation et remboursée à leur succession. Durée moyenne {e(pf["duree_moyenne"], 1)} ans ; somme espérée versée '
              f'{e(pf["verse"])} € courants ; gain pour la foncière par rapport à un emprunt à {pc(I_REF, 1)} : {e(pf["gain_foncière"])} € en valeur '
              f'actuelle ({pc(pf["gain_foncière"] / np_)} du prêt).\n')
    canaux = [
        ('Référence', {}),
        ('Prêt familial : 25 % des entrants', {'part_pret_familial': 0.25}),
        ('Livret foncier : 100 Md€ à 2 %', {'livret_max_md': 100.0}),
        ('Livret foncier : 300 Md€ à 2 %', {'livret_max_md': 300.0}),
        ('Sans dation ni viager', {'viagers_par_an': 0.0, 'dation_md': 0.0}),
        ('Dation doublée (1 Md€ par an)', {'dation_md': 1.0}),
        ('Ouverture par cercles (3 000 bâtisseurs par an pendant 3 ans)', {'montee': 'cercles'}),
        ('Prêt familial + livret 300 Md€ + cercles', {'part_pret_familial': 0.25, 'livret_max_md': 300.0, 'montee': 'cercles'}),
    ]
    lignes, js['canaux'] = [], {}
    for nom, c in canaux:
        r = F.simuler(p_principal(**c), q, sp)
        js['canaux'][nom] = F.resume(r)
        lignes.append([nom, e(r[9]['besoin_md'], 1), e(r[29]['besoin_md'], 1), e(r[29]['dette_md']), e(r[59]['dette_md']),
                       pc(F.ratio_min(r)), pc(F.max_ratio_sur_3_ans(r)[9])])
    md.append(tab(['Canal', 'Besoin an 10 (Md€)', 'an 30', 'Dette an 30 (Md€)', 'an 60', 'Recettes / coûts, min (dès l\'an 5)', 'à l\'an 10'], lignes))
    md.append('\n**Lecture.** Le prêt familial remplace de la dette de marché par une dette indexée, remboursée à date connue, sans coût pour '
              'l\'État. Le livret foncier abaisse le coût de l\'argent : c\'est le levier le plus puissant sur le ratio. Dations et viagers pèsent '
              'peu. L\'ouverture par cercles retarde la montée de la dette sans changer sa trajectoire de long terme. Aucun canal seul ne fait passer '
              'le test des 50 % au taux bancaire.\n')
    return md, js


def main():
    T = charger_table()
    md = ['---\ntitre: Foncière d\'État et accession à l\'usufruit à vie (T81) — résultats\nstatut: brouillon ; généré par code/calculer.py ; '
          'écrit par Claude (IA d\'Anthropic) pour l\'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions\n---\n',
          '# Foncière d\'État et accession à l\'usufruit à vie : résultats\n',
          'Fichier généré par `code/calculer.py` (et `code/preparer_secteurs.py` pour les prix et loyers par secteur) ; hypothèses dans '
          '`methode.md`. Deux parties : la **v2** (09/11/2026, soir), puis la **v1** (sans marge), conservée pour comparaison.\n']
    md2, js2 = sections_v2(T)
    js2['principal'] = {k: F.resume(v) for k, v in js2['principal'].items()}
    md1, js1 = sections_v1(T)
    with open(os.path.join(RACINE, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(md + md2 + md1) + '\n')
    with open(os.path.join(RACINE, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump({'v2': js2, 'v1': js1}, f, ensure_ascii=False, indent=1, default=str)
    print('resultats.md et donnees/resultats.json écrits')


if __name__ == '__main__':
    main()
