// import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { atom, useAtom } from "jotai";

const fenString = atom("1k6/8/8/8/8/8/2K5/8 w - - 0 1");
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
        if(color === "white") {
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
        // makeAMove({
        //     from: sourceSquare,
        //     to: targetSquare,
        //     promotion: "q", // always promote to a queen for example simplicity
        // });
        console.log("sourceSquare", sourceSquare, "targetSquare", targetSquare, "piece", piece)
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

    function handleColorChange(e){

        console.log("e.target.value", e.target.value)
        setColorToPlay(e.target.value)
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