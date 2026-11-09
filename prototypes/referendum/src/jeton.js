// Droit de vote anonyme : signature aveugle RSA (RFC 9474, variante RSABSSA-SHA384-PSS-Randomized),
// par la bibliothèque @cloudflare/blindrsa-ts (conforme aux vecteurs de test de la RFC).
//
// Principe (Chaum, « Blind Signatures for Untraceable Payments », CRYPTO 1982) :
//  1. l'électeur fabrique lui-même un message contenant l'identifiant du scrutin et une clé de vote
//     publique fraîche (ECDSA P-256) dont il garde seul la clé secrète ;
//  2. il « aveugle » ce message et présente sa pièce d'identité avec le message aveuglé ;
//  3. l'émetteur vérifie l'éligibilité (monde A) et signe le message aveuglé SANS LE VOIR ;
//  4. l'électeur « désaveugle » : il obtient une signature valide sur son message, que l'émetteur
//     ne peut pas relier à la session de délivrance (propriété d'aveuglement, RFC 9474 § 7.3).
// Le « nullifier » est l'empreinte du message signé : un même droit de vote produit toujours le même
// nullifier, donc deux bulletins du même jeton se reconnaissent (revote : seul le dernier compte),
// sans rien révéler de l'identité.
// Avertissement de la RFC (§ 7.2 et 5) : la clé RSA de l'émetteur ne doit servir qu'à cet usage.

import { RSABSSA } from '@cloudflare/blindrsa-ts';
import { p256, bytesToHex, hexToBytes, utf8ToBytes, empreinte, jsonCanonique } from './outils.js';

export const SUITE = RSABSSA.SHA384.PSS.Randomized();
export const NOM_SUITE = 'RSABSSA-SHA384-PSS-Randomized (RFC 9474)';
const TAILLE_PREFIXE = 32; // préfixe aléatoire de la variante « Randomized » (RFC 9474 § 4.1)

/** Importe une clé publique RSA publiée (SPKI hexadécimal) pour vérifier les jetons. */
export async function importerClePubliqueEmetteur(spkiHex) {
  return crypto.subtle.importKey('spki', hexToBytes(spkiHex), { name: 'RSA-PSS', hash: 'SHA-384' }, true, ['verify']);
}

/** L'émetteur des droits de vote : ne voit que des messages aveuglés. */
export class EmetteurDeDroits {
  constructor(fournisseurIdentite, cles, spkiHex) {
    this.identite = fournisseurIdentite;
    this.cles = cles;
    this.spkiHex = spkiHex;
    this.empreintesServies = []; // publiées à la clôture : nombre et empreintes des titres servis
  }

  static async creer(fournisseurIdentite, bits = 2048) {
    const cles = await SUITE.generateKey({ modulusLength: bits, publicExponent: Uint8Array.from([1, 0, 1]) });
    const spki = bytesToHex(new Uint8Array(await crypto.subtle.exportKey('spki', cles.publicKey)));
    return new EmetteurDeDroits(fournisseurIdentite, cles, spki);
  }

  /** Délivre une signature aveugle si la pièce est éligible et n'a jamais été servie. */
  async delivrer(piece, messageAveugleHex) {
    const verdict = this.identite.verifierEligibilite(piece);
    if (!verdict.ok) throw new Error('droit refusé : ' + verdict.motif);
    const signatureAveugle = await SUITE.blindSign(this.cles.privateKey, hexToBytes(messageAveugleHex));
    this.identite.marquerServi(verdict.empreinte);
    this.empreintesServies.push(verdict.empreinte);
    return bytesToHex(signatureAveugle);
  }
}

/** Côté électeur : prépare le message, l'aveugle, puis finalise le jeton. */
export class Electeur {
  constructor(piece, idScrutin) {
    this.piece = piece;
    this.idScrutin = idScrutin;
    this.cleVoteSecrete = p256.utils.randomSecretKey();
    this.cleVotePublique = bytesToHex(p256.getPublicKey(this.cleVoteSecrete));
    this.jeton = null;
    this.sequence = 0;
  }

  async obtenirJeton(emetteur, clePubliqueEmetteur) {
    const brut = utf8ToBytes(jsonCanonique({ scrutin: this.idScrutin, cleVote: this.cleVotePublique }));
    const prepare = SUITE.prepare(brut);
    const { blindedMsg, inv } = await SUITE.blind(clePubliqueEmetteur, prepare);
    const sigAveugle = await emetteur.delivrer(this.piece, bytesToHex(blindedMsg));
    const signature = await SUITE.finalize(clePubliqueEmetteur, prepare, hexToBytes(sigAveugle), inv);
    this.jeton = { message: bytesToHex(prepare), signature: bytesToHex(signature) };
    return this.jeton;
  }

  /** Signe le contenu d'un bulletin avec la clé de vote (prouve qu'il vient du détenteur du jeton). */
  signer(contenu) {
    return bytesToHex(p256.sign(utf8ToBytes(jsonCanonique(contenu)), this.cleVoteSecrete));
  }
}

/** Lit le contenu d'un jeton (après le préfixe aléatoire de 32 octets). */
export function lireJeton(jeton) {
  const octets = hexToBytes(jeton.message);
  return JSON.parse(new TextDecoder().decode(octets.slice(TAILLE_PREFIXE)));
}

/** Nullifier : empreinte stable du droit de vote, identique pour tous les bulletins d'un même jeton. */
export function nullifier(idScrutin, jeton) {
  return empreinte('referendum-poc/nullifier/v1', { scrutin: idScrutin, message: jeton.message });
}

/** Vérifie la signature de l'émetteur sur le jeton. */
export async function jetonValide(clePubliqueEmetteur, jeton) {
  try {
    return await SUITE.verify(clePubliqueEmetteur, hexToBytes(jeton.signature), hexToBytes(jeton.message));
  } catch {
    return false;
  }
}

/** Vérifie la signature de la clé de vote sur un bulletin. */
export function signatureVoteValide(cleVotePubliqueHex, contenu, signatureHex) {
  try {
    return p256.verify(hexToBytes(signatureHex), utf8ToBytes(jsonCanonique(contenu)), hexToBytes(cleVotePubliqueHex));
  } catch {
    return false;
  }
}
