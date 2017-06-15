var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = new AnimatedState();

GAME.Level.prototype.preload = function() {
    this.load.json("data:puzzle", "data/" + GAME.config.puzzleName + "_" + GAME.config.puzzleDifficulty + ".json");
};

GAME.Level.prototype.create = function() {
    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle(GAME.config.puzzleDifficulty);

    let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.onBtnBackClicked, this);
    this.panel.addButton(button);

    /* Create the navigator */
    this.navigatorContainer = this.game.add.group();
    this.navigatorContainer.animation = AnimatedState.Animation.SlideUp;

    this.navigator = new Panel(this.game, AnimatedState.Dimension.Navigator.height);
    this.navigatorContainer.addChild(this.navigator);
    this.navigator.createTitle("1 / 2");

    this.previousButton = new PanelButton(this.game, "<", "Green", AnimatedState.Dimension.Navigator);
    this.previousButton.direction = -1;
    this.previousButton.onClicked.add(this.onBtnNavigatorClicked, this);
    this.navigator.addButton(this.previousButton);

    this.nextButton = new PanelButton(this.game, ">", "Green", AnimatedState.Dimension.Navigator);
    this.nextButton.direction = 1;
    this.nextButton.onClicked.add(this.onBtnNavigatorClicked, this);
    this.navigator.addButton(this.nextButton);

    this.navigatorContainer.y = this.game.height - this.navigatorContainer.height;

    /* Create the levels */
    this.levelsContainer = this.game.add.group();
    this.levelsContainer.animation = AnimatedState.Animation.SlideRight;
    this.page = 0;
    this.limit = 20;
    this.createLevels();
    this.levelsContainer.x = (this.game.width - this.levelsContainer.width) / 2;
    this.levelsContainer.y = (this.game.height - this.levelsContainer.height) / 2;

    /* Prepare the animations */
    this.containers.push(this.panelContainer);
    this.containers.push(this.levelsContainer);
    this.containers.push(this.navigatorContainer);

    this.show();
};

GAME.Level.prototype.createLevels = function() {
    let puzzleTotal = this.cache.getJSON("data:puzzle").length;

    this.navigator.setTitle((this.page+1) + " / " + (puzzleTotal/this.limit));
    this.levelsContainer.removeAll(true);

    let padding = 16;
    let index = (this.page * this.limit);
    for (let y=0; y<5; y++) {
        for (let x=0; x<4; x++) {
            let button = new PanelButton(this.game, ++index, "", AnimatedState.Dimension.Panel);
            if (GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].indexOf(index) == -1) {
                button.disable();
            } else {
                button.onClicked.add(this.onBtnLevelClicked, this);
            }
            button.level = index;
            button.x = x * (button.width + (padding/2));
            button.y = y * (button.height + (padding/2));
            this.levelsContainer.addChild(button);
        }
    }

    if (this.page == 0) {
        this.previousButton.disable();
    } else {
        this.previousButton.enable();
    }

    if ((this.page * this.limit) + this.limit >= puzzleTotal) {
        this.nextButton.disable();
    } else {
        this.nextButton.enable();
    }
};

/* Load states */

GAME.Level.prototype.loadGame = function() {
    this.state.start("Game");
};

GAME.Level.prototype.loadDifficulties = function() {
    this.state.start("Difficulty");
};

/* Events */

GAME.Level.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadDifficulties, this);
};

GAME.Level.prototype.onBtnLevelClicked = function(button) {
    GAME.config.puzzleLevel = button.level;
    this.hide(this.loadGame, this);
};

GAME.Level.prototype.onBtnNavigatorClicked = function(button) {
    this.page += button.direction;
    this.createLevels();
};
