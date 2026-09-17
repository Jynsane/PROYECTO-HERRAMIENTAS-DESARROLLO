<div align="center">

# 🧁 SUPKEIKS — Pastelería Fina & Repostería Artesanal
**Plataforma Web E-Commerce Boutique & Sistema de Gestión de Pedidos**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![UTP](https://img.shields.io/badge/UTP-Ciclo_8-red?style=for-the-badge)](https://www.utp.edu.pe/)
[![Status](https://img.shields.io/badge/Avance-1.0_Completado-success?style=for-the-badge)]()

<br>


### 🎬 Vista Previa del Proyecto en Funcionamiento


https://github.com/user-attachments/assets/e5589ec7-cefa-40cc-aa86-694f3e618a7e


---

</div>

## 📌 Tabla de Contenidos
1. [¿Qué hace el proyecto?](#-1-qué-hace-el-proyecto)
2. [¿Por qué el proyecto es útil?](#-2-por-qué-el-proyecto-es-útil)
3. [¿Cómo comenzar con el proyecto?](#-3-cómo-comenzar-con-el-proyecto)
4. [Estructura del Proyecto y Tecnologías](#-4-estructura-del-proyecto-y-tecnologías)
5. [¿Dónde pueden recibir ayuda los usuarios?](#-5-dónde-pueden-recibir-ayuda-los-usuarios)
6. [Equipo de Desarrollo y Contribuidores](#-6-equipo-de-desarrollo-y-contribuidores)
7. [GitHub Gists Destacados](#-7-github-gists-destacados)

---

## 🚀 1. ¿Qué hace el proyecto?

**SUPKEIKS** es una aplicación web interactiva diseñada para una pastelería boutique limeña de alta gama. Proporciona una experiencia de compra fluida y visualmente atractiva donde los clientes pueden explorar postres artesanales, filtrar productos, calcular ofertas y armar pedidos consolidados en tiempo real.

### ✨ Funcionalidades Principales:
* **Carrusel Interactivo (Hero Slider):** Slider cinematográfico a pantalla completa con autoplay, barra de progreso sincronizada, pausa al colocar el cursor y transiciones suaves.
* **Catálogo Dinámico con Búsqueda & Filtros:** Filtrado instantáneo por categorías (*Tortas, Cupcakes, Cheesecakes & Mousses, Tartas & Pies, Porciones*) y barra de búsqueda en tiempo real por ingredientes o nombres.
* **Módulo de Ofertas de Temporada:** Visualización dinámica de promociones con cálculo automático de porcentajes de descuento (`-15%`, `-20%`, `-30% OFF`), precios tachados y botón para alternar promociones en vivo.
* **Próximos Lanzamientos:** Sección de novedades y productos en fase de prueba con etiquetas informativas y botón de notificación previa por WhatsApp.
* **Carrito de Compras Persistente (Drawer Lateral):**
  * Contador dinámico en la barra superior.
  * Almacenamiento local mediante `localStorage` para no perder la selección al navegar.
  * Controles interactivos para aumentar (`+`), reducir (`-`) o eliminar ítems.
  * Cálculo del total en soles (`S/.`).
  * **Checkout con WhatsApp API:** Genera automáticamente un mensaje estructurado y listo para enviar con el detalle del pedido.
* **Página de Contacto y Cotizaciones:** Formulario boutique con validación de datos, selector de motivo, confirmación interactiva y tarjetas de canales oficiales (delivery, horarios y métodos de pago).
* **Diseño 100% Responsivo:** Adaptación completa a dispositivos móviles mediante menú hamburguesa y navegación táctil accesible.

---

## 💡 2. ¿Por qué el proyecto es útil?

El comercio digital para negocios gastronómicos y reposterías artesanales suele enfrentarse a dos problemas comunes: plataformas lentas y pasarelas de pago complejas que provocan el abandono de pedidos por parte del cliente.

**SUPKEIKS resuelve esto ofreciendo:**
* **Cero Fricción en el Checkout:** Conecta directamente la canasta de compras con la API de **WhatsApp Business**, permitiendo una atención personalizada e inmediata sin requerir registros pesados de usuarios.
* **Diseño Visual Boutique de Alta Conversión:** Utiliza una paleta cromática refinada (*espresso, caramelo/oro y crema vainilla*), tipografía editorial (*Playfair Display*) y micro-animaciones que destacan la calidad artesanal de cada producto.
* **Rendimiento Ultraligero:** Construido en **Vanilla JavaScript** y **CSS nativo**, sin dependencias ni librerías pesadas, garantizando tiempos de carga casi instantáneos en cualquier conexión móvil.
* **Gestión Local Flexible:** Permite persistir el estado del catálogo y el carrito sin depender de un backend complejo en esta primera fase.

---

## 💻 3. ¿Cómo comenzar con el proyecto?

### Prerrequisitos
No requiere Node.js, gestores de paquetes ni configuraciones de compilación. Solo necesitas:
* Un navegador web moderno (Google Chrome, Microsoft Edge, Brave, Mozilla Firefox).
* Un editor de código como **VS Code** (opcional, si deseas revisar el código).

### Paso a paso para ejecutarlo localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Jynsane/PROYECTO-HERRAMIENTAS-DESARROLLO.git
   ```

2. **Ingresar a la carpeta del proyecto:**
   ```bash
   cd PROYECTO-HERRAMIENTAS-DESARROLLO
   ```

3. **Abrir la aplicación:**
   * **Opción A (Fácil):** Haz doble clic en el archivo `index.html` para abrirlo directamente en tu navegador.
   * **Opción B (Recomendada con Live Server):** Abre la carpeta en VS Code, haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

---

## 📁 4. Estructura del Proyecto y Tecnologías

```text
PROYECTO-HERRAMIENTAS-DESARROLLO/
├── index.html              # Página de Inicio: Hero Slider, Especialidades y Sobre Nosotros
├── Catalogo.html           # Catálogo Completo con Filtros y Buscador en Vivo
├── Ofertas_Catalogo.html   # Carta con Descuentos Dinámicos y Precios Especiales
├── Proximos_Agregados.html # Vista Exclusiva de Nuevas Recetas y Próximos Lanzamientos
├── Contacto.html           # Centro de Atención, Formulario y Canales Oficiales
├── styles.css              # Hoja de Estilos Global: Variables, Diseño Boutique y Responsive
├── script.js               # Lógica en JS: Slider, Filtros, Carrito, LocalStorage y WhatsApp
└── README.md               # Documentación General del Proyecto
```

### 🛠️ Stack Tecnológico:
* **HTML5:** Semántica estricta (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) y optimización SEO con metadatos OpenGraph y favicon SVG.
* **CSS3 Moderno:** Custom Properties (variables), Flexbox, CSS Grid, Glassmorphism, transiciones fluidas y animaciones con `@keyframes`.
* **JavaScript (ES6+):** Programación funcional y modular, manipulación del DOM, eventos táctiles/teclado, API de `localStorage` e integración con la API pública de WhatsApp (`https://wa.me/`).

---

## 📞 5. ¿Dónde pueden recibir ayuda los usuarios?

Si tienes consultas sobre el código, deseas reportar una incidencia o realizar un pedido en la pastelería:

* **WhatsApp Directo:** [+51 984 110 884](https://wa.me/51984110884)
* **Página de Contacto:** [Formulario Web de Consultas](Contacto.html)
* **Reporte de Problemas / Bugs:** Puedes abrir un issue directamente en la pestaña [Issues](https://github.com/Jynsane/PROYECTO-HERRAMIENTAS-DESARROLLO/issues) de este repositorio.
* **Horario de Atención:** Lunes a Sábado: 9:00 AM – 8:00 PM (Lima, Perú).

---

## 👥 6. Equipo de Desarrollo y Contribuidores

Proyecto desarrollado para el curso de **Herramientas de Desarrollo** — **Universidad Tecnológica del Perú (UTP)**:

| Contribuidor | Rol / Responsabilidad Principal | Rama Principal |
| :--- | :--- | :--- |
| **Jair Adrian Garcia Callupe** ([@Jynsane](https://github.com/Jynsane)) | Carrito de compras, filtros de catálogo, unificación responsive e integración WhatsApp | `dev-jair` |
| **Adrian Altuna** | Sección Nosotros, historia, estadísticas y valores de marca | `dev-adrian` |
| **See Ahn Kaarlo Polo Sanchez** | Vistas de Catálogo base, ofertas y próximos agregados | `dev-see` |
|**Miguel Angel Nolasco Bautista** ([@Klivers](https://github.com/Klivers)) | Estructura base de contacto, canales de atención y validación de campos | `dev-klivers` |

---

## 📌 7. GitHub Gists Destacados

Fragmentos modulares de código documentados y publicados para revisión académica:

1. 🛒 [**Módulo de Carrito de Compras & Checkout WhatsApp en JAVASCRIPT**](https://gist.github.com/Jynsane/5c8e6f5ac08e92b03fabc8c421e06cfb)
2. 📖 [**Catalogo de productos en HTML**](https://gist.github.com/Seeth77/370a18e9e54732dcfaf08b0e815b2a20)
3. 📚 [**Proximos agregados en el catalogo en HTML**](https://gist.github.com/Seeth77/b53caa15356503071c7dfc4e9abbf4d5)
4. 🔍 [**Sistema de Búsqueda y Filtrado Reactivo por Categorías en JAVASCRIPT**](https://gist.github.com/Jynsane/55f05d7e697485d1ed48a0fc00edfc96)
5. 📲 [**Generador de Enlace WhatsApp para Pedidos en JAVASCRIPT**](https://gist.github.com/Klivers/a33cbd82454ec44981e70040dff430a0)
6. ✉️ [**Validación de Formulario de Contacto en JAVASCRIPT**](https://gist.github.com/Klivers/e1077c5e66c9c0e0dccfb9e73e4c531d)
  6. ✉️ [**Tarjeta de valor reutilizable - seccion Nosotros, proyecto SUPKEIKS**](https://gist.github.com/adrianaltuna8/04f270cda016ca2208219cb20c46df46)
<div align="center">
  <p>&copy; 2026 SUPKEIKS Pastelería Boutique. Proyecto Académico UTP — Todos los derechos reservados.</p>
</div>
