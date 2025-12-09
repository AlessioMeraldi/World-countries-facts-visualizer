import React from "react";
import './App.css';
import CountryInformation from "./components/views/CountryInformation.jsx";
import WorldMap from "./components/views/WorldMap.jsx";

function App() {

  return (
    <React.Fragment>
        <CountryInformation/>
        <WorldMap/>
    </React.Fragment>
  )
}

export default App
