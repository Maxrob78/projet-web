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

    if (slides.length > 0) {
        showSlides(slideIndex);
    }

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

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
        if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
    }

    // ==========================================
    // 3. GESTION DU THÈME (DARK MODE)
    // ==========================================
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

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

    // ==========================================
    // 4. CHARGEMENT DYNAMIQUE JSON (COURS/FORMATIONS)
    // ==========================================
    fetch('../json/cours-formations.json')
        .then(response => response.json())
        .then(data => {
            const conteneurCours = document.getElementById('liste-cours');
            const conteneurFormations = document.getElementById('liste-formations');

            const creerCarte = (item) => `
                <div class="carte">
                    <img src="${item.image}" alt="${item.nom}">
                    <div class="info">
                        <h3>${item.nom}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;

            if (data.cours && conteneurCours) {
                data.cours.forEach(item => { conteneurCours.innerHTML += creerCarte(item); });
            }
            if (data.formations && conteneurFormations) {
                data.formations.forEach(item => { conteneurFormations.innerHTML += creerCarte(item); });
            }
        })
        .catch(error => console.error("Erreur de chargement JSON :", error));

    // ==========================================
    // 5. GESTION DE LA DROP ZONE (DRAG & DROP)
    // ==========================================
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    let imagePreviewUrl = ""; 

    if (dropZone && fileInput) {
        // Cliquer pour ouvrir l'explorateur
        dropZone.addEventListener('click', () => fileInput.click());

        // Empêcher le comportement par défaut du navigateur
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Effets visuels
        dropZone.addEventListener('dragover', () => dropZone.classList.add('hover'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));

        // Gérer le fichier reçu (Aperçu)
        const handleFile = (file) => {
            if (file && file.type.startsWith('image/')) {
                imagePreviewUrl = URL.createObjectURL(file);
                dropZone.style.backgroundImage = `url(${imagePreviewUrl})`;
                dropZone.style.backgroundSize = "cover";
                dropZone.style.backgroundPosition = "center";
                dropZone.innerText = ""; 
            }
        };

        fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
        dropZone.addEventListener('drop', (e) => {
            dropZone.classList.remove('hover');
            handleFile(e.dataTransfer.files[0]);
        });
    }

    // ==========================================
    // 6. SOUMISSION DU FORMULAIRE (SIMULATION)
    // ==========================================
    const quizForm = document.getElementById('QuizId');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nom = document.getElementById('nom').value;
            const desc = document.getElementById('description').value;
            const typeChoice = document.getElementById('type-choix');
            const type = typeChoice ? typeChoice.value : 'cours';
            const containerId = type === 'cours' ? 'liste-cours' : 'liste-formations';

            if (nom && desc && imagePreviewUrl) {
                const container = document.getElementById(containerId);
                const htmlCarte = `
                    <div class="carte">
                        <img src="${imagePreviewUrl}" alt="${nom}">
                        <div class="info">
                            <h3>${nom}</h3>
                            <p>${desc}</p>
                        </div>
                    </div>`;
                
                if (container) container.innerHTML += htmlCarte;

                // Reset
                this.reset();
                dropZone.style.backgroundImage = "none";
                dropZone.innerText = "Glissez votre image ici ou cliquez pour choisir";
                imagePreviewUrl = "";
                alert("Cours ajouté (Temporairement en JS) !");
            } else {
                alert("Veuillez remplir tous les champs et ajouter une image.");
            }
        });
    }
});

// --- GESTION VIDÉO AU SURVOL ---
document.querySelectorAll('.video-hover-container').forEach(container => {
    const video = container.querySelector('video');
    if (video) {
        container.addEventListener('mouseenter', () => {
            video.muted = true;
            video.play().catch(error => console.log("Erreur lecture :", error));
        });
        container.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }
});