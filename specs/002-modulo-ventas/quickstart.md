# Guía rápida de validación: Hero, cabecera, TIENDA, Evolución de ventas y accesos gerenciales

**Feature**: `002-modulo-ventas`  
**Rama**: `002-modulo-ventas`  
**Referencias**: [`contracts/ui-header-contract.md`](contracts/ui-header-contract.md), [`data-model.md`](data-model.md), [`plan.md`](plan.md), [`spec.md`](spec.md)

## Prerrequisitos

- Node.js y npm instalados.
- Dependencias del proyecto instaladas (`node_modules` presente).
- Ejecutar los comandos desde la raíz del repositorio.

No se requiere backend ni credenciales reales. El pago y la sesión privilegiada son simulados.

## Comandos de validación

```powershell
npm run test:002
npm run build
npm test -- --run
```

Resultados esperados:

- `npm run test:002`: 25 archivos aprobados; el número de pruebas puede aumentar con los casos nuevos de Perfil, sesión gerencial y marquesina.
- `npm run build`: compilación Vite correcta; las imágenes de `public/images/` se copian a `dist/images/`.
- `npm test -- --run`: la comparación debe respetar la línea base de 88 fallos heredados del módulo 001; este cambio no debe añadir fallos nuevos.

Suite enfocada durante desarrollo:

```powershell
npx vitest run tests/unit/metrics-charts.test.js tests/integration/header-shell.test.js tests/integration/product-catalog.test.js tests/integration/product-filters.test.js tests/integration/metrics-dashboard.test.js tests/integration/role-views.test.js tests/integration/admin-panel.test.js tests/integration/order-history.test.js tests/integration/offer-lifecycle.test.js
```

> El scroll se verifica con un stub de `Element.prototype.scrollIntoView`; no se requiere layout real en jsdom.

## Escenarios automatizados obligatorios

1. **Hero**: no hay caja blanca en `.hero__content`; `h1` y subtítulo son `#FFFFFF`; el badge sigue siendo el único pill alto contraste y el degradado exacto aparece al final de `src/styles.css`.
2. **Cabecera**: `#shop-menu-toggle` y `#manage-menu-toggle` están en `.nav-header__left`, `#brand-name` en `.nav-header__center` sin `.brand__mark`, y Perfil/`#cart-count` en `.nav-header__right`.
3. **Alineación**: `#shop-menu` y `#manage-menu` usan `left: 0`; `#shop-menu` no conserva `left: 50%` ni `transform: translateX(-50%)`.
4. **Destacados**: el clic aplica `featuredOnly: true`, cierra el menú y llama a `scrollIntoView` con `#productos-destacados` y `{ behavior: 'smooth', block: 'start' }`.
5. **Ver todo**: limpia `category`, cierra el menú y baja a `#productos`.
6. **Categorías**: `Knit`, `Poleras`, `Polerones` y `Accesorios` aplican `category`, cierran el menú y bajan a `#productos`.
7. **Evolución de ventas**: `salesByDateChart()` agrupa por `YYYY-MM`, muestra `$69k`, conserva el monto exacto en `title`/tabla `sr-only` y expone `data-chart-from`/`data-chart-to`.
8. **Filtro mensual**: el clic en una columna actualiza `#metrics-from`/`#metrics-to` y recalcula el panel sin errores.
9. **Regresiones**: permisos, Historial, Administración y grillas de 4 columnas permanecen iguales.
10. **Perfil**: `#profile-panel` está dentro de `.profile-container`, el CSS contiene `position: relative`, `right: 0` y `left: auto`; los menús izquierdos conservan `left: 0`.
11. **Acceso pendiente**: al cambiar `#role-select` a `admin`, `#admin-access` se muestra, `#admin-access-error` sigue oculto, `#role-logout` está oculto y `GESTIÓN` no habilita Historial/Administración/Métricas.
12. **Acceso validado**: un código incorrecto muestra `Acceso denegado` sin activar permisos; `1234` oculta el formulario, habilita GESTIÓN, muestra `#role-logout` y permite el límite de crédito sin enmascarar.
13. **Marquesina**: `.announcement-track` contiene dos copias del mensaje exacto y el CSS define `overflow: hidden`, `@keyframes`, `translateX(-50%)`, `linear infinite` y `animation-play-state: paused` en `:hover`.

## Validación manual en navegador

```powershell
npm run dev
```

Abrir `http://localhost:5173` y comprobar:

1. **Hero**: `CATÁLOGO DE PRODUCTOS` y el subtítulo se leen en blanco sobre la foto oscurecida, sin caja blanca; solo el pill superior tiene fondo.
2. **Cabecera**: `TIENDA` y `GESTIÓN` están a la izquierda con sus paneles cayendo al mismo lado; `ROOTSOUTH®` está centrado sin cuadro `RS`; Perfil y `CARRITO` están a la derecha.
3. **TIENDA → Destacados**: el menú se cierra y la página baja suavemente a `PRODUCTOS DESTACADOS` con solo destacados.
4. **TIENDA → Ver todo**: el menú se cierra, el filtro de categoría vuelve a «Todas» y la página baja suavemente a `PRODUCTOS`.
5. **TIENDA → categoría**: `Knit`, `Poleras`, `Polerones` o `Accesorios` filtran el catálogo, cierran el menú y bajan a `PRODUCTOS`.
6. **Métricas**: en el panel de Gerente General, «Evolución de ventas» muestra pocas etiquetas limpias como `$69k`; al pasar el cursor aparece el monto exacto y al hacer clic se filtra el mes.
7. **Sin regresiones**: Historial, Administración y la grilla de 4 columnas siguen funcionando como antes.
8. **Perfil**: abrir `Perfil` y comprobar que el panel cae justo debajo y a la derecha del botón, no al costado izquierdo.
9. **Gerente General**: elegir `Gerente General`; debe aparecer el formulario de código, sin `Cerrar sesión` ni GESTIÓN habilitada. Probar `9999` (mensaje de error, sin cambios de permisos) y luego `1234` (formulario oculto, GESTIÓN y logout visibles).
10. **Marquesina**: observar que los cinco avisos se desplazan sin cortes y que el movimiento se detiene al pasar el cursor por la cinta.

Para probar métricas manualmente, seleccionar `Gerente General`, validar `1234` en el panel de Perfil y abrir `GESTIÓN` → `Métricas`. No es necesario cambiar `erp.seedVersion`.

## Criterios de salida

La entrega está lista para implementación/tareas cuando:

- No existen `NEEDS CLARIFICATION` en [`research.md`](research.md).
- El contrato DOM/ARIA/interacción, el modelo de presentación y la guía concuerdan con FR-007/FR-010.
- Las suites afectadas por las cuatro correcciones y por los tres deltas están identificadas para actualización.
- El contrato incluye Perfil alineado a la derecha, sesión gerencial pendiente/validada y marquesina infinita.
- No se modifica el esquema persistido, `SEED_VERSION`, la matriz de permisos, el diseño de Historial/Administración ni la grilla de 4 columnas.
