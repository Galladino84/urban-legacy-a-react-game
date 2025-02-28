// src/components/SidebarRight.jsx
import React, { useEffect, useState } from "react";
import materieData from "../data/materie.json";
import calendarioVerifiche from "../data/calendario_verifiche.json"; // Importa il calendario delle verifiche
import { format } from "date-fns";
import { it } from "date-fns/locale";

const SidebarRight = () => {
  const [personaggio, setPersonaggio] = useState(null);
  const [nextVerifica, setNextVerifica] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("personaggio");
    const currentDate = new Date(localStorage.getItem("data") || new Date());

    if (stored) {
      const parsedPersonaggio = JSON.parse(stored);
      setPersonaggio(parsedPersonaggio);

      // Trova la prossima verifica rispetto alla data in-game
      const prossimaVerifica = calendarioVerifiche.find(verifica => {
        const dataVerifica = new Date(verifica.data);
        const giorniDifferenza = Math.ceil((dataVerifica - currentDate) / (1000 * 60 * 60 * 24));
        return giorniDifferenza >= 0;
      });

      if (prossimaVerifica) {
        setNextVerifica(prossimaVerifica);

        // Mostra la notifica se la verifica è entro 3 giorni
        const giorniDifferenza = Math.ceil((new Date(prossimaVerifica.data) - currentDate) / (1000 * 60 * 60 * 24));
        setShowNotification(giorniDifferenza <= 3);
      }
    }
  }, []);

  const renderValutazioni = () => {
    const allMaterie = new Set();
    Object.values(materieData).forEach(materie => {
      materie.forEach(materia => allMaterie.add(materia));
    });
    const materieArray = Array.from(allMaterie);

    return (
      <ul className="list-group mt-3">
        {materieArray.map((materia, index) => {
          const key = materia.toLowerCase();
          let media = 6;
          if (personaggio?.verifiche?.[key]?.length) {
            const voti = personaggio.verifiche[key];
            const somma = voti.reduce((acc, v) => acc + v, 0);
            media = (somma / voti.length).toFixed(1);
          }
          return (
            <li key={index} className="list-group-item">
              <strong>{materia}</strong>: {media}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="sidebar right">
      <div className="phone-notification" onClick={() => setShowPopup(true)}>
        📱
        {showNotification && <span className="notification-badge">!</span>}
      </div>

      {showPopup && (
        <div className="popup">
          <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
          <h4>📅 Prossima Verifica</h4>
          {nextVerifica ? (
            <>
              <p><strong>Materia:</strong> {nextVerifica.materia}</p>
              <p><strong>Data:</strong> {format(new Date(nextVerifica.data), "EEEE dd MMMM yyyy", { locale: it })}</p>
            </>
          ) : (
            <p>Nessuna verifica in programma nei prossimi giorni.</p>
          )}
        </div>
      )}

      <h4>Valutazioni Scolastiche</h4>
      {renderValutazioni()}
      <p><strong>Condotta:</strong> {personaggio?.statistiche?.condotta || 10}</p>
    </aside>
  );
};

export default SidebarRight;
