"use strict";

class King extends Piece {
    constructor(game, i, j, imageSrc, color) {
        super(game, i, j, imageSrc, color);
    }

    getValidMoves() {
        let validMoves = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const iNew = this.i + i;
                const jNew = this.j + j;

                const isInBoardRange = this.isInBoardRange(iNew, jNew);
                if (isInBoardRange) {
                    const piece = this.game.boardData[iNew][jNew];

                    if (piece == null || piece.color !== this.color) {
                        validMoves.push([iNew, jNew]);
                    }
                }
            }
        }

        return validMoves;
    }
}
class KingWhite extends King {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/white-king.png", "w");
    }
}
class KingBlack extends King {
    constructor(game, i, j) {
        super(game, i, j, "../assets/images/black-king.png", "b");
    }
}