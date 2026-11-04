"use strict";
/* Motorepuestos del Oriente
   Capa núcleo · Utilidades: SHA-256, formato de moneda y fechas, escape de HTML, acceso seguro al almacenamiento. */

/* ---------- Utilidades ---------- */
function sha256(ascii){function rr(v,a){return(v>>>a)|(v<<(32-a))}var mp=Math.pow,mw=mp(2,32),i,j,r='',w=[],bl=ascii.length*8,h=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],pc=k.length,ic={};for(var c=2;pc<64;c++){if(!ic[c]){for(i=0;i<313;i+=c)ic[i]=c;h[pc]=(mp(c,.5)*mw)|0;k[pc++]=(mp(c,1/3)*mw)|0}}ascii+='\x80';while(ascii.length%64-56)ascii+='\x00';for(i=0;i<ascii.length;i++){j=ascii.charCodeAt(i);if(j>>8)return;w[i>>2]|=j<<((3-i)%4)*8}w[w.length]=((bl/mw)|0);w[w.length]=bl;for(j=0;j<w.length;){var ww=w.slice(j,j+=16),oh=h;h=h.slice(0,8);for(i=0;i<64;i++){var w15=ww[i-15],w2=ww[i-2],a=h[0],e=h[4],t1=h[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&h[5])^((~e)&h[6]))+k[i]+(ww[i]=(i<16)?ww[i]:(ww[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+ww[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0),t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&h[1])^(a&h[2])^(h[1]&h[2]));h=[(t1+t2)|0].concat(h);h[4]=(h[4]+t1)|0}for(i=0;i<8;i++)h[i]=(h[i]+oh[i])|0}for(i=0;i<8;i++)for(j=3;j+1;j--){var b=(h[i]>>(j*8))&255;r+=((b<16)?0:'')+b.toString(16)}return r}
const sha = s => sha256(unescape(encodeURIComponent(String(s))));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const COP = new Intl.NumberFormat("es-CO", { style:"currency", currency:"COP", maximumFractionDigits:0 });
const USD = new Intl.NumberFormat("es-CO", { style:"currency", currency:"USD", maximumFractionDigits:2 });
const NUM = new Intl.NumberFormat("es-CO");
const money = n => COP.format(Math.round(n || 0));
const fdate = iso => iso ? new Date(iso).toLocaleDateString("es-CO", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fdt = iso => iso ? new Date(iso).toLocaleString("es-CO", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const byId = (arr, id) => arr.find(x => x.id === id);
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
const IVA = 0.19;

const STORE_KEY = "mro.datos.v1", PREF_KEY = "mro.prefs.v1", SES_KEY = "mro.sesion.v1";
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
