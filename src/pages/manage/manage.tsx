import {getBackendHost, RoomInfo} from "../../api/util";
import axios from "axios";
import {Form, FormProps, Input, Button, Table, type TableProps, Card, Popover, Popconfirm} from "antd";
import React, {useEffect, useState} from "react";
import {is_admin} from "../../components/util";
import {ListItem} from "@mui/material";
import {DeleteOutlined, DownOutlined, UpOutlined} from "@ant-design/icons";

export const Manage = () => {
    const [rooms, setRooms] = useState<RoomInfo[]>([])
    // const [roomToAdd, setRoomToAdd] = useState<RoomInfo>()

    const GetRooms = () => {
        const host = getBackendHost()
        axios.get(`${host}/api/rooms`).then((resp) => {
            setRooms(resp.data.data)
        }).catch((e) => {
            console.error(e)
        })
    }
    const DeleteRooms = (room: string) => {
        const host = getBackendHost()
        axios.delete(`${host}/api/rooms?room=${room}`).then((resp) => {
            window.location.reload()
        }).catch((e) => {
            console.error(e)
        })
    }

    const AddRoom = (data: RoomInfo) => {
        const host = getBackendHost()
        axios.post(`${host}/api/rooms`, data).then((resp) => {
            window.location.reload()
        }).catch((e) => {
            console.error(e)
        })
    }

    useEffect(() => {
        GetRooms()
    }, []);

    const roomCol: TableProps<RoomInfo>['columns'] = [
        {
            title: 'Room Id',
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: 'Streamer Name',
            dataIndex: 'streamer_name',
            key: 'streamer_name',
        },
        {
            title: 'Operation',
            key: 'operation',
            render: (value, record, index) => {
                return <span>
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete (danmaku data will also be deleted)?"
                        onConfirm={() => {
                            DeleteRooms(record.room)
                        }}
                        okText="Yes"
                        cancelText="No"
                    ><Button><DeleteOutlined/></Button></Popconfirm>

                </span>
            }
        }
    ]

    const onFinish: FormProps<RoomInfo>['onFinish'] = (values) => {
        AddRoom(values)
    };

    const onFinishFailed: FormProps<RoomInfo>['onFinishFailed'] = (errorInfo) => {
        console.log('fsfs', errorInfo);
    };

    const ManageInterface = <div>
        <Card title={'Room Manage'}>
            <Table dataSource={rooms} columns={roomCol}></Table>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<RoomInfo>
                    label="Room"
                    name="room"
                    rules={[{required: true, message: 'Please input your room!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item<RoomInfo>
                    label="Streamer name"
                    name="streamer_name"
                    rules={[{required: true, message: 'Please input streamer name!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button htmlType="submit">
                        Add Room
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>

    return <div>
        {is_admin() ? (ManageInterface) : null}
    </div>
}