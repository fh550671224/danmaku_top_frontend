export const getBackendHost = ():string =>{
    const local_dev = process.env.REACT_APP_LOCAL_DEV
    if(local_dev == "1"){
        return "localhost"
    } else{
        return "danmaku_top"
    }
}