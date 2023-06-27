"use strict";

class Board {
    constructor(game, maxSize, lightSquareColor, darkSquareColor, notation) {
        this.game = game;
        this.maxSize = maxSize;
        this.lightSquareColor = lightSquareColor;
        this.darkSquareColor = darkSquareColor;
        this.notation = notation;

        this.size = Math.min(maxSize, screen.width, screen.height);
        this.isWhitePerspective = true;
    }

    getElementIndex(element) {
        const elementParent = element.parentElement;
        const elementIndex = Array.from(elementParent.children).indexOf(element);

        return elementIndex;
    }

    reverseChildrenOfElements(elements) {
        for (let i = 0; i < elements.length / 2; i++) {
            const elementFirst = elements[i];
            const elementLast = elements[elements.length - 1 - i];

            const elementFirstChildren = Array.from(elementFirst.children);
            const elementLastChildren = Array.from(elementLast.children);

            elementFirstChildren.forEach((elementFirstChild) => {
                elementFirstChild.remove();
            });
            
            elementLastChildren.forEach((elementLastChild) => {
                elementLastChild.remove();
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
            ".squareRect",
            ".notationLetter",
            ".notationNumber",
            ".squareRectHighlight",
            ".squareRectStroke",
            ".pieceImage"
        ];

        squareChildrenSelectors.forEach((squareChildrenSelector) => {
            const squareChildren = square.querySelectorAll(squareChildrenSelector);

            squareChildren.forEach((squareChild) => {
                square.appendChild(squareChild);
            });
        });
    }

    getPieceFromPieceImage(initialPieceImage) {
        let piece = null;

        const rows = document.querySelectorAll(".row");

        rows.forEach((row, rowIndex) => {
            const squares = row.querySelectorAll(".square");

            squares.forEach((square, squareIndex) => {
                const pieceImage = square.querySelector(".pieceImage");

                console.log(pieceImage, initialPieceImage)
                if (pieceImage !== initialPieceImage) {
                    return;
                }
                
                piece = this.game.boardData[rowIndex][squareIndex];
            });
        });

        return piece;
    }

    addDragEventListeners() {
        const squareSize = this.size / 8;
        const strokeWidth = this.size / 128;
        
        let initialSquare = null;
        
        const board = document.getElementById("board");
        const pieceImages = document.querySelectorAll(".pieceImage");
        
        pieceImages.forEach((pieceImage) => {
            const onMouseDown = (event) => {
                event.preventDefault();

                initialSquare = pieceImage.parentElement;
                
                board.appendChild(pieceImage);

                onMouseMove(event);
                
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }

            const onMouseMove = (event) => {
                const boardOffsetLeft = parseInt(board.getBoundingClientRect().left);
                const boardOffsetTop = parseInt(board.getBoundingClientRect().top);

                const pieceImageX = event.clientX - boardOffsetLeft - squareSize / 2;
                const pieceImageY = event.clientY - boardOffsetTop - squareSize / 2;
                const positiveLimit = this.size - squareSize / 2;
                const negativeLimit = -(squareSize / 2);
                
                pieceImage.setAttribute("x", Math.max(Math.min(pieceImageX, positiveLimit), negativeLimit));
                pieceImage.setAttribute("y", Math.max(Math.min(pieceImageY, positiveLimit), negativeLimit));
                pieceImage.style.cursor = "grabbing";

                const squareRectStroke = document.querySelector(".squareRectStroke");
                squareRectStroke?.remove();

                const hoveredElements = document.elementsFromPoint(event.clientX, event.clientY);
                const hoveredSquareRect = hoveredElements.find((hoveredElement) => {
                    return hoveredElement.matches(".squareRect");
                });

                if (hoveredSquareRect == null) {
                    return;
                }

                const hoveredSquare = hoveredSquareRect.parentElement;

                const hoveredSquareRectStroke = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                hoveredSquareRectStroke.setAttribute("class", "squareRectStroke");
                hoveredSquareRectStroke.setAttribute("width", squareSize - strokeWidth);
                hoveredSquareRectStroke.setAttribute("height", squareSize - strokeWidth);
                hoveredSquareRectStroke.setAttribute("x", strokeWidth / 2);
                hoveredSquareRectStroke.setAttribute("y", strokeWidth / 2);
                hoveredSquareRectStroke.setAttribute("fill", "none");
                hoveredSquareRectStroke.setAttribute("stroke", "white");
                hoveredSquareRectStroke.setAttribute("stroke-opacity", 0.5);
                hoveredSquareRectStroke.setAttribute("stroke-width", strokeWidth);
                
                this.insertSquareChild(hoveredSquare, hoveredSquareRectStroke)
            }

            const onMouseUp = (event) => {
                const hoveredElements = document.elementsFromPoint(event.clientX, event.clientY);
                const hoveredSquareRect = hoveredElements.find((hoveredElement) => {
                    return hoveredElement.matches(".squareRect");
                });
                const hoveredSquare = hoveredSquareRect?.parentElement;
                const piece = this.getPieceFromPieceImage(pieceImage);
                // console.log(piece)

                pieceImage.setAttribute("x", 0);
                pieceImage.setAttribute("y", 0);
                pieceImage.style.cursor = "grab";

                console.log(piece.validMoves);
                console.log(piece?.validMoves.includes([this.getElementIndex(hoveredSquare.parentElement), this.getElementIndex(hoveredSquare)]))

                if (hoveredSquare != null && piece?.validMoves.includes([this.getElementIndex(hoveredSquare.parentElement), this.getElementIndex(hoveredSquare)])) {
                    hoveredSquare.querySelector(".pieceImage")?.remove();
                    this.insertSquareChild(hoveredSquare, pieceImage);
                } else {
                    this.insertSquareChild(initialSquare, pieceImage);
                }
                
                const squareRectStroke = document.querySelector(".squareRectStroke");
                squareRectStroke?.remove();

                const squareRectHighlight = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                squareRectHighlight.setAttribute("class", "squareRectHighlight");
                squareRectHighlight.setAttribute("width", squareSize);
                squareRectHighlight.setAttribute("height", squareSize);
                squareRectHighlight.setAttribute("x", 0);
                squareRectHighlight.setAttribute("y", 0);
                squareRectHighlight.setAttribute("fill", "yellow");
                squareRectHighlight.setAttribute("opacity", 0.5);

                if (hoveredSquare != null && initialSquare !== hoveredSquare) {
                    const squareRectHighlights = document.querySelectorAll(".squareRectHighlight");

                    squareRectHighlights.forEach((squareRectHighlight) => {
                        squareRectHighlight.remove();
                    });

                    this.insertSquareChild(initialSquare, squareRectHighlight);
                    this.insertSquareChild(hoveredSquare, squareRectHighlight.cloneNode());
                }
                
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            pieceImage.addEventListener("mousedown", onMouseDown);
        });
    }

    showPieces() {
        const squareSize = this.size / 8;
        
        const rows = document.querySelectorAll(".row");

        rows.forEach((row, rowIndex) => {
            const squares = row.querySelectorAll(".square");

            squares.forEach((square, squareIndex) => {
                const piece = this.game.boardData[rowIndex][squareIndex];

                if (piece === null) {
                    return;
                }

                const pieceImage = document.createElementNS("http://www.w3.org/2000/svg", "image");

                pieceImage.setAttribute("class", "pieceImage");
                pieceImage.setAttribute("x", 0);
                pieceImage.setAttribute("y", 0);
                pieceImage.setAttribute("width", squareSize);
                pieceImage.setAttribute("height", squareSize);
                pieceImage.setAttribute("href", piece.imageSrc);
                pieceImage.style.cursor = "grab";


                this.insertSquareChild(square, pieceImage);

            });
        });

        this.addDragEventListeners();
    }
    
    showNotation() {
        const squareSize = this.size / 8;
        const notationTextSize = this.size / 32;
        const notationTextPadding = this.size / 128;
        
        const notationLetterSquares = document.querySelectorAll(".row:last-child .square");
        const notationNumberSquares = document.querySelectorAll(".square:first-child");
        
        notationLetterSquares.forEach((notationLetterSquare, index) => {
            const notationLetter = document.createElementNS("http://www.w3.org/2000/svg", "text");
            notationLetter.innerHTML = this.isWhitePerspective
                ? String.fromCharCode(97 + index)
                : String.fromCharCode(104 - index);
            
            notationLetter.setAttribute("class", "notationLetter");
            notationLetter.setAttribute("x", squareSize - notationTextPadding);
            notationLetter.setAttribute("y", squareSize - notationTextPadding);
            notationLetter.setAttribute("dominant-baseline", "ideographic");
            notationLetter.setAttribute("text-anchor", "end");
            notationLetter.setAttribute("font-size", notationTextSize);
            notationLetter.setAttribute("font-weight", "bold");
            notationLetter.setAttribute("font-family", "Segoe UI, Tahoma, Geneva, Verdana, sans-serif");
            notationLetter.style.userSelect = "none";
            
            const squareRect = notationLetterSquare.querySelector(".squareRect");
            const squareRectColor = squareRect.getAttribute("fill");
            
            if (squareRectColor === this.lightSquareColor) {
                notationLetter.setAttribute("fill", this.darkSquareColor);
            } else {
                notationLetter.setAttribute("fill", this.lightSquareColor);
            }
            
            this.insertSquareChild(notationLetterSquare, notationLetter);
        });
        
        notationNumberSquares.forEach((notationNumberSquare, index) => {
            const notationNumber = document.createElementNS("http://www.w3.org/2000/svg", "text");
            notationNumber.innerHTML = this.isWhitePerspective
                ? 8 - index
                : index + 1;
            
            notationNumber.setAttribute("class", "notationNumber");
            notationNumber.setAttribute("x", notationTextPadding);
            notationNumber.setAttribute("y", notationTextPadding);
            notationNumber.setAttribute("dominant-baseline", "hanging");
            notationNumber.setAttribute("text-anchor", "start");
            notationNumber.setAttribute("font-size", notationTextSize);
            notationNumber.setAttribute("font-weight", "bold");
            notationNumber.setAttribute("font-family", "Segoe UI, Tahoma, Geneva, Verdana, sans-serif");
            notationNumber.style.userSelect = "none";
            
            const squareRect = notationNumberSquare.querySelector(".squareRect");
            const squareRectColor = squareRect.getAttribute("fill");

            if (squareRectColor === this.lightSquareColor) {
                notationNumber.setAttribute("fill", this.darkSquareColor);
            } else {
                notationNumber.setAttribute("fill", this.lightSquareColor);
            }

            this.insertSquareChild(notationNumberSquare, notationNumber);
        });
    }

    flipBoard() {
        const board = document.getElementById("board");

        const rows = board.querySelectorAll('.row');
        this.reverseChildrenOfElements(rows);

        rows.forEach((row) => {
            const squares = row.querySelectorAll('.square');
            this.reverseChildrenOfElements(squares);
        });

        if (this.notation) {
            const notationLetters = document.querySelectorAll(".notationLetter");
            const notationNumbers = document.querySelectorAll(".notationNumber");

            notationLetters.forEach((notationLetter) => {
                notationLetter.remove()
            });

            notationNumbers.forEach((notationNumber) => {
                notationNumber.remove()
            });

            this.isWhitePerspective = !this.isWhitePerspective;
            this.showNotation();
        }
    }

    showBoard() {
        const squareSize = this.size / 8;

        const board = document.getElementById("board");
        const rows = document.querySelectorAll(".row");
        const squares = document.querySelectorAll(".square");
        const lightSquares = document.querySelectorAll(
            ".row:nth-of-type(odd) .square:nth-of-type(odd), .row:nth-of-type(even) .square:nth-of-type(even)"
        );
        const darkSquares = document.querySelectorAll(
            ".row:nth-of-type(odd) .square:nth-of-type(even), .row:nth-of-type(even) .square:nth-of-type(odd)"
        );

        board.setAttribute("width", this.size);
        board.setAttribute("height", this.size);

        rows.forEach((row, index) => {
            row.setAttribute("transform", `translate(0, ${squareSize * index})`);
        });

        squares.forEach((square, index) => {
            square.setAttribute("transform", `translate(${squareSize * (index % 8)}, 0)`);

            const squareRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

            squareRect.setAttribute("class", "squareRect");
            squareRect.setAttribute("width", squareSize);
            squareRect.setAttribute("height", squareSize);
            squareRect.setAttribute("x", 0);
            squareRect.setAttribute("y", 0);

            this.insertSquareChild(square, squareRect);
        });

        lightSquares.forEach((lightSquare) => {
            const lightSquareRect = lightSquare.querySelector(".squareRect");

            lightSquareRect.setAttribute("fill", this.lightSquareColor);
        });

        darkSquares.forEach((darkSquare) => {
            const darkSquareRect = darkSquare.querySelector(".squareRect");

            darkSquareRect.setAttribute("fill", this.darkSquareColor);
        });

        this.showPieces();

        if (this.notation) {
            this.showNotation();
        }
    }
}