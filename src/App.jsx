// App.jsx

import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import "./App.css";
import Card from "./Card";
import Modal from "./Modal";

const cardImages = [
  { src: "/images/comet.svg" },
  { src: "/images/moon.svg" },
  { src: "/images/star.svg" },
  { src: "/images/sun.svg" },
];

const App = () => {
  const [startScreen, setStartScreen] = useState(true);
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalIsMatch, setModalIsMatch] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [unsuccessfulGame, setUnsuccessfulGame] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  // Use sounds
  const [backgroundSound, { stop: stopBackgroundSound }] = useSound(
    "/sounds/background.mp3",
    { volume: 0.5, loop: true }
  );
  const [correctChoiceSound] = useSound("/sounds/correct.mp3");
  const [incorrectChoiceSound] = useSound("/sounds/incorrect.mp3");
  const [tickingSound] = useSound("/sounds/ticking.mp3");

  // Compare 2 selected cards:
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo, correctChoiceSound, incorrectChoiceSound]);

  // Start the timer on component mount
  useEffect(() => {
    if (!startScreen) {
      backgroundSound();

      setIntervalID(
        setInterval(() => {
          updateTimer();
        }, 1000)
      );
    }
  }, [startScreen, backgroundSound, stopBackgroundSound]);

  // stop Timer if game is won
  useEffect(() => {
    if (matchesFound == 4) {
      clearInterval(intervalID);
      stopBackgroundSound();
    }
  }, [matchesFound]);

  // Play ticking sound when there are 10 seconds left
  useEffect(() => {
    if (timer <= 10) {
      tickingSound();
    }
  }, [timer, tickingSound]);

  // Function to update the timer
  const updateTimer = () => {
    setTimer((prevTimer) => {
      const newTimer = prevTimer - 1;
      if (newTimer <= 0) {
        setShowModal(true);
        setModalIsMatch(false);
        setUnsuccessfulGame(true);
        stopBackgroundSound();
      }
      return newTimer >= 0 ? newTimer : 0;
    });
  };

  // Handle a choice:
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Reset choices:
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);

    // Check if it's a match
    if (choiceOne && choiceTwo && choiceOne.src === choiceTwo.src) {
      setMatchesFound((prevMatches) => prevMatches + 1);
      setModalIsMatch(true);
      setShowModal(true);
      correctChoiceSound();
    } else {
      setModalIsMatch(false);
      if (choiceOne && choiceTwo && choiceOne.src !== choiceTwo.src) {
        setShowModal(true);
        incorrectChoiceSound();
      }
    }
  };

  // Toggle mute without restarting the game
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      if (prevMuted) {
        backgroundSound();
      } else {
        stopBackgroundSound();
      }
      return !prevMuted;
    });
  };

  // Shuffle cards:
  const shuffleCards = () => {
    setTimer(30);
    setUnsuccessfulGame(false);
    setMatchesFound(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setUnsuccessfulGame(false);
    if (unsuccessfulGame || matchesFound == 4) {
      setStartScreen(true);
    }
  };

  const startGame = () => {
    setStartScreen(false);
    shuffleCards();
  };

  return (
    <div className={`App ${startScreen ? "start-screen" : "game-screen"}`}>
      {startScreen && (
        <div className="start-container">
          {/* {unsuccessfulGame && <p>Oops! You didn't find them all</p>}
          {matchesFound == 4 && <p>You did it!</p>} */}
          <img className="logo" src="/images/logo.png" alt="Logo" />
          <br></br>
          <div className="test-div">
            <button className="start-button" onClick={startGame}>
              Start
            </button>
          </div>
        </div>
      )}

      {!startScreen && (
        <div className="App">
          <div
            className="mute-button"
            onClick={toggleMute}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            {isMuted ? "🔊" : "🔇"}
          </div>
          <div className="timer">Time Left: {timer} seconds</div>
          <h1>Memory Game</h1>
          <button onClick={shuffleCards}>New Game</button>
          <br />
          <div className="card-grid">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  card === choiceOne || card === choiceTwo || card.matched
                }
                disabled={disabled}
              />
            ))}
          </div>
          {showModal && (
            <Modal
              onClose={closeModal}
              isMatch={modalIsMatch}
              unsuccessfulGame={unsuccessfulGame}
              matchesFound={matchesFound}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
