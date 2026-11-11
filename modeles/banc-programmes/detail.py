#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pages de détail du banc d'essai : le chiffrage poste par poste de chaque programme, et « les mêmes modèles pour tous ».

Écrit (dans ce dossier) : detail-lfi.md, detail-rn.md, detail-lr.md, detail-ps.md, detail-glucksmann.md, detail-langagement.md, memes-modeles.md.
Ne relance PAS le tirage de Monte-Carlo : lit les définitions des mesures (programmes/<cle>/mesures.py), les résultats
(donnees/resultats.json, écrits par relancer.py), les caches des modèles (donnees/cache/, mêmes fichiers que le banc),
quelques tableaux de resultats.md (§ 10) et quelques constantes du code des modèles (lues dans les fichiers .js).
Aucun chiffre n'est tapé à la main dans les pages : tout vient de ces fichiers. Les seuls textes écrits ici sont les
phrases de liaison, les familles de mesures, les notes de famille (vérifiées dans le code) et les objections.

Usage : python3 -I modeles/banc-programmes/detail.py            # écrit les six fichiers
        python3 -I modeles/banc-programmes/detail.py --verifier # code 1 si un fichier n'est pas à jour
Écrit par Claude (IA d'Anthropic) pour l'auteur ; l'auteur est partie prenante de la comparaison (conflit d'intérêts déclaré).
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import json
import os
import re
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(os.path.dirname(ICI))
sys.path.insert(0, ICI)
import moteur as M      # noqa: E402
import relancer as R    # noqa: E402
import rapport as RP    # noqa: E402

SITE = 'https://langagement-politique.vercel.app/fr/modeles/'
PAGES = ('lfi', 'rn', 'lr', 'ps', 'gl', 'langagement')
FICHIERS = {c: 'detail-%s.md' % c for c in PAGES}
FICHIERS['gl'] = 'detail-glucksmann.md'
FICHIERS['memes'] = 'memes-modeles.md'
COLONNES = ('lfi', 'rn', 'lr', 'ps', 'langagement', 'fil_de_l_eau')
NOMS = {'lfi': 'La France insoumise', 'rn': 'Rassemblement national', 'lr': 'Les Républicains (plan Retailleau)',
        'ps': 'PS et Place publique (contre-budget 2027)', 'gl': 'Glucksmann, Place publique (livret climat, chiffrage partiel)', 'langagement': 'notre système', 'fil_de_l_eau': "fil de l'eau"}
COURTS = {'lfi': 'LFI', 'rn': 'RN', 'lr': 'LR', 'ps': 'PS', 'gl': 'Glucksmann', 'langagement': 'notre système', 'fil_de_l_eau': "fil de l'eau"}

# ------------------------------------------------------------------ familles de mesures (classement, pas un chiffre)
FAMILLES = [
    ('ir', "Impôt sur le revenu et CSG"),
    ('capital', "Revenus du capital et épargne"),
    ('patrimoine', "Patrimoine et héritages"),
    ('entreprises', "Impôts des entreprises"),
    ('niches', "Niches fiscales et sociales"),
    ('salaires', "Smic, salaires et cotisations"),
    ('retraites', "Retraites"),
    ('prestations', "Prestations et minima sociaux"),
    ('sante', "Santé et dépendance"),
    ('tva', "TVA, énergie et prix"),
    ('effectifs', "Emplois et rémunérations publics"),
    ('etat', "Fonctionnement de l'État et opérateurs"),
    ('collectivites', "Collectivités"),
    ('services', "Services publics et dépenses nouvelles"),
    ('logement', "Logement et transition écologique"),
    ('fraude', "Fraude"),
    ('immigration', "Immigration : conditions d'accès et taxes"),
    ('ue', "Union européenne"),
    ('participations', "Participations publiques et nationalisations"),
    ('autres', "Autres recettes et écritures sans effet sur le déficit"),
    ('retours', "Retours dynamiques comptés par le programme"),
]
TITRE_FAMILLE = dict(FAMILLES)


def _aff(texte):
    """« famille: id id id ; famille: … » -> {id: famille}."""
    out = {}
    for bloc in texte.split(';'):
        fam, ids = bloc.split(':')
        for i in ids.split():
            out[i] = fam.strip()
    return out


AFFECTATION = {
    'lfi': _aff("ir: R13 ; capital: R01b ; patrimoine: R01a R04 R05 ; entreprises: R03 R06 R07 R08 R09 R10 R11 ; niches: R02 ; salaires: S01 ;"
                "retraites: D05 P01 ; prestations: D02 D04 D06 D19 D20 ; sante: D07 D08 D18 D24 ; tva: C01 ; effectifs: D01 D09 D21 ;"
                "services: D10 D11 D12 D13 D17a D17b D22 D25 ; collectivites: D23 ; logement: D03 D14 D16 ; fraude: R12 ;"
                "participations: D15 N01 N02 N03 N04 N05 N06"),
    'rn': _aff("ir: T08 D03 ; capital: T06 ; patrimoine: F02 T07 ; entreprises: T03 F01 F03 F04 ; niches: T04 ; salaires: D02 ;"
               "retraites: D01 H04 ; sante: D04 H01 H03 H06 ; tva: T01 T02 T05 G01 ; services: D05 ; etat: A01 A02 A03 H05 ;"
               "collectivites: A04 K01 K02 ; logement: G05 ; fraude: F05 F06 H02 ; immigration: F08 F09 I01 I02 I03 I04 ; ue: U01 U02 ;"
               "participations: G02 ; autres: F07 G03 R30 ; retours: G04"),
    'lr': _aff("salaires: LRT2 ; entreprises: LRT1 ; retraites: LR12 LR13 ; prestations: LR14 ; sante: LR15 ; effectifs: LR01 LR02 LR06 ;"
               "etat: LR03 LR04 LR07 LR08 LR09 LR10 ; collectivites: LR05 LR18 ; fraude: LR17 ; immigration: LR16 ; autres: LR11"),
    'ps': _aff("ir: PS10 ; patrimoine: PS01 PS02 ; entreprises: PS03 ; niches: PS04 PS05 ; salaires: PS09 ; sante: PS06 PS12 ; etat: PS07 ;"
               "services: PS13 PS14 PS15 ; logement: PS11 ; fraude: PS08a PS08b ; autres: PS08c"),
    'gl': _aff("patrimoine: GL02 ; logement: GL01"),
    'langagement': _aff("ir: M-REV ; capital: M-CAP M-EPAR ; patrimoine: M-PAT M-TRANS M-TH ; entreprises: M-CRED ; niches: M-CONV M-FRP ;"
                        "retraites: M-V6 M-PENS ; prestations: M-GT M-PL M-RESID M-DET ; sante: M-SECU M-GA ; tva: M-TVA M-RESTO M-FO M-FIOUL ;"
                        "effectifs: M-M1 M-M3 ; etat: M-ECO M-URSSAF M-FORM M-GM ; services: M-08 M-OM M-GRAT ; autres: M-FANT"),
    'fil_de_l_eau': {},
}

# ------------------------------------------------------------------ modules (leviers du moteur)
MODULES = {
    'retraites_age': ("modèle des retraites, âge de départ", 'retraites',
                      "`modeles/retraites/age_libre.js` par `js/pont_retraites.js` (cohortes, mortalité, pension sans décote, cotisations perdues), cohorte recalée par `modeles/demographie/`"),
    'ir_openfisca': ("OpenFisca-France sur foyers types, avec élasticité du revenu imposable", None,
                     "`ir_openfisca.py` (OpenFisca-France 176.1.10, population stylisée calée sur l'impôt de 2024) et `moteur.levier_ir`"),
    'ir_jeunes': ("OpenFisca-France, impôt d'un salarié seul", None, "`rn_openfisca.py` et `leviers_rn.levier_ir_jeunes`"),
    'isf': ("module des grandes fortunes, érosion et exil", 'systeme-ideal', "`modeles/systeme-ideal/grandes_fortunes_0511.js` (varianteB) et `moteur.levier_isf`"),
    'plancher': ("module des grandes fortunes, érosion et exil", 'systeme-ideal', "`modeles/systeme-ideal/grandes_fortunes_0511.js` et `moteur.levier_plancher`"),
    'iff': ("module des grandes fortunes, érosion et exil", 'systeme-ideal', "`modeles/systeme-ideal/grandes_fortunes_0511.js` (barème sobre) et `leviers_rn.levier_iff`"),
    'zucman': ("module des grandes fortunes, érosion et exil", 'systeme-ideal', "`modeles/systeme-ideal/grandes_fortunes_0511.js` (zucmanSurDroitActuel) et `moteur.levier_zucman`"),
    'succession': ("module des transmissions, planification et départs", 'systeme-ideal', "`modeles/systeme-ideal/transmissions_0611.js` (trois) et `moteur.levier_succession`"),
    'smic': ("levier Smic : salaires, OpenFisca-France, emploi", None, "`leviers2.levier_smic` et `smic_openfisca.py`"),
    'pension_min': ("distribution des pensions des carrières complètes, DREES", 'retraites', "`leviers2.levier_pension_min` et `modeles/retraites/donnees/`"),
    'carburant': ("levier carburants : volume, prix, marges", None, "`leviers2.levier_carburant`"),
    'nationalisation': ("levier nationalisations : prix, dette, dividendes", None, "`leviers2.levier_nationalisation`"),
    'produit': ("coût unitaire × quantité", None, "`moteur.evaluer_mesure` (produit des facteurs)"),
    'module_systeme': ("notre modèle, rejoué à ses bornes", 'systeme-ideal', "`js/pont_incertitudes.js` et `moteur.effet_modules`"),
    'cout_unitaire': ("montant ou ordre de grandeur, sans modèle", None, "`moteur.evaluer_mesure` (loi de la ligne)"),
}

LIB_PARAM = {
    'age_effectif': "âge effectif moyen de départ (ans)", 'tau_top': "taux du haut du barème", 'rc': "rapport des revenus des conjoints",
    'calage': "calage sur l'impôt de 2024", 'intensite': "intensité du barème (0 = sobre, 1 = renforcé)", 'taux_plat': "taux plat équivalent au-delà de l'exonération",
    'plafond': "plafond d'héritage (€)", 'hausse': "hausse du Smic", 'mediane': "salaire brut médian du privé (€ par mois)", 'part_smic': "part des salariés au Smic",
    'n_prive': "salariés du privé (millions)", 'etp': "part en équivalent temps plein", 'diffusion': "diffusion aux salaires voisins du Smic",
    'indexation_allegement': "indexation des allègements (1 = droit actuel, 0 = gel)", 'eps': "élasticité de l'emploi au coût du travail",
    'allocation': "allocation par emploi perdu (€ par an)", 'part_agents': "part de la masse salariale publique au voisinage du Smic",
    'masse_publique': "masse salariale publique (Md€)", 'deja_point': "hausse du point d'indice déjà comptée", 'masse_financee': "masse salariale des secteurs financés (Md€)",
    'part_financee': "part de cette masse au voisinage du Smic", 'part_publique': "part prise en charge par la dépense publique", 'pec': "contrats aidés (milliers)",
    'cout_pec': "coût d'un contrat aidé (€ par an)", 'taux_pec': "part prise en charge par l'État", 'seuil': "pension minimale visée (€ nets par mois)",
    'part_cc': "part des retraités à carrière complète", 'aspa_hausse': "hausse du minimum vieillesse (Md€)", 'aspa_chevauchement': "chevauchement avec le minimum vieillesse (Md€)",
    'plafond_carb': "prix plafond (€ par litre)", 'prix': "prix (€ par litre, ou Md€ pour une entreprise)", 'volume': "volume (milliards de litres)",
    'part_plafonnee': "part des volumes plafonnée", 'elasticite': "élasticité-prix de la demande", 'marge': "marge absorbée par les distributeurs (€ par litre)",
    'rendement': "rendement annuel (part du prix)", 'flux': "flux annuel repris (Md€)", 'valeur_marche': "capitalisation (Md€)", 'part_rachetee': "part rachetée",
    'prime': "prime d'offre", 'autres': "autres actifs (Md€)", 'part_transfert': "part cédée gratuitement", 'part_fin': "part financière du patrimoine",
    'n_jeunes': "salariés de moins de 30 ans (ETP)", 'mediane_smic': "salaire médian des jeunes (en Smic)", 'sigma': "dispersion des salaires (écart-type du log)",
    'postes': "postes", 'cout_poste': "coût d'un poste (€ par an)", 'places': "places", 'cout_place': "coût public par place (€ par an)",
    'beneficiaires': "bénéficiaires", 'ecart_mensuel': "écart mensuel (€)", 'part_pleine': "part à taux plein", 'emplois': "emplois",
    'cout_net': "coût net par emploi (€ par an)", 'masse_salariale_md': "masse salariale publique (Md€)", 'part_semaine': "une semaine sur les semaines travaillées",
    'remplacement': "part des heures remplacées", 'jeunes': "jeunes", 'mois': "mois", 'cout_mensuel': "coût mensuel (€)",
}


# ------------------------------------------------------------------ lecture
def lire_json(chemin):
    with open(chemin, encoding='utf-8') as f:
        return json.load(f)


def charger():
    """Données nécessaires aux pages (aucun tirage)."""
    ctx = R.construire_ctx(False)
    progs = {}
    for cle in COLONNES + ('gl',):
        p, ms, mod = R.charger_programme(cle)
        if cle != 'langagement':
            ms = R.preparer(ms, ctx)
        progs[cle] = (p, ms, mod)
    res = lire_json(os.path.join(ICI, 'donnees', 'resultats.json'))
    taux = os.path.join(RACINE, 'modeles', 'taux-endogene', 'donnees', 'resultats.json')
    v2 = os.path.join(ICI, 'donnees', 'resultats-v2.json')
    return {'v2': lire_json(v2) if os.path.exists(v2) else None, 'ctx': ctx, 'progs': progs, 'R': res, 'taux': lire_json(taux) if os.path.exists(taux) else None,
            'resultats_md': open(os.path.join(ICI, 'resultats.md'), encoding='utf-8').read(), 'js': constantes_js()}


def _js(fichier, motif):
    t = open(os.path.join(RACINE, 'modeles', fichier), encoding='utf-8').read()
    m = re.search(motif, t)
    if not m:
        raise ValueError('constante introuvable dans %s : %s' % (fichier, motif))
    return m.groups()


def _liste(s):
    return [float(x) for x in re.split(r'\s*,\s*', s.strip())]


def constantes_js():
    """Constantes des modèles JavaScript citées dans les notes de famille, lues dans le code (pas recopiées)."""
    vds = 'systeme-ideal/variante_dette_stable.js'
    rem24, rem25, agents = _js(vds, r'remuneration2024:\s*([\d.]+),\s*remuneration2025:\s*([\d.]+),\s*agents:\s*(\d+)')
    real = _js(vds, r'realisation:\s*\{\s*bas:\s*([\d.]+),\s*central:\s*([\d.]+),\s*haut:\s*([\d.]+)\s*\}')
    d10 = _js('systeme-ideal/hauts_revenus.js', r'd10:\s*\{\s*bas:\s*([\d.]+),\s*central:\s*([\d.]+),\s*haut:\s*([\d.]+)')
    return {
        'remuneration2024': float(rem24), 'remuneration2025': float(rem25), 'agents': float(agents),
        'realisation_m1': [float(x) for x in real],
        'cout_point': float(_js(vds, r'coutPoint1pc:\s*([\d.]+)')[0]),
        'eti_d10': [float(x) for x in d10],
        'erosion_gf': _liste(_js('systeme-ideal/grandes_fortunes_0511.js', r'erosion1pt:\s*\[([^\]]+)\]')[0]),
        'trans_d': _liste(_js('systeme-ideal/transmissions_0611.js', r'\bd:\s*\[([^\]]+)\]')[0]),
        'trans_e': _liste(_js('systeme-ideal/transmissions_0611.js', r'eMobile:\s*\[([^\]]+)\]')[0]),
    }


def tableau_md(texte, titre_section, debut_ligne):
    """Cellules de la première ligne d'un tableau de resultats.md, dans la section qui commence par titre_section, dont la première cellule commence par debut_ligne."""
    i = texte.find(titre_section)
    if i < 0:
        raise ValueError('section absente de resultats.md : ' + titre_section)
    for ligne in texte[i:].splitlines():
        if ligne.startswith('|'):
            cells = [c.strip() for c in ligne.strip().strip('|').split('|')]
            if cells[0].replace('*', '').startswith(debut_ligne):
                return cells
    raise ValueError('ligne absente de resultats.md : ' + debut_ligne)


# ------------------------------------------------------------------ formats
f = RP.f
iv = RP.iv


def nb(x):
    """Nombre lisible à la française : milliers séparés, décimales utiles seulement."""
    if x is None:
        return 'n.d.'
    if abs(x - round(x)) < 1e-9 and abs(x) >= 1:
        s = '%d' % round(x)
    elif abs(x) >= 100:
        s = ('%.1f' % x).rstrip('0').rstrip('.')
    elif abs(x) >= 10:
        s = ('%.1f' % x).rstrip('0').rstrip('.')
    else:
        s = ('%.3f' % x).rstrip('0').rstrip('.')
    if re.match(r'^-?\d{4,}$', s):
        neg, s = s.startswith('-'), s.lstrip('-')
        g = []
        while len(s) > 3:
            g.insert(0, s[-3:])
            s = s[:-3]
        s = ('-' if neg else '') + ' '.join([s] + g)
    return s.replace('.', ',').replace('-', '−')


def pc(x, n=0):
    return f(100 * x, n) + ' %'


def loi(d, u=''):
    """Texte d'une loi {forme, bas, central, haut} ; u : unité accolée à chaque nombre."""
    n = lambda x: nb(x) + u
    if not isinstance(d, dict):
        return n(d)
    fo = d.get('forme', 'tri')
    b, c, h = d.get('bas'), d.get('central'), d.get('haut')
    if fo == 'fixe':
        return n(c)
    if fo == 'med':
        return 'plancher %s, médiane %s, plafond %s' % (n(b), n(c), n(h))
    if fo == 'unif':
        return 'de %s à %s' % (n(b), n(h))
    if fo in ('lognorm', 'normale'):
        return '%s (centiles 10 et 90 : %s et %s)' % (n(c), n(b), n(h))
    if b == c == h:
        return n(c)
    return 'de %s à %s, valeur la plus probable %s' % (n(b), n(h), n(c))


def mediane_loi(d):
    return M.quantile(d, 0.5)


def esc(t):
    return (t or '').replace('|', '/').replace('\n', ' ').strip()


def lien_modele(slug, texte=None):
    return '[%s](%s%s/)' % (texte or 'page du modèle', SITE, slug) if slug else ''


def ancre(i):
    return i.lower()


def lien_poste(cle, i):
    txt = i if cle in ('lr', 'ps', 'langagement') else '%s %s' % (COURTS[cle], i)
    return '[%s](./%s#%s)' % (txt, FICHIERS[cle], ancre(i))


def cap(s):
    return s[:1].upper() + s[1:] if s else s


FACTEUR = {'cout': 'coût', 'comportement': 'comportement', 'isf': 'intensité de l\'ISF'}
PCT = {'hausse', 'tau_top', 'taux_plat', 'part_smic', 'etp', 'diffusion', 'part_agents', 'part_financee', 'part_publique', 'taux_pec', 'part_cc',
       'part_plafonnee', 'rendement', 'part_rachetee', 'prime', 'part_transfert', 'part_fin', 'remplacement', 'part_pleine'}
LIB_LEVIER = {('nationalisation', 'prix'): "prix payé (Md€)", ('carburant', 'prix'): "prix de marché (€ par litre)", ('carburant', 'plafond'): "prix plafond (€ par litre)"}
COMPOSANTES = {
    'masse_brute': "masse salariale brute en plus dans le privé", 'cout_prive': "coût net pour les employeurs privés (non compté dans le solde)",
    'd_allegements': "hausse des allègements généraux", 'd_recettes_brut': "recettes publiques nettes avant l'effet sur l'emploi",
    'emplois_perdus_k': "emplois perdus (milliers)", 'solde_indexe': "variante où les allègements suivent le Smic",
    'solde_gele': "variante où le barème des allègements est gelé", 'beneficiaires_m': "retraités relevés (millions)",
    'part_sous_seuil': "part des carrières complètes sous le seuil", 'cout_pension': "coût du complément de pension",
    'aspa_net': "minimum vieillesse relevé, net", 'total': "coût total", 'ecart': "écart du prix de marché au plafond (€ par litre)",
    'volume': "volume plafonné (milliards de litres)", 'prive': "part supportée par les marges (privé)", 'public': "part à la charge du budget",
    'prix': "prix payé (Md€, une fois : dette)", 'flux': "flux annuel (Md€, solde)", 'transfert': "transfert en capital (Md€, déficit)"}


def lib_param(m, k):
    return LIB_LEVIER.get((m['levier'], k)) or LIB_PARAM.get(k, k)


def loi_p(k, d):
    """Loi d'un paramètre, en pourcentage quand c'est une part ou un taux."""
    if k in PCT:
        if isinstance(d, dict):
            d = {kk: (100 * v if isinstance(v, (int, float)) and kk in ('bas', 'central', 'haut') else v) for kk, v in d.items()}
        else:
            d = 100 * d
        return loi(d, ' %')
    return loi(d)


# ------------------------------------------------------------------ classement d'une ligne
def convention(m):
    """Traitement d'une ligne : 'module' (branché), 'produit', 'fixe', 'filtre' (annonce plafonnée, médiane jugée réalisable),
    'montant' (montant du parti, fourchette étroite), 'derive' (montant de LFI, 0,9 à 1,3 fois), 'decote' (recette de LFI entre 35 % et 100 %),
    'grossier' (ordre de grandeur sans source), 'propre' (bornes sourcées propres à la ligne)."""
    lev = m['levier']
    if lev == 'module_systeme':
        return 'systeme'
    if lev == 'produit':
        return 'produit'
    if lev != 'cout_unitaire':
        return 'module'
    v = m.get('valeur', {})
    ids = [h[0] for h in m.get('hypotheses', [])]
    if v.get('forme') == 'fixe':
        return 'fixe'
    if v.get('forme') == 'med':
        return 'filtre'
    if any(i.startswith('H-GROSSIER') for i in ids):
        return 'grossier'
    if 'H-DERIVE' in ids:
        return 'derive'
    if 'H-DECOTE' in ids:
        return 'decote'
    if m.get('annonce') and abs(v.get('central', 0) - m['annonce']) < 1e-9 and any('fois (convention, sans source)' in h[1] for h in m.get('hypotheses', [])):
        return 'montant'
    return 'propre'


def libelle_traitement(m):
    c = convention(m)
    v = m.get('valeur', {})
    if c in ('module', 'systeme', 'produit'):
        return MODULES[m['levier']][0]
    if c == 'fixe':
        return 'valeur fixe (%s)' % nb(v.get('central'))
    if c == 'filtre':
        return "annonce plafonnée, médiane jugée réalisable à %s de l'annonce" % pc(v['central'] / v['haut']) if v.get('haut') else 'annonce plafonnée'
    if c == 'montant':
        return 'montant du parti, %s à %s fois' % (nb(v['bas'] / v['central']), nb(v['haut'] / v['central']))
    if c == 'derive':
        return 'montant de LFI, %s à %s fois' % (nb(v['bas'] / v['central']), nb(v['haut'] / v['central']))
    if c == 'decote':
        return 'recette de LFI ramenée entre %s et 100 %%' % pc(v['bas'] / v['haut'])
    if c == 'grossier':
        return 'ordre de grandeur sans source primaire, dit « grossier »'
    return 'fourchette propre à la ligne'


def resume_parametres(m, n=2):
    """Paramètres clés (tirés) d'une ligne branchée, pour le tableau à double entrée."""
    ps = m.get('parametres') or m.get('facteurs_produit') or {}
    tires = [(k, d) for k, d in ps.items() if isinstance(d, dict) and d.get('forme') != 'fixe']
    out = []
    for k, d in tires[:n]:
        if d.get('forme') == 'med' or d.get('bas') == d.get('haut'):
            out.append('%s : %s' % (lib_param(m, k), loi_p(k, d)))
        else:
            s = 100 if k in PCT else 1
            out.append('%s : %s à %s%s' % (lib_param(m, k), nb(s * d['bas']), nb(s * d['haut']), ' %' if k in PCT else ''))
    return ' ; '.join(out)


def conventions_communes(D):
    """Paramètres des conventions, lus dans les lignes elles-mêmes : décote de LFI (bas / annonce, mode / annonce), fourchette des dépenses de LFI,
    fourchette la plus fréquente des dépenses des autres programmes."""
    from collections import Counter
    dec = [m['valeur'] for m in D['progs']['lfi'][1] if convention(m) == 'decote']
    der = [m['valeur'] for m in D['progs']['lfi'][1] if convention(m) == 'derive']
    mon = Counter((round(m['valeur']['bas'] / m['valeur']['central'], 4), round(m['valeur']['haut'] / m['valeur']['central'], 4))
                  for c in ('rn', 'lr', 'ps') for m in D['progs'][c][1] if convention(m) == 'montant')
    return {'decote_bas': sum(v['bas'] / v['haut'] for v in dec) / len(dec), 'decote_mode': sum(v['central'] / v['haut'] for v in dec) / len(dec), 'n_decote': len(dec),
            'derive': (der[0]['bas'] / der[0]['central'], der[0]['haut'] / der[0]['central']), 'montant': mon.most_common(1)[0][0]}


# ------------------------------------------------------------------ textes par ligne
def texte_lien(cle, m, mod):
    lien = m.get('lien') or ''
    if cle == 'lfi':
        return 'livre du programme' if lien.startswith(mod.LIEN) else 'source'
    if cle == 'rn' and lien == getattr(mod, 'DOSSIER', None):
        return 'annexe du contre-budget'
    if cle == 'gl':
        return 'livret'
    return 'article cité'


def ecart_annonces(ms, pm):
    """Écart entre la somme des annonces et la somme de nos médianes : part des économies filtrées, part du reste (Md€)."""
    fil = sum((m.get('annonce') or 0.0) - pm[m['id']]['p50'] for m in ms if convention(m) == 'filtre')
    tot = somme_annonces(ms) - sum(pm[m['id']]['p50'] for m in ms)
    return tot, fil, tot - fil


def nature_source(cle, m, mod):
    """Nature et cote de la source de la ligne (règle 11 : A à D)."""
    lien = m.get('lien') or ''
    if cle == 'lfi':
        return ("Livre du programme (cote D, auteur = le programme)." if lien.startswith(mod.LIEN)
                else "Source citée dans le fichier des mesures (voir la lecture).")
    if cle == 'rn':
        return ("Annexe du contre-budget du groupe RN (cote D, auteur = le programme)." if lien == getattr(mod, 'DOSSIER', None)
                else "Déclaration rapportée par la presse (cote C) ; le texte du parti n'est pas paru.")
    if cle == 'gl':
        return "Livret « Révolution écologique » (24 p., 09/11/2026), lu en entier (cote D, auteur = le programme)."
    return "Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme)."


def texte_annonce(cle, m, mod):
    if cle == 'langagement':
        return "%s Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué)" % f(m.get('central') or 0.0, 1)
    signe = 'recette ou économie' if m['sens'] == 'recette' else 'coût'
    if cle == 'lfi':
        a = m.get('an1') or 0.0
        if a:
            doc = mod.DOC.split(' (')[0]
            return '%s Md€ la première année (%s, %s) ; pas de montant de régime publié' % (nb(a), signe, doc[:1].lower() + doc[1:])
        return 'Aucun montant publié par LFI pour cette ligne'
    a = m.get('annonce')
    if not a:
        return "Aucun montant publié par le parti pour cette ligne"
    t = '%s Md€ par an (%s)' % (nb(a), signe)
    if cle == 'gl':
        t += " ; le livret donne le total (%s Md€ sur le quinquennat, ou 50 Md€ en une fois), la répartition par année est celle du fichier des mesures" % ('200' if m['sens'] == 'depense' else '50')
    if cle == 'rn' and m.get('an1_rn') is not None and abs(m['an1_rn'] - a) > 1e-9:
        t += " en régime, selon le fichier des mesures (les valeurs de 2031 de l'annexe ne sont connues que par la note de l'Institut de l'Entreprise) ; %s Md€ en 2027 dans l'annexe" % nb(m['an1_rn'])
    return t


def sens_effet(p50):
    if abs(p50) < 0.05:
        return 'pratiquement nul en médiane'
    if p50 > 1e-9:
        return 'améliore le solde public (recette nouvelle ou économie)'
    if p50 < -1e-9:
        return 'aggrave le solde public (dépense nouvelle ou baisse d\'impôt)'
    return 'sans effet sur le solde en régime'


def calendrier(m, prog):
    if m['levier'] == 'module_systeme':
        prof = {'const': 'à plein effet dès %d' % prog['debut'], 'ramp': 'monte de %d à %d (rampe du modèle)' % (prog['debut'], prog['regime']),
                'serie': 'suit la trajectoire année par année du modèle'}.get(m.get('profil'), 'profil du modèle')
        return 'Calendrier : %s ; valeur lue en %d.' % (prof, prog['regime'])
    n = prog['regime'] - prog['debut'] + 1
    fr = M.fractions_montee(m, n)
    if all(abs(x - 1) < 1e-9 for x in fr):
        t = 'plein effet dès %d' % prog['debut']
    else:
        t = 'part du régime atteinte de %d à %d : %s' % (prog['debut'], prog['regime'], ', '.join(pc(x) for x in fr))
        if 'an1_part' in m and 'montee' not in m:
            t += " (la première année reprend le montant inscrit par le parti, puis montée en ligne droite)"
    if m.get('fin'):
        t += ' ; le flux s\'arrête après %d' % m['fin']
    if m.get('etalement'):
        t += ' ; prix payé de %d à %d : %s' % (prog['debut'], prog['debut'] + len(m['etalement']) - 1, ', '.join(pc(x) for x in m['etalement']))
    return 'Calendrier : %s.' % t


def comment(cle, m, D):
    """Deux à quatre phrases : assiette, taux ou barème, comportement, calendrier."""
    prog = D['progs'][cle][0]
    ctx = D['ctx']
    lev, c = m['levier'], convention(m)
    p = m.get('parametres', {})
    v = m.get('valeur', {})
    J = D['js']
    if lev == 'retraites_age':
        s = ("Le programme fixe un âge ; nous en déduisons un âge effectif moyen de départ en %d : %s. Le modèle des retraites calcule le coût d'un départ avancé "
             "par rapport à l'âge effectif de %s ans de son scénario de %d (pensions versées plus tôt, cotisations et impôts perdus sur l'emploi des partants), "
             "cohorte recalée par le modèle démographique. Aucune autre réaction de comportement." % (prog['regime'], loi(p['age_effectif']), nb(ctx['retraites']['ageBase2032']), prog['regime']))
    elif lev == 'ir_openfisca':
        s = ("Le barème est appliqué par OpenFisca-France à une population de foyers types calée sur l'impôt de 2024. Taux du haut du barème : %s ; rapport des revenus des conjoints : %s ; calage : %s. "
             "Réaction : les revenus déclarés baissent selon une élasticité du revenu imposable de %s (centiles 10, 50 et 90 du facteur « comportement »)."
             % (loi_p('tau_top', p['tau_top']), loi(p['rc']), loi(p['calage']), ' / '.join(nb(x[1]) for x in M.ETI_POINTS)))
    elif lev == 'ir_jeunes':
        s = ("Coût = nombre de jeunes salariés × impôt moyen qu'ils paieraient, lu dans OpenFisca-France pour un salarié seul jusqu'au plafond de la mesure ; salaires en loi lognormale. "
             "Effectif : %s ; salaire médian : %s Smic. Aucune réaction de comportement n'est comptée." % (loi(p['n_jeunes']), loi(p['mediane_smic'])))
    elif lev == 'isf':
        s = ("Barème d'ISF du module des grandes fortunes, entre « sobre » et « renforcé » (intensité %s), net de l'IFI actuel (%s Md€). "
             "Érosion de l'assiette et exil selon le facteur « comportement » : érosion à 1 point d'impôt de %s %% (favorable, central, défavorable)."
             % (loi(p['intensite']), nb(ctx['ifi_actuel']), ' / '.join(nb(100 * x) for x in J['erosion_gf'])))
    elif lev == 'plancher':
        s = ("Complément pour que l'impôt payé atteigne le minimum visé par la mesure sur les très grands patrimoines, après l'ISF et le prélèvement unique déjà payés ; même intensité que la ligne d'ISF. "
             "Érosion et exil du module (érosion à 1 point : %s %%)." % ' / '.join(nb(100 * x) for x in J['erosion_gf']))
    elif lev == 'iff':
        s = ("Barème « sobre » du module d'ISF appliqué à la seule part financière du patrimoine (%s), moins l'IFI supprimé (%s Md€) ; érosion et exil du module "
             "(érosion à 1 point : %s %%)." % (loi_p('part_fin', p['part_fin']), nb(ctx['ifi_actuel']), ' / '.join(nb(100 * x) for x in J['erosion_gf'])))
    elif lev == 'zucman':
        z = [x['net'] for x in ctx['systeme']['zucman_droit_actuel']]
        s = ("Impôt minimal visé par la mesure sur les très grands patrimoines, appliqué au droit actuel (sans ISF), net de l'impôt déjà payé ; érosion et exil du module. "
             "Recette nette du module : %s Md€ (favorable, central, défavorable), lue sur le facteur « comportement »." % ' / '.join(f(x, 1) for x in z))
    elif lev == 'succession':
        s = ("Module des transmissions : exonération prévue par la mesure puis taux plat équivalent (%s), avec la déclaration et la planification (%s %%) "
             "et les départs des patrimoines mobiles (%s %%) ; plus la reprise de ce qui dépasse le plafond d'héritage (%s €). Effet net des droits actuels."
             % (loi_p('taux_plat', p['taux_plat']), ' / '.join(nb(100 * x) for x in J['trans_d']), ' / '.join(nb(100 * x) for x in J['trans_e']), nb(p['plafond']['central'])))
    elif lev == 'smic':
        s = ("Salaires du privé en loi lognormale ; hausse du Smic : %s ; cotisations, CSG, impôt, prime d'activité et allègements lus dans OpenFisca-France par foyer type. "
             "Emploi perdu selon une élasticité au coût du travail : %s ; indexation des allègements (1 = droit actuel, 0 = gel) : %s. Seuls les effets sur les finances publiques sont comptés, pas le coût pour les entreprises."
             % (loi_p('hausse', p['hausse']), loi(p['eps']), loi(p['indexation_allegement'])))
    elif lev == 'pension_min':
        s = ("Distribution des pensions des retraités à carrière complète (DREES) : part sous le seuil et complément à verser. Seuil (€ nets par mois) : %s ; "
             "part des carrières complètes : %s ; minimum vieillesse relevé (Md€) : %s, moins un chevauchement (Md€) : %s."
             % (loi(p['seuil']), loi_p('part_cc', p['part_cc']), loi(p['aspa_hausse']), loi(p['aspa_chevauchement'])))
    elif lev == 'carburant':
        s = ("Coût = volume × (prix de marché − plafond − marge absorbée par les distributeurs), l'État compensant le reste. Plafond (€ par litre) : %s ; prix de marché (€ par litre) : %s ; "
             "volume (milliards de litres) : %s ; marge absorbable (€ par litre) : %s." % (nb(p['plafond']), loi(p['prix']), loi(p['volume']), loi(p['marge'])))
    elif lev == 'nationalisation':
        s = ("Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, "
             "les pertes reprises et la part cédée gratuitement. Paramètres : %s." % ' ; '.join('%s : %s' % (lib_param(m, k), loi_p(k, d)) for k, d in p.items()))
    elif lev == 'produit':
        s = 'Produit de : %s.' % ' ; '.join('%s (%s)' % (lib_param(m, k), loi_p(k, d)) for k, d in m['facteurs_produit'].items())
    elif lev == 'module_systeme':
        i38 = D['js_annees'].index(2038) if 'js_annees' in D else None
        fav = m['central'] + m['d_fav'][i38] if i38 is not None else None
        dfv = m['central'] + m['d_def'][i38] if i38 is not None else None
        s = ("La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, %s Md€ (favorable), "
             "%s (central), %s (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « %s » (poids %s)."
             % (f(fav, 1), f(m['central'], 1), f(dfv, 1), FACTEUR.get(m.get('facteur'), m.get('facteur')), nb(m.get('lambda', 0))))
    elif c == 'fixe':
        s = "Valeur retenue : %s Md€. Raison : voir la lecture ci-dessous." % nb(v.get('central'))
    elif c == 'filtre':
        s = ("Le plafond est l'annonce du parti (%s Md€) ; la médiane (%s Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher %s. "
             "Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond." % (nb(v['haut']), nb(v['central']), nb(v['bas'])))
        if m.get('annonce') and abs(v['haut'] - m['annonce']) > 1e-9:
            s += (" Attention : le plafond retenu (%s Md€) n'est pas le montant annoncé en régime (%s Md€) ; la raison est dans la lecture ci-dessous, "
                  "et la somme des annonces de cette page compte le second." % (nb(v['haut']), nb(m['annonce'])))
    elif c == 'montant':
        s = ("Coût certain une fois la mesure votée : le montant du parti (%s Md€) est la valeur la plus probable, dans une fourchette de %s à %s fois (convention, sans source). Aucune réaction de comportement."
             % (nb(v['central']), nb(v['bas'] / v['central']), nb(v['haut'] / v['central'])))
    elif c == 'derive':
        s = ("Le montant de LFI (%s Md€) est la valeur la plus probable ; fourchette de %s à %s fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source)."
             % (nb(v['central']), nb(v['bas'] / v['central']), nb(v['haut'] / v['central'])))
    elif c == 'decote':
        s = ("Haut : le montant de LFI (%s Md€) ; bas : %s de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : %s."
             % (nb(v['haut']), pc(v['bas'] / v['haut']), nb(v['central'])))
    else:
        s = "Fourchette retenue : %s Md€ (voir la lecture ci-dessous)." % loi(v)
    return s + ' ' + calendrier(m, prog)


def choix_ia(cle, m):
    """Choix posés par l'IA pour la ligne : hypothèses sans source (estimation de Claude), conventions de loi, poids de corrélation."""
    out = []
    for h in m.get('hypotheses', []):
        if 'Claude' in (h[2] or '') or (h[3] == 'D' and h[4] == 'sans objet'):
            out.append('%s : %s' % (h[0], esc(h[1]).rstrip('.')))
    c = convention(m)
    if c == 'filtre':
        out.append("la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte)")
    elif c in ('montant', 'derive'):
        out.append('la largeur de la fourchette autour du montant du parti')
    elif c == 'decote':
        out.append('la borne basse à une fraction fixe du montant de LFI')
    if m['levier'] == 'module_systeme':
        out.append("lire les bornes du modèle comme centiles 10 et 90")
    if m.get('facteur'):
        out.append('le poids %s sur le facteur commun « %s »' % (nb(m.get('lambda', 0)), FACTEUR.get(m['facteur'], m['facteur'])))
    return out


def fiabilite(cle, m, D):
    c = convention(m)
    t = {'module': "Branché sur un modèle du dépôt.", 'systeme': "Module de notre modèle, propagé dans le tirage.",
         'produit': "Coût unitaire × quantité, sourcés quand c'est possible.", 'fixe': "Laissé à une valeur fixe, avec la raison écrite.",
         'filtre': "Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne.", 'montant': "Pas de modèle : montant du parti, repris tel quel.",
         'derive': "Pas de modèle : montant de LFI, repris avec une fourchette.", 'decote': "Pas de modèle : montant de LFI, ramené par une convention.",
         'grossier': "« Encore grossier » : ordre de grandeur sans source primaire lue.", 'propre': "Pas de modèle : fourchette propre à la ligne."}[c]
    if c not in ('grossier',) and any(h[0].startswith('H-GROSSIER') for h in m.get('hypotheses', [])):
        t += " Une partie de la ligne est encore « grossière »."
    cotes = sorted({h[3] for h in m.get('hypotheses', []) if h[3]})
    if cotes:
        t += ' Cotes des sources de la ligne : %s.' % ', '.join(cotes)
    nv = sum(str(x).count('⚠') for x in [m.get('interpretation', ''), m.get('contrainte', '')] + [h[1] + ' ' + h[2] for h in m.get('hypotheses', [])])
    if nv:
        t += ' %d point%s marqué%s ⚠️ (non vérifié).' % (nv, 's' if nv > 1 else '', 's' if nv > 1 else '')
    if m.get('contrainte'):
        t += ' Obstacle nommé : %s.' % esc(m['contrainte']).rstrip('.')
    if cle == 'langagement':
        t += ' Cote du module : %s.' % m['hypotheses'][0][3]
    return t


def groupe_module(m):
    """Module commun derrière des leviers différents (vérifié dans le code : mêmes fonctions et mêmes constantes de comportement)."""
    if m['levier'] in ('isf', 'plancher', 'iff', 'zucman'):
        return 'grandes fortunes'
    if m['levier'] == 'succession' or (m['levier'] == 'module_systeme' and 'transmissions_0611.js trois' in (m.get('lien') or '') + m.get('libelle', '')):
        return 'transmissions'
    return None


def comparer(m1, m2):
    """Ce que le code dit de deux lignes de la même famille : même module et mêmes paramètres, ou ce qui diffère."""
    g1, g2 = groupe_module(m1), groupe_module(m2)
    if g1 and g1 == g2 and m1['levier'] != m2['levier']:
        if g1 == 'transmissions':
            return 'même fonction `trois()` du module des transmissions, mêmes comportements ; barème propre à la mesure'
        return 'même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure'
    if m1['levier'] != m2['levier']:
        return libelle_traitement(m2)
    if m1['levier'] == 'cout_unitaire':
        return libelle_traitement(m2)
    p1, p2 = m1.get('parametres') or m1.get('facteurs_produit') or {}, m2.get('parametres') or m2.get('facteurs_produit') or {}
    diff = sorted(k for k in set(p1) | set(p2) if p1.get(k) != p2.get(k))
    if m1['levier'] == 'module_systeme':
        return 'notre modèle'
    if not diff:
        return 'même module, mêmes paramètres'
    return 'même module ; paramètres propres à la mesure : %s' % ', '.join(LIB_PARAM.get(k, k) for k in diff)


def ailleurs(cle, m, D):
    fam = AFFECTATION[cle][m['id']]
    grp = []
    for c2 in PAGES:
        if c2 == cle:
            continue
        lst = [m2 for m2 in D['progs'][c2][1] if AFFECTATION[c2].get(m2['id']) == fam]
        if not lst:
            continue
        par = {}
        for m2 in lst:
            par.setdefault(comparer(m, m2), []).append(m2['id'])
        grp.append('%s : %s' % (NOMS[c2], ' ; '.join('%s (%s)' % (', '.join(lien_poste(c2, i) for i in ids), t) for t, ids in par.items())))
    lien = '[note de famille « %s »](./memes-modeles.md#f-%s)' % (TITRE_FAMILLE[fam], fam)
    if not grp:
        return "Aucune ligne de la même famille dans les autres programmes du banc. Voir la %s." % lien
    return '%s. Ce que le code confirme et ce qui diffère : %s.' % (' — '.join(grp), lien)


# ------------------------------------------------------------------ page d'un programme
def totaux(cle, D):
    r = D['R'][cle]
    return iv(r['solde_regime'], 0)


def somme_annonces(ms):
    return sum((m.get('annonce') or 0.0) * (1 if m['sens'] == 'recette' else -1) for m in ms)


OBJECTIONS = {}


def objection_lfi(D):
    pm = D['R']['lfi']['par_mesure']
    ms_ = D['R']['moins_severe']['lfi']['par_mesure']
    ms = {m['id']: m for m in D['progs']['lfi'][1]}
    gain = sum(ms_[k]['p50'] - pm[k]['p50'] for k in ('R01a', 'R04', 'R05'))
    r = D['R']['lfi']
    CC = conventions_communes(D)
    return [
        "**Les recettes sont nettes de réactions, celles de LFI sont brutes.** L'ISF rétabli, inscrit à %s Md€ la première année, rapporte %s Md€ dans le banc ; les successions, inscrites à %s Md€, %s Md€. "
        "L'écart vient de l'érosion de l'assiette et de l'exil que notre module des grandes fortunes retire, et que les chiffrages proches de LFI ne retiennent pas : l'Institut La Boétie l'a dit lui-même en audition, ses montants sont bruts. "
        "Avec des hypothèses d'exil moins sévères, appliquées à tous, ces trois lignes gagnent %s Md€ en médiane (§ 10 des résultats) : le signe du total ne change pas."
        % (nb(ms['R01a']['an1']), iv(pm['R01a'], 1), nb(ms['R05']['an1']), iv(pm['R05'], 1), f(gain, 1)),
        "**Les recettes des entreprises sont ramenées par une convention sans source.** Faute de chiffre indépendant, la borne basse de %d lignes est fixée à %s du montant de LFI. "
        "C'est le point le plus faible de notre côté ; ces lignes pèsent ensemble %s Md€ en médiane." % (CC['n_decote'], pc(CC['decote_bas']), f(sum(pm[m['id']]['p50'] for m in ms.values() if convention(m) == 'decote'), 1)),
        "**La relance.** Le programme du Nouveau Front populaire de 2024, soutenu par LFI, présentait la dépense comme largement autofinancée par l'activité. Avec les multiplicateurs de la littérature, appliqués de la même façon à tous, l'effet passe de %s à %s Md€ (§ 2) : il reste négatif, mais un multiplicateur plus fort que nos bornes le réduirait encore."
        % (iv(r['solde_regime'], 0), iv(r['solde_rel'], 0)),
        "**La retraite à 60 ans.** Notre lecture suppose qu'une partie seulement des assurés part à 60 ans (âge effectif moyen central : %s ans). Si tous partaient à 60 ans, le coût serait plus élevé, pas plus bas."
        % nb(ms['D05']['parametres']['age_effectif']['central']),
    ]


def objection_rn(D):
    pm = D['R']['rn']['par_mesure']
    ms = {m['id']: m for m in D['progs']['rn'][1]}
    r = D['R']['rn']
    tot = somme_annonces(ms.values())
    sm = sum(v['p50'] for v in pm.values())
    return [
        "**Nos médianes pour les économies sont des jugements.** Pour chaque économie annoncée, nous retenons une part de l'annonce, compte tenu d'un obstacle juridique ou pratique que nous nommons. "
        "Le parti peut répondre que plusieurs obstacles se lèvent par un référendum, une révision de la Constitution ou une négociation européenne. Si chaque ligne rapportait son annonce, "
        "la somme nette serait de %s Md€ ; nous retenons %s Md€ en somme des médianes, et %s en médiane du total. Sur cet écart de %s Md€, %s viennent des économies passées par le filtre "
        "et %s des autres lignes (surtout la retraite). Ce filtre n'est appliqué ni à La France insoumise ni à notre système "
        "(voir [les mêmes modèles pour tous](./memes-modeles.md#asymetries))." % ((f(tot, 0), f(sm, 0), iv(r['solde_regime'], 0)) + tuple(f(x, 0) for x in ecart_annonces(list(ms.values()), pm))),
        "**La retraite.** Le parti chiffre le retour à 62 ans à %s Md€ en régime ; notre modèle des retraites donne %s Md€, parce qu'il part de l'âge effectif de la loi de 2023 dans son scénario (%s ans). "
        "Le texte de la réforme n'est pas paru." % (nb(ms['D01']['annonce']), iv(pm['D01'], 1), nb(D['ctx']['retraites']['ageBase2032'])),
        "**Les retours dynamiques** (impôt sur les sociétés, TVA, coût de la dette : %s Md€ dans l'annexe) sont comptés à zéro dans le solde statique. La relance est calculée à part, "
        "avec les mêmes multiplicateurs que pour tous : l'effet passe alors de %s à %s Md€ (§ 2)." % (nb(ms['G04']['annonce']), iv(r['solde_regime'], 0), iv(r['solde_rel'], 0)),
    ]


def objection_lr(D):
    pm = D['R']['lr']['par_mesure']
    ms = {m['id']: m for m in D['progs']['lr'][1]}
    return [
        "**Nos médianes pour les économies sont des jugements**, comme pour le Rassemblement national : la somme des annonces nettes est de %s Md€, la somme de nos médianes de %s Md€, "
        "et la médiane du total de %s Md€. Le candidat peut répondre que la méthode des budgets « base zéro » et le non-remplacement des départs produisent plus que nos médianes."
        % (f(somme_annonces(ms.values()), 0), f(sum(v['p50'] for v in pm.values()), 0), iv(D['R']['lr']['solde_regime'], 0)),
        "**Notre lecture des montants lui est favorable.** Nous lisons les « 197 milliards cumulés jusqu'en 2032 » comme le niveau annuel atteint en 2032 ; lus comme une somme de cinq ans, "
        "ils vaudraient beaucoup moins par an. Nous comptons aussi les économies par rapport au droit actuel, pas par rapport à une dépense tendancielle qui croîtrait plus vite (H-LR-TENDANCIEL).",
        "**Les retraites ne passent pas par le modèle des retraites.** La mesure (« %s ») est chiffrée par un jugement (%s Md€ en médiane), parce que notre modèle ne traite "
        "que les départs avancés : c'est une différence de traitement avec La France insoumise et le Rassemblement national, écrite dans le fichier des mesures (T-LR-1)." % (ms['LR12']['libelle'], iv(pm['LR12'], 1)),
    ]


def objection_ps(D):
    pm = D['R']['ps']['par_mesure']
    ms = {m['id']: m for m in D['progs']['ps'][1]}
    return [
        "**Un budget annuel lu comme un programme.** Le contre-budget 2027 est un budget d'une année ; nous le lisons comme permanent (H-PS-PERMANENCE) et comme la base du candidat (H-PS-PERIMETRE), "
        "ce que le candidat peut récuser : il n'a pas publié de chiffrage propre.",
        "**L'impôt minimal sur les très grands patrimoines** est annoncé à %s Md€ ; notre module des grandes fortunes, le même que pour l'ISF de La France insoumise, en retient %s Md€ après érosion et exil. "
        "Les défenseurs de la mesure citent des estimations bien plus hautes ; la variante moins sévère du banc n'a pas encore été rejouée pour ce programme." % (nb(ms['PS01']['annonce']), iv(pm['PS01'], 1)),
        "**La CSG progressive** pèse %s Md€ sur le solde dans notre lecture, contre un coût annoncé de %s Md€ : notre chiffre est un calcul de coin de table, pas un calcul OpenFisca (T-PS-1). Le parti peut le contester à bon droit."
        % (iv(pm['PS10'], 1), nb(ms['PS10']['annonce'])),
    ]


def objection_langagement(D):
    L = D['R']['langagement']
    ms = D['progs']['langagement'][1]
    somme = sum(m['central'] for m in ms)
    tot = L['central']['solde_2038']
    F = L['ensemble2038']['composition']['F']
    t = D['taux']['programmes']['langagement'] if D['taux'] else None
    out = [
        "**Le banc est notre outil, et il chiffre notre propre programme.** C'est l'objection la plus forte. L'auteur est partie prenante ; le code et les hypothèses sont ouverts pour que chacun refasse le calcul.",
        "**Nos leviers votés sont réglés pour stabiliser la dette.** %s Md€ par an sont calés dans notre modèle pour que la dette cesse de monter après 2038, à taux fixe ; aucun autre programme n'a de levier réglé ainsi. "
        "Même avec ce réglage, la dette ne reste stable après 2038 que dans %s des tirages." % (f(F, 1), pc(L['stats']['part_dette_stable_des_2038'])),
        "**Plus de la moitié de notre effet n'est pas détaillée module par module.** Au central, les %d modules font %s Md€ sur %s ; le reste (%s Md€, dont les leviers votés) "
        "réunit le socle hérité des premières versions du modèle, les corrections du grand livre, l'impôt de suite et le point d'indice, fixés à leur valeur centrale. "
        "Notre intervalle est donc trop étroit : les scénarios d'ensemble du modèle vont de %s à %s Md€ en 2038." % (len(ms), f(somme, 1), f(tot, 1), f(tot - somme, 1), f(L['ensemble2038']['ensemble2038']['haut'], 0), f(L['ensemble2038']['ensemble2038']['bas'], 0)),
        "**Nos économies ne passent pas par le filtre** de faisabilité appliqué aux économies du Rassemblement national, des Républicains et du PS.",
    ]
    if t:
        out.append("**Le taux fixe nous flatte.** Avec un taux qui suit la dette, notre système entre en zone de crise avant 2058 dans %s des tirages, et il lui manque environ %s Md€ par an pour stabiliser la dette."
                   % (pc(t['variantes']['central']['part_crise_2058']), nb(t['effort_supplementaire']['central'])))
    out.append("**Ce qui n'est pas dans la trajectoire.** Le capital de départ et quelques lignes nouvelles n'y sont pas encore (chapitre 12) : un concurrent peut nous faire le reproche que nous faisons aux autres.")
    return out


def objection_gl(D):
    pm = D['R']['gl']['par_mesure']
    ms = {m['id']: m for m in D['progs']['gl'][1]}
    r = D['R']['gl']
    return [
        "**C'est un chiffrage partiel, et le dire en premier ne suffit pas à le rendre juste.** Le livret ne donne que deux montants ; tout le reste du programme (retraites, impôts, santé, seconde partie écologique) est à zéro ici. "
        "Le résultat ci-dessus n'est donc ni le coût ni le bénéfice du programme de Raphaël Glucksmann : un programme complet pourrait l'aggraver comme l'améliorer.",
        "**Les 200 Md€ ne sont peut-être pas tous nouveaux.** Nous les lisons comme de la dépense en plus du droit actuel (%s Md€ par an de 2028 à 2032) ; le texte dit seulement « nous investirons », et une partie peut être déjà au budget ou financée hors du budget de l'État "
        "(livret d'épargne, emprunt européen, investissements privés « mobilisés »). Si la moitié seulement est nouvelle, le coût est surestimé de moitié." % nb(ms['GL01']['annonce']),
        "**La contribution exceptionnelle de 50 Md€ est notre point le plus sévère.** Le livret ne donne ni seuil, ni taux, ni assiette : nous la lisons avec le score le plus bas de la règle commune (M 0, J 0, E 0), soit %s Md€ en médiane contre 50 annoncés. "
        "Ses défenseurs diront qu'un prélèvement unique sur quelques milliers de foyers est conçu pour passer, et que des études (non relues ici) évaluent l'assiette à plus de 1 000 Md€ ; un prélèvement de l'ordre de 4 %% serait alors possible sur le papier. "
        "Le banc ne dit pas qu'il est impossible : il dit que le texte ne permet pas de savoir s'il est conforme à la Constitution." % iv(pm['GL02'], 1),
        "**Le livret promet la stabilisation de la dette à l'horizon 2032 ; nous trouvons une dette de %s %% du PIB en 2032** (à taux fixe, avec ces deux seuls montants). Ce n'est pas une réfutation : l'objectif repose sur des mesures non chiffrées "
        "(effet d'entraînement, croissance, seconde partie du programme)." % iv({k: 100 * v for k, v in r['dette2032'].items()}, 0),
    ]


OBJECTIONS = {'lfi': objection_lfi, 'rn': objection_rn, 'lr': objection_lr, 'ps': objection_ps, 'gl': objection_gl, 'langagement': objection_langagement}

INTRO_SOURCE = {
    'lfi': lambda mod: "Programme lu : *L'Avenir en commun*, édition 2027 (%s), et %s." % (mod.LIEN, mod.DOC.replace('Document', 'le document')),
    'rn': lambda mod: "Programme lu : %s (cote D, auteur = le programme)." % mod.SRC_RN,
    'lr': lambda mod: "Programme lu : %s (cote D, auteur = le programme)." % mod.SRC_LR,
    'ps': lambda mod: "Programme lu : %s (cote D, auteur = le programme)." % mod.SRC_PS,
    'gl': lambda mod: "Programme lu : %s (cote D, auteur = le programme)." % mod.SRC_GL,
    'langagement': lambda mod: "Programme lu : notre propre modèle du système ([page du modèle](%ssysteme-ideal/)), tel qu'il est exporté pour le banc. Ce n'est pas une annonce indépendante : c'est le chiffrage que nous défendons, et nous le passons dans le même banc que les autres." % SITE,
}


def non_chiffrees(cle, D):
    mod = D['progs'][cle][2]
    if cle == 'langagement':
        out = ['%s : fixé à sa valeur centrale (%s)' % (x['libelle'], x['raison']) for x in mod.FIXE]
        out += ["socle hérité des premières versions du modèle et corrections du grand livre : fixés à leur valeur centrale, non propagés (§ 6 ter des résultats)",
                "capital de départ et quelques lignes nouvelles : hors de la trajectoire (chapitre 12)"]
        return out
    return list(getattr(mod, 'NON_CHIFFREES', []))


def page_programme(cle, D):
    prog, ms, mod = D['progs'][cle]
    r = D['R'][cle]
    pm = r['par_mesure']
    A = []
    a = A.append
    titre = 'Chiffrage poste par poste : %s' % (NOMS[cle] if cle != 'langagement' else 'notre système')
    a('---')
    a('titre: "%s"' % titre)
    a('statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions')
    a('---')
    a('')
    a('# %s' % titre)
    a('')
    a("Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, "
      "comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. "
      "Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, "
      "et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).")
    a('')
    a(INTRO_SOURCE[cle](mod))
    a('')
    if cle == 'gl':
        a("**Chiffrage partiel : à lire avant tout chiffre.** Le livret ne couvre que la partie climat et énergie du projet de Raphaël Glucksmann ; la seconde partie (biodiversité, eau, agriculture, pêche, alimentation, pollutions, santé) est annoncée « dans quelques semaines » "
          "et le programme complet (« Acte Un », 88 pages) n'est pas chiffré. Le livret ne donne que **deux montants** : 200 Md€ d'argent public sur le quinquennat et 50 Md€ de contribution exceptionnelle sur les plus hauts patrimoines, une seule année. "
          "Tout le reste est à zéro dans cette colonne, qui est **distincte** de celle du PS (contre-budget du groupe socialiste) : elle ne dit pas ce que coûterait le programme, elle dit ce que deviennent la dette et le déficit avec ces deux seuls montants. "
          "L'effet sur le solde s'arrête en 2032, faute de montant au-delà : lire l'effet année par année (`resultats-v2.md`, § 4) plutôt que « en régime », qui additionne ici un coût de cinq ans et une recette d'un an.")
        a('')
    a("Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. "
      "Chaque estimation est une médiane de %s tirages, suivie entre crochets de l'intervalle qui en contient 80 %% (centiles 10 et 90). Régime : %d. "
      "Résultats complets : `modeles/banc-programmes/resultats.md`. Pages voisines : %s."
      % (nb(D['R']['tirages']), prog['regime'], ', '.join('[%s](./%s)' % (NOMS[c], FICHIERS[c]) for c in PAGES if c != cle)))
    a('')
    a('## Le total')
    a('')
    a('| | %s |' % NOMS[cle])
    a('|---|---|')
    if cle == 'langagement':
        a('| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en %d (Md€) | **%s** |' % (prog['regime'], totaux(cle, D)))
        a('| Même effet, valeur centrale du modèle (sans tirage) | %s |' % f(r['central']['solde_2038'], 1))
        a('| Somme des valeurs centrales des %d modules | %s |' % (len(ms), f(sum(m['central'] for m in ms), 1)))
        a('| Hors modules (leviers votés, socle hérité, corrections), fixé au central | %s |' % f(r['central']['solde_2038'] - sum(m['central'] for m in ms), 1))
        a('| dont leviers votés, réglés pour stabiliser la dette | %s |' % f(r['ensemble2038']['composition']['F'], 1))
    else:
        a('| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | **%s** |' % totaux(cle, D))
        a('| dont recettes nouvelles et économies | %s |' % iv(r['recettes_regime'], 0))
        a('| dont dépenses nouvelles et baisses d\'impôts | %s |' % iv(r['depenses_regime'], 0))
        a('| Somme des médianes des postes ci-dessous | %s |' % f(sum(v['p50'] for v in pm.values()), 0))
        if cle in ('rn', 'lr', 'ps', 'gl'):
            a('| Somme des montants annoncés par le parti, ligne par ligne (même signe) | %s |' % f(somme_annonces(ms), 0))
        a('| Part des tirages où le programme aggrave le déficit | %s |' % pc(r['part_solde_negatif']))
    a('| Dette publique en 2038 (%% du PIB ; taux d\'intérêt fixe de %s %%) | %s |' % (f(100 * D['ctx']['macros']['reference']['r'], 2), iv({k: 100 * v for k, v in r['dette2038'].items()}, 0)))
    a('| Dette publique en 2058 (%% du PIB) | %s |' % iv({k: 100 * v for k, v in r['dette2058'].items()}, 0))
    a('')
    a(("Lecture. La médiane du total n'est pas la somme des médianes des postes : les postes sont tirés ensemble, avec des lois souvent asymétriques%s. "
       % (" (pour une économie passée par le filtre, la moitié des tirages tombe entre la médiane et l'annonce, plus haut : la médiane du total est donc au-dessus de la somme des médianes)"
          if any(convention(m) == 'filtre' for m in ms) else '')) +
      "Le total est celui du tableau comparatif des résultats (§ 1 et § 11.1 de `modeles/banc-programmes/resultats.md`) ; un test vérifie qu'il est recopié sans écart.")
    if cle == 'lfi':
        a("Les nationalisations ajoutent en outre %s Md€ de capital engagé de %d à %d : une opération financière, qui augmente la dette et non le déficit."
          % (iv(r['capital'], 0), prog['debut'], prog['debut'] + 2))
    a('')
    if cle == 'lfi' and D.get('v2') and 'lfi_cb' in D['v2']['programmes']:
        a('## Sensibilité : le contre-budget 2027 de LFI contre le programme complet')
        a('')
        a("La colonne de cette page chiffre *L'Avenir en commun* en entier. LFI a aussi publié en octobre 2026 un document budgétaire annuel, « Comment nous allons remettre de l'ordre dans les comptes publics » (24 p. ; inventaire dans `sources-programmes-2027.md`), "
          "qui chiffre 37 lignes : **106,4 Md€** de recettes supplémentaires et **81,7 Md€** de dépenses d'urgence, soit 24,7 Md€ de réduction du déficit annoncée (p. 6, 12-14) ; il dit lui-même ne pas constituer un chiffrage complet du programme (p. 7). "
          "Le banc le chiffre à part, en sensibilité (`programmes/lfi_cb/mesures.py`) : mêmes recettes que ci-dessus (mêmes modèles, même règle de faisabilité, sans l'impôt sur le revenu à 14 tranches), dépenses limitées aux 14 lignes chiffrées du document, à leur montant de première année lu comme permanent. "
          "Les deux colonnes ci-dessous passent par la règle de faisabilité commune de la version 2 (`resultats-v2.md`), pas par celle de cette page.")
        a('')
        a('| (règle v2, médiane [intervalle à 80 %]) | LFI, programme complet | LFI, contre-budget 2027 |')
        a('|---|---|---|')
        V = D['v2']['programmes']
        for lib, k, fct in (("Effet sur le solde en régime (Md€)", 'solde_regime', lambda x: iv(x, 0)), ("dont recettes nouvelles et économies (Md€)", 'recettes_regime', lambda x: iv(x, 0)),
                            ("dont dépenses nouvelles et baisses d'impôts (Md€)", 'depenses_regime', lambda x: iv(x, 0)), ("Déficit public 2038 (% du PIB)", 'deficit2038_pct', lambda x: iv({q: 100 * v for q, v in x.items()}, 1)),
                            ("Dette publique 2032 (% du PIB)", 'dette2032', lambda x: iv({q: 100 * v for q, v in x.items()}, 0)), ("Dette publique 2038 (% du PIB)", 'dette2038', lambda x: iv({q: 100 * v for q, v in x.items()}, 0))):
            a('| %s | %s | %s |' % (lib, fct(V['lfi'][k]), fct(V['lfi_cb'][k])))
        a('')
        a("Lecture. L'écart entre les deux colonnes est celui d'un budget d'une année et d'un programme complet : le document budgétaire laisse de côté le Smic à 1 700 € net, le blocage du prix des carburants, les nationalisations, la retraite à 60 ans à plein effet, "
          "« 100 % Sécu », la garantie d'emploi et la plupart des services publics du programme, et chiffre les mesures qu'il retient à leur coût de la première année. Ce n'est pas un chiffrage plus exact : c'est un chiffrage plus étroit. "
          "Les 106,4 Md€ de recettes sont les mêmes lignes dans les deux colonnes ; leur médiane (après la règle de faisabilité) est bien inférieure au montant annoncé.")
        a('')
    a('## Ce que nous n\'avons pas pu chiffrer')
    a('')
    for x in non_chiffrees(cle, D):
        a('- %s.' % esc(x).rstrip('.'))
    a('')
    a('## La meilleure objection à notre chiffrage')
    a('')
    sujet = {'lfi': 'La France insoumise', 'rn': 'le Rassemblement national', 'lr': 'Les Républicains', 'ps': 'le PS et Place publique', 'gl': 'Raphaël Glucksmann', 'langagement': 'un contradicteur'}[cle]
    a("Ce que %s %s opposer à ce chiffrage, dit aussi loyalement que possible :" % (sujet, 'peuvent' if cle in ('lr', 'ps') else 'peut'))
    a('')
    for x in OBJECTIONS[cle](D):
        a('- %s' % x)
    a('')
    a('## Les postes en un tableau')
    a('')
    a('| N° | Poste | %s | Notre estimation (Md€) | Modèle ou traitement |' % ('Valeur centrale du modèle (Md€)' if cle == 'langagement' else 'Annoncé par le parti (Md€)'))
    a('|---|---|---|---|---|')
    ordre = [m for fam, _ in FAMILLES for m in ms if AFFECTATION[cle].get(m['id']) == fam]
    for m in ordre:
        if cle == 'langagement':
            ann = f(m['central'], 1)
        elif cle == 'lfi':
            ann = (nb(m['an1']) + ' (an 1)') if m.get('an1') else '—'
        else:
            ann = nb(m['annonce']) if m.get('annonce') else '—'
        a('| [%s](#%s) | %s | %s | %s | %s |' % (m['id'], ancre(m['id']), esc(m['libelle']), ann, iv(pm[m['id']], 1), libelle_traitement(m)))
    a('')
    a('## Le détail, poste par poste')
    a('')
    for fam, titre_f in FAMILLES:
        lst = [m for m in ms if AFFECTATION[cle].get(m['id']) == fam]
        if not lst:
            continue
        a('### %s' % titre_f)
        a('')
        for m in lst:
            a('#### %s · %s {#%s}' % (m['id'], esc(m['libelle']), ancre(m['id'])))
            a('')
            if cle == 'langagement':
                a('- **La mesure.** %s. Source : `%s`, %s.' % (esc(m['libelle']), esc(m['lien']), lien_modele('systeme-ideal', 'page du modèle du système')))
            else:
                cit = esc(m.get('citation', ''))
                mots = '«' in cit
                a('- **La mesure, %s.** %s. Source : [%s](%s)%s.'
                  % ('dans les mots du programme' if mots else 'résumée par nous (pas de citation exacte relevée)', cap(cit or esc(m['libelle'])),
                     texte_lien(cle, m, mod), m['lien'], (', ' + esc(m.get('chapitre'))) if m.get('chapitre') else '') + ' ' + nature_source(cle, m, mod))
            a('- **%s** %s.' % ('Notre valeur centrale.' if cle == 'langagement' else 'Annoncé par le parti.', texte_annonce(cle, m, mod)))
            v = pm[m['id']]
            a('- **Notre estimation.** **%s** Md€ par an en %d : %s.' % (iv(v, 1), prog['regime'], sens_effet(v['p50'])))
            if cle == 'lfi' and m['id'] in (r.get('detail_nouvelles') or {}):
                dn = r['detail_nouvelles'][m['id']]
                a('  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : %s.'
                  % ' ; '.join('%s : %s' % (COMPOSANTES[k], iv({kk: 100 * vv for kk, vv in x.items()}, 0) + ' %' if k.startswith('part_') else iv(x, 1))
                               for k, x in dn.items() if k in COMPOSANTES))
            a('- **Comment nous l\'évaluons.** %s' % comment(cle, m, D))
            interp = m.get('interpretation') if cle != 'langagement' else None
            if interp:
                a('- **Lecture retenue, telle qu\'écrite dans le fichier des mesures.** %s' % esc(interp))
            nom_mod, slug, fich = MODULES[m['levier']]
            if convention(m) in ('module', 'systeme', 'produit'):
                a('- **Modèle utilisé.** %s : %s%s.' % (cap(nom_mod), fich, (' ; ' + lien_modele(slug)) if slug else ''))
            else:
                a('- **Modèle utilisé.** Aucun : %s (loi de la ligne, tirée par `moteur.evaluer_mesure`).' % libelle_traitement(m))
            a('- **La même famille ailleurs.** %s' % ailleurs(cle, m, D))
            a('- **Fiabilité.** %s' % fiabilite(cle, m, D))
            ch = choix_ia(cle, m)
            if ch:
                a('- **Choix posés par l\'IA.** %s.' % ' ; '.join(ch))
            a('')
    a('---')
    a('')
    a("Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/%s/mesures.py` et de `donnees/resultats.json` ; aucun chiffre n'y est tapé à la main. "
      "Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré." % cle)
    return '\n'.join(A) + '\n'


# ------------------------------------------------------------------ « les mêmes modèles pour tous »
def cellule(cle, fam, D):
    if cle == 'fil_de_l_eau':
        return 'aucune mesure (droit actuel)'
    ms = [m for m in D['progs'][cle][1] if AFFECTATION[cle].get(m['id']) == fam]
    if not ms:
        return '—'
    par = {}
    for m in ms:
        c = convention(m)
        if c == 'filtre':
            k = "annonce plafonnée, médiane jugée réalisable"
        elif c in ('module', 'produit'):
            k = MODULES[m['levier']][0]
            rp = resume_parametres(m, 1)
            k += (' (%s)' % rp) if rp else ''
        elif c == 'systeme':
            k = 'notre modèle (%s)' % esc(m['lien']).split(' ')[0].rstrip(',;')
        else:
            k = libelle_traitement(m)
        par.setdefault(k, []).append(m)
    out = []
    for k, lst in par.items():
        if k.startswith('annonce plafonnée'):
            rs = [m['valeur']['central'] / m['valeur']['haut'] for m in lst if m['valeur'].get('haut')]
            k += ' (%s à %s de l\'annonce)' % (pc(min(rs)), pc(max(rs))) if len(rs) > 1 else ' (%s de l\'annonce)' % pc(rs[0])
        out.append('%s : %s' % (', '.join(lien_poste(cle, m['id']) for m in lst), k))
    return ' · '.join(out)


def notes_famille(D):
    """Notes vérifiées dans le code, par famille. Chaque phrase « même module, mêmes paramètres » a été contrôlée dans le code (voir comparer())."""
    J = D['js']
    CC = conventions_communes(D)
    P = {c: {m['id']: m for m in D['progs'][c][1]} for c in COLONNES}
    md = D['resultats_md']
    top1 = tableau_md(md, '## 10.', 'Érosion du capital mobile du top 1 %')[1]
    s01, ps09 = P['lfi']['S01'], P['ps']['PS09']
    diff_smic = sorted(k for k in set(s01['parametres']) | set(ps09['parametres']) if s01['parametres'].get(k) != ps09['parametres'].get(k))
    d05, d01 = P['lfi']['D05'], P['rn']['D01']
    cout_poste = J['remuneration2024'] * 1e9 / J['agents']
    lr01 = re.search(r'environ ([\d  ]+) à ([\d  ]+) € chargés', P['lr']['LR01']['interpretation'])
    lr_bas, lr_haut = (float(re.sub(r'\s', '', lr01.group(1))), float(re.sub(r'\s', '', lr01.group(2)))) if lr01 else (None, None)
    N = {}
    N['ir'] = ("LFI R13 passe par OpenFisca-France sur une population de foyers types, avec l'élasticité du revenu imposable du banc (%s, `moteur.ETI_POINTS`). "
               "RN T08 passe par le même logiciel (impôt d'un salarié seul), mais **sans réaction de comportement** : ce n'est écrit nulle part comme un choix. "
               "RN D03 et PS10 ne passent pas par OpenFisca (montant du parti ; calcul de coin de table), ce que leurs fichiers disent (« à faire »). "
               "Notre système (M-REV) passe par notre propre barème (`modeles/systeme-ideal/bareme_v71.js`), pas par OpenFisca, avec des élasticités du décile supérieur de %s "
               "(`hauts_revenus.js`) : **les paramètres ne sont pas ceux du banc** (plus sévères pour nous au sommet), sans raison écrite de l'écart."
               % (' / '.join(nb(x[1]) for x in M.ETI_POINTS), ' / '.join(nb(x) for x in J['eti_d10'])))
    N['capital'] = ("LFI R01b (fin du prélèvement forfaitaire unique) est un ordre de grandeur sans modèle ; RN T06 est le montant du parti. Notre système (M-CAP, M-EPAR) passe par notre modèle. "
                    "Aucun modèle commun des revenus du capital n'existe dans le banc.")
    N['patrimoine'] = ("**Même module, mêmes paramètres** pour LFI R01a et R04, RN F02 et PS01 : le module des grandes fortunes (`grandes_fortunes_0511.js`), avec la même érosion de l'assiette "
                       "à 1 point d'impôt (%s %%) et le même facteur « comportement ». **Même module, mêmes paramètres** pour LFI R05 et notre M-TRANS : la fonction `trois()` de "
                       "`transmissions_0611.js`, avec la même planification (%s %%) et les mêmes départs (%s %%). "
                       "En revanche, **notre fonction du patrimoine (M-PAT) n'est pas ce module** : c'est la fonction de la v7.5, avec une érosion du capital mobile du 1 %% le plus riche de %s "
                       "(§ 10 des résultats), plus sévère au sommet que celle appliquée à l'ISF des autres ; les deux ne se comparent pas point pour point. "
                       "PS02 (CSG sur les gros héritages) n'est pas branché sur le module des transmissions : il en transpose une proportion (écrit). RN T07 (successions et donations) est le montant du parti, "
                       "non recalculé avec le module (écrit « non fait », sans raison)."
                       % (' / '.join(nb(100 * x) for x in J['erosion_gf']), ' / '.join(nb(100 * x) for x in J['trans_d']), ' / '.join(nb(100 * x) for x in J['trans_e']), top1))
    N['entreprises'] = ("Aucun modèle d'impôt des entreprises dans le banc, pour personne. Les recettes de LFI sont ramenées entre %s et 100 %% de leur montant (convention) ; "
                        "celles du RN et du PS par le filtre de faisabilité ; les baisses du RN et de LR sont comptées à leur montant. Notre crédit d'IS (M-CRED) passe par notre modèle "
                        "(`transmissions_0611.js`, fonction `credit`). La même taxe sur les géants du numérique vaut %s chez LFI (R08) et %s chez le PS (PS03) en part de l'annonce : "
                        "deux conventions différentes pour la même mesure." % (pc(CC['decote_bas']), pc(P['lfi']['R08']['valeur']['central'] / P['lfi']['R08']['valeur']['haut']),
                                                                              pc(P['ps']['PS03']['valeur']['central'] / P['ps']['PS03']['valeur']['haut'])))
    N['niches'] = "Aucun modèle des niches dans le banc : montants des partis, ramenés par convention (LFI) ou par le filtre (PS). Nos conversions en salaire (M-CONV) et les frais réels (M-FRP) passent par notre modèle."
    N['salaires'] = ("**Même module, mêmes paramètres** pour LFI S01 et PS09 (Smic à 1 700 € net) : le code du PS recopie les paramètres de S01 ; seul diffère : %s (la lecture de la hausse, "
                     "parce que la CSG progressive du PS fait une partie du chemin). RN D02 (exonération des seniors) est un ordre de grandeur sans source. LR LRT2 est le montant du candidat."
                     % ', '.join(LIB_PARAM.get(k, k) for k in diff_smic))
    N['retraites'] = ("**Même module, mêmes données** pour LFI D05 et RN D01 : le levier `retraites_age`, la même grille du modèle des retraites, le même âge effectif de départ du scénario "
                      "(%s ans) et le même recalage démographique. Seul diffère l'âge effectif visé, qui traduit chaque réforme (LFI : %s ; RN : %s) : c'est la mesure, pas la méthode. "
                      "LR LR12 (décote entre 63 et 65 ans) n'est **pas** branché sur ce modèle, qui ne traite que les départs avancés (écrit : T-LR-1). RN H04 et LR13 sont des jugements sur l'annonce. "
                      "Notre dispositif (M-V6) passe par notre modèle (`decisions_0511g.js`), qui reprend le comportement de départ de `age_libre.js` avec son propre calendrier : même comportement, "
                      "branchement différent. LFI P01 (pension minimale) passe par la distribution des pensions de la DREES du modèle des retraites."
                      % (nb(D['ctx']['retraites']['ageBase2032']), loi(d05['parametres']['age_effectif']), loi(d01['parametres']['age_effectif'])))
    N['prestations'] = ("Pas de modèle commun des prestations dans le banc. LFI : coûts unitaires sourcés (AAH, garantie d'emploi) ou montants ; LR : jugement sur l'annonce ; "
                        "notre système : notre modèle (garantie de transition, plancher, socle).")
    N['sante'] = ("LFI D07 (« 100 % Sécu ») prend pour borne basse le coût de la même mesure dans un ancien calcul du dépôt (`sources/calculs/bilan_global.py`) ; notre module M-SECU "
                  "part d'une autre source (HCAAM indexé, `base_0611.js`) : même mesure, chiffres de base voisins mais pas identiques. Les économies de santé du RN, de LR et du PS passent par le filtre.")
    N['tva'] = ("**Asymétrie sans raison valable.** Les baisses de TVA du RN (T01, T02) sont comptées au montant du parti, et le § 5 des résultats écrit qu'« aucun modèle du dépôt ne chiffre "
                "encore la TVA » ; or notre modèle a une fonction de TVA (`changementTva` dans `modeles/systeme-ideal/decisions_0711.js` : consommation × écart de taux, avec élasticité) "
                "qui chiffre nos propres taux (M-TVA, M-RESTO). Elle n'a pas été appliquée aux lignes du RN. LFI C01 (carburants) a son propre levier.")
    N['effectifs'] = ("LFI D01 prend le coût d'un point d'indice de notre modèle (%s Md€, `variante_dette_stable.js`) : **même paramètre**. LFI D21 prend la masse salariale publique de notre modèle "
                      "(%s Md€) : **même paramètre**. En revanche, **le non-remplacement n'est pas valorisé de la même façon** : notre M-M1 compte le coût moyen d'un agent "
                      "(rémunérations de 2024 / effectifs = %s € par an) et une part réalisée de %s %% ; LR LR01 compte le coût d'un recrutement (%s à %s € chargés) et une médiane jugée réalisable. "
                      "Le coût par poste est plus élevé chez nous, ce qui avantage nos économies ; aucune raison n'est écrite."
                      % (nb(J['cout_point']), nb(J['remuneration2025']), nb(round(cout_poste, -2)), ' / '.join(nb(100 * x) for x in J['realisation_m1']),
                         nb(lr_bas) if lr_bas else '?', nb(lr_haut) if lr_haut else '?'))
    for fam in ('etat', 'collectivites', 'fraude', 'immigration', 'ue'):
        N[fam] = ("Économies annoncées : RN, LR et PS passent par le filtre (annonce plafonnée, médiane jugée réalisable) ; les recettes de LFI par la décote de convention ; "
                  "nos propres économies passent par notre modèle, sans filtre. Les médianes rapportées aux annonces sont dans le tableau [« médiane retenue par rapport à l'annonce »](#ratios).")
    N['services'] = ("Dépenses nouvelles : montants des partis avec une fourchette (%s à %s fois pour LFI, %s à %s fois le plus souvent pour les autres), ou coûts unitaires sourcés ; notre système : notre modèle."
                     % (nb(CC['derive'][0]), nb(CC['derive'][1]), nb(CC['montant'][0]), nb(CC['montant'][1])))
    N['logement'] = "Pas de modèle commun. LFI : montants et fourchettes ; RN G05 et PS11 : filtre ou montant."
    N['participations'] = ("Seule LFI a des nationalisations : le levier les traite comme des opérations financières (dette, pas déficit), selon la règle de comptabilité nationale. "
                           "RN G02 (dividendes d'EDF) est un jugement sur l'annonce.")
    N['autres'] = "Écritures sans effet sur le déficit comptées à zéro, raison écrite ligne par ligne (certificats d'énergie, bons du Trésor) ; écarts non détaillés des annonces."
    N['retours'] = "Les retours dynamiques comptés par l'annexe du RN sont mis à zéro dans le solde statique : la relance est calculée à part, de la même façon pour tous."
    return N


def ratios(D):
    """Médiane retenue / annonce, pour les économies et recettes annoncées (filtre et décote)."""
    lignes = []
    for fam, titre in FAMILLES:
        cells = []
        for cle in ('lfi', 'rn', 'lr', 'ps'):
            xs = []
            for m in D['progs'][cle][1]:
                if AFFECTATION[cle].get(m['id']) != fam or convention(m) not in ('filtre', 'decote'):
                    continue
                v = m['valeur']
                xs.append('%s %s' % (lien_poste(cle, m['id']), pc(mediane_loi(v) / v['haut'])))
            cells.append(', '.join(xs) or '—')
        if any(c != '—' for c in cells):
            lignes.append('| %s | %s |' % (titre, ' | '.join(cells)))
    return lignes


def effet_conventions(D):
    """Effets chiffrables des conventions différentes (sommes de médianes de lignes, Md€) : calcul direct sur les lois, sans tirage."""
    out = {}
    # (a) dépenses : LFI 0,9-1,3 fois contre 0,95-1,15 fois pour les autres
    CC = conventions_communes(D)
    lfi = [m for m in D['progs']['lfi'][1] if convention(m) == 'derive']
    d = 0.0
    for m in lfi:
        v = m['valeur']
        c = v['central']
        d += mediane_loi(v) - mediane_loi({'forme': 'tri', 'bas': CC['montant'][0] * c, 'central': c, 'haut': CC['montant'][1] * c})
    out['derive'] = (d, len(lfi))
    # (b) économies : filtre (RN, LR, PS) contre décote de LFI (bas et mode lus dans les lignes de LFI)
    for cle in ('rn', 'lr', 'ps'):
        ms = [m for m in D['progs'][cle][1] if convention(m) == 'filtre' and m['valeur'].get('haut', 0) > 0]
        g = 0.0
        for m in ms:
            h = m['valeur']['haut']
            g += mediane_loi({'forme': 'tri', 'bas': CC['decote_bas'] * h, 'central': CC['decote_mode'] * h, 'haut': h}) - mediane_loi(m['valeur'])
        out['filtre_' + cle] = (g, len(ms))
    # (c) non-remplacement : coût par poste de LR01 appliqué à notre M-M1, en proportion
    J = D['js']
    lr = re.search(r'environ ([\d  ]+) à ([\d  ]+) € chargés', [m for m in D['progs']['lr'][1] if m['id'] == 'LR01'][0]['interpretation'])
    m1 = [m for m in D['progs']['langagement'][1] if m['id'] == 'M-M1'][0]
    if lr:
        moy = (float(re.sub(r'\s', '', lr.group(1))) + float(re.sub(r'\s', '', lr.group(2)))) / 2
        out['m1'] = (m1['central'] * (moy / (J['remuneration2024'] * 1e9 / J['agents']) - 1), m1['central'])
    return out


def effort(D, c, cle, col):
    """Effort stabilisant du modèle du taux qui suit la dette ; au-delà de sa grille, la valeur affichée dans ses résultats (« > … »)."""
    v = D['taux']['programmes'][c]['effort_supplementaire'][cle]
    if v is not None:
        return nb(v)
    t = open(os.path.join(RACINE, 'modeles', 'taux-endogene', 'resultats.md'), encoding='utf-8').read()
    nom = D['taux']['programmes'][c]['nom']
    return tableau_md(t, '**Effort supplémentaire', nom)[col].replace('>', 'plus de')


def page_memes(D):
    A = []
    a = A.append
    N = notes_famille(D)
    E = effet_conventions(D)
    L = D['R']['langagement']
    T = D['taux']
    CC = conventions_communes(D)
    a('---')
    a('titre: "Les mêmes modèles pour tous"')
    a('statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions')
    a('---')
    a('')
    a('# Les mêmes modèles pour tous')
    a('')
    a("Le banc d'essai chiffre six colonnes avec le même moteur : La France insoumise, le Rassemblement national, Les Républicains (plan Retailleau), le contre-budget 2027 du PS et de Place publique, "
      "notre système et le fil de l'eau (le droit actuel). La règle est simple : **quand deux mesures se ressemblent, elles passent par le même modèle, avec les mêmes paramètres**. "
      "Cette page dit, famille par famille, si c'est vrai, en le vérifiant dans le code, et elle liste franchement les cas où ce n'est pas vrai. "
      "L'auteur est partie prenante de la comparaison : les écarts qui nous avantagent sont dits comme les autres. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions.")
    a('')
    a('Pages de détail : %s.' % ', '.join('[%s](./%s)' % (NOMS[c], FICHIERS[c]) for c in PAGES))
    a('')
    a('## Le tableau : quel modèle pour quelle famille de mesures')
    a('')
    a("Dans chaque case : les postes du programme (lien vers leur détail) et le modèle ou le traitement utilisé, avec son paramètre clé. « Annonce plafonnée, médiane jugée réalisable » : "
      "pas de modèle, le plafond est l'annonce du parti et la médiane notre jugement.")
    a('')
    a('| Famille | %s |' % ' | '.join(NOMS[c] for c in COLONNES))
    a('|---|%s|' % '|'.join('---' for _ in COLONNES))
    for fam, titre in FAMILLES:
        if not any(AFFECTATION[c].get(i) == fam for c in COLONNES for i in AFFECTATION[c]):
            continue
        a('| [%s](#f-%s) | %s |' % (titre, fam, ' | '.join(cellule(c, fam, D) for c in COLONNES)))
    # règles communes
    macro = D['ctx']['macros']
    progs = D['progs']
    a('| Relance et multiplicateurs | %s |' % ' | '.join(
        ('mêmes lois pour tous : multiplicateur des dépenses %s ; rapport recettes / dépenses %s ; effet d\'offre %s %% du PIB ; retour en recettes %s %%'
         % (loi(R.M_DEP), loi(R.RATIO_REC), loi({k: (100 * v if isinstance(v, float) else v) for k, v in R.OFFRE.items()}), nb(100 * M.TAUX_RETOUR)))
        if c == 'lfi' else ('idem ; séparation recettes / dépenses par convention (le modèle ne la publie pas)' if c == 'langagement' else ('sans objet' if c == 'fil_de_l_eau' else 'idem'))
        for c in COLONNES))
    a('| Dette et taux | %s |' % ' | '.join(
        ('même chaîne pour tous : dette de départ %s Md€, croissance %s %%, taux de marché %s %% (fixe), renouvellement en %s ans'
         % (nb(D['ctx']['eco']['dette0']), f(100 * macro['reference']['g'], 1), f(100 * macro['reference']['r'], 2), nb(D['ctx']['eco']['dureeDette']))) if c == 'lfi' else 'idem'
        for c in COLONNES))
    a('| Calendrier | %s |' % ' | '.join('premier exercice %d, régime %d' % (progs[c][0]['debut'], progs[c][0]['regime']) for c in COLONNES))
    def lambdas(c):
        ls = sorted({m.get('lambda') for m in progs[c][1] if m.get('lambda') is not None} | {d.get('lambda') for m in progs[c][1] for d in (m.get('parametres') or {}).values() if isinstance(d, dict) and d.get('lambda')})
        return ('poids de %s à %s' % (nb(min(ls)), nb(max(ls)))) if ls else 'sans objet'
    a('| Incertitude | %s |' % ' | '.join(('%s tirages, facteurs communs « comportement » et « coût » ; ' % nb(D['R']['tirages']) + lambdas(c)) if c != 'fil_de_l_eau' else 'aucune' for c in COLONNES))
    a('| Contraintes juridiques | %s |' % ' | '.join(
        ('%d lignes avec un obstacle nommé, qui abaisse la médiane' % sum(1 for m in progs[c][1] if m.get('contrainte')))
        if any(m.get('contrainte') for m in progs[c][1]) else ('aucun filtre' if c != 'fil_de_l_eau' else 'sans objet') for c in COLONNES))
    a('')
    a('## Notes par famille : ce que le code confirme, et ce qui diffère')
    a('')
    a("Pour chaque famille, nous avons ouvert le code : même fonction appelée, mêmes constantes. Les comparaisons automatiques ligne à ligne sont dans chaque page de détail "
      "(« même module, mêmes paramètres » est écrit seulement quand le levier et ses paramètres sont identiques dans le code).")
    a('')
    for fam, titre in FAMILLES:
        if fam not in N:
            continue
        a('### %s {#f-%s}' % (titre, fam))
        a('')
        a(N[fam])
        a('')
    a('## Les asymétries de méthode {#asymetries}')
    a('')
    a("Ce qui n'est pas traité de la même façon d'un programme à l'autre, l'effet quand il se calcule à partir des résultats existants, et ce qu'il faudrait faire pour lever l'écart. "
      "Les effets marqués « somme de médianes » sont calculés directement sur les lois des lignes, sans nouveau tirage : ce sont des ordres de grandeur.")
    a('')
    asy = []
    g = {k: E['filtre_' + k] for k in ('rn', 'lr', 'ps')}
    asy.append(("Le filtre de faisabilité ne s'applique qu'aux économies du Rassemblement national, des Républicains et du PS.",
                "Pour leurs économies annoncées, le plafond est l'annonce et la médiane notre jugement de ce que le droit et la pratique permettent. Les recettes de La France insoumise "
                "(dont certaines supposent une sortie de règles européennes) sont ramenées par une décote de convention, et nos propres économies ne passent par aucun filtre.",
                "Si leurs économies étaient traitées comme les recettes de LFI (%s à 100 %% de l'annonce), la somme de leurs médianes gagnerait %s Md€ (RN, %d lignes), %s Md€ (LR, %d lignes) et %s Md€ (PS, %d lignes)."
                % (pc(CC['decote_bas']), f(g['rn'][0], 0), g['rn'][1], f(g['lr'][0], 0), g['lr'][1], f(g['ps'][0], 0), g['ps'][1]),
                "Appliquer la même grille à toutes les lignes, nous compris : mécanisme décrit ? obstacle juridique ? précédent ? ; et écrire la médiane de chaque ligne de la même façon."))
    asy.append(("Les dépenses nouvelles n'ont pas la même fourchette.",
                "Les montants de LFI sont tirés entre %s et %s fois (« les coûts publics dérivent plus souvent à la hausse ») ; ceux du RN, de LR et du PS, le plus souvent entre %s et %s fois ; aucune raison écrite à l'écart."
                % (nb(CC['derive'][0]), nb(CC['derive'][1]), nb(CC['montant'][0]), nb(CC['montant'][1])),
                "Avec la fourchette des autres, les %d lignes concernées de LFI coûteraient %s Md€ de moins (somme de médianes)." % (E['derive'][1], f(E['derive'][0], 1)),
                "Choisir une seule convention et l'appliquer à tous."))
    asy.append(("Nos leviers votés sont réglés pour stabiliser la dette ; ceux des autres programmes n'existent pas.",
                "Notre modèle règle %s Md€ de hausses votées pour que la dette cesse de monter après 2038 à taux fixe ; ce montant est fixé dans le tirage (ce que la loi voterait). "
                "Aucun autre programme n'a de levier ainsi calé." % f(L['ensemble2038']['composition']['F'], 1),
                "La dette n'est stable après 2038 que dans %s des tirages (%s en macro prudente)." % (pc(L['stats']['part_dette_stable_des_2038']), pc(L['stats']['part_dette_stable_prudente'])),
                "Publier aussi notre résultat sans ce réglage, ou donner aux autres la même règle de bouclage, pour comparer des choses comparables."))
    asy.append(("Notre système est lu module par module, mais pas en entier.",
                "Les %d modules sont propagés ;" % len(progs['langagement'][1]) + " le socle hérité des premières versions du modèle, les corrections du grand livre et l'impôt de suite sont fixés au central.",
                "Au central, %s Md€ sur %s sont hors des modules. Les scénarios d'ensemble du modèle donnent un solde de 2038 de %s à %s Md€, contre %s dans le tirage : notre intervalle est trop étroit."
                % (f(L['central']['solde_2038'] - sum(m['central'] for m in progs['langagement'][1]), 1), f(L['central']['solde_2038'], 1),
                   f(L['ensemble2038']['ensemble2038']['haut'], 0), f(L['ensemble2038']['ensemble2038']['bas'], 0), iv(L['solde_regime'], 0)),
                "Donner des bornes cohérentes au socle hérité, ou le réécrire en modules."))
    asy.append(("Le régime est atteint en 2032 pour les uns, en 2038 pour nous.",
                "Les autres programmes montent sur un mandat ; notre système suit la rampe de son modèle jusqu'en %d." % progs['langagement'][0]['regime'] + " Les dettes sont comparées aux mêmes années, mais en 2032 notre programme n'est pas à son régime.",
                "Dette en 2032 : %s." % ' ; '.join('%s %s %%' % (COURTS[c], iv({k: 100 * v for k, v in D['R'][c]['dette2032'].items()}, 0)) for c in COLONNES),
                "Publier aussi l'effet de chaque programme année par année, et un tableau à la même année de mandat."))
    if T:
        tp = T['programmes']
        asy.append(("Le taux d'intérêt est fixe dans le tableau principal.",
                    "Le banc compte tous les programmes à %s %%, sans réaction des marchés à la dette. Le modèle du taux qui suit la dette (%s) rejoue les mêmes tirages."
                    % (f(100 * macro['reference']['r'], 2), lien_modele('taux-endogene', 'page du modèle')),
                    "Dette 2038 à taux fixe, puis avec un taux qui suit la dette, et part des tirages en zone de crise avant 2058 : %s. Effort supplémentaire qui stabiliserait la dette de 2038 à 2058 (Md€ par an ; à taux fixe, puis avec un taux qui suit la dette) : %s."
                    % (' ; '.join('%s %s → %s %%, %s' % (COURTS[c], f(100 * tp[c]['variantes']['banc']['2038']['ratio'], 0), f(100 * tp[c]['variantes']['central']['2038']['ratio'], 0),
                                                          pc(tp[c]['variantes']['central']['part_crise_2058'])) for c in COLONNES if c in tp),
                       ' ; '.join('%s %s puis %s' % (COURTS[c], effort(D, c, 'banc', 1), effort(D, c, 'central', 3)) for c in COLONNES if c in tp)),
                    "Mettre les deux lectures côte à côte dans tous les tableaux, pour tous, nous compris."))
    asy.append(("Le non-remplacement des départs n'a pas le même coût par poste.",
                "Notre système valorise un poste supprimé au coût moyen d'un agent ; le plan des Républicains au coût d'un recrutement.",
                ("Au coût par poste retenu pour LR, notre M-M1 rapporterait environ %s Md€ de moins par an au central (sur %s ; proportion simple)." % (f(-E['m1'][0], 1), f(E['m1'][1], 1))) if 'm1' in E else "non calculé",
                "Retenir un seul coût par poste (le coût d'un recrutement est le plus défendable) pour tous."))
    asy.append(("Les baisses de TVA du RN ne passent pas par notre fonction de TVA.",
                "Notre modèle chiffre nos taux de TVA avec une fonction (consommation, écart de taux, élasticité) ; les lignes de TVA du RN sont comptées au montant du parti.",
                "Non calculé ici (il faudrait relancer le modèle JavaScript).",
                "Brancher T01, T02 et T05 sur `changementTva`."))
    asy.append(("L'impôt sur le revenu n'a pas les mêmes réactions partout.",
                "LFI R13 : élasticité du banc ; RN T08 : aucune réaction ; notre M-REV : élasticités de notre modèle, plus fortes au sommet.",
                "Non calculé ici.", "Une seule table d'élasticités, partagée par le banc et par notre modèle."))
    asy.append(("Les médianes « relatives » ne sont pas toujours celles qu'elles disent reprendre.",
                "Plusieurs lignes des Républicains et du PS disent reprendre « la même médiane relative » qu'une ligne du RN ; le tableau ci-dessous montre les écarts (par exemple LR03 contre RN A01, PS06 contre RN H01).",
                "Voir le tableau des parts retenues.", "Fixer la part retenue par catégorie d'obstacle, et l'appliquer par le code plutôt qu'à la main."))
    asy.append(("Édouard Philippe est hors du banc.",
                "Aucun document chiffré d'ensemble n'est publié ; ce que le chapitre 15 en dit (ordres de grandeur) ne passe ni par le tirage ni par le filtre.",
                "Non calculable.", "Entrer son programme dans le banc dès qu'un document chiffré paraît (`programmes/philippe/mesures.py`)."))
    asy.append(("La variante « moins sévère » n'est pas rejouée pour LR et le PS.",
                "Elle l'est pour LFI, le RN et notre système (§ 10 des résultats).", "Non calculé ; seul PS01 serait touché, et peu.", "Rejouer la variante pour toutes les colonnes."))
    for k, (titre, quoi, effet, lever) in enumerate(asy, 1):
        a('%d. **%s** %s *Effet :* %s *Pour lever l\'écart :* %s' % (k, titre, quoi, effet, lever))
    a('')
    a('## Médiane retenue par rapport à l\'annonce {#ratios}')
    a('')
    a("Pour chaque économie ou recette annoncée qui ne passe pas par un modèle : la médiane de notre loi, en part du montant annoncé (pour LFI, le montant de son document). "
      "Une même famille d'obstacle devrait donner des parts voisines ; les écarts sont des jugements, lisibles ligne par ligne dans les pages de détail.")
    a('')
    a('| Famille | %s |' % ' | '.join(NOMS[c] for c in ('lfi', 'rn', 'lr', 'ps')))
    a('|---|---|---|---|---|')
    for l in ratios(D):
        a(l)
    a('')
    a('---')
    a('')
    a("Page générée par `modeles/banc-programmes/detail.py` ; aucun chiffre n'y est tapé à la main (mesures, résultats, caches et constantes du code des modèles). "
      "Écrite par Claude (IA d'Anthropic) pour l'auteur ; conflit d'intérêts déclaré.")
    return '\n'.join(A) + '\n'


# ------------------------------------------------------------------ écriture
def generer(D=None):
    """{nom de fichier: contenu}."""
    D = D or charger()
    D['js_annees'] = lire_json(os.path.join(ICI, 'donnees', 'cache', 'incertitudes.json'))['annees']
    out = {FICHIERS[c]: page_programme(c, D) for c in PAGES}
    out[FICHIERS['memes']] = page_memes(D)
    return out


def main(argv):
    pages = generer()
    if '--verifier' in argv:
        perimes = [n for n, t in pages.items() if not os.path.exists(os.path.join(ICI, n)) or open(os.path.join(ICI, n), encoding='utf-8').read() != t]
        for n in perimes:
            print('Pas à jour : %s (relancer detail.py)' % n)
        return 1 if perimes else 0
    for n, t in pages.items():
        with open(os.path.join(ICI, n), 'w', encoding='utf-8') as fh:
            fh.write(t)
        print('écrit : %s (%d lignes)' % (n, t.count('\n')))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
