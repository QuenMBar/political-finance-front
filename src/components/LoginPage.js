import { Paper, TextField, Button, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { loginAsync, selectJWT, selectStatus } from "../redux/loginReducer";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: "blue",
        height: "55vh",
        width: "55vw",
        marginLeft: "22.5vw",
        marginTop: "15vh",
    },
    boxes: {
        height: "100%",
        width: "40%",
        display: "inline-block",
        backgroundColor: "#e9c46a",
    },
    innerDiv: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        height: "90%",
        width: "90%",
        margin: "5%",
    },
    bttn: {
        width: "40%",
        marginLeft: "30%",
    },
}));

export default function LoginPage(props) {
    const classes = useStyles();
    const status = useSelector(selectStatus);
    const jwt = useSelector(selectJWT);
    const dispatch = useDispatch();
    const [loginUser, setLoginUser] = useState("");
    const [loginPass, setLoginPass] = useState("");
    const [signUpUser, setSignUpUser] = useState("");
    const [signUpPass, setSignUpPass] = useState("");
    const [signUpStatus, setSignUpStatus] = useState("");
    let history = useHistory();

    useEffect(() => {
        if (jwt !== "") {
            history.push("/");
        }
    });

    const handleSignUp = () => {
        fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    username: signUpUser,
                    password: signUpPass,
                },
            }),
        })
            .then((data) => data.json())
            .then((data) => {
                setSignUpStatus(data.msg);
            });
    };

    return (
        <div className={classes.root}>
            {/* <Button onClick={() => dispatch(logout())}>SignOut</Button> */}
            <Paper style={{ float: "left" }} className={classes.boxes}>
                <div className={classes.innerDiv}>
                    <TextField
                        id="login-name"
                        label="loginName"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        variant="filled"
                        style={{ backgroundColor: "#ffe8d6" }}
                    />
                    <TextField
                        id="login-pass"
                        label="loginPass"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        variant="filled"
                        type="password"
                        style={{ backgroundColor: "#ffe8d6" }}
                    />
                    <Button
                        color="primary"
                        className={classes.bttn}
                        variant="contained"
                        onClick={() => {
                            dispatch(loginAsync({ username: loginUser, password: loginPass }));
                        }}
                    >
                        LOGIN
                    </Button>
                    <Typography>{status === "" ? "Enter your login information" : status}</Typography>
                </div>
            </Paper>
            <Paper style={{ float: "right" }} className={classes.boxes}>
                <div className={classes.innerDiv}>
                    <TextField
                        id="signup-name"
                        label="signupName"
                        value={signUpUser}
                        onChange={(e) => setSignUpUser(e.target.value)}
                        variant="filled"
                        style={{ backgroundColor: "#ffe8d6" }}
                    />
                    <TextField
                        id="signup-pass"
                        label="signupPass"
                        value={signUpPass}
                        onChange={(e) => setSignUpPass(e.target.value)}
                        variant="filled"
                        type="password"
                        style={{ backgroundColor: "#ffe8d6" }}
                    />
                    <Button color="primary" className={classes.bttn} variant="contained" onClick={handleSignUp}>
                        SIGNUP
                    </Button>
                    <Typography>
                        {signUpStatus === "" ? "Enter a username and password to sign up" : signUpStatus}
                    </Typography>
                </div>
            </Paper>
        </div>
    );
}
