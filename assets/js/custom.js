// assets/js/custom.js
// LD10 užduoties JavaScript funkcionalumas

document.addEventListener('DOMContentLoaded', function() {
    // 1. Atnaujiname kontaktų formą
    updateContactForm();
    
    // 2. Inicializuojame formos funkcionalumą
    initContactForm();
    
    // 3. Inicializuojame telefono numerio formatavimą
    initPhoneNumberFormatting();
    
    // 4. Inicializuojame realaus laiko validaciją
    initRealTimeValidation();
});

// Funkcija atnaujinti kontaktų formą
function updateContactForm() {
    const contactForm = document.querySelector('.php-email-form');
    
    if (!contactForm) {
        console.error('Kontaktų forma nerasta!');
        return;
    }
    
    // Išsaugome esamą formos HTML
    const existingForm = contactForm.innerHTML;
    
    // Sukuriame naują formos struktūrą
    const newFormHTML = `
        <div class="row gy-4">
            <div class="col-md-6">
                <input type="text" name="name" class="form-control" id="firstName" placeholder="Vardas" required>
                <div class="error-message" id="firstNameError"></div>
            </div>

            <div class="col-md-6">
                <input type="text" name="surname" class="form-control" id="lastName" placeholder="Pavardė" required>
                <div class="error-message" id="lastNameError"></div>
            </div>

            <div class="col-md-6">
                <input type="email" class="form-control" name="email" id="email" placeholder="El. paštas" required>
                <div class="error-message" id="emailError"></div>
            </div>

            <div class="col-md-6">
                <input type="tel" class="form-control" name="phone" id="phone" placeholder="Telefono numeris" required maxlength="12">
                <div class="error-message" id="phoneError"></div>
            </div>

            <div class="col-12">
                <input type="text" class="form-control" name="address" id="address" placeholder="Adresas" required>
                <div class="error-message" id="addressError"></div>
            </div>

            <!-- Vertinimo klausimai -->
            <div class="col-12">
                <h5 class="mt-4 mb-3">Vertinimo klausimai (1-10 balų skalė)</h5>
                
                <div class="rating-question mb-4">
                    <label for="rating1" class="form-label">Kaip vertinate mano techninius įgūdžius?</label>
                    <input type="range" class="form-range rating-slider" id="rating1" name="rating1" min="1" max="10" value="5">
                    <div class="rating-value">
                        <span class="current-value">5</span>/10
                    </div>
                    <div class="error-message" id="rating1Error"></div>
                </div>

                <div class="rating-question mb-4">
                    <label for="rating2" class="form-label">Kaip vertinate mano komunikacijos įgūdžius?</label>
                    <input type="range" class="form-range rating-slider" id="rating2" name="rating2" min="1" max="10" value="5">
                    <div class="rating-value">
                        <span class="current-value">5</span>/10
                    </div>
                    <div class="error-message" id="rating2Error"></div>
                </div>

                <div class="rating-question mb-4">
                    <label for="rating3" class="form-label">Kaip vertinate mano projekto valdymo įgūdžius?</label>
                    <input type="range" class="form-range rating-slider" id="rating3" name="rating3" min="1" max="10" value="5">
                    <div class="rating-value">
                        <span class="current-value">5</span>/10
                    </div>
                    <div class="error-message" id="rating3Error"></div>
                </div>
            </div>

            <div class="col-md-12 text-center">
                <div class="loading">Siunčiama</div>
                <div class="error-message"></div>
                <div class="sent-message">Jūsų žinutė išsiųsta. Ačiū!</div>

                <button type="submit" id="submitBtn" class="shine" disabled>Siųsti vertinimą</button>
            </div>
        </div>

        <!-- Rezultatų atvaizdavimo sritis -->
        <div id="formResults" class="mt-5" style="display: none;">
            <h4>Pateikti duomenys:</h4>
            <div id="resultsContent" class="results-content"></div>
        </div>
    `;
    
    // Atnaujiname formą
    contactForm.innerHTML = newFormHTML;
    
    // Pridedame stilius vertinimo slankikliams
    addRatingStyles();
}

// Pridedame papildomus stilius vertinimo elementams
function addRatingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .rating-question {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #333;
        }
        
        .rating-slider {
            width: 100%;
            height: 8px;
            margin: 10px 0;
            background: #333;
            border-radius: 5px;
            outline: none;
        }
        
        .rating-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #e74c3c;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .rating-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #e74c3c;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }
        
        .rating-value {
            text-align: center;
            font-weight: bold;
            color: #00bcd4;
            margin-top: 5px;
        }
        
        .current-value {
            font-size: 1.2em;
            color: #e74c3c;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.9em;
            margin-top: 5px;
            display: none;
        }
        
        .form-control.error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25) !important;
        }
        
        .form-control.success {
            border-color: #2ecc71 !important;
        }
        
        #submitBtn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .results-content {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #333;
        }
        
        .result-item {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }
        
        .result-item:last-child {
            border-bottom: none;
        }
        
        .success-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2ecc71;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10000;
            text-align: center;
            animation: popIn 0.5s ease-out;
        }
        
        @keyframes popIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        
        .success-popup.fade-out {
            animation: popOut 0.5s ease-in forwards;
        }
        
        @keyframes popOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -40%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializuojame kontaktų formą
function initContactForm() {
    const form = document.querySelector('.php-email-form');
    
    if (!form) return;
    
    // Slankiklių vertės atnaujinimas
    const sliders = document.querySelectorAll('.rating-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const valueDisplay = this.parentElement.querySelector('.current-value');
            valueDisplay.textContent = this.value;
        });
    });
    
    // Formos pateikimo apdorojimas
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
    });
}

// Formos pateikimo apdorojimas
function handleFormSubmit() {
    // Surinkti formos duomenis
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        rating1: parseInt(document.getElementById('rating1').value),
        rating2: parseInt(document.getElementById('rating2').value),
        rating3: parseInt(document.getElementById('rating3').value)
    };
    
    // 4a. Išvesti į konsolę
    console.log('Formos duomenys:', formData);
    
    // 4b. Atvaizduoti rezultatus svetainėje
    displayFormResults(formData);
    
    // 5. Apskaičiuoti ir atvaizduoti vidurkį
    displayAverageRating(formData);
    
    // 6. Rodyti sėkmės pranešimą
    showSuccessMessage();
}

// Atvaizduoti formos rezultatus
function displayFormResults(data) {
    const resultsDiv = document.getElementById('formResults');
    const resultsContent = document.getElementById('resultsContent');
    
    const resultsHTML = `
        <div class="result-item">
            <strong>Vardas:</strong> ${data.firstName}
        </div>
        <div class="result-item">
            <strong>Pavardė:</strong> ${data.lastName}
        </div>
        <div class="result-item">
            <strong>El. paštas:</strong> ${data.email}
        </div>
        <div class="result-item">
            <strong>Telefono numeris:</strong> ${data.phone}
        </div>
        <div class="result-item">
            <strong>Adresas:</strong> ${data.address}
        </div>
        <div class="result-item">
            <strong>Techniniai įgūdžiai:</strong> ${data.rating1}/10
        </div>
        <div class="result-item">
            <strong>Komunikacijos įgūdžiai:</strong> ${data.rating2}/10
        </div>
        <div class="result-item">
            <strong>Projekto valdymo įgūdžiai:</strong> ${data.rating3}/10
        </div>
    `;
    
    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
}

// Apskaičiuoti ir atvaizduoti vidurkį
function displayAverageRating(data) {
    const average = (data.rating1 + data.rating2 + data.rating3) / 3;
    const resultsContent = document.getElementById('resultsContent');
    
    const averageHTML = `
        <div class="result-item" style="border-top: 2px solid #00bcd4; margin-top: 15px; padding-top: 15px;">
            <strong style="color: #00bcd4;">${data.firstName} ${data.lastName}: ${average.toFixed(1)}</strong>
        </div>
    `;
    
    resultsContent.innerHTML += averageHTML;
}

// Rodyti sėkmės pranešimą
function showSuccessMessage() {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <i class="bi bi-check-circle-fill" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
        <h4 style="margin: 0;">Duomenys pateikti sėkmingai!</h4>
    `;
    
    document.body.appendChild(popup);
    
    // Pašalinti pranešimą po 3 sekundžių
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 500);
    }, 3000);
}

// PAPILDOMA UŽDUOTIS

// Telefono numerio formatavimas realiu laiku
function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Pašalinti viską, kas ne skaitmuo
        
        // Apriboti ilgį iki 9 skaitmenų (be +370)
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        
        // Formatavimas
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = '+370 ';
            if (value.length > 1) {
                formattedValue += value.substring(1, 4) + ' ';
                if (value.length > 4) {
                    formattedValue += value.substring(4, 9);
                } else {
                    formattedValue += value.substring(4);
                }
            } else {
                formattedValue += value.substring(1);
            }
        }
        
        e.target.value = formattedValue;
    });
}

// Realaus laiko validacija
function initRealTimeValidation() {
    const form = document.querySelector('.php-email-form');
    const inputs = form.querySelectorAll('input[required]');
    const submitBtn = document.getElementById('submitBtn');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
        input.addEventListener('input', checkFormValidity);
    });
    
    // Pradinė formos būsenos patikra
    checkFormValidity();
}

// Lauko validacija
function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    let errorMessage = '';
    
    // Išvalyti ankstesnes klaidas
    field.classList.remove('error', 'success');
    errorElement.style.display = 'none';
    
    // Tuščio lauko tikrinimas
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'Šis laukas yra privalomas';
    } else {
        // Specifinė validacija pagal lauko tipą
        switch(field.type) {
            case 'text':
                if (field.id === 'firstName' || field.id === 'lastName') {
                    // Vardo ir pavardės validacija (tik raidės)
                    if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Vardas ir pavardė gali būti sudaryti tik iš raidžių';
                    }
                }
                break;
                
            case 'email':
                // El. pašto validacija
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Įveskite teisingą el. pašto adresą';
                }
                break;
                
            case 'tel':
                // Telefono numerio validacija
                const phoneRegex = /^\+\d{3,4}\s\d{3}\s\d{5}$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Įveskite teisingą telefono numerį (+370 6xx xxxxx)';
                }
                break;
        }
    }
    
    // Rodyti klaidą arba sėkmę
    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    } else {
        field.classList.add('success');
    }
    
    return isValid;
}

// Formos galiojimo tikrinimas
function checkFormValidity() {
    const form = document.querySelector('.php-email-form');
    const inputs = form.querySelectorAll('input[required]');
    const submitBtn = document.getElementById('submitBtn');
    
    let isFormValid = true;
    
    inputs.forEach(input => {
        // Laikinai išjungti event listener, kad išvengtume rekursijos
        input.removeEventListener('blur', validateField);
        input.removeEventListener('input', validateField);
        
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
        
        // Vėl įjungti event listener
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });
    
    // Įjungti/išjungti mygtuką
    submitBtn.disabled = !isFormValid;
}
/* ==================================== */
/* MEMORY GAME FUNCTIONALITY - LD11 */
/* ==================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializuojame žaidimą
    initMemoryGame();
});

// Žaidimo kintamieji
let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalMoves: 0,
    gameStarted: false,
    gameBoard: null,
    timer: null,
    seconds: 0,
    difficulty: 'easy', // 'easy' arba 'hard'
    bestScores: {
        easy: { moves: Infinity, time: Infinity },
        hard: { moves: Infinity, time: Infinity }
    },
    cardData: [
        { id: 1, icon: '⚡', color: '#ffeb3b' },
        { id: 2, icon: '🔧', color: '#2196f3' },
        { id: 3, icon: '💡', color: '#4caf50' },
        { id: 4, icon: '🔌', color: '#ff9800' },
        { id: 5, icon: '📱', color: '#9c27b0' },
        { id: 6, icon: '💻', color: '#00bcd4' },
        { id: 7, icon: '🔋', color: '#ff5722' },
        { id: 8, icon: '📡', color: '#795548' },
        { id: 9, icon: '🛠️', color: '#607d8b' },
        { id: 10, icon: '🔬', color: '#8bc34a' }
    ]
};

// Inicializuoti žaidimą
function initMemoryGame() {
    // Surasti DOM elementus
    memoryGame.gameBoard = document.getElementById('gameBoard');
    
    // Įkelti geriausius rezultatus iš localStorage
    loadBestScores();
    
    // Pridėti event listenerius
    document.getElementById('easyBtn').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('hardBtn').addEventListener('click', () => setDifficulty('hard'));
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Sugeneruoti pradinę žaidimo lentą
    generateGameBoard();
    
    // Atnaujinti statistikos rodiklį
    updateBestScoresDisplay();
}

// Įkelti geriausius rezultatus iš localStorage
function loadBestScores() {
    const savedScores = localStorage.getItem('memoryGameBestScores');
    if (savedScores) {
        try {
            memoryGame.bestScores = JSON.parse(savedScores);
        } catch (e) {
            console.error('Klaida įkeliant rezultatus:', e);
            // Naudoti numatytuosius rezultatus
            memoryGame.bestScores = {
                easy: { moves: Infinity, time: Infinity },
                hard: { moves: Infinity, time: Infinity }
            };
        }
    }
}

// Išsaugoti geriausius rezultatus į localStorage
function saveBestScores() {
    try {
        localStorage.setItem('memoryGameBestScores', JSON.stringify(memoryGame.bestScores));
    } catch (e) {
        console.error('Klaida išsaugant rezultatus:', e);
    }
}

// Atnaujinti geriausius rezultatus
function updateBestScores() {
    const currentDifficulty = memoryGame.difficulty;
    const currentBest = memoryGame.bestScores[currentDifficulty];
    
    let isNewBest = false;
    
    // Tikrinti ar dabartinis rezultatas geresnis (mažiau ėjimų)
    if (memoryGame.totalMoves < currentBest.moves) {
        memoryGame.bestScores[currentDifficulty].moves = memoryGame.totalMoves;
        isNewBest = true;
    }
    
    // Tikrinti ar dabartinis laikas geresnis (mažiau laiko)
    if (memoryGame.seconds < currentBest.time) {
        memoryGame.bestScores[currentDifficulty].time = memoryGame.seconds;
        isNewBest = true;
    }
    
    if (isNewBest) {
        saveBestScores();
        updateBestScoresDisplay();
        showMessage(`🎉 Naujas geriausias rezultatas! Ėjimai: ${memoryGame.totalMoves}, Laikas: ${formatTime(memoryGame.seconds)}`, 'success');
    }
}

// Atnaujinti statistikos rodymą
function updateBestScoresDisplay() {
    // Sukurti arba atnaujinti statistikos rodiklį
    let statsContainer = document.querySelector('.stats-container');
    
    // Tikrinti ar jau yra geriausių rezultatų rodiklis
    let bestScoresItem = document.querySelector('.stat-item.best-scores');
    
    if (!bestScoresItem) {
        // Sukurti naują statistikos elementą
        bestScoresItem = document.createElement('div');
        bestScoresItem.className = 'stat-item best-scores';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.id = 'bestScores';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = 'Geriausi rezultatai';
        
        bestScoresItem.appendChild(statValue);
        bestScoresItem.appendChild(statLabel);
        
        // Įterpti į statistikos konteinerį
        statsContainer.appendChild(bestScoresItem);
    }
    
    // Atnaujinti turinį
    const currentDifficulty = memoryGame.difficulty;
    const bestEasy = memoryGame.bestScores.easy;
    const bestHard = memoryGame.bestScores.hard;
    
    let bestScoresHTML = `
        <div style="font-size: 0.8rem; line-height: 1.3;">
            <strong>${currentDifficulty === 'easy' ? '👑' : ''}Lengvas:</strong><br>
            ${bestEasy.moves === Infinity ? '-' : bestEasy.moves} ėj.<br>
            ${bestEasy.time === Infinity ? '-' : formatTime(bestEasy.time)}
        </div>
        <div style="font-size: 0.8rem; line-height: 1.3; margin-top: 5px;">
            <strong>${currentDifficulty === 'hard' ? '👑' : ''}Sunkus:</strong><br>
            ${bestHard.moves === Infinity ? '-' : bestHard.moves} ėj.<br>
            ${bestHard.time === Infinity ? '-' : formatTime(bestHard.time)}
        </div>
    `;
    
    document.getElementById('bestScores').innerHTML = bestScoresHTML;
}

// Formatas laikui
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Nustatyti sudėtingumo lygį
function setDifficulty(level) {
    if (memoryGame.gameStarted) {
        if (!confirm('Pakeitus sudėtingumo lygį, prarasite dabartinį žaidimo progresą. Ar norite tęsti?')) {
            return;
        }
        stopTimer();
        memoryGame.gameStarted = false;
        document.getElementById('startBtn').disabled = false;
    }
    
    memoryGame.difficulty = level;
    
    // Atnaujinti mygtukų būseną
    document.getElementById('easyBtn').classList.toggle('active', level === 'easy');
    document.getElementById('hardBtn').classList.toggle('active', level === 'hard');
    
    // Sugeneruoti naują žaidimo lentą
    generateGameBoard();
    
    // Atstatyti statistiką
    resetStats();
    
    // Atnaujinti geriausių rezultatų rodymą
    updateBestScoresDisplay();
}

// Sugeneruoti žaidimo lentą
function generateGameBoard() {
    // Išvalyti esamą lentą
    memoryGame.gameBoard.innerHTML = '';
    
    // Nustatyti tinklelio dydį pagal sudėtingumą
    let rows, cols, totalCards;
    
    if (memoryGame.difficulty === 'easy') {
        rows = 3;
        cols = 4;
        totalCards = 12;
        memoryGame.gameBoard.className = 'game-board easy';
    } else {
        rows = 4;
        cols = 6;
        totalCards = 24;
        memoryGame.gameBoard.className = 'game-board hard';
    }
    
    // Sukurti kortelių poras
    const pairsNeeded = totalCards / 2;
    let selectedCards = [];
    
    // Pasirinkti korteles iš duomenų rinkinio
    for (let i = 0; i < pairsNeeded; i++) {
        const cardIndex = i % memoryGame.cardData.length;
        selectedCards.push(memoryGame.cardData[cardIndex]);
        selectedCards.push({...memoryGame.cardData[cardIndex]}); // Duplikatas porai
    }
    
    // Sumaišyti korteles
    selectedCards = shuffleArray(selectedCards);
    
    // Sukurti kortelių elementus
    selectedCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-front">
                <div class="card-icon" style="color: ${card.color}">${card.icon}</div>
            </div>
            <div class="card-back"></div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(cardElement));
        memoryGame.gameBoard.appendChild(cardElement);
    });
    
    // Atnaujinti kortelių masyvą
    memoryGame.cards = Array.from(document.querySelectorAll('.memory-card'));
}

// Sumaišyti masyvą
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Pradėti žaidimą
function startGame() {
    if (memoryGame.gameStarted) return;
    
    memoryGame.gameStarted = true;
    memoryGame.flippedCards = [];
    memoryGame.matchedPairs = 0;
    memoryGame.totalMoves = 0;
    memoryGame.seconds = 0;
    
    // Pradėti laikmatį
    startTimer();
    
    // Atnaujinti statistiką
    updateStats();
    
    // Išjungti "Start" mygtuką
    document.getElementById('startBtn').disabled = true;
    
    // Atvaizduoti pranešimą
    showMessage('Žaidimas prasidėjo! Raskite visas sutampančias poras.', 'info');
}

// Atnaujinti žaidimą
function resetGame() {
    // Sustabdyti laikmatį
    stopTimer();
    
    // Iš naujo sumaišyti korteles
    generateGameBoard();
    
    // Atstatyti statistiką
    resetStats();
    
    // Įjungti "Start" mygtuką
    document.getElementById('startBtn').disabled = false;
    
    // Paslėpti laimėjimo pranešimą
    hideWinMessage();
    
    // Atvaizduoti pranešimą
    showMessage('Žaidimas atnaujintas. Pasirinkite sudėtingumo lygį ir spauskite "Pradėti žaidimą".', 'info');
}

// Atstatyti statistiką
function resetStats() {
    memoryGame.gameStarted = false;
    memoryGame.flippedCards = [];
    memoryGame.matchedPairs = 0;
    memoryGame.totalMoves = 0;
    memoryGame.seconds = 0;
    
    updateStats();
    document.getElementById('timer').textContent = '0:00';
    document.getElementById('startBtn').disabled = false;
}

// Apversti kortelę
function flipCard(card) {
    // Patikrinti ar žaidimas prasidėjęs
    if (!memoryGame.gameStarted) {
        showMessage('Pirmiausia spauskite "Pradėti žaidimą"!', 'warning');
        return;
    }
    
    // Patikrinti ar kortelė jau atversta arba sutampa
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Apriboti iki 2 kortelių vienu metu
    if (memoryGame.flippedCards.length >= 2) {
        return;
    }
    
    // Apversti kortelę
    card.classList.add('flipped');
    memoryGame.flippedCards.push(card);
    
    // Patikrinti porą
    if (memoryGame.flippedCards.length === 2) {
        memoryGame.totalMoves++;
        updateStats();
        
        const card1 = memoryGame.flippedCards[0];
        const card2 = memoryGame.flippedCards[1];
        
        if (card1.dataset.id === card2.dataset.id) {
            // Sutampa
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                memoryGame.flippedCards = [];
                memoryGame.matchedPairs++;
                updateStats();
                
                // Patikrinti ar žaidimas baigtas
                checkGameWin();
            }, 500);
        } else {
            // Nesutampa
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                memoryGame.flippedCards = [];
            }, 1000);
        }
    }
}

// Patikrinti ar žaidimas laimėtas
function checkGameWin() {
    const totalPairs = memoryGame.difficulty === 'easy' ? 6 : 12;
    
    if (memoryGame.matchedPairs === totalPairs) {
        // Laimėjimas!
        stopTimer();
        memoryGame.gameStarted = false;
        
        // Atnaujinti geriausius rezultatus
        updateBestScores();
        
        // Rodyti laimėjimo pranešimą
        showWinMessage();
        
        // Įjungti "Start" mygtuką iš naujo
        document.getElementById('startBtn').disabled = false;
        
        // Atvaizduoti pranešimą
        showMessage(`Sveikiname! Laimėjote žaidimą per ${memoryGame.totalMoves} ėjimus ir ${formatTime(memoryGame.seconds)}!`, 'success');
    }
}

// Atnaujinti statistiką
function updateStats() {
    document.getElementById('movesCount').textContent = memoryGame.totalMoves;
    document.getElementById('pairsCount').textContent = memoryGame.matchedPairs;
}

// Laikmatis
function startTimer() {
    stopTimer(); // Sustabdyti esamą laikmatį
    
    memoryGame.timer = setInterval(() => {
        memoryGame.seconds++;
        const minutes = Math.floor(memoryGame.seconds / 60);
        const seconds = memoryGame.seconds % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (memoryGame.timer) {
        clearInterval(memoryGame.timer);
        memoryGame.timer = null;
    }
}

// Rodyti laimėjimo pranešimą
function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    const currentDifficulty = memoryGame.difficulty;
    const bestScore = memoryGame.bestScores[currentDifficulty];
    
    // Patikrinti ar tai naujas geriausias rezultatas
    const isNewBestMoves = memoryGame.totalMoves <= bestScore.moves;
    const isNewBestTime = memoryGame.seconds <= bestScore.time;
    
    winMessage.innerHTML = `
        <h3>🎉 Sveikiname! 🎉</h3>
        <p>Jūs laimėjote žaidimą!</p>
        <p><strong>Rezultatai:</strong></p>
        <p>Ėjimų: ${memoryGame.totalMoves} ${isNewBestMoves ? '🏆' : ''}</p>
        <p>Laikas: ${formatTime(memoryGame.seconds)} ${isNewBestTime ? '⏱️' : ''}</p>
        <p>Sudėtingumas: ${currentDifficulty === 'easy' ? 'Lengvas' : 'Sunkus'}</p>
        <p style="margin-top: 15px;">
            <strong>Geriausi rezultatai:</strong><br>
            Ėjimų: ${bestScore.moves === Infinity ? 'Nėra' : bestScore.moves}<br>
            Laikas: ${bestScore.time === Infinity ? 'Nėra' : formatTime(bestScore.time)}
        </p>
    `;
    winMessage.classList.add('show');
}

// Paslėpti laimėjimo pranešimą
function hideWinMessage() {
    const winMessage = document.getElementById('winMessage');
    winMessage.classList.remove('show');
    winMessage.innerHTML = '';
}

// Rodyti pranešimą
function showMessage(text, type) {
    // Galite pridėti pranešimų rodymo logiką čia
    console.log(`${type.toUpperCase()}: ${text}`);
    
    // Paprastas pranešimo rodymas
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.innerHTML = `
        <i class="bi bi-${getIconForType(type)}"></i>
        ${text}
        <button type="button" class="close" onclick="this.parentElement.remove()">×</button>
    `;
    
    const gameContainer = document.querySelector('#memory-game .container');
    gameContainer.insertBefore(messageDiv, gameContainer.firstChild);
    
    // Automatiškai pašalinti po 5 sekundžių
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function getIconForType(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Pridėti CSS stilių geriausių rezultatų rodikliui
document.addEventListener('DOMContentLoaded', function() {
    const bestScoresStyle = document.createElement('style');
    bestScoresStyle.textContent = `
        .stat-item.best-scores .stat-value {
            font-size: 0.9rem !important;
            line-height: 1.4;
            color: #ffeb3b;
        }
        
        .stat-item.best-scores .stat-label {
            font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
            .stat-item.best-scores {
                min-width: 140px;
            }
        }
    `;
    document.head.appendChild(bestScoresStyle);
});