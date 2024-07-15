import React, { useState, useEffect } from "react";
import { readDeck, readCard, updateCard } from "../../utils/api/index.js";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import CardForm from "./CardForm.js";

function EditCard() {
  const { deckId, cardId } = useParams();
  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);
  const navigate = useNavigate();
  const { handleUpdateCard } = useOutletContext();

  useEffect(() => {
    async function getDeck() {
      try {
        const deckResult = await readDeck(deckId);
        setDeck(deckResult);
      } catch (error) {
        console.error("Error loading deck: ", error);
      }
    }

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
  }, [deckId, cardId]);

  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const updatedCard = await updateCard(card);
      handleUpdateCard(updatedCard); // Call the update function passed from the parent component
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error("Error updating card: ", error);
    }
  };

  if (!deck || !card) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Edit Card</li>
        </ol>
      </nav>
      <h2>Edit Card</h2>
      <CardForm
        front={card.front}
        back={card.back}
        setFront={(front) => setCard({ ...card, front })}
        setBack={(back) => setCard({ ...card, back })}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </>
  );
}

export default EditCard;
