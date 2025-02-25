import React, { useEffect, useState } from "react";
import uniqueEventsData from "../data/uniqueEvents.json";

const UniqueEventsManager = ({ currentDay, currentPhase, personaggio, onEventProcessed }) => {
  const [eventToShow, setEventToShow] = useState(null);

  useEffect(() => {
    // Legge gli eventi unici dal JSON e filtra quelli da attivare
    const completed = JSON.parse(localStorage.getItem("uniqueEventsCompleted") || "[]");
    const matchingEvents = uniqueEventsData.uniqueEvents.filter(ev =>
      ev.day === currentDay &&
      ev.phase === currentPhase &&
      !completed.includes(ev.id)
    );
    if (matchingEvents.length > 0) {
      setEventToShow(matchingEvents[0]);
    }
  }, [currentDay, currentPhase]);

  const handleOptionSelected = (option, inputValue) => {
    // Applica gli effetti definiti nell'opzione sul personaggio
    const updatedPersonaggio = { ...personaggio };
    updatedPersonaggio.statistiche = updatedPersonaggio.statistiche || {};
    if (option.effects) {
      if (option.effects.set) {
        Object.entries(option.effects.set).forEach(([key, value]) => {
          updatedPersonaggio[key] = value;
        });
      }
      if (option.effects.create) {
        Object.entries(option.effects.create).forEach(([key, value]) => {
          // Se è richiesto un input (es. nome), usa inputValue se presente
          updatedPersonaggio[key] = inputValue && inputValue.trim() !== "" ? inputValue : value;
        });
      }
      if (option.effects.increment) {
        Object.entries(option.effects.increment).forEach(([key, value]) => {
          updatedPersonaggio.statistiche[key] = (updatedPersonaggio.statistiche[key] || 0) + value;
        });
      }
    }
    localStorage.setItem("personaggio", JSON.stringify(updatedPersonaggio));
    // Segna l'evento come completato
    const completed = JSON.parse(localStorage.getItem("uniqueEventsCompleted") || "[]");
    completed.push(eventToShow.id);
    localStorage.setItem("uniqueEventsCompleted", JSON.stringify(completed));
    onEventProcessed();
  };

  if (!eventToShow) return null;

  return (
    <div className="unique-event-overlay">
      <div className="unique-event-content">
        {eventToShow.image && (
          <img 
            src={eventToShow.image} 
            alt={eventToShow.id} 
            className="unique-event-image" 
            width= "400"
            height= "auto"
          />
        )}
        <h2>{eventToShow.text}</h2>
        {eventToShow.options.map((option, index) => (
          <div key={index} className="unique-event-option">
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                if (option.prompt) {
                  const name = prompt(option.prompt);
                  if (name === null || name.trim() === "") {
                    alert("Inserisci un nome valido.");
                    return;
                  }
                  handleOptionSelected(option, name);
                } else {
                  handleOptionSelected(option, null);
                }
              }}
            >
              {option.text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniqueEventsManager;
