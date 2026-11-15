"use strict";
/* Motorepuestos del Oriente
   Capa núcleo · Seguridad: catálogo de permisos y permisos por rol (RBAC). */

/* ---------- Seguridad: roles y permisos (RBAC) ---------- */
const PERMISOS = {
  "tablero":              "Ver tablero y estadísticas",
  "pedidos.gestionar":    "Registrar y facturar pedidos de venta",
  "facturas.ver":         "Consultar facturas",
  "facturas.crear":       "Registrar factura manual",
  "facturas.autorizar":   "Autorizar o rechazar facturas",
  "cartera.pagos":        "Registrar pagos de clientes",
  "despachos.gestionar":  "Gestionar remisiones y despachos",
  "inventario.ver":       "Consultar inventario",
  "inventario.gestionar": "Ajustes, traslados y productos",
  "importaciones.gestionar": "Gestionar importaciones",
  "clientes.gestionar":   "Gestionar clientes y cupos",
  "auditoria.ver":        "Ver trazabilidad y auditoría",
  "admin.usuarios":       "Gestionar usuarios y permisos",
  "admin.catalogos":      "Gestionar ciudades, municipios y sucursales"
};
/* Configuración del sistema.
   modoDemo: muestra los accesos rápidos de la pantalla de ingreso, el cambio de usuario y la guía.
   En producción se pone en false y cada empleado entra con su usuario y contraseña. */
const CONFIG = { modoDemo: true, claveDemo: "demo2026", intentosMaximos: 3, minutosBloqueo: 5 };
const hashClave = (usuario, clave) => sha(String(usuario).toLowerCase() + "|" + clave);

const ROL_DESC = {
  "Administrador": "Usuarios, permisos, ciudades y sucursales",
  "Gerente": "Autoriza facturas manuales, registra pagos y cierra novedades",
  "Logística": "Registra pedidos de venta y facturas manuales",
  "Despachos": "Crea remisiones, hace el conteo ciego y registra entregas",
  "Bodega": "Inventario, traslados e importaciones",
  "Auditor": "Consulta la trazabilidad y verifica la integridad"
};
const ROLES_BASE = {
  "Administrador": Object.keys(PERMISOS),
  "Gerente":    ["tablero","pedidos.gestionar","facturas.ver","facturas.autorizar","cartera.pagos","inventario.ver","clientes.gestionar","auditoria.ver","despachos.gestionar"],
  "Logística":  ["tablero","pedidos.gestionar","facturas.ver","facturas.crear","inventario.ver","clientes.gestionar"],
  "Despachos":  ["tablero","facturas.ver","despachos.gestionar","inventario.ver"],
  "Bodega":     ["tablero","inventario.ver","inventario.gestionar","importaciones.gestionar","facturas.ver"],
  "Auditor":    ["tablero","facturas.ver","inventario.ver","auditoria.ver"]
};
