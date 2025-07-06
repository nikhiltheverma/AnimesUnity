const animeapi = "https://api.consumet.org/anime/zoro/info?id=";
const episodeapi = "https://api.consumet.org/anime/zoro/watch?episodeId=";

async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error("Fetch error:", errors);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

    serversbtn.innerHTML = "";

    sources.forEach((source, i) => {
        const serverNum = i + 1;
        const btn = `<div class="sitem">
            <a class="sobtn ${i === 0 ? 'sactive' : ''}" onclick="selectServer(this)" data-value="./embed.html?url=${encodeURIComponent(source.url)}">
                Zoro Server ${serverNum}
            </a>
        </div>`;
        serversbtn.innerHTML += btn;
    });

    document.querySelector(".sobtn.sactive").click();
}

function selectServer(btn) {
    const iframe = document.getElementById("AnimeDexFrame");
    const buttons = document.querySelectorAll(".sobtn");

    buttons.forEach(b => b.classList.remove("sactive"));
    btn.classList.add("sactive");

    iframe.src = btn.dataset.value;
    iframe.style.display = "block";
}

async function getEpList(animeId) {
    const data = await getJson(animeapi + encodeURIComponent(animeId));
    const episodes = data?.episodes || [];

    const ephtmldiv = document.getElementById("ephtmldiv");
    ephtmldiv.innerHTML = "";

    episodes.forEach(ep => {
        const epNumber = ep.number || ep.id.split("$").pop();
        ephtmldiv.innerHTML += `<a class="ep-btn" href="./episode.html?anime=${encodeURIComponent(animeId)}&episode=${encodeURIComponent(ep.id)}">EP ${epNumber}</a>`;
    });

    return episodes;
}

function getSelectorBtn(eplist, currentId) {
    const selectorDiv = document.querySelector(".selector");
    if (!selectorDiv) return;

    const index = eplist.findIndex(ep => ep.id.toString() === currentId);
    let html = "";

    if (index > 0) {
        const prevEp = eplist[index - 1];
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${encodeURIComponent(prevEp.id)}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                <i class="fa fa-arrow-circle-left"></i> Episode ${prevEp.number || prevEp.id.split("$").pop()}
            </button></a>`;
    }

    if (index < eplist.length - 1) {
        const nextEp = eplist[index + 1];
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${encodeURIComponent(nextEp.id)}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                Episode ${nextEp.number || nextEp.id.split("$").pop()} <i class="fa fa-arrow-circle-right" style="margin-left:10px"></i>
            </button></a>`;
    }

    selectorDiv.innerHTML = html;
}

const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("anime");
const episodeId = urlParams.get("episode");

if (!animeId || !episodeId) {
    window.location.href = "./index.html";
} else {
    getJson(`${episodeapi}${encodeURIComponent(episodeId)}&server=vidcloud`).then((data) => {
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
