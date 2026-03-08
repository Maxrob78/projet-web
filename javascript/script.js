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
                // On ajoute le 'type' en paramètre pour savoir si c'est un cours ou une formation
                const creerCarte = (item, type) => `
                    <div class="carte" onclick="preparerModification('${item.id}', '${item.nom}', \`${item.description.replace(/'/g, "\\'")}\`, '${type}', '${item.image}')" style="cursor: pointer;">
                        <img src="${item.image}" alt="${item.nom}">
                        <div class="info" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            <h3>${item.nom}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;

                if (data.cours && conteneurCours) {
                    conteneurCours.innerHTML = "";
                    data.cours.forEach(item => { conteneurCours.innerHTML += creerCarte(item, 'cours'); });
                }
                if (data.formations && conteneurFormations) {
                    conteneurFormations.innerHTML = "";
                    data.formations.forEach(item => { conteneurFormations.innerHTML += creerCarte(item, 'formations'); });
                }
            })
            .catch(error => console.error("Erreur de chargement JSON :", error));
    }

    // Fonctions globales pour les boutons (doivent être accessibles dans le HTML)
    window.preparerModification = function(id, nom, description, type, image) {
        // Remplir le formulaire
        document.getElementById('item-id').value = id;
        document.getElementById('nom').value = nom;
        document.getElementById('description').value = description;
        document.getElementById('type-choix').value = type;
        
        // AFFICHER LE BOUTON SUPPRIMER
        document.getElementById('deletebtn').style.display = "block";
        document.getElementById('submitbtn').textContent = "Mettre à jour";

        // Afficher l'image dans la dropzone
        const dropZone = document.getElementById('drop-zone');
        dropZone.style.backgroundImage = `url(${image})`;
        dropZone.style.backgroundSize = "cover";
        dropZone.style.backgroundPosition = "center";
        document.getElementById('drop-text').style.display = "none";

        // Défiler jusqu'au formulaire
        document.getElementById('contactretour').scrollIntoView({ behavior: 'smooth' });
    };

    window.supprimerItem = function(id, type) {
        if(confirm("Voulez-vous vraiment supprimer cet élément ?")) {
            fetch('../includes/supprimer_cours.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, type: type })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    location.reload(); // Recharger la page pour voir les changements
                } else {
                    alert("Erreur : " + data.message);
                }
            });
        }
    };

    window.resetFormulaire = function() {
        // Vide les champs
        document.getElementById('QuizId').reset();
        document.getElementById('item-id').value = "";
        
        // Cache le bouton supprimer
        document.getElementById('deletebtn').style.display = "none";
        document.getElementById('submitbtn').textContent = "Envoyer";

        // Reset de la dropzone
        const dropZone = document.getElementById('drop-zone');
        dropZone.style.backgroundImage = "none";
        document.getElementById('drop-text').style.display = "block";
    };

    // On lie le bouton "Supprimer" du formulaire à la fonction existante
    const btnSupprForm = document.getElementById('deletebtn');
    if (btnSupprForm) {
        btnSupprForm.addEventListener('click', function() {
            const id = document.getElementById('item-id').value;
            const type = document.getElementById('type-choix').value;
            if (id && type) {
                window.supprimerItem(id, type);
            }
        });
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
    // 6. MODIF DU JSON AVEC LE PHP (COURS FORMATIONS)
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

            /*if (!fileCheck || fileCheck.size === 0) {
                alert("Erreur : Aucune image sélectionnée.");
                return;
            }*/ // jsp pk gemini a dit d'enlever ça pr les modifs/supprs

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

// ===========================================
// FLASH MEDIA (oe tkt frro)
// ===========================================
const flash = document.querySelector('#flashMedia');
const flashVideo = document.querySelector('#flashVideo');
const flashImage = document.querySelector('#flashImg');
const flashTitre = document.querySelector('#flashTitre');
const flashWrapper = document.querySelector('.mediaWrapper');

let flashConfig = {
    video: "",
    image: "",
    texte: "",
    duree: "auto",
    volume: 1,
    vitesse: 1,
    audioSeul: false
}
function flashVerifConfig() {
    // Validation de la durée
    if (flashConfig.duree !== 'inf') {
        const parsedDuree = parseInt(flashConfig.duree);
        if (isNaN(parsedDuree) || parsedDuree <= 0) flashConfig.duree = 'auto';
        else flashConfig.duree = parsedDuree;
    }
    
    if (!flashConfig.video) {
        flashConfig.volume = 1;
        flashConfig.vitesse = 1;
        flashConfig.audioSeul = false;
    } else {
        // Validation de la vitesse (>0)
        const parsedVitesse = parseFloat(flashConfig.vitesse);
        if (isNaN(parsedVitesse) || parsedVitesse <= 0) flashConfig.vitesse = 1;
        else flashConfig.vitesse = parsedVitesse;

        // Validation du volume (entre 0 et 1)
        let parsedVolume = parseFloat(flashConfig.volume);
        if (isNaN(parsedVolume)) flashConfig.volume = 1;
        else flashConfig.volume = Math.min(Math.max(parsedVolume, 0), 1);

        // Validation audioSeul
        if (flashConfig.image) flashConfig.audioSeul = false;
        else {
            const extension = flashConfig.video.split('.').pop().toLowerCase();
            const formatsAudio = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
            if (formatsAudio.includes(extension)) flashConfig.audioSeul = true;
            else flashConfig.audioSeul = typeof flashConfig.audioSeul === 'boolean' ? flashConfig.audioSeul : false;
        }
    }

    // Nettoyage + encodage URLs
    flashConfig.video = typeof flashConfig.video === 'string' ? encodeURI(flashConfig.video.trim()) : "";
    flashConfig.image = typeof flashConfig.image === 'string' ? encodeURI(flashConfig.image.trim()) : "";
    flashConfig.texte = typeof flashConfig.texte === 'string' ? flashConfig.texte.trim() : "";

    console.log("Config Flash validée :", flashConfig);
}

let flashTimeout;
function flashStart() {
    flashStop();
    flashVerifConfig();

    const video = !!flashVideo && flashConfig.video !== "";
    const image = !!flashImage && flashConfig.image !== "";

    if (flashConfig.audioSeul || (!video && !image)) {
        flash.classList.add('titreSeul');
        if (flashConfig.texte) flashAjusterTitre(window.innerWidth, window.innerHeight);
    } else flash.classList.remove('titreSeul');

    if (!video && !image && !flashConfig.texte) return; 

    flashSyncDOMfromConfig();
    if (flashConfig.texte) flashTitre.style.display = "block";
    flash.style.display = "flex";

    // gestion affichage + lecture vidéo
    if (video) {
        flashVideo.volume = flashConfig.volume;
        flashVideo.playbackRate = flashConfig.vitesse;

        let errImg = false;
        let errVid = false;
        
        if (image) {
            flashImage.style.display = "block";

            flashImage.onerror = () => {
                console.warn("Erreur lecture image, audio seul");
                flashImage.style.display = "none";
                errImg = true;
                if (errVid) flashStop();
            }
            flashVideo.onerror = () => {
                console.warn("Erreur lecture vidéo, image seule");
                errVid = true;
                if (errImg) flashStop();
            }

            flashVideo.play().catch(err => console.warn("Erreur lecture mixte:", err));
            flashImage.onload = () => flashUpscale(flashImage);
            if (flashImage.complete) flashUpscale(flashImage);
        } else {
            if (!flashConfig.audioSeul) {
                flashVideo.style.display = "block";
                if (flashVideo.readyState >= 1) flashUpscale(flashVideo);
                flashVideo.onloadedmetadata = () => flashUpscale(flashVideo);
            }

            flashVideo.onerror = () => {
                console.error("Erreur lecture vidéo");
                flashStop();
            }

            flashVideo.play().catch(err => {
                if (err.name === 'NotAllowedError' && !flashConfig.audioSeul) {
                    console.warn("Autoplay bloqué avec son, passage en mute");
                    flashVideo.muted = true;
                    flashVideo.play();
                } else {
                    console.error("Erreur lecture vidéo:", err);
                    flashStop();
                }
            });
        }
    } else if (image) {
        flashImage.style.display = "block";
        flashImage.onload = () => flashUpscale(flashImage);
        if (flashImage.complete) flashUpscale(flashImage);
        flashImage.onerror = () => {
            console.error("Erreur lecture image");
            flashStop();
        }
    }

    // gestion fermeture
    if (flashConfig.duree === 'inf') flashVideo.loop = video ? true : false;
    else if (typeof flashConfig.duree === 'number') {
        if (video) flashVideo.loop = true;
        flashTimeout = setTimeout(() => flashStop(), flashConfig.duree);
    } else {
        if (video) flashVideo.onended = () => flashStop();
        else flashTimeout = setTimeout(() => flashStop(), 5000);
    }
}

function flashStop() {
    clearTimeout(flashTimeout);
    flashVideo.onloadedmetadata = null;
    flashVideo.onerror = null;
    flashVideo.onended = null;
    flashImage.onload = null;
    flashImage.onerror = null;

    flashVideo.pause();
    flashVideo.currentTime = 0;
    flashVideo.muted = false;
    flashVideo.loop = false;

    flashVideo.style.display = "none";
    flashImage.style.display = "none";
    flashTitre.style.display = "none";
    flash.style.display = "none";
    flashWrapper.style.width = "";
    flashWrapper.style.height = "";

    flashVideo.removeAttribute('src');
    flashImage.removeAttribute('src');
    flashTitre.innerHTML = "";
    flashVideo.load();
}

function flashUpscale(media) {
    if (!media || media.style.display === "none") return;

    // 1. Récupérer les dimensions réelles (intrinsèques) du média
    const originalW = media.tagName === 'IMG' ? media.naturalWidth : media.videoWidth;
    const originalH = media.tagName === 'IMG' ? media.naturalHeight : media.videoHeight;
    if (originalW === 0 || originalH === 0) return;

    // 2. Calculer le ratio pour que le média occupe le max d'espace (mode "contain")
    const ratioW = window.innerWidth / originalW;
    const ratioH = window.innerHeight / originalH;
    
    // On choisit le ratio le plus petit pour ne jamais couper l'image/vidéo
    const scale = Math.min(ratioW, ratioH);
    const finalW = Math.floor(originalW * scale);
    const finalH = Math.floor(originalH * scale);

    flashWrapper.style.width = `${finalW}px`;
    flashWrapper.style.height = `${finalH}px`;
    media.style.width = "100%";
    media.style.height = "100%";
    flashAjusterTitre(finalW, finalH);
}

function flashAjusterTitre(w, h, charsPerLine = 35) {
    if (!flashTitre || !flashConfig.texte) return;

    // 1. On définit la largeur de référence (le plus petit entre le média et l'écran)
    const plusGrandCote = Math.max(w, h);
    const largeurReference = Math.min(plusGrandCote, window.innerWidth);
    
    // 2. On applique cette largeur au conteneur (95%)
    const largeurFinale = largeurReference * 0.95;
    flashTitre.style.width = `${largeurFinale}px`;

    // 3. On calcule la police sur cette MÊME base pour garder tes 35 caractères
    let taillePolice = largeurFinale / (charsPerLine * 0.58);
    flashTitre.style.fontSize = `${taillePolice}px`;

    // 4. Sécu : Réduire si la hauteur dépasse 80% de la hauteur du média
    const hauteurMaxAutorisee = h * 0.8;
    while (flashTitre.offsetHeight > hauteurMaxAutorisee && taillePolice > 10) {
        taillePolice -= 2;
        flashTitre.style.fontSize = `${taillePolice}px`;
    }

    const epaisseurContour = taillePolice / 10;
    flashTitre.style.webkitTextStroke = `${epaisseurContour}px black`;
}

function flashSyncDOMfromConfig() {
    if (flashConfig.video) flashVideo.src = flashConfig.video;
    else flashVideo.removeAttribute('src');

    if (flashConfig.image) flashImage.src = flashConfig.image;
    else flashImage.removeAttribute('src'); 

    flashTitre.innerHTML = flashConfig.texte || "";
    flashVideo.load();
}

function flashResetDOMStyles() {
    [flash, flashVideo, flashImage, flashTitre, flashWrapper].forEach(el => el.removeAttribute('style'));    
}

function flashResetConfig() {
    flashConfig = {
        video: "",
        image: "",
        texte: "",
        duree: "auto",
        volume: 1,
        vitesse: 1,
        audioSeul: false
    }
}

function flashResetAll() {
    flashStop();
    flashResetConfig();
    flashSyncDOMfromConfig();
    flashResetDOMStyles();
}

function flashTest() {
    flashConfig = {
        video: "",
        image: "../images/jeanmichel.png",
        texte: "slt les enfants",
        duree: "auto",
        volume: 1,
        vitesse: 2,
        audioSeul: false
    }
    flashStart();
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (flash.style.display === "flex") {
            const mediaActif = flashVideo.style.display !== "none" ? flashVideo : (flashImage.style.display !== "none" ? flashImage : null);
            if (mediaActif) flashUpscale(mediaActif);
        }
    }, 100); // petit délai pour les perfs
});