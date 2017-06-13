var GAME = GAME || {};

GAME.Difficulty = function() {};

GAME.Difficulty.prototype = {
    create: function() {
        this.backgroundContainer = this.game.add.group();
        this.titleContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        let text = this.game.add.bitmapText(0, 0, "font:gui", "Difficulty", 30);
        text.y = (this.game.height/4) - text.height/2;
        text.x = (this.game.width - text.width) / 2;
        this.titleContainer.addChild(text);

        let difficulties = [
            {label:"Easy", color:""},
            {label:"Medium", color:"Green"},
            {label:"Hard", color:"Red"}
        ];
        difficulties.forEach(function(difficulty) {
            let button = new PanelButton(this.game, difficulty.label, difficulty.color);
            button.difficulty = difficulty.label;
            button.y = (this.game.height/4*2) - button.height/2 + (this.buttonsContainer.height > 0 ? this.buttonsContainer.height + 36 : 0);
            button.x = (this.game.width - button.width)/2;
            button.onClicked.add(this.onDifficultyButtonClicked, this);
            this.buttonsContainer.addChild(button);
        }, this);

        this.titleContainer.originalX = this.titleContainer.x;
        this.buttonsContainer.originalX = this.buttonsContainer.x;
        this.titleContainer.destinationX = this.titleContainer.x - this.game.width;
        this.buttonsContainer.destinationX = this.buttonsContainer.x + this.game.width;

        this.titleContainer.x = this.titleContainer.destinationX;
        this.buttonsContainer.x = this.buttonsContainer.destinationX;

        this.show();
    },
    show: function() {
        this.game.add.tween(this.titleContainer).to({x:this.titleContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
        this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.originalX}, GAME.config.speed, Phaser.Easing.Elastic.Out).start();
    },
    hide: function(callback, context) {
        this.game.add.tween(this.titleContainer).to({x:this.titleContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        let tween = this.game.add.tween(this.buttonsContainer).to({x:this.buttonsContainer.destinationX}, GAME.config.speed, Phaser.Easing.Elastic.In).start();
        tween.onComplete.add(callback, context);
    },
    onDifficultyButtonClicked: function(button) {
        GAME.config.puzzleDifficulty = button.difficulty;
        this.hide(function() { this.state.start("Level") }, this);
    }
};
