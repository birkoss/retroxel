function PopupHelp(game) {
    Popup.call(this, game);

    this.maxWidth = this.game.width;
    this.maxHeight = this.game.height;
    this.pages = [];
};

PopupHelp.prototype = Object.create(Popup.prototype);
PopupHelp.prototype.constructor = PopupHelp;

PopupHelp.prototype.addPage = function() {
    //this.getContainer("buttons").outside = 0;
    this.getContainer("buttons").y = (this.maxHeight - this.getContainer("buttons").group.height) / 2;
};
