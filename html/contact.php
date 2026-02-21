<?php include 'header.php'; ?>

    <section id="apropos">
        <h2>À PROPOS</h2>
        <p>En CSS, le padding crée de l'espace entre le contenu d'un élément et sa bordure, influant uniquement sur
            l'intérieur de l'élément. En revanche, le margin détermine l'espace autour de l'élément, séparant celui-ci
            des autres éléments voisins. Le padding affecte la taille totale de l'élément (ajouté au contenu), tandis
            que le margin ne modifie pas la taille mais contrôle l'espacement extérieur. Cela permet une gestion précise
            de l'agencement visuel sans altérer les dimensions ou la position relative des éléments.</p>
    </section>
    <section id="contactretour">
        <form action="#" method="post" name="Quiz" id="QuizId" class="box" onsubmit="return false">
            <fieldset id="informations">
                <legend>CONTACT</legend>

                <p>
                    <label for="nom">Nom</label><br>
                    <input type="text" id="nom" name="nom">
                </p>

                <p>
                    <label for="email">Adresse Email</label><br>
                    <input type="email" id="email" name="email">
                </p>

                <p>
                    <label for="sujet">Sujet</label><br>
                    <input type="text" id="sujet" name="sujet">
                </p>

                <p>
                    <label for="message">Message</label><br>
                    <textarea id="message" name="message" rows="4"></textarea>
                </p>
                <button id="submitbtn" type="submit">Envoyer</button>
            </fieldset>
        </form>
        <div id="imgcontact">
            <img id="tkt" src="../images/tkt.jpg" alt="Photo d'un membre de l'équipe de support">
        </div>
    </section>
 
<?php include 'footer.php'; ?>