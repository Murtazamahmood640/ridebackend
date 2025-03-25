// routes/LogController.js

const express = require('express');
const router = express.Router();
const Log = require('../../models/Logs/LogSchema');  // Import the Log model for saving logs
const { info, warn, error, debug } = require('../../utils/logger');  // Import logging utility for logging to console/file

// Helper function to save log entry to the database and log it to console/file
const saveLog = async (level, message) => {
  try {
    // Save log to MongoDB
    const log = new Log({
      level,
      message,
      createdAt: new Date(), // Optional: store the date/time of log creation
    });

    await log.save();  // Save the log to MongoDB

    // Log to the console or file based on log level
    switch (level) {
      case 'info':
        info(message);
        break;
      case 'warn':
        warn(message);
        break;
      case 'error':
        error(message);
        break;
      case 'debug':
        debug(message);
        break;
      default:
        error(`Unknown log level: ${level}`);
        break;
    }
  } catch (err) {
    error(`Error while saving log: ${err.message}`);
  }
};

// Route to create a log entry manually
router.post('/log', async (req, res) => {
  const { level, message } = req.body;

  if (!level || !message) {
    return res.status(400).json({ message: "Level and message are required" });
  }

  try {
    // Save the log and log it to console/file
    await saveLog(level, message);

    res.status(200).json({ message: "Log entry created successfully." });
  } catch (err) {
    error(`Failed to create log: ${err.message}`);
    res.status(500).json({ message: "Failed to create log", error: err.message });
  }
});

// Example: A route to create an info-level log manually (for testing)
router.post('/info', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    // Create an info-level log
    saveLog('info', message);
    res.status(200).json({ message: "Info log created" });
  } catch (err) {
    error(`Error while creating info log: ${err.message}`);
    res.status(500).json({ message: "Failed to create info log", error: err.message });
  }
});

// Example: A route to create an error-level log manually (for testing)
router.post('/error', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    // Create an error-level log
    saveLog('error', message);
    res.status(200).json({ message: "Error log created" });
  } catch (err) {
    error(`Error while creating error log: ${err.message}`);
    res.status(500).json({ message: "Failed to create error log", error: err.message });
  }
});

module.exports = router;
