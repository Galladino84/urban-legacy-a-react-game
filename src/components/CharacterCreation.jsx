import React, { useState } from "react";

// Funzione per calcolare le statistiche iniziali
const calcolaStatisticheIniziali = (percorso, sesso) => {
  const baseStats = {
    Tabboz: { status: 3, intelligenza: 4, carisma: 7, stamina: 8, soldi: 50 },
    Goth: { status: 2, intelligenza: 6, carisma: 6, stamina: 5, soldi: 40 },
    Metallaro: { status: 3, intelligenza: 5, carisma: 5, stamina: 7, soldi: 45 },
    Nerd: { status: 1, intelligenza: 9, carisma: 4, stamina: 4, soldi: 30 },
  };

  const stats = { ...baseStats[percorso] };

  // Applica i bonus in base al sesso
  const bonus = {
    Tabboz: sesso === "Maschio" ? { stamina: +1, soldi: +5 } : { carisma: +1, soldi: -5 },
    Goth: sesso === "Maschio" ? { intelligenza: +1, carisma: -1 } : { carisma: +1, stamina: -1 },
    Metallaro: sesso === "Maschio" ? { stamina: +1, intelligenza: -1 } : { carisma: +1, stamina: -1 },
    Nerd: sesso === "Maschio" ? { intelligenza: +1, soldi: -5 } : { carisma: +1, soldi: -5 },
  };

  Object.entries(bonus[percorso]).forEach(([stat, value]) => {
    stats[stat] += value;
  });

  return stats;
};

function CharacterCreation() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [sesso, setSesso] = useState("");
  const [percorso, setPercorso] = useState(""); // Percorso obbligatorio
  const [orientamento, setOrientamento] = useState("Etero");
  const [famiglia, setFamiglia] = useState({ mamma: false, papà: false, sorella: false, fratello: false });
  const [nomiFamiliari, setNomiFamiliari] = useState({ mamma: "", papà: "", sorella: "", fratello: "" });
  const [errorMessage, setErrorMessage] = useState(""); // Gestione errori

  const handleFamigliaChange = (e) => {
    const { name, checked } = e.target;
    setFamiglia((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNomeFamigliaChange = (e) => {
    const { name, value } = e.target;
    setNomiFamiliari((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // ✅ Controllo percorso obbligatorio
    if (!percorso) {
      setErrorMessage("⚠️ Devi scegliere un percorso prima di creare il personaggio.");
      return;
    }

    // ✅ Controllo almeno un membro della famiglia obbligatorio
    const haAlmenoUnMembro = Object.values(famiglia).some((val) => val);
    if (!haAlmenoUnMembro) {
      setErrorMessage("⚠️ Devi selezionare almeno un membro della famiglia.");
      return;
    }

    const statistiche = calcolaStatisticheIniziali(percorso, sesso);

    const personaggio = {
      nome,
      cognome,
      sesso,
      percorso,
      orientamento,
      statistiche, // statistiche correnti
      initialStatistiche: { ...statistiche }, // salvataggio dei valori iniziali per il ripristino
      famiglia: {
        mamma: famiglia.mamma ? `${nomiFamiliari.mamma} ${cognome}` : null,
        papà: famiglia.papà ? `${nomiFamiliari.papà} ${cognome}` : null,
        sorella: famiglia.sorella ? `${nomiFamiliari.sorella} ${cognome}` : null,
        fratello: famiglia.fratello ? `${nomiFamiliari.fratello} ${cognome}` : null,
      },
    };

    // ✅ Reset degli eventi unici completati
    console.log("Eventi unici prima del reset:", localStorage.getItem("uniqueEventsCompleted"));
    localStorage.removeItem("uniqueEventsCompleted");
    console.log("Eventi unici dopo il reset:", localStorage.getItem("uniqueEventsCompleted"));

    // ✅ Check per avvio automatico evento unico "Norasmoke"
    if (
      nome.trim().toLowerCase() === "norasmoke" &&
      cognome.trim().toLowerCase() === "norasmoke" &&
      percorso === "Goth" &&
      sesso === "Femmina"
    ) {
      console.log("🔮 Norasmoke riconosciuta! Setto giorno 7, fase 1 (risveglio)");
      localStorage.setItem("giorno", "7");
      localStorage.setItem("fase", "risveglio");
    } else {
      localStorage.setItem("giorno", "1");
      localStorage.setItem("fase", "0");
    }

    console.log("✅ Personaggio creato:", personaggio);
    localStorage.setItem("personaggio", JSON.stringify(personaggio));
    window.location.href = "/game";
  };

  return (
    <div className="container mt-4">
      <h2>Creazione del Personaggio</h2>
      
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Cognome</label>
          <input type="text" className="form-control" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Sesso</label>
          <div>
            <label>
              <input type="radio" name="sesso" value="Maschio" onChange={(e) => setSesso(e.target.value)} required /> Maschio
            </label>
            <label className="ms-3">
              <input type="radio" name="sesso" value="Femmina" onChange={(e) => setSesso(e.target.value)} /> Femmina
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label>Percorso</label>
          <select className="form-select" value={percorso} onChange={(e) => setPercorso(e.target.value)} required>
            <option value="">-- Seleziona un percorso --</option>
            <option value="Tabboz">Tabboz</option>
            <option value="Goth">Goth</option>
            <option value="Metallaro">Metallaro</option>
            <option value="Nerd">Nerd</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Composizione Familiare</label>
          {["mamma", "papà", "sorella", "fratello"].map((fam) => (
            <div className="form-check" key={fam}>
              <input
                className="form-check-input"
                type="checkbox"
                name={fam}
                checked={famiglia[fam]}
                onChange={handleFamigliaChange}
              />
              <label className="form-check-label">{fam.charAt(0).toUpperCase() + fam.slice(1)}</label>
              {famiglia[fam] && (
                <input
                  type="text"
                  name={fam}
                  placeholder={`Nome del/la ${fam}`}
                  className="form-control mt-2"
                  value={nomiFamiliari[fam]}
                  onChange={handleNomeFamigliaChange}
                  required
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary">Crea Personaggio</button>
      </form>
    </div>
  );
}

export default CharacterCreation;
