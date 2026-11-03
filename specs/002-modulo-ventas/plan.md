# Plan para el Módulo de Ventas (Basado en el Módulo Base ERP)

> **Reconciliación con `spec.md` (T050)**: la implementación final de esta entrega es una **tienda en línea** (catálogo con stock, filtros, carrito, cupones, checkout e historial de pedidos), tal como se define en `spec.md`. Las secciones 1–4 conservan el diseño B2B original (Clientes y Documentos de Venta) como referencia de negocio y de stack; la sección 2.1 y la sección 10 describen el alcance realmente construido y su trazabilidad con las historias de usuario.

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
- Personalización por configuración y roles: nombre del módulo, etiquetas, color de acento y control de acceso a datos financieros desde `src/module-config.js`.

### Fuera del alcance

- Administración de inventario y CRUD completo de productos desde la interfaz (solo se consume el catálogo semilla y se descuenta stock al comprar).
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

> **Nota de implementación**: `src/module-config.js` expone `DEFAULT_CONFIG` con las etiquetas del escaparate (Catálogo, Productos destacados, Carrito, Pago, Historial, Agotado, etc.), los roles `sales`/`warehouse`/`finance`/`admin` y el color de acento `#1F7A3E`. El bloque anterior queda como referencia del perfil B2B original.

## 5. Funcionalidades Detalladas

| Funcionalidad | Descripción | Origen en el Base |
|---|---|---|
| Catálogo de Clientes | Listado, alta, modificación y baja de clientes con sus datos fiscales, de contacto y comerciales. | HU1, HU2, HU4 |
| Cotizaciones | Generar una cotización para un cliente con fecha, condiciones y observaciones. Al aprobarla, puede convertirse en Pedido de Venta. | HU10 + Ciclo de Vida (HU12) |
| Pedidos de Venta | Seguimiento desde "Pedido" hasta "Facturado", con control de estados y restricciones de transición. | HU10 + HU12 |
| Búsqueda Comercial | Buscar clientes por nombre, código, RFC/NIT, vendedor o por datos del pedido. También filtrar por estado del documento. | HU8, HU11 |
| Panel de Ventas | Acciones rápidas: "Nuevo Cliente", "Nueva Cotización", "Gestionar Clientes", "Buscar Clientes/Pedidos". Tarjetas con totales de Clientes, Cotizaciones, Pedidos y Facturados. | HU3 (revisada), HU13 |
| Integridad Comercial | Al eliminar un cliente, sus cotizaciones/pedidos deben eliminarse automáticamente. | HU10 (FR-009) |
| Campos Comerciales | Mostrar límite de crédito, condiciones de pago, fecha de entrega y forma de pago en formularios, listas y detalles. | HU7 |

## 6. Plan de Implementación por Fases

| Fase | Actividad | Estado | Observaciones |
|---|---|---|---|
| Fase A: Configuración | Crear/ajustar src/module-config.js con el perfil de Ventas. Validar con tests/unit/module-config.test.js. | Pendiente | Punto de partida. |
| Fase B: Etiquetado | Comprobar que todo el UI muestra "Cliente", "Clientes", "Pedido de Venta", "Cotización" según la configuración. | Pendiente | Barra lateral, panel, formularios, listas y mensajes. |
| Fase C: Datos Comerciales | Probar campos personalizados (rfcNit, creditLimit, paymentTerms, deliveryDate, etc). Verificar persistencia, visualización y búsqueda. | Pendiente | Aprovechar customFields. |
| Fase D: Ciclo de Vida | Validar transiciones de estado desde el formulario de documentos. Probar casos inválidos y asegurar que solo se muestran estados permitidos. | Pendiente | Crítico para el flujo Cotización → Pedido → Facturado. |
| Fase E: Flujos de Ventas | Probar creación de cliente, creación de cotización, cambio de estado, asociación cliente-documento, eliminación en cascada. | Pendiente | Cubrir con pruebas de integración existentes. |
| Fase E2: Panel y Navegación | Verificar panel de Ventas, acciones rápidas, estadísticas en tiempo real y navegación por barra lateral. | Pendiente | Debe funcionar igual al rediseño ERP. |
| Fase F: Pruebas y Validación | Ejecutar npm test, revisión manual de flujos y validación de responsive. | Pendiente | Asegurar que no hay regresiones con el módulo base. |

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
| US1 Catálogo de productos destacados | P1 | Implementado | `src/components/product-card.js`, `src/components/product-catalog.js`, `tests/integration/product-catalog.test.js` |
| US2 Filtrado por categoría y precio | P2 | Implementado | `src/catalog.js`, `src/components/product-filters.js`, `tests/integration/product-filters.test.js` |
| US3 Gestión de carrito | P3 | Implementado | `src/storage.js`, `src/components/cart.js`, `tests/integration/cart.test.js` |
| US4 Cupones de descuento | P4 | Implementado | `src/coupons.js`, `src/components/coupon-form.js`, `tests/integration/coupons.test.js` |
| US5 Checkout y confirmación | P5 | Implementado | `src/checkout.js`, `src/payments.js`, `src/components/checkout-form.js`, `src/components/order-confirmation.js`, `tests/integration/checkout.test.js` |
| US6 Historial de documentos de venta | P6 | Implementado | `src/components/order-history.js`, `src/module-config.js`, `tests/integration/order-history.test.js` |

- Verificación ejecutada: 35 pruebas unitarias + 30 de integración del alcance 002, y `npm run build` exitoso.
- Los antiguos criterios CV-001 a CV-010 y las fases A–F de la sección 6 corresponden al perfil B2B de referencia; no son criterios de aceptación de esta entrega.
- Las pruebas heredadas del módulo base 001 permanecen en `tests/` pero dependen de una implementación que no forma parte de este alcance.
