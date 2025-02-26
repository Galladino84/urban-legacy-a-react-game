import React from "react";


const PrimaryChoiceLightbox = ({ message, onClose }) => {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-content lightbox-container">
        <p>{message}</p>
        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default PrimaryChoiceLightbox;
