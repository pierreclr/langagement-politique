// Tests du prototype (node --test). Chaque test monte un petit scrutin complet et vérifie à la fois
// le comportement de l'urne et le verdict du vérificateur indépendant.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monterScrutin } from '../src/simulation.js';
import { fabriquerBulletin, codeDeSuivi } from '../src/scrutin.js';
import { verifierTableau } from '../src/verifier.js';
import { chiffrer, prouverZeroOuUn, verifierZeroOuUn, additionner, logDiscretBorne } from '../src/elgamal.js';
import { Autorite, ceremonieDeCles, combiner, lagrangeEnZero } from '../src/seuil.js';
import { G, scalaireAleatoire, mul, modn } from '../src/outils.js';
import { empreinteEntree } from '../src/tableau.js';

const relire = (scrutin) => JSON.parse(scrutin.tableau.versJson());

async function voterTous(scrutin, pieces, choix) {
  const electeurs = [];
  for (let k = 0; k < pieces.length; k++) {
    const e = await scrutin.inscrireElecteur(pieces[k]);
    await scrutin.deposer(fabriquerBulletin(e, scrutin.Y, choix[k]));
    electeurs.push(e);
  }
  return electeurs;
}

test('primitives : ElGamal exponentiel, homomorphie, preuve 0-ou-1, partage de Shamir', () => {
  const x = scalaireAleatoire();
  const Y = G.multiply(x);
  const c1 = chiffrer(Y, 1);
  const c0 = chiffrer(Y, 0);
  assert.ok(verifierZeroOuUn(Y, c1, prouverZeroOuUn(Y, c1, 1, c1.r, 'ctx'), 'ctx'));
  assert.ok(verifierZeroOuUn(Y, c0, prouverZeroOuUn(Y, c0, 0, c0.r, 'ctx'), 'ctx'));
  // Une preuve valide ne se recopie pas dans un autre contexte (autre bulletin, autre scrutin).
  assert.ok(!verifierZeroOuUn(Y, c1, prouverZeroOuUn(Y, c1, 1, c1.r, 'ctx'), 'autre'));
  const s = additionner(additionner(c1, c0), chiffrer(Y, 1));
  assert.equal(logDiscretBorne(s.B.subtract(mul(s.A, x)), 3), 2);
  // Lagrange : f(0) retrouvé à partir de deux points d'un polynôme de degré 1.
  const a0 = scalaireAleatoire();
  const a1 = scalaireAleatoire();
  const f = (j) => modn(a0 + a1 * BigInt(j));
  assert.equal(modn(f(1) * lagrangeEnZero(1, [1, 3]) + f(3) * lagrangeEnZero(3, [1, 3])), a0);
});

test('vote valide et total juste (12 électeurs, 2 autorités sur 3)', async () => {
  const choix = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0];
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: choix.length });
  await voterTous(scrutin, pieces, choix);
  scrutin.cloturer();
  const r = scrutin.depouiller([1, 3]);
  assert.equal(r.oui, 7);
  assert.equal(r.non, 5);
  const v = await verifierTableau(relire(scrutin));
  assert.ok(v.valide, v.erreurs.join('\n'));
  assert.equal(v.resultat.oui, 7);
  assert.equal(v.alertes.length, 0);
});

test('le code de suivi permet à l\'électeur de retrouver son bulletin sur le tableau', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 2 });
  const e = await scrutin.inscrireElecteur(pieces[0]);
  const b = fabriquerBulletin(e, scrutin.Y, 1);
  const code = await scrutin.deposer(b);
  assert.equal(code, codeDeSuivi(b.contenu));
  assert.ok(scrutin.tableau.entrees.some((x) => x.type === 'bulletin' && codeDeSuivi(x.contenu.contenu) === code));
});

test('double vote rejeté : un seul droit par titre, et un jeton ne compte qu\'une fois', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 3 });
  const e = await scrutin.inscrireElecteur(pieces[0]);
  // Second retrait de droit avec la même pièce : refusé par le registre d'empreintes.
  await assert.rejects(scrutin.inscrireElecteur(pieces[0]), /déjà délivré/);
  await scrutin.deposer(fabriquerBulletin(e, scrutin.Y, 1));
  // Rejeu exact du même bulletin : refusé (séquence et chiffré déjà vus).
  const b2 = fabriquerBulletin(e, scrutin.Y, 1);
  await scrutin.deposer(b2);
  await assert.rejects(scrutin.deposer(b2), /séquence non croissante|déjà présent/);
  scrutin.cloturer();
  const r = scrutin.depouiller([1, 2]);
  assert.equal(r.exprimes, 1, 'deux bulletins du même jeton comptent pour une voix');
  assert.ok((await verifierTableau(relire(scrutin))).valide);
});

test('éligibilité : non-inscrit, fausse autorité (cluster corrompu minoritaire) et puce falsifiée refusés', async () => {
  const { scrutin, pieces, nonInscrit, fausse } = await monterScrutin({ nElecteurs: 2 });
  await assert.rejects(scrutin.inscrireElecteur(nonInscrit), /non inscrit/);
  await assert.rejects(scrutin.inscrireElecteur(fausse), /majorité de clusters/);
  const falsifiee = structuredClone(pieces[1]);
  falsifiee.dg1.numero = pieces[0].dg1.numero; // modification de la puce sans la clé de l'autorité
  falsifiee.dg1.nom = 'Autre';
  await assert.rejects(scrutin.inscrireElecteur(falsifiee), /non authentique/);
});

test('jeton forgé (non signé par l\'émetteur) rejeté', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 2 });
  const e = await scrutin.inscrireElecteur(pieces[0]);
  const b = fabriquerBulletin(e, scrutin.Y, 1);
  const sig = b.contenu.jeton.signature;
  b.contenu.jeton = { ...b.contenu.jeton, signature: (sig[0] === 'a' ? 'b' : 'a') + sig.slice(1) };
  await assert.rejects(scrutin.deposer(b), /jeton non signé/);
});

test('bulletin invalide (2 au lieu de 1) rejeté par la preuve, à l\'urne et au vérificateur', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 3 });
  const e = await scrutin.inscrireElecteur(pieces[0]);
  const triche = fabriquerBulletin(e, scrutin.Y, 1, { valeurForcee: 2 });
  await assert.rejects(scrutin.deposer(triche), /0 ou 1/);
  // Une urne complice l'insère quand même : le vérificateur indépendant le détecte.
  const e2 = await scrutin.inscrireElecteur(pieces[1]);
  await scrutin.deposer(fabriquerBulletin(e2, scrutin.Y, 1));
  scrutin.tableau.ajouter('bulletin', triche);
  scrutin.cloturer();
  scrutin.depouiller([1, 2]);
  const v = await verifierTableau(relire(scrutin));
  assert.ok(!v.valide);
  assert.ok(v.erreurs.some((m) => /preuve 0-ou-1 invalide/.test(m)), v.erreurs.join('\n'));
});

test('revote : seul le dernier bulletin d\'un même jeton compte (parade à la contrainte)', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 3 });
  const [a, b, c] = await voterTous(scrutin, pieces, [1, 1, 0]); // a vote « oui » sous contrainte
  const sousContrainte = fabriquerBulletin(a, scrutin.Y, 1);
  await scrutin.deposer(sousContrainte);
  await scrutin.deposer(fabriquerBulletin(a, scrutin.Y, 0)); // puis revote librement « non »
  // Le coercitif rejoue le bulletin qu'il a vu : refusé.
  await assert.rejects(scrutin.deposer(sousContrainte), /séquence non croissante|déjà présent/);
  // Personne d'autre ne peut revoter à la place de a : il faudrait sa clé de vote.
  const usurpe = fabriquerBulletin(b, scrutin.Y, 1);
  usurpe.contenu.jeton = a.jeton;
  await assert.rejects(scrutin.deposer(usurpe), /nullifier faux|signature/);
  scrutin.cloturer();
  const r = scrutin.depouiller([2, 3]);
  assert.deepEqual([r.oui, r.non, r.exprimes], [1, 2, 3]);
  const v = await verifierTableau(relire(scrutin));
  assert.ok(v.valide, v.erreurs.join('\n'));
  assert.equal(v.statistiques.revotes, 2);
  void c;
});

test('autorité malhonnête au dépouillement : faux déchiffrement détecté et écarté, total juste', async () => {
  const { scrutin, pieces } = await monterScrutin({
    nElecteurs: 6,
    autorites: ['A1', { nom: 'A2 (malhonnête)', malhonnete: 'dechiffrement' }, 'A3'],
  });
  await voterTous(scrutin, pieces, [1, 1, 1, 0, 0, 1]);
  scrutin.cloturer();
  const r = scrutin.depouiller([2, 1, 3]);
  assert.equal(r.oui, 4);
  assert.deepEqual(r.ecartes, [2]);
  const v = await verifierTableau(relire(scrutin));
  assert.ok(v.valide, v.erreurs.join('\n'));
  assert.ok(v.alertes.some((m) => /autorité 2 : déchiffrement partiel FAUX/.test(m)));
  // Sans l'autorité 3, il ne reste qu'un déchiffrement valide : dépouillement refusé plutôt que faux.
  const s2 = await monterScrutin({ nElecteurs: 2, autorites: ['A1', { nom: 'A2', malhonnete: 'dechiffrement' }, 'A3'] });
  await voterTous(s2.scrutin, s2.pieces, [1, 0]);
  s2.scrutin.cloturer();
  assert.throws(() => s2.scrutin.depouiller([1, 2]), /dépouillement impossible/);
});

test('autorité malhonnête à la cérémonie des clés : part fausse détectée (Feldman), autorité disqualifiée', () => {
  const autorites = [new Autorite(1, 'A1', 2), new Autorite(2, 'A2', 2, { malhonnete: 'part' }), new Autorite(3, 'A3', 2)];
  const c = ceremonieDeCles(autorites, 2);
  assert.deepEqual(c.qualifiees, [1, 3]);
  assert.ok(c.plaintes.every((p) => p.accuse === 2));
  // La clé commune reste utilisable avec les deux autorités honnêtes.
  const ch = chiffrer(c.Y, 1);
  const parts = [autorites[0], autorites[2]].map((a) => ({ indice: a.indice, D: mul(ch.A, a.x).toHex(true) }));
  assert.ok(combiner(ch.B, parts).equals(G));
});

test('journal altéré détecté : bulletin modifié, bulletin retiré, résultat changé', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 5 });
  await voterTous(scrutin, pieces, [1, 0, 1, 0, 1]);
  scrutin.cloturer();
  scrutin.depouiller([1, 2]);
  const base = relire(scrutin);
  assert.ok((await verifierTableau(base)).valide);

  const modifie = structuredClone(base);
  modifie.entrees[2].contenu.contenu.sequence = 7;
  assert.ok((await verifierTableau(modifie)).erreurs.some((m) => /empreinte fausse/.test(m)));

  const retire = structuredClone(base);
  retire.entrees.splice(3, 1);
  const vr = await verifierTableau(retire);
  assert.ok(!vr.valide && vr.erreurs.some((m) => /index|lien/.test(m)));

  // Fraudeur habile : il change le résultat et recalcule toute la chaîne d'empreintes.
  const truque = structuredClone(base);
  const iRes = truque.entrees.findIndex((e) => e.type === 'resultat');
  truque.entrees[iRes].contenu.oui = 4;
  truque.entrees[iRes].contenu.non = 1;
  for (let i = iRes; i < truque.entrees.length; i++) {
    const e = truque.entrees[i];
    e.precedente = truque.entrees[i - 1].empreinte;
    if (e.type === 'temoins') e.contenu.tete = e.precedente;
    e.empreinte = empreinteEntree(e);
  }
  const vt = await verifierTableau(truque);
  assert.ok(!vt.valide);
  assert.ok(vt.erreurs.some((m) => /recompté : 3 oui/.test(m)), vt.erreurs.join('\n'));
  assert.ok(vt.alertes.some((m) => /signature de témoin/.test(m)), 'les signatures des témoins ne couvrent plus la nouvelle tête');
});

test('bourrage par l\'urne : bulletin d\'un jeton jamais délivré ou nombre de droits gonflé détectés', async () => {
  const { scrutin, pieces } = await monterScrutin({ nElecteurs: 3 });
  await voterTous(scrutin, pieces, [1, 0, 1]);
  scrutin.cloturer();
  scrutin.depouiller([1, 2]);
  const t = relire(scrutin);
  const iClo = t.entrees.findIndex((e) => e.type === 'cloture');
  t.entrees[iClo].contenu.droitsDelivres = 2;
  t.entrees[iClo].contenu.empreintesServies.pop();
  for (let i = iClo; i < t.entrees.length; i++) {
    t.entrees[i].precedente = t.entrees[i - 1].empreinte;
    t.entrees[i].empreinte = empreinteEntree(t.entrees[i]);
  }
  const v = await verifierTableau(t);
  assert.ok(v.erreurs.some((m) => /bourrage/.test(m)), v.erreurs.join('\n'));
});
