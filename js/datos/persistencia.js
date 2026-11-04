"use strict";
/* Motorepuestos del Oriente
   Capa de datos · Persistencia: carga y guardado (prototipo: almacenamiento del navegador; producción: API + PostgreSQL). */

function load(){
  const raw = store.get(STORE_KEY);
  if (raw){ try { DB = JSON.parse(raw); if (DB && DB.version === 2) return; } catch(e){} }
  DB = seed(); save();
}
function save(){ store.set(STORE_KEY, JSON.stringify(DB)); }
