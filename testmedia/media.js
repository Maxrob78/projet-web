// MÉMOIRE DE CONFIG
let mediaConfig = {
    video: "",
    image: "",
    texte: "",
    vitesse: 1,
    volume: 1,
    duree: "auto",
    delaiBtn: "auto",
    enAudio: false,
    pleinEcran: false,
    btnFermer: false,
};

let mediaTimeout;
let btnTimeout;

// ÉLÉMENTS DU DOM
const container = document.getElementById('media-container');
const videoEl = document.getElementById('media-video');
const imageEl = document.getElementById('media-img');
const titreEl = document.getElementById('media-title');
const wrapperEl = document.querySelector('.media-wrapper');
const btnFermerEl = document.querySelector('.close-btn');

// 1. FONCTION DE VALIDATION DE LA CONFIG
function validateConfig() {
    const logs = []; 
    console.log("[SYSTEM] Validation de la configuration...");

    // DÉTECTION AUTOMATIQUE DE L'AUDIO (Basée sur l'extension)
    if (mediaConfig.video) {
        const extension = mediaConfig.video.split('.').pop().toLowerCase();
        const formatsAudio = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
        
        // Si c'est un fichier audio, on FORCE le mode audio à true
        if (formatsAudio.includes(extension)) {
            mediaConfig.enAudio = true;
            logs.push(`Audio forcé (format ${extension} détecté)`);
        } 
        else {
            if (mediaConfig.image && mediaConfig.video) {
                mediaConfig.enAudio = false;
                logs.push(`Audio : reset à false (image + vidéo détecté)`);
            }
            else if (typeof mediaConfig.enAudio !== "boolean") {
                mediaConfig.enAudio = false;
                logs.push(`Audio : reset à false (mauvais format)`);
            }
        }
    }
    else {
        mediaConfig.enAudio = false;
        logs.push(`Audio : reset à false (pas de vidéo)`);
    }

    // 2. VOLUME (Sécurité entre 0 et 1)
    const oldVol = mediaConfig.volume;
    let vol = parseFloat(mediaConfig.volume);
    mediaConfig.volume = isNaN(vol) ? 1 : Math.min(Math.max(vol, 0), 1);
    if (mediaConfig.volume !== oldVol) logs.push(`Volume ajusté: ${oldVol} -> ${mediaConfig.volume}`);

    // 3. VITESSE (Sécurité > 0)
    const oldVit = mediaConfig.vitesse;
    let vit = parseFloat(mediaConfig.vitesse);
    mediaConfig.vitesse = (isNaN(vit) || vit <= 0) ? 1 : vit;
    if (mediaConfig.vitesse !== oldVit) logs.push(`Vitesse ajustée: ${oldVit} -> ${mediaConfig.vitesse}`);

    // 5. URLS & TEXTE (Nettoyage des espaces)
    const fixUrl = (p) => encodeURI((p || "").trim());
    mediaConfig.video = fixUrl(mediaConfig.video);
    mediaConfig.image = fixUrl(mediaConfig.image);
    mediaConfig.texte = (mediaConfig.texte || "").trim();

    // VALIDATION AUDIO, PLEIN ECRAN + BOUTON FERMER
    ['enAudio', 'pleinEcran', 'btnFermer'].forEach(key => {
        if (typeof mediaConfig[key] !== "boolean") {
            mediaConfig[key] = false;
            logs.push(`${key} : reset à false (mauvais format)`);
        }
    });

    // VALIDATION DELAI BOUTON + DUREE
    ['duree', 'delaiBtn'].forEach(key => {
        
        // CAS SPÉCIAL : Si on traite le bouton mais qu'il est désactivé
        if (key === 'delaiBtn' && !mediaConfig.btnFermer) {
            mediaConfig.delaiBtn = "auto";
            logs.push(`${key} : reset à "auto" (bouton désactivé)`);
            return; // On passe au tour suivant
        }

        // Nettoyage de la valeur brute
        let raw = String(mediaConfig[key] || "").trim().toLowerCase();

        if (raw === "" || raw === "auto") {
            mediaConfig[key] = "auto";
        } 
        else if (raw === "inf" && key === 'duree') {
            mediaConfig[key] = "inf";
        } 
        else if (raw === 'onloop' && key === 'delaiBtn') {
            mediaConfig[key] = "onloop";
        }
        else {
            let num = Number(raw);
            // Si pas un nombre ou <= 0 -> on retombe en "auto"
            if (isNaN(num) || num <= 0) {
                logs.push(`Valeur "${raw}" pour ${key} incorrecte. Switch en "auto".`);
                mediaConfig[key] = "auto";
            } else {
                mediaConfig[key] = num;
            }
        }
    });

    // 7. VÉRIFICATION FINALE : Y a-t-il quelque chose à lancer ?
    if (!mediaConfig.video && !mediaConfig.image && !mediaConfig.texte) {
        console.error("Erreur : La configuration est totalement vide.");
        return false;
    }

    // --- AFFICHAGE DES RÉSULTATS DANS LA CONSOLE ---
    if (logs.length > 0) {
        console.groupCollapsed("Validation Media Pro : " + logs.length + " points vérifiés");
        logs.forEach(msg => console.log(`• ${msg}`));
        console.groupEnd();
    }

    return true; // Tout est prêt pour mediaStart()
}

// 2. FONCTION START : On affiche selon la logique demandée
function mediaStart() {
    if (!validateConfig()) {
        console.error("Configuration invalide !");
        return;
    }

    // --- NETTAYAGE COMPLET + RESET AFFICHAGES ---
    clearTimeout(mediaTimeout); 
    clearTimeout(btnTimeout);

    videoEl.onended = null;
    videoEl.onerror = null;
    imageEl.onerror = null;

    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.muted = false;
    videoEl.loop = false;

    videoEl.style.display = "none";
    imageEl.style.display = "none";
    titreEl.style.display = "none";
    wrapperEl.style.display = "flex";
    btnFermerEl.style.display = "none";

    videoEl.style.width = "";
    videoEl.style.height = "";
    imageEl.style.width = "";
    imageEl.style.height = "";


    let imageErreur = false;
    let videoErreur = false;

    const mode = mediaConfig.duree;

    // --- LOGIQUE DE LANCEMENT ---
    if (mediaConfig.texte) {
        titreEl.textContent = mediaConfig.texte;
        titreEl.style.display = "block";
    }

    // Détection du mode "Texte Seul"
    if (mediaConfig.enAudio || (mediaConfig.texte && !mediaConfig.image && !mediaConfig.video)) {
        wrapperEl.classList.add('title-only');
    } else {
        wrapperEl.classList.remove('title-only');
    }

    // 3 CAS POSSIBLES : MIXTE, IMAGE ou VIDEO
    if (mediaConfig.image && mediaConfig.video) {
        // Chargement ressources
        imageEl.src = mediaConfig.image;
        imageEl.style.display = "block";
        imageEl.onload = () => ajusterTailleMedia(imageEl, false);

        videoEl.src = mediaConfig.video;
        videoEl.playbackRate = mediaConfig.vitesse;
        videoEl.volume = mediaConfig.volume;
        videoEl.muted = false;

        // Gestion des erreurs
        // 1. erreur de sources
        imageEl.onerror = () => {
            imageErreur = true;
            imageEl.style.display = "none"; 
            console.warn("Image du mix introuvable. On garde le son.");
            
            // Si la vidéo a AUSSI crashé avant ou en même temps
            if (videoErreur) {
                console.error("Échec total (Image + Son) : Arrêt du média.");
                mediaStop();
            }
        };
        videoEl.onerror = () => {
            videoErreur = true;
            console.warn("Fichier vidéo (audio) introuvable. On garde l'image.");
            
            // Si l'image a AUSSI crashé
            if (imageErreur) {
                console.error("Échec total (Son + Image) : Arrêt du média.");
                mediaStop();
            }
        };

        // erreur de lecture vidéo
        videoEl.play().catch(error => {
            if (error.name === "NotAllowedError") {
                console.warn("Autoplay bloqué par le navigateur : L'image reste, mais sans son.");
            } else {
                videoErreur = true;
                console.error("Erreur de lecture vidéo :", error.message);
                if (imageErreur) mediaStop();
            }
        });
    } 
    else if (mediaConfig.image) {
        imageEl.src = mediaConfig.image;
        imageEl.style.display = "block";
        imageEl.onload = () => ajusterTailleMedia(imageEl, false);

        imageEl.onerror = () => {
            console.error("Image seule introuvable.");
            mediaStop();
        };
    } 
    else if (mediaConfig.video) {
        videoEl.src = mediaConfig.video;
        videoEl.playbackRate = mediaConfig.vitesse;
        videoEl.volume = mediaConfig.volume;
        if (!mediaConfig.enAudio) { 
            videoEl.style.display = "block";
            videoEl.addEventListener('loadedmetadata', () => ajusterTailleMedia(videoEl, true), { once: true });
        }

        videoEl.onerror = () => {
            console.error("Vidéo seule introuvable.");
            mediaStop();
        };

        videoEl.play().catch(error => {
            if (error.name === "NotAllowedError" && !mediaConfig.enAudio) {
                console.warn("Autoplay bloqué : Passage en muet pour afficher la vidéo.");
                // on essaye de jouer la vidéo en muet qd elle est toute seule
                videoEl.muted = true;
                videoEl.play().catch(e2 => mediaStop());
            } else {
                console.error("Erreur lecture vidéo seule.");
                mediaStop();
            }
        });
    }

    // --- LOGIQUE DE FIN UNIQUE MEDIA ---
    if (mode === 'inf') {
        // MODE INFINI : La vidéo boucle, l'image reste. Pas de timer.
        if (mediaConfig.video) videoEl.loop = true;
        console.log("Comportement : Persistant (∞)");
    } 
    else if (typeof mode === 'number') {
        // MODE TIMER : On force l'arrêt après X ms. 
        // Note: On met la vidéo en boucle pour éviter un écran noir si le timer est plus long que la vidéo.
        if (mediaConfig.video) videoEl.loop = true; 
        mediaTimeout = setTimeout(() => mediaStop(), mode);
        console.log(`Comportement : Arrêt programmé dans ${mode}ms`);
    } 
    else {
        // MODE AUTO : Le comportement intelligent par défaut
        console.log("Comportement : Automatique");
        if (mediaConfig.video) {
            // Une vidéo en auto s'arrête à la fin de sa lecture
            videoEl.onended = () => mediaStop();
        } else {
            // Une image en auto reste 10 secondes
            mediaTimeout = setTimeout(() => mediaStop(), 10000);
        }
    }

    // --- LOGIQUE BOUTON FERMER ---  
      
    if (mediaConfig.btnFermer) {
        const delai = mediaConfig.delaiBtn;

        if (mediaConfig.video && delai === 'onloop') {
            if (videoEl.loop) {
                // Si ya une vidéo bouclée, on attend la fin de la première lecture
                videoEl.addEventListener('loadedmetadata', () => {
                    btnTimeout = setTimeout(() => {
                        btnFermerEl.style.display = "block";
                    }, videoEl.duration * 1000 / mediaConfig.vitesse); 
                }, { once: true });
            }
        }
        else if (typeof delai === 'number') {
            // CAS : Délai manuel défini
            btnTimeout = setTimeout(() => {
                btnFermerEl.style.display = "block";
            }, delai);
        } 
        // CAS : auto
        else btnFermerEl.style.display = "block";
    }

    container.style.display = "flex";
}

// 3. FONCTION STOP : On ferme et on coupe tout
function mediaStop() {
    // Nettoyage de tous les timers et écouteurs
    clearTimeout(mediaTimeout); 
    clearTimeout(btnTimeout);

    videoEl.onended = null;
    videoEl.onerror = null;
    imageEl.onerror = null;

    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.muted = false;
    videoEl.loop = false;

    container.style.display = "none";
    videoEl.style.display = "none";
    imageEl.style.display = "none";
    btnFermerEl.style.display = "none";

    videoEl.src = "";
    imageEl.src = "";
    videoEl.style.width = "";
    videoEl.style.height = "";
    imageEl.style.width = "";
    imageEl.style.height = "";


    console.log("Média arrêté et nettoyé.");
}

function syncDOMFromConfig() {
    console.log("[SYSTEM] Synchronisation du DOM...")

    videoEl.src = mediaConfig.video;
    videoEl.volume = mediaConfig.volume;
    videoEl.playbackRate = mediaConfig.vitesse;

    imageEl.src = mediaConfig.image;

    titreEl.textContent = mediaConfig.texte;

    console.log("[SYSTEM] Synchronisation terminée.");
}

function resetDOMStyles() {
    console.log("[SYSTEM] Reset complet des styles JS (Retour aux règles CSS)");
    
    // Liste des éléments recevant des styles inline via ajusterTailleMedia
    const elementsToReset = [container, imageEl, videoEl, titreEl, wrapperEl, btnFermerEl];
    
    elementsToReset.forEach(el => {
        if (el) {
            el.removeAttribute('style'); 
        }
    });
}

function resetConfig() {
    console.log("[SYSTEM] Reset complet de la configuration");
    mediaConfig = {
        video: "",
        image: "",
        texte: "",
        vitesse: 1,
        volume: 1,
        duree: "auto",
        delaiBtn: "auto",
        enAudio: false,
        pleinEcran: false,
        btnFermer: false,
    };
}

function mediaResetAll() {
    mediaStop();
    resetConfig();
    syncDOMFromConfig();
    resetDOMStyles();
}

// FONCTION DE REDIMENSIONNEMENT PARFAIT (Plein écran sans vide)
function ajusterTailleMedia(element, isVideo) {
    // Si l'élément n'est pas affiché, on ne fait rien
    if (!element || element.style.display === "none" || !element.src) return;

    // 1. Récupération des dimensions d'origine du fichier
    const wOrigine = isVideo ? element.videoWidth : element.naturalWidth;
    const hOrigine = isVideo ? element.videoHeight : element.naturalHeight;
    
    // Sécurité si l'image n'a pas eu le temps de charger ses métadonnées
    if (!wOrigine || !hOrigine) return; 

    if (!mediaConfig.pleinEcran) return;

    // 2. Calcul du multiplicateur pour remplir l'écran (Simulation de object-fit: contain)
    const ratioLargeur = window.innerWidth / wOrigine;
    const ratioHauteur = window.innerHeight / hOrigine;
    const echelle = Math.min(ratioLargeur, ratioHauteur); // On prend le plus petit pour ne pas dépasser

    // 3. Application des dimensions exactes en pixels
    element.style.width = Math.floor(wOrigine * echelle) + "px";
    element.style.height = Math.floor(hOrigine * echelle) + "px";
    
    console.log(`[RESIZE] Média ajusté à ${element.style.width} x ${element.style.height}`);
}

// 4. Écouteur pour recalculer si l'utilisateur redimensionne sa fenêtre
window.addEventListener("resize", () => {
    if (container.style.display === "flex") {
        ajusterTailleMedia(imageEl, false);
        ajusterTailleMedia(videoEl, true);
    }
});