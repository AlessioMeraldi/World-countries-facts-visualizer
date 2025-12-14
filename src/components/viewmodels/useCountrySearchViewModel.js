import { useState } from "react";
import { fetchCountryByName } from "../models/countryModel";

function useCountrySearchViewModel(onCountryFound) {

    const [countryName, setCountryName] = useState("");
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* fetch the data given a country name */
    async function performSearch(nameToSearch, shouldUpdateMap) {

        setError("");
        setCountryData(null);

        if (!nameToSearch.trim()) {
            setError("Please enter a valid country name.");
            return;
        }

        setLoading(true);

        try {
            const data = await fetchCountryByName(nameToSearch); /* request data of (nameToSearch) from API through countryModel.js */
            const country = data[0]; /* reminder: data is returned in an array for each matching country (ex: British Indian Territory and India are both returned from searching "India") */

            /* Terrible syntax to extract data from the REST Country API response, but this is the syntax it has */
            const normalized = {
                name: country.name?.common,
                capital: country.capital?.[0],
                region: country.region,
                population: country.population,
                flag: country.flags?.png
            };

            // set State for countryData with processed information
            setCountryData(normalized);
            // if a country was found, use the callback "onCountrFound" to pass its name to the map's viewModel so it may know that it has been "selected" (through a search) toDo: update comment
            if (onCountryFound && shouldUpdateMap) {
                onCountryFound(normalized.name);
            }

            // if a country was found, use the callback "onCountrFound" to pass its name to the map's viewModel so it may know that it has been "selected" (through a search)
            //if (onCountryFound) {
            //    onCountryFound(normalized.name); /* sends data to useWorldMapViewModel */
            //}

        } catch (err) {

            // countryModel.js already handles failed requests - this is another check in case something went wrong afterwards
            setError(err.message || "Unknown error.");

        } finally { // regardless of success or failure ...

            // end "loading" state
            setLoading(false);
        }
    }

    /* invoked by searching for a country IN THE SEARCHBAR */
    async function searchCountry() {
        await performSearch(countryName, true); /* toDo: update comments */
        setCountryName(""); /* clears input field after having fetched the country */
    }

    /* invoked by searching for a country ON THE MAP (by clicking) */
    async function loadCountry(name) {
        await performSearch(name, false); /* toDo: update comments */
        setCountryName(""); /* clears input field after having fetched the country */
    }
    // same functionality at the end of the day, but keeps logic useCountrySearchViewModel and useWorldMapViewModel separated

    return {
        countryName,
        countryData,
        error,
        loading,
        setCountryName,
        searchCountry,
        loadCountry
    };
}

export default useCountrySearchViewModel;