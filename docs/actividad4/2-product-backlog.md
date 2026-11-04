# Fase 2 · Metodología, historias de usuario y Product Backlog

**Metodología elegida: Scrum** (justificación en [`4-justificacion-metodologia.md`](4-justificacion-metodologia.md)).

## Cómo se priorizó

- **Primero, la tarjeta de nuestro cliente (B):** autorización de facturas manuales (B2), listas de preselección (B3) y accesibilidad (B4) van en el Sprint 1. B1 (procedimiento ISO 9000) se aplica desde el día uno en la *Definición de Terminado*.
- Luego los requisitos que dependen de esa base (pedidos, despachos, notificaciones) y al final los de soporte (estadísticas, pruebas de carga).
- **MoSCoW:** *Must* = imprescindible · *Should* = importante · *Could* = deseable.
- **Puntos de historia** (Fibonacci 1, 2, 3, 5, 8): esfuerzo relativo.
- **Sprints de 2 semanas.** Velocidad estimada del equipo: unos 35 puntos por sprint (7 integrantes).

> Si su cliente fue el de la **tarjeta A**, basta con subir al Sprint 1 las historias HU-13 (correos), HU-24 (carga) y HU-25 (disponibilidad), y pasar las de B3 al Sprint 2.

## Product Backlog

| ID | Historia de usuario | Req. | Prioridad | Puntos | Sprint |
|---|---|---|---|---|---|
| HU-01 | Como **empleado**, quiero iniciar sesión con mi usuario para acceder solo a las funciones de mi rol. | Seguridad | Must | 3 | 1 |
| HU-02 | Como **administrador**, quiero crear usuarios y asignarles un rol para controlar quién hace qué. | Seguridad | Must | 5 | 1 |
| HU-03 | Como **administrador**, quiero registrar países, departamentos y ciudades para que solo se usen destinos válidos. | B3 | Must | 3 | 1 |
| HU-04 | Como **logística**, quiero elegir país, luego departamento y luego ciudad en listas filtradas para no escribir destinos con errores. | B3 | Must | 3 | 1 |
| HU-05 | Como **logística**, quiero registrar una factura manual sin pedido para atender ventas que no pasaron por pedido. | B2 | Must | 5 | 1 |
| HU-06 | Como **logística**, quiero que el sistema valide el cupo del cliente al facturar para no venderle más de lo permitido. | B2 | Must | 3 | 1 |
| HU-07 | Como **gerente**, quiero ver las facturas manuales pendientes para revisarlas a tiempo. | B2 | Must | 2 | 1 |
| HU-08 | Como **gerente**, quiero autorizar una factura manual para que se contabilice y pueda despacharse. | B2 | Must | 5 | 1 |
| HU-09 | Como **gerente**, quiero rechazar una factura con un motivo para que logística sepa qué corregir. | B2 | Must | 2 | 1 |
| HU-10 | Como **usuario con discapacidad visual**, quiero ajustar el tamaño del texto y el contraste y usar el sistema con teclado y lector de pantalla para trabajar en igualdad de condiciones. | B4 | Must | 5 | 1 |
| HU-11 | Como **logística**, quiero registrar el pedido de venta del cliente para dejar constancia de lo que pidió. | B2 | Must | 3 | 2 |
| HU-12 | Como **logística**, quiero facturar un pedido con un clic para que quede contabilizado sin esperar autorización. | B2 | Must | 3 | 2 |
| HU-13 | Como **cliente**, quiero recibir un correo cuando se registra mi pedido, se emite mi factura, sale el despacho y se registra mi pago para estar enterado. | A1 | Must | 5 | 2 |
| HU-14 | Como **despachos**, quiero crear la remisión con instrucciones de envío completas para que el transportador no se equivoque. | Entrevista | Must | 3 | 2 |
| HU-15 | Como **despachos**, quiero contar los repuestos sin ver la cantidad facturada (conteo ciego) para evitar que salgan de más o de menos. | Entrevista (fraude) | Must | 5 | 2 |
| HU-16 | Como **despachos**, quiero registrar lo que el cliente recibió para detectar faltantes y abrir una novedad. | Entrevista (fraude) | Should | 5 | 2 |
| HU-17 | Como **gerente**, quiero registrar el pago de una factura para liberar el cupo del cliente. | A1 | Should | 2 | 2 |
| HU-18 | Como **bodega**, quiero ver las existencias por sucursal y las alertas de stock mínimo para reponer a tiempo. | Inventario | Should | 5 | 3 |
| HU-19 | Como **bodega**, quiero registrar ajustes y traslados con motivo para que el inventario cuadre. | Inventario | Should | 3 | 3 |
| HU-20 | Como **bodega**, quiero gestionar las importaciones desde Panamá y su costo nacionalizado para conocer el costo real. | Entrevista | Should | 8 | 3 |
| HU-21 | Como **cliente**, quiero verificar el certificado de garantía de un repuesto para confirmar que es auténtico. | Entrevista | Could | 3 | 3 |
| HU-22 | Como **auditor**, quiero consultar una bitácora que no se pueda alterar para rastrear quién hizo cada cosa. | B1 · fraude | Should | 5 | 3 |
| HU-23 | Como **gerente**, quiero un tablero con ventas, entregas y stock para tomar decisiones. | Valor agregado | Could | 5 | 4 |
| HU-24 | Como **empresa**, quiero que el sistema atienda 100.000 usuarios concurrentes para crecer sin caídas. | A2 | Should | 8 | 4 |
| HU-25 | Como **empresa**, quiero que el sistema no esté caído más del 0,5 % del tiempo para no frenar la operación. | A4 | Should | 5 | 4 |
| HU-26 | Como **empresa**, quiero una auditoría formal de accesibilidad para cumplir la ley de discapacidad. | B4 | Must | 3 | 4 |

**Total:** 26 historias · 107 puntos · 4 sprints (36 + 26 + 24 + 21).

## Definición de Terminado (DoD)

Una historia está terminada solo si:
1. Cumple sus criterios de aceptación.
2. Funciona en celular, tableta y computador (360 px a escritorio). **(A3)**
3. Se puede usar con teclado, todos los campos tienen etiqueta y el contraste es suficiente. **(B4)**
4. Cada acción que cambia datos queda en la bitácora.
5. Otro integrante revisó el cambio (*pull request* aprobado) antes de unirlo. **(B1, ISO 9000)**
6. Se actualizó la documentación afectada.

## Criterios de aceptación del Sprint 1

| HU | Criterios (Dado… cuando… entonces…) |
|---|---|
| HU-01 | Dado un usuario activo, cuando ingresa con clave correcta, entonces ve solo el menú de su rol. Con clave incorrecta ve un mensaje y no entra. |
| HU-02 | Dado el administrador, cuando crea un usuario con rol, entonces este puede ingresar. Un usuario desactivado no puede ingresar, pero su historial se conserva. |
| HU-03 | Cuando el administrador registra una ciudad con código DANE en un departamento, entonces aparece en las listas de ese departamento. No se aceptan códigos repetidos. |
| HU-04 | Al cambiar de país, la lista de departamentos solo muestra los de ese país y la ciudad se vacía. No existe campo de texto libre para la ciudad. |
| HU-05 | La factura manual recibe consecutivo automático, queda en estado Pendiente y **no** genera asiento contable. |
| HU-06 | Si el total supera el cupo disponible, el sistema no guarda la factura y muestra cuánto excede. |
| HU-07 | El gerente ve las facturas pendientes con cliente, total, cupo y quién la registró. |
| HU-08 | Al autorizar se genera el asiento (débitos = créditos) y se descuenta el inventario. Quien registró la factura **no** puede autorizarla. |
| HU-09 | El rechazo exige un motivo de al menos 10 caracteres, visible para logística. |
| HU-10 | Texto ajustable al 130 % sin pérdida de contenido, modo de alto contraste, todo el flujo operable con teclado y Lighthouse de accesibilidad ≥ 95. |
