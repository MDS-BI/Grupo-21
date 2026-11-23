---
description: "Task list for feature implementation"
---

# Tasks: Módulo de Ventas (Tienda Online)

**Input**: Design documents from `/specs/002-modulo-ventas/`

**Prerequisites**: `spec.md` (fuente de verdad de las historias), `plan.md` (stack y estado de implementación), `data-model.md` (entidades), `.specify/memory/constitution.md` (principios de calidad)

**Tests**: Incluidas porque la constitución del proyecto (Principio II, Test-First & Verification) exige cobertura automatizada de todo comportamiento visible y de toda lógica de negocio.

**Organization**: Las tareas se agrupan por historia de usuario para permitir implementación y verificación independientes.

> **Nota de reconciliación**: `spec.md` define nueve historias (US1–US9). El `tasks.md` anterior cubría US1–US7 y declaraba el panel de métricas como "no solicitado" (antigua T073). Esa decisión queda **supersedida** por US8 (Panel de métricas e indicadores) y US9 (Vistas y navegación por rol), presentes en la especificación vigente. Las tareas T061–T080 reintroducen y completan esas capacidades. Las tareas US1–US7 se conservan para trazabilidad; según `plan.md` §10 ya están implementadas y verificadas, pero se mantienen en formato de checklist pendiente para que cada ejecutor confirme su estado antes de continuar.

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Etiqueta de la historia (US1–US9). Solo aparece en las fases de historia de usuario.
- Todas las tareas incluyen una ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `package.json`, `src/`, `tests/` en la raíz del repositorio.
- Componentes: `src/components/`. Datos semilla: `src/data/`. Pruebas: `tests/unit/`, `tests/integration/`.
- Configuración de pruebas: `vitest.config.mjs`, `tests/setup/jsdom.js`, `tests/helpers/app-fixture.js`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar la estructura Vite, dependencias y arnés de pruebas.

- [ ] T001 Crear la estructura del proyecto Vite con `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `src/components/`, `src/data/`, `tests/unit/`, `tests/integration/`, `tests/setup/` y `tests/helpers/`
- [ ] T002 [P] Configurar scripts y dependencias de Vite, Vitest y jsdom en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [ ] T003 [P] Crear el arnés de pruebas con jsdom y aislamiento de `localStorage` por prueba en `tests/setup/jsdom.js` y `tests/helpers/app-fixture.js`
- [ ] T004 [P] Construir el HTML base con cabecera, navegación, selector de rol, contenedores de catálogo/carrito/checkout/confirmación/historial/administración y métricas en `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistencia de productos, clientes, pedidos, carrito, cupones y ofertas; configuración; arranque y estilos base.

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T005 Implementar las primitivas de almacenamiento y el CRUD de productos (stock, precio, categoría, destacado) en `src/storage.js`
- [ ] T006 Implementar el almacenamiento de clientes y pedidos, la integridad referencial y la eliminación en cascada en `src/storage.js`
- [ ] T007 Implementar el estado y la persistencia del carrito (añadir, actualizar cantidad, quitar, vaciar) en `src/storage.js`
- [ ] T008 [P] Implementar el modelo, almacenamiento y validación de cupones (vigencia, tipo, valor, límite de uso) en `src/coupons.js`
- [ ] T009 [P] Implementar la configuración del módulo, etiquetas, roles, valores predeterminados y ayudantes de permisos en `src/module-config.js`
- [ ] T010 Implementar el arranque de la aplicación, el enrutado de vistas y los ayudantes de renderizado en `src/app.js`
- [ ] T011 [P] Crear los tokens de diseño y los estilos base del escaparate, carrito, formularios y estados vacíos en `src/styles.css`
- [ ] T012 [P] Crear el catálogo semilla de productos con categorías, precios, stock y marca de destacado en `src/data/products.js`

**Checkpoint**: La base está lista; las historias de usuario pueden comenzar.

---

## Phase 3: User Story 1 - Catálogo de productos destacados (Priority: P1) 🎯 MVP

**Goal**: Mostrar en la página principal los productos destacados con nombre, precio y botón de compra; los productos sin stock muestran "Agotado" y deshabilitan la compra.

**Independent Test**: Abrir la página principal y verificar la sección de destacados con artículos, precios y botones de compra; al poner un producto en stock 0, aparece la etiqueta "Agotado" y su botón queda deshabilitado.

### Tests for US1

- [ ] T013 [P] [US1] Añadir pruebas unitarias de selección de destacados y disponibilidad por stock en `tests/unit/products.test.js`
- [ ] T014 [P] [US1] Añadir la prueba de integración del renderizado del catálogo, precios, botón de compra y estado agotado en `tests/integration/product-catalog.test.js`

### Implementation for US1

- [ ] T015 [P] [US1] Crear el componente de tarjeta de producto con nombre, precio, botón de compra, insignia de agotado y botón deshabilitado en `src/components/product-card.js`
- [ ] T016 [P] [US1] Crear el componente de catálogo destacado que agrupa las tarjetas disponibles en `src/components/product-catalog.js`
- [ ] T017 [US1] Conectar el catálogo destacado con la vista de inicio y el estado de stock en `src/app.js`
- [ ] T018 [P] [US1] Dar estilo a la sección de destacados, tarjetas e insignias de agotado en `src/styles.css`

**Checkpoint**: US1 es funcional y comprobable de forma independiente.

---

## Phase 4: User Story 2 - Filtrado por categoría y precio (Priority: P2)

**Goal**: Filtrar el catálogo por categoría y precio máximo, con mensaje claro y acción de reinicio cuando no hay resultados.

**Independent Test**: Seleccionar "smartphone" y un precio máximo; el listado debe mostrar solo coincidencias. Sin coincidencias, debe aparecer el mensaje de resultados vacíos y el botón de reinicio.

### Tests for US2

- [ ] T019 [P] [US2] Añadir pruebas unitarias del filtrado combinado por categoría y precio máximo y del caso sin resultados en `tests/unit/product-filters.test.js`
- [ ] T020 [P] [US2] Añadir la prueba de integración de la interfaz de filtros actualizando el catálogo y el estado vacío en `tests/integration/product-filters.test.js`

### Implementation for US2

- [ ] T021 [US2] Crear los controles de filtro (categoría y precio máximo) y el mensaje de resultados vacíos con reinicio en `src/components/product-filters.js`
- [ ] T022 [US2] Implementar el estado de filtros y el renderizado del catálogo filtrado en `src/app.js`
- [ ] T023 [P] [US2] Dar estilo a la barra de filtros y al estado de resultados vacíos en `src/styles.css`

**Checkpoint**: US2 es funcional de forma independiente sobre el catálogo de US1.

---

## Phase 5: User Story 3 - Gestión de carrito de compras (Priority: P3)

**Goal**: Añadir productos, ajustar cantidades, quitar artículos y recalcular subtotal y total, respetando el stock.

**Independent Test**: Añadir un producto, subir la cantidad a 2 y comprobar que el importe de línea y el subtotal se duplican; al quitar el artículo, el total se actualiza de inmediato.

### Tests for US3

- [ ] T024 [P] [US3] Añadir pruebas unitarias de añadir, actualizar cantidad, quitar y recalcular totales en `tests/unit/cart.test.js`
- [ ] T025 [P] [US3] Añadir la prueba de integración de las interacciones del carrito y la actualización de totales en `tests/integration/cart.test.js`

### Implementation for US3

- [ ] T026 [P] [US3] Crear el componente del carrito con líneas, controles de cantidad, botón de quitar y totales en `src/components/cart.js`
- [ ] T027 [US3] Conectar las operaciones del carrito y el recálculo de subtotal/total en `src/storage.js` y `src/app.js`
- [ ] T028 [P] [US3] Dar estilo al panel del carrito, líneas, controles de cantidad y resumen de totales en `src/styles.css`

**Checkpoint**: US3 es funcional y persistente de forma independiente.

---

## Phase 6: User Story 4 - Aplicación de códigos de descuento (Priority: P4)

**Goal**: Validar cupones por código, vigencia y límite de uso; aplicar descuento porcentual o fijo, notificar resultado y restaurar el total al quitarlos.

**Independent Test**: Aplicar un cupón válido y verificar descuento en tiempo real y en `localStorage`; un cupón inválido, vencido o agotado debe mostrar error; al quitarlo o recargar, el total vuelve al original salvo que se haya eliminado explícitamente.

### Tests for US4

- [ ] T029 [P] [US4] Añadir pruebas unitarias de cupones válidos, inválidos, vencidos y agotados en `tests/unit/coupons.test.js`
- [ ] T030 [P] [US4] Añadir la prueba de integración de aplicar y quitar cupones con actualización del total en `tests/integration/coupons.test.js`

### Implementation for US4

- [ ] T031 [P] [US4] Crear el componente de entrada de cupón con notificaciones de éxito y error en `src/components/coupon-form.js`
- [ ] T032 [US4] Conectar la validación, aplicación, eliminación y restauración del cupón con el total del carrito en `src/app.js` y `src/coupons.js`
- [ ] T033 [P] [US4] Dar estilo al campo de cupón y a los avisos de éxito/error en `src/styles.css`

**Checkpoint**: US4 es funcional de forma independiente sobre el carrito de US3.

---

## Phase 7: User Story 5 - Proceso de pago seguro (Priority: P5)

**Goal**: Recoger datos de envío y método de pago, validar obligatorios, simular pasarela, descontar stock y mostrar confirmación con número `PED-YYYYMMDD-NNNN`.

**Independent Test**: Completar dirección y pago, confirmar y llegar a la confirmación con número de pedido; si falta un campo obligatorio, se resalta y se impide continuar.

### Tests for US5

- [ ] T034 [P] [US5] Añadir pruebas unitarias de validación de checkout y generación del número de pedido en `tests/unit/checkout.test.js`
- [ ] T035 [P] [US5] Añadir la prueba de integración del flujo de checkout, errores de campos obligatorios y confirmación en `tests/integration/checkout.test.js`

### Implementation for US5

- [ ] T036 [P] [US5] Crear el formulario de checkout con campos de envío, método de pago y mensajes de validación en `src/components/checkout-form.js`
- [ ] T037 [US5] Crear la vista de confirmación con número de pedido y resumen de la compra en `src/components/order-confirmation.js`
- [ ] T038 [US5] Implementar la validación del checkout, descuento de stock, persistencia del pedido y enrutado a la confirmación en `src/app.js` y `src/storage.js`
- [ ] T039 [US5] Implementar la pasarela de pago simulada con éxito, rechazo y timeout reintentable en `src/payments.js`
- [ ] T040 [P] [US5] Dar estilo al formulario de checkout, estados de error y vista de confirmación en `src/styles.css`

**Checkpoint**: El embudo de compra está completo hasta la confirmación del pedido.

---

## Phase 8: User Story 6 - Historial y seguimiento de Documentos de Venta (Priority: P6)

**Goal**: Consultar por cliente el tipo, fecha, monto y estado de sus documentos de venta y enmascarar `creditLimit` para roles sin permiso financiero.

**Independent Test**: Abrir la ficha de un cliente con operaciones previas y ver el detalle; cambiar a un rol sin `canViewFinancials` y verificar que el límite de crédito aparece como `•••••`.

### Tests for US6

- [ ] T041 [P] [US6] Añadir pruebas unitarias de obtención del historial por cliente y enmascaramiento por rol en `tests/unit/order-history.test.js`
- [ ] T042 [P] [US6] Añadir la prueba de integración de la vista de historial, estados y límite de crédito enmascarado en `tests/integration/order-history.test.js`

### Implementation for US6

- [ ] T043 [P] [US6] Crear el componente de historial con tipo de documento, fecha, monto y estado en `src/components/order-history.js`
- [ ] T044 [US6] Implementar la consulta del historial por cliente y el enmascaramiento de `creditLimit` según el rol en `src/app.js` y `src/module-config.js`
- [ ] T045 [P] [US6] Dar estilo a la tabla de historial y a las insignias de estado en `src/styles.css`

**Checkpoint**: US6 es funcional y comprobable de forma independiente.

---

## Phase 9: User Story 7 - Administración de precios y generación de ofertas (Priority: P7)

**Goal**: Permitir al administrador editar precios y crear/editar/activar/desactivar/eliminar ofertas con vigencia; el catálogo y el carrito aplican el precio efectivo; los demás roles reciben un mensaje de permisos. El acceso se solicita con el código `1234`.

**Independent Test**: Ingresar al panel con código `1234`, cambiar un precio y verlo reflejado; crear una oferta y comprobar precio tachado, insignia y descuento en el carrito; desactivarla y verificar que vuelve el precio original; entrar con otro rol y comprobar el mensaje de denegación.

### Tests for US7

- [ ] T046 [P] [US7] Añadir pruebas unitarias de validación de ofertas (porcentaje/monto, descuento > 100 %, fecha fin anterior a inicio, inactiva/vencida) en `tests/unit/offers.test.js`
- [ ] T047 [P] [US7] Añadir pruebas unitarias de resolución de precio con oferta y totales de línea del carrito en `tests/unit/offer-pricing.test.js`
- [ ] T048 [P] [US7] Añadir pruebas de integración del panel (edición de precio, CRUD de ofertas, restricción por rol y reflejo en catálogo/carrito) en `tests/integration/admin-panel.test.js`

### Implementation for US7

- [ ] T049 [P] [US7] Extender la configuración con el rol `admin`, etiquetas de administración/ofertas y el ayudante `canManageCatalog` en `src/module-config.js`
- [ ] T050 [P] [US7] Implementar el modelo de oferta, su validación y la resolución de la mejor oferta activa por producto en `src/offers.js`
- [ ] T051 [P] [US7] Crear las ofertas semilla con producto, tipo, valor y vigencia en `src/data/offers.js`
- [ ] T052 [US7] Añadir el CRUD de ofertas (`erp.offers`), la validación de precio numérico no negativo y el cálculo de precios con oferta en `src/storage.js`
- [ ] T053 [US7] Crear el panel con edición de precios, formulario de ofertas, listado, activación/desactivación y mensajes de validación en `src/components/admin-panel.js`
- [ ] T054 [US7] Añadir la vista de administración, la entrada de navegación y la guarda de acceso por rol con mensaje de denegación en `index.html` y `src/app.js`
- [ ] T055 [US7] Conectar los manejadores del panel (precio, alta/edición/desactivación de ofertas y refresco de catálogo/carrito) en `src/app.js`
- [ ] T056 [P] [US7] Mostrar precio con descuento, precio original tachado e insignia de oferta en `src/components/product-card.js` y `src/components/product-catalog.js`
- [ ] T057 [US7] Aplicar el precio de oferta en el renderizado y los totales del carrito en `src/components/cart.js` y `src/app.js`
- [ ] T058 [P] [US7] Dar estilo al panel, formularios de oferta, insignias y precio original tachado en `src/styles.css`
- [ ] T059 [US7] Cubrir casos límite de US7 (oferta vencida/desactivada restaura precio, descuento > 100 % y fechas inválidas rechazadas, cambio de precio con producto en carrito recalcula total) en `src/offers.js` y `src/app.js`
- [ ] T060 [US7] Actualizar el script `test:002` en `package.json` para incluir las pruebas de ofertas y administración

**Checkpoint**: US7 es funcional y comprobable de forma independiente sobre US1 y US3.

---

## Phase 10: User Story 8 - Panel de métricas e indicadores de ventas (Priority: P8)

**Goal**: Calcular y mostrar ingresos totales, cantidad de ventas, ticket promedio, distribución de documentos por estado, ranking de productos más vendidos por unidades e ingresos, alertas de stock bajo, uso acumulado de cupones/ofertas y filtros por rango de fechas o categoría.

**Independent Test**: Ingresar al panel con perfil de dueño/administrador, comprobar los indicadores frente a los pedidos existentes, registrar una compra nueva y verificar que montos, conteos y rankings se actualizan; aplicar un filtro y comprobar el recálculo; sin datos, ver ceros y un estado vacío sin errores.

### Tests for US8

- [ ] T061 [P] [US8] Añadir pruebas unitarias de ingresos, cantidad de ventas, ticket promedio y distribución por estado en `tests/unit/metrics.test.js`
- [ ] T062 [P] [US8] Añadir pruebas unitarias de ranking por unidades/ingresos, alertas de stock, filtros fecha/categoría, uso de cupones/ofertas y estado vacío en `tests/unit/metrics-filters.test.js`
- [ ] T063 [P] [US8] Añadir la prueba de integración del panel de métricas (renderizado, filtros, guarda por rol y refresco tras una compra) en `tests/integration/metrics-dashboard.test.js`

### Implementation for US8

- [ ] T064 [US8] Implementar el cálculo puro de métricas a partir de `erp.orders`, `erp.products`, `erp.coupons` y `erp.offers` en `src/metrics.js` (usar `src/storage.js` y `src/utils.js`)
- [ ] T065 [US8] Añadir las etiquetas del panel y el permiso `canViewMetrics` (solo `admin`) en `src/module-config.js`
- [ ] T066 [US8] Añadir el botón `button[data-view="metrics"]` y la sección `#view-metrics` con `#metrics-title`, `#metrics-from`, `#metrics-to`, `#metrics-category`, `#metrics-apply`, `#metrics-reset`, `#metrics-kpis`, `#metrics-status`, `#metrics-top-products`, `#metrics-stock-alerts`, `#metrics-discounts` y `#metrics-empty` en `index.html`
- [ ] T067 [US8] Crear el componente del panel con tarjetas KPI, tabla de estados, rankings, alertas, estado vacío y escape de todos los valores en `src/components/metrics-dashboard.js`
- [ ] T068 [US8] Cablear `renderMetrics`, los filtros, la guarda por `canViewMetrics` y el refresco tras checkout/cambios de oferta en `src/app.js`
- [ ] T069 [P] [US8] Dar estilo a las tarjetas KPI, tablas, rankings y alertas reutilizando los estilos `.kpi-grid`, `.kpi-card` y `.metric-highlights` en `src/styles.css`
- [ ] T070 [US8] Cubrir casos límite (pedidos cancelados fuera de ingresos, división por cero, ofertas vencidas, rango de fechas vacío, cupón usado en el checkout) en `src/metrics.js` y `src/app.js`
- [ ] T071 [US8] Incluir `tests/unit/metrics.test.js`, `tests/unit/metrics-filters.test.js` y `tests/integration/metrics-dashboard.test.js` en el script `test:002` de `package.json` y verificar `npm run test:002` y `npm run build`

**Checkpoint**: US8 es funcional y comprobable de forma independiente sobre los pedidos de US5 y los productos de US1.

---

## Phase 11: User Story 9 - Vistas y navegación diferenciadas por rol (Priority: P9)

**Goal**: Adaptar navegación, vistas, acciones y datos sensibles al rol activo (Cliente, Vendedor, Dueño/Administrador), bloquear el acceso directo a secciones restringidas y permitir volver a la vista pública de Cliente al cerrar la sesión interna.

**Independent Test**: Acceder con cada perfil y verificar que cambian la barra de navegación, las pantallas y las acciones; abrir directamente una vista restringida y comprobar el aviso de acceso restringido y el regreso a la vista autorizada; cerrar sesión interna y comprobar el retorno al catálogo público.

### Tests for US9

- [ ] T072 [P] [US9] Añadir pruebas unitarias de los permisos por rol, la visibilidad de navegación y el retorno al catálogo en `tests/unit/role-permissions.test.js`
- [ ] T073 [P] [US9] Añadir pruebas de integración de las vistas por rol (Cliente, Vendedor, Dueño), acceso directo bloqueado, aviso y cierre de sesión en `tests/integration/role-views.test.js`

### Implementation for US9

- [ ] T074 [US9] Añadir el rol `customer`, los permisos `canViewHistory`, `canViewStock` y `canViewMetrics`, y las etiquetas `logout`/`accessRestricted` en `src/module-config.js`
- [ ] T075 [US9] Añadir `data-requires` a los botones de navegación y los controles `#role-logout` y `#role-denied` con `role="alert"` en `index.html`
- [ ] T076 [US9] Implementar `canAccessView`, el filtrado de navegación por rol, la guarda de `showView` con redirección al catálogo y el manejo de cambio/cierre de rol en `src/app.js`
- [ ] T077 [P] [US9] Mostrar las unidades disponibles solo a roles con `canViewStock` en `src/components/product-card.js` y `src/components/product-catalog.js`
- [ ] T078 [US9] Alinear las pruebas existentes de configuración e historial con el nuevo rol `customer` y los permisos por vista en `tests/unit/module-config.test.js` y `tests/integration/order-history.test.js`
- [ ] T079 [P] [US9] Dar estilo al selector de rol, al botón de cierre de sesión y al aviso de acceso restringido en `src/styles.css`
- [ ] T080 [US9] Cubrir la expiración/cambio de sesión privilegiada mientras se editan ofertas o se consultan métricas, revocando la vista y volviendo al catálogo en `src/app.js` y `src/module-config.js`

**Checkpoint**: Todas las historias de usuario son funcionales y comprobables de forma independiente.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Seguridad, accesibilidad, casos límite, alineación de datos semilla, documentación y verificación final.

- [ ] T081 [P] Reforzar la sanitización de entradas y el escape de HTML/atributos antes de renderizar en `src/app.js`, `src/components/product-card.js`, `src/components/cart.js`, `src/components/admin-panel.js`, `src/components/order-history.js` y `src/components/metrics-dashboard.js`
- [ ] T082 [P] Añadir refinamientos de accesibilidad (etiquetas, foco, teclado, texto alternativo de insignias) en `index.html` y `src/styles.css`
- [ ] T083 [P] Cubrir casos límite del embudo (última unidad en stock, expiración de cupón durante checkout, timeout de pasarela) en `src/app.js`, `src/coupons.js` y `src/payments.js`
- [ ] T084 [P] Alinear los datos semilla y las pruebas de US2 con el escenario "smartphone" y precio máximo de AC1/FR-001, recuperando el mensaje vacío y el reinicio en `src/data/products.js` y `tests/integration/product-filters.test.js`
- [ ] T085 [P] Verificar `#role-select`, `setRole` y el enmascaramiento de `creditLimit` al cambiar a `finance` en `index.html`, `src/app.js` y `tests/integration/order-history.test.js`
- [ ] T086 [P] Verificar la guarda `canManageCatalog` y el código de acceso `1234` sin romper el mensaje de permisos en `src/app.js`, `src/components/admin-panel.js` y `tests/integration/admin-panel.test.js`
- [ ] T087 [P] Revisar y alinear con `spec.md`, `plan.md` y `DEFAULT_CONFIG` cualquier marca, barra de anuncio o imagen externa no solicitada en `index.html` y `src/data/products.js`
- [ ] T088 [P] Mantener la prueba de extremo a extremo del embudo completo (catálogo → filtros → carrito → cupón → checkout → confirmación → historial) en `tests/integration/purchase-funnel.test.js`
- [ ] T089 [P] Mantener la prueba de extremo a extremo del ciclo de oferta (admin crea oferta → catálogo muestra descuento → carrito aplica precio → oferta se desactiva → precio original) en `tests/integration/offer-lifecycle.test.js`
- [ ] T090 [P] Actualizar `specs/002-modulo-ventas/plan.md`, `specs/002-modulo-ventas/data-model.md` y `README.md` con US8, US9, la entidad de métricas derivadas, el rol `customer`, los permisos por vista y el estado actual de cada historia
- [ ] T091 Ejecutar `npm run test:002`, `npm test` y `npm run build`; verificar manualmente catálogo, filtros, carrito, cupones, checkout, historial, administración, métricas y cambio de roles, registrando los resultados en `specs/002-modulo-ventas/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Foundational (Phase 2)**: Depende de Setup; **BLOQUEA** todas las historias.
- **US1 (Phase 3)**: Depende de Foundational; es el MVP.
- **US2 (Phase 4)**: Depende de US1 (productos y catálogo).
- **US3 (Phase 5)**: Depende de US1 (productos y precios).
- **US4 (Phase 6)**: Depende de US3 (carrito y totales).
- **US5 (Phase 7)**: Depende de US3 y US4.
- **US6 (Phase 8)**: Depende de US5 (pedidos persistidos) y de los datos de cliente.
- **US7 (Phase 9)**: Depende de US1 y US3; integra con US2, US4 y US5 sin alterar sus flujos.
- **US8 (Phase 10)**: Depende de US1, US5 y US7 (productos, pedidos, cupones y ofertas como fuente de métricas).
- **US9 (Phase 11)**: Depende de US6, US7 y US8 (necesita las vistas que debe gobernar: historial, administración y métricas).
- **Polish (Phase 12)**: Depende de todas las historias deseadas, incluidas US8 y US9.

### User Story Dependencies

- **US1 (P1)**: Sin dependencias entre historias tras la fase Foundational; MVP.
- **US2 (P2)**: Requiere US1.
- **US3 (P3)**: Requiere US1.
- **US4 (P4)**: Requiere US3.
- **US5 (P5)**: Requiere US3 y US4.
- **US6 (P6)**: Requiere US5.
- **US7 (P7)**: Requiere US1 y US3.
- **US8 (P8)**: Requiere US1, US5 y US7.
- **US9 (P9)**: Requiere US6, US7 y US8.

### Within Each User Story

- Las pruebas marcadas en la fase de historia se escriben primero y deben fallar antes de la implementación (Constitución II).
- Modelos/utilidades puras antes que componentes; componentes antes que el cableado en `src/app.js`.
- La implementación base precede a las integraciones con otras historias.
- No se marca una historia como completa hasta que su prueba independiente pasa.

### Parallel Opportunities

- T002, T003 y T004 pueden ejecutarse en paralelo dentro de Setup.
- T008, T009, T011 y T012 pueden ejecutarse en paralelo dentro de Foundational.
- Las pruebas unitarias y de integración de una misma historia marcadas `[P]` pueden ejecutarse en paralelo.
- T049, T050 y T051 (configuración, modelo de ofertas y semilla de US7) pueden ejecutarse en paralelo.
- T056 y T058 (componentes y estilos de US7) pueden ejecutarse en paralelo tras T050 y T052.
- T061, T062 y T063 (pruebas de US8) pueden ejecutarse en paralelo.
- T064, T066 y T067 (cálculo, markup y componente de US8) pueden ejecutarse en paralelo tras T065.
- T072 y T073 (pruebas de US9) pueden ejecutarse en paralelo.
- T077 y T079 (componentes de stock y estilos de rol de US9) pueden ejecutarse en paralelo tras T074 y T075.
- T081–T090 pueden ejecutarse en paralelo antes de la verificación final T091.
- **Aviso de archivos compartidos**: `src/module-config.js`, `src/app.js`, `index.html`, `src/styles.css` y `package.json` se tocan en varias fases; dentro de una misma fase, las tareas que los modifican no deben ejecutarse en paralelo entre sí.

---

## Parallel Example: User Story 8

```bash
# Pruebas de US8 en paralelo:
Task: "Añadir pruebas unitarias de ingresos, ventas y ticket promedio en tests/unit/metrics.test.js"
Task: "Añadir pruebas unitarias de filtros y rankings en tests/unit/metrics-filters.test.js"
Task: "Añadir la prueba de integración del panel en tests/integration/metrics-dashboard.test.js"

# Base de US8 en paralelo:
Task: "Implementar el cálculo de métricas en src/metrics.js"
Task: "Añadir el markup de #view-metrics en index.html"
Task: "Crear el componente del panel en src/components/metrics-dashboard.js"
```

## Parallel Example: User Story 9

```bash
# Pruebas de US9 en paralelo:
Task: "Añadir pruebas unitarias de permisos en tests/unit/role-permissions.test.js"
Task: "Añadir pruebas de integración de vistas por rol en tests/integration/role-views.test.js"

# Presentación de US9 en paralelo:
Task: "Mostrar stock a roles internos en src/components/product-card.js"
Task: "Dar estilo al selector y al aviso de acceso en src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup.
2. Completar Phase 2: Foundational (**CRÍTICO**, bloquea todo).
3. Completar Phase 3: US1 - Catálogo de productos destacados.
4. **DETENERSE Y VALIDAR**: probar catálogo, precios y estado agotado de forma independiente.
5. Desplegar/demostrar si está listo.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → validar → desplegar (MVP).
3. US2 → validar → desplegar.
4. US3 → validar → desplegar.
5. US4 → validar → desplegar.
6. US5 → validar → desplegar.
7. US6 → validar → desplegar.
8. US7 → validar (precio, ofertas y permisos) → desplegar.
9. US8 → validar (indicadores, filtros y estado vacío) → desplegar.
10. US9 → validar (navegación, acceso directo y cierre de sesión) → desplegar.
11. Pulido y verificación final.

### Parallel Team Strategy

1. El equipo completa Setup + Foundational en conjunto.
2. Tras la Foundational:
   - Desarrollador A: US1 → US2.
   - Desarrollador B: US3 → US4.
   - Desarrollador C: US5 → US6.
   - Desarrollador D: US7.
3. Con US5/US7 listas:
   - Desarrollador C: US8 (`src/metrics.js`, `src/components/metrics-dashboard.js`, `tests/unit/metrics*.test.js`, `tests/integration/metrics-dashboard.test.js`).
   - Desarrollador D: US9 (`src/module-config.js`, `index.html`, `src/app.js`, `tests/unit/role-permissions.test.js`, `tests/integration/role-views.test.js`) coordinando los archivos compartidos con US8.
4. Integrar y validar cada historia de forma independiente antes del pulido.

---

## Notes

- `[P]` indica archivos distintos y sin dependencias pendientes dentro de la misma fase.
- `[USn]` permite la trazabilidad de cada tarea a su historia de usuario en `spec.md`.
- Cada historia debe poder completarse y probarse de forma independiente.
- Las pruebas se escriben primero y deben fallar antes de la implementación (Constitución II).
- No se agrupan cambios no relacionados en una misma tarea; se confirma después de cada tarea o grupo lógico.
- `plan.md` y `data-model.md` conservan un modelo B2B de referencia; la entrega es la tienda en línea descrita en `spec.md` y en la sección final de `data-model.md`.
- Las suites heredadas del módulo base 001 (`tests/integration/add-document.test.js`, `create-entity.test.js`, `custom-fields.test.js`, `dashboard.test.js`, `edit-delete-entity.test.js`, `manage-document.test.js`, `manage-tabs.test.js`, `relabeling.test.js`, `search-entities.test.js`, `workspace-shell.test.js`, `tests/unit/storage.test.js`, etc.) dependen de APIs (`addEntity`/`addDocument`, `BASE_FIELDS`) fuera del alcance 002; `npm run test:002` es la referencia de verificación del alcance implementado.
