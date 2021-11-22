class PlayerSet {


    constructor(PlayDeck, Players) {

        this.Players = Players;
        this.CurrentTurn = 0;
        this.PlayDeck = PlayDeck;
        this.InitialCards = 7;
        this.Direction = 1;
        this.Reverse = false;
        this.CardsToDraw = 0;

        this.GamePlaying = false;
        
        this.RepositionHands();

        Canvas.mouseReleased(() => { for(const Player of this.Players) { if(Player.WaitForPhase1) Player.ContinueOnToPhase1() } });

    }

    RepositionHands() {

        this.StartingAngle = 90;
        this.AnglePerPlayer = 360 / this.Players.length;
        this.CenterX = width / 2;
        this.CenterY = height / 2;
        this.Radius = (Math.min(width, height) / 3);

        angleMode(DEGREES);

        for(var i = 0; i < this.Players.length; i++) {

            this.Players[i].SetOwner(this, i);

            this.Theta = (i - this.CurrentTurn) * -this.AnglePerPlayer;

            this.X = this.CenterX + this.Radius * cos(this.Theta + this.StartingAngle);
            this.Y = this.CenterY + this.Radius * sin(this.Theta + this.StartingAngle);

            this.Players[i].Move(this.X, this.Y, this.Theta + this.StartingAngle);

        }

    }

    PassHands() {

        var Hands = [];

        for(var i = 0; i < this.Players.length; i++) Hands.push(this.Players[i].Hand)

        if(this.Direction > 0) for(var i = 0; i < this.Players.length; i++) this.PassOneHand(Hands, i);

        if(this.Direction < 0) for(var i = this.Players.length - 1; i >= 0; i--) this.PassOneHand(Hands, i);

        this.RepositionHands();
    }

    PassOneHand(Hands, i) {

        var NextI = i + this.Direction;

        NextI = this.RepeatNumber(NextI);

        this.Players[NextI].Hand = Hands[i];
    }

    DealCards() { for(var i = 0; i < this.InitialCards; i++) { for(var j = 0; j < this.Players.length; j++) { var fun = (I, J) => { setTimeout( () => { this.Players[J].DrawCard(false) }, DealInterval * (I * this.Players.length + J)) }; fun(i, j) } } };

    Draw() {

        noFill();
        stroke(0);
        strokeWeight(3);

        circle(this.CenterX, this.CenterY, this.Radius * 2);

        this.StartingAngle =  90 - (this.AnglePerPlayer / 2);

        for(var i = 0; i < this.Players.length; i++) {

            this.Players[i].Draw();

            this.Theta = (i - this.CurrentTurn) * -this.AnglePerPlayer;

            this.LengthOfArrow = 10;

            push();
            stroke(0);
            translate(width / 2, height / 2);
            rotate(this.Theta + this.StartingAngle + 1);
            line(this.Radius - this.LengthOfArrow, -this.LengthOfArrow * this.Direction, this.Radius, 0);
            line(this.Radius, 0, this.Radius + this.LengthOfArrow, -this.LengthOfArrow * this.Direction);
            pop();

        }
        for(var i = 0; i < this.Players.length; i++) { this.Players[i].DrawUI() };



    }

    Start() {
        // Start Player Turn

        this.CurrentTurn = -1;

        this.NextTurn();
    }

    NextTurn() {

        if(this.CurrentPlayer() == undefined || !this.CurrentPlayer().CheckingWon()) {

            this.GamePlaying = true;

            this.CurrentTurn += this.Direction;

            if(this.CurrentTurn >= this.Players.length) this.CurrentTurn = 0;

            else if(this.CurrentTurn == -1) this.CurrentTurn = this.Players.length - 1;

            this.RepositionHands();

            setTimeout(() => { this.Players[this.CurrentTurn].StartTurnPhase1(this.CardsToDraw) }, HandSpeed + 50);

        }
        
    }

    TurnEnded() {

        var IsEqual = this.PlayDeck.Top().Number == this.PlayDeck.SecondToTop().Number && this.PlayDeck.Top().Color == this.PlayDeck.SecondToTop().Color
        var IsNumber = this.PlayDeck.Top().Number.localeCompare("9") <= 0 && this.PlayDeck.Top().Number.localeCompare("0") == 1;

        if(Dirty_Uno && IsEqual && IsNumber) {
            
            for(var i = 0; i < Number(this.PlayDeck.Top().Number); i++) { setTimeout(() => { this.PreviousPlayer().DrawCard(false) }, i * DrawInterval) };

            setTimeout(() => { this.NextTurn() }, Number(this.PlayDeck.Top().Number) * DrawInterval + DrawSpeed);
        }

        

        else if(Dirty_Uno && this.PlayDeck.Top().Color != "Wild" && this.PlayDeck.Top().Number == "0") {
            this.PassHands();
            setTimeout(() => { this.NextTurn() }, HandSpeed + 500);
        }

        else this.NextTurn();
    }

    CardPlayed() {

        this.JustPlayed = true;
        
        if(this.PlayDeck.Top().Number == "Reverse") this.Direction *= -1;

        else if(this.PlayDeck.Top().Number == "Draw 2") this.CardsToDraw += 2;

        else if(this.PlayDeck.Top().Number == "Draw 4") this.CardsToDraw += 4;

    }

    CardDrawn() {

        this.JustPlayed = false;

        this.CardsToDraw = 0;
    }

    CurrentPlayer() { return this.Players[this.CurrentTurn] };

    RepeatNumber(NextTurn) {

        if(NextTurn == this.Players.length) return 0;

        else if(NextTurn == -1) return this.Players.length - 1;

        else return NextTurn;
    }

    NextPlayer() {

        var NextTurn = this.CurrentTurn + this.Direction;

        NextTurn = this.RepeatNumber(NextTurn);

        return this.Players[NextTurn];
    
    }

    PreviousPlayer() {

        var PreviousTurn = this.CurrentTurn - this.Direction;

        PreviousTurn = this.RepeatNumber(PreviousTurn);

        return this.Players[PreviousTurn];
    
    }

}