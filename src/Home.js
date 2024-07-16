import React, { useState, useEffect } from "react";
import { deleteDeck, listDecks } from "./utils/api/index.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load the decks when the page is rendered
  useEffect(() => {
    async function loadDecks() {
      try {
        setLoading(true);
        const loadedDecks = await listDecks();
        setDecks(loadedDecks);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving decks:", error);
        setError(error);
        setLoading(false);
      }
    }
    loadDecks();
  }, []);

  const handleDeleteDeck = async (deckId) => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck(deckId);
        // update the decks state to remove the deleted deck
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
        // redirect to home page
        navigate("/");
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  // a view button brings the uer to the deck screen
  const handleView = (deckId) => {
    navigate(`/decks/${deckId}`);
  };

  // a study button brings the user to the study screen
  const handleStudy = (deckId) => {
    navigate(`/decks/${deckId}/study`);
  };

  // a create deck button brings the user to the create deck screen
  const createDeck = () => {
    navigate(`/decks/new`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error retrieving decks: {error.message}</p>;
  }

  const deckLinks = decks.map((deck) => (
    <div className="deck-preview" key={deck.id}>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h3 onClick={() => handleView(deck.id)}>{deck.name}</h3>
            <p>{(deck.cards || []).length} cards</p>
          </div>
          <p>{deck.description}</p>
          <div className="d-flex justify-content-between">
            <div>
              <button
                className="btn btn-secondary mr-2"
                onClick={() => handleView(deck.id)}
              >
                View
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleStudy(deck.id)}
              >
                Study
              </button>
            </div>
            <div>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section>
      <div>
        <button className="btn btn-secondary mb-2" onClick={createDeck}>
          +Create Deck
        </button>
      </div>
      <div className="mb-4">{deckLinks}</div>
    </section>
  );
}

export default Home;
