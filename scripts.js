/**
 * Portfolio Navigation System
 * @author Luis San Martín
 * @description Sistema de navegación y gestión de secciones del portafolio
 */

(function() {
    'use strict';

    // ===== CONSTANTES Y CONFIGURACIÓN =====
    const CONFIG = {
        ANIMATION_DURATION: 300,
        SCROLL_BEHAVIOR: 'smooth',
        MOBILE_BREAKPOINT: 768,
        LOADER_FADE_DURATION: 500,
        PAGE_TITLE_BASE: 'Luis San Martín | Portafolio TI'
    };

    const SECTION_TITLES = {
        inicio: 'Perfil | Luis San Martín',
        especialidades: 'Habilidades | Luis San Martín',
        servicios: 'Servicios | Luis San Martín',
        experiencia: 'Experiencia | Luis San Martín',
        educacion: 'Educación | Luis San Martín',
        certificaciones: 'Certificaciones | Luis San Martín',
        contacto: 'Contacto | Luis San Martín'
    };

    const SECTION_LABELS = {
        inicio: 'Perfil profesional',
        especialidades: 'Habilidades clave',
        servicios: 'Servicios profesionales',
        experiencia: 'Experiencia reciente',
        educacion: 'Formación académica',
        certificaciones: 'Certificaciones',
        contacto: 'Contacto'
    };

    const SECTION_IDS_ORDER = [
        'inicio', 'especialidades', 'servicios', 'experiencia', 'educacion', 'certificaciones', 'contacto'
    ];

    // ===== SELECTORES DEL DOM =====
    const DOM = {
        loader: null,
        menuItems: null,
        sections: null,
        indicator: null,
        contentArea: null,
        wrapper: null
    };

    // ===== ESTADO DE LA APLICACIÓN =====
    const STATE = {
        currentSection: 'inicio',
        isTransitioning: false,
        isMobile: false
    };

    /**
     * Inicializa todos los selectores del DOM
     */
    function initializeDOM() {
        DOM.loader = document.getElementById('loader');
        DOM.menuItems = document.querySelectorAll('.menu-item');
        DOM.sections = document.querySelectorAll('.section');
        DOM.indicator = document.querySelector('.indicator');
        DOM.contentArea = document.querySelector('.content');
        DOM.wrapper = document.querySelector('.wrapper');
    }

    /**
     * Verifica si estamos en modo móvil
     * @returns {boolean}
     */
    function checkIfMobile() {
        return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    }

    /**
     * Mueve el indicador visual del menú lateral
     * @param {HTMLElement} element - Elemento del menú activo
     */
    function moveIndicator(element) {
        if (!DOM.indicator || !element) return;

        STATE.isMobile = checkIfMobile();

        if (STATE.isMobile) {
            DOM.indicator.style.display = 'none';
        } else {
            requestAnimationFrame(() => {
                DOM.indicator.style.top = `${element.offsetTop}px`;
                DOM.indicator.style.display = 'block';
            });
        }
    }

    /**
     * Actualiza el estado activo del menú
     * @param {HTMLElement} activeItem - Elemento del menú que debe estar activo
     */
    function updateMenuState(activeItem) {
        DOM.menuItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
        });
        activeItem.classList.add('active');
        activeItem.setAttribute('aria-current', 'page');
    }

    /**
     * Cambia la sección visible con animación
     * @param {string} targetSection - ID de la sección objetivo
     */
    function changeSectionContent(targetSection) {
        if (STATE.isTransitioning) return;
        STATE.isTransitioning = true;

        // Ocultar todas las secciones
        DOM.sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
            }
        });

        // Mostrar la sección objetivo después de un pequeño delay
        setTimeout(() => {
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                STATE.currentSection = targetSection;
                updatePageTitle(targetSection);
                announceSection(targetSection);
                focusSectionHeading(targetElement);
                if (DOM.contentArea) {
                    DOM.contentArea.scrollTo({
                        top: 0,
                        behavior: CONFIG.SCROLL_BEHAVIOR
                    });
                }
            }
            STATE.isTransitioning = false;
        }, 50);
    }

    function announceSection(sectionId) {
        const el = document.getElementById('sr-announce');
        if (!el) return;
        const label = SECTION_LABELS[sectionId] || sectionId;
        el.textContent = '';
        requestAnimationFrame(() => { el.textContent = `Sección: ${label}`; });
    }

    function focusSectionHeading(sectionElement) {
        const h2 = sectionElement?.querySelector('h2');
        if (h2 && typeof h2.focus === 'function') h2.focus({ preventScroll: true });
    }

    /**
     * Actualiza el título de la pestaña según la sección activa
     * @param {string} sectionId - ID de la sección
     */
    function updatePageTitle(sectionId) {
        const title = SECTION_TITLES[sectionId] || CONFIG.PAGE_TITLE_BASE;
        document.title = title;
    }

    /**
     * Maneja el cambio de sección
     * @param {HTMLElement} menuItem - Elemento del menú clickeado
     * @param {boolean} [fromHistory=false] - Si true, no hace pushState (navegación atrás/adelante)
     */
    function handleSectionChange(menuItem, fromHistory = false) {
        const targetSection = menuItem.getAttribute('data-section');

        if (targetSection === STATE.currentSection && !fromHistory) return;

        updateMenuState(menuItem);
        moveIndicator(menuItem);
        changeSectionContent(targetSection);

        if (!fromHistory && window.history?.pushState) {
            window.history.pushState(
                { section: targetSection },
                '',
                `#${targetSection}`
            );
        }
    }

    /**
     * Configura los event listeners del menú
     */
    function setupMenuListeners() {
        DOM.menuItems.forEach(item => {
            // Click event
            item.addEventListener('click', (e) => {
                e.preventDefault();
                handleSectionChange(item);
            });

            // Keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSectionChange(item);
                }
            });

            // Mejorar accesibilidad táctil
            item.addEventListener('touchstart', () => {
                item.style.opacity = '0.7';
            }, { passive: true });

            item.addEventListener('touchend', () => {
                item.style.opacity = '1';
            }, { passive: true });
        });
    }

    /**
     * Muestra brevemente el aviso "Sitio mejorado" tras cargar
     */
    function showMejoradoToast() {
        const toast = document.createElement('div');
        toast.className = 'toast-mejorado';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Sitio mejorado</span>';
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('toast-visible'));

        const hideDelay = 2500;
        const removeDelay = hideDelay + 400;
        setTimeout(() => toast.classList.add('toast-hide'), hideDelay);
        setTimeout(() => toast.remove(), removeDelay);
    }

    /**
     * Maneja la carga inicial de la página (oculta el loader)
     */
    function handlePageLoad() {
        if (!DOM.loader) return;
        DOM.loader.style.opacity = '0';
        setTimeout(() => {
            DOM.loader.style.display = 'none';
            showMejoradoToast();
        }, CONFIG.LOADER_FADE_DURATION);
    }

    /**
     * Maneja el redimensionamiento de la ventana
     */
    function handleResize() {
        const activeMenuItem = document.querySelector('.menu-item.active');
        if (activeMenuItem) {
            moveIndicator(activeMenuItem);
        }
    }

    /**
     * Configura la navegación del historial del navegador
     */
    function setupHistoryNavigation() {
        window.addEventListener('popstate', (event) => {
            if (event.state?.section) {
                const menuItem = document.querySelector(
                    `.menu-item[data-section="${event.state.section}"]`
                );
                if (menuItem) {
                    handleSectionChange(menuItem, true);
                }
            }
        });
    }

    /**
     * Verifica y carga la sección desde la URL al cargar la página
     */
    function loadSectionFromURL() {
        const hash = window.location.hash.slice(1);
        if (!hash || hash === STATE.currentSection) return;
        const menuItem = document.querySelector(
            `.menu-item[data-section="${hash}"]`
        );
        if (menuItem) {
            handleSectionChange(menuItem, true);
        }
    }

    /**
     * Optimiza el rendimiento del scroll con requestAnimationFrame
     */
    function setupScrollOptimization() {
        if (!DOM.contentArea) return;
        let ticking = false;
        DOM.contentArea.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                ticking = false;
            });
        }, { passive: true });
    }

    /**
     * Prepara soporte para gestos táctiles en móvil (extensible)
     */
    function setupTouchGestures() {
        if (!checkIfMobile() || !DOM.contentArea) return;
        let touchStartX = 0;
        DOM.contentArea.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        DOM.contentArea.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                // Base para futura navegación por swipe
            }
        }, { passive: true });
    }

    /**
     * Mejora la accesibilidad del teclado (flechas + atajos 1–7)
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const isInput = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.isContentEditable;
            if (isInput) return;

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const activeItem = document.querySelector('.menu-item.active');
                if (!activeItem) return;

                const menuItemsArray = Array.from(DOM.menuItems);
                const currentIndex = menuItemsArray.indexOf(activeItem);
                const nextIndex = e.key === 'ArrowDown'
                    ? (currentIndex + 1) % menuItemsArray.length
                    : (currentIndex - 1 + menuItemsArray.length) % menuItemsArray.length;

                e.preventDefault();
                menuItemsArray[nextIndex].focus();
                handleSectionChange(menuItemsArray[nextIndex]);
                return;
            }

            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= 7) {
                const sectionId = SECTION_IDS_ORDER[num - 1];
                const menuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
                if (menuItem) {
                    e.preventDefault();
                    menuItem.focus();
                    handleSectionChange(menuItem);
                }
            }
        });
    }

    /**
     * Inicializa la aplicación
     */
    function initialize() {
        // Inicializar DOM
        initializeDOM();

        // Verificar si los elementos necesarios existen
        if (!DOM.menuItems || !DOM.sections) {
            console.error('Error: No se encontraron los elementos necesarios del DOM');
            return;
        }

        // Configurar indicador inicial
        const activeMenuItem = document.querySelector('.menu-item.active');
        if (activeMenuItem) {
            moveIndicator(activeMenuItem);
        }

        // Configurar event listeners
        setupMenuListeners();
        setupHistoryNavigation();
        setupScrollOptimization();
        setupTouchGestures();
        setupKeyboardNavigation();

        loadSectionFromURL();
        updatePageTitle(STATE.currentSection);

        window.addEventListener('load', handlePageLoad);
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    /**
     * Debounce para optimizar eventos frecuentes (resize, scroll, etc.)
     * @param {Function} fn - Función a ejecutar
     * @param {number} wait - Espera en ms
     * @returns {Function}
     */
    function debounce(fn, wait) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // ===== INICIALIZACIÓN =====
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
