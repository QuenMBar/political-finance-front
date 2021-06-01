import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../redux/loginReducer";
import donationReducer from "../redux/donationReducer";

export const store = configureStore({
    reducer: {
        login: loginReducer,
        donation: donationReducer,
    },
});
