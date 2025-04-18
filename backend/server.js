const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");

const connectDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/courses", courseRoutes);

const Port = process.env.PORT || 3000;

app.listen(Port, () => console.log(`server is running on port ${Port}`));
