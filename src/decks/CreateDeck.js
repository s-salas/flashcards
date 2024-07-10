import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDeck, listDecks } from "../utils/api/index.js"; // Ensure these imports are correct

function CreateDeck({ newDeck }) {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [error, setError] = useState(null);
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDecks() {
      try {
        const deckList = await listDecks();
        setDecks(deckList);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    }

    fetchDecks();
  }, []);

  const handleNameChange = (event) => {
    setDeckName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDeckDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (deckName.trim() === "") {
      setError("Deck name cannot be empty");
      return;
    }

    const maxId = decks.length > 0 ? Math.max(...decks.map(deck => deck.id)) : 0;
    const newDeckData = {
      id: maxId + 1,
      name: deckName,
      description: deckDescription,
    };

    try {
      const createdDeck = await createDeck(newDeckData);
      setDeckName(""); // Reset the input fields
      setDeckDescription("");
      setError(null); // Clear any existing error
      navigate(`/`); // Navigate to the Home page
      newDeck(newDeckData);
    } catch (error) {
      console.error("Error creating deck:", error);
      setError("An error occurred while creating the deck");
    }
  };

  return (
    <div>
      <h2>Create Deck</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Deck Name:
          <input type="text" value={deckName} onChange={handleNameChange} required />
        </label>
        <br />
        <label>
          Deck Description:
          <input type="text" value={deckDescription} onChange={handleDescriptionChange} required />
        </label>
        <br />
        <button type="submit">Add Deck</button>
      </form>
    </div>
  );
}

export default CreateDeck;
