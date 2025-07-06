// const animeapi = "https://api3.nikhilvermaultimate.workers.dev/anime/";
// const recommendationsapi = "https://api3.nikhilvermaultimate.workers.dev/recommendations/";

// anime.js

// Zoro API URL
const animeApiUrl = id =>
  `https://animeunity.vercel.app/anime/zoro/info?id=${encodeURIComponent(id)}`;

// Helpers
async function getJson(url) {
  const res = await fetch(url);
  return await res.json();
}
function getGenreHtml(genres) {
  return genres.map(g => `<a>${g}</a>`).join("");
}
function RefreshLazyLoader() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        obs.unobserve(e.target);
      }
    });
  });
  document.querySelectorAll("img.lzy_img").forEach(img => obs.observe(img));
}

// Render anime details
function renderAnime(data) {
  const { id, title, description, image, type, status, genres, episodes, releaseDate } = data;

  document.documentElement.innerHTML = document.documentElement.innerHTML
    .replaceAll("TITLE", title)
    .replaceAll("IMG", image)
    .replaceAll("LANG", `EP ${episodes.length}`)
    .replaceAll("TYPE", type)
    .replaceAll("URL", window.location.href)
    .replaceAll("SYNOPSIS", description)
    .replaceAll("OTHER", title)
    .replaceAll("TOTAL", episodes.length)
    .replaceAll("YEAR", releaseDate)
    .replaceAll("STATUS", status)
    .replaceAll("GENERES", getGenreHtml(genres));

  document.getElementById("main-content").style.display = "block";
  document.getElementById("load").style.display = "none";

  // Watch Now button
  document.getElementById("watch-btn").href =
    `./episode.html?anime=${encodeURIComponent(id)}&episode=${episodes[0].id}`;

  // Episodes list
  let ephtml = "";
  episodes.forEach(ep => {
    ephtml += `<a class="ep-btn" href="./episode.html?anime=${encodeURIComponent(id)}&episode=${ep.id}">${ep.number}</a>`;
  });
  document.getElementById("ephtmldiv").innerHTML = ephtml;

  RefreshLazyLoader();
}

// Init
const params = new URLSearchParams(window.location.search);
const animeId = params.get("anime");
if (!animeId) {
  window.location.replace("./index.html");
} else {
  getJson(animeApiUrl(animeId)).then(res => {
    renderAnime(res.results);
  });
}
