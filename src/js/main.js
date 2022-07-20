let haveBlackJack = false;

let sum = 0;

let message = "";

let messageEl = document.getElementById("message-el");

let totalEl = document.querySelector("#total-el");

let cardsEl = document.querySelector("#cards-el");

let cards = [];

let player = {
  playerName: "Per",
  playerChips: 145,
};

let playerEl = document.getElementById("player-el");
playerEl.textContent = `Player: ${player.playerName} Chips: ${player.playerChips}`;
console.log(playerEl);

let isAlive = false;
console.log(cards);
function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1; // random number between 1 and 13 (made a mistake here)

  return randomNumber > 10 ? 10 : randomNumber === 1 ? 11 : randomNumber;
}

let startGame = () => {
  isAlive = true;
  let firstCard = getRandomCard();

  let secondCard = getRandomCard();

  cards = [firstCard, secondCard];

  sum = secondCard + firstCard;

  renderGame();
};

let renderGame = () => {
  cardsEl.textContent = "Cards:  ";

  for (let i = 0; i < cards.length; i++) {
    cardsEl.textContent += cards[i] + " ";
  }
  totalEl.textContent = `Total: ${sum} `;

  if (sum <= 20) {
    message = "Do you want to hit?";
  } else if (sum === 21) {
    message = "You got Blackjack!";

    haveBlackJack = true;
  } else {
    message = "Your out of the game! You busted!";

    isAlive = false;
  }
  messageEl.textContent = message;
};

function newCard() {
  if (isAlive === true && haveBlackJack === false) {
    let card = getRandomCard();

    sum += card;
    // Push the card to the cards array
    cards.push(card);

    console.log(cards);

    renderGame();
  }
}
       