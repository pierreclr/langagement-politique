/* Graphiques et calculateurs du site (accueil, constat, programme), 13/11/2026. Chaque graphique ne se dessine que si son élément est sur la page. */
(function(f){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",f);else f()})(function(){
var NS="http://www.w3.org/2000/svg";
function el(p,n,a,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t!==undefined)e.textContent=t;p.appendChild(e);return e}
function fr(x,d){return x.toLocaleString("fr-FR",{minimumFractionDigits:d||0,maximumFractionDigits:d||0})}
function cv(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||"#1f3b8f"}
var BLEU="var(--accent)",ROUGE="var(--rouge)",TRAIT="var(--trait)";


/* 0. Trajectoire si rien ne change : [année, dette en % du PIB, intérêts en % du PIB] */
var TR=[[2026, 118.1, 2.35], [2027, 120.7, 2.59], [2028, 123.5, 2.83], [2029, 126.4, 3.05], [2030, 129.5, 3.26], [2031, 132.6, 3.46], [2032, 135.9, 3.66], [2033, 139.2, 3.85], [2034, 142.6, 4.03], [2035, 146.2, 4.21], [2036, 149.7, 4.39], [2037, 153.4, 4.56], [2038, 157.1, 4.73], [2039, 160.9, 4.9], [2040, 164.7, 5.06], [2041, 168.6, 5.22], [2042, 172.5, 5.39], [2043, 176.5, 5.54], [2044, 180.5, 5.7], [2045, 184.6, 5.86], [2046, 188.7, 6.01], [2047, 192.8, 6.17], [2048, 197.0, 6.32], [2049, 201.2, 6.48], [2050, 205.4, 6.63]];
(function(){var s=document.getElementById("g-trajectoire"),L=46,R=46,W=640-L-R,H=200,T0=12;if(!s)return;
 function X(a){return L+W*(a-2026)/24}function Yd(v){return T0+H-H*(v-100)/120}function Yi(v){return T0+H-H*v/8}
 [100,140,180,220].forEach(function(v){el(s,"line",{x1:L,x2:L+W,y1:Yd(v),y2:Yd(v),stroke:TRAIT});el(s,"text",{x:L-6,y:Yd(v),"text-anchor":"end","dominant-baseline":"middle","font-size":11,class:"doux"},v+" %")});
 [0,2,4,6,8].forEach(function(v){el(s,"text",{x:L+W+6,y:Yi(v),"dominant-baseline":"middle","font-size":11,class:"doux"},v+" %")});
 [2026,2030,2038,2045,2050].forEach(function(a){el(s,"text",{x:X(a),y:T0+H+16,"text-anchor":"middle","font-size":11,class:"doux"},a)});
 var d1="",d2="";TR.forEach(function(r,k){d1+=(k?"L":"M")+X(r[0])+","+Yd(r[1]);d2+=(k?"L":"M")+X(r[0])+","+Yi(r[2]);});
 el(s,"path",{d:d1,fill:"none",stroke:ROUGE,"stroke-width":3});el(s,"path",{d:d2,fill:"none",stroke:BLEU,"stroke-width":3});
 var a=TR[0],b=TR[TR.length-1];
 el(s,"text",{x:X(b[0])-4,y:Yd(b[1])-16,"text-anchor":"end","font-size":13,"font-weight":700},fr(b[1])+" % de dette");
 el(s,"text",{x:X(b[0])-4,y:Yi(b[2])+34,"text-anchor":"end","font-size":13,"font-weight":700},fr(b[2],1)+" % d'intérêts");
 el(s,"text",{x:X(a[0])+4,y:Yd(a[1])-8,"font-size":12},fr(a[1])+" %");el(s,"text",{x:X(a[0])+4,y:Yi(a[2])-8,"font-size":12},fr(a[2],1)+" %");
})();

/* concentration du patrimoine */
(function(){var s=document.getElementById("g-concentration");if(!s)return;[["10 % les mieux dotés",48,ROUGE],["50 % les moins dotés",7,BLEU]].forEach(function(d,i){var x=50+i*140,hh=d[1]/55*140;
 el(s,"rect",{x:x,y:170-hh,width:80,height:hh,rx:6,fill:d[2]});
 el(s,"text",{x:x+40,y:162-hh,"text-anchor":"middle","font-size":20,"font-weight":700},d[1]+" %");
 el(s,"text",{x:x+40,y:190,"text-anchor":"middle","font-size":11.5,class:"doux"},d[0]);});})();

/* propriétaires par âge */
(function(){var s=document.getElementById("g-proprio"),D=[["<30",17.2],["30-39",47.7],["40-49",57.0],["50-59",61.6],["60-69",63.1],["70+",71.3]];if(!s)return;
 D.forEach(function(d,i){var x=14+i*50,hh=d[1]/80*140;el(s,"rect",{x:x,y:170-hh,width:38,height:hh,rx:4,fill:i?BLEU:ROUGE});
 el(s,"text",{x:x+19,y:164-hh,"text-anchor":"middle","font-size":12,"font-weight":700},fr(d[1]));
 el(s,"text",{x:x+19,y:188,"text-anchor":"middle","font-size":11,class:"doux"},d[0]);});})();

/* 1. Pyramide : [âge, hommes 2026, hommes 2070, femmes 2026, femmes 2070], milliers */
var P=[[0,1663,1153,1591,1091],[5,1937,1301,1839,1219],[10,2147,1471,2051,1370],[15,2223,1622,2077,1484],[20,2013,1591,1922,1471],[25,2001,1592,1994,1532],[30,2007,1675,2060,1644],[35,2136,1749,2222,1720],[40,2131,1830,2243,1803],[45,2090,2050,2157,2023],[50,2205,2192,2255,2163],[55,2177,2293,2255,2287],[60,2108,2230,2238,2229],[65,1887,2122,2105,2170],[70,1680,1995,1981,2102],[75,1508,1815,1855,1994],[80,823,1611,1109,1867],[85,516,1255,838,1541],[90,239,741,527,982],[95,59,331,211,564]];
(function(){var s=document.getElementById("g-pyramide"),cx=320,h=20,max=2400,w=260,top=10;if(!s)return;
 P.forEach(function(r,i){var y=top+(P.length-1-i)*h,bh=h-4;
  el(s,"rect",{x:cx-24-w*r[1]/max,y:y,width:w*r[1]/max,height:bh,fill:BLEU,opacity:.85});
  el(s,"rect",{x:cx+24,y:y,width:w*r[3]/max,height:bh,fill:ROUGE,opacity:.85});
  el(s,"rect",{x:cx-24-w*r[2]/max,y:y,width:w*r[2]/max,height:bh,fill:"none",stroke:"var(--encre)","stroke-width":1.4});
  el(s,"rect",{x:cx+24,y:y,width:w*r[4]/max,height:bh,fill:"none",stroke:"var(--encre)","stroke-width":1.4});
  el(s,"text",{x:cx,y:y+bh-3,"text-anchor":"middle","font-size":10,class:"doux"},r[0]===95?"95+":r[0]);});
 el(s,"text",{x:cx-24,y:top+P.length*h+16,"text-anchor":"end","font-size":12,class:"doux"},"Hommes");
 el(s,"text",{x:cx+24,y:top+P.length*h+16,"font-size":12,class:"doux"},"Femmes");
})();

/* barres horizontales simples */
function barres(id,data,opt){var s=document.getElementById(id);if(!s)return;var lw=opt.lw||210,W=640-lw-80,h=opt.h||34,max=opt.max;
 data.forEach(function(d,i){var y=8+i*h;
  el(s,"text",{x:lw-10,y:y+h/2,"text-anchor":"end","font-size":13,"dominant-baseline":"middle"},d[0]);
  if(d[1]>0)el(s,"rect",{x:lw,y:y+5,width:W*d[1]/max,height:h-12,rx:4,fill:d[2]||BLEU});
  if(d[3])el(s,"rect",{x:lw+W*d[3][0]/max,y:y+h/2-1,width:W*(d[3][1]-d[3][0])/max,height:2,fill:"var(--encre)"});
  el(s,"text",{x:lw+W*Math.max(d[1],d[3]?d[3][1]:0)/max+8,y:y+h/2,"font-size":13,"font-weight":700,"dominant-baseline":"middle"},d[4]);
 });
 if(opt.ref){var x=lw+W*opt.ref/max;el(s,"line",{x1:x,x2:x,y1:2,y2:8+data.length*h,stroke:"var(--encre)","stroke-dasharray":"4 3"});}
}

/* 2. Cotisants par retraité */
(function(){var s=document.getElementById("g-ratio");if(!s)return;[[2025,1.77],[2070,1.30]].forEach(function(d,i){var x=60+i*140,hh=d[1]/1.9*140;
 el(s,"rect",{x:x,y:170-hh,width:80,height:hh,rx:6,fill:i?ROUGE:BLEU});
 el(s,"text",{x:x+40,y:162-hh,"text-anchor":"middle","font-size":20,"font-weight":700},fr(d[1],2));
 el(s,"text",{x:x+40,y:190,"text-anchor":"middle","font-size":13,class:"doux"},d[0]);});})();

/* 3. Emplois privés et revenus publics */
(function(){var s=document.getElementById("g-public");if(!s)return;[["Emplois privés",23.6,BLEU],["Revenus publics",28.1,ROUGE]].forEach(function(d,i){var x=60+i*140,hh=d[1]/30*140;
 el(s,"rect",{x:x,y:170-hh,width:80,height:hh,rx:6,fill:d[2]});
 el(s,"text",{x:x+40,y:162-hh,"text-anchor":"middle","font-size":18,"font-weight":700},fr(d[1],1)+" M");
 el(s,"text",{x:x+40,y:190,"text-anchor":"middle","font-size":12,class:"doux"},d[0]);});})();

/* 4. Patrimoine : barres empilées */
(function(){var s=document.getElementById("g-patrimoine"),lw=170,W=640-lw-10,cols=["#9db4d8","#5f7fbf",BLEU];if(!s)return;
 [["Part des ménages",[24,36,40]],["Part du patrimoine net",[9,38,53]]].forEach(function(r,i){var y=14+i*70,x=lw;
  el(s,"text",{x:lw-10,y:y+22,"text-anchor":"end","font-size":13,"dominant-baseline":"middle"},r[0]);
  r[1].forEach(function(v,j){el(s,"rect",{x:x,y:y,width:W*v/100,height:44,fill:cols[j]});
   el(s,"text",{x:x+W*v/200,y:y+22,"text-anchor":"middle","dominant-baseline":"middle","font-size":14,"font-weight":700,fill:j?"#fff":"#1d1c1a",style:"fill:"+(j?"#fff":"#1d1c1a")},v+" %");x+=W*v/100;});});})();

/* 5. Vote */
barres("g-vote",[["18-34 ans",24,ROUGE,null,"24 %"],["50-69 ans",9,BLEU,null,"9 %"]],{max:30,lw:150,h:40});
(function(){var s=document.getElementById("g-vote");if(!s)return;el(s,"text",{x:150,y:110,"font-size":12,class:"doux"},"Part des inscrits qui n'ont voté à aucun tour en 2022 (présidentielle et législatives)");})();

/* 6. Âge de départ */
barres("g-age",[["RN, retour à 62 ans",24.1,"#8a8a8a",[18.3,31.1],"≈ 24 Md€"],["LFI, retour à 60 ans",55.2,"#8a8a8a",[43.6,69.3],"≈ 55 Md€"],["Notre plan, 64 ans inchangé",0,BLEU,null,"0"]],{max:80,lw:220,h:44});

/* 7. Dette 2038 */
barres("g-dette",[["Notre programme",148,BLEU,null,"148 %"],["LR (Retailleau)",149,"#8a8a8a",null,"149 %"],["Si rien ne change",157,"var(--encre)",null,"157 %"],["PS et Place publique",163,"#8a8a8a",null,"163 %"],["LFI, budget de 1re année seul",170,"#b5b5b5",null,"170 %"],["RN",175,"#8a8a8a",null,"175 %"],["LFI, programme complet",241,"#8a8a8a",null,"241 %"]],{max:260,lw:220,h:40,ref:157});

/* 8. Redresser */
barres("g-redresser",[["Fin des niches fiscales",18.7,BLEU,null,"≈ 19 Md€"],["Grand ménage (2038)",5,BLEU,null,"≈ 5 Md€"]],{max:25,lw:200,h:44});

/* 9. Fonction des revenus */
var A=0.6515,S=412.5,M0=0.20,K=1500;
function C(R){return A*R-S-(A-M0)*K*(1-Math.exp(-R/K))}
function m(R){return A-(A-M0)*Math.exp(-R/K)}
(function(){var s=document.getElementById("g-revenus"),L=50,W=570,H=170,T=10,RM=15000,pm=0.7;if(!s)return;
 function X(r){return L+W*r/RM}function Y(t){return T+H-H*t/pm}
 [0,.2,.4,.6].forEach(function(t){el(s,"line",{x1:L,x2:L+W,y1:Y(t),y2:Y(t),stroke:TRAIT});el(s,"text",{x:L-6,y:Y(t),"text-anchor":"end","dominant-baseline":"middle","font-size":11,class:"doux"},fr(t*100)+" %")});
 [0,5000,10000,15000].forEach(function(r){el(s,"text",{x:X(r),y:T+H+16,"text-anchor":"middle","font-size":11,class:"doux"},fr(r)+" €")});
 var d1="",d2="";for(var r=0;r<=RM;r+=100){d1+=(r?"L":"M")+X(r)+","+Y(m(r));if(r>=600)d2+=(d2?"L":"M")+X(r)+","+Y(Math.max(0,C(r)/r));}
 el(s,"path",{d:d1,fill:"none",stroke:ROUGE,"stroke-width":2.5});el(s,"path",{d:d2,fill:"none",stroke:BLEU,"stroke-width":2.5});
 var pt=el(s,"circle",{r:6,fill:ROUGE}),ln=el(s,"line",{y1:T,y2:T+H,stroke:"var(--encre)","stroke-dasharray":"3 3"});
 var inp=document.getElementById("c-r");if(!inp)return;
 function maj(){var R=+inp.value,c=C(R);document.getElementById("c-r-v").textContent=fr(R)+" €";
  document.getElementById("c-r-c").textContent=fr(Math.abs(c))+" €";
  document.getElementById("c-r-l").textContent=c<0?"vous recevez chaque mois":"vous payez chaque mois";
  document.getElementById("c-r-n").textContent=fr(R-c)+" €";document.getElementById("c-r-m").textContent=fr(m(R)*100,1)+" %";
  pt.setAttribute("cx",X(R));pt.setAttribute("cy",Y(m(R)));ln.setAttribute("x1",X(R));ln.setAttribute("x2",X(R));}
 inp.addEventListener("input",maj);maj();})();

/* 10. Fonction du patrimoine */
(function(){var rp=document.getElementById("c-rp"),w=document.getElementById("c-w");if(!rp)return;
 function maj(){var v=+rp.value,o=+w.value,W=Math.max(0,v-1e6)+o,prp=0.0025*Math.min(v,1e6),pw=W>0?0.0125*W*W/(W+7e5):0,tot=v+o;
  document.getElementById("c-rp-v").textContent=fr(v)+" €";document.getElementById("c-w-v").textContent=fr(o)+" €";
  document.getElementById("c-p-rp").textContent=fr(prp)+" €";document.getElementById("c-p-w").textContent=fr(pw)+" €";
  document.getElementById("c-p-t").textContent=tot?fr(100*(prp+pw)/tot,2)+" %":"0 %";}
 rp.addEventListener("input",maj);w.addEventListener("input",maj);maj();})();

/* 11. Schéma de la foncière */
(function(){var s=document.getElementById("g-fonciere"),b=[[20,20,"1. Vous choisissez","un logement, au premier","emploi stable"],[230,20,"2. Vous payez l'usage","à vie, sans apport,","moins cher qu'un loyer"],[440,20,"3. La foncière paie","le reste du prix","et reste propriétaire"],[440,150,"4. Vous y vivez","toute votre vie","comme chez vous"],[230,150,"5. Le logement revient","à la foncière : il","ne s'hérite pas"],[20,150,"6. Il sert à","un autre jeune",""]];if(!s)return;
 var def=el(s,"defs",{}),mk=el(def,"marker",{id:"fl",viewBox:"0 0 10 10",refX:9,refY:5,markerWidth:7,markerHeight:7,orient:"auto"});el(mk,"path",{d:"M0,0L10,5L0,10z",fill:"var(--doux)"});
 b.forEach(function(r){el(s,"rect",{x:r[0],y:r[1],width:180,height:90,rx:12,fill:"var(--accent-doux)",stroke:"var(--accent)"});
  el(s,"text",{x:r[0]+90,y:r[1]+30,"text-anchor":"middle","font-size":14,"font-weight":700},r[2]);
  el(s,"text",{x:r[0]+90,y:r[1]+52,"text-anchor":"middle","font-size":12.5},r[3]);el(s,"text",{x:r[0]+90,y:r[1]+70,"text-anchor":"middle","font-size":12.5},r[4]);});
 [[200,65,230,65],[410,65,440,65],[530,110,530,150],[440,195,410,195],[230,195,200,195],[110,150,110,110]].forEach(function(a){el(s,"line",{x1:a[0],y1:a[1],x2:a[2]-(a[2]>a[0]?2:a[2]<a[0]?-2:0),y2:a[3]-(a[3]>a[1]?2:a[3]<a[1]?-2:0),stroke:"var(--doux)","stroke-width":2,"marker-end":"url(#fl)"})});
})();

/* Graphiques déclarés dans la page : <svg data-graph="barres" data-lignes='[[libellé, valeur, couleur, [bas, haut] ou null, texte], …]' data-max data-lw data-ref> */
document.querySelectorAll('svg[data-graph="barres"]').forEach(function(s,k){if(!s.id)s.id="g-auto-"+k;
 barres(s.id,JSON.parse(s.getAttribute("data-lignes")),{max:+s.getAttribute("data-max")||100,lw:+s.getAttribute("data-lw")||210,h:+s.getAttribute("data-h")||40,ref:s.getAttribute("data-ref")?+s.getAttribute("data-ref"):null});});
});
