# -*- coding: utf-8 -*-
"""Si rien ne change : dette, déficit et intérêts de 2026 à 2050 (moteur du banc, macro de référence).
Écrit `fil-de-l-eau-2050.md` (généré, ne pas éditer à la main). Lancer : python3 -I modeles/banc-programmes/fil_de_l_eau_2050.py"""
import os, sys
ICI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, ICI)
import relancer as R, moteur as M

ctx = R.construire_ctx(False); eco = ctx['eco']; mac = ctx['macros']['reference']
tr = M.trajectoire_dette({}, eco, mac, annee_fin=2050)
lignes = ["---", "titre: Si rien ne change, de 2026 à 2050", "statut: généré par fil_de_l_eau_2050.py ; ordres de grandeur sous hypothèses, jamais des prédictions", "---", "",
          "# Si rien ne change : dette, déficit et intérêts jusqu'en 2050", "",
          "Moteur du banc (`moteur.trajectoire_dette`), droit actuel : solde primaire de 2024 maintenu en part du PIB ; croissance nominale %.1f %% par an ; taux de marché %.2f %% ; la dette se renouvelle en %d ans. Point de départ : dette %.1f Md€, intérêts %.1f Md€ (2025). « Md€ à l'échelle d'aujourd'hui » : montant ramené au PIB de 2025." % (100*mac['g'], 100*mac['r'], eco['dureeDette'], eco['dette0'], eco['interets0']), "",
          "| Année | Dette (% du PIB) | Déficit (% du PIB) | Intérêts (% du PIB) | Intérêts (Md€ à l'échelle d'aujourd'hui) |", "|---|---|---|---|---|"]
for an in range(2026, 2051):
    t = tr[an]
    lignes.append("| %d | %s | %s | %s | %s |" % (an, *[("%.1f" % (100 * t[k])).replace(".", ",") for k in ('ratio', 'deficit_pct')],
                                                ("%.2f" % (100 * t['interets_pct'])).replace(".", ","), "%.0f" % (t['interets_pct'] * eco['pib0'])))
open(os.path.join(ICI, "fil-de-l-eau-2050.md"), "w", encoding="utf-8").write("\n".join(lignes) + "\n")
print("\n".join(lignes[-6:]))
