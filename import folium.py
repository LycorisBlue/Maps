import folium
from folium import plugins
import shapefile  # pyshp
from shapely.geometry import shape, Polygon, MultiPolygon


# Get your approximate coordinates in Côte d'Ivoire (replace with your actual coordinates)
latitude = 5.3940  # Example latitude for Abidjan, Côte d'Ivoire
longitude = -4.0059  # Example longitude for Abidjan, Côte d'Ivoire

# Charger le fichier SHP
shp_path = r"D:\MEMOIRE\DONNEES MEMOIRE\ZONES A RISQUES.shp"
sf = shapefile.Reader(shp_path)

# Extraire les données des polygones
shapes = sf.shapes()

# Créer une carte Folium centrée sur vos coordonnées
m = folium.Map(location=[latitude, longitude], zoom_start=10)

# Vérification des données du shapefile
if len(shapes) == 0:
    print("Le shapefile ne contient aucune forme.")
else:
    print(f"Nombre de polygones/multipolygones trouvés : {len(shapes)}")

# Ajouter les polygones/multipolygones du shapefile à la carte Folium
for shp in shapes:
    geom = shape(shp.__geo_interface__)
    if isinstance(geom, (Polygon, MultiPolygon)):
        folium.GeoJson(
            geom,
            style_function=lambda x: {'color': 'red', 'weight': 2, 'fillColor': 'red', 'fillOpacity': 0.1}
        ).add_to(m)
    else:
        print(f"Forme non supportée : {geom}")

# Ajouter les couches OSM et Google Maps
folium.TileLayer(
    tiles='http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attr='Google',
    name='Google Satellite',
    max_zoom=20,
    subdomains=['mt0', 'mt1', 'mt2', 'mt3'],
).add_to(m)
folium.TileLayer('OpenStreetMap').add_to(m)


# Ajouter un bouton pour activer la localisation de l'utilisateur
plugins.LocateControl().add_to(m)

# Ajouter un contrôle pour changer les couches
folium.LayerControl().add_to(m)

# Créer une légende (en utilisant HTML et CSS)
legend_html = '''
     <div style="position: fixed; 
     bottom: 50px; left: 50px; width: 150px; height: 60px; 
     background-color: white; border:2px solid grey; z-index:9999; font-size:14px;
     padding: 10px;
     ">
     <b>Légende</b><br>
     <i style="color:red">■</i> Zones A risques<br>

     </div>
     '''
m.get_root().html.add_child(folium.Element(legend_html))

# Ajouter du Javascript pour afficher un bouton et capturer le clic de l'utilisateur pour afficher un formulaire
button_html = '''
     <div style="position: fixed; 
     bottom: 100px; left: 50px; width: 200px; height: 50px; margin-bottom: 20px;
     background-color: white; border:2px solid grey; z-index:9999; font-size:14px;
     padding: 10px; text-align: center;">
     <button onclick="openForm()">Saisir un formulaire</button>
     </div>
     '''
form_html = '''
    <div id="form-popup" style="display: none; position: fixed; top: 50px; left: 50px; background: white; padding: 10px; border: 1px solid black; z-index: 1000;">
        <h4>Ajouter un point</h4>
        <label>Nom:</label><br>
        <input type="text" id="name" /><br>
        <label>Description:</label><br>
        <input type="text" id="description" /><br>
        <label>Photo:</label><br>
        <input type="file" id="photo" /><br>
        <label>Latitude:</label><br>
        <input type="text" id="lat" readonly /><br>
        <label>Longitude:</label><br>
        <input type="text" id="lng" readonly /><br>
        <button onclick="addMarker()">Valider</button>
        <button onclick="closeForm()">Fermer</button>
    </div>
    <script>
        function openForm() {
            document.getElementById('form-popup').style.display = 'block';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    document.getElementById('lat').value = position.coords.latitude;
                    document.getElementById('lng').value = position.coords.longitude;
                });
            } else {
                alert("La géolocalisation n'est pas supportée par ce navigateur.");
            }
        }

        function addMarker() {
            var name = document.getElementById('name').value;
            var description = document.getElementById('description').value;
            var photo = document.getElementById('photo').files[0];
            var lat = document.getElementById('lat').value;
            var lng = document.getElementById('lng').value;

            var marker = L.marker([lat, lng]).addTo(window.map).bindPopup(`
                <b>` + name + `</b><br>` + description + `<br>
                <img src="` + URL.createObjectURL(photo) + `" width="100px" />
            `);

            closeForm();
        }

        function closeForm() {
            document.getElementById('form-popup').style.display = 'none';
        }

        document.addEventListener('DOMContentLoaded', function() {
            window.map = L.map('map').setView([5.3940, -4.0059], 10);
        });
    </script>
'''
m.get_root().html.add_child(folium.Element(button_html + form_html))

# Sauvegarder la carte HTML
m.save(r'D:\MEMOIRE\map.html')
