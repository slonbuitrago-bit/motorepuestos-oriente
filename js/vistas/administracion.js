"use strict";
/* Motorepuestos del Oriente
   Vista · Usuarios, permisos, catálogos geográficos, sucursales y respaldo. */

/* --- Administración --- */
function vAdministracion(){
  const tab = UI.tab.adm || (P("admin.usuarios") ? "usr" : "geo");
  const T = [];
  if (P("admin.usuarios")) T.push(["usr","Usuarios"],["perm","Roles y permisos"]);
  if (P("admin.catalogos")) T.push(["geo","Ciudades y municipios"],["suc","Sucursales"]);
  if (P("admin.usuarios")) T.push(["datos","Datos y respaldo"]);
  let body = "";
  if (tab === "usr") body = `<div class="row between"><p class="muted">Caso de uso · Gestionar usuarios y permisos</p><button class="btn primary" data-act="usuarioDlg">${icon("plus")} Nuevo usuario</button></div>
    <div class="tw"><table><thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Sucursal</th><th>Estado</th><th></th></tr></thead><tbody>${DB.usuarios.map(u => `<tr><td>${esc(u.nombre)}</td><td class="mono">${esc(u.usuario)}</td><td>${esc(u.rol)}</td><td>${esc(suc(u.sucursalId)?.nombre)}</td><td>${u.activo ? pill("Activo","ok") : pill("Inactivo","")}</td><td>${u.id !== ME.id ? `<button class="btn sm" data-act="toggleUser" data-id="${u.id}">${u.activo ? "Desactivar" : "Activar"}</button>` : '<span class="muted">Tu sesión</span>'}</td></tr>`).join("")}</tbody></table></div>
    <p class="muted" style="font-size:.85rem">Los usuarios no se eliminan: se desactivan, para conservar la trazabilidad de lo que hicieron.</p>`;
  if (tab === "perm") body = `<p class="muted">Marca qué puede hacer cada rol. Los cambios aplican de inmediato y quedan auditados. El rol Administrador conserva siempre la gestión de usuarios.</p>
    <div class="tw"><table class="matrix"><thead><tr><th>Permiso</th>${Object.keys(DB.roles).map(r => `<th>${esc(r)}</th>`).join("")}</tr></thead><tbody>${Object.entries(PERMISOS).map(([k, l]) => `<tr><td>${esc(l)}<br><span class="mono muted">${k}</span></td>${Object.keys(DB.roles).map(r => `<td><input type="checkbox" aria-label="${esc(l)} para ${esc(r)}" data-perm="${k}" data-rol="${esc(r)}" ${DB.roles[r].includes(k) ? "checked" : ""} ${r === "Administrador" && k === "admin.usuarios" ? "disabled" : ""}></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  if (tab === "geo") body = `<p class="muted">Caso de uso · Gestionar ciudades y municipios. Estos catálogos alimentan la selección de país, departamento y ciudad al facturar.</p>
    <form data-form="ciudad" class="grid g4" style="align-items:end"><div class="field"><label for="g-e">Departamento / estado</label><select id="g-e" name="estadoId">${DB.estados.map(e => `<option value="${e.id}">${esc(e.nombre)} (${esc(byId(DB.paises, e.paisId).nombre)})</option>`).join("")}</select></div>
      <div class="field"><label for="g-n">Ciudad o municipio</label><input id="g-n" name="nombre" required></div><div class="field"><label for="g-c">Código DANE</label><input id="g-c" name="codigo" required pattern="[0-9A-Z-]{3,8}" placeholder="05021"></div><button class="btn primary" type="submit">Agregar</button></form>
    <form data-form="estado" class="grid g4" style="align-items:end"><div class="field"><label for="ge-p">País</label><select id="ge-p" name="paisId">${DB.paises.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join("")}</select></div>
      <div class="field"><label for="ge-n">Nuevo departamento o estado</label><input id="ge-n" name="nombre" required></div><div class="field"><label for="ge-c">Código</label><input id="ge-c" name="codigo" required pattern="[A-Za-z]{2,5}" placeholder="BOY"></div><button class="btn" type="submit">Agregar departamento</button></form>
    <p class="muted" style="font-size:.85rem">Al facturar, la lista de departamentos muestra solo los del país elegido y la de municipios solo los registrados aquí para ese departamento.</p>
    <div class="tw"><table><thead><tr><th>Código</th><th>Ciudad o municipio</th><th>Departamento / estado</th><th>País</th><th class="r">Clientes</th></tr></thead><tbody>${DB.ciudades.map(c => { const e = byId(DB.estados, c.estadoId); return `<tr><td class="mono">${esc(c.id)}</td><td>${esc(c.nombre)}</td><td>${esc(e.nombre)}</td><td>${esc(byId(DB.paises, e.paisId).nombre)}</td><td class="r">${DB.clientes.filter(x => x.ciudadId === c.id).length}</td></tr>`; }).join("")}</tbody></table></div>`;
  if (tab === "suc") body = `<div class="tw"><table><thead><tr><th>Código</th><th>Sucursal</th><th>Dirección</th><th>Municipio</th><th class="r">Usuarios</th><th class="r">Unidades</th></tr></thead><tbody>${DB.sucursales.map(s => `<tr><td class="mono">${s.id}</td><td>${esc(s.nombre)}</td><td>${esc(s.direccion)}</td><td>${esc(ciudad(s.ciudadId).nombre)}</td><td class="r">${DB.usuarios.filter(u => u.sucursalId === s.id).length}</td><td class="r">${NUM.format(sum(DB.productos, p => p.stock[s.id] || 0))}</td></tr>`).join("")}</tbody></table></div>`;
  if (tab === "datos") body = `<div class="note">Este prototipo guarda los datos en el navegador de cada persona. Para compartir un estado concreto con el grupo, copia el respaldo y que la otra persona lo pegue en "Restaurar". En producción los datos irían a la base de datos PostgreSQL descrita en <span class="mono">docs/modelo-datos.sql</span>.</div>
    <div class="row"><button class="btn" data-act="copiarRespaldo">Copiar respaldo (JSON)</button><button class="btn danger" data-act="resetDlg">Restablecer datos de ejemplo</button></div>
    <form data-form="restaurar" class="grid"><div class="field"><label for="rs-j">Restaurar desde respaldo</label><textarea id="rs-j" name="json" placeholder="Pega aquí el respaldo JSON" style="min-height:120px;font-family:var(--f-mono);font-size:.8rem"></textarea></div><div><button class="btn" type="submit">Restaurar</button></div></form>
    <p class="muted">Tamaño actual: ${(JSON.stringify(DB).length / 1024).toFixed(0)} KB · ${DB.audit.length} registros de auditoría.</p>`;
  return `<div class="page-head"><div><h1>Administración</h1><p>Usuarios, permisos por rol, catálogos geográficos y sucursales.</p></div></div>
  <div class="tabs" role="tablist">${T.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-act="tab" data-g="adm" data-v="${k}">${l}</button>`).join("")}</div>${body}`;
}
function dlgUsuario(){
  openDlg("Nuevo usuario", `<form id="frm-us" data-form="usuario" class="grid g2">
    <div class="field"><label for="us-n">Nombre completo *</label><input id="us-n" name="nombre" required></div>
    <div class="field"><label for="us-u">Usuario *</label><input id="us-u" name="usuario" required pattern="[a-z0-9.]{3,20}" aria-describedby="us-u-h"><span class="hint" id="us-u-h">Minúsculas, sin espacios.</span></div>
    <div class="field"><label for="us-r">Rol</label><select id="us-r" name="rol">${Object.keys(DB.roles).map(r => `<option>${esc(r)}</option>`).join("")}</select></div>
    <div class="field"><label for="us-s">Sucursal</label><select id="us-s" name="suc">${DB.sucursales.map(s => `<option value="${s.id}">${esc(s.nombre)}</option>`).join("")}</select></div>
    <div id="us-err" role="alert"></div></form>`, `<button class="btn" data-act="cerrarDlg">Cancelar</button><button class="btn primary" type="submit" form="frm-us">Crear usuario</button>`);
}
