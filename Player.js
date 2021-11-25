class Player {


    constructor(DrawDeck, PlayDeck) {

        this.Hand = new Hand();

        this.DrawDeck = DrawDeck;
        this.PlayDeck = PlayDeck;

        this.MyTurn = false;

        this.IsSkipped = false;

        this.CurrentPhase = 0;

        this.NumOfDrawed = 0;
        this.NumOfPlayed = 0;
    }


    SetOwner(Owner, PlayerNum) {
        this.Owner = Owner;
        this.PlayerNum = PlayerNum;
    }

    Move(X, Y, Angle) { this.Hand.Move(X, Y, Angle) };

    DrawCard(WillSort) {

        var DrawnCard = this.DrawDeck.Pop();

        if(DrawDeck.Cards.length == 0) {

            DrawDeck.Cards = PlayDeck.Cards.splice(0, PlayDeck.Cards.length - 1);
            DrawDeck.Hide();
            DrawDeck.Shuffle();
            DrawDeck.Move();

            for(const Card of DrawDeck.Cards) { Card.SelectedColor = "" };
        }

        this.Hand.AddCard(DrawnCard, WillSort);

        this.Owner.CardDrawn();

        this.NumOfDrawed++;

        return DrawnCard;
    }

    PlayCard(Card) {
        this.PlayDeck.Push(Card);
        Card.Show();
        Card.SmoothMove(this.PlayDeck.X, this.PlayDeck.Y, 0, 1, PlaySpeed);
        this.Hand.UnSetUpPlayableCards();
        this.Hand.RemoveCard(Card);
        this.Owner.CardPlayed();
        this.NumOfPlayed++;
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

        var DrawnCard = this.DrawCard(Dirty_Uno && this instanceof HumanPlayer);

        if(DrawnCard.Playable(PlayDeck.Top(), this.Owner.JustPlayed)) setTimeout( () => this.StartTurnPhase2(), DrawInterval);

        else if(!Dirty_Uno) this.EndTurn();

        else setTimeout( () => this.DrawCardAndPlay(), DrawInterval);

        if(Dirty_Uno && this instanceof HumanPlayer) setTimeout( () => DrawnCard.Show(), DrawSpeed);
    }


    StartTurnPhase1(CardsToDraw) {

        this.CurrentPhase = 1;

        if(!this.IsSkipped) {

            this.MyTurn = true;

            var WillDrawCards = (!Dirty_Uno || !this.Hand.HasPlayableCards(PlayDeck.Top(), this.Owner.JustPlayed)) && CardsToDraw > 0;

            if(WillDrawCards) for(var i = 0; i < CardsToDraw; i++) { setTimeout(() => this.DrawCard(false), DrawInterval * i) };

            var WaitTime;

            if(!WillDrawCards) WaitTime = 50;

            else WaitTime = DrawSpeed * CardsToDraw + 50;

            setTimeout(() => { if(!WillDrawCards) this.StartTurnPhase2(); else this.EndTurn() }, WaitTime);

        }

        else this.EndTurn();

        this.IsSkipped = false;
    }

    StartTurnPhase2() {
        this.CurrentPhase = 2;
        this.Hand.Sort(0);
    }

    StartTurnPhase3() { this.CurrentPhase = 3 };

    EndTurn() {
        this.Hand.UnSetUpPlayableCards();
        this.Hand.Hide();
        this.MyTurn = false;
        setTimeout(() => { this.Owner.TurnEnded() }, PlaySpeed + 50);
    }

    CheckingWon() { return this.Hand.Cards.length == 0 };


}



