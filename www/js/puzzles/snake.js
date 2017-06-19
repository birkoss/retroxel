var PUZZLE = PUZZLE || {};

PUZZLE.Snake = function() {
    this.onCompleted = new Phaser.Signal();
};

PUZZLE.Snake.prototype = Object.create(PUZZLE.Puzzle.prototype);
PUZZLE.Snake.prototype.constructor = PUZZLE.Snake;

PUZZLE.Snake.prototype.create = function(puzzle, grid) {
    this.grid = grid;

    this.grid.colors['lighted'] = 0xf7c200;
    this.grid.onTileToggled.add(this.refreshGrid, this);

    grid.createLabel(puzzle.labels.x, "x", 0);
    grid.createLabel(puzzle.labels.y, "y", 0);
};

PUZZLE.Snake.prototype.refreshGrid = function() {
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
        this.onCompleted.dispatch(this);
    }
};

PUZZLE.Snake.prototype.lightTile = function(tile, toggledOnly) {
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

PUZZLE.Snake.prototype.getHelpPages = function(popup) {
    popup.addPage({'text':"You need to places light bulbs in white cells until the entire grid is lit up."});
    popup.addPage({'text':"A bulb sends rays of light horizontally and vertically, illuminating its entire row and column unless its light is blocked by a black cell."});
    popup.addPage([{
        'text':"Rules #1\n\nNo two bulbs illuminate on each other."
    },{
        "text":"This is an example of two bulbs illuminating each other:"
    },{
        "img":"help:rule1-wrong"
        }
    ]);
    popup.addPage([{'text':"Rules #2\n\nA black cell may have a number on it from 0 to 4, indicating how many bulbs must be placed adjacent to its four sides."},{"img":"help:rule2"}]);
    popup.addPage({'text':"Rules #3\n\nAn unnumbered black cell may have any number of light bulbs adjacent to it, or none. Bulbs placed diagonally adjacent to a numbered cell do not contribute to the bulb count."});
};
