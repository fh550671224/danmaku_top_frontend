import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Button from "@mui/material/Button";

const Layout = () => {
    let navigate = useNavigate();
    return (
        <div className="container">
            <div className="menu">
                <div className="menu-links">
                    <Button onClick={() => navigate('/')}>Home</Button>
                    <Button onClick={() => navigate('/room')}>Rooms</Button>
                </div>
                <Button className="top-right-button" onClick={() => navigate('/login')}>
                    Login
                </Button>
            </div>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};
export default Layout;