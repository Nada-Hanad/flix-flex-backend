// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware

const morgan = require("morgan");
require("dotenv").config();
const swaggerConfig = require("./config/swaggerConfig");

const fs = require("fs");
const path = require("path");

// Require database connection code from config file
require("./config/dbConfig");

// Require routes from separate routes file
const routesV1 = require("./api/V1/routes");

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Serve Swagger documentation
app.use("/api-docs", swaggerConfig.serve, swaggerConfig.setup);

// Define a log file path
const logFilePath = path.join(__dirname, "logger", "access.log");

// Create a write stream for logging
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Use morgan middleware for logging with combined format and custom log file
app.use(morgan("combined", { stream: logStream }));

// Mount routes under the '/api' base URL
app.use("/api/V1", routesV1);

// Start server
const port = process.env.PORT || 3000; // Use the port from environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
