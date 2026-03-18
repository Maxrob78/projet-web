<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id   = $data['id']   ?? null;
$type = $data['type'] ?? null;

if ($id && $type) {
    $json_file = '../json/cours-formations.json';
    if (!file_exists($json_file)) {
        echo json_encode(["success" => false, "message" => "Fichier JSON introuvable."]);
        exit;
    }

    $current_data = json_decode(file_get_contents($json_file), true);

    if (isset($current_data[$type])) {

        // 1. On cherche l'élément pour récupérer son image AVANT de le supprimer
        $imagePath = null;
        foreach ($current_data[$type] as $item) {
            if (isset($item['id']) && $item['id'] == $id) {
                $imagePath = $item['image'] ?? null;
                break;
            }
        }

        // 2. On supprime l'élément du tableau
        $current_data[$type] = array_values(array_filter($current_data[$type], function($item) use ($id) {
            return (!isset($item['id']) || $item['id'] != $id);
        }));

        // 3. On supprime le fichier image si ce n'est pas l'image par défaut
        if ($imagePath && basename($imagePath) !== 'default.png') {
            $absolutePath = realpath(dirname(__FILE__) . '/' . $imagePath);
            if ($absolutePath && file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }
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