const express =require("express");

const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const auth = require("../middlewares/authMiddleware.js");
const EmailHelper = require("../utils/emailHelper.js");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res)=>{
    try {
        const userExists = await User.findOne({email: req.body.email});
        console.log(req.body);
        
        if(userExists){
            return res.send({
                success: false,
                message: "User Already Exists",
            });
        }
         //Hashthepassword
        const saltRounds=10;//Thehigherthenumber,themoresecurebutslower thehashingprocess
        const hashedPassword=await bcrypt.hash(req.body.password,saltRounds);
        const newUser = new User({...req.body, password:hashedPassword,});
        await newUser.save();

        res.send({
            success: true,
            message: "Registration is successful, please login",
        })
    } catch (error) {
        console.log(error);
        
    }
})

userRouter.post("/login", async (req, res)=>{
    try {
        console.log(req.body);
        
        const user = await User.findOne({email: req.body.email});
        const token = jwt.sign({userId: user._id}, process.env.jwt_secret, {expiresIn: "1d"});
        if(!user){
            return res.send({
                success: false,
                message: "User does not Exists, Please Register.",
            });
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
        return res.send({
                success:false,
                message:"InvalidCredentials",
                });
        }

        res.send({
            success: true,
            message: "You've successfully logged in!",
            data: token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "An Error occurred, Please try again later."
        })
    }
})

userRouter.get('/get-current-user', auth, async (req, res)=>{
    const user = await User.findById(req.body.userId).select("-password");

    res.send({
        success: true,
        message: "You are authorized to go to protected route!",
        data: user,
    });
});

const otpGenerator = function () {
    return Math.floor(100000 + Math.random() * 900000); // ranger from 100000 to 999999
  };
  
  userRouter.patch("/forgetpassword", async (req, res) => {
    console.log("forget password");
    try {
      if (req.body.email === undefined) {
        return res
          .status(401)
          .json({ status: "failure", message: "Email is required" });
      }
      const user = await User.findOne({ email: req.body.email });
      if (user == null) {
        return res
          .status(404)
          .json({ status: "failure", message: "User not found" });
      }
      const otp = otpGenerator(); // 123456
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
      res
        .status(200)
        .json({ status: "success", message: "OTP sent to your email" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
  
  userRouter.patch("/resetpassword/:email", async (req, res) => {
    try {
      const resetDetails = req.body;
      if (!req.params.email || !resetDetails.otp) {
        return res
          .status(400)
          .json({ success: false, message: "Email and OTP are required" });
      }
      const user = await User.findOne({ email: req.params.email });
      if (user == null) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // if otp is expired
      if (Date.now() > user.otpExpiry) {
        return res
          .status(401)
          .json({ success: false, message: "OTP has expired" });
      }
      user.password = resetDetails.password;
      user.otp = undefined;
      user.otpExpiry = undefined;
  
      await user.save();
  
      res
        .status(200)
        .json({ status: "success", message: "Password reset successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

module.exports = userRouter;