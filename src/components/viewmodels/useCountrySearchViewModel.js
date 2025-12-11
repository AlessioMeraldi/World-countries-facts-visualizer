import { useState } from "react";
import { fetchCountryByName } from "../models/countryModel";

function useCountrySearchViewModel() {

    const [countryName, setCountryName] = useState("");
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function performSearch(nameToSearch) {

        setError("");
        setCountryData(null);

        if (!nameToSearch.trim()) {
            setError("Please enter a valid country name.");
            return;
        }

        setLoading(true);

        try {
            const data = await fetchCountryByName(nameToSearch);
            const country = data[0];

            const normalized = {
                name: country.name?.common,
                capital: country.capital?.[0],
                region: country.region,
                population: country.population,
                flag: country.flags?.png
            };

            setCountryData(normalized);

        } catch (err) {
            setError(err.message || "Unknown error.");
        } finally {
            setLoading(false);
        }
    }

    async function searchCountry() {
        await performSearch(countryName);
    }

    async function loadCountry(name) {
        await performSearch(name);
    }

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