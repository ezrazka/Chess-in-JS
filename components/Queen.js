"use strict";

class Queen extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }
}
class QueenWhite extends Queen {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-queen.png", "w");
    }
}
class QueenBlack extends Queen {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-queen.png", "b");
    }
}