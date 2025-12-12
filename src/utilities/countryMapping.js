
/*
// Mappa: Nome che arriva dall'API (REST Countries) -> Nome che vuole la Mappa (D3 GeoJSON)
const apiToMapMap = {
    "United States" : "USA",

    "United Kingdom": "England",
    "Scotland": "England",
    "Wales": "England",
    "Northern Ireland": "England",

};

// Funzione per ottenere il nome compatibile con la Mappa partendo dal nome API
export const getMapNameFromAPIName = (apiName) => {
    return apiToMapMap[apiName] || apiName;
};

*/

/* src/utilities/countryMapping.js */

// 1. MAPPA -> API (Quando clicchi sulla mappa)
// Se clicco su una qualsiasi di queste regioni, devo cercare "United Kingdom" nell'API
const mapToApiMap = {
    "England": "United Kingdom",
    "Scotland": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom", // A volte nel GeoJSON è "N. Ireland"
    "USA": "United States"
};

// 2. API -> MAPPA (Quando cerchi dalla searchbar)
// L'API mi da "United Kingdom". La mappa non ha un poligono chiamato "United Kingdom".
// Dobbiamo scegliere un "rappresentante" da colorare. Solitamente si sceglie "England"
// perché è la parte più grande, oppure dovresti modificare la logica per colorare una lista.
// Per ora, puntiamo a England per semplicità.
const apiToMapMap = {
    "United States": "USA",
    "United Kingdom": "England", // Compromesso: illumina l'Inghilterra quando cerchi UK
    "Korea (Republic of)": "South Korea",
    "Democratic People's Republic of Korea": "North Korea"
};

export const getAPINameFromMapName = (mapName) => {
    return mapToApiMap[mapName] || mapName;
};

export const getMapNameFromAPIName = (apiName) => {
    return apiToMapMap[apiName] || apiName;
};