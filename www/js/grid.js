function Grid(game, puzzle) {
    Phaser.Group.call(this, game);

    this.puzzle = puzzle;
    this.gridWidth = puzzle.width;
    this.gridHeight = puzzle.height;

        //BLUE this.colorize(0x4493a0);
        //GREEN this.colorize(0x85c226);
        //Yellow this.colorize(0xf7c200);
        //RED this.colorize(0xe8795e);
        //PURPLE this.colorize(0xbab2d9);
        //Pink-ish this.colorize(0xdf127b);
        //Pink : this.colorize(0xcb1170);
    this.colors = {
        background: 0xeaeaea,
        disabled: 0x000000,
        toggled: 0xe8795e,
        selected: 0xdcdcdc,
        normal: 0xffffff
    };

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
    background.tint = this.colors.background;

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
            tile.colorize(this.colors.normal);
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }
};

/* Helpers */

Grid.prototype.createLabel = function(labels, direction, position) {
    let limit = (direction == "x" ? this.gridWidth : this.gridHeight);
    console.log(limit);

    for (let i=0; i<limit; i++) {
        let tile = new Tile(this.game);
        tile.x = tile.y = i * (tile.width + this.padding);
        if (direction == "x") {
            tile.y = this.gridHeight * (tile.width + this.padding);
        } else {
            tile.x = this.gridHeight * (tile.width + this.padding);
        }
        tile.colorize(this.colors.label);
        tile.setLabel(labels[i]);
        this.tilesContainer.addChild(tile);
    }

    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.tilesContainer.width + this.padding*2;
    background.height = this.tilesContainer.height + this.padding*2;
    background.tint = this.colors.background;
};

Grid.prototype.getNeighboors = function(gridX, gridY) {
    let neighboors = [];
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (Math.abs(x) != Math.abs(y)) { /*if (x != 0 || y != 0) { */
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                    neighboors.push(this.tiles[newY][newX]);
                }
            }
        }
    }
    return neighboors;
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

Grid.prototype.getTilesFromColor = function(color) {
    let matchingTiles = [];

    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (this.tiles[gridY][gridX].floor.tint == color) {
                matchingTiles.push(this.tiles[gridY][gridX]);
            }
        }
    }

    return matchingTiles;
};

Grid.prototype.isInBound = function(gridX, gridY) {
    return !(gridX < 0 || gridY < 0 || gridX >= this.gridWidth || gridY >= this.gridHeight);
};

Grid.prototype.resetTiles = function() {
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            this.tiles[gridY][gridX].reset();
        }
    }
};

/* Events */

Grid.prototype.selectTile = function(Grid, pointer) {
    this.selectedTile = this.getTileFromPointer(pointer);
    this.selectedTile.setColor(this.colors.selected);
};

Grid.prototype.toggleTile = function(grid, pointer) {
    if (this.selectedTile != null) {
        if (this.selectedTile == this.getTileFromPointer(pointer)) {
            this.selectedTile.toggle(this.selectedTile.isToggled ? this.colors.normal : this.colors.toggled);
            this.onTileToggled.dispatch(this.selectedTile);
        } else {
            this.selectedTile.setColor(this.selectedTile.isToggled ? this.colors.toggled : this.colors.normal);
        }

        this.selectedTile = null;
    }
};
