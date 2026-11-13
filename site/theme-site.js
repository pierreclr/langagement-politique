/* Thème clair / sombre, le même sur tout le site (13/11/2026) : automatique, puis clair, puis sombre ; mémorisé (lp-theme),
   comme sur le manifeste. Sur les pages du manifeste, leur propre script gère déjà le bouton : on ne le double pas. */
(function(){var d=document.documentElement;try{var t=localStorage.getItem("lp-theme");if(t==="clair"||t==="sombre")d.setAttribute("data-theme",t);}catch(e){}
document.addEventListener("DOMContentLoaded",function(){if(d.hasAttribute("data-niveau"))return;var b=document.querySelector("[data-theme-bouton]");if(!b)return;
b.addEventListener("click",function(){var t=d.getAttribute("data-theme"),s=t==="clair"?"sombre":t==="sombre"?"":"clair";
if(s)d.setAttribute("data-theme",s);else d.removeAttribute("data-theme");try{if(s)localStorage.setItem("lp-theme",s);else localStorage.removeItem("lp-theme");}catch(e){}});});})();
