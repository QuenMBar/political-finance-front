import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";
import red from "@material-ui/core/colors/red";
import ErrorPage from "./components/ErrorPage";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import ZipCodePage from "./components/ZipCodePage";
import ConToZipPage from "./components/ConToZipPage";
import MapPage from "./components/MapPage";

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

function App() {
    return (
        <div className="App">
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
