---
titre: Plan d'affaires d'un centre public d'inférence (1, 5 et 10 Md€)
date: 2026-11-07
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions ; calcul dans `sources/calculs/inference_publique.py` (résultats : `sources/calculs/inference_publique_resultats.txt`, « Tests : tous passés ») ; vérifications V19600 à V19618
---

# Commencer l'entreprise d'État par l'inférence : le plan d'affaires

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 07/11/2026. **Conflit d'intérêts, à lire d'abord** : Anthropic vend de l'inférence (des jetons) et dépend de puces et de centres de données ; un chapitre qui conclurait « construisez de l'inférence » sert mon employeur par ricochet. Le projet déclare un biais pro-technologie (charte, § 7) ; je le challenge ici. Je n'ai lu aucun document interne d'un fournisseur ; tout vient de sources publiques, cotées ci-dessous.

**Question de l'auteur (07/11)** : commencer l'entreprise d'État (chapitre 12) par l'inférence, parce que l'Europe en manque, qu'un terrain près d'une centrale nucléaire existe, que les puces pourraient être avancées à crédit par le fabricant, et que DeepSeek a publié ses marges. Est-ce l'investissement le plus vite rentable pour une partie des économies du système ?

## 0. Réponse courte

1. **La marge de DeepSeek ne se transpose pas.** Elle porte sur un revenu *théorique* de 562 027 $ par jour contre 87 072 $ de location de GPU, soit « 545 % », au tarif R1 de février 2025. Au tarif V3.2 de 2026 et pour le même trafic, le même calcul donne **78 %**, avant bâtiment, électricité, réseau, personnel et avant gratuités.
2. **Dans mon scénario central, le centre ne bat pas la dette** : taux de rendement interne (TRI) **−3,6 %** contre 4,94 % pour l'OAT à 10 ans. Il bat la dette dans le scénario haut (**47 %**, retour en 2,7 ans) et perd gros dans le scénario bas. Le projet est un pari sur un revenu par GPU-heure supérieur d'environ 23 % à ma valeur centrale (4,57 € contre 3,71 €), pas une rente.
3. **Ce qui fait la différence** : le prix des jetons (baisse annuelle), le gain de puissance par GPU, la part du revenu théorique réellement encaissée et le taux d'utilisation. Le prix de l'électricité compte peu (±0,4 Md€ de valeur sur 5 Md€).
4. **L'usage mixte aide** : servir les États-Unis la nuit remplit les creux (jusqu'à 89 % d'utilisation contre 78 % pour la même demande européenne seule) ; mais dans le scénario central même ce remplissage ne suffit pas à s'autofinancer.
5. **Recommandation (analyse de Claude, § 5)** : un premier palier de ≈ 1 Md€ avec des clients d'ancrage publics et des points de sortie, pas 5 ou 10 Md€ d'emblée ; ne pas présenter ce projet comme « l'investissement le plus rapidement rentable » : je ne l'ai comparé qu'à la dette, pas aux autres investissements publics possibles.

## 1. Données

Cotes (règle 11) : A statistique ou texte officiel ; B institution reconnue ; C presse, think tank, agrégateur ; D communication commerciale ou blog. Les contenus ont été lus par résumé automatique de page : à relire à la source (V19600).

### 1.1 Ce que DeepSeek a publié

| Point | Valeur | Cote et conflit d'intérêts |
|---|---|---|
| Document | « DeepSeek-V3/R1 Inference System Overview », dépôt `deepseek-ai/open-infra-index`, semaine open source de février 2025, publié le 01/03/2025 | **B** pour les faits publiés (l'entreprise parle d'elle-même) ; **conflit** : publicité pour son offre |
| Fenêtre | 24 h, du 27/02/2025 12 h au 28/02/2025 12 h (UTC+8) | |
| Matériel | GPU H800, 8 par nœud ; nœuds occupés : **226,75 en moyenne**, pic **278** (donc ≈ 1 814 GPU en moyenne) | |
| Trafic | **608 Md** de jetons en entrée (dont **342 Md**, 56,3 %, servis par le cache disque) ; **168 Md** de jetons en sortie | |
| Débit | ≈ 73,7 k jetons/s en entrée et ≈ 14,8 k jetons/s en sortie par nœud | |
| Coût | location de **2 $ par GPU et par heure** → **87 072 $ par jour** | location, pas propriété ; l'entreprise indique louer ou posséder selon ses propres termes |
| Revenu théorique | **562 027 $ par jour** au tarif R1 (0,14 $ cache ; 0,55 $ hors cache ; 2,19 $ par million de jetons de sortie) | |
| Marge publiée | **545 %** (revenu théorique / coût − 1) | |
| Limites que DeepSeek énonce lui-même | V3 est facturé bien moins cher que R1 ; seule une partie des services est payante (web et appli gratuits) ; remises automatiques la nuit | |

**Recalcul** (`deepseek_controles`) : coût 87 072 $ (retrouvé) ; revenu R1 562 100 $ (écart 0,02 %) ; marge 545,6 %. **Au tarif V3.2 de 2026** (0,028 $ ; 0,28 $ ; 0,42 $ par million, cote C : agrégateurs, V19601), revenu 154 616 $ et **marge 77,6 %**. Revenu par GPU-heure : 12,91 $ (R1) puis 3,55 $ (V3.2). **Lecture** : l'essentiel de la « marge » de 2025 était un prix de 2025 ; elle s'est écrasée en 18 mois, ce qui est le phénomène même que le plan doit modéliser. Autres leçons : la moyenne des nœuds occupés ne fait que 81,6 % du pic ; DeepSeek indique (de mémoire du texte, V19600) libérer des nœuds la nuit pour la recherche, ce qui est une forme de remplissage des creux.

### 1.2 Coût d'un centre, par MW

| Poste | Valeur | Source, cote |
|---|---|---|
| Capex d'un site de 1 GW IT (GB200 NVL72, hyperscaleur américain) | **37,9 Md$**, soit 37,9 M$/MW : serveurs 21,2 ; réseau 4,9 ; bâtiment, alimentation et refroidissement 11,4 ; terrain 0,17 ; raccordement 0,16 (Md$) | Epoch AI, « AI datacenter cost breakdown », 14/05/2026 : **B** (institut de recherche, financé par des philanthropes ; données et modèle ouverts) |
| Coût total annualisé | **8,5 M$ par MW et par an** (serveurs 60 %), énergie 594 M$/GW/an (prix 8,34 c$/kWh), PUE 1,14, utilisation 71 %, durée 5 ans (IT) et 14 ans (bâtiment) | idem |
| Sensibilité à la durée | 3 ans : ≈ 12 à 13 Md$/GW/an ; 7 ans : ≈ 7 | idem |
| Prix d'une baie GB200 NVL72 | 2,8 à 3,4 M$ (matériel) ; ≈ 3,9 M$ avec réseau et stockage ; ≈ 5,9 M$ avec l'infrastructure physique | presse spécialisée (Tom's Hardware ; SemiAnalysis via relais) : **C** |
| Puissance d'une baie GB300 NVL72 | ≈ 132 kW nominal (≈ 155 kW de crête électrique) | fiches constructeurs (HPE, Lenovo, Gigabyte) : **C/D** (communication commerciale) |
| Vera Rubin NVL72 | ≈ 7,8 à 8,8 M$ la baie annoncés | presse : **C** |
| Extrêmes à ne pas retenir | 49 Md$/GW (Morgan Stanley, Vera Rubin, périmètre autre) ; shell seul ≈ 11,3 M$/MW (JLL) | **C** |

**Déduction** (H3) : 21,2 Md$ de serveurs par GW avec ≈ 45 k$ par GPU de classe GB200 donne ≈ 470 k GPU par GW, soit **≈ 475 GPU par MW IT** (≈ 2,1 kW IT par GPU). Cohérent avec ≈ 1,8 kW par GPU pour une baie à 132 kW. Taux de change retenu : 1 $ = 0,87 € (H0, hypothèse). **Tous ces chiffres sont américains** ; le coût européen du bâtiment et du raccordement n'est pas établi (V19602).

### 1.3 Autres accélérateurs

Nvidia domine ; AMD (MI300/MI350) et les puces maison des hyperscaleurs (TPU, Trainium) existent mais je n'ai **pas** de prix ni de débit vérifiés par source (V19603). Côté européen, SiPearl et Vsora conçoivent des puces (positions de l'auteur, n°20 vérifié le 04/11), sans production à l'échelle : pour un centre à livrer en 2028, l'option réaliste reste Nvidia. Cela confirme la dépendance au fournisseur (steelman § 3).

### 1.4 Électricité pour un gros consommateur en France

- L'ARENH (42 €/MWh) a pris fin le 31/12/2025 ; il est remplacé par le **versement nucléaire universel** (VNU, taxe de redistribution sur les recettes d'EDF, déclenchement improbable en 2026 selon la CRE) et des **contrats d'allocation de production nucléaire** (CAPN), contrats de long terme à prix fixe, d'un an renouvelables jusqu'à 10-15 ans. Cote **C** (presse énergie, Connaissance des énergies/AFP, Opéra Énergie ; CRE à relire directement).
- Prix de référence « environ 70 €/MWh, indicatif » (source secondaire, **C**, V19604). EDF a signé 19 contrats de long terme dont 12 CAPN, avec notamment l'opérateur de centres de données Data4 ; **les prix de ces contrats ne sont pas publics**. Xerfi (**C**) juge les volumes et les prix « bien moins avantageux » que sous l'ARENH.
- Hypothèses retenues (H10) : **95 / 75 / 50 €/MWh** (bas / central / haut), tout compris. À remplacer par un devis EDF/RTE.
- **Terrains** : EDF a retenu quatre sites sur ses terrains, déjà raccordés, ≈ **2 GW** de capacité de raccordement au total, ≈ **150 hectares** ; deux sites de plus attendus en 2026 ; attribution par appel à manifestation d'intérêt selon des critères de maturité des projets ; **localisations non publiées** (Connaissance des énergies/AFP et presse du 10/02/2025 : **C**, V19605). Il n'existe pas, à ma connaissance, de dispositif d'attribution « d'État à État » : l'appel est ouvert.

### 1.5 Taux d'utilisation, prix des jetons, durée de vie des puces

- **Utilisation** : Epoch retient 71 % ; DeepSeek, nœuds moyens/pic = 81,6 %. Je retiens 55 / 70 / 80 %.
- **Prix des jetons à performance fixée** : Epoch AI (mise à jour 05/02/2026, **B**) : baisse de **9× à 900× par an** selon le seuil de performance, ≈ 40× par an en médiane ; Gundlach et coauteurs, « The Price of Progress », arXiv 11/2025 (**B**, MIT FutureTech) : **5× à 10× par an**, mais le prix des modèles de frontière monte de 3× à 18× par an (modèles plus gros, plus de raisonnement). **Lecture** : le prix du *jeton d'une capacité donnée* s'effondre ; le revenu par GPU-heure dépend de ce que le marché accepte de payer pour les modèles *du moment*. Ma variable modélisée est donc le **revenu par GPU-heure** (baisse de 30 / 20 / 10 % par an pour une génération de puces donnée, H7), pas le prix du jeton.
- **Indice de revenu observé** : H100 louée ≈ 3,17 à 3,28 $/h (indice Ornn, septembre 2026, relayé par presse : **C/D**) ; B200 de 2,12 à 6,04 $/h selon le palier (agrégateur : **C/D**, V19606). Revenu central modélisé : 4,26 $ par GPU-heure occupée en année 1, soit 3,71 €.
- **Durée d'amortissement** : 5 à 6 ans chez les hyperscaleurs ; Burry (cité par la presse) estime ce choix trop long ; contre-indices : capacités H100 reloués à ≈ 95 % de l'ancien prix (PDG de CoreWeave, déclaration d'acteur : **D**), mais une H100 de trois ans revendue ≈ 45 % du neuf. Débat **non tranché** ; je prends 3 / 5 / 7 ans.
- **Prix des jetons du marché** : DeepSeek V3.2, 0,028 / 0,28 / 0,42 $ par million de jetons (cache / hors cache / sortie) : **C** ; V4 évoqué à des tarifs voisins ou plus élevés selon les agrégateurs, non établi.

### 1.6 Projets européens et français

| Projet | Fait annoncé | Cote |
|---|---|---|
| **Gigafactories d'IA de l'UE** | Appel d'offres d'EuroHPC JU lancé le **30/07/2026** : jusqu'à **sept** gigafactories dans au moins sept États ; > **20 Md€** d'investissement privé attendus ; financement public UE et États (surtout dans le cadre financier 2028-2035) ; dépôt le **12/11/2026** ; sélection début 2027 ; exploitation sous 18 mois ; consortiums ou sociétés ad hoc, publics et privés admis. Le chiffre de « 100 000 puces par site » et un montant public de 10 Md€ circulent mais **ne figurent pas dans le communiqué officiel** | **A/B** (communiqué EuroHPC) ; le reste **C** (V19607) |
| **Mistral AI** | Site d'entraînement de 40 MW à Bruyères-le-Châtel (Essonne, hébergé par Eclairion, avec Fluidstack), extension visée à 100 MW ou plus ; 18 000 GPU annoncés en 2025 ; site d'inférence de 10 MW aux Ulis (annoncé mai 2026) ; programme de ≈ 4 Md€ en France et en Suède ; dette de 830 M$ en mars 2026 | **C** (presse, V19608) |
| **Fluidstack** | Protocole d'accord de février 2025 pour un supercalculateur de 1 GW en France, 10 Md€ initiaux, extensible au-delà en 2028 | **C** (presse spécialisée ; entreprise partie prenante) |
| **EDF** | quatre terrains, 2 GW, voir § 1.4 | **C** |

### 1.7 Financement par le fournisseur : ce qui est connu

Nvidia a pris des participations et garanti des capacités chez des clients : participation d'environ 7 % dans CoreWeave et engagement d'acheter jusqu'à 6,3 Md$ de capacité inutilisée jusqu'en 2032 ; annonce d'un investissement allant jusqu'à 100 Md$ dans OpenAI (octobre 2025, termes non finalisés) ; des négociations de garantie de dette plus importantes sont rapportées pour 2026, **non confirmées**. Presse et chroniques : **C/D**, avec le conflit d'intérêts que la presse financière analyse (« financement circulaire », comparaison avec Cisco et Nortel). **Aucun précédent trouvé** de crédit d'un fabricant à un État (V19609). Comme les puces sont soumises aux contrôles américains à l'exportation, l'idée relève d'une négociation diplomatique, pas d'un simple achat.

### 1.8 Ce que l'État paie aujourd'hui en cloud et en IA

**Non chiffrable à ce jour** avec les sources lues (V19610) : j'ai trouvé la Cour des comptes (octobre 2025, souveraineté numérique : « stratégie » jugée absente, coût de la souveraineté « pas particulièrement élevé »), la migration du Health Data Hub vers un hébergeur certifié SecNumCloud (Scaleway) et le marché « Nuage public » de l'Ugap, mais **aucun montant agrégé**. Tâche à ouvrir : extraire les marchés Ugap et DINUM de cloud et d'IA. Tant que ce chiffre manque, l'usage interne est modélisé par une **part de la capacité** (10 à 20 %) et une **valeur de reversement** (0, 50, 100 % du prix de marché), pas par un montant.

## 2. Le plan d'affaires

### 2.1 Hypothèses (scénarios « bas » = issue défavorable, « central », « haut » = favorable)

| N° | Hypothèse | Bas | Central | Haut | Statut |
|---|---|---|---|---|---|
| H1-H2 | Capex par MW IT (serveurs + réseau ; bâtiment + terrain + raccordement) | 49,3 M$ | 37,9 M$ (32,97 M€) | 30,3 M$ | Epoch, ±30 % / −20 % (hypothèse) |
| H3 | GPU par MW IT | 475 | 475 | 475 | dérivé |
| H4 | Gain par GPU face au H800 de DeepSeek | 1,5× | 2× | 3× | **hypothèse, non sourcée** (V19611) |
| H5 | Revenu encaissé / revenu théorique (gratuité, remises, clients non payants) | 40 % | 60 % | 80 % | **hypothèse** ; DeepSeek dit seulement « bien moins » |
| H6 | Revenu théorique par GPU-heure H800 au tarif V3.2 | 3,55 $ | 3,55 $ | 3,55 $ | calculé (§ 1.1) |
| H7 | Baisse annuelle du revenu par GPU-heure d'une génération | 30 % | 20 % | 10 % | hypothèse calée sur le § 1.5 |
| H8 | Part de la baisse regagnée au remplacement des puces | 50 % | 85 % | 100 % | hypothèse |
| H9 | Utilisation moyenne en régime (rampe 60 % la 1re année) | 55 % | 70 % | 80 % | Epoch 71 % |
| H10 | Électricité, €/MWh | 95 | 75 | 50 | § 1.4 |
| H11 | PUE | 1,25 | 1,20 | 1,15 | Epoch 1,14 |
| H12 | Opex hors énergie par MW et par an ; frais variables (part du CA) | 0,45 M€ ; 18 % | 0,35 M€ ; 12 % | 0,30 M€ ; 8 % | hypothèse ; Epoch ≈ 0,31 M$ |
| H13 | Durée d'amortissement des puces | 3 ans | 5 ans | 7 ans | débat du § 1.5 |
| H15 | Coût du capital public ajusté du risque | 9 % | 7 % | 5 % | hypothèse |

Construction sur deux ans (capex 50/50), horizon de 15 ans, bâtiment à 15 ans (valeur résiduelle linéaire), moitié de la valeur linéaire restante des serveurs en fin d'horizon, remplacement des puces au même prix nominal, pas d'impôt (flux avant impôt : l'État en perçoit aussi). Consommation électrique = 0,4 + 0,6 × utilisation (les GPU inactifs consomment encore).

### 2.2 Résultats à 1, 5 et 10 Md€

Un investissement « tout compris » de 1 Md€ achète **≈ 23 / 30 / 38 MW** (bas / central / haut) ; 5 Md€, **117 / 152 / 190 MW** ; 10 Md€, **233 / 303 / 379 MW**. À 303 MW, l'appel est de 2,6 TWh par an, soit ≈ 3 % des 92 TWh d'exportations nettes de la France (T12). Avec le scénario bas, la capacité achetée est plus petite parce que chaque MW coûte plus.

| Investissement | Scénario | GPU | CA année 1 de régime | EBITDA (marge) | VNA | TRI | Retour |
|---|---|---|---|---|---|---|---|
| **1 Md€** | bas | 11 081 | 99 M€ | 53 M€ (53 %) | −2 112 M€ | non défini | jamais |
| | **central** | 14 406 | 327 M€ | 258 M€ (79 %) | **−453 M€** | **−3,6 %** | jamais |
| | haut | 18 007 | 935 M€ | 832 M€ (89 %) | +4 376 M€ | 47,1 % | 2,7 ans |
| **5 Md€** | bas | 55 407 | 495 M€ | 265 M€ | −10 560 M€ | non défini | jamais |
| | **central** | 72 029 | 1 637 M€ | 1 289 M€ (79 %) | **−2 264 M€** | **−3,6 %** | jamais |
| | haut | 90 036 | 4 677 M€ | 4 162 M€ | +21 881 M€ | 47,1 % | 2,7 ans |
| **10 Md€** | bas | 110 813 | 989 M€ | 529 M€ | −21 120 M€ | non défini | jamais |
| | **central** | 144 057 | 3 274 M€ | 2 579 M€ | **−4 528 M€** | **−3,6 %** | jamais |
| | haut | 180 072 | 9 354 M€ | 8 324 M€ | +43 763 M€ | 47,1 % | 2,7 ans |

Jetons de sortie produits par an (régime, année 1) : 1 Md€ ≈ 0,3 / 0,7 / 1,5 mille milliards ; 5 Md€ ≈ 1,5 / 3,4 / 7,3 ; 10 Md€ ≈ 3,1 / 6,8 / 14,6 (mille milliards de jetons). VNA, TRI et retour sont **proportionnels à la taille** (le modèle n'a pas d'économie d'échelle ni de saturation de la demande : à 10 Md€, 14,6 mille milliards de jetons dépassent peut-être la demande européenne, V19611). Le « retour » est l'année où le cumul des flux non actualisés redevient positif.

**Lecture honnête de l'asymétrie** : l'EBITDA de l'année 1 est élevé (79 % au central) parce que le coût de l'investissement est dans le capex ; mais le revenu par GPU-heure baisse de 20 % par an et les puces se rachètent tous les cinq ans, ce qui absorbe presque tout. Le centre « gagne de l'argent » chaque année tout en détruisant de la valeur : c'est le profil d'un métier à renouvellement du capital rapide. L'écart entre le scénario haut (+21,9 Md€) et bas (−10,6 Md€) sur 5 Md€ est de 32 Md€ : **l'incertitude est plus grande que la mise**. Moyenne simple pondérée 25 / 50 / 25 % : +1,7 Md€ de VNA sur 5 Md€, entièrement due à la queue haute (la probabilité de ces scénarios n'est pas estimée, V19611).

### 2.3 Sensibilités (central, 5 Md€ ; VNA en M€, TRI)

| Variable | Valeurs testées → VNA / TRI |
|---|---|
| Utilisation | 40 % : −5 309 / −30,0 % ; 55 % : −3 786 / −14,6 % ; **70 % : −2 264 / −3,6 %** ; 80 % : −1 249 / 1,7 % ; 90 % : −234 / 6,1 % |
| Part du revenu théorique encaissée | 30 % : −6 021 / −39,1 % ; 45 % : −4 142 / −18,0 % ; **60 %** ; 80 % : **+241 / 7,9 %** |
| Baisse annuelle du revenu par GPU-heure | 10 % : −440 / 5,4 % ; **20 %** ; 30 % : −3 656 / −16,8 % ; 40 % : −4 729 / −38,9 % |
| Prix de l'électricité (€/MWh) | 40 : −1 883 / −1,4 % ; **75** ; 100 : −2 536 / −5,4 % ; 140 : −2 972 / −8,6 % |
| Coût du capital (VNA seulement) | 4 % : −1 906 ; 4,94 % : −2 032 ; **7 %** ; 9 % : −2 442 (le TRI ne dépend pas du taux) |
| Durée des puces | 3 ans : −4 491 / −20,6 % ; **5 ans** ; 7 ans : −2 003 |
| Gain par GPU face au H800 | 1× : −6 021 ; 1,5× : −4 142 ; **2×** ; 3× : **+1 493 / 12,3 %** |
| Reprise de génération | 0 % : −4 931 ; 50 % : −3 362 ; **85 %** ; 100 % : −1 793 / −0,5 % |

**Seuils** (central) : pour avoir une VNA nulle au taux de l'État (4,94 %), il faut **87 % d'utilisation** ou **4,57 € de revenu par GPU-heure** (au lieu de 3,71 €) ; au coût du capital de 9 %, 5,09 €. Dans le scénario haut, le seuil n'est que de 2,22 € (23 % d'utilisation) ; dans le bas, 13,3 € : inatteignable. **Une électricité à 40 €/MWh au lieu de 75 ne change la VNA que de ≈ 0,4 Md€** : l'argument « nucléaire pas cher » est vrai mais secondaire ; le capital et le prix des jetons pèsent dix fois plus.

### 2.4 Puces avancées à crédit par le fabricant

Modèle : le fournisseur avance 50 % du capex des serveurs, remboursé en cinq annuités après la construction. Sortie de trésorerie maximale (central, 5 Md€) : **5 000 → 3 926 M€** à 3 %, 4 090 M€ à 6 %, 4 260 M€ à 9 %. La VNA change de peu (−2 264 → −2 039 M€ à 3 %, −2 295 M€ à 9 %). **Un crédit ne crée pas de valeur : il décale le besoin de trésorerie** ; et si le prix des puces intègre le coût du crédit, le gain disparaît. Utile pour le calendrier budgétaire, pas pour la rentabilité. À négocier : durée, taux, clause de reprise (rachat des puces obsolètes), prix de référence, et surtout **l'absence de clause d'exclusivité** (V19609).

### 2.5 Comparaison avec le remboursement de la dette

- Taux de l'OAT à 10 ans : **4,94 % le 03/11/2026** (cote C, Teleborsa ; 5,07 % en séance le 21/10/2026 selon Saxo ; moyenne mensuelle 4,00 % en août 2026) ; à vérifier sur Agence France Trésor (V19612). Ce taux est le coût marginal de la dette nouvelle : rembourser 5 Md€ ou ne pas les emprunter **évite 247 M€ d'intérêts par an, sans risque**.
- **Règle** : investir bat rembourser si le TRI dépasse 4,94 % **plus une prime de risque** (je retiens 2 points, H16, soit ≈ 7 %). Au-dessous de 4,94 %, la dette gagne sans discussion ; entre 4,94 et ≈ 7 %, l'investissement bat la dette mais pas son risque.
- Résultat : **bas** : non ; **central (TRI −3,6 %)** : non ; **haut (47 %)** : oui. Le TRI central atteint 7 % si le revenu par GPU-heure est de ≈ 4,8 € (+30 % sur le central) ; ou 80 % d'utilisation *et* 60 % du revenu théorique avec une baisse annuelle de 10 % (non testé en combinaison : les sensibilités ci-dessus sont une variable à la fois).
- **Nuance** : stabiliser la dette n'est pas la rembourser (tableau de bord, S1 vs S2 : la réforme neutre dégage ≈ 33 Md€ par an de mieux que le droit actuel). Le coût moyen de la dette existante est inférieur à l'OAT d'aujourd'hui ; le calcul pertinent est celui du coût *marginal*.

### 2.6 Centre mixte : usage public, Europe le jour, États-Unis la nuit

**Modèle** (`utilisation_profil`) : capacité = 1 ; trois segments de demande de forme horaire stylisée (plateau de jour, plancher la nuit, rampes d'une heure ; l'interne 8-19 h, l'Europe 8-21 h, les États-Unis 9-19 h heure locale, moitié côte Est décalée de 6 h et moitié côte Ouest de 9 h) ; priorité de service : usage interne, puis Europe, puis États-Unis. **Les formes sont des hypothèses** (V19613) : seul le rapport moyenne/pic de DeepSeek (0,816) est observé, et il vient d'un service déjà lissé par des remises de nuit.

| Cas (demande en part de capacité) | Utilisation obtenue |
|---|---|
| A. interne 0,10 + Europe 0,60 (sans États-Unis, demande 0,70) | 70 % (rien n'est perdu) |
| B. interne 0,10 + Europe 0,30 + États-Unis 0,30 (demande 0,70) | 70 % (même chose : pas de saturation, donc pas de gain) |
| **E. interne 0,10 + Europe 0,90 (demande 1,00, sans États-Unis)** | **78 %** : les pointes de jour saturent, 22 points de demande sont perdus |
| **C. interne 0,10 + Europe 0,45 + États-Unis 0,45 (demande 1,00)** | **89 %** (interne 10, Europe 45, États-Unis 34) : **+11 points d'utilisation** à demande égale |
| D. interne 0,20 + Europe 0,20 (public presque seul) | 40 % |

**Enseignement 1 : le fuseau horaire n'aide que si le centre sature le jour.** Tant que la demande européenne tient sous la capacité en pointe, vendre aux États-Unis ne change pas l'utilisation. Quand elle sature, la nuit américaine permet de vendre ≈ 14 % de GPU-heures de plus avec le même matériel (89 % contre 78 %).

**Enseignement 2 : seuil d'autofinancement.** Utilisation requise pour une VNA nulle au taux de l'État : **87 % au central**, **23 % au haut**. La part minimale des ventes à faire à l'extérieur (au prix de marché), selon que les administrations reversent 0, 50 ou 100 % du prix de marché pour l'usage interne :

| Cas | Central : 0 / 50 / 100 % | Haut : 0 / 50 / 100 % |
|---|---|---|
| A. 70 % d'utilisation | non finançable | 33 / 26 / 19 % |
| C. 89 % d'utilisation | 98 / 92 / 87 % | 26 / 20 / 15 % |
| E. 78 % | non finançable | 30 / 23 / 17 % |
| D. 40 % (public seul) | non finançable | 58 / 33 / 8 % |

Au central, seul le cas C s'approche de l'équilibre, et il exige que presque toute la capacité soit vendue à l'extérieur : **l'usage interne ne finance pas le centre, il le dépense** (sauf s'il remplace des achats publics au prix de marché, ce que le § 1.8 ne permet pas de chiffrer). Au haut, 15 à 33 % de ventes externes suffisent. Le message à retenir : **plus la part externe est faible, plus l'usage public doit être valorisé honnêtement, et le centre n'est alors qu'un moyen de ne pas payer un fournisseur plus cher, pas une entreprise rentable**. Contraintes de l'exportation de nuit : latence supplémentaire de 100 à 150 ms vers les États-Unis (acceptable pour du lot, gênante pour du direct), droit des données (RGPD, clauses types), clients américains réticents à un fournisseur d'État étranger (V19613).

### 2.7 Refroidissement, eau et site près d'une centrale

**Ce que font les baies récentes.** Les GB200 et GB300 NVL72 refroidissent processeurs, GPU et commutateurs par **liquide direct sur la puce, en circuit fermé** ; ≈ 90 % de la chaleur part dans le liquide, ≈ 10 % reste à l'air (fiches Lenovo et HPE, cote **C/D**, V19614). Le liquide ne s'évapore pas ; la chaleur est ensuite évacuée soit par des **aéroréfrigérants secs** (échangeurs à air, sans eau consommée), soit par des **tours évaporatives ou adiabatiques** (eau consommée). Nvidia revendique une efficacité hydrique « 300 fois » supérieure (revendication du fabricant : **D**). La température d'entrée admise est **débattue** : Uptime Institute (B) dit 45 °C pour GB200 et GB300 ; un blog technique dit 30-35 °C pour le GB300 et 45 °C pour la génération suivante (V19614). Plus l'eau admise est chaude, plus le refroidissement sec suffit, y compris l'été.

**Ce qui consomme de l'eau.** L'ordre de grandeur est de l'ordre de **1,8 litre par kWh** pour un site à tours évaporatives (moyenne d'enquêtes sectorielles, de mémoire, V19614) ; un centre de 152 MW (1,3 TWh par an) en consommerait alors ≈ **2,4 millions de m³ par an**, contre près de zéro en refroidissement sec en circuit fermé. **Choix du plan** : refroidissement sec en circuit fermé par défaut, appoint adiabatique limité aux canicules, consommation d'eau publiée en continu. Coût : légère hausse de la consommation d'électricité (le PUE de 1,20 central, plus élevé que les 1,14 d'Epoch, l'intègre en partie) et surface d'échangeurs.

**Avantages d'un site près d'une centrale** (B/C) : raccordement au réseau de transport déjà existant et dimensionné (les quatre terrains EDF : ≈ 2 GW) ; électricité bas carbone, récit d'acceptabilité plus simple ; terrains industriels déjà classés ; l'État est actionnaire d'EDF, donc propriétaire des terrains. **Contraintes** : (1) on ne s'installe pas dans le périmètre de l'installation nucléaire de base : le terrain est voisin, soumis aux règles de sûreté et de défense de la zone et probablement à avis de l'autorité de sûreté (⚠ à vérifier) ; (2) **les centrales réduisent leur production en cas d'eau trop chaude** : la canicule d'été 2026 a vu la baisse de production nucléaire (positions de l'auteur, ⚠ déjà à vérifier), précisément quand les échangeurs secs sont le moins efficaces ; il faut dimensionner l'appoint et la flexibilité ; (3) les sites ruraux n'ont **pas de réseau de chaleur voisin** : réutiliser la chaleur y est plus difficile qu'en ville ; (4) l'eau du fleuve voisin est un bien commun déjà disputé (refroidissement de la centrale, irrigation) : le plan n'en prélève pas ; (5) autorisations ICPE, raccordement RTE, étude d'impact, concertation : plusieurs années.

### 2.8 Résilience énergétique sans gaz

**Choix de l'auteur** : aucune turbine à gaz sur site (jugé inacceptable). Contexte : aux États-Unis, xAI à Memphis a installé des dizaines de turbines (≈ 35 pour 422 MW sur le site d'origine selon une presse spécialisée), sans permis fédéraux de qualité de l'air, a dû en retirer et fait l'objet de recours ; la logique est la **vitesse** (premier centre en 4 mois contre 5 ans d'attente de raccordement) ; Cleanview compte ≈ 60 projets de centres avec 97 GW de production hors réseau (cote C). Un turbinier tel que décrit par la presse livre en 18 à 36 mois pour les petites unités et ≈ 5 ans pour les grandes ; le coût installé cité va de ≈ 1 000 à 3 000 $/kW (**C/D**, sources discordantes, V19615).

| Option | Fonction | Coût et délai | Résilience obtenue |
|---|---|---|---|
| **Raccordement HTB 400 kV sur un poste de centrale**, avec **deux liaisons indépendantes** (double alimentation) | alimentation normale | raccordement ≈ 0,16 M$/MW dans Epoch (hors renforcements) ; délais de 3 à 7 ans | résiste à la perte d'une liaison ; ne résiste pas à une perte du poste ou du réseau régional |
| **Batteries à onduleur** | tenir quelques minutes, le temps de basculer ou de se délester | inclus dans le « bâtiment » d'Epoch (11,4 M$/MW) ; batteries stationnaires à ≈ 78 $/MWh nivelé en 2025 (BNEF, cote B/C) | secondes à minutes ; rien d'autre |
| **Batteries de longue durée (2 à 4 h)** | passer une pointe ou une coupure courte, flexibilité vendue à RTE | coût non sourcé ici (V19615) | quelques heures |
| **Groupes électrogènes de secours** (diesel, ou HVO) | coupure longue | **non sourcé** ; carburant ≈ 12 000 litres par MW pour 48 h de réserve (**estimation** à 0,25 L/kWh) ; fonctionnent quelques dizaines d'heures par an (essais) | jours ; émission locale ponctuelle |
| **Délestage contractuel** (l'inférence « différée » s'arrête, l'inférence temps réel continue) | réduire la charge | quasi nul | dépend du contrat de service |
| **Réplication multi-sites** | continuité de service sans redondance totale | coût de l'interconnexion | l'inférence est sans état : un second site de ≥ 30 % de la capacité vaut mieux que 100 % de secours local |

**Estimation du coût pour le plan** : la résilience sans gaz tient à la double alimentation, aux batteries d'onduleur et aux groupes de secours courts, déjà couverts par le poste « bâtiment ». Pour le tester, le modèle ajoute jusqu'à 4 M$ par MW de surcoût : la VNA centrale à 5 Md€ passe de −2 264 à **−2 509 M€** (−0,25 Md€), le TRI de −3,6 % à −4,8 %, et la capacité de 152 à 137 MW. **Sans gaz, le coût est modeste et le principal risque reste le délai de raccordement**, pas l'argent. Ne pas dimensionner pour 100 % de secours sur site : pour de l'inférence commerciale, le niveau de service se règle par contrat et par réplication.

## 3. Steelman : objections et réponses

| Objection | Réponse | Reste ouvert |
|---|---|---|
| **Guerre des prix** : les hyperscaleurs américains (Microsoft, Google, Amazon) et chinois (DeepSeek) peuvent vendre à perte plus longtemps que l'État ; le revenu par GPU-heure peut s'effondrer | C'est le premier facteur de risque du modèle (baisse de 30 % par an : VNA −3,7 Md€ à 5 Md€ ; scénario bas −10,6 Md€). Réponse : un premier palier modeste, des clients d'ancrage (usage public, défense, recherche) qui ne dépendent pas du prix de marché | pas de prévision de prix honnête au-delà de 2 ans |
| **Dépréciation rapide** des puces (3 à 5 ans) | Modélisée (3 / 5 / 7 ans) ; le bâtiment et le raccordement durent 15 ans et conservent leur valeur ; stratégie de renouvellement par tranches | débat sur la durée de vie économique des GPU, non tranché |
| **Dépendance au fournisseur** (Nvidia, contrôles à l'exportation américains) | Réelle et incompressible à l'horizon 2028 ; un crédit du fabricant l'aggrave (exclusivité, prix) ; parade : puces européennes en minorité, interopérabilité des logiciels, clause de non-exclusivité | aucune alternative européenne à l'échelle (§ 1.3) |
| **Demande européenne réelle** : si l'Europe manque d'inférence, pourquoi les opérateurs privés (Mistral, Scaleway, OVH, Fluidstack) ne l'ont-ils pas déjà ? | Ils le font (§ 1.6) ; la rareté européenne est moins une rareté de *calcul* que de *raccordement électrique, de foncier et de capital patient* ; l'État peut apporter ces trois choses, pas un marché | pas d'étude de demande trouvée (V19611) |
| **Aides d'État et droit de la concurrence** (art. 107 TFUE ; règles de l'UE sur les aides à l'IA ; principe de l'investisseur privé avisé) | Un centre public qui investit à des conditions que n'accepterait pas un investisseur privé (TRI central < taux de marché) est une aide d'État. L'appel EuroHPC ouvre une voie européenne de cofinancement ; il faut notifier ou passer par un projet important d'intérêt européen commun | ⚠ avis juridique à demander ; **le central, à TRI négatif, ne passe pas le test de l'investisseur avisé** |
| **Gouvernance** d'une entreprise publique : capture politique, nominations, objectifs contradictoires | Règles de l'entreprise d'État (chapitre 12) : autonomie de la direction, objectifs chiffrés publiés, comptes publics, jalons contraignants | l'État reste le client et l'actionnaire : conflit d'intérêts structurel |
| **Échecs passés** : Plan Calcul (1966, absorbé par un concurrent américain), Cloudwatt et Numergy (75 M€ d'argent public chacun en 2012, échecs) | C'est exactement l'objection du chapitre 12 : ces échecs étaient des champions nationaux *sans clients captifs ni échelle*. Ici : échelle, électricité, clients publics. Mais un cloud d'État sans clients privés est le profil exact de Cloudwatt | Cloudwatt visait des clients privés qui ne sont pas venus |
| **Bulle IA** : la demande de jetons pourrait se retourner | Les modèles, poids ouverts et GPU resteront (position de l'auteur) ; mais une surcapacité européenne ferait chuter les prix, donc le revenu | aucune donnée sur l'élasticité de la demande |
| **Dette d'abord** : un risque pour un gain incertain contre un gain certain de 4,94 % | Argument décisif pour les scénarios bas et central (§ 2.5) | |

**Établi** : les chiffres de DeepSeek, les coûts d'un centre américain (Epoch), l'appel d'EuroHPC, la fin de l'ARENH. **Débattu** : la durée de vie économique des GPU, le prix des jetons à terme, le niveau d'utilisation soutenable. **Manquant** : prix des CAPN pour un centre de données, marchés publics de cloud et d'IA de l'État, prix de crédit d'un fabricant, demande européenne chiffrée, coût européen du bâtiment, gain réel des Blackwell face aux H800 pour les modèles servis.

## 4. Acceptabilité

### 4.1 Les oppositions réelles

- **Irlande** : les centres de données représentaient ≈ 14 % de la consommation d'électricité en 2021 ; le gestionnaire du réseau a suspendu les nouveaux raccordements dans la région de Dublin (2021) et abandonné ≈ 30 projets (2022) ; le gouvernement a refusé un moratoire formel mais limité les nouveaux projets jusqu'à 2028 selon l'AFP en 2022 (**C**). Un élu de Dublin a fait voter une interdiction dans son arrondissement, au motif d'un « espace énorme » pour « presque aucun emploi ».
- **Pays-Bas** : Amsterdam a dit ne plus avoir « de place » pour des entrepôts de données ; la mobilisation locale a contribué à arrêter un projet de Meta en 2022 (AFP, **C**). Des sources secondaires parlent d'un moratoire national de neuf mois et d'une suspension à Amsterdam jusqu'en 2030 : **non réconcilié** (V19616).
- **France** : l'opposition locale a contribué à arrêter un projet d'Amazon en 2022 (AFP) ; à **Marseille**, des militants affirment que la croissance des centres bloque l'électrification du port et des ferries (source militante, **D**, V19616).
- **Luxembourg** : projet Google arrêté en 2022 (AFP).
- **Attention à la date** : l'article AFP utilisé date de **septembre 2022** (le moteur de recherche l'avait daté de 2026) ; l'état de ces moratoires en 2026 est à relire (V19616).

Les motifs récurrents : électricité (concurrence avec logements et industries), eau, foncier, peu d'emplois, bruit, perte de confiance envers les grandes entreprises du numérique.

### 4.2 Ce qui rend un centre acceptable (et ce que le plan s'engage à faire)

1. **Refroidissement sans eau** : circuit fermé et aéroréfrigérants secs par défaut, consommation d'eau publiée (§ 2.7).
2. **Chaleur fatale réutilisée** : exemples français réels : Val d'Europe (Dalkia, ≈ 7,8 MW thermiques, réseau de 4 km, couvrant 90 % des besoins des bâtiments raccordés) ; Météo-France à Toulouse (≈ 1 800 logements, 27 bâtiments) ; OVHcloud à Roubaix (autorisation de raccordement) ; Allemagne : obligation par la loi de proposer la chaleur aux réseaux (cote **C**, V19617). Contrainte : une chaleur à 40-55 °C ne vaut que près de bâtiments ou de serres ; sur un site de centrale rural, il faut **créer** le débouché (serres, séchage, piscine) ou renoncer.
3. **Électricité sans gaz ni diesel en fonctionnement** (§ 2.8) ; énergie bas carbone attestée ; **flexibilité vendue à RTE** (réduction de charge aux pointes) : le centre devient un partenaire du réseau, pas un concurrent des habitants.
4. **Priorité des usages** : engagement contractuel de ne pas retarder les raccordements d'habitat ou d'industrie (le grief d'Amsterdam et de Londres).
5. **Retombées locales** : taxes locales, emplois (peu nombreux : c'est le point faible), accès local à la puissance de calcul (écoles, hôpitaux voisins), fonds de territoire.
6. **Concertation préalable et transparence** : consommations d'électricité et d'eau publiées chaque mois ; auditable par les riverains.

**Limite que le plan doit dire** : un centre de 150 MW emploie quelques dizaines de personnes ; on ne peut pas acheter l'acceptabilité avec des emplois. Et un site près d'une centrale nucléaire est **plus facile à accepter pour l'électricité, plus difficile pour la chaleur et la sûreté**.

## 5. Conclusion (analyse de Claude)

1. **L'inférence n'est pas, d'après ce modèle, un investissement rapidement rentable au central.** Elle l'est dans le scénario haut (retour en 2,7 ans, TRI de 47 %), ce qui suppose un revenu par GPU-heure de ≈ 7,4 € (le double du central), un gain de 3× par GPU face aux H800 et 80 % du revenu théorique encaissé. Elle perd dans le bas. La marge publiée par DeepSeek (545 %) est un prix de 2025 : au tarif de 2026, elle est de 78 % avant tous les coûts propres d'un centre.
2. **Je ne peux pas affirmer que c'est l'investissement le plus rapidement rentable.** Je n'ai comparé qu'à la dette ; les autres placements publics (rénovation des bâtiments, numérisation des services, réseaux, regroupements d'achats) ne sont pas chiffrés ici. Les « économies de l'industrie de la complexité » reconverties peuvent rapporter plus vite et avec moins de risque.
3. **À quelles conditions** l'inférence devient défendable : (a) un **revenu par GPU-heure ≥ ≈ 4,6 €** démontré par des contrats, pas supposé ; (b) un **taux d'utilisation de ≥ 80 %** grâce à des clients d'ancrage publics et à une vente nocturne aux États-Unis ; (c) une électricité sous contrat de long terme ; (d) un **crédit du fournisseur à un taux sous 6 %, sans exclusivité, avec reprise des puces** (il ne crée pas de valeur mais allège la trésorerie) ; (e) un avis juridique sur les aides d'État.
4. **Garde-fous (paliers et sorties)** :
   - **Palier 1 : ≈ 1 Md€ (≈ 30 MW)**, avec 30 à 50 % de la capacité en contrats d'ancrage signés avant la commande des puces. Jalons à 18 mois : utilisation ≥ 70 %, revenu par GPU-heure ≥ 3,7 € encaissé.
   - **Palier 2 : jusqu'à 4 Md€ de plus** seulement si le TRI observé du palier 1 dépasse l'OAT + 2 points ; la tranche est commandée par lots (une tranche = 12 mois de puces).
   - **Point de sortie** : si l'utilisation reste sous 55 % deux ans de suite, ou si le revenu par GPU-heure passe sous 2,5 €, on arrête les achats, on loue la capacité excédentaire (ou on la revend à un opérateur), on garde le bâtiment, qui conserve sa valeur.
   - Publication trimestrielle de l'utilisation, du revenu, de la consommation d'eau et d'électricité.
5. **Quelle part des économies y consacrer plutôt qu'à la dette ?** Sur la marge de ≈ 33 Md€ par an de la réforme neutre (tableau de bord, S1), **je mettrais l'essentiel à la dette et à la réforme, et au plus ≈ 1 Md€ par an (≈ 3 %) à l'inférence pendant le palier 1**, sans dépasser 5 Md€ cumulés tant que le TRI observé ne bat pas l'emprunt d'État plus la prime de risque. Cette règle est la seule qui tient dans les trois scénarios : elle limite la perte de valeur du scénario central à ≈ 0,45 Md€ au palier 1 (−453 M€ à 1 Md€), contre −2,3 Md€ à 5 Md€ et −4,5 Md€ à 10 Md€.
6. **Mon biais** : j'ai calé le scénario central sur un marché proche de l'équilibre (revenu ≈ coût complet), ce qui est la conclusion standard des économistes pour un marché concurrentiel ; un lecteur plus optimiste mettrait un gain de 3× et 80 % de réalisation, et trouverait +1,5 Md€ ; un lecteur plus pessimiste, −6 Md€. **Mon conflit d'intérêts** (Anthropic vend de l'inférence) pousserait plutôt à surestimer le marché ; la prudence du palier 1 est ma façon d'en tenir compte.
7. **Ce que j'aurais dit avec un autre entraînement** : peut-être « foncez, le marché est énorme », parce que le récit dominant du secteur est celui-là ; je me méfie de cette pente, et le chiffre qui me retient est le TRI central négatif.

## 6. Sources et synthèse (règle format)

- DeepSeek, « DeepSeek-V3/R1 Inference System Overview », GitHub `deepseek-ai/open-infra-index`, 01/03/2025, consulté le 07/11/2026 (B ; conflit : publicité de l'émetteur).
- Epoch AI, « AI datacenter cost breakdown », 14/05/2026, https://epoch.ai/data-insights/ai-datacenter-cost-breakdown, consulté le 07/11/2026 (B).
- Epoch AI, « LLM inference price trends », mise à jour 05/02/2026, consulté le 07/11/2026 (B) ; Gundlach, Lynch, Mertens, Thompson, « The Price of Progress », arXiv 2511.23455, 11/2025 (B).
- EuroHPC JU, communiqué du 30/07/2026, https://www.eurohpc-ju.europa.eu/eurohpc-joint-undertaking-launches-ai-gigafactories-call-2026-07-30_en, consulté le 07/11/2026 (A/B).
- Uptime Institute, note sur le refroidissement des GB200/GB300, consultée par résumé (B) ; Tom's Hardware, 2025 (C) ; fiches HPE, Lenovo, Gigabyte (D, communication commerciale).
- Connaissance des énergies/AFP : ARENH, VNU, CAPN, contrats EDF (C) ; EDF, quatre sites pour centres de données, 10/02/2025 (C).
- Teleborsa, rendement de l'OAT à 10 ans, 03/11/2026 (C).
- AFP via eNCA, « How the tide turned on data centres in Europe », 14/09/2022 (C) ; Dalkia, Météo-France, OVHcloud (C).
- Presse financière et chroniques sur le financement de Nvidia (C/D) ; Cleanview, Canary Media, DCD sur xAI (C).
- `chapitres/12-entreprise-etat-technologie.md`, `modeles/rattrapage-robotique-ia/`, document de travail de l'atelier, non publié, `sources/nucleaire-ou-alternatives.md`.

**Ce que les sources établissent** : une marge d'inférence de 2025 énorme mais théorique et fragile ; un coût de centre d'environ 38 M$/MW ; une baisse rapide des prix par capacité ; un programme européen en cours d'attribution. **Ce qu'elles n'établissent pas** : la rentabilité d'un opérateur d'État européen en 2028-2035.
