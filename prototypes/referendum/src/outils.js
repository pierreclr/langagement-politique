// Outils communs : courbe, sérialisation canonique, hachage vers un scalaire, aléa.
// PROTOTYPE NON AUDITÉ. Aucune primitive n'est inventée ici : la courbe (P-256, NIST FIPS 186-5),
// les opérations de groupe, SHA-256/SHA-512 et l'aléa viennent de @noble/curves et @noble/hashes
// (bibliothèques auditées). Ce fichier ne fait que de l'encodage.

import { p256 } from '@noble/curves/nist.js';
import { sha256, sha512 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, randomBytes, utf8ToBytes, concatBytes } from '@noble/hashes/utils.js';

export { p256, sha256, sha512, bytesToHex, hexToBytes, randomBytes, utf8ToBytes, concatBytes };

/** Constructeur de points de la courbe P-256. */
export const Point = p256.Point;
/** Générateur G et ordre n du groupe. */
export const G = Point.BASE;
export const ORDRE = Point.Fn.ORDER;

/** Réduction modulo l'ordre du groupe, toujours positive. */
export function modn(x) {
  const r = x % ORDRE;
  return r >= 0n ? r : r + ORDRE;
}

/** Inverse modulaire dans Z_n (n premier). */
export function invn(x) {
  return Point.Fn.inv(modn(x));
}

/** Octets (grand-boutiste) vers entier. */
export function octetsVersEntier(b) {
  return BigInt('0x' + (bytesToHex(b) || '0'));
}

/**
 * Scalaire aléatoire uniforme dans [1, n-1].
 * On tire 48 octets (384 bits) puis on réduit modulo n : biais < 2^-128 (méthode de FIPS 186-5, A.2.1).
 */
export function scalaireAleatoire() {
  for (;;) {
    const k = modn(octetsVersEntier(randomBytes(48)));
    if (k !== 0n) return k;
  }
}

/** Multiplication scalaire acceptant 0 (le point à l'infini). */
export function mul(P, k) {
  const s = modn(k);
  return s === 0n ? Point.ZERO : P.multiply(s);
}

/** Sérialisation d'un point (compressé, hexadécimal) ; le point à l'infini est noté "00". */
export function pointVersHex(P) {
  return P.equals(Point.ZERO) ? '00' : P.toHex(true);
}

/** Désérialisation stricte d'un point (vérifie l'appartenance à la courbe). */
export function hexVersPoint(h) {
  if (h === '00') return Point.ZERO;
  if (typeof h !== 'string' || !/^0[23][0-9a-f]{64}$/.test(h)) throw new Error('point mal formé');
  return Point.fromHex(h);
}

export function scalaireVersHex(k) {
  return modn(k).toString(16).padStart(64, '0');
}

export function hexVersScalaire(h) {
  if (typeof h !== 'string' || !/^[0-9a-f]{64}$/.test(h)) throw new Error('scalaire mal formé');
  const k = BigInt('0x' + h);
  if (k >= ORDRE) throw new Error('scalaire hors du groupe');
  return k;
}

/**
 * JSON canonique : clés triées, sans espace. Sert à hacher et à signer de façon reproductible
 * (même principe que RFC 8785, en version simplifiée : on n'utilise que chaînes, entiers et tableaux).
 */
export function jsonCanonique(v) {
  if (v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') {
    if (typeof v === 'number' && !Number.isSafeInteger(v)) throw new Error('nombre non entier interdit');
    return JSON.stringify(v);
  }
  if (Array.isArray(v)) return '[' + v.map(jsonCanonique).join(',') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + jsonCanonique(v[k])).join(',') + '}';
  }
  throw new Error('type non sérialisable : ' + typeof v);
}

/** SHA-256 hexadécimal d'une valeur JSON canonique, préfixée par un domaine. */
export function empreinte(domaine, valeur) {
  return bytesToHex(sha256(utf8ToBytes(domaine + '|' + jsonCanonique(valeur))));
}

/**
 * Hachage vers un scalaire pour l'heuristique de Fiat-Shamir : SHA-512 réduit modulo n
 * (512 bits pour un ordre de 256 bits : biais négligeable). Le domaine sépare les usages.
 */
export function hacherVersScalaire(domaine, valeurs) {
  return modn(octetsVersEntier(sha512(utf8ToBytes(domaine + '|' + jsonCanonique(valeurs)))));
}
