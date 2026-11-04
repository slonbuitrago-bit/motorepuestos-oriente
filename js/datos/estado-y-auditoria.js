"use strict";
/* Motorepuestos del Oriente
   Capa de datos · Estado global, consecutivos, bitácora encadenada (SHA-256), CUFE y códigos de certificado. */

/* ---------- Datos ---------- */
let DB = null, ME = null, PREFS = {};
const UI = { tab:{}, filtros:{}, draft:null, a11yOpen:false, menuOpen:false };

function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function nextNum(key){ DB.seq[key] = (DB.seq[key] || 0) + 1; return DB.seq[key]; }
function canonAudit(e){ return [e.seq, e.ts, e.usuario, e.rol, e.accion, e.entidad, e.ref, e.detalle].join("|"); }
function audit(accion, entidad, ref, detalle, opt = {}){
  const u = opt.user || ME;
  const prev = DB.audit.length ? DB.audit[DB.audit.length - 1].hash : "0".repeat(64);
  const e = { seq: DB.audit.length + 1, ts: opt.at || new Date().toISOString(), usuario: u ? u.nombre : "Sistema", rol: u ? u.rol : "Sistema", accion, entidad, ref: ref || "", detalle: detalle || "" };
  e.prev = prev; e.hash = sha(prev + "|" + canonAudit(e));
  DB.audit.push(e);
}
function verificarCadena(){
  let prev = "0".repeat(64);
  for (const e of DB.audit){
    if (e.prev !== prev || sha(prev + "|" + canonAudit(e)) !== e.hash) return { ok:false, seq:e.seq };
    prev = e.hash;
  }
  return { ok:true, n: DB.audit.length };
}
function cufe(f){
  const cli = byId(DB.clientes, f.clienteId);
  return sha([f.numero, f.fecha, f.subtotal.toFixed(2), "01", f.iva.toFixed(2), f.total.toFixed(2), DB.empresa.nit, cli ? cli.nit : "", "2-pruebas"].join("|"));
}
function certCode(f, it, i){ const h = sha(f.numero + "|" + it.productoId + "|" + i + "|" + f.cufe).toUpperCase(); return "CG-" + h.slice(0,4) + "-" + h.slice(4,8); }
