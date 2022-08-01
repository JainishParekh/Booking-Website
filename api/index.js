import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./route/auth.js"
import usersRouter from "./route/users.js"
import hotelsRouter from "./route/hotels.js"
import roomsRouter from "./route/rooms.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
dotenv.config();

const connect = async () => {
    // Here if mongoDB is connected then only the api request is made else no request so that will also cash the app hence error is thrown in catch block.
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error
    }
}

mongoose.connection.on("disconnected" , () => {
    console.log("Disconnected from MongoDB");
})

// mongoose.connection.on("connected" ,  () => {
//     console.log("Connected to MongoDB");
// })

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());


// Remember to always use this middle ware to create the json object using api
app.use(express.json());

app.use("/api/auth" , authRouter);
app.use("/api/users" , usersRouter);
app.use("/api/hotels" , hotelsRouter);
app.use("/api/rooms" , roomsRouter);

// Error Handeling Middleware
app.use((err, req, res, next) => {
    // 500 - status for incorrect network handling
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });
  

// Here instead of 8800 we can write any port number ...
app.listen(8800, () => {
    connect();
    console.log("Connected.");
})