"use strict";

class Knight extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }
}
class KnightWhite extends Knight {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-knight.png", "w");
    }
}
class KnightBlack extends Knight {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-knight.png", "b");
    }
}