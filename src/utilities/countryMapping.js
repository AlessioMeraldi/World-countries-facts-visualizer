// 1. MAPPA -> API (Quando clicchi sulla mappa)
// Se clicco su una qualsiasi di queste regioni, devo cercare "United Kingdom" nell'API

/* This file aims to solve the problem that REST Countries API and the D3 map with GeoJSON data don't have matching names for the countries */
/* it contains the equivalences <Country's name on the Map <-> Country's name in the REST Countries API> */

/* Conversions <Country's name on the Map -> Country's name in the REST Countries API> (for when the search is initiated by clicking the map) */
// needed to ensure that the clicked country gets the
const mapToApiMap = {

    /* Americas */
    "USA": "United States",

    /* Africa */
    "Democratic Republic of the Congo": "DR Congo",
    "Somaliland" : "Somalia", /* toDo: unify look of Somaliland and Somalia (as Somaliland is not officially recognized yet) */
    "Guinea Bissau" : "Guinea-Bissau",

    /* European continent and affiliated */
    "England": "United Kingdom",
    "Scotland": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom",
    "Republic of Serbia": "Serbia",
    "Czech Republic" : "Czechia",

    /* Asia */

    /* Oceania */

    /* Middle East */
    "West Bank": "Palestine"
};

/* Conversions <Country's name in the REST Countries API -> Country's name on the map> (for when search is initiated through searchbar) */
const apiToMapMap = {

    /* Americas */
    "United States": "USA",
    "Bahamas": "The Bahamas",

    /* Africa */
    "DR Congo": "Democratic Republic of the Congo",
    "Eswatini": "Swaziland",
    "Tanzania": "United Republic of Tanzania",
    "Guinea-Bissau" : "Guinea Bissau",

    /* European continent and affiliated */
    "United Kingdom": "England", /* Scotland, Wales and Norther Ireland are just showcased as the UK*/
    "North Macedonia" : "Macedonia",
    "Serbia": "Republic of Serbia",
    "Czechia" : "Czech Republic",

    /* Asia */
    "Democratic People's Republic of Korea": "North Korea",

    /* Oceania */

    /* Middle East */
    "Palestine" : "West Bank",
};

/* method to return the corresponding API name of a Country given the map name for it */
export const getAPINameFromMapName = (mapName) => {
    return (mapToApiMap[mapName] || mapName); // returns the converted name if present, or the original name if there was not a corresponding one
};

/* method to return the corresponding map name of a Country given the API's name for it */
export const getMapNameFromAPIName = (apiName) => {
    return (apiToMapMap[apiName] || apiName); // returns the converted name if present, or the original name if there was not a corresponding one
};