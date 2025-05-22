const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");

// Admin Register function

const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Registering Admin: ", { name, email, hashedPassword }); // Debugging output

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    // const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    res.status(201).json({
      msg: "Registered successfully",
      status: true,
      //   token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
      status: false,
    });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  try {
    const admin = await Admin.findOne({ email });
    console.log(admin);

    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password", status: false });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      msg: "Login Successfully",
      status: true,
      token: token,
      data: admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", status: false });
  }
};

module.exports = { adminLogin, adminRegister };
