import "./GameOver.css";
import Button from "../button/Button";
import { useState, useEffect } from "react";

export default function GameOver({shuffleCards}) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBtn(!showBtn);
    }, 2000);
  }, []);

  return (
    <div className="game-over">
      <h2>GAME OVER</h2>
      <p>You suck at this game brain rotted.</p>
      {showBtn && <Button shuffleCards={shuffleCards} />}
    </div>
  );
}
