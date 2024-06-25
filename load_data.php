<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "flood";

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Requête pour récupérer les entrées
$sql = "SELECT * FROM entries";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['error' => 'Query failed']);
    $conn->close();
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Inverser l'ordre des données
$data = array_reverse($data);

// En-tête HTTP pour indiquer que la réponse est en JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>