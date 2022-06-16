import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isConstructorDeclaration } from 'typescript';
import Board from '../../dto/chess/Board';
import Piece from '../../dto/chess/Piece';
import resolvePiece, { colorCodeToColor, denormalizePosition, isPieceOfPlayerColor, isPositionInArray, normalizePositions, resolveTexturePath } from '../../scripts/BoardUtils';
import styles from './NewChessboard.module.css';

interface NewChessboardProps { }

const NewChessboard: FC<NewChessboardProps> = () => {
  //Here is the player color data and topic id
  const location = useLocation()
  const playerParams = location.state as PlayerParams
  const tileEnumeration = [1, 2, 3, 4, 5, 6, 7, 8]

  const [board, setBoard] = useState<Board | null>(null)
  const [selectedPiece, setSelectedPiece] = useState<{ piece: Piece, colorCode: string } | null>(null)
  const [selectedPiecePosition, setSelectedPiecePosition] = useState<{ x: number, y: number } | null>(null)
  const [selectedPieceMoves, setSelectedPieceMoves] = useState<{ x: number, y: number }[]>([])
  const [selectedPieceAttacks, setSelectedPieceAttacks] = useState<{ x: number, y: number }[]>([])
  const [selectedPieceSpecialMoves, setSelectedPieceSpecialMoves] = useState<{ x: number, y: number }[]>([])

  //SSE subscription
  useEffect(() => {
    console.log("CREDS : " + playerParams.gameTopicId + " " + playerParams.accessToken)
    const sseUrl = buildSSEUrl(playerParams.gameTopicId, playerParams.accessToken)
    const eventSource = new EventSource(sseUrl, { withCredentials: false });
    eventSource.onmessage = onMessageReceived

    return function cleanup() {
      console.log("Closing SSE...")
      eventSource.close();
    }
  }, [])

  function onMessageReceived(event: MessageEvent) {
    console.log(event.data)
    const board = JSON.parse(event.data) as Board
    setBoard(board)
    resetSelection()
  }

  function generateTiles() {
    const tiles = []
    const src = "assets/Pieces/BBishop.png"
    for (let i = 8; i > 0; i--) {
      for (let j = 1; j < 9; j++) {
        const pieceData: { piece: Piece, colorCode: string } | null = resolvePiece(j, i, board!!)
        var piece: Piece | null = null
        var texturePath = ""
        if (pieceData != null) {
          texturePath = resolveTexturePath(pieceData.piece, pieceData!!.colorCode)
          piece = pieceData.piece
        }

        const overlaysStyle = resolveOverlays({ x: j, y: i })
        tiles.push(
          <div
            key={"" + i + j}
            style={{ backgroundImage: `url(${texturePath})` }}
            className={`${styles["box"]} ${overlaysStyle}`}
            onClick={e => onTileClick(j, i)}>

          </div>
        )
      }
    }
    return tiles
  }

  function resolveOverlays(position: { x: number, y: number }) {
    if (selectedPiece != null) {
      if (position.x == selectedPiecePosition!!.x && position.y == selectedPiecePosition!!.y) {
        return styles["border-selected"]
      }
      if (isPositionInArray(position, selectedPieceMoves)) {
        return styles["border-move"]
      }
      if (isPositionInArray(position, selectedPieceSpecialMoves)) {
        return styles["border-special-move"]
      }
      if (isPositionInArray(position, selectedPieceAttacks)) {
        return styles["border-attack"]
      }
    }
    return ""
  }

  function onTileClick(x: number, y: number) {
    const pieceData = resolvePiece(x, y, board!!)
    if (pieceData != null && isPieceOfPlayerColor(playerParams.playerColor, pieceData.piece, board!!)) {
      if (selectedPiece != null) {
        if (pieceData.piece == selectedPiece.piece) {
          resetSelection()
        } else {
          selectPiece(pieceData, x, y)
        }
      } else {
        selectPiece(pieceData, x, y)
      }
    } else {
      if (selectedPiece != null) {
        makeMoveIfPossible(x, y)
      } else {
        console.log("Empty  tile!")
      }
    }
  }

  function selectPiece(pieceData: { piece: Piece, colorCode: string }, x: number, y: number) {
    setSelectedPiece(pieceData)
    setSelectedPiecePosition({ x, y })
    setSelectedPieceMoves(normalizePositions(pieceData.piece.possibleMoves))
    setSelectedPieceSpecialMoves(normalizePositions(pieceData.piece.possibleSpecialMoves))
    setSelectedPieceAttacks(normalizePositions(pieceData.piece.possibleAttacks))
  }

  function resetSelection() {
    setSelectedPiecePosition(null)
    setSelectedPiece(null)
    setSelectedPieceMoves([])
    setSelectedPieceSpecialMoves([])
    setSelectedPieceAttacks([])
  }

  function makeMoveIfPossible(x: number, y: number) : boolean {
    const position = { x: x, y: y }
    if (isPositionInArray(position, selectedPieceAttacks)) {
      makeMove({ x: x, y: y })
      return true
    }
    if (isPositionInArray(position, selectedPieceMoves)) {
      makeMove({ x: x, y: y })
      return true
    }
    if (isPositionInArray(position, selectedPieceSpecialMoves)) {
      makeMove({ x: x, y: y })
      return true
    }
    return false
  }

  function makeMove(position: { x: number, y: number }) {
    const requestBody: MakeMoveRequestBody = {
      color: colorCodeToColor(selectedPiece!!.colorCode),
      pieceCode: selectedPiece!!.piece.pieceCode,
      destination: denormalizePosition(position),
      switchPieceCode: null
    }

    const requestHeaders = {
      "Game-Topic-Id": playerParams.gameTopicId
    }

    const url = process.env.REACT_APP_CHESS_COMMAND_ADDRESS!! + process.env.REACT_APP_CHESS_COMMAND_ENDPOINT!!
    axios.post(url, requestBody, { headers: requestHeaders })
    .then(response => {
      console.log(response)
      resetSelection()
    })
  }
  if (board != null) {
    return (
      <div className={styles.NewChessboard}>
        <div className={styles["wrapper"]}>
          <div className={styles["top"]}>
            <div className={styles["wrapper-inner"]}>
              <div className={styles["box-inner"]}>A</div>
              <div className={styles["box-inner"]}>B</div>
              <div className={styles["box-inner"]}>C</div>
              <div className={styles["box-inner"]}>D</div>
              <div className={styles["box-inner"]}>E</div>
              <div className={styles["box-inner"]}>F</div>
              <div className={styles["box-inner"]}>G</div>
              <div className={styles["box-inner"]}>H</div>
            </div>
          </div>
          {generateTiles()}
          <div className={styles["bottom"]}>
            <div className={styles["wrapper-inner"]}>
              <div className={styles["box-inner"]}>A</div>
              <div className={styles["box-inner"]}>B</div>
              <div className={styles["box-inner"]}>C</div>
              <div className={styles["box-inner"]}>D</div>
              <div className={styles["box-inner"]}>E</div>
              <div className={styles["box-inner"]}>F</div>
              <div className={styles["box-inner"]}>G</div>
              <div className={styles["box-inner"]}>H</div>
            </div>
          </div>
        </div>
        <div className='dashboard'>
          <div className='turn-info'>
            <h1 className='m-3'>Grasz jako : {playerParams.playerColor}</h1>
            <h1 className='m-3'>Teraz rusza się : {board.playerTurn}</h1>
          </div>
        </div>
      </div>
    )
  } else {
    return (<div className={styles.NewChessboard}></div>)
  }
};

function buildSSEUrl(topicId: string, userId: string) {
  return process.env.REACT_APP_CHESS_EVENT_ADDRESS!! +
    process.env.REACT_APP_CHESS_EVENT_ENDPOINT!! +
    '?' +
    `gameTopicId=${topicId}&` +
    `userToken=${userId}`

}

interface PlayerParams {
  gameTopicId: string,
  playerColor: string,
  accessToken: string
}

interface MakeMoveRequestBody {
  color: string,
  pieceCode: string,
  destination: string,
  switchPieceCode: string | null
}

export default NewChessboard;

