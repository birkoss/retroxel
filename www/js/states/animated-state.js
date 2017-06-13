function AnimatedState() {
    this.containers = [];
};

AnimatedState.Animation = {
    SlideUp: "slide_up",
    SlideDown: "slide_down",
    SlideRight: "slide_right"
};

AnimatedState.Speed = 500;

AnimatedState.Dimension = {
    Panel:{width:60, height:60}
};

AnimatedState.prototype = {
    show: function() {
        /* Initialise positions and hide the containers */
        this.containers.forEach(function(container) {
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                    container.originalY = container.y;
                    container.destinationY = container.y - container.height;

                    container.y = container.destinationY;
                    break;
                case AnimatedState.Animation.SlideRight:
                    container.originalX = container.x;
                    container.destinationX = container.x + this.game.width;

                    container.x = container.destinationX;
                    break;
            }
        }, this);

        /* Show the containers */
        this.containers.forEach(function(container) {
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                    this.game.add.tween(container).to({y:container.originalY}, AnimatedState.Speed, Phaser.Easing.Elastic.Out).start();
                    break;
                case AnimatedState.Animation.SlideRight:
                    this.game.add.tween(container).to({x:container.originalX}, AnimatedState.Speed, Phaser.Easing.Elastic.Out).start();
                    break;
            }
        }, this);
    },
    hide: function(callback, context) {
        this.callback = callback;

        this.containers.forEach(function(container) {
            let tween = null;
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                    tween = this.game.add.tween(container).to({y:container.destinationY}, AnimatedState.Speed, Phaser.Easing.Elastic.Out);
                    break;
                case AnimatedState.Animation.SlideRight:
                    tween = this.game.add.tween(container).to({x:container.destinationX}, AnimatedState.Speed, Phaser.Easing.Elastic.Out);
                    break;
            }

            if (tween != null) {
                tween.onComplete.add(this.onTweenCompleted, context);
                tween.start();
            }

        }, this);
    },
    onTweenCompleted: function() {
        console.log(this.game.tweens.getAll());
        console.log(this.game.tweens.getAll().length);
        if (this.game.tweens.getAll().length == 1) {
            if (this.callback != null) {
                this.callback();
                this.callback = null;
            }
        }
    }
};

