# Plan de Implementación: correcciones de Hero, cabecera, menú TIENDA y gráfico Evolución de ventas

**Rama**: `002-modulo-ventas` | **Fecha**: 2026-11-25 | **Spec**: [`specs/002-modulo-ventas/spec.md`](spec.md)

**Input**: `specs/002-modulo-ventas/spec.md`, FR-007 y FR-010. Cuatro correcciones sobre el código ya implementado.

## Resumen

Este plan actualiza solo la documentación técnica de `002-modulo-ventas` para corregir cuatro puntos del código existente, sin modificar la persistencia, las nueve Historias de Usuario, la vista de Historial, Administración ni la grilla de 4 columnas:

1. Hero Banner sin caja blanca: `CATÁLOGO DE PRODUCTOS` y subtítulo en `#FFFFFF` directamente sobre la foto oscurecida con `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)`; solo el pill `ROOTSOUTH · COLECCIÓN 2026` conserva alto contraste negro/blanco.
2. Invertir la cabecera: `TIENDA`/`GESTIÓN` a la izquierda con paneles cayendo a la izquierda, logo tipográfico `ROOTSOUTH®` centrado sin cuadro `RS`, y `Perfil` + `CARRITO` a la derecha.
3. Conectar `Destacados`, `Ver todo` y las categorías del menú `TIENDA` con el filtro real, cierre del menú y `scrollIntoView` suave a `#productos-destacados` o `#productos`.
4. Evitar superposición de montos en «Evolución de ventas» con etiquetas compactas sin colisiones, agrupación por mes o abreviaturas como `$69k`, y monto exacto en tooltip/tabla accesible.

La estrategia es reutilizar los contratos DOM existentes, conservar `canAccessView()` y `state.filters` como única fuente de comportamiento, y verificar con Vitest + jsdom y `vite build`.

## Technical Context

**Language/Version**: JavaScript ES modules (`package.json` usa `"type": "module"`); sin TypeScript.

**Primary Dependencies**: Vite `^8.2.1`, Vitest `^4.1.10`, jsdom `^30.0.1`.

**Storage**: `localStorage` con `erp.*`; el rol activo se guarda en `erp.role`. No se requiere migración ni cambiar `SEED_VERSION = 'rootsouth-2026-11-charts'`.

**Testing**: `npm run test:002` (suite vigente del módulo 002), `npm test -- --run` (toda la suite, con fallos heredados conocidos del módulo 001), `npm run build`. No existen scripts de lint ni typecheck.

**Target Platform**: Navegador moderno; SPA estática servida por Vite en `http://localhost:5173` y compilada a `dist/`.

**Project Type**: Aplicación web frontend, sin backend y con pago simulado.

**Performance Goals**: Sin nuevas dependencias ni solicitudes de red; los desplegables, el filtrado del catálogo y el gráfico usan operaciones DOM locales sin re-renderizados innecesarios.

**Constraints**:
- CSS global con `border-radius: 0 !important`, `box-shadow: none !important`, `[hidden] { display: none !important; }` y anulaciones de `background-image`; la regla árbitro del Hero debe permanecer después de esas anulaciones.
- Las pruebas usan `mountMarkup()` sobre `index.html` y selectores `#role-select`, `#admin-access`, `#role-logout`, `#cart-count`, `#brand-name`, `[data-view]` y `[data-shop-view]`.
- `jsdom` no implementa `scrollIntoView`: las pruebas deben poder espiar/stubgear el método sin depender de layout real.
- El gráfico «Evolución de ventas» se genera con HTML/CSS desde `src/components/metrics-charts.js`; no hay librería de charts ni canvas.
- `1234` es una credencial de demostración en cliente; `state.adminUnlocked` sigue siendo memoria de sesión, no persistencia.
- El módulo 001 heredado queda fuera de alcance; sus fallos no deben usarse como criterio de este cambio.

**Scale/Scope**: Una cabecera, un Hero Banner, el menú `TIENDA`, el gráfico «Evolución de ventas», tres roles y siete vistas (`catalog`, `cart`, `checkout`, `confirmation`, `history`, `admin`, `metrics`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / estándar | Evaluación previa | Evidencia en el plan |
|---|---|---|
| I. Code Quality & Maintainability | PASS | Cambios concentrados en `index.html`, `app.js`, `styles.css`, `product-catalog.js` y `metrics-charts.js`; reutilización de `state.filters`, `showView()` y helpers de disclosures existentes. |
| II. Test-First & Verification | PASS | Ajustes definidos en `product-catalog.test.js`, `header-shell.test.js`, `product-filters.test.js` y `metrics-charts.test.js`; verificación con `test:002` y `build`. |
| III. User Experience Consistency | PASS | Hero legible sin caja blanca, cabecera de 3 zonas alineada, menú `TIENDA` con cierre/filtro/scroll coherentes y etiquetas de gráfico sin colisiones. |
| IV. Performance & Reliability | PASS | Sin dependencias nuevas, red ni migración; el agrupado por mes reduce nodos del gráfico y `canAccessView()` sigue protegiendo vistas. |
| Quality Standards | PASS | `research.md`, `data-model.md`, `contracts/` y `quickstart.md` documentan las cuatro correcciones. No hay comandos de lint/typecheck disponibles; se registra como restricción del repositorio. |
| Development Workflow | PASS | Incrementos pequeños y verificables: Dominio de scroll, layout de cabecera, Hero, gráfico y validación final. |

**Resultado del gate**: PASS. No hay violaciones que requieran `Complexity Tracking`.

## Project Structure

### Documentation (this feature)

```text
specs/002-modulo-ventas/
├── plan.md                       # Este plan
├── research.md                   # Phase 0: decisiones técnicas
├── data-model.md                 # Phase 1: impacto en datos y estado
├── contracts/
│   └── ui-header-contract.md     # Phase 1: contrato DOM/ARIA/permisos
├── quickstart.md                 # Phase 1: guía de validación
├── tasks.md                      # Phase 2 (/speckit.tasks, no generado aquí)
└── spec.md                       # Fuente de verdad de US1–US9 y FR-001–FR-010
```

### Source Code (repository root)

```text
index.html                         # Cinta, cabecera 3 zonas invertida, menús, panel de perfil y Hero sin caja blanca
src/
├── module-config.js               # ROLES y canAccessView (sin cambios en esta actualización)
├── app.js                         # showView, disclosures, setShopFilter + scroll y filtros de métricas
├── styles.css                     # Cabecera alineada a la izquierda, Hero sin caja y etiquetas de gráfico
├── catalog.js                     # Categorías usadas por el menú TIENDA
├── components/
│   ├── product-catalog.js         # Secciones con ids #productos-destacados y #productos
│   ├── metrics-charts.js          # Evolución de ventas agrupada/abreviada con tooltip
│   ├── order-confirmation.js      # Botón "Ver historial" condicionado por permiso
│   ├── order-history.js           # Vista restringida por canViewHistory
│   ├── admin-panel.js             # Vista restringida por canManageCatalog
│   └── metrics-dashboard.js       # Vista restringida por canViewMetrics
├── data/products.js               # Ocho prendas RootSouth y miniatura editorial
└── storage.js                     # erp.role y claves de persistencia (sin cambios)
tests/
├── unit/
│   ├── metrics-charts.test.js     # Etiquetas compactas, tooltip y agrupación por mes
│   ├── module-config.test.js      # Etiqueta y matriz de permisos (sin cambios)
│   └── role-permissions.test.js   # Cliente sin Historial (sin cambios)
├── integration/
│   ├── role-views.test.js         # Navegación/visor por rol (sin cambios)
│   ├── header-shell.test.js       # Orden de zonas, alineación y cierre de paneles
│   ├── product-catalog.test.js    # Hero sin caja blanca, texto blanco y grillas
│   ├── product-filters.test.js    # Menú TIENDA → filtro + scroll suave
│   ├── metrics-dashboard.test.js  # Clics por mes en Evolución de ventas
│   ├── order-history.test.js      # Historial con Vendedor/Gerente (sin cambios)
│   └── admin-panel.test.js        # Código 1234 y panel (sin cambios)
├── helpers/app-fixture.js         # mountMarkup()/startApp()/clickNav()
└── setup/jsdom.js                 # Aislamiento de localStorage
```

**Structure Decision**: Mantener la SPA actual de un solo proyecto. El markup de la cabecera permanece en `index.html` porque el fixture de pruebas lo monta directamente; los destinos de scroll se crean en `productCatalog()`; el filtrado y el scroll se coordinan en `src/app.js`; las etiquetas del gráfico se calculan en `src/components/metrics-charts.js`. La autorización permanece en `src/module-config.js`. No se introduce backend ni nuevo paquete.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere tabla de compensaciones.

## Alcance de esta actualización

### Dentro del alcance

- Hero: eliminar fondo/borde de `.hero__content`; mantener único pill blanco/negro en `.hero__eyebrow`; título y subtítulo `#FFFFFF` sobre el degradado lateral exacto.
- Cabecera: mover `TIENDA`/`GESTIÓN` a `.nav-header__left`, `ROOTSOUTH®` a `.nav-header__center` sin `.brand__mark`, y `Perfil`/`CARRITO` a `.nav-header__right`; paneles `.header-menu` con `left: 0`, sin `translateX(-50%)`.
- Menú `TIENDA`: usar `data-shop-view` para aplicar `state.filters`, cerrar el panel y desplazarse con `scrollIntoView({ behavior: 'smooth', block: 'start' })`; crear `#productos-destacados` y `#productos` en `productCatalog()`.
- Métricas: en `salesByDateChart()`, agrupar por `YYYY-MM`, mostrar valor compacto `$69k`, conservar el monto exacto en `title`/`aria-label` y tabla `sr-only`, y permitir filtrar por rango mensual desde el gráfico.
- Ajustes de pruebas y documentación técnica para que los cuatro puntos sean verificables sin cambiar el comportamiento ya cubierto.

### Fuera del alcance

- Cambios en las 9 Historias de Usuario, la vista de Historial, Administración ni la grilla de 4 columnas.
- Cambios en permisos, roles, etiqueta `Gerente General`, código `1234`, productos, ofertas, cupones, checkout ni semillas.
- Migración de `localStorage`, incremento de `SEED_VERSION`, backend o autenticación real.
- Reparación de suites heredadas del módulo base 001.

## Diseño técnico por capas

### 1. Configuración y autorización (`src/module-config.js`)

Sin cambios. `canAccessView()` continúa siendo el único mapeo vista → permiso, `ROLES` sigue siendo `['customer', 'sales', 'admin']` y `showView()` mantiene la guarda con `state.adminUnlocked`. Ninguna de las cuatro correcciones abre vistas restringidas ni altera `erp.role`.

### 2. Estructura DOM (`index.html` y `src/components/product-catalog.js`)

| Elemento | Acción | Contrato resultante |
|---|---|---|
| `.nav-header__left` | Mover aquí `#shop-menu-toggle`/`#shop-menu` y `#manage-menu-toggle`/`#manage-menu` | Menús a la izquierda; paneles con `left: 0` y sin centrado. |
| `.nav-header__center` | Mover aquí `#brand-name`; eliminar `.brand__mark` | Wordmark `ROOTSOUTH®` centrado, sin cuadro `RS`. |
| `.nav-header__right` | Mantener `#profile-toggle`/`#profile-panel` y `#cart-toggle`/`#cart-count` | Perfil y `CARRITO` a la derecha; contador intacto. |
| `[data-shop-view]` | Conservar `all`, `featured`, `Knit`, `Poleras`, `Polerones`, `Accesorios` | Misma lista; ahora cada opción dispara filtro + cierre + scroll. |
| `productCatalog()` | Añadir `id="productos-destacados"` a `.featured-section` e `id="productos"` a `.catalog-section` | Destinos estables para `scrollIntoView`. |
| `#view-catalog .hero__content` | Mantener solo el contenido textual, sin tarjeta | Título/subtítulo directos sobre la foto; pill permitido solo en `.hero__eyebrow`. |

Se conservan `#role-select`, `#admin-access`, `#admin-code`, `#admin-access-submit`, `#admin-access-error`, `#role-logout`, `[data-view="history"|"metrics"|"admin"]`, `#role-access`, `#role-denied`, `#role-denied-return` y todos los hosts de vistas existentes.

### 3. Comportamiento (`src/app.js`)

| Función | Cambio |
|---|---|
| `setShopFilter(value)` | Aceptar el destino derivado del valor: `featured` → `#productos-destacados`; `all` o categoría → `#productos`. Aplicar `state.filters`, llamar a `showView('catalog')` y solicitar `scrollIntoView` suave tras el render. |
| `handleHeaderClick()` | Obtener `data-shop-view` y pasar el destino a `setShopFilter`; no duplicar listeners. |
| `showView()` | Sin cambios funcionales; ya cierra paneles con `closeHeaderPanels()`, por lo que el menú queda cerrado antes del scroll. |
| `closeHeaderPanels()` / `bindHeaderControls()` | Sin cambios; conservar Escape, clic fuera y sincronización `hidden`/`aria-expanded`. |
| `handleMetricsClick()` | Si el botón trae `data-chart-from`/`data-chart-to`, usar ese rango mensual; mantener compatibilidad con `data-chart-date`. |
| `updateCartCount()` | Sin cambios; `#cart-count` y `aria-label` siguen intactos. |

El scroll debe implementarse con un helper tolerante a jsdom: si `Element.prototype.scrollIntoView` no existe, no fallar; en navegador usar `{ behavior: 'smooth', block: 'start' }`. No se debe alterar `renderCatalog()` ni la lógica de cupones, ofertas o carrito.

### 4. Presentación (`src/styles.css`)

- `.hero__content`: `background: transparent !important`, `border: 0 !important`, sin `box-shadow`; conservar `position` y `z-index` para que el texto quede sobre el degradado.
- `#view-catalog .view-header`: mantener `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%), var(--hero-image) !important` como regla final.
- `#view-catalog .view-header h1` y `#view-catalog .view-header .view-subtitle`: `color: #FFFFFF !important`; `text-shadow` solo refuerzo, nunca fondo blanco.
- `#view-catalog .hero__eyebrow`: único pill con `background: #FFFFFF !important`, `color: #111111 !important`, `text-transform: uppercase`.
- `.header-menu`, `#shop-menu` y `#manage-menu`: `left: 0`; eliminar `left: 50%` y `transform: translateX(-50%)` de `#shop-menu`.
- `.nav-header`: conservar `grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr)`; en móvil, el centro debe seguir siendo la marca y los desplegables deben caer a la izquierda.
- `.column-chart__item`: ancho uniforme y `min-width: 0`; `.column-chart__value`: etiqueta compacta, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` y `title` con el monto exacto.
- Conservar token `--hero-image: url("/images/hero-banner.jpg")`, grillas de cuatro columnas, `aspect-ratio:3/4`, `#FFFFFF`, `#F4F4F4`, `#111111` y `[hidden]`.

## Fases de implementación

| Fase | Actividad | Salida verificable |
|---|---|---|
| 0. Investigación | Resolver decisiones de alineación, scroll, etiquetas de gráfico y pruebas. | `research.md` completo; sin `NEEDS CLARIFICATION`. |
| 1. Diseño y contratos | Actualizar modelo de presentación, contrato DOM/UI y guía de validación. | `data-model.md`, `contracts/ui-header-contract.md`, `quickstart.md`. |
| 2. Cabecera | Invertir zonas, quitar `RS`, alinear desplegables a la izquierda. | `TIENDA`/`GESTIÓN` izquierda, `ROOTSOUTH®` centro, Perfil/`CARRITO` derecha. |
| 3. Menú `TIENDA` | Añadir ids de sección, conectar `data-shop-view`, cierre y scroll suave. | Filtro real + panel cerrado + scroll a `#productos-destacados`/`#productos`. |
| 4. Hero | Quitar caja blanca y forzar texto blanco sobre degradado; conservar pill. | Sin tarjeta blanca; título/subtítulo `#FFFFFF` y badge alto contraste. |
| 5. Métricas | Agrupar/abreviar etiquetas y conservar monto exacto en tooltip/tabla. | Montos sin colisión; clic por mes aplica rango. |
| 6. Pruebas y verificación | Ajustar suites afectadas y ejecutar comandos. | `npm run test:002` y `npm run build` correctos. |

> Esta actualización no regenera `tasks.md`; las tareas de implementación derivadas deben crearse después de este plan sin reabrir cambios ya entregados que no estén en los cuatro puntos.

## Criterios de aceptación

| ID | Criterio | Tipo |
|---|---|---|
| CA-001 | El Hero no tiene caja, fondo ni tarjeta blanca detrás del título/subtítulo; solo el pill `ROOTSOUTH · COLECCIÓN 2026` tiene fondo blanco o negro. | UI |
| CA-002 | `CATÁLOGO DE PRODUCTOS` y el subtítulo usan `#FFFFFF` directamente sobre `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)`. | Contraste |
| CA-003 | La cabecera muestra `TIENDA`/`GESTIÓN` a la izquierda, `ROOTSOUTH®` centrado sin cuadro `RS`, y `Perfil` + `CARRITO` a la derecha. | UI |
| CA-004 | Los paneles de `TIENDA` y `GESTIÓN` caen a la izquierda (`left: 0`) y nunca se centran con `translateX(-50%)`. | UI |
| CA-005 | `Destacados` aplica `featuredOnly`, cierra el menú y hace scroll suave a `#productos-destacados`. | Comportamiento |
| CA-006 | `Ver todo` limpia categoría, cierra el menú y hace scroll suave a `#productos`; las categorías aplican filtro, cierran el menú y bajan a `#productos`. | Comportamiento |
| CA-007 | «Evolución de ventas» muestra etiquetas compactas sin superposición, con monto exacto en `title`/tabla accesible. | UI/Accesibilidad |
| CA-008 | El clic en una barra agrupada por mes aplica el rango `data-chart-from`/`data-chart-to`, sin romper el filtro por fecha exacta. | Comportamiento |
| CA-009 | No cambian Historial, Administración, permisos, roles ni la grilla de 4 columnas. | Compatibilidad |
| CA-010 | No cambian productos, ofertas, pedidos semilla ni `SEED_VERSION`. | Datos |

## Estrategia de pruebas

### Ajustes obligatorios en pruebas existentes

| Archivo | Ajuste |
|---|---|
| `tests/integration/product-catalog.test.js` | Eliminar aserción de caja blanca del Hero; exigir `color:#FFFFFF !important` para `h1`/subtítulo y degradado exacto al final de `src/styles.css`. |
| `tests/integration/header-shell.test.js` | Verificar que `#shop-menu-toggle`/`#manage-menu-toggle` están en `.nav-header__left`, `#brand-name` en `.nav-header__center` sin `.brand__mark`, y que `#shop-menu`/`#manage-menu` usan `left: 0` sin `translateX(-50%)`. |
| `tests/integration/product-filters.test.js` | Para `featured`, `all` y cada categoría: comprobar `state.filters`, panel cerrado y llamada a `scrollIntoView` con el destino correcto. |
| `tests/unit/metrics-charts.test.js` | Comprobar etiquetas `$69k`, `title` con monto exacto, agrupación `YYYY-MM` y atributos `data-chart-from`/`data-chart-to`. |
| `tests/integration/metrics-dashboard.test.js` | Verificar que el clic mensual actualiza `#metrics-from`/`#metrics-to` y recalcula el panel. |

### Pruebas nuevas o ampliadas

`tests/integration/header-shell.test.js` y `tests/integration/product-filters.test.js` deben cubrir:

1. Orden de zonas y alineación izquierda de ambos desplegables.
2. Cierre del menú al elegir una opción de `TIENDA` (`hidden` y `aria-expanded="false"`).
3. `scrollIntoView` suave a `#productos-destacados` para `Destacados` y a `#productos` para `Ver todo`/categorías, con stub seguro en jsdom.
4. Filtro real: `featuredOnly`, `category: 'all'` o categoría concreta, sin tocar cupones, ofertas ni carrito.
5. Hero sin fondo/borde blanco en `.hero__content`; pill conservado; título/subtítulo blancos.
6. Gráfico sin montos largos visibles, con tooltip exacto y tabla `sr-only` intacta.

Las suites de permisos, historial y administración no necesitan cambios para estas cuatro correcciones.

## Verificación

Desde la raíz del repositorio:

```powershell
npm run test:002
npm run build
npm test -- --run
```

Criterios de aceptación de la verificación:

- `npm run test:002`: todos los archivos del alcance 002 aprobados, incluidas las aserciones de Hero, cabecera, scroll/filtro y gráfico.
- `npm run build`: compilación Vite correcta; `dist/images/` conserva las imágenes RootSouth.
- `npm test -- --run`: comparar contra la línea base conocida de 88 fallos heredados del módulo 001; no se exige resolverlos en este cambio.
- Revisión manual recomendada: `npm run dev` y comprobar Hero sin caja blanca, cabecera invertida, desplegables a la izquierda, los tres tipos de clic de `TIENDA` y montos de «Evolución de ventas» sin colisiones.

## Re-evaluación de la constitución tras Phase 1

| Principio | Estado posterior | Justificación |
|---|---|---|
| I. Code Quality & Maintainability | PASS | Contrato actualizado en `contracts/ui-header-contract.md`; scroll y filtro reutilizan `showView()`/`state.filters`; etiquetas de gráfico aisladas en `metrics-charts.js`. |
| II. Test-First & Verification | PASS | Suites existentes ampliadas para los cuatro puntos; comandos definidos y línea base heredada documentada. |
| III. User Experience Consistency | PASS | Hero, cabecera, menú `TIENDA` y gráfico comparten el mismo patrón visual y estados accesibles. |
| IV. Performance & Reliability | PASS | Sin dependencias, red ni migración; agrupar por mes reduce barras y mantiene el filtrado por rango. |

**Gate final**: PASS.

## Reconciliación con el plan histórico

Las secciones anteriores del plan describían una entrega B2B de referencia con Cliente/Documento, cotizaciones, facturación y un perfil configurable. Esa referencia se conserva en `data-model.md`, pero **no** es el alcance implementado ni el objetivo de esta actualización.

Estado previo relevante:

- La tienda RootSouth tiene ocho productos, cuatro destacados, categorías `Knit`, `Poleras`, `Polerones` y `Accesorios`, ofertas semilla y doce pedidos para `client-demo`.
- El panel de métricas calcula indicadores desde `erp.orders`, `erp.products`, `erp.offers`, `erp.coupons` y `erp.couponUsage`, con gráficos interactivos.
- `SEED_VERSION = 'rootsouth-2026-11-charts'` ya limpia datos heredados de tecnología.
- Los roles activos son exactamente `customer`, `sales` y `admin`; este plan conserva los ids y corrige solo la etiqueta visible y el permiso de Historial de `customer`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La regla global `background-color:#ffffff !important` sigue pintando el Hero. | Regla árbitro final para `#view-catalog .view-header` con degradado y color blanco; regla específica para `.hero__content` con fondo transparente. |
| Mover los menús de zona rompe selectores o el fixture de pruebas. | Conservar todos los IDs puente y actualizar `header-shell.test.js` para validar la nueva ubicación. |
| `#shop-menu` hereda `left:50%`/`translateX(-50%)` de reglas previas. | Anular ambas propiedades con `left:0` y `transform:none` en el mismo bloque. |
| `scrollIntoView` no existe en jsdom o el destino se renderiza después del clic. | Helper tolerante a ausencia del método y llamada tras `showView('catalog')`; espiar la llamada en pruebas. |
| Agrupar por mes cambia el filtrado por fecha exacta. | Enviar `data-chart-from`/`data-chart-to` y mantener compatibilidad con `data-chart-date`. |
| Etiquetas compactas pierden información. | `title`/`aria-label` y tabla `sr-only` conservan `formatCurrency()` exacto. |
| El cambio se interpreta como modificación de Historial/Administración/grilla. | Alcance explícitamente limitado a los cuatro puntos; suites de permisos sin cambios. |
