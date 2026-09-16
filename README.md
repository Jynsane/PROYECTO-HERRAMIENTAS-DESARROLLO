## Registro de Cambios e implementaciones:

### 1. Unificación y Barra de Navegación (`Header`)
- **Menú:** Se eliminaron los accesos independientes y redundantes de *"Ofertas"* y *"Próximos"* en la barra superior.
- **Implementación de Menú Desplegable (Dropdown):** Se agrupó la navegación de productos bajo una única pestaña interactiva `Catálogo ▾`, que despliega:
  - **Ver Todo el Catálogo** (`Catalogo.html`)
  - **Ofertas Especiales** (`Ofertas_Catalogo.html`)
  - **Próximos Lanzamientos** (`Proximos_Agregados.html`)
  -Se mantuvo intacta la barra de navegación global (`Inicio`, `Catálogo ▾`, `Especialidades`, `Nosotros`, `Contacto`) en todos los archivos HTML (`index.html`, `Catalogo.html`, `Ofertas_Catalogo.html` y `Proximos_Agregados.html`).

---

### 2. Creación de Vistas

#### Catálogo General (`Catalogo.html`)
- Despliegue en cuadrícula responsiva (`features-grid`) de la carta principal de productos.
- Tarjetas de producto (`product-card`)  imagen, título, descripción y precio en soles (`S/.`).
- Botón interactivo de compra rápida vinculado a la API de WhatsApp con mensaje parametrizado por producto.

#### Ofertas Especiales (`Ofertas_Catalogo.html`)
- Presentación visual con descuento (`-10%`, `-20%`, `-30% OFF`).
- Visualización de precio regular tachado y precio con descuento aplicado.
- Botón en cabecera **"🎲 Nuevas Ofertas"** para recalcular y alternar promociones en tiempo real.

#### Próximos Lanzamientos (`Proximos_Agregados.html`)
- Vista exclusiva para nuevos productos en desarrollo que aún no forman parte de la carta habitual.
- Badges informativos de estado (`Lanzamiento: Próxima Semana`, `Línea Saludable`, `Edición Especial`).
- Botón **"Notificarme 🔔"** configurado para consultar disponibilidad previa mediante WhatsApp.

---

### 3. JavaScript (`script.js`)
- **Separación de datos:**
  - `defaultCatalog`: Colección principal de 12 postres y pasteles disponibles en tienda.
  - `defaultUpcoming`: Colección independiente de 8 productos futuros en fase de lanzamiento.
- **Renderizado condicional:** Modularización de funciones de render para pintar de forma aislada y dinámica el catálogo, las ofertas y los próximos productos según el contenedor presente en la vista.
- **Cálculo automatizado de descuentos:** Generación algorítmica de porcentajes de descuento y precios calculados en la vista de ofertas.

---

### 4. Estilos y Mejoras Visuales (`styles.css`)
- Estilos dedicados para el menú desplegable accesible con transiciones suaves en `:hover`.
- Contenedores de imágenes estandarizados (`object-fit: cover`) con efectos de zoom sutil.
- Paleta cromática boutique (tonos café oscuro, acentos en oro viejo/caramelo y contrastes claros).
- Diseño totalmente adaptable a pantallas de escritorio y dispositivos móviles.

### Vista de Contacto (Contacto.html)
* **Canales de atención:** Incorporación de tarjetas de horarios y teléfonos de atención.
* **Formulario interactivo:** Captura y validación de consultas para clientes.
* **Navegación:** Enlaces de retorno directo al Inicio y al Catálogo general.

### Especialidades y Nosotros (index.html)
* **Sección Especialidades:** Bloque con las categorías principales de productos (tortas, cupcakes, cheesecakes, tartas y brownies), cada una con imagen, descripción breve y enlace directo al catálogo.
* **Franja de confianza:** Íconos informativos sobre delivery en Lima, reservas para eventos y el origen peruano de la pastelería.
* **Sección Nosotros:** Historia de la marca, estadísticas (años de experiencia, pedidos entregados) y tarjetas con los valores de la pastelería.
* **Estilos:** Nuevos componentes reutilizables (`product-card`, `about-grid`, `values-grid`) con efectos hover y ajustes responsive para móvil.

---

### 5. Carrito de Compras & Checkout WhatsApp
* **Drawer lateral interactivo:** Canasta desplegable con animación suave y cierre por overlay o teclado (Escape).
* **Gestión de ítems:** Añadir productos desde el catálogo y las ofertas, modificar cantidades y eliminar ítems.
* **Persistencia en cliente:** Almacenamiento local mediante `localStorage` para conservar la selección entre páginas.
* **Pedido consolidado:** Generación automática de mensaje parametrizado con lista numerada, subtotales y precio total calculado hacia WhatsApp.

---

### 6. Sistema de Búsqueda y Filtros en Catálogo
* **Filtros por categoría:** Navegación por chips dinámicos (*Todos, Tortas, Cupcakes, Cheesecakes & Mousses, Tartas & Pies, Porciones*).
* **Búsqueda en tiempo real:** Filtrado instantáneo por nombre y descripción de ingredientes con botón de reseteo.

