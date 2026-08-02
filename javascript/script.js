document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments HTML nécessaires
    const links = document.querySelectorAll(".sidebar nav ul li a");
    const sections = document.querySelectorAll(".page-section");
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.getElementById("menu-toggle");

    // Fonction principale qui gère le changement de page
    function navigateTo(hash) {
        if (!hash || hash === "#") {
            hash = "#accueil";
        }

        // 1. Masquer toutes les sections
        sections.forEach(sec => {
            sec.classList.remove("active-section");
        });

        // 2. Retirer la surbrillance de tous les boutons du menu
        links.forEach(link => {
            link.classList.remove("active");
        });

        // 3. Afficher la section demandée
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            targetSection.classList.add("active-section");
        } else {
            // Sécurité
            document.getElementById("accueil").classList.add("active-section");
        }

        // 4. Mettre en surbrillance le bouton correspondant
        const targetLink = document.querySelector(`.sidebar nav ul li a[href="${hash}"]`);
        if (targetLink) {
            targetLink.classList.add("active");
        }
    }

    // Ajouter l'événement de "clic" sur chaque bouton du menu
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            const hash = link.getAttribute("href");
            window.history.pushState(null, null, hash);
            navigateTo(hash);

            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
            }
        });
    });

    // Écouteur pour le bouton Menu sur mobile
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    // Lancer la navigation initiale
    navigateTo(window.location.hash);
});