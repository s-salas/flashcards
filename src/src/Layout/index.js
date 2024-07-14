import React, { useState, useEffect } from "react";
import Header from "./Header";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../Home.js";
import CreateDeck from "../decks/CreateDeck.js";
import Deck from "../decks/Deck.js";
import Study from "../decks/Study.js";
import EditDeck from "../decks/EditDeck.js";
import AddCard from "../decks/cards/AddCard.js";
import EditCard from "../decks/cards/EditCard.js";
import NotFound from "../Layout/NotFound.js";
import { listDecks, deleteDeck } from "../utils/api/index.js";

function Layout() {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchData() {
      try {
        const loadedDecks = await listDecks(signal);
        setDecks(loadedDecks);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch decks", error);
        }
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleDeleteDeck = async (deckId) => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck(deckId);
        setDecks((currentDecks) => currentDecks.filter((deck) => deck.id !== deckId));
        navigate("/");
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const newDeck = (deck) => {
    setDecks((currentDecks) => [...currentDecks, deck]);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home decks={decks} />} />
          <Route path="/decks/new" element={<CreateDeck newDeck={newDeck} />} />
          <Route path="/decks/:deckId" element={<Deck decks={decks} setDecks={setDecks} onDeleteDeck={handleDeleteDeck} />}>
            <Route path="study" element={<Study />} />
            <Route path="edit" element={<EditDeck />} />
            <Route path="cards/new" element={<AddCard />} />
            <Route path="cards/:cardId/edit" element={<EditCard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
