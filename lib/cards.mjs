// cards.mjs
//const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};

const range = function(...args){
    let ranges = [];
    let start;
    let inc;
    let end;
    if(args.length==1){
        start = 0;
        end = args[0];
        inc = 1;
    }
    else if(args.length==2){
        start = args[0];
        end = args[1];
        inc = 1;
    }
    else{
        start = args[0];
        end = args[1];
        inc = args[2];
    }
    for(let i=start; i<end; i+=inc){
        ranges.push(i);
    }
    return ranges;
}

const generateDeck = function(){
    let deck = [];
    const nums = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
    for(let i in suits){
        for(let j=0; j<13; j++){
            deck.push({rank: nums[j], suit: suits[i]});
        }
    }
    return deck;
}

const shuffle = function(deck){
    let shuffled = [...deck];
    let x
    let temp
    for(let i=deck.length-1; i>0; i--){
        x = Math.floor(Math.random() * (i+1));
        temp = shuffled[i];
        shuffled[i] = shuffled[x];
        shuffled[x] = temp;
    }
    //The Fisher Yates Shuffling Algorithm
    return shuffled;
}

const draw = function(...args){
    let deck = args[0];
    let n;
    if(args.length==2){
        n=args[1];
    }
    else{
        n=1;
        //n is deafult 1
    }
    const copy = [...deck];
    const drawn = copy.splice(-n, n); //removes n elements starting at index -n
    return [copy, drawn];
}

const deal = function(cardsArray, numHands = 2, cardsPerHand = 5){
    let copy = [...cardsArray];
    let handsdraw = [];
    for(let i=0; i<numHands; i++){
        handsdraw.push(copy.splice(-cardsPerHand, cardsPerHand));//takes cardPerHand number of cards away from deck per number of hands
    }
    return {deck: copy, hands: handsdraw};
}

const handToString = function(hand, sep = ' ', numbers = false){
    let str = "";
    if(numbers==true){
        let i = 1;
        hand.forEach(card =>{
            str = str + i + ": " + card.rank + card.suit + sep;
            i++;
        });
    }
    else{
        hand.forEach(card =>{
            str = str + card.rank + card.suit + sep
        });
    }
    return str
}

const matchesAnyProperty = function(obj, matchObj){
    if (obj.rank==matchObj.rank || obj.suit==matchObj.suit){
        return true;
    }
    else{
        return false;
    }
}

const drawUntilPlayable = function(deck, matchObject){
    let copy = [...deck];
    let drawn = [];
    for(let i=copy.length-1; i>=0; i--){
        const card = copy[i];
        copy.splice(-1, 1);
        drawn.push(card);
        if(card.rank==matchObject.rank || card.rank==8 || card.suit==matchObject.suit){
            break;
        }
    }
    return [copy, drawn];
}

export{
    range, generateDeck, shuffle, draw, deal, handToString, matchesAnyProperty, drawUntilPlayable
};


