// Tableau d'affichage public en ajout seul (« bulletin board »).
// Chaque entrée contient l'empreinte de la précédente : modifier, retirer ou réordonner une entrée
// casse la chaîne, ce que tout vérificateur détecte. Principe des journaux de transparence
// (Certificate Transparency, RFC 9162), en version simple (chaîne linéaire, pas d'arbre de Merkle).
// En fin de scrutin, chaque autorité signe l'empreinte de tête (« témoins ») : un opérateur qui
// présenterait deux versions différentes du tableau à deux publics serait pris en défaut.
// Limite : un tableau unique tenu par un seul opérateur peut refuser des bulletins (censure) ;
// le système réel le répliquerait chez plusieurs organes indépendants (cahier § 4.10).

import { empreinte } from './outils.js';

export const RACINE = '0'.repeat(64);

export function empreinteEntree(e) {
  return empreinte('referendum-poc/tableau/v1', { index: e.index, type: e.type, contenu: e.contenu, precedente: e.precedente });
}

export class Tableau {
  constructor() {
    this.entrees = [];
  }

  get tete() {
    return this.entrees.length ? this.entrees[this.entrees.length - 1].empreinte : RACINE;
  }

  ajouter(type, contenu) {
    const e = { index: this.entrees.length, type, contenu, precedente: this.tete };
    e.empreinte = empreinteEntree(e);
    this.entrees.push(e);
    return e;
  }

  versJson() {
    return JSON.stringify({ format: 'referendum-poc/tableau/v1', entrees: this.entrees }, null, 1);
  }
}
