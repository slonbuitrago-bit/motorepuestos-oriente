# Guía de la presentación, diapositiva por diapositiva

**Motorepuestos del Oriente · Sustentación final · Ingeniería de Software III**

Para cada diapositiva verás quién la presenta, qué significa cada cosa que aparece, qué decir y qué podría preguntar el profesor. No hay que memorizarla palabra por palabra: lo importante es entender la idea y contarla con tus palabras.

## Cómo se reparte la exposición (15 minutos + 5 de preguntas)

| Bloque | Diapositivas | Tiempo | Presenta |
|---|---|---|---|
| 1. Introducción y cliente | 1, 2 y 3 | 2 min | Líder (1) y Rol 5 · Requisitos (2 y 3) |
| 2. Arquitectura y ágil | 4, 5 y 6 | 3 min | Rol 6 · Arquitectura (4 y 6) y Líder (5) |
| 3. Demo en vivo | 7 | 5 min | Roles 2, 3 y 4 |
| 4. Auditoría de QA | 8 y 9 | 3 min | Rol 7 · Calidad |
| 5. Conclusiones | 10 | 2 min | Líder |

**La idea que une toda la presentación:** el cliente tenía problemas de control (facturas a mano, fraude en despachos). Convertimos esos problemas en requisitos, los organizamos con Scrum, construimos una aplicación web en capas y comprobamos con pruebas que funciona. Cada diapositiva es un paso de ese camino.

---

## Diapositiva 1 · Portada

**Presenta:** Líder · **Tiempo:** 20 segundos

**Qué hay en la diapositiva**

- **Logo de Motorepuestos del Oriente:** es la empresa cliente, un mayorista de repuestos para motos de Rionegro, Antioquia.
- **Frase principal: «Cada repuesto facturado, despachado y entregado sin perderle el rastro».** Resume el propósito del sistema: seguir cada repuesto desde que se vende hasta que llega al cliente.
- **Subtítulo:** «Sistema de gestión comercial para Motorepuestos del Oriente».
- **Nombres del equipo, docente, universidad y fecha.**

**Qué decir**

> «Buenas tardes. Somos [nombres]. Construimos un sistema web para Motorepuestos del Oriente, un mayorista de repuestos de motos en Rionegro. El sistema controla la facturación y evita el fraude en los despachos: cada repuesto queda rastreado desde que se factura hasta que se entrega.»

---

## Diapositiva 2 · El cliente: facturas a mano y despachos incompletos

**Presenta:** Rol 5 · Requisitos · **Tiempo:** 50 segundos

**Qué hay en la diapositiva**

Cuatro tarjetas numeradas con los **problemas que contó el cliente en la entrevista**:

1. **Facturas manuales:** el número, la fecha, el valor y el cupo se escribían a mano y nadie los controlaba. Cualquiera podía facturar a un cliente que ya debía demasiado.
2. **Fraude en despachos:** a los clientes les llegaban repuestos de más o de menos de lo que se facturó.
3. **Malas indicaciones de envío:** direcciones y contactos incompletos, así que los pedidos se perdían o llegaban tarde.
4. **Sin garantía verificable:** necesitaban certificados de garantía y facturación electrónica (la que exige la DIAN).

Recuadro negro **«Nuestra tarjeta B»**: en la consultoría cruzada (Actividad 2) nos tocó la tarjeta confidencial B, con cuatro exigencias del cliente:

- **B1 · Proceso ISO 9000:** documentar el procedimiento de desarrollo según la norma de calidad ISO 9000.
- **B2 · Facturas manuales autorizadas por gerentes:** una factura hecha a mano no se contabiliza hasta que un gerente la apruebe.
- **B3 · Listas país → estado → ciudad:** al elegir el país, solo aparecen sus estados; al elegir el estado, solo sus ciudades.
- **B4 · Ley de discapacidad:** la aplicación debe poder usarla una persona con discapacidad (Ley 1618 de 2013).

**Frase de abajo:** «La frase “facturas manuales no asociadas a pedidos” reveló un módulo de pedidos que no estaba en el diseño inicial». Al decir «no asociadas a pedidos», el cliente dejó ver que también existen facturas que **sí** vienen de un pedido. Por eso tuvimos que crear el módulo de pedidos de venta, que no habíamos planeado.

**Qué decir**

> «En la entrevista el cliente nos contó cuatro problemas: [recorrer las cuatro tarjetas]. Además, en la consultoría cruzada nos tocó la tarjeta B, con cuatro exigencias: [B1 a B4]. Un hallazgo importante: cuando el cliente dijo “facturas manuales no asociadas a pedidos”, entendimos que también existían los pedidos, y eso cambió el diseño a mitad del proyecto.»

**Posible pregunta:** *¿Por qué ese cambio fue importante?*

> Porque obligó a agregar un módulo completo. Fue la razón para trabajar con Scrum: permite cambiar el alcance sin rehacer todo (lo explicamos en la diapositiva 5).

---

## Diapositiva 3 · 10 requisitos clasificados por tipo

**Presenta:** Rol 5 · Requisitos · **Tiempo:** 50 segundos

**Qué hay en la diapositiva**

Tres columnas, una por cada tipo de requisito:

**Funcionales (5): lo que el sistema hace.**

- **Correos por pedido, factura, despacho y pago:** el cliente recibe un correo en cada paso (tarjeta A1).
- **Facturas manuales con autorización:** exigencia B2.
- **Listas filtradas de estado y ciudad:** exigencia B3.
- **Conteo ciego contra el fraude:** quien alista el pedido no ve cuántas unidades se facturaron; las cuenta y el sistema compara. Si no coincide, el pedido no sale.
- **Instrucciones de envío completas:** dirección, contacto y transportadora obligatorias.

**No funcionales (3): qué tan bien lo hace.**

- **Rendimiento: 100.000 usuarios:** soportar muchas personas conectadas al mismo tiempo (A2).
- **Usabilidad: diseño responsive:** se adapta a computador, tableta y celular (A3).
- **Fiabilidad: al menos 99,5 % disponible:** el sistema puede estar caído como máximo 0,5 % del tiempo (A4).

**Restricciones (2): condiciones externas que no se negocian.**

- **Proceso: ISO 9000:** cómo debe hacerse el desarrollo (B1).
- **Legal: ley de discapacidad:** lo exige la ley (B4).

**Qué decir**

> «Los clasificamos en tres tipos. Los funcionales dicen qué hace el sistema; los no funcionales, qué tan bien lo hace (rapidez, disponibilidad, adaptación al celular), y las restricciones son condiciones externas, como una norma o una ley. Son diez: ocho salen de las tarjetas A y B y dos de la entrevista (el conteo ciego y las instrucciones de envío).»

**Posible pregunta:** *¿Cuál es la diferencia entre no funcional y restricción?*

> El no funcional mide la calidad del sistema y se puede negociar (por ejemplo, 99 % o 99,5 %). La restricción viene de afuera y no se negocia: la ley o la norma se cumplen o no.

---

## Diapositiva 4 · Las reglas de negocio viven en las clases

**Presenta:** Rol 6 · Arquitectura · **Tiempo:** 1 minuto

**Qué hay en la diapositiva**

- **A la izquierda, el diagrama de clases (UML):** cada caja es una clase: un «molde» con datos (atributos) y acciones (métodos). Salieron de los sustantivos de los requisitos: factura, pedido, cliente, ciudad, remisión, notificación.
- **A la derecha, cuatro reglas de negocio** y en qué método de qué clase viven:
  - **`Factura.autorizar(gerente)`:** solo un gerente **distinto** de quien registró la factura puede autorizarla. Al autorizar, `contabilizar()` crea el asiento contable. Así se cumple B2 y se evita que alguien se apruebe a sí mismo.
  - **`PedidoVenta.facturar()`:** la factura que viene de un pedido se contabiliza sola, sin esperar autorización, porque el pedido ya fue validado.
  - **`Pais ◆ Departamento ◆ Ciudad`:** el rombo negro (◆) en UML significa **composición**: el departamento pertenece a un país y la ciudad a un departamento. Si no existe el país, no existe su ciudad. Así solo se ofrecen destinos registrados (B3).
  - **`Remision.verificarConteo()`:** la remisión es el documento con el que sale la mercancía. Si el conteo ciego no coincide con lo facturado, el pedido no sale de bodega.

**Qué decir**

> «Con el análisis orientado a objetos, los sustantivos de los requisitos se convirtieron en clases. Lo importante es que las reglas del negocio quedaron dentro de las clases. Por ejemplo, una factura manual solo la puede autorizar un gerente distinto del que la registró, y solo después de autorizarla se contabiliza. Y la composición País, Departamento, Ciudad garantiza que solo se escojan destinos que existen.»

**Posible pregunta:** *¿Qué significa el rombo negro?*

> Composición: la parte no existe sin el todo. Una ciudad siempre pertenece a un departamento.

---

## Diapositiva 5 · Backlog gestionado en Trello con Scrum

**Presenta:** Líder (Scrum Master) · **Tiempo:** 1 minuto

**Qué hay en la diapositiva**

**Fila de arriba: las cinco columnas del tablero de Trello y cuántas tarjetas tiene cada una.**

- **Product Backlog (6):** lo que falta por hacer. Incluye HU-24 (100.000 usuarios), HU-25 (disponibilidad del 99,5 %) y tareas de backend, que necesitan un servidor real.
- **Sprint Backlog (0):** lo planeado para el sprint actual. Está en cero porque el sprint ya se cerró.
- **En Desarrollo (1):** la preparación de la demo para el cliente.
- **En Pruebas (QA) (0):** nada esperando pruebas.
- **Completado (26):** 24 historias de usuario entregadas, más las tarjetas de pruebas y la «Definición de Terminado».

**Fila de abajo: los cuatro sprints** (un sprint es un ciclo corto de trabajo con un objetivo):

- **Sprint 1:** facturas manuales, autorización, listas y accesibilidad. Va primero porque es la tarjeta B, lo que pidió nuestro cliente (B2, B3, B4).
- **Sprint 2:** pedidos, correos, remisiones y conteo ciego (A1 y el control del fraude).
- **Sprint 3:** inventario, importaciones desde Panamá y trazabilidad.
- **Sprint 4:** estadísticas, carga y disponibilidad (A2 y A4).

**Frase de abajo: «¿Por qué no cascada?».** En cascada se hace todo en orden (análisis, diseño, código, pruebas) y no se vuelve atrás. Como el requisito de los pedidos apareció a mitad del proyecto, en cascada habría que rehacer el análisis y el diseño. En Scrum, el cambio simplemente entra al siguiente sprint.

**Términos clave**

- **Historia de usuario:** un requisito escrito como «Como [rol], quiero [algo], para [beneficio]». Tenemos 26.
- **MoSCoW:** la técnica para priorizar: *Must* (debe), *Should* (debería), *Could* (podría), *Won't* (no por ahora).

**Qué decir**

> «Organizamos el trabajo con Scrum en Trello. Escribimos 26 historias de usuario, las priorizamos con MoSCoW y las repartimos en cuatro sprints, empezando por lo que pidió nuestro cliente. Entregamos 24 de 26; las dos que faltan necesitan un servidor real. Elegimos Scrum y no cascada porque los requisitos cambiaron a mitad del camino.»

**Posible pregunta:** *¿Por qué quedaron dos historias sin terminar?*

> Porque piden 100.000 usuarios y 99,5 % de disponibilidad, y eso solo se puede lograr con un servidor en producción. En el prototipo quedaron diseñadas y documentadas, pero no implementadas.

---

## Diapositiva 6 · 27 módulos en capas, listos para un servidor

**Presenta:** Rol 6 · Arquitectura · **Tiempo:** 1 minuto

**Qué hay en la diapositiva**

**A la izquierda, el diagrama de arquitectura en capas.** Cada capa solo habla con la de abajo (dependencias en un solo sentido):

- **Usuario · navegador web:** desde computador, tableta o celular.
- **Presentación (Vista):** las 13 pantallas que ve el usuario, con accesibilidad y navegación.
- **Control (Controlador):** recibe los clics y formularios y decide qué hacer.
- **Dominio (Modelo):** las reglas del negocio: facturar, autorizar, contabilizar, validar el cupo, enviar correos.
- **Datos (Modelo):** guarda la información y la bitácora protegida con SHA-256.
- **Núcleo:** utilidades y el control de roles y permisos.
- **Líneas continuas = el prototipo de hoy:** los datos se guardan en el almacenamiento del navegador.
- **Líneas punteadas = la producción propuesta:** una API REST en Node.js, una base de datos PostgreSQL, un servicio de correo y un proveedor tecnológico para la factura electrónica de la DIAN.

**A la derecha, la tecnología de cada parte:**

- **Frontend:** HTML5, CSS3 y JavaScript sin frameworks (no usamos React ni Angular, solo el lenguaje base).
- **Backend:** hoy, la capa de dominio; en producción, Node.js con Express.
- **Base de datos:** PostgreSQL, con 29 tablas y 5 triggers ya diseñados (el archivo `modelo-datos.sql`).
- **Calidad:** node:test, Playwright y axe-core, las herramientas de las pruebas automáticas.

**Términos clave**

- **MVC (Modelo-Vista-Controlador):** separar lo que se ve (vista), lo que decide (controlador) y los datos y reglas (modelo).
- **SPA:** aplicación de una sola página; cambia de pantalla sin recargar.
- **SHA-256:** una «huella digital» matemática. Cada registro de la bitácora guarda la huella del anterior; si alguien cambia uno, la cadena se rompe y se detecta.
- **API REST:** el punto por donde el navegador le pide datos al servidor.

**Qué decir**

> «El código está en 27 módulos organizados en capas. La vista nunca toca los datos directamente y cada capa solo depende de la de abajo. La ventaja: para pasar a producción no hay que reescribir las pantallas; solo se cambia la capa de datos para que hable con un servidor y una base de datos PostgreSQL, que ya está diseñada.»

**Posible pregunta:** *¿Por qué no usaron un framework como React?*

> Para que funcione sin instalar nada (se abre con doble clic, incluso sin internet) y para mostrar la arquitectura MVC hecha por nosotros, sin que un framework la esconda.

---

## Diapositiva 7 · Del pedido a la entrega, en vivo (DEMO)

**Presentan:** Roles 2, 3 y 4 · **Tiempo:** 5 minutos · Guion detallado: `docs/final/guion-demo.md`

**Qué hay en la diapositiva**

Los cinco pasos de la demo, cada uno con el usuario que lo hace:

1. **Camila · Logística:** registra una factura manual. Las listas se filtran por país y el sistema bloquea la factura si supera el cupo del cliente.
2. **Andrés · Gerente:** autoriza la factura. Se genera el **CUFE** (el código único de la factura electrónica), el **asiento contable** y los **certificados de garantía**.
3. **Julián · Despachos:** hace el conteo ciego. Si cuenta mal, el sistema abre una **novedad** y no deja salir el pedido; con el conteo correcto, se sella y sale.
4. **Mateo · Auditor:** rastrea la factura y comprueba que nadie alteró la bitácora.
5. **Accesibilidad:** texto al 130 %, alto contraste y versión para celular.

**A la derecha:** un **código QR** para que el profesor y los compañeros abran la app en su celular, y la contraseña: **demo2026**.

**Antes de empezar (obligatorio):** entrar como Laura (Administración), ir a Datos y respaldo y dar clic en **Restablecer datos de ejemplo**. Si no hay internet, abrir `dist/motorepuestos-oriente.html`.

**Qué decir al empezar**

> «Vamos a seguir una venta real de principio a fin: un cliente de San Vicente pide llantas. Primero entramos con usuario y contraseña; para no perder tiempo, después cambiaremos de usuario con el modo de demostración.»

**Posible pregunta:** *¿Qué pasa si alguien adivina la contraseña?*

> Después de 3 intentos fallidos la cuenta se bloquea 5 minutos, y el intento queda registrado en la trazabilidad.

---

## Diapositiva 8 · 66 pruebas por niveles del Modelo en V

**Presenta:** Rol 7 · Calidad · **Tiempo:** 1 minuto y 30 segundos

**Qué hay en la diapositiva**

**A la izquierda, el Modelo en V.** Une cada etapa del desarrollo (rama izquierda, en azul) con la prueba que la comprueba (rama derecha, en verde):

- **Requisitos del cliente** ↔ **Pruebas de aceptación (UAT):** ¿el cliente recibe lo que pidió?
- **Diseño funcional** ↔ **Pruebas de sistema:** ¿la aplicación completa funciona de extremo a extremo?
- **Diseño técnico** ↔ **Pruebas de integración:** ¿las piezas funcionan bien juntas?
- **Diseño de componentes** ↔ **Pruebas unitarias:** ¿cada función por separado da el resultado correcto?
- **Abajo, en el vértice: Codificación**, donde se escribe el código.
- **Verificación** (rama izquierda): «¿lo construimos bien?». **Validación** (rama derecha): «¿construimos lo correcto?».

**A la derecha, cuántas pruebas hay de cada nivel:**

- **17 unitarias:** prueban funciones aisladas, como el cálculo del IVA o del cupo. Son de **caja blanca**: se escriben conociendo el código por dentro.
- **10 de integración:** **bottom-up** (de abajo hacia arriba): primero los datos, luego el dominio, luego la contabilidad y al final los correos.
- **23 de sistema:** recorren la aplicación completa en un navegador real, como lo haría un usuario.
- **16 complementarias:** seguridad (OWASP), carga, estrés, adaptación a celular y accesibilidad.
- Total: 17 + 10 + 23 + 16 = **66**.

**Recuadro OWASP.** OWASP Top 10 es la lista de los riesgos de seguridad más comunes en aplicaciones web. Probamos cuatro:

- **A01 · Control de acceso:** un usuario no puede entrar a lo que su rol no le permite.
- **A03 · Inyección y XSS:** si alguien escribe código malicioso en un formulario, el sistema lo muestra como texto y no lo ejecuta.
- **A07 · Autenticación:** contraseña cifrada y bloqueo por intentos.
- **A08 · Integridad de datos:** la bitácora encadenada detecta cualquier alteración.

Además: robustez, **carga** (5.000 facturas extra y la lista responde en menos de 1 segundo), adaptación a celular y **accesibilidad con 0 violaciones** según la herramienta axe-core. **Resultado: pasan las 66 pruebas.**

**Qué decir**

> «Organizamos las pruebas con el Modelo en V: cada nivel de diseño tiene su prueba. Tenemos 66 pruebas automáticas y todas pasan. Además probamos la seguridad con OWASP: por ejemplo, si alguien escribe código malicioso en el nombre de un cliente, el sistema lo neutraliza.»

**Posible pregunta:** *¿Cuál es la diferencia entre verificar y validar?*

> Verificar es revisar que construimos bien según el diseño. Validar es comprobar que construimos lo que el cliente necesitaba.

---

## Diapositiva 9 · Bugs detectados y cómo se resolvieron

**Presenta:** Rol 7 · Calidad · **Tiempo:** 1 minuto y 30 segundos

**Qué hay en la diapositiva**

**A la izquierda: «Reportados por el grupo auditor» (AUD-01 a AUD-03).** Dicen «Pendiente» porque el otro grupo nos audita durante la sustentación. Si ya nos entregaron su reporte, se cuenta aquí qué encontraron y qué hicimos; si no, se explica que se registrará en esas casillas.

**A la derecha: «Encontrados por nuestras pruebas · 10 de 10 corregidos».** Se muestran cinco ejemplos, cada uno con la prueba que lo encontró:

- **Cantidad decimal aceptada y truncada · robustez:** el sistema aceptaba «2,5» llantas y lo cortaba a 2. Ahora solo acepta números enteros.
- **Desborde en celulares de 360 px · regresión:** un botón que agregamos para la demo rompió el diseño en celulares pequeños, y la prueba automática lo detectó. Una **prueba de regresión** revisa que lo que ya funcionaba no se dañe con un cambio nuevo.
- **Contraste insuficiente · auditoría WCAG:** un texto del menú no se leía bien para personas con baja visión. WCAG es la norma internacional de accesibilidad web.
- **Regla de negocio en la capa de vista · revisión estática:** el cálculo del costo de importación estaba en una pantalla y no en el dominio, lo que rompía la arquitectura. La **revisión estática** se hace leyendo el código, sin ejecutarlo.
- **Consecutivos de factura fuera de orden · sistema:** los números de factura se saltaban; lo detectó una prueba de sistema.

El detalle de los 10 defectos está en `docs/final/registro-defectos.md`.

**Qué decir**

> «Las pruebas encontraron 10 defectos reales y los corregimos todos. El más interesante fue de regresión: un botón nuevo dañó el diseño en celulares pequeños y la prueba lo detectó antes de que llegara al usuario. Una limitación que reconocemos: la contraseña se valida en el navegador; en producción iría en el servidor, cifrada con bcrypt.»

**Posible pregunta:** *¿Por qué es importante la prueba de regresión?*

> Porque un cambio nuevo puede dañar algo que ya funcionaba. Volver a correr todas las pruebas después de cada cambio lo detecta.

---

## Diapositiva 10 · Conclusiones

**Presenta:** Líder · **Tiempo:** 2 minutos

**Qué hay en la diapositiva**

Título: **«Los requisitos dijeron qué construir; las pruebas confirmaron que quedó bien construido».** Es la reflexión que pide el profesor: el impacto de la ingeniería de requisitos y de las pruebas en el éxito del software.

Cuatro conclusiones:

- **Una sola frase del cliente cambió el alcance; preguntar bien evita rehacer.** La frase «no asociadas a pedidos» reveló un módulo completo.
- **Scrum absorbió ese cambio sin tirar lo construido.** El módulo nuevo entró en el sprint siguiente.
- **Las pruebas encontraron 10 defectos que la revisión visual no vio.** Sin pruebas automáticas, esos errores habrían llegado al cliente.
- **Siete personas, roles claros y una sola versión oficial en GitHub.** Cada integrante tenía su rol y todo el código quedó en un mismo repositorio.

Al pie: los enlaces de la app y del código. A la derecha: **«¡Gracias! · Preguntas»**.

**Qué decir**

> «Aprendimos dos cosas. Primero, que entender bien los requisitos define qué se construye: una sola frase del cliente cambió el proyecto. Segundo, que las pruebas confirman que se construyó bien: encontraron diez errores que a simple vista no veíamos. Gracias; quedamos atentos a sus preguntas.»

---

## Glosario rápido

| Término | Qué significa en una frase |
|---|---|
| Requisito funcional | Lo que el sistema hace |
| Requisito no funcional | Qué tan bien lo hace (rapidez, disponibilidad, usabilidad) |
| Restricción | Condición externa que no se negocia (ley o norma) |
| Historia de usuario | Requisito escrito como «Como…, quiero…, para…» |
| Sprint | Ciclo corto de trabajo con un objetivo |
| MoSCoW | Priorizar en Must, Should, Could, Won't |
| UML | Lenguaje de diagramas para modelar software |
| MVC | Separar vista, controlador y modelo |
| Conteo ciego | Contar sin ver cuánto se facturó, para evitar el fraude |
| Remisión | Documento con el que sale la mercancía |
| CUFE | Código único de la factura electrónica de la DIAN |
| Asiento contable | Registro de la venta en la contabilidad |
| SHA-256 | Huella digital que permite detectar si un dato fue alterado |
| Modelo en V | Une cada etapa del desarrollo con su prueba |
| Caja blanca | Prueba hecha conociendo el código por dentro |
| Bottom-up | Integrar de las piezas más básicas hacia arriba |
| Regresión | Volver a probar para que lo viejo no se dañe con lo nuevo |
| OWASP | Lista de los riesgos de seguridad web más comunes |
| WCAG | Norma internacional de accesibilidad web |
| Responsive | Diseño que se adapta a computador, tableta y celular |
