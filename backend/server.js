const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // For security headers
const rateLimiter = require("./middleware/rateLimiter");
const { connectDB } = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./utils/errorHandler");

// Routes
const authRoutes = require("./api/auth");
const reportRoutes = require("./api/reports");
const uploadRoutes = require("./api/uploads");
const paymentRoutes = require("./api/payments");

// Initialize the app
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter); // Apply rate-limiting

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
