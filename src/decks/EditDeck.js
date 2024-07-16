import React, { useEffect, useState } from "react";
import { readDeck, updateDeck } from "../utils/api/index.js";
import {
  useParams,
  useNavigate,
  Link,
  useOutletContext,
} from "react-router-dom";

function EditDeck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { handleUpdateDeck } = useOutletContext();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getDeck() {
      try {
        // must use the readDeck() function from src/utils/api/index.js to load the existing deck
        const deckResult = await readDeck(deckId, signal);
        setDeck(deckResult);
        setName(deckResult.name || "");
        setDescription(deckResult.description || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading deck: ", error);
        }
      }
    }

    if (deckId) {
      getDeck();
    }

    return () => {
      controller.abort();
    };
  }, [deckId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedDeck = {
      ...deck,
      name,
      description,
    };

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const updatedDeckResult = await updateDeck(updatedDeck, signal);
      // call the update function passed from the parent component
      handleUpdateDeck(updatedDeckResult);
      navigate(`/decks/${deckId}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error updating deck: ", error);
      }
    }
  };

  // a cancel button takes the user to the deck screen
  const handleCancel = () => {
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
            Edit Deck
          </li>
        </ol>
      </nav>
      <h2>Edit Deck</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mr-2">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditDeck;
