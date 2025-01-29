import "./App.css";
import { useState, useEffect } from "react";
import SingleCard from "./components/singlecard/SingleCard";
import Mechanics from "./components/mechanics/Mechanics";
import GameOver from "./components/gameover/GameOver";
import logo from "./img/pokemon_match.png";

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [cardImages, setCardImages] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [showCard, setShowCard] = useState(false);


  //fetch pokemon api
  const fetchPokemon = async () => {
    const newArray = [];
    try {
      const response = await fetch(
        "https://api.pokemontcg.io/v2/cards?pageSize=30"
      );

      if (!response.ok) {
        throw new Error("Could not fetch data from API");
      } else {
        const tcgraw = await response.json();
        const data = tcgraw.data;
        const pokemons = [...data].map((d) => ({ ...d, matched: false }));
        getDataSlice(pokemons);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //get pokemon that match from randomIndices
  const getDataSlice = (pokemons) => {
    const randomIndices = getRandomIndices(pokemons);

    const dataSlice = randomIndices.map((index) => pokemons[index]);
    setCardImages(dataSlice);

    return dataSlice;
  };

  //get random numbers
  const getRandomIndices = (pokemons) => {
    const randomIndicesArray = [];

    for (let i = 0; i < 10; i++) {
      const randomNum = Math.floor(Math.random() * pokemons.length);
      if (!randomIndicesArray.includes(randomNum)) {
        randomIndicesArray.push(randomNum);
      } else {
        i--;
      }
    }
    return randomIndicesArray;
  };

  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setEnergy(100);
    setTurns(0);
    setScore(0);
    setShowCard(true);
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
  };

  //hand choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  //compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.name === choiceTwo.name) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.name === choiceOne.name) {
              setEnergy(energy + 10);
              setScore(score + 1);
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          setEnergy(energy - 20);
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <img src={logo} alt="pokemon match" />

      {showCard ? null : <Mechanics shuffleCards={shuffleCards} />}
      {energy <= 0 ? <GameOver shuffleCards={shuffleCards} /> : null}
      <div className={showCard && energy > 0 ? "show" : "hidden"}>
        <div className="card-record">
          <span>
            <p>Turns: {turns}</p>
            <p>Score: {score}</p>
          </span>
          <span>
            <p>Energy: <progress value={energy} max="100" /> {energy}%</p>
          </span>
        </div>
        <div className="card-grid">
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
