export async function fetchCountryByName(name) {

    const base = "https://restcountries.com/v3.1/name/";
    const encoded = encodeURIComponent(name);

    // Attempt 1: exact match (fullText=true)
    try {
        const resFull = await fetch(`${base}${encoded}?fullText=true`);
        if (!resFull.ok) {
            throw new Error("Could not find matching country");
        }

        const dataFull = await resFull.json();
        return dataFull;

    } catch (err) {
        console.log(
            "Couldn't find a Country matching the exact name, attempting fallback solution - thrown " + err
        );
        // ignores and goes on to the fallback
    }

    try {
        const resPartial = await fetch(`${base}${encoded}`);
        if (!resPartial.ok) {
            const text = await resPartial.text().catch(() => "");
            throw new Error(resPartial.statusText || text || "Country not found.");
        }

        const dataPartial = await resPartial.json();
        return dataPartial;

    } catch (err) {
        console.log(
            "Couldn't find matching country even with the fallback solution - thrown " + err
        );
        throw err; // propagate to ViewModel
    }
}

/*

Format of JSON data returned from the API, showcased with an example:

[
  {
    "name": {
      "common": "Italy",
      "official": "Italian Republic",
      "nativeName": {
        "ita": {
          "official": "Repubblica italiana",
          "common": "Italia"
        }
      }
    },
    "tld": [".it"],
    "cca2": "IT",
    "ccn3": "380",
    "cca3": "ITA",
    "cioc": "ITA",
    "independent": true,
    "status": "officially-assigned",
    "unMember": true,
    "currencies": {
      "EUR": {
        "name": "Euro",
        "symbol": "€"
      }
    },
    "idd": {
      "root": "+3",
      "suffixes": ["9"]
    },
    "capital": ["Rome"],
    "altSpellings": ["IT", "Italia", "Italian Republic", "Repubblica italiana"],
    "region": "Europe",
    "subregion": "Southern Europe",
    "languages": {
      "ita": "Italian"
    },
    "translations": {
      "deu": {
        "official": "Italienische Republik",
        "common": "Italien"
      },
      "fra": {
        "official": "République italienne",
        "common": "Italie"
      },
      "spa": {
        "official": "República Italiana",
        "common": "Italia"
      }
      // ... other translations
    },
    "latlng": [42.83333333, 12.83333333],
    "landlocked": false,
    "borders": ["FRA", "CHE", "AUT", "SVN"],
    "area": 301336,
    "demonyms": {
      "eng": {
        "f": "Italian",
        "m": "Italian"
      },
      "fra": {
        "f": "Italienne",
        "m": "Italien"
      }
    },
    "flag": "🇮🇹",
    "maps": {
      "googleMaps": "https://goo.gl/maps/3GbLXbBz9Z6znj5t6",
      "openStreetMaps": "https://www.openstreetmap.org/relation/365331"
    },
    "population": 59554023,
    "fifa": "ITA",
    "car": {
      "signs": ["I"],
      "side": "right"
    },
    "timezones": ["UTC+01:00"],
    "continents": ["Europe"],
    "flags": {
      "svg": "https://flagcdn.com/it.svg",
      "png": "https://flagcdn.com/w320/it.png"
    },
    "coatOfArms": {
      "png": "https://mainfacts.com/media/images/coats_of_arms/it.png",
      "svg": "https://mainfacts.com/media/images/coats_of_arms/it.svg"
    },
    "startOfWeek": "monday",
    "capitalInfo": {
      "latlng": [41.9, 12.5]
    },
    "postalCode": {
      "format": "#####",
      "regex": "^(\\d{5})$"
    }
  }
]

 */