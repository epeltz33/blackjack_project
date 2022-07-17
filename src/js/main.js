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
  set coveredCard(card) {
    // set player's covered card to card passed in as argument

    this.coveredCard = card;
  }
  get hand() {
    return this.hand;
  }
  set hand(card) {
    // set player's hand to card passed in as argument
    this.hand = card;
  }
  get active() {
    // get player's active value
    return this.active;
  }
  set active(value) {
    // set player's active value to value passed in as argument

    this.active = value;
  }

  // if player's hand value is greater than 21, and there are aces in the hand, reduce the value of the aces to 1
  get countHandAce() {
    let handValue = 0; //  initialize hand value to 0

    let aceCount = []; // array to count number of aces in player's hand
    for (let i = 0; i < this.hand.length; i++) {
      // loop through player's hand

      handValue += this.hand[i].value; // add value of each card to handValue

      if (this.hand[i].value === 11) {
        // if card is an ace, add 1 to aceCount

        aceCount.push(true);
      }
    }
    if (handValue > 21 && aceCount.length > 0) {
      // if handValue is greater than 21 and there are aces in the hand, reduce the value of the aces to 1

      for (let i = 0; i < aceCount.length; i++) {
        // loop through aceCount

        handValue -= 10;
      }

      if (handValue > 21 && aceCount.length > 1) {
        // if handValue is greater than 21 and there are 2 aces in the hand, reduce the value of the aces to 1

        for (let i = 0; i < aceCount.length; i++) {
          // loop through aceCount

          handValue -= 20; // reduce handValue by 20 for each ace
        }
      }
    }
    return handValue;
  }
}
