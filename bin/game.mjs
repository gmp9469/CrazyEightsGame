// game.mjs
import os from 'os';
import * as cards from '../lib/cards.mjs';
import {question} from 'readline-sync';
import clear from 'clear';
import {readFile} from 'fs';

let args = process.argv;
let deck = [];
let player = [];
let computer = [];
let discard = [];
let current = {};

//Predefined cards
if(args.length>=3){
    readFile(args[2], function(err, data){
        if (err){
            console.log("Error reading file!");
            process.exit();
        } 
        else{
            const instruction = JSON.parse(data);
            deck = instruction.deck;
            player = instruction.playerHand;
            computer = instruction.computerHand;
            discard = [instruction.discardPile];
            current = instruction.nextPlay;   //the starting card      
            play(player, computer, current, deck, discard);
        }
    });
}
//Not predefined
else{
    deck = cards.generateDeck();
    deck = cards.shuffle(deck);
    let start = cards.deal(deck);
    //player = start.hands[0];
    //computer = start.hands[1];
    [player, computer] = start.hands;
    deck = start.deck;
    let drawn = [];
    [deck, drawn] = cards.draw(deck);
    current = drawn[0];//the starting card
    discard.push(drawn);//all played/starting cards go into discarded pile
    while (true){//draw more if starting card is 8
        if(current.rank!=8){
            break;
        }
        else{//get a new starting card
            [deck, drawn] = cards.draw(deck);
            current = drawn[0];
            discard.push(drawn);
        }
    }
    play(player, computer, current, deck, discard);
}

function play(player, computer, current, deck, discard){
    console.log("              CR🤪ZY 8's");
    console.log("-----------------------------------------------");
    console.log("Next suit/rank to play: " + cards.handToString([current]));
    console.log("-----------------------------------------------");
    console.log("Top of discard pile: " + cards.handToString(discard[discard.length-1]));
    console.log("Number of cards left in deck: " + deck.length);
    console.log("-----------------------------------------------");
    console.log("🤖✋ (computer hand): " + cards.handToString(computer));
    console.log("😊✋ (player hand): " + cards.handToString(player));
    console.log("-----------------------------------------------");

    let playable = false;
    player.forEach(card =>{
        if (cards.matchesAnyProperty(card, current) || card.rank==8){//checking to see if the player has a playable card
            playable = true;
        }
    })
    console.log("😊 Player's turn...");
    if (playable){
        while(true){
            console.log("Enter the number of the card you would like to play");
            console.log(cards.handToString(player, os.EOL, true));
            let choice = question("> ")-1;
            if (cards.matchesAnyProperty(player[choice], current) || player[choice].rank==8){
                current = player[choice];//making sure user inputed valid card
                player.splice(choice, 1);//pick a card, place it on top and remove it from player's hand
                break;
            }
            else{
                console.log("Not a valid card!");
            }
        }
    }
    else{//draw until find a playable card
        console.log("😔 You have no playable cards");
        console.log("Press ENTER to draw cards until matching: " + current.rank + ", " + current.suit + ",  8");
        let ent = question(".");
        let drawn = cards.drawUntilPlayable(deck, current);
        deck = drawn[0];
        console.log("Cards drawn: " + cards.handToString(drawn[1]));
        let temp2 = drawn[1];
        let temp3 = temp2.splice(temp2.length-1, 1);
        current = temp3[0];
        player.push(...temp2);//add drawn cards to player's hand and play top card
    }

    if (current.rank != 8){
        console.log("Card played: " + cards.handToString([current]));//playing an 8 has a seperate message
    }
    else{
        console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
        console.log("1: ♠️ \n2: ❤️ \n3: ♣️ \n4: ♦️");
        let choice2 = question("> ");
        switch (choice2) {
            case '1': 
                current.suit = '♠️';
                break;
            case '2': 
                current.suit = '❤️';
                break;  
            case '3': 
                current.suit = '♣️';
                break;
            case '4': 
                current.suit = '♦️';
                break;
        }
        current.rank = "";
    }
    discard.push([current]);

    let ent2 = question("Press ENTER to continue");
    clear();

    console.log("              CR🤪ZY 8's");
    console.log("-----------------------------------------------");
    console.log("Next suit/rank to play: " + cards.handToString([current]));
    console.log("-----------------------------------------------");
    console.log("Top of discard pile: " + cards.handToString(discard[discard.length-1]));
    console.log("Number of cards left in deck: " + deck.length);
    console.log("-----------------------------------------------");
    console.log("🤖✋ (computer hand): " + cards.handToString(computer));
    console.log("😊✋ (player hand): " + cards.handToString(player));
    console.log("-----------------------------------------------");
    console.log("🤖 Computer's turn...");
    console.log("Computer's hand is " + cards.handToString(computer));

    let playable2 = false;
    for (let i=0; i<computer.length; i++){
        if (cards.matchesAnyProperty(computer[i], current) || computer[i].rank==8){//checking to see if the player has a playable card
            current = computer[i];
            computer.splice(i, 1);
            playable2 = true;     
            break;     
        }
    }
    if (playable2 === false){
        console.log("Computer drawing cards...");
        let drawn2 = cards.drawUntilPlayable(deck, current);
        deck = drawn2[0];
        console.log("Cards drawn: " + cards.handToString(drawn2[1]));
        let temp4 = drawn2[1];
        let temp5 = temp4.splice(temp4.length-1, 1);
        current = temp5[0];
        computer.push(...temp4);//add drawn cards to player's hand and play top card
    }
    if (current.rank != 8){
        console.log("Computer plays " + cards.handToString([current]));
    }
    else{
        let random = Math.floor(Math.random() * 4);
        switch (random) {
            case '1': 
                current.suit = '♠️';
                break;
            case '2': 
                current.suit = '❤️';
                break;  
            case '3': 
                current.suit = '♣️';
                break;
            case '4': 
                current.suit = '♦️';
                break;
        }
        current.rank = "";
        console.log("CRAZY EIGHTS! Computer randomly chosen suit: " + current.suit);
    }
    discard.push([current]);

    let ent3 = question("Press ENTER to continue");
    clear();

    console.log("              CR🤪ZY 8's");
    console.log("-----------------------------------------------");
    console.log("Next suit/rank to play: " + cards.handToString([current]));
    console.log("-----------------------------------------------");
    console.log("Top of discard pile: " + cards.handToString(discard[discard.length-1]));
    console.log("Number of cards left in deck: " + deck.length);
    console.log("-----------------------------------------------");
    console.log("🤖✋ (computer hand): " + cards.handToString(computer));
    console.log("😊✋ (player hand): " + cards.handToString(player));
    console.log("-----------------------------------------------");
}