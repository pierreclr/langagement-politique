#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Grand livre (T65) : les recettes des administrations publiques, 2024.

Construit modeles/grand-livre/recettes.csv à partir des fichiers Insee téléchargés
($DONNEES/sources/apu/brut/ : t_3201, t_3203, t_3204, t_3205, t_3212, t_3216, t_3217).

Usage : python3 -I modeles/grand-livre/code/recettes.py [--csv] [--bouclage]
  sans option : contrôles (assertions) et tableaux de bouclage affichés
  --csv       : écrit modeles/grand-livre/recettes.csv

Fonctions pures pour l'extraction et le calcul ; seule main() lit et écrit des fichiers.
Convention : Md€ courants 2024. Une ligne reconstituée (résidu d'un agrégat Insee) est marquée `calcul`.
"""
import csv
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from xlsx_lecture import lire_xlsx  # noqa: E402

BRUT = os.path.expandvars('$DONNEES/sources/apu/brut/')
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SORTIE = os.path.join(RACINE, 'modeles', 'grand-livre', 'recettes.csv')
ANNEE = 2024
DATE = '2026-11-06'
URL_3217 = 'https://www.insee.fr/fr/statistiques/fichier/8988845/t_3217_fr.xlsx'
URL_3201 = 'https://www.insee.fr/fr/statistiques/fichier/8988845/t_3201_fr.xlsx'

# Valeurs du bilan global (sources/calculs/bilan_global.py), recopiées pour le rapprochement (lecture seule)
PIB = 2935.0
PO_BILAN = 0.427 * PIB
P_BILAN = {'P01': 432.4, 'P02': 153.1, 'P03': 96.0, 'P04': 14.6, 'P05': 9.1, 'P06': 46.3, 'P07': 42.9, 'P08': 2.7, 'P09': 20.8, 'P10': 68.0}
P11_BILAN = PO_BILAN - 885.9
RECETTES_BILAN = 1672.6 - 169.1


# ---------------------------------------------------------------- lecture
def _colonne(rows, annee=ANNEE):
    for r in rows:
        if float(annee) in [c for c in r if isinstance(c, float)]:
            return r.index(float(annee))
    raise ValueError('année absente')


def _indent(s):
    return len(s) - len(s.lstrip())


def lire_3217(chemin=BRUT + 't_3217_fr.xlsx'):
    """Liste ordonnée (ligne, libellé, indentation, valeur 2024) du tableau 3.217."""
    rows = list(lire_xlsx(chemin).values())[0]
    i = _colonne(rows)
    out = []
    for n, r in enumerate(rows):
        if len(r) > i and isinstance(r[1], str) and isinstance(r[i], float):
            out.append((n + 1, r[1].strip(), _indent(r[1]), r[i]))
    return out


def lire_recettes_table(chemin):
    """Bloc 'recettes' (de 'Recettes de production' à 'Total des recettes') d'un tableau 3.2xx : {libellé: valeur 2024}."""
    rows = list(lire_xlsx(chemin).values())[0]
    i = _colonne(rows)
    d, on = {}, False
    for r in rows:
        if len(r) > i and isinstance(r[1], str) and isinstance(r[i], float):
            lib = r[1].strip()
            if lib.startswith('Recettes de production'):
                on = True
            if on:
                d[lib] = r[i]
            if lib.startswith('Total des recettes'):
                break
    return d


def lire_3216(chemin=BRUT + 't_3216_fr.xlsx'):
    rows = list(lire_xlsx(chemin).values())[0]
    i = _colonne(rows)
    return {r[1].strip(): r[i] for r in rows if len(r) > i and isinstance(r[1], str) and isinstance(r[i], float)}


# ---------------------------------------------------------------- règles par libellé
# clé : fragment du libellé 3.217 ; valeur : (sec, entite, sort, ligne_bilan, ref_inventaire, note)
R = [
    ('Taxe sur la valeur ajoutée', ('D211', 'multiple (État, Sécurité sociale et collectivités par affectation)', 'reste', 'P11', '29', 'ne change pas ; ajustements N10 à N13 (niches, rénovation, réparation) et N17 (fiscalité d\'orientation)')),
    ('Droits d\'importation au profit de l\'Union', ('D212', 'Union européenne (S212)', 'reste', 'P11', '77', 'ressource propre de l\'UE : comprise dans les prélèvements obligatoires (3.217) mais PAS dans les recettes des APU (S13)')),
    ('TICPE', ('D214', 'État (et régions) ', 'reste', 'P11', '30', 'fiscalité d\'orientation (N17 carburants +15 %, N18 fioul)')),
    ('Accises sur l\'électricité', ('D214', 'État', 'reste', 'P11', '31', '')),
    ('Accises sur le gaz naturel', ('D214', 'État', 'reste', 'P11', '32', '')),
    ('Autres taxes sur l\'énergie', ('D214', 'État', 'reste', 'P11', '', '')),
    ('Accises sur les tabacs', ('D214', 'ASSO (affectée à la Sécurité sociale)', 'reste', 'P11', '34', '')),
    ('Accises sur les alcools', ('D214', 'ASSO', 'reste', 'P11', '35 ; 37', '')),
    ('Droits d\'enregistrement', ('D214', 'APUL (DMTO 14,742) et État', 'remplacé:fonction_patrimoine', 'P11', '121 ; 22', 'DMTO : la perte est comptée en N08 (net de la recette actuelle comprise dans P11), pas en variation de P11 ; sort lié à N08')),
    ('Taxe sur les conventions d\'assurances', ('D214', 'multiple (départements, ASSO)', 'reste', 'P11', '42', '')),
    ('Taxe de solidarité additionnelle', ('D214', 'ASSO', 'reste', 'P11', '43', '')),
    ('Autres taxes sur contrats d\'assurance', ('D214', 'multiple', 'reste', 'P11', '', '')),
    ('Prélèvements sur les jeux', ('D214', 'État (et ASSO pour CSG/CRDS sur les jeux)', 'reste', 'P11', '70 ; 71 ; 73', 'la CSG et la CRDS sur les jeux sont ici classées en impôts sur produits (non comprises dans P02 ni P05)')),
    ('Taxes sur services de logement et sur constructions', ('D214', 'APUL', 'à_arbitrer', 'P11', '125', 'assiette immobilière (taxe d\'aménagement) conservée dans P11 alors que le bilan remplace la taxe foncière par la taxe de 1 % (N07) : à arbitrer')),
    ('Taxe sur les certificats d\'immatriculation', ('D214', 'APUL (régions)', 'reste', 'P11', '55', '')),
    ('Taxe additionnelle sur véhicules', ('D214', 'État', 'reste', 'P11', '', 'malus automobile ; N17 (voitures lourdes) se superpose')),
    ('Taxes sur services de transport', ('D214', 'multiple', 'reste', 'P11', '166', 'dont taxe de l\'aviation civile ; N17 (billets d\'avion) se superpose')),
    ('Taxe sur les transactions financières', ('D214', 'État', 'reste', 'P11', '25', '')),
    ('Taxes sur ventes de produits pharmaceutiques', ('D214', 'ASSO', 'reste', 'P11', '', '')),
    ('Taxes sur services numériques', ('D214', 'État', 'reste', 'P11', '', '')),
    ('Taxes sur spectacles', ('D214', 'multiple', 'reste', 'P11', '', '')),
    ('Taxe de séjour', ('D214', 'APUL', 'reste', 'P11', '127', '')),
    ('Taxe générale sur les activités polluantes', ('D214', 'État', 'reste', 'P11', '52', 'montant Insee diminué de la part classée en D29 (0,038) : voir ligne propre')),
    ('Redevances des agences de l\'eau', ('D214', 'ODAC (agences de l\'eau)', 'reste', 'P11', '234', 'montant Insee diminué de la part classée en D29 (0,283) : voir ligne propre ; sort à rapprocher de la redevance pour service rendu')),
    ('Octroi de mer', ('D214', 'APUL', 'reste', 'P11', '50', 'montant Insee diminué de la part classée en impôts sur les importations (0,657) : voir ligne propre')),
    ('Taxe sur les salaires', ('D291', 'ASSO (Sécurité sociale) ', 'supprimé', 'P06', '82', 'P06 : suppression des impôts de production (hypothèse du modèle)')),
    ('Versement mobilité', ('D291', 'APUL (autorités de mobilité)', 'supprimé', 'P06', '83', 'P06 ; interaction avec la gratuité des transports urbains (D31)')),
    ('Contributions pour la formation professionnelle', ('D291', 'tiers affectataires (France compétences, Caisse des dépôts, OPCO), classés APU', 'à_arbitrer', 'P11', '92 ; 232 ; 252 ; 260', 'V15401 : l\'Insee classe ces contributions en D291 (impôts sur les salaires et la main-d\'œuvre, donc D29), PAS en cotisations sociales D61 : hors de P01 (432,4) et hors de P06 (46,3), donc conservées dans P11 ; leur dépense jumelle (formation, alternance) est fondue (D15, D27)')),
    ('Forfait social', ('D291', 'ASSO', 'à_arbitrer', 'P11', '87', 'prélevé sur des rémunérations annexes (épargne salariale, prévoyance) ; cousin de la taxe sur les salaires supprimée en P06, mais conservé dans P11 : incohérence de traitement à arbitrer')),
    ('Contribution au fonds national d\'aide au logement', ('D291', 'ASSO', 'à_arbitrer', 'P11', '84', 'assise sur la masse salariale comme la cotisation supprimée ; conservée dans P11 ; sa dépense jumelle (APL, D06) est supprimée : financement et dépense désalignés')),
    ('Contribution de solidarité pour l\'autonomie', ('D291', 'ASSO (CNSA)', 'à_arbitrer', 'P11', '85', 'assise sur la masse salariale ; conservée dans P11 alors que la dépense CNSA reste (non modélisée)')),
    ('Participation des employeurs à l\'effort de construction', ('D291', 'tiers (Action Logement), classés APU', 'à_arbitrer', 'P11', '90', 'assise sur la masse salariale ; conservée dans P11')),
    ('Cotisations au régime de garantie des salaires', ('D291', 'tiers (AGS), classés APU', 'à_arbitrer', 'P11', '91', 'cotisation patronale classée impôt par l\'Insee ; conservée dans P11 alors qu\'elle ressemble aux cotisations supprimées en P01')),
    ('Contribution patronale sur stock-options', ('D291', 'ASSO', 'à_arbitrer', 'P11', '88', 'assise sur des rémunérations ; sort à rapprocher de la fonction des revenus')),
    ('Taxe foncière', ('D292', 'APUL (communes, départements) ', 'remplacé:fonction_patrimoine', 'P07', '102 ; 103', 'remplacée par la taxe de 1 % (N07) ; dont 26,202 payés par les ménages, 16,738 par les entreprises (impôt de production)')),
    ('Cotisation foncière des entreprises', ('D292', 'APUL', 'supprimé', 'P06', '97', 'P06')),
    ('Impositions forfaitaires sur les entreprises de réseaux', ('D292', 'APUL / État', 'reste', 'P11', '', 'IFER : D29 conservé dans P11 alors que P06 supprime les autres impôts de production')),
    ('Cotisation sur la valeur ajoutée', ('D292', 'APUL / État', 'supprimé', 'P06', '96', 'P06')),
    ('Contribution sociale de solidarité des sociétés', ('D292', 'ASSO', 'supprimé', 'P06', '95', 'P06')),
    ('Taxes pour organismes consulaires', ('D292', 'ODAC (chambres consulaires)', 'reste', 'P11', '', '')),
    ('Taxe sur les surfaces commerciales', ('D292', 'APUL', 'reste', 'P11', '98', 'D29 conservé dans P11 ; assiette immobilière : à rapprocher de N07')),
    ('Taxes sur véhicules des entreprises', ('D292', 'ASSO / État', 'reste', 'P11', '57', '')),
    ('Taxes sur les bureaux', ('D292', 'APUL (Île-de-France) / État', 'à_arbitrer', 'P11', '', 'assiette immobilière conservée dans P11 : à rapprocher de N07')),
    ('Taxe GEMAPI', ('D292', 'APUL', 'à_arbitrer', 'P11', '', 'adossée aux impôts fonciers supprimés (P07) : conservée dans P11, sans assiette ni taxe de substitution')),
    ('Autres taxes adossées aux impôts fonciers locaux', ('D292', 'APUL', 'à_arbitrer', 'P11', '', 'taxes spéciales d\'équipement adossées à la taxe foncière supprimée (P07) : conservées dans P11 sans assiette')),
    ('Quotas carbone', ('D292', 'État / ODAC', 'reste', 'P11', '54', '')),
    ('Contributions des producteurs d\'électricité', ('D292', 'État', 'reste', 'P11', '61', 'contribution sur la rente inframarginale')),
    ('Contribution sociale généralisée', ('D51', 'ASSO (CNAM, CNAF, CNSA, CADES, FSV)', 'remplacé:fonction_revenus', 'P02', '2', 'hors CSG sur les jeux (classée en D214)')),
    ('Contribution au remboursement de la dette sociale', ('D51', 'ASSO (CADES)', 'remplacé:fonction_revenus', 'P05', '3', '')),
    ('Prélèvement de solidarité et autres contributions sociales', ('D51', 'État (et ASSO)', 'remplacé:fonction_revenus', 'P04', '4', '')),
    ('Prélèvements sur les revenus de capitaux mobiliers', ('D51', 'État', 'à_arbitrer', 'P11', '5', 'impôt sur le revenu du capital NON supprimé par le bilan (resté dans P11) alors que le prélèvement unique N02 taxe le capital courant : doublon d\'assiette suspect')),
    ('Impôt sur le revenu des personnes physiques', ('D51', 'État', 'remplacé:fonction_revenus', 'P03', '1', 'avant crédits d\'impôt (8,885 Md€, ligne mémo) ; comprend le PFU')),
    ('Impôt sur les sociétés (IS)', ('D51', 'État', 'reste', 'P10', '10', 'conservé par le bilan (P10) ; l\'inventaire (impots_inventaire.csv) le classe « absorbé (modèle estonien) » : divergence de traitement ; v7.2 : IS unique à 25 % (F02)')),
    ('Contribution sociale sur les bénéfices des sociétés', ('D51', 'État', 'reste', 'P11', '11', 'conservée dans P11 (IS conservé)')),
    ('Remises pharmaceutiques', ('D51', 'ASSO (Assurance maladie)', 'reste', 'P11', '80', 'recette atypique : classée impôt par l\'Insee, mais c\'est une ristourne de l\'industrie sur la dépense de médicaments (D11 la compte en dépense réduite) ; risque de double compte avec D11 « médicaments »')),
    ('Taxe d\'habitation', ('D59', 'APUL', 'à_arbitrer', 'P11', '104', 'résidences secondaires et logements vacants : assiette immobilière conservée dans P11 alors que la taxe de 1 % (N07) taxe aussi l\'immobilier : doublon d\'assiette suspect')),
    ('Impôt sur la fortune (IFI', ('D59', 'État', 'remplacé:fonction_patrimoine', 'P08', '18', 'remplacé par la taxe de 1 % (N07)')),
    ('Droits de mutation à titre gratuit', ('D91', 'État', 'remplacé:fonction_patrimoine', 'P09', '19 ; 20', 'remplacés par les droits sur les transmissions (N06) ; dont successions 15,907, donations 4,912')),
]
DOUBLON = {  # libellé fragment -> (ligne du bilan avec laquelle l'assiette semble comptée deux fois)
    'Prélèvements sur les revenus de capitaux mobiliers': 'N02',
    'Taxe d\'habitation': 'N07',
}
CAS = 'Contributions pour la formation professionnelle'


def _regle(lib):
    for frag, v in R:
        if frag in lib:
            return v
    return None


def _ligne(i, sec, entite, lib, nat, mont, stat, ligne_insee, ligne_bilan, sort, ref_inv, perim, note, url=URL_3217, flux='non', doublon='', apres=None):
    """Une ligne du grand livre (dictionnaire dans l'ordre du schéma + 2 colonnes ajoutées)."""
    return {
        'id': i, 'sous_secteur': 'REC', 'entite': entite, 'libelle': lib, 'nature_sec': nat, 'cofog': '',
        'montant_md_eur': round(mont, 3), 'annee': ANNEE, 'source_url': url, 'source_nom': 'Insee, comptes nationaux base 2020, ' + sec,
        'cote': 'A', 'date_consultation': DATE, 'statut_chiffre': stat, 'flux_inter_apu': flux, 'ligne_insee': ligne_insee,
        'ligne_bilan': ligne_bilan, 'sort': sort,
        'montant_apres_md_eur': ('' if apres is None else round(apres, 3)), 'doublon_suspect': doublon, 'note': note,
        'perimetre': perim, 'ref_inventaire': ref_inv,
    }


def construire(t3217, t3201):
    """Retourne (lignes, memo) : lignes du grand livre (REC) et lignes mémo (non additives)."""
    L = []
    k = 0

    def ajout(*a, **kw):
        nonlocal k
        k += 1
        L.append(_ligne('GL-REC-%03d' % k, *a, **kw))

    # structure du 3.217 : parents (indent 0 avec code SEC), enfants (indent 2), « dont » (indent >= 4)
    parents = {}
    cur = None
    for n, lib, ind, v in t3217:
        if ind == 0 and '(' in lib and lib.split('(')[-1].rstrip(') ').startswith('D') and lib[:3] != 'Ens':
            cur = lib
            parents[cur] = {'ligne': n, 'val': v, 'enfants': [], 'dont': []}
        elif ind == 0:
            cur = None
        elif cur and ind <= 2:
            parents[cur]['enfants'].append((n, lib, v))
        elif cur:
            parents[cur]['dont'].append((n, lib, v))

    def pere(code):
        for lib, p in parents.items():
            if '(' + code in lib:
                return lib, p
        raise KeyError(code)

    dont = {}
    for lib, p in parents.items():
        for n, d, v in p['dont']:
            dont[d.strip()] = v
    # lecture des « dont part classée » par ligne (ordre du fichier)
    parts = []
    for lib, p in parents.items():
        prev = None
        for n, c, v in (sorted(p['enfants'] + p['dont'])):
            if c.startswith('dont part classée'):
                parts.append((prev, v))
            else:
                prev = c
    p_tgap = [v for (pl, v) in parts if pl and 'Taxe générale' in pl][0]
    p_eau = [v for (pl, v) in parts if pl and 'agences de l\'eau' in pl][0]
    p_octroi = [v for (pl, v) in parts if pl and 'Octroi' in pl][0]
    ajustement = {'Taxe générale sur les activités polluantes': p_tgap, 'Redevances des agences de l\'eau': p_eau, 'Octroi de mer': p_octroi}

    def traite_parent(code, residu_nom, nat_residu, extra=0.0):
        lib_p, p = pere(code)
        somme = 0.0
        for n, c, v in p['enfants']:
            if c.startswith('Crédits d\'impôt') or c.startswith('Droits d\'importation'):
                continue
            if v is None or abs(v) < 1e-9 or c.startswith('Taxe professionnelle') or c.startswith('Contributions des banques'):
                continue
            r = _regle(c)
            m = v
            for frag, aj in ajustement.items():
                if frag in c:
                    m = v - aj
            sec, ent, sort, lb, ref, note = r if r else (code, 'multiple', 'reste', 'P11', '', '')
            nat = {'D211': 'D211', 'D212': 'D212', 'D214': 'D214', 'D291': 'D291', 'D292': 'D292', 'D51': 'D51', 'D59': 'D59', 'D91r': 'D91'}[code]
            if 'Impôt sur les sociétés' in c and 'avant' in c:
                nat = 'D51'
            doub = ''
            for frag, ident in DOUBLON.items():
                if frag in c:
                    doub = ident
            apres = None
            if 'Droits d\'enregistrement' in c:
                apres = None  # la perte est comptée en N08, pas en variation de P11
            elif sort in ('supprimé',) or sort.startswith('remplacé'):
                apres = 0.0
            elif lb in ('P11', 'P10'):  # conservé par le bilan (y compris les lignes à arbitrer)
                apres = m
            ajout(lib_p.split(' (')[0] if False else 'Insee 3.217', ent.strip(), c if c != 'Taxe foncière' else 'Taxe foncière (bâti et non bâti ; ménages et entreprises)', nat, m,
                  'fait' if m == v else 'calcul', 't_3217 L%d %s' % (n, c), lb, sort, ref, 'APU', note + ('' if m == v else ' [montant = Insee %.3f − part classée ailleurs %.3f]' % (v, v - m)), doublon=doub, apres=apres)
            somme += m
        return lib_p, p, somme

    # --- D211, D212
    lib, p = pere('D211')
    r = _regle('Taxe sur la valeur ajoutée')
    ajout('Insee 3.217', r[1], 'Taxe sur la valeur ajoutée (TVA)', 'D211', p['val'], 'fait', 't_3217 L%d TVA (D211)' % p['ligne'], 'P11', 'reste', r[4], 'APU', r[5], apres=p['val'])
    lib, p, s = traite_parent('D212', '', 'D212')
    # D212 : droits UE (hors APU) + part de l'octroi de mer + résidu
    r = _regle('Droits d\'importation au profit de l\'Union')
    ajout('Insee 3.217', r[1], 'Droits d\'importation au profit de l\'Union européenne (ressource propre)', 'D212', 2.6, 'fait', 't_3217 D212 dont droits UE', 'P11', 'reste', r[4], 'PO_seulement', r[5], flux='non (hors S13)')
    ajout('Insee 3.217', 'APUL', 'Octroi de mer : part classée en impôts sur les importations', 'D212', p_octroi, 'fait', 't_3217 Octroi de mer dont part D212', 'P11', 'reste', '50', 'APU', '', apres=p_octroi)
    res = p['val'] - 2.6 - p_octroi
    ajout('Insee 3.217', 'État (douane)', 'Impôts sur les importations non détaillés par l\'Insee (résidu D212)', 'D212', res, 'calcul', 't_3217 D212 − droits UE − part octroi', 'P11', 'reste', '', 'APU', 'résidu de l\'agrégat D212 (3,306 − 2,6 − 0,657)', apres=res)

    # --- D214
    lib, p, s = traite_parent('D214', '', 'D214')
    res = p['val'] - s - p_octroi * 0  # les parts classées ailleurs sont déjà retirées des enfants
    ajout('Insee 3.217', 'multiple', 'Impôts sur les produits non détaillés (résidu D214)', 'D214', res, 'calcul', 't_3217 D214 − somme des lignes', 'P11', 'reste', '', 'APU', 'résidu de l\'agrégat D214 après retrait des parts classées en D212 et D29', apres=res)
    ajout('Insee 3.217', 'État', 'TGAP : part classée en impôts sur la production (D29)', 'D29', p_tgap, 'fait', 't_3217 TGAP dont part D29', 'P11', 'reste', '52', 'APU', '', apres=p_tgap)
    ajout('Insee 3.217', 'ODAC', 'Redevances des agences de l\'eau : part classée en impôts sur la production (D29)', 'D29', p_eau, 'fait', 't_3217 agences de l\'eau dont part D29', 'P11', 'reste', '234', 'APU', '', apres=p_eau)

    # --- D291, D292 (les parts D29 de la TGAP et de l'eau viennent en déduction du résidu)
    lib1, p1, s1 = traite_parent('D291', '', 'D291')
    lib2, p2, s2 = traite_parent('D292', '', 'D292')
    res29 = p1['val'] + p2['val'] - s1 - s2 - p_tgap - p_eau
    ajout('Insee 3.217', 'multiple', 'Impôts sur la production non détaillés (résidu D291 + D292, après parts de TGAP et de l\'eau)', 'D29', res29, 'calcul',
          't_3217 D291 + D292 − somme des lignes − parts D29 de D214', 'P11', 'reste', '', 'APU', 'résidu des agrégats D291 (1,368) et D292 (1,071) diminué des deux parts D29 classées dans D214 (0,321)', apres=res29)

    # --- D51, D59, D91
    lib, p, s = traite_parent('D51', '', 'D51')
    res = p['val'] - s
    ajout('Insee 3.217', 'État / multiple', 'Impôts courants sur le revenu non détaillés (résidu D51)', 'D51', res, 'calcul', 't_3217 D51 − somme des lignes (crédits d\'impôt exclus : mémo)', 'P11', 'reste', '6 ; 8', 'APU', 'résidu de l\'agrégat D51 : retenues à la source, CDHR, etc. ; la somme des lignes détaillées est calculée hors crédits d\'impôt car les recettes des APU sont brutes de crédits', apres=res)
    lib, p, s = traite_parent('D59', '', 'D59')
    res = p['val'] - s
    ajout('Insee 3.217', 'multiple', 'Autres impôts courants non détaillés (résidu D59)', 'D59', res, 'calcul', 't_3217 D59 − somme des lignes', 'P11', 'reste', '', 'APU', 'résidu de l\'agrégat D59', apres=res)
    lib, p, s = traite_parent('D91r', '', 'D91')
    res = p['val'] - s
    ajout('Insee 3.217', 'État', 'Impôts en capital non détaillés (résidu D91r)', 'D91', res, 'calcul', 't_3217 D91r − DMTG', 'P11', 'reste', '', 'APU', 'résidu de l\'agrégat D91r (21,470 − 20,819)', apres=res)

    # --- D61 et D995
    eff = [v for (n, c, i, v) in t3217 if c.startswith('Cotisations sociales effectives')][0]
    imp = [v for (n, c, i, v) in t3217 if c.startswith('Cotisations sociales imputées')][0]
    ajout('Insee 3.217', 'ASSO (424,4) et État (8,0)', 'Cotisations sociales effectives (salariés, employeurs, indépendants)', 'D61', eff, 'fait', 't_3217 Cotisations sociales effectives', 'P01', 'remplacé:fonction_revenus', '272-337', 'APU',
          'comprend les cotisations versées par les administrations publiques employeurs (comptées aussi dans D1 en dépense) ; ne comprend PAS les 11,426 de contributions formation (D291) : V15401', apres=0.0)
    ajout('Insee 3.217', 'État (48,2), ASSO (1,4), autres', 'Cotisations sociales imputées (régimes sans caisse : pensions des fonctionnaires de l\'État)', 'D61', imp, 'fait', 't_3217 Cotisations sociales imputées', 'aucune',
          'reste', '', 'APU', 'recette fictive (comptabilité nationale) comptée aussi en dépense (D122 = 51,242) : neutre ; dans HORS_PO_AVANT du bilan ; hors prélèvements obligatoires', apres=imp)
    nr = [v for (n, c, i, v) in t3217 if c.startswith('Impôts et cotisations susceptibles')][0]
    ajout('Insee 3.217', 'ASSO (−4,1), État (−0,5)', 'Impôts et cotisations dus non recouvrables nets (D995r)', 'D995', nr, 'fait', 't_3217 Impôts et cotisations susceptibles de ne pas être collectés', 'P11', 'reste', '', 'APU',
          'ajustement de la comptabilité d\'exercice : recettes déjà nettes', apres=nr)

    # --- mémo : crédits d'impôt (recettes brutes, crédits en dépense)
    memo = [(n, c, v) for (n, c, i, v) in t3217 if c.startswith('Crédits d\'impôt sur')]
    for n, c, v in memo:
        ajout('Insee 3.217', 'État', c + ' (mémo)', 'D3/D9 (en dépense)', v, 'fait', 't_3217 L%d' % n, 'P11', 'reste', '', 'memo_credit',
              'ligne mémo, hors des recettes des APU : l\'Insee enregistre ces crédits en DÉPENSES (3.201 : 19,771) et les recettes sont brutes ; elles sont soustraites seulement pour obtenir les prélèvements obligatoires', flux='non')

    # --- recettes hors impôts et cotisations (3.201)
    def v(lib):
        return [x for kk, x in t3201.items() if kk.startswith(lib)][0]
    nonfisc = [
        ('P11 : production des branches marchandes et ventes résiduelles', 'P11', 'multiple (hôpitaux, collectivités, opérateurs)', 'Production marchande et ventes : billetterie, cantines, hôpitaux publics (hors tarification Assurance maladie), redevances', 'reste'),
        ('P12 : production pour emploi final propre (capitalisation)', 'P12', 'ODAC (27,4) et autres', 'recette imputée, comptée aussi en dépense (P51g) : neutre ; ne se retrouve dans aucune ressource budgétaire', 'reste'),
        ('P13 (partie) : paiements partiels des ménages', 'P13', 'multiple', 'ticket modérateur facturé aux ménages par des producteurs non marchands : crèches, cantines, conservatoires, etc.', 'reste'),
        ('D39 : autres subventions sur la production reçues', 'D39', 'multiple', 'subventions reçues de l\'UE et de l\'extérieur (hors flux entre APU)', 'reste'),
        ('D41 : intérêts reçus', 'D41', 'État (2,7), ASSO (2,0), ODAC (1,4)', 'intérêts consolidés (reçus d\'agents hors APU) ; 1,009 éliminés entre APU', 'reste'),
        ('D4 hors D41 : dividendes et revenus de la propriété', 'D4', 'État (7,4) : dividendes (APE), APUL (4,1), ASSO (3,6)', 'dividendes de l\'État actionnaire, rentes, revenus fonciers : recettes non fiscales', 'reste'),
        ('D7 hors D73 : autres transferts courants reçus', 'D7', 'État (8,2), ASSO (5,0), APUL (4,1), ODAC (3,6)', 'transferts reçus de l\'UE, des ménages (amendes), de l\'étranger ; les transferts entre APU (D73) sont éliminés en consolidé', 'reste'),
        ('D9 hors D91r et D995r : transferts en capital reçus', 'D9', 'multiple (APUL 19,3 non consolidé)', 'dont fonds structurels UE ; consolidé après élimination de 31,615 de transferts en capital entre APU', 'reste'),
    ]
    clefs = ['Production des branches marchandes', 'Production pour emploi final propre (P12)', 'Paiements partiels', 'Autres subventions sur la production (D39)',
             'Intérêts (D41)', 'Revenus de la propriété autres que les intérêts', 'Autres transferts courants', 'Transferts en capital']
    for (lib_, nat, ent, note, sort), cle in zip(nonfisc, clefs):
        m = v(cle)
        ajout('Insee 3.201', ent, lib_, nat, m, 'fait', 't_3201 ' + cle.strip(), 'aucune', sort, '', 'APU',
              'dans HORS_PO_AVANT du bilan (recettes hors prélèvements, inchangées) ; ' + note, url=URL_3201, apres=m)
    return L, memo


def controles(L, t3201, t3216, t3217):
    """Retourne un dictionnaire de contrôles (valeur calculée, valeur Insee) ; lève AssertionError si un contrôle échoue."""
    apu = [x for x in L if x['perimetre'] == 'APU']
    tot_apu = sum(x['montant_md_eur'] for x in apu)
    fisc = sum(x['montant_md_eur'] for x in apu if x['source_nom'].endswith('3.217'))
    c = {}
    c['recettes_totales_apu'] = (tot_apu, [x for kk, x in t3201.items() if kk.startswith('Total des recettes')][0])
    c['impots_et_cotisations_apu'] = (fisc, [x for kk, x in t3201.items() if kk.startswith('Impôts et cotisations sociales')][0])
    po_lignes = fisc + 2.6 - 51.242 + sum(x['montant_md_eur'] for x in L if x['perimetre'] == 'memo_credit')
    c['prelevements_obligatoires'] = (po_lignes, [x for kk, x in t3217 if kk.startswith('Prélèvements obligatoires')][0] if False else 1254.024)
    for nom, (a, b) in c.items():
        assert abs(a - b) < 0.0015, (nom, a, b)
    return c


TABLES_SS = {'S13': 't_3201_fr.xlsx', 'ETAT': 't_3203_fr.xlsx', 'ODAC': 't_3204_fr.xlsx', 'APUL': 't_3205_fr.xlsx', 'ASSO': 't_3212_fr.xlsx'}


def bouclage_sous_secteurs(brut=BRUT):
    """Recettes par nature et par sous-secteur (3.201, 3.203, 3.204, 3.205, 3.212) : {sous_secteur: {libellé: valeur}}."""
    return {k: lire_recettes_table(brut + v) for k, v in TABLES_SS.items()}


def elimination_inter_apu(T):
    """Flux entre APU éliminés au consolidé : D73 (courants), D9 hors D91r (capital), D41 (intérêts) ; renvoie dict et total."""
    def g(s, deb):
        return [x for k, x in T[s].items() if k.startswith(deb)][0]
    ss = ['ETAT', 'ODAC', 'APUL', 'ASSO']
    d73 = sum(g(s, 'Transferts courants entre administrations') for s in ss)
    d9 = sum(g(s, 'Transferts en capital') for s in ss) - g('S13', 'Transferts en capital')
    d41 = sum(g(s, 'Intérêts (D41)') for s in ss) - g('S13', 'Intérêts (D41)')
    d733 = sum(g(s, 'Transferts de recettes fiscales') for s in ss)
    tot = sum(g(s, 'Total des recettes') for s in ss) - g('S13', 'Total des recettes')
    return {'D73 (transferts courants entre APU)': d73, 'D9 (transferts en capital entre APU)': d9, 'D41 (intérêts entre APU)': d41, 'D733 (somme nulle)': d733}, tot


def par_champ(L, champ, perim='APU'):
    """Somme des montants par valeur d'un champ, sur un périmètre."""
    d = {}
    for x in L:
        if x['perimetre'] == perim:
            d[x[champ]] = d.get(x[champ], 0.0) + x['montant_md_eur']
    return d


def main(argv):
    t3217 = lire_3217()
    t3201 = lire_recettes_table(BRUT + 't_3201_fr.xlsx')
    t3216 = lire_3216()
    L, memo = construire(t3217, t3201)
    c = controles(L, t3201, t3216, t3217)
    for nom, (a, b) in c.items():
        print('%-34s lignes %10.3f | Insee %10.3f | écart %7.3f' % (nom, a, b, a - b))
    print('lignes : %d (dont APU %d)' % (len(L), len([x for x in L if x['perimetre'] == 'APU'])))
    print('\nPar ligne du bilan (APU, Md€) :')
    for k_, v_ in sorted(par_champ(L, 'ligne_bilan').items()):
        print('  %-7s %9.3f  bilan %s' % (k_, v_, P_BILAN.get(k_, P11_BILAN if k_ == 'P11' else '')))
    print('\nPar sort :')
    for k_, v_ in sorted(par_champ(L, 'sort').items(), key=lambda a: -a[1]):
        print('  %-30s %9.3f' % (k_, v_))
    T = bouclage_sous_secteurs()
    el, tot = elimination_inter_apu(T)
    print('\nÉlimination inter-APU :', {k_: round(v_, 3) for k_, v_ in el.items()}, 'total', round(tot, 3), 'écart', round(tot - sum(v_ for k_, v_ in el.items()), 3))
    if '--csv' in argv:
        champs = list(L[0].keys())
        with open(SORTIE, 'w', newline='', encoding='utf-8') as f:
            w = csv.DictWriter(f, fieldnames=champs, delimiter=';')
            w.writeheader()
            w.writerows(L)
        print('écrit', SORTIE)
    return L


if __name__ == '__main__':
    main(sys.argv[1:])
