# -*- coding: utf-8 -*-
"""Procédures d'infraction au droit de l'UE : classement des 27, par habitant, durée, part réglée sans contentieux.
Données : décisions de la Commission (API de l'outil « Infringement decisions », voir
$DONNEES/sources/infractions-ue/LISEZMOI.md) et population Eurostat demo_pjan.
Usage : python3 infractions_ue.py [dossier_donnees]  -> imprime les tableaux et écrit resultats_infractions_ue.json
Définitions : un dossier = (numéro INFR, État membre). Année d'ouverture = année de la première décision du dossier (mise en demeure) ; cette définition reproduit à 1 % près
le nombre officiel de « nouveaux dossiers » du rapport 2023 (voir verification_officiel() ; l'année du numéro INFR(AAAA) s'en écarte davantage).
Fonctions pures en tête de fichier ; aucune hypothèse cachée."""
import json, glob, os, sys, statistics as st, collections as C
from datetime import datetime

UE27 = ['Austria','Belgium','Bulgaria','Croatia','Cyprus','Czechia','Denmark','Estonia','Finland','France','Germany','Greece',
        'Hungary','Ireland','Italy','Latvia','Lithuania','Luxembourg','Malta','Netherlands','Poland','Portugal','Romania',
        'Slovakia','Slovenia','Spain','Sweden']
ISO = dict(zip(UE27, ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','EL','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']))
FR = {'Austria':'Autriche','Belgium':'Belgique','Bulgaria':'Bulgarie','Croatia':'Croatie','Cyprus':'Chypre','Czechia':'Tchéquie','Denmark':'Danemark','Estonia':'Estonie','Finland':'Finlande','France':'France','Germany':'Allemagne','Greece':'Grèce','Hungary':'Hongrie','Ireland':'Irlande','Italy':'Italie','Latvia':'Lettonie','Lithuania':'Lituanie','Luxembourg':'Luxembourg','Malta':'Malte','Netherlands':'Pays-Bas','Poland':'Pologne','Portugal':'Portugal','Romania':'Roumanie','Slovakia':'Slovaquie','Slovenia':'Slovénie','Spain':'Espagne','Sweden':'Suède'}

def d(s): return datetime.strptime(s, '%d/%m/%Y')
def annee_numero(n): return int(n[5:9])

def charger(dossier):
    rows = []
    for f in sorted(glob.glob(os.path.join(dossier, 'brut', 'decisions_*.json'))): rows += json.load(open(f))
    return rows

def dossiers(rows):
    """Regroupe les décisions par dossier (numéro, État)."""
    g = C.defaultdict(list)
    for r in rows: g[(r['infringementNumber'], r['memberState'])].append(r)
    out = {}
    for k, v in g.items():
        v.sort(key=lambda r: d(r['decisionDate']))
        types = [r['decisionType'] for r in v]
        fermes = [r for r in v if r['decisionType'] == 'Closing of the case']
        out[k] = dict(numero=k[0], etat=k[1], annee=d(v[0]['decisionDate']).year, annee_numero=annee_numero(k[0]), ouverture=d(v[0]['decisionDate']),
                      fermeture=d(fermes[-1]['decisionDate']) if fermes else None,
                      type=v[-1]['caseType'], dg=v[-1]['leadDg'],
                      renvoi_cour=any(t.startswith('Referral') for t in types),
                      art260=any('260' in t for t in types), mise_en_demeure=any('ormal notice' in t for t in types))
    return out

def population(dossier):
    j = json.load(open(os.path.join(dossier, 'population_eurostat_demo_pjan.json')))
    g = j['dimension']['geo']['category']['index']; t = j['dimension']['time']['category']['index']
    n = len(t)
    return {a: j['value'][str(g[ISO[a]] * n + t['2023'])] for a in UE27}

def classement(dos, pop, a0=2014, a1=2023):
    res = []
    for e in UE27:
        c = [x for x in dos.values() if x['etat'] == e and a0 <= x['annee'] <= a1]
        res.append(dict(etat=e, n=len(c), par_million=len(c) / (pop[e] / 1e6),
                        par_type=dict(C.Counter(x['type'] for x in c)),
                        non_comm=sum(x['type'] == 'Non-communication' for x in c),
                        fond=sum(x['type'] != 'Non-communication' for x in c),
                        fond_par_million=sum(x['type'] != 'Non-communication' for x in c) / (pop[e] / 1e6),
                        renvois=sum(x['renvoi_cour'] for x in c)))
    return sorted(res, key=lambda r: -r['n'])

def durees(dos, a0=2014, a1=2023):
    """Mois entre la première décision et la clôture, dossiers ouverts a0..a1 et clos (estimateur biaisé vers le bas : les dossiers longs sont encore ouverts)."""
    par = {}
    for e in UE27:
        m = [(x['fermeture'] - x['ouverture']).days / 30.44 for x in dos.values()
             if x['etat'] == e and a0 <= x['annee'] <= a1 and x['fermeture']]
        par[e] = dict(clos=len(m), moy=st.mean(m), med=st.median(m)) if m else None
    tout = [(x['fermeture'] - x['ouverture']).days / 30.44 for x in dos.values()
            if x['etat'] in UE27 and a0 <= x['annee'] <= a1 and x['fermeture']]
    return par, dict(clos=len(tout), moy=st.mean(tout), med=st.median(tout))

def part_sans_contentieux(dos, a0=2004, a1=2023):
    par = {}
    for e in UE27 + ['UE27']:
        c = [x for x in dos.values() if (x['etat'] == e or e == 'UE27' and x['etat'] in UE27) and a0 <= x['annee'] <= a1 and x['fermeture']]
        par[e] = dict(clos=len(c), sans=sum(not x['renvoi_cour'] for x in c) / len(c) if c else None)
    return par

def verification_officiel(dos):
    """Compare au nombre officiel de nouveaux dossiers 2014-2023 (fiche d'accompagnement du rapport 2023, p. 2, UE28 jusqu'en 2019 puis UE27 + RU pour les dossiers antérieurs au Brexit)."""
    off = dict(zip(range(2014, 2024), [891, 746, 986, 717, 645, 798, 904, 847, 551, 529]))
    c = C.Counter(x['annee'] for x in dos.values())
    return {a: (off[a], c[a]) for a in off}

def par_annee(dos, a0=2004, a1=2026):
    c = C.Counter(x['annee'] for x in dos.values() if x['etat'] in UE27)
    cl = C.Counter(x['fermeture'].year for x in dos.values() if x['etat'] in UE27 and x['fermeture'])
    return {a: (c[a], cl[a]) for a in range(a0, a1 + 1)}

def par_domaine(dos, e=None, a0=2014, a1=2023):
    return C.Counter(x['dg'] for x in dos.values() if (e is None and x['etat'] in UE27 or x['etat'] == e) and a0 <= x['annee'] <= a1)

def ouverts(dos, rows):
    """Dossiers actifs selon le dernier enregistrement (champ activeInfringementCase)."""
    g = {}
    for r in sorted(rows, key=lambda r: d(r['decisionDate'])): g[(r['infringementNumber'], r['memberState'])] = r['activeInfringementCase']
    c = C.Counter(k[1] for k, v in g.items() if v == 'Yes' and k[1] in UE27)
    return c

if __name__ == '__main__':
    base = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '$DONNEES/sources/infractions-ue')
    rows = charger(base); dos = dossiers(rows); pop = population(base)
    print('décisions', len(rows), 'dossiers', len(dos))
    R = {}
    R['verif_officiel'] = verification_officiel(dos); print('officiel vs base :', R['verif_officiel'])
    cl = classement(dos, pop); R['classement_2014_2023'] = cl
    print('\n== Dossiers ouverts 2014-2023 (année de la 1re décision), UE27')
    tot = sum(r['n'] for r in cl); popt = sum(pop.values())
    print('rang pays | dossiers | par million | dont non-communication | renvois en Cour')
    for i, r in enumerate(sorted(cl, key=lambda r: -r['par_million']), 1):
        print(f"{i:2d} {FR[r['etat']]:12s} {r['n']:4d} {r['par_million']:6.1f} {r['non_comm']:4d} {r['renvois']:3d}")
    print('total', tot, 'moyenne par million', round(tot / (popt / 1e6), 1), 'médiane par pays', st.median(r['n'] for r in cl))
    print('\n== Dossiers « de fond » (hors non-communication) 2014-2023 : rang absolu, par million')
    for i, r in enumerate(sorted(cl, key=lambda r: -r['fond']), 1): print(f"{i:2d} {FR[r['etat']]:12s} {r['fond']:4d} {r['fond_par_million']:5.1f}  (part du total {r['fond']/r['n']:.0%})")
    print('UE27 part de fond', round(sum(r['fond'] for r in cl)/tot,3))
    R['rang_par_million'] = [r['etat'] for r in sorted(cl, key=lambda r: -r['par_million'])]
    R['rang_absolu'] = [r['etat'] for r in cl]
    dp, dt = durees(dos); R['durees'] = dict(par_pays=dp, ue=dt)
    print('\n== Durées (mois, dossiers 2014-2023 clos)'); print('UE27', {k: round(v, 1) if isinstance(v, float) else v for k, v in dt.items()})
    for e in sorted(UE27, key=lambda e: -(dp[e]['med'] if dp[e] else 0)):
        if dp[e]: print(f"{FR[e]:12s} clos {dp[e]['clos']:3d} moy {dp[e]['moy']:5.1f} méd {dp[e]['med']:5.1f}")
    ps = part_sans_contentieux(dos); R['sans_contentieux'] = ps
    print('\n== Part des dossiers clos (2004-2023) sans renvoi à la Cour'); print('UE27', ps['UE27'])
    for e in sorted(UE27, key=lambda e: ps[e]['sans'] or 0): print(f"{FR[e]:12s} {ps[e]['sans']:.3f} ({ps[e]['clos']})")
    pa = par_annee(dos); R['par_annee'] = pa
    print('\n== Par année (UE27) : ouverts, clos'); [print(a, v) for a, v in pa.items()]
    R['domaines_ue'] = par_domaine(dos); R['domaines_fr'] = par_domaine(dos, 'France')
    print('\n== Domaines 2014-2023 UE27'); [print(k, v) for k, v in R['domaines_ue'].most_common(8)]
    print('== France'); [print(k, v) for k, v in R['domaines_fr'].most_common(8)]
    t = C.Counter(); [t.update({x['type']: 1}) for x in dos.values() if x['etat'] in UE27 and 2014 <= x['annee'] <= 2023]
    R['types_ue'] = t; print('\n== Motifs UE27 2014-2023', t)
    tf = C.Counter(x['type'] for x in dos.values() if x['etat'] == 'France' and 2014 <= x['annee'] <= 2023); R['types_fr'] = tf; print('France', tf)
    o = ouverts(dos, rows); R['ouverts'] = o; print('\n== Dossiers actifs (dernier état) par pays', o.most_common(), sum(o.values()))
    json.dump(R, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resultats_infractions_ue.json'), 'w'), ensure_ascii=False, indent=1, default=str)
