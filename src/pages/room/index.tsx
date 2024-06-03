import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import {List, ListItem, ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getBackendHost} from "../../api/util";
import {InputNumber} from "antd";

type GetRoomsResp = {
    data: Array<string>
    msg: string
}

export const RoomIndex = () => {
    const [rooms, setRooms] = useState<string[]>([])
    const [roomToAdd, setRoomToAdd] = useState<number|null>(0)


    let navigate = useNavigate();

    const GetRooms = () => {
        axios.get(`/api/rooms`).then((resp) => {
            setRooms(resp.data.data)
        }).catch((e) => {
            console.error(e)
        })
    }

    const AddRoom = () =>{
        axios.post(`/api/rooms`, {room_id:roomToAdd}).then((resp)=>{
            console.log(resp)
        }).catch((e) =>{
            console.error(e)
        })
    }

    useEffect(() => {
        GetRooms()
    }, [])

    return <div>
        <InputNumber value={roomToAdd} onChange={(v) =>{
            setRoomToAdd(v)
        }} ></InputNumber>
        <Button onClick={()=>{
            AddRoom()
        }}>submit</Button>
        <List>
        {rooms.map((item) => {
            return <ListItem><ListItemButton onClick={() => {
                navigate(`/room/${item}`)
            }}>{item}</ListItemButton></ListItem>
        })}
    </List></div>;
}