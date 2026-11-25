---
description: "Task list for feature implementation"
---

# Tasks: Módulo de Ventas — correcciones de Hero, cabecera, menú TIENDA y Evolución de ventas

**Input**: Design documents from `/specs/002-modulo-ventas/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Available docs reported by setup**: `research.md`, `data-model.md`, `contracts/`, `quickstart.md`. Se carga además `.specify/memory/constitution.md`.

**Tests**: Incluidas porque `plan.md` exige ajustes en `tests/integration/product-catalog.test.js`, `tests/integration/header-shell.test.js`, `tests/integration/product-filters.test.js`, `tests/unit/metrics-charts.test.js` y `tests/integration/metrics-dashboard.test.js`, además de `npm run test:002` y `npm run build`.

**Organization**: Las tareas se agrupan por historia de usuario. Solo US1, US2, US8 y US9 tienen trabajo nuevo; US3–US7 se conservan sin cambios.

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

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; puede iniciar de inmediato.
- **Foundational (Phase 2)**: Depende de Setup; bloquea todas las historias.
- **User Stories (Phases 3–11)**: Dependen de Foundational; US1, US2, US8 y US9 pueden avanzar en paralelo si se respetan los archivos compartidos.
- **Polish (Phase 12)**: Depende de US1, US2, US8 y US9.

### User Story Dependencies

- **US1 (P1)**: Sin dependencias de otras historias; toca `src/styles.css` y `index.html`.
- **US2 (P2)**: Independiente de US1; depende de que Foundational confirme `showView()`/`state.filters`.
- **US8 (P8)**: Independiente; toca `src/components/metrics-charts.js`, `src/app.js` y `src/styles.css`.
- **US9 (P9)**: Independiente; toca `index.html` y `src/styles.css`.
- **US3–US7**: Sin tareas nuevas y sin dependencias para esta entrega.

### Within Each User Story

- Las pruebas marcadas en cada historia se escriben primero y deben fallar antes de la implementación.
- En US2, T013 precede a T014 porque ambos modifican `src/app.js`.
- En US8, T017 y T018 pueden preceder a T019; T019 comparte `src/styles.css` con US1/US9.
- En US9, T020 precede a T021/T022.

### Parallel Opportunities

- Setup: T001, T002 y T003.
- Foundational: T004 y T005 pueden ejecutarse en paralelo; T006 depende de la revisión de `src/app.js`.
- US1: T007 y T009 pueden ejecutarse en paralelo; T008 y T010 se secuencian por `src/styles.css`.
- US2: T011 y T012 pueden ejecutarse en paralelo; T013 y T014 se secuencian.
- US8: T015, T016 y T017 pueden ejecutarse en paralelo; T018 y T019 se secuencian.
- US9: T020 y T021 pueden ejecutarse en paralelo; T022 se secuencia por `src/styles.css`.
- Polish: T024, T025 y T026 pueden ejecutarse en paralelo; T027 al final.

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

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1 Hero sin caja blanca.
4. **STOP and VALIDATE**: ejecutar la prueba independiente de US1.
5. Demo del Hero corregido antes de continuar.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → Hero legible → validar.
3. US9 → cabecera invertida → validar.
4. US2 → menú `TIENDA` funcional → validar.
5. US8 → gráfico sin colisiones → validar.
6. Polish → verificación completa.

### Parallel Team Strategy

- Desarrollador A: US1 y US9, coordinando `src/styles.css`.
- Desarrollador B: US2 en `src/app.js` y `src/components/product-catalog.js`.
- Desarrollador C: US8 en `src/components/metrics-charts.js` y `tests/unit/metrics-charts.test.js`.
- Todos convergen en Phase 12.

---

## Notes

- `[P]` tasks = archivos distintos y sin dependencias pendientes.
- `[Story]` vincula cada tarea con US1–US9; Setup, Foundational y Polish no llevan etiqueta.
- No se modifica el esquema persistido, `SEED_VERSION`, Historial, Administración ni la grilla de 4 columnas.
- Las tareas de US3–US7 están deliberadamente vacías porque el plan las declara fuera de alcance.
- Verificar que las pruebas fallan antes de implementar cada corrección.
- No crear commits salvo solicitud explícita.
