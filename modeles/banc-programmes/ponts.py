#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ponts du banc d'essai vers nos modèles. Chaque pont lance le modèle (jsc pour JavaScript, venv pour OpenFisca), lit sa sortie JSON et l'écrit dans donnees/cache/.
Si le moteur (jsc ou le venv) est absent, les fonctions retombent sur le cache déjà écrit (qui est versionné) et le disent : on ne régénère donc pas à vide.
Usage : python3 -I modeles/banc-programmes/ponts.py   -> régénère tous les caches disponibles.
"""
import json, os, subprocess, sys

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(os.path.dirname(ICI))
CACHE = os.path.join(ICI, 'donnees', 'cache')
JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc'
VENV_OPENFISCA = os.environ.get('BANC_OPENFISCA_PYTHON', '<dossier temporaire>')

# Couche du 13/11/2026 en fin de liste : fonction unique des revenus (fonction_unique_1311.js, decisions_1311.js). Ordre de chargement de correction_0811.js (couche du 08/11 nuit : un seul report d'encaissement, V32012 et V32018), qui suit decisions_0811.js (liste de test_base_0611.js, puis couches du 06/11, 07/11 et 08/11), depuis modeles/systeme-ideal/
LISTE_SYSTEME = ("modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js "
    "patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js "
    "../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js "
    "decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js "
    "../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js "
    "bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js base_0611.js cas_types_nets_0611.js "
    "variante_nationalite_0611.js transmissions_0611.js retraites_aisees_0611.js consolidation_0611.js decisions_0711.js decisions_0811.js correction_0811.js decisions_1111.js decisions_1111b.js patrimoine_balayage_1111c.js decisions_1111c.js decisions_1111d.js fonction_unique_1311.js decisions_1311.js").split()


def _lire(nom):
    with open(os.path.join(CACHE, nom), encoding='utf-8') as f:
        return json.load(f)


def _ecrire(nom, obj):
    os.makedirs(CACHE, exist_ok=True)
    with open(os.path.join(CACHE, nom), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1, sort_keys=True)


def _jsc(cwd, fichiers):
    r = subprocess.run([JSC] + fichiers, cwd=cwd, capture_output=True, text=True, timeout=600)
    if r.returncode != 0:
        raise RuntimeError('jsc a échoué : ' + r.stderr[-500:] + r.stdout[-500:])
    return json.loads(r.stdout.strip().splitlines()[-1])


def pont_systeme(regenerer=False):
    """Patrimoine, transmissions, trajectoires de notre système. Retourne (données, 'jsc' | 'cache')."""
    if regenerer and os.path.exists(JSC):
        d = _jsc(os.path.join(RACINE, 'modeles', 'systeme-ideal'), LISTE_SYSTEME + ['../banc-programmes/js/pont_systeme.js'])
        _ecrire('systeme.json', d)
        return d, 'jsc'
    return _lire('systeme.json'), 'cache'


def pont_incertitudes(regenerer=False):
    """Bornes favorable / défavorable de chaque module de notre système, une par une (js/pont_incertitudes.js) : écarts au central par année 2029-2058, Md€ de 2025."""
    if regenerer and os.path.exists(JSC):
        d = _jsc(os.path.join(RACINE, 'modeles', 'systeme-ideal'), LISTE_SYSTEME + ['../banc-programmes/js/pont_incertitudes.js'])
        _ecrire('incertitudes.json', d)
        return d, 'jsc'
    return _lire('incertitudes.json'), 'cache'


def pont_incertitudes_serie(regenerer=False):
    """Comme pont_incertitudes, avec en plus le central année par année des modules à profil « serie » (js/pont_incertitudes_serie.js) : filtre de faisabilité commun du banc v2."""
    if regenerer and os.path.exists(JSC):
        brut = _jsc(os.path.join(RACINE, 'modeles', 'systeme-ideal'), LISTE_SYSTEME + ['../banc-programmes/js/pont_incertitudes_serie.js'])
        # format du cache lu par relancer_v2 : séries centrales des modules à profil « serie » (c_serie) et séries / valeurs fixes (M-M2, TR03)
        d = {'annees': brut['annees'], 'c_serie': {m['id']: m['c_serie'] for m in brut['modules'] if m.get('c_serie')},
             'fixe': {f['id']: f['c_serie'] for f in brut['fixe'] if f.get('c_serie')}}
        d['fixe']['TR03'] = next(f['valeur'] for f in brut['fixe'] if f['id'] == 'TR03')
        _ecrire('incertitudes_serie.json', d)
        return d, 'jsc'
    return _lire('incertitudes_serie.json'), 'cache'


def pont_retraites(regenerer=False):
    if regenerer and os.path.exists(JSC):
        d = _jsc(os.path.join(RACINE, 'modeles', 'retraites'), ['modele.js', 'age_libre.js', '../banc-programmes/js/pont_retraites.js'])
        _ecrire('retraites.json', d)
        return d, 'jsc'
    return _lire('retraites.json'), 'cache'


def pont_openfisca(regenerer=False):
    if regenerer and os.path.exists(VENV_OPENFISCA):
        r = subprocess.run([VENV_OPENFISCA, '-I', os.path.join(ICI, 'ir_openfisca.py')], capture_output=True, text=True, timeout=3000)
        if r.returncode != 0:
            raise RuntimeError('OpenFisca a échoué : ' + r.stderr[-800:])
        d = json.loads(r.stdout.strip().splitlines()[-1])
        _ecrire('ir_openfisca.json', d)
        return d, 'openfisca'
    return _lire('ir_openfisca.json'), 'cache'


def pont_smic(regenerer=False):
    """Grille OpenFisca des effets publics par foyer type et salaire brut (smic_openfisca.py, venv) : IR, prime d'activité, cotisations, allègement général."""
    if regenerer and os.path.exists(VENV_OPENFISCA):
        r = subprocess.run([VENV_OPENFISCA, '-I', os.path.join(ICI, 'smic_openfisca.py')], capture_output=True, text=True, timeout=3000)
        if r.returncode != 0:
            raise RuntimeError('OpenFisca (Smic) a échoué : ' + r.stderr[-800:])
        d = json.loads(r.stdout.strip().splitlines()[-1])
        _ecrire('smic_openfisca.json', d)
        return d, 'openfisca'
    return _lire('smic_openfisca.json'), 'cache'


def pont_rn_openfisca(regenerer=False):
    """IR d'un salarié seul par salaire brut (rn_openfisca.py, venv) : exonération d'IR des moins de 30 ans du programme du Rassemblement national."""
    if regenerer and os.path.exists(VENV_OPENFISCA):
        r = subprocess.run([VENV_OPENFISCA, '-I', os.path.join(ICI, 'rn_openfisca.py')], capture_output=True, text=True, timeout=3000)
        if r.returncode != 0:
            raise RuntimeError('OpenFisca (RN) a échoué : ' + r.stderr[-800:])
        d = json.loads(r.stdout.strip().splitlines()[-1])
        _ecrire('rn_openfisca.json', d)
        return d, 'openfisca'
    return _lire('rn_openfisca.json'), 'cache'


def pont_pension_min(regenerer=False):
    """Distribution de la pension nette totale des retraités à carrière complète (DREES, EIR 2020, tableau 8, tranches de 100 €), lue dans modeles/retraites/donnees/ ; constantes du modèle des retraites (H3, H5)."""
    if regenerer:
        import csv
        chemin = os.path.join(RACINE, 'modeles', 'retraites', 'donnees', 'distribution_pensions_2020.csv')
        with open(chemin, encoding='utf-8') as f:
            lignes = [r for r in csv.reader(l for l in f if not l.startswith('#'))]
        parts = [float(r[7]) for r in lignes if r[0] == 'EIR2020_T8']
        k = (1763.0 / 1614.0) * (361e3 / 17.4 / 12.0 / 1607.0)       # homothétie 2020 -> 2025 (modeles/retraites/modele.js, H3)
        d = {'parts_nette_cc': parts, 'k': k, 'retraites_dd_millions': 17.4, 'part_residents': 16.061968 / 16.974753, 'tableau': 'EIR2020_T8 (ensemble_pct)'}
        _ecrire('pension_min.json', d)
        return d, 'csv'
    return _lire('pension_min.json'), 'cache'


def pont_demographie(regenerer=False):
    """Population par âge (modeles/demographie, Python, scénario central) : effectif des personnes de 63 ans en 2026, 2032 et 2038. Le modèle retraites suppose une cohorte de départs constante
    (0,77 M par an, calée en 2025) ; le rapport pop63(2032) / pop63(2026) la recale sur la démographie du dépôt."""
    if regenerer:
        sys.path.insert(0, os.path.join(RACINE, 'modeles', 'demographie', 'code'))
        import projection as P   # modèle du dépôt
        base = P.charger_base(os.path.join(RACINE, 'modeles', 'demographie', 'donnees'))
        res = P.par_annee(P.projeter(base, P.parametres(base)))
        pop63 = {str(an): sum(res[an]['pyramide'][s][63] for s in res[an]['pyramide']) for an in (2026, 2032, 2038)}
        d = {'pop63': pop63, 'facteur_cohorte_2032': pop63['2032'] / pop63['2026'], 'facteur_cohorte_2038': pop63['2038'] / pop63['2026']}
        _ecrire('demographie.json', d)
        return d, 'demographie'
    return _lire('demographie.json'), 'cache'


def _jsc_liste(cwd, fichiers):
    return _jsc(cwd, fichiers)


def pont_systeme_moins_severe(regenerer=False):
    """Blocs de pont_systeme (ISF, plancher, transmissions, plafond) recalculés avec les hypothèses « moins sévères » (js/prelude_moins_severe.js, variante du banc). Pour l'ISF, la recette de base est corrigée de la
    seule variation de la recette absolue des tranches du sommet (js/pont_isf_abs.js, voir ce fichier : la recette nette de la taxe de 1 % se comporte à l'envers). Cache : systeme_moins_severe.json."""
    if regenerer and os.path.exists(JSC):
        cwd = os.path.join(RACINE, 'modeles', 'systeme-ideal')
        d = _jsc(cwd, LISTE_SYSTEME + ['../banc-programmes/js/prelude_moins_severe.js', '../banc-programmes/js/pont_systeme.js'])
        base = _lire('systeme.json')
        a0 = _jsc(cwd, LISTE_SYSTEME + ['../banc-programmes/js/pont_isf_abs.js'])
        a1 = _jsc(cwd, LISTE_SYSTEME + ['../banc-programmes/js/prelude_moins_severe.js', '../banc-programmes/js/pont_isf_abs.js'])
        for nom in ('sobre', 'renforce'):
            for k in range(3):
                d['isf'][nom][k]['recette'] = base['isf'][nom][k]['recette'] + (a1[nom][k] - a0[nom][k])
        d['isf_abs'] = {'base': a0, 'ms': a1}
        _ecrire('systeme_moins_severe.json', d)
        return d, 'jsc'
    return _lire('systeme_moins_severe.json'), 'cache'


def pont_modules_moins_severes(regenerer=False):
    """Valeurs de M-PAT et M-TRANS (notre système) aux trois scénarios, avec (« ms ») et sans (« base ») les hypothèses moins sévères. Cache : modules_moins_severes.json."""
    if regenerer and os.path.exists(JSC):
        cwd = os.path.join(RACINE, 'modeles', 'systeme-ideal')
        base = _jsc(cwd, LISTE_SYSTEME + ['../banc-programmes/js/pont_modules_ms.js'])
        ms = _jsc(cwd, LISTE_SYSTEME + ['../banc-programmes/js/prelude_moins_severe.js', '../banc-programmes/js/pont_modules_ms.js'])
        d = {'base': base, 'ms': ms}
        _ecrire('modules_moins_severes.json', d)
        return d, 'jsc'
    return _lire('modules_moins_severes.json'), 'cache'


if __name__ == '__main__':
    for nom, f in (('systeme', pont_systeme), ('incertitudes', pont_incertitudes), ('incertitudes_serie', pont_incertitudes_serie), ('retraites', pont_retraites), ('demographie', pont_demographie), ('rn_openfisca', pont_rn_openfisca), ('systeme_moins_severe', pont_systeme_moins_severe), ('modules_moins_severes', pont_modules_moins_severes)):
        d, src = f(True)
        print(nom, src, len(json.dumps(d)))
