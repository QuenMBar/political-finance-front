import { useSelector, useDispatch } from "react-redux";
import Logo from "../assets/LOGO.png";
import { logout, selectJWT } from "../redux/loginReducer";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory, useLocation } from "react-router-dom";
import { Divider, Menu, MenuItem, Typography } from "@material-ui/core";
import { Fragment } from "react";
import JsonWebToken from "jsonwebtoken";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "2px 4px",
        display: "flex",
        whiteSpace: "nowrap",
        // alignItems: "center",
        // marginLeft: "20%",
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        height: "60px",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        height: 50,
        padding: 15,
        paddingTop: 20,
        // display: "inline-block",
        float: "left",
        paddingRight: "1%",
        marginRight: "1%",
    },
    divider: {
        height: 28,
        margin: 4,
    },
    searchDiv: {
        height: 40,
        width: 400,
        // justifyContent: "right",
        display: "flex",
        float: "right",
        marginRight: "10%",
        marginLeft: "auto",
        marginTop: 7.5,
    },
    logo: {
        height: 60,
    },
    logoDiv: {
        // display: "inline-block",
        paddingLeft: "1%",
        paddingRight: "5%",
    },
    searchText: {
        paddingTop: 12,
    },
    loginText: {
        paddingTop: 12,
        display: "flex",
        float: "right",
        marginRight: "5%",
        marginLeft: "auto",
        cursor: "pointer",
        fontWeight: "normal",
    },
    profileIcon: {
        paddingTop: 6,
        // display: "flex",
        // float: "right",
        // marginRight: "5%",
        // marginLeft: "auto",
        // cursor: "pointer",
        // fontWeight: "normal",
    },
}));

export default function NavBar(props) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const JWT = useSelector(selectJWT);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper className={classes.root}>
            {/* <IconButton className={classes.iconButton} onClick={() => dispatch(logout())} aria-label="home">
                <HomeIcon />
            </IconButton> */}
            <IconButton className={classes.iconButton} onClick={() => history.push(`/`)} aria-label="home">
                <HomeIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <div className={classes.logoDiv}>
                {/* <img src={icon} alt="League Icon" className={classes.icon} /> */}
                <img src={Logo} alt="League of Challenges Logo" className={classes.logo} />
            </div>
            <Typography variant="h6" component="h6" className={classes.searchText}>
                Search Database
            </Typography>
            {JWT === "" || JWT === "undefined" ? (
                location.pathname === "/login" ? (
                    <Typography
                        style={{ fontWeight: "bold" }}
                        onClick={() => history.push(`/login`)}
                        variant="h6"
                        component="h6"
                        className={classes.loginText}
                    >
                        Login/Sign Up
                    </Typography>
                ) : (
                    <Typography
                        onClick={() => history.push(`/login`)}
                        variant="h6"
                        component="h6"
                        className={classes.loginText}
                    >
                        Login/Sign Up
                    </Typography>
                )
            ) : (
                <Fragment>
                    {location.pathname === "/login" ? (
                        <Fragment>
                            <Typography
                                style={{ fontWeight: "bold" }}
                                onClick={handleClick}
                                variant="h6"
                                component="h6"
                                className={classes.loginText}
                            >
                                <PersonIcon className={classes.profileIcon} />
                                {JsonWebToken.decode(JWT).user_name}
                            </Typography>
                            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        history.push(`/profile`);
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        dispatch(logout());
                                        handleClose();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Typography
                                // onClick={() => history.push(`/profile`)}
                                onClick={handleClick}
                                variant="h6"
                                component="h6"
                                className={classes.loginText}
                            >
                                <PersonIcon className={classes.profileIcon} />
                                {JsonWebToken.decode(JWT).user_name}
                            </Typography>
                            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        history.push(`/profile`);
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        dispatch(logout());
                                        handleClose();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Fragment>
                    )}
                </Fragment>
            )}

            {/* <Paper className={classes.searchDiv}>
                <InputBase
                    className={classes.input}
                    placeholder="Search Your Summoner Name"
                    value={search}
                    onChange={(data) => setSearch(data.target.value)}
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper> */}
        </Paper>
    );
}
