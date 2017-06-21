var GAME = GAME || {};

GAME.config = {
    puzzleName:"Snake",
    puzzleDifficulty:"Easy",
    puzzleLevel:1,
    speed:800,
    lang:"fr",
    music:false,
    sound:false
};

GAME.config.puzzles = {
    "Akari": {
        Easy:[], 
        Medium:[], 
        Hard:[]
    },
    "Snake": {
        Easy:[], 
        Medium:[], 
        Hard:[]
    }
}

GAME.scale = {sprite:3, normal:1};
GAME.scale.normal = Math.max(1, Math.min(6, Math.floor(window.innerWidth / 320) * 2));

GAME.save = function() {
    let fields = ["puzzles", "puzzleName", "puzzleDifficulty", "puzzleLevel", "lang", "music", "sound"];

    let data = {};
    fields.forEach(function(field) {
        data[field] = GAME.config[field];
    }, this);

    localStorage.setItem('game_config', JSON.stringify(data));
};

/* Better loading methods to NOW overwrite the defaults puzzles config */
GAME.load = function() {
    let data = localStorage.getItem('game_config');
    if (data != null) {
        data = JSON.parse(data);

        for (let obj in data) {
            switch (typeof data[obj]) {
                case 'object':
                    GAME.config[obj] = Object.assign(GAME.config[obj], data[obj]);
                    break;
                default:
                    GAME.config[obj] = data[obj];
            }
        }
    }
};

GAME.load();

function __(key) {
    /* @TODO Need a better check bellow to prevent Phaser to query the cache */
    if (GAME.game.cache.getJSON("text:" + GAME.config.lang)) {
        let text = GAME.game.cache.getJSON("text:" + GAME.config.lang)[key];
        if (text != null) {
            key = text;
        }
    }

    return key;
}

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Main', GAME.Main);
GAME.game.state.add('Options', GAME.Options);
GAME.game.state.add('ChoosePuzzle', GAME.ChoosePuzzle);
GAME.game.state.add('ChooseDifficulty', GAME.ChooseDifficulty);
GAME.game.state.add('ChooseLevel', GAME.ChooseLevel);
GAME.game.state.add('PlayPuzzle', GAME.PlayPuzzle);

GAME.game.state.start('Boot');
