import { Paper, Button, Typography } from "@material-ui/core";
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

export default function ConToZipPage() {
    const jwt = useSelector(selectJWT);
    const userWatch = useSelector(selectWatchList);
    const [donationData, setDonationData] = useState({
        zip: {
            data: {
                attributes: { zip: "", total_donated: 0, dem_donation: 0, rep_donation: 0 },
            },
            included: [{ attributes: { name: "", state: "" } }],
        },
        id: { data: [], included: [] },
    });
    const dispatch = useDispatch();
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [maxPage, setMaxPage] = React.useState(1);
    const history = useHistory();
    const donationCheck = useSelector(selectChecked);

    let { id } = useParams();

    // useEffect(() => {
    //     const fetchCountyData = () => {
    //         fetch(`http://localhost:3000/counties/${id}`, {
    //             method: "get",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         })
    //             .then((data) => data.json())
    //             .then((data) => {
    //                 console.log(data);
    //                 data.included.sort((a, b) => b.attributes.total_donated - a.attributes.total_donated);
    //                 setCountyData(data);
    //             });
    //     };
    //     fetchCountyData();
    // }, [id]);

    useEffect(() => {
        fetch(`http://localhost:3000/zip_codes/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "page": page + 1,
                "amount": rowsPerPage,
                "donationCheck": JSON.stringify(donationCheck),
            },
        })
            .then((data) => data.json())
            .then((data) => {
                // console.log(data.zip.included[0].attributes.name);
                setDonationData(data);
            });
    }, [page, rowsPerPage, id, donationCheck]);

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

    return (
        <Fragment>
            <div className={classes.wrapper}>
                <Paper className={classes.infoDiv}>
                    <Typography variant="h6"> County: {donationData.zip.data.attributes.zip}</Typography>
                    <Typography>
                        County/State: {donationData.zip.included[0].attributes.name},{" "}
                        {donationData.zip.included[0].attributes.state}
                    </Typography>
                    <Typography>
                        Total Amount: ${numberWithCommas(donationData.zip.data.attributes.total_donated)}
                    </Typography>
                    <Typography>
                        Dem Amount: ${numberWithCommas(donationData.zip.data.attributes.dem_donation)}
                    </Typography>
                    <Typography>
                        Rep Amount: ${numberWithCommas(donationData.zip.data.attributes.rep_donation)}
                    </Typography>
                    {userWatch.find(
                        (o) => o.type === donationData.zip.data.type && o.id === donationData.zip.data.id
                    ) === undefined ? (
                        <Fragment>
                            <Typography className={classes.countyLabel}>Watchlist:</Typography>
                            <Button
                                className={classes.countyBttnSelect}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addWatchlistItem(donationData.zip.data.type, donationData.zip.data.id);
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
                                    removeWatchlistItem(donationData.data.type, donationData.data.id);
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
                                <TableCell className={classes.headers}>Name</TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Total Amount Donated
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Entity Type
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Party
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Committee
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Location
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Employment
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
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
                            {donationData.id.data.map((row) => {
                                let committee = donationData.id.included.find(
                                    (c) => c.id === row.relationships.committee.data.id
                                );
                                return (
                                    <TableRow
                                        // onClick={() => history.push(`/zip/${row.id}`)}
                                        key={row.id}
                                        hover
                                        tabIndex={-1}
                                    >
                                        <TableCell component="th" scope="row" paddingRight="10px">
                                            {row.attributes.name}
                                        </TableCell>
                                        <TableCell align="right">{`$${numberWithCommas(
                                            row.attributes.amount
                                        )}`}</TableCell>
                                        <TableCell align="right">{row.attributes.entity_type}</TableCell>
                                        <TableCell align="right">{committee.attributes.comm_party}</TableCell>
                                        <TableCell align="right">{committee.attributes.comm_name}</TableCell>
                                        <TableCell align="right">{`${row.attributes.city}, ${row.attributes.state},  ${row.attributes.zip}`}</TableCell>
                                        <TableCell align="right">{`${row.attributes.employ}, ${row.attributes.occu}`}</TableCell>
                                        <TableCell align="right">
                                            {`${row.attributes.date
                                                .toString()
                                                .substring(
                                                    row.attributes.date.toString().length - 8,
                                                    row.attributes.date.toString().length - 6
                                                )}-${row.attributes.date
                                                .toString()
                                                .substring(
                                                    row.attributes.date.toString().length - 6,
                                                    row.attributes.date.toString().length - 4
                                                )}-${row.attributes.date
                                                .toString()
                                                .substring(row.attributes.date.toString().length - 4)}`}
                                        </TableCell>

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
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Fragment>
    );
}
