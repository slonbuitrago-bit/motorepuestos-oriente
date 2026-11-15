# Guion de la demo en vivo (5 minutos)

**Historia que se cuenta:** un cliente de San Vicente pide llantas. Seguimos esa venta de principio a fin: se factura, el gerente la autoriza, bodega la cuenta y la despacha, y todo queda registrado.

## Antes de la clase (no cuenta en los 5 minutos)
1. Abrir https://slonbuitrago-bit.github.io/motorepuestos-oriente/
2. Entrar como **Laura Gómez** → **Administración** → pestaña **Datos y respaldo** → **Restablecer datos de ejemplo** → **Sí, restablecer**.
3. Menú lateral, abajo: **Cerrar sesión**. Dejar la pantalla de ingreso abierta.
4. Plan B sin internet: abrir `dist/motorepuestos-oriente.html` del repositorio.

## 1. Ingreso por roles (30 s)
| Haz | Di |
|---|---|
| Clic en la tarjeta **Camila Ospina · Logística** → **Ingresar** | «Cada usuario tiene un rol; Camila es de Logística y solo ve lo que le corresponde.» |
| Señala el **Tablero** | «Al entrar ve sus pendientes y los indicadores de la empresa.» |

## 2. Factura manual con validaciones (75 s)
| Haz | Di |
|---|---|
| Menú **Facturas** → botón **Registrar factura manual** | «Una venta que no vino de un pedido: esta necesita autorización del gerente.» |
| En **País** elige **Panamá** y abre **Departamento / estado** | «Las listas se filtran por país: solo aparecen los estados de Panamá.» |
| En **Cliente** elige **Repuestos San Vicente** | «Al elegir el cliente, el destino se llena solo y vemos su cupo: 1,78 millones disponibles.» |
| En la línea 1 elige **LLA-90-90-18 · Llanta trasera 90/90-18**, cantidad **12** → **Validar y enviar a autorización** | «Pide 12 llantas, unos 2,4 millones…» |
| Señala el mensaje rojo | «…el sistema no deja facturar por encima del cupo.» |
| Cambia la cantidad a **2** → **Validar y enviar a autorización** | «Con 2 llantas sí cabe: queda **pendiente** y todavía **no se contabiliza**.» |

## 3. El gerente autoriza (45 s)
| Haz | Di |
|---|---|
| Menú lateral, abajo: **Cambiar de usuario** → **Andrés Restrepo · Gerente** | «Ahora soy el gerente.» |
| Menú **Autorizaciones** → la tarjeta de **Repuestos San Vicente** (la última) → **Autorizar** | «Al autorizar se genera el código de la factura electrónica, el asiento contable y los certificados de garantía, y se le avisa al cliente por correo. Quien registró una factura no puede autorizarla.» |

## 4. Despacho con control antifraude (90 s)
| Haz | Di |
|---|---|
| **Cambiar de usuario** → **Julián Zuluaga · Despachos** → menú **Despachos** | «Ahora bodega.» |
| En la fila de **Repuestos San Vicente** → **Crear remisión** | «Las instrucciones de envío vienen del cliente.» |
| **Transportadora**: **Coordinadora** · **Número de guía**: **123456** → **Crear remisión** | «La guía es obligatoria si no es flota propia.» |
| En **Cantidad contada** escribe **3** → **Verificar conteo** | «Conteo ciego: quien alista no ve cuánto se facturó. Si cuenta 3 en lugar de 2, el sistema **bloquea la salida** y registra una novedad. Así se evita que lleguen repuestos de más o de menos.» |
| Escribe **2** → **Verificar conteo** → **Registrar salida de bodega** | «Con el conteo correcto se sella y sale.» |

## 5. Trazabilidad y aviso al cliente (45 s)
| Haz | Di |
|---|---|
| **Cambiar de usuario** → **Mateo Ríos · Auditor** → menú **Notificaciones** | «El cliente recibió correo de su factura y de su despacho.» |
| Menú **Facturas** → clic en el número de la primera factura (la de San Vicente) → pestaña **Trazabilidad** | «Todo queda registrado: quién la hizo, quién la autorizó, el conteo errado y la salida. Ese registro no se puede alterar.» |
| Cerrar la ventana (✕) | |

## 6. Accesibilidad (15 s)
| Haz | Di |
|---|---|
| Botón **Accesibilidad** → **A++** → marca **Alto contraste** | «Cumple la ley de discapacidad: texto más grande, alto contraste y uso con teclado. También funciona en el celular.» |

**Total: unos 5 minutos.**

## Si algo sale mal
- **No aparece la tarjeta o la fila de San Vicente:** no se restablecieron los datos. Haz el paso 2 de «Antes de la clase».
- **Te equivocaste en un paso:** sigue adelante; cada paso funciona por separado.
- **Sin internet:** usa `dist/motorepuestos-oriente.html`.
