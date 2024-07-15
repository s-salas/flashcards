import React, { useEffect, useState } from "react";
import { readDeck } from "../utils/api/index.js";
import { useParams, useNavigate, Link } from "react-router-dom";

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

    getDeck();
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
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h2>{deck.name}: Study</h2>

        <h3 className="mt-3">Not enough cards</h3>
        <p>
          You need at least 3 cards to study. Please add more cards to this
          deck.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/decks/${deckId}/cards/new`)}
        >
          Add Cards
        </button>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Study
          </li>
        </ol>
      </nav>
      <h2>{deck.name}: Study</h2>
      <div className="card p-3">
        <h3 className="mb-3">
          Card {currentCardIndex + 1} of {cards.length}
        </h3>
        <div key={cards[currentCardIndex].id}>
          <p>
            {cardFront
              ? cards[currentCardIndex].front
              : cards[currentCardIndex].back}
          </p>
          <button className="btn btn-secondary mr-2" onClick={handleFlip}>
            Flip
          </button>
          {!cardFront && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Study;
