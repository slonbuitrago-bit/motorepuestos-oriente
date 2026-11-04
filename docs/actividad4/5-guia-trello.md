# Guía para montar el tablero en Trello (15 minutos)

Trello crea **varias tarjetas de una vez** si pegas varias líneas en "Añadir una tarjeta". Y lo mismo con los elementos de un checklist. Por eso aquí todo está listo para **copiar y pegar**.

## Paso 1 · Crear el tablero
1. Entra a <https://trello.com> (cuenta gratis) → **Crear tablero**.
2. Nombre: `Motorepuestos del Oriente · Scrum`. Visibilidad: **Público** o **Espacio de trabajo** (para poder compartir el enlace).

## Paso 2 · Crear las listas (columnas)
Crea estas 6 listas, en este orden:

```
Product Backlog
Sprint 1 · Por hacer
En progreso
En revisión
Terminado
Sprints futuros (2, 3 y 4)
```

## Paso 3 · Crear las etiquetas
En una tarjeta cualquiera → **Etiquetas** → crea:

| Color | Nombre |
|---|---|
| Rojo | Must |
| Naranja | Should |
| Amarillo | Could |
| Azul | Frontend |
| Verde | Backend |
| Morado | Base de datos |
| Celeste | Pruebas |

## Paso 4 · Historias del Sprint 1
En la lista **Sprint 1 · Por hacer** → **Añadir una tarjeta** → pega todo este bloque → Trello pregunta si crear 10 tarjetas → **sí**.

```
HU-01 · Iniciar sesión según mi rol (3 pts)
HU-02 · Administrador crea usuarios y asigna roles (5 pts)
HU-03 · Registrar países, departamentos y ciudades (3 pts)
HU-04 · Elegir país → departamento → ciudad en listas filtradas (3 pts)
HU-05 · Registrar factura manual sin pedido (5 pts)
HU-06 · Validar cupo del cliente al facturar (3 pts)
HU-07 · Gerente consulta facturas manuales pendientes (2 pts)
HU-08 · Gerente autoriza factura manual y se contabiliza (5 pts)
HU-09 · Gerente rechaza factura con motivo (2 pts)
HU-10 · Accesibilidad: texto, contraste, teclado y lector de pantalla (5 pts)
```

Ponle a todas la etiqueta **Must**.

## Paso 5 · Tareas técnicas (checklist en cada historia)
Abre cada tarjeta → **Checklist** → nombre `Tareas` → en el primer elemento **pega el bloque** y Trello crea un elemento por línea.

**HU-01**
```
[BD] Tablas usuario, rol, permiso y rol_permiso con datos iniciales · Rol 6
[Backend] POST /api/auth/login con bcrypt y token JWT · Rol 6
[Backend] Middleware que verifica permisos en cada endpoint · Rol 6
[Frontend] Conectar pantalla de ingreso a la API · Rol 1
```
**HU-02**
```
[Backend] Endpoints GET/POST/PATCH /api/usuarios y PUT /api/roles/:id/permisos · Rol 4
[Frontend] Conectar Administración → Usuarios y matriz de permisos · Rol 4
```
**HU-03**
```
[BD] Tablas pais, departamento y ciudad con municipios DANE · Rol 3
[Backend] POST /api/ciudades (validar código único) · Rol 3
```
**HU-04**
```
[Backend] GET /api/paises/:id/departamentos y GET /api/departamentos/:id/ciudades · Rol 3
[Frontend] Listas en cascada en el formulario de factura · Rol 3
```
**HU-05**
```
[BD] Tablas cliente, producto, factura y factura_detalle · Rol 6
[Backend] POST /api/facturas (origen MANUAL, consecutivo, IVA, en transacción) · Rol 2
[Frontend] Formulario de factura manual conectado a la API · Rol 2
```
**HU-06**
```
[BD] Vista v_cupo_cliente (facturas + pedidos comprometidos) · Rol 6
[Backend] Validar cupo y existencias antes de guardar · Rol 2
[Frontend] Mostrar cupo disponible y error de cupo insuficiente · Rol 2
```
**HU-07**
```
[Backend] GET /api/facturas?estado=Pendiente&origen=Manual · Rol 2
[Frontend] Pantalla de Autorizaciones con datos de la API · Rol 2
```
**HU-08**
```
[Backend] POST /api/facturas/:id/autorizar (solo Gerente, distinto de quien registró) · Rol 2
[Backend] Generar asiento contable y descontar inventario · Rol 2
[BD] Trigger que impide contabilizar factura manual no autorizada · Rol 6
```
**HU-09**
```
[Backend] POST /api/facturas/:id/rechazar con motivo obligatorio · Rol 2
[Frontend] Ventana de rechazo con validación del motivo · Rol 2
```
**HU-10**
```
[Frontend] Etiquetas, foco visible y navegación con teclado · Rol 7
[Pruebas] Auditoría Lighthouse y axe, corregir hallazgos · Rol 7
[Pruebas] Prueba con lector de pantalla NVDA · Rol 7
```

Además, crea en **Sprint 1 · Por hacer** estas tarjetas de base técnica (etiquetas Backend / BD / Frontend / Pruebas):
```
Base · Crear proyecto Node.js + Express por capas
Base · Instalar PostgreSQL y ejecutar modelo-datos.sql
Base · Conexión a la BD con variables de entorno
Base · Reemplazar persistencia del prototipo por llamadas a la API
Calidad · Pruebas de criterios de aceptación HU-01 a HU-10
Calidad · Preparar demostración del Sprint Review con el cliente
```

## Paso 6 · Resto del backlog
En **Sprints futuros (2, 3 y 4)** → Añadir una tarjeta → pega:

```
HU-11 · Registrar pedido de venta (3 pts · Sprint 2)
HU-12 · Facturar pedido con contabilización automática (3 pts · Sprint 2)
HU-13 · Correos al cliente: pedido, factura, despacho y pago (5 pts · Sprint 2)
HU-14 · Remisión con instrucciones de envío completas (3 pts · Sprint 2)
HU-15 · Conteo ciego de alistamiento (5 pts · Sprint 2)
HU-16 · Registrar entrega y novedades (5 pts · Sprint 2)
HU-17 · Registrar pago y liberar cupo (2 pts · Sprint 2)
HU-18 · Existencias por sucursal y alertas de mínimo (5 pts · Sprint 3)
HU-19 · Ajustes y traslados de inventario (3 pts · Sprint 3)
HU-20 · Importaciones desde Panamá y costo nacionalizado (8 pts · Sprint 3)
HU-21 · Verificación pública de certificados de garantía (3 pts · Sprint 3)
HU-22 · Bitácora inalterable y rastreo de documentos (5 pts · Sprint 3)
HU-23 · Tablero de estadísticas (5 pts · Sprint 4)
HU-24 · Soportar 100.000 usuarios concurrentes (8 pts · Sprint 4)
HU-25 · Disponibilidad ≥ 99,5 % (5 pts · Sprint 4)
HU-26 · Auditoría formal de accesibilidad (3 pts · Sprint 4)
```

## Paso 7 · Definición de Terminado
En **Terminado** → crea una tarjeta llamada `📌 Definición de Terminado`, ábrela y pega en la descripción:

```
Una historia está terminada solo si:
1. Cumple sus criterios de aceptación.
2. Funciona en celular, tableta y computador (A3).
3. Se usa con teclado, campos con etiqueta y buen contraste (B4).
4. Cada acción que cambia datos queda en la bitácora.
5. Otro integrante revisó el cambio en GitHub antes de unirlo (B1, ISO 9000).
6. Se actualizó la documentación afectada.
```

## Paso 8 · Toques finales
- **Miembros:** botón **Compartir** → invita a los 6 compañeros y asigna cada tarea según su rol.
- **Fechas:** pon la fecha de vencimiento del Sprint 1 (2 semanas) en las historias.
- **Descripción de cada historia (opcional):** copia el texto "Como… quiero… para…" y sus criterios de aceptación desde `2-product-backlog.md`.
- **Mueve 2 o 3 tarjetas** a *En progreso* para que el tablero se vea en uso en la presentación.
- **Enlace para entregar:** botón **Compartir** → **Crear enlace** (o copia la URL del tablero si es público).
