// const animeapi = "https://api3.nikhilvermaultimate.workers.dev/anime/";
// const recommendationsapi = "https://api3.nikhilvermaultimate.workers.dev/recommendations/";

const animeapi = "https://animeunity.vercel.app/anime/zoro/info?id=";

async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error(errors);
    }
}

function getGenreHtml(genres) {
    let ghtml = "";
    for (let i = 0; i < genres.length; i++) {
        ghtml += `<a>${genres[i].trim()}</a>`;
    }
    return ghtml;
}

async function RefreshLazyLoader() {
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
            }
        });
    });
    const arr = document.querySelectorAll("img.lzy_img");
    arr.forEach((v) => {
        imageObserver.observe(v);
    });
}

function sentenceCase(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Function to get anime info from Zoro API
async function loadAnime(data) {
    const title = data.title;
    const id = data.id;
    const description = data.description;
    const image = data.image;
    const type = data.type;
    const status = data.status;
    const genres = data.genres;
    const episodes = data.episodes;
    const releaseDate = data.releaseDate;

    document.documentElement.innerHTML = document.documentElement.innerHTML
        .replaceAll("TITLE", title)
        .replaceAll("IMG", image)
        .replaceAll("LANG", "EP " + episodes.length)
        .replaceAll("TYPE", type)
        .replaceAll("URL", window.location)
        .replaceAll("SYNOPSIS", description)
        .replaceAll("OTHER", title)
        .replaceAll("TOTAL", episodes.length)
        .replaceAll("YEAR", releaseDate)
        .replaceAll("STATUS", status)
        .replaceAll("GENERES", getGenreHtml(genres));

    document.getElementById("main-content").style.display = "block";
    document.getElementById("load").style.display = "none";

    // Set Watch Now btn
    document.getElementById("watch-btn").href = `./episode.html?anime=${id}&episode=${episodes[0].id}`;

    getEpList(id, episodes).then(() => {
        console.log("Episode list loaded");
    });

    RefreshLazyLoader();
    console.log("Anime Info loaded");
}

// Function to get episode list
async function getEpList(anime_id, episodes) {
    let ephtml = "";
    for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];
        ephtml += `<a class="ep-btn" href="./episode.html?anime=${anime_id}&episode=${ep.id}">${ep.number}</a>`;
    }
    document.getElementById("ephtmldiv").innerHTML = ephtml;
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("anime") == null) {
    window.location = "./index.html";
}

//Running functions
getJson(animeapi + urlParams.get("anime")).then((data) => {
    loadAnime(data);
});
