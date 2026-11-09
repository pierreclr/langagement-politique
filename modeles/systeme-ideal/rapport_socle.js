// § 10 de resultats-optimum.txt : « Socle plus haut ? » (03/11/2026, H581-H586). Reproduction, depuis ce dossier (la sortie s'AJOUTE à resultats-optimum.txt, §§ 1-9 intacts) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js optimum.js rapport_socle.js >> resultats-optimum.txt
var Z = this.Optimum, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { if (Math.round(x) === 0) return '0'; return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function pc(x, d) { return (Math.round(x * 100 * (d ? 10 : 1)) / (d ? 10 : 1)).toString().replace('.', ',').replace('-', '−') + ' %'; }
function sg(x, d) { var v = d ? r1(x) : r0(x); return (x > 0 && v.charAt(0) !== '−' && v !== '0' ? '+' : '') + v; }
var SOCLES = [350, 400, 450, 500, 550, 600, 700], T_MAX = 0.6, V2 = Z.ARCHITECTURE_V2;
var CAS = [['smic_seul', 'smicard'], ['couple_1smic_2enf', 'couple 1 Smic'], ['couple_2smic_2enf', 'couple 2 Smic'], ['parent_isole_smic', 'parent isolé Smic'], ['rsa_seul', 'RSA'], ['retraite_aspa_loc', 'retraité locataire'], ['cadre_2x', 'cadre 3 Smic'], ['cadre_4x', 'cadre 6 Smic']];
var t0 = Date.now();

log('\n## 10. Socle plus haut ? Grille du socle de 350 à 700 € (03/11 ; H581-H586)');
log('Question de l\'auteur : le socle de 350 € est trop bas. Base : architecture finale v2 (§ 9), dont seuls le **socle** et le **taux plat** changent (majoration parent isolé 250 €, prime d\'activité à 100 %, sortie « plat », taxe à 1 % plafonnée, héritage reçu à vie, capital de départ, exil défendable : tout le reste est inchangé). Le taux plat est le plus petit, au dixième de point, qui donne un solde central ≥ 0 (dichotomie sur 30-60 % ; au-delà de 60 %, le solde cesse de croître : à 80 %, l\'assiette s\'effondre, −57 Md€ au central pour la v2). Aucun défaut du code n\'est modifié ; fonctions `Optimum.grilleSocle`, `ficheSocle`, `tauxEquilibre`, `masseSalariale`. Au dixième de point, la v2 à 350 € équilibre à 40,9 % (et non 41,0 %, taux arrondi du § 9).');
var G = SOCLES.map(function (s) {
  var a = F(V2, { socle: s }), te = Z.tauxEquilibre(a), imp = te === null;
  var f = Z.ficheSocle(a, imp ? T_MAX : te); f.impose = imp; f.socle = s; return f;
});
function etiqTaux(f) { return pc(f.tPlat, 1) + (f.impose ? ' (imposé : pas d\'équilibre ≤ 60 %)' : ''); }

log('\n### 10.1 Taux plat d\'équilibre et soldes (Md€/an, croisière, déficit actuel compris)');
log('| socle | taux plat | solde bas | solde central | solde haut | haut en % du PIB |');
log('|---|---|---|---|---|---|');
G.forEach(function (f) { log('| ' + f.socle + ' € | ' + etiqTaux(f) + ' | ' + sg(f.soldes.bas, 1) + ' | ' + sg(f.soldes.central, 1) + ' | ' + sg(f.soldes.haut, 1) + ' | ' + pc(f.soldes.haut / 2935, 1) + ' |'); });
log('Lecture : chaque tranche de 50 € de socle coûte 1,8 à 2,9 points de taux plat (jusqu\'à 600 €), et le solde au haut se dégrade de 12 à 23 Md€ par tranche : plus le taux monte, plus l\'assiette réagit (exil, offre de travail). À 700 €, le taux d\'équilibre n\'existe plus : le taux plat de 60 % est le maximum cherché et le central est à −10,5 Md€.');

log('\n### 10.2 Cas types (€/mois, écart au droit actuel, central, au taux d\'équilibre de la ligne)');
log('| socle (taux) | ' + CAS.map(function (c) { return c[1]; }).join(' | ') + ' |');
log('|---|' + CAS.map(function () { return '---'; }).join('|') + '|');
G.forEach(function (f) { log('| ' + f.socle + ' € (' + pc(f.tPlat, 1) + ') | ' + CAS.map(function (c) { return sg(f.cas[c[0]].ecartMois); }).join(' | ') + ' |'); });

log('\n### 10.3 Dixièmes de niveau de vie (€/UC/mois, écart au droit actuel, central)');
log('| socle (taux) | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 |');
log('|---|---|---|---|---|---|---|---|---|---|---|');
G.forEach(function (f) { log('| ' + f.socle + ' € (' + pc(f.tPlat, 1) + ') | ' + f.deciles.map(function (d) { return sg(d.ecart); }).join(' | ') + ' |'); });

log('\n### 10.4 Effet sur l\'offre de travail (H581, H567 ; écart contre le droit actuel ; ordre de grandeur, pas une prévision)');
log('Masse salariale : module `systeme-ideal/modele.js` (réactions du travail déjà comptées dans le solde : substitution, participation, effet revenu, exil des très hauts revenus), écart relatif à « sans réactions » = droit actuel, au taux et au socle de la ligne ; D1-D9 seuls, puis total avec le haut du barème. Participation : `Optimum.participation` (η = 0,4 du profil D1-D2, H567), variation relative de l\'emploi du ménage type à 0,25 / 0,5 / 1 Smic contre le droit actuel (atlas OpenFisca 2026), prime d\'activité à 100 % et sortie « plat » comprises.');
log('| socle (taux) | masse salariale D1-D9 (central) | masse salariale totale : bas / central / haut | participation personne seule 0,25 / 0,5 / 1 Smic | parent isolé 0,25 / 0,5 / 1 Smic | couple monoactif 0,25 / 0,5 / 1 Smic |');
log('|---|---|---|---|---|---|');
function pcs(v) { return v.map(function (x) { return sg(100 * x, 1) + ' %'; }).join(' / '); }
G.forEach(function (f) {
  log('| ' + f.socle + ' € (' + pc(f.tPlat, 1) + ') | ' + sg(100 * f.masse.ecartD1D9, 1) + ' % | ' + sg(100 * f.masseBas.ecartTotal, 1) + ' / ' + sg(100 * f.masse.ecartTotal, 1) + ' / ' + sg(100 * f.masseHaut.ecartTotal, 1) + ' % (' + r0(f.masse.totalMd) + ' Md€ au central) | '
    + pcs(f.participation.seul) + ' | ' + pcs(f.participation.parent) + ' | ' + pcs(f.participation.couple) + ' |');
});
log('Lecture : la masse salariale recule à mesure que socle et taux montent (effet de substitution sur le taux, effet revenu du socle). La participation des bas salaires reste positive contre le droit actuel grâce à la prime d\'activité et à la sortie « plat » (le parent isolé garde +27 à +34 % à 0,25 Smic), mais celle de la personne seule à 0,25 Smic fond de +12,9 % à −0,4 % entre 350 et 600 € : le taux plat qui finance le socle reprend ce que le socle donne. Limite : le module d\'offre de travail raisonne à prestations sociales actuelles, sans la prime d\'activité maintenue (traitée par `participation`) ; les deux mesures ne s\'additionnent pas.');

log('\n### 10.5 Taux marginal à l\'infini et incitations');
log('| socle (taux) | taux marginal à l\'infini (contrainte (5) ≤ 75 %) | TME maximal 0-2 Smic (seul / parent / couple, max) | effort du retraité propriétaire modeste (≤ 10 %) |');
log('|---|---|---|---|');
G.forEach(function (f) { log('| ' + f.socle + ' € (' + pc(f.tPlat, 1) + ') | ' + pc(f.margMax, 1) + ' | ' + pc(f.tme3, 1) + ' | ' + pc(f.effort, 1) + ' |'); });

log('\n### 10.6 Contraintes tenues');
log('(1) solde central ≥ 0 ; (2) solde au haut ≥ −3 % du PIB ; (3) D1-D3, parent isolé au Smic et retraité locataire non perdants ; (4) plafond de 50 % sur les transmissions (taux plat ≤ 50 % compris) ; (5) taux marginal à l\'infini ≤ 75 % ; (6) effort du retraité modeste ≤ 10 %.');
log('| socle (taux) | (1) | (2) | (3) | (4) | (5) | (6) | écart (2), Md€ | écart (3), €/mois |');
log('|---|---|---|---|---|---|---|---|---|');
G.forEach(function (f) { log('| ' + f.socle + ' € (' + pc(f.tPlat, 1) + ') | ' + f.contraintes.map(function (c) { return c ? 'tenue' : '**non**'; }).join(' | ') + ' | ' + r1(f.violations[1]) + ' | ' + r0(f.violations[2]) + ' |'); });
var dernier = G.filter(function (f) { return f.contraintes[0] && f.contraintes[2] && f.contraintes[3] && f.contraintes[4] && f.contraintes[5]; }).map(function (f) { return f.socle; });
log('Socles qui tiennent (1), (3), (4), (5) et (6) : ' + (dernier.length ? dernier.join(', ') + ' €' : 'aucun') + ' ; la (2) n\'est tenue par aucun, comme partout (§§ 2, 7, 9).');

log('\n### 10.7 Variante « socle haut + prime d\'activité réduite »');
log('Idée : un socle plus généreux fait en partie double emploi avec la prime d\'activité (10,7 Md€, ≈ 8 paramètres, demande à la CAF). Peut-on réduire celle-ci (100 % → 75, 50, 25 ou 0 % du barème actuel) et protéger au moins aussi bien les bas salaires, à taux égal ? Tout le reste de la v2 est inchangé. Colonnes : taux d\'équilibre ; puis **à taux égal à celui de la v2 (40,9 %)**, soldes et protections.');
var REF = G[0], TREF = REF.tPlat;
var PPAS = [1, 0.75, 0.5, 0.25, 0], VS = [];
log('| socle | prime d\'activité | taux d\'équilibre | à 40,9 % : solde central | smicard | couple 1 Smic | parent isolé Smic | D1 | pire perte parmi (3), €/mois | TME max |');
log('|---|---|---|---|---|---|---|---|---|---|');
function ligne(s, ppa) {
  var a = F(V2, { socle: s, ppaMaintenue: ppa }), te = Z.tauxEquilibre(a), e = Z.ficheSocle(a, TREF), q = te === null ? null : Z.ficheSocle(a, te);
  VS.push({ s: s, ppa: ppa, te: te, e: e, q: q });
  log('| ' + s + ' € | ' + pc(ppa) + ' | ' + (te === null ? 'pas d\'équilibre ≤ 60 %' : pc(te, 1)) + ' | ' + sg(e.soldes.central, 1) + ' | ' + sg(e.cas.smic_seul.ecartMois) + ' | ' + sg(e.cas.couple_1smic_2enf.ecartMois) + ' | ' + sg(e.cas.parent_isole_smic.ecartMois) + ' | ' + sg(e.deciles[0].ecart) + ' | ' + r0(e.violations[2]) + ' | ' + pc(e.tme3, 1) + ' |');
}
[350, 400, 500, 600].forEach(function (s) { PPAS.forEach(function (p) { if (s === 350 && p !== 1 && p !== 0.5) return; ligne(s, p); }); });
log('Ligne de référence : socle 350 €, prime à 100 % (la v2).');
// verdict : une variante « protège mieux à taux égal » si, au taux d'équilibre ≤ celui de la v2 (+0,0), elle ne fait perdre personne de plus que la v2
var prot = function (c) { return Math.min(c.cas.smic_seul.ecartMois, c.cas.couple_1smic_2enf.ecartMois, c.cas.parent_isole_smic.ecartMois, c.deciles[0].ecart); };
var meilleures = VS.filter(function (v) { return v.q && v.ppa < 1 && v.q.tPlat <= TREF + 1e-9 && prot(v.q) > prot(REF); });
var egalTaux = VS.filter(function (v) { return v.ppa < 1 && v.e.soldes.central >= 0 && prot(v.e) > prot(REF); });
log('Verdict mécanique (protection = le moins bien loti parmi smicard, couple 1 Smic, parent isolé Smic, D1 ; référence ' + sg(prot(REF)) + ' €/mois) : variantes à prime réduite dont le taux d\'équilibre est ≤ 40,9 % et qui protègent mieux : ' + (meilleures.length ? meilleures.map(function (v) { return v.s + ' €/' + pc(v.ppa); }).join(', ') : 'aucune') + ' ; variantes à prime réduite qui, à 40,9 % imposé, tiennent l\'équilibre central et protègent mieux : ' + (egalTaux.length ? egalTaux.map(function (v) { return v.s + ' €/' + pc(v.ppa); }).join(', ') : 'aucune') + '.');
// protection à solde égal : pour chaque socle, quelle prime donne la meilleure protection à l'équilibre ?
log('À socle égal, réduire la prime de 25 points ne fait gagner que 0,1 à 0,4 point de taux plat d\'équilibre (500 € : 46,9 % → 46,7 %) et coûte au smicard 57 € par mois (+196 → +139 à 40,9 % imposé) : la prime est un levier de protection bon marché (10,7 Md€), le socle plus haut ne la remplace pas. Variante rejetée.');
log('Protection du moins bien loti à l\'équilibre (€/mois), par socle et par niveau de prime :');
log('| socle | ' + PPAS.map(function (p) { return 'prime ' + pc(p); }).join(' | ') + ' |');
log('|---|' + PPAS.map(function () { return '---'; }).join('|') + '|');
[350, 400, 500, 600].forEach(function (s) { log('| ' + s + ' € | ' + PPAS.map(function (p) { var v = VS.filter(function (x) { return x.s === s && x.ppa === p; })[0]; return v && v.q ? sg(prot(v.q)) + ' (à ' + pc(v.q.tPlat, 1) + ')' : '—'; }).join(' | ') + ' |'); });
log('\nTemps de calcul du § 10 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
