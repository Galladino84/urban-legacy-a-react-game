import React from "react";
import CharacterCreation from "./components/CharacterCreation";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";


function App() {
  return (
    <div className="d-flex">
      <SidebarLeft />
      <main className="main-content">
        <CharacterCreation />
      </main>
      <SidebarRight />
    </div>
  );
}

export default App;
