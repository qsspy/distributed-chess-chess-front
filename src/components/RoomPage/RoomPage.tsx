import React from "react";
import styles from "./RoomPage.module.css";
import { Link } from "react-router-dom";
import RoomCreator from "../RoomCreator/RoomCreator";

export default function RoomPage(){

    return (
        <div className={"container-fluid " + styles["RoomPage"]}>
          <RoomCreator></RoomCreator>
        
          
          <div>
            <Link to={`/Chessboard`}>Go to chess mockup</Link>
          </div>
        </div>
        )
}