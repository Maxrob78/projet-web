<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFREI | <?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" href="../images/favicon.ico" sizes="32x32">
    <script src="../javascript/script.js" defer></script>
</head>
<body>
    <header class="<?php echo ($currentPage == 'index') ? 'header-accueil' : ''; ?>">
        <a href="index.php" aria-label="Retour à l'accueil">
            <img id="logoheader" src="../images/Logo_efrei.svg" alt="Logo de l'EFREI">
        </a>
        <nav>
            <a <?php echo ($currentPage == 'index') ? 'id="lienactif"' : ''; ?> href="index.php">Accueil</a>
            <a <?php echo ($currentPage == 'cours') ? 'id="lienactif"' : ''; ?> href="CoursFormations.php">Cours et formations</a>
            <a <?php echo ($currentPage == 'equipe') ? 'id="lienactif"' : ''; ?> href="equipe.php">Equipe d'enseignants</a>
            <a <?php echo ($currentPage == 'contact') ? 'id="lienactif"' : ''; ?> href="contact.php">A propos</a>
        </nav>
        <button id="theme-toggle" class="menu-btn" style="font-size: 20px; margin-left: auto;">🌙</button>
    </header>
    <div id="flashMedia">
        <div class="mediaWrapper">
            <video id="flashVideo"></video>
            <img id="flashImg" alt="">
            <h1 id="flashTitre"></h1>
        </div>
    </div>