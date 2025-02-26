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
  const currentDay = Number(localStorage.getItem("giorno")) || 1;

  const [narrativa, setNarrativa] = useState("");
  const [scelte, setScelte] = useState([]);
  const [scelteSecondarie, setScelteSecondarie] = useState([]);
  const [progressSubjects, setProgressSubjects] = useState([]);

  const [showPrimaryLightbox, setShowPrimaryLightbox] = useState(false);
  const [primaryLightboxMessage, setPrimaryLightboxMessage] = useState("");
  const [showSecondaryLightbox, setShowSecondaryLightbox] = useState(false);
  const [secondaryLightboxMessage, setSecondaryLightboxMessage] = useState("");
  const [primaryChoiceMade, setPrimaryChoiceMade] = useState(false);
  const [secondaryChoiceDone, setSecondaryChoiceDone] = useState(false);

  const [showPetEvent, setShowPetEvent] = useState(false);
  const [petEvent, setPetEvent] = useState(null);

  useEffect(() => {
    if (personaggio && fase) {
      const percorso = personaggio?.percorso?.toLowerCase() || "";
      const sesso = personaggio?.sesso?.toLowerCase() || "";
      const narrativaFase = narratives[fase]?.[sesso]?.[percorso];

      if (narrativaFase) {
        setNarrativa(narrativaFase.testo);
        setScelte(narrativaFase.scelte || []);
      } else {
        setNarrativa("Nessuna scena disponibile per questa fase.");
        setScelte([]);
      }

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

  useEffect(() => {
    if (personaggio && fase && narratives[fase]?.petEvent && personaggio.gattoAdottato) {
      setPetEvent(narratives[fase].petEvent);
      setShowPetEvent(true);
    }
  }, [fase, personaggio]);

  const aggiornaStatistiche = (modifiche) => {
    const nuovoPersonaggio = { ...personaggio };
    Object.entries(modifiche).forEach(([stat, valore]) => {
      const attuale = nuovoPersonaggio.statistiche[stat] ?? 0;
      const nuovoValore = Math.max(0, attuale + valore); // Check per evitare valori negativi
      nuovoPersonaggio.statistiche[stat] = nuovoValore;
      console.log(`📈 Aggiornata ${stat}: ${attuale} -> ${nuovoValore}`);
    });

    localStorage.setItem("personaggio", JSON.stringify(nuovoPersonaggio));
  };

  const handleSchoolEvent = () => {
    const giornoSettimana = new Date(localStorage.getItem("data") || new Date())
      .toLocaleDateString("it-IT", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const materieOggi = materieData[giornoSettimana] || [];
    setProgressSubjects(materieOggi);

    const updatedPersonaggio = { ...personaggio };
    materieOggi.forEach((materia) => {
      const key = "conoscenza_" + materia.replace(/\s+/g, "_").toLowerCase();
      updatedPersonaggio.statistiche[key] = (updatedPersonaggio.statistiche[key] ?? 0) + 2;
    });

    localStorage.setItem("personaggio", JSON.stringify(updatedPersonaggio));

    setPrimaryLightboxMessage("Hai frequentato la scuola.");
    setShowPrimaryLightbox(true);
    setPrimaryChoiceMade(true);

    setScelteSecondarie([
      { testo: "Stare attenti", conseguenza: "Hai studiato seriamente.", modificheStatistiche: { bonus_conoscenza: 1 } },
      { testo: "Cazzeggiare", conseguenza: "Hai cazzeggiato, ma qualche nozione ti è rimasta.", modificheStatistiche: { bonus_conoscenza: 0 } },
    ]);
  };

  const gestisciScelta = (scelta) => {
    if (fase === "mattina" && scelta.testo.toLowerCase().includes("vai a scuola")) {
      handleSchoolEvent();
      return;
    }

    aggiornaStatistiche(scelta.modificheStatistiche);
    setPrimaryLightboxMessage(scelta.conseguenza);
    setShowPrimaryLightbox(true);
    setPrimaryChoiceMade(true);
    setScelteSecondarie(scelta.scelteSecondarie || []);
  };

  const gestisciSceltaSecondaria = (scelta) => {
    aggiornaStatistiche(scelta.modificheStatistiche);
    setSecondaryLightboxMessage(`Hai incrementato la conoscenza in: ${progressSubjects.join(", ")}. ${scelta.conseguenza}`);
    setShowSecondaryLightbox(true);
  };

  const handlePrimaryLightboxClose = () => {
    setShowPrimaryLightbox(false);
    if (scelteSecondarie.length > 0) {
      setSecondaryChoiceDone(false);
    } else {
      setSecondaryChoiceDone(true);
    }
  };

  const handleSecondaryLightboxClose = () => {
    setShowSecondaryLightbox(false);
    setSecondaryChoiceDone(true);
  };

  const handleAvanzaFase = () => {
    setShowPrimaryLightbox(false);
    setShowSecondaryLightbox(false);
    setPrimaryChoiceMade(false);
    setSecondaryChoiceDone(false);
    setScelteSecondarie([]);
    avanzaFase();
  };

  const handlePetEventOptionSelected = (option) => {
    if (option?.modificheStatistiche) aggiornaStatistiche(option.modificheStatistiche);
    setShowPetEvent(false);
  };

  const imagePath = `src/assets/narratives/${fase}_${personaggio?.percorso?.toLowerCase()}_${personaggio?.sesso?.toLowerCase()}.png`;
  const placeholderImage = `src/assets/narratives/placeholder.png`;

  return (
    <div className="narrative-scene text-center">
      <UniqueEventsManager currentDay={currentDay} currentPhase={fase} personaggio={personaggio} onEventProcessed={() => window.location.reload()} />

      {petEvent && showPetEvent && (
        <PetEventLightbox petEvent={petEvent} personaggio={personaggio} onOptionSelected={handlePetEventOptionSelected} />
      )}

      <img src={imagePath} alt={`Scena di ${fase}`} className="img-fluid my-3" style={{ maxWidth: "100%", height: "auto" }} onError={(e) => (e.target.src = placeholderImage)} />

      <div className="narrative-scene-box">
        <p><strong>{narrativa}</strong></p>

        {!primaryChoiceMade && scelte.length > 0 && (
          <div className="scelte">
            {scelte.map((scelta, index) => (
              <button key={index} className="btn btn-outline-primary m-2" onClick={() => gestisciScelta(scelta)}>
                {scelta.testo}
              </button>
            ))}
          </div>
        )}

        {primaryChoiceMade && showPrimaryLightbox && (
          <PrimaryChoiceLightbox message={primaryLightboxMessage} onClose={handlePrimaryLightboxClose} />
        )}

        {primaryChoiceMade && !showPrimaryLightbox && scelteSecondarie.length > 0 && !secondaryChoiceDone && (
          <div className="scelte-secondarie">
            <p>Scegli cosa fare dopo:</p>
            {scelteSecondarie.map((scelta, index) => (
              <button key={index} className="btn btn-outline-secondary m-2" onClick={() => gestisciSceltaSecondaria(scelta)}>
                {scelta.testo}
              </button>
            ))}
          </div>
        )}

        {showSecondaryLightbox && (
          <SecondaryChoiceLightbox message={secondaryLightboxMessage} onClose={handleSecondaryLightboxClose} />
        )}

        {primaryChoiceMade && (!showPrimaryLightbox && (scelteSecondarie.length === 0 || secondaryChoiceDone)) && (
          <button className="btn btn-success mt-3" onClick={handleAvanzaFase}>OK</button>
        )}

        {!primaryChoiceMade && scelte.length === 0 && (
          <button className="btn btn-secondary mt-4" onClick={handleAvanzaFase}>Avanza</button>
        )}
      </div>
    </div>
  );
}

export default NarrativeScene;
