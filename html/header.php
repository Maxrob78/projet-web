<?php
// 1. On définit la page actuelle pour le style "active"
$page_actuelle = basename($_SERVER['PHP_SELF']);

// 2. On crée la liste de nos pages (Lien => Nom affiché)
$menu_items = [
    'index.php'   => 'Accueil',
    'formations.php'   => 'Cours et Formations',
    'equipe.php'  => 'Équipe',
    'contact.php' => 'A propos'
];
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>EFREI | <?php echo $menu_items[$page_actuelle] ?? 'Bienvenue'; // Affiche le nom de la page dans le titre, ou "Bienvenue" si la page n'est pas dans le menu ?></title> 
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" href="../images/favicon.ico" sizes="32x32">
    <script src="../javascript/script.js" defer></script>
</head>

<body>
    <header class="<?php echo ($page_actuelle == 'index.php') ? 'header-accueil' : ''; // Ajoute une classe spéciale pour la page d'accueil ?>"> 
        <img id="logoheader" src="../images/Logo_efrei.svg" alt="Logo de l'EFREI" onclick="window.location.href='index.php'">
        <nav>
            <?php foreach ($menu_items as $lien => $nom): ?>
                <a href="<?php echo $lien; ?>" 
                    class="<?php echo ($lien == $page_actuelle) ? 'active' : ''; //on ajoute la classe "active" si c'est la page actuelle ?>"> 
                    <?php echo $nom; ?>
                </a>
            <?php endforeach; ?>
            <button id="theme-toggle" class="menu-btn" style="font-size: 20px; margin-right: 5px;">
                🌙
            </button>
        </nav>
    </header>