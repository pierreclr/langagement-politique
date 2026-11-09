# Dossier énergie européen (T57, livrable énergie)

> Rédigé le 03/11/2026. Complète la section 2 de `sources/recherche-concurrences-intra-europeennes.md` (écarts de prix 2024, Draghi, EPRS) sans la refaire.
> Légende (règle 3) : **fait sourcé** / **estimation** (méthode donnée) / **opinion de l'auteur**. Les points non confirmés portent ⚠️ et un numéro V56xx (`verifications.md`).
> Reproductibilité : `sources/calculs/energie_europe.py` (résultats : `sources/calculs/energie_europe_resultats.txt`) ; données dans `$DONNEES/sources/europe/energie/` ; graphique `$DONNEES/resultats/europe/energie_europe.png`.
> Avertissement : les tableaux de prix sont des **moyennes simples des deux semestres** d'une année, par bande de consommation précise (indiquée) ; ils ne représentent pas la facture moyenne d'un pays. Les pays retenus (11 + UE-27) ne sont pas l'UE entière.

## 1. Ce qu'il faut retenir (opinion de l'auteur, appuyée sur les tableaux)

1. **Le nucléaire est un avantage de coût réel mais irrégulier.** Pour une entreprise de 2 à 20 GWh par an, la France paie en 2025 12,5 c€/kWh hors TVA contre 19,3 en Allemagne et 16,2 en moyenne UE-27 ; mais en 2023 elle a payé 21,3, plus que l'Allemagne (20,4). L'avantage n'a donc pas été continu (§3.2).
2. **Pour les ménages, l'écart est moins net qu'on ne le dit.** En 2025 : France 26,2 c€/kWh toutes taxes comprises, UE-27 28,9, Allemagne 38,5. Mais la France a augmenté de 56 % depuis 2015 (16,8 à 26,2) contre 31 % pour l'Allemagne (29,5 à 38,5) et 38 % pour l'UE-27 (20,9 à 28,9).
3. **Le marché unique exporte l'avantage français plus qu'il ne le rapporte aux consommateurs français.** Solde exportateur record : 90,0 TWh en 2024 et 93,8 TWh en 2025 (Eurostat). Valeur indicative d'environ 5 à 6 Md€ par an au prix de gros français (estimation grossière, §4.3). Les prix de gros français sont inférieurs de 20 à 26 €/MWh aux allemands en 2024-2025, mais supérieurs de 40 €/MWh en 2022.
4. **Les taxes ne suivent pas le principe pollueur-payeur.** En 2025, les taxes hors TVA sur l'électricité des ménages sont de 3,7 c€/kWh en France (mix à 40 gCO2e/kWh) et de 2,0 c€/kWh sur le gaz (environ 200 g par kWh brûlé) : l'électricité décarbonée est taxée plus lourdement que le gaz par kWh (§6.2, avec réserve de périmètre).
5. **La concurrence par les subventions existe et se mesure en dizaines de milliards** (Allemagne 7,4 % du PIB de soutien à l'énergie sur 2021-2023 selon Bruegel, France 3,7 % ; source secondaire ⚠️ V5666).
6. **Les règles de décision expliquent une partie du blocage** : la taxation de l'énergie est à l'unanimité (article 113 TFUE) et la révision proposée en 2021 est bloquée ; l'organisation du marché a progressé à la majorité qualifiée (règlement 2024/1747).

## 2. Prix 2015-2025 par pays, bandes de consommation précisées

Sources : Eurostat `nrg_pc_204` (électricité ménages, bande DC 2 500 à 4 999 kWh par an), `nrg_pc_205` (électricité non ménages, bande ID 2 000 à 19 999 MWh par an), `nrg_pc_202` (gaz ménages, bande D2 20 à 199 GJ par an), `nrg_pc_203` (gaz non ménages, bande I3 10 000 à 99 999 GJ par an), diffusés par l'API JSON-stat le 03/11/2026 (mise à jour Eurostat du 16-19/10/2026). Prix en euros courants par kWh, converti en c€/kWh. Entreprises : prix hors TVA et autres taxes récupérables (X_VAT), qui est le coût réel d'une entreprise assujettie.

#### Électricité, ménages (bande DC 2 500-4 999 kWh/an), toutes taxes comprises (c€/kWh, moyenne simple des deux semestres)
| Pays | 2015 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|
| France | 16.8 | 18.5 | 19.8 | 21.5 | 24.5 | 28.9 | 26.2 |
| Allemagne | 29.5 | 29.8 | 32.1 | 33.2 | 40.7 | 39.5 | 38.5 |
| Italie | 24.4 | 23.2 | 23.1 | 33.8 | 35.6 | 31.9 | 31.3 |
| Espagne | 23.4 | 24.0 | 25.7 | 32.1 | 24.0 | 24.2 | 26.4 |
| Pays-Bas | 19.2 | 20.5 | 13.6 | 8.8 | 30.3 | 23.5 | 24.7 |
| Pologne | 14.3 | 13.6 | 15.6 | 15.3 | 19.7 | 22.8 | 26.3 |
| Suède | 18.7 | 20.4 | 23.6 | 25.1 | 24.2 | 23.9 | 26.8 |
| Belgique | 22.4 | 28.5 | 28.5 | 39.6 | 40.6 | 33.3 | 35.4 |
| Danemark | 30.6 | 29.5 | 31.7 | 52.1 | 36.8 | 37.4 | 34.0 |
| Autriche | 20.0 | 20.5 | 22.5 | 23.1 | 27.0 | 25.8 | 30.9 |
| Irlande | 24.4 | 24.8 | 27.6 | 27.7 | 32.6 | 28.2 | 36.4 |
| UE-27 | 20.9 | 21.7 | 23.1 | 26.3 | 28.7 | 29.0 | 28.9 |

#### Électricité, entreprises (bande ID 2-20 GWh/an), hors TVA récupérable (c€/kWh, moyenne simple des deux semestres)
| Pays | 2015 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|
| France | 8.7 | 8.1 | 8.8 | 12.0 | 21.3 | 14.3 | 12.5 |
| Allemagne | 13.1 | 13.4 | 15.7 | 19.4 | 20.4 | 20.5 | 19.3 |
| Italie | 14.9 | 14.1 | 14.7 | 27.5 | 22.5 | 19.2 | 19.9 |
| Espagne | 9.6 | 9.5 | 12.0 | 21.5 | 13.9 | 12.3 | 12.2 |
| Pays-Bas | 8.1 | 8.8 | 11.8 | 19.2 | 24.0 | 19.6 | 18.6 |
| Pologne | 7.6 | 8.5 | 9.8 | 15.6 | 20.4 | 18.4 | 17.3 |
| Suède | 5.3 | 6.3 | 7.4 | 11.6 | 8.8 | 7.8 | 8.4 |
| Belgique | 9.6 | 9.9 | 10.9 | 17.9 | 21.4 | 16.2 | 16.1 |
| Danemark | 9.0 | 6.8 | 9.8 | 18.8 | 12.3 | 11.8 | 12.5 |
| Autriche | 9.0 | 9.5 | 11.4 | 18.4 | 22.7 | 17.6 | 18.0 |
| Irlande | 11.4 | 10.5 | 14.5 | 22.1 | 22.9 | 22.1 | 22.7 |
| UE-27 | 10.2 | 10.4 | 12.1 | 18.8 | 19.4 | 16.7 | 16.2 |

#### Gaz, ménages (bande D2 20-199 GJ/an), toutes taxes comprises (c€/kWh, moyenne simple des deux semestres)
| Pays | 2015 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|
| France | 7.2 | 7.9 | 7.4 | 9.3 | 11.1 | 12.6 | 13.7 |
| Allemagne | 6.8 | 6.1 | 6.7 | 8.7 | 11.9 | 12.2 | 12.2 |
| Italie | 8.4 | 8.5 | 8.5 | 11.5 | 11.6 | 13.6 | 13.6 |
| Espagne | 8.4 | 8.8 | 8.9 | 12.4 | 10.4 | 8.8 | 9.1 |
| Pays-Bas | 7.8 | 10.0 | 10.8 | 16.0 | 17.5 | 16.7 | 16.6 |
| Pologne | 5.0 | 4.7 | 4.2 | 5.5 | 7.1 | n.d. | n.d. |
| Suède | 11.5 | 11.4 | 17.5 | 24.8 | 21.3 | 18.3 | 21.1 |
| Belgique | 6.0 | 5.6 | 5.7 | 11.5 | 10.7 | 8.5 | 9.1 |
| Danemark | 9.0 | 8.1 | 10.7 | 18.0 | 14.4 | 12.7 | 12.8 |
| Autriche | 7.2 | 6.7 | 6.7 | 10.0 | 15.2 | 13.1 | 12.2 |
| Irlande | 7.0 | 7.2 | 7.0 | 12.0 | 15.5 | 13.1 | 12.5 |
| UE-27 | 7.0 | 7.0 | 7.1 | 9.9 | 11.5 | 11.7 | 11.9 |

#### Gaz, entreprises (bande I3 10 000-99 999 GJ/an), hors TVA récupérable (c€/kWh, moyenne simple des deux semestres)
| Pays | 2015 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|
| France | 3.7 | 3.7 | 4.2 | 6.7 | 8.0 | 6.9 | 6.6 |
| Allemagne | 3.9 | 3.1 | 3.5 | 5.7 | 7.8 | 7.0 | 7.2 |
| Italie | 3.4 | 3.2 | 3.4 | 9.3 | 7.7 | 5.6 | 5.7 |
| Espagne | 3.3 | 3.1 | 2.9 | 8.9 | 6.2 | 4.8 | 5.1 |
| Pays-Bas | 3.5 | 3.4 | 4.3 | 7.2 | 7.5 | 6.8 | 7.6 |
| Pologne | 3.6 | 3.4 | 3.5 | 8.6 | 9.5 | n.d. | 6.7 |
| Suède | 4.3 | 5.1 | 8.5 | 15.5 | 12.4 | 10.4 | 10.6 |
| Belgique | 2.9 | 2.3 | 2.8 | 5.6 | 5.8 | 4.9 | 4.9 |
| Danemark | 3.8 | 3.2 | 5.7 | 12.2 | 6.3 | 5.8 | 6.7 |
| Autriche | 3.9 | 3.2 | 3.9 | 7.4 | 7.0 | 5.7 | 6.7 |
| Irlande | 3.8 | 3.3 | 4.4 | 7.5 | 7.3 | 6.8 | 6.9 |
| UE-27 | 3.6 | 3.2 | 3.6 | 7.6 | 7.6 | 6.3 | 6.3 |

**Lecture.**
- **Fait sourcé** : en 2025, l'électricité industrielle (2-20 GWh) coûte 8,4 c€/kWh en Suède, 12,2 en Espagne, 12,5 en France, 17,3 en Pologne, 19,3 en Allemagne et 19,9 en Italie : un rapport de 2,3 entre la Suède et l'Italie dans le même marché intérieur.
- **Fait sourcé** : le prix du gaz industriel est beaucoup plus homogène (5,1 à 7,6 c€/kWh pour la plupart) ; la Suède se détache à 10,6 (accises élevées, voir §2.1).
- **Fait sourcé** : la Pologne n'a pas de donnée de gaz ménages en 2024 et 2025 dans le jeu téléchargé (n.d.).
- **Point d'attention (France 2022-2023)** : le prix industriel français passe de 12,0 (2022) à 21,3 (2023) puis 14,3 (2024). Le prix de gros français a été de 275 €/MWh en 2022 (plus que l'Allemagne, 236), ce qui est cohérent avec le retard de répercussion par les contrats. **Fait lu à la source primaire** (RTE, Bilan électrique 2022, rapport complet, https://assets.rte-france.com/analyse-et-donnees/2023-09/Bilan%20%C3%A9lectrique%202022%20rapport%20V4%20(1).pdf, lu avec pypdf le 03/11/2026) : la production nucléaire française de 2022 est de 279 TWh (62,7 % de la production), contre 360,7 TWh en 2021, soit le niveau le plus bas depuis 1988 et 30 % sous la moyenne des vingt années précédentes, en raison d'une disponibilité historiquement faible du parc (corrosion sous contrainte, arrêts de contrôle et de réparation depuis fin 2021) ; la sécheresse a aussi ramené l'hydraulique à son plus bas depuis 1976. **Hypothèse** (📐 V5660 : non démontrée) : ce choc de 2022 et le retard de répercussion des contrats expliquent les prix industriels français de 2022-2023 ; le rôle du plafond de l'ARENH n'a pas été relu.
- **Limite** : Eurostat indique que les prix des ménages intègrent depuis 2021 les subventions et remises (cas des Pays-Bas en 2022 : 8,8 c€/kWh, effet d'un crédit d'impôt et d'un plafond, à vérifier ⚠️ V5670).

### 2.1 Décomposition énergie / réseau / taxes (2025, année complète)

Source : Eurostat `nrg_pc_204_c`, `nrg_pc_205_c`, `nrg_pc_202_c`, `nrg_pc_203_c` (mêmes bandes). **Vérifié sur les données** : la composante « taxes, redevances et prélèvements » inclut la TVA et le total des trois composantes retrouve le prix toutes taxes comprises de la table semestrielle. Pour les ménages, la TVA est une composante de ces taxes (colonne « dont TVA »).

#### Décomposition, électricité ménages (2025, c€/kWh)
| Pays | Énergie et fourniture | Réseau | Taxes, redevances et prélèvements (TVA incluse) | dont TVA | Total | Part taxes |
|---|---:|---:|---:|---:|---:|---:|
| France | 10.9 | 7.6 | 7.7 | 4.0 | 26.2 | 30 % |
| Allemagne | 14.8 | 11.3 | 12.4 | 6.2 | 38.5 | 32 % |
| Italie | 18.0 | 4.4 | 8.9 | 2.9 | 31.3 | 28 % |
| Espagne | 11.1 | 7.1 | 8.2 | 4.4 | 26.4 | 31 % |
| Pays-Bas | 14.7 | 11.3 | -1.4 | 4.3 | 24.7 | -6 % |
| Pologne | 7.7 | 7.2 | 11.3 | 4.9 | 26.3 | 43 % |
| Suède | 6.9 | 10.7 | 9.4 | 5.4 | 26.9 | 35 % |
| Belgique | 15.4 | 12.0 | 8.0 | 2.0 | 35.4 | 23 % |
| Danemark | 9.6 | 7.9 | 16.6 | 7.0 | 34.1 | 49 % |
| Autriche | 16.0 | 9.6 | 5.3 | 5.1 | 30.9 | 17 % |
| Irlande | 22.9 | 12.4 | -1.6 | 3.2 | 33.8 | -5 % |
| UE-27 | 12.5 | 8.2 | 8.3 | 4.4 | 28.9 | 29 % |
Note : total = énergie et fourniture + réseau + taxes (TVA incluse), ce qui retrouve le prix toutes taxes comprises de la table semestrielle ; une valeur négative de taxes signale des compensations supérieures aux prélèvements.

#### Décomposition, électricité entreprises (2-20 GWh) (2025, c€/kWh)
| Pays | Énergie et fourniture | Réseau | Taxes, redevances et prélèvements (TVA incluse) | dont TVA | Total | Part taxes |
|---|---:|---:|---:|---:|---:|---:|
| France | 8.8 | 2.3 | 3.6 | 2.2 | 14.7 | 24 % |
| Allemagne | 10.5 | 5.5 | 7.7 | 3.8 | 23.7 | 32 % |
| Italie | 13.1 | 2.3 | 6.9 | 2.4 | 22.2 | 31 % |
| Espagne | 9.1 | 1.8 | 3.8 | 2.5 | 14.7 | 26 % |
| Pays-Bas | 10.1 | 4.6 | 7.8 | 3.9 | 22.5 | 35 % |
| Pologne | 7.9 | 3.4 | 10.0 | 4.0 | 21.3 | 47 % |
| Suède | 5.9 | 2.5 | 2.2 | 2.1 | 10.6 | 20 % |
| Belgique | 10.2 | 3.2 | 6.1 | 3.4 | 19.5 | 31 % |
| Danemark | 9.2 | 3.2 | 5.6 | 5.5 | 18.0 | 31 % |
| Autriche | 11.7 | 4.0 | 5.9 | 3.6 | 21.6 | 27 % |
| Irlande | 16.6 | 5.3 | 2.4 | 1.7 | 24.3 | 10 % |
| UE-27 | 10.2 | 3.4 | 5.8 | 3.0 | 19.3 | 30 % |
Note : total = énergie et fourniture + réseau + taxes (TVA incluse), ce qui retrouve le prix toutes taxes comprises de la table semestrielle ; une valeur négative de taxes signale des compensations supérieures aux prélèvements.

#### Décomposition, gaz ménages (D2) (2025, c€/kWh)
| Pays | Énergie et fourniture | Réseau | Taxes, redevances et prélèvements (TVA incluse) | dont TVA | Total | Part taxes |
|---|---:|---:|---:|---:|---:|---:|
| France | 6.5 | 3.1 | 4.0 | 2.1 | 13.6 | 30 % |
| Allemagne | 6.0 | 2.4 | 3.9 | 1.9 | 12.2 | 32 % |
| Italie | 6.5 | 2.6 | 3.7 | 1.9 | 12.9 | 29 % |
| Espagne | 5.4 | 1.5 | 2.1 | 1.6 | 9.0 | 23 % |
| Pays-Bas | 5.9 | 1.8 | 8.8 | 2.9 | 16.5 | 53 % |
| Pologne | n.d. | | | | | |
| Suède | 9.1 | 4.6 | 7.6 | 4.3 | 21.3 | 36 % |
| Belgique | 5.7 | 1.9 | 1.5 | 0.5 | 9.1 | 16 % |
| Danemark | 4.8 | 1.9 | 6.2 | 2.6 | 12.8 | 48 % |
| Autriche | 6.2 | 2.3 | 3.7 | 2.0 | 12.2 | 30 % |
| Irlande | 6.7 | 3.6 | 2.1 | 1.0 | 12.3 | 17 % |
| UE-27 | 5.7 | 2.3 | 3.5 | 1.8 | 11.5 | 30 % |
Note : total = énergie et fourniture + réseau + taxes (TVA incluse), ce qui retrouve le prix toutes taxes comprises de la table semestrielle ; une valeur négative de taxes signale des compensations supérieures aux prélèvements.

**Lecture.**
- **Fait sourcé** : l'Allemagne cumule le coût de réseau le plus élevé des grands pays (11,3 c€/kWh ménages ; 5,5 pour l'industrie contre 2,3 en France) et les taxes les plus lourdes : le désavantage allemand pour l'industrie (27,5 c€/kWh en tout contre 16,9 en France) vient pour environ un sixième de l'énergie (10,5 contre 8,8) et pour le reste du réseau (5,5 contre 2,3) et des taxes (7,7 contre 3,6, TVA récupérable incluse).
- **Fait sourcé** : le Danemark a la part de taxes la plus élevée des ménages (49 %, soit 16,6 c€/kWh dont 7,0 de TVA).
- **Fait sourcé** : les Pays-Bas et l'Irlande affichent des taxes négatives pour les ménages en 2025 (compensations supérieures aux prélèvements).
- **Opinion de l'auteur** : le débat « prix de l'énergie » mélange trois leviers de nature différente : le coût de production (le mix), le réseau (le choix d'investissement et son financement) et les taxes (choix budgétaire national). L'Europe n'agit sur le premier que par le marché, sur le deuxième par la régulation, et sur le troisième par l'unanimité.

## 3. Mix électrique, intensité carbone et position de la France

#### Mix électrique 2024 : parts de la production (Ember, TWh et %) et intensité carbone (gCO2e/kWh)
| Pays | Production (TWh) | Nucléaire | Éolien+solaire | Hydro | Fossiles | Intensité (gCO2e/kWh) | Importations nettes (TWh ; < 0 = exportateur) |
|---|---:|---:|---:|---:|---:|---:|---:|
| France | 564 | 67 % | 13 % | 13 % | 5 % | 40 | -90.0 |
| Allemagne | 492 | 0 % | 43 % | 5 % | 42 % | 340 | +26.3 |
| Italie | 268 | 0 % | 22 % | 20 % | 50 % | 281 | +51.0 |
| Espagne | 281 | 19 % | 43 % | 12 % | 23 % | 146 | -10.2 |
| Pays-Bas | 122 | 3 % | 45 % | 0 % | 46 % | 251 | -4.2 |
| Pologne | 172 | 0 % | 25 % | 1 % | 69 % | 608 | +2.0 |
| Suède | 172 | 29 % | 26 % | 38 % | 1 % | 35 | -33.4 |
| Belgique | 76 | 41 % | 30 % | 1 % | 24 % | 127 | +10.3 |
| Danemark | 35 | 0 % | 69 % | 0 % | 11 % | 132 | +3.7 |
| Autriche | 78 | 0 % | 22 % | 58 % | 14 % | 103 | -6.8 |
| Irlande | 31 | 0 % | 41 % | 2 % | 53 % | 271 | +5.1 |
| UE-27 | 2772 | 23 % | 29 % | 13 % | 29 % | 212 | -12.3 |

Source : Ember, « Yearly electricity data » (production, émissions, importations nettes ; données ouvertes, fichier téléchargé le 03/11/2026, dernière année 2025). Contrôle : Eurostat `nrg_bal_peh` donne 380,5 TWh nucléaires pour la France en 2024 (Ember 380,45), mais 570,9 TWh de production brute totale (Ember 564,5) : l'écart tient au périmètre (production brute y compris autoproducteurs). Méthode de l'intensité d'Ember (cycle de vie ou combustion) non relue ⚠️ V5674.

### 3.1 Lecture
- **Fait sourcé** : la France a le mix le plus décarboné des grands pays : 40 gCO2e/kWh contre 340 en Allemagne, 281 en Italie, 608 en Pologne et 212 pour l'UE-27 ; seule la Suède (35) fait aussi bien, avec une base hydraulique et nucléaire.
- **Fait sourcé** : la France est exportatrice nette de 90 TWh en 2024, devant la Suède (33 TWh) ; l'Italie importe 51 TWh, l'Allemagne 26 TWh.
- **Opinion de l'auteur** : la France et la Suède montrent que deux voies différentes (nucléaire, hydraulique) donnent des mix quasi identiques en carbone ; l'Allemagne a un mix à 340 g malgré 43 % d'éolien et de solaire, parce que 42 % reste fossile après la sortie du nucléaire (avril 2023, de mémoire, ⚠️ V4216).

### 3.2 Pourquoi l'avantage de prix n'est pas permanent
Hypothèse (📐 V5660 ; le point (2) est appuyé par RTE, Bilan électrique 2022 : 279 TWh, plus bas depuis 1988 ; les points (1) et (3) ne sont pas sourcés) : (1) les contrats de fourniture aux entreprises se renouvellent avec retard sur les prix de gros ; (2) en 2022, la production nucléaire française s'est effondrée (solde net importateur de 14,9 TWh, table §4.1), de sorte que le marché a fait payer à la France le prix du gaz marginal sans la compensation d'un volume exporté ; (3) le plafond de l'ARENH (100 TWh par an à 42 €/MWh) n'était qu'une partie de la consommation.

## 4. Flux, interconnexions et prix de marché

### 4.1 Échanges physiques de la France

#### France : échanges physiques d'électricité (Eurostat nrg_cb_e, TWh)
| Année | Importations | Exportations | Solde exportateur |
|---|---:|---:|---:|
| 2015 | 10.0 | 74.0 | 64.1 |
| 2016 | 19.9 | 61.4 | 41.5 |
| 2017 | 21.1 | 61.2 | 40.1 |
| 2018 | 13.5 | 76.5 | 63.0 |
| 2019 | 15.6 | 73.3 | 57.7 |
| 2020 | 19.5 | 64.6 | 45.0 |
| 2021 | 24.3 | 69.2 | 44.9 |
| 2022 | 52.4 | 37.5 | -14.9 |
| 2023 | 25.4 | 75.9 | 50.5 |
| 2024 | 15.1 | 105.1 | 90.0 |
| 2025 | 14.3 | 108.1 | 93.8 |

Source : Eurostat `nrg_cb_e` (GWh, importations et exportations d'électricité, flux physiques). Les chiffres des gestionnaires de réseau et de contrats diffèrent (RTE : 92,3 TWh pour 2025, résultat de recherche, ⚠️ V5669).

### 4.2 Prix de gros

#### Prix de gros day-ahead, moyenne annuelle des moyennes mensuelles (Ember, EUR/MWh)
| Pays | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| France | 39 | 37 | 45 | 50 | 39 | 32 | 109 | 275 | 97 | 58 | 63 |
| Allemagne | 32 | 29 | 35 | 43 | 38 | 30 | 97 | 236 | 95 | 78 | 90 |
| Espagne | 50 | 40 | 52 | 57 | 48 | 34 | 111 | 168 | 87 | 63 | 67 |
| Italie | 52 | 43 | 54 | 61 | 52 | 39 | 125 | 303 | 127 | 108 | 122 |
| Suède | 22 | 29 | 31 | 45 | 39 | 21 | 64 | 119 | 52 | 36 | 43 |
| Pologne | 37 | 36 | 37 | 52 | 53 | 47 | 87 | 166 | 112 | 96 | 104 |
| Pays-Bas | 40 | 32 | 39 | 52 | 41 | 32 | 103 | 241 | 96 | 77 | 88 |
Moyenne simple des 12 mois (pas pondérée par la consommation).

#### Écart de prix de gros France moins Allemagne (EUR/MWh ; négatif = France moins chère)
| 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| +7 | +8 | +10 | +7 | +2 | +2 | +12 | +40 | +2 | -20 | -26 |

Source : Ember, « European wholesale electricity prices » (prix day-ahead mensuels, données ouvertes ; fichier téléchargé le 03/11/2026). Le fichier contient aussi 2026 (janvier à octobre) : la France y est à 90 €/MWh en moyenne mais à 126, 143 et 166 €/MWh en août, septembre et octobre 2026, ce qui est inhabituel ; la cause n'est pas établie ici (⚠️ V5661), l'année n'est donc pas reprise dans les tableaux.

### 4.3 Ce que la France gagne ou perd au marché unique de l'électricité

#### France : valeur indicative du solde exportateur (TWh x prix de gros moyen français, Md€)
| Année | Solde (TWh) | Prix de gros FR (EUR/MWh) | Valeur indicative (Md€) |
|---|---:|---:|---:|
| 2015 | 64.1 | 39 | 2.5 |
| 2016 | 41.5 | 37 | 1.5 |
| 2017 | 40.1 | 45 | 1.8 |
| 2018 | 63.0 | 50 | 3.2 |
| 2019 | 57.7 | 39 | 2.3 |
| 2020 | 45.0 | 32 | 1.4 |
| 2021 | 44.9 | 109 | 4.9 |
| 2022 | -14.9 | 275 | -4.1 |
| 2023 | 50.5 | 97 | 4.9 |
| 2024 | 90.0 | 58 | 5.2 |
| 2025 | 93.8 | 63 | 5.9 |
Méthode : volume net x moyenne simple des prix mensuels ; ne tient pas compte des heures d'export (prix horaires), des contrats, ni des coûts de réseau. Ordre de grandeur seulement.

- **Estimation** (méthode ci-dessus) : environ 5,2 Md€ en 2024 et 5,9 Md€ en 2025 de valeur indicative des exportations nettes. Ce n'est pas un gain net : la production exportée a un coût, non déduit ici.
- **Ce qu'elle gagne** (opinion de l'auteur, à étayer) : un débouché pour la production excédentaire (le nucléaire modulable est coûteux à arrêter), la possibilité d'importer quand le parc est indisponible (solde de −14,9 TWh en 2022), et des prix de gros inférieurs de 20 à 26 €/MWh à ceux de l'Allemagne en 2024-2025. ACER indique que l'intégration des marchés réduit les prix et la volatilité (recherche web, ⚠️ V5668 : le chiffre de 664 M€ de surplus du consommateur n'a pas été vérifié).
- **Ce qu'elle perd** (opinion de l'auteur, à étayer) : en période de gaz cher, le couplage aligne le prix français sur le prix marginal des voisins (gaz) alors que le coût moyen du parc nucléaire est inférieur ; en 2022 le prix de gros français a dépassé l'allemand de 40 €/MWh, ce qui montre que le couplage ne protège pas d'un problème national de production (hypothèse, à tester).
- **Non chiffré dans les sources lues** : le surplus des consommateurs français avec et sans interconnexions. Il faudrait une simulation de marché (ex. ACER, ENTSO-E « TYNDP », données ENTSO-E demandant un jeton gratuit ; non utilisé, règle « aucun compte »).

## 5. Réforme du marché (2024), fin de l'ARENH, aides d'État

### 5.1 Règlement (UE) 2024/1747 (organisation du marché de l'électricité)
Source primaire lue : texte français du règlement (JO L du 26/06/2024, CELLAR, CELEX 32024R1747, `cellar_32024R1747.xhtml`).
- **Fait sourcé** (article 19 quinquies, nouvelle version du règlement 2019/943) : les régimes de soutien direct des prix pour les **nouveaux** investissements dans l'éolien, le solaire, la géothermie, l'hydroélectricité sans réservoir et le **nucléaire** doivent prendre la forme de **contrats pour différence bidirectionnels** (ou mécanismes équivalents), pour les contrats conclus à partir du **17 juillet 2027** (17 juillet 2029 pour certains projets en mer hybrides). Les recettes sont redistribuées aux consommateurs finals ; clauses de pénalité en cas de résiliation indue.
- **Fait sourcé** (considérant 35) : les États peuvent aussi décider de contrats pour différence pour rééquiper, augmenter la capacité ou prolonger la durée de vie d'installations existantes ; ils n'y sont **pas obligés**.
- **Fait sourcé** : contrats d'achat d'électricité (PPA) encouragés (article 19 bis) ; l'ACER suit le marché des PPA (article 19 ter).
- **Lecture** : la réforme encadre les aides futures ; elle ne régule pas le prix de l'énergie existante. Une aide à un réacteur existant se fait par la voie nationale, sous contrôle des aides d'État.

### 5.2 Fin de l'ARENH et nouveau dispositif nucléaire d'EDF
- **Fait sourcé** (CRE, communiqués du 30/09/2025, PDF lus localement) : l'ARENH prend fin au 31/12/2025. Le dispositif qui le remplace est le **versement nucléaire universel (VNU)**, fondé sur l'article 17 de la loi de finances pour 2025 : une taxe sur le combustible nucléaire dont le tarif est déclenché lorsque les revenus moyens du parc historique dépassent deux seuils (50 % au-delà d'un seuil de taxation, 90 % au-delà d'un seuil d'écrêtement), redistribuée à tous les consommateurs.
- **Fait sourcé** (CRE, même source) : seuil de taxation = coût complet + une marge de 5 à 25 €/MWh ; seuil d'écrêtement = coût complet + une marge de 35 à 55 €/MWh. Première estimation des revenus nucléaires d'EDF pour 2026 : **23,7 Md€, soit 65,86 €/MWh**, pour une production de 360 TWh. Trajectoire de production retenue pour le coût complet : 362 TWh par an en 2026-2028 (dont 8,3 TWh pour Flamanville 3) et 358,4 TWh en 2029-2031.
- **Coût complet CRE et seuils** (⚠️ V5662, V5663) : résumés de recherche web : 60,3 €/MWh (€2026) pour 2026-2028 et 63,4 pour 2029-2031 ; EDF proposait 79,6 et 81,5 ; seuils fixés à 78 €/MWh (taxation) et 110 €/MWh (écrêtement) par un texte d'application dont le numéro et la date divergent selon les sources (décret n° 2026-55 du 04/02/2026 selon la recherche de ce jour ; arrêté du 11/02/2026 et décret n° 2026-75 selon `recherche-entreprises-etat-commerciales.md`). Cohérent avec l'estimation 2026 (65,86, sous 78) : pas de taxe en 2026. Le tableau des coûts complets du PDF est une image, non lue.
- **Opinion de l'auteur** : le VNU est un compromis entre deux logiques. Pour EDF, il garde le surplus jusqu'au seuil (financement des EPR2) ; pour le consommateur, il ne garantit pas un prix bas, il redistribue seulement l'excès. Le risque politique est qu'il ne se déclenche presque jamais : en 2027 la CRE voit un revenu de 65,50 €/MWh, loin du seuil (recherche web, ⚠️ V5663, mise à jour attendue début novembre 2026). L'ARENH, lui, donnait un prix connu (42 €/MWh, plafond de 100 TWh) aux fournisseurs alternatifs. La France passe d'une subvention au fournisseur à un filet de sécurité aux consommateurs.
- **Lien Europe** : le VNU n'est pas un contrat pour différence au sens du règlement 2024/1747 (qui ne vise que les nouveaux investissements) ; sa compatibilité avec le droit des aides d'État n'est pas vérifiée ici (avis 25-A-16 de l'Autorité de la concurrence du 23/12/2025 téléchargé, non lu en détail, ⚠️ V5663).

### 5.3 Aides d'État à l'énergie : la concurrence par les subventions
- **Fait sourcé** (State aid Scoreboard 2023, données 2022, déjà dans `recherche-concurrences-intra-europeennes.md` §3 bis) : sur 228 Md€ d'aides en 2022, Allemagne 73,67 Md€ (32,3 %), France 44,79 Md€ (19,6 %), Italie 26,61 Md€ ; mesures du cadre de crise : 39,33 Md€.
- **Source secondaire** (⚠️ V5666 ; chiffres du tableau EPRINC reprenant le suivi de Bruegel, septembre 2021 à janvier 2023, lus par recherche web) : soutien budgétaire à l'énergie : Allemagne 264,6 Md€ (7,4 % du PIB), Italie 92,7 Md€ (5,2 %), France 92,1 Md€ (3,7 %), Espagne 40,8 Md€ (3,4 %). Les deux mesures ne sont pas comparables : l'une mesure les aides approuvées par la Commission, l'autre les dépenses nationales de protection des consommateurs et des entreprises.
- **Fait sourcé** : l'Allemagne pèse 24,2 % du PIB de l'UE-27 en 2024 (voir `recherche-concurrences-intra-europeennes.md`) ; le poids du soutien allemand (7,4 % du PIB) dépasse donc largement la taille relative du pays, ce qui suggère une marge budgétaire supérieure (opinion de l'auteur, non démontrée).
- **Non lu** : le Scoreboard 2024 (données 2023, publié le 08/04/2025, résultat de recherche) et le Scoreboard 2025 ; une part de l'Allemagne de 51 % relevée par une source de presse non datée n'est pas retenue (⚠️ V5667).
- **Opinion de l'auteur** : une aide autorisée est une concurrence entre budgets nationaux, pas entre entreprises : l'Allemagne peut payer le prix de l'électricité de ses industriels, l'Italie moins, la Roumanie beaucoup moins. Le marché unique avec 27 budgets est un marché inégal. C'est l'argument fédéral le plus direct du chapitre.

## 6. Taxation de l'énergie

### 6.1 Directive 2003/96/CE et projet de révision
- **Fait sourcé** (texte original lu, CELLAR, `cellar_32003L0096.xhtml`) : niveaux **minima** de taxation : gazole 330 € par 1 000 l ; gaz naturel carburant 2,6 €/GJ ; **électricité 0,5 €/MWh pour l'usage professionnel et 1,0 €/MWh pour l'usage non professionnel** ; gaz naturel de chauffage 0,15 €/GJ (professionnel) et 0,3 €/GJ (non professionnel) ; houille 0,15 et 0,3 €/GJ. Ces minima datent de 2004 et ne sont pas indexés. Les modifications ultérieures à la version d'origine n'ont pas été relues (⚠️ V5673).
- **Fait sourcé** (proposition COM(2021) 563 final du 14/07/2021, lue, `cellar_COM2021_563.xhtml`) : refonte de la directive ; base juridique article 113 TFUE (règles d'harmonisation des impôts indirects, **unanimité** du Conseil, Parlement seulement consulté) et article 192, paragraphe 2 ; classement par performance environnementale : taux de référence plein pour les carburants fossiles les plus polluants ; deux tiers du taux de référence pour le gaz naturel, le GPL et l'hydrogène fossile pendant une période transitoire de dix ans ; 50 % pour les biocarburants durables non avancés ; taux le plus bas pour l'électricité, quel que soit son usage. Les taux en euros par gigajoule figurent dans une annexe non lue (⚠️ V5665).
- **Statut** (✅ V5664, 03/11/2026) : le Conseil n'a pas trouvé d'accord ; lors du débat de l'ECOFIN du 13/11/2025, plusieurs États ont jugé qu'un travail supplémentaire était nécessaire, notamment sur la compétitivité, l'indexation, la taxation des carburants de l'aviation et de la navigation, le traitement du gaz naturel et du GNL et l'articulation avec d'autres dossiers climatiques ; le Conseil n'a pu atteindre l'unanimité requise pour une orientation générale (Parlement européen, Legislative Train, fiche « Revision of the Energy Taxation Directive », mise à jour du 20/09/2026, consultée le 03/11/2026). Aucun progrès enregistré au premier semestre 2026 (présidence chypriote : mesures temporaires sur les prix de l'énergie) ; le dossier n'est pas programmé pour l'ECOFIN du second semestre 2026 ; au 20/09/2026, ni orientation générale du Conseil ni avis du Parlement (commission ECON : amendements examinés le 25/02/2026, rapport non adopté). La mention antérieure d'un plafond de prix du gaz était erronée. Le blocage tient à la règle : un seul État peut refuser.
- **Exemple de la souplesse nationale** (de mémoire, ⚠️ V5671) : le Danemark a décidé de ramener sa taxe sur l'électricité au minimum européen pour 2026 et 2027. Le fait qu'un État puisse le faire montre que les minima de 2003 ne protègent aucun marché : ils ne contraignent pas.

### 6.2 Les taxes suivent-elles le principe pollueur-payeur ?

#### Signal-prix carbone implicite des taxes (ménages, 2025) : hypothèse de lecture, pas une mesure de l'accise seule
| Pays | Taxes hors TVA, électricité (c€/kWh) | Intensité du mix 2024 (gCO2e/kWh) | Taxes hors TVA, gaz (c€/kWh) | Prix implicite gaz (€/tCO2, hyp. 0,202 t/MWh) |
|---|---:|---:|---:|---:|
| France | 3.7 | 40 | 2.0 | 99 |
| Allemagne | 6.3 | 340 | 1.9 | 95 |
| Italie | 6.0 | 281 | 1.9 | 92 |
| Espagne | 3.8 | 146 | 0.5 | 25 |
| Pays-Bas | -5.6 | 251 | 5.9 | 293 |
| Suède | 4.0 | 35 | 3.3 | 165 |
| Danemark | 9.6 | 132 | 3.6 | 180 |
| Autriche | 0.2 | 103 | 1.7 | 82 |
| Belgique | 6.0 | 127 | 1.0 | 49 |
| Irlande | -4.8 | 271 | 1.1 | 52 |
| UE-27 | 3.9 | 212 | 1.7 | 85 |
Limite : les « taxes, redevances et prélèvements » d'Eurostat regroupent accises, taxes sur les renouvelables, taxes de capacité et d'autres prélèvements (hors TVA ici) ; le prix implicite surestime donc le signal carbone strict.

- **Estimation** (méthode : taxes hors TVA = taxes toutes taxes moins TVA, Eurostat `nrg_pc_20x_c` 2025 ; intensité Ember 2024 ; facteur d'émission du gaz 0,202 tCO2 par MWh PCI, valeur par défaut du GIEC, hypothèse) : en France, l'électricité (40 g/kWh) supporte 3,7 c€ de taxes et prélèvements par kWh ; le gaz de chauffage (environ 200 g/kWh) 2,0 c€. Le prix implicite du carbone sur le gaz est d'environ 99 €/tCO2 en France, mais l'équivalent sur l'électricité (3,7 c€ pour 0,04 kg, soit plus de 900 €/tCO2) n'a pas de sens : il montre que ces taxes financent des choses (réseaux, renouvelables, capacité) qui ne sont pas des taxes carbone.
- **Réserve** : la ligne d'Eurostat regroupe accises, taxes sur les énergies renouvelables, taxes de capacité et autres prélèvements ; une accise nominale (ex. accise sur l'électricité en France) est plus petite que le total. La conclusion « l'électricité décarbonée est plus taxée que le gaz » est donc une **hypothèse de lecture**, à confirmer avec les tables d'accises de la Commission (`Excise duty tables`, non téléchargées ici).
- **Lien avec la position de l'auteur** (pollueur-payeur : calibrer la fiscalité plutôt qu'interdire) : la fiscalité actuelle calibre déjà, mais sur d'autres critères que le carbone (financement des réseaux et des renouvelables, histoire fiscale). Calibrer sur le carbone supposerait trois choses : (1) un prix du carbone commun (le marché ETS existe pour l'industrie et l'électricité ; extension aux bâtiments et aux transports prévue, calendrier à vérifier, entrée en vigueur repoussée de 2027 à 2028 par l'accord Conseil-Parlement du 10/12/2025 sur la loi climat 2040, ✅ V5672 vérifié le 03/11/2026) ; (2) des accises alignées sur le contenu carbone, ce que propose précisément la révision de 2021 ; (3) la fin de l'unanimité fiscale pour qu'elle passe.
- **Contradiction à nommer** (règle 7) : la position de l'auteur, libérale et opposée aux interdictions, défend un prix du carbone plutôt qu'une norme, mais un prix du carbone européen unique est une **harmonisation fiscale**, contraire à la souveraineté fiscale nationale qu'il pourrait défendre par ailleurs. À trancher.

## 7. Sens politique pour la thèse : trop d'Europe ou pas assez ?

**Verdict de l'auteur (opinion)** : il faut **plus d'Europe sur la règle de décision et les réseaux, moins d'Europe sur le choix du mix**. Les données ne permettent pas un « plus » ou « moins » global.

**Plaidoyer pour plus d'Europe (steelman)**
- Le marché est déjà intégré (couplage des prix) mais ses deux grandes variables restent nationales : les taxes (de 17 % à 49 % du prix ménage, §2.1) et les aides (Allemagne 32 % des aides d'État de 2022). Un marché commun avec des prix si inégaux (de 8,4 à 19,9 c€/kWh pour l'industrie) est un marché biaisé.
- L'unanimité sur la taxation bloque depuis 2021 une réforme qui ferait payer le carbone ; un seul État peut tout arrêter.
- L'achat commun de gaz et un réseau fédéral des interconnexions réduiraient la concurrence entre acheteurs qui a fait monter les prix en 2022 (Draghi, §2 du fichier de recherche existant).
- Le nucléaire français est une ressource européenne : l'Europe y gagne en décarbonation (l'Allemagne à 340 g, la Pologne à 608).

**Plaidoyer pour moins d'Europe ou pour un autre Europe (steelman)**
- L'article 194 TFUE laisse le mix aux États : un marché trop intégré fait payer aux Français les décisions des autres (en 2022, le prix français a dépassé l'allemand de 40 €/MWh alors que la production nucléaire était réduite ; le couplage n'a pas protégé).
- Le couplage peut importer la volatilité : l'industrie française a payé 21,3 c€/kWh en 2023, plus que l'allemande.
- La France ne peut pas concurrencer le budget allemand sur les aides ; il lui reste son avantage de coût, qu'une règle commune pourrait réduire (mutualisation des coûts de réseau ou de capacité : effet non chiffré, ⚠️ à étudier).
- **Réponse** : aucune de ces objections n'est une objection à une règle de vote ; elles portent sur le contenu. La proposition du manifeste (décider à la majorité qualifiée sur le marché de gros, les réseaux et la taxation du carbone, laisser les États maîtres du mix et des aides sociales) répond aux deux : elle rend les États comparables sans les uniformiser.

## 8. État de la recherche (règle 9)
- **Établi** : un marché intégré réduit les prix et la volatilité (ACER, résumé non lu ⚠️ V5668) ; les prix industriels européens sont structurellement supérieurs à ceux des États-Unis (Draghi 2024, voir fichier existant) ; les contrats pour différence bidirectionnels protègent des deux côtés (règlement 2024/1747, art. 19 quinquies).
- **Débattu** : qui paie les réseaux (Allemagne : 11,3 c€/kWh pour les ménages) ; si les minima de la directive 2003/96 suffisent ; si les prix de gros marginaux sont le bon signal quand le parc est majoritairement à coût fixe (nucléaire, renouvelables).
- **Manque** : une mesure sourcée du surplus français avec et sans marché unique ; l'impact des aides allemandes sur la part de marché des industriels français (déjà noté V4206) ; les accises nominales par pays (non téléchargées) ; les tarifs réglementés et l'effet du bouclier tarifaire.

## 9. Synthèse des sources
| Quoi | D'où | Ce que la source établit |
|---|---|---|
| Prix électricité et gaz | [Eurostat nrg_pc_204, 205, 202, 203](https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table) (téléchargés le 03/11/2026) | Prix semestriels par pays, bande, niveau de taxes |
| Décomposition | Eurostat nrg_pc_204_c, 205_c, 202_c, 203_c | Énergie, réseau, taxes, TVA, année 2025 |
| Mix et intensité | [Ember, Yearly electricity data](https://ember-energy.org/data/yearly-electricity-data/) ; Eurostat [nrg_bal_peh](https://ec.europa.eu/eurostat/databrowser/view/nrg_bal_peh/default/table) | Parts, intensité, importations nettes 2024 |
| Échanges | Eurostat [nrg_cb_e](https://ec.europa.eu/eurostat/databrowser/view/nrg_cb_e/default/table) | Importations et exportations 2015-2025 |
| Prix de gros | [Ember, European wholesale electricity price data](https://ember-energy.org/data/european-wholesale-electricity-price-data/) | Prix day-ahead mensuels 2015-2026 |
| Règlement 2024/1747 | [EUR-Lex, CELEX 32024R1747](http://publications.europa.eu/resource/celex/32024R1747) (via CELLAR) | Contrats pour différence obligatoires dès le 17/07/2027 pour le nouveau |
| Directive 2003/96 | [EUR-Lex, CELEX 32003L0096](http://publications.europa.eu/resource/celex/32003L0096) | Niveaux minima de taxation |
| Proposition de refonte | [COM(2021) 563 final](http://publications.europa.eu/resource/cellar/1b01af2a-e558-11eb-a1a5-01aa75ed71a1.0013.03/DOC_1) | Base juridique, classement par taux, unanimité |
| VNU | [CRE, 30/09/2025, estimation des revenus](https://www.cre.fr/fileadmin/Documents/Communiques_de_presse/2025/250930_CP_CRE_Estimation_revenus_nucleaires_EDF.pdf) ; [CRE, 30/09/2025, coûts complets](https://www.cre.fr/fileadmin/Documents/Communiques_de_presse/2025/250930_CP_CRE_Couts_complets_nucleaire.pdf) ; [Autorité de la concurrence 25-A-16](https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2026-02/25a16.pdf) | Mécanisme, marges, revenus 2026 ; avis non lu |
| Aides d'État | Commission, State aid Scoreboard 2023 (voir fichier existant) ; [EPRINC d'après Bruegel](https://eprinc.org/wp-content/uploads/2023/07/EPRINC-Chart2023-27-EUNationalFiscalResponsesToEnergyCrisis-Version1-1.pdf) (secondaire) | Parts nationales ; soutien en % du PIB |

Consultées le 03/11/2026.
