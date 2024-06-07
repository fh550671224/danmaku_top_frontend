import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {List, ListItem, ListItemButton, Snackbar} from "@mui/material";
import {CopyOutlined,CloseOutlined} from '@ant-design/icons';
import {Card, InputNumber, message, Popover, Table} from 'antd';
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
    const [danmakuList, setDanmakuList] = useState<Danmaku[]>([])
    const [queryNum, setQueryNum] = useState(100)
    const [danmakuInfo, setDanmakuInfo] = useState<DanmakuInfo>()

    const [messageApi, contextHolder] = message.useMessage();

    const params = useParams();
    const room_id = params.room_id;

    const GetTopDanmaku = (n: number) => {
        const host = getBackendHost()
        axios.get(`${host}/api/${room_id}?n=${n}`).then((resp) => {
            let t: [string, number][] = resp.data
            let tt = t.map((item) => {
                let d: Danmaku = {
                    txt: item[0],
                    cnt: item[1],
                }
                return d
            })
            setDanmakuList(tt)
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

    useEffect(() => {
        GetTopDanmaku(queryNum)
    }, []);

    const cols: TableProps<Danmaku>['columns'] = [
        {
            title: 'Txt',
            dataIndex: 'txt',
            key: 'txt',
            render: (txt) => {
                let ct = danmakuInfo?convertTimestampToDate(danmakuInfo.create_time_stamp):""
                return <span>
                    <Popover
                        content={
                            <Card title={"Danmaku Info"} onBlur={() => {
                            }} extra={<Button onClick={()=>{
                                setDanmakuInfo(undefined)
                            }}><CloseOutlined /></Button>}>
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
        {/*<List dataSource={danmakuList} renderItem={(item) =>{*/}
        {/*    return <List.Item>*/}
        {/*        <Button onClick={() => {*/}
        {/*            navigator.clipboard.writeText(item.txt).then(() => {*/}
        {/*                messageApi.info('copied')*/}
        {/*            }).catch(err => {*/}
        {/*                messageApi.error('copy error: ', err);*/}
        {/*            });*/}
        {/*        }}>{item.txt}*/}
        {/*            {"\t次数:"}{item.cnt}</Button>*/}
        {/*    </List.Item>*/}
        {/*}}></List>*/}
        <Table dataSource={danmakuList} columns={cols}></Table>

        {/*<List>*/}
        {/*    {danmakuList.map((item) => {*/}
        {/*        return <ListItem>*/}
        {/*            <ListItemButton onClick={() => {*/}
        {/*                navigator.clipboard.writeText(item.txt).then(() => {*/}
        {/*                    messageApi.info('copied')*/}
        {/*                }).catch(err => {*/}
        {/*                    messageApi.error('copy error: ', err);*/}
        {/*                });*/}
        {/*            }}>{item.txt}*/}
        {/*                {"\t次数:"}{item.cnt}</ListItemButton>*/}

        {/*        </ListItem>*/}
        {/*    })}*/}
        {/*</List>*/}
    </div>
}