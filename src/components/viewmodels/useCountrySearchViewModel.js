import { useState } from "react";
import { fetchCountryByName } from "../models/countryModel";

function useCountrySearchViewModel() {

    const [countryName, setCountryName] = useState("");
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function searchCountry() {

        setError("");
        setCountryData(null);

        if (!countryName.trim()) {
            setError("Please enter a valid country name.");
            return;
        }

        setLoading(true);

        try {
            const data = await fetchCountryByName(countryName);
            const country = data[0];

            const normalized = {
                name: country.name?.common,  // always show English name
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

    return {
        countryName,
        countryData,
        error,
        loading,
        setCountryName,
        searchCountry,
    };
}

export default useCountrySearchViewModel;