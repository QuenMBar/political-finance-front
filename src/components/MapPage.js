import * as React from "react";
import { Fragment } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MapGL, { Popup, Source, Layer } from "react-map-gl";
import { countiesLayer, highlightLayer } from "./map-style.js";
import mapboxgl from "mapbox-gl";
import { useSelector, useDispatch } from "react-redux";
import { getGeoJsonAsync, selectGeoJson, setShowDonations, selectShowDonations } from "../redux/donationReducer";
import { isEqual } from "lodash";
import env from "react-dotenv";

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
    const history = useHistory();
    const dispatch = useDispatch();
    const geoJson = useSelector(selectGeoJson);
    const showDonations = useSelector(selectShowDonations);

    useEffect(() => {
        dispatch(getGeoJsonAsync());
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

    return (
        <Fragment>
            {geoJson !== null ? (
                <MapGL
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    onViewportChange={setViewport}
                    mapboxApiAccessToken={env.MAPBOX_TOKEN}
                    onHover={onHover}
                    onClick={() => {
                        if (hoverInfo.FIPS !== undefined) {
                            history.push(`/county/${hoverInfo.FIPS}`);
                        }
                    }}
                    interactiveLayerIds={["counties"]}
                >
                    <Source type="geojson" data={geoJson}>
                        <Layer {...countiesLayer} />
                        <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
                    </Source>

                    {setPopUpInfo()}
                </MapGL>
            ) : null}
        </Fragment>
    );
}
