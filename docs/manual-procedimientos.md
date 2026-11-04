# Manual de procedimientos de desarrollo de software

**Código:** MP-DS-01 · **Versión:** 1.0 · **Norma de referencia:** ISO 9001:2015 (familia ISO 9000), con la guía ISO/IEC/IEEE 90003 para software
**Proyecto:** Sistema Motorepuestos del Oriente · **Asignatura:** Ingeniería de Software III

Este manual responde al requisito B1: *"el procedimiento de desarrollo de software a usar debe estar definido explícitamente en manuales de procedimientos y cumplir con los estándares ISO 9000"*.

## 1. Objetivo y alcance
Definir cómo el equipo planea, diseña, construye, verifica, entrega y mantiene el sistema, de modo que cada paso deje evidencia revisable (información documentada, ISO 9001 §7.5). Aplica a todo cambio del sistema, desde un requisito nuevo hasta la corrección de un error.

## 2. Roles

| Rol | Responsabilidad |
|---|---|
| Líder de proyecto | Planea, asigna tareas, aprueba entregas |
| Analista de requisitos | Levanta, redacta y valida requisitos con el cliente |
| Desarrollador | Diseña y programa; hace pruebas unitarias |
| Revisor | Revisa el código de otro integrante antes de integrarlo |
| Responsable de calidad | Ejecuta el plan de pruebas y la auditoría interna |
| Cliente (Motorepuestos del Oriente) | Aprueba requisitos y acepta las entregas |

## 3. Proceso (ISO 9001 §8.1 y §8.3 Diseño y desarrollo)

| Fase | Entradas | Actividades | Salidas (registros) | Aprobación |
|---|---|---|---|---|
| 1. Planificación (§8.3.2) | Solicitud del cliente | Definir alcance, cronograma, riesgos, roles | Plan del proyecto | Líder + cliente |
| 2. Requisitos (§8.3.3) | Entrevistas, documentos del cliente, normas | Levantar, clasificar (funcional, no funcional, restricción), priorizar | SRS IEEE 830 (`SRS-IEEE830.md`), matriz de clasificación (`actividad2-consultoria.md`) | Cliente firma el SRS |
| 3. Diseño (§8.3.4 controles) | SRS aprobado | Casos de uso, modelo de datos, arquitectura, prototipo | Diagramas, `modelo-datos.sql`, prototipo | Revisión técnica del equipo |
| 4. Construcción | Diseño aprobado | Programar en ramas; prueba unitaria; revisión por pares | Código en Git, *pull requests* revisados | Revisor aprueba el PR |
| 5. Verificación (§8.3.4) | Incremento integrado | Ejecutar plan de pruebas (`calidad-ISO25010.md`, `actividad2-consultoria.md`) | Informe de pruebas con resultados | Responsable de calidad |
| 6. Validación (§8.3.4) | Incremento verificado | Demostración al cliente con el recorrido sugerido del README | Acta de aceptación | Cliente |
| 7. Entrega (§8.3.5) | Acta de aceptación | Publicar la versión, etiquetar en Git, manual de usuario | Versión etiquetada (`v1.0`), notas de versión | Líder |
| 8. Mantenimiento | Solicitudes de cambio, incidentes | Control de cambios (sección 4) | Registro de cambios | Según impacto |

## 4. Control de cambios (ISO 9001 §8.3.6)
1. Toda solicitud se registra como *issue* con: quién la pide, qué cambia, por qué.
2. El analista evalúa impacto en requisitos, diseño, costo y tiempo.
3. El líder aprueba o rechaza; los cambios que afectan el alcance los aprueba el cliente.
4. El cambio se implementa en una rama propia y sigue las fases 4 a 7.
5. El SRS y los diagramas se actualizan en el mismo *pull request* que el código.

## 5. Control de la información documentada (§7.5)
- Todos los documentos viven en el repositorio Git, en la carpeta `docs/`: Git registra autor, fecha y cambio de cada versión.
- Cada documento indica código, versión y estado.
- Nadie modifica `main` directamente; todo entra por *pull request* revisado.

## 6. No conformidades y mejora (§10.2 y §10.3)
- Un defecto encontrado en pruebas o por el cliente se registra como no conformidad con: descripción, severidad, causa raíz y acción correctiva.
- Se mide la **eficacia de remoción de defectos**: DRE = E / (E + D), donde E son defectos hallados antes de la entrega y D después. Meta: DRE ≥ 85 %.
- Al cerrar cada entrega se hace una retrospectiva y se ajusta este manual si es necesario.

## 7. Lista de chequeo de auditoría interna

| # | Pregunta | Evidencia | Cumple |
|---|---|---|---|
| 1 | ¿Existe plan del proyecto aprobado? | Plan del proyecto | ☐ |
| 2 | ¿El SRS está aprobado por el cliente? | SRS con firma o acta | ☐ |
| 3 | ¿Cada requisito está clasificado por tipo? | Matriz de clasificación | ☐ |
| 4 | ¿Cada requisito tiene al menos un caso de prueba? | Plan de pruebas | ☐ |
| 5 | ¿Todo el código entró por *pull request* revisado? | Historial de Git | ☐ |
| 6 | ¿Hay informe de pruebas de la versión entregada? | Informe de pruebas | ☐ |
| 7 | ¿Existe acta de aceptación del cliente? | Acta | ☐ |
| 8 | ¿Los cambios tienen solicitud, evaluación y aprobación? | *Issues* | ☐ |
| 9 | ¿Las no conformidades tienen acción correctiva? | Registro de no conformidades | ☐ |
| 10 | ¿Se cumplen los requisitos legales (Ley 1581, Ley 1618, DIAN)? | Lista de chequeo legal y de accesibilidad | ☐ |
