import {Input} from "antd";
import Button from "@mui/material/Button";
import {useState} from "react";
import axios from "axios";
import {getBackendHost} from "../../api/util";
import {useNavigate} from "react-router-dom";

export const Login = () => {
    let navigate = useNavigate();


    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const Login = () => {
        const host = getBackendHost()
        axios.post(`${host}/api/login`, {username: username, password: password}).then((resp) => {
            console.log(resp)
            navigate('/')
        }).catch((e) => {
            console.error(e)
        })
    }

    const Register = () => {
        const host = getBackendHost()
        axios.post(`${host}/api/register`, {username: username, password: password}).then((resp) => {
            console.log(resp)
            navigate('/')
        }).catch((e) => {
            console.error(e)
        })
    }

    return <div>
        <Input placeholder={'username'} value={username} onChange={(v) => {
            setUsername(v.target.value)
        }}/>
        <Input.Password placeholder={'password'} value={password} onChange={(v) => {
            setPassword(v.target.value)
        }}/>
        <Button onClick={() => {
            Login()
        }}>Login</Button>
        {/*<Button onClick={() => {*/}
        {/*    Register()*/}
        {/*}}>Register</Button>*/}
    </div>
}