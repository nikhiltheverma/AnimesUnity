// Old Api urls

// const IndexApi = "https://api3.nikhilvermaultimate.workers.dev/home";
// const recentapi = "https://api3.nikhilvermaultimate.workers.dev/recent/";

// New Api urls
const BASE_URL = "https://animeunity.vercel.app/anime/zoro";
const IndexApi = "https://animeunity.vercel.app/anime/zoro/recent-episodes"; // for recent episodes
const recentapi = "https://animeunity.vercel.app/anime/zoro/recent-episodes?page="; // paginated recent

async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error(errors);
    }
}

function genresToString(genres) {
    return genres.join(", ");
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

// Adding slider animes (trending animes from anilist)
async function getTrendingAnimes(data) {
    let SLIDER_HTML = "";

    for (let pos = 0; pos < data.length; pos++) {
        let anime = data[pos];
        let title = anime["title"]["userPreferred"];
        let type = anime["format"];
        let status = anime["status"];
        let genres = genresToString(anime["genres"]);
        let description = anime["description"];
        let url = "./anime.html?anime=" + encodeURIComponent(title);

        let poster = anime["bannerImage"];
        if (poster == null) {
            poster = anime["coverImage"]["extraLarge"];
        }

        SLIDER_HTML += `<div class="mySlides fade"> <div class="data-slider"> <p class="spotlight">#${
            pos + 1
        } Spotlight</p><h1>${title}</h1> <div class="extra1"> <span class="year"><i class="fa fa-play-circle"></i>${type}</span> <span class="year year2"><i class="fa fa-calendar"></i>${status}</span> <span class="cbox cbox1">${genres}</span> <span class="cbox cbox2">HD</span> </div><p class="small-synop">${description}</p><div id="watchh"> <a href="${url}" class="watch-btn"> <i class="fa fa-play-circle"></i> Watch Now </a> <a href="${url}" class="watch-btn watch-btn2"> <i class="fa fa-info-circle"></i> Details<i class="fa fa-angle-right"></i> </a> </div></div><div class="shado"> <a href="${url}"></a> </div><img src="${poster}"> </div>`;
    }

    document.querySelector(".slideshow-container").innerHTML =
        SLIDER_HTML +
        '<a class="prev" onclick="plusSlides(-1)">&#10094;</a><a class="next" onclick="plusSlides(1)">&#10095;</a>';
}

// Adding popular animes (popular animes from gogoanime)
async function getPopularAnimes(data) {
    let POPULAR_HTML = "";

    for (let pos = 0; pos < data.length; pos++) {
        let anime = data[pos];
        let title = anime["title"];
        let id = anime["id"];
        let url = "./anime.html?anime=" + id;
        let image = anime["image"];
        let subOrDub;
        if (title.toLowerCase().includes("dub")) {
            subOrDub = "DUB";
        } else {
            subOrDub = "SUB";
        }

        POPULAR_HTML += `<a href="${url}"><div class="poster la-anime"> <div id="shadow1" class="shadow"><div class="dubb"># ${
            pos + 1
        }</div> <div class="dubb dubb2">${subOrDub}</div> </div><div id="shadow2" class="shadow"> <img class="lzy_img" src="https://cdn.jsdelivr.net/gh/TechShreyash/AnimeDex@main/static/img/loading.gif" data-src="${image}"> </div><div class="la-details"> <h3>${title}</h3></div></div></a>`;
    }

    document.querySelector(".popularg").innerHTML = POPULAR_HTML;
}

// Adding recent animes (recent episodes from API)
async function getRecentAnimes(page = 1) {
    const data = (await getJson(recentapi + page))["results"];
    let RECENT_HTML = "";

    for (let pos = 0; pos < data.length; pos++) {
        let anime = data[pos];
        let title = anime["title"];
        let id = anime["id"]; // ✅ FIXED HERE: Use correct anime ID
        let url = "./anime.html?anime=" + id;
        let image = anime["image"];
        let ep = anime["episodeNumber"];
        let subOrDub = "SUB"; // No info for DUB in this API

        RECENT_HTML += `<a href="${url}"><div class="poster la-anime">
        <div id="shadow1" class="shadow"><div class="dubb">${subOrDub}</div><div class="dubb dubb2">EP ${ep}</div></div>
        <div id="shadow2" class="shadow"> 
        <img class="lzy_img" src="https://cdn.jsdelivr.net/gh/TechShreyash/AnimeDex@main/static/img/loading.gif" data-src="${image}"> 
        </div>
        <div class="la-details"> <h3>${title}</h3></div></div></a>`;
    }

    document.querySelector(".recento").innerHTML += RECENT_HTML;
}

// Slider functions
let slideIndex = 0;
let clickes = 0;

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "flex";
}

async function showSlides2() {
    if (clickes == 1) {
        await sleep(10000);
        clickes = 0;
    }
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "flex";
    setTimeout(showSlides2, 5000);
}

function plusSlides(n) {
    showSlides((slideIndex += n));
    clickes = 1;
}
function currentSlide(n) {
    showSlides((slideIndex = n));
    clickes = 1;
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

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// To load more animes when scrolled to bottom
let page = 2;
let isLoading = 0;
let errCount = 0;
function loadAnimes() {
    try {
        if (isLoading == 0) {
            isLoading = 1;
            getRecentAnimes(page).then((data) => {
                RefreshLazyLoader();
                console.log("Recent animes loaded");
            });
            page += 1;
            isLoading = 0;
            errCount = 0;
        }
    } catch (error) {
        isLoading = 0;
        errCount += 1;
        if (errCount < 5) {
            setTimeout(loadAnimes(), 2000);
        }
    }
}

window.addEventListener("scroll", () => {
    if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight
    ) {
        loadAnimes();
    }
});

// Running functions
getJson(IndexApi).then((data) => {
    const recent = data["results"];

    getTrendingAnimes(shuffle(recent).slice(0, 10)).then(() => {
        RefreshLazyLoader();
        showSlides(slideIndex);
        showSlides2();
        console.log("Sliders loaded");
    });

    getPopularAnimes(recent).then(() => {
        RefreshLazyLoader();
        console.log("Popular animes loaded");
    });

    getRecentAnimes(1).then(() => {
        RefreshLazyLoader();
        console.log("Recent animes loaded");
    });
});
