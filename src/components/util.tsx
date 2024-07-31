
const admins = [
    'test'
]

export const is_admin = ()=>{
    const username = localStorage.getItem('username')
    if(admins.some((v)=>{
        return v == username
    })){
        return true
    }
    return false
}

export const get_user = ()=>{
    console.log('fsfs', localStorage.getItem('username'))
    return localStorage.getItem('username')

}