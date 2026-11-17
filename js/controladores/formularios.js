"use strict";
/* Motorepuestos del Oriente
   Capa de control · Validación y procesamiento de formularios. */

/* ---------- Formularios ---------- */
const FORM = {
  noop(){},
  login(form){
    const nombre = form.usuario.value.trim().toLowerCase(), clave = form.clave.value;
    const err = m => { $("#lg-err").innerHTML = `<div class="note bad">${m}</div>`; form.clave.value = ""; form.clave.setAttribute("aria-invalid", "true"); (nombre ? form.clave : form.usuario).focus(); };
    if (!nombre || !clave) return err("Escribe tu usuario y tu contraseña.");
    DB.bloqueos = DB.bloqueos || {};
    const b = DB.bloqueos[nombre] || { fallos:0, hasta:null };
    if (b.hasta && new Date(b.hasta) > new Date()){ const min = Math.ceil((new Date(b.hasta) - new Date()) / 60000); return err(`Usuario bloqueado por intentos fallidos. Intenta de nuevo en ${min} ${min === 1 ? "minuto" : "minutos"}.`); }
    const u = DB.usuarios.find(x => x.usuario.toLowerCase() === nombre);
    if (!u || u.claveHash !== hashClave(u.usuario, clave)){
      b.fallos = (b.hasta ? 0 : b.fallos) + 1; b.hasta = null;
      if (b.fallos >= CONFIG.intentosMaximos){ b.hasta = new Date(Date.now() + CONFIG.minutosBloqueo * 60000).toISOString(); b.fallos = 0; }
      DB.bloqueos[nombre] = b;
      audit(b.hasta ? "Bloquear usuario por intentos fallidos" : "Intento de ingreso fallido", "Sesión", nombre, b.hasta ? `${CONFIG.intentosMaximos} intentos fallidos · bloqueo de ${CONFIG.minutosBloqueo} min` : "Usuario o contraseña incorrectos", { user:{ nombre:"Sistema", rol:"Sistema" } }); save();
      return err(b.hasta ? `Demasiados intentos fallidos. El usuario queda bloqueado ${CONFIG.minutosBloqueo} minutos.` : `Usuario o contraseña incorrectos. Te ${CONFIG.intentosMaximos - b.fallos === 1 ? "queda 1 intento" : `quedan ${CONFIG.intentosMaximos - b.fallos} intentos`}.`);
    }
    if (!u.activo) return err("Este usuario está desactivado. Habla con el administrador.");
    delete DB.bloqueos[nombre];
    ME = u; store.set(SES_KEY, u.id); UI.a11yOpen = false; UI.publico = false;
    audit("Iniciar sesión", "Sesión", u.usuario, u.rol); save();
    if (!location.hash || location.hash === "#certificados") location.hash = "inicio";
    render(); $("#main")?.focus();
  },
  factura(){
    const d = UI.draft; const E = {};
    const items = d.items.filter(it => it.productoId);
    if (!d.clienteId) E.clienteId = d.cliTxt && d.cliTxt.trim() ? "No encontramos ese cliente. Elígelo de la lista de sugerencias." : "Elige el cliente.";
    if (!d.ciudadId) E.ciudadId = "Elige la ciudad o municipio de destino.";
    if (!items.length) E.items = "Agrega al menos una referencia.";
    const sinElegir = d.items.findIndex(it => !it.productoId && it.txt && it.txt.trim());
    if (sinElegir >= 0) E.items = `La línea ${sinElegir + 1} no tiene una referencia válida: elígela de la lista de sugerencias.`;
    const ids = items.map(x => x.productoId);
    if (new Set(ids).size !== ids.length) E.items = "Hay referencias repetidas. Une las cantidades en una sola línea.";
    for (const it of items){
      const q = Number(it.cantidad); const p = prod(it.productoId);
      if (!(Number.isInteger(q) && q > 0)){ E.items = `La cantidad de ${p.sku} debe ser un número entero mayor que cero.`; break; }
      if (q > (p.stock[d.sucursalId] || 0)){ E.items = `No hay existencia suficiente de ${p.sku} en ${suc(d.sucursalId).nombre}: hay ${p.stock[d.sucursalId] || 0}, pides ${q}.`; break; }
    }
    const lines = items.map(it => ({ productoId:it.productoId, cantidad:parseInt(it.cantidad), precio:prod(it.productoId).precio }));
    if (!Object.keys(E).length){
      const c = cli(d.clienteId); const t = calcTotales(lines); const disp = cupoDisponible(c);
      audit("Validar cupo del cliente", "Cliente", c.nit, t.total <= disp ? "Cupo suficiente: " + money(disp) : "Cupo insuficiente: disponible " + money(disp) + ", solicitado " + money(t.total));
      if (t.total > disp) E._general = `Cupo insuficiente: ${c.nombre} tiene ${money(disp)} disponibles y la factura suma ${money(t.total)}.`;
    }
    d.errores = E;
    if (Object.keys(E).length){ save(); render(); const first = $('[aria-invalid="true"]') || $('[role="alert"]'); first?.focus?.(); if (first && first.getAttribute("role") === "alert"){ first.setAttribute("tabindex", "-1"); first.focus(); } return; }
    const ts = new Date().toISOString();
    if (d.modo === "pedido"){
      const pd = buildPedido(DB, d.clienteId, d.sucursalId, d.ciudadId, lines, ts, ME.id);
      if (d.obs.trim()) pd.obs = d.obs.trim();
      audit("Registrar pedido de venta", "Pedido", pd.numero, cli(pd.clienteId).nombre + " · " + money(pd.total));
      correo(DB, "Pedido de venta", pd, ts);
      UI.draft = null; save(); location.hash = "pedidos"; toast(`Pedido ${pd.numero} registrado. Se envió la confirmación a ${cli(pd.clienteId).email || "el cliente"}.`);
      return;
    }
    const f = buildFactura(DB, d.clienteId, d.sucursalId, d.ciudadId, lines, ts, ME.id);
    if (d.obs.trim()) f.obs = d.obs.trim();
    audit("Registrar factura manual", "Factura", f.numero, cli(f.clienteId).nombre + " · " + money(f.total));
    UI.draft = null; save(); location.hash = "facturas"; toast(`Factura ${f.numero} registrada y enviada a Gerencia para autorización.`);
  },
  rechazo(form){
    const f = byId(DB.facturas, form.dataset.id); const m = form.motivo.value.trim();
    if (m.length < 10){ $("#rz-err").innerHTML = `<div class="note bad">Explica el motivo con al menos 10 caracteres para que Logística pueda corregir.</div>`; form.motivo.focus(); return; }
    f.estado = "Rechazada"; f.motivoRechazo = m; f.revisadoPor = ME.id; f.revisadoEn = new Date().toISOString();
    audit("Rechazar factura manual", "Factura", f.numero, m); closeDlg(); commit(); toast(`Factura ${f.numero} rechazada.`);
  },
  remision(form){
    const f = byId(DB.facturas, form.dataset.id); const v = Object.fromEntries(new FormData(form));
    const err = [];
    if (!v.direccion.trim() || !v.contacto.trim() || !v.telefono.trim()) err.push("Completa dirección, quién recibe y teléfono.");
    if (!/^[0-9 +()-]{7,}$/.test(v.telefono.trim())) err.push("El teléfono debe tener al menos 7 dígitos.");
    if (v.transportadora !== "Flota propia" && !v.guia.trim()) err.push("Escribe el número de guía de la transportadora.");
    if (err.length){ $("#rem-err").innerHTML = `<div class="note bad">${err.map(esc).join("<br>")}</div>`; return; }
    const r = buildRemision(DB, f, new Date().toISOString(), { direccion:v.direccion.trim(), referencia:v.referencia.trim(), contacto:v.contacto.trim(), telefono:v.telefono.trim(), transportadora:v.transportadora, guia:v.guia.trim(), franja:v.franja, observaciones:v.observaciones.trim() });
    audit("Registrar despacho", "Remisión", r.numero, "Factura " + f.numero);
    audit("Registrar instrucciones de envío", "Remisión", r.numero, r.instrucciones.transportadora + (r.instrucciones.guia ? " · guía " + r.instrucciones.guia : "") + " · " + r.instrucciones.direccion);
    save(); render(); dlgRemision(r.id); toast(`Remisión ${r.numero} creada. Haz el conteo ciego para despacharla.`);
  },
  conteo(form){
    const r = rem(form.dataset.id);
    const vals = r.items.map((_, i) => form["c" + i].value);
    if (vals.some(v => v === "" || !(Number.isInteger(Number(v)) && Number(v) >= 0))){ $("#conteo-res").innerHTML = `<div class="note bad">Escribe en todas las líneas la cantidad contada, en unidades enteras.</div>`; return; }
    r.items.forEach((it, i) => it.contado = parseInt(vals[i]));
    const dif = r.items.filter(it => it.contado !== it.cantidad);
    if (dif.length){
      const det = difDetalle(DB, r.items, "contado");
      DB.novedades.push({ id:"N" + nextNum("NOV"), tipo:"Alistamiento", remisionId:r.id, facturaId:r.facturaId, fecha:new Date().toISOString(), usuario:ME.nombre, detalle:det, estado:"Abierta", resolucion:"" });
      audit("Discrepancia en conteo de alistamiento", "Remisión", r.numero, det);
      r.items.forEach(it => it.contado = null); save();
      $("#conteo-res").innerHTML = `<div class="note bad"><b>El conteo no coincide con la factura en ${dif.length} ${dif.length === 1 ? "referencia" : "referencias"}.</b> No se puede despachar. Se registró una novedad. Revisa el alistamiento y vuelve a contar.</div>`;
      form.querySelectorAll("input").forEach(x => x.value = ""); form.querySelector("input").focus(); return;
    }
    r.estado = "Verificada"; r.verificadaEn = new Date().toISOString(); r.sello = sha(r.numero + r.verificadaEn).slice(0, 10).toUpperCase();
    audit("Verificar alistamiento (conteo ciego)", "Remisión", r.numero, "Conteo conforme · sello " + r.sello);
    save(); render(); dlgRemision(r.id); toast("Conteo conforme. La remisión quedó sellada y lista para salir.");
  },
  entrega(form){
    const r = rem(form.dataset.id); const rec = form.recibe.value.trim();
    if (!rec){ form.recibe.focus(); return; }
    r.items.forEach((it, i) => it.recibido = Math.max(0, parseInt(form["r" + i].value) || 0));
    r.recibidoPor = rec; r.entregadaEn = new Date().toISOString();
    const dif = r.items.filter(it => it.recibido !== it.cantidad);
    if (dif.length){
      r.estado = "Con novedad"; const det = difDetalle(DB, r.items, "recibido");
      DB.novedades.push({ id:"N" + nextNum("NOV"), tipo:"Entrega", remisionId:r.id, facturaId:r.facturaId, fecha:r.entregadaEn, usuario:ME.nombre, detalle:det, estado:"Abierta", resolucion:"" });
      audit("Registrar entrega con novedad", "Remisión", r.numero, det);
      toast("Entrega registrada con novedad. Gerencia debe resolverla.", true);
    } else { r.estado = "Entregada"; audit("Registrar entrega conforme", "Remisión", r.numero, "Recibe " + rec); toast(`Remisión ${r.numero} entregada sin novedades.`); }
    closeDlg(); commit();
  },
  anular(form){
    const p = byId(DB.pedidos, form.dataset.id); const m = form.motivo.value.trim();
    if (m.length < 10){ form.motivo.focus(); return; }
    p.estado = "Anulado"; p.motivoAnulacion = m; audit("Anular pedido de venta", "Pedido", p.numero, m); closeDlg(); commit(); toast(`Pedido ${p.numero} anulado. Se liberó el cupo del cliente.`);
  },
  estado(form){
    if (!P("admin.catalogos")){ toast("No tienes permiso para gestionar catálogos.", true); return; }
    const code = form.codigo.value.trim().toUpperCase(), nom = form.nombre.value.trim();
    if (!nom || !/^[A-Z]{2,5}$/.test(code)){ toast("Escribe el nombre y un código de 2 a 5 letras.", true); return; }
    if (DB.estados.some(e => e.id === code)){ toast("Ya existe un departamento o estado con ese código.", true); return; }
    DB.estados.push({ id:code, paisId:form.paisId.value, nombre:nom }); audit("Crear departamento o estado", "Catálogo", code, nom + " · " + byId(DB.paises, form.paisId.value).nombre); commit(); toast(nom + " agregado.");
  },
  novedad(form){
    const n = byId(DB.novedades, form.dataset.id); const v = form.res.value.trim();
    if (v.length < 10){ form.res.focus(); return; }
    n.estado = "Cerrada"; n.resolucion = v; audit("Cerrar novedad", "Remisión", rem(n.remisionId).numero, v); closeDlg(); commit(); toast("Novedad cerrada.");
  },
  ajuste(form){
    const p = prod(form.dataset.id); const s = form.suc.value; const c = Number(form.cant.value); const det = form.detalle.value.trim();
    if (!Number.isInteger(c)){ $("#aj-err").innerHTML = `<div class="note bad">La cantidad debe ser un número entero de unidades.</div>`; return; }
    if (!c){ $("#aj-err").innerHTML = `<div class="note bad">La cantidad debe ser distinta de cero.</div>`; return; }
    if (det.length < 10){ $("#aj-err").innerHTML = `<div class="note bad">Describe el ajuste con al menos 10 caracteres.</div>`; return; }
    if ((p.stock[s] || 0) + c < 0){ $("#aj-err").innerHTML = `<div class="note bad">El ajuste dejaría existencia negativa (hay ${p.stock[s] || 0}).</div>`; return; }
    p.stock[s] = (p.stock[s] || 0) + c;
    DB.kardex.push({ fecha:new Date().toISOString(), productoId:p.id, sucursalId:s, tipo:"Ajuste: " + form.motivo.value, cantidad:c, ref:"AJ-" + String(nextNum("AJ")).padStart(4, "0"), usuario:ME.nombre });
    audit("Ajustar inventario", "Producto", p.sku, `${c > 0 ? "+" : ""}${c} en ${suc(s).nombre} · ${form.motivo.value} · ${det}`); closeDlg(); commit(); toast("Ajuste registrado.");
  },
  traslado(form){
    const p = productoPorEtiqueta(form.prod.value), o = form.o.value, d = form.d.value, c = Number(form.cant.value);
    if (o === d){ $("#tr-err").innerHTML = `<div class="note bad">El origen y el destino deben ser distintos.</div>`; return; }
    if (!p){ $("#tr-err").innerHTML = `<div class="note bad">Escribe la referencia y elígela de la lista de sugerencias.</div>`; form.prod.focus(); return; }
    if (!(Number.isInteger(c) && c > 0) || c > (p.stock[o] || 0)){ $("#tr-err").innerHTML = `<div class="note bad">Cantidad no válida. En ${esc(suc(o).nombre)} hay ${p.stock[o] || 0}.</div>`; return; }
    p.stock[o] -= c; p.stock[d] = (p.stock[d] || 0) + c; const ref = "TR-" + String(nextNum("TR")).padStart(4, "0"); const ts = new Date().toISOString();
    DB.kardex.push({ fecha:ts, productoId:p.id, sucursalId:o, tipo:"Traslado salida", cantidad:-c, ref, usuario:ME.nombre }, { fecha:ts, productoId:p.id, sucursalId:d, tipo:"Traslado entrada", cantidad:c, ref, usuario:ME.nombre });
    audit("Trasladar inventario", "Producto", p.sku, `${c} de ${suc(o).nombre} a ${suc(d).nombre} · ${ref}`); closeDlg(); commit(); toast(`Traslado ${ref} registrado.`);
  },
  producto(form){
    const v = Object.fromEntries(new FormData(form)); const sku = v.sku.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,20}$/.test(sku)){ $("#pr-err").innerHTML = `<div class="note bad">El SKU solo admite mayúsculas, números y guiones (4 a 20).</div>`; return; }
    if (DB.productos.some(p => p.sku === sku)){ $("#pr-err").innerHTML = `<div class="note bad">Ya existe una referencia con el SKU ${esc(sku)}.</div>`; return; }
    if (!v.nombre.trim() || !v.categoria.trim() || !(+v.costo > 0) || !(+v.precio > 0)){ $("#pr-err").innerHTML = `<div class="note bad">Completa descripción, categoría, costo y precio.</div>`; return; }
    if (+v.precio <= +v.costo){ $("#pr-err").innerHTML = `<div class="note bad">El precio de venta debe ser mayor que el costo.</div>`; return; }
    const p = { id:"PR" + (DB.productos.length + 1) + "-" + Date.now().toString(36), sku, nombre:v.nombre.trim(), compat:v.compat.trim() || "Universal", categoria:v.categoria.trim(), costo:+v.costo, precio:+v.precio, minimo:+v.minimo || 0, stock:Object.fromEntries(DB.sucursales.map(s => [s.id, 0])), origen:v.origen, garantiaMeses:+v.garantia || 0, activo:true };
    DB.productos.push(p); audit("Crear referencia", "Producto", sku, p.nombre + " · " + money(p.precio)); closeDlg(); commit(); toast("Referencia creada. Su existencia inicial es cero.");
  },
  importacion(form){
    const items = DB.productos.filter(p => p.origen === "Importado").map(p => ({ productoId:p.id, cantidad:parseInt(form["q_" + p.id].value) || 0, fobUSD:parseFloat(form["u_" + p.id].value) || 0 })).filter(x => x.cantidad > 0);
    if (!items.length){ $("#im-err").innerHTML = `<div class="note bad">Escribe la cantidad de al menos una referencia.</div>`; return; }
    if (items.some(x => !(x.fobUSD > 0))){ $("#im-err").innerHTML = `<div class="note bad">Cada referencia pedida necesita un valor FOB mayor que cero.</div>`; return; }
    const n = nextNum("IMP"); const im = { id:"I" + n + "-" + Date.now().toString(36), numero:"IMP-" + new Date().getFullYear() + "-" + String(n).padStart(3, "0"), proveedorId:"P1", fecha:new Date().toISOString(), estado:"Orden emitida", trm:+form.trm.value, fleteUSD:+form.flete.value, seguroUSD:Math.round(+form.flete.value * .12), arancelPct:+form.arancel.value, sucursalId:"S1", dim:"", certificadoOrigen:"", items };
    DB.importaciones.push(im); audit("Crear orden de importación", "Importación", im.numero, items.length + " referencias · FOB " + USD.format(costeo(im).fob)); closeDlg(); commit(); toast(`Orden ${im.numero} emitida.`);
  },
  cliente(form){
    const v = Object.fromEntries(new FormData(form)); const id = form.dataset.id;
    const nit = v.nit.trim();
    const err = [];
    if (!v.nombre.trim() || !v.direccion.trim() || !v.contacto.trim() || !v.telefono.trim()) err.push("Completa los campos obligatorios.");
    if (!/^[0-9.]{6,13}-[0-9]$/.test(nit)) err.push("El NIT debe tener el formato 900.123.456-7.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((v.email || "").trim())) err.push("Escribe un correo válido para las notificaciones, por ejemplo compras@almacen.com.");
    if (DB.clientes.some(c => c.nit === nit && c.id !== id)) err.push("Ya existe un cliente con ese NIT.");
    if (!form.hd.checked) err.push("Sin autorización de tratamiento de datos no se puede registrar el cliente.");
    if (err.length){ $("#cl-err").innerHTML = `<div class="note bad">${err.map(esc).join("<br>")}</div>`; return; }
    if (id){
      const c = cli(id); const antes = c.cupo;
      Object.assign(c, { email:v.email.trim(), nombre:v.nombre.trim(), nit, ciudadId:v.ciudadId, direccion:v.direccion.trim(), contacto:v.contacto.trim(), telefono:v.telefono.trim(), autorizaDatos:true });
      if (v.cupo !== undefined && +v.cupo !== antes){ c.cupo = +v.cupo; audit("Modificar cupo de cliente", "Cliente", c.nit, money(antes) + " → " + money(c.cupo)); }
      audit("Actualizar cliente", "Cliente", c.nit, c.nombre);
    } else {
      const c = { id:"C" + (DB.clientes.length + 1) + "-" + Date.now().toString(36), nombre:v.nombre.trim(), nit, ciudadId:v.ciudadId, direccion:v.direccion.trim(), contacto:v.contacto.trim(), telefono:v.telefono.trim(), email:v.email.trim(), cupo:+v.cupo || 0, activo:true, autorizaDatos:true };
      DB.clientes.push(c); audit("Crear cliente", "Cliente", nit, c.nombre + " · cupo " + money(c.cupo));
    }
    closeDlg(); commit(); toast("Cliente guardado.");
  },
  rastreo(form){
    const q = form.doc.value.trim().toUpperCase();
    const refs = new Set([q]);
    let f = DB.facturas.find(x => x.numero === q);
    const r0 = DB.remisiones.find(x => x.numero === q); if (r0) f = byId(DB.facturas, r0.facturaId);
    const p0 = DB.pedidos.find(x => x.numero === q); if (p0){ refs.add(p0.numero); if (p0.facturaId) f = byId(DB.facturas, p0.facturaId); }
    if (f){ refs.add(f.numero); if (f.remisionId) refs.add(rem(f.remisionId).numero); if (f.pedidoId) refs.add(byId(DB.pedidos, f.pedidoId).numero); }
    const all = DB.audit.filter(e => refs.has(e.ref.toUpperCase()));
    UI.rastreo = all.length ? `<ul class="tl" style="margin-top:8px">${all.map(e => `<li><div><b>${esc(e.accion)}</b> <span class="mono">${esc(e.ref)}</span> · registro #${e.seq}<br><span class="when">${fdt(e.ts)} · ${esc(e.usuario)} (${esc(e.rol)})</span>${e.detalle ? `<br>${esc(e.detalle)}` : ""}</div></li>`).join("")}</ul>` : `<div class="note warn" style="margin-top:8px">No hay registros para ${esc(q)}. Revisa el número del documento.</div>`;
    render(); $("#rastreo-res")?.setAttribute("tabindex", "-1"); $("#rastreo-res")?.focus();
  },
  certificado(form){ UI.certQ = form.codigo.value.trim().toUpperCase(); UI.certRes = resultadoCert(UI.certQ); render(); $("#cc")?.focus(); },
  // Agrega un municipio del catálogo oficial del DANE; si su departamento no existe, lo crea.
  ciudadDane(form){
    if (!P("admin.catalogos")){ toast("No tienes permiso para gestionar catálogos.", true); return; }
    const txt = form.etiqueta.value.trim(), code = (txt.match(/(\d{5})\s*$/) || [])[1], m = code && daneMunicipio(code);
    if (!m){ toast(txt ? "No encontramos ese municipio en el catálogo del DANE. Elige una de las sugerencias." : "Escribe el municipio y elige una sugerencia.", true); $("#g-dane")?.focus(); return; }
    if (DB.ciudades.some(c => c.id === m[0])){ toast(m[1] + " ya está registrado.", true); return; }
    const dep = asegurarDepartamento(DB, m[0]);
    DB.ciudades.push({ id:m[0], estadoId:dep.id, nombre:m[1] }); audit("Agregar municipio del catálogo DANE", "Catálogo", m[0], m[1] + " · " + dep.nombre); commit(); toast(`${m[1]} (${dep.nombre}) agregado.`); $("#g-dane")?.focus();
  },
  // Agrega de una vez todos los municipios que falten de un departamento.
  deptoDane(form){
    if (!P("admin.catalogos")){ toast("No tienes permiso para gestionar catálogos.", true); return; }
    const d = daneDepto(form.depto.value); if (!d) return;
    const nuevos = DANE.municipios.filter(m => m[0].startsWith(d[0]) && !DB.ciudades.some(c => c.id === m[0]));
    if (!nuevos.length){ toast(d[1] + " ya tiene todos sus municipios.", true); return; }
    const dep = asegurarDepartamento(DB, d[0]);
    nuevos.forEach(m => DB.ciudades.push({ id:m[0], estadoId:dep.id, nombre:m[1] }));
    audit("Agregar departamento del catálogo DANE", "Catálogo", d[0], `${d[1]} · ${nuevos.length} municipios`); commit(); toast(`${d[1]}: ${nuevos.length} municipios agregados.`);
  },
  ciudad(form){
    if (!P("admin.catalogos")){ toast("No tienes permiso para gestionar catálogos.", true); return; }
    const code = form.codigo.value.trim().toUpperCase(), nom = form.nombre.value.trim();
    if (!nom || !/^[0-9A-Z-]{3,8}$/.test(code)){ toast("Escribe el nombre y un código válido.", true); return; }
    if (DB.ciudades.some(c => c.id === code)){ toast("Ya existe una ciudad con ese código.", true); return; }
    DB.ciudades.push({ id:code, estadoId:form.estadoId.value, nombre:nom }); audit("Crear ciudad o municipio", "Catálogo", code, nom); commit(); toast(nom + " agregado.");
  },
  usuario(form){
    const v = Object.fromEntries(new FormData(form));
    if (!v.nombre.trim() || !/^[a-z0-9.]{3,20}$/.test(v.usuario)){ $("#us-err").innerHTML = `<div class="note bad">Completa el nombre y un usuario válido (minúsculas, 3 a 20).</div>`; return; }
    if (DB.usuarios.some(u => u.usuario === v.usuario)){ $("#us-err").innerHTML = `<div class="note bad">Ese usuario ya existe.</div>`; return; }
    const u = { id:"U" + (DB.usuarios.length + 1) + "-" + Date.now().toString(36), nombre:v.nombre.trim(), usuario:v.usuario, rol:v.rol, sucursalId:v.suc, activo:true, claveHash:hashClave(v.usuario, CONFIG.claveDemo) };
    DB.usuarios.push(u); audit("Crear usuario", "Usuario", u.usuario, u.nombre + " · " + u.rol); closeDlg(); commit(); toast(`Usuario ${u.usuario} creado. Su contraseña inicial es ${CONFIG.claveDemo}.`);
  },
  restaurar(form){
    try { const d = JSON.parse(form.json.value); if (!d || d.version !== 6 || !Array.isArray(d.facturas)) throw 0; DB = d; ME = usr(ME.id) || DB.usuarios[0]; audit("Restaurar respaldo", "Sistema", "", "Datos restaurados desde JSON"); commit(); toast("Respaldo restaurado."); }
    catch(e){ toast("El texto no es un respaldo válido de este sistema.", true); }
  }
};
