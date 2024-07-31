import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Button from "@mui/material/Button";
import {get_user, is_admin} from "./util";
import {Popover} from "antd";
import {UserCard} from "./user_card";

const Layout = () => {
    let navigate = useNavigate();
    return (
        <div className="container">
            <div className="menu">
                <div className="menu-links">
                    <Button onClick={() => navigate('/')}>Home</Button>
                    <Button onClick={() => navigate('/room')}>Rooms</Button>
                    {is_admin() ? (<Button onClick={() => navigate('/manage')}>Manage</Button>) : null}
                    <div className="top-right-button"><UserCard /></div>
                </div>


            </div>
            <div className="main-content">
                <Outlet/>
            </div>
        </div>
    );
};
export default Layout;