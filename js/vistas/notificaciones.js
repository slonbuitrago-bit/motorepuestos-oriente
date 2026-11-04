"use strict";
/* Motorepuestos del Oriente
   Vista · Bandeja de salida de correos. */

/* --- Notificaciones por correo --- */
function vNotificaciones(){
  const tipos = ["Pedido de venta","Factura emitida","Despacho","Pago registrado"];
  const ft = UI.filtros.nt || "";
  const list = DB.correos.filter(m => !ft || m.tipo === ft).slice().sort((a, b) => b.ts.localeCompare(a.ts));
  const shown = list.slice(0, UI.filtros.nlim || 50);
  return `<div class="page-head"><div><p class="eyebrow">Requisito funcional · notificaciones</p><h1>Notificaciones por correo</h1><p>El sistema escribe al cliente cuando se registra un pedido de venta, se emite su factura, sale el despacho y se registra un pago. Esta es la bandeja de salida.</p></div></div>
  <div class="note">En el prototipo los correos se generan y quedan aquí, pero no salen a internet. En producción se entregan con un servicio SMTP a través de una cola con reintentos, para no frenar la operación si el servidor de correo falla.</div>
  <section class="kpis" aria-label="Correos por tipo" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">${tipos.map(t => `<div class="kpi"><span class="l">${t}</span><span class="v">${DB.correos.filter(m => m.tipo === t).length}</span></div>`).join("")}</section>
  <div class="field" style="max-width:260px"><label for="nt">Tipo de transacción</label><select id="nt" data-ch="nt"><option value="">Todas</option>${tipos.map(t => `<option ${ft === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
  <div class="tw"><table><caption class="sr">Bandeja de salida</caption><thead><tr><th>Fecha</th><th>Transacción</th><th>Para</th><th>Asunto</th><th>Documento</th><th>Estado</th><th></th></tr></thead><tbody>
  ${shown.map(m => `<tr><td>${fdt(m.ts)}</td><td>${esc(m.tipo)}</td><td>${esc(m.contacto)}<br><span class="muted" style="font-size:.8rem">${esc(m.para)}</span></td><td class="wrap">${esc(m.asunto)}</td><td class="mono">${esc(m.ref)}</td><td>${pill(m.estado, m.estado === "Enviado" ? "ok" : "warn")}</td><td><button class="btn sm" data-act="verCorreo" data-id="${m.id}">Ver</button></td></tr>`).join("") || `<tr><td colspan="7" class="empty">Sin correos.</td></tr>`}
  </tbody></table></div>
  <div class="row between"><span class="muted">${shown.length} de ${list.length} correos</span>${list.length > shown.length ? `<button class="btn" data-act="masCorreos">Mostrar más</button>` : ""}</div>`;
}
