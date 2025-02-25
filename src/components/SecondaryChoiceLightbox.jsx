import React from "react";


const SecondaryChoiceLightbox = ({ message, onClose }) => {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-content">
        <p>{message}</p>
        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SecondaryChoiceLightbox;
