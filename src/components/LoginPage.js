import { Paper, TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { loginAsync, selectJWT, selectStatus } from "../redux/loginReducer";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({}));

export default function LoginPage(props) {
    // const classes = useStyles();
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
        <Fragment>
            {/* <Button onClick={() => dispatch(logout())}>SignOut</Button> */}
            <Paper>
                <TextField
                    id="login-name"
                    label="loginName"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    variant="filled"
                />
                <TextField
                    id="login-pass"
                    label="loginPass"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    variant="filled"
                    type="password"
                />
                <Button
                    onClick={() => {
                        dispatch(loginAsync({ username: loginUser, password: loginPass }));
                    }}
                >
                    LOGIN
                </Button>
                {status === "" ? null : status}
            </Paper>
            <Paper>
                <TextField
                    id="signup-name"
                    label="signupName"
                    value={signUpUser}
                    onChange={(e) => setSignUpUser(e.target.value)}
                    variant="filled"
                />
                <TextField
                    id="signup-pass"
                    label="signupPass"
                    value={signUpPass}
                    onChange={(e) => setSignUpPass(e.target.value)}
                    variant="filled"
                    type="password"
                />
                <Button onClick={handleSignUp}>SIGNUP</Button>
                {signUpStatus === "" ? null : signUpStatus}
            </Paper>
        </Fragment>
    );
}
