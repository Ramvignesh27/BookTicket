/***
 * SMTP servers = simple mail transfer protocol
 * how smtp servers works
 *  1. writing the email ( composing the letter)
 * 2. sending to SMTP server ( dropping at the post office )
 * 3. routing the email ( post office will route the email to the destination)
 * 4. recipient email serv ( destination post office)
 * 5. emai; deliver ( mailbox deliver)
 *
 * nodemailer
 */

const router = require("express").Router();
const stripe = require("stripe")("sk_test_51R3umLCKrGgsmNPKSolufqUtkP65zeStw2rljAmqe9iVsjT9vQd8K48kunT3xTJS2VypaJIQgganhT7o12camXg800ofwZnDmx");
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const EmailHelper = require("../utils/emailHelper")

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    console.log("make payment",req.body);
    
    const { token, amount } = req.body;
    
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Movie Ticket Booking",
      confirm: true,
    });
    console.log(paymentIntent);
    
    const transactionId = paymentIntent.id;
    res.send({
      success: true,
      message: "Payment Successful",
      data: transactionId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });
     //addingmoredetailstothebooking
        const populatedBooking=await Booking.findById(newBooking._id)
        .populate("user")
        .populate("show")
        .populate({
            path:"show",
            populate:{
            path:"movie",
            model:"movies",
        },
        })
        .populate({
            path:"show",
            populate:{
            path:"theatre",
            model:"theatre",
        },
        });
        // console.log("thisispopulatedBooking",populatedBooking);
        //console.log(populatedBooking.user.email);
        
        await EmailHelper("ticketTemplate.html",populatedBooking.user.email,{
                  name: populatedBooking.user.name,
                  movie: populatedBooking.show.movie.title,
                  theatre: populatedBooking.show.theatre.name,
                  date: populatedBooking.show.date,
                  time: populatedBooking.show.time,
                  seats: populatedBooking.seats,
                  amount: populatedBooking.seats.length*populatedBooking.show.ticketPrice,
                  transactionId: populatedBooking.transactionId,
        });
        res.send({
            success:true,
            message:"NewBookingdone!",
            data:populatedBooking,
        });
        }catch(err){
            console.log(err);
            res.send({
            success:false,
            message:"Failedtobookshow",
        });
 }
});

router.get("/get-all-bookings/:userId", authMiddleware, async (req, res) => {
  try {
    const data = await Booking.find({ user: req.params.userId });
    console.log(data);
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatre",
        },
      });
      
    res.send({
      success: true,
      message: "All bookings fetched",
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;