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

## Actualización técnica de esta ronda (3 puntos)

Las secciones existentes conservan el diseño ya entregado de las cuatro correcciones. Esta ronda solo añade tres deltas y no reabre el diseño visual de Hero, catálogo, gráficos ni menús; el único cambio sobre `GESTIÓN` es que su disponibilidad pasa a depender de que la sesión gerencial esté validada:

1. **Perfil**: envolver `#profile-toggle` y `#profile-panel` en un contenedor con `position: relative`; el popover usa `right: 0; left: auto` para caer justo debajo y a la derecha de `Perfil`.
2. **Gerente General**: al seleccionar `admin` se muestra de inmediato `#admin-access` con `#admin-code`, `#admin-access-submit` y `#admin-access-error` oculto hasta un intento inválido. Sin validar `1234`, no se activan Métricas, Administración, Historial gerencial ni `Cerrar sesión`; al validar se oculta el formulario, se habilita `GESTIÓN` y aparece `Cerrar sesión`.
3. **Cinta superior**: convertir `.announcement-bar` en viewport con `overflow: hidden`, duplicar la pista de mensajes y animarla con `@keyframes` lineal infinito de `translateX(0)` a `translateX(-50%)`, pausado en `:hover`.

**Resultado del gate de esta ronda**: PASS. No hay `NEEDS CLARIFICATION` ni violaciones nuevas de la constitución.

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
- El panel de Perfil debe anclarse desde su propio contenedor relativo para no interferir con `left: 0` de `#shop-menu` y `#manage-menu`.
- `erp.role = "admin"` al cargar o seleccionar Gerente General debe iniciar en estado pendiente; `state.adminUnlocked` sigue siendo efímero y es la única señal de sesión gerencial validada.
- La cinta marquesina se resuelve solo con DOM y CSS; no añade timers, librerías ni solicitudes de red.

**Scale/Scope**: Una cabecera, un Hero Banner, el menú `TIENDA`, el gráfico «Evolución de ventas», tres roles y siete vistas (`catalog`, `cart`, `checkout`, `confirmation`, `history`, `admin`, `metrics`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / estándar | Evaluación previa | Evidencia en el plan |
|---|---|---|
| I. Code Quality & Maintainability | PASS | Cambios concentrados en `index.html`, `app.js`, `styles.css`, `product-catalog.js` y `metrics-charts.js`; reutilización de `state.filters`, `showView()` y helpers de disclosures existentes. |
| II. Test-First & Verification | PASS | Ajustes definidos en `product-catalog.test.js`, `header-shell.test.js`, `product-filters.test.js`, `metrics-charts.test.js`, `role-views.test.js`, `admin-panel.test.js`, `order-history.test.js` y `offer-lifecycle.test.js`; verificación con `test:002` y `build`. |
| III. User Experience Consistency | PASS | Hero legible sin caja blanca, cabecera de 3 zonas alineada, menú `TIENDA` con cierre/filtro/scroll coherentes, etiquetas de gráfico sin colisiones, popover de Perfil anclado a la derecha, acceso gerencial por pasos y marquesina continua. |
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
index.html                         # Cinta marquesina duplicada, cabecera 3 zonas, contenedor de Perfil, menús y Hero sin caja blanca
src/
├── module-config.js               # ROLES y canAccessView (sin cambios en esta actualización)
├── app.js                         # showView, disclosures, scroll, filtros de métricas y sesión gerencial pendiente/validada
├── styles.css                     # Menús a la izquierda, popover de Perfil a la derecha, marquesina, Hero y etiquetas de gráfico
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
│   ├── role-views.test.js         # Navegación/visor por rol con sesión gerencial pendiente/validada
│   ├── header-shell.test.js       # Zonas, paneles, marquesina, popover de Perfil y flujo de acceso
│   ├── product-catalog.test.js    # Hero sin caja blanca, texto blanco y grillas
│   ├── product-filters.test.js    # Menú TIENDA → filtro + scroll suave
│   ├── metrics-dashboard.test.js  # Clics por mes en Evolución de ventas
│   ├── order-history.test.js      # Límite financiero tras validar Gerente General
│   ├── admin-panel.test.js        # Código 1234, error condicional y sesión validada
│   └── offer-lifecycle.test.js    # Ofertas tras desbloquear con selección de rol + código
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

### Alcance adicional de esta ronda (3 puntos)

- Perfil: contenedor relativo nuevo y regla `right: 0; left: auto` solo para `#profile-panel`; `#shop-menu` y `#manage-menu` conservan `left: 0`.
- Autenticación gerencial: selección de `admin` abre `#admin-access`; el error aparece solo tras un código incorrecto; el éxito con `1234` activa la sesión, oculta el formulario, habilita `GESTIÓN` y muestra `#role-logout`.
- Cinta: pista duplicada con mensajes exactos, animación CSS infinita sin saltos y pausa en `:hover`.
- Pruebas `test:002` afectadas: `header-shell.test.js`, `role-views.test.js`, `admin-panel.test.js`, `order-history.test.js` y `offer-lifecycle.test.js`.

### Fuera del alcance

- Cambios en las 9 Historias de Usuario, la vista de Historial, Administración ni la grilla de 4 columnas.
- Cambios en permisos, roles, etiqueta `Gerente General`, código `1234`, productos, ofertas, cupones, checkout ni semillas.
- Migración de `localStorage`, incremento de `SEED_VERSION`, backend o autenticación real.
- Reparación de suites heredadas del módulo base 001.
- Reabrir el diseño visual de Hero, catálogo, gráficos o menús; solo cambia el estado pendiente/validado de la sesión gerencial y las pruebas asociadas.

## Diseño técnico por capas

### 1. Configuración y autorización (`src/module-config.js`)

Sin cambios. `canAccessView()` continúa siendo el único mapeo vista → permiso, `ROLES` sigue siendo `['customer', 'sales', 'admin']` y `showView()` mantiene la guarda con `state.adminUnlocked`. Ninguna de las cuatro correcciones abre vistas restringidas ni altera `erp.role`. La ronda actual tampoco modifica este módulo: el estado pendiente se calcula en `src/app.js`.

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

### 5. Actualización puntual de Perfil, sesión gerencial y cinta (esta ronda)

| Capa | Cambio | Regla resultante |
|---|---|---|
| DOM `index.html` | Envolver `#profile-toggle` y `#profile-panel` en `.profile-container` dentro de `.nav-header__right`. | El anclaje del popover depende de Perfil, no del viewport ni de los menús izquierdos. |
| DOM cinta | `.announcement-bar` contiene `.announcement-track` con dos `.announcement-message` idénticos; la segunda copia lleva `aria-hidden="true"`. | Texto exacto repetido: `ENVÍO GRATIS SOBRE $99.000 CLP · COLECCIÓN ROOTSOUTH 2026 · CUPÓN BIENVENIDO10 — 10% OFF · DESPACHO A TODO CHILE · CAMBIOS Y DEVOLUCIONES FÁCILES`. |
| CSS Perfil | `.profile-container { position: relative; }` y `#profile-panel.header-menu--profile { right: 0; left: auto; }` después de la regla genérica `.header-menu`. | Panel justo debajo y a la derecha de `Perfil`; `#shop-menu`/`#manage-menu` conservan `left: 0`. |
| CSS marquesina | `.announcement-bar { overflow: hidden; white-space: nowrap; }`; `.announcement-track { min-width: max-content; animation: announcement-marquee 18s linear infinite; }`; `@keyframes announcement-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`; `.announcement-bar:hover .announcement-track { animation-play-state: paused; }`. | Desplazamiento continuo sin salto porque la pista está duplicada; pausa al hover; sin JS ni nueva dependencia. |
| `handleRoleChange()` | Al elegir `admin`: `setRole('admin')`, `resetPrivilegedState()`, `renderRoleSelector()`, `applyRolePermissions()` y `showView(state.view)`. | Se abre `#admin-access` de inmediato; permisos gerenciales, `GESTIÓN` y `#role-logout` siguen inactivos. |
| `applyRolePermissions()` | Calcular `pendingAdmin = getRole() === 'admin' && !state.adminUnlocked`. Ocultar `#role-logout` para Cliente y para `pendingAdmin`; ocultar `#manage-menu-toggle`/`#manage-menu` y sus hijos mientras `pendingAdmin`. | `#admin-access` visible solo en `pendingAdmin`; Vendedor mantiene su sesión activa y Gerente validado recupera el menú completo. |
| `requestAdminAccess()` | Solo con `pendingAdmin`: `1234` → `state.adminUnlocked = true`, ocultar `#admin-access`, limpiar error, reaplicar permisos y navegar a `admin`; cualquier otro valor → `Acceso denegado` sin cambiar estado. | El mensaje de error aparece únicamente después de un envío inválido; `#admin-code` se limpia al cambiar rol o cerrar sesión. |
| `showView()` | Mantener `canAccessView()` y la guarda existente de `admin`; reforzar que `pendingAdmin` no puede mostrar `history`, `metrics` ni `admin`. | No se relajan permisos de Cliente/Vendedor; solo se retrasa la activación gerencial hasta validar el código. |
| Pruebas | Actualizar `header-shell`, `role-views`, `admin-panel`, `order-history` y `offer-lifecycle` para usar `changeValue('#role-select', 'admin')` + submit de `1234` como único camino de desbloqueo. | `erp.role = "admin"` sin código ya no implica sesión activa, logout visible ni acceso a GESTIÓN. |

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
| 7. Perfil | Añadir `.profile-container` y anclar `#profile-panel` con `right: 0; left: auto`. | Popover debajo/a la derecha de Perfil sin afectar menús izquierdos. |
| 8. Sesión Gerente General | Implementar estado pendiente, formulario inmediato, error condicional y desbloqueo con `1234`. | Sin código: sin GESTIÓN, sin logout y sin vistas gerenciales; con código: sesión activa y menú completo. |
| 9. Cinta marquesina | Duplicar pista y añadir animación CSS infinita con pausa en hover. | Mensajes exactos desplazándose sin saltos. |

> Esta actualización no regenera `tasks.md`; las tareas de implementación derivadas deben crearse después de este plan sin reabrir cambios ya entregados que no estén en los cuatro puntos ni en los tres deltas de esta ronda.

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
| CA-011 | `#profile-panel` está dentro de `.profile-container` con `position: relative` y usa `right: 0; left: auto`; `#shop-menu`/`#manage-menu` siguen con `left: 0`. | UI/CSS |
| CA-012 | Al seleccionar `Gerente General`, `#admin-access` aparece de inmediato con `#admin-code` y `#admin-access-submit`, y `#admin-access-error` permanece oculto. | Comportamiento |
| CA-013 | Sin validar `1234`, `#role-logout` está oculto, `GESTIÓN` no está disponible y no se activan Historial, Administración ni Métricas gerenciales. | Seguridad/UI |
| CA-014 | Un código incorrecto muestra `Acceso denegado` y mantiene la sesión pendiente; el correcto `1234` oculta el formulario, activa la sesión, habilita GESTIÓN y muestra `Cerrar sesión`. | Comportamiento |
| CA-015 | La cinta interior contiene dos copias del mensaje exacto y su CSS define `overflow: hidden`, `@keyframes` de `translateX(0)` a `translateX(-50%)`, `linear infinite` y pausa en `:hover`. | UI/CSS |
| CA-016 | El límite de crédito sin enmascarar solo se muestra después de validar `1234` como Gerente General. | Seguridad |

## Estrategia de pruebas

### Ajustes obligatorios en pruebas existentes

| Archivo | Ajuste |
|---|---|
| `tests/integration/product-catalog.test.js` | Eliminar aserción de caja blanca del Hero; exigir `color:#FFFFFF !important` para `h1`/subtítulo y degradado exacto al final de `src/styles.css`. |
| `tests/integration/header-shell.test.js` | Verificar que `#shop-menu-toggle`/`#manage-menu-toggle` están en `.nav-header__left`, `#brand-name` en `.nav-header__center` sin `.brand__mark`, y que `#shop-menu`/`#manage-menu` usan `left: 0` sin `translateX(-50%)`. |
| `tests/integration/product-filters.test.js` | Para `featured`, `all` y cada categoría: comprobar `state.filters`, panel cerrado y llamada a `scrollIntoView` con el destino correcto. |
| `tests/unit/metrics-charts.test.js` | Comprobar etiquetas `$69k`, `title` con monto exacto, agrupación `YYYY-MM` y atributos `data-chart-from`/`data-chart-to`. |
| `tests/integration/metrics-dashboard.test.js` | Verificar que el clic mensual actualiza `#metrics-from`/`#metrics-to` y recalcula el panel. |
| `tests/integration/header-shell.test.js` | Verificar cinta duplicada/marquesina, `.profile-container` con CSS `right: 0; left: auto`, y que seleccionar `admin` no muestra logout ni GESTIÓN hasta validar `1234`. |
| `tests/integration/role-views.test.js` | Cambiar el helper de Gerente General a selección de rol + código; comprobar estado pendiente, desbloqueo y retorno a Cliente tras logout. |
| `tests/integration/admin-panel.test.js` | Confirmar que el error aparece solo tras enviar un código incorrecto y que `1234` oculta `#admin-access` y muestra `#role-logout`. |
| `tests/integration/order-history.test.js` | Exigir `1234` antes de revelar `history-credit-limit` tras elegir Gerente General. |
| `tests/integration/offer-lifecycle.test.js` | Desbloquear con selección de rol + `1234` antes de administrar ofertas. |

### Pruebas nuevas o ampliadas

`tests/integration/header-shell.test.js` y `tests/integration/product-filters.test.js` deben cubrir:

1. Orden de zonas y alineación izquierda de ambos desplegables.
2. Cierre del menú al elegir una opción de `TIENDA` (`hidden` y `aria-expanded="false"`).
3. `scrollIntoView` suave a `#productos-destacados` para `Destacados` y a `#productos` para `Ver todo`/categorías, con stub seguro en jsdom.
4. Filtro real: `featuredOnly`, `category: 'all'` o categoría concreta, sin tocar cupones, ofertas ni carrito.
5. Hero sin fondo/borde blanco en `.hero__content`; pill conservado; título/subtítulo blancos.
6. Gráfico sin montos largos visibles, con tooltip exacto y tabla `sr-only` intacta.

Las suites de permisos, historial y administración solo se ajustan en lo relativo al estado pendiente/validado de Gerente General; la matriz de `canAccessView()` no cambia.

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
- Para esta ronda, ejecutar también la verificación enfocada:
  ```powershell
  npx vitest run tests/integration/header-shell.test.js tests/integration/role-views.test.js tests/integration/admin-panel.test.js tests/integration/order-history.test.js tests/integration/offer-lifecycle.test.js
  ```
- La revisión manual debe incluir: panel de Perfil cayendo a la derecha, acceso gerencial pendiente tras seleccionar `Gerente General`, desbloqueo con `1234` y marquesina pausándose al pasar el cursor.

## Re-evaluación de la constitución tras Phase 1

| Principio | Estado posterior | Justificación |
|---|---|---|
| I. Code Quality & Maintainability | PASS | Contrato actualizado en `contracts/ui-header-contract.md`; scroll y filtro reutilizan `showView()`/`state.filters`; etiquetas en `metrics-charts.js`; sesión gerencial centralizada en `applyRolePermissions()`/`requestAdminAccess()`. |
| II. Test-First & Verification | PASS | Suites ampliadas para los cuatro puntos y los tres deltas; comandos definidos y línea base heredada documentada. |
| III. User Experience Consistency | PASS | Hero, cabecera, menú `TIENDA`, gráfico, Perfil, acceso gerencial y marquesina comparten el mismo patrón visual y estados accesibles. |
| IV. Performance & Reliability | PASS | Sin dependencias, red ni migración; agrupar por mes reduce barras, la marquesina es solo CSS y `canAccessView()` sigue protegiendo vistas. |

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
| El cambio se interpreta como modificación de Historial/Administración/grilla. | Alcance explícitamente limitado a los cuatro puntos más los tres deltas; la matriz de permisos no cambia. |
| El popover de Perfil hereda `left: 0` de `.header-menu`. | Regla más específica `#profile-panel.header-menu--profile { right: 0; left: auto; }` después de `.header-menu`; contenedor `.profile-container` con `position: relative`. |
| `erp.role = "admin"` persistido active permisos sin código. | Estado pendiente derivado de `admin && !state.adminUnlocked`; logout y GESTIÓN ocultos hasta validar `1234`. |
| La marquesina salte al reiniciar el ciclo. | Pista duplicada exactamente y desplazamiento de `-50%`; segunda copia `aria-hidden="true"` para no duplicar lectura. |
