import "./SingleCard.css";

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
          src="/img/pokemon_card_backside.png"
          onClick={handleClick}
          alt="card back"
        />
      </div>
    </div>
  )
}
