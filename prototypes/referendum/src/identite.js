// Module « identité » SIMULÉ et remplaçable (monde A : éligibilité).
//
// Ce module reproduit le CONTRAT d'une vraie brique d'identité, sans accès à France Identité,
// FranceConnect+ ni au répertoire électoral unique (REU) :
//   « une pièce dont la puce est signée par une autorité reconnue donne droit à UN droit de vote ».
//
// Ce qui est simulé :
//  - l'autorité émettrice des titres (rôle de la CSCA d'un État, norme OACI 9303) est une clé ECDSA P-256
//    de test ; la « puce » est un objet { dg1, sod } où sod est la signature des données DG1 ;
//  - plusieurs « clusters » publics distincts tiennent chacun leur liste de confiance ; un certificat
//    n'est accepté que si une majorité d'entre eux le reconnaît (orientation de l’auteur, cahier § 4.10) ;
//  - la liste électorale est un ensemble de numéros de titres (simulation du REU) ;
//  - aucune lecture NFC, aucune comparaison de visage, aucun test de présence.
//
// Interface à respecter par toute brique réelle (une entreprise de logiciel, France Identité, agent en mairie) :
//   verifierEligibilite(piece) -> { ok: boolean, motif?: string, empreinte?: string }
// L'empreinte est un HMAC du numéro de titre sous une clé secrète du registre : elle sert à refuser
// un second droit de vote, sans conserver le numéro ni aucun lien avec le bulletin.

import { p256, sha256, bytesToHex, hexToBytes, utf8ToBytes, randomBytes, jsonCanonique } from './outils.js';
import { hmac } from '@noble/hashes/hmac.js';

/** Autorité de test qui « fabrique » des titres d'identité à puce signée. */
export class AutoriteDeTitresTest {
  constructor(nom = 'CSCA-TEST-FR') {
    this.nom = nom;
    this.cleSecrete = p256.utils.randomSecretKey();
    this.clePublique = bytesToHex(p256.getPublicKey(this.cleSecrete));
  }

  /** Délivre une pièce : DG1 (état civil minimal) + signature de l'autorité (rôle du SOD). */
  delivrerPiece(numero, nom, dateNaissance) {
    const dg1 = { numero, nom, dateNaissance, emetteur: this.nom };
    const sod = bytesToHex(p256.sign(utf8ToBytes(jsonCanonique(dg1)), this.cleSecrete));
    return { dg1, sod };
  }
}

/** Un cluster de confiance : un organe public qui tient sa propre liste de clés d'autorités émettrices. */
export class ClusterDeConfiance {
  constructor(nom, clesReconnues = []) {
    this.nom = nom;
    this.cles = new Set(clesReconnues);
  }

  reconnait(clePublique) {
    return this.cles.has(clePublique);
  }
}

/** Vérifie la signature de la puce avec une clé publique donnée. */
function signatureValide(piece, clePublique) {
  try {
    return p256.verify(hexToBytes(piece.sod), utf8ToBytes(jsonCanonique(piece.dg1)), hexToBytes(clePublique));
  } catch {
    return false;
  }
}

/**
 * Fournisseur d'éligibilité simulé. Remplaçable par toute brique respectant `verifierEligibilite`.
 * @param clusters  organes tenant les listes de confiance (accord à la majorité)
 * @param listeElectorale  ensemble des numéros de titres inscrits (simulation du REU)
 * @param clesEmetteurs  table nom d'émetteur -> clé publique (annuaire des autorités émettrices)
 */
export class FournisseurIdentiteSimule {
  constructor({ clusters, listeElectorale, clesEmetteurs }) {
    this.clusters = clusters;
    this.listeElectorale = new Set(listeElectorale);
    this.clesEmetteurs = clesEmetteurs;
    this.cleRegistre = randomBytes(32); // secret du registre : rend les empreintes non devinables
    this.dejaServis = new Set();
  }

  /** Empreinte irréversible d'un numéro de titre (HMAC-SHA-256 sous la clé du registre). */
  empreinteDe(numero) {
    return bytesToHex(hmac(sha256, this.cleRegistre, utf8ToBytes(numero)));
  }

  verifierEligibilite(piece) {
    const cle = this.clesEmetteurs[piece?.dg1?.emetteur];
    if (!cle) return { ok: false, motif: 'émetteur inconnu' };
    const votes = this.clusters.filter((c) => c.reconnait(cle)).length;
    if (votes * 2 <= this.clusters.length) return { ok: false, motif: 'certificat non reconnu par une majorité de clusters' };
    if (!signatureValide(piece, cle)) return { ok: false, motif: 'puce non authentique (signature invalide)' };
    if (!this.listeElectorale.has(piece.dg1.numero)) return { ok: false, motif: 'non inscrit sur la liste électorale' };
    const empreinte = this.empreinteDe(piece.dg1.numero);
    if (this.dejaServis.has(empreinte)) return { ok: false, motif: 'droit de vote déjà délivré pour ce titre' };
    return { ok: true, empreinte };
  }

  /** Marque le titre comme servi (appelé une fois la signature aveugle délivrée). */
  marquerServi(empreinte) {
    this.dejaServis.add(empreinte);
  }
}
