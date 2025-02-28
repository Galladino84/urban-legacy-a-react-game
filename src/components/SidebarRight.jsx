import React, { useEffect, useState } from "react";
import materieData from "../data/materie.json";
import calendarioVerifiche from "../data/calendario_verifiche.json";

const SidebarRight = () => {
  const [personaggio, setPersonaggio] = useState(null);
  const [giorno, setGiorno] = useState(() => Number(localStorage.getItem("giorno")) || 1);
  const [fase, setFase] = useState(() => Number(localStorage.getItem("fase")) || 0);

  useEffect(() => {
    const stored = localStorage.getItem("personaggio");
    if (stored) {
      setPersonaggio(JSON.parse(stored));
    }
  }, []);

  const aggiornaPersonaggio = (nuovoPersonaggio) => {
    setPersonaggio({ ...nuovoPersonaggio });
    localStorage.setItem("personaggio", JSON.stringify(nuovoPersonaggio));
  };

  const handleInputChange = (field, value) => {
    if (personaggio) {
      const aggiornato = { ...personaggio };
      aggiornato.statistiche[field] = value;
      aggiornaPersonaggio(aggiornato);
    }
  };

  const renderValutazioni = () => {
    const allMaterie = new Set();
    Object.values(materieData).forEach(materie => materie.forEach(materia => allMaterie.add(materia)));
    const materieArray = Array.from(allMaterie);

    return (
      <ul className="list-group mt-3">
        {materieArray.map((materia, index) => {
          const key = materia.toLowerCase();
          let media = 6;
          if (personaggio?.verifiche?.[key]?.length > 0) {
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

  const giornoSettimana = Object.keys(materieData)[(giorno - 1) % 5];
  const materieOggi = materieData[giornoSettimana] || [];
  const prossimaVerifica = calendarioVerifiche.find(v => v.giorno >= giorno) || { giorno: "N/D", materia: "Nessuna" };
  const giorniMancanti = prossimaVerifica.giorno - giorno;

  return (
    <aside className="sidebar right">
      <div className="telefono-container">
        <h3>📱 Notifiche</h3>
        <p><strong>Prossima verifica:</strong> {prossimaVerifica.materia} tra {giorniMancanti} giorni</p>
        <p><strong>Materie di oggi:</strong> {materieOggi.join(", ")}</p>
      </div>
      
      <h4>Valutazioni Scolastiche</h4>
      {renderValutazioni()}

      {personaggio?.nome.toLowerCase() === "norasmoke" && 
       personaggio?.percorso.toLowerCase() === "goth" && 
       personaggio?.sesso.toLowerCase() === "femmina" && (
        <div className="superuser-controls mt-3">
          <h4>🔧 Controllo Superuser</h4>

          {/* Modifica Giorno e Fase */}
          <label>Giorno:</label>
          <input
            type="number"
            value={giorno}
            onChange={(e) => {
              let newDay = Math.max(1, Number(e.target.value));
              setGiorno(newDay);
              localStorage.setItem("giorno", newDay);
            }}
          />
          <label>Fase:</label>
          <input
            type="number"
            value={fase}
            onChange={(e) => {
              let newPhase = Math.min(5, Math.max(0, Number(e.target.value)));
              setFase(newPhase);
              localStorage.setItem("fase", newPhase);
            }}
          />

          {/* Modifica Soldi e Status */}
          <label>💰 Soldi:</label>
          <input
            type="number"
            value={personaggio?.statistiche?.soldi || 0}
            onChange={(e) => handleInputChange("soldi", Number(e.target.value))}
          />

          <label>⭐ Status (0-5):</label>
          <input
            type="number"
            value={personaggio?.statistiche?.status || 0}
            min="0" max="5"
            onChange={(e) => handleInputChange("status", Number(e.target.value))}
          />

          {/* Modifica Conoscenza Materie */}
          <h5>📚 Conoscenza Materie</h5>
          {Object.keys(materieData).flatMap(g => materieData[g]).map((materia, index) => (
            <div key={index}>
              <label>{materia}:</label>
              <input
                type="number"
                value={personaggio?.statistiche?.[`conoscenza_${materia.toLowerCase()}`] || 0}
                min="0"
                onChange={(e) => handleInputChange(`conoscenza_${materia.toLowerCase()}`, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default SidebarRight;
