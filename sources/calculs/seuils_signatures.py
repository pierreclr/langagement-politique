# -*- coding: utf-8 -*-
"""Seuils de signatures rapportés au corps électoral (chantier 9). Python 3 standard.
Données : Swissvotes (colonnes berecht, unter_g, rechtsform=3 initiative populaire). Usage : python3 -I seuils_signatures.py"""
import csv, os, statistics as st
p=os.path.expandvars('$DONNEES/sources/democratie/swissvotes_dataset.csv')
r=list(csv.DictReader(open(p,encoding='utf-8-sig'),delimiter=';'))
def num(s):
    s=(s or '').replace('’','').replace("'",'').replace(' ','')
    return int(s) if s.isdigit() else None
voted=[x for x in r if x['volk'] in('1','2') and num(x['berecht'])]
last=max(voted,key=lambda x:(x['datum'][-4:],x['datum'][3:5]))
E_ch=num(last['berecht']); print('Dernier scrutin',last['datum'],'inscrits CH',E_ch)
print('100 000 / inscrits = %.2f %% ; 50 000 = %.2f %%'%(1e5/E_ch*100,5e4/E_ch*100))
ini=[x for x in r if x['rechtsform']=='3' and num(x['unter_g']) and num(x['berecht']) and x['datum'][-4:]>='2000']
ratios=[num(x['unter_g'])/num(x['berecht'])*100 for x in ini]
req=[num(x['unter_g'])/1e5 for x in ini]
print('Initiatives votées depuis 2000 avec données :',len(ini))
print('Signatures valides / inscrits : médiane %.2f %%, min %.2f, max %.2f'%(st.median(ratios),min(ratios),max(ratios)))
print('Signatures déposées / seuil de 100 000 : médiane %.2f, min %.2f, max %.2f'%(st.median(req),min(req),max(req)))
for E,name in((47_170_000,'France (inscrits 2019 déduits du seuil RIP : 4 717 396 / 10 %)'),(49_000_000,'France ~49 M (hypothèse ronde)')):
    for s in(100_000,500_000,1_000_000,4_717_396):
        print('%s : %d signatures = %.2f %%'%(name,s,s/E*100))
