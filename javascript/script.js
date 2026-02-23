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
    let donneesGlobales = { cours: [], formations: [] }; // Stockage global

    fetch('../json/cours-formations.json')
        .then(response => response.json())
        .then(data => {
            donneesGlobales = data; // Sauvegarde des données
            afficherTout();
        });

    function afficherTout() {
        const listeCours = document.getElementById('liste-cours');
        const listeFormations = document.getElementById('liste-formations');
        
        if(listeCours) listeCours.innerHTML = "";
        if(listeFormations) listeFormations.innerHTML = "";

        donneesGlobales.cours.forEach(item => creerCarte(item, 'cours', 'liste-cours'));
        donneesGlobales.formations.forEach(item => creerCarte(item, 'formations', 'liste-formations'));
    }

    function creerCarte(item, type, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const id = item.id;

        const htmlCarte = `
            <div class="carte" id="card-${type}-${id}">
                <img src="${item.image}" alt="${item.nom}">
                <div class="info">
                    <h3>${item.nom}</h3>
                    <p>${item.description}</p>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="preparerModification(${id}, '${type}')">Modifier ✏️</button>
                        <button class="btn-delete" onclick="supprimerElement(${id}, '${type}')">Supprimer 🗑️</button>
                    </div>
                </div>
            </div>`;
        
        container.insertAdjacentHTML('beforeend', htmlCarte);
    }

    // 1. Fonction pour annuler
    window.annulerModification = function() {
        const form = document.getElementById('QuizId');
        const submitBtn = document.getElementById('submitbtn');
        const cancelBtn = document.getElementById('cancelbtn');
        const dropZone = document.getElementById('drop-zone');

        // Reset du formulaire
        form.reset();
        
        // On retire les infos de modification
        delete form.dataset.editId;
        delete form.dataset.editType;

        // On remet les textes et boutons d'origine
        submitBtn.innerText = "Envoyer";
        cancelBtn.style.display = "none";
        
        // Reset de l'image
        if(dropZone) {
            dropZone.style.backgroundImage = "none";
            dropZone.innerText = "Glissez votre image ici ou cliquez pour choisir";
        }
        imagePreviewUrl = ""; 
    };

    // 2. Modifier la fonction de préparation pour afficher le bouton
    window.preparerModification = function(id, type) {
        const item = donneesGlobales[type].find(i => i.id === id);
        
        if (item) {
            const form = document.getElementById('QuizId');
            document.getElementById('nom').value = item.nom;
            document.getElementById('description').value = item.description;
            document.getElementById('type-choix').value = type;
            
            // On stocke l'ID ET le type d'origine
            form.dataset.editId = id; 
            form.dataset.editType = type; // <--- TRÈS IMPORTANT

            document.getElementById('submitbtn').innerText = "Enregistrer les modifications";
            document.getElementById('cancelbtn').style.display = "inline-block";
            
            // Gestion image
            imagePreviewUrl = item.image;
            const dropZone = document.getElementById('drop-zone');
            dropZone.style.backgroundImage = `url(${item.image})`;
            dropZone.innerText = "";
            
            form.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.supprimerElement = function(id, type) {
        if (confirm("Es-tu sûr de vouloir supprimer ce cours ?")) {
            // 1. Filtrer les données pour retirer l'élément
            donneesGlobales[type] = donneesGlobales[type].filter(item => item.id !== id);
            
            // 2. Rafraîchir l'affichage
            afficherTout();
            
            alert("Élément supprimé !");
        }
    };

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
    // 6. SOUMISSION DU FORMULAIRE (AJOUT OU MODIF)
    // ==========================================
    const quizForm = document.getElementById('QuizId');
    if (quizForm) {
        quizForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Récupération des valeurs actuelles du formulaire
            const leNom = document.getElementById('nom').value;
            const laDesc = document.getElementById('description').value;
            const nouveauType = document.getElementById('type-choix').value; // 'cours' ou 'formations'
            
            // 2. Récupération des infos de modification (si elles existent)
            const editId = this.dataset.editId;
            const typeOrigine = this.dataset.editType;

            // 3. Vérification : On a besoin d'un nom, d'une description et d'une image
            if (leNom && laDesc && imagePreviewUrl) {
                
                if (editId) {
                    // --- CAS A : MODIFICATION ---
                    console.log("Modification de l'élément ID:", editId, "depuis", typeOrigine, "vers", nouveauType);
                    
                    // On retire d'abord l'ancien élément de sa catégorie d'origine
                    // (Cela permet de gérer le changement de type automatiquement)
                    donneesGlobales[typeOrigine] = donneesGlobales[typeOrigine].filter(item => item.id != editId);

                    // On crée l'objet mis à jour (on garde le même ID)
                    const itemMisAJour = {
                        id: parseInt(editId),
                        nom: leNom,
                        description: laDesc,
                        image: imagePreviewUrl
                    };

                    // On l'ajoute dans la catégorie cible (nouveauType)
                    donneesGlobales[nouveauType].push(itemMisAJour);
                    
                    alert("Modification enregistrée !");

                } else {
                    // --- CAS B : NOUVEL AJOUT ---
                    const nouvelItem = {
                        id: Date.now(), // Génère un ID unique basé sur l'heure
                        nom: leNom,
                        description: laDesc,
                        image: imagePreviewUrl
                    };

                    // On l'ajoute dans la catégorie choisie
                    donneesGlobales[nouveauType].push(nouvelItem);
                    
                    alert("Nouvel élément ajouté !");
                }

                // --- ACTIONS FINALES (COMMUNES AUX DEUX CAS) ---
                
                // 1. On rafraîchit tout l'affichage pour voir les changements
                afficherTout(); 
                
                // 2. On remet le formulaire à zéro (et on cache le bouton annuler)
                annulerModification(); 

            } else {
                alert("Veuillez remplir tous les champs et ajouter une image.");
            }
        });
    }

    // ==========================================
    // 7. GESTION DU MODE VEILLE
    // ==========================================
    const idleVideo = document.getElementById('bg-idle-video');
    let idleTimer;
    const IDLE_TIME = 120000; // 120 secondes d'inactivité avant de lancer la vidéo
    const originalTitle = document.title; // Sauvegarde le titre original pour le restaurer après le mode veille

    if (idleVideo) {
        function setIdle() {
            document.body.classList.add('is-idle');
            
            // Change le titre de l'onglet
            document.title = "t ouuuuuuuu ?";

            // Relance la vidéo du début
            idleVideo.currentTime = 0;
            idleVideo.volume = 0.1; // Baisser le son
            idleVideo.muted = false;

            let playPromise = idleVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Si le navigateur bloque le son, on la joue en muet
                    idleVideo.muted = true;
                    idleVideo.play();
                });
            }
        }

        function setActive() {
            // Si on sort du mode veille
            if (document.body.classList.contains('is-idle')) {
                document.body.classList.remove('is-idle');
                document.title = originalTitle; // Remet le bon titre
                idleVideo.pause(); // Met la vidéo en pause pour les perfs
            }

            // Réinitialise le chrono
            clearTimeout(idleTimer);
            idleTimer = setTimeout(setIdle, IDLE_TIME);
        }

        // On écoute l'activité de l'utilisateur (souris, clavier, scroll, tactile)
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
            window.addEventListener(event, setActive);
        });

        // Lancer le timer au chargement de la page
        setActive();
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