"use strict";
/* Motorepuestos del Oriente
   Vista · Bitácora, rastreo e integridad. */

/* --- Trazabilidad --- */
function vTrazabilidad(){
  const q = (UI.filtros.aq || "").toLowerCase();
  const ent = UI.filtros.aent || "";
  const list = DB.audit.filter(e => (!ent || e.entidad === ent) && (!q || (e.ref + " " + e.usuario + " " + e.accion + " " + e.detalle).toLowerCase().includes(q))).slice().reverse();
  const shown = list.slice(0, UI.filtros.alim || 60);
  const v = UI.cadena;
  return `<div class="page-head"><div><p class="eyebrow">ISO 9001 · 8.5.2 Identificación y trazabilidad</p><h1>Trazabilidad y auditoría</h1><p>Cada acción queda registrada con usuario, rol y hora. Los registros están encadenados: cada uno guarda la huella SHA-256 del anterior, así que alterar o borrar uno rompe la cadena y se detecta.</p></div>
    <div class="row"><button class="btn primary" data-act="verifCadena">Verificar integridad</button>${P("admin.usuarios") ? `<button class="btn" data-act="simularFraude">Simular alteración</button>` : ""}</div></div>
  ${v ? (v.ok ? `<div class="note ok" role="status"><b>Cadena íntegra.</b> ${v.n} registros verificados, ninguno fue alterado.</div>` : `<div class="note bad" role="alert"><b>Cadena rota en el registro #${v.seq}.</b> Ese registro o uno anterior fue modificado fuera del sistema. ${P("admin.usuarios") ? `<button class="btn sm" data-act="restaurarFraude">Deshacer simulación</button>` : ""}</div>`) : ""}
  <section class="panel"><header><h2>Rastrear un documento</h2></header>
    <form data-form="rastreo" class="row"><label for="rs" class="sr">Número de documento</label><input id="rs" name="doc" placeholder="PED-00003, MRO-001012, REM-00005 o IMP-2026-001" style="max-width:340px" required><button class="btn" type="submit">Rastrear</button></form>
    <div id="rastreo-res">${UI.rastreo || ""}</div></section>
  <div class="grid g2"><div class="field"><label for="aq">Buscar en la bitácora</label><input id="aq" type="search" value="${esc(UI.filtros.aq || "")}" data-in="aq" placeholder="Documento, usuario o acción"></div>
  <div class="field"><label for="aent">Entidad</label><select id="aent" data-ch="aent"><option value="">Todas</option>${[...new Set(DB.audit.map(e => e.entidad))].map(x => `<option ${ent === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></div></div>
  <div class="tw"><table><caption class="sr">Bitácora de auditoría</caption><thead><tr><th class="r">#</th><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Documento</th><th>Detalle</th><th>Huella</th></tr></thead><tbody>
  ${shown.map(e => `<tr><td class="r num">${e.seq}</td><td>${fdt(e.ts)}</td><td>${esc(e.usuario)}<br><span class="muted" style="font-size:.78rem">${esc(e.rol)}</span></td><td>${esc(e.accion)}</td><td class="mono">${esc(e.ref)}</td><td class="wrap">${esc(e.detalle)}</td><td class="hash" title="${e.hash}">${e.hash.slice(0, 12)}…</td></tr>`).join("")}
  </tbody></table></div>
  <div class="row between"><span class="muted">${shown.length} de ${list.length} registros</span>${list.length > shown.length ? `<button class="btn" data-act="masAudit">Mostrar más</button>` : ""}</div>`;
}
