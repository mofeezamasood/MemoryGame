// Modal.jsx

import React from "react";
import "./Modal.css";

const Modal = ({ onClose, isMatch, unsuccessfulGame, matchesFound }) => {
  let modalMessage;

  if (unsuccessfulGame) {
    modalMessage = "Oops! You didn't find them all";
  } else {
    if (matchesFound == 4) {
      modalMessage = "You did it!";
    } else {
      modalMessage = isMatch
        ? "Nice! It's a match"
        : "Sorry! This is not a match";
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <div className="modal-header"></div>
        <div className="modal-body">
          <h4>{modalMessage}</h4>
        </div>
        <div className="modal-footer">
          {unsuccessfulGame && <button onClick={onClose}>Try Again</button>}
          {!unsuccessfulGame && matchesFound === 4 && (
            <button onClick={onClose}>Play Again</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
