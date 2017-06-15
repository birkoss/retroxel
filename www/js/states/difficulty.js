var GAME = GAME || {};

GAME.Difficulty = function() {};

GAME.Difficulty.prototype = new AnimatedState();

GAME.Difficulty.prototype.preload = function() {
    this.load.json("data:puzzles", "data/puzzles.json");
    this.load.json("data:difficulties", "data/" + GAME.config.puzzleName + ".json");
};

GAME.Difficulty.prototype.create = function() {
    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.cache.getJSON("data:puzzles").forEach(function(puzzle) {
        if (GAME.config.puzzleName == puzzle.id) {
            this.panel.createTitle(puzzle.name);
        }
    }, this);

    let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.onBtnBackClicked, this);
    this.panel.addButton(button);

    /* Create the puzzles list */
    this.buttonsContainer = this.game.add.group();
    this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

    let colors = {
        Easy:"",
        Medium:"Green",
        Hard:"Red"
    };
    this.cache.getJSON("data:difficulties").forEach(function(difficulty) {
        let button = new PanelButton(this.game, difficulty.name, colors[difficulty.name]);
        button.difficulty = difficulty.name;
        button.y = (this.buttonsContainer.height > 0 ? this.buttonsContainer.height + 36 : 0);
        button.x = (this.game.width - button.width)/2;
        button.onClicked.add(this.onBtnDifficultyClicked, this);
        this.buttonsContainer.addChild(button);
    }, this);

    this.buttonsContainer.y = (this.game.height - this.buttonsContainer.height) / 2;


    /* Prepare the animations */
    this.containers.push(this.panelContainer);
    this.containers.push(this.buttonsContainer);

    this.show();
};

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
    this.hide(this.loadLevels, this);
};
