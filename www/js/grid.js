function Grid(game, puzzle) {
    Phaser.Group.call(this, game);

    this.puzzle = puzzle;
    this.gridWidth = puzzle.gridWidth;
    this.gridHeight = puzzle.gridHeight;

    this.tiles = [];
    this.selectedTile = null;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.padding = 2 * GAME.scale.sprite;

    this.createGrid();
    this.createBackground();

    this.tilesContainer.x = this.tilesContainer.y = this.padding;

    this.onTileToggled = new Phaser.Signal();
};

Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.createBackground = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.tilesContainer.width + this.padding*2;
    background.height = this.tilesContainer.height + this.padding*2;
    background.tint = 0xeaeaea;

    background.inputEnabled = true;
    background.events.onInputDown.add(this.selectTile, this);
    background.events.onInputUp.add(this.toggleTile, this);
};

Grid.prototype.createGrid = function() {
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let tile = new Tile(this.game);
            tile.x = gridX * (tile.width + this.padding);
            tile.y = gridY * (tile.height + this.padding);
            tile.gridX = gridX;
            tile.gridY = gridY;
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    if (this.puzzle.disabledTiles != undefined) {
        this.puzzle.disabledTiles.forEach(function(tile) {
            this.tiles[tile.gridY][tile.gridX].disable();
        }, this);
    }

    if (this.puzzle.labels != undefined) {
        this.puzzle.labels.forEach(function(label) {
            this.tiles[label.gridY][label.gridX].setLabel(label.text);
        }, this);
    }
};

/* Helpers */

Grid.prototype.getNeighboors = function(gridX, gridY, isAlive) {
    let total = 0;
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (x != 0 || y != 0) {
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                    if (this.tiles[newY][newX].isAlive() == isAlive) {
                        total++;
                    }
                }
            }
        }
    }
    return total;
};

Grid.prototype.getTileFromPointer = function(pointer) {
    let x = pointer.x;
    let y = pointer.y;
    if (this.parent != undefined) {
        x -= this.parent.x;
        y -= this.parent.y;
    }

    let gridX = Math.floor((x-this.padding) / (this.tiles[0][0].width+this.padding));
    let gridY = Math.floor((y-this.padding) / (this.tiles[0][0].height+this.padding));
    if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
        return this.tiles[gridY][gridX];
    }

    return null;
};

Grid.prototype.isInBound = function(gridX, gridY) {
    return !(gridX < 0 || gridY < 0 || gridX >= this.gridWidth || gridY >= this.gridHeight);
};

/* Events */

Grid.prototype.selectTile = function(Grid, pointer) {
    this.selectedTile = this.getTileFromPointer(pointer);
    this.selectedTile.select();
};

Grid.prototype.toggleTile = function(grid, pointer) {
    if (this.selectedTile != null) {
        if (this.selectedTile == this.getTileFromPointer(pointer)) {
            this.selectedTile.toggle();
            this.onTileToggled.dispatch(this.selectedTile);
        } else {
            this.selectedTile.unselect();
        }

        this.selectedTile = null;
    }
};
