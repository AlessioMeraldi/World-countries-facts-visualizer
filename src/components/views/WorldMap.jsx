import React from "react";

function WorldMap({ viewModel }) {
    return (
        // eslint-disable-next-line react-hooks/refs
        <svg ref={viewModel.svgRef} width={viewModel.width} height={viewModel.height}>
            {/* eslint-disable-next-line react-hooks/refs */}
            <g transform={viewModel.zoomTransform.toString()}>
                {/* eslint-disable-next-line react-hooks/refs */}
                {viewModel.countries.map((country) => (
                    <path
                        key={country.id}
                        d={viewModel.pathGenerator(country)}
                        fill="#ccc"
                        stroke="#333"
                        strokeWidth={0.5}
                        onMouseEnter={() => viewModel.handleMouseEnter(country)}
                        onMouseLeave={viewModel.handleMouseLeave}
                        onClick={() => viewModel.handleCountryClick(country)}
                    />
                ))}
            </g>
        </svg>
    );
}

export default WorldMap;
