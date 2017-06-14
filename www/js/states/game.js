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

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle("# " + GAME.config.puzzleLevel);

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

GAME.Game.prototype.createGrid = function() {
    let puzzle = this.cache.getJSON("data:puzzle")[GAME.config.puzzleLevel];

    this.grid = new Grid(this.game, puzzle);
    this.grid.colors['lighted'] = 0xf7c200;
    this.grid.onTileToggled.add(this.refreshGrid, this);
    this.gridContainer.addChild(this.grid);

    this.gridContainer.x = (this.game.width - this.gridContainer.width) / 2;
    this.gridContainer.y = this.panelContainer.height + (((this.game.height - this.panelContainer.height) - this.gridContainer.height) / 2);
};

GAME.Game.prototype.refreshGrid = function() {
    /* Reset all the tweens */
    this.grid.resetTiles();

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

    /* Verify that no toggled light illuminate each other */
    let illuminatedTiles = [];
    this.grid.getTilesFromColor(this.grid.colors.toggled).forEach(function(tile) {
        this.lightTile(tile, true).forEach(function(lightedTile) {
            let isNew = true;
            illuminatedTiles.forEach(function(illuminatedTile) {
                if (illuminatedTile.gridX == lightedTile.gridX && illuminatedTile.gridY == lightedTile.gridY) {
                    isNew = false;
                }
            }, this);
            if (isNew) {
                illuminatedTiles.push(lightedTile);
            }
        }, this);
    }, this);

    /* Blink the tiles */
    illuminatedTiles.forEach(function(tile) {
        this.grid.tiles[tile.gridY][tile.gridX].blink();
    }, this);

    /* Check each labels */
    this.grid.getTilesFromColor(this.grid.colors.disabled).forEach(function(tile) {
        if (tile.label != null) {
            let total = 0;
            this.grid.getNeighboors(tile.gridX, tile.gridY).forEach(function(neighboor) {
                if (neighboor.floor.tint == this.grid.colors.toggled) {
                    total++;
                }
            }, this);
            tile.label.tint = (total > tile.label.text ? 0xff0000 : 0xffffff);
        }
    }, this);

    /* Check for solution */
    let isCompleted = false;
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
        this.popupGameOver();
    }
};

GAME.Game.prototype.lightTile = function(tile, toggledOnly) {
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

                if (toggledOnly) {
                    if (neighboor.enable && this.grid.tiles[nY][nX].isToggled) {
                        tiles.push({gridX:nX, gridY:nY});
                    }
                } else {
                    if (neighboor.enable && !this.grid.tiles[nY][nX].isToggled) {
                        tiles.push({gridX:nX, gridY:nY});
                    }
                }
            }
        }, this);
    }
    return tiles;
};

/* Actions */

GAME.Game.prototype.restartLevel = function() {
    this.hide(this.stateRestartLevel, this);
};

GAME.Game.prototype.loadLevels = function() {
    this.hide(this.stateLoadLevels, this);
};

/* State */

GAME.Game.prototype.stateRestartLevel = function() {
    this.state.restart();
};

GAME.Game.prototype.stateLoadLevels = function() {
    this.state.start("Level");
};

/* Popup */

GAME.Game.prototype.popupCloseAndNextLevel = function() {
    /* Save that we are currently at the next puzzle */
    GAME.config.puzzleLevel++;
    GAME.save();
    this.popup.hide(this.restartLevel.bind(this));
};

GAME.Game.prototype.popupCloseAndLoadLevels = function() {
    this.popup.hide(this.loadLevels.bind(this));
};

GAME.Game.prototype.popupCloseAndRestart = function() {
    this.popup.hide(this.restartLevel.bind(this));
};

GAME.Game.prototype.popupClose = function() {
    this.popup.close();
};

GAME.Game.prototype.popupRestart = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle("Do you want to restart this puzzle?");
    
    this.popup.addButton("Yes", this.popupCloseAndRestart, this);
    this.popup.addButton("No", this.popupClose, this, "Red");

    this.popup.generate();
};

GAME.Game.prototype.popupConfirm = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle("Are you sure you want to leave ?");
    
    this.popup.addButton("Yes", this.popupCloseAndLoadLevels, this);
    this.popup.addButton("No", this.popupClose, this, "Red");

    this.popup.generate();
};

GAME.Game.prototype.popupGameOver = function() {
    this.popup = new Popup(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle("You won!");
    
    /* Save and unlock the next puzzle in this difficulty (if any...) */
    if (GAME.config.puzzleLevel < this.cache.getJSON("data:puzzle").length - 1) {
        if (GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].indexOf(GAME.config.puzzleLevel+1) == -1) {
            GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].push(GAME.config.puzzleLevel+1);
            GAME.save();
        }
        /* TODO: On the last, show the next difficulty if any... */
        this.popup.addButton("Next", this.popupCloseAndNextLevel, this);
    }

    this.popup.addButton("Back", this.popupCloseAndLoadLevels, this, "Green");
    this.popup.generate();
};

GAME.Game.prototype.popupHelp = function() {
    this.popup = new PopupHelp(this.game);
    this.popup.createOverlay(0.5);
    this.popup.createTitle("");
    
    this.popup.addPage({'text':"You need to places light bulbs in white cells until the entire grid is lit up."});
    this.popup.addPage({'text':"A bulb sends rays of light horizontally and vertically, illuminating its entire row and column unless its light is blocked by a black cell."});
    this.popup.addPage({'text':"Rules #1\n\nNo two bulbs illuminate on each other."});
    this.popup.addPage({'text':"Rules #2\n\nA black cell may have a number on it from 0 to 4, indicating how many bulbs must be placed adjacent to its four sides."});
    this.popup.addPage({'text':"Rules #3\n\nAn unnumbered black cell may have any number of light bulbs adjacent to it, or none. Bulbs placed diagonally adjacent to a numbered cell do not contribute to the bulb count."});
    this.popup.generate();
};
