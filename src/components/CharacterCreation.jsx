import React, { useState } from "react";

function CharacterCreation() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    sesso: "maschio",
    percorso: "Tabboz",
    orientamento: "etero",
    famiglia: { mamma: true, sorella: true }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFamilyChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      famiglia: { ...prev.famiglia, [name]: checked }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati personaggio:", formData);
    // Salveremo in LocalStorage o passeremo alla prossima schermata
  };

  return (
    <div className="container mt-4">
      <h2>Creazione del Personaggio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sesso</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="sesso"
              value="maschio"
              checked={formData.sesso === "maschio"}
              onChange={handleChange}
              id="sessoMaschio"
            />
            <label className="form-check-label" htmlFor="sessoMaschio">
              Maschio
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="sesso"
              value="femmina"
              checked={formData.sesso === "femmina"}
              onChange={handleChange}
              id="sessoFemmina"
            />
            <label className="form-check-label" htmlFor="sessoFemmina">
              Femmina
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Percorso</label>
          <select
            className="form-select"
            name="percorso"
            value={formData.percorso}
            onChange={handleChange}
          >
            <option value="Tabboz">Tabboz</option>
            <option value="Goth">Goth</option>
            <option value="Metallaro">Metallaro</option>
            <option value="Nerd">Nerd</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Orientamento Sessuale</label>
          <select
            className="form-select"
            name="orientamento"
            value={formData.orientamento}
            onChange={handleChange}
          >
            <option value="etero">Etero</option>
            <option value="omo">Omosessuale</option>
            <option value="bi">Bisessuale</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Composizione Familiare</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="mamma"
              checked={formData.famiglia.mamma}
              onChange={handleFamilyChange}
              id="famigliaMamma"
            />
            <label className="form-check-label" htmlFor="famigliaMamma">
              Mamma
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="sorella"
              checked={formData.famiglia.sorella}
              onChange={handleFamilyChange}
              id="famigliaSorella"
            />
            <label className="form-check-label" htmlFor="famigliaSorella">
              Sorella
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Crea Personaggio
        </button>
      </form>
    </div>
  );
}

export default CharacterCreation;
