// import * as React from "react";
// import { useState, useMemo, useCallback } from "react";
// import { render } from "react-dom";
// import MapGL, { Popup, Source, Layer } from "react-map-gl";
// import ControlPanel from "./control-panel";

// import { countiesLayer, highlightLayer } from "./map-style.js";

// const MAPBOX_TOKEN = "pk.eyJ1IjoicWJlYXN0MzYwIiwiYSI6ImNrcDRocnNjZjBmNXMydnB0bmNuOGd5d3gifQ.cvmXqVsWHijw6o8gplL95A"; // Set your mapbox token here

// export default function MapPage() {
//     const [viewport, setViewport] = useState({
//         latitude: 38.88,
//         longitude: -98,
//         zoom: 3,
//         minZoom: 2,
//         bearing: 0,
//         pitch: 0,
//     });
//     const [hoverInfo, setHoverInfo] = useState(null);

//     const onHover = useCallback((event) => {
//         const county = event.features && event.features[0];
//         console.log(county);
//         setHoverInfo({
//             longitude: event.lngLat[0],
//             latitude: event.lngLat[1],
//             countyName: county && county.properties.COUNTY,
//         });
//     }, []);

//     const selectedCounty = (hoverInfo && hoverInfo.countyName) || "";
//     const filter = useMemo(() => ["in", "COUNTY", selectedCounty], [selectedCounty]);

//     return (
//         <MapGL>
//             <MapGL
//                 {...viewport}
//                 width="100%"
//                 height="100%"
//                 mapStyle="mapbox://styles/mapbox/light-v9"
//                 mapboxApiAccessToken={MAPBOX_TOKEN}
//                 onViewportChange={setViewport}
//                 onHover={onHover}
//                 interactiveLayerIds={["counties"]}
//             >
//                 <Source type="vector" url="mapbox://mapbox.82pkq93d">
//                     <Layer beforeId="waterway-label" {...countiesLayer} />
//                     <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
//                 </Source>
//                 {selectedCounty && (
//                     <Popup
//                         longitude={hoverInfo.longitude}
//                         latitude={hoverInfo.latitude}
//                         closeButton={false}
//                         className="county-info"
//                     >
//                         {selectedCounty}
//                     </Popup>
//                 )}
//             </MapGL>
//             {/* <ControlPanel /> */}
//         </MapGL>
//     );
// }

// export function renderToDom(container) {
//     render(<MapPage />, container);
// }

import * as React from "react";
import { Fragment } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { render } from "react-dom";
import MapGL, { Popup, Source, Layer } from "react-map-gl";
import ControlPanel from "./control-panel";
import { countiesLayer, highlightLayer } from "./map-style.js";
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN = "pk.eyJ1IjoicWJlYXN0MzYwIiwiYSI6ImNrcDRocnNjZjBmNXMydnB0bmNuOGd5d3gifQ.cvmXqVsWHijw6o8gplL95A"; // Set your mapbox token here

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function MapPage() {
    const [viewport, setViewport] = useState({
        latitude: 38.88,
        longitude: -98,
        zoom: 4,
        minZoom: 2,
        bearing: 0,
        pitch: 0,
    });
    const history = useHistory();

    const [allCounties, setAllCounties] = useState(null);
    useEffect(() => {
        const fetchCountyData = () => {
            fetch("http://localhost:3000/counties", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((data) => data.json())
                .then((data) => {
                    setAllCounties(data.data);
                });
        };
        fetchCountyData();
        fetch("http://localhost:3000/geojson")
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
                setGeoJson(data);
            });
    }, []);

    const [hoverInfo, setHoverInfo] = useState(null);
    // const [hoverPopup, setHoverPopup] = useState({ name: "", state: "", donations: "" });
    const [geoJson, setGeoJson] = useState(null);

    const onHover = useCallback((event) => {
        const county = event.features && event.features[0];
        setHoverInfo({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
            countyName: county && county.properties.name,
            FIPS: county && county.properties.FIPS,
            state: county && county.properties.state,
            total_donations: county && county.properties.total_donated,
            dem_donation: county && county.properties.dem_donation,
            rep_donation: county && county.properties.rep_donation,
            other_donation: county && county.properties.other_donation,
        });
    }, []);

    // useEffect(() => {
    //     if (allCounties !== null && hoverInfo !== null && hoverInfo.FIPS !== undefined) {
    //         let results = allCounties.find((c) => c.id === hoverInfo.FIPS.toString());
    //         if (results !== undefined) {
    //             setHoverPopup({
    //                 name: results.attributes.name,
    //                 state: results.attributes.state,
    //                 donations: results.attributes.total_donated,
    //             });
    //         }
    //     }
    // }, [hoverInfo, allCounties]);

    const selectedCounty = (hoverInfo && hoverInfo.FIPS) || "";
    const filter = useMemo(() => ["in", "FIPS", selectedCounty], [selectedCounty]);

    return (
        <Fragment>
            {geoJson !== null ? (
                <MapGL
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    onViewportChange={setViewport}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    onHover={onHover}
                    onClick={() => history.push(`/county/${hoverInfo.FIPS}`)}
                    interactiveLayerIds={["counties"]}
                >
                    <Source type="geojson" data={geoJson}>
                        <Layer {...countiesLayer} />
                        <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
                    </Source>

                    {selectedCounty && (
                        <Popup
                            longitude={hoverInfo.longitude}
                            latitude={hoverInfo.latitude}
                            closeButton={false}
                            className="county-info"
                        >
                            {allCounties === null ? null : (
                                <div>
                                    Name: {hoverInfo.countyName}
                                    <br />
                                    State: {hoverInfo.state}
                                    <br />
                                    Donations: ${numberWithCommas(hoverInfo.total_donations)}
                                </div>
                            )}
                        </Popup>
                    )}
                </MapGL>
            ) : null}
        </Fragment>
    );
}

document.body.style.margin = 0;
// render(<MapPage />, document.body.appendChild(document.createElement("div")));
