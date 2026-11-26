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

La línea base actual es `npm run test:002` con 25 archivos y 161 pruebas aprobadas, y `npm run build` correcto. `npm test -- --run` incluye 88 fallos heredados del módulo 001 que no deben reescribirse en este cambio.

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

## Actualización de esta ronda: Perfil, acceso gerencial y marquesina

No aparecen `NEEDS CLARIFICATION` nuevos: el usuario y `spec.md` fijan los tres deltas. No se requieren agentes de investigación adicionales porque no hay dependencias, integraciones ni tecnologías nuevas; la decisión es reutilizar DOM, CSS y el estado efímero ya existente.

### Decisión 6: anclaje del popover de Perfil

#### Decision

Envolver `#profile-toggle` y `#profile-panel` en `.profile-container` dentro de `.nav-header__right`. El contenedor usa `position: relative`; el popover usa `right: 0; left: auto` con una regla específica posterior a `.header-menu`.

#### Rationale

Así el popover se alinea al botón Perfil sin alterar `left: 0` de `TIENDA`/`GESTIÓN`. El contenedor neighbor es la forma mínima de obtener un contexto de posicionamiento sin cambiar la fila de 3 zonas ni el fixture de pruebas.

#### Alternatives considered

- Alinear `#profile-panel` con `left: 0`: rechazado porque lo llevaría al costado izquierdo.
- Centrar con `left: 50%`/`translateX(-50%)`: rechazado porque contradice la alineación derecha.
- Reposicionar con JavaScript: rechazado porque el layout es estático y CSS basta.

### Decisión 7: sesión gerencial pendiente hasta validar `1234`

#### Decision

`erp.role = "admin"` indica rol seleccionado, no sesión activa. Al cargar o cambiar a `admin`, el estado es pendiente (`admin && !state.adminUnlocked`): se muestra `#admin-access` con `#admin-code`/`#admin-access-submit`, `#admin-access-error` queda oculto, y se ocultan `#role-logout`, `#manage-menu-toggle`, sus hijos y las vistas gerenciales. Solo el envío de `1234` activa `state.adminUnlocked`, oculta el formulario, reaplica permisos, habilita GESTIÓN y muestra logout; un código distinto muestra `Acceso denegado` sin cambiar el estado.

#### Rationale

Separa la selección de rol de la autenticación efectiva y mantiene `canAccessView()` como fuente de permisos. El error condicional evita mostrar «Acceso denegado» antes de que el usuario intente entrar. Reiniciar el estado al cambiar rol o cerrar sesión evita que un desbloqueo previo filtre a otro rol.

#### Alternatives considered

- Activar permisos al elegir `admin` y pedir código solo para Administración: rechazado porque expondría Métricas, Historial y logout antes de validar.
- Persistir `state.adminUnlocked` en `localStorage`: rechazado porque la credencial es de demostración y la sesión debe ser efímera.
- Mover la validación a `module-config.js`: rechazado porque no cambia la matriz de permisos, solo el momento de activación.

### Decisión 8: marquesina CSS sin saltos

#### Decision

`.announcement-bar` pasa a ser un viewport con `overflow: hidden` y `white-space: nowrap`. Dentro, `.announcement-track` contiene dos copias idénticas del mensaje; la segunda lleva `aria-hidden="true"`. La animación `@keyframes announcement-marquee` va de `translateX(0)` a `translateX(-50%)` con `linear infinite`, y `.announcement-bar:hover .announcement-track` usa `animation-play-state: paused`.

#### Rationale

Duplicar la pista y desplazar exactamente la mitad de su ancho hace que el reinicio del ciclo sea continuo. CSS puro evita timers, layout calculations y dependencias nuevas; el hover permite leer el aviso sin perderlo.

#### Alternatives considered

- `marquee` HTML obsoleto: rechazado por no ser estándar y no controlar pausa.
- JavaScript con `setInterval`: rechazado por costo innecesario y mayor riesgo de saltos.
- Una sola copia con `translateX(-100%)`: rechazado porque deja un espacio vacío al reiniciar.

## Actualización de esta ronda: nombre del cliente en Historial y texto `undefined`

No aparecen `NEEDS CLARIFICATION` nuevos: el usuario fija el flujo, la propiedad a conservar, la prohibición de opciones vacías y la prueba automatizada. No hay tecnologías, dependencias ni integraciones nuevas. La investigación se ejecutó con agentes enfocados en el flujo checkout → `erp.clients` → `#history-client` y en las convenciones de `test:002`.

### Decisión 9: mapear `fullName` del checkout a `Cliente.name`

#### Decision

El checkout debe crear o vincular el cliente con un objeto que use `name: data.fullName` como campo canónico, además de `email`, `address`, `city` y `phone`. `findOrCreateClient()` debe aceptar alias de nombre (`fullName`, `customerName`, `nombre`, `cliente`) pero normalizarlos al guardar `erp.clients[].name`. Cuando el correo ya existe y el cliente tiene el nombre ausente o no legible, se completa ese nombre sin duplicar el registro.

#### Rationale

El bug se reproduce por un desajuste de propiedades: `src/app.js` y `src/checkout.js` manejan `fullName`, mientras `src/storage.js` espera `name`; `addClient()` convierte el `undefined` resultante en cadena vacía. Unir ambos extremos en la propiedad canónica evita depender de que cada llamador recuerde el alias y mantiene la identidad por correo ya existente.

#### Alternatives considered

- Seguir pasando el objeto completo y modificar solo `addClient()`: rechazado porque deja dos nombres de campo válidos y facilita nuevas regresiones.
- Crear un campo `fullName` persistido adicional: rechazado porque duplicaría la verdad y obligaría a cambiar todas las lecturas del Historial.
- Forzar una excepción cuando falte `name`: rechazado porque rompería clientes antiguos y llamadores heredados; se prefiere normalización con respaldo legible.

### Decisión 10: sanear clientes antiguos y proteger el selector del Historial

#### Decision

`loadClients()` debe normalizar de forma aditiva los registros de `erp.clients`: resolver alias, recortar espacios externos, tratar `undefined`/`null`/`NaN` como ausentes y persistir el resultado sin cambiar claves ni `SEED_VERSION`. `orderHistory()` debe derivar la etiqueta de cada `<option>` de una función de respaldo: `name` legible → `email` → `code` → `Cliente sin nombre`; debe omitir registros sin `id` utilizable y aplicar respaldos similares a `documentType`, `orderNumber` y `status`.

#### Rationale

Los datos almacenados pueden conservar el nombre vacío generado por el bug o proceder de esquemas antiguos. Sanear al cargar evita que el estado inválido vuelva a aparecer tras recargar, y el respaldo en el render garantiza que ni siquiera datos corruptos manualmente produzcan opciones vacías o texto `undefined`. La normalización es aditiva y no destruye pedidos ni otras claves.

#### Alternatives considered

- Incrementar `SEED_VERSION` para borrar `erp.clients`: rechazado porque destruiría clientes y pedidos del usuario sin relación con el bug.
- Mostrar solo el correo como nombre: rechazado porque no cumple la preservación del nombre completo cuando este existe.
- Dejar el respaldo únicamente en el componente: rechazado porque el dato inválido seguiría persistido y podría filtrarse a otras vistas.

### Decisión 11: origen del síntoma `undefined` y prueba de regresión

#### Decision

No se encontró en el código actual ninguna expresión que imprima literalmente `undefined` o `definedundefined`: `escapeHtml()` convierte `undefined`/`null` en cadena vacía, las plantillas del Historial tienen respaldos parciales y una reproducción con jsdom no produjo esa cadena. El plan elimina el riesgo de forma determinista en tres capas —normalización al guardar, saneamiento al cargar y respaldo al renderizar— y agrega una aserción de `document.body.textContent` sin `undefined` en `tests/integration/order-history.test.js`.

La prueba debe completar una compra con un nombre nuevo y único, abrir Historial como rol autorizado, verificar que `#history-client` tenga una opción seleccionada con `textContent` exactamente igual al nombre ingresado y `value` no vacío, comprobar que no haya opciones vacías y verificar que el cuerpo del documento no contenga `undefined`.

#### Rationale

Aunque el literal no sea reproducible en el estado actual, el usuario lo observó y la consecuencia equivalente —opción en blanco por `name: ''`— sí es reproducible. Cubrir la cadena completa evita depender de una única expresión y hace imposible que datos incompletos antiguos vuelvan a romper la interfaz.

#### Alternatives considered

- Buscar solo una concatenación literal y no cambiar nada más: rechazado porque no explica ni corrige la opción vacía reproducible.
- Añadir la aserción de `undefined` sin arreglar la persistencia: rechazado porque podría pasar mientras el nombre sigue guardado como cadena vacía.
- Crear un nuevo archivo de prueba: rechazado porque `order-history.test.js` ya está incluido en `test:002` y concentra el flujo Historial.
