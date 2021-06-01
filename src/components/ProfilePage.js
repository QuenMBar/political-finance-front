import { Typography, Paper, TextField, Button, FormControlLabel, Switch } from "@material-ui/core";
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
import { isEqual } from "lodash";

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
        backgroundColor: "#e9c46a",
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
        paddingTop: "1%",
        display: "inline-block",
    },
    textField: {
        marginLeft: "2%",
        width: "96%",
        // height: "80px",
        backgroundColor: "#ffe8d6",
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
    switch: {
        marginRight: "2%",
        float: "right",
        height: "25px",
        paddingTop: "3%",
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
    const [checked, setChecked] = useState(true);
    let history = useHistory();
    useEffect(() => {
        if (jwt === "") {
            history.push("/");
        }
    });

    useEffect(() => {
        if (!isEqual(userData, { data: { attributes: { username: "" } } })) {
            fetch(`http://localhost:3000/users/priv`, {
                headers: {
                    "Content-Type": "application/json",
                    "token": jwt,
                },
                method: "PUT",
                body: JSON.stringify({
                    user: {
                        state: checked,
                    },
                }),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setUserData(data);
                    setChecked(data.data.attributes.privacy);
                });
        }
    }, [checked]);

    useEffect(() => {
        fetch(`http://localhost:3000/users`, {
            headers: {
                token: jwt,
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setUserData(data);
                setChecked(data.data.attributes.privacy);
                if (data.data.attributes.bio !== null) {
                    setBioFeild(data.data.attributes.bio);
                }
            });
    }, []);

    const updateBio = () => {
        fetch(`http://localhost:3000/users/bio`, {
            headers: {
                "Content-Type": "application/json",
                "token": jwt,
            },
            method: "PUT",
            body: JSON.stringify({
                user: {
                    bio: bioFeild,
                },
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setUserData(data);
                if (data.data.attributes.bio !== null) {
                    setBioFeild(data.data.attributes.bio);
                }
            });
    };

    return (
        <div className={classes.root}>
            {JSON.stringify(userData)}
            <Paper className={classes.profile}>
                <Typography variant="h5" className={classes.name}>
                    User: {userData.data.attributes.username}
                </Typography>
                <FormControlLabel
                    className={classes.switch}
                    control={
                        <Switch
                            checked={checked}
                            onChange={(e) => setChecked(!checked)}
                            name="privacy"
                            color="primary"
                        />
                    }
                    label={checked ? "Private" : "Public"}
                />
                <br />
                <Typography variant="subtitle1" className={classes.bioLabel}>
                    Bio:
                </Typography>
                <Button variant="contained" color="primary" onClick={() => updateBio()} className={classes.saveButton}>
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
