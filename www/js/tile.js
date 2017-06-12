function Tile(game) {
    Phaser.Group.call(this, game);

    this.canToggle = true;

    this.isDisabled = false;
    this.isToggled = false;

    this.init();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

/* Helpers */

Tile.prototype.colorize = function(newColor) {
    this.floor.tint = newColor;
};

Tile.prototype.disable = function(newColor) {
    this.isDisabled = true;
    this.canToggle = false;
    this.colorize(newColor);
};

Tile.prototype.setColor = function(newColor) {
    if (!this.isDisabled && this.canToggle) {
        this.colorize(newColor);
        return true;
    }
    return false;
};

Tile.prototype.toggle = function(newColor) {
    if (this.setColor(newColor)) {
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

Tile.prototype.setLabel = function(newLabel) {
    this.label = this.game.add.bitmapText(this.floor.width/2, this.floor.height/2, "font:gui", newLabel, 20);
    this.label.anchor.set(0.5, 0.5);
    this.addChild(this.label);
};
