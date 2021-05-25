import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../redux/loginReducer";

export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
});
