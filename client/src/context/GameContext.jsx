import { useMemo, useState } from "react";
import { GameContext } from "./GameContextValue";


export function GameProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerNameState] = useState(localStorage.getItem("playerName") || "");
  const [messages, setMessages] = useState([]);

  const setPlayerName = (name) => {
    localStorage.setItem("playerName", name);
    setPlayerNameState(name);
  };

  const value = useMemo(
    () => ({
      room,
      setRoom,
      playerName,
      setPlayerName,
      messages,
      setMessages,
    }),
    [messages, playerName, room],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
