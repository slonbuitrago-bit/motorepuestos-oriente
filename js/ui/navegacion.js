"use strict";
/* Motorepuestos del Oriente
   Capa de presentación · Rutas, control de acceso por pantalla y render del armazón de la aplicación. */

/* ---------- Navegación ---------- */
const RUTAS = [
  { id:"inicio", label:"Tablero", perm:"tablero", grp:"Operación" },
  { id:"pedidos", label:"Pedidos de venta", perm:"pedidos.gestionar", grp:"Operación", count:() => DB.pedidos.filter(p => p.estado === "Registrado").length },
  { id:"facturas", label:"Facturas", perm:"facturas.ver", grp:"Operación" },
  { id:"autorizaciones", label:"Autorizaciones", perm:"facturas.autorizar", grp:"Operación", count:() => DB.facturas.filter(f => f.estado === "Pendiente").length },
  { id:"despachos", label:"Despachos", perm:"despachos.gestionar", grp:"Operación", count:() => DB.facturas.filter(f => f.estado === "Autorizada" && !f.remisionId).length + DB.remisiones.filter(r => r.estado === "Alistamiento").length },
  { id:"inventario", label:"Inventario", perm:"inventario.ver", grp:"Abastecimiento" },
  { id:"importaciones", label:"Importaciones", perm:"importaciones.gestionar", grp:"Abastecimiento" },
  { id:"clientes", label:"Clientes y cupos", perm:"facturas.ver", grp:"Abastecimiento" },
  { id:"trazabilidad", label:"Trazabilidad", perm:"auditoria.ver", grp:"Control" },
  { id:"notificaciones", label:"Notificaciones", perm:"auditoria.ver", grp:"Control" },
  { id:"certificados", label:"Certificados", perm:null, grp:"Control" },
  { id:"administracion", label:"Administración", perm:"admin.catalogos", alt:"admin.usuarios", grp:"Control" },
  { id:"calidad", label:"Calidad y normas", perm:null, grp:"Control" }
];
const EXTRA = { "factura-nueva":{ label:"Registrar factura manual", perm:"facturas.crear" }, "pedido-nuevo":{ label:"Registrar pedido de venta", perm:"pedidos.gestionar" } };
function puedeVer(id){ const r = RUTAS.find(x => x.id === id) || EXTRA[id]; if (!r) return false; return !r.perm || P(r.perm) || (r.alt && P(r.alt)); }
function ruta(){ const h = (location.hash || "").replace("#", ""); return h || "inicio"; }
function ir(id){ if (location.hash === "#" + id) render(); else location.hash = id; }

/* ---------- Render principal ---------- */
function render(){
  const app = $("#app");
  if (!ME){ app.innerHTML = vLogin(); return; }
  let r = ruta();
  if (!puedeVer(r)) r = "inicio";
  const meta = RUTAS.find(x => x.id === r) || EXTRA[r];
  let grp = "";
  const nav = RUTAS.filter(x => puedeVer(x.id)).map(x => {
    let g = "";
    if (x.grp !== grp){ grp = x.grp; g = `<div class="grp" aria-hidden="true">${esc(grp)}</div>`; }
    const c = x.count ? x.count() : 0;
    return g + `<a href="#${x.id}" ${x.id === r || (r === "factura-nueva" && x.id === "facturas") || (r === "pedido-nuevo" && x.id === "pedidos") ? 'aria-current="page"' : ""}>${icon(x.id)}<span>${esc(x.label)}</span>${c ? `<span class="count" aria-label="${c} pendientes">${c}</span>` : ""}</a>`;
  }).join("");
  const sucNom = suc(ME.sucursalId)?.nombre || "";
  app.innerHTML = `
  <div class="shell">
    <aside class="rail ${UI.menuOpen ? "open" : ""}" id="rail" aria-label="Menú principal">
      <div class="brand"><div class="mark" aria-hidden="true">MRO</div><div><b>Motorepuestos<br>del Oriente</b><small>Rionegro · Antioquia</small></div></div>
      <nav class="nav" aria-label="Secciones">${nav}</nav>
      <div class="me"><b>${esc(ME.nombre)}</b><span>${esc(ME.rol)} · ${esc(sucNom)}</span>
        <div class="row" style="margin-top:10px"><button class="btn sm" data-act="logout">${icon("salir")} Cerrar sesión</button></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="btn ghost menu-btn" data-act="menu" aria-expanded="${UI.menuOpen}" aria-controls="rail">${icon("menu")}<span class="sr">Abrir menú</span></button>
        <span class="crumb">${esc(meta.label)}</span><span class="sp"></span>
        <button class="btn ghost" data-act="leer" title="Leer esta pantalla en voz alta">${icon("voz")}<span class="sr">Leer en voz alta</span></button>
        <button class="btn" data-act="a11y" aria-expanded="${UI.a11yOpen}" aria-controls="a11y-panel">${icon("a11y")}<span>Accesibilidad</span></button>
      </header>
      ${UI.a11yOpen ? vA11y() : ""}
      <main id="main" tabindex="-1">${VIEWS[r]()}</main>
    </div>
  </div>`;
  document.title = meta.label + " · Motorepuestos del Oriente";
  if (AFTER[r]) AFTER[r]();
}
