// Tests de fiscalite_actuelle.js. Depuis la racine du dépôt :
//   jsc modeles/systeme-ideal/modele.js modeles/systeme-ideal/fiscalite_actuelle.js modeles/systeme-ideal/test_fiscalite_actuelle.js
var FA = this.FiscaliteActuelle, M = this.SystemeIdeal;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + Math.round(a * 100) / 100 + ', attendu ' + Math.round(b * 100) / 100 + ' ± ' + tol + ')'); }
// Barème des revenus 2025 (service-public.gouv.fr F34328) : 1 part, 30 000 € imposables = 0,11 × 17 979 + 0,30 × 421 = 2 103,7 €, au-dessus du seuil de décote (1 982 €)
proche(FA.irAn(30000, 1, 0), 0.11 * (29579 - 11600) + 0.30 * (30000 - 29579), 1e-6, 'IR d\'une part à 30 000 € : 2 103,7 € (sans décote)');
// Décote : seuil d'impôt brut 1 982 € (seul) et 3 277 € (couple), publié par service-public.gouv.fr
proche(FA.DECOTE.seul / FA.DECOTE.taux, 1982, 1, 'décote seul : s\'éteint à 1 982 € d\'impôt brut');
proche(FA.DECOTE.couple / FA.DECOTE.taux, 3277, 1, 'décote couple : s\'éteint à 3 277 € d\'impôt brut');
proche(FA.irAn(20000, 1, 0), 924 - (897 - 0.4525 * 924), 1e-6, 'IR à 20 000 € imposables, une part : 0,11 × 8 400 = 924 € brut ; décote 897 − 0,4525 × 924 = 479 € ⇒ 445 €');
// Abattement de 10 % : plafond 14 555 €, minimum 509 €
proche(FA.baseImposableSalaire(15000) , 12 * 15000 * (1 + 0.029 * 0.9825 / 0.78) - 14555, 1e-6, 'cadre à 15 000 € nets : abattement plafonné à 14 555 €');
proche(FA.baseImposableSalaire(1500) / (12 * 1500), 0.9327, 0.001, 'salaire modeste : base ≈ 93,3 % du net (abattement de 10 % non plafonné)');
// Cadre à 8 000 € nets
proche(FA.irSalarieSeul(8000), 20519, 5, 'IR d\'un cadre à 8 000 € nets : ≈ 20 519 €/an (et non 19 400 de mémoire)');
proche(FA.netApresIR(8000), 8000 - FA.irSalarieSeul(8000) / 12, 1e-9, 'net après IR = net − IR/12');
// Coût employeur : table T14, ratio constant au-delà de 5 601 € de brut
proche(FA.coutEmployeurDepuisNet(1867.02 * 0.78), M.DONNEES.coutSelonBrut[0][1], 1e-6, 'Smic : coût employeur 1 987,76 € (table T14)');
proche(FA.coutEmployeurDepuisNet(5601.06 * 0.78), 8034.02, 1e-6, 'dernier point de la table : 8 034,02 €');
proche(FA.coefficientCout(8000), 8034.02 / 5601.06 / 0.78, 1e-9, 'coefficient coût / net au-delà de la table : 1,839');
proche(FA.coutEmployeurDepuisNet(8000), 14712, 1, 'cadre à 8 000 € nets : coût employeur 14 712 € (1,825 × 8 000 = 14 600 de mémoire)');
log('\n' + n + ' contrôles au vert (fiscalite_actuelle)');
