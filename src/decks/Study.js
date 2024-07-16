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
        // must use readDeck() function from src/utils/api/index.js to load deck being studied
        const deckResult = await readDeck(deckId);
        setDeck(deckResult);
        setCards(deckResult.cards || []);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
    }

    getDeck();
  }, [deckId]);

  // a button at the bottom of each card flips it to the other side
  function handleFlip() {
    setCardFront((prevState) => !prevState);
  }

  // after each flip, the screen shows a next button to continue to the next card
  function handleNext() {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setCardFront(true);
      // after the final card in the deck is shown, a message displays offering to restart the deck
    } else {
      if (window.confirm("Restart the deck?")) {
        // window.confirm() creates modal dialogue
        setCurrentCardIndex(0);
        setCardFront(true);
        // if the user chooses not restart, they are navigated to the home screen
      } else {
        navigate("/");
      }
    }
  }

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  // if there are 2 or fewer cards in the deck, a message should display that there's not enough cards with a button to add cards
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
