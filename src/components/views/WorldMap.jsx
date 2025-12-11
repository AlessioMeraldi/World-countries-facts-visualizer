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
                        {viewModel.countries.map((country, i) => (
                            <path
                                /* Usa un ID univoco se disponibile, altrimenti l'indice va bene per ora */
                                key={country.id || i}

                                d={viewModel.pathGenerator(country)}

                                /* --- ASSEGNAZIONE CLASSE --- */
                                className={WorldMapStyle.country}

                                /* --- EVENTI (Mantienili per il tooltip e il click) --- */
                                onMouseEnter={() => viewModel.handleMouseEnter(country)}
                                onMouseLeave={viewModel.handleMouseLeave}
                                onClick={() => viewModel.handleCountryClick(country)}

                                /* --- IMPORTANTE: NESSUN attributo fill o stroke qui! ---
                                   Se li metti qui, vincono loro sul CSS e l'hover non va.
                                */
                            />
                        ))}

                    </g>
                </svg>
            </div>

        </React.Fragment>
    );
}

export default WorldMap;
