# Justificación de la metodología: Scrum frente a cascada

**Proyecto:** Sistema Motorepuestos del Oriente · **Actividad 4** · Ingeniería de Software III

## 1. Metodologías evaluadas

| Criterio | Cascada | **Scrum** | Kanban | XP | Lean |
|---|---|---|---|---|---|
| Entregas | Una sola, al final | Incrementos cada sprint | Flujo continuo | Entregas muy frecuentes | Flujo continuo |
| Cambios en los requisitos | Costosos: hay que volver a fases anteriores | Se absorben en el siguiente sprint | Se absorben en cualquier momento | Se absorben | Se absorben |
| Participación del cliente | Al inicio y al final | En cada Sprint Review | Opcional | Constante (cliente en sitio) | Opcional |
| Estructura y fechas | Rígida | Ritmo fijo (sprints) | Sin iteraciones fijas | Iteraciones cortas | Sin iteraciones fijas |
| Exige al equipo | Documentación completa previa | Roles y eventos definidos | Disciplina para limitar el trabajo en curso | Prácticas técnicas exigentes (programación en pareja, TDD) | Experiencia en mejora de procesos |
| Encaje con este proyecto | Bajo | **Alto** | Medio | Medio | Bajo |

## 2. Por qué no cascada

1. **Los requisitos no se conocieron de una vez.** Primero salieron de la entrevista (fraudes, malas indicaciones de envío) y después de la consultoría cruzada aparecieron requisitos nuevos que cambiaron el diseño: las facturas manuales **no asociadas a pedidos** obligaron a crear un módulo de pedidos que no estaba previsto. En cascada ese cambio habría exigido rehacer análisis y diseño.
2. **El riesgo principal es entender mal al cliente.** La regla del 67 % vista en clase indica que dos tercios de los errores nacen en análisis y diseño. Cascada los descubre al final, cuando corregirlos es más caro. Scrum los descubre en cada Sprint Review.
3. **El cliente necesita ver avances.** Motorepuestos del Oriente tiene problemas urgentes (fraude en despachos y facturas sin control). Con Scrum recibe software funcionando cada dos semanas, empezando por lo más urgente.

## 3. Por qué Scrum y no Kanban

- **Hay una fecha fija** (la presentación final) y Scrum organiza el trabajo en sprints con un objetivo y una fecha, lo que facilita medir el avance.
- **Somos 7 personas**: los roles de Scrum (Product Owner, Scrum Master, equipo) dejan claro quién prioriza, quién coordina y quién construye.
- **La actividad pide validar con el cliente**: la Sprint Review es justamente ese momento.
- **Tomamos lo mejor de Kanban:** el tablero en Trello usa columnas visuales (Por hacer → En progreso → En revisión → Terminado) para ver el flujo de cada sprint.
- **Tomamos prácticas de XP:** historias de usuario con criterios de aceptación y revisión de código por pares antes de integrar.

## 4. Cómo se aplica Scrum en el proyecto

| Elemento Scrum | En el proyecto |
|---|---|
| Product Owner | Integrante de Requisitos: representa al cliente y prioriza el backlog |
| Scrum Master | Líder del equipo: organiza los eventos y quita bloqueos |
| Equipo de desarrollo | 5 integrantes con áreas: ventas, despachos, inventario, arquitectura y calidad |
| Product Backlog | 26 historias de usuario priorizadas con MoSCoW, 107 puntos |
| Sprints | 4 sprints de 2 semanas |
| Sprint 0 | Prototipo funcional que validó los requisitos antes de programar el backend |
| Definición de Terminado | Incluye responsive (A3), accesibilidad (B4) y revisión por pares (B1, ISO 9000) |
| Herramientas | Trello (tablero) y GitHub (código, revisión y control de cambios) |

## 5. Compatibilidad con ISO 9000 (requisito B1)

Scrum no contradice ISO 9001. El estándar exige un proceso **definido, documentado y con evidencia**, no un modelo en cascada. En el proyecto, el manual de procedimientos (`docs/manual-procedimientos.md`) define el proceso, el backlog y el tablero son la planificación documentada (§8.3.2), las Sprint Reviews son la validación con el cliente (§8.3.4) y el historial de *pull requests* en GitHub es la evidencia del control de cambios (§8.3.6).

## 6. Conclusión

Elegimos **Scrum, apoyado en un tablero visual tipo Kanban**, porque los requisitos de Motorepuestos del Oriente cambiaron durante el levantamiento, porque el cliente necesita ver primero lo más urgente y porque el equipo tiene una fecha de entrega fija. Cascada habría postergado hasta el final el descubrimiento de errores de requisitos, que son los más costosos.
