import { PieceType, Piece } from "../components/Chessboard/Chessboard";
import axios from 'axios'

export default class Referee {
    isVaildMove(px:number, py:number, x:number, y:number, type:PieceType, color:string, boardState:Piece[])
    {
        var pupa = false
        axios.post('/chesscommend',{
            preeX : px,
            preeY : py,
            newX :x,
            newY :y,
            whatPiece:type,
            whatColor:color,
            allBoard: boardState
        }).then(function(response){
            pupa = true
        }).catch(function(error){
            pupa = false
        })
        //wyslac do serwera i zwrocic true lub false 
        return pupa
    }
    waitForOponent(boardState:Piece[])
    {  
        //wysac przeciwnikowi tablice po ruchu  
       axios.post('/kafka',{
        allBoard: boardState
    }).then(function(response){
        // ok
    }).catch(function(error){
        //chuj wie
    })


    //Czy tu poczeka?
    //odebrac od przeciwnika tablice po jego ruchu
    axios.get('/kafka')
        .then(function(response){
           // boardState=response  //i jak to odczytac?
        })
    
    return boardState //aktualizacja u siebie

    }
}