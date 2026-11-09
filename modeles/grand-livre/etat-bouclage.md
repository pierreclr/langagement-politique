---
titre: Grand livre, sous-secteur ÉTAT, bouclage 2024 (T65)
statut: construit le 06/11/2026 par `code/etat.py` ; vérifications V16000 à V16015
---

# État (S13111) 2024 : rapprochement au total Insee

Cible : Insee, comptes nationaux base 2020 (millésime août 2026), t_3203 « État », total des dépenses 2024 = **600,702 Md€** (cote A), consolidé à l'intérieur du sous-secteur seulement. Lignes : exécution 2024 (PLRG 2024, CP constatés, cote A), 944 lignes dans `etat.csv`, relançable par `python3 -I modeles/grand-livre/code/etat.py --ecrire`.

## 1. Bouclage par nature SEC (Md€, 2024)

| Groupe de natures | Lignes retenues | Insee | Écart (Insee − lignes) |
|---|---|---|---|
| D1 rémunérations (21, 22, 10, budgets annexes T2) | 154,119 | 151,598 | −2,520 |
| P2 consommations intermédiaires (catégorie 31, CAS, BA) | 37,018 | 35,569 | −1,449 |
| D41 intérêts (catégorie 43) | 50,102 | 45,768 | −4,334 |
| P51g + P52, P53, NP | 19,219 | 17,414 | −1,805 |
| D76 ressources propres UE (PSR UE) | 22,276 | 22,281 | +0,005 |
| D62 + D632 prestations (dont pensions du CAS 67,9) | 122,753 | 127,530 | +4,777 |
| D3 + D29 subventions | 31,033 | 30,768 | −0,265 |
| D71, D72, D74, D75 autres transferts courants | 15,904 | 20,426 | +4,522 |
| D73 transferts entre administrations (PSR collectivités 45,457 ; SCSP ; régimes spéciaux) | 102,046 | 107,508 | +5,462 |
| D9p transferts en capital | 16,283 | 41,839 | +25,556 |
| Crédits d'impôt restituables en dépense (19,771, natures D3, D6, D7, D9 mêlées) | 19,771 | (compris ci-dessus) | |
| **Total** | **590,523** | **600,702** | **+10,178 (1,69 %)** |

Le rapprochement fin des interventions n'est fiable qu'en bloc : D62+D632+D3+D29+D7+D73+D9p = Insee 328,070 contre lignes 307,789 crédits d'impôt compris, écart **+20,282** (V16014). Chaque écart est une ligne `GL-ETAT-ECART-*` de `etat.csv` (D1, P2, D41, P5, D76, interventions) : lignes + écarts = 600,7015 exactement.

Causes connues : D41 (écart −4,3) : l'Insee compte les intérêts en droits constatés net des indexations et swaps, le budget en charges de la dette ; D1 et P2 trop hauts : « pouvoirs publics » (1,157 mêlant D1, P2, D62) et budgets annexes (V16013) ; P51g : les catégories 51 et 52 comprennent des matériels militaires et du logiciel (partie en P2 ?) ; D9p : les aides à l'investissement sont dans les catégories 61, 62, 64 (MaPrimeRénov' classée D9 par surcharge), non isolables sans les actions.

## 2. Passage de la comptabilité budgétaire à la comptabilité nationale (exécution 2024)

| Étape | Md€ |
|---|---|
| Budget général brut, CP constatés | 584,982 |
| − remboursements et dégrèvements d'impôts d'État (P200) 141,568 et locaux (P201) 4,955 (côté recettes : `GL-REC-ETAT-RD-*`) | −146,523 |
| − opérations financières du budget général (catégories 71-73 : 1,111 ; P369 amortissement de la dette Covid : 6,475) | −7,586 |
| = dépenses retenues du budget général (dont dette 50,085) | 430,873 |
| + CAS Pensions (pensions de l'État, D62) | +67,885 |
| + autres CAS dépensiers (GPI, sécurité routière, CASDAR, électrification) | +1,6 environ |
| + budgets annexes (hors remboursements d'emprunt) | +2,359 |
| + prélèvements sur recettes : collectivités 45,457 ; UE 22,276 (absents des crédits) | +67,733 |
| + crédits d'impôt restituables comptés en dépense (Insee) | +19,771 |
| = lignes retenues | 590,523 |

Exclus et listés (nature `HORS-*`, à ne jamais additionner) : `HORS-RD` 146,523 (recettes nettes) ; `HORS-FIN` 217,142 (CCF 141,181 dont 127,959 d'avances aux collectivités ; comptes de commerce 60,577 ; CAS Participations 9,501 ; CAS désendettement 0,715 ; P369 6,475 ; opérations financières BG 1,111 ; comptes monétaires 1,185) ; `HORS-INTRA` 3,976 (CCF audiovisuel public, V16006) ; `HORS-DF` 80,771 (dépenses fiscales 2024, 22 missions, moindres recettes, pas des dépenses ; recoupent en partie les crédits d'impôt).

Crédits d'impôt (demande du chantier recettes, V16401) : 19,771 = IRPP 8,885 + IS 10,739 (dont CIR 8,0) + divers 0,147, quatre lignes `GL-ETAT-CRED-*`. Les restitutions mécaniques (≈ 128 Md€) restent côté recettes nettes. **Dépense orpheline** : les 8,885 de crédits IRPP restent en dépense dans le bilan alors que P03 supprime l'IRPP ; seul D14 retire le CIR (V16009 / V16403).

## 3. Transferts vers d'autres sous-secteurs (`flux_inter_apu`)

Marqués `oui:?` (contrepartie à retrouver dans les fichiers ODAC, APUL, ASSO) : 121,3 Md€ retenus dont PSR collectivités 45,457 (APUL) ; subventions pour charges de service public, catégorie 32 : 34,345 (ODAC) ; D73 divers vers ODAC, ASSO (régimes spéciaux 6,064, compensations d'exonérations P138 et P381, P379) et APUL (catégorie 63) ; D9 vers APUL et ODAC 6,1 ; P109 subvention au FNAL 13,093 (V16002). La TVA affectée n'est pas une dépense de l'État dans ces lignes : elle est déduite des recettes. Non marqué : contribution à l'UE (sort des APU) ; CAS Pensions (flux interne à l'État : cotisations imputées D122 48,24 comptées en dépense et en recette).

## 4. Reconstitutions

Lignes reconstituées (statut `calcul` ou `estimation`) : natures SEC (dérivées des catégories budgétaires) ; PSR collectivités (somme, non ventilée DGF/FCTVA) ; crédits d'impôt (ventilation par recettes-bouclage.md) ; P304 (10,65 + 2,028), P157 (13,84 + 1,411), P103 (4,6 + 4,388) scindées d'après les montants du bilan ; COFOG par mission ou programme (estimation : l'Insee ne publie pas la COFOG de l'État seul, Eurostat seulement pour S1311 État + ODAC).

## 5. Doublons suspects dans `bilan_global.py` (ne pas modifier le fichier)

| Ligne(s) | Montant (Md€) | Constat |
|---|---|---|
| P03 / crédits IRPP | 8,885 | dépense orpheline : l'IRPP disparaît, les crédits restent en dépense (V16009). Les notes du bilan citent 10,7 (IR) et 8,9 (IS) : l'Insee donne 8,885 et 10,739 |
| D14 CIR (8,0) | 8,0 | classé dépense ; compris dans les 10,739 de crédits IS ; V13025 ; D32 en réoriente 3,0 |
| D15 apprentissage (4,6, 2022) | 4,388 | pas un doublon : sous-couverture, P103 = 8,988 en 2024 (V16011) |
| D19, D20, D18 | ≤ 90 base D1 | recouvrement possible des non-remplacements (V16010) ; D19 = +0,11 donc sans effet |
| D06 APL 16,0 et P109 | 13,093 | si le FNAL est hors État, transfert compté deux fois en APU brut (V16002) |
| D01 pensions et D1 | 48,24 | cotisations imputées (D122) comptées en D1 et en recette : sans effet au solde mais gonflent dépenses et recettes ; une baisse des pensions de l'État (V6) réduit aussi D122, non compté |
| P369 et CAS 732 | 6,475 | même flux compté deux fois en comptabilité budgétaire (V16012) ; sans effet (exclus des deux côtés) |

Pas de double compte trouvé sur D13 (SFT, dans D1), D17 (3,321 = MaPrimeRénov', V16004).

## 6. Questions ouvertes

D9p : 25,6 Md€ d'aides à l'investissement à identifier (RAP par action) ; D73 107,5 contre D731 61,1 (V16015) ; traitement SEC des avances à l'audiovisuel (V16006) ; classement du FNAL ; AAH et prime d'activité exécutées 2024 ; COFOG de l'État seul ; budgets annexes dans S13111 ?
