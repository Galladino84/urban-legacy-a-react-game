// src/components/SidebarRight.jsx
import React, { useEffect, useState } from "react";
import materieData from "../data/materie.json";

const SidebarRight = () => {
  const [personaggio, setPersonaggio] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("personaggio");
    if (stored) {
      setPersonaggio(JSON.parse(stored));
    }
  }, []);

  const renderValutazioni = () => {
    // Raccogliamo tutte le materie presenti in materie.json
    const allMaterie = new Set();
    Object.values(materieData).forEach(materie => {
      materie.forEach(materia => allMaterie.add(materia));
    });
    const materieArray = Array.from(allMaterie);

    return (
      <ul className="list-group mt-3">
        {materieArray.map((materia, index) => {
          const key = materia.toLowerCase();
          let media = 6; // default se nessuna verifica
          if (personaggio && personaggio.verifiche && personaggio.verifiche[key] && personaggio.verifiche[key].length > 0) {
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
      <h3>Sidebar Destra</h3>
      <p>Condotta: {personaggio?.statistiche?.condotta || 10}</p>
      <h4>Valutazioni Scolastiche</h4>
      {renderValutazioni()}
    </aside>
  );
};

export default SidebarRight;
