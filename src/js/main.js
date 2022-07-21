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

// deal the cards function

 function dealTheHand() {
 shuffleDeck();
	 let hitCard = [];
	 for (i = 0; i < 2; i++) {
		hitCard = deck.pop();
		playerCards.push(hitCard);
	}
	
	for (i = 0; i < 2; i++) {
		hitCard = deck.pop();
		dealerCards.push(hitCard);
	}
	// display the cards for the player
	$(".playerCards").append(`<div class="playing-card ${playerCards[0]}"></div>`); // player's first card  playerCards[0]
	$(".playerCards").append(`<div class="playing-card ${playerCards[1]}"></div>`); // player's second card  playerCards[1]
	// display the cards for the dealer
	$(".dealerCards").append(`<div class="playing-card ${dealerCards[0]}"></div>`); // dealer's first card  dealerCards[0]
	$(".dealerCards").append(`<div class="playing-card back-blue" id="face-down-card"></div>`); // dealer's second card 
	
	$("#clear-button, #deal-button, .game-button, #double-button").toggle();
	updateCount();
	
	if (playerCount === 21 && dealerCount < 21) {
		playerBlackjack();
	}
	toggleSplit();
 }  // end of dealTheHand function
 
 // toggle the split button function
 function toggleSplit() {
  const firstCard = playerCards[0];
  const secondCard = playerCards[1];
  if (firstCard[firstCard.length - 1] === secondCard[secondCard.length - 1]) {
	$("#split-button").toggle();
  }
 }
 
 // split the cards function
function splitTheHand () {
	const secondCard = playerCards[1]; // second card of the player playerCards[1] 
	$( `.playing-card.${ playerCards[1] }` ).remove(); // remove the second card of the player
	splitCards = [secondCard]; // add the second card to the splitCards array
	playersCards = playersCards.slice( 0, 1 ); // remove the second card from the playersCards array
	$( ".splitCards" ).append( `<div class="playing-card ${ secondCard }"></div>` ); // display the second card of the player
	$( "#split-button" ).toggle(); // toggle the split button
	splitBet = playerBet; // set the splitBet to the playerBet
	splitBetElement(); // display the splitBetElement
	playerCardTake(); // take the player's cards
	if ( playerCount === 21 && dealerCount < 21 ) {
		playerBlackjack();
	}
	console.log( playerCount );
	splitTakeCard();
	if ( splitCount === 21 && dealerCount < 21 ) {
		blackjack();
		 
	}
	updateCount();
	currentCards = "splitHand";
}
// double the bet function
 function doubleTheBet () {
	playerBet = playerBet * 2;
	betElement();
	cashELement();
	$( "#deal-button, #clear-button, .form-inline" ).toggle();
	dealTheHand();
 }
 
 // get the value of the hand function
  function getHandValue (playerType) {
   let hand = handOf(playerType); // get the hand of the player 
   let count = 0; // set the count to 0
   if (hand.length > 2) { // if the hand is greater than 2
	   for (let i = 0; i < hand.length; i++) {
           // for each card in the hand
           let card = hand[i]; // set the card to the current card
           let cardValue = card[0]; // set the cardValue to the first character of the card
           count = cardValue === "A" && count < 11 ? 11 : cardValue === "A" && count > 11 ? 1 : cardValue === "J" || cardValue === "Q" || cardValue === "K" ? 10 : parseInt(cardValue);
       }
		   
   }
   return count; // return the count
  }
  function handOf(playerType) {
   if (playerType === "player") {
	 return playerCards;
   } else if (playerType === "dealer") {
	 return dealerCards;
   } else if (playerType === "splitHand") {
	 return splitCards;
   }
}

// function to sort Aces 
 function sortAces(hand) {
	let aces = [];
	let nonAces = [];
	for (let i = 0; i < hand.length; i++) {
		if (hand[i][0] === "A") {
			aces.push(hand[i]);
		} else {
			nonAces.push(hand[i]);
		}
	}
	return aces.concat(nonAces);
}

function playerCardTake () {
	let cards = ( currentCards === "splitHand" ) ? splitTakeCard() : playerTakeCard();
}
  
  // player take card function
   function playerTakeCard() {
	   let hitCard = deck.pop();
	   playerCards.push(hitCard);
	   $(".playerCards").append(`<div class="playing-card ${playersCards[playerCards.length - 1]}"></div>`);

	   if ( playerCards.length > 2 ) {
		   $( "#double-button, #split-button" ).hide();
	   }
	   	   updateCount();
   }
   // split take card function
   function splitTakeCard() {
	   let hitCard = deck.pop();
	   splitCards.push(hitCard);
	   $(".splitCards").append(`<div class="playing-card ${splitCards[splitCards.length - 1]}"></div>`);
	   if ( splitCards.length > 2 ) {
		   $( "#double-button, #split-button" ).hide();
	   }
	   updateCount();
   }
   
   // stand function
   function stand() {
	   if ( splitCards.length < 1 ) {
		   dealTheHand();
		   scoreGame();
		   $( "#double-button, #split-button" ).hide();
	   } else if ( currentCards === "splitHand" ) {
		   currentCards = "playerHand";
		   $( "#double-button").show();
		   toggleSplit();
	   } else {
		   currentCards = "splitHand";
		   dealTheHand();
		   scoreGame();
		   $( "#double-button, #split-button" ).hide();
	    }
	    
	  }function dealerHand() {
	  // shows the face down card and the face up card of the dealer
	   document.getElementById("face-down-card").className = `playing-card ${dealerCards[1]}`;
	   // dealer takes cards until the dealer count is greater than 17
	    if (dealerCount < 17) {
			dealerTakeCard();
			dealerHand();
		}
	  }
	  
	  // function to take a card for the dealer
	  
	   function dealerTakeCard() {
	       hitCard = deck.pop(); // get the hitCard from the deck
		   dealerCards.push(hitCard); // add the hitCard to the dealerCards array
		   $(".dealerCards").append(`<div class="playing-card ${dealerCards[dealerCards.length - 1]}"></div>`); // display the hitCard
		   dealerCount = getHandValue("dealer"); // get the value of the dealer's hand
		   console.log(`Dealer count: ${dealerCount}`); // display the dealerCount
		   if ( dealerCount < 17 ) { // if the dealer count is less than 17
			   dealerTakeCard(); // take a card
		   }
	   }
	   
	   // function to score the game
	    function Score() { 
	     let count = ( currentCards === "splitHand" ) ? splitCount : playerCount;
	     
	     //if 
	    if ( count > 21) {
	     			return "Bust";
		} if ( currentCards === "splitHand") {
			$( "blockqoute" ).append( `<p class"mb-0 message">Your Split Hand Busted!! You lose $${ playerBet }.</p>` );
			currentCards = "playerHand"; // set the currentCards to playerHand
			 updateCount(); // update the count
			  $( "#double-button" ).show(); // show the double button
			  
		} else if (splitCards.length < 1) {
		 	$("blockqoute").append(`<p class"mb-0 message">You Busted!! You lose $${playerBet}.</p>`);
		 	loseBet(); // lose the bet
			dealTheHand();
		} else {
		  $("blockqoute").append(`<p class"mb-0 message">You Busted!! You lose $${playerBet}.</p>`);
		  currentCards = "splitHand"; 
		  dealTheHand();
		  scoreGame();
		 }	
		return;
		} 
	
		
	   // lose the bet function
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   // function to win the bet
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   // function that shows a draw
	   
	   
	   
	   
	   
	   
	   
	   // function that shows blackjack!
	   
	   
	   
	   
	   
	   // function that allows the player to play again
	   
	   
	   
	   
	   // reset the game function
	   
	   
	   