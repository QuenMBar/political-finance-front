import { useSelector, useDispatch } from "react-redux";
import Logo from "../assets/LOGO.png";
import { logout, selectJWT } from "../redux/loginReducer";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Divider, Menu, MenuItem, Typography } from "@material-ui/core";
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
        marginRight: "4%",
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
        paddingRight: "1%",
        cursor: "pointer",
    },
    searchText: {
        marginTop: 10,
        height: "40px",
        // backgroundColor: theme.palette.primary.light,
    },
    loginText: {
        fontWeight: "normal",
        fontSize: 18,
    },
    loginBttn: {
        paddingTop: 10,
        display: "flex",
        float: "right",
        marginRight: "5%",
        marginLeft: "auto",
        marginTop: 10,
        height: "40px",
    },
    profileIcon: {
        paddingTop: 6,
    },
    menu: {
        width: "180px",
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
            {/* <IconButton className={classes.iconButton} onClick={() => history.push(`/`)} aria-label="home">
                <HomeIcon />
            </IconButton> */}
            <div onClick={() => history.push(`/`)} className={classes.logoDiv}>
                {/* <img src={icon} alt="League Icon" className={classes.icon} /> */}
                <img src={Logo} alt="League of Challenges Logo" className={classes.logo} />
            </div>
            <Divider className={classes.divider} orientation="vertical" flexItem />
            <Button className={classes.searchText}>
                <Typography style={{ textDecoration: "underline", fontSize: 18 }} variant="subtitle1" component="p">
                    Search Database
                </Typography>
            </Button>
            {JWT === "" || JWT === "undefined" ? (
                location.pathname === "/login" ? (
                    <Button onClick={() => history.push(`/login`)} className={classes.loginBttn}>
                        <Typography
                            style={{ fontWeight: "bold", textDecoration: "underline" }}
                            variant="subtitle1"
                            component="p"
                            className={classes.loginText}
                        >
                            Login/Sign Up
                        </Typography>
                    </Button>
                ) : (
                    <Button onClick={() => history.push(`/login`)} className={classes.loginBttn}>
                        <Typography
                            className={classes.loginText}
                            style={{ textDecoration: "underline" }}
                            variant="subtitle1"
                            component="p"
                        >
                            Login/Sign Up
                        </Typography>
                    </Button>
                )
            ) : (
                <Fragment>
                    {location.pathname === "/profile" ? (
                        <Fragment>
                            <Button onClick={handleClick} className={classes.loginBttn}>
                                <Typography
                                    className={classes.loginText}
                                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                                    variant="subtitle1"
                                    component="p"
                                >
                                    {/* <PersonIcon className={classes.profileIcon} /> */}
                                    {JsonWebToken.decode(JWT).user_name}
                                </Typography>
                            </Button>

                            <Menu
                                className={classes.menu}
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    className={classes.menu}
                                    onClick={() => {
                                        history.push(`/profile`);
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    className={classes.menu}
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
                            <Button onClick={handleClick} className={classes.loginBttn}>
                                <Typography
                                    className={classes.loginText}
                                    // onClick={() => history.push(`/profile`)}
                                    style={{ textDecoration: "underline" }}
                                    variant="subtitle1"
                                    component="p"
                                >
                                    {/* <PersonIcon className={classes.profileIcon} /> */}
                                    {JsonWebToken.decode(JWT).user_name}
                                </Typography>
                            </Button>
                            <Menu
                                className={classes.menu}
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    className={classes.menu}
                                    onClick={() => {
                                        history.push(`/profile`);
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    className={classes.menu}
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
