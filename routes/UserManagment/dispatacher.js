const router = require("express").Router();
const Dispatcher = require("../../models/UserManagment/UserSchema");

router.post("/dispatcher", async (req, res) => {
  try {
    const { name, email, contact, role, customId , assignedTrip } = req.body;
    const dispatcher = new Dispatcher({ name, email, contact, role, customId , assignedTrip });
    await dispatcher.save();
    res.status(200).json({ dispatcher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }});

router.get("/dispatcher", async (req, res) => {
    try {
        const dispatchers = await Dispatcher.find({ role: "Dispatcher" }).sort({ createdAt: -1 });
        res.status(200).json(dispatchers);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving users", details: error.message });
    }
});

router.get("/dispatcher/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const dispatcher = await Dispatcher.findById(id);
        if (!dispatcher) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(dispatcher);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user", details: error.message });
    }
});

router.put("/dispatcher/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const { name, email, contact, role, customId , assignedTrip } = req.body;
       const dispatcher= await Dispatcher.findByIdAndUpdate(
         id,
         { name, email, contact, role, customId , assignedTrip },
         { new: true }
       );
       if (!dispatcher) {
         return res.status(404).json({ error: 'Passenger not found' });
       }
       return res.json(dispatcher);
     } catch (error) {
       console.error(error);
       return res.status(500).json({ error: 'Something went wrong' });
     }
});

router.delete("/dispatcher/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Trying to delete user with id: ${id}`);
        const dispatcher = await Dispatcher.findByIdAndDelete(id);
        if (!dispatcher) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        console.log(`User deleted successfully: ${dispatcher}`);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }});

module.exports = router;
