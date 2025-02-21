import React, { useEffect, useState, useRef } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

function GameMainScreen() {
  const [personaggio, setPersonaggio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const datiSalvati = localStorage.getItem("personaggio");
    if (datiSalvati) {
      setPersonaggio(JSON.parse(datiSalvati));
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (personaggio && audioRef.current) {
      const audio = audioRef.current;

      const playAudio = async () => {
        try {
          await audio.play();
        } catch (err) {
          console.warn("Autoplay bloccato. Riproduci manualmente l'audio.");
        }
      };

      playAudio();

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [personaggio]);

  if (!personaggio) return <p>Caricamento...</p>;

  const percorso = personaggio.percorso.toLowerCase();
  const audioPath = `src/assets/audio/${percorso}_theme.mp3`;

  return (
    <div className={`game-container theme_${percorso} theme_${percorso}_${personaggio.sesso.toLowerCase()}`}>
      {personaggio && (
        <audio ref={audioRef} loop preload="auto" volume="0.5">
          <source src={audioPath} type="audio/mpeg" />
          Il tuo browser non supporta l'audio.
        </audio>
      )}

      <SidebarLeft />
      <main className="main-content">
        <h2>Benvenuto, {personaggio.nome}!</h2>
        <p><strong>Percorso:</strong> {personaggio.percorso}</p>
        <p><strong>Sesso:</strong> {personaggio.sesso}</p>
        <p><strong>Orientamento:</strong> {personaggio.orientamento}</p>
        <p><strong>Famiglia:</strong> 
          {personaggio.famiglia.mamma ? "Mamma " : ""}
          {personaggio.famiglia.sorella ? "Sorella " : ""}
          {personaggio.famiglia.papà ? "Papà " : ""}
          {personaggio.famiglia.fratello ? "Fratello" : ""}
        </p>
        <button className="btn btn-success mt-4" onClick={() => audioRef.current?.play()}>
          Inizia la tua giornata
        </button>
      </main>
      <SidebarRight />
    </div>
  );
}

export default GameMainScreen;
