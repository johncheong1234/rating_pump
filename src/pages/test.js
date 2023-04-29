import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine() {
    const [game, setGame] = useState(new Chess(
        'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19'
    ));

    return <Chessboard position={game.fen()} />;
}