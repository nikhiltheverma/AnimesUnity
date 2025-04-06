// ✅ NEW API Base
const trendingApi = "https://animeunity.vercel.app/meta/anilist/trending";
const recentApi = "https://animeunity.vercel.app/meta/anime/gogoanime/recent-episodes";

// 👇 Generic Fetcher
async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
    }
}

// 👇 Genres to String
function genresToString(genres) {
    return genres.join(", ");
}

// 👇 Trending Anilist Anime Slider
async function getTrendingAnimes(data) {
    let SLIDER_HTML = "";
    for (let pos = 0; pos < data.length; pos++) {
        const anime = data[pos];
        const title = anime.title.userPreferred;
        const type = anime.format;
        const status = anime.status;
        const genres = genresToString(anime.genres);
        const description = anime.description;
        const url = `./anime.html?anime=${encodeURIComponent(title)}`;
        let poster = anime.bannerImage || anime.coverImage.extraLarge;

        SLIDER_HTML += `
            <div class="mySlides fade">
                <div class="data-slider">
                    <p class="spotlight">#${pos + 1} Spotlight</p>
                    <h1>${title}</h1>
                    <div class="extra1">
                        <span class="year"><i class="fa fa-play-circle"></i>${type}</span>
                        <span class="year year2"><i class="fa fa-calendar"></i>${status}</span>
                        <span class="cbox cbox1">${genres}</span>
                        <span class="cbox cbox2">HD</span>
                    </div>
                    <p class="small-synop">${description}</p>
                    <div id="watchh">
                        <a href="${url}" class="watch-btn"><i class="fa fa-play-circle"></i> Watch Now</a>
                        <a href="${url}" class="watch-btn watch-btn2"><i class="fa fa-info-circle"></i> Details<i class="fa fa-angle-right"></i></a>
                    </div>
                </div>
                <div class="shado"><a href="${url}"></a></div>
                <img src="${poster}">
            </div>`;
    }

    document.querySelector(".slideshow-container").innerHTML =
        SLIDER_HTML +
        '<a class="prev" onclick="plusSlides(-1)">&#10094;</a><a class="next" onclick="plusSlides(1)">&#10095;</a>';
}

// 👇 Recent Gogoanime Episodes
async function getRecentAnimes() {
    const { results } = await getJson(recentApi);
    let RECENT_HTML = "";

    results.forEach((anime, pos) => {
        const title = anime.title;
        const id = anime.id;
        const image = anime.image;
        const url = `./anime.html?anime=${id}`;
        const episodeNum = anime.episodeNumber;
        const subOrDub = anime.subOrDub.toUpperCase();

        RECENT_HTML += `
            <a href="${url}">
                <div class="poster la-anime">
                    <div id="shadow1" class="shadow">
                        <div class="dubb">${subOrDub}</div>
                        <div class="dubb dubb2">EP ${episodeNum}</div>
                    </div>
                    <div id="shadow2" class="shadow">
                        <img class="lzy_img" src="https://cdn.jsdelivr.net/gh/TechShreyash/AnimeDex@main/static/img/loading.gif" data-src="${image}">
                    </div>
                    <div class="la-details"><h3>${title}</h3></div>
                </div>
            </a>`;
    });

    document.querySelector(".recento").innerHTML += RECENT_HTML;
}

// 👇 Slider Functions
let slideIndex = 0;
let clickes = 0;

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "flex";
}

function plusSlides(n) {
    showSlides((slideIndex += n));
    clickes = 1;
}

async function showSlides2() {
    if (clickes == 1) {
        await sleep(10000);
        clickes = 0;
    }
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "flex";
    setTimeout(showSlides2, 5000);
}

// 👇 Lazy Load Images
async function RefreshLazyLoader() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
            }
        });
    });
    document.querySelectorAll("img.lzy_img").forEach((img) => {
        imageObserver.observe(img);
    });
}

// 👇 Utility
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 👇 Initial Function Calls
getJson(trendingApi).then((data) => {
    getTrendingAnimes(data.results).then(() => {
        RefreshLazyLoader();
        showSlides(slideIndex);
        showSlides2();
    });
});

getRecentAnimes().then(() => {
    RefreshLazyLoader();
});
