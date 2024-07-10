import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { listDecks } from "./utils/api/index.js";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [decksLoaded, setDecksLoaded] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    async function retrieveDecks() {
      if (!decksLoaded) {
        try {
          const response = await listDecks();
          setDecks(response);
          setDecksLoaded(true);
          setLoading(false); // Set loading state to false after fetching
        } catch (error) {
          console.error("Error retrieving decks:", error);
          setError(error); // Set error state
          setLoading(false); // Set loading state to false on error
        }
      }
    }
    retrieveDecks();
  }, [decksLoaded]);

  const handleView = (deckId) => {
    navigate(`/decks/${deckId}`);
  };

  const handleStudy = (deckId) => {
    navigate(`/decks/${deckId}/study`);
  };

  if (loading) {
    return <p>Loading...</p>; // Render a loading indicator while fetching decks
  }

  if (error) {
    return <p>Error retrieving decks: {error.message}</p>; // Render error message
  }

  const deckLinks = decks.map((deck) => (
    <div className="deck-preview" key={deck.id}>
      <NavLink to={`/decks/${deck.id}`}>{deck.name}</NavLink>
      <p>{deck.description}</p>
      <button onClick={() => handleView(deck.id)}>View</button>
      <button onClick={() => handleStudy(deck.id)}>Study</button>
    </div>
  ));

  return (
    <section>
      <div>
        <NavLink to="/decks/new">Create Deck</NavLink>
      </div>
      <div>{deckLinks}</div>
    </section>
  );
}

export default Home;
