const router = require("express").Router();
const Driver = require('../../models/UserManagment/DriverSchema'); // rename import
 
 
////////////////////////////////////////////////////---CREATE-DRIVER---//////////////////////////////////////////////////////////////////////////
 
 
// CREATE OR UPDATE DRIVER BY ID
router.post("/driverRequest/:id",async (req, res) => {
  try {
    const { id } = req.params;
 
    const {
        driverDeclineReason,
        driverReSubmit
    } = req.body;
 
    const createNewDriver = await Driver.findByIdAndUpdate(
      id,
      {
        driverDeclineReason,
        driverReSubmit
      },
      { new: true }
    );
 
    if (!createNewDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
 
    return res.json(createNewDriver);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
);




//////////////////////////////////////////////////////////---GET-ALL-DRIVER---///////////////////////////////////////////////////////////////////
 
 
// GET ALL DRIVER API
router.get("/driverRequest", async (req, res) => {
    try {
        const driver = await Driver.find({}).sort({ createdAt: -1 });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving drivers', details: error.message });
    }
}
);
 

////////////////////////////////////////////////////---GET-SPECIFIC-DRIVER-BY-ID---/////////////////////////////////////////////////////////////////////////
 
 
// GET SPECIFIC DRIVER API
router.get("/driverRequest/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await Driver.findById(id);
 
        if (!driver) {
            return res.status(404).json({ error: 'User not found' });
        }
 
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving driver', details: error.message });
    }
}
);


module.exports = router;