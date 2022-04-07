import 'App.css';
import {SocketContext} from 'context/socket'
import Game from "components/game/game";
import io from 'socket.io-client';

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// Material Kit 2 React themes
import theme from 'assets/theme';

const socket = io();

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <SocketContext.Provider value={socket}>
                    <Game></Game>
                </SocketContext.Provider>
            </ThemeProvider>

        </div>
    );
}

export default App;
