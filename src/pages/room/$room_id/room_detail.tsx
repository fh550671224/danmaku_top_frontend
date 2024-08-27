import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {CopyOutlined, UpOutlined, DownOutlined, DeleteOutlined} from '@ant-design/icons';
import {Select, Card, Input, InputNumber, message, Popover, Switch, Table, TablePaginationConfig} from 'antd';
import type {TableProps} from 'antd';
import Button from "@mui/material/Button";
import {convertTimestampToDate, getBackendHost} from "../../../api/util";
import '../../../styles/style.css';
import {is_admin} from "../../../components/util";
import {DanmakuInfo} from "../../../api/danmaku";
import {downloadCSV} from "../../../components/download";


export const RoomDetail = () => {
    const params = useParams();
    const room = params.room;

    // save url below
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const initialPage = parseInt(query.get('page') || '1', 10);
    const initialPageSize = parseInt(query.get('pageSize') || '10', 10);
    const initialQueryText = query.get('text') || ''
    const initialQueryNum = parseInt(query.get('topn') || '100', 10)
    const initialTraceBackTime = parseInt(query.get('trace_back_time') || '86400', 10)
    const initialHotOnly = query.get('hot_only') === 'true'
    const initialAuthor = query.get('author') || ''
    const initialHostFirst = query.get('hot_first') === 'true'

    const [danmakuList, setDanmakuList] = useState<DanmakuInfo[]>([])

    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialPageSize);
    const [queryNum, setQueryNum] = useState(initialQueryNum)
    const [queryText, setQueryText] = useState<string>(initialQueryText)
    const [hotOnly, setHotOnly] = useState<boolean>(initialHotOnly)
    const [traceBackTime, setTraceBackTime] = useState(initialTraceBackTime)
    const [author, setAuthor] = useState(initialAuthor)
    const [hotFirst, setHotFirst] = useState<boolean>(initialHostFirst || true)

    const [messageApi, contextHolder] = message.useMessage();

    const GetDanmaku = () => {
        const host = getBackendHost()
        axios.get(`${host}/api/danmaku/${room}?n=${queryNum}&text=${queryText}&hot_only=${hotOnly}&trace_back_time=${traceBackTime}&author=${author}&hot_first=${hotFirst}`).then((resp) => {
            setDanmakuList(resp.data)
        }).catch((e) => {
            messageApi.error(e);
            console.error(e)
        })
    }

    const UpdateDanmaku = (record: DanmakuInfo) => {
        const host = getBackendHost()
        axios.put(`${host}/api/danmaku/${record.room}`, record).then((resp) => {
            console.log(resp)
            window.location.reload();
        }).catch((e) => {
            messageApi.error(e);
            console.error(e)
        })
    }

    const DeleteDanmaku = (record: DanmakuInfo) => {
        const host = getBackendHost()
        axios.post(`${host}/api/delete_danmaku`, record).then((resp) => {
            console.log(resp)
            window.location.reload();
        }).catch((e) => {
            messageApi.error(e);
            console.error(e)
        })
    }

    useEffect(() => {
        GetDanmaku()
    }, []);

    useEffect(() => {
        GetDanmaku()
    }, [hotOnly, traceBackTime, author, queryText, queryNum, hotFirst]);

    useEffect(() => {
        query.set('page', currentPage.toString());
        query.set('pageSize', pageSize.toString());
        query.set('text', queryText)
        // query.set('topn', queryNum.toString())
        query.set('trace_back_time', traceBackTime.toString())
        // query.set('hot_only', hotOnly ? 'true' : 'false')
        query.set('author', author)
        query.set('hot_first', hotFirst ? 'true' : 'false')
        navigate({search: query.toString()}, {replace: true});
    }, [currentPage, pageSize, navigate, queryText, queryNum, traceBackTime, hotOnly, author, hotFirst]);

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
                                <p>author: <a onClick={() => {
                                    setAuthor(record.first_author)
                                }}>{record.first_author}</a></p>
                                <p>badge: {record.first_author_badge}</p>
                            </Card>
                        }
                        trigger={'hover'}
                    >
                            <a style={{color: record.is_hot ? 'coral' : 'blue'}} onClick={() => {
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
    ]

    if (is_admin()) {
        topDanmakuCols.push({
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
                <Button onClick={() => {
                    DeleteDanmaku(record)
                }}><DeleteOutlined/></Button>
                </span>
            }
        })
    }

    return <Card title={'Danmaku List'} extra={is_admin() ? <Button onClick={() => {
        downloadCSV(danmakuList, 'res.csv')
    }}>Download</Button> : null}>
        {/*<span><> topN:</><InputNumber placeholder={'query amount'} value={queryNum} onChange={(n) => {*/}
        {/*    if (n) {*/}
        {/*        setQueryNum(n)*/}
        {/*    }*/}
        {/*}}/> </span>*/}
        <Input placeholder={'keyword search'} onPressEnter={() => {
            GetDanmaku()
        }} allowClear style={{'width': 500}} value={queryText} onChange={(e) => {
            setQueryText(e.target.value)
        }}/>
        <Input placeholder={'author search'} onPressEnter={() => {
            GetDanmaku()
        }} allowClear style={{'width': 500}} value={author} onChange={(e) => {
            setAuthor(e.target.value)
        }}/>
        {/*<Switch value={hotOnly} onChange={(checked) => {*/}
        {/*    setHotOnly(checked)*/}
        {/*}}/>*/}
        <Switch value={hotFirst} onChange={(checked) => {
            setHotFirst(checked)
        }}/>
        <Select defaultValue={24 * 60 * 60} value={traceBackTime} options={[
            {value: 0, label: 'ALL TIME'},
            {value: 24 * 60 * 60, label: 'LAST 24 HOURS'},
            {value: 3 * 24 * 60 * 60, label: 'LAST 72 HOURS'},
            {value: 7 * 24 * 60 * 60, label: 'LAST 1 WEEK'},
            {value: 30 * 24 * 60 * 60, label: 'LAST 30 DAYS'},
        ]} onChange={(v: number) => {
            setTraceBackTime(v)
        }}></Select>
        <Button onClick={() => {
            GetDanmaku()
        }}>Query</Button>

        {contextHolder}
        <Table dataSource={danmakuList} columns={topDanmakuCols} pagination={{current: currentPage, pageSize}}
               onChange={(
                   pagination: TablePaginationConfig
               ) => {
                   setCurrentPage(pagination.current || 1);
                   setPageSize(pagination.pageSize || 10);
               }}></Table>
    </Card>
}