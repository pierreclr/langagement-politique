// § 24 de resultats-optimum.txt : v5.6, dispositif retraites V6 complet compté dans le taux, année par année (05/11/2026 ; H786-H792, V13468-V13475). Ne modifie pas les § 1-23.
// Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 23) :
//   jsc <liste de test_decisions_0511e.js, de modele.js à decisions_0511e.js> rapport_decisions_0511e.js >> resultats-optimum.txt
var E = this.Decisions0511e, D = this.Decisions0511d, ST = this.Stress, Z = this.Optimum;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function sg(x) { return (x > 0.05 ? '+' : '') + r1(x); }
function pt(x) { return (Math.round(x * 10000) / 100).toFixed(2).replace('.', ',') + ' %'; }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',').replace('-', '−') + ' %'; }
function trip(f) { return r1(f('bas')) + ' / ' + r1(f('central')) + ' / ' + r1(f('haut')); }
var SCS = ['bas', 'central', 'haut'], t0 = Date.now(), JAL = [2030, 2035, 2040, 2050, 2060];
var tr = E.trajectoire(), cr = E.croisiere(), cx = E.creux(), c70 = E.croisiere(2070), pas = E.pointDeTaux(), te55 = D.tauxEquilibreFin();

log('\n## 24. v5.6 (arbitrage 1 du 05/11 matin) : le dispositif retraites V6 complet est compté dans le taux, année par année (H786-H792, V13468-V13475)');
log('**Ce que ce paragraphe fait.** L\'auteur a décidé de compter le dispositif retraites V6 complet dans le taux et d\'afficher sa trajectoire année par année. Module : `decisions_0511e.js` (rien n\'est modifié dans les modules existants ; la v5.5 reste reproductible) ; test : `test_decisions_0511e.js` ; hypothèses : `methode.md` § 40. L\'effet est lu **année par année** dans le modèle de cohortes de `modeles/retraites/age_libre.js` (`bilanReference`), non par interpolation entre 2030, 2040 et 2060. L\'année 1 du modèle est 2029 ; avant, aucun effet. Md€ de 2025 par an ; ordre du modèle : favorable (bas) / central / défavorable (haut).');

log('\n### 24.0 Trois corrections faites en intégrant V6 (sans elles, le chiffre du résumé serait faux)');
log('1. **Contribution des hautes pensions : double compte retiré (V13469).** Le V6 compte ' + r2(E.hautesPensionsV6()) + ' Md€/an de contribution de 20 % au-dessus de 2 500 € nets (pension seule des retraités résidents). La v5.5 la compte **déjà** (ligne N03, `retraites2.js` : ' + r2(E.hautesPensionsV55('central')) + ' Md€ au central, pension et capital, nette de la fuite). Le V6 en est un sous-ensemble : on retire les ' + r2(E.hautesPensionsV6()) + ' du V6. (Les deux chiffrages de la même mesure ne sont pas rapprochés : ' + r1(E.hautesPensionsV55('central') - E.hautesPensionsV6()) + ' Md€ d\'écart, à revoir.)');
log('2. **Plancher de 1 300 € : omission réparée (V13468).** Le dispositif l\'annonce, mais les montants de `resultats.md` ne le contiennent pas (`bilanReference` additionne âge de référence, âge libre, pénibilité, indexation, hautes pensions, substitution). Son coût est **ajouté** : ' + trip(function (s) { return E.plancherRegime(s); }).replace(/−/g, '') + ' Md€/an en régime (`pauvreteAnticipee`, plancher 1 300 €, décalage de l\'âge libre de chaque scénario), avec une montée en charge par cohortes (' + Math.round(E.monteePlancher(2030) * 100) + ' % en 2030, ' + Math.round(E.monteePlancher(2040) * 100) + ' % en 2040, ' + Math.round(E.monteePlancher(2060) * 100) + ' % en 2060).');
log('3. **S04 et S05 (régimes spéciaux, catégories actives ; ligne H21 du bilan) : non comptés (V13470).** Le V6 porte sur **l\'ensemble des départs** (cohorte annuelle de 0,77 M, tous régimes) : l\'âge de référence indexé et la pénibilité déplacent déjà l\'âge de départ des actifs de ces régimes. Compter S04 (+0,45) et S05 (+2,0, pleine charge à 35 ans, 0 avant 10 ans) en plus compterait deux fois les mêmes départs. Ils restent une **réserve plafonnée à +2,45 Md€** (≈ 0,24 point de taux), non additive.');

log('\n### 24.1 Ce que vaut le dispositif aux jalons (central, Md€/an ; + améliore le solde)');
log('| année | âge de référence | âge libre | pénibilité | indexation | substitution | plancher 1 300 € | **net ajouté à la v5.5** | brut V6 (resultats.md) | hautes pensions (déjà en N03) |'); log('|---|---|---|---|---|---|---|---|---|---|');
JAL.concat([2029, 2070]).sort().forEach(function (y) { var c = E.composantes('central', y); log('| ' + y + ' | ' + sg(c.ageReference) + ' | ' + sg(c.ageLibre) + ' | ' + sg(c.penibilite) + ' | ' + sg(c.indexation) + ' | ' + sg(c.substitution) + ' | ' + sg(c.plancher) + ' | **' + sg(c.net) + '** | ' + sg(c.brut) + ' | ' + sg(c.hautesPensions) + ' |'); });
log('Âge de référence et âge libre comprennent les recettes (travail prolongé ou perdu, à 42 %). Le brut redonne exactement les valeurs de `resultats.md` : −20,8 en 2030, −5,9 en 2040, +20,1 en 2060 au central ; **le net compté dans le taux est −27,8 / −14,6 / +9,0**.');

log('\n### 24.2 Solde à 42 % et taux d\'équilibre aux jalons (solde v5.5 de +' + r2(D.solde('central')) + ' au central + effet net)');
log('| année | effet net b / c / h | solde à 42 % b / c / h | taux d\'équilibre (central) | écart au taux v5.5 (' + pt(te55) + ') |'); log('|---|---|---|---|---|');
JAL.forEach(function (y) { log('| ' + y + ' | ' + trip(function (s) { return E.v6Net(s, y); }) + ' | ' + trip(function (s) { return E.solde(s, y); }) + ' | **' + pt(E.tauxEquilibre(y)) + '** | ' + sg((E.tauxEquilibre(y) - te55) * 100) + ' point |'); });
log('Un point de taux plat vaut ' + r2(pas) + ' Md€ au central. Au bas et au haut, le solde n\'est pas monotone en fonction du taux (érosion de l\'assiette, H510) : pas de taux d\'équilibre calculé.');

log('\n### 24.3 Taux de croisière et taux maximal pendant le creux (central)');
log('- **Taux d\'équilibre de croisière (2060 : ' + sg(cr.net) + ' Md€/an) : ' + pt(cr.taux) + '**, soit ' + r2((te55 - cr.taux) * 100).replace('−', '') + ' point sous celui de la v5.5. En 2070 (le dispositif continue de monter avec l\'espérance de vie : ' + sg(c70.net) + ' Md€) : ' + pt(c70.taux) + '. La croisière est prise en 2060, comme `Optimum.retraitesV6Annee` (constante au-delà) : prudent.');
log('- **Taux maximal nécessaire pendant le creux : ' + pt(cx.taux) + ' en ' + cx.an + '** (effet net ' + sg(cx.net) + ' Md€, solde à 42 % : ' + sg(cx.solde) + '), soit +' + r2((cx.taux - te55) * 100) + ' points sur la v5.5 et +' + r2((cx.taux - 0.42) * 100) + ' sur 42 %.');
log('- Écart entre le pic du creux et la croisière : ' + r2((cx.taux - cr.taux) * 100) + ' points ; **le système n\'a pas de taux unique** : 42 % ne suffit pas de ' + E.lissage().premiere + ' à ' + E.lissage().derniere + ' et ne tient qu\'à partir de ' + (function () { var y; for (y = 2029; y <= 2070; y++) if (E.solde('central', y) >= 0) return y; return null; })() + '.');

log('\n### 24.4 Lissage du creux : la marge à 42 % suffit-elle ?');
log('**Non.** La marge de la v5.5 à 42 % est de +' + r2(D.solde('central')) + ' Md€/an ; le dispositif coûte jusqu\'à ' + r1(-cx.net) + ' Md€/an en 2029.');
log('| taux plat | marge v5.5 (Md€) | années en déficit | manque maximal (Md€/an, année) | points de taux manquants | manque cumulé (Md€) | cumul de la trajectoire à 2070 | retour du cumul à zéro |'); log('|---|---|---|---|---|---|---|---|');
[0.42, 0.43, 0.44, Math.ceil(cx.taux * 1000) / 1000].forEach(function (t) { var l = E.lissage(t); log('| ' + pt(t) + ' | ' + sg(l.marge) + ' | ' + l.anneesDeficit + (l.premiere ? ' (' + l.premiere + ' à ' + l.derniere + ')' : '') + ' | ' + r1(l.manqueMax) + (l.manqueMaxAn ? ' (' + l.manqueMaxAn + ')' : '') + ' | ' + r2(Math.max(0, l.pointsManquants)) + ' | ' + r1(l.manqueCumule) + ' | ' + sg(l.cumulSurPeriode) + ' | ' + (l.anneeRetourDuCumul || '—') + ' |'); });
var tl60 = E.tauxLisse(2029, 2060), tl70 = E.tauxLisse(2029, 2070);
log('Lecture : à 42 %, il manque **jusqu\'à ' + r1(E.lissage().manqueMax) + ' Md€/an (' + r2(E.lissage().pointsManquants) + ' points) en ' + E.lissage().manqueMaxAn + '**, pendant **' + E.lissage().anneesDeficit + ' ans (' + E.lissage().premiere + '-' + E.lissage().derniere + ')**, soit **' + r1(E.lissage().manqueCumule) + ' Md€ cumulés** (Md€ de 2025, hors intérêts). Le cumul est remboursé par les excédents d\'après, mais seulement en **' + E.lissage().anneeRetourDuCumul + '**. Trois voies : (a) un taux de ' + pt(cx.taux) + ' jusqu\'en 2047 (aucune dette en plus), puis une baisse ; (b) **un taux constant de ' + pt(tl60) + '** qui équilibre la somme des soldes 2029-2060 (' + pt(tl70) + ' sur 2029-2070), la dette absorbant le creux et les intérêts non comptés ; (c) 42 % et un creux financé par la dette (§ 24.5 : + ' + r1((E.jalonsDette('central', { v6: 'net' }).r10 - E.jalonsDette('central').r10) * 100) + ' points de PIB à 10 ans). Le choix est politique ; la v5.6 ne le tranche pas.');

log('\n### 24.5 Dette / PIB à 10, 20 et 30 ans (central ; année 1 = 2029 : 10 ans = 2038, 20 = 2048, 30 = 2058 ; chemin de `stress.js` prolongé, taux de 42 %)');
var s0 = E.jalonsDette('central'), s1 = E.jalonsDette('central', { v6: 'net' }), sb = E.jalonsDette('central', { v6: 'brut' }), sc1 = E.jalonsDette('central', { v6: 'net', levierD: 'corrige' }), sc0 = E.jalonsDette('central', { levierD: 'corrige' });
var sv0 = E.jalonsDette('central', { valeur: 'aucune' }), sv1 = E.jalonsDette('central', { valeur: 'aucune', v6: 'net' }), sx0 = E.jalonsDette('central', { gel: false }), sx1 = E.jalonsDette('central', { gel: false, v6: 'net' });
function lig(nom, a) { log('| ' + nom + ' | ' + pc(a.r10) + ' | ' + pc(a.r20) + ' | ' + pc(a.r30) + ' | ' + pc(a.r42) + ' |'); }
log('| configuration | 10 ans | 20 ans | 30 ans | 2070 (42 ans) |'); log('|---|---|---|---|---|');
lig('v5.5 sans V6 (création de valeur gelée à l\'année 10)', s0); lig('**v5.6 avec V6 net (compté)**', s1); lig('V6 brut, tel que resultats.md (hautes pensions deux fois, sans plancher)', sb);
log('| écart V6 net − sans V6 (points de PIB) | **' + r1((s1.r10 - s0.r10) * 100) + '** | **' + r1((s1.r20 - s0.r20) * 100) + '** | **' + r1((s1.r30 - s0.r30) * 100) + '** | ' + r1((s1.r42 - s0.r42) * 100) + ' |');
lig('Sensibilité : sans aucune création de valeur, sans V6', sv0); lig('Sensibilité : sans aucune création de valeur, avec V6 net', sv1); lig('Sensibilité : création de valeur extrapolée telle quelle, sans V6', sx0); lig('Sensibilité : création de valeur extrapolée telle quelle, avec V6 net', sx1);
var bb = SCS.map(function (s) { return [E.jalonsDette(s).r10, E.jalonsDette(s, { v6: 'net' }).r10]; });
log('À 10 ans, bas / central / haut : sans V6 ' + pc(bb[0][0]) + ' / ' + pc(bb[1][0]) + ' / ' + pc(bb[2][0]) + ' ; avec V6 net ' + pc(bb[0][1]) + ' / ' + pc(bb[1][1]) + ' / ' + pc(bb[2][1]) + '. **Au-delà de 10 ans, seul le central a un sens** : le bas accumule des excédents jusqu\'à une dette négative, le haut ne se redresse pas.');
log('Dette au pic du central : ' + pc(s1.pic) + ' (' + s1.picAn + ') ; la dette ne remonte jamais au-dessus de son niveau de départ (123,5 %) avec V6 : le dispositif ralentit le désendettement, il ne l\'inverse pas. **Réserve** : au-delà de l\'année 10, la baisse vient de la **création de valeur gelée à son niveau de l\'année 10** (' + r1(E.valeur('central', 10)) + ' Md€/an au central, preuve C, V13471) et de la croissance nominale ; sans elle, la dette à 30 ans passe de ' + pc(s0.r30) + ' à ' + pc(sv0.r30) + '. L\'écart dû à V6 (+' + r1((s1.r10 - s0.r10) * 100) + ' / +' + r1((s1.r20 - s0.r20) * 100) + ' / +' + r1((s1.r30 - s0.r30) * 100) + ' points) est bien moins sensible à ce choix (+' + r1((sv1.r30 - sv0.r30) * 100) + ' à 30 ans sans création de valeur).');

log('\n### 24.6 Levier D du chemin de dette : effet de la correction proposée (NON appliquée ; décision de l\'auteur en attente, V13472)');
log('Correction proposée (`sources/chiffrage-reorientation-complexite.md`) : recettes de la réorientation de la complexité en plein régime de 1,5 / 6,4 / 14,1 à **1,5 / 4,1 / 8,4 Md€/an** (central −2,3). `palier1.js` n\'est **pas** modifié ; l\'effet est calculé dans le chemin de dette de `decisions_0511e.js` seulement. Le solde de croisière ne change pas (levier hors solde).');
log('| central | 10 ans | 20 ans | 30 ans |'); log('|---|---|---|---|');
log('| v5.6 avec V6, levier D actuel | ' + pc(s1.r10) + ' | ' + pc(s1.r20) + ' | ' + pc(s1.r30) + ' |'); log('| v5.6 avec V6, levier D corrigé | ' + pc(sc1.r10) + ' | ' + pc(sc1.r20) + ' | ' + pc(sc1.r30) + ' |');
log('| **effet de la correction (points de PIB)** | **+' + r1((sc1.r10 - s1.r10) * 100) + '** | **+' + r1((sc1.r20 - s1.r20) * 100) + '** | **+' + r1((sc1.r30 - s1.r30) * 100) + '** |');
log('Sans V6 : +' + r1((sc0.r10 - s0.r10) * 100) + ' / +' + r1((sc0.r20 - s0.r20) * 100) + ' / +' + r1((sc0.r30 - s0.r30) * 100) + ' points (la correction est la même, aux intérêts près).');

log('\n### 24.7 Trajectoire année par année (central ; Md€/an ; effet net et solde à 42 % au bas / central / haut ; taux d\'équilibre central)');
log('| année | V6 brut (c) | V6 net b / c / h | solde à 42 % b / c / h | taux d\'équilibre (c) |'); log('|---|---|---|---|---|');
tr.forEach(function (r) { log('| ' + r.an + (JAL.indexOf(r.an) >= 0 ? ' **jalon**' : '') + ' | ' + sg(r.brut.central) + ' | ' + r1(r.net.bas) + ' / ' + r1(r.net.central) + ' / ' + r1(r.net.haut) + ' | ' + r1(r.solde.bas) + ' / ' + r1(r.solde.central) + ' / ' + r1(r.solde.haut) + ' | ' + pt(r.taux) + ' |'); });

log('\n### 24.8 Limites et ce que je ne sais pas (Claude, révisable ; V13468 à V13475)');
log('1. **Le signe du creux est robuste, son ampleur ne l\'est pas.** Au défavorable, l\'effet net est négatif toute la période (' + r1(E.v6Net('haut', 2060)) + ' Md€ en 2060) ; au favorable il se redresse dès ' + (function () { var y; for (y = 2029; y <= 2070; y++) if (E.solde('bas', y) - D.solde('bas') > 0) return y; return null; })() + '. Le paramètre qui décide est `passageLibre` (aucune étude d\'un départ libre à 60 ans à coefficient neutre ; V12840-V12859).');
log('2. **Premier coût plein dès 2029 (V13473).** Le modèle de cohortes démarre le dispositif en 2028 avec une montée de 3 ans ; la première année du modèle (2029) porte déjà ' + r1(E.v6Net('central', 2029)) + ' Md€. Un démarrage différé (par exemple en 2030) décalerait le creux d\'autant d\'années, sans en changer la forme.');
log('3. **Recettes à 42 % partout (V13474)** : les recettes du dispositif (travail prolongé ou perdu) sont calculées à 42 %, quel que soit le taux d\'équilibre cherché ; l\'écart est inférieur à 0,2 Md€ par point de taux.');
log('4. **Croisière en 2060 (V13475)** : l\'effet continue de monter jusqu\'en 2070 avec l\'espérance de vie (' + sg(c70.net) + ' Md€), et le modèle ne va pas au-delà ; le taux de croisière de ' + pt(cr.taux) + ' est donc un taux « de 2060 », pas un régime stationnaire.');
log('5. **S04 et S05** : le recoupement avec V6 est argumenté par la couverture des départs (tous régimes), non démontré ligne à ligne (V13470) ; si V6 ne couvrait pas ces actifs, la réserve de +2,45 Md€ s\'ajouterait à partir de 2039.');
log('6. **Pensions comme masse fixe (voie R)** : le modèle garde 392 Md€ de pensions ; V6 s\'y ajoute par différence, sans effet sur l\'offre de travail des cotisants ni sur la pauvreté des retraités (non chiffrée dans le solde).');
log('7. **Objection (steelman)** : « vous comptez un dispositif qui coûte jusqu\'en 2047 pour justifier un taux plus bas après ; qui garantit qu\'un gouvernement futur ne supprimera pas le dispositif avant qu\'il ne rapporte ? » Réponse : rien ; le creux est le prix payé d\'avance, et le dispositif est le seul levier de plus de 3 Md€ du bilan. C\'est une décision de l\'auteur (arbitrage 1), prise en connaissance de ce creux.');
log('\nTemps de calcul du § 24 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');

// Export pour sources/calculs/bilan_global.py (copier dans MODELE_V56)
log('\n<!-- EXPORT_V56');
log('hp_v6=' + E.hautesPensionsV6() + ' ; hp_v55=' + E.hautesPensionsV55('central') + ' ; plancher_regime=' + SCS.map(function (s) { return E.plancherRegime(s); }).join(',') + ' ; point=' + pas + ' ; te55=' + te55 + ' ; cr_taux=' + cr.taux + ' ; cx_taux=' + cx.taux);
log('croisiere2060 : net=' + cr.net + ' ; solde=' + cr.solde + ' ; composantes=' + JSON.stringify(E.composantes('central', 2060)));
log('dette r10/r20/r30 sans, avec, brut : ' + [s0, s1, sb].map(function (a) { return [a.r10, a.r20, a.r30].join(','); }).join(' | ') + ' ; levierD : ' + [sc1.r10, sc1.r20, sc1.r30].join(','));
log('TRAJ=' + JSON.stringify(tr.map(function (r) { return [r.an, Math.round(r.brut.central * 1e4) / 1e4, Math.round(r.net.central * 1e4) / 1e4, Math.round(r.solde.central * 1e4) / 1e4, Math.round(r.taux * 1e5) / 1e5]; })));
log('-->');
