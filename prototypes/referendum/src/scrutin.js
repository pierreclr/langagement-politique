// Orchestration d'un référendum consultatif oui/non, en local (aucun réseau, aucun serveur).
// PROTOTYPE NON AUDITÉ. Rôles séparés : fournisseur d'identité (monde A), émetteur de droits
// (signature aveugle), urne / tableau public (monde B), autorités de déchiffrement (seuil t sur n).

import { p256, bytesToHex, hexToBytes, utf8ToBytes, empreinte, pointVersHex, hexVersPoint } from './outils.js';
import { chiffrer, additionner, chiffreVersJson, jsonVersChiffre, prouverZeroOuUn, verifierZeroOuUn, logDiscretBorne } from './elgamal.js';
import { Autorite, ceremonieDeCles, cleDeVerification, verifierPartiel, combiner } from './seuil.js';
import { EmetteurDeDroits, Electeur, NOM_SUITE, importerClePubliqueEmetteur, jetonValide, lireJeton, nullifier, signatureVoteValide } from './jeton.js';
import { Tableau } from './tableau.js';

/** Contexte lié à chaque preuve de bulletin : empêche de recopier une preuve sur un autre bulletin. */
export function contexteBulletin(idScrutin, nul, sequence) {
  return `referendum-poc/bulletin|${idScrutin}|${nul}|${sequence}`;
}

export function contexteDechiffrement(idScrutin) {
  return `referendum-poc/dechiffrement|${idScrutin}`;
}

/** Code de suivi d'un bulletin : l'électeur le calcule lui-même et le retrouve sur le tableau. */
export function codeDeSuivi(contenu) {
  return empreinte('referendum-poc/bulletin/v1', contenu);
}

/**
 * Fabrique un bulletin chiffré et prouvé. `options.valeurForcee` sert aux tests : chiffrer une autre
 * valeur que celle annoncée à la preuve (par exemple 2), ce que la preuve doit faire rejeter.
 */
export function fabriquerBulletin(electeur, Y, choix, options = {}) {
  const nul = nullifier(electeur.idScrutin, electeur.jeton);
  electeur.sequence += 1;
  const valeur = options.valeurForcee ?? choix;
  const c = chiffrer(Y, valeur);
  const preuve = prouverZeroOuUn(Y, c, choix, c.r, contexteBulletin(electeur.idScrutin, nul, electeur.sequence));
  const contenu = {
    scrutin: electeur.idScrutin,
    jeton: electeur.jeton,
    nullifier: nul,
    sequence: electeur.sequence,
    chiffre: chiffreVersJson(c),
    preuve,
  };
  return { contenu, signature: electeur.signer(contenu) };
}

export class Scrutin {
  constructor({ idScrutin, question, autorites, seuil, fournisseurIdentite, tailleListeElectorale }) {
    this.idScrutin = idScrutin;
    this.question = question;
    this.t = seuil;
    this.autorites = autorites.map((nom, k) => new Autorite(k + 1, nom.nom ?? nom, seuil, { malhonnete: nom.malhonnete ?? null }));
    this.temoins = new Map(this.autorites.map((a) => [a.indice, p256.utils.randomSecretKey()]));
    this.identite = fournisseurIdentite;
    this.tailleListeElectorale = tailleListeElectorale;
    this.tableau = new Tableau();
    this.derniers = new Map(); // nullifier -> { sequence, chiffre }
    this.chiffresVus = new Set();
    this.etat = 'creation';
  }

  /** Cérémonie des clés, création de l'émetteur, publication des paramètres. */
  async ouvrir() {
    const ceremonie = ceremonieDeCles(this.autorites, this.t);
    this.Y = ceremonie.Y;
    this.ceremonie = ceremonie;
    this.emetteur = await EmetteurDeDroits.creer(this.identite);
    this.clePubliqueEmetteur = this.emetteur.cles.publicKey;
    this.tableau.ajouter('ouverture', {
      scrutin: this.idScrutin,
      question: this.question,
      courbe: 'P-256',
      suiteJeton: NOM_SUITE,
      cleEmetteur: this.emetteur.spkiHex,
      seuil: this.t,
      autorites: this.autorites.map((a) => ({
        indice: a.indice, nom: a.nom, cleTemoin: bytesToHex(p256.getPublicKey(this.temoins.get(a.indice))),
      })),
      qualifiees: ceremonie.qualifiees,
      plaintes: ceremonie.plaintes,
      engagements: ceremonie.engagementsJson,
      clePublique: pointVersHex(this.Y),
      tailleListeElectorale: this.tailleListeElectorale,
    });
    this.etat = 'ouvert';
    return ceremonie;
  }

  /** Crée un électeur pour une pièce et lui fait retirer son droit de vote anonyme. */
  async inscrireElecteur(piece) {
    const e = new Electeur(piece, this.idScrutin);
    await e.obtenirJeton(this.emetteur, this.clePubliqueEmetteur);
    return e;
  }

  /** L'urne : vérifie un bulletin et l'ajoute au tableau. Lève une erreur explicite en cas de rejet. */
  async deposer(bulletin) {
    if (this.etat !== 'ouvert') throw new Error('rejeté : scrutin fermé');
    const { contenu, signature } = bulletin;
    if (contenu.scrutin !== this.idScrutin) throw new Error('rejeté : autre scrutin');
    if (!(await jetonValide(this.clePubliqueEmetteur, contenu.jeton))) throw new Error('rejeté : jeton non signé par l\'émetteur');
    let info;
    try { info = lireJeton(contenu.jeton); } catch { throw new Error('rejeté : jeton illisible'); }
    if (info.scrutin !== this.idScrutin) throw new Error('rejeté : jeton d\'un autre scrutin');
    if (contenu.nullifier !== nullifier(this.idScrutin, contenu.jeton)) throw new Error('rejeté : nullifier faux');
    if (!signatureVoteValide(info.cleVote, contenu, signature)) throw new Error('rejeté : signature de la clé de vote invalide');
    const precedent = this.derniers.get(contenu.nullifier);
    if (!Number.isSafeInteger(contenu.sequence) || (precedent && contenu.sequence <= precedent.sequence)) {
      throw new Error('rejeté : séquence non croissante (rejeu d\'un ancien bulletin)');
    }
    const cleChiffre = contenu.chiffre.A + contenu.chiffre.B;
    if (this.chiffresVus.has(cleChiffre)) throw new Error('rejeté : chiffré déjà présent (copie)');
    let c;
    try { c = jsonVersChiffre(contenu.chiffre); } catch { throw new Error('rejeté : chiffré mal formé'); }
    if (!verifierZeroOuUn(this.Y, c, contenu.preuve, contexteBulletin(this.idScrutin, contenu.nullifier, contenu.sequence))) {
      throw new Error('rejeté : la preuve ne montre pas que le bulletin vaut 0 ou 1');
    }
    this.chiffresVus.add(cleChiffre);
    this.derniers.set(contenu.nullifier, { sequence: contenu.sequence, chiffre: c });
    this.tableau.ajouter('bulletin', { contenu, signature });
    return codeDeSuivi(contenu);
  }

  /** Clôture : publication du nombre de droits délivrés et agrégat homomorphe des derniers bulletins. */
  cloturer() {
    this.etat = 'clos';
    const empreintes = [...this.emetteur.empreintesServies].sort();
    this.tableau.ajouter('cloture', { droitsDelivres: empreintes.length, empreintesServies: empreintes });
    let agregat = null;
    for (const { chiffre } of this.derniers.values()) agregat = agregat ? additionner(agregat, chiffre) : chiffre;
    this.agregat = agregat;
    this.tableau.ajouter('agregat', { chiffre: agregat ? chiffreVersJson(agregat) : null, comptes: this.derniers.size });
  }

  /**
   * Dépouillement par les autorités présentes. Chaque déchiffrement partiel est vérifié ; les faux sont
   * publiés et signalés, et le total est calculé avec t déchiffrements valides.
   */
  depouiller(indicesPresents) {
    const ctx = contexteDechiffrement(this.idScrutin);
    const { engagementsJson, qualifiees } = this.ceremonie;
    const N = this.derniers.size;
    if (!this.agregat) {
      this.tableau.ajouter('resultat', { oui: 0, non: 0, exprimes: 0, retenus: [], ecartes: [] });
      return this.signerTemoins({ oui: 0, non: 0, exprimes: 0 });
    }
    const partiels = indicesPresents
      .map((i) => this.autorites.find((a) => a.indice === i))
      .filter((a) => a && qualifiees.includes(a.indice))
      .map((a) => a.dechiffrerPartiellement(this.agregat.A, ctx, cleDeVerification(engagementsJson, qualifiees, a.indice)));
    const valides = partiels.filter((p) => verifierPartiel(engagementsJson, qualifiees, this.agregat.A, p, ctx));
    const ecartes = partiels.filter((p) => !valides.includes(p)).map((p) => p.indice);
    this.tableau.ajouter('dechiffrement', { partiels });
    if (valides.length < this.t) throw new Error(`dépouillement impossible : ${valides.length} déchiffrements valides pour un seuil de ${this.t}`);
    const retenus = valides.slice(0, this.t);
    const oui = logDiscretBorne(combiner(this.agregat.B, retenus), N);
    const resultat = { oui, non: N - oui, exprimes: N, retenus: retenus.map((p) => p.indice), ecartes };
    this.tableau.ajouter('resultat', resultat);
    return this.signerTemoins(resultat);
  }

  /** Chaque autorité signe l'empreinte de l'entrée « résultat » (témoin de l'état final du tableau). */
  signerTemoins(resultat) {
    const tete = this.tableau.tete;
    const signatures = this.autorites.map((a) => ({
      indice: a.indice,
      signature: bytesToHex(p256.sign(utf8ToBytes(tete), this.temoins.get(a.indice))),
    }));
    this.tableau.ajouter('temoins', { tete, signatures });
    return resultat;
  }
}

export { hexToBytes, hexVersPoint, importerClePubliqueEmetteur };
