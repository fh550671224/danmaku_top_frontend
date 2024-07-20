import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {List, ListItem, ListItemButton, Snackbar} from "@mui/material";
import {CopyOutlined, UpOutlined, DownOutlined, DeleteOutlined} from '@ant-design/icons';
import {Card, Input, InputNumber, message, Popover, Switch, Table, TablePaginationConfig} from 'antd';
import type {TableProps} from 'antd';
import Button from "@mui/material/Button";
import {convertTimestampToDate, getBackendHost} from "../../../api/util";

type DanmakuInfo = {
    create_time: number,
    first_author: string,
    first_author_badge: string,
    room: string,
    text: string,
    count: number,
    is_hot: boolean
}

export const RoomDetail = () => {
    const [danmakuList, setDanmakuList] = useState<DanmakuInfo[]>([])
    const [queryNum, setQueryNum] = useState(100)
    const [queryText, setQueryText] = useState<string>("")
    const [hotOnly, setHotOnly] = useState(true)

    const [messageApi, contextHolder] = message.useMessage();

    const params = useParams();
    const room = params.room;

    const GetDanmaku = () => {
        const host = getBackendHost()
        axios.get(`${host}/api/danmaku/${room}?n=${queryNum}&text=${queryText}&hot_only=${hotOnly}`).then((resp) => {
            setDanmakuList(resp.data)
        }).catch((e) => {
            console.error(e)
        })
    }

    const UpdateDanmaku = (record: DanmakuInfo) => {
        const host = getBackendHost()
        axios.put(`${host}/api/danmaku/${record.room}`, record).then((resp) => {
            console.log(resp)
            window.location.reload();
        }).catch((e) => {
            console.error(e)
        })
    }

    const DeleteDanmaku = (record: DanmakuInfo) => {
        const host = getBackendHost()
        axios.post(`${host}/api/delete_danmaku`, record).then((resp) => {
            console.log(resp)
            window.location.reload();
        }).catch((e) => {
            console.error(e)
        })
    }

    useEffect(() => {
        GetDanmaku()
    }, []);

    useEffect(() => {
        GetDanmaku()
    }, [hotOnly]);

    const topDanmakuCols: TableProps<DanmakuInfo>['columns'] = [
        {
            title: 'Txt',
            dataIndex: 'text',
            key: 'txt',
            render: (value, record, index) => {
                return <span>
                    <Popover
                        content={
                            <Card title={"Danmaku Info"}>
                                <p>create time: {convertTimestampToDate(record.create_time)}</p>
                                <p>author: {record.first_author}</p>
                                <p>badge: {record.first_author_badge}</p>
                            </Card>
                        }
                        trigger={'hover'}
                    >
                            <a onClick={() => {
                                // GetDanmakuInfo(txt)
                            }}>{record.text}</a>
                    </Popover>
                <Button onClick={() => {
                    navigator.clipboard.writeText(record.text).then(() => {
                        messageApi.info('copied')
                    }).catch(err => {
                        messageApi.error('copy error: ', err);
                    });
                }}><CopyOutlined/> </Button>
                </span>

            }
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Operation',
            key: 'operation',
            render: (value, record, index) => {
                return <span><Button disabled={record.is_hot} onClick={() => {
                    record.is_hot = true
                    UpdateDanmaku(record)
                }}><UpOutlined/></Button>
                    <Button disabled={!record.is_hot} onClick={() => {
                        record.is_hot = false
                        UpdateDanmaku(record)
                    }}><DownOutlined/></Button>
                <Button onClick={()=>{
                    DeleteDanmaku(record)
                }}><DeleteOutlined/></Button>
                </span>
            }
        }
    ]

    // save url below
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const initialPage = parseInt(query.get('page') || '1', 10);
    const initialPageSize = parseInt(query.get('pageSize') || '10', 10);

    const [current, setCurrent] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialPageSize);

    useEffect(() => {
        query.set('page', current.toString());
        query.set('pageSize', pageSize.toString());
        navigate({ search: query.toString() }, { replace: true });
    }, [current, pageSize, navigate]);

    const handleTableChange = (
        pagination: TablePaginationConfig
    ) => {
        setCurrent(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);
    };
    // save url above TODO save more info

    return <div>
        <span><> topN:</><InputNumber placeholder={'query amount'} value={queryNum} onChange={(n) => {
            if (n) {
                setQueryNum(n)
            }
        }}/> </span>
        <Input placeholder={'keyword search'} style={{'width':500}} value={queryText} onChange={(e) => {
            setQueryText(e.target.value)
        }}/>
        <Switch value={hotOnly} onChange={(checked)=>{
            setHotOnly(checked)
        }}/>
        <Button onClick={() => {
            GetDanmaku()
        }}>Query</Button>

        {contextHolder}
        <Table dataSource={danmakuList} columns={topDanmakuCols} pagination={{current, pageSize}} onChange={handleTableChange}></Table>
    </div>
}