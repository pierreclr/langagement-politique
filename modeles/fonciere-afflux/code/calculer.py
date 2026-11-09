#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Calcule les résultats de modeles/fonciere-afflux/ et écrit resultats.md et donnees/resultats.json.
Usage (racine de l'atelier) : python3 -I modeles/fonciere-afflux/code/calculer.py   (quelques minutes)
Prérequis : donnees/dpe_classe_surface.csv et donnees/parc_dpe_surface.csv (scripts de donnees/).
Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses : methode.md ; valeurs : donnees/parametres.json.
Des ordres de grandeur sous hypothèses, jamais des prédictions."""
import json, math, os, subprocess, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import afflux as A          # noqa: E402
import offre_prix as OP     # noqa: E402
import finances as FI       # noqa: E402
import experimentation as X  # noqa: E402
import importlib.util       # noqa: E402
_s = importlib.util.spec_from_file_location('calc_fonciere', os.path.join(A.MODELES, 'fonciere-usufruit', 'code', 'calculer.py'))
CF = importlib.util.module_from_spec(_s)
_s.loader.exec_module(CF)

SECT = A.SECT
NS = {'paris': 'Paris', 'metropoles': 'Métropoles', 'villes_moyennes': 'Villes moyennes', 'rural': 'Rural'}
HORS_PARIS = ('metropoles', 'villes_moyennes', 'rural')
e, tab = CF.e, CF.tab
U = A.U
F_CENTRAL, DUREE_CENTRALE = 0.85, 25
STOCK_IMMO_MENAGES = 9696e9     # immobilier des ménages, Insee Première n° 2081 (nov. 2025), cité au chapitre 3


def pp(x, d=1):
    return '—' if x is None or (isinstance(x, float) and math.isnan(x)) else e(100 * x, d) + ' %'


def sg(x, d=1):
    """Pourcentage signé."""
    if x is None:
        return '—'
    s = e(100 * x, d)
    return ('+' + s if x > 0.00005 else s) + ' %'


def md_(x, d=1):
    return '—' if x is None else e(x, d)


class Ctx:
    """Données chargées une fois (pas d'état modifié ensuite)."""
    def __init__(self):
        self.T = CF.charger_table()
        self.q = self.T['ensemble']
        self.S = CF.charger_secteurs()
        self.her = A.O.charger_heritages()
        self.P = A.charger_parametres()
        self.off = OP.charger_offre()


def evaluer(C, sc='central', reg=None, i=None, sur=None, facteur_offre=1.0, simuler=True, suivre_banque=False):
    """Une évaluation complète : afflux, offre des bailleurs, prix des trois mondes, foncière."""
    h = A.hypotheses(C.P, sc, **(sur or {}))
    reg = reg or A.reglage(f=F_CENTRAL, duree=DUREE_CENTRALE)
    r = A.agreger(reg, h, C.her, C.S, C.q)
    V = OP.ventes_bailleurs(C.off, h, facteur=facteur_offre)
    Q = OP.transactions(C.S, h)
    D = OP.demande_fonciere(r)
    # offre nette moyenne des dix premières années (réforme − ventes que l'interdiction aurait provoquées)
    On10 = {s: {g: sum(OP.offre_nette(V[t])[s][g] for t in range(10)) / 10 for g in OP.SEG} for s in SECT}
    mondes = {'reforme': OP.effet_prix(OP.zero(), On10, Q, h), 'fonciere': OP.effet_prix(D, OP.zero(), Q, h),
              'deux': OP.effet_prix(D, On10, Q, h)}
    b = None
    if simuler:
        b = FI.bilan(FI.simuler(FI.params_fonciere(r, reg, i=i, suivre_banque=suivre_banque), C.q))
    return dict(h=h, reg=reg, r=r, V=V, Q=Q, D=D, On10=On10, mondes=mondes, b=b)


def max_hors_paris(m):
    return max(m[s]['moyenne'] for s in HORS_PARIS)


def main():
    C = Ctx()
    js = {}
    md = []
    date = subprocess.run(['date', '+%d/%m/%Y'], capture_output=True, text=True).stdout.strip()

    # ------------------------------------------------------------------ évaluations de base
    base = evaluer(C)
    h, r, b = base['h'], base['r'], base['b']
    scen = {sc: evaluer(C, sc) for sc in ('bas', 'haut')}
    scen['central'] = base
    grille_f = {}
    for f in (0.70, 0.80, 0.85, 0.90):
        for d in (25, 30):
            reg = A.reglage(f=f, duree=d)
            ev = evaluer(C, reg=reg, simuler=False)
            res = dict(ev=ev, b={})
            for i in (0.035, 0.047, 0.053):
                res['b'][i] = FI.bilan(FI.simuler(FI.params_fonciere(ev['r'], reg, i=i), C.q))
            res['b']['047s'] = FI.bilan(FI.simuler(FI.params_fonciere(ev['r'], reg, i=0.047, suivre_banque=True), C.q))
            grille_f[(f, d)] = res

    # ------------------------------------------------------------------ en-tête
    md += ['---', 'titre: Afflux vers la foncière et effets sur les prix — résultats',
           'statut: brouillon ; généré par code/calculer.py ; ne pas éditer à la main ; des ordres de grandeur sous hypothèses, jamais des prédictions',
           '---', '', '# Afflux vers la foncière et effets sur les prix : résultats', '',
           f'**Écrit par Claude (IA d\'Anthropic) pour l\'auteur.** Généré le {date} par `python3 -I modeles/fonciere-afflux/code/calculer.py`. '
           'Méthode et hypothèses numérotées H-FA1 à H-FA60 : `methode.md` ; valeurs et sources : `donnees/parametres.json`. Euros de 2026.', '',
           '**Précaution de méthode.** Ce modèle ne présente jamais une hausse des prix comme un avantage sans dire qui la paie et qui en profite. Claude, qui l\'a écrit, est un modèle d\'Anthropic ; il n\'a pas d\'intérêt '
           'financier connu dans le logement, mais il a tendance à vouloir aider l\'auteur, ce qui est un biais à surveiller.', '']
    pos_dix = len(md)      # les dix lignes sont insérées ici à la fin, quand tous les chiffres sont connus

    # ------------------------------------------------------------------ 1. déclencheur
    ages, jamais = A.ages_emploi_stable(h)
    md += ['## 1. Le déclencheur : premier emploi stable et revenus', '',
           'Un jeune demande l\'entrée à son premier emploi stable (emploi à durée indéterminée), au plus tard à 35 ans. Répartition d\'une génération '
           '(H-FA2, calée sur le Céreq et l\'Insee : sortie de formation à 22 ans en moyenne, 19 mois pour le premier emploi à durée indéterminée, 84 % '
           'en ont eu un environ six ans après la sortie) et revenu net au centre de chaque décile (H-FA3, médiane 1 800 € au premier emploi stable, '
           'qui remplace H-CO3 non sourcée).', '']
    lig = []
    for sc in ('bas', 'central', 'haut'):
        hh = scen[sc]['h']
        ag, jm = A.ages_emploi_stable(hh)
        lig.append([sc] + [pp(w, 0) for _, w in ag] + [pp(jm, 0), e(sum(a * w for a, w in ag) / (1 - jm), 1)])
    md.append(tab(['Scénario', '≤ 23 ans', '24-26', '27-29', '30-32', '33-35', 'pas avant 36 ans', 'âge moyen (ans)'], lig))
    dec = A.revenus_deciles(h)
    md += ['', tab(['Décile de revenu'] + [f'D{k + 1}' for k in range(10)], [['€ nets / mois (25 ans)'] + [e(x, 0) for x in dec]]), '',
           f'**Lecture.** Au central, {pp(1 - jamais, 0)} d\'une génération trouve un emploi stable avant 36 ans, à {e(sum(a * w for a, w in ages) / (1 - jamais), 1)} ans '
           'en moyenne : c\'est la population qui peut demander. Les {0} restants (non-diplômés surtout) sont hors dispositif et reçoivent la moitié de '
           'leur capital en parts à vie. **Aucune distribution de l\'âge au premier emploi stable n\'est publiée** : celle-ci est une inférence ; le '
           'chiffre souvent cité de « 27 ans pour le premier CDI » (CESE 2012) n\'a pas de source primaire et n\'est pas utilisé.'.format(pp(jamais, 0)), '']
    js['declencheur'] = dict(ages=ages, jamais=jamais, deciles=dec)

    # ------------------------------------------------------------------ 2. afflux
    md += ['## 2. L\'afflux : combien de jeunes, pour quels logements', '',
           'Choix de chaque ménage (héritage × revenu × secteur × âge au premier emploi stable × seul, couple ou famille) : foncière, achat bancaire '
           'ou location (H-FA9 à H-FA17). Mensualité foncière = prêt sur (f × prix − capital de départ) au taux bancaire de 3,32 % ; financement mixte '
           'au-delà de f × prix du T3 médian du secteur (H-FA15). « Contrats » = ménages (un couple = un contrat). « Propriétaires » : propriétaires ou '
           'usufruitiers à 35 ans parmi ceux qui ont un emploi stable avant 36 ans ; « sans dispositif » : même calcul, banque seule, sans capital.', '']
    lig = []
    for (f, d), g in grille_f.items():
        rr, bb = g['ev']['r'], g['b'][0.035]
        lig.append([pp(f, 0), str(d), e(rr['jeunes_F'] / 1000, 0) + ' k', pp(rr['part_F'], 0), e(rr['contrats'] / 1000, 0) + ' k',
                    pp(rr['contrats'] / h['transactions'], 0), e(rr['prix_contrat'], 0), e(rr['apport_contrat'], 0), e(rr['banque_contrat'], 0),
                    pp(rr['montee'], 0), pp(rr['proprio'], 0), pp(rr['proprio_sans'], 0), pp(rr['proprio_D15'], 0), pp(rr['sans_D15'], 0)])
    md.append(tab(['Forfait f', 'Durée', 'Jeunes par an', 'Part d\'une génération', 'Contrats par an', 'Part des ventes', 'Prix moyen (€)',
                   'Capital apporté (€/contrat)', 'Part bancaire (€/contrat)', 'Montée en gamme', 'Propriétaires à 35 ans', 'sans dispositif',
                   'idem, moitié qui hérite le moins', 'sans dispositif'], lig))
    lig = []
    for sc in ('bas', 'central', 'haut'):
        rr = scen[sc]['r']
        lig.append([sc, e(rr['jeunes_F'] / 1000, 0) + ' k', pp(rr['part_F'], 0), e(rr['contrats'] / 1000, 0) + ' k',
                    pp(rr['contrats'] / scen[sc]['h']['transactions'], 0), pp(rr['A']['F_nb'] / rr['part_F'], 0), pp(rr['A']['F_banque'] / rr['part_F'], 0),
                    pp(rr['A']['F_appel'] / rr['part_F'], 0), pp(rr['proprio'], 0), pp(rr['proprio_sans'], 0)])
    md += ['', f'Scénarios (f = {pp(F_CENTRAL, 0)}, 25 ans) : ', '',
           tab(['Scénario', 'Jeunes par an', 'Part d\'une génération', 'Contrats', 'Part des ventes', 'dont sans accès bancaire', 'dont avaient accès à la banque',
                'dont effet d\'appel', 'Propriétaires à 35 ans', 'sans dispositif'], lig)]
    # par secteur et taille
    lig = []
    for s in SECT:
        lig.append([NS[s]] + [e(r['seg'][(s, t)]['contrats'] / 1000, 1) + ' k' for t in A.TAILLES] +
                   [pp(sum(r['seg'][(s, t)]['contrats'] for t in A.TAILLES) / sum(base['Q'][s].values()), 0), pp(r['secteurs'][s]['F'], 0)])
    md += ['', 'Contrats par secteur et par taille (central, f = 85 %, 25 ans) :', '',
           tab(['Secteur', 'T2', 'T3', 'T4', 'Part des ventes du secteur', 'Part des jeunes du secteur qui entrent'], lig)]
    g85 = grille_f[(0.85, 25)]['ev']['r']
    g70 = grille_f[(0.70, 25)]['ev']['r']
    md += ['', f'**Lecture.** À f = 85 % (25 ans), environ {e(r["jeunes_F"] / 1000, 0)} 000 jeunes par an entrent (bas–haut : {e(scen["bas"]["r"]["jeunes_F"] / 1000, 0)} 000 '
           f'à {e(scen["haut"]["r"]["jeunes_F"] / 1000, 0)} 000), soit {e(r["contrats"] / 1000, 0)} 000 contrats, {pp(r["contrats"] / h["transactions"], 0)} des ventes '
           f'annuelles de logements ; à 70 %, {e(g70["jeunes_F"] / 1000, 0)} 000. Le premier essai (essais/afflux_forfait.py : ≈ 300 000 jeunes, 20 % des ventes) est '
           f'du même ordre. **Paris est hors de portée** : le T2 médian y vaut 347 800 € ; même avec le financement mixte, l\'effort dépasse 35 % pour presque tous. '
           f'La majorité des entrants n\'a pas accès à la banque ({pp(r["A"]["F_nb"] / r["part_F"], 0)}) : la foncière élargit l\'accès plus qu\'elle ne détourne '
           f'des acheteurs bancaires. Les revenus plus élevés montent en gamme dans {pp(r["montee"], 0)} des contrats ; la part prêtée par une banque dans le '
           f'financement mixte reste faible en moyenne ({e(r["banque_contrat"], 0)} € par contrat) parce que les biens au-dessus du T3 médian sont rares chez ces jeunes. '
           'Le forfait agit surtout sur la demande des bancarisés : plus il monte, moins ils viennent ; les non-bancarisés viennent tant qu\'ils peuvent payer.', '']
    js['afflux'] = {f'{f}_{d}': dict(jeunes=g['ev']['r']['jeunes_F'], contrats=g['ev']['r']['contrats'], part=g['ev']['r']['part_F'],
                                     proprio=g['ev']['r']['proprio'], proprio_D15=g['ev']['r']['proprio_D15'], prix=g['ev']['r']['prix_contrat'])
                    for (f, d), g in grille_f.items()}
    js['afflux_scenarios'] = {sc: dict(jeunes=scen[sc]['r']['jeunes_F'], contrats=scen[sc]['r']['contrats']) for sc in scen}

    # ------------------------------------------------------------------ 3. offre des bailleurs
    V = base['V']
    tot = lambda v, src: sum(sum(v[src][s].values()) for s in SECT)
    lig = []
    for t in (0, 1, 2, 4, 6, 7, 9, 14):
        v = V[t]
        net = tot(v, 'plafond') + tot(v, 'niches') - tot(v, 'interdiction')
        lig.append([str(2027 + t), e(tot(v, 'plafond') / 1000, 0) + ' k', e(tot(v, 'plafond_energie') / 1000, 0) + ' k', e(tot(v, 'niches') / 1000, 0) + ' k',
                    e(tot(v, 'interdiction') / 1000, 0) + ' k', e(net / 1000, 0) + ' k'])
    cum10 = sum(tot(V[t], 'plafond') + tot(V[t], 'niches') for t in range(10))
    cum10i = sum(tot(V[t], 'interdiction') for t in range(10))
    N = OP.stock(C.off, h)
    efg = {g: sum(sum(N[s][g][c] for c in 'EFG') for s in SECT) for g in OP.SURF}
    tg = {g: sum(sum(N[s][g].values()) for s in SECT) for g in OP.SURF}
    d0 = V[0]['detail']
    md += ['## 3. L\'offre : les bailleurs qui vendent', '',
           'Parc locatif privé : 8,3 millions de résidences principales (SDES/ONRE, 01/01/2025), réparti par classe DPE et surface ; classes réparties entre '
           'secteurs d\'après les DPE des villes témoins (H-FA30-32). Le plafond de loyer (formule du chapitre 6, k = 1,2, scénario central de `loyers-energie`) '
           'joue à la relocation (rotation 21 % par an) ; le bailleur dont le loyer est coupé vend avec une probabilité proportionnelle à sa perte de revenu '
           'net (H-FA33, ⚠️ non sourcée). La suppression des avantages fiscaux fait vendre de la même façon (H-FA34). En droit actuel, l\'interdiction de louer '
           '(G depuis 2025, F en 2028, E en 2034) fait déjà vendre ; la réforme la remplace : ces ventes-là disparaissent (H-FA35).', '',
           tab(['Année', 'Plafond de loyer (total)', 'dont dû à l\'énergie', 'Fin des avantages fiscaux', 'Ventes de l\'interdiction (droit actuel, supprimées)',
                'Offre nette de la réforme'], lig), '',
           tab(['Surface', 'Parc locatif privé', 'dont E, F, G', 'Part E-F-G', 'Ventes de la 1re année (plafond)'],
               [[g, e(tg[g] / 1000, 0) + ' k', e(efg[g] / 1000, 0) + ' k', pp(efg[g] / tg[g], 0), e(d0['surface'][g] / 1000, 1) + ' k'] for g in OP.SURF]), '',
           tab(['Classe', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], [['Ventes de la 1re année (plafond)'] + [e(d0['classe'][c] / 1000, 1) + ' k' for c in 'ABCDEFG']]), '',
           f'**Lecture.** La réforme locative ferait vendre de l\'ordre de {e(cum10 / 1000, 0)} 000 logements loués sur dix ans (central), surtout les premières années, '
           f'contre {e(cum10i / 1000, 0)} 000 que l\'interdiction aurait fait vendre sur la même période. **Le plafond mord d\'abord par son seuil de 120 % du loyer médian, '
           f'pas par l\'énergie** : la part due à l\'énergie n\'est que {pp(tot(V[0], "plafond_energie") / tot(V[0], "plafond"), 0)} des ventes provoquées par le plafond '
           '(comme dans `loyers-energie`, où l\'énergie ajoute 0 à 4 points aux loyers coupés). Les petites surfaces sont les plus mal classées (21 % de E-F-G... '
           f'voir la part par surface) ; elles représentent {pp((d0["surface"][OP.SURF[0]] + d0["surface"][OP.SURF[1]]) / sum(d0["surface"].values()), 0)} des ventes. '
           '**Par rapport au droit actuel**, la réforme fait moins vendre les passoires (elle supprime l\'interdiction) mais fait vendre d\'autres logements '
           '(plafond général, fin des avantages fiscaux). La part des bailleurs qui vendent n\'est mesurée par aucune étude : c\'est l\'hypothèse la plus '
           'fragile de cette partie, et la contribution sur le patrimoine (le locatif entre dans la courbe du chapitre 3, jusqu\'à près de 3 % par an) '
           'pourrait faire vendre bien davantage : elle n\'est pas modélisée ici ⚠️.', '']
    js['offre'] = dict(par_an=[dict(annee=2027 + t, plafond=tot(V[t], 'plafond'), energie=tot(V[t], 'plafond_energie'), niches=tot(V[t], 'niches'),
                                     interdiction=tot(V[t], 'interdiction')) for t in range(30)], cumul10=cum10, cumul10_interdiction=cum10i)

    # ------------------------------------------------------------------ 4. prix
    md += ['## 4. Les prix : trois mondes, par secteur et par taille', '',
           'Effet de niveau = (demande additionnelle − offre additionnelle) / ventes du segment × réponse du prix (1 / (élasticité de l\'offre + élasticité '
           'de la demande), H-FA21, fourchettes du dossier `sources/prix-immobilier-effets-mesures.md`), avec diffusion de 50 % entre tailles (H-FA22). '
           'Foncière en régime ; offre de la réforme : moyenne des dix premières années. Effet de niveau atteint en 5 à 10 ans, pas une trajectoire.', '']
    lig = []
    for nom, cle in (('Réforme locative seule', 'reforme'), ('Foncière seule', 'fonciere'), ('Les deux', 'deux')):
        for s in SECT:
            m = base['mondes'][cle][s]
            lig.append([nom, NS[s]] + [sg(m[g]) for g in OP.SEG] + [sg(m['moyenne']),
                       f"{sg(scen['bas']['mondes'][cle][s]['moyenne'])} à {sg(scen['haut']['mondes'][cle][s]['moyenne'])}"])
    md.append(tab(['Monde', 'Secteur', 'T1-T2', 'T3', 'T4 et plus', 'Moyenne du secteur', 'bas à haut'], lig))
    # trajectoire : la foncière monte en 10 ans, la vague de ventes des bailleurs retombe
    lig = []
    for t in (0, 2, 4, 6, 9, 14):
        k = min(1.0, (t + 1) / 10)
        Dt = {s: {g: base['D'][s][g] * k for g in OP.SEG} for s in SECT}
        mt = OP.effet_prix(Dt, OP.offre_nette(V[t]), base['Q'], h)
        lig.append([str(2027 + t), pp(k, 0)] + [sg(mt[s]['moyenne']) for s in SECT])
    md += ['', 'Trajectoire des deux réformes ensemble (foncière montée linéairement en 10 ans ; offre des bailleurs de l\'année) :', '',
           tab(['Année', 'Foncière (part du régime)', 'Paris', 'Métropoles', 'Villes moyennes', 'Rural'], lig), '',
           'Le calendrier joue contre l\'équilibre : les bailleurs vendent surtout les premières années, quand la foncière démarre à peine ; quand elle atteint son régime, '
           'la vague est passée, et la suppression de l\'interdiction (qui aurait fait vendre les E à partir de 2034) retire même de l\'offre par rapport au droit actuel.', '']
    # changements de mains
    lig = []
    for s in SECT:
        q0 = sum(base['Q'][s].values())
        dF = sum(base['D'][s].values())
        oR = sum(base['On10'][s].values())
        lig.append([NS[s], e(q0 / 1000, 0) + ' k', e((q0 + oR) / 1000, 0) + ' k', e((q0 + dF) / 1000, 0) + ' k', e((q0 + dF + oR) / 1000, 0) + ' k'])
    md += ['', 'Logements qui changent de mains par an (ventes de base + ventes additionnelles des bailleurs + achats additionnels de la foncière ; '
           'les achats non additionnels de la foncière remplacent des ventes existantes) :', '',
           tab(['Secteur', 'Sans réforme', 'Réforme locative seule', 'Foncière seule', 'Les deux'], lig)]
    # droits de mutation, taux
    hd = dict(h)
    Qd = OP.transactions(C.S, h, dmto=True)
    m_dm = OP.effet_prix(base['D'], OP.zero(), Qd, h, dmto=True)
    m_dm0 = OP.effet_prix(OP.zero(), OP.zero(), Qd, h, dmto=True)
    m_f_dm = OP.effet_prix(base['D'], OP.zero(), Qd, h)
    semi = h['semi_taux']
    semi_rec = OP.semi_elasticite_taux(h)
    lig = []
    for s in SECT:
        lig.append([NS[s], sg(base['mondes']['fonciere'][s]['moyenne']), sg(m_f_dm[s]['moyenne']), sg(m_dm0[s]['moyenne']), sg(m_dm[s]['moyenne']),
                    sg(semi), sg(-semi)])
    md += ['', 'Droits de mutation et taux (central) :', '',
           tab(['Secteur', 'Foncière seule, droits actuels', 'Foncière seule, ventes plus nombreuses sans droits (+10 %)',
                'Suppression des droits seule (κ = 70 % de 5,8 %)', 'Foncière + suppression des droits', '+1 point de taux', '−1 point de taux'], lig)]
    # capitalisation : méthode de recoupement
    val_ventes = {s: sum(base['Q'][s].values()) * C.S[s]['prix_moyen_tous'] for s in SECT}
    rec = {}
    for sc, k in (('bas', 0.0), ('central', h['capitalisation_aide']), ('haut', scen['haut']['h']['capitalisation_aide'])):
        rec[sc] = r['cout_apports_md'] * 1e9 * k / sum(val_ventes[s] for s in HORS_PARIS + ('paris',))
    # test de l'affirmation de l'auteur (petites surfaces)
    mF = base['mondes']['fonciere']
    val_seg = {s: {g: base['Q'][s][g] * (C.S[s]['prix_T2'] if g == 'T1-T2' else C.S[s]['prix_T3'] if g == 'T3' else C.S[s]['prix_T4']) for g in OP.SEG} for s in SECT}
    gain_seg = {g: sum(mF[s][g] * val_seg[s][g] for s in SECT) for g in OP.SEG}
    part_val_petits = sum(val_seg[s]['T1-T2'] for s in SECT) / sum(sum(v.values()) for v in val_seg.values())
    part_gain_petits = gain_seg['T1-T2'] / sum(gain_seg.values())
    part_contrats_petits = sum(r['seg'][(s, 'T2')]['contrats'] for s in SECT) / r['contrats']
    hf = max_hors_paris(base['mondes']['fonciere'])
    md += ['', f'**Recoupement par une autre méthode** : si {pp(h["capitalisation_aide"], 0)} du capital apporté chaque année ({e(r["cout_apports_md"], 1)} Md€) passait dans les prix '
           f'(Help to Buy à Londres ; 0 % là où l\'offre suit, 50-80 % pour les aides au logement dans les loyers), le niveau moyen des prix monterait de {sg(rec["central"])} '
           f'(bas–haut : {sg(rec["bas"])} à {sg(rec["haut"])}). Cette méthode ne compte que le capital ; la méthode principale compte aussi le crédit de la foncière, '
           'qui solvabilise des ménages refusés par les banques : c\'est pourquoi elle donne bien plus.', '',
           '**Position de l\'auteur testée : la hausse resterait limitée, parce qu\'elle porte sur des surfaces modestes.** Les deux sens, chiffrés (foncière seule, central) :',
           f'- **Pour** : les T1-T2 ne font que {pp(part_val_petits, 0)} de la valeur des ventes ; en euros, la hausse qui porte sur eux pèse {pp(part_gain_petits, 0)} '
           'du total ; l\'offre de petites surfaces s\'ajuste mieux (Grislain-Letrémy et Trevien) ; et le plafond de loyer met en vente surtout des petites surfaces.',
           f'- **Contre** : {pp(part_contrats_petits, 0)} des contrats portent sur des T2 ; concentrée sur un segment étroit, la même demande y fait plus monter les prix '
           f'en pourcentage (jusqu\'à {sg(max(mF[s]["T1-T2"] for s in HORS_PARIS))} sur les T1-T2 hors Paris) ; et ce sont précisément les logements des jeunes, des '
           'étudiants et des primo-accédants hors dispositif. La diffusion entre tailles (50 %) propage ensuite la hausse aux autres segments.',
           f'- **Verdict** : en euros et pour l\'ensemble du parc, l\'affirmation tient en partie ; en pourcentage, sur le segment qui compte pour les jeunes, elle ne tient pas. '
           f'Au central, la foncière seule fait monter les prix de {sg(hf)} dans le secteur hors Paris le plus touché, bien au-dessus de 5 %.', '',
           f'**Lecture.** (1) **La foncière seule fait monter les prix nettement** : {sg(base["mondes"]["fonciere"]["villes_moyennes"]["moyenne"])} en villes moyennes, '
           f'{sg(base["mondes"]["fonciere"]["metropoles"]["moyenne"])} dans les métropoles (central ; bas–haut dans le tableau). C\'est plus que les modèles précédents '
           '(4 à 7 %), pour deux raisons : la demande est plus forte (financement à 85 % sans banque) et les élasticités sont désormais tirées des études françaises '
           '(offre ≈ 0,3 à 0,5), alors que H-FU40 supposait une offre deux à quatre fois plus souple. (2) **La réforme locative seule fait baisser les prix**, surtout à '
           'Paris et dans les métropoles, où les bailleurs vendent et où la foncière n\'achète presque rien (Paris). (3) **Les deux ensemble** : dans les métropoles, '
           'les deux effets se compensent à peu près ; en villes moyennes et dans le rural, la demande de la foncière l\'emporte ; à Paris, la baisse domine. '
           f'(4) **Ordre de grandeur des taux** : un point de taux bouge les prix d\'environ {sg(semi)} (BCE ; recoupement {sg(semi_rec)}) partout, autant ou plus que la '
           'foncière dans les métropoles, moins qu\'elle en villes moyennes. (5) **Suppression des droits de mutation** : elle ajoute de l\'ordre de '
           f'{sg(h["kappa_dmto"] * h["taux_dmto"])} au prix des vendeurs (capitalisation de 40 à 100 %), un gain pour les propriétaires en place, financé par la perte de '
           f'{e(h["recette_dmto_md"], 1)} Md€ de recettes ; les ventes plus nombreuses n\'atténuent que faiblement l\'effet de la foncière. (6) **Ce que disent les études** : la Banque '
           'de France (Bloc-notes Éco 441, mars 2026) conclut qu\'un soutien à l\'achat face à une offre inélastique fait monter les prix sans effet notable sur l\'accession, et '
           'l\'offre française est parmi les plus inélastiques de l\'OCDE (0,49). Le modèle va dans le même sens pour les prix ; il prédit en plus un effet sur l\'accession '
           'parce que la foncière prête à des ménages que les banques refusent, ce qu\'aucune étude ne mesure.', '']
    js['prix'] = dict(mondes={k: v for k, v in base['mondes'].items()}, dmto=m_dm, dmto_seule=m_dm0, semi_taux=semi, semi_recoupement=semi_rec,
                      recoupement=rec, part_val_petits=part_val_petits, part_gain_petits=part_gain_petits,
                      scenarios={sc: scen[sc]['mondes'] for sc in scen})

    # ------------------------------------------------------------------ 5. gagnants et perdants
    md += ['## 5. Qui gagne, qui perd', '', '### 5.1 Les jeunes entrants', '']
    lig = []
    for s in SECT:
        x = r['secteurs'][s]
        vide = x['F'] < 0.005       # presque personne n'entre (Paris) : moyennes non significatives
        lig.append([NS[s], pp(x['F'], 0), pp(x['proprio'], 0), pp(x['sans'], 0)] + (['—'] * 4 if vide else
                   [md_(x['m'], 0), md_(x['mb'], 0), md_(x['loyer'], 0), pp(x['effort'], 0)]))
    md.append(tab(['Secteur', 'Entrent à la foncière', 'Propriétaires à 35 ans', 'sans dispositif', 'Mensualité foncière moyenne (€)',
                   'Mensualité bancaire du même bien (90 %)', 'Loyer de marché du même bien', 'Effort (mensualité + contribution)'], lig))
    lig = [[f'D{k + 1}', pp(d['F'], 0), pp(d['proprio'], 0), pp(d['sans'], 0), md_(d['m'], 0), pp(d['effort'], 0)] for k, d in enumerate(r['dec_y'])]
    md += ['', 'Par décile de revenu :', '', tab(['Décile de revenu', 'Foncière', 'Propriétaires à 35 ans', 'sans dispositif', 'Mensualité (€)', 'Effort'], lig)]
    lig = [[f'D{k + 1}', e(d['cap'], 0), pp(d['F'], 0), pp(d['proprio'], 0), pp(d['sans'], 0)] for k, d in enumerate(r['dec_h'])]
    md += ['', 'Par décile d\'héritage :', '', tab(['Décile d\'héritage', 'Capital de départ moyen (€)', 'Foncière', 'Propriétaires à 35 ans', 'sans dispositif'], lig)]
    md += ['', f'**Lecture.** La foncière fait passer la part de propriétaires (ou usufruitiers) à 35 ans de {pp(r["proprio_sans"], 0)} à {pp(r["proprio"], 0)} '
           f'(moitié qui hérite le moins : de {pp(r["sans_D15"], 0)} à {pp(r["proprio_D15"], 0)}). Hors Paris, la mensualité est inférieure au loyer de marché du même '
           f'logement : c\'est ce qui rend l\'afflux massif. Le premier décile de revenu entre moins ({pp(r["dec_y"][0]["F"], 0)} contre {pp(r["part_F"] / (1 - jamais), 0)} '
           'en moyenne) et Paris pas du tout. Au-delà du 5e décile d\'héritage, le capital fond et la foncière attire peu : le dispositif sert bien ceux qui héritent peu. Ces chiffres ne '
           'tiennent pas compte de la hausse des prix que l\'afflux provoque (section 4) : à +10 % de prix, la mensualité monte d\'environ 10 % × f.', '']

    # 5.2 transferts
    mo = base['mondes']['fonciere']
    gain_vendeurs = sum(mo[s]['moyenne'] * val_ventes[s] for s in SECT) / 1e9
    gain_stock = sum(mo[s]['moyenne'] * STOCK_IMMO_MENAGES * C.S[s]['part_ventes'] for s in SECT) / 1e9
    val_fonc = {s: sum(r['seg'][(s, t)]['contrats'] * C.S[s]['prix_' + t] for t in A.TAILLES) for s in SECT}
    paie_fonc = sum(mo[s]['moyenne'] * val_fonc[s] for s in SECT) * (1 - F_CENTRAL) / 1e9
    paie_entr = sum(mo[s]['moyenne'] * val_fonc[s] for s in SECT) * F_CENTRAL / 1e9
    paie_autres = gain_vendeurs - paie_fonc - paie_entr
    # bailleurs : baisse de loyer à pleine relocation (somme sur le parc) et part due à l'énergie
    perte_loyer, perte_energie = 0.0, 0.0
    for s in SECT:
        for g in OP.SURF:
            for c in OP.CLASSES:
                st = OP.stat_plafond(C.off, s, c, OP.TAILLE_SURF[g])
                if st:
                    perte_loyer += N[s][g][c] * st['baisse_tous'] * 12
                    perte_energie += N[s][g][c] * max(0.0, st['baisse_tous'] - st['baisse0']) * 12
    impot_fonciers = perte_loyer * h['taux_imposition_fonciers'] / 1e9
    # loyers : les entrants qui auraient loué libèrent des logements ; les bailleurs qui vendent en retirent
    sortants_location = r['contrats'] * (r['A']['F_nb'] + r['A']['F_appel']) / r['part_F']
    retires = sum(sum(base['On10'][s].values()) for s in SECT)
    effet_loyers = 1.5 * (retires - sortants_location) / h['parc_locatif_prive']
    md += ['', '### 5.2 Les transferts (central, Md€ par an en régime, foncière seule sauf mention)', '',
           tab(['Qui', 'Montant', 'Sens'], [
               ['Vendeurs de l\'année (tous logements vendus)', e(gain_vendeurs, 1), 'gagnent : la hausse sur ce qu\'ils vendent'],
               ['Tous les propriétaires (valeur du parc, plus-value latente, une fois)', e(gain_stock, 0) + ' (stock)', 'gagnent sur le papier'],
               ['dont payé par la foncière (1 − f de la hausse sur ses achats → dette)', e(paie_fonc, 1), 'paie'],
               ['dont payé par les jeunes entrants (f de la hausse, sur 25 ans)', e(paie_entr, 1), 'paient'],
               ['dont payé par les autres acheteurs (déjà propriétaires, plus de 35 ans, investisseurs, primo-accédants à la banque)', e(paie_autres, 1), 'paient'],
               ['Bailleurs : baisse des loyers à pleine relocation (plafond total)', e(perte_loyer / 1e9, 1), 'perdent ; locataires gagnent'],
               ['dont part due à l\'énergie', e(perte_energie / 1e9, 1), ''],
               ['État : impôt sur les revenus fonciers perdu', e(impot_fonciers, 1), 'perd'],
               ['Suppression des droits de mutation : gain des vendeurs (κ × 5,8 % des ventes)', e(h['kappa_dmto'] * h['taux_dmto'] * sum(val_ventes.values()) / 1e9, 1), 'gagnent'],
               ['Suppression des droits de mutation : recette perdue', e(h['recette_dmto_md'], 1), 'perd (remplacée au chapitre 3)'],
           ]), '',
           f'**Lecture, sans détour.** L\'auteur avançait qu\'une hausse des prix compenserait l\'injustice faite à ceux qui sont hors du dispositif. Le calcul dit autre chose : '
           f'la hausse transfère chaque année environ {e(gain_vendeurs, 0)} Md€ des acheteurs vers les vendeurs. Elle est payée par la foncière (donc par sa dette, '
           f'{e(paie_fonc, 1)} Md€), par les jeunes entrants ({e(paie_entr, 1)} Md€, étalés sur leur mensualité) et surtout par tous les autres acheteurs '
           f'({e(paie_autres, 1)} Md€), parmi lesquels les jeunes hors dispositif qui achètent après 35 ans ou à la banque. Elle profite à ceux qui possèdent déjà : '
           'les propriétaires en place, plus âgés et plus riches, et les bailleurs qui vendent. Les « hors dispositif » qui possèdent déjà y gagnent ; ceux qui ne '
           'possèdent pas encore (locataires de plus de 35 ans, jeunes sans emploi stable, Parisiens) y perdent. **La hausse ne compense pas l\'injustice : elle la '
           'déplace vers ceux qui n\'ont pas de patrimoine, et elle enrichit les propriétaires en place.** Côté loyers : les entrants qui auraient loué '
           f'libèrent environ {e(sortants_location / 1000, 0)} 000 logements par an, les bailleurs qui vendent en retirent {e(retires / 1000, 0)} 000 (moyenne des dix '
           f'premières années) : effet sur les loyers de marché de l\'ordre de {sg(effet_loyers)} par an d\'écart (réponse des loyers ≈ 1,5, Friggit, ⚠️ ordre de '
           'grandeur), à ajouter à la baisse directe du plafond pour les logements concernés.', '']
    js['transferts'] = dict(gain_vendeurs=gain_vendeurs, gain_stock=gain_stock, paie_fonciere=paie_fonc, paie_entrants=paie_entr, paie_autres=paie_autres,
                            perte_loyer_md=perte_loyer / 1e9, perte_energie_md=perte_energie / 1e9, impot_fonciers_md=impot_fonciers, effet_loyers=effet_loyers)

    # ------------------------------------------------------------------ 6. finances publiques
    md += ['## 6. Finances publiques', '', '### 6.1 La foncière (fonciere-usufruit/code/fonciere.py, mode « forfait », non modifié)', '',
           'Entrants de la section 2 (contrats, âges, prix moyen, apport moyen = capital + part bancaire) ; montée linéaire sur 10 ans ; sans viagers ni dations '
           '(H-FA42). Coût de l\'argent : 3,5 % (central de la foncière), 4,7 % (OAT exogène) et 5,3 % (OAT 2032 endogène, `taux-endogene`). Test des 50 % : '
           'plus bas de la moyenne sur 3 ans du ratio intérêts reçus / (intérêts payés + gestion + impayés), de l\'an 5 à l\'an 30 et à l\'an 60.', '']
    lig = []
    for (f, d), g in grille_f.items():
        for i in (0.035, 0.047, 0.053, '047s'):
            bb = g['b'][i]
            lab = '4,7 % (taux bancaire suit)' if i == '047s' else pp(i, 1)
            lig.append([pp(f, 0), str(d), lab, e(bb['besoin10'], 0), e(bb['dette10'], 0), e(bb['dette30'], 0), pp(bb['dette_pib30'], 0),
                        pp(bb['ratio_min30'], 0), pp(bb['ratio_min60'], 0), e(bb['etat30'], 0)])
    md.append(tab(['f', 'Durée', 'Coût de l\'argent', 'Besoin an 10 (Md€)', 'Dette an 10', 'Dette an 30', 'Dette an 30 (% PIB)', 'Ratio min 5-30 ans',
                   'Ratio min 5-60 ans', 'Coût cumulé pour l\'État an 30 (gestion − aides évitées)'], lig))
    # seuils
    lig = []
    js['seuils'] = {}
    for (f, d) in ((0.85, 25), (0.85, 30), (0.70, 25)):
        g = grille_f[(f, d)]
        for i in (0.035, 0.047):
            p = FI.params_fonciere(g['ev']['r'], A.reglage(f=f, duree=d), i=i)
            s30, s60 = FI.seuils(p, C.q, 30), FI.seuils(p, C.q, 60)
            js['seuils'][f'{f}_{d}_{i}'] = dict(a30=s30, a60=s60)
            fmt = lambda x, k: '—' if x is None else (pp(x, 1) if k == 'forfait' else (e(100 * x, 2) + ' pt' if k == 'marge' else e(x, 0) + ' Md€'))
            lig.append([pp(f, 0), str(d), pp(i, 1)] + [fmt(s30[k], k) for k in ('forfait', 'marge', 'livret')] + [fmt(s60[k], k) for k in ('forfait', 'marge', 'livret')])
    md += ['', 'Ce qu\'il faut pour couvrir plus de la moitié des coûts (un levier à la fois ; entrants tenus fixes : un forfait plus haut ferait venir moins de '
           'monde, ce qui aide aussi) — « — » : la borne (forfait 100 %, marge 8 points, livret 3 000 Md€) n\'y suffit pas :', '',
           tab(['f', 'Durée', 'Coût de l\'argent', 'Forfait, 30 ans', 'Marge de taux, 30 ans', 'Livret foncier à 2 %, 30 ans', 'Forfait, 60 ans',
                'Marge de taux, 60 ans', 'Livret foncier, 60 ans'], lig)]
    b85 = grille_f[(0.85, 25)]['b']
    md += ['', f'**Lecture.** À f = 85 % et 25 ans, au coût de l\'argent de 3,5 %, la dette de la foncière atteint {e(b85[0.035]["dette30"], 0)} Md€ à 30 ans '
           f'({pp(b85[0.035]["dette_pib30"], 0)} du PIB) ; à 4,7 %, {e(b85[0.047]["dette30"], 0)} Md€. Le test des 50 % ({pp(b85[0.035]["ratio_min30"], 0)} au plus bas sur 30 ans) '
           'est raté de peu à 3,5 % et largement à 4,7 % ou 5,3 % : la foncière prête au taux bancaire un argent qui lui coûte autant ou plus, et porte la '
           'nue-propriété à crédit. Le forfait surévalué crée une marge en capital (elle revient au décès), pas en trésorerie. **À 4,7 %, aucun forfait ne suffit sur '
           '60 ans** ; il faut une marge de taux de l\'ordre d\'un à deux points, ou un livret foncier de plusieurs centaines de milliards d\'euros. Si la foncière reste '
           'dans les administrations publiques, sa dette compte dans la dette publique.', '']
    js['fonciere'] = {f'{f}_{d}': {str(i): g['b'][i] for i in g['b']} for (f, d), g in grille_f.items()}

    # 6.2 capital et recettes
    rD = r
    non_add = rD['contrats'] * rD['A']['F_banque'] * (1 - h['alpha']) / rD['part_F']
    dmto_perdus = non_add * rD['prix_contrat'] * h['taux_dmto'] / 1e9
    dmto_gagnes = gain_vendeurs * h['taux_dmto']
    contrib = rD['contrats'] * rD['prix_contrat'] * 0.0025 / 1e9
    md += ['', '### 6.2 Capital versé, recettes touchées (central, Md€ par an)', '',
           tab(['Poste', 'Md€ par an', 'Remarque'], [
               ['Capital de départ apporté dans les achats', e(rD['cout_apports_md'], 1), 'dépense de l\'État, quel que soit le canal'],
               ['Parts à vie (moitié du capital) pour qui n\'entre pas', e(rD['cout_parts_md'], 1), 'dont les jeunes sans emploi stable avant 36 ans'],
               ['Total capital', e(rD['cout_capital_md'], 1), f'plafond retenu : {e(h["cout_public_max_md"], 1)} Md€ (option D du chapitre 3)'],
               ['Droits de mutation perdus (droit actuel : achats de la foncière exonérés qui auraient eu lieu)', e(dmto_perdus, 2), 'nuls si les droits sont supprimés'],
               ['Droits de mutation gagnés sur la hausse des prix (droit actuel)', e(dmto_gagnes, 2), ''],
               ['Contribution sur la résidence principale payée par une cohorte d\'entrants', e(contrib, 2), 'remplace la taxe foncière : pas une recette nouvelle'],
               ['Impôt sur les revenus fonciers perdu (plafond de loyer, pleine relocation)', e(impot_fonciers, 1), f'taux {pp(h["taux_imposition_fonciers"], 0)} ⚠️'],
               ['Aides au logement évitées, an 30 / an 60', f'{e(b["aide30"], 2)} / {e(b["aide60"], 2)}', 'après remboursement seulement (H-CO31)'],
               ['Gestion de la foncière payée par l\'État, an 30', e(b['gestion30'], 1), '300 € par contrat (H-FU25)'],
           ]), '',
           '**Lecture.** Le capital de départ coûte à peu près ce que coûtait la garantie du chapitre 3 ; il n\'est simplement plus versé en argent. Les aides au logement '
           'évitées restent faibles pendant 25 ans (elles ne cessent qu\'après le remboursement) et ne couvrent pas la gestion. Le plafond de loyer coûte de l\'impôt sur '
           'les revenus fonciers. La recette qui compte, à terme, est le patrimoine de la foncière (les logements qui reviennent au décès), qui ne se voit pas dans le budget annuel.', '']
    js['recettes'] = dict(capital=rD['cout_capital_md'], apports=rD['cout_apports_md'], parts=rD['cout_parts_md'], dmto_perdus=dmto_perdus,
                          dmto_gagnes=dmto_gagnes, contribution=contrib, impot_fonciers=impot_fonciers, aide30=b['aide30'], aide60=b['aide60'])

    # 6.3 prix négocié par le jeune : surpaiement, collusion, valeur de référence
    lig = [[pp(x, 0), e(FI.surpaiement(r, base['reg'], x)['fonciere_md'], 2), e(FI.surpaiement(r, base['reg'], x)['jeunes_md'], 2),
            e(FI.surpaiement(r, base['reg'], x)['mensualite'], 0)] for x in h['surpaiement']]
    lig2 = [[pp(t, 0), pp(FI.regle_reference(h['sigma_reference'], t)['bloquees'], 0), pp(t, 0)] for t in (0.05, 0.10, 0.15, 0.20)]
    md += ['', '### 6.3 C\'est le jeune qui négocie : surpaiement et prix gonflés', '',
           'Le jeune trouve le bien et négocie ; la foncière entre dans la transaction. Le capital étant fixe, chaque euro de prix en plus coûte f au jeune (sur sa '
           'mensualité) et 1 − f à la foncière.', '', tab(['Surpaiement moyen', 'Coût pour la foncière (Md€/an)', 'Coût pour les jeunes (Md€/an)', 'Mensualité en plus (€/mois)'], lig), '',
           'Règle « la foncière ne finance que jusqu\'à une valeur de référence indépendante × (1 + tolérance) » (prix réel dispersé de 10 % autour de la référence, ⚠️) :', '',
           tab(['Tolérance', 'Transactions honnêtes bloquées (au-delà, le jeune paie comptant)', 'Prix gonflé encore finançable'], lig2), '',
           f'**Lecture.** L\'incitation à négocier est forte (85 % de chaque euro pour le jeune), mais pas entière. Le risque sérieux est le **prix gonflé d\'un commun accord** : '
           f'une partie du prix rendue de la main à la main au jeune revient à sortir son capital en argent, et la foncière paie {pp(1 - F_CENTRAL, 0)} de chaque euro gonflé. '
           'La valeur de référence (ventes DVF comparables, évaluation indépendante) borne ce gonflement à la tolérance choisie, au prix de transactions honnêtes bloquées ; '
           'une tolérance de 10 à 15 % paraît un compromis, avec contrôle a posteriori.', '']

    # 6.4 sortie des bailleurs : risque repris
    v1 = V[0]['detail']['classe']
    pass_fg = sum(sum(V[t]['detail']['classe'][c] for c in 'FG') for t in range(10)) / 10
    prix_moy = sum(C.S[s]['prix_T2'] * h['part_secteur'][s] for s in SECT)
    decote = h['decote_passoire']['appartement']
    reno = h['cout_renovation_m2'] * 40
    m1 = base['mondes']['reforme']
    m3 = base['mondes']['deux']
    val_bailleurs = {s: sum(base['On10'][s][g] for g in OP.SEG) * C.S[s]['prix_T2'] for s in SECT}
    transfert_soutien = sum(max(0.0, m3[s]['moyenne'] - m1[s]['moyenne']) * val_bailleurs[s] for s in SECT) / 1e9
    ancien_monde = sum(max(0.0, -m1[s]['moyenne']) * val_bailleurs[s] for s in SECT) / 1e9
    md += ['', '### 6.4 La « sortie honnête » des bailleurs : ce que la collectivité reprend', '',
           tab(['Poste (central, par an, dix premières années)', 'Valeur'], [
               ['Passoires (F, G) mises en vente par les bailleurs', e(pass_fg / 1000, 0) + ' 000'],
               ['Décote d\'un appartement G par rapport à D (notaires, 2024)', pp(decote, 0)],
               [f'Coût de rénovation d\'un T2 de 40 m² ({e(h["cout_renovation_m2"], 0)} €/m², ⚠️)', e(reno, 0) + ' €, soit ' + pp(reno / prix_moy, 0) + ' du prix moyen d\'un T2'],
               ['Hausse des prix due à la présence de la foncière, sur les ventes des bailleurs (transfert aux vendeurs : monde 3 − monde 1)', e(transfert_soutien, 1) + ' Md€'],
               ['Si la foncière payait les prix « d\'avant la réforme » (sans la baisse du monde 1)', e(ancien_monde, 1) + ' Md€ de plus'],
           ]), '',
           f'**Lecture.** La décote des passoires ({pp(decote, 0)}) couvre à peu près le coût de leur rénovation ({pp(reno / prix_moy, 0)} du prix d\'un T2) : acheter une passoire '
           'au prix du marché et la rénover n\'est ni une bonne ni une mauvaise affaire en soi. Le risque repris est celui des prix : la foncière achète au moment où la '
           'réforme fait baisser les prix, et sa présence les soutient. Ce soutien est un transfert aux bailleurs qui vendent '
           f'(≈ {e(transfert_soutien, 1)} Md€ par an au central). **Sortie honnête** = la foncière (ou le jeune) achète au prix de marché constaté, jamais au-dessus d\'une '
           f'évaluation indépendante ; **rachat avantageux** = acheter aux prix d\'avant la réforme, soit ≈ {e(ancien_monde, 1)} Md€ de plus par an versés aux vendeurs. '
           'L\'auteur, bailleur, est du côté de ceux qui reçoivent ce transfert.', '']
    js['sortie'] = dict(passoires_par_an=pass_fg, transfert_soutien=transfert_soutien, ancien_monde=ancien_monde)

    # ------------------------------------------------------------------ 7. réglages
    md += ['## 7. Les réglages', '', '### 7.1 Un nombre de droits « neutre en prix » qui suit l\'offre des bailleurs', '',
           'Le levier n\'est pas un volume d\'achats (le jeune choisit le bien), mais le **nombre de droits ouverts par an**. Droits neutres : nombre d\'entrants tel que '
           'l\'effet net moyen du secteur (demande des entrants − offre nette des bailleurs) vaille +2 %, secteur par secteur.', '']
    # demande additionnelle par entrant et par segment ; secteur sans entrants (Paris) : pas de droits (neutralité sans objet)
    Dpe = {s: {g: (base['D'][s][g] / r['secteurs'][s]['jeunes_F'] if r['secteurs'][s]['jeunes_F'] > 1000 else 0.0) for g in OP.SEG} for s in SECT}
    lig = []
    js['neutre'] = {}
    for fac in (1.0, 0.5, 1.5):
        Vf = OP.ventes_bailleurs(C.off, h, facteur=fac) if fac != 1.0 else V
        for t in (0, 1, 2, 4, 6, 9, 14):
            On = OP.offre_nette(Vf[t])
            dn = OP.droits_neutres(Dpe, On, base['Q'], h)
            tot_d = sum(dn.values())
            lig.append([f'×{e(fac, 1)}', str(2027 + t)] + [('—' if sum(Dpe[s].values()) == 0 else e(dn[s] / 1000, 0) + ' k') for s in SECT] +
                       [e(tot_d / 1000, 0) + ' k', pp(min(1.0, tot_d / r['jeunes_F']), 0)])
            js['neutre'][f'{fac}_{t}'] = dn
    md.append(tab(['Offre des bailleurs', 'Année', 'Paris', 'Métropoles', 'Villes moyennes', 'Rural', 'Droits par an', 'Part de la demande servie'], lig))
    n0, n9 = sum(js['neutre']['1.0_0'].values()), sum(js['neutre']['1.0_9'].values())
    n0b, n0h = sum(js['neutre']['0.5_0'].values()), sum(js['neutre']['1.5_0'].values())
    md += ['', f'**Lecture.** Les « bons poids » existent, mais ils baissent vite : pour rester à +2 %, on peut ouvrir de l\'ordre de {e(n0 / 1000, 0)} 000 droits '
           f'la première année, quand les bailleurs vendent beaucoup, puis {e(n9 / 1000, 0)} 000 à l\'an 10, la vague de relocations passée (et quand la suppression '
           f'de l\'interdiction des E retire de l\'offre par rapport au droit actuel), pour une demande d\'environ {e(r["jeunes_F"] / 1000, 0)} 000 jeunes par an. '
           f'Si les bailleurs vendent deux fois moins que prévu, la première année tombe à {e(n0b / 1000, 0)} 000 ; une fois et demie plus, elle monte à {e(n0h / 1000, 0)} 000. '
           'La bande de 2 % autorise à elle seule une part importante de ces droits. Paris ne reçoit pas de droits (inaccessible) tandis que ses bailleurs vendent. '
           'Le système « se tient » donc au sens où le nombre de droits peut suivre la sortie des bailleurs sans faire monter les prix au-delà de la bande, mais à un rythme '
           'qui retombe bien en dessous de la demande des jeunes après quelques années : le plafond d\'entrées devient le vrai réglage politique.', '']

    # 7.2 grille
    md += ['', '### 7.2 Le réglage qui maximise l\'accès des jeunes qui héritent peu, sous contraintes', '',
           f'Contraintes (central, foncière seule, en régime) : hausse des prix ≤ 5 % dans chaque secteur ; test des 50 % tenu de l\'an 5 à l\'an 30 (argent à 3,5 %) ; '
           f'capital ≤ {e(h["cout_public_max_md"], 1)} Md€ par an. Critère : part propriétaire ou usufruitière à 35 ans de la moitié qui hérite le moins. Plafond d\'entrées servi '
           'par ordre d\'héritage croissant (publics prioritaires).', '']
    grille = []
    for f in (0.70, 0.80, 0.85, 0.90):
        for d in (25, 30):
            for marge in (0.0, 0.01, 0.02):
                for quota in (None, 0.03, 0.06, 0.10, 0.15, 0.20, 0.25):
                    reg = A.reglage(f=f, duree=d, marge=marge, quota=quota)
                    rr = A.agreger(reg, h, C.her, C.S, C.q)
                    Dg = OP.demande_fonciere(rr)
                    mg = OP.effet_prix(Dg, OP.zero(), base['Q'], h)
                    pmax = max(mg[s]['moyenne'] for s in SECT)
                    bb = FI.bilan(FI.simuler(FI.params_fonciere(rr, reg), C.q)) if rr['contrats'] > 0 else None
                    grille.append(dict(f=f, d=d, marge=marge, quota=quota, D15=rr['proprio_D15'], tous=rr['proprio'], jeunes=rr['jeunes_F'],
                                       pmax=pmax, ratio30=bb['ratio_min30'] if bb else None, ratio60=bb['ratio_min60'] if bb else None,
                                       cout=rr['cout_capital_md'], dette30=bb['dette30'] if bb else 0.0))
    ok = [g for g in grille if g['pmax'] <= 0.05 and g['ratio30'] and g['ratio30'] > 0.5 and g['cout'] <= h['cout_public_max_md']]
    best = max(ok, key=lambda g: g['D15']) if ok else None
    fr = []
    for cap in (0.02, 0.03, 0.05, 0.08, 0.10, 0.15, 1.0):
        oks = [g for g in grille if g['pmax'] <= cap and g['ratio30'] and g['ratio30'] > 0.5 and g['cout'] <= h['cout_public_max_md']]
        bg = max(oks, key=lambda g: g['D15']) if oks else None
        oks2 = [g for g in grille if g['pmax'] <= cap and g['cout'] <= h['cout_public_max_md']]
        bg2 = max(oks2, key=lambda g: g['D15']) if oks2 else None
        fr.append(['sans plafond' if cap == 1.0 else pp(cap, 0)] +
                  ([pp(bg['f'], 0), str(bg['d']), e(100 * bg['marge'], 0) + ' pt', '—' if bg['quota'] is None else pp(bg['quota'], 0),
                    e(bg['jeunes'] / 1000, 0) + ' k', pp(bg['D15'], 0), sg(bg['pmax']), pp(bg['ratio30'], 0), e(bg['dette30'], 0)] if bg else ['aucun'] + [''] * 8) +
                  ([pp(bg2['D15'], 0)] if bg2 else ['—']))
    md.append(tab(['Hausse maximale admise', 'f', 'Durée', 'Marge', 'Plafond d\'entrées (part d\'une génération)', 'Jeunes par an', 'Propriétaires à 35 ans, moitié qui hérite le moins',
                   'Hausse (secteur le plus touché)', 'Ratio min 30 ans', 'Dette an 30 (Md€)', 'idem sans la contrainte des 50 %'], fr))
    sans = r['sans_D15']
    md += ['', f'Sans dispositif, la moitié qui hérite le moins est propriétaire à 35 ans à {pp(sans, 0)}. ' +
           (f'**Réglage retenu sous les trois contraintes** : f = {pp(best["f"], 0)}, {best["d"]} ans, marge de {e(100 * best["marge"], 0)} point(s), plafond d\'entrées de '
            f'{"—" if best["quota"] is None else pp(best["quota"], 0)} d\'une génération ({e(best["jeunes"] / 1000, 0)} 000 jeunes par an, servis par héritage croissant) : '
            f'{pp(best["D15"], 0)} de propriétaires dans la moitié qui hérite le moins, hausse de {sg(best["pmax"])}, ratio {pp(best["ratio30"], 0)}, dette de {e(best["dette30"], 0)} Md€ à 30 ans.'
            if best else '**Aucun réglage de la grille ne tient les trois contraintes.**'), '',
           '**Lecture.** La frontière est raide : chaque point de hausse des prix admis « achète » quelques points d\'accès pour les moins dotés. La contrainte qui mord est '
           'celle des prix ; elle impose un plafond d\'entrées bas, très en dessous de la demande. Le test des 50 % impose ensuite une marge de taux d\'au moins un point, '
           'ce qui rapproche la mensualité de celle d\'un prêt bancaire et écarte des ménages modestes. Servir d\'abord ceux qui héritent le moins rend le plafond efficace '
           'pour le critère choisi, mais crée un effet de seuil et un risque de déclarations d\'héritage arrangées.', '']
    js['grille'] = grille
    js['meilleur'] = best

    # 7.3 transition
    nF_age = {a: v * r['jeunes_F'] for a, v in ((a, 0.0) for a, _ in r['ages_contrats'])}
    tot_c = sum(v for _, v in r['ages_contrats'])
    nF_age = {a: v / tot_c * r['jeunes_F'] for a, v in r['ages_contrats']}
    q_nb = (r['A']['F_nb'] + r['A']['F_appel']) / r['part_F']
    lig = []
    js['transition'] = {}
    pc_ = r['contrats'] / r['jeunes_F']
    for nom, cible, ans in (('Sans plafond, ouverture en 5 ans', r['jeunes_F'], 5), ('Sans plafond, ouverture en 10 ans', r['jeunes_F'], 10),
                            ('Plafond retenu (7.2), ouverture en 8 ans', (best['jeunes'] if best else r['jeunes_F']), 8)):
        cap = A.O.capacite_rampe(cible, ans, 0.1, horizon=60)
        gens, chemin = A.O.transition(nF_age, q_nb, cap, regle='report', age_report=40, horizon=60)
        pic = max(chemin) / r['jeunes_F']
        prix_pic = hf * max(chemin) / r['jeunes_F']
        servis = sum(g['servis'] for g in gens.values())
        att = sum(g['attente'] * g['servis'] for g in gens.values()) / servis if servis else 0
        perdus = sum(g['perdus'] for g in gens.values())
        sim = FI.simuler(FI.params_fonciere(r, base['reg']), C.q, [x * pc_ for x in chemin])
        bb = FI.bilan(sim)
        lig.append([nom, e(chemin[0] / 1000, 0) + ' k', e(chemin[4] / 1000, 0) + ' k', e(chemin[9] / 1000, 0) + ' k', e(pic, 2), sg(prix_pic), e(att, 1),
                    e(perdus / 1000, 0) + ' k', e(bb['dette30'], 0)])
        js['transition'][nom] = dict(chemin=chemin, pic=pic, attente=att, perdus=perdus)
    md += ['', '### 7.3 L\'ouverture par cercles (bâtisseurs 3 000 par an pendant deux ans, puis montée)', '',
           'Au lancement, les 25-35 ans déjà en emploi stable sans logement à eux attendent (H-CO27, `capital-de-depart-options`) ; droit conservé jusqu\'à 40 ans ; '
           'les plus âgés d\'abord. Hausse des prix au pic : effet de la section 4 (secteur hors Paris le plus touché) × entrées du pic / entrées de régime.', '',
           tab(['Mise en place', 'Entrées an 1', 'an 5', 'an 10', 'Pic / régime', 'Hausse des prix au pic', 'Attente moyenne (ans)', 'Droits perdus', 'Dette an 30 (Md€)'], lig), '',
           '**Lecture.** Sans plafond, la file du lancement (les générations de 25 à 35 ans qui n\'ont pas pu acheter) fait dépasser le régime pendant plusieurs années : '
           'la hausse des prix y est plus forte qu\'en régime. Un plafond fixé à l\'avance et une montée lente l\'évitent, au prix d\'une attente.', '']

    # ------------------------------------------------------------------ 8. décalage géographique et de taille
    lig = []
    for s in SECT:
        for g in OP.SEG:
            o, dd = base['On10'][s][g], base['D'][s][g]
            dom = 'offre des bailleurs (baisse)' if o > dd * 1.2 else ('demande des jeunes (hausse)' if dd > o * 1.2 else 'à peu près équilibré')
            lig.append([NS[s], g, e(o / 1000, 1) + ' k', e(dd / 1000, 1) + ' k', dom])
    md += ['## 8. Les logements que vendent les bailleurs sont-ils ceux que veulent les jeunes ?', '',
           'Offre nette de la réforme (moyenne des dix premières années) et demande additionnelle de la foncière en régime, par secteur et taille :', '',
           tab(['Secteur', 'Taille', 'Offre des bailleurs', 'Demande des jeunes', 'Qui domine'], lig), '',
           '**Lecture.** Les bailleurs vendent surtout à Paris et dans les métropoles, des petites surfaces, souvent mal classées ; les jeunes demandent surtout en villes '
           'moyennes et dans les métropoles, des T2 mais aussi des T3 et T4 (familles, montée en gamme). Le décalage est donc double : **à Paris, l\'offre domine** '
           '(baisse des prix) parce que les jeunes ne peuvent pas y entrer ; **en villes moyennes et dans le rural, la demande domine** (hausse). Comme c\'est le jeune '
           'qui choisit le bien, l\'appariement se fait là où les deux se croisent (métropoles, petites surfaces), sans garantie ailleurs. La foncière peut l\'aider en '
           'préemptant avec les communes, mais elle ne stocke pas de logements vides : son parc ne se constitue qu\'au rythme des entrées.', '']

    # ------------------------------------------------------------------ 9. sensibilité
    md += ['## 9. Quelle hypothèse porte le résultat ? (tornade)', '',
           'Chaque hypothèse passe seule à sa valeur basse puis haute, les autres au central (f = 85 %, 25 ans). Mesures : jeunes par an, hausse des prix (foncière '
           'seule, secteur hors Paris le plus touché), effet net des deux réformes (même secteur), dette de la foncière à 30 ans.', '']
    noms = (('W', 'Part qui veut se fixer (H-FA11)'), ('prec', 'Refus bancaire (H-FA12)'), ('r_np', 'Valeur de la nue-propriété pour le jeune (H-FA13)'),
            ('phi', 'Prime de liberté (H-FA13)'), ('appel', 'Effet d\'appel (H-FA16)'), ('adh', 'Adhérents (H-FA16)'), ('montee', 'Montée en gamme (H-FA14)'),
            ('alpha', 'Additionnalité des bancarisés (H-FA17)'), ('k_revenu', 'Revenus (H-FA3)'), ('ages_parts', 'Âge au premier emploi stable (H-FA2)'),
            ('part_secteur', 'Répartition des jeunes par secteur (H-FA7)'), ('elasticite_offre', 'Élasticité de l\'offre (H-FA21)'),
            ('sigma_substitution', 'Diffusion entre tailles (H-FA22)'), ('ecart_taille', 'Écart de réponse selon la taille (H-FA22)'),
            ('transactions', 'Ventes annuelles (H-FA20)'), ('v_vente', 'Part des bailleurs qui vendent (H-FA33)'), ('rotation', 'Rotation locative (H-FA31)'),
            ('niches_retroactif', 'Suppression des avantages en cours (H-FA34)'), ('ecart_banque_usufruit', 'Surcoût du prêt bancaire sur usufruit (H-FA15)'),
            ('i_fonciere', 'Coût de l\'argent de la foncière (H-FA41)'))
    ref = (r['jeunes_F'], hf, max_hors_paris(base['mondes']['deux']), b['dette30'])
    tor = []
    for cle, lib in noms:
        vals = []
        for sc in ('bas', 'haut'):
            v = C.P[cle].get(sc, C.P[cle]['central'])
            if cle == 'i_fonciere':
                ev = evaluer(C, i=v)
            else:
                ev = evaluer(C, sur={cle: v})
            vals.append((ev['r']['jeunes_F'], max_hors_paris(ev['mondes']['fonciere']), max_hors_paris(ev['mondes']['deux']), ev['b']['dette30']))
        amp = abs(vals[1][1] - vals[0][1])
        tor.append((amp, lib, vals))
    tor.sort(key=lambda x: -x[0])
    lig = []
    for amp, lib, vals in tor:
        lig.append([lib, f'{e(vals[0][0] / 1000, 0)} k / {e(vals[1][0] / 1000, 0)} k', f'{sg(vals[0][1])} / {sg(vals[1][1])}', f'{sg(vals[0][2])} / {sg(vals[1][2])}',
                    f'{e(vals[0][3], 0)} / {e(vals[1][3], 0)}'])
    md += [tab(['Hypothèse (bas / haut)', 'Jeunes par an', 'Hausse des prix, foncière seule', 'Effet net des deux réformes', 'Dette an 30 (Md€)'], lig), '',
           f'Référence centrale : {e(ref[0] / 1000, 0)} k jeunes, {sg(ref[1])}, {sg(ref[2])}, {e(ref[3], 0)} Md€.', '',
           f'**Lecture.** Les hypothèses sont classées par leur effet sur la hausse des prix. L\'élasticité de l\'offre et la part qui veut se fixer portent l\'essentiel ; '
           'pour la dette, le coût de l\'argent domine ; pour l\'effet net des deux réformes, la part des bailleurs qui vendent (non sourcée) pèse autant que les élasticités. '
           'Les hypothèses les mieux sourcées (revenus, âge au premier emploi stable) pèsent moins que les hypothèses de comportement, qui ne le sont pas.', '']
    js['tornade'] = [dict(hypothese=lib, bas=vals[0], haut=vals[1]) for _, lib, vals in tor]

    # ------------------------------------------------------------------ 11. expérimentation, sortie, garantie, capacité
    md += ['## 11. Expérimentation, clause de sortie, garantie à la génération du lancement, capacité de rénovation', '',
           'Décisions de l\'auteur (09/11) : cinq ans d\'expérimentation avec des « bâtisseurs » d\'une vingtaine d\'années, en alternance dans la filière '
           'publique de rénovation, formés avec les fédérations compagnonniques ; ils rénovent leur logement (et ceux de leur promotion) et y entrent dès qu\'il '
           'est rénové, vers 21 ans ; critères d\'arrêt et de généralisation écrits d\'avance ; en cas d\'abandon, rachat de la nue-propriété ; garantie à ceux '
           'qui ont 20 ans au lancement. Hypothèses H-FA70 à H-FA84 (`methode.md`).', '']
    EX = {sc: dict(C.P['experimentation']['central'], **C.P['experimentation'].get(sc, {})) for sc in ('bas', 'central', 'haut')}
    ALT = C.P['alternance']['central']
    FIL = {sc: dict(C.P['filiere']['central'], **C.P['filiere'].get(sc, {})) for sc in ('bas', 'central', 'haut')}
    ex = EX['central']
    cap_bat = sum(d['cap'] for d in r['dec_h'][:5]) / 5          # capital moyen de la moitié qui hérite le moins
    smic = ALT['smic_brut']
    rev_alt1 = X.net_alternant(ALT['pct_20_an1'] * smic, smic)
    rev_alt2 = X.net_alternant(ALT['pct_21_an2'] * smic, smic)
    rev_alt3 = X.net_alternant(ALT['pct_21_an3'] * smic, smic)
    secteurs_exp = (('metropoles', 'Métropole (secteur tendu)'), ('villes_moyennes', 'Ville moyenne'), ('rural', 'Rural'))
    lig = []
    for ks, lib in secteurs_exp:
        c = X.cas_batisseur(ex, C.S[ks], F_CENTRAL, h['taux_banque'], 25, cap_bat)
        m = c['m'] + c['contrib']
        lig.append([lib, e(c['achat'], 0), e(c['travaux'], 0), e(c['L'], 0), e(c['m'], 0), pp(m / rev_alt2, 0), pp(m / rev_alt3, 0), pp(m / ex['revenu_sortie'], 0), e(c['loyer'], 0)])
    md += ['### 11.1 Le cas type d\'un bâtisseur (T2 de 40 m², passoire achetée 12 % sous le prix, rénovée en matériaux seulement)', '',
           f'Capital de départ : {e(cap_bat, 0)} € (moyenne de la moitié qui hérite le moins). Revenus nets : alternant de 20 ans, 1re année {e(rev_alt1, 0)} € ; '
           f'21 ans, 2e année {e(rev_alt2, 0)} €, 3e année {e(rev_alt3, 0)} € (barème légal, service-public F2918, contrats depuis le 01/03/2025) ; ouvrier qualifié à la sortie '
           f'{e(ex["revenu_sortie"], 0)} € (Céreq). Mensualités à 3,32 % sur 25 ans à partir de l\'entrée dans le logement.', '',
           tab(['Secteur', 'Achat (€)', 'Matériaux (€)', 'Financé par la foncière (€)', 'Mensualité (€)', 'Effort, alternant 2e année', 'Effort, alternant 3e année',
                'Effort, ouvrier qualifié', 'Loyer de marché (€)'], lig), '',
           '**Lecture.** En ville moyenne et dans le rural, la mensualité d\'un bâtisseur reste sous 35 % de son revenu, même pendant l\'alternance ; en métropole, elle '
           'dépasse 35 % tant qu\'il est alternant, et passe dessous une fois embauché. Le chantier comme lieu de formation baisse surtout le coût des travaux '
           '(main-d\'œuvre fournie par la promotion, déjà payée comme formation : pas de double compte).', '']
    # 11.1 bis deux régimes de revenus : système proposé et droit actuel ; reste à vivre
    RG = C.P['regimes_revenu']['central']
    lig = []
    for ks, lib in secteurs_exp:
        c = X.cas_batisseur(ex, C.S[ks], F_CENTRAL, h['taux_banque'], 25, cap_bat)
        loge_acc = c['m'] + c['contrib'] + ex['charges'] * c['X'] / 12
        for nomr, y in (('alternant 2e année', rev_alt2), ('ouvrier qualifié', ex['revenu_sortie'])):
            # système proposé : plancher de 877 €, part logement maintenue pendant le remboursement (H-CO31)
            y_sys = max(RG['plancher'], y + A.O.aide_logement(y))
            # droit actuel : APL du locataire ; rien pour l'accédant (APL accession supprimée en 2018)
            apl = RG['apl_locataire'] if y < 1300 else RG['apl_locataire'] * max(0.0, 1 - (y - 1300) / 600)
            # décision de l'auteur : l'aide est maintenue pendant l'accession dans l'expérimentation (loi d'expérimentation)
            lig.append([lib, nomr, e(loge_acc, 0), e(c['loyer'], 0),
                        e(y_sys - loge_acc, 0), e(y_sys - c['loyer'], 0), pp(loge_acc / y_sys, 0),
                        e(y + apl - loge_acc, 0), e(y + apl - c['loyer'], 0), pp(loge_acc / (y + apl), 0), e(y - loge_acc, 0), e(12 * apl, 0)])
    md += ['Deux régimes de revenus (€ par mois) : **système proposé** (revenu complété jusqu\'au plancher de 877 €, part logement de 250 € retirée avec le revenu '
           'et maintenue pendant le remboursement, H-FA75 ; la fonction des revenus du chapitre 4 n\'est pas dans la copie : approximation) ; **droit actuel** '
           '(aide au logement du locataire, ⚠️ montant non calculé au barème ; aucune aide pour un accédant depuis 2018). Coût du logement en accession = mensualité + '
           'contribution + entretien.', '',
           tab(['Secteur', 'Revenu', 'Coût en accession', 'Loyer du même logement', 'Système : reste à vivre en accession', 'Système : reste à vivre en location',
                'Système : effort en accession', 'Droit actuel, aide maintenue : reste à vivre en accession', 'Droit actuel : en location (aide comprise)',
                'Droit actuel : effort en accession', 'Sensibilité : reste à vivre si l\'aide était perdue', 'Coût du maintien de l\'aide (€ par jeune et par an)'], lig), '',
           '**Lecture.** La bonne comparaison est mensualité contre loyer : dans les trois secteurs, le bâtisseur garde plus en accédant qu\'en louant, dans les deux '
           'régimes ; le taux d\'effort dépasse pourtant 35 % en métropole pendant l\'alternance, ce qui montre que ce critère bancaire est mal adapté à un revenu qui va monter. '
           f'Hypothèse centrale (décision de l\'auteur) : l\'aide au logement est maintenue pendant l\'accession, par la loi d\'expérimentation, alors que le droit '
           f'actuel ne la verse plus aux accédants depuis 2018 ; son maintien coûte de l\'ordre de {e(12 * RG["apl_locataire"], 0)} € par jeune et par an pendant '
           f'l\'alternance, soit ≈ {e(12 * RG["apl_locataire"] * 1000 / 1e6, 1)} M€ par an pour une promotion de 1 000 (moins ensuite, l\'aide baissant avec le salaire). '
           'Ce n\'est pas un coût net : en location, le même jeune la toucherait aussi. Si elle était perdue (sensibilité), le reste à vivre baisse d\'autant.', '']
    # 11.2 coûts et dette
    lig = []
    js['experimentation'] = {}
    for n_an in (300, 1000, 3000):
        for ks, lib in secteurs_exp:
            for sc in ('central',):
                k = X.couts_experimentation(dict(EX[sc]), C.S[ks], n_an, F_CENTRAL, h['taux_banque'], 25, cap_bat, 0.035)
                lig.append([e(n_an, 0), lib, e(k['logements'], 0), e(k['formation'] / 1e6, 0), e(k['capital'] / 1e6, 0), e(k['gestion'] / 1e6, 0),
                            e(k['cout_public'] / 1e6, 0), e(k['dette'] / 1e6, 0), e(k['mensualites'] / 1e6, 0)])
                js['experimentation'][f'{n_an}_{ks}'] = {kk: v for kk, v in k.items() if kk != 'cas'}
    kb = X.couts_experimentation(dict(EX['bas']), C.S['villes_moyennes'], 1000, F_CENTRAL, h['taux_banque'], 25, cap_bat, 0.035)
    kh = X.couts_experimentation(dict(EX['haut']), C.S['villes_moyennes'], 1000, F_CENTRAL, h['taux_banque'], 25, cap_bat, 0.035)
    md += ['### 11.2 Coût et dette d\'une expérimentation de cinq ans (M€ cumulés, central)', '',
           tab(['Jeunes par an', 'Territoire', 'Logements', 'Formation (coût net, batisseurs-et-repas)', 'Capital de départ', 'Gestion et accompagnement',
                'Coût public total', 'Dette de la foncière au bout de 5 ans', 'Mensualités reçues'], lig), '',
           f'Ville moyenne, 1 000 jeunes par an : coût public {e(kb["cout_public"] / 1e6, 0)} à {e(kh["cout_public"] / 1e6, 0)} M€ (bas–haut ; chantier de 6 à 18 mois, '
           'formation nette de 5 à 92 k€ par formé). **La formation est le premier poste du coût public** ; la dette de la foncière, de 75 à 110 k€ par logement selon le '
           'secteur, est adossée aux logements et aux créances sur les jeunes.', '']
    # 11.2 bis une seule ville
    VT = C.P['villes_types']['central']
    lig = []
    js['une_ville'] = {}
    for nomv, lib, promo in (('metropole_regionale', 'Métropole régionale (exemple : Grenoble)', 300), ('ville_moyenne', 'Ville moyenne', 100), ('petite_ville', 'Petite ville', 30)):
        v = VT[nomv]
        k = X.couts_experimentation(dict(ex), C.S[v['secteur']], promo, F_CENTRAL, h['taux_banque'], 25, cap_bat, 0.035)
        efg_ville = v['residences_principales'] * 0.30
        effet = h['reponse_prix'][v['secteur']] * promo / v['ventes']
        lig.append([lib, e(promo, 0), e(v['ventes'], 0), pp(promo / v['ventes'], 1), e(efg_ville, 0), pp(promo / efg_ville, 1), sg(effet),
                    e(k['cout_public'] / 1e6, 0), e(k['dette'] / 1e6, 0)])
        js['une_ville'][nomv] = dict(promo=promo, part_ventes=promo / v['ventes'], effet=effet, cout=k['cout_public'], dette=k['dette'])
    md += ['### 11.2 bis Une seule ville, avec son institut de formation (résultat principal ; ville non choisie)', '',
           'Promotion réaliste pour un institut qui démarre (⚠️ hypothèse), logements rénovés par an rapportés aux ventes annuelles et au stock de logements E, F, G '
           '(30 % des résidences principales) d\'une ville type (⚠️ ordres de grandeur à remplacer par les données DVF et du recensement de la ville choisie).', '',
           tab(['Ville', 'Promotion par an', 'Ventes par an', 'Part des ventes', 'Logements E-F-G', 'Part du stock E-F-G rénovée par an', 'Effet attendu sur les prix',
                'Coût public sur 5 ans (M€)', 'Dette de la foncière à 5 ans (M€)'], lig), '',
           '**Lecture.** Dans une seule ville, la promotion représente quelques pour cent des ventes : l\'effet attendu sur les prix est de l\'ordre d\'un à quelques '
           'points, ce qui peut se voir dans une petite ville (où il peut aussi faire monter les prix) mais se confond avec le bruit dans une métropole. Une seule ville '
           '**ne permet pas** de comparer marchés tendus et détendus, et les résultats peuvent tenir à la ville choisie (marché, municipalité, entreprises locales). '
           'Elle permet de mesurer la formation, les chantiers, les impayés, l\'énergie et la tenue des comptes. **Critères de choix proposés** : une ville moyenne '
           '(là où la demande des jeunes pèsera le plus après généralisation) ; part de logements E-F-G au-dessus de la moyenne ; une implantation compagnonnique existante ; '
           'des ventes DVF suffisantes pour un indice de prix fiable ; une **ville témoin** de même taille, même zone, même tendance de prix sur 5 ans et même part de '
           'passoires, sans dispositif, choisie et publiée avant le lancement. Les variantes à plusieurs territoires (ci-dessous) restent la référence pour comparer.', '']
    # 11.2 ter Grenoble, cas principal
    import csv as _csv
    with open(os.path.join(RACINE, 'donnees', 'grenoble.csv'), encoding='utf-8') as f_:
        lignes_ = [l for l in f_ if not l.startswith('#')]
    GR = {row['zone']: row for row in _csv.DictReader(lignes_)}
    g_ = GR['grenoble']
    cnt = {c: 0.0 for c in 'ABCDEFG'}
    for row in C.off['dpe']:
        if row['zone'] == 'grenoble' and row['type_batiment'] == 'appartement':
            cnt[row['classe']] += float(row['n_dpe'])
    efg_gre = sum(cnt[c] for c in 'EFG') / sum(cnt.values())
    sect_gre = dict(C.S['metropoles'], prix_T2=float(g_['prix_T2']), loyer_m2_app12=15.671)
    cg = X.cas_batisseur(ex, sect_gre, F_CENTRAL, h['taux_banque'], 25, cap_bat)
    kg = X.couts_experimentation(dict(ex), sect_gre, 300, F_CENTRAL, h['taux_banque'], 25, cap_bat, 0.035)
    CP = C.P['copropriete']['central']
    lig = [[NS_ for NS_ in (z_, e(float(GR[k_]['ventes']), 0), pp(float(GR[k_]['part_appartements']), 0), e(float(GR[k_]['prix_m2_app']), 0),
            e(float(GR[k_]['prix_T1']), 0), e(float(GR[k_]['prix_T2']), 0), e(float(GR[k_]['prix_T3']), 0), e(float(GR[k_]['prix_T4']), 0))]
           for k_, z_ in (('grenoble', 'Grenoble (commune)'), ('metropole_grenoble', 'Grenoble-Alpes Métropole (22 communes principales)'),
                          ('clermont_ferrand', 'Clermont-Ferrand'), ('dijon', 'Dijon'))]
    lig.append(['Médiane des grandes métropoles (secteur du modèle)', e(C.S['metropoles']['ventes'], 0), '—', e(C.S['metropoles']['prix_m2_app'], 0),
                e(C.S['metropoles']['prix_T1'], 0), e(C.S['metropoles']['prix_T2'], 0), e(C.S['metropoles']['prix_T3'], 0), e(C.S['metropoles']['prix_T4'], 0)])
    rdt_g = 15.671 * 12 / float(g_['prix_m2_app'])
    rdt_m = C.S['metropoles']['loyer_m2_app12'] * 12 / C.S['metropoles']['prix_m2_app']
    md += ['### 11.2 ter Un exemple chiffré parmi d\'autres : Grenoble (la ville n\'est pas choisie)', '',
           'La règle fixée par l\'auteur est seulement : une ville candidate, volontaire, de taille intermédiaire de préférence, qui dispose de locaux pour la formation. '
           'Grenoble est un exemple avec des données réelles, pas un choix. Quelle que soit la ville, la foncière n\'achète aucun bien d\'un responsable du projet '
           'ni de ses proches pendant l\'expérimentation, ou seulement sous évaluation indépendante publiée.', '',
           'Ventes d\'un seul logement en 2024 (DVF, `donnees/grenoble.csv`, prix médians en €) :', '',
           tab(['Zone', 'Ventes', 'Part d\'appartements', 'Prix/m² appartement', 'T1', 'T2', 'T3', 'T4'], lig), '',
           f'À Grenoble, le m² d\'appartement ({e(float(g_["prix_m2_app"]), 0)} €) est au niveau des villes moyennes, sous la médiane des grandes métropoles '
           f'({e(C.S["metropoles"]["prix_m2_app"], 0)} €), voisin de Dijon et au-dessus de Clermont-Ferrand ; loyer d\'annonce 15,7 €/m² (rendement brut ≈ {pp(rdt_g, 1)} contre '
           f'{pp(rdt_m, 1)} en médiane des métropoles) ; {pp(efg_gre, 0)} des DPE d\'appartements récents en E, F ou G. Bâtisseur : achat {e(cg["achat"], 0)} €, mensualité '
           f'{e(cg["m"], 0)} € contre un loyer de {e(cg["loyer"], 0)} € ; une promotion de 300 par an ferait {pp(300 / float(g_["ventes"]), 0)} des ventes d\'un seul logement de la commune '
           f'(coût public sur 5 ans {e(kg["cout_public"] / 1e6, 0)} M€). En une phrase pour chaque point local : dans une ville d\'appartements en copropriété, le rénovateur ne '
           'traite seul que l\'intérieur (isolation intérieure, ventilation, chauffage individuel), l\'enveloppe relève d\'un vote, ce qui limite le gain à une ou deux classes '
           'sauf achat d\'un immeuble entier ; l\'encadrement des loyers s\'y applique déjà en partie (Service-public F1314, via `loyers-energie`) ; la ville témoin se choisit '
           'et se publie avant le lancement, de même taille et de même tendance de prix.', '']
    # 11.3 ce que l'on peut mesurer
    lig = []
    js['detection'] = {}
    for n_an in (300, 1000, 3000):
        for nc in (10, 30, 100):
            trans_commune = 1500.0       # ventes annuelles d'une commune moyenne de ville moyenne (ordre de grandeur, DVF ⚠️)
            add = n_an * r['seg'][('villes_moyennes', 'T2')]['add'] / max(1.0, r['seg'][('villes_moyennes', 'T2')]['contrats'])
            effet = h['reponse_prix']['villes_moyennes'] * add / (nc * trans_commune)
            mde = X.effet_detectable(ex['sigma_prix_commune'], nc, 2 * nc)
            lig.append([e(n_an, 0), str(nc), sg(effet), pp(mde), 'oui' if effet > mde else 'non'])
            js['detection'][f'{n_an}_{nc}'] = dict(effet=effet, mde=mde)
    n5 = {n: n * 4 for n in (300, 1000, 3000)}      # contrats-années observés (≈ 4 ans de mensualités pour la 1re promotion, moins ensuite : ordre de grandeur)
    md += ['### 11.3 Ce que cinq ans permettent d\'apprendre', '',
           'Prix locaux : effet attendu (demande des bâtisseurs / ventes des communes traitées × réponse du prix) comparé au plus petit effet détectable (communes '
           'témoins deux fois plus nombreuses, écart-type des évolutions communales de 6 % ⚠️, risque 5 %, puissance 80 %).', '',
           tab(['Jeunes par an', 'Communes traitées', 'Effet attendu sur les prix', 'Plus petit effet détectable', 'Détectable ?'], lig), '',
           tab(['Indicateur', '300 / an', '1 000 / an', '3 000 / an', 'Remarque'], [
               ['Impayés (précision à ±, taux annuel de 1 %)'] + [pp(X.precision_proportion(ex['defaut_annuel'], n5[n]), 2) for n in (300, 1000, 3000)] + ['contrats-années ≈ 4 × promotion'],
               ['Emploi à la sortie (précision à ±, 65 %)'] + [pp(X.precision_proportion(ex['emploi_sortie'], n * 3), 1) for n in (300, 1000, 3000)] + ['trois promotions sorties ; sans groupe témoin tiré au sort, l\'effet propre n\'est pas mesurable'],
               ['Achèvement de la formation (précision à ±, 70 %)'] + [pp(X.precision_proportion(ex['achevement'], n * 4), 1) for n in (300, 1000, 3000)] + [''],
               ['Énergie économisée'] + ['mesurable logement par logement'] * 3 + ['relevés avant et après ; l\'écart réel est souvent moitié du conventionnel (H16 de batisseurs-et-repas)'],
               ['Part des coûts couverte (test des 50 %)'] + ['comptable, exacte'] * 3 + ['mais à l\'échelle d\'essai : ne dit rien du coût de l\'argent d\'une foncière de 500 Md€'],
           ]), '',
           '**Lecture, franchement.** Avec 300 à 3 000 jeunes par an, l\'expérimentation peut mesurer les impayés, l\'achèvement de la formation, l\'emploi à la sortie '
           '(à condition de tirer au sort entre candidats pour avoir un groupe témoin), l\'énergie économisée et la tenue des comptes. Elle **ne peut pas** mesurer l\'effet '
           'sur les prix d\'un dispositif ouvert à un tiers d\'une génération : à cette échelle, l\'effet local est sous le seuil de détection dès qu\'on répartit les '
           'bâtisseurs sur plus de quelques communes, et s\'il est détectable c\'est qu\'on les a concentrés (ce qui fait monter les prix localement). Elle ne dit rien '
           'non plus de l\'effet d\'appel, du comportement des banques, ni du coût de l\'argent à grande échelle. Ces trois points se décident sur modèle, pas sur essai.', '']
    # 11.4 sortie
    part_np = 1 - U.valeur_usufruit(U.survies(C.q, 26, 2032, 0.01), FI.F.taux_tarif(FI.F.params('central')))
    ex2 = dict(ex, part_np=part_np)
    lig, lig2 = [], []
    js['sortie_variantes'] = {}
    c_vm = X.cas_batisseur(ex, C.S['villes_moyennes'], F_CENTRAL, h['taux_banque'], 25, cap_bat)
    for k in (3, 5, 10):
        o = X.sortie(ex2, c_vm, k, h['taux_banque'], 25, cap_bat, F_CENTRAL, 0.035, ex['croissance_prix'], ex['croissance_revenu'], ex['revenu_sortie'])
        js['sortie_variantes'][k] = o
        lig.append([str(k), e(o['1']['jeune'], 0), e(o['1']['collectivite'], 0), e(o['2']['jeune'], 0), e(o['2']['collectivite'], 0), e(o['2']['rachat'], 0),
                    e(o['2']['m_etale'], 0), pp(o['2']['effort_etale'], 0), e(o['3']['jeune'], 0), e(o['3']['collectivite'], 0)])
    cel = A.cellules(base['reg'], h, C.her, C.S, C.q)
    parts_dep = {k: X.part_effort_rachat(cel, base['reg'], h, k, ex['croissance_prix'], ex['croissance_revenu'], C.S) for k in (3, 5, 10)}
    for ks, lib in secteurs_exp:
        c = X.cas_batisseur(ex, C.S[ks], F_CENTRAL, h['taux_banque'], 25, cap_bat)
        o = X.sortie(ex2, c, 5, h['taux_banque'], 25, cap_bat, F_CENTRAL, 0.035, ex['croissance_prix'], ex['croissance_revenu'], ex['revenu_sortie'])
        lig2.append([lib, e(c['m'], 0), e(o['2']['rachat'], 0), e(o['2']['m_etale'], 0), pp(o['2']['effort_etale'], 0)])
    md += ['### 11.4 Clause de sortie en cas d\'abandon (règle retenue : variante 2)', '',
           'Cas type du bâtisseur en ville moyenne, € de l\'année de sortie. « Jeune » = ce qu\'il a gagné ou perdu par rapport à la location du même logement pendant '
           'ces années (loyers évités − mensualités, contribution et entretien payés, + valeur acquise) ; « collectivité » = position nette de la foncière et de l\'État '
           '(dette de portage, capital versé, ce qui est récupéré). (1) contrat honoré jusqu\'au décès ; (2) **rachat de la nue-propriété au prix fixé à l\'entrée '
           '((1 − f) × transaction) et remboursement du capital de départ**, le jeune devient propriétaire ordinaire ; (2 bis) même rachat étalé sur la durée restante '
           'du contrat aux mêmes conditions ; (3) revente et solde : le jeune récupère le capital remboursé et la valeur de ses travaux.', '',
           tab(['Années de mensualités', '(1) jeune', '(1) collectivité', '(2) jeune', '(2) collectivité', '(2) somme du rachat', '(2 bis) mensualité étalée',
                '(2 bis) effort', '(3) jeune', '(3) collectivité'], lig), '',
           'Rachat étalé après 5 ans, par secteur (bâtisseur, ouvrier qualifié) :', '',
           tab(['Secteur', 'Mensualité avant', 'Somme du rachat', 'Mensualité après rachat étalé', 'Effort'], lig2), '',
           f'Part des entrants du dispositif généralisé (section 2) pour qui la mensualité du rachat étalé dépasserait 35 % du revenu : après 3 ans {pp(parts_dep[3], 0)}, '
           f'après 5 ans {pp(parts_dep[5], 0)}, après 10 ans {pp(parts_dep[10], 0)} (revenus +{pp(ex["croissance_revenu"], 1)} par an ⚠️). Pour eux, la règle doit prévoir le '
           '**maintien du droit signé** (variante 1).', '',
           '**Lecture.** La variante 2 est la plus favorable au jeune quand les prix ont monté (il rachète à un prix fixé à l\'entrée) et elle rembourse la collectivité '
           'de ce qu\'elle a avancé ; c\'est aussi la plus coûteuse en manque à gagner pour la collectivité, qui cède la hausse des prix au jeune. Son point faible est '
           'celui qu\'a relevé l\'auteur : le jeune que les banques refusaient ne peut pas financer d\'un coup le rachat ; étalé par la foncière (ou l\'organisme qui lui '
           'succède), il fait monter la mensualité de près de moitié, au-delà de 35 % pour une part notable : ceux-là gardent leur droit d\'usufruit. La variante 3 '
           'ne lèse pas le jeune sur ses travaux mais le fait déménager ; la variante 1 laisse un parc public s\'éteindre sur 60 ans. Dans tous les cas, la '
           'compétence acquise reste au jeune.', '']
    # 11.5 garantie à la génération du lancement
    nF_age2 = {a: v / tot_c * r['jeunes_F'] for a, v in r['ages_contrats']}
    lig = []
    js['garantie'] = {}
    best_j = best['jeunes'] if best else r['jeunes_F']
    for nom, cible, ans in (('Capacité = demande + 10 %, montée 5 ans', r['jeunes_F'], 5), ('Capacité = demande + 10 %, montée 10 ans', r['jeunes_F'], 10),
                            ('Plafond « prix » (7.2), montée 8 ans', best_j, 8)):
        capg = A.O.capacite_rampe(cible, ans, 0.1, horizon=60)
        gens, chemin = A.O.transition(nF_age2, q_nb, capg, regle='entrantes', age_max=200, horizon=60)
        fl = A.O.file_attente(nF_age2, q_nb, capg, regle='entrantes', age_max=200, horizon=60)
        g25 = gens[25]
        suiv = [gens[a] for a in range(-10, 25)]
        dr25 = g25['servis'] / r['jeunes_F']
        drs = sum(g['servis'] for g in suiv) / (len(suiv) * r['jeunes_F'])
        att_s = sum(g['attente'] * g['servis'] for g in suiv) / max(1e-9, sum(g['servis'] for g in suiv))
        fin = next((t + 1 for t in range(ans, len(fl)) if fl[t] < 0.01 * r['jeunes_F']), None)
        sim = FI.simuler(FI.params_fonciere(r, base['reg']), C.q, [x * pc_ for x in chemin])
        cap5 = sum(chemin[:5]) * r['apport_contrat'] * pc_ / 1e9
        bes5 = sum(sim[t]['besoin_md'] for t in range(5))
        lig.append([nom, pp(dr25, 0), e(g25['attente'], 1), pp(drs, 0), e(att_s, 1), e(max(chemin) / 1000, 0) + ' k', str(fin or '> 60'), e(cap5, 1), e(bes5, 0)])
        js['garantie'][nom] = dict(droit_20ans=dr25, attente_20ans=g25['attente'], droit_suivantes=drs, attente_suivantes=att_s, pic=max(chemin), fin_file=fin, capital5=cap5, besoin5=bes5)
    exclus = sum(nF_age2[a] for a in nF_age2) * q_nb * 15 * 0.8
    md += ['### 11.5 La garantie à ceux qui ont 20 ans au lancement', '',
           'Règle : si l\'expérimentation aboutit (généralisation à l\'an 5), tous ceux qui avaient 20 ans ou moins au lancement (25 ans ou moins à la généralisation) '
           'ont droit au dispositif ; **le droit ne s\'éteint jamais du seul fait de la file** (borne d\'âge suspendue pendant l\'attente) ; un jeune non servi peut '
           'choisir à tout moment la forme adossée (moitié du capital en parts à vie). Transition de `capital-de-depart-options` (fonction `transition`, règle '
           '« générations entrantes », borne d\'âge levée), entrants de la section 2.', '',
           tab(['Capacité d\'entrée', 'Droit réalisé, génération des 20 ans', 'Attente moyenne (ans)', 'Droit réalisé, générations suivantes (moyenne)',
                'Attente moyenne', 'Pic d\'entrées par an', 'File résorbée (année)', 'Capital, 5 premières années (Md€)', 'Besoin de financement, 5 premières années (Md€)'], lig), '',
           f'**Lecture.** Si la capacité suit la demande (≈ {e(r["jeunes_F"] / 1000, 0)} 000 jeunes par an), la génération des 20 ans est servie (le reste avait acheté à la banque) '
           'après deux à trois ans d\'attente, et les suivantes aussi ; mais c\'est le scénario de la section 4, avec sa hausse des prix. **Avec le plafond « prix » de la section 7.2**, '
           'la génération des 20 ans est encore servie, parce que les plus âgés passent en premier et que son droit ne s\'éteint pas (attente de l\'ordre de cinq ans) ; '
           'ce sont **les générations suivantes qui paient la promesse** : un peu plus d\'un quart seulement de leur demande est servi, après des décennies d\'attente, la file ne '
           'se résorbant jamais. Tenir la promesse sans casser le plafond suppose que la plupart des générations suivantes prennent la forme adossée (parts à vie) au lieu du '
           'logement. Il faut donc choisir, et le dire avant '
           f'le lancement : promettre l\'accès à tous et accepter la hausse des prix, ou plafonner et promettre seulement un droit à attendre. Ceux qui avaient 21 à 35 ans '
           f'au lancement sont hors promesse : de l\'ordre de {e(exclus / 1e6, 1)} million de jeunes qui auraient demandé (sans accès bancaire) ; les inclure coûterait '
           f'environ {e(exclus * r["apport_contrat"] * pc_ / 1e9, 0)} Md€ de capital de départ et autant de file d\'attente en plus.', '']
    # 11.6 capacité de rénovation
    lig = []
    js['capacite'] = {}
    for promo in (300, 1000, 3000):
        for sc in ('bas', 'central', 'haut'):
            fl_ = FIL[sc]
            promos = [promo] * 5 + [promo] * 15
            act = X.batisseurs_actifs(promos, fl_['maintien'], fl_['departs'], 20)
            ent = X.entrees_permises(act, 1 / fl_['etp_par_renovation'], fl_['part_a_renover'], pc_)
            lig.append([e(promo, 0), sc, e(act[4], 0), e(ent[4] / 1000, 1) + ' k', e(act[9], 0), e(ent[9] / 1000, 1) + ' k', e(act[19], 0), e(ent[19] / 1000, 1) + ' k',
                        'capacité' if ent[9] < best_j else 'prix'])
            js['capacite'][f'{promo}_{sc}'] = dict(actifs=act, entrees=ent)
    lig3 = []
    for part in (0.05, 0.10, 0.20):
        pr = X.promotion_necessaire(part, h['cohorte'], pc_, FIL['central']['part_a_renover'], 1 / FIL['central']['etp_par_renovation'], FIL['central']['maintien'], FIL['central']['departs'])
        lig3.append([pp(part, 0), e(part * h['cohorte'] / 1000, 0) + ' k', e(pr['stock'], 0), e(pr['promotion'], 0)])
    cp = C.P['compagnons']['central']
    md += ['### 11.6 La capacité de rénovation comme contrainte de l\'ouverture', '',
           f'Une rénovation d\'ampleur demande {e(FIL["central"]["etp_par_renovation"], 2)} année-ETP (H5 de batisseurs-et-repas, 0,28 à 0,45, ⚠️ V32308) ; {pp(FIL["central"]["maintien"], 0)} '
           f'des formés restent dans la filière un an après, puis {pp(FIL["central"]["departs"], 0)} partent chaque année (H14, H15) ; {pp(FIL["central"]["part_a_renover"], 0)} des '
           'logements entrants sont à rénover (E, F, G ; 15 % si seuls F et G). Promotions constantes à partir du lancement.', '',
           tab(['Promotion par an', 'Scénario', 'Bâtisseurs actifs an 5', 'Entrées permises an 5', 'an 10', 'Entrées an 10', 'an 20', 'Entrées an 20',
                'Ce qui limite à l\'an 10 (capacité ou prix)'], lig), '',
           tab(['Ouverture visée (part d\'une génération)', 'Jeunes par an', 'Bâtisseurs nécessaires', 'Promotion annuelle en régime'], lig3), '',
           f'**Lecture.** Le plafond « prix » de la section 7.2 ({e(best_j / 1000, 0)} 000 jeunes par an) est atteint par la capacité de rénovation avec des promotions de '
           'l\'ordre de 1 000 à 3 000 par an, au bout de cinq à dix ans : **au début, c\'est la capacité qui limite ; ensuite, ce sont les prix.** Pour ouvrir à 10 ou 20 % '
           'd\'une génération, il faut des promotions de plusieurs milliers par an pendant dix ans. Repère : les Compagnons du Devoir forment plus de '
           f'{e(cp["jeunes_formes_an"], 0)} jeunes par an dans 35 métiers et ont signé {e(cp["nouveaux_contrats_an"], 0)} nouveaux contrats en juin 2024 (sources d\'acteur, C ; '
           'part du bâtiment non publiée ; Fédération et Union compagnonniques non chiffrées ⚠️). Une promotion de 300 par an est réaliste dès le départ ; 1 000 demanderait '
           'd\'absorber de l\'ordre de 40 % de leurs entrées annuelles, donc une montée sur plusieurs années ; 3 000 dépasse leurs entrées actuelles et suppose d\'autres '
           'organismes (centres de formation du bâtiment, AFPA). Ne pas confondre avec l\'association Compagnons Bâtisseurs (auto-réhabilitation accompagnée).', '']
    # 11.7 seuils
    sb, sh = scen['bas'], scen['haut']
    bb_ = FI.bilan(FI.simuler(FI.params_fonciere(sb['r'], base['reg']), C.q))
    bh_ = FI.bilan(FI.simuler(FI.params_fonciere(sh['r'], base['reg'], i=0.047), C.q))
    md += ['### 11.7 Seuils écrits d\'avance (proposition)', '',
           tab(['Indicateur', 'Généraliser si', 'Arrêter si', 'D\'où viennent les bornes'], [
               ['Part des coûts couverte par les recettes (moyenne sur 3 ans)', '≥ 50 %', '< 35 %',
                f'test d\'Eurostat ; au central {pp(b["ratio_min30"], 0)}, au bas {pp(bb_["ratio_min30"], 0)}, au haut (argent à 4,7 %) {pp(bh_["ratio_min30"], 0)}'],
               ['Impayés (perte annuelle sur l\'encours)', '≤ 0,5 %', '> 1 %', 'H-FU27 (0,2 / 0,5 / 1 %)'],
               ['Écart de prix avec les communes témoins', '≤ +2 %', '> +5 %', 'bande neutre (7.1) et contrainte de prix (7.2) ; à n\'utiliser que si la taille rend l\'écart détectable (11.3)'],
               ['Achèvement de la formation', '≥ 70 %', '< 50 %', '⚠️ non sourcé (ruptures de contrats d\'apprentissage : Dares, non relu)'],
               ['Emploi à la sortie (6 mois)', '≥ 65 %', '< 50 %', '⚠️ ordre de grandeur de l\'insertion des apprentis, non relu ; groupe témoin tiré au sort'],
               ['Énergie économisée réelle / conventionnelle', '≥ 50 %', '< 30 %', 'H16 de batisseurs-et-repas (0,7 / 0,5 / 0,3)'],
           ]), '',
           '**Lecture.** Le seul seuil que l\'expérimentation ne peut pas tester honnêtement est celui des prix à grande échelle (11.3) : il faut l\'écrire comme une '
           'règle de pilotage de la généralisation (le plafond d\'entrées baisse si l\'écart avec les communes témoins dépasse la borne), pas comme un critère d\'essai.', '']

    # ------------------------------------------------------------------ 10. limites
    md += ['## 12. Ce que ces chiffres ne disent pas', '',
           '- Ce sont des **effets de niveau** atteints en 5 à 10 ans, pas une trajectoire ; ni récession, ni choc de taux, ni construction induite au-delà de l\'élasticité.',
           '- Les comportements (vouloir se fixer, refus bancaires, ventes des bailleurs, montée en gamme) sont des règles de décision, pas des estimations : les parts '
           'sont des hypothèses mises en forme.',
           '- Le plafond de loyer est pris du scénario central de `loyers-energie` (cinq villes témoins), étendu aux secteurs ; la contribution sur le patrimoine '
           'des bailleurs (chapitre 3) n\'est pas modélisée et pourrait faire vendre bien plus.',
           '- La foncière est simulée avec un prix moyen national (fonciere.py) ; les prix montent dans la section 4 mais la simulation financière ne les reprend pas '
           '(une hausse de 10 % des prix d\'achat augmente la dette d\'environ 10 % × (1 − f) des achats, et la valeur des logements rendus).',
           '- Paris : presque personne n\'entre ; les conclusions sur Paris portent sur la réforme locative.', '']

    # ------------------------------------------------------------------ dix lignes
    best_txt = (f'f = {pp(best["f"], 0)}, {best["d"]} ans, marge {e(100 * best["marge"], 0)} pt, plafond {("—" if best["quota"] is None else pp(best["quota"], 0))} d\'une génération '
                f'({e(best["jeunes"] / 1000, 0)} 000 jeunes par an) : {pp(best["D15"], 0)} de propriétaires dans la moitié qui hérite le moins (contre {pp(sans, 0)})') if best else 'aucun réglage ne tient les trois contraintes'
    s85 = js['seuils']['0.85_25_0.035']
    dix = ['## Dix lignes', '',
           f'1. **Afflux** : à f = 85 % (25 ans), environ {e(r["jeunes_F"] / 1000, 0)} 000 jeunes par an (bas–haut {e(scen["bas"]["r"]["jeunes_F"] / 1000, 0)} 000 à {e(scen["haut"]["r"]["jeunes_F"] / 1000, 0)} 000), '
           f'{pp(r["contrats"] / h["transactions"], 0)} des ventes de logements ; à 70 %, {e(g70["jeunes_F"] / 1000, 0)} 000. Porté par la part qui veut se fixer et l\'accès bancaire (hypothèses).',
           f'2. **Déclencheur** : {pp(1 - jamais, 0)} d\'une génération a un emploi stable avant 36 ans (≈ {e(sum(a * w for a, w in ages) / (1 - jamais), 1)} ans en moyenne, inférence sur le Céreq) ; les autres sont hors dispositif.',
           f'3. **Accès** : propriétaires ou usufruitiers à 35 ans de {pp(r["proprio_sans"], 0)} à {pp(r["proprio"], 0)} ; moitié qui hérite le moins : de {pp(r["sans_D15"], 0)} à {pp(r["proprio_D15"], 0)}. Paris reste dehors ; le premier décile de revenu entre moins.',
           f'4. **Prix, foncière seule** : {sg(base["mondes"]["fonciere"]["villes_moyennes"]["moyenne"])} en villes moyennes, {sg(base["mondes"]["fonciere"]["metropoles"]["moyenne"])} en métropoles '
           f'(bas–haut {sg(max_hors_paris(scen["bas"]["mondes"]["fonciere"]))} à {sg(max_hors_paris(scen["haut"]["mondes"]["fonciere"]))} dans le secteur le plus touché). Porté par l\'élasticité de l\'offre (0,3-0,5, études françaises).',
           f'5. **Hausse limitée parce que les surfaces sont modestes ?** : vrai en euros (les T1-T2 font {pp(part_val_petits, 0)} de la valeur des ventes), faux en pourcentage sur le segment des jeunes '
           f'(jusqu\'à {sg(max(mF[s]["T1-T2"] for s in HORS_PARIS))} sur les T1-T2 hors Paris).',
           f'6. **Réforme locative** : {e(cum10 / 1000, 0)} 000 ventes de bailleurs sur dix ans (hypothèse non sourcée) ; elle fait baisser les prix à Paris et dans les métropoles, '
           'atténue la foncière les premières années, surtout dans les métropoles, mais la vague de ventes est passée quand la foncière atteint son régime. Le plafond mord par son seuil de 120 %, peu par l\'énergie.',
           f'7. **La hausse compense-t-elle l\'injustice ?** Non. Elle transfère ≈ {e(gain_vendeurs, 0)} Md€ par an des acheteurs (foncière, jeunes, autres acheteurs) vers les vendeurs '
           'et enrichit les propriétaires en place ; ceux qui n\'ont rien la paient.',
           f'8. **Foncière** : dette ≈ {e(b85[0.035]["dette30"], 0)} Md€ à 30 ans à 3,5 % ({e(b85[0.047]["dette30"], 0)} à 4,7 %) ; test des 50 % raté ({pp(b85[0.035]["ratio_min30"], 0)}). '
           f'Il faut un forfait de {pp(s85["a30"]["forfait"], 0) if s85["a30"]["forfait"] else "—"} ou une marge de {e(100 * s85["a30"]["marge"], 1) if s85["a30"]["marge"] is not None else "—"} pt sur 30 ans ; '
           f'{pp(s85["a60"]["forfait"], 0) if s85["a60"]["forfait"] else "aucun forfait"} ou {e(100 * s85["a60"]["marge"], 1) if s85["a60"]["marge"] is not None else "—"} pt sur 60 ans ; à 4,7 %, beaucoup plus.',
           f'9. **Réglage sous contraintes** (prix ≤ 5 %, 50 % sur 30 ans, capital ≤ 14,7 Md€) : {best_txt}. La contrainte de prix impose un plafond d\'entrées bas.',
           '10. **Fragile** : la part des bailleurs qui vendent, l\'effet d\'appel et la ventilation des élasticités par zone ne sont mesurés par aucune étude ; '
           'la Banque de France (2026) et l\'OCDE contredisent l\'idée d\'un soutien à l\'achat sans hausse des prix. Un point de taux pèse autant que la mesure.', '']
    md[pos_dix:pos_dix] = dix

    with open(os.path.join(RACINE, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(md) + '\n')

    def nettoyer(x):
        if isinstance(x, dict):
            return {str(k): nettoyer(v) for k, v in x.items()}
        if isinstance(x, (list, tuple)):
            return [nettoyer(v) for v in x]
        if isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
            return None
        return x
    with open(os.path.join(RACINE, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(nettoyer(js), f, ensure_ascii=False, indent=1)
    print('écrit resultats.md et donnees/resultats.json')


if __name__ == '__main__':
    main()
