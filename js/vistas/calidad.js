"use strict";
/* Motorepuestos del Oriente
   Vista · Calidad, normas, requisitos y arquitectura. */

/* --- Calidad y normas --- */
function vCalidad(){
  const RF = [
    ["RF-00","Registrar y facturar pedidos de venta (contabilización automática)","Pedidos de venta","Logística"],
    ["RF-01","Registrar factura manual sin pedido, con consecutivo de resolución DIAN","Facturas → Registrar factura manual","Logística"],
    ["RF-02","Seleccionar país, departamento y ciudad de destino (catálogo DANE)","Registrar factura, paso 2","Logística"],
    ["RF-03","Validar cupo del cliente antes de registrar y de autorizar","Registrar factura / Autorizaciones","Logística, Gerente"],
    ["RF-04","Consultar facturas manuales pendientes de autorización","Autorizaciones","Gerente"],
    ["RF-05","Autorizar factura manual antes de contabilizarla (CUFE, inventario, asiento)","Autorizaciones","Gerente"],
    ["RF-06","Rechazar factura con motivo obligatorio (extiende RF-05)","Autorizaciones","Gerente"],
    ["RF-07","Contabilizar automáticamente la factura autorizada (PUC)","Detalle de factura → Contabilidad","Sistema"],
    ["RF-08","Registrar despacho (remisión) desde factura autorizada","Despachos","Despachos"],
    ["RF-09","Registrar instrucciones de envío completas","Despachos → Nueva remisión","Despachos"],
    ["RF-10","Verificar alistamiento con conteo ciego antes de la salida","Despachos → Remisión","Despachos"],
    ["RF-11","Registrar entrega y abrir novedad ante diferencias","Despachos → Remisión","Despachos"],
    ["RF-12","Gestionar inventario por sucursal, kárdex, ajustes y traslados","Inventario","Bodega"],
    ["RF-13","Gestionar importaciones y costo nacionalizado","Importaciones","Bodega"],
    ["RF-14","Emitir y verificar certificados de garantía","Certificados","Cliente externo"],
    ["RF-15","Gestionar ciudades y municipios","Administración","Administrador"],
    ["RF-16","Gestionar usuarios y permisos por rol","Administración","Administrador"],
    ["RF-17","Registrar bitácora inalterable y rastrear documentos","Trazabilidad","Auditor, Gerente"],
    ["RF-18","Estadísticas de ventas, entregas y stock","Tablero","Todos"],
    ["RF-19","Enviar correo al cliente en pedido, factura, despacho y pago","Notificaciones","Sistema"]
  ];
  const ISO = [
    ["Adecuación funcional","Completitud, corrección, pertinencia","Los requisitos funcionales cubren todos los casos de uso del diagrama; cálculos de IVA, cupo y costo nacionalizado verificables."],
    ["Eficiencia de desempeño","Tiempo de respuesta, uso de recursos, capacidad","Prototipo sin dependencias: cada pantalla en menos de 100 ms. Producción: 100.000 sesiones concurrentes con interfaz en CDN, API sin estado detrás de balanceador con autoescalado, sesiones en Redis y PostgreSQL con réplicas de lectura."],
    ["Compatibilidad","Coexistencia, interoperabilidad","Respaldo en JSON; modelo relacional en SQL estándar listo para PostgreSQL; CUFE con la estructura de la factura electrónica."],
    ["Usabilidad","Aprendizaje, operabilidad, protección contra errores, accesibilidad","Validación en línea, mensajes que explican cómo corregir, botones deshabilitados con causa visible, WCAG 2.1 AA."],
    ["Fiabilidad","Madurez, disponibilidad, tolerancia a fallos, recuperación","Meta: tiempo en falla ≤ 0,5 % de la operación (disponibilidad ≥ 99,5 %, máximo 3,6 horas al mes). Réplicas en dos zonas, verificación de salud cada minuto, respaldos diarios. En el prototipo: respaldo y restauración, y sigue en memoria si el almacenamiento falla."],
    ["Seguridad","Confidencialidad, integridad, no repudio, responsabilidad, autenticidad","Permisos por rol, segregación de funciones, bitácora encadenada SHA-256, CUFE verificable, certificados con código único."],
    ["Mantenibilidad","Modularidad, reusabilidad, analizabilidad, modificabilidad, capacidad de prueba","Vistas, acciones y reglas de negocio separadas; reglas como funciones puras (calcTotales, cupoDisponible, costeo)."],
    ["Portabilidad","Adaptabilidad, instalabilidad","Diseño adaptable desde 360 px hasta escritorio; se publica copiando un archivo a cualquier hosting estático."]
  ];
  const A11Y = ["Contraste mínimo 4.5:1 en texto y modo de alto contraste","Tamaño de texto ajustable hasta 130 % sin pérdida de contenido","Tipografía Atkinson Hyperlegible, diseñada para baja visión","Navegación completa por teclado y foco visible","Enlace para saltar al contenido principal","Etiquetas en todos los campos y errores anunciados (aria-live, role=alert)","Gráficos con texto alternativo y tabla equivalente para lectores de pantalla","Lectura en voz alta de la pantalla actual","Respeta la preferencia de reducir movimiento del sistema","Espaciado amplio para dislexia y lectura fácil","Tema claro y oscuro"];
  return `<div class="page-head"><div><p class="eyebrow">Ingeniería de Software III</p><h1>Calidad y normas</h1><p>Cómo responde el sistema a los problemas de Motorepuestos del Oriente y a los modelos de calidad vistos en clase. La documentación completa está en la carpeta <span class="mono">docs/</span> del proyecto.</p></div></div>
  <section class="panel"><header><h2>Problemas del negocio y respuesta del sistema</h2></header>
    <div class="tw"><table><thead><tr><th>Problema encontrado</th><th>Control implementado</th></tr></thead><tbody>
    <tr><td class="wrap">Fraude: llegan repuestos de más o de menos según el pedido</td><td class="wrap">Autorización por un gerente distinto a quien factura; conteo ciego al alistar; registro de lo recibido en la entrega; novedades con seguimiento; bitácora inalterable.</td></tr>
    <tr><td class="wrap">Facturas manuales sin control (número, fecha, valor, cupo)</td><td class="wrap">Consecutivo automático de la resolución DIAN, validación de cupo, CUFE y contabilización automática.</td></tr>
    <tr><td class="wrap">Malas indicaciones para el envío</td><td class="wrap">Remisión con dirección, punto de referencia, contacto, teléfono, transportadora, guía, franja e instrucciones obligatorias.</td></tr>
    <tr><td class="wrap">Necesidad de certificados que garanticen el funcionamiento</td><td class="wrap">Certificado de garantía por referencia vendida, verificable públicamente con su código.</td></tr>
    <tr><td class="wrap">Facturación electrónica</td><td class="wrap">Estructura de factura electrónica con CUFE y resolución (simulada; la transmisión real a la DIAN se hace con un proveedor tecnológico autorizado).</td></tr>
    <tr><td class="wrap">Envío de facturas según ISO 9000</td><td class="wrap">Flujo documentado y trazable: Logística → Gerencia → Despachos → Cliente, con evidencia de cada paso (ISO 9001:2015, 8.5.2).</td></tr>
    </tbody></table></div></section>
  <section class="panel" aria-labelledby="ar-t"><header><h2 id="ar-t">Arquitectura del software</h2><span class="muted">Detalle en docs/arquitectura.md</span></header>
    <dl class="kv"><dt>Tipo</dt><dd>Aplicación web de una sola página (SPA)</dd><dt>Estilo</dt><dd>Arquitectura en capas con separación Modelo–Vista–Controlador</dd><dt>Tecnologías</dt><dd>HTML5, CSS3 y JavaScript sin frameworks ni dependencias</dd><dt>Metodología</dt><dd>Incremental con prototipado evolutivo; requisitos IEEE 830; procedimiento ISO 9001</dd><dt>Producción</dt><dd>Tres capas: interfaz en CDN, API REST escalable, PostgreSQL con réplicas</dd></dl>
    <div class="tw"><table><thead><tr><th>Capa</th><th>Módulos</th><th>Responsabilidad</th></tr></thead><tbody>
    ${[["Presentación (Vista)","js/vistas/ (14) · js/ui/ (4) · css/","Dibujar cada pantalla a partir del estado; accesibilidad"],["Control (Controlador)","js/controladores/eventos, acciones, formularios","Recibir eventos, verificar permisos, validar datos"],["Dominio (Modelo)","js/dominio/reglas-negocio","Facturar, autorizar, contabilizar, cupo, remisiones, correos"],["Datos (Modelo)","js/datos/estado-y-auditoria, persistencia, datos-ejemplo","Estado, bitácora encadenada, guardar y cargar"],["Núcleo","js/nucleo/utilidades, seguridad","SHA-256, formatos, escape de HTML, roles y permisos"]].map(r => `<tr><td><b>${r[0]}</b></td><td class="mono wrap">${r[1]}</td><td class="wrap">${r[2]}</td></tr>`).join("")}
    </tbody></table></div>
    <p class="muted" style="font-size:.88rem">Flujo en un solo sentido: evento del usuario → controlador → regla de negocio → datos y bitácora → la vista se vuelve a dibujar. Patrones: MVC, comando, delegación de eventos, RBAC, segregación de funciones, registro encadenado con SHA-256 y máquina de estados.</p></section>
  <section class="panel" aria-labelledby="cc-t"><header><h2 id="cc-t">Actividad 2 · Consultoría cruzada: requerimientos y su tipo</h2><span class="muted">Tarjetas confidenciales A y B</span></header>
    <div class="tw"><table><thead><tr><th>#</th><th>Requerimiento</th><th>Tipo</th><th>Cómo lo cumple el sistema</th><th>Cómo se prueba</th></tr></thead><tbody>
    ${[
      ["A1","Enviar correo al registrar pedido de venta, despacho, emisión de factura y pago","Funcional (notificación)","Pantalla Notificaciones: 4 eventos con correo al cliente","Ejecutar cada transacción y verificar el correo en la bandeja (destinatario, asunto, documento)"],
      ["A2","Operar con hasta 100.000 usuarios en sesiones concurrentes","No funcional de rendimiento (capacidad y escalabilidad)","Arquitectura escalable horizontalmente (ver docs/actividad2-consultoria.md)","Prueba de carga con k6 en rampa hasta 100.000 usuarios virtuales; p95 < 2 s y errores < 1 %"],
      ["A3","Diseño responsive para computador, tableta y celular","No funcional de usabilidad y portabilidad (adaptabilidad)","Diseño adaptable de 360 px a escritorio; menú lateral que se pliega","Matriz de dispositivos: 360, 768, 1024 y 1440 px, sin desplazamiento horizontal"],
      ["A4","El tiempo en falla no supera el 0,5 % del tiempo total de operación","No funcional de fiabilidad (disponibilidad ≥ 99,5 %)","Réplicas, verificación de salud y respaldos; máximo 3,6 horas fuera de servicio al mes","Monitoreo externo cada minuto durante 30 días; disponibilidad = tiempo arriba / tiempo total"],
      ["B1","Procedimiento de desarrollo documentado en manuales y conforme con ISO 9000","Restricción de proceso (organizacional, estándar de calidad)","docs/manual-procedimientos.md con fases, registros, revisiones y control de cambios","Auditoría interna con lista de chequeo ISO 9001:2015 (7.5, 8.1, 8.3, 10.2)"],
      ["B2","Facturas manuales sin pedido que requieren autorización de gerentes antes de contabilizarse","Funcional (regla de negocio)","Pedidos se contabilizan solos; las manuales esperan en Autorizaciones","Intentar despachar o contabilizar una manual sin autorizar: el sistema no lo permite"],
      ["B3","Estado y ciudad en listas de preselección filtradas por el país; la ciudad debe estar registrada","Funcional de interfaz, con restricción de integridad de datos","Listas en cascada; municipios solo del catálogo de Administración","Cambiar de país y verificar que los estados se filtran; no hay forma de escribir una ciudad libre"],
      ["B4","Páginas que cumplan la ley de igualdad para personas con discapacidad","Restricción legal (exige requisitos no funcionales de accesibilidad)","Ley 1618 de 2013, Resolución MinTIC 1519 de 2020, WCAG 2.1 AA: panel de accesibilidad, teclado, lector de pantalla","Auditoría automática (axe, Lighthouse) y manual con lector de pantalla NVDA y solo teclado"]
    ].map(r => `<tr><td class="mono">${r[0]}</td><td class="wrap">${esc(r[1])}</td><td class="wrap"><b>${esc(r[2])}</b></td><td class="wrap">${esc(r[3])}</td><td class="wrap">${esc(r[4])}</td></tr>`).join("")}
    </tbody></table></div></section>
  <section class="panel"><header><h2>Matriz de requisitos funcionales</h2><span class="muted">Trazada al diagrama de casos de uso</span></header>
    <div class="tw"><table><thead><tr><th>ID</th><th>Requisito</th><th>Dónde se cumple</th><th>Actor</th></tr></thead><tbody>${RF.map(r => `<tr><td class="mono">${r[0]}</td><td class="wrap">${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</tbody></table></div></section>
  <section class="panel"><header><h2>Modelo de calidad ISO/IEC 25010</h2><span class="muted">Familia ISO/IEC 25000 (SQuaRE)</span></header>
    <div class="tw"><table><thead><tr><th>Característica</th><th>Subcaracterísticas</th><th>Evidencia en el sistema</th></tr></thead><tbody>${ISO.map(r => `<tr><td><b>${esc(r[0])}</b></td><td class="wrap muted">${esc(r[1])}</td><td class="wrap">${esc(r[2])}</td></tr>`).join("")}</tbody></table></div></section>
  <div class="grid g2">
    <section class="panel"><header><h2>Accesibilidad (WCAG 2.1 AA · NTC 5854)</h2></header><ul style="margin:0;padding-left:1.2em;display:grid;gap:4px">${A11Y.map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>
    <section class="panel"><header><h2>Marco normativo</h2></header><dl class="kv">
      <dt>ISO/IEC 25010</dt><dd>Modelo de calidad del producto de software</dd><dt>ISO 9001:2015</dt><dd>Gestión de calidad: diseño y desarrollo (8.3), trazabilidad (8.5.2), información documentada (7.5); ver docs/manual-procedimientos.md</dd><dt>IEEE 830</dt><dd>Especificación de requisitos (docs/SRS-IEEE830.md)</dd><dt>DIAN</dt><dd>Resolución 000165 de 2023, factura electrónica de venta</dd><dt>Ley 1581 de 2012</dt><dd>Protección de datos personales (habeas data)</dd><dt>Ley 1618 de 2013</dt><dd>Derechos de las personas con discapacidad; acceso a la información en igualdad de condiciones</dd><dt>Ley 1346 de 2009</dt><dd>Aprueba la Convención de la ONU sobre los derechos de las personas con discapacidad</dd><dt>Res. MinTIC 1519 de 2020</dt><dd>Estándares de accesibilidad web (anexo 1, WCAG 2.1 AA)</dd><dt>WCAG 2.1 / NTC 5854</dt><dd>Accesibilidad web</dd><dt>PUC</dt><dd>Decreto 2650 de 1993, cuentas del asiento automático</dd></dl></section>
  </div>`;
}
