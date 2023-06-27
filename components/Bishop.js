"use strict";

class Bishop extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }
}
class BishopWhite extends Bishop {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-bishop.png", "w");
    }
}
class BishopBlack extends Bishop {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-bishop.png", "b");
    }
}