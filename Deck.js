class Deck {


    constructor(X, Y) {

        this.Cards = [];

        this.X = X;
        this.Y = Y;

    }

    Draw() {
        if(this.Top() != undefined) {
            this.Top().Draw();
            this.Top().Update();
        }
    }

    Move() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Move(this.X, this.Y, 0, 1) } };

    Show() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Show() } };

    Hide() { for(var i = 0; i < this.Cards.length; i++) { this.Cards[i].Hide() } };

    AddAllCards(Colors, Numbers) {

        for(var i = 0; i < Colors.length; i++) {

            for(var j = 0; j < Numbers.length; j++) {

                this.Cards.push(new Card(Colors[i], Numbers[j]));

                if(j != 0) this.Cards.push(new Card(Colors[i], Numbers[j]));
            }

        }

        for(var i = 0; i < 4; i++) {
            this.Cards.push(new Card("Wild", "0"));
            this.Cards.push(new Card("Wild", "Draw 4"));
            
        }

        /*for(var i = 0; i < 10; i++) {
            this.Cards.push(new Card("red", "9"));
            this.Cards.push(new Card("Wild", "0"));
            this.Cards.push(new Card("red", "0"));
            this.Cards.push(new Card("red", "Skip"));
            this.Cards.push(new Card("red", "Reverse"));
        }*/

        this.Move();
    }

    AddCallBack(PlayerCallBack) { this.Top().AddCallBack(PlayerCallBack) };

    Shuffle() { shuffle(this.Cards, true) };

    Pop() { return this.Cards.pop() };

    Top() { return this.Cards[this.Cards.length - 1] };

    SecondToTop() { return this.Cards[this.Cards.length - 2] };

    Push(Card) {
        this.Cards.push(Card);
    }

}