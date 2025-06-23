import React, { useState, useEffect } from 'react';
import './Game.css';

// helper to shuffle an array
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
import img1 from './assets/1.png'
import img2 from './assets/2.png'
import img3 from './assets/3.png'
import img4 from './assets/4.png'
import img5 from './assets/5.png'
import img6 from './assets/6.png'
import img7 from './assets/7.png'
import img8 from './assets/8.png'

const images = [ img1, img2, img3, img4, img5, img6, img7, img8 ]
// create a new deck of 8 pairs (16 cards total)
const makeDeck = () => {
  const values = Array.from({ length: 8 }, (_, i) => i + 1);
  const deck = shuffle([...values, ...values]).map((value, idx) => ({
    id: idx,
    value,
    isFlipped: false,
    isMatched: false,
  }));
  return deck;
};

export default function Game() {
  const [cards, setCards] = useState(makeDeck());
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // handle a card click
  const handleClick = (card) => {
    if (busy || card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (!first) {
      setFirst(card);
    } else {
      setSecond(card);
      setBusy(true);
    }
  };

  // watch for a pair selection
  useEffect(() => {
    if (first && second) {
      if (first.value === second.value) {
        // it's a match!
        setCards((prev) =>
          prev.map((c) =>
            c.value === first.value ? { ...c, isMatched: true } : c
          )
        );
        resetTurn();
      } else {
        // mismatch → flip back after 1s
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [second]);

  const resetTurn = () => {
    setFirst(null);
    setSecond(null);
    setBusy(false);
  };

  const restart = () => {
    setCards(makeDeck());
    setFirst(null);
    setSecond(null);
    setShowHelp(false);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h2>Find the pairs</h2>
        <button className="help-button" onClick={() => setShowHelp(true)}>
          HELP
        </button>
      </header>

      <div className="cards-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleClick(card)}
          >
            <div className="face back"> 
                <img
                    src={images[card.value - 1]}
                    alt="card"
                    className="card-img"/>
            </div>
            <div className="face front" />
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={restart}>
        Restart
      </button>

      {showHelp && (
        <div className="help-modal">
          <div className="help-box">
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              ×
            </button>
            <h3>How to play</h3>
            <p>1. Tap any card to flip it.</p>
            <p>2. Tap a second card to try and find its pair.</p>
            <p>3. If they match, they stay face-up. Otherwise they flip back.</p>
            <p>4. Find all 8 pairs to win!</p>
          </div>
        </div>
      )}
    </div>
  );
}
