import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:roomId" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
