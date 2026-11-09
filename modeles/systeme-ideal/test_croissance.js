// Tests de croissance.js. Depuis ce dossier :
//   jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js test_croissance.js
var M = this.SystemeIdeal, P1 = this.Palier1, DG = this.DemographieSI, AS = this.AgeSante, C = this.Croissance;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st, SC = ['bas', 'central', 'haut'], PR = Object.keys(C.PRODUCTIVITE);

// Hypothèses sourcées
proche(C.PRODUCTIVITE.bas.g, 0.004, 1e-12, 'COR 2026 : variante basse 0,4 %');
proche(C.PRODUCTIVITE.central.g, 0.007, 1e-12, 'COR 2026 : référence 0,7 %');
proche(C.PRODUCTIVITE.haut.g, 0.010, 1e-12, 'COR 2026 : variante haute 1,0 %');
proche(C.PRODUCTIVITE.ia.g - C.PRODUCTIVITE.central.g, 0.007, 1e-12, 'variante IA médiane = central + 0,7 point (Banque de France, Aghion-Bunel)');
proche(C.PRODUCTIVITE.ia_bas.g - C.PRODUCTIVITE.central.g, 0.0007, 1e-12, 'variante IA basse = central + 0,07 point (Acemoglu)');
proche(C.PRODUCTIVITE.ia_haut.g - C.PRODUCTIVITE.central.g, 0.013, 1e-12, 'variante IA haute = central + 1,3 point (Aghion-Bunel)');
ok(C.PRODUCTIVITE.ia.g > C.PRODUCTIVITE.haut.g && C.PRODUCTIVITE.haut.g > C.PRODUCTIVITE.central.g && C.PRODUCTIVITE.central.g > C.PRODUCTIVITE.bas.g, 'ordre bas < central < haut < IA');
ok(C.PRODUCTIVITE.ia.source === 'ia', 'la variante IA est étiquetée « ia » (hypothétique)');

// Indice de productivité
proche(C.indiceProductivite('central', 2025), 1, 1e-12, 'indice 2025 = 1');
proche(C.indiceProductivite('central', 2045), Math.pow(1.007, 20), 1e-12, 'indice central 2045 = 1,007^20');
proche(C.indiceProductivite(0.01, 2065), Math.pow(1.01, 40), 1e-12, 'g numérique accepté : 1,01^40');
ok(C.indiceProductivite('ec', 2040) < C.indiceProductivite('haut', 2040), 'Commission : trajectoire lente jusqu\'en 2040 (0,3 % en 2030), sous 1 % cumulé');
ok(C.indiceProductivite('ec', 2065) > C.indiceProductivite('haut', 2065), 'Commission : au-dessus de 1 % cumulé en 2065 (1,5 % en 2040)');
var err = false; try { C.indiceProductivite('inconnu', 2030); } catch (e) { err = true; }
ok(err, 'scénario de productivité inconnu : erreur');

// g effectif
PR.forEach(function (p) { [2035, 2065].forEach(function (y) {
  proche(Math.pow(1 + C.gEffectif(p, y), y - 2025), C.indiceProductivite(p, y), 1e-9, 'g effectif ' + p + ' ' + y + ' : (1+g)^k = indice cumulé');
}); });
proche(C.gEffectif('central', 2025), 0, 0, 'g effectif en 2025 = 0');

// PIB = emploi × productivité
var v = DG.volumes('central', 2045), p45 = C.pib('central', 2045, 'central');
proche(p45.pib, M.DONNEES.pib * v.idx.emploi * Math.pow(1.007, 20), 1e-9, 'PIB 2045 central = PIB 2025 × indice d\'emploi × 1,007^20');
proche(C.pib('central', 2025, 'central').pib, M.DONNEES.pib, 1e-9, 'PIB 2025 = PIB du modèle');
ok(C.pib('central', 2065, 'haut').pib > C.pib('central', 2065, 'central').pib && C.pib('central', 2065, 'central').pib > C.pib('central', 2065, 'bas').pib, 'PIB 2065 : haut > central > bas');
ok(C.pib('central', 2065, 'ia').pib > C.pib('central', 2065, 'haut').pib, 'PIB 2065 : variante IA au-dessus du haut');
ok(C.pib('bas', 2065, 'central').pib > C.pib('haut', 2065, 'central').pib, 'à productivité égale, population jeune : PIB plus grand que population âgée en 2065');
ok(C.pib('central', 2065, 'central').croissanceMoyenne > 0 && C.pib('central', 2065, 'central').croissanceMoyenne < 0.007, 'croissance moyenne 2025-2065 du PIB central : positive mais sous la productivité (l\'emploi baisse)');

// Cohérence avec demographie.js (cas de base et variante B)
SC.forEach(function (sc) { [2035, 2045, 2065].forEach(function (y) {
  var c0 = C.combinaison(st, sc, y, { prod: 0, pensions: 'prix', reste: 'fige' });
  proche(c0.solde, DG.solde(st, sc, y).solde, 1e-6, 'productivité 0 : solde = cas de base du § 17, ' + sc + ' ' + y);
  proche(c0.soldeAvecSante, AS.solde(st, sc, y).avec, 1e-6, 'productivité 0 : solde avec santé = § 17.bis, ' + sc + ' ' + y);
}); });
var b = C.combinaison(st, 'central', 2065, { prod: 'haut', reste: 'fige' });
proche(b.solde, DG.solde(st, 'central', 2065, { g: 0.01 }).solde, 1e-6, '1 % = variante B du § 17 (central 2065 : +116), reste figé (ancien comportement)');
proche(b.solde, 122.3, 1, 'central 2065 à 1 % et pensions sur les prix : +122 Md€ (+116 avant le recalage H176)');
var cs = C.combinaison(st, 'central', 2065, { prod: 'haut', pensions: 'salaires', reste: 'fige' });
proche(cs.solde, -71.7, 1, 'central 2065 à 1 % et pensions sur les salaires : −72 Md€ (variante C ; −74 avant le recalage H176)');

// Sens des effets
[2035, 2045, 2065].forEach(function (y) {
  var s = function (pr, pe, so) { return C.combinaison(st, 'central', y, { prod: pr, pensions: pe, socle: so }).soldeAvecSante; };
  ok(s('haut', 'prix', 'prix') > s('central', 'prix', 'prix') && s('central', 'prix', 'prix') > s('bas', 'prix', 'prix'), 'plus de productivité : meilleur solde, ' + y);
  ok(s('central', 'salaires', 'prix') < s('central', 'prix', 'prix'), 'pensions sur les salaires : solde moins bon, ' + y);
  ok(s('central', 'prix', 'salaires') < s('central', 'prix', 'prix'), 'socle sur les salaires : solde moins bon, ' + y);
  ok(s('central', 'salaires', 'salaires') < s('central', 'salaires', 'prix'), 'socle ET pensions sur les salaires : encore moins bon, ' + y);
});
// socle sans indexation : g = 0 ne change rien
proche(C.combinaison(st, 'central', 2045, { prod: 0, socle: 'salaires' }).solde, C.combinaison(st, 'central', 2045, { prod: 0 }).solde, 1e-9, 'socle sur les salaires sans croissance : identique');
// socle finançable : pour le socle trouvé, le solde (recalculé) égale celui de 2025
var q = C.combinaison(st, 'central', 2045, { prod: 'central', pensions: 'prix', socle: 'salaires' }), o = C.options(2045, { prod: 'central', socle: 'salaires' });
var st2 = JSON.parse(JSON.stringify(st)); st2.socle = q.socleFinancable;
proche(q.socleFinancable, DG.socleFinancable(st, 'central', 2045, o), 1e-9, 'socle finançable de la combinaison = DG.socleFinancable');
ok(q.socleFinancableAvecSante < q.socleFinancable, 'socle finançable avec santé < sans santé');
ok(C.combinaison(st, 'haut', 2065, { prod: 'bas', pensions: 'salaires', socle: 'salaires' }).socleFinancableAvecSante >= 0, 'socle finançable jamais négatif');
proche(C.combinaison(st, 'central', 2025, { prod: 'ia', socle: 'salaires', pensions: 'salaires' }).socleFinancable, st.socle, 1e-9, '2025 : socle finançable = socle de départ');
// La productivité de l'IA change le socle finançable de plusieurs centaines d'euros
// (02/11/2026 : l'écart IA / central en 2065 passe de plus de 400 € à plus de 300 € une fois le reste du budget indexé ; l'ancien comportement garde plus de 400 €)
ok(C.combinaison(st, 'central', 2065, { prod: 'ia' }).socleFinancableAvecSante > C.combinaison(st, 'central', 2065, { prod: 'central' }).socleFinancableAvecSante + 300, 'variante IA : socle finançable 2065 supérieur de plus de 300 € au central (reste indexé)');
ok(C.combinaison(st, 'central', 2065, { prod: 'ia', reste: 'fige' }).socleFinancableAvecSante > C.combinaison(st, 'central', 2065, { prod: 'central', reste: 'fige' }).socleFinancableAvecSante + 400, 'variante IA, reste figé (ancien comportement) : plus de 400 € d\'écart');

// Poids des pensions dans le PIB
var pp = C.combinaison(st, 'central', 2025, { prod: 'central' });
proche(pp.pensionsSurPib, M.DONNEES.massePensions / M.DONNEES.pib, 1e-9, 'pensions / PIB 2025 = masse des pensions / PIB du modèle');
ok(C.combinaison(st, 'central', 2065, { prod: 'bas' }).pensionsSurPib > C.combinaison(st, 'central', 2065, { prod: 'haut' }).pensionsSurPib, 'pensions sur les prix : le poids dans le PIB baisse avec la productivité (COR : 16,1 % contre 14,5 %)');

// ---------- 02/11/2026 : reste du budget indexé (audit A1)
var an = C.combinaison(st, 'central', 2065, { prod: 'central', reste: 'fige' });
proche(an.soldeAvecSante, -43, 1, 'ancien comportement (reste figé) : central 2065 à 0,7 % = −43 Md€ (−47 publié le 01/11/2026, avant le recalage H176)');
proche(an.socleFinancableAvecSante, 803, 2, 'ancien comportement : socle finançable 2065 = 803 € (800 avant le recalage H176)');
var nv = C.combinaison(st, 'central', 2065, { prod: 'central' });
proche(nv.soldeAvecSante, -157, 1.5, 'reste indexé sur le PIB (défaut) : central 2065 à 0,7 % = −157 Md€ (−162 avant le recalage H176)');
proche(nv.socleFinancableAvecSante, 513, 3, 'reste indexé sur le PIB : socle finançable 2065 = 513 €');
proche(C.combinaison(st, 'central', 2065, { prod: 'central', reste: 'productivite' }).soldeAvecSante, -178.7, 1.5, 'reste indexé sur la productivité seule : −179 Md€ (estimation de l\'audit du 01/11 : ≈ −183, avant le recalage H176)');
proche(C.combinaison(st, 'central', 2065, { prod: 'central', reste: 'productivite' }).socleFinancableAvecSante, 459, 3, 'reste indexé sur la productivité seule : socle 459 € (audit : ≈ 459)');
var dd = DG.solde(st, 'central', 2045, { g: C.gEffectif('central', 2045), reste: 'pib' });
proche(dd.variations.reste, dd.resteNiveau * (DG.volumes('central', 2045).idx.emploi * Math.pow(1.007, 20) - 1), 1e-9, 'variation du reste = reste 2025 × (indice d\'emploi × productivité − 1)');
proche(dd.resteNiveau, -384.0, 0.2, 'reste du budget 2025 (palier 1 central) = −384 Md€ (audit : −384,3 avant V11770, RSA à 1,84 M)');
ok(nv.soldeAvecSante < an.soldeAvecSante, 'indexer le reste du budget (déficit net) aggrave le solde en euros');
// avec g = 0 et reste 'productivite' : rien ne change
proche(C.combinaison(st, 'central', 2045, { prod: 0, reste: 'productivite' }).solde, DG.solde(st, 'central', 2045).solde, 1e-9, 'sans productivité, reste « productivité » = ancien comportement');
var err2 = false; try { DG.solde(st, 'central', 2045, { reste: 'x' }); } catch (e) { err2 = true; }
ok(err2, 'option reste inconnue : erreur');
// effet de l'âge indexé sur la productivité avec le reste
var a1 = AS.solde(st, 'central', 2065, { g: 0.01, reste: 'pib' }), a0 = AS.solde(st, 'central', 2065, { g: 0.01 });
proche(a1.effet, a0.effet * Math.pow(1.01, 40), 1e-9, 'effet de santé et dépendance : × (1+g)^k quand le reste est indexé');
proche(AS.solde(st, 'central', 2065).effet, AS.solde(st, 'central', 2065, { reste: 'pib' }).effet, 1e-9, 'sans productivité, l\'effet de l\'âge ne change pas');

// ---------- Pensions calées sur le COR (audit A3)
proche(DG.relativeCOR(2025), 1, 1e-12, 'pension relative COR : indice 2025 = 1');
proche(DG.relativeCOR(2070), 45.3 / 54.6, 1e-12, 'pension relative COR : 45,3 / 54,6 en 2070');
proche(DG.relativeCOR(2090), 45.3 / 54.6, 1e-12, 'pension relative COR : constante après 2070');
[2035, 2045, 2065].forEach(function (y) {
  var f = function (pe) { return C.combinaison(st, 'central', y, { prod: 'central', pensions: pe }).soldeAvecSante; };
  ok(f('salaires') < f('cor') && f('cor') < f('prix'), 'pensions COR entre les salaires et les prix, ' + y);
});
proche(C.combinaison(st, 'central', 2065, { prod: 'central', pensions: 'cor' }).massePensions / C.combinaison(st, 'central', 2065, { prod: 'central', pensions: 'salaires' }).massePensions, (0.546 + (0.453 - 0.546) * 40 / 45) / 0.546, 1e-9, 'masse des pensions COR / salaires = pension relative interpolée en 2065 (0,849)');
proche(DG.facteurPensions('prix', 0.01, 2065), 1, 1e-12, 'facteur de pensions : prix = 1');

// ---------- Dette et intérêts (audit A2)
var T = C.DETTE;
proche(T.dette2025, 3460.5, 1e-9, 'dette de départ : 3 460,5 Md€ fin 2025 (Insee Première n° 2106)');
proche(T.pibInsee2025, 3460.5 / 1.157, 1e-9, 'PIB 2025 déduit du ratio Insee (115,7 %)');
proche(T.tauxApparent2025, 65.721 / 3306.1, 1e-12, 'taux apparent 2025 = intérêts 2025 / dette fin 2024');
proche(T.tauxApparent2025 * 100, 1.99, 0.01, 'taux apparent 2025 ≈ 1,99 %');
ok(C.TAUX.bas.r < C.TAUX.central.r && C.TAUX.central.r < C.TAUX.haut.r, 'taux de marché : bas < central < haut');
ok(C.TAUX.haut.r <= 0.0450 && C.TAUX.bas.r >= 0.0337, 'taux de marché entre la moyenne 2025 (3,37 %) et le dernier point publié (4,44 %, arrondi à 4,5 %)');
proche(C.tauxApparent('central', 2025), T.tauxApparent2025, 1e-12, 'taux apparent : 2025 = point de départ');
ok(C.tauxApparent('central', 2026) > C.tauxApparent('central', 2025) && C.tauxApparent('central', 2065) < C.TAUX.central.r && C.tauxApparent('central', 2065) > C.tauxApparent('central', 2045), 'taux apparent : croît vers le taux de marché sans le dépasser');
proche(C.tauxApparent('central', 2026), T.tauxApparent2025 + (0.04 - T.tauxApparent2025) / 8.5, 1e-12, 'taux apparent : un pas = 1 / maturité (8,5 ans)');
proche(C.tauxApparent(0.05, 2026), T.tauxApparent2025 + (0.05 - T.tauxApparent2025) / 8.5, 1e-12, 'taux numérique accepté');
var ch = C.chemin(st, 'central', { prod: 'central', taux: 'central' }, 2065);
ok(ch.length === 41 && ch[0].dette === 3460.5, 'chemin : 41 années (2025-2065), dette initiale 3 460,5');
var okRec = true, prev;
ch.forEach(function (l, i) {
  if (i === 0) return; prev = ch[i - 1];
  if (Math.abs(l.interets - l.taux * prev.dette / 1.02) > 1e-9) okRec = false;
  if (Math.abs(l.soldeTotal - (l.soldePrimaire - l.interets)) > 1e-9) okRec = false;
  if (Math.abs(l.dette - (prev.dette / 1.02 - l.soldeTotal)) > 1e-9) okRec = false;
});
ok(okRec, 'chemin : intérêts = taux × dette précédente / (1+inflation) ; solde = primaire − intérêts ; dette = dette précédente / (1+inflation) + déficit');
proche(ch[1].interets, 75.5, 1.5, '2026 : intérêts du central ≈ 75 Md€ (60,1 en 2024 et 65,7 en 2025 observés, 72,4 pour l\'État seul au PLF 2027)');
ok(ch[1].interets > T.interets2025, 'intérêts de 2026 au-dessus de ceux de 2025 observés');
// la valeur 2024 incluse dans le déficit de départ est bien retirée du primaire
proche(ch[1].soldePrimaire - ch[1].soldeHorsInterets, T.interets2024 * C.pib('central', 2026, 'central').indice, 1e-9, 'solde primaire = solde du modèle + intérêts de 2024 inclus dans le déficit de départ, × indice du PIB (relecture du 01/11, D2 : sans cela le reste du budget indexé porte un intérêt fantôme)');
proche(ch[40].soldePrimaire - ch[40].soldeHorsInterets, T.interets2024 * C.pib('central', 2065, 'central').indice, 1e-9, 'même relation en 2065 : intérêt fantôme nul');
var chFige = C.chemin(st, 'central', { prod: 'central', taux: 'central', reste: 'fige' }, 2065)[40];
proche(chFige.soldePrimaire - chFige.soldeHorsInterets, T.interets2024, 1e-9, 'reste figé : intérêts de 2024 non indexés (ancien comportement)');
// cohérence combinaison / chemin
var cb = C.combinaison(st, 'central', 2045, { prod: 'central', taux: 'central' }), l45 = ch[20];
proche(cb.dette, l45.dette, 1e-9, 'combinaison : dette = chemin');
proche(cb.soldeTotal, l45.soldeTotal, 1e-9, 'combinaison : solde total = chemin');
proche(cb.detteSurPib, l45.detteSurPib, 1e-9, 'combinaison : dette/PIB = chemin');
ok(cb.soldeTotal < cb.soldeAvecSante, '2045 : le solde avec intérêts est plus mauvais que le solde aux intérêts de 2024 figés');
ok(cb.socleFinancableTotal <= cb.socleFinancableAvecSante, 'socle finançable avec intérêts ≤ sans');
proche(C.combinaison(st, 'central', 2025, { prod: 'central', taux: 'central' }).detteSurPib, 1.157, 1e-9, '2025 : dette/PIB = 115,7 %');
// sens
[2035, 2045, 2065].forEach(function (y) {
  var d = function (pr, tx, pe) { return C.combinaison(st, 'central', y, { prod: pr, taux: tx, pensions: pe || 'prix' }).detteSurPib; };
  ok(d('central', 'bas') < d('central', 'central') && d('central', 'central') < d('central', 'haut'), 'dette/PIB : taux bas < central < haut, ' + y);
  ok(d('haut', 'central') < d('central', 'central') && d('central', 'central') < d('bas', 'central'), 'dette/PIB : plus de productivité, moins de dette, ' + y);
  ok(d('central', 'central', 'prix') < d('central', 'central', 'cor') && d('central', 'central', 'cor') < d('central', 'central', 'salaires'), 'dette/PIB : pensions prix < COR < salaires, ' + y);
});
// la démographie haute alourdit la dette
ok(C.combinaison(st, 'haut', 2065, { prod: 'central', taux: 'central' }).detteSurPib > C.combinaison(st, 'bas', 2065, { prod: 'central', taux: 'central' }).detteSurPib, 'dette/PIB 2065 : population âgée > population jeune');
// valeurs de référence (central)
proche(C.combinaison(st, 'central', 2035, { prod: 'central', taux: 'central' }).detteSurPib, 1.485, 0.01, 'dette/PIB 2035 central ≈ 148 % (151 % avant la correction du double compte des intérêts de 2024)');
proche(C.combinaison(st, 'central', 2045, { prod: 'central', taux: 'central' }).detteSurPib, 1.962, 0.02, 'dette/PIB 2045 central ≈ 196 % (203 % avant la correction)');
proche(C.combinaison(st, 'central', 2065, { prod: 'central', taux: 'central' }).detteSurPib, 3.292, 0.02, 'dette/PIB 2065 central ≈ 329 % (343 % avant la correction du double compte des intérêts de 2024, 350 % avant le recalage H176)');
proche(C.combinaison(st, 'central', 2065, { prod: 'central', taux: 'central' }).soldeTotal, -556, 6, 'solde total 2065 central avec intérêts ≈ −556 Md€ (−592 avant la correction du double compte, −605 avant le recalage H176)');
// sans option taux : pas de champ dette
ok(C.combinaison(st, 'central', 2045, { prod: 'central' }).dette === undefined, 'sans option taux : aucun champ de dette (ancien comportement)');
// seuils
proche(C.seuil(st, 'central', 2065, { pensions: 'prix', reste: 'fige' }, 'solde'), 0.0038, 0.0002, 'seuil de productivité, ancien comportement : 0,38 %');
proche(C.seuil(st, 'central', 2065, { pensions: 'prix' }, 'solde'), 0.0067, 0.0003, 'seuil de productivité, reste indexé : 0,67 %');
proche(C.seuil(st, 'central', 2065, { pensions: 'prix' }, 'primaire'), 0.0060, 0.0003, 'seuil sur le solde primaire (sans intérêts, intérêts de 2024 indexés avec le reste) : 0,60 %, sous le seuil sur le solde (0,67 %) qui garde un intérêt fantôme');
proche(C.seuil(st, 'central', 2065, { pensions: 'prix', taux: 'central' }, 'solde'), 0.0151, 0.0005, 'seuil sur le solde total avec intérêts : 1,51 % (1,73 % avant la correction)');
proche(C.seuil(st, 'central', 2065, { pensions: 'prix', taux: 'central' }, 'dette'), 0.0166, 0.0005, 'seuil de stabilisation de la dette/PIB (2065 ≤ 2025) : 1,66 % (1,86 % avant la correction)');
ok(C.seuil(st, 'central', 2065, { pensions: 'salaires' }, 'solde') === null, 'pensions sur les salaires : aucun seuil de productivité ≤ 5 %');

// Grille, pureté
var avant = JSON.stringify(st), g1 = C.grille(st), g2 = C.grille(st);
ok(g1.length === 3 * PR.length * 2 * 2 * 3, 'grille : 3 démographies × ' + PR.length + ' productivités × 2 × 2 × 3 années = ' + g1.length);
ok(JSON.stringify(g1) === JSON.stringify(g2) && JSON.stringify(st) === avant, 'fonctions pures : mêmes résultats, entrée inchangée');
ok(g1.every(function (r) { return isFinite(r.solde) && isFinite(r.soldeAvecSante) && isFinite(r.pib) && r.pib > 0 && r.socleFinancableAvecSante >= 0; }), 'grille : toutes les valeurs finies, PIB > 0, socle ≥ 0');
log('\n' + n + ' contrôles réussis');
