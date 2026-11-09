// ElGamal exponentiel sur P-256 et preuves à divulgation nulle de connaissance.
//
// PROTOTYPE NON AUDITÉ. Les constructions ci-dessous n'existent pas toutes en bibliothèque ;
// elles sont écrites au plus près des références publiées, sur les opérations de groupe auditées
// de @noble/curves :
//  - ElGamal exponentiel (chiffré de m : (rG, mG + rY)) : Cramer, Gennaro, Schoenmakers,
//    « A Secure and Optimally Efficient Multi-Authority Election Scheme », EUROCRYPT 1997 (CGS97) ;
//    même schéma qu'Helios (Adida, USENIX Security 2008) et ElectionGuard (spécification 2.0, § 3.3).
//  - Preuve disjonctive « le bulletin vaut 0 ou 1 » : Cramer, Damgård, Schoenmakers, « Proofs of
//    Partial Knowledge », CRYPTO 1994 (CDS94), appliquée à deux preuves de Chaum-Pedersen ;
//    forme identique à la « disjunctive Chaum-Pedersen proof » d'ElectionGuard (§ 3.3.5) et d'Helios.
//  - Preuve d'égalité de logarithmes discrets (Chaum, Pedersen, « Wallet Databases with Observers »,
//    CRYPTO 1992) pour les déchiffrements partiels (ElectionGuard § 3.6.3).
//  - Fiat-Shamir « fort » : le défi hache le contexte complet (clé publique, chiffré, engagements,
//    identifiant du scrutin) ; cf. Bernhard, Pereira, Warinschi, « How not to prove yourself »,
//    ASIACRYPT 2012, qui montre les failles d'Helios avec un Fiat-Shamir « faible ».

import {
  G, Point, mul, modn, scalaireAleatoire, hacherVersScalaire,
  pointVersHex, hexVersPoint, scalaireVersHex, hexVersScalaire,
} from './outils.js';

/** Chiffre m ∈ {0, 1} (ou un petit entier) sous la clé publique Y. Renvoie le chiffré et l'aléa r. */
export function chiffrer(Y, m, r = scalaireAleatoire()) {
  return { A: G.multiply(r), B: mul(G, BigInt(m)).add(Y.multiply(r)), r };
}

/** Addition homomorphe de deux chiffrés : chiffre la somme des messages. */
export function additionner(c1, c2) {
  return { A: c1.A.add(c2.A), B: c1.B.add(c2.B) };
}

export function chiffreVersJson(c) {
  return { A: pointVersHex(c.A), B: pointVersHex(c.B) };
}

export function jsonVersChiffre(j) {
  return { A: hexVersPoint(j.A), B: hexVersPoint(j.B) };
}

const DOMAINE_DISJ = 'referendum-poc/preuve-disjonctive/v1';
const DOMAINE_DLEQ = 'referendum-poc/preuve-dleq/v1';

/**
 * Preuve disjonctive (CDS94) que le chiffré (A, B) = (rG, mG + rY) chiffre 0 ou 1.
 * Branche réelle m : engagement (wG, wY). Branche simulée k ≠ m : on choisit c_k, z_k et on
 * reconstruit les engagements a_k = z_k G − c_k A, b_k = z_k Y − c_k (B − kG).
 * Défi global c = H(contexte, Y, A, B, a0, b0, a1, b1) ; c_m = c − c_k ; z_m = w + c_m r.
 * @param contexte chaîne liant la preuve au scrutin et au bulletin (empêche le rejeu ailleurs).
 */
export function prouverZeroOuUn(Y, chiffre, m, r, contexte) {
  if (m !== 0 && m !== 1) throw new Error('seules les valeurs 0 et 1 ont une preuve');
  const { A, B } = chiffre;
  const k = 1 - m; // branche simulée
  const ck = scalaireAleatoire();
  const zk = scalaireAleatoire();
  const Bk = B.subtract(mul(G, BigInt(k)));
  const ak = mul(G, zk).subtract(mul(A, ck));
  const bk = mul(Y, zk).subtract(mul(Bk, ck));
  const w = scalaireAleatoire();
  const am = G.multiply(w);
  const bm = Y.multiply(w);
  const a = m === 0 ? [am, ak] : [ak, am];
  const b = m === 0 ? [bm, bk] : [bk, bm];
  const c = defiDisjonctif(contexte, Y, A, B, a, b);
  const cm = modn(c - ck);
  const zm = modn(w + cm * r);
  const cs = m === 0 ? [cm, ck] : [ck, cm];
  const zs = m === 0 ? [zm, zk] : [zk, zm];
  return {
    c0: scalaireVersHex(cs[0]), c1: scalaireVersHex(cs[1]),
    z0: scalaireVersHex(zs[0]), z1: scalaireVersHex(zs[1]),
    a0: pointVersHex(a[0]), b0: pointVersHex(b[0]),
    a1: pointVersHex(a[1]), b1: pointVersHex(b[1]),
  };
}

function defiDisjonctif(contexte, Y, A, B, a, b) {
  return hacherVersScalaire(DOMAINE_DISJ, [
    contexte, pointVersHex(Y), pointVersHex(A), pointVersHex(B),
    pointVersHex(a[0]), pointVersHex(b[0]), pointVersHex(a[1]), pointVersHex(b[1]),
  ]);
}

/** Vérifie la preuve disjonctive. Renvoie true/false, ne lève pas d'exception sur entrée mal formée. */
export function verifierZeroOuUn(Y, chiffre, preuve, contexte) {
  try {
    const { A, B } = chiffre;
    const c = [hexVersScalaire(preuve.c0), hexVersScalaire(preuve.c1)];
    const z = [hexVersScalaire(preuve.z0), hexVersScalaire(preuve.z1)];
    const a = [hexVersPoint(preuve.a0), hexVersPoint(preuve.a1)];
    const b = [hexVersPoint(preuve.b0), hexVersPoint(preuve.b1)];
    if (modn(c[0] + c[1]) !== defiDisjonctif(contexte, Y, A, B, a, b)) return false;
    for (const k of [0, 1]) {
      const Bk = B.subtract(mul(G, BigInt(k)));
      if (!mul(G, z[k]).equals(a[k].add(mul(A, c[k])))) return false;
      if (!mul(Y, z[k]).equals(b[k].add(mul(Bk, c[k])))) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Preuve de Chaum-Pedersen que log_G(X) = log_H(D) (= x), sans révéler x.
 * Sert au déchiffrement partiel : X = clé de vérification de l'autorité, H = A agrégé, D = xA.
 */
export function prouverDLEQ(x, X, H, D, contexte) {
  const w = scalaireAleatoire();
  const a = G.multiply(w);
  const b = H.multiply(w);
  const c = hacherVersScalaire(DOMAINE_DLEQ, [contexte, pointVersHex(X), pointVersHex(H), pointVersHex(D), pointVersHex(a), pointVersHex(b)]);
  return { a: pointVersHex(a), b: pointVersHex(b), z: scalaireVersHex(modn(w + c * x)) };
}

export function verifierDLEQ(X, H, D, preuve, contexte) {
  try {
    const a = hexVersPoint(preuve.a);
    const b = hexVersPoint(preuve.b);
    const z = hexVersScalaire(preuve.z);
    const c = hacherVersScalaire(DOMAINE_DLEQ, [contexte, pointVersHex(X), pointVersHex(H), pointVersHex(D), preuve.a, preuve.b]);
    return mul(G, z).equals(a.add(mul(X, c))) && mul(H, z).equals(b.add(mul(D, c)));
  } catch {
    return false;
  }
}

/**
 * Logarithme discret de M = mG pour 0 ≤ m ≤ max (recherche linéaire : m est un nombre de voix,
 * borné par le nombre de bulletins comptés). Pour des millions de voix, un pas de bébé-pas de géant
 * serait préférable ; inutile ici.
 */
export function logDiscretBorne(M, max) {
  let P = Point.ZERO;
  for (let m = 0; m <= max; m++) {
    if (P.equals(M)) return m;
    P = P.add(G);
  }
  throw new Error('total hors bornes : déchiffrement incohérent');
}
