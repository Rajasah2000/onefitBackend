// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const cors = require("cors"); // Import cors

// const adminRoutes = require("./routes/adminRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const productRoutes = require("./routes/productRoutes");
// const colorRoutes = require("./routes/colorRoutes");

// dotenv.config();

// const app = express();
// connectDB();

// // Enable CORS for all routes
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://yourfrontenddomain.com"], // Replace with your frontend domains
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(express.json());

// // Routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/category", categoryRoutes);
// app.use("/api/admin/products", productRoutes);
// app.use("/api/admin/color", colorRoutes);

// // Start server
// const PORT = process.env.PORT || 7025;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:3000", "http://yourfrontenddomain.com"], // Replace with your frontend domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Enable parsing JSON body
app.use(express.json());

// Serve static files from the 'public' and 'uploads' directories
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// Multer storage configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Image upload route
app.post("/api/admin/image-upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.send({ status: false, message: "No files were uploaded." });
  }
  const filePath = req.file.path;
  // Generate a URL using the file path
  const fileUrl =
    req.protocol + "://" + req.get("host") + "/" + filePath.replace(/\\/g, "/");
  res.send({
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
