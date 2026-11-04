"use strict";
/* Motorepuestos del Oriente
   Vista · Clientes y cupos. */

/* --- Clientes --- */
function vClientes(){
  return `<div class="page-head"><div><h1>Clientes y cupos</h1><p>Almacenes y talleres de los municipios atendidos. El cupo comprometido suma facturas pendientes y autorizadas sin pago. Los datos personales se tratan según la Ley 1581 de 2012.</p></div>
    ${P("clientes.gestionar") ? `<button class="btn primary" data-act="clienteDlg">${icon("plus")} Nuevo cliente</button>` : ""}</div>
  <div class="tw"><table><thead><tr><th>Cliente</th><th>NIT</th><th>Municipio</th><th>Contacto</th><th class="r">Cupo</th><th class="r">Comprometido</th><th style="min-width:140px">Uso</th><th class="r">Disponible</th>${P("clientes.gestionar") ? "<th></th>" : ""}</tr></thead><tbody>
  ${DB.clientes.map(c => { const u = cupoComprometido(c.id), pct = u / c.cupo * 100; return `<tr><td>${esc(c.nombre)}</td><td class="mono">${esc(c.nit)}</td><td>${esc(ciudad(c.ciudadId)?.nombre)}</td><td>${esc(c.contacto)}<br><span class="muted" style="font-size:.8rem">${esc(c.telefono)} · ${esc(c.email || "sin correo")}</span></td><td class="r">${money(c.cupo)}</td><td class="r">${money(u)}</td><td><div class="meter ${pct > 100 ? "bad" : pct > 80 ? "warn" : ""}" role="meter" aria-label="Uso del cupo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><span style="width:${Math.min(100, pct)}%"></span></div><span class="muted" style="font-size:.78rem">${pct.toFixed(0)} %</span></td><td class="r"><b>${money(c.cupo - u)}</b></td>${P("clientes.gestionar") ? `<td><button class="btn sm" data-act="clienteDlg" data-id="${c.id}">Editar</button></td>` : ""}</tr>`; }).join("")}
  </tbody></table></div>`;
}
function dlgCliente(id){
  const c = id ? cli(id) : { nombre:"", nit:"", ciudadId:"05615", direccion:"", contacto:"", telefono:"", cupo:5000000, autorizaDatos:false };
  const cupoOnlyGer = !P("facturas.autorizar");
  openDlg(id ? "Editar cliente" : "Nuevo cliente", `<form id="frm-cl" data-form="cliente" data-id="${id || ""}" class="grid g2">
    <div class="field"><label for="cl-n">Razón social *</label><input id="cl-n" name="nombre" required value="${esc(c.nombre)}"></div>
    <div class="field"><label for="cl-nit">NIT *</label><input id="cl-nit" name="nit" required pattern="[0-9.]{6,13}-[0-9]" placeholder="900.123.456-7" value="${esc(c.nit)}" aria-describedby="cl-nit-h"><span class="hint" id="cl-nit-h">Formato 900.123.456-7 (con dígito de verificación).</span></div>
    <div class="field"><label for="cl-ci">Municipio *</label><select id="cl-ci" name="ciudadId">${DB.ciudades.filter(x => byId(DB.estados, x.estadoId).paisId === "CO").map(x => `<option value="${x.id}" ${c.ciudadId === x.id ? "selected" : ""}>${esc(x.nombre)}</option>`).join("")}</select></div>
    <div class="field"><label for="cl-d">Dirección *</label><input id="cl-d" name="direccion" required value="${esc(c.direccion)}"></div>
    <div class="field"><label for="cl-co">Contacto *</label><input id="cl-co" name="contacto" required value="${esc(c.contacto)}"></div>
    <div class="field"><label for="cl-t">Teléfono *</label><input id="cl-t" name="telefono" required inputmode="tel" value="${esc(c.telefono)}"></div>
    <div class="field"><label for="cl-em">Correo para notificaciones *</label><input id="cl-em" name="email" type="email" required autocomplete="off" value="${esc(c.email || "")}" aria-describedby="cl-em-h"><span class="hint" id="cl-em-h">Recibe avisos de pedido, factura, despacho y pago.</span></div>
    <div class="field"><label for="cl-cu">Cupo de crédito (COP)</label><input id="cl-cu" name="cupo" type="number" min="0" step="100000" value="${c.cupo}" ${cupoOnlyGer && id ? "disabled" : ""} aria-describedby="cl-cu-h"><span class="hint" id="cl-cu-h">${cupoOnlyGer ? "Solo Gerencia puede modificar el cupo de un cliente existente." : "Cambios de cupo quedan auditados."}</span></div>
    <label class="chk" for="cl-hd" style="align-self:end"><input type="checkbox" id="cl-hd" name="hd" ${c.autorizaDatos ? "checked" : ""} required><span>El cliente autorizó el tratamiento de sus datos (Ley 1581 de 2012) *</span></label>
    <div id="cl-err" role="alert"></div></form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-cl">Guardar</button>`);
}
