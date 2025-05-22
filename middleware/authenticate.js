const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path to your User model

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const user = await User.findById(decoded.id);
    // console.log("hjhjhhjh", user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = { id: user._id }; // Attach user ID to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
