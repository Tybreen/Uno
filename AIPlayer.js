class AIPlayer extends Player {

    constructor(X, Y, DrawDeck, PlayDeck) {

        super(X, Y, DrawDeck, PlayDeck);

        this.DeBug = false;

        this.Delay = 1000;
    
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
            this.Hand.MoveUpPlayableCards(this.PlayDeck.Top(), this.Owner.JustPlayed);
        }

        this.PlayableCards = this.Hand.Cards.filter((Card) => Card.Playable(this.PlayDeck.Top(), this.Owner.JustPlayed) );

        var ChooseCard = () => {
            if(this.PlayableCards.length == 0) this.DrawCardAndPlay();

            else {

                this.NormalCards = this.PlayableCards.filter((Card) => Card.Number.localeCompare("1") == 1 && Card.Number.localeCompare("9") != 1);
                console.log(this.NormalCards);
                this.Draw2Card = this.PlayableCards.find((Card) => Card.Number == "Draw 2" );
                this.WildCard = this.PlayableCards.find((Card) => Card.Color == "Wild" && Card.Number == "0");
                this.Wild4Card = this.PlayableCards.find((Card) => Card.Color == "Wild" && Card.Number == "Draw 4" );
                this.ReverseCard = this.PlayableCards.find((Card) => Card.Number == "Reverse" );
                this.SkipCard = this.PlayableCards.find((Card) => Card.Number == "Skip" );
                this.OCard = this.PlayableCards.find((Card) => Card.Number == "0" && Card.Color != "Wild" );
                this.ExactCard = this.PlayableCards.find((Card) => Card.IsExactMatch(this.PlayDeck.Top(), this.Owner.JustPlayed));

                if(!Dirty_Uno) {

                    this.UnoPlayer = this.Owner.Players.find((Player) => Player.Hand.Cards.length == 1 && Player != this );

                    if(this.Owner.NextPlayer().Hand.Cards.length == 1) this.PrioritizePlay(this.Draw2Card, this.Wild4Card, this.ReverseCard, this.SkipCard, random(this.NormalCards), this.OCard, this.WildCard);

                    else if(this.UnoPlayer != undefined) this.PrioritizePlay(this.SkipCard, random(this.NormalCards), this.OCard, this.ReverseCard, this.Draw2Card, this.WildCard, this.Wild4Card);

                    else this.PrioritizePlay(random(this.NormalCards), this.OCard, this.ReverseCard, this.SkipCard, this.Draw2Card, this.WildCard, this.Wild4Card);

                }

                else if(Dirty_Uno) {

                    this.UnoPlayer = this.Owner.Players.find((Player) => Player.Hand.Cards.length == 1 && Player != this );

                    if(this.Owner.JustPlayed && (this.PlayDeck.Cards.Top().Number == "Draw 2" || this.PlayDeck.Cards.Top().Number == "Draw 4")) this.PrioritizePlay(this.PlayableCards);

                    else if(this.Owner.NextPlayer().Hand.Cards.length == 1) this.PrioritizePlay(this.Draw2Card, this.Wild4Card, this.ReverseCard, this.SkipCard, this.ExactCard, random(this.NormalCards), this.WildCard, this.OCard);

                    else if(this.UnoPlayer != undefined) this.PrioritizePlay(this.SkipCard, this.ExactCard, random(this.NormalCards), this.ReverseCard, this.Draw2Card, this.WildCard, this.Wild4Card, this.OCard);

                    else if(this.Owner.PreviousPlayer().Hand.Cards.length == 1 || this.Hand.Cards.length > this.Owner.PreviousPlayer().Hand.Cards.length - 2) this.PrioritizePlay(this.OCard, this.ExactCard, random(this.NormalCards), this.ReverseCard, this.Draw2Card, this.SkipCard, this.WildCard, this.Wild4Card);

                    else this.PrioritizePlay(this.ExactCard, random(this.NormalCards), this.ReverseCard, this.SkipCard, this.Draw2Card, this.WildCard, this.Wild4Card, this.OCard);
                }

                
            }
        }

        setTimeout(ChooseCard, this.Delay);
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

    PrioritizePlay(...Cards) {

        for(const Card of Cards) {

            if(Card != undefined) {
                this.PlayCard(Card);
                return true;
            }
        }

        return false;

    }

}