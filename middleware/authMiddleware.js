const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  //   console.log(req.headers.authorization?.split(" ")[1]);

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;
