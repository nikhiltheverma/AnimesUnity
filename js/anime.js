const animeapi = "https://animeunity.vercel.app/anime/zoro/info?id=";

// Fetch JSON data
async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error(errors);
    }
}

// Format genres into HTML links
function getGenreHtml(genres) {
    let ghtml = "";
    for (let i = 0; i < genres.length; i++) {
        ghtml += `<a>${genres[i].trim()}</a>`;
    }
    return ghtml;
}

// Lazy load images
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

// Capitalize each word
function sentenceCase(str) {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Populate episode list
async function getEpList(anime_id, episodes) {
    let ephtml = "";
    for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];
        const epNumber = ep.number || i + 1;
        ephtml += `<a class="ep-btn" href="./episode.html?anime=${anime_id}&episode=${ep.id}">EP ${epNumber}</a>`;
    }
    document.getElementById("ephtmldiv").innerHTML = ephtml;
}

// Main loader
async function loadAnime(data) {
    const {
        id,
        title,
        description,
        image,
        type,
        status,
        genres,
        episodes,
        releaseDate
    } = data;

    // Replace placeholders
    document.documentElement.innerHTML = document.documentElement.innerHTML
        .replaceAll("TITLE", title)
        .replaceAll("IMG", image)
        .replaceAll("LANG", "EP " + (episodes?.length || 0))
        .replaceAll("TYPE", type)
        .replaceAll("URL", window.location)
        .replaceAll("SYNOPSIS", description)
        .replaceAll("OTHER", title)
        .replaceAll("TOTAL", episodes?.length || 0)
        .replaceAll("YEAR", releaseDate || "Unknown")
        .replaceAll("STATUS", status)
        .replaceAll("GENERES", getGenreHtml(genres || []));

    // Display main content
    document.getElementById("main-content").style.display = "block";
    document.getElementById("load").style.display = "none";

    // Set Watch Now button (if episode exists)
    if (episodes && episodes.length > 0) {
        document.getElementById("watch-btn").href = `./episode.html?anime=${id}&episode=${episodes[0].id}`;
        getEpList(id, episodes);
    } else {
        document.getElementById("watch-btn").style.display = "none";
        document.getElementById("ephtmldiv").innerHTML = "<p>No episodes found.</p>";
    }

    RefreshLazyLoader();
    console.log("Anime Info loaded");
}

// Entry point
const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("anime");

if (!animeId) {
    window.location.href = "./index.html";
} else {
    getJson(animeapi + animeId).then((data) => {
        if (data) loadAnime(data);
        else console.error("No anime data found.");
    });
}
