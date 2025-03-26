const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure to load your environment variables

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail", // Can be any service like SMTP or SendGrid
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASS, // Use environment variables for sensitive data
  },
});

// Function to send email with a specific template and subject
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      }
      console.log("Email sent:", info.response);
      resolve(info);
    });
  });
};

module.exports = sendEmail;
