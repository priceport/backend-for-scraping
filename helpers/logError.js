const fs = require('fs');
const path = require('path');

// Define the path for the log file
const logFilePath = path.join(__dirname, 'error_log.txt');

// Function to log error to file and console
function logError(err) {
    const timestamp = new Date().toISOString(); // Add timestamp to logs
    const errorMessage = err.message || "Unknown error";
    const errorStack = err.stack || "No stack trace available";
    const logMessage = `[${timestamp}] Error: ${errorMessage}\nStack: ${errorStack}\n`;

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, (fileErr) => {
        if (fileErr) {
            console.error('Error writing to log file:', fileErr);
        }
    });

    // Log the message to the console as well
    console.error(logMessage);
}

module.exports = logError;
