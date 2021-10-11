class Player {


    constructor(DrawDeck, PlayDeck) {

        this.Hand = new Hand();

        this.DrawDeck = DrawDeck;
        this.PlayDeck = PlayDeck;

        this.MyTurn = false;

        this.IsSkipped = false;

        this.CurrentPhase = 0;
    }


    SetOwner(Owner, PlayerNum) {
        this.Owner = Owner;
        this.PlayerNum = PlayerNum;
    }

    Move(X, Y, Angle) { this.Hand.Move(X, Y, Angle) };

    AddCard(Card) { this.Hand.AddCard(Card, true) };

    DrawCard(WillSort) {

        var DrawnCard = this.DrawDeck.Pop();
        
        this.Hand.AddCard(DrawnCard, WillSort);

        this.Owner.CardDrawn();

        return DrawnCard;
    }

    PlayCard(Card) {
        this.PlayDeck.Push(Card);
        Card.Show();
        Card.SmoothMove(this.PlayDeck.X, this.PlayDeck.Y, 0, 1, PlaySpeed);
        this.Hand.UnSetUpPlayableCards();
        this.Hand.RemoveCard(Card);
        //this.Hand.Hide();
        this.Owner.CardPlayed();
        this.StartTurnPhase3();
    }

    Draw() {
        this.Hand.Draw();

        push()
        fill(0);
        textSize(30);
        translate(this.Hand.X, this.Hand.Y);
        rotate(this.Hand.Angle);
        if(this.IsSkipped) text("Skipped", 70, (Images.CardBack.height / 2) + 20);
        text(this.PlayerNum + 1, 0, (Images.CardBack.height / 2) + 20);
        pop()
    }

    DrawUI() {};

    DrawCardAndPlay() {

        var DrawnCard = this.DrawCard(false);

        if(DrawnCard.Playable(PlayDeck.Top())) setTimeout( () => this.StartTurnPhase2(), DrawSpeed);

        else this.EndTurn();
    }


    StartTurnPhase1(CardsToDraw) {

        this.CurrentPhase = 1;

        if(!this.IsSkipped) {

            this.MyTurn = true;

            for(var i = 0; i < CardsToDraw; i++) { setTimeout(() => this.DrawCard(false), DrawSpeed * i) };

            setTimeout(() => { if(CardsToDraw == 0) this.StartTurnPhase2(); else this.EndTurn() }, DrawSpeed * CardsToDraw);

        }

        else this.EndTurn();

        this.IsSkipped = false;
    }

    StartTurnPhase2() { this.CurrentPhase = 2 };

    StartTurnPhase3() { this.CurrentPhase = 3 };

    EndTurn() {
        this.Hand.UnSetUpPlayableCards();
        this.Hand.Hide();
        this.MyTurn = false;
        setTimeout(() => { this.Owner.TurnEnded() }, DrawSpeed + 50);
    }

    CheckingWon() { return this.Hand.Cards.length == 0 };


}



