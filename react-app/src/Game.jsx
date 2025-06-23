import React, { useState, useEffect, useCallback } from 'react';import './Game.css';

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
import img9 from './assets/9.png'
import img10 from './assets/10.png'
import img11 from './assets/11.png'
import img12 from './assets/12.png'
import img13 from './assets/13.png'
import img14 from './assets/14.png'
import img15 from './assets/15.png'
import img16 from './assets/16.png'
import img17 from './assets/17.png'
import img18 from './assets/18.png'


const ALL_IMAGES = [ img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18 ];


const makeDeck = (nPairs) => {
  const values = Array.from({ length: nPairs }, (_, i) => i + 1);
  const deck = shuffle([...values, ...values]).map((value, idx) => ({
    id: idx,
    value,
    isFlipped: false,
    isMatched: false,
  }));
  return deck;
};

export default function Game() {
  const [level, setLevel] = useState('easy');
  const [cards, setCards] = useState(() => makeDeck(8));
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const resetGame = useCallback(() => {
    const pairs = level === 'easy' ? 8 : 18;
    setCards(makeDeck(pairs));
    setFirst(null);
    setSecond(null);
    setBusy(false);
    setShowHelp(false);
  }, [level]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

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
        // mismatch ----> flip back after 1s
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

  const cols = Math.sqrt(cards.length);

  //const restart = () => {
    //setCards(makeDeck());
    //setFirst(null);
    //setSecond(null);
    //setShowHelp(false);
  //};

  return (
    <div className="game-container">
      <header className="game-header">
        <h2>Find the pairs</h2>
        {/* Level selector */}
        <select
          className="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>
        {/* Help button */}
        <button className="help-button" onClick={() => setShowHelp(true)}>
          HELP
        </button>
      </header>

    <div
    className={`cards-grid ${level}`}          // add the current level as a class
    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleClick(card)}
          >
            <div className="face back"> 
                <img
                    src={ALL_IMAGES[card.value - 1]}
                    alt={`card ${card.value}`}
                    className="card-img"
                />
            </div>
            <div className="face front" />
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={resetGame}>
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
