import "./App.css";
import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";

// const cardImages = [
//   { src: "/img/helmet-1.png", matched: false },
//   { src: "/img/potion-1.png", matched: false },
//   { src: "/img/ring-1.png", matched: false },
//   { src: "/img/scroll-1.png", matched: false },
//   { src: "/img/shield-1.png", matched: false },
//   { src: "/img/sword-1.png", matched: false },
// ];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [cardImages, setCardImages] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);

  //fetch pokemon api
  const fetchPokemon = async () => {
    const newArray = [];
    try {
      const response = await fetch(
        "https://api.pokemontcg.io/v2/cards?pageSize=40"
      );

      if (!response.ok) {
        throw new Error("Could not fetch data from API");
      }
      const tcgraw = await response.json();
      const data = tcgraw.data;
      const pokemons = [...data].map((d) => ({ ...d, matched: false }));
      getDataSlice(pokemons);
      
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
    setEnergy(100);
    setScore(0);
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  //hand choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.name === choiceTwo.name) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.name === choiceOne.name) {
              setEnergy(energy+10)
              setScore(score+1)
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        
        resetTurn();
      } else {
        setEnergy(energy-20)
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };
  
  useEffect(() => {
    fetchPokemon();
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Pokemon Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-record">
        <p>Energy: {energy}%</p>
        <p>Score: {score}</p>
        <p>Turns: {turns}</p>
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
  );
}

export default App;
