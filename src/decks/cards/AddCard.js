import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { readDeck, createCard } from "../../utils/api/index.js";

function AddCard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const loadDeck = async () => {
      try {
        // must use the readDeck() function from src/utils/api/index.js to load the deck
        const deckData = await readDeck(deckId, abortController.signal);
        setDeck(deckData);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
    };

    loadDeck();

    return () => abortController.abort();
  }, [deckId]);

  const handleFrontChange = (event) => {
    setFront(event.target.value);
  };

  const handleBackChange = (event) => {
    setBack(event.target.value);
  };

  // a save button creates the new card, clears the form, and the process for adding a card is restarted
  const handleSave = async (event) => {
    event.preventDefault();
    const card = {
      front,
      back,
    };
    try {
      await createCard(deckId, card);
      setFront("");
      setBack("");
      // Reload deck after adding a card if needed
      const updatedDeck = await readDeck(deckId);
      setDeck(updatedDeck);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // a done button takes the user to the deck screen
  const handleDone = () => {
    navigate(`/decks/${deckId}`);
  };

  if (!deck) {
    return <p>Loading deck...</p>;
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
            Add Card
          </li>
        </ol>
      </nav>
      <h2>Add Card</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label htmlFor="front" className="form-label">
            Front
          </label>
          <textarea
            className="form-control"
            id="front"
            name="front"
            rows="3"
            value={front}
            onChange={handleFrontChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="back" className="form-label">
            Back
          </label>
          <textarea
            className="form-control"
            id="back"
            name="back"
            rows="3"
            value={back}
            onChange={handleBackChange}
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={handleDone}
        >
          Done
        </button>
        <button type="submit" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
}

export default AddCard;
