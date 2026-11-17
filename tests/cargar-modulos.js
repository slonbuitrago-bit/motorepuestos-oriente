// Carga las capas de núcleo, datos y dominio en un contexto aislado (sin navegador)
// para probar las funciones como componentes independientes (pruebas unitarias).
const fs = require("fs"), path = require("path"), vm = require("vm");
const ORDEN = ["js/nucleo/utilidades.js", "js/nucleo/seguridad.js", "js/datos/estado-y-auditoria.js", "js/datos/catalogo-dane.js",
  "js/datos/datos-ejemplo.js", "js/dominio/reglas-negocio.js", "js/datos/persistencia.js"];
module.exports = function cargar(){
  const mem = {};
  const ctx = { console, Intl, Date, Math, JSON, unescape, encodeURIComponent,
    localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } } };
  vm.createContext(ctx);
  for (const f of ORDEN) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), ctx, { filename: f });
  // Exponer las variables de nivel superior (let/const) para las pruebas
  vm.runInContext("globalThis.$t = { get DB(){ return DB; }, set DB(v){ DB = v; }, get ME(){ return ME; }, set ME(v){ ME = v; }, sha, sha256, esc, calcTotales, cupoDisponible, cupoComprometido, cufe, certCode, costeo: typeof costeo === 'function' ? costeo : null, difDetalle, verificarCadena, audit, seed, load, save, buildPedido, buildFactura, buildRemision, autorizarFactura, correo, P, PERMISOS, ROLES_BASE, byId, money };", ctx);
  return ctx.$t;
};
