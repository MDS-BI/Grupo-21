# Feature Specification: Panel de Métricas y Vistas por Rol

**Feature Branch**: `003-add-metrics-role-views`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "quiero que crees una historia de usuario, enfocada en las metricas ademas genera otra historia de usuario en base a que los distintos usuarios como el vendedor, el dueño de la empresa tengan distintas vistas de la pagina (que eso e¿se desglose del boton de administracion)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Panel de métricas comerciales (Priority: P1)

Como dueño de la empresa, quiero consultar un panel con los indicadores clave de la actividad comercial —ingresos totales, cantidad de pedidos, ticket promedio, producto más vendido y su evolución en el tiempo— para comprender el desempeño del negocio y tomar decisiones sin revisar pedido por pedido.

**Why this priority**: Sin una vista consolidada, el dueño depende de revisar documentos individuales y no puede detectar tendencias ni evaluar el resultado de las acciones comerciales. Es el valor directo que solicita la entrada del usuario y la base para las decisiones del resto de las vistas.

**Independent Test**: Se puede probar registrando dos o más pedidos de prueba, abriendo la vista de métricas con un rol autorizado y verificando que los indicadores mostrados coinciden con la suma de esos pedidos; luego cambiando el rango de fechas y comprobando que las cifras se recalculan.

**Acceptance Scenarios**:

1. **Given** existen pedidos registrados en el período consultado, **When** un usuario con permisos abre la vista de métricas, **Then** se muestran los ingresos totales, la cantidad de pedidos, el ticket promedio, el producto más vendido y una evolución por período, todos consistentes con los pedidos registrados.
2. **Given** el panel está abierto con un rango de fechas determinado, **When** el usuario selecciona otro rango y aplica el filtro, **Then** los indicadores y la evolución se recalculan exclusivamente con los pedidos del nuevo rango.
3. **Given** no existen pedidos en el rango seleccionado, **When** se abre el panel, **Then** se muestra un estado vacío claro que indica la ausencia de datos, sin presentar cifras engañosas.
4. **Given** un usuario sin permisos para ver información comercial o financiera, **When** intenta abrir la vista de métricas, **Then** el acceso es denegado, se muestra un mensaje comprensible y no se revela ninguna cifra.
5. **Given** un pedido cambia de estado o es eliminado mientras el panel está abierto, **When** la vista se actualiza, **Then** los indicadores reflejan la situación vigente de los pedidos.

---

### User Story 2 - Desglose de Administración por rol (Priority: P2)

Como usuario de la empresa (vendedor o dueño, entre otros), quiero que al pulsar el botón "Administración" se despliegue un menú con únicamente las secciones correspondientes a mi rol, de forma que cada persona vea las herramientas que necesita y no se expongan funciones ajenas a su responsabilidad.

**Why this priority**: El botón de Administración es hoy un único punto de entrada: al desglosarlo por rol se evita que el vendedor vea precios, ofertas o finanzas del dueño, y se cumple la segunda petición del usuario. Depende de la existencia del panel de métricas para que la sección de métricas del dueño tenga contenido, pero puede demostrarse de forma independiente con el resto de secciones.

**Independent Test**: Se puede probar cambiando el rol activo, pulsando "Administración" en cada caso y verificando que la lista de secciones mostradas coincide exactamente con los permisos del rol, y que intentar abrir una sección no permitida muestra el mensaje de denegación.

**Acceptance Scenarios**:

1. **Given** un usuario con rol de vendedor, **When** pulsa el botón "Administración", **Then** se despliega un menú con las secciones "Mis pedidos" y "Clientes", sin mostrar métricas financieras, precios ni ofertas.
2. **Given** un usuario con rol de dueño o administración, **When** pulsa el botón "Administración", **Then** se despliega un menú con las secciones "Métricas", "Pedidos", "Precios y ofertas" y "Finanzas", y cada sección abre su vista correspondiente.
3. **Given** un usuario sin permisos de administración, **When** pulsa el botón "Administración", **Then** ve un mensaje que indica que no tiene permisos suficientes y no puede abrir ninguna sección restringida.
4. **Given** un usuario ha cambiado el rol activo, **When** vuelve a pulsar "Administración", **Then** el menú muestra solo las secciones del nuevo rol y no conserva opciones del rol anterior.
5. **Given** un usuario intenta acceder directamente a una sección no autorizada para su rol, **When** navega a esa sección, **Then** el sistema bloquea el acceso y muestra el mensaje de permisos insuficientes.

---

### Edge Cases

- ¿Qué sucede si no hay pedidos registrados o el rango de fechas seleccionado no contiene pedidos?
- ¿Qué ocurre si el usuario ingresa un rango de fechas inválido, por ejemplo con la fecha de fin anterior a la de inicio?
- ¿Qué sucede si el rol activo cambia mientras una sección restringida de Administración está abierta?
- ¿Qué ocurre si un pedido se elimina o cambia de estado mientras el panel de métricas permanece abierto?
- ¿Cómo se comporta el menú de Administración si un rol no tiene ninguna sección asignada?
- ¿Qué sucede si dos personas con roles distintos comparten la misma sesión o dispositivo?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar un panel de métricas con ingresos totales, cantidad de pedidos, ticket promedio, producto más vendido y evolución por período, calculados a partir de los pedidos registrados.
- **FR-002**: El sistema DEBE permitir seleccionar un rango de fechas y recalcular todos los indicadores del panel al aplicarlo.
- **FR-003**: El sistema DEBE mostrar un estado vacío claro cuando no existan pedidos en el rango seleccionado.
- **FR-004**: El sistema DEBE restringir la vista de métricas a los roles autorizados y mostrar un mensaje de denegación a los demás, sin exponer cifras.
- **FR-005**: El sistema DEBE desglosar el botón "Administración" en un menú de secciones determinado por el rol activo del usuario.
- **FR-006**: El sistema DEBE mostrar al rol de vendedor únicamente las secciones "Mis pedidos" y "Clientes", ocultando métricas financieras, precios y ofertas.
- **FR-007**: El sistema DEBE mostrar al rol de dueño o administración las secciones "Métricas", "Pedidos", "Precios y ofertas" y "Finanzas".
- **FR-008**: El sistema DEBE bloquear el acceso directo a cualquier sección no autorizada para el rol activo y mostrar un mensaje de permisos insuficientes.
- **FR-009**: El sistema DEBE actualizar inmediatamente las opciones del menú de Administración cuando cambie el rol activo.
- **FR-010**: El sistema DEBE reflejar en el panel los cambios de estado y las eliminaciones de pedidos cuando la vista se actualice.
- **FR-011**: El sistema DEBE conservar el mecanismo de acceso mediante código existente antes de desplegar el menú de Administración.

### Key Entities *(include if feature involves data)*

- **[Indicador]**: Representa una métrica mostrada en el panel. Atributos clave: nombre, valor, unidad, período consultado y fecha de cálculo.
- **[Pedido]**: Representa la transacción comercial registrada y constituye la fuente de verdad de los indicadores. Atributos clave: identificador, fecha, cliente, ítems, monto total y estado.
- **[Rol]**: Representa el perfil activo del usuario y determina las secciones disponibles. Atributos clave: nombre, descripción y conjunto de secciones permitidas.
- **[Sección de administración]**: Representa cada opción desglosada del botón de Administración. Atributos clave: nombre, ruta de navegación y roles autorizados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario autorizado localiza el indicador de ingresos totales en menos de 10 segundos desde que abre el panel.
- **SC-002**: Las cifras del panel coinciden con el 100 % de los pedidos registrados en el rango seleccionado, sin discrepancias.
- **SC-003**: Al menos el 95 % de los usuarios de prueba identifica correctamente las secciones disponibles para su rol sin ayuda.
- **SC-004**: El 100 % de los intentos de acceso a secciones no autorizadas es bloqueado y muestra un mensaje comprensible.
- **SC-005**: El panel muestra todos sus indicadores en menos de 2 segundos con hasta 1.000 pedidos registrados.
- **SC-006**: Tras cambiar el rol activo, las opciones del menú de Administración se actualizan en menos de 1 segundo.

## Assumptions

- Se reutiliza el mecanismo existente de autenticación y selección de roles; esta versión no crea un sistema de cuentas nuevo.
- El "dueño de la empresa" corresponde al perfil con máximos permisos ya disponible (Administración) y el "vendedor" al perfil de Ventas.
- Los pedidos registrados son la única fuente de las métricas; no se integran sistemas contables externos en esta versión.
- Las métricas consideran pedidos confirmados; los carritos abandonados y las cotizaciones no se contabilizan.
- El botón de Administración continúa solicitando el código de acceso vigente antes de desplegar el menú por rol.
- El desglose se limita a la navegación y al control de acceso; no incluye crear vistas nuevas de inventario ni de facturación electrónica.
- Se conservan la terminología, los colores y los patrones de interfaz actuales del módulo de ventas.
