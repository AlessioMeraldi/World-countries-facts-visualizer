import React from "react";
import WorldMapStyle from "./WorldExplorer.module.css";
import { getMapNameFromAPIName, getAPINameFromMapName } from "/src/utilities/countryMapping.js";

/* import ViewModels */
import useCountrySearchViewModel from "/src/components/viewmodels/useCountrySearchViewModel";
import useWorldMapViewModel from "/src/components/viewmodels/useWorldMapViewModel";

/* import Views */
import WorldMap from "/src/components/views/WorldMap";
import CountryInformation from "/src/components/views/CountryInformation";

/* Begin logic */
function WorldExplorer() {

    /* = Instantiate the two ViewModels = */
    const mapVM = useWorldMapViewModel(960, 500);
    const countryVM = useCountrySearchViewModel();

    /* both viewModels use a function / method from one another, so we can only link them afterwards by using an effect (otherwise, one casts an error 'undefined') */

    /* useEffect on mapVM: to make a map click fetch a Country: */
    //React.useEffect(() => {

       // if (mapVM.selectedCountryName) {
        //    const normalizedMapName = normalizeCountryName(mapVM.selectedCountryName);
         //   const normalizedAPIName = normalizeCountryName(countryVM.countryData?.name);

           // if (normalizedAPIName !== normalizedMapName) {
          //      countryVM.loadCountry(mapVM.selectedCountryName);
          //  }
      //  }
    //}, [mapVM.selectedCountryName]);

    /* useEffect on countryVM: to make the searching of a country (through the searchbar) select the country on the map aswell */
  //  React.useEffect(() => {
        // Se abbiamo trovato dati di un paese...
   //     if (countryVM.countryData?.name) {
            // ...e se la mappa non lo ha già selezionato
    //        if (mapVM.selectedCountryName !== countryVM.countryData.name) {
         //       mapVM.selectCountryFromOutside(countryVM.countryData.name);
       //     }
    //    }
  //  }, [countryVM.countryData]);

    /* EFFETTO 1: Click Mappa -> Carica Dati (AGGIORNATO) */
    React.useEffect(() => {
        if (mapVM.selectedCountryName) {

            // 1. Il nome grezzo dalla mappa (es. "England" o "USA")
            const rawMapName = mapVM.selectedCountryName;

            // 2. TRADUZIONE: "England" -> "United Kingdom" (o "USA" -> "United States")
            // Questo è il nome che useremo per interrogare l'API
            const nameToFetch = getAPINameFromMapName(rawMapName);

            // 3. Controllo anti-loop:
            // Confrontiamo il nome che vogliamo cercare con il nome che l'API ha già in pancia.
            // Nota: countryVM.countryData.name è solitamente il nome "Common" dell'API (es. "United Kingdom")
            if (countryVM.countryData?.name !== nameToFetch) {
                console.log(`Map Clicked '${rawMapName}'. Fetching API for '${nameToFetch}'`);
                countryVM.loadCountry(nameToFetch);
            }
        }
    }, [mapVM.selectedCountryName]);

    /* EFFETTO 2: Dati API -> Colora Mappa (INVARIATO, ma ora gestisce UK -> England) */
    React.useEffect(() => {
        if (countryVM.countryData?.name) {

            const apiName = countryVM.countryData.name; // Es: "United Kingdom"

            // TRADUZIONE: "United Kingdom" -> "England" (perché la mappa ha quel poligono)
            const nameTargetForMap = getMapNameFromAPIName(apiName);

            if (mapVM.selectedCountryName !== nameTargetForMap) {
                mapVM.selectCountryFromOutside(nameTargetForMap);
            }
        }
    }, [countryVM.countryData]);

    // viewModel to get worldMapView related methods (data taken from mapMode.js)
    //const mapVM = useWorldMapViewModel(
    //    960, // map size parameter (width)
    //    500, // map size parameter (height)
    //    countryVM.loadCountry  // map-click → fetch country
    //);

    // viewModel to get Country-Data related methods (data taken from countryModel.js)
    // const countryVM = useCountrySearchViewModel(
    //    (name) => mapVM.selectCountryFromOutside(name) /* the 'useCountrySearchViwModel' must use the selectCountryFromOutside method of the useWorldMapViewModel to communicate that a country has been "clicked" when in reality it has been searched through the searchbar */
    // );

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