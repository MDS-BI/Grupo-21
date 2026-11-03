# Tareas: Módulo de Ventas (Tienda Online)

**Entrada**: Documentos de diseño desde `/specs/002-modulo-ventas/`
**Prerrequisitos**: spec.md (fuente de verdad de las historias de usuario), plan.md (stack técnico), data-model.md (referencia de datos base)
**Pruebas**: Incluidas porque la constitución exige verificación test-first.

> **Nota de alcance**: Por decisión del usuario, este listado sigue las historias de `spec.md` (catálogo de productos, filtros, carrito, cupones, checkout e historial de documentos de venta). `plan.md` y `data-model.md` describen un módulo de ventas B2B basado en el ERP; se conservan como referencia del stack, la configuración y los conceptos de Cliente/Documento. La tarea T050 reconcilia ambos documentos con el alcance final.

## Formato: `[ID] [P?] [Historia?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Historia]**: Etiqueta de la historia de usuario (US1–US6). Solo se usa en las fases de historia.
- Todas las tareas incluyen rutas de archivo exactas.

## Convenciones de Rutas

- Aplicación web de un solo proyecto: `index.html`, `src/`, `tests/` en la raíz del repositorio.
- Componentes: `src/components/`.
- Datos semilla: `src/data/`.
- Pruebas: `tests/unit/`, `tests/integration/`, `tests/setup/`.
- Configuración: `package.json`, `vite.config.js`, `vitest.config.mjs`.

---

## Fase 1: Configuración (Infraestructura Compartida)

**Propósito**: Inicializar la estructura Vite, dependencias y arnés de pruebas.

- [X] T001 Crear la estructura del proyecto Vite con `index.html`, `package.json`, `vite.config.js`, `vitest.config.mjs`, `src/`, `src/components/`, `src/data/` y `tests/`
- [X] T002 [P] Configurar scripts y dependencias de Vite, Vitest y jsdom en `package.json`, `vite.config.js` y `vitest.config.mjs`
- [X] T003 [P] Crear el arnés de pruebas con jsdom y aislamiento de `localStorage` por prueba en `tests/setup/jsdom.js`
- [X] T004 [P] Construir el HTML base con cabecera, contenedor de catálogo, panel de carrito, formulario de checkout, vista de confirmación e historial en `index.html`

---

## Fase 2: Fundacional (Prerrequisitos Bloqueantes)

**Propósito**: Persistencia de productos, clientes, pedidos y carrito; cupones; configuración; arranque de la aplicación y estilos base.

**⚠️ CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T005 Implementar las primitivas de almacenamiento y el CRUD de productos (stock, precio, categoría, destacado) en `src/storage.js`
- [X] T006 Implementar el almacenamiento de clientes y pedidos, la integridad referencial y la eliminación en cascada en `src/storage.js`
- [X] T007 Implementar el estado y la persistencia del carrito (añadir, actualizar cantidad, quitar, vaciar) en `src/storage.js`
- [X] T008 [P] Implementar el modelo, almacenamiento y validación de cupones (vigencia, tipo, valor, límite de uso) en `src/coupons.js`
- [X] T009 [P] Implementar la configuración del módulo, etiquetas, valores predeterminados y ayudantes de rol en `src/module-config.js`
- [X] T010 Implementar el arranque de la aplicación, el enrutado de vistas y los ayudantes de renderizado en `src/app.js`
- [X] T011 [P] Crear las variables de tokens de diseño y los estilos base del escaparate, carrito y formularios en `src/styles.css`
- [X] T012 [P] Crear el catálogo semilla de productos con categorías, precios, stock y marca de destacado en `src/data/products.js`

**Punto de control**: La base está lista; las historias de usuario pueden comenzar.

---

## Fase 3: Historia de Usuario 1 - Catálogo de productos destacados (Prioridad: P1) 🎯 MVP

**Objetivo**: Mostrar en la página principal una sección de productos destacados con nombre, precio y botón de compra; los productos sin stock muestran la etiqueta de agotado y deshabilitan la compra.

**Prueba Independiente**: Un usuario abre la página principal y ve la sección de destacados con artículos, precios y botones de compra; al poner un producto sin stock, aparece la etiqueta "Agotado" y su botón queda deshabilitado.

### Pruebas para la Historia de Usuario 1

- [X] T013 [P] [US1] Añadir pruebas unitarias para la selección de destacados y el cálculo de disponibilidad por stock en `tests/unit/products.test.js`
- [X] T014 [P] [US1] Añadir la prueba de integración del renderizado del catálogo, precios, botón de compra y estado agotado en `tests/integration/product-catalog.test.js`

### Implementación de la Historia de Usuario 1

- [X] T015 [P] [US1] Crear el componente de tarjeta de producto con nombre, precio, botón de compra, insignia de agotado y botón deshabilitado en `src/components/product-card.js`
- [X] T016 [P] [US1] Crear el componente de catálogo destacado que agrupa las tarjetas de productos disponibles en `src/components/product-catalog.js`
- [X] T017 [US1] Conectar el catálogo destacado con la vista de inicio y el estado de stock en `src/app.js`
- [X] T018 [P] [US1] Dar estilo a la sección de destacados, tarjetas de producto e insignias de agotado en `src/styles.css`

**Punto de control**: La Historia de Usuario 1 es completamente funcional y comprobable de forma independiente.

---

## Fase 4: Historia de Usuario 2 - Filtrado de productos por categoría y precio (Prioridad: P2)

**Objetivo**: Permitir filtrar el catálogo por categoría y rango de precio máximo, mostrando un mensaje claro cuando no hay resultados.

**Prueba Independiente**: Un usuario selecciona una categoría y un precio máximo y el listado se actualiza mostrando solo los artículos que cumplen ambos criterios; sin coincidencias se muestra un mensaje de resultados vacíos.

### Pruebas para la Historia de Usuario 2

- [X] T019 [P] [US2] Añadir pruebas unitarias para el filtrado combinado por categoría y precio máximo y el caso sin resultados en `tests/unit/product-filters.test.js`
- [X] T020 [P] [US2] Añadir la prueba de integración de la interfaz de filtros actualizando el catálogo y el estado vacío en `tests/integration/product-filters.test.js`

### Implementación de la Historia de Usuario 2

- [X] T021 [US2] Crear los controles de filtro (categoría y precio máximo) y el mensaje de resultados vacíos con acción de reinicio en `src/components/product-filters.js`
- [X] T022 [US2] Implementar el estado de filtros y el renderizado del catálogo filtrado en `src/app.js`
- [X] T023 [P] [US2] Dar estilo a la barra de filtros y al estado de resultados vacíos en `src/styles.css`

**Punto de control**: La Historia de Usuario 2 es funcional de forma independiente sobre el catálogo de US1.

---

## Fase 5: Historia de Usuario 3 - Gestión de carrito de compras (Prioridad: P3)

**Objetivo**: Permitir añadir productos al carrito, ajustar cantidades y quitar artículos, recalculando subtotal y total general.

**Prueba Independiente**: Un usuario añade un producto, aumenta la cantidad a 2 y comprueba que el total del artículo y el subtotal se duplican; al quitar el artículo, el total se actualiza de inmediato.

### Pruebas para la Historia de Usuario 3

- [X] T024 [P] [US3] Añadir pruebas unitarias para añadir, actualizar cantidad, quitar artículos y recalcular totales en `tests/unit/cart.test.js`
- [X] T025 [P] [US3] Añadir la prueba de integración de las interacciones del carrito y la actualización de totales en `tests/integration/cart.test.js`

### Implementación de la Historia de Usuario 3

- [X] T026 [P] [US3] Crear el componente del carrito con líneas de producto, controles de cantidad, botón de quitar y totales en `src/components/cart.js`
- [X] T027 [US3] Conectar las operaciones del carrito y el recálculo de subtotal/total en `src/storage.js` y `src/app.js`
- [X] T028 [P] [US3] Dar estilo al panel del carrito, líneas, controles de cantidad y resumen de totales en `src/styles.css`

**Punto de control**: La Historia de Usuario 3 es funcional y persistente de forma independiente.

---

## Fase 6: Historia de Usuario 4 - Aplicación de códigos de descuento (Prioridad: P4)

**Objetivo**: Validar cupones promocionales y aplicar el descuento sobre el total, con notificaciones de éxito/error y restauración del total al quitarlos.

**Prueba Independiente**: Un cupón válido aplica el descuento y muestra éxito; un cupón inválido, vencido o agotado se bloquea con un mensaje claro; al quitar el cupón o refrescar, el total vuelve al valor original.

### Pruebas para la Historia de Usuario 4

- [X] T029 [P] [US4] Añadir pruebas unitarias para cupones válidos, inválidos, vencidos y con límite de uso agotado en `tests/unit/coupons.test.js`
- [X] T030 [P] [US4] Añadir la prueba de integración de aplicar y quitar cupones con actualización del total en `tests/integration/coupons.test.js`

### Implementación de la Historia de Usuario 4

- [X] T031 [P] [US4] Crear el componente de entrada de cupón con notificaciones de éxito y error en `src/components/coupon-form.js`
- [X] T032 [US4] Conectar la validación, aplicación, eliminación y restauración del cupón con el total del carrito en `src/app.js` y `src/coupons.js`
- [X] T033 [P] [US4] Dar estilo al campo de cupón y a los avisos de éxito/error en `src/styles.css`

**Punto de control**: La Historia de Usuario 4 es funcional de forma independiente sobre el carrito de US3.

---

## Fase 7: Historia de Usuario 5 - Proceso de pago seguro (Prioridad: P5)

**Objetivo**: Permitir completar la compra con datos de envío y método de pago, validar campos obligatorios y mostrar una confirmación con número de pedido.

**Prueba Independiente**: Un usuario completa dirección y método de pago, confirma y llega a una página de confirmación con número de pedido; si falta un campo obligatorio, se resalta y se impide continuar.

### Pruebas para la Historia de Usuario 5

- [X] T034 [P] [US5] Añadir pruebas unitarias para la validación de checkout y la generación del número de pedido en `tests/unit/checkout.test.js`
- [X] T035 [P] [US5] Añadir la prueba de integración del flujo de checkout, errores de campos obligatorios y página de confirmación en `tests/integration/checkout.test.js`

### Implementación de la Historia de Usuario 5

- [X] T036 [P] [US5] Crear el formulario de checkout con campos de envío, selección de método de pago y mensajes de validación en `src/components/checkout-form.js`
- [X] T037 [US5] Crear la vista de confirmación con el número de pedido y el resumen de la compra en `src/components/order-confirmation.js`
- [X] T038 [US5] Implementar la validación del checkout, el descuento de stock, la persistencia del pedido y el enrutado a la confirmación en `src/app.js` y `src/storage.js`
- [X] T039 [US5] Implementar la pasarela de pago simulada con éxito, error y timeout reintentable en `src/payments.js`
- [X] T040 [P] [US5] Dar estilo al formulario de checkout, estados de error y vista de confirmación en `src/styles.css`

**Punto de control**: El embudo de compra está completo hasta la confirmación del pedido.

---

## Fase 8: Historia de Usuario 6 - Historial y seguimiento de Documentos de Venta (Prioridad: P6)

**Objetivo**: Consultar el historial de documentos de venta de un cliente (tipo, fecha, monto, estado) y enmascarar el límite de crédito cuando el rol no tiene permisos financieros.

**Prueba Independiente**: Un usuario abre la ficha de un cliente y ve sus operaciones con tipo, fecha, monto y estado; un rol sin permisos financieros ve el límite de crédito enmascarado.

### Pruebas para la Historia de Usuario 6

- [X] T041 [P] [US6] Añadir pruebas unitarias para la obtención del historial por cliente y el enmascaramiento por rol en `tests/unit/order-history.test.js`
- [X] T042 [P] [US6] Añadir la prueba de integración de la vista de historial, estados y límite de crédito enmascarado en `tests/integration/order-history.test.js`

### Implementación de la Historia de Usuario 6

- [X] T043 [P] [US6] Crear el componente de historial con tipo de documento, fecha, monto y estado en `src/components/order-history.js`
- [X] T044 [US6] Implementar la consulta del historial por cliente y el enmascaramiento de `creditLimit` según el rol en `src/app.js` y `src/module-config.js`
- [X] T045 [P] [US6] Dar estilo a la tabla/tarjetas de historial y a las insignias de estado en `src/styles.css`

**Punto de control**: Todas las historias de usuario están funcionales y son comprobables de forma independiente.

---

## Fase 9: Pulido y Preocupaciones Transversales

**Propósito**: Seguridad, accesibilidad, casos límite, documentación y verificación final.

- [X] T046 [P] Reforzar la sanitización de entradas y el escape de HTML/atributos antes de renderizar en el DOM en `src/app.js` y `src/components/*.js`
- [X] T047 [P] Añadir refinamientos de accesibilidad (etiquetas, foco, teclado, insignias con texto alternativo) en `index.html` y `src/styles.css`
- [X] T048 [P] Cubrir casos límite: última unidad en stock concurrente, expiración de cupón durante el checkout y timeout de la pasarela en `src/app.js`, `src/coupons.js` y `src/payments.js`
- [X] T049 [P] Añadir una prueba de extremo a extremo del embudo completo (catálogo → carrito → cupón → checkout → confirmación) en `tests/integration/purchase-funnel.test.js`
- [X] T050 [P] Reconciliar `plan.md` y `data-model.md` con el alcance de `spec.md` (Producto, Cupón, Pedido, reglas de stock) en `specs/002-modulo-ventas/plan.md` y `specs/002-modulo-ventas/data-model.md`
- [X] T051 Ejecutar la suite completa (`npm test`) y la compilación de producción (`npm run build`), y actualizar la documentación de uso en `README.md`

---

## Dependencias y Orden de Ejecución

### Dependencias entre Fases

- **Configuración (Fase 1)**: Sin dependencias; puede comenzar de inmediato.
- **Fundacional (Fase 2)**: Depende de la Configuración; BLOQUEA todas las historias.
- **US1 (Fase 3)**: Depende de la Fase 2; es el MVP.
- **US2 (Fase 4)**: Depende de US1 (catálogo y productos).
- **US3 (Fase 5)**: Depende de US1 (productos y precios).
- **US4 (Fase 6)**: Depende de US3 (carrito y totales).
- **US5 (Fase 7)**: Depende de US3 y US4 (carrito y total con descuento).
- **US6 (Fase 8)**: Depende de US5 (pedidos persistidos) y de los datos de cliente.
- **Pulido (Fase 9)**: Depende de todas las historias deseadas.

### Dependencias entre Historias

- **US1 (P1)**: Sin dependencias posteriores a la Fase 2; MVP.
- **US2 (P2)**: Requiere US1.
- **US3 (P3)**: Requiere US1.
- **US4 (P4)**: Requiere US3.
- **US5 (P5)**: Requiere US3 y US4.
- **US6 (P6)**: Requiere US5.

### Dentro de Cada Historia

- Las pruebas deben escribirse y FALLAR antes de la implementación.
- Almacenamiento/modelos antes que componentes y cableado.
- Implementación base antes de integraciones entre historias.

### Oportunidades Paralelas

- T002, T003 y T004 pueden ejecutarse en paralelo dentro de la Configuración.
- T008, T009, T011 y T012 pueden ejecutarse en paralelo dentro de la Fundacional.
- Las pruebas unitarias y de integración de una misma historia marcadas `[P]` pueden ejecutarse en paralelo.
- Los componentes de una misma historia marcados `[P]` pueden ejecutarse en paralelo.
- Tras la Fase 2, US1 y el trabajo de datos de US6 pueden prepararse en paralelo, aunque US6 se integra al final.
- En la Fase 9, T046, T047, T048, T049 y T050 pueden ejecutarse en paralelo antes de la verificación final T051.

---

## Ejemplo Paralelo: Historia de Usuario 1

```bash
# Lanzar las pruebas de US1 juntas:
Task: "Añadir pruebas unitarias para destacados y stock en tests/unit/products.test.js"
Task: "Añadir prueba de integración del catálogo en tests/integration/product-catalog.test.js"

# Lanzar los componentes de US1 juntos:
Task: "Crear tarjeta de producto en src/components/product-card.js"
Task: "Crear catálogo destacado en src/components/product-catalog.js"
Task: "Dar estilo al catálogo en src/styles.css"
```

## Ejemplo Paralelo: Historia de Usuario 5

```bash
# Pruebas y componentes de checkout en paralelo:
Task: "Añadir pruebas unitarias de checkout en tests/unit/checkout.test.js"
Task: "Añadir prueba de integración de checkout en tests/integration/checkout.test.js"
Task: "Crear formulario de checkout en src/components/checkout-form.js"
Task: "Crear vista de confirmación en src/components/order-confirmation.js"
Task: "Dar estilo al checkout en src/styles.css"
```

---

## Estrategia de Implementación

### MVP Primero (Solo Historia de Usuario 1)

1. Completar la Fase 1: Configuración.
2. Completar la Fase 2: Fundacional (CRÍTICO, bloquea todo).
3. Completar la Fase 3: US1 - Catálogo de productos destacados.
4. **DETENERSE Y VALIDAR**: probar el catálogo y el estado agotado de forma independiente.
5. Desplegar/demostrar si está listo.

### Entrega Incremental

1. Configuración + Fundacional → base lista.
2. Añadir US1 → probar → desplegar (MVP).
3. Añadir US2 → probar → desplegar.
4. Añadir US3 → probar → desplegar.
5. Añadir US4 → probar → desplegar.
6. Añadir US5 → probar → desplegar.
7. Añadir US6 → probar → desplegar.
8. Pulido y verificación final.

### Estrategia de Equipo en Paralelo

1. El equipo completa Configuración + Fundacional en conjunto.
2. Tras la Fundacional:
   - Desarrollador A: US1 → US2.
   - Desarrollador B: US3 → US4.
   - Desarrollador C: preparar US6 (historial) y apoyar el checkout de US5.
3. Integrar y validar cada historia de forma independiente.

---

## Notas

- `[P]` indica archivos distintos y sin dependencias pendientes.
- `[Historia]` permite la trazabilidad de cada tarea a su historia de usuario.
- Cada historia debe poder completarse y probarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Confirmar cada tarea o grupo lógico; no agrupar cambios no relacionados.
- Evitar tareas vagas, conflictos en el mismo archivo y dependencias entre historias que rompan la independencia.
- `data-model.md` describe el módulo base ERP (Cliente/Documento); T050 lo reconcilia con Producto, Cupón y Pedido del alcance de `spec.md`.
