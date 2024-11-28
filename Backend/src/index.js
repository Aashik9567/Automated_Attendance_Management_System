import connectDb from "./database/db.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())

connectDb().
then(() =>{
    app.listen(process.env.PORT||8080,() => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((error) => console.error("mongodb connection failed!!",error));
// Routes import 
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);