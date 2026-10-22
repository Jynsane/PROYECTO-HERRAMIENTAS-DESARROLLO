<div align="center">

# 🔧 FerreMax — Ferretería y Construcción
**Catálogo web de herramientas y materiales con consulta de productos**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![UTP](https://img.shields.io/badge/UTP-Ciclo_8-red?style=for-the-badge)](https://www.utp.edu.pe/)
[![Status](https://img.shields.io/badge/Avance-1.0_Completado-success?style=for-the-badge)]()

<br>


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

**FerreMax** es una aplicación web interactiva para una ferretería. Permite explorar herramientas y materiales de construcción, filtrar productos, consultar ofertas y preparar una lista de productos para cotizar por WhatsApp.

### ✨ Funcionalidades Principales:
* **Carrusel Interactivo (Hero Slider):** Slider cinematográfico a pantalla completa con autoplay, barra de progreso sincronizada, pausa al colocar el cursor y transiciones suaves.
* **Catálogo Dinámico con Búsqueda & Filtros:** Filtrado instantáneo por categorías (*Herramientas, Construcción, Electricidad, Plomería, Pintura y Seguridad*) y barra de búsqueda por nombre o descripción.
* **Módulo de Ofertas:** Visualización dinámica de promociones con cálculo automático de descuentos, precios tachados y botón para generar nuevas combinaciones.
* **Próximos Productos:** Sección de herramientas y suministros que pronto estarán disponibles, con consulta por WhatsApp.
* **Carrito de Compras Persistente (Drawer Lateral):**
  * Contador dinámico en la barra superior.
  * Almacenamiento local mediante `localStorage` para no perder la selección al navegar.
  * Controles interactivos para aumentar (`+`), reducir (`-`) o eliminar ítems.
  * Cálculo del total en soles (`S/.`).
  * **Consulta por WhatsApp:** Genera un mensaje estructurado con los productos seleccionados para confirmar disponibilidad y entrega.
* **Página de Contacto:** Formulario con selector de categoría de consulta, confirmación interactiva y datos de atención.
* **Diseño 100% Responsivo:** Adaptación completa a dispositivos móviles mediante menú hamburguesa y navegación táctil accesible.

---

## 💡 2. ¿Por qué el proyecto es útil?

Encontrar rápidamente herramientas y materiales para una reparación u obra puede ser complicado cuando los productos están dispersos o no se sabe a quién consultar.

**FerreMax resuelve esto ofreciendo:**
* **Consulta directa:** Conecta la lista del carrito con **WhatsApp**, para confirmar disponibilidad y coordinar la compra.
* **Catálogo práctico:** Organiza herramientas, materiales de obra, electricidad, plomería, pintura y seguridad en categorías fáciles de explorar.
* **Diseño industrial:** Utiliza una paleta de grafito, acero y naranja de seguridad, con una interfaz responsiva para encontrar productos desde cualquier dispositivo.
* **Rendimiento Ultraligero:** Construido en **Vanilla JavaScript** y **CSS nativo**, sin dependencias ni librerías pesadas, garantizando tiempos de carga casi instantáneos en cualquier conexión móvil.
* **Gestión Local Flexible:** Guarda catálogo y carrito en el navegador sin depender de un backend complejo en esta primera fase.

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
├── index.html              # Inicio: destacados, categorías y presentación de la ferretería
├── Catalogo.html           # Catálogo con filtros y búsqueda en vivo
├── Ofertas_Catalogo.html   # Productos con descuentos dinámicos
├── Proximos_Agregados.html # Próximos productos
├── Contacto.html           # Centro de Atención, Formulario y Canales Oficiales
├── styles.css              # Estilos globales: paleta industrial y diseño responsivo
├── script.js               # Slider, filtros, carrito, LocalStorage y WhatsApp
└── README.md               # Documentación General del Proyecto
```

### 🛠️ Stack Tecnológico:
* **HTML5:** Semántica estricta (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) y optimización SEO con metadatos OpenGraph y favicon SVG.
* **CSS3 Moderno:** Custom Properties (variables), Flexbox, CSS Grid, Glassmorphism, transiciones fluidas y animaciones con `@keyframes`.
* **JavaScript (ES6+):** Programación funcional y modular, manipulación del DOM, eventos táctiles/teclado, API de `localStorage` e integración con la API pública de WhatsApp (`https://wa.me/`).

---

## 📞 5. ¿Dónde pueden recibir ayuda los usuarios?

Si tienes consultas sobre el código, deseas reportar una incidencia o consultar por un producto:

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
| **Miguel Angel Nolasco Bautista** ([@Klivers](https://github.com/Klivers)) | Módulo de Contacto, integración con API de WhatsApp y automatización en GitHub Actions | `dev-klivers` |

---
## 🛠️ 7. Instalación y Ejecución Local (Docker)
Para desplegar la web de la ferretería localmente usando contenedores:
1. Asegúrate de tener instalado Docker Desktop.
2. Clona el repositorio en tu máquina local.
3. Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:
   `docker-compose up -d --build`
4. La página estará disponible en tu navegador en el puerto configurado.
   
## 📌 8. GitHub Gists Destacados

Fragmentos modulares de código documentados y publicados para revisión académica:

1. 🛒 [**Módulo de Carrito de Compras & Checkout WhatsApp en JAVASCRIPT**](https://gist.github.com/Jynsane/5c8e6f5ac08e92b03fabc8c421e06cfb)
2. 📖 [**Catalogo de productos en HTML**](https://gist.github.com/Seeth77/370a18e9e54732dcfaf08b0e815b2a20)
3. 📚 [**Proximos agregados en el catalogo en HTML**](https://gist.github.com/Seeth77/b53caa15356503071c7dfc4e9abbf4d5)
4. 🔍 [**Sistema de Búsqueda y Filtrado Reactivo por Categorías en JAVASCRIPT**](https://gist.github.com/Jynsane/55f05d7e697485d1ed48a0fc00edfc96)
5. 📲 [**Generador de Enlace WhatsApp para Pedidos en JAVASCRIPT**](https://gist.github.com/Klivers/a33cbd82454ec44981e70040dff430a0)
6. ✉️ [**Validación de Formulario de Contacto en JAVASCRIPT**](https://gist.github.com/Klivers/e1077c5e66c9c0e0dccfb9e73e4c531d)
  6. ✉️ [**Tarjeta de valor reutilizable - sección Nosotros**](https://gist.github.com/adrianaltuna8/04f270cda016ca2208219cb20c46df46)
<div align="center">
  <p>&copy; 2026 FerreMax. Proyecto Académico UTP — Todos los derechos reservados.</p>
</div>
