---
description: "Task list for feature implementation"
---

# Tasks: Módulo de Ventas — correcciones de cabecera/catálogo/métricas y ronda de Perfil, acceso gerencial y marquesina

**Input**: Design documents from `/specs/002-modulo-ventas/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Available docs reported by setup**: `research.md`, `data-model.md`, `contracts/`, `quickstart.md`. Se carga además `.specify/memory/constitution.md`.

**Tests**: Incluidas porque `plan.md` exige ajustes en `tests/integration/product-catalog.test.js`, `tests/integration/header-shell.test.js`, `tests/integration/product-filters.test.js`, `tests/unit/metrics-charts.test.js`, `tests/integration/metrics-dashboard.test.js`, `tests/integration/admin-panel.test.js`, `tests/integration/offer-lifecycle.test.js`, `tests/integration/role-views.test.js` y `tests/integration/order-history.test.js`, además de `npm run test:002`, `npm test -- --run` y `npm run build`.

**Organization**: Las tareas se agrupan por historia de usuario. La entrega inicial cubre US1, US2, US8 y US9; la ronda actual añade trabajo en US7 y US9 para Perfil, acceso gerencial y marquesina. US3–US6 y US8 se conservan sin cambios en esta ronda.

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes).
- **[Story]**: Etiqueta US1–US9; solo aparece en las fases de historia de usuario.
- Todas las tareas incluyen checkbox, ID secuencial, marcadores aplicables y ruta de archivo exacta.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `tests/` en la raíz del repositorio.
- Contrato de interfaz: `specs/002-modulo-ventas/contracts/ui-header-contract.md`.
- Validación manual: `specs/002-modulo-ventas/quickstart.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar el stack existente, el arnés jsdom y los documentos de diseño antes de tocar código.

- [X] T001 [P] Confirmar la configuración Vite/Vitest y el script `test:002` en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [X] T002 [P] Confirmar el aislamiento de `localStorage` y el helper `mountMarkup()/startApp()/clickNav()` en `tests/setup/jsdom.js` y `tests/helpers/app-fixture.js`
- [X] T003 [P] Confirmar criterios de Hero, cabecera, scroll y gráfico en `specs/002-modulo-ventas/contracts/ui-header-contract.md` y `specs/002-modulo-ventas/quickstart.md`

**Checkpoint**: Stack, fixture y contratos listos; las historias pueden comenzar.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verificar las fuentes de verdad y precedencias que comparten las cuatro correcciones.

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T004 Verificar el orden de `background-image: none !important`, las reglas finales del Hero y la disponibilidad de `#productos-destacados`/`#productos` en `src/styles.css` y `src/components/product-catalog.js`
- [X] T005 Verificar que `showView()` cierra paneles y que `state.filters` conserva `{ category, maxPrice, featuredOnly }` en `src/app.js`
- [X] T006 Verificar que `closeHeaderPanels()` y `handleHeaderClick()` no se duplican al añadir el scroll en `src/app.js` y que `productCategories()` sigue disponible en `src/catalog.js`

**Checkpoint**: Fundamento listo; US1, US2, US8 y US9 pueden implementarse de forma independiente.

---

## Phase 3: User Story 1 - Catálogo de productos destacados (Priority: P1)

**Goal**: Mantener 4 destacados, 8 productos y la grilla de 4 columnas, corrigiendo solo el Hero sin caja blanca.

**Independent Test**: Abrir la portada y verificar `CATÁLOGO DE PRODUCTOS` y subtítulo en blanco sobre el degradado, sin caja blanca; el pill conserva contraste; 4 destacados y 8 tarjetas en 4 columnas siguen visibles.

### Tests for US1

> Escribir primero; deben fallar antes de la implementación.

- [X] T007 [P] [US1] Actualizar aserciones de Hero, ausencia de caja blanca, texto `#FFFFFF`, pill y grillas en `tests/integration/product-catalog.test.js`

### Implementation for US1

- [X] T008 [US1] Quitar fondo/borde de `.hero__content`, forzar color blanco de `h1`/subtítulo y conservar la regla árbitro del degradado en `src/styles.css`
- [X] T009 [P] [US1] Cambiar el título visible a `CATÁLOGO DE PRODUCTOS` y conservar el subtítulo en `index.html`
- [X] T010 [US1] Confirmar que `featured-section`, `catalog-section` y `product-grid` mantienen 4 destacados y 4 columnas en `src/components/product-catalog.js` y `src/styles.css`

**Checkpoint**: US1 verificable de forma independiente sin alterar la grilla.

---

## Phase 4: User Story 2 - Filtrado de productos por categoría y precio (Priority: P2)

**Goal**: Hacer que todas las opciones del menú `TIENDA` filtren de verdad, cierren el menú y bauen suavemente al destino correcto.

**Independent Test**: Abrir `TIENDA`, pulsar `Destacados`, `Ver todo` y cada categoría; comprobar filtro real, menú cerrado y scroll a `#productos-destacados` o `#productos`.

### Tests for US2

> Escribir primero; deben fallar antes de la implementación.

- [X] T011 [P] [US2] Añadir aserciones de filtro real, panel cerrado y `scrollIntoView` suave con stub de jsdom en `tests/integration/product-filters.test.js`

### Implementation for US2

- [X] T012 [P] [US2] Añadir `id="productos-destacados"` e `id="productos"` a las secciones correspondientes en `src/components/product-catalog.js`
- [X] T013 [US2] Crear el helper tolerante a jsdom `scrollToCatalogSection()` en `src/app.js`
- [X] T014 [US2] Actualizar `setShopFilter()` y `handleHeaderClick()` en `src/app.js` para derivar el destino desde `data-shop-view`, cerrar el menú y desplazarse tras `showView('catalog')`

**Checkpoint**: US2 verificable de forma independiente; `Ver todo`, `Destacados` y categorías comparten el mismo flujo.

---

## Phase 5: User Story 3 - Gestión de carrito de compras (Priority: P3)

**Goal**: Sin cambios en esta entrega.

**Independent Test**: Se mantiene la prueba independiente existente de carrito; no se modifican `getCartDetails()`, `#cart-count` ni `tests/integration/cart.test.js`.

**Sin tareas nuevas.**

---

## Phase 6: User Story 4 - Aplicación de códigos de descuento (Priority: P4)

**Goal**: Sin cambios en esta entrega.

**Independent Test**: Se mantiene la prueba independiente existente de cupones; no se modifica `src/coupons.js` ni `tests/integration/coupons.test.js`.

**Sin tareas nuevas.**

---

## Phase 7: User Story 5 - Proceso de pago seguro (Priority: P5)

**Goal**: Sin cambios en esta entrega.

**Independent Test**: Se mantiene la prueba independiente existente de checkout; no se modifica `src/components/order-confirmation.js` ni `tests/integration/checkout.test.js`.

**Sin tareas nuevas.**

---

## Phase 8: User Story 6 - Historial y seguimiento de Documentos de Venta (Priority: P6)

**Goal**: Sin cambios en esta entrega; la vista de Historial permanece intacta.

**Independent Test**: Se mantiene la matriz de permisos existente; no se modifica `src/components/order-history.js` ni `tests/integration/order-history.test.js`.

**Sin tareas nuevas.**

---

## Phase 9: User Story 7 - Administración de precios y generación de ofertas (Priority: P7)

**Goal**: Sin cambios en esta entrega; Administración permanece intacta.

**Independent Test**: Se mantiene el código `1234` y el panel existente; no se modifica `src/components/admin-panel.js` ni `tests/integration/admin-panel.test.js`.

**Sin tareas nuevas.**

---

## Phase 10: User Story 8 - Panel de métricas e indicadores de ventas (Priority: P8)

**Goal**: Corregir la superposición de montos en «Evolución de ventas» sin cambiar cálculos ni filtros de métricas.

**Independent Test**: Abrir Métricas como Gerente General, ver etiquetas limpias como `$69k`, confirmar monto exacto en tooltip/tabla y filtrar por mes al hacer clic.

### Tests for US8

> Escribir primero; deben fallar antes de la implementación.

- [X] T015 [P] [US8] Actualizar aserciones de etiqueta compacta, monto exacto en `title`/tabla `sr-only`, agrupación `YYYY-MM` y atributos `data-chart-from`/`data-chart-to` en `tests/unit/metrics-charts.test.js`
- [X] T016 [P] [US8] Añadir la aserción de filtrado mensual desde el gráfico en `tests/integration/metrics-dashboard.test.js`

### Implementation for US8

- [X] T017 [P] [US8] Añadir el formato compacto y la agrupación por mes en `salesByDateChart()` en `src/components/metrics-charts.js`
- [X] T018 [US8] Actualizar `handleMetricsClick()` en `src/app.js` para usar `data-chart-from`/`data-chart-to` con compatibilidad de `data-chart-date`
- [X] T019 [US8] Ajustar `.column-chart__item` y `.column-chart__value` para etiquetas sin colisiones en `src/styles.css`

**Checkpoint**: US8 verificable de forma independiente; los cálculos y la tabla accesible no cambian.

---

## Phase 11: User Story 9 - Vistas y navegación diferenciadas por rol de usuario (Priority: P9)

**Goal**: Invertir la cabecera y alinear los desplegables a la izquierda sin alterar permisos, roles ni panel de perfil.

**Independent Test**: Verificar `TIENDA`/`GESTIÓN` a la izquierda, `ROOTSOUTH®` centrado sin `RS`, Perfil/`CARRITO` a la derecha y paneles cayendo a la izquierda para cada rol autorizado.

### Tests for US9

> Escribir primero; deben fallar antes de la implementación.

- [X] T020 [P] [US9] Actualizar aserciones de orden de zonas, ausencia de `.brand__mark` y anclaje `left: 0` sin `translateX(-50%)` en `tests/integration/header-shell.test.js`

### Implementation for US9

- [X] T021 [P] [US9] Mover `#shop-menu-toggle`/`#shop-menu` y `#manage-menu-toggle`/`#manage-menu` a `.nav-header__left`, `#brand-name` a `.nav-header__center`, eliminar `.brand__mark` y conservar Perfil/`CARRITO` en `.nav-header__right` en `index.html`
- [X] T022 [US9] Ajustar `.header-menu`, `#shop-menu`, `#manage-menu`, `.nav-header` y responsive en `src/styles.css`
- [X] T023 [US9] Confirmar que `#role-select`, `#admin-access`, `#role-logout`, `canAccessView()` y la matriz de roles permanecen sin cambios en `src/app.js`, `src/module-config.js` y `tests/integration/role-views.test.js`

**Checkpoint**: US9 verificable de forma independiente; permisos y sesión privilegiada intactos.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Validar las cuatro correcciones y confirmar que no se reabrieron historias fuera de alcance.

- [X] T024 [P] Ejecutar `npm run test:002`, `npm run build` y `npm test -- --run` según `package.json`, respetando la línea base de 88 fallos heredados documentada en `specs/002-modulo-ventas/quickstart.md`
- [X] T025 [P] Revisar manualmente los escenarios de Hero, cabecera, `TIENDA` y métricas en `specs/002-modulo-ventas/quickstart.md`
- [X] T026 [P] Confirmar que Historial, Administración y la grilla de 4 columnas no cambian en `src/components/order-history.js`, `src/components/admin-panel.js`, `src/styles.css` y `src/data/products.js`
- [X] T027 Verificar que `erp.role`, `SEED_VERSION` y las claves `erp.*` no cambian en `src/storage.js` y que `test:002` sigue apuntando a las suites listadas en `package.json`

---

## Phase 13: Setup de la ronda de Perfil, acceso gerencial y marquesina (Shared Infrastructure)

**Purpose**: Confirmar el arnés, el markup existente y los documentos de diseño de los tres deltas antes de tocar código.

- [X] T028 [P] Confirmar los scripts `test:002`, el comando Vitest enfocado y `build` en `package.json`, `vitest.config.mjs` y `specs/002-modulo-ventas/quickstart.md`
- [X] T029 [P] Confirmar `#profile-toggle`, `#profile-panel`, `#role-select`, `#admin-access` y `.announcement-bar` en `index.html`, y el helper `mountMarkup()/startApp()/clickNav()` en `tests/helpers/app-fixture.js`
- [X] T030 [P] Revisar las decisiones de sesión pendiente, anclaje de Perfil y marquesina en `specs/002-modulo-ventas/research.md`, `specs/002-modulo-ventas/data-model.md` y `specs/002-modulo-ventas/contracts/ui-header-contract.md`

**Checkpoint**: Arnés, selectores y contratos de los tres deltas listos; US7 y US9 pueden comenzar.

---

## Phase 14: Foundational de la ronda (Blocking Prerequisites)

**Purpose**: Verificar las fuentes de verdad de permisos, estilos y persistencia que comparten los tres deltas.

**⚠️ CRITICAL**: Ninguna tarea nueva de US7 o US9 puede comenzar hasta completar esta fase.

- [X] T031 Verificar que `getRole()`, `state.adminUnlocked`, `canAccessView()` y la guarda de `showView()` siguen siendo la fuente de autorización en `src/app.js` y `src/module-config.js`
- [X] T032 [P] Verificar que las reglas finales de `.header-menu` con `left: 0`, sin `translateX(-50%)`, y las anulaciones del Hero y las métricas permanecen intactas en `src/styles.css`
- [X] T033 [P] Verificar que `erp.role`, `SEED_VERSION = 'rootsouth-2026-11-charts'` y las claves `erp.*` no requieren migración en `src/storage.js`

**Checkpoint**: Fundamento listo; US7 y US9 pueden ejecutarse en paralelo respetando los archivos compartidos.

---

## Phase 15: User Story 7 - Administración de precios y generación de ofertas (Priority: P7) 🎯 MVP de esta ronda

**Goal**: Hacer que `Gerente General` muestre de inmediato `#admin-access` con código `1234`, sin permisos ni logout hasta validarlo, y habilitar GESTIÓN/Historial/Administración/Métricas solo después del acceso correcto.

**Independent Test**: Elegir `Gerente General`, confirmar `#admin-code`/`#admin-access-submit` visibles, `#admin-access-error` oculto, `#role-logout` y GESTIÓN ocultos; enviar un código inválido y ver el error; enviar `1234` y ver el formulario oculto, logout visible, GESTIÓN habilitada y límite de crédito sin enmascarar.

### Tests for US7

> Escribir primero; deben fallar antes de la implementación.

- [X] T034 [P] [US7] Actualizar `tests/integration/admin-panel.test.js` para abrir Administración mediante selección de `admin` en `#role-select` + `1234`, y verificar error solo tras intento inválido y logout oculto hasta validar
- [X] T035 [P] [US7] Actualizar `tests/integration/offer-lifecycle.test.js` para desbloquear con selección de rol + código antes de gestionar ofertas y conservar el alta/edición de `ofertas`
- [X] T036 [P] [US7] Actualizar `tests/integration/role-views.test.js` para comprobar estado pendiente de Gerente General, retorno a `Cliente` y desbloqueo con `1234` para Métricas/Administración/Historial
- [X] T037 [P] [US7] Actualizar `tests/integration/order-history.test.js` para exigir `1234` tras elegir Gerente General antes de revelar `history-credit-limit` sin enmascarar

### Implementation for US7

- [X] T038 [US7] Añadir el estado pendiente derivado de `getRole() === 'admin' && !state.adminUnlocked` y ajustar `handleRoleChange()`/`resetPrivilegedState()` en `src/app.js`
- [X] T039 [US7] Ajustar `applyRolePermissions()` en `src/app.js` para ocultar `#role-logout`, `#manage-menu-toggle` y `#manage-menu` mientras Gerente General está pendiente, y restaurarlos al validar `1234`
- [X] T040 [US7] Ajustar `requestAdminAccess()` y la guarda de `showView()` en `src/app.js` para impedir `history`, `metrics` y `admin` mientras la sesión gerencial esté pendiente, sin tocar `canAccessView()`

**Checkpoint**: US7 verificable de forma independiente; la sesión gerencial sigue siendo efímera y no cambia `erp.role` ni `SEED_VERSION`.

---

## Phase 16: User Story 9 - Vistas y navegación diferenciadas por rol de usuario (Priority: P9)

**Goal**: Anclar el popover de Perfil a la derecha de su botón y convertir la cinta superior en una marquesina continua sin mover los menús `TIENDA`/`GESTIÓN` ni el logo centrado.

**Independent Test**: Abrir Perfil y comprobar que `#profile-panel` cae justo debajo y a la derecha; ver la cinta con mensaje duplicado, desplazamiento lineal infinito y pausa en `:hover`; verificar que la cabecera conserva `TIENDA`/`GESTIÓN` a la izquierda, `ROOTSOUTH®` centrado y Perfil/`CARRITO` a la derecha.

### Tests for US9

> Escribir primero; deben fallar antes de la implementación.

- [X] T041 [P] [US9] Actualizar `tests/integration/header-shell.test.js` para aseverar `.profile-container`, `#profile-panel.header-menu--profile` con `right: 0; left: auto`, cinta duplicada con segundo `.announcement-message` en `aria-hidden="true"`, y bloqueo/desbloqueo de GESTIÓN por `1234`

### Implementation for US9

- [X] T042 [US9] Envolver `#profile-toggle` y `#profile-panel` en `.profile-container`, y duplicar `.announcement-track`/`.announcement-message` con la segunda copia en `aria-hidden="true"` en `index.html`
- [X] T043 [US9] Añadir en `src/styles.css` el contexto relativo de `.profile-container`, el anclaje `right: 0; left: auto` de `#profile-panel.header-menu--profile`, `overflow: hidden` en `.announcement-bar`, `.announcement-track`, `@keyframes announcement-marquee` de `translateX(0)` a `translateX(-50%)` y pausa en `:hover`, conservando `left: 0` de los menús

**Checkpoint**: US9 verificable de forma independiente; el popover no interfiere con `#shop-menu` ni `#manage-menu`.

---

## Phase 17: Polish & Cross-Cutting Concerns de la ronda

**Purpose**: Validar los tres deltas y confirmar que no se reabrieron Hero, catálogo, gráficos, Historial, Administración ni persistencia.

- [X] T044 [P] Ejecutar el comando Vitest enfocado de `specs/002-modulo-ventas/quickstart.md` sobre `header-shell.test.js`, `role-views.test.js`, `admin-panel.test.js`, `order-history.test.js` y `offer-lifecycle.test.js`
- [X] T045 [P] Ejecutar `npm run test:002` y `npm test -- --run`, respetando la línea base de 88 fallos heredados del módulo 001 documentada en `specs/002-modulo-ventas/quickstart.md`
- [X] T046 Ejecutar `npm run build` como verificación final de Vite en `package.json`
- [X] T047 [P] Revisar manualmente los escenarios 8–10 de `specs/002-modulo-ventas/quickstart.md`: Perfil a la derecha, marquesina con pausa en `:hover` y acceso gerencial con `1234`
- [X] T048 [P] Confirmar que Hero, grilla de 4 columnas, «Evolución de ventas», menú `TIENDA`, `SEED_VERSION` y claves `erp.*` no cambian en `index.html`, `src/styles.css`, `src/app.js`, `src/storage.js`, `src/components/product-catalog.js` y `src/components/metrics-charts.js`
- [X] T049 Marcar `T028`–`T049` como `[X]` en `specs/002-modulo-ventas/tasks.md` después de completar la validación

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; completado en la entrega inicial.
- **Foundational (Phase 2)**: Depende de Setup; completado en la entrega inicial.
- **User Stories (Phases 3–11)**: Dependen de Foundational; US1, US2, US8 y US9 se completaron en la entrega inicial.
- **Polish (Phase 12)**: Depende de US1, US2, US8 y US9; completado en la entrega inicial.
- **Setup de la ronda (Phase 13)**: Depende de Phase 12 completada.
- **Foundational de la ronda (Phase 14)**: Depende de Phase 13; bloquea las tareas nuevas de US7 y US9.
- **US7 (Phase 15) y US9 (Phase 16)**: Dependen de Phase 14; pueden avanzar en paralelo, salvo la aserción de GESTIÓN de T041 que debe ejecutarse tras T039.
- **Polish de la ronda (Phase 17)**: Depende de Phase 15 y Phase 16; T049 al final.

### User Story Dependencies

- **US1 (P1)**: Sin dependencias de otras historias; toca `src/styles.css` y `index.html`.
- **US2 (P2)**: Independiente de US1; depende de que Foundational confirme `showView()`/`state.filters`.
- **US7 (P7)**: Sin tareas nuevas en la entrega inicial; en esta ronda depende solo de Phase 14 y toca `src/app.js` más cuatro suites de integración.
- **US8 (P8)**: Independiente; toca `src/components/metrics-charts.js`, `src/app.js` y `src/styles.css`; sin tareas nuevas en esta ronda.
- **US9 (P9)**: En la entrega inicial tocó `index.html` y `src/styles.css`; en esta ronda depende de Phase 14 y de T039 para validar el bloqueo de GESTIÓN en T041.
- **US3–US6**: Sin tareas nuevas ni dependencias en esta ronda.

### Within Each User Story

- Las pruebas marcadas en cada historia se escriben primero y deben fallar antes de la implementación.
- En US2, T013 precede a T014 porque ambos modifican `src/app.js`.
- En US8, T017 y T018 pueden preceder a T019; T019 comparte `src/styles.css` con US1/US9.
- En US9 de la entrega inicial, T020 precede a T021/T022.
- En US7 de esta ronda, T034–T037 pueden escribirse en paralelo; T038 precede a T039 y T039 precede a T040 porque los tres modifican `src/app.js`.
- En US9 de esta ronda, T041 precede a T042/T043; T042 precede a T043 porque T043 depende del markup de `index.html`.

### Parallel Opportunities

- Setup inicial: T001, T002 y T003.
- Foundational inicial: T004 y T005 pueden ejecutarse en paralelo; T006 depende de la revisión de `src/app.js`.
- US1: T007 y T009 pueden ejecutarse en paralelo; T008 y T010 se secuencian por `src/styles.css`.
- US2: T011 y T012 pueden ejecutarse en paralelo; T013 y T014 se secuencian.
- US8: T015, T016 y T017 pueden ejecutarse en paralelo; T018 y T019 se secuencian.
- US9 inicial: T020 y T021 pueden ejecutarse en paralelo; T022 se secuencia por `src/styles.css`.
- Polish inicial: T024, T025 y T026 pueden ejecutarse en paralelo; T027 al final.
- Setup de la ronda: T028, T029 y T030.
- Foundational de la ronda: T031, T032 y T033.
- US7 de la ronda: T034, T035, T036 y T037; T038, T039 y T040 se secuencian.
- US9 de la ronda: T041 puede ejecutarse en paralelo con T034–T037; T042 y T043 se secuencian.
- Polish de la ronda: T044, T045, T047 y T048 pueden ejecutarse en paralelo; T046 y T049 al final.

---

## Parallel Example: User Story 2

```powershell
# Ejecutar juntas las pruebas y el cambio de markup:
Task: "Añadir aserciones de filtro real, panel cerrado y scrollIntoView suave con stub de jsdom en tests/integration/product-filters.test.js"
Task: "Añadir id=\"productos-destacados\" e id=\"productos\" a las secciones correspondientes en src/components/product-catalog.js"

# Después, secuenciar los cambios en src/app.js:
Task: "Crear el helper tolerante a jsdom scrollToCatalogSection() en src/app.js"
Task: "Actualizar setShopFilter() y handleHeaderClick() en src/app.js"
```

---

## Parallel Example: fase actual

```powershell
# Escribir juntas las pruebas de acceso gerencial y cabecera:
Task: "Actualizar tests/integration/admin-panel.test.js para selección de admin + 1234"
Task: "Actualizar tests/integration/role-views.test.js para estado pendiente y desbloqueo"
Task: "Actualizar tests/integration/header-shell.test.js para Perfil, marquesina y GESTIÓN bloqueada"

# Después, secuenciar los cambios de src/app.js y el markup/CSS dependiente:
Task: "Añadir pendingAdmin y ajustar handleRoleChange()/resetPrivilegedState() en src/app.js"
Task: "Ajustar applyRolePermissions() en src/app.js"
Task: "Ajustar requestAdminAccess() y showView() en src/app.js"
Task: "Envolver Perfil y duplicar cinta en index.html"
Task: "Añadir CSS de Perfil y marquesina en src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) — entrega inicial

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1 Hero sin caja blanca.
4. **STOP and VALIDATE**: ejecutar la prueba independiente de US1.
5. Demo del Hero corregido antes de continuar.

### MVP First de esta ronda (User Story 7 Only)

1. Completar Phase 13: Setup de la ronda.
2. Completar Phase 14: Foundational de la ronda.
3. Completar Phase 15: US7 con `#admin-access`, código `1234`, GESTIÓN y logout condicionados.
4. **STOP and VALIDATE**: ejecutar las pruebas independientes de US7.
5. Demo del acceso gerencial corregido antes de continuar con US9.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → Hero legible → validar.
3. US9 → cabecera invertida → validar.
4. US2 → menú `TIENDA` funcional → validar.
5. US8 → gráfico sin colisiones → validar.
6. Polish inicial → verificación completa.
7. Setup + Foundational de la ronda → contratos de los tres deltas listos.
8. US7 → sesión gerencial pendiente/validada → validar.
9. US9 → Perfil a la derecha y marquesina → validar.
10. Polish de la ronda → verificación completa.

### Parallel Team Strategy

- Entrega inicial: Desarrollador A en US1/US9 coordinando `src/styles.css`; Desarrollador B en US2; Desarrollador C en US8.
- Ronda actual: Desarrollador A en US7 (`src/app.js` y pruebas de administración/roles/historial/ofertas).
- Ronda actual: Desarrollador B en US9 (`index.html`, `src/styles.css` y `header-shell.test.js`).
- Ronda actual: Desarrollador C en Setup/Foundational y verificación final.
- Todos convergen en Phase 17.

---

## Notes

- `[P]` tasks = archivos distintos y sin dependencias pendientes.
- `[Story]` vincula cada tarea con US1–US9; Setup, Foundational y Polish no llevan etiqueta.
- No se modifica el esquema persistido, `SEED_VERSION` ni la grilla de 4 columnas; Historial y Administración conservan su lógica, solo cambia su desbloqueo gerencial.
- Las tareas de US3–US6 y US8 están deliberadamente vacías en esta ronda; US7 y US9 concentran los tres deltas.
- Verificar que las pruebas fallan antes de implementar cada corrección.
- No crear commits salvo solicitud explícita.
