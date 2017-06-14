var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = new AnimatedState();

GAME.Game.prototype.preload = function() {
    this.load.json("data:puzzle", "data/" + GAME.config.puzzleName + "_" + GAME.config.puzzleDifficulty + ".json");
};

GAME.Game.prototype.create = function() {
    this.game.stage.backgroundColor = 0x333333;

    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game, "Puzzle");
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle("# " + GAME.config.puzzleLevel);

    let button = new PanelButton(this.game, "<-", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.onBtnBackClicked, this);
    this.panel.addButton(button);

    button = new PanelButton(this.game, "R", "Green", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.onBtnRestartClicked, this);
    this.panel.addButton(button);

    /* Create the grid */
    this.gridContainer = this.game.add.group();
    this.gridContainer.animation = AnimatedState.Animation.SlideRight;
    this.createGrid();

    /* Prepare the animations */
    this.containers.push(this.panelContainer);
    this.containers.push(this.gridContainer);

    this.show();
};

GAME.Game.prototype.createGrid = function() {
    let puzzle = this.cache.getJSON("data:puzzle")[GAME.config.puzzleLevel];

    this.grid = new Grid(this.game, puzzle);
    this.grid.colors['lighted'] = 0xf7c200;
    this.grid.onTileToggled.add(this.onGridTileToggled, this);
    this.gridContainer.addChild(this.grid);

    this.gridContainer.x = (this.game.width - this.gridContainer.width) / 2;
    this.gridContainer.y = this.panelContainer.height + (((this.game.height - this.panelContainer.height) - this.gridContainer.height) / 2);
};

GAME.Game.prototype.refreshGrid = function() {
    /* Get existings color position */
    let existingTiles = this.grid.getTilesFromColor(this.grid.colors.lighted);

    /* Get all positions from each toggled tiles */
    let newTiles = [];
    this.grid.getTilesFromColor(this.grid.colors.toggled).forEach(function(tile) {
        this.lightTile(tile).forEach(function(lightedTile) {
            let isNew = true;
            newTiles.forEach(function(newTile) {
                if (newTile.gridX == lightedTile.gridX && newTile.gridY == lightedTile.gridY) {
                    isNew = false;
                }
            }, this);
            if (isNew) {
                newTiles.push(lightedTile);
            }
        }, this);
    }, this);

    /* Find NEW tiles to highlight */
    newTiles.forEach(function(tile) {
        let isNew = true;
        existingTiles.forEach(function(oldTile) {
            if (oldTile.gridX == tile.gridX && oldTile.gridY == tile.gridY) {
                isNew = false;
            }
        }, this);
        if (isNew) {
            this.grid.tiles[tile.gridY][tile.gridX].colorize(this.grid.colors.lighted);
        }
    }, this);

    /* Find OLD tiles to return to normal */
    existingTiles.forEach(function(tile) {
        let isRemoved = true;
        newTiles.forEach(function(newTile) {
            if (newTile.gridX == tile.gridX && newTile.gridY == tile.gridY) {
                isRemoved = false;
            }
        }, this);
        if (isRemoved) {
            this.grid.tiles[tile.gridY][tile.gridX].colorize(this.grid.colors.normal);
        }
    }, this);

    /* Check for solution */
    let isCompleted = false;
    console.log(this.grid.getTilesFromColor(this.grid.colors.toggled).length + " vs " + this.grid.puzzle.answers.length);
    if (this.grid.getTilesFromColor(this.grid.colors.toggled).length == this.grid.puzzle.answers.length) {
        isCompleted = true;
        this.grid.getTilesFromColor(this.grid.colors.toggled).forEach(function(tile) {
            let isOk = false;
            this.grid.puzzle.answers.forEach(function(answer) {
                if (tile.gridX == answer.gridX && tile.gridY == answer.gridY) {
                    isOk = true;
                }
            }, this);
            if (!isOk) {
                isCompleted = false;
            }
        }, this);
    }

    if (isCompleted) {
        this.gameOver();
    }
};

GAME.Game.prototype.lightTile = function(tile) {
    let tiles = [];

    let neighboors = [{gridX:0, gridY:1, enable:true}, {gridX:0, gridY:-1, enable:true}, {gridX:1, gridY:0, enable:true}, {gridX:-1, gridY:0, enable:true}];
    let nX, nY = 0;
    for (let i=1; i<Math.max(this.grid.gridWidth, this.grid.gridHeight); i++) {
        neighboors.forEach(function(neighboor) {
            if (neighboor.enable) {
                nX = tile.gridX + (i * neighboor.gridX);
                nY = tile.gridY + (i * neighboor.gridY);

                if (!this.grid.isInBound(nX, nY)) {
                    neighboor.enable = false;
                }

                if (neighboor.enable && this.grid.tiles[nY][nX].isDisabled) {
                    neighboor.enable = false;
                }

                if (neighboor.enable && !this.grid.tiles[nY][nX].isToggled) {
                    tiles.push({gridX:nX, gridY:nY});
                }
            }
        }, this);
    }
    return tiles;
};

GAME.Game.prototype.gameOver = function() {
    let popup = new Popup(this.game);
    popup.createOverlay(0.5);
    popup.createTitle("You won!");
    
    /* Save and unlock the next puzzle in this difficulty (if any...) */
    if (GAME.config.puzzleLevel < this.cache.getJSON("data:puzzle").length - 1) {
        if (GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].indexOf(GAME.config.puzzleLevel+1) == -1) {
            GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].push(GAME.config.puzzleLevel+1);
            GAME.save();
        }
        /* TODO: On the last, show the next difficulty if any... */
        popup.addButton("Next", this.onBtnNextClicked, this);
    }

    popup.addButton("Back", this.onBtnBackClicked, this, "Green");
    popup.generate();
};


/* Load states */

GAME.Game.prototype.loadGame = function() {
    this.state.start("Game");
};

GAME.Game.prototype.loadLevels = function() {
    this.state.start("Level");
};

GAME.Game.prototype.restartLevel = function() {
    this.state.restart();
};

/* Events */

GAME.Game.prototype.onGridTileToggled = function(tile) {
    this.refreshGrid();
};

GAME.Game.prototype.onBtnBackClicked = function(button) {
    this.hide(this.loadLevels, this);
};

GAME.Game.prototype.onBtnNextClicked = function(button) {
    GAME.config.puzzleLevel++;
    GAME.save();
    this.hide(this.restartLevel, this);
};

GAME.Game.prototype.onClosePopupClicked = function() {
    this.close();
};

GAME.Game.prototype.onBtnRestartClicked = function(button) {
    //this.hide(this.restartLevel, this);
    let popup = new Popup(this.game);
    popup.createOverlay(0.5);
    popup.createTitle("Do you want to restart this puzzle?");
    
    popup.addButton("Yes", this.onBtnBackClicked, this);
    popup.addButton("No", this.onClosePopupClicked, popup, "Red");

    popup.generate();
};
