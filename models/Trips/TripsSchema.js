const mongoose = require('mongoose');
 
const Trips = new mongoose.Schema({
 
tripID:{
    type: String,
},
tripPassanger:{
    type: String,
    required: true
},
scheduledDate:{
    type: String,
    required: true
},
tripFare:{
    type: String,
    required: true
},
tripPaymentType:{
    type: String,
},
tripStatus:{
    type: String,
},
tripCurrentDate:{
    type: String,
},
tripDriver:{
    type: String,
},
tripVehicleType:{
    type: String,
},

});
module.exports = mongoose.model('RideTrip', Trips);
   
// tripLocation:{
//     type: String,
// },