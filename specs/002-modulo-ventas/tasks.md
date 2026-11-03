# Tareas: Módulo Base de Software de Planificación de Recursos Empresariales (ERP)

**Entrada**: Documentos de diseño desde `/specs/002-modulo-ventas/`
**Prerrequisitos**: plan.md (obligatorio), spec.md (obligatorio para las historias de usuario), research.md, data-model.md, contracts/entity-storage.md, quickstart.md
**Pruebas**: Incluidas porque la constitución exige verificación test-first y el plan confirma pruebas automatizadas para los flujos centrales.

## Formato: `[ID] [P?] [Historia?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Historia]**: Etiqueta de la historia de usuario a la que pertenece la tarea (US1, US2, …). Solo se usa en las fases de historia; Configuración, Fundacional y Pulido no llevan etiqueta.
- Todas las tareas incluyen rutas de archivo exactas.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `src/`, `tests/` en la raíz del repositorio.
- Configuración: `package.json`, `vite.config.js`, `vitest.config.mjs`.
- Pruebas: `tests/unit/`, `tests/integration/`, `tests/setup/`.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Inicializar la estructura del proyecto Vite, las dependencias y el arnés de pruebas.

- [ ] T001 Crear la estructura del proyecto Vite con `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `src/components/` y `tests/`
- [ ] T002 [P] Configurar scripts y dependencias de Vite, Vitest y jsdom en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [ ] T003 [P] Crear el arnés de pruebas con jsdom y aislamiento de `localStorage` por prueba en `tests/setup/jsdom.js`
- [ ] T004 [P] Construir el documento HTML base con raíz de aplicación, montajes de barra superior/barra lateral y contenedores de vista en `index.html`

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Capa de almacenamiento, configuración de módulo, arranque de la aplicación y tokens de diseño de los que dependen todas las historias.

**⚠️ CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T005 Implementar las primitivas de almacenamiento, el CRUD de entidades, la validación de entidades y la búsqueda normalizada en `src/storage.js`
- [ ] T006 Implementar el CRUD de documentos, la validación de documentos y la eliminación en cascada en `src/storage.js`
- [ ] T007 [P] Implementar los valores predeterminados, la normalización, la validación y los ayudantes de etiquetas/campos de la configuración en `src/module-config.js`
- [ ] T008 [P] Crear las variables de tokens de diseño y los estilos base de diseño, formularios y estados de retroalimentación en `src/styles.css`
- [ ] T009 Implementar el arranque de la aplicación, el estado de módulo activo y el montaje de vistas en `src/app.js`

**Punto de control**: La base está lista; las historias de usuario pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Crear y organizar entidades (Prioridad: P1) 🎯 MVP

**Objetivo**: Permitir a los usuarios crear entidades con nombre y código, validarlas y verlas en la lista.

**Prueba Independiente**: Un usuario abre el módulo, crea una entidad con nombre y código y la ve aparecer en la lista; dejar campos obligatorios en blanco impide guardar con una explicación.

### Pruebas para la Historia de Usuario 1

- [ ] T010 [P] [US1] Añadir pruebas unitarias para la validación y creación de entidades en `tests/unit/storage.test.js`
- [ ] T011 [P] [US1] Añadir la prueba de integración del flujo de creación de entidad en `tests/integration/create-entity.test.js`

### Implementación de la Historia de Usuario 1

- [ ] T012 [P] [US1] Crear el componente de formulario de entidad con entradas de campos base y personalizados en `src/components/entity-form.js`
- [ ] T013 [US1] Conectar el envío de creación de entidad, la retroalimentación de validación y el renderizado de la lista en `src/app.js`

**Punto de control**: La Historia de Usuario 1 es completamente funcional y comprobable de forma independiente.

---

## Fase 4: Historia de Usuario 2 - Editar y eliminar entidades (Prioridad: P1)

**Objetivo**: Permitir a los usuarios actualizar o eliminar entidades existentes manteniendo la lista consistente y ágil.

**Prueba Independiente**: Un usuario selecciona una entidad existente, cambia sus datos o la elimina, y la lista refleja el cambio.

### Pruebas para la Historia de Usuario 2

- [ ] T014 [P] [US2] Añadir pruebas unitarias para actualizar y eliminar entidades en `tests/unit/storage.test.js`
- [ ] T015 [P] [US2] Añadir la prueba de integración del flujo de edición y eliminación de entidades en `tests/integration/edit-delete-entity.test.js`

### Implementación de la Historia de Usuario 2

- [ ] T016 [US2] Añadir los controles de edición y eliminación de entidades y la población del formulario en `src/app.js`

**Punto de control**: Las Historias de Usuario 1 y 2 funcionan de forma independiente.

---

## Fase 5: Historia de Usuario 5 - Definir un perfil de configuración del módulo (Prioridad: P1)

**Objetivo**: Introducir `src/module-config.js` para adaptar identidad, terminología, campos y ciclo de vida sin editar el código central, con valores predeterminados seguros e informes claros.

**Prueba Independiente**: Un desarrollador suministra una configuración de Ventas y la aplicación se presenta como tal; al quitarla se restauran los valores predeterminados Entidad/Documento sin errores; una configuración inválida se informa claramente.

### Pruebas para la Historia de Usuario 5

- [ ] T017 [P] [US5] Añadir pruebas unitarias para predeterminados, carga, normalización e informe de configuración inválida en `tests/unit/module-config.test.js`

### Implementación de la Historia de Usuario 5

- [ ] T018 [US5] Implementar el cargador de configuración con predeterminados, validación, informe de errores y `setActiveConfig` en `src/module-config.js`
- [ ] T019 [US5] Cargar la configuración al arrancar y pasarla a todas las vistas en `src/main.js` y `src/app.js`

**Punto de control**: La configuración carga de forma fiable y valida limpiamente, desbloqueando US6, US7, US12 y US13.

---

## Fase 6: Historia de Usuario 6 - Reetiquetar pantallas desde la configuración (Prioridad: P1)

**Objetivo**: Derivar todas las etiquetas visibles de la configuración activa para que los módulos adaptados hablen su idioma de dominio en todo momento.

**Prueba Independiente**: Con Entidad→Cliente y Documento→Pedido de Venta, cada pestaña, botón, etiqueta de formulario, encabezado y mensaje usa los términos mapeados; la navegación no cambia.

### Pruebas para la Historia de Usuario 6

- [ ] T020 [P] [US6] Añadir pruebas de integración que verifiquen las etiquetas configuradas en todas las pantallas en `tests/integration/relabeling.test.js`

### Implementación de la Historia de Usuario 6

- [ ] T021 [US6] Derivar todas las etiquetas visibles de la configuración activa en lugar de texto fijo en `src/app.js` y `src/components/entity-form.js`

**Punto de control**: Un módulo configurado se presenta completamente bajo su propia terminología.

---

## Fase 7: Historia de Usuario 13 - Marco de espacio de trabajo ERP con marca (Prioridad: P1)

**Objetivo**: Envolver cada pantalla en un marco ERP persistente: barra superior con logotipo derivado y nombre del módulo, más barra lateral de módulos con resaltado activo y contracción responsiva.

**Prueba Independiente**: En cada pantalla se ven la barra superior (logotipo SVG derivado + nombre del módulo) y la barra lateral (Panel, Entidades, Documentos, Buscar) con el módulo activo resaltado; la navegación preserva los datos y la barra lateral se contrae en ventanas estrechas.

### Pruebas para la Historia de Usuario 13

- [ ] T022 [P] [US13] Añadir pruebas de integración del marco (logotipo, nombre, botones de barra lateral, resaltado activo, color de acento) en `tests/integration/workspace-shell.test.js`

### Implementación de la Historia de Usuario 13

- [ ] T023 [P] [US13] Crear el componente del marco con monograma SVG derivado, nombre del módulo y botones de barra lateral etiquetados desde la configuración en `src/components/shell.js`
- [ ] T024 [US13] Montar el marco alrededor de todas las vistas y conectar la navegación de módulos con resaltado activo en `src/app.js` e `index.html`
- [ ] T025 [US13] Aplicar `theme.accentColor` como propiedad personalizada de CSS y validarlo con retroceso seguro en `src/module-config.js` y `src/app.js`
- [ ] T026 [P] [US13] Añadir estilos de barra superior, barra lateral, estado activo y contracción a columna de iconos en ventanas estrechas en `src/styles.css`

**Punto de control**: Todas las pantallas se renderizan dentro del marco con marca con navegación por barra lateral sin pérdida de datos.

---

## Fase 8: Historia de Usuario 3 - Panel de inicio con acciones rápidas y estadísticas (Prioridad: P1)

**Objetivo**: Ofrecer un panel ERP de entrada con al menos cuatro acciones rápidas y tarjetas de estadísticas de registros en vivo.

**Prueba Independiente**: La aplicación abre en un panel con acciones para nueva entidad, nuevo documento, gestión de entidades y buscar registros; activarlas aterriza en el lugar correcto listo para introducir datos, y las estadísticas coinciden con los registros almacenados.

### Pruebas para la Historia de Usuario 3

- [ ] T027 [P] [US3] Añadir pruebas de integración para las acciones rápidas del panel y las estadísticas en vivo en `tests/integration/dashboard.test.js`

### Implementación de la Historia de Usuario 3

- [ ] T028 [P] [US3] Crear el componente del panel con los cuatro botones de acción rápida y las tarjetas de estadísticas de entidades/documentos en `src/components/dashboard.js`
- [ ] T029 [US3] Conectar las acciones rápidas con la gestión de entidades, la gestión de documentos (formularios limpios) y la búsqueda enfocada en `src/app.js`
- [ ] T030 [US3] Refrescar los recuentos de entidades/documentos desde el almacenamiento cada vez que se muestra el panel en `src/components/dashboard.js`
- [ ] T031 [P] [US3] Dar estilo al encabezado del panel, la cuadrícula de acciones rápidas y los mosaicos de estadísticas en `src/styles.css`

**Punto de control**: La aplicación abre en un panel funcional; cada tarea ERP clave está a un clic.

---

## Fase 9: Historia de Usuario 4 - Gestionar entidades y documentos en una pantalla dedicada (Prioridad: P1)

**Objetivo**: Proporcionar una pantalla de gestión accesible desde la barra lateral y el panel, con paneles de entidad y documento (sin mostrar la lista de entidades).

**Prueba Independiente**: Un usuario llega a la pantalla de gestión, alterna entre gestión de entidades y documentos, añade, edita y elimina ambos, y vuelve al panel.

### Pruebas para la Historia de Usuario 4

- [ ] T032 [P] [US4] Añadir pruebas de integración para la navegación de la pantalla de gestión y el CRUD de entidades/documentos en `tests/integration/manage-tabs.test.js`

### Implementación de la Historia de Usuario 4

- [ ] T033 [US4] Construir la vista de gestión dedicada con paneles de entidad y documento y sin lista de entidades en `src/app.js`
- [ ] T034 [P] [US4] Crear el componente de formulario de documento con los campos base de documento en `src/components/document-form.js`
- [ ] T035 [US4] Añadir selectores de entidad/documento y los flujos de añadir, editar y eliminar en la vista de gestión en `src/app.js`
- [ ] T036 [P] [US4] Añadir estilos del diseño de gestión y de los paneles de formulario en `src/styles.css`

**Punto de control**: La pantalla de gestión cubre entidades y documentos sin mostrar la lista de entidades.

---

## Fase 10: Historia de Usuario 7 - Declarar campos personalizados para los registros (Prioridad: P1)

**Objetivo**: Permitir que los campos personalizados declarados fluyan automáticamente por formularios, validación, persistencia, listas y búsqueda.

**Prueba Independiente**: Declarar un campo numérico obligatorio en entidades lo renderiza como entrada numérica, bloquea guardados en blanco, muestra valores en listas y coincide en búsquedas; sin declaraciones la aplicación se comporta como la base sin modificar.

### Pruebas para la Historia de Usuario 7

- [ ] T037 [P] [US7] Añadir pruebas unitarias para la validación, persistencia y búsqueda de campos personalizados en `tests/unit/storage.test.js`
- [ ] T038 [P] [US7] Añadir pruebas de integración para el renderizado de campos personalizados en formularios, listas y búsqueda en `tests/integration/custom-fields.test.js`

### Implementación de la Historia de Usuario 7

- [ ] T039 [P] [US7] Renderizar dinámicamente los campos personalizados declarados (texto, número, fecha, selección) en `src/components/entity-form.js` y `src/components/document-form.js`
- [ ] T040 [US7] Incluir los valores de campos personalizados en la validación, persistencia, renderizado de listas y búsqueda en `src/storage.js` y `src/app.js`

**Punto de control**: Los datos específicos del módulo requieren cero cambios de código de interfaz.

---

## Fase 11: Historia de Usuario 8 - Buscar y encontrar entidades rápidamente (Prioridad: P2)

**Objetivo**: Permitir a los usuarios buscar y filtrar entidades rápidamente, manteniendo la capacidad de respuesta con conjuntos de datos grandes.

**Prueba Independiente**: Un usuario introduce un término y ve solo las entidades coincidentes; una búsqueda sin coincidencias muestra un estado vacío claro y permite reintentar.

### Pruebas para la Historia de Usuario 8

- [ ] T041 [P] [US8] Añadir pruebas unitarias para el filtrado de búsqueda normalizado en `tests/unit/storage.test.js`
- [ ] T042 [P] [US8] Añadir pruebas de integración para los resultados de búsqueda y el estado vacío en `tests/integration/search-entities.test.js`

### Implementación de la Historia de Usuario 8

- [ ] T043 [US8] Implementar el filtrado de búsqueda normalizado en vivo, la lista de resultados y el estado vacío en `src/app.js`

**Punto de control**: La búsqueda funciona de forma independiente sobre los registros de entidad.

---

## Fase 12: Historia de Usuario 9 - Registrar una fecha objetivo (Prioridad: P2)

**Objetivo**: Permitir a los usuarios adjuntar una fecha objetivo opcional a una entidad y verla en la lista.

**Prueba Independiente**: Un usuario fija una fecha en una entidad y la ve en la lista; dejar la fecha en blanco guarda la entidad sin fecha.

### Pruebas para la Historia de Usuario 9

- [ ] T044 [P] [US9] Añadir pruebas unitarias para la validación, persistencia y búsqueda de `targetDate` en `tests/unit/storage.test.js`

### Implementación de la Historia de Usuario 9

- [ ] T045 [P] [US9] Añadir la entrada de fecha objetivo al formulario de entidad en `src/components/entity-form.js`
- [ ] T046 [US9] Incluir `targetDate` en la validación, creación/actualización y búsqueda en `src/storage.js`
- [ ] T047 [US9] Conectar `targetDate` al envío del formulario, la población de edición y la visualización en la lista en `src/app.js`

**Punto de control**: La Historia de Usuario 9 es completamente funcional y comprobable de forma independiente.

---

## Fase 13: Historia de Usuario 10 - Registrar los detalles de documentos de una entidad (Prioridad: P2)

**Objetivo**: Permitir registrar detalles transaccionales completos por entidad y proteger la integridad referencial con eliminación en cascada.

**Prueba Independiente**: Un usuario añade un documento con detalles a una entidad y ve los detalles junto a ella; eliminar la entidad elimina sus documentos; la validación de documento impide guardados inválidos.

### Pruebas para la Historia de Usuario 10

- [ ] T048 [P] [US10] Añadir pruebas unitarias para la generación de `entity_id`, la validación de detalles de documento y la eliminación en cascada en `tests/unit/storage.test.js`
- [ ] T049 [P] [US10] Añadir la prueba de integración de añadir un documento a una entidad en `tests/integration/add-document.test.js`
- [ ] T050 [P] [US10] Añadir pruebas de integración para editar, eliminar y eliminar en cascada documentos en `tests/integration/manage-document.test.js`

### Implementación de la Historia de Usuario 10

- [ ] T051 [US10] Ampliar el formulario de documento con los campos de detalle (serie, folio, fechas, cantidades e importes) y su validación en `src/components/document-form.js`
- [ ] T052 [US10] Conectar las acciones de crear, editar y eliminar documentos y la asociación con la entidad en `src/app.js`
- [ ] T053 [US10] Eliminar en cascada los documentos vinculados cuando se elimina una entidad en `src/storage.js`

**Punto de control**: Los datos maestros y los documentos transaccionales están completamente vinculados.

---

## Fase 14: Historia de Usuario 11 - Buscar entidades en una pantalla dedicada (Prioridad: P2)

**Objetivo**: Proporcionar una pantalla de búsqueda dedicada accesible desde la barra lateral y la acción rápida, manteniendo la edición en la pantalla de gestión.

**Prueba Independiente**: Un usuario abre la pantalla de búsqueda desde la barra lateral o el panel, busca, ve resultados o un estado vacío, y vuelve al panel.

### Pruebas para la Historia de Usuario 11

- [ ] T054 [P] [US11] Añadir pruebas de integración para la pantalla de búsqueda dedicada y el regreso al panel en `tests/integration/search-entities.test.js`

### Implementación de la Historia de Usuario 11

- [ ] T055 [US11] Implementar la vista de búsqueda dedicada con entrada enfocada, resultados y estado vacío reintentable en `src/app.js`
- [ ] T056 [US11] Encaminar la selección de Buscar en la barra lateral a la vista de búsqueda dedicada en `src/components/shell.js` y `src/app.js`

**Punto de control**: Todas las historias del usuario de negocio son funcionales y comprobables de forma independiente.

---

## Fase 15: Historia de Usuario 12 - Configurar el ciclo de vida de estados de documentos (Prioridad: P2)

**Objetivo**: Aplicar los estados y transiciones configurados en los documentos manteniendo el estado de texto libre cuando no hay configuración.

**Prueba Independiente**: Con cotización→pedido→facturado configurado, solo se ofrecen los estados siguientes válidos, los inválidos se rechazan con explicaciones, y el estado es visible de un vistazo; sin configuración, el estado permanece como texto libre.

### Pruebas para la Historia de Usuario 12

- [ ] T057 [P] [US12] Añadir pruebas unitarias para las transiciones configuradas y los estados siguientes permitidos en `tests/unit/storage.test.js`

### Implementación de la Historia de Usuario 12

- [ ] T058 [US12] Restringir las opciones de estado del documento y rechazar transiciones inválidas al guardar en `src/components/document-form.js` y `src/storage.js`
- [ ] T059 [US12] Mostrar el estado actual del documento de forma identificable en las listas y vistas de detalle en `src/app.js`

**Punto de control**: La cadena de personalización US5 → US6/US7/US12 está completa de extremo a extremo.

---

## Fase 16: Pulido y Preocupaciones Transversales

**Propósito**: Seguridad, accesibilidad, rendimiento, documentación y verificación final en todas las historias.

- [ ] T060 [P] Reforzar la protección XSS escapando el contenido introducido por el usuario antes de renderizarlo en el DOM en `src/app.js` y `src/components/*.js`
- [ ] T061 [P] Añadir refinamientos de accesibilidad para etiquetas, orden de foco, estados vacíos y `aria-current` en `index.html` y `src/styles.css`
- [ ] T062 [P] Añadir una prueba de rendimiento para renderizar y buscar 500 entidades en `tests/integration/performance.test.js`
- [ ] T063 [P] Actualizar `README.md` con la configuración, el marco del espacio de trabajo, el panel y la personalización del módulo
- [ ] T064 Ejecutar la suite completa de pruebas (`npm test`) y la compilación de producción (`npm run build`) para verificar que no hay regresiones

---

## Dependencias y Orden de Ejecución

### Dependencias entre Fases

- **Configuración (Fase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Fundacional (Fase 2)**: Depende de la Configuración; BLOQUEA todas las historias de usuario.
- **US1 (Fase 3)**: Depende de la Fase 2; es el MVP.
- **US2 (Fase 4)**: Depende de US1 (formulario y lista de entidades existentes).
- **US5 (Fase 5)**: Depende de la Fase 2; desbloquea US6, US7, US12 y US13.
- **US6 (Fase 6)**: Depende de US5.
- **US13 (Fase 7)**: Depende de US5 (nombre/etiquetas) y de la navegación base US1/US2.
- **US3 (Fase 8)**: Depende de US13 (marco/rutas) y US5 (etiquetas).
- **US4 (Fase 9)**: Depende de US13 (marco/rutas) y US5; crea el formulario de documento.
- **US7 (Fase 10)**: Depende de US5 y de que existan `entity-form.js` (US1) y `document-form.js` (US4).
- **US8 (Fase 11)**: Depende de US1 (lista de entidades) y US13 (ruta de búsqueda).
- **US9 (Fase 12)**: Depende de US1 (formulario de entidad) y US5.
- **US10 (Fase 13)**: Depende de US1 (entity_id) y US4 (formulario de documento).
- **US11 (Fase 14)**: Depende de US8 (lógica de búsqueda) y US13 (ruta de búsqueda).
- **US12 (Fase 15)**: Depende de US5 y US4 (formulario de documento).
- **Pulido (Fase 16)**: Depende de todas las historias deseadas.

### Dependencias entre Historias

- **US1 (P1)**: Sin dependencias posteriores a la Fase 2; MVP.
- **US2 (P1)**: Requiere US1.
- **US3 (P1)**: Requiere US13 y US5.
- **US4 (P1)**: Requiere US13 y US5.
- **US5 (P1)**: Sin dependencias posteriores a la Fase 2; habilita US6/US7/US12/US13.
- **US6 (P1)**: Requiere US5.
- **US7 (P1)**: Requiere US5, US1 y US4.
- **US13 (P1)**: Requiere US5 y la navegación de US1/US2.
- **US8 (P2)**: Requiere US1.
- **US9 (P2)**: Requiere US1.
- **US10 (P2)**: Requiere US1 y US4.
- **US11 (P2)**: Requiere US8 y US13.
- **US12 (P2)**: Requiere US5 y US4.

### Dentro de Cada Historia

- Las pruebas (si se incluyen) deben escribirse y FALLAR antes de la implementación.
- Modelos/almacenamiento antes que servicios y vistas.
- Funciones base antes de la integración entre historias.
- Completar una historia antes de pasar a la siguiente prioridad, salvo trabajo paralelo seguro.

### Oportunidades Paralelas

- T002, T003 y T004 pueden ejecutarse en paralelo dentro de la Configuración.
- T007 y T008 pueden ejecutarse en paralelo dentro de la Fundacional.
- Las pruebas unitarias y de integración de una misma historia marcadas `[P]` pueden ejecutarse en paralelo.
- Tras la Fase 2, US1 y US5 pueden iniciarse en paralelo (US1 es el MVP; US5 desbloquea personalización).
- Tras US5, US6 puede avanzar en paralelo con el trabajo de US13/US3.
- Tras US13 y US5, US3 y US4 pueden avanzar en paralelo.
- Tras US1, US8 y US9 son independientes y pueden ejecutarse en paralelo.
- Tras US4, US10 y US12 pueden avanzar en paralelo (comparten `document-form.js`, coordinar cambios).
- En la Fase 16, T060, T061, T062 y T063 pueden ejecutarse en paralelo antes de la verificación final T064.

---

## Ejemplo Paralelo: Historia de Usuario 1

```bash
# Lanzar las pruebas de US1 juntas:
Task: "Añadir pruebas unitarias para la validación y creación de entidades en tests/unit/storage.test.js"
Task: "Añadir la prueba de integración del flujo de creación de entidad en tests/integration/create-entity.test.js"

# Luego implementar el componente y el cableado:
Task: "Crear el componente de formulario de entidad en src/components/entity-form.js"
Task: "Conectar el envío de creación de entidad en src/app.js"
```

## Ejemplo Paralelo: Historia de Usuario 13

```bash
# Pruebas y estilos del marco pueden ir en paralelo:
Task: "Añadir pruebas de integración del marco en tests/integration/workspace-shell.test.js"
Task: "Crear el componente del marco en src/components/shell.js"
Task: "Añadir estilos de barra superior/barra lateral en src/styles.css"
```

---

## Estrategia de Implementación

### MVP Primero (Solo Historia de Usuario 1)

1. Completar la Fase 1: Configuración.
2. Completar la Fase 2: Fundacional (CRÍTICO, bloquea todo).
3. Completar la Fase 3: US1 - Crear y organizar entidades.
4. **DETENERSE Y VALIDAR**: probar US1 de forma independiente.
5. Desplegar/demostrar si está listo.

### Entrega Incremental

1. Configuración + Fundacional → base lista.
2. Añadir US1 → probar → desplegar (MVP).
3. Añadir US2 y US5 → probar → desplegar.
4. Añadir US6, US13, US3 y US4 → probar → desplegar.
5. Añadir US7 (campos personalizados) → probar → desplegar.
6. Añadir US8, US9, US10, US11 y US12 → probar → desplegar.
7. Pulido y verificación final.

### Estrategia de Equipo en Paralelo

1. El equipo completa Configuración + Fundacional en conjunto.
2. Tras la Fundacional:
   - Desarrollador A: US1 → US2 → US8/US9.
   - Desarrollador B: US5 → US6 → US7 → US12.
   - Desarrollador C: US13 → US3 → US4 → US10 → US11.
3. Integrar y validar cada historia de forma independiente.

---

## Notas

- `[P]` indica archivos distintos y sin dependencias pendientes.
- `[Historia]` permite la trazabilidad de cada tarea a su historia de usuario.
- Cada historia debe poder completarse y probarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Confirmar cada tarea o grupo lógico; no agrupar cambios no relacionados.
- Evitar tareas vagas, conflictos en el mismo archivo y dependencias entre historias que rompan la independencia.
