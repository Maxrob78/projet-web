<?php
// Configuration de la page
$pageTitle = "Cours et Formations";
$currentPage = "cours";

include '../includes/header.php';
?>

<section id="apropos">
    <h2>Forger l'Expertise : Nos Parcours et Spécialisations</h2>
    <p>L'excellence pédagogique du département informatique de l'EFREI repose sur un cursus hybride, conçu pour transformer la passion technologique en expertise professionnelle. Nos formations couvrent l'intégralité du spectre numérique, allant des fondements de l'algorithmique et de l'architecture des systèmes aux spécialisations de pointe telles que la Data Science, la Cybersécurité, le Cloud Computing et le développement Full Stack. À travers une pédagogie par projets et un contact permanent avec les réalités industrielles, nous transmettons à nos étudiants non seulement une maîtrise technique rigoureuse, mais aussi les "soft skills" indispensables à tout leader de la tech. Que ce soit en cycle ingénieur ou en programmes experts, chaque parcours est une immersion totale dans l'innovation, garantissant une employabilité maximale au sein d'un marché en constante évolution.</p>
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
    <form action="ajouter_cours.php" method="POST" name="Quiz" id="QuizId" class="box" enctype="multipart/form-data">
        <fieldset id="informations">
            <legend id="legende-form" style="text-transform: uppercase;">ajouter un élément</legend>
            <input type="hidden" id="item-id" name="id" value="">
            <p>
                <label for="nom">Nom*</label><br>
                <input type="text" id="nom" name="nom" required>
            </p>

            <p>
                <label for="description">Description*</label><br>
                <textarea id="description" name="description" rows="5" required></textarea>
            </p>

            <p>
                <label for="type-choix">Type</label><br>
                <select id="type-choix" name="type-choix">
                    <option value="cours">Cours</option>
                    <option value="formations">Formation</option>
                </select>
            </p>

            <div id="drop-zone" class="upload-box">
                <span id="drop-text">Glissez votre image ici ou cliquez pour choisir</span>
            </div>
            <input type="file" id="file-input" name="image" style="display:none" accept="image/*">

            <div class="form-actions">
                <button id="submitbtn" type="submit">Enregistrer</button>
                <button type="button" id="deletebtn" class="btn-danger" style="display:none;">
                    Supprimer
                </button>
                <button type="button" id="resetbtn" class="btn-secondary" onclick="resetFormulaire()">
                    Annuler
                </button>
            </div>
        </fieldset>
    </form>
</section>

<?php include '../includes/footer.php'; ?>