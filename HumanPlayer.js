class HumanPlayer extends Player {

    constructor(X, Y, DrawDeck, PlayDeck) {

        super(X, Y, DrawDeck, PlayDeck);

        this.WaitForPhase1 = false;

        this.PlayerUI = false;
        this.WildUI = false;

        this.WildButtons = new ButtonGroup([[color("#4287f5"), "Blue"], ["#66CC00", "Green"], ["#CC0000", "Red"], ["#FFCC33", "Yellow"]]);

        this.WildButtons.SetClickCallBacks( (i) => { this.ChooseColor(i) } );
    
    }

    StartTurnPhase1(CardToDraw) {
        this.CardToDraw = CardToDraw;

        var NumOfHuman = 0;
        for(const Player of this.Owner.Players) { if(Player instanceof HumanPlayer) NumOfHuman++ };

        if(NumOfHuman != 1) this.WaitForPhase1 = true;
        else this.ContinueOnToPhase1();
        
    }

    StartTurnPhase2() {

        super.StartTurnPhase2();

        // Show Cards.

        this.Hand.Show();

        // Shift Cards Up.

        this.Hand.MoveUpPlayableCards(this.PlayDeck.Top(), this.Owner.JustPlayed);

        // Set the CallBack.
        var HasPlayableCards = this.Hand.SetUpPlayableCards(this.PlayDeck.Top(), (Card) => this.PlayCard(Card), () => { this.Hand.UnSetUpPlayableCards() }, this.Owner.JustPlayed);

        // If no Card can be Played let them Draw a Card.
        
        if(!HasPlayableCards) {

            this.DrawDeck.AddCallBack((Card) => {

                this.DrawCardAndPlay();

            } )
        }

    }

    StartTurnPhase3() {

        super.StartTurnPhase3();

        if(PlayDeck.Top().Number == "Skip" && !this.CheckingWon()) {

            this.PlayerUI = true;

            var Pairs = [];

            for(var i = 0; i < this.Owner.Players.length; i++) {

                if(this.Owner.Players[i] != this) {

                    var ButtonText = "Player " + (i + 1);

                    if(this.Owner.Players[i].IsSkipped) ButtonText += "\nSkipped";

                    Pairs.push([220, ButtonText]);

                }
            
            }

            this.PlayerSelect = new ButtonGroup(Pairs);

            this.PlayerSelect.SetClickCallBacks( (i) => { this.ChoosePlayerToSkip(i) } );

        }

        else if(PlayDeck.Top().Color == "Wild" && !this.CheckingWon()) {

            this.WildUI = true;

        }


        else this.EndTurn();
    }

    Draw() {

        super.Draw();

        if(this.MyTurn && this.CurrentPhase == 2) this.Hand.SetUpPlayableCards(this.PlayDeck.Top(), (Card) => this.PlayCard(Card), () => this.Hand.UnSetUpPlayableCards(), this.Owner.JustPlayed);
    }

    DrawUI() {

        super.DrawUI();

        if(this.WaitForPhase1) {

            fill(0, 150);
            rect(width / 2, height / 2, width, height);

            fill(255);
            textSize(30);

            text("Player " + (this.PlayerNum + 1) + "\nClick Screen to Continue", width / 2, height / 3);
        }

        if(this.PlayerUI) { this.PlayerSelect.Draw() };
        if(this.WildUI) { this.WildButtons.Draw() };

    }

    ChoosePlayerToSkip(ButtonClicked) {

        if(this.Owner.CurrentTurn <= ButtonClicked) ButtonClicked++;

        if(!this.Owner.Players[ButtonClicked].IsSkipped) {

            this.Owner.Players[ButtonClicked].IsSkipped = true;

            this.PlayerUI = false;
            this.EndTurn();
        }
    }

    ChooseColor(ButtonClicked) {
        if(ButtonClicked == 0) this.PlayDeck.Top().SelectedColor = "blue"; 
        else if(ButtonClicked == 1) this.PlayDeck.Top().SelectedColor = "green";
        else if(ButtonClicked == 2) this.PlayDeck.Top().SelectedColor = "red";
        else this.PlayDeck.Top().SelectedColor = "yellow";

        this.WildUI = false;
        this.EndTurn();
    }

    ContinueOnToPhase1() {
        super.StartTurnPhase1(this.CardToDraw);
        this.WaitForPhase1 = false;
    }

}