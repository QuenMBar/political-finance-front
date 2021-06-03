import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ErrorPage from "./components/ErrorPage";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import ZipCodePage from "./components/ZipCodePage";
import ConToZipPage from "./components/ConToZipPage";
import MapPage from "./components/MapPage";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectJWT, getRelationsAsync } from "./redux/loginReducer";
import SearchPage from "./components/SearchPage";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#2a9d8f",
        },
        secondary: {
            main: "#e76f51",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        "@global": {
            "*::-webkit-scrollbar": {
                width: "6px",
            },
            "*::-webkit-scrollbar-track": {
                "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
                "borderRadius": "5px",
            },
            "*::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,96,100,.6)",
                borderRadius: "5px",
            },
        },
        // "backgroundColor": "#264653",
    },
}));

function App() {
    const dispatch = useDispatch();
    const jwt = useSelector(selectJWT);

    useEffect(() => {
        if (jwt !== "") {
            dispatch(getRelationsAsync());
        }
    }, [jwt]);

    const classes = useStyles();
    return (
        <div className={"App " + classes.root}>
            <ThemeProvider theme={theme}>
                <Router>
                    <NavBar />
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <Route path="/profile">
                            <ProfilePage />
                        </Route>
                        <Route path="/search">
                            <SearchPage />
                        </Route>
                        <Route path="/map">
                            <MapPage />
                        </Route>
                        <Route path="/county/:id" render={(props) => <ZipCodePage {...props} />} />
                        <Route path="/zip/:id" render={(props) => <ConToZipPage {...props} />} />
                        <Route path="*">
                            <ErrorPage />
                        </Route>
                    </Switch>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
