import React, { useState } from "react";

function SidebarLeft() {
  const personaggio = JSON.parse(localStorage.getItem("personaggio"));
  const [showStats, setShowStats] = useState(false); // Stato per mostrare/nascondere il dropdown

  const handleReset = () => {
    localStorage.removeItem("personaggio");
    window.location.href = "/";
  };

  // Genera le stelle per lo status
  const renderStars = (valore) => {
    const stellePiene = "⭐".repeat(valore);
    const stelleVuote = "❌".repeat(5 - valore);
    return stellePiene + stelleVuote;
  };

  return (
    <aside className="sidebar left">
      <h3>Profilo</h3>
      <p><strong>Nome:</strong> {personaggio?.nome} {personaggio?.cognome}</p>
      <p><strong>Sesso:</strong> {personaggio?.sesso}</p>
      <p><strong>Percorso:</strong> {personaggio?.percorso}</p>
      <p><strong>Orientamento:</strong> {personaggio?.orientamento}</p>
      <p><strong>Soldi (€):</strong> {personaggio?.statistiche?.soldi} 💰</p>

      <div className="mt-4">
        <button
          className="btn btn-secondary w-100"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? "Nascondi Statistiche" : "Mostra Statistiche"}
        </button>

        {showStats && (
          <ul className="list-group mt-3">
            <li className="list-group-item"><strong>Status:</strong> {renderStars(personaggio?.statistiche?.status)}</li>
            <li className="list-group-item"><strong>Intelligenza (IQ):</strong> {personaggio?.statistiche?.intelligenza} 🧠</li>
            <li className="list-group-item"><strong>Carisma (CHA):</strong> {personaggio?.statistiche?.carisma} 😎</li>
            <li className="list-group-item"><strong>Resistenza (Stamina):</strong> {personaggio?.statistiche?.stamina} 💪</li>
            
          </ul>
        )}
      </div>

      <button className="btn btn-danger mt-3 w-100" onClick={handleReset}>
        Reset Personaggio
      </button>
    </aside>
  );
}

export default SidebarLeft;
