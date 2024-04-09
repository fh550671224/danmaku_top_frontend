import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {List, ListItem, ListItemButton, Snackbar} from "@mui/material";
import { message } from 'antd';

type Danmaku = {
    txt: string,
    cnt: number,
}

export const RoomComponent = () => {
    const [danmakuList, setDanmakuList] = useState<Danmaku[]>([])
    const [messageApi, contextHolder] = message.useMessage();

    const params = useParams();
    const room_id = params.room_id;

    const GetTopDanmaku = (n: number) => {
        axios.get(`http://localhost:5000/danmaku_top/${room_id}?n=${n}`).then((resp) => {
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
        GetTopDanmaku(100)
    }, []);

    useEffect(() => {
        console.log("fsfsfs", danmakuList)
    }, [danmakuList]);

    const info = (txt:string)=>{
        messageApi.info(txt);
    }

    return <div>{contextHolder}<List>
        {danmakuList.map((item)=>{
            return <ListItem>
                <ListItemButton onClick={()=>{
                    navigator.clipboard.writeText(item.txt).then(() => {
                        info('copied')
                    }).catch(err => {
                        console.error('无法复制文本: ', err);
                    });
                }}>{item.txt}
                    {"\t次数:"}{item.cnt}</ListItemButton>

            </ListItem>
        })}
    </List>
    </div>

    // return <div>{danmakuList.length == 0? "tt": danmakuList[0].txt}</div>;
}