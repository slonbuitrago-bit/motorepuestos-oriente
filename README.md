# Motorepuestos del Oriente — Sistema de gestión comercial

Prototipo funcional para la asignatura **Ingeniería de Software III**. Resuelve los problemas levantados en la entrevista con Motorepuestos del Oriente (Rionegro, Antioquia): facturas manuales sin control, fraudes en cantidades despachadas, malas indicaciones de envío, necesidad de certificados de garantía y facturación electrónica alineada con ISO 9000.

## Cómo abrirlo

No necesita instalar nada. Abre **`index.html`** con doble clic en cualquier navegador (Chrome, Edge, Firefox, Safari), en computador o celular.

Usuarios de demostración (contraseña `demo2026` para todos):

| Usuario | Rol | Qué puede hacer |
|---|---|---|
| Camila Ospina | Logística | Registrar pedidos de venta y facturarlos, facturas manuales sin pedido, clientes |
| Andrés Restrepo | Gerente | Autorizar o rechazar, registrar pagos, cerrar novedades, cupos |
| Julián Zuluaga | Despachos | Remisiones, conteo ciego, salida y entrega |
| Diana Marín | Bodega | Inventario, traslados, ajustes, importaciones |
| Mateo Ríos | Auditor | Consultar trazabilidad e integridad |
| Laura Gómez | Administrador | Todo, incluidos usuarios, permisos y catálogos |

**Recorrido sugerido para la presentación:**
1. Camila registra un **pedido de venta** y lo factura: queda contabilizado de inmediato y se envía correo al cliente.
2. Camila registra una **factura manual** (sin pedido). Prueba también a superar el cupo: el sistema la bloquea.
3. Andrés autoriza la factura manual: recién ahí se contabiliza, se genera el CUFE y los certificados de garantía.
4. Julián crea la remisión con instrucciones de envío, hace el conteo ciego (equivócate a propósito para ver la novedad), despacha y registra la entrega.
5. Mateo o Laura abren **Notificaciones** para ver los correos enviados y **Trazabilidad**, rastrean la factura y verifican la integridad de la bitácora. Laura puede **simular una alteración** para mostrar que se detecta.
6. Cualquiera verifica un certificado en **Certificados** (también funciona sin iniciar sesión).

Los datos se guardan en el navegador de cada persona. En **Administración → Datos y respaldo** se puede copiar un respaldo JSON para pasárselo a otra persona o restablecer los datos de ejemplo.

## Módulos

| Módulo | Caso de uso / requisito |
|---|---|
| Tablero | Estadísticas: ventas por mes y municipio, top de referencias, entregas conformes, pendientes por rol |
| Pedidos de venta | Registrar pedido · Facturar pedido (contabilización automática) · Anular |
| Facturas → Registrar factura manual | Factura sin pedido · Seleccionar país, estado y ciudad · Validar cupo |
| Autorizaciones | Consultar pendientes · Autorizar (incluye Contabilizar) · Rechazar (extiende Autorizar) |
| Despachos | Registrar despacho · Registrar instrucciones de envío · Conteo ciego · Entrega · Novedades |
| Inventario | Existencias por sucursal, kárdex, ajustes, traslados, alertas de mínimo |
| Importaciones | Órdenes al proveedor de Panamá, estados aduaneros, costo nacionalizado |
| Clientes y cupos | NIT, municipio, cupo y uso del cupo, autorización Ley 1581 |
| Trazabilidad | Bitácora encadenada SHA-256, rastreo de documentos, verificación de integridad |
| Notificaciones | Correos al cliente en pedido, factura, despacho y pago (bandeja de salida) |
| Certificados | Garantías verificables por código |
| Administración | Usuarios, matriz de permisos por rol, ciudades y municipios (DANE), sucursales, respaldo |
| Calidad y normas | Matriz de requisitos, ISO/IEC 25010, WCAG, marco normativo |

## Arquitectura

Aplicación web de una sola página con **arquitectura en capas y separación MVC**: 28 módulos JavaScript en 6 capas (núcleo, datos, dominio, presentación, control y arranque), sin frameworks ni dependencias. La metodología fue incremental con prototipado evolutivo. Todo el detalle (patrones, decisiones, diagramas y arquitectura de producción) está en [`docs/arquitectura.md`](docs/arquitectura.md).

## Estructura del proyecto

```
motorepuestos-oriente/
├── app.html                 ← estructura HTML y orden de carga de los módulos
├── css/estilos.css          ← estilos, temas y accesibilidad
├── js/                      ← código por capas: nucleo/, datos/, dominio/, ui/, vistas/, controladores/, app.js
├── index.html               ← generado por ./build.sh (versión modular, la que publica GitHub Pages)
├── dist/motorepuestos-oriente.html ← generado: todo en un solo archivo, para WhatsApp o sin internet
├── build.sh                 ← genera index.html y dist/
├── docs/
│   ├── arquitectura.md      ← arquitectura, módulos, patrones, decisiones y metodología
│   ├── SRS-IEEE830.md       ← especificación de requisitos (IEEE 830)
│   ├── calidad-ISO25010.md  ← plan de calidad, métricas y casos de prueba
│   ├── actividad2-consultoria.md ← requisitos de las tarjetas A y B, su tipo, casos de uso y plan de pruebas
│   ├── manual-procedimientos.md  ← procedimiento de desarrollo conforme con ISO 9000
│   └── modelo-datos.sql     ← base de datos PostgreSQL con integridad y auditoría
├── CONTRIBUTING.md          ← cómo trabajamos en grupo
└── README.md
```

Cada archivo de `js/` empieza con un comentario que dice a qué capa pertenece y qué hace.

## Accesibilidad

Botón **Accesibilidad** en la barra superior: tamaño de texto hasta 130 %, alto contraste, tema claro u oscuro, espaciado amplio para lectura fácil, subrayado de enlaces y reducción de animaciones. Botón de **lectura en voz alta** de la pantalla actual. Toda la aplicación se usa con teclado y lector de pantalla. Tipografía Atkinson Hyperlegible, diseñada para personas con baja visión.

## Publicarlo con un enlace

- **GitHub Pages:** sube la carpeta a un repositorio, ve a *Settings → Pages*, elige la rama `main` y la carpeta raíz. El enlace queda como `https://USUARIO.github.io/motorepuestos-oriente/`.
- **Netlify Drop (el más rápido, sin cuenta de GitHub):** entra a <https://app.netlify.com/drop> y arrastra la carpeta. Te da un enlace público en segundos.

## Limitaciones del prototipo

- Los datos viven en el navegador (localStorage); en producción irían a PostgreSQL con el modelo de `docs/modelo-datos.sql`.
- El CUFE se calcula con SHA-256 en ambiente de pruebas; la DIAN exige SHA-384 y la transmisión se hace a través de un proveedor tecnológico autorizado.
- La contraseña de demostración es la misma para todos; en producción se guardaría con bcrypt y bloqueo por intentos fallidos.
