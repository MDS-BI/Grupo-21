# Módulo Base ERP

## Quiénes somos

- Cruz Ramírez Amaro Eduard
- Sepúlveda Silva Nicole Estefanía
- Novoa Bascuñán Vicente Nicolás Andrés
- Quirilao Jara Katalina Rayen
- Gutiérrez Muñoz Matías Gabriel
- Marcelo Andres Rodriguez Valdebenito

## Resumen del trabajo

Nuestro módulo de ventas está pensado para acompañar el trabajo comercial del negocio: reunir la información de sus clientes y dar seguimiento a las operaciones de venta mediante sus documentos, desde el registro inicial hasta la actualización de su estado. Así, el equipo puede mantener una visión ordenada de la relación entre cada cliente y sus movimientos comerciales.

Este proyecto propone una aplicación web ligera que funciona como base para construir módulos de planificación de recursos empresariales (ERP). Su objetivo es organizar la información del negocio en un espacio de trabajo común y adaptable, sin depender de un backend: utiliza JavaScript, HTML y CSS, con Vite y almacenamiento local en el navegador.

El módulo permite gestionar entidades —como clientes, proveedores o artículos— y documentos transaccionales vinculados a ellas. Incluye operaciones para crear, consultar, editar, eliminar y buscar registros, además de validaciones, persistencia local y un panel de inicio con acciones rápidas y estadísticas. Según el plan, la interfaz se organiza con una barra superior, navegación lateral y componentes reutilizables; la configuración central permite personalizar nombres, campos, estados y color del módulo sin modificar su lógica base.

## Módulo de Ventas — Tienda en línea (002)

La entrega de `specs/002-modulo-ventas` es una tienda en línea construida con Vite, JavaScript puro y `localStorage`, sin backend.

### Funcionalidades

- **Catálogo**: productos semilla con precio, categoría, stock y sección de destacados. Los productos sin stock muestran la insignia «Agotado» y su botón de compra queda deshabilitado.
- **Filtros**: categoría y precio máximo combinables, con mensaje de resultados vacíos y botón para limpiar filtros.
- **Carrito**: añadir, cambiar cantidades, quitar líneas y vaciar; subtotal, descuento y total se recalculan al instante y el carrito persiste al recargar.
- **Cupones**: `BIENVENIDO10` (10 %), `AHORRA5000` (fijo), `EXPIRADO` y `AGOTADO` como casos de prueba. Se valida existencia, vigencia, estado y límite de uso.
- **Checkout**: validación de nombre, correo, dirección, ciudad, código postal y método de pago. Pasarela simulada con éxito, rechazo y timeout. Al confirmar se descuenta stock, se guarda el pedido y se genera un número `PED-YYYYMMDD-NNNN`.
- **Historial**: documentos de venta por cliente con tipo, fecha, número, monto y estado. El rol **Cliente** también puede consultar su historial. El límite de crédito se enmascara (`•••••`) para roles sin permisos financieros; lo ven **Finanzas** y **Administración**.
- **Administración de precios y ofertas**: el rol **Administración** puede editar precios (validados como numéricos y no negativos) y crear, editar, activar, desactivar o eliminar ofertas por porcentaje o monto fijo con vigencia. El catálogo muestra el precio con descuento, el precio original tachado y la insignia «Oferta», y el carrito aplica el precio efectivo. Los demás roles ven un mensaje de permisos al entrar al panel.
- **Métricas**: panel para el dueño/administrador con ingresos totales, ventas completadas, ticket promedio, documentos por estado, ranking de productos por unidades e ingresos, alertas de stock y uso de cupones/ofertas. Filtros por rango de fechas y categoría; sin datos muestra ceros y un estado vacío.
- **Roles**: Cliente, Ventas, Bodega, Finanzas y Administración, seleccionables desde la cabecera; se guardan en `localStorage` (`erp.role`). El rol por defecto es **Cliente**, que compra y consulta su historial. Ventas y Bodega ven stock e historial; Finanzas ve el límite de crédito; **Administración** tiene permisos financieros, administra precios/ofertas y consulta métricas. El panel de administración exige el código `1234` en `#admin-code`. El botón «Cerrar sesión» devuelve a la vista pública de Cliente.

### Tienda RootSouth / Scuffers (FR-009 y FR-010)

**FR-009 — catálogo y datos semilla.** La tienda comercializa ocho productos reales de RootSouth. Cada producto incluye el campo `image` con una ruta `/images/producto-N.jpg`, servida desde `public/images/producto-N.jpg`, y la tarjeta lo renderiza con `<img>`.

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

Las categorías del catálogo son `Knit`, `Poleras`, `Polerones` y `Accesorios`. Las ofertas semilla son `offer-steel-zip-10` (10 % en `prod-steel-zip-knit`), `offer-coach-c-5000` ($5.000 fijos en `prod-polera-coach-c`) y `offer-vaso-vencida` (caso vencido en `prod-vaso-matero`).

`src/data/seed-orders.js` aporta cuatro documentos iniciales (`seed-order-001` a `seed-order-004`) para `client-demo`, todos con prendas RootSouth. Con esos datos el panel de métricas parte de ingresos `416877`, 3 ventas completadas, ticket promedio `138959`, 4 documentos y descuentos por `30000`; el documento en `Cotización` no aporta ingresos.

`src/storage.js` exporta `SEED_VERSION = 'rootsouth-2026-11'` y usa la clave `erp.seedVersion`. Si la versión guardada no coincide, `ensureSeedSchema()` limpia y recrea productos, pedidos, carrito, ofertas y uso de cupones, con lo que desaparecen los antiguos productos de tecnología y sus datos asociados.

**FR-010 — estética editorial.** La interfaz sigue la referencia de Scuffers: fondo blanco `#FFFFFF`, marcos de producto verticales 3:4 con fondo `#F4F4F4`, paleta monocromática en `#111111` y grises neutros, bordes de `0px`, tipografía sans-serif con etiquetas de navegación y categorías en mayúsculas espaciadas y zoom sutil de la imagen al pasar el cursor.

### Ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # compilación de producción en dist/
npm run preview  # vista previa de la compilación
```

### Pruebas

```bash
npm run test:002   # 22 archivos / 128 pruebas; npm run build OK; npm test: 140 passed / 88 failed heredadas 001
```

> `tests/` también contiene pruebas heredadas del módulo base 001 que dependen de una implementación aún no incluida en este repositorio; por eso se usa `test:002` para validar esta entrega. La suite 002 cubre catálogo, filtros, carrito, cupones, checkout, historial, administración de precios/ofertas, métricas, vistas por rol y flujos de extremo a extremo (embudo de compra y ciclo de oferta).

### Estructura

```text
index.html                 Vistas de catálogo, carrito, checkout, confirmación, historial, administración y métricas
src/main.js                Punto de entrada
src/app.js                 Arranque, enrutado de vistas y manejo de eventos
src/storage.js             Persistencia de productos, clientes, pedidos y carrito
src/catalog.js             Disponibilidad y filtros de catálogo
src/coupons.js             Cupones, vigencia, límite de uso y descuentos
src/checkout.js            Validación del checkout y numeración de pedidos
src/payments.js            Pasarela de pago simulada
src/module-config.js       Configuración, etiquetas, tema, roles y permisos por vista
src/metrics.js             Cálculo puro de indicadores y filtros del panel
src/offers.js              Modelo, validación, vigencia y resolución de ofertas
src/data/products.js       Catálogo semilla RootSouth con rutas de imagen
src/data/offers.js         Ofertas semilla
src/data/seed-orders.js    Pedidos semilla de RootSouth para client-demo
src/components/            Componentes de catálogo, carrito, cupones, checkout, historial, administración y métricas
src/styles.css             Estilos responsive y tokens editoriales (FR-010)
public/images/             Imágenes reales producto-1.jpg a producto-8.jpg
tests/unit/                Pruebas unitarias 002
tests/integration/         Pruebas de integración 002
tests/setup/jsdom.js       Aislamiento de localStorage entre pruebas
```

### Datos y persistencia

Claves usadas en `localStorage`: `erp.products`, `erp.clients`, `erp.orders`, `erp.cart`, `erp.coupons`, `erp.couponUsage`, `erp.offers`, `erp.role` y `erp.seedVersion`. `SEED_VERSION = 'rootsouth-2026-11'` controla la limpieza de los datos heredados de tecnología al detectar un esquema distinto. No se envían datos a ningún servidor.

### Ofertas y precios

- Una oferta activa y vigente define el precio efectivo del producto. Si hay varias, se aplica la de menor precio final.
- `percent` descuenta un porcentaje (0–100 %); `fixed` descuenta un monto que no puede superar el precio del producto.
- Al desactivar o vencer una oferta, el catálogo y el carrito vuelven automáticamente al precio original.
- Ofertas semilla: `offer-steel-zip-10` (10 % en `prod-steel-zip-knit`), `offer-coach-c-5000` ($5.000 fijos en `prod-polera-coach-c`) y `offer-vaso-vencida` (caso vencido en `prod-vaso-matero`).
