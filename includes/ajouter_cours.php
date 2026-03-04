<?php
ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    if (!isset($_POST['nom']) || !isset($_POST['description'])) {
        throw new Exception("Données du formulaire manquantes.");
    }

    $nom = $_POST['nom'];
    $description = $_POST['description'];
    $type = $_POST['type-choix'] ?? 'cours';

    // 2. GESTION DE L'IMAGE
    $imagePath = "../images/default.png";

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        // On utilise le chemin réel sur le disque dur pour éviter les erreurs de ../
        $root = dirname(__DIR__); // Remonte d'un cran au dessus de 'includes'
        $target_dir = $root . "/images/";

        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $file_name = time() . "_" . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            // Ici on garde le chemin relatif pour le JSON (celui que ton HTML utilise)
            $imagePath = "../images/" . $file_name;
        } else {
            throw new Exception("Le serveur refuse d'écrire le fichier dans " . $target_dir);
        }
    }

    // 3. MISE À JOUR DU JSON
    $json_file = '../json/cours-formations.json';
    $current_data = ["cours" => [], "formations" => []];

    if (file_exists($json_file)) {
        $current_data = json_decode(file_get_contents($json_file), true);
    }

    $new_entry = [
        "nom" => $nom,
        "description" => $description,
        "image" => $imagePath
    ];

    $current_data[$type][] = $new_entry;

    if (file_put_contents($json_file, json_encode($current_data, JSON_PRETTY_PRINT))) {
        echo json_encode(["success" => true]);
    } else {
        throw new Exception("Impossible d'écrire dans le fichier JSON.");
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
