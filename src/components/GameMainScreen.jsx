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
  const [showNotification, setShowNotification] = useState(false);

  // ✅ Funzione per pulire e aggiornare i dati del personaggio
  const pulisciDatiPersonaggio = (personaggio) => {
    const aggiornato = { ...personaggio };
    let modificato = false;

    // 1. Rinomina "affinita_pet" -> "affinità_gatto"
    if (aggiornato.statistiche?.affinita_pet !== undefined) {
      aggiornato.statistiche.affinita_gatto = aggiornato.statistiche.affinita_pet;
      delete aggiornato.statistiche.affinita_pet;
      modificato = true;
    }

    // 2. Rimuove chiavi non necessarie globali
    if (localStorage.getItem("giornoCorrente") || localStorage.getItem("dataCorrente")) {
      localStorage.removeItem("giornoCorrente");
      localStorage.removeItem("dataCorrente");
      modificato = true;
    }

    // Mostra notifica se ci sono modifiche
    if (modificato) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Sparisce dopo 3 secondi
    }

    return aggiornato;
  };

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");

    if (datiSalvati) {
      let personaggioCaricato = JSON.parse(datiSalvati);

      // Pulizia e aggiornamento dei dati
      personaggioCaricato = pulisciDatiPersonaggio(personaggioCaricato);

      setPersonaggio(personaggioCaricato);
      localStorage.setItem("personaggio", JSON.stringify(personaggioCaricato));
    } else {
      // Se i dati non esistono, torna alla schermata iniziale
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

    // Se la stamina è <= 0 e non siamo in fase "notte", forziamo il riposo.
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

      // Ripristino della stamina
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

  const formattaGiornoSettimana = (data) =>
    data.toLocaleDateString("it-IT", { weekday: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  const formattaData = (data) =>
    data.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

  if (!personaggio) return <p>Caricamento...</p>;

  return (
    <div className={`game-container theme_${personaggio.percorso.toLowerCase()} theme_${personaggio.percorso.toLowerCase()}_${personaggio.sesso.toLowerCase()}`}>
      {/* 🔔 Notifica visibile se showNotification è true */}
      {showNotification && (
        <div className="notification">
          ✅ Dati aggiornati correttamente!
        </div>
      )}

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
