const router = require("express").Router();

const Show = require("../models/showModel");

//Add Show
router.post("/add-show", async (req, res) =>{
    try {
        const newShow = new Show(req.body);
        await newShow.save();
        res.send({
            success: true,
            message: "New show has been added",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Delete Show
router.delete("/delete-show/:showId", async (req, res) =>{
    try {
        await Show.findByIdAndDelete(req.params.showId);
        res.send({
            success: true,
            message: "The show has been deleted!",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Update Show
router.put("/update-show", async (req, res) =>{
    try {
        await Show.findByIdAndUpdate(req.body.showId, req.body);
        res.send({
            success: true,
            message: "The show has been updated!",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//get all Show by theatre
router.get("/get-all-shows-by-theatre/:theatreId", async (req, res) =>{
    try {
        
        const shows = await Show.find({theatre: req.params.theatreId}).populate("movie");
        
        res.send({
            success: true,
            message: "The show has been updated!",
            data: shows,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Get All theatres by movie which has some shows
router.get("/get-all-theatres-by-movie/:movie/:date", async (req, res) => {
    /**
     * it retireves all shows od the specified movie and date from the database
     * it then filters out unique theatres from the shows and organizes shows under each unique theatre
     * A - [show1, show2, show3]
     * B - [show4, show5, show6]
     * C - [show7, show8, show9]
     * shows - [show1, show2, show3, show4, show5, show6, show7, show8, show9]
     * [A-[show1, show2], B-[show4 show6], C-[ show8, show9]]
     * */
  
    try {
      const { movie, date } = req.params;
      console.log("movie", movie, "date", date);
      const shows = await Show.find({ movie, date }).populate("theatre");
      console.log("shows", shows);
      const uniqueTheatres = [];
      shows.forEach((show) => {
        const isTheatre = uniqueTheatres.findIndex(
          (theatre) => theatre._id === show.theatre._id
        );
        console.log("isTheatre", isTheatre);
        if (isTheatre < 0) {
          const showsOfThisTheatre = shows.filter(
            (showObj) => showObj.theatre._id === show.theatre._id
          );
          uniqueTheatres.push({
            ...show.theatre._doc,
            shows: showsOfThisTheatre,
          });
        }
      });
      console.log("uniqueTheatres", uniqueTheatres);
      res.send({
        success: true,
        data: uniqueTheatres,
        message: "Shows fetched successfully",
      });
    } catch (err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    }
  });

router.get("/get-show-by-id/:showId", async(req, res)=>{
    try {
        console.log("show request", req.params.showId);
        
        const show = await Show.findById(req.params.showId).populate("movie").populate("theatre");
        res.send({
            success: true,
            message: "Show fetched!",
            data: show,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

module.exports = router;