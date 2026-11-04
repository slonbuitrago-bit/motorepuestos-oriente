"use strict";
/* Motorepuestos del Oriente
   Vista · Facturas: listado, formulario (pedido o manual), documento y detalle. */

/* --- Facturas --- */
function vFacturas(){
  const q = (UI.filtros.fq || "").toLowerCase(), fe = UI.filtros.fe || "", fsu = UI.filtros.fsu || "";
  const list = DB.facturas.filter(f => {
    if (fe && f.estado !== fe && estadoLogistico(f)[0] !== fe) return false;
    if (fsu && f.sucursalId !== fsu) return false;
    if (q){ const c = cli(f.clienteId); if (!(f.numero.toLowerCase().includes(q) || c.nombre.toLowerCase().includes(q) || c.nit.includes(q))) return false; }
    return true;
  }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const shown = list.slice(0, UI.filtros.flim || 40);
  return `
  <div class="page-head"><div><h1>Facturas</h1><p>Las facturas que salen de un pedido de venta quedan contabilizadas de inmediato. Las facturas manuales, sin pedido, requieren autorización de un gerente antes de contabilizarse y despacharse.</p></div>
    ${P("facturas.crear") ? `<a class="btn primary" href="#factura-nueva">${icon("plus")} Registrar factura manual</a>` : ""}</div>
  <form class="grid g3" data-form="noop" role="search" aria-label="Filtrar facturas">
    <div class="field"><label for="fq">Buscar</label><input id="fq" type="search" placeholder="Número, cliente o NIT" value="${esc(UI.filtros.fq || "")}" data-in="fq"></div>
    <div class="field"><label for="fe">Estado</label><select id="fe" data-ch="fe"><option value="">Todos</option>${["Pendiente","Autorizada","Rechazada","Sin remisión","Alistamiento","En tránsito","Entregada","Con novedad"].map(s => `<option ${fe === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
    <div class="field"><label for="fsu">Sucursal</label><select id="fsu" data-ch="fsu"><option value="">Todas</option>${DB.sucursales.map(s => `<option value="${s.id}" ${fsu === s.id ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></div>
  </form>
  <div class="tw"><table><caption class="sr">Listado de facturas</caption><thead><tr><th>Número</th><th>Origen</th><th>Fecha</th><th>Cliente</th><th>Destino</th><th class="r">Total</th><th>Autorización</th><th>Logística</th><th>Cartera</th></tr></thead><tbody>
  ${shown.map(f => { const c = cli(f.clienteId); const el = estadoLogistico(f); return `<tr>
    <td><button class="linklike mono" data-act="verFactura" data-id="${f.id}">${f.numero}</button></td><td>${f.origen === "Pedido" ? `<span class="mono">${esc(origenTxt(f))}</span>` : pill("Manual", "")}</td><td>${fdate(f.fecha)}</td><td>${esc(c.nombre)}</td><td>${esc(ciudad(f.ciudadDestinoId)?.nombre)}</td><td class="r">${money(f.total)}</td><td>${pillFactura(f)}</td><td>${f.estado === "Autorizada" ? pill(el[0], el[1]) : "—"}</td><td>${f.estado !== "Autorizada" ? "—" : f.pagada ? pill("Pagada","ok") : pill("Por cobrar","")}</td></tr>`; }).join("") || `<tr><td colspan="9" class="empty">No hay facturas con esos filtros.</td></tr>`}
  </tbody></table></div>
  <div class="row between"><span class="muted">${shown.length} de ${list.length} facturas</span>${list.length > shown.length ? `<button class="btn" data-act="masFacturas">Mostrar más</button>` : ""}</div>`;
}

function nuevoDraft(modo){ return { modo, clienteId:"", sucursalId: ME.sucursalId || "S1", paisId:"CO", estadoId:"ANT", ciudadId:"", items:[{ productoId:"", cantidad:1 }], obs:"", errores:{} }; }
function vFacturaNueva(){
  const modo = ruta() === "pedido-nuevo" ? "pedido" : "manual";
  if (UI.draft && UI.draft.modo !== modo) UI.draft = null;
  const d = UI.draft || (UI.draft = nuevoDraft(modo));
  const esPed = modo === "pedido", volver = esPed ? "#pedidos" : "#facturas";
  const c = d.clienteId ? cli(d.clienteId) : null;
  const items = d.items.filter(it => it.productoId).map(it => ({ ...it, precio: prod(it.productoId).precio, cantidad: Math.max(0, parseInt(it.cantidad) || 0) }));
  const t = calcTotales(items);
  const disp = c ? cupoDisponible(c) : 0;
  const cupoOk = !c || t.total <= disp;
  const E = d.errores || {};
  return `
  <div class="page-head"><div><p class="eyebrow">Caso de uso · ${esPed ? "Registrar pedido de venta" : "Registrar factura manual (sin pedido)"}</p><h1>${esPed ? "Registrar pedido de venta" : "Registrar factura manual"}</h1><p>${esPed ? "Al guardar, el sistema valida el cupo y la existencia, asigna el número de pedido y envía un correo de confirmación al cliente. Luego se factura con un clic, sin pasar por Gerencia." : "Para ventas que no vienen de un pedido. Al guardar, el sistema valida el cupo y la existencia, asigna el consecutivo de la resolución DIAN y envía la factura a un gerente: no se contabiliza hasta que la autorice."}</p></div>
    <a class="btn" href="${volver}" data-act="cancelDraft">Cancelar</a></div>
  ${E._general ? `<div class="note bad" role="alert">${esc(E._general)}</div>` : ""}
  <form data-form="factura" class="grid" novalidate>
    <section class="panel" aria-labelledby="s-cli"><header><h2 id="s-cli">1. Cliente y origen</h2></header>
      <div class="grid g2">
        <div class="field"><label for="d-cli">Cliente <span aria-hidden="true">*</span></label>
          <select id="d-cli" data-draft="clienteId" required aria-invalid="${!!E.clienteId}" aria-describedby="d-cli-h"><option value="">Selecciona un cliente</option>${DB.clientes.filter(x => x.activo).map(x => `<option value="${x.id}" ${d.clienteId === x.id ? "selected" : ""}>${esc(x.nombre)} · NIT ${esc(x.nit)}</option>`).join("")}</select>
          <span class="hint" id="d-cli-h">${E.clienteId ? `<span style="color:var(--bad)">${esc(E.clienteId)}</span>` : c ? `Cupo ${money(c.cupo)} · disponible <b>${money(disp)}</b>` : "El cupo disponible aparece al elegir el cliente."}</span></div>
        <div class="field"><label for="d-suc">Sucursal que factura y despacha</label>
          <select id="d-suc" data-draft="sucursalId">${DB.sucursales.map(s => `<option value="${s.id}" ${d.sucursalId === s.id ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></div>
      </div>
      ${c ? `<div><div class="row between" style="font-size:.85rem"><span>Uso del cupo con esta factura</span><span class="num">${money(c.cupo - disp + t.total)} de ${money(c.cupo)}</span></div>
        <div class="meter ${!cupoOk ? "bad" : (c.cupo - disp + t.total) / c.cupo > .8 ? "warn" : ""}" role="meter" aria-valuemin="0" aria-valuemax="${c.cupo}" aria-valuenow="${c.cupo - disp + t.total}" aria-label="Uso del cupo"><span style="width:${Math.min(100, (c.cupo - disp + t.total) / c.cupo * 100)}%"></span></div></div>` : ""}
    </section>
    <section class="panel" aria-labelledby="s-dest"><header><h2 id="s-dest">2. Destino del envío</h2><span class="muted" style="font-size:.85rem">Incluye: seleccionar país, estado y ciudad</span></header>
      <div class="grid g3">
        <div class="field"><label for="d-pais">País</label><select id="d-pais" data-draft="paisId">${DB.paises.map(p => `<option value="${p.id}" ${d.paisId === p.id ? "selected" : ""}>${esc(p.nombre)}</option>`).join("")}</select></div>
        <div class="field"><label for="d-est">Departamento / estado</label><select id="d-est" data-draft="estadoId">${DB.estados.filter(e => e.paisId === d.paisId).map(e => `<option value="${e.id}" ${d.estadoId === e.id ? "selected" : ""}>${esc(e.nombre)}</option>`).join("")}</select></div>
        <div class="field"><label for="d-ciu">Ciudad o municipio <span aria-hidden="true">*</span></label><select id="d-ciu" data-draft="ciudadId" aria-invalid="${!!E.ciudadId}" aria-describedby="d-ciu-h"><option value="">Selecciona</option>${DB.ciudades.filter(x => x.estadoId === d.estadoId).map(x => `<option value="${x.id}" ${d.ciudadId === x.id ? "selected" : ""}>${esc(x.nombre)} · ${esc(x.id)}</option>`).join("")}</select>
          <span class="hint" id="d-ciu-h">${E.ciudadId ? `<span style="color:var(--bad)">${esc(E.ciudadId)}</span>` : "Código DANE al lado del nombre. ¿No aparece? El Administrador lo registra en Administración, Ciudades y municipios."}</span></div>
      </div>
    </section>
    <section class="panel" aria-labelledby="s-it"><header><h2 id="s-it">3. Repuestos</h2><button type="button" class="btn sm" data-act="addItem">${icon("plus")} Agregar línea</button></header>
      ${E.items ? `<div class="note bad" role="alert">${esc(E.items)}</div>` : ""}
      <div class="tw"><table class="items-table"><thead><tr><th>Referencia</th><th class="r">Existencia</th><th class="r" style="width:110px">Cantidad</th><th class="r">Precio unit.</th><th class="r">Subtotal</th><th><span class="sr">Quitar</span></th></tr></thead><tbody>
      ${d.items.map((it, i) => { const p = it.productoId ? prod(it.productoId) : null; const st = p ? (p.stock[d.sucursalId] || 0) : 0; const q = parseInt(it.cantidad) || 0; const over = p && q > st; return `<tr>
        <td style="min-width:260px"><label class="sr" for="it-p-${i}">Referencia línea ${i + 1}</label><select id="it-p-${i}" data-item="${i}" data-k="productoId"><option value="">Selecciona</option>${DB.productos.filter(x => x.activo).map(x => `<option value="${x.id}" ${it.productoId === x.id ? "selected" : ""}>${esc(x.sku)} · ${esc(x.nombre)}</option>`).join("")}</select></td>
        <td class="r">${p ? `<span style="color:${over ? "var(--bad)" : "inherit"}">${st}</span>` : "—"}</td>
        <td><label class="sr" for="it-q-${i}">Cantidad línea ${i + 1}</label><input id="it-q-${i}" type="number" min="1" step="1" inputmode="numeric" value="${esc(it.cantidad)}" data-item="${i}" data-k="cantidad" style="text-align:right" aria-invalid="${!!over}"></td>
        <td class="r">${p ? money(p.precio) : "—"}</td><td class="r">${p ? money(p.precio * q) : "—"}</td>
        <td><button type="button" class="btn sm ghost" data-act="delItem" data-i="${i}" aria-label="Quitar línea ${i + 1}" ${d.items.length === 1 ? "disabled" : ""}>✕</button></td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="totals" aria-live="polite"><div><span>Subtotal</span><span>${money(t.subtotal)}</span></div><div><span>IVA 19 %</span><span>${money(t.iva)}</span></div><div class="grand"><span>Total</span><span>${money(t.total)}</span></div></div>
      ${c && !cupoOk ? `<div class="note bad" role="alert"><b>Cupo insuficiente.</b> El total supera el cupo disponible en ${money(t.total - disp)}. Reduce cantidades o pide a Gerencia ampliar el cupo antes de registrar.</div>` : ""}
    </section>
    <section class="panel"><div class="field"><label for="d-obs">Observaciones para Gerencia y Despachos</label><textarea id="d-obs" data-draft="obs" maxlength="400" placeholder="Ej.: pedido tomado por teléfono con el señor Óscar; confirmar referencia del kit antes de alistar.">${esc(d.obs)}</textarea></div>
      <div class="row" style="justify-content:flex-end"><a class="btn" href="${volver}" data-act="cancelDraft">Cancelar</a><button class="btn primary" type="submit">${esPed ? "Registrar pedido y avisar al cliente" : "Validar y enviar a autorización"}</button></div></section>
  </form>`;
}

function vDocFactura(f){
  const c = cli(f.clienteId), s = suc(f.sucursalId), ci = ciudad(f.ciudadDestinoId);
  return `<article class="doc" aria-label="Representación gráfica de la factura ${f.numero}">
    <div class="hd"><div><b style="font-family:var(--f-display);font-size:1.2rem">${esc(DB.empresa.nombre)}</b><br><span class="muted">NIT ${esc(DB.empresa.nit)} · ${esc(s.nombre)}<br>${esc(s.direccion)}, ${esc(ciudad(s.ciudadId).nombre)}</span></div>
      <div style="text-align:right"><span class="eyebrow">Factura electrónica de venta</span><br><b class="mono" style="font-size:1.2rem">${f.numero}</b><br><span class="muted">${fdt(f.fecha)}</span></div></div>
    <dl class="kv"><dt>Cliente</dt><dd>${esc(c.nombre)} · NIT ${esc(c.nit)}</dd><dt>Destino</dt><dd>${esc(ci?.nombre)} (DANE ${esc(ci?.id)})</dd><dt>Contacto</dt><dd>${esc(c.contacto)} · ${esc(c.telefono)}</dd>${f.obs ? `<dt>Observaciones</dt><dd>${esc(f.obs)}</dd>` : ""}</dl>
    <div class="tw"><table><thead><tr><th>Referencia</th><th>Descripción</th><th class="r">Cant.</th><th class="r">Precio</th><th class="r">Subtotal</th></tr></thead><tbody>
      ${f.items.map(it => { const p = prod(it.productoId); return `<tr><td class="mono">${esc(p.sku)}</td><td>${esc(p.nombre)}</td><td class="r">${it.cantidad}</td><td class="r">${money(it.precio)}</td><td class="r">${money(it.precio * it.cantidad)}</td></tr>`; }).join("")}</tbody></table></div>
    <div class="totals"><div><span>Subtotal</span><span>${money(f.subtotal)}</span></div><div><span>IVA 19 %</span><span>${money(f.iva)}</span></div><div class="grand"><span>Total</span><span>${money(f.total)}</span></div></div>
    ${f.cufe ? `<div><span class="eyebrow">CUFE (simulado, ambiente de pruebas)</span><div class="hash">${f.cufe}</div></div>` : `<p class="muted" style="font-size:.85rem">El CUFE se genera al autorizar la factura.</p>`}
    <p class="muted" style="font-size:.78rem">${esc(DB.empresa.resolucion)}</p>
  </article>`;
}
function timelineFactura(f){
  const refs = [f.numero]; if (f.remisionId) refs.push(rem(f.remisionId).numero); if (f.pedidoId) refs.push(byId(DB.pedidos, f.pedidoId).numero);
  const ev = DB.audit.filter(e => refs.includes(e.ref));
  return `<ul class="tl">${ev.map(e => `<li><div><b>${esc(e.accion)}</b> <span class="mono">${esc(e.ref)}</span><br><span class="when">${fdt(e.ts)} · ${esc(e.usuario)} (${esc(e.rol)})</span>${e.detalle ? `<br><span style="font-size:.88rem">${esc(e.detalle)}</span>` : ""}</div></li>`).join("") || "<li><div>Sin eventos</div></li>"}</ul>`;
}
function dlgFactura(id){
  const f = byId(DB.facturas, id); const c = cli(f.clienteId);
  const r = f.remisionId ? rem(f.remisionId) : null;
  const acc = [];
  if (f.estado === "Pendiente" && P("facturas.autorizar")){ acc.push(`<button class="btn danger" data-act="rechazarDlg" data-id="${f.id}">Rechazar</button>`); acc.push(`<button class="btn primary" data-act="autorizar" data-id="${f.id}">Autorizar factura</button>`); }
  if (f.estado === "Autorizada" && !f.remisionId && P("despachos.gestionar")) acc.push(`<button class="btn primary" data-act="nuevaRemision" data-id="${f.id}">Crear remisión</button>`);
  if (f.estado === "Autorizada" && !f.pagada && P("cartera.pagos")) acc.push(`<button class="btn" data-act="pagar" data-id="${f.id}">Registrar pago</button>`);
  const tabs = UI.tab.fac || "doc";
  const certs = DB.certificados.filter(x => x.facturaId === f.id);
  openDlg(`Factura ${f.numero}`, `
    <div class="row">${pillFactura(f)} ${f.estado === "Autorizada" ? pill(...estadoLogistico(f)) : ""} ${f.pagada ? pill("Pagada","ok") : ""}</div>
    ${f.estado === "Rechazada" ? `<div class="note bad"><b>Motivo del rechazo:</b> ${esc(f.motivoRechazo)}<br><span class="muted">${esc(usr(f.revisadoPor)?.nombre)} · ${fdt(f.revisadoEn)}</span></div>` : ""}
    <div class="tabs" role="tablist">${[["doc","Documento"],["traza","Trazabilidad"],["cont","Contabilidad"],["cert","Garantías (" + certs.length + ")"]].map(([k, l]) => `<button role="tab" aria-selected="${tabs === k}" data-act="tab" data-g="fac" data-v="${k}" data-ref="${f.id}">${l}</button>`).join("")}</div>
    ${tabs === "doc" ? vDocFactura(f) + `<dl class="kv"><dt>Registró</dt><dd>${esc(usr(f.creadoPor)?.nombre)} (${esc(usr(f.creadoPor)?.rol)})</dd><dt>Origen</dt><dd>${f.origen === "Pedido" ? esc(origenTxt(f)) + " · contabilizada automáticamente" : "Factura manual sin pedido · requiere autorización de gerente"}</dd>${f.revisadoPor ? `<dt>${f.estado === "Rechazada" ? "Rechazó" : f.origen === "Pedido" ? "Contabilizó" : "Autorizó"}</dt><dd>${esc(nombreUsr(f.revisadoPor))} · ${fdt(f.revisadoEn)}</dd>` : ""}${r ? `<dt>Remisión</dt><dd class="mono">${r.numero} · ${esc(r.estado)}</dd>` : ""}</dl>` : ""}
    ${tabs === "traza" ? timelineFactura(f) + (f.cufe ? `<div class="row"><button class="btn" data-act="verifCufe" data-id="${f.id}">Verificar integridad del documento</button><span id="cufe-res" aria-live="polite"></span></div>` : "") : ""}
    ${tabs === "cont" ? (f.asiento ? `<p><b>Asiento ${f.asiento.numero}</b> · ${fdt(f.asiento.fecha)} · contabilización automática al autorizar</p><div class="tw"><table><thead><tr><th>Cuenta PUC</th><th>Nombre</th><th class="r">Débito</th><th class="r">Crédito</th></tr></thead><tbody>${f.asiento.lineas.map(l => `<tr><td class="mono">${l.cuenta}</td><td>${esc(l.nombre)}</td><td class="r">${l.debito ? money(l.debito) : ""}</td><td class="r">${l.credito ? money(l.credito) : ""}</td></tr>`).join("")}<tr><th colspan="2">Sumas iguales</th><th class="r">${money(sum(f.asiento.lineas, l => l.debito))}</th><th class="r">${money(sum(f.asiento.lineas, l => l.credito))}</th></tr></tbody></table></div>` : `<p class="muted">La factura se contabiliza automáticamente cuando Gerencia la autoriza.</p>`) : ""}
    ${tabs === "cert" ? (certs.length ? `<div class="tw"><table><thead><tr><th>Código</th><th>Referencia</th><th class="r">Cant.</th><th>Vence</th></tr></thead><tbody>${certs.map(x => `<tr><td class="mono">${x.codigo}</td><td>${esc(prod(x.productoId).nombre)}</td><td class="r">${x.cantidad}</td><td>${fdate(x.vence)}</td></tr>`).join("")}</tbody></table></div><p class="muted" style="font-size:.85rem">El cliente verifica cada código en la sección Certificados, sin necesidad de usuario.</p>` : `<p class="muted">Los certificados de garantía se emiten al autorizar la factura (solo referencias con garantía).</p>`) : ""}
  `, acc.join(""));
}
