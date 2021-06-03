import { Paper, Button, Typography, FormControlLabel } from "@material-ui/core";
import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { getRelationsAsync, selectJWT, selectWatchList } from "../redux/loginReducer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useHistory, useParams } from "react-router-dom";
import ControlPanel from "./control-panel";
import { selectChecked } from "../redux/donationReducer";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
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
        // height: "100px",
        marginLeft: "15%",
        marginTop: "1%",
        marginBottom: 0,
    },
    tableContainer: {
        height: "calc(95vh - 280px)",
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
    headers: {
        backgroundColor: "#264653",
        color: "#f1faee",
        paddingTop: 20,
        paddingBottom: 20,
    },
    infoDiv: {
        marginLeft: "15%",
        height: "160px",
        width: "30%",
        position: "relative",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        paddingLeft: 15,
        minWidth: "400px",
    },
    countyBttn: {
        position: "absolute",
        right: 10,
        top: 38,
    },
    countyLabel: {
        position: "absolute",
        right: 34,
        top: 12,
    },
    countyBttnSelect: {
        position: "absolute",
        right: 35,
        top: 38,
    },
    contolPaper: {
        opacity: 0.6,
        background: "rgb(61, 61, 61)",
        // margin: "20px",
        padding: "12px 24px",
        width: "25%",
        height: "160px",
        marginLeft: "15%",
    },
    wrapper: {
        display: "flex",
        height: "160px",
        // marginTop: "1%",
        // position: "relative",
        marginTop: "1%",
        width: "100%",
    },
}));

export default function ZipCodePage() {
    const jwt = useSelector(selectJWT);
    const userWatch = useSelector(selectWatchList);
    const [countyData, setCountyData] = useState({
        data: {
            attributes: { name: "", state: "", total_donated: 0, dem_donation: 0, rep_donation: 0 },
        },
        included: [],
    });
    const dispatch = useDispatch();
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const history = useHistory();
    let { id } = useParams();
    const donationCheck = useSelector(selectChecked);

    useEffect(() => {
        fetch(`http://localhost:3000/counties/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => {
                data.included.sort((a, b) => b.attributes.total_donated - a.attributes.total_donated);
                setCountyData(data);
            });
    }, [id]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                    dispatch(getRelationsAsync());
                }
            });
    };

    const addWatchlistItem = (type, id) => {
        fetch(`http://localhost:3000/link`, {
            headers: {
                "Content-Type": "application/json",
                "token": jwt,
            },
            method: "POST",
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
                    dispatch(getRelationsAsync());
                }
            });
    };

    let totalAmout = 0.0;
    let demAmout = 0.0;
    let repAmout = 0.0;
    if (donationCheck.id) {
        totalAmout += countyData.data.attributes.total_donated;
        demAmout += countyData.data.attributes.dem_donation;
        repAmout += countyData.data.attributes.rep_donation;
    }
    if (donationCheck.org) {
        totalAmout += countyData.data.attributes.total_donated_org;
        demAmout += countyData.data.attributes.dem_donation_org;
        repAmout += countyData.data.attributes.rep_donation_org;
    }
    if (donationCheck.com) {
        totalAmout += countyData.data.attributes.total_donated_com;
        demAmout += countyData.data.attributes.dem_donation_com;
        repAmout += countyData.data.attributes.rep_donation_com;
    }

    return (
        <Fragment>
            <div className={classes.wrapper}>
                <Paper className={classes.infoDiv}>
                    <Typography variant="h6"> County: {countyData.data.attributes.name}</Typography>
                    <Typography>State: {countyData.data.attributes.state}</Typography>
                    <Typography>Total Amount: ${numberWithCommas(totalAmout)}</Typography>
                    <Typography>Dem Amount: ${numberWithCommas(demAmout)}</Typography>
                    <Typography>Rep Amount: ${numberWithCommas(repAmout)}</Typography>
                    {userWatch.find((o) => o.type === countyData.data.type && o.id === countyData.data.id) ===
                    undefined ? (
                        <Fragment>
                            <Typography className={classes.countyLabel}>Watchlist:</Typography>
                            <Button
                                className={classes.countyBttnSelect}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addWatchlistItem(countyData.data.type, countyData.data.id);
                                }}
                            >
                                Select
                            </Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Typography className={classes.countyLabel}>Watchlist:</Typography>
                            <Button
                                className={classes.countyBttn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeWatchlistItem(countyData.data.type, countyData.data.id);
                                }}
                                variant="contained"
                                color="secondary"
                            >
                                Deselect
                            </Button>
                        </Fragment>
                    )}
                </Paper>
                <Paper className={classes.contolPaper}>
                    <ControlPanel className="control-page" />
                </Paper>
            </div>
            <Paper className={classes.watchlist}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={"small"}
                        aria-label="enhanced table"
                        stickyHeader
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headers}>Zip Code</TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Total Amount Donated
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Dem Amount Donated
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Rep Amount Donated
                                </TableCell>
                                {jwt === "" ? null : (
                                    <TableCell className={classes.headers} align="right">
                                        Add to Watch List
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countyData.included
                                .sort((a, b) => {
                                    let totalAmouta = 0.0;
                                    let totalAmoutb = 0.0;
                                    if (donationCheck.id) {
                                        totalAmouta += a.attributes.total_donated;
                                        totalAmoutb += b.attributes.total_donated;
                                    }
                                    if (donationCheck.org) {
                                        totalAmouta += a.attributes.total_donated_org;
                                        totalAmoutb += b.attributes.total_donated_org;
                                    }
                                    if (donationCheck.com) {
                                        totalAmouta += a.attributes.total_donated_com;
                                        totalAmoutb += b.attributes.total_donated_com;
                                    }
                                    return totalAmoutb - totalAmouta;
                                })
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    let totalAmout = 0.0;
                                    let demAmout = 0.0;
                                    let repAmout = 0.0;
                                    if (donationCheck.id) {
                                        totalAmout += row.attributes.total_donated;
                                        demAmout += row.attributes.dem_donation;
                                        repAmout += row.attributes.rep_donation;
                                    }
                                    if (donationCheck.org) {
                                        totalAmout += row.attributes.total_donated_org;
                                        demAmout += row.attributes.dem_donation_org;
                                        repAmout += row.attributes.rep_donation_org;
                                    }
                                    if (donationCheck.com) {
                                        totalAmout += row.attributes.total_donated_com;
                                        demAmout += row.attributes.dem_donation_com;
                                        repAmout += row.attributes.rep_donation_com;
                                    }
                                    return (
                                        <TableRow
                                            onClick={() => history.push(`/zip/${row.id}`)}
                                            key={row.id}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {row.attributes.zip}
                                            </TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(totalAmout)}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(demAmout)}`}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(repAmout)}`}</TableCell>
                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find((o) => o.type === row.type && o.id === row.id) ===
                                                    undefined ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addWatchlistItem(row.type, row.id);
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(row.type, row.id);
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
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={countyData.included.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Fragment>
    );
}
