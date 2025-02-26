// src/components/SchoolExam.jsx
import React, { useEffect, useState } from "react";

const questions = [
  {
    question: "Domanda 1: Qual è la capitale d'Italia?",
    options: ["Roma", "Milano", "Napoli"],
    correct: "Roma"
  },
  {
    question: "Domanda 2: Quanto fa 2+2?",
    options: ["3", "4", "5"],
    correct: "4"
  },
  {
    question: "Domanda 3: Chi ha scritto 'La Divina Commedia'?",
    options: ["Dante", "Petrarca", "Boccaccio"],
    correct: "Dante"
  }
];

const SchoolExam = ({ onExamFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(1); // 1 punto base
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer(null); // Tempo scaduto: risulta errata
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    if (answer === question.correct) {
      setScore(prev => {
        const newScore = prev + 3;
        console.log(`Risposta corretta per domanda ${currentQuestion + 1}: nuovo punteggio ${newScore}`);
        return newScore;
      });
    } else {
      console.log(`Risposta sbagliata per domanda ${currentQuestion + 1}`);
    }
    setSelectedAnswer(answer);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        console.log("Verifica completata, punteggio finale:", score);
        onExamFinish(score);
      }
    }, 1000);
  };

  return (
    <div className="container mt-4">
      <h2>Verifica Scolastica</h2>
      <p>Tempo rimanente: {timeLeft} secondi</p>
      <div>
        <p>{questions[currentQuestion].question}</p>
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className="btn btn-outline-primary m-2"
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      <p>Punteggio attuale: {score}</p>
    </div>
  );
};

export default SchoolExam;
