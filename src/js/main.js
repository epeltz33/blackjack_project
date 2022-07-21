// blackjack game global variables

let deck = [];
let cash = 100;
let playerCards = [];
let splitCards = [];
let dealerCards = [];
let dealerCount = 0;
let playerCount = 0;
let splitCount = 0;
let playerBet = 0;
let splitBet = 0;
let currentCards = "";

cashELement();

// event listeners for buttons

documentqueryselector("#hit-button").addeventlistener("click", cardTake);
documentqueryselector("#stand-button").addeventlistener("click", dealerPlay);
documentqueryselector("#double-button").addeventlistener("click", doubleDown);
documentqueryselector("#play-again-button").addeventlistener("click",playAgain);
documentqueryselector("#split-button").addeventlistener("click", split);
documentqueryselector("#bet-button").addeventlistener("click", bet);
documentqueryselector("#reset-button").addeventlistener("click", reset);
documentqueryselector("#clear-button").addeventlistener("click", clear);
documentqueryselector("#deal-button").addeventlistener("click", deal);
