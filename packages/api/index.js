const express = require("express");
const dotenv = require('dotenv');
const logHelper = require("./helpers/logHelper");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const bookRoutes = require("./routes/bookRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const cors = require("cors");

// load env var
dotenv.config().parsed;

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// log incoming req
app.use((req, res, next) => {
  logHelper.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// allow FE local / all
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("API url");
});
app.use("/api/auth", authRoutes); //auth
app.use("/api/wishlist", wishlistRoutes); // wishlist
app.use("/api", bookRoutes); // book
app.use("/api/subscription", subscriptionRoutes); //subscribe


app.use((req, res) => {
  logHelper.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).send("Not Found");
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logHelper.info(`Server running on http://localhost:${PORT}`);
});
