import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Welcome} from "./pages/welcome";
import {RoomIndex} from "./pages/room/";
import {RoomComponent} from "./pages/room/room_component";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/room" element={<RoomIndex/>}/>
                <Route path="room/:room_id" element={<RoomComponent />} />
            </Routes>
        </Router>
    );
}

export default App;
