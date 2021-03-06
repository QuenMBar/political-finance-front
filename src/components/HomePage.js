import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MapPage from "./MapPage";
import GraphPage from "./GraphPage";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    map: {
        width: "78%",
        height: "calc(96% - 60px)",
        marginLeft: "1%",
        marginTop: "1%",
        marginBottom: "1%",
        position: "absolute",
    },
    graph: {
        width: "22%",
        height: "calc(100% - 60px)",
        marginLeft: "79%",
        position: "absolute",
    },
    contain: {
        width: "100vw",
        height: "calc(100vh - 60px)",
        // marginTop: "2vh",
        // marginLeft: "2%",
    },
    containPap: {
        width: "100%",
        height: "100%",
        marginTop: "0vh",
        backgroundColor: "#F7EACA",
    },
}));

export default function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.contain}>
            <Paper className={classes.containPap}>
                <div className={classes.map}>
                    <MapPage />
                </div>
                <div className={classes.graph}>
                    <GraphPage />
                </div>
            </Paper>
        </div>
    );
}
