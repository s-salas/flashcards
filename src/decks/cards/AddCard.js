import React, { useEffect, useState } from "react";
import { readDeck } from "../../utils/api/index.js";
import { useParams, useNavigate } from "react-router-dom";

function AddCard() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  // You must use the readDeck() function from src/utils/api/index.js to load the deck that you're adding the card to.
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

  // If the user clicks Done, the user is taken to the Deck screen.
  const handleDone = (event) => {
    event.preventDefault();
    navigate(`/decks/${deckId}`);
  };

  /* If the user clicks Save, a new card is created and associated with the relevant deck. 
Then the form is cleared and the process for adding a card is restarted.
*/
  const handleSave = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {deck ? (
        <div>
          <h2>{deck.name}: Add Card</h2>
          <form>
            <label htmlFor="front">
              Front:
              <input
                type="text"
                id="front"
                name="front"
                rows="2"
                placeholder="Front side of card"
              />
            </label>
            <label htmlFor="back">
              Back:
              <input
                type="text"
                id="back"
                name="back"
                rows="2"
                placeholder="Back side of card"
              />
            </label>
            <button type="done" onClick={handleDone}>
              Done
            </button>
            <button type="save" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      ) : (
        <p>Loading deck...</p>
      )}
    </>
  );
}

export default AddCard;

/*
•	There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck to which the cards are being added, and finally the text Add Card (e.g., Home/React Router/Add Card).
*/
