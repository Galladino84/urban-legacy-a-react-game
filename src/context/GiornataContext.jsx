import React, { createContext, useState, useEffect } from "react";
import giornataData from "../data/giornata.json";

export const GiornataContext = createContext();

export const GiornataProvider = ({ children }) => {
  const [giornoCorrente, setGiornoCorrente] = useState(giornataData.giorno_corrente);
  const [faseCorrente, setFaseCorrente] = useState(giornataData.fase_corrente);
  const [dataAttuale, setDataAttuale] = useState(new Date(giornataData.data_inizio));

  const fasi = giornataData.fasi_giornata;

  useEffect(() => {
    localStorage.setItem("giornata", JSON.stringify({ giornoCorrente, faseCorrente, dataAttuale }));
  }, [giornoCorrente, faseCorrente, dataAttuale]);

  const avanzamentoFase = () => {
    const indiceFase = fasi.indexOf(faseCorrente);

    if (indiceFase < fasi.length - 1) {
      setFaseCorrente(fasi[indiceFase + 1]);
    } else {
      setFaseCorrente(fasi[0]);
      setGiornoCorrente(prev => prev + 1);
      setDataAttuale(prev => new Date(prev.setDate(prev.getDate() + 1)));
    }
  };

  return (
    <GiornataContext.Provider value={{ giornoCorrente, faseCorrente, dataAttuale, avanzamentoFase }}>
      {children}
    </GiornataContext.Provider>
  );
};