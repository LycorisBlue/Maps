document.addEventListener('DOMContentLoaded', function () {
    function fetchUserData() {
        fetch('load_data.php')  // Assure-toi que cette URL pointe vers ton API pour récupérer les données de l'utilisateur
            .then(response => response.json())
            .then(data => {
                data.forEach(addUserCard);
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    function addUserCard(data) {
        const userGrid = document.getElementById('user-grid');

        const userInfo = document.createElement('div');
        userInfo.classList.add('user-info');

        const userImage = document.createElement('img');
        userImage.src = `http://localhost:8888/Maps/${data.image_path}`;
        userImage.alt = "User Image";

        const userName = document.createElement('h1');
        userName.textContent = data.name;

        const userDescription = document.createElement('p');
        userDescription.textContent = data.description;

        const userCoordinates = document.createElement('p');
        userCoordinates.textContent = `Publié le : ${data.created_at}`;

        userInfo.appendChild(userImage);
        userInfo.appendChild(userName);
        userInfo.appendChild(userDescription);
        userInfo.appendChild(userCoordinates);

        userGrid.appendChild(userInfo);
    }
    

    // Fetch user data initially
    fetchUserData();

        // Reload the page every 5 seconds
    setInterval(() => {
        location.reload();
    }, 100000);

});
