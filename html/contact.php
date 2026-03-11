<?php
// Configuration de la page
$pageTitle = "Contact";
$currentPage = "contact";

// Traitement du formulaire
$messageSucces = "";
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit-form'])) {
    $nom = htmlspecialchars($_POST['nom']);
    $messageSucces = "Merci $nom, votre message a bien été reçu !";
}

include '../includes/header.php';
?>

<section id="apropos">
    <h2>À PROPOS</h2>
    <p>Le département informatique de l’EFREI constitue le moteur d’innovation de l’école, où l'excellence académique rencontre les défis technologiques de demain. Composé d'enseignants-chercheurs passionnés et d'experts du secteur, notre département se dédie à la formation d'ingénieurs agiles, capables de jongler entre architecture logicielle, cybersécurité, intelligence artificielle et systèmes embarqués. En nous contactant, vous entrez en relation avec un écosystème dynamique tourné vers l'avenir : nous sommes à votre entière disposition pour discuter de vos projets de partenariats, de l'intégration de nos talents au sein de vos équipes ou pour vous éclairer sur la richesse de nos parcours pédagogiques. Ensemble, faisons de la technologie un levier de transformation durable.</p>
</section>

<section id="apropos" style="padding-top: 10px;">
    <h2>PROCEDURES D'ADMISSIONS</h2>
    <p>Pour candidater à l'Efrei via Parcoursup, il faut suivre trois étapes : d'abord formuler ses vœux en recherchant Puissance Alpha sur Parcoursup et en sélectionnant une ou plusieurs prépas de l'Efrei (il est conseillé d'en choisir plusieurs pour maximiser ses chances) ; ensuite finaliser son dossier en rédigeant un projet de formation motivé expliquant son intérêt pour la formation ; et enfin participer aux épreuves écrites du concours Puissance Alpha, dont les modalités et dates sont disponibles sur leur site officiel.</p>
</section>
<div class="map-container" onclick="this.classList.add('active')" onmouseleave="this.classList.remove('active')">

    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1l3OA8lR1VFPuScNyeKb8i5refkkKsOQ&ehbc=2E312F&noprof=1"
        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>
</div>
<?php if ($messageSucces): ?>
    <p style="color: #00bafe;font-weight: bold;text-align: center;"><?php echo $messageSucces; ?></p>
<?php endif; ?>

<section id="contactretour">

    <form action="contact.php" method="post" name="Quiz" id="contactID" class="box">
        <fieldset id="informations">
            <legend>CONTACT</legend>

            <p>
                <label for="nom">Nom</label><br>
                <input type="text" id="nom" name="nom" required>
            </p>

            <p>
                <label for="email">Adresse Email</label><br>
                <input type="email" id="email" name="email" required>
            </p>

            <p>
                <label for="sujet">Sujet</label><br>
                <input type="text" id="sujet" name="sujet" required>
            </p>

            <p>
                <label for="message">Message</label><br>
                <textarea id="message" name="message" rows="4" required></textarea>
            </p>
            <button id="submitbtn" type="submit" name="submit-form">Envoyer</button>
        </fieldset>
    </form>
    <div id="imgcontact">
        <img id="tkt" src="../images/tkt.jpg" alt="Support">
    </div>
</section>

<?php include '../includes/footer.php'; ?>