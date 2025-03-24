// Importing the mongoose library to define the schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for the "User" model
const userSchema = new mongoose.Schema({
    // Define the "email" field with type String, required, and unique constraint
    email: {
        type: String,
        required: true, // Ensures that the email is provided when creating a user
        unique: true,   // Ensures that the email is unique across the users in the database
    },

    // Define the "username" field with type String and unique constraint
    name: {
        type: String,
    },

    // Define the "password" field with type String and required constraint
    password: {
        type: String,
        required: true, // Ensures that the password is provided when creating a user
    },
    role : {
        type : String,
    },
    otp: {
         type: String
         }, // Store OTP
    
    otpExpires: {
         type: Date 
        }, // Expiry time for OTP
    customId: {
            type: String,
        },
    contact : {
        type : String,
    },
    assignedTrip : {
        type: String,
    },

}, { timestamps: true });

// Create and export the User model using the defined userSchema
module.exports = mongoose.model("RideUser", userSchema);
