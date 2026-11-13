#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arbitrage « usufruit à 60 % » contre « usufruit à 70 % avec plafond d'entrées » (schéma du 11/11/2026) : variantes
chiffrées côte à côte pour la note arbitrage-60-70.md.
Usage (racine de l'atelier) : python3 -I modeles/fonciere-afflux/code/arbitrage.py   (une dizaine de secondes)
Écrit donnees/arbitrage-60-70.json et imprime le tableau en Markdown (la note est rédigée à la main à partir de là).

Écrit par Claude (IA d'Anthropic) pour l'auteur, 13/11/2026. Aucune hypothèse centrale n'est modifiée : les variantes
ne changent que les paramètres de réglage que l'auteur choisit (part d'usufruit f, marge, plafond d'entrées), avec
afflux.reglage_usufruit60, calculer.evaluer et finances, comme usufruit60.py (H-FA90 à H-FA97, methode.md § 4.6).
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import afflux as A          # noqa: E402
import finances as FI       # noqa: E402

U = A.U
TAUX_BANCAIRE = 0.0332      # taux des contrats au central (H-FA16) ; la marge s'y ajoute
T2032, T2038, T10 = 5, 11, 9

# Variantes demandées (a à e) et deux variantes de contrôle (b2 : 60 % qui passe le test ; e2 : 70 % plafond 15 % avec marge).
VARIANTES = (
    ('a', '60 %, sans plafond', dict(f=0.60, marge=0.0, quota=None)),
    ('b', '60 %, plafond 8 %', dict(f=0.60, marge=0.0, quota=0.08)),
    ('b2', '60 %, marge 2 pt, plafond 8 %', dict(f=0.60, marge=0.02, quota=0.08)),
    ('c', '65 %, plafond 8 %', dict(f=0.65, marge=0.0, quota=0.08)),
    ('d', '70 %, marge 1 pt, plafond 8 %', dict(f=0.70, marge=0.01, quota=0.08)),
    ('e', '70 %, plafond 15 %', dict(f=0.70, marge=0.0, quota=0.15)),
    ('e2', '70 %, marge 1 pt, plafond 15 %', dict(f=0.70, marge=0.01, quota=0.15)),
)


def reglage_variante(params):
    """Réglage du schéma du 11/11 pour une variante (prêteur mixte, central)."""
    return A.reglage_usufruit60(**params)


def mensualite_cas(prix, loyer, f, taux, duree=25, contribution=U.TAUX_CONTRIBUTION_RP, entretien=0.0):
    """Cas type : prêt de f × prix sur `duree` ans sans apport ; mensualité seule, avec la contribution de 0,25 % par an,
    puis avec l'entretien du propriétaire (part de la valeur par an, H-FU39 ⚠️) ; rapports au loyer."""
    m = U.mensualite(f * prix, taux, duree)
    c = contribution * prix / 12
    t = m + c + entretien * prix / 12
    return dict(prix=prix, loyer=loyer, mensualite=m, avec_contribution=m + c, rapport=(m + c) / loyer, tout_compris=t,
                rapport_tout=t / loyer)


def issues(r, cohorte):
    """Ce que devient une génération (personnes par an) : entrent ; écartés par le plafond, répartis entre banque (s'ils y
    avaient accès) et location ; restent locataires sans être écartés (règle des 35 %, choix) ; sans emploi stable avant
    36 ans (hors dispositif). entrent + banque + loue + jamais = cohorte (les écartés sont comptés dans banque ou loue)."""
    Aa = r['A']
    ecartes = Aa['refuses']   # les écartés vont soit à la banque soit en location (afflux.agreger) ; voir ecartes_locataires
    return dict(entrent=Aa['F'] * cohorte, ecartes=ecartes * cohorte, banque=Aa['banque'] * cohorte, loue=Aa['loue'] * cohorte,
                jamais=r['jamais'] * cohorte, total=(Aa['F'] + Aa['banque'] + Aa['loue'] + r['jamais']) * cohorte)


def ecartes_locataires(r_plafond, r_libre, cohorte):
    """Écartés par le plafond qui restent locataires (n'ont pas accès à la banque) : hausse de la location entre la
    variante plafonnée et la même sans plafond (personnes par an)."""
    return (r_plafond['A']['loue'] - r_libre['A']['loue']) * cohorte


def indicateurs(ev, sim, table_q=None, usu=None):
    """Indicateurs d'une variante évaluée (calculer.evaluer) et de sa foncière simulée (finances.simuler)."""
    r, reg = ev['r'], ev['reg']
    prix = {s: v['moyenne'] for s, v in ev['mondes']['fonciere'].items()}
    s_max = max(prix, key=prix.get)
    av = FI.avantage_cache(r, reg, U.bareme_fiscal, usu)
    return dict(jeunes=r['jeunes_F'], contrats=r['contrats'], D15=r['proprio_D15'], D15_sans=r['sans_D15'], proprio=r['proprio'],
                pmax=prix[s_max], secteur_max=s_max,
                m2032=FI.maastricht(sim, T2032)['pts_pib'], m2038=FI.maastricht(sim, T2038)['pts_pib'],
                md2032=FI.maastricht(sim, T2032)['md_courants'], md2038=FI.maastricht(sim, T2038)['md_courants'],
                cout10=FI.maastricht(sim, T10)['md_2026'], np10=FI.nue_propriete_payee(sim, T10),
                ratio30=FI.F.ratio_min(sim, a=30), test50=FI.F.ratio_min(sim, a=30) > 0.5,
                avantage_md=av['fiscal_md'], avantage_contrat=av['fiscal_contrat'], bareme_moyen=av['bareme_moyen'],
                dette30=sim[29]['dette_md'])


def tableau(res):
    """Tableau Markdown compact des variantes (res : liste de dicts produits par main)."""
    e = lambda x, d=0: f'{x:,.{d}f}'.replace(',', ' ').replace('.', ',')
    k = lambda x: e(x / 1000) + ' 000' if round(x / 1000) else '0'
    p = lambda x, d=0: e(100 * x, d) + ' %'
    ent = ['Variante', 'Entrées / an', 'Demande non servie / an (dont restent locataires)', 'Moitié qui hérite le moins : propriétaires ou usufruitiers à 35 ans',
           'T2 métropole : mensualité (tout compris) / loyer', 'T2 ville moyenne : idem', 'Hausse des prix, secteur le plus touché',
           'Dette publique en plus, pt de PIB 2032 / 2038', 'Test des 50 % (ratio min. 5-30 ans)', 'Avantage caché (Md€/an)']
    lig = []
    for v in res:
        x = v['ind']
        mm, mv = v['mens']['metropoles_T2'], v['mens']['villes_moyennes_T2']
        lig.append([f"({v['id']}) {v['nom']}", k(x['jeunes']), f"{k(v['issues']['ecartes'])} ({k(v['ecartes_loue'])})",
                    f"{p(x['D15'])} (sans dispositif {p(x['D15_sans'])})",
                    f"{e(mm['mensualite'])} € ({e(mm['tout_compris'])} €) / {e(mm['loyer'])} €",
                    f"{e(mv['mensualite'])} € ({e(mv['tout_compris'])} €) / {e(mv['loyer'])} €",
                    f"+{e(100 * x['pmax'], 1)} % ({v['secteur_nom']})",
                    f"{e(100 * x['m2032'], 2)} / {e(100 * x['m2038'], 2)}",
                    f"{'tenu' if x['test50'] else 'raté'} ({p(x['ratio30'])})", e(x['avantage_md'], 1)])
    out = ['| ' + ' | '.join(ent) + ' |', '|' + '---|' * len(ent)]
    out += ['| ' + ' | '.join(l) + ' |' for l in lig]
    return '\n'.join(out)


def main():
    # calculer.py de ce modèle (et non celui de fonciere-usufruit, que afflux met aussi dans le chemin)
    import importlib.util
    spec = importlib.util.spec_from_file_location('calculer_afflux', os.path.join(ICI, 'calculer.py'))
    K = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(K)
    C = K.Ctx()
    res, libres = [], {}
    for vid, nom, params in VARIANTES:
        reg = reglage_variante(params)
        ev = K.evaluer(C, reg=reg, simuler=False)
        sim = FI.simuler(FI.params_fonciere(ev['r'], reg), C.q)
        h = ev['h']
        usu = {a: U.valeur_usufruit(U.survies(C.q, int(round(a)), 2027, 0.01), h['r_np']) for a, _ in ev['r']['ages_contrats']}
        ind = indicateurs(ev, sim, usu=usu)
        # même variante sans plafond, pour mesurer la demande non servie et qui reste locataire
        cle = (params['f'], params['marge'])
        if cle not in libres:
            libres[cle] = A.agreger(reglage_variante(dict(params, quota=None)), h, C.her, C.S, C.q)
        rl = libres[cle]
        N = h['cohorte']
        mens = {}
        for s in ('metropoles', 'villes_moyennes'):
            S = C.S[s]
            mens[f'{s}_T2'] = mensualite_cas(S['prix_T2'], A.loyer_logement(S, 'T2'), params['f'], TAUX_BANCAIRE + params['marge'],
                                           entretien=h['charges'])
            # choc de taux de + 1,4 point (grille de usufruit60.py, H-FA94)
            mens[f'{s}_T2_choc'] = mensualite_cas(S['prix_T2'], A.loyer_logement(S, 'T2'), params['f'], TAUX_BANCAIRE + params['marge'] + 0.014,
                                                  entretien=h['charges'])
        res.append(dict(id=vid, nom=nom, params=params, ind=ind, issues=issues(ev['r'], N), demande_sans_plafond=rl['jeunes_F'],
                        ecartes_loue=ecartes_locataires(ev['r'], rl, N), mens=mens, cohorte=N,
                        secteur_nom=K.NS[ind['secteur_max']]))
    with open(os.path.join(RACINE, 'donnees', 'arbitrage-60-70.json'), 'w', encoding='utf-8') as fh:
        json.dump(res, fh, ensure_ascii=False, indent=1, default=lambda o: None)
    print(tableau(res))
    print()
    for v in res:
        i = v['issues']
        print(v['id'], {k: round(x) for k, x in i.items()}, 'demande sans plafond', round(v['demande_sans_plafond']),
              'écartés locataires', round(v['ecartes_loue']), 'cout10', round(v['ind']['cout10'], 1), 'np10', round(v['ind']['np10'], 1),
              'dette30', round(v['ind']['dette30']), 'choc métropole T2', round(v['mens']['metropoles_T2_choc']['tout_compris']), 'av/contrat', round(v['ind']['avantage_contrat']), 'proprio', round(v['ind']['proprio'], 3))
    print('écrit donnees/arbitrage-60-70.json')


if __name__ == '__main__':
    main()
