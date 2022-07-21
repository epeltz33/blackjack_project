let $container = document.getElementByClass("container");

let deck = Deck();

deck.mount($container);

deck.cards.forEach( function ( card, i ) {
	card.setSide( "front" );

	deck.shuffle();
	deck.unshuffle();
} );