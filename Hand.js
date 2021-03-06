class Hand {


    constructor() {

        this.Cards = [];

        this.MaxOffset = (60 / 700) * Math.min(windowWidth, windowHeight);
        this.MinOffset = (40 / 700) * Math.min(windowWidth, windowHeight);
        this.MaxSize = 1;

        this.Radius = (Math.min(width, height) / 3) - (Images.CardBack.height / 2) - 5;
        
        this.Sidelength = 2 * this.Radius * Math.sin(Math.PI / (Num_of_Human + Num_of_AI));

        this.TargetWidth = this.Sidelength;

        
    }

    Move(X, Y, Angle) {

        this.X = X;
        this.Y = Y;
        this.Angle = Angle - 90;

        this.RepositionCards(HandSpeed);
        
    }

    AddCard(Card, WillSort) {

        this.Cards.push(Card);

        if(WillSort) this.Sort(DrawSpeed);

        else if(!Players.GamePlaying) this.RepositionCards(DealSpeed);

        else this.RepositionCards(DrawSpeed);
    }

    Sort(Speed) {

        this.Cards.sort(Card.Compare);

        if(Speed == 0) this.RepositionCardsIM();

        else this.RepositionCards(Speed);
    }

    RepositionCards(Speed) {

        this.RecalculatePosition();

        for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].SmoothMove(this.CardX(i), this.CardY(i), this.Angle, this.CardSize, Speed) };
    }

    RepositionCardsIM() {

        this.RecalculatePosition();

        for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Move(this.CardX(i), this.CardY(i), this.Angle, this.CardSize) };
    }

    RecalculatePosition() {

        this.ActualWidth = this.CardOffset() * (this.Cards.length - 1);

        this.StartingX = this.X - (this.ActualWidth / 2) * cos(this.Angle);
        this.StartingY = this.Y - (this.ActualWidth / 2) * sin(this.Angle);

        this.CardSize = this.CardOffset() / this.MinOffset;

        if(this.CardSize > this.MaxSize) this.CardSize = this.MaxSize;

    }

    CardX(i) { return this.StartingX + this.CardOffset() * i * cos(this.Angle) };
    CardY(i) { return this.StartingY + this.CardOffset() * i * sin(this.Angle) };

    CardOffset() {
        
        var Offset = this.TargetWidth / (this.Cards.length - 1);

        return Math.min(Offset, this.MaxOffset);
    }

    Draw() {

        rectMode(CENTER);
        fill(0);
        noStroke();

        for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Draw() };
        for(var i = this.Cards.length - 1; i >= 0; i--) { this.Cards[i].Update() };

    }

    MoveUpPlayableCards(TopCard, JustPlayed) { for(var i = 0; i < this.Cards.length; i++) { if(this.Cards[i].Playable(TopCard, JustPlayed)) this.Cards[i].SmoothShift(0, -20, ShiftUpSpeed) } };

    Show() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Show() } };

    Hide() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Hide() } };

    SetUpPlayableCards(TopCard, PlayableCallBack, NotPlayableCallBack, JustPlayed) {

        var NumOfPlayableCards = 0;

        for(var i = 0; i < this.Cards.length; i++) {

            if(this.Cards[i].Playable(TopCard, JustPlayed)) {

                NumOfPlayableCards++;

                this.Cards[i].AddCallBack(PlayableCallBack);
            }

            else this.Cards[i].AddCallBack(NotPlayableCallBack);
        }
        // Make Something Happen when Card Clicked.

        return (NumOfPlayableCards != 0);
        
    }

    UnSetUpPlayableCards() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].RemoveCallBack() } };

    HasPlayableCards(TopCard, JustPlayed) {

        var NumOfPlayableCards = 0;

        for(var i = 0; i < this.Cards.length; i++) {

            if(this.Cards[i].Playable(TopCard, JustPlayed)) {

                NumOfPlayableCards++;
            }

        }

        return (NumOfPlayableCards != 0);
    }

    RemoveCard(Card) {
        this.position = this.Cards.indexOf(Card);
        this.Cards.splice(this.position, 1);
        this.RepositionCards(PlaySpeed);
    }

}