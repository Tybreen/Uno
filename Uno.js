// Main Vars:

var Images;

var Colors = ["blue", "green", "red", "yellow"];
var Numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Draw 2", "Reverse", "Skip"];
var Players;
var Buttons;

var DrawDeck;
var PlayDeck;

var GamePlaying = false;
var FPS;

var DealInterval = 100;
var DealSpeed = 300;
var DrawInterval = 200;
var DrawSpeed = 300;
var PlayInterval = 200;
var PlaySpeed = 300;

var HandSpeed = 750;

var ShiftUpSpeed = 200;




function preload() {

    Images = new CardImages(Colors, Numbers);

}



function setup() {

    createCanvas(windowWidth, windowHeight);

    textAlign(CENTER, CENTER);

    rectMode(CENTER);

    setInterval(function() { FPS = Math.floor(getFrameRate()) }, 500);

    DrawDeck = new Deck((width / 2) + (Images.CardWidth / 1.5), height / 2);
    PlayDeck = new Deck((width / 2) - (Images.CardWidth / 1.5), height / 2);

    Players = new PlayerSet(PlayDeck, new HumanPlayer(DrawDeck, PlayDeck), new AIPlayer(DrawDeck, PlayDeck), new AIPlayer(DrawDeck, PlayDeck));

    // Start Up Procedure:

    DrawDeck.AddAllCards(Colors, Numbers);

    DrawDeck.Hide();

    DrawDeck.Shuffle();

    Players.DealCards();

    PlayDeck.Push(DrawDeck.Pop());

    while(PlayDeck.Top().Number.localeCompare("9") == 1 || PlayDeck.Top().Color == "Wild") PlayDeck.Push(DrawDeck.Pop());

    PlayDeck.Move();

    PlayDeck.Show();

    setTimeout( () => { Players.Start(); GamePlaying = true }, DealInterval * Players.InitialCards * Players.Players.length + DealSpeed + 50);

    

}



function draw() {

    background(255);

    fill(120);

    textSize(10);

    text("FPS " + FPS, width - 20, 6);

    //console.log(windowWidth)
    //console.log(windowHeight)

    //console.log(Players.NextPlayer())

    if(!Players.TurnStarted && GamePlaying) {

        if(DrawDeck.Cards.length == 0) {
            
            DrawDeck.Cards = PlayDeck.Cards.splice(0, PlayDeck.Cards.length - 1);
            DrawDeck.Hide();
            DrawDeck.Shuffle();
            DrawDeck.Move();

            for(const Card of DrawDeck.Cards) { Card.SelectedColor = "" };

            // KEEP! Look for SelectedColor = ""
            alert("Check the console. Look for SelectedColor = empty string");
            console.error(DrawDeck.Cards);
        }

        if(!Players.CurrentPlayer().CheckingWon()) { Players.NextTurn() };
        
    }

    // BROKEN!
    // if(keyWentDown("space") && GamePlaying) { Players.AddCardsToAll(new Card("green", "Skip"/* ADD CARD */)) };


    DrawDeck.Draw();
    PlayDeck.Draw();
    Players.Draw();

    if(Players.CurrentPlayer().CheckingWon() && GamePlaying) {
        textSize(150);
        fill("HotPink");
        text("You Won", width / 2, height / 2);
    }

}


/* Notes:

We changed the p5.js:

We Disabled Line 4341.


*/


/* Credits:

Thank you Codey for helping me with this Code.

Thank you Uncle Roger for the Deck Splitter code.

Thank you Mom and Dad for encouraging me.

*/