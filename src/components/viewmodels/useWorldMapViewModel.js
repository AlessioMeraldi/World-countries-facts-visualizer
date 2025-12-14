import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { fetchWorldMap } from "../models/mapModel";

function useWorldMapViewModel(width, height, onCountryClick) {
    /* toDo: segnarsi che come esempio aveva fatto l'errore sia di passare width / height da WorldMap.jsx che qui gli aveva fissati  valori width=960 e height=500 */

    // state
    const [countries, setCountries] = useState([]);
    const [tooltipContent, setTooltipContent] = useState("");
    const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

    const [selectedCountryName, setSelectedCountryName] = useState(null); /* state for last clicked country */

    // local variables
    const svgRef = useRef(null);

    // Load geo data (using an effect)
    useEffect(() => {
        fetchWorldMap().then(setCountries); // .then( ... ) contains what to do in case of a promise success
    }, []); // [] = execute this only the first time, upon creation

    // Setup zoom/pan
    useEffect(() => {

        // if not zooming the map - return
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const g = svg.select("g");
        if (!g.empty()) {
            const zoom = d3
                .zoom()
                .scaleExtent([1, 8])
                .on("zoom", (event) => setZoomTransform(event.transform))
            ;

            svg.call(zoom);
        }
    }, [countries]);
    // it's called only when [countries] changes because it isn't supposed to be called whenever there's a zoom-in or zoom-out, it just adds ONCE the zoom/unzoom function
    // it's added when [countries] changes because it will change when setCountries is called in the initial setup

    // Projection (toDo: put description)
    const projection = d3
        .geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2])
    ;

    // Path-Generator (toDo: put description)
    const pathGenerator = d3.geoPath().projection(projection);

    // event for mouse-enter in a country (add the tooltip)
    const handleMouseEnter = (country) => {
        setTooltipContent(country.properties.name);
        // modify to contain data from REST Countries API (it's getting passed from countryMode.js, useCountrySearchViewModel.js and CountrInformation,jsx
    };

    // event for mouse-exit from a country (remove the tooltip)
    const handleMouseLeave = () => {
        setTooltipContent("");
    };

    // event for mouse-click on the map (country is received from WordMap.jsx by clicking, WorldMaps.jsx actually uses the item's key as an ID)
    const handleCountryClick = (country) => {

        const name = country.properties.name;
        console.log("Clicked country:", name);

        /* assign to 'selectedCountryName' the name of the last selected country */
        setSelectedCountryName(name);

        /* only if onCountryClick function is defined (it could be undefined if the map is used for multiple purposes, not the case here) */
        if (onCountryClick) {
            onCountryClick(name);  // then execute onCountryClick() function with the parameter 'name' (= the name of the clicked country)
        }
    };

    // function to set the selected country in a different way from clicking the map (using the serachbar, in our case)
    const selectCountryFromOutside = (name) => {
        setSelectedCountryName(name);
    }

    return {
        svgRef,
        countries,
        tooltipContent,
        zoomTransform,
        projection,
        pathGenerator,
        handleMouseEnter,
        handleMouseLeave,
        handleCountryClick,
        selectCountryFromOutside,
        selectedCountryName,
        width,
        height,
    };
}

export default useWorldMapViewModel;