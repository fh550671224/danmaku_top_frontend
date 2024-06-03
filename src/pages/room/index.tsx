import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import {List, ListItem, ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getBackendHost} from "../../api/util";

type GetRoomsResp = {
    data: Array<string>
    msg: string
}

export const RoomIndex = () => {
    const [rooms, setRooms] = useState<string[]>([])


    let navigate = useNavigate();

    const GetRooms = () => {
        const host = getBackendHost()
        axios.get(`/danmaku_top/rooms`).then((resp) => {
            setRooms(resp.data.data)
        }).catch((e) => {
            console.error(e)
        })
    }

    useEffect(() => {
        GetRooms()
    }, [])

    return <List>
        {rooms.map((item) => {
            return <ListItem><ListItemButton onClick={() => {
                navigate(`/room/${item}`)
            }}>{item}</ListItemButton></ListItem>
        })}
    </List>;
}