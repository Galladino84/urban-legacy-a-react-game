import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CharacterCreation from "./components/CharacterCreation";
import GameMainScreen from "./components/GameMainScreen";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterCreation />} />
        <Route path="/game" element={<GameMainScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
