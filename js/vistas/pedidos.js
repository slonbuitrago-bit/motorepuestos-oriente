"use strict";
/* Motorepuestos del Oriente
   Vista · Pedidos de venta. */

/* --- Pedidos de venta --- */
function vPedidos(){
  const fe = UI.filtros.pe || "";
  const list = DB.pedidos.filter(p => !fe || p.estado === fe).slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const shown = list.slice(0, UI.filtros.plim || 40);
  const reg = DB.pedidos.filter(p => p.estado === "Registrado");
  return `<div class="page-head"><div><p class="eyebrow">Ventas</p><h1>Pedidos de venta</h1><p>Los pedidos confirmados por el cliente se facturan con un clic y quedan contabilizados sin pasar por Gerencia. Solo las facturas manuales, sin pedido, necesitan autorización. Cada pedido, factura, despacho y pago se avisa al cliente por correo.</p></div>
    ${P("pedidos.gestionar") ? `<a class="btn primary" href="#pedido-nuevo">${icon("plus")} Registrar pedido</a>` : ""}</div>
  <section class="kpis" aria-label="Resumen de pedidos" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    <div class="kpi"><span class="l">Por facturar</span><span class="v">${reg.length}</span><span class="d muted">${money(sum(reg, p => p.total))} comprometidos en cupo</span></div>
    <div class="kpi"><span class="l">Facturados</span><span class="v">${DB.pedidos.filter(p => p.estado === "Facturado").length}</span><span class="d muted">últimos 6 meses</span></div>
    <div class="kpi"><span class="l">Facturas desde pedido</span><span class="v">${DB.facturas.length ? Math.round(DB.facturas.filter(f => f.origen === "Pedido").length / DB.facturas.length * 100) : 0} %</span><span class="d muted">el resto son manuales</span></div>
  </section>
  <div class="field" style="max-width:260px"><label for="pe">Estado</label><select id="pe" data-ch="pe"><option value="">Todos</option>${["Registrado","Facturado","Anulado"].map(x => `<option ${fe === x ? "selected" : ""}>${x}</option>`).join("")}</select></div>
  <div class="tw"><table><caption class="sr">Pedidos de venta</caption><thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Destino</th><th class="r">Total</th><th>Estado</th><th>Factura</th><th></th></tr></thead><tbody>
  ${shown.map(p => { const f = p.facturaId ? byId(DB.facturas, p.facturaId) : null; return `<tr><td class="mono">${p.numero}</td><td>${fdt(p.fecha)}</td><td>${esc(cli(p.clienteId).nombre)}</td><td>${esc(ciudad(p.ciudadDestinoId)?.nombre)}</td><td class="r">${money(p.total)}</td>
    <td>${pill(p.estado, { Registrado:"warn", Facturado:"ok", Anulado:"" }[p.estado])}${p.motivoAnulacion ? `<br><span class="muted" style="font-size:.8rem">${esc(p.motivoAnulacion)}</span>` : ""}</td>
    <td>${f ? `<button class="linklike mono" data-act="verFactura" data-id="${f.id}">${f.numero}</button>` : "—"}</td>
    <td>${p.estado === "Registrado" && P("pedidos.gestionar") ? `<div class="row" style="flex-wrap:nowrap"><button class="btn sm primary" data-act="facturarPedido" data-id="${p.id}">Facturar</button><button class="btn sm" data-act="anularPedidoDlg" data-id="${p.id}">Anular</button></div>` : ""}</td></tr>`; }).join("") || `<tr><td colspan="8" class="empty">No hay pedidos con ese estado.</td></tr>`}
  </tbody></table></div>
  <div class="row between"><span class="muted">${shown.length} de ${list.length} pedidos</span>${list.length > shown.length ? `<button class="btn" data-act="masPedidos">Mostrar más</button>` : ""}</div>`;
}
