<?php
// Configuration de la page
$pageTitle = "Contact";
$currentPage = "contact";

// Traitement du formulaire
$messageSucces = "";
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['nom'])) {
    $nom = htmlspecialchars($_POST['nom']);
    $messageSucces = "Merci $nom, votre message a bien été reçu !";
}

include '../includes/header.php';
?>

<section id="apropos">
    <h2>À PROPOS</h2>
    <p>Le département informatique de l’EFREI constitue le moteur d’innovation de l’école, où l'excellence académique rencontre les défis technologiques de demain. Composé d'enseignants-chercheurs passionnés et d'experts du secteur, notre département se dédie à la formation d'ingénieurs agiles, capables de jongler entre architecture logicielle, cybersécurité, intelligence artificielle et systèmes embarqués. En nous contactant, vous entrez en relation avec un écosystème dynamique tourné vers l'avenir : nous sommes à votre entière disposition pour discuter de vos projets de partenariats, de l'intégration de nos talents au sein de vos équipes ou pour vous éclairer sur la richesse de nos parcours pédagogiques. Ensemble, faisons de la technologie un levier de transformation durable.</p>
</section>
<?php if ($messageSucces): ?>
    <p style="color: #00bafe;font-weight: bold;text-align: center;"><?php echo $messageSucces; ?></p>
<?php endif; ?>

<section id="contactretour">

    <form action="contact.php" method="post" name="Quiz" id="contactID" class="box">
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
        <img id="tkt" src="../images/tkt.jpg" alt="Support">
    </div>
</section>

<?php include '../includes/footer.php'; ?>