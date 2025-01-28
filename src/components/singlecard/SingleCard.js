import "./SingleCard.css";
import pokemon_card_backside from "../../img/pokemon_card_backside.png"

export default function SingleCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if(!disabled){
      handleChoice(card)
    }
  }

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.images.small} alt="card front" />
        <img
          className="back"
          src={pokemon_card_backside}
          onClick={handleClick}
          alt="card back"
        />
      </div>
    </div>
  )
}
