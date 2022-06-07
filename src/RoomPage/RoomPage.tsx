import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Chessboard from "../components/Chessboard/Chessboard";

var idTopis="idTest"
var colorPlayer="B"

axios.get('https://jsonplaceholder.typicode.com/posts')
.then(function(response){
//    zwraca liste pokoji
    console.log(response.data)
    
})

export default function RoomPage(){

    return (
        <div >
       
        <Link to={`/Chessboard`}>Letsplaymadafaka</Link>
        </div>)
}