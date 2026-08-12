console.log("SERVER STARTING...");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const summaryRoutes = require("./routes/summaryRoutes");  
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect DB lazily/asynchronously
connectDB();

app.use(morgan("dev"));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChroniLens Backend Running 🚀",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "ChroniLens API Endpoint Ready 🚀",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/symptoms", require("./routes/symptomRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/summary", require("./routes/summaryRoutes"));
app.use("/api/detective", require("./routes/detectiveRoutes"));
app.use("/api/trends", require("./routes/trendRoutes"));
app.use("/api/timeline", require("./routes/timelineRoutes"));
app.use("/api/clues", require("./routes/clueRoutes"));
app.use("/api/doctor-summary", require("./routes/doctorSummaryRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Start listening if running as standalone server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;