#!/usr/bin/env node
// VÉRIFICATEUR INDÉPENDANT du tableau public : « recomptage par n'importe qui ».
//
// Ce fichier n'importe AUCUN module du prototype (src/*.js) : il réécrit toutes les vérifications à
// partir du seul format publié (tableau JSON) et des bibliothèques auditées (@noble/curves,
// @noble/hashes, @cloudflare/blindrsa-ts). Une erreur du code de l'urne ne se recopie donc pas ici.
// L'objectif réel est que des tiers écrivent d'autres vérificateurs, dans d'autres langages ;
// un seul vérificateur honnête suffit à détecter une fraude sur le tableau.
//
// Usage : node src/verifier.js chemin/tableau.json
// Code de sortie : 0 si tout est valide, 1 sinon (déclencheur de la procédure de compromission).
//
// PROTOTYPE NON AUDITÉ.

import { p256 } from '@noble/curves/nist.js';
import { sha256, sha512 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { RSABSSA } from '@cloudflare/blindrsa-ts';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const P = p256.Point;
const G = P.BASE;
const n = P.Fn.ORDER;
const md = (x) => ((x % n) + n) % n;
const mul = (Q, k) => (md(k) === 0n ? P.ZERO : Q.multiply(md(k)));
const pt = (h) => {
  if (h === '00') return P.ZERO;
  if (!/^0[23][0-9a-f]{64}$/.test(h)) throw new Error('point mal formé');
  return P.fromHex(h);
};
const hx = (Q) => (Q.equals(P.ZERO) ? '00' : Q.toHex(true));
const sc = (h) => {
  if (!/^[0-9a-f]{64}$/.test(h)) throw new Error('scalaire mal formé');
  const k = BigInt('0x' + h);
  if (k >= n) throw new Error('scalaire hors du groupe');
  return k;
};
const canon = (v) => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
};
const h256 = (dom, v) => bytesToHex(sha256(utf8ToBytes(dom + '|' + canon(v))));
const hScal = (dom, v) => md(BigInt('0x' + bytesToHex(sha512(utf8ToBytes(dom + '|' + canon(v))))));

function preuveZeroOuUn(Y, A, B, pr, ctx) {
  try {
    const c = [sc(pr.c0), sc(pr.c1)];
    const z = [sc(pr.z0), sc(pr.z1)];
    const a = [pt(pr.a0), pt(pr.a1)];
    const b = [pt(pr.b0), pt(pr.b1)];
    const defi = hScal('referendum-poc/preuve-disjonctive/v1', [ctx, hx(Y), hx(A), hx(B), pr.a0, pr.b0, pr.a1, pr.b1]);
    if (md(c[0] + c[1]) !== defi) return false;
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

function preuveDLEQ(X, H, D, pr, ctx) {
  try {
    const a = pt(pr.a);
    const b = pt(pr.b);
    const z = sc(pr.z);
    const c = hScal('referendum-poc/preuve-dleq/v1', [ctx, hx(X), hx(H), hx(D), pr.a, pr.b]);
    return mul(G, z).equals(a.add(mul(X, c))) && mul(H, z).equals(b.add(mul(D, c)));
  } catch {
    return false;
  }
}

function evalEngagements(E, j) {
  let R = P.ZERO;
  let p = 1n;
  for (const A of E) {
    R = R.add(mul(pt(A), p));
    p = md(p * BigInt(j));
  }
  return R;
}

function lagrange(i, indices) {
  let num = 1n;
  let den = 1n;
  for (const j of indices) if (j !== i) { num = md(num * BigInt(j)); den = md(den * BigInt(j - i)); }
  return md(num * P.Fn.inv(den));
}

/**
 * Vérifie un tableau publié. Renvoie { valide, erreurs, alertes, resultat, statistiques }.
 * Erreur = le scrutin ne peut pas être certifié (procédure de compromission).
 * Alerte = anomalie qui n'invalide pas le total (par ex. une autorité a publié un faux déchiffrement,
 * écarté car t autres étaient valides) mais qui doit être instruite.
 */
export async function verifierTableau(tableau) {
  const erreurs = [];
  const alertes = [];
  const E = tableau?.entrees;
  if (!Array.isArray(E) || E.length === 0) return { valide: false, erreurs: ['tableau vide ou illisible'], alertes };

  // 1. Chaîne d'empreintes : ordre, liens, contenu.
  let prec = '0'.repeat(64);
  E.forEach((e, i) => {
    if (e.index !== i) erreurs.push(`entrée ${i} : index ${e.index} inattendu`);
    if (e.precedente !== prec) erreurs.push(`entrée ${i} : lien vers la précédente rompu`);
    const h = h256('referendum-poc/tableau/v1', { index: e.index, type: e.type, contenu: e.contenu, precedente: e.precedente });
    if (h !== e.empreinte) erreurs.push(`entrée ${i} : empreinte fausse (contenu altéré)`);
    prec = e.empreinte;
  });

  // 2. Structure : ouverture, bulletins, clôture, agrégat, [déchiffrement], résultat, témoins.
  const types = E.map((e) => e.type).join(' ');
  if (!/^ouverture( bulletin)* cloture agregat( dechiffrement)? resultat temoins$/.test(types)) {
    erreurs.push('séquence d\'entrées non conforme : ' + types.replace(/( bulletin)+/, ' bulletin…'));
    return { valide: false, erreurs, alertes };
  }
  const ouv = E[0].contenu;
  const idS = ouv.scrutin;
  const t = ouv.seuil;
  const qual = ouv.qualifiees;

  // 3. Clé publique = somme des engagements constants des autorités qualifiées.
  let Y;
  try {
    Y = qual.reduce((acc, i) => acc.add(pt(ouv.engagements[i][0])), P.ZERO);
    if (hx(Y) !== ouv.clePublique) erreurs.push('clé publique incohérente avec les engagements des autorités');
    if (qual.length < t) erreurs.push('moins d\'autorités qualifiées que le seuil');
    for (const i of qual) if (ouv.engagements[i].length !== t) erreurs.push(`autorité ${i} : degré du polynôme ≠ seuil − 1`);
  } catch (err) {
    erreurs.push('engagements illisibles : ' + err.message);
    return { valide: false, erreurs, alertes };
  }
  for (const p of ouv.plaintes ?? []) alertes.push(`cérémonie des clés : l'autorité ${p.plaignant} accuse l'autorité ${p.accuse} (part invalide), autorité ${p.accuse} disqualifiée`);

  // 4. Bulletins : jeton, nullifier, signature de la clé de vote, séquence, unicité, preuve.
  const suite = RSABSSA.SHA384.PSS.Randomized();
  const cleEm = await crypto.subtle.importKey('spki', hexToBytes(ouv.cleEmetteur), { name: 'RSA-PSS', hash: 'SHA-384' }, true, ['verify']);
  const derniers = new Map();
  const chiffres = new Set();
  let nbBulletins = 0;
  for (const e of E.filter((x) => x.type === 'bulletin')) {
    nbBulletins++;
    const { contenu: c, signature } = e.contenu;
    const ko = (m) => erreurs.push(`bulletin (entrée ${e.index}) : ${m}`);
    if (c.scrutin !== idS) { ko('autre scrutin'); continue; }
    let okJeton = false;
    try { okJeton = await suite.verify(cleEm, hexToBytes(c.jeton.signature), hexToBytes(c.jeton.message)); } catch { okJeton = false; }
    if (!okJeton) { ko('jeton non signé par l\'émetteur'); continue; }
    let info;
    try { info = JSON.parse(new TextDecoder().decode(hexToBytes(c.jeton.message).slice(32))); } catch { ko('jeton illisible'); continue; }
    if (info.scrutin !== idS) { ko('jeton d\'un autre scrutin'); continue; }
    if (c.nullifier !== h256('referendum-poc/nullifier/v1', { scrutin: idS, message: c.jeton.message })) { ko('nullifier faux'); continue; }
    let okSig = false;
    try { okSig = p256.verify(hexToBytes(signature), utf8ToBytes(canon(c)), hexToBytes(info.cleVote)); } catch { okSig = false; }
    if (!okSig) { ko('signature de la clé de vote invalide'); continue; }
    const avant = derniers.get(c.nullifier);
    if (!Number.isSafeInteger(c.sequence) || (avant && c.sequence <= avant.sequence)) { ko('séquence non croissante'); continue; }
    const k = c.chiffre.A + c.chiffre.B;
    if (chiffres.has(k)) { ko('chiffré dupliqué'); continue; }
    chiffres.add(k);
    let A, B;
    try { A = pt(c.chiffre.A); B = pt(c.chiffre.B); } catch { ko('chiffré mal formé'); continue; }
    if (!preuveZeroOuUn(Y, A, B, c.preuve, `referendum-poc/bulletin|${idS}|${c.nullifier}|${c.sequence}`)) { ko('preuve 0-ou-1 invalide'); continue; }
    derniers.set(c.nullifier, { sequence: c.sequence, A, B });
  }

  // 5. Bornes publiques : bulletins comptés ≤ droits délivrés ≤ inscrits ; empreintes uniques.
  const clo = E.find((e) => e.type === 'cloture').contenu;
  if (new Set(clo.empreintesServies).size !== clo.empreintesServies.length) erreurs.push('empreintes de titres servis en double');
  if (clo.droitsDelivres !== clo.empreintesServies.length) erreurs.push('nombre de droits délivrés ≠ nombre d\'empreintes publiées');
  if (derniers.size > clo.droitsDelivres) erreurs.push(`plus de votants (${derniers.size}) que de droits délivrés (${clo.droitsDelivres}) : bourrage`);
  if (clo.droitsDelivres > ouv.tailleListeElectorale) erreurs.push('plus de droits délivrés que d\'inscrits');

  // 6. Agrégat homomorphe recalculé à partir des seuls derniers bulletins valides.
  const agr = E.find((e) => e.type === 'agregat').contenu;
  let SA = P.ZERO;
  let SB = P.ZERO;
  for (const { A, B } of derniers.values()) { SA = SA.add(A); SB = SB.add(B); }
  if (agr.comptes !== derniers.size) erreurs.push(`agrégat : ${agr.comptes} bulletins annoncés, ${derniers.size} recomptés`);
  if (derniers.size > 0 && (!agr.chiffre || agr.chiffre.A !== hx(SA) || agr.chiffre.B !== hx(SB))) erreurs.push('agrégat publié ≠ agrégat recalculé');

  // 7. Déchiffrements partiels et résultat.
  const res = E.find((e) => e.type === 'resultat').contenu;
  const dech = E.find((e) => e.type === 'dechiffrement')?.contenu;
  let oui = null;
  if (derniers.size === 0) {
    if (res.oui !== 0 || res.exprimes !== 0) erreurs.push('résultat non nul sans bulletin');
    oui = 0;
  } else if (!dech) {
    erreurs.push('déchiffrement absent');
  } else {
    const ctx = `referendum-poc/dechiffrement|${idS}`;
    const valides = [];
    for (const p of dech.partiels) {
      if (!qual.includes(p.indice)) { erreurs.push(`déchiffrement d'une autorité non qualifiée (${p.indice})`); continue; }
      const X = qual.reduce((acc, i) => acc.add(evalEngagements(ouv.engagements[i], p.indice)), P.ZERO);
      let ok = false;
      try { ok = preuveDLEQ(X, SA, pt(p.D), p.preuve, ctx); } catch { ok = false; }
      if (ok) valides.push(p);
      else alertes.push(`autorité ${p.indice} : déchiffrement partiel FAUX (preuve de Chaum-Pedersen invalide), autorité malhonnête ou défaillante`);
    }
    for (const i of res.retenus) if (!valides.some((p) => p.indice === i)) erreurs.push(`le résultat retient le déchiffrement invalide de l'autorité ${i}`);
    if (valides.length < t) erreurs.push(`seulement ${valides.length} déchiffrements valides pour un seuil de ${t}`);
    else {
      // Recombinaison indépendante avec TOUS les sous-ensembles de t autorités valides : ils doivent concorder.
      const sousEnsembles = combinaisons(valides, t);
      const totaux = new Set();
      for (const S of sousEnsembles) {
        const idx = S.map((p) => p.indice);
        const M = SB.subtract(S.reduce((acc, p) => acc.add(mul(pt(p.D), lagrange(p.indice, idx))), P.ZERO));
        let Q = P.ZERO;
        let m = -1;
        for (let v = 0; v <= derniers.size; v++) { if (Q.equals(M)) { m = v; break; } Q = Q.add(G); }
        totaux.add(m);
      }
      if (totaux.size !== 1 || totaux.has(-1)) erreurs.push('les déchiffrements valides ne concordent pas sur un total');
      else oui = [...totaux][0];
    }
  }
  if (oui !== null) {
    if (res.oui !== oui) erreurs.push(`résultat publié : ${res.oui} oui ; recompté : ${oui} oui`);
    if (res.exprimes !== derniers.size || res.non !== derniers.size - oui) erreurs.push('nombre d\'exprimés ou de non incohérent');
  }

  // 8. Témoins : chaque autorité signe l'empreinte de l'entrée « résultat ».
  const tem = E[E.length - 1].contenu;
  if (tem.tete !== E[E.length - 2].empreinte) erreurs.push('les témoins ne signent pas la tête du tableau');
  for (const a of ouv.autorites) {
    const s = tem.signatures.find((x) => x.indice === a.indice);
    let ok = false;
    try { ok = !!s && p256.verify(hexToBytes(s.signature), utf8ToBytes(tem.tete), hexToBytes(a.cleTemoin)); } catch { ok = false; }
    if (!ok) alertes.push(`autorité ${a.indice} : signature de témoin absente ou invalide`);
  }

  return {
    valide: erreurs.length === 0,
    erreurs,
    alertes,
    resultat: { question: ouv.question, oui, non: oui === null ? null : derniers.size - oui, exprimes: derniers.size },
    statistiques: { entrees: E.length, bulletinsDeposes: nbBulletins, votantsComptes: derniers.size, revotes: nbBulletins - derniers.size, droitsDelivres: clo.droitsDelivres, inscrits: ouv.tailleListeElectorale },
  };
}

function combinaisons(liste, k) {
  if (k === 0) return [[]];
  if (liste.length < k) return [];
  const [tete, ...reste] = liste;
  return [...combinaisons(reste, k - 1).map((c) => [tete, ...c]), ...combinaisons(reste, k)];
}

// Exécution en ligne de commande.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chemin = process.argv[2];
  if (!chemin) {
    console.error('usage : node src/verifier.js tableau.json');
    process.exit(2);
  }
  const r = await verifierTableau(JSON.parse(readFileSync(chemin, 'utf8')));
  console.log(`Vérification indépendante de ${chemin}`);
  console.log(`  entrées : ${r.statistiques?.entrees ?? '?'} ; bulletins déposés : ${r.statistiques?.bulletinsDeposes ?? '?'} ; votants comptés : ${r.statistiques?.votantsComptes ?? '?'} ; revotes remplacés : ${r.statistiques?.revotes ?? '?'}`);
  if (r.resultat) console.log(`  « ${r.resultat.question} » : oui ${r.resultat.oui}, non ${r.resultat.non}, exprimés ${r.resultat.exprimes}`);
  for (const a of r.alertes) console.log('  ALERTE : ' + a);
  for (const e of r.erreurs) console.log('  ERREUR : ' + e);
  console.log(r.valide ? '  VERDICT : tableau VALIDE, total recompté identique.' : '  VERDICT : tableau INVALIDE, déclencher la procédure de compromission (docs/procedure-compromission.md).');
  process.exit(r.valide ? 0 : 1);
}
