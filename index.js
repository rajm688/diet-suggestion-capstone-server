import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./routes/user.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const MONGOOSE_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGOOSE_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("error in connecting mongoDB"));
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.send("hello world capstone");
});
app.listen(PORT, () => console.log("server connected"));
