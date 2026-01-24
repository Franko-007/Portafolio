document.addEventListener("DOMContentLoaded", () => {

    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".section");
    const indicator = document.querySelector(".indicator");
    const contentArea = document.querySelector(".content");

    /**
     * Mueve el indicador visual del menú lateral
     */
    function moveIndicator(el) {
        if (indicator && window.innerWidth > 768) {
            indicator.style.top = el.offsetTop + "px";
            indicator.style.display = "block";
        } else if (indicator) {
            indicator.style.display = "none";
        }
    }

    // Inicializar indicador
    const activeMenu = document.querySelector(".menu-item.active");
    if (activeMenu) moveIndicator(activeMenu);

    /**
     * Manejo de navegación entre secciones
     */
    const changeSection = (item) => {
        const target = item.getAttribute("data-section");

        // Actualizar estado activo en menú
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        moveIndicator(item);

        // Cambiar sección con transición y reset de scroll
        sections.forEach(sec => {
            sec.classList.remove("active");
            if (sec.id === target) {
                sec.classList.add("active");
                contentArea.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    menuItems.forEach(item => {
        // Click normal
        item.addEventListener("click", () => changeSection(item));
        
        // Soporte para teclado (Accesibilidad)
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                changeSection(item);
            }
        });
    });

    /**
     * Quitar Loader al cargar
     */
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }
    });

    // Ajustar indicador si se cambia el tamaño de la ventana
    window.addEventListener("resize", () => {
        const active = document.querySelector(".menu-item.active");
        if (active) moveIndicator(active);
    });

});