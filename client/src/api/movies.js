import {axiosInstance} from "./index";

//get All movies

export const getAllMovies = async () =>{
    try{
        const response  = await axiosInstance.get("api/movies/get-all-movies");
        return response.data;
    }
    catch (error){
        console.error(error);
    }
}

//Add a movie

export const addMovie = async (values) =>{
    try{
        console.log(values);
        const response  = await axiosInstance.post("api/movies/add-movie", values);
        return response.data;
    }
    catch (error){
        console.error(error);
    }
}

//Update a movie

export const updateMovie = async (payload) =>{
    try{
        const response  = await axiosInstance.put("api/movies/update-movie", payload);
        return response.data;
    }
    catch (error){
        console.error(error);
    }
}

//Delete a movie

export const deleteMovie = async (payload) =>{
    try{
        const response  = await axiosInstance.put("api/movies/delete-movie", payload);
        return response.data;
    }
    catch (error){
        console.error(error);
    }
}

//Get a single movie by its Id

export const getMovieById = async (id) =>{
    try {
        const response = await axiosInstance.get(`api/movies/movie/${id}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}
 