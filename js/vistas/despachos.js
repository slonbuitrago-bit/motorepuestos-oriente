"use strict";
/* Motorepuestos del Oriente
   Vista · Despachos, remisiones, conteo ciego, entrega y novedades. */

/* --- Despachos --- */
function vDespachos(){
  const tab = UI.tab.desp || (P("despachos.gestionar") ? "por" : "act");
  const por = DB.facturas.filter(f => f.estado === "Autorizada" && !f.remisionId);
  const act = DB.remisiones.filter(r => ["Alistamiento","Verificada","En tránsito"].includes(r.estado)).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const hist = DB.remisiones.filter(r => ["Entregada","Con novedad"].includes(r.estado)).sort((a, b) => (b.entregadaEn || "").localeCompare(a.entregadaEn || "")).slice(0, 30);
  const nov = DB.novedades.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const tabsDef = [["por","Por remisionar",por.length],["act","En proceso",act.length],["hist","Entregadas",null],["nov","Novedades",nov.filter(n => n.estado === "Abierta").length]];
  const remRow = r => { const f = byId(DB.facturas, r.facturaId); const c = cli(f.clienteId); return `<tr><td><button class="linklike mono" data-act="verRemision" data-id="${r.id}">${r.numero}</button></td><td class="mono">${f.numero}</td><td>${esc(c.nombre)}</td><td>${esc(ciudad(f.ciudadDestinoId)?.nombre)}</td><td>${esc(r.instrucciones.transportadora)}</td><td>${pill(r.estado, { Alistamiento:"info", Verificada:"acc", "En tránsito":"acc", Entregada:"ok", "Con novedad":"bad" }[r.estado])}</td><td>${fdt(r.entregadaEn || r.fecha)}</td></tr>`; };
  return `<div class="page-head"><div><p class="eyebrow">Bodega y transporte</p><h1>Despachos y remisiones</h1><p>Cada remisión lleva instrucciones de envío completas. Antes de salir, Bodega alista el pedido y Despachos lo verifica con conteo ciego: quien cuenta no ve la cantidad facturada. En la entrega se registra lo recibido; cualquier diferencia abre una novedad.</p></div></div>
  <div class="tabs" role="tablist">${tabsDef.map(([k, l, n]) => `<button role="tab" aria-selected="${tab === k}" data-act="tab" data-g="desp" data-v="${k}">${l}${n ? ` (${n})` : ""}</button>`).join("")}</div>
  ${tab === "por" ? (por.length ? `<div class="tw"><table><thead><tr><th>Factura</th><th>Autorizada</th><th>Cliente</th><th>Destino</th><th class="r">Líneas</th><th></th></tr></thead><tbody>${por.map(f => `<tr><td><button class="linklike mono" data-act="verFactura" data-id="${f.id}">${f.numero}</button></td><td>${fdt(f.revisadoEn)}</td><td>${esc(cli(f.clienteId).nombre)}</td><td>${esc(ciudad(f.ciudadDestinoId)?.nombre)}</td><td class="r">${f.items.length}</td><td>${P("despachos.gestionar") ? `<button class="btn sm primary" data-act="nuevaRemision" data-id="${f.id}">Crear remisión</button>` : ""}</td></tr>`).join("")}</tbody></table></div>` : `<div class="panel empty">No hay facturas autorizadas pendientes de remisión.</div>`) : ""}
  ${tab === "act" ? (act.length ? `<div class="tw"><table><thead><tr><th>Remisión</th><th>Factura</th><th>Cliente</th><th>Destino</th><th>Transportadora</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>${act.map(remRow).join("")}</tbody></table></div>` : `<div class="panel empty">No hay remisiones en proceso.</div>`) : ""}
  ${tab === "hist" ? `<div class="tw"><table><thead><tr><th>Remisión</th><th>Factura</th><th>Cliente</th><th>Destino</th><th>Transportadora</th><th>Estado</th><th>Entregada</th></tr></thead><tbody>${hist.map(remRow).join("")}</tbody></table></div>` : ""}
  ${tab === "nov" ? `<div class="tw"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Remisión</th><th>Detalle</th><th>Estado</th><th></th></tr></thead><tbody>${nov.map(n => `<tr><td>${fdt(n.fecha)}</td><td>${esc(n.tipo)}</td><td class="mono">${esc(rem(n.remisionId)?.numero)}</td><td class="wrap">${verificaCiego() && rem(n.remisionId)?.estado === "Alistamiento" ? "Diferencia en el conteo. El detalle lo ven Bodega y Gerencia hasta que el conteo quede conforme." : esc(n.detalle)}${n.resolucion ? `<br><span class="muted">Resolución: ${esc(n.resolucion)}</span>` : ""}</td><td>${pill(n.estado, n.estado === "Abierta" ? "bad" : "ok")}</td><td>${n.estado === "Abierta" && (P("facturas.autorizar") || P("despachos.gestionar")) ? `<button class="btn sm" data-act="cerrarNovDlg" data-id="${n.id}">Cerrar</button>` : ""}</td></tr>`).join("") || `<tr><td colspan="6" class="empty">Sin novedades.</td></tr>`}</tbody></table></div>` : ""}`;
}
function dlgNuevaRemision(fid){
  const f = byId(DB.facturas, fid), c = cli(f.clienteId);
  openDlg(`Nueva remisión · factura ${f.numero}`, `
    <form id="frm-rem" data-form="remision" data-id="${f.id}" class="grid" novalidate>
      <p class="muted">Los datos se precargan del cliente; ajústalos si el pedido indica otra cosa.</p>
      <div class="grid g2">
        <div class="field"><label for="r-dir">Dirección de entrega *</label><input id="r-dir" name="direccion" required value="${esc(c.direccion)}"></div>
        <div class="field"><label for="r-ref">Punto de referencia</label><input id="r-ref" name="referencia" placeholder="Ej.: diagonal al parque principal, portón verde"></div>
        <div class="field"><label for="r-con">Recibe *</label><input id="r-con" name="contacto" required value="${esc(c.contacto)}"></div>
        <div class="field"><label for="r-tel">Teléfono *</label><input id="r-tel" name="telefono" required inputmode="tel" value="${esc(c.telefono)}"></div>
        <div class="field"><label for="r-tr">Transportadora *</label><select id="r-tr" name="transportadora">${DB.transportadoras.map(t => `<option>${esc(t)}</option>`).join("")}</select></div>
        <div class="field"><label for="r-gu">Número de guía</label><input id="r-gu" name="guia" placeholder="Obligatorio si no es flota propia"></div>
        <div class="field"><label for="r-fr">Franja de entrega</label><select id="r-fr" name="franja"><option>8:00 a. m. – 12:00 m.</option><option>2:00 p. m. – 6:00 p. m.</option><option>Todo el día</option></select></div>
        <div class="field"><label for="r-dest">Municipio</label><input id="r-dest" value="${esc(ciudad(f.ciudadDestinoId)?.nombre)}" disabled></div>
      </div>
      <div class="field"><label for="r-obs">Instrucciones especiales</label><textarea id="r-obs" name="observaciones">Entregar únicamente a la persona de contacto. Exigir firma y cédula.</textarea></div>
      <div id="rem-err" role="alert"></div>
    </form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-rem">Crear remisión</button>`);
}
function dlgRemision(id){
  const r = rem(id), f = byId(DB.facturas, r.facturaId), c = cli(f.clienteId), I = r.instrucciones;
  const puede = P("despachos.gestionar");
  let cuerpo = `<div class="row">${pill(r.estado, { Alistamiento:"info", Verificada:"acc", "En tránsito":"acc", Entregada:"ok", "Con novedad":"bad" }[r.estado])}${r.sello ? pill("Sello " + r.sello, "") : ""}</div>
    <dl class="kv"><dt>Factura</dt><dd class="mono">${f.numero}</dd><dt>Cliente</dt><dd>${esc(c.nombre)}</dd><dt>Entregar en</dt><dd>${esc(I.direccion)}${I.referencia ? " · " + esc(I.referencia) : ""}, ${esc(ciudad(f.ciudadDestinoId)?.nombre)}</dd><dt>Recibe</dt><dd>${esc(I.contacto)} · ${esc(I.telefono)}</dd><dt>Transporte</dt><dd>${esc(I.transportadora)}${I.guia ? " · guía " + esc(I.guia) : ""} · ${esc(I.franja)}</dd><dt>Instrucciones</dt><dd>${esc(I.observaciones || "—")}</dd>${r.recibidoPor ? `<dt>Recibió</dt><dd>${esc(r.recibidoPor)} · ${fdt(r.entregadaEn)}</dd>` : ""}</dl>`;
  let foot = `<button class="btn" data-act="cerrarDlg">Cerrar</button>`;
  if (r.estado === "Alistamiento"){
    const alisto = r.alistadoPor ? usr(r.alistadoPor) : null;
    if (r.conteoFallido && !alisto) cuerpo += `<div class="note bad" role="alert"><b>El conteo no coincide con la factura en ${r.conteoFallido} ${r.conteoFallido === 1 ? "referencia" : "referencias"}.</b> No se puede despachar. Se registró una novedad y el pedido volvió a Bodega para revisar el alistamiento.</div>`;
    if (!alisto){
      // Paso 1: Bodega alista viendo las cantidades
      if (P("despachos.alistar")){
        cuerpo += `<section class="grid"><h3>Lista de alistamiento</h3><p class="muted">Saca del estante cada referencia en la cantidad indicada y déjala en la zona de despacho. Después, Despachos la verifica con conteo ciego.</p>
          <div class="tw"><table><thead><tr><th>Referencia</th><th>Descripción</th><th class="r">Cantidad a alistar</th></tr></thead><tbody>${r.items.map(it => { const p = prod(it.productoId); return `<tr><td class="mono">${esc(p.sku)}</td><td>${esc(p.nombre)}</td><td class="r num">${it.cantidad}</td></tr>`; }).join("")}</tbody></table></div></section>`;
        foot += `<button class="btn primary" data-act="alistar" data-id="${r.id}">Marcar como alistado</button>`;
      } else cuerpo += `<div class="note">Esperando a que <b>Bodega</b> aliste el pedido. El conteo ciego se habilita cuando Bodega lo marque como alistado.</div>`;
    } else {
      cuerpo += `<p class="muted">Alistado por <b>${esc(alisto.nombre)}</b> (${esc(alisto.rol)}) · ${fdt(r.alistadoEn)}</p>`;
      // Paso 2: Despachos verifica sin ver la cantidad facturada (y no puede ser quien alistó)
      if (puede && r.alistadoPor !== ME.id){
        cuerpo += `<form id="frm-conteo" data-form="conteo" data-id="${r.id}" class="grid"><h3>Conteo ciego de verificación</h3><p class="muted">Cuenta físicamente lo que Bodega alistó y escribe la cantidad. El sistema la compara con la factura sin mostrarla.</p>
      <div class="tw"><table><thead><tr><th>Referencia</th><th>Descripción</th><th class="r" style="width:140px">Cantidad contada</th></tr></thead><tbody>${r.items.map((it, i) => { const p = prod(it.productoId); return `<tr><td class="mono">${esc(p.sku)}</td><td>${esc(p.nombre)}</td><td><label class="sr" for="cc-${i}">Cantidad contada de ${esc(p.sku)}</label><input id="cc-${i}" name="c${i}" type="number" min="0" required inputmode="numeric" style="text-align:right"></td></tr>`; }).join("")}</tbody></table></div><div id="conteo-res" role="alert"></div></form>`;
        foot += `<button class="btn primary" type="submit" form="frm-conteo">Verificar conteo</button>`;
      } else if (puede) cuerpo += `<div class="note warn">Tú alistaste este pedido: el conteo de verificación lo debe hacer otra persona de Despachos.</div>`;
      else cuerpo += `<div class="note">Esperando el conteo ciego de <b>Despachos</b>.</div>`;
    }
  } else if (r.estado === "Verificada"){
    cuerpo += itemsTabla(r, false);
    if (puede) foot += `<button class="btn primary" data-act="despachar" data-id="${r.id}">Registrar salida de bodega</button>`;
  } else if (r.estado === "En tránsito"){
    cuerpo += `<form id="frm-ent" data-form="entrega" data-id="${r.id}" class="grid"><h3>Registrar entrega</h3><p class="muted">Escribe lo que el cliente recibió y firmó. Si no coincide con lo despachado, se abre una novedad.</p>
      <div class="field"><label for="en-rec">Nombre de quien recibe *</label><input id="en-rec" name="recibe" required value="${esc(I.contacto)}"></div>
      <div class="tw"><table><thead><tr><th>Referencia</th><th class="r">Despachado</th><th class="r" style="width:140px">Recibido</th></tr></thead><tbody>${r.items.map((it, i) => { const p = prod(it.productoId); return `<tr><td><span class="mono">${esc(p.sku)}</span> ${esc(p.nombre)}</td><td class="r">${it.cantidad}</td><td><label class="sr" for="er-${i}">Recibido de ${esc(p.sku)}</label><input id="er-${i}" name="r${i}" type="number" min="0" value="${it.cantidad}" required style="text-align:right"></td></tr>`; }).join("")}</tbody></table></div></form>`;
    if (puede) foot += `<button class="btn primary" type="submit" form="frm-ent">Confirmar entrega</button>`;
  } else {
    cuerpo += itemsTabla(r, true);
  }
  cuerpo += `<h3>Trazabilidad</h3>` + timelineFactura(f, ocultarCantidades(f));
  openDlg(`Remisión ${r.numero}`, cuerpo, foot);
}
function itemsTabla(r, conRecibido){
  return `<div class="tw"><table><thead><tr><th>Referencia</th><th class="r">Facturado</th><th class="r">Contado</th>${conRecibido ? '<th class="r">Recibido</th>' : ""}</tr></thead><tbody>${r.items.map(it => { const p = prod(it.productoId); const bad = conRecibido && it.recibido !== it.cantidad; return `<tr><td><span class="mono">${esc(p.sku)}</span> ${esc(p.nombre)}</td><td class="r">${it.cantidad}</td><td class="r">${it.contado ?? "—"}</td>${conRecibido ? `<td class="r" style="${bad ? "color:var(--bad);font-weight:700" : ""}">${it.recibido ?? "—"}</td>` : ""}</tr>`; }).join("")}</tbody></table></div>`;
}
