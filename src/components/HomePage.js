import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MapPage from "./MapPage";
import GraphPage from "./GraphPage";

const useStyles = makeStyles((theme) => ({
    map: {
        width: "78%",
        height: "inherit",
        marginLeft: "4%",
        position: "absolute",
    },
    graph: {
        width: "22%",
        height: "inherit",
        marginLeft: "82%",
        position: "absolute",
    },
    contain: {
        width: "100vw",
        height: "90vh",
        marginTop: "3vh",
    },
}));

export default function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.contain}>
            <div className={classes.map}>
                <MapPage />
            </div>
            <div className={classes.graph}>
                <GraphPage />
            </div>
        </div>
    );
}
