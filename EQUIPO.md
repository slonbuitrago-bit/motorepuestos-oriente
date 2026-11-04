# Organización del equipo (7 integrantes)

> **Regla principal:** cada quien trabaja **solo en sus archivos**, y todo cambio entra por *pull request* que aprueba el líder. Así el proyecto no se vuelve un revoltijo.

**Enlaces**
- App: <https://slonbuitrago-bit.github.io/motorepuestos-oriente/> (contraseña de todos los usuarios: `demo2026`)
- Repositorio: <https://github.com/slonbuitrago-bit/motorepuestos-oriente>

---

## 1. Quién hace qué

Escribe tu nombre en la columna *Integrante* (el líder la completa al repartir).

| # | Rol | Integrante | Archivos que le pertenecen | Expone en la clase final |
|---|---|---|---|---|
| 1 | **Líder e integrador** | _(líder)_ | `README.md`, `EQUIPO.md`, `CONTRIBUTING.md`, `app.html`, `js/app.js`, `js/ui/`, `js/nucleo/` | Introducción, problema del negocio y cierre |
| 2 | **Ventas y facturación** | | `js/vistas/pedidos.js`, `facturas.js`, `autorizaciones.js` | Demo: pedido → factura → autorización |
| 3 | **Despachos y notificaciones** | | `js/vistas/despachos.js`, `notificaciones.js` | Demo: conteo ciego, entrega con novedad, correos (control antifraude) |
| 4 | **Inventario y abastecimiento** | | `js/vistas/inventario.js`, `importaciones.js`, `clientes.js`, `certificados.js`, `js/datos/datos-ejemplo.js` | Demo: inventario por sucursal, importación desde Panamá, certificados |
| 5 | **Requisitos** | | `docs/SRS-IEEE830.md`, `docs/actividad2-consultoria.md` | Requisitos, su clasificación por tipo y casos de uso |
| 6 | **Arquitectura y base de datos** | | `docs/arquitectura.md`, `docs/modelo-datos.sql`, `js/datos/`, `js/dominio/` | Arquitectura en capas, módulos y modelo de datos |
| 7 | **Calidad y normas** | | `docs/calidad-ISO25010.md`, `docs/manual-procedimientos.md`, `js/vistas/calidad.js`, `css/estilos.css` | ISO 25010, pruebas, accesibilidad, ISO 9000 y trazabilidad |

Si necesitas cambiar un archivo de otro rol, **avísale primero** (comentario en GitHub o WhatsApp) y que esa persona lo revise.

---

## 2. Tareas de cada rol

Marca `[x]` cuando termines (puedes editar este archivo con un *pull request*).

### 1 · Líder e integrador
- [ ] Repartir roles y escribir los nombres en la tabla
- [ ] Invitar a cada integrante (Settings → Collaborators)
- [ ] Proteger la rama `main` (ver sección 5)
- [ ] Revisar y unir los *pull requests* al menos dos veces por semana
- [ ] Armar la presentación final con las diapositivas que entregue cada rol
- [ ] Dirigir el ensayo general

### 2 · Ventas y facturación
- [ ] Probar en la app: pedido normal, pedido con cupo insuficiente, factura manual sin existencia, autorizar, rechazar
- [ ] Anotar en un *issue* cualquier error o texto confuso que encuentres
- [ ] Preparar el guion de la demo (máximo 3 minutos) y 1 diapositiva

### 3 · Despachos y notificaciones
- [ ] Probar: crear remisión sin guía (debe fallar), conteo ciego errado, entrega con faltante, cerrar novedad
- [ ] Verificar que cada transacción genere su correo en Notificaciones (pedido, factura, despacho, pago)
- [ ] Guion de la demo (máximo 3 minutos) y 1 diapositiva sobre cómo se evita el fraude

### 4 · Inventario y abastecimiento
- [ ] Probar: ajuste con motivo, traslado entre sucursales, avanzar una importación hasta "Recibida", verificar un certificado
- [ ] (Opcional) Ajustar productos y precios de ejemplo en `datos-ejemplo.js` para que se parezcan a los reales
- [ ] Guion de la demo (máximo 3 minutos) y 1 diapositiva

### 5 · Requisitos
- [ ] Revisar el SRS y corregir lo que no coincida con la app
- [ ] Exportar el diagrama de casos de uso a imagen: pegar el código PlantUML de `actividad2-consultoria.md` en <https://www.plantuml.com/plantuml> y descargar PNG a `docs/img/casos-de-uso.png`
- [ ] 2 diapositivas: tabla de los 8 requerimientos con su tipo + diagrama de casos de uso

### 6 · Arquitectura y base de datos
- [ ] Leer `docs/arquitectura.md` hasta poder explicarlo sin leer
- [ ] Hacer el diagrama entidad-relación: pegar `modelo-datos.sql` en <https://dbdiagram.io> (opción *Import → PostgreSQL*) y exportar PNG a `docs/img/modelo-er.png`
- [ ] 2 diapositivas: diagrama de capas + modelo entidad-relación

### 7 · Calidad y normas
- [ ] Ejecutar la prueba CP-14 (todo el flujo solo con teclado) y anotar el resultado en `calidad-ISO25010.md`
- [ ] En Chrome: clic derecho → Inspeccionar → **Lighthouse** → Accesibilidad. Guardar el puntaje y una captura en `docs/img/lighthouse.png`
- [ ] Llenar la lista de chequeo de auditoría de `manual-procedimientos.md`
- [ ] 2 diapositivas: ISO 25010 + accesibilidad y ley de discapacidad

---

## 3. Cómo entregar tu parte

### Opción fácil (recomendada para todos): formulario de entrega
1. Entra al repositorio → pestaña **Issues** → botón **New issue**.
2. Elige **📦 Entregar mi parte**.
3. Escoge tu rol, escribe qué tarea entregas y pega tu texto. Las imágenes, capturas, PDF o diapositivas se **arrastran al cuadro**.
4. Toca **Create**. Listo: el equipo la ve y se integra al proyecto.

Para avisar de un error de la app o proponer una idea, usa **🐞 Reportar un error o proponer una idea** de la misma forma.

¿No te funciona GitHub? Envía tu parte por WhatsApp y se sube por ti. Lo importante es que llegue.

### Opción avanzada (opcional): editar tú mismo desde la página de GitHub

1. Entra al repositorio y abre el archivo que te corresponde.
2. Toca el **lápiz** ✏️ (*Edit this file*).
3. Haz tu cambio.
4. Toca **Commit changes…**, escribe qué hiciste (ej.: *"Agrega resultado de prueba CP-14"*).
5. Elige **Create a new branch for this commit and start a pull request** y confirma.
6. En la página que aparece toca **Create pull request**. El líder lo revisa y lo une.

Para **subir una imagen**: entra a la carpeta `docs/img`, toca **Add file → Upload files**, arrastra la imagen y sigue los mismos pasos 4 a 6.

Quien sepa usar Git en su computador puede seguir `CONTRIBUTING.md`.

## 4. Reglas de oro

1. **Nadie cambia `main` directamente.** Todo entra por *pull request*.
2. **Un *pull request* = un cambio**, con un título que diga qué hace.
3. **Solo tus archivos.** Si necesitas tocar los de otro, avísale primero.
4. **Prueba antes de pedir revisión:** abre la app y revisa que lo tuyo funcione con al menos dos roles.
5. **Entregas, errores e ideas van por la pestaña *Issues*** con sus formularios, así no se pierden en el chat.

## 5. Configuración que hace el líder (una sola vez)

- **Proteger `main`:** Settings → Branches → *Add branch ruleset* (o *Add rule*) → rama `main` → activar **Require a pull request before merging**. Así nadie puede cambiar la versión principal por error.
- **Tablero de tareas (opcional):** pestaña *Projects* → *New project* → plantilla *Board*. Cada tarea de la sección 2 puede ser una tarjeta en *Por hacer → En curso → En revisión → Hecho*.

## 6. Plan hacia la presentación final

| Etapa | Qué se hace | Responsable |
|---|---|---|
| 1. Arranque | Repartir roles, invitar, cada quien abre la app y lee su parte | Líder |
| 2. Pruebas y documentos | Cada rol completa sus tareas de la sección 2 | Todos |
| 3. Integración | El líder une los cambios y verifica que la app funcione completa | Líder |
| 4. Presentación | Cada rol entrega sus diapositivas; el líder arma la presentación | Todos |
| 5. Ensayo general | Ensayo completo, máximo 20 minutos | Todos |
| 6. Día de la clase | Restablecer datos de ejemplo antes de empezar; llevar `dist/motorepuestos-oriente.html` como respaldo sin internet | Líder |

**Orden sugerido de la exposición (≈ 20 min):** 1 Introducción (2 min) → 5 Requisitos (3) → 6 Arquitectura (3) → 2 Demo ventas (3) → 3 Demo despachos (3) → 4 Demo inventario (2) → 7 Calidad (3) → 1 Cierre (1).
