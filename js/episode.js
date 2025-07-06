// const animeapi = "https://api3.nikhilvermaultimate.workers.dev/anime/";
// const episodeapi = "https://api3.nikhilvermaultimate.workers.dev/episode/";
// const dlapi = "https://api3.nikhilvermaultimate.workers.dev/download/";

const animeapi = "https://animeunity.vercel.app/anime/zoro/info?id=";
const episodeapi = "https://animeunity.vercel.app/anime/zoro/watch?episodeId=";

// Usefull functions

async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error(errors);
    }
}

function sentenceCase(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get m3u8 url of episode
async function loadVideo(name, sources) {
    try {
        document.getElementById("ep-name").innerHTML = name;
        const serversbtn = document.getElementById("serversbtn");

        let url = sources[0]["url"];
        serversbtn.innerHTML += `<div class="sitem"> <a class="sobtn sactive" onclick="selectServer(this)" data-value="./embed.html?url=${url}">Zoro Server 1</a> </div>`;
        document.getElementsByClassName("sactive")[0].click();

        if (sources.length > 1) {
            let url2 = sources[1]["url"];
            serversbtn.innerHTML += `<div class="sitem"> <a class="sobtn" onclick="selectServer(this)" data-value="./embed.html?url=${url2}">Zoro Server 2</a> </div>`;
        }

        return true;
    } catch (err) {
        console.error("Error loading video:", err);
        return false;
    }
}

// Function to select server
function selectServer(btn) {
    const buttons = document.getElementsByClassName("sobtn");
    const iframe = document.getElementById("AnimeDexFrame");
    iframe.src = btn.getAttribute("data-value");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = "sobtn";
    }
    btn.className = "sobtn sactive";
}

// Function to get episode list
async function getEpList(anime_id) {
    const data = await getJson(animeapi + anime_id);
    const eplist = data["episodes"];
    let ephtml = "";

    for (let i = 0; i < eplist.length; i++) {
        const ep = eplist[i];
        ephtml += `<a class="ep-btn" href="./episode.html?anime=${anime_id}&episode=${ep["id"]}">${ep["number"]}</a>`;
    }

    document.getElementById("ephtmldiv").innerHTML = ephtml;
    return eplist;
}

// Function to get selector btn
async function getSelectorBtn(eplist, currentId) {
    let currentIndex = eplist.findIndex(ep => ep.id === currentId);

    let html = "";
    if (eplist.length < 2) {
        html = "";
    } else {
        if (currentIndex > 0) {
            html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${eplist[currentIndex - 1].id}">
                <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    <i class="fa fa-arrow-circle-left"></i> Episode ${eplist[currentIndex - 1].number}
                </button></a>`;
        }

        if (currentIndex < eplist.length - 1) {
            html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${eplist[currentIndex + 1].id}">
                <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Episode ${eplist[currentIndex + 1].number} <i style="margin-left:10px" class="fa fa-arrow-circle-right"></i>
                </button></a>`;
        }
    }

    document.getElementsByClassName("selector")[0].innerHTML = html;
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("anime") == null || urlParams.get("episode") == null) {
    window.location = "./index.html";
}

// Running functions
getJson(episodeapi + urlParams.get("episode")).then((data) => {
    const sources = data["sources"];
    const epTitle = data["title"];

    document.documentElement.innerHTML =
        document.documentElement.innerHTML.replaceAll("{{ title }}", epTitle);

    loadVideo(epTitle, sources).then(() => {
        console.log("Video loaded");
    });

    getEpList(urlParams.get("anime")).then((eplist) => {
        console.log("Episode list loaded");
        getSelectorBtn(eplist, urlParams.get("episode")).then(() => {
            console.log("Selector btn loaded");
        });
    });
});
