// src/tests/countryMapping.test.js
import { describe, it, expect, beforeAll } from 'vitest'; // o 'jest'
import { getMapNameFromAPIName } from '../utilities/countryMapping';

// URL usati nel tuo progetto
const API_ALL_URL = "https://restcountries.com/v3.1/all?fields=name";
const GEOJSON_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

describe('Country Mapping Integrity Test', () => {
    let apiCountries = [];
    let mapFeatureNames = new Set(); // Usiamo un Set per ricerche veloci O(1)

    // 1. SCARICHIAMO I DATI UNA VOLTA SOLA PRIMA DEI TEST
    beforeAll(async () => {
        console.log("Fetching data sets...");

        // --- 1. Fetch API Countries ---
        const apiRes = await fetch(API_ALL_URL);

        // CONTROLLO DI SICUREZZA: La chiamata ha avuto successo?
        if (!apiRes.ok) {
            console.error(`API Fetch Failed! Status: ${apiRes.status} ${apiRes.statusText}`);
            // Proviamo a leggere il corpo dell'errore per capire meglio
            const textBody = await apiRes.text();
            console.error("Error Body:", textBody);
            throw new Error("Impossibile scaricare i dati dall'API REST Countries");
        }

        const apiData = await apiRes.json();

        // CONTROLLO DI TIPO: Abbiamo ricevuto davvero un array?
        if (!Array.isArray(apiData)) {
            console.error("Data received is NOT an array:", apiData);
            throw new Error("L'API ha restituito un formato inatteso (non è un array).");
        }

        apiCountries = apiData.map(c => c.name.common);


        // --- 2. Fetch GeoJSON Map ---
        const mapRes = await fetch(GEOJSON_URL);

        if (!mapRes.ok) {
            throw new Error(`Map Fetch Failed! Status: ${mapRes.status}`);
        }

        const mapData = await mapRes.json();

        mapData.features.forEach(feature => {
            mapFeatureNames.add(feature.properties.name);
        });

        console.log(`Loaded ${apiCountries.length} API countries and ${mapFeatureNames.size} Map regions.`);
    }, 30000); // Aumentiamo il timeout a 30s per sicurezza

    // 2. IL TEST VERO E PROPRIO
    it('should find a corresponding country on the map for every API country', () => {

        const missingMappings = [];

        apiCountries.forEach(apiName => {
            // Usiamo la tua funzione di conversione
            const targetMapName = getMapNameFromAPIName(apiName);

            // Verifichiamo se il nome (convertito o originale) esiste nella mappa
            if (!mapFeatureNames.has(targetMapName)) {
                missingMappings.push({
                    apiName: apiName,
                    attemptedMapName: targetMapName
                });
            }
        });

        // 3. REPORTING
        if (missingMappings.length > 0) {
            console.error("\n--- 🚨 COUNTRIES NOT FOUND ON MAP ---");
            console.table(missingMappings);
            console.error(`Total missing: ${missingMappings.length} / ${apiCountries.length}`);
            console.error("-------------------------------------\n");
        }

        // Il test passa solo se l'array dei mancanti è vuoto
        // Nota: Probabilmente fallirà la prima volta, ed è quello che vogliamo per scoprire i nomi mancanti!
        expect(missingMappings).toEqual([]);
    });
});