const pptxgen = require("pptxgenjs");
const QR = require("qrcode");
const path = require("path");
const { applyTheme } = require("/root/.claude/skills/synced/1962969c-1fb5-4216-b338-c00c5c8f3a43_830e396e-2b1d-4f29-8bb2-96a38b9d0a28/pptx/scripts/apply_theme.js");
const REPO = "/home/user/motorepuestos-oriente";
const OUT = path.join(REPO, "docs/final/Presentacion-Sustentacion-Motorepuestos-del-Oriente.pptx");
const APP = "https://slonbuitrago-bit.github.io/motorepuestos-oriente/";

const THEME = { name: "Motorepuestos del Oriente", headFontFace: "Arial", bodyFontFace: "Calibri",
  colors: { dk1: "121212", lt1: "FFFFFF", dk2: "1E1E20", lt2: "F2F3F5", accent1: "F2661C", accent2: "FFC21A", accent3: "D7263D", accent4: "1E9E5A", accent5: "4A4A4F", accent6: "8A8A90", hlink: "F2661C", folHlink: "D97E2E" } };

(async () => {
  const qr = await QR.toDataURL(APP, { margin: 1, width: 600, color: { dark: "#121212", light: "#FFFFFF" } });
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "Sustentación · Motorepuestos del Oriente"; pres.author = "Equipo Motorepuestos del Oriente";
  const C = pres.SchemeColor;
  const LOGO = path.join(REPO, "img/logo-512.jpg");

  pres.defineSlideMaster({ title: "OSCURO", background: { color: C.text1 }, objects: [],
    slideNumber: { x: 9.3, y: 5.2, w: 0.5, h: 0.3, color: C.accent6, fontSize: 10 } });
  pres.defineSlideMaster({ title: "CONTENIDO", background: { color: C.background1 },
    objects: [
      { image: { path: LOGO, x: 9.22, y: 0.3, w: 0.48, h: 0.48 } },
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.42, w: 8.5, h: 0.55, fontSize: 24, bold: true, color: C.text1, margin: 0, valign: "middle", align: "left" }, text: "" } },
      { placeholder: { options: { name: "eyebrow", type: "body", x: 0.5, y: 0.18, w: 6, h: 0.26, fontSize: 11, bold: true, color: C.accent1, margin: 0, charSpacing: 2, align: "left" }, text: "" } },
    ],
    slideNumber: { x: 9.3, y: 5.22, w: 0.5, h: 0.3, color: C.accent6, fontSize: 10 } });

  const sec = (t) => pres.addSection({ title: t });
  const card = (s, x, y, w, h, fill = C.background2, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, objectName: name || "tarjeta" });
  const txt = (s, t, o) => s.addText(t, { isTextBox: true, margin: 0, fontSize: 14, color: C.text1, valign: "top", ...o });
  const num = (s, n, x, y, d = 0.42, fill = C.accent1, color = C.background1) => { s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "numero " + n }); txt(s, String(n), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize: 14, color }); };

  /* 1 · Portada */
  sec("1. Introducción y cliente");
  let s = pres.addSlide({ masterName: "OSCURO", sectionTitle: "1. Introducción y cliente" });
  s.addImage({ path: LOGO, x: 0.5, y: 0.65, w: 3.6, h: 3.6, objectName: "logo" });
  txt(s, "SUSTENTACIÓN FINAL · INGENIERÍA DE SOFTWARE III", { x: 4.5, y: 0.75, w: 5.1, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 });
  txt(s, "Cada repuesto facturado, despachado y entregado sin perderle el rastro", { x: 4.5, y: 1.1, w: 5.1, h: 1.7, fontSize: 28, bold: true, color: C.background1, fontFace: "Arial" });
  txt(s, "Sistema de gestión comercial para Motorepuestos del Oriente · Rionegro, Antioquia", { x: 4.5, y: 2.85, w: 5.1, h: 0.5, fontSize: 14, color: C.accent6 });
  txt(s, "Stiven Marulanda · Maycol Slon Buitrago · Santiago Buitrago · Andrés Bustamante · Maycol Acevedo · Julián Bedoya · Maycol Gómez", { x: 4.5, y: 3.55, w: 5.1, h: 0.7, fontSize: 12, color: C.background1 });
  txt(s, "Docente: Walter Rentería · Corporación Universitaria Remington · Noviembre de 2026", { x: 4.5, y: 4.4, w: 5.1, h: 0.4, fontSize: 11, color: C.accent6 });
  s.addNotes("BLOQUE 1 · Introducción y cliente (2 min en total, diapositivas 1 a 3). Presenta: Líder. Saludo, nombres del equipo y una frase: construimos un sistema web que evita el fraude en despachos y controla la facturación de un mayorista de repuestos de motos.");

  /* 2 · El problema */
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "1. Introducción y cliente" });
  s.addText("EL CLIENTE", { placeholder: "eyebrow" });
  s.addText("Facturas a mano y despachos incompletos", { placeholder: "title" });
  const probs = [["Facturas manuales", "Número, fecha, valor y cupo escritos sin control"], ["Fraude en despachos", "Al cliente le llegan repuestos de más o de menos"], ["Malas indicaciones de envío", "Direcciones y contactos incompletos"], ["Sin garantía verificable", "Necesitan certificados y facturación electrónica"]];
  probs.forEach((p, i) => { const x = 0.5 + (i % 2) * 2.95, y = 1.15 + Math.floor(i / 2) * 1.55; card(s, x, y, 2.75, 1.35, C.background2, "problema " + (i + 1)); num(s, i + 1, x + 0.2, y + 0.2); txt(s, p[0], { x: x + 0.75, y: y + 0.22, w: 1.85, h: 0.4, bold: true, fontSize: 15 }); txt(s, p[1], { x: x + 0.2, y: y + 0.72, w: 2.4, h: 0.55, fontSize: 12, color: C.accent5 }); });
  card(s, 6.55, 1.15, 2.95, 2.9, C.text1, "tarjeta B");
  txt(s, "NUESTRA TARJETA B", { x: 6.8, y: 1.32, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 });
  txt(s, [{ text: "B1  ", options: { bold: true, color: C.accent1 } }, { text: "Proceso ISO 9000", options: { breakLine: true } },
          { text: "B2  ", options: { bold: true, color: C.accent1 } }, { text: "Facturas manuales autorizadas por gerentes", options: { breakLine: true } },
          { text: "B3  ", options: { bold: true, color: C.accent1 } }, { text: "Listas país → estado → ciudad", options: { breakLine: true } },
          { text: "B4  ", options: { bold: true, color: C.accent1 } }, { text: "Ley de discapacidad" }], { x: 6.8, y: 1.7, w: 2.55, h: 2.2, fontSize: 13, color: C.background1, paraSpaceAfter: 6 });
  txt(s, "La frase «facturas manuales no asociadas a pedidos» reveló un módulo de pedidos que no estaba en el diseño inicial.", { x: 0.5, y: 4.4, w: 9, h: 0.6, fontSize: 13, italic: true, color: C.accent5 });
  s.addNotes("Presenta: Rol 5 (Requisitos). Contar los 4 problemas de la entrevista y los 4 puntos de la tarjeta B. Remarcar el hallazgo: 'no asociadas a pedidos' implicaba crear pedidos de venta. Ese cambio a mitad de camino justifica Scrum.");

  /* 3 · Requisitos (tarjeta del cliente) */
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "1. Introducción y cliente" });
  s.addText("REQUISITOS", { placeholder: "eyebrow" });
  s.addText("10 requisitos clasificados por tipo", { placeholder: "title" });
  const grupos = [["Funcionales", C.accent1, ["Correos por pedido, factura, despacho y pago", "Facturas manuales con autorización", "Listas filtradas de estado y ciudad", "Conteo ciego contra el fraude", "Instrucciones de envío completas"]],
    ["No funcionales", C.accent2, ["Rendimiento: 100.000 usuarios", "Usabilidad: diseño responsive", "Fiabilidad: ≥ 99,5 % disponible"]],
    ["Restricciones", C.accent5, ["Proceso: ISO 9000", "Legal: ley de discapacidad"]]];
  grupos.forEach((g, i) => { const x = 0.5 + i * 3.05; card(s, x, 1.15, 2.85, 3.85, C.background2, g[0]);
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.33, w: 0.32, h: 0.32, fill: { color: g[1] }, line: { color: g[1] }, objectName: "marca " + g[0] });
    txt(s, `${g[0]} (${g[2].length})`, { x: x + 0.65, y: 1.3, w: 2.1, h: 0.4, bold: true, fontSize: 16 });
    txt(s, g[2].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < g[2].length - 1 } })), { x: x + 0.2, y: 1.85, w: 2.5, h: 3.0, fontSize: 13, paraSpaceAfter: 8, color: C.text1 }); });
  s.addNotes("BLOQUE 1 (cierre). Presenta: Rol 5. Explicar la diferencia: funcional = qué hace; no funcional = qué tan bien; restricción = condición externa (norma o ley). Los 8 de las tarjetas A y B más 2 de la entrevista.");

  /* 4 · Diagrama de clases */
  sec("2. Arquitectura y ágil");
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "2. Arquitectura y ágil" });
  s.addText("ANÁLISIS ORIENTADO A OBJETOS", { placeholder: "eyebrow" });
  s.addText("Las reglas de negocio viven en las clases", { placeholder: "title" });
  s.addImage({ path: path.join(REPO, "docs/actividad4/diagrama-clases.png"), x: 0.5, y: 1.05, w: 3.45, h: 4.2, sizing: { type: "contain", w: 3.45, h: 4.2 }, objectName: "diagrama de clases", altText: "Diagrama de clases con Usuario, Rol, Pais, Departamento, Ciudad, Cliente, Producto, PedidoVenta, Factura, LineaDetalle, AsientoContable, Remision y Notificacion" });
  const reglas = [["Factura.autorizar(gerente)", "Solo un gerente distinto de quien la registró; luego contabilizar() crea el asiento (B2)"], ["PedidoVenta.facturar()", "La factura de un pedido se contabiliza sola, sin esperar autorización"], ["Pais ◆ Departamento ◆ Ciudad", "Composición: solo se ofrecen destinos registrados (B3)"], ["Remision.verificarConteo()", "Si el conteo ciego no coincide, no sale de bodega"]];
  reglas.forEach((r, i) => { const y = 1.1 + i * 1.02; card(s, 4.3, y, 5.2, 0.88, C.background2, "regla " + (i + 1)); txt(s, r[0], { x: 4.5, y: y + 0.1, w: 4.8, h: 0.32, bold: true, fontSize: 14, fontFace: "Courier New", color: C.accent1 }); txt(s, r[1], { x: 4.5, y: y + 0.45, w: 4.8, h: 0.4, fontSize: 12, color: C.accent5 }); });
  s.addNotes("BLOQUE 2 · Arquitectura y ágil (3 min, diapositivas 4 a 6). Presenta: Rol 6 (Arquitectura). Del requisito a la clase: los sustantivos (factura, pedido, ciudad, gerente) se volvieron clases. Señalar en el diagrama la composición País-Departamento-Ciudad y explicar autorizar() antes de contabilizar().");

  /* 5 · Scrum y backlog */
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "2. Arquitectura y ágil" });
  s.addText("METODOLOGÍA · TRELLO", { placeholder: "eyebrow" });
  s.addText("Backlog gestionado en Trello con Scrum", { placeholder: "title" });
  const cols = [["Product Backlog", "6", "HU-24, HU-25 y backend"], ["Sprint Backlog", "0", "sprint cerrado"], ["En Desarrollo", "1", "demo para el cliente"], ["En Pruebas (QA)", "0", ""], ["Completado", "26", "24 historias + pruebas"]];
  cols.forEach((c, i) => { const x = 0.5 + i * 1.835, dark = i === 4; card(s, x, 1.05, 1.66, 1.2, dark ? C.text1 : C.background2, "columna " + c[0]);
    txt(s, c[0], { x: x + 0.12, y: 1.13, w: 1.45, h: 0.28, fontSize: 11, bold: true, color: dark ? C.accent2 : C.accent5 });
    txt(s, c[1], { x: x + 0.12, y: 1.4, w: 1.45, h: 0.5, fontSize: 28, bold: true, color: dark ? C.background1 : C.accent1, fontFace: "Arial" });
    txt(s, c[2], { x: x + 0.12, y: 1.9, w: 1.45, h: 0.3, fontSize: 10, color: dark ? C.accent6 : C.accent5 }); });
  const spr = [["Sprint 1", "Facturas manuales, autorización, listas y accesibilidad", "B2 · B3 · B4"], ["Sprint 2", "Pedidos, correos, remisiones y conteo ciego", "A1 · fraude"], ["Sprint 3", "Inventario, importaciones y trazabilidad", "Control"], ["Sprint 4", "Estadísticas, carga y disponibilidad", "A2 · A4"]];
  spr.forEach((p, i) => { const x = 0.5 + i * 2.3; card(s, x, 2.5, 2.15, 1.65, i === 0 ? C.text1 : C.background2, p[0]);
    txt(s, p[0], { x: x + 0.18, y: 2.63, w: 1.8, h: 0.35, bold: true, fontSize: 15, color: i === 0 ? C.accent2 : C.text1 });
    txt(s, p[1], { x: x + 0.18, y: 3.0, w: 1.85, h: 0.75, fontSize: 12, color: i === 0 ? C.background1 : C.accent5 });
    txt(s, p[2], { x: x + 0.18, y: 3.78, w: 1.8, h: 0.3, fontSize: 11, bold: true, color: C.accent1 }); });
  txt(s, "¿Por qué no cascada? Los requisitos cambiaron a mitad del proyecto: en cascada habría que rehacer análisis y diseño; en Scrum el cambio entra al siguiente sprint.", { x: 0.5, y: 4.35, w: 9, h: 0.65, fontSize: 13, italic: true, color: C.accent5 });
  s.addNotes("Presenta: Líder (Scrum Master). Cómo gestionamos el backlog: 26 historias Como/Quiero/Para, priorizadas con MoSCoW en 4 sprints, primero la tarjeta del cliente. Estado real: 24 de 26 entregadas; HU-24 y HU-25 siguen en el backlog porque requieren servidor. Si hay tiempo, abrir https://trello.com/b/kugvbCDl/motorepuestos-del-oriente-scrum y mostrar una tarjeta con su checklist Frontend/Backend/BD/Pruebas. Por qué Scrum y no cascada: la frase de abajo.");

  /* 6 · Arquitectura */
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "2. Arquitectura y ágil" });
  s.addText("ARQUITECTURA", { placeholder: "eyebrow" });
  s.addText("27 módulos en capas, listos para un servidor", { placeholder: "title" });
  s.addImage({ path: path.join(REPO, "docs/final/img/arquitectura.png"), x: 0.5, y: 1.05, w: 5.4, h: 3.95, sizing: { type: "contain", w: 5.4, h: 3.95 }, objectName: "diagrama de arquitectura", altText: "Arquitectura en capas: presentación, control, dominio, datos y núcleo; en producción API REST con PostgreSQL" });
  const tec = [["Frontend", "HTML5, CSS3 y JavaScript sin frameworks"], ["Backend", "Capa de dominio hoy · Node.js + Express en producción"], ["Base de datos", "PostgreSQL: 29 tablas y 5 triggers"], ["Calidad", "node:test, Playwright y axe-core"]];
  tec.forEach((t, i) => { const y = 1.1 + i * 0.98; card(s, 6.15, y, 3.35, 0.85, C.background2, t[0]); txt(s, t[0], { x: 6.32, y: y + 0.1, w: 3.0, h: 0.3, bold: true, fontSize: 14, color: C.accent1 }); txt(s, t[1], { x: 6.32, y: y + 0.42, w: 3.05, h: 0.4, fontSize: 12, color: C.text1 }); });
  s.addNotes("Presenta: Rol 6. Capas con dependencias en un solo sentido (MVC). Para pasar a producción solo se reemplaza el módulo de persistencia por llamadas a la API; las vistas no cambian.");

  /* 7 · Demo */
  sec("3. Demo de la aplicación");
  s = pres.addSlide({ masterName: "OSCURO", sectionTitle: "3. Demo de la aplicación" });
  txt(s, "DEMOSTRACIÓN EN VIVO · 5 MINUTOS", { x: 0.5, y: 0.4, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 });
  txt(s, "Del pedido a la entrega, en vivo", { x: 0.5, y: 0.72, w: 6.2, h: 0.55, fontSize: 26, bold: true, color: C.background1 });
  const demo = [["Camila · Logística", "Factura un pedido; en la factura manual, listas por país y cupo"], ["Andrés · Gerente", "Autoriza: CUFE, asiento contable, certificados y correo"], ["Julián · Despachos", "Conteo ciego errado abre novedad; correcto sella y despacha"], ["Mateo · Auditor", "Rastrea la factura y detecta una alteración de la bitácora"], ["Accesibilidad", "Texto al 130 %, alto contraste y versión en celular"]];
  demo.forEach((d, i) => { const y = 1.5 + i * 0.72; num(s, i + 1, 0.5, y + 0.05, 0.42, C.accent1, C.background1); txt(s, d[0], { x: 1.1, y, w: 5.4, h: 0.3, bold: true, fontSize: 14, color: C.background1 }); txt(s, d[1], { x: 1.1, y: y + 0.3, w: 5.5, h: 0.35, fontSize: 12, color: C.accent6 }); });
  card(s, 7.05, 0.75, 2.45, 3.4, C.background1, "QR");
  s.addImage({ data: qr, x: 7.25, y: 0.95, w: 2.05, h: 2.05, objectName: "código QR de la aplicación", altText: "Código QR con el enlace de la aplicación" });
  txt(s, "Ábrela en tu celular", { x: 7.2, y: 3.1, w: 2.15, h: 0.3, fontSize: 13, bold: true, align: "center", color: C.text1 });
  txt(s, "Contraseña: demo2026", { x: 7.2, y: 3.42, w: 2.15, h: 0.3, fontSize: 12, align: "center", color: C.accent5 });
  txt(s, "slonbuitrago-bit.github.io/motorepuestos-oriente", { x: 6.85, y: 4.3, w: 2.85, h: 0.5, fontSize: 11, align: "center", color: C.accent6 });
  s.addNotes("BLOQUE 3 · Demo (5 min). Presentan: Roles 2, 3 y 4. Antes de empezar: Administración → Datos y respaldo → Restablecer datos de ejemplo. En la app, botón 'Guía': cada paso tiene un botón 'Ir' que cambia de usuario y abre la pantalla. Plan B sin internet: dist/motorepuestos-oriente.html.");

  /* 8 · QA */
  sec("4. Auditoría de QA");
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "4. Auditoría de QA" });
  s.addText("CONTROL DE CALIDAD", { placeholder: "eyebrow" });
  s.addText("66 pruebas por niveles del Modelo en V", { placeholder: "title" });
  s.addImage({ path: path.join(REPO, "docs/final/img/modelo-v.png"), x: 0.5, y: 1.05, w: 9, h: 1.2, sizing: { type: "contain", w: 9, h: 1.2 }, objectName: "Modelo en V", altText: "Modelo en V: requisitos con pruebas de aceptación, diseño funcional con sistema, diseño técnico con integración y componentes con unitarias" });
  const q = [["17", "unitarias", "funciones aisladas"], ["10", "integración", "bottom-up"], ["23", "sistema", "extremo a extremo"], ["16", "complementarias", "OWASP, carga, responsive…"]];
  q.forEach((t, i) => { const x = 0.5 + i * 2.3; card(s, x, 2.45, 2.15, 1.3, C.background2, "nivel " + t[1]); txt(s, t[0], { x: x + 0.18, y: 2.55, w: 1.8, h: 0.6, fontSize: 32, bold: true, color: C.accent1, fontFace: "Arial" }); txt(s, t[1], { x: x + 0.18, y: 3.12, w: 1.85, h: 0.28, fontSize: 13, bold: true }); txt(s, t[2], { x: x + 0.18, y: 3.4, w: 1.85, h: 0.28, fontSize: 11, color: C.accent5 }); });
  card(s, 0.5, 3.95, 9, 1.05, C.text1, "OWASP");
  txt(s, "OWASP", { x: 0.75, y: 4.05, w: 1.5, h: 0.85, fontSize: 26, bold: true, color: C.accent2, fontFace: "Arial", valign: "middle" });
  txt(s, "A01 control de acceso · A03 inyección y XSS · A07 autenticación · A08 integridad de datos: todas pasan. Además: robustez, carga (5.000 facturas en < 1 s), responsive y accesibilidad (0 violaciones). Resultado: 66 de 66.", { x: 2.25, y: 4.08, w: 7.05, h: 0.85, fontSize: 13, color: C.background1, valign: "middle" });
  s.addNotes("BLOQUE 4 · Auditoría de QA (3 min). Presenta: Rol 7 (Calidad). Explicar verificación (rama izquierda) y validación (rama derecha). Unitarias = funciones aisladas; integración = bottom-up (datos → dominio → contabilidad → correo); OWASP con ejemplos concretos.");

  /* 9 · Bugs de las pruebas cruzadas */
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "4. Auditoría de QA" });
  s.addText("PRUEBAS CRUZADAS", { placeholder: "eyebrow" });
  s.addText("Bugs detectados y cómo se resolvieron", { placeholder: "title" });
  card(s, 0.5, 1.1, 4.35, 3.9, C.background2, "bugs del grupo auditor");
  txt(s, "Reportados por el grupo auditor", { x: 0.72, y: 1.27, w: 3.95, h: 0.35, bold: true, fontSize: 15 });
  ["AUD-01", "AUD-02", "AUD-03"].forEach((id, k) => { const y = 1.8 + k * 0.9; card(s, 0.72, y, 3.91, 0.75, C.background1, id);
    txt(s, id, { x: 0.88, y: y + 0.1, w: 1.0, h: 0.28, fontSize: 12, bold: true, color: C.accent1 });
    txt(s, "Pendiente: se registra en la auditoría cruzada", { x: 0.88, y: y + 0.38, w: 3.6, h: 0.3, fontSize: 12, italic: true, color: C.accent6 }); });
  card(s, 5.15, 1.1, 4.35, 3.9, C.text1, "bugs propios");
  txt(s, "Encontrados por nuestras pruebas", { x: 5.37, y: 1.27, w: 3.95, h: 0.35, bold: true, fontSize: 15, color: C.background1 });
  txt(s, "10 de 10 corregidos", { x: 5.37, y: 1.6, w: 3.95, h: 0.3, fontSize: 12, bold: true, color: C.accent2 });
  const propios = ["Cantidad decimal aceptada y truncada · robustez", "Desborde en celulares de 360 px · regresión", "Contraste insuficiente · auditoría WCAG", "Regla de negocio en la capa de vista · revisión estática", "Consecutivos de factura fuera de orden · sistema"];
  propios.forEach((t, k) => { const y = 2.05 + k * 0.56; s.addShape(pres.shapes.OVAL, { x: 5.37, y: y + 0.04, w: 0.26, h: 0.26, fill: { color: C.accent4 }, line: { color: C.accent4 }, objectName: "corregido " + (k + 1) }); txt(s, "✓", { x: 5.37, y: y + 0.04, w: 0.26, h: 0.26, align: "center", valign: "middle", fontSize: 10, bold: true, color: C.background1 }); txt(s, t, { x: 5.75, y, w: 3.6, h: 0.45, fontSize: 12, color: C.background1 }); });
  s.addNotes("Presenta: Rol 7. Primero los bugs que reportó el grupo auditor en la Actividad 5 (la auditoría ocurre en la sustentación; si ya hay reporte, se cuentan aquí) y qué se hizo con cada uno. Luego los encontrados por nuestras pruebas: el más didáctico es la regresión, porque un botón que agregamos para la demo rompió el diseño en celulares de 360 px y la prueba automática lo detectó. Ya hay ingreso con contraseña y bloqueo por intentos; limitación honesta: se valida en el navegador; en producción, bcrypt + JWT en el servidor.");

  /* 10 · Conclusiones */
  sec("5. Conclusiones");
  s = pres.addSlide({ masterName: "OSCURO", sectionTitle: "5. Conclusiones" });
  s.addImage({ path: LOGO, x: 7.2, y: 0.5, w: 2.3, h: 2.3, objectName: "logo" });
  txt(s, "CONCLUSIONES", { x: 0.5, y: 0.5, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 });
  txt(s, "Los requisitos dijeron qué construir; las pruebas confirmaron que quedó bien construido", { x: 0.5, y: 0.85, w: 6.4, h: 1.3, fontSize: 26, bold: true, color: C.background1 });
  const conc = ["Una sola frase del cliente cambió el alcance: preguntar bien evita rehacer", "Scrum absorbió ese cambio sin tirar lo construido", "Las pruebas encontraron 10 defectos que la revisión visual no vio", "Siete personas, roles claros y una sola versión oficial en GitHub"];
  txt(s, conc.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < conc.length - 1 } })), { x: 0.5, y: 2.3, w: 6.4, h: 2.0, fontSize: 14, color: C.background1, paraSpaceAfter: 8 });
  txt(s, "App: slonbuitrago-bit.github.io/motorepuestos-oriente · Código: github.com/slonbuitrago-bit/motorepuestos-oriente", { x: 0.5, y: 4.55, w: 8.4, h: 0.4, fontSize: 11, color: C.accent6 });
  txt(s, "¡Gracias! · Preguntas", { x: 7.0, y: 3.0, w: 2.7, h: 0.5, fontSize: 18, bold: true, align: "center", color: C.accent1 });
  s.addNotes("BLOQUE 5 · Conclusiones (2 min). Presenta: Líder. Reflexión: el impacto de la ingeniería de requisitos y del testing en el éxito del software. Luego, ronda de preguntas (5 min): tener a mano el informe técnico y el registro de defectos.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("ok", OUT);
})();
