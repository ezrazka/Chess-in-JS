"use strict";

class Piece {
    constructor(game, i, j, imageSrc, color) {
        this.game = game;
        this.i = i;
        this.j = j;
        this.imageSrc = imageSrc;
        this.color = color;
        this.validMoves = [];
    }

    getIndexesFromNotation(notation) {
        const letter = notation[0];
        const number = notation[1];

        const i = letter.charCodeAt() - 97;
        const j = parseInt(number) - 1;

        return [i, j];
    }

    isInBoardRange(i, j) {
        const iInRange = i >= 0 && i < 8;
        const jInRange = j >= 0 && j < 8;

        return iInRange && jInRange;
    }

    getValidMoves() {}
}