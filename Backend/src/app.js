import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ expanded: true }));


// Routes import 
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);
export { app }