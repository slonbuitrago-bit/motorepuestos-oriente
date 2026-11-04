"use strict";
/* Motorepuestos del Oriente
   Vista · Autorización de facturas manuales. */

/* --- Autorizaciones --- */
function vAutorizaciones(){
  const pend = DB.facturas.filter(f => f.estado === "Pendiente").sort((a, b) => a.fecha.localeCompare(b.fecha));
  return `<div class="page-head"><div><p class="eyebrow">Caso de uso · Autorizar factura manual</p><h1>Autorizaciones</h1><p>Solo llegan aquí las facturas manuales, las que no vienen de un pedido de venta. Al autorizar se contabiliza el asiento, se descuenta el inventario, se genera el CUFE, se emiten los certificados de garantía y se envía la factura al cliente por correo. Quien registra una factura no puede autorizarla.</p></div></div>
  ${pend.length ? `<div class="cards">${pend.map(f => { const c = cli(f.clienteId); const disp = cupoDisponible(c, f.id); const ok = f.total <= disp; const own = f.creadoPor === ME.id;
    const sinStock = f.items.filter(it => (prod(it.productoId).stock[f.sucursalId] || 0) < it.cantidad);
    return `<article class="panel" aria-labelledby="a-${f.id}"><header><h3 id="a-${f.id}" class="mono">${f.numero}</h3>${pillFactura(f)}</header>
      <dl class="kv"><dt>Cliente</dt><dd>${esc(c.nombre)}</dd><dt>Destino</dt><dd>${esc(ciudad(f.ciudadDestinoId)?.nombre)}</dd><dt>Registró</dt><dd>${esc(usr(f.creadoPor)?.nombre)} · ${fdt(f.fecha)}</dd><dt>Total</dt><dd><b>${money(f.total)}</b> · ${f.items.length} líneas</dd><dt>Cupo</dt><dd>${ok ? pill("Disponible " + money(disp), "ok") : pill("Excede en " + money(f.total - disp), "bad")}</dd><dt>Existencias</dt><dd>${sinStock.length ? pill(sinStock.length + " sin existencia", "bad") : pill("Completas en " + suc(f.sucursalId).nombre.split(" ")[0], "ok")}</dd></dl>
      ${own ? `<div class="note warn">Tú registraste esta factura. Por segregación de funciones debe autorizarla otro gerente.</div>` : ""}
      <div class="row"><button class="btn sm" data-act="verFactura" data-id="${f.id}">Ver detalle</button><span style="flex:1"></span><button class="btn sm danger" data-act="rechazarDlg" data-id="${f.id}" ${own ? "disabled" : ""}>Rechazar</button><button class="btn sm primary" data-act="autorizar" data-id="${f.id}" ${own || !ok || sinStock.length ? "disabled" : ""}>Autorizar</button></div>
    </article>`; }).join("")}</div>` : `<div class="panel empty"><h2>No hay facturas por autorizar</h2><p>Cuando Logística registre una factura manual aparecerá aquí.</p></div>`}
  <section class="panel"><header><h2>Últimas decisiones</h2></header><div class="tw"><table><thead><tr><th>Factura</th><th>Decisión</th><th>Por</th><th>Fecha</th><th>Motivo</th></tr></thead><tbody>
  ${DB.facturas.filter(f => f.revisadoEn && f.origen !== "Pedido").sort((a, b) => b.revisadoEn.localeCompare(a.revisadoEn)).slice(0, 8).map(f => `<tr><td><button class="linklike mono" data-act="verFactura" data-id="${f.id}">${f.numero}</button></td><td>${pillFactura(f)}</td><td>${esc(nombreUsr(f.revisadoPor))}</td><td>${fdt(f.revisadoEn)}</td><td class="wrap">${esc(f.motivoRechazo || "")}</td></tr>`).join("")}
  </tbody></table></div></section>`;
}
