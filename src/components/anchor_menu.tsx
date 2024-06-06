import React from "react";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {Menu, MenuItem} from "@mui/material";

export const AnchorMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let navigate = useNavigate();

    return (
        <div>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                Menu
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    navigate('/')
                    setAnchorEl(null);
                }}>Home</MenuItem>
                <MenuItem onClick={() => {
                    navigate('/room')
                    setAnchorEl(null);
                }}>Rooms</MenuItem>
                {/*<MenuItem onClick={handleClose}>Logout</MenuItem>*/}
            </Menu>
        </div>
    );
}