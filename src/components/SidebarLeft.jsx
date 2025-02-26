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

  const handleReset = () => {
    if (window.confirm("Sei sicuro di voler resettare il personaggio e i progressi?")) {
      localStorage.removeItem("personaggio");
      localStorage.removeItem("giorno");
      localStorage.removeItem("fase");
      localStorage.removeItem("data");
      localStorage.removeItem("uniqueEventsCompleted");
      window.location.href = "/";
    }
  };

  const handlePuliziaDati = () => {
    const personaggioAggiornato = { ...personaggio };

    if (personaggioAggiornato.statistiche?.affinita_pet !== undefined) {
      personaggioAggiornato.statistiche.affinità_gatto = personaggioAggiornato.statistiche.affinita_pet;
      delete personaggioAggiornato.statistiche.affinita_pet;
    }

    localStorage.setItem("personaggio", JSON.stringify(personaggioAggiornato));
    alert("✅ Dati aggiornati e puliti correttamente!");
    window.location.reload();
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

      {/* Se il personaggio ha adottato un gatto, mostra l'affinità */}
      {personaggio?.gattoAdottato && (
        <div className="gatto-info mt-3 p-2 border rounded bg-light">
          <p><strong>🐱 Gatto:</strong> {personaggio?.gattoNome}</p>
          <p><strong>Affinità con {personaggio?.gattoNome}:</strong> {personaggio?.statistiche?.["affinità_gatto"] ?? 0} / 100</p>
        </div>
      )}

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
        🔄 Reset Personaggio
      </button>

      {/* Pulsante per pulire i dati */}
      <button className="btn btn-warning mt-2 w-100" onClick={handlePuliziaDati}>
        🧹 Pulizia Dati
      </button>
    </aside>
  );
}

export default SidebarLeft;
