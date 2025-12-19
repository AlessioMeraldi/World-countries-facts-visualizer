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
        <div className={CountryInformationStyle.sidebar}>
            <h2 className={CountryInformationStyle.title}>Country Information</h2>

            <div className={CountryInformationStyle.searchContainer}>
                <input
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    placeholder="Enter country name..."
                    className={CountryInformationStyle.input}
                    // Aggiungo questo per UX: premere invio per cercare
                    onKeyDown={(e) => e.key === 'Enter' && searchCountry()}
                />

                <button
                    onClick={searchCountry}
                    disabled={loading}
                    className={CountryInformationStyle.button}
                    title="Search"
                >
                    {/* Se hai un'icona SVG mettila qui, altrimenti emoji */}
                    {loading ? "..." : "🔍"}
                </button>
            </div>

            {error && <div className={CountryInformationStyle.error}>{error}</div>}

            {countryData && (
                <div className={CountryInformationStyle.detailsContainer}>

                    <img
                        src={countryData.flag}
                        alt="flag"
                        className={CountryInformationStyle.flag}
                    />

                    <h3 className={CountryInformationStyle.countryName}>
                        {countryData.name}
                        <span className={CountryInformationStyle.countryCode}>{countryData.code}</span>
                    </h3>

                    {/* Info Rows */}
                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Capital</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.capital}</span>
                    </div>

                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Region</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.region}</span>
                    </div>

                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Population</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.population.toLocaleString()}</span>
                    </div>

                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Timezone</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.timezone}</span>
                    </div>

                    { /* <hr className={CountryInformationStyle.divider} /> */ }

                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Currency</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.currencies}</span>
                    </div>

                    <div className={CountryInformationStyle.infoRow}>
                        <span className={CountryInformationStyle.infoLabel}>Car Sign</span>
                        <span className={CountryInformationStyle.infoValue}>{countryData.carSign}</span>
                    </div>

                </div>
            )}
        </div>
    );
}

export default CountryInformation;
