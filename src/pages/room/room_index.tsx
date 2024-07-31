import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import {List, ListItem, ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getBackendHost, RoomInfo} from "../../api/util";
import {InputNumber, Table, type TableProps} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

type GetRoomsResp = {
    data: RoomInfo
    msg: string
}

export const RoomIndex = () => {
    const [rooms, setRooms] = useState<RoomInfo[]>([])


    let navigate = useNavigate();

    const GetRooms = () => {
        const host = getBackendHost()
        axios.get(`${host}/api/rooms`).then((resp) => {
            setRooms(resp.data.data)
        }).catch((e) => {
            console.error(e)
        })
    }

    useEffect(() => {
        GetRooms()
    }, [])

    const roomCol: TableProps<RoomInfo>['columns'] = [
        {
            title: 'Room Id',
            dataIndex: 'room',
            key: 'room',
            render: (value, record, index) => {
                return <a onClick={() => {
                    navigate(`/room/${record.room}`)
                }}>{record.room}</a>
            }
        },
        {
            title: 'Streamer Name',
            dataIndex: 'streamer_name',
            key: 'streamer_name',
        },
    ]

    return <div>

        <Table dataSource={rooms} columns={roomCol}></Table></div>;
}