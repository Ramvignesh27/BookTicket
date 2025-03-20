import axios from "axios";

export const axiosInstance = axios.create({
    headers:  {
        "Content-Type": "application/json",
    },
    baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
    function(config){
        const token = localStorage.getItem("token");
        if(token){
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    function(err){
        return Promise.reject(err);
    }
)