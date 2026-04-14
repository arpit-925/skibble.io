import { useContext } from "react";
import { GameContext } from "./GameContextValue";

export default function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
