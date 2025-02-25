// src/components/SchoolEvent.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import materieData from "../data/materie.json";
import SchoolProgressLightbox from "./SchoolProgressLightbox";

const SchoolEvent = () => {
  const navigate = useNavigate();
  const [personaggio, setPersonaggio] = useState(null);
  const [oggiMaterie, setOggiMaterie] = useState([]);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("personaggio");
    if (stored) {
      const p = JSON.parse(stored);
      setPersonaggio(p);
      
      // Utilizza la data in-game salvata oppure la data corrente
      const inGameDate = new Date(localStorage.getItem("data") || new Date());
      const options = { weekday: "long" };
      let giornoSettimana = inGameDate.toLocaleDateString("it-IT", options).toLowerCase();
      // Normalizza: "lunedì" -> "lunedi", ecc.
      giornoSettimana = giornoSettimana.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log("Giorno in-game:", giornoSettimana);
      
      const materieOggi = materieData[giornoSettimana] || [];
      setOggiMaterie(materieOggi);
      
      // Incrementa la conoscenza per ciascuna materia del giorno (incremento fisso di +2)
      const incremento = 2;
      p.statistiche = p.statistiche || {};
      materieOggi.forEach(materia => {
        const key = "conoscenza_" + materia.replace(/\s+/g, "_").toLowerCase();
        if (p.statistiche[key] === undefined) {
          p.statistiche[key] = 0;
        }
        p.statistiche[key] += incremento;
        console.log(`Incrementata conoscenza per ${materia}: ${p.statistiche[key]}`);
      });
      
      localStorage.setItem("personaggio", JSON.stringify(p));
      console.log("Personaggio aggiornato:", p);
      setPersonaggio(p);
      
      // Mostra il lightbox per informare i progressi
      setShowLightbox(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLightboxClose = () => {
    console.log("Lightbox chiuso, ritorno al gioco");
    setShowLightbox(false);
    navigate("/game");
  };

  return (
    <div className="container mt-4">
      {showLightbox ? (
        <SchoolProgressLightbox progressSubjects={oggiMaterie} onClose={handleLightboxClose} />
      ) : (
        <div>
          <h2>Scuola</h2>
          <p>Operazione in corso...</p>
        </div>
      )}
    </div>
  );
};

export default SchoolEvent;
