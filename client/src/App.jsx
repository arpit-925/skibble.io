import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";

import Layout from "./components/Layout";

import ContactPage from "./pages/Contact";
import CreditsPage from "./pages/Credits";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import PrivacyPage from "./pages/Privacy";
import Room from "./pages/Room";
import TermsPage from "./pages/Terms";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout Wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}