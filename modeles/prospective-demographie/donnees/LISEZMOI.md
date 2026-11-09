# Données du modèle démographique

Toutes les données sont ouvertes, téléchargées par `curl` sans compte ni faux agent (consultation : 01/11/2026). Les fichiers bruts vivent hors dépôt, dans `$DONNEES/sources/t34-demo/` ; les CSV de ce dossier en sont extraits par [`preparer_donnees.py`](preparer_donnees.py).

| Fichier brut (hors dépôt) | Origine | Contenu |
|---|---|---|
| `eu_pop_age.json` | Eurostat, API `proj_23np` (EUROPOP2023), France, 5 variantes | population au 1er janvier par âge et sexe, 2022-2100 |
| `eu_mort.json` | Eurostat, `proj_23naasmr` | taux de décès par âge et sexe, 2022-2100 |
| `eu_fert.json` | Eurostat, `proj_23naasfr` | taux de fécondité par âge, 2022-2100 |
| `eu_bal.json` | Eurostat, `proj_23ndbi` | naissances, décès, solde migratoire, indicateurs d'âge par variante |
| `ip2108.xlsx` | Insee Première n° 2108 (projections 2026) | pyramide 2026/2070, scénarios, structure par âge, dépendance, mouvements, hypothèses |
| `ip1881.xlsx` | Insee Première n° 1881 (projections 2021-2070) | idem pour 2021-2070 |
| `cor_intro_ra_2026.pdf` | COR, rapport annuel juin 2026, introduction | hypothèses démographiques retenues |

Commandes de téléchargement (API Eurostat ; remplacer `FR` par un autre code pays pour paramétrer un autre pays) :

    B="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
    curl -sL -o eu_pop_age.json "$B/proj_23np?format=JSON&geo=FR&sex=M&sex=F&projection=BSL&projection=LFRT&projection=LMRT&projection=HMIGR&projection=LMIGR"
    curl -sL -o eu_mort.json    "$B/proj_23naasmr?format=JSON&geo=FR&sex=M&sex=F&projection=BSL"
    curl -sL -o eu_fert.json    "$B/proj_23naasfr?format=JSON&geo=FR&projection=BSL"
    curl -sL -o eu_bal.json     "$B/proj_23ndbi?format=JSON&geo=FR&projection=BSL&projection=LFRT&projection=LMRT&projection=HMIGR&projection=LMIGR"
    curl -sL -o ip2108.xlsx https://www.insee.fr/fr/statistiques/fichier/9004289/ip2108.xlsx
    curl -sL -o ip1881.xlsx https://www.insee.fr/fr/statistiques/fichier/5893969/ip1881.xlsx

Préparation : `$DONNEES/.venv/bin/python -I preparer_donnees.py [dossier_sources] [PAYS]` produit `europop_<PAYS>_*.csv` (et, pour FR, les CSV `insee2026_*` et `insee2021_*`). Pour un autre pays, `modele.charger_pays("XX")` lit ces fichiers ; les jeux d'hypothèses (`INSEE_2026`, `INSEE_2021`) sont ceux de la France et sont à remplacer par les hypothèses nationales du pays (ICF, solde migratoire, espérance de vie visés).

Tentative non aboutie : la fiche DREES « effectifs de retraités » (PDF, drees.solidarites-sante.gouv.fr) renvoie une page anti-robot (captcha) : arrêt, non téléchargée. Le chiffre des retraités (17,2 M, dont 16,3 M résidant en France, fin 2023) reste donc ⚠️ non lu dans le document.

## Module emploi et cotisants (T34, 01/11/2026)

Fichiers bruts hors dépôt : `$DONNEES/sources/t34-emploi/` (téléchargés par `curl` sans compte ni faux agent, aucun anti-robot rencontré). Les CSV de ce dossier en sont extraits par [`preparer_emploi.py`](preparer_emploi.py).

| Fichier brut | Origine | CSV produit |
|---|---|---|
| `e_lfsa_argan.json`, `e_lfsa_ergan.json`, `e_lfsa_urgan.json`, `e_lfsa_agan.json`, `e_lfsa_egan.json` | Eurostat, enquête sur les forces de travail, France, 5 ans de tranches, 2005-2025 | `eurostat_emploi_FR.csv` |
| `e_une_rt_a.json` | Eurostat, chômage 15-74 ans, France | `eurostat_chomage_FR.csv` |
| `cor_hyp_sexe_age_2026.xlsx` | COR, rapport annuel juin 2026, hypothèses d'emploi et de chômage par sexe et tranche d'âge (5, 7, 10 %) | `cor_hypotheses_emploi.csv` |
| `cor_donnees_RA2026_P1.xlsx` | COR, figures 1.5, 1.6, 1.8, 1.11, 1.12, tableau 1.2 | `cor_macro.csv`, `cor_activite_age.csv`, `cor_pop_active_decennal.csv` |
| `cor_donnees_RA2026_P2.xlsx` | COR, figure 2.5 (âge conjoncturel de départ) | `cor_age_depart.csv` |
| `cor_donnees_complementaires_2026.xlsx` | COR, cotisants, retraités, rapport ; taux de retraités par sexe et âge | `cor_cotisants_retraites.csv`, `cor_taux_retraites.csv` |

Commandes (France ; pour un autre pays, remplacer `geo=FR` côté Eurostat, mais les fichiers COR sont propres à la France) :

    B="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
    for c in lfsa_argan lfsa_ergan lfsa_urgan lfsa_agan lfsa_egan; do curl -sL -o "e_$c.json" "$B/$c?format=JSON&geo=FR&sex=M&sex=F&citizen=TOTAL&age=Y15-19&age=Y20-24&age=Y25-29&age=Y30-34&age=Y35-39&age=Y40-44&age=Y45-49&age=Y50-54&age=Y55-59&age=Y60-64&age=Y65-69&age=Y70-74&age=Y15-64&age=Y20-64&age=Y15-74&$(for y in $(seq 2005 2025); do printf 'time=%s&' $y; done)"; done
    curl -sL -o e_une_rt_a.json "$B/une_rt_a?format=JSON&geo=FR&sex=T&age=Y15-74&unit=PC_ACT&$(for y in $(seq 2005 2025); do printf 'time=%s&' $y; done)"
    U="https://www.cor-retraites.fr/sites/default/files"
    curl -sL -o cor_hyp_sexe_age_2026.xlsx "$U/2026-10/Hypoth%C3%A8ses_COR_ventil%C3%A9es_par_sexe_et_%C3%A2ge_2026.xlsx"
    curl -sL -o cor_donnees_RA2026_P1.xlsx "$U/2026-07/Donn%C3%A9es_RA2026_P1.xlsx"
    curl -sL -o cor_donnees_RA2026_P2.xlsx "$U/2026-06/Donn%C3%A9es_RA2026_P2.xlsx"
    curl -sL -o cor_donnees_complementaires_2026.xlsx "$U/2026-10/Donn%C3%A9es_compl%C3%A9mentaires.xlsx"

Préparation : `$DONNEES/.venv/bin/python -I preparer_emploi.py` ; calcul : `python3 run_emploi.py` (dossier parent).

Non obtenus : projections de population active de l'Insee et données de la Dares (non cherchées jusqu'au bout, ⚠️ V2838) ; fiche DREES des retraités (captcha, voir plus haut).
