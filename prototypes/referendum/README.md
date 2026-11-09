# Preuve de concept : référendum numérique vérifiable (prototype non audité)

> **Avertissement.** Ce code est un **prototype non audité**, écrit le 02/11/2026 avec l'IA (Claude) pour la tâche T54. Il sert à montrer qu'on **sait construire** un scrutin consultatif oui/non vérifiable par tous, pas à prouver qu'un vote en ligne est sûr. Il tourne **en local seulement** : aucun serveur, aucun réseau, aucun déploiement. Ne pas l'utiliser pour un vrai scrutin. Cahier des charges : [`sources/cahier-des-charges-referendum-numerique.md`](../../sources/cahier-des-charges-referendum-numerique.md).

## Lancer

Node ≥ 24 (testé avec Node 26.13).

```sh
cd prototypes/referendum
npm install            # trois dépendances, installées dans ce dossier uniquement
npm test               # node --test : 12 tests
npm run demo           # 100 électeurs, 3 autorités dont 2 suffisent ; écrit sortie/tableau.json
node src/verifier.js sortie/tableau.json   # recomptage indépendant (code de sortie 0 = valide)
```

Résultat de la démonstration du 02/11/2026 : 100 votants, 105 bulletins déposés (5 revotes), 4 tentatives de fraude refusées, total déchiffré par deux autorités sur trois, recompté à l'identique par le vérificateur dans un processus séparé (≈ 19 s sur un Mac, dont l'essentiel en signatures RSA).

## Architecture

Deux mondes qui ne se parlent que par un jeton anonyme (cahier § 1.4) :

```
 MONDE A : ÉLIGIBILITÉ                            MONDE B : SCRUTIN
 ─────────────────────                            ──────────────────
 pièce à puce signée ──► fournisseur d'identité   électeur ──► urne ──► tableau public (ajout seul)
 (autorité de test)      (clusters de confiance,     │  bulletin chiffré      │
                          liste électorale,          │  + preuve 0-ou-1       ▼
                          registre d'empreintes)     │  + jeton + nullifier   vérificateur(s) indépendant(s)
        │                                            │  + signature clé de vote
        ▼                                            │                        autorités A1, A2, A3
 émetteur de droits ── signature AVEUGLE ──► jeton ──┘                        (seuil 2 sur 3) :
 (ne voit jamais le jeton)                                                     déchiffrement partiel prouvé
```

| Fichier | Rôle |
|---|---|
| `src/identite.js` | Module **identité simulé et remplaçable** : autorité émettrice de test, clusters de confiance (majorité), liste électorale simulée, registre d'empreintes (un titre = un droit) |
| `src/jeton.js` | Droit de vote anonyme par **signature aveugle RSA (RFC 9474)**, clé de vote de l'électeur, nullifier |
| `src/elgamal.js` | **ElGamal exponentiel** sur P-256, **preuve disjonctive** 0-ou-1, preuve de Chaum-Pedersen, logarithme borné |
| `src/seuil.js` | **Génération distribuée de clé** (Joint-Feldman), parts de Shamir vérifiables, **déchiffrement partiel prouvé**, recombinaison de Lagrange |
| `src/tableau.js` | **Tableau public en ajout seul**, chaîné par empreintes SHA-256 |
| `src/scrutin.js` | Orchestration : ouverture, délivrance des droits, urne, revote, clôture, agrégat homomorphe, dépouillement, témoins |
| `src/verifier.js` | **Vérificateur indépendant** : n'importe aucun module du prototype ; recompte tout à partir du JSON publié |
| `src/demo.js`, `src/simulation.js` | Démonstration et mise en place d'un scrutin simulé |
| `test/referendum.test.js` | Tests (`node --test`) |
| `docs/procedure-compromission.md` | Déclencheurs d'annulation et retour aux urnes ; analyse par des IA de sécurité avant chaque usage |

### Déroulé

1. **Cérémonie des clés** : chaque autorité tire un polynôme secret de degré t−1, publie ses engagements de Feldman, envoie une part à chaque autre ; toute part qui ne correspond pas aux engagements est une plainte publique et l'émetteur est disqualifié. La clé publique Y est la somme des engagements constants ; aucune autorité ne connaît la clé secrète.
2. **Délivrance du droit de vote** : l'électeur génère une clé de vote (ECDSA P-256), fabrique le message `{scrutin, cleVote}`, l'**aveugle** et présente sa pièce. Le fournisseur d'identité vérifie la puce (signature de l'autorité émettrice reconnue par une majorité de clusters), l'inscription et l'absence de droit déjà délivré (empreinte HMAC du numéro de titre). L'émetteur signe le message aveuglé. L'électeur désaveugle : il détient un jeton valide que l'émetteur ne peut relier à la session.
3. **Vote** : le bulletin contient le chiffré ElGamal de 0 ou 1, la preuve disjonctive (liée au scrutin, au nullifier et au numéro de séquence), le jeton, le nullifier et un numéro de séquence ; il est signé par la clé de vote. L'urne vérifie tout et l'ajoute au tableau ; l'électeur garde un **code de suivi** qu'il retrouve sur le tableau.
4. **Revote** : même jeton, séquence plus grande ; seul le dernier bulletin compte. Un ancien bulletin rejoué est refusé (séquence et chiffré déjà vus) ; personne d'autre ne peut revoter à sa place (il faudrait la clé de vote).
5. **Clôture** : publication du nombre de droits délivrés et des empreintes des titres servis, puis de l'agrégat homomorphe des derniers bulletins.
6. **Dépouillement** : chaque autorité présente publie D = x·A avec une preuve de Chaum-Pedersen ; les faux déchiffrements sont écartés et signalés ; t déchiffrements valides donnent le total. Les autorités signent ensuite la tête du tableau (témoins).
7. **Recomptage** : `src/verifier.js` vérifie la chaîne, chaque jeton, chaque signature, chaque preuve, l'unicité des nullifiers retenus, les bornes « votants ≤ droits délivrés ≤ inscrits », recalcule l'agrégat, vérifie chaque déchiffrement partiel et recombine **tous** les sous-ensembles de t autorités valides, qui doivent concorder.

## Primitives : ce qui vient d'une bibliothèque, ce qui est écrit ici

Règle suivie : **aucune primitive cryptographique inventée.**

| Élément | Origine | Référence |
|---|---|---|
| Courbe P-256, opérations de groupe, ECDSA | `@noble/curves` 2.x (audité) | NIST FIPS 186-5 |
| SHA-256, SHA-512, HMAC, aléa | `@noble/hashes` 2.x (audité) | FIPS 180-4, RFC 2104 |
| Signature aveugle RSA | `@cloudflare/blindrsa-ts` 0.4.6, variante RSABSSA-SHA384-PSS-Randomized | RFC 9474 (2023) ; conforme aux vecteurs de test selon ses auteurs |
| ElGamal exponentiel | **écrit ici**, prototype non audité | Cramer, Gennaro, Schoenmakers, EUROCRYPT 1997 ; Helios ; ElectionGuard spéc. 2.0 § 3.3 |
| Preuve disjonctive 0-ou-1 | **écrit ici**, prototype non audité | Cramer, Damgård, Schoenmakers, CRYPTO 1994 ; ElectionGuard § 3.3.5 ; Fiat-Shamir « fort » (Bernhard, Pereira, Warinschi, ASIACRYPT 2012) |
| Preuve d'égalité de logarithmes | **écrit ici**, prototype non audité | Chaum, Pedersen, CRYPTO 1992 ; ElectionGuard § 3.6.3 |
| Clé partagée à seuil | **écrit ici**, prototype non audité | Pedersen, EUROCRYPT 1991 (Joint-Feldman) ; Shamir 1979 ; Feldman 1987 ; limite : Gennaro, Jarecki, Krawczyk, Rabin 1999/2007 |
| Tableau chaîné | **écrit ici** (simple encodage) | principe des journaux de transparence (RFC 9162) |

⚠️ Les numéros de sections d'ElectionGuard sont cités de mémoire (à vérifier dans la spécification 2.0).

## Le module d'identité et la brique de l'entreprise de logiciel

Le module `src/identite.js` est **simulé** : pas de France Identité, pas de FranceConnect+, pas de répertoire électoral unique (accès réservés à l'État, cahier § 1.1 et 1.3). Il reproduit le contrat :

> une pièce dont la puce porte une signature d'autorité reconnue (par une majorité de clusters) et dont le titulaire est inscrit donne droit à **un** droit de vote, et à un seul.

Toute brique réelle n'a qu'une méthode à fournir : `verifierEligibilite(piece) → { ok, motif?, empreinte? }`, plus `marquerServi(empreinte)`. Trois branchements possibles :

1. **Brique une entreprise de logiciel** (principes décrits au cahier § 1.5 ; aucun code de une entreprise de logiciel n'est repris ici) : l'application lit la bande MRZ (clés de contrôle), ouvre la puce par BAC/PACE ou par le CAN, compare le visage **sur l'appareil** avec la photo de la puce et fait un test de présence ; seul un **jeton signé** part au serveur (résultat, version, défi, empreinte de la photo, données DG1 et objet SOD). Côté serveur, l'adaptateur vérifierait : (a) la signature du jeton une entreprise de logiciel et l'attestation de l'appareil ; (b) la signature SOD contre la liste de confiance des autorités émettrices, tenue par **plusieurs clusters** (ce que simule `ClusterDeConfiance`) ; (c) l'inscription ; (d) l'empreinte HMAC du numéro de titre. Conditions : code de la brique publié sous licence libre et conflit d'intérêts déclaré (cahier § 1.6).
2. **France Identité / FranceConnect+** : l'adaptateur reçoit l'identité certifiée de niveau élevé et en tire l'empreinte ; inconvénient : la fédération sait que la personne s'est connectée au service (participation, pas le vote), d'où une fenêtre de délivrance séparée de la fenêtre de vote.
3. **Agent en mairie** (voie obligatoire pour les personnes sans puce, sans smartphone ou dont la biométrie échoue, cahier § 1.7) : l'agent vérifie la pièce et l'inscription, et le poste de la mairie demande la signature aveugle pour le compte de l'électeur, qui repart avec son jeton (sur un support ou directement vers la borne).

La séparation tient parce que **l'émetteur ne voit jamais le jeton** : même s'il conserve tout (empreinte du titre, heure, message aveuglé), il ne peut pas le relier au bulletin ; c'est la propriété d'aveuglement de RFC 9474.

## Revote et mode borne en mairie

- **Revote** (implémenté) : parade **partielle** à la contrainte et à l'achat de voix ; le coercitif ne peut pas savoir si l'électeur revotera. Il ne protège pas d'un coercitif qui confisque la clé de vote ou reste présent jusqu'à la clôture.
- **Mode borne en mairie** (documenté, non implémenté) : l'électeur passe par la voie « agent en mairie » ci-dessus, entre dans l'isoloir, vote sur une borne qui (1) chiffre et prouve le bulletin exactement comme ici, (2) imprime un **bulletin papier lisible** que l'électeur vérifie et dépose dans une urne physique, (3) affiche un code de suivi. Le décompte électronique est confronté à un **audit statistique** d'un échantillon de bulletins papier (audit « limitant le risque » : un écart se détecte avec une probabilité calculable). Le vote en mairie **annule** un vote à domicile du même électeur (règle estonienne, ⚠️ V3273) : il suffit que la borne dépose un bulletin de séquence supérieure avec le même jeton, ou, si l'électeur n'a plus son jeton, que la mairie délivre un nouveau droit et que l'ancien soit révoqué (mécanisme de révocation à concevoir : il rompt partiellement l'anonymat du lien titre-jeton, point à soumettre aux cryptographes).

## Menaces couvertes par le prototype (testées)

| Menace | Parade | Test |
|---|---|---|
| Voter deux fois avec la même pièce | registre d'empreintes HMAC du numéro de titre | `double vote rejeté` |
| Compter deux bulletins d'un même droit | nullifier ; seul le dernier compte | `double vote`, `revote` |
| Rejouer un ancien bulletin (coercitif) ou revoter à la place d'autrui | séquence croissante, chiffrés uniques, signature de la clé de vote | `revote` |
| Bulletin qui vaut 2 (ou −1, ou 1000) | preuve disjonctive vérifiée par l'urne **et** par le vérificateur | `bulletin invalide` |
| Jeton forgé | signature RFC 9474 vérifiée | `jeton forgé` |
| Pièce d'une fausse autorité, cluster corrompu minoritaire, puce modifiée | majorité de clusters, signature de la puce | `éligibilité` |
| Autorité qui fausse son déchiffrement | preuve de Chaum-Pedersen ; écartée, t autres suffisent ; sinon refus de dépouiller plutôt que faux total | `autorité malhonnête au dépouillement` |
| Autorité qui triche à la cérémonie des clés | vérification de Feldman, disqualification | `autorité malhonnête à la cérémonie` |
| Tableau modifié, entrée retirée, résultat changé (même en recalculant la chaîne) | chaîne d'empreintes, recomptage complet, signatures des témoins | `journal altéré` |
| Urne qui ajoute des votants fictifs au-delà des droits délivrés | borne publique votants ≤ droits ≤ inscrits | `bourrage` |
| Une seule autorité qui déchiffre seule un bulletin | clé partagée, seuil 2 sur 3 | par construction |

## Menaces NON couvertes (à dire sans détour)

1. **Le terminal de l'électeur** : un téléphone ou un ordinateur compromis peut voter autrement que l'électeur ne le croit. Aucune parade ici ; il faudrait au minimum le **défi de Benaloh** (l'électeur fait chiffrer, puis demande à voir l'aléa pour vérifier sur un autre appareil) et des vérifications sur un appareil indépendant.
2. **Liberté du vote à domicile** : le revote est une parade partielle ; pas de résistance complète à la contrainte (votes de leurre de type JCJ/Civitas non implémentés). Le bulletin n'est **pas sans reçu** : un électeur qui garde l'aléa r peut prouver son vote, donc le vendre (le revote atténue, sans supprimer). Parade sûre : la borne en mairie.
3. **Émetteur malhonnête** : il peut délivrer des droits à des électeurs fictifs s'il publie autant de fausses empreintes ; le vérificateur ne voit que des bornes de cohérence. Contrôle nécessaire : un organe indépendant qui audite le registre (avec la clé HMAC) contre la liste électorale, et des émetteurs multiples à seuil (signature aveugle à seuil : recherche, pas de bibliothèque mûre à notre connaissance ⚠️).
4. **Corrélation temporelle et réseau** : délivrance et dépôt proches dans le temps depuis la même adresse lèvent l'anonymat ; non traité (pas de réseau ici). Mesures prévues : fenêtres séparées, aucune journalisation d'adresses, relais d'anonymisation.
5. **Censure par l'urne** : un opérateur peut refuser un bulletin valide. L'électeur s'en aperçoit (code de suivi absent) mais le prototype n'a ni réplication chez plusieurs organes ni reçu signé de l'urne.
6. **Vérification individuelle réelle** : elle suppose que des électeurs vérifient vraiment leur code de suivi ; non mesuré.
7. **Disponibilité** : déni de service, panne, montée en charge (millions de bulletins) non testés ; le logarithme discret final est linéaire (convient jusqu'à quelques millions de voix, un pas de bébé-pas de géant serait préférable).
8. **Canaux auxiliaires** : JavaScript n'offre pas de garantie de temps constant ; les clés secrètes vivent en mémoire d'un même processus (les parts de la cérémonie circulent en clair entre objets, au lieu de canaux chiffrés et authentifiés).
9. **Biais de clé Joint-Feldman** (Gennaro et al.) : sans effet connu sur la sécurité d'ElGamal, mais un système réel prendrait GJKR ou la cérémonie d'ElectionGuard telle quelle.
10. **Identité réelle** : lecture NFC, biométrie, attestation d'appareil, listes maîtresses des autorités émettrices : tout est simulé.
11. **Chaîne logicielle** : construction reproductible, signature des paquets, verrouillage des dépendances au-delà de `package-lock.json` : non faits.
12. **Auto-audit** : ce code a été écrit et testé par la même IA, avec les mêmes biais ; il n'a été relu par aucun cryptographe. C'est la limite principale.

## Procédure de compromission et analyse par des IA de sécurité

Voir [`docs/procedure-compromission.md`](docs/procedure-compromission.md) : tout `ERREUR` du vérificateur, toute faille permettant de modifier, ajouter ou retirer un bulletin sans détection, toute fuite de clé au-delà du seuil, ou toute divergence entre vérificateurs indépendants **annule** le scrutin numérique et renvoie aux urnes papier. Avant chaque usage : code ouvert, analyse automatisée par des IA de sécurité (scans, scénarios d'attaque), prime aux failles, défi public, audit humain.

## Grille « au moins aussi sûr que le papier », mise à jour honnêtement après le prototype

Le prototype ne change **rien** aux lignes qui dépendent du terrain (domicile, terminal, contrainte). Il **démontre en code** ce qui relève de la cryptographie, sous réserve d'audit.

| Critère | Verdict du cahier (§ 6, avant code) | Ce que le prototype montre (02/11/2026) | Verdict après prototype |
|---|---|---|---|
| Secret | borne : égal ; domicile : moins bon | séparation identité/bulletin par signature aveugle ; aucune autorité seule ne déchiffre | **inchangé** (le secret à domicile dépend du terminal et du réseau, non traités) |
| Liberté | borne : égal ; domicile : moins bon | revote fonctionnel, rejeu refusé | **inchangé** : le revote ne suffit pas ; pas sans reçu |
| Identité | meilleur sous réserve | contrat simulé : un titre = un droit, clusters majoritaires | **non démontré** (aucune vraie puce lue, aucune biométrie) |
| Intégrité du décompte | meilleur avec trace papier, moins bon sans | toute altération du tableau, tout faux déchiffrement, tout bulletin hors {0, 1} est détecté par un vérificateur indépendant | **meilleur sur la vérifiabilité du calcul** ; la borne avec papier reste nécessaire contre un terminal compromis |
| Vérifiabilité par les citoyens | meilleur en principe, moins bon en compréhensibilité | recomptage par un script de 300 lignes, code de suivi | **meilleur en principe, démontré en local** ; compréhensibilité toujours moins bonne ; un seul vérificateur (le même auteur) |
| Échelle d'une fraude | moins bon | une fraude **sur le tableau** est détectée quelle que soit son ampleur ; une fraude **sur les terminaux ou chez l'émetteur** ne l'est pas | **moins bon** tant que terminaux et émetteur ne sont pas couverts |
| Accessibilité | meilleur, moins bon sans équipement | rien (pas d'interface) | **inchangé** |
| Coût | incertain | développement : quelques jours avec l'IA pour ce noyau | **incertain** : le coût réel est l'audit, la prime, les pilotes (cahier, révision du calendrier) |

**Lecture** : le noyau cryptographique d'un scrutin vérifiable tient en quelques centaines de lignes appuyées sur des bibliothèques auditées ; cela confirme l'objection de l’auteur sur la vitesse de développement. Mais aucun des deux points durs (terminal de l'électeur, liberté à domicile) n'est résolu par du code, et rien de ce qui est ici n'est sûr tant que des tiers ne l'ont pas audité.

## Prochaines étapes

1. **Relecture par des cryptographes et confrontation à Belenios / ElectionGuard** : soit remplacer le cœur maison (ElGamal, preuves, seuil) par une implémentation de référence auditée (Belenios, ou ElectionGuard et ses vecteurs de test), soit faire auditer ces 400 lignes ; écrire un **second vérificateur dans un autre langage** (Python ou Rust) par une autre personne.
2. **Borne en mairie** : prototype avec impression du bulletin papier, défi de Benaloh, audit statistique papier/électronique, voie « agent en mairie » pour la délivrance du droit, et règle d'annulation du vote à domicile.
3. **Ouverture et mise à l'épreuve** : publication du code, analyse automatisée par des IA de sécurité, prime aux failles et défi public (procédure écrite dans `docs/`), puis vote consultatif entre volontaires avec mesure du taux de vérification des codes de suivi.
