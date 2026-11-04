"use strict";
/* Motorepuestos del Oriente
   Capa de presentación · Ventanas modales y avisos. */

/* ---------- Diálogos y avisos ---------- */
function openDlg(title, body, foot){
  const d = $("#dlg");
  d.innerHTML = `<div class="dlg-head"><h2 id="dlg-title">${esc(title)}</h2><button class="btn sm ghost" data-act="cerrarDlg" aria-label="Cerrar">✕</button></div><div class="dlg-body">${body}</div>${foot ? `<div class="dlg-foot">${foot}</div>` : ""}`;
  if (!d.open){ UI.lastFocus = document.activeElement; d.showModal(); }
  const first = d.querySelector(".dlg-body input:not([disabled]), .dlg-body select, .dlg-body textarea");
  (first || d.querySelector(".dlg-head button")).focus();
}
function closeDlg(){ const d = $("#dlg"); if (d.open) d.close(); UI.dlgCtx = null; }
$("#dlg").addEventListener("close", () => { UI.tab.fac = "doc"; UI.dlgCtx = null; if (UI.lastFocus && document.contains(UI.lastFocus)) UI.lastFocus.focus(); });
function toast(msg, bad){ const t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg; $("#toasts").appendChild(t); setTimeout(() => t.remove(), 5000); }
function commit(){ save(); render(); }
