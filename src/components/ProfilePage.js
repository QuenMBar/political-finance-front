import {
    Typography,
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    TableCell,
    TableRow,
    TableBody,
    Table,
    TableHead,
    TableContainer,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { getRelationsAsync, selectJWT, selectWatchList } from "../redux/loginReducer";
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
        marginTop: "1.5%",
        textAlign: "left",
        backgroundColor: "#e9c46a",
    },
    watchlist: {
        width: "70%",
        height: "calc(calc(94vh - 260px) - 1%)",
        marginLeft: "15%",
        marginTop: "1%",
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
    table: {
        // paddingTop: "15px",
    },
    headers: {
        backgroundColor: "#264653",
        color: "#f1faee",
        paddingTop: 20,
        paddingBottom: 20,
    },
}));

export default function ProfilePage(props) {
    const classes = useStyles();
    const jwt = useSelector(selectJWT);
    const dispatch = useDispatch();
    const userWatch = useSelector(selectWatchList);
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
        updateInfo();
    }, []);

    const updateInfo = () => {
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
    };

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

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const removeWatchlistItem = (type, id) => {
        fetch(`http://localhost:3000/link`, {
            headers: {
                "Content-Type": "application/json",
                "token": jwt,
            },
            method: "DELETE",
            body: JSON.stringify({
                user: {
                    type: type,
                    id: id,
                },
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.msg === "done") {
                    updateInfo();
                    dispatch(getRelationsAsync());
                }
            });
    };

    return (
        <div className={classes.root}>
            {/* {JSON.stringify(userData)} */}
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
            {/* <Paper className={classes.watchlist}> */}
            {
                isEqual(userData, { data: { attributes: { username: "" } } }) ? null : (
                    <TableContainer component={Paper} className={classes.watchlist}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={"small"}
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headers}>County Name</TableCell>
                                    <TableCell className={classes.headers}>County State</TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Dem Amount Donated
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Rep Amount Donated
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Total Amount Donated
                                    </TableCell>
                                    {jwt === "" ? null : (
                                        <TableCell align="right" className={classes.headers}>
                                            Add to Watch List
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.data.relationships.counties.data.map((row) => {
                                    let countyInfo = userData.included.find(
                                        (o) => o.type === "county" && o.id === row.id
                                    );
                                    return (
                                        <TableRow
                                            onClick={() => history.push(`/county/${row.id}`)}
                                            key={row.id}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {countyInfo.attributes.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {countyInfo.attributes.state}
                                            </TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                countyInfo.attributes.dem_donation
                                            )}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                countyInfo.attributes.rep_donation
                                            )}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                countyInfo.attributes.total_donated
                                            )}`}</TableCell>
                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) => o.type === countyInfo.type && o.id === countyInfo.id
                                                    ) === undefined ? (
                                                        <Button>Select</Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(countyInfo.type, countyInfo.id);
                                                            }}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Deselect
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={"small"}
                            aria-label="enhanced table"
                        >
                            <TableHead className={classes.headers}>
                                <TableRow>
                                    <TableCell className={classes.headers}>Zip Code</TableCell>
                                    <TableCell className={classes.headers}>County Name</TableCell>
                                    <TableCell className={classes.headers}>County State</TableCell>
                                    <TableCell className={classes.headers} align="right">
                                        Dem Amount Donated
                                    </TableCell>
                                    <TableCell className={classes.headers} align="right">
                                        Rep Amount Donated
                                    </TableCell>
                                    <TableCell className={classes.headers} align="right">
                                        Total Amount Donated
                                    </TableCell>
                                    {jwt === "" ? null : (
                                        <TableCell className={classes.headers} align="right">
                                            Add to Watch List
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.data.relationships.zip_codes.data.map((row) => {
                                    let zipInfo = userData.included.find(
                                        (o) => o.type === "zip_code" && o.id === row.id
                                    );
                                    let countyInfo = userData.included.find(
                                        (o) => o.type === "county" && o.id === zipInfo.relationships.county.data.id
                                    );
                                    return (
                                        <TableRow
                                            onClick={() => history.push(`/zip/${row.id}`)}
                                            key={row.id}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {zipInfo.attributes.zip}
                                            </TableCell>
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {countyInfo.attributes.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {countyInfo.attributes.state}
                                            </TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                zipInfo.attributes.dem_donation
                                            )}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                zipInfo.attributes.rep_donation
                                            )}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                zipInfo.attributes.total_donated
                                            )}`}</TableCell>
                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) => o.type === zipInfo.type && o.id === zipInfo.id
                                                    ) === undefined ? (
                                                        <Button>Select</Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(zipInfo.type, zipInfo.id);
                                                            }}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Deselect
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={"small"}
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headers}>Name</TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Total Amount Donated
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Entity Type
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Party
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Committee
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Location
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Employment
                                    </TableCell>
                                    <TableCell align="right" className={classes.headers}>
                                        Date
                                    </TableCell>
                                    {jwt === "" ? null : (
                                        <TableCell className={classes.headers} align="right">
                                            Watch List
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.data.relationships.individual_donations.data.map((row) => {
                                    let donation = userData.included.find(
                                        (o) => o.type === "individual_donation" && o.id === row.id
                                    );
                                    let committee = userData.included.find(
                                        (o) =>
                                            o.type === "committee" && o.id === donation.relationships.committee.data.id
                                    );
                                    return (
                                        <TableRow
                                            // onClick={() => history.push(`/county/${row.id}`)}
                                            key={row.id}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {donation.attributes.name}
                                            </TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                donation.attributes.amount
                                            )}`}</TableCell>
                                            <TableCell align="right">{donation.attributes.entity_type}</TableCell>
                                            <TableCell align="right">{committee.attributes.comm_party}</TableCell>
                                            <TableCell align="right">{committee.attributes.comm_name}</TableCell>
                                            <TableCell align="right">{`${donation.attributes.city}, ${donation.attributes.state},  ${donation.attributes.zip}`}</TableCell>
                                            <TableCell align="right">{`${donation.attributes.employ}, ${donation.attributes.occu}`}</TableCell>
                                            {/* <TableCell align="right">
                                                {donation.attributes.date
                                                    .toString()
                                                    .substring(
                                                        donation.attributes.date.toString().length - 8,
                                                        donation.attributes.date.toString().length - 6
                                                    )}
                                            </TableCell> */}
                                            <TableCell align="right">
                                                {`${donation.attributes.date
                                                    .toString()
                                                    .substring(
                                                        donation.attributes.date.toString().length - 8,
                                                        donation.attributes.date.toString().length - 6
                                                    )}-${donation.attributes.date
                                                    .toString()
                                                    .substring(
                                                        donation.attributes.date.toString().length - 6,
                                                        donation.attributes.date.toString().length - 4
                                                    )}-${donation.attributes.date
                                                    .toString()
                                                    .substring(donation.attributes.date.toString().length - 4)}`}
                                            </TableCell>
                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) => o.type === donation.type && o.id === donation.id
                                                    ) === undefined ? (
                                                        <Button>Select</Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(donation.type, donation.id);
                                                            }}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Deselect
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
                // {/* </Paper> */}
            }
        </div>
    );
}
