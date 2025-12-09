// src/models/mapModel.js

/**
 * fetchWorldMap
 * Recupera il file GeoJSON dei paesi dal repo di D3‑graph‑gallery
 * e restituisce l’array di features (paesi).
 */
export async function fetchWorldMap() {

    // set variabile to get a world map as JSON
    const GEOJSON_URL =
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

    // fetch world map
    const res = await fetch(GEOJSON_URL);

    // check response, if it wasn't ok throw an error
    if (!res.ok) {
        throw new Error(`Failed to fetch world map: ${res.status} ${res.statusText}`);
    }

    // convert data from JSON to String, method is asynchronous so await for it to complete
    const geoJson = await res.json();

    // data fetched might be corrupted, if it is missing '.features' property it would indicate such corruption - if they are missing, throw an error
    if (!geoJson.features) {
        throw new Error("Invalid GeoJSON: missing .features");
    }

    // return map features
    return geoJson.features;
}
