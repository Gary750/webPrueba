// Función para realizar la búsqueda en la API de Open Library
async function buscarLibros(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el término de búsqueda ingresado por el usuario
    const query = document.querySelector('.search-input').value;

    if (!query.trim()) {
        alert("Por favor, introduce un término de búsqueda.");
        return;
    }

    // Endpoint de la API
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

    try {
        // Realizar la solicitud GET
        const response = await fetch(url);

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Mostrar resultados
        mostrarResultados(data);
    } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        alert("Ocurrió un error al realizar la búsqueda.");
    }
}

// Función para mostrar los resultados en la página
function mostrarResultados(data) {
    const resultsContainer = document.querySelector('.results');
    resultsContainer.innerHTML = ""; // Limpiar resultados anteriores

    if (data.numFound === 0) {
        resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    // Iterar sobre los primeros 5 resultados
    data.docs.slice(0, 5).forEach(book => {
        const title = book.title || "Sin título";
        const author = book.author_name?.[0] || "Autor desconocido";
        const year = book.first_publish_year || "Año desconocido";
        const coverId = book.cover_i;
        const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : "https://via.placeholder.com/128x193?text=Sin+imagen";

        // Crear elemento para cada libro
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-card');
        bookElement.innerHTML = `
            <img src="${coverUrl}" alt="Portada de ${title}">
            <h3>${title}</h3>
            <p>Autor: ${author}</p>
            <p>Año de publicación: ${year}</p>
        `;
        resultsContainer.appendChild(bookElement);
    });
}

// Agregar evento al formulario
document.querySelector('.search-bar button').addEventListener('click', buscarLibros);
