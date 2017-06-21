var GAME = GAME || {};

GAME.Main = function() {};

GAME.Main.prototype = new AnimatedState();

GAME.Main.prototype.create = function() {
    /* Create the title */
    this.titleContainer = this.game.add.group();
    this.titleContainer.animation = AnimatedState.Animation.SlideDown;

    let text = this.game.add.bitmapText(0, 0, "font:gui", "Retroxel", 30);
    text.y = (this.game.height/4) - text.height/2;
    text.x = (this.game.width - text.width) / 2;
    this.titleContainer.addChild(text);

    /* Create the buttons */
    this.buttonsContainer = this.game.add.group();
    this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

    let button = new PanelButton(this.game, __("Play"), "", {width:200, height:60});
    button.y = (this.game.height/4*2) - button.height/2;
    button.x = (this.game.width - button.width)/2;
    button.onClicked.add(this.loadPuzzles, this);
    this.buttonsContainer.addChild(button);

    /* Create the navigator */
    this.navigatorContainer = this.game.add.group();
    this.navigatorContainer.animation = AnimatedState.Animation.SlideUp;

    this.navigator = new Panel(this.game, AnimatedState.Dimension.Navigator.height);
    this.navigatorContainer.addChild(this.navigator);

    button = new PanelButton(this.game, "!", "Green", AnimatedState.Dimension.Navigator);
    button.onClicked.add(this.onBtnOptionsClicked, this);
    this.navigator.addButton(button);

    this.navigatorContainer.y = this.game.height - this.navigatorContainer.height;

    /* Prepare the animations */
    this.containers.push(this.titleContainer);
    this.containers.push(this.buttonsContainer);
    this.containers.push(this.navigatorContainer);

    this.show();
};

GAME.Main.prototype.loadPuzzles = function() {
    this.hide(this.stateLoadPuzzles, this);
};

GAME.Main.prototype.stateLoadPuzzles = function() {
    this.state.start('ChoosePuzzle');
};

GAME.Main.prototype.onBtnOptionsClicked = function(button) {
    this.state.start("Options");
};
