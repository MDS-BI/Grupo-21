---
description: "Task list for feature implementation"
---

# Tasks: Módulo de Ventas (Tienda Online)

**Input**: Design documents from `/specs/002-modulo-ventas/`

**Prerequisites**: `spec.md` (fuente de verdad de US1–US9 y FR-001–FR-010), `plan.md` (stack y estado de implementación), `data-model.md` (entidades), `public/images/producto-1.jpg` … `public/images/producto-8.jpg`, `public/images/hero-banner.jpg`

**Available docs reported by setup**: `data-model.md`. No hay `contracts/`, `research.md`, `quickstart.md` ni `.specify/memory/constitution.md`.

**Tests**: Incluidas porque `spec.md` define una prueba independiente para cada historia y porque la verificación del módulo 002 usa `npm run test:002`.

**Organization**: Las tareas se agrupan por historia de usuario para permitir implementación, verificación y entrega independientes.

> **Nota de regeneración**: Este checklist refleja `spec.md` actualizado: FR-007 exige gráficos interactivos e historial de al menos 12 pedidos RootSouth en los últimos 3 meses; FR-008 exige exactamente 3 roles; FR-010 exige Hero Banner, 4 destacados en una fila y catálogo general de 4 columnas. Todas las tareas quedan sin marcar para que cada ejecutor valide el estado real del repositorio antes de marcarlas.

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Etiqueta de la historia (US1–US9). Solo aparece en las fases de historia de usuario.
- Todas las tareas incluyen checkbox, ID secuencial, marcadores aplicables y ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `tests/` en la raíz del repositorio.
- Componentes: `src/components/`. Datos semilla: `src/data/`. Imágenes: `public/images/`. Pruebas: `tests/unit/`, `tests/integration/`.
- Configuración de pruebas: `vitest.config.mjs`, `tests/setup/jsdom.js`, `tests/helpers/app-fixture.js`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la estructura Vite, las dependencias, el arnés de pruebas y los contenedores base del HTML.

- [ ] T001 Verificar la estructura Vite con `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `src/components/`, `src/data/`, `public/images/`, `tests/unit/`, `tests/integration/`, `tests/setup/` y `tests/helpers/`
- [ ] T002 [P] Confirmar scripts y dependencias de Vite, Vitest y jsdom en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [ ] T003 [P] Confirmar el arnés de pruebas con jsdom y aislamiento de `localStorage` por prueba en `tests/setup/jsdom.js` y `tests/helpers/app-fixture.js`
- [ ] T004 [P] Confirmar los contenedores de catálogo, carrito, checkout, confirmación, historial, administración y métricas en `index.html`

**Checkpoint**: Estructura, dependencias y arnés de pruebas listos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistencia versionada, datos semilla RootSouth, configuración de roles, arranque y estilos base compartidos.

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T005 Implementar las claves de almacenamiento, `erp.seedVersion` y `ensureSeedSchema()` en `src/storage.js`
- [ ] T006 Implementar el CRUD de productos con `id`, nombre, descripción, `image`, precio, stock, categoría y destacado en `src/storage.js`
- [ ] T007 Implementar almacenamiento de clientes y pedidos, integridad referencial y eliminación en cascada en `src/storage.js`
- [ ] T008 Implementar el estado y la persistencia del carrito en `src/storage.js`
- [ ] T009 [P] Implementar el modelo, almacenamiento y validación de cupones en `src/coupons.js`
- [ ] T010 Crear la configuración base con etiquetas de tienda y exactamente los roles `customer`, `sales` y `admin`, junto con `canAccessView`, `canViewFinancials`, `canManageCatalog` y `canViewMetrics`, en `src/module-config.js`
- [ ] T011 Implementar el arranque de la aplicación, el enrutado de vistas y los ayudantes de renderizado en `src/app.js`
- [ ] T012 [P] Crear los tokens base editoriales (blanco `#FFFFFF`, gris claro `#F4F4F4`, negro `#111111`, grises neutros, radio `0px`, tipografía sans-serif y mayúsculas espaciadas) en `src/styles.css`
- [ ] T013 [P] Crear `seedOrders` con al menos 12 pedidos RootSouth fechados en los últimos 3 meses, con estados `Cotización`, `Pedido`, `Facturado` y `Cancelado`, categorías variadas y solo IDs de `src/data/products.js`, en `src/data/seed-orders.js`
- [ ] T014 [P] Alinear las ofertas semilla con productos RootSouth y vigencias explícitas en `src/data/offers.js`
- [ ] T015 [P] Definir los cupones semilla con códigos, tipos, vigencia y límite de uso en `src/coupons.js`
- [ ] T016 Ajustar el fixture de pruebas para limpiar `erp.seedVersion` antes de cada caso en `tests/helpers/app-fixture.js`

**Checkpoint**: Base versionada, semillas RootSouth, roles y estilos listos; las historias pueden comenzar.

---

## Phase 3: User Story 1 - Catálogo de productos destacados (Priority: P1)

**Goal**: Mostrar la portada con Hero Banner, 8 productos reales de RootSouth con imágenes `<img>`, 4 destacados en una sola fila, catálogo general de 4 columnas, precio y botón de compra; los productos sin stock muestran “Agotado” y no se pueden comprar.

**Independent Test**: Abrir la página principal y verificar el Hero Banner con `/images/hero-banner.jpg`, 4 tarjetas destacadas en una fila y 8 tarjetas en el catálogo general de 4 columnas; poner un producto en stock 0 y comprobar la insignia “Agotado” y el botón deshabilitado.

### Tests for US1

- [ ] T017 [P] [US1] Añadir pruebas unitarias de los 8 productos RootSouth, exactamente 4 destacados, imágenes `/images/producto-N.jpg` y disponibilidad por stock en `tests/unit/products.test.js`
- [ ] T018 [P] [US1] Añadir la prueba de integración del catálogo con Hero Banner, `<img>`, nombres, precios, botón de compra, 4 destacados, 4 columnas y estado agotado en `tests/integration/product-catalog.test.js`

### Implementation for US1

- [ ] T019 [P] [US1] Reemplazar el catálogo semilla de tecnología por las 8 prendas RootSouth con `image` y marcar solo 4 como `featured` en `src/data/products.js`
- [ ] T020 [P] [US1] Renderizar la imagen con `<img>`, `alt`, categoría, precio, insignia de agotado y botón deshabilitado en `src/components/product-card.js`
- [ ] T021 [P] [US1] Renderizar `#featured-grid` con máximo 4 productos y `#catalog-grid` como grilla plana de 4 columnas en `src/components/product-catalog.js`
- [ ] T022 [US1] Conectar la portada, los destacados, el catálogo general y el estado de stock con la vista de inicio en `src/app.js`
- [ ] T023 [P] [US1] Aplicar Hero Banner con overlay oscuro, tipografía blanca de alto contraste, acentos sobrios y grillas de 4 columnas en `src/styles.css`
- [ ] T024 [US1] Confirmar que `public/images/hero-banner.jpg` y `public/images/producto-1.jpg` … `public/images/producto-8.jpg` se sirven como recursos públicos según `vite.config.js`

**Checkpoint**: US1 es funcional y comprobable de forma independiente; este es el MVP visual y comercial.

---

## Phase 4: User Story 2 - Filtrado de productos por categoría y precio (Priority: P2)

**Goal**: Filtrar el catálogo RootSouth por categoría y precio máximo, con mensaje claro y reinicio cuando no hay resultados.

**Independent Test**: Seleccionar “Poleras” de RootSouth y un precio máximo; el listado debe mostrar solo coincidencias. Sin coincidencias, aparece el mensaje de resultados vacíos y el botón de reinicio.

### Tests for US2

- [ ] T025 [P] [US2] Añadir pruebas unitarias del filtrado combinado por “Poleras” y precio máximo, incluido el caso sin resultados, en `tests/unit/product-filters.test.js`
- [ ] T026 [P] [US2] Añadir la prueba de integración de la interfaz de filtros actualizando el catálogo y el estado vacío en `tests/integration/product-filters.test.js`

### Implementation for US2

- [ ] T027 [US2] Implementar el filtrado puro por categoría y precio máximo sobre `filterProducts`, `productCategories` y `featuredProducts` en `src/catalog.js`
- [ ] T028 [P] [US2] Crear los controles de categoría, precio máximo, mensaje vacío y reinicio en `src/components/product-filters.js`
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
- [ ] T034 [US3] Implementar las operaciones del carrito, el respeto al stock y el recálculo con `getCartDetails()` en `src/storage.js`
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
- [ ] T048 [P] [US5] Implementar la pasarela simulada con éxito, rechazo y timeout reintentable en `src/payments.js`
- [ ] T049 [US5] Conectar checkout, pago y confirmación con la aplicación en `src/app.js`
- [ ] T050 [P] [US5] Dar estilo al formulario, estados de error y confirmación en `src/styles.css`

**Checkpoint**: El embudo de compra está completo hasta la confirmación del pedido.

---

## Phase 8: User Story 6 - Historial y seguimiento de Documentos de Venta (Priority: P6)

**Goal**: Consultar por cliente el tipo, fecha, monto y estado de sus documentos de venta, incluidos al menos 12 pedidos iniciales RootSouth de los últimos 3 meses, y enmascarar `creditLimit` para roles sin permiso financiero.

**Independent Test**: Abrir la ficha de un cliente con pedidos iniciales RootSouth y ver el detalle completo; cambiar a Cliente o Vendedor y verificar que el límite de crédito aparece como `•••••`.

### Tests for US6

- [ ] T051 [P] [US6] Añadir pruebas unitarias de obtención del historial por cliente, al menos 12 pedidos semilla y enmascaramiento por rol en `tests/unit/order-history.test.js`
- [ ] T052 [P] [US6] Añadir la prueba de integración de la vista de historial, estados, fechas de los últimos 3 meses y límite de crédito enmascarado en `tests/integration/order-history.test.js`

### Implementation for US6

- [ ] T053 [P] [US6] Crear el componente de historial con tipo de documento, fecha, número, monto y estado en `src/components/order-history.js`
- [ ] T054 [US6] Implementar la consulta del historial por cliente y el enmascaramiento de `creditLimit` según el rol en `src/app.js`
- [ ] T055 [US6] Cargar los pedidos iniciales RootSouth desde `src/data/seed-orders.js` durante la migración en `src/storage.js`
- [ ] T056 [P] [US6] Dar estilo a la tabla de historial y a las insignias de estado semánticas en `src/styles.css`

**Checkpoint**: US6 es funcional y comprobable de forma independiente con el nuevo historial semilla.

---

## Phase 9: User Story 7 - Administración de precios y generación de ofertas (Priority: P7)

**Goal**: Permitir al Dueño/Administrador editar precios y crear/editar/activar/desactivar/eliminar ofertas con vigencia; el catálogo y el carrito aplican el precio efectivo sobre productos RootSouth; los demás roles reciben mensaje de permisos. El acceso usa el código `1234`.

**Independent Test**: Ingresar al panel con rol Dueño/Administrador y código `1234`, cambiar un precio y verlo reflejado; crear una oferta sobre una prenda RootSouth y comprobar precio tachado, insignia y descuento en el carrito; desactivarla y verificar que vuelve el precio original; comprobar que Cliente y Vendedor no pueden abrir Administración aunque conozcan el código.

### Tests for US7

- [ ] T057 [P] [US7] Añadir pruebas unitarias de validación de ofertas, vigencia, descuento máximo y producto existente en `tests/unit/offers.test.js`
- [ ] T058 [P] [US7] Añadir pruebas unitarias de resolución de precio con oferta y totales de línea del carrito en `tests/unit/offer-pricing.test.js`
- [ ] T059 [P] [US7] Añadir pruebas de integración del panel de administración, código correcto, código incorrecto y denegación para Cliente/Vendedor en `tests/integration/admin-panel.test.js`

### Implementation for US7

- [ ] T060 [P] [US7] Añadir etiquetas de administración, ofertas y permisos `canManageCatalog` al rol `admin` en `src/module-config.js`
- [ ] T061 [P] [US7] Implementar la validación y resolución de la mejor oferta activa en `src/offers.js`
- [ ] T062 [US7] Añadir el CRUD de ofertas y la validación de precio numérico no negativo en `src/storage.js`
- [ ] T063 [US7] Crear el panel con edición de precios, formulario de ofertas, listado y mensajes en `src/components/admin-panel.js`
- [ ] T064 [US7] Añadir la vista de administración, el acceso por código y los controles `#admin-code`, `#admin-access-submit` y `#admin-access-error` en `index.html`
- [ ] T065 [US7] Cablear la guarda de acceso, la navegación y el renderizado de administración en `src/app.js`
- [ ] T066 [US7] Conectar los manejadores del panel y refrescar catálogo y carrito tras cambios de precios u ofertas en `src/app.js`
- [ ] T067 [P] [US7] Dar estilo al panel, formularios, insignias y precio original tachado con acentos sobrios en `src/styles.css`

**Checkpoint**: US7 es funcional y comprobable de forma independiente sobre US1 y US3.

---

## Phase 10: User Story 8 - Panel de métricas e indicadores de ventas (Priority: P8)

**Goal**: Calcular y mostrar ingresos, ventas, ticket promedio, distribución de documentos por estado, ranking, alertas de stock y uso de cupones/ofertas desde al menos 12 pedidos RootSouth de los últimos 3 meses, con filtros y visualizaciones gráficas interactivas: barras de ingresos por categoría, evolución de ventas por fecha, distribución proporcional por estado con colores semánticos y barras de progreso en el ranking.

**Independent Test**: Ingresar con perfil Dueño/Administrador, comprobar los indicadores frente a los pedidos iniciales RootSouth, verificar las cuatro visualizaciones, hacer clic en una barra/columna para filtrar, registrar una compra nueva y comprobar el refresco; sin datos, ver ceros y estado vacío.

### Tests for US8

- [ ] T068 [P] [US8] Añadir pruebas unitarias de ingresos, ventas, ticket promedio, estados, `revenueByCategory`, `salesByDate`, `statusDistribution` y progreso del ranking en `tests/unit/metrics.test.js`
- [ ] T069 [P] [US8] Añadir pruebas unitarias del markup de gráficos de barras, evolución, distribución proporcional y barras de progreso en `tests/unit/metrics-charts.test.js`
- [ ] T070 [P] [US8] Añadir pruebas unitarias de filtros de fecha/categoría, estado vacío y recálculo de todas las agregaciones gráficas en `tests/unit/metrics-filters.test.js`
- [ ] T071 [P] [US8] Añadir la prueba de integración del panel con gráficos, colores semánticos, interactividad, 12 pedidos semilla, compra nueva y acceso restringido en `tests/integration/metrics-dashboard.test.js`

### Implementation for US8

- [ ] T072 [US8] Extender `computeMetrics()` con agregaciones por categoría, serie temporal por fecha, distribución proporcional por estado y valores de progreso del ranking en `src/metrics.js`
- [ ] T073 [P] [US8] Crear ayudantes puros de renderizado para los cuatro tipos de gráficos con `role="img"`, `aria-label`, tooltips y tablas de respaldo en `src/components/metrics-charts.js`
- [ ] T074 [P] [US8] Añadir etiquetas del panel, nombres de gráficos y permiso `canViewMetrics` para `admin` en `src/module-config.js`
- [ ] T075 [US8] Añadir la sección `#view-metrics`, el formulario `#metrics-filter-form`, `#metrics-content` y los contenedores de gráficos en `index.html`
- [ ] T076 [US8] Integrar KPI, gráficos, leyendas, ranking con barras de progreso, alertas y estado vacío en `src/components/metrics-dashboard.js`
- [ ] T077 [US8] Cablear filtros, clics en gráficos, guarda por rol y refresco tras checkout en `src/app.js`
- [ ] T078 [P] [US8] Dar estilo a gráficos, tooltips, estados de foco, tokens semánticos de estado y barras de progreso en `src/styles.css`

**Checkpoint**: US8 es funcional y comprobable de forma independiente sobre US1, US5, US6 y US7.

---

## Phase 11: User Story 9 - Vistas y navegación diferenciadas por rol (Priority: P9)

**Goal**: Adaptar navegación, vistas, acciones y datos sensibles a exactamente tres perfiles —Cliente, Vendedor y Dueño/Administrador—, eliminando Bodega y Finanzas; bloquear acceso directo a secciones restringidas; exigir código `1234` para Administración; permitir volver a la vista pública al cerrar sesión.

**Independent Test**: Verificar que `#role-select` contiene solo `customer`, `sales` y `admin` con etiquetas Cliente, Vendedor y Dueño/Administrador; acceder con cada perfil y comprobar navegación, pantallas y acciones; abrir directamente Métricas o Administración y comprobar el aviso; intentar Administración como Cliente/Vendedor con código `1234` y verificar denegación; cerrar sesión interna y comprobar retorno al catálogo RootSouth.

### Tests for US9

- [ ] T079 [P] [US9] Añadir pruebas unitarias de permisos para exactamente 3 roles, sin `warehouse` ni `finance`, en `tests/unit/role-permissions.test.js`
- [ ] T080 [P] [US9] Añadir pruebas unitarias de configuración de roles, etiquetas y `ROLES` en `tests/unit/module-config.test.js`
- [ ] T081 [P] [US9] Añadir pruebas de integración del selector con 3 opciones, vistas por rol, acceso bloqueado, código `1234` y cierre de sesión en `tests/integration/role-views.test.js`

### Implementation for US9

- [ ] T082 [US9] Eliminar los roles `warehouse` y `finance`, renombrar `sales` a “Vendedor” y conservar solo `customer`, `sales` y `admin` en `src/module-config.js`
- [ ] T083 [US9] Ajustar los controles `data-requires`, `#role-select`, `#role-logout`, `#role-denied` y `#role-denied-return` en `index.html`
- [ ] T084 [US9] Reforzar `canAccessView`, `showView('admin')`, `applyRolePermissions()` y `resetPrivilegedState()` para exigir rol `admin` y desbloqueo con código en `src/app.js`
- [ ] T085 [P] [US9] Mostrar stock solo a roles con `canViewStock` en `src/components/product-card.js`
- [ ] T086 [US9] Alinear `maskCreditLimit()` con los 3 roles vigentes en `src/components/order-history.js`
- [ ] T087 [P] [US9] Actualizar los casos de enmascaramiento y rol del historial para Cliente, Vendedor y Dueño/Administrador en `tests/unit/order-history.test.js`
- [ ] T088 [P] [US9] Actualizar la prueba de integración del historial para usar `admin` como único rol con límite de crédito visible en `tests/integration/order-history.test.js`
- [ ] T089 [P] [US9] Dar estilo al selector de rol, cierre de sesión, aviso de acceso restringido y estados de foco en `src/styles.css`

**Checkpoint**: Todas las historias de usuario son funcionales y comprobables de forma independiente con los requisitos FR-007, FR-008 y FR-010 vigentes.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Seguridad, accesibilidad, casos límite, documentación y verificación final del alcance 002.

- [ ] T090 [P] Reforzar el escape de HTML y atributos antes de renderizar en `src/app.js`, `src/components/product-card.js`, `src/components/cart.js`, `src/components/admin-panel.js`, `src/components/order-history.js`, `src/components/metrics-dashboard.js` y `src/components/metrics-charts.js`
- [ ] T091 [P] Añadir etiquetas, foco, teclado, contraste y texto alternativo de imágenes/gráficos en `index.html`, `src/components/metrics-charts.js` y `src/styles.css`
- [ ] T092 [P] Cubrir casos límite de stock, cupón vencido, pago timeout, oferta cambiada durante compra y expiración de sesión privilegiada en `src/app.js`, `src/coupons.js`, `src/payments.js` y `src/offers.js`
- [ ] T093 [P] Actualizar `specs/002-modulo-ventas/plan.md` con 12 pedidos semilla, 3 roles, gráficos FR-007, Hero Banner y grillas FR-010
- [ ] T094 [P] Actualizar `specs/002-modulo-ventas/data-model.md` con agregaciones de gráficos, distribución por estado, 12 pedidos semilla, 3 roles y Hero Banner
- [ ] T095 [P] Actualizar `README.md` con Hero Banner, 4 destacados, grilla de 4 columnas, gráficos interactivos y roles Cliente/Vendedor/Dueño-Administrador
- [ ] T096 [P] Incluir los nuevos archivos de pruebas de gráficos en el script `test:002` de `package.json`
- [ ] T097 Ejecutar `npm run test:002`, `npm run build` y `npm test`, registrando resultados y suites heredadas fuera de alcance en `specs/002-modulo-ventas/plan.md`

**Checkpoint**: Alcance 002 regenerado, documentado y verificado; no se realizan commits automáticos.

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
- **US6 (Phase 8)**: Depende de US5 y de T013/T055.
- **US7 (Phase 9)**: Depende de US1 y US3; integra con US2, US4 y US5 sin alterar sus flujos.
- **US8 (Phase 10)**: Depende de US1, US5, US6 y US7 porque consume productos, pedidos, cupones y ofertas.
- **US9 (Phase 11)**: Depende de US6, US7 y US8 porque gobierna esas vistas.
- **Polish (Phase 12)**: Depende de todas las historias deseadas.

### User Story Dependencies

- **US1 (P1)**: Sin dependencias entre historias tras Foundational; MVP.
- **US2 (P2)**: Requiere US1.
- **US3 (P3)**: Requiere US1.
- **US4 (P4)**: Requiere US3.
- **US5 (P5)**: Requiere US3 y US4.
- **US6 (P6)**: Requiere US5 y T013/T055.
- **US7 (P7)**: Requiere US1 y US3.
- **US8 (P8)**: Requiere US1, US5, US6 y US7.
- **US9 (P9)**: Requiere US6, US7 y US8.

### Within Each User Story

- Las pruebas marcadas en la fase de historia se escriben primero y deben fallar antes de la implementación.
- Utilidades puras y modelos antes que componentes; componentes antes que el cableado en `src/app.js`.
- La implementación base precede a las integraciones con otras historias.
- No se marca una historia como completa hasta que su prueba independiente pasa.

### Parallel Opportunities

- T002, T003 y T004 pueden ejecutarse en paralelo dentro de Setup.
- T009, T012, T013, T014 y T015 pueden ejecutarse en paralelo dentro de Foundational.
- Pruebas paralelas por historia: T017/T018, T025/T026, T031/T032, T037/T038, T043/T044, T051/T052, T057/T058/T059, T068/T069/T070/T071 y T079/T080/T081.
- Implementación paralela de US1: T019, T020, T021 y T023.
- Implementación paralela de US7: T060 y T061.
- Implementación paralela de US8: T073 y T074; después T075 y T076 pueden avanzar en archivos distintos.
- Implementación paralela de US9: T085, T087, T088 y T089.
- T090–T096 pueden ejecutarse en paralelo antes de T097.
- **Aviso de archivos compartidos**: `src/module-config.js`, `src/app.js`, `index.html`, `src/styles.css`, `src/storage.js` y `package.json` se tocan en varias fases; dentro de una misma fase, las tareas que los modifican no deben ejecutarse en paralelo entre sí.

---

## Parallel Example: User Story 1

```bash
Task: "Añadir pruebas unitarias de los 8 productos RootSouth en tests/unit/products.test.js"
Task: "Añadir la prueba de integración del catálogo con Hero Banner en tests/integration/product-catalog.test.js"

Task: "Reemplazar el catálogo semilla en src/data/products.js"
Task: "Renderizar la tarjeta con <img> en src/components/product-card.js"
Task: "Aplicar Hero Banner y grillas en src/styles.css"
```

## Parallel Example: User Story 8

```bash
Task: "Añadir pruebas unitarias de agregaciones en tests/unit/metrics.test.js"
Task: "Añadir pruebas unitarias de gráficos en tests/unit/metrics-charts.test.js"
Task: "Añadir pruebas unitarias de filtros en tests/unit/metrics-filters.test.js"
Task: "Añadir la prueba de integración del panel en tests/integration/metrics-dashboard.test.js"

Task: "Crear ayudantes de gráficos en src/components/metrics-charts.js"
Task: "Añadir etiquetas y permisos en src/module-config.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup.
2. Completar Phase 2: Foundational (**CRÍTICO**, bloquea todo).
3. Completar Phase 3: US1 con Hero Banner, 4 destacados en una fila, catálogo de 4 columnas y 8 prendas RootSouth.
4. **DETENERSE Y VALIDAR**: probar portada, imágenes, precios, agotados y grillas de forma independiente.
5. Desplegar/demostrar si está listo.

### Incremental Delivery

1. Setup + Foundational → base versionada con 12 pedidos y 3 roles.
2. US1 → validar portada RootSouth → desplegar (MVP).
3. US2 → validar filtros “Poleras” → desplegar.
4. US3 → validar carrito → desplegar.
5. US4 → validar cupones → desplegar.
6. US5 → validar checkout → desplegar.
7. US6 → validar historial de 12 pedidos → desplegar.
8. US7 → validar precios y ofertas condueño/administrador → desplegar.
9. US8 → validar gráficos interactivos y filtros → desplegar.
10. US9 → validar roles y accesos → desplegar.
11. Pulido y verificación final.

### Parallel Team Strategy

1. El equipo completa Setup + Foundational en conjunto.
2. Tras Foundational:
   - Desarrollador A: US1 → US2.
   - Desarrollador B: US3 → US4.
   - Desarrollador C: US5 → US6.
   - Desarrollador D: US7.
3. Con US5/US6/US7 listas:
   - Desarrollador C: US8 (`src/metrics.js`, `src/components/metrics-charts.js`, `src/components/metrics-dashboard.js`, `tests/unit/metrics*.test.js`, `tests/integration/metrics-dashboard.test.js`).
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
- Los recursos visuales obligatorios son `public/images/hero-banner.jpg` y `public/images/producto-1.jpg` … `public/images/producto-8.jpg`; cualquier tarea que cambie el catálogo debe conservar estas rutas.
