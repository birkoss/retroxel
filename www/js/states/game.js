var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.game.stage.backgroundColor = 0x333333;
        this.mapContainer = this.game.add.group();

        this.panelContainer = this.game.add.group();

        //this.createPanel();

        this.createMap();
    },
    createMap: function() {
        let puzzle = {
            gridWidth: 5,
            gridHeight: 5,
            labels: [
                {gridX:0, gridY:1, text:1},
                {gridX:0, gridY:2, text:2},
                {gridX:2, gridY:2, text:3},
                {gridX:1, gridY:3, text:4},
            ],
            disabledTiles: [
                {gridX:0, gridY:1},
                {gridX:0, gridY:2},
                {gridX:2, gridY:2},
                {gridX:3, gridY:2},
                {gridX:1, gridY:3},
            ]
        };

        this.map = new Grid(this.game, puzzle);
        this.map.colors['lighted'] = 0xf7c200;
        this.map.onTileToggled.add(this.onMapTileToggled, this);
        this.mapContainer.addChild(this.map);

        this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height - this.mapContainer.x);
    },
    createPanel: function() {
        this.panel = new Panel(this.game);
        this.panel.buttonToggleClicked.add(this.onPanelToggleButtonClicked, this);
        this.panelContainer.addChild(this.panel);
    },

    refreshGrid: function() {
        /* Get existings color position */
        let existingTiles = this.map.getTilesFromColor(this.map.colors.lighted);

        /* Get all positions from each toggled tiles */
        let newTiles = [];
        this.map.getTilesFromColor(this.map.colors.toggled).forEach(function(tile) {
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
                this.map.tiles[tile.gridY][tile.gridX].colorize(this.map.colors.lighted);
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
                this.map.tiles[tile.gridY][tile.gridX].colorize(this.map.colors.normal);
            }
        }, this);
    },
    lightTile: function(tile) {
        let tiles = [];

        let neighboors = [{gridX:0, gridY:1, enable:true}, {gridX:0, gridY:-1, enable:true}, {gridX:1, gridY:0, enable:true}, {gridX:-1, gridY:0, enable:true}];
        let nX, nY = 0;
        for (let i=1; i<Math.max(this.map.gridWidth, this.map.gridHeight); i++) {
            neighboors.forEach(function(neighboor) {
                if (neighboor.enable) {
                    nX = tile.gridX + (i * neighboor.gridX);
                    nY = tile.gridY + (i * neighboor.gridY);

                    if (!this.map.isInBound(nX, nY)) {
                        neighboor.enable = false;
                    }

                    if (neighboor.enable && this.map.tiles[nY][nX].isDisabled) {
                        neighboor.enable = false;
                    }

                    if (neighboor.enable && !this.map.tiles[nY][nX].isToggled) {
                        tiles.push({gridX:nX, gridY:nY});
                    }
                }
            }, this);
        }
        return tiles;
    },
    /* Events */
    onPanelToggleButtonClicked: function(state) {
        this.map.simulate();
    },
    onMapTileToggled: function(tile) {
        this.refreshGrid();
        return;

    }
};
