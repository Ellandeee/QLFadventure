document.addEventListener("DOMContentLoaded", () => {
    // === NAVIGATION ===
    const links = document.querySelectorAll(".sidebar nav ul li a");
    const sections = document.querySelectorAll(".page-section");
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.getElementById("menu-toggle");

    function navigateTo(hash) {
        if (!hash || hash === "#") hash = "#accueil";

        sections.forEach(sec => sec.classList.remove("active-section"));
        links.forEach(link => link.classList.remove("active"));

        const targetSection = document.querySelector(hash);
        if (targetSection) targetSection.classList.add("active-section");
        else document.getElementById("accueil").classList.add("active-section");

        const targetLink = document.querySelector(`.sidebar nav ul li a[href="${hash}"]`);
        if (targetLink) targetLink.classList.add("active");
    }

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const hash = link.getAttribute("href");
            window.history.pushState(null, null, hash);
            navigateTo(hash);
            if (window.innerWidth <= 768) sidebar.classList.remove("open");
        });
    });

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    navigateTo(window.location.hash);

    // === ACCORDION ===
    const headers = document.querySelectorAll('.accordion-header');
    
    // Fonction qui calcule la hauteur avec un bonus pour éviter les coupures
    function updateAccordionHeight(header) {
        if (header.classList.contains('active')) {
            const content = header.nextElementSibling;
            // On ajoute 40px de sécurité pour les ombres et les arrondis
            content.style.maxHeight = (content.scrollHeight + 40) + "px";
        }
    }

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Toggle current
            if (!isActive) {
                header.classList.add('active');
                updateAccordionHeight(header);
            } else {
                header.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });

    // Expand / Collapse All
    const btnExpand = document.getElementById('expand-all');
    const btnCollapse = document.getElementById('collapse-all');

    if (btnExpand) {
        btnExpand.addEventListener('click', () => {
            headers.forEach(header => {
                if (!header.classList.contains('active')) {
                    header.classList.add('active');
                    updateAccordionHeight(header);
                }
            });
        });
    }

    if (btnCollapse) {
        btnCollapse.addEventListener('click', () => {
            headers.forEach(header => {
                header.classList.remove('active');
                header.nextElementSibling.style.maxHeight = null;
            });
        });
    }

    // Sécurité : Recalculer les hauteurs si l'utilisateur redimensionne la fenêtre
    window.addEventListener('resize', () => {
        headers.forEach(header => updateAccordionHeight(header));
    });

    // === SEARCH FILTER ===
    const searchInput = document.getElementById('search-mod');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const modItems = document.querySelectorAll('.mod-item');
            
            // On ouvre toutes les sections pendant la recherche
            if (query.length > 0) {
                headers.forEach(header => {
                    header.classList.add('active');
                    // On met une hauteur immense temporaire pour ne rien couper
                    header.nextElementSibling.style.maxHeight = "10000px"; 
                });
            }

            // Filtrage des mods
            modItems.forEach(item => {
                const name = item.querySelector('.mod-name').textContent.toLowerCase();
                if (name.includes(query)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });

            // Cacher les sous-catégories vides
            document.querySelectorAll('.sub-category').forEach(sub => {
                const visibleItems = sub.querySelectorAll('.mod-item[style="display: flex;"], .mod-item:not([style*="display: none"])');
                if (visibleItems.length === 0) {
                    sub.style.display = "none";
                } else {
                    sub.style.display = "block";
                }
            });
            
            // Réajuster la hauteur proprement si l'utilisateur efface sa recherche
            if (query.length === 0) {
                 headers.forEach(header => {
                    updateAccordionHeight(header);
                });
            }
        });
    }

    // === CALCUL DYNAMIQUE DU NOMBRE DE MODS ===
    
    // 1. Calcul du total global
    const totalMods = document.querySelectorAll('.mod-item').length;
    const titleElement = document.querySelector('#mods .header-banner h1');
    if (titleElement) {
        // Ajoute le badge avec le total à côté du H1
        titleElement.innerHTML += ` <span class="mod-count-total">${totalMods} mods</span>`;
    }

    // 2. Calcul pour chaque catégorie (Accordéon)
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        // Compte les mods uniquement dans cet accordéon
        const count = item.querySelectorAll('.mod-item').length;
        const headerSpan = item.querySelector('.accordion-header span');
        if (headerSpan) {
            headerSpan.innerHTML += ` <span class="mod-count-cat">${count}</span>`;
        }
    });

    // 3. Calcul pour chaque sous-catégorie
    const subCategories = document.querySelectorAll('.sub-category');
    subCategories.forEach(sub => {
        // Compte les mods uniquement dans cette sous-catégorie
        const count = sub.querySelectorAll('.mod-item').length;
        const subTitle = sub.querySelector('.sub-category-title');
        if (subTitle) {
            subTitle.innerHTML += ` <span class="mod-count-sub">${count} mods</span>`;
        }
    });
    
});