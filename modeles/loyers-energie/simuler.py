# -*- coding: utf-8 -*-
# Simulation : python3 -I simuler.py > resultats-sortie.txt   (écrit aussi resultats/*.csv)
import csv, gzip, math, os, statistics, sys
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import modele as M

D = ICI + '/donnees/'
os.makedirs(ICI + '/resultats', exist_ok=True)
ZONES = {'paris': 'Paris', 'lyon': 'Lyon', 'grenoble': 'Grenoble', 'angers': 'Angers', 'creuse': 'Creuse'}
# --- loyers de la carte
LOY = {}
for r in csv.DictReader(open(D + 'loyers_carte_2025_extraits.csv')):
    LOY[(r['type'], r['insee'])] = float(r['loyer_m2_cc'])


def f(x):
    try: return float(x)
    except (TypeError, ValueError): return None


def lire(zone):
    L = []
    for r in csv.DictReader(gzip.open(D + f'dpe_{zone}.csv.gz', 'rt', encoding='utf-8')):
        typ = r['type_batiment']
        if typ not in ('appartement', 'maison'): continue
        S, bch, bfr, cch, ctot = f(r['surface_habitable_logement']), f(r['besoin_chauffage']), f(r['besoin_refroidissement']), f(r['conso_chauffage_ef']), f(r['conso_5_usages_ef'])
        ep2, cl = f(r['conso_5_usages_par_m2_ep']), r['etiquette_dpe']
        if None in (S, bch, cch, ctot, ep2) or cl not in M.CLASSES or not (8 <= S < 250) or ctot <= 0: continue
        cons = []
        for k in '123':
            e, c = r[f'type_energie_n{k}'], f(r[f'conso_5_usages_ef_energie_n{k}'])
            if e and c: cons.append((e, c))
        if not cons or abs(sum(c for _, c in cons) - ctot) > 0.05 * ctot + 5: continue
        t = M.taille(S)
        if t is None: continue
        ench = r['type_energie_principale_chauffage'] or cons[0][0]
        bch, imp = M.besoin_utile(bch, S, cch, ench)
        if bfr and imp: bfr = 0.0
        insee = r['code_insee_ban']
        L.append(dict(zone=zone, typ=typ, insee=insee, surface=S, taille=t, classe=cl, cons=cons, conso_ch=cch,
                      energie_ch=r['type_energie_principale_chauffage'] or cons[0][0], besoin_ch=bch, besoin_froid=bfr or 0.0,
                      ctot=ctot, ep_m2=ep2, periode=r['periode_construction'], impute=imp))
    return L


def segments(L, zone):
    """Découpe en segments de calibrage : (étiquette ville, groupe de calibrage, type) -> liste."""
    seg = {}
    for lg in L:
        if zone in ('paris', 'lyon'): ville, cal = zone, lg['insee']
        elif zone == 'creuse': ville, cal = 'creuse-' + lg['typ'], 'creuse'
        else: ville, cal = zone, lg['insee']
        seg.setdefault((ville, cal), []).append(lg)
    return seg


def droite_segment(L, ville):
    """Droite de marché du segment (moyenne des loyers de la carte des communes des logements)."""
    def moy(typ):
        v = [LOY[(typ, lg['insee'])] for lg in L if (typ, lg['insee']) in LOY]
        return statistics.mean(v) if v else None
    r12, r3 = moy('app12'), moy('app3')
    if ville == 'creuse-maison':
        # part de base empruntée aux appartements creusois (toutes communes de la Creuse) : a / M(72 m²)
        ra12 = statistics.mean(v for (t, i), v in LOY.items() if t == 'app12' and i.startswith('23'))
        ra3 = statistics.mean(v for (t, i), v in LOY.items() if t == 'app3' and i.startswith('23'))
        a, v = M.droite_marche(ra12, ra3)
        return M.droite_maison(moy('mai'), a / (ra3 * 72.0))
    return M.droite_marche(r12, r3)


CALIB = {}   # paramètres calibrés du scénario central : (ville, groupe) -> (bases, v plafond, droite de marché)
GAMMA = {}   # rapport loyer OLL (parc en cours, hors charges) / droite de la carte (annonces, charges comprises), par zone


def evaluer(L, zone, scen, alpha=M.ALPHA, k=None, gamma=True):
    """Retourne la liste des logements enrichis (plafond, marché, indicateurs) pour un scénario."""
    p = M.SCENARIOS[scen] if isinstance(scen, str) else scen
    k = k or p['k']
    L = [dict(x) for x in L]
    out = []
    for lg in L:
        lg['d'] = M.deduction_mensuelle(M.cout_usages(lg['cons'], p['prix']), lg['conso_ch'], lg['energie_ch'], lg['besoin_ch'] + lg['besoin_froid'], alpha, p['prix'])
        lg['cout'] = M.cout_usages(lg['cons'], p['prix']) / 12
    SEG = segments(L, zone)
    for (ville, cal), seg in SEG.items():
        dr = droite_segment(seg, ville)
        g = GAMMA.get(zone, 1.0) if gamma else 1.0
        dr = (dr[0] * g, dr[1] * g)
        ville_seg = [lg for (v, c), s2 in SEG.items() if v == ville for lg in s2]
        bases, vp = M.calibrer_zone(seg, dr, k, repli=ville_seg)
        if scen == 'central' and alpha == M.ALPHA and gamma: CALIB[(ville, cal)] = (bases, vp, dr)
        dbar = {}
        for t in M.TAILLES:
            Lt = [lg for lg in seg if lg['taille'] == t]
            if len(Lt) < 20: Lt = [lg for lg in ville_seg if lg['taille'] == t]
            if Lt: dbar[t] = statistics.mean(x['d'] for x in Lt)
        for lg in seg:
            t = lg['taille']
            if t not in bases: continue
            a_, v_ = dr
            plaf = M.plafond(bases[t], vp, lg['surface'], lg['d'])
            neutre = M.plafond(bases[t], vp, lg['surface'], dbar[t])
            med = M.marche_median(dr, lg['surface'], lg['classe'], p['primes'])
            s = M.sigma(lg['zone'], t) * p['sig']
            e_now = med * math.exp(s * s / 2)
            lg.update(ligne=a_ + v_ * lg['surface'], ville=ville, plaf=plaf, neutre=neutre, med=med, e_now=e_now,
                      p_dep=M.part_depassant(med, plaf, s), b=M.baisse_esperee(med, plaf, s),
                      p_dep_n=M.part_depassant(med, neutre, s), b_n=M.baisse_esperee(med, neutre, s),
                      e_apres=M.loyer_apres(med, plaf, s), hausse=max(0.0, plaf - med), ecart=plaf - neutre)
            out.append(lg)
    return out


def agreger(R, cle):
    g = {}
    for lg in R: g.setdefault(cle(lg), []).append(lg)
    rows = {}
    for key, L in g.items():
        n = len(L)
        pd_ = statistics.mean(x['p_dep'] for x in L)
        b = statistics.mean(x['b'] for x in L)
        rows[key] = dict(n=n, d=statistics.mean(x['d'] for x in L), plaf=statistics.mean(x['plaf'] for x in L),
                         med=statistics.mean(x['med'] for x in L), p_dep=pd_, p_dep_n=statistics.mean(x['p_dep_n'] for x in L),
                         b_tous=b, b_conc=(b / pd_ if pd_ > 1e-9 else 0.0), b_n=statistics.mean(x['b_n'] for x in L),
                         hausse=statistics.mean(x['hausse'] for x in L), ecart=statistics.mean(x['ecart'] for x in L), forte=statistics.mean(1.0 if x['ecart'] <= -50 else 0.0 for x in L), cout=statistics.mean(x['cout'] for x in L),
                         tot_now=statistics.mean(x['e_now'] + x['cout'] for x in L), tot_apres=statistics.mean(x['e_apres'] + x['cout'] for x in L),
                         besoin_m2=statistics.mean((x['besoin_ch'] + x['besoin_froid']) / x['surface'] for x in L))
    return rows


def villes_ordre(R): return sorted({lg['ville'] for lg in R}, key=lambda v: ['paris', 'lyon', 'grenoble', 'angers', 'creuse-appartement', 'creuse-maison'].index(v))


if __name__ == '__main__':
    TOUT = {z: lire(z) for z in ZONES}
    for z, L in TOUT.items(): print(f'## DPE retenus {z} : {len(L)} (besoin imputé : {sum(x["impute"] for x in L)/len(L):.0%})')
    # --- recalage flux -> stock (H11) : OLL / carte des loyers, par ville, moyenne sur les tailles
    R0 = []
    for z, L in TOUT.items(): R0 += evaluer(L, z, 'central', gamma=False)
    rat = {}
    for r in csv.DictReader(open(D + 'oll_extraits.csv')):
        sf = float(r['surface_moyenne']); X = [x['ligne'] for x in R0 if x['ville'] == r['ville'] and abs(x['surface'] - sf) <= 4]
        if len(X) >= 10: rat.setdefault(r['ville'], []).append(float(r['loyer_mensuel_median']) / statistics.mean(X))
    for v, l in rat.items(): GAMMA[v] = statistics.mean(l)
    moy = statistics.mean(GAMMA.values())
    for z in ('angers', 'creuse'): GAMMA[z] = moy
    print('## Recalage OLL/carte (gamma) :', {k: round(v, 3) for k, v in GAMMA.items()})
    resultats = {}
    for scen in M.SCENARIOS:
        R = []
        for z, L in TOUT.items(): R += evaluer(L, z, scen)
        resultats[scen] = R
    # --- synthèse par ville et par scénario
    print('\n## SYNTHESE par ville et scénario (alpha = %.1f)' % M.ALPHA)
    print('ville|scenario|n|part dépassant (plafond)|part dépassant (plafond neutre, sans énergie)|baisse moyenne tous €/mois|baisse moy. concernés|baisse neutre')
    out = [['ville', 'scenario', 'groupe_type', 'groupe', 'n', 'deduction_moy', 'plafond_moy', 'marche_median_moy', 'part_depassant', 'part_depassant_neutre', 'baisse_tous', 'baisse_concernes', 'baisse_neutre', 'marge_hausse', 'cout_energie_mois', 'loyer_plus_energie_avant', 'loyer_plus_energie_apres']]
    for scen, R in resultats.items():
        for v in villes_ordre(R):
            Rv = [x for x in R if x['ville'] == v]
            a = agreger(Rv, lambda x: 'tous')['tous']
            print(f"{v}|{scen}|{a['n']}|{a['p_dep']:.1%}|{a['p_dep_n']:.1%}|{a['b_tous']:.0f}|{a['b_conc']:.0f}|{a['b_n']:.0f}")
            for gt, cle in [('classe', lambda x: x['classe']), ('taille', lambda x: x['taille']), ('classe_taille', lambda x: x['classe'] + ' ' + x['taille'])]:
                for g, a in sorted(agreger(Rv, cle).items()):
                    out.append([v, scen, gt, g, a['n'], round(a['d'], 1), round(a['plaf'], 1), round(a['med'], 1), round(a['p_dep'], 4), round(a['p_dep_n'], 4), round(a['b_tous'], 1), round(a['b_conc'], 1), round(a['b_n'], 1), round(a['hausse'], 1), round(a['cout'], 1), round(a['tot_now'], 1), round(a['tot_apres'], 1)])
    csv.writer(open(ICI + '/resultats/synthese.csv', 'w', newline='')).writerows(out)
    print('\n## SYNTHESE sans recalage (carte des loyers brute : annonces, charges comprises ; central)')
    Rb = []
    for z, L in TOUT.items(): Rb += evaluer(L, z, 'central', gamma=False)
    for v in villes_ordre(Rb):
        a = agreger([x for x in Rb if x['ville'] == v], lambda x: 'tous')['tous']
        print(f"{v}|part dépassant {a['p_dep']:.1%}|baisse tous {a['b_tous']:.0f}|baisse concernés {a['b_conc']:.0f}")
    # --- écart G moins D selon le scénario
    print('\n## ÉCART loyer+énergie (G moins D, €/mois), avant -> après, par scénario')
    for scen, R in resultats.items():
        cells = []
        for v in villes_ordre(R):
            for t in ['T2', 'T3']:
                A2 = agreger([x for x in R if x['ville'] == v and x['taille'] == t], lambda x: x['classe'])
                if 'G' in A2 and 'D' in A2 and A2['G']['n'] >= 10:
                    cells.append(f"{v} {t}: {A2['G']['tot_now']-A2['D']['tot_now']:+.0f}->{A2['G']['tot_apres']-A2['D']['tot_apres']:+.0f}")
        print(scen + ' | ' + ' ; '.join(cells))
    print('\n## PARAMETRES CALIBRES (central, k = 1,2, alpha = 0,3) : base par taille (€/mois), v (€/m²/mois), droite de marché recalée (a €/mois, v_marché €/m²)')
    for v in villes_ordre(resultats['central']):
        C = [c for (vv, cal), c in CALIB.items() if vv == v]
        def moy(f): return statistics.mean(f(c) for c in C)
        txt = ', '.join(f"{t} {statistics.mean(c[0][t] for c in C if t in c[0]):.0f}" for t in M.TAILLES if any(t in c[0] for c in C))
        extra = f" (moyenne de {len(C)} arrondissements ; v de {min(c[1] for c in C):.1f} à {max(c[1] for c in C):.1f})" if len(C) > 1 else ''
        print(f"{v}: v = {moy(lambda c: c[1]):.2f}{extra} ; bases : {txt} ; marché a = {moy(lambda c: c[2][0]):.0f}, pente = {moy(lambda c: c[2][1]):.2f}")
    # --- tables par classe (central)
    for scen in ['central']:
        R = resultats[scen]
        for v in villes_ordre(R):
            Rv = [x for x in R if x['ville'] == v]
            print(f'\n## {v.upper()} ({scen}) par classe')
            print('classe|n|part|besoin kWh/m²|énergie réelle €/mois|déduction €/mois|plafond|loyer médian marché|% dépassant|dont neutre|baisse moy. (tous)|baisse (concernés)|marge hausse|loyer+énergie avant|après')
            A = agreger(Rv, lambda x: x['classe']); tot = len(Rv)
            for c in M.CLASSES:
                if c in A:
                    a = A[c]
                    print(f"{c}|{a['n']}|{a['n']/tot:.1%}|{a['besoin_m2']:.0f}|{a['cout']:.0f}|{a['d']:.0f}|{a['plaf']:.0f}|{a['med']:.0f}|{a['p_dep']:.1%}|{a['p_dep_n']:.1%}|{a['b_tous']:.0f}|{a['b_conc']:.0f}|{a['hausse']:.0f}|{a['tot_now']:.0f}|{a['tot_apres']:.0f}")
            print('classes : écart plafond − plafond neutre (€/mois) ; part des logements à écart ≤ −50 €/mois')
            print('  ' + ' ; '.join(f"{c}: {A[c]['ecart']:+.0f} / {A[c]['forte']:.0%}" for c in M.CLASSES if c in A))
            print('par taille')
            for t, a in sorted(agreger(Rv, lambda x: x['taille']).items(), key=lambda kv: M.TAILLES.index(kv[0])):
                print(f"{t}|{a['n']}|plafond {a['plaf']:.0f}|médian {a['med']:.0f}|dépassant {a['p_dep']:.1%} (neutre {a['p_dep_n']:.1%})|baisse conc. {a['b_conc']:.0f}")
            # écart de coût total G vs D, T2 et T3
            print('écart loyer+énergie (G moins D, €/mois), avant -> après, par taille')
            for t in ['T2', 'T3']:
                A2 = agreger([x for x in Rv if x['taille'] == t], lambda x: x['classe'])
                if 'G' in A2 and 'D' in A2 and A2['G']['n'] >= 10:
                    print(f"  {t} : {A2['G']['tot_now']-A2['D']['tot_now']:+.0f} -> {A2['G']['tot_apres']-A2['D']['tot_apres']:+.0f}  (A-G, n_G={A2['G']['n']})")
    # --- variantes alpha (central) : part dépassant par classe
    print('\n## VARIANTES alpha (central) : part dépassant (neutre déduit) par classe G / F / E / D / A-C, et dispersion des plafonds entre énergies')
    VAR = {}
    for alpha in [1.0, 0.5, 0.3, 0.0]:
        R = []
        for z, L in TOUT.items(): R += evaluer(L, z, 'central', alpha=alpha)
        VAR[alpha] = R
        for v in villes_ordre(R):
            Rv = [x for x in R if x['ville'] == v]
            A = agreger(Rv, lambda x: x['classe'])
            print(f"alpha={alpha}|{v}|" + '|'.join(f"{c}:{A[c]['p_dep']-A[c]['p_dep_n']:+.0%}/{A[c]['ecart']:+.0f}€" for c in 'GFEDC' if c in A) + f"|tous {statistics.mean(x['p_dep'] for x in Rv):.1%}")
    # --- chauffage électrique vs gaz à classe égale (effet d'équipement) : plafond moyen selon alpha
    print('\n## ÉQUIPEMENT : à classe et taille égales, plafond moyen des logements chauffés à l\'électricité moins celui des logements chauffés au gaz (€/mois) ; besoin moyen kWh/m²')
    for alpha, R in VAR.items():
        r = []
        for v in ['paris', 'lyon', 'grenoble', 'angers']:
            for c in ['E', 'F']:
                e = [x for x in R if x['ville'] == v and x['classe'] == c and M.categorie_energie(x['energie_ch']) == 'electricite']
                g = [x for x in R if x['ville'] == v and x['classe'] == c and M.categorie_energie(x['energie_ch']) == 'gaz']
                if len(e) >= 20 and len(g) >= 20:
                    r.append(f"{v}-{c}: {statistics.mean(x['plaf']-x['neutre'] for x in e)-statistics.mean(x['plaf']-x['neutre'] for x in g):+.0f} (n {len(e)}/{len(g)}, besoin {statistics.mean((x['besoin_ch'])/x['surface'] for x in e):.0f}/{statistics.mean((x['besoin_ch'])/x['surface'] for x in g):.0f})")
        print(f'alpha={alpha}: ' + ' ; '.join(r))
    # --- recoupement avec les observatoires locaux des loyers (loyers en cours, hors charges)
    print('\n## RECOUPEMENT carte des loyers (annonces, charges comprises) / observatoires locaux des loyers (parc en cours, hors charges)')
    print('ville|pièces|surface OLL|loyer médian OLL €/mois|droite de marché (carte) à cette surface, moyenne des DPE à ±4 m²|rapport carte/OLL|sigma OLL ln(D9/D1)/2,563 ou ln(Q3/Q1)/1,349')
    R = R0   # avant recalage
    for r in csv.DictReader(open(D + 'oll_extraits.csv')):
        sf = float(r['surface_moyenne']); med = float(r['loyer_mensuel_median'])
        X = [x['ligne'] for x in R if x['ville'] == r['ville'] and abs(x['surface'] - sf) <= 4]
        if r['loyer_mensuel_d1'] and r['loyer_mensuel_d9']: sg = math.log(float(r['loyer_mensuel_d9']) / float(r['loyer_mensuel_d1'])) / 2.563
        else: sg = math.log(float(r['loyer_mensuel_q3']) / float(r['loyer_mensuel_q1'])) / 1.349
        if len(X) >= 10: print(f"{r['ville']}|{r['pieces']}|{sf:.0f}|{med:.0f}|{statistics.mean(X):.0f} (n {len(X)})|{statistics.mean(X)/med:.2f}|{sg:.2f}")
    # --- sensibilité : plafond k × médiane et dispersion des loyers, part de l'ensemble des logements au-dessus du plafond
    print('\n## SENSIBILITÉ (prix central, primes H9) : part des logements dont le loyer dépasse le plafond / baisse moyenne €/mois (tous)')
    print('k|sigma x|' + '|'.join(['paris', 'lyon', 'grenoble', 'angers', 'creuse-appartement', 'creuse-maison']))
    for k in [1.1, 1.2, 1.3, 1.5]:
        for fs in [0.8, 1.0, 1.2]:
            sc = dict(k=k, prix=1.0, primes=1.0, sig=fs)
            R = []
            for z, L in TOUT.items(): R += evaluer(L, z, sc)
            cells = []
            for v in ['paris', 'lyon', 'grenoble', 'angers', 'creuse-appartement', 'creuse-maison']:
                a = agreger([x for x in R if x['ville'] == v], lambda x: 'tous')['tous']
                cells.append(f"{a['p_dep']:.0%} / {a['b_tous']:.0f}")
            print(f'{k}|{fs}|' + '|'.join(cells))
    import cas_types
    cas_types.executer(TOUT, resultats, evaluer, droite_segment, segments)
