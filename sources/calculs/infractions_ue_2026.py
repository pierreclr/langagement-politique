# -*- coding: utf-8 -*-
"""Stock de procédures d'infraction ouvertes (état 03/11/2026) par État, stade et domaine ; France détaillée ; graphique.
Données : $DONNEES/sources/infractions-ue/ (API « Infringement decisions », voir LISEZMOI).
Définition : dossier ACTIF = dernier état du dossier (n° INFR, État) avec le drapeau « activeInfringementCase = Yes » de la Commission.
Stades : mise en demeure (y c. complémentaires, art. 258 et 260), avis motivé (y c. art. 259), saisine de la Cour (y c. renvoi différé).
Usage : $DONNEES/.venv/bin/python infractions_ue_2026.py  (sans pandas)."""
import os, sys, collections as C, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import infractions_ue as I
DONNEES = os.path.expandvars('$DONNEES/sources/infractions-ue')
SORTIE = os.path.expandvars('$DONNEES/resultats/europe/infractions_ue_2026.png')
# Single Market Scoreboard, transposition, état au 05/12/2025 : directives en retard par État (sur 1 022)
RETARD = dict(Spain=27, Poland=21, Portugal=20, Luxembourg=18, Belgium=17, Austria=15, Netherlands=14, Bulgaria=13, Estonia=13, Italy=13, Latvia=12,
              Germany=11, France=11, Hungary=11, Greece=10, Cyprus=10, Romania=10, Czechia=9, Croatia=9, Sweden=9, Slovenia=8, Ireland=7,
              Lithuania=6, Malta=6, Finland=6, Denmark=5, Slovakia=5)
def stade(t):
    if t.startswith('Referral'): return 'Saisine de la Cour'
    if t.startswith(('Reasoned', 'Additional reasoned')): return 'Avis motivé'
    return 'Mise en demeure'
DOM = {'Environment': 'Environnement', 'Internal Market, Industry, Entrepreneurship and SMEs': 'Marché intérieur', 'Financial Stability, Financial Services and Capital Markets Union': 'Services financiers',
       'Migration and Home Affairs': 'Migration et affaires intérieures', 'Justice and Consumers': 'Justice et consommateurs', 'Energy': 'Énergie', 'Mobility and Transport': 'Transports',
       'Employment, Social Affairs and Inclusion': 'Emploi et affaires sociales', 'Taxation and Customs Union': 'Fiscalité et douane', 'Health and Food Safety': 'Santé et alimentation'}
def actifs():
    g = C.defaultdict(list)
    for r in I.charger(DONNEES): g[(r['infringementNumber'], r['memberState'])].append(r)
    out = {}
    for k, v in g.items():
        v.sort(key=lambda r: I.d(r['decisionDate']))
        if v[-1]['activeInfringementCase'] == 'Yes' and k[1] in I.UE27: out[k] = v
    return out
if __name__ == '__main__':
    A = actifs()
    par = {e: C.Counter() for e in I.UE27}
    for (n, e), v in A.items(): par[e][stade(v[-1]['decisionType'])] += 1
    tot = {e: sum(par[e].values()) for e in I.UE27}
    ordre = sorted(I.UE27, key=lambda e: -tot[e])
    print('Dossiers actifs UE27 :', sum(tot.values()), '; médiane', sorted(tot.values())[13], '; moyenne', round(sum(tot.values()) / 27, 1))
    for i, e in enumerate(ordre, 1): print(i, I.FR[e], tot[e], dict(par[e]), 'retard transposition', RETARD[e])
    fr = [(k, v) for k, v in A.items() if k[1] == 'France']
    print('\nFrance :', len(fr), dict(par['France']))
    print('Par domaine :', C.Counter(DOM.get(v[-1]['leadDg'], 'Autres') for k, v in fr).most_common())
    print('Par motif :', C.Counter(v[-1]['caseType'] for k, v in fr).most_common())
    print('Dont non-communication avec sanctions possibles (art. 260(3)) :', sum('260(3)' in v[-1]['decisionType'] for k, v in fr))
    print('Ouverts en 2026 (première décision) :', sum(I.d(v[0]['decisionDate']).year == 2026 for k, v in fr), '; avant 2010 :', sum(I.d(v[0]['decisionDate']).year < 2010 for k, v in fr))
    print('\nListe France :')
    for k, v in sorted(fr, key=lambda x: x[0][0]): print(k[0], '|', stade(v[-1]['decisionType']), '|', v[-1]['decisionDate'], '|', DOM.get(v[-1]['leadDg'], v[-1]['leadDg']), '|', v[-1]['title'].replace('\n', ' ').strip()[:90])
    # graphique
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    COL = {'Mise en demeure': '#9ecae1', 'Avis motivé': '#4292c6', 'Saisine de la Cour': '#08306b'}
    fig, (a, b) = plt.subplots(1, 2, figsize=(13, 8.2), gridspec_kw=dict(width_ratios=[1.35, 1]))
    y = list(range(27))[::-1]
    for yi, e in zip(y, ordre):
        left = 0
        for s in COL:
            a.barh(yi, par[e][s], left=left, color=COL[s], edgecolor='white', linewidth=1.2, height=.68, label=s if yi == 26 else None); left += par[e][s]
        a.text(left + 1.5, yi, str(left), va='center', fontsize=8.5, color='#333')
    a.set_yticks(y); a.set_yticklabels([I.FR[e] for e in ordre], fontsize=9)
    for t, e in zip(a.get_yticklabels(), ordre):
        if e == 'France': t.set_fontweight('bold')
    a.set_title('Procédures d\'infraction ouvertes, par stade (3 nov. 2026)', loc='left', fontsize=11.5, fontweight='bold')
    a.legend(loc='lower right', frameon=False, fontsize=9); a.set_xlabel('Dossiers actifs (n° INFR, État)')
    o2 = sorted(I.UE27, key=lambda e: -RETARD[e])
    for yi, e in zip(y, o2):
        b.barh(yi, RETARD[e], color='#08306b' if e == 'France' else '#9ecae1', height=.68); b.text(RETARD[e] + .4, yi, f'{RETARD[e]} ({RETARD[e]/1022*100:.1f} %)', va='center', fontsize=8.5, color='#333')
    b.axvline(sum(RETARD.values()) / 27, color='#777', lw=1, ls='--'); b.text(sum(RETARD.values()) / 27 + .3, 26.9, 'moyenne 11,7', fontsize=8.5, color='#555')
    b.set_yticks(y); b.set_yticklabels([I.FR[e] for e in o2], fontsize=9)
    for t, e in zip(b.get_yticklabels(), o2):
        if e == 'France': t.set_fontweight('bold')
    b.set_title('Directives non transposées (sur 1 022, déc. 2025)', loc='left', fontsize=11.5, fontweight='bold'); b.set_xlabel('Nombre de directives en retard')
    for ax in (a, b):
        for s in ('top', 'right'): ax.spines[s].set_visible(False)
        ax.tick_params(length=0); ax.set_xlim(0, ax.get_xlim()[1] * 1.08)
    fig.suptitle('La France est dans la moyenne européenne : ni exemplaire, ni mauvaise élève', x=.01, ha='left', fontsize=14, fontweight='bold')
    fig.text(.01, .012, 'Sources : Commission européenne, base « Infringement decisions » (API, téléchargée le 02/11/2026, dossiers à drapeau « actif ») ; Single Market Scoreboard, transposition (05/12/2025).\nStade = dernière décision du dossier. Calcul : sources/calculs/infractions_ue_2026.py.', fontsize=8, color='#555')
    fig.tight_layout(rect=(0, .05, 1, .95)); os.makedirs(os.path.dirname(SORTIE), exist_ok=True); fig.savefig(SORTIE, dpi=150); print('écrit', SORTIE)
