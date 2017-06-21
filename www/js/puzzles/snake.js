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

    /* Mark START and END as disabled */
    puzzle.disabledTiles.forEach(function(tile) {
        this.grid.tiles[tile.gridY][tile.gridX].disable(this.grid.colors.disabled);
    }, this);

    /* Create the new labels tile */
    grid.createLabel(labels.y, "x", 0);
    grid.createLabel(labels.x, "y", 0);

    /* If this puzzle has disabledLabels, hide them */
    if (puzzle.disabledLabels != null) {
        puzzle.disabledLabels.forEach(function(label) {
            this.grid.labels[label.gridX == this.grid.gridWidth ? 'y' : 'x'][label.gridX == this.grid.gridWidth ? label.gridY : label.gridX].label.alpha = 0;
        }, this);
    }

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
    popup.addPage({'text':"To complete..."});
};
