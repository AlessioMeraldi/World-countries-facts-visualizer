import React from "react";

/* import ViewModels */
import useCountrySearchViewModel from "/src/components/viewmodels/useCountrySearchViewModel";
import useWorldMapViewModel from "/src/components/viewmodels/useWorldMapViewModel";

/* import Views */
import WorldMap from "/src/components/views/WorldMap";
import CountryInformation from "/src/components/views/CountryInformation";

/* Begin logic */
function WorldExplorer() {

    // Instantiate the two ViewModels
    const countryVM = useCountrySearchViewModel();

    const mapVM = useWorldMapViewModel(
        960,
        500,
        countryVM.loadCountry  // <-- orchestrazione: click sulla mappa → fetch paese
    );

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <WorldMap viewModel={mapVM} />
            <CountryInformation viewModel={countryVM} />
        </div>
    );
}

export default WorldExplorer;