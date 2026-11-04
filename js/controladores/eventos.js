"use strict";
/* Motorepuestos del Oriente
   Capa de control · Delegación de eventos del navegador hacia acciones y formularios. */

/* ---------- Eventos (delegación) ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  if (b.tagName === "A" && b.getAttribute("href") === "#") e.preventDefault();
  if (b.dataset.act === "verifPublico") e.preventDefault();
  const fn = ACT[b.dataset.act]; if (fn && !b.disabled) fn(b.dataset, b);
});
document.addEventListener("submit", e => {
  const f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault();
  const fn = FORM[f.dataset.form]; if (fn) fn(f);
});
let tIn;
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.in){ clearTimeout(tIn); const k = t.dataset.in, v = t.value, id = t.id; tIn = setTimeout(() => { UI.filtros[k] = v; render(); const el = $("#" + id); if (el){ el.focus(); el.setSelectionRange(v.length, v.length); } }, 220); }
  if (t.dataset.item !== undefined && t.dataset.k === "cantidad"){ UI.draft.items[+t.dataset.item].cantidad = t.value; clearTimeout(tIn); const id = t.id; tIn = setTimeout(() => { const pos = t.selectionStart; render(); const el = $("#" + id); if (el){ el.focus(); try { el.setSelectionRange(pos, pos); } catch(_){} } }, 350); }
  if (t.dataset.draft === "obs") UI.draft.obs = t.value;
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.dataset.ch){ UI.filtros[t.dataset.ch] = t.value; render(); $("#" + t.id)?.focus(); }
  if (t.dataset.pref){ setPref(t.dataset.pref, t.checked); render(); $("#" + t.id)?.focus(); }
  if (t.dataset.draft && t.dataset.draft !== "obs"){
    const d = UI.draft; d[t.dataset.draft] = t.value;
    if (t.dataset.draft === "paisId"){ d.estadoId = DB.estados.find(x => x.paisId === t.value)?.id || ""; d.ciudadId = ""; }
    if (t.dataset.draft === "estadoId") d.ciudadId = "";
    if (t.dataset.draft === "clienteId" && t.value){ const c = cli(t.value); const ci = ciudad(c.ciudadId); d.ciudadId = c.ciudadId; d.estadoId = ci.estadoId; d.paisId = byId(DB.estados, ci.estadoId).paisId; }
    if (d.errores) delete d.errores[t.dataset.draft];
    render(); $("#" + t.id)?.focus();
  }
  if (t.dataset.item !== undefined && t.dataset.k === "productoId"){ UI.draft.items[+t.dataset.item].productoId = t.value; render(); $("#" + t.id)?.focus(); }
  if (t.dataset.perm){
    const r = t.dataset.rol, k = t.dataset.perm, arr = DB.roles[r];
    if (t.checked){ if (!arr.includes(k)) arr.push(k); } else DB.roles[r] = arr.filter(x => x !== k);
    audit(t.checked ? "Otorgar permiso" : "Revocar permiso", "Rol", r, PERMISOS[k]); save(); toast(`${r}: ${t.checked ? "puede" : "ya no puede"} ${PERMISOS[k].toLowerCase()}.`);
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape"){ if (UI.a11yOpen){ UI.a11yOpen = false; render(); } else if (UI.menuOpen){ UI.menuOpen = false; render(); } } });
window.addEventListener("hashchange", () => { UI.menuOpen = false; if (ruta() !== "factura-nueva" && ruta() !== "pedido-nuevo") UI.draft = null; render(); window.scrollTo(0, 0); $("#main")?.focus({ preventScroll:true }); });
