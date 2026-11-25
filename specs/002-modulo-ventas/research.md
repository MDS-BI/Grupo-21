# Investigación: correcciones de Hero, cabecera, menú TIENDA y Evolución de ventas

**Feature**: `002-modulo-ventas`  
**Rama**: `002-modulo-ventas`  
**Fuente**: `specs/002-modulo-ventas/spec.md` (FR-007 y FR-010)

## Resumen

No quedan `NEEDS CLARIFICATION`. La especificación y el usuario fijan de forma explícita el Hero sin caja blanca, el orden de la cabecera, el comportamiento del menú `TIENDA` y la legibilidad del gráfico «Evolución de ventas». La investigación se centró en aplicar cuatro correcciones al código existente sin romper contratos DOM ni cambios ya entregados.

La aplicación es una SPA estática en JavaScript ES modules, servida por Vite y probada con Vitest + jsdom. No hay backend, lint ni typecheck. La decisión global es reutilizar los IDs actuales como puente de compatibilidad, conservar `canAccessView()` y `state.filters` como fuentes de verdad, y localizar los cambios en `index.html`, `app.js`, `styles.css`, `product-catalog.js` y `metrics-charts.js`.

## Decisión 1: Cabecera invertida, disclosures y navegación de TIENDA

### Decision

Mantener `<header class="site-header">` y su cinta superior, pero invertir la fila de 3 zonas:

- `.nav-header__left`: `TIENDA` y `GESTIÓN` como disclosures nativos, alineados a la izquierda; sus paneles hermanos deben caer con `left: 0`, nunca con `left: 50%`/`translateX(-50%)`.
- `.nav-header__center`: wordmark tipográfico `ROOTSOUTH®` centrado, conservando `#brand-name` y eliminando `.brand__mark` (`RS`).
- `.nav-header__right`: `Perfil` y `CARRITO` con `#cart-count` y `aria-label` dinámico.

El menú `TIENDA` conserva `Ver todo`, `Destacados`, `Knit`, `Poleras`, `Polerones`, `Accesorios` y la miniatura editorial. Cada `[data-shop-view]` debe aplicar el filtro real, cerrar el panel y bajar suavemente: `featured` a `#productos-destacados`; `all`/categorías a `#productos`. Estos ids se añaden a `productCatalog()`.

No usar `role="menu"` ni `menuitem`. `showView('catalog')` ya cierra paneles, por lo que el scroll se solicita después de esa llamada. En jsdom, donde `scrollIntoView` no existe, el helper debe ser tolerante y las pruebas deben espiar la llamada.

### Rationale

La fila de 3 zonas es un contrato visual conocido y solo cambia la ubicación de los bloques; mover nodos sin cambiar IDs preserva el fixture y las suites de roles. Alinear los paneles al borde izquierdo evita que un menú anclado al centro parezca pertenecer al logo. Reutilizar `state.filters` y `showView()` evita duplicar la lógica de filtrado y garantiza el cierre del menú. Los destinos por id son estables aunque el catálogo se vuelva a renderizar.

### Alternatives considered

- Dejar los menús en el centro y solo maquillar el logo: rechazado porque no cumple la inversión solicitada.
- Centrar los paneles bajo el viewport: rechazado porque rompe la alineación izquierda requerida.
- Crear un router o estado de scroll nuevo: rechazado porque `showView()` ya es el punto único de navegación.
- Quitar `data-view`/`data-shop-view`: rechazado porque rompería helpers y pruebas existentes.

## Decisión 2: Permisos y etiqueta visible del rol (sin cambios)

### Decision

La etiqueta visible `Gerente General`, el identificador interno `admin`, la clave `erp.role`, `ROLES`, los flags por rol y `canAccessView()` permanecen exactamente como están. Las cuatro correcciones no abren Historial, Administración ni Métricas a roles no autorizados.

`showView()` continúa siendo la guarda de defensa en profundidad y `closeHeaderPanels()` el cierre único de disclosures. El código `1234` sigue siendo una constante de sesión privilegiada en `src/app.js` y solo se pide al seleccionar Gerente General sin sesión desbloqueada.

### Rationale

Reutilizar la autorización ya entregada evita reabrir Historial, Administración ni permisos mientras se corrigen solo presentación e interacción. Ocultar controles nunca puede considerarse autorización, por lo que `canAccessView()` debe permanecer en la ruta directa.

### Alternatives considered

- Modificar `canViewHistory` o `canAccessView` para acomodar el menú: rechazado porque cambiaría permisos ya validados.
- Persistir el rol o la sesión privilegiada de otra forma: rechazado porque no guarda relación con los cuatro puntos.
- Mover `1234` a `module-config.js`: rechazado porque mezcla una credencial de demostración con configuración de presentación.

## Decisión 3: CSS del Hero y etiquetas del gráfico

### Decision

Conservar los tokens monocromáticos, `border-radius: 0 !important`, `box-shadow: none !important` y `[hidden] { display: none !important; }`. El Hero debe conservar `--hero-image` y la regla árbitro final con `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%), var(--hero-image) !important`, pero `.hero__content` pasa a fondo transparente y sin borde. `h1` y `.view-subtitle` usan `#FFFFFF !important`; el único fondo permitido en el Hero es el pill `.hero__eyebrow` con texto `#111111` sobre `#FFFFFF`.

Los paneles de cabecera mantienen fondo blanco, borde `#111111` y esquinas rectas, pero se anclan con `left: 0`; `#shop-menu` elimina `left: 50%` y `transform: translateX(-50%)`. La miniatura editorial sigue siendo `<img>`, no `background-image`.

En `salesByDateChart()`, las ventas se agrupan por `YYYY-MM`. Cada columna muestra una etiqueta compacta (`$69k`), `title`/`aria-label` con `formatCurrency()` exacto y `.column-chart__value` con `white-space: nowrap`, `overflow: hidden` y `text-overflow: ellipsis`. La tabla `sr-only` conserva el detalle exacto. Para filtrar, el botón de la columna emite `data-chart-from`/`data-chart-to` con el primer y último día del mes, manteniendo compatibilidad con `data-chart-date`.

### Rationale

La regla con ID gana especificidad frente a la anulación global y al final del archivo deja explícita la precedencia. Quitar solo la tarjeta del Hero evita rehacer el layout y resuelve la contradicción visual sin tocar la foto ni el degradado. Agrupar por mes reduce el número de barras y, junto con la abreviatura, elimina colisiones incluso en ventanas estrechas; el valor exacto sigue accesible vía tooltip/tabla. `left: 0` es la forma mínima de cumplir la alineación izquierda sin cambiar la semántica disclosure.

### Alternatives considered

- Mantener la caja blanca con texto negro: rechazado porque contradice la especificación y el contraste solicitado.
- Usar `background` shorthand en el Hero: rechazado porque reinicia `background-size`/`background-position`.
- Reducir solo el `font-size` de los montos: rechazado por frágil si hay muchas fechas.
- Cambiar a canvas o librería de gráficos: rechazado por nueva dependencia y costo innecesario.

## Decisión 4: Pruebas y validación

### Decision

La línea base actual es `npm run test:002` con 25 archivos y 159 pruebas aprobadas, y `npm run build` correcto. `npm test -- --run` incluye 88 fallos heredados del módulo 001 que no deben reescribirse en este cambio.

Deben ajustarse las suites que cubren los cuatro puntos: `product-catalog.test.js` (Hero sin tarjeta, texto blanco), `header-shell.test.js` (zonas y alineación), `product-filters.test.js` (filtro + cierre + scroll), `metrics-charts.test.js` (etiquetas compactas y rangos mensuales) y `metrics-dashboard.test.js` (clic mensual). Las suites de permisos, historial y administración se conservan.

Las pruebas usan el fixture existente `mountMarkup()/startApp()`, conservan selectores puente y verifican CSS como texto. Para el scroll se stubgea `Element.prototype.scrollIntoView` con `vi.fn()` y se restaura después de cada caso.

### Rationale

Los cambios se concentran en FR-007 y FR-010. Verificar CSS por texto coincide con la convención actual y evita depender de estilos calculados en jsdom. Espiar `scrollIntoView` permite comprobar destino y opciones sin layout real.

### Alternatives considered

- Reescribir todas las suites heredadas: rechazado por fuera de alcance.
- Usar snapshots completos del header: rechazado por frágil ante cambios de clases.
- Validar solo con `npm test`: rechazado porque los fallos heredados enmascaran regresiones del alcance 002.

## Decisión 5: Riesgos y mitigaciones

### Decision

Riesgo principal: la regla global blanca del Hero puede seguir pintando `.hero__content`. Mitigación: regla árbitro final para `#view-catalog .view-header` y declaración explícita de fondo transparente para `.hero__content`.

Riesgo de layout: mover los menús puede heredar reglas de centrado. Mitigación: `left: 0` y `transform: none` en `#shop-menu`, con aserción en `header-shell.test.js`. Riesgo de scroll: jsdom no implementa el método y el destino puede renderizarse tarde. Mitigación: helper tolerante y llamada posterior a `showView('catalog')`. Riesgo de métricas: agrupar por mes cambia el filtrado exacto. Mitigación: `data-chart-from`/`data-chart-to` con compatibilidad de `data-chart-date`.

No se requiere migración de datos: no cambian productos, pedidos, roles ni `SEED_VERSION`. Los estados de menús y filtros siguen siendo efímeros.

### Rationale

Las cuatro correcciones son de presentación e interacción sobre datos ya existentes. Mantener IDs, claves y semillas reduce el área de regresión y permite verificar cada punto con suites ya presentes.

### Alternatives considered

- Incrementar `SEED_VERSION`: rechazado porque borraría datos semilla sin relación con el cambio.
- Persistir el estado de los menús o del scroll: rechazado porque es estado efímero de UI.
- Modificar permisos para compensar el nuevo menú: rechazado porque los accesos ya están resueltos por `canAccessView()`.
