# Plan de calidad del producto (ISO/IEC 25000 · ISO/IEC 25010)

## 1. Modelo de calidad aplicado

La familia ISO/IEC 25000 (SQuaRE) organiza la calidad del producto de software en ocho características (ISO/IEC 25010). Para cada una se define qué se espera del sistema, cómo se cumple y cómo se mide.

| Característica | Subcaracterísticas priorizadas | Cómo se cumple | Métrica | Meta |
|---|---|---|---|---|
| Adecuación funcional | Completitud, corrección | 21 RF trazados a los casos de uso; reglas de cálculo puras y probadas | % de RF implementados y aprobados | 100 % |
| Eficiencia de desempeño | Comportamiento temporal | Un solo archivo, sin librerías JS; render por plantillas | Tiempo de cambio de pantalla | < 100 ms (prototipo) |
| Compatibilidad | Interoperabilidad | Respaldo JSON, SQL estándar, CUFE | Respaldos restaurados sin pérdida | 100 % |
| Usabilidad | Accesibilidad, protección contra errores, aprendizaje | WCAG 2.1 AA, validación en línea, mensajes accionables | Errores de accesibilidad automáticos (axe/Lighthouse) | 0 críticos; puntaje ≥ 95 |
| Fiabilidad | Recuperabilidad, tolerancia a fallos | Respaldo/restauración; si falla el almacenamiento sigue en memoria | Pérdida de datos en pruebas de recuperación | 0 |
| Seguridad | Integridad, no repudio, responsabilidad, confidencialidad | RBAC, segregación de funciones, bitácora SHA-256, CUFE | Acciones sin rastro en bitácora | 0 |
| Mantenibilidad | Modularidad, capacidad de prueba | Datos / reglas / vistas / acciones separados | Funciones de negocio con prueba unitaria | ≥ 80 % |
| Portabilidad | Adaptabilidad, instalabilidad | Diseño adaptable; publicación copiando un archivo | Anchos soportados sin scroll horizontal | 360 px a 1920 px |

## 2. Atributos de calidad (modelo visto en clase)

| Atributo | Evidencia |
|---|---|
| Funcionalidad: adecuación, precisión, seguridad, cumplimiento | Cálculo de IVA, cupo y costeo; permisos; normas DIAN, PUC, Ley 1581 |
| Fiabilidad: tolerancia a fallos, recuperación | Respaldo JSON; validaciones que impiden estados inválidos |
| Usabilidad: comprensibilidad, aprendizaje | Pantallas con explicación del caso de uso, tareas pendientes por rol |
| Eficiencia: uso de recursos | Sin dependencias, ~150 KB en total |
| Mantenibilidad: analizable, modificable, estable, fácil de probar | Código organizado por secciones; reglas en funciones puras |
| Portabilidad: adaptabilidad, coexistencia | Navegador en cualquier dispositivo; no requiere instalación |

## 3. Aseguramiento de calidad en el proceso

- **Prevención de defectos:** requisitos escritos con criterios de aceptación (SRS) antes de programar; la regla del 67 % (dos tercios de los errores nacen en análisis y diseño) justifica invertir en el SRS y el modelo de datos.
- **Revisiones técnicas:** cada cambio del grupo pasa por una revisión de otro integrante (pull request) antes de unirse a la rama principal.
- **Inspecciones:** lista de chequeo de accesibilidad y seguridad (sección 5) aplicada a cada pantalla nueva.
- **Control estadístico:** se registra número de defectos encontrados por fase para calcular la eficacia de remoción de defectos (DRE = E / (E + D)).

## 4. Plan de pruebas

| ID | Caso de prueba | Pasos | Resultado esperado | Estado |
|---|---|---|---|---|
| CP-01 | Registrar factura válida | Logística: cliente, destino, 2 líneas, guardar | Factura MRO-XXXXXX en estado Pendiente; bitácora con "Registrar factura" y "Validar cupo" | Aprobado |
| CP-02 | Cupo insuficiente | Factura que supera el disponible | Mensaje "Cupo insuficiente…", no se guarda | Aprobado |
| CP-03 | Existencia insuficiente | Cantidad mayor que la existencia de la sucursal | Mensaje con existencia actual, no se guarda | Aprobado |
| CP-04 | Segregación de funciones | El mismo usuario registra y trata de autorizar | Botón deshabilitado y aviso | Aprobado |
| CP-05 | Autorizar | Gerente autoriza | CUFE, asiento cuadrado, inventario descontado, certificados | Aprobado |
| CP-06 | Rechazar sin motivo | Motivo con menos de 10 caracteres | No permite rechazar | Aprobado |
| CP-07 | Remisión sin guía | Transportadora externa sin guía | Mensaje "Escribe el número de guía…" | Aprobado |
| CP-08 | Conteo ciego incorrecto | Contar 11 donde se facturaron 10 | Bloquea despacho y crea novedad | Aprobado |
| CP-09 | Entrega con faltante | Recibido menor que despachado | Estado "Con novedad" y novedad abierta | Aprobado |
| CP-10 | Integridad de bitácora | Simular alteración y verificar | "Cadena rota en el registro #N" | Aprobado |
| CP-11 | Certificado falso | Verificar un código inventado | "Código no encontrado" | Aprobado |
| CP-12 | Permisos | Auditor intenta abrir Administración | La sección no aparece ni es accesible | Aprobado |
| CP-13 | Adaptabilidad | Ancho 390 px | Sin desplazamiento horizontal | Aprobado |
| CP-14 | Accesibilidad por teclado | Recorrer el flujo de factura solo con Tab/Enter | Todo alcanzable con foco visible | Pendiente (prueba manual del grupo) |

Los casos CP-01 a CP-13 se ejecutaron con una prueba automatizada en navegador (Playwright) sobre el prototipo.

## 5. Lista de chequeo para cada pantalla nueva

- [ ] Todos los campos tienen `label` asociado.
- [ ] Los errores se muestran junto al campo y se anuncian (`role="alert"`).
- [ ] Contraste de texto ≥ 4.5:1 en tema claro y oscuro.
- [ ] Se puede usar solo con teclado.
- [ ] La acción queda registrada en la bitácora con `audit(...)`.
- [ ] La acción verifica el permiso del rol (`P("permiso")`).
- [ ] Funciona a 360 px de ancho.
- [ ] Ningún dato del usuario se inserta sin escapar (`esc(...)`).
