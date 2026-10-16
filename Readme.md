# Módulo ERP de Ventas — Grupo 21 (Modelación de Sistemas 2026-2)

Repositorio oficial del **Grupo 21** para la asignatura **580211-1 Modelación de Sistemas (2026-2)** del Departamento de Ingeniería Industrial, Facultad de Ingeniería, **Universidad de Concepción**.

- **Profesores**: Sebastián Astroza (`sastroza@udec.cl`), Juan Carlos Caro (`juancaros@udec.cl`), Pablo Catalán (`pacatala@udec.cl`)
- **Ayudantes**: Matías Arriagada, Isidora Rivera, Daniela Vidal
- **Módulo Asignado**: **Área de Ventas (Sales & Order-to-Cash ERP Module)**
- **Metodología**: Spec-Driven Development (SDD) mediante **GitHub Spec Kit**
- **Estado Actual**: **Avance 1 — Revisión de Repositorio (Semana del 20 de Octubre / Cierre de edición: Jueves 22 de Octubre a las 15:00 hrs)**

## 1. Cumplimiento de los Requisitos de la Revisión de Avance (Octubre 2026)

En conformidad con las instrucciones del curso y el comunicado oficial para la primera revisión de repositorio:

> *"Deben tener: (1) Modelo Entidad-Relación describiendo su estructura de datos y compatibilidad con la estructura base, (2) archivo de plan de trabajo (`plan.md`) que describa su módulo en específico. Se evaluará en base a la rúbrica, tanto la completitud como complejidad de la herramienta propuesta."*

Nuestro repositorio estructura y entrega de forma completa ambos ejes centrales, alineados punto por punto con la **Rúbrica de Evaluación**:

| Requisito de la Revisión / Criterio de la Rúbrica | Archivo Principal en el Repositorio | Cómo se Cumple con Máxima Completitud y Complejidad |
| :--- | :--- | :--- |
| **(1) Modelo Entidad-Relación (MER) y compatibilidad con la estructura base** | `specs/001-modulo-ventas/data-model.md`<br>`specs/001-modulo-ventas/mer_ventas_erp.png` | • Diagrama MER visual en PNG de alta resolución y en código `Mermaid.js`.<br>• **Doble matriz de compatibilidad**: mapea explícitamente las tablas y llaves primarias (`PK`/`FK`) con el esquema comercial de la **Diapositiva 6** (`Customer`, `Product`, `Shop`, `Vendor`, `Sales`) y con el esquema relacional extendido de la **Diapositiva 7** (`tblCATEGORIES`, `tblSTATUS`, `tblCONTACTS`, `tblCALENDAR.invoice_id`).<br>• Diccionario de las 10 tablas en 3FN y reglas de integridad en `localStorage`. |
| **(2) Plan de Trabajo (`plan.md`) describiendo el módulo de Ventas en específico** | `specs/001-modulo-ventas/plan.md` | • **Problema y Solución**: diagnóstico de las 4 fallas críticas en ventas y arquitectura de la herramienta propuesta.<br>• **Complejidad de la herramienta**: ciclo completo *Preventa → POS/Orden de Venta con control de stock y descuentos → Facturación/Crédito/Notas de Crédito → Cartera 360° → Comisiones y Proyección de Demanda (WMA-3 y Regresión Lineal OLS)*.<br>• **Hoja de ruta SDD**: cronograma detallado desde el cierre del MER/Plan (22/10) hacia la consolidación de `spec.md`, `tasks.md` e implementación (30/11). |
| **Manejo de Historias de Usuario asociadas a decisiones metodológicas y de BD** | `specs/001-modulo-ventas/data-model.md` (Secc. 4)<br>`specs/001-modulo-ventas/plan.md` (Secc. 3)<br>`specs/001-modulo-ventas/spec.md` | • Define las 5 Historias de Usuario épicas (`HU-01` a `HU-05`) vinculando cada una con las tablas que utiliza y la justificación metodológica de su diseño de base de datos. |
| **Descripción de potenciales usuarios, manejo de riesgos de datos y sesgos** | `specs/001-modulo-ventas/plan.md` (Secc. 5)<br>`specs/001-modulo-ventas/spec.md` (Secc. 5) | • Perfiles de usuario (`JUNIOR`, `SENIOR`, `SUPERVISOR` y usuarios de Inventario/Contabilidad).<br>• Protección de datos sensibles (enmascaramiento de PII en `tblCUSTOMERS` y ocultamiento de `unit_cost` y comisiones por rol).<br>• Mitigación de 4 sesgos: **sesgo de supervivencia** (`rejection_reason = 'SIN_STOCK'` en `tblQUOTES`), **sesgo de evaluación de vendedores** (Índice compuesto $IDV$), **sesgo de valores atípicos** (filtro $\pm 2\sigma$ en regresión OLS) y **sesgo de descuentos discrecionales**. |
| **Formato general, referencias bibliográficas y Política de Uso de IA** | Todos los archivos `.md`<br>`README.md` (Secc. 6 y 7) | • Formato estandarizado, tablas estructuradas, ecuaciones en notación matemática, referencias bibliográficas formales en todos los documentos y **Anexo obligatorio de Uso de IA**. |

## 2. Mapa de Navegación del Repositorio `Grupo-21`

| Archivo | Ruta en el Repositorio | Rol dentro de SpecKit | Estado para la Revisión de Octubre |
| :--- | :--- | :--- | :--- |
| **`data-model.md`** | `/specs/001-modulo-ventas/data-model.md` | **Entregable Central (1)**: Estructura de datos, MER, compatibilidad con estructura base y justificación de BD por Historia de Usuario. | **100% Completo** |
| **`mer_ventas_erp.png`** | `/specs/001-modulo-ventas/mer_ventas_erp.png` | **Entregable Central (1 - Visual)**: Imagen del Modelo Entidad-Relación de las 10 tablas del módulo. | **100% Completo** |
| **`plan.md`** | `/specs/001-modulo-ventas/plan.md` | **Entregable Central (2)**: Descripción específica del módulo de Ventas, problema/solución, complejidad técnica, usuarios/riesgos/sesgos y plan de trabajo. | **100% Completo** |
| **`README.md`** | `/README.md` | Guía general del repositorio, resumen ejecutivo, bitácora de decisiones (*ADRs*) y **Anexo de Política de Uso de IA**. | **100% Completo** |
| **`constitution.md`** | `/.specify/memory/constitution.md` | Principios rectores de ingeniería, interoperabilidad ERP y ética de datos en SpecKit. | **100% Completo** |
| **`spec.md`** | `/specs/001-modulo-ventas/spec.md` | Boceto preliminar de especificaciones funcionales y criterios *Given/When/Then* derivado del MER y Plan. | **Boceto Preliminar (Se consolida en Etapa 2)** |
| **`tasks.md`** | `/specs/001-modulo-ventas/tasks.md` | Boceto preliminar de desglose de tareas e Issues de GitHub derivado del Plan de Trabajo. | **Boceto Preliminar (Se consolida en Etapa 3)** |

## 3. Resumen Ejecutivo del Modelo Entidad-Relación (10 Tablas)

El modelo de datos preserva todos los atributos originales del taller y se divide en **5 tablas maestras compartidas** con los demás módulos del ERP y **5 tablas operativas y analíticas propias** del Área de Ventas:

- **Tablas Compartidas (`erp_shared_*`)**:
  1. `tblCUSTOMERS` (`customer_id` PK): Maestro de clientes (`customer_number`, `name`, `phone_number`, `address`, `contact_email`, `segment_type`, `credit_limit`, `current_balance`, `status_id`).
  2. `tblPRODUCTS` (`product_id` PK, `category_id` FK1, `shop_id` FK2): Catálogo de productos y servicios (`product_name`, `type`, `manufacturer`, `unit_cost`, `price`, `stock_available`, `min_stock_alert`).
  3. `tblCATEGORIES` (`category_id` PK): Clasificación estándar (`category_name`, `category_description`, `category_type`).
  4. `tblSHOPS` (`shop_id` PK): Sucursales y canales comerciales (`name`, `channel_type`, `address`, `region_zone`).
  5. `tblVENDORS` (`vendor_id` PK, `shop_id` FK1): Personal de ventas (`staff_number`, `name`, `role_level`, `commission_rate`, `max_discount_pct`, `active_flag`).
- **Tablas Propias del Módulo de Ventas (`erp_sales_*`)**:
  6. `tblQUOTES` (`quote_id` PK, `customer_id` FK1, `vendor_id` FK2, `shop_id` FK3): Cotizaciones de preventa y registro de causas de rechazo (`rejection_reason`).
  7. `tblSALES` (`sale_id` PK, `quote_id` FK1 nullable, `customer_id` FK2, `vendor_id` FK3, `shop_id` FK4): Cabecera de órdenes de venta (`date`, `sale_channel`, `subtotal_net`, `discount_amount`, `tax_iva`, `sum_total`, `order_status`).
  8. `tblSALES_ITEMS` (`sale_item_id` PK, `sale_id` FK1, `product_id` FK2): Líneas de detalle por orden con cantidad, descuento y precio unitario histórico congelado (`unit_price_applied`).
  9. `tblINVOICES` (`invoice_id` PK — compatible con `tblCALENDAR.invoice_id` del taller —, `sale_id` FK1, `customer_id` FK2): Documentos tributarios (`BOLETA`, `FACTURA_AFECTA`, `NOTA_CREDITO`), vencimiento y estado de cobro.
  10. `tblVENDOR_TARGETS` (`target_id` PK, `vendor_id` FK1, `shop_id` FK2): Metas mensuales, logro acumulado, comisiones y KPI de conversión.

## 4. Instrucciones de Uso con SpecKit y Ejecución

1. Clonar el repositorio `Grupo-21` y abrirlo en **Visual Studio Code**.
2. Revisar los documentos centrales de este avance en `specs/001-modulo-ventas/data-model.md`, `specs/001-modulo-ventas/mer_ventas_erp.png` y `specs/001-modulo-ventas/plan.md`.
3. Tras la revisión de avance de esta semana, el equipo ejecutará secuencialmente los comandos de `.opencode/commands/`:
   - `/speckit.specify` y `/speckit.clarify` (del 23 al 28 de octubre) para cerrar `spec.md`.
   - `/speckit.tasks` y `/speckit.taskstoissues` (del 29 de octubre al 03 de noviembre) para cerrar `tasks.md` y abrir los Issues en GitHub.
   - `/speckit.implement` y `/speckit.analyze` (del 04 al 23 de noviembre) para construir el código frontend en `/src` y las pruebas en `/tests`.

## 5. Registro de Toma de Decisiones del Equipo (Decision Log / ADRs)

| Fecha | ID Decisión | Aspecto Evaluado | Acuerdo del Grupo 21 | Justificación Técnica y Metodológica |
| :--- | :--- | :--- | :--- | :--- |
| **14/10/2026** | **ADR-01** | Abstracción de industria | Diseñar un módulo de Ventas agnóstico al rubro, parametrizable para productos físicos, insumos o servicios. | Cumple la recomendación de la diapositiva 5 del taller y maximiza la escalabilidad del ERP. |
| **15/10/2026** | **ADR-02** | Compatibilidad con las estructuras base de las diapositivas 6 y 7 | Mantener intactos los atributos de `Customer`, `Product`, `Shop`, `Vendor`, `Sales` y `tblCATEGORIES`, e incluir `invoice_id` (`tblINVOICES`) y `status_id` para enlazar con `tblCALENDAR` y `tblSTATUS`. | Garantiza interoperabilidad inmediata con cualquier otro módulo del curso sin colisión de llaves primarias. |
| **15/10/2026** | **ADR-03** | Complejidad analítica y mitigación de sesgos | Integrar Media Móvil Ponderada corregida por quiebres de stock (WMA-3), Regresión Lineal OLS con filtro de atípicos ($\pm 2\sigma$) e Índice compuesto de evaluación de vendedores ($IDV$). | Eleva la complejidad técnica de la herramienta propuesta y resuelve los sesgos de supervivencia, de valores extremos y de tamaño de cartera. |
| **16/10/2026** | **ADR-04** | Enfoque de la primera entrega de repositorio | Consolidar al 100% `data-model.md` (+ `mer_ventas_erp.png`) y `plan.md` cubriendo todos los ítems de la rúbrica, dejando `spec.md` y `tasks.md` como bocetos listos para la siguiente fase. | Se alinea exactamente con la pauta y el correo del curso para la revisión de avance. |

## 6. Anexo Obligatorio: Política de Uso de Inteligencia Artificial Generativa

En cumplimiento de la **Política de Uso de IA** del curso (*"fuera de los comandos de SpecKit, deben incluir modelos utilizados, objetivo, fecha y prompts como anexo a su trabajo"*, diapositiva 13 de `MDS_SDD_taller.pdf`), se detalla el registro completo de consultas:

| Fecha | Modelo Utilizado | Objetivo de la Consulta | Prompt Utilizado | Resultado Validado e Incorporado por el Equipo |
| :--- | :--- | :--- | :--- | :--- |
| **16/10/2026** | **Gemini (Google AI)** | Analizar los documentos `MDS_SDD_taller.pdf` y `Trabajo MDS(1).pdf` para estructurar la primera entrega del módulo de Ventas. | *"Teniendo en cuenta la información de los pdf haz el trabajo para la entrega del 20 de octubre para el área de ventas de una empresa cualquiera, sin enfocarte en una en especifico."* | Identificación de requisitos, estructura de archivos SpecKit y alcance funcional del área de ventas. |
| **16/10/2026** | **Gemini (Google AI)** | Generar los archivos Markdown de SpecKit para el repositorio `Grupo-21` y el diagrama gráfico del Modelo Entidad-Relación. | *"Haz los archivos listos para subir a GitHub. para el alcance del MVP que se enfoque un poco en todo."* | Diseño del MER de 10 tablas (`data-model.md` y `mer_ventas_erp.png`), principios en `constitution.md` y documentación inicial. |
| **16/10/2026** | **Gemini (Google AI)** | Enfocar la entrega en el Modelo Entidad-Relación y en el Plan de Trabajo previo a la consolidación de los specs y tareas. | *"Quiero que consideres que el foco del trabjo será el de entidad -relación y el plan de trabajo para luego crear los specs y las tareas"* | Reestructuración metodológica priorizando el cierre del MER y del Plan de Trabajo en la Etapa 1 y secuenciando los specs y tareas en las Etapas 2 y 3. |
| **16/10/2026** | **Gemini (Google AI)** | Verificar y reforzar el cumplimiento de las instrucciones del correo oficial del curso respecto de `data-model.md`, `plan.md` y la rúbrica de evaluación. | *"Cumple con lo que pide el correo??"* (Adjuntando captura del anuncio del curso `580211-1 MODELACION DE SISTEMAS`). | Incorporación del mapeo explícito con las diapositivas 6 y 7 en `data-model.md` y consolidación autocontenida de todos los criterios de la rúbrica dentro de `plan.md`. |

## 7. Referencias Bibliográficas

1. **Microsoft Developer Blog** (2025). *Spec-Driven Development: AI-Native Engineering*. [https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/](https://www.google.com/search?q=https%3A%2F%2Fdeveloper.microsoft.com%2Fblog%2Fspec-driven-development-ai-native-engineering%2F)
2. **GitHub Open Source** (2025). *Spec Kit — Spec-Driven Development Toolkit*. [https://github.com/github/spec-kit](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2Fgithub%2Fspec-kit)
3. **Elmasri, R., & Navathe, S. B.** (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.
4. **Monk, E., & Wagner, B.** (2013). *Concepts in Enterprise Resource Planning* (4th ed.). Cengage Learning.
5. **Caro, J. C., Astroza, S., & Catalán, P.** (2026). *Material de cátedra y Pauta de Trabajo Grupal: Modelación de Sistemas (580211-1)*. Departamento de Ingeniería Industrial, Universidad de Concepción.
