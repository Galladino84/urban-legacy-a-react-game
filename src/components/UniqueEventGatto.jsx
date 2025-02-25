import React, { useState } from 'react';


const UniqueEventGatto = ({ onClose }) => {
  const [choice, setChoice] = useState(null); // null: non scelto; 'adopt': adottarlo; 'reject': portarlo all'enpa
  const [catName, setCatName] = useState('');

  // Quando l'utente sceglie di adottare
  const handleAdoptClick = () => {
    setChoice('adopt');
  };

  // Quando l'utente sceglie di portarlo all'enpa
  const handleRejectClick = () => {
    const stored = localStorage.getItem('personaggio');
    if (stored) {
      const personaggio = JSON.parse(stored);
      // Segna l'evento come risolto senza adozione
      personaggio.gattoAdottato = false;
      localStorage.setItem('personaggio', JSON.stringify(personaggio));
    }
    onClose();
  };

  // Quando l'utente conferma l'adozione inserendo il nome del gatto
  const handleSubmit = () => {
    if (!catName.trim()) {
      alert('Inserisci un nome per il gatto.');
      return;
    }
    const stored = localStorage.getItem('personaggio');
    if (stored) {
      const personaggio = JSON.parse(stored);
      personaggio.gattoAdottato = true;
      personaggio.gattoNome = catName;
      // Inizializza la nuova statistica per l'affinità con il pet (es. 0)
      personaggio.affinita_pet = personaggio.affinita_pet || 0;
      localStorage.setItem('personaggio', JSON.stringify(personaggio));
    }
    onClose();
  };

  return (
    <div className="unique-event-lightbox">
      <div className="unique-event-content">
      <img src="src/assets/narratives/gatto_abbandonato.png" alt="Girl in a jacket" width="400" height="auto"></img>
        <h2>Evento Unico: Gatto Abbandonato</h2>
        <p>
          Mentre ti prepari per andare a scuola, senti un miagolio disperato provenire da un cassonetto. Ti avvicini e scopri un cartone con dentro un gatto abbandonato. Cosa decidi di fare?
        </p>
        {choice === null && (
          <div className="options">
            <button className="btn btn-danger" onClick={handleRejectClick}>
              Portarlo all'enpa
            </button>
            <button className="btn btn-success" onClick={handleAdoptClick}>
              Adottarlo
            </button>
          </div>
        )}
        {choice === 'adopt' && (
          <div className="adoption-form">
            <p>Inserisci il nome del gatto:</p>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Nome del gatto"
            />
            <button className="btn btn-success mt-2" onClick={handleSubmit}>
              Conferma Adozione
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniqueEventGatto;
