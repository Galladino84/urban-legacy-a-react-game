// src/components/SchoolExamLightbox.jsx
import React from "react";
import SchoolExam from "./SchoolExam";
import "./SchoolExamLightbox.css";

const SchoolExamLightbox = ({ onClose }) => {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-content">
        <SchoolExam onExamFinish={(score) => {
          console.log("Esame completato, punteggio:", score);
          onClose(score);
        }} />
      </div>
    </div>
  );
};

export default SchoolExamLightbox;
