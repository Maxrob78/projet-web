/* ==========================================================================
   TABLE DES MATIÈRES
   1.  HEADER — TRANSITION AU SCROLL
   2.  CARROUSELS — MULTI-INSTANCE
   3.  THÈME — DARK MODE
   4.  COURS & FORMATIONS — CHARGEMENT JSON
   5.  COURS & FORMATIONS — FORMULAIRE (CRUD)
   6.  COURS & FORMATIONS — DROP ZONE (DRAG & DROP)
   7.  COURS & FORMATIONS — SUBMIT AJAX
   8.  VIDÉO — LECTURE AU SURVOL
   9.  FLASH MEDIA — INITIALISATION & RESIZE
   10. FLASH MEDIA — CONFIG & VALIDATION
   11. FLASH MEDIA — LECTURE (flashStart)
   12. FLASH MEDIA — ARRÊT (flashStop)
   13. FLASH MEDIA — MISE À L'ÉCHELLE (flashUpscale / flashAjusterTitre)
   14. FLASH MEDIA — UTILITAIRES (sync, reset, test)
   ========================================================================== */


/* ==========================================================================
   1–8  LOGIQUE PRINCIPALE (dans DOMContentLoaded)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =========================================================================
    // 1. HEADER — TRANSITION AU SCROLL
    // =========================================================================

    const header = document.querySelector('header');
    const hero   = document.querySelector('.hero');

    if (header && hero) {
        window.addEventListener('scroll', function () {
            if (window.scrollY >= hero.offsetHeight - 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }


    // =========================================================================
    // 2. CARROUSELS — MULTI-INSTANCE
    // =========================================================================

    document.querySelectorAll('.carousel-container').forEach(container => {
        showSlides(container, 1);
    });

    // Exposées sur window car appelées depuis les attributs onclick du HTML
    window.plusSlides = function (button, n) {
        const container = button.closest('.carousel-container');
        if (!container) return;

        const slides = container.querySelectorAll(".mySlides");
        let currentIndex = 1;

        slides.forEach((slide, i) => {
            if (slide.style.display === "block") currentIndex = i + 1;
        });

        showSlides(container, currentIndex + n);
    };

    window.currentSlide = function (dot, n) {
        const container = dot.closest('.carousel-container');
        if (container) showSlides(container, n);
    };

    function showSlides(container, n) {
        const slides = container.querySelectorAll(".mySlides");
        const dots   = container.querySelectorAll(".dot");

        if (slides.length === 0) return;

        if (n > slides.length) n = 1;
        if (n < 1)             n = slides.length;

        slides.forEach(slide => slide.style.display = "none");
        dots.forEach(dot => dot.classList.remove("active"));

        slides[n - 1].style.display = "block";
        if (dots[n - 1]) dots[n - 1].classList.add("active");
    }


    // =========================================================================
    // 3. THÈME — DARK MODE
    // =========================================================================

    const toggleBtn = document.getElementById('theme-toggle');

    if (toggleBtn) {
        if (localStorage.getItem('theme') === 'dark') {
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


    // =========================================================================
    // 4. COURS & FORMATIONS — CHARGEMENT JSON
    // =========================================================================

    const conteneurCours      = document.getElementById('liste-cours');
    const conteneurFormations = document.getElementById('liste-formations');

    if (conteneurCours || conteneurFormations) {
        fetch('../json/cours-formations.json')
            .then(response => response.json())
            .then(data => {
                const creerCarte = (item, type) => `
                    <div class="carte"
                         onclick="preparerModification('${item.id}', '${item.nom}', \`${item.description.replace(/'/g, "\\'")}\`, '${type}', '${item.image}')"
                         style="cursor: pointer;">
                        <img src="${item.image}" alt="${item.nom}">
                        <div class="info" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            <h3>${item.nom}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;

                if (data.cours && conteneurCours) {
                    conteneurCours.innerHTML = "";
                    data.cours.forEach(item => conteneurCours.innerHTML += creerCarte(item, 'cours'));
                }
                if (data.formations && conteneurFormations) {
                    conteneurFormations.innerHTML = "";
                    data.formations.forEach(item => conteneurFormations.innerHTML += creerCarte(item, 'formations'));
                }
            })
            .catch(error => console.error("Erreur de chargement JSON :", error));
    }


    // =========================================================================
    // 5. COURS & FORMATIONS — FORMULAIRE (CRUD)
    // =========================================================================

    window.preparerModification = function (id, nom, description, type, image) {
        document.getElementById('item-id').value        = id;
        document.getElementById('nom').value            = nom;
        document.getElementById('description').value    = description;
        document.getElementById('type-choix').value     = type;
        document.getElementById('submitbtn').textContent = "Mettre à jour";
        document.getElementById('deletebtn').style.display = "block";

        const dropZone = document.getElementById('drop-zone');
        dropZone.style.backgroundImage    = `url(${image})`;
        dropZone.style.backgroundSize     = "cover";
        dropZone.style.backgroundPosition = "center";
        document.getElementById('drop-text').style.display = "none";

        document.getElementById('contactretour').scrollIntoView({ behavior: 'smooth' });
    };

    window.supprimerItem = function (id, type) {
        if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

        fetch('../includes/supprimer_cours.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, type })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) location.reload();
            else alert("Erreur : " + data.message);
        });
    };

    window.resetFormulaire = function () {
        document.getElementById('QuizId').reset();
        document.getElementById('item-id').value           = "";
        document.getElementById('submitbtn').textContent   = "Envoyer";
        document.getElementById('deletebtn').style.display = "none";

        const dropZone = document.getElementById('drop-zone');
        dropZone.style.backgroundImage = "none";
        document.getElementById('drop-text').style.display = "block";
    };

    const btnSupprForm = document.getElementById('deletebtn');
    if (btnSupprForm) {
        btnSupprForm.addEventListener('click', function () {
            const id   = document.getElementById('item-id').value;
            const type = document.getElementById('type-choix').value;
            if (id && type) window.supprimerItem(id, type);
        });
    }


    // =========================================================================
    // 6. COURS & FORMATIONS — DROP ZONE (DRAG & DROP)
    // =========================================================================

    const dropZone  = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        // Bloquer le comportement par défaut sur tous les events drag
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); });
        });

        dropZone.addEventListener('dragover',  () => dropZone.classList.add('hover'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));

        const handleFile = (file) => {
            if (!file || !file.type.startsWith('image/')) return;

            const previewUrl = URL.createObjectURL(file);
            dropZone.style.backgroundImage    = `url(${previewUrl})`;
            dropZone.style.backgroundSize     = "cover";
            dropZone.style.backgroundPosition = "center";

            const dropText = document.getElementById('drop-text');
            if (dropText) dropText.style.display = "none";

            // Injecter le fichier dans l'input natif
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        };

        fileInput.addEventListener('change', e => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });

        dropZone.addEventListener('drop', e => {
            dropZone.classList.remove('hover');
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
    }


    // =========================================================================
    // 7. COURS & FORMATIONS — SUBMIT AJAX
    // =========================================================================

    const quizForm = document.getElementById('QuizId');

    if (quizForm) {
        quizForm.addEventListener('submit', function (e) {
            e.preventDefault();

            fetch('../includes/ajouter_cours.php', {
                method: 'POST',
                body: new FormData(this)
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


    // =========================================================================
    // 8. VIDÉO — LECTURE AU SURVOL
    // =========================================================================

    document.querySelectorAll('.video-hover-container').forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;

        container.addEventListener('mouseenter', () => {
            video.muted = true;
            video.play().catch(err => console.log("Lecture bloquée :", err));
        });

        container.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

}); // fin DOMContentLoaded


/* ==========================================================================
9. FLASH MEDIA — INITIALISATION & RESIZE
========================================================================== */

const flash        = document.querySelector('#flashMedia');
const flashVideo   = document.querySelector('#flashVideo');
const flashImage   = document.querySelector('#flashImg');
const flashTitre   = document.querySelector('#flashTitre');
const flashWrapper = document.querySelector('.mediaWrapper');

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!flash || flash.style.display !== "flex") return;

        const mediaActif = flashVideo.style.display !== "none" ? flashVideo
                        : flashImage.style.display  !== "none" ? flashImage
                        : null;

        if (mediaActif) flashUpscale(mediaActif);
    }, 100);
});


/* ==========================================================================
10. FLASH MEDIA — CONFIG & VALIDATION
========================================================================== */

let flashConfig = {
    video:     "",
    image:     "",
    texte:     "",
    duree:     "auto",
    time:      0,
    volume:    1,
    vitesse:   1,
    audioSeul: false
};

function flashVerifConfig() {
    // Durée
    if (flashConfig.duree !== 'inf') {
        const parsedDuree = parseFloat(flashConfig.duree);
        flashConfig.duree = (isNaN(parsedDuree) || parsedDuree <= 0) ? 'auto' : parsedDuree;
    }

    if (!flashConfig.video) {
        // Pas de vidéo : on réinitialise les paramètres audio/vidéo
        flashConfig.time      = 0;
        flashConfig.volume    = 1;
        flashConfig.vitesse   = 1;
        flashConfig.audioSeul = false;
    } else {
        // Timestamp (>= 0)
        const parsedTime = parseFloat(flashConfig.time);
        flashConfig.time = (isNaN(parsedTime) || parsedTime < 0) ? 0 : parsedTime;

        // Vitesse (doit être > 0)
        const parsedVitesse = parseFloat(flashConfig.vitesse);
        flashConfig.vitesse = (isNaN(parsedVitesse) || parsedVitesse <= 0) ? 1 : parsedVitesse;

        // Volume (entre 0 et 1)
        const parsedVolume = parseFloat(flashConfig.volume);
        flashConfig.volume = isNaN(parsedVolume) ? 1 : Math.min(Math.max(parsedVolume, 0), 1);

        // audioSeul : forcé à false si une image est présente
        if (flashConfig.image) {
            flashConfig.audioSeul = false;
        } else {
            const ext = flashConfig.video.split('.').pop().toLowerCase();
            const formatsAudio = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
            flashConfig.audioSeul = formatsAudio.includes(ext)
                ? true
                : (typeof flashConfig.audioSeul === 'boolean' ? flashConfig.audioSeul : false);
        }
    }

    // Nettoyage & encodage des URLs
    flashConfig.video = typeof flashConfig.video === 'string' ? encodeURI(flashConfig.video.trim()) : "";
    flashConfig.image = typeof flashConfig.image === 'string' ? encodeURI(flashConfig.image.trim()) : "";
    flashConfig.texte = typeof flashConfig.texte === 'string' ? flashConfig.texte.trim() : "";

    console.log("Config Flash validée :", flashConfig);
}


/* ==========================================================================
11. FLASH MEDIA — LECTURE (flashStart)
========================================================================== */

let flashTimeout;

function flashStart() {
    flashStop();
    flashVerifConfig();

    const hasVideo = !!flashVideo && flashConfig.video !== "";
    const hasImage = !!flashImage && flashConfig.image !== "";

    // Mode audio seul ou aucun média : on affiche uniquement le titre
    if (flashConfig.audioSeul || (!hasVideo && !hasImage)) {
        flash.classList.add('titreSeul');
        if (flashConfig.texte) flashAjusterTitre(window.innerWidth, window.innerHeight);
    } else {
        flash.classList.remove('titreSeul');
    }

    if (!hasVideo && !hasImage && !flashConfig.texte) return;

    flashSyncDOMfromConfig();
    if (flashConfig.texte) flashTitre.style.display = "block";
    flash.style.display = "flex";

    // --- Affichage et lecture ---
    if (hasVideo) {
        flashVideo.volume       = flashConfig.volume;
        flashVideo.playbackRate = flashConfig.vitesse;

        if (hasImage) {
            // Vidéo (audio) + Image
            let errImg = false;
            let errVid = false;

            flashImage.style.display = "block";
            flashImage.onerror = () => {
                console.warn("Erreur image, passage en audio seul");
                flashImage.style.display = "none";
                errImg = true;
                if (errVid) flashStop();
            };
            flashVideo.onerror = () => {
                console.warn("Erreur vidéo, image seule");
                errVid = true;
                if (errImg) flashStop();
            };
            if (flashVideo.readyState >= 1) flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;
            flashVideo.onloadedmetadata = () => flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;

            flashVideo.play().catch(err => console.warn("Erreur lecture mixte :", err));
            flashImage.onload = () => flashUpscale(flashImage);
            if (flashImage.complete) flashUpscale(flashImage);

        } else {
            // Vidéo seule
            if (!flashConfig.audioSeul) {
                flashVideo.style.display = "block";
                if (flashVideo.readyState >= 1) {
                    flashUpscale(flashVideo);
                    flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;
                }
                flashVideo.onloadedmetadata = () => {
                    flashUpscale(flashVideo);
                    flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;
                }
            }

            flashVideo.onerror = () => { console.error("Erreur lecture vidéo"); flashStop(); };
            flashVideo.play().catch(err => {
                if (err.name === 'NotAllowedError' && !flashConfig.audioSeul) {
                    console.warn("Autoplay bloqué, passage en mute");
                    flashVideo.muted = true;
                    flashVideo.play();
                } else {
                    console.error("Erreur lecture vidéo :", err);
                    flashStop();
                }
            });
        }

    } else if (hasImage) {
        // Image seule
        flashImage.style.display = "block";
        flashImage.onload  = () => flashUpscale(flashImage);
        flashImage.onerror = () => { console.error("Erreur lecture image"); flashStop(); };
        if (flashImage.complete) flashUpscale(flashImage);
    }

    // --- Gestion de la fermeture ---
    if (flashConfig.duree === 'inf') {
        if (hasVideo) flashVideo.loop = true;
    } else if (typeof flashConfig.duree === 'number') {
        if (hasVideo) flashVideo.loop = true;
        flashTimeout = setTimeout(() => flashStop(), flashConfig.duree * 1000);
    } else {
        if (hasVideo) flashVideo.onended = () => flashStop();
        else flashTimeout = setTimeout(() => flashStop(), 5000);
    }
}


/* ==========================================================================
12. FLASH MEDIA — ARRÊT (flashStop)
========================================================================== */

function flashStop() {
    clearTimeout(flashTimeout);

    // Nettoyage des callbacks
    flashVideo.onloadedmetadata = null;
    flashVideo.onerror          = null;
    flashVideo.onended          = null;
    flashImage.onload           = null;
    flashImage.onerror          = null;

    // Réinitialisation de la vidéo
    flashVideo.pause();
    flashVideo.currentTime = 0;
    flashVideo.muted       = false;
    flashVideo.loop        = false;

    // Masquage des éléments
    flashVideo.style.display = "none";
    flashImage.style.display = "none";
    flashTitre.style.display = "none";
    flash.style.display      = "none";
    flashWrapper.style.width  = "";
    flashWrapper.style.height = "";

    // Nettoyage des sources
    flashVideo.removeAttribute('src');
    flashImage.removeAttribute('src');
    flashTitre.innerHTML = "";
    flashVideo.load();
}


/* ==========================================================================
13. FLASH MEDIA — MISE À L'ÉCHELLE
========================================================================== */

function flashUpscale(media) {
    if (!media || media.style.display === "none") return;

    const originalW = media.tagName === 'IMG' ? media.naturalWidth  : media.videoWidth;
    const originalH = media.tagName === 'IMG' ? media.naturalHeight : media.videoHeight;
    if (originalW === 0 || originalH === 0) return;

    // Mode "contain" : on prend le ratio le plus petit pour ne jamais couper
    const scale  = Math.min(window.innerWidth / originalW, window.innerHeight / originalH);
    const finalW = Math.floor(originalW * scale);
    const finalH = Math.floor(originalH * scale);

    flashWrapper.style.width  = `${finalW}px`;
    flashWrapper.style.height = `${finalH}px`;
    media.style.width  = "100%";
    media.style.height = "100%";

    flashAjusterTitre(finalW, finalH);
}

function flashAjusterTitre(w, h, charsPerLine = 35) {
    if (!flashTitre || !flashConfig.texte) return;

    // Largeur de référence basée sur le plus grand côté, plafonnée à l'écran
    const largeurReference = Math.min(Math.max(w, h), window.innerWidth);
    const largeurFinale    = largeurReference * 0.95;
    flashTitre.style.width = `${largeurFinale}px`;

    // Taille de police calculée pour ~35 caractères par ligne
    let taillePolice = largeurFinale / (charsPerLine * 0.58);
    flashTitre.style.fontSize = `${taillePolice}px`;

    // Sécurité : réduire si le titre dépasse 80% de la hauteur du média
    const hauteurMax = h * 0.8;
    while (flashTitre.offsetHeight > hauteurMax && taillePolice > 10) {
        taillePolice -= 2;
        flashTitre.style.fontSize = `${taillePolice}px`;
    }

    flashTitre.style.webkitTextStroke = `${taillePolice / 10}px black`;
}


/* ==========================================================================
14. FLASH MEDIA — UTILITAIRES
========================================================================== */

function flashSyncDOMfromConfig() {
    if (flashConfig.video) flashVideo.src = flashConfig.video;
    else flashVideo.removeAttribute('src');

    if (flashConfig.image) flashImage.src = flashConfig.image;
    else flashImage.removeAttribute('src');

    flashTitre.innerHTML = flashConfig.texte || "";
    flashVideo.load();
}

function flashResetConfig() {
    flashConfig = {
        video:     "",
        image:     "",
        texte:     "",
        duree:     "auto",
        time:      0,
        volume:    1,
        vitesse:   1,
        audioSeul: false
    };
}

function flashResetDOMStyles() {
    [flash, flashVideo, flashImage, flashTitre, flashWrapper].forEach(el => el.removeAttribute('style'));
}

function flashResetAll() {
    flashStop();
    flashResetConfig();
    flashSyncDOMfromConfig();
    flashResetDOMStyles();
}

// Fonction de test rapide (à retirer en production)
function flashTest() {
    flashResetConfig(); 

    flashConfig.image = "../images/jeanmichel.png";
    flashConfig.texte = "slt les enfants";
    
    flashStart();
}