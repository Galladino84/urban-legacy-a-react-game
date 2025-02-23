import React, { useEffect, useState } from "react";
import narratives from "../data/narratives.json";

function NarrativeScene({ fase, personaggio, avanzaFase }) {
  const [narrativa, setNarrativa] = useState(null);
  const [scelte, setScelte] = useState([]);
  const [conseguenza, setConseguenza] = useState(null);
  const [sceltaFatta, setSceltaFatta] = useState(false);
  const [scelteSecondarie, setScelteSecondarie] = useState([]);
  const [sceltaSecondariaFatta, setSceltaSecondariaFatta] = useState(false);
  const [conseguenzaSecondaria, setConseguenzaSecondaria] = useState(null);

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

      setConseguenza(null);
      setSceltaFatta(false);
      setScelteSecondarie([]);
      setSceltaSecondariaFatta(false);
      setConseguenzaSecondaria(null);
    }
  }, [fase, personaggio]);

  const aggiornaStatistiche = (modifiche) => {
    const nuovoPersonaggio = { ...personaggio };

    Object.entries(modifiche).forEach(([stat, valore]) => {
      const valoreAttuale = nuovoPersonaggio.statistiche[stat] ?? 0;
      let nuovoValore = valoreAttuale + valore;

      if (stat === "status") {
        nuovoValore = Math.max(0, Math.min(nuovoValore, 5)); // Status tra 0 e 5
      } else if (stat === "soldi") {
        nuovoValore = Math.max(0, nuovoValore); // Soldi non negativi
      } else {
        nuovoValore = Math.max(0, nuovoValore); // Altre statistiche min 0
      }

      nuovoPersonaggio.statistiche[stat] = nuovoValore;
    });

    localStorage.setItem("personaggio", JSON.stringify(nuovoPersonaggio));
  };

  const gestisciScelta = (scelta) => {
    setConseguenza(scelta.conseguenza);
    aggiornaStatistiche(scelta.modificheStatistiche);
    setSceltaFatta(true);
    setScelteSecondarie(scelta.scelteSecondarie || []);
  };

  const gestisciSceltaSecondaria = (scelta) => {
    setConseguenzaSecondaria(scelta.conseguenza);
    aggiornaStatistiche(scelta.modificheStatistiche);
    setSceltaSecondariaFatta(true);
  };

  const handleAvanzaFase = () => {
    setConseguenza(null);
    setConseguenzaSecondaria(null);
    setSceltaFatta(false);
    setSceltaSecondariaFatta(false);
    setScelteSecondarie([]);
    avanzaFase();
  };

  // Percorso immagine narrativa
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

      <div className="narrative-scene-box">
        {/* Testo narrativo */}
        <p><strong>{narrativa}</strong></p>

        {/* Scelte primarie */}
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

        {/* Conseguenza dopo la scelta primaria */}
        {sceltaFatta && conseguenza && (
          <>
            <p className="alert alert-info"><strong>Conseguenza:</strong> {conseguenza}</p>

            {/* Se ci sono scelte secondarie */}
            {scelteSecondarie.length > 0 && !sceltaSecondariaFatta && (
              <div className="scelte-secondarie">
                <p>Scegli cosa fare dopo:</p>
                {scelteSecondarie.map((scelta, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-secondary m-2"
                    onClick={() => gestisciSceltaSecondaria(scelta)}
                  >
                    {scelta.testo}
                  </button>
                ))}
              </div>
            )}

            {/* Conseguenza dopo la scelta secondaria */}
            {sceltaSecondariaFatta && conseguenzaSecondaria && (
              <>
                <p className="alert alert-warning"><strong>Conseguenza:</strong> {conseguenzaSecondaria}</p>
                <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>
                  OK
                </button>
              </>
            )}

            {/* Se non ci sono scelte secondarie */}
            {!scelteSecondarie.length && (
              <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>
                OK
              </button>
            )}
          </>
        )}

        {/* Se non ci sono scelte né conseguenze */}
        {!scelte.length && !conseguenza && (
          <button className="btn btn-secondary mt-4" onClick={handleAvanzaFase}>
            Avanza
          </button>
        )}
      </div>
    </div>
  );
}

export default NarrativeScene;
