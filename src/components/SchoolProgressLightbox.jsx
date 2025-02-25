// src/components/SchoolProgressLightbox.jsx
import React from "react";

const SchoolProgressLightbox = ({ progressSubjects, onClose }) => {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-content">
        <h2>Progressi Oggi</h2>
        <p>Oggi hai avuto progressi nelle seguenti materie:</p>
        <ul>
          {progressSubjects.map((subject, index) => (
            <li key={index}>{subject}</li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SchoolProgressLightbox;
