import axios from 'axios';
import React, { FC, useState } from 'react';
import RoomDTO from '../../dto/RoomDTO';
import { isError, logError } from '../../scripts/LogUtils';
import Room from '../Room/Room';
import styles from './RoomList.module.css';

export default class RoomList extends React.Component {

  state = {
    rooms: [] as RoomDTO[]
  }

  componentDidMount() {
    //fetchData
    axios.get(process.env.REACT_APP_ROOM_SERVICE_ADDRESS!! + process.env.REACT_APP_ROOM_ENDPOINT!!)
      .then((response) => {
        if (isError(response.data)) {
          logError(response.data)
        } else {
          const body = response.data.rooms as RoomDTO[]
          this.setState({rooms: body})
        }
      })
      .catch(error => {
        console.log(error)
        console.log(JSON.stringify(error))
        console.log(error.response.data)
      })
  }

  render() {
    if (this.state.rooms.length != 0) {
      return (
        <div className={styles["RoomList"]}>
          {this.state.rooms.map(room =>
          <Room key={room.roomId} roomId={room.roomId} roomName={room.roomName}></Room>)}
        </div>
      );
    }
  }
}