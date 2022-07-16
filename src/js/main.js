// making a blackjack game with javascript, html, and css


let playerBank = 0; // player's bank amount
let playerBet = 50; // player's bet amount (default is 50) 
let coveredCard; // card that is covered by the dealer


// player model with properties and methods for player object
class Player {
  // constructor function for player object
  constructor() {
    this.coveredCard = [];
    this.hand = []; // player's hand
    this.active = true; // player's active status
  }
   // get and set properties for player object   
  get coveredCard() {
	return this.coveredCard;
  }
  set coveredCard(card) { // set player's covered card to card passed in as argument
	this.coveredCard = card;
  } 
  get hand() {
   	return this.hand;
  }
  set hand(card) { // set player's hand to card passed in as argument 
	this.hand = card;
  }
  get active() { // get player's active value
	return this.active;
  }
  set active (value) { // set player's active value to value passed in as argument
    this.active = value;
		}
   
     }
	 
	  
	 
		  
		  
	    
	    
	   
	   
  
  
  
  
  
  
  
  
  
  



