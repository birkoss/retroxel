var GAME = GAME || {};

GAME.Difficulty = function() {};

GAME.Difficulty.prototype = new AnimatedState();

GAME.Difficulty.prototype.create = function() {
    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game, "Puzzle");
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle(GAME.config.puzzleName);

    let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.onBtnBackClicked, this);
    this.panel.addButton(button);

    /* Create the puzzles list */
    this.buttonsContainer = this.game.add.group();
    this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

    let difficulties = [
    {label:"Easy", color:""},
    {label:"Medium", color:"Green"},
    {label:"Hard", color:"Red"}
    ];
    difficulties.forEach(function(difficulty) {
        let button = new PanelButton(this.game, difficulty.label, difficulty.color);
        button.difficulty = difficulty.label;
        button.y = (this.game.height/4*2) - button.height/2 + (this.buttonsContainer.height > 0 ? this.buttonsContainer.height + 36 : 0);
        button.x = (this.game.width - button.width)/2;
        button.onClicked.add(this.onBtnDifficultyClicked, this);
        this.buttonsContainer.addChild(button);
    }, this);


    /* Prepare the animations */
    this.containers.push(this.panelContainer);
    this.containers.push(this.buttonsContainer);

    this.show();
};
/*
    show: function() {
        this.game.add.tween(this.titleContainer).to({x:this.titleContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
        this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
    },
    hide: function(callback, context) {
        this.game.add.tween(this.titleContainer).to({x:this.titleContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        let tween = this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        tween.onComplete.add(callback, context);
    },
    */

/* Load states */

GAME.Difficulty.prototype.loadLevels = function() {
    this.state.start("Level");
};

GAME.Difficulty.prototype.loadPuzzles = function() {
    this.state.start("Puzzle");
};

/* Events */

GAME.Difficulty.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadPuzzles, this);
};

GAME.Difficulty.prototype.onBtnDifficultyClicked = function(button) {
    GAME.config.puzzleDifficulty = button.difficulty;
    this.hide(this.loadPuzzles, this);
};
