import React from "react";
import CountryInformationStyle from "./CountryInformation.module.css";

function CountryInformation( {viewModel}) {

    const {
        countryName,
        countryData,
        error,
        loading,
        setCountryName,
        searchCountry,
    } = viewModel;

    return (
        <div>
            <h2>Country Information</h2>

            <input
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                placeholder="Enter country name"
                className={CountryInformationStyle.input}
            />

            <button onClick={searchCountry} disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p className={CountryInformationStyle.error}>{error}</p>}

            {countryData && (
                <div className={CountryInformationStyle.container}>

                    <img src={countryData.flag} alt="flag" width="120" style={{border: "1px solid #ccc", marginBottom: "1rem"}}/>

                    <h3>{countryData.name} <small>({countryData.code})</small></h3>

                    <p><strong>Capital:</strong> {countryData.capital}</p>
                    <p><strong>Region:</strong> {countryData.region}</p>
                    <p><strong>Population:</strong> {countryData.population.toLocaleString()}</p>
                    <p><strong>Timezone:</strong> {countryData.timezone}</p>
                    <hr />
                    <p><strong>Currency:</strong> {countryData.currencies}</p>
                    <p><strong>Car Sign:</strong> {countryData.carSign}</p>

                </div>
            )}
        </div>
    );
}

export default CountryInformation;
