"use strict";
/* Motorepuestos del Oriente
   Vista · Tablero con indicadores y gráficos. */

/* --- Tablero --- */
function vInicio(){
  const fs = UI.filtros.dashSuc || "";
  const F = DB.facturas.filter(f => !fs || f.sucursalId === fs);
  const aut = F.filter(f => f.estado === "Autorizada");
  const now = new Date();
  const mesAct = aut.filter(f => { const d = new Date(f.fecha); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const mesAnt = aut.filter(f => { const d = new Date(f.fecha); const p = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === p.getMonth() && d.getFullYear() === p.getFullYear() && d.getDate() <= now.getDate(); });
  const vAct = sum(mesAct, f => f.subtotal), vAnt = sum(mesAnt, f => f.subtotal);
  const delta = vAnt ? (vAct - vAnt) / vAnt * 100 : 0;
  const pend = F.filter(f => f.estado === "Pendiente").length;
  const rems = DB.remisiones.filter(r => { const f = byId(DB.facturas, r.facturaId); return !fs || f.sucursalId === fs; });
  const transito = rems.filter(r => r.estado === "En tránsito").length;
  const cerradas = rems.filter(r => r.estado === "Entregada" || r.estado === "Con novedad");
  const conformes = cerradas.length ? cerradas.filter(r => r.estado === "Entregada").length / cerradas.length * 100 : 100;
  const bajo = DB.productos.filter(p => stockTotal(p) < p.minimo * 1.6);
  const novAb = DB.novedades.filter(n => n.estado === "Abierta").length;

  // ventas por mes (6)
  const meses = [];
  for (let m = 5; m >= 0; m--){ const d = new Date(now.getFullYear(), now.getMonth() - m, 1); meses.push({ y:d.getFullYear(), m:d.getMonth(), label:MESES[d.getMonth()], value:0 }); }
  aut.forEach(f => { const d = new Date(f.fecha); const x = meses.find(z => z.y === d.getFullYear() && z.m === d.getMonth()); if (x) x.value += f.subtotal; });
  // ventas por municipio
  const mun = {};
  aut.forEach(f => { const c = ciudad(f.ciudadDestinoId)?.nombre || "—"; mun[c] = (mun[c] || 0) + f.subtotal; });
  const munArr = Object.entries(mun).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const maxMun = munArr.length ? munArr[0][1] : 1;
  // top productos
  const tp = {};
  aut.forEach(f => f.items.forEach(it => tp[it.productoId] = (tp[it.productoId] || 0) + it.cantidad * it.precio));
  const top = Object.entries(tp).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalTop = sum(Object.values(tp), x => x) || 1;

  const tareas = [];
  if (P("facturas.autorizar")) tareas.push([pend, "facturas esperan tu autorización", "Revisa cantidades, cupo y destino antes de autorizar.", "autorizaciones"]);
  if (P("despachos.gestionar")){ tareas.push([DB.facturas.filter(f => f.estado === "Autorizada" && !f.remisionId).length, "facturas autorizadas sin remisión", "Crea la remisión con las instrucciones de envío.", "despachos"]); tareas.push([DB.remisiones.filter(r => r.estado === "Alistamiento").length, "remisiones en alistamiento", "Haz el conteo ciego antes de despachar.", "despachos"]); }
  if (P("pedidos.gestionar")) tareas.push([DB.pedidos.filter(p => p.estado === "Registrado").length, "pedidos de venta por facturar", "Al facturarlos quedan contabilizados y se avisa al cliente por correo.", "pedidos"]);
  if (P("facturas.crear")) tareas.push([DB.facturas.filter(f => f.estado === "Rechazada" && f.creadoPor === ME.id).length, "facturas tuyas fueron rechazadas", "Lee el motivo y registra una nueva factura corregida.", "facturas"]);
  if (P("inventario.gestionar")) tareas.push([bajo.length, "referencias bajo el stock mínimo", "Programa traslado o pedido de importación.", "inventario"]);
  if (P("importaciones.gestionar")) tareas.push([DB.importaciones.filter(i => i.estado !== "Recibida").length, "importaciones en curso", "Actualiza el estado y recibe la mercancía al llegar.", "importaciones"]);
  if (P("auditoria.ver")) tareas.push([novAb, "novedades de entrega abiertas", "Diferencias entre lo facturado y lo recibido.", "despachos"]);

  return `
  <div class="page-head"><div><p class="eyebrow">${esc(fdate(now.toISOString()))} · ${esc(ME.rol)}</p><h1>Hola, ${esc(ME.nombre.split(" ")[0])}</h1>
    <p>Resumen de la operación. Las cifras de ventas son valores antes de IVA de facturas autorizadas.</p></div>
    <div class="field" style="min-width:220px"><label for="f-dsuc">Sucursal</label><select id="f-dsuc" data-ch="dashSuc"><option value="">Todas las sucursales</option>${DB.sucursales.map(s => `<option value="${s.id}" ${fs === s.id ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></div>
  </div>
  ${tareas.length ? `<section aria-labelledby="t-tareas" class="grid" style="gap:10px"><h2 id="t-tareas" class="sr">Tus pendientes</h2><div class="cards">
    ${tareas.map(t => `<div class="task"><span class="n">${t[0]}</span><div><b>${esc(t[1])}</b><br><span class="muted" style="font-size:.85rem">${esc(t[2])}</span></div><a class="btn sm" href="#${t[3]}">Ir</a></div>`).join("")}</div></section>` : ""}
  <section class="kpis" aria-label="Indicadores clave">
    <div class="kpi"><span class="l">Ventas del mes</span><span class="v" title="${money(vAct)}">${short(vAct)}</span><span class="d" style="color:${delta >= 0 ? "var(--ok)" : "var(--bad)"}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)} % vs. mismo corte mes anterior</span></div>
    <div class="kpi"><span class="l">Por autorizar</span><span class="v">${pend}</span><span class="d muted">facturas manuales</span></div>
    <div class="kpi"><span class="l">En tránsito</span><span class="v">${transito}</span><span class="d muted">remisiones en ruta</span></div>
    <div class="kpi"><span class="l">Entregas conformes</span><span class="v">${conformes.toFixed(1)} %</span><span class="d muted">${cerradas.length} entregas · ${novAb} novedades abiertas</span></div>
    <div class="kpi"><span class="l">Bajo stock mínimo</span><span class="v" style="color:${bajo.length ? "var(--warn)" : "inherit"}">${bajo.length}</span><span class="d muted">referencias</span></div>
  </section>
  <div class="grid g2">
    <section class="panel" aria-labelledby="c1"><header><h2 id="c1">Ventas por mes</h2><span class="muted" style="font-size:.85rem">COP antes de IVA</span></header>
      <div class="chart">${barChart(meses)}</div>
      <table class="sr"><caption>Ventas por mes</caption><tbody>${meses.map(m => `<tr><th>${m.label} ${m.y}</th><td>${money(m.value)}</td></tr>`).join("")}</tbody></table></section>
    <section class="panel" aria-labelledby="c2"><header><h2 id="c2">Ventas por municipio de destino</h2><span class="muted" style="font-size:.85rem">6 meses</span></header>
      <div class="hbars">${munArr.map(([n, v]) => `<div class="hbar"><span>${esc(n)}</span><div class="track" aria-hidden="true"><div class="fill" style="width:${(v / maxMun * 100).toFixed(1)}%"></div></div><span class="num">${money(v)}</span></div>`).join("") || '<p class="empty">Sin ventas</p>'}</div></section>
  </div>
  <div class="grid g2">
    <section class="panel" aria-labelledby="c3"><header><h2 id="c3">Referencias más vendidas</h2></header>
      <div class="tw"><table><thead><tr><th>Referencia</th><th class="r">Ventas</th><th class="r">Participación</th></tr></thead><tbody>
      ${top.map(([id, v]) => `<tr><td><span class="mono">${esc(prod(id).sku)}</span> ${esc(prod(id).nombre)}</td><td class="r">${money(v)}</td><td class="r">${(v / totalTop * 100).toFixed(1)} %</td></tr>`).join("")}</tbody></table></div></section>
    <section class="panel" aria-labelledby="c4"><header><h2 id="c4">Actividad reciente</h2><span class="muted" style="font-size:.85rem">Bitácora encadenada</span></header>
      <ul class="tl">${DB.audit.slice(-6).reverse().map(e => `<li><div><b>${esc(e.accion)}</b> <span class="mono">${esc(e.ref)}</span><br><span class="when">${fdt(e.ts)} · ${esc(e.usuario)} (${esc(e.rol)})</span></div></li>`).join("")}</ul></section>
  </div>`;
}
function barChart(data){
  const W = 600, H = 240, pl = 64, pb = 28, pt = 14, pr = 10;
  const max = Math.max(1, ...data.map(d => d.value));
  const step = niceStep(max / 4); const top = Math.ceil(max / step) * step;
  const iw = W - pl - pr, ih = H - pt - pb, bw = iw / data.length;
  let g = "";
  for (let v = 0; v <= top; v += step){ const y = pt + ih - v / top * ih; g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="${v ? "3 4" : ""}"/><text x="${pl - 8}" y="${y + 4}" text-anchor="end">${short(v)}</text>`; }
  data.forEach((d, i) => {
    const h = d.value / top * ih, x = pl + i * bw + bw * .2, y = pt + ih - h;
    const last = i === data.length - 1;
    g += `<rect x="${x}" y="${y}" width="${bw * .6}" height="${h}" rx="3" fill="var(--accent)" opacity="${last ? 1 : .55}"/>`;
    g += `<text x="${x + bw * .3}" y="${H - 8}" text-anchor="middle">${d.label}</text>`;
    if (last) g += `<text x="${x + bw * .3}" y="${y - 6}" text-anchor="middle" style="fill:var(--ink);font-weight:700">${short(d.value)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de barras de ventas de los últimos seis meses">${g}</svg>`;
}
function niceStep(x){ const p = Math.pow(10, Math.floor(Math.log10(x || 1))); const n = x / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
function short(v){ return v >= 1e6 ? "$" + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(".", ",") + " M" : v >= 1e3 ? "$" + Math.round(v / 1e3) + " mil" : "$" + v; }
