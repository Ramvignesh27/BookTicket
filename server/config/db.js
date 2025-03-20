const mongoose = require("mongoose");

//driver
const dbURL = process.env.DB_URL;
console.log(dbURL);

const connectDB = async ()=>{
    try {
        await mongoose.connect(dbURL);
        console.log("connecting to db");
        
    } catch (error) {
        console.log(error);
        
    }
};

module.exports = connectDB;
