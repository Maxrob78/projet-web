<?php include 'header.php'; ?>

    <section id="apropos">
        <h2>PLUS D'INFORMATIONS</h2>
        <p>En CSS, le padding crée de l'espace entre le contenu d'un élément et sa bordure, influant uniquement sur
            l'intérieur de l'élément. En revanche, le margin détermine l'espace autour de l'élément, séparant celui-ci
            des autres éléments voisins. Le padding affecte la taille totale de l'élément (ajouté au contenu), tandis
            que le margin ne modifie pas la taille mais contrôle l'espacement extérieur. Cela permet une gestion précise
            de l'agencement visuel sans altérer les dimensions ou la position relative des éléments.</p>
    </section>

    <div class="conteneur">
        <h2>COURS</h2>
        <div id="liste-cours" class="cours">
        </div>
    </div>

    <div class="conteneur">
        <h2>FORMATIONS</h2>
        <div id="liste-formations" class="cours">
        </div>
    </div>

    <section id="contactretour">
        <form action="#" method="post" name="Quiz" id="QuizId" class="box" onsubmit="return false">
            <fieldset id="informations">
                <legend>AJOUTER UN COURS OU UNE FORMATION</legend>

                <p>
                    <label for="nom">Nom</label><br>
                    <input type="text" id="nom" name="nom">
                </p>

                <p>
                    <label for="description">Description</label><br>
                    <textarea id="description" name="description" rows="4"></textarea>
                </p>
                <p>
                    <label for="type-choix">Type</label><br>
                    <select id="type-choix">
                        <option value="cours">Cours</option>
                        <option value="formations">Formation</option>
                    </select>
                </p>
                <div id="drop-zone" class="upload-box">
                    Glissez votre image ici ou cliquez pour choisir
                    <input type="file" id="file-input" style="display:none">
                </div>
                <div class="form-actions">
                    <button id="submitbtn" type="submit">Envoyer</button>
                    <button id="cancelbtn" type="button" style="display:none" onclick="annulerModification()">Annuler</button>
                </div>
        </form>
    </section>

<?php include 'footer.php'; ?>