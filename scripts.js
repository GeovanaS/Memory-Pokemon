// Variáveis globais
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let startTime;
let timerInterval;
let currentTime = 0;

// Seleciona todas as cartas
const cards = document.querySelectorAll('.memory-card');

// Função para virar a carta
function flipCard() {
    if (lockBoard) return; // Impede ações durante o bloqueio do tabuleiro
    if (this === firstCard) return; // Impede que a mesma carta seja clicada duas vezes

    this.classList.add('flip'); // Adiciona a classe 'flip' para virar a carta

    if (!hasFlippedCard) {
        // Primeira carta virada
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // Segunda carta virada
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch(); // Verifica se as cartas são iguais
    }
}

// Função para verificar se as cartas são iguais
function checkForMatch() {
    if (firstCard.dataset.pokemon === secondCard.dataset.pokemon) {
        // Cartas iguais
        disableCards(); // Desabilita as cartas
        matchedPairs++;
        if (matchedPairs === cards.length / 2) {
            // Todas as cartas foram combinadas
            finishGame();
        }
    } else {
        // Cartas diferentes
        unflipCards(); // Desvira as cartas após um breve intervalo
    }
}

// Função para desabilitar cartas combinadas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard(); // Reseta o tabuleiro para o próximo par
}

// Função para desvirar cartas diferentes
function unflipCards() {
    lockBoard = true; // Bloqueia o tabuleiro durante a animação

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard(); // Reseta o tabuleiro após a animação
    }, 1000);
}

// Função para resetar o tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Função para embaralhar as cartas
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

// Função para iniciar o jogo
function startGame() {
    // Reseta variáveis
    matchedPairs = 0;
    currentTime = 0;
    document.getElementById('time').textContent = '0';
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });

    shuffleCards(); // Embaralha as cartas
    startTimer(); // Inicia o contador de tempo
}

// Função para iniciar o contador de tempo
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTime, 1000);
}

// Função para atualizar o tempo na tela
function updateTime() {
    currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('time').textContent = currentTime;
}

// Função para finalizar o jogo
function finishGame() {
    clearInterval(timerInterval); // Para o contador de tempo
    checkBestScore(currentTime); // Verifica e atualiza o "best score"
    alert(`Parabéns! Você completou o jogo em ${currentTime} segundos.`);
}

// Função para verificar e atualizar o "best score"
function checkBestScore(score) {
    let bestScore = localStorage.getItem('bestScore');

    if (!bestScore || score < bestScore) {
        localStorage.setItem('bestScore', score);
        document.getElementById('best-score').textContent = score;
    }
}

function resetBestScore() {
    localStorage.removeItem('bestScore');
    document.getElementById('best-score').textContent = 'Nenhum';
}

// Carrega o "best score" ao iniciar a página
window.onload = function () {
    let bestScore = localStorage.getItem('bestScore') || 'Nenhum';
    document.getElementById('best-score').textContent = bestScore;

    // Adiciona evento de clique a todas as cartas
    cards.forEach(card => card.addEventListener('click', flipCard));
};