import axios from 'axios';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwnership, getTokenForRoom } from '../../scripts/BrowserStorageUtils';
import styles from './Room.module.css';

interface RoomProps {
  "roomId": string,
  "roomName": string
}

const Room: FC<RoomProps> = (roomProps: RoomProps) => {

  const navigate = useNavigate()

  const [roomId, setRoomId] = useState(roomProps.roomId)
  const [roomPassword, setRoomPassword] = useState("")
  const [roomName, setRoomName] = useState(roomProps.roomName)
  const [errorMessage, setErrorMessage] = useState("")


  function onPasswordChange(event: any) {
    setRoomPassword(event.target.value)
  }

  function onButtonClick() {
    const accessToken: string | null = resolveAccessToken()
    console.log("Access token resolved : " + accessToken)
    const request: JoinRoomRequest = { roomId, accessToken, roomPassword }
    axios.post(process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT_JOIN!!, request)
      .then((response) => {
        const body = response.data as JoinRoomResponse
        if (isError(body)) {
          logError(body)
          handleError(body)
        } else {
          handleJoinSuccess(body, accessToken)
        }
      })
  }

  function resolveAccessToken(): string | null {
    return getTokenForRoom(roomId)
  }

  function handleError(body: any) {
    const status = body.status as number
    switch (status) {
      case 401: {
        setErrorMessage("Nieprawidłowe hasło")
        break
      }
      case 402: {
        setErrorMessage("Pokój jest już zajęty!")
        break
      }
      case 403: {
        setErrorMessage("Pokój jest już zajęty!")
        break
      }
      default: {
        setErrorMessage("Wystąił nieoczekiwany błąd!")
        break
      }
    }
  }

  function handleJoinSuccess(body: JoinRoomResponse, accessToken: string | null) {
    var resultToken : string
    if (body.joinerToken != null) {
      addOwnership(body.joinerToken, roomId, false)
      resultToken = body.joinerToken
    } else {
      resultToken = accessToken!!
    }
    redirectToChessboard(body.gameTopicId, body.playerColor, resultToken)
  }

  function redirectToChessboard(gameTopicId: string, playerColor: string, accessToken: string) {
    navigate("/chessboard", {
      state: {
        gameTopicId: gameTopicId,
        playerColor: playerColor,
        accessToken: accessToken
      }
    })
  }

  return (
    <div className={styles.Room}>
      <h2>{roomName}</h2>
      <small className="form-text text-muted">{roomId}</small>
      <div className='my-2'>
        <h4>Hasło</h4>
        <input type="text" className="form-control" placeholder="Hasło" value={roomPassword} onChange={onPasswordChange}></input>
        <small className="form-text text-danger">{errorMessage}</small>
      </div>
      <button type="button" className="btn btn-primary" onClick={onButtonClick}>Dołącz!</button>
    </div>
  );
}


function isError(response: any) {
  console.log(response.status)
  return response.status != 200
}

function logError(response: any) {
  if (isError(response)) {
    console.log(response.message + "\n" + response.description)
  }
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

export default Room;
