import * as React from "react";
import { Fragment } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MapGL, { Popup, Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { useSelector, useDispatch } from "react-redux";
import {
    getGeoJsonAsync,
    selectGeoJson,
    setShowDonations,
    selectShowDonations,
    selectChecked,
} from "../redux/donationReducer";
import { isEqual } from "lodash";
import ControlPanel from "./control-panel";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

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
    const [newGeo, setNewGeo] = useState(null);
    const [oldGeo, setOldGeo] = useState(null);
    const [finalGeo, setFinalGeo] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const geoJson = useSelector(selectGeoJson);
    const showDonations = useSelector(selectShowDonations);
    const donationCheck = useSelector(selectChecked);

    useEffect(() => {
        if (geoJson === null) {
            dispatch(getGeoJsonAsync());
        }
    }, []);

    const [hoverInfo, setHoverInfo] = useState(null);

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

    const selectedCounty = (hoverInfo && hoverInfo.FIPS) || "";
    const filter = useMemo(() => ["in", "FIPS", selectedCounty], [selectedCounty]);

    const setPopUpInfo = () => {
        if (
            selectedCounty &&
            !isEqual(showDonations, {
                totalShowDonation: hoverInfo.total_donations,
                demShowDonation: hoverInfo.dem_donation,
                repShowDonation: hoverInfo.rep_donation,
                otherShowDonation: hoverInfo.other_donation,
            })
        ) {
            dispatch(
                setShowDonations({
                    totalShowDonation: hoverInfo.total_donations,
                    demShowDonation: hoverInfo.dem_donation,
                    repShowDonation: hoverInfo.rep_donation,
                    otherShowDonation: hoverInfo.other_donation,
                })
            );
        } else if (
            !selectedCounty &&
            !isEqual(showDonations, {
                totalShowDonation: 0,
                demShowDonation: 0,
                repShowDonation: 0,
                otherShowDonation: 0,
            })
        ) {
            dispatch(
                setShowDonations({
                    totalShowDonation: 0,
                    demShowDonation: 0,
                    repShowDonation: 0,
                    otherShowDonation: 0,
                })
            );
        }
        return (
            selectedCounty && (
                <Popup
                    longitude={hoverInfo.longitude}
                    latitude={hoverInfo.latitude}
                    closeButton={false}
                    className="county-info"
                >
                    {hoverInfo === null ? null : (
                        <div>
                            Name: {hoverInfo.countyName}
                            <br />
                            State: {hoverInfo.state}
                            <br />
                            Donations: ${numberWithCommas(hoverInfo.total_donations)}
                        </div>
                    )}
                </Popup>
            )
        );
    };

    useEffect(() => {
        if (geoJson !== null) {
            setOldGeo(newGeo);
            let finalArray = geoJson.features.map((prop) => {
                let x = {
                    ...prop,
                    properties: {
                        ...prop.properties,
                        total_donated: 0.0,
                        dem_donation: 0.0,
                        rep_donation: 0.0,
                        other_donation: 0.0,
                        radius: 0.0,
                        color: "#6f7f85",
                    },
                };
                if (donationCheck.id) {
                    x.properties.total_donated += prop.properties.total_donated;
                    x.properties.dem_donation += prop.properties.dem_donation;
                    x.properties.rep_donation += prop.properties.rep_donation;
                    x.properties.other_donation += prop.properties.other_donation;
                }
                if (donationCheck.org) {
                    x.properties.total_donated += prop.properties.total_donated_org;
                    x.properties.dem_donation += prop.properties.dem_donation_org;
                    x.properties.rep_donation += prop.properties.rep_donation_org;
                    x.properties.other_donation += prop.properties.other_donation_org;
                }
                if (donationCheck.com) {
                    x.properties.total_donated += prop.properties.total_donated_com;
                    x.properties.dem_donation += prop.properties.dem_donation_com;
                    x.properties.rep_donation += prop.properties.rep_donation_com;
                    x.properties.other_donation += prop.properties.other_donation_com;
                }
                x.properties.radius = Math.sqrt(x.properties.total_donated / 150000);
                if (
                    x.properties.dem_donation >= x.properties.other_donation &&
                    x.properties.dem_donation > x.properties.rep_donation
                ) {
                    x.properties.color = "#007cbf";
                } else if (
                    x.properties.rep_donation >= x.properties.other_donation &&
                    x.properties.rep_donation > x.properties.dem_donation
                ) {
                    x.properties.color = "#FF0000";
                }
                return x;
            });
            let filteredFinalArray = finalArray.filter((x) => x.properties.total_donated !== 0);
            setNewGeo({ type: "FeatureCollection", features: filteredFinalArray });
        }
    }, [geoJson, donationCheck]);

    // console.log(newGeo);
    // console.log(oldGeo);
    // console.log(newGeo);

    const transition = (timing, duration) => {
        let start = performance.now();
        // console.log(newGeo);

        requestAnimationFrame(function animate(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // calculate the current animation state
            let progress = timing(timeFraction);

            // draw(progress); // draw it
            interpolateGeoJson(progress);
            // console.log(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        });
        // console.log("running");
    };

    const betweenTwoColors = (color1, color2, ratio) => {
        color1 = color1.substr(1);
        color2 = color2.substr(1);
        if (ratio < 0) {
            ratio = 0;
        } else if (ratio > 1) {
            ratio = 1;
        }

        let hex = (x) => {
            x = x.toString(16);
            return x.length === 1 ? "0" + x : x;
        };

        let r = Math.ceil(
            parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio)
        );
        let g = Math.ceil(
            parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio)
        );
        let b = Math.ceil(
            parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio)
        );

        // console.log("running");

        return "#" + hex(r) + hex(g) + hex(b);
    };

    const interpolateGeoJson = (percent) => {
        // console.log("running");
        if (newGeo !== null) {
            if (oldGeo === null) {
                setFinalGeo({
                    type: "FeatureCollection",
                    features: newGeo.features.map((prop) => {
                        return {
                            ...prop,
                            properties: {
                                ...prop.properties,
                                radius: prop.properties.radius * percent,
                            },
                        };
                    }),
                });
            } else {
                setFinalGeo({
                    type: "FeatureCollection",
                    features: newGeo.features.map((prop) => {
                        let oldGeoSelect = oldGeo.features.find((x) => x.properties.FIPS === prop.properties.FIPS);
                        let oldRad = 0;
                        let color = "#6f7f85";
                        if (oldGeoSelect === undefined) {
                            oldRad = 0;
                            color = prop.properties.color;
                        } else {
                            oldRad = oldGeoSelect.properties.radius;
                            if (oldGeoSelect.properties.color !== prop.properties.color) {
                                color = betweenTwoColors(prop.properties.color, oldGeoSelect.properties.color, percent);
                            } else {
                                color = prop.properties.color;
                            }
                        }
                        return {
                            ...prop,
                            properties: {
                                ...prop.properties,
                                radius: oldRad + percent * (prop.properties.radius - oldRad),
                                color: color,
                            },
                        };
                    }),
                });
            }
        }
    };

    useEffect(() => {
        // console.log("running");
        transition(function (timeFraction) {
            return 1 - Math.sin(Math.acos(timeFraction));
        }, 1200);
    }, [newGeo]);

    // console.log(geoJson);
    // console.log("here");

    const countiesLayer = {
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
            // "circle-color": [
            //     "case",
            //     ["==", ["get", "dem_donation"], ["get", "rep_donation"]],
            //     "#78909c",
            //     ["case", ["<", ["get", "dem_donation"], ["get", "rep_donation"]], "#FF0000", "#007cbf"],
            // ],
            "circle-color": ["get", "color"],
            "circle-opacity": 0.4,
        },
    };

    const highlightLayer = {
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
            // "circle-color": [
            //     "case",
            //     ["==", ["get", "dem_donation"], ["get", "rep_donation"]],
            //     "#78909c",
            //     ["case", ["<", ["get", "dem_donation"], ["get", "rep_donation"]], "#FF0000", "#007cbf"],
            // ],
            "circle-color": ["get", "color"],
            "circle-opacity": 1,
        },
    };

    return (
        <Fragment>
            {finalGeo !== null ? (
                <div className="map">
                    <MapGL
                        {...viewport}
                        width="100%"
                        height="100%"
                        mapStyle="mapbox://styles/mapbox/light-v9"
                        onViewportChange={setViewport}
                        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        onHover={onHover}
                        onClick={() => {
                            if (hoverInfo.FIPS !== undefined) {
                                history.push(`/county/${hoverInfo.FIPS}`);
                            }
                        }}
                        interactiveLayerIds={["counties"]}
                    >
                        <Source type="geojson" data={finalGeo}>
                            <Layer {...countiesLayer} />
                            <Layer {...highlightLayer} filter={filter} />
                        </Source>
                        {setPopUpInfo()}
                    </MapGL>
                    <ControlPanel className="control-panel" />
                </div>
            ) : null}
        </Fragment>
    );
}
