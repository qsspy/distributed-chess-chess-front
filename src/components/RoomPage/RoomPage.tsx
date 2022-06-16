import React, { useState } from "react";
import styles from "./RoomPage.module.css";
import { Link } from "react-router-dom";
import RoomCreator from "../RoomCreator/RoomCreator";
import RoomList from "../RoomList/RoomList";
import { isError, logError } from "../../scripts/LogUtils";
import axios from "axios";
import RoomDTO from "../../dto/RoomDTO";

export default function RoomPage() {

  return (
    <div className={"d-flex border justify-content-center " + styles["RoomPage"]}>
      <div className="d-flex flex-column">
        <div className="flex-grow-1 h-100"></div>
        <RoomCreator></RoomCreator>
        <div className="flex-grow-1 h-100"></div>
      </div>
      <div className={styles["separator"]}></div>
      <RoomList></RoomList>
    </div>
  )
}