import "./Mechanics.css";
import Button from "../button/Button";
import { useState, useEffect } from "react";

export default function Mechanics({ shuffleCards }) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBtn(!showBtn);
    }, 2000);
  }, []);

  return (
    <div className="container">
      <h2>
        <u>Game Mechanics</u>
      </h2>
      <i>
        The goal is pretty simple you just have to match every pair of pokemons
        cards
      </i>
      <div className="rules">
        <p>i : You have 100% energy at a start.</p>
        <p>ii : Matched cards will add 10% of energy.</p>
        <p>iii : Mismatched cards will deduct 20% of energy.</p>
        <p>iv : Zero energy is obviously a game over.</p>
      </div>
      {showBtn && <Button shuffleCards={shuffleCards} />}
    </div>
  );
}
