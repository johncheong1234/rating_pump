// import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { atom, useAtom } from "jotai";

const fenString = atom("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w K - 0 1");
const chessBoardAtom = atom(
    (get) => new Chess(get(fenString)),
);
const fenStringCopyAtom = atom("")
const colorToPlayAtom = atom(
    (get) => {
        // get fenString and return the color to play
        if (get(fenString).split(" ")[1] === "w") {
            return "white"
        } else {
            return "black"
        }
    },
    (get, set, color) => {
        // edit fenString to change the color to play
        if (color === "white") {
            set(fenString, get(fenString).replace(" b ", " w "))
            set(fenStringCopyAtom, get(fenString).replace(" b ", " w "))
        } else {
            set(fenString, get(fenString).replace(" w ", " b "))
            set(fenStringCopyAtom, get(fenString).replace(" w ", " b "))
        }
    }
)

export default function PlayRandomMoveEngine() {
    const [game, setGame] = useAtom(chessBoardAtom);
    const [, setFenString] = useAtom(fenString);
    const [fenStringCopy, setFenStringCopy] = useAtom(fenStringCopyAtom);
    const [colorToPlay, setColorToPlay] = useAtom(colorToPlayAtom);

    // set fenStringCopy to fenString on first render
    if (fenStringCopy === "") {
        setFenStringCopy(game.fen())
    }

    function makeAMove(move) {
        const gameCopy = new Chess(game.fen());

        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function onDrop(sourceSquare, targetSquare, piece) {

        modifyFenStringWithNewPiece(fenStringCopy, sourceSquare, targetSquare, piece)
    }

    function validateFenValue(fen) {
        const chess = new Chess();
        try {
            chess.load(fen);
            return true;
        } catch (e) {
            return false;
        }
    }

    function handleFenStringCopyChange(e) {
        setFenStringCopy(e.target.value)
    }

    function handleOnBlurFenStringCopy(e) {
        if (validateFenValue(e.target.value)) {
            setFenString(e.target.value)
        } else {
            setFenStringCopy(game.fen())
        }
    }

    function handleColorChange(e) {

        console.log("e.target.value", e.target.value)
        setColorToPlay(e.target.value)
    }

    function modifyFenStringWithNewPiece(existingFenString, sourceSquare, targetSquare, piece) {
        const stringRelevantToBoard = existingFenString.split(" ")[0];
        const leftOverFenString = existingFenString.split(" ").slice(1).join(" ");
        const board = decodeFEN(stringRelevantToBoard);
        const sourceRank = 8 - parseInt(sourceSquare[1]);
        const sourceFile = sourceSquare.charCodeAt(0) - 97;
        const targetRank = 8 - parseInt(targetSquare[1]);
        const targetFile = targetSquare.charCodeAt(0) - 97;
        const colour = piece[0] === "w" ? "white" : "black";
        board[sourceRank][sourceFile] = null;
        board[targetRank][targetFile] = colour === 'white' ? piece[1].toUpperCase() : piece[1].toLowerCase();
        console.log(board, ' after')
        const newFenString = encodeFEN(board) + " " + leftOverFenString;
        console.log(newFenString, ' newFenString')
        if (validateFenValue(newFenString)) {
            setFenStringCopy(newFenString)
            setFenString(newFenString)
        } else {
            setFenStringCopy(game.fen())
        }
    }

    function decodeFEN(fenString) {

        // Split the board part of the FEN string into its individual ranks
        const ranks = fenString.split("/");

        // Initialize an empty 8x8 chessboard array
        const chessboard = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

        // Loop through each rank and file to populate the chessboard
        for (let rank = 0; rank < 8; rank++) {
            let file = 0;
            for (let i = 0; i < ranks[rank].length; i++) {
                const char = ranks[rank][i];
                if (!isNaN(char)) {
                    // If the character is a number, skip that many files
                    file += parseInt(char, 10);
                } else {
                    // Otherwise, the character is a piece
                    chessboard[rank][file] = char;
                    file++;
                }
            }
        }

        return chessboard;
    }

    function encodeFEN(chessboard) {
        // Initialize an empty string to build the FEN string
        let fenString = "";

        // Loop through each rank
        for (let rank = 0; rank < 8; rank++) {
            let emptySquares = 0;
            // Loop through each file in the rank
            for (let file = 0; file < 8; file++) {
                const piece = chessboard[rank][file];
                if (piece === null) {
                    // If the square is empty, increment the empty squares counter
                    emptySquares++;
                } else {
                    // If the square is not empty, add the appropriate character to the FEN string
                    if (emptySquares > 0) {
                        fenString += emptySquares;
                        emptySquares = 0;
                    }
                    fenString += piece;
                }
            }
            // If there are any remaining empty squares, add them to the FEN string
            if (emptySquares > 0) {
                fenString += emptySquares;
            }
            // Add a slash after each rank except for the last one
            if (rank < 7) {
                fenString += "/";
            }

        }
        return fenString;
    }


    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
        }}
            id="main-container"
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "fit-content",
                }}
            >
                <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={
                    600
                } />
                <div id='fen-string-container'>
                    <input
                        style={{
                            width: "100%",
                            marginTop: "20px"
                        }}
                        type="text" value={fenStringCopy}
                        onChange={handleFenStringCopyChange}
                        onBlur={handleOnBlurFenStringCopy} />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <select value={colorToPlay} onChange={handleColorChange}>
                    <option value="white">White to play</option>
                    <option value="black">Black to play</option>
                </select>
            </div>
        </div>
    );
}