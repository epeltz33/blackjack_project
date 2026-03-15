// ── Global state ──────────────────────────────────────────────
let money = 200;
let deck = [];
let playerCards = [];
let splitCards = [];
let dealerCards = [];
let playerBet = 0;
let splitBet = 0;
let playerCount = 0;
let splitCount = 0;
let dealerCount = 0;
let currentHand = "";
let holeCardRevealed = false;

// ── DOM helpers ───────────────────────────────────────────────

function qs(sel)  { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }

function show(sel, display) {
    qsa(sel).forEach(function(el) { el.style.display = display || 'block'; });
}
function hide(sel) {
    qsa(sel).forEach(function(el) { el.style.display = 'none'; });
}
function setText(sel, text) {
    qsa(sel).forEach(function(el) { el.textContent = text; });
}
function appendCard(containerSel, cardClass) {
    const div = document.createElement('div');
    div.className = 'playing-card ' + cardClass;
    qs(containerSel).appendChild(div);
}
function appendMessage(html) {
    qs('blockquote').insertAdjacentHTML('beforeend', html);
}
function removeAll(sel) {
    qsa(sel).forEach(function(el) { el.remove(); });
}

// ── UI phase helpers ──────────────────────────────────────────

// Called by init() — resets to the initial betting state
function showBetPhase() {
    show('.bet-phase', 'flex');
    show('#bet-input-row', 'flex');
    hide('#bet-action-row');
    hide('.play-phase');
    hide('.post-hand');
    hide('#splitButton');
}

// After a valid bet is placed: hide input, show Clear + Deal
function showBetActions() {
    hide('#bet-input-row');
    show('#bet-action-row', 'flex');
}

// After Deal: hide bet controls, show play buttons
function showPlayPhase() {
    hide('.bet-phase');
    show('.play-phase', 'flex');
    show('#hitButton');
    show('#standButton');
    show('#doubleButton');
    hide('#splitButton');
}

// After a hand resolves: hide play buttons, show the appropriate end-of-hand button
function endHand(which) {
    hide('.play-phase');
    show('.post-hand', 'flex');
    if (which === 'reset') {
        hide('#playAgain');
        show('#resetButton');
    } else {
        show('#playAgain');
        hide('#resetButton');
    }
}

// ── Event listeners ───────────────────────────────────────────

moneyElement();

qs('#dealButton').addEventListener('click', dealHand);
qs('#betButton').addEventListener('click', makeBet);
qs('#clearButton').addEventListener('click', clearBet);
qs('#doubleButton').addEventListener('click', doubleBet);
qs('#hitButton').addEventListener('click', takeCard);
qs('#playAgain').addEventListener('click', playAgain);
qs('#standButton').addEventListener('click', stand);
qs('#splitButton').addEventListener('click', split);
qs('#resetButton').addEventListener('click', resetGame);

// ── Display helpers ───────────────────────────────────────────

function moneyElement() {
    qs('#money-left').textContent = 'Playing Money: $' + money;
}
function betElement() {
    qs('#submittedBet').textContent = playerBet > 0 ? 'Bet: $' + playerBet : '';
}
function splitBetElement() {
    qs('#splitBet').textContent = 'Split bet: $' + splitBet;
}

// ── Init ──────────────────────────────────────────────────────

function init() {
    currentHand = "playerHand";
    holeCardRevealed = false;
    playerCards = [];
    splitCards = [];
    dealerCards = [];
    playerCount = 0;
    splitCount = 0;
    dealerCount = 0;
    playerBet = 0;
    splitBet = 0;
    qs('#splitBet').textContent = '';
    qs('#betAmount').value = '';
    moneyElement();
    betElement();
    removeAll('.playing-card');
    removeAll('.message');
    setText('.player-count, .dealer-count, .split-count', '');
    showBetPhase();
    resetDeck();
}

// ── Deck ──────────────────────────────────────────────────────

function resetDeck() {
    deck = [];
    let suits = ['d', 'h', 's', 'c'];
    for (let i = 0; i < suits.length; i++) {
        let cards = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
        for (let j = 0; j < cards.length; j++) {
            deck.push(suits[i] + cards[j]);
        }
    }
}

function shuffleDeck() {
    let count = deck.length;
    while (count) {
        deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
        count -= 1;
    }
}

// ── Betting ───────────────────────────────────────────────────

function makeBet() {
    playerBet = qs('#betAmount').value;
    if (playerBet <= money && playerBet > 0) {
        betElement();
        showBetActions();
    } else {
        console.log('error');
    }
}

function clearBet() {
    playerBet = 0;
    betElement();
    qs('#betAmount').value = '';
    qs('#submittedBet').textContent = '';
    moneyElement();
    showBetPhase();
}

// ── Dealing ───────────────────────────────────────────────────

function dealHand() {
    shuffleDeck();

    let nextCard;
    for (let i = 0; i < 2; i++) {
        nextCard = deck.pop();
        playerCards.push(nextCard);
    }
    for (let i = 0; i < 2; i++) {
        nextCard = deck.pop();
        dealerCards.push(nextCard);
    }

    appendCard('.playerCards', playerCards[0]);
    appendCard('.playerCards', playerCards[1]);
    appendCard('.dealerCards', dealerCards[0]);

    // Face-down hole card needs an id so dealerHand() can flip it
    const faceDown = document.createElement('div');
    faceDown.className = 'playing-card back-blue';
    faceDown.id = 'face-down-card';
    qs('.dealerCards').appendChild(faceDown);

    showPlayPhase();
    updateCounts();

    if (playerCount === 21 && dealerCount < 21) {
        blackjack();
    }
    toggleSplit();
}

function doubleBet() {
    if (currentHand === "playerHand") {
        playerBet *= 2;
        betElement();
        takeCard();
        if (splitCards.length > 1) {
            currentHand = "splitHand";
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
        show('#doubleButton');
        currentHand = "playerHand";
    }
}

// ── Split ─────────────────────────────────────────────────────

function toggleSplit() {
    const firstCard  = playerCards[0];
    const secondCard = playerCards[1];
    if (firstCard && secondCard && firstCard.slice(1) === secondCard.slice(1)) {
        const btn = qs('#splitButton');
        btn.style.display = btn.style.display === 'none' ? 'inline-block' : 'none';
    }
}

function split() {
    const secondCard = playerCards[1];
    qs('.playing-card.' + playerCards[1]).remove();
    splitCards = [secondCard];
    playersCards = playerCards.splice(0, 1); // preserve original behaviour
    appendCard('.splitCards', secondCard);
    hide('#splitButton');
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
    currentHand = "splitHand";
}

// ── Card taking ───────────────────────────────────────────────

function takeCard() {
    if (currentHand === "splitHand") {
        splitTakeCard();
    } else {
        playerTakeCard();
    }
}

function playerTakeCard() {
    let nextCard = deck.pop();
    playerCards.push(nextCard);
    appendCard('.playerCards', playerCards[playerCards.length - 1]);
    if (playerCards.length > 2) {
        hide('#doubleButton');
        hide('#splitButton');
    }
    updateCounts();
}

function splitTakeCard() {
    let nextCard = deck.pop();
    splitCards.push(nextCard);
    appendCard('.splitCards', splitCards[splitCards.length - 1]);
    if (splitCards.length > 2) {
        hide('#doubleButton');
        hide('#splitButton');
    }
    updateCounts();
}

// ── Stand ─────────────────────────────────────────────────────

function stand() {
    if (splitCards.length < 1) {
        dealerHand();
        scoreGame();
        hide('#doubleButton');
        hide('#splitButton');
    } else if (currentHand === "splitHand") {
        currentHand = "playerHand";
        show('#doubleButton');
        toggleSplit();
    } else {
        currentHand = "splitHand";
        dealerHand();
        scoreGame();
        hide('#doubleButton');
        hide('#splitButton');
    }
}

// ── Dealer ────────────────────────────────────────────────────

function dealerHand() {
    holeCardRevealed = true;
    qs('#face-down-card').className = 'playing-card ' + dealerCards[1];
    dealerCount = getHandValue("dealer");
    setText('.dealer-count', 'Dealer: ' + dealerCount);
    if (dealerCount < 17) {
        dealerTakeCard();
    }
}

function dealerTakeCard() {
    let nextCard = deck.pop();
    dealerCards.push(nextCard);
    appendCard('.dealerCards', dealerCards[dealerCards.length - 1]);
    dealerCount = getHandValue("dealer");
    setText('.dealer-count', 'Dealer: ' + dealerCount);
    console.log('dealer count ' + dealerCount);
    if (dealerCount < 17) {
        dealerTakeCard();
    }
}

// ── Counts ────────────────────────────────────────────────────

function updateCounts() {
    playerCount = getHandValue("player");
    dealerCount = getHandValue("dealer");
    splitCount  = getHandValue("split");

    setText('.player-count', 'Player: ' + playerCount);

    if (holeCardRevealed) {
        setText('.dealer-count', 'Dealer: ' + dealerCount);
    } else if (dealerCards.length > 0) {
        setText('.dealer-count', 'Dealer: ?');
    }

    if (splitCards.length > 0) {
        setText('.split-count', 'Split: ' + splitCount);
    } else {
        setText('.split-count', '');
    }

    console.log('player count ' + playerCount);
    console.log('dealer count ' + dealerCount);
    console.log('split count '  + splitCount);

    playerBust();
}

// ── Core game logic (algorithms unchanged) ────────────────────

function getHandValue(playerType) {
    let hand = handOf(playerType);
    let count = 0;
    if (hand.length > 2) {
        sortAces(hand);
    }
    hand.forEach(function(card) {
        if (card.split('').includes('A') && count < 11) {
            count += 11;
        } else if (card.split('').includes('A') && count > 11) {
            count += 1;
        } else if (card.split('').includes('2')) {
            count += 2;
        } else if (card.split('').includes('3')) {
            count += 3;
        } else if (card.split('').includes('4')) {
            count += 4;
        } else if (card.split('').includes('5')) {
            count += 5;
        } else if (card.split('').includes('6')) {
            count += 6;
        } else if (card.split('').includes('7')) {
            count += 7;
        } else if (card.split('').includes('8')) {
            count += 8;
        } else if (card.split('').includes('9')) {
            count += 9;
        } else if (card.split('').includes('1')) {
            count += 10;
        } else if (card.split('').includes('J')) {
            count += 10;
        } else if (card.split('').includes('Q')) {
            count += 10;
        } else if (card.split('').includes('K')) {
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
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].charAt(hand[i].length - 1) === "A") {
            hand.push(hand.splice(i, 1)[0]);
        }
    }
}

// ── Scoring ───────────────────────────────────────────────────

function scoreGame() {
    let count = (currentHand === "splitHand") ? splitCount : playerCount;

    if (dealerCount > 21 && count < 22) {
        appendMessage('<p class="message">Dealer Busts! You win $' + playerBet + '.</p>');
        winBet();
    } else if (dealerCount > 16 && count < 22 && dealerCount < count) {
        if (currentHand === "splitHand") {
            appendMessage('<p class="message">Your split hand beat the dealer! You win $' + playerBet + '.</p>');
        } else {
            appendMessage('<p class="message">You beat the dealer! You win $' + playerBet + '.</p>');
        }
        winBet();
    } else if (dealerCount > 16 && count < 22 && dealerCount > count) {
        if (currentHand === "splitHand") {
            appendMessage('<p class="message">Your split hand lost to the dealer! You lose $' + playerBet + '.</p>');
        } else {
            appendMessage('<p class="message">You lost to the dealer! You lose $' + playerBet + '.</p>');
        }
        loseBet();
    } else if (dealerCount === count) {
        if (currentHand === "splitHand") {
            appendMessage("<p class=\"message\">It's a draw on your split hand. Take your money back.</p>");
        } else {
            appendMessage("<p class=\"message\">It's a draw on your hand. Take your money back.</p>");
        }
        draw();
    } else if (count > 21) {
        loseBet();
    } else {
        hide('.play-phase');
    }
}

function playerBust() {
    let count = (currentHand === "splitHand") ? splitCount : playerCount;
    if (count > 21) {
        if (currentHand === "splitHand") {
            appendMessage('<p class="message">Your Split Hand Busted! You lose $' + playerBet + '.</p>');
            currentHand = "playerHand";
            updateCounts();
            show('#doubleButton');
        } else if (splitCards.length < 1) {
            appendMessage('<p class="message">You Busted! You lose $' + playerBet + '.</p>');
            loseBet();
            dealerHand();
        } else {
            appendMessage('<p class="message">You Busted! You lose $' + playerBet + '.</p>');
            currentHand = "splitHand";
            dealerHand();
            scoreGame();
        }
    }
}

function loseBet() {
    let bet = (currentHand === "splitHand") ? splitBet : playerBet;
    money -= bet;
    moneyElement();
    if (currentHand === "splitHand") {
        currentHand = "playerHand";
        scoreGame();
    } else if (money === 0) {
        appendMessage("<p class=\"message\">You're out of money! Click Reset Game to play again!</p>");
        endHand('reset');
    } else {
        endHand('playAgain');
    }
}

function winBet() {
    let bet = (currentHand === "splitHand") ? splitBet : playerBet;
    money += parseInt(bet);
    moneyElement();
    if (currentHand === "splitHand") {
        currentHand = "playerHand";
        scoreGame();
    } else {
        endHand('playAgain');
    }
}

function draw() {
    if (currentHand === "splitHand") {
        currentHand = "playerHand";
        scoreGame();
    } else {
        endHand('playAgain');
    }
}

function blackjack() {
    let bet = (currentHand === "splitHand") ? splitBet : playerBet;
    money += (parseInt(bet) * 1.5);
    moneyElement();
    if (currentHand === "splitHand") {
        appendMessage('<p class="message">Your Split Hand Got Blackjack!! You win $' + (playerBet * 3) + '.</p>');
        currentHand = "playerHand";
    } else {
        appendMessage('<p class="message">Blackjack!! You win $' + (playerBet * 1.5) + '.</p>');
    }
    endHand('playAgain');
}

// ── Between hands ─────────────────────────────────────────────

function playAgain() {
    hide('.post-hand');
    init();
}

function resetGame() {
    hide('.post-hand');
    money = 100;
    init();
}

init();
