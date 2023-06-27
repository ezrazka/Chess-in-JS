"use strict";

class Rook extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }
}
class RookWhite extends Rook {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-rook.png", "w");
    }
}
class RookBlack extends Rook {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-rook.png", "b");
    }
}