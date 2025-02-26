import React, { useState } from "react";

function SidebarLeft() {
  const personaggio = JSON.parse(localStorage.getItem("personaggio"));
  const [showStats, setShowStats] = useState(false);

  // Funzione per restituire statistiche sicure con valore minimo 0
  const safeStat = (statName, defaultValue = 0) => {
    const value = personaggio?.statistiche?.[statName];
    return typeof value === "number" && value >= 0 ? value : defaultValue;
  };

  // Percorso e immagini dinamiche
  const percorso = personaggio?.percorso?.toLowerCase() || "placeholder";
  const sesso = personaggio?.sesso?.toLowerCase() || "placeholder";
  const logoPath = `src/assets/logos/${percorso}.png`;
  const mirrorPath = `src/assets/mirrors/mirror_${percorso}.png`;
  const avatarPath = `src/assets/avatars/avatar_${percorso}_${sesso}_sidebar.png`;
  const placeholderLogo = `src/assets/logos/placeholder.png`;
  const placeholderMirror = `src/assets/mirrors/mirror_placeholder.png`;

  const handleReset = () => {
    if (window.confirm("⚠️ Sei sicuro di voler resettare il personaggio e i progressi?")) {
      // ✅ Corretto l'uso di forEach con funzione freccia
      ["personaggio", "giorno", "fase", "data", "uniqueEventsCompleted"].forEach((key) => {
        localStorage.removeItem(key); // Invocazione valida e senza errori
      });
  
      alert("✅ Personaggio e progressi resettati!");
      window.location.href = "/"; // Reindirizza alla schermata iniziale
    }
  };
  

  const handlePuliziaDati = () => {
    const personaggioAggiornato = { ...personaggio };

    if (personaggioAggiornato.statistiche?.affinita_pet !== undefined) {
      personaggioAggiornato.statistiche["affinità_gatto"] = safeStat("affinita_pet");
      delete personaggioAggiornato.statistiche.affinita_pet;
    }

    localStorage.setItem("personaggio", JSON.stringify(personaggioAggiornato));
    alert("✅ Dati aggiornati e puliti correttamente!");
    window.location.reload();
  };

  // Genera le stelle per lo status con controllo di sicurezza
  const renderStars = (valore = 0) => {
    const safeValue = Math.max(0, Math.min(valore, 5)); // Blocco tra 0 e 5
    const stellePiene = "⭐".repeat(safeValue);
    const stelleVuote = "❌".repeat(5 - safeValue); // Evita valori negativi
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
          onError={(e) => (e.target.src = "src/assets/avatars/avatar_placeholder_sidebar.png")}
        />
      </div>

      {/* Profilo */}
      <p>
        {personaggio?.nome ?? "Nome"} {personaggio?.cognome ?? "Cognome"}<br />
        {personaggio?.percorso ?? "Percorso"}<br />
        <strong>Fondi (€):</strong> {safeStat("soldi")} 💰<br />
        <strong>Status:</strong> {renderStars(safeStat("status"))}
      </p>

      {/* Se il personaggio ha adottato un gatto */}
      {personaggio?.gattoAdottato && (
        <div className="gatto-info mt-3 p-2 border rounded bg-light">
          <p><strong>🐱 Gatto:</strong> {personaggio?.gattoNome ?? "Sconosciuto"}</p>
          <p>
            <strong>Affinità con {personaggio?.gattoNome ?? "il gatto"}:</strong>{" "}
            {safeStat("affinità_gatto")} / 100
          </p>
        </div>
      )}

      {/* Pulsante per visualizzare le statistiche */}
      <button className="btn btn-secondary w-100" onClick={() => setShowStats(!showStats)}>
        {showStats ? "Nascondi Statistiche" : "Mostra Statistiche"}
      </button>

      {showStats && (
        <ul className="list-group mt-3">
          <li className="list-group-item">
            <strong>Intelligenza:</strong> {safeStat("intelligenza")} 🧠
          </li>
          <li className="list-group-item">
            <strong>Carisma:</strong> {safeStat("carisma")} 😎
          </li>
          <li className="list-group-item">
            <strong>Resistenza:</strong> {safeStat("stamina")} 💪
          </li>
        </ul>
      )}

      {/* Pulsante di reset dati */}
      <button className="btn btn-danger mt-3 w-100" onClick={handleReset}>
        🔄 Reset Personaggio
      </button>

      {/* Pulsante per la pulizia dei dati */}
      <button className="btn btn-warning mt-2 w-100" onClick={handlePuliziaDati}>
        🧹 Pulizia Dati
      </button>
    </aside>
  );
}

export default SidebarLeft;
