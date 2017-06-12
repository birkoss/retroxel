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
        let existingTiles = this.map.getTilesFromColor(0xf7c200);

        /* Get all positions from each toggled tiles */
    },
    /* Events */
    onPanelToggleButtonClicked: function(state) {
        this.map.simulate();
    },
    onMapTileToggled: function(tile) {
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

                    if (neighboor.enable) {
                        tiles.push({gridX:nX, gridY:nY});
                    }
                }
            }, this);
        }

        tiles.forEach(function(tile) {
            this.map.tiles[tile.gridY][tile.gridX].colorize(0xf7c200);
        }, this);
        console.log(tiles);
        // Get all value from axis until out of bounds OR disabled
        // - Highlight all empty tile
    }
};
