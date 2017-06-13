function Panel(game, title) {
    Phaser.Group.call(this, game);

    this.createBackground();
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.background = this.backgroundContainer.create(0, 0, "tile:blank");
    this.background.width = this.game.width;
    this.background.height = 60;
    this.background.tint = 0xffffff;
    this.background.alpha = 0.3;
};

Panel.prototype.createTitle = function(label, size) {
    size = (size == null ? 20 : size);

    this.titleContainer = this.game.add.group();
    this.addChild(this.titleContainer);

    let text = this.game.add.bitmapText(0, 0, "font:gui", label, size);
    text.x = (this.game.width - text.width) / 2;
    text.y = (this.background.height - size) / 2;
    this.titleContainer.addChild(text);
};

Panel.prototype.addButton = function(button) {
    if (this.buttonsContainer == null) {
        this.buttonsContainer = this.game.add.group();
        this.addChild(this.buttonsContainer);
    }

    if (this.buttonsContainer.children.length > 0) {
        button.x = this.game.width - button.width;
    }
    this.buttonsContainer.addChild(button);
};
