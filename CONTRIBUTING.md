# Cómo trabajamos en grupo

## Primera vez

1. Una persona crea el repositorio en GitHub (puede ser privado) y sube esta carpeta:
   ```bash
   git remote add origin https://github.com/USUARIO/motorepuestos-oriente.git
   git push -u origin main
   ```
2. En GitHub: *Settings → Collaborators → Add people* para invitar a cada integrante.
3. Cada integrante clona el repositorio:
   ```bash
   git clone https://github.com/USUARIO/motorepuestos-oriente.git
   ```

Si alguien no usa Git, puede descargar el ZIP desde GitHub (*Code → Download ZIP*) y enviar sus cambios a quien administra el repositorio.

## Para cada cambio

1. Crea una rama con un nombre que diga qué haces: `git checkout -b mejora-reporte-cartera`
2. Edita los archivos de `css/` y `js/` (nunca `index.html` ni `dist/`, que se generan) y ejecuta `./build.sh`.
   En Windows sin bash: usa Git Bash, que viene con Git para Windows.
3. Abre `index.html` y prueba tu cambio con al menos dos roles distintos.
4. Revisa la lista de chequeo de `docs/calidad-ISO25010.md` (sección 5).
5. Sube la rama y abre un *pull request*. Otro integrante lo revisa antes de unirlo a `main`.

## Reparto sugerido

| Integrante | Responsabilidad |
|---|---|
| 1 | Facturación y autorizaciones (RF-01 a RF-07) |
| 2 | Despachos, remisiones y novedades (RF-08 a RF-12) |
| 3 | Inventario e importaciones (RF-13, RF-14) |
| 4 | Documentación: SRS, plan de calidad, diagramas y presentación |

## Dónde está cada cosa

| Archivo | Contenido |
|---|---|
| `js/nucleo/seguridad.js` | Lista de permisos y permisos por rol |
| `js/datos/datos-ejemplo.js` | Datos de ejemplo: productos, clientes, municipios, sucursales |
| `js/dominio/reglas-negocio.js` | Reglas: facturar, autorizar, contabilizar, cupo, correos |
| `js/vistas/<pantalla>.js` | Cada pantalla (`vNombre`) y sus ventanas (`dlgNombre`) |
| `js/controladores/acciones.js` | Acciones de botones |
| `js/controladores/formularios.js` | Validación y guardado de formularios |
| `app.html` | Orden de carga de los módulos (si creas un archivo nuevo, agrégalo aquí) |

Para crear una pantalla nueva: crea `js/vistas/mi-pantalla.js` con la función `vMiPantalla()`, agrégala en `app.html` antes de `js/ui/dialogos.js`, regístrala en `VIEWS` (`js/app.js`) y en `RUTAS` (`js/ui/navegacion.js`).
Arquitectura completa: `docs/arquitectura.md`.

Para agregar un permiso nuevo: añádelo en `PERMISOS`, asígnalo en `ROLES_BASE` y úsalo con `P("mi.permiso")`. Toda acción que cambie datos debe llamar `audit(...)`.
