const router = require("express").Router();
const User = require("../../models/UserManagment/UserSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "syedmunawarali906@gmail.com", 
    pass: "tsdo zpys wyoc lykh",
  },});

router.post("/createuser", async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    const hashpassword = bcrypt.hashSync(password);
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    let prefix = "";
    if (role === "Admin") {
      prefix = "RideAD";
    } else if (role === "Accountant") {
      prefix = "RideAC";
    } else if (role === "Dispatcher") {
      prefix = "RideD";
    }
    let customId = "";
    if (prefix) {
      const count = await User.countDocuments({ role });
      const nextNumber = count + 1;
      const paddedNumber = String(nextNumber).padStart(3, "0");
      customId = prefix + paddedNumber;
    }
    const user = new User({
      name,
      email,
      password: hashpassword,
      role,
      customId,
    });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/createuser", async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving users", details: error.message });
    }
});

router.get("/createuser/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user", details: error.message });
    }
});

router.put("/createuser/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body; 
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        await user.save();
        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating user", details: error.message });
    }
});

router.delete("/createuser/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Trying to delete user with id: ${id}`);
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        console.log(`User deleted successfully: ${user}`);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Please Sign Up first!" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const currentTime = new Date();
    console.log("Current system time:", currentTime);
    const otp = generateOTP();
    const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000); 
    user.otp = otp;
    user.otpGeneratedAt = currentTime;
    user.otpExpires = otpExpires;
    await user.save();
    console.log(`OTP ${otp} generated at ${currentTime} and expires at ${otpExpires}`);
    const mailOptions = {
      from: "syedmunawarali906@gmail.com",
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP for login is: ${otp}. It was generated at ${currentTime.toLocaleString()} and is valid for 1 minute.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    setTimeout(async () => {
      try {
        const updatedUser = await User.findOne({ email });
        if (updatedUser && String(updatedUser.otp) === String(otp)) {
          await User.findOneAndUpdate(
            { email },
            { $unset: { otp: 1, otpExpires: 1, otpGeneratedAt: 1 } }
          );
          console.log(`OTP for ${email} deleted at ${new Date().toLocaleString()}`);
        }
      } catch (err) {
        console.error("Error deleting OTP:", err);
      }
    }, 60 * 1000);
    res.status(200).json({
      message: "OTP sent to your email",
      email: user.email,
      name: user.name,
      id: user._id,
      role : user.role,
      otpGeneratedAt: currentTime.toISOString(),
      otpExpiresAt: otpExpires.toISOString(),
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.otp || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Resend OTP API
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body; // Email should come from local storage (frontend)

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Remove the old OTP
    user.otp = null;
    user.otpExpires = null;

    // Generate a new OTP
    const otp = generateOTP();
    const currentTime = new Date();
    const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000); // OTP expires in 1 minute

    user.otp = otp;
    user.otpGeneratedAt = currentTime;
    user.otpExpires = otpExpires;

    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "syedmunawarali906@gmail.com",
      to: user.email,
      subject: "Your New OTP Code",
      text: `Your new OTP is: ${otp}. It was generated at ${currentTime.toLocaleString()} and is valid for 1 minute.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Automatically delete OTP after 1 minute
    setTimeout(async () => {
      try {
        const updatedUser = await User.findOne({ email });
        if (updatedUser && String(updatedUser.otp) === String(otp)) {
          await User.findOneAndUpdate(
            { email },
            { $unset: { otp: 1, otpExpires: 1, otpGeneratedAt: 1 } }
          );
          console.log(`OTP for ${email} deleted at ${new Date().toLocaleString()}`);
        }
      } catch (err) {
        console.error("Error deleting OTP:", err);
      }
    }, 60 * 1000);

    res.status(200).json({
      message: "New OTP sent to your email",
      email: user.email,
      name: user.name,
      id: user._id,
      role: user.role,
      otpGeneratedAt: currentTime.toISOString(),
      otpExpiresAt: otpExpires.toISOString(),
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
