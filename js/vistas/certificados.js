"use strict";
/* Motorepuestos del Oriente
   Vista · Certificados de garantía. */

/* --- Certificados --- */
function vVerificar(publico){
  const res = UI.certRes;
  return `<section class="panel" aria-labelledby="vc"><header><h2 id="vc">Verificar certificado de garantía</h2></header>
    <p class="muted">Escribe el código impreso en el certificado entregado con el repuesto (formato CG-XXXX-XXXX).</p>
    <form data-form="certificado" class="row"><label for="cc" class="sr">Código del certificado</label><input id="cc" name="codigo" placeholder="CG-1A2B-3C4D" style="max-width:260px;text-transform:uppercase" required autocomplete="off" value="${esc(UI.certQ || "")}"><button class="btn primary" type="submit">Verificar</button></form>
    <div aria-live="polite">${res || ""}</div>
    ${publico ? `<button class="btn sm ghost" data-act="cerrarPublico">Volver</button>` : ""}</section>`;
}
function vCertificados(){
  const ultimos = DB.certificados.slice().sort((a, b) => b.emitido.localeCompare(a.emitido)).slice(0, 12);
  return `<div class="page-head"><div><h1>Certificados de garantía</h1><p>Respaldan la autenticidad y el funcionamiento de los repuestos vendidos. Cada código está ligado a la factura electrónica y al cliente, y cualquiera puede verificarlo.</p></div></div>
  ${vVerificar(false)}
  <section class="panel"><header><h2>Emitidos recientemente</h2><span class="muted">${NUM.format(DB.certificados.length)} en total</span></header>
  <div class="tw"><table><thead><tr><th>Código</th><th>Referencia</th><th>Cliente</th><th>Factura</th><th>Vence</th><th></th></tr></thead><tbody>${ultimos.map(x => `<tr><td class="mono">${x.codigo}</td><td>${esc(prod(x.productoId).nombre)}</td><td>${esc(cli(x.clienteId).nombre)}</td><td class="mono">${esc(byId(DB.facturas, x.facturaId).numero)}</td><td>${fdate(x.vence)}</td><td><button class="btn sm" data-act="probarCert" data-c="${x.codigo}">Verificar</button></td></tr>`).join("")}</tbody></table></div></section>`;
}
function resultadoCert(code){
  const c = DB.certificados.find(x => x.codigo === code.trim().toUpperCase());
  if (!c) return `<div class="note bad" role="alert"><b>Código no encontrado.</b> Revisa que lo hayas escrito igual al impreso. Si persiste, el certificado podría no ser auténtico: comunícate con Motorepuestos del Oriente.</div>`;
  const f = byId(DB.facturas, c.facturaId), p = prod(c.productoId), vig = new Date(c.vence) > new Date();
  return `<div class="note ${vig ? "ok" : "warn"}"><b>${vig ? "Certificado auténtico y garantía vigente" : "Certificado auténtico, garantía vencida"}</b>
    <dl class="kv" style="margin-top:8px"><dt>Código</dt><dd class="mono">${c.codigo}</dd><dt>Repuesto</dt><dd>${esc(p.nombre)} (${esc(p.sku)}) × ${c.cantidad}</dd><dt>Comprado por</dt><dd>${esc(cli(c.clienteId).nombre)}</dd><dt>Factura</dt><dd class="mono">${f.numero} · ${fdate(f.fecha)}</dd><dt>Garantía hasta</dt><dd>${fdate(c.vence)}</dd></dl></div>`;
}
