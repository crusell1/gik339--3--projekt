// Konfiguration - ändra porten om din backend körs på en annan (t.ex. 3000)
const API_URL = 'http://localhost:3000/movies';

// Hämta element från HTML
const movieForm = document.getElementById('movieForm');
const movieList = document.getElementById('movieList');
const movieIdInput = document.getElementById('movieId');
const submitBtn = document.getElementById('submitBtn');
const feedbackModal = document.getElementById('feedbackModal');
const modalMessage = document.getElementById('modalMessage');

// 1. VISA ALLA - Körs när sidan laddas 
async function fetchMovies() {
    try {
        const response = await fetch(API_URL); 
        const movies = await response.json();
        renderMovies(movies);
    } catch (error) {
        showFeedback('Kunde inte hämta filmer: ' + error.message);
    }
}

// Funktion för att skapa HTML-elementen (boxarna) dynamiskt 
function renderMovies(movies) {
    movieList.innerHTML = ''; // Töm listan först 

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        
        // Tailwind-styling för boxen 
        // KRAV: En egenskap styr designen (t.ex. gult för högt betyg) 
        const ratingClass = movie.rating >= 4 ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200 bg-white';
        
        movieCard.className = `p-5 rounded-xl shadow-sm border-2 transition hover:shadow-md ${ratingClass}`;
        
        movieCard.innerHTML = `
            <h3 class="text-xl font-bold text-slate-800 mb-1">${movie.title}</h3>
            <p class="text-sm font-semibold text-slate-500 mb-3 italic">Betyg: ${movie.rating}/5</p>
            <p class="text-slate-600 mb-6">${movie.description}</p>
            <div class="flex gap-3">
                <button onclick="prepareUpdate(${movie.id})" class="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition">Ändra</button>
                <button onclick="deleteMovie(${movie.id})" class="text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition">Ta bort</button>
            </div>
        `;
        movieList.appendChild(movieCard);
    });
}

// 2. SKICKA FORMULÄR 
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Hindra sidan från att laddas om 

    const movieData = {
        title: document.getElementById('title').value,
        rating: parseInt(document.getElementById('rating').value),
        description: document.getElementById('description').value
    };

    const id = movieIdInput.value;
    let method = 'POST'; // Standard är att skapa ny 
    let url = API_URL;

    // Om det finns ett ID i det dolda fältet, välj PUT (uppdatera) 
    if (id) {
        method = 'PUT';
        movieData.id = id; 
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData) 
        });

        if (response.ok) {
            showFeedback(id ? 'Filmen har uppdaterats!' : 'Filmen har lagts till!');
            movieForm.reset();
            movieIdInput.value = ''; // Rensa ID efteråt
            submitBtn.textContent = 'Spara film';
            fetchMovies(); // Uppdatera listan dynamiskt 
        }
    } catch (error) {
        showFeedback('Ett fel uppstod: ' + error.message);
    }
});

// 3. TA BORT EN RESURS 
async function deleteMovie(id) {
    if (confirm('Är du säker på att du vill ta bort filmen?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); 
            
            if (response.ok) {
                showFeedback('Filmen har tagits bort.');
                fetchMovies(); // Uppdatera listan dynamiskt 
            }
        } catch (error) {
            showFeedback('Kunde inte ta bort: ' + error.message);
        }
    }
}

// 4. FÖRBERED UPPDATERING (Fyll i formuläret) 
async function prepareUpdate(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`); 
        const movie = await response.json();

        // Fyll formuläret med befintlig data 
        document.getElementById('title').value = movie.title;
        document.getElementById('rating').value = movie.rating;
        document.getElementById('description').value = movie.description;
        movieIdInput.value = movie.id; // Spara ID osynligt 

        submitBtn.textContent = 'Uppdatera film';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Kunde inte hämta film för redigering');
    }
}

// 5. MEDDELANDERUTA (Feedback) 
function showFeedback(message) {
    modalMessage.textContent = message;
    feedbackModal.classList.remove('hidden'); // Visa modaler genom att ta bort Tailwind-klass 
}

function closeModal() {
    feedbackModal.classList.add('hidden');
}

// Starta appen
fetchMovies();