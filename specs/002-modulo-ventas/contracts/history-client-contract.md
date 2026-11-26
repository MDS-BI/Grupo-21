# Contrato de interfaz: selector de clientes en Historial de Ventas

**Feature**: `002-modulo-ventas`  
**Spec**: FR-005, Historia de Usuario 5 y Historia de Usuario 6  
**Alcance**: datos del cliente, DOM del selector de Historial y aserciones observables; no define cambios de CSS ni de encabezado.

## Propósito

Garantizar que el nombre capturado en el checkout se conserve como nombre canónico del cliente y aparezca legible en `#history-client`, sin opciones vacías ni texto `undefined` en el DOM.

## Contrato de datos

| Regla | Requisito |
|---|---|
| Campo canónico | `erp.clients[].name` es el único campo leído por el Historial. |
| Captura del checkout | El nombre del formulario (`fullName`) se mapea a `Cliente.name` al crear o vincular el cliente; no se guarda bajo otro nombre. |
| Preservación | Se conservan mayúsculas, acentos y espacios internos del nombre; solo se recortan espacios externos. |
| Clientes antiguos | `loadClients()` normaliza alias (`fullName`, `customerName`, `nombre`, `cliente`) y valores incompletos, y persiste el resultado en `erp.clients` sin cambiar `SEED_VERSION` ni crear claves nuevas. |
| Reutilización | Al encontrar un cliente por correo normalizado, un nombre válido entrante completa el `name` ausente o no legible del cliente existente. |
| Respaldo legible | Si no existe ningún nombre utilizable, se usa `email`, luego `code` y finalmente `Cliente sin nombre`. Los textos `undefined`, `null` y `NaN` se tratan como ausentes. |

## Contrato DOM

| Elemento | Selector | Requisito |
|---|---|---|
| Vista de Historial | `#view-history`, `#history` | `#history-client` existe después de `showView('history')` para roles autorizados; el host y la estructura visual no cambian. |
| Selector de cliente | `#history-client` | Cada `<option>` tiene `value` no vacío derivado de `Cliente.id` y texto visible no vacío. Los registros sin `id` utilizable se omiten. |
| Cliente comprado | `#history-client option[selected]` | Tras una compra nueva, la opción seleccionada muestra exactamente el `fullName` ingresado en el checkout. |
| Seguridad de texto | `document.body.textContent` | Nunca contiene la cadena `undefined`. Ninguna opción contiene `undefined`, `null`, `NaN`, texto vacío o solo espacios. |
| Pedidos del cliente | Tabla dentro de `#history` | Los campos `documentType`, `orderNumber` y `status` usan respaldos legibles cuando el dato histórico falta o contiene «undefined», «null» o «NaN». |

## Contrato de verificación

Las pruebas pueden verificar el contrato sin estilos calculados ni cambios de layout:

- Completar una compra con un nombre nuevo y único, navegar a Historial como Vendedor o Gerente General validado.
- Leer `#history-client` y comprobar que la opción seleccionada tiene `textContent` exactamente igual al nombre del checkout y `value` no vacío.
- Comprobar que toda opción del selector tiene texto y `value` no vacíos.
- Comprobar que `document.body.textContent` no contiene `undefined`.
- Sembrar un cliente antiguo sin `name` pero con alias o correo, cargar Historial y verificar que la opción uses un respaldo legible.

No se define contrato de red: la aplicación no consume ni expone endpoints HTTP en este cambio.
