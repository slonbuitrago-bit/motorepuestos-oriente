# Guía rápida de la presentación

**Motorepuestos del Oriente · Sustentación final · 15 min + 5 de preguntas**

**La idea de toda la presentación:** el cliente tenía problemas de control → los volvimos requisitos → los organizamos con Scrum → construimos una app en capas → las pruebas confirmaron que funciona.

| Bloque | Diapositivas | Tiempo | Presenta |
|---|---|---|---|
| Introducción y cliente | 1, 2, 3 | 2 min | Líder · Rol 5 |
| Arquitectura y ágil | 4, 5, 6 | 3 min | Rol 6 · Líder |
| Demo en vivo | 7 | 5 min | Roles 2, 3, 4 |
| Pruebas y calidad | 8, 9 | 3 min | Rol 7 |
| Conclusiones | 10 | 2 min | Líder |

---

## 1 · Portada · Líder · 20 s

- **Logo:** la empresa cliente, un mayorista de repuestos para motos en Rionegro.
- **«Cada repuesto facturado, despachado y entregado sin perderle el rastro»:** el sistema sigue cada repuesto desde la venta hasta la entrega.

**Di:** «Somos [nombres]. Hicimos un sistema web que controla la facturación y evita el fraude en los despachos de Motorepuestos del Oriente.»

---

## 2 · El cliente · Rol 5 · 50 s

**Los 4 problemas de la entrevista:**
1. **Facturas manuales:** se hacían a mano, sin control del cupo del cliente.
2. **Fraude en despachos:** llegaban repuestos de más o de menos.
3. **Malas indicaciones de envío:** direcciones y contactos incompletos.
4. **Sin garantía verificable:** faltaban certificados y factura electrónica.

**Tarjeta B (lo que nos pidió el cliente en la consultoría cruzada):**
- **B1 · ISO 9000:** documentar cómo desarrollamos.
- **B2:** una factura manual solo cuenta cuando la aprueba un gerente.
- **B3:** al elegir el país solo salen sus estados, y luego solo sus ciudades.
- **B4:** que la pueda usar una persona con discapacidad (Ley 1618).

**Frase de abajo:** «no asociadas a pedidos» reveló que también había pedidos, y tuvimos que crear ese módulo.

**Di:** «El cliente tenía cuatro problemas y su tarjeta B pedía cuatro cosas. Una frase suya nos hizo agregar el módulo de pedidos a mitad del proyecto.»

---

## 3 · Requisitos · Rol 5 · 50 s

- **Funcionales (5) = lo que el sistema hace:** correos al cliente, facturas con autorización, listas filtradas, conteo ciego e instrucciones de envío.
- **No funcionales (3) = qué tan bien lo hace:** 100.000 usuarios (rendimiento), se adapta al celular (usabilidad), 99,5 % del tiempo disponible (fiabilidad).
- **Restricciones (2) = reglas externas que no se negocian:** la norma ISO 9000 y la ley de discapacidad.
- **Conteo ciego:** quien empaca no ve cuánto se facturó; cuenta, y si no coincide, el pedido no sale.

**Di:** «Son 10 requisitos: 8 de las tarjetas A y B y 2 de la entrevista.»

**Si preguntan** *¿no funcional o restricción?* → El no funcional mide calidad y se negocia; la restricción es una ley o norma y no se negocia.

---

## 4 · Diagrama de clases · Rol 6 · 1 min

- **Diagrama de clases (UML):** cada caja es un elemento del negocio, con sus datos y lo que puede hacer.
- **`Factura.autorizar(gerente)`:** solo la aprueba un gerente distinto de quien la hizo; después se contabiliza.
- **`PedidoVenta.facturar()`:** la factura que viene de un pedido se contabiliza sola, sin autorización.
- **`País ◆ Departamento ◆ Ciudad`:** el rombo negro (composición) significa que la ciudad pertenece a un departamento; solo se eligen destinos que existen.
- **`Remision.verificarConteo()`:** la remisión es el documento de salida; si el conteo no cuadra, no sale.

**Di:** «Las reglas del negocio viven dentro de las clases; por eso nadie puede saltárselas.»

---

## 5 · Scrum y Trello · Líder · 1 min

- **Columnas de Trello:** Product Backlog = pendiente (6) · Sprint Backlog = lo del sprint actual (0, ya cerró) · En Desarrollo (1) · En Pruebas (0) · Completado (26).
- **Sprint:** un ciclo corto de trabajo. Hicimos 4, y el primero fue lo que pidió nuestro cliente.
- **Historia de usuario:** un requisito escrito como «Como…, quiero…, para…». Hicimos 26 y entregamos 24.
- **MoSCoW:** la forma de priorizar: debe, debería, podría, no por ahora.
- **¿Por qué no cascada?** En cascada no se vuelve atrás; en Scrum el cambio de los pedidos entró al siguiente sprint.

**Si preguntan** *¿por qué faltan 2 historias?* → Piden 100.000 usuarios y 99,5 % de disponibilidad, y eso necesita un servidor real.

---

## 6 · Arquitectura · Rol 6 · 1 min

- **Capas:** Vista (13 pantallas) → Control (recibe los clics) → Dominio (reglas del negocio) → Datos → Núcleo (permisos). Cada capa solo usa la de abajo.
- **MVC:** separar lo que se ve, lo que decide y los datos.
- **Líneas continuas = hoy:** los datos se guardan en el navegador.
- **Líneas punteadas = producción:** servidor Node.js, base de datos PostgreSQL (29 tablas ya diseñadas), servicio de correo y DIAN.
- **SHA-256:** una huella digital; si alguien altera un registro, se detecta.
- **Sin frameworks:** abre con doble clic, sin instalar nada.

**Di:** «Para pasar a producción solo se cambia la capa de datos; las pantallas no se tocan.»

---

## 7 · Demo · Roles 2, 3, 4 · 5 min

Antes de empezar: Laura → Administración → **Restablecer datos de ejemplo**. Guion completo: `guion-demo.md`.

1. **Camila (Logística):** factura manual; el sistema la bloquea si supera el cupo.
2. **Andrés (Gerente):** autoriza → se crean el **CUFE** (código de la factura electrónica), el **asiento contable** (registro en contabilidad) y los certificados de garantía.
3. **Julián (Despachos):** conteo ciego; si cuenta mal, el pedido no sale y se abre una **novedad**.
4. **Mateo (Auditor):** rastrea la factura y ve que nadie alteró el registro.
5. **Accesibilidad:** texto más grande, alto contraste y celular.

**QR:** abre la app en el celular. Contraseña: **demo2026**.

**Si preguntan** *¿y si adivinan la contraseña?* → A los 3 intentos fallidos la cuenta se bloquea 5 minutos.

---

## 8 · 66 pruebas · Rol 7 · 1 min 30 s

- **Modelo en V:** cada etapa del desarrollo (izquierda) tiene la prueba que la comprueba (derecha).
- **Verificar** = ¿lo hicimos bien? · **Validar** = ¿hicimos lo que el cliente pedía?
- **17 unitarias:** cada función por separado (por ejemplo, el cálculo del IVA).
- **10 de integración:** las piezas juntas, de la más básica hacia arriba (**bottom-up**).
- **23 de sistema:** la app completa, como la usaría una persona.
- **16 complementarias:** seguridad, carga, celular y accesibilidad.
- **OWASP:** los riesgos de seguridad web más comunes. Probamos cuatro:
  - **A01:** nadie entra a lo que su rol no permite.
  - **A03:** si alguien escribe código malicioso en un formulario, no se ejecuta.
  - **A07:** contraseña protegida y bloqueo por intentos.
  - **A08:** se detecta si alguien altera un registro.
- **Resultado:** pasan las 66.

---

## 9 · Bugs · Rol 7 · 1 min 30 s

- **AUD-01 a 03 (Pendiente):** los fallos que reporte el grupo auditor durante la sustentación.
- **10 de 10 corregidos:** errores que encontraron nuestras pruebas. Los cinco de la diapositiva:
  - **Decimal truncado:** aceptaba «2,5 llantas» y lo cortaba a 2; ahora solo acepta enteros.
  - **Desborde en celular · regresión:** un botón nuevo dañó el diseño en celulares pequeños. La **regresión** comprueba que lo nuevo no rompa lo viejo.
  - **Contraste · WCAG:** un texto no se leía bien con baja visión. WCAG es la norma de accesibilidad web.
  - **Regla en la vista · revisión estática:** un cálculo estaba en la pantalla y no en el dominio; se encontró leyendo el código.
  - **Consecutivos fuera de orden:** los números de factura se saltaban.

**Di:** «Las pruebas encontraron 10 errores reales y los corregimos todos.»

---

## 10 · Conclusiones · Líder · 2 min

- **Requisitos:** una sola frase del cliente cambió el alcance; preguntar bien evita rehacer.
- **Scrum:** absorbió ese cambio sin botar lo hecho.
- **Pruebas:** encontraron 10 errores que a simple vista no se veían.
- **Equipo:** 7 personas, roles claros y una sola versión en GitHub.

**Di:** «Los requisitos nos dijeron qué construir y las pruebas confirmaron que quedó bien construido. Gracias, ¿preguntas?»
