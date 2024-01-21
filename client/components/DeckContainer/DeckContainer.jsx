import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadDecks, addDeck, deleteDeck } from '../../redux/decksSlice';
import Deck from '../Deck/Deck.jsx';

// create component body
const DeckContainer = () => {
  const dispatch = useDispatch();

  // We need to set up 3 event handler functions for the Deck div, addDeck button and deleteDeck button
  // These functions will each contain fetch requests
  // Deck div: GET request to backend endpoint
  // Add deck: POST request to backend endpoint
  // Delete deck button: DELETE request to backend endpoint

  const getDecks = async () => {
    const response = await fetch('http://localhost:3000/');

    if (response.status === 200) {
      const body = await response.json();
      // (I think we will receive back an array of deck object(s))

      dispatch(loadDecks(body));
    }
  };

  useEffect(() => {
    getDecks();
  }, []);

  // retreive decks from store
  const decks = useSelector((state) => state.decks.decks);

  // create functionality to map through backendResponse and have new mapped
  const renderedDecks = decks.map(
    // not sure if _id is the key for the id value (in the deck object)
    (deck, index) => (
      <Deck key={deck._id} deck={deck} index={index} getDecks={getDecks} />
    )
    // (deck, index) => (<div id={`deck${index}`} onClick={}>
    //     {deck.deckName}
    //     <button onClick={}>Delete</button>
    // </div>)
  );

  // create function to handle new deck form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDeck = JSON.stringify(e.target.value);

    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newDeck,
    });

    if (response.status === 200) getDecks();

    // invoke our reducer (maybe loadDecks instead of addDeck?)
    // dispatch(loadDecks(body));
  };

  return (
    <div>
      {/* have an input field and an add deck button */}
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Enter deck name'></input>
        <button type='submit'>Add deck</button>
      </form>

      {/* have a container that displays decks*/}
      <section>{renderedDecks}</section>
    </div>
  );
};

export default DeckContainer;