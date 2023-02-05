import {createContext, useContext, useState} from "react";
import {auth} from "../index";

const userContext = createContext({
    user: null
});

const useAuth = () => {
    return useContext(userContext);
}