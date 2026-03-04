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
        if (slides.length === 0) return;
        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
        if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
    }

    // ==========================================
    // 3. GESTION DU THÈME (DARK MODE)
    // ==========================================
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleBtn.textContent = '☀️';
        }

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
    // 4. CHARGEMENT DYNAMIQUE JSON
    // ==========================================
    const conteneurCours = document.getElementById('liste-cours');
    const conteneurFormations = document.getElementById('liste-formations');

    if (conteneurCours || conteneurFormations) {
        fetch('../json/cours-formations.json')
            .then(response => response.json())
            .then(data => {
                const creerCarte = (item) => `
                    <div class="carte">
                        <img src="${item.image}" alt="${item.nom}">
                        <div class="info" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            <h3>${item.nom}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;

                if (data.cours && conteneurCours) {
                    conteneurCours.innerHTML = "";
                    data.cours.forEach(item => { conteneurCours.innerHTML += creerCarte(item); });
                }
                if (data.formations && conteneurFormations) {
                    conteneurFormations.innerHTML = "";
                    data.formations.forEach(item => { conteneurFormations.innerHTML += creerCarte(item); });
                }
            })
            .catch(error => console.error("Erreur de chargement JSON :", error));
    }

    // ==========================================
    // 5. GESTION DE LA DROP ZONE (DRAG & DROP)
    // ==========================================
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('dragover', () => dropZone.classList.add('hover'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));

        const handleFile = (file) => {
            if (file && file.type.startsWith('image/')) {
                const imagePreviewUrl = URL.createObjectURL(file);
                dropZone.style.backgroundImage = `url(${imagePreviewUrl})`;
                dropZone.style.backgroundSize = "cover";
                dropZone.style.backgroundPosition = "center";
                const dropText = document.getElementById('drop-text');
                if (dropText) dropText.style.display = "none";

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                console.log("Fichier injecté :", fileInput.files[0].name);
            }
        };

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });
        dropZone.addEventListener('drop', (e) => {
            dropZone.classList.remove('hover');
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
    }

    // ==========================================
    // 6. SOUMISSION DU FORMULAIRE (PHP)
    // ==========================================
    const quizForm = document.getElementById('QuizId'); // AJOUTÉ : Déclaration de la variable

    if (quizForm) {
        quizForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Diagnostic : Formulaire soumis !");

            const formData = new FormData(this);

            // On s'assure que le fichier est bien pris en compte
            const fileCheck = formData.get('image');
            console.log("Fichier prêt à l'envoi :", fileCheck ? fileCheck.name : "Aucun");

            if (!fileCheck || fileCheck.size === 0) {
                alert("Erreur : Aucune image sélectionnée.");
                return;
            }

            fetch('../includes/ajouter_cours.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Enregistré avec succès !");
                        location.reload();
                    } else {
                        alert("Erreur PHP : " + data.message);
                    }
                })
                .catch(error => console.error("Échec du fetch :", error));
        });
    }

    // ==========================================
    // 7. GESTION VIDÉO AU SURVOL
    // ==========================================
    document.querySelectorAll('.video-hover-container').forEach(container => {
        const video = container.querySelector('video');
        if (video) {
            container.addEventListener('mouseenter', () => {
                video.muted = true;
                video.play().catch(err => console.log("Lecture bloquée :", err));
            });
            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}); // Cette accolade ferme DOMContentLoaded. Il n'y en a plus d'autres après.