import connectDb from "./database/db.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
import dotenv from "dotenv";
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
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);