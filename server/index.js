import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/authRoute.js";

dotenv.config();

// Enforce strict query filtering to allow only schema-defined fields in queries.
// This prevents the deprecation warning about `strictQuery` in Mongoose 7.
mongoose.set("strictQuery", true);

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Route
app.use("/api/auth", authRouter);

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
