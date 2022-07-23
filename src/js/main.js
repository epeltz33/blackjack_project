// blackjack game global variables

let deck = [];
let money = 100;
let playerCards = [];
let splitCards = [];
let dealerCards = [];
let dealerCount = 0;
let playerCount = 0;
let splitCount = 0;
let playerBet = 0;
let splitBet = 0;
let currentCards = "";

moneyELement();
// element references for displaying bet amount and cash amount and split bet amount

function moneyELement () {
	document.getElementById( "chips-left" ).innerText = `Chips: ${ money}`;
}
function betElement () {
	document.getElementById( "submittedBet" ).innerText = `Bet amount: ${ playerBet }`;
}
function splitBetElement () {
	document.getElementById( "splitBet" ).innerText = `Bet amount: ${ splitBet }`;
}


// event listeners for buttons 
document.querySelector("#dealButton").addEventListener("click", dealHand);
document.querySelector("#betButton").addEventListener("click", makeBet);
document.querySelector("#clearButton").addEventListener("click", clearBet);
//document.querySelector("#doubleButton").addEventListener("click", doubleBet);
document.querySelector("#hitButton").addEventListener("click", takeCard);
document.querySelector("#playAgain").addEventListener("click", playAgain);
document.querySelector("#standButton").addEventListener("click", stand);
document.querySelector("#splitButton").addEventListener("click", split);
document.querySelector("#resetButton").addEventListener("click", resetGame);


// functions 

function init() {
  deck = [];
  playerCards = [];
  splitCards = [];
  dealerCards = [];
  dealerCount = 0;
  playerCount = 0;
  splitCount = 0;
  playerBet = 0;
  splitBet = 0;
  currentCards = "playerHand";
    document.getElementById("splitBet").innerHTML = ""; // clear the split bet amount
  moneyELement(); 
  betElement();
  $(".playingCards, .message").hide();
  resetDeck();
}

// fill in the deck with cards
function resetDeck() {
  deck = [];
  let cardSuits = ["h", "d", "s", "c"];
  for (let i = 0; i < cardSuits.length; i++) {
    let cardValues = [
      "A",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "J",
      "Q",
      "K",
    ];
    for (let j = 1; j < cardValues.length; j++) {
      deck.push(cardValues[j] + cardSuits[i]);
    }
  }
}
// shuffle the deck function
function shuffleDeck() {
let count = deck.length;
   while (count) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1) [0]);// shuffle the deck function in deck array and push it to the end of the array
     count -= 1; // remove the last element from the deck array
   }
}

// make a bet function
function makeBet() {
  playerBet = document.getElementById("betInput").value;
  if (playerBet <= cash && playerBet > 0) {
    betElement();
    $("#dealButton, #clearButton, .form-inline").toggle();
  } else {
    alert("Please enter a valid bet amount");
  }
}

// clear the bet function
function makeBet() {
  playerBet = document.querySelector("#betAmount").value;
  if (playerBet <= money && playerBet > 0) {
    betElement();
    $("#clearButton, #dealButton, .form-inline").toggle();
  } else {
    console.log("error");
  }
}

function clearBet() {
  playerBet = 0;
  betElement();
  document.querySelector("#betAmount").value = "Enter Bet Amount";
  document.getElementById("submittedBet").innerHTML = "";
  moneyELement();
  $("#clearButton, #dealButton, .form-inline").toggle();
}

function dealHand() {
  shuffleDeck();

  let nextCard = [];
  for (i = 0; i < 2; i++) {
    nextCard = deck.pop();
    playerCards.push(nextCard);
  }

  for (i = 0; i < 2; i++) {
    nextCard = deck.pop();
    dealerCards.push(nextCard);
  }

  $(".playerCards").append(
    `<div class="playing-card ${playerCards[0]}"></div>`
  );
  $(".playerCards").append(
    `<div class="playing-card ${playerCards[1]}"></div>`
  );

  $(".dealerCards").append(
    `<div class="playing-card ${dealerCards[0]}"></div>`
  );
  $(".dealerCards").append(
    `<div class="playing-card back-blue" id="face-down-card"></div>`
  );

  $("#clearButton, #dealButton, .game-button, #doubleButton").toggle();
  updateCounts();

  if (playerCount === 21 && dealerCount < 21) {
    blackjack();
  }
  toggleSplit();
}

function doubleBet() {
  var bet = currentCards === "splitHand" ? splitBet : playerBet;
  if (bet * 2 <= money) {
    if (currentCards === "playerHand") {
      playerBet *= 2;
      betElement();
      takeCard();
      if (splitCards.length > 1) {
        currentCards = "splitHand";
        if (playerCount < 21) {
          dealerHand();
          scoreGame();
        }
      } else if (playerCount <= 21) {
        dealerHand();
        scoreGame();
      } else {
        return;
      }
    } else {
      splitBet *= 2;
      splitBetElement();
      takeCard();
      $("#doubleButton").show();
      currentCards = "playerHand";
    }
  } else {
    console.log("You do not have enough money to double down!");
  }
}

function toggleSplit() {
  const secondCard = playerCards[1];
  const firstCard = playerCards[0];
  if (firstCard[firstCard.length - 1] === secondCard[secondCard.length - 1]) {
    $("#splitButton").toggle();
  }
}

function split() {
  const secondCard = playerCards[1];
  $(`.playing-card.${playerCards[1]}`).remove();
  splitCards = [secondCard];
  playersCards = playerCards.splice(0, 1);
  $(".splitCards").append(`<div class="playing-card ${secondCard}"></div>`);
  $("#splitButton").toggle();
  splitBet = playerBet;
  splitBetElement();
  playerTakeCard();
  if (playerCount === 21 && dealerCount < 21) {
    blackjack();
  }
  console.log(playerCount);
  splitTakeCard();
  if (splitCount === 21 && dealerCount < 21) {
    blackjack();
  }
  updateCounts();
  currentCards = "splitHand";
}

function updateCounts() {
  playerCount = getHandValue("player");
  dealerCount = getHandValue("dealer");
  splitCount = getHandValue("split");

  console.log(`player count ${playerCount}`);
  console.log(`dealer count ${dealerCount}`);
  console.log(`split count ${splitCount}`);

  playerBust();
}

function getHandValue(playerType) {
  let hand = handOf(playerType);
  let count = 0;
  if (hand.length > 2) {
    sortAces(hand);
  }

  hand.forEach(function (card) {
    if (card.split("").includes("A") && count < 11) {
      count += 11;
    } else if (card.split("").includes("A") && count > 11) {
      count += 1;
    } else if (card.split("").includes("2")) {
      count += 2;
    } else if (card.split("").includes("3")) {
      count += 3;
    } else if (card.split("").includes("4")) {
      count += 4;
    } else if (card.split("").includes("5")) {
      count += 5;
    } else if (card.split("").includes("6")) {
      count += 6;
    } else if (card.split("").includes("7")) {
      count += 7;
    } else if (card.split("").includes("8")) {
      count += 8;
    } else if (card.split("").includes("9")) {
      count += 9;
    } else if (card.split("").includes("1")) {
      count += 10;
    } else if (card.split("").includes("J")) {
      count += 10;
    } else if (card.split("").includes("Q")) {
      count += 10;
    } else if (card.split("").includes("K")) {
      count += 10;
    }
  });
  return count;
}

function handOf(playerType) {
  if (playerType === "dealer") {
    return dealerCards;
  } else if (playerType === "player") {
    return playerCards;
  } else if (playerType === "split") {
    return splitCards;
  }
}

function sortAces(hand) {
  for (i = 0; i < hand.length; i++) {
    if (hand[i].charAt(hand[i].length - 1) === "A") {
      hand.push(hand.splice(i, 1)[0]);
    }
  }
}

function takeCard() {
  var cards = currentCards === "splitHand" ? splitTakeCard() : playerTakeCard();
}

function playerTakeCard() {
  nextCard = deck.pop();
  playerCards.push(nextCard);
  $(".playerCards").append(
    `<div class="playing-card ${playerCards[playerCards.length - 1]}"></div>`
  );
  if (playerCards.length > 2) {
    $("#doubleButton, #splitButton").hide();
  }
  updateCounts();
}

function splitTakeCard() {
  nextCard = deck.pop();
  splitCards.push(nextCard);
  $(".splitCards").append(
    `<div class="playing-card ${splitCards[splitCards.length - 1]}"></div>`
  );
  if (splitCards.length > 2) {
    $("#doubleButton, #splitButton").hide();
  }
  updateCounts();
}

function stand() {
  if (splitCards.length < 1) {
    dealerHand();
    scoreGame();
    $("#doubleButton, #splitButton").hide();
  } else if (currentCards === "splitHand") {
    currentCards = "playerHand";
    $("#doubleButton").show();
    toggleSplit();
  } else {
    currentCards = "splitHand";
    dealerHand();
    scoreGame();
    $("#doubleButton, #splitButton").hide();
  }
}

function dealerHand() {
  // reveals face down card
  document.getElementById(
    "face-down-card"
  ).className = `playing-card ${dealerCards[1]}`;
  // dealer takes card if count lower than 17
  if (dealerCount < 17) {
    dealerTakeCard();
  }
}

function dealerTakeCard() {
  nextCard = deck.pop();
  dealerCards.push(nextCard);
  $(".dealerCards").append(
    `<div class="playing-card ${dealerCards[dealerCards.length - 1]}"></div>`
  );
  dealerCount = getHandValue("dealer");
  console.log(`dealer count ${dealerCount}`);
  if (dealerCount < 17) {
    dealerTakeCard();
  }
}

function scoreGame() {
  var count = currentCards === "splitHand" ? splitCount : playerCount;

  if (dealerCount > 21 && count < 22) {
    $("blockquote").append(
      `<p class="mb-0 message">Dealer Busts! You win $${playerBet}.</p>`
    );
    winBet();
  } else if (dealerCount > 16 && count < 22 && dealerCount < count) {
    if (currentCards === "splitHand") {
      $("blockquote").append(
        `<p class="mb-0 message">Your split hand beat the dealer! You win $${playerBet}.</p>`
      );
    } else {
      $("blockquote").append(
        `<p class="mb-0 message">You beat the dealer! You win $${playerBet}.</p>`
      );
    }
    winBet();
  } else if (dealerCount > 16 && count < 22 && dealerCount > count) {
    if (currentCards === "splitHand") {
      $("blockquote").append(
        `<p class="mb-0 message">Your split hand lost to the dealer! You lose $${playerBet}.</p>`
      );
    } else {
      $("blockquote").append(
        `<p class="mb-0 message">You lost to the dealer! You lose $${playerBet}.</p>`
      );
    }
    loseBet();
  } else if (dealerCount === count) {
    if (currentCards === "splitHand") {
      $("blockquote").append(
        `<p class="mb-0 message">It's a draw on your split hand. Take your money back.</p>`
      );
    } else {
      $("blockquote").append(
        `<p class="mb-0 message">It's a draw on your hand. Take your money back.</p>`
      );
    }
    draw();
  } else if (count > 21) {
    loseBet();
  } else {
    $(".game-button").toggle();
  }
}

function playerBust() {
  var count = currentCards=== "splitHand" ? splitCount : playerCount;
  if (count > 21) {
    if (currentCards=== "splitHand") {
      $("blockquote").append(
        `<p class="mb-0 message">Your Split Hand Busted! You lose $${playerBet}.</p>`
      );
      currentCards = "playerHand";
      updateCounts();
      $("#doubleButton").show();
    } else if (splitCards.length < 1) {
      $("blockquote").append(
        `<p class="mb-0 message">You Busted! You lose $${playerBet}.</p>`
      );
      loseBet();
      dealerHand();
    } else {
      $("blockquote").append(
        `<p class="mb-0 message">You Busted! You lose $${playerBet}.</p>`
      );
      currentCards = "splitHand";
      dealerHand();
      scoreGame();
    }
  } else {
    return;
  }
}

function loseBet() {
  var bet = currentCards === "splitHand" ? splitBet : playerBet;
  money -= bet;
  moneyELement();

  if (currentCards === "splitHand") {
    currentCards = "playerHand";
    scoreGame();
  } else if (money === 0) {
    $("blockquote").append(
      `<p class="mb-0 message">You're out of money! Click Reset Game to play again!</p>`
    );
    $(".game-button, #resetButton").toggle();
  } else {
    $(".game-button, #playAgain").toggle();
  }
}

function winBet() {
  var bet = currentCards === "splitHand" ? splitBet : playerBet;
  money += parseInt(bet);
  moneyELement();
  if (currentCards=== "splitHand") {
    currentCards = "playerHand";
    scoreGame();
  } else {
    $(".game-button, #playAgain").toggle();
  }
}

function draw() {
  if (currentCards === "splitHand") {
    currentCards = "playerHand";
    scoreGame();
  } else {
    $(".game-button, #playAgain").toggle();
  }
}

function blackjack() {
  let bet = currentCards === "splitHand" ? splitBet : playerBet;
  money += parseInt(bet) * 1.5;
  moneyElement();
  if (currentCards === "splitHand") {
    $("blockquote").append(
      `<p class="mb-0 message">Your Split Hand Got Blackjack!! You win $${
        playerBet * 3
      }.</p>`
    );
    currentCards = "playerHand";
  } else {
    $("blockquote").append(
      `<p class="mb-0 message">Blackjack!! You win $${playerBet * 1.5}.</p>`
    );
  }
  $(".game-button, #doubleButton, #playAgain").toggle();
}

function playAgain() {
  $(".form-inline, #playAgain").toggle();
  init();
}

function resetGame() {
  $(".form-inline, #resetButton").toggle();
  $(".game-button, #playAgain").hide();
  money = 100;
  init();
}

init();
