# Registro de defectos (bitácora de QA)

Defectos reales encontrados durante el desarrollo y las pruebas, con su causa, su corrección y la prueba que confirma que no reaparecen (regresión).

| ID | Defecto | Cómo se detectó | Severidad | Causa raíz | Corrección | Verificado por | Estado |
|---|---|---|---|---|---|---|---|
| DEF-01 | Los consecutivos de las facturas de ejemplo no seguían el orden cronológico (una factura posterior tenía número menor) | Revisión visual del listado (prueba de sistema) | Alta (incumple la numeración consecutiva DIAN) | Las fechas se generaban al azar después de asignar el número | Generar y ordenar las fechas antes de numerar | CI-10 | Cerrado |
| DEF-02 | El historial de un cliente (Repuestos San Vicente) superaba su cupo, algo que el sistema no permitiría | Prueba de integración de consistencia de datos | Media | Cupo de ejemplo menor que la deuda histórica generada | Ajustar el cupo de ejemplo | CI-10 | Cerrado |
| DEF-03 | La regla de negocio `costeo()` (costo nacionalizado) estaba en la capa de vista | Verificación estática (revisión de código al preparar las pruebas unitarias) | Media (rompe la arquitectura en capas y no se podía probar sola) | Lógica escrita junto a la pantalla de importaciones | Mover `costeo()` y `FLUJO_IMP` a `js/dominio/reglas-negocio.js` | CU-11 | Cerrado |
| DEF-04 | Barra superior con desplazamiento horizontal en celulares de 360 px | Prueba responsive automática (CC-02) — regresión introducida al agregar el botón "Guía" | Media | Etiquetas de texto de los botones no caben a 360 px | Mostrar solo iconos bajo 520 px, con nombre accesible (`aria-label`) | CC-02 | Cerrado |
| DEF-05 | Formulario de factura con desplazamiento horizontal a 360 px | Prueba responsive automática (CC-02) | Media | Los textos ocultos para lectores de pantalla (`.sr`, posición absoluta) dentro de tablas se posicionaban respecto a la página y no a la tabla | `position: relative` en el contenedor de tablas `.tw` | CC-02 | Cerrado |
| DEF-06 | Una cantidad decimal (2,5) se aceptaba y se truncaba en silencio a 2 | Prueba de robustez (CC-04) | Alta (puede facturar una cantidad distinta a la escrita) | `parseInt` descarta los decimales sin avisar | Validar con `Number.isInteger` en factura, conteo ciego, ajuste y traslado | CC-04 | Cerrado |
| DEF-07 | El formulario de clientes mostraba los errores nativos del navegador en lugar de los mensajes accesibles de la aplicación | Prueba de robustez (CC-04) | Baja | El formulario no tenía `novalidate` | Agregar `novalidate` para usar la validación propia | CC-04 | Cerrado |
| DEF-08 | Contraste insuficiente en las etiquetas de grupo del menú (Operación, Abastecimiento, Control) | Auditoría automática de accesibilidad con axe-core (CC-10) | Media (incumple WCAG 2.1 · 1.4.3) | Opacidad del 75 % sobre el texto | Quitar la opacidad | CC-10 | Cerrado |
| DEF-09 | Las tablas que se desplazan a lo ancho no se podían recorrer con el teclado | Auditoría axe-core (CC-10) | Media (incumple WCAG 2.1 · 2.1.1) | El contenedor desplazable no era enfocable | `tabindex="0"`, `role="region"` y nombre accesible en tablas desbordadas | CC-10 | Cerrado |
| DEF-10 | Con el texto al 130 % se cortaban los botones del panel de accesibilidad y el nombre de la empresa en el menú | Revisión de las capturas de evidencia (usabilidad) | Baja | Anchos fijos en píxeles | Filas que se ajustan y ancho del menú en `rem` | Evidencia 15 | Cerrado |

## Limitaciones conocidas (no son defectos del prototipo, se resuelven en producción)

| ID | Limitación | Riesgo | Plan |
|---|---|---|---|
| LIM-01 | La contraseña de demostración se valida en el navegador | OWASP A07 (autenticación) | Autenticación en el servidor con bcrypt y token JWT (HU-01, Sprint 1) |
| LIM-02 | Los datos se guardan en el almacenamiento del navegador (~5 MB) | Con unas 30.000 facturas se alcanza el límite (prueba de estrés CC-13) | API REST + PostgreSQL (`docs/modelo-datos.sql`) |
| LIM-03 | El CUFE usa SHA-256 en ambiente de pruebas | La DIAN exige SHA-384 y transmisión por proveedor tecnológico | Integrar proveedor tecnológico autorizado |
| LIM-04 | Pruebas de compatibilidad solo en Chromium (escritorio, iPhone, Android y tableta emulados) | Firefox y Safari no probados automáticamente | Prueba manual en Firefox y Safari antes de producción |
| LIM-05 | 100.000 usuarios concurrentes (A2) y disponibilidad ≥ 99,5 % (A4) | No se pueden medir sin servidor | Prueba de carga k6 y monitoreo de 30 días (`docs/actividad2-consultoria.md`) |

## Informe de auditoría recibido (pruebas cruzadas · Actividad 5)

> Esta sección la completa el equipo con el reporte que entregue el **grupo auditor**. Los defectos de arriba son los que encontró nuestro propio equipo.

| ID | Defecto reportado por el grupo auditor | Severidad | Respuesta del equipo | Estado |
|---|---|---|---|---|
| AUD-01 | | | | |
| AUD-02 | | | | |
| AUD-03 | | | | |
