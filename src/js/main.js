   
  let firstCard = 7;

  let secondCard = 8;

  let sum = secondCard + firstCard;

  let haveBlackJack = false;

  let message = "";

  let messageEl = document.getElementById("message-el");

  let totalEl = document.querySelector("#total-el");

  let cardsEl = document.querySelector("#cards-el");

  let cards = [firstCard, secondCard];

  let isAlive = true;
  const startGame = () => {
    renderGame(); // calls startGame
  };

  const renderGame = () => {
    cardsEl.textContent = `Cards: ${cards[0]}  ${cards[1]} `;
    // render out All the cards we have
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
    let card = 6;
    sum += card;
    // Push the card to the cards array
    cards.push(card);
    console.log(cards);
    renderGame();
  };
