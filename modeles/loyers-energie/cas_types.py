# -*- coding: utf-8 -*-
# Exemples concrets par ville et cas « travaux » (pompe à chaleur / isolation). Appelé par simuler.py.
import collections, statistics
import modele as M

COUT_ISO_M2, COUT_PAC_M2 = 160.0, 90.0   # H13 ⚠️ : 8 000 € et 4 500 € pour 50 m², hors aides (aides supprimées par la proposition)
SPECS = [('studio', 'E'), ('T2', 'C'), ('T2', 'G'), ('T3', 'B'), ('T3', 'D'), ('T3', 'F'), ('T4', 'C'), ('T4', 'G')]


def choisir(L, taille_, classe):
    g = [x for x in L if x['taille'] == taille_ and x['classe'] == classe]
    if len(g) < 5: return None
    mode = collections.Counter(M.categorie_energie(x['energie_ch']) for x in g).most_common(1)[0][0]
    g2 = [x for x in g if M.categorie_energie(x['energie_ch']) == mode]
    s = statistics.median(x['surface'] for x in g2)
    b = statistics.median(x['besoin_ch'] / x['surface'] for x in g2)
    return min(g2, key=lambda x: abs(x['surface'] - s) / s + abs(x['besoin_ch'] / x['surface'] - b) / b), len(g)


def paradoxe(rec, base_t, vp, v_marche, alphas, titre, mult_prix=1.0):
    lg = dict(surface=rec['surface'], besoin_ch=rec['besoin_ch'], besoin_froid=rec['besoin_froid'], conso_ch_ef=rec['conso_ch'],
              energie_ch=rec['energie_ch'], conso_autres=[])
    # autres usages : on retire le chauffage de la liste des consommations, par énergie
    rest = list(rec['cons'])
    for i, (e, c) in enumerate(rest):
        if e == rec['energie_ch']:
            rest[i] = (e, max(0.0, c - rec['conso_ch'])); break
    lg['conso_autres'] = rest
    print(f"\n### {titre}")
    print(f"logement type : {rec['surface']:.0f} m², classe {rec['classe']} (EP/m² {rec['ep_m2']:.0f}), chauffage {rec['energie_ch']}, besoin chauffage {rec['besoin_ch']/rec['surface']:.0f} kWh/m²/an, conso chauffage {rec['conso_ch']/rec['surface']:.0f} kWh EF/m²/an, base {base_t:.0f} €, v {vp:.2f} €/m²")
    cas = [('sans travaux', False, False), ('pompe à chaleur seule', True, False), ('isolation seule', False, True), ('isolation + pompe à chaleur', True, True)]
    for alpha in alphas:
        print(f'-- alpha = {alpha} (poids du coût réel de chauffage)')
        print('cas|surface réelle|classe DPE estimée|énergie réelle €/mois|déduction €/mois|plafond (surface de référence figée)|gain de plafond €/mois|plafond si surface non figée|règle actuelle (loyer au m² × surface réelle) : variation €/mois|coût travaux €|retour simple (ans, sur le gain de plafond)|retour (surface non figée)')
        ref = None
        for nom, pac, iso in cas:
            n = M.appliquer_travaux(lg, pac=pac, isolation=iso)
            ind = M.indicateurs_cas(n, alpha, mult_prix)
            if ref is None: ref = ind; ref_lg = lg
            plaf = M.plafond(base_t, vp, lg['surface'], ind['deduction'])
            plaf0 = M.plafond(base_t, vp, lg['surface'], ref['deduction'])
            plaf_nf = M.plafond(base_t, vp, n['surface'], ind['deduction'])
            gain, gain_nf = plaf - plaf0, plaf_nf - plaf0
            cout = (COUT_ISO_M2 * lg['surface'] if iso else 0) + (COUT_PAC_M2 * lg['surface'] if pac else 0)
            actuel = -(lg['surface'] - n['surface']) * v_marche
            r = f'{cout / (12 * gain):.1f}' if gain > 0.5 else 'jamais'
            rnf = f'{cout / (12 * gain_nf):.1f}' if gain_nf > 0.5 else 'jamais'
            print(f"{nom}|{n['surface']:.1f}|{ind['classe']}|{ind['cout_mensuel']:.0f}|{ind['deduction']:.0f}|{plaf:.0f}|{gain:+.0f}|{plaf_nf:.0f}|{actuel:+.0f}|{cout:.0f}|{r}|{rnf}")


def executer(TOUT, resultats, evaluer, droite_segment, segments):
    print('\n## EXEMPLES CONCRETS par ville (scénario central, alpha %.1f)' % M.ALPHA)
    print('ville|logement|surface m²|énergie chauffage|besoin kWh/m²|énergie réelle €/mois|déduction|plafond €/mois|loyer médian de marché (ce type et cette classe)|plafond moins marché|% de loyers au-dessus du plafond|n du groupe')
    RC = {}
    for z, L in TOUT.items():
        for lg in evaluer(L, z, 'central'): RC.setdefault(lg['ville'], []).append(lg)
    for v, L in RC.items():
        for t, c in SPECS:
            r = choisir(L, t, c)
            if not r: continue
            x, n = r
            print(f"{v}|{t} classe {c}|{x['surface']:.0f}|{M.categorie_energie(x['energie_ch'])}|{x['besoin_ch']/x['surface']:.0f}|{x['cout']:.0f}|{x['d']:.0f}|{x['plaf']:.0f}|{x['med']:.0f}|{x['plaf']-x['med']:+.0f}|{x['p_dep']:.0%}|{n}")
    # paradoxe : G chauffé au gaz (Grenoble) puis G chauffé au fioul (maison en Creuse)
    p = M.SCENARIOS['central']
    for (z, ville, cal_filter, energie, titre) in [('grenoble', 'grenoble', None, 'gaz', 'Grenoble, appartement G chauffé au gaz'),
                                                   ('creuse', 'creuse-maison', None, 'fioul', 'Creuse, maison G chauffée au fioul')]:
        L = [lg for lg in RC[ville] if lg['classe'] == 'G' and M.categorie_energie(lg['energie_ch']) == energie and 0.5 < lg['conso_ch'] / max(lg['besoin_ch'], 1) < 1.5]
        if z == 'grenoble': L = [lg for lg in L if 35 <= lg['surface'] <= 70]
        else: L = [lg for lg in L if 70 <= lg['surface'] <= 130]
        if not L: print('aucun cas pour', titre); continue
        s = statistics.median(x['surface'] for x in L); b = statistics.median(x['besoin_ch'] / x['surface'] for x in L)
        rec = min(L, key=lambda x: abs(x['surface'] - s) / s + abs(x['besoin_ch'] / x['surface'] - b) / b)
        seg = [lg for lg in TOUT[z] if (lg['typ'] == 'maison') == (ville == 'creuse-maison')] if z == 'creuse' else TOUT[z]
        for alpha in [1.0, 0.5, M.ALPHA, 0.0]:
            seg = [dict(x) for x in seg]
            for lg in seg:
                lg['d'] = M.deduction_mensuelle(M.cout_usages(lg['cons'], 1.0), lg['conso_ch'], lg['energie_ch'], lg['besoin_ch'] + lg['besoin_froid'], alpha, 1.0)
            dr = droite_segment(seg, ville)
            import simuler as _S
            g = _S.GAMMA.get(z, 1.0); dr = (dr[0] * g, dr[1] * g)
            bases, vp = M.calibrer_zone(seg, dr, p['k'], repli=seg)
            if alpha == 1.0: ref = (bases, vp, dr)
            # recalcul de la déduction du cas pour chaque alpha dans paradoxe()
            paradoxe(rec, bases[rec['taille']], vp, dr[1], [alpha], titre + f' (calibrage refait pour alpha = {alpha})')
