"use strict";
/* Motorepuestos del Oriente
   Vista · Importaciones y costeo nacionalizado. */

/* --- Importaciones --- */
const FLUJO_IMP = ["Orden emitida","En tránsito","En aduana","Nacionalizada","Recibida"];
function costeo(im){
  const fob = sum(im.items, it => it.cantidad * it.fobUSD);
  const cif = fob + im.fleteUSD + im.seguroUSD;
  const cifCOP = cif * im.trm, arancel = cifCOP * im.arancelPct / 100, ivaImp = (cifCOP + arancel) * IVA;
  const costoTotal = cifCOP + arancel; // IVA importación es descontable
  return { fob, cif, cifCOP, arancel, ivaImp, costoTotal, factor: fob ? costoTotal / (fob * im.trm) : 1 };
}
function vImportaciones(){
  return `<div class="page-head"><div><h1>Importaciones</h1><p>Órdenes al proveedor de la Zona Libre de Colón (Panamá). El costo nacionalizado reparte flete, seguro y arancel sobre el valor FOB. La mercancía solo entra al inventario cuando se recibe y cuenta en bodega.</p></div>
    <button class="btn primary" data-act="importDlg">${icon("plus")} Nueva orden</button></div>
  <div class="cards">${DB.importaciones.slice().reverse().map(im => { const k = costeo(im); const idx = FLUJO_IMP.indexOf(im.estado); return `<article class="panel" aria-labelledby="im-${im.id}">
    <header><h3 id="im-${im.id}" class="mono">${im.numero}</h3>${pill(im.estado, im.estado === "Recibida" ? "ok" : im.estado === "En aduana" ? "warn" : "info")}</header>
    <ol class="row" style="list-style:none;padding:0;margin:0;gap:4px" aria-label="Avance">${FLUJO_IMP.map((s, i) => `<li title="${s}" style="flex:1;height:6px;border-radius:3px;background:${i <= idx ? "var(--accent)" : "var(--surface-2)"}"><span class="sr">${s}${i <= idx ? " completado" : ""}</span></li>`).join("")}</ol>
    <dl class="kv"><dt>Proveedor</dt><dd>${esc(byId(DB.proveedores, im.proveedorId).nombre)}</dd><dt>Fecha</dt><dd>${fdate(im.fecha)}</dd><dt>Referencias</dt><dd>${im.items.length} · ${NUM.format(sum(im.items, i => i.cantidad))} unidades</dd><dt>FOB</dt><dd>${USD.format(k.fob)}</dd><dt>Costo nacionalizado</dt><dd>${money(k.costoTotal)} <span class="muted">(factor ${k.factor.toFixed(3)})</span></dd><dt>DIM</dt><dd class="mono">${esc(im.dim || "—")}</dd><dt>Cert. origen</dt><dd class="mono">${esc(im.certificadoOrigen || "—")}</dd></dl>
    <div class="row"><button class="btn sm" data-act="verImport" data-id="${im.id}">Detalle y costeo</button>${im.estado !== "Recibida" ? `<button class="btn sm primary" data-act="avanzarImport" data-id="${im.id}">${im.estado === "Nacionalizada" ? "Recibir en bodega" : "Pasar a " + FLUJO_IMP[idx + 1]}</button>` : ""}</div></article>`; }).join("")}</div>`;
}
function dlgImport(id){
  const im = byId(DB.importaciones, id), k = costeo(im);
  openDlg(`Importación ${im.numero}`, `<dl class="kv"><dt>Estado</dt><dd>${esc(im.estado)}</dd><dt>TRM</dt><dd>${money(im.trm)}</dd><dt>Flete / seguro</dt><dd>${USD.format(im.fleteUSD)} / ${USD.format(im.seguroUSD)}</dd><dt>Arancel</dt><dd>${im.arancelPct} %</dd><dt>Destino</dt><dd>${esc(suc(im.sucursalId).nombre)}</dd></dl>
    <div class="tw"><table><thead><tr><th>Referencia</th><th class="r">Cant.</th><th class="r">FOB unit.</th><th class="r">Costo unit. nacionalizado</th><th class="r">Costo actual</th></tr></thead><tbody>${im.items.map(it => { const p = prod(it.productoId); const cu = it.fobUSD * im.trm * k.factor; return `<tr><td><span class="mono">${esc(p.sku)}</span> ${esc(p.nombre)}</td><td class="r">${it.cantidad}</td><td class="r">${USD.format(it.fobUSD)}</td><td class="r">${money(cu)}</td><td class="r">${money(p.costo)}</td></tr>`; }).join("")}</tbody></table></div>
    <div class="totals"><div><span>FOB</span><span>${USD.format(k.fob)}</span></div><div><span>CIF</span><span>${USD.format(k.cif)}</span></div><div><span>CIF en pesos</span><span>${money(k.cifCOP)}</span></div><div><span>Arancel</span><span>${money(k.arancel)}</span></div><div><span>IVA importación (descontable)</span><span>${money(k.ivaImp)}</span></div><div class="grand"><span>Costo nacionalizado</span><span>${money(k.costoTotal)}</span></div></div>`, `<button class="btn" data-act="cerrarDlg">Cerrar</button>`);
}
function dlgNuevaImport(){
  openDlg("Nueva orden de importación", `<form id="frm-im" data-form="importacion" class="grid">
    <div class="grid g3"><div class="field"><label for="im-trm">TRM (COP por USD)</label><input id="im-trm" name="trm" type="number" value="3925" required></div>
    <div class="field"><label for="im-fl">Flete USD</label><input id="im-fl" name="flete" type="number" value="1200" required></div>
    <div class="field"><label for="im-ar">Arancel %</label><input id="im-ar" name="arancel" type="number" value="10" required></div></div>
    <p class="muted">Cantidades a pedir (deja en blanco las que no necesitas). Se sugieren las referencias importadas bajo mínimo.</p>
    <div class="tw"><table><thead><tr><th>Referencia</th><th class="r">Total actual</th><th class="r">Cantidad</th><th class="r">FOB USD</th></tr></thead><tbody>${DB.productos.filter(p => p.origen === "Importado").map(p => { const sug = stockTotal(p) < p.minimo * 1.6 ? p.minimo * 4 : ""; return `<tr><td><span class="mono">${esc(p.sku)}</span> ${esc(p.nombre)}</td><td class="r">${stockTotal(p)}</td><td><label class="sr" for="iq-${p.id}">Cantidad ${esc(p.sku)}</label><input id="iq-${p.id}" name="q_${p.id}" type="number" min="0" value="${sug}" style="text-align:right;max-width:110px"></td><td><label class="sr" for="iu-${p.id}">FOB ${esc(p.sku)}</label><input id="iu-${p.id}" name="u_${p.id}" type="number" step="0.01" min="0" value="${(p.costo / 3925 / 1.25).toFixed(2)}" style="text-align:right;max-width:110px"></td></tr>`; }).join("")}</tbody></table></div><div id="im-err" role="alert"></div></form>`,
    `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-im">Emitir orden</button>`);
}
