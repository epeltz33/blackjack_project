   
  let firstCard = 12;

  let secondCard = 11;

  let sum = secondCard + firstCard;

  let haveBlackJack = false;

  let message = "";

  let messageEl = document.getElementById("message-el");

  let totalEl = document.querySelector("#total-el");

  let cardsEl = document.querySelector("#cards-el");

  let isAlive = true;

  const startGame = () => {
    cardsEl.textContent = `Cards: ${firstCard}  ${secondCard} `;
    totalEl.textContent = `Total: ${sum} `;
    if (sum <= 20) {
      message = "Do you want to hit?";
    } else if (sum === 21) {
      message = "You got Blackjack!";
      haveBlackJack = true;
    } else {
      message = "You busted!";
      isAlive = false;
    }
    messageEl.textContent = message;
  };

const newCard = () => {
  console.log(`Drawing a new card from the deck`);
};
