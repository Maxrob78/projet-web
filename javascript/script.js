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

    function chargerCours() {
        if (!conteneurCours && !conteneurFormations) return;

        fetch('../json/cours-formations.json?t=' + Date.now())
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

    chargerCours();


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
        document.getElementById('legende-form').innerHTML = "modifier l'élément";

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
        document.getElementById('legende-form').innerHTML = "ajouter un élément";

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
                    resetFormulaire();
                    chargerCours();
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
        if (flash.style.display !== "flex" || !flashConfig.texte) return;
        flashAjusterTitre(); 
    }, 100);
});


/* ==========================================================================
   10. FLASH MEDIA — CONFIG & VALIDATION
   ========================================================================== */

const flashConfig_default = {
    video:   "",
    image:   "",
    texte:   "",
    duree:   "auto",
    time:    0,
    volume:  1,
    vitesse: 1,
    isAudio: false
};
let flashConfig = { ...flashConfig_default }; 

function flashValide() {
    // Durée
    if (flashConfig.duree !== 'inf') {
        const parsedDuree = parseFloat(flashConfig.duree);
        flashConfig.duree = (isNaN(parsedDuree) || parsedDuree <= 0) ? 'auto' : parsedDuree;
    }

    // Configs vidéo
    if (flashConfig.video) {
        const parsedTime = parseFloat(flashConfig.time);
        flashConfig.time = (isNaN(parsedTime) || parsedTime < 0) ? 0 : parsedTime;

        const parsedVolume = parseFloat(flashConfig.volume);
        flashConfig.volume = isNaN(parsedVolume) ? 1 : Math.min(Math.max(parsedVolume, 0), 1);

        const parsedVitesse = parseFloat(flashConfig.vitesse);
        flashConfig.vitesse = isNaN(parsedVitesse) ? 1 : Math.min(Math.max(parsedVitesse, 0.1), 16);

        if (flashConfig.image) flashConfig.isAudio = true;
        else {
            const ext = flashConfig.video.split('.').pop().toLowerCase();
            const formatsAudio = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
            flashConfig.isAudio = formatsAudio.includes(ext)
                ? true
                : (typeof flashConfig.isAudio === 'boolean' ? flashConfig.isAudio : false);
        }
    }

    // Nettoyage & encodage des URLs
    flashConfig.video = encodeURI(String(flashConfig.video ?? "").trim());
    flashConfig.image = encodeURI(String(flashConfig.image ?? "").trim());
    flashConfig.texte = String(flashConfig.texte ?? "").trim();

    if (!flashConfig.video && !flashConfig.image && !flashConfig.texte) {
        console.warn("flash vide => transparent par défaut :", flashConfig);
    }
    else console.log("Config Flash validée :", flashConfig);
}


/* ==========================================================================
   11. FLASH MEDIA — LECTURE (flashStart)
   ========================================================================== */

function flashStart() {
    flashStop();
    flashValide();
    flashSyncDOMfromConfig();

    const promesse = new Promise((resolve) => {
        window.removeEventListener('flashSucces', resolve);
        window.addEventListener('flashSucces', resolve, { once: true });
    });

    let hasVideo = !!flashVideo.src;
    let hasImage = !!flashImage.src;

    // Affichage
    flash.style.display = "flex";
    if (flashConfig.texte) {
        flashTitre.style.visibility = "hidden";
        flashTitre.style.display = "block";

        if (!hasImage && (flashConfig.isAudio || !hasVideo)) {
            flash.classList.add('noMedia');
            flashAjusterTitre();
        } 
        else flash.classList.remove('noMedia');
    }
    if (hasImage) {
        flashImage.style.visibility = "hidden";
        flashImage.style.display = "block";

        if (flashImage.complete) flashUpscale(flashImage);
        else flashImage.onload  = () => flashUpscale(flashImage);
        flashImage.onerror = () => {
            if (hasVideo) {
                console.warn("Erreur image, passage en audio seul");
                flashImage.style.display = "none";
                flashImage.removeAttribute('src');
                hasImage = false;
                flashAjusterTitre();
            } else { 
                console.error("Erreur lecture image"); 
                flashStop(false); 
            } 
        };
    }
    if (hasVideo) {
        flashVideo.volume       = flashConfig.volume;
        flashVideo.playbackRate = flashConfig.vitesse;
        if (!flashConfig.isAudio) {
            flashVideo.style.visibility = "hidden";
            flashVideo.style.display = "block";
        }

        if (flashVideo.readyState >= 1) {
            if (!flashConfig.isAudio) flashUpscale(flashVideo);
            flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;
        } else {
            flashVideo.onloadedmetadata = () => {
                if (!flashConfig.isAudio) flashUpscale(flashVideo);
                flashVideo.currentTime = (flashConfig.time < flashVideo.duration) ? flashConfig.time : 0;
            };
        }
        flashVideo.onerror = () => { 
            if (hasImage) {
                console.warn("Erreur vidéo, image seule");
                flashVideo.removeAttribute('src');
                flashVideo.load();
                hasVideo = false;
            } else { 
                console.error("Erreur lecture vidéo"); 
                flashStop(false); 
            } 
        };

        // Lecture vidéo
        flashVideo.play()
            .then(() => flashAutostop(true))
            .catch(err => {
                if (err.name === 'NotAllowedError' && !flashConfig.isAudio) {
                    console.warn("Autoplay bloqué, passage en mute");
                    flashVideo.muted = true;
                    flashVideo.play()
                        .then(() => flashAutostop(true))
                        .catch(() => {
                            console.error("Lecture bloquée.");
                            flashStop(false);
                        })
                } else {
                    if (hasImage) {
                        console.warn("Erreur lecture vidéo, image seule.");
                        flashAutostop();
                    } else {
                        console.error("Erreur lecture vidéo :", err);
                        flashStop(false);
                    }
                }
            })
    }
    else flashAutostop();

    return promesse;
}


/* ==========================================================================
   12. FLASH MEDIA — ARRÊT 
   ========================================================================== */

let flashTimeout;

function flashAutostop(aVideo = false) {
    if (flashConfig.duree === 'inf') {
        if (aVideo) flashVideo.loop = true;
    } else if (typeof flashConfig.duree === 'number') {
        if (aVideo) flashVideo.loop = true;
        flashTimeout = setTimeout(() => flashStop(true), flashConfig.duree * 1000);
    } else {
        if (aVideo) flashVideo.onended = () => flashStop(true);
        else flashTimeout = setTimeout(() => flashStop(true), 7000);
    }
}

function flashStop(succes) {
    clearTimeout(flashTimeout);

    flashVideo.onloadedmetadata = null;
    flashVideo.onerror          = null;
    flashVideo.onended          = null;
    flashImage.onload           = null;
    flashImage.onerror          = null;

    flashVideo.pause();
    flashVideo.currentTime = 0;
    flashVideo.muted       = false;
    flashVideo.loop        = false;

    flash.style.display      = "none";
    flashTitre.style.display = "none";
    flashImage.style.display = "none";
    flashVideo.style.display = "none";
    flashWrapper.style.removeProperty('--natW');
    flashWrapper.style.removeProperty('--natH');
    flashTitre.style.removeProperty('--finalWidth');
    flashTitre.style.removeProperty('--charsLine');

    flashVideo.removeAttribute('src');
    flashImage.removeAttribute('src');
    flashTitre.innerHTML = "";
    flashVideo.load();

    // Notif si succès
    if (succes) window.dispatchEvent(new CustomEvent('flashSucces'));
}


/* ==========================================================================
   13. FLASH MEDIA — MISE À L'ÉCHELLE
   ========================================================================== */

function flashUpscale(media) {
    if (!media || media.style.display === "none") return;

    const originalW = media.tagName === 'IMG' ? media.naturalWidth  : media.videoWidth;
    const originalH = media.tagName === 'IMG' ? media.naturalHeight : media.videoHeight;
    
    if (originalW === 0 || originalH === 0) return;

    flashWrapper.style.setProperty('--natW', originalW);
    flashWrapper.style.setProperty('--natH', originalH);

    flashAjusterTitre(35, media);
}

function flashAjusterTitre(charsPerLine = 35, mediaRef) {
    if (!flashTitre || !flashConfig.texte) {
        if (mediaRef) mediaRef.style.visibility = "visible";
        return;
    }

    const w = mediaRef ? flashWrapper.offsetWidth  : window.innerWidth;
    const h = mediaRef ? flashWrapper.offsetHeight : window.innerHeight;

    const largeurRef = Math.min(Math.max(w, h), window.innerWidth);
    const largeurFinale = largeurRef * 0.95;

    flashTitre.style.setProperty('--finalWidth', `${largeurFinale}px`);
    flashTitre.style.setProperty('--charsLine', charsPerLine);

    requestAnimationFrame(() => {
        const hauteurMax = h * 0.8;
        let taillePolice = parseFloat(getComputedStyle(flashTitre).fontSize);

        while (flashTitre.offsetHeight > hauteurMax && taillePolice > 10) {
            taillePolice -= 1; 
            flashTitre.style.fontSize = `${taillePolice}px`;
        }

        flashTitre.style.visibility = "visible"
        if (mediaRef) mediaRef.style.visibility = "visible";
    });
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
    flashConfig = { ...flashConfig_default };
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
    flashConfig.video = "../videos/Screaming chicken on tree meme.mp4";
    flashStart().then(() => console.log("test réussi"));
}

const flashPage = () => window.open("flashPage.html");