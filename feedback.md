Feedback Avance 01 (26/10/26)

- buen avance, pero la descripcion (resumen) en el plan esta incompleta
- README incompleto

Proximos pasos:
 
- rectificar puntos anteriores 
- trabajar en los specs (historias de usuario, US) para definir tareas
- dividirse las US y tareas para una siguiente iteracion (avances cada semana)
- ejecutar una version integrada de prueba

Feedback Avance 02 (2/11/26)

- Se insiste en el manejo de los specs (revisar video). Cada carpeta debe tener toda la estructura base (y editar sobre ella).
- no se observan historias de usuario por miembro del grupo (solo actividad de 1 persona)
- Evitar trabajar con modelos de IA fuera de speckit en local, porque crean ramas nuevas y se pierde la integridad del proyecto

Proximos pasos:

- rectificar puntos anteriores y crear tareas a partir de los specs
- hacer primera implmentacion, registar modificaciones/incremental y volver al spec
- dividir el grupo entre modificaciones (ajustes previos) e incremental (nueva funcionalidad)
- integrar nueva version en 2 semanas

Feedback Avance 03 (16/11/26)

Cambios en la especificación:

- spec.md reescribió las US1-US5 para la tienda online y agregó US6 (historial) y US7 (administración de precios y ofertas). tasks.md es nuevo y sigue T001-T068 con las US1-US7, bien trazado.
- spec.md quedó incoherente: conserva el propósito, las XR-001..005 y las entidades del módulo base ERP. Los títulos mezclan "Historial de usuario" con "Historia de Usuario" y "Priority" con "Prioridad". El estado sigue en "Borrador".

Consistencia sitio-especificación:

- US7 escenarios 7-9 piden código de acceso "1234", pero T054 (marcada [X]) implementa un guardia por rol. index.html tiene un selector de rol y no hay solicitud de código (admin-panel.js no se incluyó: no verificable).
- US4 pide restablecer el total al refrescar, pero el cupón queda guardado en el carrito (storage.js, setCartCoupon).

Proximos pasos:

- decidir entre código "1234" o rol y actualizar spec.md o T054
- limpiar spec.md: quitar texto ERP base, unificar títulos y actualizar el estado
- aclarar el comportamiento del cupón al refrescar (US4)
- hacer mejoras de funcionalidad e interfaz de usuario, incluir data simulada para probar campos, incluir mejoras de estilo, transicion, navegacion, etcetera.

Presentacion de MVP final en 2 semanas.
