import React, { FC, useState } from 'react';
import styles from './RoomCreator.module.css';
import axios from 'axios'
import TeamColor from '../../dto/TeamColor';
import { addOwnership } from '../../scripts/BrowserStorageUtils';
import { isError, logError } from '../../scripts/LogUtils';
import { useNavigate } from 'react-router-dom';

interface RoomCreatorProps { }

const RoomCreator: FC<RoomCreatorProps> = () => {

  const [roomName, setRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [isWhiteChecked, setWhiteChecked] = useState(true)

  const navigate = useNavigate()

  function onRadioClick(event : any, isWhiteRadioButton : boolean) {
    if(isWhiteRadioButton) {
      setWhiteChecked(true)
      return
    }
    setWhiteChecked(false)
  }

  function onInputChange(event : any, isNameInput : boolean) {
    if(isNameInput) {
      setRoomName(event.target.value)
      return
    }
    setRoomPassword(event.target.value)
  }

  function onButtonClick(roomName: string, roomPassword: string, isWhiteChecked: boolean) {
    if (roomName.length == 0 || roomPassword.length == 0) {
      console.log("Empty name or password")
      return
    }
  
    let ownerColor = ""
    if(isWhiteChecked) {
      ownerColor = TeamColor.WHITE
    } else {
      ownerColor = TeamColor.BLACK
    }
  
    var request : CreateRoomRequest = {roomName, roomPassword, ownerColor}
    createRoom(request)
  }
  
  function createRoom(request : CreateRoomRequest) {
  
    console.log("Calling url : " + process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT!!)
  
    axios.post(process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT!!, request)
    .then((rawResponse) => {
      const response = rawResponse.data as CreateRoomResponse
      if(isError(response)) {
        logError(response)
      } else {
        clearForm()
        saveRoomOwnershipInMemory(response)
        redirectToChessboard(request, response)
      }
    })
  }

  function redirectToChessboard(createRequest : CreateRoomRequest, createResponse : CreateRoomResponse) {

    const joinRequest : JoinRoomRequest = {
      "roomId": createResponse.roomId,
      "accessToken": createResponse.roomOwnerToken,
      "roomPassword": createRequest.roomPassword
    }

    //join room request
    axios.post(process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT_JOIN!!, joinRequest)
    .then((response) => {
      const body = response.data as JoinRoomResponse
      if(isError(body)) {
        logError(body)
      } else {
        navigate("/chessboard", {
          state: {
            gameTopicId: body.gameTopicId,
            playerColor: createRequest.ownerColor,
            accessToken: createResponse.roomOwnerToken
          }
        })
      }
    })
  }
  function clearForm() {
    setRoomName("")
    setRoomPassword("")
  }

  return (
    <div className={"flex-column " + styles.RoomCreator}>
      <h1>Tworzenie pokoju</h1>
      <div className='my-2'>
        <h4>Nazwa pokoju</h4>
        <input type="text" className="form-control" placeholder="Nazwa pokoju" value={roomName} onChange={(event) => {onInputChange(event, true)}}></input>
      </div>
      <div className='my-2'>
        <h4>Hasło</h4>
        <input type="text" className="form-control" placeholder="Hasło" value={roomPassword} onChange={(event) => {onInputChange(event, false)}}></input>
      </div>
      <div className='my-2'>
        <div className="form-check">
          <input className="form-check-input" type="radio" value="white" checked={isWhiteChecked} onChange={event => onRadioClick(event, true)}></input>
          <label className="form-check-label">Gram białymi</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" value="black" checked={!isWhiteChecked} onChange={event => onRadioClick(event, false)}></input>
          <label className="form-check-label">Gram czarnymi</label>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => onButtonClick(roomName, roomPassword, isWhiteChecked)}>Utwórz grę!</button>
    </div>
  );
}

function saveRoomOwnershipInMemory(response : CreateRoomResponse) {
  addOwnership(response.roomOwnerToken, response.roomId, true)
}

interface CreateRoomRequest {
  "ownerColor": string,
	"roomName": string,
	"roomPassword": string
}

interface CreateRoomResponse {
  "roomOwnerToken": string,
	"roomId": string,
}

interface JoinRoomRequest {
  "roomId": string,
  "accessToken": string | null,
  "roomPassword": string
}

interface JoinRoomResponse {
  "status": number,
  "joinerToken": string | null,
  "gameTopicId": string,
  "playerColor": string
}

export default RoomCreator;
