// Modal.jsx

import React from "react";
import "./Modal.css";

const Modal = ({ onClose, isMatch, gameLost, matchesFound }) => {
  let modalMessage;

  if (!gameLost && matchesFound < 4) {
    modalMessage = isMatch
      ? "Nice! It's a match"
      : "Sorry! This is not a match";
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <div className="modal-header"></div>
        <div className="modal-body">
          <h4>{modalMessage}</h4>
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};

export default Modal;
