#!/usr/bin/env node
// Démonstration : 100 électeurs simulés, 3 autorités de déchiffrement dont 2 suffisent.
// Écrit le tableau public dans sortie/tableau.json puis lance le vérificateur indépendant dans un
// processus séparé, comme le ferait n'importe quel citoyen. Aucun réseau, aucun serveur.
// Usage : node src/demo.js [nombreElecteurs]

import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes } from '@noble/hashes/utils.js';
import { monterScrutin } from './simulation.js';
import { fabriquerBulletin } from './scrutin.js';

const N = Number(process.argv[2] ?? 100);
const ici = dirname(fileURLToPath(import.meta.url));
const tirage = () => randomBytes(1)[0] / 256;
const debut = Date.now();

console.log(`Référendum consultatif simulé : ${N} électeurs, autorités A1, A2, A3 (seuil 2 sur 3)`);
const { scrutin, pieces, nonInscrit, fausse } = await monterScrutin({ nElecteurs: N });
console.log(`  cérémonie des clés : autorités qualifiées ${scrutin.ceremonie.qualifiees.join(', ')} ; clé publique publiée`);

const electeurs = [];
const intentions = [];
let rejets = 0;
for (const piece of pieces) {
  const e = await scrutin.inscrireElecteur(piece);
  const choix = tirage() < 0.55 ? 1 : 0;
  await scrutin.deposer(fabriquerBulletin(e, scrutin.Y, choix));
  electeurs.push(e);
  intentions.push(choix);
}
// Cinq électeurs revotent (par exemple après avoir voté sous la pression) : seul le dernier compte.
for (let k = 0; k < Math.min(5, N); k++) {
  intentions[k] = 1 - intentions[k];
  await scrutin.deposer(fabriquerBulletin(electeurs[k], scrutin.Y, intentions[k]));
}
// Tentatives de fraude, toutes refusées.
const tentatives = [
  ['second droit de vote avec la même pièce', () => scrutin.inscrireElecteur(pieces[0])],
  ['pièce non inscrite', () => scrutin.inscrireElecteur(nonInscrit)],
  ['pièce d\'une fausse autorité', () => scrutin.inscrireElecteur(fausse)],
  ['bulletin valant 2', () => scrutin.deposer(fabriquerBulletin(electeurs[N - 1], scrutin.Y, 1, { valeurForcee: 2 }))],
];
for (const [nom, essai] of tentatives) {
  try { await essai(); console.log(`  !! tentative acceptée : ${nom}`); } catch (err) { rejets++; console.log(`  tentative refusée (${nom}) : ${err.message}`); }
}
scrutin.cloturer();
const r = scrutin.depouiller([1, 3]); // A2 absente : deux autorités suffisent
const attendu = intentions.reduce((a, b) => a + b, 0);
console.log(`  dépouillement par A1 et A3 : oui ${r.oui}, non ${r.non}, exprimés ${r.exprimes} (attendu : oui ${attendu})`);
console.log(`  ${rejets}/${tentatives.length} tentatives de fraude refusées ; durée ${((Date.now() - debut) / 1000).toFixed(1)} s`);

const dossier = join(ici, '..', 'sortie');
mkdirSync(dossier, { recursive: true });
const chemin = join(dossier, 'tableau.json');
writeFileSync(chemin, scrutin.tableau.versJson());
console.log(`  tableau public écrit : ${chemin} (${scrutin.tableau.entrees.length} entrées)\n`);

const v = spawnSync(process.execPath, [join(ici, 'verifier.js'), chemin], { stdio: 'inherit' });
if (r.oui !== attendu || v.status !== 0) {
  console.error('ÉCHEC de la démonstration');
  process.exit(1);
}
