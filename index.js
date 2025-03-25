const express = require('express');
const dotenv = require('dotenv')
const app = express();
const cors = require("cors");
dotenv.config()
require("./conn/conn")
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const auth = require("./routes/UserManagment/auth")
const userPassenger = require('./routes/UserManagment/userPassenger')
const dispatcher = require('./routes/UserManagment/dispatacher')
const accountant = require('./routes/UserManagment/accountant')
const vehicle = require('./routes/VehicleManagment/Vehicle')
const allDriver = require('./routes/Driver/allDrivers')
const driverRequest = require('./routes/Driver/driverRequest')
const trips = require('./routes/Trips/trips')
const userDriver = require('./routes/UserManagment/userDriver')
const logsRouter  = require('./routes/Logs/LogController')
app.use(express.json())
app.get('/' , (req ,res) =>{
    res.send("Hello") 
});
app.use("/api/viaRide", auth)
app.use("/api/ViaRide", userPassenger)
app.use("/api/ViaRide", userDriver)
app.use("/api/viaRide", dispatcher)
app.use("/api/viaRide", accountant)
app.use("/api/viaRide", vehicle)
app.use("/api/viaRide", allDriver)
app.use("/api/viaRide", driverRequest)
app.use("/api/viaRide", trips)
app.use("/api/viaRide", logsRouter )

const PORT = process.env.PORT || 1000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`) 
}); 
