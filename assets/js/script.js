const mainElement = document.getElementById("gameCards");
const modalElement = document.querySelector('.modal');
const gamesScore = document.querySelector('.games-score');
const attemptsScore = document.querySelector('.attempts-score');
const accuracyScore = document.querySelector('.accuracy-score');
const shuffleButton = document.querySelector('.shuffle-button');
const closeButton = document.querySelector('.close');
const matchesScore = document.querySelector('.matches-score');
const bodyElement = document.querySelector('body');
const bgMusic = document.getElementById("bgmusic");

let firstCardClicked, secondCardClicked, firstCardClasses, secondCardClasses;
let maxMatches = 9;
let matches = 0;
let gamesPlayed = 0;
let attempts = 0;
let accuracy = 0;

const cardDeck = [
  'buster', 'nk', 'desmond', 'fahren',
  'buster__two', 'desmond__two', 'nk__two', 'fahren__two',
  'portada',
  'buster', 'nk', 'desmond', 'fahren',
  'buster__two', 'desmond__two', 'nk__two', 'fahren__two',
  'portada'
];

// Evento de inicio del juego
mainElement.addEventListener('click', handleClick);
shuffleButton.addEventListener('click', shuffleCards);
closeButton.addEventListener('click', dismissModal);

// Inicia la música con el primer clic en cualquier parte del documento
document.addEventListener('click', () => {
  bgMusic.play().catch(err => {
    console.warn('No se pudo reproducir el audio automáticamente:', err);
  });
}, { once: true });

function handleClick(event) {
  const clickedTarget = event.target;

  if (!clickedTarget.classList.contains("card-back")) return;

  clickedTarget.classList.add("hidden");

  if (!firstCardClicked) {
    firstCardClicked = clickedTarget;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else {
    secondCardClicked = clickedTarget;
    secondCardClasses = secondCardClicked.previousElementSibling.className;

    mainElement.removeEventListener('click', handleClick);

    if (firstCardClasses === secondCardClasses) {
      attempts++;
      matches++;
      updateScores();

      firstCardClicked = null;
      secondCardClicked = null;
      mainElement.addEventListener('click', handleClick);

      if (matches === maxMatches) {
        gamesPlayed++;
        gamesScore.textContent = gamesPlayed;
        modalElement.classList.remove("hidden");
      }
    } else {
      attempts++;
      updateScores();

      setTimeout(() => {
        firstCardClicked.classList.remove("hidden");
        secondCardClicked.classList.remove("hidden");
        firstCardClicked = null;
        secondCardClicked = null;
        mainElement.addEventListener('click', handleClick);
      }, 1500);
    }
  }
}

function updateScores() {
  attemptsScore.textContent = attempts;
  matchesScore.textContent = matches;
  accuracy = ((matches / attempts) * 100).toFixed(2);
  accuracyScore.textContent = `${accuracy}%`;
}

function dismissModal() {
  modalElement.classList.add("hidden");
  matches = 0;
  attempts = 0;
  accuracy = 0;
  matchesScore.textContent = 0;
  attemptsScore.textContent = 0;
  accuracyScore.textContent = '0.00%';
  resetCards();
}

function resetCards() {
  mainElement.innerHTML = '';
  const shuffledDeck = cardDeck.sort(() => 0.5 - Math.random());

  for (let i = 0; i < shuffledDeck.length; i++) {
    const cardItem = document.createElement('div');
    cardItem.classList.add("card-item", "col-2");

    const cardFront = document.createElement('div');
    cardFront.className = `card-front ${shuffledDeck[i]}`;

    const cardBack = document.createElement('div');
    cardBack.classList.add("card-back");

    cardItem.append(cardFront, cardBack);
    mainElement.appendChild(cardItem);
  }
}

function shuffleCards() {
  matches = 0;
  attempts = 0;
  accuracy = 0;

  matchesScore.textContent = 0;
  attemptsScore.textContent = 0;
  accuracyScore.textContent = '0.00%';

  const hiddenCards = document.querySelectorAll('.hidden');
  hiddenCards.forEach(card => card.classList.remove('hidden'));

  modalElement.classList.add("hidden");
  resetCards();
}
