import 'App.css';
import {SocketContext} from 'context/socket'
import Game from "components/game/game";
import Home from "components/home/home";
import HowToPlay from "components/home/howToPlay";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// Material Kit 2 React themes
import theme from 'assets/theme';


let playerName;

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
          <Route path="/rules" element={<HowToPlay />} />
          <Route path="/game" element={
          <>
          <ThemeProvider theme={theme}>
            <Game />
          </ThemeProvider>
          </>
          }/>
        </Routes>
      </Router>
  );
}

export default App;
