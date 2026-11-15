// NIVEL 1 DEL MODELO EN V · PRUEBAS DE COMPONENTES (UNITARIAS, CAJA BLANCA)
// Cada prueba es atómica (una sola funcionalidad), independiente, repetible y automatizable.
// Ejecutar: node --test tests/unitarias.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const cargar = require("./cargar-modulos");
const m = cargar();

test("CU-01 · sha256 de 'abc' coincide con el valor estándar", () => {
  assert.equal(m.sha("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("CU-02 · sha256 con tildes y ñ coincide con la librería criptográfica de Node", () => {
  const texto = "Motorepuestos del Oriente · Rionegro · año";
  assert.equal(m.sha(texto), crypto.createHash("sha256").update(texto).digest("hex"));
});

test("CU-03 · esc() neutraliza etiquetas HTML (prevención de XSS)", () => {
  assert.equal(m.esc('<script>alert("x")</script>'), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
});

test("CU-04 · esc() convierte null y undefined en texto vacío", () => {
  assert.equal(m.esc(null), "");
  assert.equal(m.esc(undefined), "");
});

test("CU-05 · calcTotales: subtotal, IVA 19 % y total de dos líneas", () => {
  const t = m.calcTotales([{ cantidad: 2, precio: 10000 }, { cantidad: 1, precio: 5000 }]);
  assert.deepEqual({ ...t }, { subtotal: 25000, iva: 4750, total: 29750 });
});

test("CU-06 · calcTotales: factura sin líneas suma cero", () => {
  assert.deepEqual({ ...m.calcTotales([]) }, { subtotal: 0, iva: 0, total: 0 });
});

test("CU-07 · calcTotales: el IVA se redondea al peso", () => {
  const t = m.calcTotales([{ cantidad: 1, precio: 9999 }]);
  assert.equal(t.iva, 1900); // 9999 × 0,19 = 1899,81 → 1900
  assert.equal(t.total, 11899);
});

test("CU-08 · CUFE: es determinista para la misma factura", () => {
  m.DB = m.seed();
  const f = m.DB.facturas.find(x => x.cufe);
  assert.equal(m.cufe(f), f.cufe);
});

test("CU-09 · CUFE: cambia si se altera el total de la factura", () => {
  m.DB = m.seed();
  const f = { ...m.DB.facturas.find(x => x.cufe) };
  f.total += 1000;
  assert.notEqual(m.cufe(f), m.DB.facturas.find(x => x.id === f.id).cufe);
});

test("CU-10 · Código de certificado con formato CG-XXXX-XXXX", () => {
  m.DB = m.seed();
  for (const c of m.DB.certificados) assert.match(c.codigo, /^CG-[0-9A-F]{4}-[0-9A-F]{4}$/);
});

test("CU-11 · costeo de importación: CIF, arancel y factor", () => {
  const im = { trm: 4000, fleteUSD: 100, seguroUSD: 0, arancelPct: 10, items: [{ cantidad: 10, fobUSD: 10 }] };
  const k = m.costeo(im);
  assert.equal(k.fob, 100);
  assert.equal(k.cif, 200);
  assert.equal(k.cifCOP, 800000);
  assert.equal(k.arancel, 80000);
  assert.equal(k.costoTotal, 880000);
  assert.equal(k.factor, 2.2);
});

test("CU-12 · difDetalle describe solo las líneas con diferencia", () => {
  m.DB = m.seed();
  const items = [{ productoId: "PR1", cantidad: 10, contado: 11 }, { productoId: "PR2", cantidad: 5, contado: 5 }];
  assert.equal(m.difDetalle(m.DB, items, "contado"), "BUJ-CR7HSA: facturado 10, contado 11");
});

test("CU-13 · Bitácora recién creada: la cadena de huellas es íntegra", () => {
  m.DB = m.seed();
  assert.equal(m.verificarCadena().ok, true);
});

test("CU-14 · Bitácora alterada: se detecta el registro modificado", () => {
  m.DB = m.seed();
  m.DB.audit[9].detalle = "valor cambiado por fuera del sistema";
  const r = m.verificarCadena();
  assert.equal(r.ok, false);
  assert.equal(r.seq, 10);
});

test("CU-15 · Permisos: el Auditor no puede autorizar facturas", () => {
  assert.equal(m.ROLES_BASE.Auditor.includes("facturas.autorizar"), false);
});

test("CU-16 · Permisos: el Gerente sí puede autorizar facturas", () => {
  assert.equal(m.ROLES_BASE.Gerente.includes("facturas.autorizar"), true);
});

test("CU-17 · Cupo disponible = cupo − facturas sin pagar − pedidos registrados", () => {
  m.DB = m.seed();
  const c = m.DB.clientes[0];
  const facturas = m.DB.facturas.filter(f => f.clienteId === c.id && !f.pagada && ["Pendiente", "Autorizada"].includes(f.estado)).reduce((a, f) => a + f.total, 0);
  const pedidos = m.DB.pedidos.filter(p => p.clienteId === c.id && p.estado === "Registrado").reduce((a, p) => a + p.total, 0);
  assert.equal(m.cupoDisponible(c), c.cupo - facturas - pedidos);
});
