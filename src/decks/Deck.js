import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index.js";
import { useParams, useNavigate, Link, Outlet, useLocation } from "react-router-dom";

function Deck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleDeleteDeck = async () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck(deckId);
        navigate("/");
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteCard(cardId);
        setCards((currentCards) => currentCards.filter((card) => card.id !== cardId));
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  const isNestedRoute = location.pathname.includes('study') || location.pathname.includes('edit') || location.pathname.includes('cards');

  return (
    <div>
      {!isNestedRoute && (
        <>
          <h2>{deck.name}</h2>
          <p>{deck.description}</p>
          <button onClick={() => navigate(`/decks/${deckId}/edit`)}>Edit Deck</button>
          <button onClick={handleDeleteDeck}>Delete Deck</button>
          <button onClick={() => navigate(`/decks/${deckId}/study`)}>Study</button>
          <button onClick={() => navigate(`/decks/${deckId}/cards/new`)}>Add Cards</button>
          
          <h3>Cards</h3>
          {cards.map((card) => (
            <div key={card.id}>
              <p>Front: {card.front}</p>
              <p>Back: {card.back}</p>
              <button onClick={() => navigate(`/decks/${deckId}/cards/${card.id}/edit`)}>Edit</button>
              <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
            </div>
          ))}
        </>
      )}
      <Outlet />
    </div>
  );
}

export default Deck;
