class AIPlayer extends Player {

    constructor(X, Y, DrawDeck, PlayDeck) {

        super(X, Y, DrawDeck, PlayDeck);

        this.DeBug = false;
    
    }

    Draw() {
        super.Draw();

        push()
        fill(0);
        textSize(30);
        translate(this.Hand.X, this.Hand.Y);
        rotate(this.Hand.Angle);
        if(!this.IsSkipped && this.MyTurn) text("Thinking...", 85, (Images.CardBack.height / 2) + 20);
        pop()
    }

    StartTurnPhase1(CardToDraw) {

        super.StartTurnPhase1(CardToDraw);

    }

    StartTurnPhase2() {

        super.StartTurnPhase2();

        if(this.DeBug) {
            this.Hand.Show();
            this.Hand.MoveUpPlayableCards(this.PlayDeck.Top());
        }

        this.PlayableCards = this.Hand.Cards.filter((Card) => Card.Playable(this.PlayDeck.Top()) );

        var ChooseCard = () => {
            if(this.PlayableCards.length == 0) this.DrawCardAndPlay();

            else {

                this.Draw2Card = this.PlayableCards.find((Card) => Card.Number == "Draw 2" );
                this.Draw4Card = this.PlayableCards.find((Card) => Card.Number == "Draw 4" );
                this.ReverseCard = this.PlayableCards.find((Card) => Card.Number == "Reverse" );
                this.SkipCard = this.PlayableCards.find((Card) => Card.Number == "Skip" );

                if(this.Owner.NextPlayer().Hand.Cards.length == 1) {

                    if(this.Draw2Card != undefined) this.PlayCard(this.Draw2Card);
                    else if(this.Draw4Card != undefined) this.PlayCard(this.Draw4Card);
                    else if(this.ReverseCard != undefined) this.PlayCard(this.ReverseCard);
                    else if(this.SkipCard != undefined && !this.Owner.NextPlayer().IsSkipped) this.PlayCard(this.SkipCard);

                    else this.PlayCard(random(this.PlayableCards));

                }

                else {

                    this.UnoPlayer = this.Owner.Players.find((Player) => Player.Hand.Cards.length == 1 && Player != this );

                    if(this.UnoPlayer != undefined && this.SkipCard != undefined && !this.UnoPlayer.IsSkipped) this.PlayCard(this.SkipCard);

                    else {

                        this.NumberCards = this.PlayableCards.filter((Card) => Card.Number.localeCompare("0") >= 0 && Card.Number.localeCompare("9") <= 0 && Card.Color != "Wild" );
                        this.PowerCards = this.PlayableCards.filter((Card) => Card.Number == "Skip" || Card.Number == "Reverse" || Card.Number == "Draw 2" );
                        this.WildCards = this.PlayableCards.filter((Card) => Card.Color == "Wild" );

                        if(this.NumberCards.length != 0) this.PlayCard(random(this.NumberCards));

                        else if(this.PowerCards.length != 0) this.PlayCard(random(this.PowerCards));

                        else if(this.WildCards.length != 0) this.PlayCard(random(this.WildCards));


                    }

                }
            }
        }

        setTimeout(ChooseCard, 1000);
    }

    StartTurnPhase3() {

        super.StartTurnPhase3();

        if(PlayDeck.Top().Number == "Skip" && !this.CheckingWon()) {

            if(this.Owner.NextPlayer().Hand.Cards.length == 1 && !this.Owner.NextPlayer().IsSkipped) this.Owner.NextPlayer().IsSkipped = true;

            else if(this.UnoPlayer != undefined && !this.UnoPlayer.IsSkipped) this.UnoPlayer.IsSkipped = true;

            else {

                var ChooseSmallestHand = (PreviousPlayer, CurrentPlayer) => {
                    if(PreviousPlayer.IsSkipped || PreviousPlayer == this) return CurrentPlayer;
                    else if(CurrentPlayer.IsSkipped || CurrentPlayer == this) return PreviousPlayer;
                    else if(PreviousPlayer.Hand.Cards.length > CurrentPlayer.Hand.Cards.length) return CurrentPlayer;
                    else return PreviousPlayer;
                }

                var TargetPlayer = this.Owner.Players.reduce(ChooseSmallestHand);

                TargetPlayer.IsSkipped = true;
            }

        }

        else if(PlayDeck.Top().Color == "Wild" && !this.CheckingWon()) {

            var Blue = this.Hand.Cards.filter((Card) => Card.Color == "blue" );
            var Green = this.Hand.Cards.filter((Card) => Card.Color == "green" );
            var Red = this.Hand.Cards.filter((Card) => Card.Color == "red" );
            var Yellow = this.Hand.Cards.filter((Card) => Card.Color == "yellow" );

            if(Blue.length >= Green.length && Blue.length >= Red.length && Blue.length >= Yellow.length) this.PlayDeck.Top().SelectedColor = "blue";
            else if(Green.length >= Blue.length && Green.length >= Red.length && Green.length >= Yellow.length) this.PlayDeck.Top().SelectedColor = "green";
            else if(Red.length >= Blue.length && Red.length >= Green.length && Red.length >= Yellow.length) this.PlayDeck.Top().SelectedColor = "red";
            else this.PlayDeck.Top().SelectedColor = "yellow";

        }


        this.EndTurn();
    }

}