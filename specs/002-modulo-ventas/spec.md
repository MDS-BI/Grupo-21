# Especificación de la Funcionalidad: Módulo de Ventas

**Rama de la funcionalidad**: `002-modulo-ventas`
**Creada**: 2026-10-26  
**Estado**: Finalizado  
**Entrada**: Construir un módulo de ventas para un sistema ERP que permita gestionar datos maestros de clientes y el ciclo de documentos transaccionales vinculados (cotizaciones, pedidos, facturas) con capacidades de crear, editar, eliminar y buscar.

## Propósito

Este módulo permite gestionar el catálogo de productos, el carrito de compras y el ciclo de documentos transaccionales para facilitar la compra de los clientes y la administración comercial.


## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Catálogo de productos destacados (Prioridad: P1)
Como cliente que accede a la plataforma online, quiero que en la pagina principal se encuentre una seccion que enseñe los productos mas destacados, de forma que se conozca rapidamente la oferta principal.

**Por qué esta prioridad**: Esto permite enganchar la atencion del cliente, logrando que siga navegando por la pagina.

**Prueba Independiente**: se puede probar ingresando a la pagina principal y verificar que se muestre en la seccion de destacados los articulos junto a su precio y boton de compra.

**Escenarios de Aceptación**:
1. **Dado** que el usuario ingresa a la pagina principal, **cuando** está termina de cargar, **entonces** se visualiza la seccion que contiene los productos principales que se encuentran disponibles.
⁠2. **Dado** que uno de los productos se queda sin stock, **cuando** el sistema actualiza el conteo de inventario, **entonces** el producto muestra la etiqueda de agotado y se deshabilita el boton de compra.

---

### Historia de usuario 2 - Filtrado de productos por categoria y precio  (Prioridad: P2)

**Descripción**: Como cliente, tengo la necesidad de filtar el catalogo de ventas por categorias y el rango de precio para poder encontrar un producto en especifico que deseo comprar sin la necesidad de ir pestaña tras pestaña.

**¿Por qué esta prioridad?**: Mejora la experiencia del cliente y acelera el proceso de decision de la compra.

**Escenario de aceptación**:
1. **Dado** que el usuario esta en el catalogo, **cuando** selecciona la categoria de "Poleras" de RootSouth y establece un precio maximo, **entonces** el listado se actualiza mostrando solo los artículos que cumplen con ambos criterios
⁠2. **Dado** si es que no llegan a existir productos en el rango de precios seleccionados, **cuando** el usuario aplica el filtro, **entonces** el sistema muestra un mensaje el cual indica que no hay resultados disponibles.

### Historia de usuario 3 - Gestión de carrito de compras (Prioridad: P3)
**Descripción**: Como comprador, quiero agregar productos al carrito, ajustar las cantidades o quitar artículos para revisar mi pedido antes de proceder al pago.

**¿Por qué esta prioridad?**: Constituye una etapa clave en el embudo de conversión que le permite al usuario simular su compra y calcular el monto total a pagar.

**Prueba independiente**: Se puede verificar haciendo clic en "Agregar al carrito", cambiando la cantidad de unidades y comprobando que tanto el subtotal como el total general se actualicen correctamente.

**Escenarios de Aceptación**:

1. **Dado** que el usuario añade un producto al carrito, **cuando** aumenta la cantidad a 2 unidades, **entonces** el precio total del artículo y el subtotal del carrito se multiplican de forma correcta por dos. 

2. **Dado** que el usuario quiere descartar un artículo, **cuando** hace clic en el botón de eliminar dentro del carrito, **entonces** el producto se quita y el monto total se actualiza de inmediato.

### Historia de Usuario 4 - Aplicación de códigos de descuento (Prioridad: P4)

**Descripción**: Como cliente, quiero ingresar un código de cupón promocional en el carrito o resumen de compra para obtener una rebaja directa en el monto total de mi pedido y así pagar menos por mis productos.

**¿Por qué esta prioridad?:** Es una herramienta comercial estratégica fundamental para captar la atención de nuevos clientes, incentivar campañas de marketing y mejorar la retención, a pesar de que la venta puede completarse con normalidad aunque el cupón no exista o no se utilice.

**Prueba independiente:** Se puede probar introduciendo un código de descuento válido en el resumen de la compra y verificando tanto en tiempo real como en el almacenamiento local que se aplique correctamente el porcentaje o monto rebajado al total del pedido.

**Escenarios de Aceptación:**

1. **Dado** que el usuario introduce un código de cupón activo y vigente en el campo correspondiente, cuando hace clic en el botón "Aplicar", entonces el sistema valida el código, descuenta de forma dinámica el monto o porcentaje correspondiente del total y muestra una notificación visual de éxito.

2. **Dado** que el usuario ingresa un código inválido, mal escrito, vencido o que ya superó su límite de uso, cuando hace clic en "Aplicar", entonces el sistema bloquea la aplicación del descuento y muestra un mensaje de error claro indicando que el cupón no es válido.

3. **Dado** Dado que el usuario ha aplicado exitosamente un cupón de descuento, cuando refresca la página, entonces el sistema mantiene el descuento aplicado gracias al almacenamiento local, y solo restablece el valor original total si el usuario hace clic explícitamente en eliminarlo.

### Historia de usuario 5 - Proceso de pago seguro (Prioridad: P5)

**Descripción**: Como cliente, quiero ingresar mis datos de envío y seleccionar un método de pago seguro para finalizar mi compra de forma confiable.

**¿Por qué esta prioridad?**: Es el cierre crítico de la transacción comercial (conversión final) indispensable para concretar los ingresos de la plataforma.

**Prueba independiente**: Se puede probar rellenando los campos obligatorios de dirección, seleccionando una pasarela de pago simulada y completando la transacción exitosamente

**Escenarios de Aceptación**:

1. **Dado** que el usuario llena su dirección y selecciona pago con tarjeta, **cuando** introduce datos válidos y confirma el pago, **entonces** el sistema prcesará la orden y lo redirige a una página de conformación con el número del pedido.

2. **Dado** que falta un campo obligatorio en el formulario de envío ,**cuando** el usuario intenta avanzar al pago, **entonces** el sistema resalta los campos faltantes e impide continuar.

3. **Dado** que el cliente finaliza una compra con un nombre de cliente nuevo, **cuando** se confirma la orden, **entonces** el sistema DEBE registrar o vincular ese cliente conservando su nombre completo exacto para que aparezca legible en el selector de Historial de Ventas, sin renderizar textos `undefined` ni opciones en blanco y aplicando un respaldo legible si algún dato histórico viniera incompleto.

---

### Historia de usuario 6 - Historial y seguimiento de Documentos de Venta  (Prioriridad: P6)
**Descripción**: Como Ejecutivo de Ventas, quiero consultar el historial de documentos de un Cliente específico para saber el estado de cada operación comercial (Cotización, Pedido, Facturado) y hacer seguimiento.

**¿Por qué esta prioridad?** Aporta valor inmediato para la gestión de cartera y atención al cliente, reduciendo fricciones en el embudo de ventas, y permite probar la integridad 1:N entre Cliente y Documento definida en el plan.

**Prueba independiente**: Se puede probar ingresando a la vista de un Cliente y verificando que aparezca la lista de operaciones comerciales pasadas con su respectivo estado.

**Escenarios de Aceptación**:

1. **Dado** que el Cliente tiene operaciones previas, **cuando** el Ejecutivo de Ventas consulta su ficha, **entonces** visualiza el historial detallando el tipo de documento, fecha, monto y estado actual.

2. **Dado** que existen lineamientos estrictos sobre datos sensibles, **cuando** el usuario visualiza el historial, **entonces** el sistema enmascara la vista del límite de crédito (creditLimit) si el rol no tiene los permisos financieros correspondientes.

3. **Dado** que el Historial de Ventas muestra clientes registrados, **cuando** un nombre de cliente nuevo se registró o vinculó al finalizar una compra, **entonces** el selector DEBE mostrarlo con su nombre completo exacto y NUNCA renderizar textos `undefined` ni opciones de cliente en blanco, aplicando un respaldo legible si algún dato histórico viniera incompleto.

---

### Historia de Usuario 7 - Administración de precios y generación de ofertas (Prioridad: P7)

**Descripción**: Como administrador de la página, quiero modificar los precios de los productos y generar ofertas o promociones para mantener actualizado el catálogo y atraer a más clientes.

**¿Por qué esta prioridad?**: Permite al negocio adaptar su estrategia comercial sin depender de un desarrollador, aunque la compra puede completarse aunque el administrador nunca modifique precios ni cree ofertas.

**Prueba independiente**: Se puede probar ingresando al panel de administración con el código de acceso "1234", cambiando el precio de un producto y verificando que el nuevo valor se refleje en el catálogo; luego creando una oferta y comprobando que el descuento se muestre y se aplique al total.

**Escenarios de Aceptación**:

1. **Dado** que el administrador está autenticado y accede al panel de administración, **cuando** modifica el precio de un producto y guarda el cambio, **entonces** el sistema valida que el precio sea un valor numérico mayor o igual a cero y actualiza el precio mostrado en el catálogo y en el carrito de compras.

2. **Dado** que el administrador introduce un precio inválido (vacío, negativo o no numérico), **cuando** intenta guardar, **entonces** el sistema impide la actualización y muestra un mensaje de error claro indicando el valor esperado.

3. **Dado** que el administrador crea una oferta indicando producto, porcentaje o monto de descuento y fecha de vigencia, **cuando** guarda la oferta, **entonces** el sistema la registra y el producto muestra el precio con descuento junto a su precio original en el catálogo.

4. **Dado** que una oferta está vigente, **cuando** el cliente agrega el producto ofertado al carrito, **entonces** el carrito aplica automáticamente el precio de oferta y el total refleja el descuento.

5. **Dado** que una oferta alcanza su fecha de fin o el administrador la desactiva, **cuando** el cliente visualiza el catálogo, **entonces** el producto vuelve a mostrarse con su precio original y la oferta deja de aplicarse.

6. **Dado** que un usuario sin rol de administrador intenta acceder al panel de administración, **cuando** navega a esa sección, **entonces** el sistema le deniega el acceso y muestra un mensaje indicando que no tiene los permisos necesarios.

7. **Dado** que un usuario selecciona el rol `Gerente General` en el menú `Perfil`, **cuando** se abre el selector de roles, **entonces** el sistema DEBE solicitar de inmediato el código de acceso `1234` dentro del mismo panel de `Perfil`, antes de otorgar cualquier permiso gerencial.

8. **Dado** que el sistema ha solicitado el código de acceso dentro del panel `Perfil`, **cuando** el usuario ingresa el código `1234`, **entonces** el sistema activa la sesión gerencial y habilita Métricas, Administración y la visualización del límite de crédito sin enmascarar.

9. **Dado** que el usuario seleccionó `Gerente General` pero aún no validó el código, **cuando** intenta acceder a Métricas, Administración o al límite de crédito sin enmascarar, **entonces** el sistema NO activa la vista ni los accesos gerenciales.

10. **Dado** que el usuario ingresa un código distinto de `1234` en el panel `Perfil`, **cuando** intenta validar el acceso, **entonces** el sistema mantiene la sesión gerencial inactiva y muestra un mensaje de error indicando que el código es incorrecto.

### Historia de Usuario 8 - Panel de métricas e indicadores de ventas (Prioridad: P8)
**Descripción**: Como dueño de la empresa o administrador, quiero visualizar un panel con métricas clave del negocio (ingresos totales, cantidad de ventas, ticket promedio, desglose de documentos por estado, productos más vendidos y alertas de stock bajo) para evaluar el rendimiento comercial y tomar decisiones basadas en datos.

**¿Por qué esta prioridad?**: Convierte los registros transaccionales del módulo en información útil para la gestión, diferenciando la plataforma de una tienda simple y aportando valor real de sistema ERP.

**Prueba independiente**: Se puede probar accediendo al panel de métricas con perfil de dueño/administrador, comprobando que los indicadores reflejen los pedidos existentes y luego registrando una compra nueva para verificar que los montos, conteos y rankings se actualicen automáticamente.

**Escenarios de Aceptación:**

1.**Dado** que existen pedidos registrados en el sistema, cuando el dueño ingresa al panel de métricas, entonces el sistema calcula y muestra los ingresos totales acumulados, la cantidad de ventas completadas, el ticket promedio y el total de documentos agrupados por estado (Cotización, Pedido, Facturado).

2.**Dado** que existen ventas de distintos artículos, cuando el dueño consulta el desempeño del catálogo, entonces el sistema muestra un ranking de los productos más vendidos (por unidades e ingresos) y una alerta visual con los productos que tienen stock crítico o agotado.

3.**Dado** que el dueño quiere analizar el rendimiento de un segmento específico, cuando aplica un filtro por rango de fechas o por categoría de producto, entonces todas las métricas e indicadores se recalculan mostrando únicamente la información correspondiente a ese filtro.

4.**Dado** que un cliente finaliza una nueva compra o utiliza un cupón de descuento, cuando el dueño recarga o abre el panel de métricas, entonces el sistema refleja inmediatamente la nueva transacción, incluyendo el monto neto recaudado y el uso acumulado de cupones/ofertas.

5.**Dado** que no existen ventas registradas dentro del rango o categoría seleccionados, cuando el panel termina de cargar, entonces muestra los indicadores en cero junto a un estado vacío informativo sin arrojar errores de cálculo.

### Historia de Usuario 9 - Vistas y navegación diferenciadas por rol de usuario (Prioridad: P9)
**Descripción:** Como usuario del sistema (Cliente, Vendedor o Gerente General), quiero que la interfaz se adapte automáticamente a mi perfil mostrando únicamente las secciones, datos y acciones que me corresponden, para facilitar mi flujo de trabajo y resguardar la información sensible del negocio.

**¿Por qué esta prioridad?:** Garantiza una separación clara de responsabilidades propia de un ERP real, evitando que clientes accedan a herramientas administrativas o que perfiles operativos modifiquen precios o visualicen métricas financieras reservadas a gerencia.

**Prueba independiente:** Se puede probar accediendo al sistema con cada perfil (Cliente, Vendedor y Gerente General) y verificando que la barra de navegación, las pantallas accesibles y las acciones habilitadas cambien de acuerdo con los permisos de cada rol.

**Escenarios de Aceptación:**

1.**Dado** que un usuario ingresa con el rol de Cliente, cuando navega por la aplicación, entonces la interfaz muestra únicamente las vistas orientadas a la compra (Catálogo de productos, Carrito y Pago) y oculta completamente las vistas de Historial, Administración y Métricas, sin enlaces, accesos directos ni contenido visible.

2.**Dado** que un usuario ingresa con el rol de Vendedor (Ejecutivo de Ventas), cuando accede a su espacio de trabajo, entonces visualiza el catálogo, la disponibilidad de stock y el historial y seguimiento de documentos de clientes (Cotización, Pedido, Facturado), pero mantiene bloqueada la edición de precios/ofertas, el panel de métricas financieras globales y los datos sensibles como el límite de crédito (creditLimit).

3.**Dado** que un usuario selecciona el rol de Gerente General en el menú `Perfil`, cuando el sistema le solicita de inmediato el código `1234` dentro del mismo panel y lo valida correctamente, entonces activa la vista gerencial completa con acceso al Panel de Métricas, la Administración de precios y ofertas, y el límite de crédito sin enmascarar.

4.**Dado** que un usuario con rol de Cliente o Vendedor intenta abrir directamente una vista restringida (como Métricas o Administración), cuando el sistema evalúa sus permisos, entonces bloquea la visualización del contenido, muestra un aviso claro de acceso restringido y ofrece regresar a su vista autorizada.

5.**Dado** que el botón `Cerrar sesión` solo se muestra cuando existe una sesión interna activa (Vendedor o Gerente General ya validado), cuando un Vendedor o el Gerente General validado cierra su sesión, entonces el sistema revoca la vista privilegiada y retorna automáticamente a la vista pública de Cliente. Mientras el usuario selecciona `Gerente General` sin haber validado `1234`, el formulario de acceso permanece en el panel `Perfil` y `Cerrar sesión` NO se muestra ni se mezcla con dicho formulario.
---



### Casos Límite
- ¿Qué sucede cuando dos usuarios intentan comprar la última unidad de un producto con stock crítico exactamente al mismo tiempo?
- ¿Cómo maneja el sistema una caída de conexión o un timeout de la pasarela de pagos externa justo en el momento de confirmar la transacción?
- ¿Qué ocurre si un cupón de descuento expira exactamente mientras el usuario tiene el producto en el carrito de compras pero aún no finaliza el pago?
- ¿Qué ocurre si el administrador modifica el precio de un producto mientras un cliente lo tiene en el carrito o una oferta se activa y desactiva durante la compra?
- ¿Qué ocurre si el administrador intenta crear una oferta cuyo descuento supera el 100% del precio del producto o cuya fecha de fin es anterior a la de inicio?
- ¿Qué ocurre con el cálculo de ingresos y el ranking de productos más vendidos si un pedido es anulado o cancelado después de haberse confirmado?
- ¿Qué sucede si expira la sesión del Dueño o del Vendedor mientras tiene abierto el panel de métricas o editando una oferta?
## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE [permitir a los clientes filtrar el catálogo de productos por categoría y rango de precios dinámicamente.]
- **FR-002**: El sistema DEBE [calcular y actualizar automáticamente el subtotal y total del carrito de compras cuando se modifican las cantidades o se eliminan productos.]
- **FR-003**: El sistema DEBE [validar la vigencia de los cupones promocionales y aplicar el descuento correspondiente sobre el monto total del pedido.]
- **FR-004**: El sistema DEBE [procesar los datos de envío y derivar el pago a una pasarela segura, generando un número de confirmación tras el éxito.]
- **FR-005**: EL sistema DEBE [registrar el historial de documentos de venta (Cotización, Pedido, Facturado) y restringir datos sensibles según el rol del usuario (ej. Ejecutivo de Ventas).] Al finalizar una compra con un nombre de cliente nuevo, el sistema DEBE registrar o vincular ese cliente conservando su nombre completo exacto para que aparezca legible en el selector de Historial de Ventas. La interfaz de Historial NUNCA DEBE renderizar textos `undefined` ni opciones de cliente en blanco; si algún dato histórico viniera incompleto, DEBE aplicar un respaldo legible.
- **FR-006**: El sistema DEBE [permitir al administrador modificar los precios de los productos y crear, editar o desactivar ofertas con vigencia, validando los valores ingresados y aplicando automáticamente el descuento en el catálogo y el carrito.]
- **FR-007**: El sistema DEBE calcular y presentar un panel de métricas comerciales (ingresos totales, ticket promedio, distribución de documentos por estado, ranking de productos más vendidos y alertas de stock) con filtros por categoría o rango de fechas. El panel DEBE incluir visualizaciones gráficas interactivas: gráfico de barras de ingresos por categoría, evolución de ventas por fecha, distribución visual proporcional de documentos por estado con etiquetas de color semánticas y barras de progreso en el ranking de productos más vendidos. Estas visualizaciones DEBEN alimentarse de un historial inicial representativo de al menos 12 pedidos de RootSouth distribuidos en los últimos 3 meses. Las etiquetas numéricas sobre las barras del gráfico «Evolución de ventas» NO DEBEN superponerse nunca: DEBEN agruparse por mes o abreviarse (por ejemplo `$69k`), y el monto exacto DEBE mostrarse en un tooltip al pasar el cursor.
- **FR-008**: El sistema DEBE adaptar la barra de navegación, las vistas disponibles y los permisos de visualización o edición según el rol del usuario, impidiendo el acceso no autorizado a secciones restringidas. El selector de roles DEBE contener únicamente los 3 roles del módulo: Cliente, Vendedor y Gerente General, eliminando por completo roles externos del ERP base como Bodega o Finanzas. La etiqueta visible del rol de gerencia DEBE ser `Gerente General` en lugar de `Dueño/Administrador`, sin alterar el identificador interno `admin` ni el resto de permisos. El rol Cliente DEBE ocultar completamente las vistas de Historial, Administración y Métricas, incluidos enlaces de navegación, accesos directos y contenido. La pestaña Administración se mantiene disponible exclusivamente para Gerente General previa validación con código `1234`. Al seleccionar `Gerente General` en el menú `Perfil`, el sistema DEBE solicitar de inmediato el código `1234` dentro del mismo panel antes de otorgar permisos gerenciales; mientras no se valide, NO DEBE activar Métricas, Administración ni el límite de crédito sin enmascarar. El botón `Cerrar sesión` DEBE mostrarse únicamente cuando exista una sesión interna activa de Vendedor o de Gerente General ya validado, nunca mezclado con el formulario de acceso.
- **FR-009**: El catálogo DEBE ser una tienda de ropa con 8 productos reales de RootSouth e imágenes reales renderizadas mediante `<img>`, y los pedidos iniciales de historial/métricas DEBEN coincidir con estas prendas (limpiando datos antiguos de tecnología en `localStorage` mediante un versionado de esquema).
- **FR-010**: La interfaz DEBE seguir una estética minimalista editorial inspirada en `https://scuffers.com/es` (fondo blanco `#FFFFFF`, fotos verticales 3:4 con fondo `#F4F4F4`, bordes rectos `0px`, paleta monocromática en negro `#111111` y grises neutros, tipografía sans-serif con textos de navegación/categorías en mayúsculas espaciadas y zoom sutil al pasar el cursor por las fotos). El encabezado DEBE seguir una estructura editorial despejada inspirada en kadenkas.com y tiendas streetwear modernas, compuesta por una cinta superior delgada en fondo negro `#111111` que DEBE funcionar como marquesina con múltiples mensajes breves en mayúsculas en texto blanco —`ENVÍO GRATIS SOBRE $99.000 CLP · COLECCIÓN ROOTSOUTH 2026 · CUPÓN BIENVENIDO10 — 10% OFF · DESPACHO A TODO CHILE · CAMBIOS Y DEVOLUCIONES FÁCILES`— con desplazamiento horizontal continuo y suave mediante animación CSS infinita sin saltos, pausándose al hacer hover, y una barra de navegación de 3 zonas: a la izquierda, alineados, los enlaces principales con menú desplegable (desglose) `TIENDA`, con categorías y miniatura editorial, y `GESTIÓN`, con Historial, Métricas y Administración visibles solo según los permisos del rol; ambos paneles desplegables DEBEN caer hacia la izquierda y NUNCA centrarse respecto de la ventana; al centro, el logo tipográfico limpio `ROOTSOUTH®` en tipografía negra bold, sin cuadro ni monograma `RS`; a la derecha, un ícono de Perfil/Cuenta que despliega un panel flotante alineado a la derecha y justo debajo del botón `Perfil`, NUNCA al costado izquierdo de la pantalla; el panel incluye el selector de rol y, al seleccionar `Gerente General`, solicita de inmediato el código `1234` dentro del mismo panel antes de activar los permisos gerenciales. El botón `Cerrar sesión` DEBE mostrarse solo cuando exista una sesión interna activa de Vendedor o de Gerente General ya validado, nunca mezclado con el formulario de acceso; además, el ícono de `CARRITO` con contador permanece a la derecha. La portada del catálogo DEBE incluir un Hero Banner visual con fotografía de fondo servida desde `public/images/hero-banner.jpg` y acentos de color sobrios (por ejemplo verde bosque `#1B4332` o terracota/ámbar en badges y métricas) para dar vida sin perder el carácter editorial. La etiqueta superior del Hero Banner `ROOTSOUTH · COLECCIÓN 2026` DEBE ser un pill pequeño de alto contraste, con fondo blanco y texto negro `#111111` o con fondo negro y texto blanco. El Hero Banner DEBE aplicar sobre la fotografía un overlay oscuro mediante el degradado lateral `linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)`. El título `CATÁLOGO DE PRODUCTOS` y su subtítulo DEBEN ir directamente sobre la fotografía oscurecida, en color blanco `#FFFFFF`, SIN caja, fondo ni tarjeta blanca detrás; el único elemento con fondo blanco permitido en el Hero es el pill de la etiqueta superior. La opción `Destacados` del menú `TIENDA` DEBE llevar a la vista Catálogo, cerrar el menú y desplazarse suavemente con `scrollIntoView` hasta la sección `PRODUCTOS DESTACADOS`. La opción `Ver todo` DEBE limpiar el filtro de categoría, cerrar el menú y bajar suavemente hasta la sección `PRODUCTOS`. Al hacer clic en `Knit`, `Poleras`, `Polerones` o `Accesorios`, el sistema DEBE aplicar ese filtro, cerrar el menú y bajar suavemente hasta `PRODUCTOS`. Los 4 productos destacados DEBEN mostrarse en una grilla uniforme de 1 fila y el catálogo general en una grilla pareja de 4 columnas.
### Entidades Clave *(incluir si la funcionalidad implica datos)*

-  **[Producto]**: [Representa el artículo disponible en la tienda. Atributos clave: ID, nombre, descripción, imagen, precio, stock disponible, categoría, etiqueta (destacado/normal).]
- **[Pedido(documento de venta)]**: [Representa la transacción comercial en sus distintos estados. Atributos clave: ID, cliente_id, fecha, monto_total, estado (cotización, pagado, facturado), cupon_aplicado.]
- **[Cliente]**:[Representa al usuario comprador. Atributos clave: ID, nombre, correo electrónico, dirección_envío, limite_credito.]
- **[Oferta]**: [Representa una promoción creada por el administrador sobre un producto. Atributos clave: ID, producto_id, tipo_descuento (porcentaje/monto), valor_descuento, fecha_inicio, fecha_fin, activa.]

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


