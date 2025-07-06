// const animeapi = "https://api3.nikhilvermaultimate.workers.dev/anime/";
// const episodeapi = "https://api3.nikhilvermaultimate.workers.dev/episode/";
// const dlapi = "https://api3.nikhilvermaultimate.workers.dev/download/";

// episode.js

// Zoro API URLs
const infoApiUrl = id =>
  `https://animeunity.vercel.app/anime/zoro/info?id=${encodeURIComponent(id)}`;
const watchApiUrl = epId =>
  `https://animeunity.vercel.app/anime/zoro/watch?episodeId=${encodeURIComponent(epId)}`;

// Helpers
async function getJson(url) {
  const res = await fetch(url);
  return await res.json();
}

// Load video & servers
function loadVideo(title, sources) {
  document.getElementById("ep-name").textContent = title;
  const serversbtn = document.getElementById("serversbtn");
  sources.forEach((s, i) => {
    const fileUrl = s.file;
    serversbtn.innerHTML += `
      <div class="sitem">
        <a class="sobtn${i===0?" sactive":""}"
           onclick="selectServer(this)"
           data-value="./embed.html?url=${encodeURIComponent(fileUrl)}">
          Server ${i+1}
        </a>
      </div>`;
  });
  document.querySelector(".sobtn.sactive").click();
}

window.selectServer = btn => {
  document.getElementById("AnimeDexFrame").src = btn.dataset.value;
  document.querySelectorAll(".sobtn").forEach(b => b.classList.remove("sactive"));
  btn.classList.add("sactive");
};

// Render prev/next
function renderEpisodeNav(eps, currentId, animeId) {
  const idx = eps.findIndex(e => e.id === currentId);
  let nav = "";
  if (idx > 0) {
    const prev = eps[idx - 1];
    nav += `<a class="btns" href="./episode.html?anime=${encodeURIComponent(animeId)}&episode=${prev.id}">
      <button class="sbtn"><i class="fa fa-arrow-circle-left"></i> EP ${prev.number}</button>
    </a>`;
  }
  if (idx < eps.length - 1) {
    const next = eps[idx + 1];
    nav += `<a class="btns" href="./episode.html?anime=${encodeURIComponent(animeId)}&episode=${next.id}">
      <button class="sbtn">EP ${next.number} <i class="fa fa-arrow-circle-right"></i></button>
    </a>`;
  }
  document.querySelector(".selector").innerHTML = nav;
}

// Init
const paramsE = new URLSearchParams(window.location.search);
const animeId2 = paramsE.get("anime");
const epId = paramsE.get("episode");
if (!animeId2 || !epId) {
  window.location.replace("./index.html");
} else {
  Promise.all([
    getJson(infoApiUrl(animeId2)),
    getJson(watchApiUrl(epId))
  ]).then(([infoRes, watchRes]) => {
    const eps = infoRes.results.episodes;
    const title = watchRes.results.title;
    const sources = watchRes.results.sources;

    // fill title in HTML
    document.documentElement.innerHTML =
      document.documentElement.innerHTML.replaceAll("{{ title }}", title);

    loadVideo(title, sources);
    renderEpisodeNav(eps, epId, animeId2);
  });
}
