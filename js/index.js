window.onload = () => {
    getCharacters();
}

let page = 1;
let totalPages = 0;

const url = "https://rickandmortyapi.com/api"
const api = axios.create({
    baseURL: url
});

function getCharacters() {
    api.get("/character", { params: { page } })
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
                        <div class="card">
                            <img src="${character.image}" class="card-img-top" alt="">
                                <div class="card-body">
                                <h2>${character.name}</h2>
                                <div class="pTextStatus"><div class="statusColor ${statusColorClass}"></div> ${character.status} - ${character.species}</div>
                                <p class="pTitulo">last known location:</p>
                                <p class="pText">${character.location.name}</p>
                                <p class="pTitulo">Last Episode:</p>
                                <p class="pText">${lastEpisodeName}</p>
                            </div>
                        </div>
                        `;
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));
}

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
