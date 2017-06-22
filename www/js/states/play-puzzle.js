var GAME = GAME || {};

GAME.PlayPuzzle = function() {};

GAME.PlayPuzzle.prototype = new AnimatedState();

GAME.PlayPuzzle.prototype.preload = function() {
    this.load.json("data:puzzle", "data/" + GAME.config.puzzleName + "_" + GAME.config.puzzleDifficulty + ".json");
};

GAME.PlayPuzzle.prototype.create = function() {
    this.game.stage.backgroundColor = 0x333333;

    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle("# " + GAME.config.puzzleUid);

    let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.popupConfirm, this);
    this.panel.addButton(button);

    button = new PanelButton(this.game, "R", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.popupRestart, this);
    this.panel.addButton(button);

    /* Create the navigator */
    this.navigatorContainer = this.game.add.group();
    this.navigatorContainer.animation = AnimatedState.Animation.SlideUp;

    this.navigator = new Panel(this.game, AnimatedState.Dimension.Navigator.height);
    this.navigatorContainer.addChild(this.navigator);

    button = new PanelButton(this.game, "?", "Green", AnimatedState.Dimension.Navigator);
    button.onClicked.add(this.popupHelp, this);
    this.navigator.addButton(button);
    this.navigatorContainer.y = this.game.height - this.navigatorContainer.height;

    /* Create the grid */
    this.gridContainer = this.game.add.group();
    this.gridContainer.animation = AnimatedState.Animation.SlideRight;
    this.createGrid();

    /* Prepare the animations */
    this.containers.push(this.panelContainer);
    this.containers.push(this.navigatorContainer);
    this.containers.push(this.gridContainer);

    this.show();
};

GAME.PlayPuzzle.prototype.createGrid = function() {
    this.puzzle = new PUZZLE[GAME.config.puzzleName]();

    let puzzleData = this.cache.getJSON("data:puzzle").filter(function(puzzle) {
        return puzzle.uid == this.puzzleUid;
    }, this)[0];
    this.puzzle.init(puzzleData);

    this.grid = new Grid(this.game, puzzleData);
    this.gridContainer.addChild(this.grid);

    this.puzzle.create(puzzleData, this.grid);
    this.puzzle.onCompleted.add(this.popupGameOver, this);

    /* Center the grid on the screen */
    this.gridContainer.x = (this.game.width - this.gridContainer.width) / 2;
    this.gridContainer.y = this.panelContainer.height + (((this.game.height - this.panelContainer.height) - this.gridContainer.height) / 2);
};

/* Actions */

GAME.PlayPuzzle.prototype.restartLevel = function() {
    this.hide(this.stateRestartLevel, this);
};

GAME.PlayPuzzle.prototype.loadLevels = function() {
    this.hide(this.stateLoadLevels, this);
};

/* State */

GAME.PlayPuzzle.prototype.stateRestartLevel = function() {
    this.state.restart();
};

GAME.PlayPuzzle.prototype.stateLoadLevels = function() {
    this.state.start("ChooseLevel");
};

/* Popup */

GAME.PlayPuzzle.prototype.popupCloseAndNextLevel = function() {
    /* Save that we are currently at the next puzzle */
    /* @TODO Find the next puzzle */
    GAME.config.puzzleLevel++;
    GAME.save();
    this.popup.hide(this.restartLevel.bind(this));
};

GAME.PlayPuzzle.prototype.popupCloseAndLoadLevels = function() {
    this.popup.hide(this.loadLevels.bind(this));
};

GAME.PlayPuzzle.prototype.popupCloseAndRestart = function() {
    this.popup.hide(this.restartLevel.bind(this));
};

GAME.PlayPuzzle.prototype.popupClose = function() {
    this.popup.close();
};

GAME.PlayPuzzle.prototype.popupRestart = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle(__("Do you want to restart this puzzle?"));
    
    this.popup.addButton(__("Yes"), this.popupCloseAndRestart, this);
    this.popup.addButton(__("No"), this.popupClose, this, "Red");

    this.popup.generate();
};

GAME.PlayPuzzle.prototype.popupConfirm = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle(__("Are you sure you want to leave?"));
    
    this.popup.addButton(__("Yes"), this.popupCloseAndLoadLevels, this);
    this.popup.addButton(__("No"), this.popupClose, this, "Red");

    this.popup.generate();
};

GAME.PlayPuzzle.prototype.popupGameOver = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle(__("You won!"));
    
    /* Save and unlock the next puzzle in this difficulty (if any...) */
    /* TODO Find the next puzzle, if none ... */
    if (GAME.config.puzzleLevel < this.cache.getJSON("data:puzzle").length) {
        if (GAME.config.puzzles.indexOf(GAME.config.puzzleUid) == -1) {
            GAME.config.puzzles.push(GAME.config.puzzleUid);
            GAME.save();
        }
        /* TODO: On the last, show the next difficulty if any... */
        this.popup.addButton(__("Next"), this.popupCloseAndNextLevel, this);
    }

    this.popup.addButton(__("Back"), this.popupCloseAndLoadLevels, this, "Green");
    this.popup.generate();
};

GAME.PlayPuzzle.prototype.popupHelp = function() {
    this.popup = new PopupHelp(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle("");

    this.puzzle.getHelpPages(this.popup);
    
    this.popup.generate();
};
