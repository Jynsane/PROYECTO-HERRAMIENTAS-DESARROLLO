## Registro de Cambios y Nuevas Implementaciones

En esta actualización se llevó a cabo una reestructuración integral de la navegación, la estandarización de las vistas de productos y la optimización de la experiencia de usuario (UX/UI).

### 1. Unificación y Limpieza de la Barra de Navegación (`Header`)
- **Consolidación del menú:** Se eliminaron los accesos independientes y redundantes de *"Ofertas"* y *"Próximos"* en la barra superior.
- **Implementación de Menú Desplegable (Dropdown):** Se agrupó la navegación de productos bajo una única pestaña interactiva `Catálogo ▾`, que despliega:
  - **Ver Todo el Catálogo** (`Catalogo.html`)
  - **Ofertas Especiales** (`Ofertas_Catalogo.html`)
  - **Próximos Lanzamientos** (`Proximos_Agregados.html`)
- **Consistencia multiplataforma:** Se mantuvo intacta la barra de navegación global (`Inicio`, `Catálogo ▾`, `Especialidades`, `Nosotros`, `Contacto`) en todos los archivos HTML (`index.html`, `Catalogo.html`, `Ofertas_Catalogo.html` y `Proximos_Agregados.html`).

---

### 2. Creación y Estandarización de Vistas

#### Catálogo General (`Catalogo.html`)
- Despliegue en cuadrícula responsiva (`features-grid`) de la carta principal de productos.
- Tarjetas de producto (`product-card`) homogéneas con imagen, título, descripción y precio regular en soles (`S/.`).
- Botón interactivo de compra rápida vinculado a la API de WhatsApp con mensaje parametrizado por producto.

#### Ofertas Especiales (`Ofertas_Catalogo.html`)
- Presentación visual con badges destacados de descuento (`-10%`, `-20%`, `-30% OFF`).
- Visualización de doble precio (precio regular tachado y precio con descuento aplicado).
- Botón en cabecera **"🎲 Nuevas Ofertas"** para recalcular y alternar promociones en tiempo real.

#### Próximos Lanzamientos (`Proximos_Agregados.html`)
- Vista exclusiva para nuevos productos en desarrollo que aún no forman parte de la carta habitual (Macarons finos, líneas saludables Keto/Gluten Free, tartas de autor, entre otros).
- Badges informativos de estado (`Lanzamiento: Próxima Semana`, `Línea Saludable`, `Edición Especial`).
- Botón **"Notificarme 🔔"** configurado para consultar disponibilidad previa mediante WhatsApp.

---

### 3. Lógica Dinámica en JavaScript (`script.js`)
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
