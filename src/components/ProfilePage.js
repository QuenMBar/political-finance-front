import { Typography, Paper, TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TablePagination from "@material-ui/core/TablePagination";
// import TableRow from "@material-ui/core/TableRow";
// import Iron from "../assets/Emblem_Iron.png";
// import Bronze from "../assets/Emblem_Bronze.png";
// import Silver from "../assets/Emblem_Silver.png";
// import Gold from "../assets/Emblem_Gold.png";
// import Platinum from "../assets/Emblem_Platinum.png";
// import Diamond from "../assets/Emblem_Diamond.png";
// import Master from "../assets/Emblem_Master.png";
// import GrandMaster from "../assets/Emblem_Grandmaster.png";
// import Challenger from "../assets/Emblem_Challenger.png";
// import { Link } from "react-router-dom";
import { loginAsync, selectJWT } from "../redux/loginReducer";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "calc(96vh - 60px)",
    },
    profile: {
        width: "70%",
        height: "200px",
        marginLeft: "15%",
        marginTop: "2.5%",
        textAlign: "left",
    },
    watchlist: {
        width: "70%",
        height: "68.5%",
        marginLeft: "15%",
        marginTop: "2.5%",
        marginBottom: 0,
    },
    name: {
        marginLeft: "5%",
        padding: "1%",
    },
    textField: {
        marginLeft: "2%",
        width: "96%",
        // height: "80px",
    },
    bioLabel: {
        marginLeft: "2%",
        display: "inline",
    },
    saveButton: {
        // display: "inline",
        marginRight: "2%",
        float: "right",
        height: "25px",
    },
    // heading: {
    //     fontSize: theme.typography.pxToRem(15),
    //     fontWeight: theme.typography.fontWeightRegular,
    // },
    // iconButton: {
    //     padding: 10,
    // },
    // paper: {
    //     "display": "flex",
    //     "flexDirection": "column",
    //     "flexFlow": "column",
    //     "height": "calc(100% - 90px)",
    //     "@global": {
    //         "*::-webkit-scrollbar": {
    //             width: "6px",
    //         },
    //         "*::-webkit-scrollbar-track": {
    //             "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    //             "borderRadius": "5px",
    //         },
    //         "*::-webkit-scrollbar-thumb": {
    //             backgroundColor: "rgba(0,96,100,.6)",
    //             borderRadius: "5px",
    //         },
    //     },
    //     // maxHeight: "calc(100vh - 90px - 220px)",
    //     "height": "calc(100vh - 150px)",
    //     "marginTop": "50px",
    //     "maxHeight": "100%",
    //     "overflow": "auto",
    //     "padding": 10,
    //     "width": "60%",
    //     "marginLeft": "20%",
    // },
    // root: {
    //     width: "100%",
    // },
    // container: {
    //     // maxHeight: 440,
    // },
    // img: {
    //     height: 50,
    // },
    // names: {
    //     color: "black",
    //     textDecoration: "none",
    // },
}));

export default function ProfilePage(props) {
    const classes = useStyles();
    const jwt = useSelector(selectJWT);
    const [userData, setUserData] = useState({ data: { attributes: { username: "" } } });
    const [bioFeild, setBioFeild] = useState("");
    let history = useHistory();
    useEffect(() => {
        if (jwt === "") {
            history.push("/");
        }
    });

    useEffect(() => {
        fetch(`http://localhost:3000/users`, {
            headers: {
                token: jwt,
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setUserData(data);
                if (data.data.attributes.bio !== null) {
                    setBioFeild(data.data.attributes.bio);
                }
            });
    }, []);

    return (
        <div className={classes.root}>
            {JSON.stringify(userData)}
            <Paper className={classes.profile}>
                <Typography variant="h5" className={classes.name}>
                    User: {userData.data.attributes.username}
                </Typography>
                <Typography variant="subtitle1" className={classes.bioLabel}>
                    Bio:
                </Typography>
                <Button variant="contained" color="primary" className={classes.saveButton}>
                    Save
                </Button>
                <TextField
                    className={classes.textField}
                    multiline
                    rows={3}
                    variant="outlined"
                    value={bioFeild}
                    onChange={(e) => setBioFeild(e.target.value)}
                />
            </Paper>
            <Paper className={classes.watchlist}></Paper>
        </div>
    );
}
