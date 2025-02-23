import React, { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import NarrativeScene from "./NarrativeScene";

const fasiGiornata = ["Risveglio", "Mattina Presto", "Mattina", "Pomeriggio", "Sera", "Notte"];

function GameMainScreen() {
  const [personaggio, setPersonaggio] = useState(null);
  const [giorno, setGiorno] = useState(() => Number(localStorage.getItem("giorno")) || 1);
  const [fase, setFase] = useState(() => Number(localStorage.getItem("fase")) || 0);
  const [data, setData] = useState(() => new Date(localStorage.getItem("data") || "2024-06-24"));

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
  
    // Controllo della stamina: se è a 0 o meno, forza la fase Notte con riposo completo
    if (personaggio.stamina <= 0 && fasiGiornata[fase] !== "Notte") {
      const personaggioRipristinato = {
        ...personaggio,
        stamina: 100, // Ripristina stamina completa
        energia: 100, // Ripristina energia
        umore: Math.min(personaggio.umore + 20, 100) // Recupero dell'umore (massimo 100)
      };
  
      setPersonaggio(personaggioRipristinato);
      localStorage.setItem("personaggio", JSON.stringify(personaggioRipristinato));
      setFase(fasiGiornata.indexOf("Notte")); // Forza la fase a Notte
      return; // Esce per evitare di avanzare ulteriormente la fase
    }
  
    // Avanzamento normale delle fasi
    if (fase < fasiGiornata.length - 1) {
      setFase((prev) => prev + 1);
    } else {
      // Se siamo alla fase Notte, passa al giorno successivo e resetta le statistiche
      setFase(0);
      setGiorno((prev) => prev + 1);
      setData((prev) => {
        const nuovaData = new Date(prev);
        nuovaData.setDate(nuovaData.getDate() + 1);
        return nuovaData;
      });
  
      const personaggioRipristinato = {
        ...personaggio,
        stamina: 100,
        energia: 100,
        umore: Math.min(personaggio.umore + 20, 100)
      };
  
      setPersonaggio(personaggioRipristinato);
      localStorage.setItem("personaggio", JSON.stringify(personaggioRipristinato));
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
          aggiornaPersonaggio={setPersonaggio}
        />
      </main>
      <SidebarRight />
    </div>
  );
}

export default GameMainScreen;
