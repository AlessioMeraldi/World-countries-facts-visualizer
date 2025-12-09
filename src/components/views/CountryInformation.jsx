import React from "react";
import useCountrySearchViewModel from "../viewmodels/useCountrySearchViewModel.js";

function CountryInformation() {

    const {
        countryName,
        countryData,
        error,
        loading,
        setCountryName,
        searchCountry,
    } = useCountrySearchViewModel();

    return (
        <div>
            <h2>Country Information</h2>

            <input
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                placeholder="Enter country name"
            />

            <button onClick={searchCountry} disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {countryData && (
                <div>
                    <h3>{countryData.name}</h3>
                    <p>Capital: {countryData.capital}</p>
                    <p>Region: {countryData.region}</p>
                    <p>Population: {countryData.population}</p>
                    <img src={countryData.flag} alt="flag" width="120" />
                </div>
            )}
        </div>
    );
}

export default CountryInformation;
