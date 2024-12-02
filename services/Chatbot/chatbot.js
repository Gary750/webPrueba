// Elementos del DOM
const chatContent = document.getElementById('chat-content');
const inputMessage = document.getElementById('inputMessage');
const sendMessage = document.getElementById('sendMessage');

// Función para agregar mensajes al chat
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.innerHTML = `<span>${text}</span>`;
    chatContent.appendChild(message);
    chatContent.scrollTop = chatContent.scrollHeight; // Desplazar hacia abajo
}

// Función para buscar información de una película
async function buscarPelicula(titulo) {
    const apiKey = 'c06263e7'; // Tu API key
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${apiKey}&plot=full`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True') {
            return `
                <div style="text-align: left;">
                    <h3 style="margin: 0; color: #007BFF;">🎬 ${data.Title}</h3>
                    <p><strong>📅 Año:</strong> ${data.Year}</p>
                    <p><strong>🎭 Género:</strong> ${data.Genre}</p>
                    <p><strong>🎥 Director:</strong> ${data.Director}</p>
                    <p><strong>⭐ Calificación IMDB:</strong> ${data.imdbRating}/10</p>
                    <p><strong>📝 Resumen:</strong> ${data.Plot}</p>
                </div>
            `;
        } else {
            return `Lo siento, no encontré información sobre "${titulo}". Por favor, intenta con otro título.`;
        }
    } catch (error) {
        return 'Hubo un error al conectarse a la API. Intenta nuevamente más tarde.';
    }
}

// Manejar el envío del mensaje
sendMessage.addEventListener('click', async () => {
    const userMessage = inputMessage.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user'); // Mostrar mensaje del usuario
        inputMessage.value = ''; // Limpiar el campo de texto
        const botResponse = await buscarPelicula(userMessage); // Buscar en la API
        addMessage(botResponse, 'bot'); // Mostrar respuesta del bot
    }
});

// Enviar mensaje con la tecla Enter
inputMessage.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
});
