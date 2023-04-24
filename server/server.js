import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import { DATABASE } from "./config.js";
// import dotenv from 'dotenv';
// import * as dotenv from "dotenv";

import authRoutes from "./routes/auth.js"
import adRoutes from "./routes/ad.js"

// dotenv.config();

const app = express();

// db
mongoose.set('strictQuery', false);
mongoose
// .connect(DATABASE)
.connect(DATABASE)
.then(() => console.log('db_connected'))
.catch(err => console.log(err));


// middlewares
app.use(express.json({ limit: "10mb"}));
app.use(morgan("dev"));
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', adRoutes);

// root URL handler
app.get('/', (req, res) => {
    res.send('Welcome to my homeAlong. server!');
  });

app.listen(8000, () => {
    console.log("Server running on port 8000!");
});