import React, { useEffect, useState } from "react";
import narratives from "../data/narratives.json";

function NarrativeScene({ fase, personaggio, avanzaFase }) {
  const [narrativa, setNarrativa] = useState(null);
  const [scelte, setScelte] = useState([]);
  const [conseguenza, setConseguenza] = useState(null);
  const [sceltaFatta, setSceltaFatta] = useState(false);

  useEffect(() => {
    if (personaggio && fase) {
      const percorso = personaggio.percorso.toLowerCase();
      const sesso = personaggio.sesso.toLowerCase();

      const narrativaFase = narratives[fase]?.[sesso]?.[percorso];

      if (narrativaFase) {
        setNarrativa(narrativaFase.testo);
        setScelte(narrativaFase.scelte || []);
      } else {
        setNarrativa("Nessuna scena disponibile per questa fase.");
        setScelte([]);
      }

      setConseguenza(null); // Reset alla nuova fase
      setSceltaFatta(false);
    }
  }, [fase, personaggio]);

  const aggiornaStatistiche = (modifiche) => {
    const nuovoPersonaggio = { ...personaggio };
  
    Object.entries(modifiche).forEach(([stat, valore]) => {
      const valoreAttuale = nuovoPersonaggio.statistiche[stat] ?? 0;
      let nuovoValore = valoreAttuale + valore;
  
      if (stat === "status") {
        // Limita lo status tra 0 e 5
        nuovoValore = Math.max(0, Math.min(nuovoValore, 5));
      } else if (stat === "soldi") {
        // Soldi non può andare sotto zero
        nuovoValore = Math.max(0, nuovoValore);
      } else {
        // Altre statistiche min 0 (niente valori negativi)
        nuovoValore = Math.max(0, nuovoValore);
      }
  
      nuovoPersonaggio.statistiche[stat] = nuovoValore;
    });
  
    localStorage.setItem("personaggio", JSON.stringify(nuovoPersonaggio));
  };
  
  

  const gestisciScelta = (scelta) => {
    setConseguenza(scelta.conseguenza);
    aggiornaStatistiche(scelta.modificheStatistiche);
    setSceltaFatta(true);
  };

  // Percorso dell'immagine narrativa
  const percorso = personaggio.percorso.toLowerCase();
  const sesso = personaggio.sesso.toLowerCase();
  const imagePath = `src/assets/narratives/${fase}_${percorso}_${sesso}.png`;
  const placeholderImage = `src/assets/narratives/placeholder.png`;

  return (
    <div className="narrative-scene text-center">
      {/* Immagine narrativa */}
      <img
        src={imagePath}
        alt={`Scena di ${fase}`}
        className="img-fluid my-3"
        style={{ maxWidth: "100%", height: "auto" }}
        onError={(e) => (e.target.src = placeholderImage)}
      />

      {/* Testo narrativo */}
      <p><strong>{narrativa}</strong></p>

      {/* Scelte */}
      {!sceltaFatta && scelte.length > 0 && (
        <div className="scelte">
          {scelte.map((scelta, index) => (
            <button
              key={index}
              className="btn btn-outline-primary m-2"
              onClick={() => gestisciScelta(scelta)}
            >
              {scelta.testo}
            </button>
          ))}
        </div>
      )}

      {/* Conseguenza e bottone OK */}
      {conseguenza && (
        <div className="conseguenza mt-3">
          <p className="alert alert-info">{conseguenza}</p>
          <button className="btn btn-success" onClick={() => avanzaFase()}>
            OK
          </button>
        </div>
      )}

      {/* Bottone "Avanza" se non ci sono scelte né conseguenze */}
      {!scelte.length && !conseguenza && (
        <button className="btn btn-secondary mt-4" onClick={avanzaFase}>
          Avanza
        </button>
      )}
    </div>
  );
}

export default NarrativeScene;
