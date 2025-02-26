import React, { useState } from "react";


const PetEventLightbox = ({ petEvent, personaggio, onOptionSelected }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const nomeGatto = personaggio?.gattoNome || "il tuo gatto";
  const testoConNome = petEvent.testo.replace("{gattoNome}", nomeGatto);
  const currentAffinity = personaggio?.statistiche?.affinita_pet || 0;

  // Funzione per scegliere la conseguenza in base al valore corrente di affinita_pet
  const getConsequenceForOption = (option, currentAffinity) => {
    if (!option.conseguenzeAffinita) {
      return option.conseguenza;
    }
    // Ordina l'array per soglia (in ordine crescente)
    const sorted = [...option.conseguenzeAffinita].sort((a, b) => a.soglia - b.soglia);
    let selected = sorted[0];
    for (let i = 0; i < sorted.length; i++) {
      if (currentAffinity >= sorted[i].soglia) {
        selected = sorted[i];
      }
    }
    return selected.conseguenza;
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleOk = () => {
    if (selectedOption) {
      onOptionSelected(selectedOption);
    }
  };

  return (
    <div className="pet-event-overlay lightbox-overlay">
      <div className="pet-event-content lightbox-container">
        <h2>Evento Animale Domestico</h2>
        <p>{testoConNome}</p>
        {!selectedOption ? (
          <div className="pet-event-options">
            {petEvent.scelte &&
              petEvent.scelte.map((option, index) => {
                const optionText = option.testo.replace("{gattoNome}", nomeGatto);
                return (
                  <button
                    key={index}
                    className="btn btn-primary m-2"
                    onClick={() => handleOptionClick(option)}
                  >
                    {optionText}
                  </button>
                );
              })}
          </div>
        ) : (
          <div className="pet-event-consequence">
            <p>
              {getConsequenceForOption(selectedOption, currentAffinity).replace("{gattoNome}", nomeGatto)}
            </p>
            <button className="btn btn-success" onClick={handleOk}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetEventLightbox;
