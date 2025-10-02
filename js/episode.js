const animeapi = "https://animeunity.vercel.app/anime/zoro/info?id=";
const episodeapi = "https://animeunity.vercel.app/anime/zoro/watch?episodeId=";

// Fetch JSON from URL
async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error("Fetch error:", errors);
    }
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load video servers into iframe
async function loadVideo(title, sources) {
    const iframe = document.getElementById("AnimeDexFrame");
    const serversbtn = document.getElementById("serversbtn");
    const epTitleElem = document.getElementById("ep-name");

    epTitleElem.innerHTML = title || "Episode";

    if (!sources || sources.length === 0) {
        serversbtn.innerHTML = `<div class="sitem error-text">No servers available for this episode.</div>`;
        iframe.src = "";
        return;
    }

    serversbtn.innerHTML = ""; // Clear previous buttons

    sources.forEach((source, i) => {
        const serverNum = i + 1;
        const btn = `<div class="sitem">
            <a class="sobtn ${i === 0 ? 'sactive' : ''}" onclick="selectServer(this)" data-value="./embed.html?url=${source.url}">
                Zoro Server ${serverNum}
            </a>
        </div>`;
        serversbtn.innerHTML += btn;
    });

    // Auto-select first server
    document.querySelector(".sobtn.sactive").click();
}

// Server switch handler
function selectServer(btn) {
    const iframe = document.getElementById("AnimeDexFrame");
    const buttons = document.querySelectorAll(".sobtn");

    buttons.forEach(b => b.classList.remove("sactive"));
    btn.classList.add("sactive");

    iframe.src = btn.dataset.value;
    iframe.style.display = "block"; // ✅ Ensure iframe is visible
}

// Load full episode list for the anime
async function getEpList(animeId) {
    const data = await getJson(animeapi + animeId);
    const episodes = data?.episodes || [];

    const ephtmldiv = document.getElementById("ephtmldiv");
    ephtmldiv.innerHTML = "";

    episodes.forEach(ep => {
        ephtmldiv.innerHTML += `<a class="ep-btn" href="./episode.html?anime=${animeId}&episode=${ep.id}">EP ${ep.number || ep.id.split("$").pop()}</a>`;
    });

    return episodes;
}

// Load Prev/Next episode buttons
function getSelectorBtn(eplist, currentId) {
    const selectorDiv = document.querySelector(".selector");
    if (!selectorDiv) return;

    const index = eplist.findIndex(ep => ep.id.toString() === currentId);
    let html = "";

    if (index > 0) {
        const prevEp = eplist[index - 1];
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${prevEp.id}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                <i class="fa fa-arrow-circle-left"></i> Episode ${prevEp.number || prevEp.id.split("$").pop()}
            </button></a>`;
    }

    if (index < eplist.length - 1) {
        const nextEp = eplist[index + 1];
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${nextEp.id}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                Episode ${nextEp.number || nextEp.id.split("$").pop()} <i class="fa fa-arrow-circle-right" style="margin-left:10px"></i>
            </button></a>`;
    }

    selectorDiv.innerHTML = html;
}

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("anime");
const episodeId = urlParams.get("episode");

if (!animeId || !episodeId) {
    window.location.href = "./index.html";
} else {
    // ✅ Use encoded episode ID in API
    getJson(episodeapi + encodeURIComponent(episodeId)).then((data) => {
        if (!data) {
            console.error("Episode not found");
            return;
        }

        const epTitle = data.title || "Episode";
        const sources = data.sources;

        document.documentElement.innerHTML = document.documentElement.innerHTML.replaceAll("{{ title }}", epTitle);

        loadVideo(epTitle, sources);

        getEpList(animeId).then(eplist => {
            getSelectorBtn(eplist, episodeId);
        });
    });
}
