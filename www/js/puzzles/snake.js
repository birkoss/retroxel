var PUZZLE = PUZZLE || {};

PUZZLE.Snake = function() {
    this.onCompleted = new Phaser.Signal();
};

PUZZLE.Snake.prototype = Object.create(PUZZLE.Puzzle.prototype);
PUZZLE.Snake.prototype.constructor = PUZZLE.Snake;

PUZZLE.Snake.prototype.create = function(puzzle, grid) {
    this.puzzle = puzzle;
    this.grid = grid;

    this.grid.colors['toggled'] = 0x4493a0;
    this.grid.colors['label'] = 0x666666;
    this.grid.colors['disabled'] = 0x85c226;
    this.grid.colors['labelNormal'] = 0xffffff;
    this.grid.colors['labelCorrect'] = 0xaaaaaa;
    this.grid.colors['labelOver'] = 0xff795e;
    this.grid.onTileToggled.add(this.refreshGrid, this);

    let labels = {x:[], y:[]};
    let index = 0;
    for (let gridY=0; gridY<puzzle.height; gridY++) {
        let totalX = 0;
        for (let gridX=0; gridX<puzzle.width; gridX++) {
            index = (gridY * puzzle.width) + gridX;
            totalX += (puzzle.answer[index] == "#" ? 1 : 0);
            if (labels.y.length <= gridX) {
                labels.y.push(0);
            }
            labels.y[gridX] += (puzzle.answer[index] == "#" ? 1 : 0);
        }
        labels.x.push(totalX);
    }

    this.grid.tiles[puzzle.start.gridY][puzzle.start.gridX].disable(this.grid.colors.disabled);
    this.grid.tiles[puzzle.end.gridY][puzzle.end.gridX].disable(this.grid.colors.disabled);
    grid.createLabel(labels.y, "x", 0);
    grid.createLabel(labels.x, "y", 0);

    this.refreshGrid();
};

PUZZLE.Snake.prototype.refreshGrid = function() {
    let answer = "";

    /* Get all totals */
    let totals = {x:[], y:[]};
    let toggled = 0;
    for (let gridY=0; gridY<this.grid.gridHeight; gridY++) {
        let totalX = 0;
        for (let gridX=0; gridX<this.grid.gridWidth; gridX++) {
            toggled = (this.grid.tiles[gridY][gridX].isToggled || this.grid.tiles[gridY][gridX].isDisabled ? 1 : 0);
            answer += (toggled == 1 ? "#" : ".");
            totalX += toggled;
            if (totals.y.length <= gridX) {
                totals.y.push(0);
            }
            totals.y[gridX] += toggled;
        }
        totals.x.push(totalX);
    }

    /* Compare with the labels */
    let labels = [
    {total: totals.x, labels: this.grid.labels.y},
    {total: totals.y, labels: this.grid.labels.x},
    ];
    labels.forEach(function(label) {
        let index = 0;
        label.total.forEach(function(total) {
            let color = this.grid.colors.labelNormal;
            if (label.labels[index].label.text == total) {
                color = this.grid.colors.labelCorrect;
            } else if (label.labels[index].label.text < total) {
                color = this.grid.colors.labelOver;
            }
            label.labels[index].label.tint = color;
            index++;
        }, this);
    }, this);

    if (this.puzzle.answer == answer) {
        this.onCompleted.dispatch(this);
    }
};

PUZZLE.Snake.prototype.getHelpPages = function(popup) {
    popup.addPage({'text':"You need to places light bulbs in white cells until the entire grid is lit up."});
    popup.addPage({'text':"A bulb sends rays of light horizontally and vertically, illuminating its entire row and column unless its light is blocked by a black cell."});
    popup.addPage([{
        'text':"Rules #1\n\nNo two bulbs illuminate on each other."
    },{
        "text":"This is an example of two bulbs illuminating each other:"
    },{
        "img":"help:rule1-wrong"
        }
    ]);
    popup.addPage([{'text':"Rules #2\n\nA black cell may have a number on it from 0 to 4, indicating how many bulbs must be placed adjacent to its four sides."},{"img":"help:rule2"}]);
    popup.addPage({'text':"Rules #3\n\nAn unnumbered black cell may have any number of light bulbs adjacent to it, or none. Bulbs placed diagonally adjacent to a numbered cell do not contribute to the bulb count."});
};
