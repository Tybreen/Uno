class Button {

    constructor(X, Y, Width, Height, Color, Text) {

    
        this.Sprite = createSprite(X, Y, Width, Height);
        
        this.Sprite.shapeColor = Color;

        this.Sprite.onMouseReleased = function() {};

        this.Text = Text;
        
    }

    SetClickCallBack(Function) { this.Sprite.onMouseReleased = Function };

    Draw() {

        this.Sprite.update();

        fill(this.Sprite.shapeColor);
            
        rect(this.Sprite.position.x, this.Sprite.position.y, this.Sprite.width, this.Sprite.height, this.Sprite.width / 5);

        fill(0);

        textSize(20);

        text(this.Text, this.Sprite.position.x, this.Sprite.position.y);

        //text(this.Text, this.PlayerSelect.Buttons[i].Sprite.position.x, this.PlayerSelect.Buttons[i].Sprite.position.y + 20);

    }

    
}