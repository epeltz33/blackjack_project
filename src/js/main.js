   
  let firstCard = 10 
   let secondCard = 11
   let sum = secondCard + firstCard
   let haveBlackJack = false
// 1. make a variable called isAlive and assign it to true 
   let isAlive = true
// 2. flip its value to false in the appropriate code block 
if ( sum <= 20 ) {
  console.log( "Do you want to hit?" )
} else if (sum === 21) {
 console.log("You got Blackjack!")
  haveBlackJack = true;
 } else {
    console.log("You lost!")
   isAlive = false
  }
console.log(isAlive)
    
// Cash Out


