import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Home.css";

function Home({ decks }) {
  const navigate = useNavigate();

  function handleView(deckId) {
    navigate(`/decks/${deckId}`);
  }

  function handleStudy(deckId) {
    navigate(`/decks/${deckId}/study`);
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
