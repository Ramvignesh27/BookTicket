import {axiosInstance} from "./index";

//Add Theatre
export const addTheatre  = async (payload) =>{
    try {
        const response = await axiosInstance.post("/api/theatres/add-theatre", payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//Get all theatres for the admin route
export const getAllTheatresForAdmin  = async () =>{
    try {
        console.log("get all theatres");
        
        const response = await axiosInstance.get("/api/theatres/get-all-theatres");
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//Get theatres for specific owners
export const getAllTheatres  = async (ownerId) =>{
    try {
        console.log("get all theatres by owner");
        
        const response = await axiosInstance.get(`/api/theatres/get-all-theatres-by-owner/${ownerId}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//Update Theatre
export const updateTheatre  = async (payload) =>{
    try {
        const response = await axiosInstance.put("/api/theatres/update-theatre", payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//Delete Theatre
export const deleteTheatre  = async (payload) =>{
    try {
        console.log(payload);
        
        const response = await axiosInstance.delete(`/api/theatres/delete-theatre/${payload.theatreId}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}
