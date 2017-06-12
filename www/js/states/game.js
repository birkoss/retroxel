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
        this.mapContainer.addChild(this.map);

        this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height - this.mapContainer.x);
    },
    createPanel: function() {
        this.panel = new Panel(this.game);
        this.panel.buttonToggleClicked.add(this.onPanelToggleButtonClicked, this);
        this.panelContainer.addChild(this.panel);
    },
    /* Events */
    onPanelToggleButtonClicked: function(state) {
        this.map.simulate();
    }
};
