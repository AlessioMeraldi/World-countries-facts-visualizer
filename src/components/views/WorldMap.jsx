import React from "react";
import { useWorldMapViewModel } from "../viewmodels/useWorldMapViewModel";

function WorldMap() {
    const vm = useWorldMapViewModel();

    return (
        <div style={{ position: "relative" }}>
            {/* Tooltip */}
            {vm.tooltipContent && (
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        padding: "5px 10px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        borderRadius: 4,
                        pointerEvents: "none",
                        fontSize: "0.9rem",
                    }}
                >
                    {vm.tooltipContent}
                </div>
            )}

            {/* SVG */}
            <svg
                /* eslint-disable-next-line react-hooks/refs */
                ref={vm.svgRef}
                /* eslint-disable-next-line react-hooks/refs */
                width={vm.width}
                /* eslint-disable-next-line react-hooks/refs */
                height={vm.height}
                style={{ border: "1px solid #ccc" }}
            >
                {/* eslint-disable-next-line react-hooks/refs */}
                <g transform={vm.zoomTransform.toString()}>
                    {/* eslint-disable-next-line react-hooks/refs */}
                    {vm.countries.map((country) => (
                        <path
                            key={country.id}
                            d={vm.pathGenerator(country)}
                            fill="#ccc"
                            stroke="#333"
                            strokeWidth={0.5}
                            onMouseEnter={() => vm.handleMouseEnter(country)}
                            onMouseLeave={vm.handleMouseLeave}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}

export default WorldMap;
