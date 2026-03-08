<?php
header('Content-Type: application/json');

// Récupère les données envoyées en JSON par JS
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$type = $data['type'] ?? null;

if ($id && $type) {
    $json_file = '../json/cours-formations.json';
    if (!file_exists($json_file)) {
        echo json_encode(["success" => false, "message" => "Fichier JSON introuvable."]);
        exit;
    }

    $current_data = json_decode(file_get_contents($json_file), true);

    // On filtre le tableau pour garder tous les éléments SAUF celui qui a l'ID correspondant
    if (isset($current_data[$type])) {
        $current_data[$type] = array_values(array_filter($current_data[$type], function($item) use ($id) {
            return (!isset($item['id']) || $item['id'] != $id); // Filtre si l'ID correspond
        }));
    }

    if (file_put_contents($json_file, json_encode($current_data, JSON_PRETTY_PRINT))) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Impossible de sauvegarder."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID ou type manquant."]);
}
?>