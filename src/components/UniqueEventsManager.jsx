import React, { useEffect, useState } from "react";
import uniqueEventsData from "../data/uniqueEvents.json";

function UniqueEventsManager({ currentDay, currentPhase, personaggio, onEventProcessed }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [showConsequence, setShowConsequence] = useState(false);
  const [consequenceText, setConsequenceText] = useState("");

  const completedEvents = JSON.parse(localStorage.getItem("uniqueEventsCompleted")) || [];
  const uniqueEvents = Array.isArray(uniqueEventsData.uniqueEvents) ? uniqueEventsData.uniqueEvents : [];

  useEffect(() => {
    const eventToTrigger = uniqueEvents.find(
      (event) =>
        event.day === currentDay &&
        event.phase === currentPhase &&
        !completedEvents.includes(event.id)
    );

    if (eventToTrigger) {
      setCurrentEvent(eventToTrigger);
    }
  }, [currentDay, currentPhase, completedEvents]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    if (option.prompt) {
      setShowPrompt(true); // Mostra input per il nome del gatto o altri prompt
    } else {
      processEffects(option.effects); // Se non c’è prompt, applica subito gli effetti
    }
  };

  const processEffects = (effects) => {
    const updatedPersonaggio = { ...personaggio };

    if (effects.set) {
      Object.entries(effects.set).forEach(([key, value]) => {
        updatedPersonaggio[key] = value;
      });
    }

    if (effects.create) {
      Object.entries(effects.create).forEach(([key, value]) => {
        updatedPersonaggio[key] = value;
      });
    }

    if (promptValue && updatedPersonaggio.gattoAdottato) {
      updatedPersonaggio.gattoNome = promptValue;
    }

    localStorage.setItem("personaggio", JSON.stringify(updatedPersonaggio));

    // Check delle soglie sulle statistiche
    if (effects.checkStat) {
      const { stat, thresholds } = effects.checkStat;
      const playerStat = updatedPersonaggio.statistiche?.[stat] ?? 0;

      const applicableThreshold = thresholds
        .sort((a, b) => b.value - a.value)
        .find((threshold) => playerStat >= threshold.value);

      if (applicableThreshold) {
        setConsequenceText(applicableThreshold.consequence.replace("{gattoNome}", updatedPersonaggio.gattoNome || ""));
      } else {
        setConsequenceText("Non è successo nulla di particolare.");
      }
    } else {
      setConsequenceText("Scelta effettuata con successo.");
    }

    setShowConsequence(true);
  };

  const handlePromptConfirm = () => {
    processEffects(selectedOption.effects);
    setShowPrompt(false);
  };

  const handleConsequenceClose = () => {
    const updatedCompleted = [...completedEvents, currentEvent.id];
    localStorage.setItem("uniqueEventsCompleted", JSON.stringify(updatedCompleted));
    setCurrentEvent(null);
    setSelectedOption(null);
    setShowConsequence(false);
    setPromptValue("");

    if (onEventProcessed) onEventProcessed();
  };

  if (!currentEvent) return null; // Nessun evento da mostrare

  return (
    <div className="unique-event-overlay">
      <div className="unique-event-container text-center p-4">
        <img
          src={currentEvent.image}
          alt="Evento Unico"
          className="img-fluid mb-3"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <p><strong>{currentEvent.text.replace("{gattoNome}", personaggio.gattoNome || "")}</strong></p>

        {!selectedOption && (
          <div className="options">
            {currentEvent.options.map((option, index) => (
              <button
                key={index}
                className="btn btn-outline-primary m-2"
                onClick={() => handleOptionSelect(option)}
              >
                {option.text.replace("{gattoNome}", personaggio.gattoNome || "")}
              </button>
            ))}
          </div>
        )}

        {showPrompt && (
          <div className="prompt-box mt-3">
            <p>{selectedOption.prompt}</p>
            <input
              type="text"
              className="form-control"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Inserisci qui..."
            />
            <button
              className="btn btn-success mt-2"
              onClick={handlePromptConfirm}
              disabled={!promptValue.trim()}
            >
              Conferma
            </button>
          </div>
        )}

        {showConsequence && (
          <div className="consequence-box mt-3">
            <p>{consequenceText}</p>
            <button className="btn btn-primary mt-2" onClick={handleConsequenceClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniqueEventsManager;
