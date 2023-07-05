"use strict";

class Board {
    constructor(game, showNotation) {
        this.game = game;
        this.showNotation = showNotation;
        this.isWhitePerspective = true;

        this.initializeBoard();
    }

    reverseChildrenOfElements(elements) {
        for (let i = 0; i < elements.length / 2; i++) {
            const elementFirst = elements[i];
            const elementLast = elements[elements.length - 1 - i];

            const elementFirstChildren = Array.from(elementFirst.children);
            const elementLastChildren = Array.from(elementLast.children);

            [...elementFirstChildren, ...elementLastChildren].forEach((elementChild) => {
                elementChild.remove();
            });

            elementFirstChildren.forEach((elementFirstChild) => {
                elementLast.appendChild(elementFirstChild);
            });

            elementLastChildren.forEach((elementLastChild) => {
                elementFirst.appendChild(elementLastChild);
            });
        }
    }

    insertSquareChild(square, squareChild) {
        square.appendChild(squareChild);

        const squareChildrenSelectors = [
            ".notation-letter",
            ".notation-number",
            ".square-highlight",
            ".square-outline",
            ".piece-icon"
        ];

        squareChildrenSelectors.forEach((squareChildrenSelector) => {
            const squareChildren = square.querySelectorAll(squareChildrenSelector);

            squareChildren.forEach((squareChild) => {
                square.appendChild(squareChild);
            });
        });
    }

    addDragEventListeners() {
        const pieceIcons = document.querySelectorAll(".piece-icon");
        
        pieceIcons.forEach((pieceIcon) => {
            const onMouseDown = (event) => {
                event.preventDefault();
        
                pieceIcon.classList.add("dragging");
        
                onMouseMove(event);
    
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }

            const onMouseMove = (event) => {
                pieceIcon.style.transform = "";
                
                const board = document.getElementById("board");
    
                const boardRect = board.getBoundingClientRect();
                const pieceIconRect = pieceIcon.getBoundingClientRect();
    
                const pieceIconCenterX1 = pieceIconRect.left + pieceIconRect.width / 2;
                const pieceIconCenterY1 = pieceIconRect.top + pieceIconRect.height / 2;
                const pieceIconCenterX2 = Math.max(Math.min(event.clientX, boardRect.right), boardRect.left);
                const pieceIconCenterY2 = Math.max(Math.min(event.clientY, boardRect.bottom), boardRect.top);
    
                const pieceIconCenterDX = pieceIconCenterX2 - pieceIconCenterX1;
                const pieceIconCenterDY = pieceIconCenterY2 - pieceIconCenterY1;
    
                pieceIcon.style.transform = `translate(${pieceIconCenterDX}px, ${pieceIconCenterDY}px)`;
    
                const squareOutline = document.querySelector(".square-outline");
                squareOutline?.remove();
    
                const hoveredElements = document.elementsFromPoint(event.clientX, event.clientY);
                const hoveredSquare = hoveredElements.find((hoveredElement) => {
                    return hoveredElement.matches(".square");
                });
    
                if (hoveredSquare != null) {
                    const hoveredSquareOutline = document.createElement("div");
                    hoveredSquareOutline.className = "square-outline";
    
                    this.insertSquareChild(hoveredSquare, hoveredSquareOutline);
                }
            }

            const onMouseUp = (event) => {
                // const piece = this.getPieceFrompieceIcon(pieceIcon);
                // console.log(piece)

                // console.log(piece.validMoves);
                // console.log(piece?.validMoves.includes([this.getElementIndex(hoveredSquare.parentElement), this.getElementIndex(hoveredSquare)]))

                const initialSquare = pieceIcon.parentElement;

                const hoveredElements = document.elementsFromPoint(event.clientX, event.clientY);
                const hoveredSquare = hoveredElements.find((hoveredElement) => {
                    return hoveredElement.matches(".square");
                });

                if (hoveredSquare != null) {
                    const hoveredPieceIcon = hoveredSquare.querySelector(".piece-icon");
                    hoveredPieceIcon?.remove();

                    this.insertSquareChild(hoveredSquare, pieceIcon);
                } else {
                    this.insertSquareChild(initialSquare, pieceIcon);
                }
                
                pieceIcon.style.transform = "";
                pieceIcon.classList.remove("dragging");

                const squareOutline = document.querySelector(".square-outline");
                squareOutline?.remove();

                const squareHighlight = document.createElement("div");
                squareHighlight.className = "square-highlight";

                if (hoveredSquare != null && initialSquare !== hoveredSquare) {
                    const squareHighlights = document.querySelectorAll(".square-highlight");

                    squareHighlights.forEach((squareHighlight) => {
                        squareHighlight.remove();
                    });

                    this.insertSquareChild(initialSquare, squareHighlight);
                    this.insertSquareChild(hoveredSquare, squareHighlight.cloneNode());
                }
                
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            pieceIcon.addEventListener("mousedown", onMouseDown);
        });
    }

    loadPieces() {
        const rows = document.querySelectorAll(".row");

        rows.forEach((row, rowIndex) => {
            const squares = row.querySelectorAll(".square");

            squares.forEach((square, squareIndex) => {
                const piece = this.game.boardData[rowIndex][squareIndex];

                if (piece == null) {
                    return;
                }

                const pieceIcon = document.createElement("div");
                pieceIcon.className = "piece-icon";
                pieceIcon.style.backgroundImage = `url(${piece.imageSrc})`;

                this.insertSquareChild(square, pieceIcon);
            });
        });

        this.addDragEventListeners();
    }
    
    loadNotation() {
        const notationLetterSquares = document.querySelectorAll(".row:last-child .square");
        const notationNumberSquares = document.querySelectorAll(".square:first-child");
        
        notationLetterSquares.forEach((notationLetterSquare, index) => {
            const notationLetter = document.createElement("span");
            notationLetter.textContent = String.fromCharCode(this.isWhitePerspective ? 97 + index : 104 - index);
            notationLetter.className = "notation-letter";

            this.insertSquareChild(notationLetterSquare, notationLetter);
        });
        
        notationNumberSquares.forEach((notationNumberSquare, index) => {
            const notationNumber = document.createElement("span");
            notationNumber.textContent = this.isWhitePerspective ? 8 - index : index + 1;
            notationNumber.className = "notation-number";

            this.insertSquareChild(notationNumberSquare, notationNumber);
        });
    }

    flipBoard() {
        const rows = document.querySelectorAll('.row');
        this.reverseChildrenOfElements(rows);

        rows.forEach((row) => {
            const squares = row.querySelectorAll('.square');
            this.reverseChildrenOfElements(squares);
        });

        if (this.showNotation) {
            const notationLetters = document.querySelectorAll(".notation-letter");
            const notationNumbers = document.querySelectorAll(".notation-number");

            [...notationLetters, ...notationNumbers].forEach((notationCharacter) => {
                notationCharacter.remove()
            });

            this.isWhitePerspective = !this.isWhitePerspective;
            this.loadNotation();
        }
    }

    initializeBoard() {
        this.loadPieces();

        if (this.showNotation) {
            this.loadNotation();
        }

        this.flipBoard();
    }
}