// Genera el Informe Técnico Final en Word con normas APA 7.
// Uso: node docs/final/generar-informe.js [paginas.json]
// La tabla de contenido se numera en dos pasadas: la primera genera el documento,
// se convierte a PDF para leer en qué página queda cada título y la segunda escribe los números.
const fs = require("fs"), path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, ImageRun, PageBreak,
  LevelFormat, Header, PageNumber, BorderStyle, TabStopType, LeaderType, HeadingLevel, VerticalAlign } = D;

const ROOT = path.join(__dirname, "..", "..");
const rd = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const img = f => fs.readFileSync(path.join(ROOT, f));
const PAG = process.argv[2] && fs.existsSync(process.argv[2]) ? JSON.parse(fs.readFileSync(process.argv[2], "utf8")) : {};
const OUT = path.join(__dirname, "Informe-Tecnico-Final-Motorepuestos-del-Oriente.docx");

const FONT = "Times New Roman";
const APP = "https://slonbuitrago-bit.github.io/motorepuestos-oriente/";
const REPO = "https://github.com/slonbuitrago-bit/motorepuestos-oriente";
const TRELLO = "https://trello.com/b/kugvbCDl/motorepuestos-del-oriente-scrum";

/* ---------- utilidades de formato APA ---------- */
function runs(t, o = {}){
  const out = []; const re = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g; let last = 0, m;
  while ((m = re.exec(t))){
    if (m.index > last) out.push(new TextRun({ text: t.slice(last, m.index), font: FONT, ...o }));
    const s = m[0];
    if (s.startsWith("**")) out.push(new TextRun({ text: s.slice(2, -2), bold: true, font: FONT, ...o }));
    else if (s.startsWith("_")) out.push(new TextRun({ text: s.slice(1, -1), italics: true, font: FONT, ...o }));
    else out.push(new TextRun({ text: s.slice(1, -1), font: "Courier New", ...o, size: (o.size || 24) - 2 }));
    last = m.index + s.length;
  }
  if (last < t.length) out.push(new TextRun({ text: t.slice(last), font: FONT, ...o }));
  return out;
}
const DOBLE = { line: 480, lineRule: D.LineRuleType.AUTO, before: 0, after: 0 };
const P = t => new Paragraph({ children: runs(t), spacing: DOBLE, indent: { firstLine: 720 } });
const Pc = (t, o = {}) => new Paragraph({ children: runs(t, o), spacing: DOBLE, alignment: AlignmentType.CENTER });
const B = t => new Paragraph({ children: runs(t), numbering: { reference: "vinetas", level: 0 }, spacing: DOBLE });
const N = (t, ref) => new Paragraph({ children: runs(t), numbering: { reference: ref, level: 0 }, spacing: DOBLE });
const salto = () => new Paragraph({ children: [new PageBreak()] });
const vacio = () => new Paragraph({ children: [], spacing: DOBLE });
const TITULOS = [];
// Cada título lleva un marcador; la tabla de contenido apunta a él con un campo PAGEREF,
// así Word recalcula el número de página real cuando se actualizan los campos.
const marca = texto => { const id = "_Toc" + String(TITULOS.length).padStart(4, "0"); return { id, run: new D.Bookmark({ id, children: [new TextRun({ text: texto, bold: true, font: FONT, size: 24 })] }) }; };
function H1(num, t, nueva = true){ const m = marca(`${num}\t${t}`); TITULOS.push({ n: 1, t: `${num}\t${t}`, k: `${num} ${t}`, id: m.id }); return new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: nueva, keepNext: true, spacing: DOBLE, tabStops: [{ type: TabStopType.LEFT, position: 720 }], children: [m.run] }); }
function H2(num, t){ const m = marca(`${num}\t${t}`); TITULOS.push({ n: 2, t: `${num}\t${t}`, k: `${num} ${t}`, id: m.id }); return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, spacing: DOBLE, tabStops: [{ type: TabStopType.LEFT, position: 720 }], children: [m.run] }); }
function H0(t){ const m = marca(t); TITULOS.push({ n: 0, t, k: t, id: m.id }); return new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true, spacing: DOBLE, alignment: AlignmentType.CENTER, children: [m.run] }); }

let nTabla = 0, nFig = 0;
const W = 9360, borde = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
function tabla(titulo, filas, anchos, nota, tam = 20){
  nTabla++;
  const sum = anchos.reduce((a, b) => a + b, 0); const w = anchos.map(x => Math.round(x / sum * W)); w[w.length - 1] += W - w.reduce((a, b) => a + b, 0);
  const t = new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows: filas.map((f, i) => new TableRow({ tableHeader: i === 0, cantSplit: true, children: f.map((c, j) => new TableCell({
    width: { size: w[j], type: WidthType.DXA }, borders: { top: borde, bottom: borde, left: borde, right: borde }, verticalAlign: VerticalAlign.TOP,
    shading: i === 0 ? { type: ShadingType.CLEAR, fill: "E7E6E6", color: "auto" } : undefined, margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [new Paragraph({ spacing: { line: 240, before: 0, after: 0 }, children: runs(String(c), { size: tam, bold: i === 0 ? true : undefined }) })] })) })) });
  const out = [
    new Paragraph({ keepNext: true, spacing: { line: 480, before: 240, after: 0 }, children: [new TextRun({ text: `Tabla ${nTabla}`, bold: true, font: FONT, size: 24 })] }),
    new Paragraph({ keepNext: true, spacing: { line: 480, after: 0 }, children: [new TextRun({ text: titulo, italics: true, font: FONT, size: 24 })] }),
    t ];
  if (nota) out.push(new Paragraph({ spacing: { line: 480, before: 60, after: 240 }, children: [new TextRun({ text: "Nota. ", italics: true, font: FONT, size: 22 }), ...runs(nota, { size: 22 })] }));
  else out.push(new Paragraph({ spacing: { after: 240 }, children: [] }));
  return out;
}
function figura(titulo, archivo, anchoPx, nota){
  nFig++;
  const buf = img(archivo);
  const dim = pngSize(buf, archivo); const ancho = Math.min(anchoPx, 600); const alto = Math.round(ancho * dim.h / dim.w);
  const out = [
    new Paragraph({ keepNext: true, spacing: { line: 480, before: 240, after: 0 }, children: [new TextRun({ text: `Figura ${nFig}`, bold: true, font: FONT, size: 24 })] }),
    new Paragraph({ keepNext: true, spacing: { line: 480, after: 0 }, children: [new TextRun({ text: titulo, italics: true, font: FONT, size: 24 })] }),
    new Paragraph({ keepNext: !!nota, alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60, line: 240, lineRule: D.LineRuleType.AUTO }, children: [new ImageRun({ ...imagenDatos(archivo, buf), transformation: { width: ancho, height: alto }, altText: { title: titulo, description: titulo, name: path.basename(archivo) } })] }) ];
  if (nota) out.push(new Paragraph({ spacing: { line: 480, before: 0, after: 240 }, children: [new TextRun({ text: "Nota. ", italics: true, font: FONT, size: 22 }), ...runs(nota, { size: 22 })] }));
  return out;
}
// Los diagramas se incrustan como SVG (vectorial, nítido a cualquier tamaño y al exportar a PDF)
// con un PNG de respaldo para programas que no leen SVG.
function imagenDatos(archivo, buf){
  const svg = path.join(ROOT, archivo.replace(/\.png$/, ".svg"));
  if (archivo.endsWith(".png") && fs.existsSync(svg)) return { type: "svg", data: fs.readFileSync(svg), fallback: { type: "png", data: buf } };
  return { type: archivo.endsWith(".jpg") ? "jpg" : "png", data: buf };
}
// Figura con varias capturas apiladas (tablero de Trello en dos partes)
function figuraVarias(titulo, archivos, anchoPx, nota){
  nFig++;
  const out = [
    new Paragraph({ keepNext: true, spacing: { line: 480, before: 240, after: 0 }, children: [new TextRun({ text: `Figura ${nFig}`, bold: true, font: FONT, size: 24 })] }),
    new Paragraph({ keepNext: true, spacing: { line: 480, after: 0 }, children: [new TextRun({ text: titulo, italics: true, font: FONT, size: 24 })] }) ];
  archivos.forEach((a, i) => { const buf = img(a), dim = pngSize(buf, a), alto = Math.round(anchoPx * dim.h / dim.w);
    out.push(new Paragraph({ keepNext: i < archivos.length - 1 || !!nota, alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60, line: 240, lineRule: D.LineRuleType.AUTO }, children: [new ImageRun({ type: "png", data: buf, transformation: { width: anchoPx, height: alto }, altText: { title: titulo, description: titulo, name: path.basename(a) } })] })); });
  if (nota) out.push(new Paragraph({ spacing: { line: 480, before: 0, after: 240 }, children: [new TextRun({ text: "Nota. ", italics: true, font: FONT, size: 22 }), ...runs(nota, { size: 22 })] }));
  return out;
}
function marcoCaptura(titulo, instruccion){
  nFig++;
  return [
    new Paragraph({ keepNext: true, spacing: { line: 480, before: 240, after: 0 }, children: [new TextRun({ text: `Figura ${nFig}`, bold: true, font: FONT, size: 24 })] }),
    new Paragraph({ keepNext: true, spacing: { line: 480, after: 0 }, children: [new TextRun({ text: titulo, italics: true, font: FONT, size: 24 })] }),
    new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ height: { value: 3600, rule: "atLeast" }, children: [new TableCell({ width: { size: W, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
      borders: { top: { style: BorderStyle.DASHED, size: 8, color: "7F7F7F" }, bottom: { style: BorderStyle.DASHED, size: 8, color: "7F7F7F" }, left: { style: BorderStyle.DASHED, size: 8, color: "7F7F7F" }, right: { style: BorderStyle.DASHED, size: 8, color: "7F7F7F" } },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: instruccion, italics: true, color: "7F7F7F", font: FONT, size: 22 })] })] })] })] }),
    new Paragraph({ spacing: { after: 240 }, children: [] }) ];
}
function pngSize(buf, f){
  if (f.endsWith(".png")) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2; while (i < buf.length){ const m = buf[i + 1], len = buf.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }; i += 2 + len; }
  return { w: 1, h: 1 };
}

/* ---------- datos del proyecto ---------- */
const back = rd("docs/actividad4/2-product-backlog.md");
const filasBack = back.split("\n").filter(l => /^\| HU-\d\d \| Como/.test(l)).map(l => l.trim().slice(1, -1).split("|").map(c => c.trim()));
const hus = filasBack.map(r => { const m = r[1].match(/^Como \*\*(.+?)\*\*, quiero (.+?) para (.+?)\.?$/); return { id: r[0], rol: m[1], quiero: m[2], para: m[3], req: r[2], prio: r[3], pts: r[4], sprint: r[5] }; });
const res = JSON.parse(rd("docs/final/evidencias/resultados.json")).resultados;
const nombreTest = (archivo, pref) => rd(archivo).split("\n").map(l => l.match(/^test\("((?:CU|CI)-\d+) · (.+?)",/)).filter(Boolean).filter(m => m[1].startsWith(pref)).map(m => [m[1], m[2]]);
const unit = nombreTest("tests/unitarias.test.js", "CU"), integ = nombreTest("tests/integracion.test.js", "CI");
const sistema = res.filter(r => r.id.startsWith("CS")), compl = res.filter(r => r.id.startsWith("CC"));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- portada ---------- */
const INTEGRANTES = ["Stiven Marulanda Chica", "Maycol Slon Buitrago", "Santiago Buitrago", "Andrés Bustamante", "Maycol Acevedo", "Julián Bedoya", "Maycol Gómez"];
const portada = [
  ...Array(3).fill(0).map(vacio),
  Pc("**Informe Técnico Final: Sistema de Gestión Comercial Motorepuestos del Oriente**"),
  Pc("**Sustentación integral y demostración del producto**"),
  vacio(), vacio(),
  ...INTEGRANTES.map(n => Pc(n)),
  vacio(), vacio(),
  Pc("Corporación Universitaria Remington"),
  Pc("Ingeniería de Software III"),
  Pc("Docente: Walter Rentería"),
  Pc("Noviembre de 2026"),
];

/* ---------- tabla de contenido (estática, numerada en dos pasadas) ---------- */
function toc(){
  const out = [new Paragraph({ alignment: AlignmentType.CENTER, spacing: DOBLE, children: [new TextRun({ text: "Tabla de contenido", font: FONT, size: 24 })] })];
  for (const t of TITULOS){
    const pg = PAG[t.k] || "";
    out.push(new Paragraph({ spacing: { line: 360, before: 0, after: t.n === 1 || t.n === 0 ? 60 : 0 }, indent: { left: t.n === 2 ? 360 : 0 },
      tabStops: [{ type: TabStopType.LEFT, position: (t.n === 2 ? 1080 : 720) }, { type: TabStopType.RIGHT, position: 9350, leader: LeaderType.DOT }],
      children: [new TextRun({ text: t.t + "\t", font: FONT, size: 24 }), new D.SimpleField(`PAGEREF ${t.id} \\h`, pg)] }));
  }
  return out;
}

/* ---------- cuerpo ---------- */
const cuerpo = [
  H1("1", "Introducción y dominio del problema"),
  P("Este informe es la memoria técnica del sistema web desarrollado durante el curso para **Motorepuestos del Oriente S.A.S.**, un mayorista de repuestos para motos con sede en Rionegro (Antioquia) que vende a almacenes y talleres de otros municipios del Oriente antioqueño. Recorre el ciclo de vida completo del proyecto: el problema del cliente, los requisitos, el modelo orientado a objetos, la planeación ágil, la arquitectura y el control de calidad con pruebas por niveles."),
  P(`El producto se encuentra publicado y en funcionamiento en ${APP} y su código fuente está en ${REPO}.`),
  H2("1.1", "Contexto del negocio"),
  P("En la entrevista inicial el cliente describió cuatro problemas: las facturas se elaboraban a mano en Logística y pasaban a Despachos sin control del número, la fecha, el valor ni el cupo del cliente; se presentaban **fraudes**, porque a los clientes llegaban repuestos de más o de menos respecto al pedido; las **indicaciones de envío** eran incompletas o erróneas; y la empresa necesitaba **certificados** que garantizaran el funcionamiento de los repuestos, junto con facturación electrónica y un flujo de facturas acorde con ISO 9000. La empresa mantiene además un convenio de doce años con un proveedor de la Zona Libre de Colón (Panamá)."),
  P("En la consultoría cruzada (Actividad 2) el equipo actuó como agencia frente al cliente de la **Tarjeta Confidencial B**, cuyos requisitos son: (B1) un procedimiento de desarrollo documentado conforme a ISO 9000; (B2) facturas manuales no asociadas a pedidos que requieren autorización de los gerentes antes de contabilizarse; (B3) listas de preselección de estado y ciudad filtradas por país, con ciudades registradas en su propia funcionalidad; y (B4) cumplimiento de la ley de igualdad para personas con discapacidad. Como ambas tarjetas describen necesidades del mismo negocio, también se incorporaron los requisitos de la **Tarjeta A**: notificaciones por correo, 100.000 usuarios concurrentes, diseño _responsive_ y disponibilidad mínima del 99,5 %."),
  P("El hallazgo más importante del levantamiento fue que la frase «facturas manuales **no asociadas a pedidos**» implicaba la existencia de un módulo de pedidos de venta que no aparecía en el diagrama de casos de uso inicial. Este cambio de alcance, descubierto a mitad del proyecto, es la principal razón para trabajar con una metodología ágil."),
  H2("1.2", "Justificación metodológica"),
  P("Se compararon las metodologías clásicas vistas en clase (cascada, prototipo, espiral, incremental y desarrollo rápido de aplicaciones) con las ágiles (Kanban, Scrum, Lean y XP). El equipo eligió **Scrum, apoyado en un tablero visual tipo Kanban**, con un **Sprint 0** de prototipado evolutivo."),
  ...tabla("Comparación de metodologías para el proyecto", [
    ["Metodología", "Característica principal", "Encaje con este proyecto"],
    ["Cascada", "Fases secuenciales; cada una depende de que termine la anterior", "Bajo: el cambio de alcance (módulo de pedidos) obligaría a rehacer análisis y diseño"],
    ["Prototipo", "Prueba y error con el usuario hasta que queda satisfecho", "Medio: se usó como Sprint 0 para validar requisitos, pero no organiza el trabajo del equipo"],
    ["Espiral", "Ciclos centrados en la gestión de riesgos", "Medio: útil para riesgos altos, pero su documentación es excesiva para un curso"],
    ["Incremental", "Crecimiento progresivo de la funcionalidad", "Alto en la idea de incrementos, pero sin roles ni eventos definidos"],
    ["RAD", "Prototipos rápidos y herramientas CASE", "Medio: entregas rápidas, pero los prototipos pueden no escalar"],
    ["Kanban", "Flujo continuo con límite de trabajo en curso", "Medio: se adoptó su tablero visual; no da fechas de entrega fijas"],
    ["**Scrum (elegida)**", "Sprints con objetivo, roles y revisión con el cliente", "**Alto**: fecha fija, 7 integrantes y validación en cada Sprint Review"],
    ["XP", "Prácticas técnicas: historias de usuario, programación en pareja", "Se adoptaron sus historias de usuario y la revisión de código por pares"],
    ["Lean", "Eliminar actividades que no agregan valor", "Bajo como marco principal; inspira priorizar lo más urgente"],
  ], [1800, 3600, 3960], "Elaboración propia a partir de los contenidos de la Sesión 4 del curso."),
  P("Se descartó **cascada** por tres razones. Primero, los requisitos no se conocieron de una vez: llegaron de la entrevista y luego de la consultoría, que cambió el diseño. Segundo, la regla del 67 % estudiada en clase indica que dos tercios de los errores nacen en el análisis y el diseño; cascada los descubre al final, cuando corregirlos es más costoso, mientras que Scrum los descubre en cada revisión con el cliente. Tercero, el cliente tenía problemas urgentes de fraude y necesitaba ver software funcionando pronto. **Espiral** se descartó porque su peso documental no se justifica en un proyecto de un semestre."),
  P("Frente a **Kanban**, Scrum se ajusta mejor porque el equipo tiene una fecha fija de entrega, siete integrantes que necesitan roles claros (Product Owner, Scrum Master y equipo de desarrollo) y una actividad que exige validar el backlog con el cliente, lo que corresponde a la Sprint Review. Scrum tampoco contradice ISO 9001: la norma exige un proceso definido, documentado y con evidencia, no un modelo secuencial. Ese proceso quedó escrito en el manual de procedimientos del repositorio, y el historial de revisiones de GitHub es la evidencia del control de cambios."),

  H1("2", "Ingeniería de requisitos y análisis orientado a objetos"),
  H2("2.1", "Matriz de requisitos"),
  P("La Tabla 2 clasifica los diez requisitos descubiertos: los ocho de las tarjetas confidenciales y dos que surgieron de la entrevista inicial. Se distinguen requisitos funcionales, no funcionales (de rendimiento, usabilidad y fiabilidad) y restricciones (de proceso y legales)."),
  ...tabla("Matriz de clasificación de los diez requisitos descubiertos", [
    ["ID", "Requisito", "Tipo", "Origen", "Estado en el producto"],
    ["RQ-01", "Enviar un correo al cliente al registrar un pedido de venta, despachar, emitir factura y registrar un pago", "Funcional (notificación)", "Tarjeta A1", "Implementado (bandeja de notificaciones)"],
    ["RQ-02", "Operar con hasta 100.000 usuarios en sesiones concurrentes", "No funcional de rendimiento (capacidad)", "Tarjeta A2", "Diseñado: arquitectura escalable y prueba de carga k6 documentadas"],
    ["RQ-03", "Diseño responsive para computador, tableta y celular", "No funcional de usabilidad y portabilidad", "Tarjeta A3", "Implementado y probado de 360 a 1440 px"],
    ["RQ-04", "Tiempo en falla no mayor al 0,5 % de la operación", "No funcional de fiabilidad (disponibilidad)", "Tarjeta A4", "Diseñado: réplicas, monitoreo y meta de 3,6 h/mes"],
    ["RQ-05", "Procedimiento de desarrollo en manuales, conforme a ISO 9000", "Restricción de proceso", "Tarjeta B1", "Cumplido: manual MP-DS-01 y control de cambios en GitHub"],
    ["RQ-06", "Facturas manuales sin pedido requieren autorización de gerentes antes de contabilizarse", "Funcional (regla de negocio)", "Tarjeta B2", "Implementado"],
    ["RQ-07", "Estado y ciudad en listas filtradas por país; ciudades registradas en su funcionalidad", "Funcional con restricción de integridad", "Tarjeta B3", "Implementado"],
    ["RQ-08", "Cumplir la ley de igualdad para personas con discapacidad", "Restricción legal", "Tarjeta B4", "Implementado: WCAG 2.1 AA, 0 violaciones en axe-core"],
    ["RQ-09", "Controlar que lo despachado coincida con lo facturado", "Funcional (integridad, antifraude)", "Entrevista", "Implementado: conteo ciego y registro de entrega"],
    ["RQ-10", "Registrar instrucciones de envío completas", "Funcional", "Entrevista", "Implementado en la remisión"],
  ], [800, 3000, 1900, 1100, 2560], "B4 se apoya en la Ley 1618 de 2013, la Ley 1346 de 2009 y la Resolución 1519 de 2020 del MinTIC."),
  H2("2.2", "Modelo de dominio (UML)"),
  P("Con el enfoque de análisis y diseño orientado a objetos se extrajeron los sustantivos principales de los requisitos (factura, pedido, cliente, ciudad, gerente, remisión, notificación) y se convirtieron en clases con sus atributos y métodos. La Figura 1 muestra el diagrama de clases del sistema."),
  ...figura("Diagrama de clases del sistema", "docs/actividad4/diagrama-clases.png", 540, "La versión completa, con 24 clases, está en `docs/actividad4/diagrama-clases-completo.png` del repositorio."),
  P("Las interacciones principales que materializan las reglas de negocio son las siguientes:"),
  B("**Regla B2.** Una `Factura` se crea con origen MANUAL y estado PENDIENTE; `validarCupo()` consulta `Cliente.cupoDisponible()`; un `Usuario` con rol Gerente, distinto de quien la registró, ejecuta `autorizar()`, y solo entonces `contabilizar()` genera el `AsientoContable`. Si `PedidoVenta.facturar()` crea la factura, su origen es PEDIDO y se contabiliza de inmediato."),
  B("**Regla B3.** `Pais`, `Departamento` y `Ciudad` forman una composición: la interfaz solo ofrece los departamentos del país elegido y las ciudades registradas de ese departamento."),
  B("**Regla A1.** `PedidoVenta`, `Factura`, `Remision` y el pago disparan una `Notificacion` dirigida al correo del `Cliente`."),
  B("**Control antifraude.** `Remision.verificarConteo()` compara el conteo ciego con las líneas de la factura; si no coincide, la remisión no sale y se registra una `Novedad`."),

  H1("3", "Planeación y ejecución ágil"),
  H2("3.1", "Backlog del producto"),
  P(`Los requisitos se tradujeron en ${hus.length} historias de usuario con la plantilla «Como… quiero… para…», priorizadas con MoSCoW y estimadas en puntos de historia (107 puntos en cuatro sprints de dos semanas). La Tabla 3 presenta las diez historias del primer sprint, que atienden primero la tarjeta del cliente (B2, B3 y B4).`),
  ...tabla("Historias de usuario del Sprint 1", [["ID", "Como…", "Quiero…", "Para…", "Req.", "Pts."], ...hus.filter(h => h.sprint === "1").map(h => [h.id, cap(h.rol), h.quiero, h.para, h.req, h.pts])], [650, 1300, 3300, 2500, 900, 700], "El backlog completo, con criterios de aceptación y definición de terminado, está en `docs/actividad4/2-product-backlog.md`.", 19),
  ...tabla("Distribución del backlog por sprint", [["Sprint", "Objetivo", "Historias", "Puntos"],
    ["1", "Facturas manuales con autorización, destinos válidos, roles y accesibilidad (B2, B3, B4)", "HU-01 a HU-10", "36"],
    ["2", "Pedidos de venta, correos al cliente, remisiones, conteo ciego, entregas y pagos (A1)", "HU-11 a HU-17", "26"],
    ["3", "Inventario, importaciones, certificados y bitácora inalterable", "HU-18 a HU-22", "24"],
    ["4", "Estadísticas, carga de 100.000 usuarios, disponibilidad y auditoría de accesibilidad (A2, A4)", "HU-23 a HU-26", "21"]], [900, 5400, 1700, 1360]),
  H2("3.2", "Evidencia de gestión"),
  P(`La planeación se implementó en un tablero de Trello con la estructura de Scrum que pide la guía de la actividad: **Product Backlog**, **Sprint Backlog**, **En Desarrollo**, **En Pruebas (QA)** y **Completado (Done)**. Cada historia es una tarjeta con su descripción «Como / Quiero / Para», sus criterios de aceptación, etiquetas de prioridad y tipo de trabajo, y una lista de chequeo con las tareas técnicas de Frontend, Backend, Base de datos y Pruebas (37 tareas en el Sprint 1). La Tabla 5 muestra el estado del tablero al cierre: el prototipo entregó 24 de las 26 historias. El tablero público está en ${TRELLO}.`),
  ...figuraVarias("Tablero de Trello del proyecto organizado en Scrum", ["docs/final/img/trello-1.png", "docs/final/img/trello-2.png"], 460, "Arriba: Product Backlog, Sprint Backlog y En Desarrollo. Abajo: En Pruebas (QA) y Completado (Done)."),
  ...tabla("Estado del tablero de gestión al cierre del proyecto", [["Columna", "Contenido"],
    ["Product Backlog", "HU-24 (100.000 usuarios) y HU-25 (disponibilidad del 99,5 %), que requieren un servidor de producción, y 4 tareas de backend (proyecto Node.js, PostgreSQL, conexión y reemplazo de la persistencia)"],
    ["Sprint Backlog", "Vacío: el trabajo planificado se cerró"],
    ["En Desarrollo", "Preparación de la demostración para el cliente (Sprint Review)"],
    ["En Pruebas (QA)", "Vacío"],
    ["Completado (Done)", "24 historias entregadas en el prototipo y verificadas por las pruebas, la tarea de pruebas de aceptación y la Definición de Terminado"]], [2600, 6760], "En las historias completadas se marcaron como hechas las tareas de Frontend y Pruebas; las de Backend y Base de datos quedan pendientes porque corresponden a la versión de producción. La prueba manual con lector de pantalla NVDA también sigue pendiente."),
  P("El control de cambios del código se gestionó en GitHub con una rama principal protegida: los integrantes proponen cambios mediante _pull requests_ o formularios de entrega, y el líder los revisa antes de integrarlos. Este flujo es la evidencia del requisito B1 (ISO 9001, numerales 7.5 y 8.3.6)."),
  H2("3.3", "Ficha de arquitectura técnica"),
  P("El sistema es una aplicación web de una sola página con **arquitectura en capas y separación Modelo-Vista-Controlador**. El código está dividido en 27 módulos JavaScript organizados en capas con dependencias en un solo sentido: la vista nunca modifica datos y los controladores nunca generan HTML (Figura 3)."),
  ...figura("Arquitectura en capas del sistema", "docs/final/img/arquitectura.png", 600, "Las líneas punteadas representan la arquitectura de producción propuesta."),
  ...tabla("Ficha de tecnologías implementadas", [["Componente", "Prototipo entregado", "Producción propuesta"],
    ["Frontend", "HTML5, CSS3 con variables y JavaScript ES2020 sin frameworks; 13 pantallas; accesibilidad WCAG 2.1 AA", "El mismo frontend servido desde una CDN"],
    ["Backend", "Reglas de negocio en la capa de dominio (`js/dominio/reglas-negocio.js`) ejecutadas en el navegador", "API REST en Node.js con Express, autenticación con bcrypt y JWT"],
    ["Base de datos", "Almacenamiento del navegador en JSON, aislado en `js/datos/persistencia.js`", "PostgreSQL 15: 29 tablas, restricciones CHECK y 5 triggers (`docs/modelo-datos.sql`)"],
    ["Seguridad", "Roles y permisos (RBAC), segregación de funciones, bitácora encadenada con SHA-256", "Además: HTTPS, tokens con expiración y bloqueo por intentos fallidos"],
    ["Pruebas", "node:test, Playwright y axe-core (66 pruebas automatizadas)", "Además: k6 para carga y monitoreo de disponibilidad"],
    ["Gestión y despliegue", "Git y GitHub (rama protegida), Trello, GitHub Pages", "Contenedores Docker con autoescalado en dos zonas"]], [1900, 3900, 3560]),
  P("El paso del prototipo a producción no exige reescribir las vistas ni los controladores: basta con reemplazar el módulo de persistencia por llamadas a la API y trasladar la capa de dominio al servidor. Las decisiones de diseño y sus alternativas están documentadas en `docs/arquitectura.md`."),

  H1("4", "Control de calidad y pruebas cruzadas"),
  H2("4.1", "Calidad interna y externa"),
  P("La calidad se evaluó con el modelo ISO/IEC 25010. La **calidad interna** se refiere a las propiedades del código (modularidad, capacidad de prueba, analizabilidad) y se verificó con técnicas estáticas; la **calidad externa** se refiere al comportamiento del software en uso y se validó con técnicas dinámicas. Esta distinción corresponde a la diferencia entre verificación y validación del Modelo en V."),
  ...tabla("Atributos de calidad aplicados (ISO/IEC 25010)", [["Característica", "Tipo", "Evidencia"],
    ["Adecuación funcional", "Externa", "23 pruebas de sistema sobre los requisitos; todas pasan"],
    ["Eficiencia de desempeño", "Externa", "Cada pantalla se dibuja en menos de 8 ms; con 5.000 facturas extra, la lista responde en menos de 1 s"],
    ["Usabilidad y accesibilidad", "Externa", "0 violaciones WCAG 2.1 A/AA en 8 pantallas; texto al 130 %; alto contraste; teclado"],
    ["Fiabilidad", "Externa", "Funciona con el almacenamiento bloqueado; 300 cambios de pantalla sin errores"],
    ["Seguridad", "Externa", "Control de acceso, segregación, XSS neutralizado, integridad SHA-256"],
    ["Portabilidad", "Externa", "Escritorio, iPhone, Android y tableta emulados; 360 a 1440 px"],
    ["Mantenibilidad (modularidad)", "Interna", "27 módulos en 5 capas; reglas de negocio como funciones puras"],
    ["Capacidad de prueba", "Interna", "17 pruebas unitarias aisladas del navegador"]], [2500, 1200, 5660]),
  P("La **verificación estática** consistió en revisar el código antes de probarlo: comprobación de sintaxis de los 27 módulos, revisión de dependencias entre capas y revisión por pares de cada cambio. Esta revisión encontró un defecto de diseño: la regla de negocio del costo nacionalizado de importaciones estaba escrita dentro de la pantalla y no en la capa de dominio, lo que rompía la arquitectura e impedía probarla de forma aislada (DEF-03). Se movió a la capa correcta y quedó cubierta por la prueba unitaria CU-11."),
  H2("4.2", "Informe de auditoría recibido"),
  P("En las pruebas cruzadas (Actividad 5) otro equipo audita la aplicación y entrega un reporte de fallos. Esa auditoría se realiza durante la sustentación, después de esta entrega; por eso la Tabla 8 se presenta como el formato en el que se registrarán los fallos reportados y la respuesta del equipo."),
  ...tabla("Reporte de fallos recibido del grupo auditor", [["ID", "Defecto reportado", "Severidad", "Respuesta del equipo", "Estado"], ["AUD-01", "", "", "", "Pendiente"], ["AUD-02", "", "", "", "Pendiente"], ["AUD-03", "", "", "", "Pendiente"]], [900, 3300, 1200, 2760, 1200], "La auditoría cruzada se realiza en la sesión de sustentación; a la fecha de entrega aún no se ha recibido el reporte."),
  P("Además de esa auditoría externa, el equipo llevó su propio registro de defectos. La Tabla 9 resume los diez defectos reales que encontraron las pruebas, su causa y su corrección; el detalle está en `docs/final/registro-defectos.md`."),
  ...tabla("Defectos encontrados por el equipo y corregidos", [["ID", "Defecto", "Detectado por", "Corrección"],
    ["DEF-01", "Consecutivos de factura fuera de orden cronológico", "Prueba de sistema (revisión)", "Ordenar fechas antes de numerar"],
    ["DEF-02", "Historial de un cliente superaba su cupo", "Integración (CI-10)", "Ajuste de datos de ejemplo"],
    ["DEF-03", "Regla de costeo en la capa de vista", "Verificación estática", "Mover a la capa de dominio"],
    ["DEF-04", "Barra superior desbordada a 360 px", "Responsive y regresión (CC-02)", "Solo iconos en pantallas pequeñas"],
    ["DEF-05", "Formulario de factura desbordado a 360 px", "Responsive (CC-02)", "Contener textos ocultos en las tablas"],
    ["DEF-06", "Cantidad decimal aceptada y truncada", "Robustez (CC-04)", "Validar números enteros"],
    ["DEF-07", "Errores nativos en lugar de mensajes accesibles", "Robustez (CC-04)", "Validación propia del formulario"],
    ["DEF-08", "Contraste insuficiente en el menú", "Accesibilidad axe-core (CC-10)", "Quitar transparencia"],
    ["DEF-09", "Tablas desplazables sin acceso por teclado", "Accesibilidad axe-core (CC-10)", "Hacerlas enfocables"],
    ["DEF-10", "Botones cortados con texto al 130 %", "Revisión de evidencias", "Diseño que se ajusta"]], [900, 3700, 2400, 2360]),
  H2("4.3", "Plan de pruebas ejecutado"),
  P("El plan se organizó según el **Modelo en V** (Figura 4): cada nivel de desarrollo tiene su nivel de prueba correspondiente. Las pruebas de la rama izquierda verifican (¿se construyó bien el producto?) y las de la rama derecha validan (¿se construyó el producto correcto?)."),
  ...figura("Modelo en V aplicado al proyecto", "docs/final/img/modelo-v.png", 600),
  ...tabla("Resumen de ejecución por nivel de prueba", [["Nivel", "Técnica", "Herramienta", "Casos", "Resultado"],
    ["Unitarias (componentes)", "Caja blanca; casos atómicos, independientes y repetibles", "node:test", String(unit.length), `${unit.length} de ${unit.length} pasan`],
    ["Integración", "Incremental bottom-up: datos → dominio → contabilidad → inventario → remisión → correo", "node:test", String(integ.length), `${integ.length} de ${integ.length} pasan`],
    ["Sistema", "Caja negra de extremo a extremo en navegador real", "Playwright (Chromium)", String(sistema.length), `${sistema.filter(x => x.resultado === "PASA").length} de ${sistema.length} pasan`],
    ["Aceptación (UAT)", "Criterios de aceptación de HU-01 a HU-10", "Guion de demostración", "10", "Aprobadas por el equipo; firma del cliente en la sustentación"],
    ["Complementarias", "Smoke, responsive, robustez, OWASP, accesibilidad, rendimiento, carga, estrés, estabilidad, exploratoria, regresión", "Playwright, axe-core", String(compl.length), `${compl.filter(x => x.resultado === "PASA").length} de ${compl.length} pasan`]], [1900, 3300, 1700, 900, 1560], "Ejecución del 15 de noviembre de 2026. Comando: `npm test`."),
  P("**Pruebas unitarias.** Prueban funciones aisladas de la lógica de negocio sin abrir el navegador, como pide la teoría de componentes: cada caso evalúa una sola funcionalidad y separa los caminos de cada condición."),
  ...tabla("Casos de prueba unitarios", [["ID", "Caso", "Resultado"], ...unit.map(u => [u[0], u[1], "Pasa"])], [900, 7200, 1260], null, 19),
  P("**Pruebas de integración.** Siguen la estrategia incremental _bottom-up_: primero se integran los componentes de bajo nivel (datos) y luego los de mayor nivel (dominio, contabilidad, inventario, remisiones y correo), verificando en cada paso la interacción entre módulos."),
  ...tabla("Casos de prueba de integración", [["ID", "Caso", "Resultado"], ...integ.map(u => [u[0], u[1], "Pasa"])], [900, 7200, 1260], null, 19),
  P("**Pruebas de sistema.** Ejercitan la aplicación completa como lo haría un usuario, en un navegador real, comparándola con los requisitos originales."),
  ...tabla("Casos de prueba de sistema", [["ID", "Caso", "Tipo", "Resultado obtenido"], ...sistema.map(r => [r.id, r.nombre, r.tipo, r.detalle])], [800, 3600, 1800, 3160], null, 18),
  P("**Pruebas de aceptación (UAT).** Se basan en los criterios de aceptación de las historias del Sprint 1, redactados para que el cliente los entienda. El equipo las ejecutó con el guion de demostración; la aprobación formal del cliente se registra en la sustentación."),
  ...tabla("Pruebas de aceptación de usuario", [["Historia", "Criterio de aceptación", "Prueba que lo evidencia", "Resultado"],
    ["HU-01", "Con clave correcta ve solo el menú de su rol; con clave incorrecta no entra", "CS-01, CS-02", "Aprobado"],
    ["HU-02", "El administrador crea usuarios y asigna roles; un usuario desactivado no ingresa", "CC-07, demostración", "Aprobado"],
    ["HU-03", "Una ciudad registrada aparece en las listas; no se repiten códigos", "CS-04, demostración", "Aprobado"],
    ["HU-04", "Al cambiar de país solo aparecen sus departamentos; no hay ciudad libre", "CS-04", "Aprobado"],
    ["HU-05", "La factura manual queda pendiente y sin asiento contable", "CS-07, CI-02", "Aprobado"],
    ["HU-06", "Si el total supera el cupo, no se guarda y se informa cuánto excede", "CS-05", "Aprobado"],
    ["HU-07", "El gerente ve las facturas pendientes con cliente, total, cupo y autor", "CS-08", "Aprobado"],
    ["HU-08", "Al autorizar se genera asiento cuadrado e inventario descontado; el autor no puede autorizar", "CS-08, CS-10, CI-03", "Aprobado"],
    ["HU-09", "El rechazo exige un motivo de al menos 10 caracteres", "CS-09", "Aprobado"],
    ["HU-10", "Texto al 130 %, alto contraste, teclado y Lighthouse/axe sin errores", "CC-10, evidencia 15", "Aprobado"]], [900, 4400, 2300, 1760], null, 19),
  H2("4.4", "Pruebas complementarias"),
  P("Se ejecutaron las pruebas complementarias vistas en la Sesión 5. La **prueba de regresión** consistió en volver a correr toda la suite después de cada corrección; así se detectó que un botón agregado para la demostración había roto el diseño en celulares de 360 px (DEF-04). El **testing exploratorio** se hizo con la misión de «romper el flujo de facturación con acciones inesperadas» en una sesión de 15 minutos."),
  ...tabla("Resultados de las pruebas complementarias", [["ID", "Tipo de prueba", "Caso", "Resultado obtenido"], ...compl.map(r => [r.id, r.tipo, r.nombre, r.detalle])], [800, 2000, 3100, 3460], "En la primera ejecución fallaron CC-02, CC-04 y CC-10; los defectos encontrados (DEF-04 a DEF-09) se corrigieron y la regresión confirmó la corrección.", 18),
  P("En **seguridad** se aplicaron las categorías del OWASP Top 10 pertinentes: control de acceso (A01), inyección y XSS (A03), autenticación (A07) e integridad de datos (A08). El prototipo exige usuario y contraseña (guardada como hash SHA-256) y bloquea la cuenta 5 minutos tras 3 intentos fallidos; se reconoce como limitación que esta validación ocurre en el navegador; en producción la autenticación se hace en el servidor con bcrypt y tokens JWT. La **prueba de estrés** mostró que el almacenamiento del navegador se llena con unas 30.000 facturas (31 MB); la aplicación no se cae y sigue trabajando en memoria, pero confirma la necesidad de la base de datos PostgreSQL para producción."),

  H1("5", "Conclusiones y retos"),
  H2("5.1", "Desviaciones entre los requisitos iniciales y el producto entregado"),
  ...tabla("Análisis de desviaciones", [["Aspecto", "Requisito inicial", "Producto entregado", "Justificación"],
    ["Alcance funcional", "Facturas manuales y despachos (diagrama inicial)", "Se agregaron pedidos de venta, inventario, importaciones, certificados y trazabilidad", "La consultoría reveló el módulo de pedidos; los demás apoyan el control del fraude"],
    ["Facturación electrónica", "Facturación electrónica DIAN", "Estructura de factura y CUFE en ambiente de pruebas", "La transmisión real exige un proveedor tecnológico autorizado"],
    ["Backend y base de datos", "Sistema completo cliente-servidor", "Prototipo funcional en el navegador y modelo PostgreSQL listo", "Validar primero los requisitos (Sprint 0); persistencia aislada para migrar"],
    ["100.000 usuarios (A2) y 99,5 % (A4)", "Medidos en operación", "Arquitectura y pruebas diseñadas, no medidas", "Requieren un servidor de producción"],
    ["Accesibilidad (B4)", "Cumplir la ley", "0 violaciones WCAG 2.1 AA y panel de accesibilidad", "Superó lo pedido gracias a la auditoría automática"]], [1800, 2200, 2700, 2660], null, 19),
  H2("5.2", "Lecciones aprendidas"),
  B("**Ingeniería de requisitos.** Una sola frase de la tarjeta del cliente («no asociadas a pedidos») cambió el alcance del sistema. Hacer las preguntas correctas en el levantamiento evita rehacer trabajo después."),
  B("**Gestión de cambios.** Trabajar por sprints permitió absorber ese cambio sin rehacer lo construido, y la rama protegida de GitHub evitó que cambios sin revisar dañaran la versión oficial."),
  B("**Pruebas.** Las pruebas automatizadas encontraron diez defectos que una revisión visual no había detectado, entre ellos una regresión introducida por el propio equipo. Repetir toda la suite después de cada cambio es lo que da confianza para seguir modificando el código."),
  B("**Trabajo en equipo.** Con siete integrantes, asignar roles con archivos propios y un canal formal de entregas fue más efectivo que coordinar todo por mensajería."),
  B("**Mitigación de defectos.** Corregir la causa raíz, como validar números enteros en todos los formularios y no solo en el que falló, evita que el mismo error reaparezca en otro lugar."),
  P("En conclusión, el proyecto transformó las necesidades ambiguas de un cliente en una solución web funcional, publicada y verificada con 66 pruebas automatizadas. La ingeniería de requisitos definió qué construir y las pruebas por niveles confirmaron que se construyó correctamente: ambas fueron determinantes para el resultado."),

  H1("6", "Anexos"),
  H2("6.1", "Enlaces del proyecto"),
  ...tabla("Enlaces de acceso", [["Recurso", "Enlace"], ["Aplicación en funcionamiento", APP], ["Repositorio de código fuente (GitHub)", REPO], ["Tablero de gestión (Trello)", TRELLO], ["Usuarios de demostración", "Contraseña de todos los usuarios: demo2026"]], [3200, 6160]),
  H2("6.2", "Evidencias de ejecución de pruebas"),
  P("Las siguientes capturas fueron generadas automáticamente por la suite de pruebas de sistema. Los archivos originales, el registro de consola y el reporte en formato JSON están en `docs/final/evidencias/`."),
  ...figura("Validación de cupo: la factura que supera el cupo del cliente no se guarda (CS-05)", "docs/final/evidencias/04-cupo-insuficiente.png", 560),
  ...figura("Asiento contable generado al autorizar una factura manual (CS-08)", "docs/final/evidencias/06-asiento-contable.png", 560),
  ...figura("Segregación de funciones: quien registra la factura no puede autorizarla (CS-10)", "docs/final/evidencias/07-segregacion.png", 560),
  ...figura("Conteo ciego con diferencia: la remisión no sale y se abre una novedad (CS-12)", "docs/final/evidencias/09-conteo-ciego-errado.png", 560),
  ...figura("Detección de una alteración en la bitácora encadenada (CS-15)", "docs/final/evidencias/10-alteracion-detectada.png", 560),
  ...figura("Bandeja de notificaciones por correo al cliente (RQ-01)", "docs/final/evidencias/12-notificaciones.png", 560),
  ...figura("Aplicación en un celular de 360 px de ancho (CC-02)", "docs/final/evidencias/13-movil-360.png", 260),
  ...figura("Código malicioso neutralizado en el listado de clientes (CC-06)", "docs/final/evidencias/14-xss-neutralizado.png", 560),
  ...figura("Panel de accesibilidad con texto al 130 % y alto contraste (CC-10)", "docs/final/evidencias/15-accesibilidad-texto-130-contraste.png", 560),
  H2("6.3", "Registro de consola de la ejecución"),
  ...rd("docs/final/evidencias/log-pruebas.txt").split("\n").filter(l => /^(# (tests|pass|fail)|.*pruebas pasan|Ejecución)/.test(l)).map(l => new Paragraph({ spacing: { line: 240 }, children: [new TextRun({ text: l, font: "Courier New", size: 18 })] })),
  new Paragraph({ spacing: { line: 240, before: 120 }, children: [new TextRun({ text: "El registro completo, línea por línea, está en docs/final/evidencias/log-pruebas.txt.", italics: true, font: FONT, size: 22 })] }),
];

/* ---------- referencias (APA 7) ---------- */
const REFS = [
  "Anderson, D. J. (2010). _Kanban: Successful evolutionary change for your technology business_. Blue Hole Press.",
  "Beck, K., & Andres, C. (2004). _Extreme programming explained: Embrace change_ (2.ª ed.). Addison-Wesley.",
  "Congreso de la República de Colombia. (2009). _Ley 1346 de 2009, por medio de la cual se aprueba la Convención sobre los Derechos de las personas con Discapacidad_. Diario Oficial.",
  "Congreso de la República de Colombia. (2012). _Ley Estatutaria 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales_. Diario Oficial.",
  "Congreso de la República de Colombia. (2013). _Ley Estatutaria 1618 de 2013, por medio de la cual se establecen las disposiciones para garantizar el pleno ejercicio de los derechos de las personas con discapacidad_. Diario Oficial.",
  "Corporación Universitaria Remington. (2026). _Sesión 4: Metodologías de desarrollo de software_ [Material de clase]. Ingeniería de Software III.",
  "Corporación Universitaria Remington. (2026). _Sesión 5: Pruebas de software_ [Material de clase]. Ingeniería de Software III.",
  "Deque Systems. (2024). _axe-core: Accessibility engine for automated web UI testing_ (versión 4.10) [Software]. https://github.com/dequelabs/axe-core",
  "Dirección de Impuestos y Aduanas Nacionales. (2023). _Resolución 000165 de 2023, por la cual se desarrolla el sistema de facturación electrónica_. DIAN.",
  "Institute of Electrical and Electronics Engineers. (1998). _IEEE Std 830-1998: Recommended practice for software requirements specifications_. IEEE.",
  "International Organization for Standardization. (2011). _ISO/IEC 25010:2011. Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models_. ISO.",
  "International Organization for Standardization. (2015). _ISO 9001:2015. Sistemas de gestión de la calidad — Requisitos_. ISO.",
  "Microsoft. (2024). _Playwright: Fast and reliable end-to-end testing for modern web apps_ [Software]. https://playwright.dev",
  "Ministerio de Tecnologías de la Información y las Comunicaciones. (2020). _Resolución 1519 de 2020, por la cual se definen los estándares y directrices para publicar la información_. MinTIC.",
  "OWASP Foundation. (2021). _OWASP Top 10:2021_. https://owasp.org/Top10/",
  "Pressman, R. S., & Maxim, B. R. (2020). _Ingeniería del software: Un enfoque práctico_ (9.ª ed.). McGraw-Hill.",
  "Schwaber, K., & Sutherland, J. (2020). _La Guía de Scrum: La guía definitiva de Scrum: Las reglas del juego_. https://scrumguides.org",
  "Sommerville, I. (2016). _Software engineering_ (10.ª ed.). Pearson.",
  "World Wide Web Consortium. (2018). _Web Content Accessibility Guidelines (WCAG) 2.1_. https://www.w3.org/TR/WCAG21/",
];
const referencias = [H0("Referencias"), ...REFS.map(r => new Paragraph({ spacing: DOBLE, indent: { left: 720, hanging: 720 }, children: runs(r) }))];

/* ---------- ensamblaje ---------- */
const contenido = [...cuerpo, ...referencias];
const doc = new Document({
  features: { updateFields: true },
  creator: "Equipo Motorepuestos del Oriente", title: "Informe Técnico Final · Motorepuestos del Oriente", description: "Ingeniería de Software III · Corporación Universitaria Remington",
  styles: {
    default: { document: { run: { font: FONT, size: 24 }, paragraph: { spacing: DOBLE } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, bold: true, color: "000000" }, paragraph: { spacing: DOBLE, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, bold: true, color: "000000" }, paragraph: { spacing: DOBLE, keepNext: true, outlineLevel: 1 } } ] },
  numbering: { config: [{ reference: "vinetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440, header: 720 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 24 })] })] }) },
    children: [...portada, salto(), ...toc(), ...contenido] }]
});
// Word no debe recomprimir las imágenes al guardar ni al exportar a PDF (si no, las capturas salen borrosas)
async function sinCompresion(b){
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("docx")] }));
  const z = await JSZip.loadAsync(b); const f = "word/settings.xml";
  z.file(f, (await z.file(f).async("string")).replace("</w:compat>", "</w:compat><w:doNotAutoCompressPictures/>"));
  return z.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
Packer.toBuffer(doc).then(sinCompresion).then(b => { fs.writeFileSync(OUT, b); fs.writeFileSync(path.join(__dirname, ".titulos.json"), JSON.stringify(TITULOS.map(t => t.k))); console.log("Informe generado:", OUT, "·", nTabla, "tablas ·", nFig, "figuras"); });
