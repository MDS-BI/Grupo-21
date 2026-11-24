# Plan para el Módulo de Ventas (Basado en el Módulo Base ERP)

> **Reconciliación con `spec.md` (T050)**: la implementación final de esta entrega es una **tienda en línea** (catálogo con stock, filtros, carrito, cupones, checkout e historial de pedidos), tal como se define en `spec.md`. Las secciones 1–4 conservan el diseño B2B original (Clientes y Documentos de Venta) como referencia de negocio y de stack; la sección 2.1 y la sección 10 describen el alcance realmente construido y su trazabilidad con las historias de usuario. El FR-009 del plan B2B (eliminación en cascada de documentos al borrar un cliente) se mantiene como referencia histórica: el FR-009 vigente en `spec.md` exige la tienda RootSouth con ocho productos reales y datos semilla coherentes. El FR-010 define la estética editorial Scuffers con Hero Banner, destacados/catálogo en cuatro columnas. El FR-007 incorpora gráficos interactivos de ingresos por categoría, evolución de ventas, distribución por estado y ranking con barras de progreso. El FR-008 reduce la configuración a exactamente tres roles (`Cliente`, `Vendedor`, `Dueño/Administrador`) con administración protegida por código `1234`. Estos requisitos se detallan en las secciones 5.1 y 12, y se verifican en la sección 11.

## Resumen

El Módulo de Ventas está orientado a los usuarios del área comercial de la empresa. Sus usuarios potenciales principales son los ejecutivos de ventas, quienes gestionan clientes, elaboran cotizaciones y dan seguimiento a los pedidos; los supervisores o jefes de ventas, que revisan y aprueban documentos, controlan el avance del ciclo de vida y consultan los indicadores del panel; y, de forma secundaria, el personal administrativo que apoya el registro y la actualización de datos comerciales.

El diseño debe incorporar el manejo responsable de riesgos y datos sensibles. Los datos fiscales de los clientes, como el RUT/RFC/NIT (taxId), deben tratarse como información confidencial: se recomienda validar su formato al ingresarlos, restringir su visualización según el rol, evitar exponerlos innecesariamente en listados o mensajes y no registrarlos en logs. Respecto de los límites de crédito, deben considerarse como datos comerciales sensibles sujetos a control de acceso y auditoría; el módulo solo los almacena y muestra, y cualquier bloqueo o aprobación automática por crédito queda para una iteración futura con reglas explícitas. Finalmente, para prevenir sesgos en el diseño, las búsquedas, filtros, ordenamientos y reglas de aprobación deben basarse en criterios objetivos y verificables (estado, fechas, montos, condiciones de pago), evitando decisiones automatizadas sobre clientes o vendedores a partir de atributos personales y asegurando que la información mostrada sea transparente y trazable.

## 1. Objetivo

Desarrollar el módulo de Ventas partiendo del Módulo Base ERP (001-erp-base-module), adaptándolo para cubrir la gestión comercial de una empresa. El objetivo es permitir administrar la cartera de clientes, generar cotizaciones/pedidos de venta y dar seguimiento a su ciclo de vida, sin modificar el núcleo del sistema, únicamente mediante el archivo de configuración src/module-config.js.

## 2. Alcance

### Dentro del alcance (alcance implementado, según `spec.md`)

- Catálogo de productos: productos semilla con nombre, descripción, precio, categoría, stock y marca de destacado; los productos sin stock se muestran como agotados y no se pueden comprar.
- Filtros de catálogo: filtrado combinado por categoría y precio máximo, con mensaje de resultados vacíos y acción de reinicio.
- Carrito de compras: añadir productos, ajustar cantidades, quitar líneas, vaciar y recalcular subtotal/total; el carrito persiste en `localStorage` y respeta el stock disponible.
- Cupones: validación de código, vigencia y límite de uso; descuento porcentual o fijo; notificaciones de éxito/error y restauración del total al quitar el cupón.
- Checkout: formulario de envío y método de pago, validación de campos obligatorios, pasarela simulada (éxito, rechazo y timeout), descuento de stock y número de pedido `PED-YYYYMMDD-NNNN`.
- Confirmación e historial: página de confirmación con resumen y número de pedido; historial de documentos de venta por cliente con tipo, fecha, número, monto y estado; límite de crédito enmascarado para roles sin permisos financieros.
- Administración de precios y ofertas: el rol `admin` puede editar el precio de un producto (validado como numérico y no negativo) y crear, editar, activar, desactivar o eliminar ofertas por porcentaje o monto fijo con vigencia. El catálogo muestra el precio con descuento, el precio original tachado y la insignia «Oferta»; el carrito aplica el precio efectivo y lo recalcula si la oferta cambia. Los roles sin `canManageCatalog` reciben un mensaje de permisos.
- Personalización por configuración y roles: nombre del módulo, etiquetas, color de acento y control de acceso a datos financieros y a la administración del catálogo desde `src/module-config.js`.
- Catálogo RootSouth (FR-009): ocho productos reales con imágenes `/images/producto-1.jpg` a `/images/producto-8.jpg`, categorías `Knit`, `Poleras`, `Polerones` y `Accesorios`, ofertas semilla y pedidos iniciales coherentes con las prendas.
- Estética editorial (FR-010): fondo `#FFFFFF`, Hero Banner con imagen `/images/hero-banner.jpg` y overlay oscuro, marcos 3:4 con fondo `#F4F4F4`, paleta monocromática `#111111`, bordes `0px`, destacados y catálogo en cuadrícula plana de cuatro columnas, etiquetas en mayúsculas espaciadas y zoom sutil al pasar el cursor.
- Métricas visuales (FR-007): gráficos interactivos de barras por categoría, columnas por fecha, distribución proporcional por estado (semántica `success`/`info`/`warning`/`danger`) y ranking con barras de progreso; los controles filtran el panel y las tablas ocultas sirven como alternativa accesible.
- Roles exactos (FR-008): `Cliente`, `Vendedor` y `Dueño/Administrador`; no existen los roles `Bodega` ni `Finanzas`. El límite de crédito y la administración son exclusivos del dueño/administrador, con código `1234`.

### Fuera del alcance

- Administración de inventario y CRUD completo de productos desde la interfaz (el catálogo semilla se consume y el stock se descuenta al comprar; la administración se limita a editar precios y gestionar ofertas).
- Módulo de Facturación Electrónica: se deja para una futura iteración.
- Cuentas por Cobrar/Pagar: no forma parte de este módulo.
- Multi-sucursal o Multi-empresa: el sistema trabaja sobre un único espacio de trabajo.
- Backend, autenticación real y pasarela de pago real: la persistencia es local y el pago es simulado.

### 2.1 Alcance B2B de referencia (no implementado en esta entrega)

El diseño original contemplaba gestión de Clientes y Documentos de Venta (Cotización → Pedido → Facturado) con límite de crédito y condiciones de pago. Ese modelo se conserva en `data-model.md` como referencia de dominio y de evolución, pero **no** es el flujo construido en esta entrega. La tienda en línea solo usa un subconjunto de Cliente (nombre, correo, dirección) y Pedido (ítems, subtotal, descuento, total, estado `Pedido`).

## 3. Mapeo con el Módulo Base

| Concepto Base | Adaptación para Ventas | Descripción |
|---|---|---|
| Entidad | Cliente | Representa a personas naturales o jurídicas con los que se realiza negocio. |
| Documento | Pedido de Venta / Cotización | Representa una transacción comercial vinculada a un cliente. Puede iniciar como cotización y evolucionar a pedido/factura. |
| Panel | Panel de Ventas | Punto de entrada con acciones rápidas orientadas al área comercial. |
| Búsqueda | Búsqueda de Clientes/Pedidos | Permite localizar clientes o documentos de venta rápidamente. |

**Mapeo del alcance implementado (tienda en línea)**

| Concepto implementado | Archivo | Descripción |
|---|---|---|
| Producto | `src/data/products.js`, `src/storage.js` | Catálogo semilla y CRUD interno con precio, stock, categoría y destacado. |
| Filtros de catálogo | `src/catalog.js`, `src/components/product-filters.js` | Filtrado por categoría y precio máximo con estado vacío. |
| Carrito | `src/storage.js`, `src/components/cart.js` | Líneas con cantidad, subtotal, descuento y total; persistencia local. |
| Cupón | `src/coupons.js`, `src/components/coupon-form.js` | Código, tipo (porcentaje/fijo), vigencia y límite de uso. |
| Pedido | `src/storage.js`, `src/checkout.js`, `src/components/order-confirmation.js` | Documento de venta con número `PED-…`, ítems, totales y estado `Pedido`. |
| Historial | `src/components/order-history.js`, `src/app.js` | Documentos de venta por cliente y enmascaramiento de `creditLimit` por rol. |
| Oferta | `src/offers.js`, `src/data/offers.js`, `src/storage.js` | Validación, vigencia, resolución de la mejor oferta activa y precio efectivo por producto. |
| Panel de administración | `src/components/admin-panel.js`, `src/app.js` | Edición de precios, CRUD de ofertas y restricción de acceso por rol (`canManageCatalog`). |
| Catálogo RootSouth (FR-009) | `src/data/products.js`, `public/images/`, `src/catalog.js` | Ocho prendas reales con `<img>` y categorías de la tienda. |
| Pedidos semilla (FR-007/FR-009) | `src/data/seed-orders.js`, `src/storage.js` | Doce documentos iniciales para `client-demo` en los últimos tres meses y versión de esquema `rootsouth-2026-11-charts`. |
| Gráficos (FR-007) | `src/metrics.js`, `src/components/metrics-charts.js`, `src/components/metrics-dashboard.js` | Agregaciones para categorías, fechas, estados y ranking; filtros por clic en gráficos. |
| Tokens visuales (FR-010) | `src/styles.css`, `public/images/hero-banner.jpg`, `src/module-config.js` | Hero Banner, grillas planas de cuatro columnas, estética editorial Scuffers y rol por defecto `customer`. |

## 4. Propuesta de Configuración (src/module-config.js)

```js
export const userConfig = {
  moduleName: "Módulo de Ventas",

  labels: {
    entity: "Cliente",
    entities: "Clientes",
    document: "Pedido de Venta",
    documents: "Pedidos de Venta",
    newEntity: "Nuevo Cliente",
    newDocument: "Nueva Cotización/Pedido",
    manageEntities: "Gestionar Clientes",
    searchRecords: "Buscar Clientes o Pedidos",
    dashboardTitle: "Panel de Ventas",
  },

  customFields: [
    { target: "entity", key: "rfcNit", label: "RFC / NIT", type: "text", required: false },
    { target: "entity", key: "contactName", label: "Nombre de contacto", type: "text", required: false },
    // creditLimit y paymentTerms son campos BASE del modelo (ver data-model.md).
    // El perfil de Ventas los muestra en formularios como alias de UI y NO se
    // declaran como customFields para no duplicar almacenamiento ni chocar con
    // las claves base. Las opciones válidas de paymentTerms en Ventas son:
    // Contado, Crédito 15 días, Crédito 30 días, Crédito 45 días, Crédito 60 días.
    { target: "entity", key: "salesRep", label: "Vendedor asignado", type: "text", required: false },

    { target: "document", key: "deliveryDate", label: "Fecha de entrega", type: "date", required: false },
    { target: "document", key: "paymentMethod", label: "Forma de pago", type: "select", required: false, options: ["Efectivo", "Transferencia", "Tarjeta", "Crédito"] },
    { target: "document", key: "quoteValidity", label: "Vigencia de cotización", type: "date", required: false },
    { target: "document", key: "sellerNotes", label: "Observaciones del vendedor", type: "text", required: false },
  ],

  statusLifecycle: {
    statuses: ["Cotización", "En revisión", "Aprobado", "Pedido", "En proceso", "Facturado", "Cancelado", "Vencido"],
    transitions: {
      "Cotización": ["En revisión", "Aprobado", "Cancelado", "Vencido"],
      "En revisión": ["Aprobado", "Cotización", "Cancelado", "Vencido"],
      "Aprobado": ["Pedido", "Cancelado"],
      "Pedido": ["En proceso", "Facturado", "Cancelado"],
      "En proceso": ["Facturado", "Cancelado"],
      "Facturado": [],
      "Cancelado": [],
      "Vencido": []
    }
  },

  theme: {
    accentColor: "#1F7A3E"
  }
};
```

> **Nota de implementación**: `src/module-config.js` expone `DEFAULT_CONFIG` con las etiquetas del escaparate y de gráficos, los roles exactos `customer` (Cliente), `sales` (Vendedor) y `admin` (Dueño/Administrador), y el color de acento `#111111`. El bloque anterior queda como referencia del perfil B2B original.

## 5. Funcionalidades Detalladas

| Funcionalidad | Descripción | Origen en el Base |
|---|---|---|
| Catálogo de Clientes | Listado, alta, modificación y baja de clientes con sus datos fiscales, de contacto y comerciales. | HU1, HU2, HU4 |
| Cotizaciones | Generar una cotización para un cliente con fecha, condiciones y observaciones. Al aprobarla, puede convertirse en Pedido de Venta. | HU10 + Ciclo de Vida (HU12) |
| Pedidos de Venta | Seguimiento desde "Pedido" hasta "Facturado", con control de estados y restricciones de transición. | HU10 + HU12 |
| Búsqueda Comercial | Buscar clientes por nombre, código, RFC/NIT, vendedor o por datos del pedido. También filtrar por estado del documento. | HU8, HU11 |
| Panel de Ventas | Acciones rápidas: "Nuevo Cliente", "Nueva Cotización", "Gestionar Clientes", "Buscar Clientes/Pedidos". Tarjetas con totales de Clientes, Cotizaciones, Pedidos y Facturados. | HU3 (revisada), HU13 |
| Integridad Comercial (FR-009 B2B de referencia) | Al eliminar un cliente, sus cotizaciones/pedidos deben eliminarse automáticamente. | HU10; hoy `deleteOrdersForClient` en `src/storage.js` |
| Campos Comerciales | Mostrar límite de crédito, condiciones de pago, fecha de entrega y forma de pago en formularios, listas y detalles. | HU7 |

> **FR-009 (reconciliación)**: en el plan B2B original, FR-009 designaba la integridad comercial y la eliminación en cascada de cotizaciones/pedidos al borrar un cliente; ese comportamiento subsiste en la tienda con `deleteOrdersForClient`. El FR-009 de `spec.md` cambia de alcance: exige que el catálogo sea la tienda de ropa RootSouth con ocho productos reales e imágenes, y que los pedidos iniciales de historial y métricas correspondan a esas prendas, limpiando los datos de tecnología mediante versionado de esquema. El FR-009 vigente no debe leerse como un requisito B2B de eliminación en cascada.

### 5.1 Datos y presentación RootSouth (FR-009 y FR-010)

**FR-009.** `src/data/products.js` contiene ocho prendas y accesorios RootSouth con `image` servida desde `public/images/producto-1.jpg` a `public/images/producto-8.jpg` como `/images/producto-1.jpg` a `/images/producto-8.jpg`; `src/catalog.js` las renderiza con `<img>`.

| ID | Producto | Precio (CLP) | Categoría | Stock |
|---|---|---:|---|---:|
| `prod-steel-zip-knit` | Steel Zip Knit | 77990 | Knit | 12 |
| `prod-polera-coach-c` | Polera Coach C - Gris Claro | 25990 | Poleras | 20 |
| `prod-black-zipper-layers` | Black Zipper Layers | 67990 | Polerones | 14 |
| `prod-jockey` | Jockey | 16990 | Accesorios | 30 |
| `prod-bandanas` | Bandanas | 2997 | Accesorios | 0 (Agotado) |
| `prod-llavero-rootsouth` | Llavero Rootsouth Original | 5000 | Accesorios | 50 |
| `prod-tarjetero-rootsouth` | Tarjetero Rootsouth | 9790 | Accesorios | 25 |
| `prod-vaso-matero` | Vaso Matero | 9990 | Accesorios | 18 |

- Categorías: `Knit`, `Poleras`, `Polerones` y `Accesorios`.
- Ofertas semilla (`src/data/offers.js`): `offer-steel-zip-10` (10 % en `prod-steel-zip-knit`), `offer-coach-c-5000` ($5.000 fijos en `prod-polera-coach-c`) y `offer-vaso-vencida` (vencida, en `prod-vaso-matero`).
- `src/data/seed-orders.js` exporta `createSeedOrders(referenceDate)` y `seedOrders`: doce documentos iniciales para `client-demo` con ítems de estas prendas y fechas relativas a los últimos 82 días. Línea base de `src/metrics.js`: ingresos `896122`, 9 ventas completadas, ticket promedio `99569`, 12 documentos y descuento total `25000`; estados `Cotización` (2), `Pedido` (5), `Facturado` (4) y `Cancelado` (1).
- `src/storage.js` exporta `SEED_VERSION = 'rootsouth-2026-11-charts'` y guarda la versión en `erp.seedVersion`. Si no coincide, `ensureSeedSchema()` limpia y recrea productos, pedidos, carrito, ofertas y uso de cupones, eliminando los datos heredados de tecnología.

**FR-010.** `src/styles.css` aplica la estética Scuffers: fondo blanco `#FFFFFF`, Hero Banner servido desde `public/images/hero-banner.jpg` con overlay oscuro y tipografía blanca de alto contraste, marcos de producto 3:4 con fondo `#F4F4F4`, paleta monocromática en `#111111` y grises neutros, bordes `0px`, destacados y catálogo en cuadrícula plana de cuatro columnas, tipografía sans-serif con navegación y categorías en mayúsculas espaciadas y zoom sutil de la imagen en hover. `src/module-config.js` fija `theme.accentColor = '#111111'`. El rol por defecto es `customer`, con acceso al historial; `admin` reúne permisos financieros, de catálogo y de métricas, y desbloquea el panel con el código `1234` en `#admin-code`.

## 6. Plan de Implementación por Fases

| Fase | Actividad | Estado | Observaciones |
|---|---|---|---|
| Fase A: Configuración | Crear/ajustar src/module-config.js con el perfil de Ventas. Validar con tests/unit/module-config.test.js. | Completado | Punto de partida. |
| Fase B: Etiquetado | Comprobar que todo el UI muestra "Cliente", "Clientes", "Pedido de Venta", "Cotización" según la configuración. | Completado | Barra lateral, panel, formularios, listas y mensajes. |
| Fase C: Datos Comerciales | Probar campos personalizados (rfcNit, creditLimit, paymentTerms, deliveryDate, etc). Verificar persistencia, visualización y búsqueda. | Completado | Aprovechar customFields. |
| Fase D: Ciclo de Vida | Validar transiciones de estado desde el formulario de documentos. Probar casos inválidos y asegurar que solo se muestran estados permitidos. | Completado | Crítico para el flujo Cotización → Pedido → Facturado. |
| Fase E: Flujos de Ventas | Probar creación de cliente, creación de cotización, cambio de estado, asociación cliente-documento, eliminación en cascada. | Completado | Cubrir con pruebas de integración existentes. |
| Fase E2: Panel y Navegación | Verificar panel de Ventas, acciones rápidas, estadísticas en tiempo real y navegación por barra lateral. | Completado | Debe funcionar igual al rediseño ERP. |
| Fase F: Pruebas y Validación | Ejecutar npm test, revisión manual de flujos y validación de responsive. | Completado | Asegurar que no hay regresiones con el módulo base. |

## 7. Criterios de Aceptación

| ID | Criterio | Tipo |
|---|---|---|
| CV-001 | Al cargar la app con la configuración de Ventas, el nombre "Módulo de Ventas" debe aparecer en la barra superior, panel y título. | Funcional |
| CV-002 | Todos los textos deben usar "Cliente/Clientes" y "Pedido de Venta/Cotizaciones" en lugar de "Entidad/Documento". | Funcional |
| CV-003 | Se puede crear un cliente con sus campos comerciales (RFC/NIT, Límite de crédito, Condiciones de pago) y estos se guardan correctamente. | Funcional |
| CV-004 | Se puede crear una cotización asociada a un cliente, cambiar su estado siguiendo las transiciones configuradas y esta restricción se aplica al guardar. | Funcional |
| CV-005 | Las transiciones inválidas (ej. Facturado → Cotización) deben ser rechazadas con un mensaje claro. | Funcional |
| CV-006 | Al buscar por nombre de cliente, RFC/NIT o vendedor, los resultados deben mostrarse correctamente. | Funcional |
| CV-007 | Al eliminar un cliente, sus cotizaciones/pedidos deben eliminarse automáticamente. | Funcional |
| CV-008 | El panel muestra contadores correctos de Clientes, Cotizaciones/Pedidos y su total debe coincidir con lo almacenado en localStorage. | Funcional |
| CV-009 | El módulo funciona únicamente con src/module-config.js, sin modificar app.js, storage.js, shell.js u otros archivos del núcleo. | Extensibilidad |
| CV-010 | La aplicación es usable en escritorio y móvil, con la barra lateral contraída correctamente en pantallas pequeñas. | UX/Responsive |

## 8. Recomendaciones

- Mantener consistencia: Usar la terminología "Cotización" para el documento en estado inicial.
- Validar crédito: Aunque el módulo base no bloquea por límite de crédito, el campo creditLimit queda listo para futuras extensiones.
- Probar con datos reales: Crear al menos 2-3 clientes y un flujo completo (Cotización → Aprobado → Pedido → Facturado).
- Documentar el perfil: Añadir un comentario al inicio de src/module-config.js indicando que corresponde al perfil "Ventas".
- Verificar con la suite: Tras aplicar la configuración, ejecutar npm test para confirmar que las pruebas siguen pasando.

## 9. Entregable Esperado

1. src/module-config.js configurado para el Módulo de Ventas.
2. Aplicación funcional con terminología comercial correcta.
3. Flujo completo de Cotización/Pedido operativo con control de estados.
4. Panel de Ventas con acciones rápidas y estadísticas correctas.
5. Validación exitosa de la suite de pruebas (npm test).

## 10. Estado de implementación del alcance `spec.md`

| Historia | Prioridad | Estado | Evidencia |
|---|---|---|---|
| US1 Catálogo de productos destacados | P1 | Implementado | `src/components/product-card.js`, `src/components/product-catalog.js`, `public/images/hero-banner.jpg`, `tests/integration/product-catalog.test.js` |
| US2 Filtrado por categoría y precio | P2 | Implementado | `src/catalog.js`, `src/components/product-filters.js`, `tests/integration/product-filters.test.js` |
| US3 Gestión de carrito | P3 | Implementado | `src/storage.js`, `src/components/cart.js`, `tests/integration/cart.test.js` |
| US4 Cupones de descuento | P4 | Implementado | `src/coupons.js`, `src/components/coupon-form.js`, `tests/integration/coupons.test.js` |
| US5 Checkout y confirmación | P5 | Implementado | `src/checkout.js`, `src/payments.js`, `src/components/checkout-form.js`, `src/components/order-confirmation.js`, `tests/integration/checkout.test.js` |
| US6 Historial de documentos de venta | P6 | Implementado | `src/components/order-history.js`, `src/module-config.js`, `tests/integration/order-history.test.js` |
| US7 Administración de precios y ofertas | P7 | Implementado | `src/offers.js`, `src/components/admin-panel.js`, `src/storage.js`, `tests/integration/admin-panel.test.js`, `tests/integration/offer-lifecycle.test.js` |
| US8 Panel de métricas e indicadores | P8 | Implementado | `src/metrics.js`, `src/components/metrics-charts.js`, `src/components/metrics-dashboard.js`, `src/app.js`, `tests/unit/metrics.test.js`, `tests/unit/metrics-filters.test.js`, `tests/unit/metrics-charts.test.js`, `tests/integration/metrics-dashboard.test.js` |
| US9 Vistas y navegación por rol | P9 | Implementado | `src/module-config.js`, `src/app.js`, `index.html`, `src/components/product-card.js`, `tests/unit/role-permissions.test.js`, `tests/integration/role-views.test.js` |

- Roles implementados en `DEFAULT_CONFIG.roles` y exportados como `ROLES`: `customer` (Cliente, rol por defecto con catálogo, carrito, pago e historial), `sales` (Vendedor, stock e historial) y `admin` (Dueño/Administrador, con `canViewFinancials`, `canManageCatalog` y `canViewMetrics`). No existen `warehouse` ni `finance`; el panel de administración exige el código `1234` en `#admin-code` y `showView('admin')` vuelve al catálogo si la sesión privilegiada no fue desbloqueada.
- La decisión anterior de retirar el panel de métricas por considerarlo no solicitado quedó supersedida por US8 en `spec.md`; el panel se calcula desde `erp.orders`, `erp.products`, `erp.coupons`, `erp.couponUsage` y `erp.offers`, sin almacenar una entidad adicional.
- Datos semilla FR-007/FR-009: `src/data/products.js` (8 prendas RootSouth con `image`, 4 destacadas), `src/data/offers.js` (3 ofertas) y `src/data/seed-orders.js` (12 documentos para `client-demo`). `SEED_VERSION = 'rootsouth-2026-11-charts'` en `src/storage.js` hace que un cambio de versión limpie y recree productos, pedidos, carrito, ofertas y uso de cupones, descartando los datos de tecnología anteriores.
- Verificación final T097: `npm run test:002` terminó con 24 archivos y 150 pruebas aprobadas; `npm run build` compiló correctamente; `npm test -- --run` terminó con 24 archivos aprobados, 11 fallidos, 152 pruebas aprobadas y 88 fallidas. Los fallos de `npm test` provienen de suites heredadas del módulo base 001 (API `addEntity`/`addDocument`, `BASE_FIELDS`, terminología y tema base) y quedan fuera del alcance 002; la sección 11 detalla las comprobaciones de FR-007, FR-009 y FR-010.
- Los antiguos criterios CV-001 a CV-010 y las fases A–F de la sección 6 corresponden al perfil B2B de referencia; no son criterios de aceptación de esta entrega.
- Las pruebas heredadas del módulo base 001 permanecen en `tests/` pero dependen de una implementación que no forma parte de este alcance.

## 11. Verificación de FR-009, FR-010 y datos RootSouth

| ID | Comprobación | Evidencia esperada |
|---|---|---|
| V-009-1 | Los ocho productos semilla cargan con sus ID, precios, stock, categorías RootSouth y exactamente cuatro destacados. | `src/data/products.js`, `erp.products`, sección 5.1 |
| V-009-2 | Las ocho tarjetas renderizan `<img>` con `/images/producto-1.jpg` a `/images/producto-8.jpg`, servidos desde `public/images/`. | `src/catalog.js`, `src/components/product-card.js`, `public/images/` |
| V-009-3 | El filtro ofrece `Knit`, `Poleras`, `Polerones` y `Accesorios`; `prod-bandanas` queda agotado con stock 0. | `src/catalog.js`, `src/components/product-filters.js` |
| V-009-4 | Las ofertas semilla son `offer-steel-zip-10`, `offer-coach-c-5000` y `offer-vaso-vencida` (vencida). | `src/data/offers.js`, `erp.offers`, `src/offers.js` |
| V-009-5 | Los doce documentos de `src/data/seed-orders.js` pertenecen a `client-demo`, usan solo productos RootSouth y caen en los últimos tres meses. | `src/data/seed-orders.js`, `erp.orders`, `erp.clients` |
| V-009-6 | El panel arranca con ingresos 896122, 9 ventas completadas, ticket promedio 99569, 12 documentos y descuento 25000. | `src/metrics.js`, `src/components/metrics-dashboard.js` |
| V-009-7 | Un `erp.seedVersion` distinto de `rootsouth-2026-11-charts` limpia y recrea productos, pedidos, carrito, ofertas y uso de cupones. | `SEED_VERSION` y `ensureSeedSchema()` en `src/storage.js` |
| V-010-1 | Fondo `#FFFFFF`, Hero Banner `/images/hero-banner.jpg` con overlay oscuro, marcos 3:4 con fondo `#F4F4F4`, paleta `#111111`, bordes `0px`, grillas de cuatro columnas y acento `#111111`. | `src/styles.css`, `public/images/hero-banner.jpg`, `src/module-config.js` |
| V-010-2 | Navegación y categorías en mayúsculas espaciadas y zoom sutil de la imagen al pasar el cursor. | `src/styles.css`, `src/components/product-card.js` |
| V-ROL-1 | El rol por defecto es `customer` con historial; `admin` tiene permisos financieros, de catálogo y de métricas, y usa `1234` en `#admin-code`. No existen `warehouse` ni `finance`. | `src/module-config.js`, `src/app.js`, `index.html` |
| V-007-1 | El panel renderiza gráficos de categoría, fecha y estado con alternativas accesibles, y el ranking muestra barras de progreso. | `src/components/metrics-charts.js`, `src/components/metrics-dashboard.js` |
| V-007-2 | Hacer clic en una barra de categoría o columna de fecha recalcula KPI, tablas y gráficos. | `src/app.js`, `tests/integration/metrics-dashboard.test.js` |

Resultado de la verificación automatizada T097: `npm run test:002` → 24 archivos / 150 pruebas aprobadas; `npm run build` → compilación correcta; `npm test -- --run` → 24 archivos aprobados, 11 fallidos, 152 pruebas aprobadas y 88 fallidas de suites heredadas del módulo base 001, fuera del alcance 002.

## 12. Cierre de FR-007 y FR-008

- `src/metrics.js` devuelve `revenueByCategory`, `salesByDate`, `statusDistribution` y `topProducts` con `revenueShare`/`progressPercent`; todos se recalculan con los filtros de fecha y categoría.
- `src/components/metrics-charts.js` genera gráficos accesibles con `role="img"`, `aria-label`, tooltips `title`, tablas ocultas para lectores de pantalla y clases semánticas por estado.
- `src/app.js` enlaza `data-chart-category` y `data-chart-date` con `state.metrics`, sincroniza los formularios y bloquea `showView('admin')` mientras no exista sesión privilegiada desbloqueada.
- `src/module-config.js` exporta `ROLES` con exactamente `customer`, `sales` y `admin`; el selector de la cabecera se construye desde esa configuración y el límite de crédito solo se revela a `admin`.
