import BoardEventType from "./BoardEventType"

interface BoardEvent {
    fromPieceCode: string | null,
    toPieceCode: string | null,
    fromPosition: string | null,
    toPosition: string | null,
    event: BoardEventType
}

export default BoardEvent