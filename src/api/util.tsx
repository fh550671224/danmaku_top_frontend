
export type RoomInfo = {
    room: string,
    streamer_name: string,

}

export const getBackendHost = (): string => {
    const local_dev = process.env.REACT_APP_LOCAL_DEV
    if (local_dev == "1") {
        return "http://localhost:5000"
    } else {
        return ""
    }
}
export const convertTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp*1000);

    // 格式化日期和时间字符串
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // 返回格式化后的日期时间字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}