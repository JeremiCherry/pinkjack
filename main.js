"use strict";
let deck = [
    { value: 2, figure: "2", color: "spade" },
    { value: 3, figure: "3", color: "spade" },
    { value: 4, figure: "4", color: "spade" },
    { value: 5, figure: "5", color: "spade" },
    { value: 6, figure: "6", color: "spade" },
    { value: 7, figure: "7", color: "spade" },
    { value: 8, figure: "8", color: "spade" },
    { value: 9, figure: "9", color: "spade" },
    { value: 10, figure: "10", color: "spade" },
    { value: 10, figure: "J", color: "spade" },
    { value: 10, figure: "D", color: "spade" },
    { value: 10, figure: "K", color: "spade" },
    { value: 11, figure: "A", color: "spade" },
    { value: 2, figure: "2", color: "club" },
    { value: 3, figure: "3", color: "club" },
    { value: 4, figure: "4", color: "club" },
    { value: 5, figure: "5", color: "club" },
    { value: 6, figure: "6", color: "club" },
    { value: 7, figure: "7", color: "club" },
    { value: 8, figure: "8", color: "club" },
    { value: 9, figure: "9", color: "club" },
    { value: 10, figure: "10", color: "club" },
    { value: 10, figure: "J", color: "club" },
    { value: 10, figure: "D", color: "club" },
    { value: 10, figure: "K", color: "club" },
    { value: 11, figure: "A", color: "club" },
    { value: 2, figure: "2", color: "heart" },
    { value: 3, figure: "3", color: "heart" },
    { value: 4, figure: "4", color: "heart" },
    { value: 5, figure: "5", color: "heart" },
    { value: 6, figure: "6", color: "heart" },
    { value: 7, figure: "7", color: "heart" },
    { value: 8, figure: "8", color: "heart" },
    { value: 9, figure: "9", color: "heart" },
    { value: 10, figure: "10", color: "heart" },
    { value: 10, figure: "J", color: "heart" },
    { value: 10, figure: "D", color: "heart" },
    { value: 10, figure: "K", color: "heart" },
    { value: 11, figure: "A", color: "heart" },
    { value: 2, figure: "2", color: "diamond" },
    { value: 3, figure: "3", color: "diamond" },
    { value: 4, figure: "4", color: "diamond" },
    { value: 5, figure: "5", color: "diamond" },
    { value: 6, figure: "6", color: "diamond" },
    { value: 7, figure: "7", color: "diamond" },
    { value: 8, figure: "8", color: "diamond" },
    { value: 9, figure: "9", color: "diamond" },
    { value: 10, figure: "10", color: "diamond" },
    { value: 10, figure: "J", color: "diamond" },
    { value: 10, figure: "D", color: "diamond" },
    { value: 10, figure: "K", color: "diamond" },
    { value: 11, figure: "A", color: "diamond" },
];
let discard_pile = [];
let player_hand = [];
let dealer_hand = [];
let hidden_card;
let was_card_reaveled = false;
let player_points = 0;
let dealer_points = 0;
let player_stand = false;
let dealer_stand = false;
let player_win = false;
let dealer_win = false;
let draw = false;
let hajs = 100;
let bet = 0;
let payout_value = 1.5;
let kasa = document.getElementById("kasa");
let can_bet = true;
let message = document.getElementById("message");
function plus() {
    if (!can_bet)
        return;
    if (hajs - 5 >= 0) {
        hajs -= 5;
        bet += 5;
    }
    else {
        bet += hajs;
        hajs = 0;
    }
    kasa.innerText = bet + "/" + hajs;
}
function minus() {
    if (!can_bet)
        return;
    if (bet - 5 >= 0) {
        hajs += 5;
        bet -= 5;
    }
    else {
        hajs += bet;
        bet = 0;
    }
    kasa.innerText = bet + "/" + hajs;
}
function draw_card() {
    if (deck.length == 0) {
        while (discard_pile.length != 0) {
            deck.push(discard_pile.pop());
        }
        alert("discards were shuffled into the deck");
    }
    let drawn_card = deck.splice(Math.floor(Math.random() * deck.length), 1);
    return drawn_card[0];
}
function display_card(thing, id) {
    let div = document.getElementById(id);
    let image = document.createElement("img");
    image.src = "karty/" + thing.figure + thing.color + ".png";
    div.appendChild(image);
}
function count_cards(cards) {
    let aces = 0;
    let sum = 0;
    for (let i = 0; i < cards.length; i++) {
        sum += cards[i].value;
        if (cards[i].figure == "A") {
            aces++;
        }
    }
    if (sum > 21 && aces != 0) {
        while (sum > 21 && aces != 0) {
            sum -= 10;
            aces--;
        }
    }
    return sum;
}
function hit() {
    if (bet == 0)
        return;
    if(bet<10 && hajs>=10) return;
    if (can_bet) {
        can_bet = false;
    }
    player_hand.push(draw_card());
    display_card(player_hand[player_hand.length - 1], "player");
    const sum = count_cards(player_hand);
    console.log(sum);
    if (sum == 21) {
        player_points = sum;
        player_win = true;
        check_win();
        return;
    }
    if (sum > 21) {
        player_points = sum;
        dealer_win = true;
        check_win();
        return;
    }
    player_points = sum;
}
function stand() {
    if (bet == 0)
        return;
    if(bet<10 && hajs>=10) return;
    if (can_bet) {
        can_bet = false;
    }
    player_points = count_cards(player_hand);
    player_stand = true;
    dealer_turn();
}
function dealer_turn() {
    dealer_hand.push(hidden_card);
    document.getElementById("back")?.remove();
    display_card(dealer_hand[dealer_hand.length - 1], "dealer");
    was_card_reaveled = true;
    dealer_points = count_cards(dealer_hand);
    while (dealer_points < 17) {
        dealer_hand.push(draw_card());
        display_card(dealer_hand[dealer_hand.length - 1], "dealer");
        dealer_points = count_cards(dealer_hand);
        console.log(dealer_points)
    }
    if (dealer_points >= 17 && dealer_points < 21) {
        dealer_stand = true;
        check_win();
        return;
    }
    else if (dealer_points == 21) {
        dealer_win = true;
        check_win();
        return;
    }
    else if (dealer_points > 21) {
        player_win = true;
        check_win();
        return;
    }
}
function discard(cards) {
    while (cards.length != 0) {
        discard_pile.push(cards.pop());
    }
}
function start_game() {
    message.innerText = "PLACE YOUR BET!";
    if (player_hand.length > 1) {
        discard(player_hand);
        discard(dealer_hand);
        document.getElementById("player").innerHTML = "";
        document.getElementById("dealer").innerHTML = '<img src="karty/back.png" alt="reverse" id="back">';
    }
    kasa.innerText = bet + "/" + hajs;
    can_bet = true;
    for (let i = 0; i < 2; i++) {
        player_hand.push(draw_card());
        display_card(player_hand[player_hand.length - 1], "player");
    }
    dealer_hand.push(draw_card());
    display_card(dealer_hand[dealer_hand.length - 1], "dealer");
    hidden_card = draw_card();
    player_points = count_cards(player_hand);
    if (player_points == 21) {
        player_win = true;
    }
    dealer_points = count_cards(dealer_hand);
}
window.onload = (_event) => {
    start_game();
};
function check_win() {
    if (player_stand && dealer_stand) {
        if (player_points == dealer_points){
            draw = true;
        }
        else if (player_points > dealer_points) {
            player_win = true;
        }
        else if (dealer_points > player_points) {
            dealer_win = true;
        }
        
    }
    if (player_win == true) {
        message.innerText = "Player Won!";
        hajs += Math.floor(bet * payout_value);
        bet = 0;
        setTimeout(start_game, 2500);
    }
    if (dealer_win == true) {
        message.innerText = "Dealer Won!";
        bet = 0;
        setTimeout(start_game, 2500);
    }
    if (draw == true) {
        message.innerText = "Draw!";
        hajs += bet;
        bet = 0;
        setTimeout(start_game, 2500);
    }
    console.log("player win: ", player_win," dealer win: ", dealer_win)
}
