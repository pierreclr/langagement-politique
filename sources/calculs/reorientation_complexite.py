#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Chiffrage de la réorientation de l'industrie de la complexité (05/11/2026).

Ne refait aucun modèle : assemble T6 (modeles/industrie-complexite), la reconversion
(modeles/reconversion, extrait par reorientation_complexite_extrait.js -> .json) et le bilan global.
Hypothèses et ordres de grandeur, jamais des prédictions. Lancer : python3 sources/calculs/reorientation_complexite.py
Sortie : tableaux (stdout) ; les assert échouent si une réconciliation avec les modèles existants se rompt.
"""
import json, os

ICI = os.path.dirname(os.path.abspath(__file__))
SC = ['bas', 'central', 'haut']
I = {s: i for i, s in enumerate(SC)}

# ---------------------------------------------------------------- 1. T6 : ce qui disparaît, par activité
# Source : modeles/industrie-complexite/modele.js, M.evaluer(M.SEGMENTS, sc).detail (jsc), champs emploisDisparait et montantDisparait.
# emplois = équivalents temps plein ; Md€ = coût évité par les clients (comptable, pas un gain de PIB).
T6 = {  # activité : (emplois bas, central, haut), (Md€ bas, central, haut), bloc
    'Expertise comptable (hors audit)': ((27671, 59296, 102780), (3.51, 7.52, 13.04), 'A'),
    'Audit légal': ((234, 702, 1404), (0.03, 0.09, 0.18), 'A'),
    'Activités juridiques (part fiscale et sociale, notaires compris)': ((2850, 9501, 19953), (0.48, 1.59, 3.35), 'A'),
    'Éditeurs et prestataires de paie': ((449, 1403, 3142), (0.09, 0.28, 0.63), 'A'),
    'Cabinets de CIR et d\'optimisation des charges': ((1038, 3088, 5238), (0.16, 0.46, 0.79), 'A'),
    'Conseil en défiscalisation patrimoniale': ((2250, 5250, 9450), (0.22, 0.52, 0.94), 'A'),
    'Services internes (paie, comptabilité, fiscalité)': ((72177, 180442, 336825), (5.26, 13.15, 24.55), 'B'),
}
MENAGES_MD = (0.25, 0.70, 1.79)          # Md€ de temps des ménages qui disparaît (T6, bloc C)
T6_TOTAL = {'emplois': (106669, 259682, 478792), 'md': (9.997, 24.320, 45.260)}   # sortie de M.evaluer().total

H_AN = 1607            # heures par ETP et par an (durée légale annualisée ; méthode T6 H8 : recoupement DB / 1 607 h)
EUR_H_MENAGES = 12.0   # € de l'heure des ménages (T6 H9)
EXTERNE = [k for k, v in T6.items() if v[2] == 'A']
INTERNE = [k for k, v in T6.items() if v[2] == 'B'][0]

def emplois(k, s): return T6[k][0][I[s]]
def tot_emplois(s): return sum(emplois(k, s) for k in T6)
def tot_externe(s): return sum(emplois(k, s) for k in EXTERNE)
def tot_md(s): return sum(T6[k][1][I[s]] for k in T6) + MENAGES_MD[I[s]]

for s in SC:   # réconciliation avec T6 (arrondis des Md€ à 0,05)
    assert abs(tot_emplois(s) - T6_TOTAL['emplois'][I[s]]) <= 5, (s, tot_emplois(s))
    assert abs(tot_md(s) - T6_TOTAL['md'][I[s]]) <= 0.06, (s, tot_md(s))

def heures_menages(s): return MENAGES_MD[I[s]] * 1e9 / EUR_H_MENAGES   # heures par an
def heures_interne(s): return emplois(INTERNE, s) * H_AN
def heures_externe(s): return tot_externe(s) * H_AN

# ---------------------------------------------------------------- 2. Calendriers (années de montée de la loi)
# 4 = bascule rapide (2029-2032), 10 = bascule annoncée sur dix ans (2029-2038), 7 = intermédiaire. Année 1 = 2029.
def part(n_ans, t): return min(1.0, t / n_ans)

# ---------------------------------------------------------------- 3. Reconversion et gain (modeles/reconversion, via jsc)
REC = json.load(open(os.path.join(ICI, 'reorientation_complexite_extrait.json')))
CAS = {'bas': 'bas|', 'central': 'central|', 'haut': 'haut|'}
def rec(s, cal): return REC['%s|%s' % (s, cal)]

# contrôle de réconciliation avec modeles/reconversion/resultats.txt
assert round(rec('central', '4')['deplaces'] / 1000) == 106 and round(rec('central', '10')['deplaces'] / 1000) == 16
assert round(rec('haut', '4')['deplaces'] / 1000) == 359 and round(rec('haut', '10')['deplaces'] / 1000) == 304
assert abs(rec('central', '4')['prodManquanteCumulee'] - 28.4) < 0.1 and abs(rec('central', '4')['budgetNetCumule'] - 5.51) < 0.02

CONV = {'v1': 'travail de complexité sans valeur, travail réalloué à 100 % de la VA',
        'v2': 'complexité 25 % utile, travail réalloué à 85 %',
        'prudente': 'complexité 50 % utile, travail réalloué à 70 %'}
PRODUCTION = {'v1': 'gainV1', 'v2': 'gainV2', 'prudente': 'gainPrudente'}

def gain_pib(s, cal, an, conv):
    """Effet sur la production (PIB réel), Md€/an, AVANT coûts publics de reconversion et du système :
    gain net du modèle de reconversion + coût du système public rajouté (compté en D18 du bilan : pas deux fois) + formation rajoutée (coût public)."""
    r = rec(s, cal); o = r[an]
    montee = min(1.0, o['postesCumules'] / r['postes'])
    return o[PRODUCTION[conv]] + r['coutSysteme'] * montee + o['formation'] + o['mobilite']

TAUX_MARGINAL = {'bas': 0.30, 'central': 0.34, 'haut': 0.43}
# bas : 42 % × assiette du prélèvement unique / PIB (887,2 / 0,42 = 2 112 Md€ ; 2 112 / 2 935 = 72 %) = 30 % ;
# central : + TVA et accises sur la part consommée (≈ +4 points, hypothèse) ; haut : 42,7 % = taux moyen PO/PIB de `palier1.js` (PO = 0,427).
PIB = 2935.0
assert abs(887.2 / 0.42 / PIB * 0.42 - 0.30) < 0.005

def recettes(s, cal, an, conv):
    return gain_pib(s, cal, an, conv) * TAUX_MARGINAL[s]

def cout_public_annuel(s, cal, an):
    """Allocations versées aux déplacés + formation (l'impôt perdu est déjà dans le gain net : pas de double compte)."""
    o = rec(s, cal)[an]; return o['allocations'] + o['formation'] + o['mobilite']

# levier D de palier1.js (création de valeur) = gain net de T6 × PO, déjà dans le chemin de dette
D_LEVIER = {'bas': (3.5, 15), 'central': (15, 10), 'haut': (33, 5)}   # (Md€ à régime, années de montée), convention de la source (gains faibles/moyens/forts)
PO = 0.427

# ---------------------------------------------------------------- Sorties
def f1(x): return ('%.1f' % x).replace('.', ',')
def k(x): return '%d' % round(x / 1000) + ' k'
def M(x): return '%d' % round(x / 1e6)

if __name__ == '__main__':
    print('## 1. Emplois (ETP) et heures libérés en régime, par activité (T6)')
    print('activité | emplois bas / central / haut | heures M h par an')
    for kx in T6:
        e = T6[kx][0]; print('%s | %s / %s / %s | %s / %s / %s' % (kx, k(e[0]), k(e[1]), k(e[2]), M(e[0] * H_AN), M(e[1] * H_AN), M(e[2] * H_AN)))
    print('Total emplois | %s' % ' / '.join(k(tot_emplois(s)) for s in SC))
    print('Ménages (M h) | %s' % ' / '.join(M(heures_menages(s)) for s in SC))
    print('Temps chez les entreprises et ménages (M h) | %s' % ' / '.join(M(heures_interne(s) + heures_menages(s)) for s in SC))
    print('Emplois du secteur externe (k) | %s ; heures M h | %s' % (' / '.join(k(tot_externe(s)) for s in SC), ' / '.join(M(heures_externe(s)) for s in SC)))
    print('Heures libérées totales (M h) | %s' % ' / '.join(M(heures_interne(s) + heures_menages(s) + heures_externe(s)) for s in SC))
    print('Par employeur privé (1,566 M, Urssaf 2024), heures internes libérées | %s' % ' / '.join('%d h' % round(heures_interne(s) / 1.566e6) for s in SC))
    print('\n## 2. Calendrier : part libérée à 5 ans (2033) et 10 ans (2038)')
    for n in (4, 7, 10):
        print('montée en %d ans : 5 ans %d %%, 10 ans %d %%' % (n, part(n, 5) * 100, part(n, 10) * 100))
    for n in (4, 10):
        for t in (5, 10):
            print('central, montée %d ans, à %d ans : emplois libérés %s (dont interne %s, externe %s), heures %s M h' % (
                n, t, k(tot_emplois('central') * part(n, t)), k(emplois(INTERNE, 'central') * part(n, t)), k(tot_externe('central') * part(n, t)),
                M((heures_interne('central') + heures_menages('central') + heures_externe('central')) * part(n, t))))
    print('\n## 3. Reconversion (modeles/reconversion)')
    for cal in ('4', '7', '10'):
        for s in SC:
            r = rec(s, cal); print('%s, %s ans | postes %s | déplacés %s | retraite sans retour %s | production manquante %s Md€ | budget net cumulé %s Md€ | formation %s Md€' % (
                s, cal, k(r['postes']), k(r['deplaces']), k(r['retraiteSansRetour']), f1(r['prodManquanteCumulee']), f1(r['budgetNetCumule']), f1(r['formationCumulee'])))
    print('\n## 4. Production (PIB réel) et recettes, convention v2 ; Md€ par an')
    for cal in ('4', '10'):
        for an in ('an5', 'an10', 'an2045'):
            print('montée %s ans, %s : PIB %s | recettes %s | coût public (allocations + formation) %s' % (cal, an,
                  ' / '.join(f1(gain_pib(s, cal, an, 'v2')) for s in SC), ' / '.join(f1(recettes(s, cal, an, 'v2')) for s in SC),
                  ' / '.join(f1(cout_public_annuel(s, cal, an)) for s in SC)))
    print('conventions, central, croisière, montée 10 ans : ' + ' | '.join('%s %s' % (c, f1(gain_pib('central', '10', 'an2045', c))) for c in CONV))
    print('croisière en % du PIB (v2) : ' + ' / '.join('%.2f %%' % (gain_pib(s, '10', 'an2045', 'v2') / PIB * 100) for s in SC))
    print('levier D palier1 (recettes à régime) : ' + ' / '.join(f1(D_LEVIER[s][0] * PO) for s in SC))
    # -------- 5. Contrôles et sensibilités
    print('\n## 5. Contrôles et sensibilités')
    STRICT_EMPLOIS = (49000, 147200, 345800)    # sources/cout-complet-prelevement.md § 4 (emplois privés concernés)
    STRICT_MD = (4.6, 13.8, 32.4)
    for s in SC:
        ratio = STRICT_EMPLOIS[I[s]] / tot_emplois(s)
        print('périmètre strict, %s : %s emplois (%.0f %% de T6) ; PIB v2 en croisière ≈ %s Md€ ; recettes ≈ %s' % (
            s, k(STRICT_EMPLOIS[I[s]]), ratio * 100, f1(gain_pib(s, '10', 'an2045', 'v2') * ratio), f1(recettes(s, '10', 'an2045', 'v2') * ratio)))
    for fac in (1.0, 0.5):
        e = tot_emplois('central') - emplois(INTERNE, 'central') * (1 - fac); r = e / tot_emplois('central')
        print('central, bloc interne × %.1f : %s emplois ; PIB v2 ≈ %s ; recettes ≈ %s' % (fac, k(e), f1(gain_pib('central', '10', 'an2045', 'v2') * r), f1(recettes('central', '10', 'an2045', 'v2') * r)))
    print('contrôle Doing Business : %d h/employeur libérées (T6 central, interne) contre 139 h de conformité totale de la PME type (3 impôts, 2018)' % round(heures_interne('central') / 1.566e6))
    # CEE et intermédiaires des aides : NON dans T6 (hypothèse de Claude, non ajoutée aux totaux)
    CEE_MD = 4.0     # prélèvement caché des CEE (bilan global, N12)
    PART = (0.05, 0.10, 0.20); CA_PAR_ETP = 25.07e9 / 197653   # CA par emploi de l'expertise comptable (T6)
    print('CEE (hors T6, ⚠️ non ajouté) : part captée par les intermédiaires %s -> CA %s Md€, ≈ %s emplois' % (
        ' / '.join('%d %%' % (p * 100) for p in PART), ' / '.join(f1(CEE_MD * p) for p in PART), ' / '.join(k(CEE_MD * p * 1e9 / CA_PAR_ETP) for p in PART)))
    # comparaison au levier D
    print('recettes en croisière : levier D %s contre ce chiffrage (v2, taux marginal) %s ; écart central %s Md€' % (
        ' / '.join(f1(D_LEVIER[s][0] * PO) for s in SC), ' / '.join(f1(recettes(s, '10', 'an2045', 'v2')) for s in SC),
        f1(recettes('central', '10', 'an2045', 'v2') - D_LEVIER['central'][0] * PO)))
    # gain comptable contre gain réel (central) : à ne pas additionner
    print('central : coût évité (comptable) %s Md€ ; production réelle v2 %s Md€ ; prudente %s Md€ (ratios %s %% et %s %%)' % (
        f1(tot_md('central')), f1(gain_pib('central', '10', 'an2045', 'v2')), f1(gain_pib('central', '10', 'an2045', 'prudente')),
        round(gain_pib('central', '10', 'an2045', 'v2') / tot_md('central') * 100), round(gain_pib('central', '10', 'an2045', 'prudente') / tot_md('central') * 100)))
    # recettes nettes du coût public de transition, cumul 2029-2038 (central, montée 10 ans), à partir des séries an5 et an10 : bornes seulement
    print('coût public annuel de transition (allocations + formation), central, montée 4 / 10 ans, an5 : %s / %s Md€' % (f1(cout_public_annuel('central', '4', 'an5')), f1(cout_public_annuel('central', '10', 'an5'))))
