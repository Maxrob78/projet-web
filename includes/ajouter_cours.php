<?php
ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    if (!isset($_POST['nom']) || !isset($_POST['description'])) {
        throw new Exception("Données du formulaire manquantes.");
    }

    $id = $_POST['id'] ?? null; // Récupère l'ID s'il y en a un (mode modification)
    $nom = $_POST['nom'];
    $description = $_POST['description'];
    $type = $_POST['type-choix'] ?? 'cours';

    $imagePath = null; // On initialise à null

    // 2. GESTION DE L'IMAGE
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $root = dirname(__DIR__); 
        $target_dir = $root . "/images/";

        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $file_name = time() . "_" . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $imagePath = "../images/" . $file_name;
        }
    }

    // 3. MISE À JOUR DU JSON
    $json_file = '../json/cours-formations.json';
    $current_data = ["cours" => [], "formations" => []];

    if (file_exists($json_file)) {
        $current_data = json_decode(file_get_contents($json_file), true);
    }

    if (!empty($id)) {
        // --- MODE MODIFICATION (AVEC CHANGEMENT DE TYPE POSSIBLE) ---
        $itemFound = null;

        // 1. On cherche l'élément dans TOUTES les catégories et on le supprime de son ancienne place
        foreach (['cours', 'formations'] as $cat) {
            foreach ($current_data[$cat] as $key => $item) {
                if (isset($item['id']) && $item['id'] == $id) {
                    // On sauvegarde les infos existantes (notamment l'image si on n'en a pas mis de nouvelle)
                    $itemFound = $item;
                    // On le retire de cette catégorie
                    unset($current_data[$cat][$key]);
                    // On réindexe le tableau pour éviter les trous dans les index JSON
                    $current_data[$cat] = array_values($current_data[$cat]);
                    break 2; // On sort des deux boucles
                }
            }
        }

        if ($itemFound) {
            // 2. On prépare les nouvelles données
            $updated_item = [
                "id"          => $id,
                "nom"         => $nom,
                "description" => $description,
                "image"       => ($imagePath !== null) ? $imagePath : $itemFound['image']
            ];
            // 3. On l'ajoute dans la NOUVELLE catégorie choisie
            $current_data[$type][] = $updated_item;
        } else {
            throw new Exception("Élément introuvable pour modification.");
        }

    } else {
        // --- MODE AJOUT ---
        $new_entry = [
            "id"          => uniqid(),
            "nom"         => $nom,
            "description" => $description,
            "image"       => $imagePath ?? "../images/default.png"
        ];
        $current_data[$type][] = $new_entry;
    }

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
?>