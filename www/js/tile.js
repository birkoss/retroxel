function Tile(game) {
    Phaser.Group.call(this, game);

    this.canToggle = true;

    this.isDisabled = false;
    this.isToggled = false;

    this.colors = {
        disabled: 0x000000,
        toggled: 0xe8795e,
        normal: 0xffffff
    };

    this.init();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

/* Helpers */

Tile.prototype.colorize = function(newColor) {
    this.floor.tint = newColor;
};

Tile.prototype.disable = function() {
    this.isDisabled = true;
    this.canToggle = false;
    this.colorize(this.colors.disabled);
};

Tile.prototype.toggle = function() {
    if (!this.isDisabled && this.canToggle) {
        //BLUE this.colorize(0x4493a0);
        //GREEN this.colorize(0x85c226);
        //Yellow this.colorize(0xf7c200);
        //RED this.colorize(0xe8795e);
        //PURPLE this.colorize(0xbab2d9);
        //Pink-ish this.colorize(0xdf127b);
        //Pink : this.colorize(0xcb1170);
        this.colorize(this.isToggled ? this.colors.normal : this.colors.toggled);
        this.isToggled = !this.isToggled;
    }
};

/* Creations */

Tile.prototype.createTile = function(spriteName, frame) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    tile.anchor.set(0.5, 0.5);

    if (frame != null) {
        tile.frame = frame;
    }

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    return tile;
};

Tile.prototype.init = function() {
    this.floor = this.createTile("tile:blank");
    this.addChild(this.floor);
};

Tile.prototype.setColor = function(colorState, newColor) {
    this.colors[colorState] = newColor;
    if (colorState == 'normal') {
        this.colorize(this.colors[colorState]);
    }
};

Tile.prototype.setLabel = function(newLabel) {
    this.label = this.game.add.bitmapText(this.floor.width/2, this.floor.height/2, "font:gui", newLabel, 20);
    this.label.anchor.set(0.5, 0.5);
    this.addChild(this.label);
};
