import React from "react";
import WorldMapStyle from "./WorldMap.module.css";

function WorldMap({viewModel}) {

    return (

        <React.Fragment>

            <div className={WorldMapStyle.mapContainer}>

                <svg ref={viewModel.svgRef}
                     viewBox={`
                        0
                        0 
                        ${viewModel.width} 
                        ${viewModel.height}
                     `}
                     preserveAspectRatio="xMidYMid meet" /* d3 syntax to show the SVG centered by default (horizontally -> xMid, and vertically -> yMid) */
                     className={WorldMapStyle.worldMapSvg}
                >
                    { /*
                <svg ref={viewModel.svgRef}
                     viewBox={`             //

                 0                          // first N = where X=0 coordinate is put, in this case (X=0) set to 0 means "left border"
                 0                          // second N = where Y=0 coordinate is put, in this case (Y=0) set to 0 means "top border"
                                            // so, the (0,0) coordinates of the SVG's view-box are the top-left corner

                                            // reminder: by internal logic default absolute size of the map is 960 x 500 px
                                            // reminder 2: WorldExplorer creates a useWorldMapViewModel called 'viewModel' with .width = 960px and .height = 500px

                 ${viewModel.width}         // 3rd parameter of viewBox = conversion of (x = width) from fixed-pixel-size to relative size
                 ${viewModel.height}        // 4th parameter of the viewBox = conversion of (y = height) from fixed-pixel-size to relative size
                 `}

                 // overall this means "map the 960x500 px original map to the viewBox size (responsive) so that its starting coordinates are (0,0) = top-left and
                 // the 960px grows to the actually available width and the 500px grows to the actually available height responsiveley / accordingly

                 (...)
                >
                */}

                    {/* eslint-disable-next-line react-hooks/refs */}
                    <g transform={viewModel.zoomTransform.toString()}>

                        {/* eslint-disable-next-line react-hooks/refs */}
                        {viewModel.countries.map((country) => (
                            <path

                                key={country.properties.name} /* Not each country has a unique ID (they are actually all unique, but not all of them have it) and using the index 'i' is a sub-optimal solution, no two countries have the same name so the name can act as an ID */
                                d = {viewModel.pathGenerator(country)}

                                /* className={WorldMapStyle.country} */ /* assign class 'country' to the current Country to give it CSS style */

                                className={
                                    country.properties.name === viewModel.selectedCountryName /* IF: (country.properties.name === viewModel.selectedCountryName */
                                        ? `${WorldMapStyle.country} ${WorldMapStyle.countryClicked}` /* THEN: className = WorldMapStyle.country + " " + WorldMapStyle.countryClicked */
                                        : WorldMapStyle.country /* ELSE: className = WorldMapStyle.country */
                                }

                                /* Events */
                                onMouseEnter={() => viewModel.handleMouseEnter(country)} /* Hover onto a Country */
                                onMouseLeave={viewModel.handleMouseLeave} /* Hover outside a Country (deletes tooltip) */
                                onClick={() => viewModel.handleCountryClick(country)} /* click a country (makes its data pop-up) */

                                /* Note: do not put stroke or attributes here otherwise every country already appears as highlighted */
                                /* Hover and Mouseout are already handled by CSS by default (country:hover) */
                            />
                        ))}

                    </g>
                </svg>
            </div>

        </React.Fragment>
    );
}

export default WorldMap;
