# -*- coding: utf-8 -*-
# Extraction des 465 fiches du tome II des Voies et moyens (PLF 2026) depuis vmt2.txt (texte pypdf du PDF) ; ecrit fiches.json dans le dossier courant.
import re,json,math,csv
t=open('vmt2.txt').read()
pages=re.split(r'\n=====PAGE (\d+)=====\n',t)
# pages[1::2] numbers, [2::2] text
recs=[]
cur=None
def fix(s):
    s=s.replace('contri buables','contribuables')
    return re.sub(r'\s+',' ',s).strip()
items=[]
for pn,tx in zip(pages[1::2],pages[2::2]):
    pn=int(pn)
    if pn<48: continue
    for m in re.finditer(r'^(\d{6}) [–-] (.*?)(?=^Finalité)',tx,re.M|re.S):
        items.append((pn,m.start(),m.group(1),fix(m.group(2))))
# simpler: build full text from page 48 on, parse sequentially
full=''
pagepos=[]
for pn,tx in zip(pages[1::2],pages[2::2]):
    if int(pn)<48: continue
    pagepos.append((len(full),int(pn)))
    full+=tx+'\n'
def pageof(pos):
    p=None
    for s,n in pagepos:
        if s<=pos:p=n
    return p
starts=[(m.start(),m.group(1)) for m in re.finditer(r'^(\d{6}) [–-] ',full,re.M)]
def num(tok):
    return tok
def split3(rest):
    toks=rest.split()
    # keep until non-token
    vals=[]
    # candidates
    best=None
    n=len(toks)
    def isnum(x):return re.fullmatch(r'\d{1,3}',x) is not None
    def rec(i,acc):
        nonlocal best
        if len(acc)==3:
            if i==n:
                # score
                nums=[a for a in acc if isinstance(a,int)]
                sc=0
                for a,b in zip(nums,nums[1:]):
                    sc+=abs(math.log((a+1)/(b+1)))
                if best is None or sc<best[0]: best=(sc,list(acc))
            return
        if i>=n:return
        x=toks[i]
        if x in('ε','nc','-'):
            rec(i+1,acc+[x]);return
        if isnum(x):
            v=x;j=i+1
            rec(j,acc+[int(v)])
            while j<n and re.fullmatch(r'\d{3}',toks[j]):
                v+=toks[j];j+=1
                rec(j,acc+[int(v)])
    rec(0,[])
    return best[1] if best else None
out=[]
for k,(pos,i) in enumerate(starts):
    end=starts[k+1][0] if k+1<len(starts) else len(full)
    blk=full[pos:end]
    pg=pageof(pos)
    m=re.match(r'(\d{6}) [–-] (.*?)\n\s*(?:Finalité|Impact budgétaire)',blk,re.S)
    if not m:
        print('NOMATCH',repr(blk[:300]));continue
    title=fix(m.group(2))
    mm=re.search(r'Finalité\s*:?(.*?)\nImpact budgétaire',blk,re.S)
    fin=fix(mm.group(1)) if mm else ''
    imp=re.search(r'2024 2025 2026[^\n]*\n([^\n]*)',blk)
    vals=None;fi=''
    if imp:
        line=imp.group(1)
        parts=re.split(r'\s{2,}',line)
        rest=parts[0]
        vals=split3(rest)
        fi=''
        mf=re.search(r"Fin d'incidence budgétaire (non bornée|\d{4})",line); fi=mf.group(1) if mf else ''
    cr=re.search(r'Création (\S+(?: \S+)?)',blk)
    mod=re.search(r'Modification (\d{4}|\S+)',blk)
    ben=re.search(r'Bénéficiaires\s*(.*?)\n\s*Fiabilité',blk,re.S)
    fia=re.search(r'Fiabilité du réalisé[ \t]*([^\n]*)\n',blk)
    nor=re.search(r'Norme fiscale de référence\s*(.*?)\n(?=Méthode)',blk,re.S)
    met=re.search(r'Méthode de chiffrage\s*(.*?)\n',blk)
    cgi=re.search(r'Référence (?:code général des impôts|[^\n]*?)\s*(.*?)\nMission',blk,re.S)
    mis=re.search(r'Mission et programme\s*(.*?)\n\s*\n',blk,re.S)
    out.append(dict(id=i,page=pg,title=title,finalite=fin,vals=vals,fin_incidence=fi,
        creation=cr.group(1) if cr else '',
        benef=fix(ben.group(1)) if ben else '',fiab=fia.group(1).strip() if fia else '',
        norme=fix(nor.group(1)) if nor else '',methode=met.group(1).strip() if met else '',
        cgi=fix(cgi.group(1)) if cgi else '',mission=fix(mis.group(1)) if mis else ''))
json.dump(out,open('fiches.json','w'),ensure_ascii=False,indent=0)
print(len(out), sum(1 for o in out if not o['vals']))
import collections
print(collections.Counter(o['id'][:2] for o in out))
for o in out[:3]+out[200:203]: print(o)
