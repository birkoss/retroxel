var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('tile:floor', 'images/tiles/floor.png', 8, 8);
        this.load.spritesheet('tile:detail', 'images/tiles/detail.png', 8, 8);
        this.load.spritesheet('tile:enemies', 'images/tiles/enemies.png', 8, 8);
        this.load.spritesheet('tile:fire', 'images/tiles/fire.png', 8, 8);
        this.load.image('tile:blank', 'images/tiles/blank.png');

        this.load.spritesheet('gui:btnNormal', 'images/gui/buttons/normal.png', 2, 2);
        this.load.spritesheet('gui:btnOver', 'images/gui/buttons/over.png', 2, 2);

        this.load.spritesheet('gui:btnNormalGreen', 'images/gui/buttons/normalGreen.png', 2, 2);
        this.load.spritesheet('gui:btnOverGreen', 'images/gui/buttons/overGreen.png', 2, 2);

        this.load.spritesheet('gui:btnNormalRed', 'images/gui/buttons/normalRed.png', 2, 2);
        this.load.spritesheet('gui:btnOverRed', 'images/gui/buttons/overRed.png', 2, 2);

        this.load.spritesheet('gui:btnNormalGrey', 'images/gui/buttons/normalGrey.png', 2, 2);
        this.load.spritesheet('gui:btnOverGrey', 'images/gui/buttons/overGrey.png', 2, 2);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.image('help:rule2', 'images/help/rule2.png');
        this.load.image('help:rule1-wrong', 'images/help/rule1-wrong.png');

        this.load.image('puzzle:Akari', 'images/gui/puzzles/Akari.png');

        this.load.json("data:puzzles", "data/puzzles.json");
    },
    create: function() {
        this.state.start("Main");
    }
};
