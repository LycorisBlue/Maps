// map_script.js



// Fonction pour ouvrir le formulaire

function openForm() {

    document.getElementById("form-popup").style.display = "block";

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            document.getElementById("lat").value = position.coords.latitude;

            document.getElementById("lng").value = position.coords.longitude;

        });

    } else {

        alert("La géolocalisation n'est pas supportée par ce navigateur.");

    }

}



// Fonction pour soumettre le formulaire

function submitForm() {

    var form = document.getElementById("marker-form");

    var formData = new FormData(form);



    var xhr = new XMLHttpRequest();

    xhr.open("POST", "submit_data.php", true);

    xhr.onload = function () {

        if (xhr.status === 200) {

            alert(xhr.responseText);

            closeForm();

        } else {

            alert("Erreur lors de l'envoi des données.");

        }

    };

    xhr.send(formData);

}



// Fonction pour fermer le formulaire

function closeForm() {

    document.getElementById("form-popup").style.display = "none";

}



// Fonction pour charger les points depuis le serveur

function loadPoints() {

    fetch("load_data.php")

        .then((response) => response.json())

        .then((data) => {

            data.forEach((entry) => {

                var redMarker = L.AwesomeMarkers.icon({

                    icon: "info-sign",

                    markerColor: "red",

                    prefix: "glyphicon",

                });

                var marker = L.marker([entry.latitude, entry.longitude], {

                    icon: redMarker,

                }).addTo(window.map);

                marker.bindPopup(`

                    <div style="font-size:16px; width:200px; height:auto;">

                        <b>${entry.name}</b><br><br>

                        ${entry.description}<br><br>

                        Ajouté le : ${entry.created_at}<br><br>

                        <img src="${entry.image_path}" alt="image" style="width:100%; height:auto; max-height:300px;">

                    </div>

                `);

            });

        })

        .catch((error) => {

            console.error("Error:", error);

            alert("Erreur lors du chargement des points.");

        });

}







// Initialisation de la carte Leaflet

document.addEventListener("DOMContentLoaded", function () {

    // Initialisation de la carte

    window.map = L.map("map_d9a916c2ebb288ad74dd6fb187fc67a4").setView([5.394, -4.0059], 10);



    // Définir les couches de base

    var osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

        maxZoom: 30,

        attribution: "© EDGAR KOUASSI-MEDEV OpenLayers contribution"

    });



    var googleSatLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {

        maxZoom: 30,

        attribution: "© EDGAR KOUASSI-MEDEV GoogleSatcontribution"

    });



    var googleHybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {

        maxZoom: 30,

        attribution: "© EDGAR KOUASSI-MEDEV GoogleHybrid contribution"

    });



    // Ajouter une couche par défaut (ici, OpenStreetMap)

    osmLayer.addTo(window.map);



    // Définir les couches de base pour le contrôle des couches

    var baseLayers = {

        "OpenStreetMap": osmLayer,

        "Google Satellite": googleSatLayer,

        "Google Hybrid": googleHybridLayer

    };



    // Ajouter le contrôle des couches à la carte

    L.control.layers(baseLayers).addTo(window.map);



    // Ajout du bouton de géolocalisation

    L.control.locate({

        position: "topleft",

        icon: "fas fa-map-marker-alt",

        strings: {

            title: "Montrez-moi où je suis !",

        },

    }).addTo(window.map);







    // Charger les points de repère après l'initialisation de la carte

    window.onload = loadPoints;

    setInterval(() => {

        window.onload();  

    }, 5000);

});

