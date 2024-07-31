import {getBackendHost} from "./util";
import axios from "axios";

export type DanmakuInfo = {
    create_time: number,
    first_author: string,
    first_author_badge: string,
    room: string,
    text: string,
    count: number,
    is_hot: boolean
}
// export const GetDanmaku = () => {
//     const host = getBackendHost()
//     axios.get(`${host}/api/danmaku/${room}?n=${queryNum}&text=${queryText}&hot_only=${hotOnly}&trace_back_time=${traceBackTime}&author=${author}&hot_first=${hotFirst}`).then((resp) => {
//         setDanmakuList(resp.data)
//     }).catch((e) => {
//         console.error(e)
//     })
// }
//
// export const UpdateDanmaku = (record: DanmakuInfo) => {
//     const host = getBackendHost()
//     axios.put(`${host}/api/danmaku/${record.room}`, record).then((resp) => {
//         console.log(resp)
//         window.location.reload();
//     }).catch((e) => {
//         console.error(e)
//     })
// }
//
// export const DeleteDanmaku = (record: DanmakuInfo) => {
//     const host = getBackendHost()
//     axios.post(`${host}/api/delete_danmaku`, record).then((resp) => {
//         console.log(resp)
//         window.location.reload();
//     }).catch((e) => {
//         console.error(e)
//     })
// }