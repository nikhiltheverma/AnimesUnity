const searchapi = "https://api.consumet.org/anime/zoro/";

// Fetch JSON utility
async function getJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (errors) {
        console.error(errors);
    }
}

// Lazy Load
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
    arr.forEach((v) => imageObserver.observe(v));
}

// Capitalize
function sentenceCase(str) {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

let hasNextPage = true;

// 🟢 Main Search Function
async function SearchAnime(query, page = 1) {
    const contentdiv = document.getElementById("latest2");
    const loader = document.getElementById("load");

    loader.style.display = "block";
    let html = "";

    try {
        const data = await getJson(`${searchapi}${encodeURIComponent(query)}?page=${page}`);
        const animes = data.results || [];

        if (animes.length === 0) {
            contentdiv.innerHTML = "<p>No results found.</p>";
            loader.style.display = "none";
            return false;
        }

        animes.forEach(anime => {
            const subOrDub = anime.subOrDub === "dub" ? "DUB" : "SUB";

            html += `<a href="./anime.html?anime=${encodeURIComponent(anime.id)}">
                <div class="poster la-anime"> 
                    <div id="shadow1" class="shadow"> 
                        <div class="dubb">${subOrDub}</div>
                    </div>
                    <div id="shadow2" class="shadow"> 
                        <img class="lzy_img" src="https://cdn.jsdelivr.net/gh/TechShreyash/AnimeDex@main/static/img/loading.gif" data-src="${anime.image}"> 
                    </div>
                    <div class="la-details"> 
                        <h3>${sentenceCase(anime.title)}</h3> 
                        <div id="extra"> 
                            <span>${anime.releaseDate || "Unknown"}</span> 
                        </div>
                    </div>
                </div>
            </a>`;
        });

        contentdiv.innerHTML += html;
        loader.style.display = "none";
        contentdiv.style.display = "block";

        return data.hasNextPage || false;
    } catch (err) {
        contentdiv.innerHTML = "<p>Error fetching results.</p>";
        loader.style.display = "none";
        return false;
    }
}

// Get Query
const params = new URLSearchParams(window.location.search);
const query = params.get("query");
let page = 1;

if (!query) window.location.replace("./index.html");

document.getElementById("latest").innerHTML = `Search Results: ${query}`;

// Initial Load
SearchAnime(query, page).then((hasMore) => {
    hasNextPage = hasMore;
    page++;
    RefreshLazyLoader();
    console.log("Search results loaded");
});

// Infinite Scroll
window.addEventListener("scroll", () => {
    if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100
    ) {
        if (hasNextPage) {
            SearchAnime(query, page).then((hasMore) => {
                hasNextPage = hasMore;
                page++;
                RefreshLazyLoader();
            });
        }
    }
});
