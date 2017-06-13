function PanelButton(game, label, spriteSheet, isSquare) {
    Phaser.Group.call(this, game);

    this.spriteSheet = (spriteSheet != null ? spriteSheet : "");

    this.onClicked = new Phaser.Signal();

    this.init();

    this.isSquare = (isSquare ? true : false);
    this.setLabel(label);
};

PanelButton.prototype = Object.create(Phaser.Group.prototype);
PanelButton.prototype.constructor = PanelButton;

PanelButton.prototype.init = function() {
    let click = this.create(0, 0, "tile:blank");
    click.tint = 0xff00ff;
    click.alpha = 0;
    click.inputEnabled = true;
    click.events.onInputDown.add(this.showOver, this);
    click.events.onInputUp.add(this.showNormal, this);

    this.background = new Ninepatch(this.game, "gui:btnNormal" + this.spriteSheet);
    this.background.inputEnabled = true;
    this.addChild(this.background);
};

PanelButton.prototype.setLabel = function(newLabel) {
    this.label = this.game.add.bitmapText(0, 0, "font:gui", newLabel, 20);
    this.label.anchor.set(0.5, 0.5);
    this.label.x += this.label.width/2;
    this.label.y += this.label.height/2;
    this.addChild(this.label);

    if (this.isSquare) {
        this.background.resize(60, 60);
        this.getChildAt(0).width = 60;
        this.getChildAt(0).height = 60;
    } else {
        this.background.resize(120, 40);
        this.getChildAt(0).width = 120;
        this.getChildAt(0).height = 40;
    }


    this.label.x += (this.background.width - this.label.width) / 2;
    this.label.y += (this.background.height - this.label.height) / 2;
};

PanelButton.prototype.disable = function() {
    this.alpha = 0.3;
};

PanelButton.prototype.enable = function() {
    this.alpha = 1;
};

PanelButton.prototype.showOver = function(sprite, pointer) {
    if (this.alpha == 1) {
        this.background.changeTexture("gui:btnOver" + this.spriteSheet);
    }
};
PanelButton.prototype.showNormal = function(sprite, pointer) {
        this.background.changeTexture("gui:btnNormal" + this.spriteSheet);
    if (this.alpha == 1) {
        this.onClicked.dispatch(this);
    }
};
