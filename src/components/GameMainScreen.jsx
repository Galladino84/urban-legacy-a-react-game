import React, { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import NarrativeScene from "./NarrativeScene";

// Le fasi della giornata, in ordine: risveglio, mattina_presto, mattina, pomeriggio, sera, notte
const fasiGiornata = ["risveglio", "mattina_presto", "mattina", "pomeriggio", "sera", "notte"];

function GameMainScreen() {
  const [personaggio, setPersonaggio] = useState(null);
  const [giorno, setGiorno] = useState(() => Number(localStorage.getItem("giorno")) || 1);
  const [fase, setFase] = useState(() => Number(localStorage.getItem("fase")) || 0);
  const [data, setData] = useState(() => new Date(localStorage.getItem("data") || "2024-06-24"));
  const [forcedRest, setForcedRest] = useState(false);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");
    if (datiSalvati) {
      setPersonaggio(JSON.parse(datiSalvati));
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("giorno", giorno.toString());
    localStorage.setItem("fase", fase.toString());
    localStorage.setItem("data", data.toISOString());
  }, [giorno, fase, data]);

  const avanzaFase = () => {
    if (!personaggio) return;

    // Se la stamina è <= 0 e non siamo già in fase "notte", forziamo il riposo.
    if (
      personaggio.statistiche.stamina <= 0 &&
      fasiGiornata[fase].toLowerCase() !== "notte"
    ) {
      setForcedRest(true);
      setFase(fasiGiornata.indexOf("notte"));
      return;
    }

    // Avanzamento normale delle fasi
    if (fase < fasiGiornata.length - 1) {
      setFase((prev) => prev + 1);
    } else {
      // Fine della giornata: si passa al giorno successivo
      setFase(0);
      setGiorno((prev) => prev + 1);
      setData((prev) => {
        const nuovaData = new Date(prev);
        nuovaData.setDate(nuovaData.getDate() + 1);
        return nuovaData;
      });

      // Ripristino della stamina al valore iniziale
      const personaggioRipristinato = {
        ...personaggio,
        statistiche: {
          ...personaggio.statistiche,
          stamina: personaggio.initialStatistiche.stamina,
        },
      };

      setPersonaggio(personaggioRipristinato);
      localStorage.setItem("personaggio", JSON.stringify(personaggioRipristinato));
      setForcedRest(false); // Reset della flag per il riposo forzato
    }
  };

  const formattaGiornoSettimana = (data) =>
    data.toLocaleDateString("it-IT", { weekday: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  const formattaData = (data) =>
    data.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

  if (!personaggio) return <p>Caricamento...</p>;

  return (
    <div className={`game-container theme_${personaggio.percorso.toLowerCase()} theme_${personaggio.percorso.toLowerCase()}_${personaggio.sesso.toLowerCase()}`}>
      <SidebarLeft />
      <main className="main-content">
        <header className="game-header">
          <div className="header-content">
            <span><strong>Giorno:</strong> {giorno}</span>
            <span><strong>Data:</strong> {formattaGiornoSettimana(data)}, {formattaData(data)}</span>
            <span><strong>Fase:</strong> {fasiGiornata[fase]}</span>
          </div>
        </header>
        
        <NarrativeScene
          fase={fasiGiornata[fase].toLowerCase().replace(" ", "_")}
          personaggio={personaggio}
          avanzaFase={avanzaFase}
          forcedRest={forcedRest}
        />
      </main>
      <SidebarRight />
    </div>
  );
}

export default GameMainScreen;
