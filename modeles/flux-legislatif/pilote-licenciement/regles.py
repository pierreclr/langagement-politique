# -*- coding: utf-8 -*-
"""Pilote « loi as code » : conséquences du licenciement (Code du travail, art. L1234-1 à L1234-20,
R1234-1 à R1234-12, D1234-6 à D1234-8 ; 33 articles en vigueur au 03/11/2026, codes.droit.org).

Deux fonctions pures, même entrée (`Situation`), même sortie (`Resultat`) :
- `actuel(s)`   : le droit en vigueur, article par article (chaque règle cite son article) ;
- `reecrit(s, options)` : la réécriture proposée (texte : reecriture.md), dont chaque écart au droit
  actuel est une option nommée (E1 à E5), activable ou non, pour « stress tester » la réforme.

Hors périmètre (renvoyé, pas modélisé) : licenciement économique (L1233), indemnité pour licenciement
sans cause réelle et sérieuse (L1235-3, « barème »), conventions collectives (le modèle prend en entrée
le préavis et l'indemnité conventionnels s'ils existent), congés payés, régimes spéciaux (L1234-14).
Interprétations non tranchées par le texte : marquées « ⚠️ À VÉRIFIER » (jurisprudence à confirmer).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class Situation:
    contrat: str = "CDI"                     # CDI | CDD | interim
    anciennete_mois: float = 24.0            # services continus chez l'employeur, à la notification
    suspension_mois: float = 0.0             # périodes de suspension (maladie, congé sans solde...) incluses ci-dessus
    suspension_elu_local_mois: float = 0.0   # dont suspension d'élu local (L3142-88), qui compte
    faute: str = "aucune"                    # aucune | simple | grave | lourde
    force_majeure: bool = False              # cessation d'entreprise pour force majeure
    sinistre: bool = False                   # ... résultant d'un sinistre (L1234-13)
    salaires_12_mois: tuple = (2000.0,) * 12 # salaires bruts mensuels, du plus ancien au plus récent
    primes_annuelles_3_derniers_mois: float = 0.0  # primes annuelles ou exceptionnelles versées dans les 3 derniers mois
    alsace_moselle: bool = False             # Bas-Rhin, Haut-Rhin, Moselle
    periodicite_paie: str = "mois"           # jour | semaine | mois | trimestre
    categorie_locale: str = ""               # professeur | commis | encadrement | "" (L1234-16)
    preavis_conventionnel_mois: Optional[float] = None   # convention, accord, contrat ou usage
    indemnite_conventionnelle: Optional[float] = None    # montant conventionnel, s'il existe
    preavis_execute: bool = True             # le salarié effectue son préavis
    preavis_dispense_par: str = ""           # "" | employeur | salarie


@dataclass
class Resultat:
    applicable: bool = True
    preavis_mois: Optional[float] = None     # None = renvoi à la convention ou aux usages (non chiffré par la loi)
    indemnite_preavis: float = 0.0
    indemnite_licenciement: float = 0.0
    droit_indemnite: bool = False
    documents: tuple = ()
    delai_denonciation_solde_mois: int = 6
    articles: tuple = ()
    notes: tuple = ()

    def cle(self) -> tuple:
        """Ce qui compte pour la personne (comparaison de non-régression)."""
        return (self.applicable, self.preavis_mois, round(self.indemnite_preavis, 2),
                round(self.indemnite_licenciement, 2), tuple(sorted(self.documents)), self.delai_denonciation_solde_mois)


DOCUMENTS = ("certificat de travail", "reçu pour solde de tout compte", "attestation France Travail")


# ------------------------------------------------------------------ briques communes
def anciennete_retenue(s: Situation) -> float:
    """L1234-8 et L1234-11 : la suspension ne rompt pas l'ancienneté mais n'est pas comptée,
    sauf la suspension d'élu local (L3142-88)."""
    return max(0.0, s.anciennete_mois - (s.suspension_mois - s.suspension_elu_local_mois))


def salaire_reference(s: Situation, regle_plus_favorable: bool = True) -> float:
    """R1234-4 : le plus avantageux de (1) la moyenne des 12 derniers mois (ou de tous les mois si moins
    de 12) et (2) le tiers des 3 derniers mois, primes annuelles ou exceptionnelles prises au prorata."""
    sal = list(s.salaires_12_mois)[-12:]
    if not sal:
        return 0.0
    moy12 = sum(sal) / len(sal)
    if not regle_plus_favorable:
        return moy12
    trois = sal[-3:]
    p = s.primes_annuelles_3_derniers_mois
    moy3 = (sum(trois) - p + p * 3 / 12) / len(trois)
    return max(moy12, moy3)


def bareme_indemnite(salaire: float, anciennete_mois: float, quart_jusqua: float = 10, tiers_apres: float = 1 / 3) -> float:
    """R1234-1 et R1234-2 : 1/4 de mois par année jusqu'à 10 ans, 1/3 au-delà ; mois complets au prorata."""
    mois = int(anciennete_mois)  # mois complets
    annees = mois / 12
    return salaire * (min(annees, quart_jusqua) / 4 + max(annees - quart_jusqua, 0) * tiers_apres)


def preavis_local(s: Situation) -> Optional[float]:
    """L1234-15 et L1234-16 (Alsace-Moselle), en mois (1 semaine = 7/30,4 mois)."""
    sem = 7 / 30.4
    if s.categorie_locale in ("professeur", "commis", "encadrement"):
        return 6 * sem
    return {"jour": 1 / 30.4, "semaine": sem, "mois": 0.5, "trimestre": 6 * sem}.get(s.periodicite_paie)


# ------------------------------------------------------------------ droit actuel
def actuel(s: Situation) -> Resultat:
    r = Resultat()
    arts, notes = [], []
    if s.contrat != "CDI":
        r.applicable = False
        r.documents = DOCUMENTS
        r.articles = ("L1234-9", "L1234-19", "L1234-20", "R1234-9")
        r.notes = ("Chapitre propre au licenciement d'un CDI ; documents de fin de contrat dus pour tout contrat.",)
        return r
    anc = anciennete_retenue(s)
    grave = s.faute in ("grave", "lourde")

    # préavis (L1234-1, L1234-2, L1234-17-1, local L1234-15/16)
    if grave:
        preavis = 0.0
        arts.append("L1234-1")
    elif s.force_majeure:
        preavis = 0.0
        arts.append("L1234-12")
    else:
        if anc < 6:
            legal = None  # renvoi à la loi, la convention ou les usages (1°)
        elif anc < 24:
            legal = 1.0
        else:
            legal = 2.0
        arts += ["L1234-1", "L1234-8"]
        candidats = [x for x in (legal, s.preavis_conventionnel_mois) if x is not None]
        if s.alsace_moselle:
            loc = preavis_local(s)
            if loc is not None:
                candidats.append(loc)
            arts += ["L1234-15", "L1234-16", "L1234-17-1"]
            notes.append("Alsace-Moselle : on retient le préavis le plus long entre droit local et droit général ⚠️ À VÉRIFIER (articulation L1234-17-1).")
        preavis = max(candidats) if candidats else None
        if preavis is None:
            notes.append("Ancienneté < 6 mois : la loi renvoie à la convention ou aux usages ; aucun préavis chiffré.")
    r.preavis_mois = preavis

    sal = salaire_reference(s)
    # indemnité compensatrice de préavis (L1234-5) : due si le préavis n'est pas exécuté, sauf faute grave
    if preavis and not s.preavis_execute and s.preavis_dispense_par != "salarie":
        r.indemnite_preavis = preavis * sal
        arts.append("L1234-5")
        notes.append("Indemnité de préavis calculée sur le salaire de référence ⚠️ (en droit : le salaire que le salarié aurait perçu).")

    # indemnité de licenciement (L1234-9, R1234-1, R1234-2, R1234-4, R1234-5)
    droit = (not grave) and anc >= 8
    montant = 0.0
    if droit:
        # ancienneté de calcul : jusqu'à la fin du préavis, même non exécuté (L1234-4) ⚠️ À VÉRIFIER
        anc_calcul = anc + (preavis or 0.0)
        montant = bareme_indemnite(sal, anc_calcul)
        arts += ["L1234-9", "L1234-11", "R1234-1", "R1234-2", "R1234-4", "R1234-5"]
        if s.indemnite_conventionnelle is not None:
            montant = max(montant, s.indemnite_conventionnelle)  # R1234-5 : pas de cumul, la plus favorable
    if s.force_majeure:
        arts.append("L1234-12")
        if s.sinistre:
            # L1234-13 : indemnité compensatrice égale à préavis + licenciement, comme si L1234-5 et L1234-9 s'appliquaient
            p = 2.0 if anc >= 24 else 1.0 if anc >= 6 else (s.preavis_conventionnel_mois or 0.0)
            r.indemnite_preavis = p * sal
            montant = bareme_indemnite(sal, anc + p) if anc >= 8 else 0.0
            droit = anc >= 8
            arts.append("L1234-13")
        else:
            montant, droit = 0.0, False
    r.droit_indemnite = droit
    r.indemnite_licenciement = montant
    r.documents = DOCUMENTS
    arts += ["L1234-19", "L1234-20", "D1234-6", "D1234-7", "D1234-8", "R1234-9"]
    r.delai_denonciation_solde_mois = 6
    r.articles = tuple(dict.fromkeys(arts))
    r.notes = tuple(notes)
    return r


# ------------------------------------------------------------------ réécriture
OPTIONS_DEFAUT = {
    "E1_preavis_court_chiffre": True,      # < 6 mois : 15 jours de préavis légal (au lieu du renvoi aux usages)
    "E2_indemnite_des_le_1er_mois": True,  # supprime le seuil de 8 mois : indemnité au prorata dès le 1er mois
    "E3_droit_local_fondu": True,          # Alsace-Moselle : le droit local de préavis est abrogé (droit général seul)
    "E4_salaire_12_mois_seul": False,      # salaire de référence = moyenne des 12 mois seulement (plus simple, moins favorable)
    "E5_document_unique": True,            # un seul « relevé de fin de contrat » numérique remplace les 3 documents
}


def reecrit(s: Situation, options: dict = None) -> Resultat:
    """Réécriture (texte : reecriture.md, 6 articles).  Chaque écart au droit actuel = une option E1..E5."""
    o = dict(OPTIONS_DEFAUT, **(options or {}))
    r = Resultat()
    if s.contrat != "CDI":
        r.applicable = False
        r.documents = ("relevé de fin de contrat",) if o["E5_document_unique"] else DOCUMENTS
        r.articles = ("Art. 1",)
        return r
    anc = anciennete_retenue(s)                       # art. 2 (inchangé)
    grave = s.faute in ("grave", "lourde")
    # art. 3 : préavis
    if grave or s.force_majeure:
        preavis = 0.0
    else:
        legal = 2.0 if anc >= 24 else 1.0 if anc >= 6 else (0.5 if o["E1_preavis_court_chiffre"] else None)
        candidats = [x for x in (legal, s.preavis_conventionnel_mois) if x is not None]
        if s.alsace_moselle and not o["E3_droit_local_fondu"]:
            loc = preavis_local(s)
            if loc is not None:
                candidats.append(loc)
        preavis = max(candidats) if candidats else None
    r.preavis_mois = preavis
    sal = salaire_reference(s, regle_plus_favorable=not o["E4_salaire_12_mois_seul"])
    if preavis and not s.preavis_execute and s.preavis_dispense_par != "salarie":
        r.indemnite_preavis = preavis * sal
    # art. 4 : indemnité
    seuil = 0 if o["E2_indemnite_des_le_1er_mois"] else 8
    droit = (not grave) and anc >= max(seuil, 1e-9) and not (s.force_majeure and not s.sinistre)
    montant = 0.0
    if s.force_majeure and s.sinistre:
        p = 2.0 if anc >= 24 else 1.0 if anc >= 6 else ((0.5 if o["E1_preavis_court_chiffre"] else None) or s.preavis_conventionnel_mois or 0.0)
        r.indemnite_preavis = p * sal
        montant = bareme_indemnite(sal, anc + p) if droit else 0.0
    elif droit:
        montant = bareme_indemnite(sal, anc + (preavis or 0.0))
        if s.indemnite_conventionnelle is not None:
            montant = max(montant, s.indemnite_conventionnelle)
    r.droit_indemnite = droit and montant > 0
    r.indemnite_licenciement = montant
    # art. 5 : documents
    r.documents = ("relevé de fin de contrat",) if o["E5_document_unique"] else DOCUMENTS
    r.delai_denonciation_solde_mois = 6
    r.articles = ("Art. 2", "Art. 3", "Art. 4", "Art. 5")
    return r
