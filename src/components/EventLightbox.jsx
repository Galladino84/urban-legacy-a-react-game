import React from "react";

function EventLightbox({ titolo, testo, opzioni, onOptionSelected, singleOptionText }) {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-content text-center p-4">
        <h3>{titolo}</h3>
        <p>{testo}</p>
        {opzioni ? (
          opzioni.map((opzione, index) => (
            <button
              key={index}
              className="btn btn-primary m-2"
              onClick={() => onOptionSelected(opzione)}
            >
              {opzione.testo}
            </button>
          ))
        ) : (
          <button className="btn btn-success mt-3" onClick={onOptionSelected}>
            {singleOptionText || "OK"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EventLightbox;
