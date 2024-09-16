//Swiper

const swiper = new Swiper(".swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    autoplay: {
        delay: 4500,
        disableOnInteraction: false,
    },
    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
    },
});

//Burger Menu
function burgerMenu() {
    const navMobile = document.querySelector(".navMobile");
    navMobile.classList.toggle("open");
}

//Fonction pour upload fichier
const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

// Fonction pour vérifier si le fichier a un type valide
function validFileType(file) {
    return fileTypes.includes(file.type);
}

// Fonction pour retourner la taille du fichier dans un format lisible
function returnFileSize(number) {
    if (number < 1024) {
        return number + " octets";
    } else if (number < 1048576) {
        return (number / 1024).toFixed(1) + " Ko";
    } else {
        return (number / 1048576).toFixed(1) + " Mo";
    }
}

// Fonction pour mettre à jour l'aperçu des fichiers sélectionnés
function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    const curFiles = fileInput.files;
    if (curFiles.length === 0) {
        const para = document.createElement("p");
        para.textContent = "Aucun fichier sélectionné pour le moment";
        preview.appendChild(para);
    } else {
        const list = document.createElement("ol");
        preview.appendChild(list);

        for (let i = 0; i < curFiles.length; i++) {
            const listItem = document.createElement("li");
            const para = document.createElement("p");

            if (validFileType(curFiles[i])) {
                para.textContent =
                    "Nom du fichier: " +
                    curFiles[i].name +
                    ", taille: " +
                    returnFileSize(curFiles[i].size) +
                    ".";
                const image = document.createElement("img");
                image.src = window.URL.createObjectURL(curFiles[i]);
                image.style.maxWidth = "150px"; // Ajuste la taille de l'image
                listItem.appendChild(image);
                listItem.appendChild(para);
            } else {
                para.textContent =
                    "Nom du fichier: " +
                    curFiles[i].name +
                    ": Type de fichier non valide. Veuillez sélectionner une image.";
                listItem.appendChild(para);
            }
            list.appendChild(listItem);
        }
    }
}
const preview = document.querySelector(".preview");
const fileInput = document.querySelector("#actusImage");

fileInput.addEventListener("change", updateImageDisplay);

//Scroll up button
// Créer l'observer pour détecter la visibilité de la navbar
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const backToTopButton = document.getElementById("backToTop");

        // Si la navbar n'est plus visible, afficher le bouton
        if (!entry.isIntersecting) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });
});

// Sélectionne la navbar et l'observe
const navbar = document.getElementById("nav");
observer.observe(navbar);

// Ajouter l'événement pour faire remonter en haut de la page
const backToTopButton = document.getElementById("backToTop");
backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Défilement fluide
    });
});

//Leaflets

var map = L.map("map").setView([43.346657, 1.628208], 14);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let tabMarker = []; // Déclaration globale du tableau des marqueurs

// Fonction pour récupérer la liste des nounous via l'API
async function getList() {
    try {
        const response = await fetch("/AMN/api/controllerListNounou.php", {
            method: "GET",
        });
        const data = await response.json();
        console.log(data);

        // Ajouter les marqueurs à la carte
        addMarker(data);

        // Lier les cartes aux marqueurs après que les marqueurs ont été créés
        const cards = Array.from(document.getElementsByClassName("card")); // Récupérer les cartes après leur génération
        bindMarkerToCard(cards); // Lier chaque carte à son marqueur
    } catch (error) {
        console.error("Erreur lors de la récupération des nounous :", error);
    }
}

getList();

// Fonction pour ajouter les marqueurs à la carte
async function addMarker(data) {
    data.forEach((element, index) => {
        var marker = L.marker([element.lat_nounou, element.long_nounou]).addTo(
            map
        );

        // Ajout d'un popup au marqueur
        marker.bindPopup(
            `<p><span>${element.nom_nounou}</span> ${element.prenom_nounou}</p>
            <img class="markerImage" src="${element.avatar_nounou}" alt="Image de ${element.nom_nounou}">`,
            { minWidth: 100 }
        );

        // Ajout du marqueur au tableau global
        tabMarker[index] = marker;
    });
}

// Fonction pour lier chaque carte à un marqueur
function bindMarkerToCard(cards) {
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            // Ouvrir le popup du marqueur correspondant
            tabMarker[index].openPopup();
            // Centrer la carte sur le marqueur
            map.setView(tabMarker[index].getLatLng(), 14);
        });
    });
}
