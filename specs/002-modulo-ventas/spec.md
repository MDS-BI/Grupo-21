# Especificación de la Funcionalidad: Módulo de Ventas

**Rama de la funcionalidad**: `002-modulo-ventas`
**Creada**: 2026-10-26  
**Estado**: Borrador  
**Entrada**: Construir un módulo de ventas para un sistema ERP que permita gestionar datos maestros de clientes y el ciclo de documentos transaccionales vinculados (cotizaciones, pedidos, facturas) con capacidades de crear, editar, eliminar y buscar.

## Propósito

Este proyecto sirve como módulo base reutilizable para construir módulos ERP personalizados. Establece los patrones comunes que todo módulo ERP necesita: gestionar registros de datos maestros (**Entidades**) y sus **Documentos** transaccionales asociados, con navegación, validación, persistencia y búsqueda ya implementadas, de modo que los módulos personalizados solo necesiten definir sus campos y reglas específicos del dominio.

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Catálogo de productos destacados (Priority: P1)
Como cliente que accede a la plataforma online, quiero que en la pagina principal se encuentre una seccion que enseñe los productos mas destacados, de forma que se conozca rapidamente la oferta principal.

**Por qué esta prioridad**: Esto permite enganchar la atencion del cliente, logrando que siga navegando por la pagina.

**Prueba Independiente**: se puede probar ingresando a la pagina principal y verificar que se muestre en la seccion de destacados los articulos junto a su precio y boton de compra.

**Escenarios de Aceptación**:
1. **Dado** que el usuario ingresa a la pagina principal, **cuando** está termina de cargar, **entonces** se visualiza la seccion que contiene los productos principales que se encuentran disponibles.
⁠2. **Dado** que uno de los productos se queda sin stock, **cuando** el sistema actualiza el conteo de inventario, **entonces** el producto muestra la etiqueda de agotado y se deshabilita el boton de compra.

---

### Historial de usuario 2 - Filtrado de productos por categoria y precio  (Priority: P2)

**Descripción**: Como cliente, tengo la necesidad de filtar el catalogo de ventas por categorias y el rango de precio para poder encontrar un producto en especifico que deseo comprar sin la necesidad de ir pestaña tras pestaña.

**¿Por qué esta prioridad?**: Mejora la experiencia del cliente y acelera el proceso de decision de la compra.

**Escenario de aceptación**:
1. **Dado** que el usuario esta en el catalogo, **cuando** selecciona la categoria de "smartphone" y establece un precio maximo, **entonces** el listado se actualiza mostrando solo los artículos que cumplen con ambos criterios
⁠2. **Dado** si es que no llegan a existir productos en el rango de precios seleccionados, **cuando** el usuario aplica el filtro, **entonces** el sistema muestra un mensaje el cual indica que no hay resultados disponibles.

### Historia de Usuario 3 - Panel de inicio con acciones rápidas y estadísticas de registros (Prioridad: P1)

Como usuario de negocio, quiero aterrizar en un panel estilo ERP con botones de acción rápida claramente etiquetados para las tareas clave y totales de registros de un vistazo al abrir la aplicación, para poder empezar a trabajar de inmediato.

**Por qué esta prioridad**: El panel es el punto de entrada de la aplicación. Nada más puede alcanzarse sin él, y las acciones rápidas son la ruta más rápida hacia cada flujo de trabajo central.

**Prueba Independiente**: Un usuario abre la aplicación, ve un panel con múltiples botones de acción rápida y estadísticas de registros, inicia una nueva entidad o documento con un solo clic y ve estadísticas que reflejan los datos almacenados.

**Escenarios de Aceptación**:

1. **Dado** que el usuario abre la aplicación, **cuando** la aplicación carga, **entonces** se muestra el panel de inicio con al menos cuatro botones de acción rápida claramente etiquetados que cubren las tareas ERP clave: crear una nueva entidad, crear un nuevo documento, abrir la gestión de entidades y buscar registros.
2. **Dado** que se muestra el panel, **cuando** el usuario activa la acción de nueva entidad, **entonces** la aplicación abre el área de gestión de entidades con un formulario vacío listo para introducir datos.
3. **Dado** que se muestra el panel, **cuando** el usuario activa la acción de nuevo documento, **entonces** la aplicación abre el área de gestión de documentos con un formulario vacío listo para introducir datos.
4. **Dado** que se muestra el panel, **cuando** el usuario activa la acción de buscar registros, **entonces** la aplicación abre la pantalla de búsqueda con el campo de búsqueda enfocado.
5. **Dadas** entidades y documentos almacenados, **cuando** el usuario ve el panel, **entonces** las tarjetas de estadísticas muestran el recuento actual de entidades y documentos.
6. **Dado** que el usuario crea o elimina registros en otra parte de la aplicación, **cuando** vuelve al panel, **entonces** las estadísticas reflejan el cambio.

---

### Historia de Usuario 4 - Aplicación de códigos de descuento (Prioridad: P4)

**Descripción**: Como cliente, quiero ingresar un código de cupón promocional en el resumen de compra o carrito para obtener un descuento directo en el valor total de mi pedido, dinamizando mi experiencia de compra.

**¿Por qué esta prioridad?:** Es una herramienta comercial estratégica fundamental para captar la atención de nuevos clientes, incentivar campañas de marketing y mejorar la retención, a pesar de que la venta puede completarse con normalidad aunque el cupón no exista o no se utilice.

**Prueba independiente:** Se puede probar introduciendo un código de descuento válido en el resumen de la compra y verificando tanto en tiempo real como en el almacenamiento local que se aplique correctamente el porcentaje o monto rebajado al total del pedido.

**Escenarios de Aceptación:**

**Dado** que el usuario introduce un código de cupón activo y vigente en el campo correspondiente, cuando hace clic en el botón "Aplicar", entonces el sistema valida el código, descuenta de forma dinámica el monto o porcentaje correspondiente del total y muestra una notificación visual de éxito.

**Dado** que el usuario ingresa un código inválido, mal escrito, vencido o que ya superó su límite de uso, cuando hace clic en "Aplicar", entonces el sistema bloquea la aplicación del descuento y muestra un mensaje de error claro indicando que el cupón no es válido.

**Dado** que el usuario ha aplicado exitosamente un cupón de descuento, cuando decide eliminarlo o refresca la vista del documento de venta, entonces el sistema restablece el valor original total del pedido de manera inmediata.

### Historial de usuario 5 - Proceso de pago seguro (Priority: P5)

**Descripción**: Como cliente, quiero ingresar mis datos de envío y seleccionar un método de pago seguro para finalizar mi compra de forma confiable.

**¿Por qué esta prioridad?**: Es el cierre crítico de la transacción comercial (conversión final) indispensable para concretar los ingresos de la plataforma.

**Prueba independiente**: Se puede probar rellenando los campos obligatorios de dirección, seleccionando una pasarela de pago simulada y completando la transacción exitosamente

**Escenarios de Aceptación**:

1. **Dado** que el usuario llena su dirección y selecciona pago con tarjeta, **cuando** introduce datos válidos y confirma el pago, **entonces** el sistema prcesará la orden y lo redirige a una página de conformación con el número del pedido.

2. **Dado** que falta un campo obligatorio en el formulario de envío ,**cuando** el usuario intenta avanzar al pago, **entonces** el sistema resalta los campos faltantes e impide continuar.

---

### Historial de usuario 6 - Historial y seguimiento de Documentos de Venta  (Prioriridad: P6)
**Descripción**: Como Ejecutivo de Ventas, quiero consultar el historial de documentos de un Cliente específico para saber el estado de cada operación comercial (Cotización, Pedido, Facturado) y hacer seguimiento.

**¿Por qué esta prioridad?** Aporta valor inmediato para la gestión de cartera y atención al cliente, reduciendo fricciones en el embudo de ventas, y permite probar la integridad 1:N entre Cliente y Documento definida en el plan.

**Prueba independiente**: Se puede probar ingresando a la vista de un Cliente y verificando que aparezca la lista de operaciones comerciales pasadas con su respectivo estado.

**Escenarios de Aceptación**:

1. **Dado** que el Cliente tiene operaciones previas, **cuando** el Ejecutivo de Ventas consulta su ficha, **entonces** visualiza el historial detallando el tipo de documento, fecha, monto y estado actual.

2. **Dado** que existen lineamientos estrictos sobre datos sensibles, **cuando** el usuario visualiza el historial, **entonces** el sistema enmascara la vista del límite de crédito (creditLimit) si el rol no tiene los permisos financieros correspondientes.
   
---



### Casos Límite
- ¿Qué sucede cuando dos usuarios intentan comprar la última unidad de un producto con stock crítico exactamente al mismo tiempo?
- ¿Cómo maneja el sistema una caída de conexión o un timeout de la pasarela de pagos externa justo en el momento de confirmar la transacción?
- ¿Qué ocurre si un cupón de descuento expira exactamente mientras el usuario tiene el producto en el carrito de compras pero aún no finaliza el pago?

## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE [permitir a los clientes filtrar el catálogo de productos por categoría y rango de precios dinámicamente.]
- **FR-002**: El sistema DEBE [calcular y actualizar automáticamente el subtotal y total del carrito de compras cuando se modifican las cantidades o se eliminan productos.]
- **FR-003**: El sistema DEBE [validar la vigencia de los cupones promocionales y aplicar el descuento correspondiente sobre el monto total del pedido.]
- **FR-004**: El sistema DEBE [procesar los datos de envío y derivar el pago a una pasarela segura, generando un número de confirmación tras el éxito.]
- **FR-005**: EL sistema DEBE [egistrar el historial de documentos de venta (Cotización, Pedido, Facturado) y restringir datos sensibles según el rol del usuario (ej. Ejecutivo de Ventas).]
### Requisitos de Extensibilidad *(obligaciones del módulo base)*

Los módulos personalizados construidos sobre esta base DEBEN poder:

- **XR-001**: Extender los registros de entidad y documento con campos adicionales específicos del dominio sin cambiar la estructura de almacenamiento base.
- **XR-002**: Reetiquetar pantallas, pestañas, formularios y listas con terminología específica del módulo sin alterar el comportamiento de navegación.
- **XR-003**: Añadir reglas de validación específicas del módulo junto a las reglas de validación base.
- **XR-004**: Apoyarse en el módulo base para generación de identidad, marcas de tiempo, integridad referencial entre entidades y documentos, y eliminación en cascada.
- **XR-005**: Remarcar el espacio de trabajo —nombre del módulo, logotipo derivado y color de acento— únicamente mediante configuración.


### Entidades Clave *(incluir si la funcionalidad implica datos)*

- **Entidad**: Un registro de datos maestros gestionado por el módulo, que incluye su nombre, código de negocio, detalles descriptivos, categoría de clasificación, una fecha objetivo opcional y un entity_id autogenerado. Los módulos personalizados definen qué representa una Entidad en el mundo real (p. ej., cliente, producto, activo).
- **Documento**: Detalles transaccionales adjuntos a una entidad, vinculados a ella por el entity_id de la entidad. Los módulos personalizados definen qué representa un Documento (p. ej., pedido, factura, contrato).
- **ModuleConfig**: El objeto de adaptación cargado al arrancar que define el nombre del módulo, las etiquetas de terminología, las definiciones de campos personalizados y el ciclo de vida de estados de documentos. Consulte data-model.md para su forma completa.
-  **[Producto]**: [Representa el artículo disponible en la tienda. Atributos clave: ID, nombre, descripción, precio, stock disponible, categoría, etiqueta (destacado/normal).]
- **[Pedido(documento de venta)]**: [Representa la transacción comercial en sus distintos estados. Atributos clave: ID, cliente_id, fecha, monto_total, estado (cotización, pagado, facturado), cupon_aplicado.]
- **[Cliente]**:[Representa al usuario comprador. Atributos clave: ID, nombre, correo electrónico, dirección_envío, limite_credito.]

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **SC-001**: [Los usuarios pueden completar el embudo de compra (desde el carrito hasta la confirmación de pago) en menos de 3 minutos.]
- **SC-002**: [El sistema actualiza el stock y muestra la etiqueta de "agotado" en el catálogo principal en menos de 2 segundos tras confirmarse una venta.]
- **SC-003**: [El 95% de los usuarios logra aplicar cupones de descuento válidos exitosamente en su primer intento sin errores de interfaz.]
- **SC-004**: [Reducir el tiempo que los Ejecutivos de Ventas dedican a buscar el estado de las compras de un cliente en un 40% gracias a la nueva vista de historial.]

## Suposiciones
- [Los usuarios (clientes y ejecutivos) cuentan con una conexión a internet estable para navegar y procesar pagos sin pérdida de sesión.]
- [El sistema de autenticación (inicio de sesión y registro de usuarios/roles) ya existe en el ERP base y será reutilizado para este módulo.]
- [La integración con la pasarela de pagos (ej. Webpay, Stripe) será provista por un servicio de terceros; el desarrollo de la pasarela en sí está fuera del alcance de esta versión.]
- [La gestión logística y seguimiento del despacho físico de los productos está fuera del alcance del módulo de ventas v1.]


