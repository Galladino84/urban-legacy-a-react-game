import React, { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

const fasiGiornata = [
  "Inizio Giornata",
  "Risveglio",
  "Mattina Presto",
  "Mattina",
  "Pomeriggio",
  "Sera",
  "Notte"
];

function GameMainScreen() {
  const [personaggio, setPersonaggio] = useState(null);

  // Carica giorno, fase e data da localStorage o imposta valori predefiniti
  const [giorno, setGiorno] = useState(() => {
    return Number(localStorage.getItem("giorno")) || 1;
  });

  const [fase, setFase] = useState(() => {
    return Number(localStorage.getItem("fase")) || 0;
  });

  const [data, setData] = useState(() => {
    const savedDate = localStorage.getItem("data");
    return savedDate ? new Date(savedDate) : new Date(2024, 5, 24); // 24 Giugno 2024
  });

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");
    if (datiSalvati) {
      setPersonaggio(JSON.parse(datiSalvati));
    } else {
      window.location.href = "/";
    }
  }, []);

  // Salva automaticamente giorno, fase e data ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem("giorno", giorno.toString());
    localStorage.setItem("fase", fase.toString());
    localStorage.setItem("data", data.toISOString());
  }, [giorno, fase, data]);

  const avanzaFase = () => {
    if (fase < fasiGiornata.length - 1) {
      setFase((prev) => prev + 1);
    } else {
      setFase(0); // Resetta la fase
      setGiorno((prev) => prev + 1); // Avanza il giorno
      setData((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))); // Avanza la data
    }
  };

  if (!personaggio) return <p>Caricamento...</p>;

  const formattaData = (data) =>
    data.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  return (
    <div
      className={`game-container theme_${personaggio.percorso.toLowerCase()} theme_${personaggio.percorso.toLowerCase()}_${personaggio.sesso.toLowerCase()}`}
    >
      <SidebarLeft />

      <main className="main-content">
        {/* Header */}
        <header className="game-header">
          <div className="header-content">
            <span><strong>Giorno:</strong> {giorno}</span>
            <span><strong>Data:</strong> {formattaData(data)}</span>
            <span><strong>Fase:</strong> {fasiGiornata[fase]}</span>
          </div>
        </header>

        <h2>Benvenuto, {personaggio.nome}!</h2>
        <p><strong>Percorso:</strong> {personaggio.percorso}</p>
        <p><strong>Sesso:</strong> {personaggio.sesso}</p>
        <p><strong>Orientamento:</strong> {personaggio.orientamento}</p>
        <p>
          <strong>Famiglia:</strong>{" "}
          {personaggio.famiglia.mamma ? "Mamma " : ""}
          {personaggio.famiglia.sorella ? "Sorella " : ""}
          {personaggio.famiglia.papà ? "Papà " : ""}
          {personaggio.famiglia.fratello ? "Fratello" : ""}
        </p>

        <button className="btn btn-primary mt-4" onClick={avanzaFase}>
          Avanza Fase ({fasiGiornata[fase]})
        </button>
      </main>

      <SidebarRight />
    </div>
  );
}

export default GameMainScreen;
