const baseURL = "https://animeunity.vercel.app";
const source = "9anime"; // you can change to "animepahe" if needed

const getTrendingAnimes = async () => {
    try {
        const res = await fetch(`${baseURL}/anime/${source}`);
        const data = await res.json();

        const results = data.results || [];
        const container = document.querySelector(".popularg");

        if (!results.length) {
            container.innerHTML = "No trending anime found.";
            return;
        }

        container.innerHTML = results.map(anime => `
            <a href="anime.html?anime=${anime.id}">
                <div class="card">
                    <img src="${anime.image}" alt="${anime.title.english || anime.title.romaji}" loading="lazy"/>
                    <div class="title">${anime.title.english || anime.title.romaji}</div>
                </div>
            </a>
        `).join('');
    } catch (err) {
        console.error("Error fetching trending animes:", err);
    }
};

const getRecentAnimes = async () => {
    try {
        const res = await fetch(`${baseURL}/anime/${source}`);
        const data = await res.json();

        const results = data.results || [];
        const container = document.querySelector(".recento");

        if (!results.length) {
            container.innerHTML = "No recent anime found.";
            return;
        }

        container.innerHTML = results.map(anime => `
            <a href="anime.html?anime=${anime.id}">
                <div class="card">
                    <img src="${anime.image}" alt="${anime.title.english || anime.title.romaji}" loading="lazy"/>
                    <div class="title">${anime.title.english || anime.title.romaji}</div>
                </div>
            </a>
        `).join('');
    } catch (err) {
        console.error("Error fetching recent animes:", err);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    getTrendingAnimes();
    getRecentAnimes();
});
