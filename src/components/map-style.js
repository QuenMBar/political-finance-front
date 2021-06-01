export const countiesLayer = {
    id: "counties",
    type: "circle",
    paint: {
        "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            ["+", 2, ["get", "radius"]],
            10,
            ["*", 1.5, ["+", 7, ["get", "radius"]]],
        ],
        "circle-color": [
            "case",
            ["==", ["get", "dem_donation"], ["get", "rep_donation"]],
            "#78909c",
            ["case", ["<", ["get", "dem_donation"], ["get", "rep_donation"]], "#FF0000", "#007cbf"],
        ],
        "circle-opacity": 0.4,
    },
};
// Highlighted county polygons
export const highlightLayer = {
    id: "counties-highlighted",
    type: "circle",
    paint: {
        "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            ["+", 2, ["get", "radius"]],
            10,
            ["*", 1.5, ["+", 7, ["get", "radius"]]],
        ],
        "circle-color": [
            "case",
            ["==", ["get", "dem_donation"], ["get", "rep_donation"]],
            "#78909c",
            ["case", ["<", ["get", "dem_donation"], ["get", "rep_donation"]], "#FF0000", "#007cbf"],
        ],
        "circle-opacity": 1,
    },
};
