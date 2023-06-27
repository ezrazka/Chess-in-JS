"use strict";

class Game {
    constructor(fen) {
        this.fen = fen;
        this.piecePlacement = this.fen.split(" ")[0];
        this.activeColor = this.fen.split(" ")[1];
        this.castlingRights = this.fen.split(" ")[2];
        this.enPassantSquare = this.fen.split(" ")[3];
        this.halfMoves = this.fen.split(" ")[4];
        this.fullMoves = this.fen.split(" ")[5];

        this.updateBoardData();

        this.board = new Board(this, 512, "antiquewhite", "indianred", true);
    }

    getPiece(pieceLetter, i, j) {
        switch (pieceLetter) {
            case "K":
                return new KingWhite(this, i, j);
            case "Q":
                return new QueenWhite(this, i, j);
            case "R":
                return new RookWhite(this, i, j);
            case "N":
                return new KnightWhite(this, i, j);
            case "B":
                return new BishopWhite(this, i, j);
            case "P":
                return new PawnWhite(this, i, j);
            case "k":
                return new KingBlack(this, i, j);
            case "q":
                return new QueenBlack(this, i, j);
            case "r":
                return new RookBlack(this, i, j);
            case "n":
                return new KnightBlack(this, i, j);
            case "b":
                return new BishopBlack(this, i, j);
            case "p":
                return new PawnBlack(this, i, j);
        }
    }

    updateBoardData() {
        const rankStrings = this.piecePlacement.split("/");

        this.boardData = Array.from({ length: 8 }, () => []);

        this.boardData.forEach((row, rowIndex) => {
            Array.from(rankStrings[rowIndex]).forEach((char) => {
                const isDigit = char.match(/\d/);

                if (isDigit) {
                    for (let i = 0; i < parseInt(char); i++) {
                        row.push(null);
                    }
                } else {
                    const piece = this.getPiece(char, rowIndex, row.length);
                    row.push(piece);
                }
            });
        });

        this.boardData.forEach((row) => {
            row.forEach((piece) => {
                if (piece != null) {
                    piece.validMoves = piece.getValidMoves() ?? piece.validMoves;
                }
            });
        });
    }









    swapTurns() {
        this.activeColor = this.activeColor === "w" ? "b" : "w";
    }

    removeCastlingRight(castlingRight) {
        this.castlingRights = this.castlingRights.replace(castlingRight, "");
    }

    resetHalfMoves() {
        this.halfMoves = 0;
    }
}