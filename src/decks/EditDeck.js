import React, { useEffect, useState } from "react";
import { readDeck } from "../utils/api/index.js";
import { useParams, useNavigate } from "react-router-dom";

function EditDeck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  // You must use the readDeck() function from src/utils/api/index.js to load the existing deck.

  useEffect(() => {
    async function getDeck() {
      try {
        const deckResult = await readDeck(deckId);
        setDeck(deckResult);
        setCards(deckResult.cards || []);
      } catch (error) {
        console.error("Error loading deck: ", error);
      }
    }

    if (deckId) {
      getDeck();
    }
  }, [deckId]);

  const handleSubmit = (event) => {
    event.preventDefault();
}

	// If the user clicks Cancel, the user is taken to the Deck screen.
function handleCancel() {
    navigate(`/decks/${deckId}`);
    }

  return (
  <>
  {deck ? (
    <div><form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Name:
        <input 
        type="text" 
        id="name" 
        name="name" 
        placeholder={deck.name} />
      </label>
      <label htmlFor="description">
        Description:
        <textarea 
        id="description" 
        rows="4" 
        name="description" 
        placeholder={deck.description} />
      </label>
      <button type="submit">Submit</button>
      <button type="cancel" onClick={handleCancel}>Cancel</button>
    </form>
    </div>
   ) : (
    <p>Loading deck...</p>
  )}
  </>
  );
}

export default EditDeck;

/*
•	There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck being edited, and finally the text Edit Deck (e.g., Home/Rendering in React/Edit Deck).
•	The user can edit and update the form.
*/
