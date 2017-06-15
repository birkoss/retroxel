var GAME = GAME || {};

GAME.Puzzle = function() {
    console.log("GP");
};

GAME.Puzzle.prototype = new AnimatedState();

GAME.Puzzle.prototype.preload = function() {
        this.load.json("data:puzzles", "data/puzzles.json");
};

GAME.Puzzle.prototype.create = function() {

        /* Create the panel */
        this.panelContainer = this.game.add.group();
        this.panelContainer.animation = AnimatedState.Animation.SlideDown;

        this.panel = new Panel(this.game);
        this.panelContainer.addChild(this.panel);
        this.panel.createTitle("Puzzle");
        
        let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
        button.onClicked.add(this.onBtnBackClicked, this);
        this.panel.addButton(button);

        /* Create the puzzles list */
        this.buttonsContainer = this.game.add.group();
        this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

        this.cache.getJSON("data:puzzles").forEach(function(puzzle) {
            let button = new PanelButton(this.game, puzzle.name, "", {width:200, height:40});
            button.puzzle = puzzle.id;
            button.y = (this.game.height/4*2) - button.height/2 + (this.buttonsContainer.height > 0 ? this.buttonsContainer.height + 36 : 0);
            button.x = (this.game.width - button.width)/2;
            button.onClicked.add(this.onBtnPuzzleClicked, this);
            this.buttonsContainer.addChild(button);
        }, this);

        /* Prepare the animations */
        this.containers.push(this.panelContainer);
        this.containers.push(this.buttonsContainer);

        this.show();
};

/* Load states */

GAME.Puzzle.prototype.loadMain = function() {
    this.state.start("Main");
};

GAME.Puzzle.prototype.loadDifficulties = function() {
    this.state.start("Difficulty");
};

/* Events */

GAME.Puzzle.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadMain, this);
};
GAME.Puzzle.prototype.onBtnPuzzleClicked = function(button) {
    GAME.config.puzzleName = button.puzzle;
    this.hide(this.loadDifficulties, this);
};
