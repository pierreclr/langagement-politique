# -*- coding: utf-8 -*-
"""T48 - Ordres de grandeur de la bascule partielle vers une part capitalisee (France, euros constants 2025).
Aucune prediction : un modele de cohortes volontairement simple.
Hypotheses (H1-H7) :
 H1 assiette salariale (cout employeur) 1 466,5 Md EUR en 2024 (modeles/offre-de-travail/methode.md), constante en reel (g=0) ou croissant a g.
 H2 cotisation retraite obligatoire moyenne 27,8 % du salaire (OCDE, Pensions at a Glance 2025, tableau 8.1) -> 1 point ~ 14,7 Md EUR.
 H3 depenses de retraite 422,2 Md EUR (COR RA 2026) constantes en reel.
 H4 carriere 40 ans, retraite a 65 ans, 22 ans de retraite (retraites versees par cohorte sur 22 ans).
 H5 montee en charge : +1 point tous les 3 ans jusqu'a PHI points (PHI = 3 ou 6) ; puis constant.
 H6 les points detournes vers le fonds financent, a terme, la part correspondante des pensions (fraction f = points accumules / (40 x 27,8)).
 H7 rendement reel net du fonds r = 2 / 3,5 / 5 % (scenarios bas / central / haut du modele retraites).
Le 'double cout' d'une annee = points detournes vers le fonds (a financer autrement : dette, impots, economies)
 moins les pensions que le fonds prend en charge cette annee-la (economie de repartition)."""
WAGE=1466.5; RATE=27.8; PT=WAGE/100  # Md EUR par point (g=0)
PENS=422.2; PIB=PENS/0.141
def sim(phi_max, r, years=90, step=3, g=0.0, i=0.015):  # i : taux de la dette de transition, calcule mais non publie (le modele ne verse pas les rendements au-dela des pensions nominales)
    phi=[min(phi_max, 1+ (t//step)) if t>=0 else 0 for t in range(years)]
    # fraction financee par le fonds des retraites partant l'annee t
    f=[]
    for t in range(years):
        s=sum(phi[max(0,t-40):t])  # points-annees accumules sur la carriere (40 ans max) avant t
        f.append(s/(40*RATE))
    fund=0.0; debt=0.0; maxdebt=0.0; rows=[]; cum=0.0; peak_dc=0; peak_year=None; breakeven=None; maxcum=0; maxfund=0
    for t in range(years):
        w=(1+g)**t
        F=sum(f[max(0,t-21):t+1])/22          # part moyenne du stock de retraites financee par le fonds
        div=phi[t]*PT*w                         # points detournes
        sav=F*PENS*w                            # pensions prises en charge par le fonds
        fund=fund*(1+r)+div-sav
        net=div-sav; cum+=net
        debt=debt*(1+i)+net; maxdebt=max(maxdebt,debt)
        if net>peak_dc: peak_dc=net; peak_year=t
        if breakeven is None and t>peak_year if peak_year is not None else False:
            if net<=0: breakeven=t
        maxcum=max(maxcum,cum); maxfund=max(maxfund,fund)
        rows.append((t,phi[t],div,sav,net,cum,fund,debt))
    return dict(maxdebt=maxdebt,net60=rows[59][6]-rows[59][7],net89=rows[89][6]-rows[89][7],peak_dc=peak_dc,peak_year=peak_year,breakeven=breakeven,maxcum=maxcum,fund=fund,fund40=rows[39][6],fund60=rows[59][6],rows=rows)
if __name__=="__main__":
    print(f"PIB deduit ~ {PIB:.0f} Md EUR ; 1 point de cotisation ~ {PT:.1f} Md EUR ({PT/PIB*100:.2f} % du PIB)")
    for phi_max in (3,6):
        for r in (0.02,0.035,0.05):
            for g in (0.0,0.006):
                o=sim(phi_max,r,g=g)
                print(f"phi_max={phi_max} pts r={r*100:.1f}% g={g*100:.1f}% | surcout max {o['peak_dc']:.0f} Md/an ({o['peak_dc']/PIB/(1+g)**o['peak_year']*100:.1f} % PIB, annee {o['peak_year']}) | surcout annuel nul des l'an {o['breakeven']} | cumul max {o['maxcum']:.0f} Md | fonds an40 {o['fund40']:.0f} Md ({o['fund40']/PIB/(1+g)**39*100:.0f} % PIB) an60 {o['fund60']:.0f} Md")

# Limites : (1) les pensions financees par le fonds sont comptees au montant 'repartition equivalent' (f x depenses) : le rendement r > g n'augmente pas les pensions ici, il gonfle le fonds (c'est le 'gain' de Sinn, paye par les generations de la transition) ; la colonne 'fonds' est donc un majorant du fonds necessaire. (2) pas de mortalite par cohorte, pas de migration, pas de chomage. (3) assiette et depenses constantes en reel (g=0) ou g=0,6 % (estimation depuis COR : productivite 0,7 %/an, cotisants -0,13 %/an).
