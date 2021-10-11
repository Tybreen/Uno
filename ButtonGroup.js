class ButtonGroup {

    constructor(Pair) {

        this.Buttons = [];

        this.BaseWidth = 100;

        this.XSpace = (width - Pair.length * this.BaseWidth) / (Pair.length + 1);

        for(var i = 0; i < Pair.length; i++) {

            this.XButton = this.XSpace * (i +1) + (this.BaseWidth * i) + this.BaseWidth / 2;

            this.Buttons.push(new Button(this.XButton, height / 2, this.BaseWidth, 100, Pair[i][0], Pair[i][1]) );
        }

    }

    Draw() {

        fill(0, 80);
        rect(width / 2, height / 2, width, height);

        for(var i = 0; i < this.Buttons.length; i++) { this.Buttons[i].Draw() }
    }

    SetClickCallBacks(Function) { for(var i = 0; i < this.Buttons.length; i++) { var fun = (I) => { this.Buttons[i].SetClickCallBack( () => { Function(I) }) }; fun(i) } };

}