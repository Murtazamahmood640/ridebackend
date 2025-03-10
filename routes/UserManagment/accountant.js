const router = require("express").Router();
const Accountant = require("../../models/UserManagment/UserSchema");


router.post("/accountant", async (req, res) => {
  try {
    const { name, email, contact, role, customId , accessLevel } = req.body;
    const accountant = new Accountant({ name, email, contact, role, customId , accessLevel });
    await accountant.save();
    res.status(200).json({ accountant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/accountant", async (req, res) => {
    try {
        const accountant = await Accountant.find({ role: "Accountant" }).sort({ createdAt: -1 });
        res.status(200).json(accountant);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving users", details: error.message });
    }
});

router.get("/accountant/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const accountant = await Accountant.findById(id);

        if (!accountant) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(accountant);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user", details: error.message });
    }});

router.put("/accountant/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const { name, email, contact, role, customId , assignedTrip } = req.body;
       const accountant= await Accountant.findByIdAndUpdate(
         id,
         { name, email, contact, role, customId , assignedTrip },
         { new: true });
       if (!accountant) {
         return res.status(404).json({ error: 'Passenger not found' });
       }
       return res.json(accountant);
     } catch (error) {
       console.error(error);
       return res.status(500).json({ error: 'Something went wrong' });
     }});

router.delete("/accountant/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Trying to delete user with id: ${id}`);
        const accountant = await Accountant.findByIdAndDelete(id);
        if (!accountant) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        console.log(`User deleted successfully: ${accountant}`);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
});

module.exports = router;
