// Graba el video demostrativo de la app siguiendo el guion de la demo.
// Uso: node grabar.js <repo> <carpeta-salida>
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
const [REPO, OUT] = process.argv.slice(2);
const W = 1280, H = 720;
const LOGO = "data:image/jpeg;base64," + fs.readFileSync(path.join(REPO, "img/logo-512.jpg")).toString("base64");

// Cursor visible (Playwright no graba el puntero real). Se pone dentro del <dialog> abierto si lo hay.
const CURSOR = `(() => {
  const mk = () => { let c = document.getElementById("__cur"); if (c) return c;
    c = document.createElement("div"); c.id = "__cur";
    c.innerHTML = '<svg width="26" height="30" viewBox="0 0 26 30"><path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L21 17 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
    c.style.cssText = "position:fixed;left:640px;top:360px;z-index:2147483647;pointer-events:none;transition:left .55s ease,top .55s ease;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))";
    return c; };
  window.__mv = (x, y) => { const c = mk(); const dl = [...document.querySelectorAll("dialog[open]")].pop(); const host = dl || document.documentElement; if (c.parentNode !== host) host.appendChild(c); c.style.left = x + "px"; c.style.top = y + "px"; };
  window.__fx = (x, y) => { const r = document.createElement("div"); const dl = [...document.querySelectorAll("dialog[open]")].pop();
    r.style.cssText = "position:fixed;left:" + (x - 18) + "px;top:" + (y - 18) + "px;width:36px;height:36px;border-radius:50%;border:3px solid #F28C28;z-index:2147483646;pointer-events:none;transition:transform .45s ease,opacity .45s ease";
    (dl || document.documentElement).appendChild(r); requestAnimationFrame(() => { r.style.transform = "scale(1.8)"; r.style.opacity = "0"; }); setTimeout(() => r.remove(), 600); };
})();`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: OUT, size: { width: W, height: H } } });
  await ctx.addInitScript(CURSOR);
  const p = await ctx.newPage(); const T0 = Date.now();
  const subs = []; let abierto = null;
  const t = () => (Date.now() - T0) / 1000;
  // Cada subtítulo dura al menos lo necesario para leerlo con calma (unos 14 caracteres por segundo)
  const di = async (texto) => { if (abierto) { const falta = abierto.ini + Math.max(4.5, abierto.texto.length / 14 + 1.2) - t(); if (falta > 0) await pausa(falta * 1000); abierto.fin = t(); subs.push(abierto); } abierto = texto ? { ini: t(), texto } : null; };
  const pausa = ms => p.waitForTimeout(ms);
  const ev = (fn, a) => p.evaluate(fn, a);
  const mover = async sel => { const l = p.locator(sel).first(); await l.scrollIntoViewIfNeeded(); const bb = await l.boundingBox(); const x = bb.x + Math.min(bb.width / 2, 60), y = bb.y + bb.height / 2; await ev(([x, y]) => window.__mv(x, y), [x, y]); await pausa(650); return [x, y]; };
  const clic = async (sel, espera = 700) => { const [x, y] = await mover(sel); await ev(([x, y]) => window.__fx(x, y), [x, y]); await p.locator(sel).first().click(); await pausa(espera); };
  const escribir = async (sel, txt, espera = 400) => { await clic(sel, 200); await p.locator(sel).first().fill(""); await p.locator(sel).first().pressSequentially(txt, { delay: 85 }); await pausa(espera); };
  const usuario = async (id, espera = 1200) => { await mover("#sw-user"); await p.selectOption("#sw-user", id); await pausa(espera); };
  const ir = async ruta => { const sel = `nav a[href="#${ruta}"]`; if (await p.locator(sel).count()) await clic(sel, 1100); else { await ev(r => location.hash = r, ruta); await pausa(1100); } };

  /* ---------- Portada ---------- */
  await p.setContent(`<html><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;gap:56px;background:#161616;font-family:'DejaVu Sans',Arial;color:#fff">
    <img src="${LOGO}" style="width:300px;border-radius:18px">
    <div style="max-width:620px"><div style="color:#F28C28;letter-spacing:.18em;font-size:15px;font-weight:700">VIDEO DEMOSTRATIVO · INGENIERÍA DE SOFTWARE III</div>
    <div style="font-size:46px;font-weight:700;line-height:1.15;margin:16px 0">Cada repuesto facturado, despachado y entregado sin perderle el rastro</div>
    <div style="font-size:20px;color:#bbb">Sistema de gestión comercial · Motorepuestos del Oriente, Rionegro</div></div></body></html>`);
  await pausa(6500);

  /* ---------- 1. Ingreso ---------- */
  await p.goto("file://" + path.join(REPO, "index.html")); await pausa(1500);
  await di("Cada persona entra con su usuario y contraseña. Tras 3 intentos fallidos, la cuenta se bloquea 5 minutos.");
  await escribir("#lg-user", "cospina", 300); await escribir("#lg-pass", "demo2026", 500);
  await clic('form[data-form="login"] button[type=submit]', 1500);
  await di("Camila es de Logística: solo ve lo que su rol le permite. El tablero muestra sus pendientes y los indicadores.");
  await pausa(5000);

  /* ---------- 2. Factura manual ---------- */
  await di("Camila registra una factura manual: una venta que no viene de un pedido.");
  await ir("facturas"); await clic('a[href="#factura-nueva"]', 1500);
  await di("Listas encadenadas: al elegir Panamá, solo aparecen los estados de Panamá.");
  await mover("#d-pais"); await p.selectOption("#d-pais", { label: "Panamá" }); await pausa(900);
  await mover("#d-est"); await pausa(2600);
  await di("El cliente se busca escribiendo. Al elegirlo, el destino se llena solo y se ve su cupo disponible.");
  await escribir("#d-cli", "san vic", 600);
  await p.fill("#d-cli", await ev(() => etqCliente(cli("C8")))); await pausa(2800);
  await di("Pide 12 llantas: unos 2,4 millones de pesos.");
  await escribir("#it-p-0", "llanta", 500);
  await p.fill("#it-p-0", await ev(() => etqProducto(prod("PR19")))); await pausa(700);
  await p.fill("#it-q-0", ""); await p.locator("#it-q-0").pressSequentially("12", { delay: 120 }); await pausa(1300);
  await clic('form[data-form="factura"] button[type=submit]', 600);
  await di("El sistema no deja facturar por encima del cupo del cliente.");
  await pausa(4200);
  await di("Con 2 llantas sí cabe en el cupo.");
  await escribir("#it-q-0", "2", 1300);
  await clic('form[data-form="factura"] button[type=submit]', 900);
  await di("La factura queda PENDIENTE y todavía no se contabiliza: necesita la autorización del gerente.");
  await pausa(4500);
  const fid = await ev(() => DB.facturas.filter(f => f.clienteId === "C8" && f.estado === "Pendiente").pop().id);

  /* ---------- 3. Gerente autoriza ---------- */
  await di("Modo demostración: cambiamos de usuario. Ahora es Andrés, el gerente.");
  await usuario("U2"); await ir("autorizaciones"); await pausa(1200);
  await di("Quien registra una factura no puede autorizarla. El gerente revisa la de Repuestos San Vicente.");
  await mover(`[data-act="autorizar"][data-id="${fid}"]`); await pausa(2500);
  await clic(`[data-act="autorizar"][data-id="${fid}"]`, 900);
  await di("Al autorizar se generan el CUFE de la factura electrónica, el asiento contable y los certificados de garantía.");
  await ir("facturas"); await clic(`[data-act="verFactura"][data-id="${fid}"]`, 1500);
  await clic('[data-act="tab"][data-v="cont"]', 3800);
  await clic('.dlg-head [data-act="cerrarDlg"]', 800);

  /* ---------- 4. Despacho con conteo ciego ---------- */
  await di("Ahora es Julián, de despachos. Crea la remisión con las instrucciones de envío del cliente.");
  await usuario("U4"); await ir("despachos"); await pausa(800);
  await clic(`[data-act="nuevaRemision"][data-id="${fid}"]`, 1200);
  await mover("#r-tr"); await p.selectOption("#r-tr", "Coordinadora"); await pausa(800);
  await escribir("#r-gu", "123456", 900);
  await clic('button[form="frm-rem"]', 1500);
  await di("Conteo ciego: quien alista no ve cuánto se facturó. Cuenta 3 llantas en lugar de 2…");
  await escribir("#cc-0", "3", 900);
  await clic('button[form="frm-conteo"]', 900);
  await di("…y el sistema BLOQUEA la salida y registra una novedad. Así se evita el fraude en los despachos.");
  await pausa(5000);
  await di("Con el conteo correcto, la remisión se sella y sale de bodega.");
  await escribir("#cc-0", "2", 700);
  await clic('button[form="frm-conteo"]', 1500);
  await clic('[data-act="despachar"]', 2500);
  if (await p.locator("dialog[open]").count()) { const x = p.locator('dialog[open] .dlg-head [data-act="cerrarDlg"]'); if (await x.count()) await clic('dialog[open] .dlg-head [data-act="cerrarDlg"]', 600); }

  /* ---------- 5. Auditor: correos y trazabilidad ---------- */
  await di("Ahora es Mateo, el auditor. El cliente recibió un correo con su factura y otro con su despacho.");
  await usuario("U6"); await ir("notificaciones"); await pausa(4500);
  await di("Trazabilidad: la bitácora registra cada acción y cada registro depende del anterior (SHA-256).");
  await ir("trazabilidad"); await pausa(1200);
  await clic('[data-act="verifCadena"]', 3500);
  await di("Rastreo de la factura: quién la hizo, quién la autorizó, el conteo errado y la salida. Nada se puede alterar sin detectarse.");
  const num = await ev(id => DB.facturas.find(f => f.id === id).numero, fid);
  await escribir("#rs", num, 500); await clic('form[data-form="rastreo"] button', 1200);
  await p.locator("#rastreo-res").scrollIntoViewIfNeeded().catch(() => {}); await pausa(5000);

  /* ---------- 5b. Bodega: inventario e importaciones ---------- */
  await di("Ahora es Diana, de bodega: ve las existencias de cada una de las 3 sucursales y las alertas de stock mínimo.");
  await usuario("U5"); await ir("inventario"); await pausa(4500);
  await di("Las importaciones desde la Zona Libre de Colón (Panamá) se siguen por estado aduanero, con su costo nacionalizado.");
  await ir("importaciones"); await pausa(1500);
  if (await p.locator('[data-act="verImport"]').count()) { await clic('[data-act="verImport"]', 4500); if (await p.locator("dialog[open]").count()) await clic('dialog[open] .dlg-head [data-act="cerrarDlg"]', 600); }

  /* ---------- 6. Accesibilidad ---------- */
  await di("Accesibilidad (ley de discapacidad): texto hasta 130 %, alto contraste y uso con teclado.");
  await ir("inicio"); await clic('[data-act="a11y"]', 900);
  await clic('[data-act="pref"][data-k="escala"][data-v="1.3"]', 900);
  await clic("#pf-contraste", 3800);
  await clic("#pf-contraste", 400); await clic('[data-act="pref"][data-k="escala"][data-v="1"]', 600);
  await p.keyboard.press("Escape"); await pausa(400);
  // Capturas de celular en una pestaña aparte (no se graba), para no deformar el video
  const p2 = await ctx.newPage(); await p2.setViewportSize({ width: 390, height: 780 });
  await p2.goto("file://" + path.join(REPO, "index.html")); await p2.waitForTimeout(800);
  if (await p2.locator("#lg-user").count()) { await p2.fill("#lg-user", "dmarin"); await p2.fill("#lg-pass", "demo2026"); await p2.click('form[data-form="login"] button[type=submit]'); await p2.waitForTimeout(900); }
  await p2.evaluate(() => location.hash = "inicio"); await p2.waitForTimeout(700);
  const movil = (await p2.screenshot()).toString("base64");
  await p2.evaluate(() => location.hash = "inventario"); await p2.waitForTimeout(900); const movil2 = (await p2.screenshot()).toString("base64");
  await p2.close(); await p.bringToFront();
  await di("Diseño responsive: la misma aplicación funciona en el celular, sin instalar nada.");
  const tel = img => `<div style="width:300px;height:600px;border-radius:38px;background:#0b0b0b;padding:14px;box-shadow:0 20px 50px rgba(0,0,0,.5)"><img src="data:image/png;base64,${img}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:26px"></div>`;
  await p.setContent(`<html><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;gap:70px;background:#2b2f33">${tel(movil)}${tel(movil2)}</body></html>`);
  await pausa(5500);
  await di(null);

  /* ---------- Cierre ---------- */
  await p.setContent(`<html><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#161616;font-family:'DejaVu Sans',Arial;color:#fff">
    <div style="display:flex;gap:48px;align-items:center"><img src="${LOGO}" style="width:220px;border-radius:16px">
    <div style="max-width:700px;font-size:21px;line-height:1.55">
      <div style="font-size:38px;font-weight:700;margin-bottom:14px">Probado con 66 pruebas automáticas</div>
      <div><b style="color:#F28C28">App:</b> slonbuitrago-bit.github.io/motorepuestos-oriente</div>
      <div><b style="color:#F28C28">Código:</b> github.com/slonbuitrago-bit/motorepuestos-oriente</div>
      <div><b style="color:#F28C28">Usuario de prueba:</b> cospina · contraseña demo2026</div>
      <div style="margin-top:18px;color:#bbb;font-size:17px">Stiven Marulanda · Maycol Slon Buitrago · Santiago Buitrago · Andrés Bustamante · Maycol Acevedo · Julián Bedoya · Maycol Gómez</div>
      <div style="color:#888;font-size:15px;margin-top:6px">Ingeniería de Software III · Corporación Universitaria Remington · 2026</div></div></div></body></html>`);
  await pausa(7000);
  const video = await p.video().path(); await ctx.close(); await b.close();
  fs.writeFileSync(path.join(OUT, "subtitulos.json"), JSON.stringify(subs, null, 1));
  console.log("video:", video, "· duración aprox.", t().toFixed(1), "s ·", subs.length, "subtítulos");
})().catch(e => { console.error(e); process.exit(1); });
