const fs = require('fs');
const path = require('path');

// Define the path for the log file
const logFilePath = path.join(__dirname, 'invalidInput.txt');

// Function to log error to file and console
function logInvalidInput(err) {
    const timestamp = new Date().toISOString(); // Add timestamp to logs
    const errorMessage = err.text || "Unknown error";
    const errorSource = err.source || "Unknown source";
    const errorType = err.type || "Unknown type";
    const logMessage = `[${timestamp}] Error: ${errorMessage}\nSource: ${errorSource}\nType: ${errorType}\n`;

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, (fileErr) => {
        if (fileErr) {
            console.error('Error writing to log file:', fileErr);
        }
    });

    // Log the message to the console as well
    // console.error(logMessage);
}

module.exports = logInvalidInput;
