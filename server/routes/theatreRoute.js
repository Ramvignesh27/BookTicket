const router = require("express").Router();

const Theatre = require("../models/theatreModel");

//Add Theatre
router.post("/add-theatre", async (req, res)=>{
    try {
        const newTheatre = new Theatre(req.body);
        
        await newTheatre.save();
        res.send({
            success: true,
            message: "New theatre has beed added!",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//update Theatre
router.put("/update-theatre", async (req, res)=>{
    try {
        await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
        res.send({
            success: true,
            message: "Theatre has been updated!",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//delete Theatre
router.delete("/delete-theatre/:theatreId", async (req, res)=>{
    try {
        await Theatre.findByIdAndDelete(req.params.theatreId);
        res.send({
            success: true,
            message: "Theatre has been deleted!",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Get all theatres for admin route
router.get("/get-all-theatres", async (req, res)=>{
    try {
        const allTheatres = await Theatre.find().populate("owner");
        
        res.send({
            success: true,
            message: "All theatre fetched!",
            data: allTheatres,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Get theatres of specific owner
router.get("/get-all-theatres-by-owner/:ownerId", async (req, res)=>{
    try {
        const allTheatres = await Theatre.find({owner: req.params.ownerId});
        res.send({
            success: true,
            message: "All theatre fetched!",
            data: allTheatres,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

module.exports = router;