---
description: "Task list for feature implementation"
---

# Tasks: Módulo de Ventas (Tienda Online)

**Input**: Design documents from `/specs/002-modulo-ventas/`

**Prerequisites**: `spec.md` (fuente de verdad de las nueve historias y FR-009/FR-010), `plan.md` (stack y estado de implementación), `data-model.md` (entidades), `public/images/producto-1.jpg` … `public/images/producto-8.jpg` (imágenes reales de RootSouth)

**Tests**: Incluidas porque `spec.md` define pruebas independientes para las historias y porque la verificación del módulo 002 usa `npm run test:002`.

**Organization**: Las tareas se agrupan por historia de usuario para permitir implementación y verificación independientes.

> **Nota de regeneración**: `spec.md` define US1–US9 y los nuevos FR-009/FR-010. Aunque `plan.md` registra US1–US9 como implementadas, este checklist queda sin marcar para que cada ejecutor valide el estado real, migre los datos semilla de tecnología a la tienda RootSouth y confirme la estética Scuffers.

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Etiqueta de la historia (US1–US9). Solo aparece en las fases de historia de usuario.
- Todas las tareas incluyen una ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `package.json`, `src/`, `tests/` en la raíz del repositorio.
- Componentes: `src/components/`. Datos semilla: `src/data/`. Imágenes: `public/images/`. Pruebas: `tests/unit/`, `tests/integration/`.
- Configuración de pruebas: `vitest.config.mjs`, `tests/setup/jsdom.js`, `tests/helpers/app-fixture.js`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la estructura Vite, las dependencias y el arnés de pruebas.

- [ ] T001 Verificar la estructura Vite con `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `src/components/`, `src/data/`, `public/images/`, `tests/unit/`, `tests/integration/`, `tests/setup/` y `tests/helpers/`
- [ ] T002 [P] Confirmar scripts y dependencias de Vite, Vitest y jsdom en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [ ] T003 [P] Confirmar el arnés de pruebas con jsdom y aislamiento de `localStorage` por prueba en `tests/setup/jsdom.js` y `tests/helpers/app-fixture.js`
- [ ] T004 [P] Confirmar el HTML base con cabecera, navegación, selector de rol y contenedores de catálogo/carrito/checkout/confirmación/historial/administración/métricas en `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistencia versionada, configuración de roles, arranque, estilos base y datos semilla compartidos.

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T005 Implementar las claves de almacenamiento y el control de versión de esquema `erp.seedVersion` en `src/storage.js`
- [ ] T006 Implementar el CRUD de productos con `id`, nombre, descripción, `image`, precio, stock, categoría y destacado en `src/storage.js`
- [ ] T007 Implementar el almacenamiento de clientes y pedidos, la integridad referencial y la eliminación en cascada en `src/storage.js`
- [ ] T008 Implementar el estado y la persistencia del carrito en `src/storage.js`
- [ ] T009 [P] Implementar el modelo, almacenamiento y validación de cupones en `src/coupons.js`
- [ ] T010 [P] Implementar la configuración del módulo, etiquetas, roles y ayudantes de permisos en `src/module-config.js`
- [ ] T011 Implementar el arranque de la aplicación, el enrutado de vistas y los ayudantes de renderizado en `src/app.js`
- [ ] T012 [P] Crear los tokens de diseño editorial (blanco, gris claro, negro, grises neutros, radio `0px`) y los estilos base en `src/styles.css`
- [ ] T013 Elevar la versión de esquema y limpiar productos, pedidos y carrito heredados de tecnología en `src/storage.js`
- [ ] T014 [P] Crear el módulo de pedidos iniciales con líneas de las 8 prendas RootSouth en `src/data/seed-orders.js`
- [ ] T015 [P] Reemplazar las referencias de ofertas heredadas por productos RootSouth en `src/data/offers.js`
- [ ] T016 [P] Ajustar el fixture de pruebas para limpiar `erp.seedVersion` antes de cada caso en `tests/helpers/app-fixture.js`

**Checkpoint**: La base está lista; las historias de usuario pueden comenzar.

---

## Phase 3: User Story 1 - Catálogo de productos destacados (Priority: P1)

**Goal**: Mostrar 8 productos reales de RootSouth con imágenes `<img>`, nombre, descripción, categoría, precio y botón de compra; los productos sin stock muestran “Agotado” y deshabilitan la compra.

**Independent Test**: Abrir la página principal y verificar 8 tarjetas RootSouth con imagen real, precio y botón de compra; poner un producto en stock 0 y comprobar la insignia “Agotado” y el botón deshabilitado.

### Tests for US1

- [ ] T017 [P] [US1] Añadir pruebas unitarias de los 8 productos RootSouth, imágenes, destacados y disponibilidad por stock en `tests/unit/products.test.js`
- [ ] T018 [P] [US1] Añadir la prueba de integración del catálogo con `<img>`, nombres, precios, botón de compra y estado agotado en `tests/integration/product-catalog.test.js`

### Implementation for US1

- [ ] T019 [P] [US1] Reemplazar el catálogo semilla de tecnología por las 8 prendas RootSouth con `image` en `src/data/products.js`
- [ ] T020 [P] [US1] Renderizar la imagen con `<img>`, `alt`, precio, insignia de agotado y botón deshabilitado en `src/components/product-card.js`
- [ ] T021 [P] [US1] Agrupar las tarjetas destacadas con categorías RootSouth en `src/components/product-catalog.js`
- [ ] T022 [US1] Conectar el catálogo destacado con la vista de inicio y el estado de stock en `src/app.js`
- [ ] T023 [P] [US1] Aplicar la estética Scuffers al catálogo: fondo `#FFFFFF`, marco 3:4 `#F4F4F4`, bordes `0px`, paleta monocromática y hover sutil en `src/styles.css`
- [ ] T024 [US1] Verificar que `public/images/producto-1.jpg` … `public/images/producto-8.jpg` se sirven desde Vite según `vite.config.js`

**Checkpoint**: US1 es funcional y comprobable de forma independiente.

---

## Phase 4: User Story 2 - Filtrado de productos por categoría y precio (Priority: P2)

**Goal**: Filtrar el catálogo RootSouth por categoría y precio máximo, con mensaje claro y reinicio cuando no hay resultados.

**Independent Test**: Seleccionar “Poleras” de RootSouth y un precio máximo; el listado debe mostrar solo coincidencias. Sin coincidencias, aparece el mensaje de resultados vacíos y el botón de reinicio.

### Tests for US2

- [ ] T025 [P] [US2] Añadir pruebas unitarias del filtrado combinado por “Poleras” y precio máximo, incluido el caso sin resultados, en `tests/unit/product-filters.test.js`
- [ ] T026 [P] [US2] Añadir la prueba de integración de la interfaz de filtros actualizando el catálogo y el estado vacío en `tests/integration/product-filters.test.js`

### Implementation for US2

- [ ] T027 [US2] Implementar el filtrado puro por categoría y precio máximo en `src/catalog.js`
- [ ] T028 [US2] Crear los controles de categoría, precio máximo, mensaje vacío y reinicio en `src/components/product-filters.js`
- [ ] T029 [US2] Conectar el estado de filtros con el renderizado del catálogo en `src/app.js`
- [ ] T030 [P] [US2] Dar estilo a la barra de filtros con categorías en mayúsculas espaciadas y al estado vacío en `src/styles.css`

**Checkpoint**: US2 es funcional de forma independiente sobre el catálogo de US1.

---

## Phase 5: User Story 3 - Gestión de carrito de compras (Priority: P3)

**Goal**: Añadir productos RootSouth al carrito, ajustar cantidades, quitar artículos y recalcular subtotal y total respetando el stock.

**Independent Test**: Añadir un producto, subir la cantidad a 2 y comprobar que el importe de línea y el subtotal se duplican; al quitar el artículo, el total se actualiza de inmediato.

### Tests for US3

- [ ] T031 [P] [US3] Añadir pruebas unitarias de añadir, actualizar cantidad, quitar y recalcular totales en `tests/unit/cart.test.js`
- [ ] T032 [P] [US3] Añadir la prueba de integración de las interacciones del carrito y la actualización de totales en `tests/integration/cart.test.js`

### Implementation for US3

- [ ] T033 [P] [US3] Crear el componente del carrito con líneas, controles de cantidad, botón de quitar y totales en `src/components/cart.js`
- [ ] T034 [US3] Conectar las operaciones del carrito, el respeto al stock y el recálculo en `src/storage.js`
- [ ] T035 [US3] Cablear los eventos del carrito con la vista y las notificaciones en `src/app.js`
- [ ] T036 [P] [US3] Dar estilo al panel del carrito, líneas, controles y resumen en `src/styles.css`

**Checkpoint**: US3 es funcional y persistente de forma independiente.

---

## Phase 6: User Story 4 - Aplicación de códigos de descuento (Priority: P4)

**Goal**: Validar cupones por código, vigencia y límite de uso; aplicar descuento porcentual o fijo, notificar resultado y restaurar el total al quitarlos.

**Independent Test**: Aplicar un cupón válido y verificar descuento en tiempo real y en `localStorage`; un cupón inválido, vencido o agotado debe mostrar error; al quitarlo, el total vuelve al original salvo eliminación explícita.

### Tests for US4

- [ ] T037 [P] [US4] Añadir pruebas unitarias de cupones válidos, inválidos, vencidos y agotados en `tests/unit/coupons.test.js`
- [ ] T038 [P] [US4] Añadir la prueba de integración de aplicar y quitar cupones con actualización del total en `tests/integration/coupons.test.js`

### Implementation for US4

- [ ] T039 [P] [US4] Crear el componente de entrada de cupón con notificaciones de éxito y error en `src/components/coupon-form.js`
- [ ] T040 [US4] Conectar validación, aplicación, eliminación y restauración del cupón con el total del carrito en `src/app.js`
- [ ] T041 [US4] Persistir el uso acumulado de cupones por código en `src/coupons.js`
- [ ] T042 [P] [US4] Dar estilo al campo de cupón y a los avisos en `src/styles.css`

**Checkpoint**: US4 es funcional de forma independiente sobre el carrito de US3.

---

## Phase 7: User Story 5 - Proceso de pago seguro (Priority: P5)

**Goal**: Recoger datos de envío y método de pago, validar obligatorios, simular pasarela, descontar stock y mostrar confirmación con número `PED-YYYYMMDD-NNNN`.

**Independent Test**: Completar dirección y pago, confirmar y llegar a la confirmación con número de pedido; si falta un campo obligatorio, se resalta y se impide continuar.

### Tests for US5

- [ ] T043 [P] [US5] Añadir pruebas unitarias de validación de checkout y generación del número de pedido en `tests/unit/checkout.test.js`
- [ ] T044 [P] [US5] Añadir la prueba de integración del flujo de checkout, errores de campos obligatorios y confirmación en `tests/integration/checkout.test.js`

### Implementation for US5

- [ ] T045 [P] [US5] Crear el formulario de checkout con campos de envío, método de pago y mensajes de validación en `src/components/checkout-form.js`
- [ ] T046 [P] [US5] Crear la vista de confirmación con número de pedido y resumen de la compra en `src/components/order-confirmation.js`
- [ ] T047 [US5] Implementar la validación del checkout, descuento de stock, persistencia del pedido y enrutado en `src/checkout.js`
- [ ] T048 [US5] Implementar la pasarela simulada con éxito, rechazo y timeout reintentable en `src/payments.js`
- [ ] T049 [US5] Conectar checkout, pago y confirmación con la aplicación en `src/app.js`
- [ ] T050 [P] [US5] Dar estilo al formulario, estados de error y confirmación en `src/styles.css`

**Checkpoint**: El embudo de compra está completo hasta la confirmación del pedido.

---

## Phase 8: User Story 6 - Historial y seguimiento de Documentos de Venta (Priority: P6)

**Goal**: Consultar por cliente el tipo, fecha, monto y estado de sus documentos de venta, incluidos los pedidos iniciales de las 8 prendas RootSouth, y enmascarar `creditLimit` para roles sin permiso financiero.

**Independent Test**: Abrir la ficha de un cliente con pedidos iniciales RootSouth y ver el detalle; cambiar a un rol sin `canViewFinancials` y verificar que el límite de crédito aparece como `•••••`.

### Tests for US6

- [ ] T051 [P] [US6] Añadir pruebas unitarias de obtención del historial por cliente y enmascaramiento por rol en `tests/unit/order-history.test.js`
- [ ] T052 [P] [US6] Añadir la prueba de integración de la vista de historial, estados y límite de crédito enmascarado en `tests/integration/order-history.test.js`

### Implementation for US6

- [ ] T053 [P] [US6] Crear el componente de historial con tipo de documento, fecha, monto y estado en `src/components/order-history.js`
- [ ] T054 [US6] Implementar la consulta del historial por cliente y el enmascaramiento de `creditLimit` según el rol en `src/app.js`
- [ ] T055 [US6] Cargar los pedidos iniciales de RootSouth desde `src/data/seed-orders.js` durante la migración en `src/storage.js`
- [ ] T056 [P] [US6] Dar estilo a la tabla de historial y a las insignias de estado en `src/styles.css`

**Checkpoint**: US6 es funcional y comprobable de forma independiente.

---

## Phase 9: User Story 7 - Administración de precios y generación de ofertas (Priority: P7)

**Goal**: Permitir al administrador editar precios y crear/editar/activar/desactivar/eliminar ofertas con vigencia; el catálogo y el carrito aplican el precio efectivo sobre productos RootSouth; los demás roles reciben mensaje de permisos. El acceso usa el código `1234`.

**Independent Test**: Ingresar al panel con código `1234`, cambiar un precio y verlo reflejado; crear una oferta sobre una prenda RootSouth y comprobar precio tachado, insignia y descuento en el carrito; desactivarla y verificar que vuelve el precio original.

### Tests for US7

- [ ] T057 [P] [US7] Añadir pruebas unitarias de validación de ofertas en `tests/unit/offers.test.js`
- [ ] T058 [P] [US7] Añadir pruebas unitarias de resolución de precio con oferta y totales de línea del carrito en `tests/unit/offer-pricing.test.js`
- [ ] T059 [P] [US7] Añadir pruebas de integración del panel de administración y ofertas en `tests/integration/admin-panel.test.js`

### Implementation for US7

- [ ] T060 [P] [US7] Extender la configuración con `admin`, `canManageCatalog` y etiquetas de ofertas en `src/module-config.js`
- [ ] T061 [P] [US7] Implementar la validación y resolución de la mejor oferta activa en `src/offers.js`
- [ ] T062 [P] [US7] Alinear las ofertas semilla con identificadores de productos RootSouth en `src/data/offers.js`
- [ ] T063 [US7] Añadir el CRUD de ofertas y la validación de precio numérico no negativo en `src/storage.js`
- [ ] T064 [US7] Crear el panel con edición de precios, formulario de ofertas, listado y mensajes en `src/components/admin-panel.js`
- [ ] T065 [US7] Añadir la vista de administración, la navegación y la guarda de acceso con código `1234` en `index.html` y `src/app.js`
- [ ] T066 [US7] Conectar los manejadores del panel y refrescar catálogo/carrito en `src/app.js`
- [ ] T067 [P] [US7] Dar estilo al panel, formularios, insignias y precio original tachado en `src/styles.css`

**Checkpoint**: US7 es funcional y comprobable de forma independiente sobre US1 y US3.

---

## Phase 10: User Story 8 - Panel de métricas e indicadores de ventas (Priority: P8)

**Goal**: Calcular y mostrar ingresos, ventas, ticket promedio, estados, ranking, alertas de stock y uso de cupones/ofertas desde los pedidos iniciales RootSouth y las compras nuevas, con filtros por fecha y categoría.

**Independent Test**: Ingresar con perfil de dueño/administrador, comprobar los indicadores frente a los pedidos iniciales RootSouth, registrar una compra nueva y verificar el refresco; aplicar filtros y comprobar el recálculo; sin datos, ver ceros y estado vacío.

### Tests for US8

- [ ] T068 [P] [US8] Añadir pruebas unitarias de ingresos, ventas, ticket promedio y estados en `tests/unit/metrics.test.js`
- [ ] T069 [P] [US8] Añadir pruebas unitarias de ranking, alertas, filtros y estado vacío en `tests/unit/metrics-filters.test.js`
- [ ] T070 [P] [US8] Añadir la prueba de integración del panel de métricas en `tests/integration/metrics-dashboard.test.js`

### Implementation for US8

- [ ] T071 [US8] Implementar el cálculo de métricas desde `erp.orders`, `erp.products`, `erp.coupons` y `erp.offers` en `src/metrics.js`
- [ ] T072 [US8] Añadir las etiquetas del panel y el permiso `canViewMetrics` en `src/module-config.js`
- [ ] T073 [US8] Añadir el botón `button[data-view="metrics"]` y la sección `#view-metrics` con sus controles en `index.html`
- [ ] T074 [US8] Crear el componente del panel con KPI, tabla de estados, rankings y alertas en `src/components/metrics-dashboard.js`
- [ ] T075 [US8] Cablear filtros, guarda por rol y refresco tras checkout en `src/app.js`
- [ ] T076 [P] [US8] Dar estilo a tarjetas KPI, tablas, rankings y alertas en `src/styles.css`
- [ ] T077 [US8] Verificar que los indicadores iniciales coinciden con los pedidos RootSouth en `tests/integration/metrics-dashboard.test.js`

**Checkpoint**: US8 es funcional y comprobable de forma independiente sobre US1, US5 y US7.

---

## Phase 11: User Story 9 - Vistas y navegación diferenciadas por rol (Priority: P9)

**Goal**: Adaptar navegación, vistas, acciones y datos sensibles al rol activo (Cliente, Vendedor, Dueño/Administrador), bloquear acceso directo a secciones restringidas y permitir volver a la vista pública al cerrar sesión.

**Independent Test**: Acceder con cada perfil y verificar cambios de navegación, pantallas y acciones; abrir directamente una vista restringida y comprobar el aviso y el regreso; cerrar sesión interna y comprobar el retorno al catálogo RootSouth.

### Tests for US9

- [ ] T078 [P] [US9] Añadir pruebas unitarias de permisos por rol en `tests/unit/role-permissions.test.js`
- [ ] T079 [P] [US9] Añadir pruebas de integración de vistas por rol, acceso bloqueado y cierre de sesión en `tests/integration/role-views.test.js`

### Implementation for US9

- [ ] T080 [US9] Añadir el rol `customer` y los permisos `canViewHistory`, `canViewStock` y `canViewMetrics` en `src/module-config.js`
- [ ] T081 [US9] Añadir `data-requires` a la navegación y los controles `#role-logout` y `#role-denied` en `index.html`
- [ ] T082 [US9] Implementar `canAccessView`, filtrado de navegación y guarda de `showView` en `src/app.js`
- [ ] T083 [P] [US9] Mostrar stock solo a roles con `canViewStock` en `src/components/product-card.js`
- [ ] T084 [US9] Alinear las pruebas de configuración e historial con el rol `customer` en `tests/unit/module-config.test.js` y `tests/integration/order-history.test.js`
- [ ] T085 [P] [US9] Dar estilo al selector de rol, cierre de sesión y aviso de acceso restringido en `src/styles.css`
- [ ] T086 [US9] Revocar la sesión privilegiada al cambiar o cerrar rol durante ofertas o métricas en `src/app.js`

**Checkpoint**: Todas las historias de usuario son funcionales y comprobables de forma independiente.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Seguridad, accesibilidad, FR-009/FR-010, datos semilla, documentación y verificación final.

- [ ] T087 [P] Reforzar el escape de HTML y atributos antes de renderizar en `src/app.js`, `src/components/product-card.js`, `src/components/cart.js`, `src/components/admin-panel.js`, `src/components/order-history.js` y `src/components/metrics-dashboard.js`
- [ ] T088 [P] Añadir etiquetas, foco, teclado y texto alternativo de imágenes/insignias en `index.html` y `src/styles.css`
- [ ] T089 [P] Cubrir casos límite del embudo con productos RootSouth en `src/app.js`, `src/coupons.js` y `src/payments.js`
- [ ] T090 [P] Reemplazar referencias heredadas a “smartphone” por “Poleras” de RootSouth en `tests/integration/product-filters.test.js` y `README.md`
- [ ] T091 [P] Aplicar de forma consistente la estética Scuffers en `src/styles.css`
- [ ] T092 [P] Verificar que historial y métricas iniciales coinciden con las 8 prendas RootSouth en `tests/integration/order-history.test.js` y `tests/integration/metrics-dashboard.test.js`
- [ ] T093 [P] Verificar que las 8 tarjetas renderizan `img` con `src` de `public/images/producto-1.jpg` … `public/images/producto-8.jpg` en `tests/integration/product-catalog.test.js`
- [ ] T094 [P] Mantener la prueba de extremo a extremo del embudo con productos RootSouth en `tests/integration/purchase-funnel.test.js`
- [ ] T095 [P] Mantener la prueba del ciclo de oferta sobre productos RootSouth en `tests/integration/offer-lifecycle.test.js`
- [ ] T096 [P] Actualizar `specs/002-modulo-ventas/plan.md`, `specs/002-modulo-ventas/data-model.md` y `README.md` con FR-009, FR-010, imágenes y pedidos iniciales RootSouth
- [ ] T097 Ejecutar `npm run test:002`, `npm run build` y `npm test`, registrando resultados en `specs/002-modulo-ventas/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Foundational (Phase 2)**: Depende de Setup; **BLOQUEA** todas las historias.
- **US1 (Phase 3)**: Depende de Foundational; es el MVP.
- **US2 (Phase 4)**: Depende de US1 porque filtra el catálogo RootSouth.
- **US3 (Phase 5)**: Depende de US1 porque usa productos y precios.
- **US4 (Phase 6)**: Depende de US3 porque aplica descuentos al carrito.
- **US5 (Phase 7)**: Depende de US3 y US4.
- **US6 (Phase 8)**: Depende de US5 y de los pedidos iniciales de la Fase 2.
- **US7 (Phase 9)**: Depende de US1 y US3; integra con US2, US4 y US5 sin alterar sus flujos.
- **US8 (Phase 10)**: Depende de US1, US5 y US7 porque consume productos, pedidos, cupones y ofertas.
- **US9 (Phase 11)**: Depende de US6, US7 y US8 porque gobierna esas vistas.
- **Polish (Phase 12)**: Depende de todas las historias deseadas.

### User Story Dependencies

- **US1 (P1)**: Sin dependencias entre historias tras Foundational; MVP.
- **US2 (P2)**: Requiere US1.
- **US3 (P3)**: Requiere US1.
- **US4 (P4)**: Requiere US3.
- **US5 (P5)**: Requiere US3 y US4.
- **US6 (P6)**: Requiere US5 y T014/T055.
- **US7 (P7)**: Requiere US1 y US3.
- **US8 (P8)**: Requiere US1, US5 y US7.
- **US9 (P9)**: Requiere US6, US7 y US8.

### Within Each User Story

- Las pruebas marcadas en la fase de historia se escriben primero y deben fallar antes de la implementación.
- Modelos y utilidades puras antes que componentes; componentes antes que el cableado en `src/app.js`.
- La implementación base precede a las integraciones con otras historias.
- No se marca una historia como completa hasta que su prueba independiente pasa.

### Parallel Opportunities

- T002, T003 y T004 pueden ejecutarse en paralelo dentro de Setup.
- T009, T010, T012, T014, T015 y T016 pueden ejecutarse en paralelo dentro de Foundational.
- T017 y T018; T025 y T026; T031 y T032; T037 y T038; T043 y T044; T051 y T052; T057, T058 y T059; T068, T069 y T070; T078 y T079 pueden ejecutarse en paralelo.
- T019, T020, T021 y T023 pueden ejecutarse en paralelo tras la migración T013.
- T060, T061 y T062 pueden ejecutarse en paralelo dentro de US7.
- T071, T073 y T074 pueden ejecutarse en paralelo dentro de US8 tras T072.
- T087–T095 pueden ejecutarse en paralelo antes de T097.
- **Aviso de archivos compartidos**: `src/module-config.js`, `src/app.js`, `index.html`, `src/styles.css`, `src/storage.js` y `package.json` se tocan en varias fases; dentro de una misma fase, las tareas que los modifican no deben ejecutarse en paralelo entre sí.

---

## Parallel Example: User Story 1

```bash
# Pruebas de US1 en paralelo:
Task: "Añadir pruebas unitarias de los 8 productos RootSouth en tests/unit/products.test.js"
Task: "Añadir la prueba de integración del catálogo con <img> en tests/integration/product-catalog.test.js"

# Base de US1 en paralelo tras la migración:
Task: "Reemplazar el catálogo semilla en src/data/products.js"
Task: "Renderizar la tarjeta con <img> en src/components/product-card.js"
Task: "Aplicar la estética Scuffers en src/styles.css"
```

## Parallel Example: User Story 8

```bash
# Pruebas de US8 en paralelo:
Task: "Añadir pruebas unitarias de métricas en tests/unit/metrics.test.js"
Task: "Añadir pruebas unitarias de filtros y rankings en tests/unit/metrics-filters.test.js"
Task: "Añadir la prueba de integración del panel en tests/integration/metrics-dashboard.test.js"

# Base de US8 en paralelo:
Task: "Implementar el cálculo de métricas en src/metrics.js"
Task: "Añadir el markup de #view-metrics en index.html"
Task: "Crear el componente del panel en src/components/metrics-dashboard.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup.
2. Completar Phase 2: Foundational (**CRÍTICO**, bloquea todo).
3. Completar Phase 3: US1 con las 8 prendas RootSouth y sus imágenes.
4. **DETENERSE Y VALIDAR**: probar catálogo, imágenes, precios y estado agotado de forma independiente.
5. Desplegar/demostrar si está listo.

### Incremental Delivery

1. Setup + Foundational → base versionada lista.
2. US1 → validar → desplegar (MVP).
3. US2 → validar filtros “Poleras” → desplegar.
4. US3 → validar carrito → desplegar.
5. US4 → validar cupones → desplegar.
6. US5 → validar checkout → desplegar.
7. US6 → validar historial inicial RootSouth → desplegar.
8. US7 → validar precios y ofertas → desplegar.
9. US8 → validar métricas iniciales y filtros → desplegar.
10. US9 → validar roles y accesos → desplegar.
11. Pulido y verificación final.

### Parallel Team Strategy

1. El equipo completa Setup + Foundational en conjunto.
2. Tras Foundational:
   - Desarrollador A: US1 → US2.
   - Desarrollador B: US3 → US4.
   - Desarrollador C: US5 → US6.
   - Desarrollador D: US7.
3. Con US5/US7 listas:
   - Desarrollador C: US8 (`src/metrics.js`, `src/components/metrics-dashboard.js`, `tests/unit/metrics*.test.js`, `tests/integration/metrics-dashboard.test.js`).
   - Desarrollador D: US9 (`src/module-config.js`, `index.html`, `src/app.js`, `tests/unit/role-permissions.test.js`, `tests/integration/role-views.test.js`) coordinando archivos compartidos.
4. Integrar y validar cada historia de forma independiente antes del pulido.

---

## Notes

- `[P]` indica archivos distintos y sin dependencias pendientes dentro de la misma fase.
- `[USn]` permite la trazabilidad de cada tarea a su historia de usuario en `spec.md`.
- Cada historia debe poder completarse y probarse de forma independiente.
- Las pruebas se escriben primero y deben fallar antes de la implementación.
- No se agrupan cambios no relacionados en una misma tarea.
- `plan.md` y `data-model.md` conservan un modelo B2B de referencia; la entrega es la tienda en línea descrita en `spec.md`.
- Las suites heredadas del módulo base 001 dependen de APIs fuera del alcance 002; `npm run test:002` es la referencia de verificación del alcance implementado.
- Las imágenes reales ya disponibles son `public/images/producto-1.jpg` … `public/images/producto-8.jpg`; cualquier tarea que cambie el catálogo debe conservar estas rutas.
