const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const colorRoutes = require("./routes/colorRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();
connectDB();

// Enable CORS
app.use(
  cors({
    origin: ["http://65.2.151.249:3000", "http://65.2.151.249"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Allow preflight for all routes
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Upload route
app.post("/api/admin/image-upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: false, message: "No file uploaded." });
  }
  const fileUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/" +
    req.file.path.replace(/\\/g, "/");
  res.json({
    status: true,
    url: fileUrl,
    message: "File uploaded successfully.",
  });
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api/admin/color", colorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 7025;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
