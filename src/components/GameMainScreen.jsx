import React, { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

function GameMainScreen() {
  const [personaggio, setPersonaggio] = useState(null);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");
    if (datiSalvati) {
      setPersonaggio(JSON.parse(datiSalvati));
    } else {
      window.location.href = "/";
    }
  }, []);

  if (!personaggio) return <p>Caricamento...</p>;

  return (
    <div className={`game-container theme_${personaggio.percorso.toLowerCase()}`}>
      <SidebarLeft />
      <main className="main-content">
        <h2>Benvenuto, {personaggio.nome}!</h2>
        <p><strong>Percorso:</strong> {personaggio.percorso}</p>
        <p><strong>Sesso:</strong> {personaggio.sesso}</p>
        <p><strong>Orientamento:</strong> {personaggio.orientamento}</p>
        <p><strong>Famiglia:</strong> {personaggio.famiglia.mamma ? "Mamma " : ""}{personaggio.famiglia.sorella ? "Sorella" : ""}</p>
        <button className="btn btn-success mt-4">Inizia la tua giornata</button>
      </main>
      <SidebarRight />
    </div>
  );
}

export default GameMainScreen;
