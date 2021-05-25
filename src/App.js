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

const theme = createMuiTheme({
    palette: {
        primary: {
            main: cyan[200],
        },
        secondary: red,
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
                        {/* <Route path="/summoner/:name" render={(props) => <SummonerPage {...props} />} /> */}
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
