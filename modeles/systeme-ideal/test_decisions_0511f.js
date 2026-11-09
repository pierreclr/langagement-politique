// Tests de la v5.6b (decisions_0511f.js) : ouverture progressive de l'âge libre du dispositif retraites V6 (options, sans changer le solde adopté de la v5.6). Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511e.js, de modele.js à decisions_0511e.js, puis) decisions_0511f.js test_decisions_0511f.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js test_decisions_0511f.js
// (attention : ../retraites/modele.js et modele.js sont deux fichiers différents)
var F = this.Decisions0511f, E = this.Decisions0511e, D = this.Decisions0511d, A = this.AgeLibre, TP = this.TaxePatrimoine;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'], V = ['a', 'b', 'c'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var avantErosion = TP.PARAM.central.erosionTop;
// 1. Calendriers d'ouverture : part f(k), k = année − 2027
var f = F.VARIANTES;
proche(f.a.f(1), 1 / 16, 1e-12, '(a) 2028 : un trimestre de 4 ans = 1/16'); proche(f.a.f(16), 1, 1e-12, '(a) complet après 16 ans'); proche(f.a.f(20), 1, 1e-12, '(a) plafonné à 1');
proche(f.b.f(1), 1 / 8, 1e-12, '(b) 2028 : un semestre de 4 ans = 1/8'); proche(f.b.f(8), 1, 1e-12, '(b) complet après 8 ans');
ok(f.c.f(4) === 0 && f.c.f(5) === 0.5 && f.c.f(9) === 0.5 && f.c.f(10) === 1, '(c) rien avant 5 ans, mi-chemin à 5 ans, complet à 10 ans');
ok(f.immediat.f(1) === 1 / 3 && f.immediat.f(3) === 1, 'référence : ouverture en 3 ans (celle de age_libre.js)');
V.concat(['immediat']).forEach(function (c) { var k, m = true; for (k = 1; k < 30; k++) if (f[c].f(k + 1) < f[c].f(k)) m = false; ok(m, 'part d\'ouverture croissante dans le temps (' + c + ')'); });
// 2. La référence est exactement la v5.6 adoptée
SC.forEach(function (sc) {
  [2029, 2040, 2060].forEach(function (y) { proche(F.ageLibre(sc, 'immediat', y), E.composantes(sc, y).ageLibre, 1e-9, 'âge libre recalculé = âge libre de la v5.6 (' + sc + ', ' + y + ')'); });
});
proche(F.creux('immediat').taux, E.creux().taux, 1e-12, 'taux maximal de la référence = 44,34 % de la v5.6'); ok(F.creux('immediat').an === 2029, 'référence : creux en 2029');
proche(F.lissage('immediat').manqueCumule, E.lissage().manqueCumule, 1e-9, 'manque cumulé de la référence = 237,9 de la v5.6'); ok(F.lissage('immediat').anneesDeficit === E.lissage().anneesDeficit, 'années de déficit de la référence = 19');
proche(F.jalonsDette('central', 'immediat').r10, E.jalonsDette('central', { v6: 'net' }).r10, 1e-9, 'dette à 10 ans de la référence = 109,5 % de la v5.6');
proche(F.croisiere('immediat').taux, E.croisiere().taux, 1e-12, 'croisière de la référence = 40,71 %');
// 3. Les options ne changent pas le solde adopté
proche(E.solde('central', 2060), D.solde('central') + E.v6Net('central', 2060), 1e-12, 'solde adopté de la v5.6 inchangé (module chargé, rien modifié)');
proche(E.creux().taux, 0.4434, 0.0001, 'v5.6 : taux maximal toujours 44,34 %');
// 4. Effets des variantes
V.forEach(function (c) {
  ok(F.net('central', c, 2028) === 0, 'avant 2029, aucun effet (' + c + ')');
  ok(F.net('central', c, 2029) > E.v6Net('central', 2029), 'creux de 2029 moins profond que la référence (' + c + ')');
  proche(F.net('central', c, 2060), E.v6Net('central', 2060), 3.0, 'à 2060 l\'effet net est proche de la référence (' + c + ', écart ≤ 3 Md€)');
  ok(F.net('central', c, 2060) <= E.v6Net('central', 2060) + 1e-9, 'à 2060 la croisière n\'est pas meilleure que la référence (' + c + ')');
  proche(F.net('central', c, 2070), E.v6Net('central', 2070), 0.5, 'à 2070 les trois ouvertures sont complètes : même effet que la référence (' + c + ')');
  var cx = F.creux(c); ok(cx.taux < E.creux().taux, 'taux maximal plus bas que 44,34 % (' + c + ')');
  ok(cx.taux > 0.42, 'mais toujours au-dessus de 42 % : aucune variante ne règle le creux (' + c + ')');
  proche(E.tauxPourSolde(0) , D.tauxEquilibreFin(), 0.00005, 'grille de taux inchangée');
  proche(D.solde('central', 0, F.creux(c).taux) + F.net('central', c, F.creux(c).an), 0, 0.001, 'taux d\'équilibre au pire : solde ≈ 0 à ce taux (' + c + ')');
});
SC.forEach(function (sc) { V.forEach(function (c) { ok(F.net(sc, c, 2029) > E.v6Net(sc, 2029) - 1e-9, 'creux de 2029 moins profond ou égal (' + c + ', ' + sc + ')'); }); });
ok(F.net('central', 'c', 2029) > 0 && F.ageLibre('central', 'c', 2029) === 0, '(c) : l\'attente de 5 ans supprime le coût de l\'âge libre en 2029 (effet net positif)');
ok(F.ageLibre('central', 'c', 2031) < 0, '(c) : le coût apparaît dès 2031 (les cohortes de 2032 partent avant leur année de référence : convention du modèle, H793)');
// ordre d'ouverture : plus c'est lent, plus le début est bon et le milieu cher
ok(F.net('central', 'a', 2030) > F.net('central', 'b', 2030) && F.net('central', 'b', 2030) > E.v6Net('central', 2030), '2030 : (a) > (b) > référence');
var la = F.lissage('a'), lb = F.lissage('b'), lc = F.lissage('c'), li = F.lissage('immediat');
ok(la.manqueCumule < li.manqueCumule && lb.manqueCumule < li.manqueCumule && lc.manqueCumule < li.manqueCumule, 'manque cumulé à 42 % plus faible que la référence (toutes les variantes)');
ok(la.anneesDeficit >= 15 && la.anneesDeficit <= 30 && lb.anneesDeficit >= 15 && lc.anneesDeficit >= 15, 'années de déficit à 42 % entre 15 et 30');
ok(la.premiere >= 2029 && la.manqueMax < li.manqueMax && lb.manqueMax < li.manqueMax, 'manque maximal annuel plus faible que la référence');
ok(F.creux('a').an > 2029 && F.creux('c').an > 2029, 'avec l\'ouverture progressive, le pire de l\'année est déplacé après 2029 (a, c)');
ok(F.tauxLisse('a', 2029, 2060) > E.croisiere().taux && F.tauxLisse('a', 2029, 2060) < F.creux('a').taux + 1e-9, 'taux lissé 2029-2060 entre croisière et taux maximal (a)');
// 5. Dette
V.forEach(function (c) { var j = F.jalonsDette('central', c), r = F.jalonsDette('central', 'immediat'); ok(j.serie.length === 42 && j.r10 < r.r10, 'dette à 10 ans plus basse que la référence (' + c + ')'); });
ok(F.jalonsDette('central', 'a').r10 > E.jalonsDette('central').r10, 'mais plus haute que sans dispositif V6 (a)');
ok(F.jalonsDette('bas', 'a').r10 < F.jalonsDette('central', 'a').r10 && F.jalonsDette('central', 'a').r10 < F.jalonsDette('haut', 'a').r10, 'dette à 10 ans : bas < central < haut (a)');
// 6. Qui attend
SC.forEach(function (sc) {
  var s = A.SCENARIOS_REF[{ bas: 'favorable', central: 'central', haut: 'defavorable' }[sc]];
  proche(F.quiAttend(sc, 'a', 2028).personnesM, s.passageLibre * A.DONNEES.cohorteAnnuelle, 1e-12, 'personnes concernées par cohorte = part passageLibre de 0,77 M (' + sc + ')');
});
proche(F.quiAttend('central', 'a', 2028).personnesM, 0.2695, 0.001, 'central : 0,27 M par cohorte');
proche(F.quiAttend('central', 'a', 2028).attenteAns, 3.75, 1e-9, '(a) cohorte 2028 : âge minimal 63,75, attente de 3,75 ans de plus qu\'à l\'ouverture complète');
proche(F.quiAttend('central', 'b', 2028).attenteAns, 3.5, 1e-9, '(b) cohorte 2028 : attente 3,5 ans'); proche(F.quiAttend('central', 'c', 2030).attenteAns, 4, 1e-9, '(c) cohorte 2030 : attente 4 ans');
ok(F.quiAttend('central', 'c', 2040).personnesM === 0 && F.quiAttend('central', 'a', 2043).personnesM === 0 && F.quiAttend('central', 'b', 2035).personnesM === 0, 'après l\'ouverture complète, plus personne n\'attend');
var ta = F.quiAttendTotal('central', 'a'), tb = F.quiAttendTotal('central', 'b'), tc = F.quiAttendTotal('central', 'c');
ok(ta.cohortes === 15 && tb.cohortes === 7 && tc.cohortes === 9, 'cohortes concernées : (a) 15, (b) 7, (c) 9 (2028 à 2042, 2034, 2036)');
ok(ta.attenteMoyenneAns > tb.attenteMoyenneAns - 1.5 && ta.personnesM > tb.personnesM && tc.attenteMaxAns === 4, 'ordres de grandeur du nombre de personnes et de l\'attente');
// 7. Pénibilité : droits dès 2029
[2029, 2030, 2040].forEach(function (y) { var p = F.penibilite('central', y); proche(p.coutMdE, E.composantes('central', y).penibilite, 1e-12, 'pénibilité inchangée (' + y + ')'); ok(p.ageMin === 60, 'pénibilité : départ possible dès 60 ans pour la cohorte de ' + y); });
ok(F.penibilite('central', 2029).coutMdE < 0, 'la pénibilité coûte dès 2029 (droits ouverts)');
ok(TP.PARAM.central.erosionTop === avantErosion, 'les paramètres d\'exil sont restaurés (aucun effet de bord)');
log('Tests v5.6b : ' + n + ' contrôles passés.');
