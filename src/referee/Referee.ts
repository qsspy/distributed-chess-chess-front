import { PieceType, Piece } from "../components/Chessboard/Chessboard";
import axios from 'axios'
import { request } from "http";
import { url } from "inspector";

export default class Referee {
    isVaildMove(px:number, py:number, x:number, y:number, type:PieceType, color:string, boardState:Piece[])
    {
        axios.post('/chesscommend',{
            preeX : px,
            preeY : py,
            newX :x,
            newY :y,
            whatPiece:type,
            whatColor:color,
            allBoard: boardState
        }).then(function(response){
            return true
        }).catch(function(error){
            return false
        })
        //wyslac do serwera i zwrocic true lub false 
        return true
    }
    waitForOponent(boardState:Piece[])
    {   
       axios.post('/chesscommend',{
        allBoard: boardState
    }).then(function(response){
        // ok
    }).catch(function(error){
        //chuj wie
    })
        
    axios.get('/kafka')
        .then(function(response){
           // boardState=response  //i jak to odczytac?
        })
    
    return boardState

    }
}