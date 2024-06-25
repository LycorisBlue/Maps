<?php
// Informations de connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "flood";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupération des données POST
$name = $conn->real_escape_string($_POST['name']);
$description = $conn->real_escape_string($_POST['description']);
$latitude = $conn->real_escape_string($_POST['latitude']);
$longitude = $conn->real_escape_string($_POST['longitude']);
$image = $_FILES['image'];

// Validation des données
if (empty($name) || empty($description) || empty($latitude) || empty($longitude) || empty($image)) {
    die("Tous les champs sont obligatoires.");
}

// Gestion des fichiers
$target_dir = "uploads/";
$unique_file_name = uniqid('img_', true) . '.' . pathinfo($image["name"], PATHINFO_EXTENSION);
$target_file = $target_dir . $unique_file_name;

// Validation du type de fichier
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($image["type"], $allowed_types)) {
    die("Uniquement JPG, PNG, and GIF files sont autorisés.");
}

// Déplacement du fichier vers le répertoire cible
if (move_uploaded_file($image["tmp_name"], $target_file)) {
    // Utilisation de requêtes préparées pour l'insertion
    $stmt = $conn->prepare("INSERT INTO entries (name, description, image_path, latitude, longitude, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    if ($stmt) {
        $stmt->bind_param('sssss', $name, $description, $target_file, $latitude, $longitude);
        
        if ($stmt->execute()) {
            echo "Alerte envoyée avec succès";
        } else {
            echo "Erreur: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Erreur de préparation: " . $conn->error;
    }
} else {
    echo "Erreur lors du téléchargement de l'image.";
}

// Fermeture de la connexion
$conn->close();
?>
