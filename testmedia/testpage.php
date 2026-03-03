<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système Media : Page de test</title>
    <!-- ========== CSS SYSTEME MEDIA LE FICHIER CI-DESSOUS ========== -->
    <link rel="stylesheet" href="media.css">

    <style>
        /* RESET & BASE */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: sans-serif; 
            background: #f0f0f0; 
            height: 200vh; /* Pour tester le scroll */
            padding: 50px;
        }

        /* INTERFACE DE TEST (Panneau de contrôle) */
        .demo-ui {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
        }
        .demo-ui label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
            padding: 8px;
            border-radius: 4px;
        }
         /* On ajuste aussi le label du titre pour qu'il soit bien aligné */
        .demo-ui label[style*="flex-direction: column"] {
            align-items: stretch !important; /* Force le contenu à s'étirer */
            background: transparent;        /* Enlève le gris pour le titre si tu préfères */
            padding: 0;
        }
        h2 { margin-bottom: 15px; }
        
        .drop-zone { transition: all 0.3s ease; padding-right: 35px; position: relative;}
        .drop-zone.hover { border-color: #27ae60 !important; background: #e8f5e9; }
        .drop-zone.success { border-style: solid; border-color: #27ae60 !important; color: #27ae60 !important; background: #fafffa; }

        .reset-btn {
            display: none;
            position: absolute;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            padding: 5px 10px;
            font-size: 12px;
            z-index: 10;
            line-height: 1;
            transition: all 0.2s;

            /* COMPORTEMENT PAR DÉFAUT (Écrans larges / PC) */
            top: 8px;    /* Calé en haut */
            right: 8px;  /* Calé à droite */
            transform: none; 
        }

        .reset-btn:hover {
            background: #c0392b !important;
            transform: scale(1.1);
        }

        #input-texte {
            width: 100%;             /* Prend toute la largeur disponible */
            padding: 12px;           /* Plus de confort pour écrire */
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            margin-top: 5px;
            display: block;          /* Force le champ à prendre sa propre ligne */
        }

        /* Nouveau style pour le bouton START */
        #start-btn:disabled {
            background: #ccc !important; /* Gris */
            cursor: not-allowed;        /* Curseur "interdit" */
            opacity: 0.6;               /* Un peu transparent */
            transform: none !important; /* Pas d'effet de clic */
        }
        #start-btn {
            background: #27ae60; color: white; border: none; width: 100%; 
            padding: 15px; cursor: pointer; font-weight: bold; border-radius: 5px;
        }
        #start-btn:hover { background: #219150; }

        /* Le conteneur du bouton */
        .tooltip-wrapper {
            position: relative;
            width: 100%;
        }

        /* L'infobulle (Le rectangle noir) */
        .tooltip-wrapper::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 135%; /* On le monte un peu pour laisser de la place à la flèche */
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            /* Ajout de la transition ici pour que le délai fonctionne */
            transition: opacity 0.3s ease, visibility 0.3s ease;
            transition-delay: 0s;
            z-index: 1001;
            pointer-events: none;
        }

        /* La flèche (Le triangle) */
        .tooltip-wrapper::before {
            content: "";
            position: absolute;
            bottom: 110%; /* Positionnée entre le bouton et le tooltip */
            left: 50%;
            transform: translateX(-50%);
            
            /* CONSTRUCTION DU TRIANGLE VERS LE BAS */
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 10px solid #333; /* Couleur sur le bord HAUT pour pointer vers le BAS */
            
            opacity: 0;
            visibility: hidden;
            /* Ajout de la transition ici aussi pour que le délai soit identique */
            transition: opacity 0.3s ease, visibility 0.3s ease;
            transition-delay: 0s;
            z-index: 1000;
        }

        /* Affichage au survol avec le délai de 0.5s */
        .tooltip-wrapper:hover::after,
        .tooltip-wrapper:hover::before {
            opacity: 1;
            visibility: visible;
            transition-delay: 0.5s; 
        }

        /* Sécurité : si le bouton est activé, on cache l'infobulle */
        .tooltip-wrapper:has(button:not(:disabled))::after,
        .tooltip-wrapper:has(button:not(:disabled))::before {
            display: none;
        }

        /* SECTION GUIDE */
        .external-docs {
            max-width: 800px;
            margin: 30px auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .container-presentation p {
            margin: 10px 0;
            color: #555;
            font-size: 0.9rem;
        }

        .layers-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
        }

        .layer-item {
            font-size: 0.85rem;
            padding: 8px 12px;
            background: #f0f4f8;
            border-radius: 4px;
            color: #444;
        }

        .layer-item strong {
            color: #2980b9;
        }

        .guide-grid, .tech-stack {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .guide-item, .tech-box {
            padding: 12px;
            background: #fdfdfd;
            border-radius: 6px;
            border-left: 4px solid #27ae60;
        }

        .tech-box {
            border-left-color: #2980b9; /* Bleu pour distinguer la partie technique */
        }

        .doc-divider {
            margin: 25px 0;
            border: 0;
            border-top: 1px solid #eee;
        }

        h3 { color: #2c3e50; font-size: 1.1rem; }
        h4 { font-size: 0.9rem; margin-bottom: 5px; color: #34495e; }
        p { font-size: 0.85rem; color: #666; line-height: 1.4; }

        @media (max-width: 600px) {

            body {
                padding: 15px; /* On réduit l'espace autour sur mobile */
            }

            .demo-ui {
                padding: 15px;
            }

            /* Les zones de Drag & Drop passent l'une sous l'autre */
            .demo-ui div[style*="display: flex; gap: 10px"] {
                flex-direction: column !important;
            }

            /* On adapte les sliders : le texte au-dessus, le slider dessous */
            .demo-ui label {
                flex-wrap: wrap;
                gap: 10px;
            }

            .demo-ui label div[style*="flex-grow: 1"] {
                order: 2; /* On déplace le chiffre à droite du nom */
                flex-grow: 0 !important;
            }

            .demo-ui input[type="range"] {
                width: 100%; /* Le slider prend toute la largeur sur sa propre ligne */
                order: 3;
            }

            .reset-btn {
                top: 50%;               /* Centré verticalement */
                right: 8px;            /* Un peu plus d'espace du bord */
                transform: translateY(-50%); /* Ajustement pour le centrage parfait */

                padding: 4px 8px;      /* Bouton légèrement plus gros pour le toucher (doigt) */
                font-size: 10px;
                border-radius: 3px;
            }

            .drop-zone {
                height: 80px; /* Un peu moins haut pour gagner de la place */
                padding-right: 30px;
            }

            .guide-grid, .tech-stack { grid-template-columns: 1fr; }
        }

    </style>
</head>
<body>

    <!-- ========== HTML CONTENEUR MEDIA DANS LE FICHIER EN DESSOUS ========== -->
    <?php include("media.php");?>

    <div class="demo-ui">
        <h2>Panneau de contrôle</h2>
        
        <p>1. Règle les options :</p>
        <div style="margin: 15px 0; display: flex; flex-direction: column; gap: 10px;">
            <label style="cursor: pointer;">
                Mode Audio uniquement (cache la vidéo)
                <input type="checkbox" id="audio-toggle"> 
            </label>
            <label>
                <span>Vitesse :</span>
                <span style="flex-grow: 1; text-align: right; margin-right: 10px;">
                    <span id="speed-val">1</span>x
                </span>
                <input type="range" id="speed-slider" min="0.5" max="4" step="0.1" value="1" style="vertical-align: middle;">
            </label>
            
            <label>
                <span>Volume :</span>
                <span style="flex-grow: 1; text-align: right; margin-right: 10px;">
                    <span id="volume-val">100</span>%
                </span>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" style="vertical-align: middle;">
            </label>
        </div>

        <p>2. Configuration des médias :</p>
        <div style="display: flex; gap: 10px; margin: 15px 0;">
            <div id="drop-image" class="drop-zone" style="position: relative; flex: 1; height: 100px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; text-align: center; cursor: pointer; border-radius: 8px; font-size: 0.8rem; color: #666;">
                <span class="label-text">Glissez l'IMAGE ici<br>(ou cliquez)</span>
                <button class="reset-btn" onclick="clearMedia('image', event)">X</button>
                <input type="file" id="file-image" accept="image/*" style="display: none;">
            </div>

            <div id="drop-video" class="drop-zone" style="position: relative; flex: 1; height: 100px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; text-align: center; cursor: pointer; border-radius: 8px; font-size: 0.8rem; color: #666;">
                <span class="label-text">Glissez la VIDÉO ici<br>(ou cliquez)</span>
                <button class="reset-btn" onclick="clearMedia('video', event)">X</button>
                <input type="file" id="file-video" accept="video/*" style="display: none;">
            </div>
        </div>

        <label style="display: flex; flex-direction: column; gap: 5px;">
            Titre du média :
            <input type="text" id="input-texte" placeholder="Entrez votre titre ici..." style="padding: 10px; border-radius: 4px; border: 1px solid #ccc;">
        </label>
        
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; justify-content: space-between; align-items: center;">
                Forcer la durée (en ms ou 'inf') :
                <input type="text" id="start-duration" placeholder="Ex: 5000" style="width: 80px; padding: 5px; border-radius: 4px; border: 1px solid #ccc;">
            </label>
            <div id="start-wrapper" class="tooltip-wrapper" data-tooltip="bah met un truc au moins">
                <button id="start-btn" onclick="lancerAvecDuree()" disabled>▶ LANCER LE MÉDIA</button>
            </div>
            <button onclick="resetUI()" style="margin-top: 10px; background: #95a5a6; color: white; border: none; width: 100%; padding: 10px; cursor: pointer; border-radius: 5px; font-size: 0.8rem;">
                🗑️ RÉINITIALISER TOUTE L'INTERFACE
            </button>
        </div>
    </div>

    <div class="external-docs">
        <section class="container-presentation">
            <h3>🖥️ Présentation du Conteneur Média</h3>
            <p>Le conteneur est une interface "Overlay" plein écran conçue pour isoler le contenu. Il s'adapte dynamiquement selon que le média possède une image ou s'il s'agit d'un contenu uniquement sonore.</p>
            <div class="layers-info">
                <div class="layer-item"><strong>Couche Fond :</strong> Arrière-plan transparent ou noir pour isoler le média.</div>
                <div class="layer-item"><strong>Couche Média :</strong> Vidéo ou Image centrée avec <code>object-fit: contain</code>.</div>
                <div class="layer-item"><strong>Couche Titre :</strong> Texte style "Impact" avec contour noir, positionné en bas ou au centre.</div>
            </div>
        </section>

        <hr class="doc-divider">

        <section class="guide-usage">
            <h3>💡 Guide de fonctionnement</h3>
            <div class="guide-grid">
                <div class="guide-item">
                    <strong>🖼️ Image seule</strong>
                    <p>Affichage statique. Par défaut : 10 secondes (sauf si "Boucle" est activé).</p>
                </div>
                <div class="guide-item">
                    <strong>🎬 Vidéo standard</strong>
                    <p>Affichage classique. Se ferme automatiquement à la fin du fichier via l'événement <code>onended</code>.</p>
                </div>
                <div class="guide-item">
                    <strong>🎙️ Mode Audio (MP3 ou Forcé)</strong>
                    <p>La vidéo est masquée. Le titre <strong>Impact</strong> se centre automatiquement au milieu de l'écran.</p>
                </div>
                <div class="guide-item">
                    <strong>🎭 Mode Mixte (Img + Vid)</strong>
                    <p>L'image s'affiche à l'écran tandis que la vidéo joue la piste sonore en arrière-plan.</p>
                </div>
            </div>
            <p style="margin-top: 15px; font-style: italic; color: #888;">Note : Le titre seul (sans image ni vidéo) active aussi le centrage automatique.</p>
        </section>

        <hr class="doc-divider">

        <section class="tech-analysis">
            <h3>⚙️ Analyse technique du système</h3>
            <div class="tech-stack">
                <div class="tech-box">
                    <h4>1. Validation (validateConfig)</h4>
                    <p>Analyse l'extension (ex: .mp3) pour activer le mode <code>audio</code> et nettoie les paramètres de volume/vitesse.</p>
                </div>
                <div class="tech-box">
                    <h4>2. Mise en scène (mediaStart)</h4>
                    <p>Applique la classe <code>.title-only</code> si le mode audio est actif pour modifier le layout CSS.</p>
                </div>
                <div class="tech-box">
                    <h4>3. Sécurité Autoplay</h4>
                    <p>Gère les blocages navigateurs en passant la vidéo en muet si nécessaire pour garantir l'affichage visuel.</p>
                </div>
                <div class="tech-box">
                    <h4>4. Gestion Mémoire</h4>
                    <p>Le <code>mediaStop</code> vide physiquement les sources (<code>src=""</code>) pour libérer instantanément la RAM.</p>
                </div>
            </div>
        </section>
    </div>

    <!-- ========== SCRIPT CONTENEUR MEDIA DANS LE FICHIER EN DESSOUS========== -->
    <script src="media.js"></script>

    <script>
        // Affiche la valeur du slider en temps réel vitesse
        const speedSlider = document.getElementById('speed-slider');
        const speedDisplay = document.getElementById('speed-val');

        speedSlider.addEventListener('input', () => {
            speedDisplay.textContent = speedSlider.value;
        });

        // Affichage du pourcentage en temps réel volume
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-val');

        volumeSlider.addEventListener('input', () => {
            volumeDisplay.textContent = Math.round(volumeSlider.value * 100);
        });

        // Gestion du Drag & Drop et du texte
        const zones = [
            { id: 'drop-image', inputId: 'file-image', type: 'image' },
            { id: 'drop-video', inputId: 'file-video', type: 'video' }
        ];

        // Vérifie le bouton dès qu'on tape du texte
        document.getElementById('input-texte').addEventListener('input', verifierEtatBouton);

        zones.forEach(zone => {
            const el = document.getElementById(zone.id);
            const input = document.getElementById(zone.inputId);

            // Clic pour ouvrir l'explorateur
            el.onclick = () => input.click();

            // Changement de fichier
            input.onchange = (e) => chargerFichier(e.target.files[0], zone);

            // Drag & Drop events
            el.ondragover = (e) => { e.preventDefault(); el.classList.add('hover'); };
            el.ondragleave = () => el.classList.remove('hover');
            el.ondrop = (e) => {
                e.preventDefault();
                el.classList.remove('hover');
                chargerFichier(e.dataTransfer.files[0], zone);
            };
        });

        // MODIFICATION de chargerFichier pour afficher le bouton reset
        function chargerFichier(file, zone) {
            if (!file) return;
            const url = URL.createObjectURL(file);
            mediaConfig[zone.type] = url;
            
            const el = document.getElementById(zone.id);
            el.classList.add('success');
            el.querySelector('.label-text').innerHTML = `✅ ${file.name.substring(0, 12)}...`;
            el.querySelector('.reset-btn').style.display = 'block'; // On montre le X
            verifierEtatBouton();
        }

        // NOUVELLE FONCTION pour vider le média
        function clearMedia(type, event) {
            event.stopPropagation(); // Empêche d'ouvrir l'explorateur de fichiers en cliquant sur le X

            if (mediaConfig[type]) URL.revokeObjectURL(mediaConfig[type]);
            
            mediaConfig[type] = ""; // On vide la config
            
            const zoneId = (type === 'image') ? 'drop-image' : 'drop-video';
            const inputId = (type === 'image') ? 'file-image' : 'file-video';
            const labelDefault = (type === 'image') ? "Glissez l'IMAGE ici<br>(ou cliquez)" : "Glissez la VIDÉO ici<br>(ou cliquez)";
            
            const el = document.getElementById(zoneId);
            el.classList.remove('success');
            el.querySelector('.label-text').innerHTML = labelDefault;
            el.querySelector('.reset-btn').style.display = 'none'; // On cache le X
            document.getElementById(inputId).value = ""; // Reset de l'input HTML
            verifierEtatBouton();
        }

        // Fonction pour lancer le média avec une durée forcée (en ms ou 'inf')
        function lancerAvecDuree() {
            // On récupère le texte du champ input
            mediaConfig.texte = document.getElementById('input-texte').value.trim();

            // synchronise la config avec l'UI au dernier moment
            mediaConfig.enAudio = document.getElementById('audio-toggle').checked;
            mediaConfig.vitesse = parseFloat(document.getElementById('speed-slider').value);
            mediaConfig.volume = parseFloat(document.getElementById('volume-slider').value);

            const dureeSaisie = document.getElementById('start-duration').value.trim();
            
            mediaStart();
        }

        function verifierEtatBouton() {
            const btn = document.getElementById('start-btn');
            const texte = document.getElementById('input-texte').value.trim();
            
            // On active si on a une image OU une vidéo OU du texte
            const aDuContenu = mediaConfig.image || mediaConfig.video || texte;
            
            btn.disabled = !aDuContenu;
        }

        function resetUI() {
            // 1. Appel du moteur de reset média (Mémoire + DOM invisible)
            mediaReset();

            console.log("[UI] Réinitialisation des contrôles...");

            // 2. Reset du Texte et de la Durée
            document.getElementById('input-texte').value = "";
            document.getElementById('start-duration').value = "";

            // 3. Reset des Sliders et Checkbox
            document.getElementById('audio-toggle').checked = false;
            
            const sSlider = document.getElementById('speed-slider');
            sSlider.value = 1;
            document.getElementById('speed-val').textContent = "1";

            const vSlider = document.getElementById('volume-slider');
            vSlider.value = 1;
            document.getElementById('volume-val').textContent = "100";

            // 4. Reset visuel des zones de Drag & Drop
            // On réutilise tes fonctions existantes pour nettoyer les zones Image et Vidéo
            // On passe un faux événement pour éviter l'erreur sur stopPropagation()
            const fakeEvent = { stopPropagation: () => {} };
            clearMedia('image', fakeEvent);
            clearMedia('video', fakeEvent);

            // 5. Mise à jour de l'état du bouton START (il doit se griser)
            verifierEtatBouton();

            console.log("[UI] Interface prête.");
        }

    </script>

</body>
</html>