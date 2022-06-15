import { NumericLiteral } from "typescript"
import Board from "../dto/chess/Board"
import Piece from "../dto/chess/Piece"
import TeamColor from "../dto/TeamColor"

function mapPositonToNumber(positionChar: string) {
    switch (positionChar) {
        case "A":
            return 1
        case "B":
            return 2
        case "C":
            return 3
        case "D":
            return 4
        case "E":
            return 5
        case "F":
            return 6
        case "G":
            return 7
        default:
            return 8
    }
}

function mapPositionToCharacter(positionNumber: number) {
    switch (positionNumber) {
        case 1:
            return "A"
        case 2:
            return "B"
        case 3:
            return "C"
        case 4:
            return "D"
        case 5:
            return "E"
        case 6:
            return "F"
        case 7:
            return "G"
        default:
            return "H"
    }
}

export function colorCodeToColor(colorCode: string): string {
    switch (colorCode) {
        case "W":
            return "WHITE"
        default:
            return "BLACK"
    }

}
export function isPieceOfPlayerColor(playerColor: string, piece : Piece, board: Board): boolean {
    if(playerColor == TeamColor.BLACK) {
        return board.black.find(item => item.position == piece.position) != undefined
    }
    return board.white.find(item => item.position == piece.position) != undefined
} 

function normalizePosition(position: string): { x: number, y: number } {
    const alphabeticX: string = position.at(0)!!
    const x = mapPositonToNumber(alphabeticX)
    const y = +position.at(1)!!
    return { x: x, y: y }
}

export function denormalizePosition(position: { x: number, y: number }): string {
    const alphabeticX: string = mapPositionToCharacter(position.x)
    return alphabeticX + position.y
}

export function isPositionInArray(position: { x: number, y: number }, array: { x: number, y: number }[]) {
    return array.find(item => item.x == position.x && item.y == position.y)
}

export function normalizePositions(positions: string[]): { x: number, y: number }[] {
    return positions.map(normalizePosition)
}

export default function resolvePiece(xPosition: number, yPosition: number, board: Board): { piece: Piece, colorCode: string } | null {
    const xCharPosition = mapPositionToCharacter(xPosition)
    const mergedPosition = xCharPosition + yPosition
    var piece: Piece | undefined = board.black.find(piece => {
        //console.log(`Comparing ${mergedPosition} == ${piece.position} black`)
        return piece.position == mergedPosition
    })
    if (piece != undefined) {
        //console.log(`${xPosition} ${yPosition} black`)
        return { piece: piece, colorCode: "B" }
    }
    piece = board.white.find(piece => {
        //console.log(`Comparing ${mergedPosition} == ${piece.position} white`)
        return piece.position == mergedPosition
    })
    if (piece != undefined) {
        //console.log(`${xPosition} ${yPosition} white`)
        return { piece: piece, colorCode: "W" }
    }

    return null
}

export function resolveTexturePath(piece: Piece | null, pieceColorChar: String) {
    if (piece == null) {
        return ""
    }
    if (piece.pieceCode == "K") {
        return `assets/Pieces/${pieceColorChar}King.png`
    } else if (piece.pieceCode.startsWith("Q")) {
        return `assets/Pieces/${pieceColorChar}Queen.png`
    } else if (piece.pieceCode.startsWith("B")) {
        return `assets/Pieces/${pieceColorChar}Bishop.png`
    } else if (piece.pieceCode.startsWith("KN")) {
        return `assets/Pieces/${pieceColorChar}Knight.png`
    } else if (piece.pieceCode.startsWith("R")) {
        return `assets/Pieces/${pieceColorChar}Rook.png`
    } else {
        return `assets/Pieces/${pieceColorChar}Pawn.png`
    }
}