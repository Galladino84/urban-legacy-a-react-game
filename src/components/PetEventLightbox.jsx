import React, { useState, useEffect } from "react";

const PetEventLightbox = ({ petEvent, personaggio, onOptionSelected }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const nomeGatto = personaggio?.gattoNome || "il tuo gatto";

  useEffect(() => {
    console.log("🔎 petEvent ricevuto:", petEvent);
    console.log("🐾 Personaggio ricevuto:", personaggio);
    console.log("📊 Statistiche personaggio:", personaggio?.statistiche);
    console.log("🐱 Valore affinità_gatto:", personaggio?.statistiche?.affinità_gatto);
  }, [petEvent, personaggio]);

  const getConsequenceByStatCheck = () => {
    if (!petEvent.checkStatistiche || petEvent.checkStatistiche.length === 0) return null;

    const valoreStat = personaggio?.statistiche?.affinità_gatto ?? 0;
    console.log("🐱 Valore affinità_gatto attuale:", valoreStat);

    const sortedChecks = [...petEvent.checkStatistiche].sort((a, b) => b.soglia - a.soglia);
    console.log("📝 Check ordinati:", sortedChecks);

    for (let check of sortedChecks) {
      console.log(`🔎 Check "${check.statistica}": valore = ${valoreStat}, soglia = ${check.soglia}`);
      if (valoreStat >= check.soglia) {
        console.log("✅ Conseguenza trovata:", check.conseguenza);
        return check.conseguenza.replace("{gattoNome}", nomeGatto);
      }
    }

    console.log("❌ Nessuna soglia raggiunta, uso conseguenza di default.");
    return "Nessuna conseguenza disponibile.";
  };

  const handleOptionClick = (option) => {
    console.log("✅ Opzione selezionata:", option);
    setSelectedOption(option);
  };

  const handleOk = () => {
    console.log("🖱️ OK premuto");
    if (selectedOption) {
      console.log("➡️ Passo l'opzione selezionata al genitore:", selectedOption);
      onOptionSelected(selectedOption);
    } else {
      console.log("➡️ Nessuna opzione selezionata. Chiudo il lightbox.");
      onOptionSelected(null); // Chiude il lightbox se non ci sono opzioni
    }
  };

  return (
    <div className="pet-event-overlay lightbox-overlay">
      <div className="pet-event-content lightbox-container">
        <h2>Evento Animale Domestico</h2>
        <p>{petEvent.testo.replace("{gattoNome}", nomeGatto)}</p>

        {/* Se ci sono scelte, mostra i pulsanti delle scelte */}
        {petEvent.scelte && petEvent.scelte.length > 0 && !selectedOption ? (
          <div className="pet-event-options">
            {petEvent.scelte.map((option, index) => (
              <button
                key={index}
                className="btn btn-primary m-2"
                onClick={() => handleOptionClick(option)}
              >
                {option.testo.replace("{gattoNome}", nomeGatto)}
              </button>
            ))}
          </div>
        ) : selectedOption ? (
          <div className="pet-event-consequence">
            <p>{selectedOption.conseguenza.replace("{gattoNome}", nomeGatto)}</p>
            <button className="btn btn-success" onClick={handleOk}>OK</button>
          </div>
        ) : (
          petEvent.checkStatistiche && (
            <div className="pet-event-consequence">
              <p>{getConsequenceByStatCheck()}</p>
              <button className="btn btn-success" onClick={handleOk}>OK</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PetEventLightbox;
