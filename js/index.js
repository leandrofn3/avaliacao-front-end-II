window.onload = () => {
    getCharacters();
}

let page = 1;
let totalPages = 0;

const url = "https://rickandmortyapi.com/api"
const api = axios.create({
    baseURL: url
});

async function getCharacters() {
    await api.get("/character", { params: { page } })
        .then(response => {
            const data = response.data.results
            totalPages = response.data.info.pages;

            let cards = document.getElementById("cardcontainer");
            cards.innerHTML = "";


            data.forEach((character) => {

                let statusColorClass = "";

                if (character.status === "Alive") {
                    statusColorClass = "stausGreen";
                } else if (character.status === "Dead") {
                    statusColorClass = "statusRed";
                } else {
                    statusColorClass = "stausGray"
                }

                const lastEpisodeUrl = character.episode[character.episode.length - 1];
                api.get(lastEpisodeUrl)
                    .then(response => {
                        const lastEpisode = response.data;
                        const lastEpisodeName = lastEpisode.name;

                        cards.innerHTML += ` <div class="col-4">
                        <div class="card bg-transparent " onclick="modalOpen('${character.name}', '${character.status}', '${character.species}', '${character.location.name}', '${lastEpisodeName}')">
                            <img src="${character.image}" class="card-img-top" alt="">
                                <di class="card-body ">
                                <h2 class="text-light fs-2">${character.name}</h2>
                                <div class="pTextStatus text-light"><div class="statusColor ${statusColorClass}"></div><b>${character.status} - ${character.species}</b></div>
                                <div class="textCard"><p class="pTitulo text-secondary"><b>last known location:</b></p>
                                <p class="pText text-light"><b>${character.location.name}</b></p></div>
                                <div class="textCard"><p class="pTitulo text-secondary "><b>Last Episode:</b></p>
                                <p class="pText text-light"><b>${lastEpisodeName}</b></p></div>
                            </di>
                        </div>
                        `;

                    })
                    .catch(error => console.log(error));

            });
        })
        .catch(error => console.log(error));
}

function modalOpen(name, status, species, location, lastEpisode) {
    const modal = document.getElementById("characterModal");
    const contendModal = modal.querySelector(".modal-body")

    contendModal.innerHTML = `
        <h2 class="modal-name">${name}</h2>
        <p class="modal-info"><b>Status:</b> ${status}</p>
        <p class="modal-info"><b>Species:</b> ${species}</p>
        <p class="modal-info"><b>Location:</b> ${location}</p>
        <p class="modal-info"><b>Last Episode:</b> ${lastEpisode}</p>
    `
    modal.style.display = "block"
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("characterModal");
    const closeModalButtons = modal.querySelectorAll("[data-bs-dismiss='modal']");

    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});




function previousPage() {
    if (page > 1) {
        page--;
        getCharacters();
    }
}

function nextPage() {
    if (page < totalPages) {
        page++;
    }
    getCharacters();
}
