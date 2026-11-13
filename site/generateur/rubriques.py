# -*- coding: utf-8 -*-
"""Rubriques du site générées à partir de données : Comparer, Comprendre, Vérifier (13/11/2026).

Sources (dans outils/publication/contenu/) :
- programmes/<id>.json : une fiche par parti (même plan), plus langagement.json (notre colonne, commune à toutes les comparaisons) ;
- comprendre.json : les dossiers « Comprendre » écrits à la main (titre, adresse, thème, résumé, vidéo éventuelle) ;
- verifications.json : les vérifications publiées (déclaration, auteur, date, adresse, résumé).
Pages produites : /comparer.html, /comprendre/index.html, /comprendre/programme-<id>.html, /verifier/index.html.
Le code d'une page de programme est le même pour tous les partis (demande de l'auteur : factoriser).
Contrôle : la dette 2038 de chaque fiche doit être celle du classement de modeles/banc-programmes/resultats-v2.md."""
import html
import json
import os
import re

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(os.path.dirname(ICI))
CONTENU = os.path.join(ICI, "contenu")
ORDRE = ["langagement", "lr", "ps", "gl", "rn", "lfi"]
NOMS_COURTS = {"langagement": "Nous", "lr": "LR", "ps": "PS", "gl": "Place publique", "rn": "RN", "lfi": "LFI"}
VERDICTS = {"accord": ("D'accord", "v-accord"), "partiel": ("En partie", "v-partiel"), "desaccord": ("Pas d'accord", "v-desaccord"),
            "sans objet": ("Sans objet", "v-sans")}

CSS = """
.v{display:inline-block;font-size:.74rem;font-weight:700;border-radius:999px;padding:2px 9px;white-space:nowrap}
.v-accord{background:var(--vert-doux);color:var(--vert)}.v-partiel{background:var(--ambre-doux);color:var(--ambre)}
.v-desaccord{background:#fbe9ec;color:var(--rouge)}.v-sans{background:var(--fond);color:var(--doux);border:1px solid var(--trait)}
@media (prefers-color-scheme:dark){:root:not([data-theme="clair"]) .v-desaccord{background:#2a1b1e}}
.matrice{overflow-x:auto;margin-top:18px;border:1px solid var(--trait);border-radius:12px;background:var(--surface)}
.matrice table{min-width:720px;font-size:.88rem}.matrice td,.matrice th{vertical-align:top;padding:10px}
.matrice td .v{display:block;margin:0 0 4px;text-align:center}
.matrice th.theme{min-width:150px}.matrice td a .v{font-size:.7rem}
.cle{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:.88rem;color:var(--doux);margin-top:10px}
.fiches{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}
.fiches article{background:var(--surface);border:1px solid var(--trait);border-radius:14px;padding:18px}
.fiches h3{font-family:var(--serif);font-size:1.25rem;margin:0 0 6px}
.fiches p{font-size:.95rem;margin:0 0 8px}.fiches ul{margin:4px 0 10px;padding-left:18px;font-size:.93rem}
@media (max-width:760px){.fiches{grid-template-columns:1fr}}
.onglets{display:flex;gap:6px;border-bottom:2px solid var(--trait);margin:26px 0 0;flex-wrap:wrap}
.onglets button{background:none;border:0;border-bottom:3px solid transparent;margin-bottom:-2px;padding:10px 14px;font:inherit;font-weight:700;color:var(--doux);cursor:pointer}
.onglets button[aria-selected=true]{color:var(--accent);border-bottom-color:var(--accent)}
.panneau[hidden]{display:none}
.chiffres4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}
.chiffres4 div{border-left:3px solid var(--accent);padding:2px 0 2px 12px}.chiffres4 b{display:block;font-family:var(--serif);font-size:1.4rem}
.chiffres4 span{font-size:.85rem;color:var(--doux)}
@media (max-width:760px){.chiffres4{grid-template-columns:1fr 1fr}}
.liste-dossiers{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.liste-dossiers a{display:block;background:var(--surface);border:1px solid var(--trait);border-radius:14px;padding:16px;text-decoration:none;color:var(--encre)}
.liste-dossiers a b{display:block;font-family:var(--serif);font-size:1.12rem;color:var(--accent);margin-bottom:6px}
.liste-dossiers a span{font-size:.9rem;color:var(--doux)}.liste-dossiers .theme{font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--rouge);display:block;margin-bottom:4px}
@media (max-width:860px){.liste-dossiers{grid-template-columns:1fr 1fr}}@media (max-width:540px){.liste-dossiers{grid-template-columns:1fr}}
.video-a-venir{border:2px dashed var(--trait);border-radius:14px;padding:14px;color:var(--doux);font-size:.92rem;margin-top:18px}
"""


def e(t):
    return html.escape(t if isinstance(t, str) else ("" if t is None else str(t)), quote=True)


def nombre(x, d=0):
    if x is None:
        return "—"
    s = ("%." + str(d) + "f") % (x - 1e-6 if x > 0 else x + 1e-6)
    return s.replace(".", ",").replace("-", "−")


def md(x, signe=True):
    if x is None:
        return "—"
    return ("+" if signe and x > 0 else "") + nombre(x) + " Md€"


def page(titre, description, corps, scripts=""):
    return """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s</title>
<meta name="description" content="%s">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/redressement.css">
<link rel="stylesheet" href="/graphiques-site.css">
<style>%s</style>
</head>
<body>
<div class="proto">Version de travail : les chiffres sont des ordres de grandeur, publiés pour être contestés.</div>
<header><div class="page large">
  <a class="marque" href="/">Langagement politique</a>
  <nav></nav>
</div></header>
<main>
%s
</main>
<footer class="page" style="padding:28px 16px;color:var(--doux);font-size:.85rem">Texte sous licence CC BY-SA 4.0, code et données sous licence MIT. Version de travail. <a href="/detail.html">Modèles, sources et manifeste</a>.</footer>
<script src="/graphiques-site.js"></script>
%s
</body>
</html>
""" % (e(titre), e(description), CSS, corps, scripts)


def charger():
    dossier = os.path.join(CONTENU, "programmes")
    fiches = {}
    for f in sorted(os.listdir(dossier)):
        if f.endswith(".json"):
            d = json.load(open(os.path.join(dossier, f), encoding="utf-8"))
            fiches[d["id"]] = d
    return fiches


def dettes_reference():
    """Classement par dette 2038 de resultats-v2.md : {nom du programme: valeur}."""
    t = open(os.path.join(DEPOT, "modeles", "banc-programmes", "resultats-v2.md"), encoding="utf-8").read()
    m = re.search(r"\*\*Classement par dette 2038 \(médiane, taux fixe\)\*\* : (.*)", t)
    out = {}
    for nom, v in re.findall(r"([^;]+?) (\d+,\d) %", m.group(1)):
        out[nom.strip()] = float(v.replace(",", "."))
    return out


CORRESPONDANCE = {"langagement": "Notre système", "lr": "LR (Retailleau)", "ps": "PS et Place publique",
                  "gl": "Glucksmann, livret climat (chiffrage partiel)", "rn": "RN", "lfi": "LFI (programme complet)"}


def controler(fiches):
    """Écarts entre la dette 2038 des fiches et le classement du banc ; renvoie une liste d'erreurs."""
    ref, err = dettes_reference(), []
    for i, f in fiches.items():
        fin = f.get("finances") or {}
        v = fin.get("dette_2038_pct")
        r = ref.get(CORRESPONDANCE.get(i, ""))
        if v is not None and r is not None and abs(v - r) > 0.6:
            err.append("%s : dette 2038 %s dans la fiche, %s dans resultats-v2.md" % (i, v, r))
    return err


def badge(verdict, prefixe=""):
    lib, cls = VERDICTS.get(verdict or "sans objet", VERDICTS["sans objet"])
    if prefixe:
        lib = prefixe + " : " + lib[0].lower() + lib[1:]
    return '<span class="v %s">%s</span>' % (cls, lib)


def barres_dette(fiches):
    ref = dettes_reference()
    lignes = [["Notre programme", ref.get("Notre système"), "var(--accent)", None, nombre(ref.get("Notre système")) + " %"],
              ["Si rien ne change", ref.get("Fil de l'eau"), "var(--encre)", None, nombre(ref.get("Fil de l'eau")) + " %"]]
    for i in ORDRE[1:]:
        if i in fiches:
            v = ref.get(CORRESPONDANCE[i])
            lignes.append([fiches[i]["nom"].split(" (")[0] if i != "gl" else "Place publique (partiel)", v, "#8a8a8a", None, nombre(v) + " %"])
    lignes.sort(key=lambda r: r[1] or 0)
    return lignes


def comparer(fiches, nous):
    themes = nous["themes_libelles"]
    partis = [i for i in ORDRE[1:] if i in fiches]
    lignes_dette = barres_dette(fiches)
    tete = "".join('<th>%s</th>' % e(NOMS_COURTS[i]) for i in partis)
    corps_mat = []
    for k, lib in themes.items():
        if nous["themes"].get(k) is None:
            continue   # pas de position publiée de notre part : pas de verdict à afficher
        cases = []
        for i in partis:
            t = (fiches[i].get("themes") or {}).get(k) or {}
            cases.append('<td><a href="/comprendre/programme-%s.html#comparer" style="text-decoration:none" title="%s">%s%s</a></td>'
                         % (i, e(t.get("pourquoi")), badge(t.get("vision"), "But"), badge(t.get("methode"), "Méthode")))
        corps_mat.append('<tr><th class="theme">%s</th>%s</tr>' % (e(lib), "".join(cases)))
    cartes = []
    for i in partis:
        f = fiches[i]
        juste = "".join("<li>%s</li>" % e(x) for x in (f.get("ce_qui_est_juste") or [])[:3])
        vig = "".join("<li>%s</li>" % e(x) for x in (f.get("points_de_vigilance") or [])[:3])
        fin = f.get("finances") or {}
        cartes.append("""<article><h3>%s</h3><p>%s</p>
<p><b>Comptes :</b> %s par an sur le déficit en 2038 ; dette %s %% du PIB en 2038.</p>
<p><b>Ce qui est juste</b></p><ul>%s</ul><p><b>Points de vigilance</b></p><ul>%s</ul>
<a class="lien-suite" href="/comprendre/programme-%s.html">Comprendre ce programme →</a></article>""" % (
            e(f["nom"]), e(f.get("en_bref")), md(fin.get("effet_2038_md")), nombre(fin.get("dette_2038_pct")), juste, vig, i))
    corps = """<section class="ouverture"><div class="page">
  <p class="etiq">Comparer</p>
  <h1>Tous les programmes, la même règle. <span>Le nôtre aussi.</span></h1>
  <p>Pour chaque parti : ce qu'il coûte, et sur chaque grand sujet, si nous sommes d'accord avec lui sur le but, et sur la méthode. Nos accords sont dits aussi clairement que nos désaccords.</p>
</div></section>

<section class="bloc"><div class="page">
  <p class="etiq">Les comptes</p>
  <h2>La dette que chaque programme laisse en 2038.</h2>
  <p>Chaque économie ou recette annoncée passe trois questions : le mécanisme est-il décrit et mesuré ? un obstacle juridique peut-il le bloquer ? a-t-il déjà marché ailleurs ? Selon les réponses, on en retient de 10 %% à 100 %%. Les dépenses, elles, sont certaines. Aucun effet de croissance n'est crédité à personne.</p>
  <div class="graph"><svg data-graph="barres" data-lw="230" data-max="260" data-ref="157" data-lignes='%s' viewBox="0 0 640 %d" role="img" aria-label="Dette publique en 2038 selon les programmes"></svg>
  <p class="src">Notre simulateur, médianes de 10 000 tirages, dette en %% du PIB. <a href="https://github.com/pierreclr/langagement-politique/blob/main/modeles/banc-programmes/resultats-v2.md">Tous les résultats et les fourchettes →</a></p></div>
</div></section>

<section class="bloc"><div class="page">
  <p class="etiq">But et méthode</p>
  <h2>D'accord sur le but ? D'accord sur la méthode ?</h2>
  <p>Dans chaque case : partageons-nous le but du parti sur ce sujet, et sa méthode ? Cliquez pour le détail. Les sujets sur lesquels nous n'avons pas encore de position publiée n'y figurent pas.</p>
  <div class="matrice"><table><thead><tr><th>Sujet</th>%s</tr></thead><tbody>%s</tbody></table></div>
  <p class="cle"><span>%s</span><span>%s</span><span>%s</span><span>%s le parti n'a pas de position sur ce sujet</span></p>
</div></section>

<section class="bloc"><div class="page">
  <p class="etiq">Parti par parti</p>
  <div class="fiches">%s</div>
  <p class="note">Programmes non encore chiffrés : ceux qui n'ont pas publié de programme détaillé. Nous les ajouterons dès qu'ils le feront.</p>
</div></section>""" % (json.dumps(lignes_dette, ensure_ascii=False).replace("'", "&#39;"), 16 + 40 * len(lignes_dette), tete, "".join(corps_mat),
                       badge("accord"), badge("partiel"), badge("desaccord"), badge("sans objet"), "".join(cartes))
    return page("Comparer les programmes", "Tous les programmes chiffrés avec la même règle, le nôtre aussi : les comptes, et nos accords et désaccords sur le but et la méthode, sujet par sujet.", corps)


def page_programme(f, nous):
    fin = f.get("finances") or {}
    # annoncé par le parti et notre estimation (médiane, même règle pour tous, version 2 ; régénérée le 13/11/2026)
    mesures = "".join("<tr><td><b>%s</b><br><span class=\"note\">%s</span></td><td class=\"nb\">%s</td><td class=\"nb\">%s</td></tr>" % (
        e(m.get("titre")), e(m.get("detail")), md(m.get("annonce_md")), md(m.get("estimation_md"))) for m in (f.get("mesures") or []))
    themes = []
    for k, lib in nous["themes_libelles"].items():
        t = (f.get("themes") or {}).get(k) or {}
        themes.append("<tr><th>%s</th><td>%s</td><td>%s</td><td>%s<br>%s</td><td class=\"note\">%s</td></tr>" % (
            e(lib), e(t.get("eux") or "Pas de position publiée"), e(nous["themes"].get(k) or "Pas encore de position publiée"),
            badge(t.get("vision"), "But"), badge(t.get("methode"), "Méthode"), e(t.get("pourquoi"))))
    docs = "".join('<li>%s, %s (%s) : <a href="%s">%s</a></li>' % (e(d.get("titre")), e(d.get("date")), e(d.get("nature")), e(d.get("url")), e(d.get("url")))
                   for d in (f.get("documents") or []) if d.get("url"))
    juste = "".join("<li>%s</li>" % e(x) for x in (f.get("ce_qui_est_juste") or []))
    vig = "".join("<li>%s</li>" % e(x) for x in (f.get("points_de_vigilance") or []))
    video = ('<div class="video-a-venir">La vidéo de ce dossier arrive bientôt.</div>' if not f.get("video") else
             '<p><a class="bouton" href="%s">Voir la vidéo →</a></p>' % e(f["video"]))
    corps = """<section class="ouverture"><div class="page">
  <p class="etiq">Comprendre · Les programmes</p>
  <h1>Le programme de %s</h1>
  <p>%s</p>
  <p class="note">Candidat : %s. Fiche mise à jour le %s. Nous sommes partie prenante : nous disons aussi ce qui est juste dans ce programme.</p>
  <div class="onglets" role="tablist"><button role="tab" aria-selected="true" data-panneau="programme">Le programme</button><button role="tab" aria-selected="false" data-panneau="comparer">Comparé au nôtre</button></div>
</div></section>

<div class="panneau" id="p-programme"><section class="bloc"><div class="page">
  <div class="fiches"><article><h3>Le but</h3><p>%s</p></article><article><h3>La méthode</h3><p>%s</p></article></div>
  <div class="chiffres4">
    <div><b>%s</b><span>par an sur le déficit, en 2032</span></div>
    <div><b>%s</b><span>par an sur le déficit, en 2038</span></div>
    <div><b>%s %%</b><span>de déficit en 2038</span></div>
    <div><b>%s %%</b><span>de dette en 2038 (157 %% si rien ne change)</span></div>
  </div>
  <p class="note">%s + : réduit le déficit ; − : l'augmente. Notre simulateur, même règle pour tous.</p>
  <h2 style="margin-top:34px">Les principales mesures</h2>
  <div class="tableau"><table><thead><tr><th>Mesure</th><th>Annoncé par le parti</th><th>Notre estimation</th></tr></thead><tbody>%s</tbody></table></div>
  <p class="note">Md€ par an, une fois la mesure appliquée ; + réduit le déficit, − l'augmente. Notre estimation est la médiane de nos simulations, avec la même règle pour tous ; la somme des lignes n'est pas exactement le total, parce que les incertitudes ne sont pas symétriques. <a href="https://github.com/pierreclr/langagement-politique/blob/main/modeles/banc-programmes/%s">Chaque mesure, ligne par ligne →</a></p>
  <div class="fiches" style="margin-top:26px"><article><h3>Ce qui est juste</h3><ul>%s</ul></article><article><h3>Points de vigilance</h3><ul>%s</ul></article></div>
  %s
  <h2 style="margin-top:34px">Les documents lus</h2><ul class="sources">%s</ul>
</div></section></div>

<div class="panneau" id="p-comparer" hidden><section class="bloc"><div class="page">
  <h2>Sujet par sujet, comparé à notre programme</h2>
  <p>Pour chaque sujet : leur position, la nôtre, puis si nous partageons leur but et leur méthode.</p>
  <div class="tableau"><table style="min-width:760px"><thead><tr><th>Sujet</th><th>%s</th><th>Nous</th><th>But · méthode</th><th>Pourquoi</th></tr></thead><tbody>%s</tbody></table></div>
  <a class="lien-suite" href="/comparer.html">Tous les partis côte à côte →</a>
</div></section></div>""" % (
        e(f["nom"]), e(f.get("en_bref")), e(f.get("candidat")), e(f.get("date")), e(f.get("vision")), e(f.get("methode")),
        md(fin.get("effet_2032_md")), md(fin.get("effet_2038_md")), nombre(fin.get("deficit_2038_pct"), 1), nombre(fin.get("dette_2038_pct")),
        e(fin.get("lecture") or ""), mesures, e(f.get("detail") or "detail-%s.md" % ("glucksmann" if f["id"] == "gl" else f["id"])), juste, vig, video, docs,
        e(NOMS_COURTS.get(f["id"], f["nom"])), "".join(themes))
    script = """<script>(function(){var b=document.querySelectorAll('.onglets button');function ouvrir(n){b.forEach(function(x){var on=x.dataset.panneau===n;x.setAttribute('aria-selected',on);document.getElementById('p-'+x.dataset.panneau).hidden=!on})}
b.forEach(function(x){x.addEventListener('click',function(){ouvrir(x.dataset.panneau);history.replaceState(null,'','#'+x.dataset.panneau)})});if(location.hash==='#comparer')ouvrir('comparer')})()</script>"""
    return page("Le programme de " + f["nom"], "Comprendre le programme de %s : ce qu'il propose, ce qu'il coûte, et comment il se compare au nôtre." % f["nom"], corps, script)


def comprendre(fiches, dossiers):
    progs = [{"titre": "Le programme de " + fiches[i]["nom"], "url": "/comprendre/programme-%s.html" % i, "theme": "Les programmes",
              "resume": fiches[i].get("en_bref", "")[:160]} for i in ORDRE[1:] if i in fiches]
    tous = dossiers + progs
    groupes = {}
    for d in tous:
        groupes.setdefault(d["theme"], []).append(d)
    blocs = []
    for th, ds in groupes.items():
        cartes = "".join('<a href="%s"><span class="theme">%s</span><b>%s</b><span>%s</span></a>' % (e(d["url"]), e(th), e(d["titre"]), e(d.get("resume")))
                         for d in ds)
        blocs.append('<h2 style="margin-top:34px">%s</h2><div class="liste-dossiers">%s</div>' % (e(th), cartes))
    urls = json.dumps([d["url"] for d in tous])
    corps = """<section class="ouverture"><div class="page">
  <p class="etiq">Comprendre</p>
  <h1>Les grands sujets, <span>expliqués avec les faits.</span></h1>
  <p>Sur les sujets qui inquiètent ou qui divisent, des dossiers qui remettent les faits au milieu : les chiffres, la chronologie, ce qui est établi et ce qui est débattu, les positions de chacun, et les sources.</p>
  <button type="button" class="bouton" id="hasard" style="border:0;cursor:pointer">Un sujet au hasard</button>
</div></section>
<section class="bloc"><div class="page">%s</div></section>""" % "".join(blocs)
    script = "<script>document.getElementById('hasard').addEventListener('click',function(){var u=%s;location.href=u[Math.floor(Math.random()*u.length)]})</script>" % urls
    return page("Comprendre", "Des dossiers pour comprendre les grands sujets : la dette, les retraites, les programmes des partis, et d'autres, avec les faits et les sources.", corps, script)


def verifier(verifs):
    cartes = "".join('<a href="%s"><span class="theme">%s · %s</span><b>%s</b><span>%s</span></a>' % (
        e(v["url"]), e(v.get("qui")), e(v.get("date")), e(v["titre"]), e(v.get("resume"))) for v in verifs)
    corps = """<section class="ouverture"><div class="page">
  <p class="etiq">Vérifier</p>
  <h1>Ce qui est dit, <span>vérifié point par point.</span></h1>
  <p>Des déclarations, des vidéos, des chiffres qui circulent : ce qui est vrai, ce qui est faux, ce qui est omis, avec les sources pour que chacun puisse refaire la vérification. Tous les bords, nous compris : une erreur dans nos chiffres se signale <a href="https://github.com/pierreclr/langagement-politique/issues">ici</a>.</p>
</div></section>
<section class="bloc"><div class="page"><div class="liste-dossiers">%s</div></div></section>""" % cartes
    return page("Vérifier", "Des déclarations et des vidéos politiques vérifiées point par point : ce qui est vrai, ce qui est faux, ce qui est omis, avec les sources.", corps)


PANS = ["Finances publiques et dette", "Retraites et vieillissement", "Démographie et société", "Impôts, patrimoine et héritage", "Logement",
        "État et services publics", "Travail, économie et industrie", "Technologie, IA et énergie", "Démocratie et opinion"]
STATUTS = {"conclue": ("Conclue", "v-accord"), "en cours": ("En cours", "v-partiel"), "écartée": ("Écartée", "v-sans"), "à vérifier": ("À vérifier", "v-partiel")}


def etudes(liste, slugs_publies):
    """Page « Nos études » (13/11/2026) : chaque étude et chaque modèle, au même format, rangés par grand thème."""
    par_pan = {}
    for x in liste:
        par_pan.setdefault(x.get("pan") if x.get("pan") in PANS else "Démocratie et opinion", []).append(x)
    puces, blocs = [], []
    for k, pan in enumerate([p for p in PANS if p in par_pan]):
        ancre = "pan-%d" % k
        puces.append('<a href="#%s">%s <span class="note">(%d)</span></a>' % (ancre, e(pan), len(par_pan[pan])))
        cartes = []
        for x in par_pan[pan]:
            lib, cls = STATUTS.get(x.get("statut"), ("", "v-sans"))
            liens = []
            if x.get("dossier"):
                d = x["dossier"] if x["dossier"].endswith((".html", "/")) else x["dossier"] + ".html"
                liens.append('<a href="%s">Le dossier pour comprendre →</a>' % e(d))
            if x.get("modele") and x["modele"] in slugs_publies:
                liens.append('<a href="/fr/modeles/%s/">Le modèle complet : hypothèses, calculs, code →</a>' % e(x["modele"]))
            cartes.append("""<article class="etude-carte"><p><span class="v %s">%s</span> <span class="note">%s</span></p>
<h3>%s</h3><p>%s</p>
<details><summary>Ce qu'on peut conclure, et ce qu'on ne peut pas</summary><p><b>On peut conclure :</b> %s</p><p><b>On ne peut pas conclure :</b> %s</p></details>
<p class="liens">%s</p></article>""" % (cls, e(lib), e(x.get("date")), e(x.get("question")), e(x.get("trouve")), e(x.get("conclure")), e(x.get("pas_conclure")), " ".join(liens)))
        blocs.append('<section class="bloc" id="%s"><div class="page"><p class="etiq">%s</p><div class="etudes-grille">%s</div></div></section>' % (ancre, e(pan), "".join(cartes)))
    corps = """<section class="ouverture"><div class="page">
  <p class="etiq">Nos études</p>
  <h1>Ce qu'on a cherché, <span>ce qu'on a trouvé.</span></h1>
  <p>%d études : chaque chiffre du site vient de l'une d'elles. Pour chacune, la question, le résultat, ce qu'on peut et ne peut pas en conclure, et le modèle complet pour refaire le calcul. Des ordres de grandeur sous hypothèses, jamais des prédictions. Une erreur, une meilleure hypothèse ? <a href="https://github.com/pierreclr/langagement-politique/issues">Dites-le-nous</a>.</p>
  <nav class="sommaire-accueil" aria-label="Thèmes">%s</nav>
</div></section>
%s""" % (len(liste), "".join(puces), "".join(blocs))
    css = ("<style>.etudes-grille{display:grid;grid-template-columns:1fr 1fr;gap:14px}.etude-carte{background:var(--surface);border:1px solid var(--trait);"
           "border-radius:14px;padding:16px 18px}.etude-carte h3{font-family:var(--serif);font-size:1.15rem;margin:6px 0 8px;line-height:1.3}"
           ".etude-carte p{font-size:.95rem;margin:0 0 8px}.etude-carte details{margin-top:6px}.etude-carte .liens a{display:block;font-weight:600;font-size:.9rem;"
           "text-decoration:none;margin-top:4px}@media (max-width:760px){.etudes-grille{grid-template-columns:1fr}}"
           ".sommaire-accueil{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.sommaire-accueil a{border:1px solid var(--trait);border-radius:999px;"
           "padding:6px 12px;font-size:.88rem;text-decoration:none;font-weight:600;background:var(--surface)}</style>")
    return page("Nos études", "Toutes nos études, rangées par thème : la question, ce qu'on a trouvé, ce qu'on peut et ne peut pas conclure, et le modèle pour refaire le calcul.", css + corps)


def construire(sortie):
    """Écrit les pages ; renvoie [(chemin relatif, entrée de menu courante)] et la liste des erreurs de contrôle."""
    fiches = charger()
    nous = fiches.pop("langagement")
    erreurs = controler(fiches)
    dossiers = json.load(open(os.path.join(CONTENU, "comprendre.json"), encoding="utf-8"))
    verifs = json.load(open(os.path.join(CONTENU, "verifications.json"), encoding="utf-8"))
    os.makedirs(os.path.join(sortie, "comprendre"), exist_ok=True)
    os.makedirs(os.path.join(sortie, "verifier"), exist_ok=True)
    pages = [("comparer.html", comparer(fiches, nous), "Comparer"),
             ("comprendre/index.html", comprendre(fiches, dossiers), "Comprendre"),
             ("verifier/index.html", verifier(verifs), "Vérifier")]
    for i, f in fiches.items():
        pages.append(("comprendre/programme-%s.html" % i, page_programme(f, nous), "Comprendre"))
    f_etudes = os.path.join(CONTENU, "etudes.json")
    if os.path.exists(f_etudes):   # « Nos études » générée (sinon la page écrite à la main reste)
        slugs = set(os.listdir(os.path.join(sortie, "fr", "modeles"))) if os.path.isdir(os.path.join(sortie, "fr", "modeles")) else set()
        pages.append(("etudes.html", etudes(json.load(open(f_etudes, encoding="utf-8")), slugs), "La méthode"))
    genere = os.path.join(ICI, "genere")
    for chemin, texte, _ in pages:
        for base in (sortie, genere):
            os.makedirs(os.path.dirname(os.path.join(base, chemin)), exist_ok=True)
            open(os.path.join(base, chemin), "w", encoding="utf-8").write(texte)
    return [(c, m) for c, _, m in pages], erreurs
