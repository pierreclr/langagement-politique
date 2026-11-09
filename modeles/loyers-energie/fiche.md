---
titre: Loyer plafonné selon l'énergie, sur diagnostics réels
theme: se loger
statut: brouillon ; dernier calcul du 08/11/2026
---

## La question

Si le loyer maximal d'un logement dépend de sa taille, du marché local et de l'énergie qu'il consomme, quels loyers seraient coupés, de combien, et le propriétaire a-t-il intérêt à isoler plutôt qu'à poser une pompe à chaleur ? Ce modèle est la suite sur données réelles de `loyer-energie`. Ses résultats centraux alimentent le plafond de loyer de `fonciere-afflux`. Il porte sur la réforme locative du programme (fin des niches, bail unique, loyer plafonné selon l'énergie).

## Ce qui entre

- 71 200 diagnostics de performance énergétique (DPE) d'appartements de Paris, Lyon, Grenoble et Angers (2026) et 5 600 diagnostics de la Creuse (2025-2026) : base de l'ADEME, statistique publique. Ce sont des diagnostics de ventes et de locations, pas le parc ; ils sont pris comme vrais.
- Loyers d'annonce de la carte des loyers 2025 (ministère du logement), recalés sur les observatoires locaux des loyers (Paris 2025, Lyon et Grenoble 2024) : les annonces sont de 16 à 41 % au-dessus des loyers en cours. Angers et la Creuse n'ont pas d'observatoire : recalage moyen.
- Prix du kWh : électricité 0,2001 € (tarif réglementé, source officielle) ; gaz, fioul, bois, réseau : hypothèses.
- Paramètres de conception : coefficient k, poids du chauffage réel et du besoin du bâti, coûts de travaux.

## Comment il calcule

1. **Le marché.** À chaque ville, une droite relie le loyer d'un 37 m² à celui d'un 72 m² (loyer = a + pente × surface), recalée sur le stock. Le loyer dépend donc surtout d'un coût fixe par logement, pas seulement de la surface.
2. **Le plafond.** Plafond mensuel = base(taille) + variable × surface de référence − déduction d'énergie. La surface de référence est celle d'avant isolation par l'intérieur.
3. **La déduction.** Déduction = [coût réel des usages hors chauffage + 0,3 × coût réel du chauffage + 0,7 × coût du besoin de chauffage et de froid du bâti] / 12. Le besoin du bâti est la chaleur dont le logement a besoin avant le rendement du chauffage, valorisée à 0,15 €/kWh.
4. **Le calibrage.** La base de chaque taille est réglée pour que le plafond d'un logement moyen de cette taille vaille 1,2 fois le loyer médian local. La variable par m² vaut 1,2 fois la pente locale.
5. **Qui dépasse.** Les loyers actuels sont répartis autour du loyer médian de leur classe selon une loi log-normale (beaucoup de loyers proches, quelques écarts), dont la dispersion est tirée des observatoires. La part au-dessus du plafond est calculée par la loi, sans tirage.

Exemple (resultats-sortie.txt et README, section 6) : T2 en classe G de 33 m² à Grenoble, tout électrique. Base du T2 de 335 €, variable 8,6 €/m² × 33 m² = 284 €, déduction 137 €. Plafond = 335 + 284 − 137, soit environ 481 €, pour un loyer médian de marché de 429 € : 52 € de marge, et 26 % des loyers de ce type dépassent le plafond.

## L'hypothèse qui porte le résultat

**Le coefficient k de 1,2 : un plafond à 120 % du loyer médian local.** C'est un paramètre politique, avant l'énergie. À k = 1,2, environ un cinquième des loyers actuels dépasse le plafond, dont presque tout vient du seuil et de la dispersion naturelle des loyers (18 à 23 % même sans effet de l'énergie). À k = 1,3 : 11 à 14 % ; à k = 1,5 : 3 à 6 % ; à k = 1,1 : 32 à 36 % (README, sections 0 et 9). L'effet de l'énergie seule ajoute 0 à 4 points en moyenne.

## Ce que l'IA a choisi elle-même

Sur 15 hypothèses numérotées, au moins 10 sont posées par l'IA : H2 (prix hors électricité), H3 (0,15 €/kWh), H4, H5, H7, H9, H10, H12, H13, H15. Les plus lourdes :

- H4 : le poids de 0,3 pour le coût réel du chauffage. La méthode dit que c'est un paramètre de conception, choisi pour que l'isolation batte la pompe à chaleur ; 0,5 ne suffit pas. Il façonne donc le résultat sur le paradoxe de la pompe à chaleur.
- H9 : primes de loyer par classe (+4 % à −6 %), sans source.
- H10 : dispersion des loyers, tirée de trois observatoires et étendue à Angers et à la Creuse.
- H12 et H13 : isolation de −45 % du besoin et de −4 % de surface ; coûts de 160 €/m² et 90 €/m², sans aides.
- H15 : trois scénarios (k de 1,3, 1,2 ou 1,1 ; prix de l'énergie ; primes ; dispersion).
- H11 : le besoin du bâti est imputé pour 4 à 34 % des diagnostics selon la zone.
- Les numéros d'hypothèse du code ne correspondent pas à ceux de README (par exemple, le poids du chauffage est « H7 » dans le code, H4 dans README).

## Ce qu'il ne fait pas

- Aucun effet de comportement : pas de retrait de logements, pas de hausse des loyers des bons logements.
- Il suppose que tous les loyers sont soumis au plafond. Si le plafond ne s'applique qu'à la relocation, l'effet annuel est une fraction de celui-ci.
- L'échantillon de diagnostics n'est pas le parc locatif.
- Une zone rurale et un département seulement ; Paris sur deux mois de diagnostics.
- Il ne prouve pas que le plafond marcherait : il montre ce qu'il faudrait pour qu'il morde.

## Ce qu'il donne

- Effet de l'énergie seule sur un logement G : −64 € par mois à Paris, −102 à Lyon, −93 à Grenoble, −85 à Angers, −145 à −146 € en Creuse (README, point 4).
- Un cinquième des loyers dépasse le plafond (20 à 22 % dans les quatre villes) ; en Creuse, 49 % des maisons G (point 5, section 9).
- Pour un G à Grenoble, avec 30/70 et surface figée, l'isolation rapporte +89 € de plafond contre +39 € pour la pompe à chaleur seule ; retour de 7,7 ans contre 9,9 ans (point 9).
- Le coût total loyer plus énergie entre un G et un D diminue de 10 à 60 % selon le scénario, sans s'annuler (point 8).
- Recommandation du modèle : k = 1,3 au démarrage, plafond appliqué à la relocation seulement, surface de référence figée (section 9).

## Comment le refaire

Depuis le dossier du modèle :

- `python3 -I test_modele.py` : 10 tests, lancés le 9 novembre 2026, ils passent.
- Chaîne complète : `python3 -I telecharger_donnees.py`, puis `preparer_donnees.py`, `simuler.py > resultats-sortie.txt` et `gen_tables.py` (non relancée ici ; les données lourdes sont hors dépôt).
