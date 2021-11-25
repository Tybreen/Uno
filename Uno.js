// Main Vars:
var test = false;

var mgr;

var Canvas;

var TextSizeRatio;

// Select Settings Vars:

var gui;

var Num_of_PlayersMin = 2;
var Num_of_PlayersMax = 4;

var Num_of_Human = 1;
var Num_of_HumanMin = 0;
var Num_of_HumanMax = Num_of_PlayersMax;
var Num_of_HumanPrevious = 1;

var Num_of_AI = 1;
var Num_of_AIMin = 0;
var Num_of_AIMax = Num_of_PlayersMax;
var Num_of_AIPrevious = 1;

var Dirty_Uno = false;


// Game Vars:

var Images;

var Colors = ["blue", "green", "red", "yellow"];
var Numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Draw 2", "Reverse", "Skip"];
var Players;
var Buttons;

var DrawDeck;
var PlayDeck;

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

    Canvas = createCanvas(windowWidth, windowHeight);

    setInterval(function() { FPS = Math.floor(getFrameRate()) }, 500);

    TextSizeRatio = (30 / 622) * Math.min(width, height);

    textAlign(CENTER, CENTER);

    rectMode(CENTER);

    mgr = new SceneManager();

    // Preload scenes. Preloading is normally optional
    // ... but needed if showNextScene() is used.
    mgr.addScene ( MainMenu );
    mgr.addScene ( Rules );
    mgr.addScene ( Game );

    mgr.showNextScene();

}

function draw() {
    background(255);
    mgr.draw();

    fill(120);
    textSize(10);

    stroke(0);
    strokeWeight(1);

    if(!mgr.isCurrent(Rules)) {

    fill("#CC0000");
    triangle(0, 0, 0, height / 4, width / 4, 0);

    fill("#4287f5");
    triangle(width, 0, width, height / 4, width / 4 + width / 2, 0);

    fill("#66CC00");
    triangle(width, height, width, height / 4 + height / 2, width / 4 + width / 2, height);

    fill("#FFCC33");
    triangle(0, height, 0, height / 4 + height / 2, width / 4, height);
    }

    else {

        fill("#CC0000");
        triangle(0, 0, 0, height / 6, width / 6, 0);

        fill("#4287f5");
        triangle(width, 0, width, height / 6, width / 6 + width / 1.5, 0);

        fill("#66CC00");
        triangle(width, height, width, height / 6 + height / 1.5, width / 6 + width / 1.5, height);

        fill("#FFCC33");
        triangle(0, height, 0, height / 6 + height / 1.5, width / 6, height);
    }

    fill(0);
    textSize(10);
    noStroke();
    text("FPS " + FPS, width - 20, 6);

}

// Intro scene constructor function
function MainMenu() {

    this.enter = function() {

        console.log("Width = " + windowWidth);
        console.log("Height = " + windowHeight);
        console.log(TextSizeRatio * 4)

        gui = createGui("Select Settings");
        gui.prototype.setSize(200, 164);
        gui.setPosition((width / 2) - 100, (height / 2) - 82);
        gui.addGlobals("Num_of_Human", "Num_of_AI", "Dirty_Uno");

        Play = createButton("Play");
        Play.style('font-size', '40px');
        Play.size(TextSizeRatio * 8, TextSizeRatio * 4);
        Play.position((width / 2) - Play.size().width / 2, (height / 2) - (Play.size().height / 2) + (height / 4));
        Play.mousePressed(() => {
        if(Num_of_Human != 0 || Num_of_AI != 0) {
            gui.hide();
            Play.remove();
            RulesButton.remove();
            mgr.showScene(Game);
        }

            else alert("Choose how many players you want players");
        })

        RulesButton = createButton("Rules");
        RulesButton.style('font-size', '25px');
        RulesButton.size(TextSizeRatio * 4, TextSizeRatio * 2);
        RulesButton.position((width / 2) - RulesButton.size().width / 2, (height / 1.5) - (RulesButton.size().height / 2) + (height / 4));
        RulesButton.mousePressed(() => {
        if(Num_of_Human != 0 || Num_of_AI != 0) {
            gui.hide();
            Play.remove();
            RulesButton.remove();
            mgr.showScene(Rules);
        }

        })

    }

    this.draw = function() {

        textSize(TextSizeRatio * 2);

        text("UNO!", width / 2, height / 4);

        if(Num_of_Human + Num_of_AI > Num_of_PlayersMax) {
            if(Num_of_HumanPrevious != Num_of_Human) Num_of_AI = (Num_of_PlayersMax - Num_of_Human);
            else if(Num_of_AIPrevious != Num_of_AI) Num_of_Human = (Num_of_PlayersMax - Num_of_AI);

            gui.prototype._controls.Num_of_Human.setValue(Num_of_Human);
            gui.prototype._controls.Num_of_AI.setValue(Num_of_AI);
        }

        else if(Num_of_Human + Num_of_AI < Num_of_PlayersMin) {

            if(Num_of_HumanPrevious != Num_of_Human) Num_of_AI = (Num_of_PlayersMin - Num_of_Human);

            else if(Num_of_AIPrevious != Num_of_AI) Num_of_Human = (Num_of_PlayersMin - Num_of_AI);

            gui.prototype._controls.Num_of_Human.setValue(Num_of_Human);
            gui.prototype._controls.Num_of_AI.setValue(Num_of_AI);
        }

        Num_of_HumanPrevious = Num_of_Human;
        Num_of_AIPrevious = Num_of_AI;
        
    }

}

function Rules() {

    this.enter = function() {

        Normal = createButton("Show Normal Rules");
        Normal.style('font-size', '35px');
        Normal.size(400, 100);
        Normal.position((width / 2) - Normal.size().width / 2, (75) - (Normal.size().height / 2));
        Normal.mousePressed(() => {
            if(Num_of_Human != 0 || Num_of_AI != 0) {
                Normal.hide();
                Dirty.show();
                this.DirtyText.hide();
                this.NormalText.show();
                
            }
        })

        Dirty = createButton("Show Dirty Rules");
        Dirty.style('font-size', '35px');
        Dirty.size(400, 100);
        Dirty.position((width / 2) - Dirty.size().width / 2, (75) - (Dirty.size().height / 2));
        Dirty.mousePressed(() => {
            if(Num_of_Human != 0 || Num_of_AI != 0) {
                Dirty.hide();
                Normal.show();
                this.NormalText.hide();
                this.DirtyText.show();

            }
        })

        button = createButton("Back");
        button.style('font-size', '25px');
        button.size(100, 50);
        button.position((50) - button.size().width / 2, (25) - (button.size().height / 2));
        button.mousePressed(() => {
            if(Num_of_Human != 0 || Num_of_AI != 0) {
                gui.hide();
                button.remove();
                Normal.remove();
                Dirty.remove();
                this.NormalText.remove();
                this.DirtyText.remove();
                this.CreditsText.remove();
                mgr.showScene(MainMenu);
            }
        })

        this.NormalText = createDiv("Every player starts with seven cards, and they are dealt face down. On your turn, players must match either the number, color, or the symbol/Action to the previously laid card.  The computer will automatically lift up any cards in your hand that are available to play. If the player has no matches, they must draw a card from the Draw pile. If that card can be played, play it. Otherwise, the game moves on to the next person in turn.<br/><br/>Action Cards: Besides the number cards, there are several other cards that help mix up the game. These are called Action or Symbol cards.<br/><br/>Reverse – playing this card will reverse the order of game play.<br/><br/>Skip – the player who lays the card can select which player will lose their next turn.<br/><br/>Draw Two – if this card is played, the next player will have to pick up two cards and forfeit his/her turn.<br/><br/>Wild – This card can be played at any time.  The player can select what color will be played next.<br/><br/>Wild Draw Four – This acts just like the wild card except that the next player also has to draw four cards as well as forfeit his/her turn. The first player to play all their cards is the winner.");
        this.NormalText.style('font-size', TextSizeRatio / 2 + 'px');
        //NormalText.style("text-align", "center");
        this.NormalText.style("margin", "25px");
        this.NormalText.position(0, 125);

        console.log(this.NormalText.size());

        this.DirtyText = createDiv("The general rules follow those for the standard Uno game with the following additions.<br/><br/>Players must continue drawing cards until they are able to play.<br/><br/>If a player matches the same number AND color of the previously laid card, the previous player must draw that many cards.(Example: if you play a red 9 on top of a red 9, the previous player would draw 9 cards)<br/><br/>If a draw 2 is played, the next player can lay another draw 2 (any color) on top of it… but the following player would now be required to draw 4… if they also have a draw 2 card to play, they can lay it and the next player would draw 6, etc.  (the same applies to Draw 4 cards, a second card draws 8, a third draws 12, etc)<br/><br/>If a player lays a 0 card, everyone switches hands in the direction of the game play.");
        this.DirtyText.style('font-size', TextSizeRatio / 2 + 'px');
        //DirtyText.style("text-align", "center");
        this.DirtyText.style("margin", "25px");
        this.DirtyText.hide();
        this.DirtyText.position(0, 125);

        this.CreditsText = createDiv("Credits:<br/>Thank you Codey for helping me with this Code and teaching me about Classes.<br/>Thank you Uncle Roger for the Deck Splitter code.<br/>Thank you Mom and Dad for encouraging me and for testing the game.");
        this.CreditsText.style('font-size', TextSizeRatio / 2 + 'px');
        //DirtyText.style("text-align", "center");
        this.CreditsText.style("margin", width / 6.5 + "px");
        this.CreditsText.show();
        //CreditsText.position(0, 75 + NormalText.size().height);

    }

    this.draw = function() {
        this.CreditsText.position(0, 80 + Math.max(this.NormalText.size().height, this.DirtyText.size().height));
    }

}


// Main games scene constructor function
function Game() {

    this.enter = function() {

        DrawDeck = new Deck((width / 2) + (Images.CardWidth / 1.5), height / 2);
        PlayDeck = new Deck((width / 2) - (Images.CardWidth / 1.5), height / 2);

        var PlayerArray = [];

        for(var i = 0; i < Num_of_Human; i++) { PlayerArray.push(new HumanPlayer(DrawDeck, PlayDeck)) };
        for(var i = 0; i < Num_of_AI; i++) { PlayerArray.push(new AIPlayer(DrawDeck, PlayDeck)) };

        Players = new PlayerSet(PlayDeck, PlayerArray);

        SetupEndingScreen();

        // Start Up Procedure:

        DrawDeck.AddAllCards(Colors, Numbers);

        DrawDeck.Hide();

        DrawDeck.Shuffle();

        Players.DealCards();

        PlayDeck.Push(DrawDeck.Pop());

        while((PlayDeck.Top().Number.localeCompare("9") == 1 || PlayDeck.Top().Color == "Wild") || (Dirty_Uno && PlayDeck.Top().Number == "0")) PlayDeck.Push(DrawDeck.Pop());

        PlayDeck.Move();

        PlayDeck.Show();

        setTimeout( () => { Players.Start() }, DealInterval * Players.InitialCards * Players.Players.length + DealSpeed + 50);

    }

    this.draw = function() {

        DrawDeck.Draw();
        PlayDeck.Draw();
        Players.Draw();

        if(Players.GamePlaying && Players.CurrentPlayer().CheckingWon()) DrawEndingScreen();

        // BROKEN!
        // if(keyWentDown("space")) { Players.AddCardsToAll(new Card("green", "Skip"/* ADD CARD */)) };


        

        //if(keyWentDown("space")) test = true;
        
        //if(test) DrawEndingScreen();

    }
}



/* Notes:

We changed the p5.js:

We Disabled Line 4341.


*/


/* Credits:

Thank you Codey for helping me with this Code and teaching me about Classes.

Thank you Uncle Roger for the Deck Splitter code.

Thank you Mom and Dad for encouraging me.

*/