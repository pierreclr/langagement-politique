// § 25 de resultats-optimum.txt : v5.6b, ouverture progressive de l'âge libre (options chiffrées ; 05/11/2026 ; H793-H798, V13491-V13497). Ne modifie pas les § 1-24 ni le solde adopté.
// Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 24) :
//   jsc <liste de test_decisions_0511f.js, de modele.js à decisions_0511f.js> rapport_decisions_0511f.js >> resultats-optimum.txt
var F = this.Decisions0511f, E = this.Decisions0511e, D = this.Decisions0511d;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function sg(x) { return (x > 0.05 ? '+' : '') + r1(x); }
function pt(x) { return (Math.round(x * 10000) / 100).toFixed(2).replace('.', ',') + ' %'; }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',').replace('-', '−') + ' %'; }
var t0 = Date.now(), C = F.CLES, SCS = ['bas', 'central', 'haut'], JAL = F.JALONS, pas = E.pointDeTaux();
var R = {};
C.forEach(function (c) { R[c] = { cx: F.creux(c), l: F.lissage(c), cr: F.croisiere(c), d: F.jalonsDette('central', c), tl: F.tauxLisse(c, 2029, 2060) }; });
function nom(c) { return F.VARIANTES[c].nom; }

log('\n## 25. v5.6b (décision du 05/11) : ouverture progressive de l\'âge libre : trois calendriers chiffrés comme OPTIONS (H793-H798, V13491-V13497)');
log('**Ce que ce paragraphe fait.** L\'auteur veut que l\'âge libre du dispositif V6 s\'ouvre par paliers (l\'âge minimal de départ baisse de 64 vers 60 ans) au lieu de s\'ouvrir d\'un coup, la pénibilité restant en vigueur dès le départ, pour réduire le creux de 2029 à 2047. Module : `decisions_0511f.js` ; test : `test_decisions_0511f.js` ; hypothèses : `methode.md` § 41. **Rien n\'est adopté** : le solde, le taux et le bilan de la v5.6 (§ 24) sont inchangés ; ce sont des options, l\'auteur choisit. Le comportement de départ du modèle est conservé (cohorte de 0,77 M par an, décalage moyen = part « passage » × (64 − âge minimal ouvert), coefficient neutre à 0,7 %, recettes perdues à 42 %) ; seul change le calendrier d\'ouverture.');
log('Variantes : **(a)** l\'âge minimal baisse d\'un trimestre par an à partir de 2028 (60 ans atteints après 16 ans, en 2043) ; **(b)** d\'un semestre par an (après 8 ans, en 2035) ; **(c)** en deux temps : rien pendant 4 ans, mi-chemin (62 ans) à 5 ans (cohortes de 2032), complet à 10 ans (cohortes de 2037). Référence : la v5.6 adoptée (ouverture complète en 3 ans).');

log('\n### 25.1 Résultats au central (Md€ de 2025 ; l\'effet net est ajouté au solde de la v5.5 de +' + r2(D.solde('central')) + ' ; ordre favorable / central / défavorable pour les effets)');
log('| | **v5.6 adoptée** | **(a) trimestre par an** | **(b) semestre par an** | **(c) deux temps** |'); log('|---|---|---|---|---|');
function ligne(titre, f) { log('| ' + titre + ' | ' + C.map(function (c) { return f(c); }).join(' | ') + ' |'); }
ligne('**Taux d\'équilibre au pire du creux**', function (c) { return '**' + pt(R[c].cx.taux) + ' (' + R[c].cx.an + ')**'; });
ligne('Écart à 42 % (points)', function (c) { return r2((R[c].cx.taux - 0.42) * 100); });
ligne('Années de solde négatif à 42 %', function (c) { return R[c].l.anneesDeficit + ' (' + R[c].l.premiere + ' à ' + R[c].l.derniere + ')'; });
ligne('Manque maximal à 42 % (Md€/an, année)', function (c) { return r1(R[c].l.manqueMax) + ' (' + R[c].l.manqueMaxAn + ')'; });
ligne('**Déficit cumulé à 42 %** (Md€, hors intérêts)', function (c) { return '**' + r1(R[c].l.manqueCumule) + '**'; });
ligne('Retour du cumul à zéro', function (c) { return R[c].l.anneeRetourDuCumul === null ? '—' : String(R[c].l.anneeRetourDuCumul); });
ligne('**Dette / PIB à 10 ans (2038)**', function (c) { return '**' + pc(R[c].d.r10) + '**'; });
ligne('Dette / PIB à 20 ans (2048)', function (c) { return pc(R[c].d.r20); });
ligne('Dette / PIB à 30 ans (2058)', function (c) { return pc(R[c].d.r30); });
ligne('**Taux de croisière (2060)**', function (c) { return '**' + pt(R[c].cr.taux) + '** (effet net ' + sg(R[c].cr.net) + ')'; });
ligne('Taux plat constant qui équilibre 2029-2060 (par la dette)', function (c) { return pt(R[c].tl); });
log('Pour mémoire : sans dispositif V6 (v5.5), dette à 10 ans ' + pc(E.jalonsDette('central').r10) + ', 20 ans ' + pc(E.jalonsDette('central').r20) + ', 30 ans ' + pc(E.jalonsDette('central').r30) + ' ; un point de taux plat vaut ' + r2(pas) + ' Md€.');

log('\n### 25.2 Effet net ajouté à la v5.5, année par année (central, Md€/an ; + améliore le solde)');
log('| année | v5.6 adoptée | (a) | (b) | (c) | solde à 42 % (a) | solde à 42 % (b) | solde à 42 % (c) |'); log('|---|---|---|---|---|---|---|---|');
var y;
for (y = 2029; y <= 2060; y++) log('| ' + y + (JAL.indexOf(y) >= 0 ? ' **(jalon)**' : '') + ' | ' + C.map(function (c) { return sg(F.net('central', c, y)); }).join(' | ') + ' | ' + ['a', 'b', 'c'].map(function (c) { return sg(F.solde('central', c, y)); }).join(' | ') + ' |');
log('\nAux jalons, trois scénarios (favorable / central / défavorable), effet net :');
log('| jalon | v5.6 adoptée | (a) | (b) | (c) |'); log('|---|---|---|---|---|');
JAL.forEach(function (j) { log('| ' + j + ' | ' + C.map(function (c) { return SCS.map(function (s) { return sg(F.net(s, c, j)); }).join(' / '); }).join(' | ') + ' |'); });
log('Années de solde négatif à 42 % (favorable / central / défavorable) : ' + C.map(function (c) { return nom(c) + ' : ' + SCS.map(function (s) { return F.lissage(c, 0.42, s).anneesDeficit; }).join(' / '); }).join(' ; ') + '.');
log('Dette à 10 ans (favorable / central / défavorable) : ' + C.map(function (c) { return nom(c) + ' : ' + SCS.map(function (s) { return pc(F.jalonsDette(s, c).r10); }).join(' / '); }).join(' ; ') + '.');

log('\n### 25.3 Lecture : le calendrier déplace le creux, il ne le supprime pas');
var cI = R.immediat, bestC = null;
['a', 'b', 'c'].forEach(function (c) { if (bestC === null || R[c].cx.taux < R[bestC].cx.taux) bestC = c; });
log('- **Aucune variante ne ramène le taux maximal à 42 %.** La meilleure, ' + nom(bestC) + ', le ramène de ' + pt(cI.cx.taux) + ' à **' + pt(R[bestC].cx.taux) + '** (' + R[bestC].cx.an + '), soit ' + r2((cI.cx.taux - R[bestC].cx.taux) * 100) + ' point gagné, mais encore ' + r2((R[bestC].cx.taux - 0.42) * 100) + ' point au-dessus de 42 %.');
log('- **Pourquoi.** Ouvrir moins vite repousse les départs anticipés, donc économise au début ; mais chaque cohorte qui bénéficie de l\'âge libre coûte ensuite le même montant par an (pension versée plus tôt, recettes de travail perdues, sur un stock de retraités qui se remplit). Le coût de l\'âge libre complet est de ' + r1(E.composantes('central', 2040).ageLibre) + ' Md€ en 2040 dans la v5.6 ; en étalant l\'ouverture, le creux s\'aplatit (effet net de 2029 : ' + C.map(function (c) { return sg(F.net('central', c, 2029)); }).join(' / ') + ' pour la v5.6 adoptée, (a), (b), (c)) mais le creux d\'après est plus profond (2040 : ' + C.map(function (c) { return sg(F.net('central', c, 2040)); }).join(' / ') + ').');
log('- **Années de déficit** : ' + C.map(function (c) { return nom(c) + ' : ' + R[c].l.anneesDeficit; }).join(' ; ') + ' ; le déficit cumulé baisse (' + C.map(function (c) { return r1(R[c].l.manqueCumule); }).join(' / ') + ' Md€) mais la durée du déficit ne raccourcit pas : elle s\'allonge pour (a).');
log('- **En 2060 et au-delà**, les variantes ont un peu moins d\'effet net que la référence (' + C.map(function (c) { return sg(F.net('central', c, 2060)); }).join(' / ') + ' Md€) : les premiers partants sont encore en vie ; en 2070 l\'écart a disparu (' + C.map(function (c) { return sg(F.net('central', c, 2070)); }).join(' / ') + ').');
log('- **Convention du modèle (H793, ⚠️ V13491).** La part d\'ouverture est lue à l\'année de départ de référence de la cohorte, comme la montée en 3 ans de `age_libre.js` ; or les cohortes qui profitent de l\'âge libre partent avant cette année (jusqu\'à ' + r1(A_DELTA()) + ' an au central) : le modèle ouvre donc un peu trop tôt, ce qui surestime légèrement les coûts des premières années (prudent) pour la référence comme pour les variantes. Le plancher de 1 300 € est laissé à son profil de la v5.6 (coût 0,2 à 2,1 Md€ avant 2040 : légèrement trop élevé, prudent).');

function A_DELTA() { return this.AgeLibre.SCENARIOS_REF.central.passageLibre * 4; }

log('\n### 25.4 Qui attend, et combien de temps (central ; H797, ⚠️ V13494)');
log('Lecture du modèle : le décalage moyen de la cohorte est lu comme la part « passage » (favorable 0,20 / central 0,35 / défavorable 0,50) de la cohorte de 0,77 M par an qui partirait à l\'âge minimal si l\'âge libre était complet (60 ans), les autres partant à l\'âge de référence. Quand l\'âge minimal est encore à 64 − 4 f, ces personnes attendent **4 × (1 − f) ans de plus** qu\'à l\'ouverture complète ; **personne ne perd un droit actuel**, le report est mesuré par rapport à la promesse complète.');
log('| variante | cohortes concernées | personnes par cohorte (M ; fav. / central / déf.) | attente maximale (cohorte de 2028) | attente moyenne pondérée | personnes concernées au total (M) | années d\'attente cumulées (M × an) |'); log('|---|---|---|---|---|---|---|');
['a', 'b', 'c'].forEach(function (c) {
  var t = F.quiAttendTotal('central', c), q = SCS.map(function (s) { return r2(F.quiAttend(s, c, 2028).personnesM); }).join(' / ');
  log('| ' + nom(c) + ' | ' + t.cohortes + ' | ' + q + ' | ' + r2(t.attenteMaxAns) + ' ans | ' + r2(t.attenteMoyenneAns) + ' ans | ' + r1(t.personnesM) + ' | ' + r1(t.anneesPersonnesM) + ' |');
});
log('Détail par cohorte (central : 0,27 M de personnes concernées par cohorte ; âge minimal ouvert ; attente en plus) :');
log('| cohorte (départ de référence) | (a) âge minimal / attente | (b) âge minimal / attente | (c) âge minimal / attente |'); log('|---|---|---|---|');
var s0;
for (s0 = 2028; s0 <= 2043; s0++) log('| ' + s0 + ' | ' + ['a', 'b', 'c'].map(function (c) { var q = F.quiAttend('central', c, s0); return q.personnesM > 0 ? r2(q.ageMinimalOuvert) + ' ans / ' + r2(q.attenteAns) + ' ans' : '60 ans (ouvert)'; }).join(' | ') + ' |');

log('\n### 25.5 La pénibilité garde ses droits dès 2029');
log('| année | âge minimal de départ pour pénibilité (cohorte de l\'année) | coût de la pénibilité (central, Md€/an) | identique dans les trois variantes |'); log('|---|---|---|---|');
[2029, 2030, 2035, 2040].forEach(function (a) { var p = F.penibilite('central', a); log('| ' + a + ' | ' + p.ageMin + ' ans | ' + r1(p.coutMdE) + ' | oui |'); });
log('Le calendrier ne touche que l\'âge libre : la composante pénibilité de la v5.6 (départ à 60 ans sans réduction pour la part « pénibilité » de la cohorte : 5 / 10 / 20 %) est reprise telle quelle. **Réserve (⚠️ V13495)** : sa propre montée en charge de 3 ans (`penibiliteIndexee`, paramètre `montee` : plein effet atteint en 2030) est celle du modèle ; si l\'auteur veut les droits **entiers** dès le premier jour, il faut la raccourcir (coût en 2029 : de ' + r1(F.penibilite('central', 2029).coutMdE) + ' à ≈ ' + r1(F.penibilite('central', 2029).coutMdE * 1.5) + ' Md€ au central, ordre de grandeur) ; non chiffré dans le modèle.');

log('\n### 25.6 Le comportement de départ du modèle est-il sourcé ?');
log('- **Élasticité de l\'âge de départ à l\'âge minimal (« passage », ' + '0,20 / 0,35 / 0,50) : NON sourcée (⚠️ V13492).** Les 0,35 sont une hypothèse assumée par symétrie avec le relèvement de l\'âge légal (Seibold 2021 : 0,33 ; Manoli-Weber : 0,4 ; Bozio : 0,4 à 0,8, sur des relèvements) ; **aucune étude** ne porte sur un départ libre à 60 ans à coefficient neutre (`age_libre.js`, commentaire de `SCENARIOS_REF`). Le premier levier du signe du solde 2040 (±0,15 = ±7,6 Md€).');
log('- **Part des départs anticipés (lecture « part de la cohorte à l\'âge minimal ») : non sourcée (⚠️ V13494).** Le modèle ne donne qu\'un décalage moyen ; la répartition « un tiers part à 60 ans, le reste à l\'âge de référence » est une lecture de ce module, pas un résultat du modèle ; en réalité les départs se répartissent sur tous les âges de 60 à 64 ans.');
log('- **Linéarité de l\'ouverture (⚠️ V13493)** : on suppose que l\'effet est proportionnel au nombre d\'années d\'âge minimal ouvertes (f = (64 − âge minimal) / 4). Un effet de seuil (ruée à l\'ouverture, anticipation de la suite du calendrier) n\'est pas modélisé : un calendrier annoncé peut faire attendre ou précipiter les départs ; aucune étude de cas citée.');
log('- Sourcés (sources/retraites-comportements.md) : part en emploi (Rabaté-Rochut 0,40 ; Pays-Bas 0,32 ; Danemark 0,74), substitution, part pénibilité (Drees 2025), coefficient neutre à 0,7 % (hypothèse H44 et suivantes).');

log('\n### 25.7 Recommandation chiffrée (l\'auteur choisit ; la v5.6 n\'est PAS modifiée)');
var rb = R[bestC];
log('**Variante la plus proche de 42 % : ' + nom(bestC) + '** (taux maximal ' + pt(rb.cx.taux) + ' en ' + rb.cx.an + ', ' + rb.l.anneesDeficit + ' années de déficit, ' + r1(rb.l.manqueCumule) + ' Md€ cumulés, dette à 10 ans ' + pc(rb.d.r10) + ', croisière ' + pt(rb.cr.taux) + '). **Elle est aussi la plus lente : l\'âge minimal reste au-dessus de 62 ans jusqu\'en 2035 et atteint 60 ans en 2043** : la « liberté » promise n\'existe pleinement que pour les cohortes nées vers 1978, ce qui dénature la promesse pour ceux qui l\'entendent aujourd\'hui. **Recommandation : ' + nom('b') + '** (meilleur compromis entre le taux et la promesse) : liberté complète en 2035 (' + pt(R.b.cx.taux) + ', ' + R.b.l.anneesDeficit + ' ans de déficit, ' + r1(R.b.l.manqueCumule) + ' Md€ cumulés, dette à 10 ans ' + pc(R.b.d.r10) + '), mais le gain sur le taux maximal est faible (seulement ' + r2((cI.cx.taux - R.b.cx.taux) * 100) + ' point). La variante (c) ne gagne que ' + r2((cI.cx.taux - R.c.cx.taux) * 100) + ' point et crée un effet de seuil (rien pendant 4 ans, puis deux marches) difficile à défendre.');
log('**Sans détour : aucune des trois ne résout le creux** (42 % ne tient dans aucun cas avant ' + ['a', 'b', 'c'].map(function (c) { return nom(c) + ' : ' + (R[c].l.derniere + 1); }).join(' ; ') + ') ; le calendrier d\'ouverture est un levier de **lissage**, pas de financement. Si l\'objectif est un taux maximal proche de 42 %, il faut un autre levier (taux à 43 % pendant la transition, ou financement par la dette de 2029 à 2047 : § 24.4) en plus ; si l\'objectif est la promesse de liberté, la variante (b) est la moins coûteuse en confiance ; (a) n\'est à retenir que si l\'auteur accepte une liberté complète seulement en 2043. À trancher par l\'auteur.');
log('\nTemps de calcul du § 25 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
