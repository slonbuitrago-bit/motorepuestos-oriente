"use strict";
/* Motorepuestos del Oriente
   Capa de control · Acciones de los botones (casos de uso que no usan formulario). */

/* ---------- Acciones ---------- */
const ACT = {
  skip(){ const m = $("#main"); if (m) m.focus(); },
  menu(){ UI.menuOpen = !UI.menuOpen; render(); if (UI.menuOpen) $("#rail a")?.focus(); },
  a11y(){ UI.a11yOpen = !UI.a11yOpen; render(); if (UI.a11yOpen) $("#a11y-panel button")?.focus(); },
  pref(d){ setPref(d.k, d.k === "escala" ? parseFloat(d.v) : d.v); if (d.k === "tema" && d.v === "sistema"){ document.documentElement.removeAttribute("data-theme"); } render(); $(`[data-act="pref"][data-k="${d.k}"][data-v="${d.v}"]`)?.focus(); },
  leer(){
    if (!("speechSynthesis" in window)){ toast("Tu navegador no permite lectura en voz alta.", true); return; }
    if (speechSynthesis.speaking){ speechSynthesis.cancel(); toast("Lectura detenida."); return; }
    const m = $("#main"); const txt = [...m.querySelectorAll("h1,h2,.page-head p,.kpi,.note,.task")].map(x => x.innerText.replace(/\s+/g, " ")).join(". ");
    const u = new SpeechSynthesisUtterance(txt.slice(0, 3000)); u.lang = "es-CO"; u.rate = 1; speechSynthesis.speak(u); toast("Leyendo la pantalla. Pulsa de nuevo para detener.");
  },
  loginSel(d){ UI.loginSel = d.id; render(); $(`[data-act="loginSel"][data-id="${d.id}"]`)?.focus(); },
  verifPublico(){ UI.publico = true; UI.certRes = ""; render(); $("#cc")?.focus(); },
  cerrarPublico(){ UI.publico = false; render(); },
  logout(){ audit("Cerrar sesión", "Sesión", ME.usuario, ""); save(); ME = null; store.del(SES_KEY); UI.menuOpen = false; UI.draft = null; location.hash = ""; render(); },
  tab(d){ UI.tab[d.g] = d.v; if (d.g === "fac") dlgFactura(d.ref); else render(); },
  cerrarDlg(){ closeDlg(); },
  verFactura(d){ UI.tab.fac = "doc"; dlgFactura(d.id); },
  masFacturas(){ UI.filtros.flim = (UI.filtros.flim || 40) + 40; render(); },
  masPedidos(){ UI.filtros.plim = (UI.filtros.plim || 40) + 40; render(); },
  masCorreos(){ UI.filtros.nlim = (UI.filtros.nlim || 50) + 100; render(); },
  masAudit(){ UI.filtros.alim = (UI.filtros.alim || 60) + 100; render(); },
  addItem(){ UI.draft.items.push({ productoId:"", cantidad:1 }); render(); $(`#it-p-${UI.draft.items.length - 1}`)?.focus(); },
  delItem(d){ UI.draft.items.splice(+d.i, 1); render(); },
  cancelDraft(){ UI.draft = null; },
  autorizar(d){
    const f = byId(DB.facturas, d.id);
    if (!P("facturas.autorizar") || f.estado !== "Pendiente") return;
    if (f.creadoPor === ME.id){ toast("No puedes autorizar una factura que tú registraste.", true); return; }
    const c = cli(f.clienteId);
    if (f.total > cupoDisponible(c, f.id)){ toast("El cliente ya no tiene cupo suficiente para esta factura.", true); return; }
    const falt = f.items.find(it => (prod(it.productoId).stock[f.sucursalId] || 0) < it.cantidad);
    if (falt){ toast("No hay existencia suficiente de " + prod(falt.productoId).sku + " en la sucursal.", true); return; }
    autorizarFactura(DB, f, ME.id, new Date().toISOString());
    audit("Autorizar factura manual", "Factura", f.numero, "CUFE " + f.cufe.slice(0, 16) + "…");
    audit("Contabilizar factura autorizada", "Factura", f.numero, "Asiento " + f.asiento.numero + " · " + money(f.total));
    correo(DB, "Factura emitida", f, new Date().toISOString());
    closeDlg(); commit(); toast(`Factura ${f.numero} autorizada, contabilizada y enviada al cliente. Ya puede pasar a Despachos.`);
  },
  rechazarDlg(d){
    const f = byId(DB.facturas, d.id);
    if (f.creadoPor === ME.id){ toast("No puedes rechazar una factura que tú registraste.", true); return; }
    openDlg(`Rechazar factura ${f.numero}`, `<form id="frm-rz" data-form="rechazo" data-id="${f.id}" class="grid"><p>Extiende el caso de uso Autorizar. Logística verá el motivo para corregir.</p>
      <div class="field"><label for="rz-m">Motivo del rechazo *</label><textarea id="rz-m" name="motivo" required minlength="10" placeholder="Ej.: el cliente pidió 10 kits de arrastre, no 16. Verificar con el pedido firmado."></textarea></div><div id="rz-err" role="alert"></div></form>`,
      `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn danger" type="submit" form="frm-rz">Rechazar factura</button>`);
  },
  pagar(d){ const f = byId(DB.facturas, d.id); f.pagada = true; f.pagoEn = new Date().toISOString(); audit("Registrar pago de factura", "Factura", f.numero, money(f.total) + " · libera cupo de " + cli(f.clienteId).nombre); correo(DB, "Pago registrado", f, f.pagoEn); save(); dlgFactura(f.id); render(); toast("Pago registrado. El cupo del cliente quedó liberado."); },
  verifCufe(d){
    const f = byId(DB.facturas, d.id); const ok = cufe(f) === f.cufe;
    const el = $("#cufe-res"); if (el) el.innerHTML = ok ? pill("Íntegro: el CUFE coincide con los valores del documento", "ok") : pill("Alterado: los valores no coinciden con el CUFE", "bad");
    audit("Verificar integridad de factura", "Factura", f.numero, ok ? "CUFE coincide" : "CUFE NO coincide"); save();
  },
  nuevaRemision(d){ dlgNuevaRemision(d.id); },
  verRemision(d){ dlgRemision(d.id); },
  despachar(d){ const r = rem(d.id); r.estado = "En tránsito"; r.salidaEn = new Date().toISOString(); audit("Despachar remisión", "Remisión", r.numero, "Salida de bodega · " + r.instrucciones.transportadora); correo(DB, "Despacho", r, r.salidaEn); closeDlg(); commit(); toast(`Remisión ${r.numero} en tránsito. Se avisó al cliente por correo.`); },
  facturarPedido(d){
    const p = byId(DB.pedidos, d.id); if (!P("pedidos.gestionar") || p.estado !== "Registrado") return;
    const c = cli(p.clienteId);
    if (p.total > cupoDisponible(c, p.id)){ toast(`Cupo insuficiente: ${c.nombre} tiene ${money(cupoDisponible(c, p.id))} disponibles.`, true); return; }
    const falt = p.items.find(it => (prod(it.productoId).stock[p.sucursalId] || 0) < it.cantidad);
    if (falt){ toast("No hay existencia suficiente de " + prod(falt.productoId).sku + " en la sucursal.", true); return; }
    const ts = new Date().toISOString();
    const f = buildFactura(DB, p.clienteId, p.sucursalId, p.ciudadDestinoId, p.items.map(x => ({ ...x })), ts, ME.id, p);
    if (p.obs) f.obs = p.obs;
    audit("Facturar pedido de venta", "Factura", f.numero, "Pedido " + p.numero + " · " + money(f.total));
    autorizarFactura(DB, f, "SYS", ts);
    audit("Contabilizar factura (automática, origen pedido)", "Factura", f.numero, "Asiento " + f.asiento.numero + " · CUFE " + f.cufe.slice(0, 16) + "…");
    correo(DB, "Factura emitida", f, ts);
    commit(); toast(`Pedido ${p.numero} facturado como ${f.numero}, contabilizado y enviado al cliente.`);
  },
  anularPedidoDlg(d){ const p = byId(DB.pedidos, d.id); openDlg(`Anular pedido ${p.numero}`, `<form id="frm-an" data-form="anular" data-id="${p.id}" class="grid"><div class="field"><label for="an-m">Motivo de la anulación *</label><textarea id="an-m" name="motivo" required minlength="10" placeholder="Ej.: el cliente canceló por teléfono el 4 de noviembre."></textarea></div></form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn danger" type="submit" form="frm-an">Anular pedido</button>`); },
  verCorreo(d){ const m = byId(DB.correos, d.id); openDlg(m.asunto, `<dl class="kv"><dt>De</dt><dd>notificaciones@motorepuestosoriente.example</dd><dt>Para</dt><dd>${esc(m.contacto)} &lt;${esc(m.para)}&gt;</dd><dt>Fecha</dt><dd>${fdt(m.ts)}</dd><dt>Tipo</dt><dd>${esc(m.tipo)} · <span class="mono">${esc(m.ref)}</span></dd><dt>Estado</dt><dd>${pill(m.estado, m.estado === "Enviado" ? "ok" : "warn")}</dd></dl><div class="doc" style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(m.cuerpo)}</div>`, `<button class="btn" data-act="cerrarDlg">Cerrar</button>`); },
  cerrarNovDlg(d){ openDlg("Cerrar novedad", `<form id="frm-nv" data-form="novedad" data-id="${d.id}" class="grid"><div class="field"><label for="nv-r">Resolución *</label><textarea id="nv-r" name="res" required minlength="10" placeholder="Qué se hizo: reposición, nota crédito, reclamación a la transportadora…"></textarea></div></form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-nv">Cerrar novedad</button>`); },
  kardex(d){ dlgKardex(d.id); },
  ajusteDlg(d){ dlgAjuste(d.id); },
  trasladoDlg(){ dlgTraslado(); },
  productoDlg(){ dlgProducto(); },
  importDlg(){ dlgNuevaImport(); },
  verImport(d){ dlgImport(d.id); },
  avanzarImport(d){
    const im = byId(DB.importaciones, d.id); const i = FLUJO_IMP.indexOf(im.estado); const sig = FLUJO_IMP[i + 1]; if (!sig) return;
    if (sig === "Nacionalizada" && !im.dim) im.dim = "48" + String(Date.now()).slice(-13);
    if (sig === "Recibida"){
      const k = costeo(im); const ts = new Date().toISOString();
      im.items.forEach(it => {
        const p = prod(it.productoId); const cu = Math.round(it.fobUSD * im.trm * k.factor);
        const prev = stockTotal(p); p.costo = Math.round((p.costo * prev + cu * it.cantidad) / (prev + it.cantidad)); // costo promedio ponderado
        p.stock[im.sucursalId] = (p.stock[im.sucursalId] || 0) + it.cantidad;
        DB.kardex.push({ fecha:ts, productoId:p.id, sucursalId:im.sucursalId, tipo:"Entrada importación", cantidad:it.cantidad, ref:im.numero, usuario:ME.nombre });
      });
      im.recibida = ts;
      audit("Recibir importación en bodega", "Importación", im.numero, NUM.format(sum(im.items, x => x.cantidad)) + " unidades · costo promedio actualizado");
    } else audit("Cambiar estado importación", "Importación", im.numero, im.estado + " → " + sig + (sig === "Nacionalizada" ? " · DIM " + im.dim : ""));
    im.estado = sig; commit(); toast(`${im.numero}: ${sig}.`);
  },
  clienteDlg(d){ dlgCliente(d.id); },
  verifCadena(){ UI.cadena = verificarCadena(); audit("Verificar integridad de la bitácora", "Sistema", "", UI.cadena.ok ? "Cadena íntegra" : "Cadena rota en #" + UI.cadena.seq); if (UI.cadena.ok) UI.cadena.n = DB.audit.length; save(); render(); },
  simularFraude(){
    const e = DB.audit.find(x => x.accion === "Registrar factura manual");
    if (!e) return; UI.fraude = { seq:e.seq, detalle:e.detalle }; e.detalle = e.detalle.replace(/\$\s?[\d.]+/, "$ 1.000"); UI.cadena = verificarCadena(); save(); render(); toast("Se alteró el valor del registro #" + e.seq + " directamente, sin pasar por el sistema.");
  },
  restaurarFraude(){ if (UI.fraude){ const e = DB.audit.find(x => x.seq === UI.fraude.seq); e.detalle = UI.fraude.detalle; UI.fraude = null; } UI.cadena = verificarCadena(); save(); render(); },
  probarCert(d){ UI.certQ = d.c; UI.certRes = resultadoCert(d.c); render(); },
  usuarioDlg(){ dlgUsuario(); },
  toggleUser(d){ const u = usr(d.id); u.activo = !u.activo; audit(u.activo ? "Activar usuario" : "Desactivar usuario", "Usuario", u.usuario, u.nombre + " · " + u.rol); commit(); },
  copiarRespaldo(){
    const txt = JSON.stringify(DB);
    const fallback = () => { const ta = $("#rs-j"); if (ta){ ta.value = txt; ta.select(); toast("Respaldo puesto en el cuadro de abajo. Cópialo con Ctrl+C."); } };
    try { navigator.clipboard.writeText(txt).then(() => toast("Respaldo copiado al portapapeles."), fallback); } catch(e){ fallback(); }
  },
  resetDlg(){ openDlg("Restablecer datos de ejemplo", `<p>Se borrarán todas las facturas, remisiones y movimientos que hayas creado en este navegador y se cargarán de nuevo los datos de ejemplo. Esta acción no se puede deshacer.</p>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn danger" data-act="reset">Sí, restablecer</button>`); },
  reset(){ const id = ME.id; DB = seed(); ME = usr(id) || DB.usuarios[0]; save(); closeDlg(); location.hash = "inicio"; render(); toast("Datos de ejemplo restablecidos."); }
};
