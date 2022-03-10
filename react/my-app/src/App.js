import logo from './logo.svg';
import './App.css';
import {SocketContext} from './context/socket'
import Game from "./components/game";
import DrawCard from "./components/drawCard";
import io from 'socket.io-client';

const socket = io();
let username = 'test'

function App() {
    return (
        <div className="App">
            <SocketContext.Provider value={socket}>
                <Game></Game>
            </SocketContext.Provider>

        </div>
    );
}

export default App;
