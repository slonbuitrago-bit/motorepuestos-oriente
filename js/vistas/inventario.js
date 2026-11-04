"use strict";
/* Motorepuestos del Oriente
   Vista · Inventario, kárdex, ajustes, traslados y productos. */

/* --- Inventario --- */
function vInventario(){
  const q = (UI.filtros.iq || "").toLowerCase(), cat = UI.filtros.icat || "";
  const cats = [...new Set(DB.productos.map(p => p.categoria))].sort();
  const list = DB.productos.filter(p => (!cat || p.categoria === cat) && (!q || (p.sku + " " + p.nombre + " " + p.compat).toLowerCase().includes(q)));
  const valor = sum(DB.productos, p => stockTotal(p) * p.costo);
  return `<div class="page-head"><div><h1>Inventario</h1><p>Existencias por sucursal, costo y alertas de stock mínimo. Cada movimiento queda en el kárdex con usuario y documento soporte.</p></div>
    <div class="row">${P("inventario.gestionar") ? `<button class="btn" data-act="trasladoDlg">Traslado entre sucursales</button><button class="btn primary" data-act="productoDlg">${icon("plus")} Nueva referencia</button>` : ""}</div></div>
  <section class="kpis" aria-label="Resumen de inventario" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    <div class="kpi"><span class="l">Referencias activas</span><span class="v">${DB.productos.filter(p => p.activo).length}</span></div>
    <div class="kpi"><span class="l">Unidades en bodega</span><span class="v">${NUM.format(sum(DB.productos, stockTotal))}</span></div>
    <div class="kpi"><span class="l">Valor al costo</span><span class="v">${short(valor)}</span><span class="d muted">${money(valor)}</span></div>
    <div class="kpi"><span class="l">Importadas</span><span class="v">${DB.productos.filter(p => p.origen === "Importado").length}</span><span class="d muted">Zona Libre de Colón</span></div>
  </section>
  <div class="grid g2"><div class="field"><label for="iq">Buscar referencia</label><input id="iq" type="search" placeholder="SKU, nombre o moto compatible" value="${esc(UI.filtros.iq || "")}" data-in="iq"></div>
    <div class="field"><label for="icat">Categoría</label><select id="icat" data-ch="icat"><option value="">Todas</option>${cats.map(c => `<option ${cat === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></div></div>
  <div class="tw"><table><caption class="sr">Inventario por sucursal</caption><thead><tr><th>SKU</th><th>Descripción</th><th>Compatible con</th>${DB.sucursales.map(s => `<th class="r">${esc(s.nombre.split(" ")[0])}</th>`).join("")}<th class="r">Total</th><th class="r">Mínimo</th><th class="r">Precio</th><th>Estado</th><th></th></tr></thead><tbody>
  ${list.map(p => { const t = stockTotal(p); const st = t < p.minimo ? ["Crítico","bad"] : t < p.minimo * 1.6 ? ["Bajo","warn"] : ["Normal","ok"]; return `<tr><td class="mono">${esc(p.sku)}</td><td>${esc(p.nombre)}<br><span class="muted" style="font-size:.8rem">${esc(p.categoria)} · ${esc(p.origen)}</span></td><td class="wrap muted">${esc(p.compat)}</td>${DB.sucursales.map(s => `<td class="r">${p.stock[s.id] || 0}</td>`).join("")}<td class="r"><b>${t}</b></td><td class="r">${p.minimo}</td><td class="r">${money(p.precio)}</td><td>${pill(st[0], st[1])}</td><td><div class="row" style="flex-wrap:nowrap"><button class="btn sm" data-act="kardex" data-id="${p.id}">Kárdex</button>${P("inventario.gestionar") ? `<button class="btn sm" data-act="ajusteDlg" data-id="${p.id}">Ajustar</button>` : ""}</div></td></tr>`; }).join("") || `<tr><td colspan="12" class="empty">Sin resultados.</td></tr>`}
  </tbody></table></div>`;
}
function dlgKardex(id){
  const p = prod(id); const mv = DB.kardex.filter(k => k.productoId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  openDlg(`Kárdex · ${p.sku}`, `<p><b>${esc(p.nombre)}</b> · costo ${money(p.costo)} · garantía ${p.garantiaMeses ? p.garantiaMeses + " meses" : "no aplica"}</p>
  <div class="tw"><table><thead><tr><th>Fecha</th><th>Sucursal</th><th>Movimiento</th><th class="r">Cantidad</th><th>Documento</th><th>Usuario</th></tr></thead><tbody>${mv.map(k => `<tr><td>${fdt(k.fecha)}</td><td>${esc(suc(k.sucursalId)?.nombre.split(" ")[0])}</td><td>${esc(k.tipo)}</td><td class="r" style="color:${k.cantidad < 0 ? "var(--bad)" : "var(--ok)"}">${k.cantidad > 0 ? "+" : ""}${k.cantidad}</td><td class="mono">${esc(k.ref)}</td><td>${esc(k.usuario)}</td></tr>`).join("") || `<tr><td colspan="6" class="empty">Sin movimientos.</td></tr>`}</tbody></table></div>`, `<button class="btn" data-act="cerrarDlg">Cerrar</button>`);
}
function dlgAjuste(id){
  const p = prod(id);
  openDlg(`Ajuste de inventario · ${p.sku}`, `<form id="frm-aj" data-form="ajuste" data-id="${p.id}" class="grid">
    <p class="muted">Los ajustes requieren motivo y quedan en la bitácora de auditoría. Usa valores negativos para salidas (daño, pérdida).</p>
    <div class="grid g2"><div class="field"><label for="aj-s">Sucursal</label><select id="aj-s" name="suc">${DB.sucursales.map(s => `<option value="${s.id}">${esc(s.nombre)} (${p.stock[s.id] || 0})</option>`).join("")}</select></div>
    <div class="field"><label for="aj-c">Cantidad (+/−)</label><input id="aj-c" name="cant" type="number" required step="1"></div></div>
    <div class="field"><label for="aj-m">Motivo *</label><select id="aj-m" name="motivo"><option>Conteo físico (inventario cíclico)</option><option>Producto averiado</option><option>Devolución de cliente</option><option>Pérdida o hurto</option></select></div>
    <div class="field"><label for="aj-d">Detalle *</label><textarea id="aj-d" name="detalle" required minlength="10" placeholder="Describe qué pasó y quién lo verificó"></textarea></div><div id="aj-err" role="alert"></div></form>`,
    `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-aj">Registrar ajuste</button>`);
}
function dlgTraslado(){
  openDlg("Traslado entre sucursales", `<form id="frm-tr" data-form="traslado" class="grid">
    <div class="field"><label for="tr-p">Referencia</label><select id="tr-p" name="prod">${DB.productos.map(p => `<option value="${p.id}">${esc(p.sku)} · ${esc(p.nombre)}</option>`).join("")}</select></div>
    <div class="grid g3"><div class="field"><label for="tr-o">Origen</label><select id="tr-o" name="o">${DB.sucursales.map(s => `<option value="${s.id}">${esc(s.nombre)}</option>`).join("")}</select></div>
    <div class="field"><label for="tr-d">Destino</label><select id="tr-d" name="d">${DB.sucursales.map((s, i) => `<option value="${s.id}" ${i === 1 ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></div>
    <div class="field"><label for="tr-c">Cantidad</label><input id="tr-c" name="cant" type="number" min="1" required></div></div><div id="tr-err" role="alert"></div></form>`,
    `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-tr">Registrar traslado</button>`);
}
function dlgProducto(){
  openDlg("Nueva referencia", `<form id="frm-pr" data-form="producto" class="grid g2">
    <div class="field"><label for="pr-sku">SKU *</label><input id="pr-sku" name="sku" required pattern="[A-Z0-9-]{4,20}" placeholder="FRE-DISC-220" aria-describedby="pr-sku-h"><span class="hint" id="pr-sku-h">Mayúsculas, números y guiones.</span></div>
    <div class="field"><label for="pr-n">Descripción *</label><input id="pr-n" name="nombre" required></div>
    <div class="field"><label for="pr-cp">Compatible con</label><input id="pr-cp" name="compat" placeholder="Modelos de moto"></div>
    <div class="field"><label for="pr-cat">Categoría</label><input id="pr-cat" name="categoria" list="cats" required><datalist id="cats">${[...new Set(DB.productos.map(p => p.categoria))].map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
    <div class="field"><label for="pr-co">Costo *</label><input id="pr-co" name="costo" type="number" min="1" required></div>
    <div class="field"><label for="pr-pv">Precio de venta *</label><input id="pr-pv" name="precio" type="number" min="1" required></div>
    <div class="field"><label for="pr-mi">Stock mínimo</label><input id="pr-mi" name="minimo" type="number" min="0" value="10"></div>
    <div class="field"><label for="pr-ga">Garantía (meses)</label><input id="pr-ga" name="garantia" type="number" min="0" value="6"></div>
    <div class="field"><label for="pr-or">Origen</label><select id="pr-or" name="origen"><option>Importado</option><option>Nacional</option></select></div>
    <div id="pr-err" role="alert"></div></form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-pr">Guardar referencia</button>`);
}
