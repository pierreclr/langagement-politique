# -*- coding: utf-8 -*-
import zipfile,re,sys
import xml.etree.ElementTree as ET
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def read(path):
    global ns
    z=zipfile.ZipFile(path)
    root=ET.fromstring(z.read('xl/workbook.xml')); u=root.tag[1:].split('}')[0]
    ns={'m':u}
    RN='http://purl.oclc.org/ooxml/officeDocument/relationships' if 'purl' in u else 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    ss=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',ns):
            ss.append(''.join(t.text or '' for t in si.iter('{%s}t'%ns['m'])))
    wb=ET.fromstring(z.read('xl/workbook.xml'))
    rels=ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rm={r.get('Id'):r.get('Target') for r in rels}
    out={}
    for s in wb.find('m:sheets',ns):
        rid=s.get('{%s}id'%RN)
        t=rm[rid]; t=t.lstrip('/'); t=t if t.startswith('xl/') else 'xl/'+t
        rows=[]
        for r in ET.fromstring(z.read(t)).iter('{%s}row'%ns['m']):
            row={}
            for c in r.findall('m:c',ns):
                v=c.find('m:v',ns)
                if v is None:
                    is_=c.find('m:is',ns)
                    if is_ is None: continue
                    val=''.join(x.text or '' for x in is_.iter('{%s}t'%ns['m']))
                else:
                    val=ss[int(v.text)] if c.get('t')=='s' else v.text
                col=re.match(r'[A-Z]+',c.get('r')).group()
                row[col]=val
            rows.append((int(r.get('r')),row))
        out[s.get('name')]=rows
    return out
if __name__=='__main__':
    d=read(sys.argv[1])
    for n,rows in d.items():
        if len(sys.argv)>2 and n not in sys.argv[2:]: continue
        print('=====',n,len(rows))
        for i,r in rows[:int(40)]: print(i,r)
