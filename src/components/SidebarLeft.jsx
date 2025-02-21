import React, { useEffect, useState } from "react";

function SidebarLeft() {
  const [personaggio, setPersonaggio] = useState(null);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");
    if (datiSalvati) {
      setPersonaggio(JSON.parse(datiSalvati));
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem("personaggio");
    window.location.reload();
  };

  return (
    <aside className="sidebar sidebar-left">
      <h4>Profilo</h4>
      {personaggio ? (
        <div>
          <p><strong>Nome:</strong> {personaggio.nome} {personaggio.cognome}</p>
          <p><strong>Sesso:</strong> {personaggio.sesso}</p>
          <p><strong>Percorso:</strong> {personaggio.percorso}</p>
          <p><strong>Orientamento:</strong> {personaggio.orientamento}</p>
          <p><strong>Famiglia:</strong> {personaggio.famiglia.mamma ? "Mamma " : ""}{personaggio.famiglia.sorella ? "Sorella" : ""}</p>
          <button className="btn btn-danger btn-sm mt-2" onClick={handleReset}>
            Reset Personaggio
          </button>
        </div>
      ) : (
        <p>Nessun personaggio creato.</p>
      )}
    </aside>
  );
}

export default SidebarLeft;
