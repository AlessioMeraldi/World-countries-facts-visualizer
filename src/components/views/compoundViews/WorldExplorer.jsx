import React from "react";
import WorldExplorerStyle from "./WorldExplorer.module.css";

/* import API-name to MAP-name conversion utility function */
import { getMapNameFromAPIName, getAPINameFromMapName } from "/src/utilities/countryMapping.js";

/* import ViewModels */
import useCountrySearchViewModel from "/src/components/viewmodels/useCountrySearchViewModel";
import useWorldMapViewModel from "/src/components/viewmodels/useWorldMapViewModel";
import useGeminiViewModel from "/src/components/viewmodels/geminiViewModel";

/* import Views */
import WorldMap from "/src/components/views/WorldMap";
import CountryInformation from "/src/components/views/CountryInformation";
import GeminiView from "/src/components/views/GeminiView";


/* Begin logic */
function WorldExplorer() {

    /* = Instantiate the two ViewModels = */
    const mapVM = useWorldMapViewModel(960, 500);
    const countryVM = useCountrySearchViewModel();

    /* 3. Istanziamo il Gemini VM.
       Gli passiamo "countryVM.countryData?.name" come stato reattivo.
       In questo modo, ogni volta che countryVM aggiorna i dati del paese,
       geminiVM riceve il nuovo nome e resetta la chat o si prepara.
    */
    const geminiVM = useGeminiViewModel(countryVM.countryData?.name);

    /* both viewModels use a function / method from one another, so we can only link them afterward by using an effect (otherwise, one casts an error 'undefined') */

    /* useEffect on mapVM: to make a map click fetch a Country: */
    React.useEffect(() => {

        if (mapVM.selectedCountryName) { // if state 'selectedCountryName' in the map ViewModel is truthy (here, intended as 'not null')

            const rawMapName = mapVM.selectedCountryName; // get the country name from the map's ViewModel (= the name the map gives to the country)
            const nameToFetch = getAPINameFromMapName(rawMapName); // convert the name from the map's ViewModel to the name used in the REST Countries API (note: countryMapping.js will return the same name if it's the same)

            // anti-loop check
            if (countryVM.countryData?.name !== nameToFetch) { // if (previous countryData?.name's value (obtained from the REST Countries API) is different from the nameTheFetch
                // then fetch the name
                console.log(`Map Clicked '${rawMapName}'. Fetching API for '${nameToFetch}'`);
                countryVM.loadCountry(nameToFetch);
            }
            // Note: if this wasn't checked then the updating of the map would cause the interrogation from the API, which would cause the updating of the map, which would cause the interrogation of the API (generating an infinite loop)
        }

        /* toDo: segnarsi come esempio che qui sotto si sta facendo una cosa sporca che romperebbe le regole di React */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapVM.selectedCountryName]);

    /* useEffect on countryVM: to make the searching of a country (through the searchbar) select the country on the map as well */
    React.useEffect(() => {

        if (countryVM.countryData?.name) {

            const apiName = countryVM.countryData.name; // get the country's name from the REST Country's API's <interrogator viewmodel> (aka, the name it has in the REST Country's API)
            const nameTargetForMap = getMapNameFromAPIName(apiName); // convert the name from the REST API's ViewModel to the name used on the MAP (note: countryMapping.js will return the same name if it's the same)

            // anti-loop check
            if (mapVM.selectedCountryName !== nameTargetForMap) {
                mapVM.selectCountryFromOutside(nameTargetForMap); // highlight corresponding country on the map (when search is started from searchbar)
            }
        }

        /* toDo: segnarsi come esempio che qui sotto si sta facendo una cosa sporca che romperebbe le regole di React */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryVM.countryData]);

    return (
        <div className={WorldExplorerStyle.worldExplorer}>

            {/* Colonna Sinistra: Dettagli Paese */}
            <div className={WorldExplorerStyle.informationPanel}>
                <CountryInformation viewModel={countryVM} />
            </div>

            {/* Colonna Centrale: Mappa */}
            <div className={WorldExplorerStyle.mapPanel}>
                <WorldMap viewModel={mapVM} />
            </div>

            {/* Colonna Destra: Chat Gemini (Nuova) */}
            <div className={WorldExplorerStyle.geminiPanel}>
                <GeminiView viewModel={geminiVM} />
            </div>

        </div>
    );
}

export default WorldExplorer;