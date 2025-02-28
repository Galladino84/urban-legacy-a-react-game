import { useEffect, useState } from "react";
import verifiche from "../data/calendario_verifiche.json";
import VerificaLightbox from "./VerificaLightbox";
import domandeItaliano from "../data/domande_italiano.json";
// IMPORTA ALTRI JSON QUANDO AGGIUNGIAMO ALTRE MATERIE

function VerificationManager({ currentDay, onComplete }) {
  const [isVerificaDay, setIsVerificaDay] = useState(false);
  const [materiaVerifica, setMateriaVerifica] = useState(null);
  const [domande, setDomande] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Controlliamo se oggi è giorno di verifica
    const verificaOggi = verifiche.find((v) => v.giorno === currentDay);
    if (verificaOggi) {
      setIsVerificaDay(true);
      setMateriaVerifica(verificaOggi.materia);
      
      // Carichiamo le domande in base alla materia
      switch (verificaOggi.materia.toLowerCase()) {
        case "italiano":
          setDomande(getRandomQuestions(domandeItaliano.domande, 3));
          break;
        // Aggiungi altri case per altre materie quando li abbiamo
        default:
          setDomande([]);
      }
    }
  }, [currentDay]);

  const getRandomQuestions = (array, num) => {
    let shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const startQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <>
      {isVerificaDay && showQuiz && (
        <VerificaLightbox 
          materia={materiaVerifica} 
          domande={domande} 
          onComplete={onComplete} 
        />
      )}
      {isVerificaDay && !showQuiz && (
        <button className="btn btn-warning" onClick={startQuiz}>
          Oggi c'è una verifica di {materiaVerifica}! Inizia il test
        </button>
      )}
    </>
  );
}

export default VerificationManager;
