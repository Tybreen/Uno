class PlayerSet {


    constructor(PlayDeck, ...Players) {

        this.Players = Players;
        this.CurrentTurn = 0;
        this.PlayDeck = PlayDeck;
        this.InitialCards = 7;
        this.Direction = 1;
        this.Reverse = false;
        this.CardsToDraw = 0;

        this.TurnStarted = false;
        
        this.RepositionHand();

    }

    RepositionHand() {

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

    DealCards() { for(var i = 0; i < this.InitialCards; i++) { for(var j = 0; j < this.Players.length; j++) { var fun = (I, J) => { setTimeout( () => { this.Players[J].DrawCard(false) }, DealInterval * (I * this.Players.length + J)) }; fun(i, j) } } };

    AddCardsToAll(Card) { for(var i = 0; i < this.Players.length; i++) { this.Players[i].AddCard(Card) } };

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
            rotate(this.Theta + this.StartingAngle);
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

        this.TurnStarted = true;

        this.CurrentTurn += this.Direction;

        if(this.CurrentTurn >= this.Players.length) this.CurrentTurn = 0;

        else if(this.CurrentTurn == -1) this.CurrentTurn = this.Players.length - 1;

        this.RepositionHand();

        setTimeout(() => { this.Players[this.CurrentTurn].StartTurnPhase1(this.CardsToDraw) }, HandSpeed + 50);
        
    }

    TurnEnded() { this.TurnStarted = false };

    CardPlayed() {

        if(this.PlayDeck.Top().Number == "Reverse") this.Direction *= -1;

        else if(this.PlayDeck.Top().Number == "Draw 2") this.CardsToDraw += 2;

        else if(this.PlayDeck.Top().Number == "Draw 4") this.CardsToDraw += 4;

    }

    CardDrawn() {

        this.CardsToDraw = 0;
    }

    CurrentPlayer() { return this.Players[this.CurrentTurn] };

    NextPlayer() {

        var NextTurn = this.CurrentTurn + this.Direction;

        if(NextTurn == this.Players.length) NextTurn = 0;

        else if(NextTurn == -1) NextTurn = this.Players.length - 1;

        return this.Players[NextTurn];
    
    }

}