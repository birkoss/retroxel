function PopupHelp(game) {
    Popup.call(this, game);

    this.maxWidth = this.game.width;
    this.maxHeight = this.game.height;

    this.createPanel();
    this.createNavigator();

    this.pages = [];
    this.page = 0;
};

PopupHelp.prototype = Object.create(Popup.prototype);
PopupHelp.prototype.constructor = PopupHelp;

PopupHelp.prototype.addPage = function(page) {
    let container = this.getContainer("page_" + this.pages.length);
    let group = container.group;

    if (Array.isArray(page)) {
        page.forEach(function(row) {
            this.addRow(group, row);
        }, this);
    } else {
        this.addRow(group, page);
    }

    container.y = (this.maxHeight - group.height) / 2;
    container.y += (this.panel.height-this.navigator.height)/2;

    if (this.pages.length > 0) {
        group.alpha = 0;
    }

    this.pages.push(container);

    this.updateNavigator();
};

PopupHelp.prototype.addRow = function(group, row) {
    let startY = 0;
    if (group.height > 0) {
        startY += group.height + this.padding;
    }
    let text = this.game.add.bitmapText(0, 0, "font:gui", row.text, 20);
    text.tint = 0x000000;
    text.maxWidth = this.maxWidth - this.padding*2;
    text.anchor.set(0.5, 0.5);
    text.x += text.width/2;
    text.y += text.height/2;

    if (group.height > 0) {
        text.y += startY;
    }

    if (row.img != undefined) {
        let img = group.create(0, startY, row.img);
    }

    group.addChild(text);
};

PopupHelp.prototype.updateNavigator = function() {
    if (this.page == 0) {
        this.previousButton.disable();
    } else {
        this.previousButton.enable();
    }

    if (this.page >= this.pages.length - 1) {
        this.nextButton.disable();
    } else {
        this.nextButton.enable();
    }

    this.navigator.setTitle((this.page+1) + " / " + this.pages.length);
};

PopupHelp.prototype.createPanel = function() {
    let container = this.getContainer("panel");

    let group = container.group;

    this.panel = new Panel(this.game);
    this.panel.createTitle("Help");
    group.addChild(this.panel);

    let button = new PanelButton(this.game, "X", "Red", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.close, this);
    this.panel.addButton(button);
    this.panel.background.tint = 0x000000;

    container.y = 0;
};

PopupHelp.prototype.createNavigator = function() {
    let container = this.getContainer("navigator");
    let group = container.group;

    this.navigator = new Panel(this.game, AnimatedState.Dimension.Navigator.height);
    this.navigator.createTitle("1 / 0");
    group.addChild(this.navigator);

    this.previousButton = new PanelButton(this.game, "<", "Green", AnimatedState.Dimension.Navigator);
    this.previousButton.direction = -1;
    this.previousButton.onClicked.add(this.changePage, this);
    this.navigator.addButton(this.previousButton);
    
    this.nextButton = new PanelButton(this.game, ">", "Green", AnimatedState.Dimension.Navigator);
    this.nextButton.x = this.navigator.width - this.nextButton.width;
    this.nextButton.direction = 1;
    this.nextButton.onClicked.add(this.changePage, this);
    this.navigator.addButton(this.nextButton);
    this.navigator.background.tint = 0x000000;

    container.y = this.maxHeight - group.height;
};

PopupHelp.prototype.changePage = function(button) {
    this.page += button.direction;
    this.updateNavigator();

    this.pages.forEach(function(container) {
        container.group.alpha = 0;
    }, this);

    this.pages[this.page].group.alpha = 1;
};
