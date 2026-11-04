"use strict";
/* Motorepuestos del Oriente
   Capa de presentación · Preferencias de accesibilidad (tamaño de texto, contraste, espaciado, tema, movimiento). */

/* ---------- Preferencias de accesibilidad ---------- */
function loadPrefs(){ try { PREFS = JSON.parse(store.get(PREF_KEY) || "{}"); } catch(e){ PREFS = {}; } applyPrefs(); }
function applyPrefs(){
  const r = document.documentElement;
  r.style.setProperty("--scale", PREFS.escala || 1);
  PREFS.contraste ? r.setAttribute("data-contrast","alto") : r.removeAttribute("data-contrast");
  PREFS.espaciado ? r.setAttribute("data-espaciado","amplio") : r.removeAttribute("data-espaciado");
  PREFS.subrayar ? r.setAttribute("data-subrayar","si") : r.removeAttribute("data-subrayar");
  PREFS.movimiento ? r.setAttribute("data-movimiento","reducido") : r.removeAttribute("data-movimiento");
  if (PREFS.tema === "light" || PREFS.tema === "dark") r.setAttribute("data-theme", PREFS.tema);
  else if (PREFS.temaTocado) r.removeAttribute("data-theme");
}
function setPref(k, v){ PREFS[k] = v; if (k === "tema") PREFS.temaTocado = true; store.set(PREF_KEY, JSON.stringify(PREFS)); applyPrefs(); }
