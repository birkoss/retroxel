var GAME = GAME || {};

GAME.ChoosePuzzle = function() {};

GAME.ChoosePuzzle.prototype = new AnimatedState();

GAME.ChoosePuzzle.prototype.create = function() {
        /* Create the panel */
        this.panelContainer = this.game.add.group();
        this.panelContainer.animation = AnimatedState.Animation.SlideDown;

        this.panel = new Panel(this.game);
        this.panelContainer.addChild(this.panel);
        this.panel.createTitle(__("Puzzle"));
        
        let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
        button.onClicked.add(this.onBtnBackClicked, this);
        this.panel.addButton(button);

        /* Create the puzzles list */
        let buttonDimension = {width:220, height:60};

        this.buttonsContainer = this.game.add.group();
        this.buttonsContainer.animation = AnimatedState.Animation.SlideRight;

        GAME.puzzles.forEach(function(single_puzzle) {
            let totalPuzzle = totalCompleted = 0;
            single_puzzle.difficulties.forEach(function(single_difficulty) {
                totalPuzzle += parseInt(single_difficulty.total);
                single_difficulty.puzzles.forEach(function(single_puzzle) {
                    totalCompleted += (GAME.config.puzzles.indexOf(single_puzzle.uid) != -1 ? 1 : 0);
                }, this);
            }, this);

            let button = new PanelButton(this.game, __(single_puzzle.name), "", buttonDimension);
            button.setSubtitle(totalCompleted + " / " + totalPuzzle);
            button.setImage("puzzle:" + single_puzzle.id);
            button.puzzle = single_puzzle.id;
            button.y = 0;
            if (this.buttonsContainer.height > 0) {
                button.y += this.buttonsContainer.height + GAME.config.padding.button;
            }
            button.x = (this.game.width - button.width)/2;
            button.onClicked.add(this.onBtnPuzzleClicked, this);
            this.buttonsContainer.addChild(button);
        }, this);

        /* Add a new button to show more puzzles to come... */
        button = new PanelButton(this.game, __("Coming soon"), "Grey", buttonDimension);
        button.lock();
        button.alpha = 1;
        button.y = this.buttonsContainer.height + GAME.config.padding.button;
        button.x = (this.game.width - button.width)/2;
        this.buttonsContainer.addChild(button);
        this.buttonsContainer.y = (this.game.height - this.buttonsContainer.height) / 2;

        /* Prepare the animations */
        this.containers.push(this.panelContainer);
        this.containers.push(this.buttonsContainer);

        this.show();
};

/* Load states */

GAME.ChoosePuzzle.prototype.loadMain = function() {
    this.state.start("Main");
};

GAME.ChoosePuzzle.prototype.loadDifficulties = function() {
    this.state.start("ChooseDifficulty");
};

/* Events */

GAME.ChoosePuzzle.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadMain, this);
};
GAME.ChoosePuzzle.prototype.onBtnPuzzleClicked = function(button) {
    GAME.config.puzzleName = button.puzzle;
    this.hide(this.loadDifficulties, this);
};
