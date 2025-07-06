// API URLs
const animeapi = "https://animeunity.vercel.app/anime/zoro/info?id=";
const episodeapi = "https://animeunity.vercel.app/anime/zoro/watch?episodeId=";

// Useful functions
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
    const imageObserver = new IntersectionObserver((entries) => {
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

// Function to load anime from Zoro API (used by animeunity)
async function loadAnimeFromZoro(data) {
    document.documentElement.innerHTML = document.documentElement.innerHTML
        .replaceAll("TITLE", data["title"])
        .replaceAll("IMG", data["image"])
        .replaceAll("LANG", "EP " + data["totalEpisodes"])
        .replaceAll("TYPE", data["type"])
        .replaceAll("URL", window.location)
        .replaceAll("SYNOPSIS", data["description"])
        .replaceAll("OTHER", "Alternative Title Not Available")
        .replaceAll("TOTAL", data["totalEpisodes"])
        .replaceAll("YEAR", data["releaseDate"])
        .replaceAll("STATUS", data["status"])
        .replaceAll("GENERES", getGenreHtml(data["genres"]));

    document.getElementById("main-content").style.display = "block";
    document.getElementById("load").style.display = "none";

    if (data["episodes"] && data["episodes"].length > 0) {
        document.getElementById("watch-btn").href =
            "./episode.html?anime=" +
            encodeURIComponent(data["episodes"][0]["id"].split("-episode-")[0]) +
            "&episode=" +
            data["episodes"][0]["number"];
    }

    console.log("Anime Info loaded");
    RefreshLazyLoader();

    getEpList(data["episodes"]).then(() => {
        console.log("Episode list loaded");
    });
}

// Function to get episode list
async function getEpList(episodes) {
    let ephtml = "";

    for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];
        const animeId = ep["id"].split("-episode-")[0];
        const episodeNum = ep["number"];
        ephtml += `<a class="ep-btn" href="./episode.html?anime=${animeId}&episode=${episodeNum}">${episodeNum}</a>`;
    }

    document.getElementById("ephtmldiv").innerHTML = ephtml;
}

// Get anime query from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("anime") == null) {
    window.location = "./index.html";
}

// Running the page
getJson(animeapi + encodeURIComponent(urlParams.get("anime"))).then((data) => {
    data = data["results"];
    loadAnimeFromZoro(data);
});
