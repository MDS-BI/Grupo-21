# Guía rápida de validación: Hero, cabecera, TIENDA y Evolución de ventas

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

- `npm run test:002`: 25 archivos y 159 pruebas aprobadas, incluidas las cuatro correcciones.
- `npm run build`: compilación Vite correcta; las imágenes de `public/images/` se copian a `dist/images/`.
- `npm test -- --run`: la comparación debe respetar la línea base de 88 fallos heredados del módulo 001; este cambio no debe añadir fallos nuevos.

Suite enfocada durante desarrollo:

```powershell
npx vitest run tests/unit/metrics-charts.test.js tests/integration/header-shell.test.js tests/integration/product-catalog.test.js tests/integration/product-filters.test.js tests/integration/metrics-dashboard.test.js
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

Para probar métricas manualmente, seleccionar `Gerente General`, abrir `GESTIÓN` → `Métricas` y validar con `erp.role` en `localStorage` si es necesario. No es necesario cambiar `erp.seedVersion`.

## Criterios de salida

La entrega está lista para implementación/tareas cuando:

- No existen `NEEDS CLARIFICATION` en [`research.md`](research.md).
- El contrato DOM/ARIA/interacción, el modelo de presentación y la guía concuerdan con FR-007/FR-010.
- Las suites afectadas por las cuatro correcciones están identificadas para actualización.
- No se modifica el esquema persistido, `SEED_VERSION`, Historial, Administración ni la grilla de 4 columnas.
