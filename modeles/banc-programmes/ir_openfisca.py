#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Impôt sur le revenu avec OpenFisca-France (version 176.1.10) : effet d'un barème à 14 tranches et de la fin du quotient conjugal, sur une population de foyers types.
À lancer avec le Python du venv OpenFisca (voir README) : <venv>/bin/python -I ir_openfisca.py  -> une ligne JSON sur la sortie standard (écrite par ponts.py dans donnees/cache/ir_openfisca.json).

LIMITE ASSUMÉE : il n'existe pas ici de fichier de micro-données représentatif (type ERFS ou fichiers DGFiP). On construit donc une population stylisée de foyers types
(H-IR1 à H-IR7 ci-dessous), calée sur le total de l'impôt sur le revenu 2024 ; l'effet sur l'impôt est calculé par OpenFisca foyer par foyer, puis pondéré. C'est une approximation
documentée, pas un chiffrage sur micro-données ; l'incertitude de calage est portée par une loi dans mesures.py.

Hypothèses (numérotées) :
 H-IR1 : année de revenus 2025 (barème 11 600 / 29 579 / 84 577 / 181 917 € ; impôt payé en 2026).
 H-IR2 : revenu par adulte = déciles de salaire net mensuel du modèle systeme-ideal (modele.js, netMilieuDecile : 1 400 ... 7 000 €), brut = net / 0,78 (ratio du modèle) ;
         dernier décile subdivisé par une loi de Pareto d'indice 2,2 (hypothèse ; reproduit environ 7 % de la masse salariale pour le centile supérieur) ; dispersion de ±20 % autour de chaque point.
 H-IR3 : types de foyers (parts des foyers fiscaux) : personne seule 0,50 ; parent isolé, 1 enfant 0,07 ; couple sans enfant 0,21 ; couple, 2 enfants 0,22 (ordres de grandeur, ⚠️ À VÉRIFIER, Insee/DGFiP).
 H-IR4 : dans un couple, le second adulte gagne 0,6 fois le revenu du premier (valeur centrale ; sensibilité 0,4 et 0,8 publiée).
 H-IR5 : tous les revenus sont des salaires (les pensions, revenus fonciers, de capital et d'indépendants sont absorbés par le calage) ; pas de crédits et réductions autres que ceux calculés par OpenFisca.
 H-IR6 : nombre de foyers fiscaux 40 millions, calage multiplicatif k tel que l'impôt simulé = 96,0 Md€ (Insee, comptes des APU, t. 3.217, 2024, IR y compris part IR du prélèvement forfaitaire unique).
 H-IR7 : réaction : élasticité du revenu imposable (Saez-Slemrod-Giertz 2012 : 0,12 / 0,25 / 0,40) au taux net de tous prélèvements : (1 - m_IR - 0,2) ; 0,2 = prélèvements salariés autres que l'IR (⚠️ hypothèse). Pas de perte de cotisations ni de TVA comptée.
Schéma à 14 tranches : le barème actuel est conservé jusqu'à 84 577 € par part (hypothèse favorable aux bas et moyens revenus : aucune hausse en dessous), puis 45 / 50 / 55 % et une montée linéaire jusqu'au taux supérieur (interprétation de « barème à 14 tranches contre 5 », P2 ch2, lien dans mesures.py ; taux et seuils non publiés) : voir BAREME_14.
"""
import json, math, sys
import numpy as np
from openfisca_core.reforms import Reform
from openfisca_core.simulation_builder import SimulationBuilder
from openfisca_france import FranceTaxBenefitSystem

AN = 2025
NET_MENSUEL_DECILES = [1400, 1620, 1750, 1950, 2100, 2300, 2600, 3010, 3600, 7000]   # modeles/systeme-ideal/modele.js, D.netMilieuDecile
RATIO_NET_BRUT = 0.78
ALPHA = 2.2
RATIO_COUPLE = 0.6
T_AUTRES = 0.2
CIBLE_IR_MD = 96.0
FOYERS = 40.0e6
TYPES = {'seul': 0.50, 'isole1': 0.07, 'couple0': 0.21, 'couple2': 0.22}
SEUILS_14 = [0, 11600, 29579, 84577, 120000, 181917, 250000, 400000, 600000, 1000000, 2000000, 4000000, 8000000, 20000000]


def taux_14(tau_top):
    base = [0.0, 0.11, 0.30, 0.41, 0.45, 0.50, 0.55]          # barème actuel jusqu'à 84 577 € (aucun changement pour le bas et le milieu), puis tranches fines jusqu'à 55 %
    pas = (tau_top - 0.55) / 7.0
    return base + [0.55 + pas * j for j in range(1, 8)]        # le taux supérieur tau_top est atteint à 20 M€ par part


def groupes_revenu():
    """Liste (poids, net mensuel) : déciles 1-9, puis dernier décile subdivisé en Pareto ; 3 points de dispersion (0,8 ; 1 ; 1,2 ; poids 0,25 / 0,5 / 0,25)."""
    pts = []
    for d in range(9):
        pts.append((0.10, NET_MENSUEL_DECILES[d]))
    x90 = NET_MENSUEL_DECILES[9] * (ALPHA - 1) / ALPHA
    bornes = [(0.90, 0.95), (0.95, 0.99), (0.99, 0.999), (0.999, 0.9999), (0.9999, 1.0)]
    e = (ALPHA - 1) / ALPHA
    for p1, p2 in bornes:
        moy = (ALPHA / (ALPHA - 1)) * x90 * (0.1 ** (1 / ALPHA)) * ((1 - p1) ** e - (1 - p2) ** e) / (p2 - p1)
        pts.append((p2 - p1, moy))
    out = []
    for w, net in pts:
        for f, pw in ((0.8, 0.25), (1.0, 0.5), (1.2, 0.25)):
            out.append((w * pw, net * f))
    return out


def construire_population(ratio_couple, individualise):
    """Retourne (liste de foyers fiscaux, entités OpenFisca). Un foyer = dict(poids, type, adultes: [brut annuel], enfants: n). Couples individualisés : deux foyers à un adulte."""
    foyers = []
    for w, net in groupes_revenu():
        brut = net * 12 / RATIO_NET_BRUT
        for t, part in TYPES.items():
            pw = w * part
            if t == 'seul':
                foyers.append(dict(poids=pw, type=t, adultes=[brut], enfants=0, groupe=net))
            elif t == 'isole1':
                foyers.append(dict(poids=pw, type=t, adultes=[brut], enfants=1, groupe=net))
            else:
                n = 0 if t == 'couple0' else 2
                if individualise:
                    foyers.append(dict(poids=pw, type=t, adultes=[brut], enfants=n // 2, groupe=net))
                    foyers.append(dict(poids=pw, type=t + '_b', adultes=[brut * ratio_couple], enfants=n // 2, groupe=net, conjoint=True))
                else:
                    foyers.append(dict(poids=pw, type=t, adultes=[brut, brut * ratio_couple], enfants=n, groupe=net))
    return foyers


def entites(foyers, facteurs=None):
    """Dictionnaire d'entités pour SimulationBuilder. facteurs : multiplicateurs du revenu de chaque adulte (même ordre que foyers) ou None."""
    ind, fam, foy, men = {}, {}, {}, {}
    anns = [str(AN - 2), str(AN - 1), str(AN)]
    for i, f in enumerate(foyers):
        pers, enf = [], []
        for k, b in enumerate(f['adultes']):
            pid = 'a%d_%d' % (i, k)
            m = 1.0 if facteurs is None else facteurs[i][k]
            ind[pid] = {'date_naissance': {'1900-01-01': '1985-06-15'}, 'activite': {a: 'actif' for a in anns},
                        'categorie_salarie': {a: 'prive_non_cadre' for a in anns}, 'contrat_de_travail': {a: 'temps_plein' for a in anns},
                        'salaire_de_base': {a: b * m for a in anns}}
            pers.append(pid)
        for k in range(f['enfants']):
            cid = 'e%d_%d' % (i, k)
            ind[cid] = {'date_naissance': {'1900-01-01': '2016-04-20'}, 'activite': {str(AN): 'etudiant'}, 'scolarite': {str(AN): 'college'}}
            enf.append(cid)
        fam['f%d' % i] = {'parents': pers, **({'enfants': enf} if enf else {})}
        foy['ff%d' % i] = {'declarants': pers, **({'personnes_a_charge': enf} if enf else {})}
        men['m%d' % i] = {'personne_de_reference': [pers[0]], **({'conjoint': [pers[1]]} if len(pers) > 1 else {}), **({'enfants': enf} if enf else {})}
    return {'individus': ind, 'familles': fam, 'foyers_fiscaux': foy, 'menages': men}


class ReformeBareme(Reform):
    seuils, taux = None, None

    def apply(self):
        seuils, taux = self.seuils, self.taux

        def modif(parameters):
            sc = parameters.impot_revenu.bareme_ir_depuis_1945.bareme
            for i, (s, r) in enumerate(zip(seuils, taux)):
                sc.brackets[i].threshold.update(start='2025-01-01', value=float(s))
                sc.brackets[i].rate.update(start='2025-01-01', value=float(r))
            return parameters
        self.modify_parameters(modifier_function=modif)


def systeme(tau_top=None):
    base = FranceTaxBenefitSystem()
    if tau_top is None:
        return base
    cls = type('R14_%d' % int(tau_top * 100), (ReformeBareme,), {'seuils': SEUILS_14, 'taux': taux_14(tau_top)})
    return cls(base)


def calculer(tbs, foyers, facteurs=None):
    sim = SimulationBuilder().build_from_entities(tbs, entites(foyers, facteurs))
    irpp = -np.asarray(sim.calculate('impot_revenu_restant_a_payer', str(AN)), dtype=float)       # positif = impôt dû
    rni = np.asarray(sim.calculate('rni', str(AN)), dtype=float)
    return irpp, rni


def total(foyers, irpp, k=1.0):
    return k * FOYERS * sum(f['poids'] * i for f, i in zip(foyers, irpp)) / 1e9


def effet(tau_top, individualise, ratio_couple, eti_liste, k, ir_base_cache):
    """Delta d'impôt (Md€) du barème à 14 tranches (+ individualisation) : statique, puis avec réaction pour chaque élasticité."""
    # population de base (couples ensemble) et population de la réforme (individualisée ou non)
    f0 = construire_population(ratio_couple, False)
    tbs0, tbs1 = ir_base_cache['tbs0'], systeme(tau_top)
    ir0, rni0 = ir_base_cache['ir0'][ratio_couple]
    f1 = construire_population(ratio_couple, individualise)
    ir1, rni1 = calculer(tbs1, f1)
    stat = total(f1, ir1, k) - total(f0, ir0, k)
    # taux marginaux : +1 % sur tous les revenus
    fac0 = [[1.01] * len(f['adultes']) for f in f0]
    fac1 = [[1.01] * len(f['adultes']) for f in f1]
    ir0p, rni0p = calculer(tbs0, f0, fac0)
    ir1p, rni1p = calculer(tbs1, f1, fac1)
    m0 = np.where(rni0p - rni0 > 1, (ir0p - ir0) / np.maximum(rni0p - rni0, 1), 0.0)
    m1 = np.where(rni1p - rni1 > 1, (ir1p - ir1) / np.maximum(rni1p - rni1, 1), 0.0)
    res = {'statique': stat}
    # correspondance des foyers de base vers les foyers de la réforme (même groupe de revenu et même type) : en individualisé, deux foyers par couple
    # le taux marginal de référence « avant » d'un adulte de couple est celui de son foyer de base
    idx0 = {}
    for i, f in enumerate(f0):
        idx0.setdefault((round(f['groupe'], 4), f['poids'], f['type']), i)
    for eti in eti_liste:
        fac = []
        for j, f in enumerate(f1):
            tp = f['type'].replace('_b', '')
            i0 = idx0[(round(f['groupe'], 4), f['poids'], tp)]
            mold = m0[i0]
            rapport = max(1e-3, (1 - m1[j] - T_AUTRES)) / max(1e-3, (1 - mold - T_AUTRES))
            fac.append([rapport ** eti] * len(f['adultes']))
        ir1b, _ = calculer(tbs1, f1, fac)
        res['eti_%.2f' % eti] = total(f1, ir1b, k) - total(f0, ir0, k)
    return res


def main():
    tbs0 = systeme(None)
    ir0, ir_part = {}, {}
    for rc in (0.4, 0.6, 0.8):
        f0 = construire_population(rc, False)
        ir0[rc] = calculer(tbs0, f0)
    f_ref = construire_population(0.6, False)
    brut_ref = total(f_ref, ir0[0.6][0], 1.0)
    k = CIBLE_IR_MD / brut_ref
    # part de l'impôt payée par les 10 % de revenus les plus hauts (contrôle de plausibilité : DGFiP, de l'ordre de 70 %)
    tot = sum(f['poids'] * i for f, i in zip(f_ref, ir0[0.6][0]))
    haut = sum(f['poids'] * i for f, i in zip(f_ref, ir0[0.6][0]) if f['groupe'] > NET_MENSUEL_DECILES[8] * 1.25)
    cache = {'tbs0': tbs0, 'ir0': ir0}
    out = {'version_openfisca_france': '176.1.10', 'annee_revenus': AN, 'calage_k': k, 'ir_simule_avant_calage_md': brut_ref, 'part_ir_haut_decile': haut / tot,
           'foyers': FOYERS, 'cible_ir_md': CIBLE_IR_MD, 'ratio_couple_central': RATIO_COUPLE, 'grille': {}}
    for tau in (0.60, 0.75, 0.90):
        for indiv in (False, True):
            for rc in ((0.4, 0.6, 0.8) if indiv else (0.6,)):
                r = effet(tau, indiv, rc, (0.12, 0.25, 0.40), k, cache)
                out['grille']['tau%.2f_indiv%d_rc%.1f' % (tau, int(indiv), rc)] = r
    out['barème_14'] = {'seuils': SEUILS_14, 'taux_par_tau': {('%.2f' % t): taux_14(t) for t in (0.6, 0.75, 0.9)}}
    print(json.dumps(out))


if __name__ == '__main__':
    main()
