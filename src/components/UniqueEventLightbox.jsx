import React, { useState } from 'react';
import './UniqueEventLightbox.css';

const UniqueEventLightbox = ({ event, onOptionSelected }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="unique-event-overlay">
      <div className="unique-event-content">
        {event.image && (
          <img 
            src={event.image} 
            alt={event.id} 
            className="unique-event-image" 
          />
        )}
        <h2>{event.text}</h2>
        {event.options.map((option, index) => (
          <div key={index} className="unique-event-option">
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                if (option.prompt) {
                  if (inputValue.trim() === "") {
                    alert("Inserisci un nome.");
                    return;
                  }
                  onOptionSelected(option, inputValue);
                } else {
                  onOptionSelected(option, null);
                }
              }}
            >
              {option.text}
            </button>
            {option.prompt && (
              <div>
                <p>{option.prompt}</p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Inserisci qui..."
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniqueEventLightbox;
