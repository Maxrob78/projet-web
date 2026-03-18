<?php
// Configuration de la page
$pageTitle = "Accueil";
$currentPage = "index";

include '../includes/header.php';
?>

<section class="hero">
    <video autoplay muted loop playsinline class="back-video">
        <source src="../videos/efrei_video.mp4" type="video/mp4">
    </video>
    <div class="overlay"></div>
    <div class="content">
        <h1>L'INGÉNIERIE DE DEMAIN</h1>
        <p>l'EFREI, grande école du numérique</p>
        <a href="CoursFormations.php" class="btn-video">Voir nos formations</a>
    </div>
</section>
<div id="imgcampus">
    <img id="campus" src="../images/campus.jpg" alt="Photo du campus Parisien de l'EFREI">
    <img id="campus2" src="../images/cmpbordeaux.png" alt="Photo du campus Bordelais de l'EFREI">
</div>
<section id="sectioncampus">
    <h2>Les campus de l'EFREI</h2>
    <p>Idéalement situé à Villejuif, aux portes du pôle numérique francilien, notre campus offre un
        environnement résolument moderne et inspirant pour les futurs experts de l'ingénierie. Véritable
        écosystème dédié à la réussite, il allie des infrastructures de pointe à des espaces de vie conviviaux.
        Des laboratoires de recherche spécialisés aux zones de collaboration modulables, chaque espace est conçu
        pour favoriser l'immersion technologique, l'échange d'idées et l'éclosion de projets innovants. Nous
        offrons ainsi à nos étudiants un cadre d'apprentissage privilégié, où l'excellence académique
        s'accompagne d'un équipement de haut niveau pour répondre aux défis de demain.</p>
</section>
<div class="imageparagraphe">
    <div class="image-container">
        <img class="missionimg" src="../images/cmpbordeaux.png" alt="Photo du campus Parisien de l'EFREI">
    </div>
    <section class="missionpara">
        <h2>LES MISSIONS</h2>
        <p style="text-align: justify;">L'objectif de l'établissement est de former des ingénieurs capables de répondre aux enjeux technologiques
            et sociétaux par l'expertise et la créativité. Le cursus s'articule autour de l'innovation, du travail
            collaboratif et de l'ouverture internationale afin de préparer les étudiants aux responsabilités du
            secteur de l'ingénierie.</p>
    </section>
</div>
<div class="imageparagraphe">
    <section class="valeurpara">
        <h2>LES VALEURS</h2>
        <p style="text-align: justify;">L'identité du département d'informatique de l'EFREI s'articule autour de trois piliers : la maîtrise
            technique, l'adaptabilité et la responsabilité professionnelle. L'établissement privilégie une approche
            où l'innovation technologique reste indissociable d'une réflexion éthique sur l'usage du numérique. Le
            cursus favorise l'immersion dans des projets collaboratifs complexes, visant à développer chez les
            futurs ingénieurs une vision globale des infrastructures informatiques et une capacité de réponse agile
            aux mutations constantes du secteur.</p>
    </section>
    <div class="image-container">
        <img class="valeurimg" src="../images/cmpbordeaux.png" alt="Photo du campus Parisien de l'EFREI">
    </div>
</div>

<section class="section-chiffres">
    <div class="container-chiffres">
        <h2 class="titre-section">CHIFFRES CLÉS</h2>

        <div class="grid-stats">
            <div class="stat-card">
                <div class="stat-icon">🎓</div>
                <div class="stat-value">+3000</div>
                <div class="stat-desc">étudiants</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">💼</div>
                <div class="stat-value">100%</div>
                <div class="stat-desc">d'insertion professionnelle</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🤝</div>
                <div class="stat-value">150</div>
                <div class="stat-desc">entreprises partenaires</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🔬</div>
                <div class="stat-value">10</div>
                <div class="stat-desc">laboratoires de recherche</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🌍</div>
                <div class="stat-value">5</div>
                <div class="stat-desc">campus internationaux</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">⚙️</div>
                <div class="stat-value">20</div>
                <div class="stat-desc">spécialités d'ingénierie</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🎭</div>
                <div class="stat-value">50</div>
                <div class="stat-desc">associations étudiantes</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-value">30 ans</div>
                <div class="stat-desc">d'excellence académique</div>
            </div>
        </div>
    </div>
</section>


<h2 style="text-align: center;margin-top: 20px;font-size: 2em;">Actualités</h2>
<div class="carousel-container">
    <div class="slideshow-container">
        <div class="mySlides fade">
            <img src="../images/actu1.jpg" alt="Actualité 1" onclick="window.open('https://www.myefrei.fr/portal/student/slides/y2gx4ljzozw7gupo', '_blank')">
            <div class="text-overlay"><p>Texte 1 - Carrousel 1</p></div>
        </div>
        <div class="mySlides fade">
            <img src="../images/actu2.jpg" alt="Actualité 2" onclick="window.open('https://www.myefrei.fr/portal/student/slides/m649gg3h2yqkq2gv', '_blank')">
            <div class="text-overlay"><p>Texte 2 - Carrousel 1</p></div>
        </div>
        <div class="mySlides fade">
            <img src="../images/actu3.jpg" alt="Actualité 3" onclick="window.open('https://www.myefrei.fr/portal/student/slides/6yotqstd7af15jwt', '_blank')">
            <div class="text-overlay"><p>Texte 3 - Carrousel 1</p></div>
        </div>

        <button class="prev" onclick="plusSlides(this, -1)" aria-label="Précédent">&#10094;</button>
        <button class="next" onclick="plusSlides(this, 1)" aria-label="Suivant">&#10095;</button>
    </div>

    <div class="dot-container">
        <span class="dot" onclick="currentSlide(this, 1)"></span>
        <span class="dot" onclick="currentSlide(this, 2)"></span>
        <span class="dot" onclick="currentSlide(this, 3)"></span>
    </div>
</div>
<h2 style="text-align: center;margin-top: 20px;font-size: 2em;">Témoignages d'étudiants</h2>
<div class="carousel-container">
    <div class="slideshow-container">
        <div class="mySlides fade">
            <img src="../images/tm1.png" alt="Témoignage de Thomas">
            <div class="text-overlay"><p>Thomas - Les laboratoires de recherche et le matériel de pointe m'ont permis de concrétiser mes projets d'IA. Une école à la pointe de l'innovation.</p></div>
        </div>
        <div class="mySlides fade">
            <img src="../images/tm2.png" alt="Témoignage de Minh">
            <div class="text-overlay"><p>Minh - Grâce au réseau des 150 entreprises partenaires, j'ai décroché mon alternance dans une Big Tech en seulement 10 jours. Un vrai tremplin.</p></div>
        </div>
        <div class="mySlides fade">
            <img src="../images/tm3.png" alt="Témoignage de Nicolas">
            <div class="text-overlay"><p>Nicolas - L'esprit d'entraide et la richesse de la vie associative rendent le campus unique. On y apprend autant humainement que techniquement.</p></div>
        </div>

        <button class="prev" onclick="plusSlides(this, -1)" aria-label="Précédent">&#10094;</button>
        <button class="next" onclick="plusSlides(this, 1)" aria-label="Suivant">&#10095;</button>
    </div>

    <div class="dot-container">
        <span class="dot" onclick="currentSlide(this, 1)"></span>
        <span class="dot" onclick="currentSlide(this, 2)"></span>
        <span class="dot" onclick="currentSlide(this, 3)"></span>
    </div>
</div>
<?php include '../includes/footer.php'; ?>