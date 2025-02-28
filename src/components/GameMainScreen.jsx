import React, { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import NarrativeScene from "./NarrativeScene";

// Le fasi della giornata
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

    if (personaggio.statistiche.stamina <= 0 && fasiGiornata[fase] !== "notte") {
      setForcedRest(true);
      setFase(fasiGiornata.indexOf("notte"));
      return;
    }

    if (fase < fasiGiornata.length - 1) {
      setFase((prev) => prev + 1);
    } else {
      setFase(0);
      setGiorno((prev) => prev + 1);
      setData((prev) => {
        const nuovaData = new Date(prev);
        nuovaData.setDate(nuovaData.getDate() + 1);
        return nuovaData;
      });

      const personaggioRipristinato = {
        ...personaggio,
        statistiche: {
          ...personaggio.statistiche,
          stamina: personaggio.initialStatistiche.stamina,
        },
      };

      setPersonaggio(personaggioRipristinato);
      localStorage.setItem("personaggio", JSON.stringify(personaggioRipristinato));
      setForcedRest(false);
    }
  };

  if (!personaggio) return <p>Caricamento...</p>;

  return (
    <div className={`game-container theme_${personaggio.percorso.toLowerCase()} theme_${personaggio.percorso.toLowerCase()}_${personaggio.sesso.toLowerCase()}`}>
      <SidebarLeft />
      <main className="main-content">
        <header className="game-header">
          <div className="header-content">
            <span><strong>Giorno:</strong> {giorno}</span>
            <span><strong>Fase:</strong> {fasiGiornata[fase]}</span>
          </div>
        </header>

        {/* Passiamo il valore di giorno alla SidebarRight per forzare il re-render */}
        <SidebarRight giorno={giorno} fase={fase} setGiorno={setGiorno} setFase={setFase} />
        
        <NarrativeScene
          fase={fasiGiornata[fase].toLowerCase().replace(" ", "_")}
          personaggio={personaggio}
          avanzaFase={avanzaFase}
          forcedRest={forcedRest}
        />
      </main>
    </div>
  );
}

export default GameMainScreen;
