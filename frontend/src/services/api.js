import axios from "axios";
import TokenService from "./token";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND,
    headers: {
        "Content-Type": "application/json",
    },
});

// Before making request, do the following
instance.interceptors.request.use(
    (config) => {
        // console.log("getLocalAccessToken", TokenService.getLocalAccessToken());
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["x-auth-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;