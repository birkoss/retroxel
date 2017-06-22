var GAME = GAME || {};

GAME.Options = function() {};

GAME.Options.prototype = new AnimatedState();

GAME.Options.prototype.create = function() {
    /* Create the panel */
    this.panelContainer = this.game.add.group();
    this.panelContainer.animation = AnimatedState.Animation.SlideDown;

    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);
    this.panel.createTitle(__("Options"));

    let button = new PanelButton(this.game, "X", "Red", AnimatedState.Dimension.Panel);
    button.onClicked.add(this.loadMain, this);
    this.panel.addButton(button);

    /* Create the settings */
    this.settingsContainer = this.game.add.group();
    this.settingsContainer.animation = AnimatedState.Animation.SlideRight;

    this.settings = [
    {
        "label":__("Language"),
        "values": [
        {"label":"FR", "value":"fr"},
        {"label":"EN", "value":"en"}
        ],
        "config": "lang"
    },
    {
        "label":__("Music"),
        "values": [
        {"label":__("ON"), "value":true},
        {"label":__("OFF"), "value":false}
        ],
        "config": "music"
    },
    {
        "label":__("Sound"),
        "values": [
        {"label":__("ON"), "value":true},
        {"label":__("OFF"), "value":false}
        ],
        "config": "sound" 
    }
    ];

    let startAt = 0;
    this.toggles = {};
    this.settings.forEach(function(setting) {
        let text = this.game.add.bitmapText(this.game.width/4, startAt-3, "font:gui", setting.label, 20);
        text.x -= text.width/2;
        this.settingsContainer.addChild(text);

        let startX = this.game.width/4*3;
        let rowHeight = 0;
        setting.values.forEach(function(toggle) {
            let button = new PanelButton(this.game, __(toggle.label), (GAME.config[setting.config] == toggle.value ? "Green" : "Red"), {width:60, height:60});
            startX -= button.width;
            button.toggleSetting = setting;
            button.toggleValue = toggle;
            button.onClicked.add(this.toggleSetting, this);
            button.y = startAt;
            button.x = startX;
            button.x -= button.width/2;
            startX += button.width * 2;

            this.toggles[setting.label+"_"+toggle.value] = button;
            rowHeight = button.height;
            this.settingsContainer.addChild(button);
        }, this);

        text.y += (rowHeight - text.height) / 2;
        startAt = this.settingsContainer.height + 32;
    }, this);

    this.settingsContainer.y = (this.game.height - this.settingsContainer.height) / 2;

    /* Prepare the animations */
    this.containers.push(this.settingsContainer);
    this.containers.push(this.panelContainer);

    this.show();
};

GAME.Options.prototype.loadMain = function() {
    this.hide(this.stateLoadMain, this);
};

GAME.Options.prototype.stateLoadPuzzles = function() {
    this.state.start('ChoosePuzzle');
};

GAME.Options.prototype.stateLoadMain = function(button) {
    this.state.start("Main");
};

GAME.Options.prototype.updateToggle = function(button) {
    /* Toggle all button OFF */
    button.toggleSetting.values.forEach(function(toggle) {
        this.toggles[button.toggleSetting.label+"_"+toggle.value].spriteSheet = "Red";
        this.toggles[button.toggleSetting.label+"_"+toggle.value].showNormal();
    }, this);

    /* Show the correct toggle */
    button.spriteSheet = "Green";
    button.showNormal();
};

GAME.Options.prototype.toggleSetting = function(button) {
    if (GAME.config[button.toggleSetting.config] != button.toggleValue.value) {
        GAME.config[button.toggleSetting.config] = button.toggleValue.value;
        GAME.save();
        this.updateToggle(button);
    }
};
