import React, { useEffect, useState } from "react";
import domandeVerifica from "../data/domande_italiano.json"; // Assicurati che il file contenga le domande divise per materia.

function VerificationManager({ currentDay, onComplete }) {
  const [domande, setDomande] = useState([]);
  const [risposteDate, setRisposteDate] = useState({});
  const [domandaCorrente, setDomandaCorrente] = useState(0);
  const [tempoRimanente, setTempoRimanente] = useState(20);
  const [punteggio, setPunteggio] = useState(1); // 1 punto solo per essere presente alla verifica.
  const [verificaCompletata, setVerificaCompletata] = useState(false);

  useEffect(() => {
    console.log(`📌 Verifica avviata per il giorno ${currentDay}`);
    
    // Trova la materia del giorno attuale
    const materiaOggi = domandeVerifica.find((v) => v.giorno === currentDay)?.materia;
    if (!materiaOggi) {
      console.error("❌ Nessuna materia trovata per il giorno attuale!");
      return;
    }

    console.log(`📚 Materia della verifica: ${materiaOggi}`);

    // Prendi 3 domande a caso dalla materia
    const domandeMateria = domandeVerifica[materiaOggi];
    if (!domandeMateria || domandeMateria.length === 0) {
      console.error(`❌ Nessuna domanda disponibile per la materia ${materiaOggi}`);
      return;
    }

    const domandeSelezionate = domandeMateria.sort(() => Math.random() - 0.5).slice(0, 3);
    setDomande(domandeSelezionate);
  }, [currentDay]);

  useEffect(() => {
    if (tempoRimanente > 0 && !verificaCompletata) {
      const timer = setTimeout(() => setTempoRimanente(tempoRimanente - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tempoRimanente === 0) {
      handleNextQuestion(null); // Se il tempo scade, passa alla prossima domanda.
    }
  }, [tempoRimanente, verificaCompletata]);

  const handleRisposta = (risposta) => {
    const domandaAttuale = domande[domandaCorrente];
    if (!domandaAttuale) return;

    const nuovaRisposte = { ...risposteDate, [domandaCorrente]: risposta };
    setRisposteDate(nuovaRisposte);

    if (risposta === domandaAttuale.corretta) {
      console.log("✅ Risposta corretta!");
      setPunteggio((prev) => prev + 3); // Aggiungi 3 punti per ogni risposta corretta.
    } else {
      console.log("❌ Risposta sbagliata!");
    }

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (domandaCorrente < domande.length - 1) {
      setDomandaCorrente(domandaCorrente + 1);
      setTempoRimanente(20); // Reset del timer per la prossima domanda.
    } else {
      console.log(`✅ Verifica completata! Punteggio finale: ${punteggio}`);
      setVerificaCompletata(true);
      onComplete(punteggio);
    }
  };

  if (verificaCompletata) {
    return <p>✅ Verifica completata! Punteggio: {punteggio}</p>;
  }

  if (domande.length === 0) {
    return <p>⏳ Caricamento delle domande...</p>;
  }

  return (
    <div className="verification-container text-center">
      <h2>✏️ Verifica in corso</h2>
      <p>⏳ Tempo rimanente: {tempoRimanente}s</p>

      <div className="question-box">
        <p><strong>{domande[domandaCorrente]?.domanda}</strong></p>
        {domande[domandaCorrente]?.opzioni.map((opzione, index) => (
          <button key={index} className="btn btn-outline-primary m-2" onClick={() => handleRisposta(opzione)}>
            {opzione}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VerificationManager;
