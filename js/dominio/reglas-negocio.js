"use strict";
/* Motorepuestos del Oriente
   Capa de dominio · Reglas de negocio: pedidos, facturas, autorización y contabilización, remisiones, correos, cupo. */

function nextNumDb(db, key){ db.seq[key] = (db.seq[key] || 0) + 1; return db.seq[key]; }
function difDetalle(db, items, campo){
  return items.filter(it => it[campo] !== it.cantidad).map(it => { const p = byId(db.productos, it.productoId); return p.sku + ": facturado " + it.cantidad + ", " + (campo === "recibido" ? "recibido " : "contado ") + it[campo]; }).join("; ");
}
function calcTotales(items){ const subtotal = sum(items, it => it.cantidad * it.precio); const iva = Math.round(subtotal * IVA); return { subtotal, iva, total: subtotal + iva }; }
function buildFactura(db, clienteId, sucursalId, ciudadId, items, fecha, creadorId, ped){
  const n = nextNumDb(db, "FAC");
  const t = calcTotales(items);
  const f = { id:"F" + n, numero:"MRO-" + String(1000 + n).padStart(6, "0"), fecha, clienteId, sucursalId, ciudadDestinoId:ciudadId, items, ...t, estado:"Pendiente", origen: ped ? "Pedido" : "Manual", creadoPor:creadorId, pagada:false };
  if (ped){ f.pedidoId = ped.id; ped.estado = "Facturado"; ped.facturaId = f.id; }
  db.facturas.push(f); return f;
}
function buildPedido(db, clienteId, sucursalId, ciudadId, items, fecha, creadorId){
  const n = nextNumDb(db, "PED");
  const p = { id:"PD" + n, numero:"PED-" + String(n).padStart(5, "0"), fecha, clienteId, sucursalId, ciudadDestinoId:ciudadId, items, ...calcTotales(items), estado:"Registrado", creadoPor:creadorId };
  db.pedidos.push(p); return p;
}
/* Notificaciones por correo electrónico (tarjeta A): pedido, factura, despacho y pago */
function correo(db, tipo, obj, ts){
  const F = id => db.facturas.find(x => x.id === id);
  const f = tipo === "Despacho" ? F(obj.facturaId) : obj;
  const c = db.clientes.find(x => x.id === f.clienteId);
  let ref = obj.numero, asunto = "", cuerpo = "";
  if (tipo === "Pedido de venta"){ asunto = `Recibimos su pedido ${obj.numero}`; cuerpo = `Registramos su pedido ${obj.numero} por ${money(obj.total)} (IVA incluido) con ${obj.items.length} ${obj.items.length === 1 ? "referencia" : "referencias"}.\nLe avisaremos cuando la factura sea emitida y cuando la mercancía salga de bodega.`; }
  if (tipo === "Factura emitida"){ asunto = `Factura electrónica ${obj.numero}`; cuerpo = `Emitimos la factura electrónica ${obj.numero} por ${money(obj.total)}${obj.pedidoId ? " correspondiente a su pedido " + db.pedidos.find(x => x.id === obj.pedidoId).numero : ""}.\nCUFE: ${obj.cufe}\nLos certificados de garantía de los repuestos se verifican en nuestra página con su código.`; }
  if (tipo === "Despacho"){ const I = obj.instrucciones; asunto = `Su mercancía va en camino · ${obj.numero}`; cuerpo = `La remisión ${obj.numero} (factura ${f.numero}) salió de bodega.\nTransportadora: ${I.transportadora}${I.guia ? " · guía " + I.guia : ""}\nEntrega en: ${I.direccion} · franja ${I.franja}\nRecibe: ${I.contacto}\nAl recibir, cuente los repuestos frente al conductor y anote cualquier diferencia en la remisión.`; }
  if (tipo === "Pago registrado"){ asunto = `Confirmación de pago · factura ${obj.numero}`; cuerpo = `Registramos el pago de la factura ${obj.numero} por ${money(obj.total)}. Gracias.\nEl valor quedó liberado en su cupo de crédito.`; }
  db.correos.push({ id:"M" + nextNumDb(db, "MAIL"), ts, tipo, para:c.email || "(sin correo registrado)", contacto:c.contacto, clienteId:c.id, ref, asunto, cuerpo:`Hola, ${c.contacto}.\n\n${cuerpo}\n\nMotorepuestos del Oriente S.A.S. · Rionegro, Antioquia\nMensaje automático, por favor no responda a este correo.`, estado: c.email ? "Enviado" : "Sin destinatario" });
}
function autorizarFactura(db, f, userId, ts){
  f.estado = "Autorizada"; f.revisadoPor = userId; f.revisadoEn = ts;
  f.cufe = cufe.call(null, f, db);
  const costo = sum(f.items, it => it.cantidad * byId(db.productos, it.productoId).costo);
  f.asiento = { numero:"CNT-" + String(nextNumDb(db, "CNT")).padStart(5, "0"), fecha:ts, lineas:[
    { cuenta:"130505", nombre:"Clientes nacionales", debito:f.total, credito:0 },
    { cuenta:"413515", nombre:"Venta de partes, piezas y accesorios", debito:0, credito:f.subtotal },
    { cuenta:"240805", nombre:"IVA generado 19 %", debito:0, credito:f.iva },
    { cuenta:"613515", nombre:"Costo de ventas — repuestos", debito:costo, credito:0 },
    { cuenta:"143501", nombre:"Inventario de mercancías", debito:0, credito:costo }
  ]};
  const u = db.usuarios.find(x => x.id === userId);
  f.items.forEach((it, i) => {
    const p = byId(db.productos, it.productoId);
    p.stock[f.sucursalId] = Math.max(0, (p.stock[f.sucursalId] || 0) - it.cantidad);
    db.kardex.push({ fecha:ts, productoId:it.productoId, sucursalId:f.sucursalId, tipo:"Salida por factura", cantidad:-it.cantidad, ref:f.numero, usuario:u ? u.nombre : "Sistema" });
    if (p.garantiaMeses > 0){
      const vence = new Date(ts); vence.setMonth(vence.getMonth() + p.garantiaMeses);
      db.certificados.push({ codigo:certCode(f, it, i), facturaId:f.id, productoId:p.id, clienteId:f.clienteId, cantidad:it.cantidad, emitido:ts, vence:vence.toISOString() });
    }
  });
}
function buildRemision(db, f, ts, instr){
  const n = nextNumDb(db, "REM");
  const r = { id:"R" + n, numero:"REM-" + String(n).padStart(5, "0"), facturaId:f.id, fecha:ts, estado:"Alistamiento", instrucciones:instr, items:f.items.map(it => ({ productoId:it.productoId, cantidad:it.cantidad, contado:null, recibido:null })) };
  db.remisiones.push(r); f.remisionId = r.id; return r;
}
// cufe needs DB to resolve the client; during seed DB is the seed db
const _cufe = cufe;
cufe = function(f, db){ const prev = DB; if (db) DB = db; const r = _cufe(f); DB = prev; return r; };

/* ---------- Derivados de negocio ---------- */
const P = (perm) => !!ME && (DB.roles[ME.rol] || []).includes(perm);
const prod = id => byId(DB.productos, id);
const cli = id => byId(DB.clientes, id);
const ciudad = id => byId(DB.ciudades, id);
const suc = id => byId(DB.sucursales, id);
const usr = id => byId(DB.usuarios, id);
const rem = id => byId(DB.remisiones, id);
const stockTotal = p => sum(Object.values(p.stock), x => x);
function cupoComprometido(clienteId, excluirId){
  return sum(DB.facturas.filter(f => f.clienteId === clienteId && f.id !== excluirId && !f.pagada && (f.estado === "Pendiente" || f.estado === "Autorizada")), f => f.total)
       + sum(DB.pedidos.filter(p => p.clienteId === clienteId && p.id !== excluirId && p.estado === "Registrado"), p => p.total);
}
const nombreUsr = id => id === "SYS" ? "Sistema (factura de pedido)" : (usr(id)?.nombre || "—");
const origenTxt = f => f.origen === "Pedido" ? "Pedido " + (byId(DB.pedidos, f.pedidoId)?.numero || "") : "Manual";
const cupoDisponible = (c, excl) => c.cupo - cupoComprometido(c.id, excl);
function estadoLogistico(f){
  if (f.estado === "Pendiente") return ["Por autorizar","warn"];
  if (f.estado === "Rechazada") return ["Rechazada","bad"];
  if (!f.remisionId) return ["Sin remisión","info"];
  const r = rem(f.remisionId);
  return [r.estado, { "Alistamiento":"info","Verificada":"acc","En tránsito":"acc","Entregada":"ok","Con novedad":"bad" }[r.estado] || ""];
}
const pillFactura = f => `<span class="pill ${ {Pendiente:"warn",Autorizada:"ok",Rechazada:"bad"}[f.estado] || "" }">${esc(f.estado === "Pendiente" ? "Pendiente de autorización" : f.estado)}</span>`;
const pill = (txt, cls) => `<span class="pill ${cls||""}">${esc(txt)}</span>`;
