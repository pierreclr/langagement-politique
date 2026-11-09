#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Effet cumulatif, correction par correction, des corrections de données du 04/11/2026 sur la v5 (§ 18.2 de resultats-optimum.txt).
Méthode : copie du commit 78031b1d (v5 avant corrections) dans un dossier temporaire, remplacement des valeurs une à une (cumulatif), calcul du solde de ARCHITECTURE_V5 au taux plat inchangé (40,7 %) et du taux d'équilibre (jsc).
Usage, depuis la racine du dépôt : python3 -I modeles/systeme-ideal/pas_a_pas_v51.py   (jsc : JavaScriptCore, aucun code tiers)."""
import os, shutil, subprocess, tempfile
JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc'
def R(path, a, b):
    s = open(path, encoding='utf-8').read(); assert a in s, (path, a); open(path, 'w', encoding='utf-8').write(s.replace(a, b))
STEPS = [
 ('départ (commit 78031b1d, v5 à 40,7 %)', []),
 ('H45 RSA 1,84 M (V11770)', [('modele.js', 'rsa: { n: 1.9e6,', 'rsa: { n: 1.84e6,')]),
 ('H23 emploi 27,9 M (V11772)', [('modele.js', 'actifs15h: 29.0e6', 'actifs15h: 27.9e6')]),
 ('H506 cotées 15 % (V7304)', [('taxe_patrimoine.js', 'partCotees: 0.20,', 'partCotees: 0.15,'), ('taxe_patrimoine.js', 'partCotees: 0.25,', 'partCotees: 0.15,'), ('taxe_patrimoine.js', 'partCotees: 0.30,', 'partCotees: 0.15,')]),
 ('H250 bornes 0 / 0,136 (V11556)', [('patrimoine_immobilier.js', 'semiElDmto: 0.03,', 'semiElDmto: 0.0,'), ('patrimoine_immobilier.js', 'semiElDmto: 0.10, capitalisation: 0.8', 'semiElDmto: 0.136, capitalisation: 0.8')]),
 ('H252 réalisation 1,5 / 1,0 (V11550)', [('patrimoine_immobilier.js', 'semiElDmto: 0.07, capitalisation: 0.5, elasticiteRealisation: 1.0', 'semiElDmto: 0.07, capitalisation: 0.5, elasticiteRealisation: 1.5'), ('patrimoine_immobilier.js', 'capitalisation: 0.8, elasticiteRealisation: 0.5', 'capitalisation: 0.8, elasticiteRealisation: 1.0')]),
 ('gestion : base CAF, plafond des départs, coût du socle (V12410)', [('optimum.js', 'supprimee: [8.44, 4.90, 2.37],', 'supprimee: [5.8174, 3.7986, 2.1068],'), ('optimum.js', 'coutSocle: [0.32, 0.64, 1.27],', 'coutSocle: [0.32, 0.64, 1.46],')]),
 ('IA 2,5 / 6 / 15 % (V12411)', [('optimum.js', 'central: [0.2, 0.2, -0.4],', 'central: [-0.11, -0.11, -0.4],'), ('optimum.js', 'ambitieux: [6.2, 0.2, -0.4]', 'ambitieux: [2.28, -0.11, -0.4]')]),
 ('H508 rendement locatif 1,7 / 2,0 / 2,7 % (V12420)', [('taxe_patrimoine.js', 'rendementLocatif: 0.030,', 'rendementLocatif: 0.017,'), ('taxe_patrimoine.js', 'rendementLocatif: 0.035,', 'rendementLocatif: 0.020,'), ('taxe_patrimoine.js', 'rendementLocatif: 0.045,', 'rendementLocatif: 0.027,')]),
]
PROBE = "var Z=this.Optimum; var a=Z.archi(Z.ARCHITECTURE_V5); var T=['bas','central','haut'].map(function(s){return Z.solde(a,s)}); print('RES', T.join(' '), Z.tauxEquilibre(Z.archi(Z.BASE_V5)));"
FILES = "modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js".split()
with tempfile.TemporaryDirectory() as tmp:
    arch = subprocess.run(['git', 'archive', '78031b1d', 'modeles'], capture_output=True, check=True).stdout
    subprocess.run(['tar', '-x', '-C', tmp], input=arch, check=True)
    d = os.path.join(tmp, 'modeles', 'systeme-ideal'); pr = os.path.join(tmp, 'probe.js'); open(pr, 'w').write(PROBE)
    for name, subs in STEPS:
        for f, a, b in subs: R(os.path.join(d, f), a, b)
        r = subprocess.run([JSC] + FILES + [pr], cwd=d, capture_output=True, text=True)
        print(name, '|', [l for l in r.stdout.splitlines() if l.startswith('RES')])
