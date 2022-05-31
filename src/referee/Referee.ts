import { PieceType, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    isVaildMove(px:number, py:number, x:number, y:number, type:PieceType, color:string, boardState:Piece[])
    {

        //wyslac do serwera i zwrocic true lub false 
        return true
    }
    waitForOponent(boardState:Piece[])
    {   
        //wysylam zmodyikowana po ruchu tablice 
        //czeka na od gdy jest to gooooo
        //cos takiego
        // while(true)
        // {
                //ruchwykonany = dostanie tablicy od kafki 
        //     if(ruchwykonany)
        //     {

        //         break
        //     }

        // }
        //return tablica od wroga
       // boardState[4].y=4   //testowy ruch pionka !TO DELETE!
        boardState[10].y=5 
        return boardState

    }
}