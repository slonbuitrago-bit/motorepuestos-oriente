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
2. Edita **`app.html`** (no `index.html`) y ejecuta `./build.sh` para regenerar `index.html`.
   En Windows sin bash: copia `app.html` y ábrelo directamente; el navegador lo muestra igual.
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

## Dónde está cada cosa en app.html

| Sección (busca el comentario) | Contenido |
|---|---|
| `Seguridad: roles y permisos` | Lista de permisos y permisos por rol |
| `function seed()` | Datos de ejemplo: productos, clientes, municipios, sucursales |
| `Derivados de negocio` | Reglas: cupo, estados logísticos |
| `/* --- Facturas --- */` y siguientes | Cada pantalla (`vNombre`) y sus ventanas (`dlgNombre`) |
| `const ACT` | Acciones de botones |
| `const FORM` | Validación y guardado de formularios |

Para agregar un permiso nuevo: añádelo en `PERMISOS`, asígnalo en `ROLES_BASE` y úsalo con `P("mi.permiso")`. Toda acción que cambie datos debe llamar `audit(...)`.
