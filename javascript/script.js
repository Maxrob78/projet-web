/* ==========================================================================
   TABLE DES MATIÈRES
   1.  HEADER — TRANSITION AU SCROLL
   2.  CARROUSELS — MULTI-INSTANCE
   3.  THÈME — DARK MODE
   4.  COURS & FORMATIONS — CHARGEMENT JSON
   5.  COURS & FORMATIONS — FORMULAIRE (CRUD)
   6.  COURS & FORMATIONS — DROP ZONE (DRAG & DROP)
   7.  COURS & FORMATIONS — SUBMIT AJAX
   8.  VERIF DU FORMULAIRE CONTACT
   9.  FLASH MEDIA — INIT DOM & OBSERVERS
   10. FLASH MEDIA — CONFIG & VALIDATION
   11. FLASH MEDIA — LECTURE 
   12. FLASH MEDIA — ARRÊT 
   13. FLASH MEDIA — MISE À L'ÉCHELLE 
   14. FLASH MEDIA — UTILITAIRES 
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
        document.getElementById('submitbtn').textContent   = "Enregistrer";
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
    // 8. VERIF DU FORMULAIRE CONTACT
    // =========================================================================

    const motsInterdits = [
        { mot: "burger",  image: "../images/burger.jpg"   },
        { mot: "ketchup", image: "../images/ketchup.jpg"  },
        { mot: "mustard", image: "../images/mustard.jpg" },
        { mot: "mango",   image: "../images/mango.jpg"    },
        { mot: "67",      image: "../images/SCP-067.jpg"  },
    ];
    const bonusvideo = "../videos/sentence.mp4"; 

    const attendre = (s) => new Promise(resolve => setTimeout(resolve, s * 1000));
    let tentativesInterdit = 0;
    let sanctionEnCours = false;

    function trouverMotsInterdit(message) {
        const msgLower = message.toLowerCase();
        return motsInterdits.filter(({ mot }) => msgLower.includes(mot));
    }

    async function sanction(flashTrouvees, avecBonus) {
        const dureeflashMots = tentativesInterdit >= 3 ? 1 : 0.2;
        sanctionEnCours = true;

        try {
            flashResetConfig();
            flashConfig.image = flashTrouvees[0].image;
            flashConfig.duree = "inf";
            if (tentativesInterdit >= 3) flash.style.background = "black";
            await flashStart();
            await attendre(dureeflashMots);

            for (let i = 1; i < flashTrouvees.length; i++) {
                flashResetConfig();
                flashConfig.image = flashTrouvees[i].image;
                flashConfig.duree = "inf";
                await flashStart(true);
                await attendre(dureeflashMots);
            }

            if (avecBonus) {
                flashResetConfig();
                await countdownFinal("");

                flashConfig.video = bonusvideo;
                await flashStart(true);
                setTimeout(() => { 
                    flashTitre.textContent = "souffre mtn"; 
                }, 10000);
                await flashDone();
            }
            else flashStop(1);
        } catch {}
        finally {
            flashResetDOMStyles();
            sanctionEnCours = false;
        }
    }

    async function countdownFinal(titreFixe = "", secondes = 10) {
        const formaterTemps = (s) => `00:${String(s).padStart(2, '0')}`; // 00:10, 00:09, ... 00:00

        flashConfig.video = "../videos/décompte.mp4";
        flashConfig.image = "../images/SCP-067.jpg";
        flashConfig.texte = `<span style="font-size:4em;">${formaterTemps(secondes)}</span><br><br><br>${titreFixe}`;

        flash.style.backgroundColor = "#000";
        flashTitre.style.top        = "45%";
        flashImage.style.opacity    = 0;
        let opacite = 0;
        
        try { 
            await flashStart(true);
            flashImage.style.transition = "opacity 1.2s linear";
        } catch { return; }

        while (secondes >= 0) {
            await attendre(1.15);
            secondes--;
            opacite += 0.03;
            flashTitre.innerHTML = flashConfig.texte.replace(/00:\d{2}/, formaterTemps(secondes));
            flashImage.style.opacity = opacite;

            if (secondes == 0 || flashVideo.ended) break;
        }
        
        flashTitre.style.color = "red";
        await attendre(0.8);
        flashResetConfig();
        flashTitre.removeAttribute('style');
        flashImage.removeAttribute('style');
    }

    const contactForm = document.getElementById('contactID');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!this.checkValidity()) return;

            const data = new FormData(this);
            let valide = true;

            for (const [champ, val] of data.entries()) {
                if (val.trim() === "") {
                    valide = false;
                    break; 
                }
            }

            if (!valide) {
                e.preventDefault();
                alert("Formulaire mal rempli (champ rempli avec des espaces).");
                return;
            }

            const msg = data.get("message");
            const flashTrouvees = trouverMotsInterdit(msg);

            if (flashTrouvees.length > 0) {
                e.preventDefault();
                tentativesInterdit++;
                const avecBonus = tentativesInterdit >= 3;

                sanction(flashTrouvees, avecBonus).then(() => {
                    if (avecBonus) {
                        // simule le clic sur le bouton submit
                        const hidden = document.createElement('input');
                        hidden.type  = 'hidden';
                        hidden.name  = 'submit-form';
                        hidden.value = '';
                        contactForm.appendChild(hidden);
                        contactForm.submit();
                    }
                });
            }
        });

        document.getElementById('submitbtn').addEventListener('keydown', (e) => {
            if (sanctionEnCours) e.preventDefault();
        });
    }


    // =========================================================================
    // VEILLE
    // =========================================================================

    let veilleTimeout;
    let veilleActive = false;

    function lancerVeille() {
        veilleActive = true;
        flashResetConfig();
        flashConfig.video = "../videos/cinema.mp4";
        flashConfig.duree = "inf";
        flashStart();
    }

    function setVeille() {
        if (veilleActive) flashStop();
        clearTimeout(veilleTimeout);
        veilleTimeout = setTimeout(lancerVeille, 120000);
        veilleActive = false;
    }

    ["pointermove", "pointerdown", "keydown", "scroll", "wheel"].forEach(event => {
        window.addEventListener(event, setVeille, {passive: true});
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            flashStop();
            clearTimeout(veilleTimeout);
        }
        else setVeille();
    });
    window.addEventListener("blur", () => {
        flashStop();
        clearTimeout(veilleTimeout);
    });
    window.addEventListener("focus", setVeille);

    setVeille();


}); // fin DOMContentLoaded


/* ==========================================================================
   9. FLASH MEDIA — INIT DOM & OBSERVERS
   ========================================================================== */

const flash        = document.getElementById('flashMedia');
const flashVideo   = document.getElementById('flashVideo');
const flashImage   = document.getElementById('flashImg');
const flashTitre   = document.getElementById('flashTitre');
const flashWrapper = document.querySelector('.mediaWrapper');

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!flash._sessionId) return;
        const chars = flash.classList.contains('noMedia') ? 60 : 40;
        flashAjusterTitre(chars);
    }, 100);
});

const observerTitre = new MutationObserver(() => {
    if (!flash._sessionId) return;
    const chars = flash.classList.contains('noMedia') ? 60 : 40;
    flashAjusterTitre(chars);
    flashTitre.style.visibility = flashTitre.textContent.trim() ? "visible" : "hidden";
});

let mediaChangeTimeout;
let observerIgnore = false;
const observerMedia = new MutationObserver((mutations) => {
    if (!flash._sessionId || observerIgnore) return;

    const changed = new Set(mutations.map(m => m.target));

    clearTimeout(mediaChangeTimeout);
    mediaChangeTimeout = setTimeout(() => {
        changed.forEach(media => {
            if (media === flashVideo) flashConfig.video = flashVideo.getAttribute('src') ?? "";
            else flashConfig.image = flashImage.getAttribute('src') ?? "";
        });
        flashStart(true);
    }, 0);
});

observerTitre.observe(flashTitre, { childList: true, characterData: true, subtree: true });
observerMedia.observe(flashVideo, { attributes: true, attributeFilter: ['src'] });
observerMedia.observe(flashImage, { attributes: true, attributeFilter: ['src'] });


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
let flashConfig = {...flashConfig_default}; 

let videoChange = false;
function flashPrepare() {
    // Nettoyage & encodage des sources + vérif si aucune source
    flashConfig.video = encodeURI(String(flashConfig.video ?? "").trim());
    flashConfig.image = encodeURI(String(flashConfig.image ?? "").trim());
    flashConfig.texte = String(flashConfig.texte ?? "").trim();

    if (!flashConfig.video && !flashConfig.image && !flashConfig.texte) {
        console.warn("ajoutez au moins 1 src média ou un titre : ", flashConfig);
        return false;
    }

    // Configs vidéo
    if (flashConfig.video) {
        const ext = flashConfig.video.split('.').pop().toLowerCase();
        const formatsAudio = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
        
        flashConfig.time    = Math.max(parseFloat(flashConfig.time), 0) || 0;
        flashConfig.volume  = Math.min(Math.max(parseFloat(flashConfig.volume) || 0, 0), 1);
        flashConfig.vitesse = Math.min(Math.max(parseFloat(flashConfig.vitesse) || 0, 0.1), 16);
        flashConfig.isAudio = formatsAudio.includes(ext) || flashConfig.image ? true : flashConfig.isAudio === true;
    }

    // Durée
    if (flashConfig.duree !== 'inf') {
        const dur = parseFloat(flashConfig.duree);
        flashConfig.duree = dur > 0 ? dur : 'auto';
    }

    observerIgnore = true;
    videoChange = false;

    // Application des src dans le DOM 
    if (flashVideo.getAttribute('src') !== flashConfig.video) {
        videoChange = true;
        if (flashConfig.video) flashVideo.src = flashConfig.video;
        else flashVideo.removeAttribute('src');
        flashVideo.load();
    }

    if (flashImage.getAttribute('src') !== flashConfig.image) {
        if (flashConfig.image) flashImage.src = flashConfig.image;
        else flashImage.removeAttribute('src');
    }

    flashTitre.innerHTML = flashConfig.texte || "";

    // Préconfiguration des propriétés DOM vidéo 
    if (flashVideo.getAttribute('src')) {
        flashVideo.volume       = flashConfig.volume;
        flashVideo.playbackRate = flashConfig.vitesse;
        flashVideo.muted        = flashConfig.volume === 0;
        flashVideo.loop         = flashConfig.duree === 'inf' || typeof flashConfig.duree === 'number';
    }

    setTimeout(() => observerIgnore = false, 0);
    console.log("Flash préparé : ", flashConfig);
    return true;
}


/* ==========================================================================
   11. FLASH MEDIA — LECTURE
   ========================================================================== */

function whenImageLoad(image) {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
        image.onload  = resolve;
        image.onerror = reject;
    });
}

function whenVideoMeta(video) {
    if (video.readyState >= 1) return Promise.resolve();
    return new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror          = reject;
    });
}

let flashTimeout;

async function flashStart(isReload = false) {
    if (isReload && !flash._sessionId) throw "pas de session active à recharger.";
    
    flashStop(isReload ? "010_" : "");
    if (!flashPrepare()) { 
        flashStop(1110); 
        throw "config invalide"; 
    }

    if (!isReload) {
        flash._sessionId = Symbol();
        flash._settled   = false;
    }
    const sessionId = flash._sessionId; 
    const estActif  = () => flash._sessionId === sessionId;

    let hasVideo = flashVideo.getAttribute('src');
    let hasImage = flashImage.getAttribute('src');
    let hasTexte = flashTitre.textContent.trim();

    if (!hasImage && (flashConfig.isAudio || !hasVideo)) flash.classList.add('noMedia');
    else flash.classList.remove('noMedia');

    if (!hasVideo || flashConfig.isAudio) flashVideo.style.visibility = "hidden";
    if (!hasImage) flashImage.style.visibility = "hidden";
    if (!hasTexte) flashTitre.style.visibility = "hidden";
    if (!isReload) {
        flash.style.visibility = "hidden";
        flash.style.display    = "flex";
    }

    if (hasTexte) {
        flashTitre.style.visibility = "visible";
        if (flash.classList.contains('noMedia')) flashAjusterTitre(60);
    }

    // Chargement image + vidéo en parallèle
    const jobs = [];

    if (hasImage) {
        jobs.push(
            whenImageLoad(flashImage)
                .then(() => { 
                    if (estActif()) flashUpscale(flashImage);
                    flashImage.style.visibility = "visible"; 
                })
                .catch(() => { 
                    if (hasVideo) {
                        console.warn("Erreur image, audio seul.");
                        flashImage.style.visibility = "hidden";
                        flashImage.removeAttribute('src');
                        hasImage = false;
                        flashAjusterTitre();
                    } else {
                        flashStop(1110); 
                        throw "Erreur chargement image"; 
                    }
                })
        );
    }

    if (hasVideo) {
        jobs.push(
            whenVideoMeta(flashVideo)
                .then(() => {
                    if (!estActif()) throw "session annulée.";
                    if (!flashConfig.isAudio) {
                        flashUpscale(flashVideo);
                        flashVideo.style.visibility = "visible";
                    }
                    if (videoChange) flashVideo.currentTime = flashConfig.time < flashVideo.duration 
                        ? flashConfig.time : 0;
                })
                .catch(() => { 
                    if (hasImage) {
                        console.warn("Erreur vidéo, image seule.");
                        flashVideo.removeAttribute('src');
                        flashVideo.load();
                        hasVideo = false;
                    } else {
                        flashStop(1110);
                        throw "Erreur chargement vidéo";
                    }
                })
        );
    }

    await Promise.allSettled(jobs);
    if (!estActif()) throw "session annulée.";
    flash.style.visibility = "visible";

    // Lecture vidéo
    if (hasVideo) {
        try { await flashVideo.play(); }
        catch (err) {
            if (err.name === 'NotAllowedError' && !flashConfig.isAudio) {
                console.warn("Autoplay bloqué, passage en mute");
                flashVideo.muted = true;
                try { await flashVideo.play(); }
                catch {
                    flashStop(1110);
                    throw "erreur lecture vidéo bloquée.";
                }
            } 
            else if (hasImage) console.warn("Erreur lecture vidéo, image seule.");
            else {
                flashStop(1110);
                throw "erreur lecture vidéo.";
            }
        }
        if (!estActif()) { flashVideo.pause(); throw "session annulée."; }
    }

    // Gestion fermeture auto
    if (typeof flashConfig.duree === 'number') {
        flashTimeout = setTimeout(() => flashStop(1), flashConfig.duree * 1000);
    } else if (flashConfig.duree === 'auto') {
        if (hasVideo) flashVideo.onended = () => flashStop(1);
        else flashTimeout = setTimeout(() => flashStop(1), 7000);
    }
}


/* ==========================================================================
   12. FLASH MEDIA — ARRÊT
   ========================================================================== */

let resolveDone;
let rejectDone;
function flashDone() {
    if (resolveDone) window.removeEventListener('flashSucces', resolveDone);
    if (rejectDone)  window.removeEventListener('flashEchec',  rejectDone);

    return new Promise((resolve, reject) => {
        resolveDone = resolve;
        rejectDone  = reject;
        window.addEventListener('flashSucces', resolve, { once: true });
        window.addEventListener('flashEchec',  reject,  { once: true });
    });
}

function flashStop(code) {
    const ch = [...String(code)].map(c => parseInt(c)).slice(0, 4);
    while (ch.length < 4) ch.push(ch.at(-1) ?? NaN);

    if (ch[0] !== 0) {
        flash._sessionId = null;
        flash.style.display = "none";
    }
    if (ch[1] !== 0) {
        clearTimeout(flashTimeout);
        flashVideo.onended          = null;
        flashVideo.onloadedmetadata = null;
        flashVideo.onerror          = null;
        flashImage.onload           = null;
        flashImage.onerror          = null;
    }
    if (ch[2] !== 0) flashClearDOM();

    // notif si succès/échec (dans flashDone.then ou .catch)
    if (ch[3] > 0) {
        flash._settled = true;
        window.dispatchEvent(new CustomEvent('flashSucces'));
    } else if (ch[3] === 0 && !flash._settled) {
        flash._settled = true;
        window.dispatchEvent(new CustomEvent('flashEchec'));
    }
}


/* ==========================================================================
   13. FLASH MEDIA — MISE À L'ÉCHELLE
   ========================================================================== */

function flashUpscale(media) {
    if (!media || !flash._sessionId) return;

    const originalW = media.tagName === 'IMG' ? media.naturalWidth  : media.videoWidth;
    const originalH = media.tagName === 'IMG' ? media.naturalHeight : media.videoHeight;
    if (originalW === 0 || originalH === 0) return;

    flashWrapper.style.setProperty('--natW', originalW);
    flashWrapper.style.setProperty('--natH', originalH);

    flashAjusterTitre();
}

function flashAjusterTitre(charsPerLine = 40) {
    if (!flash._sessionId || !flashTitre.textContent.trim()) return;

    const w = flashWrapper.offsetWidth  || window.innerWidth;
    const h = flashWrapper.offsetHeight || window.innerHeight;
    if (w === 0 || h === 0) return;

    const largeurRef = Math.min(Math.max(w, h), window.innerWidth);
    const largeurFinale = largeurRef * 0.95;

    flashTitre.style.setProperty('--finalWidth', `${largeurFinale}px`);
    flashTitre.style.setProperty('--charsLine', charsPerLine);
    flashTitre.style.fontSize = "";

    requestAnimationFrame(() => {
        const hauteurMax = h * 0.8;

        if (flashTitre.offsetHeight > hauteurMax) {
            const tailleActuelle = parseFloat(getComputedStyle(flashTitre).fontSize);
            const ratio = hauteurMax / flashTitre.offsetHeight;
            flashTitre.style.fontSize = `${Math.max(tailleActuelle * ratio, 10)}px`;
        }
    });
}


/* ==========================================================================
   14. FLASH MEDIA — UTILITAIRES
   ========================================================================== */

function flashClearDOM() {
    flashVideo.removeAttribute('src');
    flashImage.removeAttribute('src');
    flashTitre.innerHTML =  "";
    flashVideo.load();
}

function flashResetConfig() {
    flashConfig = {...flashConfig_default};
}

function flashResetDOMStyles() {
    [flash, flashVideo, flashImage, flashTitre, flashWrapper].forEach(el => el.removeAttribute('style'));
}

function flashResetAll() {
    flashStop();
    flashResetConfig();
    flashResetDOMStyles();
}

// Fonction de test rapide (à retirer en production)
function flashTest() {
    flashResetConfig();
    flashConfig.video = "../videos/Screaming chicken on tree meme.mp4";
    flashConfig.texte = "le son";
    flashStart().catch((e) => console.log("échec test", e));
    flashDone().then(() => console.log("test réussi"))
}

function flashPage() {window.open("flashPage.html");}