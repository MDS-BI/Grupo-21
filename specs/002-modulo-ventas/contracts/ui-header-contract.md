# Contrato de interfaz: cabecera, menú TIENDA, Hero y Evolución de ventas

**Feature**: `002-modulo-ventas`  
**Spec**: FR-007 y FR-010  
**Alcance**: contrato DOM/ARIA, interacción y estado de la SPA; no expone API HTTP.

## Propósito

Definir la interfaz observable que deben cumplir `index.html`, `src/app.js`, `src/module-config.js` y `src/styles.css` después del rediseño. Los IDs existentes se conservan como contratos de compatibilidad con las pruebas y con el fixture que monta `<body>` desde `index.html`.

## Contrato de cabecera

| Elemento | Selector / atributo | Requisito |
|---|---|---|
| Cinta superior | `.announcement-bar` | Fondo `#111111`, texto `#FFFFFF`, 11px, mayúsculas, `letter-spacing`; viewport con `overflow: hidden` y `white-space: nowrap`. |
| Pista de la marquesina | `.announcement-track`, `.announcement-message` | Dos copias idénticas del mensaje exacto; la segunda con `aria-hidden="true"`. `min-width: max-content`, `animation: announcement-marquee 18s linear infinite`; `@keyframes` de `translateX(0)` a `translateX(-50%)`; `.announcement-bar:hover .announcement-track` pausa la animación. |
| Cabecera | `.site-header` | Fila blanca con 3 zonas invertidas: `.nav-header__left` con `TIENDA`/`GESTIÓN`, `.nav-header__center` con la marca, `.nav-header__right` con Perfil/`CARRITO`. |
| Marca | `#brand-name` | Texto visible `ROOTSOUTH®`, bold, una sola línea, centrado; no existe `.brand__mark` ni cuadro/monograma `RS`. |
| Menú TIENDA | `#shop-menu-toggle`, `#shop-menu` | Trigger `aria-expanded="false"` y `aria-controls="shop-menu"`. Panel con `hidden` inicial y `left: 0`; sin `translateX(-50%)`. |
| Menú GESTIÓN | `#manage-menu-toggle`, `#manage-menu` | Mismo patrón ARIA y panel anclado a la izquierda (`left: 0`); el trigger se oculta por completo para Cliente y sus hijos dependen de `canAccessView`. |
| Opciones TIENDA | `[data-shop-view]` | `all`, `featured`, `Knit`, `Poleras`, `Polerones`, `Accesorios`. Cada clic aplica `state.filters`, cierra el panel y ejecuta `scrollIntoView` suave al destino correspondiente. |
| Destinos de scroll | `#productos-destacados`, `#productos` | `featured` → `#productos-destacados`; `all`/categorías → `#productos`. Deben existir aunque el catálogo se re-renderice. |
| Miniatura editorial | `.menu-thumb` | `<img src="/images/producto-1.jpg">`, `alt` descriptivo, `aspect-ratio:3/4`, fondo `#F4F4F4`. |
| Vistas GESTIÓN | `[data-view="history"]`, `[data-view="metrics"]`, `[data-view="admin"]` | Permanecen dentro del submenú; su visibilidad se deriva de `canAccessView(role, view)`. |
| Perfil | `.profile-container`, `#profile-toggle`, `#profile-panel` | `.profile-container` con `position: relative`; trigger `aria-expanded="false"` y `aria-controls="profile-panel"`; tarjeta flotante no modal con fondo blanco y borde `#111111`, anclada con `right: 0; left: auto` justo debajo de Perfil. |
| Selector de rol | `#role-select` | Exactamente tres opciones: `customer` → Cliente, `sales` → Vendedor, `admin` → Gerente General. |
| Acceso privilegiado | `#admin-access`, `#admin-code`, `#admin-access-submit`, `#admin-access-error` | Se muestra de inmediato al seleccionar `admin` con `state.adminUnlocked === false`. `#admin-access-error` permanece oculto hasta un envío inválido. Código aceptado: `1234`; al validar se oculta el formulario y se activa la sesión. |
| Cerrar sesión | `#role-logout` | Oculto para Cliente y para Gerente General pendiente; visible para Vendedor y Gerente General validado. Al pulsar: rol `customer`, vista `catalog`, sesión privilegiada reiniciada y paneles cerrados. |
| Carrito | `#cart-toggle`, `#cart-count` | `#cart-count` vive dentro del ícono de bolsa; el botón mantiene `[data-view="cart"]` y su `aria-label` incluye el número de artículos. |
| Aviso de denegación | `#role-access`, `#role-denied`, `#role-denied-return` | Sin cambios; se muestra cuando una vista restringida se solicita directamente. |

Los triggers `TIENDA`, `GESTIÓN` y Perfil no deben llevar `data-view`; los helpers de prueba seleccionan el primer `[data-view]` para navegar a Catálogo.

## Matriz de visibilidad

| Vista / control | Cliente | Vendedor | Gerente General |
|---|---|---|---|
| Catálogo, Carrito, Checkout, Confirmación | Sí | Sí | Sí |
| Menú TIENDA | Sí | Sí | Sí |
| Menú GESTIÓN | No | Sí | Sí |
| `Historial` | No | Sí | Sí |
| `Métricas` | No | No | Sí |
| `Administración` | No | No | Sí, previo `1234` |
| `#admin-access` | No | No | Sí, mientras no esté desbloqueado |
| `#role-logout` | No | Sí | Sí |
| Límite de crédito | No | No | Sí |

La columna de Gerente General de la matriz describe la sesión validada. Con `erp.role = "admin"` pero sin `state.adminUnlocked`, el estado es pendiente: `GESTIÓN`, `#role-logout`, Historial, Métricas, Administración y el límite de crédito sin enmascarar permanecen ocultos, y solo `#admin-access` está visible.

`customer.canViewHistory` debe ser `false`. Ocultar un control no sustituye a la guarda: `showView(view)` debe verificar `canAccessView(getRole(), view)` y, para `admin`, `state.adminUnlocked`.

## Contrato de estado

| Estado | Transiciones permitidas |
|---|---|
| Rol | `customer` → `sales`/`admin`; `sales`/`admin` → otro rol; cualquier rol no `customer` → `customer` mediante Cerrar sesión. |
| Vista | `showView(view)` valida permiso; si falla, vista efectiva `catalog` y aviso `#role-denied`. Con sesión gerencial pendiente, las vistas gerenciales no se activan. |
| Sesión privilegiada | Al cargar o seleccionar `admin`: pendiente (`adminUnlocked = false`, `#admin-access` visible, logout y GESTIÓN ocultos). `false` → `true` solo con envío de `1234`; vuelve a `false` al cambiar rol, cerrar sesión o recargar. |
| Error de acceso | `#admin-access-error` sigue oculto hasta un envío con código incorrecto; un error no cambia el rol ni activa permisos. |
| Disclosure | Cerrado ↔ abierto mediante trigger; abrir uno cierra los otros; Escape, clic fuera, navegación, cambio de rol, cierre de sesión y selección en `TIENDA` cierran todos. |
| Filtro desde TIENDA | `featured` → `featuredOnly: true`; `all` → `category: 'all'`; categoría → `category` concreta. `showView('catalog')` se ejecuta antes del scroll. |
| Rango mensual del gráfico | `data-chart-from`/`data-chart-to` → `state.metrics.from`/`to`; `data-chart-date` sigue válido para fechas exactas. |
| Contador carrito | Recalculado desde `getCartCount()` tras agregar, cambiar cantidad, eliminar y confirmar compra. |

Todos los estados de disclosure son efímeros: `hidden` es la fuente de visibilidad y `aria-expanded` debe reflejar el mismo valor.

## Contrato visual del Hero

| Elemento | Requisito |
|---|---|
| Imagen | `/images/hero-banner.jpg` servida desde `public/images/`; `background-image` debe conservar `var(--hero-image)`. |
| Badge | Texto exacto `ROOTSOUTH · COLECCIÓN 2026`; único fondo del Hero, con contraste `#111111` sobre `#FFFFFF` o blanco sobre negro. |
| Degradado | `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)` aplicado sobre la fotografía desde la izquierda. |
| Texto principal | `CATÁLOGO DE PRODUCTOS` y subtítulo en `#FFFFFF !important`, directamente sobre la foto; `.hero__content` sin `background`, `border` ni tarjeta blanca. |
| Precedencia CSS | La regla del Hero debe aparecer después de `background-image: none !important` y después del último bloque responsive de `src/styles.css`. |

## Contrato de «Evolución de ventas»

| Elemento | Requisito |
|---|---|
| Agrupación | Las ventas se agrupan por mes (`YYYY-MM`) para reducir el número de columnas. |
| Etiqueta visible | Valor compacto como `$69k`, sin superposición; `.column-chart__value` conserva `white-space: nowrap`, `overflow: hidden` y `text-overflow: ellipsis`. |
| Valor exacto | `title`/`aria-label` de la etiqueta y tabla `sr-only` contienen `formatCurrency()` sin abreviar. |
| Filtrado | El botón de cada columna expone `data-chart-from`/`data-chart-to` con el rango mensual; se mantiene `data-chart-date` para fechas exactas. |

## Contrato de verificación

Las pruebas pueden verificar el contrato sin calcular estilos:

- Ubicación de zonas, ausencia de `.brand__mark` y estado `hidden`/`aria-expanded` de los paneles.
- Paneles anclados a la izquierda (`left: 0`, sin `translateX(-50%)`).
- Cada `[data-shop-view]` produce filtro real, panel cerrado y `scrollIntoView` al destino correcto.
- CSS del Hero sin caja blanca, título/subtítulo `#FFFFFF` y degradado exacto al final del archivo.
- Etiquetas compactas de «Evolución de ventas», monto exacto en tooltip/tabla y rangos mensuales en el filtro.
- Texto y `value` del selector de roles y matriz de permisos existente, sin cambios.
- Popover de Perfil anclado a la derecha desde `.profile-container`, sin alterar `left: 0` de los menús izquierdos.
- Selección de `admin` en estado pendiente, error solo tras código inválido y desbloqueo con `1234` que habilita GESTIÓN, vistas gerenciales y logout.
- Marquesina con pista duplicada, animación `translateX(-50%)` infinita lineal y pausa en hover.

No se define contrato de red: la aplicación no consume ni expone endpoints HTTP en este cambio.
