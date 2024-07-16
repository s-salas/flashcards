import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index.js";
import {
  useParams,
  useNavigate,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

function Deck({ onDeleteDeck }) {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function getDeck() {
      try {
        // must use readDeck() function from src/utils/api/index.js to load the existing deck
        const deckResult = await readDeck(deckId);
        setDeck(deckResult);
        setCards(deckResult.cards || []);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
    }
    getDeck();
  }, [deckId, location.key]); // Adding location.key to trigger useEffect on route changes

  // a delete button shows a warning message and allows the user to delete the deck:
  const handleDeleteDeck = async () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck(deckId);
        onDeleteDeck(deckId); // Remove deleted deck from state in parent
        navigate("/"); // Redirect to home page
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  // a delete button displays a warning message and allows the user to delete the card
  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      // use window.confirm() to create modal dialogue
      try {
        await deleteCard(cardId);
        setCards((currentCards) =>
          currentCards.filter((card) => card.id !== cardId)
        );
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  const handleUpdateCard = (updatedCard) => {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };

  const handleUpdateDeck = (updatedDeck) => {
    setDeck(updatedDeck);
  };

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  const isNestedRoute =
    location.pathname.includes("/study") ||
    location.pathname.includes("/edit") ||
    location.pathname.includes("/cards");

  return (
    <div>
      {!isNestedRoute && (
        <>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {deck.name}
              </li>
            </ol>
          </nav>
          <h3>{deck.name}</h3>
          <p>{deck.description}</p>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={() => navigate(`/decks/${deckId}/edit`)}
            >
              Edit Deck
            </button>
            <button className="btn btn-danger mr-2" onClick={handleDeleteDeck}>
              Delete Deck
            </button>
            <button
              className="btn btn-primary mr-2"
              onClick={() => navigate(`/decks/${deckId}/study`)}
            >
              Study
            </button>
            <button
              className="btn btn-primary mr-2"
              onClick={() => navigate(`/decks/${deckId}/cards/new`)}
            >
              Add Cards
            </button>
          </div>

          <h2>Cards</h2>
          <div className="mb-4">
            {cards.map((card) => (
              <div key={card.id}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <p>{card.front}</p>
                      <p>{card.back}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={() =>
                        navigate(`/decks/${deckId}/cards/${card.id}/edit`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Outlet context={{ deck, handleUpdateCard, handleUpdateDeck }} />
    </div>
  );
}

export default Deck;
