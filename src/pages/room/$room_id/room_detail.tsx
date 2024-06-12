import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {List, ListItem, ListItemButton, Snackbar} from "@mui/material";
import {CopyOutlined, CloseOutlined, DeleteOutlined} from '@ant-design/icons';
import {Card, InputNumber, message, Popover, Switch, Table} from 'antd';
import type {TableProps} from 'antd';
import Button from "@mui/material/Button";
import {convertTimestampToDate, getBackendHost} from "../../../api/util";

type Danmaku = {
    txt: string,
    cnt: number,
}

type DanmakuInfo = {
    create_time_stamp: number,
    first_author: string,
    first_author_badge: string,
    room_id: string,
    text: string,
}

export const RoomDetail = () => {
    const [topDanmakuList, setTopDanmakuList] = useState<Danmaku[]>([])
    const [queryNum, setQueryNum] = useState(100)
    const [danmakuInfo, setDanmakuInfo] = useState<DanmakuInfo>()

    const [isCommonDanmaku, setIsCommonDanmaku] = useState(false);
    const [commonDanmakuList, setCommonDanmakuList] = useState<DanmakuInfo[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    const params = useParams();
    const room_id = params.room_id;

    const GetTopDanmaku = (n: number) => {
        const host = getBackendHost()
        axios.get(`${host}/api/top_danmaku/${room_id}?n=${n}`).then((resp) => {
            let t: [string, number][] = resp.data
            let tt = t.map((item) => {
                let d: Danmaku = {
                    txt: item[0],
                    cnt: item[1],
                }
                return d
            })
            setTopDanmakuList(tt)
        }).catch((e) => {
            console.error(e)
        })
    }

    const GetDanmakuInfo = (text: string) => {
        const host = getBackendHost()
        axios.get(`${host}/api/danmaku_info?col=danmaku_info&text=${text}`).then((resp) => {
            let t: DanmakuInfo[] = resp.data.data
            let total = resp.data.total
            if (total && total > 0) {
                setDanmakuInfo(t[0])
            }
        }).catch((e) => {
            console.error(e)
        })
    }

    const ArchiveDanmaku = (text: string) => {
        const host = getBackendHost()
        axios.post(`${host}/api/archive_danmaku`, {text: text, room_id: room_id}).then((resp) => {
            console.log(resp)
            window.location.reload();
        }).catch((e) => {
            console.error(e)
        })
    }

    const GetCommonDanmaku = () => {
        const host = getBackendHost()
        axios.get(`${host}/api/common_danmaku/${room_id}`).then((resp) => {
            console.log(resp)
            setCommonDanmakuList(resp.data)
        }).catch((e) => {
            console.error(e)
        })
    }

    const DeleteCommonDanmaku = (text: string) => {
        const host = getBackendHost()
        axios.delete(`${host}/api/danmaku?text=${text}`).then((resp) => {
            window.location.reload();
        }).catch((e) => {
            console.error(e)
        })
    }

    useEffect(() => {
        GetTopDanmaku(queryNum)
    }, []);

    useEffect(() => {
        if (isCommonDanmaku) {
            GetCommonDanmaku()
        }
    }, [isCommonDanmaku]);

    const commonDanmakuCols: TableProps<{ text: string }>['columns'] = [
        {
            title: 'Txt',
            dataIndex: 'text',
            key: 'txt'
        },
        {
            title: 'Delete',
            dataIndex: 'text',
            key: 'archive',
            render: (txt) => {
                return <Button onClick={() => {
                    DeleteCommonDanmaku(txt)
                }}><DeleteOutlined/></Button>
            }
        }
    ]

    const topDanmakuCols: TableProps<Danmaku>['columns'] = [
        {
            title: 'Txt',
            dataIndex: 'txt',
            key: 'txt',
            render: (txt) => {
                let ct = danmakuInfo ? convertTimestampToDate(danmakuInfo.create_time_stamp) : ""
                return <span>
                    <Popover
                        content={
                            <Card title={"Danmaku Info"} extra={<Button onClick={() => {
                                setDanmakuInfo(undefined)
                            }}><CloseOutlined/></Button>}>
                                <p>create time: {ct}</p>
                                <p>author: {danmakuInfo?.first_author}</p>
                                <p>badge: {danmakuInfo?.first_author_badge}</p>
                            </Card>
                        }
                        open={danmakuInfo !== undefined && danmakuInfo.text === txt}
                    >
                            <a onClick={() => {
                                GetDanmakuInfo(txt)
                            }}>{txt}</a>
                    </Popover>
                <Button onClick={() => {
                    navigator.clipboard.writeText(txt).then(() => {
                        messageApi.info('copied')
                    }).catch(err => {
                        messageApi.error('copy error: ', err);
                    });
                }}><CopyOutlined/> </Button>
                </span>

            }
        },
        {
            title: 'Cnt',
            dataIndex: 'cnt',
            key: 'cnt',
        },
        {
            title: 'Archive',
            dataIndex: 'txt',
            key: 'archive',
            render: (txt) => {
                return <Button onClick={() => {
                    ArchiveDanmaku(txt)
                }}><DeleteOutlined/></Button>
            }
        }
    ]

    return <div>
        <InputNumber placeholder={'query amount'} value={queryNum} onChange={(n) => {
            if (n) {
                setQueryNum(n)
            }
        }}/>
        <Button onClick={() => {
            GetTopDanmaku(queryNum)
        }}>Query</Button>
        {contextHolder}
        <Table dataSource={topDanmakuList} columns={topDanmakuCols}></Table>
        <Switch value={isCommonDanmaku} onChange={(checked) => {
            setIsCommonDanmaku(checked)
        }}/>
        {isCommonDanmaku ? <Table dataSource={commonDanmakuList} columns={commonDanmakuCols}></Table> : null}
    </div>
}