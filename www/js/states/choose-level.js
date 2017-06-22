var GAME = GAME || {};

GAME.ChooseLevel = function() {};

GAME.ChooseLevel.prototype = new AnimatedState();

GAME.ChooseLevel.prototype.create = function() {
    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle(__(GAME.config.puzzleDifficulty));

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

GAME.ChooseLevel.prototype.createLevels = function() {
    let puzzles = [];
    GAME.puzzles.forEach(function(single_puzzle) {
        if (single_puzzle.id == GAME.config.puzzleName) {
            single_puzzle.difficulties.forEach(function(single_difficulties) {
                if (single_difficulties.name == GAME.config.puzzleDifficulty) {
                    puzzles = single_difficulties.puzzles;
                }
            }, this);
        }
    }, this);

    let puzzleTotal = puzzles.length;
    this.navigator.setTitle((this.page+1) + " / " + (puzzleTotal/this.limit));
    this.levelsContainer.removeAll(true);

    let padding = 16;
    let index = (this.page * this.limit);
    let isLocked = false;
    /* TODO: BEtter ! */
    /* Lock the first puzzle of each following page (never on the first page) when they are not unlocked */
    if (index > 0 && GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].indexOf(index) == -1) {
        isLocked = true;
    }

    for (let y=0; y<5; y++) {
        for (let x=0; x<4; x++) {
            let puzzle = puzzles[index++];

            let button = new PanelButton(this.game, (isLocked ? "??" : index), (isLocked ? "Grey" : ""), AnimatedState.Dimension.Panel);
            if (isLocked) {
                button.lock();
            } else {
                button.onClicked.add(this.onBtnLevelClicked, this);
            }
            button.puzzleUid = puzzle.uid;
            button.x = x * (button.width + (padding/2));
            button.y = y * (button.height + (padding/2));
            this.levelsContainer.addChild(button);

            if (GAME.config.puzzles.indexOf(puzzle.uid) == -1) {
                isLocked = true;
            }
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

GAME.ChooseLevel.prototype.loadGame = function() {
    this.state.start("PlayPuzzle");
};

GAME.ChooseLevel.prototype.loadDifficulties = function() {
    this.state.start("ChooseDifficulty");
};

/* Events */

GAME.ChooseLevel.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadDifficulties, this);
};

GAME.ChooseLevel.prototype.onBtnLevelClicked = function(button) {
    GAME.config.puzzleUid = button.puzzleUid;;
    this.hide(this.loadGame, this);
};

GAME.ChooseLevel.prototype.onBtnNavigatorClicked = function(button) {
    this.page += button.direction;
    this.createLevels();
};
