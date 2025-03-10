const router = require("express").Router();
const Vehicle = require("../../models/UserManagment/DriverSchema");


router.get("/vehicle-get-values", async (req, res) => {
    try {
        const vehicle = await Vehicle.find({}).sort({ createdAt: -1 });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving Vehicles", details: error.message });
    }})

router.get("/vehicle-get-values/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ error: "vehicles not found" });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving Vehicles", details: error.message });
    }});

router.put("/vehicle-put-values/:id", async (req, res) => {
    try {
        const { id } = req.params;
    const {make , carType , color , year , owner , licensePlateNo , feul} = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
        id,{make , carType , color , year , owner , licensePlateNo , feul} ,{ new: true }
    )
    if(!vehicle){
        return res.status(404).json({error : "Vehicle not found" })
    }
    res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error updating Vehicles", details: error.message });
    }})

router.delete("/vehicle-delete-values/:id" , async (req , res) => {
    const { id } = req.params;
    try {
        console.log(`Trying to delete user with id: ${id}`);
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if(!vehicle){
            console.log("Vehicle not found");
            return res.status(404).json({ error: "Vehicle not found" });
        }
        console.log(`Vehicle deleted successfully: ${vehicle}`);
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }})
    
module.exports = router;

