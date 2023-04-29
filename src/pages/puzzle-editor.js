// import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { atom, useAtom } from "jotai";

const fenString = atom("1k6/8/8/8/8/8/2K5/8 w - - 0 1");
const chessBoardAtom = atom(
    (get) => new Chess(get(fenString)),
);
const fenStringCopyAtom = atom("")

export default function PlayRandomMoveEngine() {
    const [game, setGame] = useAtom(chessBoardAtom);
    const [, setFenString] = useAtom(fenString);
    const [fenStringCopy, setFenStringCopy] = useAtom(fenStringCopyAtom);

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

    function onDrop(sourceSquare, targetSquare) {
        makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });
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

    function handleOnBlurFenStringCopy(e){
        if (validateFenValue(e.target.value)) {
            setFenString(e.target.value)
        } else {
            setFenStringCopy(game.fen())
        }
    }


    return (
        <div>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={800} />
            <div id='fen-string-container'>
                <input
                    style={{
                        width: "800px",
                        marginTop: "20px"
                    }}
                    type="text" value={fenStringCopy} 
                    onChange={handleFenStringCopyChange} 
                    onBlur={handleOnBlurFenStringCopy}/>
            </div>
        </div>
    );
}