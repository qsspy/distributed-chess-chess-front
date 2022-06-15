import BoardEvent from "./BoardEvent"
import Piece from "./Piece"

interface Board {
    playerTurn: string,
    winner: string | null,
    black: Piece[],
    white: Piece[],
    lastBoardEvents: BoardEvent[]
}

export default Board