#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Décomposition des prélèvements obligatoires 42,7 % -> 51,6 % du PIB (système arrêté, couches DECISIONS0811 et CORRECTION0811 (différé corrigé), régime de croisière, central, Md€ par an, euros 2024-2025 sans croissance).
Relit les sorties de sources/calculs/bilan_global.py (aucun chiffre du bilan n'est recopié ; les rares constantes d'entrée sont nommées et sourcées ci-dessous).
Identité de départ (comptable, exacte) :
    PO_après - PO_avant = (Dép_après - Dép_avant) + (déficit_avant - déficit_après) - (Hors-PO_après - Hors-PO_avant)
Usage : python3 -I sources/calculs/decomposition_prelevements_0811.py        -> tests + tableaux
        python3 -I sources/calculs/decomposition_prelevements_0811.py --md   -> tableaux en Markdown
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bilan_global as B

# --- Constantes d'entrée (hors bilan) -------------------------------------------------------------------------------------------
ALLEGEMENTS_GENERAUX = 64.9    # Md€, 2024, allègements généraux de cotisations, régimes de base (PLFSS 2026 ; sources/economies-cachees-et-transition.md ; cote A)
COMPLEMENTAIRES_TOTAL = 46.5   # Md€, 2024, cotisations HT des complémentaires santé (sources/economies-cachees-et-transition.md § 6.1 ; cote B)
PART_OBLIGATOIRE = 0.75        # part des contrats collectifs obligatoires (borne 50-100 %, V17312 ⚠️), même hypothèse que po_elargis
RECETTES_BILLETS_URBAINS = 4.57  # Md€/an, recettes de billetterie des transports urbains supprimées par la gratuité (MODELE['tu58_recettes'], central) ; part payée par les ménages non isolée ⚠️
RDB_MENAGES = 1700.0           # Md€, ordre de grandeur du revenu disponible brut des ménages 2024 ⚠️ À VÉRIFIER (Insee, comptes nationaux ; non présent dans le dépôt)
TRANSFERTS_AVANT_IDS = ['D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08']   # prestations en espèces hors retraites aujourd'hui (chômage, RSA, ASS, prime d'activité, APL, famille, AAH), cur du bilan
IJ_AVANT = 12.1                # Md€, indemnités journalières maladie 2024 (sources/garantie-transition.md § 12 ; tableau-de-bord § 2) : dans la garantie de transition après
PIB = B.PIB
D8 = B.DECISIONS0811
S3 = B.CORRECTION0811['S3']   # S3 recalibré après la correction du double compte du différé (couche CORRECTION0811, 08/11/2026) ; l'avant est B.DECISIONS0811['S3']

def lignes_chaine():
    """Toutes les lignes de dépense du bilan jusqu'au système arrêté, en variation de DÉPENSE (+ = la dépense monte), par identifiant."""
    dep = {}
    def add(i, x): dep[i] = dep.get(i, 0.0) + x
    for l in B.L:
        if l['sens'] == 'dep': add(l['id'], l['delta'])
    for l in B.L510: add(l['id'], l['delta'])
    for l in B.L72:
        if l['sens'] == 'dep': add(l['id'], l['delta'])
    for c in B.CORR_T65:
        if c['applique'] and c['d_dep']: add(c['id'], c['d_dep'])
    for l in B.L_BASE:
        if l['sens'] == 'dep': add(l['id'], -l['v'][1])
    for l in B.L_CONSO:
        if l.get('sens', 'dep') == 'dep': add(l['id'], -l['v'][1])
    for l in B.L_D7['gtc_droite']:
        if l['sens'] == 'dep': add(l['id'], -l['v'][1])
    for l in B.L_D8:
        if l['sens'] == 'dep': add(l['id'], -l['v'][1])
    return dep

def levier_depenses_regime():
    """Économies de dépense des leviers S3 en régime (M1f + M2m + M3, recouvrement déduit) + économies de fonctionnement comprises dans F ; Md€/an (sorties CONSO0611 et S3)."""
    lv = B.CONSO0611['leviers']; rec = B.CONSO0611['recouvrement']['M1f'][1]['total']
    return lv['M1f'][-1] + lv['M2m'][-1] + lv['M3'][-1] - rec

def comptes():
    po_av = B.PO_AVANT; po_ap = S3['po']['md']
    hors_av = B.HORS_PO_AVANT
    hors_ap = hors_av + sum(c['d_hors'] for c in B.CORR_T65 if c['applique'])
    e = S3['effetCouche']; F = S3['F']
    solde_ap = B.SOLDE_BASE_CONSO + e + levier_depenses_regime() + F
    dep_av = B.DEPENSES_AVANT; dep_ap = po_ap + hors_ap - solde_ap
    return dict(po_av=po_av, po_ap=po_ap, hors_av=hors_av, hors_ap=hors_ap, solde_av=B.DEFICIT_AVANT, solde_ap=solde_ap, dep_av=dep_av, dep_ap=dep_ap, F=F, e=e)

def classes(dep):
    """Regroupe les variations de dépense par grande famille (ids du bilan). Retour : dict nom -> Md€ ; 'reste' = écart à la dépense totale."""
    g = lambda ids: sum(dep.get(i, 0.0) for i in ids)
    c = {}
    c['versements'] = g(['N20', 'N21', 'N22', 'N23', 'N24', 'N25', 'N26', 'D34', 'D35', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25'])
    c['prestations_remplacees'] = g(['D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09'])
    c['garantie_pont'] = g(['DG01', 'DG03', 'DG04'])
    c['secu100'] = g(['BT04', 'BT06', 'BT07'])
    c['sante_economies'] = g(['D11', 'D12'])
    c['retraites_v6'] = g(['D01', 'D29', 'D30'])
    c['reclassement_credits'] = dep.get('C02', 0.0) + dep.get('D14', 0.0)     # -8,885 et -8,0 : miroir des +16,9 de PO (hors-PO -> PO), solde nul
    c['artificialisation_flechee'] = g(['ZA02'])      # miroir exact de la recette ZA01 (+6,5 de PO) : recette = dépense
    c['nouvelles'] = g(['D31', 'D32', 'GA01', 'GA02', 'JU01', 'EN01', 'IM01', 'OM01', 'OM02', 'PL01', 'PL02', 'DC02', 'VI01', 'D33'])
    c['economies_structurelles'] = g(['D13', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20', 'D23', 'D24', 'D25', 'D26', 'D27', 'C01', 'BT12', 'CL01', 'CS01'])
    c['leviers'] = -levier_depenses_regime() - S3['eco']
    return c

def decomposition():
    k = comptes(); dep = lignes_chaine(); c = classes(dep)
    d_dep = k['dep_ap'] - k['dep_av']; d_po = k['po_ap'] - k['po_av']
    d_def = k['solde_ap'] - k['solde_av']; d_hors = k['hors_ap'] - k['hors_av']
    c['reste'] = d_dep - sum(c.values())
    return dict(k=k, dep=dep, c=c, d_dep=d_dep, d_po=d_po, d_def=d_def, d_hors=d_hors)

def transferts():
    """Transferts monétaires aux ménages hors retraites, aujourd'hui et dans le système (Md€/an)."""
    dep = lignes_chaine()
    avant = sum(l['cur'] for l in B.L if l['id'] in TRANSFERTS_AVANT_IDS) + IJ_AVANT
    versements = classes(dep)['versements']
    residuels = sum(l['cur'] + dep.get(l['id'], 0.0) for l in B.L if l['id'] in ('D03', 'D07', 'D08'))   # RSA (complément), famille (mode de garde, PreParE), AAH (différentiel)
    garantie = 28.69   # versé après (chômage + arrêts maladie), sources/garantie-transition.md § 12 (variante coût constant) ; remplace D02 + IJ
    apres = versements + residuels + garantie
    return dict(avant=avant, apres=apres, versements=versements, residuels=residuels, garantie=garantie)

def indicateurs():
    k = comptes(); t = transferts()
    po_el_av = k['po_av'] + B.REGLEMENTES + COMPLEMENTAIRES_TOTAL * PART_OBLIGATOIRE
    po_el_ap = k['po_ap'] + B.REGLEMENTES - 0.5
    net_av = k['po_av'] - t['avant']; net_ap = k['po_ap'] - t['apres']
    tc_av = k['po_av'] + COMPLEMENTAIRES_TOTAL + B.REGLEMENTES + RECETTES_BILLETS_URBAINS - t['avant']
    tc_ap = k['po_ap'] + 0.0 + (B.REGLEMENTES - 0.5) + 0.0 - t['apres']
    return dict(po_el_av=po_el_av, po_el_ap=po_el_ap, net_av=net_av, net_ap=net_ap, tc_av=tc_av, tc_ap=tc_ap, t=t)

# --- Prélèvement caché : lecture « réelle » (tout ce que l'on paie par obligation, y compris par le privé et la complexité) -------
COMPLEXITE_AVANT = {'bas': 25.6, 'central': 41.2, 'haut': 57.2}    # Md€/an, modeles/industrie-complexite/resultats.md (revue du 03/11/2026, cote B)
COMPLEXITE_DISPARAIT = {'bas': 10.1, 'central': 24.5, 'haut': 45.4}  # part qui disparaît avec le système (même fichier ; hypothèse haute 80 % au-dessus du meilleur précédent, Estonie 64 % ⚠️)
COMMISSIONS_TITRES_RESTAURANT = 0.44   # Md€/an central (0,35 à 0,56), sources/economies-cachees-et-transition.md ; chèques-vacances : non isolés ⚠️ ; prévoyance obligatoire d'entreprise : non chiffrée ⚠️
def lecture_reelle(sc='central'):
    k = comptes(); t = transferts()
    regl_av = B.REGLEMENTES; regl_ap = B.REGLEMENTES - 0.5
    caches_av = COMPLEMENTAIRES_TOTAL + COMMISSIONS_TITRES_RESTAURANT + RECETTES_BILLETS_URBAINS + COMPLEXITE_AVANT[sc] + regl_av
    caches_ap = regl_ap + (COMPLEXITE_AVANT[sc] - COMPLEXITE_DISPARAIT[sc])
    d = decomposition()
    r = dict(off_av=k['po_av'], off_ap=k['po_ap'], caches_av=caches_av, caches_ap=caches_ap,
             reelle_av=k['po_av'] + caches_av, reelle_ap=k['po_ap'] + caches_ap)
    r['reelle_net_av'] = r['reelle_av'] - t['avant']; r['reelle_net_ap'] = r['reelle_ap'] - t['apres']
    r['reelle_net_ap_deficit_constant'] = r['reelle_net_ap'] - d['d_def']
    return r

def pont_comptable(d=None):
    """Pont en points de PIB par EMPLOI de l'argent (identité) : PO = dépense + réduction du déficit ; les reclassements de crédits se compensent (PO +16,9, dépense -16,9)."""
    d = d or decomposition(); c = d['c']
    transferts = c['versements'] + c['prestations_remplacees'] + c['garantie_pont']
    return [
        ('c', 'Réduction du déficit (169,1 vers le solde de régime)', d['d_def']),
        ('a1', 'Transferts : allègements généraux de cotisations devenus versements (comptable)', ALLEGEMENTS_GENERAUX),
        ('a2', 'Transferts : autres versements en brut nets des prestations remplacées (quotient familial, décote, réductions d impôt non isolés ; part réelle de redistribution)', transferts - ALLEGEMENTS_GENERAUX),
        ('b', 'Santé : Sécurité sociale à 100 % (BT04, BT06, BT07) nette des économies de santé (D11, D12)', c['secu100'] + c['sante_economies']),
        ('d', 'Nouvelles dépenses (gratuité urbaine, grand âge, justice, enfance, outre-mer, crèches, CIR réorienté, imprévus)', c['nouvelles']),
        ('e', 'Taxe d artificialisation : recette brute fléchée vers la renaturation (recette = dépense)', c['artificialisation_flechee']),
        ('r', 'Retraites : dispositif V6 (âge libre, plancher, substitution)', c['retraites_v6']),
        ('s', 'Économies de dépense (structurelles et leviers de la règle de dette)', c['economies_structurelles'] + c['leviers']),
        ('f', 'Reste non expliqué', c['reste']),
    ]

def conversions_en_salaire():
    """Hausse de PO qui n'est qu'une conversion d'avantages en salaire (coût employeur inchangé) : BT08, BT09 (base) et CS01, CS02 (couche 0811) ; Md€/an central."""
    v = {l['id']: l['v'][1] for l in B.L_BASE if l['id'] in ('BT08', 'BT09')}
    v.update({l['id']: l['v'][1] for l in B.L_D8 if l['id'] in ('CS01', 'CS02')})
    return v

def pts(x): return 100 * x / PIB
def f1(x): return ('%.1f' % x).replace('.', ',').replace('-', '−')
def f2(x): return ('%.2f' % x).replace('.', ',').replace('-', '−')
def sg(x, n=1): return ('+' if x >= 0 else '−') + (('%.' + str(n) + 'f') % abs(x)).replace('.', ',')

def tests():
    d = decomposition(); k = d['k']
    assert abs(k['po_av'] / PIB - 0.427) < 1e-9
    assert abs(k['po_ap'] / PIB - S3['po']['pct']) < 1e-12 and abs(S3['po']['pct'] - 0.5157458716416314) < 1e-9, 'PO 51,6 % (après correction du différé ; 52,2 % avant)'
    # identité comptable
    assert abs(d['d_po'] - (d['d_dep'] + d['d_def'] - d['d_hors'])) < 1e-9, 'identité PO = dépense + réduction du déficit - hors-PO'
    # cohérence avec la chaîne du bilan : recettes de la base de travail - dépenses de la base = solde de la base
    assert abs(B.PO_BASE + k['hors_ap'] - B.DEP_BASE - B.SOLDE_BASE) < 1e-6, 'base : PO + hors-PO - dépenses = solde'
    assert abs(sum(d['c'].values()) - d['d_dep']) < 1e-9
    assert abs(d['c']['reste']) < 0.05, 'fermeture : dépense de la chaîne de lignes = dépense déduite du solde (reste nul)'
    assert abs(d['c']['reclassement_credits'] - d['d_hors']) < 1e-9, 'reclassement : dépense -16,9 = miroir du hors-PO -16,9'
    assert abs(d['c']['artificialisation_flechee'] - sum(l['v'][1] for l in B.L_D8 if l['id'] == 'ZA01')) < 1e-9
    r = lecture_reelle(); assert r['reelle_net_ap'] - r['reelle_net_av'] < r['off_ap'] - r['off_av'], 'la lecture réelle nette écarte moins que l officielle'
    return True

def md():
    d = decomposition(); k = d['k']; c = d['c']; i = indicateurs(); t = i['t']
    out = []
    out.append('PO avant %s (%s %%) ; après %s (%s %%) ; variation %s (%s points)' % (f1(k['po_av']), f1(pts(k['po_av'])), f1(k['po_ap']), f1(pts(k['po_ap'])), sg(d['d_po']), f2(pts(d['d_po']))))
    out.append('Solde avant %s ; après (régime, statique) %s ; amélioration %s' % (f1(k['solde_av']), f1(k['solde_ap']), sg(d['d_def'])))
    out.append('Dépense avant %s (%s %%) ; après %s (%s %%) ; variation %s (%s points)' % (f1(k['dep_av']), f1(pts(k['dep_av'])), f1(k['dep_ap']), f1(pts(k['dep_ap'])), sg(d['d_dep']), f2(pts(d['d_dep']))))
    out.append('Hors-PO avant %s ; après %s' % (f1(k['hors_av']), f1(k['hors_ap'])))
    for n, v in c.items(): out.append('  dépense : %-28s %s (%s pt)' % (n, sg(v, 2), f2(pts(v))))
    out.append('Transferts monétaires hors retraites : avant %s ; après %s (versements %s + résiduels %s + garantie %s)' % (f1(t['avant']), f1(t['apres']), f1(t['versements']), f1(t['residuels']), f1(t['garantie'])))
    for cle, lib, v in pont_comptable(d): out.append('  pont %-3s %s (%s pt) %s' % (cle, sg(v, 1), f2(pts(v)), lib[:70]))
    out.append('  somme du pont %s ; conversions en salaire %s' % (sg(sum(v for _, _, v in pont_comptable(d)), 2), {a: round(b, 2) for a, b in conversions_en_salaire().items()}))
    out.append('Déficit (trajectoire macro de référence) : 2029 %s %% ; 2043 %s %% ; 2058 %s %% ; dernière année au-dessus de 3 %% : %s' % (f1(100 * S3['def'][0]), f1(100 * S3['def'][14]), f1(100 * S3['def'][29]), S3['dep3']))
    out.append('Dépense publique, convention égale (allègements comptés en dépense avant) : %s (%s %%) -> %s (%s %%)' % (f1(k['dep_av'] + ALLEGEMENTS_GENERAUX), f1(pts(k['dep_av'] + ALLEGEMENTS_GENERAUX)), f1(k['dep_ap']), f1(pts(k['dep_ap']))))
    for sc in ('bas', 'central', 'haut'):
        r = lecture_reelle(sc)
        out.append('Lecture réelle (%s) : brute %s %% -> %s %% ; nette des transferts %s %% -> %s %% ; à déficit inchangé après : %s %% ; cachés avant %s -> après %s' % (sc, f1(pts(r['reelle_av'])), f1(pts(r['reelle_ap'])), f1(pts(r['reelle_net_av'])), f1(pts(r['reelle_net_ap'])), f1(pts(r['reelle_net_ap_deficit_constant'])), f1(r['caches_av']), f1(r['caches_ap'])))
    out.append('PO élargis : %s (%s %%) -> %s (%s %%)' % (f1(i['po_el_av']), f1(pts(i['po_el_av'])), f1(i['po_el_ap']), f1(pts(i['po_el_ap']))))
    out.append('PO - transferts : %s (%s %%) -> %s (%s %%)' % (f1(i['net_av']), f1(pts(i['net_av'])), f1(i['net_ap']), f1(pts(i['net_ap']))))
    out.append('Tout compris - transferts : %s (%s %%) -> %s (%s %%) ; RDB ménages (⚠️ %s) : %s %% -> %s %%' % (f1(i['tc_av']), f1(pts(i['tc_av'])), f1(i['tc_ap']), f1(pts(i['tc_ap'])), f1(RDB_MENAGES), f1(100 * i['tc_av'] / RDB_MENAGES), f1(100 * i['tc_ap'] / RDB_MENAGES)))
    return '\n'.join(out)

if __name__ == '__main__':
    tests(); print(md()); print('Tests : tous passés.')
