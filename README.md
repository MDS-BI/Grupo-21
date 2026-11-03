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
- **Historial**: documentos de venta por cliente con tipo, fecha, número, monto y estado. El límite de crédito se enmascara (`•••••`) para roles sin permisos financieros; solo el rol **Finanzas** lo ve.
- **Roles**: Ventas, Bodega, Finanzas y Administración, seleccionables desde la cabecera; se guardan en `localStorage` (`erp.role`).

### Ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # compilación de producción en dist/
npm run preview  # vista previa de la compilación
```

### Pruebas

```bash
npm run test:002   # 35 unitarias + 30 de integración del alcance 002
```

> `tests/` también contiene pruebas heredadas del módulo base 001 que dependen de una implementación aún no incluida en este repositorio; por eso se usa `test:002` para validar esta entrega. La suite 002 cubre catálogo, filtros, carrito, cupones, checkout, historial y un embudo de compra de extremo a extremo.

### Estructura

```text
index.html                 Vistas de catálogo, carrito, checkout, confirmación e historial
src/main.js                Punto de entrada
src/app.js                 Arranque, enrutado de vistas y manejo de eventos
src/storage.js             Persistencia de productos, clientes, pedidos y carrito
src/catalog.js             Disponibilidad y filtros de catálogo
src/coupons.js             Cupones, vigencia, límite de uso y descuentos
src/checkout.js            Validación del checkout y numeración de pedidos
src/payments.js            Pasarela de pago simulada
src/module-config.js       Configuración, etiquetas, tema y roles
src/data/products.js       Catálogo semilla
src/components/            Componentes de catálogo, carrito, cupones, checkout e historial
src/styles.css             Estilos responsive
tests/unit/                Pruebas unitarias 002
tests/integration/         Pruebas de integración 002
tests/setup/jsdom.js       Aislamiento de localStorage entre pruebas
```

### Datos y persistencia

Claves usadas en `localStorage`: `erp.products`, `erp.clients`, `erp.orders`, `erp.cart`, `erp.coupons`, `erp.couponUsage` y `erp.role`. No se envían datos a ningún servidor.
