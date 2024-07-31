import {get_user} from "./util";
import Button from "@mui/material/Button";
import {Popover} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";
import {getBackendHost} from "../api/util";
import axios from "axios";

export const UserCard = () => {
    let navigate = useNavigate();

    const Logout = () => {
        const host = getBackendHost()
        axios.post(`${host}/api/logout`, {username:'username'}).then((resp) => {
            localStorage.removeItem("username")
            navigate('/')
        }).catch((e) => {
            console.error(e)
        })
    }

    return <div>{
        get_user() == null ? (<Button className="top-right-button" onClick={() => navigate('/login')}>
            Login
        </Button>) : (<Popover content={<div><Button onClick={() => {
            Logout()
        }}>Logout</Button></div>}>
            <div>{get_user()}</div>
        </Popover>)
    }</div>

}