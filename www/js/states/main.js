var GAME = GAME || {};

GAME.Main = function() {};

GAME.Difficulty.prototype = new AnimatedState();

GAME.Main.prototype.create = function() {
    /* Create the title */
    this.titleContainer = this.game.add.group();
    this.titleContainer.animation = AnimatedState.Animation.SlideDown;

    let text = this.game.add.bitmapText(0, 0, "font:gui", "[NAME HERE]", 30);
    text.y = (this.game.height/4) - text.height/2;
    text.x = (this.game.width - text.width) / 2;
    this.titleContainer.addChild(text);

    /* Create the buttons */
    this.buttonsContainer = this.game.add.group();
    this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

    let button = new PanelButton(this.game, "Play");
    button.y = (this.game.height/4*2) - button.height/2;
    button.x = (this.game.width - button.width)/2;
    button.onClicked.add(this.loadPuzzles, this);
    this.buttonsContainer.addChild(button);

    /* Prepare the animations */
    this.containers.push(this.titleContainer);
    this.containers.push(this.buttonsContainer);

    this.show();
};

GAME.Main.prototype.loadPuzzles = function() {
    this.hide(this.stateLoadPuzzles, this);
};

GAME.Main.prototype.stateLoadPuzzles = function() {
    this.state.start('Difficulty');
};
