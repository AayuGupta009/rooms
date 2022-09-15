// Dependencies
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/routes.auth");
const postRoutes = require("./routes/routes.post");
// App set Up
const app = express();
const port = process.env.PORT;

// Connecting with MongoDB
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    autoIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("Database is Connected!!!");
  }
);
// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", postRoutes);

// Running Server
app.listen(port, () => console.log(`Backend Server running ON : ${port}`));
