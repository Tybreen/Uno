function SetupEndingScreen() {

    RestartButton = createButton("Restart");
    RestartButton.style('font-size', '25px');
    RestartButton.size(200, 100);
    RestartButton.position((width / 4) - RestartButton.size().width / 2, (height / 2) - (RestartButton.size().height / 2) + (height / 4));
    RestartButton.hide();
    RestartButton.mousePressed(() => {
        RestartButton.remove();
        MainMenuButton.remove();
        mgr.showScene(Game);
    })

    MainMenuButton = createButton("Main Menu");
    MainMenuButton.style('font-size', '25px');
    MainMenuButton.size(200, 100);
    MainMenuButton.position(((width / 4) + (width / 2)) - MainMenuButton.size().width / 2, (height / 2) - (MainMenuButton.size().height / 2) + (height / 4));
    MainMenuButton.hide();
    MainMenuButton.mousePressed(() => {
        RestartButton.remove();
        MainMenuButton.remove();
        mgr.showScene(MainMenu);
    })


}

function DrawEndingScreen() {

    fill(0, 150);
    rect(width / 2, height / 2, width, height);

    textSize(50);
    fill(255);
    textLeading(50);

    text("Player " + (Players.CurrentPlayer().PlayerNum + 1) + " Won!", width / 2, height / 6);

    textSize(20);
    textAlign(LEFT);

    text("Player " + (Players.CurrentPlayer().PlayerNum + 1) + " Drew " + Players.CurrentPlayer().NumOfDrawed + " Cards.\nPlayer " + (Players.CurrentPlayer().PlayerNum + 1) + " Played " + Players.CurrentPlayer().NumOfPlayed + " Cards.", width / 10, height / 3);

    textAlign(CENTER);

    RestartButton.show();
    MainMenuButton.show();

}