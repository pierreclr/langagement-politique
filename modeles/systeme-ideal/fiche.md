---
titre: Le système complet et la trajectoire de la dette
theme: comptes et dette
statut: brouillon ; dernier calcul le 8 novembre 2026
---

## La question

Si l'on remplace les impôts, cotisations et aides actuels par le système du programme (une seule fonction qui prélève sur les revenus, un plancher, une courbe des pensions, des fonctions continues sur le patrimoine et les héritages), combien faut-il prélever pour que la dette publique cesse de monter en part du produit intérieur brut (PIB, la richesse produite en un an) ? Le modèle répond par un seul nombre réglé, le « taux du haut », et par une trajectoire de dette de 2029 à 2058.

## Ce qui entre

- **Statistiques publiques** : dette publique fin 2025, 3 460,5 Md€ (115,7 % du PIB, Insee) ; charge d'intérêts 2025, 65,7 Md€ ; déficit public 2024, 169,1 Md€ (Insee) ; prélèvements regroupés par le système (886 Md€ en 2024) et masse salariale au coût employeur (1 466,6 Md€), relus dans les comptes nationaux de l'Insee ; distribution des pensions (Drees, enquête de 2020 revalorisée).
- **Études** : élasticités des revenus et du capital à l'impôt (Saez, Slemrod et Giertz 2012 ; offre de travail d'Immervoll et al. 2007), fuite des héritages (Conseil d'analyse économique), coût du grand âge (modèle du dépôt).
- **Hypothèses de cadrage** : croissance nominale de 3 % par an ; taux d'intérêt de marché fixe de 3,45 % (taux de l'obligation d'État à 10 ans au début de 2026) ; durée de vie moyenne de la dette de 8 ans ; années 2026 à 2028 au droit actuel, d'où une dette de 4 037 Md€, soit 123,5 % du PIB, au départ de 2029.
- **Population simulée** : dix tranches de salariés (27 millions de personnes, dont les 10 % du haut coupés en cinq sous-tranches), 16,5 millions de retraités, des revenus du capital répartis par une clé de l'Insee puis par une loi de Pareto (une forme de distribution très inégale) en haut de l'échelle.

## Comment il calcule

Le modèle est construit en couches. Chaque couche ajoute ou corrige des lignes sans modifier les précédentes, et chaque couche a ses propres tests.

1. **Le modèle statique du 31 octobre.** Il compare, pour une année type, ce que rapportent les prélèvements actuels et ce que rapporterait le nouveau système, avec les réactions des contribuables (heures travaillées, départs à l'étranger, report des revenus du capital). Ses premiers résultats, au début de `resultats.md`, datent de cette version : ils ne décrivent plus le système actuel.
2. **Les extensions du 31 octobre au 4 novembre** : santé, retraites, démographie, croissance, patrimoine immobilier et financier, héritages, holdings, chômage.
3. **Les versions du 5 et du 6 novembre** : le système retenu par l'auteur, version après version. La version du 6 novembre fixe la « fonction des revenus » : pour un revenu mensuel R (coût employeur et revenus du capital), le taux marginal (ce que l'État prend sur un euro de plus) vaut a − (a − 0,20) × e^(−R / 1 500). Il part de 20 % au premier euro et monte sans à-coup vers a. Ce nombre a est le **taux du haut**.
4. **Les décisions du 7 novembre** : courbe des pensions, transmissions, garantie de transition, et la règle de dette ci-dessous.
5. **Les décisions du 8 novembre** : grand âge, plancher en deux parts (627 € et 250 € de part logement), outre-mer, taxe d'artificialisation, justice, protection de l'enfance, clause automatique.
6. **La correction du 8 novembre au soir** : un double compte de l'impôt dont le paiement est différé (24,99 Md€ par an de 2029 à 2040) est retiré, et le plafond des transmissions est ramené à 50 %.

**La dette, année par année.** Pour chaque année de 2029 à 2058, le code fait :

- PIB de l'année = PIB de 2025 × 1,03 à la puissance du nombre d'années depuis 2025 ;
- taux apparent de la dette = taux de l'année d'avant + (3,45 % − taux de l'année d'avant) / 8. Le taux moyen payé rejoint peu à peu le taux de marché, à mesure que la dette ancienne est renouvelée ;
- intérêts = taux apparent × dette de l'année d'avant ;
- solde primaire (le solde avant intérêts) = somme des lignes du système, en euros de 2025, × 1,03 à la même puissance. Chaque ligne garde donc la même part du PIB d'une année à l'autre ;
- dette de l'année = dette de l'année d'avant + intérêts − solde primaire ;
- ratio = dette / PIB.

**La règle de dette (décision de l'auteur du 7 novembre).** Les leviers nouveaux montent en ligne droite, de zéro en 2029 à leur plein effet en 2038. Le code cherche, par essais successifs (une dichotomie), le plus petit montant de leviers F tel qu'aucune année de 2039 à 2058 n'ait un ratio supérieur à celui de 2038. Il retire de F ce que rapportent les autres leviers : transmissions 8,92 Md€, suite de l'impôt sur le patrimoine 2,28, courbe des pensions 9,00, économies 2,35. Le reste revient à la fonction des revenus et au crédit d'impôt sur les sociétés. Le code cherche alors, par une seconde dichotomie entre 0,40 et 0,95, le taux du haut a qui rapporte exactement ce reste. Il trouve F = 33,27 Md€ et a = 0,6515 (`resultats_correction_0811.txt`, § 2).

**Conséquence à lire avant tout le reste : la stabilité de la dette après 2038 est une construction, pas un résultat.** Le taux du haut est calculé pour que la dette cesse de monter. Ce que le modèle mesure vraiment, c'est le niveau du taux du haut nécessaire, et le niveau où la dette se stabilise.

**Exemple suivi : l'année 2038** (scénario de référence). Les valeurs intermédiaires ont été lues en relançant le calcul le 9 novembre 2026 ; le résultat relancé est identique au fichier écrit.

- Dette fin 2037 : 5 562,6 Md€.
- Taux apparent : environ 3,18 %, donc intérêts de 176,7 Md€.
- Solde primaire : +13,9 Md€ courants, soit 9,4 Md€ de 2025.
- Dette fin 2038 : 5 562,6 + 176,7 − 13,9 = 5 725,4 Md€ (5 725,5 dans le code, à l'arrondi près).
- PIB 2038 : 4 392,3 Md€, d'où un ratio de 130,4 %.

En 2029, le solde primaire est encore de −67,1 Md€ courants : la bascule est neutre la première année, les leviers ne font que commencer à monter.

## L'hypothèse qui porte le résultat

**Le taux d'intérêt reste à 3,45 % pendant trente ans, quel que soit le niveau de la dette.** Cette valeur est celle de l'obligation d'État à 10 ans au début de 2026. Le modèle de taux du dépôt ([/fr/modeles/taux-endogene/](/fr/modeles/taux-endogene/)) pose un taux de 4,7 % aujourd'hui et un taux qui monte avec la dette. Pour stabiliser la dette de 2038 à 2058, notre système doit alors trouver 37 Md€ de plus par an à 4,7 % fixe, et 40 Md€ (de 37 à 44 selon les sensibilités) si le taux suit la dette. Comme 0,01 de taux du haut vaut environ 9 Md€ par an, combler par cet impôt seul porterait le taux du haut vers 0,70. Dans ce même modèle de taux, notre système entre en zone de crise avant 2058 dans deux tirages sur trois si rien n'est ajouté. Le présent modèle ne contient pas cet effet.

Le scénario « prudent » du modèle donne un ordre de grandeur voisin : croissance de 2,5 % et taux de 3,95 %, avec les mêmes leviers, la dette atteint 143,4 % en 2038 et 169,3 % en 2058. Pour la stabiliser, il faudrait F = 71,17 Md€ et un taux du haut de 0,6947.

**Seconde hypothèse forte : la manière de compter l'impôt différé.** Une partie de l'impôt sur le patrimoine se paie plus tard, à la vente ou à la succession. La correction du 8 novembre au soir traite ce retard comme un stock qui se rembourse d'un douzième par an. C'est elle qui fait passer le taux du haut de 0,6733 à 0,6515, et la dette de 2058 de 113,4 % à 124,6 %. Avec un retard fixe de 12 ans, au lieu de cet étalement, on obtient a = 0,6590 et 119,1 % en 2058.

## Ce que l'IA a choisi elle-même

Méthode de comptage. Dans `methode.md`, 45 hypothèses portent la mention « choix de Claude », « hypothèse de Claude » ou « tranché par Claude », sur 604 hypothèses numérotées. 307 lignes portent le signe ⚠️ : la plupart veulent dire « non vérifié », pas forcément « choisi par l'IA ». Les hypothèses des couches du 7 et du 8 novembre ne sont pas dans `methode.md` ; seules celles qui sont marquées dans le code sont relevées ici. Le total réel est donc d'au moins 45, sans doute plus.

Les plus importantes pour le résultat :

- **Écriture de l'impôt différé** (correction du 8 novembre au soir, marquée « à relire par l'auteur ») : un stock remboursé d'un douzième par an, sur une durée moyenne de 12 ans (H537, ⚠️). Pousse le taux du haut vers le bas et la dette de 2058 vers le haut.
- **Durée de vie de la dette de 8 ans** et **croissance nominale de 3 %** (hypothèses du modèle de risques, R4 et R5). Une croissance plus forte allège tout le calcul.
- **Forme du haut de la distribution** : exposants de Pareto de 2,5 pour le travail et 1,5 pour le capital (H5, ⚠️). Ils fixent ce que rapporte le haut, donc le taux du haut nécessaire.
- **Réaction du capital à l'impôt** : élasticité de 0,5, 1 ou 2 (H14) ; part des bénéfices mis en réserve qui revient plus tard : 50, 30 ou 10 % (H15). Une réaction plus forte fait monter le taux du haut.
- **Assiette de la fonction des revenus** : coût employeur et revenus du capital, par adulte (H2).
- **Lignes du 8 novembre** : part de la mutuelle d'entreprise supposée nouvelle dans l'assiette, la moitié au central, soit +3,8 Md€ ; assiettes de taux réduits de taxe sur la valeur ajoutée « non Insee » (⚠️) ; part des bénéficiaires du plancher hébergés sans loyer (10 % au central, ⚠️). Les montants centraux d'un premier chiffrage (collectivités +1,5 Md€, justice −1,09, enfance −2,5) sont repris tels quels.
- **Paramètres de la clause automatique** : levier égal à la moitié de l'écart de dette, plafonné à 8 Md€ de variation par an. La méthode ne dit pas qui les a fixés.
- **Effet constant dès 2029** des lignes récentes, sans projection du nombre de retraités dans ces lignes (HRA6, ⚠️).

## Ce qu'il ne fait pas

- **La dette stable est imposée**, pas observée (voir plus haut). Le déficit reste au-dessus de 3 % du PIB jusqu'en 2057.
- **Taux fixe** : pas de prime de risque, pas de taux qui réagit à la dette (voir le modèle de taux).
- **Postes absents de la trajectoire.** Selon la relecture adverse du 9 novembre 2026 : formation des bâtisseurs, installation agricole et repas (environ 2,6 Md€ par an), entreprise publique au-delà des 3 Md€ comptés, gestion et dette de la foncière du logement. Avec le taux, il manquerait de 40 à 48 Md€ par an.
- **Équilibre partiel** : ni effet sur les salaires, ni effet sur la demande de travail, ni bouclage macroéconomique. La croissance ne dépend pas des réformes.
- **Population figée** dans les lignes des couches récentes : elles restent à la même part du PIB pendant trente ans.
- **Méthode incomplète** : `methode.md` s'arrête à la version du 6 novembre. Les couches du 7 et du 8 novembre ne sont décrites que dans le code, dans les fichiers de résultats `.txt` et dans des notes de travail non publiées. Le haut de `resultats.md` (« aucune combinaison n'équilibre le budget ») décrit la version du 31 octobre.
- **Relectures.** Un audit adverse et une relecture du module de soutenabilité, tous deux du 1er novembre 2026, portent sur les premières couches ; leurs défauts ont été corrigés le 2 novembre (`AUDIT-2026-11-01.md`, `RELECTURE-SOUTENABILITE-2026-11-01.md`). Les couches du 7 et du 8 novembre n'ont pas eu de relecture adverse propre.
- **Point à vérifier** : le commentaire de tête de `correction_0811.js` écrit le coût de l'impôt différé comme flux × e^(−(t−1)/12). Le code calcule flux × (11/12)^(t−1). Les chiffres publiés suivent le code.
- **Point à vérifier** : la clause automatique convertit l'écart de dette en euros avec un PIB fixe de 2 935 Md€, alors que la trajectoire part d'un PIB 2025 de 2 991 Md€.
- **Ce que cette fiche ne couvre pas** : le détail des quelque 600 hypothèses, les modules santé, chômage, capitalisation, patrimoine immobilier et financier, décès, cas types et options écartées. Ils sont décrits dans `methode.md` et `resultats.md`, section par section.

## Ce qu'il donne

- Taux du haut **0,6515** en régime, contre 0,6733 avant la correction du 8 novembre au soir. Aux bornes des lignes du 8 novembre, il va de 0,6471 à 0,6670 (`resultats_correction_0811.txt`, § 2 et § 4).
- Dette, au taux fixe de 3,45 % : **130,4 % du PIB en 2038** (le plus haut), **124,6 % en 2058** ; déficit de 5,0 % du PIB en 2029, 3,7 % en 2038, 2,9 % en 2058 (même fichier, § 2). Le banc d'essai des programmes publie, pour le même système, une médiane de 121,9 % en 2058 ([/fr/modeles/banc-programmes/](/fr/modeles/banc-programmes/)).
- Prélèvements obligatoires : 51,6 % du PIB (51,9 % au sens large) (même fichier, § 2).
- Scénario prudent sans correction : 143,4 % en 2038 et 169,3 % en 2058. Avec la clause automatique : 132,9 % et 127,2 %, au prix d'un levier ajouté d'environ 38 Md€ par an, qui porte le taux du haut vers 0,69 (même fichier, § 2 et § 4).
- Écart de revenu net après santé, en euros par mois : Smic seul +96 ; couple à deux Smic avec deux enfants +170 ; cadre à 10 000 € brut −187 ; retraité à 4 000 € −243 (même fichier, § 2).

## Comment le refaire

Depuis le dossier `modeles/systeme-ideal/`, avec le moteur JavaScript fourni par macOS (`jsc`) et la liste de fichiers donnée en tête de `test_base_0611.js`, complétée des couches récentes :

```
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
  patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
  ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
  decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
  ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
  bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js base_0611.js \
  cas_types_nets_0611.js variante_nationalite_0611.js transmissions_0611.js retraites_aisees_0611.js consolidation_0611.js decisions_0711.js decisions_0811.js correction_0811.js)
$JSC $LIST test_correction_0811.js                                   # tests de la correction du 8 novembre au soir
$JSC $LIST rapport_correction_0811.js > resultats_correction_0811.txt  # résultats
```

Pour les tests des décisions du 8 novembre, on retire `correction_0811.js` de la liste et on lance `test_decisions_0811.js`.

Relancé le 9 novembre 2026, sur une copie de travail : 33 vérifications de la correction passent, 45 vérifications des décisions du 8 novembre passent, chacune en environ une seconde. Le rapport relancé est identique, ligne à ligne, à `resultats_correction_0811.txt` (hors la ligne d'export).
