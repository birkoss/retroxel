function PopupHelp(game) {
    Popup.call(this, game);

    this.pages = [];
};

PopupHelp.prototype = Object.create(Popup.prototype);
PopupHelp.prototype.constructor = PopupHelp;

PopupHelp.prototype.addPage = function() {

};
