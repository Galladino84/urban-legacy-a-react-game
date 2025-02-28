import React, { useState, useEffect } from "react";

function VerificaLightbox({ materia, domande, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(1); // 1 punto per la presenza
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else {
        handleAnswer(null); // Se scade il tempo, la risposta è errata
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === domande[currentQuestionIndex].corretta) {
      setScore((prev) => prev + 3); // 3 punti per risposta corretta
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < domande.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(20);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = () => {
    const valutazioni = JSON.parse(localStorage.getItem("valutazioni")) || {};
    if (!valutazioni[materia]) valutazioni[materia] = [];
    valutazioni[materia].push(score);
    localStorage.setItem("valutazioni", JSON.stringify(valutazioni));

    setQuizCompleted(true);
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="verifica-lightbox">
      {!quizCompleted ? (
        <>
          <h3>Verifica di {materia}</h3>
          <p><strong>Domanda {currentQuestionIndex + 1}/{domande.length}:</strong></p>
          <p>{domande[currentQuestionIndex].domanda}</p>
          <p>Tempo rimasto: {timeLeft} secondi</p>

          <div className="options">
            {domande[currentQuestionIndex].opzioni.map((option, index) => (
              <button
                key={index}
                className={`btn ${showFeedback ? (option === domande[currentQuestionIndex].corretta ? "btn-success" : "btn-danger") : "btn-outline-primary"}`}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <p className={selectedAnswer === domande[currentQuestionIndex].corretta ? "text-success" : "text-danger"}>
              {selectedAnswer === domande[currentQuestionIndex].corretta ? "Risposta corretta!" : `Risposta errata. Quella giusta era: ${domande[currentQuestionIndex].corretta}`}
            </p>
          )}
        </>
      ) : (
        <div>
          <h3>Verifica completata!</h3>
          <p>Punteggio totale: {score}</p>
        </div>
      )}
    </div>
  );
}

export default VerificaLightbox;
