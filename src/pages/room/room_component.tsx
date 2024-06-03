import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {List, ListItem, ListItemButton, Snackbar} from "@mui/material";
import {InputNumber, message, Table} from 'antd';
import type { TableProps } from 'antd';
import Button from "@mui/material/Button";
import {getBackendHost} from "../../api/util";

type Danmaku = {
    txt: string,
    cnt: number,
}

export const RoomComponent = () => {
    const [danmakuList, setDanmakuList] = useState<Danmaku[]>([])
    const [queryNum, setQueryNum] = useState(100)

    const [messageApi, contextHolder] = message.useMessage();

    const params = useParams();
    const room_id = params.room_id;

    const GetTopDanmaku = (n: number) => {
        const host = getBackendHost()
        axios.get(`/api/${room_id}?n=${n}`).then((resp) => {
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

    useEffect(() => {
        GetTopDanmaku(queryNum)
    }, []);

    const cols: TableProps<Danmaku>['columns'] = [
        {
            title: 'Txt',
            dataIndex: 'txt',
            key: 'txt',
            render: (txt)=>{
                return <Button onClick={() => {
                    navigator.clipboard.writeText(txt).then(() => {
                        messageApi.info('copied')
                    }).catch(err => {
                        messageApi.error('copy error: ', err);
                    });
                }}>{txt}</Button>
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
            if(n){
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