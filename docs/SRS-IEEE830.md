# Especificación de Requisitos de Software (IEEE 830-1998)
## Sistema de Gestión Comercial — Motorepuestos del Oriente S.A.S.

| Campo | Valor |
|---|---|
| Proyecto | Sistema Motorepuestos del Oriente |
| Asignatura | Ingeniería de Software III |
| Versión del documento | 1.0 |
| Fecha | Noviembre de 2026 |
| Estado | Prototipo funcional para validación con el cliente |

---

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requisitos del sistema que reemplaza las facturas manuales y el control informal de envíos de Motorepuestos del Oriente. Lo usan el cliente (para validar que el sistema responde a sus necesidades), el equipo de desarrollo (para construirlo) y el equipo de pruebas (para verificarlo).

### 1.2 Alcance
El sistema cubre: facturación manual con autorización, validación de cupo, contabilización automática, remisiones y despachos con control antifraude, inventario por sucursal, importaciones desde Panamá, certificados de garantía, trazabilidad inalterable, estadísticas y administración de usuarios y catálogos.

Queda fuera de este alcance la transmisión real de la factura electrónica a la DIAN, que se hace mediante un proveedor tecnológico autorizado. El prototipo genera la estructura y el CUFE en ambiente de pruebas.

### 1.3 Definiciones, acrónimos y abreviaturas
| Término | Significado |
|---|---|
| CUFE | Código Único de Factura Electrónica (huella criptográfica de la factura) |
| DANE | Departamento Administrativo Nacional de Estadística; codifica municipios |
| DIM | Declaración de Importación |
| FOB / CIF | Valor de la mercancía en origen / valor con flete y seguro |
| TRM | Tasa Representativa del Mercado (COP por USD) |
| PUC | Plan Único de Cuentas (Decreto 2650 de 1993) |
| Cupo | Crédito máximo que la empresa otorga a un cliente |
| Remisión | Documento que acompaña la mercancía despachada |
| Conteo ciego | Verificación en la que quien cuenta no conoce la cantidad esperada |
| Novedad | Diferencia registrada entre lo facturado, lo contado o lo recibido |
| RBAC | Control de acceso basado en roles |

### 1.4 Referencias
- IEEE Std 830-1998, *Recommended Practice for Software Requirements Specifications*.
- ISO/IEC 25010:2011, *Systems and software Quality Requirements and Evaluation (SQuaRE)*.
- ISO 9001:2015, *Sistemas de gestión de la calidad*, numerales 7.5 y 8.5.2.
- WCAG 2.1 (W3C) y NTC 5854 (accesibilidad web en Colombia).
- Ley 1581 de 2012 (protección de datos personales).
- DIAN, Resolución 000165 de 2023 (factura electrónica de venta).
- Levantamiento de información: entrevista a Motorepuestos del Oriente (documento del curso).

### 1.5 Visión general
La sección 2 describe el contexto del producto y sus usuarios. La sección 3 detalla los requisitos funcionales, no funcionales y de interfaz.

---

## 2. Descripción general

### 2.1 Perspectiva del producto
Motorepuestos del Oriente es un mayorista de repuestos de motos con sede en Rionegro (Antioquia) que vende a almacenes y talleres de otros municipios. Tiene un convenio de 12 años con un proveedor en Panamá (Zona Libre de Colón).

**Situación actual (problemas detectados en la entrevista):**
1. Las facturas se hacen a mano en Logística y pasan a Despachos con número, fecha, valor y cupo escritos sin control.
2. Se presentaron fraudes: a los clientes llegan repuestos de más o de menos respecto al pedido.
3. Las indicaciones de envío son incompletas o erróneas.
4. Se necesita respaldar la calidad con certificados que garanticen el funcionamiento.
5. Se requiere facturación electrónica y un flujo de facturas alineado con ISO 9000.

### 2.2 Funciones del producto
Ver el diagrama de casos de uso entregado y su ampliación:

```
Logística ──── Registrar factura manual ──<<include>>── Seleccionar país, estado y ciudad
                                        └─<<include>>── Validar cupo del cliente
Gerente ────── Consultar facturas pendientes
          └─── Autorizar factura manual ──<<include>>── Contabilizar factura autorizada
                      ^ <<extend>> Rechazar factura manual
Despachos ──── Registrar despacho ──<<include>>── Registrar instrucciones de envío
          (ampliado) Verificar alistamiento (conteo ciego) · Registrar entrega · Gestionar novedades
Bodega ─────── (nuevo) Gestionar inventario · Gestionar importaciones
Administrador ─ Gestionar ciudades y municipios · Gestionar usuarios y permisos
Auditor ────── (nuevo) Consultar trazabilidad · Verificar integridad
Cliente ext. ── (nuevo) Verificar certificado de garantía
```

### 2.3 Características de los usuarios
| Rol | Descripción | Formación esperada |
|---|---|---|
| Logística | Toma pedidos y registra facturas | Bachiller o técnico; uso básico de computador |
| Gerente | Autoriza facturas, aprueba cupos, resuelve novedades | Profesional administrativo |
| Despachos | Alista, verifica, despacha y registra entregas | Bachiller; puede usar tableta o celular en bodega |
| Bodega | Inventario, traslados, importaciones | Técnico en logística |
| Administrador | Usuarios, permisos y catálogos | Técnico o profesional en sistemas |
| Auditor | Revisa trazabilidad (revisor fiscal, calidad) | Profesional contable o de calidad |
| Cliente externo | Verifica certificados | Sin requisitos |

Algunos usuarios pueden tener discapacidad visual, motriz o cognitiva; el sistema debe ser usable por todos (RNF-USA).

### 2.4 Restricciones generales
- Normativa colombiana de facturación electrónica, contabilidad (PUC) y protección de datos.
- Debe funcionar en navegadores actuales en computador, tableta y celular.
- El prototipo funciona sin servidor; la versión de producción usará PostgreSQL (ver `modelo-datos.sql`).

### 2.5 Suposiciones y dependencias
- La empresa contratará un proveedor tecnológico autorizado por la DIAN para transmitir las facturas.
- Las transportadoras entregan número de guía al recibir la mercancía.
- Los códigos DANE de municipios se mantienen actualizados por el Administrador.

---

## 3. Requisitos específicos

### 3.1 Requisitos funcionales

| ID | Nombre | Descripción | Prioridad | Actor |
|---|---|---|---|---|
| RF-01 | Registrar factura manual | Registrar cliente, sucursal, destino y líneas de repuestos. El sistema asigna el consecutivo de la resolución DIAN y calcula subtotal, IVA 19 % y total. | Alta | Logística |
| RF-02 | Seleccionar país, estado y ciudad | Selección en cascada desde los catálogos; al elegir el cliente se precarga su municipio. | Alta | Logística |
| RF-03 | Validar cupo del cliente | Bloquear el registro si el total supera el cupo disponible (cupo − facturas pendientes y autorizadas sin pago). Se valida otra vez al autorizar. | Alta | Sistema |
| RF-04 | Consultar facturas pendientes | Listar facturas por autorizar con cupo, existencias y quién las registró. | Alta | Gerente |
| RF-05 | Autorizar factura | Generar CUFE, descontar inventario, emitir certificados y contabilizar. Quien registró no puede autorizar. | Alta | Gerente |
| RF-06 | Rechazar factura | Exige motivo de al menos 10 caracteres visible para Logística. | Alta | Gerente |
| RF-07 | Contabilizar factura autorizada | Asiento automático: 130505 / 413515 / 240805 y costo 613515 / 143501. Débitos = créditos. | Alta | Sistema |
| RF-08 | Registrar despacho | Crear una remisión por cada factura autorizada. | Alta | Despachos |
| RF-09 | Registrar instrucciones de envío | Dirección, punto de referencia, quién recibe, teléfono, transportadora, guía (obligatoria si no es flota propia), franja e instrucciones. | Alta | Despachos |
| RF-10 | Verificar alistamiento | Conteo ciego por referencia; si no coincide, bloquea la salida y registra novedad. Si coincide, sella la remisión. | Alta | Despachos |
| RF-11 | Registrar entrega | Registrar quién recibe y cantidades recibidas; las diferencias abren novedad. | Alta | Despachos |
| RF-12 | Gestionar novedades | Cerrar novedades con resolución obligatoria. | Media | Gerente, Despachos |
| RF-13 | Gestionar inventario | Existencias por sucursal, kárdex, ajustes con motivo, traslados, nuevas referencias, alertas de mínimo. | Alta | Bodega |
| RF-14 | Gestionar importaciones | Órdenes al proveedor, estados (orden → tránsito → aduana → nacionalizada → recibida), costeo FOB/CIF/arancel y costo promedio ponderado al recibir. | Media | Bodega |
| RF-15 | Gestionar clientes y cupos | Alta y edición de clientes con NIT validado y autorización de datos; solo Gerencia modifica cupos. | Alta | Logística, Gerente |
| RF-16 | Certificados de garantía | Emitir un código por referencia con garantía al autorizar; verificación pública sin usuario. | Media | Sistema, Cliente |
| RF-17 | Gestionar ciudades y municipios | Alta de municipios con código DANE. | Media | Administrador |
| RF-18 | Gestionar usuarios y permisos | Crear y desactivar usuarios; matriz de permisos por rol. | Alta | Administrador |
| RF-19 | Trazabilidad | Bitácora de todas las acciones con usuario, rol y hora; rastreo por documento; verificación de integridad. | Alta | Auditor, Gerente |
| RF-20 | Estadísticas | Ventas por mes y municipio, referencias más vendidas, entregas conformes, stock bajo, pendientes por rol. | Media | Todos |
| RF-21 | Registrar pagos | Marcar factura pagada y liberar cupo. | Media | Gerente |

### 3.2 Requisitos no funcionales (clasificados por ISO/IEC 25010)

| ID | Característica | Requisito | Criterio de aceptación |
|---|---|---|---|
| RNF-01 | Eficiencia de desempeño | Cada pantalla responde rápido con la carga esperada. | < 1 s con 10.000 facturas en producción; < 100 ms en el prototipo. |
| RNF-02 | Seguridad – confidencialidad | Acceso por usuario y contraseña; permisos por rol. | Un rol no ve ni ejecuta acciones fuera de su matriz. |
| RNF-03 | Seguridad – integridad | Bitácora encadenada con SHA-256; documentos autorizados inmutables. | Alterar un registro hace fallar la verificación. |
| RNF-04 | Seguridad – no repudio | Toda acción guarda usuario, rol y fecha. | 100 % de las acciones de negocio aparecen en la bitácora. |
| RNF-05 | Seguridad – responsabilidad | Segregación de funciones: quien registra no autoriza. | Botón deshabilitado y restricción CHECK en la base de datos. |
| RNF-06 | Usabilidad – accesibilidad | Cumplir WCAG 2.1 nivel AA. | Contraste ≥ 4.5:1, navegación por teclado, etiquetas, texto ajustable al 130 %, lectura en voz alta. |
| RNF-07 | Usabilidad – protección contra errores | Validación antes de guardar con mensajes que dicen cómo corregir. | Ningún formulario guarda datos incompletos o inconsistentes. |
| RNF-08 | Usabilidad – aprendizaje | Un usuario nuevo completa su flujo principal sin capacitación formal. | Prueba con 3 usuarios: ≤ 10 min por flujo. |
| RNF-09 | Fiabilidad – recuperabilidad | Respaldo y restauración de datos. | Restaurar un respaldo deja el sistema en el mismo estado. |
| RNF-10 | Portabilidad – adaptabilidad | Diseño adaptable a celular, tableta y computador. | Sin desplazamiento horizontal a 360 px de ancho. |
| RNF-11 | Mantenibilidad – modularidad | Separación de datos, reglas de negocio, vistas y acciones. | Cambiar una regla (ej. IVA) toca una sola constante. |
| RNF-12 | Compatibilidad | Exportar datos en JSON; modelo SQL estándar. | El respaldo se importa en otra instalación. |
| RNF-13 | Cumplimiento legal | Ley 1581 de 2012: autorización de tratamiento de datos. | No se registra un cliente sin autorización. |

### 3.3 Interfaces externas
- **Usuario:** aplicación web adaptable, tema claro y oscuro, panel de accesibilidad.
- **DIAN (producción):** API del proveedor tecnológico para transmitir la factura en XML UBL 2.1.
- **Transportadoras (futuro):** consulta de guías.
- **Base de datos:** PostgreSQL 15+.

### 3.4 Reglas de negocio
| ID | Regla |
|---|---|
| RN-01 | IVA general de repuestos: 19 %. |
| RN-02 | Cupo comprometido = facturas Pendientes + Autorizadas no pagadas. |
| RN-03 | Una factura solo puede tener una remisión. |
| RN-04 | La remisión no sale de bodega sin conteo conforme (sello). |
| RN-05 | El inventario se descuenta al autorizar la factura, nunca puede quedar negativo. |
| RN-06 | El costo de las importaciones recibidas actualiza el costo promedio ponderado. |
| RN-07 | Los usuarios y documentos no se eliminan; se desactivan o cambian de estado. |
