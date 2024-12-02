// Claves de API
const TMDB_API_KEY = "7ab1dd3eb8affddbd69da6806715873a";
const YOUTUBE_API_KEY = "AIzaSyA1jSbZ5-2JZgMGmYw2X1Jugu8Mbq1FFbw";

// Elementos del DOM
const searchInput = document.getElementById("movie-search");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results");

// Función para buscar películas
const buscarPeliculas = async (query) => {
    if (!query) {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }

    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;

    try {
        const respuesta = await fetch(tmdbUrl);
        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const resultados = datos.results;

        resultsContainer.innerHTML = "";

        if (resultados && resultados.length > 0) {
            resultados.slice(0, 5).forEach((pelicula) => {
                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");

                const movieImage = document.createElement("img");
                movieImage.src = pelicula.poster_path
                    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image";
                movieImage.alt = pelicula.title;

                const movieTitle = document.createElement("h3");
                movieTitle.textContent = pelicula.title;

                const movieDescription = document.createElement("p");
                movieDescription.textContent = pelicula.overview || "Sin descripción disponible.";

                const trailerButton = document.createElement("button");
                trailerButton.textContent = "Ver Trailer";
                trailerButton.classList.add("trailer-button");
                trailerButton.addEventListener("click", () => buscarTrailer(pelicula.title));

                movieCard.appendChild(movieImage);
                movieCard.appendChild(movieTitle);
                movieCard.appendChild(movieDescription);
                movieCard.appendChild(trailerButton);

                resultsContainer.appendChild(movieCard);
            });
        } else {
            resultsContainer.innerHTML = `<p>No se encontraron resultados para "${query}".</p>`;
        }
    } catch (error) {
        console.error("Error al buscar películas:", error);
        resultsContainer.innerHTML = `<p>Ocurrió un error al realizar la búsqueda. Por favor, intenta nuevamente.</p>`;
    }
};

// Función para buscar el trailer en YouTube
const buscarTrailer = async (movieTitle) => {
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        movieTitle
    )}+trailer&type=video&key=${YOUTUBE_API_KEY}`;

    try {
        const respuesta = await fetch(youtubeUrl);
        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        if (datos.items && datos.items.length > 0) {
            const video = datos.items[0];
            const videoId = video.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Redirigir al usuario al trailer
            window.open(videoUrl, "_blank");
        } else {
            alert("No se encontraron trailers para esta película.");
        }
    } catch (error) {
        console.error("Error al buscar el trailer:", error);
        alert("Ocurrió un error al buscar el trailer. Por favor, intenta nuevamente.");
    }
};

// Agregar evento al botón de búsqueda
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    buscarPeliculas(query);
});
