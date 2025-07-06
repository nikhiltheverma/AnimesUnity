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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load video into iframe
async function loadVideo(name, sources) {
    try {
        document.getElementById("ep-name").innerHTML = name;
        const serversbtn = document.getElementById("serversbtn");

        if (!sources || sources.length === 0) {
            serversbtn.innerHTML = `<div class="sitem error-text">No servers available for this episode.</div>`;
            document.getElementById("AnimeDexFrame").style.display = "none";
            return false;
        }

        let url = sources[0]["url"];
        serversbtn.innerHTML += `<div class="sitem"> 
            <a class="sobtn sactive" onclick="selectServer(this)" data-value="./embed.html?url=${url}">Zoro Server 1</a> 
        </div>`;
        document.getElementsByClassName("sactive")[0].click();

        if (sources.length > 1) {
            let url2 = sources[1]["url"];
            serversbtn.innerHTML += `<div class="sitem"> 
                <a class="sobtn" onclick="selectServer(this)" data-value="./embed.html?url=${url2}">Zoro Server 2</a> 
            </div>`;
        }

        return true;
    } catch (err) {
        console.error("Error loading video:", err);
        return false;
    }
}

// Select streaming server
function selectServer(btn) {
    const buttons = document.getElementsByClassName("sobtn");
    const iframe = document.getElementById("AnimeDexFrame");
    iframe.src = btn.getAttribute("data-value");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = "sobtn";
    }
    btn.className = "sobtn sactive";
}

// Load episode list
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

// Previous/Next episode buttons
async function getSelectorBtn(eplist, currentId) {
    let currentIndex = eplist.findIndex(ep => ep.id.toString() === currentId);
    let html = "";

    if (currentIndex > 0) {
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${eplist[currentIndex - 1].id}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                <i class="fa fa-arrow-circle-left"></i> Episode ${eplist[currentIndex - 1].number}
            </button></a>`;
    }

    if (currentIndex < eplist.length - 1) {
        html += `<a class="btns" href="./episode.html?anime=${urlParams.get("anime")}&episode=${eplist[currentIndex + 1].id}">
            <button class="sbtn inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                Episode ${eplist[currentIndex + 1].number} <i class="fa fa-arrow-circle-right" style="margin-left:10px"></i>
            </button></a>`;
    }

    document.getElementsByClassName("selector")[0].innerHTML = html;
}

// Get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (!urlParams.get("anime") || !urlParams.get("episode")) {
    window.location = "./index.html";
}

// Main execution
getJson(episodeapi + urlParams.get("episode")).then((data) => {
    const sources = data["sources"];
    const epTitle = data["title"];

    document.documentElement.innerHTML = document.documentElement.innerHTML.replaceAll("{{ title }}", epTitle);

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
