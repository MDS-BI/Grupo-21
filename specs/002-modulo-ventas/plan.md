# Plan para el Módulo de Ventas (Basado en el Módulo Base ERP)

## 1. Objetivo

Desarrollar el módulo de Ventas partiendo del Módulo Base ERP (001-erp-base-module), adaptándolo para cubrir la gestión comercial de una empresa. El objetivo es permitir administrar la cartera de clientes, generar cotizaciones/pedidos de venta y dar seguimiento a su ciclo de vida, sin modificar el núcleo del sistema, únicamente mediante el archivo de configuración src/module-config.js.

## 2. Alcance

### Dentro del alcance

- Gestión de Clientes: Creación, edición, eliminación y búsqueda de clientes (tomando como base el concepto de Entidad).
- Gestión de Documentos de Venta: Creación, edición, eliminación y seguimiento de Cotizaciones, Pedidos de Venta y Facturas (tomando como base el concepto de Documento).
- Ciclo de vida de ventas: Control de estados con transiciones permitidas (ej. Cotización → Aprobado → Pedido → Facturado).
- Información comercial: Registro de condiciones de pago, límite de crédito, fecha de entrega, forma de pago, entre otros.
- Integración con el marco ERP: Aprovechar la barra superior, barra lateral, panel de inicio y acciones rápidas ya existentes.
- Personalización por configuración: Aplicar toda la terminología, campos y reglas desde src/module-config.js.

### Fuera del alcance

- Módulo de Inventario/Productos: No se implementará el catálogo de productos con existencias en esta primera versión.
- Módulo de Facturación Electrónica: Se deja para una futura iteración.
- Cuentas por Cobrar/Pagar: No forma parte de este módulo.
- Multi-sucursal o Multi-empresa: El sistema seguirá trabajando sobre un único espacio de trabajo.

## 3. Mapeo con el Módulo Base

| Concepto Base | Adaptación para Ventas | Descripción |
|---|---|---|
| Entidad | Cliente | Representa a personas naturales o jurídicas con los que se realiza negocio. |
| Documento | Pedido de Venta / Cotización | Representa una transacción comercial vinculada a un cliente. Puede iniciar como cotización y evolucionar a pedido/factura. |
| Panel | Panel de Ventas | Punto de entrada con acciones rápidas orientadas al área comercial. |
| Búsqueda | Búsqueda de Clientes/Pedidos | Permite localizar clientes o documentos de venta rápidamente.

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
    { target: "entity", key: "creditLimit", label: "Límite de crédito", type: "number", required: false },
    { target: "entity", key: "paymentTerms", label: "Condiciones de pago", type: "select", required: false, options: ["Contado", "Crédito 15 días", "Crédito 30 días", "Crédito 45 días", "Crédito 60 días"] },
    { target: "entity", key: "salesRep", label: "Vendedor asignado", type: "text", required: false },

    { target: "document", key: "deliveryDate", label: "Fecha de entrega", type: "date", required: false },
    { target: "document", key: "paymentMethod", label: "Forma de pago", type: "select", required: false, options: ["Efectivo", "Transferencia", "Tarjeta", "Crédito"] },
    { target: "document", key: "quoteValidity", label: "Vigencia de cotización", type: "date", required: false },
    { target: "document", key: "sellerNotes", label: "Observaciones del vendedor", type: "text", required: false },
  ],

  statusLifecycle: {
    statuses: ["Cotización", "En revisión", "Aprobado", "Pedido", "En proceso", "Facturado", "Cancelado", "Vencido"],
    transitions: {
      "Cotización": ["En revisión", "Aprobado", "Cancelado"],
      "En revisión": ["Aprobado", "Cotización", "Cancelado"],
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
