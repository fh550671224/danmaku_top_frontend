import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Homepage} from "./pages/homepage";
import {RoomDetail} from "./pages/room/$room_id/room_detail";
import Layout from "./components/layout";
import {RoomIndex} from "./pages/room/room_index";

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Homepage/>}/>
                        <Route path="/room" element={<RoomIndex/>}/>
                        <Route path="/room/:room" element={<RoomDetail/>}/>
                        <Route path="/login" element={<div>login</div>}/>
                    </Route>
                </Routes>
        </Router>
);
}

export default App;
