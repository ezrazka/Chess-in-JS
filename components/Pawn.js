"use strict";

class Pawn extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }
}
class PawnWhite extends Pawn {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-pawn.png", "w");
    }
}
class PawnBlack extends Pawn {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-pawn.png", "b");
    }
}