const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require("dotenv");
const fs = require("fs");

env.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'SMTP', etc.
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSCODE,
  },
});

// Function to send an email using EJS template
async function sendEmailWithEJSTemplate(to, subject, templatePath, templateData) {
  try {
    // Read the EJS template file
    const template = ejs.compile(
      fs.readFileSync(path.join(__dirname, templatePath), 'utf8')
    );

    // Render the template with data
    const html = template(templateData);

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: to,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
}

// Example usage:
// const emailData = {
//   name: 'John Doe',
//   // other template data
// };

module.exports = sendEmailWithEJSTemplate;

// sendEmailWithEJSTemplate(
//   'recipient@example.com',
//   'Example Email Subject',
//   'path/to/your/template.ejs',
//   emailData
// );