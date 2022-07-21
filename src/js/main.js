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

// element references for displaying bet amount and cash amount and split bet amount

function cashELement () {
	document.getElementById( "chips-left" ).innerText = `Chips: ${ cash }`;
}
function betElement () {
	document.getElementById( "enteredBet" ).innerText = `Bet amount: ${ playerBet }`;
}
function splitBetElement () {
	document.getElementById( "split-bet" ).innerText = `Bet amount: ${ split-bet }`;
}

// functions 

function initial() {
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
	cashELement();
	betElement();
	document.getElementById("split-bet").innerHTML = "";
	$(".playing-cards, .message").hide();
	resetDeck()
}

// fill in the deck with cards
function resetDeck () {
	deck = [];
	let cardSuits = ["h", "d", "s", "c"];
	for ( let i = 0; i < cardSuits.length; i++ ) {
		let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
		for ( let j = 1; j < cardValues.length; j++ ) {
			deck.push( cardValues[j] + cardSuits[i] );
		}
	}
}
 // shuffle the deck function
  function shuffleDeck () {
    	for ( let i = 0; i < deck.length; i++ ) {
		let randomIndex = Math.floor( Math.random() * deck.length );
		let temp = deck[i];
		deck[i] = deck[randomIndex];
		deck[randomIndex] = temp;
	}
}

// make a bet function 
function makeBet () {
	playerBet = document.getElementById( "bet-amount" ).value;
	if ( playerBet <= cash && playerBet > 0 ) {
		betElement();
		$( "#deal-button, #clear-button, .form-inline" ).toggle();
	} else {
		alert( "Please enter a valid bet amount" );
	}
}

// clear the bet function
function clearBet () {
	betElement();
	playerBet = 0;
	document.getElementById( "bet-amount" ).value = "Enter bet amount: ";
	document.getElementById( "submittedBet" ).innerHTML = "";
	cashELement();
	$( "#deal-button, #clear-button, .form-inline" ).toggle();
}

