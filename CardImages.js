class CardImages {

    constructor(Colors, Ranks) {

        this.Images = {};

        this.CardWidth = (90 / 700) * Math.min(windowWidth, windowHeight);

        for(var i = 0; i < Colors.length; i++) {

            this.Images[Colors[i]] = {};

            for(var j = 0; j < Ranks.length; j++) {

                var FileName = "Deck/" +  Colors[i] + "_" + Ranks[j] + ".png";

                this.Images[Colors[i]][Ranks[j]] = loadImage(FileName, (Image) => { Image.resize(this.CardWidth, 0) });
            }
        }

        this.Images["Wild"] = {};

        this.Images["Wild"]["0"] = loadImage("Deck/Wild_0.png", (Image) => { Image.resize(this.CardWidth, 0) });
        this.Images["Wild"]["Draw 4"] = loadImage("Deck/Wild_Draw 4.png", (Image) => { Image.resize(this.CardWidth, 0) });
        
        this.CardBack = loadImage("Deck/Card Back.png", (Image) => { Image.resize(this.CardWidth, 0) });

    }

    CardFront(Color, Number) { return this.Images[Color][Number] };

    ResizeCards(Size) {

        
    }
    
}



