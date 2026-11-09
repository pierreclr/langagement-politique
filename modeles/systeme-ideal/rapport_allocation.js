// § 11 de resultats-optimum.txt : « Allocation unique dégressive ? » (03/11/2026, H590-H599). Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 10) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js optimum.js rapport_allocation.js
var Z = this.Optimum, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { var v = Math.round(x); return (v > 0 ? '+' : '') + v.toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function pc(x) { return (Math.round(x * 1000) / 10).toString().replace('.', ',') + ' %'; }
var t0 = Date.now();
var V = [
  { nom: 'v2 (prime gardée, versée automatiquement)', f: Z.ficheAllocation(Z.ARCHITECTURE_V2), alpha: '—' },
  { nom: 'α = 15 %, majoration 250 €', f: Z.ficheAllocation(Z.allocationUnique(0.15)), alpha: 15 },
  { nom: 'α = 20 %, majoration 250 €', f: Z.ficheAllocation(Z.allocationUnique(0.20)), alpha: 20 },
  { nom: 'α = 25 %, majoration 250 €', f: Z.ficheAllocation(Z.allocationUnique(0.25)), alpha: 25 },
  { nom: 'α = 30 %, majoration 250 €', f: Z.ficheAllocation(Z.allocationUnique(0.30)), alpha: 30 }
];
[0.15, 0.20, 0.25, 0.30].forEach(function (al) {
  var a = Z.allocationProtegee(al); V.push({ nom: 'α = ' + Math.round(al * 100) + ' %, majoration protectrice', f: a ? Z.ficheAllocation(a, a.tPlat) : { tPlat: null }, alpha: Math.round(al * 100) });
});
var as = Z.allocationProtegee(0.25, 10); V.push({ nom: 'α = 25 %, majoration protectrice, seuil de 10 h', f: as ? Z.ficheAllocation(as, as.tPlat) : { tPlat: null }, alpha: 25 });
var W = V.filter(function (v) { return v.f.tPlat !== null; });
function pire3(f) { var m = 0, k; for (k in f.cas) if (['smic_seul', 'couple_1smic_2enf', 'parent_isole_smic', 'retraite_aspa_loc'].indexOf(k) >= 0) m = Math.min(m, f.cas[k].ecartMois); [0, 1, 2].forEach(function (i) { m = Math.min(m, f.deciles[i].ecart); }); return m; }

log('## 11. Allocation unique dégressive ? Supprimer la prime d\'activité (03/11 ; H590-H599)');
log('Proposition de l\'auteur : un seul montant garanti (plancher de 877 € pour une personne seule ; montants famille du modèle) et, pour qui travaille, une allocation unique dégressive : complément = plancher − socle − α × revenu d\'activité net, toujours ≥ 0, avec α < taux plat pour que le travail paie. Base : architecture v2 (§ 9) SANS prime d\'activité (`ppaMaintenue: 0`) ; le complément est la sortie du plancher « α » du § 8 (`sortiePlancher: \'alpha\'`). Pour chaque variante, le taux plat est le plus petit, au dixième de point, qui équilibre le central (H582). « Majoration 250 € » = celle de la v2 ; « majoration protectrice » = la plus petite (pas de 10 €) qui tient la contrainte (3) élargie (H595). Coût = prime d\'activité + complément de plancher (Md€/an, dépense calibrée sur les 10,65 Md€ observés, non-recours actuel compris ; H566).');

log('\n### 11.1 Taux plat d\'équilibre, coût, soldes, règles');
log('| variante | taux plat | coût protection d\'activité (bas / central / haut) | solde bas / central / haut | règles et exceptions | contrainte (3) : pire perte (€/mois) | surcoût à recours de 100 % |');
log('|---|---|---|---|---|---|---|');
V.forEach(function (v) {
  var f = v.f; if (f.tPlat === null) { log('| ' + v.nom + ' | pas d\'équilibre ≤ 60 % ou aucune majoration ≤ 600 € ne protège | | | | | |'); return; }
  log('| ' + v.nom + ' | ' + pc(f.tPlat) + ' | ' + r1(f.cout.bas) + ' / ' + r1(f.cout.central) + ' / ' + r1(f.cout.haut) + ' | ' + r1(f.soldes.bas) + ' / ' + r1(f.soldes.central) + ' / ' + r1(f.soldes.haut) + ' | ' + f.regles.total + ' | ' + (pire3(f) < -0.5 ? r0(pire3(f)) : 'aucune') + ' | ' + r1(f.surcoutRecours) + ' Md€ (+' + r1(f.tauxSupplRecours) + ' pt de taux) |');
});
log('Contrainte (2) non tenue partout, comme dans les §§ 2, 7, 9 et 10 (haut à −4,8 / −5,0 % du PIB). Règles : la v2 en compte 16 (prime d\'activité à 8 paramètres comprise) ; sans prime, le complément α est une règle à un paramètre : ' + W[1].f.regles.total + '. Non-recours : supposé nul si le versement est automatique (la dépense observée de 10,65 Md€ l\'inclut ; la colonne donne le surcoût d\'un recours de 100 %, la v2 le subit aussi si elle est automatisée, ⚠️ V8500).');

log('\n### 11.2 Cas types (€/mois, écart au droit actuel, central, au taux de la ligne)');
log('| variante | smicard | mi-temps au Smic | 10 h/semaine | couple 1 Smic | parent isolé Smic | RSA (seul) |');
log('|---|---|---|---|---|---|---|');
W.forEach(function (v) { var f = v.f; log('| ' + v.nom + ' | ' + r0(f.cas.smic_seul.ecartMois) + ' | ' + r0(f.ptMiTemps.gain) + ' | ' + r0(f.pt10h.gain) + ' | ' + r0(f.cas.couple_1smic_2enf.ecartMois) + ' | ' + r0(f.cas.parent_isole_smic.ecartMois) + ' | ' + r0(f.cas.rsa_seul.ecartMois) + ' |'); });
log('Mi-temps au Smic et 10 h/semaine : personne seule locataire (zone 2), revenu du système proposé moins revenu du droit actuel (atlas OpenFisca 2026), au taux de la ligne (H597).');

log('\n### 11.3 Dixièmes de niveau de vie (€/UC/mois, central)');
log('| variante | ' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (d) { return 'D' + d; }).join(' | ') + ' |');
log('|---|' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function () { return '---'; }).join('|') + '|');
W.forEach(function (v) { log('| ' + v.nom + ' | ' + v.f.deciles.map(function (d) { return r0(d.ecart); }).join(' | ') + ' |'); });

log('\n### 11.4 Taux marginal effectif de la personne seule (0 à 2 Smic) et maximum des trois ménages');
log('| variante | 0,1 | 0,25 | 0,5 | 0,75 | 1 | 1,25 | 1,5 | 2 Smic | max seul (à x Smic) | max seul / parent / couple |');
log('|---|---|---|---|---|---|---|---|---|---|---|');
W.forEach(function (v) { var f = v.f, t = f.tmeMax; log('| ' + v.nom + ' | ' + f.courbe.map(function (k) { return pc(k.tme); }).join(' | ') + ' | ' + pc(t.seul.tme) + ' (' + t.seul.x.toString().replace('.', ',') + ') | ' + pc(t.seul.tme) + ' / ' + pc(t.parent.tme) + ' / ' + pc(t.couple.tme) + ' |'); });
log('Droit actuel : TME maximal de 131 % vers 0,4 Smic (§ 8).');

log('\n### 11.5 Offre de travail : variation d\'emploi contre le droit actuel (η = 0,4 ; H567 ; ordre de grandeur)');
log('| variante | seul 10 h | seul 0,25 Smic | seul 0,5 Smic | seul 1 Smic | parent 0,25 | parent 0,5 | couple 0,25 | couple 0,5 |');
log('|---|---|---|---|---|---|---|---|---|');
W.forEach(function (v) { var p = v.f.participation; function s(x) { return r0(x * 100) + ' %'; } log('| ' + v.nom + ' | ' + s(v.f.part10h) + ' | ' + s(p.seul[0]) + ' | ' + s(p.seul[1]) + ' | ' + s(p.seul[2]) + ' | ' + s(p.parent[0]) + ' | ' + s(p.parent[1]) + ' | ' + s(p.couple[0]) + ' | ' + s(p.couple[1]) + ' |'); });
log('Masse salariale (central, écart au droit actuel, module d\'offre de travail ; ne s\'additionne pas à la participation) : ' + W.map(function (v, i) { return ['v2', 'α 15 %', 'α 20 %', 'α 25 %', 'α 30 %', 'α 15 % prot.', 'α 20 % prot.', 'α 25 % prot.', 'α 25 % prot. seuil 10 h'][i] + ' ' + pc(v.f.masse.ecartTotal); }).join(' ; ') + '.');
log('\n### 11.6 Lecture et conclusion (Claude, révisable)');
log('1. **Règles** : 16 → 15 règles et exceptions, mais surtout 8 paramètres de prime d\'activité (barème familial, demande à la CAF) remplacés par 1 (α) : la même formule sert au sans-emploi (α n\'intervient pas) et au travailleur.');
log('2. **À majoration inchangée (250 €), aucune variante ne tient la contrainte (3)** : le plancher du parent isolé (1 300 €) est déjà atteint par socle + majoration + prestations familiales (1 250 €), donc le complément est nul et le parent isolé au Smic perd 158 à 179 €/mois (la prime d\'activité lui en versait ≈ 180). Il faut soit monter la majoration (340 à 350 €, pour α de 15 à 25 %), soit relever le plancher des familles (non modélisé).');
log('3. **α = 30 % ne protège pas le smicard seul** (−3 €) et aucune majoration n\'y change rien ; α ≤ 25 % le protège (+48 à +156 €). Plus α est bas, plus la protection monte et plus le coût monte : 25,1 / 20,0 / 16,2 Md€ à 15 / 20 / 25 % contre 17,1 Md€ pour la prime d\'activité de la v2 (+ la sortie « plat »).');
log('4. **La plus simple qui protège le smicard et le parent isolé : α = 25 %, majoration 340 €, taux plat 41,1 %** : coût 16,2 Md€ (v2 : 17,1), solde +113,1 / +0,8 / −144,3 (v2 : +111,6 / +1,1 / −143,4), TME maximal de 66 % (v2 : 83 %, droit actuel : 131 %), smicard +48 (v2 +46), mi-temps au Smic +100 (v2 +167), 10 h/semaine −14 (v2 +82), parent isolé +10 (v2 +16). **Le prix : le couple avec un Smic passe de +267 à +39 € et la participation à très temps partiel disparaît** (0 % à 0,25 Smic contre +13 %, parent isolé +12 % contre +31 %), parce que le TME est plat à 56 % là où la prime d\'activité le baissait à 39 % sous 0,4 Smic.');
log('5. **Seuil de 10 h** (complément maintenu sous 10 h/semaine, dégressif au-delà) : coût −1,4 Md€ (14,8), mais TME de 100 % sous 10 h (le travail ne paie pas) et participation à 0,25 Smic qui s\'effondre ; il faudrait un bonus au franchissement du seuil pour que le seuil crée un gain plutôt qu\'une perte (non modélisé). Je ne le recommande pas.');
log('6. **Non-recours** : supposé nul avec versement automatique ; la v2 aussi si elle est automatisée. Le surcoût d\'un recours de 100 % (8,3 Md€ pour α = 25 %, 8,8 pour la v2, dépense observée ÷ 66 %) pèse pareil sur les deux : il ne départage rien.');
log('7. **Limites** : le coût du complément est calculé pour la seule personne seule puis calé sur la dépense observée de la prime d\'activité (k ≈ 0,21 ; H566, ⚠️ V8201) : il ne voit ni les couples ni les familles (leur complément s\'étend plus haut), donc il est sous-estimé pour α bas ; le couple avec un Smic est protégé jusqu\'à α = 25 % seulement.');
log('\nTemps de calcul du § 11 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
