   
  let firstCard = 10 
  
   let secondCard = 11
   
   let sum = secondCard + firstCard; 
   
   let haveBlackJack = false
   
   let message = ''
//  make a variable called isAlive and assign it to true 
   let isAlive = true
// flip its value to false in the appropriate code block 
const startGame = () => {
  if (sum <= 20) {
    message = "Do you want to hit?";
  } else if (sum === 21) {
    message = "You got Blackjack!";
    haveBlackJack = true;
  } else {
    message = "You busted!";
    isAlive = false;
  }
  console.log(message);
};
    



