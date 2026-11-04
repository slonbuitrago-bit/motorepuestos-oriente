# Fase 3 · Sprint 1 Planning

**Objetivo del Sprint 1:** *Logística puede registrar facturas manuales con destinos válidos y un gerente las autoriza antes de contabilizarlas, en una aplicación accesible con control de roles.*

**Duración:** 2 semanas · **Historias:** HU-01 a HU-10 · **Puntos:** 36

**Punto de partida:** el prototipo funcional (Sprint 0) ya tiene la interfaz validada. En este sprint se construye el sistema real: **Frontend en HTML/JS** (se reutiliza el prototipo), **Backend en Node.js con Express** y **Base de datos PostgreSQL** (`docs/modelo-datos.sql`).

## Tareas técnicas por historia

Responsable según el rol de `EQUIPO.md`: 1 Líder · 2 Ventas · 3 Despachos · 4 Inventario · 5 Requisitos · 6 Arquitectura · 7 Calidad.

### Tareas transversales (antes de las historias)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-01 | Crear proyecto Node.js + Express con estructura por capas (rutas, controladores, servicios, repositorios) | Backend | 6 | 4 |
| T-02 | Instalar PostgreSQL y ejecutar `modelo-datos.sql`; crear datos semilla | Base de datos | 6 | 3 |
| T-03 | Configurar conexión a la base de datos con variables de entorno | Backend | 6 | 2 |
| T-04 | Reemplazar `js/datos/persistencia.js` del prototipo por llamadas `fetch` a la API | Frontend | 1 | 4 |

### HU-01 · Iniciar sesión (3 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-05 | Tablas `usuario`, `rol`, `permiso`, `rol_permiso` con datos iniciales | Base de datos | 6 | 2 |
| T-06 | Endpoint `POST /api/auth/login` con contraseña cifrada (bcrypt) y token JWT | Backend | 6 | 4 |
| T-07 | Middleware que verifica el permiso en cada endpoint | Backend | 6 | 3 |
| T-08 | Conectar la pantalla de ingreso a la API y guardar el token | Frontend | 1 | 2 |

### HU-02 · Gestionar usuarios y roles (5 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-09 | Endpoints `GET/POST/PATCH /api/usuarios` y `PUT /api/roles/:id/permisos` | Backend | 4 | 5 |
| T-10 | Conectar Administración → Usuarios y matriz de permisos a la API | Frontend | 4 | 3 |

### HU-03 y HU-04 · Catálogo geográfico y listas en cascada (6 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-11 | Tablas `pais`, `departamento`, `ciudad` y carga de municipios con código DANE | Base de datos | 3 | 2 |
| T-12 | Endpoints `GET /api/paises`, `GET /api/paises/:id/departamentos`, `GET /api/departamentos/:id/ciudades`, `POST /api/ciudades` | Backend | 3 | 4 |
| T-13 | Listas en cascada del formulario de factura conectadas a la API | Frontend | 3 | 3 |

### HU-05 y HU-06 · Factura manual con validación de cupo (8 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-14 | Tablas `cliente`, `producto`, `factura`, `factura_detalle` y vista `v_cupo_cliente` | Base de datos | 6 | 3 |
| T-15 | Endpoint `POST /api/facturas` (origen MANUAL): consecutivo, totales, IVA, valida cupo y existencias en una transacción | Backend | 2 | 6 |
| T-16 | Formulario de factura manual conectado a la API, con mensajes de error del servidor | Frontend | 2 | 3 |

### HU-07, HU-08 y HU-09 · Autorizar o rechazar (9 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-17 | Endpoint `GET /api/facturas?estado=Pendiente&origen=Manual` | Backend | 2 | 2 |
| T-18 | Endpoint `POST /api/facturas/:id/autorizar`: verifica rol Gerente y que no sea quien la registró, genera asiento, descuenta inventario | Backend | 2 | 6 |
| T-19 | Endpoint `POST /api/facturas/:id/rechazar` con motivo obligatorio | Backend | 2 | 2 |
| T-20 | Trigger en BD que impide contabilizar una factura manual no autorizada | Base de datos | 6 | 2 |
| T-21 | Pantalla de Autorizaciones conectada a la API | Frontend | 2 | 3 |

### HU-10 · Accesibilidad (5 pts)
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-22 | Revisar etiquetas, foco visible y navegación con teclado en las pantallas del sprint | Frontend | 7 | 3 |
| T-23 | Auditoría con Lighthouse y axe; corregir hallazgos | Pruebas | 7 | 3 |
| T-24 | Prueba con lector de pantalla NVDA en el flujo de factura | Pruebas | 7 | 2 |

### Calidad y validación del sprint
| # | Tarea | Tipo | Resp. | Horas |
|---|---|---|---|---|
| T-25 | Escribir pruebas de los criterios de aceptación HU-01 a HU-10 | Pruebas | 5 | 4 |
| T-26 | Ejecutar las pruebas y registrar resultados en el plan de calidad | Pruebas | 7 | 3 |
| T-27 | Preparar la demostración del Sprint Review con el cliente | Gestión | 5 | 2 |

**Total estimado:** 27 tareas · 85 horas · unas 12 horas por integrante en 2 semanas.

## Eventos Scrum del Sprint 1

| Evento | Cuándo | Duración |
|---|---|---|
| Sprint Planning | Día 1 | 1 h |
| Daily (por WhatsApp: ¿qué hice?, ¿qué haré?, ¿qué me bloquea?) | Cada día hábil | 5 min |
| Sprint Review con el cliente | Último día | 30 min |
| Retrospectiva | Último día | 20 min |

**Roles Scrum:** *Product Owner* = integrante 5 (Requisitos), voz del cliente · *Scrum Master* = integrante 1 (Líder), quita bloqueos y cuida el proceso · *Equipo de desarrollo* = integrantes 2, 3, 4, 6 y 7.
