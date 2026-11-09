// Mise en place d'un scrutin simulé (titres de test, clusters, liste électorale), partagée par la
// démonstration et les tests.

import { AutoriteDeTitresTest, ClusterDeConfiance, FournisseurIdentiteSimule } from './identite.js';
import { Scrutin } from './scrutin.js';

export const QUESTION_TEST = 'Faut-il tester le vote numérique en mairie, avec trace papier, lors d\'une consultation locale ?';

/**
 * @param nElecteurs nombre de titres délivrés et inscrits
 * @param autorites noms (ou { nom, malhonnete }) des autorités de déchiffrement
 * @param seuil nombre d'autorités nécessaires au dépouillement
 */
export async function monterScrutin({ nElecteurs = 10, autorites = ['Autorité indépendante', 'Organisme de recherche', 'Citoyens tirés au sort'], seuil = 2, idScrutin = 'consultation-test-2026' } = {}) {
  const csca = new AutoriteDeTitresTest('CSCA-TEST-FR');
  const faussaire = new AutoriteDeTitresTest('CSCA-FAUSSAIRE');
  // Trois organes publics distincts tiennent leur liste de confiance ; le faussaire a réussi à se faire
  // inscrire chez un seul d'entre eux (cluster corrompu), ce qui ne suffit pas.
  const clusters = [
    new ClusterDeConfiance('Agence des titres (test)', [csca.clePublique]),
    new ClusterDeConfiance('Agence de cybersécurité (test)', [csca.clePublique]),
    new ClusterDeConfiance('Autorité d\'un autre État membre (test)', [csca.clePublique, faussaire.clePublique]),
  ];
  const pieces = Array.from({ length: nElecteurs }, (_, k) => csca.delivrerPiece(`T${String(k + 1).padStart(8, '0')}`, `Électeur ${k + 1}`, '1990-01-01'));
  const nonInscrit = csca.delivrerPiece('T99999999', 'Non inscrit', '1990-01-01');
  const fausse = faussaire.delivrerPiece('T00000001', 'Usurpateur', '1990-01-01');
  const fournisseur = new FournisseurIdentiteSimule({
    clusters,
    listeElectorale: pieces.map((p) => p.dg1.numero),
    clesEmetteurs: { [csca.nom]: csca.clePublique, [faussaire.nom]: faussaire.clePublique },
  });
  const scrutin = new Scrutin({ idScrutin, question: QUESTION_TEST, autorites, seuil, fournisseurIdentite: fournisseur, tailleListeElectorale: nElecteurs });
  await scrutin.ouvrir();
  return { scrutin, pieces, nonInscrit, fausse, csca };
}
