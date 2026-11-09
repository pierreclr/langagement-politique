# -*- coding: utf-8 -*-
"""Plan d'affaires d'un centre public d'inférence d'IA (1, 5, 10 Md EUR).

Fonctions pures, sans dépendance externe. Lancer : python3 -I sources/calculs/inference_publique.py
Des hypothèses et des ordres de grandeur, jamais des prédictions.

Convention des scénarios : « bas » = issue défavorable (rentabilité faible),
« central », « haut » = issue favorable. Chaque paramètre est numéroté H1... et
sourcé ou marqué hypothèse dans sources/inference-publique-plan.md.
"""
from __future__ import annotations

import math

# ---------------------------------------------------------------- DeepSeek
# Fenêtre de 24 h, 27-28/02/2025 (UTC+8), publication du 01/03/2025 (cote A pour le fait publié, B pour l'interprétation).
DEEPSEEK = {
    "gpu": "H800",
    "gpu_par_noeud": 8,
    "noeuds_moyens": 226.75,
    "noeuds_pic": 278,
    "jetons_entree": 608e9,
    "dont_cache": 342e9,
    "jetons_sortie": 168e9,
    "loyer_gpu_heure_usd": 2.0,
    "cout_jour_usd": 87_072.0,
    "revenu_theorique_jour_usd": 562_027.0,
    "marge_publiee": 5.45,
    # tarifs R1 de l'époque, USD par million de jetons
    "prix_r1": {"cache": 0.14, "miss": 0.55, "sortie": 2.19},
    # tarifs V3.2 en 2026 (cote C : agrégateurs, à vérifier sur la page officielle)
    "prix_v32": {"cache": 0.028, "miss": 0.28, "sortie": 0.42},
}


def deepseek_controles(d: dict = DEEPSEEK) -> dict:
    """Recalcule les chiffres publiés et les met au tarif V3.2."""
    gpus = d["noeuds_moyens"] * d["gpu_par_noeud"]
    cout = gpus * 24 * d["loyer_gpu_heure_usd"]
    miss = d["jetons_entree"] - d["dont_cache"]

    def revenu(p):
        return (d["dont_cache"] * p["cache"] + miss * p["miss"] + d["jetons_sortie"] * p["sortie"]) / 1e6

    r1 = revenu(d["prix_r1"])
    v32 = revenu(d["prix_v32"])
    return {
        "gpus_moyens": gpus,
        "cout_jour_recalcule": cout,
        "revenu_r1_recalcule": r1,
        "marge_r1_recalculee": r1 / cout - 1,
        "revenu_v32": v32,
        "marge_v32": v32 / cout - 1,
        "revenu_gpu_heure_r1": r1 / (gpus * 24),
        "revenu_gpu_heure_v32": v32 / (gpus * 24),
        "sortie_par_gpu_heure": d["jetons_sortie"] / (gpus * 24),
        "entree_par_gpu_heure": d["jetons_entree"] / (gpus * 24),
        "moyenne_sur_pic": d["noeuds_moyens"] / d["noeuds_pic"],
    }


# ---------------------------------------------------------------- scénarios
USD_EUR = 0.87  # H0 : hypothèse (1 USD = 0,87 EUR), à actualiser

SCENARIOS = {
    "bas": dict(
        capex_it_mw_usd=26.1e6 * 1.3,      # H1 serveurs + réseau, Epoch AI 05/2026, +30 %
        capex_bat_mw_usd=11.8e6 * 1.3,     # H2 bâtiment, refroidissement, terrain, raccordement
        gpu_par_mw=475,                    # H3 dérivé (≈ 2,1 kW IT par GPU de classe GB200)
        accel=1.5,                         # H4 gain par GPU face au H800 de DeepSeek
        realisation=0.40,                  # H5 revenu réel / revenu théorique (gratuité, remises)
        prix_base_gpu_h_usd=3.55,          # H6 revenu théorique par GPU-heure H800 au tarif V3.2
        baisse_prix=0.30,                  # H7 baisse annuelle du revenu par GPU-heure
        reprise_generation=0.5,            # H8 part de la baisse regagnée au remplacement des puces
        utilisation=0.55,                  # H9 taux d'utilisation moyen en régime
        elec_eur_mwh=95.0,                 # H10 prix de l'électricité tout compris
        pue=1.25,                          # H11
        opex_hors_energie_mw_eur=0.45e6,   # H12 maintenance, personnel, sécurité, par MW et par an
        frais_variables=0.18,              # H12b part du chiffre d'affaires : support, réseau, licences, commercial
        duree_serveurs=3,                  # H13 amortissement économique des puces
        duree_batiment=15,                 # H14
        taux_actu=0.09,                    # H15 coût du capital public ajusté du risque
    ),
    "central": dict(
        capex_it_mw_usd=26.1e6,
        capex_bat_mw_usd=11.8e6,
        gpu_par_mw=475,
        accel=2.0,
        realisation=0.60,
        prix_base_gpu_h_usd=3.55,
        baisse_prix=0.20,
        reprise_generation=0.85,
        utilisation=0.70,
        elec_eur_mwh=75.0,
        pue=1.20,
        opex_hors_energie_mw_eur=0.35e6,
        frais_variables=0.12,
        duree_serveurs=5,
        duree_batiment=15,
        taux_actu=0.07,
    ),
    "haut": dict(
        capex_it_mw_usd=26.1e6 * 0.8,
        capex_bat_mw_usd=11.8e6 * 0.8,
        gpu_par_mw=475,
        accel=3.0,
        realisation=0.80,
        prix_base_gpu_h_usd=3.55,
        baisse_prix=0.10,
        reprise_generation=1.0,
        utilisation=0.80,
        elec_eur_mwh=50.0,
        pue=1.15,
        opex_hors_energie_mw_eur=0.30e6,
        frais_variables=0.08,
        duree_serveurs=7,
        duree_batiment=15,
        taux_actu=0.05,
    ),
}

HORIZON = 15           # années d'exploitation modélisées (années 0-1 : construction)
CONSTRUCTION = 2       # années de construction avant la première recette
RAMPE = 0.6            # part de l'utilisation de régime la première année d'exploitation
OAT_10_ANS = 0.0494    # taux de l'OAT à 10 ans, 03/11/2026 (cote C, Teleborsa)
PRIME_RISQUE = 0.02    # H16 prime de risque exigée au-dessus de l'emprunt d'État


def capex_par_mw_eur(p: dict) -> dict:
    it = p["capex_it_mw_usd"] * USD_EUR
    bat = p["capex_bat_mw_usd"] * USD_EUR
    return {"it": it, "bat": bat, "total": it + bat}


def dimensionner(invest_eur: float, p: dict) -> dict:
    c = capex_par_mw_eur(p)
    mw = invest_eur / c["total"]
    return {"mw_it": mw, "gpus": mw * p["gpu_par_mw"], "capex_mw": c}


def revenu_gpu_heure_eur(p: dict) -> float:
    """Revenu par GPU-heure occupée, année 1 d'exploitation, en EUR."""
    return p["prix_base_gpu_h_usd"] * p["accel"] * p["realisation"] * USD_EUR


def jetons_sortie_par_gpu_heure(p: dict) -> float:
    return DEEPSEEK["jetons_sortie"] / (DEEPSEEK["noeuds_moyens"] * DEEPSEEK["gpu_par_noeud"] * 24) * p["accel"]


def flux_par_mw(p: dict, utilisation: float | None = None, credit_part: float = 0.0,
                credit_taux: float = 0.06, credit_duree: int = 5) -> list[float]:
    """Flux annuels (EUR) pour 1 MW IT, années 0 à CONSTRUCTION+HORIZON-1.

    Années 0-1 : construction (capex réparti 50/50). Puis recettes, énergie, opex.
    Les serveurs sont rachetés au même prix nominal à la fin de leur durée ; au
    remplacement, le revenu par GPU-heure regagne reprise_generation de sa baisse.
    credit_part : part du capex serveurs avancée à crédit par le fournisseur (annuités constantes).
    """
    u = p["utilisation"] if utilisation is None else utilisation
    c = capex_par_mw_eur(p)
    n = CONSTRUCTION + HORIZON
    flux = [0.0] * n
    for t in range(CONSTRUCTION):
        flux[t] -= c["total"] / CONSTRUCTION
    rev0 = revenu_gpu_heure_eur(p)
    age, niveau = 0, 1.0   # niveau : revenu par GPU-heure de la génération en cours, relatif à l'année 1
    if credit_part > 0:
        emprunt = c["it"] * credit_part
        r = credit_taux
        annuite = emprunt * r / (1 - (1 + r) ** -credit_duree) if r > 0 else emprunt / credit_duree
        for t in range(CONSTRUCTION):
            flux[t] += emprunt / CONSTRUCTION
        for t in range(CONSTRUCTION, CONSTRUCTION + credit_duree):
            if t < n:
                flux[t] -= annuite
    for k in range(HORIZON):
        t = CONSTRUCTION + k
        if age >= p["duree_serveurs"]:
            flux[t] -= c["it"]
            perdu = 1 - (1 - p["baisse_prix"]) ** age
            niveau = 1 - perdu * (1 - p["reprise_generation"])
            age = 0
        rev_niveau = niveau * (1 - p["baisse_prix"]) ** age
        u_an = u * (RAMPE if k == 0 else 1.0)
        gpu_h = p["gpu_par_mw"] * 8760 * u_an
        revenu = gpu_h * rev0 * rev_niveau
        mw_elec = (0.4 + 0.6 * u_an) * p["pue"]  # MW moyens appelés par MW IT
        energie = mw_elec * 8760 * p["elec_eur_mwh"]
        flux[t] += revenu * (1 - p["frais_variables"]) - energie - p["opex_hors_energie_mw_eur"]
        age += 1
    # valeur résiduelle du bâtiment (linéaire) et des serveurs en cours
    restant_bat = max(0.0, 1 - HORIZON / p["duree_batiment"])
    flux[-1] += c["bat"] * restant_bat
    # serveurs : moitié de la valeur linéaire restante (prudence)
    restant_it = max(0.0, 1 - age / p["duree_serveurs"])
    flux[-1] += c["it"] * restant_it * 0.5
    return flux


def vna(flux: list[float], taux: float) -> float:
    return sum(f / (1 + taux) ** t for t, f in enumerate(flux))


def tri(flux: list[float]) -> float | None:
    """Taux de rendement interne par dichotomie ; None si pas de changement de signe."""
    lo, hi = -0.9, 5.0
    f_lo, f_hi = vna(flux, lo), vna(flux, hi)
    if f_lo * f_hi > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        f_mid = vna(flux, mid)
        if f_lo * f_mid <= 0:
            hi = mid
        else:
            lo, f_lo = mid, f_mid
    return (lo + hi) / 2


def retour(flux: list[float]) -> float | None:
    """Année (depuis t=0) où le cumul non actualisé redevient positif, interpolée."""
    cum = 0.0
    for t, f in enumerate(flux):
        prev = cum
        cum += f
        if cum >= 0 and prev < 0:
            return t - 1 + (-prev) / f if f else float(t)
    return None


def plan(invest_eur: float, p: dict, **kw) -> dict:
    d = dimensionner(invest_eur, p)
    f = flux_par_mw(p, **kw)
    mw = d["mw_it"]
    flux = [x * mw for x in f]
    u = p["utilisation"]
    gpu_h = d["gpus"] * 8760 * u
    ca_regime = gpu_h * revenu_gpu_heure_eur(p)
    mw_elec = mw * (0.4 + 0.6 * u) * p["pue"]
    energie = mw_elec * 8760 * p["elec_eur_mwh"]
    ebitda = ca_regime * (1 - p["frais_variables"]) - energie - p["opex_hors_energie_mw_eur"] * mw
    return {
        "mw_it": mw,
        "gpus": d["gpus"],
        "twh_an": mw_elec * 8760 / 1e6,
        "jetons_sortie_an": gpu_h * jetons_sortie_par_gpu_heure(p),
        "ca_an1": ca_regime,
        "energie_an": energie,
        "ebitda_an1": ebitda,
        "marge_ebitda": ebitda / ca_regime if ca_regime else float("nan"),
        "vna": vna(flux, p["taux_actu"]),
        "tri": tri(flux),
        "retour_annees": retour(flux),
        "flux": flux,
        "pire_tresorerie": min(sum(flux[: i + 1]) for i in range(len(flux))),
    }


def sensibilite(invest_eur: float, nom: str, param: str, valeurs: list, **kw) -> list[tuple]:
    out = []
    for v in valeurs:
        p = dict(SCENARIOS[nom])
        p[param] = v
        r = plan(invest_eur, p, **kw)
        out.append((v, r["vna"], r["tri"]))
    return out


def seuil_utilisation(p: dict, taux: float | None = None) -> float | None:
    """Utilisation (0-1) à laquelle la VNA est nulle au taux donné (VNA linéaire en u)."""
    taux = p["taux_actu"] if taux is None else taux

    def g(u):
        return vna(flux_par_mw(p, utilisation=u), taux)

    lo, hi = 0.0, 1.5
    if g(lo) > 0:
        return 0.0
    if g(hi) < 0:
        return None
    for _ in range(100):
        mid = (lo + hi) / 2
        if g(mid) < 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def seuil_prix(p: dict, taux: float) -> float | None:
    """Revenu par GPU-heure (EUR, année 1) pour lequel la VNA est nulle au taux donné."""
    lo, hi = 0.1, 100.0

    def g(prix):
        q = dict(p)
        q["accel"] = prix / (p["prix_base_gpu_h_usd"] * p["realisation"] * USD_EUR)
        return vna(flux_par_mw(q), taux)

    if g(hi) < 0:
        return None
    for _ in range(100):
        mid = (lo + hi) / 2
        if g(mid) < 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


# ------------------------------------------------- dette contre investissement
def interets_evites(montant_eur: float, taux: float = OAT_10_ANS) -> float:
    """Intérêts annuels évités en ne s'endettant pas (ou en remboursant) à ce taux."""
    return montant_eur * taux


def investir_bat_dette(tri_projet: float | None, taux_dette: float = OAT_10_ANS, prime: float = PRIME_RISQUE) -> str:
    if tri_projet is None:
        return "non"
    if tri_projet > taux_dette + prime:
        return "oui (au-dessus du taux de l'État plus la prime de risque)"
    if tri_projet > taux_dette:
        return "marginal (bat la dette, pas la prime de risque)"
    return "non (la dette rapporte plus, sans risque)"


# ------------------------------------------------- profil de 24 heures
def forme_horaire(debut: int, fin: int, plancher: float, decalage: int = 0) -> list[float]:
    """Forme de demande sur 24 h (heure de Paris), moyenne normalisée à 1.

    Plateau entre debut et fin (heures locales du client), plancher la nuit,
    rampes d'une heure. decalage = heures à ajouter pour passer à l'heure de Paris
    (client de New York : 6 ; de San Francisco : 9).
    """
    brut = []
    for h in range(24):
        hl = (h - decalage) % 24
        if debut <= hl < fin:
            v = 1.0
        elif hl == debut - 1 or hl == fin:
            v = (1 + plancher) / 2
        else:
            v = plancher
        brut.append(v)
    m = sum(brut) / 24
    return [v / m for v in brut]


def utilisation_profil(volumes: dict[str, float], formes: dict[str, list[float]], ordre: list[str]) -> dict:
    """Capacité = 1. volumes[seg] = demande moyenne en part de capacité.

    Priorité de service selon `ordre`. Retourne l'utilisation et la part servie par segment.
    """
    servi = {s: 0.0 for s in ordre}
    for h in range(24):
        reste = 1.0
        for s in ordre:
            dem = volumes[s] * formes[s][h]
            x = min(reste, dem)
            servi[s] += x / 24
            reste -= x
    util = sum(servi.values())
    return {"utilisation": util, "servi": servi, "demande": dict(volumes)}


def seuil_part_externe(u_seuil: float, u_total: float, u_interne: float, valeur_interne: float = 0.0) -> float:
    """Part minimale des ventes (en utilisation) qui doit être externe pour VNA ≥ 0.

    u_seuil : utilisation de VNA nulle ; u_interne : utilisation servie en interne ;
    valeur_interne : part du prix de marché reversée par les administrations (0 = budget global, 1 = au prix de marché).
    Retourne la part de l'utilisation totale vendue à l'extérieur (peut dépasser 1 : non finançable).
    """
    ext_requis = max(0.0, u_seuil - valeur_interne * u_interne)
    return ext_requis / u_total if u_total > 0 else float("inf")


# ------------------------------------------------- tests
def c_total(p: dict) -> float:
    return capex_par_mw_eur(p)["total"]


def _tests() -> None:
    d = deepseek_controles()
    assert abs(d["cout_jour_recalcule"] - 87_072) < 1, d
    assert abs(d["revenu_r1_recalcule"] - 562_027) / 562_027 < 0.01, d
    assert abs(d["marge_r1_recalculee"] - 5.45) < 0.05, d
    assert d["marge_v32"] < d["marge_r1_recalculee"]
    # investissement proportionnel : la VNA est linéaire dans la taille
    p = SCENARIOS["central"]
    a, b = plan(1e9, p), plan(5e9, p)
    assert abs(b["vna"] / a["vna"] - 5) < 1e-6
    assert abs(b["mw_it"] / a["mw_it"] - 5) < 1e-9
    # ordre des scénarios
    v = [plan(1e9, SCENARIOS[n])["vna"] for n in ("bas", "central", "haut")]
    assert v[0] < v[1] < v[2], v
    # le TRI est cohérent avec la VNA : VNA au taux TRI ≈ 0
    r = plan(1e9, SCENARIOS["central"])
    if r["tri"] is not None:
        assert abs(vna(r["flux"], r["tri"])) < 1.0
    # la VNA croît avec l'utilisation
    q = dict(SCENARIOS["central"])
    assert plan(1e9, dict(q, utilisation=0.8))["vna"] > plan(1e9, dict(q, utilisation=0.5))["vna"]
    # la VNA baisse avec le prix de l'électricité
    assert plan(1e9, dict(q, elec_eur_mwh=120))["vna"] < plan(1e9, dict(q, elec_eur_mwh=40))["vna"]
    # seuil d'utilisation : VNA nulle
    u = seuil_utilisation(q)
    assert u is not None and abs(vna(flux_par_mw(q, utilisation=u), q["taux_actu"])) < 1.0
    # un crédit fournisseur à taux = taux d'actualisation ne change pas la VNA (hors résidu)
    base = vna(flux_par_mw(q), q["taux_actu"])
    cred = vna(flux_par_mw(q, credit_part=0.5, credit_taux=q["taux_actu"]), q["taux_actu"])
    assert abs(cred - base) < 0.05 * c_total(q), (base, cred)
    assert vna(flux_par_mw(q, credit_part=0.5, credit_taux=0.03), 0.07) > vna(flux_par_mw(q, credit_part=0.5, credit_taux=0.09), 0.07)
    # formes horaires : moyenne 1 ; un fuseau décalé couvre la nuit
    f_eu = forme_horaire(8, 19, 0.3)
    f_us = forme_horaire(8, 19, 0.3, decalage=7)
    assert abs(sum(f_eu) / 24 - 1) < 1e-9
    seul = utilisation_profil({"eu": 0.6}, {"eu": f_eu}, ["eu"])["utilisation"]
    mixte = utilisation_profil({"eu": 0.3, "us": 0.3}, {"eu": f_eu, "us": f_us}, ["eu", "us"])["utilisation"]
    assert mixte > seul, (mixte, seul)
    # la part externe requise baisse avec la valeur reversée en interne
    assert seuil_part_externe(0.5, 0.7, 0.2, 1.0) < seuil_part_externe(0.5, 0.7, 0.2, 0.0)
    print("Tests : tous passés")


def _fmt(x, n=1):
    return "n/a" if x is None else f"{x:,.{n}f}".replace(",", " ")


def principal() -> None:
    d = deepseek_controles()
    print("== DeepSeek, fenêtre 27-28/02/2025 : recalcul")
    for k, v in d.items():
        print(f"  {k}: {_fmt(v, 3 if abs(v) < 100 else 0)}")
    print()
    print("== Plan d'affaires (EUR, par scénario)")
    for inv in (1e9, 5e9, 10e9):
        print(f"-- Investissement {inv/1e9:.0f} Md EUR")
        for nom in ("bas", "central", "haut"):
            p = SCENARIOS[nom]
            r = plan(inv, p)
            print(
                f"  {nom:8s} MW={_fmt(r['mw_it'],0)} GPU={_fmt(r['gpus'],0)} TWh/an={_fmt(r['twh_an'],2)} "
                f"jetons sortie/an={r['jetons_sortie_an']/1e12:,.0f} T CA={_fmt(r['ca_an1']/1e6,0)} M "
                f"EBITDA={_fmt(r['ebitda_an1']/1e6,0)} M ({_fmt(r['marge_ebitda']*100,0)} %) "
                f"VNA={_fmt(r['vna']/1e6,0)} M TRI={_fmt(None if r['tri'] is None else r['tri']*100,1)} % "
                f"retour={_fmt(r['retour_annees'],1)} an  tréso min={_fmt(r['pire_tresorerie']/1e6,0)} M"
            )
    print()
    print("== Sensibilités, central, 5 Md EUR : VNA (M EUR) et TRI (%)")
    inv = 5e9
    for param, vals in [
        ("utilisation", [0.4, 0.55, 0.7, 0.8, 0.9]),
        ("realisation", [0.3, 0.45, 0.6, 0.8]),
        ("baisse_prix", [0.10, 0.20, 0.30, 0.40, 0.55]),
        ("elec_eur_mwh", [40, 60, 75, 100, 140]),
        ("taux_actu", [0.04, 0.0494, 0.07, 0.09]),
        ("duree_serveurs", [3, 5, 7]),
        ("accel", [1.0, 1.5, 2.0, 3.0]),
        ("reprise_generation", [0.0, 0.5, 0.85, 1.0]),
    ]:
        rows = sensibilite(inv, "central", param, vals)
        print(f"  {param}: " + " ; ".join(f"{v}: {_fmt(a/1e6,0)} M / {_fmt(None if b is None else b*100,1)} %" for v, a, b in rows))
    print()
    print("== Seuils (central)")
    p = SCENARIOS["central"]
    for taux in (OAT_10_ANS, OAT_10_ANS + PRIME_RISQUE, 0.09):
        print(f"  taux {taux*100:.2f} % : utilisation de VNA nulle = {_fmt((seuil_utilisation(p, taux) or 0)*100,0)} % ; "
              f"revenu min par GPU-heure = {_fmt(seuil_prix(p, taux),2)} EUR (central : {_fmt(revenu_gpu_heure_eur(p),2)})")
    print()
    print("== Crédit du fournisseur (central, 5 Md EUR, 50 % des serveurs, 5 ans)")
    for taux in (0.03, 0.06, 0.09):
        r = plan(5e9, p, credit_part=0.5, credit_taux=taux)
        print(f"  taux du crédit {taux*100:.0f} % : VNA={_fmt(r['vna']/1e6,0)} M ; sortie de trésorerie maximale={_fmt(-r['pire_tresorerie']/1e6,0)} M")
    r0 = plan(5e9, p)
    print(f"  sans crédit : VNA={_fmt(r0['vna']/1e6,0)} M ; sortie maximale={_fmt(-r0['pire_tresorerie']/1e6,0)} M")
    print()
    print("== Dette ou investissement (OAT 10 ans 4,94 %)")
    for nom in ("bas", "central", "haut"):
        r = plan(5e9, SCENARIOS[nom])
        print(f"  {nom}: TRI={_fmt(None if r['tri'] is None else r['tri']*100,1)} % -> {investir_bat_dette(r['tri'])}")
    print(f"  intérêts évités par 5 Md EUR de dette en moins : {_fmt(interets_evites(5e9)/1e6,0)} M EUR/an")
    print()
    print("== Profil de 24 h : usage interne + Europe + États-Unis (capacité = 1)")
    f_int = forme_horaire(8, 19, 0.35)
    f_eu = forme_horaire(8, 21, 0.30)
    f_est = forme_horaire(9, 19, 0.30, decalage=6)
    f_ouest = forme_horaire(9, 19, 0.30, decalage=9)
    f_us = [(a + b) / 2 for a, b in zip(f_est, f_ouest)]
    formes = {"int": f_int, "eu": f_eu, "us": f_us}
    ordre = ["int", "eu", "us"]
    print(f"  pic/moyenne : interne {max(f_int):.2f} ; Europe {max(f_eu):.2f} ; États-Unis {max(f_us):.2f}")
    mixes = [
        ("A. Interne 0,10 + Europe 0,60 (demande totale 0,70, sans États-Unis)", {"int": 0.10, "eu": 0.60, "us": 0.0}),
        ("B. Interne 0,10 + Europe 0,30 + États-Unis 0,30 (même demande totale 0,70)", {"int": 0.10, "eu": 0.30, "us": 0.30}),
        ("C. Interne 0,10 + Europe 0,45 + États-Unis 0,45 (demande totale 1,00)", {"int": 0.10, "eu": 0.45, "us": 0.45}),
        ("E. Interne 0,10 + Europe 0,90 (demande totale 1,00, sans États-Unis : les pointes de jour saturent)", {"int": 0.10, "eu": 0.90, "us": 0.0}),
        ("D. Interne 0,20 + Europe 0,20 (public presque seul)", {"int": 0.20, "eu": 0.20, "us": 0.0}),
    ]
    for nom in ("central", "haut"):
        p = SCENARIOS[nom]
        u_seuil = seuil_utilisation(p, OAT_10_ANS) or 0.0
        print(f"  [{nom}] utilisation de VNA nulle au taux de l'État ({OAT_10_ANS*100:.2f} %) : {u_seuil*100:.0f} %")
        for label, vols in mixes:
            o = formes_o = utilisation_profil(vols, formes, ordre)
            u_tot, u_int = o["utilisation"], o["servi"]["int"]
            res = []
            for k in (0.0, 0.5, 1.0):
                sh = seuil_part_externe(u_seuil, u_tot, u_int, k)
                res.append(f"{sh*100:.0f} %" if sh <= 1.0 else "non finançable")
            print(f"    {label}: utilisation {u_tot*100:.0f} % (interne {u_int*100:.0f} %, Europe {o['servi']['eu']*100:.0f} %, "
                  f"États-Unis {o['servi']['us']*100:.0f} %) ; part externe minimale, interne reversé à 0 / 50 / 100 % du prix : " + " / ".join(res))
    print()
    _tests()


if __name__ == "__main__":
    principal()
