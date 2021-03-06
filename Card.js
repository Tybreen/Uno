class Card {

    constructor(Color, Number) {

        this.Sprite = createSprite(0, 0, 200, 200);

        this.Sprite.addImage("Front", Images.CardFront(Color, Number));
        this.Sprite.addImage("Back", Images.CardBack);

        this.Color = Color;
        this.Number = Number;
        this.SelectedColor = "";

        this.TotalTime = 0;
        this.CurrentTime = 0;

        this.StartingX = 0;
        this.StartingY = 0;
        this.EndingX = 0;
        this.EndingY = 0;

    }

    Draw() {

        if(this.CurrentTime < this.TotalTime) {

            this.CurrentTime += deltaTime;

            if(this.CurrentTime > this.TotalTime) this.CurrentTime = this.TotalTime;

            var DT = this.CurrentTime / this.TotalTime;

            this.Sprite.position.x = this.StartingX  + this.ShiftX * DT;
            this.Sprite.position.y = this.StartingY  + this.ShiftY * DT;
            this.Sprite.rotation = this.StartingAngle  + this.ShiftAngle * DT;
            this.Sprite.scale = this.StartingSize  + this.ShiftSize * DT;
        }

        fill(this.DrawingColor());

        noStroke();

        if(this.Color == "Wild" && this.SelectedColor != "") rect(this.Sprite.position.x, this.Sprite.position.y, this.Sprite.width + 10, this.Sprite.height + 10);

        this.Sprite.display();
    }

    Update() { this.Sprite.update() };

    Move(X, Y, Angle, Size) {
        this.TotalTime = 0;
        this.CurrentTime = 0;

        this.Sprite.position.x = X;
        this.Sprite.position.y = Y;
        this.Sprite.rotation = Angle;
        this.Sprite.scale = Size;
    }

    Resize(Scale) { this.Sprite.scale = Scale };

    SmoothMove(X, Y, Angle, Size, Time) {
        this.StartingX = this.Sprite.position.x;
        this.StartingY = this.Sprite.position.y;
        this.StartingAngle = this.Sprite.rotation;
        this.StartingSize = this.Sprite.scale;
        this.ShiftX = X - this.StartingX;
        this.ShiftY = Y - this.StartingY;
        this.ShiftAngle = Angle - this.StartingAngle;
        this.ShiftSize = Size - this.StartingSize;
        this.TotalTime = Time;
        this.CurrentTime = 0;
    }

    SmoothShift(X, Y, Time) { this.SmoothMove(this.Sprite.position.x + X, this.Sprite.position.y + Y, this.Sprite.rotation, this.Sprite.scale, Time) };

    Show() { this.Sprite.changeImage("Front") };

    Hide() { this.Sprite.changeImage("Back") };

    IsExactMatch(TopCard, JustPlayed) { return Dirty_Uno && JustPlayed && TopCard.Number == this.Number && TopCard.Color == this.Color && !(TopCard.Number.localeCompare("9") == 1 || TopCard.Color == "Wild" || TopCard.Number == "0") }

    static Compare(Card1, Card2) {

        if(Card1.Color < Card2.Color) return -1;

        else if(Card1.Color > Card2.Color) return 1;

        else return Card1.Number.localeCompare(Card2.Number);
    }

    Playable(TopCard, JustPlayed) {

        if(Dirty_Uno && JustPlayed && (TopCard.Number == "Draw 2" || TopCard.Number == "Draw 4")) return TopCard.Number == this.Number;

        else if(this.Color == "Wild") return true;

        else if(TopCard.Color == "Wild") return TopCard.SelectedColor == this.Color;

        else return TopCard.Color == this.Color || TopCard.Number == this.Number;
    }

    DrawingColor() {
        if(this.SelectedColor == "blue") return "#4287f5";
        else if(this.SelectedColor == "green") return "#66CC00";
        else if(this.SelectedColor == "red") return "#CC0000";
        else return "#FFCC33";
    }

    AddCallBack(PlayerCallBack) {
        var TheCard = this;
        this.Sprite.onMouseReleased = function() { PlayerCallBack(TheCard) };
    }
    
    RemoveCallBack() { this.Sprite.onMouseReleased = function() {} };
}