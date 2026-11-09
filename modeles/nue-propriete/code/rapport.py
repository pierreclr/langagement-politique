#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rapport du modèle « nue-propriété » (T82). Lancer depuis la racine de l'atelier :
    python3 -I modeles/nue-propriete/code/rapport.py
Lit donnees/v75_tranches.json (extraction de la v7.5 par code/extraire_v75.js) et, en lecture seule, le banc d'essai
(modeles/banc-programmes/) et le modèle de taux endogène (modeles/taux-endogene/). Écrit resultats.md et donnees/resultats.json.
"""
import json
import os
import sys
from dataclasses import replace

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
MODELES = os.path.dirname(RACINE)
sys.path.insert(0, ICI)
sys.path.insert(0, os.path.join(MODELES, 'taux-endogene'))
sys.path.insert(0, os.path.join(MODELES, 'banc-programmes'))
import nue_propriete as N  # noqa: E402
import taux as T           # noqa: E402
import moteur as M         # noqa: E402  (lecture seule)
import relancer as RB      # noqa: E402  (lecture seule ; main() n'est pas appelé)

G = 0.03
FIN_DETTE = 2088


def fr(x, d=1):
    s = ('%.' + str(d) + 'f') % x
    return s.replace('-', '−').replace('.', ',')


def base_systeme():
    """Série du système (banc, référence) prolongée au-delà de 2058 à son dernier niveau, plus l'effort qui la stabilise (taux endogène central)."""
    ctx = RB.construire_ctx(False)
    eco = ctx['eco']
    s = ctx['systeme']['systeme']
    base = M.effet_systeme_md(s['reference'], eco)
    last = base[max(base)]
    for an in range(max(base) + 1, FIN_DETTE + 1):
        base[an] = last
    p = T.params('central')
    e = T.effort_supplementaire(base, eco, G, p)
    sup = T.effort_md(e)
    stab = {an: base.get(an, 0.0) + sup.get(an, sup[max(sup)]) for an in range(2028, FIN_DETTE + 1)}
    return eco, base, e, stab, p


P_FIXE = T.params('central', endogene=False)   # variante « exogène » du modèle T74 : OAT fixe 4,7 %, sans boucle


def resume(r, eco, stab, p_taux):
    tres = r['tresorerie']
    ref, sc = N.effet_dette(tres, stab, eco, G, p_taux, T, annee_fin=FIN_DETTE)
    rf, sf = N.effet_dette(tres, stab, eco, G, P_FIXE, T, annee_fin=FIN_DETTE)
    pib = eco['pib0']
    out = {}
    for an in (2038, 2048, 2058, 2068, 2088):
        i = an - N.ANNEE0
        dd = (sc[an]['ratio'] - ref[an]['ratio']) * 100
        dfix = (sf[an]['ratio'] - rf[an]['ratio']) * 100
        actifs = r['valeur_np'][i] + r['stock_etat'][i] + r['creances_differees'][i]
        dn = -dd / 100 * pib + actifs        # patrimoine net : − dette + actifs (Md€ 2025 indexés)
        dnf = -dfix / 100 * pib + actifs
        out[an] = {'dette_pts': dd, 'dette_ref': ref[an]['ratio'] * 100, 'dette_pts_taux_fixe': dfix, 'actifs_md': actifs, 'patrimoine_net_pts': dn / pib * 100,
                   'patrimoine_net_pts_taux_fixe': dnf / pib * 100, 'np_md': r['valeur_np'][i], 'plein_md': r['stock_etat'][i], 'creances_md': r['creances_differees'][i]}
    eff = T.effort_supplementaire({an: stab[an] + (tres[an - N.ANNEE0] if 0 <= an - N.ANNEE0 < len(tres) else 0.0) for an in stab}, eco, G, p_taux)
    out['effort_restab'] = eff
    out['crise'] = T.annee_crise(sc)
    return out


def scenario(tr, p, lignees, eco, stab, p_taux):
    r = N.simuler(tr, p, lignees)
    d = resume(r, eco, stab, p_taux)
    prod = N.capital_productif(tr) * 1e-9
    parts = {}
    for n in (20, 40, 60):
        i = n - 1
        parts[n] = {'demembre': r['stock_demembre_productif'][i] / prod, 'plein': r['stock_etat_productif'][i] / prod}
    return r, d, parts


def main():
    with open(os.path.join(RACINE, 'donnees', 'v75_tranches.json'), encoding='utf-8') as f:
        v75 = json.load(f)
    p0 = N.Parametres()
    tr = N.tranches_depuis_v75(v75, p0.seuil_assujetti)
    lignees = N.tirer_lignees(tr, p0)
    eco, base, e_stab, stab, p_taux = base_systeme()
    res = {'e_stab': e_stab, 'scenarios': {}, 'variantes': {}}
    L = []
    w = L.append
    w('---\ntitre: Payer la contribution sur le patrimoine en nue-propriété : résultats (T82)\ndate: 2026-11-09\n'
      'statut: généré par code/rapport.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions\n---\n')
    w('# Nue-propriété : résultats\n')
    w('Généré par `python3 -I modeles/nue-propriete/code/rapport.py`. Écrit par Claude (IA d\'Anthropic) pour l\'auteur. Méthode et hypothèses HNP1 à HNP20 : `methode.md`. '
      'Unités : Md€ de 2025 indexés sur le PIB nominal (convention du banc d\'essai). Graine %d, %d lignées représentatives par tranche. '
      'Écarts **par rapport à la fonction actuelle** (v7.5 retenue, report d\'encaissement compris). Rien ici ne modifie la fonction du patrimoine, le banc ni le modèle de taux.\n' % (p0.graine, p0.lignees_par_tranche))
    # --- calage
    du = sum(t.n * t.echelle * N.p_courbe(t.w) * p0.ratio_comportement for t in tr) * 1e-9
    w('## 0. Calage\n')
    w('Assujettis retenus (patrimoine net ≥ 500 000 €) : %s M de ménages. Dû net de comportements reconstitué sur ces tranches : %s Md€ par an (v7.5 : 45,2 Md€ pour toute la courbe ; les tranches sous 500 000 € en paient 0,2). '
      'Espérance de vie à 65 ans du modèle de mortalité : %s ans.\n' % (fr(sum(t.n for t in tr) / 1e6, 2), fr(du), fr(N.esperance_a(65, N.calibrer_gompertz(p0.e65)))))
    w('| Tranche | Ménages | Courbe moyenne (€) | Dû net (Md€/an) | Part différée | Part productive de la courbe |\n|---|---|---|---|---|---|')
    for t in tr:
        w('| %s | %s | %s | %s | %s %% | %s %% |' % (t.nom, '{:,}'.format(round(t.n)).replace(',', ' '), '{:,}'.format(round(t.w)).replace(',', ' '),
                                                fr(t.n * t.echelle * N.p_courbe(t.w) * p0.ratio_comportement * 1e-9, 2), fr(100 * t.part_differe, 0), fr(100 * t.part_productive, 0)))
    w('\nSérie de référence pour la dette : notre système (banc, trajectoire de référence, prolongée à son niveau de 2058 jusqu\'en %d) **plus %s Md€ d\'effort** qui la stabilise au taux endogène central (modèle T74). '
      'Les écarts de dette ci-dessous sont mesurés par rapport à cette trajectoire stabilisée.\n' % (FIN_DETTE, fr(e_stab, 0)))
    # --- scénarios
    w('## 1. Neuf scénarios (participation × coefficient)\n')
    w('Trésorerie : écart de solde public (négatif = perte) : fonction du patrimoine (comptant et recouvrement du différé), fonction des transmissions sur les biens qui reviennent à l\'État, '
      'revenus (2 % par an) des biens revenus en pleine propriété publique. Actifs récupérés : valeur pleine des biens dont l\'État devient plein propriétaire au décès (cumul). '
      'Dette : écart de dette brute (points de PIB). Patrimoine net : − écart de dette + nue-propriété détenue (barème de l\'art. 669) + pleine propriété publique − créances de différé qui n\'existent plus.\n')
    w('| Participation | c | Part du dû des participants | Âge moyen / sans héritier | Trésorerie 2030 | 2038 | 2048 | 2058 | 2068 | Actifs récupérés 2048 / 2068 / 2088 | Dette 2038 / 2058 (pts) | Patrimoine net 2058 (pts) | Effort pour restabiliser |')
    w('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for part in N.SCENARIOS_PARTICIPATION:
        for c in N.SCENARIOS_COEFFICIENT:
            p = replace(p0, participation=part, coefficient=c)
            r, d, parts = scenario(tr, p, lignees, eco, stab, p_taux)
            tres = r['tresorerie']
            rec = [sum(r['recupere'][:n]) for n in (20, 40, 60)]
            key = '%g|%g' % (part, c)
            res['scenarios'][key] = {'tresorerie': tres, 'recupere': r['recupere'], 'cumul_recupere': rec, 'dette': {str(k): v for k, v in d.items()}, 'parts_productif': parts,
                                     'part_du0': r['part_du0'], 'age': r['age_moyen_participants0'], 'sans_heritier': r['part_sans_heritier_participants0'],
                                     'perte_fonction': r['perte_fonction'], 'perte_transmissions': r['perte_transmissions'], 'revenus_etat': r['revenus_etat'],
                                     'cede_np': r['cede_np'], 'cede_plein': r['cede_plein'], 'stock_demembre': r['stock_demembre']}
            w('| %s %% | %s | %s %% | %s ans / %s %% | %s | %s | %s | %s | %s | %s / %s / %s | +%s / +%s | %s | %s |' % (
                fr(100 * part, 0), fr(c), fr(100 * r['part_du0'], 0), fr(r['age_moyen_participants0'], 0), fr(100 * r['part_sans_heritier_participants0'], 0),
                fr(tres[1]), fr(tres[9]), fr(tres[19]), fr(tres[29]), fr(tres[39]), fr(rec[0], 0), fr(rec[1], 0), fr(rec[2], 0),
                fr(d[2038]['dette_pts']), fr(d[2058]['dette_pts']), fr(d[2058]['patrimoine_net_pts']),
                ('%s Md€' % fr(d['effort_restab'], 0)) if d['effort_restab'] is not None else '> 400'))
    # --- détail du scénario central
    w('\n## 2. Détail : participation 20 %, c = 0,3\n')
    s = res['scenarios']['0.2|0.3']
    w('| Année | Fonction du patrimoine | Transmissions | Revenus des biens publics | Trésorerie | Nue-propriété reçue (valeur fiscale) | Biens cédés (valeur pleine) | Actifs récupérés dans l\'année |')
    w('|---|---|---|---|---|---|---|---|')
    for i in (0, 1, 4, 9, 14, 19, 29, 39, 49, 59):
        w('| %d | %s | %s | %s | %s | %s | %s | %s |' % (N.ANNEE0 + i, fr(s['perte_fonction'][i]), fr(s['perte_transmissions'][i]), fr(s['revenus_etat'][i]), fr(s['tresorerie'][i]),
                                                       fr(s['cede_np'][i]), fr(s['cede_plein'][i]), fr(s['recupere'][i])))
    dd = s['dette']
    w('\n| Année | Dette de référence (% PIB) | Écart de dette, taux endogène (pts) | Écart à taux fixe 4,7 % (pts) | Nue-propriété (Md€) | Pleine propriété (Md€) | Créances différées (Md€) | Patrimoine net, endogène / taux fixe (pts) |\n|---|---|---|---|---|---|---|---|')
    for an in ('2038', '2048', '2058', '2068', '2088'):
        x = dd[an]
        w('| %s | %s | +%s | +%s | %s | %s | %s | %s / %s |' % (an, fr(x['dette_ref']), fr(x['dette_pts']), fr(x['dette_pts_taux_fixe']), fr(x['np_md'], 0), fr(x['plein_md'], 0),
                                                         fr(x['creances_md'], 0), fr(x['patrimoine_net_pts']), fr(x['patrimoine_net_pts_taux_fixe'])))
    w('\nDette brute : %s / %s / %s points de PIB de plus en 2038 / 2058 / 2088 ; patrimoine net des administrations : %s / %s / %s points. '
      'Somme actualisée (taux réel 1,7 %%, r − g du banc) de la trésorerie sur 60 ans : %s Md€ ; valeur des actifs détenus en 2088 (nue-propriété + pleine propriété) : %s Md€.\n' % (
          fr(dd['2038']['dette_pts']), fr(dd['2058']['dette_pts']), fr(dd['2088']['dette_pts']),
          fr(dd['2038']['patrimoine_net_pts']), fr(dd['2058']['patrimoine_net_pts']), fr(dd['2088']['patrimoine_net_pts']),
          fr(N.actualise(s['tresorerie'], 0.017), 0), fr(dd['2088']['actifs_md'], 0)))
    # --- capital productif
    w('## 3. Part du capital productif des assujettis passée en nue-propriété publique (démembré) ou en pleine propriété publique\n')
    w('Dénominateur : titres et biens professionnels de la courbe des ménages de 500 000 € et plus dans le modèle, %s Md€ (indexé sur le PIB). '
      'Les comptes de patrimoine de l\'Insee (2024) donnent %s Md€ d\'actions, de parts de fonds et d\'actifs productifs pour **tous** les ménages : l\'enquête et le modèle en comptent davantage dans le haut de la distribution (composition par tranche, valeur des non cotés). '
      'Le capital productif **national** (sociétés détenues par l\'étranger, les institutions, l\'État) est plus grand encore : rapportées à lui, ces parts seraient plus faibles (⚠️ dénominateur national non chiffré).\n' % (
          '{:,}'.format(round(N.capital_productif(tr) * 1e-9)).replace(',', ' '), '{:,}'.format(N.CAPITAL_PRODUCTIF_MENAGES).replace(',', ' ')))
    w('| Participation | c | 20 ans (2048) : démembré / plein | 40 ans (2068) | 60 ans (2088) |\n|---|---|---|---|---|')
    for part in N.SCENARIOS_PARTICIPATION:
        for c in N.SCENARIOS_COEFFICIENT:
            q = res['scenarios']['%g|%g' % (part, c)]['parts_productif']
            w('| %s %% | %s | %s %% / %s %% | %s %% / %s %% | %s %% / %s %% |' % (fr(100 * part, 0), fr(c), *[fr(100 * q[n][k], 1) for n in (20, 40, 60) for k in ('demembre', 'plein')]))
    # --- variantes
    w('\n## 4. Variantes (participation 20 %, c = 0,3)\n')
    var = {
        'sans perte sur les transmissions': replace(p0, participation=0.2, coefficient=0.3, transmissions=False),
        'rendement des biens publics 1 %': replace(p0, participation=0.2, coefficient=0.3, rendement_etat=0.01),
        'rendement des biens publics 3 %': replace(p0, participation=0.2, coefficient=0.3, rendement_etat=0.03),
        'choix indépendant de l\'âge et des héritiers': replace(p0, participation=0.2, coefficient=0.3, poids_sans_heritier=1.0, poids_illiquide=0.0),
        'cession aux salariés : 20 % des participants de 1 M€ et plus': replace(p0, participation=0.2, coefficient=0.3, salaries=0.2),
        'espérance de vie à 65 ans + 3 ans': replace(p0, participation=0.2, coefficient=0.3, e65=24.6),
        'tous les ménages seuls (pas d\'usufruit réversible)': replace(p0, participation=0.2, coefficient=0.3, part_couples=0.0),
    }
    w('| Variante | Trésorerie 2030 / 2048 / 2068 | Actifs récupérés en 20 / 40 / 60 ans | Dette 2058 (pts) | Patrimoine net 2058 (pts) | Âge moyen des participants |\n|---|---|---|---|---|---|')
    for nom, p in var.items():
        r, d, parts = scenario(tr, p, lignees if (p.poids_sans_heritier, p.poids_illiquide) == (p0.poids_sans_heritier, p0.poids_illiquide) else N.tirer_lignees(tr, p), eco, stab, p_taux)
        rec = [sum(r['recupere'][:n]) + (sum(r['stock_salaries'][:1]) * 0) for n in (20, 40, 60)]
        res['variantes'][nom] = {'tresorerie': r['tresorerie'], 'recupere': rec, 'dette2058': d[2058], 'salaries': r['stock_salaries'][0]}
        extra = (' (plus %s Md€ en usufruit aux salariés, nue-propriété publique, rendus après 30 ans)' % fr(r['stock_salaries'][0], 0)) if p.salaries else ''
        w('| %s%s | %s / %s / %s | %s / %s / %s | +%s | %s | %s ans |' % (nom, extra, fr(r['tresorerie'][1]), fr(r['tresorerie'][19]), fr(r['tresorerie'][39]),
                                                              fr(rec[0], 0), fr(rec[1], 0), fr(rec[2], 0), fr(d[2058]['dette_pts']), fr(d[2058]['patrimoine_net_pts']),
                                                              fr(r['age_moyen_participants0'], 0)))
    w('\n**Lecture.** (1) **La perte de trésorerie ne dépend presque pas du coefficient** : un participant ne verse plus rien en argent, quel que soit c. Le coefficient ne change que la quantité de biens cédés, donc ce que l\'État récupère : '
      'un coefficient bas est une récompense payée en actifs, pas en argent. Du seul point de vue des finances publiques, c = 0,5 domine c = 0,1. '
      '(2) La perte suit la participation, un peu plus que proportionnellement, parce que les patrimoines les plus gros et les plus illiquides choisissent plus souvent la nue-propriété (part du dû des participants supérieure à leur part en nombre). '
      '(3) Elle grossit pendant une vingtaine d\'années (le différé de la fonction actuelle aurait été recouvré, les droits de succession sur les biens qui reviennent à l\'État disparaissent), puis se réduit quand les biens revenus à l\'État rapportent ; '
      'elle ne s\'annule pas en 60 ans : les biens publics rapportent 2 %% par an, moins que la contribution et les droits de succession qu\'ils auraient payés en mains privées. '
      '(4) **À taux fixe, l\'opération est presque neutre pour le patrimoine net** de l\'État : de l\'argent en moins, des actifs en plus. **Avec le taux endogène, elle ne l\'est plus** : la dette brute plus haute relève la prime de risque sur tout le stock de dette, '
      'et cette charge n\'a pas de contrepartie en actifs. Les marchés et la règle européenne regardent la dette brute (modèle T74). Les chiffres au-delà de 2058 sortent de l\'horizon du modèle de taux (série du système prolongée à plat).\n' % ())
    os.makedirs(os.path.join(RACINE, 'donnees'), exist_ok=True)
    with open(os.path.join(RACINE, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1, sort_keys=True, default=str)
    with open(os.path.join(RACINE, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L) + '\n')
    print('Résultats écrits')


if __name__ == '__main__':
    main()
