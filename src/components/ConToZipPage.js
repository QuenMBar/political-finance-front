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

export default function ConToZipPage() {
    const jwt = useSelector(selectJWT);
    const [donationData, setDonationData] = useState({ data: [], included: [] });
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    let { id } = useParams();

    useEffect(() => {
        const fetchCountyData = () => {
            fetch(`http://localhost:3000/zip_codes/${id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "page": page + 1,
                    "amount": rowsPerPage,
                },
            })
                .then((data) => data.json())
                .then((data) => {
                    setDonationData(data);
                });
        };
        fetchCountyData();
    }, [page, rowsPerPage, id]);

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

    const handleLink = (id) => {
        fetch("http://localhost:3000/addlink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": jwt,
            },
            body: JSON.stringify({
                user: {
                    type: "county",
                    id: id,
                },
            }),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
            });
    };

    return (
        <Fragment>
            <Paper>Donations for {id}</Paper>
            <TableContainer component={Paper}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"small"}
                    aria-label="enhanced table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Total Amount Donated</TableCell>
                            <TableCell align="right">Entity Type</TableCell>
                            <TableCell align="right">Committee</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Employment</TableCell>
                            <TableCell align="right">Date</TableCell>
                            {jwt === "" ? null : <TableCell align="right">Add to Watch List</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donationData.data.map((row) => {
                            return (
                                <TableRow
                                    // onClick={() => history.push(`/county/${row.id}`)}
                                    key={row.id}
                                    hover
                                    tabIndex={-1}
                                >
                                    <TableCell component="th" scope="row" paddingRight="10px">
                                        {row.attributes.name}
                                    </TableCell>
                                    <TableCell align="right">{`$${numberWithCommas(row.attributes.amount)}`}</TableCell>
                                    <TableCell align="right">{row.attributes.entity_type}</TableCell>
                                    <TableCell align="right">
                                        {
                                            donationData.included.find(
                                                (c) => c.id === row.relationships.committee.data.id
                                            ).attributes.comm_name
                                        }
                                    </TableCell>
                                    <TableCell align="right">{`${row.attributes.city}, ${row.attributes.state},  ${row.attributes.zip}`}</TableCell>
                                    <TableCell align="right">{`${row.attributes.employ}, ${row.attributes.occu}`}</TableCell>
                                    <TableCell align="right">{row.attributes.date}</TableCell>
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
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={3223}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Fragment>
    );
}
