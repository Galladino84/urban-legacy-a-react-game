import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import narratives from "../data/narratives.json";
import materieData from "../data/materie.json";
import SecondaryChoiceLightbox from "./SecondaryChoiceLightbox";

function NarrativeScene({ fase, personaggio, avanzaFase, forcedRest }) {
  const navigate = useNavigate();
  
  const [narrativa, setNarrativa] = useState("");
  const [scelte, setScelte] = useState([]);
  const [conseguenza, setConseguenza] = useState("");
  
  // Stato per il flusso scuola
  const [primaryChoiceMade, setPrimaryChoiceMade] = useState(false);
  const [scelteSecondarie, setScelteSecondarie] = useState([]);
  const [secondaryChoiceDone, setSecondaryChoiceDone] = useState(false);
  
  // Stato per il lightbox (per la scelta secondaria)
  const [showSecondaryLightbox, setShowSecondaryLightbox] = useState(false);
  const [secondaryLightboxMessage, setSecondaryLightboxMessage] = useState("");
  
  // Stato per salvare le materie aggiornate (per il messaggio nel lightbox)
  const [progressSubjects, setProgressSubjects] = useState([]);
  
  useEffect(() => {
    if (personaggio && fase) {
      const percorso = personaggio.percorso.toLowerCase();
      const sesso = personaggio.sesso.toLowerCase();
      const narrativaFase = narratives[fase]?.[sesso]?.[percorso];
      if (narrativaFase) {
        setNarrativa(narrativaFase.testo);
        setScelte(narrativaFase.scelte || []);
        console.log("Narrativa impostata:", narrativaFase.testo);
        console.log("Scelte primarie:", narrativaFase.scelte);
      } else {
        setNarrativa("Nessuna scena disponibile per questa fase.");
        setScelte([]);
      }
      setConseguenza("");
      setPrimaryChoiceMade(false);
      setScelteSecondarie([]);
      setSecondaryChoiceDone(false);
      setShowSecondaryLightbox(false);
      setSecondaryLightboxMessage("");
      setProgressSubjects([]);
    }
  }, [fase, personaggio]);

  // Aggiorna le statistiche e salva in localStorage
  const aggiornaStatistiche = (modifiche) => {
    const nuovoPersonaggio = { ...personaggio };
    Object.entries(modifiche).forEach(([stat, valore]) => {
      const attuale = nuovoPersonaggio.statistiche[stat] ?? 0;
      let nuovoValore = attuale + valore;
      if (stat === "status") {
        nuovoValore = Math.max(0, Math.min(nuovoValore, 5));
      } else if (stat === "soldi") {
        nuovoValore = Math.max(0, nuovoValore);
      } else {
        nuovoValore = Math.max(0, nuovoValore);
      }
      nuovoPersonaggio.statistiche[stat] = nuovoValore;
    });
    localStorage.setItem("personaggio", JSON.stringify(nuovoPersonaggio));
    console.log("Statistiche aggiornate:", nuovoPersonaggio.statistiche);
  };

  // Evento "vai a scuola" (scelta primaria)
  const handleSchoolEvent = () => {
    // Calcola il giorno in-game dalla data salvata (se non presente, usa quella corrente)
    const dataStored = localStorage.getItem("data");
    let inGameDate = dataStored ? new Date(dataStored) : new Date();
    const options = { weekday: "long" };
    let giornoSettimana = inGameDate.toLocaleDateString("it-IT", options).toLowerCase();
    giornoSettimana = giornoSettimana.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log("School Event - giorno in-game:", giornoSettimana);
    
    // Ottieni le materie per il giorno dalla tabella materie.json
    const materieOggi = materieData[giornoSettimana] || [];
    setProgressSubjects(materieOggi);
    
    // Incrementa la conoscenza per ogni materia (es. +2 per materia)
    const incremento = 2;
    const updatedPersonaggio = { ...personaggio };
    updatedPersonaggio.statistiche = updatedPersonaggio.statistiche || {};
    materieOggi.forEach(materia => {
      const key = "conoscenza_" + materia.replace(/\s+/g, "_").toLowerCase();
      if (updatedPersonaggio.statistiche[key] === undefined) {
        updatedPersonaggio.statistiche[key] = 0;
      }
      updatedPersonaggio.statistiche[key] += incremento;
      console.log(`Incrementata conoscenza per ${materia}: ${updatedPersonaggio.statistiche[key]}`);
    });
    localStorage.setItem("personaggio", JSON.stringify(updatedPersonaggio));
    console.log("School Event: Personaggio aggiornato:", updatedPersonaggio);
    
    // Imposta la conseguenza dell'evento scuola (puoi personalizzare il testo)
    setConseguenza("Hai frequentato la scuola.");
    
    // Carica le scelte secondarie dal JSON; se non presenti, usa opzioni di default
    let secChoices = narratives[fase]?.[personaggio.sesso.toLowerCase()]?.[personaggio.percorso.toLowerCase()]?.scelteSecondarie;
    if (!secChoices || secChoices.length === 0) {
      secChoices = [
        { testo: "stare attenti", conseguenza: "Hai studiato seriamente.", modificheStatistiche: { conoscenza_bonus: 1 } },
        { testo: "cazzeggiare", conseguenza: "Hai cazzeggiato, ma qualche nozione ti è rimasta.", modificheStatistiche: { conoscenza_bonus: 0 } }
      ];
    }
    setScelteSecondarie(secChoices);
    setPrimaryChoiceMade(true);
    console.log("School event completato. Scelte secondarie:", secChoices);
  };

  // Gestione della scelta primaria
  const gestisciScelta = (scelta) => {
    // Se in fase mattina e la scelta contiene "vai a scuola", gestisci l'evento scuola
    if (fase === "mattina" && scelta.testo.toLowerCase().includes("vai a scuola")) {
      console.log("Scelta primaria 'vai a scuola' selezionata.");
      handleSchoolEvent();
      return;
    }
    // Altrimenti gestione normale
    setConseguenza(scelta.conseguenza);
    aggiornaStatistiche(scelta.modificheStatistiche);
    setPrimaryChoiceMade(true);
    if (scelta.scelteSecondarie && scelta.scelteSecondarie.length > 0) {
      setScelteSecondarie(scelta.scelteSecondarie);
      console.log("Scelte secondarie impostate:", scelta.scelteSecondarie);
    }
    console.log("Scelta primaria effettuata:", scelta);
  };

  // Gestione della scelta secondaria:
  // Quando l'utente seleziona una scelta secondaria, apriamo il lightbox
  const gestisciSceltaSecondaria = (scelta) => {
    aggiornaStatistiche(scelta.modificheStatistiche);
    const message = `Hai incrementato la conoscenza in: ${progressSubjects.join(", ")}. ${scelta.conseguenza}`;
    setSecondaryLightboxMessage(message);
    setShowSecondaryLightbox(true);
    console.log("Scelta secondaria selezionata:", scelta);
  };

  // Chiusura del lightbox per la scelta secondaria
  const handleSecondaryLightboxClose = () => {
    setShowSecondaryLightbox(false);
    setSecondaryChoiceDone(true);
    console.log("Lightbox chiuso, scelte secondarie completate.");
  };

  // Pulsante per avanzare la fase (mostrato solo dopo che la scelta secondaria è completata)
  const handleAvanzaFase = () => {
    console.log("Avanzo fase.");
    // Reset degli stati per la fase corrente
    setConseguenza("");
    setPrimaryChoiceMade(false);
    setScelteSecondarie([]);
    setSecondaryChoiceDone(false);
    setShowSecondaryLightbox(false);
    setSecondaryLightboxMessage("");
    avanzaFase();
  };

  const imagePath = `src/assets/narratives/${fase}_${personaggio.percorso.toLowerCase()}_${personaggio.sesso.toLowerCase()}.png`;
  const placeholderImage = `src/assets/narratives/placeholder.png`;

  if (forcedRest) {
    return (
      <div className="narrative-scene text-center">
        <img
          src={placeholderImage}
          alt="Riposo forzato"
          className="img-fluid my-3"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <div className="narrative-scene-box">
          <p><strong>Ti senti esausto e non ti reggi in piedi.</strong></p>
          <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>
            Vai a dormire
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="narrative-scene text-center">
      <img
        src={imagePath}
        alt={`Scena di ${fase}`}
        className="img-fluid my-3"
        style={{ maxWidth: "100%", height: "auto" }}
        onError={(e) => (e.target.src = placeholderImage)}
      />
      <div className="narrative-scene-box">
        <p><strong>{narrativa}</strong></p>
        {/* Se nessuna scelta primaria è stata fatta, mostra le opzioni primarie */}
        {!primaryChoiceMade && scelte.length > 0 && (
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
        {/* Se è stata fatta la scelta primaria e c'è una conseguenza */}
        {primaryChoiceMade && conseguenza && (
          <>
            <p className="alert alert-info">
              <strong>Conseguenza:</strong> {conseguenza}
            </p>
            {/* Se sono presenti scelte secondarie e l'utente non ha ancora fatto una scelta secondaria */}
            {scelteSecondarie.length > 0 && !secondaryChoiceDone && (
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
            {/* Se il lightbox per la scelta secondaria è attivo */}
            {showSecondaryLightbox && (
              <SecondaryChoiceLightbox
                message={secondaryLightboxMessage}
                onClose={handleSecondaryLightboxClose}
              />
            )}
            {/* Se le scelte secondarie sono state completate (o non esistono), mostra il pulsante OK per avanzare */}
            {((scelteSecondarie.length > 0 && secondaryChoiceDone) ||
              scelteSecondarie.length === 0) && (
              <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>
                OK
              </button>
            )}
          </>
        )}
        {/* Se non ci sono scelte e nessuna conseguenza, mostra il pulsante Avanza */}
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
