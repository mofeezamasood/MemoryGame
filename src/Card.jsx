// Card.jsx

import React from "react";
import "./Card.css";

const Card = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="Card Front" />
        <div className="back" onClick={handleClick}>
          <div className="text">?</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
