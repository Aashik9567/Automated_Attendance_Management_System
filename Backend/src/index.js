import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
dotenv.config();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://aams-frontend.onrender.com'], // Allow frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS Middleware (First!)
app.use(cors(corsOptions));

// ✅ Ensure preflight requests are handled properly
app.options('*', cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Import & Use Routes
import userRoutes from "./routes/user.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import holidayRoutes from "./routes/holiday.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/holidays", holidayRoutes);

// ✅ Connect to Database & Start Server
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection failed!", error));
