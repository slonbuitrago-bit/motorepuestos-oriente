"use strict";
/* Motorepuestos del Oriente
   Vista · Ingreso al sistema y panel de accesibilidad. */

/* ---------- Vistas ---------- */
function vLogin(){
  const sel = UI.loginSel || "U3";
  return `
  <div class="login">
    <section class="side" aria-labelledby="lg-t">
      <div class="brand"><div class="mark" aria-hidden="true">MRO</div><div><b>Motorepuestos del Oriente</b><small>Mayorista de repuestos para motos</small></div></div>
      <h1 id="lg-t">Cada repuesto facturado, despachado y entregado sin perderle el rastro.</h1>
      <p>Facturación con autorización de gerencia, control de cupos, remisiones con conteo ciego, inventario por sucursal, importaciones desde la Zona Libre de Colón y auditoría encadenada con SHA-256.</p>
      <div class="facts"><div><b>3</b>sucursales en el Oriente antioqueño</div><div><b>12 años</b>de convenio con el proveedor en Panamá</div><div><b>${NUM.format(DB.facturas.length)}</b>facturas de ejemplo cargadas</div></div>
    </section>
    <section class="form" aria-labelledby="lg-f">
      <div><p class="eyebrow">Ingreso al sistema</p><h2 id="lg-f">Elige un usuario de demostración</h2>
      <p class="muted" style="margin-top:6px">Cada usuario tiene un rol con permisos distintos. Prueba el flujo completo: Logística registra, Gerencia autoriza, Despachos entrega.</p></div>
      <div class="users" role="group" aria-label="Usuarios de demostración">
        ${DB.usuarios.filter(u => u.activo).map(u => `<button class="ucard" data-act="loginSel" data-id="${u.id}" aria-pressed="${u.id === sel}"><b>${esc(u.nombre)}</b><small>${esc(u.rol)} · ${esc(suc(u.sucursalId)?.nombre || "")}</small></button>`).join("")}
      </div>
      <form data-form="login" class="grid">
        <div class="field"><label for="lg-pass">Contraseña</label><input id="lg-pass" type="password" autocomplete="current-password" value="demo2026" aria-describedby="lg-h"><span class="hint" id="lg-h">En la demostración la contraseña de todos los usuarios es <span class="mono">demo2026</span>.</span></div>
        <button class="btn primary" type="submit">Ingresar</button>
      </form>
      <div class="row"><a href="#certificados" class="linklike" data-act="verifPublico">Verificar un certificado de garantía sin iniciar sesión</a></div>
      <div class="row"><button class="btn sm" data-act="a11y">${icon("a11y")} Opciones de accesibilidad</button></div>
      ${UI.a11yOpen ? vA11y(true) : ""}
      ${UI.publico ? vVerificar(true) : ""}
    </section>
  </div>`;
}

function vA11y(inline){
  const esc1 = PREFS.escala || 1;
  const tema = PREFS.tema || "sistema";
  return `<section class="a11y" id="a11y-panel" aria-label="Opciones de accesibilidad" ${inline ? 'style="position:static;width:auto;box-shadow:none"' : ""}>
    <div class="row between"><h3>Accesibilidad</h3><button class="btn sm ghost" data-act="a11y">Cerrar</button></div>
    <div class="switch"><span>Tamaño del texto</span><span class="seg" role="group" aria-label="Tamaño del texto">
      ${[[.9,"A−"],[1,"A"],[1.15,"A+"],[1.3,"A++"]].map(([v,l]) => `<button data-act="pref" data-k="escala" data-v="${v}" aria-pressed="${esc1 == v}">${l}</button>`).join("")}</span></div>
    <div class="switch"><span>Tema</span><span class="seg" role="group" aria-label="Tema de color">
      ${[["sistema","Sistema"],["light","Claro"],["dark","Oscuro"]].map(([v,l]) => `<button data-act="pref" data-k="tema" data-v="${v}" aria-pressed="${tema === v}">${l}</button>`).join("")}</span></div>
    ${[["contraste","Alto contraste"],["espaciado","Espaciado amplio (lectura fácil)"],["subrayar","Subrayar enlaces"],["movimiento","Reducir animaciones"]].map(([k,l]) =>
      `<label class="switch" for="pf-${k}"><span>${l}</span><input type="checkbox" id="pf-${k}" data-pref="${k}" ${PREFS[k] ? "checked" : ""}></label>`).join("")}
    <p class="muted" style="font-size:.82rem">Navegación completa con teclado (Tab, Shift+Tab, Enter, Esc). Compatible con lectores de pantalla. Botón de lectura en voz alta en la barra superior.</p>
  </section>`;
}
