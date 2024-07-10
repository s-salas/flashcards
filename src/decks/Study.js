import React, { useEffect, useState } from "react";
import { readDeck } from "../utils/api/index.js";
import { useParams, useNavigate } from "react-router-dom";

function Study() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFront, setCardFront] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getDeck() {
      try {
        const deckResult = await readDeck(deckId);
        setDeck(deckResult);
        setCards(deckResult.cards || []);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
    }

    if (deckId) {
      getDeck();
    }
  }, [deckId]);

  function handleFlip() {
    setCardFront((prevState) => !prevState);
  }

  function handleNext() {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setCardFront(true);
    } else {
      if (window.confirm("Restart the deck?")) {
        setCurrentCardIndex(0);
        setCardFront(true);
      } else {
        navigate("/");
      }
    }
  }

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  if (cards.length < 3) {
    return (
      <div>
        <h3>Not enough cards</h3>
        <p>You need at least 3 cards to study. Please add more cards to this deck.</p>
        <button onClick={() => navigate(`/decks/${deckId}/cards/new`)}>Add Cards</button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div>
      <h2>Studying: {deck.name}</h2>
      <h3>
        Card {currentCardIndex + 1} of {cards.length}
      </h3>
      <div key={currentCard.id}>
        <p>{cardFront ? currentCard.front : currentCard.back}</p>
        <button onClick={handleFlip}>Flip</button>
        {!cardFront && <button onClick={handleNext}>Next</button>}
      </div>
    </div>
  );
}

export default Study;
