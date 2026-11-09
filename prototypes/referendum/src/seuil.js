// Clé de déchiffrement partagée entre n autorités, seuil t (t autorités suffisent, t−1 n'apprennent rien).
//
// PROTOTYPE NON AUDITÉ. Construction : génération distribuée de clé « Joint-Feldman » (Pedersen,
// « A Threshold Cryptosystem without a Trusted Party », EUROCRYPT 1991), partage de Shamir (1979)
// avec engagements de Feldman (FOCS 1987), comme dans CGS97 (§ 2) et ElectionGuard (spécification 2.0,
// § 3.2, « key generation » et § 3.6, « decryption with missing guardians »).
// Limite connue : Gennaro, Jarecki, Krawczyk, Rabin (EUROCRYPT 1999 / J. Cryptology 2007) montrent
// qu'un participant malhonnête peut biaiser la distribution de la clé publique dans Joint-Feldman ;
// ils prouvent aussi que ce biais ne compromet pas la sécurité d'ElGamal utilisé ainsi. Un système réel
// prendrait leur protocole (GJKR) ou celui d'ElectionGuard tel quel, après revue.
// Simplification du prototype : les parts secrètes circulent en clair entre objets d'un même processus ;
// en vrai, elles passent par des canaux chiffrés et authentifiés entre autorités.

import { G, Point, mul, modn, invn, scalaireAleatoire, pointVersHex, hexVersPoint, scalaireVersHex } from './outils.js';
import { prouverDLEQ, verifierDLEQ } from './elgamal.js';

/** Évalue Σ coef_k · j^k mod n. */
function evaluerPolynome(coefs, j) {
  let r = 0n;
  let p = 1n;
  for (const a of coefs) {
    r = modn(r + a * p);
    p = modn(p * BigInt(j));
  }
  return r;
}

/** Évalue publiquement Σ j^k · A_k à partir des engagements de Feldman. */
export function evaluerEngagements(engagements, j) {
  let R = Point.ZERO;
  let p = 1n;
  for (const A of engagements) {
    R = R.add(mul(A, p));
    p = modn(p * BigInt(j));
  }
  return R;
}

/** Coefficient de Lagrange en 0 pour l'indice i, parmi les indices `indices`. */
export function lagrangeEnZero(i, indices) {
  let num = 1n;
  let den = 1n;
  for (const j of indices) {
    if (j === i) continue;
    num = modn(num * BigInt(j));
    den = modn(den * BigInt(j - i));
  }
  return modn(num * invn(den));
}

/**
 * Une autorité (« gardien » dans ElectionGuard, « trustee » dans Helios et Belenios).
 * Indice de 1 à n. Elle tire un polynôme secret de degré t−1 et publie ses engagements.
 */
export class Autorite {
  constructor(indice, nom, t, { malhonnete = null } = {}) {
    this.indice = indice;
    this.nom = nom;
    this.t = t;
    this.malhonnete = malhonnete; // pour les tests : 'part' (part fausse) ou 'dechiffrement' (déchiffrement faux)
    this.coefs = Array.from({ length: t }, scalaireAleatoire);
    this.engagements = this.coefs.map((a) => G.multiply(a));
    this.partsRecues = new Map();
    this.x = null; // part de la clé commune, connue de cette seule autorité
  }

  /** Part secrète destinée à l'autorité d'indice j : f_i(j). */
  partPour(j) {
    const s = evaluerPolynome(this.coefs, j);
    return this.malhonnete === 'part' ? modn(s + 1n) : s;
  }

  /** Vérifie une part reçue contre les engagements publics de l'émetteur (vérification de Feldman). */
  recevoirPart(emetteur, s, engagementsEmetteur) {
    const ok = mul(G, s).equals(evaluerEngagements(engagementsEmetteur, this.indice));
    if (ok) this.partsRecues.set(emetteur, s);
    return ok;
  }

  /** Part finale x_j = Σ_i f_i(j), sur les autorités qualifiées. */
  finaliser(qualifiees) {
    let x = 0n;
    for (const i of qualifiees) {
      if (!this.partsRecues.has(i)) throw new Error(`part manquante de l'autorité ${i}`);
      x = modn(x + this.partsRecues.get(i));
    }
    this.x = x;
  }

  /** Déchiffrement partiel D = x·A, avec preuve d'égalité de logarithmes (Chaum-Pedersen). */
  dechiffrerPartiellement(A, contexte, X) {
    let D = mul(A, this.x);
    if (this.malhonnete === 'dechiffrement') D = D.add(G); // tentative de fausser le total d'une voix
    const preuve = prouverDLEQ(this.x, X, A, D, contexte);
    return { indice: this.indice, D: pointVersHex(D), preuve };
  }
}

/**
 * Cérémonie de génération de clé. Chaque autorité envoie une part à chaque autre ; toute part qui
 * échoue à la vérification de Feldman est une plainte publique, et l'émetteur est disqualifié.
 * Renvoie la clé publique, les engagements publiés, les clés de vérification et les plaintes.
 */
export function ceremonieDeCles(autorites, t) {
  const plaintes = [];
  for (const emetteur of autorites) {
    for (const recepteur of autorites) {
      const s = emetteur.partPour(recepteur.indice);
      if (!recepteur.recevoirPart(emetteur.indice, s, emetteur.engagements)) {
        plaintes.push({ plaignant: recepteur.indice, accuse: emetteur.indice });
      }
    }
  }
  const disqualifiees = new Set(plaintes.map((p) => p.accuse));
  const qualifiees = autorites.map((a) => a.indice).filter((i) => !disqualifiees.has(i));
  if (qualifiees.length < t) throw new Error('trop peu d\'autorités honnêtes pour atteindre le seuil');
  for (const a of autorites) if (!disqualifiees.has(a.indice)) a.finaliser(qualifiees);
  const engagements = Object.fromEntries(autorites.filter((a) => qualifiees.includes(a.indice)).map((a) => [a.indice, a.engagements]));
  const Y = qualifiees.reduce((acc, i) => acc.add(engagements[i][0]), Point.ZERO);
  return {
    Y,
    qualifiees,
    plaintes,
    engagementsJson: Object.fromEntries(Object.entries(engagements).map(([i, E]) => [i, E.map(pointVersHex)])),
  };
}

/** Clé de vérification publique de l'autorité j : X_j = x_j·G = Σ_i Σ_k j^k A_ik. */
export function cleDeVerification(engagementsJson, qualifiees, j) {
  return qualifiees.reduce((acc, i) => acc.add(evaluerEngagements(engagementsJson[i].map(hexVersPoint), j)), Point.ZERO);
}

/** Vérifie un déchiffrement partiel publié. */
export function verifierPartiel(engagementsJson, qualifiees, A, partiel, contexte) {
  const X = cleDeVerification(engagementsJson, qualifiees, partiel.indice);
  try {
    return verifierDLEQ(X, A, hexVersPoint(partiel.D), partiel.preuve, contexte);
  } catch {
    return false;
  }
}

/** Combine t déchiffrements partiels valides : M = B − Σ λ_j D_j = m·G. */
export function combiner(B, partiels) {
  const indices = partiels.map((p) => p.indice);
  const S = partiels.reduce((acc, p) => acc.add(mul(hexVersPoint(p.D), lagrangeEnZero(p.indice, indices))), Point.ZERO);
  return B.subtract(S);
}

export { scalaireVersHex };
