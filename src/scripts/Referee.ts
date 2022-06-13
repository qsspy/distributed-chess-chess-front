import { PieceType, Piece } from "../components/Chessboard/Chessboard";
import axios from 'axios'

export default class Referee {
    isVaildMove(px:number, py:number, x:number, y:number, type:PieceType, color:string, boardState:Piece[], gameTopicId:string)
    {
        const headers = {
            'Game-Topic-Id': gameTopicId
          }

        var validMove = false
        axios.post(process.env.REACT_APP_CHESS_COMMAND_ADDRESS!! + process.env.REACT_APP_CHESS_COMMAND_ENDPOINT!!,{
            preeX : px,
            preeY : py,
            newX :x,
            newY :y,
            pieceCode :type,
            color :color,
            allBoard: boardState,
            headers: headers
        }).then(function(response){
            validMove  = true
        }).catch(function(error){
            validMove  = false
        })
        
        return validMove 
    }
    waitForOponent(boardState:Piece[])  //type sc asynch wypcha danych, obsluga zampaowanie zdarzen aktualizacja planszy
    {  
      
    //odebrac od przeciwnika tablice po jego ruchu
    axios.get(process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT!!)
        .then(function(response){
            boardState=response.data  
        })
    
    return boardState //aktualizacja u siebie

    }
}