var GAME = GAME || {};

GAME.ChooseDifficulty = function() {};

GAME.ChooseDifficulty.prototype = new AnimatedState();

GAME.ChooseDifficulty.prototype.create = function() {
    let puzzle = P(GAME.config.puzzleName);

    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle(__(puzzle.name));

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
    puzzle.difficulties.forEach(function(single_difficulty) {
        let button = new PanelButton(this.game, __(single_difficulty.name), colors[single_difficulty.name], {width:200, height:60});

        let totalCompleted = 0;
        single_difficulty.puzzles.forEach(function(single_puzzle) {
            totalCompleted += (GAME.config.puzzles.indexOf(single_puzzle.uid) != -1 ? 1 : 0);
        }, this);

        button.setSubtitle(totalCompleted + " / " + single_difficulty.total);
        button.difficulty = single_difficulty.name;
        button.y = (this.buttonsContainer.height > 0 ? this.buttonsContainer.height + GAME.config.padding.button : 0);
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

GAME.ChooseDifficulty.prototype.loadLevels = function() {
    this.state.start("ChooseLevel");
};

GAME.ChooseDifficulty.prototype.loadPuzzles = function() {
    this.state.start("ChoosePuzzle");
};

/* Events */

GAME.ChooseDifficulty.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadPuzzles, this);
};

GAME.ChooseDifficulty.prototype.onBtnDifficultyClicked = function(button) {
    GAME.config.puzzleDifficulty = button.difficulty;
    this.hide(this.loadLevels, this);
};
