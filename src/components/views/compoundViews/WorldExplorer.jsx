import React from "react";
import WorldMapStyle from "./WorldExplorer.module.css";

/* import ViewModels */
import useCountrySearchViewModel from "/src/components/viewmodels/useCountrySearchViewModel";
import useWorldMapViewModel from "/src/components/viewmodels/useWorldMapViewModel";

/* import Views */
import WorldMap from "/src/components/views/WorldMap";
import CountryInformation from "/src/components/views/CountryInformation";

/* Begin logic */
function WorldExplorer() {

    /* = Instantiate the two ViewModels = */

    // viewModel to get Country-Data related methods (data taken from countryModel.js)
    const countryVM = useCountrySearchViewModel();

    // viewModel to get worldMapView related methods (data taken from mapMode.js)
    const mapVM = useWorldMapViewModel(
        960, // map size parameter (width)
        500, // map size parameter (height)
        countryVM.loadCountry  // map-click → fetch country
    );

    return (
        <div className={WorldMapStyle.worldExplorer}>
            <div className={WorldMapStyle.informationPanel}>
                <CountryInformation viewModel={countryVM} />
            </div>

            <div className={WorldMapStyle.mapPanel}>
                <WorldMap viewModel={mapVM} />
            </div>
        </div>
    );
}

export default WorldExplorer;