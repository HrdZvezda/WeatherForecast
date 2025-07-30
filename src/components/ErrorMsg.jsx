import React from "react";

const ErrorMessage = ({ error, onClose }) => {
    if (!error) return null;
  
    return (
      <div className="error-message">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={onClose} className="error-close">✕</button>
        </div>
      </div>
    );
}

export default ErrorMessage;