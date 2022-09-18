import 'App.css';
import {SocketContext} from 'context/socket'
import Game from "components/game/game";
import Home from "components/home/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from 'socket.io-client';

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// Material Kit 2 React themes
import theme from 'assets/theme';

const socket = io();

// function App() {
//     return (
//         <div className="App">
//             <ThemeProvider theme={theme}>
//                 <SocketContext.Provider value={socket}>
//                     <Game></Game>
//                 </SocketContext.Provider>
//             </ThemeProvider>

//         </div>
//     );
// }

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={
        <>
        <ThemeProvider theme={theme}>
        <SocketContext.Provider value={socket}><Game /></SocketContext.Provider>
        </ThemeProvider>
        </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
