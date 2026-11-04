"use strict";
/* Motorepuestos del Oriente
   Arranque · Registro de vistas e inicio de la aplicación. */

const VIEWS = { inicio:vInicio, pedidos:vPedidos, "pedido-nuevo":vFacturaNueva, notificaciones:vNotificaciones, facturas:vFacturas, "factura-nueva":vFacturaNueva, autorizaciones:vAutorizaciones, despachos:vDespachos, inventario:vInventario, importaciones:vImportaciones, clientes:vClientes, trazabilidad:vTrazabilidad, certificados:vCertificados, administracion:vAdministracion, calidad:vCalidad };
const AFTER = {};

/* ---------- Arranque ---------- */
load(); loadPrefs();
const ses = store.get(SES_KEY); if (ses){ const u = usr(ses); if (u && u.activo) ME = u; }
if (!ME && ruta() === "certificados") UI.publico = true;
render();
