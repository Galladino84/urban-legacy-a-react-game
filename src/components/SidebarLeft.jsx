import React, { useState } from "react";

function SidebarLeft() {
  const personaggio = JSON.parse(localStorage.getItem("personaggio"));
  const [showStats, setShowStats] = useState(false);

  // Percorso e immagini dinamiche
  const percorso = personaggio?.percorso?.toLowerCase() || "placeholder";
  const logoPath = `src/assets/logos/${percorso}.png`;
  const mirrorPath = `src/assets/mirrors/mirror_${percorso}.png`;
  const avatarPath = `src/assets/avatars/avatar_${percorso}_${personaggio?.sesso.toLowerCase()}_sidebar.png`;

  const placeholderLogo = `src/assets/logos/placeholder.png`;
  const placeholderMirror = `src/assets/mirrors/mirror_placeholder.png`;

  // 🛑 Funzione aggiornata per resettare tutto
  const handleReset = () => {
    localStorage.removeItem("personaggio");
    localStorage.removeItem("giorno"); // Rimuove il salvataggio del giorno
    localStorage.removeItem("fase");   // Rimuove il salvataggio della fase
    localStorage.removeItem("data");   // Rimuove la data corrente
    window.location.href = "/"; // Torna alla schermata di creazione personaggio
  };

  // Genera le stelle per lo status
  const renderStars = (valore = 0) => {
    const stellePiene = "⭐".repeat(valore);
    const stelleVuote = "❌".repeat(5 - valore);
    return stellePiene + stelleVuote;
  };

  return (
    <aside className="sidebar left p-3">
      {/* Logo */}
      <div className="text-center mb-3">
        <img
          src={logoPath}
          alt={`Logo ${percorso}`}
          className="img-fluid"
          onError={(e) => (e.target.src = placeholderLogo)}
          style={{ maxWidth: "255px", height: "auto" }}
        />
      </div>

      {/* Avatar con specchio */}
      <div className="avatar-container mb-4">
        <img
          src={mirrorPath}
          alt={`Specchio ${percorso}`}
          className="mirror"
          onError={(e) => (e.target.src = placeholderMirror)}
        />
        <img
          src={avatarPath}
          alt="Avatar del personaggio"
          className="avatar"
        />
      </div>

      {/* Profilo */}
      <p>
        {personaggio?.nome} {personaggio?.cognome}<br />
        {personaggio?.percorso}<br />
        <strong>Fondi (€):</strong> {personaggio?.statistiche?.soldi} 💰<br />
        <strong>Status:</strong> {renderStars(personaggio?.statistiche?.status)}
      </p>

      {/* Statistiche */}
      <button className="btn btn-secondary w-100" onClick={() => setShowStats(!showStats)}>
        {showStats ? "Nascondi Statistiche" : "Mostra Statistiche"}
      </button>

      {showStats && (
        <ul className="list-group mt-3">
          <li className="list-group-item"><strong>Intelligenza:</strong> {personaggio?.statistiche?.intelligenza} 🧠</li>
          <li className="list-group-item"><strong>Carisma:</strong> {personaggio?.statistiche?.carisma} 😎</li>
          <li className="list-group-item"><strong>Resistenza:</strong> {personaggio?.statistiche?.stamina} 💪</li>
        </ul>
      )}

      {/* Pulsante di reset */}
      <button className="btn btn-danger mt-3 w-100" onClick={handleReset}>
        Reset Personaggio
      </button>
    </aside>
  );
}

export default SidebarLeft;
