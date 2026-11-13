#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Écrit resultats-v2.md à partir de donnees/resultats-v2.json (version 2 du banc) et donnees/resultats.json (version 1, lecture seule).
Usage : python3 -I modeles/banc-programmes/rapport_v2.py   (aucun calcul de Monte-Carlo ici ; relancer_v2.py les fait)
Aucun chiffre n'est tapé à la main, sauf les phrases de lecture qui renvoient aux tableaux.
"""
import json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import moteur as M          # noqa: E402
import relancer as R        # noqa: E402
import faisabilite as F     # noqa: E402
import ponts                # noqa: E402

O = json.load(open(os.path.join(ICI, 'donnees', 'resultats.json'), encoding='utf-8'))
N = json.load(open(os.path.join(ICI, 'donnees', 'resultats-v2.json'), encoding='utf-8'))
ORDRE = ('lr', 'ps', 'gl', 'rn', 'lfi', 'lfi_cb', 'philippe', 'langagement', 'fil_de_l_eau')      # philippe placé avant notre système : les numéros de ligne cités par les fiches du site (§ 1 à § 4) ne bougent pas
ANCIENS = ('lr', 'ps', 'rn', 'lfi')          # programmes de la v1 comparables ligne à ligne (gl : chiffrage partiel ; lfi_cb : sensibilité ; philippe : ajouté en v2 seulement, lecture de notre simulateur)
NOM = {'lr': 'LR (Retailleau)', 'philippe': 'Horizons (Philippe), lecture de notre simulateur', 'ps': 'PS et Place publique', 'gl': 'Glucksmann, livret climat (chiffrage partiel)', 'rn': 'RN', 'lfi': 'LFI (programme complet)', 'lfi_cb': 'LFI, contre-budget 2027 (sensibilité)', 'langagement': 'Notre système', 'fil_de_l_eau': "Fil de l'eau"}
DEF0 = 169.1
PIB0 = 2935.0 * 1.0   # remplacé plus bas par le PIB de 2025 du contexte


def fr(x, nd=0):
    s = ('%.' + str(nd) + 'f') % x
    return s.replace('.', ',').replace('-', '−')


def iv(p, k=1.0, nd=0):
    if p is None:
        return '—'
    return '%s [%s ; %s]' % (fr(p['p50'] * k, nd), fr(p['p10'] * k, nd), fr(p['p90'] * k, nd))


def pc(p, nd=0):
    return iv(p, 100.0, nd)


def inv(p, nd=1):
    """Déficit restant : DEF0 - solde, centiles inversés, en % du PIB de 2025."""
    return '%s [%s ; %s]' % (fr(100 * (DEF0 - p['p50']) / PIB0, nd), fr(100 * (DEF0 - p['p90']) / PIB0, nd), fr(100 * (DEF0 - p['p10']) / PIB0, nd))


def ligne(titre, f, cols=ORDRE):
    return '| %s | %s |' % (titre, ' | '.join(f(c) for c in cols))


def ctxp():
    ctx = R.construire_ctx(False)
    return ctx


def annee_sous3(d):
    s = d['sous3']
    if s['annee_mediane']:
        return '%d (%s %% des tirages)' % (s['annee_mediane'], fr(100 * s['part']))
    return 'jamais avant 2058 en médiane (%s %% des tirages y arrivent)' % fr(100 * s['part'], 1)


def minimum_deficit(d):
    sd = d['serie_deficit_mediane']
    a = min(sd, key=lambda k: sd[k])
    return '%s %% (%s)' % (fr(100 * sd[a], 1), a)


def ecrire():
    global PIB0
    ctx = ctxp()
    PIB0 = ctx['eco']['pib0']
    P = N['programmes']
    global SYS
    SYS = ponts._lire('systeme.json')
    L = []
    A = L.append
    A('---\ntitre: "Banc des programmes, version 2 : une seule règle de faisabilité"\nstatut: généré par rapport_v2.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions\n---\n')
    A('# Banc des programmes, version 2 (11/11/2026)\n')
    A('Écrit par Claude (IA d\'Anthropic) pour l\'auteur, qui est partie prenante de la comparaison (candidat potentiel) : les écarts qui nous avantageaient sont corrigés comme les autres, et **rien n\'a été ajusté pour que notre système remonte**. '
      'La version 1 (`resultats.md`, `memes-modeles.md`) n\'est pas modifiée. Commande : `python3 -I modeles/banc-programmes/relancer_v2.py` puis `python3 -I modeles/banc-programmes/rapport_v2.py` ; tests : `tests/test_v2.py`. '
      'Mêmes caches de ponts, graine %d, %s tirages ; la relance macroéconomique (§ 2 de la v1) et la variante « modèles moins sévères » (§ 10 de la v1) ne sont pas rejouées.\n' % (N['graine'], fr(N['tirages'])))
    # ------------------------------------------------------------------ 0
    A('## 0. Ce qui a changé et pourquoi\n')
    A('**Le problème de la version 1.** Les économies du RN, de LR et du PS passaient par un filtre de faisabilité (médiane = notre jugement, plafond = l\'annonce) ; les recettes de LFI par une décote de convention (35 à 100 %) ; **les économies et recettes de notre système par aucun filtre**. '
      'Les dépenses nouvelles étaient tirées entre 0,9 et 1,3 fois pour LFI, entre 0,95 et 1,15 fois pour les autres, sans raison écrite. Un lecteur sceptique pouvait donc dire, à raison, que la comparaison penchait de notre côté.\n')
    A('**La règle unique** (`faisabilite.py`, écrite en tête du fichier) : chaque économie ou recette nouvelle, de **tous** les programmes, reçoit trois réponses : **M** (mécanisme décrit et assiette mesurée), **J** (obstacle juridique : 1 aucun, 0 levable, −1 bloquant), **E** (précédent d\'exécution qui a rapporté au moins la moitié de l\'attendu). '
      'Le score M + J + E (borné à 0-3) donne une part réalisable du montant, loi à deux pans uniformes (médiane au milieu, plafond = le montant) :\n')
    A('| Score | Bas | Médiane | Haut |\n|---|---|---|---|')
    for s in (3, 2, 1, 0):
        b, c, h = F.GRILLE[s]
        A('| %d | %s | %s | %s |' % (s, fr(b, 2), fr(c, 2), fr(h, 2)))
    A('\nLe montant est l\'annonce du programme (RN, LR, PS, LFI) ou la valeur de nos modèles (notre système, module par module). La part est tirée avec le facteur commun « coût » (poids 0,5) et un aléa propre à la ligne. '
      '**Cette grille est une convention de Claude (⚠️), pas une source** : elle se situe entre la décote de LFI et les jugements de la version 1 sur les économies du RN, de LR et du PS, **plus sévères que la grille en haut d\'échelle** (§ 9 ; sensibilité à la grille alignée sur la v1 au § 6 bis), et les %d réponses (M, J, E) sont' % sum(len(v) for v in F.CLASSEMENT.values()) + ' des jugements listés ligne par ligne en annexe : c\'est là que quelqu\'un en désaccord doit attaquer. '
      'Même règle pour les recettes issues d\'un de nos modèles (ISF, impôt plancher, successions, impôt sur le revenu : la part s\'applique au résultat du modèle, en plus de l\'érosion et de l\'exil qu\'il compte déjà).\n')
    A('**Dépenses nouvelles** : même plancher pour tous. Fourchette au moins 0,9 à 1,3 fois le montant du programme (les coûts publics dérivent plus souvent à la hausse qu\'à la baisse) ; une ligne dont la source donne une fourchette plus large garde la sienne. '
      'Pour notre système, même plancher sur chaque module de coût (écart favorable au plus 10 % du coût, défavorable au moins 30 %), sauf M-V6 (retraites), modèle de coût comme les leviers de retraite des autres programmes. Les leviers qui sont des modèles de coût (retraites, Smic, pension minimale, carburants, nationalisations) ne sont pas touchés.\n')
    A('**Notre système, ce qui a été fait.** (1) Sa trajectoire centrale est décomposée en lignes : les 30 modules, plus les leviers votés F (%s Md€, recalibrés le 11/11/2026), l\'impôt de suite TR03, le point d\'indice M-M2 (séries relues dans le modèle, `js/pont_incertitudes_serie.js`), plus un **socle hérité non décomposé** (%s Md€ en 2038, ce que les modules n\'expliquent pas). '
      'Chaque ligne positive reçoit un score et sa part réalisable ; le socle, qu\'on ne sait pas décomposer, reçoit la classe du milieu (score 2) par défaut. (2) Les modules de coût reçoivent le plancher commun. (3) M-M1 (non-remplacement) est valorisé au coût d\'un recrutement comme LR01 (écart n° 7 de la v1 : −3,5 Md€ sur 15,0). '
      '(4) Les leviers votés F ne sont plus « garantis » : ils passent par la règle comme les autres hausses, si bien que le calage qui stabilisait la dette n\'est plus tenu.\n' % (fr(SYS['systeme']['F'], 1), fr(next(m['central_2038'] for m in N['modules_systeme'] if m['id'] == 'SOCLE'), 1)))
    # ------------------------------------------------------------------ 1 tableau
    A('## 1. Tableau comparatif v2 (statique, médiane [intervalle à 80 %])\n')
    A('Taux d\'intérêt **fixe à 3,45 %** (tableau principal, comme en v1), puis, en dessous, la **même chaîne avec le taux qui suit la dette** (`modeles/taux-endogene/`, variante « central »), pour tous les programmes. Effet sur le solde : + améliore le déficit par rapport au droit actuel ; régime = 2032 pour les autres programmes, 2038 pour le nôtre (voir § 8 : cet écart n\'est pas levé).\n')
    A('| | ' + ' | '.join(NOM[c] for c in ORDRE) + ' |')
    A('|---|' + '---|' * len(ORDRE))
    A(ligne('**Effet sur le solde, en régime (Md€ ; 2038 pour notre système)**', lambda c: iv(P[c]['solde_regime'])))
    A(ligne('dont recettes nouvelles et économies (Md€, après la règle)', lambda c: iv(P[c]['recettes_regime']) if c not in ('langagement', 'fil_de_l_eau') else ('non détaillé' if c == 'langagement' else '0')))
    A(ligne('dont baisses d\'impôts et dépenses nouvelles (Md€)', lambda c: iv(P[c]['depenses_regime']) if c not in ('langagement', 'fil_de_l_eau') else ('non détaillé' if c == 'langagement' else '0')))
    A(ligne('**Déficit restant en régime, statique (% du PIB de 2025 ; ' + fr(100 * DEF0 / PIB0, 1) + ' % au droit actuel)**', lambda c: inv(P[c]['solde_regime']) if c != 'fil_de_l_eau' else fr(100 * DEF0 / PIB0, 1)))
    A(ligne('Prélèvements obligatoires **bruts** en régime (% du PIB ; 42,7 % en 2024)', lambda c: pc(P[c]['po_pct'], 1)))
    A(ligne('Prélèvements obligatoires **nets des transferts reversés aux ménages** (notre système seul, § 5)', lambda c: pc(P[c]['po_net_pct'], 1) if c == 'langagement' else '—'))
    A(ligne('Déficit public 2038 (% du PIB, intérêts compris)', lambda c: pc(P[c]['deficit2038_pct'], 1)))
    A(ligne('**Dette publique 2032 (% du PIB)**', lambda c: pc(P[c]['dette2032'])))
    A(ligne('Dette à la fin de la 5e année du mandat (2032 ; 2033 pour notre système)', lambda c: pc(P[c]['dette_rang5'])))
    A(ligne('**Dette publique 2038 (% du PIB)**', lambda c: pc(P[c]['dette2038'])))
    A(ligne('Dette publique 2058 (% du PIB)', lambda c: pc(P[c]['dette2058'])))
    A(ligne('Dette 2038, macro prudente (croissance 2,5 %)', lambda c: pc(P[c]['dette2038_prudente'])))
    A(ligne('**Trajectoire : année du passage sous 3 % de déficit (taux fixe)**', lambda c: annee_sous3(P[c])))
    A(ligne('Déficit médian le plus bas sur 2028-2045 (année)', lambda c: minimum_deficit(P[c])))
    A(ligne('**Taux endogène : dette 2038 (% du PIB)**', lambda c: pc(P[c]['dette2038_endo'])))
    A(ligne('Taux endogène : dette 2058 (% du PIB)', lambda c: pc(P[c]['dette2058_endo'])))
    A(ligne('Taux endogène : part des tirages en zone de crise avant 2058', lambda c: fr(100 * P[c]['part_crise_avant_2058']) + ' %'))
    A(ligne('Taux endogène : année du passage sous 3 % de déficit', lambda c: annee_sous3({'sous3': P[c]['sous3_endo']})))
    pl = P['langagement']
    rang = sorted(ORDRE, key=lambda c: P[c]['dette2038']['p50'])
    classement = 'Classement par dette 2038 (du plus bas au plus haut) : ' + ' < '.join('%s %s %%' % (NOM[c], fr(100 * P[c]['dette2038']['p50'])) for c in rang) + '. À 2058, notre système est à %s %% (v1 : %s %%).' % (fr(100 * pl['dette2058']['p50']), fr(100 * O['langagement']['dette2058']['p50']))
    A('\nLecture. (1) **Notre système baisse nettement** : %s Md€ de solde en 2038 contre %s en v1, dette 2038 de %s contre %s %%. C\'est attendu (la v1 ne lui appliquait aucun filtre) ; rien n\'a été retouché pour le faire remonter.' % (
        fr(pl['solde_regime']['p50']), fr(O['langagement']['solde_regime']['p50']), fr(100 * pl['dette2038']['p50']), fr(100 * O['langagement']['dette2038']['p50'])))
    A('(2) ' + classement)
    sous = [c for c in ORDRE if P[c]['sous3']['annee_mediane'] is not None]
    A('(3) ' + ('**Aucun programme ne passe sous 3 %% de déficit** avant 2058 en médiane, à taux fixe comme à taux endogène (seul notre système y arrive dans %s %% des tirages, à taux fixe : le déficit comprend les intérêts d\'une dette de 124 %% du PIB).' % fr(100 * P['langagement']['sous3']['part'], 1) if not sous else 'Passent sous 3 %% de déficit en médiane (taux fixe) : %s.' % ', '.join(NOM[c] for c in sous)))
    A('(4) La dette n\'est stable après 2038 que dans %s %% des tirages de notre système (52 %% en v1) : le calage des leviers votés (dette stable dès 2038) a été supprimé le 11/11/2026 (§ 11) ; la valeur est donc ici un résultat, plus un objectif.\n' % fr(100 * pl['part_dette_stable_des_2038'], 1))
    # ------------------------------------------------------------------ pour le site
    A('## 1 bis. Tableau court pour le site (horizons 2032 et 2038)\n')
    A('Médiane des 10 000 tirages, mêmes tirages et même règle de faisabilité pour tous. Effet sur le solde : Md€ de 2025, + améliore ; déficit : % du PIB, intérêts compris, taux fixe ; dette : % du PIB, taux fixe puis taux endogène (`modeles/taux-endogene/`). Prélèvements obligatoires : valeur en régime (non datée par horizon), bruts ; nets des transferts reversés aux ménages pour notre système seul (« — » : non calculé pour les autres programmes). 2058 reste dans les tableaux détaillés. Des ordres de grandeur sous hypothèses, jamais des prédictions.\n')
    A('| | ' + ' | '.join(NOM[c] for c in ORDRE) + ' |')
    A('|---|' + '---|' * len(ORDRE))
    for an in ('2032', '2038'):
        A(ligne('**%s** : effet sur le solde (Md€)' % an, lambda c, an=an: fr(P[c]['serie_eff_mediane'][an])))
        A(ligne('%s : déficit public (%% du PIB)' % an, lambda c, an=an: fr(100 * P[c]['serie_deficit_mediane'][an], 1)))
        A(ligne('%s : dette, taux fixe (%% du PIB)' % an, lambda c, an=an: pc(P[c]['dette' + an], 0)))
        A(ligne('%s : dette, taux endogène (%% du PIB)' % an, lambda c, an=an: pc(P[c]['dette%s_endo' % an], 0)))
    A(ligne('Prélèvements obligatoires bruts (% du PIB)', lambda c: pc(P[c]['po_pct'], 1)))
    A(ligne('Prélèvements obligatoires nets des transferts (% du PIB)', lambda c: pc(P[c]['po_net_pct'], 1) if c == 'langagement' else '—'))
    A('')
    # ------------------------------------------------------------------ 2 avant / après
    A('## 2. Avant (v1) → après (v2), programme par programme (médiane [intervalle à 80 %])\n')
    for c in ORDRE:
        if c == 'fil_de_l_eau' or c not in O:
            continue
        o, n = O[c], P[c]
        A('### %s\n' % NOM[c])
        A('| Indicateur | v1 | v2 |\n|---|---|---|')
        A('| Effet sur le solde en régime (Md€) | %s | %s |' % (iv(o['solde_regime']), iv(n['solde_regime'])))
        A('| Déficit restant en régime (%% du PIB de 2025) | %s | %s |' % (inv(o['solde_regime']), inv(n['solde_regime'])))
        A('| Déficit public 2038 (%% du PIB) | %s | %s |' % (pc(o['deficit2038_pct'], 1), pc(n['deficit2038_pct'], 1)))
        A('| Dette 2032 (%% du PIB) | %s | %s |' % (pc(o['dette2032']), pc(n['dette2032'])))
        A('| Dette 2038 (%% du PIB) | %s | %s |' % (pc(o['dette2038']), pc(n['dette2038'])))
        A('| Dette 2058 (%% du PIB) | %s | %s |' % (pc(o['dette2058']), pc(n['dette2058'])))
        A('| Prélèvements obligatoires bruts en régime (%% du PIB) | %s | %s |' % (pc(o['po_pct'], 1), pc(n['po_pct'], 1)))
        A('')
    A('Fil de l\'eau : inchangé (aucune mesure). Dette 2038 : %s %%.\n' % fr(100 * P['fil_de_l_eau']['dette2038']['p50']))
    A('Le Monte-Carlo n\'est pas à l\'identique de la v1 (la règle ajoute un tirage par ligne et la relance n\'est plus tirée) : un écart de 1 à 2 points sur une dette ou de 1 à 3 Md€ sur un solde est du bruit de tirage, pas un effet de la règle.\n')
    # ------------------------------------------------------------------ 3 ce qui a bougé
    A('## 3. Ce qui a le plus bougé, ligne par ligne (effet médian en régime ; Md€)\n')
    for c in ('rn', 'lr', 'ps', 'lfi'):
        ov, nv = O[c]['par_mesure'], N['programmes'][c]['par_mesure']
        rows = [(i, ov[i]['p50'], nv[i]['p50']) for i in nv if i in ov]
        rows.sort(key=lambda x: -abs(x[2] - x[1]))
        A('**%s** : %s.\n' % (NOM[c], ' ; '.join('%s %s → %s' % (i, fr(a, 1), fr(b, 1)) for i, a, b in rows[:6])))
    ov = O['langagement']['par_mesure']
    ms = {m['id']: m for m in N['modules_systeme']}
    nv = N['programmes']['langagement']['par_mesure']
    rows = []
    for i, m in ms.items():
        a = ov[i]['p50'] if i in ov else m['central_2038']
        rows.append((i, a, nv[i]['p50']))
    rows.sort(key=lambda x: -abs(x[2] - x[1]))
    A('**Notre système** (valeur en 2038) : %s.\n' % ' ; '.join('%s %s → %s' % (i, fr(a, 1), fr(b, 1)) for i, a, b in rows[:8]))
    A('La ligne qui pèse le plus est **M-PAT** (fonction du patrimoine, 62,5 Md€ au central jusqu\'au 11/11/2026, puis 20,9 Md€ au taux de 1,25 % ; classée 1 à 3 %, 3 à 1,25 % : voir § 13), classée 1 jusque-là parce qu\'un impôt annuel de cette taille était sans précédent et exposait à un risque de confiscation devant le Conseil constitutionnel ; '
      'c\'est le jugement le plus lourd de conséquences de cette version (sensibilité au § 6).\n')
    # ------------------------------------------------------------------ 4 trajectoire
    A('## 4. Trajectoire année par année (médiane ; effet sur le solde en Md€ de 2025, déficit public en % du PIB, taux fixe)\n')
    ans = ['2028', '2030', '2032', '2034', '2036', '2038', '2040', '2045']
    A('| Programme | ' + ' | '.join(ans) + ' |\n|---|' + '---|' * len(ans))
    for c in ORDRE:
        n = P[c]
        A('| %s : effet sur le solde | %s |' % (NOM[c], ' | '.join(fr(n['serie_eff_mediane'][a]) for a in ans)))
        A('| %s : déficit | %s |' % (NOM[c], ' | '.join(fr(100 * n['serie_deficit_mediane'][a], 1) for a in ans)))
    A('\nLes autres programmes montent sur un mandat (2028-2032) puis restent au régime ; le nôtre suit la rampe de son modèle jusqu\'en 2038. Cette trajectoire donne la comparaison « à la même année », que le tableau du § 1 ne donne qu\'à 2032, 2038 et 2058.\n')
    # ------------------------------------------------------------------ 5 PO bruts / nets
    A('## 5. Notre système : prélèvements obligatoires bruts et nets des transferts reversés aux ménages\n')
    po = pl['po_pct']
    pn = pl['po_net_pct']
    A('Le chiffre de **%s %% du PIB** (brut) est le niveau des prélèvements obligatoires de notre système en régime (2038) ; le droit actuel est à 42,7 %% (2024). Il est élevé parce que le système **regroupe** dans une seule fonction des prélèvements qui existent déjà (impôt sur le revenu, CSG, cotisations, prélèvements sur le capital, 886 Md€ en 2024 selon `modeles/systeme-ideal/fiche.md`) '
      'et y ajoute les nouvelles recettes (fonction du patrimoine, transmissions, fiscalité d\'orientation, crédit d\'IS), **puis rend une partie aux ménages** par le socle, l\'allocation par enfant et le plancher de protection, au lieu de laisser les prestations actuelles. Une partie de la hausse est aussi une substitution : la Sécurité sociale à 100 %% (M-SECU, −%s Md€) et la conversion en salaire de la mutuelle patronale ou des titres-restaurant (M-CONV) remplacent des primes et dépenses privées par des prélèvements publics.\n' % (
          fr(100 * po['p50'], 1), fr(-next(m['central_2038'] for m in N['modules_systeme'] if m['id'] == 'M-SECU'), 1)))
    A('| | Brut | Net des transferts reversés |\n|---|---|---|')
    A('| Prélèvements obligatoires en régime (%% du PIB) | %s | %s |' % (pc(po, 1), pc(pn, 1)))
    A('| En Md€ de 2024 | %s | %s |' % (fr(po['p50'] * M.PIB_2024), fr(pn['p50'] * M.PIB_2024)))
    A('\n**Définition et limite.** Les transferts reversés sont ceux du bilan global du modèle (`sources/calculs/bilan_global.py`, `transferts_nets` = socle + allocation par enfant − prestations remplacées + plancher de protection) : **99,4 Md€**, soit 3,4 points de PIB de 2024. '
      'C\'est la convention du modèle à la version 5.3 ; le système actuel (v7.5) a un plancher en deux parts et d\'autres décisions depuis. ⚠️ Ce chiffre est un ordre de grandeur à recalculer avec le modèle actuel ; le net n\'est donc **pas** un résultat de même qualité que le brut. '
      'Le net n\'est pas comparable aux autres colonnes (leurs transferts ne sont pas défalqués) : pour comparer, il faudrait compter les prestations des autres programmes de la même façon.\n')
    # ------------------------------------------------------------------ 6 sensibilités
    A('## 6. Sensibilités de notre système (3 000 tirages, médiane [intervalle à 80 %])\n')
    A('| Variante | Solde 2038 (Md€) | Dette 2038 (%) | Dette 2038, taux endogène (%) |\n|---|---|---|---|')
    noms = [('regle_complete', 'Règle complète (contrôle de la v2 avec 3 000 tirages)'), ('M-PAT_classe_2', 'M-PAT classé 2 au lieu de 1 (impôt annuel sur le patrimoine jugé constitutionnel)'),
            ('M-PAT_et_socle_non_filtres', 'M-PAT et socle sans filtre'), ('socle_non_filtre', 'Socle non filtré'), ('socle_classe_1', 'Socle classé 1 au lieu de 2'),
            ('sans_plancher_de_cout', 'Sans le plancher commun sur les coûts'), ('sans_filtre_du_tout', 'Aucun filtre (parts à 100 %, coûts élargis : retrouve à peu près la v1)'),
            ('sans_M-V6', 'Sans le dispositif retraites (M-V6 : pénibilité et sous-indexation de la loi de 2023 gardée), règle complète')]
    for k, lib in noms:
        s = N['sensibilites'][k]
        A('| %s | %s | %s | %s |' % (lib, iv(s['solde_regime']), pc(s['dette2038']), pc(s['dette2038_endo'])))
    A('')
    gv1 = os.path.join(ICI, 'donnees', 'resultats-v2-grille-v1.json')
    if os.path.exists(gv1):
        G = json.load(open(gv1, encoding='utf-8'))['programmes']
        G = {c: G.get(c) for c in ORDRE}
        G = {c: (v if v is not None else {k: None for k in ('solde_regime', 'dette2038', 'dette2038_endo')}) for c, v in G.items()}
        A('## 6 bis. Sensibilité à la grille : alignée sur les médianes de la v1 (3 : 60 %, 2 : 36 %, 1 : 25 %, 0 : 18 %), pour tous les programmes\n')
        A('| | ' + ' | '.join(NOM[c] for c in ORDRE) + ' |\n|---|' + '---|' * len(ORDRE))
        A(ligne('Effet sur le solde en régime (Md€)', lambda c: iv(G[c]['solde_regime'])))
        A(ligne('Dette 2038 (%) : grille de la v2', lambda c: pc(P[c]['dette2038'])))
        A(ligne('Dette 2038 (%) : grille alignée sur la v1', lambda c: pc(G[c]['dette2038'])))
        A(ligne('Taux endogène, dette 2038 (%) : grille alignée sur la v1', lambda c: pc(G[c]['dette2038_endo'])))
        A('\nLe classement des programmes par dette 2038 : ' + ' < '.join('%s %s' % (NOM[c], fr(100 * G[c]['dette2038']['p50'])) for c in sorted([c for c in ORDRE if G[c]['dette2038']], key=lambda c: G[c]['dette2038']['p50'])) + '.\n')
    # ------------------------------------------------------------------ 7 fragile
    A('## 7. Ce qui reste fragile\n')
    sv6 = N['sensibilites']['sans_M-V6']
    rg = N['sensibilites']['regle_complete']
    v6c = next(m['central_2038'] for m in N['modules_systeme'] if m['id'] == 'M-V6')
    A('1. **Les réponses (M, J, E)** : %d jugements de Claude' % sum(len(v) for v in F.CLASSEMENT.values()) + ', relus par personne d\'autre. Le plus lourd : M-PAT. Les autres programmes ont les mêmes risques de classement, mais pèsent moins (LFI et le RN pèsent surtout par leurs dépenses, que la règle ne filtre pas).')
    A('2. **La grille elle-même** (0,80 / 1,00 / 1,00 ; 0,40 / 0,70 / 1,00 ; 0,10 / 0,35 / 0,80 ; 0 / 0,10 / 0,50) est une convention, située entre la décote de LFI et nos propres jugements antérieurs (circulaire) ; elle est plus clémente que ces jugements pour les scores 3 et 2 (§ 9, § 6 bis).')
    A('3. **Le socle hérité** (%s Md€ en 2038) n\'est pas décomposé : on lui applique la classe du milieu, faute de mieux. Sans filtre sur le socle, notre solde monte de %s Md€ ; classé 1, il baisse de %s.' % (
        fr(next(m['central_2038'] for m in N['modules_systeme'] if m['id'] == 'SOCLE'), 1), fr(N['sensibilites']['socle_non_filtre']['solde_regime']['p50'] - rg['solde_regime']['p50']), fr(rg['solde_regime']['p50'] - N['sensibilites']['socle_classe_1']['solde_regime']['p50'])))
    A('4. **Intervalle de notre système** : plus large qu\'en v1 (%s au lieu de %s Md€ de largeur p10-p90), mais encore étroit : les bornes des scénarios d\'ensemble du modèle (v1, § 6 ter) sont bien plus larges, et le socle n\'a pas de bornes propres.' % (
        fr(pl['solde_regime']['p90'] - pl['solde_regime']['p10']), fr(O['langagement']['solde_regime']['p90'] - O['langagement']['solde_regime']['p10'])))
    A('5. **Le régime n\'est pas au même horizon** (2032 contre 2038) : c\'est une propriété du programme (la rampe de notre modèle), pas un réglage ; on ne l\'a pas modifiée. Les lignes « 5e année » et la trajectoire du § 4 permettent de comparer à date égale.')
    A('6. **PO nets de notre système** : transferts de la convention v5.3 (99,4 Md€), à recalculer (§ 5).')
    A('7. **Le taux endogène** a ses propres hypothèses (`modeles/taux-endogene/methode.md`) ; avec lui, aucun programme ne tient (zone de crise avant 2058 dans presque tous les tirages, y compris le nôtre : %s %%).' % fr(100 * pl['part_crise_avant_2058']))
    A('8. **Retraites et entreprise d\'État : faits le 11/11/2026, à relire (§ 10).** T87 est appliquée (loi de 2023 gardée, ni indexation sur l\'espérance de vie ni âge libre) ainsi que l\'entreprise d\'État à 1 Md€. Trois points restent fragiles : (a) le **plancher de 1 300 €** du modèle ne protégeait que les pensions réduites par un départ anticipé : sans âge libre, son coût modélisé est nul ; s\'il s\'agit d\'un minimum de pension relevé pour tous, c\'est un coût **non chiffré** ; '
      '(b) l\'âge de référence indexé était **le** gain de long terme : sans lui, le déficit structurel de 2058 remonte (§ 10) ; (c) **le calage des leviers** : tranché le même jour (§ 11) : la règle de dette stable est supprimée, les gains vont au déficit ; la règle « baisse des prélèvements une fois le déficit sous 3 % » n\'est pas écrite (le montant et le rythme de la baisse sont des choix de conception à trancher).')
    A('9. **Ce que la règle ne filtre pas** : les dépenses nouvelles issues d\'un modèle (retraites, Smic, pension minimale, carburants, nationalisations), et les baisses d\'impôt et dépenses dont la source donne déjà une fourchette plus large que 0,9-1,3.\n')
    # ------------------------------------------------------------------ 10 : 11/11
    AV = json.load(open(os.path.join(ICI, 'donnees', 'avant-1111-langagement.json'), encoding='utf-8'))['langagement']
    apN = P['langagement']; AVD = json.load(open(os.path.join(ICI, 'donnees', 'avant-1111d-langagement.json'), encoding='utf-8'))['langagement']
    ap = AVD   # §§ 10-12 : colonne « après » de ces paragraphes = banc d'avant le 11/11 (patrimoine 1,25 % et grand ménage : § 13)
    SYSN = SYS; SYS = dict(SYSN, sous3_central=SYSN['avant_1111d']['sous3'], sous3_prudente=SYSN['avant_1111d']['sous3_prudente'])
    sa, sb, sx = SYS['avant_1111'], dict(SYSN['systeme'], po_pct=SYSN['avant_1111d']['po_pct'], reference=SYSN['avant_1111d']['reference'], prudente=SYSN['avant_1111d']['prudente']), SYS['leviers_inchanges_1111']
    A('## 10. Ce qui a changé le 11/11/2026 pour notre colonne (retraites de la loi de 2023, entreprise d\'État à 1 Md€)\n')
    A('Deux décisions de l\'auteur du 11/11/2026, posées comme **couche datée** `DECISIONS1111` (`modeles/systeme-ideal/decisions_1111.js`, tests `test_decisions_1111.js`, rapport `resultats_decisions_1111.txt`) au-dessus de la couche précédente, qui reste reproductible : '
      '(1) **T87, retraites** : âge de référence 64 ans (loi de 2023), **sans** indexation sur l\'espérance de vie et **sans** âge libre (reporté en phase 2, non chiffré) ; restent la pénibilité, l\'indexation moindre au-dessus de 2 000 €, la contribution des hautes pensions ; '
      '(2) **entreprise d\'État** : 1 Md€ par an (au lieu de 3), pris sur le crédit d\'impôt recherche supprimé (ligne D32). Même règle de faisabilité pour tous, mêmes tirages (graine %d, %s), **rien ajusté pour faire monter notre résultat**. '
      'Le « avant » est la version du banc du 10/11/2026 (`donnees/avant-1111-langagement.json`).\n' % (N['graine'], fr(N['tirages'])))
    A('**Ce que fait la couche** (central, Md€ de 2025, + améliore le solde) : retraites : le net du dispositif passe de %s Md€ à %s Md€ en 2038 (soit %s Md€ d\'écart) ; entreprise d\'État : +2,0 Md€ par an ; **écart total en 2038 : +%s Md€**. '
      'Mais la règle de notre modèle (dette stable à partir de 2038, macro de référence) **recalibre les leviers votés** : F passe de %s à %s Md€ et le coefficient de la fonction des revenus de %s à %s (la fonction des revenus doit rapporter %s Md€ au lieu de +1,4) : le gain des deux décisions sert donc d\'abord à **baisser les prélèvements**, pas à réduire le déficit. '
      'C\'est la convention de toutes les couches précédentes ; **à trancher par l\'auteur** (voir plus bas, variante « leviers inchangés »).\n' % (
          fr(SYS['v6_avant_2038'], 1), fr(SYS['v6_apres_2038'], 1), fr(SYS['v6_apres_2038'] - SYS['v6_avant_2038'], 1), fr(SYS['delta_2038'], 1),
          fr(sa['F'], 1), fr(sb['F'], 1), fr(sa['a'], 4), fr(sb['a'], 4), fr(sb['revenus'], 1)))
    lignes = [('Solde en régime (2038), Md€ de 2025', 'solde_regime', 'fr'), ('Recettes nouvelles en régime, Md€', 'recettes_regime', 'fr'), ('Dépenses nouvelles en régime, Md€', 'depenses_regime', 'fr'),
              ('Prélèvements obligatoires bruts, % du PIB', 'po_pct', 'pc'), ('Prélèvements obligatoires nets des transferts, % du PIB', 'po_net_pct', 'pc'),
              ('Déficit public 2038 (intérêts compris), % du PIB', 'deficit2038_pct', 'pc'),
              ('Dette 2032, % du PIB (taux fixe)', 'dette2032', 'pc'), ('Dette 2038, % du PIB (taux fixe)', 'dette2038', 'pc'), ('Dette 2038, % du PIB (taux endogène)', 'dette2038_endo', 'pc'),
              ('Dette 2038, macro prudente (taux fixe)', 'dette2038_prudente', 'pc'), ('Dette 2058, % du PIB (taux fixe)', 'dette2058', 'pc'), ('Dette 2058, % du PIB (taux endogène)', 'dette2058_endo', 'pc')]
    A('| Notre système, médiane [intervalle à 80 %] | Avant (10/11) | Après (11/11) | Écart de la médiane |\n|---|---|---|---|')
    for lib, k, f in lignes:
        a, b = AV.get(k), ap.get(k)
        if a is None or b is None:
            continue
        k100 = 100.0 if f == 'pc' else 1.0
        fa = iv(a, k100, 1 if f == 'pc' else 0); fb = iv(b, k100, 1 if f == 'pc' else 0)
        A('| %s | %s | %s | %s |' % (lib, fa, fb, fr((b['p50'] - a['p50']) * k100, 1)))
    A('| Part des tirages avec dette stable dès 2038 | %s %% | %s %% | |' % (fr(100 * AV['part_dette_stable_des_2038'], 1), fr(100 * ap['part_dette_stable_des_2038'], 1)))
    A('| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | %s %% | %s %% | |' % (fr(100 * AV['part_crise_avant_2038'], 0), fr(100 * ap['part_crise_avant_2038'], 0)))
    A('| Année de passage sous 3 %% de déficit (p10 · p50 · p90, tirages concernés : %s %% avant, %s %% après) | %s · %s · %s | %s · %s · %s | |' % (
        fr(100 * AV['sous3']['part'], 1), fr(100 * ap['sous3']['part'], 1), *(fr(AV['sous3']['annee_p10_p90'][q]) for q in ('p10', 'p50', 'p90')), *(fr(ap['sous3']['annee_p10_p90'][q]) for q in ('p10', 'p50', 'p90'))))
    A('\n**Trajectoire année par année** (médiane ; effet sur le solde en Md€ de 2025 et déficit public en % du PIB, taux fixe) :\n')
    ans = [str(a) for a in range(2028, 2039)] + ['2040', '2045']
    A('| | ' + ' | '.join(ans) + ' |\n|---|' + '---|' * len(ans))
    A('| Effet sur le solde, avant | %s |' % ' | '.join(fr(AV['serie_eff_mediane'][a], 1) for a in ans))
    A('| Effet sur le solde, après | %s |' % ' | '.join(fr(ap['serie_eff_mediane'][a], 1) for a in ans))
    A('| Déficit, avant | %s |' % ' | '.join(fr(100 * AV['serie_deficit_mediane'][a], 1) for a in ans))
    A('| Déficit, après | %s |' % ' | '.join(fr(100 * ap['serie_deficit_mediane'][a], 1) for a in ans))
    A('\n**Lecture au central, sans tirage ni filtre** (trajectoire du modèle, taux fixe, macro de référence) :\n')
    A('| | Avant | Après (leviers recalibrés) | Variante : leviers inchangés (F = %s) |\n|---|---|---|---|' % fr(sa['F'], 1))
    for y in (2029, 2033, 2038, 2043, 2058):
        i = y - 2029
        A('| %d : dette ; déficit (%% du PIB) | %s ; %s | %s ; %s | %s ; %s |' % (y, *sum(([fr(100 * s['reference']['ratio'][i], 1), fr(100 * s['reference']['deficit'][i], 1)] for s in (sa, sb, sx)), [])))
    A('| Prélèvements obligatoires (modèle), %% du PIB | %s | %s | %s |' % (fr(100 * sa['po_pct'], 1), fr(100 * sb['po_pct'], 1), fr(100 * sx['po_pct'], 1)))
    A('\n**Ce qu\'il faut en tirer, sans complaisance.** (1) Les médianes de dette 2038 bougent peu (taux fixe : %s → %s %%) parce que la règle de calage rend aux prélèvements ce que les deux décisions rapportent ; ce qui change, c\'est la **composition** (moins de leviers, prélèvements plus bas, dépenses nouvelles plus basses de %s Md€) et le **solde en régime** (médiane %s → %s Md€, parce que les leviers retirés étaient des recettes). '
      '(2) Le **long terme se dégrade** : sans l\'âge de référence indexé, le déficit central de 2058 est de %s %% du PIB au lieu de %s %% ; la loi de 2023 gardée ne règle pas, seule, le vieillissement. (3) Dans la variante « leviers inchangés », le déficit central de 2038 serait de %s %% (contre %s %%) : c\'est l\'ordre de grandeur de ce que gagnerait un programme qui garderait ses prélèvements. '
      'Le banc n\'a pas rejoué cette variante par Monte-Carlo (valeurs centrales du modèle seulement) ; les médianes du tirage (déficit 2038 à 6,6 ou 6,9 %%) sont plus hautes que le central du modèle (3,7 %%) parce que la règle de faisabilité commune décote les recettes nouvelles.\n' % (
          pc(AV['dette2038'], 1).split(' ')[0], pc(ap['dette2038'], 1).split(' ')[0], fr(AV['depenses_regime']['p50'] - ap['depenses_regime']['p50']), fr(AV['solde_regime']['p50']), fr(ap['solde_regime']['p50']),
          fr(100 * sb['reference']['deficit'][29], 1), fr(100 * sa['reference']['deficit'][29], 1), fr(100 * sx['reference']['deficit'][9], 1), fr(100 * sa['reference']['deficit'][9], 1)))
    A('**Reste à trancher** : (a) leviers recalibrés ou inchangés ; (b) le plancher de 1 300 € (nul dans le modèle sans âge libre) : minimum pour tous les retraités, ou supprimé ? (c) le coût de la phase 2 (âge libre) n\'est pas chiffré, comme décidé ; (d) l\'entreprise d\'État à 1 Md€ : l\'enveloppe est une décision, pas une estimation, et la fusion des équipes (DINUM, beta.gouv) apporte surtout des personnes, peu de budget ; '
      '(e) aucune ligne de revenus de l\'entreprise d\'État (bénéfices attendus ensuite) n\'est comptée.\n')
    # ------------------------------------------------------------------ 11 : 11/11 b
    AVB = json.load(open(os.path.join(ICI, 'donnees', 'avant-1111b-langagement.json'), encoding='utf-8'))['langagement']
    sr = SYS['recalibre_1111']
    A('## 11. 11/11/2026, gains d\'abord au déficit : la règle « dette stable dès 2038 » est supprimée\n')
    A('**Décision de l\'auteur (11/11/2026)** : les économies et gains (retraites de la loi de 2023, entreprise d\'État à 1 Md€) servent **d\'abord à réduire le déficit** jusqu\'à le faire passer sous 3 %% du PIB ; **aucune baisse de prélèvement avant**. '
      'Couche datée `DECISIONS1111B` (`modeles/systeme-ideal/decisions_1111b.js`, tests `test_decisions_1111b.js`, rapport `resultats_decisions_1111b.txt`), posée au-dessus de `DECISIONS1111` sans l\'écraser : mêmes dispositifs, mais les leviers votés F sont **gardés à %s Md€** (valeur d\'avant le recalibrage ; au lieu de %s) et le coefficient de la fonction des revenus en découle (%s au lieu de %s), sans réglage à la main. '
      'La règle explicite « baisse des prélèvements seulement une fois le déficit sous 3 %% » **n\'est pas implémentée** : elle demande de choisir quelle baisse, de quel montant et à quel rythme, ce qui est une décision de conception ; la couche rapporte à la place l\'année de passage sous 3 %% (central du modèle : **%s**), à partir de laquelle une baisse deviendrait possible (à trancher). '
      'Même règle de faisabilité pour tous, mêmes tirages ; rien d\'autre n\'est ajusté. « Avant » = banc du 11/11/2026 avec leviers recalibrés (`donnees/avant-1111b-langagement.json`).\n' % (
          fr(sb['F'], 1), fr(sr['F'], 1), fr(sb['a'], 4), fr(sr['a'], 4), str(SYS['sous3_central'])))
    A('| Notre système, médiane [intervalle à 80 %] | Avant (leviers recalibrés) | Après (gains au déficit) | Écart de la médiane |\n|---|---|---|---|')
    for lib, k, f in lignes:
        a, b = AVB.get(k), ap.get(k)
        if a is None or b is None:
            continue
        k100 = 100.0 if f == 'pc' else 1.0
        A('| %s | %s | %s | %s |' % (lib, iv(a, k100, 1 if f == 'pc' else 0), iv(b, k100, 1 if f == 'pc' else 0), fr((b['p50'] - a['p50']) * k100, 1)))
    A('| Part des tirages avec dette stable dès 2038 | %s %% | %s %% | |' % (fr(100 * AVB['part_dette_stable_des_2038'], 1), fr(100 * ap['part_dette_stable_des_2038'], 1)))
    A('| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | %s %% | %s %% | |' % (fr(100 * AVB['part_crise_avant_2038'], 0), fr(100 * ap['part_crise_avant_2038'], 0)))
    s3a, s3b = AVB['sous3'], ap['sous3']
    A('| Part des tirages qui passent sous 3 %% de déficit avant 2058 (taux fixe) ; année p10 · p50 · p90 | %s %% ; %s | %s %% ; %s | |' % (
        fr(100 * s3a['part'], 1), ' · '.join(fr(s3a['annee_p10_p90'][q]) for q in ('p10', 'p50', 'p90')) if s3a['annee_p10_p90'] else '—',
        fr(100 * s3b['part'], 1), ' · '.join(fr(s3b['annee_p10_p90'][q]) for q in ('p10', 'p50', 'p90')) if s3b['annee_p10_p90'] else '—'))
    A('\n**Trajectoire année par année** (médiane ; taux fixe) :\n')
    A('| | ' + ' | '.join(ans) + ' |\n|---|' + '---|' * len(ans))
    for lib, key, fct in (('Effet sur le solde', 'serie_eff_mediane', 1.0), ('Déficit (% du PIB)', 'serie_deficit_mediane', 100.0)):
        A('| %s, avant | %s |' % (lib, ' | '.join(fr(fct * AVB[key][a], 1) for a in ans)))
        A('| %s, après | %s |' % (lib, ' | '.join(fr(fct * ap[key][a], 1) for a in ans)))
    A('\n**Lecture au central, sans tirage ni filtre** (modèle, taux fixe, macro de référence) :\n')
    A('| | Avant le 11/11 (CORRECTION0811) | 11/11, leviers recalibrés | **11/11, gains au déficit** |\n|---|---|---|---|')
    for y in (2029, 2033, 2038, 2043, 2058):
        i = y - 2029
        A('| %d : dette ; déficit (%% du PIB) | %s ; %s | %s ; %s | %s ; %s |' % (y, *sum(([fr(100 * s['reference']['ratio'][i], 1), fr(100 * s['reference']['deficit'][i], 1)] for s in (sa, sr, sb)), [])))
    A('| Prélèvements obligatoires (modèle), %% du PIB | %s | %s | %s |' % (fr(100 * sa['po_pct'], 1), fr(100 * sr['po_pct'], 1), fr(100 * sb['po_pct'], 1)))
    A('| Année de passage durable sous 3 %% de déficit | 2058 | aucune avant 2058 | %s |' % SYS['sous3_central'])
    A('| Macro prudente (croissance 2,5 %%) : dette 2038 ; déficit 2038 | %s ; %s | %s ; %s | %s ; %s (sous 3 %% : %s) |' % tuple(sum(([fr(100 * s['prudente']['ratio'][9], 1), fr(100 * s['prudente']['deficit'][9], 1)] for s in (sa, sr, sb)), []) + [str(SYS['sous3_prudente'] or 'jamais')]))
    A('\n**Sans complaisance.** (1) Dans le modèle central, le déficit passe sous 3 %% en %s, mais c\'est un **résultat de la règle de faisabilité du banc que les tirages démentent** : la médiane du déficit 2038 est de %s %% (intervalle à 80 %% : %s à %s %%) et seulement %s %% des tirages passent sous 3 %% avant 2058 ; la décote des recettes nouvelles pèse bien plus que les deux décisions. '
      '(2) La dette 2038 médiane baisse de %s à %s %% (taux fixe) ; à taux endogène elle reste très haute (%s %%). (3) Les prélèvements obligatoires bruts restent plus hauts d\'environ %s point que dans la version recalibrée (le prix de la décision : on ne les baisse pas). '
      '(4) Le dividende de la décision est surtout **à long terme** (dette 2058 du modèle central : %s %% contre %s %% recalibrée), car les leviers F ne sont plus rendus aux ménages ; reste que sans l\'âge de référence indexé, le vieillissement n\'est pas réglé (§ 10).\n' % (
          SYS['sous3_central'], fr(100 * ap['deficit2038_pct']['p50'], 1), fr(100 * ap['deficit2038_pct']['p10'], 1), fr(100 * ap['deficit2038_pct']['p90'], 1), fr(100 * s3b['part'], 1),
          fr(100 * AVB['dette2038']['p50'], 0), fr(100 * ap['dette2038']['p50'], 0), fr(100 * ap['dette2038_endo']['p50'], 0), fr(100 * (ap['po_pct']['p50'] - AVB['po_pct']['p50']), 1),
          fr(100 * sb['reference']['ratio'][29], 1), fr(100 * sr['reference']['ratio'][29], 1)))
    A('**Reste fragile** : la règle de restitution (« baisse après passage sous 3 % ») n\'est pas écrite ; le central du modèle (déficit < 3 % en 2038) et les tirages (déficit médian > 5 %) divergent à cause de la règle de faisabilité commune ; le plancher de 1 300 € (nul sans âge libre) et la phase 2 (âge libre) restent non chiffrés ; aucune ligne de revenus de l\'entreprise d\'État ; l\'intervalle de notre système est sous-estimé (socle hérité fixé au central).\n')
    # ------------------------------------------------------------------ 8 écarts
    # ------------------------------------------------------------------ 12 documents primaires du 11/11/2026
    A('## 12. 11/11/2026 : mise à jour sur les documents primaires (RN, Glucksmann, LFI)\n')
    A('Trois documents primaires réunis le 11/11/2026 (inventaire : `sources-programmes-2027.md`) ont été relus ligne par ligne. **La colonne de notre système n\'est pas touchée.** Tous les montants sont ceux annoncés par les partis (cote D), non vérifiés par Claude.\n')
    A('**RN (contre-budget 2027, dossier de 16 p., tableau p. 11).** Le banc agrège les lignes du tableau en 46 lignes ; vérification : économies et recettes 137,218 Md€ (la somme des lignes relues, avec la ligne répétée comptée une fois comme le fait le sous-total, redonne 137,217), baisses d\'impôts et dépenses nouvelles 69,208 Md€, mesures du gouvernement retenues 3,616 Md€, solde net −71,626 Md€. '
      'Cinq lignes du banc étaient inexactes ou incomplètes et ont été corrigées : **H06** (autres économies de protection sociale) affichait 8,9 Md€ pour 7,127 Md€ au tableau (écart de 1,77 Md€ sans source) ; **F04** (superdividendes, aides récupérées) 1,35 pour 0,95 (la ligne « récupération des aides » est répétée deux fois dans le tableau et n\'est comptée qu\'une fois au sous-total) ; **F07** 2,2 pour 2,15 ; **G03** (écritures sans effet) 12,2 pour 12,45 (le biogaz, 0,25, manquait ; la ligne vaut zéro dans le solde) ; **T04** (baisses d\'impôts diverses) 6,5 pour 6,558 (le malus automobile, 0,1, manquait). '
      'Une ligne du tableau est volontairement hors du banc : la régularisation des rapatriés fiscaux (0,9 Md€, ponctuelle). Le total des lignes du banc reproduit ainsi le tableau à 0,9 + 0,03 Md€ près. '
      'Les plafonds des économies H06, F04 et F07 baissent (plafond = montant annoncé) ; les médianes viennent de la règle commune et ne changent pas de logique. Chaque ligne cite désormais la page du dossier (p. 11 ; le tableau est répété p. 12-13).\n')
    AV = json.load(open(os.path.join(ICI, 'donnees', 'avant-1111c-rn.json'), encoding='utf-8'))
    pr = P['rn']
    A('| RN, règle v2 (médiane [intervalle à 80 %]) | Avant la relecture | Après |\n|---|---|---|')
    A('| Effet sur le solde en régime (Md€) | %s | %s |' % (iv(AV['rn']['solde_regime'], 1, 1), iv(pr['solde_regime'], 1, 1)))
    A('| dont recettes nouvelles et économies (Md€) | %s | %s |' % (iv(AV['rn']['recettes_regime'], 1, 1), iv(pr['recettes_regime'], 1, 1)))
    A('| Effet sur le solde 2032 (Md€) | %s | %s |' % (fr(AV['rn']['serie_eff_mediane']['2032'], 1), fr(pr['serie_eff_mediane']['2032'], 1)))
    A('| Dette 2032 (%% du PIB) | %s | %s |' % (pc(AV['rn']['dette2032'], 1), pc(pr['dette2032'], 1)))
    A('| Dette 2038 (%% du PIB) | %s | %s |' % (pc(AV['rn']['dette2038'], 1), pc(pr['dette2038'], 1)))
    A('')
    A('Ce qui reste incertain pour le RN : (1) le dossier ne donne que les montants de 2027 ; les montants « de régime » (2031) de certaines lignes (taxe sur les rachats d\'actions 0,34 Md€ contre 11,352 en 2027, TVA à la source 18 Md€, etc.) viennent de la note de l\'Institut de l\'Entreprise (cote C, think tank financé par des entreprises) et ne se vérifient pas dans le dossier ; (2) la presse parle de 140 Md€ d\'économies en 2032, le dossier de 137,2 Md€ d\'économies et recettes en 2027 : horizons différents ; '
      '(3) le contre-budget du RN n\'est pas son programme présidentiel (non paru) ; (4) le dossier compte 24,5 Md€ de mesures du gouvernement non retenues : le banc, qui compare au droit actuel et non au projet de loi de finances, ne les compte pas ; (5) les lignes des mesures du gouvernement retenues (pp. 8-10) sont brouillées à l\'extraction : seul leur total (3,616, p. 11) est repris.\n')
    pg = P['gl']
    A('**Glucksmann (livret « Révolution écologique : les premiers 100 jours », 24 p., 09/11/2026) : colonne distincte du PS, CHIFFRAGE PARTIEL.** Le livret ne couvre que la partie climat et énergie ; une seconde partie est annoncée et le programme complet n\'est pas chiffré. Il ne donne que deux montants : 200 Md€ d\'argent public sur le quinquennat (p. 8), lus comme 40 Md€ par an de 2028 à 2032 puis arrêtés, '
      'et une contribution exceptionnelle de 50 Md€ sur les plus hauts patrimoines, une seule année (p. 9), lue en 2028 avec le score 0 de la règle commune (ni seuil, ni taux, ni assiette ; risque constitutionnel ; aucun précédent récent) : médiane de %s Md€. Tout le reste est à zéro (liste des lignes non chiffrées dans `programmes/gl/mesures.py`). '
      'Le chèque énergie (5 Md€, calcul de Claude) et la sécurité civile (1 Md€) sont présentés par le livret comme des emplois des 200 Md€ : ils ne sont pas ajoutés. Résultat à taux fixe : effet sur le solde de %s Md€ en 2032 et de %s en 2038 (nul par construction : rien n\'est chiffré au-delà du quinquennat), dette de %s %% du PIB en 2032 et de %s %% en 2038. '
      'Ces chiffres ne sont pas ceux du programme complet. Le livret vise « la stabilisation de la dette à l\'horizon 2032 » ; le banc, avec ces seuls deux montants, ne la trouve pas (dette en hausse sur 2028-2032), ce qui n\'est pas une réfutation (objectif adossé à des mesures non chiffrées). '
      'Incertain : le texte ne dit pas si les 200 Md€ sont additionnels au droit actuel (lus comme tels : hypothèse haute du coût), ni le profil par année.\n' % (fr(P['gl']['par_mesure']['GL02']['p50'], 1), fr(pg['serie_eff_mediane']['2032']), fr(pg['serie_eff_mediane']['2038']), fr(100 * pg['dette2032']['p50']), fr(100 * pg['dette2038']['p50'])))
    pc_ = P['lfi_cb']
    A('**LFI, contre-budget 2027 (sensibilité ; colonne principale inchangée : « L\'Avenir en commun » complet).** Document « Comment nous allons remettre de l\'ordre dans les comptes publics » (24 p., octobre 2026) : recettes 106,4 Md€, dépenses 81,7 Md€ (37 lignes inventoriées, 28 chiffrées), réduction du déficit annoncée 24,7 Md€ (p. 6, 12-14) ; le document dit lui-même ne pas chiffrer l\'ensemble du programme (p. 7). '
      'Construction : les 13 lignes de recette de la colonne principale qui sont exactement celles du document (mêmes modèles et mêmes réponses M, J, E), et les 14 lignes de dépenses du document à leur montant de première année, lu comme permanent (fourchette commune 0,9 à 1,3). '
      'Résultat : effet sur le solde de %s Md€ en 2032 (colonne principale : %s), dette de %s %% du PIB en 2032 et de %s %% en 2038 (colonne principale : %s et %s). L\'écart entre les deux colonnes est celui d\'un budget d\'une année et d\'un programme complet ; la règle de faisabilité ramène les 106,4 Md€ de recettes annoncées à %s Md€ en médiane, si bien que le document ne tient pas non plus ses 24,7 Md€ de réduction du déficit dans le banc. '
      'Incertain : le contre-budget est lu comme permanent (euros constants), sans dérive des coûts de retraite ; le plan BTP-logement (36 Md€ par an hors de l\'État, pôle public bancaire) n\'est pas compté.\n' % (
          fr(pc_['serie_eff_mediane']['2032']), fr(P['lfi']['serie_eff_mediane']['2032']), fr(100 * pc_['dette2032']['p50']), fr(100 * pc_['dette2038']['p50']), fr(100 * P['lfi']['dette2032']['p50']), fr(100 * P['lfi']['dette2038']['p50']), fr(pc_['recettes_regime']['p50'])))
    # ------------------------------------------------------------------ 13 : 11/11 d, patrimoine 1,25 % et grand ménage
    # § 13 : colonne « après » = banc d'avant la fonction unique du 13/11 (§ 14), lue dans donnees/avant-1311-langagement.json et dans le bloc avant_1311 de systeme.json
    AV13 = json.load(open(os.path.join(ICI, 'donnees', 'avant-1311-langagement.json'), encoding='utf-8'))['langagement']
    apN_1311 = apN; apN = AV13
    SYS = dict(SYSN, systeme=dict(SYSN['systeme'], reference=SYSN['avant_1311']['reference'], prudente=SYSN['avant_1311']['prudente']), sous3_central=SYSN['avant_1311']['sous3']); ap = apN
    sn, sv, sg, pp = SYS['systeme'], SYS['avant_1111d'], SYS['avec_grand_menage_seul'], SYS['patrimoine_1125']
    lp = pp['ligne']
    A('## 13. 11/11/2026, impôt sur le patrimoine à 1,25 % et grand ménage branché\n')
    A('**Décision de l\'auteur (11/11/2026)** : taux marginal maximal de la fonction du patrimoine fixé à **1,25 %%**, avec plafonnement à 75 %% du revenu (`sources/impot-patrimoine-balayage.md`, `sources/impot-patrimoine-constitutionnel.md`) ; le grand ménage (`modeles/grand-menage/`) est branché tel quel. '
      'Couche datée `DECISIONS1111D` (`modeles/systeme-ideal/decisions_1111d.js`, tests `test_decisions_1111d.js`) au-dessus de `DECISIONS1111C` (grand ménage, paramètre `tauxPatrimoine` activé par défaut à 0,0125) et de `DECISIONS1111B`, sans les écraser. '
      'Leviers votés F **inchangés** (%s Md€), coefficient de la fonction des revenus **non recalibré** (%s) : les gains vont d\'abord au déficit. Même règle de faisabilité pour tous, mêmes tirages (graine %d, %s) ; **rien d\'autre n\'est ajusté pour améliorer notre résultat**. « Avant » = banc du 11/11/2026 de la section 11 (`donnees/avant-1111d-langagement.json`).\n' % (
          fr(sn['F'], 1), fr(sn['a'], 4), N['graine'], fr(N['tirages'])))
    A('**Ce que fait la couche** (modèle, central, Md€ de 2025/an en croisière dès 2029, sans montée en charge : ⚠️ simplification) : recette nette de la fonction du patrimoine au taux de 1,25 %% (résidence principale à 0,25 %% jusqu\'à 1 M€ puis fonction, K = 700 000 €, plafonnement à 75 %% du revenu = −15 %% de la fonction, hypothèse HB1) : **%s Md€** [favorable %s ; défavorable %s] ; dû brut avant comportements et plafonnement : %s Md€ ; '
      'la v7.5 à 3 %% rapportait %s Md€ : **écart de %s Md€ par an**. Les prélèvements obligatoires du modèle baissent de %s à %s %% du PIB. Le grand ménage ajoute (central) %s Md€ en 2032 et +%s Md€ en 2038 (net de la transition).\n' % (
          fr(lp['central'], 1), fr(lp['favorable'], 1), fr(lp['defavorable'], 1), fr(lp['brute'], 1), fr(lp['reference'], 1), fr(pp['ecart'], 1), fr(100 * pp['po_pct_avant'], 1), fr(100 * pp['po_pct_apres'], 1), '−1,0', '1,9'))
    A('**Score M/J/E de M-PAT révisé : (1, 1, 1) = 3, au lieu de (1, 0, 0) = 1.** M 1 : assiette et mécanisme précis, mais impôt annuel nouveau ; J 1 : 1,25 %% est **sous** le taux de 1,5 %% que le Conseil constitutionnel a validé en 2012 (décision 2012-662 DC) avec le plafonnement à 75 %% du revenu, ce qui était le motif du J 0 à 3 %% sans plafonnement ; **⚠️ le régime exact (RP à 0,25 %%, K = 700 k€) n\'a jamais été examiné** ; E 1 : précédent suisse (impôt cantonal sur la fortune, ≈ 1,2 %% du PIB de recettes). '
      '**Fragile** : avec l\'ISF français seul comme précédent (≈ 5 Md€ par an), E vaudrait 0 (recette attendue de %s Md€ au-delà de 10 Md€) et M-PAT passerait à 2 ; la sensibilité « M-PAT classé 2 » du § 6 est conservée.\n' % fr(lp['central'], 1))
    A('| Notre système, médiane [intervalle à 80 %] | Avant (gains au déficit) | Après (patrimoine 1,25 %, grand ménage) | Écart de la médiane |\n|---|---|---|---|')
    for lib, k, f in lignes:
        a, b = AVD.get(k), apN.get(k)
        if a is None or b is None:
            continue
        k100 = 100.0 if f == 'pc' else 1.0
        A('| %s | %s | %s | %s |' % (lib, iv(a, k100, 1 if f == 'pc' else 0), iv(b, k100, 1 if f == 'pc' else 0), fr((b['p50'] - a['p50']) * k100, 1)))
    A('| Part des tirages avec dette stable dès 2038 | %s %% | %s %% | |' % (fr(100 * AVD['part_dette_stable_des_2038'], 1), fr(100 * apN['part_dette_stable_des_2038'], 1)))
    A('| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | %s %% | %s %% | |' % (fr(100 * AVD['part_crise_avant_2038'], 0), fr(100 * apN['part_crise_avant_2038'], 0)))
    A('| Part des tirages sous 3 %% de déficit avant 2058 (taux fixe) | %s %% | %s %% | |' % (fr(100 * AVD['sous3']['part'], 1), fr(100 * apN['sous3']['part'], 1)))
    A('| Effet médian de la ligne M-PAT en régime (Md€) | %s | %s | |' % (iv(AVD['par_mesure']['M-PAT'], 1, 1), iv(apN['par_mesure']['M-PAT'], 1, 1)))
    A('| Effet médian de la ligne M-GM (grand ménage, 2038, Md€) | — | %s | |' % iv(apN['par_mesure']['M-GM'], 1, 1))
    A('\n**Trajectoire année par année** (médiane ; taux fixe) :\n')
    A('| | ' + ' | '.join(ans) + ' |\n|---|' + '---|' * len(ans))
    for lib, key, fct in (('Effet sur le solde', 'serie_eff_mediane', 1.0), ('Déficit (% du PIB)', 'serie_deficit_mediane', 100.0)):
        A('| %s, avant | %s |' % (lib, ' | '.join(fr(fct * AVD[key][a], 1) for a in ans)))
        A('| %s, après | %s |' % (lib, ' | '.join(fr(fct * apN[key][a], 1) for a in ans)))
    A('\n**Lecture au central, sans tirage ni filtre** (modèle, taux fixe, macro de référence ; leviers F inchangés) :\n')
    A('| | Avant (11/11, gains au déficit) | + grand ménage seul | **+ patrimoine à 1,25 % (nouvelle colonne)** |\n|---|---|---|---|')
    for y in (2029, 2032, 2033, 2038, 2043, 2058):
        i = y - 2029
        A('| %d : dette ; déficit (%% du PIB) | %s ; %s | %s ; %s | %s ; %s |' % (y, *sum(([fr(100 * s['reference']['ratio'][i], 1), fr(100 * s['reference']['deficit'][i], 2)] for s in (sv, sg, sn)), [])))
    A('| Prélèvements obligatoires (modèle), %% du PIB | %s | %s | %s |' % (fr(100 * sv['po_pct'], 1), fr(100 * sg['po_pct'], 1), fr(100 * sn['po_pct'], 1)))
    A('| Année de passage durable sous 3 %% de déficit | %s | — | %s |' % (str(sv['sous3']), str(SYS['sous3_central'] or 'aucune avant 2058')))
    A('| Macro prudente (croissance 2,5 %%) : dette 2038 ; déficit 2038 | %s ; %s | | %s ; %s |' % (fr(100 * sv['prudente']['ratio'][9], 1), fr(100 * sv['prudente']['deficit'][9], 1), fr(100 * sn['prudente']['ratio'][9], 1), fr(100 * sn['prudente']['deficit'][9], 1)))
    A('\n**Classement par dette 2038 (médiane, taux fixe)** : ' + ' ; '.join('%s %s %%' % (NOM[k], fr(100 * P[k]['dette2038']['p50'], 1)) for k in sorted(ORDRE, key=lambda k: P[k]['dette2038']['p50'])) + '.\n')
    A('**Sans complaisance.** (1) Dans le modèle central, retirer ≈ %s Md€ de recette par an coûte environ %s points de PIB de déficit ; le passage sous 3 %% (2038 avant) **disparaît** du modèle central. '
      '(2) La médiane du banc bouge **beaucoup moins** que le central (dette 2038 : %s → %s %%) : l\'ancienne ligne M-PAT à 62,5 Md€ était classée 1 et donc décotée par la règle commune (médiane de %s Md€) ; la nouvelle, plus petite, est classée 3 et presque intacte (médiane de %s Md€). '
      'La médiane du banc est ainsi surtout un effet du classement : **c\'est le jugement M/J/E, relu par personne d\'autre, qui porte le résultat**. (3) Notre système et LR sont à moins de 1 point de dette 2038 avec des intervalles qui se recouvrent : le rang n\'est pas significatif. '
      '(4) Le grand ménage est classé (0, 1, 0) comme les autres économies de fonctionnement ; il pèse peu (central 1,9 Md€ en 2038, jusqu\'à 9,4 Md€ au scénario haut). (5) Hypothèses fragiles : recette de croisière dès 2029 sans montée en charge ni délai d\'établissement de l\'assiette ; plafonnement à 75 %% simulé par −15 %% (HB1, ⚠️ V-PAT5) ; départs non intégrés au tirage (ordres de grandeur dans le balayage) ; '
      'les variantes « modèles moins sévères » (§ 10 de `resultats.md`) reposent encore sur le patrimoine à 3 %% et ne sont pas rejouées ici.\n' % (
          fr(-pp['ecart'], 1), fr(100 * (sn['reference']['deficit'][9] - sg['reference']['deficit'][9]), 1),
          fr(100 * AVD['dette2038']['p50'], 1), fr(100 * apN['dette2038']['p50'], 1), fr(AVD['par_mesure']['M-PAT']['p50'], 1), fr(apN['par_mesure']['M-PAT']['p50'], 1)))
    SYS = SYSN; apN = apN_1311; ap = apN
    section_1311(A, P, SYS, AV13, ans)
    philippe_section(A, P)
    A('## 8. Les douze écarts de `memes-modeles.md` : statut\n')
    A('| N° | Écart | Statut v2 |\n|---|---|---|')
    for row in ECARTS:
        A('| %s | %s | %s |' % row)
    A('')
    # ------------------------------------------------------------------ 9 contrôle de grille
    A('## 9. Contrôle de la grille : les jugements de la v1, regroupés par score\n')
    A('Médiane de la part retenue en v1 (centrale de l\'ancienne loi / montant annoncé), par score de la v2, pour les lignes à montant annoncé. Si la grille est cohérente avec les jugements de la v1, ces médianes sont voisines de la colonne « médiane de la grille ». La concordance est partielle par construction : les réponses (M, J, E) ont été écrites par la même main que les anciens jugements.\n')
    par_score = {}
    for c in ('rn', 'lr', 'ps', 'lfi'):
        for e in N['journal'][c]:
            if e[1] != 'cout' and e[2]:
                par_score.setdefault((c == 'lfi', e[1]), []).append(e[3][2] / e[2])
    A('| Score | Médiane de la grille | Médiane des parts v1, RN + LR + PS (nombre de lignes) | Médiane des parts v1, LFI (nombre) |\n|---|---|---|---|')
    for s in (3, 2, 1, 0):
        a, b = par_score.get((False, s), []), par_score.get((True, s), [])
        A('| %d | %s | %s | %s |' % (s, fr(100 * F.GRILLE[s][1]) + ' %', ('%s %% (%d)' % (fr(100 * M.centile(a, 0.5)), len(a))) if a else '—', ('%s %% (%d)' % (fr(100 * M.centile(b, 0.5)), len(b))) if b else '—'))
    A('')
    # ------------------------------------------------------------------ annexe
    A('## Annexe. Classement ligne par ligne (M, J, E, score, part médiane v1 → v2)\n')
    A('Les lignes issues d\'un de nos modèles (ISF, plancher, successions, impôt sur le revenu, IFF, Zucman) n\'ont pas de « part v1 » : leur part v2 s\'applique au résultat du modèle.\n')
    A('| Programme | Ligne | Libellé | M | J | E | Score | Montant nominal (Md€) | Part médiane v1 | Part médiane v2 | Motif |\n|---|---|---|---|---|---|---|---|---|---|---|')
    for c in ('lfi', 'rn', 'lr', 'philippe', 'ps', 'gl'):
        _, mes, _ = R.charger_programme(c)
        lib = {m['id']: m['libelle'] for m in mes}
        jr = {e[0]: e for e in N['journal'][c] if e[1] != 'cout'}
        for i, (mm, jj, ee, mot) in F.CLASSEMENT[c].items():
            e = jr.get(i)
            if not e:
                continue
            nom = e[2]
            v1 = '%s %%' % fr(100 * e[3][2] / e[2]) if e[3] and e[2] and c != 'philippe' else '—'      # Philippe : pas de version 1
            v2 = '%s %%' % fr(100 * F.GRILLE[e[1]][1])
            A('| %s | %s | %s | %d | %d | %d | %d | %s | %s | %s | %s |' % (NOM[c], i, lib[i][:70].replace('|', '/'), mm, jj, ee, e[1], fr(nom, 1) if nom else 'sortie du modèle', v1, v2, mot))
    A('| LFI, contre-budget 2027 | R01a à R12 | mêmes 13 lignes de recette que LFI (hors R13) | | | | | | | | mêmes réponses (M, J, E) que la colonne principale de LFI (`F.CLASSEMENT[\'lfi_cb\']`) |')
    for i, (mm, jj, ee, mot) in F.CLASSEMENT['langagement'].items():
        m = next((x for x in N['modules_systeme'] if x['id'] == i), None)
        if m is None:
            continue
        s = m['score']
        if s is None:
            continue
        A('| Notre système | %s | %s | %s | %s | %s | %d | %s | — | %s | %s |' % (i, m['libelle'][:70].replace('|', '/'), *(['—'] * 3 if mm is None else [mm, jj, ee]), s, fr(m['central_2038'], 1), fr(100 * F.GRILLE[s][1]) + ' %', mot))
    A('\n---\n\nPage générée par `modeles/banc-programmes/rapport_v2.py` ; aucun chiffre n\'y est tapé à la main. Écrite par Claude (IA d\'Anthropic) pour l\'auteur ; conflit d\'intérêts déclaré.')
    return '\n'.join(L)


def section_1311(A, P, SYS, AV, ans):
    """§ 14 : fonction unique des revenus (couche DECISIONS1311, 13/11/2026) ; « avant » = banc du 11/11 après patrimoine 1,25 % et grand ménage (donnees/avant-1311-langagement.json)."""
    ap, sn, sv, fu = P['langagement'], SYS['systeme'], SYS['avant_1311'], SYS['fonction_unique_1311']
    ch = fu['chiffrage']
    A('## 14. 13/11/2026, fonction unique des revenus (premier euro à 38 %)\n')
    A('**Décision de l\'auteur (13/11/2026)** : le minimum garanti est fondu dans la fonction des revenus, C(R) = a·R − P − (a − μ)·K_P·(1 − e^(−R/K_P)), avec μ = %s (premier euro à %s %%), P = 877 € avec loyer et 627 € sans loyer ; le filet retiré à 25 centimes par euro disparaît (`modeles/systeme-ideal/fonction-unique-1311.md`). '
      'Couche datée `DECISIONS1311` (`modeles/systeme-ideal/decisions_1311.js`, tests `test_decisions_1311.js`) au-dessus de `DECISIONS1111D`, sans l\'écraser. Leviers F (%s Md€) et coefficient a (%s) inchangés ; prélèvements obligatoires inchangés (le plancher est une dépense). '
      'Même règle de faisabilité, mêmes tirages (graine %d, %s) ; « avant » = banc du § 13 (`donnees/avant-1311-langagement.json`).\n' % (
          fr(fu['mu'], 2), fr(100 * fu['mu']), fr(sn['F'], 1), fr(sn['a'], 4), N['graine'], fr(N['tirages'])))
    A('**Ce que fait la couche** (modèle, Md€ de 2025 par an dès 2029, + améliore le solde ; favorable / central / défavorable) : '
      '(FU01) **correction de convention** : le bilan comptait le complément de la zone de retrait à 877 € pour tous et ne retirait la part logement (ligne PL01) qu\'aux bénéficiaires à revenu nul, alors que la règle la retire à quiconque ne paie pas de loyer : %s / **%s** / %s ; '
      '(FU02) **la décision** (fonction unique au lieu du filet, part logement traitée pareil des deux côtés) : %s / **%s** / %s ; **net : %s / %s / %s**. Les deux lignes sont rattachées au module M-PL (même mécanisme, même score de faisabilité, 2).\n' % (
          fr(ch['correctionPL01'][0], 2), fr(ch['correctionPL01'][1], 2), fr(ch['correctionPL01'][2], 2), fr(ch['decision'][0], 2), fr(ch['decision'][1], 2), fr(ch['decision'][2], 2),
          fr(ch['net'][0], 2), fr(ch['net'][1], 2), fr(ch['net'][2], 2)))
    lignes = [('Solde en régime (2038), Md€ de 2025', 'solde_regime', 'fr'), ('Dette 2032, % du PIB', 'dette2032', 'pc'), ('Dette 2038, % du PIB', 'dette2038', 'pc'), ('Dette 2058, % du PIB', 'dette2058', 'pc'),
              ('Déficit 2038, % du PIB', 'deficit2038_pct', 'pc')]
    A('| Notre système, médiane [intervalle à 80 %] | Avant (§ 13) | Après (fonction unique) | Écart de la médiane |\n|---|---|---|---|')
    for lib, k, f in lignes:
        a, b = AV.get(k), ap.get(k)
        if a is None or b is None:
            continue
        k100 = 100.0 if f == 'pc' else 1.0
        A('| %s | %s | %s | %s |' % (lib, iv(a, k100, 1 if f == 'pc' else 0), iv(b, k100, 1 if f == 'pc' else 0), fr((b['p50'] - a['p50']) * k100, 1 if f == 'fr' else 2)))
    A('| Effet médian de la ligne M-PL en régime (Md€) | %s | %s | |' % (iv(AV['par_mesure']['M-PL'], 1, 1), iv(ap['par_mesure']['M-PL'], 1, 1)))
    A('\n**Trajectoire année par année** (médiane ; taux fixe) :\n')
    A('| | ' + ' | '.join(ans) + ' |\n|---|' + '---|' * len(ans))
    for lib, key, fct in (('Effet sur le solde', 'serie_eff_mediane', 1.0), ('Déficit (% du PIB)', 'serie_deficit_mediane', 100.0)):
        A('| %s, avant | %s |' % (lib, ' | '.join(fr(fct * AV[key][a], 1) for a in ans)))
        A('| %s, après | %s |' % (lib, ' | '.join(fr(fct * ap[key][a], 1) for a in ans)))
    A('\n**Lecture au central, sans tirage ni filtre** (modèle, taux fixe, macro de référence) :\n')
    A('| | Avant (§ 13) | Après (fonction unique) |\n|---|---|---|')
    for y in (2029, 2032, 2038, 2043, 2058):
        i = y - 2029
        A('| %d : dette ; déficit (%% du PIB) | %s ; %s | %s ; %s |' % (y, fr(100 * sv['reference']['ratio'][i], 1), fr(100 * sv['reference']['deficit'][i], 2), fr(100 * sn['reference']['ratio'][i], 1), fr(100 * sn['reference']['deficit'][i], 2)))
    A('| Macro prudente : dette 2038 ; déficit 2038 | %s ; %s | %s ; %s |' % (fr(100 * sv['prudente']['ratio'][9], 1), fr(100 * sv['prudente']['deficit'][9], 1), fr(100 * sn['prudente']['ratio'][9], 1), fr(100 * sn['prudente']['deficit'][9], 1)))
    A('| Année de passage durable sous 3 %% de déficit | %s | %s |' % (str(sv['sous3'] or 'aucune avant 2058'), str(SYS['sous3_central'] or 'aucune avant 2058')))
    A('\n**Sans complaisance.** (1) La décision **coûte** (%s Md€ par an au central) ; le solde s\'améliore seulement parce que la même couche corrige une surestimation de la dépense du plancher (%s Md€), qui existait avant la décision et aurait dû être corrigée de toute façon. '
      '(2) Les deux montants reposent sur un calage du plancher (k) fait pour l\'ancienne règle et sur la part de personnes sans loyer des allocataires du RSA (19 %% au central), appliquée à toute la zone de retrait (⚠️ H-FU6, H-FU7) ; aucune réaction de l\'emploi n\'est comptée. '
      '(3) L\'effet est petit devant l\'incertitude du banc (dette 2038 : %s → %s %% en médiane, intervalle à 80 %% large de %s points) : il ne change aucun classement.\n' % (
          fr(ch['decision'][1], 2), fr(ch['correctionPL01'][1], 2), fr(100 * AV['dette2038']['p50'], 1), fr(100 * ap['dette2038']['p50'], 1), fr(100 * (ap['dette2038']['p90'] - ap['dette2038']['p10']), 0)))


def philippe_section(A, P):
    """§ 14 : la colonne d'Édouard Philippe (lecture de notre simulateur) et sa sensibilité aux hypothèses H-PH."""
    if 'philippe' not in P:
        return
    _, mes, mod = R.charger_programme('philippe')
    p = P['philippe']
    S = N.get('sensibilites_philippe', {})
    A('## 14. 13/11/2026 : Horizons (Édouard Philippe), lecture de notre simulateur\n')
    A('**%s**\n' % mod.AVERTISSEMENT)
    A('Document lu : %s. Mesures chiffrées : %d lignes (%d économies passées par la règle commune, %d baisses d\'impôts et dépenses nouvelles comptées en entier) ; %d annonces sans contenu chiffrable restent hors du calcul (`programmes/philippe/mesures.py`, `NON_CHIFFREES`). '
      'Montants publiés par le candidat : 50 Md€ d\'aides aux entreprises en moins et 50 Md€ d\'impôts de production en moins ; tous les autres montants sont nos hypothèses H-PH1 à H-PH12, écrites une par une dans `detail-philippe.md`. '
      'Le quart de l\'effort que le programme attend « de la croissance et de l\'emploi » n\'est pas crédité : aucun effet de croissance n\'est compté, pour aucun programme.\n'
      % (mod.SRC_PH, len(mes), sum(1 for m in mes if m['sens'] == 'recette'), sum(1 for m in mes if m['sens'] == 'depense'), len(mod.NON_CHIFFREES)))
    cols = [('central', 'Hypothèses au central (colonne du § 1)', p)] + [(v, lib, S[v]) for v, lib in (('bas', 'Toutes à leur borne basse'), ('haut', 'Toutes à leur borne haute'),
                                                                                                    ('defavorable', 'Économies basses, coûts hauts'), ('favorable', 'Économies hautes, coûts bas')) if v in S]
    A('| (médiane [intervalle à 80 %%], %s tirages, même graine) | %s |' % (fr(N['tirages']), ' | '.join(c[1] for c in cols)))
    A('|---|' + '---|' * len(cols))
    for lib, f in (("Effet sur le solde en régime, 2032 (Md€)", lambda d: iv(d['solde_regime'])),
                   ("dont économies, après la règle (Md€)", lambda d: iv(d['recettes_regime'])),
                   ("dont baisses d'impôts et dépenses nouvelles (Md€)", lambda d: iv(d['depenses_regime'])),
                   ("Déficit public 2032 (% du PIB, médiane)", lambda d: fr(100 * d['serie_deficit_mediane']['2032'], 1)),
                   ("Déficit public 2038 (% du PIB)", lambda d: pc(d['deficit2038_pct'], 1)),
                   ("Dette publique 2032 (% du PIB)", lambda d: pc(d['dette2032'])),
                   ("Dette publique 2038 (% du PIB)", lambda d: pc(d['dette2038'])),
                   ("Dette 2038, taux endogène (% du PIB)", lambda d: pc(d['dette2038_endo']))):
        A('| %s | %s |' % (lib, ' | '.join(f(c[2]) for c in cols)))
    fil = P['fil_de_l_eau']
    pm = p['par_mesure']
    lourdes = sorted(pm, key=lambda i: -abs(pm[i]['p50']))[:6]
    libs = {m['id']: m for m in mes}
    A('\nLecture. (1) **La cible du candidat est un déficit de 2 %% du PIB en fin de mandat ; notre lecture donne %s %% en 2032** (fil de l\'eau : %s %%) : avec la même règle pour tous, les mesures publiées ne suffisent pas à l\'atteindre, '
      'parce que le pacte fiscal compte 50 Md€ de baisse d\'impôts en entier contre une économie d\'aides non désignées ramenée à sa part réalisable (score 2, médiane 70 %%), parce que les dépenses nouvelles (familles, professeurs, heures supplémentaires) '
      'ne sont pas financées ligne à ligne, et parce que le quart attendu de la croissance n\'est pas crédité. Ce n\'est pas une réfutation : la cible pourrait être tenue par des mesures que le programme ne détaille pas. '
      '(2) Les lignes qui pèsent le plus (médiane, Md€) : %s. (3) Les bornes basse et haute de toutes les hypothèses bougent ensemble économies et coûts et se compensent en partie ; les colonnes « défavorable » et « favorable » donnent l\'écart utile : de %s à %s Md€ de solde.\n'
      % (fr(100 * p['serie_deficit_mediane']['2032'], 1), fr(100 * fil['serie_deficit_mediane']['2032'], 1),
         ' ; '.join('%s %s (%s)' % (i, fr(pm[i]['p50'], 1), libs[i]['libelle'][:60]) for i in lourdes),
         fr(S['defavorable']['solde_regime']['p50']) if 'defavorable' in S else '—', fr(S['favorable']['solde_regime']['p50']) if 'favorable' in S else '—'))


ECARTS = [
    ('1', "Filtre de faisabilité asymétrique", "**Traité** : une seule règle (score M + J + E, grille unique) pour toutes les économies et toutes les recettes nouvelles de tous les programmes, nous compris (§ 0, annexe)."),
    ('2', "Fourchettes des dépenses nouvelles", "**Traité** : plancher commun 0,9 à 1,3 fois pour les dépenses chiffrées par leur auteur seul, y compris les modules de coût de notre système ; les fourchettes plus larges et sourcées sont gardées."),
    ('3', "Leviers votés calés pour stabiliser la dette (nous seuls)", "**Traité en partie** : les leviers votés F passent par la règle comme les autres hausses ; le calage n'est plus garanti (la dette n'est stable après 2038 que dans une minorité de tirages). Les autres programmes n'ont pas de règle de bouclage et n'en reçoivent pas : on publie le résultat de chacun tel quel."),
    ('4', "Intervalle de notre système sous-estimé (socle fixé au central)", "**Traité en partie** : le socle (non décomposé) reçoit la classe du milieu, les coûts le plancher commun, F et les petites lignes une part ; l'intervalle est plus large mais reste étroit (§ 7). Décomposer le socle en lignes demande un export du modèle JavaScript (hors de ce dossier)."),
    ('5', "Régime atteint en 2038 contre 2032", "**Non levé, expliqué** : c'est la rampe du programme (décision de l'auteur), pas un paramètre du banc. On ajoute la dette à la même année de mandat (5e année) et la trajectoire année par année (§ 1, § 4)."),
    ('6', "Taux fixe dans le tableau principal", "**Traité** : tableau principal gardé à 3,45 %, version à taux endogène affichée en dessous pour tous (§ 1)."),
    ('7', "Coût par poste du non-remplacement", "**Traité** : M-M1 valorisé au coût d'un recrutement comme LR01 (−3,5 Md€ sur 15,0, proportion simple appliquée à toute la série)."),
    ('8', "Baisses de TVA du RN hors de notre fonction de TVA", "**Non traité** : il faudrait relancer le modèle JavaScript (`changementTva`) hors de ce dossier ; ce sont des coûts (le plancher commun 0,9-1,3 s'applique)."),
    ('9', "Réactions de l'impôt sur le revenu différentes selon les programmes", "**Non traité** : il faut une table d'élasticités partagée avec le modèle JavaScript, hors de ce dossier."),
    ('10', "Médianes « relatives » qui ne reprennent pas celles qu'elles disent reprendre", "**Levé** : la part est fixée par le score, appliqué par le code ; plus de jugement ligne par ligne sur la médiane, seulement sur les trois réponses."),
    ('11', "Édouard Philippe hors du banc", "**Traité le 13/11/2026, avec une réserve** : le programme publié le 12/11/2026 n'est pas chiffré par le candidat ; la colonne est une lecture de notre simulateur (hypothèses H-PH1 à H-PH12, § 14), sous la même règle que les autres."),
    ('12', "Variante « moins sévère » non rejouée pour LR et le PS", "**Non traité en v2** : la v2 ne rejoue pas la variante ; la v1 (§ 10) reste la référence ; effet connu : +1 à +7 Md€ selon le programme."),
]


def main():
    txt = ecrire()
    with open(os.path.join(ICI, 'resultats-v2.md'), 'w', encoding='utf-8') as f:
        f.write(txt + '\n')
    print('resultats-v2.md écrit (%d lignes)' % txt.count('\n'))


if __name__ == '__main__':
    main()
