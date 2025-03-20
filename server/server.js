const express = require('express');
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: "*", // Allow only your frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
   
const clientBuildPath = path.join(__dirname, "../client/build");

app.use(express.static(clientBuildPath));

app.set('trust proxy', 1);
app.use(helmet());
app.disable("x-powered-by");
app.use(
    helmet.contentSecurityPolicy({
    directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    },
    })
    );

const mongoSantize = require("express-mongo-sanitize");

app.use(mongoSantize());

require('dotenv').config(); //Load env variable
const rateLimit = require("express-rate-limit");

const connectDB = require('./config/db.js'); //import db config
console.log("server", process.env.DB_URL);

const userRouter = require("./routes/userRoutes.js"); //import user routes
const movieRouter = require("./routes/movieRoute.js"); //import movie routes
const theatreRouter = require("./routes/theatreRoute.js"); //import theater routes
const showRouter = require("./routes/showRoute.js"); //import show routes
const bookingRouter = require("./routes/bookingRoute.js"); //import booking routes

connectDB(); //connect to db

const apiLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000, //15 mins
    max: 100,
    message: "Too many requests from this IP, Please try again after 15 mins",
});

//Apply rate limiter to all API routes
app.use("/api/", apiLimiter);

// Routes
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/theatres', theatreRouter);
app.use('/api/shows', showRouter);
app.use('/api/bookings', bookingRouter);

app.use("*", (req,res)=>{
    res.sendFile(path.join(clientBuildPath, "index.html"));
})
const port = process.env.PORT || 8082;
app.listen(port, ()=>{
    console.log("server is running in port 8082");
})

