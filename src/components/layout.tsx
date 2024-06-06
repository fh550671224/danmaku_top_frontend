import React from 'react';
import { Outlet } from 'react-router-dom';
import {AnchorMenu} from "./anchor_menu";

export const Layout: React.FC = () => {
    return (
        <div>
            <AnchorMenu />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;