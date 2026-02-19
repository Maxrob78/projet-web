// On attend que le HTML soit chargé pour initialiser les éléments
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GESTION DU HEADER (TRANSITION SCROLL)
    // ==========================================
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');

    if (header && hero) {
        window.addEventListener('scroll', function () {
            const heroHeight = hero.offsetHeight;
            // On déclenche le mode blanc juste avant la fin de la vidéo
            if (window.scrollY >= heroHeight - 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 2. GESTION DU CARROUSEL
    // ==========================================
    let slideIndex = 1;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    // On n'affiche le carrousel que s'il existe sur la page
    if (slides.length > 0) {
        showSlides(slideIndex);
    }

    // IMPORTANT : On attache les fonctions à "window" pour que le 
    // "onclick" de ton HTML puisse les trouver (car le fichier est externe)
    window.plusSlides = function (n) {
        showSlides(slideIndex += n);
    }

    window.currentSlide = function (n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }

        // On cache toutes les images
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        // On désactive tous les points
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        if (dots.length > 0) {
            dots[slideIndex - 1].className += " active";
        }
    }
});

// --- GESTION VIDÉO AU SURVOL ---
document.querySelectorAll('.video-hover-container').forEach(container => {
    const video = container.querySelector('video');

    container.addEventListener('mouseenter', () => {
        video.muted = true;
        video.play().catch(error => console.log("Erreur lecture :", error));
    });

    container.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});



// À mettre à la fin de votre script.js, en supprimant l'ancien bloc "GESTION DU THEME"
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Appliquer le thème sauvegardé au chargement
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggleBtn) toggleBtn.textContent = '☀️';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                toggleBtn.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggleBtn.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});