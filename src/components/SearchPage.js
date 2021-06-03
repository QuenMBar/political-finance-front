import {
    Typography,
    Paper,
    Button,
    FormControlLabel,
    TableCell,
    TableRow,
    TableBody,
    Table,
    TableHead,
    TableContainer,
    IconButton,
    InputBase,
    FormGroup,
    Checkbox,
    TablePagination,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { getRelationsAsync, selectJWT, selectWatchList } from "../redux/loginReducer";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "calc(96vh - 60px)",
    },
    profile: {
        width: "40%",
        height: "120px",
        marginLeft: "15%",
        marginTop: "1.5%",
        textAlign: "left",
        backgroundColor: "#F7EACA",
    },
    watchlist: {
        width: "70%",
        height: "calc(calc(94vh - 180px) - 1%)",
        marginLeft: "15%",
        marginTop: "1%",
        marginBottom: 0,
    },
    name: {
        marginLeft: "20px",
        padding: "1%",
        paddingTop: "1%",
    },
    textField: {
        marginLeft: "2%",
        width: "calc(95% - 40px)",
        // height: "80px",
        backgroundColor: "#FCF8ED",
    },
    bioLabel: {
        marginLeft: "2%",
        // display: "inline",
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
    root2: {
        padding: "2px 4px",
        // display: "flex",
        alignItems: "center",
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
        // width: "10px",
    },
    divider: {
        height: 28,
        margin: 4,
    },
    searchDiv: {
        backgroundColor: "#FCF8ED",
        width: "calc(90% - 150px)",
        position: "absolute",
        top: 7,
        left: 130,
    },
    line1: { position: "relative" },
    line2: {
        marginTop: 10,
        marginLeft: 30,
        color: "black",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
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
    tableContainer: {
        height: "calc(95vh - 250px)",
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

export default function SearchPage(props) {
    const classes = useStyles();
    const jwt = useSelector(selectJWT);
    const dispatch = useDispatch();
    const userWatch = useSelector(selectWatchList);
    const [checked, setChecked] = useState({ id: true, zc: true, cou: true, usr: true });
    const [saveChecked, setSaveChecked] = useState({ id: true, zc: true, cou: true, usr: true });
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [saveSearch, setSaveSearch] = useState("");
    let history = useHistory();

    const handleChange = (event) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked });
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

    const getSearch = () => {
        setSaveChecked(checked);
        setSaveSearch(searchText);
        setPage(0);
    };

    useEffect(() => {
        fetch(`http://localhost:3000/search`, {
            headers: {
                "Content-Type": "application/json",
                "search": saveSearch,
                "options": JSON.stringify(saveChecked),
                "page": page + 1,
                "rowsPerPage": rowsPerPage,
            },
            method: "GET",
        })
            .then((resp) => resp.json())
            .then((data) => {
                setResults(data);
            });
    }, [saveSearch, page, rowsPerPage, saveChecked]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // console.log(results);

    return (
        <div className={classes.root}>
            <Paper className={classes.profile}>
                <div className={classes.line1}>
                    <Typography variant="h5" className={classes.name}>
                        Search:
                    </Typography>
                    <Paper className={classes.searchDiv}>
                        <InputBase
                            className={classes.textField}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search The Database"
                            inputProps={{ "aria-label": "Search The Database" }}
                        />
                        <IconButton onClick={getSearch} className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div className={classes.line2}>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox size="small" checked={checked.id} onClick={handleChange} name="id" />}
                            label="Individual Donations"
                        />
                        <FormControlLabel
                            control={<Checkbox size="small" checked={checked.zc} onChange={handleChange} name="zc" />}
                            label="Zip Code"
                        />
                        <FormControlLabel
                            control={<Checkbox size="small" checked={checked.cou} onChange={handleChange} name="cou" />}
                            label="County"
                        />
                        {/* <FormControlLabel
                            control={<Checkbox size="small" checked={checked.usr} onChange={handleChange} name="com" />}
                            label="Committee Donations"
                        /> */}
                    </FormGroup>
                </div>
            </Paper>
            {/* {JSON.stringify(results)} */}
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
                                <TableCell className={classes.headers}>Type</TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Name
                                </TableCell>
                                <TableCell className={classes.headers} align="right">
                                    Amount
                                </TableCell>
                                {jwt === "" ? null : (
                                    <TableCell className={classes.headers} align="right">
                                        Watch List
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((row) => {
                                if (row.type === "IndividualDonation") {
                                    return (
                                        <TableRow
                                            // onClick={() => history.push(`/zip/${row.id}`)}
                                            key={row.object.id}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {row.type}
                                            </TableCell>
                                            <TableCell align="right">{row.object.name}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                row.object.amount
                                            )}`}</TableCell>

                                            {/* <TableCell align="right">{committee.attributes.comm_party}</TableCell>
                                            <TableCell align="right">{committee.attributes.comm_name}</TableCell>
                                            <TableCell align="right">{`${row.attributes.city}, ${row.attributes.state},  ${row.attributes.zip}`}</TableCell>
                                            <TableCell align="right">{`${row.attributes.employ}, ${row.attributes.occu}`}</TableCell> */}
                                            {/* <TableCell align="right">
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
                                            </TableCell> */}

                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) =>
                                                            o.type === "individual_donation" &&
                                                            o.id === row.object.id.toString()
                                                    ) === undefined ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addWatchlistItem(row.type, row.object.id);
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(row.type, row.object.id);
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
                                } else if (row.type === "County") {
                                    return (
                                        <TableRow
                                            onClick={() => history.push(`/county/${row.object.fids}`)}
                                            key={row.object.fids}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {row.type}
                                            </TableCell>
                                            <TableCell align="right">{row.object.name}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                row.object.total_donated
                                            )}`}</TableCell>

                                            {/* <TableCell align="right">{committee.attributes.comm_party}</TableCell>
                                            <TableCell align="right">{committee.attributes.comm_name}</TableCell>
                                            <TableCell align="right">{`${row.attributes.city}, ${row.attributes.state},  ${row.attributes.zip}`}</TableCell>
                                            <TableCell align="right">{`${row.attributes.employ}, ${row.attributes.occu}`}</TableCell> */}
                                            {/* <TableCell align="right">
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
                                            </TableCell> */}

                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) => o.type === "county" && o.id === row.object.fids
                                                    ) === undefined ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addWatchlistItem(row.type, row.object.fids);
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(row.type, row.object.fids);
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
                                } else {
                                    return (
                                        <TableRow
                                            onClick={() => history.push(`/zip/${row.object.zip}`)}
                                            key={row.object.zip}
                                            hover
                                            tabIndex={-1}
                                        >
                                            <TableCell component="th" scope="row" paddingRight="10px">
                                                {row.type}
                                            </TableCell>
                                            <TableCell align="right">{row.object.zip}</TableCell>
                                            <TableCell align="right">{`$${numberWithCommas(
                                                row.object.total_donated
                                            )}`}</TableCell>

                                            {/* <TableCell align="right">{committee.attributes.comm_party}</TableCell>
                                            <TableCell align="right">{committee.attributes.comm_name}</TableCell>
                                            <TableCell align="right">{`${row.attributes.city}, ${row.attributes.state},  ${row.attributes.zip}`}</TableCell>
                                            <TableCell align="right">{`${row.attributes.employ}, ${row.attributes.occu}`}</TableCell> */}
                                            {/* <TableCell align="right">
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
                                            </TableCell> */}

                                            {jwt === "" ? null : (
                                                <TableCell align="right">
                                                    {userWatch.find(
                                                        (o) => o.type === "zip_code" && o.id === row.object.zip
                                                    ) === undefined ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addWatchlistItem(row.type, row.object.zip);
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWatchlistItem(row.type, row.object.zip);
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
                                }
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
        </div>
    );
}
