var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.backgroundContainer = this.game.add.group();
        this.titleContainer = this.game.add.group();
        this.levelsContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        let text = this.game.add.bitmapText(0, 0, "font:gui", GAME.config.puzzleDifficulty, 30);
        text.x = (this.game.width - text.width) / 2;
        this.titleContainer.addChild(text);

        this.previousButton = new PanelButton(this.game, "<-", "Green", true);
        this.previousButton.direction = -1;
        this.previousButton.onClicked.add(this.onBtnNavigationClicked, this);
        this.titleContainer.addChild(this.previousButton);

        this.nextButton = new PanelButton(this.game, "->", "Green", true);
        this.nextButton.direction = 1;
        this.nextButton.onClicked.add(this.onBtnNavigationClicked, this);
        this.nextButton.x = this.game.width-this.nextButton.width;
        this.titleContainer.addChild(this.nextButton);

        text.y = (this.nextButton.height - 30) / 2;

        this.page = 0;
        this.limit = 20;
        this.createLevels();
        this.levelsContainer.x = (this.game.width - this.levelsContainer.width) / 2;
        this.levelsContainer.y = (this.game.height - this.levelsContainer.height) / 2;

        this.titleContainer.originalY = this.titleContainer.y;
        this.levelsContainer.originalX = this.levelsContainer.x;
        this.buttonsContainer.originalX = this.buttonsContainer.x;
        this.titleContainer.destinationY = this.titleContainer.y - this.game.height;
        this.levelsContainer.destinationX = this.levelsContainer.x - this.game.width;
        this.buttonsContainer.destinationX = this.buttonsContainer.x + this.game.width;


        this.backButton = new PanelButton(this.game, "Back", "Green");
        this.backButton.onClicked.add(this.onBtnBackClicked, this);
        this.backButton.y = this.levelsContainer.y + this.levelsContainer.height + ((this.game.height - this.levelsContainer.height - this.levelsContainer.y) - this.backButton.height) / 2;
        this.backButton.x = (this.game.width - this.backButton.width) / 2;
        this.buttonsContainer.addChild(this.backButton);

        this.titleContainer.y = this.titleContainer.destinationY;
        this.levelsContainer.x = this.levelsContainer.destinationX;
        this.buttonsContainer.x = this.buttonsContainer.destinationX;

        this.show();
    },
    createLevels: function() {
        this.levelsContainer.removeAll(true);

        let padding = 16;
        let index = (this.page * this.limit);
        for (let y=0; y<5; y++) {
            for (let x=0; x<4; x++) {
                let button = new PanelButton(this.game, ++index, "", true);
                if (GAME.config.puzzles[GAME.config.puzzleName][GAME.config.puzzleDifficulty].indexOf(index) == -1) {
                    button.disable();
                } else {
                    button.onClicked.add(this.onBtnLevelClicked, this);
                }
                button.level = index;
                button.x = x * (button.width + (padding/2));
                button.y = y * (button.height + (padding/2));
                this.levelsContainer.addChild(button);
            }
        }

        if (this.page == 0) {
            this.previousButton.disable();
        } else {
            this.previousButton.enable();
        }

        if ((this.page * this.limit) + this.limit >= 100) {
            this.nextButton.disable();
        } else {
            this.nextButton.enable();
        }
    },
    show: function() {
        this.game.add.tween(this.titleContainer).to({y:this.titleContainer.originalY}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
        this.game.add.tween(this.levelsContainer).to({x:this.levelsContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
        this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
    },
    hide: function(callback, context) {
        this.game.add.tween(this.titleContainer).to({y:this.titleContainer.destinationY}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        this.game.add.tween(this.levelsContainer).to({x:this.levelsContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        let tween = this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        tween.onComplete.add(callback, context);
    },
    onBtnBackClicked: function() {
        this.hide(function() { this.state.start("Difficulty") }, this);
    },
    onBtnNavigationClicked: function(button) {
        this.page += button.direction;
        this.createLevels();
    },
    onBtnLevelClicked: function(button) {
        GAME.config.puzzleLevel = button.level;
        this.hide(function() { this.state.start("Game") }, this);
    }
};
