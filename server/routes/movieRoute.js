const express =require("express");
const movieRouter = express.Router();
const Movie = require("../models/movieModel");

//Add Movie

movieRouter.post("/add-movie", async (req, res)=>{
    try {
        const newMovie = new Movie(req.body);
        console.log(newMovie);
        await newMovie.save();
        
        
        res.send({
            success: true,
            message: "New Movie has been Added"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//Get All Movies

movieRouter.get("/get-all-movies", async (req, res) => {
    try {
        const allMovies = await Movie.find();
        res.send({
            success: true,
            message: "All movies has been fetched!",
            data: allMovies,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//Update a movie
movieRouter.put("/update-movie", async (req, res) => {
    try {
        await Movie.findByIdAndUpdate(req.body.movieId, req.body);
        res.send({
            success: true,
            message: "Movie Updated",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//Delete a movie
movieRouter.put("/delete-movie", async (req, res) => {
    try{
        await Movie.findByIdAndDelete(req.body.movieId, req.body);
        res.send({
            success: true,
            message: "Movie Deleted",
        })
    }
    catch(error){
        res.send({
            success: false,
            message: error.message,
        })
    }
});

movieRouter.get("/movie/:id", async (req, res)=>{
    try {
        console.log("movie id",req.params.id);
        const movie = await Movie.findById(req.params.id);
        
        
        res.send({
            success: true,
            message: "Movie fetched successfully!",
            data: movie,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});


module.exports = movieRouter;