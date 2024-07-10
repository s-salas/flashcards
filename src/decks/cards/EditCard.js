import React, { useState, useEffect } from "react";
import { readDeck, readCard } from "../../utils/api/index.js";
import { useParams, useNavigate } from "react-router-dom";

function EditCard() {
  const { deckId } = useParams();
  const { cardId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [card, setCard] = useState([]);
  const navigate = useNavigate();

  // You must use the readDeck() function from src/utils/api/index.js to load the deck that contains the card to be edited.

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

    // Additionally, you must use the readCard() function from src/utils/api/index.js to load the card that you want to edit.
    async function getCard() {
      try {
        const cardResult = await readCard(cardId);
        setCard(cardResult);
      } catch (error) {
        console.log("Error loading card: ", error);
      }
    }

    if (deckId) {
      getDeck();
    }

    if (cardId) {
        getCard();
    }
  }, [deckId]);

  // If the user clicks on either Save or Cancel, the user is taken to the Deck screen.

  function handleCancel() {
    navigate(`/decks/${deckId}`);
  };

  function handleSave() {
    console.log('save button working');
    navigate(`/decks/${deckId}`);
  };

  // It displays the same form as the Add Card screen, except it is prefilled with information for the existing card. It can be edited and updated.

  return (
  <>
  {deck && card ? (
    <div>
        <h2>Edit Card</h2>
          <form>
            <label htmlFor="front">
              Front
              <input
                type="text"
                id="front"
                name="front"
                rows="2"
                placeholder={card.front}
              />
            </label>
            <label htmlFor="back">
              Back
              <input
                type="text"
                id="back"
                name="back"
                rows="2"
                placeholder={card.back}
              />
            </label>
            <button type="cancel" onClick={handleCancel}>
              Cancel
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

export default EditCard;

/*
There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck of which the edited card is a member, and finally the text Edit Card :cardId (e.g., Home/Deck React Router/Edit Card 4).

*/
