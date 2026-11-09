// § 20 de resultats-optimum.txt : option retraites_v6 recalculée avec les paramètres de comportement sourcés (04/11/2026 ; V12840-V12859). Ne modifie pas les § 1-19.
// Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js rapport_v6_0411.js >> resultats-optimum.txt
// Les valeurs « ancien » sont celles du § 16 (v5.1, avant le 04/11) : recopiées, car l'ancien paramétrage n'existe plus dans le code.
var Z = this.Optimum, F = this.Voies.fus, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function pc(x) { return (Math.round(x * 1000) / 10).toString().replace('.', ',') + ' %'; }
function trip(a) { return r1(a[0]) + ' / ' + r1(a[1]) + ' / ' + r1(a[2]); }
var SCS = ['bas', 'central', 'haut'], t0 = Date.now();
var VIEUX = {
  ageReference: { m2030: [0, 0, 0], m2040: [16.9, 7.4, 1.6], m2060: [69.5, 30.0, 6.9], taux: 0.407, dette: { bas: 0.532, central: 0.991, haut: 1.531 } },
  complet: { m2030: [-6.1, -21.4, -34.2], m2040: [28.5, -5.6, -26.5], m2060: [109.1, 26.7, -16.4], taux: 0.419, dette: { bas: 0.531, central: 1.052, haut: 1.639 } }
};
var NOMS = { ageReference: 'âge de référence indexé seul', complet: 'dispositif complet' };

log('\n## 20. Option « retraites_v6 » recalculée sur la v5.1 avec les paramètres de comportement sourcés (04/11/2026 ; V12840-V12859)');
log('**Ce que ce paragraphe fait.** Le § 16 branchait les montants de `modeles/retraites` calculés avec des paramètres de comportement sans source. Cette nuit, `sources/retraites-comportements.md` (V12430 et suivantes) les a remontés aux études ; leurs valeurs sont maintenant les défauts de `modeles/retraites/age_libre.js` (ce sont des faits de la littérature, pas des choix politiques : les mesures 11 à 16 ne changent pas). Les § 1 à 19 ne sont pas modifiés ; **« avant » = § 16 (v5.1)**, « après » = ce paragraphe. Ordre : favorable (bas) / central / défavorable (haut).');
log('Valeurs changées (ancien → nouveau, favorable / central / défavorable) : `passage` 1,0 / 0,8 / 0,6 → 0,8 / 0,5 / 0,33 ; `partEnEmploi` 0,75 / 0,65 / 0,5 → 0,75 / 0,50 / 0,35 ; `partPenibilite` 10 / 20 / 30 % → 5 / 10 / 20 % (part nette du droit actuel) ; coût de substitution vers chômage, invalidité et maladie : 0 → 10 / 20 / 30 % des gains de l\'âge de référence (nouveau terme du modèle). Inchangés : `contrepartie` (0 / 0,25 / 0,5), `passageLibre` (0,2 / 0,35 / 0,5 : **aucune étude** d\'un départ libre à 60 ans à coefficient neutre ; hypothèse assumée de symétrie), et la part en emploi des départs avancés (0,5, non retenue ici : 0,40 / 0,45 / 0,55 proposée par la note, à trancher).');

log('\n### 20.1 Solde public (Md€ de 2025 par an) : ancien → nouveau');
log('| année | âge de référence seul (avant) | âge de référence seul (après) | dispositif complet (avant) | dispositif complet (après) |'); log('|---|---|---|---|---|');
[['2030', 'm2030'], ['2040 (**valeur branchée**)', 'm2040'], ['2060', 'm2060']].forEach(function (p) {
  log('| ' + p[0] + ' | ' + trip(VIEUX.ageReference[p[1]]) + ' | ' + trip(Z.RETRAITES_V6.ageReference[p[1]]) + ' | ' + trip(VIEUX.complet[p[1]]) + ' | ' + trip(Z.RETRAITES_V6.complet[p[1]]) + ' |');
});
log('L\'âge de référence seul est net de la substitution (brut 2040 : 13,5 / 4,2 / 0,8). Source des montants : `modeles/retraites/resultats-age-reference.txt` § 6.');

log('\n### 20.2 Taux d\'équilibre (taux plat, central ; v5.1, recherche au dixième de point) et solde au taux de la v5');
var V5 = Z.archi(Z.ARCHITECTURE_V5), res = {};
log('| option | taux d\'équilibre avant → après | solde b / c / h au taux v5 (Md€), après |'); log('|---|---|---|');
['ageReference', 'complet'].forEach(function (m) {
  var s = Z.soldes(F(Z.ARCHITECTURE_V5, { retraitesV6: m })), t = Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: m }));
  res[m] = { s: s, t: t };
  log('| ' + NOMS[m] + ' | ' + pc(VIEUX[m].taux) + ' → **' + pc(t) + '** | ' + r1(s.bas) + ' / ' + r1(s.central) + ' / ' + r1(s.haut) + ' |');
});
log('Référence sans retraites : taux ' + pc(Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: 'aucune' }))) + '. Avant : l\'âge de référence seul abaissait le taux de 0,7 point ; après : de ' + r1((Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: 'aucune' })) - res.ageReference.t) * 100) + ' point. Le dispositif complet relève toujours le taux (avant +0,5 point ; après +' + r1((res.complet.t - Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: 'aucune' }))) * 100) + ' point, au dixième près).');

log('\n### 20.3 Dette à 10 ans (modeles/risques/stress.js, chemin « V5 », effet interpolé 2030-2040-2060)');
if (ST && ST.ARCHS.V5) {
  log('| option | dette/PIB à 10 ans bas / central / haut, avant | après |'); log('|---|---|---|');
  ['ageReference', 'complet'].forEach(function (m) {
    var d = {}; SCS.forEach(function (sc) { d[sc] = ST.test('V5', sc, { retraitesV6: m }).ratio10; });
    log('| ' + NOMS[m] + ' | ' + pc(VIEUX[m].dette.bas) + ' / ' + pc(VIEUX[m].dette.central) + ' / ' + pc(VIEUX[m].dette.haut) + ' | ' + pc(d.bas) + ' / **' + pc(d.central) + '** / ' + pc(d.haut) + ' |');
  });
  log('Référence sans retraites : 55,2 % / 100 % / 153,3 %.');
} else log('stress.js non chargé : dette non recalculée.');

log('\n### 20.4 Lecture, steelman et limites (Claude, révisable ; V12840 à V12859)');
log('1. **Le sourçage réduit surtout l\'âge de référence** : son effet central de 2040 passe de +7,4 à +3,4 Md€ (net de la substitution), car le passage de l\'âge de référence à l\'âge effectif tombe de 0,8 à 0,5 (Seibold, Manoli-Weber) et la part en emploi de 65 à 50 % (Rabaté-Rochut, Pays-Bas, Danemark). Pour l\'ensemble du dispositif, le central de 2040 bouge à peine (−5,6 → −5,9) : la pénibilité nette du droit actuel (20 → 10 %) compense presque l\'âge de référence.');
log('2. **Le signe ne change pas** : le dispositif complet reste déficitaire en 2040 au central (−5,9), excédentaire en 2060 (+20,1 au lieu de +26,7) ; la fourchette de 2040 se resserre (+25,7 à −24,0 au lieu de +28,5 à −26,5).');
log('3. **Objection (steelman)** : « vous avez ajusté à la baisse les rendements du dispositif ; qui dit que `passageLibre` n\'est pas faux dans l\'autre sens ? » Réponse : c\'est exactement le paramètre qui décide (± 0,15 = ± 7,6 Md€ en 2040) et il n\'a **aucune étude** ; il est gardé tel quel, documenté comme hypothèse assumée. La symétrie relèvement / abaissement d\'âge n\'est testée par aucune source.');
log('4. **Limites** : (i) la part en emploi des départs avancés (0,5) reste à son ancienne valeur ; la note propose 0,40 / 0,45 / 0,55 (V12430 et suivantes) ; (ii) la substitution est un terme ajouté au bilan de l\'âge de référence seulement (pas à l\'âge libre : l\'hypothèse de symétrie la ferait gagner ≈ 3,5 Md€ au central de 2040, `sensibilite_comportements.js`) ; (iii) le solde de 2040 est toujours posé tel quel sur un chiffrage « de croisière » (V10730) ; (iv) le § 16 et `rapport_v6.js` gardent le texte de l\'époque (« 20 % des départs », « +7,4 ») : le § 20 fait foi pour les valeurs.');
log('\nTemps de calcul du § 20 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
