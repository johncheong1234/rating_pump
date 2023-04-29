// import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {atom, useAtom} from "jotai";

const chessBoardAtom = atom(new Chess());

export default function PlayRandomMoveEngine() {
    const [game, setGame] = useAtom(chessBoardAtom);

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

    return (
        <div>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={800} />
        </div>
    );
}