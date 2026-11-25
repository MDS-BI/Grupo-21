# Modelo de Datos: Módulo de Ventas

El módulo de Ventas reutiliza las entidades base `Entity` y `Document` del ERP, adaptándolas como `Cliente` y `Documento de Venta`. La Cotización y el Pedido de Venta son el mismo documento en distintos estados del ciclo de vida, no entidades separadas.

> **Reconciliación con `spec.md` (T050)**: las secciones siguientes describen el modelo B2B de referencia (Cliente/Documento, ciclo Cotización → Pedido → Facturado). La entrega implementada sigue `spec.md` y construye una tienda en línea cuyas entidades reales —Producto, Cupón y Pedido— se detallan en la sección **«Entidades implementadas (tienda en línea)»** al final de este documento. No se implementan Cotización, Facturado, `entity_id`, `series`/`folio` ni las transiciones de estado B2B. En la tienda, el FR-009 vigente corresponde al catálogo RootSouth y sus datos semilla (sección «Catálogo semilla RootSouth»), y el FR-010 a la presentación editorial y al encabezado (sección «Presentación editorial»). El FR-007 incorpora indicadores derivados para gráficos de categoría, fecha, estado y ranking (sección «Indicadores derivados»), y el FR-008 reduce los roles activos a `customer`, `sales` y `admin`, cambia la etiqueta visible de `admin` a `Gerente General` y retira el permiso de Historial a `customer` (sección «Permisos por rol»).

## Entidad: Cliente

Representa a una persona natural o jurídica con la que se realiza una operación comercial. Es la adaptación de `Entity` e incorpora identidad fiscal, datos de contacto, condiciones comerciales y vendedor asignado.

### Campos base heredados

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| id | string | Identificador interno único del cliente | Obligatorio, generado automáticamente |
| entity_id | string | Identificador público usado para vincular documentos de venta al cliente | Obligatorio, generado automáticamente, único |
| name | string | Nombre o razón social del cliente | Obligatorio, no vacío |
| code | string | Código o clave de negocio del cliente (p. ej., CLI-001) | Obligatorio, no vacío |
| taxId | string | Identificación fiscal canónica del cliente (RFC o NIT) | Opcional; se almacena recortada cuando se proporciona |
| email | string | Correo electrónico principal de contacto | Opcional; debe tener formato de correo válido si se proporciona |
| phone | string | Teléfono de contacto | Opcional |
| address | string | Dirección fiscal o comercial | Opcional |
| category | string | Segmento o clasificación comercial (p. ej., mayorista, minorista) | Opcional |
| description | string | Descripción corta o notas generales del cliente | Opcional |
| targetDate | string | Fecha objetivo para seguimiento o revisión de crédito en formato YYYY-MM-DD | Opcional, debe ser una fecha de calendario válida si se proporciona |
| creditLimit | number | Límite de crédito otorgado al cliente en la moneda configurada | Opcional, debe ser un número no negativo |
| paymentTerms | string | Condiciones de pago acordadas con el cliente | Opcional; en el perfil de Ventas debe pertenecer a las opciones configuradas |
| createdAt | string | Marca de tiempo de cuándo se creó el cliente | Obligatorio |
| updatedAt | string | Marca de tiempo de la última actualización del cliente | Obligatorio |

### Campos personalizados del perfil de Ventas

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| rfcNit | string | RFC/NIT mostrado en la interfaz comercial como alias controlado de `taxId` | Opcional; texto recortado; si `taxId` y `rfcNit` coexisten deben representar el mismo valor normalizado |
| contactName | string | Nombre de la persona de contacto comercial del cliente | Opcional; texto recortado |
| salesRep | string | Vendedor asignado a la cuenta del cliente | Opcional; texto recortado; se utiliza en la búsqueda comercial |

> Los atributos comerciales "límite de crédito" y "condiciones de pago" ya existen como campos base (`creditLimit` y `paymentTerms`). El perfil de Ventas los reutiliza y no debe almacenarlos como campos personalizados adicionales, para evitar colisiones y duplicidad de datos.

## Entidad: Documento de Venta

Representa una Cotización o un Pedido de Venta asociado a un cliente. Es la adaptación de `Document` y conserva la identificación por serie y folio, el desglose económico y el estado del ciclo de vida comercial.

### Campos base heredados

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| id | string | Identificador único del documento de venta | Obligatorio, generado automáticamente |
| entity_id | string | Identificador del cliente al que pertenece el documento | Obligatorio, debe referenciar el entity_id de un cliente existente |
| series | string | Serie del documento (p. ej., COT para cotizaciones, PED para pedidos) | Opcional; se recomienda usar las series definidas por la empresa |
| folio | number | Folio consecutivo que, junto con la serie, forma el número oficial del documento | Obligatorio, debe ser un entero positivo |
| startDate | string | Fecha de emisión del documento en formato YYYY-MM-DD | Obligatorio, debe ser una fecha de calendario válida |
| endDate | string | Fecha de fin del periodo del documento en formato YYYY-MM-DD | Obligatorio, debe ser una fecha de calendario válida, debe ser igual o posterior a startDate |
| quantity | number | Cantidad total de unidades asociadas al documento | Opcional, debe ser un entero positivo |
| subtotal | number | Importe antes de descuentos e impuestos | Opcional, debe ser un número no negativo |
| discount | number | Descuento aplicado sobre el subtotal | Opcional, debe ser un número no negativo y no puede superar el subtotal |
| taxAmount | number | Impuesto calculado para el documento | Opcional, debe ser un número no negativo |
| totalAmount | number | Importe total del documento en la moneda configurada | Opcional, debe ser un número no negativo |
| currency | string | Código de moneda para los importes del documento (p. ej., MXN, USD) | Opcional |
| paymentTerms | string | Condiciones de pago del documento (p. ej., contado, crédito 30 días) | Opcional; debe ser coherente con las condiciones del cliente |
| notes | string | Notas u observaciones generales del documento | Opcional |
| status | string | Estado del documento dentro del ciclo de vida de ventas | Obligatorio en el perfil de Ventas; debe pertenecer al ciclo configurado |
| createdAt | string | Marca de tiempo de cuándo se creó el documento | Obligatorio |
| updatedAt | string | Marca de tiempo de la última actualización del documento | Obligatorio |

### Campos personalizados del perfil de Ventas

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| deliveryDate | string | Fecha de entrega comprometida en formato YYYY-MM-DD | Opcional; debe ser una fecha de calendario válida e igual o posterior a startDate |
| paymentMethod | string | Forma de pago acordada: Efectivo, Transferencia, Tarjeta o Crédito | Opcional; cuando se proporciona debe pertenecer a las opciones configuradas |
| quoteValidity | string | Fecha de vigencia de la cotización en formato YYYY-MM-DD | Opcional; debe ser una fecha de calendario válida e igual o posterior a startDate |
| sellerNotes | string | Observaciones libres del vendedor | Opcional; texto recortado |

> `endDate` se conserva por compatibilidad con el módulo base y representa el fin del periodo del documento. No sustituye a `deliveryDate` ni a `quoteValidity`, que tienen semántica comercial específica.

## Ciclo de Vida y Transiciones

Los estados son cadenas de texto exactas, incluidos acentos y mayúsculas. El estado inicial de todo documento nuevo es `Cotización`.

| Estado | Descripción | Transiciones permitidas | Tipo de estado |
|---|---|---|---|
| Cotización | Documento comercial en elaboración o enviado al cliente | En revisión, Aprobado, Cancelado | Inicial |
| En revisión | La cotización está siendo evaluada por el cliente o por autorización interna | Aprobado, Cotización, Cancelado | Intermedio |
| Aprobado | La cotización fue aceptada y está lista para convertirse en pedido | Pedido, Cancelado | Intermedio |
| Pedido | Pedido de venta confirmado y pendiente de preparación o entrega | En proceso, Facturado, Cancelado | Intermedio |
| En proceso | Pedido en preparación, despacho o ejecución comercial | Facturado, Cancelado | Intermedio |
| Facturado | Documento cerrado comercialmente como facturado | Ninguna | Terminal |
| Cancelado | Documento anulado; no admite nuevas transiciones | Ninguna | Terminal |
| Vencido | Cotización cuya vigencia expiró sin aprobación | Ninguna | Terminal, automático |

> `Vencido` se declara en `statusLifecycle` del plan como transición de entrada desde `Cotización` y `En revisión`, pero se aplica automáticamente por el sistema: si `quoteValidity` existe y la fecha actual la supera mientras el documento permanece en uno de esos estados, el estado pasa a `Vencido`. No puede asignarse manualmente salvo que se habilite una transición manual explícita.

## Reglas de Configuración del Módulo

- El perfil se aplica únicamente mediante `src/module-config.js`, sin modificar el núcleo del ERP.
- `moduleName` es "Módulo de Ventas" y las etiquetas adaptan Entidad/Documento a Cliente/Clientes y Pedido de Venta/Pedidos de Venta.
- Las claves de campos personalizados no deben chocar con campos base (`id`, `entity_id`, `name`, `code`, `taxId`, `email`, `phone`, `address`, `category`, `description`, `targetDate`, `creditLimit`, `paymentTerms`, `series`, `folio`, `startDate`, `endDate`, `quantity`, `subtotal`, `discount`, `taxAmount`, `totalAmount`, `currency`, `notes`, `status`).
- `creditLimit` y `paymentTerms` son campos base. Si la configuración los declara como `customFields`, deben tratarse como alias de UI y no como almacenamiento duplicado.
- El ciclo de vida configurado reemplaza el estado de texto libre del módulo base y restringe los valores de `status` a los ocho estados definidos.
- El color de acento del perfil de Ventas es `#1F7A3E`; un valor inválido debe retroceder al color predeterminado.
- Los valores inválidos o conflictivos de configuración deben informarse con claridad, sin fallar silenciosamente.

## Reglas de Validación

### Cliente

- El nombre y el código del cliente son obligatorios y no pueden estar vacíos.
- `entity_id` se genera automáticamente y debe ser único entre todos los clientes.
- `taxId` y `rfcNit` son opcionales, se almacenan como cadenas recortadas y no pueden representar valores fiscales distintos para el mismo cliente.
- El correo electrónico es opcional pero, cuando está presente, debe tener formato de correo válido.
- `contactName`, `salesRep`, teléfono, dirección, categoría y descripción son opcionales y se almacenan recortados.
- `creditLimit` es opcional pero, cuando está presente, debe ser un número no negativo.
- `paymentTerms` es opcional; en el perfil de Ventas debe ser una de las opciones configuradas: Contado, Crédito 15 días, Crédito 30 días, Crédito 45 días o Crédito 60 días.
- `targetDate` es opcional pero, cuando está presente, debe ser una fecha válida en formato YYYY-MM-DD.
- La búsqueda de clientes debe normalizar mayúsculas, acentos y espacios para permitir coincidencias por nombre, código, RFC/NIT, contacto o vendedor.

### Documento de Venta

- Todo documento debe referenciar un cliente existente mediante `entity_id`; no se permiten documentos huérfanos.
- El folio debe ser un entero positivo; la serie es opcional y, junto con el folio, forma el número oficial del documento (p. ej., `COT-1001`).
- `startDate` y `endDate` son obligatorias y válidas; `endDate` debe ser igual o posterior a `startDate`.
- `deliveryDate` y `quoteValidity` son opcionales; cuando existen deben ser fechas válidas e iguales o posteriores a `startDate`.
- `quantity` es opcional y, cuando existe, debe ser un entero positivo.
- `subtotal`, `discount`, `taxAmount` y `totalAmount` son opcionales y deben ser números no negativos; `discount` no puede superar a `subtotal`.
- `paymentMethod` es opcional; cuando existe debe ser Efectivo, Transferencia, Tarjeta o Crédito.
- `sellerNotes` y `notes` son opcionales y se almacenan recortados.
- En la creación, `status` debe ser `Cotización`. En actualizaciones, solo se aceptan estados pertenecientes al ciclo de vida configurado.
- Las condiciones de pago del documento deben ser coherentes con las del cliente; una diferencia debe requerir confirmación explícita del usuario.
- El cálculo automático de totales (`totalAmount = subtotal - discount + taxAmount`) queda como punto de extensión; el módulo valida cada importe de forma independiente para evitar diferencias por redondeo.
- La conversión de Cotización a Pedido se representa como un cambio de estado sobre el mismo registro; no crea un documento nuevo por defecto. Conserva `id`, `entity_id`, `folio` y el historial de estados.

### Transiciones de Estado

- Solo se permiten las transiciones declaradas en la tabla del ciclo de vida.
- Una transición no permitida debe rechazarse con un mensaje claro que indique el estado actual y el estado solicitado.
- Los estados `Facturado`, `Cancelado` y `Vencido` son terminales y no admiten transiciones de salida.
- Un documento cancelado no puede reactivarse; si se requiere un nuevo intento comercial, debe crearse un documento nuevo.
- Toda transición debe actualizar `updatedAt` y conservar la trazabilidad del cambio de estado.
- `Vencido` se aplica automáticamente por expiración de `quoteValidity` y no puede asignarse manualmente salvo que se configure una transición explícita.
- El paso a `Facturado` cierra comercialmente el documento; la facturación electrónica y sus documentos fiscales quedan fuera del alcance de esta versión.

## Relaciones e Integridad Referencial

- Un cliente puede tener cero o muchos documentos de venta; cada documento pertenece exactamente a un cliente. La relación es 1 a N.
- La relación se materializa mediante `Documento de Venta.entity_id`, que referencia `Cliente.entity_id`.
- No se puede crear ni actualizar un documento con un `entity_id` inexistente.
- Al eliminar un cliente, todos sus documentos de venta deben eliminarse en la misma operación, de forma atómica.
- Si la eliminación en cascada falla, la operación completa debe revertirse y el cliente debe conservarse.
- La eliminación de un documento de venta no elimina al cliente.
- Cambiar el cliente de un documento solo se permite hacia otro cliente existente y debe respetar las reglas de estado y validación.
- Los `entity_id` eliminados no deben reutilizarse.
- La importación o restauración de datos debe validar la integridad referencial; los documentos con referencia inválida deben rechazarse o informarse como error, nunca quedar huérfanos.

## Notas de Extensibilidad

- Las partidas del documento (producto, cantidad, precio unitario e impuestos por línea) son el siguiente punto natural de extensión; el desglose actual es agregado a nivel de documento.
- La facturación electrónica puede incorporarse como una entidad fiscal separada o como una extensión del documento, manteniendo `Facturado` como estado comercial de cierre.
- El límite de crédito puede evolucionar de campo informativo a regla de bloqueo o autorización al confirmar pedidos.
- La administración de inventario (CRUD de productos desde la interfaz) queda fuera de esta versión; el catálogo semilla y el descuento de stock al comprar sí forman parte del alcance implementado (ver sección final).
- La conversión de Cotización a Pedido puede evolucionar a documentos separados con trazabilidad de origen si la empresa requiere folios independientes por tipo.
- La unicidad de folio por serie, la numeración automática y la auditoría detallada de transiciones son extensiones compatibles con este modelo.
- Cualquier módulo futuro que reutilice este perfil debe respetar los nombres y la semántica de los campos base para no romper el almacenamiento, la búsqueda ni la integridad referencial.

## Entidades implementadas (tienda en línea)

Estas son las entidades que realmente persiste la aplicación de `spec.md`. Se almacenan en `localStorage` con las claves indicadas.

| Entidad | Clave de almacenamiento | Módulo |
|---|---|---|
| Producto | `erp.products` | `src/storage.js`, `src/data/products.js` |
| Cliente | `erp.clients` | `src/storage.js` |
| Pedido | `erp.orders` | `src/storage.js`, `src/data/seed-orders.js` |
| Carrito | `erp.cart` | `src/storage.js` |
| Cupón | `erp.coupons` | `src/coupons.js` |
| Uso de cupones | `erp.couponUsage` | `src/coupons.js` |
| Oferta | `erp.offers` | `src/offers.js`, `src/data/offers.js` |
| Rol activo | `erp.role` | `src/module-config.js` |

### Producto

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| id | string | Identificador interno | Único, generado automáticamente |
| name | string | Nombre comercial | Obligatorio |
| description | string | Descripción corta | Opcional |
| image | string | Ruta de la imagen del producto | Opcional en datos antiguos; obligatoria en el catálogo semilla (`/images/producto-N.jpg`) |
| price | number | Precio unitario en CLP | No negativo |
| stock | number | Unidades disponibles | Entero no negativo; 0 ⇒ Agotado |
| category | string | Categoría del catálogo | Opcional |
| featured | boolean | Aparece en destacados | Por defecto `false` |
| createdAt / updatedAt | string | Marcas de tiempo ISO | Generadas por el sistema |

### Catálogo semilla RootSouth (FR-009)

Los ocho registros de `src/data/products.js` son productos reales de RootSouth. Sus archivos viven en `public/images/producto-1.jpg` … `public/images/producto-8.jpg` y Vite los sirve como `/images/producto-1.jpg` … `/images/producto-8.jpg`; `productMedia()` de `src/catalog.js` los renderiza con `<img class="product-card__media product-card__image">` cuando `image` está presente, y conserva las iniciales como marcador cuando falta.

| ID | Producto | image | Precio (CLP) | Categoría | Stock |
|---|---|---|---:|---|---:|
| `prod-steel-zip-knit` | Steel Zip Knit | `/images/producto-1.jpg` | 77990 | Knit | 12 |
| `prod-polera-coach-c` | Polera Coach C - Gris Claro | `/images/producto-2.jpg` | 25990 | Poleras | 20 |
| `prod-black-zipper-layers` | Black Zipper Layers | `/images/producto-3.jpg` | 67990 | Polerones | 14 |
| `prod-jockey` | Jockey | `/images/producto-4.jpg` | 16990 | Accesorios | 30 |
| `prod-bandanas` | Bandanas | `/images/producto-5.jpg` | 2997 | Accesorios | 0 |
| `prod-llavero-rootsouth` | Llavero Rootsouth Original | `/images/producto-6.jpg` | 5000 | Accesorios | 50 |
| `prod-tarjetero-rootsouth` | Tarjetero Rootsouth | `/images/producto-7.jpg` | 9790 | Accesorios | 25 |
| `prod-vaso-matero` | Vaso Matero | `/images/producto-8.jpg` | 9990 | Accesorios | 18 |

Las categorías del catálogo son `Knit`, `Poleras`, `Polerones` y `Accesorios`; exactamente cuatro productos están marcados como destacados (`prod-steel-zip-knit`, `prod-polera-coach-c`, `prod-black-zipper-layers`, `prod-jockey`) y la sección de destacados se limita a cuatro tarjetas. `prod-bandanas` tiene `stock = 0`, por lo que se muestra como «Agotado» y no se puede comprar.

### Cupón

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| code | string | Código del cupón | Único, se normaliza a mayúsculas |
| type | string | `percent` o `fixed` | Obligatorio |
| value | number | Porcentaje o monto fijo | No negativo |
| active | boolean | Habilita el cupón | Por defecto `true` |
| expiresAt | string | Fecha límite `YYYY-MM-DD` | Vencido si la fecha ya pasó |
| usageLimit | number | Usos máximos permitidos | `0` ⇒ agotado; `null` ⇒ sin límite |

El uso acumulado se guarda en `erp.couponUsage` como `{ [code]: usos }`. Los cupones semilla son `BIENVENIDO10`, `AHORRA5000`, `EXPIRADO` y `AGOTADO`.

### Oferta

Promoción creada por el administrador sobre un producto del catálogo. Mientras está activa y dentro de su vigencia, define el precio efectivo que se muestra en el catálogo y se aplica en el carrito y en el pedido.

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| id | string | Identificador interno | Único, generado automáticamente |
| productId | string | Referencia al producto ofertado | Obligatorio; debe existir en `erp.products` |
| type | string | `percent` o `fixed` | Obligatorio |
| value | number | Porcentaje (0–100) o monto fijo | Mayor que cero; `percent` ≤ 100; `fixed` ≤ precio del producto |
| startDate | string | Inicio de vigencia `YYYY-MM-DD` | Fecha válida y obligatoria |
| endDate | string | Fin de vigencia `YYYY-MM-DD` | Fecha válida, igual o posterior a `startDate` |
| active | boolean | Habilita o desactiva la oferta | Por defecto `true`; desactivarla restaura el precio original |
| createdAt / updatedAt | string | Marcas de tiempo ISO | Generadas por el sistema |

Reglas de precios:

- Una oferta está vigente cuando `active` es `true` y la fecha actual está dentro de `[startDate, endDate]`.
- Si varias ofertas están vigentes para el mismo producto, se aplica la que produce el menor precio final.
- `precioOferta = round(precio * (1 - value / 100))` para `percent`; `precioOferta = max(0, precio - value)` para `fixed`.
- El catálogo muestra el precio con descuento, el precio original tachado y la insignia «Oferta».
- El carrito y los totales usan el precio efectivo; si la oferta se desactiva o vence, se recalcula automáticamente con el precio original.
- Solo el rol `admin` (`canManageCatalog`) puede modificar precios y crear, editar, activar o desactivar ofertas. Los demás roles reciben un mensaje de permisos al entrar al panel.
- Los precios de producto se validan como numéricos y no negativos antes de guardarse.
- Las ofertas semilla son `offer-steel-zip-10` (10 % en `prod-steel-zip-knit`), `offer-coach-c-5000` (monto fijo de 5000 en `prod-polera-coach-c`) y `offer-vaso-vencida` (20 % en `prod-vaso-matero`, vencida el `2025-12-31` y usada como caso de prueba).

### Pedido

| Campo | Tipo | Descripción | Restricciones |
|---|---|---|---|
| id | string | Identificador interno | Único |
| orderNumber | string | Número de pedido `PED-YYYYMMDD-NNNN` | Único, generado al confirmar |
| clientId | string | Referencia al cliente comprador | Debe existir; el cliente se crea o reutiliza por correo |
| documentType | string | Tipo de documento | `Pedido` |
| status | string | Estado del documento | `Cotización`, `Pedido`, `Facturado` o `Cancelado` |
| items | array | Líneas `{ productId, name, price, quantity, lineTotal }` | Al menos una al confirmar |
| subtotal | number | Suma de líneas antes del descuento | No negativo |
| discount | number | Descuento del cupón aplicado | No negativo y ≤ subtotal |
| total | number | `subtotal - discount` | No negativo |
| couponCode | string \| null | Cupón usado | Debe haber sido válido al confirmar |
| paymentMethod | string | Tarjeta, Transferencia, Efectivo o Crédito | Obligatorio en el checkout |
| shipping | object | Nombre, correo, dirección, ciudad, código postal y teléfono | Obligatorios salvo teléfono |
| date | string | Fecha de emisión ISO | Generada al confirmar |

### Pedidos semilla RootSouth (FR-009)

`src/data/seed-orders.js` exporta `createSeedOrders(referenceDate)` y `seedOrders`, doce documentos iniciales que `src/storage.js` escribe en `erp.orders` para el cliente `client-demo` (`erp.clients`). Todos sus ítems referencian productos del catálogo RootSouth y ninguno corresponde a los antiguos artículos de tecnología. Las fechas se derivan del día de ejecución mediante desplazamientos de 82, 76, 70, 64, 58, 52, 46, 40, 34, 28, 16 y 6 días, de modo que la muestra siempre quede dentro de los últimos tres meses.

| ID | offset (días) | status | documentType | descuento | cupón |
|---|---:|---|---|---:|---|
| `seed-order-001` | 82 | `Pedido` | `Pedido` | 0 | — |
| `seed-order-002` | 76 | `Facturado` | `Facturado` | 10000 | `ROOT10` |
| `seed-order-003` | 70 | `Cotización` | `Cotización` | 0 | — |
| `seed-order-004` | 64 | `Pedido` | `Pedido` | 0 | — |
| `seed-order-005` | 58 | `Facturado` | `Facturado` | 0 | — |
| `seed-order-006` | 52 | `Pedido` | `Pedido` | 5000 | `OFERTA5` |
| `seed-order-007` | 46 | `Facturado` | `Facturado` | 0 | — |
| `seed-order-008` | 40 | `Cotización` | `Cotización` | 0 | — |
| `seed-order-009` | 34 | `Pedido` | `Pedido` | 10000 | `ROOT10` |
| `seed-order-010` | 28 | `Facturado` | `Facturado` | 0 | — |
| `seed-order-011` | 16 | `Cancelado` | `Pedido` | 0 | — |
| `seed-order-012` | 6 | `Pedido` | `Pedido` | 0 | — |

La línea base que `computeMetrics()` calcula sobre estos documentos es: ingresos `896122`, 9 ventas completadas (estados `Pedido` y `Facturado`), ticket promedio `99569`, 12 documentos en total y descuentos por `25000`. Los documentos en `Cotización` y `Cancelado` cuentan como documentos pero no aportan ingresos; la distribución de estados es `Cotización` 2, `Pedido` 5, `Facturado` 4 y `Cancelado` 1.

### Control de versión del esquema de semillas (FR-009)

`src/storage.js` exporta `SEED_VERSION = 'rootsouth-2026-11-charts'` y persiste la versión activa en la clave `erp.seedVersion`. `ensureSeedSchema()` compara la versión almacenada con la constante: si no coinciden o no existe, reescribe `erp.products`, `erp.offers`, `erp.orders`, `erp.cart` y `erp.couponUsage` con los datos semilla de la tienda RootSouth y actualiza `erp.seedVersion`. `erp.clients`, `erp.coupons` y `erp.role` no se recrean en este proceso.

Este versionado elimina los productos de tecnología de esquemas anteriores junto con sus pedidos, ofertas, carrito y uso acumulado de cupones, de modo que el historial y las métricas arranquen solo con prendas RootSouth. La limpieza ocurre de forma automática en la primera carga tras el cambio de versión.

### Relaciones y reglas implementadas

- Un cliente puede tener muchos pedidos; cada pedido pertenece a un solo cliente (`Pedido.clientId → Cliente.id`). No se permiten pedidos huérfanos: el checkout crea o reutiliza el cliente antes de guardar el pedido.
- Al eliminar un cliente se eliminan en cascada sus pedidos (`deleteOrdersForClient`).
- El stock se descuenta al confirmar el pago. Si alguna línea no tiene stock suficiente, la compra se rechaza y el carrito se conserva.
- El cupón se valida contra subtotal, vigencia y límite de uso; al confirmar el pedido se incrementa su uso.
- El carrito es single-user (un solo espacio de trabajo) y se vacía tras una compra exitosa.
- Cada oferta referencia un producto existente (`Oferta.productId → Producto.id`); al crear o editar una oferta se valida el producto, el tipo, el valor y la vigencia. Las ofertas no eliminan productos.
- El pedido guarda el precio efectivo de cada línea, por lo que un cambio posterior de precio u oferta no altera pedidos ya confirmados.
- `creditLimit` es informativo: se muestra en el historial y se enmascara (`•••••`) para roles sin permiso financiero (`customer`, `sales`); solo lo ve `admin` mediante `canViewFinancials`.

### Equivalencias con el modelo B2B de referencia

| Modelo B2B | Implementación tienda en línea |
|---|---|
| `Cliente.entity_id` | `Cliente.id` |
| `Documento.entity_id` | `Pedido.clientId` |
| `Documento.series` + `folio` | `Pedido.orderNumber` (`PED-…`) |
| `Documento.totalAmount` | `Pedido.total` |
| Partidas del documento (extensión) | `Pedido.items[]` |
| Estado `Pedido` del ciclo B2B | `Pedido.status = "Pedido"` |
| Cotización, Facturado, Cancelado | Valores de `Pedido.status` en semillas e historial; `Cancelado` no aporta ingresos |
| Aprobado, En revisión, En proceso, Vencido | No implementados |

### Presentación editorial (FR-010)

Los tokens visuales se aplican en `src/styles.css` siguiendo la referencia de Scuffers: fondo blanco `#FFFFFF`, Hero Banner servido desde `public/images/hero-banner.jpg`, marcos de producto verticales con `aspect-ratio: 3 / 4` y fondo `#F4F4F4`, paleta monocromática en `#111111` y grises neutros, `border-radius: 0`, destacados y catálogo en grilla plana de cuatro columnas, tipografía sans-serif, etiquetas de navegación y categorías en mayúsculas con espaciado de letras y un zoom sutil de la imagen (`scale`) al pasar el cursor. `src/module-config.js` fija `theme.accentColor = '#111111'`; el verde `#1F7A3E` del perfil B2B queda solo como referencia histórica del plan.

El encabezado se estructura en una cinta superior `.announcement-bar` de fondo `#111111` con avisos blancos de 11px en mayúsculas y `letter-spacing`, y una fila de 3 zonas: `TIENDA` y `GESTIÓN` a la izquierda con paneles anclados con `left: 0`, la marca tipográfica `ROOTSOUTH®` centrada sin cuadro `RS`, y Perfil/`CARRITO` a la derecha. El menú `TIENDA` muestra `Ver todo`, `Destacados`, `Knit`, `Poleras`, `Polerones` y `Accesorios`, con miniatura editorial servida desde `/images/producto-1.jpg`; cada opción aplica `state.filters`, cierra el panel y desplaza a `#productos-destacados` o `#productos`. El menú `GESTIÓN` se deriva de permisos y permanece sin cambios.

El badge superior del Hero debe mostrar exactamente `ROOTSOUTH · COLECCIÓN 2026` como único pill con fondo blanco y texto `#111111` (o fondo negro con texto blanco). El título `CATÁLOGO DE PRODUCTOS` y el subtítulo son `#FFFFFF` directamente sobre la fotografía, sin caja, fondo ni tarjeta blanca; la legibilidad proviene del degradado lateral `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)`.

Estos tokens son de presentación y no alteran el modelo persistido: `Producto.image` conserva la ruta original y el precio, el stock y la categoría no se derivan de la imagen; la miniatura editorial reutiliza una imagen semilla existente y no crea una entidad nueva.

## Indicadores derivados (US8)

El panel de métricas no introduce una entidad persistida: calcula sus indicadores leyendo `erp.orders`, `erp.products`, `erp.offers`, `erp.coupons` y `erp.couponUsage` en `src/metrics.js`.

| Indicador | Regla de cálculo |
|---|---|
| Ingresos totales | Suma de `Pedido.total` de pedidos en estado `Pedido` o `Facturado` que pasen los filtros. |
| Ventas completadas y ticket promedio | Conteo de esos pedidos y `round(ingresos / ventas)`; sin ventas, el promedio es cero. |
| Documentos por estado | Conteo de todos los pedidos filtrados agrupados por `Pedido.status`. Los cancelados no aportan ingresos. |
| Productos más vendidos | Agrupación de `Pedido.items[]` por `productId`, ordenada por ingresos y luego por unidades. |
| Alertas de stock | Productos con `stock <= 5`, incluidos los agotados (`stock = 0`). |
| Descuentos y cupones | Suma de `Pedido.discount`, usos acumulados por código y usos de oferta registrados en las líneas. |
| Ingresos por categoría | Agrupación de ingresos y unidades de `Pedido.items[]` por `Producto.category`; alimenta un gráfico de barras y filtra al hacer clic. |
| Evolución de ventas por fecha | Agrupación de ingresos y cantidad de ventas completadas por `Pedido.date`; para la presentación se agrupa por mes (`YYYY-MM`) con etiqueta compacta (`$69k`), monto exacto en `title`/`aria-label` y tabla `sr-only`; el clic filtra por `data-chart-from`/`data-chart-to` del mes, con compatibilidad con `data-chart-date`. |
| Distribución por estado | Conteo y porcentaje de `Pedido.status` sobre todos los documentos filtrados, con tono semántico `Cotización=warning`, `Pedido=info`, `Facturado=success`, `Cancelado=danger`. |
| Progreso del ranking | Para cada producto: `revenueShare = round(revenue / totalRankedRevenue * 100)` y `progressPercent = round(revenue / maxRevenue * 100)`. |

Los filtros por rango de fechas (`Pedido.date`) y categoría (vía `Pedido.items[].productId → Producto.category`) son inclusivos y recalculan todos los indicadores. Sin coincidencias se devuelven ceros y un estado vacío sin errores de cálculo.

## Permisos por rol (US9)

| Rol (id / etiqueta visible) | Permisos |
|---|---|
| `customer` / Cliente | Rol por defecto: catálogo, carrito y pago. No ve Historial, Administración ni Métricas; tampoco ve cantidades de stock ni el menú `GESTIÓN`. |
| `sales` / Vendedor | Catálogo con disponibilidad de stock, carrito, pago e historial de clientes. Ve solo `Historial` dentro de `GESTIÓN`; no administra catálogo, ve métricas globales ni el límite de crédito. |
| `admin` / Gerente General | `canViewFinancials`, `canManageCatalog` y `canViewMetrics`; ve `Historial`, `Métricas` y `Administración`, historial íntegro con límite de crédito visible, stock y administración de precios/ofertas. El panel exige el código `1234` en `#admin-code`. |

No existen los roles `warehouse` ni `finance`: `ROLES` en `src/module-config.js` contiene exactamente `customer`, `sales` y `admin`. El id interno `admin` y la clave persistida `erp.role` se conservan; solo cambia la etiqueta visible a `Gerente General`.

`canAccessView()` en `src/module-config.js` es el único mapeo vista → permiso. `src/app.js` deriva la visibilidad de `GESTIÓN` y de sus hijos desde esa función, y conserva una guarda en `showView()`; el contenido restringido se sustituye por un aviso con una acción para volver al catálogo. El botón «Ver historial» de la confirmación también depende de `canViewHistory(getRole())`. El cierre de sesión interna guarda el rol `customer` y devuelve a la vista pública.

### Estado efímero de la interfaz

Los siguientes estados no se persisten y no forman parte del esquema de datos:

| Estado | Valor inicial | Regla |
|---|---|---|
| `state.role` | `getRole()` desde `erp.role`, con fallback `customer` | Cambia con el selector o el cierre de sesión; solo acepta `customer`, `sales` y `admin`. |
| `state.view` | `catalog` | Toda navegación pasa por `showView()` y `canAccessView()`. |
| `state.adminUnlocked` | `false` | Se activa solo con código `1234` para un rol con `canManageCatalog`; se reinicia al cambiar rol, cerrar sesión o recargar. |
| Estados de disclosures | Cerrados (`hidden` y `aria-expanded="false"`) | Menús `TIENDA`/`GESTIÓN` y panel de perfil; se cierran al navegar, cambiar rol, Escape o clic fuera, incluida la selección de una opción de `TIENDA`. |
| `state.filters` desde `TIENDA` | `{ category: 'all', maxPrice: '', featuredOnly: false }` | `Destacados` activa `featuredOnly`; `Ver todo` reinicia categoría; una categoría aplica `category`. Ningún valor se persiste. |
| Rango mensual del gráfico | Derivado de `data-chart-from`/`data-chart-to` | Al hacer clic en una barra de «Evolución de ventas» actualiza `state.metrics.from`/`to`; es efímero y no altera pedidos semilla. |
| Contador del carrito | Derivado de `getCartCount()` | Se refleja en `#cart-count` y en el `aria-label` del botón Carrito. |

No se requiere migración: `erp.role = "admin"` sigue siendo válido y `SEED_VERSION` no cambia porque no se modifican productos, ofertas ni pedidos semilla.

