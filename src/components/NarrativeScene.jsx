import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import narratives from "../data/narratives.json";
import materieData from "../data/materie.json";
import PrimaryChoiceLightbox from "./PrimaryChoiceLightbox";
import SecondaryChoiceLightbox from "./SecondaryChoiceLightbox";
import UniqueEventsManager from "./UniqueEventsManager";
import PetEventLightbox from "./PetEventLightbox";

function NarrativeScene({ fase, personaggio, avanzaFase, forcedRest }) {
  const navigate = useNavigate();

  // Recupera dati base da localStorage per eventi unici
  const stored = localStorage.getItem("personaggio");
  const currentPersonaggio = stored ? JSON.parse(stored) : null;
  const currentDay = Number(localStorage.getItem("giorno")) || 1;

  // Stati per la narrativa e le scelte
  const [narrativa, setNarrativa] = useState("");
  const [scelte, setScelte] = useState([]);
  const [conseguenza, setConseguenza] = useState("");

  // Stati per la gestione delle scelte primarie/secondarie e lightbox
  const [primaryChoiceMade, setPrimaryChoiceMade] = useState(false);
  const [scelteSecondarie, setScelteSecondarie] = useState([]);
  const [secondaryChoiceDone, setSecondaryChoiceDone] = useState(false);
  const [showPrimaryLightbox, setShowPrimaryLightbox] = useState(false);
  const [primaryLightboxMessage, setPrimaryLightboxMessage] = useState("");
  const [showSecondaryLightbox, setShowSecondaryLightbox] = useState(false);
  const [secondaryLightboxMessage, setSecondaryLightboxMessage] = useState("");

  // Stato per il petEvent (per incrementare l'affinità animale)
  const [showPetEvent, setShowPetEvent] = useState(false);
  const [petEvent, setPetEvent] = useState(null);

  // Stato per salvare l’elenco delle materie aggiornate (evento scuola)
  const [progressSubjects, setProgressSubjects] = useState([]);

  // Carica la narrativa e le scelte in base alla fase
  useEffect(() => {
    if (personaggio && fase) {
      const percorso = personaggio?.percorso?.toLowerCase() || "";
      const sesso = personaggio?.sesso?.toLowerCase() || "";
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
      setShowPrimaryLightbox(false);
      setPrimaryLightboxMessage("");
      setShowSecondaryLightbox(false);
      setSecondaryLightboxMessage("");
      setProgressSubjects([]);
    }
  }, [fase, personaggio]);

  // Se nella narrativa corrente esiste un petEvent e il personaggio ha adottato il gatto, attiva il lightbox pet
  useEffect(() => {
    if (personaggio && fase && narratives[fase]?.petEvent && personaggio.gattoAdottato === true) {
      setPetEvent(narratives[fase].petEvent);
      setShowPetEvent(true);
      console.log("Attivato petEvent:", narratives[fase].petEvent);
    }
  }, [fase, personaggio]);

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
    const dataStored = localStorage.getItem("data");
    let inGameDate = dataStored ? new Date(dataStored) : new Date();
    const options = { weekday: "long" };
    let giornoSettimana = inGameDate
      .toLocaleDateString("it-IT", options)
      .toLowerCase();
    giornoSettimana = giornoSettimana.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log("School Event - giorno in-game:", giornoSettimana);

    const materieOggi = materieData[giornoSettimana] || [];
    setProgressSubjects(materieOggi);

    // Incremento primario: +2 per ogni materia
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

    setPrimaryLightboxMessage("Hai frequentato la scuola.");
    setShowPrimaryLightbox(true);

    let secChoices = narratives[fase]?.[personaggio?.sesso?.toLowerCase() || ""]?.[personaggio?.percorso?.toLowerCase() || ""]?.scelteSecondarie;
    if (!secChoices || secChoices.length === 0) {
      secChoices = [
        { testo: "stare attenti", conseguenza: "Hai studiato seriamente.", modificheStatistiche: { bonus_conoscenza: 1 } },
        { testo: "cazzeggiare", conseguenza: "Hai cazzeggiato, ma qualche nozione ti è rimasta.", modificheStatistiche: { bonus_conoscenza: 0 } }
      ];
    }
    setScelteSecondarie(secChoices);
    setPrimaryChoiceMade(true);
    console.log("School event completato. Scelte secondarie:", secChoices);
  };

  // Gestione della scelta primaria
  const gestisciScelta = (scelta) => {
    if (fase === "mattina" && scelta.testo.toLowerCase().includes("vai a scuola")) {
      console.log("Scelta primaria 'vai a scuola' selezionata.");
      handleSchoolEvent();
      return;
    }
    aggiornaStatistiche(scelta.modificheStatistiche);
    setPrimaryLightboxMessage(scelta.conseguenza);
    setShowPrimaryLightbox(true);
    setPrimaryChoiceMade(true);
    if (scelta.scelteSecondarie && scelta.scelteSecondarie.length > 0) {
      setScelteSecondarie(scelta.scelteSecondarie);
      console.log("Scelte secondarie impostate:", scelta.scelteSecondarie);
    }
    console.log("Scelta primaria effettuata:", scelta);
  };

  // Gestione della scelta secondaria
  const gestisciSceltaSecondaria = (scelta) => {
    aggiornaStatistiche(scelta.modificheStatistiche);
    const message = `Hai incrementato la conoscenza in: ${progressSubjects.join(", ")}. ${scelta.conseguenza}`;
    setSecondaryLightboxMessage(message);
    setShowSecondaryLightbox(true);
    console.log("Scelta secondaria selezionata:", scelta);
  };

  const handlePrimaryLightboxClose = () => {
    setShowPrimaryLightbox(false);
  };

  const handleSecondaryLightboxClose = () => {
    setShowSecondaryLightbox(false);
    setSecondaryChoiceDone(true);
    console.log("Lightbox scelta secondaria chiuso.");
  };

  const handleAvanzaFase = () => {
    console.log("Avanzo fase.");
    setShowPrimaryLightbox(false);
    setShowSecondaryLightbox(false);
    setPrimaryLightboxMessage("");
    setSecondaryLightboxMessage("");
    setPrimaryChoiceMade(false);
    setScelteSecondarie([]);
    setSecondaryChoiceDone(false);
    avanzaFase();
  };

  const imagePath = `src/assets/narratives/${fase}_${personaggio?.percorso?.toLowerCase() || ""}_${personaggio?.sesso?.toLowerCase() || ""}.png`;
  const placeholderImage = `src/assets/narratives/placeholder.png`;

  return (
    <div className="narrative-scene text-center">
      {/* Gestione degli eventi unici tramite UniqueEventsManager */}
      <UniqueEventsManager
        currentDay={currentDay}
        currentPhase={fase}
        personaggio={personaggio}
        onEventProcessed={() => window.location.reload()}
      />
      {/* Se il petEvent esiste, il personaggio ha adottato il gatto e showPetEvent è true, mostra il PetEventLightbox */}
      {narratives[fase]?.petEvent && personaggio?.gattoAdottato && showPetEvent && (
        <PetEventLightbox
          petEvent={narratives[fase].petEvent}
          personaggio={personaggio}
          onOptionSelected={(option) => {
            aggiornaStatistiche(option.modificheStatistiche);
            setShowPetEvent(false);
          }}
        />
      )}
      <img
        src={imagePath}
        alt={`Scena di ${fase}`}
        className="img-fluid my-3"
        style={{ maxWidth: "100%", height: "auto" }}
        onError={(e) => (e.target.src = placeholderImage)}
      />
      <div className="narrative-scene-box">
        <p><strong>{narrativa}</strong></p>
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
        {primaryChoiceMade && showPrimaryLightbox && (
          <PrimaryChoiceLightbox
            message={primaryLightboxMessage}
            onClose={handlePrimaryLightboxClose}
          />
        )}
        {primaryChoiceMade && !showPrimaryLightbox && scelteSecondarie.length > 0 && !secondaryChoiceDone && (
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
        {showSecondaryLightbox && (
          <SecondaryChoiceLightbox
            message={secondaryLightboxMessage}
            onClose={handleSecondaryLightboxClose}
          />
        )}
        {primaryChoiceMade &&
          !showPrimaryLightbox &&
          ((scelteSecondarie.length > 0 && secondaryChoiceDone) || scelteSecondarie.length === 0) && (
            <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>
              OK
            </button>
          )}
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
