import React, { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Referee from "../../referee/Referee";


const horizontalAxis = ["a","b","c","d","e","f","g","h"]
const verticalAxis = ["1","2","3","4","5","6","7","8"]

var playerColor = "B"  //var aby testowy if działał w sumie pożniej tez powinien zostac var
var firstMove = true  // zaby blokowac czarnego na pierwszym ruchu 

export interface Piece
{
    image: string
    x: number //horizontalPosition
    y: number //verticalPosition
    type: PieceType
    color :string
}

export enum PieceType{
    "PAWN",
    "BISHOP",
    "KNIGHT",
    "ROCK",
    "QUEEN",
    "KING"
}

const initialBoardState: Piece[] = []

for(let i = 0; i<8; i++)
    initialBoardState.push({image: "assets/Pieces/BPawn.png",x: i, y: 6, type:PieceType.PAWN, color:"B"})

for(let i = 0; i<8; i++)
    initialBoardState.push({image: "assets/Pieces/WPawn.png",x: i, y: 1, type:PieceType.PAWN, color:"W"})

for(let p=0; p<2; p++)
{
    const type = p === 0 ? "W" :"B"
    const y = p === 0 ? 0 : 7
   // console.log(`${type}`)
    initialBoardState.push({image: `assets/Pieces/${type}Rook.png`,x: 0, y, type:PieceType.ROCK, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Rook.png`,x: 7, y, type:PieceType.ROCK, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Knight.png`,x: 1, y, type:PieceType.KNIGHT, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Knight.png`,x: 6, y, type:PieceType.KNIGHT, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Bishop.png`,x: 2, y, type:PieceType.BISHOP, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Bishop.png`,x: 5, y, type:PieceType.BISHOP, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}Queen.png`,x: 3, y, type:PieceType.QUEEN, color: `${type}`})
    initialBoardState.push({image: `assets/Pieces/${type}King.png`,x: 4, y, type:PieceType.KING, color: `${type}`})

}





export default function Chessboard(){
    const [activePiece, setActivePiece] =useState<HTMLElement | null >(null)
    const [gridX, setGridX] = useState(0)
    const [gridY, setGridY] = useState(0)
    const [pieces, setPieces]= useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null)
    const refeere = new Referee()
   // console.log(pieces)

    function grabPiece(e: React.MouseEvent)
    {
        const element = e.target as HTMLElement
        const chessboard = chessboardRef.current
        
        if(activePiece) //Zeby sie nie chrzaniło przy dropie poza tablica jak jest active
        {
            dropPiece(e)
            return
        }

        if(element.classList.contains("chessPiece") && chessboard)
        {   
            if(playerColor==="W"){
                setGridX(Math.floor((e.clientX-chessboard.offsetLeft)/100))
                setGridY(Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-800)/100)))
            }else
            {
                setGridX(7-Math.floor((e.clientX-chessboard.offsetLeft)/100))
                setGridY(7-Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-800)/100)))
            }
            //console.log(e)

            const x = e.clientX-50;
            const y = e.clientY-50;
            element.style.position="absolute"
            element.style.left=`${x}px`
            element.style.top=`${y}px`

            setActivePiece(element)
            
        }
    }
    function movePiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current

        

        if(activePiece && chessboard )
        {
            const minX = chessboard.offsetLeft - 25
            const minY = chessboard.offsetTop -25
            const maxX = chessboard.offsetLeft + chessboard.clientWidth-75
            const maxY = chessboard.offsetTop + chessboard.clientHeight -75
            const x = e.clientX-50;
            const y = e.clientY-50;
            activePiece.style.position="absolute"
            if(x < minX){
                activePiece.style.left=`${minX}px`
            }else if (x > maxX){
                activePiece.style.left=`${maxX}px`
            }else{
                activePiece.style.left=`${x}px`
            }
            
            if (y < minY){
                activePiece.style.top=`${minY}px`
            }else if (y > maxY){
                activePiece.style.top=`${maxY}px`
            }else{
                activePiece.style.top=`${y}px`
            }
        }
    }
    function dropPiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current

        if(activePiece && chessboard)
        {
            var x =0
            var y=0
           if(playerColor==='W'){
                x =Math.floor((e.clientX-chessboard.offsetLeft)/100)
                y = Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-800)/100))
           }else
           {
                x =7-Math.floor((e.clientX-chessboard.offsetLeft)/100)
                y =7- Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-800)/100))
           }
           // console.log(x,y)
            //var moveEND=false
           //TODO PORPAWIC ZEBY PO BICIU ZNIKAŁY dobrze
           const currentPiece = pieces.find(p => p.x === gridX && p.y ===gridY)
           console.log(pieces)
          // const attacedPiece = pieces.find(p => p.x === x && p.y ===y)
           if(currentPiece){
               if(!(playerColor === 'B' && firstMove)){ //zwroci false gdy tylko kolor czarny i firstmove to true
                    const validMove = refeere.isVaildMove(gridX,gridY,x,y,currentPiece.type, playerColor, pieces)// && playerColor===currentPiece.color)
                    if(validMove && playerColor===currentPiece.color ) //Do nie pozwala ruszac drugim kolorem aktywuje poznien
                    {
                        const updatedPieces = pieces.reduce((results, piece)=>{
                            if(piece.x === gridX && piece.y === gridY)
                            {
                                piece.x=x
                                piece.y=y
                                results.push(piece)
                            }else if(!(piece.x ===x && piece.y ===y))
                            {
                                results.push(piece)
                            }

                            return results
                        },[] as Piece[])
                        
                        setPieces(updatedPieces); //ustawian u siebie
                        const afterOponetnsMove=refeere.waitForOponent(pieces); //zwraca tablice po ruch przeciwknika 
                        setPieces(afterOponetnsMove); //zminia tablice po ruch przeciwknika 
                        firstMove = false

                    }else{//Wraca na pozycje gdy ruch zły
                        activePiece.style.position="relative"
                        activePiece.style.removeProperty('top')
                        activePiece.style.removeProperty('left')
                    }
               }else{
                    activePiece.style.position="relative"
                    activePiece.style.removeProperty('top')
                    activePiece.style.removeProperty('left')
                    const afterOponetnsMove=refeere.waitForOponent(pieces); //zwraca tablice po ruch przeciwknika 
                    setPieces(afterOponetnsMove); //zminia tablice po ruch przeciwknika 
                    firstMove = false

               }
           
            }
            setActivePiece(null)
            //console.log(pieces)
            //refeere.waitForOponent()
        }
    }
    
    
    let board = []
    if(playerColor==='W'){
        for(let j=verticalAxis.length-1; j>=0; j--)
        {
            for(let i=0; i<horizontalAxis.length; i++)
            {
                const number = i+j+2
                let image = undefined;
                pieces.forEach(p => {
                if(p.x === i && p.y ===j)
                {
                    image=p.image 
                } 
                })

                board.push(<Tile key={`${j},${i}`} image={image} number={number}/>) 
                
            
            }
        }
    }else 
    {
        for(let j=0; j < verticalAxis.length; j++)
        {
            for(let i=horizontalAxis.length-1; i>=0; i--)
            {
                const number = i+j+2
                let image = undefined;
                pieces.forEach(p => {
                if(p.x === i && p.y ===j)
                {
                    image=p.image 
                } 
                })

                board.push(<Tile key={`${j},${i}`} image={image} number={number}/>) 
                
            
            }
        }
    }

    //console.log(board)
    return (
        <div 
        onMouseMove={(e=>movePiece(e))} 
        onMouseDown={e =>grabPiece(e)} 
        onMouseUp={e =>dropPiece(e)} 
        id="chessboard"
        ref ={chessboardRef}>
        {board}
        </div>)
}