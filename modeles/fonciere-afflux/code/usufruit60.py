#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Schéma « usufruit à 60 %, sans capital de départ » (décision de l'auteur du 11/11/2026) : chiffrage national.
Usage (racine de l'atelier) : python3 -I modeles/fonciere-afflux/code/usufruit60.py   (environ une à deux minutes)
Écrit resultats-usufruit-60.md et donnees/resultats-usufruit-60.json (générés : ne pas éditer à la main).

Écrit par Claude (IA d'Anthropic) pour l'auteur, 11/11/2026. Hypothèses H-FA90 à H-FA97 : methode.md § 4.6 ; le reste du
modèle (H-FA1 à H-FA85) est réutilisé tel quel. Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import json, os, subprocess, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import calculer as K        # noqa: E402  (évaluation complète du modèle, sans écrire resultats.md)
import afflux as A          # noqa: E402
import offre_prix as OP     # noqa: E402
import finances as FI       # noqa: E402

U = A.U
SECT, NS, HORS_PARIS = K.SECT, K.NS, K.HORS_PARIS
e, tab, pp, sg = K.e, K.tab, K.pp, K.sg
F60 = 0.60
I_CENTRAL = 0.035          # coût de l'argent central de la foncière (H-FA41)
T2032, T2038, T10, T20, T30 = 5, 11, 9, 19, 29
PLAFOND_COUT = 14.7        # Md€ par an : capital de départ du chapitre 3 (H-CO24, H-FA60), budget que le schéma remplace


def k_(x):
    return e(x / 1000, 0) + ' 000'


def sim_bilan(C, ev, i=None):
    reg = ev['reg']
    p = FI.params_fonciere(ev['r'], reg, i=i)
    sim = FI.simuler(p, C.q)
    return p, sim, FI.bilan(sim)


def indicateurs(C, ev, i=None):
    """Ce que la demande appelle pour un réglage évalué : afflux, prix, foncière, dette publique, avantage caché."""
    r, h, reg = ev['r'], ev['h'], ev['reg']
    p, sim, b = sim_bilan(C, ev, i)
    usu = {a: U.valeur_usufruit(U.survies(C.q, int(round(a)), 2027, 0.01), h['r_np']) for a, _ in r['ages_contrats']}
    av = FI.avantage_cache(r, reg, U.bareme_fiscal, usu)
    mq = {t: FI.maastricht(sim, t) for t in (T2032, T10, T2038, T20, T30)}
    for t in mq:
        mq[t]['deficit_md_2026'] = FI.deficit(sim, t)
        mq[t]['deficit_pts'] = FI.deficit(sim, t) * (1 + FI.F.COMMUN['pi']) ** (t + 1) / FI.pib(t)
    return dict(
        jeunes=r['jeunes_F'], contrats=r['contrats'], part_gen=r['part_F'], part_ventes=r['contrats'] / h['transactions'],
        prix_contrat=r['prix_contrat'], lf=r['lf_contrat'], banque=r['banque_contrat'], apport=r['apport_contrat'],
        proprio=r['proprio'], proprio_sans=r['proprio_sans'], D15=r['proprio_D15'], D15_sans=r['sans_D15'], F_D15=r['F_D15'],
        nb=r['A']['F_nb'] / r['part_F'] if r['part_F'] else 0.0, capital=r['cout_capital_md'],
        prix_f={s: ev['mondes']['fonciere'][s]['moyenne'] for s in SECT}, prix_2={s: ev['mondes']['deux'][s]['moyenne'] for s in SECT},
        pmax=max(ev['mondes']['fonciere'][s]['moyenne'] for s in SECT), pmax2=max(ev['mondes']['deux'][s]['moyenne'] for s in SECT),
        np10=FI.nue_propriete_payee(sim, T10), np2032=FI.nue_propriete_payee(sim, T2032),
        dette={a: sim[a - 1]['dette_md'] for a in (10, 20, 30)}, dette_pib={a: sim[a - 1]['dette_pib'] for a in (10, 20, 30)},
        besoin10=b['besoin10'], ratio30=b['ratio_min30'], ratio60=b['ratio_min60'],
        interets10=sim[T10]['interets_recus_md'], redevances10=sim[T10]['redevances_md'], contrib10=sim[T10]['contribution_md'],
        gestion10=sim[T10]['gestion_md'], aide10=sim[T10]['aide_evitee_md'], aide30=sim[T30]['aide_evitee_md'],
        interets_payes10=sim[T10]['interets_payes_md'], usu_vendu10=sim[T10]['usufruit_vendu_md'],
        maastricht={t: mq[t] for t in mq}, cout10=mq[T10]['md_2026'], avantage=av, p=p, sim=sim)


def mensualites(C, h, taux):
    """Cas types : mensualité du schéma (prêt de 60 % du prix sur 25 ans, sans apport) contre loyer, ancien schéma et
    prêt bancaire classique (H-FA97)."""
    lig, js = [], {}
    for s, t in (('metropoles', 'T2'), ('villes_moyennes', 'T2'), ('villes_moyennes', 'T3'), ('paris', 'T2')):
        S = C.S[s]
        P = S['prix_' + t]
        loyer = A.loyer_logement(S, t)
        contrib = U.TAUX_CONTRIBUTION_RP * P / 12
        entretien = h['charges'] * P / 12
        m60 = U.mensualite(F60 * P, taux, 25)
        m85_0 = U.mensualite(max(0.0, 0.85 * P - 40000.0), taux, 25)
        m85_h = U.mensualite(0.85 * P, taux, 25)
        mb = U.mensualite(0.9 * P, taux, 25)
        js[f'{s}_{t}'] = dict(prix=P, loyer=loyer, m60=m60, contrib=contrib, entretien=entretien, m85_sans_heritage=m85_0,
                              m85_heritier=m85_h, banque90=mb)
        lig.append([f'{t} {NS[s].lower()}', e(P, 0), e(loyer, 0), e(m60, 0), e(m60 + contrib + entretien, 0), e(m85_0, 0), e(m85_h, 0),
                    e(mb, 0), pp((m60 + contrib) / loyer, 0)])
    return lig, js


def main():
    C = K.Ctx()
    date = subprocess.run(['date', '+%d/%m/%Y'], capture_output=True, text=True).stdout.strip()
    js, md = {}, []

    # ---------------------------------------------------------------- évaluations
    reg60 = A.reglage_usufruit60()
    ev = {sc: K.evaluer(C, sc, reg=reg60, simuler=False) for sc in ('bas', 'central', 'haut')}
    I = {sc: indicateurs(C, ev[sc]) for sc in ev}
    c = I['central']
    h = ev['central']['h']
    ev_anc = K.evaluer(C, reg=A.reglage(), simuler=False)
    Ia = indicateurs(C, ev_anc)
    var = {}
    for nom, reg in (('banque', A.reglage_usufruit60(preteur='banque')), ('fonciere', A.reglage_usufruit60(preteur='fonciere'))):
        var[nom] = indicateurs(C, K.evaluer(C, reg=reg, simuler=False))
    var['i47'] = indicateurs(C, ev['central'], i=0.047)
    p60, sim60 = c['p'], c['sim']
    s30 = FI.seuils(p60, C.q, 30)
    s60 = FI.seuils(p60, C.q, 60)

    # grille de sensibilité : part d'usufruit × environnement de taux (H-FA94)
    grille = {}
    for f in (0.55, 0.60, 0.65, 0.70):
        for x in (0.033, 0.047):
            reg = A.reglage_usufruit60(f=f, taux=x)
            evg = K.evaluer(C, reg=reg, sur={'taux_banque': x}, simuler=False)
            grille[(f, x)] = indicateurs(C, evg, i=x)

    # réglage recommandé : f × marge × plafond d'entrées × prêteur, sous contraintes (H-FA97)
    cands = []
    for f in (0.55, 0.60, 0.65, 0.70):
        for marge in (0.0, 0.01, 0.02):
            for quota in (None, 0.03, 0.05, 0.08, 0.10, 0.12, 0.15, 0.20):
                for pret in ('mixte', 'banque'):
                    reg = A.reglage_usufruit60(f=f, marge=marge, quota=quota, preteur=pret)
                    evg = K.evaluer(C, reg=reg, simuler=False)
                    if evg['r']['contrats'] <= 0:
                        continue
                    ii = indicateurs(C, evg)
                    cands.append(dict(f=f, marge=marge, quota=quota, preteur=pret, D15=ii['D15'], proprio=ii['proprio'], jeunes=ii['jeunes'],
                                      contrats=ii['contrats'], pmax=ii['pmax'], ratio30=ii['ratio30'], cout10=ii['cout10'],
                                      m2032=ii['maastricht'][T2032]['pts_pib'], m2038=ii['maastricht'][T2038]['pts_pib'],
                                      dette30=ii['dette'][30], np10=ii['np10'], av_md=ii['avantage']['fiscal_md']))
    ok_prix = [g for g in cands if g['pmax'] <= 0.05 + 1e-9]
    ok_cout = [g for g in ok_prix if g['cout10'] <= PLAFOND_COUT]
    ok_tous = [g for g in ok_cout if g['ratio30'] > 0.5]
    best = max(ok_cout, key=lambda g: (round(g['D15'], 4), -g['cout10'])) if ok_cout else None
    best50 = max(ok_tous, key=lambda g: (round(g['D15'], 4), -g['cout10'])) if ok_tous else None
    # recommandation (H-FA97) : le réglage qui tient aussi le test des 50 %, s'il ne coûte pas plus d'un point d'accès
    # aux moins dotés ; sinon le meilleur sous les seules contraintes de prix et de coût
    ok60 = [g for g in ok_cout if abs(g['f'] - F60) < 1e-9]
    best60 = max(ok60, key=lambda g: (round(g['D15'], 4), -g['cout10'])) if ok60 else None
    ok60_50 = [g for g in ok60 if g['ratio30'] > 0.5]
    best60_50 = max(ok60_50, key=lambda g: (round(g['D15'], 4), -g['cout10'])) if ok60_50 else None
    reco = best50 if (best50 and best and best50['D15'] >= best['D15'] - 0.01) else best

    # ---------------------------------------------------------------- en-tête
    md += ['---', 'titre: Foncière du logement — schéma « usufruit à 60 %, sans capital de départ » (chiffrage national)',
           'statut: brouillon ; généré par code/usufruit60.py ; ne pas éditer à la main ; des ordres de grandeur sous hypothèses, jamais des prédictions',
           '---', '', '# Usufruit à 60 %, sans capital de départ : chiffrage national', '',
           f'**Écrit par Claude (IA d\'Anthropic) pour l\'auteur.** Généré le {date} par `python3 -I modeles/fonciere-afflux/code/usufruit60.py`. '
           'Hypothèses propres au schéma : H-FA90 à H-FA97 (`methode.md` § 4.6) ; tout le reste (population, revenus, choix, offre, prix, foncière) est le '
           'modèle `fonciere-afflux` inchangé (H-FA1 à H-FA85, `resultats.md`). Euros de 2026 sauf mention. Claude n\'a pas d\'intérêt financier connu dans le '
           'logement ; son biais connu est de vouloir aider l\'auteur.', '']
    pos_resume = len(md)

    # ---------------------------------------------------------------- 1. le schéma
    md += ['## 1. Le schéma chiffré', '',
           '- **Décision de l\'auteur (11/11/2026)** : le jeune achète l\'usufruit à vie d\'un logement qu\'il a trouvé, à **60 % de sa valeur** (travaux compris), '
           'sans apport, par un prêt sur 25 ans au taux bancaire (3,32 %, Banque de France, septembre 2026, A) ; la foncière paie la nue-propriété, **40 %** ; '
           '**plus de capital de départ** (ni les 40 000 € × e^(−héritage/80 000 €), ni les parts à vie pour qui n\'entre pas).',
           '- Inchangé : déclencheur au premier emploi stable, au plus tard à 35 ans ; une fois dans la vie ; contribution sur la résidence principale (0,25 % '
           'par an) ; effort ≤ 35 % ; montée d\'une taille ; financement mixte au-delà de 60 % du prix du T3 médian du secteur (H-FA15) ; plafond d\'entrées possible.',
           '- Qui prête les 60 % ? La décision laisse le choix (« prêt bancaire ou de la foncière »). Central : **mixte** (la foncière jusqu\'au plafond, '
           'une banque au-delà, H-FA92) ; variantes « tout par la foncière » et « tout par une banque » en section 4.', '']

    # ---------------------------------------------------------------- 2. afflux
    lig = []
    for sc in ('bas', 'central', 'haut'):
        x = I[sc]
        lig.append([sc, k_(x['jeunes']), pp(x['part_gen'], 0), k_(x['contrats']), pp(x['part_ventes'], 0), pp(x['nb'], 0),
                    pp(x['proprio'], 0), pp(x['proprio_sans'], 0), pp(x['D15'], 0), pp(x['D15_sans'], 0)])
    lig.append(['ancien schéma (85 % + capital), central', k_(Ia['jeunes']), pp(Ia['part_gen'], 0), k_(Ia['contrats']), pp(Ia['part_ventes'], 0),
                pp(Ia['nb'], 0), pp(Ia['proprio'], 0), pp(Ia['proprio_sans'], 0), pp(Ia['D15'], 0), pp(Ia['D15_sans'], 0)])
    md += ['## 2. Qui entre, combien', '',
           tab(['Scénario', 'Jeunes par an', 'Part d\'une génération', 'Contrats (ménages) par an', 'Part des ventes de logements', 'dont sans accès bancaire',
                'Propriétaires ou usufruitiers à 35 ans', 'sans dispositif', 'idem, moitié qui hérite le moins', 'sans dispositif'], lig), '']
    rc = ev['central']['r']
    lig = [['Entrent à la foncière'] + [pp(d['F'], 0) for d in rc['dec_y']],
           ['Propriétaires ou usufruitiers à 35 ans'] + [pp(d['proprio'], 0) for d in rc['dec_y']],
           ['sans dispositif'] + [pp(d['sans'], 0) for d in rc['dec_y']],
           ['Entrent (ancien schéma)'] + [pp(d['F'], 0) for d in ev_anc['r']['dec_y']]]
    md += ['Par décile de revenu au premier emploi stable (central) :', '', tab(['Décile de revenu'] + [f'D{k + 1}' for k in range(10)], lig), '']
    lig = [['Entrent à la foncière'] + [pp(d['F'], 0) for d in rc['dec_h']],
           ['Propriétaires ou usufruitiers à 35 ans'] + [pp(d['proprio'], 0) for d in rc['dec_h']],
           ['sans dispositif'] + [pp(d['sans'], 0) for d in rc['dec_h']],
           ['Entrent (ancien schéma)'] + [pp(d['F'], 0) for d in ev_anc['r']['dec_h']]]
    md += ['Par décile d\'héritage (D1 = qui hérite le moins ; central) :', '', tab(['Décile d\'héritage'] + [f'D{k + 1}' for k in range(10)], lig), '']
    md += [f'**Lecture.** Au central, environ **{k_(c["jeunes"])} jeunes par an** entrent (bas {k_(I["bas"]["jeunes"])}, haut {k_(I["haut"]["jeunes"])}), '
           f'soit {k_(c["contrats"])} contrats et **{pp(c["part_ventes"], 0)} des ventes annuelles de logements** ; c\'est {pp(c["jeunes"] / Ia["jeunes"] - 1, 0)} de plus '
           f'qu\'avec l\'ancien schéma ({k_(Ia["jeunes"])}). Sans apport à fournir, la mensualité sur 60 % du prix est plus basse que celle de l\'ancien schéma pour '
           'tous ceux qui héritent (leur capital était faible) et à peu près égale pour ceux qui n\'héritent pas (40 000 € d\'apport compensaient 25 points de prix) : '
           f'l\'ouverture se fait surtout chez les **héritiers**, qui viennent davantage. La moitié qui hérite le moins est propriétaire ou usufruitière à 35 ans à '
           f'{pp(c["D15"], 0)} (ancien schéma : {pp(Ia["D15"], 0)} ; sans dispositif : {pp(c["D15_sans"], 0)}) : **le gain pour les moins dotés est faible** ; '
           f'le gain total ({pp(c["proprio"], 0)} contre {pp(Ia["proprio"], 0)}) va surtout aux autres. Les déciles de revenu du bas restent limités par la '
           'règle des 35 % d\'effort, pas par l\'apport. **Dans les déciles de revenu 4 à 10, « entrer à la foncière » et « être propriétaire » se confondent** : '
           'tous ceux qui seraient passés par la banque prennent la foncière, parce qu\'elle est moins chère. Le schéma capte ainsi presque tout l\'achat des jeunes '
           'salariés : la foncière finance des achats qui auraient eu lieu sans elle (additionnalité faible, H-FA17).', '',
           '**Un seuil.** Un ménage qui a accès à la banque choisit la foncière si la valeur de l\'usufruit (≈ 78 % au taux net de 2,5 %, H-FA13) dépasse le prix '
           'demandé plus une prime de liberté (10 %, H-FA13) : au central, le basculement se fait vers **68 % du prix**. En dessous (60 %, 65 %), tous les bancarisés '
           'viennent ; au-dessus (70 %), ils restent à la banque (section 8.1 : 382 000 jeunes à 65 %, 239 000 à 70 %). Ce seuil dépend d\'hypothèses non mesurées '
           '(⚠️ H-FA13). C\'est aussi pourquoi le scénario « haut » fait entrer **moins** de monde que le central ici : il suppose que les jeunes accordent plus de valeur '
           'à la nue-propriété (taux net 1,5 %), ce qui fait passer la valeur de l\'usufruit sous 60 % + prime ; la convention bas / haut, réglée pour l\'ancien schéma, '
           'n\'est plus monotone.', '']
    js['afflux'] = {sc: {k: v for k, v in I[sc].items() if k not in ('p', 'sim')} for sc in I}
    js['ancien'] = {k: v for k, v in Ia.items() if k not in ('p', 'sim')}

    # ---------------------------------------------------------------- 3. mensualité contre loyer
    lig1, jm1 = mensualites(C, h, 0.0332)
    lig2, jm2 = mensualites(C, h, 0.0472)
    entetes = ['Logement (prix médian DVF 2024)', 'Prix (€)', 'Loyer de marché (€/mois)', 'Mensualité, usufruit 60 %', '+ contribution et entretien',
               'Ancien schéma, sans héritage (85 % − 40 000 €)', 'Ancien schéma, héritier (85 %)', 'Prêt bancaire classique (90 %)', 'Mensualité + contribution / loyer']
    md += ['## 3. Mensualité contre loyer (cas types, 25 ans, sans apport)', '', 'Taux des contrats 3,32 % (taux bancaire de septembre 2026) :', '', tab(entetes, lig1), '',
           'Taux des contrats 4,72 % (choc de taux : + 1,4 point) :', '', tab(entetes, lig2), '',
           f'Loyers : carte des loyers 2025 (H-FA10, A), charges comprises ; entretien du propriétaire {pp(h["charges"], 2)} de la valeur par an (H-FU39 ⚠️) ; contribution 0,25 % par an. '
           'Ces cas recoupent le calcul du 11/11 (document de travail de l'atelier, non publié) : T2 en métropole 160 000 €, loyer 808 €, mensualité 455 € à 3 %.', '',
           f'**Lecture.** Pour un T2 de métropole, la mensualité ({e(jm1["metropoles_T2"]["m60"], 0)} €) vaut un peu plus de la moitié du loyer '
           f'({e(jm1["metropoles_T2"]["loyer"], 0)} €) ; contribution et entretien compris, on reste nettement sous le loyer. C\'est **moins cher que louer, à vie** : '
           'le jeune paie 60 % du prix et habite l\'équivalent de 80 % (valeur fiscale). Cette marge est ce qui fait venir beaucoup de monde (section 2) et ce qui fait monter '
           'les prix (section 5).', '']
    js['mensualites'] = {'3.32': jm1, '4.72': jm2}

    # ---------------------------------------------------------------- 4. finances
    mqc = c['maastricht']
    md += ['## 4. Flux publics et test des 50 %', '',
           tab(['Poste (central, argent de la foncière à 3,5 %)', 'Usufruit 60 %, prêteur mixte', 'Prêteur : tout par la foncière', 'Prêteur : tout par une banque',
                'Mixte, argent à 4,7 %', 'Ancien schéma (85 % + capital)'],
               [['Nue-propriété payée par la foncière, 2032 (Md€/an)'] + [e(x['np2032'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Nue-propriété payée, an 10 (2036, régime, Md€/an)'] + [e(x['np10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Prêté par la foncière par contrat (€)'] + [e(x['lf'], 0) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Besoin de financement de la foncière, an 10 (Md€)'] + [e(x['besoin10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Dette de la foncière à 10 ans (Md€)'] + [e(x['dette'][10], 0) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['à 20 ans'] + [e(x['dette'][20], 0) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['à 30 ans'] + [e(x['dette'][30], 0) + f' ({pp(x["dette_pib"][30], 0)} du PIB)' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Intérêts reçus des jeunes, an 10 (Md€)'] + [e(x['interets10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Intérêts payés par la foncière, an 10 (Md€)'] + [e(x['interets_payes10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Gestion payée par l\'État, an 10 (Md€)'] + [e(x['gestion10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Contribution sur la résidence principale des entrants, an 10 (Md€, au budget, remplace la taxe foncière)'] + [e(x['contrib10'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Aides au logement évitées, an 10 / an 30 (Md€)'] + [f'{e(x["aide10"], 2)} / {e(x["aide30"], 2)}' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Test des 50 % : ratio le plus bas, ans 5-30'] + [pp(x['ratio30'], 0) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['idem, ans 5-60'] + [pp(x['ratio60'], 0) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Capital de départ versé par l\'État (Md€/an)'] + [e(x['capital'], 1) for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Dette publique (Maastricht) en plus, 2032 : Md€ courants (points de PIB)'] + [f'{e(x["maastricht"][T2032]["md_courants"], 0)} ({e(100 * x["maastricht"][T2032]["pts_pib"], 2)} pt)' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['idem, 2038'] + [f'{e(x["maastricht"][T2038]["md_courants"], 0)} ({e(100 * x["maastricht"][T2038]["pts_pib"], 2)} pt)' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['dont déficit public 2032 / 2038, pt de PIB (nue-propriété + intérêts nets + gestion − aides ; les prêts n\'y entrent pas ⚠️)'] + [f'{e(100 * x["maastricht"][T2032]["deficit_pts"], 2)} / {e(100 * x["maastricht"][T2038]["deficit_pts"], 2)}' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ['Cumul : dette publique due à la foncière, 2038 (points de PIB)'] + [e(100 * x['maastricht'][T2038]['niveau_pts'], 1) + ' pt' for x in (c, var['fonciere'], var['banque'], var['i47'], Ia)],
                ]), '',
           'Pour l\'ancien schéma, la ligne Maastricht ne compte pas le capital de départ (versé par l\'État, il s\'ajoute : '
           f'{e(Ia["capital"], 1)} Md€ par an, dont la part « parts à vie »).', '']
    fmt = lambda x, k: '—' if x is None else (pp(x, 1) if k == 'forfait' else (e(100 * x, 2) + ' point' if k == 'marge' else e(x, 0) + ' Md€'))
    md += ['Ce qu\'il faudrait pour passer le test des 50 % (central, prêteur mixte, argent à 3,5 % ; un levier à la fois, entrants tenus fixes ; « — » : la borne — '
           'usufruit vendu à 100 %, marge de 8 points, livret de 3 000 Md€ — n\'y suffit pas) :', '',
           tab(['Horizon', 'Part d\'usufruit vendue', 'Marge ajoutée au taux des contrats', 'Livret foncier à 2 %'],
               [['ans 5-30'] + [fmt(s30[k], k) for k in ('forfait', 'marge', 'livret')], ['ans 5-60'] + [fmt(s60[k], k) for k in ('forfait', 'marge', 'livret')]]), '',
           f'**Lecture.** La foncière paie chaque année **{e(c["np10"], 0)} Md€ de nue-propriété** en régime (an 10) et prête en plus {e(c["lf"] / 1000, 0)} 000 € par contrat. '
           f'Elle reçoit des intérêts sur 60 % du prix et paie des intérêts sur 100 % : le ratio ventes / coûts tombe à {pp(c["ratio30"], 0)} au plus bas (ancien '
           f'schéma : {pp(Ia["ratio30"], 0)}). **Le test des 50 % échoue**, et nettement : la nue-propriété est un actif qui ne rapporte rien avant le décès de l\'usufruitier '
           f'(dans 55 ans en moyenne). Si la banque prête tout, la foncière ne fait plus que porter des nues-propriétés : ratio ≈ {pp(var["banque"]["ratio30"], 0)}, dette '
           f'plus basse ({e(var["banque"]["dette"][30], 0)} Md€ à 30 ans) mais aucune chance d\'être un « producteur marchand ». Classée dans les administrations '
           f'publiques, la foncière ajoute à la dette publique **{e(mqc[T2032]["md_courants"], 0)} Md€ en 2032 ({e(100 * mqc[T2032]["pts_pib"], 1)} point de PIB) et '
           f'{e(mqc[T2038]["md_courants"], 0)} Md€ en 2038 ({e(100 * mqc[T2038]["pts_pib"], 1)} point)**, soit {e(100 * mqc[T2038]["niveau_pts"], 0)} points de PIB cumulés '
           'en 2038. La dette est brute : le patrimoine acquis (nues-propriétés, créances) ne s\'en déduit pas au sens de Maastricht, même s\'il existe.', '']
    js['fonciere'] = dict(central={k: v for k, v in c.items() if k not in ('p', 'sim')}, variantes={k: {kk: vv for kk, vv in v.items() if kk not in ('p', 'sim')} for k, v in var.items()},
                          seuils30=s30, seuils60=s60)

    # ---------------------------------------------------------------- 5. prix
    lig = []
    for sc in ('bas', 'central', 'haut'):
        lig.append([f'Usufruit 60 %, {sc}, foncière seule'] + [sg(I[sc]['prix_f'][s]) for s in SECT])
        lig.append([f'Usufruit 60 %, {sc}, avec la réforme locative'] + [sg(I[sc]['prix_2'][s]) for s in SECT])
    lig.append(['Ancien schéma, central, foncière seule'] + [sg(Ia['prix_f'][s]) for s in SECT])
    lig.append(['Ancien schéma, central, avec la réforme locative'] + [sg(Ia['prix_2'][s]) for s in SECT])
    md += ['## 5. Effet sur les prix (méthode du modèle, niveau atteint en 5 à 10 ans)', '',
           'Effet = (demande additionnelle − offre additionnelle des bailleurs) / ventes du segment × réponse du prix du secteur, avec diffusion entre tailles '
           '(H-FA20 à H-FA22) ; moyenne du secteur pondérée par les ventes.', '', tab(['Monde'] + [NS[s] for s in SECT], lig), '',
           f'**Lecture.** Sans plafond d\'entrées, la hausse atteint **{sg(c["pmax"], 0)}** dans le secteur le plus touché (foncière seule), {sg(c["pmax2"], 0)} avec '
           f'les ventes des bailleurs (ancien schéma : {sg(Ia["pmax"], 0)}). Plus de monde entre, donc plus de demande additionnelle : le schéma aggrave le défaut '
           'principal de l\'ancien. Une partie de l\'avantage donné aux jeunes passe ainsi aux vendeurs. Le plafond de 5 % impose un plafond d\'entrées (section 8).', '']

    # ---------------------------------------------------------------- 6. avantage caché
    av, ava = c['avantage'], Ia['avantage']
    md += ['## 6. L\'avantage caché (écart entre la valeur fiscale de l\'usufruit et le prix payé)', '',
           'Barème de l\'article 669 du CGI (usufruit = 90 % avant 21 ans révolus, 80 % avant 31 ans, 70 % avant 41 ans ; Légifrance, A, valeurs reprises de '
           '`fonciere-usufruit/code/usufruit.py`, non relues ce jour ⚠️) ; âges d\'entrée et prix moyen des contrats du central. En regard, la valeur actuarielle '
           f'(table de mortalité, taux net {pp(h["r_np"], 1)}, H-FA13).', '',
           tab(['', 'Usufruit 60 %', 'Ancien schéma (85 %)'],
               [['Valeur fiscale moyenne de l\'usufruit (part du prix)', pp(av['bareme_moyen'], 1), pp(ava['bareme_moyen'], 1)],
                ['Prix payé (part du prix)', pp(F60, 0), pp(0.85, 0)],
                ['Avantage caché par contrat, valeur fiscale (€)', e(av['fiscal_contrat'], 0), e(ava['fiscal_contrat'], 0)],
                ['idem, pour une génération de contrats (Md€ par an)', e(av['fiscal_md'], 1), e(ava['fiscal_md'], 1)],
                ['Valeur actuarielle moyenne de l\'usufruit', pp(av['usu_moyen'], 1), pp(ava['usu_moyen'], 1)],
                ['Avantage par contrat, valeur actuarielle (€)', e(av['actuariel_contrat'], 0), e(ava['actuariel_contrat'], 0)],
                ['idem (Md€ par an)', e(av['actuariel_md'], 1), e(ava['actuariel_md'], 1)],
                ['Capital de départ apporté par contrat (€)', '0', e(Ia['apport'], 0)],
                ['Avantage total par contrat, valeur fiscale (€)', e(av['fiscal_contrat'], 0), e(ava['fiscal_contrat'] + Ia['apport'], 0)]]), '',
           f'**Lecture.** Vendre l\'usufruit à 60 % quand le barème fiscal le vaut {pp(av["bareme_moyen"], 0)} en moyenne revient à donner **{e(av["fiscal_contrat"], 0)} € par '
           f'contrat**, soit **{e(av["fiscal_md"], 1)} Md€ par an** pour une génération de contrats : c\'est le capital de départ, rentré par une autre porte. '
           f'Il est de même taille que l\'ancien avantage total (capital moins surévaluation : {e(ava["fiscal_contrat"] + Ia["apport"], 0)} € par contrat) mais il '
           'n\'est plus visible dans le budget, il croît avec le prix du logement acheté (plus pour qui achète cher) et il ne va qu\'à ceux qui entrent. Il doit être '
           'écrit noir sur blanc dans le manifeste : c\'est une subvention, pas un prix de marché.', '']
    js['avantage'] = dict(nouveau=av, ancien=ava)

    # ---------------------------------------------------------------- 7. comparaison
    md += ['## 7. Comparaison avec l\'ancien schéma et le coût du capital de départ', '',
           tab(['Indicateur (central)', 'Usufruit 60 %, sans capital', 'Ancien : 85 % + capital 40 000 €'],
               [['Jeunes par an', k_(c['jeunes']), k_(Ia['jeunes'])],
                ['Part des ventes de logements', pp(c['part_ventes'], 0), pp(Ia['part_ventes'], 0)],
                ['Propriétaires ou usufruitiers à 35 ans (sans dispositif : ' + pp(c['proprio_sans'], 0) + ')', pp(c['proprio'], 0), pp(Ia['proprio'], 0)],
                ['idem, moitié qui hérite le moins (sans dispositif : ' + pp(c['D15_sans'], 0) + ')', pp(c['D15'], 0), pp(Ia['D15'], 0)],
                ['Capital de départ versé par l\'État (Md€/an)', '0', e(Ia['capital'], 1)],
                ['Nue-propriété payée par la foncière, régime (Md€/an)', e(c['np10'], 1), e(Ia['np10'], 1)],
                ['Dette publique en plus en 2032 (Md€ courants, foncière + capital en régime)', e(mqc[T2032]['md_courants'], 0), e(Ia['maastricht'][T2032]['md_courants'] + Ia['capital'] * 1.02 ** 6, 0)],
                ['idem 2038', e(mqc[T2038]['md_courants'], 0), e(Ia['maastricht'][T2038]['md_courants'] + Ia['capital'] * 1.02 ** 12, 0)],
                ['Dette de la foncière à 30 ans (Md€)', e(c['dette'][30], 0), e(Ia['dette'][30], 0)],
                ['Test des 50 % (ratio le plus bas, ans 5-30)', pp(c['ratio30'], 0), pp(Ia['ratio30'], 0)],
                ['Hausse des prix, secteur le plus touché (foncière seule)', sg(c['pmax']), sg(Ia['pmax'])],
                ['Avantage caché + capital par contrat (€)', e(av['fiscal_contrat'], 0), e(ava['fiscal_contrat'] + Ia['apport'], 0)],
                ['Pour qui n\'entre pas (12 % sans emploi stable avant 36 ans, et qui loue)', 'rien', 'parts à vie (moitié du capital)']]), '',
           f'Référence : le capital de départ du chapitre 3 coûtait ≈ {e(PLAFOND_COUT, 1)} Md€ par an (option D, `capital-de-depart-options`, H-CO24) ; dans ce modèle, '
           f'capital apporté + parts à vie = {e(Ia["capital"], 1)} Md€ par an.', '',
           '**Lecture.** Le schéma supprime une dépense budgétaire visible (le capital) mais la remplace par un achat de nue-propriété **plus coûteux** en dette, parce que '
           'plus de monde entre et que la foncière ne reçoit plus d\'apport. Il n\'est pas « gratuit » : il déplace le coût du budget de l\'État vers la dette de la '
           'foncière, et du présent vers le très long terme (le logement revient au décès).', '']

    # ---------------------------------------------------------------- 8. grille et réglage
    lig = []
    for (f, x), g in grille.items():
        lig.append([pp(f, 0), pp(x, 1), k_(g['jeunes']), pp(g['part_ventes'], 0), pp(g['D15'], 0), sg(g['pmax']), e(g['np10'], 1), e(g['dette'][30], 0),
                    pp(g['ratio30'], 0), f'{e(100 * g["maastricht"][T2032]["pts_pib"], 2)} / {e(100 * g["maastricht"][T2038]["pts_pib"], 2)}', e(g['avantage']['fiscal_md'], 1)])
    md += ['## 8. Sensibilité et réglage recommandé', '', '### 8.1 Part d\'usufruit vendue × environnement de taux', '',
           'Environnement « 3,3 % » : la foncière emprunte à 3,3 % et les contrats sont à 3,3 % ; « 4,7 % » : les deux à 4,7 % (H-FA94). Prêteur mixte, sans plafond '
           'd\'entrées, central.', '',
           tab(['Usufruit vendu', 'Taux', 'Jeunes par an', 'Part des ventes', 'Propriétaires à 35 ans, moitié qui hérite le moins', 'Hausse max. (foncière seule)',
                'Nue-propriété payée, régime (Md€/an)', 'Dette à 30 ans (Md€)', 'Ratio min 5-30 ans', 'Dette publique en plus, pt de PIB 2032 / 2038',
                'Avantage caché (Md€/an)'], lig), '']
    js['grille'] = {f'{f}_{x}': {k: v for k, v in g.items() if k not in ('p', 'sim')} for (f, x), g in grille.items()}

    def ligne_best(g):
        return [pp(g['f'], 0), g['preteur'], e(100 * g['marge'], 0) + ' pt', '—' if g['quota'] is None else pp(g['quota'], 0), k_(g['jeunes']), pp(g['D15'], 0),
                sg(g['pmax']), e(g['cout10'], 1), f'{e(100 * g["m2032"], 2)} / {e(100 * g["m2038"], 2)}', pp(g['ratio30'], 0), e(g['dette30'], 0)]
    rows = []
    for nom, g in (('prix ≤ 5 % et coût ≤ 14,7 Md€', best), ('les trois, test des 50 % compris', best50),
                   ('usufruit tenu à 60 % (décision de l\'auteur), prix ≤ 5 %, coût ≤ 14,7 Md€', best60),
                   ('usufruit tenu à 60 %, les trois contraintes', best60_50)):
        rows.append([nom] + (ligne_best(g) if g else ['aucun'] + [''] * 10))
    for cap in (0.02, 0.03, 0.05, 0.08, 0.10):
        oks = [g for g in cands if g['pmax'] <= cap + 1e-9 and g['cout10'] <= PLAFOND_COUT]
        bg = max(oks, key=lambda g: (round(g['D15'], 4), -g['cout10'])) if oks else None
        rows.append([f'frontière : prix ≤ {pp(cap, 0)}, coût ≤ 14,7 Md€'] + (ligne_best(bg) if bg else ['aucun'] + [''] * 10))
    md += ['### 8.2 Réglage recommandé sous contraintes', '',
           f'Grille : usufruit 55 / 60 / 65 / 70 % × marge 0 / 1 / 2 points × plafond d\'entrées (part d\'une génération, servi par héritage croissant) × prêteur '
           f'mixte ou banque ({len(cands)} réglages). Contraintes : hausse ≤ 5 % dans chaque secteur (foncière seule, en régime) ; coût public annuel soutenable = '
           f'dette publique en plus à l\'an 10 (foncière dans les administrations publiques, Md€ de 2026) ≤ {e(PLAFOND_COUT, 1)} Md€, le budget du capital de départ que '
           'le schéma remplace (H-FA97) ; test des 50 % si possible. Critère : propriétaires ou usufruitiers à 35 ans dans la moitié qui hérite le moins.', '',
           tab(['Contraintes', 'Usufruit vendu', 'Prêteur', 'Marge', 'Plafond d\'entrées', 'Jeunes par an', 'Moitié qui hérite le moins, propriétaires à 35 ans',
                'Hausse max.', 'Coût public an 10 (Md€)', 'Dette publique en plus, pt de PIB 2032 / 2038', 'Ratio min 5-30 ans', 'Dette foncière à 30 ans (Md€)'], rows), '']
    n_ok50 = len(ok_tous)
    if reco:
        md += [f'**Réglage recommandé** : usufruit à **{pp(reco["f"], 0)}**, prêteur **{reco["preteur"]}**, marge de {e(100 * reco["marge"], 0)} point sur le taux bancaire, '
               f'**plafond d\'entrées de {"—" if reco["quota"] is None else pp(reco["quota"], 0)} d\'une génération** (≈ {k_(reco["jeunes"])} jeunes par an, servis par '
               f'héritage croissant) : {pp(reco["D15"], 0)} de propriétaires ou usufruitiers à 35 ans dans la moitié qui hérite le moins (sans dispositif {pp(c["D15_sans"], 0)} ; '
               f'sans plafond {pp(c["D15"], 0)}), hausse des prix {sg(reco["pmax"])}, dette publique en plus ≈ {e(reco["cout10"], 1)} Md€ par an en régime '
               f'({e(100 * reco["m2032"], 2)} point de PIB en 2032, {e(100 * reco["m2038"], 2)} en 2038), ratio {pp(reco["ratio30"], 0)} '
               f'({"test des 50 % tenu" if reco["ratio30"] > 0.5 else "test des 50 % raté"}). {n_ok50} réglage(s) de la grille tiennent les trois contraintes.', '',
               '**Ce que dit ce réglage.** (1) La contrainte qui mord est celle des **prix**, pas celle du coût : sous +5 %, il faut ramener les entrées à quelques '
               'dizaines de milliers par an, très loin de la demande (≈ 400 000). (2) À 60 %, le schéma est trop attractif pour être ouvert à tous ; à 70 %, les '
               'bancarisés restent à la banque, la foncière sert surtout ceux que la banque refuse, et une marge d\'un point suffit au test des 50 %. (3) Garder 60 % '
               'reste possible, mais avec un plafond du même ordre soit une foncière classée publique (ligne 3), soit une marge de deux points sur le taux bancaire qui fait passer le test (ligne 4) mais rapproche la mensualité de celle d\'un prêt classique : le choix de 60 % est un choix de **générosité par '
               'contrat**, payé en nombre de bénéficiaires.', '']
    else:
        md += ['**Aucun réglage de la grille ne tient à la fois la contrainte des prix et celle du coût.**', '']
    js['grille_reglages'] = cands
    js['recommande'] = reco
    js['meilleur_a_60'] = best60
    js['meilleur_a_60_test50'] = best60_50
    js['meilleur_sans_test'] = best
    js['recommande_50'] = best50

    # ---------------------------------------------------------------- 9. sans complaisance
    md += ['## 9. Sans complaisance : ce qui rend le schéma coûteux ou fragile', '',
           f'1. **Le capital de départ n\'a pas disparu, il est devenu invisible.** L\'écart entre la valeur fiscale (≈ {pp(av["bareme_moyen"], 0)}) et le prix (60 %) donne '
           f'≈ {e(av["fiscal_contrat"] / 1000, 0)} 000 € par contrat, {e(av["fiscal_md"], 1)} Md€ par an. Ce qui était une dépense lisible devient une perte en capital de la '
           'foncière, constatée au décès de l\'usufruitier dans un demi-siècle. Présenter le schéma comme « sans capital de départ » sans le dire serait le reproche que '
           'le manifeste fait aux autres (dépenses cachées).',
           f'2. **Le test des 50 % échoue partout** (ratio {pp(c["ratio30"], 0)} au central) : la foncière est une administration publique ; sa dette s\'ajoute à la '
           f'dette publique (≈ {e(100 * mqc[T2032]["pts_pib"], 1)} point de PIB en 2032, {e(100 * mqc[T2038]["pts_pib"], 1)} en 2038 sans plafond, {e(100 * mqc[T2038]["niveau_pts"], 0)} '
           'points cumulés en 2038). Un plafond d\'entrées réduit ce flux à proportion, il ne change pas la nature de l\'organisme.',
           f'3. **Les prix.** Sans plafond, +{e(100 * c["pmax"], 0)} % dans le secteur le plus touché : plus que l\'ancien schéma, parce que le schéma est plus attractif. '
           'Le plafond d\'entrées devient indispensable, donc le rationnement (qui entre, qui attend) devient le vrai sujet politique.',
           '4. **Il favorise les héritiers par rapport à l\'ancien schéma.** Le capital de départ était décroissant avec l\'héritage ; la décote de 20 % ne l\'est pas, elle '
           'croît même avec le prix du bien acheté. Servir le plafond par héritage croissant corrige en partie, au prix d\'un effet de seuil et d\'un risque de '
           'déclarations arrangées.',
           '5. **Rien pour qui n\'entre pas** : les 12 % qui n\'ont pas d\'emploi stable avant 36 ans (non-diplômés surtout) et ceux qui ne peuvent pas tenir 35 % d\'effort '
           'perdent les parts à vie de l\'ancien schéma. C\'est un recul pour les plus fragiles, à nommer ou à compenser.',
           '6. **Risque de taux** : à 4,7 %, la dette de la foncière grimpe et le ratio baisse encore (section 4) ; si le taux des contrats suit, la mensualité monte et une '
           'partie des ménages modestes sort.',
           '7. **Un prêt sans apport sur un usufruit viager** : une banque prête-t-elle 100 % d\'un droit qui s\'éteint au décès (garantie fragile, assurance décès '
           'obligatoire) ? ⚠️ non vérifié ; si non, la foncière doit tout prêter, et sa dette monte (variante « tout par la foncière »).',
           '8. **Ce que le modèle ne voit pas** : la hausse des prix qu\'il calcule n\'est pas réinjectée dans la foncière (elle paierait plus cher) ; pas de revente ni de '
           'mobilité des usufruitiers ; comportements = règles de décision, pas estimations.', '']

    # ---------------------------------------------------------------- résumé en tête
    res_l = ['## En dix lignes', '',
             f'1. Usufruit vendu à 60 %, sans apport ni capital : **≈ {k_(c["jeunes"])} jeunes par an** entrent (bas {k_(I["bas"]["jeunes"])}, haut {k_(I["haut"]["jeunes"])}), '
             f'{k_(c["contrats"])} contrats, **{pp(c["part_ventes"], 0)} des ventes de logements** (ancien schéma : {k_(Ia["jeunes"])}, {pp(Ia["part_ventes"], 0)}).',
             f'2. Propriétaires ou usufruitiers à 35 ans : {pp(c["proprio"], 0)} (sans dispositif {pp(c["proprio_sans"], 0)}) ; moitié qui hérite le moins : {pp(c["D15"], 0)} '
             f'({pp(c["D15_sans"], 0)} sans dispositif, {pp(Ia["D15"], 0)} avec l\'ancien schéma).',
             f'3. T2 de métropole : mensualité {e(jm1["metropoles_T2"]["m60"], 0)} € contre un loyer de {e(jm1["metropoles_T2"]["loyer"], 0)} € ; T2 de ville moyenne : '
             f'{e(jm1["villes_moyennes_T2"]["m60"], 0)} € contre {e(jm1["villes_moyennes_T2"]["loyer"], 0)} € (25 ans, 3,32 %).',
             f'4. La foncière paie **≈ {e(c["np10"], 0)} Md€ de nue-propriété par an** en régime ; sa dette atteint {e(c["dette"][10], 0)} / {e(c["dette"][20], 0)} / '
             f'{e(c["dette"][30], 0)} Md€ à 10 / 20 / 30 ans (ancien schéma à 30 ans : {e(Ia["dette"][30], 0)} Md€).',
             f'5. **Test des 50 % raté** (ratio {pp(c["ratio30"], 0)} ; ancien {pp(Ia["ratio30"], 0)}) : dette publique en plus de **{e(100 * mqc[T2032]["pts_pib"], 1)} point '
             f'de PIB en 2032 et {e(100 * mqc[T2038]["pts_pib"], 1)} en 2038** (sans plafond d\'entrées).',
             f'6. Prix : **{sg(c["pmax"], 0)}** dans le secteur le plus touché sans plafond (ancien : {sg(Ia["pmax"], 0)}).',
             f'7. Avantage caché (80 % fiscal contre 60 % vendu) : **≈ {e(av["fiscal_contrat"], 0)} € par contrat, {e(av["fiscal_md"], 1)} Md€ par an** ; le capital de départ '
             'réapparaît sous une autre forme.',
             f'8. Le capital de départ ({e(Ia["capital"], 1)} Md€ par an dans ce modèle, ≈ 14,7 Md€ au chapitre 3) disparaît du budget, mais la dette publique monte '
             'davantage qu\'avec l\'ancien schéma.',
             (f'9. Réglage recommandé (prix ≤ 5 %, coût ≤ 14,7 Md€, test des 50 %) : usufruit à {pp(reco["f"], 0)}, marge de {e(100 * reco["marge"], 0)} point, plafond de '
              f'{"—" if reco["quota"] is None else pp(reco["quota"], 0)} d\'une génération (≈ {k_(reco["jeunes"])} jeunes par an), hausse {sg(reco["pmax"])}, '
              f'≈ {e(reco["cout10"], 1)} Md€ de dette en plus par an, test des 50 % {"tenu" if reco["ratio30"] > 0.5 else "raté"}' + (f' ; en gardant 60 % : plafond de {pp(best60["quota"], 0)} (≈ {k_(best60["jeunes"])} jeunes), ratio {pp(best60["ratio30"], 0)}' + (f', ou {pp(best60_50["ratio30"], 0)} avec une marge de {e(100 * best60_50["marge"], 0)} points (contrats à ≈ {pp(0.0332 + best60_50["marge"], 1)}).' if best60_50 else '.') if best60 and best60["quota"] else '.')
              if reco else '9. Aucun réglage ne tient prix et coût.'),
             '10. Fragilités : avantage caché, organisme classé public, prix, effet anti-redistributif par rapport à l\'ancien schéma, rien pour qui n\'entre pas.', '',
             'Ce sont des ordres de grandeur sous hypothèses (plusieurs ⚠️ non mesurées : envie de se fixer, valeur accordée à la nue-propriété, élasticités), jamais des prédictions.', '']
    md[pos_resume:pos_resume] = res_l

    with open(os.path.join(RACINE, 'resultats-usufruit-60.md'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(md) + '\n')
    with open(os.path.join(RACINE, 'donnees', 'resultats-usufruit-60.json'), 'w', encoding='utf-8') as fh:
        json.dump(js, fh, ensure_ascii=False, indent=1, default=lambda o: None)
    print('écrit resultats-usufruit-60.md et donnees/resultats-usufruit-60.json')


if __name__ == '__main__':
    main()
