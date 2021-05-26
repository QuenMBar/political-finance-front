import { Paper, Button } from "@material-ui/core";
import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { selectJWT } from "../redux/loginReducer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useHistory, useParams } from "react-router-dom";

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
}));

export default function ZipCodePage() {
    const jwt = useSelector(selectJWT);
    const [countyData, setCountyData] = useState({
        data: { attributes: { name: "", state: "", total_donated: 0 } },
        included: [],
    });
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const history = useHistory();
    let { id } = useParams();

    useEffect(() => {
        const fetchCountyData = () => {
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
        };
        fetchCountyData();
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

    return (
        <Fragment>
            <Paper>
                County: {countyData.data.attributes.name}
                <br />
                State: {countyData.data.attributes.state}
                <br />
                Total Amount For County: {countyData.data.attributes.total_donated}
            </Paper>
            <TableContainer component={Paper}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"small"}
                    aria-label="enhanced table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Zip Code</TableCell>
                            <TableCell align="right">Total Amount Donated</TableCell>
                            {jwt === "" ? null : <TableCell align="right">Add to Watch List</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countyData.included.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                                    <TableCell align="right">{`$${numberWithCommas(
                                        row.attributes.total_donated
                                    )}`}</TableCell>
                                    {jwt === "" ? null : (
                                        <TableCell align="right">
                                            <Button>Select</Button>
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
        </Fragment>
    );
}
