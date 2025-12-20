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


    /* === INITIAL MAP SETUP === */

    // Load geo data (using an effect)
    useEffect(() => {
        fetchWorldMap().then(setCountries); // .then( ... ) contains what to do in case of a promise success
    }, []); // [] = execute this only the first time, upon creation

    // Setup zoom/pan
    useEffect(() => { // initialize (once, at start of the program) the handling of the zoom

        if (!svgRef.current) return; // if zoom object doesn't exist in the DOM, return

        const svg = d3.select(svgRef.current); // get reference to the map's SVG (with svgRef.current), d3 syntax requires us to use d3.select(x)
        const g = svg.select("g"); // get the reference to the 'g' element of the SVG (the 'g' element is used to put other stuff in it, in case of this d3 map it contains the actual countries with their borders)

        if (!g.empty()) {
            const zoom = d3.zoom() // create an instance of "d3.zoom()", which implements the zoom behavior ...
                .scaleExtent([1, 8]) // set that the zoom scale goes from 1 to 8 ...
                .on("zoom", (event) => setZoomTransform(event.transform)) // and, add an eventListener for the event "zoom" that executes the function that handles the zoom
            ;

            // APPLY the zoom behavior to the SVG.
            // This attaches internal event listeners (wheel, mousedown, etc.) to the svg element.
            svg.call(zoom);
        }

    }, [countries]);
    // it's called only when [countries] changes because it isn't supposed to be called whenever there's a zoom-in or zoom-out, it just adds ONCE the zoom/unzoom function
    // it's added when [countries] changes because it will change when setCountries is called in the initial setup

    // Define the map projection (converts 3D Globe coordinates to 2D Planar pixels)
    const projection = d3.geoNaturalEarth1()
        .scale(200) // sets the base scale (zoom level) of the map
        .translate([width / 2.2, height / 2.5]) // centers the map in the middle of the SVG canvas [middle = (width/2, height/2)], its width 2.5 to put a slight offset due to there being the sidebar on the left (and for all the ocean between the USA and Japan)
    ;

    // Create a new geographic path generator (this tells the generator: "use these math rules to calculate pixel positions")
    const pathGenerator = d3.geoPath()
        .projection(projection) // bind the projection we defined earlier to this generator
    ;


    /* === WORLD-MAP USAGE LOGIC === */

    // event for mouse-enter in a country (add the tooltip)
    const handleMouseEnter = (country) => {
        setTooltipContent(country.properties.name);
        // modify to contain data from REST Countries API (it's getting passed from countryMode.js, useCountrySearchViewModel.js and CountrInformation,jsx)
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