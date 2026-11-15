// NIVEL 2 DEL MODELO EN V · PRUEBAS DE INTEGRACIÓN (INCREMENTAL BOTTOM-UP)
// Se integran primero los componentes de bajo nivel (datos) y luego los de mayor nivel
// (dominio): pedido → factura → autorización → contabilidad → inventario → remisión → correo.
// Ejecutar: node --test tests/integracion.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const cargar = require("./cargar-modulos");
const m = cargar();
const ahora = () => new Date().toISOString();

function base(){ m.DB = m.seed(); return m.DB; }

test("CI-01 · Datos + dominio: un pedido facturado queda contabilizado sin autorización (B2)", () => {
  const db = base();
  const c = db.clientes[3];
  const ped = m.buildPedido(db, c.id, "S1", c.ciudadId, [{ productoId: "PR1", cantidad: 5, precio: 14000 }], ahora(), "U3");
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, ped.items.map(x => ({ ...x })), ahora(), "U3", ped);
  m.autorizarFactura(db, f, "SYS", ahora());
  assert.equal(ped.estado, "Facturado");
  assert.equal(f.origen, "Pedido");
  assert.equal(f.estado, "Autorizada");
  assert.ok(f.asiento, "debe existir asiento contable");
});

test("CI-02 · Factura manual: queda Pendiente y sin asiento hasta que un gerente la autorice (B2)", () => {
  const db = base();
  const c = db.clientes[1];
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, [{ productoId: "PR6", cantidad: 3, precio: 18000 }], ahora(), "U3");
  assert.equal(f.origen, "Manual");
  assert.equal(f.estado, "Pendiente");
  assert.equal(f.asiento, undefined);
  m.autorizarFactura(db, f, "U2", ahora());
  assert.equal(f.estado, "Autorizada");
  assert.equal(f.revisadoPor, "U2");
});

test("CI-03 · Dominio + contabilidad: el asiento queda cuadrado (débitos = créditos)", () => {
  const db = base();
  const c = db.clientes[0];
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, [{ productoId: "PR4", cantidad: 2, precio: 145000 }, { productoId: "PR12", cantidad: 6, precio: 32000 }], ahora(), "U3");
  m.autorizarFactura(db, f, "U2", ahora());
  const deb = f.asiento.lineas.reduce((a, l) => a + l.debito, 0);
  const cre = f.asiento.lineas.reduce((a, l) => a + l.credito, 0);
  assert.equal(deb, cre);
  assert.equal(f.asiento.lineas.find(l => l.cuenta === "130505").debito, f.total);
});

test("CI-04 · Dominio + inventario: autorizar descuenta existencias y registra el kárdex", () => {
  const db = base();
  const c = db.clientes[0];
  const p = db.productos.find(x => x.id === "PR1");
  const antes = p.stock.S1;
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, [{ productoId: "PR1", cantidad: 7, precio: p.precio }], ahora(), "U3");
  m.autorizarFactura(db, f, "U2", ahora());
  assert.equal(p.stock.S1, antes - 7);
  assert.ok(db.kardex.some(k => k.ref === f.numero && k.cantidad === -7));
});

test("CI-05 · Dominio + certificados: se emite un certificado por cada referencia con garantía", () => {
  const db = base();
  const c = db.clientes[0];
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, [{ productoId: "PR7", cantidad: 1, precio: 118000 }, { productoId: "PR12", cantidad: 2, precio: 32000 }], ahora(), "U3");
  m.autorizarFactura(db, f, "U2", ahora());
  const certs = db.certificados.filter(x => x.facturaId === f.id);
  assert.equal(certs.length, 1); // PR12 (aceite) no tiene garantía
  assert.equal(certs[0].productoId, "PR7");
});

test("CI-06 · Dominio + notificaciones: cada transacción genera su correo al cliente (A1)", () => {
  const db = base();
  const c = db.clientes[2];
  const ped = m.buildPedido(db, c.id, "S1", c.ciudadId, [{ productoId: "PR2", cantidad: 2, precio: 38000 }], ahora(), "U3");
  m.correo(db, "Pedido de venta", ped, ahora());
  const f = m.buildFactura(db, c.id, "S1", c.ciudadId, ped.items, ahora(), "U3", ped);
  m.autorizarFactura(db, f, "SYS", ahora());
  m.correo(db, "Factura emitida", f, ahora());
  const r = m.buildRemision(db, f, ahora(), { direccion: "Calle 1", contacto: "X", telefono: "6045551234", transportadora: "Flota propia", guia: "", franja: "AM", observaciones: "" });
  m.correo(db, "Despacho", r, ahora());
  m.correo(db, "Pago registrado", f, ahora());
  const mios = db.correos.slice(-4);
  assert.equal(mios.map(x => x.tipo).join(" | "), "Pedido de venta | Factura emitida | Despacho | Pago registrado");
  assert.ok(mios.every(x => x.para === c.email));
});

test("CI-07 · Factura + remisión: la remisión copia las líneas facturadas para el conteo ciego", () => {
  const db = base();
  const f = db.facturas.find(x => x.estado === "Autorizada" && !x.remisionId);
  const r = m.buildRemision(db, f, ahora(), { direccion: "Calle 1", contacto: "X", telefono: "6045551234", transportadora: "Coordinadora", guia: "G1", franja: "AM", observaciones: "" });
  assert.equal(f.remisionId, r.id);
  assert.equal(r.estado, "Alistamiento");
  assert.equal(r.items.map(i => i.cantidad).join(","), f.items.map(i => i.cantidad).join(","));
  assert.ok(r.items.every(i => i.contado === null));
});

test("CI-08 · Pedidos + cupo: un pedido registrado compromete el cupo del cliente", () => {
  const db = base();
  const c = db.clientes[4];
  const antes = m.cupoDisponible(c);
  m.buildPedido(db, c.id, "S1", c.ciudadId, [{ productoId: "PR3", cantidad: 1, precio: 62000 }], ahora(), "U3");
  assert.equal(m.cupoDisponible(c), antes - 73780); // 62000 + IVA 11780
});

test("CI-09 · Bitácora integrada: tras varias operaciones la cadena sigue íntegra", () => {
  const db = base();
  m.ME = db.usuarios[1];
  for (let i = 0; i < 20; i++) m.audit("Prueba de integración", "Sistema", "T-" + i, "registro " + i);
  assert.equal(m.verificarCadena().ok, true);
});

test("CI-10 · Consistencia de los datos de ejemplo: consecutivos en orden, cupos respetados y existencias no negativas", () => {
  const db = base();
  for (const k of ["facturas", "pedidos"]) for (let i = 1; i < db[k].length; i++) assert.ok(db[k][i].fecha >= db[k][i - 1].fecha, `${k} fuera de orden en ${db[k][i].numero}`);
  for (const c of db.clientes) assert.ok(m.cupoDisponible(c) >= 0, `${c.nombre} supera su cupo`);
  for (const p of db.productos) for (const v of Object.values(p.stock)) assert.ok(v >= 0, `${p.sku} con existencia negativa`);
});
