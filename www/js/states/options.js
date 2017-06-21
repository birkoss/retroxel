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
    button.onClicked.add(this.onBtnBackClicked, this);
    this.panel.addButton(button);

    /* Create the settings */
    this.settingsContainer = this.game.add.group();
    this.settingsContainer.animation = AnimatedState.Animation.SlideRight;

    /*
    let button = new PanelButton(this.game, __("Play"), "", {width:200, height:60});
    button.y = (this.game.height/4*2) - button.height/2;
    button.x = (this.game.width - button.width)/2;
    button.onClicked.add(this.loadPuzzles, this);
    this.buttonsContainer.addChild(button);
    */
    this.settings = [
    {
        "label":"Language", 
        "values": [
        {"label":"FR", "value":"fr"},
        {"label":"EN", "value":"en"}
        ],
        "config": GAME.config.lang
    },
    {
        "label":"Music", 
        "values": [
        {"label":"ON", "value":true},
        {"label":"OFF", "value":false}
        ],
        "config": GAME.config.music
    },
    {
        "label":"Sound",
        "values": [
        {"label":"ON", "value":true},
        {"label":"OFF", "value":false}
        ],
        "config": GAME.config.sound
    }
    ];

    console.log(GAME.config);

    let startAt = 0;
    this.toggles = {};
    this.settings.forEach(function(setting) {
        let text = this.game.add.bitmapText(this.game.width/4, startAt-3, "font:gui", setting.label, 20);
        text.x -= text.width/2;
        this.settingsContainer.addChild(text);

        let startX = this.game.width/4*3;
        let rowHeight = 0;
        setting.values.forEach(function(toggle) {
            let button = new PanelButton(this.game, __(toggle.label), (setting.config == toggle.value ? "Green" : "Red"), {width:60, height:60});
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
    //this.containers.push(this.settingsContainer);
    this.containers.push(this.panelContainer);

    this.show();
};

GAME.Options.prototype.loadPuzzles = function() {
    this.hide(this.stateLoadPuzzles, this);
};

GAME.Options.prototype.stateLoadPuzzles = function() {
    this.state.start('ChoosePuzzle');
};

GAME.Options.prototype.onBtnBackClicked = function(button) {
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
    if (button.toggleSetting.config != button.toggleValue.value) {
        button.toggleSetting.config = button.toggleValue.value;
        console.log(button.toggleSetting.config);
        console.log(GAME.config);
        this.updateToggle(button);
    }
};
